var xr=Object.defineProperty;var Fn=(i,t)=>()=>(i&&(t=i(i=0)),t);var wr=(i,t)=>{for(var e in t)xr(i,e,{get:t[e],enumerable:!0})};function Mn(i){if(typeof i!="string"||!i)throw new Error("expected a non-empty string, got: "+i)}function Ai(i){if(typeof i!="number")throw new Error("expected a number, got: "+i)}function Fa(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function Ao(i){return Fa(i,t=>t.unicode)}function Ua(i){function t(e,n,o){let s=n?i.createObjectStore(e,{keyPath:n}):i.createObjectStore(e);if(o)for(let[r,[a,l]]of Object.entries(o))s.createIndex(r,a,{multiEntry:l});return s}t($t),t(ot,Ia,{[Lo]:[za,!0],[zo]:[[ja,Oa]],[Io]:[Ba,!0]}),t(zi,void 0,{[Ro]:[""]})}function jo(i,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>i(e.result)}async function Wa(i){let t=await new Promise((e,n)=>{let o=indexedDB.open(i,La);Li[i]=o,o.onupgradeneeded=s=>{s.oldVersion<Ra&&Ua(o.result)},jo(e,n,o)});return t.onclose=()=>ji(i),t}function Ka(i){return Dn[i]||(Dn[i]=Wa(i)),Dn[i]}function je(i,t,e,n){return new Promise((o,s)=>{let r=i.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(h=>r.objectStore(h)),l;n(a,r,h=>{l=h}),r.oncomplete=()=>o(l),r.onerror=()=>s(r.error)})}function ji(i){let t=Li[i],e=t&&t.result;if(e){e.close();let n=Rn[i];if(n)for(let o of n)o()}delete Li[i],delete Dn[i],delete Rn[i]}function Ga(i){return new Promise((t,e)=>{ji(i);let n=indexedDB.deleteDatabase(i);jo(t,e,n)})}function Va(i,t){let e=Rn[i];e||(e=Rn[i]=[]),e.push(t)}function wt(i){return i.split(/[\s_]+/).map(t=>!t.match(/\w/)||qa.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Oo(i){return i.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Ya)}function Xa(i){return i.map(({annotation:e,emoticon:n,group:o,order:s,shortcodes:r,skins:a,tags:l,emoji:h,version:u})=>{let f=[...new Set(Oo([...(r||[]).map(wt).flat(),...(l||[]).map(wt).flat(),...wt(e),n]))].sort(),b={annotation:e,group:o,order:s,tags:l,tokens:f,unicode:h,version:u};if(n&&(b.emoticon=n),r&&(b.shortcodes=r),a){b.skinTones=[],b.skinUnicodes=[],b.skinVersions=[];for(let{tone:c,emoji:y,version:m}of a)b.skinTones.push(c),b.skinUnicodes.push(y),b.skinVersions.push(m)}return b})}function Bo(i,t,e,n){i[t](e).onsuccess=o=>n&&n(o.target.result)}function st(i,t,e){Bo(i,"get",t,e)}function No(i,t,e){Bo(i,"getAll",t,e)}function Oi(i){i.commit&&i.commit()}function Za(i,t){let e=i[0];for(let n=1;n<i.length;n++){let o=i[n];t(e)>t(o)&&(e=o)}return e}function Ho(i,t){let e=Za(i,o=>o.length),n=[];for(let o of e)i.some(s=>s.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Ja(i){return!await Bi(i,$t,Ln)}async function Qa(i,t,e){let[n,o]=await Promise.all([Di,Ln].map(s=>Bi(i,$t,s)));return n===e&&o===t}async function el(i,t){return je(i,ot,Tt,(n,o,s)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=l=>{let h=l.target.result;for(let u of h)if(r=u.unicode,t(u))return s(u);if(h.length<50)return s();a()}};a()})}async function Fo(i,t,e,n){try{let o=Xa(t);await je(i,[ot,$t],Ii,([s,r],a)=>{let l,h,u=0;function f(){++u===2&&b()}function b(){if(!(l===n&&h===e)){s.clear();for(let c of o)s.put(c);r.put(n,Di),r.put(e,Ln),Oi(a)}}st(r,Di,c=>{l=c,f()}),st(r,Ln,c=>{h=c,f()})})}finally{}}async function tl(i,t){return je(i,ot,Tt,(e,n,o)=>{let s=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);No(e.index(zo),s,o)})}async function Uo(i,t){let e=Oo(wt(t));return e.length?je(i,ot,Tt,(n,o,s)=>{let r=[],a=()=>{r.length===e.length&&l()},l=()=>{let h=Ho(r,u=>u.unicode);s(h.sort((u,f)=>u.order<f.order?-1:1))};for(let h=0;h<e.length;h++){let u=e[h],f=h===e.length-1?IDBKeyRange.bound(u,u+"￿",!1,!0):IDBKeyRange.only(u);No(n.index(Lo),f,b=>{r.push(b),a()})}}):[]}async function nl(i,t){let e=await Uo(i,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(s=>s.toLowerCase()).includes(t.toLowerCase()))[0]||null:await el(i,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function il(i,t){return je(i,ot,Tt,(e,n,o)=>st(e,t,s=>{if(s)return o(s);st(e.index(Io),t,r=>o(r||null))}))}function Bi(i,t,e){return je(i,t,Tt,(n,o,s)=>st(n,e,s))}function sl(i,t,e,n){return je(i,t,Ii,(o,s)=>{o.put(n,e),Oi(s)})}function ol(i,t){return je(i,zi,Ii,(e,n)=>st(e,t,o=>{e.put((o||0)+1,t),Oi(n)}))}function rl(i,t,e){return e===0?[]:je(i,[zi,ot],Tt,([n,o],s,r)=>{let a=[];n.index(Ro).openCursor(void 0,"prev").onsuccess=l=>{let h=l.target.result;if(!h)return r(a);function u(c){if(a.push(c),a.length===e)return r(a);h.continue()}let f=h.primaryKey,b=t.byName(f);if(b)return u(b);st(o,f,c=>{if(c)return u(c);h.continue()})}})}function al(i,t){let e=new Map;for(let o of i){let s=t(o);for(let r of s){let a=e;for(let h=0;h<r.length;h++){let u=r.charAt(h),f=a.get(u);f||(f=new Map,a.set(u,f)),a=f}let l=a.get(An);l||(l=[],a.set(An,l)),l.push(o)}}return(o,s)=>{let r=e;for(let h=0;h<o.length;h++){let u=o.charAt(h),f=r.get(u);if(f)r=f;else return[]}if(s)return r.get(An)||[];let a=[],l=[r];for(;l.length;){let u=[...l.shift().entries()].sort((f,b)=>f[0]<b[0]?-1:1);for(let[f,b]of u)f===An?a.push(...b):l.push(b)}return a}}function dl(i){let t=i&&Array.isArray(i),e=t&&i.length&&(!i[0]||ll.some(n=>!(n in i[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function Do(i){dl(i);let t=(b,c)=>b.name.toLowerCase()<c.name.toLowerCase()?-1:1,e=i.sort(t),o=al(i,b=>{let c=new Set;if(b.shortcodes)for(let y of b.shortcodes)for(let m of wt(y))c.add(m);return c}),s=b=>o(b,!0),r=b=>o(b,!1),a=b=>{let c=wt(b),y=c.map((m,$)=>($<c.length-1?s:r)(m));return Ho(y,m=>m.name).sort(t)},l=new Map,h=new Map;for(let b of i){h.set(b.name.toLowerCase(),b);for(let c of b.shortcodes||[])l.set(c.toLowerCase(),b)}return{all:e,search:a,byShortcode:b=>l.get(b.toLowerCase()),byName:b=>h.get(b.toLowerCase())}}function qt(i){if(!i)return i;if(cl&&(i=structuredClone(i)),delete i.tokens,i.skinTones){let t=i.skinTones.length;i.skins=Array(t);for(let e=0;e<t;e++)i.skins[e]={tone:i.skinTones[e],unicode:i.skinUnicodes[e],version:i.skinVersions[e]};delete i.skinTones,delete i.skinUnicodes,delete i.skinVersions}return i}function Wo(i){i||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function pl(i){if(!i||!Array.isArray(i)||!i[0]||typeof i[0]!="object"||hl.some(t=>!(t in i[0])))throw new Error("Emoji data is in the wrong format")}function Ko(i,t){if(Math.floor(i.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+i.status)}async function ul(i){let t=await fetch(i,{method:"HEAD"});Ko(t,i);let e=t.headers.get("etag");return Wo(e),e}async function Ri(i){let t=await fetch(i);Ko(t,i);let e=t.headers.get("etag");Wo(e);let n=await t.json();return pl(n),[e,n]}function fl(i){for(var t="",e=new Uint8Array(i),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function gl(i){for(var t=i.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=i.charCodeAt(o);return e}async function Go(i){let t=JSON.stringify(i),e=gl(t),n=await crypto.subtle.digest("SHA-1",e),o=fl(n);return btoa(o)}async function ml(i,t){let e,n=await ul(t);if(!n){let o=await Ri(t);n=o[0],e=o[1],n||(n=await Go(e))}await Qa(i,t,n)||(e||(e=(await Ri(t))[1]),await Fo(i,e,t,n))}async function bl(i,t){let[e,n]=await Ri(t);e||(e=await Go(n)),await Fo(i,n,t,e)}async function vl(i,t){try{await ml(i,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var La,Ra,ot,$t,zi,za,Lo,Ia,Ro,ja,Oa,zo,Di,Ln,Mo,Tt,Ii,Io,Ba,Na,Ha,Li,Dn,Rn,qa,Ya,An,ll,cl,hl,kt,Ni=Fn(()=>{La=1,Ra=1,ot="emoji",$t="keyvalue",zi="favorites",za="tokens",Lo="tokens",Ia="unicode",Ro="count",ja="group",Oa="order",zo="group-order",Di="eTag",Ln="url",Mo="skinTone",Tt="readonly",Ii="readwrite",Io="skinUnicodes",Ba="skinUnicodes",Na="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Ha="en";Li={},Dn={},Rn={};qa=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Ya=2;An="";ll=["name","url"];cl=typeof wrappedJSObject<"u";hl=["annotation","emoji","group","order","version"];kt=class{constructor({dataSource:t=Na,locale:e=Ha,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Do(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Ka(this._dbName);Va(this._dbName,this._clear);let e=this.dataSource;await Ja(t)?await bl(t,e):this._lazyUpdate=vl(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Ai(t),await this.ready(),Ao(await tl(this._db,t)).map(qt)}async getEmojiBySearchQuery(t){Mn(t),await this.ready();let e=this._custom.search(t),n=Ao(await Uo(this._db,t)).map(qt);return[...e,...n]}async getEmojiByShortcode(t){Mn(t),await this.ready();let e=this._custom.byShortcode(t);return e||qt(await nl(this._db,t))}async getEmojiByUnicodeOrName(t){Mn(t),await this.ready();let e=this._custom.byName(t);return e||qt(await il(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Bi(this._db,$t,Mo)||0}async setPreferredSkinTone(t){return Ai(t),await this.ready(),sl(this._db,$t,Mo,t)}async incrementFavoriteEmojiCount(t){return Mn(t),await this.ready(),ol(this._db,t)}async getTopFavoriteEmoji(t){return Ai(t),await this.ready(),(await rl(this._db,this._custom,t)).map(qt)}set customEmoji(t){this._custom=Do(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await ji(this._dbName)}async delete(){await this._shutdown(),await Ga(this._dbName)}}});function qo(i){return i.unicode.includes("‍")}function _l(i){let t=Yo(i,"#000"),e=Yo(i,"#fff");return t&&e&&Cl(t,e)}function Pl(){let i=Object.entries(xl);try{for(let[t,e]of i)if(_l(t))return e}catch{}finally{}return i[0][1]}function Rl(i,t){if(t===0)return i;let e=i.indexOf(Al);return e!==-1?i.substring(0,e)+String.fromCodePoint(Dl+t-1)+i.substring(e):(i.endsWith(Sl)&&(i=i.substring(0,i.length-1)),i+Ml+String.fromCodePoint(Ll+t-1))}function _e(i){i.preventDefault(),i.stopPropagation()}function Wi(i,t,e){return t+=i?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function sr(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function zl(i,t){let e=n=>{let o={};for(let s of n)typeof s.tone=="number"&&s.version<=t&&(o[s.tone]=s.unicode);return o};return i.map(({unicode:n,skins:o,shortcodes:s,url:r,name:a,category:l,annotation:h})=>({unicode:n,name:a,shortcodes:s,url:r,category:l,annotation:h,id:n||a,skins:o&&e(o)}))}function jl(i,t,e){let n;Il?(n=new ResizeObserver(e),n.observe(i)):In(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Xo(i){{let t=document.createRange();return t.selectNode(i.firstChild),t.getBoundingClientRect().width}}function Zo(i,t,e){let n=Xo(t);if(!n){if(!rt){rt=e.cloneNode(!0);let o=getComputedStyle(e);for(let s of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])rt.style.setProperty(s,o.getPropertyValue(s),"important")}try{return document.body.appendChild(rt),rt.firstChild.nodeValue=i,Xo(rt)}finally{rt.remove()}}return n}function Bl(i,t,e){let n=!0;for(let o of i){let s=e(o);if(!s)continue;typeof Ki>"u"&&(Ki=Zo(Ol,t,t));let a=Zo(o.unicode,s,t)/1.8<Ki;Yi.set(o.unicode,a),a||(n=!1)}return n}function Nl(i){return sr(i,t=>t)}function Hl(i){i&&(i.scrollTop=0)}function Yt(i,t,e){let n=i.get(t);return n||(n=e(),i.set(t,n)),n}function Jo(i){return""+i}function Fl(i){let t=document.createElement("template");return t.innerHTML=i,t}function Vl(i,t){Gl?i.replaceChildren(...t):(i.innerHTML="",i.append(...t))}function ql(i,t){let e=i.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Yl(i,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=ql(n,i):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&Vl(n,i)}function Xl(i,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:s,attributeName:r,attributeValuePre:a,attributeValuePost:l}}=e,h=i[s];if(o!==h)if(e.currentExpression=h,r)if(h===null)n.removeAttribute(r);else{let u=a+Jo(h)+l;n.setAttribute(r,u)}else{let u;Array.isArray(h)?Yl(h,e):h instanceof Element?(u=h,n.replaceWith(u)):n.nodeValue=Jo(h),u&&(e.targetNode=u)}}}function Zl(i){let t="",e=!1,n=!1,o=-1,s=new Map,r=[],a=0;for(let h=0,u=i.length;h<u;h++){let f=i[h];if(t+=f.slice(a),h===u-1)break;for(let g=0;g<f.length;g++)switch(f.charAt(g)){case"<":{f.charAt(g+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let b=r[r.length-1],c=Yt(s,b,()=>[]),y,m,$;if(n){let g=/(\S+)="?([^"=]*)$/.exec(f);y=g[1],m=g[2];let E=/^([^">]*)("?)/.exec(i[h+1]);$=E[1],t=t.slice(0,-1*g[0].length),a=E[0].length}else a=0;let k={attributeName:y,attributeValuePre:m,attributeValuePost:$,expressionIndex:h};c.push(k),!e&&!n&&(t+=" ")}return{template:Fl(t),elementsToBindings:s}}function Qo(i,t,e){for(let n=0;n<i.length;n++){let o=i[n],s=o.attributeName?t:t.firstChild,r={binding:o,targetNode:s,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Jl(i,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Qo(n,i,e);else{let o=document.createTreeWalker(i,NodeFilter.SHOW_ELEMENT),s=i,r=-1;do{let a=t.get(++r);a&&Qo(a,s,e)}while(s=o.nextNode())}return e}function Ql(i){let{template:t,elementsToBindings:e}=Yt(Ul,i,()=>Zl(i)),n=t.cloneNode(!0).content.firstElementChild,o=Jl(n,e);return function(r){return Xl(r,o),n}}function ed(i){let t=Yt(Wl,i,()=>new Map),e=Kl;function n(s,...r){let a=Yt(t,s,()=>new Map);return Yt(a,e,()=>Ql(s))(r)}function o(s,r,a){return s.map((l,h)=>{let u=e;e=a(l);try{return r(l,h)}finally{e=u}})}return{map:o,html:n}}function td(i,t,e,n,o,s,r,a,l){let{labelWithSkin:h,titleForEmoji:u,unicodeWithSkin:f}=e,{html:b,map:c}=ed(t);function y(g,E,D){return c(g,(O,Y)=>b`<button role="${E?"option":"menuitem"}" aria-selected="${E?Y===t.activeSearchItem:null}" aria-label="${h(O,t.currentSkinTone)}" title="${u(O)}" class="${"emoji"+(E&&Y===t.activeSearchItem?" active":"")+(O.unicode?"":" custom-emoji")}" id="${`${D}-${O.id}`}" style="${O.unicode?null:`--custom-emoji-background: url(${JSON.stringify(O.url)})`}">${O.unicode?f(O,t.currentSkinTone):""}</button>`,O=>`${D}-${O.id}`)}let $=b`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${c(t.skinTones,(g,E)=>b`<div id="skintone-${E}" class="emoji ${E===t.activeSkinTone?"active":""}" aria-selected="${E===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[E]}" aria-label="${t.i18n.skinTones[E]}">${g}</div>`,g=>g)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${c(t.groups,g=>b`<button role="tab" class="nav-button" aria-controls="tab-${g.id}" aria-label="${t.i18n.categories[g.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===g.id}" title="${t.i18n.categories[g.name]}" data-group-id="${g.id}"><div class="nav-emoji emoji">${g.emoji}</div></button>`,g=>g.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${c(t.currentEmojisWithCategories,(g,E)=>b`<div><div id="menu-label-${E}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:g.category?g.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${E!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(g.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${E}" id="${t.searchMode?"search-results":null}">${y(g.emojis,t.searchMode,"emo")}</div></div>`,g=>g.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${y(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,k=(g,E)=>{for(let D of i.querySelectorAll(`[${g}]`))E(D,D.getAttribute(g))};if(l){i.appendChild($);for(let g of["click","focusout","input","keydown","keyup"])k(`data-on-${g}`,(E,D)=>{E.addEventListener(g,n[D])});k("data-ref",(g,E)=>{s[E]=g}),r.addEventListener("abort",()=>{i.removeChild($)})}k("data-action",(g,E)=>{let D=a.get(E);D||a.set(E,D=new WeakSet),D.has(g)||(D.add(g),o[E](g))})}function nd(i){let t=!1,e,n=new Map,o=new Set,s,r=()=>{if(t)return;let h=[...o];o.clear();try{for(let u of h)u()}finally{s=!1,o.size&&(s=!0,jn(r))}},a=new Proxy({},{get(h,u){if(e){let f=n.get(u);f||(f=new Set,n.set(u,f)),f.add(e)}return h[u]},set(h,u,f){if(h[u]!==f){h[u]=f;let b=n.get(u);if(b){for(let c of b)o.add(c);s||(s=!0,jn(r))}}return!0}}),l=h=>{let u=()=>{let f=e;e=u;try{return h()}finally{e=f}};return u()};return i.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:l}}function Gi(i,t,e){if(i.length!==t.length)return!1;for(let n=0;n<i.length;n++)if(!e(i[n],t[n]))return!1;return!0}function id(i,t,e){{let n=i.closest(".tabpanel"),o=er.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),er.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(i)}}function sd(i,t){let e={},n=new AbortController,o=n.signal,{state:s,createEffect:r}=nd(o),a=new Map;zn(s,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),zn(s,t),zn(s,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:kl,isRtl:!1,currentGroupIndex:0,groups:Hi,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{s.currentGroup!==s.groups[s.currentGroupIndex]&&(s.currentGroup=s.groups[s.currentGroupIndex])});let l=d=>{i.getElementById(d).focus()},h=d=>i.getElementById(`emo-${d.id}`),u=(d,w)=>{e.rootElement.dispatchEvent(new CustomEvent(d,{detail:w,bubbles:!0,composed:!0}))},f=(d,w)=>d.id===w.id,b=(d,w)=>{let{category:T,emojis:v}=d,{category:S,emojis:P}=w;return T!==S?!1:Gi(v,P,f)},c=d=>{Gi(s.currentEmojis,d,f)||(s.currentEmojis=d)},y=d=>{s.searchMode!==d&&(s.searchMode=d)},m=d=>{Gi(s.currentEmojisWithCategories,d,b)||(s.currentEmojisWithCategories=d)},$=(d,w)=>w&&d.skins&&d.skins[w]||d.unicode,E={labelWithSkin:(d,w)=>Nl([d.name||$(d,w),d.annotation,...d.shortcodes||Vi].filter(Boolean)).join(", "),titleForEmoji:d=>d.annotation||(d.shortcodes||Vi).join(", "),unicodeWithSkin:$},D={onClickSkinToneButton:be,onEmojiClick:Me,onNavClick:Pe,onNavKeydown:lt,onSearchKeydown:Ne,onSkinToneOptionsClick:ee,onSkinToneOptionsFocusOut:Ge,onSkinToneOptionsKeydown:he,onSkinToneOptionsKeyup:Ke,onSearchInput:pe},O={calculateEmojiGridStyle:U,updateOnIntersection:ae},Y=!0;r(()=>{td(i,s,E,D,O,e,o,a,Y),Y=!1}),s.emojiVersion||Ui().then(d=>{d||(s.message=s.i18n.emojiUnsupportedMessage)}),r(()=>{async function d(){let w=!1,T=setTimeout(()=>{w=!0,s.message=s.i18n.loadingMessage},wl);try{await s.database.ready(),s.databaseLoaded=!0}catch(v){console.error(v),s.message=s.i18n.networkErrorMessage}finally{clearTimeout(T),w&&(w=!1,s.message="")}}s.database&&d()}),r(()=>{s.pickerStyle=`
      --num-groups: ${s.groups.length}; 
      --indicator-opacity: ${s.searchMode?0:1}; 
      --num-skintones: ${Vo};`}),r(()=>{s.customEmoji&&s.database&&fe()}),r(()=>{s.customEmoji&&s.customEmoji.length?s.groups!==qi&&(s.groups=qi):s.groups!==Hi&&(s.currentGroupIndex&&s.currentGroupIndex--,s.groups=Hi)}),r(()=>{async function d(){s.databaseLoaded&&(s.currentSkinTone=await s.database.getPreferredSkinTone())}d()}),r(()=>{s.skinTones=Array(Vo).fill().map((d,w)=>Rl(s.skinToneEmoji,w))}),r(()=>{s.skinToneButtonText=s.skinTones[s.currentSkinTone]}),r(()=>{s.skinToneButtonLabel=s.i18n.skinToneLabel.replace("{skinTone}",s.i18n.skinTones[s.currentSkinTone])}),r(()=>{async function d(){let{database:w}=s,T=(await Promise.all(Tl.map(v=>w.getEmojiByUnicodeOrName(v)))).filter(Boolean);s.defaultFavoriteEmojis=T}s.databaseLoaded&&d()});function fe(){let{customEmoji:d,database:w}=s,T=d||Vi;w.customEmoji!==T&&(w.customEmoji=T)}r(()=>{async function d(){fe();let{database:w,defaultFavoriteEmojis:T,numColumns:v}=s,S=await w.getTopFavoriteEmoji(v),P=await ge(sr([...S,...T],_=>_.unicode||_.name).slice(0,v));s.currentFavorites=P}s.databaseLoaded&&s.defaultFavoriteEmojis&&d()});function U(d){jl(d,o,()=>{{let w=getComputedStyle(e.rootElement),T=parseInt(w.getPropertyValue("--num-columns"),10),v=w.getPropertyValue("direction")==="rtl";s.numColumns=T,s.isRtl=v}})}function ae(d){id(d,o,w=>{for(let{target:T,isIntersecting:v}of w)T.classList.toggle("onscreen",v)})}r(()=>{async function d(){let{searchText:w,currentGroup:T,databaseLoaded:v,customEmoji:S}=s;if(!v)s.currentEmojis=[],s.searchMode=!1;else if(w.length>=yl){let P=await Be(w);s.searchText===w&&(c(P),y(!0))}else{let{id:P}=T;if(P!==-1||S&&S.length){let _=await Oe(P);s.currentGroup.id===P&&(c(_),y(!1))}}}d()});let ye=()=>{In(()=>Hl(e.tabpanelElement))};r(()=>{let{currentEmojis:d,emojiVersion:w}=s,T=d.filter(v=>v.unicode).filter(v=>qo(v)&&!Yi.has(v.unicode));if(!w&&T.length)c(d),In(()=>Fe(T));else{let v=w?d:d.filter($e);c(v),ye()}});function Fe(d){Bl(d,e.baselineEmoji,h)?ye():s.currentEmojis=[...s.currentEmojis]}function $e(d){return!d.unicode||!qo(d)||Yi.get(d.unicode)}async function Ue(d){let w=s.emojiVersion||await Ui();return d.filter(({version:T})=>!T||T<=w)}async function ge(d){return zl(d,s.emojiVersion||await Ui())}async function Oe(d){let w=d===-1?s.customEmoji:await s.database.getEmojiByGroup(d);return ge(await Ue(w))}async function Be(d){return ge(await Ue(await s.database.getEmojiBySearchQuery(d)))}r(()=>{}),r(()=>{function d(){let{searchMode:T,currentEmojis:v}=s;if(T)return[{category:"",emojis:v}];let S=new Map;for(let P of v){let _=P.category||"",B=S.get(_);B||(B=[],S.set(_,B)),B.push(P)}return[...S.entries()].map(([P,_])=>({category:P,emojis:_})).sort((P,_)=>s.customCategorySorting(P.category,_.category))}let w=d();m(w)}),r(()=>{s.activeSearchItemId=s.activeSearchItem!==-1&&s.currentEmojis[s.activeSearchItem].id}),r(()=>{let{rawSearchText:d}=s;nr(()=>{s.searchText=(d||"").trim(),s.activeSearchItem=-1})});function Ne(d){if(!s.searchMode||!s.currentEmojis.length)return;let w=T=>{_e(d),s.activeSearchItem=Wi(T,s.activeSearchItem,s.currentEmojis)};switch(d.key){case"ArrowDown":return w(!1);case"ArrowUp":return w(!0);case"Enter":if(s.activeSearchItem===-1)s.activeSearchItem=0;else return _e(d),Se(s.currentEmojis[s.activeSearchItem].id)}}function Pe(d){let{target:w}=d,T=w.closest(".nav-button");if(!T)return;let v=parseInt(T.dataset.groupId,10);e.searchElement.value="",s.rawSearchText="",s.searchText="",s.activeSearchItem=-1,s.currentGroupIndex=s.groups.findIndex(S=>S.id===v)}function lt(d){let{target:w,key:T}=d,v=S=>{S&&(_e(d),S.focus())};switch(T){case"ArrowLeft":return v(w.previousElementSibling);case"ArrowRight":return v(w.nextElementSibling);case"Home":return v(w.parentElement.firstElementChild);case"End":return v(w.parentElement.lastElementChild)}}async function We(d){let w=await s.database.getEmojiByUnicodeOrName(d),T=[...s.currentEmojis,...s.currentFavorites].find(S=>S.id===d),v=T.unicode&&$(T,s.currentSkinTone);return await s.database.incrementFavoriteEmojiCount(d),{emoji:w,skinTone:s.currentSkinTone,...v&&{unicode:v},...T.name&&{name:T.name}}}async function Se(d){let w=We(d);u("emoji-click-sync",w),u("emoji-click",await w)}function Me(d){let{target:w}=d;if(!w.classList.contains("emoji"))return;_e(d);let T=w.id.substring(4);Se(T)}function ie(d){s.currentSkinTone=d,s.skinTonePickerExpanded=!1,l("skintone-button"),u("skin-tone-change",{skinTone:d}),s.database.setPreferredSkinTone(d)}function ee(d){let{target:{id:w}}=d,T=w&&w.match(/^skintone-(\d)/);if(!T)return;_e(d);let v=parseInt(T[1],10);ie(v)}function be(d){s.skinTonePickerExpanded=!s.skinTonePickerExpanded,s.activeSkinTone=s.currentSkinTone,s.skinTonePickerExpanded&&(_e(d),In(()=>l("skintone-list")))}r(()=>{s.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{s.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):s.skinTonePickerExpandedAfterAnimation=!1});function he(d){if(!s.skinTonePickerExpanded)return;let w=async T=>{_e(d),s.activeSkinTone=T};switch(d.key){case"ArrowUp":return w(Wi(!0,s.activeSkinTone,s.skinTones));case"ArrowDown":return w(Wi(!1,s.activeSkinTone,s.skinTones));case"Home":return w(0);case"End":return w(s.skinTones.length-1);case"Enter":return _e(d),ie(s.activeSkinTone);case"Escape":return _e(d),s.skinTonePickerExpanded=!1,l("skintone-button")}}function Ke(d){if(s.skinTonePickerExpanded)switch(d.key){case" ":return _e(d),ie(s.activeSkinTone)}}async function Ge(d){let{relatedTarget:w}=d;(!w||w.id!=="skintone-list")&&(s.skinTonePickerExpanded=!1)}function pe(d){s.rawSearchText=d.target.value}return{$set(d){zn(s,d)},$destroy(){n.abort()}}}function tr(i){i instanceof at||Object.setPrototypeOf(i,customElements.get(i.tagName.toLowerCase()).prototype)}var qi,Hi,yl,Vo,nr,xl,wl,$l,kl,Tl,ir,El,Yo,Cl,Fi,Ui,Yi,Sl,Ml,Al,Dl,Ll,In,Il,Ol,Ki,rt,Ul,Wl,Kl,Gl,jn,er,Vi,zn,od,rd,ad,ld,or,dd,at,rr,ar=Fn(()=>{Ni();qi=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([i,t,e])=>({id:i,emoji:t,name:e})),Hi=qi.slice(1),yl=2,Vo=6,nr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;xl={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},wl=1e3,$l="🖐️",kl=8,Tl=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],ir='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',El=(i,t)=>i<t?-1:i>t?1:0,Yo=(i,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${ir}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(i,0,0),n.getImageData(0,0,1,1).data},Cl=(i,t)=>{let e=[...i].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};Ui=()=>(Fi||(Fi=new Promise(i=>nr(()=>i(Pl())))),Fi),Yi=new Map,Sl="️",Ml="\uD83C",Al="‍",Dl=127995,Ll=57339;In=requestAnimationFrame,Il=typeof ResizeObserver=="function";Ol="😀";Ul=new WeakMap,Wl=new WeakMap,Kl=Symbol("un-keyed"),Gl="replaceChildren"in Element.prototype;jn=typeof queueMicrotask=="function"?queueMicrotask:i=>Promise.resolve().then(i);er=new WeakMap;Vi=[],{assign:zn}=Object;od="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",rd="en",ad={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},ld=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',or=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],dd=`:host{--emoji-font-family:${ir}}`,at=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=ld+dd,this.shadowRoot.appendChild(e),this._ctx={locale:rd,dataSource:od,skinToneEmoji:$l,customCategorySorting:El,customEmoji:null,i18n:ad,emojiVersion:null,...t};for(let n of or)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){tr(this),this._cmp||(this._cmp=sd(this.shadowRoot,this._ctx))}disconnectedCallback(){tr(this),jn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,s)=>s.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new kt({locale:t,dataSource:e}))}_dbFlush(){jn(()=>this._dbCreate())}},rr={};for(let i of or)rr[i]={get(){return i==="database"&&this._dbCreate(),this._ctx[i]},set(t){if(i==="database")throw new Error("database is read-only");this._set(i,t)}};Object.defineProperties(at.prototype,rr);customElements.get("emoji-picker")||customElements.define("emoji-picker",at)});var lr={};wr(lr,{Database:()=>kt,Picker:()=>at});var dr=Fn(()=>{ar();Ni()});var nn=globalThis,sn=nn.ShadowRoot&&(nn.ShadyCSS===void 0||nn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Un=Symbol(),ns=new WeakMap,_t=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Un)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(sn&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=ns.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ns.set(e,t))}return t}toString(){return this.cssText}},is=i=>new _t(typeof i=="string"?i:i+"",void 0,Un),qe=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[s+1],i[0]);return new _t(e,i,Un)},ss=(i,t)=>{if(sn)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=nn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,i.appendChild(n)}},Wn=sn?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return is(e)})(i):i;var{is:$r,defineProperty:kr,getOwnPropertyDescriptor:Tr,getOwnPropertyNames:Er,getOwnPropertySymbols:Cr,getPrototypeOf:_r}=Object,on=globalThis,os=on.trustedTypes,Pr=os?os.emptyScript:"",Sr=on.reactiveElementPolyfillSupport,Pt=(i,t)=>i,Kn={toAttribute(i,t){switch(t){case Boolean:i=i?Pr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},as=(i,t)=>!$r(i,t),rs={attribute:!0,type:String,converter:Kn,reflect:!1,useDefault:!1,hasChanged:as};Symbol.metadata??=Symbol("metadata"),on.litPropertyMetadata??=new WeakMap;var Ae=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=rs){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&kr(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:s}=Tr(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);s?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??rs}static _$Ei(){if(this.hasOwnProperty(Pt("elementProperties")))return;let t=_r(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Pt("properties"))){let e=this.properties,n=[...Er(e),...Cr(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(Wn(o))}else t!==void 0&&e.push(Wn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ss(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let s=(n.converter?.toAttribute!==void 0?n.converter:Kn).toAttribute(e,n.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let s=n.getPropertyOptions(o),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Kn;this._$Em=o;let a=r.fromAttribute(e,s.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,s){if(t!==void 0){let r=this.constructor;if(o===!1&&(s=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??as)(s,e)||n.useDefault&&n.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:s},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),s!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,s]of n){let{wrapped:r}=s,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,s,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Ae.elementStyles=[],Ae.shadowRootOptions={mode:"open"},Ae[Pt("elementProperties")]=new Map,Ae[Pt("finalized")]=new Map,Sr?.({ReactiveElement:Ae}),(on.reactiveElementVersions??=[]).push("2.1.2");var Vn=globalThis,ls=i=>i,rn=Vn.trustedTypes,ds=rn?rn.createPolicy("lit-html",{createHTML:i=>i}):void 0,qn="$lit$",De=`lit$${Math.random().toFixed(9).slice(2)}$`,Yn="?"+De,Mr=`<${Yn}>`,Ze=document,Mt=()=>Ze.createComment(""),At=i=>i===null||typeof i!="object"&&typeof i!="function",Xn=Array.isArray,gs=i=>Xn(i)||typeof i?.[Symbol.iterator]=="function",Gn=`[ 	
\f\r]`,St=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,cs=/-->/g,hs=/>/g,Ye=RegExp(`>|${Gn}(?:([^\\s"'>=/]+)(${Gn}*=${Gn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ps=/'/g,us=/"/g,ms=/^(?:script|style|textarea|title)$/i,Zn=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),p=Zn(1),J=Zn(2),Id=Zn(3),Le=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),fs=new WeakMap,Xe=Ze.createTreeWalker(Ze,129);function bs(i,t){if(!Xn(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ds!==void 0?ds.createHTML(t):t}var vs=(i,t)=>{let e=i.length-1,n=[],o,s=t===2?"<svg>":t===3?"<math>":"",r=St;for(let a=0;a<e;a++){let l=i[a],h,u,f=-1,b=0;for(;b<l.length&&(r.lastIndex=b,u=r.exec(l),u!==null);)b=r.lastIndex,r===St?u[1]==="!--"?r=cs:u[1]!==void 0?r=hs:u[2]!==void 0?(ms.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=Ye):u[3]!==void 0&&(r=Ye):r===Ye?u[0]===">"?(r=o??St,f=-1):u[1]===void 0?f=-2:(f=r.lastIndex-u[2].length,h=u[1],r=u[3]===void 0?Ye:u[3]==='"'?us:ps):r===us||r===ps?r=Ye:r===cs||r===hs?r=St:(r=Ye,o=void 0);let c=r===Ye&&i[a+1].startsWith("/>")?" ":"";s+=r===St?l+Mr:f>=0?(n.push(h),l.slice(0,f)+qn+l.slice(f)+De+c):l+De+(f===-2?a:c)}return[bs(i,s+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Dt=class i{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let s=0,r=0,a=t.length-1,l=this.parts,[h,u]=vs(t,e);if(this.el=i.createElement(h,n),Xe.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(o=Xe.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let f of o.getAttributeNames())if(f.endsWith(qn)){let b=u[r++],c=o.getAttribute(f).split(De),y=/([.?@])?(.*)/.exec(b);l.push({type:1,index:s,name:y[2],strings:c,ctor:y[1]==="."?ln:y[1]==="?"?dn:y[1]==="@"?cn:Qe}),o.removeAttribute(f)}else f.startsWith(De)&&(l.push({type:6,index:s}),o.removeAttribute(f));if(ms.test(o.tagName)){let f=o.textContent.split(De),b=f.length-1;if(b>0){o.textContent=rn?rn.emptyScript:"";for(let c=0;c<b;c++)o.append(f[c],Mt()),Xe.nextNode(),l.push({type:2,index:++s});o.append(f[b],Mt())}}}else if(o.nodeType===8)if(o.data===Yn)l.push({type:2,index:s});else{let f=-1;for(;(f=o.data.indexOf(De,f+1))!==-1;)l.push({type:7,index:s}),f+=De.length-1}s++}}static createElement(t,e){let n=Ze.createElement("template");return n.innerHTML=t,n}};function Je(i,t,e=i,n){if(t===Le)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,s=At(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(i),o._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Je(i,o._$AS(i,t.values),o,n)),t}var an=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Ze).importNode(e,!0);Xe.currentNode=o;let s=Xe.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let h;l.type===2?h=new ct(s,s.nextSibling,this,t):l.type===1?h=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(h=new hn(s,this,t)),this._$AV.push(h),l=n[++a]}r!==l?.index&&(s=Xe.nextNode(),r++)}return Xe.currentNode=Ze,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},ct=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Je(this,t,e),At(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==Le&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):gs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&At(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ze.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Dt.createElement(bs(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let s=new an(o,this),r=s.u(this.options);s.p(e),this.T(r),this._$AH=s}}_$AC(t){let e=fs.get(t.strings);return e===void 0&&fs.set(t.strings,e=new Dt(t)),e}k(t){Xn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let s of t)o===e.length?e.push(n=new i(this.O(Mt()),this.O(Mt()),this,this.options)):n=e[o],n._$AI(s),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=ls(t).nextSibling;ls(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Qe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,s){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=x}_$AI(t,e=this,n,o){let s=this.strings,r=!1;if(s===void 0)t=Je(this,t,e,0),r=!At(t)||t!==this._$AH&&t!==Le,r&&(this._$AH=t);else{let a=t,l,h;for(t=s[0],l=0;l<s.length-1;l++)h=Je(this,a[n+l],e,l),h===Le&&(h=this._$AH[l]),r||=!At(h)||h!==this._$AH[l],h===x?t=x:t!==x&&(t+=(h??"")+s[l+1]),this._$AH[l]=h}r&&!o&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ln=class extends Qe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},dn=class extends Qe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},cn=class extends Qe{constructor(t,e,n,o,s){super(t,e,n,o,s),this.type=5}_$AI(t,e=this){if((t=Je(this,t,e,0)??x)===Le)return;let n=this._$AH,o=t===x&&n!==x||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==x&&(n===x||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},hn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Je(this,t)}},ys={M:qn,P:De,A:Yn,C:1,L:vs,R:an,D:gs,V:Je,I:ct,H:Qe,N:dn,U:cn,B:ln,F:hn},Ar=Vn.litHtmlPolyfillSupport;Ar?.(Dt,ct),(Vn.litHtmlVersions??=[]).push("3.3.3");var xs=(i,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let s=e?.renderBefore??null;n._$litPart$=o=new ct(t.insertBefore(Mt(),s),s,void 0,e??{})}return o._$AI(i),o};var Jn=globalThis,ve=class extends Ae{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=xs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Le}};ve._$litElement$=!0,ve.finalized=!0,Jn.litElementHydrateSupport?.({LitElement:ve});var Dr=Jn.litElementPolyfillSupport;Dr?.({LitElement:ve});(Jn.litElementVersions??=[]).push("4.2.2");var ht="mydashlight",Yd=`/api/${ht}/pair`,Xd=`/api/${ht}/pair/poll`,Zd=`/${ht}`,Lt="pair";function ws(i){return i.length>4?`${i.slice(0,4)}-${i.slice(4)}`:i}function Qn(i){return i.toUpperCase().replace(/[^A-Z0-9]/g,"")}function $s(i){let t=new URLSearchParams(i);return t.has(Lt)?Qn(t.get(Lt)??""):null}function Lr(i){if(i<60)return"just now";let t=Math.round(i/60);return`${t} minute${t===1?"":"s"} ago`}var Rt=class extends ve{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${ht}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${ht}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return p`<form @submit=${o=>{o.preventDefault();let s=Qn(this.typed);s&&this.check(s)}}>
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
      <p class="code">${ws(e.code??"")}</p>
      ${o?p`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:x}
      <p>
        A screen at ${e.address} asked ${Lr(e.age??0)}. Check the code matches the one on the screen. It will be
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
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,p`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};Rt.styles=qe`
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
  `,Rt.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Rt);function R(i){let t=Math.round(i),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Re(i){let t=Math.floor(Math.round(i)/60)%24;return`${R(i)} ${t<12?"AM":"PM"}`}function Ts(i){let t=Math.floor(i/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function pt(i){let t=Math.max(0,Math.round(i)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function pn(i){return i?`${pt(Math.abs(i))} ${i<0?"early":"late"}`:"on time"}function ei(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Rr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),zr=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Ir=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"}),jr=new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"UTC"});function zt(i){return new Date(`${i}T12:00:00Z`)}function we(i){let t=zt(i);return`${Rr.format(t)}, ${Ir.format(t)}`}function un(i){return jr.format(zt(i))}function de(i){return zr.format(zt(i))}function ke(i,t){return Math.round((zt(t).getTime()-zt(i).getTime())/864e5)}function It(i,t=new Date){let e=Or(i);if(!e)return It("UTC",t);let n=e.formatToParts(t),o=s=>n.find(r=>r.type===s)?.value??"0";return{date:`${o("year")}-${o("month")}-${o("day")}`,minutes:Number(o("hour"))*60+Number(o("minute"))}}var ks=new Map;function Or(i){let t=ks.get(i);if(t!==void 0)return t;try{t=new Intl.DateTimeFormat("en-CA",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"})}catch{t=null}return ks.set(i,t),t}function ti(i,t,e){let n=Math.floor((t.getTime()-i.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=It(e,i),s=It(e,t).date;return o.date===s?`at ${Re(o.minutes)}`:`on ${de(o.date)} at ${Re(o.minutes)}`}var K=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function _s(i){switch(i.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}function Ps(i){let t=(i??"").trim(),e=o=>{let s=o.exec(t);return s?(t=t.slice(s[0].length).trim(),!0):!1};for(;e(/^Couldn['’]t read Google Calendar:?/i););return{short:e(/^Couldn['’]t reach Google Calendar:?/i)?"Can’t reach Google Calendar":"Couldn’t read Google Calendar",detail:t||null}}var et="mydashlight",Br=7,ni=3e4,Es=3e4;function ii(i){if(i instanceof K)return i;if(i&&typeof i=="object"){let t=i;if(typeof t.message=="string")return new K(String(t.code??"error"),t.message)}return typeof i=="number"?new K("connection_lost","Lost the connection to Home Assistant."):new K("error",String(i))}function Cs(i,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new K("timeout","Home Assistant didn’t answer.")),t);i.then(s=>{clearTimeout(o),e(s)},s=>{clearTimeout(o),n(s)})})}var jt=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},fn=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new K("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new jt(this.conn,`${et}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new K("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},ni),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await Cs(this.conn.sendMessagePromise({type:"call_service",domain:et,service:"get_plan",service_data:{days:Br},return_response:!0}),Es);this.emit(t.response)}catch(t){this.fail(ii(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:et,service:t,service_data:e})}catch(n){throw ii(n)}this.live||await this.refresh()}setRide(t,e,n,o,s){return this.call("set_ride",s===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:s})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:ei(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:ei(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n,o,s){return this.call("set_people",{event:t,...e?{people:e}:{},...s!==void 0?{overnight:s}:{},scope:n,...o?{driver:o.driver,riders:o.riders,back_riders:o.backRiders}:{}})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let a=await Cs(this.conn.sendMessagePromise({type:"call_service",domain:et,service:"get_chores",service_data:{},return_response:!0}),Es);if(e)return;n=!0,t(a.response??null)}catch{!e&&!n&&t(null)}},s=new jt(this.conn,`${et}/chores/subscribe`,a=>{e||(n=!0,t(a.chores))},()=>void o());s.open();let r=setInterval(()=>{s.live||s.open()},ni);return()=>{e=!0,clearInterval(r),s.close()}}watchLunch(t){let e=!1,n=!1,o=new jt(this.conn,`${et}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let s=setInterval(()=>{o.live||o.open()},ni);return()=>{e=!0,clearInterval(s),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n,o){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{},...e&&o?{skip:o}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:et,service:t,service_data:e})}catch(n){throw ii(n)}}};var Ss={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ms=i=>(...t)=>({_$litDirective$:i,values:t}),gn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Nr}=ys,As=i=>i;var Ds=()=>document.createComment(""),ut=(i,t,e)=>{let n=i._$AA.parentNode,o=t===void 0?i._$AB:t._$AA;if(e===void 0){let s=n.insertBefore(Ds(),o),r=n.insertBefore(Ds(),o);e=new Nr(s,r,i,i.options)}else{let s=e._$AB.nextSibling,r=e._$AM,a=r!==i;if(a){let l;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(l=i._$AU)!==r._$AU&&e._$AP(l)}if(s!==o||a){let l=e._$AA;for(;l!==s;){let h=As(l).nextSibling;As(n).insertBefore(l,o),l=h}}}return e},He=(i,t,e=i)=>(i._$AI(t,e),i),Hr={},Ls=(i,t=Hr)=>i._$AH=t,Rs=i=>i._$AH,mn=i=>{i._$AR(),i._$AA.remove()};var zs=(i,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(i[o],o);return n},Te=Ms(class extends gn{constructor(i){if(super(i),i.type!==Ss.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],s=[],r=0;for(let a of i)o[r]=n?n(a,r):r,s[r]=e(a,r),r++;return{values:s,keys:o}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,n]){let o=Rs(i),{values:s,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,s;let a=this.ut??=[],l=[],h,u,f=0,b=o.length-1,c=0,y=s.length-1;for(;f<=b&&c<=y;)if(o[f]===null)f++;else if(o[b]===null)b--;else if(a[f]===r[c])l[c]=He(o[f],s[c]),f++,c++;else if(a[b]===r[y])l[y]=He(o[b],s[y]),b--,y--;else if(a[f]===r[y])l[y]=He(o[f],s[y]),ut(i,l[y+1],o[f]),f++,y--;else if(a[b]===r[c])l[c]=He(o[b],s[c]),ut(i,o[f],o[b]),b--,c++;else if(h===void 0&&(h=zs(r,c,y),u=zs(a,f,b)),h.has(a[f]))if(h.has(a[b])){let m=u.get(r[c]),$=m!==void 0?o[m]:null;if($===null){let k=ut(i,o[f]);He(k,s[c]),l[c]=k}else l[c]=He($,s[c]),ut(i,o[f],$),o[m]=null;c++}else mn(o[b]),b--;else mn(o[f]),f++;for(;c<=y;){let m=ut(i,l[y+1]);He(m,s[c]),l[c++]=m}for(;f<=b;){let m=o[f++];m!==null&&mn(m)}return this.ut=r,Ls(i,l),Le}});var bn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function q(i){return bn[(i%bn.length+bn.length)%bn.length]}var vn="#23272E",si="35,39,46";var oi=3,Ht=36,ri=12,yn=8,Is=30,Ee=16,Ot=100,gt=60,Fr=120,js=44,Os=20,Ur=45,Wr=30,Bs=20,di=10,wn=30,ci=10,Kr=150,Gr=150,kn=1;function Vs(i,t){return i.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Ht}function Vr(i,t,e){return 10+10.2*i.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var qr=26,qs=4;function pi(i,t){let e=Math.max(Kr,Gr/kn);return Math.ceil(gt+Math.max(0,i-1)*di+wn+Math.max(0,t-1)*ci+e*(i+kn*t))}function ce(i){return i.people?i.people.kids.map(t=>t.id):i.days.length?Object.keys(i.days[0].kids):[]}function G(i){return i.people?i.people.drivers.map(t=>t.id):i.days.length?Object.keys(i.days[0].drivers):[]}function Ys(i,t){let e=i.who?.[t.event_id]?.people??[],n=t.own??t.kid;if(!e.includes(n))return null;let o=e.filter(r=>r!==n),s=ce(i);return o.length&&(t.own!=null||o.some(r=>s.includes(r)))?o:null}function re(i){return new Map(ce(i).map((t,e)=>[t,q(e)]))}function oe(i,t){let e=i.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.kids[t])return n.kids[t].name;return t}function Q(i,t){let e=i.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.drivers[t])return n.drivers[t].name;return t}function ui(i,t){return t==="none"?"Not needed":G(i).includes(t)?Q(i,t):t}function Yr(i){return i.leave_by!=null&&i.leave_by>i.start&&i.leave_by!==i.end?` · leave ${R(i.leave_by)}`:""}function Tn(i){if(i.busy_why==="days"){if(i.start<=0&&i.end>=1440)return"All day";if(i.start<=0)return`Until ${R(i.end)}`;if(i.end>=1440)return`From ${R(i.start)}`}return`${R(i.start)}–${R(i.end)}`}function Ft(i,t){return t.own?Q(i,t.own):oe(i,t.kid)}var ze={color:vn,rgb:si,ink:vn};function Xs(i,t){return t.own?ze:re(i).get(t.kid)??q(0)}function Xr(i,t){let e=ce(i);return t.along.map(n=>e.includes(n)?oe(i,n):Q(i,n))}function mt(i){return i.length<2?i.join(""):`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}function Zr(i,t){let e=ce(i),n=G(i).filter(a=>t.includes(a)),o=e.filter(a=>t.includes(a)),s=e.length>1&&o.length===e.length;if(s&&n.length===G(i).length)return"Everyone";let r=[...n.map(a=>Q(i,a)),...s?["the kids"]:o.map(a=>oe(i,a))];return r.length<2?r.join(""):`${r.slice(0,-1).join(", ")} & ${r[r.length-1]}`}function Jr(i){let t=new Map([["home","Home"]]);for(let e of i.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function $n(i,t){return t?i.get(t)??(t.split(",")[0]?.trim()||t):""}function ai(i,t){let e=[];for(let n of i)n.type==="drive"?(e.length||e.push($n(t,n.from)),e.push($n(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push($n(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Qr(i){let t=i.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,s=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(s(),o=-1/0);let a=n.findIndex(l=>l<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return s(),t}function ea(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].y;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return i[i.length-1].y}function ta(i,t){if(!i.length)return 0;if(t<=i[0].y)return i[0].t;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return i[i.length-1].t}function Zs(i,t){return ea(i.anchors,t)}function fi(i,t){return ta(i.anchors,t)}function na(i,t){let e=ce(i),n=G(i),o=Math.max(t,pi(e.length,n.length)),r=(o-gt-Math.max(0,e.length-1)*di-wn-Math.max(0,n.length-1)*ci)/(e.length+kn*n.length||1),a=Math.floor(r),l=Math.floor(r*kn),h=i.whole_week??i.days,u=new Map;for(let m of h)for(let $ of m.events)for(let k of $.own?$.along:[$.kid]){let g=u.get(k)??[];g.some(E=>E.event_id===$.event_id&&E.calendar_id===$.calendar_id)||g.push($),u.set(k,g)}let f=re(i),b=[],c=gt;e.forEach((m,$)=>{let k=u.get(m)??[],g=i.days.some(E=>E.events.some(D=>D.kid===m&&(D.sides.includes("drop")&&D.drop===""||D.sides.includes("pick")&&D.pick==="")));b.push({id:m,kind:"kid",x:c,w:a,name:oe(i,m),dot:f.get(m).color,rgb:f.get(m).rgb,sub:g?"Needs a ride":`${k.length} this week`,subWarn:g}),c+=a+($<e.length-1?di:0)});let y=c+wn/2;return c+=wn,n.forEach((m,$)=>{let k=0,g=0;for(let E of h){let D=E.drivers[m];D&&(k+=D.outings.length,g+=D.drive??0)}b.push({id:m,kind:"driver",x:c,w:l,name:Q(i,m),dot:vn,rgb:si,sub:`${k} ${k===1?"trip":"trips"} this week · ${pt(g)} driving`,subWarn:!1}),c+=l+($<n.length-1?ci:0)}),{columns:b,sepX:y,width:o}}function ia(i,t){let e=i.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),s=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!s)return e;let r=o.slice(s[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Ns(i,t){let e=i.start<=0,n=i.end>=1440;return e&&n?`${i.title} · all day`:n?`${i.title} from ${R(i.start)}`:e||!t?`${i.title} until ${R(i.end)}`:`${i.title} ${R(i.start)}–${R(i.end)}`}function gi(i){return i.issues.filter(t=>t.level==="problem").length+i.clashes.length+(i.unplaced?.length??0)}function mi(i,t){let e=ke(t,i);return e===0?"Today":e===1?"Tomorrow":""}function ne(i,t=0){return i==null||!Number.isFinite(i)?t:i}var hi=null;function Js(i){hi=i}var xn='Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',ft={title:`800 14.5px ${xn}`,time:`400 12px ${xn}`,line:`600 12px ${xn}`,stop:`400 12px ${xn}`};function sa(i,t,e){let n=Math.max(8,Math.floor(t/e)),o=1,s=0;for(let r of i.split(/[ \t\n]+/).filter(Boolean)){let a=r.length;for(s===0?s=a:s+1+a<=n?s+=1+a:(o++,s=a);s>n;)o++,s-=n}return o}function oa(i,t,e,n){let o=i.split(/[ \t\n]+/).filter(Boolean),s=1,r="";for(let a of o){let l=r?`${r} ${a}`:a,h=n(l,e);if(h==null)return null;if(h<=t){r=l;continue}r&&s++;let u=n(a,e);if(u==null)return null;u>t&&(s+=Math.ceil(u/t)-1),r=a}return s}function Bt(i,t,e=7,n){if(n&&hi){let o=oa(i,t-.5,n,hi);if(o!=null)return o}return sa(i,t,e)}var Qs=25,ra=15,eo=3;function Hs(i){return Math.max(0,Math.min(eo,Math.floor((i-Qs)/ra)))}var aa=Qs+2,Fs=20;function Us(i,t="Home"){let e=/^(\d+:\d\d)\s+(.+)$/.exec(i.at(-1)??"");return e&&e[2]===t?e[1]:null}function li(i,t,e,n){let o=t.drivers[e],s=o?.home;if(!s)return i;let r=n==null?void 0:o.outings.find(a=>(a.start??1/0)<=n&&n<(a.end??-1/0));return new Map(i).set(s.place,s.name).set("home",r?.home??s.name)}var Nt="🚗";function Ws(i,t){if(i===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,s,r,a=!1)=>({at:o,who:s,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(i))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(i))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(i))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}return null}var Ks={muted:0,normal:1,pending:2,problem:3};function la(i){let{drop:t,pick:e}=i,n=t?Ws(t.text,"drop"):null,o=e?Ws(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return i;let s=[t,e].reduce((l,h)=>h&&(Ks[h.tone]??1)>(Ks[l]??1)?h.tone:l,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Nt} No rides yet`,tone:s},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let l=`${Nt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${l} both ways`,tone:s},pick:null}:!n.at||!o.at?{drop:{text:`${l} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:s},pick:null}:{drop:{text:`${l} ↓${n.at} ↑${o.at}`.trimEnd(),tone:s},pick:null}}let r=(l,h)=>l==="needed"?`${h} needed`:`${h}${l.at?`${l.at} `:" "}${l.who}${l.stays?" stays":""}${l.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Nt} ${a.join(" · ")}`,tone:s},pick:null}}function da(i,t){return!t&&!!i.drop&&!i.pick&&i.drop.tone==="muted"}var ca=5,ha=13;function pa(i,t,e={}){let n=e.clash?4:2,o=t-n-13-9,s=n+2*ca;s+=Bt(i.title,o-(e.noted?ha:0),9,ft.title)*18;let r=i.inline&&i.drop?`${i.time} · ${i.drop.text}`:i.time;return s+=1+Bt(r,o,6.6,i.inline?ft.line:ft.time)*16,i.drop&&!i.inline&&(s+=1+Bt(i.drop.text,o,7,ft.line)*16),i.pick&&(s+=2+Bt(i.pick.text,o,7,ft.line)*16),Math.ceil(s)+1}function Gs(i,t="Home"){let e=/^(\S+\s+)(.+?), get (.+)$/u.exec(i);return e&&e[2]===t?`${e[1]}${t} ↑ ${e[3]}`:i.replace(/, drop off (.+)$/u," ↓ $1").replace(/, pick up (.+)$/u," ↑ $1")}function ua(i,t){let e=i.reduce((n,o)=>n+Bt(o,t-20,7,ft.stop),0);return 28+i.length+e*16+1}function to(i,t,e,n){let o=t==="compact",{columns:s,sepX:r,width:a}=na(i,e),l=new Map(s.map(g=>[g.id,g])),h=ce(i),u=G(i),f=[...h,...u],b=re(i),c=Jr(i),y=g=>oe(i,g),m=g=>Q(i,g),$={mode:t,width:a,height:0,columns:s,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],folds:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},k=0;return i.days.forEach((g,E)=>{let D=E*1440,O=new Map(g.events.map(d=>[d.id,d])),Y=d=>d&&O.has(d)?{day:g.date,event:d}:null,fe=gi(g),U=g.events.length,ae=mi(g.date,n.date),ye=we(g.date),Fe=(U?`${U} ${U===1?"activity":"activities"}${g.done?" left":""}`:g.done?"All done for today":"Nothing scheduled")+(fe?` · ${fe} to sort out`:""),$e=wa(i,g,b,a,a-Vr(ye,ae,Fe));$.dayHeads.push({date:g.date,y:k,label:ye,tag:ae,sub:Fe,warn:fe>0,h:Ht+($e&&$e.h?$e.h+qs+2:0),allDay:$e?.chips??[],inline:$e?.inline??0}),$.anchors.push({t:D,y:k});let Ue=$.dayHeads[$.dayHeads.length-1],ge=k+Ue.h+ri,Oe=u.flatMap(d=>g.drivers[d]?.outings??[]);if(!U&&!Oe.length){$.empties.push({key:g.date,y:ge,text:g.done?"Nothing else today":"Nothing planned"}),k=ge+40,$.anchors.push({t:D+1439,y:k});return}let Be=(d,w,T=d.kid)=>{let v=!!d.own&&T===d.own,S=!!d.own&&T!==d.own,P=v?m(T):y(T),_=S?{drop:{text:`${w?`${Nt} `:""}With ${m(d.own)}`,tone:d.attending===!1?"muted":"normal"},pick:null}:w&&!d.own?la(d.lines):d.lines,B=v?Xr(i,d):[],L=(d.takes!=null?`${d.takes} min, any time ${R(d.start)}–${R(d.end)}`:Tn(d)+(d.arrive_by!=null?` · arrive ${R(d.arrive_by)}`:"")+Yr(d))+(B.length?` · with ${mt(B)}`:"");return{who:P,mine:v,title:ia(d.title,P),time:L,drop:_.drop,pick:_.pick,inline:w&&da(_,d.attending===!1)}},Ne=(d,w,T,v)=>pa(Be(d,!0,T),w,{noted:!!d.notes,clash:v}),Pe=(d,w,T,v,S,P,_,B=d.kid)=>{let L=Be(d,_,B),se=L.mine?ze:b.get(B)??q(0),H=L.who,C={drop:L.drop,pick:L.pick};return{key:`${g.date}|card|${d.id}`+(d.own?`|${B}`:""),x:w,y:T,w:v,h:S,target:{day:g.date,event:d.id},event:d,color:se,kidName:H,clash:P,stayed:!d.own&&d.stay&&u.includes(d.drop),skipped:d.attending===!1,title:L.title,time:L.time,drop:C.drop,pick:C.pick,showDrop:!!C.drop&&(_||S>=56),showPick:!!C.pick&&(_||S>=74),wrap:_,inline:L.inline,aria:`${H}, ${d.title} ${d.takes!=null?`any time from ${R(d.start)} to ${R(d.end)}`:Tn(d).replace("–"," to ")}. `+(d.attending===!1&&!C.drop?"Not attending. ":"")+[C.drop,C.pick].filter(N=>!!N).map(N=>N.text).join(". ")}},lt=d=>{let w=g.rides[d];return w?(g.drivers[w.driver]?.segments??[]).filter(v=>v.type!=="home"&&v.kids.includes(w.kid)&&ne(v.start)>=ne(w.start)&&ne(v.end)<=ne(w.end)):[]},We=d=>{let w=g.rides[d];if(!w)return null;let T=w.serves.find(v=>O.get(v)?.kid===w.kid);return Y(T??w.serves[0])},Se=(d,w)=>{if(w.event)return w;let T=g.events.find(v=>v.own&&v.own!==d&&v.along.includes(d)&&v.title===w.title);return T?{...w,title:`${w.title} with ${m(T.own)}`}:w},Me=d=>{if(d.takes==null)return[d.start,d.end];let w=d.planned??d.start;return[w,w+d.takes]},ie=new Map;for(let d of g.issues)d.level!=="problem"||!d.event||(d.kind==="late"&&ie.set(d.event,`${Math.round(ne(d.minutes))} min late`),d.kind==="waiting"&&ie.set(`${d.event}|pick`,`Waits ${Math.round(ne(d.minutes))} min`));if(!o){let d=1/0,w=-1/0;for(let C of g.events)C.start<=0&&C.end>=1440||(C.start>0?d=Math.min(d,C.start-20,C.arrive_by!=null?C.arrive_by-10:1/0):d=Math.min(d,C.end-30),C.end<1440?w=Math.max(w,C.end+20):w=Math.max(w,C.start+30));for(let C of Oe)C.start!=null&&(d=Math.min(d,C.start)),C.end!=null&&(w=Math.max(w,C.end));let T=g.from;T!=null&&Number.isFinite(d)&&d<T+60?d=T-15:g.date===n.date&&Number.isFinite(d)&&n.minutes>d-60&&n.minutes<w&&(d=Math.min(d,n.minutes-15));let v=Number.isFinite(d)?Math.floor((d-5)/30)*30:900,S=Math.max(Number.isFinite(w)?Math.ceil((w+5)/30)*30:960,v+60),P=C=>T!=null&&ne(C)<=v,_=C=>T!=null&&ne(C)<v,B=ga(fa(g,u,Me,g.date===n.date?n.minutes:null),v,S),L=C=>Math.round(ge+ma(Math.max(v,Math.min(S,C))-v,B,v));$.anchors.push({t:D+v,y:L(v)});for(let C of B)$.anchors.push({t:D+C.from,y:L(C.from)},{t:D+C.to,y:L(C.to)}),$.folds.push({key:`${g.date}|fold|${C.from}`,y:L(C.from),h:L(C.to)-L(C.from),from:C.from,to:C.to,label:ba(C.to-C.from)});$.anchors.push({t:D+S,y:L(S)});let se=(C,N)=>B.some(I=>N?C>=I.from&&C<=I.to:C>I.from&&C<I.to);for(let C of h){let N=l.get(C),I=b.get(C),xe=(g.kids[C]?.items??[]).filter(M=>M.start!=null&&M.end!=null&&!P(M.end)).map(M=>({item:M,s:ne(M.start),en:ne(M.end)})),le=[];for(let M of Qr(xe)){let z=N.w/M.cols,j=Math.round(N.x+M.col*z),F=Math.round(z-(M.cols>1?4:0)),X=L(M.s),W=M.item;if(W.type==="act"){let me=O.get(W.event??"");if(!me)continue;let tn=Math.max(30,L(M.en)-X),dt=Pe(me,j,X,F,tn,W.clash,!1,C);if(dt.layer=Ot,dt.cut=_(M.s),$.cards.push(dt),me.arrive_by!=null&&me.start-me.arrive_by>=5&&!dt.cut){let Hn=L(me.arrive_by),ts={key:`${g.date}|prep|${me.id}`,x:j,y:Hn,w:F,h:X-Hn+Ee,color:I,label:`Arrive by ${R(me.arrive_by)}`,layer:Ot-1};$.preps.push(ts),le.push({s:me.arrive_by,en:M.en,top:Hn,bottom:X+tn,x:j,w:F,prep:ts,card:dt})}else le.push({s:M.s,en:M.en,top:X,bottom:X+tn,x:j,w:F,card:dt});let Qi=ie.get(me.id);Qi&&$.marks.push({key:`${g.date}|late|${me.id}`,x:j+F-4,y:X+4,text:Qi,right:!0});let es=ie.get(`${me.id}|pick`);es&&$.marks.push({key:`${g.date}|wait|${me.id}`,x:j+4,y:X+tn+2,text:es,right:!1});continue}let V=g.rides[W.ride??-1];if(!V)continue;let Z=Math.max(22,L(M.en)-X),Ve=ai(lt(V.index),li(c,g,V.driver,V.start??void 0)),Ct=m(V.driver),Zi={key:`${g.date}|ride|${V.index}`,x:j,y:X,w:F,h:Z,target:We(V.index),l1:`${V.own?"In":"Along in"} ${Ct}’s car`,l2:Ve.join(" → "),show2:Hs(Z)>0,lines2:Hs(Z),dashed:!V.own,clash:W.clash,aria:`${y(C)} ${V.own?"in":"riding along in"} ${Ct}’s car, ${R(ne(V.start))} to ${R(ne(V.end))}: ${Ve.join(" to ")}`};$.rides.push(Zi);let Ji=l.get(V.driver),Nn=null;Ji&&(Nn={key:`${g.date}|band|${V.index}`,x:j+F,y:X,w:Math.max(0,Ji.x+8-(j+F)),h:Z,color:I},$.bands.push(Nn)),le.push({s:M.s,en:M.en,top:X,bottom:X+Z,x:j,w:F,ride:Zi,band:Nn})}let en=M=>M.ride?.layer??(M.prep?Ot-1:Ot),Et=(M,z,j,F)=>{j>Ee&&$.links.push({key:`${M.key}|link`,x:M.x,y:z,w:M.w,h:j,color:I,layer:F})},A=(M,z)=>{if(!(z.x<M.x||z.x+z.w>M.x+M.w)&&(M.x=z.x,M.w=z.w,M.ride.x=z.x,M.ride.w=z.w,M.band)){let j=M.band.x+M.band.w;M.band.x=z.x+z.w,M.band.w=Math.max(0,j-M.band.x)}},te=new Set;for(let M of[...le].sort((z,j)=>j.s-z.s)){let z=M.ride;if(!z)continue;let j=le.filter(W=>W!==M&&W.s>=M.en&&W.s-M.en<=Is&&W.top>=M.bottom).sort((W,V)=>W.s-V.s||W.top-V.top)[0];if(!j)continue;te.add(M),A(M,j);let F=en(j),X=j.top-M.bottom;Et(z,M.bottom,X+Ee,F-1),z.layer=F-(X>0?2:1),z.h+=Ee,z.tuckBottom=Ee}for(let M of[...le].sort((z,j)=>z.s-j.s)){let z=M.ride;if(!z||te.has(M))continue;let j=le.filter(W=>W!==M&&W.en<=M.s&&M.s-W.en<=Is&&W.bottom<=M.top&&(W.card||W.ride?.layer!=null)).sort((W,V)=>V.en-W.en||V.bottom-W.bottom)[0];if(!j)continue;A(M,j);let F=j.ride?.layer??Ot,X=M.top-j.bottom;Et(z,j.bottom-Ee,X+Ee,F-1),z.layer=F-(X>0?2:1),z.y-=Ee,z.h+=Ee,z.tuckTop=Ee}}for(let C of u){let N=l.get(C),I=g.drivers[C];if(!I)continue;let xe=[],le=null;for(let A of I.segments)if(!(A.start==null||A.end==null)){if(A.type==="home"){le=null;continue}if(A.type==="stay"){le=null,xe.push({type:"stay",g:A,s:A.start,en:A.end});continue}le&&le.en===A.start?(le.en=A.end,le.legs.push(A)):(le={type:"trip",s:A.start,en:A.end,legs:[A]},xe.push(le))}let en=new Set,Et=(A,te,M,z)=>{en.add(A.id);let j=L(te),F=Pe(A,N.x+8,j,N.w-16,Math.max(30,L(M)-j),!1,!1,C);F.cut=_(te),z&&F.drop?.tone==="normal"&&(F.drop=null,F.showDrop=!1),$.cards.push(F)};for(let A of xe){if(P(A.en))continue;let te=L(A.s),M=Math.max(24,L(A.en)-te);if(A.type==="stay"){let Z=O.get(A.g.event??A.g.serves??"");if(Z?.own===C){Et(Z,A.s,A.en,!0);continue}let Ve=Z?b.get(Z.kid)??q(0):q(0),Ct=A.g.kids.map(y);$.stays.push({cut:_(A.s),key:`${g.date}|stay|${C}|${A.s}`,x:N.x+8,y:te,w:N.w-16,h:M,target:Y(Z?.id),color:Ve,l1:Z?`At ${Z.title} with ${y(Z.kid)}`:"Staying",l2:`until ${R(A.en)}`+(Ct.length?` · ${Ct.join(" and ")} too`:"")});continue}let z=A.legs[0],j=A.legs[A.legs.length-1],F=[];for(let Z of A.legs)for(let Ve of Z.kids)F.includes(Ve)||F.push(Ve);let X=j.type==="drive"&&j.to==="home",W=li(c,g,C,A.s),V=ai(A.legs,W);$.trips.push({key:`${g.date}|trip|${C}|${A.s}`,x:N.x+8,y:te,w:N.w-16,h:M,target:Y(A.legs.find(Z=>Z.serves)?.serves),l1:z.type==="drive"&&z.from==="home"?`Leave ${R(A.s)}`:`From ${$n(c,z.from??z.place)} ${R(A.s)}`,l2:V.join(" → "),show2:M>=36,l3:X?`${W.get("home")??"Home"} ${R(A.en)}`:"",show3:X&&M>=62,stops:null,kids:F.map(Z=>(b.get(Z)??q(0)).color),bad:A.legs.some(Z=>Z.overlaps_busy),aria:`${m(C)} drives ${V.join(" to ")}, ${R(A.s)} to ${R(A.en)}`})}for(let A of I.segments)if(!(!A.overlaps_busy||A.start==null||A.end==null))for(let te of I.busy){let M=Math.max(A.start,te.start),z=Math.min(A.end,te.end);z<=M||P(z)||$.overlaps.push({key:`${g.date}|overlap|${C}|${M}`,x:N.x+6,y:L(M)-2,w:N.w-12,h:Math.max(8,L(z)-L(M)+4)})}for(let A of g.events)if(A.own===C&&(!en.has(A.id)&&!P(Me(A)[1])&&Et(A,...Me(A),!1),A.takes!=null&&A.attending!==!1&&!P(A.end))){let te=L(A.start);$.windows.push({key:`${g.date}|window|${A.id}`,x:N.x+4,y:te,w:N.w-8,h:Math.max(24,L(A.end)-te),label:`${A.title} · any time ${R(A.start)}–${R(A.end)}`})}for(let A of I.busy){if(A.event||A.end<=v||A.start>=S)continue;let te=Se(C,A),M=L(te.start),z=L(te.end);$.busy.push({key:`${g.date}|busy|${C}|${te.start}`,x:N.x+1,y:M,w:N.w-2,h:z-M,labelY:8,label:Ns(te,!1)})}}let H=-1/0;for(let C=v;C<=S;C+=30)se(C,!0)||$.grid.push({key:`${g.date}|grid|${C}`,y:L(C),strong:C%60===0}),(B.some(I=>I.from===C||I.to===C)||C%60===0&&!se(C,!1))&&L(C)-H>=22&&($.hours.push({key:`${g.date}|hour|${C}`,y:L(C)-8,label:C%60===0?Ts(C):Re(C)}),H=L(C));g.date===n.date&&n.minutes>v&&n.minutes<S&&($.now={y:L(n.minutes),label:`Now ${R(n.minutes)}`}),k=L(S)+ri;return}let ee=[];for(let d of h){let w=l.get(d);for(let T of g.kids[d]?.items??[])if(T.start!=null){if(T.type==="act"){let v=O.get(T.event??"");if(!v)continue;ee.push({col:d,s:T.start,h:Ne(v,w.w,d,T.clash),kind:"act",item:T})}else if(!g.rides[T.ride??-1]?.own){let v=g.rides[T.ride??-1],S=v?g.drivers[v.driver]?.outings.find(P=>P.start!=null&&P.start<=ne(v.start)&&ne(v.start)<=ne(P.end,P.start)):void 0;ee.push({col:d,s:S?.start??T.start,h:aa,kind:"along",item:T})}}}for(let d of u){let w=g.drivers[d];if(!w)continue;for(let v of w.busy)v.event||ee.push({col:d,s:v.start,h:32,kind:"busy",busy:Se(d,v)});let T=l.get(d).w;for(let v of g.events)v.own!==d||!v.busy_only&&v.attending!==!1&&(v.takes==null||v.planned!=null)||ee.push({col:d,s:Me(v)[0],h:Ne(v,T-16,d,!1),kind:"own",event:v});for(let v of w.outings){if(v.start==null)continue;let S=(Us(v.lines,v.home)?v.lines.slice(0,-1):v.lines).map(P=>Gs(P,v.home));ee.push({col:d,s:v.start,h:ua([...S,...v.warn?[v.warn]:[]],T-16),kind:"out",out:v})}}ee.sort((d,w)=>d.s-w.s||f.indexOf(d.col)-f.indexOf(w.col));let be=new Map,he=[],Ke=new Map,Ge=ge-Fs;for(let d=0;d<ee.length;){let w=d,T=Ge+Fs;for(;w<ee.length&&ee[w].s===ee[d].s;w++){let S=be.get(ee[w].col);S!=null&&(T=Math.max(T,S+yn))}let v=new Set;for(let S=d;S<w;S++){let P=ee[S],_=v.has(P.col)?be.get(P.col)+yn:T;v.add(P.col),be.set(P.col,_+P.h)}Ke.set(ee[d].s,T),ee[d].s>0&&$.hours.push({key:`${g.date}|hour|${ee[d].s}`,y:T+2,label:Re(ee[d].s)}),Ge=T,d=w}be.clear(),ee.forEach((d,w)=>{let T=be.get(d.col),v=Math.max(T!=null?T+yn:ge,Ke.get(d.s));be.set(d.col,v+d.h);let S=d.kind==="busy"?d.busy.end:d.kind==="act"?O.get(d.item.event??"")?.end??null:d.kind==="own"?Me(d.event)[1]:null;he.push({col:d.col,s:d.s,end:S,y:v,h:d.h,box:null}),$.anchors.push({t:D+d.s,y:v});let P=l.get(d.col);if(d.kind==="busy"){let _={key:`${g.date}|busy|${d.col}|${w}`,x:P.x+1,y:v,w:P.w-2,h:d.h,labelY:8,label:Ns(d.busy,!0)};$.busy.push(_),he[he.length-1].box=_}else if(d.kind==="out"){let _=d.out,B=Us(_.lines,_.home),L=B?_.lines.slice(0,-1):_.lines;$.trips.push({key:`${g.date}|trip|${d.col}|${w}`,x:P.x+8,y:v,w:P.w-16,h:d.h,target:Y(_.target),l1:B?`${_.lead} · ${_.home&&_.home!=="Home"?_.home:"home"} ${B}`:_.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...L.map(se=>({text:Gs(se,_.home),warn:!1})),..._.warn?[{text:_.warn,warn:!0}]:[]],kids:_.kids.map(se=>(b.get(se)??q(0)).color),bad:!!_.warn,aria:`${m(d.col)}: ${_.lead}. ${_.lines.join(". ")}${_.warn?`. ${_.warn}`:""}`})}else if(d.kind==="own"){let _=Pe(d.event,P.x+8,v,P.w-16,d.h,!1,!0,d.col);$.cards.push(_),he[he.length-1].box=_}else if(d.kind==="act"){let _=O.get(d.item.event??""),B=Pe(_,P.x,v,P.w,d.h,d.item.clash,!0,d.col);$.cards.push(B),he[he.length-1].box=B}else{let _=g.rides[d.item.ride??-1],B=ai(lt(_.index),li(c,g,_.driver,_.start??void 0)),L=m(_.driver);$.rides.push({key:`${g.date}|ride|${_.index}`,x:P.x,y:v,w:P.w,h:d.h,target:We(_.index),l1:`${Nt} with ${L}`,l2:B.join(" → "),show2:!1,lines2:eo,dashed:!0,clash:d.item.clash,aria:`${y(d.col)} riding along with ${L}, ${R(ne(_.start))} to ${R(ne(_.end))}: ${B.join(" to ")}`})}});let pe=ge;for(let d of be.values())pe=Math.max(pe,d);for(let d of he){if(!d.box||d.end==null)continue;let w=d.y+d.h;for(let T of he)T.col!==d.col&&T.s>=d.s&&T.s<d.end&&(w=Math.max(w,T.y+T.h));d.end>=1440&&(w=pe);for(let T of he)T.col===d.col&&T.y>d.y&&(w=Math.min(w,T.y-yn));w=Math.min(w,pe),w>d.y+d.h&&(d.box.h=w-d.y)}k=pe+ri+6,$.anchors.push({t:D+1439,y:k})}),$.height=k,$}function fa(i,t,e,n){let o=[],s=(r,a)=>{r==null||a==null||o.push([r-Os,Math.min(a,r+Ur)+Bs],[Math.max(r,a-Wr)-Os,a+Bs])};for(let r of i.events)r.own?(s(...e(r)),r.takes!=null&&s(r.start,r.end)):s(r.arrive_by??r.start,r.end);for(let r of Object.values(i.kids))for(let a of r.items??[])s(a.start,a.end);for(let r of t){let a=i.drivers[r];if(a){for(let l of a.segments)l.type!=="home"&&s(l.start,l.end);for(let l of a.outings)s(l.start,l.end);for(let l of a.busy)s(l.start,l.end)}}return n!=null&&o.push([n-30,n+30]),o}function ga(i,t,e){let n=i.map(([l,h])=>[Math.max(t,l),Math.min(e,h)]).filter(([l,h])=>h>l).sort((l,h)=>l[0]-h[0]),o=[],s=t,r=(l,h)=>{let u=Math.ceil(l/30)*30,f=Math.floor(h/30)*30;f-u>=Fr&&o.push({from:u,to:f})},a=!1;for(let[l,h]of n)a&&l>s&&r(s,l),s=a?Math.max(s,h):h,a=!0;return o}function ma(i,t,e){let n=i*oi,o=e+i;for(let s of t){let r=s.to-s.from;o>=s.to?n-=r*oi-js:o>s.from&&(n-=(o-s.from)*oi-(o-s.from)/r*js)}return n}function ba(i){let t=Math.floor(i/60),e=i%60>=30;return`${t}${e?"½":""} hrs`}var va=["","¼","½","¾"];function tt(i){return i.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return pt(n);let o=Math.round(n*4),s=Math.floor(o/4),r=va[o%4];return`${s||!r?s:""}${r} min`})}function no(i){let t=e=>e?{...e,text:tt(e.text)}:null;return{...i,days:i.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(s=>({...s,lines:s.lines.map(tt),warn:s.warn==null?s.warn:tt(s.warn)}))}])),issues:e.issues.map(n=>({...n,title:tt(n.title),body:tt(n.body),note:n.note==null?n.note:tt(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:tt(o.note)}))}:{}}))}))}}var ya=2,xa=48;function io(i,t,e=xa){let n=[],o=new Set(G(i)),s=ce(i).map(b=>oe(i,b)),r=s.length>1?s.slice(0,2):[s[0]??"Ava","Ben"],a=0,l=0,h=0,u=0,f=t.minutes+e*60;for(let b of i.days){let c=ke(t.date,b.date),y=c===0?"":`${de(b.date)} · `,m=new Map(b.events.map(g=>[g.id,g])),$=g=>g&&m.has(g)?{day:b.date,event:g}:null,k=(g,E)=>c*1440+(g??m.get(E??"")?.start??0)<f;for(let g of b.issues)if(g.level==="problem"){if(!k(g.at,g.event)){h++,g.kind==="unassigned"&&u++;continue}a++,g.kind==="unassigned"&&l++,n.push({key:`${b.date}|${g.key}`,tone:g.kind==="unassigned"?"unassigned":"problem",title:y+g.title,body:g.body,target:$(g.event),suggestions:(g.suggestions??[]).map(E=>({id:E.id,label:E.label,note:E.note}))})}if(b.clashes.forEach((g,E)=>{if(!k(g.a.start,g.a.event)){h++;return}a++;let D=m.get(g.a.event??""),O=oe(i,g.kid),Y=(U,ae)=>{let ye=$(ae);return ye?{text:U,target:ye}:U},fe=[];if(g.b.type==="act"){let U=m.get(g.b.event??"");D&&U&&(fe=[Y(D.title,D.id),` ${R(D.start)}–${R(D.end)} and `,Y(U.title,U.id),` ${R(U.start)}–${R(U.end)} overlap.`])}else{let U=b.rides[g.b.ride??-1];D&&U&&(fe=[`${O} is in `,Y(`${Q(i,U.driver)}’s car`,U.serves[0]),` ${R(ne(g.b.start))}–${R(ne(g.b.end))}, during `,Y(D.title,D.id),"."])}n.push({key:`${b.date}|clash|${E}`,tone:"problem",title:`${y}${O} is double-booked`,body:fe.map(U=>typeof U=="string"?U:U.text).join(""),parts:fe,target:null,suggestions:[]})}),c>=0&&c<ya)for(let g of b.issues)g.level!=="heads_up"||!k(g.at,g.event)||n.push({key:`${b.date}|${g.key}`,tone:"heads_up",title:y+g.title,body:g.body,target:$(g.event),suggestions:[]});for(let g of b.unplaced??[]){if(!k(g.at)){h++;continue}a++;let E=g.people.map(O=>o.has(O)?Q(i,O):oe(i,O)),D=g.from_notes?"The For line in its notes":"Its title";n.push({key:`${b.date}|unplaced|${g.id}`,tone:"problem",title:`${y}${R(g.at)} ${g.title}: ${so(g).toLowerCase()}`,body:g.reason==="unknown"&&g.word?`${D} names “${g.word}”, who isn’t anyone in the family, so ${E.length?`it’s only in ${mt(E)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:b.date,id:g.id}})}for(let g of b.events)!g.problems.length||!k(g.start)||n.push({key:`${b.date}|notes|${g.id}`,tone:"heads_up",title:`${y}Check the notes on ${Ft(i,g)}’s ${g.title}`,body:`These lines couldn’t be read: ${g.problems.join("; ")}`,target:$(g.id),suggestions:[]})}return{items:n,problems:a,unassigned:l,later:h,laterUnassigned:u}}function so(i){return i.reason==="unknown"&&i.word?`Who is “${i.word}”?`:"Who is this for?"}function wa(i,t,e,n,o=0){let s=new Set(G(i)),r=y=>{let m=y[0];return m==null?null:s.has(m)?ze:e.get(m)??null},a=[...(t.all_day??[]).map(y=>{let m=y.days>1?`Day ${y.day_number} of ${y.days}`:"";return{key:`${t.date}|allday|${y.id}`,title:y.stay?`🏨 ${y.title}`:y.title,note:y.stay?[Zr(i,y.people),m].filter(Boolean).join(" · "):m,color:r(y.people),cancelled:y.cancelled,warn:!1,pick:null,stay:y.stay&&!y.cancelled?y.id:null,canStay:!y.stay&&y.can_stay?y.id:null,notes:y.notes??""}}),...(t.unplaced??[]).map(y=>({key:`${t.date}|unplaced|${y.id}`,title:`${R(y.at)} ${y.title}`,note:so(y),color:null,cancelled:!1,warn:!0,pick:y.id,stay:null,canStay:null,notes:y.notes??""}))];if(!a.length)return null;let l=Math.max(120,n-gt),h=(y,m=7)=>30+m*y.title.length+(y.note?Math.min(m,5.6)*(y.note.length+2):0)+(y.notes?16:0)+(y.stay?12:0),u=0,f=0;for(;u<a.length&&f+h(a[u],6.4)<=o;)f+=h(a[u++],6.4);let b=0;f=0;for(let y of a.slice(u)){let m=Math.min(l,h(y));(!b||f+m>l)&&(b++,f=0),f+=m}let c=b?b*qr+(b-1)*qs:0;return{key:`${t.date}|allday`,h:c,chips:a,inline:u}}function oo(i,t){let e=re(i),n=null,o=s=>s.ahead>0?2:s.ongoing?1:0;for(let s of i.days){let r=ke(t.date,s.date);if(!(r<0))for(let a of G(i))for(let l of s.drivers[a]?.outings??[]){if(l.start==null)continue;let h=r*1440+l.start;if(r*1440+ne(l.end,l.start)<=t.minutes)continue;let f=h-t.minutes,b={driver:a,name:Q(i,a),date:s.date,ahead:r,start:l.start,inMinutes:f,ongoing:f<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(c=>e.get(c)??q(0)),warn:l.warn,target:l.target&&s.events.some(c=>c.id===l.target)?{day:s.date,event:l.target}:null};(!n||o(b)<o(n)||o(b)===o(n)&&b.inMinutes<n.inMinutes)&&(n=b)}}return n}function yi(i,t){return(i.points?.log??[]).filter(e=>e.by===t)}function ao(i,t){let e=[i.done_at?uo(i.done_at,t.today,t.time_zone):""];return i.late&&e.push("late"),i.kid!==i.by&&(e.push(`from ${t.kids.find(n=>n.id===i.kid)?.name??"someone else"}`),!i.late&&!i.points&&e.push("a favor")),e.filter(Boolean).join(" · ")}function bt(i){return i.state==="done"||i.state==="late"||vt(i.state)}function vt(i){return i==="skipped"||i==="excused"}var lo=780;function xi(i,t){return!!i.for_day&&(i.shows_from??i.due)===t&&!!i.due&&i.due>t}function $a(i,t,e){return i.state==="open"&&xi(i,t)&&e<lo}function co(i,t){return i.state==="open"&&!!i.for_day&&i.for_day===t}function ho(i,t){return i.chores.map(e=>$a(e,i.today,t)?{...e,state:"upcoming",shows_from:i.today}:t>=lo&&co(e,i.today)?{...e,state:"overdue"}:e)}function ka(i,t){return i.state==="overdue"&&i.for_day===t}function po(i){return i.state==="open"||i.state==="overdue"}function En(i,t,e){if(i.state==="skipped")return"Skipped";if(i.state==="excused")return"Excused";if(bt(i)){let n=i.done_at?uo(i.done_at,t,e):"";return i.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(i.state==="overdue")return i.missed>1?`Missed ${i.missed} times`:i.due?`Missed ${bi(i.due,t)}`:"Missed";if(i.state==="upcoming"){if(i.for_day)return`From 1 PM · for ${bi(i.for_day,t)}`;let n=i.shows_from??i.due;if(!i.due||!n||i.due<=n)return"";let o=ke(t,i.due);return`By ${o===1?"tomorrow":o<7?de(i.due):vi(i.due)}`}if(xi(i,t))return`Tonight · for ${bi(i.for_day,t)}`;if(co(i,t))return"For school today";if(i.due&&i.due>t){let n=ke(t,i.due);return n===1?"By tomorrow":`By ${n<7?de(i.due):vi(i.due)}`}return i.missed?`Today · missed ${i.missed===1?"once":`${i.missed} times`} before`:"Today"}function bi(i,t){let e=ke(t,i);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?de(i):vi(i)}function vi(i){return un(i)}function uo(i,t,e){let n=new Date(i);if(Number.isNaN(n.getTime()))return"";let o=Ta(e),s=o.day.format(n),r=o.time.format(n);return s===t?r:`${de(s)} ${r}`}var ro=new Map;function Ta(i){let t=ro.get(i);if(t)return t;let e=i;try{new Intl.DateTimeFormat("en-US",{timeZone:e})}catch{e=void 0}return t={day:new Intl.DateTimeFormat("en-CA",{year:"numeric",month:"numeric",day:"numeric",timeZone:e}),time:new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZone:e})},ro.set(i,t),t}function fo(i,t,e=1440){let n=ho(i,e).sort((o,s)=>o.order-s.order);return i.kids.map((o,s)=>{let r=n.filter(u=>u.kid===o.id),a=new Map;for(let u of r){if(u.state!=="upcoming")continue;let f=u.shows_from??u.due??i.today;a.set(f,[...a.get(f)??[],u])}let l=r.filter(u=>u.state==="overdue"),h=r.filter(u=>u.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??q(s),overdue:l,now:h,done:r.filter(bt),later:[...a.entries()].sort(([u],[f])=>u.localeCompare(f)).map(([u,f])=>({date:u,chores:f})),left:l.length+h.length}})}function go(i,t=1440){return ho(i,t).filter(e=>e.state==="overdue"&&!ka(e,i.today)||e.state==="open"&&(e.due==null||e.due<=i.today||xi(e,i.today))).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function wi(i){return!i.chores.length&&!i.templates.length}var nt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Ut(i){let t=i.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,s]=n.split("-").map(r=>nt.indexOf(r.trim()));if(o===void 0||o<0||s!==void 0&&s<0)return null;if(s===void 0)e.add(o);else for(let r=0;r<=(s-o+7)%7;r++)e.add((o+r)%7)}return e}function $i(i){let t=[...new Set(i)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${nt[n[0]]}-${nt[n.at(-1)]}`]:n.map(o=>nt[o])).join(", ")}var it="none";function Wt(i){return i==="daily"||i==="school"?"":"Any"}function mo(i=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:i,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1,points:null}}function bo(i){let t=i.days??Wt(i.repeats),e=i.repeats==="daily"&&t!=="";return{template:i.id,repeats:e?"weekly":i.repeats,title:i.title,icon:i.icon,details:i.details??"",who:[...i.who],take_turns:!!i.take_turns,days:t,every:!e&&i.every&&i.every>0?i.every:1,paused:i.paused,night_before:!!i.night_before,bring_only:!!i.bring_only,points:i.points??null}}function ki(i){return i.title.trim()?i.who.length?i.days===it?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function vo(i){return{...i.template?{template:i.template}:{},repeats:i.repeats,title:i.title.trim(),icon:i.icon??"",details:i.details.trim(),who:i.who,take_turns:i.take_turns&&i.who.length>1,days:i.repeats==="daily"?"":i.days,every:i.repeats==="school"?1:i.every,paused:i.paused,...i.repeats==="school"?{night_before:i.night_before,bring_only:i.bring_only}:{},points:i.points}}function Ti(i){let t=i%100;return t>=11&&t<=13?`${i}th`:`${i}${{1:"st",2:"nd",3:"rd"}[i%10]??"th"}`}function Ei(i,t,e=1,n=!1,o=!1){if(i==="school"){let u=t.trim().replace(/-/g,"–"),f=o?u?`${u} Bring lunch days`:"Bring lunch days":u?`${u} school days`:"Every school day";return n?`${f}, the night before`:f}let s={daily:"day",weekly:"week",monthly:"month"}[i],r=e>1?`every ${e} ${s}s`:`each ${s}`,a=t.trim();if(i==="daily")return e>1?`Every ${e} days`:"Every day";if(i==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(i==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let h=`${a.split(",").map(u=>{let f=u.trim();return f.toLowerCase()==="last"?"the last day":/^\d+$/.test(f)?`the ${Ti(Number(f))}`:`the ${f}`}).join(" and ")} ${r}`;return h[0].toUpperCase()+h.slice(1)}function Ci(i,t,e=!1){let n=i.map(s=>t.find(r=>r.id===s)?.name??s);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function _i(i){let t=i.indexOf(":"),e=t<0?i:i.slice(0,t),n=t<0?"":i.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function Ie(i){if(Number.isInteger(i))return String(i);let t=Math.trunc(i);return Math.abs(Math.abs(i-t)-.5)<1e-9?`${i<0?"-":""}${Math.abs(t)||""}½`:String(Math.round(i*10)/10)}function Pi(i,t){return!!i?.points?.leaders.includes(t)}function yo(i){let t=/\d+/.exec(i)?.[0];return t?Math.min(1e3,Number(t.slice(0,5))):null}function Ea(i){let t=Math.max(1,i.every??1),e=(i.days??Wt(i.repeats)).trim(),n;return i.repeats==="daily"?n=7/t:i.repeats==="monthly"?n=12/52/t:i.repeats==="school"?n=e?Ut(e)?.size??5:5:n=e===""||e.toLowerCase()==="any"?1/t:(Ut(e)?.size??1)/t,i.take_turns&&i.who.length>1?n/i.who.length:n}function xo(i,t,e=1){let n=Object.fromEntries(t.map(o=>[o,0]));for(let o of i){if(o.paused||o.problems.length)continue;let s=(o.points??e)*Ea(o);for(let r of o.who)r in n&&(n[r]=n[r]+s)}for(let o of t)n[o]=Math.round(n[o]*2)/2;return n}function Cn(i,t){return`${i}|${t}`}function yt(i,t){let[e,n,o]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function _n(i){let[t,e,n]=i.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function wo(i,t){return i.days_off.find(e=>e.first<=t&&t<=e.last)??null}function $o(i,t){return _n(t)<5&&!wo(i,t)}function Kt(i,t,e=new Map){if(!$o(i,t))return null;let n=Cn(i.id,t);if(e.has(n)){let s=e.get(n);return s?{lunch:s,picked:!0}:{lunch:i.default,picked:!1}}let o=i.picks[t];return o?{lunch:o,picked:!0}:{lunch:i.default,picked:!1}}function xt(i,t){return $o(i,t)?i.menus?.[t]??null:null}var Ca="From the school's menu feed.";function _a(i){let t=i.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Ca);return t.length?t.join(`
`):null}function Ce(i){return i.slice(0,7)}function Pn(i){let[t,e]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Si(i,t=1){let[e,n]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function ko(i){let t=[];for(let e=Ce(i.first);e<=Ce(i.last);e=Si(e))t.push(e);return t}function To(i,t,e,n=new Map){let o=`${e}-01`,s=yt(o,-_n(o)),r=[];for(;Ce(s)<=e;){let a=[];for(let l=0;l<5;l++){let h=yt(s,l),u=Ce(h)!==e,f=u?null:wo(t,h),b=u?null:Kt(t,h,n);a.push({date:h,day:Number(h.slice(8)),outside:u,off:f?f.title:null,lunch:b?.lunch??null,picked:b?.picked??!1,menu:u?null:xt(t,h)?.dish??null,sides:u?null:_a(xt(t,h)?.details??""),past:h<i.today,today:h===i.today})}a.some(l=>!l.outside)&&r.push(a),s=yt(s,7)}return r}function Eo(i){return i.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Co(i){let t=0,e=0;for(let n of i.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function _o(i,t,e,n=new Map){let o=e<780?0:1;for(let s=o;s<8;s++){let r=yt(t,s),a=Kt(i,r,n);if(!a)continue;let l=ke(t,r);return{lunch:a.lunch,when:l===0?"today":l===1?"tomorrow":de(r),date:r,menu:xt(i,r)?.dish??null}}return null}var Pa={timeline:"timeline",full:"timeline",compact:"compact"};function Gt(i){let t=new URLSearchParams(i),e={},n=Pa[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}function Mi(i,t=0){return i==null||!Number.isFinite(i)?t:i}function Sa(i,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of i.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(i.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function Ma(i,t){let e=[],n=[],o=()=>{let s=n[n.length-1];s&&Mi(s.end)>t&&e.push(...n),n=[]};for(let s of i){if(s.start==null||s.end==null)continue;if(s.type==="home"||s.type==="stay"){o(),s.end>t&&e.push(s);continue}let r=n[n.length-1];r&&r.end!==s.start&&o(),n.push(s)}return o(),e}function Aa(i,t){let e=new Set(i.events.filter(s=>Sa(i,s)<=t).map(s=>s.id)),n=s=>Mi(i.rides[s??-1]?.end,-1)<=t,o=s=>s.type==="act"?e.has(s.event??""):n(s.ride);return{...i,events:i.events.filter(s=>!e.has(s.id)),kids:Object.fromEntries(Object.entries(i.kids).map(([s,r])=>[s,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(i.drivers).map(([s,r])=>[s,{...r,segments:Ma(r.segments,t),outings:r.outings.filter(a=>a.start==null||Mi(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:i.clashes.filter(s=>!o(s.a)&&!o(s.b)),issues:i.issues.filter(s=>!s.event||!e.has(s.event)),done:e.size,from:t}}function Po(i,t){return{...i,whole_week:i.whole_week??i.days,days:i.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?Aa(e,t.minutes):e)}}var So=qe`
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
  /* What's wrong, on one line across the bottom of the header. */
  .problem-row {
    flex: none;
    margin: -6px 0 0;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    color: var(--bad-ink);
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button.problem-row {
    cursor: pointer;
  }
  .problem-row.open {
    white-space: normal;
  }
  .problem-age,
  .problem-more {
    font-weight: 500;
  }
  .problem-link {
    text-decoration: underline;
  }
  .problem-detail {
    display: block;
    font-weight: 500;
    color: var(--ink-2);
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
  .col-head .ch-text {
    flex: 1;
  }
  /* The second line: this week's count, and a kid's lunch tucked at the right. */
  .sub-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .sub-row .sub {
    min-width: 0;
  }
  /* Bring or Buy never shrinks: the count beside it gives way instead. */
  .sub-row .lunch-chip.small {
    flex: none;
    max-width: none;
    margin-left: auto;
    height: 18px;
    font-size: 11.5px;
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
  /* Over days at an address: tap it to say who's staying there. */
  button.strip-chip.maybe:hover,
  button.strip-chip.maybe:focus-visible {
    background: rgba(0, 0, 0, 0.05);
  }
  button.strip-chip.maybe::after {
    content: "›";
    align-self: center;
    margin-left: -2px;
    opacity: 0.45;
    font-size: 16px;
    font-weight: 800;
    line-height: 1;
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
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .toast-undo {
    flex: none;
    min-height: 36px;
    padding: 0 12px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 18px;
    background: transparent;
    color: #fff;
    font-weight: 700;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chore-head .ch-text {
    flex: 1;
  }
  /* The name gets the whole first line; the lunch chip sits beside the count below it. */
  .chore-head .sub-row .sub {
    flex: none;
    max-width: 100%;
  }
  .chore-head .sub-row .lunch-chip {
    height: 24px;
    padding: 0 9px;
    font-size: 12.5px;
    max-width: 78%;
  }
  .chore-list,
  .points-log {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .chore-cols.flip .chore-col {
    animation: card-flip 0.32s ease-out both;
  }
  @keyframes card-flip {
    from {
      transform: perspective(900px) rotateY(-80deg);
      opacity: 0.4;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .chore-cols.flip .chore-col {
      animation: none;
    }
  }
  .log-row {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 52px;
    padding: 6px 12px;
    border-radius: 12px;
    background: rgba(var(--rgb), 0.06);
    border: 1px solid rgba(var(--rgb), 0.14);
  }
  .log-row .chore-icon {
    width: 26px;
    text-align: center;
  }
  .log-row .chore-text {
    flex: 1;
  }
  .log-pts {
    flex: none;
    font-size: 18px;
    font-weight: 800;
    color: var(--k, var(--ink));
  }
  .log-row.nothing {
    background: transparent;
  }
  .log-row.nothing .chore-title,
  .log-row.nothing .log-pts {
    color: var(--muted);
    font-weight: 600;
  }
  .out-of {
    opacity: 0.6;
    font-weight: 600;
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
  .chore.skipped .chore-note {
    color: var(--muted);
    font-weight: 600;
  }
  .pts-flash {
    margin-left: auto;
    flex: none;
    font-size: 17px;
    font-weight: 800;
    color: var(--ok);
    animation: pts-rise 2.6s ease-out forwards;
  }
  @keyframes pts-rise {
    0% {
      opacity: 0;
      transform: translateY(6px) scale(0.9);
    }
    12% {
      opacity: 1;
      transform: none;
    }
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-6px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .pts-flash {
      animation: none;
    }
  }
  .score {
    flex: none;
    font-size: 12.5px;
    line-height: 18px;
    font-weight: 700;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .score.lead {
    padding: 0 6px;
    border-radius: 999px;
    color: #7a4b00;
    background: linear-gradient(135deg, #fff3c4, #f7d774);
    box-shadow: 0 0 0 1px rgba(183, 121, 31, 0.35);
  }
  /* The kid leading on points: a gold name, a gold ring and a little crown. */
  .leader .name {
    background: linear-gradient(100deg, #a8660a 0%, #e0a91c 35%, #fff1a8 50%, #e0a91c 65%, #a8660a 100%);
    background-size: 250% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    background-position: 100% 0;
    /* Its own layer: each frame of the shine redraws just the name, not the board around it. */
    will-change: transform;
  }
  .leader .avatar {
    position: relative;
    overflow: visible;
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px #e0a91c,
      0 0 10px rgba(224, 169, 28, 0.55);
  }
  .leader .avatar::after {
    content: "👑";
    position: absolute;
    top: -13px;
    right: -9px;
    font-size: 15px;
    line-height: 1;
    transform: rotate(18deg);
  }
  /* The rides board's heads sit at the very top of the scroller: keep the crown inside. */
  .col-head.leader .avatar::after {
    top: -9px;
    right: -11px;
  }
  /* The shine sweeps across every 6 s (board.ts runs it). Between sweeps nothing moves, so the
     screen isn't redrawn 60 times a second for a name that's standing still. */
  @media (prefers-reduced-motion: reduce) {
    .leader .name {
      background-position: 50% 0;
    }
  }
  .points-input {
    max-width: 120px;
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
  .week-points {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 14px;
    padding: 10px 14px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--surface);
  }
  .week-points-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--muted);
    margin-right: 4px;
  }
  .week-kid {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 650;
  }
  .week-kid .avatar {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  .week-kid strong {
    font-variant-numeric: tabular-nums;
    color: var(--c);
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
  .ed-for {
    flex-wrap: wrap;
  }
  /* The driver picks stay quiet (outlined, not a solid black block) so the kids lead the eye. */
  .ride-box > .choices .choice {
    min-height: 40px;
    font-weight: 600;
    color: var(--ink-2);
  }
  .ride-box > .choices .choice[aria-pressed="true"] {
    background: var(--control);
    border-color: var(--ink);
    box-shadow: inset 0 0 0 1px var(--ink);
    color: var(--ink);
    font-weight: 800;
  }
  /* A kid picked to ride along is filled in their own color. */
  .field-sub .who-chip[aria-pressed="true"] {
    background: var(--c);
    color: #fff;
  }
  .field-sub .who-chip[aria-pressed="true"] .avatar {
    background: #fff;
    color: var(--c);
  }
  /* Riders: the same colored chips as everywhere else, a size down to fit the driver box. */
  .field-sub .who-chip {
    min-height: 40px;
    padding: 0 12px 0 4px;
    gap: 6px;
    font-size: 14px;
  }
  .field-sub .who-chip .avatar {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }
  /* Who the event is for, in their colors, so the kids stand out as much as the drivers. */
  .for-who {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 12px 3px 3px;
    border-radius: 16px;
    background: rgba(var(--rgb), 0.14);
    box-shadow: inset 0 0 0 1px rgba(var(--rgb), 0.5);
    color: var(--ink);
    font-size: 15px;
    font-weight: 800;
  }
  .for-who .avatar {
    width: 26px;
    height: 26px;
    font-size: 12px;
  }
  .for-guess {
    font-size: 12px;
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
`;function Da(i,t,e,n,o=14){let s=i.top-o-8,r=e.h-i.bottom-o-8,a=t.h<=s,l=t.h<=r,h=n?a||!l&&s>r:!l&&(a||s>r),u=h?i.top-o-t.h:i.bottom+o,f=Math.max(8,Math.min(u,e.h-8-t.h)),b=Math.max(8,Math.min(i.x-t.w/2,e.w-8-t.w));return{left:Math.round(b),top:Math.round(f),above:h}}function Vt(i,t){for(let e of i.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var Sn=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?Vt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=Vt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let s=this.press;!s||s.el!==e||!e.isConnected||(s.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&Vt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=Vt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&Vt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let s=t.dataset.note;if(!s)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=s,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let a={w:r.offsetWidth,h:r.offsetHeight},l={w:window.innerWidth,h:window.innerHeight},h=Da(e,a,l,n,o);r.style.left=`${h.left}px`,r.style.top=`${h.top}px`,r.classList.toggle("above",h.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};(()=>{if(typeof document>"u")return;let i=null,t=new Map;Js((e,n)=>{let o=`${n}|${e}`,s=t.get(o);if(s!==void 0)return s;if(!i){if(!document.body)return null;i=document.createElement("span"),i.setAttribute("aria-hidden","true"),i.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;white-space:pre;letter-spacing:normal;word-spacing:normal;text-transform:none;contain:layout style",document.body.appendChild(i)}return i.style.font=n,i.style.font?(i.style.fontVariantNumeric="tabular-nums",i.textContent=e,s=i.getBoundingClientRect().width,t.size>2e4&&t.clear(),t.set(o,s),s):null})})();var cd=6e3,hd=1800,vr="mydashlight.rides.view",pd=1100,ud=440,fd=700,gd=3*6e4,cr=1200,md=450,bd=110;function vd(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var On=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,hr=J`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,yd=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9z"/></svg>`,pr=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,xd=new URL("emoji.json",import.meta.url).href,ur=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],fr=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,gr=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,wd=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,$d=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Xt={bring:"Bring",buy:"Buy"};function kd(i,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[i];return t<=1?e:`${e}s${i==="monthly"&&t===3?" (quarterly)":i==="monthly"&&t===12?" (yearly)":""}`}function ue(i){let t=/\p{L}|\p{N}/u.exec(i);return t?t[0].toUpperCase():"?"}function Xi(i){return un(i)}function Td(i,t){return mi(i,t)||we(i).split(",")[0]}function Ed(i){let t=i.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Cd(){try{return localStorage.getItem(vr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function _d(i){try{localStorage.setItem(vr,i)}catch{}}function Bn(i,t){return G(i).includes(t)?Q(i,t):oe(i,t)}function Pd(i,t){if(t.driver==="none")return{driver:"none",riders:[],backRiders:[]};let e=yr(i,t),n=l=>(l??[]).filter(h=>t.people.includes(h)&&h!==e),o=n(t.ownWay),s=n(t.ownBack),r=t.people.find(l=>G(i).includes(l));if(!e||e===r&&!o.length&&!s.length)return{driver:"",riders:[],backRiders:[]};let a=l=>t.people.filter(h=>h!==e&&!l.includes(h));return{driver:e,riders:a(o),backRiders:a(s)}}function yr(i,t){if(t.driver==="none")return null;let e=G(i).filter(o=>t.people.includes(o)),n=t.people.filter(o=>e.includes(o));return t.driver&&n.includes(t.driver)?t.driver:n[0]??null}function Zt(i){return i.days.every(t=>!t.events.length)}var Jt=class extends ve{constructor(){super();this.flipUntil=0;this.stopWatching=null;this.resize=null;this.clockTimer=null;this.shineTimer=null;this.idleTimer=null;this.toastTimer=null;this.toastUndo=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Gt(location.search).view;this.urlPage=Gt(location.search).page;this.urlPast=Gt(location.search).past;this.urlDayPicker=Gt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,s=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(s)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-s,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},gd))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.problemOpen=!1,this.mode=this.urlView??Cd(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.pointsFlash=new Map,this.manage=!1,this.totals=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.shineTimer=setInterval(()=>this.shineLeaders(),cd),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new Sn(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.shineTimer&&clearInterval(this.shineTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,s]of this.lunchDraft){let[r,a]=o.split("|"),l=e.kids.find(h=>h.id===r);(!l||(l.picks[a]??null)===s||!Kt(l,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores){let s=n.get(o.id);s===void 0||!mr(o,s)||(n.delete(o.id),s===!0&&o.earned&&this.flashPoints(o.id,o.earned))}for(let o of n.keys())e.chores.some(s=>s.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=no(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}shineLeaders(){if(!(document.hidden||matchMedia("(prefers-reduced-motion: reduce)").matches))for(let e of this.renderRoot.querySelectorAll(".leader .name"))e.animate?.([{backgroundPosition:"100% 0"},{backgroundPosition:"0 0"}],{duration:hd,easing:"ease-in-out"})}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<pd)return!1;let e=this.plan;return!e||this.width-ud>=pi(ce(e).length,G(e).length)}today(){return It(this.plan?.time_zone??vd())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Po(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let s=this.board,r=this.boardPlan;this.board=to(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,s&&r&&this.keepPlace(s,r,e)}return this.board}keepPlace(e,n,o){let s=this.scroller;if(!s||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||s.scrollTop<=0)return;let r=e.dayHeads.find(u=>u.date===this.pinDay)?.h??Ht,a=fi(e,s.scrollTop+r+4),l=n.days[Math.floor(a/1440)]?.date,h=l?o.days.findIndex(u=>u.date===l):-1;h>=0&&(this.keepAt=h*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let s=this.scroller;if(!s||!this.board)return;let r=this.topFor(e,n);Math.abs(s.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?s.scrollTo({top:r,behavior:"smooth"}):s.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,s=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(s,Zs(o,e)-Vs(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let s=this.today();if(e===s.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let l=1/0;if(this.mode==="timeline"){for(let h of a.events)l=Math.min(l,h.arrive_by??h.start);for(let h of Object.values(a.drivers))for(let u of h.outings)u.start!=null&&(l=Math.min(l,u.start))}this.scrollToTime(r*1440+(Number.isFinite(l)?Math.max(0,l-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let l of this.board.dayHeads)l.y<=n+1&&(o=l);this.pinDay!==o.date&&(this.pinDay=o.date);let s=null,r=this.nowSpot(),a=this.today().date;if(r){let l=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),h=l>0?"up":"down";this.board.dayHeads.some(u=>u.date===a)&&o.date!==a?s=`${h}|Today`:this.mode==="timeline"&&Math.abs(l)>e.clientHeight*.6&&(s=`${h}|${o.date===a?"Now":"Today"}`)}this.away!==s&&(this.away=s)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.totals=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(!this.choreDone(e)&&!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n,o){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let s=o!==void 0||!this.choreDone(e),r=new Map(this.choreDraft);r.set(e.id,o??s),this.choreDraft=r;try{await this.backend.setChoreDone(e.id,s,n&&n!==e.kid?n:void 0,o)}catch(a){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let h=a instanceof K?a:new K("error",String(a));this.showToast(h.code==="preview"?h.message:`Couldn’t save that. ${h.message}`)}}flashPoints(e,n){this.pointsFlash=new Map(this.pointsFlash).set(e,n),window.setTimeout(()=>{if(this.pointsFlash.get(e)!==n)return;let o=new Map(this.pointsFlash);o.delete(e),this.pointsFlash=o},2600)}renderScore(e,n=!1){let o=this.chores?.points,s=o?.scores[e];if(!o||s===void 0)return x;let r=o.leaders.includes(e),a=Ie(s),l=n?o.possible?.[e]:void 0,h=`${a} ${s===1?"point":"points"}${l!==void 0?` out of ${Ie(l)}`:""} in the last ${o.days} days${r?", the most":""}`;return p`<span class="score ${r?"lead":""}" role="img" aria-label=${h} title=${h}
      >${r?"★ ":""}${a}${l!==void 0?p`<span class="out-of">/${Ie(l)}</span>`:x}</span
    >`}choreDone(e){let n=this.choreDraft.get(e.id);return n===void 0?bt(e):n!==!1}editMenu(e,n){let o=this.lunch?.kids??[],s=xt(e,n),r=o.filter(a=>a.id===e.id||s&&xt(a,n)?.dish===s.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:s?.dish??"",details:s?.details??"",kids:r,had:!!s,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let s=o instanceof K?o:new K("error",String(o));this.showToast(s.code==="preview"?s.message:`Couldn’t save that. ${s.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let s=new Map(this.lunchDraft);for(let r of n)s.set(Cn(e,r),o);this.lunchDraft=s;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let h of n)a.delete(Cn(e,h));this.lunchDraft=a;let l=r instanceof K?r:new K("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?bo(e):mo(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(dr(),lr))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ki(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(vo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof K?n:new K("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof K?n:new K("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(s=>s.date===this.pinDay)?.h??Ht;this.keepAt=n&&this.board?fi(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||_d(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),s=this.plan;if(!o||!s)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...ce(s),...G(s)]);this.forPick={day:e,id:n,placed:!1,label:`${R(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}openStayPick(e,n){let o=this.plan,s=o?.days.find(l=>l.date===e)?.all_day?.find(l=>l.id===n);if(!o||!s)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...ce(o),...G(o)]),a=l=>s.driver&&s.driver!=="none"?s.people.filter(h=>r.has(h)&&h!==s.driver&&!(l??[]).includes(h)):[];this.forPick={day:e,id:n,placed:!1,label:`🏨 ${s.title}`,recurring:!1,word:null,fromNotes:!!s.from_notes,people:s.people.filter(l=>r.has(l)),scope:"this",busy:!1,stay:!0,timed:!!s.timed,driver:s.driver==="none"||G(o).includes(s.driver??"")?s.driver??"":"",ownWay:a(s.riders),ownBack:a(s.back_riders??s.riders),noAddress:!!s.no_address,maybe:!s.stay}}changeForPick(e,n,o){let s=e.who?.[o.event_id],r=s?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${R(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!s?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e="save"){let n=this.forPick,o=this.plan,s=this.backend;if(!n||!o||!s||e==="save"&&!n.people.length)return;let r=e==="clear"?[]:n.people;this.forPick={...n,busy:!0};try{e==="notStay"?await s.setPeople(n.id,null,"this",void 0,!1):await s.setPeople(n.id,r,n.scope,n.stay&&n.timed&&e==="save"?Pd(o,n):void 0,n.maybe&&e==="save"?!0:void 0),this.forPick=null;let a=n.label.replace(/^\S+ /,""),l=r.map(u=>Bn(o,u)),h=G(o).filter(u=>r.includes(u));this.showToast(e==="notStay"?`Saved. ${a} isn’t a stay now.`:e==="clear"?`Saved. ${a} goes by the names in its title again.`:n.stay?`Saved. ${mt(h.map(u=>Q(o,u)))}’s rides start from ${a} now.`:`Saved. ${a} is in ${mt(l)}’s ${l.length>1?"lanes":"lane"} now.`,e==="notStay"?()=>void s.setPeople(n.id,null,"this",void 0,null).catch(u=>this.showToast(`Couldn’t undo that. ${String(u)}`)):null)}catch(a){this.forPick&&(this.forPick={...this.forPick,busy:!1});let l=a instanceof K?a:new K("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}renderForPick(e){let n=this.plan,o=e.stay?n?.days.some(E=>E.date===e.day&&E.all_day?.some(D=>D.id===e.id&&(D.stay||D.can_stay))):e.placed?n?.days.some(E=>E.date===e.day&&E.events.some(D=>D.id===e.id)):!!this.findUnplaced(e.day,e.id),s=e.stay?"Who’s staying?":"Who is this for?",r=p`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return p`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">${s}</span></div>
          ${r}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let a=e.busy,l=E=>{this.forPick&&(this.forPick={...this.forPick,...E})},h=E=>l({people:e.people.includes(E)?e.people.filter(D=>D!==E):[...e.people,E]}),u=re(n),f=ce(n),b=f.length>1&&f.every(E=>e.people.includes(E)),y=[...f,...G(n)].filter(E=>e.people.includes(E)),m=y.map(E=>Bn(n,E)),$=!!e.stay&&!y.some(E=>G(n).includes(E)),k=m.length<2?m.join(""):`${m.slice(0,-1).join(", ")} & ${m[m.length-1]}`,g=(E,D,O,Y)=>p`<button
      type="button"
      class="who-chip"
      style="--c:${O.color};--rgb:${O.rgb}"
      aria-pressed=${e.people.includes(E)?"true":"false"}
      ?disabled=${a}
      @click=${()=>h(E)}
    >
      <span class="avatar ${Y?"driver":""}" aria-hidden="true">${ue(D)}</span>${D}
    </button>`;return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${s}</span>
          <span class="ed-meta">${we(e.day)} · ${e.label}</span>
        </div>
        ${r}
      </div>
      ${e.word?p`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:!e.stay&&!e.fromNotes&&e.people.length?p`<p class="field-hint">Guessed from the names at the start of the title.</p>`:x}
      ${e.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${a} @click=${()=>l({scope:"this"})}>
                Just ${de(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${a} @click=${()=>l({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:x}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${f.map(E=>g(E,oe(n,E),u.get(E)??q(0),!1))}
        </div>
        ${f.length>1?p`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${b?"true":"false"}
              ?disabled=${a}
              @click=${()=>l({people:b?e.people.filter(E=>!f.includes(E)):[...f,...e.people.filter(E=>!f.includes(E))]})}
            >
              All the kids
            </button>`:x}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${G(n).map(E=>g(E,Q(n,E),ze,!0))}
        </div>
      </div>
      ${e.stay&&e.timed&&!$?this.renderStayDrive(n,e,l):x}
      <p class="field-hint">
        ${e.stay?p`${e.timed?p`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} while they’re there. Pick the kids
                  going too, so they’re in the car on the drive.`:p`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} on every day of the stay. The kids
                  go wherever their driver goes, so picking just the parents is enough.`}${y.length?p` Saved in the event’s notes as <strong>For: ${k}</strong>.`:x}`:y.length?p`Saved in the event’s notes as <strong>For: ${k}</strong>, so its title stays as it is. It shows in ${y.length>1?"their lanes":`${m[0]}’s lane`}${y.some(E=>f.includes(E))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?p`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>void this.saveForPick("clear")}>
            Go by the names in the title instead
          </button>`:x}
      ${e.stay&&!e.maybe?p`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>void this.saveForPick("notStay")}>Not a stay</button>`:x}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!y.length||$} @click=${()=>void this.saveForPick()}>
          ${a?"Saving to Google Calendar…":$?"Pick a parent too":y.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderStayDrive(e,n,o){let s=n.people.filter(f=>G(e).includes(f)),r=yr(e,n),a=n.people.filter(f=>f!==r),l=re(e),h=ce(e),u=(f,b)=>{let c=n[b]??[],y=!h.includes(f),m=y?ze:l.get(f)??q(0),$=Bn(e,f);return p`<button
        type="button"
        class="who-chip"
        style="--c:${m.color};--rgb:${m.rgb}"
        aria-pressed=${c.includes(f)?"false":"true"}
        ?disabled=${n.busy}
        @click=${()=>o({[b]:c.includes(f)?c.filter(k=>k!==f):[...c,f]})}
      >
        <span class="avatar ${y?"driver":""}" aria-hidden="true">${ue($)}</span>${$}
      </button>`};return p`<div class="field">
        <span class="field-label">Drives there and back</span>
        <div role="group" aria-label="Who drives there and back" class="choices" style="grid-template-columns:repeat(${s.length+1},1fr)">
          ${s.map(f=>p`<button type="button" class="choice" aria-pressed=${r===f?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:f})}>
              ${Q(e,f)}
            </button>`)}
          <button type="button" class="choice" aria-pressed=${r===null?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:"none"})}>
            No drive
          </button>
        </div>
      </div>
      ${r&&a.length?p`<div class="field">
              <span class="field-label">In the car there with ${Q(e,r)}</span>
              <div role="group" aria-label="Who rides there" class="who-chips">${a.map(f=>u(f,"ownWay"))}</div>
            </div>
            <div class="field">
              <span class="field-label">In the car back home</span>
              <div role="group" aria-label="Who rides back" class="who-chips">${a.map(f=>u(f,"ownBack"))}</div>
              <p class="field-hint">Anyone not in the car makes their own way, and the hotel is home for them while it lasts.</p>
            </div>`:x}
      ${n.noAddress?p`<p class="field-hint">Add the hotel’s address to the event for exact drive times.</p>`:x}`}renderForLine(e,n,o){let s=e.who?.[o.event_id];if(!s)return x;let r=re(e);return p`<span class="ed-for"
      >${s.people.map(a=>{let l=r.get(a)??ze,h=Bn(e,a);return p`<span class="for-who" style="--c:${l.color};--rgb:${l.rgb}"
          ><span class="avatar ${r.has(a)?"":"driver"}" aria-hidden="true">${ue(h)}</span>${h}</span
        >`})}${s.from_notes?"":p`<span class="for-guess">from the title</span>`}<button
        type="button"
        class="ed-for-change"
        @click=${()=>this.changeForPick(e,n,o)}
      >
        Change
      </button></span
    >`}findEvent(e){let n=this.plan?.days.find(s=>s.date===e.day),o=n?.events.find(s=>s.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1}}showToast(e,n=null){this.toast=e,this.toastUndo=n,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null,this.toastUndo=null},n?1e4:7e3)}undoToast(){let e=this.toastUndo;this.toast=null,this.toastUndo=null,this.toastTimer&&clearTimeout(this.toastTimer),e?.()}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(s){let r=s instanceof K?s:new K("error",String(s));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,s){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&s.includes(e.drop)){s.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend,s=this.plan,r=!n&&s?Ys(s,e):null;if(r&&s){let a=Ft(s,e),l=s.who?.[e.event_id]?.people??[],h=this.findAnyCopy(e,r);this.save("attending",n,async()=>{await o.setPeople(e.id,r,"this"),this.closeEditor(),this.showToast(`Saved. ${a} is off ${e.title} now.`,h?()=>void this.save("attending",!0,()=>o.setPeople(h,l,"this")):null)});return}this.save("attending",n,()=>o.setAttending(e.id,n,"this"))}findAnyCopy(e,n){return this.plan?.days.find(r=>r.events.some(a=>a.id===e.id))?.events.find(r=>r.event_id===e.event_id&&r.id!==e.id&&n.includes(r.own??r.kid))?.id??null}toggleStay(e,n,o){if(!this.backend)return;let s=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>s.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>s.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let s=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(l=>l!==n):[...r,n];this.save(`along-${o}`,a,()=>s.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let s=((this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by)??e.start)+n;this.arriveDraft=s===e.start?null:s,this.timesOpen={...this.timesOpen,arrive:!0},this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),cr)}clearArrive(){this.arriveDraft=null,this.timesOpen={...this.timesOpen,arrive:!1},this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let s=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>s.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,s=Math.max(e.start+5,(o??e.end)+n);this.leaveDraft=s===e.end?null:s,this.timesOpen={...this.timesOpen,leave:!0},this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),cr)}clearLeave(){this.leaveDraft=null,this.timesOpen={...this.timesOpen,leave:!1},this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let s=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>s.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,bd)},md)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),s=o?io(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?go(this.chores,this.today().minutes).filter(b=>!this.choreDone(b)):[],l=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,h=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?this.choreDone(this.whoFor)?"Done chore":"Who did it":this.sel?"Change this ride":"Needs attention",u=p`<aside class="panel" aria-label=${h}>
      ${l??(this.sel&&e?this.renderEditor(e):this.renderAttention(s,a))}
    </aside>`,f=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<fd?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,s,a.length)} ${f?this.renderBanner(e):x}
          <main>
            ${f?p`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Zt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Zt(o)?this.renderDayRail(o):x}
                  ${n&&this.away?this.renderBackToToday(this.away):x}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${u}`:x}
          </main>
        </div>
        ${r?u:x}
        ${this.toast?p`<div class="toast" role="status">
              ${this.toast}${this.toastUndo?p`<button type="button" class="toast-undo" @click=${()=>this.undoToast()}>Undo</button>`:x}
            </div>`:x}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let s=n.problems+o;this.tick;let r=this.today(),a="",l=null;if(e){let c=e.time_zone,y=`Plan from ${ti(new Date(e.updated),new Date,c)}`;if(this.error){let m=["connection_lost","timeout","not_running"].includes(this.error.code);l={short:_s(this.error),detail:m?null:this.error.message,age:y}}else e.status&&!e.status.ok?l={...Ps(e.status.error),age:y}:this.backend?.live||(a=`Updated ${ti(new Date(e.updated),new Date,c)}`)}let h=(c,y,m,$)=>p`
      <button type="button" class="seg-btn" title=${$} aria-pressed=${this.mode===c?"true":"false"} @click=${()=>this.setMode(c)}>
        ${m}<span class="seg-label">${y}</span>
      </button>
    `,u=(c,y,m)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===c?"true":"false"} @click=${()=>this.setPage(c)}>
        ${m}<span class="seg-label">${y}</span>
      </button>
    `,f=Re(r.minutes),b=!!e&&Zt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${J`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:x}
        <div class="titles">
          <h1 class="clock" aria-label=${`${we(r.date)}, ${f}`}>
            <span class="hm">${f.slice(0,-3)}</span><span class="ampm">${f.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${we(r.date)}${a?p`<span class="status"> · ${a}</span>`:x}
          </p>
        </div>
        ${e&&!b?this.renderNext(e,oo(e,r),n):x}
        <div class="controls">
          ${this.wide||b&&!o?x:p`<button type="button" class="attn-btn ${s?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${s}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?x:p`<div role="group" aria-label="View" class="seg">
            ${h("timeline","Timeline",J`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${h("compact","Compact",J`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${u("rides","Rides",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${u("chores","Chores",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?x:u("lunch","Lunch",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
      ${l?this.renderProblem(l):x}
    `}renderProblem(e){let n=p`<span class="problem-what">${e.short}</span><span class="problem-age"> · ${e.age}</span>`;if(!e.detail)return p`<p class="problem-row" role="status">${n}</p>`;let o=this.problemOpen;return p`<button
      type="button"
      class="problem-row ${o?"open":""}"
      role="status"
      title=${e.detail}
      aria-expanded=${o?"true":"false"}
      @click=${()=>this.problemOpen=!o}
    >
      ${n}${o?p`<span class="problem-detail">${e.detail}</span>`:p`<span class="problem-more"> · <span class="problem-link">Details</span></span>`}
    </button>`}renderNext(e,n,o){if(!n){let h=this.today().date,u=o.unassigned,f=o.laterUnassigned;if(u){let c=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${u} ${u===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?p`<div class="next idle needs">${c}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${c}</button>`}if(f)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${f} ${f===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let b=e.days.some(c=>c.date>=h&&c.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${b?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${b?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let s;n.ongoing?s="On the road now":n.ahead===0?s=n.inMinutes<180?`Next trip · in ${pt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?s="Next trip · tomorrow":s=`Next trip · ${de(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=p`
      <span class="next-eyebrow">${s}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${ue(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(h=>p`<span class="kid-dot" style="background:${h.color}"></span>`)}</span>
        ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:x}
      </span>
    `,l=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?p`<button type="button" class=${l} @click=${()=>this.open(n.target)}>${a}</button>`:p`<div class=${l}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return x;let n=this.today().date,o=re(e),s=this.railShown;return p`<div
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
        ${e.days.map(r=>{let a=gi(r),l=r.events.length,h=r.events.slice(0,4).map(f=>f.own?ze.color:o.get(f.kid)?.color??q(0).color),u=`${we(r.date)}: ${l?`${l} ${l===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return p`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${u}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":de(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${h.length?h.map(f=>p`<span class="rd-dot" style="background:${f}"></span>`):p`<span class="rd-free">free</span>`}
            </span>
            ${a?p`<span class="rd-badge" aria-hidden="true">${a}</span>`:x}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return p`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${J`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=ce(e),o=G(e),s=re(e),r=n.map(a=>oe(e,a));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,l)=>J`<circle cx=${50+l*30} cy="80" r="11" fill=${s.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Ed(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let l=s.get(a);return p`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${ue(oe(e,a))}</span>
            <span class="qw-name">${oe(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${ue(Q(e,a))}</span>
            <span class="qw-name">${Q(e,a)}</span>
            <span class="qw-sub">No trips</span>
          </div>`)}
      </div>
      <ol class="qw-steps">
        <li>
          <span class="qw-num">1</span>
          <span><strong>Add it to the family calendar</strong>Start the title with who it’s for, and put the address in the event’s location so drive times come out right.</span>
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
      ${e.allDay.length>e.inline?p`<div class="day-strip" style="padding-left:${gt}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:x}`}renderStripChip(e,n,o){let s=p`<span class="strip-title">${n.title}</span>${n.note?p`<span class="strip-note">${n.note}</span>`:x}${n.notes?hr:x}`,r=n.pick,a=n.stay??n.canStay;return a?p`<button
        type="button"
        class="strip-chip ${n.stay?"hotel":"maybe"} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
        style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
        tabindex=${o?-1:0}
        data-note=${n.notes||x}
        aria-label=${`${n.title}: ${n.note}. ${n.stay?"Pick who’s staying":"Staying here? Pick who"}`}
        @click=${()=>this.openStayPick(e.date,a)}
      >
        ${s}
      </button>`:r?p`<button
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
        >`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,s=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(c=>!c.own&&c.event_id===o.event.event_id).map(c=>c.id):[]),r=c=>!!c&&!!n&&c.day===n.day&&s.has(c.event),a=e.dayHeads.find(c=>c.date===this.pinDay)??e.dayHeads[0],l=e.width,h=e.dayHeads[e.dayHeads.length-1],u=Math.max(e.height+8,192),f=100,b=[...e.links.map(c=>({t:"link",x:c,z:c.layer??0})),...e.preps.map(c=>({t:"prep",x:c,z:c.layer??f-1})),...e.cards.map(c=>({t:"card",x:c,z:c.layer??f})),...e.rides.map(c=>({t:"ride",x:c,z:c.layer??f+1}))].sort((c,y)=>c.z-y.z);return p`
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
        <div class="heads" style="width:${l}px">
          ${e.columns.map(c=>p`<div class="col-head ${c.kind} ${Pi(this.chores,c.id)?"leader":""}" style="left:${c.x}px;width:${c.w}px;--c:${c.dot};--rgb:${c.rgb}">
              <span class="avatar ${c.kind}" aria-hidden="true">${ue(c.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${c.name}</span>${this.renderScore(c.id)}</span>
                <span class="sub-row"
                  ><span class="sub ${c.subWarn?"warn":""}">${c.sub}</span>${c.kind==="kid"?this.renderLunchChip(c.id,!0):x}</span
                >
              </span>
            </div>`)}
        </div>
        ${a?p`<div class="pinned" aria-hidden="true" style="width:${l}px;height:${a.h}px;margin-bottom:${-a.h}px">
              ${this.renderHead(a,!0)}
            </div>`:x}
        <div class="canvas" style="width:${l}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(c=>p`<div
                class="col-bg ${c.kind}"
                style="left:${c.x}px;width:${c.w}px;height:${u}px;--rgb:${c.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${u}px"></span>
          ${h?p`<span class="empty board-end" style="top:${u+14}px">That’s everything through ${h.label}.</span>`:x}
          ${e.dayHeads.map(c=>p`<div class="day-head" style="top:${c.y}px;width:${l}px;height:${c.h}px">${this.renderHead(c)}</div>`)}
          ${e.empties.map(c=>p`<span class="empty" style="top:${c.y}px">${c.text}</span>`)}
          ${e.grid.map(c=>p`<div class="grid ${c.strong?"strong":""}" style="top:${c.y}px;width:${l-60}px"></div>`)}
          ${e.hours.map(c=>p`<span class="hour" style="top:${c.y}px">${c.label}</span>`)}
          ${Te(e.bands,c=>c.key,c=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px;background:rgba(${c.color.rgb},0.10);border-color:rgba(${c.color.rgb},0.45)"
              ></div>`)}
          ${Te(e.busy,c=>c.key,c=>p`<div class="busy" style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px">
                <span style="top:${c.labelY}px">${c.label}</span>
              </div>`)}
          ${Te(e.windows,c=>c.key,c=>p`<div class="window" aria-hidden="true" style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px">
                <span>${c.label}</span>
              </div>`)}
          ${Te(b,c=>c.x.key,c=>{if(c.t==="link"){let k=c.x;return p`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${k.x}px;top:${k.y}px;width:${k.w}px;height:${k.h}px;border-color:${k.color.color};background:linear-gradient(rgba(${k.color.rgb},0.11), rgba(${k.color.rgb},0.11)), var(--surface)"
                ></div>`}if(c.t==="prep"){let k=c.x;return p`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${k.x}px;top:${k.y}px;width:${k.w}px;height:${k.h}px;border-color:${k.color.color};background:linear-gradient(rgba(${k.color.rgb},0.11), rgba(${k.color.rgb},0.11)), var(--surface);color:${k.color.ink}"
                >
                  ${k.label}
                </div>`}if(c.t==="ride"){let k=c.x;return p`<button
                  type="button"
                  class="ride ${k.dashed?"dashed":""} ${k.clash?"clash":""} ${k.h>=120?"tall":""}"
                  aria-label=${k.aria}
                  style="left:${k.x}px;top:${k.y}px;width:${k.w}px;height:${k.h}px;padding-top:${3+(k.tuckTop??0)}px;padding-bottom:${3+(k.tuckBottom??0)}px"
                  @click=${()=>this.open(k.target)}
                >
                  <span class="l1">${k.l1}</span>${k.show2?p`<span class="l2" style="-webkit-line-clamp:${k.lines2}">${k.l2}</span>`:x}
                </button>`}let y=c.x,m=y.color,$=y.skipped?`repeating-linear-gradient(135deg, rgba(${m.rgb},0.10) 0px, rgba(${m.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:y.stayed?`repeating-linear-gradient(135deg, rgba(${m.rgb},0.24) 0px, rgba(${m.rgb},0.24) 6px, rgba(${m.rgb},0.08) 6px, rgba(${m.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${m.rgb},0.15), rgba(${m.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${y.wrap?"wrap":""} ${r(y.target)?"sel":""} ${y.clash?"clash":""} ${y.skipped?"skipped":""} ${y.cut?"cut":""} ${y.event.notes?"noted":""}"
                aria-label=${y.aria}
                data-note=${y.event.notes||x}
                style="left:${y.x}px;top:${y.y}px;width:${y.w}px;height:${y.h}px;background:${$};border-color:${y.clash?"var(--bad)":`rgba(${m.rgb},0.45)`};--c:${m.color};--rgb:${m.rgb};--ring:${m.color}"
                @click=${()=>this.open(y.target)}
              >
                ${y.event.notes?hr:x}
                <span class="top">
                  <span class="title">${y.title}</span>
                  <span class="time">${y.time}${y.inline&&y.drop?p`<span class="line tone-${y.drop.tone} inline"> · ${y.drop.text}</span>`:x}</span>
                  ${y.showDrop&&y.drop&&!y.inline?p`<span class="line tone-${y.drop.tone}">${y.drop.text}</span>`:x}
                </span>
                ${y.showPick&&y.pick?p`<span class="line tone-${y.pick.tone}">${y.pick.text}</span>`:x}
              </button>`})}
          ${Te(e.stays,c=>c.key,c=>p`<button
                type="button"
                class="stay ${c.cut?"cut":""}"
                style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px;border-color:${c.color.color};background:repeating-linear-gradient(135deg, rgba(${c.color.rgb},0.28) 0px, rgba(${c.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(c.target)}
              >
                <span class="l1" style="color:${c.color.ink}">${c.l1}</span><span class="l2">${c.l2}</span>
              </button>`)}
          ${Te(e.trips,c=>c.key,c=>p`<button
                type="button"
                class="trip ${c.bad?"bad":""} ${c.stops?"list":""} ${c.h>=120?"tall":""}"
                aria-label=${c.aria}
                style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px"
                @click=${()=>this.open(c.target)}
              >
                <span class="l1">${c.l1}${c.kids.map(y=>p`<span class="kid-dot" style="background:${y}"></span>`)}</span>
                ${c.show2?p`<span class="l2">${c.l2}</span>`:x}
                ${c.stops?c.stops.map(y=>p`<span class="stop ${y.warn?"warn":""}">${y.text}</span>`):x}
                ${c.show3?p`<span class="l3">${c.l3}</span>`:x}
              </button>`)}
          ${Te(e.overlaps,c=>c.key,c=>p`<div class="overlap" aria-hidden="true" style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px"></div>`)}
          ${Te(e.marks,c=>c.key,c=>p`<span class="mark" style="left:${c.x}px;top:${c.y}px;${c.right?"transform:translateX(-100%)":""}">${c.text}</span>`)}
          ${Te(e.folds,c=>c.key,c=>p`<div class="fold" style="top:${c.y}px;width:${l-60}px;height:${c.h}px" aria-hidden="true">
                ${Sd(l-60,c.h)}
              </div>
              <span class="fold-label" style="top:${c.y+c.h/2-9}px" title="${Re(c.from)} to ${Re(c.to)}">${c.label}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${l-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:x}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:s,later:r}=e,a=this.plan,l=s+n.length,h=this.chores,u=!!h&&!wi(h);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?x:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${u?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?p`<div class="attn-chores">${n.map(f=>this.renderChoreRow(f,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!s?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${J`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Zt(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:x}
      ${o.map(f=>p`<div class="issue ${f.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${f.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${f.pick?p`<button type="button" class="issue-title" @click=${()=>f.pick&&this.openForPick(f.pick.day,f.pick.id)}>${f.title}</button>`:f.target?p`<button type="button" class="issue-title" @click=${()=>this.open(f.target,!0)}>${f.title}</button>`:p`<strong class="issue-title">${f.title}</strong>`}
              <span class="issue-body"
                >${f.parts?f.parts.map(b=>typeof b=="string"?b:p`<button type="button" class="issue-link" @click=${()=>this.open(b.target,!0)}>${b.text}</button>`):f.body}</span
              >
            </div>
          </div>
          ${f.suggestions.length?p`<div class="fixes">
                ${f.suggestions.map(b=>p`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(b.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${b.id}`?"Saving…":b.label}</span>
                    <span class="fix-note">${b.note}</span>
                  </button>`)}
              </div>`:x}
        </div>`)}
      ${this.wide&&a&&!Zt(a)&&this.page==="rides"?this.renderLegend():x}
    `}kidColorOf(e){let n=this.plan?re(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(s=>s.id===e)??-1;return q(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,s=o?.kids.find(u=>u.id===e);if(!o||!s)return x;this.tick;let r=this.today(),a=_o(s,r.date,r.minutes,this.lunchDraft);if(!a)return x;let l=Xt[a.lunch],h=`${l} lunch ${a.when}${a.menu?`: ${a.menu}`:""}`;return p`<span class="lunch-chip ${a.lunch} ${n?"small":""}" title=${h}
      >${a.lunch==="bring"?fr:gr}<span class="lunch-chip-text"
        >${l}${n?x:` ${a.when}`}${!n&&a.menu?p`<span class="lunch-chip-menu"> · ${a.menu}</span>`:x}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=ko(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Ce(e.today),s=n.indexOf(o),r=u=>{let f=n[s+u];f&&(this.lunchMonth=f)},a=e.kids.some(u=>u.id===this.lunchKid)?this.lunchKid:null,l=a?e.kids.filter(u=>u.id===a):e.kids,h=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:x;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${s<=0} @click=${()=>r(-1)}>
            ${J`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Pn(o)}</h2>
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
          ${this.menuMode?"Done":p`${pr} Edit menus`}
        </button>
      </div>
      ${h}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${l.length}">
        ${l.map(u=>this.renderLunchCard(e,u,o,a!==null))}
      </div>
      <p class="message-aside">
        Each day’s lunch is an all-day event on the lunch calendar that starts with the kid’s name, like
        <strong>${e.kids[0]?.name??"Ava"} Lunch: Pizza</strong>, with the rest of the menu in its notes and the Bring
        or Buy pick at the end. Menus can
        come from the school’s menu feed (set in Home Assistant under MyDashLight’s options, Lunch), a calendar file
        imported once a month, or <strong>Edit menus</strong> here.
        Days off come from <strong>No School</strong> all-day events on the family calendar. A day nobody picked gets the kid’s default, set in
        Home Assistant under MyDashLight’s options. For a Pack lunch reminder, add a School days chore set to
        <strong>Only on Bring lunch days</strong>.
      </p>
    </div>`}renderLunchCard(e,n,o,s){let r=this.kidColorOf(n.id),a=To(e,n,o,this.lunchDraft),l=Co(a),h=a.flat(),u=h.filter(m=>!m.outside&&!m.past&&m.lunch),f=n.days_off.filter(m=>Ce(m.first)<=o&&o<=Ce(m.last)),b=m=>u.filter($=>_n($.date)===m),c=m=>{let $=b(m);if(!$.length)return;let k=$.every(g=>g.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(g=>g.date),k)},y=u.length?`${l.bring} Bring · ${l.buy} Buy${o===Ce(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${s?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${ue(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${y}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Xt[n.default]} unless picked</span>
          ${e.kids.length<2?x:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${s?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=s?null:n.id}
              >
                ${s?$d:wd}${s?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:x}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${Pn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((m,$)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!b($).length}
            aria-label=${`${b($).every(k=>k.lunch==="bring")?"Buy":"Bring"} every ${m} left in ${Pn(o)} for ${n.name}`}
            @click=${()=>c($)}
          >
            ${m}
          </button>`)}
        ${h.map(m=>this.renderLunchCell(n,m,s))}
      </div>
      ${f.length?p`<p class="lunch-offs">
            No school:
            ${f.map(m=>{let $=m.first<`${o}-01`?`${o}-01`:m.first,k=Ce(m.last)>o?yt(`${Si(o)}-01`,-1):m.last;return`${$===k?Xi($):`${Xi($)}–${Xi(k)}`} ${Eo(m.title)}`}).join(" · ")}
          </p>`:x}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return p`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let s=n.lunch,r=s==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",l=this.menuMode,h=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),u=l?`${e.name}, ${we(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${we(n.date)}: ${Xt[s]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Xt[r]}.`;return p`<button
      type="button"
      class="lunch-day ${s} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${l?"editing":""} ${h?"sel":""}"
      ?disabled=${n.past&&!l}
      aria-label=${u}
      @click=${()=>l?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${s==="bring"?fr:gr}${Xt[s]}</span>
      ${n.menu?p`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?p`<span class="lunch-sides">${n.sides}</span>`:x}`:l?p`<span class="lunch-menu add">${On} Menu</span>`:x}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,s=this.choreDone(e),r=o.kids.findIndex(E=>E.id===e.kid),a=(this.plan?re(this.plan).get(e.kid):void 0)??q(Math.max(0,r)),l=o.kids[r]?.name??"",h=this.choreDraft.get(e.id),u=h===void 0||mr(e,h)?e:{...e,state:h===!1?"open":h===!0?"done":h,done_at:h===!1?null:new Date().toISOString()},f=s&&u.done_by&&u.done_by!==e.kid?o.people?.find(E=>E.id===u.done_by)?.name??u.done_by_name??null:null,b=`${En(u,o.today,o.time_zone)}${f?` · by ${f}`:""}`,c=s||po(e),y=s?this.pointsFlash.get(e.id):void 0,m=`${n?`${l}: `:""}${e.title}. ${b?`${b}. `:""}${y?`Earned ${Ie(y)}. `:""}${s?"Done.":"Tap when it’s done."}`,$=p`<span class="box" aria-hidden="true"
        >${s?J`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d=${vt(u.state)?"M6 12h12":"M5 12.5l4.5 4.5L19 7.5"}/></svg>`:x}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:x}
      <span class="chore-text">
        <span class="chore-title">${n?p`<span class="chore-kid">${l}</span> · `:x}${e.title}</span>
        ${b?p`<span class="chore-note">${b}</span>`:x}
      </span>
      ${y?p`<span class="pts-flash" aria-hidden="true">+${Ie(y)}</span>`:x}`,k=`chore ${s?"done":""} ${vt(u.state)?"skipped":""} ${e.state==="overdue"&&!s?"overdue":""} ${c?"":"later"}`,g=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return c?p`<button type="button" class=${k} style=${g} aria-pressed=${s?"true":"false"} aria-label=${m} @click=${()=>this.tapChore(e)}>
          ${$}
        </button>`:p`<div class=${k} style=${g}>${$}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(wi(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${On} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:x;this.tick;let s=fo(e,this.plan?re(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">${this.totals?`Points from the last ${e.points?.days??7} days, out of what each kid’s own chores were worth.`:"Tap a chore when it’s done."}</span>
        ${e.points?p`<button type="button" class="btn ${this.totals?"dark":""}" aria-pressed=${this.totals?"true":"false"} @click=${()=>{this.closeChorePanels(),this.flipUntil=Date.now()+400,this.totals=!this.totals}}>${this.totals?"Back to chores":p`${yd} Points this week`}</button>`:x}
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${On} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${pr} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols ${Date.now()<this.flipUntil?"flip":""}" style="--n:${s.length}">
        ${s.map(r=>{let a=r.overdue.filter(l=>!this.choreDone(l)).length+r.now.filter(l=>!this.choreDone(l)).length;return p`<section class="chore-col ${Pi(e,r.kid)?"leader":""}" style="--c:${r.color.color};--rgb:${r.color.rgb};--k:${r.color.ink}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${ue(r.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${r.name}</span>${this.renderScore(r.kid,this.totals)}</span>
                <span class="sub-row"
                  ><span class="sub">${this.totals?Md(yi(e,r.kid).length):a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span
                  >${this.renderLunchChip(r.kid)}</span
                >
              </span>
            </div>
            ${this.totals?this.renderPointsLog(e,r.kid):this.renderChoreList(e,r)}
          </section>`})}
      </div>
    </div>`}renderChoreList(e,n){return p`<div class="chore-list">
            ${n.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${n.overdue.map(o=>this.renderChoreRow(o))}`:x}
            ${n.now.length?p`<h3 class="chore-group">To do</h3>
                  ${n.now.map(o=>this.renderChoreRow(o))}`:x}
            ${n.done.length?p`<h3 class="chore-group">Done</h3>
                  ${n.done.map(o=>this.renderChoreRow(o))}`:x}
            ${n.later.map(o=>p`<h3 class="chore-group">${o.date===e.today?"Later today":Td(o.date,e.today)}</h3>
                ${o.chores.map(s=>this.renderChoreRow(s))}`)}
            ${!n.overdue.length&&!n.now.length&&!n.done.length&&!n.later.length?p`<p class="chore-none">No chores this week.</p>`:x}
          </div>`}renderPointsLog(e,n){let o=yi(e,n);return p`<div class="points-log">
      ${o.length?o.map(s=>p`<div class="log-row ${s.points?"":"nothing"}">
              ${s.icon?p`<span class="chore-icon" aria-hidden="true">${s.icon}</span>`:p`<span class="chore-icon"></span>`}
              <span class="chore-text">
                <span class="chore-title">${s.title}</span>
                <span class="chore-note">${ao(s,e)}</span>
              </span>
              <span class="log-pts">${s.points?`+${Ie(s.points)}`:"0"}</span>
            </div>`):p`<p class="chore-none">No chores done in the last ${e.points?.days??7} days.</p>`}
    </div>`}renderWeeklyPoints(e){let n=xo(e.templates,e.kids.map(s=>s.id),e.points?.default??1),o=this.plan?re(this.plan):void 0;return p`<section class="week-points" aria-label="Points a week">
      <span class="week-points-label">Points available per week</span>
      ${e.kids.map((s,r)=>{let a=o?.get(s.id)??q(r);return p`<span class="week-kid" style="--c:${a.color};--rgb:${a.rgb}"
          ><span class="avatar" aria-hidden="true">${ue(s.name)}</span>${s.name} <strong>${Ie(n[s.id]??0)}</strong></span
        >`})}
    </section>`}renderTemplateRow(e){let n=this.chores,o=n.kids,s=this.plan?re(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(_i).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${Ci(e.who,o,e.take_turns)} · ${Ei(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}${n.points?` · ${br(e.points??n.points.default)}`:""}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:x}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let h=o.findIndex(f=>f.id===l),u=s?.get(l)??q(Math.max(0,h));return p`<span class="kid-dot" style="background:${u.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${On} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.points&&e.templates.length?this.renderWeeklyPoints(e):x}
      ${e.templates.length?n.map(([o,s])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?p`<section class="manage-group" aria-label=${s}>
                  <h3 class="chore-group">${s}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:x}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return p``;let o=n.kids,s=this.plan?re(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(m=>m.id===e.template):void 0,l=ki(e),h=(a?.problems??[]).filter(m=>m!=="who:"),u=(m,$,k,g=!1)=>p`<button type="button" class="choice ${g?"wide":""}" aria-pressed=${m?"true":"false"} ?disabled=${r} @click=${k}>${$}</button>`,f=(m,$,k,g)=>p`<button type="button" class="chip" aria-pressed=${m?"true":"false"} aria-label=${g??x} ?disabled=${r} @click=${k}>${$}</button>`,b=m=>{m!==e.repeats&&this.changeDraft({repeats:m,days:a&&a.repeats===m?a.days??Wt(m):Wt(m)})},c=m=>{let $=e.who.includes(m)?e.who.filter(k=>k!==m):o.filter(k=>k.id===m||e.who.includes(k.id)).map(k=>k.id);this.changeDraft({who:$})},y;if(e.repeats==="school"){let m=e.days===it?new Set:e.days===""?new Set([0,1,2,3,4]):Ut(e.days)??new Set,$=k=>{let g=new Set(m);g.has(k)?g.delete(k):g.add(k),this.changeDraft({days:g.size===5?"":g.size?$i(g):it})};y=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${nt.slice(0,5).map((k,g)=>f(m.has(g),k.slice(0,2),()=>$(g),k))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event for the kid on the family calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${u(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${u(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Shows from the evening before each school day. Still on time that morning.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${u(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let m=e.days.trim(),$=/^\d+$/.test(m)?Number(m):null,k=m&&m.toLowerCase()!=="any"&&m.toLowerCase()!=="last"&&$===null;y=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${k?4:3}, minmax(0, 1fr))">
          ${u(m===""||m.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${u($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${u(m.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${k?u(!0,m,()=>{}):x}
        </div>
        ${$!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${Ti($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${m.toLowerCase()==="last"?"Due on the month’s last day.":k?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")y=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let m=e.days===""||e.days.toLowerCase()==="any",$=e.days===it?new Set:m?new Set:Ut(e.days)??new Set,k=g=>{let E=new Set($);E.has(g)?E.delete(g):E.add(g),this.changeDraft({days:E.size?$i(E)||"Mon-Sun":it})};y=p`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${u(m,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${u(!m,"On set days",()=>this.changeDraft({days:m?"Sat":e.days}))}
        </div>
        ${m?p`<p class="field-hint">Shows all week, due on Sunday.</p>`:p`<div role="group" aria-label="Days of the week" class="day-chips">
                ${nt.map((g,E)=>f($.has(E),g.slice(0,2),()=>k(E),g))}
              </div>
              <div class="chips">
                ${f(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${f(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:x}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Ci(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===it?"No days picked":Ei(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${h.length?p`<p class="field-hint bad">${h.map(_i).join(". ")}. Saving fixes it.</p>`:x}
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
          ${ur.map(m=>f(e.icon===m,m,()=>this.changeDraft({icon:e.icon===m?null:m}),`Picture ${m}`))}
          ${e.icon&&!ur.includes(e.icon)?f(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):x}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${xd}
              @emoji-click=${m=>{let $=m.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:x}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((m,$)=>{let k=s?.get(m.id)??q($),g=e.who.includes(m.id);return p`<button type="button" class="who-chip" style="--c:${k.color};--rgb:${k.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${()=>c(m.id)}>
              <span class="avatar" aria-hidden="true">${ue(m.name)}</span>${m.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${u(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${u(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:x}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${u(e.repeats==="daily","Every day",()=>b("daily"))}
          ${u(e.repeats==="weekly","Every week",()=>b("weekly"))}
          ${u(e.repeats==="monthly","Every month",()=>b("monthly"))}
          ${u(e.repeats==="school","School days",()=>b("school"))}
        </div>
      </div>
      ${y}
      ${e.repeats==="school"?x:p`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${kd(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-points">Points <span class="field-hint">For doing it on time</span></label>
        <input
          id="chore-points"
          class="text-input points-input"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          placeholder=${String(n.points?.default??1)}
          .value=${e.points===null?"":String(e.points)}
          ?disabled=${r}
          @input=${m=>{let $=m.target,k=yo($.value);$.value=k===null?"":String(k),this.changeDraft({points:k})}}
        />
        <p class="field-hint">Blank uses the default from Configure › Chore points.</p>
      </div>
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
            </button>`:x}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return p``;let o=e.busy,s=u=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...u})},r=u=>s({kids:e.kids.includes(u)?e.kids.filter(f=>f!==u):[...e.kids,u]}),a=n.kids.filter(u=>Kt(u,e.date)),l=e.dish.trim(),h=e.kids.length?l?null:"Type what’s served":"Pick who gets this menu";return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${we(e.date)}</span>
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
          ${a.map(u=>{let f=this.kidColorOf(u.id),b=e.kids.includes(u.id);return p`<button type="button" class="who-chip" style="--c:${f.color};--rgb:${f.rgb}" aria-pressed=${b?"true":"false"} ?disabled=${o} @click=${()=>r(u.id)}>
              <span class="avatar" aria-hidden="true">${ue(u.name)}</span>${u.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${l||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:x}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!h} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":h??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return p``;if(this.choreDone(e))return this.renderDoneChore(e,n);let o=n.people?.length?n.people:n.kids.map(f=>({...f,role:"kid"})),s=n.kids.findIndex(f=>f.id===e.kid),r=n.kids[s],a=this.plan?re(this.plan):void 0,l=a?.get(e.kid)??q(Math.max(0,s)),h=o.filter(f=>f.id!==e.kid),u=f=>{let b=n.kids.findIndex(c=>c.id===f.id);return b>=0?(a?.get(f.id)??q(b)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:x}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${En(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${ue(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${h.map(f=>p`<button type="button" class="done-by" style="--c:${u(f)}" @click=${()=>void this.toggleChore(e,f.id)}>
                  <span class="avatar ${f.role==="parent"?"driver":""}" aria-hidden="true">${ue(f.name)}</span>
                  <span>${f.name}</span>
                </button>`)}
            </div>`:p`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
      <div class="field">
        <span class="field-label">Not done?</span>
        <div role="group" aria-label="Not done" class="choices skip-choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" @click=${()=>void this.toggleChore(e,void 0,"skipped")}>Skipped</button>
          <button type="button" class="choice" @click=${()=>void this.toggleChore(e,void 0,"excused")}>Excused (sick, away)</button>
        </div>
        <p class="field-hint">Takes it off the list with no points. Skipped counts as missed; excused doesn’t.</p>
      </div>
    `}renderDoneChore(e,n){let o=n.kids.find(l=>l.id===e.kid),s=e.done_by&&e.done_by!==e.kid?n.people?.find(l=>l.id===e.done_by)?.name??e.done_by_name:null,r=`${En(e,n.today,n.time_zone)}${s?` · by ${s}`:""}`,a=!vt(e.state)&&e.earned!=null?` · ${br(e.earned)}`:"";return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:x}${e.title}</span>
          <span class="ed-meta">${o?.name??""} · ${r}${a}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Close</button>
      </div>
      <div class="field">
        <span class="field-label">Not done after all?</span>
        <button type="button" class="choice wide" @click=${()=>void this.toggleChore(e)}>Mark not done</button>
        <p class="field-hint">Puts it back on the list to do${e.earned?", and takes off its points":""}.</p>
      </div>
    `}renderLegend(){return p`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let o=Ft(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${R(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${R(n.start)} to ${R(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let s=n.along.map(r=>G(e).includes(r)?Q(e,r):oe(e,r));return`${o} drives there and back${s.length?`, with ${mt(s)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:o,event:s}=n,r=G(e),a=Xs(e,s),l=Ft(e,s),h=!!this.pending,u=v=>this.pending?.key===v?this.pending.value:void 0,f=[...e.people?.carpools??[]];for(let v of e.days)for(let S of v.events)for(let P of[S.drop,S.pick])P&&P!=="none"&&!r.includes(P)&&!f.some(_=>_.toLowerCase()===P.toLowerCase())&&f.push(P);let b=new Set(e.days.flatMap(v=>v.events.filter(S=>S.title===s.title).flatMap(S=>[S.drop,S.pick].map(P=>(P??"").toLowerCase()))));f.sort((v,S)=>Number(b.has(S.toLowerCase()))-Number(b.has(v.toLowerCase())));let c=v=>{if(!s.sides.includes(v))return x;let S=u(v)??u("both"),P=v==="drop"?s.drop:s.pick,_=S!==void 0?String(S):s.no_ride_unless_named&&P==="none"?"":P,B=_===""&&!(S===void 0&&s.no_ride_unless_named),L=_&&_!=="none"&&!r.includes(_)?_:"",se=I=>{this.otherOpen=null,this.setRide(s,v,_===I?"":I,r)},H=[...r.map(I=>[I,ui(e,I)]),["none","Not needed"]],C=`${s.id}|${v}`,N=this.otherOpen===C;return p`<div class="field ride-box">
        <span class="field-label">${v==="drop"?"Drop-off":"Pick-up"} ${B?p`<span class="nobody">· nobody yet</span>`:x}</span>
        <div role="group" aria-label=${v==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${H.length+1}, minmax(0, 1fr))">
          ${H.map(([I,xe])=>p`<button type="button" class="choice" aria-pressed=${_===I?"true":"false"} ?disabled=${h} @click=${()=>se(I)}>
                ${xe}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${L?"true":"false"}
            aria-expanded=${N?"true":"false"}
            ?disabled=${h}
            @click=${()=>this.otherOpen=N?null:C}
          >
            ${L||"Other"}
          </button>
        </div>
        ${N?p`${f.length?p`<div role="group" aria-label=${v==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${f.map(I=>p`<button type="button" class="chip" aria-pressed=${_.toLowerCase()===I.toLowerCase()?"true":"false"} ?disabled=${h} @click=${()=>se(I)}>
                    ${I}
                  </button>`)}
            </div>`:x}
        <input
          type="text"
          .value=${L&&!f.some(I=>I.toLowerCase()===L.toLowerCase())?L:""}
          ?disabled=${h}
          aria-label=${v==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${I=>{let xe=I.target.value.trim();xe&&xe!==_&&se(xe)}}
          @keydown=${I=>{I.key==="Enter"&&I.target.blur()}}
        />`:x}
        ${!g&&_!==""&&_!=="none"?y(v,_):x}
      </div>`},y=(v,S)=>{let P=u(`along-${v}`),_=P!==void 0?P:v==="pick"?s.pick_along??[]:s.along,B=new Set(o.events.filter(H=>H.event_id===s.event_id&&!H.own).map(H=>H.kid)),L=[...ce(e).filter(H=>H!==s.kid&&!B.has(H)),...r.filter(H=>H!==S)];return L.length?p`<div class="field-sub">
        <span class="field-label">${v==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${v==="pick"?"Coming home too. Anyone already there just gets in.":v==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${v==="drop"?"Riding along on the drop-off":v==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="who-chips">
          ${L.map(H=>{let C=r.includes(H),N=C?Q(e,H):oe(e,H),I=C?ze:re(e).get(H)??q(0);return p`<button
              type="button"
              class="who-chip"
              style="--c:${I.color};--rgb:${I.rgb}"
              aria-pressed=${_.includes(H)?"true":"false"}
              ?disabled=${h}
              @click=${()=>this.toggleAlong(s,H,v)}
            >
              <span class="avatar ${C?"driver":""}" aria-hidden="true">${ue(N)}</span>${N}
            </button>`})}
        </div>
      </div>`:x},m=r.includes(s.drop)?s.drop:r.includes(s.pick)?s.pick:"",$=s.drop===s.pick&&r.includes(s.drop),k=u("stay"),g=k!==void 0?!!k:s.stay&&$,E=u("along"),D=E!==void 0?E:s.along,O=s.own?[...ce(e),...r.filter(v=>v!==s.own)]:[],Y=s.own!=null&&s.takes!=null,fe=s.own!=null&&!Y,U=u("takes"),ae=U!==void 0?U:s.takes??null,ye=u("arrive"),Fe=this.arriveDraft!==void 0?this.arriveDraft:ye!==void 0?ye:s.arrive_by,$e=u("leave"),Ue=this.leaveDraft!==void 0?this.leaveDraft:$e!==void 0?$e:s.leave_by??null,ge=(v,S)=>{let P=v==="arrive",_=P?s.start:s.end,B=se=>()=>P?this.nudgeArrive(s,se):this.nudgeLeave(s,se),L=(se,H,C,N)=>p`<button
          type="button"
          class="step"
          aria-label=${H}
          ?disabled=${h||N}
          @pointerdown=${()=>this.startHold(B(se))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(B(se))}
        >
          ${C}
        </button>`;return p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${P?"Arrive":"Leave"}</span>
          <span class="field-hint">${pn(S-_)}</span>
        </span>
        <span class="stepper">
          ${L(-5,"Five minutes earlier","−",!P&&S-5<=s.start)}
          <span class="arrive-value">${R(S)}</span>
          ${L(5,"Five minutes later","+",!1)}
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
      </div>`},Oe=s.sides.includes("pick")||s.own!=null,Be=Fe!=null||this.timesOpen.arrive,Ne=Oe&&(Ue!=null||this.timesOpen.leave),Pe=v=>()=>{this.timesOpen={...this.timesOpen,[v]:!0}},lt=()=>p`${Be?ge("arrive",Fe??s.start):x}
      ${Ne?ge("leave",Ue??s.end):x}
      ${!Be||!Ne&&Oe?p`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${Be?x:p`<button type="button" class="chip" ?disabled=${h} @click=${Pe("arrive")}>Arrive early or late</button>`}
              ${!Ne&&Oe?p`<button type="button" class="chip" ?disabled=${h} @click=${Pe("leave")}>Leave early or late</button>`:x}
            </div>
          </div>`:x}`,We=s.sides.includes("drop")&&s.sides.includes("pick"),Se=We&&(g||this.stayDraft===s.id),Me=()=>{let v=We?p`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${Se?"false":"true"}
              ?disabled=${h}
              @click=${()=>{this.stayDraft=null,s.stay&&this.toggleStay(s,!1,m)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${Se?"true":"false"}
              ?disabled=${h}
              @click=${()=>{m?this.toggleStay(s,!0,m):this.stayDraft=s.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:x;if(!Se)return p`${v} ${c("drop")} ${c("pick")}`;let S=g&&$?s.drop:"";return p`${v}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${S?x:p`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(P=>p`<button
                type="button"
                class="choice"
                aria-pressed=${S===P?"true":"false"}
                ?disabled=${h}
                @click=${()=>{if(S===P||!this.backend)return;let _=this.backend;this.stayDraft=null,this.save("stay",!0,()=>_.setRide(s.id,"both",P,this.scope,!0))}}
              >
                ${Q(e,P)}
              </button>`)}
          </div>
          ${S?y("both",S):x}
        </div>`},ie=[],ee=v=>v==="none"?"Not needed":ui(e,v),be=v=>r.includes(v)?Q(e,v):oe(e,v),he=(v,S,P)=>{S===""&&!P.length||ie.push(`${v}: ${[S===""?"TBD":ee(S),...P.map(be)].join(", ")}`)},Ke=v=>s.no_ride_unless_named&&v==="none"?"":v;s.own||he("Drop-off",Ke(s.drop),s.along),s.own||he("Pick-up",Ke(s.pick),s.pick_along??[]),!s.own&&s.stay&&ie.push("Stay: yes"),Y&&ie.push(`Takes: ${s.takes} min`),s.own&&s.along.length&&ie.push(`Take along: ${s.along.map(be).join(", ")}`),s.arrive_by!=null&&s.arrive_by!==s.start&&ie.push(`Arrive: ${pn(s.arrive_by-s.start)}`),s.leave_by!=null&&s.leave_by!==s.end&&ie.push(`Leave: ${pn(s.leave_by-s.end)}`);let Ge=u("attending"),pe=Ge!==void 0?!!Ge:s.attending!==!1;s.attending===!1&&ie.splice(0,ie.length,"Attending: no");let d=o.date===this.today().date?"":`${de(o.date)} · `,w=Tn(s),T=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${l} · ${s.title}</span>
          <span class="ed-meta">${d}${Y?"any time ":""}${w}${s.place_name&&!s.place.startsWith("?")?` · ${s.place_name}`:""}</span>
          ${this.renderForLine(e,o,s)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(s.busy_only){let v=s.place_name&&s.place_name!==s.title?s.place_name:"",S=s.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":s.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return p`${T}
        ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
        ${v?p`<div class="field"><span class="field-label">Where</span><span class="field-hint">${v}</span></div>`:x}
        <p class="field-hint">
          ${pe?`This blocks ${l}’s time: ${l} can’t drive then, so a ride that needs ${l} shows as a problem.`:`Not going, so it doesn’t block ${l}’s time, and ${l} can drive then.`}
          ${S}
        </p>
        <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!pe)}>
          ${pe?`${l} isn’t going this time`:`${l} is going after all`}
        </button>
        ${s.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:x}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${s.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return s.where==="home"?p`${T}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${l} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${T}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
      ${s.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${de(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:x}
      ${pe?p`${s.where==="anywhere"?p`<p class="field-hint">
                  ${s.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:x}
            ${s.own?p`<p class="field-hint">${this.ownHint(e,s)}</p>`:Me()}
      ${s.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${ae!=null?`Takes ${ae} min, any time ${R(s.start)}–${R(s.end)}`:"At its set time"}</span>
            </span>
            ${ae!=null?p`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${h||ae<=5} @click=${()=>this.setTakes(s,Math.max(5,ae-5))}>−</button>
                  <span class="arrive-value">${ae} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${h||ae+5>s.end-s.start} @click=${()=>this.setTakes(s,ae+5)}>+</button>
                </span>`:x}
          </div>
          <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setTakes(s,ae!=null?null:Math.min(10,Math.max(5,s.end-s.start)))}>
            ${ae!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:x}
      ${fe&&O.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${O.map(v=>p`<button type="button" class="chip" aria-pressed=${D.includes(v)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,v)}>
                  ${r.includes(v)?Q(e,v):oe(e,v)}
                </button>`)}
            </div>
          </div>`:x}
      ${Y?x:lt()}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${l} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!pe)}>
        ${pe?`${l} isn’t going this time`:`${l} is going after all`}
      </button>
      ${s.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:x}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${ie.length?ie.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${pe&&!s.own?p`<p class="field-hint">Tap a selected driver again to clear it.</p>`:x}
    `}};Jt.styles=So,Jt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},problemOpen:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},timesOpen:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},pointsFlash:{state:!0},manage:{state:!0},totals:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Jt);function Sd(i,t){let o=Math.max(1,Math.round(i/14)),s=i/o,r=[],a=[];for(let h=0;h<=o;h++){let u=+(h*s).toFixed(1);r.push(`${u},${h%2?5:0}`),a.push(`${u},${t-(h%2?0:5)}`)}let l=`M${r.join(" L")} L${[...a].reverse().join(" L")} Z`;return p`<svg width=${i} height=${t} viewBox="0 0 ${i} ${t}">
    ${J`<path class="fold-fill" d=${l}></path>
      <path class="fold-edge" d=${`M${r.join(" L")}`}></path>
      <path class="fold-edge" d=${`M${a.join(" L")}`}></path>`}
  </svg>`}function mr(i,t){return t===!1?!bt(i):t===!0?bt(i)&&!vt(i.state):i.state===t}function Md(i){return`${i} ${i===1?"chore":"chores"} done`}function br(i){return`${Ie(i)} ${i===1?"point":"points"}`}var Qt=class extends ve{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=$s(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(Lt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new fn(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return p`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?p`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:x}`}};Qt.styles=qe`
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
  `,Qt.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",Qt);
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
