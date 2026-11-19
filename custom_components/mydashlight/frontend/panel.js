var tr=Object.defineProperty;var In=(i,t)=>()=>(i&&(t=i(i=0)),t);var nr=(i,t)=>{for(var e in t)tr(i,e,{get:t[e],enumerable:!0})};function En(i){if(typeof i!="string"||!i)throw new Error("expected a non-empty string, got: "+i)}function ki(i){if(typeof i!="number")throw new Error("expected a number, got: "+i)}function xa(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function bo(i){return xa(i,t=>t.unicode)}function wa(i){function t(e,n,o){let s=n?i.createObjectStore(e,{keyPath:n}):i.createObjectStore(e);if(o)for(let[r,[l,d]]of Object.entries(o))s.createIndex(r,l,{multiEntry:d});return s}t(vt),t(it,fa,{[yo]:[ua,!0],[wo]:[[ga,ma]],[$o]:[ba,!0]}),t(Ci,void 0,{[xo]:[""]})}function ko(i,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>i(e.result)}async function $a(i){let t=await new Promise((e,n)=>{let o=indexedDB.open(i,ha);Ei[i]=o,o.onupgradeneeded=s=>{s.oldVersion<pa&&wa(o.result)},ko(e,n,o)});return t.onclose=()=>Si(i),t}function ka(i){return Cn[i]||(Cn[i]=$a(i)),Cn[i]}function De(i,t,e,n){return new Promise((o,s)=>{let r=i.transaction(t,e,{durability:"relaxed"}),l=typeof t=="string"?r.objectStore(t):t.map(h=>r.objectStore(h)),d;n(l,r,h=>{d=h}),r.oncomplete=()=>o(d),r.onerror=()=>s(r.error)})}function Si(i){let t=Ei[i],e=t&&t.result;if(e){e.close();let n=Sn[i];if(n)for(let o of n)o()}delete Ei[i],delete Cn[i],delete Sn[i]}function Ta(i){return new Promise((t,e)=>{Si(i);let n=indexedDB.deleteDatabase(i);ko(t,e,n)})}function Ea(i,t){let e=Sn[i];e||(e=Sn[i]=[]),e.push(t)}function bt(i){return i.split(/[\s_]+/).map(t=>!t.match(/\w/)||_a.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function To(i){return i.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Ca)}function Pa(i){return i.map(({annotation:e,emoticon:n,group:o,order:s,shortcodes:r,skins:l,tags:d,emoji:h,version:p})=>{let a=[...new Set(To([...(r||[]).map(bt).flat(),...(d||[]).map(bt).flat(),...bt(e),n]))].sort(),f={annotation:e,group:o,order:s,tags:d,tokens:a,unicode:h,version:p};if(n&&(f.emoticon=n),r&&(f.shortcodes=r),l){f.skinTones=[],f.skinUnicodes=[],f.skinVersions=[];for(let{tone:w,emoji:k,version:m}of l)f.skinTones.push(w),f.skinUnicodes.push(k),f.skinVersions.push(m)}return f})}function Eo(i,t,e,n){i[t](e).onsuccess=o=>n&&n(o.target.result)}function nt(i,t,e){Eo(i,"get",t,e)}function _o(i,t,e){Eo(i,"getAll",t,e)}function Ai(i){i.commit&&i.commit()}function Sa(i,t){let e=i[0];for(let n=1;n<i.length;n++){let o=i[n];t(e)>t(o)&&(e=o)}return e}function Co(i,t){let e=Sa(i,o=>o.length),n=[];for(let o of e)i.some(s=>s.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Aa(i){return!await Mi(i,vt,Pn)}async function Ma(i,t,e){let[n,o]=await Promise.all([Ti,Pn].map(s=>Mi(i,vt,s)));return n===e&&o===t}async function La(i,t){return De(i,it,xt,(n,o,s)=>{let r,l=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=d=>{let h=d.target.result;for(let p of h)if(r=p.unicode,t(p))return s(p);if(h.length<50)return s();l()}};l()})}async function Po(i,t,e,n){try{let o=Pa(t);await De(i,[it,vt],Pi,([s,r],l)=>{let d,h,p=0;function a(){++p===2&&f()}function f(){if(!(d===n&&h===e)){s.clear();for(let w of o)s.put(w);r.put(n,Ti),r.put(e,Pn),Ai(l)}}nt(r,Ti,w=>{d=w,a()}),nt(r,Pn,w=>{h=w,a()})})}finally{}}async function Da(i,t){return De(i,it,xt,(e,n,o)=>{let s=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);_o(e.index(wo),s,o)})}async function So(i,t){let e=To(bt(t));return e.length?De(i,it,xt,(n,o,s)=>{let r=[],l=()=>{r.length===e.length&&d()},d=()=>{let h=Co(r,p=>p.unicode);s(h.sort((p,a)=>p.order<a.order?-1:1))};for(let h=0;h<e.length;h++){let p=e[h],a=h===e.length-1?IDBKeyRange.bound(p,p+"￿",!1,!0):IDBKeyRange.only(p);_o(n.index(yo),a,f=>{r.push(f),l()})}}):[]}async function Ra(i,t){let e=await So(i,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(s=>s.toLowerCase()).includes(t.toLowerCase()))[0]||null:await La(i,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function ja(i,t){return De(i,it,xt,(e,n,o)=>nt(e,t,s=>{if(s)return o(s);nt(e.index($o),t,r=>o(r||null))}))}function Mi(i,t,e){return De(i,t,xt,(n,o,s)=>nt(n,e,s))}function Ia(i,t,e,n){return De(i,t,Pi,(o,s)=>{o.put(n,e),Ai(s)})}function za(i,t){return De(i,Ci,Pi,(e,n)=>nt(e,t,o=>{e.put((o||0)+1,t),Ai(n)}))}function Oa(i,t,e){return e===0?[]:De(i,[Ci,it],xt,([n,o],s,r)=>{let l=[];n.index(xo).openCursor(void 0,"prev").onsuccess=d=>{let h=d.target.result;if(!h)return r(l);function p(w){if(l.push(w),l.length===e)return r(l);h.continue()}let a=h.primaryKey,f=t.byName(a);if(f)return p(f);nt(o,a,w=>{if(w)return p(w);h.continue()})}})}function Ba(i,t){let e=new Map;for(let o of i){let s=t(o);for(let r of s){let l=e;for(let h=0;h<r.length;h++){let p=r.charAt(h),a=l.get(p);a||(a=new Map,l.set(p,a)),l=a}let d=l.get(_n);d||(d=[],l.set(_n,d)),d.push(o)}}return(o,s)=>{let r=e;for(let h=0;h<o.length;h++){let p=o.charAt(h),a=r.get(p);if(a)r=a;else return[]}if(s)return r.get(_n)||[];let l=[],d=[r];for(;d.length;){let p=[...d.shift().entries()].sort((a,f)=>a[0]<f[0]?-1:1);for(let[a,f]of p)a===_n?l.push(...f):d.push(f)}return l}}function Ha(i){let t=i&&Array.isArray(i),e=t&&i.length&&(!i[0]||Na.some(n=>!(n in i[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function vo(i){Ha(i);let t=(f,w)=>f.name.toLowerCase()<w.name.toLowerCase()?-1:1,e=i.sort(t),o=Ba(i,f=>{let w=new Set;if(f.shortcodes)for(let k of f.shortcodes)for(let m of bt(k))w.add(m);return w}),s=f=>o(f,!0),r=f=>o(f,!1),l=f=>{let w=bt(f),k=w.map((m,$)=>($<w.length-1?s:r)(m));return Co(k,m=>m.name).sort(t)},d=new Map,h=new Map;for(let f of i){h.set(f.name.toLowerCase(),f);for(let w of f.shortcodes||[])d.set(w.toLowerCase(),f)}return{all:e,search:l,byShortcode:f=>d.get(f.toLowerCase()),byName:f=>h.get(f.toLowerCase())}}function Ht(i){if(!i)return i;if(Fa&&(i=structuredClone(i)),delete i.tokens,i.skinTones){let t=i.skinTones.length;i.skins=Array(t);for(let e=0;e<t;e++)i.skins[e]={tone:i.skinTones[e],unicode:i.skinUnicodes[e],version:i.skinVersions[e]};delete i.skinTones,delete i.skinUnicodes,delete i.skinVersions}return i}function Ao(i){i||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Wa(i){if(!i||!Array.isArray(i)||!i[0]||typeof i[0]!="object"||Ua.some(t=>!(t in i[0])))throw new Error("Emoji data is in the wrong format")}function Mo(i,t){if(Math.floor(i.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+i.status)}async function Ka(i){let t=await fetch(i,{method:"HEAD"});Mo(t,i);let e=t.headers.get("etag");return Ao(e),e}async function _i(i){let t=await fetch(i);Mo(t,i);let e=t.headers.get("etag");Ao(e);let n=await t.json();return Wa(n),[e,n]}function Va(i){for(var t="",e=new Uint8Array(i),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Ga(i){for(var t=i.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=i.charCodeAt(o);return e}async function Lo(i){let t=JSON.stringify(i),e=Ga(t),n=await crypto.subtle.digest("SHA-1",e),o=Va(n);return btoa(o)}async function qa(i,t){let e,n=await Ka(t);if(!n){let o=await _i(t);n=o[0],e=o[1],n||(n=await Lo(e))}await Ma(i,t,n)||(e||(e=(await _i(t))[1]),await Po(i,e,t,n))}async function Ya(i,t){let[e,n]=await _i(t);e||(e=await Lo(n)),await Po(i,n,t,e)}async function Xa(i,t){try{await qa(i,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var ha,pa,it,vt,Ci,ua,yo,fa,xo,ga,ma,wo,Ti,Pn,mo,xt,Pi,$o,ba,va,ya,Ei,Cn,Sn,_a,Ca,_n,Na,Fa,Ua,yt,Li=In(()=>{ha=1,pa=1,it="emoji",vt="keyvalue",Ci="favorites",ua="tokens",yo="tokens",fa="unicode",xo="count",ga="group",ma="order",wo="group-order",Ti="eTag",Pn="url",mo="skinTone",xt="readonly",Pi="readwrite",$o="skinUnicodes",ba="skinUnicodes",va="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",ya="en";Ei={},Cn={},Sn={};_a=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Ca=2;_n="";Na=["name","url"];Fa=typeof wrappedJSObject<"u";Ua=["annotation","emoji","group","order","version"];yt=class{constructor({dataSource:t=va,locale:e=ya,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=vo(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await ka(this._dbName);Ea(this._dbName,this._clear);let e=this.dataSource;await Aa(t)?await Ya(t,e):this._lazyUpdate=Xa(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return ki(t),await this.ready(),bo(await Da(this._db,t)).map(Ht)}async getEmojiBySearchQuery(t){En(t),await this.ready();let e=this._custom.search(t),n=bo(await So(this._db,t)).map(Ht);return[...e,...n]}async getEmojiByShortcode(t){En(t),await this.ready();let e=this._custom.byShortcode(t);return e||Ht(await Ra(this._db,t))}async getEmojiByUnicodeOrName(t){En(t),await this.ready();let e=this._custom.byName(t);return e||Ht(await ja(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Mi(this._db,vt,mo)||0}async setPreferredSkinTone(t){return ki(t),await this.ready(),Ia(this._db,vt,mo,t)}async incrementFavoriteEmojiCount(t){return En(t),await this.ready(),za(this._db,t)}async getTopFavoriteEmoji(t){return ki(t),await this.ready(),(await Oa(this._db,this._custom,t)).map(Ht)}set customEmoji(t){this._custom=vo(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Si(this._dbName)}async delete(){await this._shutdown(),await Ta(this._dbName)}}});function Ro(i){return i.unicode.includes("‍")}function ol(i){let t=jo(i,"#000"),e=jo(i,"#fff");return t&&e&&sl(t,e)}function rl(){let i=Object.entries(Ja);try{for(let[t,e]of i)if(ol(t))return e}catch{}finally{}return i[0][1]}function pl(i,t){if(t===0)return i;let e=i.indexOf(dl);return e!==-1?i.substring(0,e)+String.fromCodePoint(cl+t-1)+i.substring(e):(i.endsWith(al)&&(i=i.substring(0,i.length-1)),i+ll+String.fromCodePoint(hl+t-1))}function _e(i){i.preventDefault(),i.stopPropagation()}function Ii(i,t,e){return t+=i?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Wo(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function ul(i,t){let e=n=>{let o={};for(let s of n)typeof s.tone=="number"&&s.version<=t&&(o[s.tone]=s.unicode);return o};return i.map(({unicode:n,skins:o,shortcodes:s,url:r,name:l,category:d,annotation:h})=>({unicode:n,name:l,shortcodes:s,url:r,category:d,annotation:h,id:n||l,skins:o&&e(o)}))}function gl(i,t,e){let n;fl?(n=new ResizeObserver(e),n.observe(i)):Mn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Io(i){{let t=document.createRange();return t.selectNode(i.firstChild),t.getBoundingClientRect().width}}function zo(i,t,e){let n=Io(t);if(!n){if(!st){st=e.cloneNode(!0);let o=getComputedStyle(e);for(let s of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])st.style.setProperty(s,o.getPropertyValue(s),"important")}try{return document.body.appendChild(st),st.firstChild.nodeValue=i,Io(st)}finally{st.remove()}}return n}function bl(i,t,e){let n=!0;for(let o of i){let s=e(o);if(!s)continue;typeof zi>"u"&&(zi=zo(ml,t,t));let l=zo(o.unicode,s,t)/1.8<zi;Hi.set(o.unicode,l),l||(n=!1)}return n}function vl(i){return Wo(i,t=>t)}function yl(i){i&&(i.scrollTop=0)}function Ft(i,t,e){let n=i.get(t);return n||(n=e(),i.set(t,n)),n}function Oo(i){return""+i}function xl(i){let t=document.createElement("template");return t.innerHTML=i,t}function El(i,t){Tl?i.replaceChildren(...t):(i.innerHTML="",i.append(...t))}function _l(i,t){let e=i.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Cl(i,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=_l(n,i):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&El(n,i)}function Pl(i,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:s,attributeName:r,attributeValuePre:l,attributeValuePost:d}}=e,h=i[s];if(o!==h)if(e.currentExpression=h,r)if(h===null)n.removeAttribute(r);else{let p=l+Oo(h)+d;n.setAttribute(r,p)}else{let p;Array.isArray(h)?Cl(h,e):h instanceof Element?(p=h,n.replaceWith(p)):n.nodeValue=Oo(h),p&&(e.targetNode=p)}}}function Sl(i){let t="",e=!1,n=!1,o=-1,s=new Map,r=[],l=0;for(let h=0,p=i.length;h<p;h++){let a=i[h];if(t+=a.slice(l),h===p-1)break;for(let g=0;g<a.length;g++)switch(a.charAt(g)){case"<":{a.charAt(g+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let f=r[r.length-1],w=Ft(s,f,()=>[]),k,m,$;if(n){let g=/(\S+)="?([^"=]*)$/.exec(a);k=g[1],m=g[2];let T=/^([^">]*)("?)/.exec(i[h+1]);$=T[1],t=t.slice(0,-1*g[0].length),l=T[0].length}else l=0;let _={attributeName:k,attributeValuePre:m,attributeValuePost:$,expressionIndex:h};w.push(_),!e&&!n&&(t+=" ")}return{template:xl(t),elementsToBindings:s}}function Bo(i,t,e){for(let n=0;n<i.length;n++){let o=i[n],s=o.attributeName?t:t.firstChild,r={binding:o,targetNode:s,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Al(i,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Bo(n,i,e);else{let o=document.createTreeWalker(i,NodeFilter.SHOW_ELEMENT),s=i,r=-1;do{let l=t.get(++r);l&&Bo(l,s,e)}while(s=o.nextNode())}return e}function Ml(i){let{template:t,elementsToBindings:e}=Ft(wl,i,()=>Sl(i)),n=t.cloneNode(!0).content.firstElementChild,o=Al(n,e);return function(r){return Pl(r,o),n}}function Ll(i){let t=Ft($l,i,()=>new Map),e=kl;function n(s,...r){let l=Ft(t,s,()=>new Map);return Ft(l,e,()=>Ml(s))(r)}function o(s,r,l){return s.map((d,h)=>{let p=e;e=l(d);try{return r(d,h)}finally{e=p}})}return{map:o,html:n}}function Dl(i,t,e,n,o,s,r,l,d){let{labelWithSkin:h,titleForEmoji:p,unicodeWithSkin:a}=e,{html:f,map:w}=Ll(t);function k(g,T,L){return w(g,(N,te)=>f`<button role="${T?"option":"menuitem"}" aria-selected="${T?te===t.activeSearchItem:null}" aria-label="${h(N,t.currentSkinTone)}" title="${p(N)}" class="${"emoji"+(T&&te===t.activeSearchItem?" active":"")+(N.unicode?"":" custom-emoji")}" id="${`${L}-${N.id}`}" style="${N.unicode?null:`--custom-emoji-background: url(${JSON.stringify(N.url)})`}">${N.unicode?a(N,t.currentSkinTone):""}</button>`,N=>`${L}-${N.id}`)}let $=f`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${w(t.skinTones,(g,T)=>f`<div id="skintone-${T}" class="emoji ${T===t.activeSkinTone?"active":""}" aria-selected="${T===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[T]}" aria-label="${t.i18n.skinTones[T]}">${g}</div>`,g=>g)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${w(t.groups,g=>f`<button role="tab" class="nav-button" aria-controls="tab-${g.id}" aria-label="${t.i18n.categories[g.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===g.id}" title="${t.i18n.categories[g.name]}" data-group-id="${g.id}"><div class="nav-emoji emoji">${g.emoji}</div></button>`,g=>g.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${w(t.currentEmojisWithCategories,(g,T)=>f`<div><div id="menu-label-${T}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:g.category?g.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${T!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(g.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${T}" id="${t.searchMode?"search-results":null}">${k(g.emojis,t.searchMode,"emo")}</div></div>`,g=>g.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${k(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,_=(g,T)=>{for(let L of i.querySelectorAll(`[${g}]`))T(L,L.getAttribute(g))};if(d){i.appendChild($);for(let g of["click","focusout","input","keydown","keyup"])_(`data-on-${g}`,(T,L)=>{T.addEventListener(g,n[L])});_("data-ref",(g,T)=>{s[T]=g}),r.addEventListener("abort",()=>{i.removeChild($)})}_("data-action",(g,T)=>{let L=l.get(T);L||l.set(T,L=new WeakSet),L.has(g)||(L.add(g),o[T](g))})}function Rl(i){let t=!1,e,n=new Map,o=new Set,s,r=()=>{if(t)return;let h=[...o];o.clear();try{for(let p of h)p()}finally{s=!1,o.size&&(s=!0,Ln(r))}},l=new Proxy({},{get(h,p){if(e){let a=n.get(p);a||(a=new Set,n.set(p,a)),a.add(e)}return h[p]},set(h,p,a){if(h[p]!==a){h[p]=a;let f=n.get(p);if(f){for(let w of f)o.add(w);s||(s=!0,Ln(r))}}return!0}}),d=h=>{let p=()=>{let a=e;e=p;try{return h()}finally{e=a}};return p()};return i.addEventListener("abort",()=>{t=!0}),{state:l,createEffect:d}}function Oi(i,t,e){if(i.length!==t.length)return!1;for(let n=0;n<i.length;n++)if(!e(i[n],t[n]))return!1;return!0}function jl(i,t,e){{let n=i.closest(".tabpanel"),o=No.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),No.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(i)}}function Il(i,t){let e={},n=new AbortController,o=n.signal,{state:s,createEffect:r}=Rl(o),l=new Map;An(s,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),An(s,t),An(s,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:tl,isRtl:!1,currentGroupIndex:0,groups:Di,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{s.currentGroup!==s.groups[s.currentGroupIndex]&&(s.currentGroup=s.groups[s.currentGroupIndex])});let d=c=>{i.getElementById(c).focus()},h=c=>i.getElementById(`emo-${c.id}`),p=(c,v)=>{e.rootElement.dispatchEvent(new CustomEvent(c,{detail:v,bubbles:!0,composed:!0}))},a=(c,v)=>c.id===v.id,f=(c,v)=>{let{category:b,emojis:y}=c,{category:P,emojis:S}=v;return b!==P?!1:Oi(y,S,a)},w=c=>{Oi(s.currentEmojis,c,a)||(s.currentEmojis=c)},k=c=>{s.searchMode!==c&&(s.searchMode=c)},m=c=>{Oi(s.currentEmojisWithCategories,c,f)||(s.currentEmojisWithCategories=c)},$=(c,v)=>v&&c.skins&&c.skins[v]||c.unicode,T={labelWithSkin:(c,v)=>vl([c.name||$(c,v),c.annotation,...c.shortcodes||Bi].filter(Boolean)).join(", "),titleForEmoji:c=>c.annotation||(c.shortcodes||Bi).join(", "),unicodeWithSkin:$},L={onClickSkinToneButton:pe,onEmojiClick:ne,onNavClick:Ie,onNavKeydown:Fe,onSearchKeydown:He,onSkinToneOptionsClick:G,onSkinToneOptionsFocusOut:ue,onSkinToneOptionsKeydown:re,onSkinToneOptionsKeyup:We,onSearchInput:Pe},N={calculateEmojiGridStyle:H,updateOnIntersection:Ce},te=!0;r(()=>{Dl(i,s,T,L,N,e,o,l,te),te=!1}),s.emojiVersion||ji().then(c=>{c||(s.message=s.i18n.emojiUnsupportedMessage)}),r(()=>{async function c(){let v=!1,b=setTimeout(()=>{v=!0,s.message=s.i18n.loadingMessage},Qa);try{await s.database.ready(),s.databaseLoaded=!0}catch(y){console.error(y),s.message=s.i18n.networkErrorMessage}finally{clearTimeout(b),v&&(v=!1,s.message="")}}s.database&&c()}),r(()=>{s.pickerStyle=`
      --num-groups: ${s.groups.length}; 
      --indicator-opacity: ${s.searchMode?0:1}; 
      --num-skintones: ${Do};`}),r(()=>{s.customEmoji&&s.database&&ae()}),r(()=>{s.customEmoji&&s.customEmoji.length?s.groups!==Ni&&(s.groups=Ni):s.groups!==Di&&(s.currentGroupIndex&&s.currentGroupIndex--,s.groups=Di)}),r(()=>{async function c(){s.databaseLoaded&&(s.currentSkinTone=await s.database.getPreferredSkinTone())}c()}),r(()=>{s.skinTones=Array(Do).fill().map((c,v)=>pl(s.skinToneEmoji,v))}),r(()=>{s.skinToneButtonText=s.skinTones[s.currentSkinTone]}),r(()=>{s.skinToneButtonLabel=s.i18n.skinToneLabel.replace("{skinTone}",s.i18n.skinTones[s.currentSkinTone])}),r(()=>{async function c(){let{database:v}=s,b=(await Promise.all(nl.map(y=>v.getEmojiByUnicodeOrName(y)))).filter(Boolean);s.defaultFavoriteEmojis=b}s.databaseLoaded&&c()});function ae(){let{customEmoji:c,database:v}=s,b=c||Bi;v.customEmoji!==b&&(v.customEmoji=b)}r(()=>{async function c(){ae();let{database:v,defaultFavoriteEmojis:b,numColumns:y}=s,P=await v.getTopFavoriteEmoji(y),S=await le(Wo([...P,...b],M=>M.unicode||M.name).slice(0,y));s.currentFavorites=S}s.databaseLoaded&&s.defaultFavoriteEmojis&&c()});function H(c){gl(c,o,()=>{{let v=getComputedStyle(e.rootElement),b=parseInt(v.getPropertyValue("--num-columns"),10),y=v.getPropertyValue("direction")==="rtl";s.numColumns=b,s.isRtl=y}})}function Ce(c){jl(c,o,v=>{for(let{target:b,isIntersecting:y}of v)b.classList.toggle("onscreen",y)})}r(()=>{async function c(){let{searchText:v,currentGroup:b,databaseLoaded:y,customEmoji:P}=s;if(!y)s.currentEmojis=[],s.searchMode=!1;else if(v.length>=Za){let S=await je(v);s.searchText===v&&(w(S),k(!0))}else{let{id:S}=b;if(S!==-1||P&&P.length){let M=await Re(S);s.currentGroup.id===S&&(w(M),k(!1))}}}c()});let ge=()=>{Mn(()=>yl(e.tabpanelElement))};r(()=>{let{currentEmojis:c,emojiVersion:v}=s,b=c.filter(y=>y.unicode).filter(y=>Ro(y)&&!Hi.has(y.unicode));if(!v&&b.length)w(c),Mn(()=>Be(b));else{let y=v?c:c.filter(ve);w(y),ge()}});function Be(c){bl(c,e.baselineEmoji,h)?ge():s.currentEmojis=[...s.currentEmojis]}function ve(c){return!c.unicode||!Ro(c)||Hi.get(c.unicode)}async function Ne(c){let v=s.emojiVersion||await ji();return c.filter(({version:b})=>!b||b<=v)}async function le(c){return ul(c,s.emojiVersion||await ji())}async function Re(c){let v=c===-1?s.customEmoji:await s.database.getEmojiByGroup(c);return le(await Ne(v))}async function je(c){return le(await Ne(await s.database.getEmojiBySearchQuery(c)))}r(()=>{}),r(()=>{function c(){let{searchMode:b,currentEmojis:y}=s;if(b)return[{category:"",emojis:y}];let P=new Map;for(let S of y){let M=S.category||"",z=P.get(M);z||(z=[],P.set(M,z)),z.push(S)}return[...P.entries()].map(([S,M])=>({category:S,emojis:M})).sort((S,M)=>s.customCategorySorting(S.category,M.category))}let v=c();m(v)}),r(()=>{s.activeSearchItemId=s.activeSearchItem!==-1&&s.currentEmojis[s.activeSearchItem].id}),r(()=>{let{rawSearchText:c}=s;Fo(()=>{s.searchText=(c||"").trim(),s.activeSearchItem=-1})});function He(c){if(!s.searchMode||!s.currentEmojis.length)return;let v=b=>{_e(c),s.activeSearchItem=Ii(b,s.activeSearchItem,s.currentEmojis)};switch(c.key){case"ArrowDown":return v(!1);case"ArrowUp":return v(!0);case"Enter":if(s.activeSearchItem===-1)s.activeSearchItem=0;else return _e(c),Ue(s.currentEmojis[s.activeSearchItem].id)}}function Ie(c){let{target:v}=c,b=v.closest(".nav-button");if(!b)return;let y=parseInt(b.dataset.groupId,10);e.searchElement.value="",s.rawSearchText="",s.searchText="",s.activeSearchItem=-1,s.currentGroupIndex=s.groups.findIndex(P=>P.id===y)}function Fe(c){let{target:v,key:b}=c,y=P=>{P&&(_e(c),P.focus())};switch(b){case"ArrowLeft":return y(v.previousElementSibling);case"ArrowRight":return y(v.nextElementSibling);case"Home":return y(v.parentElement.firstElementChild);case"End":return y(v.parentElement.lastElementChild)}}async function ze(c){let v=await s.database.getEmojiByUnicodeOrName(c),b=[...s.currentEmojis,...s.currentFavorites].find(P=>P.id===c),y=b.unicode&&$(b,s.currentSkinTone);return await s.database.incrementFavoriteEmojiCount(c),{emoji:v,skinTone:s.currentSkinTone,...y&&{unicode:y},...b.name&&{name:b.name}}}async function Ue(c){let v=ze(c);p("emoji-click-sync",v),p("emoji-click",await v)}function ne(c){let{target:v}=c;if(!v.classList.contains("emoji"))return;_e(c);let b=v.id.substring(4);Ue(b)}function ye(c){s.currentSkinTone=c,s.skinTonePickerExpanded=!1,d("skintone-button"),p("skin-tone-change",{skinTone:c}),s.database.setPreferredSkinTone(c)}function G(c){let{target:{id:v}}=c,b=v&&v.match(/^skintone-(\d)/);if(!b)return;_e(c);let y=parseInt(b[1],10);ye(y)}function pe(c){s.skinTonePickerExpanded=!s.skinTonePickerExpanded,s.activeSkinTone=s.currentSkinTone,s.skinTonePickerExpanded&&(_e(c),Mn(()=>d("skintone-list")))}r(()=>{s.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{s.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):s.skinTonePickerExpandedAfterAnimation=!1});function re(c){if(!s.skinTonePickerExpanded)return;let v=async b=>{_e(c),s.activeSkinTone=b};switch(c.key){case"ArrowUp":return v(Ii(!0,s.activeSkinTone,s.skinTones));case"ArrowDown":return v(Ii(!1,s.activeSkinTone,s.skinTones));case"Home":return v(0);case"End":return v(s.skinTones.length-1);case"Enter":return _e(c),ye(s.activeSkinTone);case"Escape":return _e(c),s.skinTonePickerExpanded=!1,d("skintone-button")}}function We(c){if(s.skinTonePickerExpanded)switch(c.key){case" ":return _e(c),ye(s.activeSkinTone)}}async function ue(c){let{relatedTarget:v}=c;(!v||v.id!=="skintone-list")&&(s.skinTonePickerExpanded=!1)}function Pe(c){s.rawSearchText=c.target.value}return{$set(c){An(s,c)},$destroy(){n.abort()}}}function Ho(i){i instanceof ot||Object.setPrototypeOf(i,customElements.get(i.tagName.toLowerCase()).prototype)}var Ni,Di,Za,Do,Fo,Ja,Qa,el,tl,nl,Uo,il,jo,sl,Ri,ji,Hi,al,ll,dl,cl,hl,Mn,fl,ml,zi,st,wl,$l,kl,Tl,Ln,No,Bi,An,zl,Ol,Bl,Nl,Ko,Hl,ot,Vo,Go=In(()=>{Li();Ni=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([i,t,e])=>({id:i,emoji:t,name:e})),Di=Ni.slice(1),Za=2,Do=6,Fo=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Ja={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Qa=1e3,el="🖐️",tl=8,nl=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Uo='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',il=(i,t)=>i<t?-1:i>t?1:0,jo=(i,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Uo}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(i,0,0),n.getImageData(0,0,1,1).data},sl=(i,t)=>{let e=[...i].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ji=()=>(Ri||(Ri=new Promise(i=>Fo(()=>i(rl())))),Ri),Hi=new Map,al="️",ll="\uD83C",dl="‍",cl=127995,hl=57339;Mn=requestAnimationFrame,fl=typeof ResizeObserver=="function";ml="😀";wl=new WeakMap,$l=new WeakMap,kl=Symbol("un-keyed"),Tl="replaceChildren"in Element.prototype;Ln=typeof queueMicrotask=="function"?queueMicrotask:i=>Promise.resolve().then(i);No=new WeakMap;Bi=[],{assign:An}=Object;zl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Ol="en",Bl={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Nl=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Ko=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Hl=`:host{--emoji-font-family:${Uo}}`,ot=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Nl+Hl,this.shadowRoot.appendChild(e),this._ctx={locale:Ol,dataSource:zl,skinToneEmoji:el,customCategorySorting:il,customEmoji:null,i18n:Bl,emojiVersion:null,...t};for(let n of Ko)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Ho(this),this._cmp||(this._cmp=Il(this.shadowRoot,this._ctx))}disconnectedCallback(){Ho(this),Ln(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,s)=>s.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new yt({locale:t,dataSource:e}))}_dbFlush(){Ln(()=>this._dbCreate())}},Vo={};for(let i of Ko)Vo[i]={get(){return i==="database"&&this._dbCreate(),this._ctx[i]},set(t){if(i==="database")throw new Error("database is read-only");this._set(i,t)}};Object.defineProperties(ot.prototype,Vo);customElements.get("emoji-picker")||customElements.define("emoji-picker",ot)});var qo={};nr(qo,{Database:()=>yt,Picker:()=>ot});var Yo=In(()=>{Go();Li()});var Yt=globalThis,Xt=Yt.ShadowRoot&&(Yt.ShadyCSS===void 0||Yt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zn=Symbol(),Ji=new WeakMap,Tt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==zn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Xt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ji.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ji.set(e,t))}return t}toString(){return this.cssText}},Qi=i=>new Tt(typeof i=="string"?i:i+"",void 0,zn),Ke=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[s+1],i[0]);return new Tt(e,i,zn)},es=(i,t)=>{if(Xt)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Yt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,i.appendChild(n)}},On=Xt?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Qi(e)})(i):i;var{is:ir,defineProperty:sr,getOwnPropertyDescriptor:or,getOwnPropertyNames:rr,getOwnPropertySymbols:ar,getPrototypeOf:lr}=Object,Zt=globalThis,ts=Zt.trustedTypes,dr=ts?ts.emptyScript:"",cr=Zt.reactiveElementPolyfillSupport,Et=(i,t)=>i,Bn={toAttribute(i,t){switch(t){case Boolean:i=i?dr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},is=(i,t)=>!ir(i,t),ns={attribute:!0,type:String,converter:Bn,reflect:!1,useDefault:!1,hasChanged:is};Symbol.metadata??=Symbol("metadata"),Zt.litPropertyMetadata??=new WeakMap;var Se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ns){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&sr(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:s}=or(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let l=o?.call(this);s?.call(this,r),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ns}static _$Ei(){if(this.hasOwnProperty(Et("elementProperties")))return;let t=lr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Et("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Et("properties"))){let e=this.properties,n=[...rr(e),...ar(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(On(o))}else t!==void 0&&e.push(On(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return es(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let s=(n.converter?.toAttribute!==void 0?n.converter:Bn).toAttribute(e,n.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let s=n.getPropertyOptions(o),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Bn;this._$Em=o;let l=r.fromAttribute(e,s.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(t,e,n,o=!1,s){if(t!==void 0){let r=this.constructor;if(o===!1&&(s=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??is)(s,e)||n.useDefault&&n.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:s},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),s!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,s]of n){let{wrapped:r}=s,l=this[o];r!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,s,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Se.elementStyles=[],Se.shadowRootOptions={mode:"open"},Se[Et("elementProperties")]=new Map,Se[Et("finalized")]=new Map,cr?.({ReactiveElement:Se}),(Zt.reactiveElementVersions??=[]).push("2.1.2");var Hn=globalThis,ss=i=>i,Jt=Hn.trustedTypes,os=Jt?Jt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Fn="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,Un="?"+Ae,hr=`<${Un}>`,qe=document,Ct=()=>qe.createComment(""),Pt=i=>i===null||typeof i!="object"&&typeof i!="function",Wn=Array.isArray,hs=i=>Wn(i)||typeof i?.[Symbol.iterator]=="function",Nn=`[ 	
\f\r]`,_t=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rs=/-->/g,as=/>/g,Ve=RegExp(`>|${Nn}(?:([^\\s"'>=/]+)(${Nn}*=${Nn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ls=/'/g,ds=/"/g,ps=/^(?:script|style|textarea|title)$/i,Kn=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),u=Kn(1),Y=Kn(2),dd=Kn(3),Me=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),cs=new WeakMap,Ge=qe.createTreeWalker(qe,129);function us(i,t){if(!Wn(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return os!==void 0?os.createHTML(t):t}var fs=(i,t)=>{let e=i.length-1,n=[],o,s=t===2?"<svg>":t===3?"<math>":"",r=_t;for(let l=0;l<e;l++){let d=i[l],h,p,a=-1,f=0;for(;f<d.length&&(r.lastIndex=f,p=r.exec(d),p!==null);)f=r.lastIndex,r===_t?p[1]==="!--"?r=rs:p[1]!==void 0?r=as:p[2]!==void 0?(ps.test(p[2])&&(o=RegExp("</"+p[2],"g")),r=Ve):p[3]!==void 0&&(r=Ve):r===Ve?p[0]===">"?(r=o??_t,a=-1):p[1]===void 0?a=-2:(a=r.lastIndex-p[2].length,h=p[1],r=p[3]===void 0?Ve:p[3]==='"'?ds:ls):r===ds||r===ls?r=Ve:r===rs||r===as?r=_t:(r=Ve,o=void 0);let w=r===Ve&&i[l+1].startsWith("/>")?" ":"";s+=r===_t?d+hr:a>=0?(n.push(h),d.slice(0,a)+Fn+d.slice(a)+Ae+w):d+Ae+(a===-2?l:w)}return[us(i,s+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},St=class i{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let s=0,r=0,l=t.length-1,d=this.parts,[h,p]=fs(t,e);if(this.el=i.createElement(h,n),Ge.currentNode=this.el.content,e===2||e===3){let a=this.el.content.firstChild;a.replaceWith(...a.childNodes)}for(;(o=Ge.nextNode())!==null&&d.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let a of o.getAttributeNames())if(a.endsWith(Fn)){let f=p[r++],w=o.getAttribute(a).split(Ae),k=/([.?@])?(.*)/.exec(f);d.push({type:1,index:s,name:k[2],strings:w,ctor:k[1]==="."?en:k[1]==="?"?tn:k[1]==="@"?nn:Xe}),o.removeAttribute(a)}else a.startsWith(Ae)&&(d.push({type:6,index:s}),o.removeAttribute(a));if(ps.test(o.tagName)){let a=o.textContent.split(Ae),f=a.length-1;if(f>0){o.textContent=Jt?Jt.emptyScript:"";for(let w=0;w<f;w++)o.append(a[w],Ct()),Ge.nextNode(),d.push({type:2,index:++s});o.append(a[f],Ct())}}}else if(o.nodeType===8)if(o.data===Un)d.push({type:2,index:s});else{let a=-1;for(;(a=o.data.indexOf(Ae,a+1))!==-1;)d.push({type:7,index:s}),a+=Ae.length-1}s++}}static createElement(t,e){let n=qe.createElement("template");return n.innerHTML=t,n}};function Ye(i,t,e=i,n){if(t===Me)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,s=Pt(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(i),o._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Ye(i,o._$AS(i,t.values),o,n)),t}var Qt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??qe).importNode(e,!0);Ge.currentNode=o;let s=Ge.nextNode(),r=0,l=0,d=n[0];for(;d!==void 0;){if(r===d.index){let h;d.type===2?h=new at(s,s.nextSibling,this,t):d.type===1?h=new d.ctor(s,d.name,d.strings,this,t):d.type===6&&(h=new sn(s,this,t)),this._$AV.push(h),d=n[++l]}r!==d?.index&&(s=Ge.nextNode(),r++)}return Ge.currentNode=qe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},at=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ye(this,t,e),Pt(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==Me&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):hs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&Pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(qe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=St.createElement(us(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let s=new Qt(o,this),r=s.u(this.options);s.p(e),this.T(r),this._$AH=s}}_$AC(t){let e=cs.get(t.strings);return e===void 0&&cs.set(t.strings,e=new St(t)),e}k(t){Wn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let s of t)o===e.length?e.push(n=new i(this.O(Ct()),this.O(Ct()),this,this.options)):n=e[o],n._$AI(s),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=ss(t).nextSibling;ss(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Xe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,s){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=x}_$AI(t,e=this,n,o){let s=this.strings,r=!1;if(s===void 0)t=Ye(this,t,e,0),r=!Pt(t)||t!==this._$AH&&t!==Me,r&&(this._$AH=t);else{let l=t,d,h;for(t=s[0],d=0;d<s.length-1;d++)h=Ye(this,l[n+d],e,d),h===Me&&(h=this._$AH[d]),r||=!Pt(h)||h!==this._$AH[d],h===x?t=x:t!==x&&(t+=(h??"")+s[d+1]),this._$AH[d]=h}r&&!o&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},en=class extends Xe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},tn=class extends Xe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},nn=class extends Xe{constructor(t,e,n,o,s){super(t,e,n,o,s),this.type=5}_$AI(t,e=this){if((t=Ye(this,t,e,0)??x)===Me)return;let n=this._$AH,o=t===x&&n!==x||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==x&&(n===x||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},sn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Ye(this,t)}},gs={M:Fn,P:Ae,A:Un,C:1,L:fs,R:Qt,D:hs,V:Ye,I:at,H:Xe,N:tn,U:nn,B:en,F:sn},pr=Hn.litHtmlPolyfillSupport;pr?.(St,at),(Hn.litHtmlVersions??=[]).push("3.3.3");var ms=(i,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let s=e?.renderBefore??null;n._$litPart$=o=new at(t.insertBefore(Ct(),s),s,void 0,e??{})}return o._$AI(i),o};var Vn=globalThis,fe=class extends Se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ms(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Me}};fe._$litElement$=!0,fe.finalized=!0,Vn.litElementHydrateSupport?.({LitElement:fe});var ur=Vn.litElementPolyfillSupport;ur?.({LitElement:fe});(Vn.litElementVersions??=[]).push("4.2.2");var lt="mydashlight",$d=`/api/${lt}/pair`,kd=`/api/${lt}/pair/poll`,Td=`/${lt}`,At="pair";function bs(i){return i.length>4?`${i.slice(0,4)}-${i.slice(4)}`:i}function Gn(i){return i.toUpperCase().replace(/[^A-Z0-9]/g,"")}function vs(i){let t=new URLSearchParams(i);return t.has(At)?Gn(t.get(At)??""):null}function fr(i){if(i<60)return"just now";let t=Math.round(i/60);return`${t} minute${t===1?"":"s"} ago`}var Mt=class extends fe{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${lt}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${lt}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return u`<form @submit=${o=>{o.preventDefault();let s=Gn(this.typed);s&&this.check(s)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?u`<p class="error" role="alert">${this.error}</p>`:x}
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
      <p class="code">${bs(e.code??"")}</p>
      ${o?u`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:x}
      <p>
        A screen at ${e.address} asked ${fr(e.age??0)}. Check the code matches the one on the screen. It will be
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
  `,Mt.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Mt);function R(i){let t=Math.round(i),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Le(i){let t=Math.floor(Math.round(i)/60)%24;return`${R(i)} ${t<12?"AM":"PM"}`}function ys(i){let t=Math.floor(i/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function dt(i){let t=Math.max(0,Math.round(i)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function rn(i){return i?`${dt(Math.abs(i))} ${i<0?"early":"late"}`:"on time"}function qn(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var gr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),mr=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),br=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function on(i){return new Date(`${i}T12:00:00Z`)}function me(i){let t=on(i);return`${gr.format(t)}, ${br.format(t)}`}function oe(i){return mr.format(on(i))}function $e(i,t){return Math.round((on(t).getTime()-on(i).getTime())/864e5)}function Lt(i,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Lt("UTC",t)}let n=o=>e.find(s=>s.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function an(i,t,e){let n=Math.floor((t.getTime()-i.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=Lt(e,i),s=Lt(e,t).date;return o.date===s?`at ${Le(o.minutes)}`:`on ${oe(o.date)} at ${Le(o.minutes)}`}var V=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function $s(i){switch(i.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Ze="mydashlight",vr=7,Yn=3e4,xs=3e4;function Xn(i){if(i instanceof V)return i;if(i&&typeof i=="object"){let t=i;if(typeof t.message=="string")return new V(String(t.code??"error"),t.message)}return typeof i=="number"?new V("connection_lost","Lost the connection to Home Assistant."):new V("error",String(i))}function ws(i,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new V("timeout","Home Assistant didn’t answer.")),t);i.then(s=>{clearTimeout(o),e(s)},s=>{clearTimeout(o),n(s)})})}var Dt=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},ln=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new V("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Dt(this.conn,`${Ze}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new V("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},Yn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await ws(this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:"get_plan",service_data:{days:vr},return_response:!0}),xs);this.emit(t.response)}catch(t){this.fail(Xn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:t,service_data:e})}catch(n){throw Xn(n)}this.live||await this.refresh()}setRide(t,e,n,o,s){return this.call("set_ride",s===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:s})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:qn(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:qn(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n){return this.call("set_people",{event:t,people:e,scope:n})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let l=await ws(this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:"get_chores",service_data:{},return_response:!0}),xs);if(e)return;n=!0,t(l.response??null)}catch{!e&&!n&&t(null)}},s=new Dt(this.conn,`${Ze}/chores/subscribe`,l=>{e||(n=!0,t(l.chores))},()=>void o());s.open();let r=setInterval(()=>{s.live||s.open()},Yn);return()=>{e=!0,clearInterval(r),s.close()}}watchLunch(t){let e=!1,n=!1,o=new Dt(this.conn,`${Ze}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let s=setInterval(()=>{o.live||o.open()},Yn);return()=>{e=!0,clearInterval(s),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:t,service_data:e})}catch(n){throw Xn(n)}}};var ks={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ts=i=>(...t)=>({_$litDirective$:i,values:t}),dn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:yr}=gs,Es=i=>i;var _s=()=>document.createComment(""),ct=(i,t,e)=>{let n=i._$AA.parentNode,o=t===void 0?i._$AB:t._$AA;if(e===void 0){let s=n.insertBefore(_s(),o),r=n.insertBefore(_s(),o);e=new yr(s,r,i,i.options)}else{let s=e._$AB.nextSibling,r=e._$AM,l=r!==i;if(l){let d;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(d=i._$AU)!==r._$AU&&e._$AP(d)}if(s!==o||l){let d=e._$AA;for(;d!==s;){let h=Es(d).nextSibling;Es(n).insertBefore(d,o),d=h}}}return e},Oe=(i,t,e=i)=>(i._$AI(t,e),i),xr={},Cs=(i,t=xr)=>i._$AH=t,Ps=i=>i._$AH,cn=i=>{i._$AR(),i._$AA.remove()};var Ss=(i,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(i[o],o);return n},ke=Ts(class extends dn{constructor(i){if(super(i),i.type!==ks.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],s=[],r=0;for(let l of i)o[r]=n?n(l,r):r,s[r]=e(l,r),r++;return{values:s,keys:o}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,n]){let o=Ps(i),{values:s,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,s;let l=this.ut??=[],d=[],h,p,a=0,f=o.length-1,w=0,k=s.length-1;for(;a<=f&&w<=k;)if(o[a]===null)a++;else if(o[f]===null)f--;else if(l[a]===r[w])d[w]=Oe(o[a],s[w]),a++,w++;else if(l[f]===r[k])d[k]=Oe(o[f],s[k]),f--,k--;else if(l[a]===r[k])d[k]=Oe(o[a],s[k]),ct(i,d[k+1],o[a]),a++,k--;else if(l[f]===r[w])d[w]=Oe(o[f],s[w]),ct(i,o[a],o[f]),f--,w++;else if(h===void 0&&(h=Ss(r,w,k),p=Ss(l,a,f)),h.has(l[a]))if(h.has(l[f])){let m=p.get(r[w]),$=m!==void 0?o[m]:null;if($===null){let _=ct(i,o[a]);Oe(_,s[w]),d[w]=_}else d[w]=Oe($,s[w]),ct(i,o[a],$),o[m]=null;w++}else cn(o[f]),f--;else cn(o[a]),a++;for(;w<=k;){let m=ct(i,d[k+1]);Oe(m,s[w]),d[w++]=m}for(;a<=f;){let m=o[a++];m!==null&&cn(m)}return this.ut=r,Cs(i,d),Me}});var hn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function Z(i){return hn[(i%hn.length+hn.length)%hn.length]}var pn="#23272E",Zn="35,39,46";var Jn=3,zt=36,Qn=12,un=8,As=30,Te=16,Rt=100,pt=60,wr=120,Ms=44,Ls=20,$r=45,kr=30,Ds=20,ni=10,gn=30,ii=10,Tr=150,Er=150,bn=1;function Hs(i,t){return i.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??zt}function _r(i,t,e){return 10+10.2*i.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var Cr=26,Fs=4;function oi(i,t){let e=Math.max(Tr,Er/bn);return Math.ceil(pt+Math.max(0,i-1)*ni+gn+Math.max(0,t-1)*ii+e*(i+bn*t))}function de(i){return i.people?i.people.kids.map(t=>t.id):i.days.length?Object.keys(i.days[0].kids):[]}function Q(i){return i.people?i.people.drivers.map(t=>t.id):i.days.length?Object.keys(i.days[0].drivers):[]}function ce(i){return new Map(de(i).map((t,e)=>[t,Z(e)]))}function ie(i,t){let e=i.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.kids[t])return n.kids[t].name;return t}function ee(i,t){let e=i.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.drivers[t])return n.drivers[t].name;return t}function ri(i,t){return t==="none"?"Not needed":Q(i).includes(t)?ee(i,t):t}function Pr(i){return i.leave_by!=null&&i.leave_by>i.start&&i.leave_by!==i.end?` · leave ${R(i.leave_by)}`:""}function vn(i){if(i.busy_why==="days"){if(i.start<=0&&i.end>=1440)return"All day";if(i.start<=0)return`Until ${R(i.end)}`;if(i.end>=1440)return`From ${R(i.start)}`}return`${R(i.start)}–${R(i.end)}`}function yn(i,t){return t.own?ee(i,t.own):ie(i,t.kid)}var ut={color:pn,rgb:Zn,ink:pn};function Us(i,t){return t.own?ut:ce(i).get(t.kid)??Z(0)}function Sr(i,t){let e=de(i);return t.along.map(n=>e.includes(n)?ie(i,n):ee(i,n))}function Qe(i){return i.length<2?i.join(""):`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}function Ar(i,t){let e=de(i),n=Q(i).filter(l=>t.includes(l)),o=e.filter(l=>t.includes(l)),s=e.length>1&&o.length===e.length;if(s&&n.length===Q(i).length)return"Everyone";let r=[...n.map(l=>ee(i,l)),...s?["the kids"]:o.map(l=>ie(i,l))];return r.length<2?r.join(""):`${r.slice(0,-1).join(", ")} & ${r[r.length-1]}`}function Mr(i){let t=new Map([["home","Home"]]);for(let e of i.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function mn(i,t){return t?i.get(t)??(t.split(",")[0]?.trim()||t):""}function ei(i,t){let e=[];for(let n of i)n.type==="drive"?(e.length||e.push(mn(t,n.from)),e.push(mn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(mn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Lr(i){let t=i.map(r=>({...r,col:0,cols:1})).sort((r,l)=>r.s-l.s||l.en-r.en),e=[],n=[],o=-1/0,s=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(s(),o=-1/0);let l=n.findIndex(d=>d<=r.s);l<0?(l=n.length,n.push(r.en)):n[l]=r.en,r.col=l,e.push(r),o=Math.max(o,r.en)}return s(),t}function Dr(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].y;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return i[i.length-1].y}function Rr(i,t){if(!i.length)return 0;if(t<=i[0].y)return i[0].t;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return i[i.length-1].t}function Ws(i,t){return Dr(i.anchors,t)}function ai(i,t){return Rr(i.anchors,t)}function jr(i,t){let e=de(i),n=Q(i),o=Math.max(t,oi(e.length,n.length)),r=(o-pt-Math.max(0,e.length-1)*ni-gn-Math.max(0,n.length-1)*ii)/(e.length+bn*n.length||1),l=Math.floor(r),d=Math.floor(r*bn),h=i.whole_week??i.days,p=new Map;for(let m of h)for(let $ of m.events)for(let _ of $.own?$.along:[$.kid]){let g=p.get(_)??[];g.some(T=>T.event_id===$.event_id&&T.calendar_id===$.calendar_id)||g.push($),p.set(_,g)}let a=ce(i),f=[],w=pt;e.forEach((m,$)=>{let _=p.get(m)??[],g=i.days.some(T=>T.events.some(L=>L.kid===m&&(L.sides.includes("drop")&&L.drop===""||L.sides.includes("pick")&&L.pick==="")));f.push({id:m,kind:"kid",x:w,w:l,name:ie(i,m),dot:a.get(m).color,rgb:a.get(m).rgb,sub:`${g?"Needs a ride · ":""}${_.length} this week`,subWarn:g}),w+=l+($<e.length-1?ni:0)});let k=w+gn/2;return w+=gn,n.forEach((m,$)=>{let _=0,g=0;for(let T of h){let L=T.drivers[m];L&&(_+=L.outings.length,g+=L.drive??0)}f.push({id:m,kind:"driver",x:w,w:d,name:ee(i,m),dot:pn,rgb:Zn,sub:`${_} ${_===1?"trip":"trips"} this week · ${dt(g)} driving`,subWarn:!1}),w+=d+($<n.length-1?ii:0)}),{columns:f,sepX:k,width:o}}function Ir(i,t){let e=i.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),s=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!s)return e;let r=o.slice(s[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Rs(i,t){let e=i.start<=0,n=i.end>=1440;return e&&n?`${i.title} · all day`:n?`${i.title} from ${R(i.start)}`:e||!t?`${i.title} until ${R(i.end)}`:`${i.title} ${R(i.start)}–${R(i.end)}`}function li(i){return i.issues.filter(t=>t.level==="problem").length+i.clashes.length+(i.unplaced?.length??0)}function di(i,t){let e=$e(t,i);return e===0?"Today":e===1?"Tomorrow":""}function J(i,t=0){return i==null||!Number.isFinite(i)?t:i}var si=null;function Ks(i){si=i}var fn='Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',ht={title:`800 14.5px ${fn}`,time:`400 12px ${fn}`,line:`600 12px ${fn}`,stop:`400 12px ${fn}`};function zr(i,t,e){let n=Math.max(8,Math.floor(t/e)),o=1,s=0;for(let r of i.split(/[ \t\n]+/).filter(Boolean)){let l=r.length;for(s===0?s=l:s+1+l<=n?s+=1+l:(o++,s=l);s>n;)o++,s-=n}return o}function Or(i,t,e,n){let o=i.split(/[ \t\n]+/).filter(Boolean),s=1,r="";for(let l of o){let d=r?`${r} ${l}`:l,h=n(d,e);if(h==null)return null;if(h<=t){r=d;continue}r&&s++;let p=n(l,e);if(p==null)return null;p>t&&(s+=Math.ceil(p/t)-1),r=l}return s}function jt(i,t,e=7,n){if(n&&si){let o=Or(i,t-.5,n,si);if(o!=null)return o}return zr(i,t,e)}var Vs=25,Br=15,Gs=3;function js(i){return Math.max(0,Math.min(Gs,Math.floor((i-Vs)/Br)))}var Nr=Vs+2,Is=20;function zs(i,t="Home"){let e=/^(\d+:\d\d)\s+(.+)$/.exec(i.at(-1)??"");return e&&e[2]===t?e[1]:null}function ti(i,t,e){let n=t.drivers[e]?.home;return n?new Map(i).set("home",n.name):i}var It="🚗";function Os(i,t){if(i===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,s,r,l=!1)=>({at:o,who:s,stays:l,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(i))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(i))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(i))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}return null}var Bs={muted:0,normal:1,pending:2,problem:3};function Hr(i){let{drop:t,pick:e}=i,n=t?Os(t.text,"drop"):null,o=e?Os(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return i;let s=[t,e].reduce((d,h)=>h&&(Bs[h.tone]??1)>(Bs[d]??1)?h.tone:d,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${It} No rides yet`,tone:s},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let d=`${It} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${d} both ways`,tone:s},pick:null}:!n.at||!o.at?{drop:{text:`${d} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:s},pick:null}:{drop:{text:`${d} ↓${n.at} ↑${o.at}`.trimEnd(),tone:s},pick:null}}let r=(d,h)=>d==="needed"?`${h} needed`:`${h}${d.at?`${d.at} `:" "}${d.who}${d.stays?" stays":""}${d.extra}`,l=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${It} ${l.join(" · ")}`,tone:s},pick:null}}function Fr(i,t){return!t&&!!i.drop&&!i.pick&&i.drop.tone==="muted"}var Ur=5,Wr=13;function Kr(i,t,e={}){let n=e.clash?4:2,o=t-n-13-9,s=n+2*Ur;s+=jt(i.title,o-(e.noted?Wr:0),9,ht.title)*18;let r=i.inline&&i.drop?`${i.time} · ${i.drop.text}`:i.time;return s+=1+jt(r,o,6.6,i.inline?ht.line:ht.time)*16,i.drop&&!i.inline&&(s+=1+jt(i.drop.text,o,7,ht.line)*16),i.pick&&(s+=2+jt(i.pick.text,o,7,ht.line)*16),Math.ceil(s)+1}function Ns(i,t="Home"){let e=/^(\S+\s+)(.+?), get (.+)$/u.exec(i);return e&&e[2]===t?`${e[1]}${t} ↑ ${e[3]}`:i.replace(/, drop off (.+)$/u," ↓ $1").replace(/, pick up (.+)$/u," ↑ $1")}function Vr(i,t){let e=i.reduce((n,o)=>n+jt(o,t-20,7,ht.stop),0);return 28+i.length+e*16+1}function qs(i,t,e,n){let o=t==="compact",{columns:s,sepX:r,width:l}=jr(i,e),d=new Map(s.map(g=>[g.id,g])),h=de(i),p=Q(i),a=[...h,...p],f=ce(i),w=Mr(i),k=g=>ie(i,g),m=g=>ee(i,g),$={mode:t,width:l,height:0,columns:s,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],folds:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},_=0;return i.days.forEach((g,T)=>{let L=T*1440,N=new Map(g.events.map(c=>[c.id,c])),te=c=>c&&N.has(c)?{day:g.date,event:c}:null,ae=li(g),H=g.events.length,Ce=di(g.date,n.date),ge=me(g.date),Be=(H?`${H} ${H===1?"activity":"activities"}${g.done?" left":""}`:g.done?"All done for today":"Nothing scheduled")+(ae?` · ${ae} to sort out`:""),ve=ea(i,g,f,l,l-_r(ge,Ce,Be));$.dayHeads.push({date:g.date,y:_,label:ge,tag:Ce,sub:Be,warn:ae>0,h:zt+(ve&&ve.h?ve.h+Fs+2:0),allDay:ve?.chips??[],inline:ve?.inline??0}),$.anchors.push({t:L,y:_});let Ne=$.dayHeads[$.dayHeads.length-1],le=_+Ne.h+Qn,Re=p.flatMap(c=>g.drivers[c]?.outings??[]);if(!H&&!Re.length){$.empties.push({key:g.date,y:le,text:g.done?"Nothing else today":"Nothing planned"}),_=le+40,$.anchors.push({t:L+1439,y:_});return}let je=(c,v,b=c.kid)=>{let y=!!c.own&&b===c.own,P=!!c.own&&b!==c.own,S=y?m(b):k(b),M=P?{drop:{text:`${v?`${It} `:""}With ${m(c.own)}`,tone:c.attending===!1?"muted":"normal"},pick:null}:v&&!c.own?Hr(c.lines):c.lines,z=y?Sr(i,c):[],D=(c.takes!=null?`${c.takes} min, any time ${R(c.start)}–${R(c.end)}`:vn(c)+(c.arrive_by!=null?` · arrive ${R(c.arrive_by)}`:"")+Pr(c))+(z.length?` · with ${Qe(z)}`:"");return{who:S,mine:y,title:Ir(c.title,S),time:D,drop:M.drop,pick:M.pick,inline:v&&Fr(M,c.attending===!1)}},He=(c,v,b,y)=>Kr(je(c,!0,b),v,{noted:!!c.notes,clash:y}),Ie=(c,v,b,y,P,S,M,z=c.kid)=>{let D=je(c,M,z),F=D.mine?ut:f.get(z)??Z(0),xe=D.who,E={drop:D.drop,pick:D.pick};return{key:`${g.date}|card|${c.id}`+(c.own?`|${z}`:""),x:v,y:b,w:y,h:P,target:{day:g.date,event:c.id},event:c,color:F,kidName:xe,clash:S,stayed:!c.own&&c.stay&&p.includes(c.drop),skipped:c.attending===!1,title:D.title,time:D.time,drop:E.drop,pick:E.pick,showDrop:!!E.drop&&(M||P>=56),showPick:!!E.pick&&(M||P>=74),wrap:M,inline:D.inline,aria:`${xe}, ${c.title} ${c.takes!=null?`any time from ${R(c.start)} to ${R(c.end)}`:vn(c).replace("–"," to ")}. `+(c.attending===!1&&!E.drop?"Not attending. ":"")+[E.drop,E.pick].filter(I=>!!I).map(I=>I.text).join(". ")}},Fe=c=>{let v=g.rides[c];return v?(g.drivers[v.driver]?.segments??[]).filter(y=>y.type!=="home"&&y.kids.includes(v.kid)&&J(y.start)>=J(v.start)&&J(y.end)<=J(v.end)):[]},ze=c=>{let v=g.rides[c];if(!v)return null;let b=v.serves.find(y=>N.get(y)?.kid===v.kid);return te(b??v.serves[0])},Ue=(c,v)=>{if(v.event)return v;let b=g.events.find(y=>y.own&&y.own!==c&&y.along.includes(c)&&y.title===v.title);return b?{...v,title:`${v.title} with ${m(b.own)}`}:v},ne=c=>{if(c.takes==null)return[c.start,c.end];let v=c.planned??c.start;return[v,v+c.takes]},ye=new Map;for(let c of g.issues)c.level!=="problem"||!c.event||(c.kind==="late"&&ye.set(c.event,`${Math.round(J(c.minutes))} min late`),c.kind==="waiting"&&ye.set(`${c.event}|pick`,`Waits ${Math.round(J(c.minutes))} min`));if(!o){let c=1/0,v=-1/0;for(let E of g.events)E.start<=0&&E.end>=1440||(E.start>0?c=Math.min(c,E.start-20,E.arrive_by!=null?E.arrive_by-10:1/0):c=Math.min(c,E.end-30),E.end<1440?v=Math.max(v,E.end+20):v=Math.max(v,E.start+30));for(let E of Re)E.start!=null&&(c=Math.min(c,E.start)),E.end!=null&&(v=Math.max(v,E.end));let b=g.from;b!=null&&Number.isFinite(c)&&c<b+60?c=b-15:g.date===n.date&&Number.isFinite(c)&&n.minutes>c-60&&n.minutes<v&&(c=Math.min(c,n.minutes-15));let y=Number.isFinite(c)?Math.floor((c-5)/30)*30:900,P=Math.max(Number.isFinite(v)?Math.ceil((v+5)/30)*30:960,y+60),S=E=>b!=null&&J(E)<=y,M=E=>b!=null&&J(E)<y,z=qr(Gr(g,p,ne,g.date===n.date?n.minutes:null),y,P),D=E=>Math.round(le+Yr(Math.max(y,Math.min(P,E))-y,z,y));$.anchors.push({t:L+y,y:D(y)});for(let E of z)$.anchors.push({t:L+E.from,y:D(E.from)},{t:L+E.to,y:D(E.to)}),$.folds.push({key:`${g.date}|fold|${E.from}`,y:D(E.from),h:D(E.to)-D(E.from),from:E.from,to:E.to,label:Xr(E.to-E.from)});$.anchors.push({t:L+P,y:D(P)});let F=(E,I)=>z.some(K=>I?E>=K.from&&E<=K.to:E>K.from&&E<K.to);for(let E of h){let I=d.get(E),K=f.get(E),wt=(g.kids[E]?.items??[]).filter(C=>C.start!=null&&C.end!=null&&!S(C.end)).map(C=>({item:C,s:J(C.start),en:J(C.end)})),se=[];for(let C of Lr(wt)){let j=I.w/C.cols,O=Math.round(I.x+C.col*j),U=Math.round(j-(C.cols>1?4:0)),q=D(C.s),W=C.item;if(W.type==="act"){let he=N.get(W.event??"");if(!he)continue;let qt=Math.max(30,D(C.en)-q),rt=Ie(he,O,q,U,qt,W.clash,!1,E);if(rt.layer=Rt,rt.cut=M(C.s),$.cards.push(rt),he.arrive_by!=null&&he.start-he.arrive_by>=5&&!rt.cut){let jn=D(he.arrive_by),Zi={key:`${g.date}|prep|${he.id}`,x:O,y:jn,w:U,h:q-jn+Te,color:K,label:`Arrive by ${R(he.arrive_by)}`,layer:Rt-1};$.preps.push(Zi),se.push({s:he.arrive_by,en:C.en,top:jn,bottom:q+qt,x:O,w:U,prep:Zi,card:rt})}else se.push({s:C.s,en:C.en,top:q,bottom:q+qt,x:O,w:U,card:rt});let Yi=ye.get(he.id);Yi&&$.marks.push({key:`${g.date}|late|${he.id}`,x:O+U-4,y:q+4,text:Yi,right:!0});let Xi=ye.get(`${he.id}|pick`);Xi&&$.marks.push({key:`${g.date}|wait|${he.id}`,x:O+4,y:q+qt+2,text:Xi,right:!1});continue}let B=g.rides[W.ride??-1];if(!B)continue;let we=Math.max(22,D(C.en)-q),kt=ei(Fe(B.index),ti(w,g,B.driver)),Vi=m(B.driver),Gi={key:`${g.date}|ride|${B.index}`,x:O,y:q,w:U,h:we,target:ze(B.index),l1:`${B.own?"In":"Along in"} ${Vi}’s car`,l2:kt.join(" → "),show2:js(we)>0,lines2:js(we),dashed:!B.own,clash:W.clash,aria:`${k(E)} ${B.own?"in":"riding along in"} ${Vi}’s car, ${R(J(B.start))} to ${R(J(B.end))}: ${kt.join(" to ")}`};$.rides.push(Gi);let qi=d.get(B.driver),Rn=null;qi&&(Rn={key:`${g.date}|band|${B.index}`,x:O+U,y:q,w:Math.max(0,qi.x+8-(O+U)),h:we,color:K},$.bands.push(Rn)),se.push({s:C.s,en:C.en,top:q,bottom:q+we,x:O,w:U,ride:Gi,band:Rn})}let Gt=C=>C.ride?.layer??(C.prep?Rt-1:Rt),$t=(C,j,O,U)=>{O>Te&&$.links.push({key:`${C.key}|link`,x:C.x,y:j,w:C.w,h:O,color:K,layer:U})},A=(C,j)=>{if(!(j.x<C.x||j.x+j.w>C.x+C.w)&&(C.x=j.x,C.w=j.w,C.ride.x=j.x,C.ride.w=j.w,C.band)){let O=C.band.x+C.band.w;C.band.x=j.x+j.w,C.band.w=Math.max(0,O-C.band.x)}},X=new Set;for(let C of[...se].sort((j,O)=>O.s-j.s)){let j=C.ride;if(!j)continue;let O=se.filter(W=>W!==C&&W.s>=C.en&&W.s-C.en<=As&&W.top>=C.bottom).sort((W,B)=>W.s-B.s||W.top-B.top)[0];if(!O)continue;X.add(C),A(C,O);let U=Gt(O),q=O.top-C.bottom;$t(j,C.bottom,q+Te,U-1),j.layer=U-(q>0?2:1),j.h+=Te,j.tuckBottom=Te}for(let C of[...se].sort((j,O)=>j.s-O.s)){let j=C.ride;if(!j||X.has(C))continue;let O=se.filter(W=>W!==C&&W.en<=C.s&&C.s-W.en<=As&&W.bottom<=C.top&&(W.card||W.ride?.layer!=null)).sort((W,B)=>B.en-W.en||B.bottom-W.bottom)[0];if(!O)continue;A(C,O);let U=O.ride?.layer??Rt,q=C.top-O.bottom;$t(j,O.bottom-Te,q+Te,U-1),j.layer=U-(q>0?2:1),j.y-=Te,j.h+=Te,j.tuckTop=Te}}for(let E of p){let I=d.get(E),K=g.drivers[E];if(!K)continue;let wt=[],se=null;for(let A of K.segments)if(!(A.start==null||A.end==null)){if(A.type==="home"){se=null;continue}if(A.type==="stay"){se=null,wt.push({type:"stay",g:A,s:A.start,en:A.end});continue}se&&se.en===A.start?(se.en=A.end,se.legs.push(A)):(se={type:"trip",s:A.start,en:A.end,legs:[A]},wt.push(se))}let Gt=new Set,$t=(A,X,C,j)=>{Gt.add(A.id);let O=D(X),U=Ie(A,I.x+8,O,I.w-16,Math.max(30,D(C)-O),!1,!1,E);U.cut=M(X),j&&U.drop?.tone==="normal"&&(U.drop=null,U.showDrop=!1),$.cards.push(U)};for(let A of wt){if(S(A.en))continue;let X=D(A.s),C=Math.max(24,D(A.en)-X);if(A.type==="stay"){let B=N.get(A.g.event??A.g.serves??"");if(B?.own===E){$t(B,A.s,A.en,!0);continue}let we=B?f.get(B.kid)??Z(0):Z(0),kt=A.g.kids.map(k);$.stays.push({cut:M(A.s),key:`${g.date}|stay|${E}|${A.s}`,x:I.x+8,y:X,w:I.w-16,h:C,target:te(B?.id),color:we,l1:B?`At ${B.title} with ${k(B.kid)}`:"Staying",l2:`until ${R(A.en)}`+(kt.length?` · ${kt.join(" and ")} too`:"")});continue}let j=A.legs[0],O=A.legs[A.legs.length-1],U=[];for(let B of A.legs)for(let we of B.kids)U.includes(we)||U.push(we);let q=O.type==="drive"&&O.to==="home",W=ei(A.legs,ti(w,g,E));$.trips.push({key:`${g.date}|trip|${E}|${A.s}`,x:I.x+8,y:X,w:I.w-16,h:C,target:te(A.legs.find(B=>B.serves)?.serves),l1:j.type==="drive"&&j.from==="home"?`Leave ${R(A.s)}`:`From ${mn(w,j.from??j.place)} ${R(A.s)}`,l2:W.join(" → "),show2:C>=36,l3:q?`${K.home?.name??"Home"} ${R(A.en)}`:"",show3:q&&C>=62,stops:null,kids:U.map(B=>(f.get(B)??Z(0)).color),bad:A.legs.some(B=>B.overlaps_busy),aria:`${m(E)} drives ${W.join(" to ")}, ${R(A.s)} to ${R(A.en)}`})}for(let A of K.segments)if(!(!A.overlaps_busy||A.start==null||A.end==null))for(let X of K.busy){let C=Math.max(A.start,X.start),j=Math.min(A.end,X.end);j<=C||S(j)||$.overlaps.push({key:`${g.date}|overlap|${E}|${C}`,x:I.x+6,y:D(C)-2,w:I.w-12,h:Math.max(8,D(j)-D(C)+4)})}for(let A of g.events)if(A.own===E&&(!Gt.has(A.id)&&!S(ne(A)[1])&&$t(A,...ne(A),!1),A.takes!=null&&A.attending!==!1&&!S(A.end))){let X=D(A.start);$.windows.push({key:`${g.date}|window|${A.id}`,x:I.x+4,y:X,w:I.w-8,h:Math.max(24,D(A.end)-X),label:`${A.title} · any time ${R(A.start)}–${R(A.end)}`})}for(let A of K.busy){if(A.event||A.end<=y||A.start>=P)continue;let X=Ue(E,A),C=D(X.start),j=D(X.end);$.busy.push({key:`${g.date}|busy|${E}|${X.start}`,x:I.x+1,y:C,w:I.w-2,h:j-C,labelY:8,label:Rs(X,!1)})}}let xe=-1/0;for(let E=y;E<=P;E+=30)F(E,!0)||$.grid.push({key:`${g.date}|grid|${E}`,y:D(E),strong:E%60===0}),(z.some(K=>K.from===E||K.to===E)||E%60===0&&!F(E,!1))&&D(E)-xe>=22&&($.hours.push({key:`${g.date}|hour|${E}`,y:D(E)-8,label:E%60===0?ys(E):Le(E)}),xe=D(E));g.date===n.date&&n.minutes>y&&n.minutes<P&&($.now={y:D(n.minutes),label:`Now ${R(n.minutes)}`}),_=D(P)+Qn;return}let G=[];for(let c of h){let v=d.get(c);for(let b of g.kids[c]?.items??[])if(b.start!=null){if(b.type==="act"){let y=N.get(b.event??"");if(!y)continue;G.push({col:c,s:b.start,h:He(y,v.w,c,b.clash),kind:"act",item:b})}else if(!g.rides[b.ride??-1]?.own){let y=g.rides[b.ride??-1],P=y?g.drivers[y.driver]?.outings.find(S=>S.start!=null&&S.start<=J(y.start)&&J(y.start)<=J(S.end,S.start)):void 0;G.push({col:c,s:P?.start??b.start,h:Nr,kind:"along",item:b})}}}for(let c of p){let v=g.drivers[c];if(!v)continue;for(let y of v.busy)y.event||G.push({col:c,s:y.start,h:32,kind:"busy",busy:Ue(c,y)});let b=d.get(c).w;for(let y of g.events)y.own!==c||!y.busy_only&&y.attending!==!1&&(y.takes==null||y.planned!=null)||G.push({col:c,s:ne(y)[0],h:He(y,b-16,c,!1),kind:"own",event:y});for(let y of v.outings){if(y.start==null)continue;let P=(zs(y.lines,y.home)?y.lines.slice(0,-1):y.lines).map(S=>Ns(S,y.home));G.push({col:c,s:y.start,h:Vr([...P,...y.warn?[y.warn]:[]],b-16),kind:"out",out:y})}}G.sort((c,v)=>c.s-v.s||a.indexOf(c.col)-a.indexOf(v.col));let pe=new Map,re=[],We=new Map,ue=le-Is;for(let c=0;c<G.length;){let v=c,b=ue+Is;for(;v<G.length&&G[v].s===G[c].s;v++){let P=pe.get(G[v].col);P!=null&&(b=Math.max(b,P+un))}let y=new Set;for(let P=c;P<v;P++){let S=G[P],M=y.has(S.col)?pe.get(S.col)+un:b;y.add(S.col),pe.set(S.col,M+S.h)}We.set(G[c].s,b),G[c].s>0&&$.hours.push({key:`${g.date}|hour|${G[c].s}`,y:b+2,label:Le(G[c].s)}),ue=b,c=v}pe.clear(),G.forEach((c,v)=>{let b=pe.get(c.col),y=Math.max(b!=null?b+un:le,We.get(c.s));pe.set(c.col,y+c.h);let P=c.kind==="busy"?c.busy.end:c.kind==="act"?N.get(c.item.event??"")?.end??null:c.kind==="own"?ne(c.event)[1]:null;re.push({col:c.col,s:c.s,end:P,y,h:c.h,box:null}),$.anchors.push({t:L+c.s,y});let S=d.get(c.col);if(c.kind==="busy"){let M={key:`${g.date}|busy|${c.col}|${v}`,x:S.x+1,y,w:S.w-2,h:c.h,labelY:8,label:Rs(c.busy,!0)};$.busy.push(M),re[re.length-1].box=M}else if(c.kind==="out"){let M=c.out,z=zs(M.lines,M.home),D=z?M.lines.slice(0,-1):M.lines;$.trips.push({key:`${g.date}|trip|${c.col}|${v}`,x:S.x+8,y,w:S.w-16,h:c.h,target:te(M.target),l1:z?`${M.lead} · ${M.home&&M.home!=="Home"?M.home:"home"} ${z}`:M.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...D.map(F=>({text:Ns(F,M.home),warn:!1})),...M.warn?[{text:M.warn,warn:!0}]:[]],kids:M.kids.map(F=>(f.get(F)??Z(0)).color),bad:!!M.warn,aria:`${m(c.col)}: ${M.lead}. ${M.lines.join(". ")}${M.warn?`. ${M.warn}`:""}`})}else if(c.kind==="own"){let M=Ie(c.event,S.x+8,y,S.w-16,c.h,!1,!0,c.col);$.cards.push(M),re[re.length-1].box=M}else if(c.kind==="act"){let M=N.get(c.item.event??""),z=Ie(M,S.x,y,S.w,c.h,c.item.clash,!0,c.col);$.cards.push(z),re[re.length-1].box=z}else{let M=g.rides[c.item.ride??-1],z=ei(Fe(M.index),ti(w,g,M.driver)),D=m(M.driver);$.rides.push({key:`${g.date}|ride|${M.index}`,x:S.x,y,w:S.w,h:c.h,target:ze(M.index),l1:`${It} with ${D}`,l2:z.join(" → "),show2:!1,lines2:Gs,dashed:!0,clash:c.item.clash,aria:`${k(c.col)} riding along with ${D}, ${R(J(M.start))} to ${R(J(M.end))}: ${z.join(" to ")}`})}});let Pe=le;for(let c of pe.values())Pe=Math.max(Pe,c);for(let c of re){if(!c.box||c.end==null)continue;let v=c.y+c.h;for(let b of re)b.col!==c.col&&b.s>=c.s&&b.s<c.end&&(v=Math.max(v,b.y+b.h));c.end>=1440&&(v=Pe);for(let b of re)b.col===c.col&&b.y>c.y&&(v=Math.min(v,b.y-un));v=Math.min(v,Pe),v>c.y+c.h&&(c.box.h=v-c.y)}_=Pe+Qn+6,$.anchors.push({t:L+1439,y:_})}),$.height=_,$}function Gr(i,t,e,n){let o=[],s=(r,l)=>{r==null||l==null||o.push([r-Ls,Math.min(l,r+$r)+Ds],[Math.max(r,l-kr)-Ls,l+Ds])};for(let r of i.events)r.own?(s(...e(r)),r.takes!=null&&s(r.start,r.end)):s(r.arrive_by??r.start,r.end);for(let r of Object.values(i.kids))for(let l of r.items??[])s(l.start,l.end);for(let r of t){let l=i.drivers[r];if(l){for(let d of l.segments)d.type!=="home"&&s(d.start,d.end);for(let d of l.outings)s(d.start,d.end);for(let d of l.busy)s(d.start,d.end)}}return n!=null&&o.push([n-30,n+30]),o}function qr(i,t,e){let n=i.map(([d,h])=>[Math.max(t,d),Math.min(e,h)]).filter(([d,h])=>h>d).sort((d,h)=>d[0]-h[0]),o=[],s=t,r=(d,h)=>{let p=Math.ceil(d/30)*30,a=Math.floor(h/30)*30;a-p>=wr&&o.push({from:p,to:a})},l=!1;for(let[d,h]of n)l&&d>s&&r(s,d),s=l?Math.max(s,h):h,l=!0;return o}function Yr(i,t,e){let n=i*Jn,o=e+i;for(let s of t){let r=s.to-s.from;o>=s.to?n-=r*Jn-Ms:o>s.from&&(n-=(o-s.from)*Jn-(o-s.from)/r*Ms)}return n}function Xr(i){let t=Math.floor(i/60),e=i%60>=30;return`${t}${e?"½":""} hrs`}var Zr=["","¼","½","¾"];function Je(i){return i.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return dt(n);let o=Math.round(n*4),s=Math.floor(o/4),r=Zr[o%4];return`${s||!r?s:""}${r} min`})}function Ys(i){let t=e=>e?{...e,text:Je(e.text)}:null;return{...i,days:i.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(s=>({...s,lines:s.lines.map(Je),warn:s.warn==null?s.warn:Je(s.warn)}))}])),issues:e.issues.map(n=>({...n,title:Je(n.title),body:Je(n.body),note:n.note==null?n.note:Je(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Je(o.note)}))}:{}}))}))}}var Jr=2,Qr=48;function Xs(i,t,e=Qr){let n=[],o=new Set(Q(i)),s=de(i).map(f=>ie(i,f)),r=s.length>1?s.slice(0,2):[s[0]??"Ava","Ben"],l=0,d=0,h=0,p=0,a=t.minutes+e*60;for(let f of i.days){let w=$e(t.date,f.date),k=w===0?"":`${oe(f.date)} · `,m=new Map(f.events.map(g=>[g.id,g])),$=g=>g&&m.has(g)?{day:f.date,event:g}:null,_=(g,T)=>w*1440+(g??m.get(T??"")?.start??0)<a;for(let g of f.issues)if(g.level==="problem"){if(!_(g.at,g.event)){h++,g.kind==="unassigned"&&p++;continue}l++,g.kind==="unassigned"&&d++,n.push({key:`${f.date}|${g.key}`,tone:g.kind==="unassigned"?"unassigned":"problem",title:k+g.title,body:g.body,target:$(g.event),suggestions:(g.suggestions??[]).map(T=>({id:T.id,label:T.label,note:T.note}))})}if(f.clashes.forEach((g,T)=>{if(!_(g.a.start,g.a.event)){h++;return}l++;let L=m.get(g.a.event??""),N=ie(i,g.kid),te=(H,Ce)=>{let ge=$(Ce);return ge?{text:H,target:ge}:H},ae=[];if(g.b.type==="act"){let H=m.get(g.b.event??"");L&&H&&(ae=[te(L.title,L.id),` ${R(L.start)}–${R(L.end)} and `,te(H.title,H.id),` ${R(H.start)}–${R(H.end)} overlap.`])}else{let H=f.rides[g.b.ride??-1];L&&H&&(ae=[`${N} is in `,te(`${ee(i,H.driver)}’s car`,H.serves[0]),` ${R(J(g.b.start))}–${R(J(g.b.end))}, during `,te(L.title,L.id),"."])}n.push({key:`${f.date}|clash|${T}`,tone:"problem",title:`${k}${N} is double-booked`,body:ae.map(H=>typeof H=="string"?H:H.text).join(""),parts:ae,target:null,suggestions:[]})}),w>=0&&w<Jr)for(let g of f.issues)g.level!=="heads_up"||!_(g.at,g.event)||n.push({key:`${f.date}|${g.key}`,tone:"heads_up",title:k+g.title,body:g.body,target:$(g.event),suggestions:[]});for(let g of f.unplaced??[]){if(!_(g.at)){h++;continue}l++;let T=g.people.map(N=>o.has(N)?ee(i,N):ie(i,N)),L=g.from_notes?"The For line in its notes":"Its title";n.push({key:`${f.date}|unplaced|${g.id}`,tone:"problem",title:`${k}${R(g.at)} ${g.title}: ${Zs(g).toLowerCase()}`,body:g.reason==="unknown"&&g.word?`${L} names “${g.word}”, who isn’t anyone in the family, so ${T.length?`it’s only in ${Qe(T)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:f.date,id:g.id}})}for(let g of f.events)!g.problems.length||!_(g.start)||n.push({key:`${f.date}|notes|${g.id}`,tone:"heads_up",title:`${k}Check the notes on ${yn(i,g)}’s ${g.title}`,body:`These lines couldn’t be read: ${g.problems.join("; ")}`,target:$(g.id),suggestions:[]})}return{items:n,problems:l,unassigned:d,later:h,laterUnassigned:p}}function Zs(i){return i.reason==="unknown"&&i.word?`Who is “${i.word}”?`:"Who is this for?"}function ea(i,t,e,n,o=0){let s=new Set(Q(i)),r=k=>{let m=k[0];return m==null?null:s.has(m)?ut:e.get(m)??null},l=[...(t.all_day??[]).map(k=>{let m=k.days>1?`Day ${k.day_number} of ${k.days}`:"";return{key:`${t.date}|allday|${k.id}`,title:k.stay?`🏨 ${k.title}`:k.title,note:k.stay?[Ar(i,k.people),m].filter(Boolean).join(" · "):m,color:r(k.people),cancelled:k.cancelled,warn:!1,pick:null,stay:k.stay&&!k.cancelled?k.id:null,notes:k.notes??""}}),...(t.unplaced??[]).map(k=>({key:`${t.date}|unplaced|${k.id}`,title:`${R(k.at)} ${k.title}`,note:Zs(k),color:null,cancelled:!1,warn:!0,pick:k.id,stay:null,notes:k.notes??""}))];if(!l.length)return null;let d=Math.max(120,n-pt),h=(k,m=7)=>30+m*k.title.length+(k.note?Math.min(m,5.6)*(k.note.length+2):0)+(k.notes?16:0)+(k.stay?12:0),p=0,a=0;for(;p<l.length&&a+h(l[p],6.4)<=o;)a+=h(l[p++],6.4);let f=0;a=0;for(let k of l.slice(p)){let m=Math.min(d,h(k));(!f||a+m>d)&&(f++,a=0),a+=m}let w=f?f*Cr+(f-1)*Fs:0;return{key:`${t.date}|allday`,h:w,chips:l,inline:p}}function Js(i,t){let e=ce(i),n=null,o=s=>s.ahead>0?2:s.ongoing?1:0;for(let s of i.days){let r=$e(t.date,s.date);if(!(r<0))for(let l of Q(i))for(let d of s.drivers[l]?.outings??[]){if(d.start==null)continue;let h=r*1440+d.start;if(r*1440+J(d.end,d.start)<=t.minutes)continue;let a=h-t.minutes,f={driver:l,name:ee(i,l),date:s.date,ahead:r,start:d.start,inMinutes:a,ongoing:a<=0,lead:d.lead,stop:(d.lines[0]??"").replace(/\s+/g," ").trim(),kids:d.kids.map(w=>e.get(w)??Z(0)),warn:d.warn,target:d.target&&s.events.some(w=>w.id===d.target)?{day:s.date,event:d.target}:null};(!n||o(f)<o(n)||o(f)===o(n)&&f.inMinutes<n.inMinutes)&&(n=f)}}return n}function ft(i){return i.state==="done"||i.state==="late"}var ta=780;function na(i,t,e){return i.state==="open"&&!!i.for_day&&i.due===t&&e<ta}function Qs(i,t){return i.chores.map(e=>na(e,i.today,t)?{...e,state:"upcoming",shows_from:i.today}:e)}function eo(i){return i.state==="open"||i.state==="overdue"}function pi(i,t,e){if(ft(i)){let n=i.done_at?ia(i.done_at,t,e):"";return i.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(i.state==="overdue")return i.missed>1?`Missed ${i.missed} times`:i.due?`Missed ${ci(i.due,t)}`:"Missed";if(i.state==="upcoming"){if(i.for_day)return`From 1 PM · for ${ci(i.for_day,t)}`;let n=i.shows_from??i.due;if(!i.due||!n||i.due<=n)return"";let o=$e(t,i.due);return`By ${o===1?"tomorrow":o<7?oe(i.due):hi(i.due)}`}if(i.for_day&&i.due===t)return`Tonight · for ${ci(i.for_day,t)}`;if(i.due&&i.due>t){let n=$e(t,i.due);return n===1?"By tomorrow":`By ${n<7?oe(i.due):hi(i.due)}`}return i.missed?`Today · missed ${i.missed===1?"once":`${i.missed} times`} before`:"Today"}function ci(i,t){let e=$e(t,i);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?oe(i):hi(i)}function hi(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ia(i,t,e){let n=new Date(i);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let s=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return s===t?r:`${oe(s)} ${r}`}function to(i,t,e=1440){let n=Qs(i,e).sort((o,s)=>o.order-s.order);return i.kids.map((o,s)=>{let r=n.filter(p=>p.kid===o.id),l=new Map;for(let p of r){if(p.state!=="upcoming")continue;let a=p.shows_from??p.due??i.today;l.set(a,[...l.get(a)??[],p])}let d=r.filter(p=>p.state==="overdue"),h=r.filter(p=>p.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??Z(s),overdue:d,now:h,done:r.filter(ft),later:[...l.entries()].sort(([p],[a])=>p.localeCompare(a)).map(([p,a])=>({date:p,chores:a})),left:d.length+h.length}})}function no(i,t=1440){return Qs(i,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=i.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function ui(i){return!i.chores.length&&!i.templates.length}var et=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function fi(i){let t=i.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,s]=n.split("-").map(r=>et.indexOf(r.trim()));if(o===void 0||o<0||s!==void 0&&s<0)return null;if(s===void 0)e.add(o);else for(let r=0;r<=(s-o+7)%7;r++)e.add((o+r)%7)}return e}function gi(i){let t=[...new Set(i)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${et[n[0]]}-${et[n.at(-1)]}`]:n.map(o=>et[o])).join(", ")}var tt="none";function xn(i){return i==="daily"||i==="school"?"":"Any"}function io(i=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:i,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function so(i){let t=i.days??xn(i.repeats),e=i.repeats==="daily"&&t!=="";return{template:i.id,repeats:e?"weekly":i.repeats,title:i.title,icon:i.icon,details:i.details??"",who:[...i.who],take_turns:!!i.take_turns,days:t,every:!e&&i.every&&i.every>0?i.every:1,paused:i.paused,night_before:!!i.night_before,bring_only:!!i.bring_only}}function mi(i){return i.title.trim()?i.who.length?i.days===tt?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function oo(i){return{...i.template?{template:i.template}:{},repeats:i.repeats,title:i.title.trim(),icon:i.icon??"",details:i.details.trim(),who:i.who,take_turns:i.take_turns&&i.who.length>1,days:i.repeats==="daily"?"":i.days,every:i.repeats==="school"?1:i.every,paused:i.paused,...i.repeats==="school"?{night_before:i.night_before,bring_only:i.bring_only}:{}}}function bi(i){let t=i%100;return t>=11&&t<=13?`${i}th`:`${i}${{1:"st",2:"nd",3:"rd"}[i%10]??"th"}`}function vi(i,t,e=1,n=!1,o=!1){if(i==="school"){let p=t.trim().replace(/-/g,"–"),a=o?p?`${p} Bring lunch days`:"Bring lunch days":p?`${p} school days`:"Every school day";return n?`${a}, the night before`:a}let s={daily:"day",weekly:"week",monthly:"month"}[i],r=e>1?`every ${e} ${s}s`:`each ${s}`,l=t.trim();if(i==="daily")return e>1?`Every ${e} days`:"Every day";if(i==="weekly"&&/^mon\s*-\s*sun$/i.test(l))return e>1?`Every day, every ${e} weeks`:"Every day";if(!l||l.toLowerCase()==="any")return`Sometime ${r}`;if(i==="weekly")return`${l.replace(/-/g,"–")} ${r}`;let h=`${l.split(",").map(p=>{let a=p.trim();return a.toLowerCase()==="last"?"the last day":/^\d+$/.test(a)?`the ${bi(Number(a))}`:`the ${a}`}).join(" and ")} ${r}`;return h[0].toUpperCase()+h.slice(1)}function yi(i,t,e=!1){let n=i.map(s=>t.find(r=>r.id===s)?.name??s);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function xi(i){let t=i.indexOf(":"),e=t<0?i:i.slice(0,t),n=t<0?"":i.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function wn(i,t){return`${i}|${t}`}function gt(i,t){let[e,n,o]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function $n(i){let[t,e,n]=i.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function ro(i,t){return i.days_off.find(e=>e.first<=t&&t<=e.last)??null}function ao(i,t){return $n(t)<5&&!ro(i,t)}function Ot(i,t,e=new Map){if(!ao(i,t))return null;let n=wn(i.id,t);if(e.has(n)){let s=e.get(n);return s?{lunch:s,picked:!0}:{lunch:i.default,picked:!1}}let o=i.picks[t];return o?{lunch:o,picked:!0}:{lunch:i.default,picked:!1}}function mt(i,t){return ao(i,t)?i.menus?.[t]??null:null}var sa="From the school's menu feed.";function oa(i){let t=i.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==sa);return t.length?t.join(`
`):null}function Ee(i){return i.slice(0,7)}function kn(i){let[t,e]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function wi(i,t=1){let[e,n]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function lo(i){let t=[];for(let e=Ee(i.first);e<=Ee(i.last);e=wi(e))t.push(e);return t}function co(i,t,e,n=new Map){let o=`${e}-01`,s=gt(o,-$n(o)),r=[];for(;Ee(s)<=e;){let l=[];for(let d=0;d<5;d++){let h=gt(s,d),p=Ee(h)!==e,a=p?null:ro(t,h),f=p?null:Ot(t,h,n);l.push({date:h,day:Number(h.slice(8)),outside:p,off:a?a.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:p?null:mt(t,h)?.dish??null,sides:p?null:oa(mt(t,h)?.details??""),past:h<i.today,today:h===i.today})}l.some(d=>!d.outside)&&r.push(l),s=gt(s,7)}return r}function ho(i){return i.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function po(i){let t=0,e=0;for(let n of i.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function uo(i,t,e,n=new Map){let o=e<780?0:1;for(let s=o;s<8;s++){let r=gt(t,s),l=Ot(i,r,n);if(!l)continue;let d=$e(t,r);return{lunch:l.lunch,when:d===0?"today":d===1?"tomorrow":oe(r),date:r,menu:mt(i,r)?.dish??null}}return null}var ra={timeline:"timeline",full:"timeline",compact:"compact"};function Bt(i){let t=new URLSearchParams(i),e={},n=ra[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}function $i(i,t=0){return i==null||!Number.isFinite(i)?t:i}function aa(i,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of i.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(i.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function la(i,t){let e=[],n=[],o=()=>{let s=n[n.length-1];s&&$i(s.end)>t&&e.push(...n),n=[]};for(let s of i){if(s.start==null||s.end==null)continue;if(s.type==="home"||s.type==="stay"){o(),s.end>t&&e.push(s);continue}let r=n[n.length-1];r&&r.end!==s.start&&o(),n.push(s)}return o(),e}function da(i,t){let e=new Set(i.events.filter(s=>aa(i,s)<=t).map(s=>s.id)),n=s=>$i(i.rides[s??-1]?.end,-1)<=t,o=s=>s.type==="act"?e.has(s.event??""):n(s.ride);return{...i,events:i.events.filter(s=>!e.has(s.id)),kids:Object.fromEntries(Object.entries(i.kids).map(([s,r])=>[s,{...r,items:r.items.filter(l=>!o(l))}])),drivers:Object.fromEntries(Object.entries(i.drivers).map(([s,r])=>[s,{...r,segments:la(r.segments,t),outings:r.outings.filter(l=>l.start==null||$i(l.end,l.start)>t),busy:r.busy.filter(l=>l.end>t)}])),clashes:i.clashes.filter(s=>!o(s.a)&&!o(s.b)),issues:i.issues.filter(s=>!s.event||!e.has(s.event)),done:e.size,from:t}}function fo(i,t){return{...i,whole_week:i.whole_week??i.days,days:i.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?da(e,t.minutes):e)}}var go=Ke`
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
    --shadow:
      0 1px 2px rgba(28, 30, 34, 0.06), 0 2px 8px rgba(28, 30, 34, 0.06);
    display: block;
    height: 100%;
    background: var(--bg);
    color: var(--ink);
    font-family:
      Inter,
      "Segoe UI",
      Roboto,
      system-ui,
      -apple-system,
      sans-serif;
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
    background: repeating-linear-gradient(
      90deg,
      var(--dark) 0 10px,
      transparent 10px 16px
    );
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
    background:
      linear-gradient(rgba(var(--rgb), 0.04), rgba(var(--rgb), 0.04)),
      var(--surface);
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
  /* A hotel stay: tap it to pick who's staying. */
  button.strip-chip.stay:hover,
  button.strip-chip.stay:focus-visible {
    background: rgba(var(--rgb), 0.2);
  }
  button.strip-chip.stay::after {
    content: "›";
    align-self: center;
    margin-left: -2px;
    color: var(--ink);
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
    box-shadow:
      inset 5px 0 0 var(--c),
      0 0 0 2px rgba(var(--rgb), 0.6),
      var(--shadow);
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
    box-shadow:
      inset 5px 0 0 var(--c),
      var(--shadow);
  }
  .card.clash {
    border-width: 2px;
  }
  .card.sel {
    box-shadow:
      inset 5px 0 0 var(--c),
      0 0 0 3px var(--ring);
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
    background:
      linear-gradient(rgba(var(--rgb), 0.08), rgba(var(--rgb), 0.08)),
      var(--surface);
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
    background: repeating-linear-gradient(
      135deg,
      rgba(18, 135, 122, 0.35) 0px,
      rgba(18, 135, 122, 0.35) 4px,
      #fff 4px,
      #fff 8px
    );
  }
  .busy-sw {
    background: repeating-linear-gradient(
      135deg,
      rgba(90, 96, 105, 0.25) 0px,
      rgba(90, 96, 105, 0.25) 4px,
      rgba(90, 96, 105, 0.06) 4px,
      rgba(90, 96, 105, 0.06) 8px
    );
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
    transition:
      background-color 0.15s ease,
      opacity 0.15s ease;
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
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      var(--surface) 12px
    );
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
    transition:
      background-color 0.15s ease,
      opacity 0.15s ease;
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
    background: repeating-linear-gradient(
      135deg,
      var(--line-2) 0 6px,
      var(--surface-2) 6px 12px
    );
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
    box-shadow:
      0 10px 30px rgba(28, 30, 34, 0.18),
      0 2px 6px rgba(28, 30, 34, 0.08);
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
`;function ca(i,t,e,n,o=14){let s=i.top-o-8,r=e.h-i.bottom-o-8,l=t.h<=s,d=t.h<=r,h=n?l||!d&&s>r:!d&&(l||s>r),p=h?i.top-o-t.h:i.bottom+o,a=Math.max(8,Math.min(p,e.h-8-t.h)),f=Math.max(8,Math.min(i.x-t.w/2,e.w-8-t.w));return{left:Math.round(f),top:Math.round(a),above:h}}function Nt(i,t){for(let e of i.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var Tn=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?Nt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=Nt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let s=this.press;!s||s.el!==e||!e.isConnected||(s.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&Nt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=Nt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&Nt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let s=t.dataset.note;if(!s)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=s,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let l={w:r.offsetWidth,h:r.offsetHeight},d={w:window.innerWidth,h:window.innerHeight},h=ca(e,l,d,n,o);r.style.left=`${h.left}px`,r.style.top=`${h.top}px`,r.classList.toggle("above",h.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};(()=>{if(typeof document>"u")return;let i=null,t=new Map;Ks((e,n)=>{let o=`${n}|${e}`,s=t.get(o);if(s!==void 0)return s;if(!i){if(!document.body)return null;i=document.createElement("span"),i.setAttribute("aria-hidden","true"),i.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;white-space:pre;letter-spacing:normal;word-spacing:normal;text-transform:none;contain:layout style",document.body.appendChild(i)}return i.style.font=n,i.style.font?(i.style.fontVariantNumeric="tabular-nums",i.textContent=e,s=i.getBoundingClientRect().width,t.size>2e4&&t.clear(),t.set(o,s),s):null})})();var er="mydashlight.rides.view",Fl=1100,Ul=440,Wl=700,Kl=3*6e4,Xo=1200,Vl=450,Gl=110;function ql(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Dn=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Zo=Y`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,Jo=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Yl=new URL("emoji.json",import.meta.url).href,Qo=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Fi=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Ui=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Xl=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Zl=Y`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Ut={bring:"Bring",buy:"Buy"};function Jl(i,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[i];return t<=1?e:`${e}s${i==="monthly"&&t===3?" (quarterly)":i==="monthly"&&t===12?" (yearly)":""}`}function be(i){let t=/\p{L}|\p{N}/u.exec(i);return t?t[0].toUpperCase():"?"}function Wi(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Ql(i,t){return di(i,t)||me(i).split(",")[0]}function ed(i){let t=i.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function td(){try{return localStorage.getItem(er)==="timeline"?"timeline":"compact"}catch{return"compact"}}function nd(i){try{localStorage.setItem(er,i)}catch{}}function Ki(i,t){return Q(i).includes(t)?ee(i,t):ie(i,t)}function Wt(i){return i.days.every(t=>!t.events.length)}var Kt=class extends fe{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Bt(location.search).view;this.urlPage=Bt(location.search).page;this.urlPast=Bt(location.search).past;this.urlDayPicker=Bt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,s=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(s)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-s,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Kl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??td(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new Tn(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,s]of this.lunchDraft){let[r,l]=o.split("|"),d=e.kids.find(h=>h.id===r);(!d||(d.picks[l]??null)===s||!Ot(d,l))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&ft(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(s=>s.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Ys(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Fl)return!1;let e=this.plan;return!e||this.width-Ul>=oi(de(e).length,Q(e).length)}today(){return Lt(this.plan?.time_zone??ql())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:fo(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let s=this.board,r=this.boardPlan;this.board=qs(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,s&&r&&this.keepPlace(s,r,e)}return this.board}keepPlace(e,n,o){let s=this.scroller;if(!s||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||s.scrollTop<=0)return;let r=e.dayHeads.find(p=>p.date===this.pinDay)?.h??zt,l=ai(e,s.scrollTop+r+4),d=n.days[Math.floor(l/1440)]?.date,h=d?o.days.findIndex(p=>p.date===d):-1;h>=0&&(this.keepAt=h*1440+(l-Math.floor(l/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let s=this.scroller;if(!s||!this.board)return;let r=this.topFor(e,n);Math.abs(s.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?s.scrollTo({top:r,behavior:"smooth"}):s.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,s=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(s,Ws(o,e)-Hs(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let s=this.today();if(e===s.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),l=o.days[r];if(!l)return;let d=1/0;if(this.mode==="timeline"){for(let h of l.events)d=Math.min(d,h.arrive_by??h.start);for(let h of Object.values(l.drivers))for(let p of h.outings)p.start!=null&&(d=Math.min(d,p.start))}this.scrollToTime(r*1440+(Number.isFinite(d)?Math.max(0,d-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=n+1&&(o=d);this.pinDay!==o.date&&(this.pinDay=o.date);let s=null,r=this.nowSpot(),l=this.today().date;if(r){let d=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),h=d>0?"up":"down";this.board.dayHeads.some(p=>p.date===l)&&o.date!==l?s=`${h}|Today`:this.mode==="timeline"&&Math.abs(d)>e.clientHeight*.6&&(s=`${h}|${o.date===l?"Now":"Today"}`)}this.away!==s&&(this.away=s)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),s=new Map(this.choreDraft);s.set(e.id,o),this.choreDraft=s;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let d=r instanceof V?r:new V("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??ft(e)}editMenu(e,n){let o=this.lunch?.kids??[],s=mt(e,n),r=o.filter(l=>l.id===e.id||s&&mt(l,n)?.dish===s.dish).map(l=>l.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:s?.dish??"",details:s?.details??"",kids:r,had:!!s,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let s=o instanceof V?o:new V("error",String(o));this.showToast(s.code==="preview"?s.message:`Couldn’t save that. ${s.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let s=new Map(this.lunchDraft);for(let r of n)s.set(wn(e,r),o);this.lunchDraft=s;try{await this.backend.setLunch(e,n,o)}catch(r){let l=new Map(this.lunchDraft);for(let h of n)l.delete(wn(e,h));this.lunchDraft=l;let d=r instanceof V?r:new V("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?so(e):io(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(Yo(),qo))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||mi(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(oo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof V?n:new V("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof V?n:new V("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(s=>s.date===this.pinDay)?.h??zt;this.keepAt=n&&this.board?ai(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||nd(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),s=this.plan;if(!o||!s)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...de(s),...Q(s)]);this.forPick={day:e,id:n,placed:!1,label:`${R(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(l=>r.has(l)),scope:"this",busy:!1}}openStayPick(e,n){let o=this.plan,s=o?.days.find(l=>l.date===e)?.all_day?.find(l=>l.id===n);if(!o||!s)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...de(o),...Q(o)]);this.forPick={day:e,id:n,placed:!1,label:`🏨 ${s.title}`,recurring:!1,word:null,fromNotes:!!s.from_notes,people:s.people.filter(l=>r.has(l)),scope:"this",busy:!1,stay:!0}}changeForPick(e,n,o){let s=e.who?.[o.event_id],r=s?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${R(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!s?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let n=this.forPick,o=this.plan;if(!n||!o||!this.backend||!e&&!n.people.length)return;let s=e?[]:n.people;this.forPick={...n,busy:!0};try{await this.backend.setPeople(n.id,s,n.scope),this.forPick=null;let r=n.label.replace(/^\S+ /,""),l=s.map(h=>Ki(o,h)),d=Q(o).filter(h=>s.includes(h));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:n.stay?`Saved. ${Qe(d.map(h=>ee(o,h)))}’s rides start from ${r} now.`:`Saved. ${r} is in ${Qe(l)}’s ${l.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let l=r instanceof V?r:new V("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}renderForPick(e){let n=this.plan,o=e.stay?n?.days.some(T=>T.date===e.day&&T.all_day?.some(L=>L.id===e.id&&L.stay)):e.placed?n?.days.some(T=>T.date===e.day&&T.events.some(L=>L.id===e.id)):!!this.findUnplaced(e.day,e.id),s=e.stay?"Who’s staying?":"Who is this for?",r=u`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return u`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">${s}</span></div>
          ${r}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let l=e.busy,d=T=>{this.forPick&&(this.forPick={...this.forPick,...T})},h=T=>d({people:e.people.includes(T)?e.people.filter(L=>L!==T):[...e.people,T]}),p=ce(n),a=de(n),f=a.length>1&&a.every(T=>e.people.includes(T)),k=[...a,...Q(n)].filter(T=>e.people.includes(T)),m=k.map(T=>Ki(n,T)),$=!!e.stay&&!k.some(T=>Q(n).includes(T)),_=m.length<2?m.join(""):`${m.slice(0,-1).join(", ")} & ${m[m.length-1]}`,g=(T,L,N,te)=>u`<button
      type="button"
      class="who-chip"
      style="--c:${N.color};--rgb:${N.rgb}"
      aria-pressed=${e.people.includes(T)?"true":"false"}
      ?disabled=${l}
      @click=${()=>h(T)}
    >
      <span class="avatar ${te?"driver":""}" aria-hidden="true">${be(L)}</span>${L}
    </button>`;return u`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${s}</span>
          <span class="ed-meta">${me(e.day)} · ${e.label}</span>
        </div>
        ${r}
      </div>
      ${e.word?u`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:x}
      ${e.recurring?u`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${l} @click=${()=>d({scope:"this"})}>
                Just ${oe(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${l} @click=${()=>d({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:x}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${a.map(T=>g(T,ie(n,T),p.get(T)??Z(0),!1))}
        </div>
        ${a.length>1?u`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${f?"true":"false"}
              ?disabled=${l}
              @click=${()=>d({people:f?e.people.filter(T=>!a.includes(T)):[...a,...e.people.filter(T=>!a.includes(T))]})}
            >
              All the kids
            </button>`:x}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${Q(n).map(T=>g(T,ee(n,T),ut,!0))}
        </div>
      </div>
      <p class="field-hint">
        ${e.stay?u`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} on every day of the stay. The kids go
              wherever their driver goes, so picking just the parents is enough.${k.length?u` Saved in the event’s notes as <strong>For: ${_}</strong>.`:x}`:k.length?u`Saved in the event’s notes as <strong>For: ${_}</strong>, so its title stays as it is. It shows in ${k.length>1?"their lanes":`${m[0]}’s lane`}${k.some(T=>a.includes(T))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?u`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:x}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${l||!k.length||$} @click=${()=>void this.saveForPick()}>
          ${l?"Saving to Google Calendar…":$?"Pick a parent too":k.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderForLine(e,n,o){let s=e.who?.[o.event_id];if(!s)return x;let r=s.people.map(l=>Ki(e,l));return u`<span class="ed-for"
      >For ${Qe(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,n,o)}>Change</button></span
    >`}findEvent(e){let n=this.plan?.days.find(s=>s.date===e.day),o=n?.events.find(s=>s.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1}}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(s){let r=s instanceof V?s:new V("error",String(s));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,s){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&s.includes(e.drop)){s.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let s=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>s.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>s.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let s=this.backend,r=o==="pick"?e.pick_along??[]:e.along,l=r.includes(n)?r.filter(d=>d!==n):[...r,n];this.save(`along-${o}`,l,()=>s.setTakeAlong(e.id,l,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let s=((this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by)??e.start)+n;this.arriveDraft=s===e.start?null:s,this.timesOpen={...this.timesOpen,arrive:!0},this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Xo)}clearArrive(){this.arriveDraft=null,this.timesOpen={...this.timesOpen,arrive:!1},this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let s=this.backend,r=o.event.id,l=this.scope;this.save("arrive",e,()=>s.setArriveBy(r,e,l)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,s=Math.max(e.start+5,(o??e.end)+n);this.leaveDraft=s===e.end?null:s,this.timesOpen={...this.timesOpen,leave:!0},this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),Xo)}clearLeave(){this.leaveDraft=null,this.timesOpen={...this.timesOpen,leave:!1},this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let s=this.backend,r=o.event.id,l=this.scope;this.save("leave",e,()=>s.setLeaveBy(r,e,l)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,Gl)},Vl)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),s=o?Xs(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,l=this.chores?no(this.chores,this.today().minutes).filter(f=>!this.choreDone(f)):[],d=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,h=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",p=u`<aside class="panel" aria-label=${h}>
      ${d??(this.sel&&e?this.renderEditor(e):this.renderAttention(s,l))}
    </aside>`,a=this.page==="rides";return u`
      <div class="app ${r?"wide":this.width<Wl?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,s,l.length)} ${a?this.renderBanner(e):x}
          <main>
            ${a?u`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Wt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Wt(o)?this.renderDayRail(o):x}
                  ${n&&this.away?this.renderBackToToday(this.away):x}
                </section>`:this.page==="lunch"?u`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:u`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?u`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${p}`:x}
          </main>
        </div>
        ${r?p:x}
        ${this.toast?u`<div class="toast" role="status">${this.toast}</div>`:x}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let s=n.problems+o;this.tick;let r=this.today(),l="";if(e){let f=e.time_zone,w=new Date(e.updated);this.error?l=u`<span class="bad">${$s(this.error)} · showing the plan from ${an(w,new Date,f)}</span>`:e.status&&!e.status.ok?l=u`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${an(w,new Date,f)}</span>`:this.backend?.live||(l=`Updated ${an(w,new Date,f)}`)}let d=(f,w,k,m)=>u`
      <button type="button" class="seg-btn" title=${m} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${k}<span class="seg-label">${w}</span>
      </button>
    `,h=(f,w,k)=>u`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${k}<span class="seg-label">${w}</span>
      </button>
    `,p=Le(r.minutes),a=!!e&&Wt(e);return u`
      <header>
        ${this.showMenu?u`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Y`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:x}
        <div class="titles">
          <h1 class="clock" aria-label=${`${me(r.date)}, ${p}`}>
            <span class="hm">${p.slice(0,-3)}</span><span class="ampm">${p.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${me(r.date)}${typeof l=="string"&&l?u`<span class="status"> · ${l}</span>`:x}
          </p>
          ${l&&typeof l!="string"?u`<p class="status">${l}</p>`:x}
        </div>
        ${e&&!a?this.renderNext(e,Js(e,r),n):x}
        <div class="controls">
          ${this.wide||a&&!o?x:u`<button type="button" class="attn-btn ${s?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${s}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?x:u`<div role="group" aria-label="View" class="seg">
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
    `}renderNext(e,n,o){if(!n){let h=this.today().date,p=o.unassigned,a=o.laterUnassigned;if(p){let w=u`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${p} ${p===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?u`<div class="next idle needs">${w}</div>`:u`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${w}</button>`}if(a)return u`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${a} ${a===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let f=e.days.some(w=>w.date>=h&&w.events.length);return u`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let s;n.ongoing?s="On the road now":n.ahead===0?s=n.inMinutes<180?`Next trip · in ${dt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?s="Next trip · tomorrow":s=`Next trip · ${oe(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,l=u`
      <span class="next-eyebrow">${s}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${be(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(h=>u`<span class="kid-dot" style="background:${h.color}"></span>`)}</span>
        ${n.warn?u`<span class="next-stop warn">${n.warn}</span>`:n.stop?u`<span class="next-stop">${n.stop}</span>`:x}
      </span>
    `,d=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?u`<button type="button" class=${d} @click=${()=>this.open(n.target)}>${l}</button>`:u`<div class=${d}>${l}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return x;let n=this.today().date,o=ce(e),s=this.railShown;return u`<div
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
        ${e.days.map(r=>{let l=li(r),d=r.events.length,h=r.events.slice(0,4).map(a=>a.own?ut.color:o.get(a.kid)?.color??Z(0).color),p=`${me(r.date)}: ${d?`${d} ${d===1?"activity":"activities"}`:"nothing planned"}${l?`, ${l} to sort out`:""}`;return u`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${p}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":oe(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${h.length?h.map(a=>u`<span class="rd-dot" style="background:${a}"></span>`):u`<span class="rd-free">free</span>`}
            </span>
            ${l?u`<span class="rd-badge" aria-hidden="true">${l}</span>`:x}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return u`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${Y`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=de(e),o=Q(e),s=ce(e),r=n.map(l=>ie(e,l));return u`<div class="quiet-week">
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
          When something lands on ${ed(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(l=>{let d=s.get(l);return u`<div class="qw-person" style="--c:${d.color};--rgb:${d.rgb}">
            <span class="avatar" aria-hidden="true">${be(ie(e,l))}</span>
            <span class="qw-name">${ie(e,l)}</span>
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
    </div>`:x}renderEmpty(){return this.error?u`<div class="empty-state">
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
          <span class="label">${e.label}</span>${e.tag?u`<span class="tag">${e.tag}</span>`:x}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
        ${e.inline?u`<div class="dh-chips">${e.allDay.slice(0,e.inline).map(o=>this.renderStripChip(e,o,n))}</div>`:x}
      </div>
      ${e.allDay.length>e.inline?u`<div class="day-strip" style="padding-left:${pt}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:x}`}renderStripChip(e,n,o){let s=u`<span class="strip-title">${n.title}</span>${n.note?u`<span class="strip-note">${n.note}</span>`:x}${n.notes?Zo:x}`,r=n.pick,l=n.stay;return l?u`<button
        type="button"
        class="strip-chip stay ${n.color?"":"plain"} ${n.notes?"noted":""}"
        style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
        tabindex=${o?-1:0}
        data-note=${n.notes||x}
        aria-label=${`${n.title}: ${n.note}. Pick who’s staying`}
        @click=${()=>this.openStayPick(e.date,l)}
      >
        ${s}
      </button>`:r?u`<button
          type="button"
          class="strip-chip warn plain pick"
          tabindex=${o?-1:0}
          data-note=${n.notes||x}
          aria-label=${`${n.title}: ${n.note} Pick who it’s for`}
          @click=${()=>this.openForPick(e.date,r)}
        >
          ${s}
        </button>`:u`<span
          class="strip-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
          style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
          tabindex=${n.notes&&!o?0:x}
          data-note=${n.notes||x}
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
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0,a.w-58-a.name.length*10.6):x}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        ${l?u`<div class="pinned" aria-hidden="true" style="width:${d}px;height:${l.h}px;margin-bottom:${-l.h}px">
              ${this.renderHead(l,!0)}
            </div>`:x}
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
                  <span class="l1">${m.l1}</span>${m.show2?u`<span class="l2" style="-webkit-line-clamp:${m.lines2}">${m.l2}</span>`:x}
                </button>`}let f=a.x,w=f.color,k=f.skipped?`repeating-linear-gradient(135deg, rgba(${w.rgb},0.10) 0px, rgba(${w.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:f.stayed?`repeating-linear-gradient(135deg, rgba(${w.rgb},0.24) 0px, rgba(${w.rgb},0.24) 6px, rgba(${w.rgb},0.08) 6px, rgba(${w.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${w.rgb},0.15), rgba(${w.rgb},0.15)), var(--surface)`;return u`<button
                type="button"
                class="card ${f.wrap?"wrap":""} ${r(f.target)?"sel":""} ${f.clash?"clash":""} ${f.skipped?"skipped":""} ${f.cut?"cut":""} ${f.event.notes?"noted":""}"
                aria-label=${f.aria}
                data-note=${f.event.notes||x}
                style="left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;background:${k};border-color:${f.clash?"var(--bad)":`rgba(${w.rgb},0.45)`};--c:${w.color};--rgb:${w.rgb};--ring:${w.color}"
                @click=${()=>this.open(f.target)}
              >
                ${f.event.notes?Zo:x}
                <span class="top">
                  <span class="title">${f.title}</span>
                  <span class="time">${f.time}${f.inline&&f.drop?u`<span class="line tone-${f.drop.tone} inline"> · ${f.drop.text}</span>`:x}</span>
                  ${f.showDrop&&f.drop&&!f.inline?u`<span class="line tone-${f.drop.tone}">${f.drop.text}</span>`:x}
                </span>
                ${f.showPick&&f.pick?u`<span class="line tone-${f.pick.tone}">${f.pick.text}</span>`:x}
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
                ${a.show2?u`<span class="l2">${a.l2}</span>`:x}
                ${a.stops?a.stops.map(f=>u`<span class="stop ${f.warn?"warn":""}">${f.text}</span>`):x}
                ${a.show3?u`<span class="l3">${a.l3}</span>`:x}
              </button>`)}
          ${ke(e.overlaps,a=>a.key,a=>u`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${ke(e.marks,a=>a.key,a=>u`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${ke(e.folds,a=>a.key,a=>u`<div class="fold" style="top:${a.y}px;width:${d-60}px;height:${a.h}px" aria-hidden="true">
                ${id(d-60,a.h)}
              </div>
              <span class="fold-label" style="top:${a.y+a.h/2-9}px" title="${Le(a.from)} to ${Le(a.to)}">${a.label}</span>`)}
          ${e.now?u`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${d-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:x}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:s,later:r}=e,l=this.plan,d=s+n.length,h=this.chores,p=!!h&&!ui(h);return u`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${d?"bad":"ok"}">${d}</span>
        ${this.wide?x:u`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${p?u`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?u`<div class="attn-chores">${n.map(a=>this.renderChoreRow(a,!0))}</div>`:u`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:u`<p class="panel-sub">Rides in the next two days</p>`}
      ${l&&!s?u`<div class="all-clear">
            <span class="check" aria-hidden="true">${Y`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Wt(l)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:x}
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
              </div>`:x}
        </div>`)}
      ${this.wide&&l&&!Wt(l)&&this.page==="rides"?this.renderLegend():x}
    `}kidColorOf(e){let n=this.plan?ce(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(s=>s.id===e)??-1;return Z(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let s=this.lunch,r=s?.kids.find(a=>a.id===e);if(!s||!r)return x;this.tick;let l=this.today(),d=uo(r,l.date,l.minutes,this.lunchDraft);if(!d)return x;let h=Ut[d.lunch],p=`${h} lunch ${d.when}${d.menu?`: ${d.menu}`:""}`;return n&&o<36+h.length*7.4?u`<span class="lunch-chip ${d.lunch} small icon" role="img" aria-label=${p} title=${p}
        >${d.lunch==="bring"?Fi:Ui}</span
      >`:u`<span class="lunch-chip ${d.lunch} ${n?"small":""}" title=${p}
      >${d.lunch==="bring"?Fi:Ui}<span class="lunch-chip-text"
        >${h}${n?x:` ${d.when}`}${!n&&d.menu?u`<span class="lunch-chip-menu"> · ${d.menu}</span>`:x}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return u`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return u`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=lo(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Ee(e.today),s=n.indexOf(o),r=p=>{let a=n[s+p];a&&(this.lunchMonth=a)},l=e.kids.some(p=>p.id===this.lunchKid)?this.lunchKid:null,d=l?e.kids.filter(p=>p.id===l):e.kids,h=e.status&&!e.status.ok?u`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:x;return u`<div class="chores-scroll lunch-page">
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
          ${this.menuMode?"Done":u`${Jo} Edit menus`}
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
    </div>`}renderLunchCard(e,n,o,s){let r=this.kidColorOf(n.id),l=co(e,n,o,this.lunchDraft),d=po(l),h=l.flat(),p=h.filter(m=>!m.outside&&!m.past&&m.lunch),a=n.days_off.filter(m=>Ee(m.first)<=o&&o<=Ee(m.last)),f=m=>p.filter($=>$n($.date)===m),w=m=>{let $=f(m);if(!$.length)return;let _=$.every(g=>g.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(g=>g.date),_)},k=p.length?`${d.bring} Bring · ${d.buy} Buy${o===Ee(e.today)?" left this month":""}`:"No school days left this month";return u`<section class="chore-col lunch-card ${s?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${be(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${k}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Ut[n.default]} unless picked</span>
          ${e.kids.length<2?x:u`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${s?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=s?null:n.id}
              >
                ${s?Zl:Xl}${s?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?u`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:x}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${kn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((m,$)=>u`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f($).length}
            aria-label=${`${f($).every(_=>_.lunch==="bring")?"Buy":"Bring"} every ${m} left in ${kn(o)} for ${n.name}`}
            @click=${()=>w($)}
          >
            ${m}
          </button>`)}
        ${h.map(m=>this.renderLunchCell(n,m,s))}
      </div>
      ${a.length?u`<p class="lunch-offs">
            No school:
            ${a.map(m=>{let $=m.first<`${o}-01`?`${o}-01`:m.first,_=Ee(m.last)>o?gt(`${wi(o)}-01`,-1):m.last;return`${$===_?Wi($):`${Wi($)}–${Wi(_)}`} ${ho(m.title)}`}).join(" · ")}
          </p>`:x}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return u`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return u`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let s=n.lunch,r=s==="buy"?"bring":"buy",l=n.menu?`, ${n.menu}`:"",d=this.menuMode,h=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),p=d?`${e.name}, ${me(n.date)}${l||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${me(n.date)}: ${Ut[s]}${n.picked?"":" (not picked yet)"}${l}. Tap to ${Ut[r]}.`;return u`<button
      type="button"
      class="lunch-day ${s} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${d?"editing":""} ${h?"sel":""}"
      ?disabled=${n.past&&!d}
      aria-label=${p}
      @click=${()=>d?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${s==="bring"?Fi:Ui}${Ut[s]}</span>
      ${n.menu?u`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?u`<span class="lunch-sides">${n.sides}</span>`:x}`:d?u`<span class="lunch-menu add">${Dn} Menu</span>`:x}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,s=this.choreDone(e),r=o.kids.findIndex(_=>_.id===e.kid),l=(this.plan?ce(this.plan).get(e.kid):void 0)??Z(Math.max(0,r)),d=o.kids[r]?.name??"",h=s===ft(e)?e:{...e,state:s?"done":"open",done_at:s?new Date().toISOString():null},p=s&&h.done_by&&h.done_by!==e.kid?o.people?.find(_=>_.id===h.done_by)?.name??h.done_by_name??null:null,a=`${pi(h,o.today,o.time_zone)}${p?` · by ${p}`:""}`,f=s||eo(e),w=`${n?`${d}: `:""}${e.title}. ${a?`${a}. `:""}${s?"Done. Tap to undo.":"Tap when it’s done."}`,k=u`<span class="box" aria-hidden="true"
        >${s?Y`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:x}</span
      >
      ${e.icon?u`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:x}
      <span class="chore-text">
        <span class="chore-title">${n?u`<span class="chore-kid">${d}</span> · `:x}${e.title}</span>
        ${a?u`<span class="chore-note">${a}</span>`:x}
      </span>`,m=`chore ${s?"done":""} ${e.state==="overdue"&&!s?"overdue":""} ${f?"":"later"}`,$=`--c:${l.color};--rgb:${l.rgb};--k:${l.ink}`;return f?u`<button type="button" class=${m} style=${$} aria-pressed=${s?"true":"false"} aria-label=${w} @click=${()=>this.tapChore(e)}>
          ${k}
        </button>`:u`<div class=${m} style=${$}>${k}</div>`}renderChores(){let e=this.chores;if(e===void 0)return u`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return u`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return u`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return u`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(ui(e))return u`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Dn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?u`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:x;this.tick;let s=to(e,this.plan?ce(this.plan):void 0,this.today().minutes);return u`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Dn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Jo} Manage chores</button>
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
                  ${r.overdue.map(d=>this.renderChoreRow(d))}`:x}
            ${r.now.length?u`<h3 class="chore-group">To do</h3>
                  ${r.now.map(d=>this.renderChoreRow(d))}`:x}
            ${r.done.length?u`<h3 class="chore-group">Done</h3>
                  ${r.done.map(d=>this.renderChoreRow(d))}`:x}
            ${r.later.map(d=>u`<h3 class="chore-group">${d.date===e.today?"Later today":Ql(d.date,e.today)}</h3>
                ${d.chores.map(h=>this.renderChoreRow(h))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?u`<p class="chore-none">No chores this week.</p>`:x}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,s=this.plan?ce(this.plan):void 0,r=this.choreEdit?.template===e.id,l=e.problems.length?u`<span class="tmpl-note bad">${e.problems.map(xi).join(" · ")} · tap to set up</span>`:u`<span class="tmpl-note">${yi(e.who,o,e.take_turns)} · ${vi(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return u`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?u` <span class="tag-paused">Paused</span>`:x}</span>
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
                </section>`:x}):u`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return u``;let o=n.kids,s=this.plan?ce(this.plan):void 0,r=this.choreBusy,l=e.template?n.templates.find(m=>m.id===e.template):void 0,d=mi(e),h=(l?.problems??[]).filter(m=>m!=="who:"),p=(m,$,_,g=!1)=>u`<button type="button" class="choice ${g?"wide":""}" aria-pressed=${m?"true":"false"} ?disabled=${r} @click=${_}>${$}</button>`,a=(m,$,_,g)=>u`<button type="button" class="chip" aria-pressed=${m?"true":"false"} aria-label=${g??x} ?disabled=${r} @click=${_}>${$}</button>`,f=m=>{m!==e.repeats&&this.changeDraft({repeats:m,days:l&&l.repeats===m?l.days??xn(m):xn(m)})},w=m=>{let $=e.who.includes(m)?e.who.filter(_=>_!==m):o.filter(_=>_.id===m||e.who.includes(_.id)).map(_=>_.id);this.changeDraft({who:$})},k;if(e.repeats==="school"){let m=e.days===tt?new Set:e.days===""?new Set([0,1,2,3,4]):fi(e.days)??new Set,$=_=>{let g=new Set(m);g.has(_)?g.delete(_):g.add(_),this.changeDraft({days:g.size===5?"":g.size?gi(g):tt})};k=u`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${et.slice(0,5).map((_,g)=>a(m.has(g),_.slice(0,2),()=>$(g),_))}
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
        </div>`}else if(e.repeats==="monthly"){let m=e.days.trim(),$=/^\d+$/.test(m)?Number(m):null,_=m&&m.toLowerCase()!=="any"&&m.toLowerCase()!=="last"&&$===null;k=u`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${_?4:3}, minmax(0, 1fr))">
          ${p(m===""||m.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${p($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${p(m.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${_?p(!0,m,()=>{}):x}
        </div>
        ${$!==null?u`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${bi($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:u`<p class="field-hint">${m.toLowerCase()==="last"?"Due on the month’s last day.":_?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")k=u`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let m=e.days===""||e.days.toLowerCase()==="any",$=e.days===tt?new Set:m?new Set:fi(e.days)??new Set,_=g=>{let T=new Set($);T.has(g)?T.delete(g):T.add(g),this.changeDraft({days:T.size?gi(T)||"Mon-Sun":tt})};k=u`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${p(m,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${p(!m,"On set days",()=>this.changeDraft({days:m?"Sat":e.days}))}
        </div>
        ${m?u`<p class="field-hint">Shows all week, due on Sunday.</p>`:u`<div role="group" aria-label="Days of the week" class="day-chips">
                ${et.map((g,T)=>a($.has(T),g.slice(0,2),()=>_(T),g))}
              </div>
              <div class="chips">
                ${a(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${a(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return u`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?u`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:x}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?yi(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===tt?"No days picked":vi(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${h.length?u`<p class="field-hint bad">${h.map(xi).join(". ")}. Saving fixes it.</p>`:x}
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
          ${Qo.map(m=>a(e.icon===m,m,()=>this.changeDraft({icon:e.icon===m?null:m}),`Picture ${m}`))}
          ${e.icon&&!Qo.includes(e.icon)?a(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):x}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?u`<emoji-picker
              class="emoji-more"
              .dataSource=${Yl}
              @emoji-click=${m=>{let $=m.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:x}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((m,$)=>{let _=s?.get(m.id)??Z($),g=e.who.includes(m.id);return u`<button type="button" class="who-chip" style="--c:${_.color};--rgb:${_.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${()=>w(m.id)}>
              <span class="avatar" aria-hidden="true">${be(m.name)}</span>${m.name}
            </button>`})}
        </div>
        ${e.who.length>1?u`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${p(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${p(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:x}
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
      ${k}
      ${e.repeats==="school"?x:u`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Jl(e.repeats,e.every)}</span>
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
            </button>`:x}
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
          </button>`:x}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!h} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":h??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return u``;let o=n.people?.length?n.people:n.kids.map(a=>({...a,role:"kid"})),s=n.kids.findIndex(a=>a.id===e.kid),r=n.kids[s],l=this.plan?ce(this.plan):void 0,d=l?.get(e.kid)??Z(Math.max(0,s)),h=o.filter(a=>a.id!==e.kid),p=a=>{let f=n.kids.findIndex(w=>w.id===a.id);return f>=0?(l?.get(a.id)??Z(f)).color:"var(--dark)"};return u`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?u`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:x}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${pi(e,n.today,n.time_zone)}</span>
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
    </div>`}ownHint(e,n){let o=yn(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${R(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${R(n.start)} to ${R(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let s=n.along.map(r=>Q(e).includes(r)?ee(e,r):ie(e,r));return`${o} drives there and back${s.length?`, with ${Qe(s)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return u``;let{day:o,event:s}=n,r=Q(e),l=Us(e,s),d=yn(e,s),h=!!this.pending,p=b=>this.pending?.key===b?this.pending.value:void 0,a=[...e.people?.carpools??[]];for(let b of e.days)for(let y of b.events)for(let P of[y.drop,y.pick])P&&P!=="none"&&!r.includes(P)&&!a.some(S=>S.toLowerCase()===P.toLowerCase())&&a.push(P);let f=b=>{if(!s.sides.includes(b))return x;let y=p(b)??p("both"),P=b==="drop"?s.drop:s.pick,S=y!==void 0?String(y):s.no_ride_unless_named&&P==="none"?"":P,M=S===""&&!(y===void 0&&s.no_ride_unless_named),z=S&&S!=="none"&&!r.includes(S)?S:"",D=I=>{this.otherOpen=null,this.setRide(s,b,S===I?"":I,r)},F=[...r.map(I=>[I,ri(e,I)]),["none","Not needed"]],xe=`${s.id}|${b}`,E=this.otherOpen===xe;return u`<div class="field ride-box">
        <span class="field-label">${b==="drop"?"Drop-off":"Pick-up"} ${M?u`<span class="nobody">· nobody yet</span>`:x}</span>
        <div role="group" aria-label=${b==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${F.length+1}, minmax(0, 1fr))">
          ${F.map(([I,K])=>u`<button type="button" class="choice" aria-pressed=${S===I?"true":"false"} ?disabled=${h} @click=${()=>D(I)}>
                ${K}
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
              ${a.map(I=>u`<button type="button" class="chip" aria-pressed=${S.toLowerCase()===I.toLowerCase()?"true":"false"} ?disabled=${h} @click=${()=>D(I)}>
                    ${I}
                  </button>`)}
            </div>`:x}
        <input
          type="text"
          .value=${z&&!a.some(I=>I.toLowerCase()===z.toLowerCase())?z:""}
          ?disabled=${h}
          aria-label=${b==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${I=>{let K=I.target.value.trim();K&&K!==S&&D(K)}}
          @keydown=${I=>{I.key==="Enter"&&I.target.blur()}}
        />`:x}
        ${!_&&S!==""&&S!=="none"?w(b,S):x}
      </div>`},w=(b,y)=>{let P=p(`along-${b}`),S=P!==void 0?P:b==="pick"?s.pick_along??[]:s.along,M=new Set(o.events.filter(F=>F.event_id===s.event_id&&!F.own).map(F=>F.kid)),z=[...de(e).filter(F=>F!==s.kid&&!M.has(F)),...r.filter(F=>F!==y)];return z.length?u`<div class="field-sub">
        <span class="field-label">${b==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${b==="pick"?"Coming home too. Anyone already there just gets in.":b==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${b==="drop"?"Riding along on the drop-off":b==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${z.map(F=>u`<button type="button" class="chip" aria-pressed=${S.includes(F)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,F,b)}>
              ${r.includes(F)?ee(e,F):ie(e,F)}
            </button>`)}
        </div>
      </div>`:x},k=r.includes(s.drop)?s.drop:r.includes(s.pick)?s.pick:"",m=s.drop===s.pick&&r.includes(s.drop),$=p("stay"),_=$!==void 0?!!$:s.stay&&m,g=p("along"),T=g!==void 0?g:s.along,L=s.own?[...de(e),...r.filter(b=>b!==s.own)]:[],N=s.own!=null&&s.takes!=null,te=s.own!=null&&!N,ae=p("takes"),H=ae!==void 0?ae:s.takes??null,Ce=p("arrive"),ge=this.arriveDraft!==void 0?this.arriveDraft:Ce!==void 0?Ce:s.arrive_by,Be=p("leave"),ve=this.leaveDraft!==void 0?this.leaveDraft:Be!==void 0?Be:s.leave_by??null,Ne=(b,y)=>{let P=b==="arrive",S=P?s.start:s.end,M=D=>()=>P?this.nudgeArrive(s,D):this.nudgeLeave(s,D),z=(D,F,xe,E)=>u`<button
          type="button"
          class="step"
          aria-label=${F}
          ?disabled=${h||E}
          @pointerdown=${()=>this.startHold(M(D))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(M(D))}
        >
          ${xe}
        </button>`;return u`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${P?"Arrive":"Leave"}</span>
          <span class="field-hint">${rn(y-S)}</span>
        </span>
        <span class="stepper">
          ${z(-5,"Five minutes earlier","−",!P&&y-5<=s.start)}
          <span class="arrive-value">${R(y)}</span>
          ${z(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${P?"Arrive on time":"Leave at the end"}
            ?disabled=${h}
            @click=${()=>P?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},le=s.sides.includes("pick")||s.own!=null,Re=ge!=null||this.timesOpen.arrive,je=le&&(ve!=null||this.timesOpen.leave),He=b=>()=>{this.timesOpen={...this.timesOpen,[b]:!0}},Ie=()=>u`${Re?Ne("arrive",ge??s.start):x}
      ${je?Ne("leave",ve??s.end):x}
      ${!Re||!je&&le?u`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${Re?x:u`<button type="button" class="chip" ?disabled=${h} @click=${He("arrive")}>Arrive early or late</button>`}
              ${!je&&le?u`<button type="button" class="chip" ?disabled=${h} @click=${He("leave")}>Leave early or late</button>`:x}
            </div>
          </div>`:x}`,Fe=s.sides.includes("drop")&&s.sides.includes("pick"),ze=Fe&&(_||this.stayDraft===s.id),Ue=()=>{let b=Fe?u`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${ze?"false":"true"}
              ?disabled=${h}
              @click=${()=>{this.stayDraft=null,s.stay&&this.toggleStay(s,!1,k)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${ze?"true":"false"}
              ?disabled=${h}
              @click=${()=>{k?this.toggleStay(s,!0,k):this.stayDraft=s.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:x;if(!ze)return u`${b} ${f("drop")} ${f("pick")}`;let y=_&&m?s.drop:"";return u`${b}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${y?x:u`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(P=>u`<button
                type="button"
                class="choice"
                aria-pressed=${y===P?"true":"false"}
                ?disabled=${h}
                @click=${()=>{if(y===P||!this.backend)return;let S=this.backend;this.stayDraft=null,this.save("stay",!0,()=>S.setRide(s.id,"both",P,this.scope,!0))}}
              >
                ${ee(e,P)}
              </button>`)}
          </div>
          ${y?w("both",y):x}
        </div>`},ne=[],ye=b=>b==="none"?"Not needed":ri(e,b),G=b=>r.includes(b)?ee(e,b):ie(e,b),pe=(b,y,P)=>{y===""&&!P.length||ne.push(`${b}: ${[y===""?"TBD":ye(y),...P.map(G)].join(", ")}`)},re=b=>s.no_ride_unless_named&&b==="none"?"":b;s.own||pe("Drop-off",re(s.drop),s.along),s.own||pe("Pick-up",re(s.pick),s.pick_along??[]),!s.own&&s.stay&&ne.push("Stay: yes"),N&&ne.push(`Takes: ${s.takes} min`),s.own&&s.along.length&&ne.push(`Take along: ${s.along.map(G).join(", ")}`),s.arrive_by!=null&&s.arrive_by!==s.start&&ne.push(`Arrive: ${rn(s.arrive_by-s.start)}`),s.leave_by!=null&&s.leave_by!==s.end&&ne.push(`Leave: ${rn(s.leave_by-s.end)}`);let We=p("attending"),ue=We!==void 0?!!We:s.attending!==!1;s.attending===!1&&ne.splice(0,ne.length,"Attending: no");let Pe=o.date===this.today().date?"":`${oe(o.date)} · `,c=vn(s),v=u`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${d} · ${s.title}</span>
          <span class="ed-meta">${Pe}${N?"any time ":""}${c}${s.place_name&&!s.place.startsWith("?")?` · ${s.place_name}`:""}</span>
          ${this.renderForLine(e,o,s)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(s.busy_only){let b=s.place_name&&s.place_name!==s.title?s.place_name:"",y=s.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":s.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return u`${v}
        ${this.pending?u`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
        ${b?u`<div class="field"><span class="field-label">Where</span><span class="field-hint">${b}</span></div>`:x}
        <p class="field-hint">
          ${ue?`This blocks ${d}’s time: ${d} can’t drive then, so a ride that needs ${d} shows as a problem.`:`Not going, so it doesn’t block ${d}’s time, and ${d} can drive then.`}
          ${y}
        </p>
        <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!ue)}>
          ${ue?`${d} isn’t going this time`:`${d} is going after all`}
        </button>
        ${s.problems.length?u`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:x}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${s.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return s.where==="home"?u`${v}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${d} can’t get home in time, the board shows it as a clash.</p>`:u`
      ${v}
      ${this.pending?u`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
      ${s.recurring?u`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${oe(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:x}
      ${ue?u`${s.where==="anywhere"?u`<p class="field-hint">
                  ${s.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:x}
            ${s.own?u`<p class="field-hint">${this.ownHint(e,s)}</p>`:Ue()}
      ${s.own?u`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${H!=null?`Takes ${H} min, any time ${R(s.start)}–${R(s.end)}`:"At its set time"}</span>
            </span>
            ${H!=null?u`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${h||H<=5} @click=${()=>this.setTakes(s,Math.max(5,H-5))}>−</button>
                  <span class="arrive-value">${H} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${h||H+5>s.end-s.start} @click=${()=>this.setTakes(s,H+5)}>+</button>
                </span>`:x}
          </div>
          <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setTakes(s,H!=null?null:Math.min(10,Math.max(5,s.end-s.start)))}>
            ${H!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:x}
      ${te&&L.length?u`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${L.map(b=>u`<button type="button" class="chip" aria-pressed=${T.includes(b)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,b)}>
                  ${r.includes(b)?ee(e,b):ie(e,b)}
                </button>`)}
            </div>
          </div>`:x}
      ${N?x:Ie()}
`:u`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${d} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!ue)}>
        ${ue?`${d} isn’t going this time`:`${d} is going after all`}
      </button>
      ${s.problems.length?u`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:x}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${ne.length?ne.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${ue&&!s.own?u`<p class="field-hint">Tap a selected driver again to clear it.</p>`:x}
    `}};Kt.styles=go,Kt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},timesOpen:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Kt);function id(i,t){let o=Math.max(1,Math.round(i/14)),s=i/o,r=[],l=[];for(let h=0;h<=o;h++){let p=+(h*s).toFixed(1);r.push(`${p},${h%2?5:0}`),l.push(`${p},${t-(h%2?0:5)}`)}let d=`M${r.join(" L")} L${[...l].reverse().join(" L")} Z`;return u`<svg width=${i} height=${t} viewBox="0 0 ${i} ${t}">
    ${Y`<path class="fold-fill" d=${d}></path>
      <path class="fold-edge" d=${`M${r.join(" L")}`}></path>
      <path class="fold-edge" d=${`M${l.join(" L")}`}></path>`}
  </svg>`}var Vt=class extends fe{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=vs(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(At);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new ln(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return u`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?u`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:x}`}};Vt.styles=Ke`
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
