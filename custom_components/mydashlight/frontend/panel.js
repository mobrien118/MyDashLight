var nr=Object.defineProperty;var On=(i,t)=>()=>(i&&(t=i(i=0)),t);var ir=(i,t)=>{for(var e in t)nr(i,e,{get:t[e],enumerable:!0})};function _n(i){if(typeof i!="string"||!i)throw new Error("expected a non-empty string, got: "+i)}function Ei(i){if(typeof i!="number")throw new Error("expected a number, got: "+i)}function wa(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function bo(i){return wa(i,t=>t.unicode)}function $a(i){function t(e,n,o){let s=n?i.createObjectStore(e,{keyPath:n}):i.createObjectStore(e);if(o)for(let[r,[l,d]]of Object.entries(o))s.createIndex(r,l,{multiEntry:d});return s}t(yt),t(ot,ga,{[yo]:[fa,!0],[wo]:[[ma,ba]],[$o]:[va,!0]}),t(Si,void 0,{[xo]:[""]})}function ko(i,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>i(e.result)}async function ka(i){let t=await new Promise((e,n)=>{let o=indexedDB.open(i,pa);Ci[i]=o,o.onupgradeneeded=s=>{s.oldVersion<ua&&$a(o.result)},ko(e,n,o)});return t.onclose=()=>Mi(i),t}function Ta(i){return Pn[i]||(Pn[i]=ka(i)),Pn[i]}function Le(i,t,e,n){return new Promise((o,s)=>{let r=i.transaction(t,e,{durability:"relaxed"}),l=typeof t=="string"?r.objectStore(t):t.map(h=>r.objectStore(h)),d;n(l,r,h=>{d=h}),r.oncomplete=()=>o(d),r.onerror=()=>s(r.error)})}function Mi(i){let t=Ci[i],e=t&&t.result;if(e){e.close();let n=An[i];if(n)for(let o of n)o()}delete Ci[i],delete Pn[i],delete An[i]}function Ea(i){return new Promise((t,e)=>{Mi(i);let n=indexedDB.deleteDatabase(i);ko(t,e,n)})}function _a(i,t){let e=An[i];e||(e=An[i]=[]),e.push(t)}function vt(i){return i.split(/[\s_]+/).map(t=>!t.match(/\w/)||Ca.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function To(i){return i.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Pa)}function Sa(i){return i.map(({annotation:e,emoticon:n,group:o,order:s,shortcodes:r,skins:l,tags:d,emoji:h,version:u})=>{let a=[...new Set(To([...(r||[]).map(vt).flat(),...(d||[]).map(vt).flat(),...vt(e),n]))].sort(),f={annotation:e,group:o,order:s,tags:d,tokens:a,unicode:h,version:u};if(n&&(f.emoticon=n),r&&(f.shortcodes=r),l){f.skinTones=[],f.skinUnicodes=[],f.skinVersions=[];for(let{tone:x,emoji:k,version:m}of l)f.skinTones.push(x),f.skinUnicodes.push(k),f.skinVersions.push(m)}return f})}function Eo(i,t,e,n){i[t](e).onsuccess=o=>n&&n(o.target.result)}function st(i,t,e){Eo(i,"get",t,e)}function _o(i,t,e){Eo(i,"getAll",t,e)}function Di(i){i.commit&&i.commit()}function Aa(i,t){let e=i[0];for(let n=1;n<i.length;n++){let o=i[n];t(e)>t(o)&&(e=o)}return e}function Co(i,t){let e=Aa(i,o=>o.length),n=[];for(let o of e)i.some(s=>s.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Ma(i){return!await Li(i,yt,Sn)}async function Da(i,t,e){let[n,o]=await Promise.all([_i,Sn].map(s=>Li(i,yt,s)));return n===e&&o===t}async function La(i,t){return Le(i,ot,wt,(n,o,s)=>{let r,l=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=d=>{let h=d.target.result;for(let u of h)if(r=u.unicode,t(u))return s(u);if(h.length<50)return s();l()}};l()})}async function Po(i,t,e,n){try{let o=Sa(t);await Le(i,[ot,yt],Ai,([s,r],l)=>{let d,h,u=0;function a(){++u===2&&f()}function f(){if(!(d===n&&h===e)){s.clear();for(let x of o)s.put(x);r.put(n,_i),r.put(e,Sn),Di(l)}}st(r,_i,x=>{d=x,a()}),st(r,Sn,x=>{h=x,a()})})}finally{}}async function Ra(i,t){return Le(i,ot,wt,(e,n,o)=>{let s=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);_o(e.index(wo),s,o)})}async function So(i,t){let e=To(vt(t));return e.length?Le(i,ot,wt,(n,o,s)=>{let r=[],l=()=>{r.length===e.length&&d()},d=()=>{let h=Co(r,u=>u.unicode);s(h.sort((u,a)=>u.order<a.order?-1:1))};for(let h=0;h<e.length;h++){let u=e[h],a=h===e.length-1?IDBKeyRange.bound(u,u+"￿",!1,!0):IDBKeyRange.only(u);_o(n.index(yo),a,f=>{r.push(f),l()})}}):[]}async function ja(i,t){let e=await So(i,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(s=>s.toLowerCase()).includes(t.toLowerCase()))[0]||null:await La(i,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Ia(i,t){return Le(i,ot,wt,(e,n,o)=>st(e,t,s=>{if(s)return o(s);st(e.index($o),t,r=>o(r||null))}))}function Li(i,t,e){return Le(i,t,wt,(n,o,s)=>st(n,e,s))}function za(i,t,e,n){return Le(i,t,Ai,(o,s)=>{o.put(n,e),Di(s)})}function Oa(i,t){return Le(i,Si,Ai,(e,n)=>st(e,t,o=>{e.put((o||0)+1,t),Di(n)}))}function Ba(i,t,e){return e===0?[]:Le(i,[Si,ot],wt,([n,o],s,r)=>{let l=[];n.index(xo).openCursor(void 0,"prev").onsuccess=d=>{let h=d.target.result;if(!h)return r(l);function u(x){if(l.push(x),l.length===e)return r(l);h.continue()}let a=h.primaryKey,f=t.byName(a);if(f)return u(f);st(o,a,x=>{if(x)return u(x);h.continue()})}})}function Na(i,t){let e=new Map;for(let o of i){let s=t(o);for(let r of s){let l=e;for(let h=0;h<r.length;h++){let u=r.charAt(h),a=l.get(u);a||(a=new Map,l.set(u,a)),l=a}let d=l.get(Cn);d||(d=[],l.set(Cn,d)),d.push(o)}}return(o,s)=>{let r=e;for(let h=0;h<o.length;h++){let u=o.charAt(h),a=r.get(u);if(a)r=a;else return[]}if(s)return r.get(Cn)||[];let l=[],d=[r];for(;d.length;){let u=[...d.shift().entries()].sort((a,f)=>a[0]<f[0]?-1:1);for(let[a,f]of u)a===Cn?l.push(...f):d.push(f)}return l}}function Fa(i){let t=i&&Array.isArray(i),e=t&&i.length&&(!i[0]||Ha.some(n=>!(n in i[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function vo(i){Fa(i);let t=(f,x)=>f.name.toLowerCase()<x.name.toLowerCase()?-1:1,e=i.sort(t),o=Na(i,f=>{let x=new Set;if(f.shortcodes)for(let k of f.shortcodes)for(let m of vt(k))x.add(m);return x}),s=f=>o(f,!0),r=f=>o(f,!1),l=f=>{let x=vt(f),k=x.map((m,$)=>($<x.length-1?s:r)(m));return Co(k,m=>m.name).sort(t)},d=new Map,h=new Map;for(let f of i){h.set(f.name.toLowerCase(),f);for(let x of f.shortcodes||[])d.set(x.toLowerCase(),f)}return{all:e,search:l,byShortcode:f=>d.get(f.toLowerCase()),byName:f=>h.get(f.toLowerCase())}}function Ft(i){if(!i)return i;if(Ua&&(i=structuredClone(i)),delete i.tokens,i.skinTones){let t=i.skinTones.length;i.skins=Array(t);for(let e=0;e<t;e++)i.skins[e]={tone:i.skinTones[e],unicode:i.skinUnicodes[e],version:i.skinVersions[e]};delete i.skinTones,delete i.skinUnicodes,delete i.skinVersions}return i}function Ao(i){i||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Ka(i){if(!i||!Array.isArray(i)||!i[0]||typeof i[0]!="object"||Wa.some(t=>!(t in i[0])))throw new Error("Emoji data is in the wrong format")}function Mo(i,t){if(Math.floor(i.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+i.status)}async function Va(i){let t=await fetch(i,{method:"HEAD"});Mo(t,i);let e=t.headers.get("etag");return Ao(e),e}async function Pi(i){let t=await fetch(i);Mo(t,i);let e=t.headers.get("etag");Ao(e);let n=await t.json();return Ka(n),[e,n]}function Ga(i){for(var t="",e=new Uint8Array(i),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function qa(i){for(var t=i.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=i.charCodeAt(o);return e}async function Do(i){let t=JSON.stringify(i),e=qa(t),n=await crypto.subtle.digest("SHA-1",e),o=Ga(n);return btoa(o)}async function Ya(i,t){let e,n=await Va(t);if(!n){let o=await Pi(t);n=o[0],e=o[1],n||(n=await Do(e))}await Da(i,t,n)||(e||(e=(await Pi(t))[1]),await Po(i,e,t,n))}async function Xa(i,t){let[e,n]=await Pi(t);e||(e=await Do(n)),await Po(i,n,t,e)}async function Za(i,t){try{await Ya(i,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var pa,ua,ot,yt,Si,fa,yo,ga,xo,ma,ba,wo,_i,Sn,mo,wt,Ai,$o,va,ya,xa,Ci,Pn,An,Ca,Pa,Cn,Ha,Ua,Wa,xt,Ri=On(()=>{pa=1,ua=1,ot="emoji",yt="keyvalue",Si="favorites",fa="tokens",yo="tokens",ga="unicode",xo="count",ma="group",ba="order",wo="group-order",_i="eTag",Sn="url",mo="skinTone",wt="readonly",Ai="readwrite",$o="skinUnicodes",va="skinUnicodes",ya="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",xa="en";Ci={},Pn={},An={};Ca=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Pa=2;Cn="";Ha=["name","url"];Ua=typeof wrappedJSObject<"u";Wa=["annotation","emoji","group","order","version"];xt=class{constructor({dataSource:t=ya,locale:e=xa,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=vo(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Ta(this._dbName);_a(this._dbName,this._clear);let e=this.dataSource;await Ma(t)?await Xa(t,e):this._lazyUpdate=Za(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Ei(t),await this.ready(),bo(await Ra(this._db,t)).map(Ft)}async getEmojiBySearchQuery(t){_n(t),await this.ready();let e=this._custom.search(t),n=bo(await So(this._db,t)).map(Ft);return[...e,...n]}async getEmojiByShortcode(t){_n(t),await this.ready();let e=this._custom.byShortcode(t);return e||Ft(await ja(this._db,t))}async getEmojiByUnicodeOrName(t){_n(t),await this.ready();let e=this._custom.byName(t);return e||Ft(await Ia(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Li(this._db,yt,mo)||0}async setPreferredSkinTone(t){return Ei(t),await this.ready(),za(this._db,yt,mo,t)}async incrementFavoriteEmojiCount(t){return _n(t),await this.ready(),Oa(this._db,t)}async getTopFavoriteEmoji(t){return Ei(t),await this.ready(),(await Ba(this._db,this._custom,t)).map(Ft)}set customEmoji(t){this._custom=vo(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Mi(this._dbName)}async delete(){await this._shutdown(),await Ea(this._dbName)}}});function Ro(i){return i.unicode.includes("‍")}function rl(i){let t=jo(i,"#000"),e=jo(i,"#fff");return t&&e&&ol(t,e)}function al(){let i=Object.entries(Qa);try{for(let[t,e]of i)if(rl(t))return e}catch{}finally{}return i[0][1]}function ul(i,t){if(t===0)return i;let e=i.indexOf(cl);return e!==-1?i.substring(0,e)+String.fromCodePoint(hl+t-1)+i.substring(e):(i.endsWith(ll)&&(i=i.substring(0,i.length-1)),i+dl+String.fromCodePoint(pl+t-1))}function _e(i){i.preventDefault(),i.stopPropagation()}function Oi(i,t,e){return t+=i?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Wo(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function fl(i,t){let e=n=>{let o={};for(let s of n)typeof s.tone=="number"&&s.version<=t&&(o[s.tone]=s.unicode);return o};return i.map(({unicode:n,skins:o,shortcodes:s,url:r,name:l,category:d,annotation:h})=>({unicode:n,name:l,shortcodes:s,url:r,category:d,annotation:h,id:n||l,skins:o&&e(o)}))}function ml(i,t,e){let n;gl?(n=new ResizeObserver(e),n.observe(i)):Dn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Io(i){{let t=document.createRange();return t.selectNode(i.firstChild),t.getBoundingClientRect().width}}function zo(i,t,e){let n=Io(t);if(!n){if(!rt){rt=e.cloneNode(!0);let o=getComputedStyle(e);for(let s of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])rt.style.setProperty(s,o.getPropertyValue(s),"important")}try{return document.body.appendChild(rt),rt.firstChild.nodeValue=i,Io(rt)}finally{rt.remove()}}return n}function vl(i,t,e){let n=!0;for(let o of i){let s=e(o);if(!s)continue;typeof Bi>"u"&&(Bi=zo(bl,t,t));let l=zo(o.unicode,s,t)/1.8<Bi;Ui.set(o.unicode,l),l||(n=!1)}return n}function yl(i){return Wo(i,t=>t)}function xl(i){i&&(i.scrollTop=0)}function Ut(i,t,e){let n=i.get(t);return n||(n=e(),i.set(t,n)),n}function Oo(i){return""+i}function wl(i){let t=document.createElement("template");return t.innerHTML=i,t}function _l(i,t){El?i.replaceChildren(...t):(i.innerHTML="",i.append(...t))}function Cl(i,t){let e=i.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Pl(i,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Cl(n,i):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&_l(n,i)}function Sl(i,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:s,attributeName:r,attributeValuePre:l,attributeValuePost:d}}=e,h=i[s];if(o!==h)if(e.currentExpression=h,r)if(h===null)n.removeAttribute(r);else{let u=l+Oo(h)+d;n.setAttribute(r,u)}else{let u;Array.isArray(h)?Pl(h,e):h instanceof Element?(u=h,n.replaceWith(u)):n.nodeValue=Oo(h),u&&(e.targetNode=u)}}}function Al(i){let t="",e=!1,n=!1,o=-1,s=new Map,r=[],l=0;for(let h=0,u=i.length;h<u;h++){let a=i[h];if(t+=a.slice(l),h===u-1)break;for(let g=0;g<a.length;g++)switch(a.charAt(g)){case"<":{a.charAt(g+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let f=r[r.length-1],x=Ut(s,f,()=>[]),k,m,$;if(n){let g=/(\S+)="?([^"=]*)$/.exec(a);k=g[1],m=g[2];let T=/^([^">]*)("?)/.exec(i[h+1]);$=T[1],t=t.slice(0,-1*g[0].length),l=T[0].length}else l=0;let _={attributeName:k,attributeValuePre:m,attributeValuePost:$,expressionIndex:h};x.push(_),!e&&!n&&(t+=" ")}return{template:wl(t),elementsToBindings:s}}function Bo(i,t,e){for(let n=0;n<i.length;n++){let o=i[n],s=o.attributeName?t:t.firstChild,r={binding:o,targetNode:s,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Ml(i,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Bo(n,i,e);else{let o=document.createTreeWalker(i,NodeFilter.SHOW_ELEMENT),s=i,r=-1;do{let l=t.get(++r);l&&Bo(l,s,e)}while(s=o.nextNode())}return e}function Dl(i){let{template:t,elementsToBindings:e}=Ut($l,i,()=>Al(i)),n=t.cloneNode(!0).content.firstElementChild,o=Ml(n,e);return function(r){return Sl(r,o),n}}function Ll(i){let t=Ut(kl,i,()=>new Map),e=Tl;function n(s,...r){let l=Ut(t,s,()=>new Map);return Ut(l,e,()=>Dl(s))(r)}function o(s,r,l){return s.map((d,h)=>{let u=e;e=l(d);try{return r(d,h)}finally{e=u}})}return{map:o,html:n}}function Rl(i,t,e,n,o,s,r,l,d){let{labelWithSkin:h,titleForEmoji:u,unicodeWithSkin:a}=e,{html:f,map:x}=Ll(t);function k(g,T,D){return x(g,(B,ne)=>f`<button role="${T?"option":"menuitem"}" aria-selected="${T?ne===t.activeSearchItem:null}" aria-label="${h(B,t.currentSkinTone)}" title="${u(B)}" class="${"emoji"+(T&&ne===t.activeSearchItem?" active":"")+(B.unicode?"":" custom-emoji")}" id="${`${D}-${B.id}`}" style="${B.unicode?null:`--custom-emoji-background: url(${JSON.stringify(B.url)})`}">${B.unicode?a(B,t.currentSkinTone):""}</button>`,B=>`${D}-${B.id}`)}let $=f`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${x(t.skinTones,(g,T)=>f`<div id="skintone-${T}" class="emoji ${T===t.activeSkinTone?"active":""}" aria-selected="${T===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[T]}" aria-label="${t.i18n.skinTones[T]}">${g}</div>`,g=>g)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${x(t.groups,g=>f`<button role="tab" class="nav-button" aria-controls="tab-${g.id}" aria-label="${t.i18n.categories[g.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===g.id}" title="${t.i18n.categories[g.name]}" data-group-id="${g.id}"><div class="nav-emoji emoji">${g.emoji}</div></button>`,g=>g.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${x(t.currentEmojisWithCategories,(g,T)=>f`<div><div id="menu-label-${T}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:g.category?g.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${T!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(g.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${T}" id="${t.searchMode?"search-results":null}">${k(g.emojis,t.searchMode,"emo")}</div></div>`,g=>g.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${k(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,_=(g,T)=>{for(let D of i.querySelectorAll(`[${g}]`))T(D,D.getAttribute(g))};if(d){i.appendChild($);for(let g of["click","focusout","input","keydown","keyup"])_(`data-on-${g}`,(T,D)=>{T.addEventListener(g,n[D])});_("data-ref",(g,T)=>{s[T]=g}),r.addEventListener("abort",()=>{i.removeChild($)})}_("data-action",(g,T)=>{let D=l.get(T);D||l.set(T,D=new WeakSet),D.has(g)||(D.add(g),o[T](g))})}function jl(i){let t=!1,e,n=new Map,o=new Set,s,r=()=>{if(t)return;let h=[...o];o.clear();try{for(let u of h)u()}finally{s=!1,o.size&&(s=!0,Ln(r))}},l=new Proxy({},{get(h,u){if(e){let a=n.get(u);a||(a=new Set,n.set(u,a)),a.add(e)}return h[u]},set(h,u,a){if(h[u]!==a){h[u]=a;let f=n.get(u);if(f){for(let x of f)o.add(x);s||(s=!0,Ln(r))}}return!0}}),d=h=>{let u=()=>{let a=e;e=u;try{return h()}finally{e=a}};return u()};return i.addEventListener("abort",()=>{t=!0}),{state:l,createEffect:d}}function Ni(i,t,e){if(i.length!==t.length)return!1;for(let n=0;n<i.length;n++)if(!e(i[n],t[n]))return!1;return!0}function Il(i,t,e){{let n=i.closest(".tabpanel"),o=No.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),No.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(i)}}function zl(i,t){let e={},n=new AbortController,o=n.signal,{state:s,createEffect:r}=jl(o),l=new Map;Mn(s,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),Mn(s,t),Mn(s,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:nl,isRtl:!1,currentGroupIndex:0,groups:ji,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{s.currentGroup!==s.groups[s.currentGroupIndex]&&(s.currentGroup=s.groups[s.currentGroupIndex])});let d=c=>{i.getElementById(c).focus()},h=c=>i.getElementById(`emo-${c.id}`),u=(c,v)=>{e.rootElement.dispatchEvent(new CustomEvent(c,{detail:v,bubbles:!0,composed:!0}))},a=(c,v)=>c.id===v.id,f=(c,v)=>{let{category:b,emojis:y}=c,{category:P,emojis:S}=v;return b!==P?!1:Ni(y,S,a)},x=c=>{Ni(s.currentEmojis,c,a)||(s.currentEmojis=c)},k=c=>{s.searchMode!==c&&(s.searchMode=c)},m=c=>{Ni(s.currentEmojisWithCategories,c,f)||(s.currentEmojisWithCategories=c)},$=(c,v)=>v&&c.skins&&c.skins[v]||c.unicode,T={labelWithSkin:(c,v)=>yl([c.name||$(c,v),c.annotation,...c.shortcodes||Hi].filter(Boolean)).join(", "),titleForEmoji:c=>c.annotation||(c.shortcodes||Hi).join(", "),unicodeWithSkin:$},D={onClickSkinToneButton:ue,onEmojiClick:ie,onNavClick:Ie,onNavKeydown:Fe,onSearchKeydown:He,onSkinToneOptionsClick:q,onSkinToneOptionsFocusOut:fe,onSkinToneOptionsKeydown:ae,onSkinToneOptionsKeyup:We,onSearchInput:Pe},B={calculateEmojiGridStyle:N,updateOnIntersection:Ce},ne=!0;r(()=>{Rl(i,s,T,D,B,e,o,l,ne),ne=!1}),s.emojiVersion||zi().then(c=>{c||(s.message=s.i18n.emojiUnsupportedMessage)}),r(()=>{async function c(){let v=!1,b=setTimeout(()=>{v=!0,s.message=s.i18n.loadingMessage},el);try{await s.database.ready(),s.databaseLoaded=!0}catch(y){console.error(y),s.message=s.i18n.networkErrorMessage}finally{clearTimeout(b),v&&(v=!1,s.message="")}}s.database&&c()}),r(()=>{s.pickerStyle=`
      --num-groups: ${s.groups.length}; 
      --indicator-opacity: ${s.searchMode?0:1}; 
      --num-skintones: ${Lo};`}),r(()=>{s.customEmoji&&s.database&&ce()}),r(()=>{s.customEmoji&&s.customEmoji.length?s.groups!==Fi&&(s.groups=Fi):s.groups!==ji&&(s.currentGroupIndex&&s.currentGroupIndex--,s.groups=ji)}),r(()=>{async function c(){s.databaseLoaded&&(s.currentSkinTone=await s.database.getPreferredSkinTone())}c()}),r(()=>{s.skinTones=Array(Lo).fill().map((c,v)=>ul(s.skinToneEmoji,v))}),r(()=>{s.skinToneButtonText=s.skinTones[s.currentSkinTone]}),r(()=>{s.skinToneButtonLabel=s.i18n.skinToneLabel.replace("{skinTone}",s.i18n.skinTones[s.currentSkinTone])}),r(()=>{async function c(){let{database:v}=s,b=(await Promise.all(il.map(y=>v.getEmojiByUnicodeOrName(y)))).filter(Boolean);s.defaultFavoriteEmojis=b}s.databaseLoaded&&c()});function ce(){let{customEmoji:c,database:v}=s,b=c||Hi;v.customEmoji!==b&&(v.customEmoji=b)}r(()=>{async function c(){ce();let{database:v,defaultFavoriteEmojis:b,numColumns:y}=s,P=await v.getTopFavoriteEmoji(y),S=await he(Wo([...P,...b],M=>M.unicode||M.name).slice(0,y));s.currentFavorites=S}s.databaseLoaded&&s.defaultFavoriteEmojis&&c()});function N(c){ml(c,o,()=>{{let v=getComputedStyle(e.rootElement),b=parseInt(v.getPropertyValue("--num-columns"),10),y=v.getPropertyValue("direction")==="rtl";s.numColumns=b,s.isRtl=y}})}function Ce(c){Il(c,o,v=>{for(let{target:b,isIntersecting:y}of v)b.classList.toggle("onscreen",y)})}r(()=>{async function c(){let{searchText:v,currentGroup:b,databaseLoaded:y,customEmoji:P}=s;if(!y)s.currentEmojis=[],s.searchMode=!1;else if(v.length>=Ja){let S=await je(v);s.searchText===v&&(x(S),k(!0))}else{let{id:S}=b;if(S!==-1||P&&P.length){let M=await Re(S);s.currentGroup.id===S&&(x(M),k(!1))}}}c()});let be=()=>{Dn(()=>xl(e.tabpanelElement))};r(()=>{let{currentEmojis:c,emojiVersion:v}=s,b=c.filter(y=>y.unicode).filter(y=>Ro(y)&&!Ui.has(y.unicode));if(!v&&b.length)x(c),Dn(()=>Be(b));else{let y=v?c:c.filter(ye);x(y),be()}});function Be(c){vl(c,e.baselineEmoji,h)?be():s.currentEmojis=[...s.currentEmojis]}function ye(c){return!c.unicode||!Ro(c)||Ui.get(c.unicode)}async function Ne(c){let v=s.emojiVersion||await zi();return c.filter(({version:b})=>!b||b<=v)}async function he(c){return fl(c,s.emojiVersion||await zi())}async function Re(c){let v=c===-1?s.customEmoji:await s.database.getEmojiByGroup(c);return he(await Ne(v))}async function je(c){return he(await Ne(await s.database.getEmojiBySearchQuery(c)))}r(()=>{}),r(()=>{function c(){let{searchMode:b,currentEmojis:y}=s;if(b)return[{category:"",emojis:y}];let P=new Map;for(let S of y){let M=S.category||"",z=P.get(M);z||(z=[],P.set(M,z)),z.push(S)}return[...P.entries()].map(([S,M])=>({category:S,emojis:M})).sort((S,M)=>s.customCategorySorting(S.category,M.category))}let v=c();m(v)}),r(()=>{s.activeSearchItemId=s.activeSearchItem!==-1&&s.currentEmojis[s.activeSearchItem].id}),r(()=>{let{rawSearchText:c}=s;Fo(()=>{s.searchText=(c||"").trim(),s.activeSearchItem=-1})});function He(c){if(!s.searchMode||!s.currentEmojis.length)return;let v=b=>{_e(c),s.activeSearchItem=Oi(b,s.activeSearchItem,s.currentEmojis)};switch(c.key){case"ArrowDown":return v(!1);case"ArrowUp":return v(!0);case"Enter":if(s.activeSearchItem===-1)s.activeSearchItem=0;else return _e(c),Ue(s.currentEmojis[s.activeSearchItem].id)}}function Ie(c){let{target:v}=c,b=v.closest(".nav-button");if(!b)return;let y=parseInt(b.dataset.groupId,10);e.searchElement.value="",s.rawSearchText="",s.searchText="",s.activeSearchItem=-1,s.currentGroupIndex=s.groups.findIndex(P=>P.id===y)}function Fe(c){let{target:v,key:b}=c,y=P=>{P&&(_e(c),P.focus())};switch(b){case"ArrowLeft":return y(v.previousElementSibling);case"ArrowRight":return y(v.nextElementSibling);case"Home":return y(v.parentElement.firstElementChild);case"End":return y(v.parentElement.lastElementChild)}}async function ze(c){let v=await s.database.getEmojiByUnicodeOrName(c),b=[...s.currentEmojis,...s.currentFavorites].find(P=>P.id===c),y=b.unicode&&$(b,s.currentSkinTone);return await s.database.incrementFavoriteEmojiCount(c),{emoji:v,skinTone:s.currentSkinTone,...y&&{unicode:y},...b.name&&{name:b.name}}}async function Ue(c){let v=ze(c);u("emoji-click-sync",v),u("emoji-click",await v)}function ie(c){let{target:v}=c;if(!v.classList.contains("emoji"))return;_e(c);let b=v.id.substring(4);Ue(b)}function xe(c){s.currentSkinTone=c,s.skinTonePickerExpanded=!1,d("skintone-button"),u("skin-tone-change",{skinTone:c}),s.database.setPreferredSkinTone(c)}function q(c){let{target:{id:v}}=c,b=v&&v.match(/^skintone-(\d)/);if(!b)return;_e(c);let y=parseInt(b[1],10);xe(y)}function ue(c){s.skinTonePickerExpanded=!s.skinTonePickerExpanded,s.activeSkinTone=s.currentSkinTone,s.skinTonePickerExpanded&&(_e(c),Dn(()=>d("skintone-list")))}r(()=>{s.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{s.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):s.skinTonePickerExpandedAfterAnimation=!1});function ae(c){if(!s.skinTonePickerExpanded)return;let v=async b=>{_e(c),s.activeSkinTone=b};switch(c.key){case"ArrowUp":return v(Oi(!0,s.activeSkinTone,s.skinTones));case"ArrowDown":return v(Oi(!1,s.activeSkinTone,s.skinTones));case"Home":return v(0);case"End":return v(s.skinTones.length-1);case"Enter":return _e(c),xe(s.activeSkinTone);case"Escape":return _e(c),s.skinTonePickerExpanded=!1,d("skintone-button")}}function We(c){if(s.skinTonePickerExpanded)switch(c.key){case" ":return _e(c),xe(s.activeSkinTone)}}async function fe(c){let{relatedTarget:v}=c;(!v||v.id!=="skintone-list")&&(s.skinTonePickerExpanded=!1)}function Pe(c){s.rawSearchText=c.target.value}return{$set(c){Mn(s,c)},$destroy(){n.abort()}}}function Ho(i){i instanceof at||Object.setPrototypeOf(i,customElements.get(i.tagName.toLowerCase()).prototype)}var Fi,ji,Ja,Lo,Fo,Qa,el,tl,nl,il,Uo,sl,jo,ol,Ii,zi,Ui,ll,dl,cl,hl,pl,Dn,gl,bl,Bi,rt,$l,kl,Tl,El,Ln,No,Hi,Mn,Ol,Bl,Nl,Hl,Ko,Fl,at,Vo,Go=On(()=>{Ri();Fi=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([i,t,e])=>({id:i,emoji:t,name:e})),ji=Fi.slice(1),Ja=2,Lo=6,Fo=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Qa={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},el=1e3,tl="🖐️",nl=8,il=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Uo='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',sl=(i,t)=>i<t?-1:i>t?1:0,jo=(i,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Uo}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(i,0,0),n.getImageData(0,0,1,1).data},ol=(i,t)=>{let e=[...i].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};zi=()=>(Ii||(Ii=new Promise(i=>Fo(()=>i(al())))),Ii),Ui=new Map,ll="️",dl="\uD83C",cl="‍",hl=127995,pl=57339;Dn=requestAnimationFrame,gl=typeof ResizeObserver=="function";bl="😀";$l=new WeakMap,kl=new WeakMap,Tl=Symbol("un-keyed"),El="replaceChildren"in Element.prototype;Ln=typeof queueMicrotask=="function"?queueMicrotask:i=>Promise.resolve().then(i);No=new WeakMap;Hi=[],{assign:Mn}=Object;Ol="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Bl="en",Nl={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Hl=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Ko=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Fl=`:host{--emoji-font-family:${Uo}}`,at=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Hl+Fl,this.shadowRoot.appendChild(e),this._ctx={locale:Bl,dataSource:Ol,skinToneEmoji:tl,customCategorySorting:sl,customEmoji:null,i18n:Nl,emojiVersion:null,...t};for(let n of Ko)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Ho(this),this._cmp||(this._cmp=zl(this.shadowRoot,this._ctx))}disconnectedCallback(){Ho(this),Ln(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,s)=>s.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new xt({locale:t,dataSource:e}))}_dbFlush(){Ln(()=>this._dbCreate())}},Vo={};for(let i of Ko)Vo[i]={get(){return i==="database"&&this._dbCreate(),this._ctx[i]},set(t){if(i==="database")throw new Error("database is read-only");this._set(i,t)}};Object.defineProperties(at.prototype,Vo);customElements.get("emoji-picker")||customElements.define("emoji-picker",at)});var qo={};ir(qo,{Database:()=>xt,Picker:()=>at});var Yo=On(()=>{Go();Ri()});var Xt=globalThis,Zt=Xt.ShadowRoot&&(Xt.ShadyCSS===void 0||Xt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Bn=Symbol(),Ji=new WeakMap,Et=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Bn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Zt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ji.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ji.set(e,t))}return t}toString(){return this.cssText}},Qi=i=>new Et(typeof i=="string"?i:i+"",void 0,Bn),Ve=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[s+1],i[0]);return new Et(e,i,Bn)},es=(i,t)=>{if(Zt)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Xt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,i.appendChild(n)}},Nn=Zt?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Qi(e)})(i):i;var{is:sr,defineProperty:or,getOwnPropertyDescriptor:rr,getOwnPropertyNames:ar,getOwnPropertySymbols:lr,getPrototypeOf:dr}=Object,Jt=globalThis,ts=Jt.trustedTypes,cr=ts?ts.emptyScript:"",hr=Jt.reactiveElementPolyfillSupport,_t=(i,t)=>i,Hn={toAttribute(i,t){switch(t){case Boolean:i=i?cr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},is=(i,t)=>!sr(i,t),ns={attribute:!0,type:String,converter:Hn,reflect:!1,useDefault:!1,hasChanged:is};Symbol.metadata??=Symbol("metadata"),Jt.litPropertyMetadata??=new WeakMap;var Se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ns){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&or(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:s}=rr(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let l=o?.call(this);s?.call(this,r),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ns}static _$Ei(){if(this.hasOwnProperty(_t("elementProperties")))return;let t=dr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_t("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_t("properties"))){let e=this.properties,n=[...ar(e),...lr(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(Nn(o))}else t!==void 0&&e.push(Nn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return es(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let s=(n.converter?.toAttribute!==void 0?n.converter:Hn).toAttribute(e,n.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let s=n.getPropertyOptions(o),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Hn;this._$Em=o;let l=r.fromAttribute(e,s.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(t,e,n,o=!1,s){if(t!==void 0){let r=this.constructor;if(o===!1&&(s=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??is)(s,e)||n.useDefault&&n.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:s},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),s!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,s]of n){let{wrapped:r}=s,l=this[o];r!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,s,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Se.elementStyles=[],Se.shadowRootOptions={mode:"open"},Se[_t("elementProperties")]=new Map,Se[_t("finalized")]=new Map,hr?.({ReactiveElement:Se}),(Jt.reactiveElementVersions??=[]).push("2.1.2");var Un=globalThis,ss=i=>i,Qt=Un.trustedTypes,os=Qt?Qt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Wn="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,Kn="?"+Ae,pr=`<${Kn}>`,Ye=document,Pt=()=>Ye.createComment(""),St=i=>i===null||typeof i!="object"&&typeof i!="function",Vn=Array.isArray,hs=i=>Vn(i)||typeof i?.[Symbol.iterator]=="function",Fn=`[ 	
\f\r]`,Ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rs=/-->/g,as=/>/g,Ge=RegExp(`>|${Fn}(?:([^\\s"'>=/]+)(${Fn}*=${Fn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ls=/'/g,ds=/"/g,ps=/^(?:script|style|textarea|title)$/i,Gn=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),p=Gn(1),J=Gn(2),hd=Gn(3),Me=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),cs=new WeakMap,qe=Ye.createTreeWalker(Ye,129);function us(i,t){if(!Vn(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return os!==void 0?os.createHTML(t):t}var fs=(i,t)=>{let e=i.length-1,n=[],o,s=t===2?"<svg>":t===3?"<math>":"",r=Ct;for(let l=0;l<e;l++){let d=i[l],h,u,a=-1,f=0;for(;f<d.length&&(r.lastIndex=f,u=r.exec(d),u!==null);)f=r.lastIndex,r===Ct?u[1]==="!--"?r=rs:u[1]!==void 0?r=as:u[2]!==void 0?(ps.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=Ge):u[3]!==void 0&&(r=Ge):r===Ge?u[0]===">"?(r=o??Ct,a=-1):u[1]===void 0?a=-2:(a=r.lastIndex-u[2].length,h=u[1],r=u[3]===void 0?Ge:u[3]==='"'?ds:ls):r===ds||r===ls?r=Ge:r===rs||r===as?r=Ct:(r=Ge,o=void 0);let x=r===Ge&&i[l+1].startsWith("/>")?" ":"";s+=r===Ct?d+pr:a>=0?(n.push(h),d.slice(0,a)+Wn+d.slice(a)+Ae+x):d+Ae+(a===-2?l:x)}return[us(i,s+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},At=class i{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let s=0,r=0,l=t.length-1,d=this.parts,[h,u]=fs(t,e);if(this.el=i.createElement(h,n),qe.currentNode=this.el.content,e===2||e===3){let a=this.el.content.firstChild;a.replaceWith(...a.childNodes)}for(;(o=qe.nextNode())!==null&&d.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let a of o.getAttributeNames())if(a.endsWith(Wn)){let f=u[r++],x=o.getAttribute(a).split(Ae),k=/([.?@])?(.*)/.exec(f);d.push({type:1,index:s,name:k[2],strings:x,ctor:k[1]==="."?tn:k[1]==="?"?nn:k[1]==="@"?sn:Ze}),o.removeAttribute(a)}else a.startsWith(Ae)&&(d.push({type:6,index:s}),o.removeAttribute(a));if(ps.test(o.tagName)){let a=o.textContent.split(Ae),f=a.length-1;if(f>0){o.textContent=Qt?Qt.emptyScript:"";for(let x=0;x<f;x++)o.append(a[x],Pt()),qe.nextNode(),d.push({type:2,index:++s});o.append(a[f],Pt())}}}else if(o.nodeType===8)if(o.data===Kn)d.push({type:2,index:s});else{let a=-1;for(;(a=o.data.indexOf(Ae,a+1))!==-1;)d.push({type:7,index:s}),a+=Ae.length-1}s++}}static createElement(t,e){let n=Ye.createElement("template");return n.innerHTML=t,n}};function Xe(i,t,e=i,n){if(t===Me)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,s=St(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(i),o._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Xe(i,o._$AS(i,t.values),o,n)),t}var en=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Ye).importNode(e,!0);qe.currentNode=o;let s=qe.nextNode(),r=0,l=0,d=n[0];for(;d!==void 0;){if(r===d.index){let h;d.type===2?h=new dt(s,s.nextSibling,this,t):d.type===1?h=new d.ctor(s,d.name,d.strings,this,t):d.type===6&&(h=new on(s,this,t)),this._$AV.push(h),d=n[++l]}r!==d?.index&&(s=qe.nextNode(),r++)}return qe.currentNode=Ye,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},dt=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Xe(this,t,e),St(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==Me&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):hs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&St(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ye.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=At.createElement(us(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let s=new en(o,this),r=s.u(this.options);s.p(e),this.T(r),this._$AH=s}}_$AC(t){let e=cs.get(t.strings);return e===void 0&&cs.set(t.strings,e=new At(t)),e}k(t){Vn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let s of t)o===e.length?e.push(n=new i(this.O(Pt()),this.O(Pt()),this,this.options)):n=e[o],n._$AI(s),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=ss(t).nextSibling;ss(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ze=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,s){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=w}_$AI(t,e=this,n,o){let s=this.strings,r=!1;if(s===void 0)t=Xe(this,t,e,0),r=!St(t)||t!==this._$AH&&t!==Me,r&&(this._$AH=t);else{let l=t,d,h;for(t=s[0],d=0;d<s.length-1;d++)h=Xe(this,l[n+d],e,d),h===Me&&(h=this._$AH[d]),r||=!St(h)||h!==this._$AH[d],h===w?t=w:t!==w&&(t+=(h??"")+s[d+1]),this._$AH[d]=h}r&&!o&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},tn=class extends Ze{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},nn=class extends Ze{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},sn=class extends Ze{constructor(t,e,n,o,s){super(t,e,n,o,s),this.type=5}_$AI(t,e=this){if((t=Xe(this,t,e,0)??w)===Me)return;let n=this._$AH,o=t===w&&n!==w||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==w&&(n===w||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},on=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Xe(this,t)}},gs={M:Wn,P:Ae,A:Kn,C:1,L:fs,R:en,D:hs,V:Xe,I:dt,H:Ze,N:nn,U:sn,B:tn,F:on},ur=Un.litHtmlPolyfillSupport;ur?.(At,dt),(Un.litHtmlVersions??=[]).push("3.3.3");var ms=(i,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let s=e?.renderBefore??null;n._$litPart$=o=new dt(t.insertBefore(Pt(),s),s,void 0,e??{})}return o._$AI(i),o};var qn=globalThis,ge=class extends Se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ms(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Me}};ge._$litElement$=!0,ge.finalized=!0,qn.litElementHydrateSupport?.({LitElement:ge});var fr=qn.litElementPolyfillSupport;fr?.({LitElement:ge});(qn.litElementVersions??=[]).push("4.2.2");var ct="mydashlight",Td=`/api/${ct}/pair`,Ed=`/api/${ct}/pair/poll`,_d=`/${ct}`,Mt="pair";function bs(i){return i.length>4?`${i.slice(0,4)}-${i.slice(4)}`:i}function Yn(i){return i.toUpperCase().replace(/[^A-Z0-9]/g,"")}function vs(i){let t=new URLSearchParams(i);return t.has(Mt)?Yn(t.get(Mt)??""):null}function gr(i){if(i<60)return"just now";let t=Math.round(i/60);return`${t} minute${t===1?"":"s"} ago`}var Dt=class extends ge{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${ct}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${ct}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return p`<form @submit=${o=>{o.preventDefault();let s=Yn(this.typed);s&&this.check(s)}}>
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
      <p class="code">${bs(e.code??"")}</p>
      ${o?p`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:w}
      <p>
        A screen at ${e.address} asked ${gr(e.age??0)}. Check the code matches the one on the screen. It will be
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
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,p`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};Dt.styles=Ve`
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
  `,Dt.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Dt);function R(i){let t=Math.round(i),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function De(i){let t=Math.floor(Math.round(i)/60)%24;return`${R(i)} ${t<12?"AM":"PM"}`}function ys(i){let t=Math.floor(i/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function ht(i){let t=Math.max(0,Math.round(i)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function an(i){return i?`${ht(Math.abs(i))} ${i<0?"early":"late"}`:"on time"}function Xn(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var mr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),br=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),vr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function rn(i){return new Date(`${i}T12:00:00Z`)}function ve(i){let t=rn(i);return`${mr.format(t)}, ${vr.format(t)}`}function re(i){return br.format(rn(i))}function $e(i,t){return Math.round((rn(t).getTime()-rn(i).getTime())/864e5)}function Lt(i,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Lt("UTC",t)}let n=o=>e.find(s=>s.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function ln(i,t,e){let n=Math.floor((t.getTime()-i.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=Lt(e,i),s=Lt(e,t).date;return o.date===s?`at ${De(o.minutes)}`:`on ${re(o.date)} at ${De(o.minutes)}`}var W=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function $s(i){switch(i.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Je="mydashlight",yr=7,Zn=3e4,xs=3e4;function Jn(i){if(i instanceof W)return i;if(i&&typeof i=="object"){let t=i;if(typeof t.message=="string")return new W(String(t.code??"error"),t.message)}return typeof i=="number"?new W("connection_lost","Lost the connection to Home Assistant."):new W("error",String(i))}function ws(i,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new W("timeout","Home Assistant didn’t answer.")),t);i.then(s=>{clearTimeout(o),e(s)},s=>{clearTimeout(o),n(s)})})}var Rt=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},dn=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new W("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Rt(this.conn,`${Je}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new W("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},Zn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await ws(this.conn.sendMessagePromise({type:"call_service",domain:Je,service:"get_plan",service_data:{days:yr},return_response:!0}),xs);this.emit(t.response)}catch(t){this.fail(Jn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Je,service:t,service_data:e})}catch(n){throw Jn(n)}this.live||await this.refresh()}setRide(t,e,n,o,s){return this.call("set_ride",s===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:s})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Xn(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:Xn(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n,o){return this.call("set_people",{event:t,people:e,scope:n,...o?{driver:o.driver,riders:o.riders,back_riders:o.backRiders}:{}})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let l=await ws(this.conn.sendMessagePromise({type:"call_service",domain:Je,service:"get_chores",service_data:{},return_response:!0}),xs);if(e)return;n=!0,t(l.response??null)}catch{!e&&!n&&t(null)}},s=new Rt(this.conn,`${Je}/chores/subscribe`,l=>{e||(n=!0,t(l.chores))},()=>void o());s.open();let r=setInterval(()=>{s.live||s.open()},Zn);return()=>{e=!0,clearInterval(r),s.close()}}watchLunch(t){let e=!1,n=!1,o=new Rt(this.conn,`${Je}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let s=setInterval(()=>{o.live||o.open()},Zn);return()=>{e=!0,clearInterval(s),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Je,service:t,service_data:e})}catch(n){throw Jn(n)}}};var ks={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ts=i=>(...t)=>({_$litDirective$:i,values:t}),cn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:xr}=gs,Es=i=>i;var _s=()=>document.createComment(""),pt=(i,t,e)=>{let n=i._$AA.parentNode,o=t===void 0?i._$AB:t._$AA;if(e===void 0){let s=n.insertBefore(_s(),o),r=n.insertBefore(_s(),o);e=new xr(s,r,i,i.options)}else{let s=e._$AB.nextSibling,r=e._$AM,l=r!==i;if(l){let d;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(d=i._$AU)!==r._$AU&&e._$AP(d)}if(s!==o||l){let d=e._$AA;for(;d!==s;){let h=Es(d).nextSibling;Es(n).insertBefore(d,o),d=h}}}return e},Oe=(i,t,e=i)=>(i._$AI(t,e),i),wr={},Cs=(i,t=wr)=>i._$AH=t,Ps=i=>i._$AH,hn=i=>{i._$AR(),i._$AA.remove()};var Ss=(i,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(i[o],o);return n},ke=Ts(class extends cn{constructor(i){if(super(i),i.type!==ks.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],s=[],r=0;for(let l of i)o[r]=n?n(l,r):r,s[r]=e(l,r),r++;return{values:s,keys:o}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,n]){let o=Ps(i),{values:s,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,s;let l=this.ut??=[],d=[],h,u,a=0,f=o.length-1,x=0,k=s.length-1;for(;a<=f&&x<=k;)if(o[a]===null)a++;else if(o[f]===null)f--;else if(l[a]===r[x])d[x]=Oe(o[a],s[x]),a++,x++;else if(l[f]===r[k])d[k]=Oe(o[f],s[k]),f--,k--;else if(l[a]===r[k])d[k]=Oe(o[a],s[k]),pt(i,d[k+1],o[a]),a++,k--;else if(l[f]===r[x])d[x]=Oe(o[f],s[x]),pt(i,o[a],o[f]),f--,x++;else if(h===void 0&&(h=Ss(r,x,k),u=Ss(l,a,f)),h.has(l[a]))if(h.has(l[f])){let m=u.get(r[x]),$=m!==void 0?o[m]:null;if($===null){let _=pt(i,o[a]);Oe(_,s[x]),d[x]=_}else d[x]=Oe($,s[x]),pt(i,o[a],$),o[m]=null;x++}else hn(o[f]),f--;else hn(o[a]),a++;for(;x<=k;){let m=pt(i,d[k+1]);Oe(m,s[x]),d[x++]=m}for(;a<=f;){let m=o[a++];m!==null&&hn(m)}return this.ut=r,Cs(i,d),Me}});var pn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function Q(i){return pn[(i%pn.length+pn.length)%pn.length]}var un="#23272E",Qn="35,39,46";var ei=3,Ot=36,ti=12,fn=8,As=30,Te=16,jt=100,ft=60,$r=120,Ms=44,Ds=20,kr=45,Tr=30,Ls=20,si=10,mn=30,oi=10,Er=150,_r=150,vn=1;function Hs(i,t){return i.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Ot}function Cr(i,t,e){return 10+10.2*i.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var Pr=26,Fs=4;function ai(i,t){let e=Math.max(Er,_r/vn);return Math.ceil(ft+Math.max(0,i-1)*si+mn+Math.max(0,t-1)*oi+e*(i+vn*t))}function le(i){return i.people?i.people.kids.map(t=>t.id):i.days.length?Object.keys(i.days[0].kids):[]}function K(i){return i.people?i.people.drivers.map(t=>t.id):i.days.length?Object.keys(i.days[0].drivers):[]}function de(i){return new Map(le(i).map((t,e)=>[t,Q(e)]))}function se(i,t){let e=i.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.kids[t])return n.kids[t].name;return t}function Z(i,t){let e=i.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.drivers[t])return n.drivers[t].name;return t}function li(i,t){return t==="none"?"Not needed":K(i).includes(t)?Z(i,t):t}function Sr(i){return i.leave_by!=null&&i.leave_by>i.start&&i.leave_by!==i.end?` · leave ${R(i.leave_by)}`:""}function yn(i){if(i.busy_why==="days"){if(i.start<=0&&i.end>=1440)return"All day";if(i.start<=0)return`Until ${R(i.end)}`;if(i.end>=1440)return`From ${R(i.start)}`}return`${R(i.start)}–${R(i.end)}`}function xn(i,t){return t.own?Z(i,t.own):se(i,t.kid)}var et={color:un,rgb:Qn,ink:un};function Us(i,t){return t.own?et:de(i).get(t.kid)??Q(0)}function Ar(i,t){let e=le(i);return t.along.map(n=>e.includes(n)?se(i,n):Z(i,n))}function tt(i){return i.length<2?i.join(""):`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}function Mr(i,t){let e=le(i),n=K(i).filter(l=>t.includes(l)),o=e.filter(l=>t.includes(l)),s=e.length>1&&o.length===e.length;if(s&&n.length===K(i).length)return"Everyone";let r=[...n.map(l=>Z(i,l)),...s?["the kids"]:o.map(l=>se(i,l))];return r.length<2?r.join(""):`${r.slice(0,-1).join(", ")} & ${r[r.length-1]}`}function Dr(i){let t=new Map([["home","Home"]]);for(let e of i.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function bn(i,t){return t?i.get(t)??(t.split(",")[0]?.trim()||t):""}function ni(i,t){let e=[];for(let n of i)n.type==="drive"?(e.length||e.push(bn(t,n.from)),e.push(bn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(bn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Lr(i){let t=i.map(r=>({...r,col:0,cols:1})).sort((r,l)=>r.s-l.s||l.en-r.en),e=[],n=[],o=-1/0,s=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(s(),o=-1/0);let l=n.findIndex(d=>d<=r.s);l<0?(l=n.length,n.push(r.en)):n[l]=r.en,r.col=l,e.push(r),o=Math.max(o,r.en)}return s(),t}function Rr(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].y;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return i[i.length-1].y}function jr(i,t){if(!i.length)return 0;if(t<=i[0].y)return i[0].t;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return i[i.length-1].t}function Ws(i,t){return Rr(i.anchors,t)}function di(i,t){return jr(i.anchors,t)}function Ir(i,t){let e=le(i),n=K(i),o=Math.max(t,ai(e.length,n.length)),r=(o-ft-Math.max(0,e.length-1)*si-mn-Math.max(0,n.length-1)*oi)/(e.length+vn*n.length||1),l=Math.floor(r),d=Math.floor(r*vn),h=i.whole_week??i.days,u=new Map;for(let m of h)for(let $ of m.events)for(let _ of $.own?$.along:[$.kid]){let g=u.get(_)??[];g.some(T=>T.event_id===$.event_id&&T.calendar_id===$.calendar_id)||g.push($),u.set(_,g)}let a=de(i),f=[],x=ft;e.forEach((m,$)=>{let _=u.get(m)??[],g=i.days.some(T=>T.events.some(D=>D.kid===m&&(D.sides.includes("drop")&&D.drop===""||D.sides.includes("pick")&&D.pick==="")));f.push({id:m,kind:"kid",x,w:l,name:se(i,m),dot:a.get(m).color,rgb:a.get(m).rgb,sub:`${g?"Needs a ride · ":""}${_.length} this week`,subWarn:g}),x+=l+($<e.length-1?si:0)});let k=x+mn/2;return x+=mn,n.forEach((m,$)=>{let _=0,g=0;for(let T of h){let D=T.drivers[m];D&&(_+=D.outings.length,g+=D.drive??0)}f.push({id:m,kind:"driver",x,w:d,name:Z(i,m),dot:un,rgb:Qn,sub:`${_} ${_===1?"trip":"trips"} this week · ${ht(g)} driving`,subWarn:!1}),x+=d+($<n.length-1?oi:0)}),{columns:f,sepX:k,width:o}}function zr(i,t){let e=i.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),s=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!s)return e;let r=o.slice(s[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Rs(i,t){let e=i.start<=0,n=i.end>=1440;return e&&n?`${i.title} · all day`:n?`${i.title} from ${R(i.start)}`:e||!t?`${i.title} until ${R(i.end)}`:`${i.title} ${R(i.start)}–${R(i.end)}`}function ci(i){return i.issues.filter(t=>t.level==="problem").length+i.clashes.length+(i.unplaced?.length??0)}function hi(i,t){let e=$e(t,i);return e===0?"Today":e===1?"Tomorrow":""}function te(i,t=0){return i==null||!Number.isFinite(i)?t:i}var ri=null;function Ks(i){ri=i}var gn='Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',ut={title:`800 14.5px ${gn}`,time:`400 12px ${gn}`,line:`600 12px ${gn}`,stop:`400 12px ${gn}`};function Or(i,t,e){let n=Math.max(8,Math.floor(t/e)),o=1,s=0;for(let r of i.split(/[ \t\n]+/).filter(Boolean)){let l=r.length;for(s===0?s=l:s+1+l<=n?s+=1+l:(o++,s=l);s>n;)o++,s-=n}return o}function Br(i,t,e,n){let o=i.split(/[ \t\n]+/).filter(Boolean),s=1,r="";for(let l of o){let d=r?`${r} ${l}`:l,h=n(d,e);if(h==null)return null;if(h<=t){r=d;continue}r&&s++;let u=n(l,e);if(u==null)return null;u>t&&(s+=Math.ceil(u/t)-1),r=l}return s}function It(i,t,e=7,n){if(n&&ri){let o=Br(i,t-.5,n,ri);if(o!=null)return o}return Or(i,t,e)}var Vs=25,Nr=15,Gs=3;function js(i){return Math.max(0,Math.min(Gs,Math.floor((i-Vs)/Nr)))}var Hr=Vs+2,Is=20;function zs(i,t="Home"){let e=/^(\d+:\d\d)\s+(.+)$/.exec(i.at(-1)??"");return e&&e[2]===t?e[1]:null}function ii(i,t,e,n){let o=t.drivers[e],s=o?.home;if(!s)return i;let r=n==null?void 0:o.outings.find(l=>(l.start??1/0)<=n&&n<(l.end??-1/0));return new Map(i).set(s.place,s.name).set("home",r?.home??s.name)}var zt="🚗";function Os(i,t){if(i===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,s,r,l=!1)=>({at:o,who:s,stays:l,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(i))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(i))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(i))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}return null}var Bs={muted:0,normal:1,pending:2,problem:3};function Fr(i){let{drop:t,pick:e}=i,n=t?Os(t.text,"drop"):null,o=e?Os(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return i;let s=[t,e].reduce((d,h)=>h&&(Bs[h.tone]??1)>(Bs[d]??1)?h.tone:d,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${zt} No rides yet`,tone:s},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let d=`${zt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${d} both ways`,tone:s},pick:null}:!n.at||!o.at?{drop:{text:`${d} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:s},pick:null}:{drop:{text:`${d} ↓${n.at} ↑${o.at}`.trimEnd(),tone:s},pick:null}}let r=(d,h)=>d==="needed"?`${h} needed`:`${h}${d.at?`${d.at} `:" "}${d.who}${d.stays?" stays":""}${d.extra}`,l=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${zt} ${l.join(" · ")}`,tone:s},pick:null}}function Ur(i,t){return!t&&!!i.drop&&!i.pick&&i.drop.tone==="muted"}var Wr=5,Kr=13;function Vr(i,t,e={}){let n=e.clash?4:2,o=t-n-13-9,s=n+2*Wr;s+=It(i.title,o-(e.noted?Kr:0),9,ut.title)*18;let r=i.inline&&i.drop?`${i.time} · ${i.drop.text}`:i.time;return s+=1+It(r,o,6.6,i.inline?ut.line:ut.time)*16,i.drop&&!i.inline&&(s+=1+It(i.drop.text,o,7,ut.line)*16),i.pick&&(s+=2+It(i.pick.text,o,7,ut.line)*16),Math.ceil(s)+1}function Ns(i,t="Home"){let e=/^(\S+\s+)(.+?), get (.+)$/u.exec(i);return e&&e[2]===t?`${e[1]}${t} ↑ ${e[3]}`:i.replace(/, drop off (.+)$/u," ↓ $1").replace(/, pick up (.+)$/u," ↑ $1")}function Gr(i,t){let e=i.reduce((n,o)=>n+It(o,t-20,7,ut.stop),0);return 28+i.length+e*16+1}function qs(i,t,e,n){let o=t==="compact",{columns:s,sepX:r,width:l}=Ir(i,e),d=new Map(s.map(g=>[g.id,g])),h=le(i),u=K(i),a=[...h,...u],f=de(i),x=Dr(i),k=g=>se(i,g),m=g=>Z(i,g),$={mode:t,width:l,height:0,columns:s,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],folds:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},_=0;return i.days.forEach((g,T)=>{let D=T*1440,B=new Map(g.events.map(c=>[c.id,c])),ne=c=>c&&B.has(c)?{day:g.date,event:c}:null,ce=ci(g),N=g.events.length,Ce=hi(g.date,n.date),be=ve(g.date),Be=(N?`${N} ${N===1?"activity":"activities"}${g.done?" left":""}`:g.done?"All done for today":"Nothing scheduled")+(ce?` · ${ce} to sort out`:""),ye=ta(i,g,f,l,l-Cr(be,Ce,Be));$.dayHeads.push({date:g.date,y:_,label:be,tag:Ce,sub:Be,warn:ce>0,h:Ot+(ye&&ye.h?ye.h+Fs+2:0),allDay:ye?.chips??[],inline:ye?.inline??0}),$.anchors.push({t:D,y:_});let Ne=$.dayHeads[$.dayHeads.length-1],he=_+Ne.h+ti,Re=u.flatMap(c=>g.drivers[c]?.outings??[]);if(!N&&!Re.length){$.empties.push({key:g.date,y:he,text:g.done?"Nothing else today":"Nothing planned"}),_=he+40,$.anchors.push({t:D+1439,y:_});return}let je=(c,v,b=c.kid)=>{let y=!!c.own&&b===c.own,P=!!c.own&&b!==c.own,S=y?m(b):k(b),M=P?{drop:{text:`${v?`${zt} `:""}With ${m(c.own)}`,tone:c.attending===!1?"muted":"normal"},pick:null}:v&&!c.own?Fr(c.lines):c.lines,z=y?Ar(i,c):[],L=(c.takes!=null?`${c.takes} min, any time ${R(c.start)}–${R(c.end)}`:yn(c)+(c.arrive_by!=null?` · arrive ${R(c.arrive_by)}`:"")+Sr(c))+(z.length?` · with ${tt(z)}`:"");return{who:S,mine:y,title:zr(c.title,S),time:L,drop:M.drop,pick:M.pick,inline:v&&Ur(M,c.attending===!1)}},He=(c,v,b,y)=>Vr(je(c,!0,b),v,{noted:!!c.notes,clash:y}),Ie=(c,v,b,y,P,S,M,z=c.kid)=>{let L=je(c,M,z),H=L.mine?et:f.get(z)??Q(0),we=L.who,E={drop:L.drop,pick:L.pick};return{key:`${g.date}|card|${c.id}`+(c.own?`|${z}`:""),x:v,y:b,w:y,h:P,target:{day:g.date,event:c.id},event:c,color:H,kidName:we,clash:S,stayed:!c.own&&c.stay&&u.includes(c.drop),skipped:c.attending===!1,title:L.title,time:L.time,drop:E.drop,pick:E.pick,showDrop:!!E.drop&&(M||P>=56),showPick:!!E.pick&&(M||P>=74),wrap:M,inline:L.inline,aria:`${we}, ${c.title} ${c.takes!=null?`any time from ${R(c.start)} to ${R(c.end)}`:yn(c).replace("–"," to ")}. `+(c.attending===!1&&!E.drop?"Not attending. ":"")+[E.drop,E.pick].filter(I=>!!I).map(I=>I.text).join(". ")}},Fe=c=>{let v=g.rides[c];return v?(g.drivers[v.driver]?.segments??[]).filter(y=>y.type!=="home"&&y.kids.includes(v.kid)&&te(y.start)>=te(v.start)&&te(y.end)<=te(v.end)):[]},ze=c=>{let v=g.rides[c];if(!v)return null;let b=v.serves.find(y=>B.get(y)?.kid===v.kid);return ne(b??v.serves[0])},Ue=(c,v)=>{if(v.event)return v;let b=g.events.find(y=>y.own&&y.own!==c&&y.along.includes(c)&&y.title===v.title);return b?{...v,title:`${v.title} with ${m(b.own)}`}:v},ie=c=>{if(c.takes==null)return[c.start,c.end];let v=c.planned??c.start;return[v,v+c.takes]},xe=new Map;for(let c of g.issues)c.level!=="problem"||!c.event||(c.kind==="late"&&xe.set(c.event,`${Math.round(te(c.minutes))} min late`),c.kind==="waiting"&&xe.set(`${c.event}|pick`,`Waits ${Math.round(te(c.minutes))} min`));if(!o){let c=1/0,v=-1/0;for(let E of g.events)E.start<=0&&E.end>=1440||(E.start>0?c=Math.min(c,E.start-20,E.arrive_by!=null?E.arrive_by-10:1/0):c=Math.min(c,E.end-30),E.end<1440?v=Math.max(v,E.end+20):v=Math.max(v,E.start+30));for(let E of Re)E.start!=null&&(c=Math.min(c,E.start)),E.end!=null&&(v=Math.max(v,E.end));let b=g.from;b!=null&&Number.isFinite(c)&&c<b+60?c=b-15:g.date===n.date&&Number.isFinite(c)&&n.minutes>c-60&&n.minutes<v&&(c=Math.min(c,n.minutes-15));let y=Number.isFinite(c)?Math.floor((c-5)/30)*30:900,P=Math.max(Number.isFinite(v)?Math.ceil((v+5)/30)*30:960,y+60),S=E=>b!=null&&te(E)<=y,M=E=>b!=null&&te(E)<y,z=Yr(qr(g,u,ie,g.date===n.date?n.minutes:null),y,P),L=E=>Math.round(he+Xr(Math.max(y,Math.min(P,E))-y,z,y));$.anchors.push({t:D+y,y:L(y)});for(let E of z)$.anchors.push({t:D+E.from,y:L(E.from)},{t:D+E.to,y:L(E.to)}),$.folds.push({key:`${g.date}|fold|${E.from}`,y:L(E.from),h:L(E.to)-L(E.from),from:E.from,to:E.to,label:Zr(E.to-E.from)});$.anchors.push({t:D+P,y:L(P)});let H=(E,I)=>z.some(V=>I?E>=V.from&&E<=V.to:E>V.from&&E<V.to);for(let E of h){let I=d.get(E),V=f.get(E),$t=(g.kids[E]?.items??[]).filter(C=>C.start!=null&&C.end!=null&&!S(C.end)).map(C=>({item:C,s:te(C.start),en:te(C.end)})),oe=[];for(let C of Lr($t)){let j=I.w/C.cols,O=Math.round(I.x+C.col*j),F=Math.round(j-(C.cols>1?4:0)),Y=L(C.s),U=C.item;if(U.type==="act"){let pe=B.get(U.event??"");if(!pe)continue;let Yt=Math.max(30,L(C.en)-Y),lt=Ie(pe,O,Y,F,Yt,U.clash,!1,E);if(lt.layer=jt,lt.cut=M(C.s),$.cards.push(lt),pe.arrive_by!=null&&pe.start-pe.arrive_by>=5&&!lt.cut){let zn=L(pe.arrive_by),Zi={key:`${g.date}|prep|${pe.id}`,x:O,y:zn,w:F,h:Y-zn+Te,color:V,label:`Arrive by ${R(pe.arrive_by)}`,layer:jt-1};$.preps.push(Zi),oe.push({s:pe.arrive_by,en:C.en,top:zn,bottom:Y+Yt,x:O,w:F,prep:Zi,card:lt})}else oe.push({s:C.s,en:C.en,top:Y,bottom:Y+Yt,x:O,w:F,card:lt});let Yi=xe.get(pe.id);Yi&&$.marks.push({key:`${g.date}|late|${pe.id}`,x:O+F-4,y:Y+4,text:Yi,right:!0});let Xi=xe.get(`${pe.id}|pick`);Xi&&$.marks.push({key:`${g.date}|wait|${pe.id}`,x:O+4,y:Y+Yt+2,text:Xi,right:!1});continue}let G=g.rides[U.ride??-1];if(!G)continue;let X=Math.max(22,L(C.en)-Y),Ke=ni(Fe(G.index),ii(x,g,G.driver,G.start??void 0)),Tt=m(G.driver),Gi={key:`${g.date}|ride|${G.index}`,x:O,y:Y,w:F,h:X,target:ze(G.index),l1:`${G.own?"In":"Along in"} ${Tt}’s car`,l2:Ke.join(" → "),show2:js(X)>0,lines2:js(X),dashed:!G.own,clash:U.clash,aria:`${k(E)} ${G.own?"in":"riding along in"} ${Tt}’s car, ${R(te(G.start))} to ${R(te(G.end))}: ${Ke.join(" to ")}`};$.rides.push(Gi);let qi=d.get(G.driver),In=null;qi&&(In={key:`${g.date}|band|${G.index}`,x:O+F,y:Y,w:Math.max(0,qi.x+8-(O+F)),h:X,color:V},$.bands.push(In)),oe.push({s:C.s,en:C.en,top:Y,bottom:Y+X,x:O,w:F,ride:Gi,band:In})}let qt=C=>C.ride?.layer??(C.prep?jt-1:jt),kt=(C,j,O,F)=>{O>Te&&$.links.push({key:`${C.key}|link`,x:C.x,y:j,w:C.w,h:O,color:V,layer:F})},A=(C,j)=>{if(!(j.x<C.x||j.x+j.w>C.x+C.w)&&(C.x=j.x,C.w=j.w,C.ride.x=j.x,C.ride.w=j.w,C.band)){let O=C.band.x+C.band.w;C.band.x=j.x+j.w,C.band.w=Math.max(0,O-C.band.x)}},ee=new Set;for(let C of[...oe].sort((j,O)=>O.s-j.s)){let j=C.ride;if(!j)continue;let O=oe.filter(U=>U!==C&&U.s>=C.en&&U.s-C.en<=As&&U.top>=C.bottom).sort((U,G)=>U.s-G.s||U.top-G.top)[0];if(!O)continue;ee.add(C),A(C,O);let F=qt(O),Y=O.top-C.bottom;kt(j,C.bottom,Y+Te,F-1),j.layer=F-(Y>0?2:1),j.h+=Te,j.tuckBottom=Te}for(let C of[...oe].sort((j,O)=>j.s-O.s)){let j=C.ride;if(!j||ee.has(C))continue;let O=oe.filter(U=>U!==C&&U.en<=C.s&&C.s-U.en<=As&&U.bottom<=C.top&&(U.card||U.ride?.layer!=null)).sort((U,G)=>G.en-U.en||G.bottom-U.bottom)[0];if(!O)continue;A(C,O);let F=O.ride?.layer??jt,Y=C.top-O.bottom;kt(j,O.bottom-Te,Y+Te,F-1),j.layer=F-(Y>0?2:1),j.y-=Te,j.h+=Te,j.tuckTop=Te}}for(let E of u){let I=d.get(E),V=g.drivers[E];if(!V)continue;let $t=[],oe=null;for(let A of V.segments)if(!(A.start==null||A.end==null)){if(A.type==="home"){oe=null;continue}if(A.type==="stay"){oe=null,$t.push({type:"stay",g:A,s:A.start,en:A.end});continue}oe&&oe.en===A.start?(oe.en=A.end,oe.legs.push(A)):(oe={type:"trip",s:A.start,en:A.end,legs:[A]},$t.push(oe))}let qt=new Set,kt=(A,ee,C,j)=>{qt.add(A.id);let O=L(ee),F=Ie(A,I.x+8,O,I.w-16,Math.max(30,L(C)-O),!1,!1,E);F.cut=M(ee),j&&F.drop?.tone==="normal"&&(F.drop=null,F.showDrop=!1),$.cards.push(F)};for(let A of $t){if(S(A.en))continue;let ee=L(A.s),C=Math.max(24,L(A.en)-ee);if(A.type==="stay"){let X=B.get(A.g.event??A.g.serves??"");if(X?.own===E){kt(X,A.s,A.en,!0);continue}let Ke=X?f.get(X.kid)??Q(0):Q(0),Tt=A.g.kids.map(k);$.stays.push({cut:M(A.s),key:`${g.date}|stay|${E}|${A.s}`,x:I.x+8,y:ee,w:I.w-16,h:C,target:ne(X?.id),color:Ke,l1:X?`At ${X.title} with ${k(X.kid)}`:"Staying",l2:`until ${R(A.en)}`+(Tt.length?` · ${Tt.join(" and ")} too`:"")});continue}let j=A.legs[0],O=A.legs[A.legs.length-1],F=[];for(let X of A.legs)for(let Ke of X.kids)F.includes(Ke)||F.push(Ke);let Y=O.type==="drive"&&O.to==="home",U=ii(x,g,E,A.s),G=ni(A.legs,U);$.trips.push({key:`${g.date}|trip|${E}|${A.s}`,x:I.x+8,y:ee,w:I.w-16,h:C,target:ne(A.legs.find(X=>X.serves)?.serves),l1:j.type==="drive"&&j.from==="home"?`Leave ${R(A.s)}`:`From ${bn(x,j.from??j.place)} ${R(A.s)}`,l2:G.join(" → "),show2:C>=36,l3:Y?`${U.get("home")??"Home"} ${R(A.en)}`:"",show3:Y&&C>=62,stops:null,kids:F.map(X=>(f.get(X)??Q(0)).color),bad:A.legs.some(X=>X.overlaps_busy),aria:`${m(E)} drives ${G.join(" to ")}, ${R(A.s)} to ${R(A.en)}`})}for(let A of V.segments)if(!(!A.overlaps_busy||A.start==null||A.end==null))for(let ee of V.busy){let C=Math.max(A.start,ee.start),j=Math.min(A.end,ee.end);j<=C||S(j)||$.overlaps.push({key:`${g.date}|overlap|${E}|${C}`,x:I.x+6,y:L(C)-2,w:I.w-12,h:Math.max(8,L(j)-L(C)+4)})}for(let A of g.events)if(A.own===E&&(!qt.has(A.id)&&!S(ie(A)[1])&&kt(A,...ie(A),!1),A.takes!=null&&A.attending!==!1&&!S(A.end))){let ee=L(A.start);$.windows.push({key:`${g.date}|window|${A.id}`,x:I.x+4,y:ee,w:I.w-8,h:Math.max(24,L(A.end)-ee),label:`${A.title} · any time ${R(A.start)}–${R(A.end)}`})}for(let A of V.busy){if(A.event||A.end<=y||A.start>=P)continue;let ee=Ue(E,A),C=L(ee.start),j=L(ee.end);$.busy.push({key:`${g.date}|busy|${E}|${ee.start}`,x:I.x+1,y:C,w:I.w-2,h:j-C,labelY:8,label:Rs(ee,!1)})}}let we=-1/0;for(let E=y;E<=P;E+=30)H(E,!0)||$.grid.push({key:`${g.date}|grid|${E}`,y:L(E),strong:E%60===0}),(z.some(V=>V.from===E||V.to===E)||E%60===0&&!H(E,!1))&&L(E)-we>=22&&($.hours.push({key:`${g.date}|hour|${E}`,y:L(E)-8,label:E%60===0?ys(E):De(E)}),we=L(E));g.date===n.date&&n.minutes>y&&n.minutes<P&&($.now={y:L(n.minutes),label:`Now ${R(n.minutes)}`}),_=L(P)+ti;return}let q=[];for(let c of h){let v=d.get(c);for(let b of g.kids[c]?.items??[])if(b.start!=null){if(b.type==="act"){let y=B.get(b.event??"");if(!y)continue;q.push({col:c,s:b.start,h:He(y,v.w,c,b.clash),kind:"act",item:b})}else if(!g.rides[b.ride??-1]?.own){let y=g.rides[b.ride??-1],P=y?g.drivers[y.driver]?.outings.find(S=>S.start!=null&&S.start<=te(y.start)&&te(y.start)<=te(S.end,S.start)):void 0;q.push({col:c,s:P?.start??b.start,h:Hr,kind:"along",item:b})}}}for(let c of u){let v=g.drivers[c];if(!v)continue;for(let y of v.busy)y.event||q.push({col:c,s:y.start,h:32,kind:"busy",busy:Ue(c,y)});let b=d.get(c).w;for(let y of g.events)y.own!==c||!y.busy_only&&y.attending!==!1&&(y.takes==null||y.planned!=null)||q.push({col:c,s:ie(y)[0],h:He(y,b-16,c,!1),kind:"own",event:y});for(let y of v.outings){if(y.start==null)continue;let P=(zs(y.lines,y.home)?y.lines.slice(0,-1):y.lines).map(S=>Ns(S,y.home));q.push({col:c,s:y.start,h:Gr([...P,...y.warn?[y.warn]:[]],b-16),kind:"out",out:y})}}q.sort((c,v)=>c.s-v.s||a.indexOf(c.col)-a.indexOf(v.col));let ue=new Map,ae=[],We=new Map,fe=he-Is;for(let c=0;c<q.length;){let v=c,b=fe+Is;for(;v<q.length&&q[v].s===q[c].s;v++){let P=ue.get(q[v].col);P!=null&&(b=Math.max(b,P+fn))}let y=new Set;for(let P=c;P<v;P++){let S=q[P],M=y.has(S.col)?ue.get(S.col)+fn:b;y.add(S.col),ue.set(S.col,M+S.h)}We.set(q[c].s,b),q[c].s>0&&$.hours.push({key:`${g.date}|hour|${q[c].s}`,y:b+2,label:De(q[c].s)}),fe=b,c=v}ue.clear(),q.forEach((c,v)=>{let b=ue.get(c.col),y=Math.max(b!=null?b+fn:he,We.get(c.s));ue.set(c.col,y+c.h);let P=c.kind==="busy"?c.busy.end:c.kind==="act"?B.get(c.item.event??"")?.end??null:c.kind==="own"?ie(c.event)[1]:null;ae.push({col:c.col,s:c.s,end:P,y,h:c.h,box:null}),$.anchors.push({t:D+c.s,y});let S=d.get(c.col);if(c.kind==="busy"){let M={key:`${g.date}|busy|${c.col}|${v}`,x:S.x+1,y,w:S.w-2,h:c.h,labelY:8,label:Rs(c.busy,!0)};$.busy.push(M),ae[ae.length-1].box=M}else if(c.kind==="out"){let M=c.out,z=zs(M.lines,M.home),L=z?M.lines.slice(0,-1):M.lines;$.trips.push({key:`${g.date}|trip|${c.col}|${v}`,x:S.x+8,y,w:S.w-16,h:c.h,target:ne(M.target),l1:z?`${M.lead} · ${M.home&&M.home!=="Home"?M.home:"home"} ${z}`:M.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...L.map(H=>({text:Ns(H,M.home),warn:!1})),...M.warn?[{text:M.warn,warn:!0}]:[]],kids:M.kids.map(H=>(f.get(H)??Q(0)).color),bad:!!M.warn,aria:`${m(c.col)}: ${M.lead}. ${M.lines.join(". ")}${M.warn?`. ${M.warn}`:""}`})}else if(c.kind==="own"){let M=Ie(c.event,S.x+8,y,S.w-16,c.h,!1,!0,c.col);$.cards.push(M),ae[ae.length-1].box=M}else if(c.kind==="act"){let M=B.get(c.item.event??""),z=Ie(M,S.x,y,S.w,c.h,c.item.clash,!0,c.col);$.cards.push(z),ae[ae.length-1].box=z}else{let M=g.rides[c.item.ride??-1],z=ni(Fe(M.index),ii(x,g,M.driver,M.start??void 0)),L=m(M.driver);$.rides.push({key:`${g.date}|ride|${M.index}`,x:S.x,y,w:S.w,h:c.h,target:ze(M.index),l1:`${zt} with ${L}`,l2:z.join(" → "),show2:!1,lines2:Gs,dashed:!0,clash:c.item.clash,aria:`${k(c.col)} riding along with ${L}, ${R(te(M.start))} to ${R(te(M.end))}: ${z.join(" to ")}`})}});let Pe=he;for(let c of ue.values())Pe=Math.max(Pe,c);for(let c of ae){if(!c.box||c.end==null)continue;let v=c.y+c.h;for(let b of ae)b.col!==c.col&&b.s>=c.s&&b.s<c.end&&(v=Math.max(v,b.y+b.h));c.end>=1440&&(v=Pe);for(let b of ae)b.col===c.col&&b.y>c.y&&(v=Math.min(v,b.y-fn));v=Math.min(v,Pe),v>c.y+c.h&&(c.box.h=v-c.y)}_=Pe+ti+6,$.anchors.push({t:D+1439,y:_})}),$.height=_,$}function qr(i,t,e,n){let o=[],s=(r,l)=>{r==null||l==null||o.push([r-Ds,Math.min(l,r+kr)+Ls],[Math.max(r,l-Tr)-Ds,l+Ls])};for(let r of i.events)r.own?(s(...e(r)),r.takes!=null&&s(r.start,r.end)):s(r.arrive_by??r.start,r.end);for(let r of Object.values(i.kids))for(let l of r.items??[])s(l.start,l.end);for(let r of t){let l=i.drivers[r];if(l){for(let d of l.segments)d.type!=="home"&&s(d.start,d.end);for(let d of l.outings)s(d.start,d.end);for(let d of l.busy)s(d.start,d.end)}}return n!=null&&o.push([n-30,n+30]),o}function Yr(i,t,e){let n=i.map(([d,h])=>[Math.max(t,d),Math.min(e,h)]).filter(([d,h])=>h>d).sort((d,h)=>d[0]-h[0]),o=[],s=t,r=(d,h)=>{let u=Math.ceil(d/30)*30,a=Math.floor(h/30)*30;a-u>=$r&&o.push({from:u,to:a})},l=!1;for(let[d,h]of n)l&&d>s&&r(s,d),s=l?Math.max(s,h):h,l=!0;return o}function Xr(i,t,e){let n=i*ei,o=e+i;for(let s of t){let r=s.to-s.from;o>=s.to?n-=r*ei-Ms:o>s.from&&(n-=(o-s.from)*ei-(o-s.from)/r*Ms)}return n}function Zr(i){let t=Math.floor(i/60),e=i%60>=30;return`${t}${e?"½":""} hrs`}var Jr=["","¼","½","¾"];function Qe(i){return i.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return ht(n);let o=Math.round(n*4),s=Math.floor(o/4),r=Jr[o%4];return`${s||!r?s:""}${r} min`})}function Ys(i){let t=e=>e?{...e,text:Qe(e.text)}:null;return{...i,days:i.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(s=>({...s,lines:s.lines.map(Qe),warn:s.warn==null?s.warn:Qe(s.warn)}))}])),issues:e.issues.map(n=>({...n,title:Qe(n.title),body:Qe(n.body),note:n.note==null?n.note:Qe(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Qe(o.note)}))}:{}}))}))}}var Qr=2,ea=48;function Xs(i,t,e=ea){let n=[],o=new Set(K(i)),s=le(i).map(f=>se(i,f)),r=s.length>1?s.slice(0,2):[s[0]??"Ava","Ben"],l=0,d=0,h=0,u=0,a=t.minutes+e*60;for(let f of i.days){let x=$e(t.date,f.date),k=x===0?"":`${re(f.date)} · `,m=new Map(f.events.map(g=>[g.id,g])),$=g=>g&&m.has(g)?{day:f.date,event:g}:null,_=(g,T)=>x*1440+(g??m.get(T??"")?.start??0)<a;for(let g of f.issues)if(g.level==="problem"){if(!_(g.at,g.event)){h++,g.kind==="unassigned"&&u++;continue}l++,g.kind==="unassigned"&&d++,n.push({key:`${f.date}|${g.key}`,tone:g.kind==="unassigned"?"unassigned":"problem",title:k+g.title,body:g.body,target:$(g.event),suggestions:(g.suggestions??[]).map(T=>({id:T.id,label:T.label,note:T.note}))})}if(f.clashes.forEach((g,T)=>{if(!_(g.a.start,g.a.event)){h++;return}l++;let D=m.get(g.a.event??""),B=se(i,g.kid),ne=(N,Ce)=>{let be=$(Ce);return be?{text:N,target:be}:N},ce=[];if(g.b.type==="act"){let N=m.get(g.b.event??"");D&&N&&(ce=[ne(D.title,D.id),` ${R(D.start)}–${R(D.end)} and `,ne(N.title,N.id),` ${R(N.start)}–${R(N.end)} overlap.`])}else{let N=f.rides[g.b.ride??-1];D&&N&&(ce=[`${B} is in `,ne(`${Z(i,N.driver)}’s car`,N.serves[0]),` ${R(te(g.b.start))}–${R(te(g.b.end))}, during `,ne(D.title,D.id),"."])}n.push({key:`${f.date}|clash|${T}`,tone:"problem",title:`${k}${B} is double-booked`,body:ce.map(N=>typeof N=="string"?N:N.text).join(""),parts:ce,target:null,suggestions:[]})}),x>=0&&x<Qr)for(let g of f.issues)g.level!=="heads_up"||!_(g.at,g.event)||n.push({key:`${f.date}|${g.key}`,tone:"heads_up",title:k+g.title,body:g.body,target:$(g.event),suggestions:[]});for(let g of f.unplaced??[]){if(!_(g.at)){h++;continue}l++;let T=g.people.map(B=>o.has(B)?Z(i,B):se(i,B)),D=g.from_notes?"The For line in its notes":"Its title";n.push({key:`${f.date}|unplaced|${g.id}`,tone:"problem",title:`${k}${R(g.at)} ${g.title}: ${Zs(g).toLowerCase()}`,body:g.reason==="unknown"&&g.word?`${D} names “${g.word}”, who isn’t anyone in the family, so ${T.length?`it’s only in ${tt(T)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:f.date,id:g.id}})}for(let g of f.events)!g.problems.length||!_(g.start)||n.push({key:`${f.date}|notes|${g.id}`,tone:"heads_up",title:`${k}Check the notes on ${xn(i,g)}’s ${g.title}`,body:`These lines couldn’t be read: ${g.problems.join("; ")}`,target:$(g.id),suggestions:[]})}return{items:n,problems:l,unassigned:d,later:h,laterUnassigned:u}}function Zs(i){return i.reason==="unknown"&&i.word?`Who is “${i.word}”?`:"Who is this for?"}function ta(i,t,e,n,o=0){let s=new Set(K(i)),r=k=>{let m=k[0];return m==null?null:s.has(m)?et:e.get(m)??null},l=[...(t.all_day??[]).map(k=>{let m=k.days>1?`Day ${k.day_number} of ${k.days}`:"";return{key:`${t.date}|allday|${k.id}`,title:k.stay?`🏨 ${k.title}`:k.title,note:k.stay?[Mr(i,k.people),m].filter(Boolean).join(" · "):m,color:r(k.people),cancelled:k.cancelled,warn:!1,pick:null,stay:k.stay&&!k.cancelled?k.id:null,notes:k.notes??""}}),...(t.unplaced??[]).map(k=>({key:`${t.date}|unplaced|${k.id}`,title:`${R(k.at)} ${k.title}`,note:Zs(k),color:null,cancelled:!1,warn:!0,pick:k.id,stay:null,notes:k.notes??""}))];if(!l.length)return null;let d=Math.max(120,n-ft),h=(k,m=7)=>30+m*k.title.length+(k.note?Math.min(m,5.6)*(k.note.length+2):0)+(k.notes?16:0)+(k.stay?12:0),u=0,a=0;for(;u<l.length&&a+h(l[u],6.4)<=o;)a+=h(l[u++],6.4);let f=0;a=0;for(let k of l.slice(u)){let m=Math.min(d,h(k));(!f||a+m>d)&&(f++,a=0),a+=m}let x=f?f*Pr+(f-1)*Fs:0;return{key:`${t.date}|allday`,h:x,chips:l,inline:u}}function Js(i,t){let e=de(i),n=null,o=s=>s.ahead>0?2:s.ongoing?1:0;for(let s of i.days){let r=$e(t.date,s.date);if(!(r<0))for(let l of K(i))for(let d of s.drivers[l]?.outings??[]){if(d.start==null)continue;let h=r*1440+d.start;if(r*1440+te(d.end,d.start)<=t.minutes)continue;let a=h-t.minutes,f={driver:l,name:Z(i,l),date:s.date,ahead:r,start:d.start,inMinutes:a,ongoing:a<=0,lead:d.lead,stop:(d.lines[0]??"").replace(/\s+/g," ").trim(),kids:d.kids.map(x=>e.get(x)??Q(0)),warn:d.warn,target:d.target&&s.events.some(x=>x.id===d.target)?{day:s.date,event:d.target}:null};(!n||o(f)<o(n)||o(f)===o(n)&&f.inMinutes<n.inMinutes)&&(n=f)}}return n}function gt(i){return i.state==="done"||i.state==="late"}var na=780;function ia(i,t,e){return i.state==="open"&&!!i.for_day&&i.due===t&&e<na}function Qs(i,t){return i.chores.map(e=>ia(e,i.today,t)?{...e,state:"upcoming",shows_from:i.today}:e)}function eo(i){return i.state==="open"||i.state==="overdue"}function fi(i,t,e){if(gt(i)){let n=i.done_at?sa(i.done_at,t,e):"";return i.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(i.state==="overdue")return i.missed>1?`Missed ${i.missed} times`:i.due?`Missed ${pi(i.due,t)}`:"Missed";if(i.state==="upcoming"){if(i.for_day)return`From 1 PM · for ${pi(i.for_day,t)}`;let n=i.shows_from??i.due;if(!i.due||!n||i.due<=n)return"";let o=$e(t,i.due);return`By ${o===1?"tomorrow":o<7?re(i.due):ui(i.due)}`}if(i.for_day&&i.due===t)return`Tonight · for ${pi(i.for_day,t)}`;if(i.due&&i.due>t){let n=$e(t,i.due);return n===1?"By tomorrow":`By ${n<7?re(i.due):ui(i.due)}`}return i.missed?`Today · missed ${i.missed===1?"once":`${i.missed} times`} before`:"Today"}function pi(i,t){let e=$e(t,i);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?re(i):ui(i)}function ui(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function sa(i,t,e){let n=new Date(i);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let s=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return s===t?r:`${re(s)} ${r}`}function to(i,t,e=1440){let n=Qs(i,e).sort((o,s)=>o.order-s.order);return i.kids.map((o,s)=>{let r=n.filter(u=>u.kid===o.id),l=new Map;for(let u of r){if(u.state!=="upcoming")continue;let a=u.shows_from??u.due??i.today;l.set(a,[...l.get(a)??[],u])}let d=r.filter(u=>u.state==="overdue"),h=r.filter(u=>u.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??Q(s),overdue:d,now:h,done:r.filter(gt),later:[...l.entries()].sort(([u],[a])=>u.localeCompare(a)).map(([u,a])=>({date:u,chores:a})),left:d.length+h.length}})}function no(i,t=1440){return Qs(i,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=i.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function gi(i){return!i.chores.length&&!i.templates.length}var nt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function mi(i){let t=i.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,s]=n.split("-").map(r=>nt.indexOf(r.trim()));if(o===void 0||o<0||s!==void 0&&s<0)return null;if(s===void 0)e.add(o);else for(let r=0;r<=(s-o+7)%7;r++)e.add((o+r)%7)}return e}function bi(i){let t=[...new Set(i)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${nt[n[0]]}-${nt[n.at(-1)]}`]:n.map(o=>nt[o])).join(", ")}var it="none";function wn(i){return i==="daily"||i==="school"?"":"Any"}function io(i=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:i,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function so(i){let t=i.days??wn(i.repeats),e=i.repeats==="daily"&&t!=="";return{template:i.id,repeats:e?"weekly":i.repeats,title:i.title,icon:i.icon,details:i.details??"",who:[...i.who],take_turns:!!i.take_turns,days:t,every:!e&&i.every&&i.every>0?i.every:1,paused:i.paused,night_before:!!i.night_before,bring_only:!!i.bring_only}}function vi(i){return i.title.trim()?i.who.length?i.days===it?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function oo(i){return{...i.template?{template:i.template}:{},repeats:i.repeats,title:i.title.trim(),icon:i.icon??"",details:i.details.trim(),who:i.who,take_turns:i.take_turns&&i.who.length>1,days:i.repeats==="daily"?"":i.days,every:i.repeats==="school"?1:i.every,paused:i.paused,...i.repeats==="school"?{night_before:i.night_before,bring_only:i.bring_only}:{}}}function yi(i){let t=i%100;return t>=11&&t<=13?`${i}th`:`${i}${{1:"st",2:"nd",3:"rd"}[i%10]??"th"}`}function xi(i,t,e=1,n=!1,o=!1){if(i==="school"){let u=t.trim().replace(/-/g,"–"),a=o?u?`${u} Bring lunch days`:"Bring lunch days":u?`${u} school days`:"Every school day";return n?`${a}, the night before`:a}let s={daily:"day",weekly:"week",monthly:"month"}[i],r=e>1?`every ${e} ${s}s`:`each ${s}`,l=t.trim();if(i==="daily")return e>1?`Every ${e} days`:"Every day";if(i==="weekly"&&/^mon\s*-\s*sun$/i.test(l))return e>1?`Every day, every ${e} weeks`:"Every day";if(!l||l.toLowerCase()==="any")return`Sometime ${r}`;if(i==="weekly")return`${l.replace(/-/g,"–")} ${r}`;let h=`${l.split(",").map(u=>{let a=u.trim();return a.toLowerCase()==="last"?"the last day":/^\d+$/.test(a)?`the ${yi(Number(a))}`:`the ${a}`}).join(" and ")} ${r}`;return h[0].toUpperCase()+h.slice(1)}function wi(i,t,e=!1){let n=i.map(s=>t.find(r=>r.id===s)?.name??s);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function $i(i){let t=i.indexOf(":"),e=t<0?i:i.slice(0,t),n=t<0?"":i.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function $n(i,t){return`${i}|${t}`}function mt(i,t){let[e,n,o]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function kn(i){let[t,e,n]=i.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function ro(i,t){return i.days_off.find(e=>e.first<=t&&t<=e.last)??null}function ao(i,t){return kn(t)<5&&!ro(i,t)}function Bt(i,t,e=new Map){if(!ao(i,t))return null;let n=$n(i.id,t);if(e.has(n)){let s=e.get(n);return s?{lunch:s,picked:!0}:{lunch:i.default,picked:!1}}let o=i.picks[t];return o?{lunch:o,picked:!0}:{lunch:i.default,picked:!1}}function bt(i,t){return ao(i,t)?i.menus?.[t]??null:null}var oa="From the school's menu feed.";function ra(i){let t=i.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==oa);return t.length?t.join(`
`):null}function Ee(i){return i.slice(0,7)}function Tn(i){let[t,e]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function ki(i,t=1){let[e,n]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function lo(i){let t=[];for(let e=Ee(i.first);e<=Ee(i.last);e=ki(e))t.push(e);return t}function co(i,t,e,n=new Map){let o=`${e}-01`,s=mt(o,-kn(o)),r=[];for(;Ee(s)<=e;){let l=[];for(let d=0;d<5;d++){let h=mt(s,d),u=Ee(h)!==e,a=u?null:ro(t,h),f=u?null:Bt(t,h,n);l.push({date:h,day:Number(h.slice(8)),outside:u,off:a?a.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:u?null:bt(t,h)?.dish??null,sides:u?null:ra(bt(t,h)?.details??""),past:h<i.today,today:h===i.today})}l.some(d=>!d.outside)&&r.push(l),s=mt(s,7)}return r}function ho(i){return i.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function po(i){let t=0,e=0;for(let n of i.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function uo(i,t,e,n=new Map){let o=e<780?0:1;for(let s=o;s<8;s++){let r=mt(t,s),l=Bt(i,r,n);if(!l)continue;let d=$e(t,r);return{lunch:l.lunch,when:d===0?"today":d===1?"tomorrow":re(r),date:r,menu:bt(i,r)?.dish??null}}return null}var aa={timeline:"timeline",full:"timeline",compact:"compact"};function Nt(i){let t=new URLSearchParams(i),e={},n=aa[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}function Ti(i,t=0){return i==null||!Number.isFinite(i)?t:i}function la(i,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of i.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(i.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function da(i,t){let e=[],n=[],o=()=>{let s=n[n.length-1];s&&Ti(s.end)>t&&e.push(...n),n=[]};for(let s of i){if(s.start==null||s.end==null)continue;if(s.type==="home"||s.type==="stay"){o(),s.end>t&&e.push(s);continue}let r=n[n.length-1];r&&r.end!==s.start&&o(),n.push(s)}return o(),e}function ca(i,t){let e=new Set(i.events.filter(s=>la(i,s)<=t).map(s=>s.id)),n=s=>Ti(i.rides[s??-1]?.end,-1)<=t,o=s=>s.type==="act"?e.has(s.event??""):n(s.ride);return{...i,events:i.events.filter(s=>!e.has(s.id)),kids:Object.fromEntries(Object.entries(i.kids).map(([s,r])=>[s,{...r,items:r.items.filter(l=>!o(l))}])),drivers:Object.fromEntries(Object.entries(i.drivers).map(([s,r])=>[s,{...r,segments:da(r.segments,t),outings:r.outings.filter(l=>l.start==null||Ti(l.end,l.start)>t),busy:r.busy.filter(l=>l.end>t)}])),clashes:i.clashes.filter(s=>!o(s.a)&&!o(s.b)),issues:i.issues.filter(s=>!s.event||!e.has(s.event)),done:e.size,from:t}}function fo(i,t){return{...i,whole_week:i.whole_week??i.days,days:i.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?ca(e,t.minutes):e)}}var go=Ve`
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
  button.strip-chip.hotel:hover,
  button.strip-chip.hotel:focus-visible {
    background: rgba(var(--rgb), 0.2);
  }
  button.strip-chip.hotel::after {
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
  .ride.tall {
    justify-content: flex-start;
    padding-top: 6px;
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
  /* A long drive, such as to a hotel hours away: its words at the top, not lost in a fold. */
  .trip.tall {
    justify-content: flex-start;
    padding-top: 8px;
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
`;function ha(i,t,e,n,o=14){let s=i.top-o-8,r=e.h-i.bottom-o-8,l=t.h<=s,d=t.h<=r,h=n?l||!d&&s>r:!d&&(l||s>r),u=h?i.top-o-t.h:i.bottom+o,a=Math.max(8,Math.min(u,e.h-8-t.h)),f=Math.max(8,Math.min(i.x-t.w/2,e.w-8-t.w));return{left:Math.round(f),top:Math.round(a),above:h}}function Ht(i,t){for(let e of i.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var En=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?Ht(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=Ht(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let s=this.press;!s||s.el!==e||!e.isConnected||(s.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&Ht(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=Ht(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&Ht(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let s=t.dataset.note;if(!s)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=s,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let l={w:r.offsetWidth,h:r.offsetHeight},d={w:window.innerWidth,h:window.innerHeight},h=ha(e,l,d,n,o);r.style.left=`${h.left}px`,r.style.top=`${h.top}px`,r.classList.toggle("above",h.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};(()=>{if(typeof document>"u")return;let i=null,t=new Map;Ks((e,n)=>{let o=`${n}|${e}`,s=t.get(o);if(s!==void 0)return s;if(!i){if(!document.body)return null;i=document.createElement("span"),i.setAttribute("aria-hidden","true"),i.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;white-space:pre;letter-spacing:normal;word-spacing:normal;text-transform:none;contain:layout style",document.body.appendChild(i)}return i.style.font=n,i.style.font?(i.style.fontVariantNumeric="tabular-nums",i.textContent=e,s=i.getBoundingClientRect().width,t.size>2e4&&t.clear(),t.set(o,s),s):null})})();var er="mydashlight.rides.view",Ul=1100,Wl=440,Kl=700,Vl=3*6e4,Xo=1200,Gl=450,ql=110;function Yl(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Rn=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Zo=J`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,Jo=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Xl=new URL("emoji.json",import.meta.url).href,Qo=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Wi=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Ki=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Zl=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Jl=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Wt={bring:"Bring",buy:"Buy"};function Ql(i,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[i];return t<=1?e:`${e}s${i==="monthly"&&t===3?" (quarterly)":i==="monthly"&&t===12?" (yearly)":""}`}function me(i){let t=/\p{L}|\p{N}/u.exec(i);return t?t[0].toUpperCase():"?"}function Vi(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ed(i,t){return hi(i,t)||ve(i).split(",")[0]}function td(i){let t=i.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function nd(){try{return localStorage.getItem(er)==="timeline"?"timeline":"compact"}catch{return"compact"}}function id(i){try{localStorage.setItem(er,i)}catch{}}function jn(i,t){return K(i).includes(t)?Z(i,t):se(i,t)}function sd(i,t){if(t.driver==="none")return{driver:"none",riders:[],backRiders:[]};let e=tr(i,t),n=d=>(d??[]).filter(h=>t.people.includes(h)&&h!==e),o=n(t.ownWay),s=n(t.ownBack),r=t.people.find(d=>K(i).includes(d));if(!e||e===r&&!o.length&&!s.length)return{driver:"",riders:[],backRiders:[]};let l=d=>t.people.filter(h=>h!==e&&!d.includes(h));return{driver:e,riders:l(o),backRiders:l(s)}}function tr(i,t){if(t.driver==="none")return null;let e=K(i).filter(o=>t.people.includes(o)),n=t.people.filter(o=>e.includes(o));return t.driver&&n.includes(t.driver)?t.driver:n[0]??null}function Kt(i){return i.days.every(t=>!t.events.length)}var Vt=class extends ge{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Nt(location.search).view;this.urlPage=Nt(location.search).page;this.urlPast=Nt(location.search).past;this.urlDayPicker=Nt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,s=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(s)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-s,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Vl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??nd(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new En(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,s]of this.lunchDraft){let[r,l]=o.split("|"),d=e.kids.find(h=>h.id===r);(!d||(d.picks[l]??null)===s||!Bt(d,l))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&gt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(s=>s.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Ys(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Ul)return!1;let e=this.plan;return!e||this.width-Wl>=ai(le(e).length,K(e).length)}today(){return Lt(this.plan?.time_zone??Yl())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:fo(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let s=this.board,r=this.boardPlan;this.board=qs(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,s&&r&&this.keepPlace(s,r,e)}return this.board}keepPlace(e,n,o){let s=this.scroller;if(!s||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||s.scrollTop<=0)return;let r=e.dayHeads.find(u=>u.date===this.pinDay)?.h??Ot,l=di(e,s.scrollTop+r+4),d=n.days[Math.floor(l/1440)]?.date,h=d?o.days.findIndex(u=>u.date===d):-1;h>=0&&(this.keepAt=h*1440+(l-Math.floor(l/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let s=this.scroller;if(!s||!this.board)return;let r=this.topFor(e,n);Math.abs(s.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?s.scrollTo({top:r,behavior:"smooth"}):s.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,s=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(s,Ws(o,e)-Hs(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let s=this.today();if(e===s.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),l=o.days[r];if(!l)return;let d=1/0;if(this.mode==="timeline"){for(let h of l.events)d=Math.min(d,h.arrive_by??h.start);for(let h of Object.values(l.drivers))for(let u of h.outings)u.start!=null&&(d=Math.min(d,u.start))}this.scrollToTime(r*1440+(Number.isFinite(d)?Math.max(0,d-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=n+1&&(o=d);this.pinDay!==o.date&&(this.pinDay=o.date);let s=null,r=this.nowSpot(),l=this.today().date;if(r){let d=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),h=d>0?"up":"down";this.board.dayHeads.some(u=>u.date===l)&&o.date!==l?s=`${h}|Today`:this.mode==="timeline"&&Math.abs(d)>e.clientHeight*.6&&(s=`${h}|${o.date===l?"Now":"Today"}`)}this.away!==s&&(this.away=s)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),s=new Map(this.choreDraft);s.set(e.id,o),this.choreDraft=s;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let d=r instanceof W?r:new W("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??gt(e)}editMenu(e,n){let o=this.lunch?.kids??[],s=bt(e,n),r=o.filter(l=>l.id===e.id||s&&bt(l,n)?.dish===s.dish).map(l=>l.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:s?.dish??"",details:s?.details??"",kids:r,had:!!s,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let s=o instanceof W?o:new W("error",String(o));this.showToast(s.code==="preview"?s.message:`Couldn’t save that. ${s.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let s=new Map(this.lunchDraft);for(let r of n)s.set($n(e,r),o);this.lunchDraft=s;try{await this.backend.setLunch(e,n,o)}catch(r){let l=new Map(this.lunchDraft);for(let h of n)l.delete($n(e,h));this.lunchDraft=l;let d=r instanceof W?r:new W("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?so(e):io(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(Yo(),qo))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||vi(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(oo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof W?n:new W("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof W?n:new W("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(s=>s.date===this.pinDay)?.h??Ot;this.keepAt=n&&this.board?di(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||id(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),s=this.plan;if(!o||!s)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...le(s),...K(s)]);this.forPick={day:e,id:n,placed:!1,label:`${R(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(l=>r.has(l)),scope:"this",busy:!1}}openStayPick(e,n){let o=this.plan,s=o?.days.find(d=>d.date===e)?.all_day?.find(d=>d.id===n);if(!o||!s)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...le(o),...K(o)]),l=d=>s.driver&&s.driver!=="none"?s.people.filter(h=>r.has(h)&&h!==s.driver&&!(d??[]).includes(h)):[];this.forPick={day:e,id:n,placed:!1,label:`🏨 ${s.title}`,recurring:!1,word:null,fromNotes:!!s.from_notes,people:s.people.filter(d=>r.has(d)),scope:"this",busy:!1,stay:!0,timed:!!s.timed,driver:s.driver==="none"||K(o).includes(s.driver??"")?s.driver??"":"",ownWay:l(s.riders),ownBack:l(s.back_riders??s.riders)}}changeForPick(e,n,o){let s=e.who?.[o.event_id],r=s?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${R(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!s?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let n=this.forPick,o=this.plan;if(!n||!o||!this.backend||!e&&!n.people.length)return;let s=e?[]:n.people;this.forPick={...n,busy:!0};try{await this.backend.setPeople(n.id,s,n.scope,n.stay&&n.timed&&!e?sd(o,n):void 0),this.forPick=null;let r=n.label.replace(/^\S+ /,""),l=s.map(h=>jn(o,h)),d=K(o).filter(h=>s.includes(h));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:n.stay?`Saved. ${tt(d.map(h=>Z(o,h)))}’s rides start from ${r} now.`:`Saved. ${r} is in ${tt(l)}’s ${l.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let l=r instanceof W?r:new W("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}renderForPick(e){let n=this.plan,o=e.stay?n?.days.some(T=>T.date===e.day&&T.all_day?.some(D=>D.id===e.id&&D.stay)):e.placed?n?.days.some(T=>T.date===e.day&&T.events.some(D=>D.id===e.id)):!!this.findUnplaced(e.day,e.id),s=e.stay?"Who’s staying?":"Who is this for?",r=p`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return p`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">${s}</span></div>
          ${r}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let l=e.busy,d=T=>{this.forPick&&(this.forPick={...this.forPick,...T})},h=T=>d({people:e.people.includes(T)?e.people.filter(D=>D!==T):[...e.people,T]}),u=de(n),a=le(n),f=a.length>1&&a.every(T=>e.people.includes(T)),k=[...a,...K(n)].filter(T=>e.people.includes(T)),m=k.map(T=>jn(n,T)),$=!!e.stay&&!k.some(T=>K(n).includes(T)),_=m.length<2?m.join(""):`${m.slice(0,-1).join(", ")} & ${m[m.length-1]}`,g=(T,D,B,ne)=>p`<button
      type="button"
      class="who-chip"
      style="--c:${B.color};--rgb:${B.rgb}"
      aria-pressed=${e.people.includes(T)?"true":"false"}
      ?disabled=${l}
      @click=${()=>h(T)}
    >
      <span class="avatar ${ne?"driver":""}" aria-hidden="true">${me(D)}</span>${D}
    </button>`;return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${s}</span>
          <span class="ed-meta">${ve(e.day)} · ${e.label}</span>
        </div>
        ${r}
      </div>
      ${e.word?p`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:w}
      ${e.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${l} @click=${()=>d({scope:"this"})}>
                Just ${re(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${l} @click=${()=>d({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:w}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${a.map(T=>g(T,se(n,T),u.get(T)??Q(0),!1))}
        </div>
        ${a.length>1?p`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${f?"true":"false"}
              ?disabled=${l}
              @click=${()=>d({people:f?e.people.filter(T=>!a.includes(T)):[...a,...e.people.filter(T=>!a.includes(T))]})}
            >
              All the kids
            </button>`:w}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${K(n).map(T=>g(T,Z(n,T),et,!0))}
        </div>
      </div>
      ${e.stay&&e.timed&&!$?this.renderStayDrive(n,e,d):w}
      <p class="field-hint">
        ${e.stay?p`${e.timed?p`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} while they’re there. Pick the kids
                  going too, so they’re in the car on the drive.`:p`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} on every day of the stay. The kids
                  go wherever their driver goes, so picking just the parents is enough.`}${k.length?p` Saved in the event’s notes as <strong>For: ${_}</strong>.`:w}`:k.length?p`Saved in the event’s notes as <strong>For: ${_}</strong>, so its title stays as it is. It shows in ${k.length>1?"their lanes":`${m[0]}’s lane`}${k.some(T=>a.includes(T))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?p`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${l||!k.length||$} @click=${()=>void this.saveForPick()}>
          ${l?"Saving to Google Calendar…":$?"Pick a parent too":k.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderStayDrive(e,n,o){let s=n.people.filter(a=>K(e).includes(a)),r=tr(e,n),l=n.people.filter(a=>a!==r),d=de(e),h=le(e),u=(a,f)=>{let x=n[f]??[],k=!h.includes(a),m=k?et:d.get(a)??Q(0),$=jn(e,a);return p`<button
        type="button"
        class="who-chip"
        style="--c:${m.color};--rgb:${m.rgb}"
        aria-pressed=${x.includes(a)?"false":"true"}
        ?disabled=${n.busy}
        @click=${()=>o({[f]:x.includes(a)?x.filter(_=>_!==a):[...x,a]})}
      >
        <span class="avatar ${k?"driver":""}" aria-hidden="true">${me($)}</span>${$}
      </button>`};return p`<div class="field">
        <span class="field-label">Drives there and back</span>
        <div role="group" aria-label="Who drives there and back" class="choices" style="grid-template-columns:repeat(${s.length+1},1fr)">
          ${s.map(a=>p`<button type="button" class="choice" aria-pressed=${r===a?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:a})}>
              ${Z(e,a)}
            </button>`)}
          <button type="button" class="choice" aria-pressed=${r===null?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:"none"})}>
            No drive
          </button>
        </div>
      </div>
      ${r&&l.length?p`<div class="field">
              <span class="field-label">In the car there with ${Z(e,r)}</span>
              <div role="group" aria-label="Who rides there" class="who-chips">${l.map(a=>u(a,"ownWay"))}</div>
            </div>
            <div class="field">
              <span class="field-label">In the car back home</span>
              <div role="group" aria-label="Who rides back" class="who-chips">${l.map(a=>u(a,"ownBack"))}</div>
              <p class="field-hint">Anyone not in the car makes their own way, and the hotel is home for them while it lasts.</p>
            </div>`:w}`}renderForLine(e,n,o){let s=e.who?.[o.event_id];if(!s)return w;let r=s.people.map(l=>jn(e,l));return p`<span class="ed-for"
      >For ${tt(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,n,o)}>Change</button></span
    >`}findEvent(e){let n=this.plan?.days.find(s=>s.date===e.day),o=n?.events.find(s=>s.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1}}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(s){let r=s instanceof W?s:new W("error",String(s));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,s){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&s.includes(e.drop)){s.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let s=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>s.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>s.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let s=this.backend,r=o==="pick"?e.pick_along??[]:e.along,l=r.includes(n)?r.filter(d=>d!==n):[...r,n];this.save(`along-${o}`,l,()=>s.setTakeAlong(e.id,l,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let s=((this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by)??e.start)+n;this.arriveDraft=s===e.start?null:s,this.timesOpen={...this.timesOpen,arrive:!0},this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Xo)}clearArrive(){this.arriveDraft=null,this.timesOpen={...this.timesOpen,arrive:!1},this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let s=this.backend,r=o.event.id,l=this.scope;this.save("arrive",e,()=>s.setArriveBy(r,e,l)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,s=Math.max(e.start+5,(o??e.end)+n);this.leaveDraft=s===e.end?null:s,this.timesOpen={...this.timesOpen,leave:!0},this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),Xo)}clearLeave(){this.leaveDraft=null,this.timesOpen={...this.timesOpen,leave:!1},this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let s=this.backend,r=o.event.id,l=this.scope;this.save("leave",e,()=>s.setLeaveBy(r,e,l)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,ql)},Gl)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),s=o?Xs(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,l=this.chores?no(this.chores,this.today().minutes).filter(f=>!this.choreDone(f)):[],d=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,h=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",u=p`<aside class="panel" aria-label=${h}>
      ${d??(this.sel&&e?this.renderEditor(e):this.renderAttention(s,l))}
    </aside>`,a=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<Kl?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,s,l.length)} ${a?this.renderBanner(e):w}
          <main>
            ${a?p`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Kt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Kt(o)?this.renderDayRail(o):w}
                  ${n&&this.away?this.renderBackToToday(this.away):w}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${u}`:w}
          </main>
        </div>
        ${r?u:w}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:w}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let s=n.problems+o;this.tick;let r=this.today(),l="";if(e){let f=e.time_zone,x=new Date(e.updated);this.error?l=p`<span class="bad">${$s(this.error)} · showing the plan from ${ln(x,new Date,f)}</span>`:e.status&&!e.status.ok?l=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${ln(x,new Date,f)}</span>`:this.backend?.live||(l=`Updated ${ln(x,new Date,f)}`)}let d=(f,x,k,m)=>p`
      <button type="button" class="seg-btn" title=${m} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${k}<span class="seg-label">${x}</span>
      </button>
    `,h=(f,x,k)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${k}<span class="seg-label">${x}</span>
      </button>
    `,u=De(r.minutes),a=!!e&&Kt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${J`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:w}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ve(r.date)}, ${u}`}>
            <span class="hm">${u.slice(0,-3)}</span><span class="ampm">${u.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${ve(r.date)}${typeof l=="string"&&l?p`<span class="status"> · ${l}</span>`:w}
          </p>
          ${l&&typeof l!="string"?p`<p class="status">${l}</p>`:w}
        </div>
        ${e&&!a?this.renderNext(e,Js(e,r),n):w}
        <div class="controls">
          ${this.wide||a&&!o?w:p`<button type="button" class="attn-btn ${s?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${s}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?w:p`<div role="group" aria-label="View" class="seg">
            ${d("timeline","Timeline",J`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${d("compact","Compact",J`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${h("rides","Rides",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${h("chores","Chores",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?w:h("lunch","Lunch",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let h=this.today().date,u=o.unassigned,a=o.laterUnassigned;if(u){let x=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${u} ${u===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?p`<div class="next idle needs">${x}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${x}</button>`}if(a)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${a} ${a===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let f=e.days.some(x=>x.date>=h&&x.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let s;n.ongoing?s="On the road now":n.ahead===0?s=n.inMinutes<180?`Next trip · in ${ht(n.inMinutes)}`:"Next trip · later today":n.ahead===1?s="Next trip · tomorrow":s=`Next trip · ${re(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,l=p`
      <span class="next-eyebrow">${s}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${me(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(h=>p`<span class="kid-dot" style="background:${h.color}"></span>`)}</span>
        ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:w}
      </span>
    `,d=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?p`<button type="button" class=${d} @click=${()=>this.open(n.target)}>${l}</button>`:p`<div class=${d}>${l}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return w;let n=this.today().date,o=de(e),s=this.railShown;return p`<div
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
        ${e.days.map(r=>{let l=ci(r),d=r.events.length,h=r.events.slice(0,4).map(a=>a.own?et.color:o.get(a.kid)?.color??Q(0).color),u=`${ve(r.date)}: ${d?`${d} ${d===1?"activity":"activities"}`:"nothing planned"}${l?`, ${l} to sort out`:""}`;return p`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${u}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":re(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${h.length?h.map(a=>p`<span class="rd-dot" style="background:${a}"></span>`):p`<span class="rd-free">free</span>`}
            </span>
            ${l?p`<span class="rd-badge" aria-hidden="true">${l}</span>`:w}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return p`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${J`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=le(e),o=K(e),s=de(e),r=n.map(l=>se(e,l));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((l,d)=>J`<circle cx=${50+d*30} cy="80" r="11" fill=${s.get(l).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${td(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(l=>{let d=s.get(l);return p`<div class="qw-person" style="--c:${d.color};--rgb:${d.rgb}">
            <span class="avatar" aria-hidden="true">${me(se(e,l))}</span>
            <span class="qw-name">${se(e,l)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(l=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${me(Z(e,l))}</span>
            <span class="qw-name">${Z(e,l)}</span>
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
        ${e.inline?p`<div class="dh-chips">${e.allDay.slice(0,e.inline).map(o=>this.renderStripChip(e,o,n))}</div>`:w}
      </div>
      ${e.allDay.length>e.inline?p`<div class="day-strip" style="padding-left:${ft}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:w}`}renderStripChip(e,n,o){let s=p`<span class="strip-title">${n.title}</span>${n.note?p`<span class="strip-note">${n.note}</span>`:w}${n.notes?Zo:w}`,r=n.pick,l=n.stay;return l?p`<button
        type="button"
        class="strip-chip hotel ${n.color?"":"plain"} ${n.notes?"noted":""}"
        style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
        tabindex=${o?-1:0}
        data-note=${n.notes||w}
        aria-label=${`${n.title}: ${n.note}. Pick who’s staying`}
        @click=${()=>this.openStayPick(e.date,l)}
      >
        ${s}
      </button>`:r?p`<button
          type="button"
          class="strip-chip warn plain pick"
          tabindex=${o?-1:0}
          data-note=${n.notes||w}
          aria-label=${`${n.title}: ${n.note} Pick who it’s for`}
          @click=${()=>this.openForPick(e.date,r)}
        >
          ${s}
        </button>`:p`<span
          class="strip-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
          style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
          tabindex=${n.notes&&!o?0:w}
          data-note=${n.notes||w}
          >${s}</span
        >`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,s=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(a=>!a.own&&a.event_id===o.event.event_id).map(a=>a.id):[]),r=a=>!!a&&!!n&&a.day===n.day&&s.has(a.event),l=e.dayHeads.find(a=>a.date===this.pinDay)??e.dayHeads[0],d=e.width,h=100,u=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??h-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??h})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??h+1}))].sort((a,f)=>a.z-f.z);return p`
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
              <span class="avatar ${a.kind}" aria-hidden="true">${me(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0,a.w-58-a.name.length*10.6):w}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        ${l?p`<div class="pinned" aria-hidden="true" style="width:${d}px;height:${l.h}px;margin-bottom:${-l.h}px">
              ${this.renderHead(l,!0)}
            </div>`:w}
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
          ${ke(e.bands,a=>a.key,a=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${ke(e.busy,a=>a.key,a=>p`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${ke(e.windows,a=>a.key,a=>p`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${ke(u,a=>a.x.key,a=>{if(a.t==="link"){let m=a.x;return p`<div
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
                  class="ride ${m.dashed?"dashed":""} ${m.clash?"clash":""} ${m.h>=120?"tall":""}"
                  aria-label=${m.aria}
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;padding-top:${3+(m.tuckTop??0)}px;padding-bottom:${3+(m.tuckBottom??0)}px"
                  @click=${()=>this.open(m.target)}
                >
                  <span class="l1">${m.l1}</span>${m.show2?p`<span class="l2" style="-webkit-line-clamp:${m.lines2}">${m.l2}</span>`:w}
                </button>`}let f=a.x,x=f.color,k=f.skipped?`repeating-linear-gradient(135deg, rgba(${x.rgb},0.10) 0px, rgba(${x.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:f.stayed?`repeating-linear-gradient(135deg, rgba(${x.rgb},0.24) 0px, rgba(${x.rgb},0.24) 6px, rgba(${x.rgb},0.08) 6px, rgba(${x.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${x.rgb},0.15), rgba(${x.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${f.wrap?"wrap":""} ${r(f.target)?"sel":""} ${f.clash?"clash":""} ${f.skipped?"skipped":""} ${f.cut?"cut":""} ${f.event.notes?"noted":""}"
                aria-label=${f.aria}
                data-note=${f.event.notes||w}
                style="left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;background:${k};border-color:${f.clash?"var(--bad)":`rgba(${x.rgb},0.45)`};--c:${x.color};--rgb:${x.rgb};--ring:${x.color}"
                @click=${()=>this.open(f.target)}
              >
                ${f.event.notes?Zo:w}
                <span class="top">
                  <span class="title">${f.title}</span>
                  <span class="time">${f.time}${f.inline&&f.drop?p`<span class="line tone-${f.drop.tone} inline"> · ${f.drop.text}</span>`:w}</span>
                  ${f.showDrop&&f.drop&&!f.inline?p`<span class="line tone-${f.drop.tone}">${f.drop.text}</span>`:w}
                </span>
                ${f.showPick&&f.pick?p`<span class="line tone-${f.pick.tone}">${f.pick.text}</span>`:w}
              </button>`})}
          ${ke(e.stays,a=>a.key,a=>p`<button
                type="button"
                class="stay ${a.cut?"cut":""}"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${ke(e.trips,a=>a.key,a=>p`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""} ${a.h>=120?"tall":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(f=>p`<span class="kid-dot" style="background:${f}"></span>`)}</span>
                ${a.show2?p`<span class="l2">${a.l2}</span>`:w}
                ${a.stops?a.stops.map(f=>p`<span class="stop ${f.warn?"warn":""}">${f.text}</span>`):w}
                ${a.show3?p`<span class="l3">${a.l3}</span>`:w}
              </button>`)}
          ${ke(e.overlaps,a=>a.key,a=>p`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${ke(e.marks,a=>a.key,a=>p`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${ke(e.folds,a=>a.key,a=>p`<div class="fold" style="top:${a.y}px;width:${d-60}px;height:${a.h}px" aria-hidden="true">
                ${od(d-60,a.h)}
              </div>
              <span class="fold-label" style="top:${a.y+a.h/2-9}px" title="${De(a.from)} to ${De(a.to)}">${a.label}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${d-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:w}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:s,later:r}=e,l=this.plan,d=s+n.length,h=this.chores,u=!!h&&!gi(h);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${d?"bad":"ok"}">${d}</span>
        ${this.wide?w:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${u?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?p`<div class="attn-chores">${n.map(a=>this.renderChoreRow(a,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${l&&!s?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${J`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Kt(l)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:w}
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
              </div>`:w}
        </div>`)}
      ${this.wide&&l&&!Kt(l)&&this.page==="rides"?this.renderLegend():w}
    `}kidColorOf(e){let n=this.plan?de(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(s=>s.id===e)??-1;return Q(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let s=this.lunch,r=s?.kids.find(a=>a.id===e);if(!s||!r)return w;this.tick;let l=this.today(),d=uo(r,l.date,l.minutes,this.lunchDraft);if(!d)return w;let h=Wt[d.lunch],u=`${h} lunch ${d.when}${d.menu?`: ${d.menu}`:""}`;return n&&o<36+h.length*7.4?p`<span class="lunch-chip ${d.lunch} small icon" role="img" aria-label=${u} title=${u}
        >${d.lunch==="bring"?Wi:Ki}</span
      >`:p`<span class="lunch-chip ${d.lunch} ${n?"small":""}" title=${u}
      >${d.lunch==="bring"?Wi:Ki}<span class="lunch-chip-text"
        >${h}${n?w:` ${d.when}`}${!n&&d.menu?p`<span class="lunch-chip-menu"> · ${d.menu}</span>`:w}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=lo(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Ee(e.today),s=n.indexOf(o),r=u=>{let a=n[s+u];a&&(this.lunchMonth=a)},l=e.kids.some(u=>u.id===this.lunchKid)?this.lunchKid:null,d=l?e.kids.filter(u=>u.id===l):e.kids,h=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:w;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${s<=0} @click=${()=>r(-1)}>
            ${J`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Tn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${s<0||s>=n.length-1} @click=${()=>r(1)}>
            ${J`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":p`${Jo} Edit menus`}
        </button>
      </div>
      ${h}
      <div class="chore-cols lunch-cols ${l?"wide":""}" style="--n:${d.length}">
        ${d.map(u=>this.renderLunchCard(e,u,o,l!==null))}
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
    </div>`}renderLunchCard(e,n,o,s){let r=this.kidColorOf(n.id),l=co(e,n,o,this.lunchDraft),d=po(l),h=l.flat(),u=h.filter(m=>!m.outside&&!m.past&&m.lunch),a=n.days_off.filter(m=>Ee(m.first)<=o&&o<=Ee(m.last)),f=m=>u.filter($=>kn($.date)===m),x=m=>{let $=f(m);if(!$.length)return;let _=$.every(g=>g.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(g=>g.date),_)},k=u.length?`${d.bring} Bring · ${d.buy} Buy${o===Ee(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${s?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${me(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${k}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Wt[n.default]} unless picked</span>
          ${e.kids.length<2?w:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${s?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=s?null:n.id}
              >
                ${s?Jl:Zl}${s?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:w}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${Tn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((m,$)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f($).length}
            aria-label=${`${f($).every(_=>_.lunch==="bring")?"Buy":"Bring"} every ${m} left in ${Tn(o)} for ${n.name}`}
            @click=${()=>x($)}
          >
            ${m}
          </button>`)}
        ${h.map(m=>this.renderLunchCell(n,m,s))}
      </div>
      ${a.length?p`<p class="lunch-offs">
            No school:
            ${a.map(m=>{let $=m.first<`${o}-01`?`${o}-01`:m.first,_=Ee(m.last)>o?mt(`${ki(o)}-01`,-1):m.last;return`${$===_?Vi($):`${Vi($)}–${Vi(_)}`} ${ho(m.title)}`}).join(" · ")}
          </p>`:w}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return p`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let s=n.lunch,r=s==="buy"?"bring":"buy",l=n.menu?`, ${n.menu}`:"",d=this.menuMode,h=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),u=d?`${e.name}, ${ve(n.date)}${l||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${ve(n.date)}: ${Wt[s]}${n.picked?"":" (not picked yet)"}${l}. Tap to ${Wt[r]}.`;return p`<button
      type="button"
      class="lunch-day ${s} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${d?"editing":""} ${h?"sel":""}"
      ?disabled=${n.past&&!d}
      aria-label=${u}
      @click=${()=>d?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${s==="bring"?Wi:Ki}${Wt[s]}</span>
      ${n.menu?p`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?p`<span class="lunch-sides">${n.sides}</span>`:w}`:d?p`<span class="lunch-menu add">${Rn} Menu</span>`:w}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,s=this.choreDone(e),r=o.kids.findIndex(_=>_.id===e.kid),l=(this.plan?de(this.plan).get(e.kid):void 0)??Q(Math.max(0,r)),d=o.kids[r]?.name??"",h=s===gt(e)?e:{...e,state:s?"done":"open",done_at:s?new Date().toISOString():null},u=s&&h.done_by&&h.done_by!==e.kid?o.people?.find(_=>_.id===h.done_by)?.name??h.done_by_name??null:null,a=`${fi(h,o.today,o.time_zone)}${u?` · by ${u}`:""}`,f=s||eo(e),x=`${n?`${d}: `:""}${e.title}. ${a?`${a}. `:""}${s?"Done. Tap to undo.":"Tap when it’s done."}`,k=p`<span class="box" aria-hidden="true"
        >${s?J`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:w}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:w}
      <span class="chore-text">
        <span class="chore-title">${n?p`<span class="chore-kid">${d}</span> · `:w}${e.title}</span>
        ${a?p`<span class="chore-note">${a}</span>`:w}
      </span>`,m=`chore ${s?"done":""} ${e.state==="overdue"&&!s?"overdue":""} ${f?"":"later"}`,$=`--c:${l.color};--rgb:${l.rgb};--k:${l.ink}`;return f?p`<button type="button" class=${m} style=${$} aria-pressed=${s?"true":"false"} aria-label=${x} @click=${()=>this.tapChore(e)}>
          ${k}
        </button>`:p`<div class=${m} style=${$}>${k}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(gi(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Rn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:w;this.tick;let s=to(e,this.plan?de(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Rn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Jo} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${s.length}">
        ${s.map(r=>{let l=r.overdue.filter(d=>!this.choreDone(d)).length+r.now.filter(d=>!this.choreDone(d)).length;return p`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${me(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${l?`${l} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(d=>this.renderChoreRow(d))}`:w}
            ${r.now.length?p`<h3 class="chore-group">To do</h3>
                  ${r.now.map(d=>this.renderChoreRow(d))}`:w}
            ${r.done.length?p`<h3 class="chore-group">Done</h3>
                  ${r.done.map(d=>this.renderChoreRow(d))}`:w}
            ${r.later.map(d=>p`<h3 class="chore-group">${d.date===e.today?"Later today":ed(d.date,e.today)}</h3>
                ${d.chores.map(h=>this.renderChoreRow(h))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?p`<p class="chore-none">No chores this week.</p>`:w}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,s=this.plan?de(this.plan):void 0,r=this.choreEdit?.template===e.id,l=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map($i).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${wi(e.who,o,e.take_turns)} · ${xi(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:w}</span>
        ${l}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(d=>{let h=o.findIndex(a=>a.id===d),u=s?.get(d)??Q(Math.max(0,h));return p`<span class="kid-dot" style="background:${u.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Rn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,s])=>{let r=e.templates.filter(l=>l.repeats===o);return r.length?p`<section class="manage-group" aria-label=${s}>
                  <h3 class="chore-group">${s}</h3>
                  <div class="tmpl-list">${r.map(l=>this.renderTemplateRow(l))}</div>
                </section>`:w}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return p``;let o=n.kids,s=this.plan?de(this.plan):void 0,r=this.choreBusy,l=e.template?n.templates.find(m=>m.id===e.template):void 0,d=vi(e),h=(l?.problems??[]).filter(m=>m!=="who:"),u=(m,$,_,g=!1)=>p`<button type="button" class="choice ${g?"wide":""}" aria-pressed=${m?"true":"false"} ?disabled=${r} @click=${_}>${$}</button>`,a=(m,$,_,g)=>p`<button type="button" class="chip" aria-pressed=${m?"true":"false"} aria-label=${g??w} ?disabled=${r} @click=${_}>${$}</button>`,f=m=>{m!==e.repeats&&this.changeDraft({repeats:m,days:l&&l.repeats===m?l.days??wn(m):wn(m)})},x=m=>{let $=e.who.includes(m)?e.who.filter(_=>_!==m):o.filter(_=>_.id===m||e.who.includes(_.id)).map(_=>_.id);this.changeDraft({who:$})},k;if(e.repeats==="school"){let m=e.days===it?new Set:e.days===""?new Set([0,1,2,3,4]):mi(e.days)??new Set,$=_=>{let g=new Set(m);g.has(_)?g.delete(_):g.add(_),this.changeDraft({days:g.size===5?"":g.size?bi(g):it})};k=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${nt.slice(0,5).map((_,g)=>a(m.has(g),_.slice(0,2),()=>$(g),_))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${u(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${u(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${u(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let m=e.days.trim(),$=/^\d+$/.test(m)?Number(m):null,_=m&&m.toLowerCase()!=="any"&&m.toLowerCase()!=="last"&&$===null;k=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${_?4:3}, minmax(0, 1fr))">
          ${u(m===""||m.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${u($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${u(m.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${_?u(!0,m,()=>{}):w}
        </div>
        ${$!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${yi($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${m.toLowerCase()==="last"?"Due on the month’s last day.":_?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")k=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let m=e.days===""||e.days.toLowerCase()==="any",$=e.days===it?new Set:m?new Set:mi(e.days)??new Set,_=g=>{let T=new Set($);T.has(g)?T.delete(g):T.add(g),this.changeDraft({days:T.size?bi(T)||"Mon-Sun":it})};k=p`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${u(m,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${u(!m,"On set days",()=>this.changeDraft({days:m?"Sat":e.days}))}
        </div>
        ${m?p`<p class="field-hint">Shows all week, due on Sunday.</p>`:p`<div role="group" aria-label="Days of the week" class="day-chips">
                ${nt.map((g,T)=>a($.has(T),g.slice(0,2),()=>_(T),g))}
              </div>
              <div class="chips">
                ${a(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${a(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?wi(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===it?"No days picked":xi(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${h.length?p`<p class="field-hint bad">${h.map($i).join(". ")}. Saving fixes it.</p>`:w}
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
          ${e.icon&&!Qo.includes(e.icon)?a(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):w}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${Xl}
              @emoji-click=${m=>{let $=m.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:w}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((m,$)=>{let _=s?.get(m.id)??Q($),g=e.who.includes(m.id);return p`<button type="button" class="who-chip" style="--c:${_.color};--rgb:${_.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${()=>x(m.id)}>
              <span class="avatar" aria-hidden="true">${me(m.name)}</span>${m.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${u(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${u(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:w}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${u(e.repeats==="daily","Every day",()=>f("daily"))}
          ${u(e.repeats==="weekly","Every week",()=>f("weekly"))}
          ${u(e.repeats==="monthly","Every month",()=>f("monthly"))}
          ${u(e.repeats==="school","School days",()=>f("school"))}
        </div>
      </div>
      ${k}
      ${e.repeats==="school"?w:p`<div class="field arrive every-row">
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
          @input=${m=>this.changeDraft({details:m.target.value})}
        ></textarea>
      </div>
      ${e.template?p`<div class="field">
              ${u(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!d} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":d?d.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return p``;let o=e.busy,s=u=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...u})},r=u=>s({kids:e.kids.includes(u)?e.kids.filter(a=>a!==u):[...e.kids,u]}),l=n.kids.filter(u=>Bt(u,e.date)),d=e.dish.trim(),h=e.kids.length?d?null:"Type what’s served":"Pick who gets this menu";return p`
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
          @input=${u=>s({dish:u.target.value})}
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
          @input=${u=>s({details:u.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${l.map(u=>{let a=this.kidColorOf(u.id),f=e.kids.includes(u.id);return p`<button type="button" class="who-chip" style="--c:${a.color};--rgb:${a.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${o} @click=${()=>r(u.id)}>
              <span class="avatar" aria-hidden="true">${me(u.name)}</span>${u.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${d||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!h} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":h??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return p``;let o=n.people?.length?n.people:n.kids.map(a=>({...a,role:"kid"})),s=n.kids.findIndex(a=>a.id===e.kid),r=n.kids[s],l=this.plan?de(this.plan):void 0,d=l?.get(e.kid)??Q(Math.max(0,s)),h=o.filter(a=>a.id!==e.kid),u=a=>{let f=n.kids.findIndex(x=>x.id===a.id);return f>=0?(l?.get(a.id)??Q(f)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${fi(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${d.color};--rgb:${d.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${me(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${h.map(a=>p`<button type="button" class="done-by" style="--c:${u(a)}" @click=${()=>void this.toggleChore(e,a.id)}>
                  <span class="avatar ${a.role==="parent"?"driver":""}" aria-hidden="true">${me(a.name)}</span>
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
    </div>`}ownHint(e,n){let o=xn(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${R(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${R(n.start)} to ${R(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let s=n.along.map(r=>K(e).includes(r)?Z(e,r):se(e,r));return`${o} drives there and back${s.length?`, with ${tt(s)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:o,event:s}=n,r=K(e),l=Us(e,s),d=xn(e,s),h=!!this.pending,u=b=>this.pending?.key===b?this.pending.value:void 0,a=[...e.people?.carpools??[]];for(let b of e.days)for(let y of b.events)for(let P of[y.drop,y.pick])P&&P!=="none"&&!r.includes(P)&&!a.some(S=>S.toLowerCase()===P.toLowerCase())&&a.push(P);let f=b=>{if(!s.sides.includes(b))return w;let y=u(b)??u("both"),P=b==="drop"?s.drop:s.pick,S=y!==void 0?String(y):s.no_ride_unless_named&&P==="none"?"":P,M=S===""&&!(y===void 0&&s.no_ride_unless_named),z=S&&S!=="none"&&!r.includes(S)?S:"",L=I=>{this.otherOpen=null,this.setRide(s,b,S===I?"":I,r)},H=[...r.map(I=>[I,li(e,I)]),["none","Not needed"]],we=`${s.id}|${b}`,E=this.otherOpen===we;return p`<div class="field ride-box">
        <span class="field-label">${b==="drop"?"Drop-off":"Pick-up"} ${M?p`<span class="nobody">· nobody yet</span>`:w}</span>
        <div role="group" aria-label=${b==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${H.length+1}, minmax(0, 1fr))">
          ${H.map(([I,V])=>p`<button type="button" class="choice" aria-pressed=${S===I?"true":"false"} ?disabled=${h} @click=${()=>L(I)}>
                ${V}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${z?"true":"false"}
            aria-expanded=${E?"true":"false"}
            ?disabled=${h}
            @click=${()=>this.otherOpen=E?null:we}
          >
            ${z||"Other"}
          </button>
        </div>
        ${E?p`${a.length?p`<div role="group" aria-label=${b==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${a.map(I=>p`<button type="button" class="chip" aria-pressed=${S.toLowerCase()===I.toLowerCase()?"true":"false"} ?disabled=${h} @click=${()=>L(I)}>
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
        ${!_&&S!==""&&S!=="none"?x(b,S):w}
      </div>`},x=(b,y)=>{let P=u(`along-${b}`),S=P!==void 0?P:b==="pick"?s.pick_along??[]:s.along,M=new Set(o.events.filter(H=>H.event_id===s.event_id&&!H.own).map(H=>H.kid)),z=[...le(e).filter(H=>H!==s.kid&&!M.has(H)),...r.filter(H=>H!==y)];return z.length?p`<div class="field-sub">
        <span class="field-label">${b==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${b==="pick"?"Coming home too. Anyone already there just gets in.":b==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${b==="drop"?"Riding along on the drop-off":b==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${z.map(H=>p`<button type="button" class="chip" aria-pressed=${S.includes(H)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,H,b)}>
              ${r.includes(H)?Z(e,H):se(e,H)}
            </button>`)}
        </div>
      </div>`:w},k=r.includes(s.drop)?s.drop:r.includes(s.pick)?s.pick:"",m=s.drop===s.pick&&r.includes(s.drop),$=u("stay"),_=$!==void 0?!!$:s.stay&&m,g=u("along"),T=g!==void 0?g:s.along,D=s.own?[...le(e),...r.filter(b=>b!==s.own)]:[],B=s.own!=null&&s.takes!=null,ne=s.own!=null&&!B,ce=u("takes"),N=ce!==void 0?ce:s.takes??null,Ce=u("arrive"),be=this.arriveDraft!==void 0?this.arriveDraft:Ce!==void 0?Ce:s.arrive_by,Be=u("leave"),ye=this.leaveDraft!==void 0?this.leaveDraft:Be!==void 0?Be:s.leave_by??null,Ne=(b,y)=>{let P=b==="arrive",S=P?s.start:s.end,M=L=>()=>P?this.nudgeArrive(s,L):this.nudgeLeave(s,L),z=(L,H,we,E)=>p`<button
          type="button"
          class="step"
          aria-label=${H}
          ?disabled=${h||E}
          @pointerdown=${()=>this.startHold(M(L))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(M(L))}
        >
          ${we}
        </button>`;return p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${P?"Arrive":"Leave"}</span>
          <span class="field-hint">${an(y-S)}</span>
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
      </div>`},he=s.sides.includes("pick")||s.own!=null,Re=be!=null||this.timesOpen.arrive,je=he&&(ye!=null||this.timesOpen.leave),He=b=>()=>{this.timesOpen={...this.timesOpen,[b]:!0}},Ie=()=>p`${Re?Ne("arrive",be??s.start):w}
      ${je?Ne("leave",ye??s.end):w}
      ${!Re||!je&&he?p`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${Re?w:p`<button type="button" class="chip" ?disabled=${h} @click=${He("arrive")}>Arrive early or late</button>`}
              ${!je&&he?p`<button type="button" class="chip" ?disabled=${h} @click=${He("leave")}>Leave early or late</button>`:w}
            </div>
          </div>`:w}`,Fe=s.sides.includes("drop")&&s.sides.includes("pick"),ze=Fe&&(_||this.stayDraft===s.id),Ue=()=>{let b=Fe?p`<div class="field">
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
          </div>`:w;if(!ze)return p`${b} ${f("drop")} ${f("pick")}`;let y=_&&m?s.drop:"";return p`${b}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${y?w:p`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(P=>p`<button
                type="button"
                class="choice"
                aria-pressed=${y===P?"true":"false"}
                ?disabled=${h}
                @click=${()=>{if(y===P||!this.backend)return;let S=this.backend;this.stayDraft=null,this.save("stay",!0,()=>S.setRide(s.id,"both",P,this.scope,!0))}}
              >
                ${Z(e,P)}
              </button>`)}
          </div>
          ${y?x("both",y):w}
        </div>`},ie=[],xe=b=>b==="none"?"Not needed":li(e,b),q=b=>r.includes(b)?Z(e,b):se(e,b),ue=(b,y,P)=>{y===""&&!P.length||ie.push(`${b}: ${[y===""?"TBD":xe(y),...P.map(q)].join(", ")}`)},ae=b=>s.no_ride_unless_named&&b==="none"?"":b;s.own||ue("Drop-off",ae(s.drop),s.along),s.own||ue("Pick-up",ae(s.pick),s.pick_along??[]),!s.own&&s.stay&&ie.push("Stay: yes"),B&&ie.push(`Takes: ${s.takes} min`),s.own&&s.along.length&&ie.push(`Take along: ${s.along.map(q).join(", ")}`),s.arrive_by!=null&&s.arrive_by!==s.start&&ie.push(`Arrive: ${an(s.arrive_by-s.start)}`),s.leave_by!=null&&s.leave_by!==s.end&&ie.push(`Leave: ${an(s.leave_by-s.end)}`);let We=u("attending"),fe=We!==void 0?!!We:s.attending!==!1;s.attending===!1&&ie.splice(0,ie.length,"Attending: no");let Pe=o.date===this.today().date?"":`${re(o.date)} · `,c=yn(s),v=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${d} · ${s.title}</span>
          <span class="ed-meta">${Pe}${B?"any time ":""}${c}${s.place_name&&!s.place.startsWith("?")?` · ${s.place_name}`:""}</span>
          ${this.renderForLine(e,o,s)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(s.busy_only){let b=s.place_name&&s.place_name!==s.title?s.place_name:"",y=s.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":s.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return p`${v}
        ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
        ${b?p`<div class="field"><span class="field-label">Where</span><span class="field-hint">${b}</span></div>`:w}
        <p class="field-hint">
          ${fe?`This blocks ${d}’s time: ${d} can’t drive then, so a ride that needs ${d} shows as a problem.`:`Not going, so it doesn’t block ${d}’s time, and ${d} can drive then.`}
          ${y}
        </p>
        <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!fe)}>
          ${fe?`${d} isn’t going this time`:`${d} is going after all`}
        </button>
        ${s.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:w}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${s.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return s.where==="home"?p`${v}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${d} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${v}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
      ${s.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${re(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:w}
      ${fe?p`${s.where==="anywhere"?p`<p class="field-hint">
                  ${s.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:w}
            ${s.own?p`<p class="field-hint">${this.ownHint(e,s)}</p>`:Ue()}
      ${s.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${N!=null?`Takes ${N} min, any time ${R(s.start)}–${R(s.end)}`:"At its set time"}</span>
            </span>
            ${N!=null?p`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${h||N<=5} @click=${()=>this.setTakes(s,Math.max(5,N-5))}>−</button>
                  <span class="arrive-value">${N} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${h||N+5>s.end-s.start} @click=${()=>this.setTakes(s,N+5)}>+</button>
                </span>`:w}
          </div>
          <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setTakes(s,N!=null?null:Math.min(10,Math.max(5,s.end-s.start)))}>
            ${N!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:w}
      ${ne&&D.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${D.map(b=>p`<button type="button" class="chip" aria-pressed=${T.includes(b)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,b)}>
                  ${r.includes(b)?Z(e,b):se(e,b)}
                </button>`)}
            </div>
          </div>`:w}
      ${B?w:Ie()}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${d} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!fe)}>
        ${fe?`${d} isn’t going this time`:`${d} is going after all`}
      </button>
      ${s.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:w}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${ie.length?ie.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${fe&&!s.own?p`<p class="field-hint">Tap a selected driver again to clear it.</p>`:w}
    `}};Vt.styles=go,Vt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},timesOpen:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Vt);function od(i,t){let o=Math.max(1,Math.round(i/14)),s=i/o,r=[],l=[];for(let h=0;h<=o;h++){let u=+(h*s).toFixed(1);r.push(`${u},${h%2?5:0}`),l.push(`${u},${t-(h%2?0:5)}`)}let d=`M${r.join(" L")} L${[...l].reverse().join(" L")} Z`;return p`<svg width=${i} height=${t} viewBox="0 0 ${i} ${t}">
    ${J`<path class="fold-fill" d=${d}></path>
      <path class="fold-edge" d=${`M${r.join(" L")}`}></path>
      <path class="fold-edge" d=${`M${l.join(" L")}`}></path>`}
  </svg>`}var Gt=class extends ge{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=vs(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(Mt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new dn(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return p`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?p`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:w}`}};Gt.styles=Ve`
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
  `,Gt.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",Gt);
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
