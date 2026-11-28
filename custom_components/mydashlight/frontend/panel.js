var wr=Object.defineProperty;var Fn=(s,t)=>()=>(s&&(t=s(s=0)),t);var $r=(s,t)=>{for(var e in t)wr(s,e,{get:t[e],enumerable:!0})};function Mn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function As(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Ua(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Do(s){return Ua(s,t=>t.unicode)}function Wa(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[a,l]]of Object.entries(o))i.createIndex(r,a,{multiEntry:l});return i}t($t),t(rt,ja,{[Ro]:[Ia,!0],[Io]:[[Oa,Ba]],[jo]:[Na,!0]}),t(zs,void 0,{[zo]:[""]})}function Oo(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Ka(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,Ra);Ls[s]=o,o.onupgradeneeded=i=>{i.oldVersion<za&&Wa(o.result)},Oo(e,n,o)});return t.onclose=()=>js(s),t}function Ga(s){return Dn[s]||(Dn[s]=Ka(s)),Dn[s]}function je(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(h=>r.objectStore(h)),l;n(a,r,h=>{l=h}),r.oncomplete=()=>o(l),r.onerror=()=>i(r.error)})}function js(s){let t=Ls[s],e=t&&t.result;if(e){e.close();let n=Rn[s];if(n)for(let o of n)o()}delete Ls[s],delete Dn[s],delete Rn[s]}function Va(s){return new Promise((t,e)=>{js(s);let n=indexedDB.deleteDatabase(s);Oo(t,e,n)})}function qa(s,t){let e=Rn[s];e||(e=Rn[s]=[]),e.push(t)}function wt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||Ya.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Bo(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Xa)}function Za(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:a,tags:l,emoji:h,version:u})=>{let f=[...new Set(Bo([...(r||[]).map(wt).flat(),...(l||[]).map(wt).flat(),...wt(e),n]))].sort(),b={annotation:e,group:o,order:i,tags:l,tokens:f,unicode:h,version:u};if(n&&(b.emoticon=n),r&&(b.shortcodes=r),a){b.skinTones=[],b.skinUnicodes=[],b.skinVersions=[];for(let{tone:c,emoji:y,version:m}of a)b.skinTones.push(c),b.skinUnicodes.push(y),b.skinVersions.push(m)}return b})}function No(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function ot(s,t,e){No(s,"get",t,e)}function Ho(s,t,e){No(s,"getAll",t,e)}function Os(s){s.commit&&s.commit()}function Ja(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function Fo(s,t){let e=Ja(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Qa(s){return!await Bs(s,$t,Ln)}async function el(s,t,e){let[n,o]=await Promise.all([Ds,Ln].map(i=>Bs(s,$t,i)));return n===e&&o===t}async function tl(s,t){return je(s,rt,Tt,(n,o,i)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=l=>{let h=l.target.result;for(let u of h)if(r=u.unicode,t(u))return i(u);if(h.length<50)return i();a()}};a()})}async function Uo(s,t,e,n){try{let o=Za(t);await je(s,[rt,$t],Is,([i,r],a)=>{let l,h,u=0;function f(){++u===2&&b()}function b(){if(!(l===n&&h===e)){i.clear();for(let c of o)i.put(c);r.put(n,Ds),r.put(e,Ln),Os(a)}}ot(r,Ds,c=>{l=c,f()}),ot(r,Ln,c=>{h=c,f()})})}finally{}}async function nl(s,t){return je(s,rt,Tt,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Ho(e.index(Io),i,o)})}async function Wo(s,t){let e=Bo(wt(t));return e.length?je(s,rt,Tt,(n,o,i)=>{let r=[],a=()=>{r.length===e.length&&l()},l=()=>{let h=Fo(r,u=>u.unicode);i(h.sort((u,f)=>u.order<f.order?-1:1))};for(let h=0;h<e.length;h++){let u=e[h],f=h===e.length-1?IDBKeyRange.bound(u,u+"￿",!1,!0):IDBKeyRange.only(u);Ho(n.index(Ro),f,b=>{r.push(b),a()})}}):[]}async function sl(s,t){let e=await Wo(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await tl(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function il(s,t){return je(s,rt,Tt,(e,n,o)=>ot(e,t,i=>{if(i)return o(i);ot(e.index(jo),t,r=>o(r||null))}))}function Bs(s,t,e){return je(s,t,Tt,(n,o,i)=>ot(n,e,i))}function ol(s,t,e,n){return je(s,t,Is,(o,i)=>{o.put(n,e),Os(i)})}function rl(s,t){return je(s,zs,Is,(e,n)=>ot(e,t,o=>{e.put((o||0)+1,t),Os(n)}))}function al(s,t,e){return e===0?[]:je(s,[zs,rt],Tt,([n,o],i,r)=>{let a=[];n.index(zo).openCursor(void 0,"prev").onsuccess=l=>{let h=l.target.result;if(!h)return r(a);function u(c){if(a.push(c),a.length===e)return r(a);h.continue()}let f=h.primaryKey,b=t.byName(f);if(b)return u(b);ot(o,f,c=>{if(c)return u(c);h.continue()})}})}function ll(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let a=e;for(let h=0;h<r.length;h++){let u=r.charAt(h),f=a.get(u);f||(f=new Map,a.set(u,f)),a=f}let l=a.get(An);l||(l=[],a.set(An,l)),l.push(o)}}return(o,i)=>{let r=e;for(let h=0;h<o.length;h++){let u=o.charAt(h),f=r.get(u);if(f)r=f;else return[]}if(i)return r.get(An)||[];let a=[],l=[r];for(;l.length;){let u=[...l.shift().entries()].sort((f,b)=>f[0]<b[0]?-1:1);for(let[f,b]of u)f===An?a.push(...b):l.push(b)}return a}}function cl(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||dl.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function Lo(s){cl(s);let t=(b,c)=>b.name.toLowerCase()<c.name.toLowerCase()?-1:1,e=s.sort(t),o=ll(s,b=>{let c=new Set;if(b.shortcodes)for(let y of b.shortcodes)for(let m of wt(y))c.add(m);return c}),i=b=>o(b,!0),r=b=>o(b,!1),a=b=>{let c=wt(b),y=c.map((m,$)=>($<c.length-1?i:r)(m));return Fo(y,m=>m.name).sort(t)},l=new Map,h=new Map;for(let b of s){h.set(b.name.toLowerCase(),b);for(let c of b.shortcodes||[])l.set(c.toLowerCase(),b)}return{all:e,search:a,byShortcode:b=>l.get(b.toLowerCase()),byName:b=>h.get(b.toLowerCase())}}function qt(s){if(!s)return s;if(hl&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Ko(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function ul(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||pl.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function Go(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function fl(s){let t=await fetch(s,{method:"HEAD"});Go(t,s);let e=t.headers.get("etag");return Ko(e),e}async function Rs(s){let t=await fetch(s);Go(t,s);let e=t.headers.get("etag");Ko(e);let n=await t.json();return ul(n),[e,n]}function gl(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function ml(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function Vo(s){let t=JSON.stringify(s),e=ml(t),n=await crypto.subtle.digest("SHA-1",e),o=gl(n);return btoa(o)}async function bl(s,t){let e,n=await fl(t);if(!n){let o=await Rs(t);n=o[0],e=o[1],n||(n=await Vo(e))}await el(s,t,n)||(e||(e=(await Rs(t))[1]),await Uo(s,e,t,n))}async function vl(s,t){let[e,n]=await Rs(t);e||(e=await Vo(n)),await Uo(s,n,t,e)}async function yl(s,t){try{await bl(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var Ra,za,rt,$t,zs,Ia,Ro,ja,zo,Oa,Ba,Io,Ds,Ln,Ao,Tt,Is,jo,Na,Ha,Fa,Ls,Dn,Rn,Ya,Xa,An,dl,hl,pl,kt,Ns=Fn(()=>{Ra=1,za=1,rt="emoji",$t="keyvalue",zs="favorites",Ia="tokens",Ro="tokens",ja="unicode",zo="count",Oa="group",Ba="order",Io="group-order",Ds="eTag",Ln="url",Ao="skinTone",Tt="readonly",Is="readwrite",jo="skinUnicodes",Na="skinUnicodes",Ha="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Fa="en";Ls={},Dn={},Rn={};Ya=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Xa=2;An="";dl=["name","url"];hl=typeof wrappedJSObject<"u";pl=["annotation","emoji","group","order","version"];kt=class{constructor({dataSource:t=Ha,locale:e=Fa,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Lo(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Ga(this._dbName);qa(this._dbName,this._clear);let e=this.dataSource;await Qa(t)?await vl(t,e):this._lazyUpdate=yl(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return As(t),await this.ready(),Do(await nl(this._db,t)).map(qt)}async getEmojiBySearchQuery(t){Mn(t),await this.ready();let e=this._custom.search(t),n=Do(await Wo(this._db,t)).map(qt);return[...e,...n]}async getEmojiByShortcode(t){Mn(t),await this.ready();let e=this._custom.byShortcode(t);return e||qt(await sl(this._db,t))}async getEmojiByUnicodeOrName(t){Mn(t),await this.ready();let e=this._custom.byName(t);return e||qt(await il(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Bs(this._db,$t,Ao)||0}async setPreferredSkinTone(t){return As(t),await this.ready(),ol(this._db,$t,Ao,t)}async incrementFavoriteEmojiCount(t){return Mn(t),await this.ready(),rl(this._db,t)}async getTopFavoriteEmoji(t){return As(t),await this.ready(),(await al(this._db,this._custom,t)).map(qt)}set customEmoji(t){this._custom=Lo(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await js(this._dbName)}async delete(){await this._shutdown(),await Va(this._dbName)}}});function Yo(s){return s.unicode.includes("‍")}function Pl(s){let t=Xo(s,"#000"),e=Xo(s,"#fff");return t&&e&&_l(t,e)}function Sl(){let s=Object.entries(wl);try{for(let[t,e]of s)if(Pl(t))return e}catch{}finally{}return s[0][1]}function zl(s,t){if(t===0)return s;let e=s.indexOf(Dl);return e!==-1?s.substring(0,e)+String.fromCodePoint(Ll+t-1)+s.substring(e):(s.endsWith(Ml)&&(s=s.substring(0,s.length-1)),s+Al+String.fromCodePoint(Rl+t-1))}function _e(s){s.preventDefault(),s.stopPropagation()}function Ws(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function or(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Il(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:a,category:l,annotation:h})=>({unicode:n,name:a,shortcodes:i,url:r,category:l,annotation:h,id:n||a,skins:o&&e(o)}))}function Ol(s,t,e){let n;jl?(n=new ResizeObserver(e),n.observe(s)):In(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Zo(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function Jo(s,t,e){let n=Zo(t);if(!n){if(!at){at=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])at.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(at),at.firstChild.nodeValue=s,Zo(at)}finally{at.remove()}}return n}function Nl(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof Ks>"u"&&(Ks=Jo(Bl,t,t));let a=Jo(o.unicode,i,t)/1.8<Ks;Ys.set(o.unicode,a),a||(n=!1)}return n}function Hl(s){return or(s,t=>t)}function Fl(s){s&&(s.scrollTop=0)}function Yt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Qo(s){return""+s}function Ul(s){let t=document.createElement("template");return t.innerHTML=s,t}function ql(s,t){Vl?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function Yl(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Xl(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Yl(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&ql(n,s)}function Zl(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:l}}=e,h=s[i];if(o!==h)if(e.currentExpression=h,r)if(h===null)n.removeAttribute(r);else{let u=a+Qo(h)+l;n.setAttribute(r,u)}else{let u;Array.isArray(h)?Xl(h,e):h instanceof Element?(u=h,n.replaceWith(u)):n.nodeValue=Qo(h),u&&(e.targetNode=u)}}}function Jl(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],a=0;for(let h=0,u=s.length;h<u;h++){let f=s[h];if(t+=f.slice(a),h===u-1)break;for(let g=0;g<f.length;g++)switch(f.charAt(g)){case"<":{f.charAt(g+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let b=r[r.length-1],c=Yt(i,b,()=>[]),y,m,$;if(n){let g=/(\S+)="?([^"=]*)$/.exec(f);y=g[1],m=g[2];let E=/^([^">]*)("?)/.exec(s[h+1]);$=E[1],t=t.slice(0,-1*g[0].length),a=E[0].length}else a=0;let k={attributeName:y,attributeValuePre:m,attributeValuePost:$,expressionIndex:h};c.push(k),!e&&!n&&(t+=" ")}return{template:Ul(t),elementsToBindings:i}}function er(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Ql(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))er(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=t.get(++r);a&&er(a,i,e)}while(i=o.nextNode())}return e}function ed(s){let{template:t,elementsToBindings:e}=Yt(Wl,s,()=>Jl(s)),n=t.cloneNode(!0).content.firstElementChild,o=Ql(n,e);return function(r){return Zl(r,o),n}}function td(s){let t=Yt(Kl,s,()=>new Map),e=Gl;function n(i,...r){let a=Yt(t,i,()=>new Map);return Yt(a,e,()=>ed(i))(r)}function o(i,r,a){return i.map((l,h)=>{let u=e;e=a(l);try{return r(l,h)}finally{e=u}})}return{map:o,html:n}}function nd(s,t,e,n,o,i,r,a,l){let{labelWithSkin:h,titleForEmoji:u,unicodeWithSkin:f}=e,{html:b,map:c}=td(t);function y(g,E,D){return c(g,(O,Y)=>b`<button role="${E?"option":"menuitem"}" aria-selected="${E?Y===t.activeSearchItem:null}" aria-label="${h(O,t.currentSkinTone)}" title="${u(O)}" class="${"emoji"+(E&&Y===t.activeSearchItem?" active":"")+(O.unicode?"":" custom-emoji")}" id="${`${D}-${O.id}`}" style="${O.unicode?null:`--custom-emoji-background: url(${JSON.stringify(O.url)})`}">${O.unicode?f(O,t.currentSkinTone):""}</button>`,O=>`${D}-${O.id}`)}let $=b`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${c(t.skinTones,(g,E)=>b`<div id="skintone-${E}" class="emoji ${E===t.activeSkinTone?"active":""}" aria-selected="${E===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[E]}" aria-label="${t.i18n.skinTones[E]}">${g}</div>`,g=>g)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${c(t.groups,g=>b`<button role="tab" class="nav-button" aria-controls="tab-${g.id}" aria-label="${t.i18n.categories[g.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===g.id}" title="${t.i18n.categories[g.name]}" data-group-id="${g.id}"><div class="nav-emoji emoji">${g.emoji}</div></button>`,g=>g.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${c(t.currentEmojisWithCategories,(g,E)=>b`<div><div id="menu-label-${E}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:g.category?g.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${E!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(g.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${E}" id="${t.searchMode?"search-results":null}">${y(g.emojis,t.searchMode,"emo")}</div></div>`,g=>g.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${y(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,k=(g,E)=>{for(let D of s.querySelectorAll(`[${g}]`))E(D,D.getAttribute(g))};if(l){s.appendChild($);for(let g of["click","focusout","input","keydown","keyup"])k(`data-on-${g}`,(E,D)=>{E.addEventListener(g,n[D])});k("data-ref",(g,E)=>{i[E]=g}),r.addEventListener("abort",()=>{s.removeChild($)})}k("data-action",(g,E)=>{let D=a.get(E);D||a.set(E,D=new WeakSet),D.has(g)||(D.add(g),o[E](g))})}function sd(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let h=[...o];o.clear();try{for(let u of h)u()}finally{i=!1,o.size&&(i=!0,jn(r))}},a=new Proxy({},{get(h,u){if(e){let f=n.get(u);f||(f=new Set,n.set(u,f)),f.add(e)}return h[u]},set(h,u,f){if(h[u]!==f){h[u]=f;let b=n.get(u);if(b){for(let c of b)o.add(c);i||(i=!0,jn(r))}}return!0}}),l=h=>{let u=()=>{let f=e;e=u;try{return h()}finally{e=f}};return u()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:l}}function Gs(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function id(s,t,e){{let n=s.closest(".tabpanel"),o=tr.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),tr.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function od(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=sd(o),a=new Map;zn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),zn(i,t),zn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Tl,isRtl:!1,currentGroupIndex:0,groups:Hs,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let l=d=>{s.getElementById(d).focus()},h=d=>s.getElementById(`emo-${d.id}`),u=(d,w)=>{e.rootElement.dispatchEvent(new CustomEvent(d,{detail:w,bubbles:!0,composed:!0}))},f=(d,w)=>d.id===w.id,b=(d,w)=>{let{category:T,emojis:v}=d,{category:S,emojis:P}=w;return T!==S?!1:Gs(v,P,f)},c=d=>{Gs(i.currentEmojis,d,f)||(i.currentEmojis=d)},y=d=>{i.searchMode!==d&&(i.searchMode=d)},m=d=>{Gs(i.currentEmojisWithCategories,d,b)||(i.currentEmojisWithCategories=d)},$=(d,w)=>w&&d.skins&&d.skins[w]||d.unicode,E={labelWithSkin:(d,w)=>Hl([d.name||$(d,w),d.annotation,...d.shortcodes||Vs].filter(Boolean)).join(", "),titleForEmoji:d=>d.annotation||(d.shortcodes||Vs).join(", "),unicodeWithSkin:$},D={onClickSkinToneButton:be,onEmojiClick:Me,onNavClick:Pe,onNavKeydown:dt,onSearchKeydown:Ne,onSkinToneOptionsClick:ee,onSkinToneOptionsFocusOut:Ge,onSkinToneOptionsKeydown:he,onSkinToneOptionsKeyup:Ke,onSearchInput:pe},O={calculateEmojiGridStyle:U,updateOnIntersection:ae},Y=!0;r(()=>{nd(s,i,E,D,O,e,o,a,Y),Y=!1}),i.emojiVersion||Us().then(d=>{d||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function d(){let w=!1,T=setTimeout(()=>{w=!0,i.message=i.i18n.loadingMessage},$l);try{await i.database.ready(),i.databaseLoaded=!0}catch(v){console.error(v),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(T),w&&(w=!1,i.message="")}}i.database&&d()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${qo};`}),r(()=>{i.customEmoji&&i.database&&fe()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==qs&&(i.groups=qs):i.groups!==Hs&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=Hs)}),r(()=>{async function d(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}d()}),r(()=>{i.skinTones=Array(qo).fill().map((d,w)=>zl(i.skinToneEmoji,w))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function d(){let{database:w}=i,T=(await Promise.all(El.map(v=>w.getEmojiByUnicodeOrName(v)))).filter(Boolean);i.defaultFavoriteEmojis=T}i.databaseLoaded&&d()});function fe(){let{customEmoji:d,database:w}=i,T=d||Vs;w.customEmoji!==T&&(w.customEmoji=T)}r(()=>{async function d(){fe();let{database:w,defaultFavoriteEmojis:T,numColumns:v}=i,S=await w.getTopFavoriteEmoji(v),P=await ge(or([...S,...T],_=>_.unicode||_.name).slice(0,v));i.currentFavorites=P}i.databaseLoaded&&i.defaultFavoriteEmojis&&d()});function U(d){Ol(d,o,()=>{{let w=getComputedStyle(e.rootElement),T=parseInt(w.getPropertyValue("--num-columns"),10),v=w.getPropertyValue("direction")==="rtl";i.numColumns=T,i.isRtl=v}})}function ae(d){id(d,o,w=>{for(let{target:T,isIntersecting:v}of w)T.classList.toggle("onscreen",v)})}r(()=>{async function d(){let{searchText:w,currentGroup:T,databaseLoaded:v,customEmoji:S}=i;if(!v)i.currentEmojis=[],i.searchMode=!1;else if(w.length>=xl){let P=await Be(w);i.searchText===w&&(c(P),y(!0))}else{let{id:P}=T;if(P!==-1||S&&S.length){let _=await Oe(P);i.currentGroup.id===P&&(c(_),y(!1))}}}d()});let ye=()=>{In(()=>Fl(e.tabpanelElement))};r(()=>{let{currentEmojis:d,emojiVersion:w}=i,T=d.filter(v=>v.unicode).filter(v=>Yo(v)&&!Ys.has(v.unicode));if(!w&&T.length)c(d),In(()=>Fe(T));else{let v=w?d:d.filter($e);c(v),ye()}});function Fe(d){Nl(d,e.baselineEmoji,h)?ye():i.currentEmojis=[...i.currentEmojis]}function $e(d){return!d.unicode||!Yo(d)||Ys.get(d.unicode)}async function Ue(d){let w=i.emojiVersion||await Us();return d.filter(({version:T})=>!T||T<=w)}async function ge(d){return Il(d,i.emojiVersion||await Us())}async function Oe(d){let w=d===-1?i.customEmoji:await i.database.getEmojiByGroup(d);return ge(await Ue(w))}async function Be(d){return ge(await Ue(await i.database.getEmojiBySearchQuery(d)))}r(()=>{}),r(()=>{function d(){let{searchMode:T,currentEmojis:v}=i;if(T)return[{category:"",emojis:v}];let S=new Map;for(let P of v){let _=P.category||"",B=S.get(_);B||(B=[],S.set(_,B)),B.push(P)}return[...S.entries()].map(([P,_])=>({category:P,emojis:_})).sort((P,_)=>i.customCategorySorting(P.category,_.category))}let w=d();m(w)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:d}=i;sr(()=>{i.searchText=(d||"").trim(),i.activeSearchItem=-1})});function Ne(d){if(!i.searchMode||!i.currentEmojis.length)return;let w=T=>{_e(d),i.activeSearchItem=Ws(T,i.activeSearchItem,i.currentEmojis)};switch(d.key){case"ArrowDown":return w(!1);case"ArrowUp":return w(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return _e(d),Se(i.currentEmojis[i.activeSearchItem].id)}}function Pe(d){let{target:w}=d,T=w.closest(".nav-button");if(!T)return;let v=parseInt(T.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(S=>S.id===v)}function dt(d){let{target:w,key:T}=d,v=S=>{S&&(_e(d),S.focus())};switch(T){case"ArrowLeft":return v(w.previousElementSibling);case"ArrowRight":return v(w.nextElementSibling);case"Home":return v(w.parentElement.firstElementChild);case"End":return v(w.parentElement.lastElementChild)}}async function We(d){let w=await i.database.getEmojiByUnicodeOrName(d),T=[...i.currentEmojis,...i.currentFavorites].find(S=>S.id===d),v=T.unicode&&$(T,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(d),{emoji:w,skinTone:i.currentSkinTone,...v&&{unicode:v},...T.name&&{name:T.name}}}async function Se(d){let w=We(d);u("emoji-click-sync",w),u("emoji-click",await w)}function Me(d){let{target:w}=d;if(!w.classList.contains("emoji"))return;_e(d);let T=w.id.substring(4);Se(T)}function se(d){i.currentSkinTone=d,i.skinTonePickerExpanded=!1,l("skintone-button"),u("skin-tone-change",{skinTone:d}),i.database.setPreferredSkinTone(d)}function ee(d){let{target:{id:w}}=d,T=w&&w.match(/^skintone-(\d)/);if(!T)return;_e(d);let v=parseInt(T[1],10);se(v)}function be(d){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(_e(d),In(()=>l("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function he(d){if(!i.skinTonePickerExpanded)return;let w=async T=>{_e(d),i.activeSkinTone=T};switch(d.key){case"ArrowUp":return w(Ws(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return w(Ws(!1,i.activeSkinTone,i.skinTones));case"Home":return w(0);case"End":return w(i.skinTones.length-1);case"Enter":return _e(d),se(i.activeSkinTone);case"Escape":return _e(d),i.skinTonePickerExpanded=!1,l("skintone-button")}}function Ke(d){if(i.skinTonePickerExpanded)switch(d.key){case" ":return _e(d),se(i.activeSkinTone)}}async function Ge(d){let{relatedTarget:w}=d;(!w||w.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function pe(d){i.rawSearchText=d.target.value}return{$set(d){zn(i,d)},$destroy(){n.abort()}}}function nr(s){s instanceof lt||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var qs,Hs,xl,qo,sr,wl,$l,kl,Tl,El,ir,Cl,Xo,_l,Fs,Us,Ys,Ml,Al,Dl,Ll,Rl,In,jl,Bl,Ks,at,Wl,Kl,Gl,Vl,jn,tr,Vs,zn,rd,ad,ld,dd,rr,cd,lt,ar,lr=Fn(()=>{Ns();qs=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),Hs=qs.slice(1),xl=2,qo=6,sr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;wl={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},$l=1e3,kl="🖐️",Tl=8,El=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],ir='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Cl=(s,t)=>s<t?-1:s>t?1:0,Xo=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${ir}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},_l=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};Us=()=>(Fs||(Fs=new Promise(s=>sr(()=>s(Sl())))),Fs),Ys=new Map,Ml="️",Al="\uD83C",Dl="‍",Ll=127995,Rl=57339;In=requestAnimationFrame,jl=typeof ResizeObserver=="function";Bl="😀";Wl=new WeakMap,Kl=new WeakMap,Gl=Symbol("un-keyed"),Vl="replaceChildren"in Element.prototype;jn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);tr=new WeakMap;Vs=[],{assign:zn}=Object;rd="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",ad="en",ld={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},dd=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',rr=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],cd=`:host{--emoji-font-family:${ir}}`,lt=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=dd+cd,this.shadowRoot.appendChild(e),this._ctx={locale:ad,dataSource:rd,skinToneEmoji:kl,customCategorySorting:Cl,customEmoji:null,i18n:ld,emojiVersion:null,...t};for(let n of rr)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){nr(this),this._cmp||(this._cmp=od(this.shadowRoot,this._ctx))}disconnectedCallback(){nr(this),jn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new kt({locale:t,dataSource:e}))}_dbFlush(){jn(()=>this._dbCreate())}},ar={};for(let s of rr)ar[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(lt.prototype,ar);customElements.get("emoji-picker")||customElements.define("emoji-picker",lt)});var dr={};$r(dr,{Database:()=>kt,Picker:()=>lt});var cr=Fn(()=>{lr();Ns()});var nn=globalThis,sn=nn.ShadowRoot&&(nn.ShadyCSS===void 0||nn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Un=Symbol(),ni=new WeakMap,_t=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Un)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(sn&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=ni.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ni.set(e,t))}return t}toString(){return this.cssText}},si=s=>new _t(typeof s=="string"?s:s+"",void 0,Un),qe=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new _t(e,s,Un)},ii=(s,t)=>{if(sn)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=nn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},Wn=sn?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return si(e)})(s):s;var{is:kr,defineProperty:Tr,getOwnPropertyDescriptor:Er,getOwnPropertyNames:Cr,getOwnPropertySymbols:_r,getPrototypeOf:Pr}=Object,on=globalThis,oi=on.trustedTypes,Sr=oi?oi.emptyScript:"",Mr=on.reactiveElementPolyfillSupport,Pt=(s,t)=>s,Kn={toAttribute(s,t){switch(t){case Boolean:s=s?Sr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},ai=(s,t)=>!kr(s,t),ri={attribute:!0,type:String,converter:Kn,reflect:!1,useDefault:!1,hasChanged:ai};Symbol.metadata??=Symbol("metadata"),on.litPropertyMetadata??=new WeakMap;var Ae=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ri){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&Tr(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=Er(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ri}static _$Ei(){if(this.hasOwnProperty(Pt("elementProperties")))return;let t=Pr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Pt("properties"))){let e=this.properties,n=[...Cr(e),..._r(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(Wn(o))}else t!==void 0&&e.push(Wn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ii(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:Kn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Kn;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??ai)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Ae.elementStyles=[],Ae.shadowRootOptions={mode:"open"},Ae[Pt("elementProperties")]=new Map,Ae[Pt("finalized")]=new Map,Mr?.({ReactiveElement:Ae}),(on.reactiveElementVersions??=[]).push("2.1.2");var Vn=globalThis,li=s=>s,rn=Vn.trustedTypes,di=rn?rn.createPolicy("lit-html",{createHTML:s=>s}):void 0,qn="$lit$",De=`lit$${Math.random().toFixed(9).slice(2)}$`,Yn="?"+De,Ar=`<${Yn}>`,Ze=document,Mt=()=>Ze.createComment(""),At=s=>s===null||typeof s!="object"&&typeof s!="function",Xn=Array.isArray,gi=s=>Xn(s)||typeof s?.[Symbol.iterator]=="function",Gn=`[ 	
\f\r]`,St=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ci=/-->/g,hi=/>/g,Ye=RegExp(`>|${Gn}(?:([^\\s"'>=/]+)(${Gn}*=${Gn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pi=/'/g,ui=/"/g,mi=/^(?:script|style|textarea|title)$/i,Zn=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=Zn(1),J=Zn(2),jd=Zn(3),Le=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),fi=new WeakMap,Xe=Ze.createTreeWalker(Ze,129);function bi(s,t){if(!Xn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return di!==void 0?di.createHTML(t):t}var vi=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=St;for(let a=0;a<e;a++){let l=s[a],h,u,f=-1,b=0;for(;b<l.length&&(r.lastIndex=b,u=r.exec(l),u!==null);)b=r.lastIndex,r===St?u[1]==="!--"?r=ci:u[1]!==void 0?r=hi:u[2]!==void 0?(mi.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=Ye):u[3]!==void 0&&(r=Ye):r===Ye?u[0]===">"?(r=o??St,f=-1):u[1]===void 0?f=-2:(f=r.lastIndex-u[2].length,h=u[1],r=u[3]===void 0?Ye:u[3]==='"'?ui:pi):r===ui||r===pi?r=Ye:r===ci||r===hi?r=St:(r=Ye,o=void 0);let c=r===Ye&&s[a+1].startsWith("/>")?" ":"";i+=r===St?l+Ar:f>=0?(n.push(h),l.slice(0,f)+qn+l.slice(f)+De+c):l+De+(f===-2?a:c)}return[bi(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Dt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,a=t.length-1,l=this.parts,[h,u]=vi(t,e);if(this.el=s.createElement(h,n),Xe.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(o=Xe.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let f of o.getAttributeNames())if(f.endsWith(qn)){let b=u[r++],c=o.getAttribute(f).split(De),y=/([.?@])?(.*)/.exec(b);l.push({type:1,index:i,name:y[2],strings:c,ctor:y[1]==="."?ln:y[1]==="?"?dn:y[1]==="@"?cn:Qe}),o.removeAttribute(f)}else f.startsWith(De)&&(l.push({type:6,index:i}),o.removeAttribute(f));if(mi.test(o.tagName)){let f=o.textContent.split(De),b=f.length-1;if(b>0){o.textContent=rn?rn.emptyScript:"";for(let c=0;c<b;c++)o.append(f[c],Mt()),Xe.nextNode(),l.push({type:2,index:++i});o.append(f[b],Mt())}}}else if(o.nodeType===8)if(o.data===Yn)l.push({type:2,index:i});else{let f=-1;for(;(f=o.data.indexOf(De,f+1))!==-1;)l.push({type:7,index:i}),f+=De.length-1}i++}}static createElement(t,e){let n=Ze.createElement("template");return n.innerHTML=t,n}};function Je(s,t,e=s,n){if(t===Le)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=At(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Je(s,o._$AS(s,t.values),o,n)),t}var an=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Ze).importNode(e,!0);Xe.currentNode=o;let i=Xe.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let h;l.type===2?h=new ht(i,i.nextSibling,this,t):l.type===1?h=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(h=new hn(i,this,t)),this._$AV.push(h),l=n[++a]}r!==l?.index&&(i=Xe.nextNode(),r++)}return Xe.currentNode=Ze,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},ht=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Je(this,t,e),At(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==Le&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):gi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&At(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ze.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Dt.createElement(bi(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new an(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=fi.get(t.strings);return e===void 0&&fi.set(t.strings,e=new Dt(t)),e}k(t){Xn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(Mt()),this.O(Mt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=li(t).nextSibling;li(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Qe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=x}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Je(this,t,e,0),r=!At(t)||t!==this._$AH&&t!==Le,r&&(this._$AH=t);else{let a=t,l,h;for(t=i[0],l=0;l<i.length-1;l++)h=Je(this,a[n+l],e,l),h===Le&&(h=this._$AH[l]),r||=!At(h)||h!==this._$AH[l],h===x?t=x:t!==x&&(t+=(h??"")+i[l+1]),this._$AH[l]=h}r&&!o&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ln=class extends Qe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},dn=class extends Qe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},cn=class extends Qe{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Je(this,t,e,0)??x)===Le)return;let n=this._$AH,o=t===x&&n!==x||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==x&&(n===x||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},hn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Je(this,t)}},yi={M:qn,P:De,A:Yn,C:1,L:vi,R:an,D:gi,V:Je,I:ht,H:Qe,N:dn,U:cn,B:ln,F:hn},Dr=Vn.litHtmlPolyfillSupport;Dr?.(Dt,ht),(Vn.litHtmlVersions??=[]).push("3.3.3");var xi=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new ht(t.insertBefore(Mt(),i),i,void 0,e??{})}return o._$AI(s),o};var Jn=globalThis,ve=class extends Ae{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=xi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Le}};ve._$litElement$=!0,ve.finalized=!0,Jn.litElementHydrateSupport?.({LitElement:ve});var Lr=Jn.litElementPolyfillSupport;Lr?.({LitElement:ve});(Jn.litElementVersions??=[]).push("4.2.2");var pt="mydashlight",Xd=`/api/${pt}/pair`,Zd=`/api/${pt}/pair/poll`,Jd=`/${pt}`,Lt="pair";function wi(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Qn(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function $i(s){let t=new URLSearchParams(s);return t.has(Lt)?Qn(t.get(Lt)??""):null}function Rr(s){if(s<60)return"just now";let t=Math.round(s/60);return`${t} minute${t===1?"":"s"} ago`}var Rt=class extends ve{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${pt}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${pt}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return p`<form @submit=${o=>{o.preventDefault();let i=Qn(this.typed);i&&this.check(i)}}>
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
      <p class="code">${wi(e.code??"")}</p>
      ${o?p`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:x}
      <p>
        A screen at ${e.address} asked ${Rr(e.age??0)}. Check the code matches the one on the screen. It will be
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
  `,Rt.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Rt);function R(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Re(s){let t=Math.floor(Math.round(s)/60)%24;return`${R(s)} ${t<12?"AM":"PM"}`}function Ti(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function ut(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function pn(s){return s?`${ut(Math.abs(s))} ${s<0?"early":"late"}`:"on time"}function es(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var zr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Ir=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),jr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"}),Or=new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"UTC"});function zt(s){return new Date(`${s}T12:00:00Z`)}function we(s){let t=zt(s);return`${zr.format(t)}, ${jr.format(t)}`}function un(s){return Or.format(zt(s))}function de(s){return Ir.format(zt(s))}function ke(s,t){return Math.round((zt(t).getTime()-zt(s).getTime())/864e5)}function It(s,t=new Date){let e=Br(s);if(!e)return It("UTC",t);let n=e.formatToParts(t),o=i=>n.find(r=>r.type===i)?.value??"0";return{date:`${o("year")}-${o("month")}-${o("day")}`,minutes:Number(o("hour"))*60+Number(o("minute"))}}var ki=new Map;function Br(s){let t=ki.get(s);if(t!==void 0)return t;try{t=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"})}catch{t=null}return ki.set(s,t),t}function ts(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=It(e,s),i=It(e,t).date;return o.date===i?`at ${Re(o.minutes)}`:`on ${de(o.date)} at ${Re(o.minutes)}`}var K=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function _i(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}function Pi(s){let t=(s??"").trim(),e=o=>{let i=o.exec(t);return i?(t=t.slice(i[0].length).trim(),!0):!1};for(;e(/^Couldn['’]t read Google Calendar:?/i););return{short:e(/^Couldn['’]t reach Google Calendar:?/i)?"Can’t reach Google Calendar":"Couldn’t read Google Calendar",detail:t||null}}var et="mydashlight",Nr=7,ns=3e4,Ei=3e4;function ss(s){if(s instanceof K)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new K(String(t.code??"error"),t.message)}return typeof s=="number"?new K("connection_lost","Lost the connection to Home Assistant."):new K("error",String(s))}function Ci(s,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new K("timeout","Home Assistant didn’t answer.")),t);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),n(i)})})}var jt=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},fn=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new K("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new jt(this.conn,`${et}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new K("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},ns),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await Ci(this.conn.sendMessagePromise({type:"call_service",domain:et,service:"get_plan",service_data:{days:Nr},return_response:!0}),Ei);this.emit(t.response)}catch(t){this.fail(ss(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:et,service:t,service_data:e})}catch(n){throw ss(n)}this.live||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:es(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:es(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n,o,i){return this.call("set_people",{event:t,...e?{people:e}:{},...i!==void 0?{overnight:i}:{},scope:n,...o?{driver:o.driver,riders:o.riders,back_riders:o.backRiders}:{}})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let a=await Ci(this.conn.sendMessagePromise({type:"call_service",domain:et,service:"get_chores",service_data:{},return_response:!0}),Ei);if(e)return;n=!0,t(a.response??null)}catch{!e&&!n&&t(null)}},i=new jt(this.conn,`${et}/chores/subscribe`,a=>{e||(n=!0,t(a.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},ns);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(t){let e=!1,n=!1,o=new jt(this.conn,`${et}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let i=setInterval(()=>{o.live||o.open()},ns);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n,o){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{},...e&&o?{skip:o}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:et,service:t,service_data:e})}catch(n){throw ss(n)}}};var Si={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Mi=s=>(...t)=>({_$litDirective$:s,values:t}),gn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Hr}=yi,Ai=s=>s;var Di=()=>document.createComment(""),ft=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Di(),o),r=n.insertBefore(Di(),o);e=new Hr(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==r._$AU&&e._$AP(l)}if(i!==o||a){let l=e._$AA;for(;l!==i;){let h=Ai(l).nextSibling;Ai(n).insertBefore(l,o),l=h}}}return e},He=(s,t,e=s)=>(s._$AI(t,e),s),Fr={},Li=(s,t=Fr)=>s._$AH=t,Ri=s=>s._$AH,mn=s=>{s._$AR(),s._$AA.remove()};var zi=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Te=Mi(class extends gn{constructor(s){if(super(s),s.type!==Si.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let a of s)o[r]=n?n(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=Ri(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],l=[],h,u,f=0,b=o.length-1,c=0,y=i.length-1;for(;f<=b&&c<=y;)if(o[f]===null)f++;else if(o[b]===null)b--;else if(a[f]===r[c])l[c]=He(o[f],i[c]),f++,c++;else if(a[b]===r[y])l[y]=He(o[b],i[y]),b--,y--;else if(a[f]===r[y])l[y]=He(o[f],i[y]),ft(s,l[y+1],o[f]),f++,y--;else if(a[b]===r[c])l[c]=He(o[b],i[c]),ft(s,o[f],o[b]),b--,c++;else if(h===void 0&&(h=zi(r,c,y),u=zi(a,f,b)),h.has(a[f]))if(h.has(a[b])){let m=u.get(r[c]),$=m!==void 0?o[m]:null;if($===null){let k=ft(s,o[f]);He(k,i[c]),l[c]=k}else l[c]=He($,i[c]),ft(s,o[f],$),o[m]=null;c++}else mn(o[b]),b--;else mn(o[f]),f++;for(;c<=y;){let m=ft(s,l[y+1]);He(m,i[c]),l[c++]=m}for(;f<=b;){let m=o[f++];m!==null&&mn(m)}return this.ut=r,Li(s,l),Le}});var bn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function q(s){return bn[(s%bn.length+bn.length)%bn.length]}var vn="#23272E",is="35,39,46";var os=3,Ht=36,rs=12,yn=8,Ii=30,Ee=16,Ot=100,mt=60,Ur=120,ji=44,Oi=20,Wr=45,Kr=30,Bi=20,ds=10,wn=30,cs=10,Gr=150,Vr=150,kn=1;function Vi(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Ht}function qr(s,t,e){return 10+10.2*s.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var Yr=26,qi=4;function ps(s,t){let e=Math.max(Gr,Vr/kn);return Math.ceil(mt+Math.max(0,s-1)*ds+wn+Math.max(0,t-1)*cs+e*(s+kn*t))}function ce(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function G(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function Yi(s,t){let e=s.who?.[t.event_id]?.people??[],n=t.own??t.kid;if(!e.includes(n))return null;let o=e.filter(r=>r!==n),i=ce(s);return o.length&&(t.own!=null||o.some(r=>i.includes(r)))?o:null}function re(s){return new Map(ce(s).map((t,e)=>[t,q(e)]))}function oe(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function Q(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function us(s,t){return t==="none"?"Not needed":G(s).includes(t)?Q(s,t):t}function Xr(s){return s.leave_by!=null&&s.leave_by>s.start&&s.leave_by!==s.end?` · leave ${R(s.leave_by)}`:""}function Tn(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${R(s.end)}`;if(s.end>=1440)return`From ${R(s.start)}`}return`${R(s.start)}–${R(s.end)}`}function Ft(s,t){return t.own?Q(s,t.own):oe(s,t.kid)}var ze={color:vn,rgb:is,ink:vn};function Xi(s,t){return t.own?ze:re(s).get(t.kid)??q(0)}function Zr(s,t){let e=ce(s);return t.along.map(n=>e.includes(n)?oe(s,n):Q(s,n))}function bt(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Jr(s,t){let e=ce(s),n=G(s).filter(a=>t.includes(a)),o=e.filter(a=>t.includes(a)),i=e.length>1&&o.length===e.length;if(i&&n.length===G(s).length)return"Everyone";let r=[...n.map(a=>Q(s,a)),...i?["the kids"]:o.map(a=>oe(s,a))];return r.length<2?r.join(""):`${r.slice(0,-1).join(", ")} & ${r[r.length-1]}`}function Qr(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function $n(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function as(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push($n(t,n.from)),e.push($n(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push($n(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function ea(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let a=n.findIndex(l=>l<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),t}function ta(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function na(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function Zi(s,t){return ta(s.anchors,t)}function fs(s,t){return na(s.anchors,t)}function sa(s,t){let e=ce(s),n=G(s),o=Math.max(t,ps(e.length,n.length)),r=(o-mt-Math.max(0,e.length-1)*ds-wn-Math.max(0,n.length-1)*cs)/(e.length+kn*n.length||1),a=Math.floor(r),l=Math.floor(r*kn),h=s.whole_week??s.days,u=new Map;for(let m of h)for(let $ of m.events)for(let k of $.own?$.along:[$.kid]){let g=u.get(k)??[];g.some(E=>E.event_id===$.event_id&&E.calendar_id===$.calendar_id)||g.push($),u.set(k,g)}let f=re(s),b=[],c=mt;e.forEach((m,$)=>{let k=u.get(m)??[],g=s.days.some(E=>E.events.some(D=>D.kid===m&&(D.sides.includes("drop")&&D.drop===""||D.sides.includes("pick")&&D.pick==="")));b.push({id:m,kind:"kid",x:c,w:a,name:oe(s,m),dot:f.get(m).color,rgb:f.get(m).rgb,sub:g?"Needs a ride":`${k.length} this week`,subWarn:g}),c+=a+($<e.length-1?ds:0)});let y=c+wn/2;return c+=wn,n.forEach((m,$)=>{let k=0,g=0;for(let E of h){let D=E.drivers[m];D&&(k+=D.outings.length,g+=D.drive??0)}b.push({id:m,kind:"driver",x:c,w:l,name:Q(s,m),dot:vn,rgb:is,sub:`${k} ${k===1?"trip":"trips"} this week · ${ut(g)} driving`,subWarn:!1}),c+=l+($<n.length-1?cs:0)}),{columns:b,sepX:y,width:o}}function ia(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Ni(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${R(s.start)}`:e||!t?`${s.title} until ${R(s.end)}`:`${s.title} ${R(s.start)}–${R(s.end)}`}function gs(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function ms(s,t){let e=ke(t,s);return e===0?"Today":e===1?"Tomorrow":""}function ne(s,t=0){return s==null||!Number.isFinite(s)?t:s}var hs=null;function Ji(s){hs=s}var xn='Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',gt={title:`800 14.5px ${xn}`,time:`400 12px ${xn}`,line:`600 12px ${xn}`,stop:`400 12px ${xn}`};function oa(s,t,e){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/[ \t\n]+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=n?i+=1+a:(o++,i=a);i>n;)o++,i-=n}return o}function ra(s,t,e,n){let o=s.split(/[ \t\n]+/).filter(Boolean),i=1,r="";for(let a of o){let l=r?`${r} ${a}`:a,h=n(l,e);if(h==null)return null;if(h<=t){r=l;continue}r&&i++;let u=n(a,e);if(u==null)return null;u>t&&(i+=Math.ceil(u/t)-1),r=a}return i}function Bt(s,t,e=7,n){if(n&&hs){let o=ra(s,t-.5,n,hs);if(o!=null)return o}return oa(s,t,e)}var Qi=25,aa=15,eo=3;function Hi(s){return Math.max(0,Math.min(eo,Math.floor((s-Qi)/aa)))}var la=Qi+2,Fi=20;function Ui(s,t="Home"){let e=/^(\d+:\d\d)\s+(.+)$/.exec(s.at(-1)??"");return e&&e[2]===t?e[1]:null}function ls(s,t,e,n){let o=t.drivers[e],i=o?.home;if(!i)return s;let r=n==null?void 0:o.outings.find(a=>(a.start??1/0)<=n&&n<(a.end??-1/0));return new Map(s).set(i.place,i.name).set("home",r?.home??i.name)}var Nt="🚗";function Wi(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var Ki={muted:0,normal:1,pending:2,problem:3};function da(s){let{drop:t,pick:e}=s,n=t?Wi(t.text,"drop"):null,o=e?Wi(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((l,h)=>h&&(Ki[h.tone]??1)>(Ki[l]??1)?h.tone:l,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Nt} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let l=`${Nt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${l} both ways`,tone:i},pick:null}:!n.at||!o.at?{drop:{text:`${l} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:i},pick:null}:{drop:{text:`${l} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(l,h)=>l==="needed"?`${h} needed`:`${h}${l.at?`${l.at} `:" "}${l.who}${l.stays?" stays":""}${l.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Nt} ${a.join(" · ")}`,tone:i},pick:null}}function ca(s,t){return!t&&!!s.drop&&!s.pick&&s.drop.tone==="muted"}var ha=5,pa=13;function ua(s,t,e={}){let n=e.clash?4:2,o=t-n-13-9,i=n+2*ha;i+=Bt(s.title,o-(e.noted?pa:0),9,gt.title)*18;let r=s.inline&&s.drop?`${s.time} · ${s.drop.text}`:s.time;return i+=1+Bt(r,o,6.6,s.inline?gt.line:gt.time)*16,s.drop&&!s.inline&&(i+=1+Bt(s.drop.text,o,7,gt.line)*16),s.pick&&(i+=2+Bt(s.pick.text,o,7,gt.line)*16),Math.ceil(i)+1}function Gi(s,t="Home"){let e=/^(\S+\s+)(.+?), get (.+)$/u.exec(s);return e&&e[2]===t?`${e[1]}${t} ↑ ${e[3]}`:s.replace(/, drop off (.+)$/u," ↓ $1").replace(/, pick up (.+)$/u," ↑ $1")}function fa(s,t){let e=s.reduce((n,o)=>n+Bt(o,t-20,7,gt.stop),0);return 28+s.length+e*16+1}function to(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:a}=sa(s,e),l=new Map(i.map(g=>[g.id,g])),h=ce(s),u=G(s),f=[...h,...u],b=re(s),c=Qr(s),y=g=>oe(s,g),m=g=>Q(s,g),$={mode:t,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],folds:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},k=0;return s.days.forEach((g,E)=>{let D=E*1440,O=new Map(g.events.map(d=>[d.id,d])),Y=d=>d&&O.has(d)?{day:g.date,event:d}:null,fe=gs(g),U=g.events.length,ae=ms(g.date,n.date),ye=we(g.date),Fe=(U?`${U} ${U===1?"activity":"activities"}${g.done?" left":""}`:g.done?"All done for today":"Nothing scheduled")+(fe?` · ${fe} to sort out`:""),$e=$a(s,g,b,a,a-qr(ye,ae,Fe));$.dayHeads.push({date:g.date,y:k,label:ye,tag:ae,sub:Fe,warn:fe>0,h:Ht+($e&&$e.h?$e.h+qi+2:0),allDay:$e?.chips??[],inline:$e?.inline??0}),$.anchors.push({t:D,y:k});let Ue=$.dayHeads[$.dayHeads.length-1],ge=k+Ue.h+rs,Oe=u.flatMap(d=>g.drivers[d]?.outings??[]);if(!U&&!Oe.length){$.empties.push({key:g.date,y:ge,text:g.done?"Nothing else today":"Nothing planned"}),k=ge+40,$.anchors.push({t:D+1439,y:k});return}let Be=(d,w,T=d.kid)=>{let v=!!d.own&&T===d.own,S=!!d.own&&T!==d.own,P=v?m(T):y(T),_=S?{drop:{text:`${w?`${Nt} `:""}With ${m(d.own)}`,tone:d.attending===!1?"muted":"normal"},pick:null}:w&&!d.own?da(d.lines):d.lines,B=v?Zr(s,d):[],L=(d.takes!=null?`${d.takes} min, any time ${R(d.start)}–${R(d.end)}`:Tn(d)+(d.arrive_by!=null?` · arrive ${R(d.arrive_by)}`:"")+Xr(d))+(B.length?` · with ${bt(B)}`:"");return{who:P,mine:v,title:ia(d.title,P),time:L,drop:_.drop,pick:_.pick,inline:w&&ca(_,d.attending===!1)}},Ne=(d,w,T,v)=>ua(Be(d,!0,T),w,{noted:!!d.notes,clash:v}),Pe=(d,w,T,v,S,P,_,B=d.kid)=>{let L=Be(d,_,B),ie=L.mine?ze:b.get(B)??q(0),H=L.who,C={drop:L.drop,pick:L.pick};return{key:`${g.date}|card|${d.id}`+(d.own?`|${B}`:""),x:w,y:T,w:v,h:S,target:{day:g.date,event:d.id},event:d,color:ie,kidName:H,clash:P,stayed:!d.own&&d.stay&&u.includes(d.drop),skipped:d.attending===!1,title:L.title,time:L.time,drop:C.drop,pick:C.pick,showDrop:!!C.drop&&(_||S>=56),showPick:!!C.pick&&(_||S>=74),wrap:_,inline:L.inline,aria:`${H}, ${d.title} ${d.takes!=null?`any time from ${R(d.start)} to ${R(d.end)}`:Tn(d).replace("–"," to ")}. `+(d.attending===!1&&!C.drop?"Not attending. ":"")+[C.drop,C.pick].filter(N=>!!N).map(N=>N.text).join(". ")}},dt=d=>{let w=g.rides[d];return w?(g.drivers[w.driver]?.segments??[]).filter(v=>v.type!=="home"&&v.kids.includes(w.kid)&&ne(v.start)>=ne(w.start)&&ne(v.end)<=ne(w.end)):[]},We=d=>{let w=g.rides[d];if(!w)return null;let T=w.serves.find(v=>O.get(v)?.kid===w.kid);return Y(T??w.serves[0])},Se=(d,w)=>{if(w.event)return w;let T=g.events.find(v=>v.own&&v.own!==d&&v.along.includes(d)&&v.title===w.title);return T?{...w,title:`${w.title} with ${m(T.own)}`}:w},Me=d=>{if(d.takes==null)return[d.start,d.end];let w=d.planned??d.start;return[w,w+d.takes]},se=new Map;for(let d of g.issues)d.level!=="problem"||!d.event||(d.kind==="late"&&se.set(d.event,`${Math.round(ne(d.minutes))} min late`),d.kind==="waiting"&&se.set(`${d.event}|pick`,`Waits ${Math.round(ne(d.minutes))} min`));if(!o){let d=1/0,w=-1/0;for(let C of g.events)C.start<=0&&C.end>=1440||(C.start>0?d=Math.min(d,C.start-20,C.arrive_by!=null?C.arrive_by-10:1/0):d=Math.min(d,C.end-30),C.end<1440?w=Math.max(w,C.end+20):w=Math.max(w,C.start+30));for(let C of Oe)C.start!=null&&(d=Math.min(d,C.start)),C.end!=null&&(w=Math.max(w,C.end));let T=g.from;T!=null&&Number.isFinite(d)&&d<T+60?d=T-15:g.date===n.date&&Number.isFinite(d)&&n.minutes>d-60&&n.minutes<w&&(d=Math.min(d,n.minutes-15));let v=Number.isFinite(d)?Math.floor((d-5)/30)*30:900,S=Math.max(Number.isFinite(w)?Math.ceil((w+5)/30)*30:960,v+60),P=C=>T!=null&&ne(C)<=v,_=C=>T!=null&&ne(C)<v,B=ma(ga(g,u,Me,g.date===n.date?n.minutes:null),v,S),L=C=>Math.round(ge+ba(Math.max(v,Math.min(S,C))-v,B,v));$.anchors.push({t:D+v,y:L(v)});for(let C of B)$.anchors.push({t:D+C.from,y:L(C.from)},{t:D+C.to,y:L(C.to)}),$.folds.push({key:`${g.date}|fold|${C.from}`,y:L(C.from),h:L(C.to)-L(C.from),from:C.from,to:C.to,label:va(C.to-C.from)});$.anchors.push({t:D+S,y:L(S)});let ie=(C,N)=>B.some(I=>N?C>=I.from&&C<=I.to:C>I.from&&C<I.to);for(let C of h){let N=l.get(C),I=b.get(C),xe=(g.kids[C]?.items??[]).filter(M=>M.start!=null&&M.end!=null&&!P(M.end)).map(M=>({item:M,s:ne(M.start),en:ne(M.end)})),le=[];for(let M of ea(xe)){let z=N.w/M.cols,j=Math.round(N.x+M.col*z),F=Math.round(z-(M.cols>1?4:0)),X=L(M.s),W=M.item;if(W.type==="act"){let me=O.get(W.event??"");if(!me)continue;let tn=Math.max(30,L(M.en)-X),ct=Pe(me,j,X,F,tn,W.clash,!1,C);if(ct.layer=Ot,ct.cut=_(M.s),$.cards.push(ct),me.arrive_by!=null&&me.start-me.arrive_by>=5&&!ct.cut){let Hn=L(me.arrive_by),ti={key:`${g.date}|prep|${me.id}`,x:j,y:Hn,w:F,h:X-Hn+Ee,color:I,label:`Arrive by ${R(me.arrive_by)}`,layer:Ot-1};$.preps.push(ti),le.push({s:me.arrive_by,en:M.en,top:Hn,bottom:X+tn,x:j,w:F,prep:ti,card:ct})}else le.push({s:M.s,en:M.en,top:X,bottom:X+tn,x:j,w:F,card:ct});let Qs=se.get(me.id);Qs&&$.marks.push({key:`${g.date}|late|${me.id}`,x:j+F-4,y:X+4,text:Qs,right:!0});let ei=se.get(`${me.id}|pick`);ei&&$.marks.push({key:`${g.date}|wait|${me.id}`,x:j+4,y:X+tn+2,text:ei,right:!1});continue}let V=g.rides[W.ride??-1];if(!V)continue;let Z=Math.max(22,L(M.en)-X),Ve=as(dt(V.index),ls(c,g,V.driver,V.start??void 0)),Ct=m(V.driver),Zs={key:`${g.date}|ride|${V.index}`,x:j,y:X,w:F,h:Z,target:We(V.index),l1:`${V.own?"In":"Along in"} ${Ct}’s car`,l2:Ve.join(" → "),show2:Hi(Z)>0,lines2:Hi(Z),dashed:!V.own,clash:W.clash,aria:`${y(C)} ${V.own?"in":"riding along in"} ${Ct}’s car, ${R(ne(V.start))} to ${R(ne(V.end))}: ${Ve.join(" to ")}`};$.rides.push(Zs);let Js=l.get(V.driver),Nn=null;Js&&(Nn={key:`${g.date}|band|${V.index}`,x:j+F,y:X,w:Math.max(0,Js.x+8-(j+F)),h:Z,color:I},$.bands.push(Nn)),le.push({s:M.s,en:M.en,top:X,bottom:X+Z,x:j,w:F,ride:Zs,band:Nn})}let en=M=>M.ride?.layer??(M.prep?Ot-1:Ot),Et=(M,z,j,F)=>{j>Ee&&$.links.push({key:`${M.key}|link`,x:M.x,y:z,w:M.w,h:j,color:I,layer:F})},A=(M,z)=>{if(!(z.x<M.x||z.x+z.w>M.x+M.w)&&(M.x=z.x,M.w=z.w,M.ride.x=z.x,M.ride.w=z.w,M.band)){let j=M.band.x+M.band.w;M.band.x=z.x+z.w,M.band.w=Math.max(0,j-M.band.x)}},te=new Set;for(let M of[...le].sort((z,j)=>j.s-z.s)){let z=M.ride;if(!z)continue;let j=le.filter(W=>W!==M&&W.s>=M.en&&W.s-M.en<=Ii&&W.top>=M.bottom).sort((W,V)=>W.s-V.s||W.top-V.top)[0];if(!j)continue;te.add(M),A(M,j);let F=en(j),X=j.top-M.bottom;Et(z,M.bottom,X+Ee,F-1),z.layer=F-(X>0?2:1),z.h+=Ee,z.tuckBottom=Ee}for(let M of[...le].sort((z,j)=>z.s-j.s)){let z=M.ride;if(!z||te.has(M))continue;let j=le.filter(W=>W!==M&&W.en<=M.s&&M.s-W.en<=Ii&&W.bottom<=M.top&&(W.card||W.ride?.layer!=null)).sort((W,V)=>V.en-W.en||V.bottom-W.bottom)[0];if(!j)continue;A(M,j);let F=j.ride?.layer??Ot,X=M.top-j.bottom;Et(z,j.bottom-Ee,X+Ee,F-1),z.layer=F-(X>0?2:1),z.y-=Ee,z.h+=Ee,z.tuckTop=Ee}}for(let C of u){let N=l.get(C),I=g.drivers[C];if(!I)continue;let xe=[],le=null;for(let A of I.segments)if(!(A.start==null||A.end==null)){if(A.type==="home"){le=null;continue}if(A.type==="stay"){le=null,xe.push({type:"stay",g:A,s:A.start,en:A.end});continue}le&&le.en===A.start?(le.en=A.end,le.legs.push(A)):(le={type:"trip",s:A.start,en:A.end,legs:[A]},xe.push(le))}let en=new Set,Et=(A,te,M,z)=>{en.add(A.id);let j=L(te),F=Pe(A,N.x+8,j,N.w-16,Math.max(30,L(M)-j),!1,!1,C);F.cut=_(te),z&&F.drop?.tone==="normal"&&(F.drop=null,F.showDrop=!1),$.cards.push(F)};for(let A of xe){if(P(A.en))continue;let te=L(A.s),M=Math.max(24,L(A.en)-te);if(A.type==="stay"){let Z=O.get(A.g.event??A.g.serves??"");if(Z?.own===C){Et(Z,A.s,A.en,!0);continue}let Ve=Z?b.get(Z.kid)??q(0):q(0),Ct=A.g.kids.map(y);$.stays.push({cut:_(A.s),key:`${g.date}|stay|${C}|${A.s}`,x:N.x+8,y:te,w:N.w-16,h:M,target:Y(Z?.id),color:Ve,l1:Z?`At ${Z.title} with ${y(Z.kid)}`:"Staying",l2:`until ${R(A.en)}`+(Ct.length?` · ${Ct.join(" and ")} too`:"")});continue}let z=A.legs[0],j=A.legs[A.legs.length-1],F=[];for(let Z of A.legs)for(let Ve of Z.kids)F.includes(Ve)||F.push(Ve);let X=j.type==="drive"&&j.to==="home",W=ls(c,g,C,A.s),V=as(A.legs,W);$.trips.push({key:`${g.date}|trip|${C}|${A.s}`,x:N.x+8,y:te,w:N.w-16,h:M,target:Y(A.legs.find(Z=>Z.serves)?.serves),l1:z.type==="drive"&&z.from==="home"?`Leave ${R(A.s)}`:`From ${$n(c,z.from??z.place)} ${R(A.s)}`,l2:V.join(" → "),show2:M>=36,l3:X?`${W.get("home")??"Home"} ${R(A.en)}`:"",show3:X&&M>=62,stops:null,kids:F.map(Z=>(b.get(Z)??q(0)).color),bad:A.legs.some(Z=>Z.overlaps_busy),aria:`${m(C)} drives ${V.join(" to ")}, ${R(A.s)} to ${R(A.en)}`})}for(let A of I.segments)if(!(!A.overlaps_busy||A.start==null||A.end==null))for(let te of I.busy){let M=Math.max(A.start,te.start),z=Math.min(A.end,te.end);z<=M||P(z)||$.overlaps.push({key:`${g.date}|overlap|${C}|${M}`,x:N.x+6,y:L(M)-2,w:N.w-12,h:Math.max(8,L(z)-L(M)+4)})}for(let A of g.events)if(A.own===C&&(!en.has(A.id)&&!P(Me(A)[1])&&Et(A,...Me(A),!1),A.takes!=null&&A.attending!==!1&&!P(A.end))){let te=L(A.start);$.windows.push({key:`${g.date}|window|${A.id}`,x:N.x+4,y:te,w:N.w-8,h:Math.max(24,L(A.end)-te),label:`${A.title} · any time ${R(A.start)}–${R(A.end)}`})}for(let A of I.busy){if(A.event||A.end<=v||A.start>=S)continue;let te=Se(C,A),M=L(te.start),z=L(te.end);$.busy.push({key:`${g.date}|busy|${C}|${te.start}`,x:N.x+1,y:M,w:N.w-2,h:z-M,labelY:8,label:Ni(te,!1)})}}let H=-1/0;for(let C=v;C<=S;C+=30)ie(C,!0)||$.grid.push({key:`${g.date}|grid|${C}`,y:L(C),strong:C%60===0}),(B.some(I=>I.from===C||I.to===C)||C%60===0&&!ie(C,!1))&&L(C)-H>=22&&($.hours.push({key:`${g.date}|hour|${C}`,y:L(C)-8,label:C%60===0?Ti(C):Re(C)}),H=L(C));g.date===n.date&&n.minutes>v&&n.minutes<S&&($.now={y:L(n.minutes),label:`Now ${R(n.minutes)}`}),k=L(S)+rs;return}let ee=[];for(let d of h){let w=l.get(d);for(let T of g.kids[d]?.items??[])if(T.start!=null){if(T.type==="act"){let v=O.get(T.event??"");if(!v)continue;ee.push({col:d,s:T.start,h:Ne(v,w.w,d,T.clash),kind:"act",item:T})}else if(!g.rides[T.ride??-1]?.own){let v=g.rides[T.ride??-1],S=v?g.drivers[v.driver]?.outings.find(P=>P.start!=null&&P.start<=ne(v.start)&&ne(v.start)<=ne(P.end,P.start)):void 0;ee.push({col:d,s:S?.start??T.start,h:la,kind:"along",item:T})}}}for(let d of u){let w=g.drivers[d];if(!w)continue;for(let v of w.busy)v.event||ee.push({col:d,s:v.start,h:32,kind:"busy",busy:Se(d,v)});let T=l.get(d).w;for(let v of g.events)v.own!==d||!v.busy_only&&v.attending!==!1&&(v.takes==null||v.planned!=null)||ee.push({col:d,s:Me(v)[0],h:Ne(v,T-16,d,!1),kind:"own",event:v});for(let v of w.outings){if(v.start==null)continue;let S=(Ui(v.lines,v.home)?v.lines.slice(0,-1):v.lines).map(P=>Gi(P,v.home));ee.push({col:d,s:v.start,h:fa([...S,...v.warn?[v.warn]:[]],T-16),kind:"out",out:v})}}ee.sort((d,w)=>d.s-w.s||f.indexOf(d.col)-f.indexOf(w.col));let be=new Map,he=[],Ke=new Map,Ge=ge-Fi;for(let d=0;d<ee.length;){let w=d,T=Ge+Fi;for(;w<ee.length&&ee[w].s===ee[d].s;w++){let S=be.get(ee[w].col);S!=null&&(T=Math.max(T,S+yn))}let v=new Set;for(let S=d;S<w;S++){let P=ee[S],_=v.has(P.col)?be.get(P.col)+yn:T;v.add(P.col),be.set(P.col,_+P.h)}Ke.set(ee[d].s,T),ee[d].s>0&&$.hours.push({key:`${g.date}|hour|${ee[d].s}`,y:T+2,label:Re(ee[d].s)}),Ge=T,d=w}be.clear(),ee.forEach((d,w)=>{let T=be.get(d.col),v=Math.max(T!=null?T+yn:ge,Ke.get(d.s));be.set(d.col,v+d.h);let S=d.kind==="busy"?d.busy.end:d.kind==="act"?O.get(d.item.event??"")?.end??null:d.kind==="own"?Me(d.event)[1]:null;he.push({col:d.col,s:d.s,end:S,y:v,h:d.h,box:null}),$.anchors.push({t:D+d.s,y:v});let P=l.get(d.col);if(d.kind==="busy"){let _={key:`${g.date}|busy|${d.col}|${w}`,x:P.x+1,y:v,w:P.w-2,h:d.h,labelY:8,label:Ni(d.busy,!0)};$.busy.push(_),he[he.length-1].box=_}else if(d.kind==="out"){let _=d.out,B=Ui(_.lines,_.home),L=B?_.lines.slice(0,-1):_.lines;$.trips.push({key:`${g.date}|trip|${d.col}|${w}`,x:P.x+8,y:v,w:P.w-16,h:d.h,target:Y(_.target),l1:B?`${_.lead} · ${_.home&&_.home!=="Home"?_.home:"home"} ${B}`:_.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...L.map(ie=>({text:Gi(ie,_.home),warn:!1})),..._.warn?[{text:_.warn,warn:!0}]:[]],kids:_.kids.map(ie=>(b.get(ie)??q(0)).color),bad:!!_.warn,aria:`${m(d.col)}: ${_.lead}. ${_.lines.join(". ")}${_.warn?`. ${_.warn}`:""}`})}else if(d.kind==="own"){let _=Pe(d.event,P.x+8,v,P.w-16,d.h,!1,!0,d.col);$.cards.push(_),he[he.length-1].box=_}else if(d.kind==="act"){let _=O.get(d.item.event??""),B=Pe(_,P.x,v,P.w,d.h,d.item.clash,!0,d.col);$.cards.push(B),he[he.length-1].box=B}else{let _=g.rides[d.item.ride??-1],B=as(dt(_.index),ls(c,g,_.driver,_.start??void 0)),L=m(_.driver);$.rides.push({key:`${g.date}|ride|${_.index}`,x:P.x,y:v,w:P.w,h:d.h,target:We(_.index),l1:`${Nt} with ${L}`,l2:B.join(" → "),show2:!1,lines2:eo,dashed:!0,clash:d.item.clash,aria:`${y(d.col)} riding along with ${L}, ${R(ne(_.start))} to ${R(ne(_.end))}: ${B.join(" to ")}`})}});let pe=ge;for(let d of be.values())pe=Math.max(pe,d);for(let d of he){if(!d.box||d.end==null)continue;let w=d.y+d.h;for(let T of he)T.col!==d.col&&T.s>=d.s&&T.s<d.end&&(w=Math.max(w,T.y+T.h));d.end>=1440&&(w=pe);for(let T of he)T.col===d.col&&T.y>d.y&&(w=Math.min(w,T.y-yn));w=Math.min(w,pe),w>d.y+d.h&&(d.box.h=w-d.y)}k=pe+rs+6,$.anchors.push({t:D+1439,y:k})}),$.height=k,$}function ga(s,t,e,n){let o=[],i=(r,a)=>{r==null||a==null||o.push([r-Oi,Math.min(a,r+Wr)+Bi],[Math.max(r,a-Kr)-Oi,a+Bi])};for(let r of s.events)r.own?(i(...e(r)),r.takes!=null&&i(r.start,r.end)):i(r.arrive_by??r.start,r.end);for(let r of Object.values(s.kids))for(let a of r.items??[])i(a.start,a.end);for(let r of t){let a=s.drivers[r];if(a){for(let l of a.segments)l.type!=="home"&&i(l.start,l.end);for(let l of a.outings)i(l.start,l.end);for(let l of a.busy)i(l.start,l.end)}}return n!=null&&o.push([n-30,n+30]),o}function ma(s,t,e){let n=s.map(([l,h])=>[Math.max(t,l),Math.min(e,h)]).filter(([l,h])=>h>l).sort((l,h)=>l[0]-h[0]),o=[],i=t,r=(l,h)=>{let u=Math.ceil(l/30)*30,f=Math.floor(h/30)*30;f-u>=Ur&&o.push({from:u,to:f})},a=!1;for(let[l,h]of n)a&&l>i&&r(i,l),i=a?Math.max(i,h):h,a=!0;return o}function ba(s,t,e){let n=s*os,o=e+s;for(let i of t){let r=i.to-i.from;o>=i.to?n-=r*os-ji:o>i.from&&(n-=(o-i.from)*os-(o-i.from)/r*ji)}return n}function va(s){let t=Math.floor(s/60),e=s%60>=30;return`${t}${e?"½":""} hrs`}var ya=["","¼","½","¾"];function tt(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return ut(n);let o=Math.round(n*4),i=Math.floor(o/4),r=ya[o%4];return`${i||!r?i:""}${r} min`})}function no(s){let t=e=>e?{...e,text:tt(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(tt),warn:i.warn==null?i.warn:tt(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:tt(n.title),body:tt(n.body),note:n.note==null?n.note:tt(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:tt(o.note)}))}:{}}))}))}}var xa=2,wa=48;function so(s,t,e=wa){let n=[],o=new Set(G(s)),i=ce(s).map(b=>oe(s,b)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],a=0,l=0,h=0,u=0,f=t.minutes+e*60;for(let b of s.days){let c=ke(t.date,b.date),y=c===0?"":`${de(b.date)} · `,m=new Map(b.events.map(g=>[g.id,g])),$=g=>g&&m.has(g)?{day:b.date,event:g}:null,k=(g,E)=>c*1440+(g??m.get(E??"")?.start??0)<f;for(let g of b.issues)if(g.level==="problem"){if(!k(g.at,g.event)){h++,g.kind==="unassigned"&&u++;continue}a++,g.kind==="unassigned"&&l++,n.push({key:`${b.date}|${g.key}`,tone:g.kind==="unassigned"?"unassigned":"problem",title:y+g.title,body:g.body,target:$(g.event),suggestions:(g.suggestions??[]).map(E=>({id:E.id,label:E.label,note:E.note}))})}if(b.clashes.forEach((g,E)=>{if(!k(g.a.start,g.a.event)){h++;return}a++;let D=m.get(g.a.event??""),O=oe(s,g.kid),Y=(U,ae)=>{let ye=$(ae);return ye?{text:U,target:ye}:U},fe=[];if(g.b.type==="act"){let U=m.get(g.b.event??"");D&&U&&(fe=[Y(D.title,D.id),` ${R(D.start)}–${R(D.end)} and `,Y(U.title,U.id),` ${R(U.start)}–${R(U.end)} overlap.`])}else{let U=b.rides[g.b.ride??-1];D&&U&&(fe=[`${O} is in `,Y(`${Q(s,U.driver)}’s car`,U.serves[0]),` ${R(ne(g.b.start))}–${R(ne(g.b.end))}, during `,Y(D.title,D.id),"."])}n.push({key:`${b.date}|clash|${E}`,tone:"problem",title:`${y}${O} is double-booked`,body:fe.map(U=>typeof U=="string"?U:U.text).join(""),parts:fe,target:null,suggestions:[]})}),c>=0&&c<xa)for(let g of b.issues)g.level!=="heads_up"||!k(g.at,g.event)||n.push({key:`${b.date}|${g.key}`,tone:"heads_up",title:y+g.title,body:g.body,target:$(g.event),suggestions:[]});for(let g of b.unplaced??[]){if(!k(g.at)){h++;continue}a++;let E=g.people.map(O=>o.has(O)?Q(s,O):oe(s,O)),D=g.from_notes?"The For line in its notes":"Its title";n.push({key:`${b.date}|unplaced|${g.id}`,tone:"problem",title:`${y}${R(g.at)} ${g.title}: ${io(g).toLowerCase()}`,body:g.reason==="unknown"&&g.word?`${D} names “${g.word}”, who isn’t anyone in the family, so ${E.length?`it’s only in ${bt(E)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:b.date,id:g.id}})}for(let g of b.events)!g.problems.length||!k(g.start)||n.push({key:`${b.date}|notes|${g.id}`,tone:"heads_up",title:`${y}Check the notes on ${Ft(s,g)}’s ${g.title}`,body:`These lines couldn’t be read: ${g.problems.join("; ")}`,target:$(g.id),suggestions:[]})}return{items:n,problems:a,unassigned:l,later:h,laterUnassigned:u}}function io(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function $a(s,t,e,n,o=0){let i=new Set(G(s)),r=y=>{let m=y[0];return m==null?null:i.has(m)?ze:e.get(m)??null},a=[...(t.all_day??[]).map(y=>{let m=y.days>1?`Day ${y.day_number} of ${y.days}`:"";return{key:`${t.date}|allday|${y.id}`,title:y.stay?`🏨 ${y.title}`:y.title,note:y.stay?[Jr(s,y.people),m].filter(Boolean).join(" · "):m,color:r(y.people),cancelled:y.cancelled,warn:!1,pick:null,stay:y.stay&&!y.cancelled?y.id:null,canStay:!y.stay&&y.can_stay?y.id:null,notes:y.notes??""}}),...(t.unplaced??[]).map(y=>({key:`${t.date}|unplaced|${y.id}`,title:`${R(y.at)} ${y.title}`,note:io(y),color:null,cancelled:!1,warn:!0,pick:y.id,stay:null,canStay:null,notes:y.notes??""}))];if(!a.length)return null;let l=Math.max(120,n-mt),h=(y,m=7)=>30+m*y.title.length+(y.note?Math.min(m,5.6)*(y.note.length+2):0)+(y.notes?16:0)+(y.stay?12:0),u=0,f=0;for(;u<a.length&&f+h(a[u],6.4)<=o;)f+=h(a[u++],6.4);let b=0;f=0;for(let y of a.slice(u)){let m=Math.min(l,h(y));(!b||f+m>l)&&(b++,f=0),f+=m}let c=b?b*Yr+(b-1)*qi:0;return{key:`${t.date}|allday`,h:c,chips:a,inline:u}}function oo(s,t){let e=re(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=ke(t.date,i.date);if(!(r<0))for(let a of G(s))for(let l of i.drivers[a]?.outings??[]){if(l.start==null)continue;let h=r*1440+l.start;if(r*1440+ne(l.end,l.start)<=t.minutes)continue;let f=h-t.minutes,b={driver:a,name:Q(s,a),date:i.date,ahead:r,start:l.start,inMinutes:f,ongoing:f<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(c=>e.get(c)??q(0)),warn:l.warn,target:l.target&&i.events.some(c=>c.id===l.target)?{day:i.date,event:l.target}:null};(!n||o(b)<o(n)||o(b)===o(n)&&b.inMinutes<n.inMinutes)&&(n=b)}}return n}function ys(s,t){return(s.points?.log??[]).filter(e=>e.by===t)}function ao(s,t){let e=[s.done_at?fo(s.done_at,t.today,t.time_zone):""];return s.late&&e.push("late"),s.kid!==s.by&&(e.push(`from ${t.kids.find(n=>n.id===s.kid)?.name??"someone else"}`),!s.late&&!s.points&&e.push("a favor")),e.filter(Boolean).join(" · ")}function st(s){return s.state==="done"||s.state==="late"||vt(s.state)}function vt(s){return s==="skipped"||s==="excused"}var lo=780;function xs(s,t){return!!s.for_day&&(s.shows_from??s.due)===t&&!!s.due&&s.due>t}function ka(s,t,e){return s.state==="open"&&xs(s,t)&&e<lo}function co(s,t){return s.state==="open"&&!!s.for_day&&s.for_day===t}function ho(s,t){return s.chores.map(e=>ka(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:t>=lo&&co(e,s.today)?{...e,state:"overdue"}:e)}function Ta(s,t){return s.state==="overdue"&&s.for_day===t}function po(s){return s.state==="open"||s.state==="overdue"}function uo(s,t){if(st(s)||!s.open_to_others)return!1;let e=Date.parse(s.open_to_others);return!Number.isNaN(e)&&t>=e}function En(s,t,e){if(s.state==="skipped")return"Skipped";if(s.state==="excused")return"Excused";if(st(s)){let n=s.done_at?fo(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${bs(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${bs(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=ke(t,s.due);return`By ${o===1?"tomorrow":o<7?de(s.due):vs(s.due)}`}if(xs(s,t))return`Tonight · for ${bs(s.for_day,t)}`;if(co(s,t))return"For school today";if(s.due&&s.due>t){let n=ke(t,s.due);return n===1?"By tomorrow":`By ${n<7?de(s.due):vs(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function bs(s,t){let e=ke(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?de(s):vs(s)}function vs(s){return un(s)}function fo(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=Ea(e),i=o.day.format(n),r=o.time.format(n);return i===t?r:`${de(i)} ${r}`}var ro=new Map;function Ea(s){let t=ro.get(s);if(t)return t;let e=s;try{new Intl.DateTimeFormat("en-US",{timeZone:e})}catch{e=void 0}return t={day:new Intl.DateTimeFormat("en-CA",{year:"numeric",month:"numeric",day:"numeric",timeZone:e}),time:new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZone:e})},ro.set(s,t),t}function go(s,t,e=1440){let n=ho(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(u=>u.kid===o.id),a=new Map;for(let u of r){if(u.state!=="upcoming")continue;let f=u.shows_from??u.due??s.today;a.set(f,[...a.get(f)??[],u])}let l=r.filter(u=>u.state==="overdue"),h=r.filter(u=>u.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??q(i),overdue:l,now:h,done:r.filter(st),later:[...a.entries()].sort(([u],[f])=>u.localeCompare(f)).map(([u,f])=>({date:u,chores:f})),left:l.length+h.length}})}function mo(s,t=1440){return ho(s,t).filter(e=>e.state==="overdue"&&!Ta(e,s.today)||e.state==="open"&&(e.due==null||e.due<=s.today||xs(e,s.today))).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function ws(s){return!s.chores.length&&!s.templates.length}var nt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Ut(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>nt.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function $s(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${nt[n[0]]}-${nt[n.at(-1)]}`]:n.map(o=>nt[o])).join(", ")}var it="none";function Wt(s){return s==="daily"||s==="school"?"":"Any"}function bo(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1,points:null}}function vo(s){let t=s.days??Wt(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only,points:s.points??null}}function ks(s){return s.title.trim()?s.who.length?s.days===it?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function yo(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{},points:s.points}}function Ts(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function Es(s,t,e=1,n=!1,o=!1){if(s==="school"){let u=t.trim().replace(/-/g,"–"),f=o?u?`${u} Bring lunch days`:"Bring lunch days":u?`${u} school days`:"Every school day";return n?`${f}, the night before`:f}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let h=`${a.split(",").map(u=>{let f=u.trim();return f.toLowerCase()==="last"?"the last day":/^\d+$/.test(f)?`the ${Ts(Number(f))}`:`the ${f}`}).join(" and ")} ${r}`;return h[0].toUpperCase()+h.slice(1)}function Cs(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function _s(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function Ie(s){if(Number.isInteger(s))return String(s);let t=Math.trunc(s);return Math.abs(Math.abs(s-t)-.5)<1e-9?`${s<0?"-":""}${Math.abs(t)||""}½`:String(Math.round(s*10)/10)}function Ps(s,t){return!!s?.points?.leaders.includes(t)}function xo(s){let t=/\d+/.exec(s)?.[0];return t?Math.min(1e3,Number(t.slice(0,5))):null}function Ca(s){let t=Math.max(1,s.every??1),e=(s.days??Wt(s.repeats)).trim(),n;return s.repeats==="daily"?n=7/t:s.repeats==="monthly"?n=12/52/t:s.repeats==="school"?n=e?Ut(e)?.size??5:5:n=e===""||e.toLowerCase()==="any"?1/t:(Ut(e)?.size??1)/t,s.take_turns&&s.who.length>1?n/s.who.length:n}function wo(s,t,e=1){let n=Object.fromEntries(t.map(o=>[o,0]));for(let o of s){if(o.paused||o.problems.length)continue;let i=(o.points??e)*Ca(o);for(let r of o.who)r in n&&(n[r]=n[r]+i)}for(let o of t)n[o]=Math.round(n[o]*2)/2;return n}function Cn(s,t){return`${s}|${t}`}function yt(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function _n(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function $o(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function ko(s,t){return _n(t)<5&&!$o(s,t)}function Kt(s,t,e=new Map){if(!ko(s,t))return null;let n=Cn(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function xt(s,t){return ko(s,t)?s.menus?.[t]??null:null}var _a="From the school's menu feed.";function Pa(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==_a);return t.length?t.join(`
`):null}function Ce(s){return s.slice(0,7)}function Pn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Ss(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function To(s){let t=[];for(let e=Ce(s.first);e<=Ce(s.last);e=Ss(e))t.push(e);return t}function Eo(s,t,e,n=new Map){let o=`${e}-01`,i=yt(o,-_n(o)),r=[];for(;Ce(i)<=e;){let a=[];for(let l=0;l<5;l++){let h=yt(i,l),u=Ce(h)!==e,f=u?null:$o(t,h),b=u?null:Kt(t,h,n);a.push({date:h,day:Number(h.slice(8)),outside:u,off:f?f.title:null,lunch:b?.lunch??null,picked:b?.picked??!1,menu:u?null:xt(t,h)?.dish??null,sides:u?null:Pa(xt(t,h)?.details??""),past:h<s.today,today:h===s.today})}a.some(l=>!l.outside)&&r.push(a),i=yt(i,7)}return r}function Co(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function _o(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Po(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=yt(t,i),a=Kt(s,r,n);if(!a)continue;let l=ke(t,r);return{lunch:a.lunch,when:l===0?"today":l===1?"tomorrow":de(r),date:r,menu:xt(s,r)?.dish??null}}return null}var Sa={timeline:"timeline",full:"timeline",compact:"compact"};function Gt(s){let t=new URLSearchParams(s),e={},n=Sa[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}function Ms(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Ma(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function Aa(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&Ms(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function Da(s,t){let e=new Set(s.events.filter(i=>Ma(s,i)<=t).map(i=>i.id)),n=i=>Ms(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:Aa(r.segments,t),outings:r.outings.filter(a=>a.start==null||Ms(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function So(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?Da(e,t.minutes):e)}}var Mo=qe`
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
  /* Up for grabs: anyone who does it now earns points. Muted, so it doesn't shout over "Missed". */
  .chore-note .grabs {
    color: var(--muted);
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
`;function La(s,t,e,n,o=14){let i=s.top-o-8,r=e.h-s.bottom-o-8,a=t.h<=i,l=t.h<=r,h=n?a||!l&&i>r:!l&&(a||i>r),u=h?s.top-o-t.h:s.bottom+o,f=Math.max(8,Math.min(u,e.h-8-t.h)),b=Math.max(8,Math.min(s.x-t.w/2,e.w-8-t.w));return{left:Math.round(b),top:Math.round(f),above:h}}function Vt(s,t){for(let e of s.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var Sn=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?Vt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=Vt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let i=this.press;!i||i.el!==e||!e.isConnected||(i.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&Vt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=Vt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&Vt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let i=t.dataset.note;if(!i)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=i,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let a={w:r.offsetWidth,h:r.offsetHeight},l={w:window.innerWidth,h:window.innerHeight},h=La(e,a,l,n,o);r.style.left=`${h.left}px`,r.style.top=`${h.top}px`,r.classList.toggle("above",h.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};(()=>{if(typeof document>"u")return;let s=null,t=new Map;Ji((e,n)=>{let o=`${n}|${e}`,i=t.get(o);if(i!==void 0)return i;if(!s){if(!document.body)return null;s=document.createElement("span"),s.setAttribute("aria-hidden","true"),s.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;white-space:pre;letter-spacing:normal;word-spacing:normal;text-transform:none;contain:layout style",document.body.appendChild(s)}return s.style.font=n,s.style.font?(s.style.fontVariantNumeric="tabular-nums",s.textContent=e,i=s.getBoundingClientRect().width,t.size>2e4&&t.clear(),t.set(o,i),i):null})})();var hd=6e3,pd=1800,yr="mydashlight.rides.view",ud=1100,fd=440,gd=700,md=3*6e4,hr=1200,bd=450,vd=110;function yd(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var On=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,pr=J`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,xd=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9z"/></svg>`,ur=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,wd=new URL("emoji.json",import.meta.url).href,fr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],gr=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,mr=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,$d=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,kd=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Xt={bring:"Bring",buy:"Buy"};function Td(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function ue(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Xs(s){return un(s)}function Ed(s,t){return ms(s,t)||we(s).split(",")[0]}function Cd(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function _d(){try{return localStorage.getItem(yr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function Pd(s){try{localStorage.setItem(yr,s)}catch{}}function Bn(s,t){return G(s).includes(t)?Q(s,t):oe(s,t)}function Sd(s,t){if(t.driver==="none")return{driver:"none",riders:[],backRiders:[]};let e=xr(s,t),n=l=>(l??[]).filter(h=>t.people.includes(h)&&h!==e),o=n(t.ownWay),i=n(t.ownBack),r=t.people.find(l=>G(s).includes(l));if(!e||e===r&&!o.length&&!i.length)return{driver:"",riders:[],backRiders:[]};let a=l=>t.people.filter(h=>h!==e&&!l.includes(h));return{driver:e,riders:a(o),backRiders:a(i)}}function xr(s,t){if(t.driver==="none")return null;let e=G(s).filter(o=>t.people.includes(o)),n=t.people.filter(o=>e.includes(o));return t.driver&&n.includes(t.driver)?t.driver:n[0]??null}function Zt(s){return s.days.every(t=>!t.events.length)}var Jt=class extends ve{constructor(){super();this.flipUntil=0;this.stopWatching=null;this.resize=null;this.clockTimer=null;this.shineTimer=null;this.idleTimer=null;this.toastTimer=null;this.toastUndo=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Gt(location.search).view;this.urlPage=Gt(location.search).page;this.urlPast=Gt(location.search).past;this.urlDayPicker=Gt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},md))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.problemOpen=!1,this.mode=this.urlView??_d(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.pointsFlash=new Map,this.manage=!1,this.totals=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.shineTimer=setInterval(()=>this.shineLeaders(),hd),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new Sn(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.shineTimer&&clearInterval(this.shineTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),l=e.kids.find(h=>h.id===r);(!l||(l.picks[a]??null)===i||!Kt(l,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores){let i=n.get(o.id);i===void 0||!br(o,i)||(n.delete(o.id),i===!0&&o.earned&&this.flashPoints(o.id,o.earned))}for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=no(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}shineLeaders(){if(!(document.hidden||matchMedia("(prefers-reduced-motion: reduce)").matches))for(let e of this.renderRoot.querySelectorAll(".leader .name"))e.animate?.([{backgroundPosition:"100% 0"},{backgroundPosition:"0 0"}],{duration:pd,easing:"ease-in-out"})}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<ud)return!1;let e=this.plan;return!e||this.width-fd>=ps(ce(e).length,G(e).length)}today(){return It(this.plan?.time_zone??yd())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:So(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=to(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(u=>u.date===this.pinDay)?.h??Ht,a=fs(e,i.scrollTop+r+4),l=n.days[Math.floor(a/1440)]?.date,h=l?o.days.findIndex(u=>u.date===l):-1;h>=0&&(this.keepAt=h*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,Zi(o,e)-Vi(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let l=1/0;if(this.mode==="timeline"){for(let h of a.events)l=Math.min(l,h.arrive_by??h.start);for(let h of Object.values(a.drivers))for(let u of h.outings)u.start!=null&&(l=Math.min(l,u.start))}this.scrollToTime(r*1440+(Number.isFinite(l)?Math.max(0,l-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let l of this.board.dayHeads)l.y<=n+1&&(o=l);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),a=this.today().date;if(r){let l=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),h=l>0?"up":"down";this.board.dayHeads.some(u=>u.date===a)&&o.date!==a?i=`${h}|Today`:this.mode==="timeline"&&Math.abs(l)>e.clientHeight*.6&&(i=`${h}|${o.date===a?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.totals=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(!this.choreDone(e)&&!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n,o){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=o!==void 0||!this.choreDone(e),r=new Map(this.choreDraft);r.set(e.id,o??i),this.choreDraft=r;try{await this.backend.setChoreDone(e.id,i,n&&n!==e.kid?n:void 0,o)}catch(a){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let h=a instanceof K?a:new K("error",String(a));this.showToast(h.code==="preview"?h.message:`Couldn’t save that. ${h.message}`)}}flashPoints(e,n){this.pointsFlash=new Map(this.pointsFlash).set(e,n),window.setTimeout(()=>{if(this.pointsFlash.get(e)!==n)return;let o=new Map(this.pointsFlash);o.delete(e),this.pointsFlash=o},2600)}renderScore(e,n=!1){let o=this.chores?.points,i=o?.scores[e];if(!o||i===void 0)return x;let r=o.leaders.includes(e),a=Ie(i),l=n?o.possible?.[e]:void 0,h=`${a} ${i===1?"point":"points"}${l!==void 0?` out of ${Ie(l)}`:""} in the last ${o.days} days${r?", the most":""}`;return p`<span class="score ${r?"lead":""}" role="img" aria-label=${h} title=${h}
      >${r?"★ ":""}${a}${l!==void 0?p`<span class="out-of">/${Ie(l)}</span>`:x}</span
    >`}choreDone(e){let n=this.choreDraft.get(e.id);return n===void 0?st(e):n!==!1}editMenu(e,n){let o=this.lunch?.kids??[],i=xt(e,n),r=o.filter(a=>a.id===e.id||i&&xt(a,n)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof K?o:new K("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(Cn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let h of n)a.delete(Cn(e,h));this.lunchDraft=a;let l=r instanceof K?r:new K("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?vo(e):bo(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(cr(),dr))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ks(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(yo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof K?n:new K("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof K?n:new K("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Ht;this.keepAt=n&&this.board?fs(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||Pd(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),i=this.plan;if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...ce(i),...G(i)]);this.forPick={day:e,id:n,placed:!1,label:`${R(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}openStayPick(e,n){let o=this.plan,i=o?.days.find(l=>l.date===e)?.all_day?.find(l=>l.id===n);if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...ce(o),...G(o)]),a=l=>i.driver&&i.driver!=="none"?i.people.filter(h=>r.has(h)&&h!==i.driver&&!(l??[]).includes(h)):[];this.forPick={day:e,id:n,placed:!1,label:`🏨 ${i.title}`,recurring:!1,word:null,fromNotes:!!i.from_notes,people:i.people.filter(l=>r.has(l)),scope:"this",busy:!1,stay:!0,timed:!!i.timed,driver:i.driver==="none"||G(o).includes(i.driver??"")?i.driver??"":"",ownWay:a(i.riders),ownBack:a(i.back_riders??i.riders),noAddress:!!i.no_address,maybe:!i.stay}}changeForPick(e,n,o){let i=e.who?.[o.event_id],r=i?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${R(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!i?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e="save"){let n=this.forPick,o=this.plan,i=this.backend;if(!n||!o||!i||e==="save"&&!n.people.length)return;let r=e==="clear"?[]:n.people;this.forPick={...n,busy:!0};try{e==="notStay"?await i.setPeople(n.id,null,"this",void 0,!1):await i.setPeople(n.id,r,n.scope,n.stay&&n.timed&&e==="save"?Sd(o,n):void 0,n.maybe&&e==="save"?!0:void 0),this.forPick=null;let a=n.label.replace(/^\S+ /,""),l=r.map(u=>Bn(o,u)),h=G(o).filter(u=>r.includes(u));this.showToast(e==="notStay"?`Saved. ${a} isn’t a stay now.`:e==="clear"?`Saved. ${a} goes by the names in its title again.`:n.stay?`Saved. ${bt(h.map(u=>Q(o,u)))}’s rides start from ${a} now.`:`Saved. ${a} is in ${bt(l)}’s ${l.length>1?"lanes":"lane"} now.`,e==="notStay"?()=>void i.setPeople(n.id,null,"this",void 0,null).catch(u=>this.showToast(`Couldn’t undo that. ${String(u)}`)):null)}catch(a){this.forPick&&(this.forPick={...this.forPick,busy:!1});let l=a instanceof K?a:new K("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}renderForPick(e){let n=this.plan,o=e.stay?n?.days.some(E=>E.date===e.day&&E.all_day?.some(D=>D.id===e.id&&(D.stay||D.can_stay))):e.placed?n?.days.some(E=>E.date===e.day&&E.events.some(D=>D.id===e.id)):!!this.findUnplaced(e.day,e.id),i=e.stay?"Who’s staying?":"Who is this for?",r=p`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return p`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">${i}</span></div>
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
          <span class="ed-title">${i}</span>
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
    `}renderStayDrive(e,n,o){let i=n.people.filter(f=>G(e).includes(f)),r=xr(e,n),a=n.people.filter(f=>f!==r),l=re(e),h=ce(e),u=(f,b)=>{let c=n[b]??[],y=!h.includes(f),m=y?ze:l.get(f)??q(0),$=Bn(e,f);return p`<button
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
        <div role="group" aria-label="Who drives there and back" class="choices" style="grid-template-columns:repeat(${i.length+1},1fr)">
          ${i.map(f=>p`<button type="button" class="choice" aria-pressed=${r===f?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:f})}>
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
      ${n.noAddress?p`<p class="field-hint">Add the hotel’s address to the event for exact drive times.</p>`:x}`}renderForLine(e,n,o){let i=e.who?.[o.event_id];if(!i)return x;let r=re(e);return p`<span class="ed-for"
      >${i.people.map(a=>{let l=r.get(a)??ze,h=Bn(e,a);return p`<span class="for-who" style="--c:${l.color};--rgb:${l.rgb}"
          ><span class="avatar ${r.has(a)?"":"driver"}" aria-hidden="true">${ue(h)}</span>${h}</span
        >`})}${i.from_notes?"":p`<span class="for-guess">from the title</span>`}<button
        type="button"
        class="ed-for-change"
        @click=${()=>this.changeForPick(e,n,o)}
      >
        Change
      </button></span
    >`}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1}}showToast(e,n=null){this.toast=e,this.toastUndo=n,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null,this.toastUndo=null},n?1e4:7e3)}undoToast(){let e=this.toastUndo;this.toast=null,this.toastUndo=null,this.toastTimer&&clearTimeout(this.toastTimer),e?.()}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof K?i:new K("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend,i=this.plan,r=!n&&i?Yi(i,e):null;if(r&&i){let a=Ft(i,e),l=i.who?.[e.event_id]?.people??[],h=this.findAnyCopy(e,r);this.save("attending",n,async()=>{await o.setPeople(e.id,r,"this"),this.closeEditor(),this.showToast(`Saved. ${a} is off ${e.title} now.`,h?()=>void this.save("attending",!0,()=>o.setPeople(h,l,"this")):null)});return}this.save("attending",n,()=>o.setAttending(e.id,n,"this"))}findAnyCopy(e,n){return this.plan?.days.find(r=>r.events.some(a=>a.id===e.id))?.events.find(r=>r.event_id===e.event_id&&r.id!==e.id&&n.includes(r.own??r.kid))?.id??null}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(l=>l!==n):[...r,n];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let i=((this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by)??e.start)+n;this.arriveDraft=i===e.start?null:i,this.timesOpen={...this.timesOpen,arrive:!0},this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),hr)}clearArrive(){this.arriveDraft=null,this.timesOpen={...this.timesOpen,arrive:!1},this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,i=Math.max(e.start+5,(o??e.end)+n);this.leaveDraft=i===e.end?null:i,this.timesOpen={...this.timesOpen,leave:!0},this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),hr)}clearLeave(){this.leaveDraft=null,this.timesOpen={...this.timesOpen,leave:!1},this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>i.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,vd)},bd)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?so(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?mo(this.chores,this.today().minutes).filter(b=>!this.choreDone(b)):[],l=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,h=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?this.choreDone(this.whoFor)?"Done chore":"Who did it":this.sel?"Change this ride":"Needs attention",u=p`<aside class="panel" aria-label=${h}>
      ${l??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,f=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<gd?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${f?this.renderBanner(e):x}
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
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),a="",l=null;if(e){let c=e.time_zone,y=`Plan from ${ts(new Date(e.updated),new Date,c)}`;if(this.error){let m=["connection_lost","timeout","not_running"].includes(this.error.code);l={short:_i(this.error),detail:m?null:this.error.message,age:y}}else e.status&&!e.status.ok?l={...Pi(e.status.error),age:y}:this.backend?.live||(a=`Updated ${ts(new Date(e.updated),new Date,c)}`)}let h=(c,y,m,$)=>p`
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
          ${this.wide||b&&!o?x:p`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
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
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${ut(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${de(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=p`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${ue(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(h=>p`<span class="kid-dot" style="background:${h.color}"></span>`)}</span>
        ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:x}
      </span>
    `,l=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?p`<button type="button" class=${l} @click=${()=>this.open(n.target)}>${a}</button>`:p`<div class=${l}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return x;let n=this.today().date,o=re(e),i=this.railShown;return p`<div
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
        ${e.days.map(r=>{let a=gs(r),l=r.events.length,h=r.events.slice(0,4).map(f=>f.own?ze.color:o.get(f.kid)?.color??q(0).color),u=`${we(r.date)}: ${l?`${l} ${l===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return p`<button
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
    </button>`}renderQuiet(e){let n=ce(e),o=G(e),i=re(e),r=n.map(a=>oe(e,a));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,l)=>J`<circle cx=${50+l*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Cd(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let l=i.get(a);return p`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
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
      ${e.allDay.length>e.inline?p`<div class="day-strip" style="padding-left:${mt}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:x}`}renderStripChip(e,n,o){let i=p`<span class="strip-title">${n.title}</span>${n.note?p`<span class="strip-note">${n.note}</span>`:x}${n.notes?pr:x}`,r=n.pick,a=n.stay??n.canStay;return a?p`<button
        type="button"
        class="strip-chip ${n.stay?"hotel":"maybe"} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
        style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
        tabindex=${o?-1:0}
        data-note=${n.notes||x}
        aria-label=${`${n.title}: ${n.note}. ${n.stay?"Pick who’s staying":"Staying here? Pick who"}`}
        @click=${()=>this.openStayPick(e.date,a)}
      >
        ${i}
      </button>`:r?p`<button
          type="button"
          class="strip-chip warn plain pick"
          tabindex=${o?-1:0}
          data-note=${n.notes||x}
          aria-label=${`${n.title}: ${n.note} Pick who it’s for`}
          @click=${()=>this.openForPick(e.date,r)}
        >
          ${i}
        </button>`:p`<span
          class="strip-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
          style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
          tabindex=${n.notes&&!o?0:x}
          data-note=${n.notes||x}
          >${i}</span
        >`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,i=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(c=>!c.own&&c.event_id===o.event.event_id).map(c=>c.id):[]),r=c=>!!c&&!!n&&c.day===n.day&&i.has(c.event),a=e.dayHeads.find(c=>c.date===this.pinDay)??e.dayHeads[0],l=e.width,h=e.dayHeads[e.dayHeads.length-1],u=Math.max(e.height+8,192),f=100,b=[...e.links.map(c=>({t:"link",x:c,z:c.layer??0})),...e.preps.map(c=>({t:"prep",x:c,z:c.layer??f-1})),...e.cards.map(c=>({t:"card",x:c,z:c.layer??f})),...e.rides.map(c=>({t:"ride",x:c,z:c.layer??f+1}))].sort((c,y)=>c.z-y.z);return p`
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
          ${e.columns.map(c=>p`<div class="col-head ${c.kind} ${Ps(this.chores,c.id)?"leader":""}" style="left:${c.x}px;width:${c.w}px;--c:${c.dot};--rgb:${c.rgb}">
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
                ${y.event.notes?pr:x}
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
                ${Md(l-60,c.h)}
              </div>
              <span class="fold-label" style="top:${c.y+c.h/2-9}px" title="${Re(c.from)} to ${Re(c.to)}">${c.label}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${l-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:x}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,a=this.plan,l=i+n.length,h=this.chores,u=!!h&&!ws(h);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?x:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${u?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?p`<div class="attn-chores">${n.map(f=>this.renderChoreRow(f,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?p`<div class="all-clear">
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
    `}kidColorOf(e){let n=this.plan?re(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return q(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(u=>u.id===e);if(!o||!i)return x;this.tick;let r=this.today(),a=Po(i,r.date,r.minutes,this.lunchDraft);if(!a)return x;let l=Xt[a.lunch],h=`${l} lunch ${a.when}${a.menu?`: ${a.menu}`:""}`;return p`<span class="lunch-chip ${a.lunch} ${n?"small":""}" title=${h}
      >${a.lunch==="bring"?gr:mr}<span class="lunch-chip-text"
        >${l}${n?x:` ${a.when}`}${!n&&a.menu?p`<span class="lunch-chip-menu"> · ${a.menu}</span>`:x}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=To(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Ce(e.today),i=n.indexOf(o),r=u=>{let f=n[i+u];f&&(this.lunchMonth=f)},a=e.kids.some(u=>u.id===this.lunchKid)?this.lunchKid:null,l=a?e.kids.filter(u=>u.id===a):e.kids,h=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:x;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${J`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Pn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
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
          ${this.menuMode?"Done":p`${ur} Edit menus`}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),a=Eo(e,n,o,this.lunchDraft),l=_o(a),h=a.flat(),u=h.filter(m=>!m.outside&&!m.past&&m.lunch),f=n.days_off.filter(m=>Ce(m.first)<=o&&o<=Ce(m.last)),b=m=>u.filter($=>_n($.date)===m),c=m=>{let $=b(m);if(!$.length)return;let k=$.every(g=>g.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(g=>g.date),k)},y=u.length?`${l.bring} Bring · ${l.buy} Buy${o===Ce(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
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
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?kd:$d}${i?"Show everyone":"Expand to pick"}
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
        ${h.map(m=>this.renderLunchCell(n,m,i))}
      </div>
      ${f.length?p`<p class="lunch-offs">
            No school:
            ${f.map(m=>{let $=m.first<`${o}-01`?`${o}-01`:m.first,k=Ce(m.last)>o?yt(`${Ss(o)}-01`,-1):m.last;return`${$===k?Xs($):`${Xs($)}–${Xs(k)}`} ${Co(m.title)}`}).join(" · ")}
          </p>`:x}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return p`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",l=this.menuMode,h=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),u=l?`${e.name}, ${we(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${we(n.date)}: ${Xt[i]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Xt[r]}.`;return p`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${l?"editing":""} ${h?"sel":""}"
      ?disabled=${n.past&&!l}
      aria-label=${u}
      @click=${()=>l?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?gr:mr}${Xt[i]}</span>
      ${n.menu?p`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?p`<span class="lunch-sides">${n.sides}</span>`:x}`:l?p`<span class="lunch-menu add">${On} Menu</span>`:x}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(D=>D.id===e.kid),a=(this.plan?re(this.plan).get(e.kid):void 0)??q(Math.max(0,r)),l=o.kids[r]?.name??"",h=this.choreDraft.get(e.id),u=h===void 0||br(e,h)?e:{...e,state:h===!1?"open":h===!0?"done":h,done_at:h===!1?null:new Date().toISOString()},f=i&&u.done_by&&u.done_by!==e.kid?o.people?.find(D=>D.id===u.done_by)?.name??u.done_by_name??null:null,b=`${En(u,o.today,o.time_zone)}${f?` · by ${f}`:""}`,c=i||po(e),y=i?this.pointsFlash.get(e.id):void 0,m=!i&&uo(e,Date.now()),$=`${n?`${l}: `:""}${e.title}. ${b?`${b}. `:""}${m?"Up for grabs. ":""}${y?`Earned ${Ie(y)}. `:""}${i?"Done.":"Tap when it’s done."}`,k=p`<span class="box" aria-hidden="true"
        >${i?J`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d=${vt(u.state)?"M6 12h12":"M5 12.5l4.5 4.5L19 7.5"}/></svg>`:x}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:x}
      <span class="chore-text">
        <span class="chore-title">${n?p`<span class="chore-kid">${l}</span> · `:x}${e.title}</span>
        ${b||m?p`<span class="chore-note">${b}${m?p`<span class="grabs">${b?" · ":""}up for grabs</span>`:x}</span>`:x}
      </span>
      ${y?p`<span class="pts-flash" aria-hidden="true">+${Ie(y)}</span>`:x}`,g=`chore ${i?"done":""} ${vt(u.state)?"skipped":""} ${e.state==="overdue"&&!i?"overdue":""} ${c?"":"later"}`,E=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return c?p`<button type="button" class=${g} style=${E} aria-pressed=${i?"true":"false"} aria-label=${$} @click=${()=>this.tapChore(e)}>
          ${k}
        </button>`:p`<div class=${g} style=${E}>${k}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(ws(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${On} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:x;this.tick;let i=go(e,this.plan?re(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">${this.totals?`Points from the last ${e.points?.days??7} days, out of what each kid’s own chores were worth.`:"Tap a chore when it’s done."}</span>
        ${e.points?p`<button type="button" class="btn ${this.totals?"dark":""}" aria-pressed=${this.totals?"true":"false"} @click=${()=>{this.closeChorePanels(),this.flipUntil=Date.now()+400,this.totals=!this.totals}}>${this.totals?"Back to chores":p`${xd} Points this week`}</button>`:x}
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${On} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${ur} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols ${Date.now()<this.flipUntil?"flip":""}" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(l=>!this.choreDone(l)).length+r.now.filter(l=>!this.choreDone(l)).length;return p`<section class="chore-col ${Ps(e,r.kid)?"leader":""}" style="--c:${r.color.color};--rgb:${r.color.rgb};--k:${r.color.ink}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${ue(r.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${r.name}</span>${this.renderScore(r.kid,this.totals)}</span>
                <span class="sub-row"
                  ><span class="sub">${this.totals?Ad(ys(e,r.kid).length):a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span
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
            ${n.later.map(o=>p`<h3 class="chore-group">${o.date===e.today?"Later today":Ed(o.date,e.today)}</h3>
                ${o.chores.map(i=>this.renderChoreRow(i))}`)}
            ${!n.overdue.length&&!n.now.length&&!n.done.length&&!n.later.length?p`<p class="chore-none">No chores this week.</p>`:x}
          </div>`}renderPointsLog(e,n){let o=ys(e,n);return p`<div class="points-log">
      ${o.length?o.map(i=>p`<div class="log-row ${i.points?"":"nothing"}">
              ${i.icon?p`<span class="chore-icon" aria-hidden="true">${i.icon}</span>`:p`<span class="chore-icon"></span>`}
              <span class="chore-text">
                <span class="chore-title">${i.title}</span>
                <span class="chore-note">${ao(i,e)}</span>
              </span>
              <span class="log-pts">${i.points?`+${Ie(i.points)}`:"0"}</span>
            </div>`):p`<p class="chore-none">No chores done in the last ${e.points?.days??7} days.</p>`}
    </div>`}renderWeeklyPoints(e){let n=wo(e.templates,e.kids.map(i=>i.id),e.points?.default??1),o=this.plan?re(this.plan):void 0;return p`<section class="week-points" aria-label="Points a week">
      <span class="week-points-label">Points available per week</span>
      ${e.kids.map((i,r)=>{let a=o?.get(i.id)??q(r);return p`<span class="week-kid" style="--c:${a.color};--rgb:${a.rgb}"
          ><span class="avatar" aria-hidden="true">${ue(i.name)}</span>${i.name} <strong>${Ie(n[i.id]??0)}</strong></span
        >`})}
    </section>`}renderTemplateRow(e){let n=this.chores,o=n.kids,i=this.plan?re(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(_s).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${Cs(e.who,o,e.take_turns)} · ${Es(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}${n.points?` · ${vr(e.points??n.points.default)}`:""}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:x}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let h=o.findIndex(f=>f.id===l),u=i?.get(l)??q(Math.max(0,h));return p`<span class="kid-dot" style="background:${u.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${On} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.points&&e.templates.length?this.renderWeeklyPoints(e):x}
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?p`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:x}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return p``;let o=n.kids,i=this.plan?re(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(m=>m.id===e.template):void 0,l=ks(e),h=(a?.problems??[]).filter(m=>m!=="who:"),u=(m,$,k,g=!1)=>p`<button type="button" class="choice ${g?"wide":""}" aria-pressed=${m?"true":"false"} ?disabled=${r} @click=${k}>${$}</button>`,f=(m,$,k,g)=>p`<button type="button" class="chip" aria-pressed=${m?"true":"false"} aria-label=${g??x} ?disabled=${r} @click=${k}>${$}</button>`,b=m=>{m!==e.repeats&&this.changeDraft({repeats:m,days:a&&a.repeats===m?a.days??Wt(m):Wt(m)})},c=m=>{let $=e.who.includes(m)?e.who.filter(k=>k!==m):o.filter(k=>k.id===m||e.who.includes(k.id)).map(k=>k.id);this.changeDraft({who:$})},y;if(e.repeats==="school"){let m=e.days===it?new Set:e.days===""?new Set([0,1,2,3,4]):Ut(e.days)??new Set,$=k=>{let g=new Set(m);g.has(k)?g.delete(k):g.add(k),this.changeDraft({days:g.size===5?"":g.size?$s(g):it})};y=p`<div class="field">
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
                <span class="arrive-value">${Ts($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${m.toLowerCase()==="last"?"Due on the month’s last day.":k?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")y=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let m=e.days===""||e.days.toLowerCase()==="any",$=e.days===it?new Set:m?new Set:Ut(e.days)??new Set,k=g=>{let E=new Set($);E.has(g)?E.delete(g):E.add(g),this.changeDraft({days:E.size?$s(E)||"Mon-Sun":it})};y=p`<div class="field">
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
          <span class="ed-meta">${e.who.length?Cs(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===it?"No days picked":Es(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${h.length?p`<p class="field-hint bad">${h.map(_s).join(". ")}. Saving fixes it.</p>`:x}
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
          ${fr.map(m=>f(e.icon===m,m,()=>this.changeDraft({icon:e.icon===m?null:m}),`Picture ${m}`))}
          ${e.icon&&!fr.includes(e.icon)?f(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):x}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${wd}
              @emoji-click=${m=>{let $=m.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:x}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((m,$)=>{let k=i?.get(m.id)??q($),g=e.who.includes(m.id);return p`<button type="button" class="who-chip" style="--c:${k.color};--rgb:${k.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${()=>c(m.id)}>
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
        <span class="field-label every-unit">${Td(e.repeats,e.every)}</span>
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
          @input=${m=>{let $=m.target,k=xo($.value);$.value=k===null?"":String(k),this.changeDraft({points:k})}}
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
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return p``;let o=e.busy,i=u=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...u})},r=u=>i({kids:e.kids.includes(u)?e.kids.filter(f=>f!==u):[...e.kids,u]}),a=n.kids.filter(u=>Kt(u,e.date)),l=e.dish.trim(),h=e.kids.length?l?null:"Type what’s served":"Pick who gets this menu";return p`
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
          @input=${u=>i({dish:u.target.value})}
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
          @input=${u=>i({details:u.target.value})}
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
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return p``;if(this.choreDone(e))return this.renderDoneChore(e,n);let o=n.people?.length?n.people:n.kids.map(f=>({...f,role:"kid"})),i=n.kids.findIndex(f=>f.id===e.kid),r=n.kids[i],a=this.plan?re(this.plan):void 0,l=a?.get(e.kid)??q(Math.max(0,i)),h=o.filter(f=>f.id!==e.kid),u=f=>{let b=n.kids.findIndex(c=>c.id===f.id);return b>=0?(a?.get(f.id)??q(b)).color:"var(--dark)"};return p`
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
    `}renderDoneChore(e,n){let o=n.kids.find(l=>l.id===e.kid),i=e.done_by&&e.done_by!==e.kid?n.people?.find(l=>l.id===e.done_by)?.name??e.done_by_name:null,r=`${En(e,n.today,n.time_zone)}${i?` · by ${i}`:""}`,a=!vt(e.state)&&e.earned!=null?` · ${vr(e.earned)}`:"";return p`
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
    </div>`}ownHint(e,n){let o=Ft(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${R(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${R(n.start)} to ${R(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>G(e).includes(r)?Q(e,r):oe(e,r));return`${o} drives there and back${i.length?`, with ${bt(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:o,event:i}=n,r=G(e),a=Xi(e,i),l=Ft(e,i),h=!!this.pending,u=v=>this.pending?.key===v?this.pending.value:void 0,f=[...e.people?.carpools??[]];for(let v of e.days)for(let S of v.events)for(let P of[S.drop,S.pick])P&&P!=="none"&&!r.includes(P)&&!f.some(_=>_.toLowerCase()===P.toLowerCase())&&f.push(P);let b=new Set(e.days.flatMap(v=>v.events.filter(S=>S.title===i.title).flatMap(S=>[S.drop,S.pick].map(P=>(P??"").toLowerCase()))));f.sort((v,S)=>Number(b.has(S.toLowerCase()))-Number(b.has(v.toLowerCase())));let c=v=>{if(!i.sides.includes(v))return x;let S=u(v)??u("both"),P=v==="drop"?i.drop:i.pick,_=S!==void 0?String(S):i.no_ride_unless_named&&P==="none"?"":P,B=_===""&&!(S===void 0&&i.no_ride_unless_named),L=_&&_!=="none"&&!r.includes(_)?_:"",ie=I=>{this.otherOpen=null,this.setRide(i,v,_===I?"":I,r)},H=[...r.map(I=>[I,us(e,I)]),["none","Not needed"]],C=`${i.id}|${v}`,N=this.otherOpen===C;return p`<div class="field ride-box">
        <span class="field-label">${v==="drop"?"Drop-off":"Pick-up"} ${B?p`<span class="nobody">· nobody yet</span>`:x}</span>
        <div role="group" aria-label=${v==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${H.length+1}, minmax(0, 1fr))">
          ${H.map(([I,xe])=>p`<button type="button" class="choice" aria-pressed=${_===I?"true":"false"} ?disabled=${h} @click=${()=>ie(I)}>
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
              ${f.map(I=>p`<button type="button" class="chip" aria-pressed=${_.toLowerCase()===I.toLowerCase()?"true":"false"} ?disabled=${h} @click=${()=>ie(I)}>
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
          @change=${I=>{let xe=I.target.value.trim();xe&&xe!==_&&ie(xe)}}
          @keydown=${I=>{I.key==="Enter"&&I.target.blur()}}
        />`:x}
        ${!g&&_!==""&&_!=="none"?y(v,_):x}
      </div>`},y=(v,S)=>{let P=u(`along-${v}`),_=P!==void 0?P:v==="pick"?i.pick_along??[]:i.along,B=new Set(o.events.filter(H=>H.event_id===i.event_id&&!H.own).map(H=>H.kid)),L=[...ce(e).filter(H=>H!==i.kid&&!B.has(H)),...r.filter(H=>H!==S)];return L.length?p`<div class="field-sub">
        <span class="field-label">${v==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${v==="pick"?"Coming home too. Anyone already there just gets in.":v==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${v==="drop"?"Riding along on the drop-off":v==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="who-chips">
          ${L.map(H=>{let C=r.includes(H),N=C?Q(e,H):oe(e,H),I=C?ze:re(e).get(H)??q(0);return p`<button
              type="button"
              class="who-chip"
              style="--c:${I.color};--rgb:${I.rgb}"
              aria-pressed=${_.includes(H)?"true":"false"}
              ?disabled=${h}
              @click=${()=>this.toggleAlong(i,H,v)}
            >
              <span class="avatar ${C?"driver":""}" aria-hidden="true">${ue(N)}</span>${N}
            </button>`})}
        </div>
      </div>`:x},m=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",$=i.drop===i.pick&&r.includes(i.drop),k=u("stay"),g=k!==void 0?!!k:i.stay&&$,E=u("along"),D=E!==void 0?E:i.along,O=i.own?[...ce(e),...r.filter(v=>v!==i.own)]:[],Y=i.own!=null&&i.takes!=null,fe=i.own!=null&&!Y,U=u("takes"),ae=U!==void 0?U:i.takes??null,ye=u("arrive"),Fe=this.arriveDraft!==void 0?this.arriveDraft:ye!==void 0?ye:i.arrive_by,$e=u("leave"),Ue=this.leaveDraft!==void 0?this.leaveDraft:$e!==void 0?$e:i.leave_by??null,ge=(v,S)=>{let P=v==="arrive",_=P?i.start:i.end,B=ie=>()=>P?this.nudgeArrive(i,ie):this.nudgeLeave(i,ie),L=(ie,H,C,N)=>p`<button
          type="button"
          class="step"
          aria-label=${H}
          ?disabled=${h||N}
          @pointerdown=${()=>this.startHold(B(ie))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(B(ie))}
        >
          ${C}
        </button>`;return p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${P?"Arrive":"Leave"}</span>
          <span class="field-hint">${pn(S-_)}</span>
        </span>
        <span class="stepper">
          ${L(-5,"Five minutes earlier","−",!P&&S-5<=i.start)}
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
      </div>`},Oe=i.sides.includes("pick")||i.own!=null,Be=Fe!=null||this.timesOpen.arrive,Ne=Oe&&(Ue!=null||this.timesOpen.leave),Pe=v=>()=>{this.timesOpen={...this.timesOpen,[v]:!0}},dt=()=>p`${Be?ge("arrive",Fe??i.start):x}
      ${Ne?ge("leave",Ue??i.end):x}
      ${!Be||!Ne&&Oe?p`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${Be?x:p`<button type="button" class="chip" ?disabled=${h} @click=${Pe("arrive")}>Arrive early or late</button>`}
              ${!Ne&&Oe?p`<button type="button" class="chip" ?disabled=${h} @click=${Pe("leave")}>Leave early or late</button>`:x}
            </div>
          </div>`:x}`,We=i.sides.includes("drop")&&i.sides.includes("pick"),Se=We&&(g||this.stayDraft===i.id),Me=()=>{let v=We?p`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${Se?"false":"true"}
              ?disabled=${h}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,m)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${Se?"true":"false"}
              ?disabled=${h}
              @click=${()=>{m?this.toggleStay(i,!0,m):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:x;if(!Se)return p`${v} ${c("drop")} ${c("pick")}`;let S=g&&$?i.drop:"";return p`${v}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${S?x:p`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(P=>p`<button
                type="button"
                class="choice"
                aria-pressed=${S===P?"true":"false"}
                ?disabled=${h}
                @click=${()=>{if(S===P||!this.backend)return;let _=this.backend;this.stayDraft=null,this.save("stay",!0,()=>_.setRide(i.id,"both",P,this.scope,!0))}}
              >
                ${Q(e,P)}
              </button>`)}
          </div>
          ${S?y("both",S):x}
        </div>`},se=[],ee=v=>v==="none"?"Not needed":us(e,v),be=v=>r.includes(v)?Q(e,v):oe(e,v),he=(v,S,P)=>{S===""&&!P.length||se.push(`${v}: ${[S===""?"TBD":ee(S),...P.map(be)].join(", ")}`)},Ke=v=>i.no_ride_unless_named&&v==="none"?"":v;i.own||he("Drop-off",Ke(i.drop),i.along),i.own||he("Pick-up",Ke(i.pick),i.pick_along??[]),!i.own&&i.stay&&se.push("Stay: yes"),Y&&se.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&se.push(`Take along: ${i.along.map(be).join(", ")}`),i.arrive_by!=null&&i.arrive_by!==i.start&&se.push(`Arrive: ${pn(i.arrive_by-i.start)}`),i.leave_by!=null&&i.leave_by!==i.end&&se.push(`Leave: ${pn(i.leave_by-i.end)}`);let Ge=u("attending"),pe=Ge!==void 0?!!Ge:i.attending!==!1;i.attending===!1&&se.splice(0,se.length,"Attending: no");let d=o.date===this.today().date?"":`${de(o.date)} · `,w=Tn(i),T=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${l} · ${i.title}</span>
          <span class="ed-meta">${d}${Y?"any time ":""}${w}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
          ${this.renderForLine(e,o,i)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let v=i.place_name&&i.place_name!==i.title?i.place_name:"",S=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return p`${T}
        ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
        ${v?p`<div class="field"><span class="field-label">Where</span><span class="field-hint">${v}</span></div>`:x}
        <p class="field-hint">
          ${pe?`This blocks ${l}’s time: ${l} can’t drive then, so a ride that needs ${l} shows as a problem.`:`Not going, so it doesn’t block ${l}’s time, and ${l} can drive then.`}
          ${S}
        </p>
        <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(i,!pe)}>
          ${pe?`${l} isn’t going this time`:`${l} is going after all`}
        </button>
        ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:x}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?p`${T}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${l} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${T}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
      ${i.recurring?p`<div class="field">
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
      ${pe?p`${i.where==="anywhere"?p`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:x}
            ${i.own?p`<p class="field-hint">${this.ownHint(e,i)}</p>`:Me()}
      ${i.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${ae!=null?`Takes ${ae} min, any time ${R(i.start)}–${R(i.end)}`:"At its set time"}</span>
            </span>
            ${ae!=null?p`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${h||ae<=5} @click=${()=>this.setTakes(i,Math.max(5,ae-5))}>−</button>
                  <span class="arrive-value">${ae} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${h||ae+5>i.end-i.start} @click=${()=>this.setTakes(i,ae+5)}>+</button>
                </span>`:x}
          </div>
          <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setTakes(i,ae!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${ae!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:x}
      ${fe&&O.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${O.map(v=>p`<button type="button" class="chip" aria-pressed=${D.includes(v)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(i,v)}>
                  ${r.includes(v)?Q(e,v):oe(e,v)}
                </button>`)}
            </div>
          </div>`:x}
      ${Y?x:dt()}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${l} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(i,!pe)}>
        ${pe?`${l} isn’t going this time`:`${l} is going after all`}
      </button>
      ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:x}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${se.length?se.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${pe&&!i.own?p`<p class="field-hint">Tap a selected driver again to clear it.</p>`:x}
    `}};Jt.styles=Mo,Jt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},problemOpen:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},timesOpen:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},pointsFlash:{state:!0},manage:{state:!0},totals:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Jt);function Md(s,t){let o=Math.max(1,Math.round(s/14)),i=s/o,r=[],a=[];for(let h=0;h<=o;h++){let u=+(h*i).toFixed(1);r.push(`${u},${h%2?5:0}`),a.push(`${u},${t-(h%2?0:5)}`)}let l=`M${r.join(" L")} L${[...a].reverse().join(" L")} Z`;return p`<svg width=${s} height=${t} viewBox="0 0 ${s} ${t}">
    ${J`<path class="fold-fill" d=${l}></path>
      <path class="fold-edge" d=${`M${r.join(" L")}`}></path>
      <path class="fold-edge" d=${`M${a.join(" L")}`}></path>`}
  </svg>`}function br(s,t){return t===!1?!st(s):t===!0?st(s)&&!vt(s.state):s.state===t}function Ad(s){return`${s} ${s===1?"chore":"chores"} done`}function vr(s){return`${Ie(s)} ${s===1?"point":"points"}`}var Qt=class extends ve{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=$i(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(Lt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new fn(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return p`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
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
