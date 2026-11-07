var ur=Object.defineProperty;var $n=(s,t)=>()=>(s&&(t=s(s=0)),t);var hr=(s,t)=>{for(var e in t)ur(s,e,{get:t[e],enumerable:!0})};function un(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function ls(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function ba(s,t){let e=new Set,n=[];for(let i of s){let o=t(i);e.has(o)||(e.add(o),n.push(i))}return n}function ri(s){return ba(s,t=>t.unicode)}function xa(s){function t(e,n,i){let o=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(i)for(let[r,[a,c]]of Object.entries(i))o.createIndex(r,a,{multiEntry:c});return o}t(at),t(Ye,ua,{[li]:[da,!0],[di]:[[ha,pa]],[ui]:[fa,!0]}),t(hs,void 0,{[ci]:[""]})}function hi(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function va(s){let t=await new Promise((e,n)=>{let i=indexedDB.open(s,la);ds[s]=i,i.onupgradeneeded=o=>{o.oldVersion<ca&&xa(i.result)},hi(e,n,i)});return t.onclose=()=>fs(s),t}function ya(s){return pn[s]||(pn[s]=va(s)),pn[s]}function De(s,t,e,n){return new Promise((i,o)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(l=>r.objectStore(l)),c;n(a,r,l=>{c=l}),r.oncomplete=()=>i(c),r.onerror=()=>o(r.error)})}function fs(s){let t=ds[s],e=t&&t.result;if(e){e.close();let n=gn[s];if(n)for(let i of n)i()}delete ds[s],delete pn[s],delete gn[s]}function wa(s){return new Promise((t,e)=>{fs(s);let n=indexedDB.deleteDatabase(s);hi(t,e,n)})}function ka(s,t){let e=gn[s];e||(e=gn[s]=[]),e.push(t)}function rt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||$a.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function pi(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Ea)}function _a(s){return s.map(({annotation:e,emoticon:n,group:i,order:o,shortcodes:r,skins:a,tags:c,emoji:l,version:d})=>{let u=[...new Set(pi([...(r||[]).map(rt).flat(),...(c||[]).map(rt).flat(),...rt(e),n]))].sort(),h={annotation:e,group:i,order:o,tags:c,tokens:u,unicode:l,version:d};if(n&&(h.emoticon=n),r&&(h.shortcodes=r),a){h.skinTones=[],h.skinUnicodes=[],h.skinVersions=[];for(let{tone:g,emoji:_,version:p}of a)h.skinTones.push(g),h.skinUnicodes.push(_),h.skinVersions.push(p)}return h})}function fi(s,t,e,n){s[t](e).onsuccess=i=>n&&n(i.target.result)}function Ge(s,t,e){fi(s,"get",t,e)}function gi(s,t,e){fi(s,"getAll",t,e)}function gs(s){s.commit&&s.commit()}function Ta(s,t){let e=s[0];for(let n=1;n<s.length;n++){let i=s[n];t(e)>t(i)&&(e=i)}return e}function mi(s,t){let e=Ta(s,i=>i.length),n=[];for(let i of e)s.some(o=>o.findIndex(r=>t(r)===t(i))===-1)||n.push(i);return n}async function Ca(s){return!await ms(s,at,fn)}async function Aa(s,t,e){let[n,i]=await Promise.all([cs,fn].map(o=>ms(s,at,o)));return n===e&&i===t}async function Sa(s,t){return De(s,Ye,ct,(n,i,o)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let l=c.target.result;for(let d of l)if(r=d.unicode,t(d))return o(d);if(l.length<50)return o();a()}};a()})}async function bi(s,t,e,n){try{let i=_a(t);await De(s,[Ye,at],ps,([o,r],a)=>{let c,l,d=0;function u(){++d===2&&h()}function h(){if(!(c===n&&l===e)){o.clear();for(let g of i)o.put(g);r.put(n,cs),r.put(e,fn),gs(a)}}Ge(r,cs,g=>{c=g,u()}),Ge(r,fn,g=>{l=g,u()})})}finally{}}async function Ma(s,t){return De(s,Ye,ct,(e,n,i)=>{let o=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);gi(e.index(di),o,i)})}async function xi(s,t){let e=pi(rt(t));return e.length?De(s,Ye,ct,(n,i,o)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let l=mi(r,d=>d.unicode);o(l.sort((d,u)=>d.order<u.order?-1:1))};for(let l=0;l<e.length;l++){let d=e[l],u=l===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);gi(n.index(li),u,h=>{r.push(h),a()})}}):[]}async function Pa(s,t){let e=await xi(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(o=>o.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Sa(s,i=>(i.shortcodes||[]).includes(t.toLowerCase()))||null}async function La(s,t){return De(s,Ye,ct,(e,n,i)=>Ge(e,t,o=>{if(o)return i(o);Ge(e.index(ui),t,r=>i(r||null))}))}function ms(s,t,e){return De(s,t,ct,(n,i,o)=>Ge(n,e,o))}function Da(s,t,e,n){return De(s,t,ps,(i,o)=>{i.put(n,e),gs(o)})}function Ra(s,t){return De(s,hs,ps,(e,n)=>Ge(e,t,i=>{e.put((i||0)+1,t),gs(n)}))}function Ia(s,t,e){return e===0?[]:De(s,[hs,Ye],ct,([n,i],o,r)=>{let a=[];n.index(ci).openCursor(void 0,"prev").onsuccess=c=>{let l=c.target.result;if(!l)return r(a);function d(g){if(a.push(g),a.length===e)return r(a);l.continue()}let u=l.primaryKey,h=t.byName(u);if(h)return d(h);Ge(i,u,g=>{if(g)return d(g);l.continue()})}})}function Ba(s,t){let e=new Map;for(let i of s){let o=t(i);for(let r of o){let a=e;for(let l=0;l<r.length;l++){let d=r.charAt(l),u=a.get(d);u||(u=new Map,a.set(d,u)),a=u}let c=a.get(hn);c||(c=[],a.set(hn,c)),c.push(i)}}return(i,o)=>{let r=e;for(let l=0;l<i.length;l++){let d=i.charAt(l),u=r.get(d);if(u)r=u;else return[]}if(o)return r.get(hn)||[];let a=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((u,h)=>u[0]<h[0]?-1:1);for(let[u,h]of d)u===hn?a.push(...h):c.push(h)}return a}}function ja(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||Oa.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function ai(s){ja(s);let t=(h,g)=>h.name.toLowerCase()<g.name.toLowerCase()?-1:1,e=s.sort(t),i=Ba(s,h=>{let g=new Set;if(h.shortcodes)for(let _ of h.shortcodes)for(let p of rt(_))g.add(p);return g}),o=h=>i(h,!0),r=h=>i(h,!1),a=h=>{let g=rt(h),_=g.map((p,w)=>(w<g.length-1?o:r)(p));return mi(_,p=>p.name).sort(t)},c=new Map,l=new Map;for(let h of s){l.set(h.name.toLowerCase(),h);for(let g of h.shortcodes||[])c.set(g.toLowerCase(),h)}return{all:e,search:a,byShortcode:h=>c.get(h.toLowerCase()),byName:h=>l.get(h.toLowerCase())}}function _t(s){if(!s)return s;if(Na&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function vi(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Ua(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||za.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function yi(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function Ha(s){let t=await fetch(s,{method:"HEAD"});yi(t,s);let e=t.headers.get("etag");return vi(e),e}async function us(s){let t=await fetch(s);yi(t,s);let e=t.headers.get("etag");vi(e);let n=await t.json();return Ua(n),[e,n]}function Fa(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,i=-1;++i<n;)t+=String.fromCharCode(e[i]);return t}function Ka(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),i=-1;++i<t;)n[i]=s.charCodeAt(i);return e}async function wi(s){let t=JSON.stringify(s),e=Ka(t),n=await crypto.subtle.digest("SHA-1",e),i=Fa(n);return btoa(i)}async function Wa(s,t){let e,n=await Ha(t);if(!n){let i=await us(t);n=i[0],e=i[1],n||(n=await wi(e))}await Aa(s,t,n)||(e||(e=(await us(t))[1]),await bi(s,e,t,n))}async function qa(s,t){let[e,n]=await us(t);e||(e=await wi(n)),await bi(s,n,t,e)}async function Va(s,t){try{await Wa(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var la,ca,Ye,at,hs,da,li,ua,ci,ha,pa,di,cs,fn,ii,ct,ps,ui,fa,ga,ma,ds,pn,gn,$a,Ea,hn,Oa,Na,za,lt,bs=$n(()=>{la=1,ca=1,Ye="emoji",at="keyvalue",hs="favorites",da="tokens",li="tokens",ua="unicode",ci="count",ha="group",pa="order",di="group-order",cs="eTag",fn="url",ii="skinTone",ct="readonly",ps="readwrite",ui="skinUnicodes",fa="skinUnicodes",ga="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",ma="en";ds={},pn={},gn={};$a=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Ea=2;hn="";Oa=["name","url"];Na=typeof wrappedJSObject<"u";za=["annotation","emoji","group","order","version"];lt=class{constructor({dataSource:t=ga,locale:e=ma,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=ai(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await ya(this._dbName);ka(this._dbName,this._clear);let e=this.dataSource;await Ca(t)?await qa(t,e):this._lazyUpdate=Va(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return ls(t),await this.ready(),ri(await Ma(this._db,t)).map(_t)}async getEmojiBySearchQuery(t){un(t),await this.ready();let e=this._custom.search(t),n=ri(await xi(this._db,t)).map(_t);return[...e,...n]}async getEmojiByShortcode(t){un(t),await this.ready();let e=this._custom.byShortcode(t);return e||_t(await Pa(this._db,t))}async getEmojiByUnicodeOrName(t){un(t),await this.ready();let e=this._custom.byName(t);return e||_t(await La(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await ms(this._db,at,ii)||0}async setPreferredSkinTone(t){return ls(t),await this.ready(),Da(this._db,at,ii,t)}async incrementFavoriteEmojiCount(t){return un(t),await this.ready(),Ra(this._db,t)}async getTopFavoriteEmoji(t){return ls(t),await this.ready(),(await Ia(this._db,this._custom,t)).map(_t)}set customEmoji(t){this._custom=ai(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await fs(this._dbName)}async delete(){await this._shutdown(),await wa(this._dbName)}}});function $i(s){return s.unicode.includes("‍")}function nl(s){let t=Ei(s,"#000"),e=Ei(s,"#fff");return t&&e&&tl(t,e)}function sl(){let s=Object.entries(Ya);try{for(let[t,e]of s)if(nl(t))return e}catch{}finally{}return s[0][1]}function cl(s,t){if(t===0)return s;let e=s.indexOf(rl);return e!==-1?s.substring(0,e)+String.fromCodePoint(al+t-1)+s.substring(e):(s.endsWith(ol)&&(s=s.substring(0,s.length-1)),s+il+String.fromCodePoint(ll+t-1))}function _e(s){s.preventDefault(),s.stopPropagation()}function ws(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Di(s,t){let e=new Set,n=[];for(let i of s){let o=t(i);e.has(o)||(e.add(o),n.push(i))}return n}function dl(s,t){let e=n=>{let i={};for(let o of n)typeof o.tone=="number"&&o.version<=t&&(i[o.tone]=o.unicode);return i};return s.map(({unicode:n,skins:i,shortcodes:o,url:r,name:a,category:c,annotation:l})=>({unicode:n,name:a,shortcodes:o,url:r,category:c,annotation:l,id:n||a,skins:i&&e(i)}))}function hl(s,t,e){let n;ul?(n=new ResizeObserver(e),n.observe(s)):bn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function _i(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function Ti(s,t,e){let n=_i(t);if(!n){if(!Je){Je=e.cloneNode(!0);let i=getComputedStyle(e);for(let o of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])Je.style.setProperty(o,i.getPropertyValue(o),"important")}try{return document.body.appendChild(Je),Je.firstChild.nodeValue=s,_i(Je)}finally{Je.remove()}}return n}function fl(s,t,e){let n=!0;for(let i of s){let o=e(i);if(!o)continue;typeof ks>"u"&&(ks=Ti(pl,t,t));let a=Ti(i.unicode,o,t)/1.8<ks;Ts.set(i.unicode,a),a||(n=!1)}return n}function gl(s){return Di(s,t=>t)}function ml(s){s&&(s.scrollTop=0)}function Tt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Ci(s){return""+s}function bl(s){let t=document.createElement("template");return t.innerHTML=s,t}function kl(s,t){wl?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function $l(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function El(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,i=!1;n?i=$l(n,s):(i=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),i&&kl(n,s)}function _l(s,t){for(let e of t){let{targetNode:n,currentExpression:i,binding:{expressionIndex:o,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,l=s[o];if(i!==l)if(e.currentExpression=l,r)if(l===null)n.removeAttribute(r);else{let d=a+Ci(l)+c;n.setAttribute(r,d)}else{let d;Array.isArray(l)?El(l,e):l instanceof Element?(d=l,n.replaceWith(d)):n.nodeValue=Ci(l),d&&(e.targetNode=d)}}}function Tl(s){let t="",e=!1,n=!1,i=-1,o=new Map,r=[],a=0;for(let l=0,d=s.length;l<d;l++){let u=s[l];if(t+=u.slice(a),l===d-1)break;for(let b=0;b<u.length;b++)switch(u.charAt(b)){case"<":{u.charAt(b+1)==="/"?r.pop():(e=!0,r.push(++i));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let h=r[r.length-1],g=Tt(o,h,()=>[]),_,p,w;if(n){let b=/(\S+)="?([^"=]*)$/.exec(u);_=b[1],p=b[2];let R=/^([^">]*)("?)/.exec(s[l+1]);w=R[1],t=t.slice(0,-1*b[0].length),a=R[0].length}else a=0;let A={attributeName:_,attributeValuePre:p,attributeValuePost:w,expressionIndex:l};g.push(A),!e&&!n&&(t+=" ")}return{template:bl(t),elementsToBindings:o}}function Ai(s,t,e){for(let n=0;n<s.length;n++){let i=s[n],o=i.attributeName?t:t.firstChild,r={binding:i,targetNode:o,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Cl(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Ai(n,s,e);else{let i=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),o=s,r=-1;do{let a=t.get(++r);a&&Ai(a,o,e)}while(o=i.nextNode())}return e}function Al(s){let{template:t,elementsToBindings:e}=Tt(xl,s,()=>Tl(s)),n=t.cloneNode(!0).content.firstElementChild,i=Cl(n,e);return function(r){return _l(r,i),n}}function Sl(s){let t=Tt(vl,s,()=>new Map),e=yl;function n(o,...r){let a=Tt(t,o,()=>new Map);return Tt(a,e,()=>Al(o))(r)}function i(o,r,a){return o.map((c,l)=>{let d=e;e=a(c);try{return r(c,l)}finally{e=d}})}return{map:i,html:n}}function Ml(s,t,e,n,i,o,r,a,c){let{labelWithSkin:l,titleForEmoji:d,unicodeWithSkin:u}=e,{html:h,map:g}=Sl(t);function _(b,R,Z){return g(b,(z,re)=>h`<button role="${R?"option":"menuitem"}" aria-selected="${R?re===t.activeSearchItem:null}" aria-label="${l(z,t.currentSkinTone)}" title="${d(z)}" class="${"emoji"+(R&&re===t.activeSearchItem?" active":"")+(z.unicode?"":" custom-emoji")}" id="${`${Z}-${z.id}`}" style="${z.unicode?null:`--custom-emoji-background: url(${JSON.stringify(z.url)})`}">${z.unicode?u(z,t.currentSkinTone):""}</button>`,z=>`${Z}-${z.id}`)}let w=h`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${g(t.skinTones,(b,R)=>h`<div id="skintone-${R}" class="emoji ${R===t.activeSkinTone?"active":""}" aria-selected="${R===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[R]}" aria-label="${t.i18n.skinTones[R]}">${b}</div>`,b=>b)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${g(t.groups,b=>h`<button role="tab" class="nav-button" aria-controls="tab-${b.id}" aria-label="${t.i18n.categories[b.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===b.id}" title="${t.i18n.categories[b.name]}" data-group-id="${b.id}"><div class="nav-emoji emoji">${b.emoji}</div></button>`,b=>b.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${g(t.currentEmojisWithCategories,(b,R)=>h`<div><div id="menu-label-${R}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:b.category?b.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${R!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(b.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${R}" id="${t.searchMode?"search-results":null}">${_(b.emojis,t.searchMode,"emo")}</div></div>`,b=>b.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${_(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,A=(b,R)=>{for(let Z of s.querySelectorAll(`[${b}]`))R(Z,Z.getAttribute(b))};if(c){s.appendChild(w);for(let b of["click","focusout","input","keydown","keyup"])A(`data-on-${b}`,(R,Z)=>{R.addEventListener(b,n[Z])});A("data-ref",(b,R)=>{o[R]=b}),r.addEventListener("abort",()=>{s.removeChild(w)})}A("data-action",(b,R)=>{let Z=a.get(R);Z||a.set(R,Z=new WeakSet),Z.has(b)||(Z.add(b),i[R](b))})}function Pl(s){let t=!1,e,n=new Map,i=new Set,o,r=()=>{if(t)return;let l=[...i];i.clear();try{for(let d of l)d()}finally{o=!1,i.size&&(o=!0,xn(r))}},a=new Proxy({},{get(l,d){if(e){let u=n.get(d);u||(u=new Set,n.set(d,u)),u.add(e)}return l[d]},set(l,d,u){if(l[d]!==u){l[d]=u;let h=n.get(d);if(h){for(let g of h)i.add(g);o||(o=!0,xn(r))}}return!0}}),c=l=>{let d=()=>{let u=e;e=d;try{return l()}finally{e=u}};return d()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function $s(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Ll(s,t,e){{let n=s.closest(".tabpanel"),i=Si.get(n);i||(i=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),Si.set(n,i),t.addEventListener("abort",()=>{i.disconnect()})),i.observe(s)}}function Dl(s,t){let e={},n=new AbortController,i=n.signal,{state:o,createEffect:r}=Pl(i),a=new Map;mn(o,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),mn(o,t),mn(o,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Za,isRtl:!1,currentGroupIndex:0,groups:xs,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{o.currentGroup!==o.groups[o.currentGroupIndex]&&(o.currentGroup=o.groups[o.currentGroupIndex])});let c=x=>{s.getElementById(x).focus()},l=x=>s.getElementById(`emo-${x.id}`),d=(x,S)=>{e.rootElement.dispatchEvent(new CustomEvent(x,{detail:S,bubbles:!0,composed:!0}))},u=(x,S)=>x.id===S.id,h=(x,S)=>{let{category:N,emojis:j}=x,{category:ee,emojis:Q}=S;return N!==ee?!1:$s(j,Q,u)},g=x=>{$s(o.currentEmojis,x,u)||(o.currentEmojis=x)},_=x=>{o.searchMode!==x&&(o.searchMode=x)},p=x=>{$s(o.currentEmojisWithCategories,x,h)||(o.currentEmojisWithCategories=x)},w=(x,S)=>S&&x.skins&&x.skins[S]||x.unicode,R={labelWithSkin:(x,S)=>gl([x.name||w(x,S),x.annotation,...x.shortcodes||Es].filter(Boolean)).join(", "),titleForEmoji:x=>x.annotation||(x.shortcodes||Es).join(", "),unicodeWithSkin:w},Z={onClickSkinToneButton:W,onEmojiClick:ve,onNavClick:V,onNavKeydown:q,onSearchKeydown:O,onSkinToneOptionsClick:I,onSkinToneOptionsFocusOut:de,onSkinToneOptionsKeydown:B,onSkinToneOptionsKeyup:X,onSearchInput:P},z={calculateEmojiGridStyle:E,updateOnIntersection:y},re=!0;r(()=>{Ml(s,o,R,Z,z,e,i,a,re),re=!1}),o.emojiVersion||ys().then(x=>{x||(o.message=o.i18n.emojiUnsupportedMessage)}),r(()=>{async function x(){let S=!1,N=setTimeout(()=>{S=!0,o.message=o.i18n.loadingMessage},Ja);try{await o.database.ready(),o.databaseLoaded=!0}catch(j){console.error(j),o.message=o.i18n.networkErrorMessage}finally{clearTimeout(N),S&&(S=!1,o.message="")}}o.database&&x()}),r(()=>{o.pickerStyle=`
      --num-groups: ${o.groups.length}; 
      --indicator-opacity: ${o.searchMode?0:1}; 
      --num-skintones: ${ki};`}),r(()=>{o.customEmoji&&o.database&&v()}),r(()=>{o.customEmoji&&o.customEmoji.length?o.groups!==_s&&(o.groups=_s):o.groups!==xs&&(o.currentGroupIndex&&o.currentGroupIndex--,o.groups=xs)}),r(()=>{async function x(){o.databaseLoaded&&(o.currentSkinTone=await o.database.getPreferredSkinTone())}x()}),r(()=>{o.skinTones=Array(ki).fill().map((x,S)=>cl(o.skinToneEmoji,S))}),r(()=>{o.skinToneButtonText=o.skinTones[o.currentSkinTone]}),r(()=>{o.skinToneButtonLabel=o.i18n.skinToneLabel.replace("{skinTone}",o.i18n.skinTones[o.currentSkinTone])}),r(()=>{async function x(){let{database:S}=o,N=(await Promise.all(Qa.map(j=>S.getEmojiByUnicodeOrName(j)))).filter(Boolean);o.defaultFavoriteEmojis=N}o.databaseLoaded&&x()});function v(){let{customEmoji:x,database:S}=o,N=x||Es;S.customEmoji!==N&&(S.customEmoji=N)}r(()=>{async function x(){v();let{database:S,defaultFavoriteEmojis:N,numColumns:j}=o,ee=await S.getTopFavoriteEmoji(j),Q=await K(Di([...ee,...N],M=>M.unicode||M.name).slice(0,j));o.currentFavorites=Q}o.databaseLoaded&&o.defaultFavoriteEmojis&&x()});function E(x){hl(x,i,()=>{{let S=getComputedStyle(e.rootElement),N=parseInt(S.getPropertyValue("--num-columns"),10),j=S.getPropertyValue("direction")==="rtl";o.numColumns=N,o.isRtl=j}})}function y(x){Ll(x,i,S=>{for(let{target:N,isIntersecting:j}of S)N.classList.toggle("onscreen",j)})}r(()=>{async function x(){let{searchText:S,currentGroup:N,databaseLoaded:j,customEmoji:ee}=o;if(!j)o.currentEmojis=[],o.searchMode=!1;else if(S.length>=Ga){let Q=await J(S);o.searchText===S&&(g(Q),_(!0))}else{let{id:Q}=N;if(Q!==-1||ee&&ee.length){let M=await H(Q);o.currentGroup.id===Q&&(g(M),_(!1))}}}x()});let k=()=>{bn(()=>ml(e.tabpanelElement))};r(()=>{let{currentEmojis:x,emojiVersion:S}=o,N=x.filter(j=>j.unicode).filter(j=>$i(j)&&!Ts.has(j.unicode));if(!S&&N.length)g(x),bn(()=>$(N));else{let j=S?x:x.filter(L);g(j),k()}});function $(x){fl(x,e.baselineEmoji,l)?k():o.currentEmojis=[...o.currentEmojis]}function L(x){return!x.unicode||!$i(x)||Ts.get(x.unicode)}async function C(x){let S=o.emojiVersion||await ys();return x.filter(({version:N})=>!N||N<=S)}async function K(x){return dl(x,o.emojiVersion||await ys())}async function H(x){let S=x===-1?o.customEmoji:await o.database.getEmojiByGroup(x);return K(await C(S))}async function J(x){return K(await C(await o.database.getEmojiBySearchQuery(x)))}r(()=>{}),r(()=>{function x(){let{searchMode:N,currentEmojis:j}=o;if(N)return[{category:"",emojis:j}];let ee=new Map;for(let Q of j){let M=Q.category||"",te=ee.get(M);te||(te=[],ee.set(M,te)),te.push(Q)}return[...ee.entries()].map(([Q,M])=>({category:Q,emojis:M})).sort((Q,M)=>o.customCategorySorting(Q.category,M.category))}let S=x();p(S)}),r(()=>{o.activeSearchItemId=o.activeSearchItem!==-1&&o.currentEmojis[o.activeSearchItem].id}),r(()=>{let{rawSearchText:x}=o;Pi(()=>{o.searchText=(x||"").trim(),o.activeSearchItem=-1})});function O(x){if(!o.searchMode||!o.currentEmojis.length)return;let S=N=>{_e(x),o.activeSearchItem=ws(N,o.activeSearchItem,o.currentEmojis)};switch(x.key){case"ArrowDown":return S(!1);case"ArrowUp":return S(!0);case"Enter":if(o.activeSearchItem===-1)o.activeSearchItem=0;else return _e(x),Qe(o.currentEmojis[o.activeSearchItem].id)}}function V(x){let{target:S}=x,N=S.closest(".nav-button");if(!N)return;let j=parseInt(N.dataset.groupId,10);e.searchElement.value="",o.rawSearchText="",o.searchText="",o.activeSearchItem=-1,o.currentGroupIndex=o.groups.findIndex(ee=>ee.id===j)}function q(x){let{target:S,key:N}=x,j=ee=>{ee&&(_e(x),ee.focus())};switch(N){case"ArrowLeft":return j(S.previousElementSibling);case"ArrowRight":return j(S.nextElementSibling);case"Home":return j(S.parentElement.firstElementChild);case"End":return j(S.parentElement.lastElementChild)}}async function oe(x){let S=await o.database.getEmojiByUnicodeOrName(x),N=[...o.currentEmojis,...o.currentFavorites].find(ee=>ee.id===x),j=N.unicode&&w(N,o.currentSkinTone);return await o.database.incrementFavoriteEmojiCount(x),{emoji:S,skinTone:o.currentSkinTone,...j&&{unicode:j},...N.name&&{name:N.name}}}async function Qe(x){let S=oe(x);d("emoji-click-sync",S),d("emoji-click",await S)}function ve(x){let{target:S}=x;if(!S.classList.contains("emoji"))return;_e(x);let N=S.id.substring(4);Qe(N)}function m(x){o.currentSkinTone=x,o.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:x}),o.database.setPreferredSkinTone(x)}function I(x){let{target:{id:S}}=x,N=S&&S.match(/^skintone-(\d)/);if(!N)return;_e(x);let j=parseInt(N[1],10);m(j)}function W(x){o.skinTonePickerExpanded=!o.skinTonePickerExpanded,o.activeSkinTone=o.currentSkinTone,o.skinTonePickerExpanded&&(_e(x),bn(()=>c("skintone-list")))}r(()=>{o.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{o.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):o.skinTonePickerExpandedAfterAnimation=!1});function B(x){if(!o.skinTonePickerExpanded)return;let S=async N=>{_e(x),o.activeSkinTone=N};switch(x.key){case"ArrowUp":return S(ws(!0,o.activeSkinTone,o.skinTones));case"ArrowDown":return S(ws(!1,o.activeSkinTone,o.skinTones));case"Home":return S(0);case"End":return S(o.skinTones.length-1);case"Enter":return _e(x),m(o.activeSkinTone);case"Escape":return _e(x),o.skinTonePickerExpanded=!1,c("skintone-button")}}function X(x){if(o.skinTonePickerExpanded)switch(x.key){case" ":return _e(x),m(o.activeSkinTone)}}async function de(x){let{relatedTarget:S}=x;(!S||S.id!=="skintone-list")&&(o.skinTonePickerExpanded=!1)}function P(x){o.rawSearchText=x.target.value}return{$set(x){mn(o,x)},$destroy(){n.abort()}}}function Mi(s){s instanceof Xe||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var _s,xs,Ga,ki,Pi,Ya,Ja,Xa,Za,Qa,Li,el,Ei,tl,vs,ys,Ts,ol,il,rl,al,ll,bn,ul,pl,ks,Je,xl,vl,yl,wl,xn,Si,Es,mn,Rl,Il,Bl,Ol,Ri,jl,Xe,Ii,Bi=$n(()=>{bs();_s=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),xs=_s.slice(1),Ga=2,ki=6,Pi=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Ya={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Ja=1e3,Xa="🖐️",Za=8,Qa=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Li='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',el=(s,t)=>s<t?-1:s>t?1:0,Ei=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Li}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},tl=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ys=()=>(vs||(vs=new Promise(s=>Pi(()=>s(sl())))),vs),Ts=new Map,ol="️",il="\uD83C",rl="‍",al=127995,ll=57339;bn=requestAnimationFrame,ul=typeof ResizeObserver=="function";pl="😀";xl=new WeakMap,vl=new WeakMap,yl=Symbol("un-keyed"),wl="replaceChildren"in Element.prototype;xn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);Si=new WeakMap;Es=[],{assign:mn}=Object;Rl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Il="en",Bl={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Ol=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Ri=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],jl=`:host{--emoji-font-family:${Li}}`,Xe=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Ol+jl,this.shadowRoot.appendChild(e),this._ctx={locale:Il,dataSource:Rl,skinToneEmoji:Xa,customCategorySorting:el,customEmoji:null,i18n:Bl,emojiVersion:null,...t};for(let n of Ri)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Mi(this),this._cmp||(this._cmp=Dl(this.shadowRoot,this._ctx))}disconnectedCallback(){Mi(this),xn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(i,o)=>o.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new lt({locale:t,dataSource:e}))}_dbFlush(){xn(()=>this._dbCreate())}},Ii={};for(let s of Ri)Ii[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(Xe.prototype,Ii);customElements.get("emoji-picker")||customElements.define("emoji-picker",Xe)});var Oi={};hr(Oi,{Database:()=>lt,Picker:()=>Xe});var ji=$n(()=>{Bi();bs()});function Ns(s){return{type:"auth",access_token:s}}function zs(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Us(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function En(s){return{type:"unsubscribe_events",subscription:s}}function Hs(){return{type:"ping"}}function Fs(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function Ws(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let i=e[n].split("="),o=decodeURIComponent(i[0]),r=i.length>1?decodeURIComponent(i[1]):void 0;t[o]=r}return t}var qs=(s,t,e,n)=>{let[i,o,r]=s.split(".",3);return Number(i)>t||Number(i)===t&&(n===void 0?Number(o)>=e:Number(o)>e)||n!==void 0&&Number(i)===t&&Number(o)===e&&Number(r)>=n};var It=!1,fr="auth_required",gr="auth_invalid",mr="auth_ok";function Gs(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;It&&console.log("[Auth phase] Initializing",n);function i(o,r,a){It&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),l=!1,d=()=>{if(c.removeEventListener("close",d),l){a(2);return}if(o===0){a(1);return}let g=o===-1?-1:o-1;setTimeout(()=>i(g,r,a),1e3)},u=async g=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(Ns(t.accessToken)))}catch(_){l=_===2,c.close()}},h=async g=>{let _=JSON.parse(g.data);switch(It&&console.log("[Auth phase] Received",_),_.type){case gr:l=!0,c.close();break;case mr:c.removeEventListener("open",u),c.removeEventListener("message",h),c.removeEventListener("close",d),c.removeEventListener("error",d),c.haVersion=_.ha_version,qs(c.haVersion,2022,9)&&c.send(JSON.stringify(zs())),r(c);break;default:It&&_.type!==fr&&console.warn("[Auth phase] Unhandled message",_)}};c.addEventListener("open",u),c.addEventListener("message",h),c.addEventListener("close",d),c.addEventListener("error",d)}return new Promise((o,r)=>i(s.setupRetry,o,r))}var ht=!1,Bt=class{constructor(t,e){this._handleMessage=n=>{let i=JSON.parse(n.data);Array.isArray(i)||(i=[i]),i.forEach(o=>{ht&&console.log("Received",o);let r=this.commands.get(o.id);switch(o.type){case"event":r?r.callback(o.event):(console.warn(`Received event for unknown subscription ${o.id}. Unsubscribing.`),this.sendMessagePromise(En(o.id)).catch(a=>{ht&&console.warn(` Error unsubsribing from unknown subscription ${o.id}`,a)}));break;case"result":r&&(o.success?(r.resolve(o.result),"subscribe"in r||this.commands.delete(o.id)):(r.reject(o.error),this.commands.delete(o.id)));break;case"pong":r?(r.resolve(),this.commands.delete(o.id)):console.warn(`Received unknown pong response ${o.id}`);break;default:ht&&console.warn("Unhandled message",o)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(Fs(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),o=r=>{setTimeout(async()=>{if(!this.closeRequested){ht&&console.log("Trying to reconnect");try{let a=await i.createSocket(i);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let l of c)l.reject&&l.reject(3)}a===2?this.fireEvent("reconnect-error",a):o(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),o(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(o=>{i.unsubscribe=o,i.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let i of n)i.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let i=n.indexOf(e);i!==-1&&n.splice(i,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,Us(e))}ping(){return this.sendMessagePromise(Hs())}sendMessage(t,e){if(!this.connected)throw 3;if(ht&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(o){n(o)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:n}),this.sendMessage(t,i)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((o,r)=>{this._queuedMessages.push({resolve:o,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((o,r)=>{let a=this._genCmdId();i={resolve:o,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(En(a)),this.commands.delete(a)}},this.commands.set(a,i);try{this.sendMessage(e,a)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var br=()=>`${location.protocol}//${location.host}/`,xr=s=>s*1e3+Date.now();function vr(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function yr(s,t,e,n){let i=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(i+=`&client_id=${encodeURIComponent(t)}`),n&&(i+=`&state=${encodeURIComponent(n)}`),i}function wr(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=yr(s,t,e,n)}async function Xs(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let i=new FormData;t!==null&&i.append("client_id",t),Object.keys(e).forEach(a=>{i.append(a,e[a])});let o=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!o.ok)throw o.status===400||o.status===403?2:new Error("Unable to fetch tokens");let r=await o.json();return r.hassUrl=s,r.clientId=t,r.expires=xr(r.expires_in),r}function Js(s,t,e){return Xs(s,t,{code:e,grant_type:"authorization_code"})}function kr(s){return btoa(JSON.stringify(s))}function $r(s){return JSON.parse(atob(s))}var _n=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await Xs(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function Zs(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:br(),i=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await Js(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let o=Ws(location.search.substr(1));if("auth_callback"in o){let r=$r(o.state);if(i&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await Js(r.hassUrl,r.clientId,o.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new _n(t,s.saveTokens);if(e===void 0)throw 4;return wr(e,n,s.redirectUrl||vr(),kr({hassUrl:e,clientId:n})),new Promise(()=>{})}async function Qs(s){let t=Object.assign({setupRetry:0,createSocket:Gs},s),e=await t.createSocket(t);return new Bt(e,t)}function U(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function pt(s){let t=Math.floor(Math.round(s)/60)%24;return`${U(s)} ${t<12?"AM":"PM"}`}function eo(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function gt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function to(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Er=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),_r=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Tr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Ot(s){return new Date(`${s}T12:00:00Z`)}function we(s){let t=Ot(s);return`${Er.format(t)}, ${Tr.format(t)}`}function pe(s){return _r.format(Ot(s))}function ke(s,t){return Math.round((Ot(t).getTime()-Ot(s).getTime())/864e5)}function ft(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return ft("UTC",t)}let n=i=>e.find(o=>o.type===i)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function jt(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let i=ft(e,s),o=ft(e,t).date;return i.date===o?`at ${pt(i.minutes)}`:`on ${pe(i.date)} at ${pt(i.minutes)}`}var ae=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},je="mydashlight",Cr=7,no=3e4;function Tn(s){if(s instanceof ae)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new ae(String(t.code??"error"),t.message)}return typeof s=="number"?new ae("connection_lost","Lost the connection to Home Assistant."):new ae("error",String(s))}var Nt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new ae("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},no),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new ae("not_running","MyDashLight isn’t running right now."))},{type:`${je}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:je,service:"get_plan",service_data:{days:Cr},return_response:!0});this.emit(t.response)}catch(t){this.fail(Tn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:je,service:t,service_data:e})}catch(n){throw Tn(n)}this.pushing||await this.refresh()}setRide(t,e,n,i){return this.call("set_ride",{event:t,side:e,driver:n,scope:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:to(e),scope:n})}setTakeAlong(t,e,n){return this.call("set_take_along",{event:t,kids:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,i=null,o=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:je,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(a=>{e||t(a.chores)},{type:`${je}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;o(),i=setInterval(()=>void o(),no)}})(),()=>{e=!0,i&&clearInterval(i),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let i=await this.conn.subscribeMessage(o=>{e||t(o.lunch)},{type:`${je}/lunch/subscribe`},{resubscribe:!0});e?i().catch(()=>{}):n=i}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,i){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:i})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:je,service:t,service_data:e})}catch(n){throw Tn(n)}}};var zt=globalThis,Ut=zt.ShadowRoot&&(zt.ShadyCSS===void 0||zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Cn=Symbol(),so=new WeakMap,mt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Cn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Ut&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=so.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&so.set(e,t))}return t}toString(){return this.cssText}},oo=s=>new mt(typeof s=="string"?s:s+"",void 0,Cn),Ne=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,i,o)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new mt(e,s,Cn)},io=(s,t)=>{if(Ut)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),i=zt.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=e.cssText,s.appendChild(n)}},An=Ut?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return oo(e)})(s):s;var{is:Ar,defineProperty:Sr,getOwnPropertyDescriptor:Mr,getOwnPropertyNames:Pr,getOwnPropertySymbols:Lr,getPrototypeOf:Dr}=Object,Ht=globalThis,ro=Ht.trustedTypes,Rr=ro?ro.emptyScript:"",Ir=Ht.reactiveElementPolyfillSupport,bt=(s,t)=>s,Sn={toAttribute(s,t){switch(t){case Boolean:s=s?Rr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},lo=(s,t)=>!Ar(s,t),ao={attribute:!0,type:String,converter:Sn,reflect:!1,useDefault:!1,hasChanged:lo};Symbol.metadata??=Symbol("metadata"),Ht.litPropertyMetadata??=new WeakMap;var Ce=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ao){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(t,n,e);i!==void 0&&Sr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){let{get:i,set:o}=Mr(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let a=i?.call(this);o?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ao}static _$Ei(){if(this.hasOwnProperty(bt("elementProperties")))return;let t=Dr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(bt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bt("properties"))){let e=this.properties,n=[...Pr(e),...Lr(e)];for(let i of n)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,i]of e)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let i=this._$Eu(e,n);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)e.unshift(An(i))}else t!==void 0&&e.push(An(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return io(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){let o=(n.converter?.toAttribute!==void 0?n.converter:Sn).toAttribute(e,n.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=n.getPropertyOptions(i),r=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:Sn;this._$Em=i;let a=r.fromAttribute(e,o.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,n,i=!1,o){if(t!==void 0){let r=this.constructor;if(i===!1&&(o=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??lo)(o,e)||n.useDefault&&n.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:o},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),o!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,o]of n){let{wrapped:r}=o,a=this[i];r!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,o,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Ce.elementStyles=[],Ce.shadowRootOptions={mode:"open"},Ce[bt("elementProperties")]=new Map,Ce[bt("finalized")]=new Map,Ir?.({ReactiveElement:Ce}),(Ht.reactiveElementVersions??=[]).push("2.1.2");var Pn=globalThis,co=s=>s,Ft=Pn.trustedTypes,uo=Ft?Ft.createPolicy("lit-html",{createHTML:s=>s}):void 0,Ln="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,Dn="?"+Ae,Br=`<${Dn}>`,He=document,vt=()=>He.createComment(""),yt=s=>s===null||typeof s!="object"&&typeof s!="function",Rn=Array.isArray,bo=s=>Rn(s)||typeof s?.[Symbol.iterator]=="function",Mn=`[ 	
\f\r]`,xt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ho=/-->/g,po=/>/g,ze=RegExp(`>|${Mn}(?:([^\\s"'>=/]+)(${Mn}*=${Mn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),fo=/'/g,go=/"/g,xo=/^(?:script|style|textarea|title)$/i,In=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),f=In(1),le=In(2),Yc=In(3),Se=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),mo=new WeakMap,Ue=He.createTreeWalker(He,129);function vo(s,t){if(!Rn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return uo!==void 0?uo.createHTML(t):t}var yo=(s,t)=>{let e=s.length-1,n=[],i,o=t===2?"<svg>":t===3?"<math>":"",r=xt;for(let a=0;a<e;a++){let c=s[a],l,d,u=-1,h=0;for(;h<c.length&&(r.lastIndex=h,d=r.exec(c),d!==null);)h=r.lastIndex,r===xt?d[1]==="!--"?r=ho:d[1]!==void 0?r=po:d[2]!==void 0?(xo.test(d[2])&&(i=RegExp("</"+d[2],"g")),r=ze):d[3]!==void 0&&(r=ze):r===ze?d[0]===">"?(r=i??xt,u=-1):d[1]===void 0?u=-2:(u=r.lastIndex-d[2].length,l=d[1],r=d[3]===void 0?ze:d[3]==='"'?go:fo):r===go||r===fo?r=ze:r===ho||r===po?r=xt:(r=ze,i=void 0);let g=r===ze&&s[a+1].startsWith("/>")?" ":"";o+=r===xt?c+Br:u>=0?(n.push(l),c.slice(0,u)+Ln+c.slice(u)+Ae+g):c+Ae+(u===-2?a:g)}return[vo(s,o+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},wt=class s{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let o=0,r=0,a=t.length-1,c=this.parts,[l,d]=yo(t,e);if(this.el=s.createElement(l,n),Ue.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=Ue.nextNode())!==null&&c.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Ln)){let h=d[r++],g=i.getAttribute(u).split(Ae),_=/([.?@])?(.*)/.exec(h);c.push({type:1,index:o,name:_[2],strings:g,ctor:_[1]==="."?Wt:_[1]==="?"?qt:_[1]==="@"?Vt:Ke}),i.removeAttribute(u)}else u.startsWith(Ae)&&(c.push({type:6,index:o}),i.removeAttribute(u));if(xo.test(i.tagName)){let u=i.textContent.split(Ae),h=u.length-1;if(h>0){i.textContent=Ft?Ft.emptyScript:"";for(let g=0;g<h;g++)i.append(u[g],vt()),Ue.nextNode(),c.push({type:2,index:++o});i.append(u[h],vt())}}}else if(i.nodeType===8)if(i.data===Dn)c.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(Ae,u+1))!==-1;)c.push({type:7,index:o}),u+=Ae.length-1}o++}}static createElement(t,e){let n=He.createElement("template");return n.innerHTML=t,n}};function Fe(s,t,e=s,n){if(t===Se)return t;let i=n!==void 0?e._$Co?.[n]:e._$Cl,o=yt(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(s),i._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=i:e._$Cl=i),i!==void 0&&(t=Fe(s,i._$AS(s,t.values),i,n)),t}var Kt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??He).importNode(e,!0);Ue.currentNode=i;let o=Ue.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let l;c.type===2?l=new tt(o,o.nextSibling,this,t):c.type===1?l=new c.ctor(o,c.name,c.strings,this,t):c.type===6&&(l=new Gt(o,this,t)),this._$AV.push(l),c=n[++a]}r!==c?.index&&(o=Ue.nextNode(),r++)}return Ue.currentNode=He,i}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},tt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Fe(this,t,e),yt(t)?t===T||t==null||t===""?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==Se&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):bo(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==T&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(He.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=wt.createElement(vo(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new Kt(i,this),r=o.u(this.options);o.p(e),this.T(r),this._$AH=o}}_$AC(t){let e=mo.get(t.strings);return e===void 0&&mo.set(t.strings,e=new wt(t)),e}k(t){Rn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,i=0;for(let o of t)i===e.length?e.push(n=new s(this.O(vt()),this.O(vt()),this,this.options)):n=e[i],n._$AI(o),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=co(t).nextSibling;co(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ke=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,o){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=T}_$AI(t,e=this,n,i){let o=this.strings,r=!1;if(o===void 0)t=Fe(this,t,e,0),r=!yt(t)||t!==this._$AH&&t!==Se,r&&(this._$AH=t);else{let a=t,c,l;for(t=o[0],c=0;c<o.length-1;c++)l=Fe(this,a[n+c],e,c),l===Se&&(l=this._$AH[c]),r||=!yt(l)||l!==this._$AH[c],l===T?t=T:t!==T&&(t+=(l??"")+o[c+1]),this._$AH[c]=l}r&&!i&&this.j(t)}j(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Wt=class extends Ke{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===T?void 0:t}},qt=class extends Ke{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==T)}},Vt=class extends Ke{constructor(t,e,n,i,o){super(t,e,n,i,o),this.type=5}_$AI(t,e=this){if((t=Fe(this,t,e,0)??T)===Se)return;let n=this._$AH,i=t===T&&n!==T||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==T&&(n===T||i);i&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Gt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Fe(this,t)}},wo={M:Ln,P:Ae,A:Dn,C:1,L:yo,R:Kt,D:bo,V:Fe,I:tt,H:Ke,N:qt,U:Vt,B:Wt,F:Gt},Or=Pn.litHtmlPolyfillSupport;Or?.(wt,tt),(Pn.litHtmlVersions??=[]).push("3.3.3");var ko=(s,t,e)=>{let n=e?.renderBefore??t,i=n._$litPart$;if(i===void 0){let o=e?.renderBefore??null;n._$litPart$=i=new tt(t.insertBefore(vt(),o),o,void 0,e??{})}return i._$AI(s),i};var Bn=globalThis,be=class extends Ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ko(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Se}};be._$litElement$=!0,be.finalized=!0,Bn.litElementHydrateSupport?.({LitElement:be});var jr=Bn.litElementPolyfillSupport;jr?.({LitElement:be});(Bn.litElementVersions??=[]).push("4.2.2");var $o={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Eo=s=>(...t)=>({_$litDirective$:s,values:t}),Yt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Nr}=wo,_o=s=>s;var To=()=>document.createComment(""),nt=(s,t,e)=>{let n=s._$AA.parentNode,i=t===void 0?s._$AB:t._$AA;if(e===void 0){let o=n.insertBefore(To(),i),r=n.insertBefore(To(),i);e=new Nr(o,r,s,s.options)}else{let o=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(o!==i||a){let c=e._$AA;for(;c!==o;){let l=_o(c).nextSibling;_o(n).insertBefore(c,i),c=l}}}return e},Re=(s,t,e=s)=>(s._$AI(t,e),s),zr={},Co=(s,t=zr)=>s._$AH=t,Ao=s=>s._$AH,Jt=s=>{s._$AR(),s._$AA.remove()};var So=(s,t,e)=>{let n=new Map;for(let i=t;i<=e;i++)n.set(s[i],i);return n},Me=Eo(class extends Yt{constructor(s){if(super(s),s.type!==$o.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let i=[],o=[],r=0;for(let a of s)i[r]=n?n(a,r):r,o[r]=e(a,r),r++;return{values:o,keys:i}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let i=Ao(s),{values:o,keys:r}=this.dt(t,e,n);if(!Array.isArray(i))return this.ut=r,o;let a=this.ut??=[],c=[],l,d,u=0,h=i.length-1,g=0,_=o.length-1;for(;u<=h&&g<=_;)if(i[u]===null)u++;else if(i[h]===null)h--;else if(a[u]===r[g])c[g]=Re(i[u],o[g]),u++,g++;else if(a[h]===r[_])c[_]=Re(i[h],o[_]),h--,_--;else if(a[u]===r[_])c[_]=Re(i[u],o[_]),nt(s,c[_+1],i[u]),u++,_--;else if(a[h]===r[g])c[g]=Re(i[h],o[g]),nt(s,i[u],i[h]),h--,g++;else if(l===void 0&&(l=So(r,g,_),d=So(a,u,h)),l.has(a[u]))if(l.has(a[h])){let p=d.get(r[g]),w=p!==void 0?i[p]:null;if(w===null){let A=nt(s,i[u]);Re(A,o[g]),c[g]=A}else c[g]=Re(w,o[g]),nt(s,i[u],w),i[p]=null;g++}else Jt(i[h]),h--;else Jt(i[u]),u++;for(;g<=_;){let p=nt(s,c[_+1]);Re(p,o[g]),c[g++]=p}for(;u<=h;){let p=i[u++];p!==null&&Jt(p)}return this.ut=r,Co(s,c),Se}});var Xt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ce(s){return Xt[(s%Xt.length+Xt.length)%Xt.length]}var Zt="#23272E",On="35,39,46";var Ur=3,sn=36,jn=12,Mo=8,Po=30,$e=16,kt=100,Nn=60,zn=10,en=30,Un=10,Hr=150,Fr=200,nn=1.4;function Fn(s,t){let e=Math.max(Hr,Fr/nn);return Math.ceil(Nn+Math.max(0,s-1)*zn+en+Math.max(0,t-1)*Un+e*(s+nn*t))}function Pe(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function Le(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ge(s){return new Map(Pe(s).map((t,e)=>[t,ce(e)]))}function xe(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function me(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Kn(s,t){return t==="none"?"Not needed":Le(s).includes(t)?me(s,t):t}function on(s,t){return t.own?me(s,t.own):xe(s,t.kid)}var rn={color:Zt,rgb:On,ink:Zt};function Io(s,t){return t.own?rn:ge(s).get(t.kid)??ce(0)}function Kr(s,t){let e=Pe(s);return t.along.map(n=>e.includes(n)?xe(s,n):me(s,n))}function Wn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Wr(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function tn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Qt(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(tn(t,n.from)),e.push(tn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(tn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function qr(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],i=-1/0,o=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=i&&(o(),i=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),i=Math.max(i,r.en)}return o(),t}function Vr(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.t)return i.t===n.t?n.y:Math.round(n.y+(t-n.t)/(i.t-n.t)*(i.y-n.y))}return s[s.length-1].y}function Gr(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.y)return i.y===n.y?n.t:n.t+(t-n.y)/(i.y-n.y)*(i.t-n.t)}return s[s.length-1].t}function Bo(s,t){return Vr(s.anchors,t)}function Oo(s,t){return Gr(s.anchors,t)}function Yr(s,t){let e=Pe(s),n=Le(s),i=Math.max(t,Fn(e.length,n.length)),r=(i-Nn-Math.max(0,e.length-1)*zn-en-Math.max(0,n.length-1)*Un)/(e.length+nn*n.length||1),a=Math.floor(r),c=Math.floor(r*nn),l=new Map;for(let _ of s.days)for(let p of _.events)for(let w of p.own?p.along:[p.kid]){let A=l.get(w)??[];A.some(b=>b.event_id===p.event_id&&b.calendar_id===p.calendar_id)||A.push(p),l.set(w,A)}let d=ge(s),u=[],h=Nn;e.forEach((_,p)=>{let w=l.get(_)??[],A=s.days.some(b=>b.events.some(R=>R.kid===_&&(R.sides.includes("drop")&&R.drop===""||R.sides.includes("pick")&&R.pick==="")));u.push({id:_,kind:"kid",x:h,w:a,name:xe(s,_),dot:d.get(_).color,rgb:d.get(_).rgb,sub:`${A?"Needs a ride · ":""}${w.length} this week`,subWarn:A}),h+=a+(p<e.length-1?zn:0)});let g=h+en/2;return h+=en,n.forEach((_,p)=>{let w=0,A=0;for(let b of s.days){let R=b.drivers[_];R&&(w+=R.outings.length,A+=R.drive??0)}u.push({id:_,kind:"driver",x:h,w:c,name:me(s,_),dot:Zt,rgb:On,sub:`${w} ${w===1?"trip":"trips"} this week · ${gt(A)} driving`,subWarn:!1}),h+=c+(p<n.length-1?Un:0)}),{columns:u,sepX:g,width:i}}function Jr(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(t.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!o)return e;let r=i.slice(o[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Lo(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${U(s.start)}`:e||!t?`${s.title} until ${U(s.end)}`:`${s.title} ${U(s.start)}–${U(s.end)}`}function qn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length}function Vn(s,t){let e=ke(t,s);return e===0?"Today":e===1?"Tomorrow":""}function ue(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Hn(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),i=1,o=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(o===0?o=a:o+1+a<=n?o+=1+a:(i++,o=a);o>n;)i++,o-=n}return i}var jo=25,No=15,Gn=3;function Do(s){return Math.max(0,Math.min(Gn,Math.floor((s-jo)/No)))}function Xr(s,t){let e=Math.min(Gn,Hn(s,t-19,6.6));return jo+e*No+2}function Ro(s,t){let e=t-23,n=`${U(s.start)}–${U(s.end)}`+(s.arrive_by!=null?` · arrive ${U(s.arrive_by)}`:""),i=33+Hn(n,e,6.6)*16;for(let o of[s.lines.drop,s.lines.pick])o&&(i+=2+Hn(o.text,e,7)*16);return i+4}function zo(s,t,e,n){let i=t==="compact",{columns:o,sepX:r,width:a}=Yr(s,e),c=new Map(o.map(b=>[b.id,b])),l=Pe(s),d=Le(s),u=[...l,...d],h=ge(s),g=Wr(s),_=b=>xe(s,b),p=b=>me(s,b),w={mode:t,width:a,height:0,columns:o,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},A=0;return s.days.forEach((b,R)=>{let Z=R*1440,z=new Map(b.events.map(m=>[m.id,m])),re=m=>m&&z.has(m)?{day:b.date,event:m}:null,v=qn(b),E=b.events.length,y=Vn(b.date,n.date);w.dayHeads.push({date:b.date,y:A,label:we(b.date),tag:y,sub:(E?`${E} ${E===1?"activity":"activities"}`:"Nothing scheduled")+(v?` · ${v} to sort out`:""),warn:v>0}),w.anchors.push({t:Z,y:A});let k=A+sn+jn,$=d.flatMap(m=>b.drivers[m]?.outings??[]);if(!E&&!$.length){w.empties.push({key:b.date,y:k,text:"Nothing planned"}),A=k+40,w.anchors.push({t:Z+1439,y:A});return}let L=(m,I,W,B,X,de,P,x=m.kid)=>{let S=!!m.own&&x===m.own,N=!!m.own&&x!==m.own,j=S?rn:h.get(x)??ce(0),ee=S?p(x):_(x),Q=N?{drop:{text:`With ${p(m.own)}`,tone:m.attending===!1?"muted":"normal"},pick:null}:m.lines,M=S?Kr(s,m):[],te=(m.takes!=null?`${m.takes} min, any time ${U(m.start)}–${U(m.end)}`:`${U(m.start)}–${U(m.end)}`+(m.arrive_by!=null?` · arrive ${U(m.arrive_by)}`:""))+(M.length?` · with ${Wn(M)}`:"");return{key:`${b.date}|card|${m.id}`+(m.own?`|${x}`:""),x:I,y:W,w:B,h:X,target:{day:b.date,event:m.id},event:m,color:j,kidName:ee,clash:de,stayed:!m.own&&m.stay&&d.includes(m.drop),skipped:m.attending===!1,title:Jr(m.title,ee),time:te,drop:Q.drop,pick:Q.pick,showDrop:!!Q.drop&&(P||X>=56),showPick:!!Q.pick&&(P||X>=74),wrap:P,aria:`${ee}, ${m.title} ${m.takes!=null?`any time from ${U(m.start)} to ${U(m.end)}`:`${U(m.start)} to ${U(m.end)}`}. `+(m.attending===!1&&!Q.drop?"Not attending. ":"")+[Q.drop,Q.pick].filter(D=>!!D).map(D=>D.text).join(". ")}},C=m=>{let I=b.rides[m];return I?(b.drivers[I.driver]?.segments??[]).filter(B=>B.type!=="home"&&B.kids.includes(I.kid)&&ue(B.start)>=ue(I.start)&&ue(B.end)<=ue(I.end)):[]},K=m=>{let I=b.rides[m];if(!I)return null;let W=I.serves.find(B=>z.get(B)?.kid===I.kid);return re(W??I.serves[0])},H=(m,I)=>{if(I.event)return I;let W=b.events.find(B=>B.own&&B.own!==m&&B.along.includes(m)&&B.title===I.title);return W?{...I,title:`${I.title} with ${p(W.own)}`}:I},J=m=>{if(m.takes==null)return[m.start,m.end];let I=m.planned??m.start;return[I,I+m.takes]},O=new Map;for(let m of b.issues)m.level!=="problem"||!m.event||(m.kind==="late"&&O.set(m.event,`${Math.round(ue(m.minutes))} min late`),m.kind==="waiting"&&O.set(`${m.event}|pick`,`Waits ${Math.round(ue(m.minutes))} min`));if(!i){let m=1/0,I=-1/0;for(let P of b.events)P.start<=0&&P.end>=1440||(P.start>0?m=Math.min(m,P.start-20,P.arrive_by!=null?P.arrive_by-10:1/0):m=Math.min(m,P.end-30),P.end<1440?I=Math.max(I,P.end+20):I=Math.max(I,P.start+30));for(let P of $)P.start!=null&&(m=Math.min(m,P.start)),P.end!=null&&(I=Math.max(I,P.end));b.date===n.date&&Number.isFinite(m)&&n.minutes>m-60&&n.minutes<I&&(m=Math.min(m,n.minutes-15));let W=Number.isFinite(m)?Math.floor((m-5)/30)*30:900,B=Number.isFinite(I)?Math.ceil((I+5)/30)*30:960,X=P=>Math.round(k+(Math.max(W,Math.min(B,P))-W)*Ur);w.anchors.push({t:Z+W,y:X(W)},{t:Z+B,y:X(B)});for(let P of l){let x=c.get(P),S=h.get(P),N=(b.kids[P]?.items??[]).filter(D=>D.start!=null&&D.end!=null).map(D=>({item:D,s:ue(D.start),en:ue(D.end)})),j=[];for(let D of qr(N)){let F=x.w/D.cols,G=Math.round(x.x+D.col*F),ne=Math.round(F-(D.cols>1?4:0)),ie=X(D.s),se=D.item;if(se.type==="act"){let fe=z.get(se.event??"");if(!fe)continue;let Dt=Math.max(30,X(D.en)-ie),Rt=L(fe,G,ie,ne,Dt,se.clash,!1,P);if(Rt.layer=kt,w.cards.push(Rt),fe.arrive_by!=null&&fe.start-fe.arrive_by>=5){let kn=X(fe.arrive_by),js={key:`${b.date}|prep|${fe.id}`,x:G,y:kn,w:ne,h:ie-kn+$e,color:S,label:`Arrive by ${U(fe.arrive_by)}`,layer:kt-1};w.preps.push(js),j.push({s:fe.arrive_by,en:D.en,top:kn,bottom:ie+Dt,x:G,w:ne,prep:js,card:Rt})}else j.push({s:D.s,en:D.en,top:ie,bottom:ie+Dt,x:G,w:ne,card:Rt});let Bs=O.get(fe.id);Bs&&w.marks.push({key:`${b.date}|late|${fe.id}`,x:G+ne-4,y:ie+4,text:Bs,right:!0});let Os=O.get(`${fe.id}|pick`);Os&&w.marks.push({key:`${b.date}|wait|${fe.id}`,x:G+4,y:ie+Dt+2,text:Os,right:!1});continue}let Y=b.rides[se.ride??-1];if(!Y)continue;let ye=Math.max(22,X(D.en)-ie),ut=Qt(C(Y.index),g),Ds=p(Y.driver),Rs={key:`${b.date}|ride|${Y.index}`,x:G,y:ie,w:ne,h:ye,target:K(Y.index),l1:`${Y.own?"In":"Along in"} ${Ds}’s car`,l2:ut.join(" → "),show2:Do(ye)>0,lines2:Do(ye),dashed:!Y.own,clash:se.clash,aria:`${_(P)} ${Y.own?"in":"riding along in"} ${Ds}’s car, ${U(ue(Y.start))} to ${U(ue(Y.end))}: ${ut.join(" to ")}`};w.rides.push(Rs);let Is=c.get(Y.driver),wn=null;Is&&(wn={key:`${b.date}|band|${Y.index}`,x:G+ne,y:ie,w:Math.max(0,Is.x+8-(G+ne)),h:ye,color:S},w.bands.push(wn)),j.push({s:D.s,en:D.en,top:ie,bottom:ie+ye,x:G,w:ne,ride:Rs,band:wn})}let ee=D=>D.ride?.layer??(D.prep?kt-1:kt),Q=(D,F,G,ne)=>{G>$e&&w.links.push({key:`${D.key}|link`,x:D.x,y:F,w:D.w,h:G,color:S,layer:ne})},M=(D,F)=>{if(!(F.x<D.x||F.x+F.w>D.x+D.w)&&(D.x=F.x,D.w=F.w,D.ride.x=F.x,D.ride.w=F.w,D.band)){let G=D.band.x+D.band.w;D.band.x=F.x+F.w,D.band.w=Math.max(0,G-D.band.x)}},te=new Set;for(let D of[...j].sort((F,G)=>G.s-F.s)){let F=D.ride;if(!F)continue;let G=j.filter(se=>se!==D&&se.s>=D.en&&se.s-D.en<=Po&&se.top>=D.bottom).sort((se,Y)=>se.s-Y.s||se.top-Y.top)[0];if(!G)continue;te.add(D),M(D,G);let ne=ee(G),ie=G.top-D.bottom;Q(F,D.bottom,ie+$e,ne-1),F.layer=ne-(ie>0?2:1),F.h+=$e,F.tuckBottom=$e}for(let D of[...j].sort((F,G)=>F.s-G.s)){let F=D.ride;if(!F||te.has(D))continue;let G=j.filter(se=>se!==D&&se.en<=D.s&&D.s-se.en<=Po&&se.bottom<=D.top&&(se.card||se.ride?.layer!=null)).sort((se,Y)=>Y.en-se.en||Y.bottom-se.bottom)[0];if(!G)continue;M(D,G);let ne=G.ride?.layer??kt,ie=D.top-G.bottom;Q(F,G.bottom-$e,ie+$e,ne-1),F.layer=ne-(ie>0?2:1),F.y-=$e,F.h+=$e,F.tuckTop=$e}}for(let P of d){let x=c.get(P),S=b.drivers[P];if(!S)continue;let N=[],j=null;for(let M of S.segments)if(!(M.start==null||M.end==null)){if(M.type==="home"){j=null;continue}if(M.type==="stay"){j=null,N.push({type:"stay",g:M,s:M.start,en:M.end});continue}j&&j.en===M.start?(j.en=M.end,j.legs.push(M)):(j={type:"trip",s:M.start,en:M.end,legs:[M]},N.push(j))}let ee=new Set,Q=(M,te,D,F)=>{ee.add(M.id);let G=X(te),ne=L(M,x.x+8,G,x.w-16,Math.max(30,X(D)-G),!1,!1,P);F&&ne.drop?.tone==="normal"&&(ne.drop=null,ne.showDrop=!1),w.cards.push(ne)};for(let M of N){let te=X(M.s),D=Math.max(24,X(M.en)-te);if(M.type==="stay"){let Y=z.get(M.g.event??M.g.serves??"");if(Y?.own===P){Q(Y,M.s,M.en,!0);continue}let ye=Y?h.get(Y.kid)??ce(0):ce(0),ut=M.g.kids.map(_);w.stays.push({key:`${b.date}|stay|${P}|${M.s}`,x:x.x+8,y:te,w:x.w-16,h:D,target:re(Y?.id),color:ye,l1:Y?`At ${Y.title} with ${_(Y.kid)}`:"Staying",l2:`until ${U(M.en)}`+(ut.length?` · ${ut.join(" and ")} too`:"")});continue}let F=M.legs[0],G=M.legs[M.legs.length-1],ne=[];for(let Y of M.legs)for(let ye of Y.kids)ne.includes(ye)||ne.push(ye);let ie=G.type==="drive"&&G.to==="home",se=Qt(M.legs,g);w.trips.push({key:`${b.date}|trip|${P}|${M.s}`,x:x.x+8,y:te,w:x.w-16,h:D,target:re(M.legs.find(Y=>Y.serves)?.serves),l1:F.type==="drive"&&F.from==="home"?`Leave ${U(M.s)}`:`From ${tn(g,F.from??F.place)} ${U(M.s)}`,l2:se.join(" → "),show2:D>=36,l3:ie?`Home ${U(M.en)}`:"",show3:ie&&D>=62,stops:null,kids:ne.map(Y=>(h.get(Y)??ce(0)).color),bad:M.legs.some(Y=>Y.overlaps_busy),aria:`${p(P)} drives ${se.join(" to ")}, ${U(M.s)} to ${U(M.en)}`})}for(let M of S.segments)if(!(!M.overlaps_busy||M.start==null||M.end==null))for(let te of S.busy){let D=Math.max(M.start,te.start),F=Math.min(M.end,te.end);F<=D||w.overlaps.push({key:`${b.date}|overlap|${P}|${D}`,x:x.x+6,y:X(D)-2,w:x.w-12,h:Math.max(8,X(F)-X(D)+4)})}for(let M of b.events)if(M.own===P&&(ee.has(M.id)||Q(M,...J(M),!1),M.takes!=null&&M.attending!==!1)){let te=X(M.start);w.windows.push({key:`${b.date}|window|${M.id}`,x:x.x+4,y:te,w:x.w-8,h:Math.max(24,X(M.end)-te),label:`${M.title} · any time ${U(M.start)}–${U(M.end)}`})}for(let M of S.busy){if(M.event||M.end<=W||M.start>=B)continue;let te=H(P,M),D=X(te.start),F=X(te.end);w.busy.push({key:`${b.date}|busy|${P}|${te.start}`,x:x.x+1,y:D,w:x.w-2,h:F-D,labelY:8,label:Lo(te,!1)})}}let de=-1/0;for(let P=W;P<=B;P+=30)w.grid.push({key:`${b.date}|grid|${P}`,y:X(P),strong:P%60===0}),P%60===0&&X(P)-de>=22&&(w.hours.push({key:`${b.date}|hour|${P}`,y:X(P)-8,label:eo(P)}),de=X(P));b.date===n.date&&n.minutes>W&&n.minutes<B&&(w.now={y:X(n.minutes),label:`Now ${U(n.minutes)}`}),A=X(B)+jn;return}let V=[];for(let m of l){let I=c.get(m);for(let W of b.kids[m]?.items??[])if(W.start!=null){if(W.type==="act"){let B=z.get(W.event??"");if(!B)continue;V.push({col:m,s:W.start,h:Ro(B,I.w),kind:"act",item:W})}else if(!b.rides[W.ride??-1]?.own){let B=b.rides[W.ride??-1],X=B?Qt(C(B.index),g).join(" → "):"";V.push({col:m,s:W.start,h:Xr(X,I.w),kind:"along",item:W})}}}for(let m of d){let I=b.drivers[m];if(!I)continue;for(let B of I.busy)B.event||V.push({col:m,s:B.start,h:32,kind:"busy",busy:H(m,B)});let W=c.get(m).w;for(let B of b.events)B.own!==m||B.attending!==!1&&(B.takes==null||B.planned!=null)||V.push({col:m,s:J(B)[0],h:Ro(B,W),kind:"own",event:B});for(let B of I.outings)B.start!=null&&V.push({col:m,s:B.start,h:30+B.lines.length*16+(B.warn?16:0),kind:"out",out:B})}V.sort((m,I)=>m.s-I.s||u.indexOf(m.col)-u.indexOf(I.col));let q=new Map,oe=[],Qe=k;V.forEach((m,I)=>{let W=q.get(m.col),B=Math.max(W!=null?W+Mo:k,Qe);q.set(m.col,B+m.h),Qe=B;let X=m.kind==="busy"?m.busy.end:m.kind==="act"?z.get(m.item.event??"")?.end??null:m.kind==="own"?J(m.event)[1]:null;oe.push({col:m.col,s:m.s,end:X,y:B,h:m.h,box:null}),w.anchors.push({t:Z+m.s,y:B});let de=c.get(m.col);if(m.kind==="busy"){let P={key:`${b.date}|busy|${m.col}|${I}`,x:de.x+1,y:B,w:de.w-2,h:m.h,labelY:8,label:Lo(m.busy,!0)};w.busy.push(P),oe[oe.length-1].box=P}else if(m.kind==="out"){let P=m.out;w.trips.push({key:`${b.date}|trip|${m.col}|${I}`,x:de.x+8,y:B,w:de.w-16,h:m.h,target:re(P.target),l1:P.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...P.lines.map(x=>({text:x,warn:!1})),...P.warn?[{text:P.warn,warn:!0}]:[]],kids:P.kids.map(x=>(h.get(x)??ce(0)).color),bad:!!P.warn,aria:`${p(m.col)}: ${P.lead}. ${P.lines.join(". ")}${P.warn?`. ${P.warn}`:""}`})}else if(m.kind==="own"){let P=L(m.event,de.x+8,B,de.w-16,m.h,!1,!0,m.col);w.cards.push(P),oe[oe.length-1].box=P}else if(m.kind==="act"){let P=z.get(m.item.event??""),x=L(P,de.x,B,de.w,m.h,m.item.clash,!0,m.col);w.cards.push(x),oe[oe.length-1].box=x}else{let P=b.rides[m.item.ride??-1],x=Qt(C(P.index),g),S=p(P.driver);w.rides.push({key:`${b.date}|ride|${P.index}`,x:de.x,y:B,w:de.w,h:m.h,target:K(P.index),l1:`Along with ${S} ${U(ue(P.start))}`,l2:x.join(" → "),show2:!0,lines2:Gn,dashed:!0,clash:m.item.clash,aria:`${_(m.col)} riding along with ${S}, ${U(ue(P.start))} to ${U(ue(P.end))}: ${x.join(" to ")}`})}});let ve=k;for(let m of q.values())ve=Math.max(ve,m);for(let m of oe){if(!m.box||m.end==null)continue;let I=m.y+m.h;for(let W of oe)W.col!==m.col&&W.s>=m.s&&W.s<m.end&&(I=Math.max(I,W.y+W.h));m.end>=1440&&(I=ve);for(let W of oe)W.col===m.col&&W.y>m.y&&(I=Math.min(I,W.y-Mo));I=Math.min(I,ve),I>m.y+m.h&&(m.box.h=I-m.y)}A=ve+jn+6,w.anchors.push({t:Z+1439,y:A})}),w.height=A,w}var Zr=["","¼","½","¾"];function We(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return gt(n);let i=Math.round(n*4),o=Math.floor(i/4),r=Zr[i%4];return`${o||!r?o:""}${r} min`})}function Uo(s){let t=e=>e?{...e,text:We(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,i])=>[n,{...i,outings:i.outings.map(o=>({...o,lines:o.lines.map(We),warn:o.warn==null?o.warn:We(o.warn)}))}])),issues:e.issues.map(n=>({...n,title:We(n.title),body:We(n.body),note:n.note==null?n.note:We(n.note),...n.suggestions?{suggestions:n.suggestions.map(i=>({...i,note:We(i.note)}))}:{}}))}))}}var Qr=2,ea=48;function Ho(s,t,e=ea){let n=[],i=0,o=0,r=0,a=0,c=t.minutes+e*60;for(let l of s.days){let d=ke(t.date,l.date),u=d===0?"":`${pe(l.date)} · `,h=new Map(l.events.map(p=>[p.id,p])),g=p=>p&&h.has(p)?{day:l.date,event:p}:null,_=(p,w)=>d*1440+(p??h.get(w??"")?.start??0)<c;for(let p of l.issues)if(p.level==="problem"){if(!_(p.at,p.event)){r++,p.kind==="unassigned"&&a++;continue}i++,p.kind==="unassigned"&&o++,n.push({key:`${l.date}|${p.key}`,tone:p.kind==="unassigned"?"unassigned":"problem",title:u+p.title,body:p.body,target:g(p.event),suggestions:(p.suggestions??[]).map(w=>({id:w.id,label:w.label,note:w.note}))})}if(l.clashes.forEach((p,w)=>{if(!_(p.a.start,p.a.event)){r++;return}i++;let A=h.get(p.a.event??""),b=xe(s,p.kid),R=(z,re)=>{let v=g(re);return v?{text:z,target:v}:z},Z=[];if(p.b.type==="act"){let z=h.get(p.b.event??"");A&&z&&(Z=[R(A.title,A.id),` ${U(A.start)}–${U(A.end)} and `,R(z.title,z.id),` ${U(z.start)}–${U(z.end)} overlap.`])}else{let z=l.rides[p.b.ride??-1];A&&z&&(Z=[`${b} is in `,R(`${me(s,z.driver)}’s car`,z.serves[0]),` ${U(ue(p.b.start))}–${U(ue(p.b.end))}, during `,R(A.title,A.id),"."])}n.push({key:`${l.date}|clash|${w}`,tone:"problem",title:`${u}${b} is double-booked`,body:Z.map(z=>typeof z=="string"?z:z.text).join(""),parts:Z,target:null,suggestions:[]})}),d>=0&&d<Qr)for(let p of l.issues)p.level!=="heads_up"||!_(p.at,p.event)||n.push({key:`${l.date}|${p.key}`,tone:"heads_up",title:u+p.title,body:p.body,target:g(p.event),suggestions:[]});for(let p of l.events)!p.problems.length||!_(p.start)||n.push({key:`${l.date}|notes|${p.id}`,tone:"heads_up",title:`${u}Check the notes on ${on(s,p)}’s ${p.title}`,body:`These lines couldn’t be read: ${p.problems.join("; ")}`,target:g(p.id),suggestions:[]})}return{items:n,problems:i,unassigned:o,later:r,laterUnassigned:a}}function Fo(s,t){let e=ge(s),n=null,i=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of s.days){let r=ke(t.date,o.date);if(!(r<0))for(let a of Le(s))for(let c of o.drivers[a]?.outings??[]){if(c.start==null)continue;let l=r*1440+c.start;if(r*1440+ue(c.end,c.start)<=t.minutes)continue;let u=l-t.minutes,h={driver:a,name:me(s,a),date:o.date,ahead:r,start:c.start,inMinutes:u,ongoing:u<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(g=>e.get(g)??ce(0)),warn:c.warn,target:c.target&&o.events.some(g=>g.id===c.target)?{day:o.date,event:c.target}:null};(!n||i(h)<i(n)||i(h)===i(n)&&h.inMinutes<n.inMinutes)&&(n=h)}}return n}function st(s){return s.state==="done"||s.state==="late"}var ta=780;function na(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<ta}function Ko(s,t){return s.chores.map(e=>na(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function Wo(s){return s.state==="open"||s.state==="overdue"}function Xn(s,t,e){if(st(s)){let n=s.done_at?sa(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Yn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Yn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let i=ke(t,s.due);return`By ${i===1?"tomorrow":i<7?pe(s.due):Jn(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Yn(s.for_day,t)}`;if(s.due&&s.due>t){let n=ke(t,s.due);return n===1?"By tomorrow":`By ${n<7?pe(s.due):Jn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Yn(s,t){let e=ke(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?pe(s):Jn(s)}function Jn(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function sa(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let o=n.toLocaleDateString("en-CA",{timeZone:i}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return o===t?r:`${pe(o)} ${r}`}function qo(s,t,e=1440){let n=Ko(s,e).sort((i,o)=>i.order-o.order);return s.kids.map((i,o)=>{let r=n.filter(d=>d.kid===i.id),a=new Map;for(let d of r){if(d.state!=="upcoming")continue;let u=d.shows_from??d.due??s.today;a.set(u,[...a.get(u)??[],d])}let c=r.filter(d=>d.state==="overdue"),l=r.filter(d=>d.state==="open");return{kid:i.id,name:i.name,color:t?.get(i.id)??ce(o),overdue:c,now:l,done:r.filter(st),later:[...a.entries()].sort(([d],[u])=>d.localeCompare(u)).map(([d,u])=>({date:d,chores:u})),left:c.length+l.length}})}function Vo(s,t=1440){return Ko(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Zn(s){return!s.chores.length&&!s.templates.length}var qe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Qn(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[i,o]=n.split("-").map(r=>qe.indexOf(r.trim()));if(i===void 0||i<0||o!==void 0&&o<0)return null;if(o===void 0)e.add(i);else for(let r=0;r<=(o-i+7)%7;r++)e.add((i+r)%7)}return e}function es(s){let t=[...new Set(s)].sort((n,i)=>n-i);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let i=e.at(-1);i&&i.at(-1)===n-1?i.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${qe[n[0]]}-${qe[n.at(-1)]}`]:n.map(i=>qe[i])).join(", ")}var Ve="none";function an(s){return s==="daily"||s==="school"?"":"Any"}function Go(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Yo(s){let t=s.days??an(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function ts(s){return s.title.trim()?s.who.length?s.days===Ve?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Jo(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function ns(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function ss(s,t,e=1,n=!1,i=!1){if(s==="school"){let d=t.trim().replace(/-/g,"–"),u=i?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return n?`${u}, the night before`:u}let o={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${o}s`:`each ${o}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let l=`${a.split(",").map(d=>{let u=d.trim();return u.toLowerCase()==="last"?"the last day":/^\d+$/.test(u)?`the ${ns(Number(u))}`:`the ${u}`}).join(" and ")} ${r}`;return l[0].toUpperCase()+l.slice(1)}function os(s,t,e=!1){let n=s.map(o=>t.find(r=>r.id===o)?.name??o);if(!n.length)return"Nobody yet";let i=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${i} take turns`:i}function is(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function ln(s,t){return`${s}|${t}`}function ot(s,t){let[e,n,i]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,i+t)).toISOString().slice(0,10)}function cn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Xo(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Zo(s,t){return cn(t)<5&&!Xo(s,t)}function $t(s,t,e=new Map){if(!Zo(s,t))return null;let n=ln(s.id,t);if(e.has(n)){let o=e.get(n);return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}let i=s.picks[t];return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}function it(s,t){return Zo(s,t)?s.menus?.[t]??null:null}var oa="From the school's menu feed.";function ia(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==oa);return t.length?t.join(`
`):null}function Ee(s){return s.slice(0,7)}function dn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function rs(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Qo(s){let t=[];for(let e=Ee(s.first);e<=Ee(s.last);e=rs(e))t.push(e);return t}function ei(s,t,e,n=new Map){let i=`${e}-01`,o=ot(i,-cn(i)),r=[];for(;Ee(o)<=e;){let a=[];for(let c=0;c<5;c++){let l=ot(o,c),d=Ee(l)!==e,u=d?null:Xo(t,l),h=d?null:$t(t,l,n);a.push({date:l,day:Number(l.slice(8)),outside:d,off:u?u.title:null,lunch:h?.lunch??null,picked:h?.picked??!1,menu:d?null:it(t,l)?.dish??null,sides:d?null:ia(it(t,l)?.details??""),past:l<s.today,today:l===s.today})}a.some(c=>!c.outside)&&r.push(a),o=ot(o,7)}return r}function ti(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function ni(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function si(s,t,e,n=new Map){let i=e<780?0:1;for(let o=i;o<8;o++){let r=ot(t,o),a=$t(s,r,n);if(!a)continue;let c=ke(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":pe(r),date:r,menu:it(s,r)?.dish??null}}return null}var ra={timeline:"timeline",full:"timeline",compact:"compact"};function Et(s){let t=new URLSearchParams(s),e={},n=ra[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(t.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores"||i==="lunch")&&(e.page=i),e}var aa=["auth_callback","code","state"];function as(s){let t=new URLSearchParams(s);for(let n of aa)t.delete(n);let e=t.toString();return e?`?${e}`:""}var oi=Ne`
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
`;var Fi="mydashlight.rides.mode",Nl=1100,zl=440,Ul=700,Hl=3*6e4,Fl=1200;function Kl(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var vn=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Ni=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Wl=new URL("emoji.json",import.meta.url).href,zi=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Ui=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Hi=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,ql=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Vl=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Ct={bring:"Bring",buy:"Buy"};function Gl(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Te(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Cs(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Yl(s,t){return Vn(s,t)||we(s).split(",")[0]}function Jl(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Xl(){try{return localStorage.getItem(Fi)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Zl(s){try{localStorage.setItem(Fi,s)}catch{}}function yn(s){return s.days.every(t=>!t.events.length)}var At=class extends be{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Et(location.search).view;this.urlPage=Et(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let i=e.clientX-n.x,o=e.clientY-n.y;if(!n.moved){if(Math.abs(i)+Math.abs(o)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-o,n.el.scrollLeft=n.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Hl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Xl(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[i,o]of this.lunchDraft){let[r,a]=i.split("|"),c=e.kids.find(l=>l.id===r);(!c||(c.picks[a]??null)===o||!$t(c,a))&&n.delete(i)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let i of e.chores)n.has(i.id)&&st(i)===n.get(i.id)&&n.delete(i.id);for(let i of n.keys())e.chores.some(o=>o.id===i)||n.delete(i);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Uo(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Nl)return!1;let e=this.plan;return!e||this.width-zl>=Fn(Pe(e).length,Le(e).length)}today(){return ft(this.plan?.time_zone??Kl())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),i=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=zo(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let i=this.scroller;if(!i||!this.board)return;let o=this.board.dayHeads.find(r=>r.date===n)?.y??0;i.scrollTop=Math.max(o,Bo(this.board,e)-sn-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let o=this.dayIndexOf(e),r=n.days[o];if(!r)return;let a=1/0;if(this.mode==="timeline"){for(let c of r.events)a=Math.min(a,c.arrive_by??c.start);for(let c of Object.values(r.drivers))for(let l of c.outings)l.start!=null&&(a=Math.min(a,l.start))}this.scrollToTime(o*1440+(Number.isFinite(a)?Math.max(0,a-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,i=this.board.dayHeads[0];for(let l of this.board.dayHeads)l.y<=n+1&&(i=l);let o=this.renderRoot,r=o.querySelector(".pinned .label"),a=o.querySelector(".pinned .tag"),c=o.querySelector(".pinned .sub");r&&r.textContent!==i.label&&(r.textContent=i.label),a&&(a.textContent!==i.tag&&(a.textContent=i.tag),a.hidden=!i.tag),c&&c.textContent!==i.sub&&(c.textContent=i.sub),c?.classList.toggle("warn",i.warn);for(let l of o.querySelectorAll(".day-tile"))l.classList.toggle("in-view",l.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),o=new Map(this.choreDraft);o.set(e.id,i),this.choreDraft=o;try{await this.backend.setChoreDone(e.id,i,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof ae?r:new ae("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??st(e)}editMenu(e,n){let i=this.lunch?.kids??[],o=it(e,n),r=i.filter(a=>a.id===e.id||o&&it(a,n)?.dish===o.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:o?.dish??"",details:o?.details??"",kids:r,had:!!o,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(i){this.menuEdit={...n,busy:!1};let o=i instanceof ae?i:new ae("error",String(i));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async saveLunch(e,n,i){if(!this.backend||!n.length)return;let o=new Map(this.lunchDraft);for(let r of n)o.set(ln(e,r),i);this.lunchDraft=o;try{await this.backend.setLunch(e,n,i)}catch(r){let a=new Map(this.lunchDraft);for(let l of n)a.delete(ln(e,l));this.lunchDraft=a;let c=r instanceof ae?r:new ae("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Yo(e):Go(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(ji(),Oi))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ts(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Jo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let i=n instanceof ae?n:new ae("error",String(n));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let i=n instanceof ae?n:new ae("error",String(n));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?Oo(this.board,n.scrollTop+sn+4):null,this.mode=e,this.urlView||Zl(e)}findEvent(e){let n=this.plan?.days.find(o=>o.date===e.day),i=n?.events.find(o=>o.id===e.event);return n&&i?{day:n,event:i}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),i=this.dayIndexOf(e.day);!n||i<0||this.scrollToTime(i*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,i){if(!this.pending){this.pending={key:e,value:n};try{await i()}catch(o){let r=o instanceof ae?o:new ae("error",String(o));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,i){if(!this.backend)return;let o=this.backend;this.save(`${n}`,i,()=>o.setRide(e.id,n,i,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let i=this.backend;this.save("attending",n,()=>i.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n){if(!this.backend)return;let i=this.backend,o=e.along.includes(n)?e.along.filter(r=>r!==n):[...e.along,n];this.save("along",o,()=>i.setTakeAlong(e.id,o,this.scope))}nudgeArrive(e,n){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;n<0?o=(i??e.start)-5:o=i==null||i+5>=e.start?null:i+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Fl)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let i=this.findEvent(n);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,r=i.event.id,a=this.scope;this.save("arrive",e,()=>o.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),i=e?Ho(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},o=this.wide,r=this.chores?Vo(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],a=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",l=f`<aside class="panel" aria-label=${c}>
      ${a??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,r))}
    </aside>`,d=this.page==="rides";return f`
      <div class="app ${o?"wide":this.width<Ul?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,r.length)} ${d&&e?this.renderWeek(e):T}
          ${d?this.renderBanner(e):T}
          <main>
            ${d?f`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?yn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:this.page==="lunch"?f`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!o&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${l}`:T}
          </main>
        </div>
        ${o?l:T}
        ${this.toast?f`<div class="toast" role="status">${this.toast}</div>`:T}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,i){let o=n.problems+i;this.tick;let r=this.today(),a="";if(e){let h=e.time_zone,g=new Date(e.updated);this.error?a=f`<span class="bad">Can’t reach Home Assistant · showing the plan from ${jt(g,new Date,h)}</span>`:e.status&&!e.status.ok?a=f`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${jt(g,new Date,h)}</span>`:this.backend?.live||(a=`Updated ${jt(g,new Date,h)}`)}let c=(h,g,_,p)=>f`
      <button type="button" class="seg-btn" title=${p} aria-pressed=${this.mode===h?"true":"false"} @click=${()=>this.setMode(h)}>
        ${_}<span class="seg-label">${g}</span>
      </button>
    `,l=(h,g,_)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===h?"true":"false"} @click=${()=>this.setPage(h)}>
        ${_}<span class="seg-label">${g}</span>
      </button>
    `,d=pt(r.minutes),u=!!e&&yn(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${le`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:T}
        <div class="titles">
          <h1 class="clock" aria-label=${`${we(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">${we(r.date)}</p>
          ${a?f`<p class="status">${a}</p>`:T}
        </div>
        ${e&&!u?this.renderNext(e,Fo(e,r),n):T}
        <div class="controls">
          ${this.wide||u&&!i?T:f`<button type="button" class="attn-btn ${o?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${o}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?T:f`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",le`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",le`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${l("rides","Rides",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${l("chores","Chores",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?T:l("lunch","Lunch",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,i){if(!n){let l=this.today().date,d=i.unassigned,u=i.laterUnassigned;if(d){let g=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?f`<div class="next idle needs">${g}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${g}</button>`}if(u)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${u} ${u===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let h=e.days.some(g=>g.date>=l&&g.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${h?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${h?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let o;n.ongoing?o="On the road now":n.ahead===0?o=n.inMinutes<180?`Next trip · in ${gt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?o="Next trip · tomorrow":o=`Next trip · ${pe(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=f`
      <span class="next-eyebrow">${o}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Te(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(l=>f`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
      </span>
      ${n.warn?f`<span class="next-stop warn">${n.warn}</span>`:n.stop?f`<span class="next-stop">${n.stop}</span>`:T}
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?f`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:f`<div class=${c}>${a}</div>`}renderWeek(e){let n=this.today().date,i=ge(e);return f`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let r=qn(o),a=o.events.length,c=o.events.slice(0,6).map(d=>d.own?rn.color:i.get(d.kid)?.color??ce(0).color),l=`${we(o.date)}: ${a?`${a} ${a===1?"activity":"activities"}`:"nothing planned"}${r?`, ${r} to sort out`:""}`;return f`<button
          type="button"
          class="day-tile ${o.date===n?"today":""}"
          data-date=${o.date}
          aria-label=${l}
          @click=${()=>this.goToDay(o.date)}
        >
          <span class="dt-wd">${o.date===n?"Today":pe(o.date)}</span>
          <span class="dt-num">${Number(o.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${c.length?c.map(d=>f`<span class="dt-dot" style="background:${d}"></span>`):f`<span class="dt-free">free</span>`}
            ${a>6?f`<span class="dt-more">+${a-6}</span>`:T}
          </span>
          ${r?f`<span class="dt-badge" aria-hidden="true">${r}</span>`:T}
        </button>`})}
    </nav>`}renderQuiet(e){let n=Pe(e),i=Le(e),o=ge(e),r=n.map(a=>xe(e,a));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>le`<circle cx=${50+c*30} cy="80" r="11" fill=${o.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Jl(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=o.get(a);return f`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Te(xe(e,a))}</span>
            <span class="qw-name">${xe(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(a=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Te(me(e,a))}</span>
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
    </div>`}renderBanner(e){let n=e?.unavailable_calendars.length??0;return n?f`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:T}renderEmpty(){return this.error?f`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:f`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,i=l=>!!l&&!!n&&l.day===n.day&&l.event===n.event,o=e.dayHeads[0],r=e.width,a=100,c=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??a-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??a})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??a+1}))].sort((l,d)=>l.z-d.z);return f`
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
          ${e.columns.map(l=>f`<div class="col-head ${l.kind}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${Te(l.name)}</span>
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
          ${e.columns.map(l=>f`<div
                class="col-bg ${l.kind}"
                style="left:${l.x}px;width:${l.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${l.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(l=>f`<div class="day-head" style="top:${l.y}px;width:${r}px">
              <span class="label">${l.label}</span>${l.tag?f`<span class="tag">${l.tag}</span>`:T}<span
                class="sub ${l.warn?"warn":""}"
                >${l.sub}</span
              >
            </div>`)}
          ${e.empties.map(l=>f`<span class="empty" style="top:${l.y}px">${l.text}</span>`)}
          ${e.grid.map(l=>f`<div class="grid ${l.strong?"strong":""}" style="top:${l.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(l=>f`<span class="hour" style="top:${l.y}px">${l.label}</span>`)}
          ${Me(e.bands,l=>l.key,l=>f`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Me(e.busy,l=>l.key,l=>f`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Me(e.windows,l=>l.key,l=>f`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Me(c,l=>l.x.key,l=>{if(l.t==="link"){let g=l.x;return f`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-color:${g.color.color};background:linear-gradient(rgba(${g.color.rgb},0.11), rgba(${g.color.rgb},0.11)), var(--surface)"
                ></div>`}if(l.t==="prep"){let g=l.x;return f`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-color:${g.color.color};background:linear-gradient(rgba(${g.color.rgb},0.11), rgba(${g.color.rgb},0.11)), var(--surface);color:${g.color.ink}"
                >
                  ${g.label}
                </div>`}if(l.t==="ride"){let g=l.x;return f`<button
                  type="button"
                  class="ride ${g.dashed?"dashed":""} ${g.clash?"clash":""}"
                  aria-label=${g.aria}
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;padding-top:${3+(g.tuckTop??0)}px;padding-bottom:${3+(g.tuckBottom??0)}px"
                  @click=${()=>this.open(g.target)}
                >
                  <span class="l1">${g.l1}</span>${g.show2?f`<span class="l2" style="-webkit-line-clamp:${g.lines2}">${g.l2}</span>`:T}
                </button>`}let d=l.x,u=d.color,h=d.skipped?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.10) 0px, rgba(${u.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:d.stayed?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.24) 0px, rgba(${u.rgb},0.24) 6px, rgba(${u.rgb},0.08) 6px, rgba(${u.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${u.rgb},0.15), rgba(${u.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${d.wrap?"wrap":""} ${i(d.target)?"sel":""} ${d.clash?"clash":""} ${d.skipped?"skipped":""}"
                aria-label=${d.aria}
                style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:${h};border-color:${d.clash?"var(--bad)":`rgba(${u.rgb},0.45)`};--c:${u.color};--rgb:${u.rgb};--ring:${u.color}"
                @click=${()=>this.open(d.target)}
              >
                <span class="top">
                  <span class="title">${d.title}</span>
                  <span class="time">${d.time}</span>
                  ${d.showDrop&&d.drop?f`<span class="line tone-${d.drop.tone}">${d.drop.text}</span>`:T}
                </span>
                ${d.showPick&&d.pick?f`<span class="line tone-${d.pick.tone}">${d.pick.text}</span>`:T}
              </button>`})}
          ${Me(e.stays,l=>l.key,l=>f`<button
                type="button"
                class="stay"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Me(e.trips,l=>l.key,l=>f`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(d=>f`<span class="kid-dot" style="background:${d}"></span>`)}</span>
                ${l.show2?f`<span class="l2">${l.l2}</span>`:T}
                ${l.stops?l.stops.map(d=>f`<span class="stop ${d.warn?"warn":""}">${d.text}</span>`):T}
                ${l.show3?f`<span class="l3">${l.l3}</span>`:T}
              </button>`)}
          ${Me(e.overlaps,l=>l.key,l=>f`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Me(e.marks,l=>l.key,l=>f`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:T}
        </div>
      </div>
    `}renderAttention(e,n){let{items:i,problems:o,later:r}=e,a=this.plan,c=o+n.length,l=this.chores,d=!!l&&!Zn(l);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?T:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?f`<div class="attn-chores">${n.map(u=>this.renderChoreRow(u,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!o?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${le`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${yn(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:T}
      ${i.map(u=>f`<div class="issue ${u.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${u.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${u.target?f`<button type="button" class="issue-title" @click=${()=>this.open(u.target,!0)}>${u.title}</button>`:f`<strong class="issue-title">${u.title}</strong>`}
              <span class="issue-body"
                >${u.parts?u.parts.map(h=>typeof h=="string"?h:f`<button type="button" class="issue-link" @click=${()=>this.open(h.target,!0)}>${h.text}</button>`):u.body}</span
              >
            </div>
          </div>
          ${u.suggestions.length?f`<div class="fixes">
                ${u.suggestions.map(h=>f`<button
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
      ${this.wide&&a&&!yn(a)&&this.page==="rides"?this.renderLegend():T}
    `}kidColorOf(e){let n=this.plan?ge(this.plan).get(e):void 0;if(n)return n;let i=this.lunch?.kids.findIndex(o=>o.id===e)??-1;return ce(Math.max(0,i))}renderLunchChip(e,n=!1){let i=this.lunch,o=i?.kids.find(l=>l.id===e);if(!i||!o)return T;this.tick;let r=this.today(),a=si(o,r.date,r.minutes,this.lunchDraft);if(!a)return T;let c=Ct[a.lunch];return f`<span class="lunch-chip ${a.lunch} ${n?"small":""}" title=${`${c} lunch ${a.when}${a.menu?`: ${a.menu}`:""}`}
      >${a.lunch==="bring"?Ui:Hi}<span class="lunch-chip-text"
        >${c}${n?T:` ${a.when}`}${!n&&a.menu?f`<span class="lunch-chip-menu"> · ${a.menu}</span>`:T}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return f`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Qo(e),i=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Ee(e.today),o=n.indexOf(i),r=d=>{let u=n[o+d];u&&(this.lunchMonth=u)},a=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(d=>d.id===a):e.kids,l=e.status&&!e.status.ok?f`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:T;return f`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${o<=0} @click=${()=>r(-1)}>
            ${le`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${dn(i)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${o<0||o>=n.length-1} @click=${()=>r(1)}>
            ${le`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":f`${Ni} Edit menus`}
        </button>
      </div>
      ${l}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${c.length}">
        ${c.map(d=>this.renderLunchCard(e,d,i,a!==null))}
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
    </div>`}renderLunchCard(e,n,i,o){let r=this.kidColorOf(n.id),a=ei(e,n,i,this.lunchDraft),c=ni(a),l=a.flat(),d=l.filter(p=>!p.outside&&!p.past&&p.lunch),u=n.days_off.filter(p=>Ee(p.first)<=i&&i<=Ee(p.last)),h=p=>d.filter(w=>cn(w.date)===p),g=p=>{let w=h(p);if(!w.length)return;let A=w.every(b=>b.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,w.map(b=>b.date),A)},_=d.length?`${c.bring} Bring · ${c.buy} Buy${i===Ee(e.today)?" left this month":""}`:"No school days left this month";return f`<section class="chore-col lunch-card ${o?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Te(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${_}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Ct[n.default]} unless picked</span>
          ${e.kids.length<2?T:f`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${o?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=o?null:n.id}
              >
                ${o?Vl:ql}${o?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?f`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:T}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${dn(i)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((p,w)=>f`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!h(w).length}
            aria-label=${`${h(w).every(A=>A.lunch==="bring")?"Buy":"Bring"} every ${p} left in ${dn(i)} for ${n.name}`}
            @click=${()=>g(w)}
          >
            ${p}
          </button>`)}
        ${l.map(p=>this.renderLunchCell(n,p,o))}
      </div>
      ${u.length?f`<p class="lunch-offs">
            No school:
            ${u.map(p=>{let w=p.first<`${i}-01`?`${i}-01`:p.first,A=Ee(p.last)>i?ot(`${rs(i)}-01`,-1):p.last;return`${w===A?Cs(w):`${Cs(w)}–${Cs(A)}`} ${ti(p.title)}`}).join(" · ")}
          </p>`:T}
    </section>`}renderLunchCell(e,n,i=!1){if(n.outside)return f`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return f`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let o=n.lunch,r=o==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,l=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${we(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${we(n.date)}: ${Ct[o]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Ct[r]}.`;return f`<button
      type="button"
      class="lunch-day ${o} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${l?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${o==="bring"?Ui:Hi}${Ct[o]}</span>
      ${n.menu?f`<span class="lunch-menu">${n.menu}</span>${i&&n.sides?f`<span class="lunch-sides">${n.sides}</span>`:T}`:c?f`<span class="lunch-menu add">${vn} Menu</span>`:T}
    </button>`}renderChoreRow(e,n=!1){let i=this.chores,o=this.choreDone(e),r=i.kids.findIndex(A=>A.id===e.kid),a=(this.plan?ge(this.plan).get(e.kid):void 0)??ce(Math.max(0,r)),c=i.kids[r]?.name??"",l=o===st(e)?e:{...e,state:o?"done":"open",done_at:o?new Date().toISOString():null},d=o&&l.done_by&&l.done_by!==e.kid?i.people?.find(A=>A.id===l.done_by)?.name??l.done_by_name??null:null,u=`${Xn(l,i.today,i.time_zone)}${d?` · by ${d}`:""}`,h=o||Wo(e),g=`${n?`${c}: `:""}${e.title}. ${u?`${u}. `:""}${o?"Done. Tap to undo.":"Tap when it’s done."}`,_=f`<span class="box" aria-hidden="true"
        >${o?le`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:T}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:T}
      <span class="chore-text">
        <span class="chore-title">${n?f`<span class="chore-kid">${c}</span> · `:T}${e.title}</span>
        ${u?f`<span class="chore-note">${u}</span>`:T}
      </span>`,p=`chore ${o?"done":""} ${e.state==="overdue"&&!o?"overdue":""} ${h?"":"later"}`,w=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return h?f`<button type="button" class=${p} style=${w} aria-pressed=${o?"true":"false"} aria-label=${g} @click=${()=>this.tapChore(e)}>
          ${_}
        </button>`:f`<div class=${p} style=${w}>${_}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return f`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return f`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Zn(e))return f`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${vn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),i=n.length?f`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:T;this.tick;let o=qo(e,this.plan?ge(this.plan):void 0,this.today().minutes);return f`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${vn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Ni} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${o.length}">
        ${o.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return f`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Te(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?f`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:T}
            ${r.now.length?f`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:T}
            ${r.done.length?f`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:T}
            ${r.later.map(c=>f`<h3 class="chore-group">${c.date===e.today?"Later today":Yl(c.date,e.today)}</h3>
                ${c.chores.map(l=>this.renderChoreRow(l))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?f`<p class="chore-none">No chores this week.</p>`:T}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,o=this.plan?ge(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?f`<span class="tmpl-note bad">${e.problems.map(is).join(" · ")} · tap to set up</span>`:f`<span class="tmpl-note">${os(e.who,i,e.take_turns)} · ${ss(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return f`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?f` <span class="tag-paused">Paused</span>`:T}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let l=i.findIndex(u=>u.id===c),d=o?.get(c)??ce(Math.max(0,l));return f`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return f`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${vn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([i,o])=>{let r=e.templates.filter(a=>a.repeats===i);return r.length?f`<section class="manage-group" aria-label=${o}>
                  <h3 class="chore-group">${o}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:T}):f`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return f``;let i=n.kids,o=this.plan?ge(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(p=>p.id===e.template):void 0,c=ts(e),l=(a?.problems??[]).filter(p=>p!=="who:"),d=(p,w,A,b=!1)=>f`<button type="button" class="choice ${b?"wide":""}" aria-pressed=${p?"true":"false"} ?disabled=${r} @click=${A}>${w}</button>`,u=(p,w,A,b)=>f`<button type="button" class="chip" aria-pressed=${p?"true":"false"} aria-label=${b??T} ?disabled=${r} @click=${A}>${w}</button>`,h=p=>{p!==e.repeats&&this.changeDraft({repeats:p,days:a&&a.repeats===p?a.days??an(p):an(p)})},g=p=>{let w=e.who.includes(p)?e.who.filter(A=>A!==p):i.filter(A=>A.id===p||e.who.includes(A.id)).map(A=>A.id);this.changeDraft({who:w})},_;if(e.repeats==="school"){let p=e.days===Ve?new Set:e.days===""?new Set([0,1,2,3,4]):Qn(e.days)??new Set,w=A=>{let b=new Set(p);b.has(A)?b.delete(A):b.add(A),this.changeDraft({days:b.size===5?"":b.size?es(b):Ve})};_=f`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${qe.slice(0,5).map((A,b)=>u(p.has(b),A.slice(0,2),()=>w(b),A))}
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
        </div>`}else if(e.repeats==="monthly"){let p=e.days.trim(),w=/^\d+$/.test(p)?Number(p):null,A=p&&p.toLowerCase()!=="any"&&p.toLowerCase()!=="last"&&w===null;_=f`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${A?4:3}, minmax(0, 1fr))">
          ${d(p===""||p.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d(w!==null,"On a date",()=>this.changeDraft({days:String(w??1)}))}
          ${d(p.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${A?d(!0,p,()=>{}):T}
        </div>
        ${w!==null?f`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||w<=1} @click=${()=>this.changeDraft({days:String(w-1)})}>−</button>
                <span class="arrive-value">${ns(w)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||w>=31} @click=${()=>this.changeDraft({days:String(w+1)})}>+</button>
              </span>
            </div>`:f`<p class="field-hint">${p.toLowerCase()==="last"?"Due on the month’s last day.":A?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")_=f`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let p=e.days===""||e.days.toLowerCase()==="any",w=e.days===Ve?new Set:p?new Set:Qn(e.days)??new Set,A=b=>{let R=new Set(w);R.has(b)?R.delete(b):R.add(b),this.changeDraft({days:R.size?es(R)||"Mon-Sun":Ve})};_=f`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(p,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!p,"On set days",()=>this.changeDraft({days:p?"Sat":e.days}))}
        </div>
        ${p?f`<p class="field-hint">Shows all week, due on Sunday.</p>`:f`<div role="group" aria-label="Days of the week" class="day-chips">
                ${qe.map((b,R)=>u(w.has(R),b.slice(0,2),()=>A(R),b))}
              </div>
              <div class="chips">
                ${u(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${u(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?os(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===Ve?"No days picked":ss(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${l.length?f`<p class="field-hint bad">${l.map(is).join(". ")}. Saving fixes it.</p>`:T}
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
          @input=${p=>this.changeDraft({title:p.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${zi.map(p=>u(e.icon===p,p,()=>this.changeDraft({icon:e.icon===p?null:p}),`Picture ${p}`))}
          ${e.icon&&!zi.includes(e.icon)?u(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):T}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?f`<emoji-picker
              class="emoji-more"
              .dataSource=${Wl}
              @emoji-click=${p=>{let w=p.detail.unicode;w&&this.changeDraft({icon:w}),this.iconMore=!1}}
            ></emoji-picker>`:T}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((p,w)=>{let A=o?.get(p.id)??ce(w),b=e.who.includes(p.id);return f`<button type="button" class="who-chip" style="--c:${A.color};--rgb:${A.rgb}" aria-pressed=${b?"true":"false"} ?disabled=${r} @click=${()=>g(p.id)}>
              <span class="avatar" aria-hidden="true">${Te(p.name)}</span>${p.name}
            </button>`})}
        </div>
        ${e.who.length>1?f`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
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
      ${_}
      ${e.repeats==="school"?T:f`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Gl(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${r}
          @input=${p=>this.changeDraft({details:p.target.value})}
        ></textarea>
      </div>
      ${e.template?f`<div class="field">
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
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return f``;let i=e.busy,o=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>o({kids:e.kids.includes(d)?e.kids.filter(u=>u!==d):[...e.kids,d]}),a=n.kids.filter(d=>$t(d,e.date)),c=e.dish.trim(),l=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${we(e.date)}</span>
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
          ${a.map(d=>{let u=this.kidColorOf(d.id),h=e.kids.includes(d.id);return f`<button type="button" class="who-chip" style="--c:${u.color};--rgb:${u.rgb}" aria-pressed=${h?"true":"false"} ?disabled=${i} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${Te(d.name)}</span>${d.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?f`<button type="button" class="chip clear remove" ?disabled=${i||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${i||!!l} @click=${()=>void this.saveMenu()}>
          ${i?"Saving to Google Calendar…":l??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return f``;let i=n.people?.length?n.people:n.kids.map(u=>({...u,role:"kid"})),o=n.kids.findIndex(u=>u.id===e.kid),r=n.kids[o],a=this.plan?ge(this.plan):void 0,c=a?.get(e.kid)??ce(Math.max(0,o)),l=i.filter(u=>u.id!==e.kid),d=u=>{let h=n.kids.findIndex(g=>g.id===u.id);return h>=0?(a?.get(u.id)??ce(h)).color:"var(--dark)"};return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Xn(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Te(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?f`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${l.map(u=>f`<button type="button" class="done-by" style="--c:${d(u)}" @click=${()=>void this.toggleChore(e,u.id)}>
                  <span class="avatar ${u.role==="parent"?"driver":""}" aria-hidden="true">${Te(u.name)}</span>
                  <span>${u.name}</span>
                </button>`)}
            </div>`:f`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return f`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let i=on(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${U(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${U(n.start)} to ${U(n.end)}. ${r}, around ${i}’s other trips. Errands go alone.`}let o=n.along.map(r=>Le(e).includes(r)?me(e,r):xe(e,r));return`${i} drives there and back${o.length?`, with ${Wn(o)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return f``;let{day:i,event:o}=n,r=Le(e),a=Io(e,o),c=on(e,o),l=!!this.pending,d=C=>this.pending?.key===C?this.pending.value:void 0,u=[...e.people?.carpools??[]];for(let C of e.days)for(let K of C.events)for(let H of[K.drop,K.pick])H&&H!=="none"&&!r.includes(H)&&!u.some(J=>J.toLowerCase()===H.toLowerCase())&&u.push(H);let h=C=>{if(!o.sides.includes(C))return T;let K=d(C),H=K!==void 0?String(K):C==="drop"?o.drop:o.pick,J=H&&H!=="none"&&!r.includes(H)?H:"",O=q=>this.setRide(o,C,H===q?"":q),V=[...r.map(q=>[q,Kn(e,q)]),["none","Not needed"]];return f`<div class="field">
        <span class="field-label">${C==="drop"?"Drop-off":"Pick-up"} ${H===""?f`<span class="nobody">· nobody yet</span>`:T}</span>
        <div role="group" aria-label=${C==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${V.length}, minmax(0, 1fr))">
          ${V.map(([q,oe])=>f`<button type="button" class="choice" aria-pressed=${H===q?"true":"false"} ?disabled=${l} @click=${()=>O(q)}>
                ${oe}
              </button>`)}
        </div>
        ${u.length?f`<div role="group" aria-label=${C==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${u.map(q=>f`<button type="button" class="chip" aria-pressed=${H.toLowerCase()===q.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>O(q)}>
                    ${q}
                  </button>`)}
            </div>`:T}
        <input
          type="text"
          .value=${J&&!u.some(q=>q.toLowerCase()===J.toLowerCase())?J:""}
          ?disabled=${l}
          aria-label=${C==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${q=>{let oe=q.target.value.trim();oe&&oe!==H&&this.setRide(o,C,oe)}}
          @keydown=${q=>{q.key==="Enter"&&q.target.blur()}}
        />
      </div>`},g=d("stay"),_=g!==void 0?!!g:o.stay,p=o.drop===o.pick&&r.includes(o.drop),w=d("along"),A=w!==void 0?w:o.along,b=o.own?[...Pe(e),...r.filter(C=>C!==o.own)]:Pe(e).filter(C=>C!==o.kid),R=o.own!=null&&o.takes!=null,Z=r.includes(o.drop)&&o.sides.includes("drop")&&!R,z=d("arrive"),re=this.arriveDraft!==void 0?this.arriveDraft:z!==void 0?z:o.arrive_by,v=[],E=C=>C==="none"?"Not needed":Kn(e,C);!o.own&&o.drop!==""&&v.push(`Drop-off: ${E(o.drop)}`),!o.own&&o.pick!==""&&v.push(`Pick-up: ${E(o.pick)}`),!o.own&&o.stay&&v.push("Stay: yes"),R&&v.push(`Takes: ${o.takes} min`),o.along.length&&v.push(`Take along: ${o.along.map(C=>r.includes(C)?me(e,C):xe(e,C)).join(", ")}`),o.arrive_by!=null&&v.push(`Arrive by: ${pt(o.arrive_by)}`);let y=d("attending"),k=y!==void 0?!!y:o.attending!==!1;o.attending===!1&&v.splice(0,v.length,"Attending: no");let $=i.date===this.today().date?"":`${pe(i.date)} · `,L=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${o.title}</span>
          <span class="ed-meta">${$}${R?"any time ":""}${U(o.start)}–${U(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return o.where==="home"?f`${L}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${L}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
      ${o.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${pe(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:T}
      <div class="field">
        <span class="field-label">${c} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${k?"true":"false"} ?disabled=${l} @click=${()=>this.setAttending(o,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${k?"false":"true"} ?disabled=${l} @click=${()=>this.setAttending(o,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${k?f`${o.where==="anywhere"?f`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:T}
            ${o.own?f`<p class="field-hint">${this.ownHint(e,o)}</p>`:f`${h("drop")} ${h("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${_?"true":"false"} ?disabled=${!p||l} @click=${()=>this.toggleStay(o)}>
                      ${p?_?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                  </div>`}
      ${Z&&b.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label=${o.own?"Who goes along":"Kids taken along"} class="chips">
              ${b.map(C=>f`<button type="button" class="chip" aria-pressed=${A.includes(C)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(o,C)}>
                  ${r.includes(C)?me(e,C):xe(e,C)}
                </button>`)}
            </div>
          </div>`:T}
      ${R?T:f`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${re!=null?`${o.start-re} min before it starts`:`Aims for a few minutes before ${U(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${l} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${re!=null?U(re):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${l||re==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${re!=null?f`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:T}`}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${v.length?v.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:T}
      ${k&&!o.own?f`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:T}
    `}};At.styles=oi,At.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",At);function Ql(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function Ki(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=o=>{if(o)for(let r of Ql())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!o},i=o=>{if(clearTimeout(e),o.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",i,{passive:!0}),window.addEventListener("pointerdown",i,{passive:!0}),e=setTimeout(()=>n(!0),s)}var Wi=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],qi=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Vi(s,t,e,n){let i=Math.max(0,Math.min(t,s.length)),o=Math.max(i,Math.min(e,s.length));return{value:s.slice(0,i)+n+s.slice(o),caret:i+n.length}}function Gi(s,t,e){let n=Math.max(0,Math.min(t,s.length)),i=Math.max(n,Math.min(e,s.length));if(n!==i)return{value:s.slice(0,n)+s.slice(i),caret:n};if(n===0)return{value:s,caret:0};let o=Array.from(s.slice(0,n));o.pop();let r=o.join("");return{value:r+s.slice(n),caret:r.length}}function Yi(s,t){return t===0||/\s$/.test(s.slice(0,t))}var ec=new Set(["text","search","email","url","tel","number","password"]);function Ji(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&ec.has(s.type)&&!s.readOnly&&!s.disabled}var tc={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},nc={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},St=class extends be{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,i=e.selectionEnd;if(n!==null&&i!==null)return[n,i]}catch{}return[e.value.length,e.value.length]}apply(e,n,i){e.value=n;try{e.setSelectionRange(i,i)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=Yi(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[i,o]=this.selection(n),r=Gi(n.value,i,o);this.apply(n,r.value,r.caret);break}default:{let i=e==="space"?" ":this.shift?e.toUpperCase():e,[o,r]=this.selection(n),a=Vi(n.value,o,r,i);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,i=e==="layout"?this.layout==="letters"?"123":"ABC":tc[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${nc[e]??i}
      aria-pressed=${e==="shift"?String(this.shift):T}
      @click=${()=>this.press(e)}
    >
      ${i}
    </button>`}render(){let e=this.layout==="letters"?Wi:qi;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>f`<div class="row">${n.map(i=>this.key(i))}</div>`)}
      </div>`}};St.styles=Ne`
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
  `,St.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",St);function sc(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function Xi(s){let t=new WeakSet,e=r=>{let a=r.composedPath();o(a);let c=a[0];Ji(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=sc();!s.target||r===s.target||(Ji(r)?s.attach(r):s.detach())},0)},i=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},o=r=>{for(let a of r)a instanceof ShadowRoot&&i(a)};i(document),document.addEventListener("pointerdown",r=>o(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var As="mydashlight",oc=`/api/${As}/pair`,ic=`/api/${As}/pair/poll`,Ss=`/${As}`,Ms="pair";function Zi(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Qi(s,t){return`${s}${Ss}?${Ms}=${encodeURIComponent(t)}`}function rc(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var Ze=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function er(s=fetch){let t=await s(oc,{method:"POST",cache:"no-store"});if(t.status===429)throw new Ze("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new Ze(`Home Assistant answered ${t.status}.`);return await t.json()}async function tr(s,t,e=fetch){let n=await e(ic,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new Ze(`Home Assistant answered ${n.status}.`);let i=await n.json();return i.status==="paired"&&i.auth?{status:"paired",auth:rc(t,i.auth)}:{status:"pending"}}var dt=function(s,t){let i=s,o=Mt[t],r=null,a=0,c=null,l=[],d={},u=function(v,E){a=i*4+17,r=(function(y){let k=new Array(y);for(let $=0;$<y;$+=1){k[$]=new Array(y);for(let L=0;L<y;L+=1)k[$][L]=null}return k})(a),h(0,0),h(a-7,0),h(0,a-7),p(),_(),A(v,E),i>=7&&w(v),c==null&&(c=Z(i,o,l)),b(c,E)},h=function(v,E){for(let y=-1;y<=7;y+=1)if(!(v+y<=-1||a<=v+y))for(let k=-1;k<=7;k+=1)E+k<=-1||a<=E+k||(0<=y&&y<=6&&(k==0||k==6)||0<=k&&k<=6&&(y==0||y==6)||2<=y&&y<=4&&2<=k&&k<=4?r[v+y][E+k]=!0:r[v+y][E+k]=!1)},g=function(){let v=0,E=0;for(let y=0;y<8;y+=1){u(!0,y);let k=Be.getLostPoint(d);(y==0||v>k)&&(v=k,E=y)}return E},_=function(){for(let v=8;v<a-8;v+=1)r[v][6]==null&&(r[v][6]=v%2==0);for(let v=8;v<a-8;v+=1)r[6][v]==null&&(r[6][v]=v%2==0)},p=function(){let v=Be.getPatternPosition(i);for(let E=0;E<v.length;E+=1)for(let y=0;y<v.length;y+=1){let k=v[E],$=v[y];if(r[k][$]==null)for(let L=-2;L<=2;L+=1)for(let C=-2;C<=2;C+=1)L==-2||L==2||C==-2||C==2||L==0&&C==0?r[k+L][$+C]=!0:r[k+L][$+C]=!1}},w=function(v){let E=Be.getBCHTypeNumber(i);for(let y=0;y<18;y+=1){let k=!v&&(E>>y&1)==1;r[Math.floor(y/3)][y%3+a-8-3]=k}for(let y=0;y<18;y+=1){let k=!v&&(E>>y&1)==1;r[y%3+a-8-3][Math.floor(y/3)]=k}},A=function(v,E){let y=o<<3|E,k=Be.getBCHTypeInfo(y);for(let $=0;$<15;$+=1){let L=!v&&(k>>$&1)==1;$<6?r[$][8]=L:$<8?r[$+1][8]=L:r[a-15+$][8]=L}for(let $=0;$<15;$+=1){let L=!v&&(k>>$&1)==1;$<8?r[8][a-$-1]=L:$<9?r[8][15-$-1+1]=L:r[8][15-$-1]=L}r[a-8][8]=!v},b=function(v,E){let y=-1,k=a-1,$=7,L=0,C=Be.getMaskFunction(E);for(let K=a-1;K>0;K-=2)for(K==6&&(K-=1);;){for(let H=0;H<2;H+=1)if(r[k][K-H]==null){let J=!1;L<v.length&&(J=(v[L]>>>$&1)==1),C(k,K-H)&&(J=!J),r[k][K-H]=J,$-=1,$==-1&&(L+=1,$=7)}if(k+=y,k<0||a<=k){k-=y,y=-y;break}}},R=function(v,E){let y=0,k=0,$=0,L=new Array(E.length),C=new Array(E.length);for(let O=0;O<E.length;O+=1){let V=E[O].dataCount,q=E[O].totalCount-V;k=Math.max(k,V),$=Math.max($,q),L[O]=new Array(V);for(let m=0;m<L[O].length;m+=1)L[O][m]=255&v.getBuffer()[m+y];y+=V;let oe=Be.getErrorCorrectPolynomial(q),ve=Pt(L[O],oe.getLength()-1).mod(oe);C[O]=new Array(oe.getLength()-1);for(let m=0;m<C[O].length;m+=1){let I=m+ve.getLength()-C[O].length;C[O][m]=I>=0?ve.getAt(I):0}}let K=0;for(let O=0;O<E.length;O+=1)K+=E[O].totalCount;let H=new Array(K),J=0;for(let O=0;O<k;O+=1)for(let V=0;V<E.length;V+=1)O<L[V].length&&(H[J]=L[V][O],J+=1);for(let O=0;O<$;O+=1)for(let V=0;V<E.length;V+=1)O<C[V].length&&(H[J]=C[V][O],J+=1);return H},Z=function(v,E,y){let k=nr.getRSBlocks(v,E),$=sr();for(let C=0;C<y.length;C+=1){let K=y[C];$.put(K.getMode(),4),$.put(K.getLength(),Be.getLengthInBits(K.getMode(),v)),K.write($)}let L=0;for(let C=0;C<k.length;C+=1)L+=k[C].dataCount;if($.getLengthInBits()>L*8)throw"code length overflow. ("+$.getLengthInBits()+">"+L*8+")";for($.getLengthInBits()+4<=L*8&&$.put(0,4);$.getLengthInBits()%8!=0;)$.putBit(!1);for(;!($.getLengthInBits()>=L*8||($.put(236,8),$.getLengthInBits()>=L*8));)$.put(17,8);return R($,k)};d.addData=function(v,E){E=E||"Byte";let y=null;switch(E){case"Numeric":y=ac(v);break;case"Alphanumeric":y=lc(v);break;case"Byte":y=cc(v);break;case"Kanji":y=dc(v);break;default:throw"mode:"+E}l.push(y),c=null},d.isDark=function(v,E){if(v<0||a<=v||E<0||a<=E)throw v+","+E;return r[v][E]},d.getModuleCount=function(){return a},d.make=function(){if(i<1){let v=1;for(;v<40;v++){let E=nr.getRSBlocks(v,o),y=sr();for(let $=0;$<l.length;$++){let L=l[$];y.put(L.getMode(),4),y.put(L.getLength(),Be.getLengthInBits(L.getMode(),v)),L.write(y)}let k=0;for(let $=0;$<E.length;$++)k+=E[$].dataCount;if(y.getLengthInBits()<=k*8)break}i=v}u(!1,g())},d.createTableTag=function(v,E){v=v||2,E=typeof E>"u"?v*4:E;let y="";y+='<table style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: "+E+"px;",y+='">',y+="<tbody>";for(let k=0;k<d.getModuleCount();k+=1){y+="<tr>";for(let $=0;$<d.getModuleCount();$+=1)y+='<td style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: 0px;",y+=" width: "+v+"px;",y+=" height: "+v+"px;",y+=" background-color: ",y+=d.isDark(k,$)?"#000000":"#ffffff",y+=";",y+='"/>';y+="</tr>"}return y+="</tbody>",y+="</table>",y},d.createSvgTag=function(v,E,y,k){let $={};typeof arguments[0]=="object"&&($=arguments[0],v=$.cellSize,E=$.margin,y=$.alt,k=$.title),v=v||2,E=typeof E>"u"?v*4:E,y=typeof y=="string"?{text:y}:y||{},y.text=y.text||null,y.id=y.text?y.id||"qrcode-description":null,k=typeof k=="string"?{text:k}:k||{},k.text=k.text||null,k.id=k.text?k.id||"qrcode-title":null;let L=d.getModuleCount()*v+E*2,C,K,H,J,O="",V;for(V="l"+v+",0 0,"+v+" -"+v+",0 0,-"+v+"z ",O+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',O+=$.scalable?"":' width="'+L+'px" height="'+L+'px"',O+=' viewBox="0 0 '+L+" "+L+'" ',O+=' preserveAspectRatio="xMinYMin meet"',O+=k.text||y.text?' role="img" aria-labelledby="'+z([k.id,y.id].join(" ").trim())+'"':"",O+=">",O+=k.text?'<title id="'+z(k.id)+'">'+z(k.text)+"</title>":"",O+=y.text?'<description id="'+z(y.id)+'">'+z(y.text)+"</description>":"",O+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',O+='<path d="',H=0;H<d.getModuleCount();H+=1)for(J=H*v+E,C=0;C<d.getModuleCount();C+=1)d.isDark(H,C)&&(K=C*v+E,O+="M"+K+","+J+V);return O+='" stroke="transparent" fill="black"/>',O+="</svg>",O},d.createDataURL=function(v,E){v=v||2,E=typeof E>"u"?v*4:E;let y=d.getModuleCount()*v+E*2,k=E,$=y-E;return fc(y,y,function(L,C){if(k<=L&&L<$&&k<=C&&C<$){let K=Math.floor((L-k)/v),H=Math.floor((C-k)/v);return d.isDark(H,K)?0:1}else return 1})},d.createImgTag=function(v,E,y){v=v||2,E=typeof E>"u"?v*4:E;let k=d.getModuleCount()*v+E*2,$="";return $+="<img",$+=' src="',$+=d.createDataURL(v,E),$+='"',$+=' width="',$+=k,$+='"',$+=' height="',$+=k,$+='"',y&&($+=' alt="',$+=z(y),$+='"'),$+="/>",$};let z=function(v){let E="";for(let y=0;y<v.length;y+=1){let k=v.charAt(y);switch(k){case"<":E+="&lt;";break;case">":E+="&gt;";break;case"&":E+="&amp;";break;case'"':E+="&quot;";break;default:E+=k;break}}return E},re=function(v){v=typeof v>"u"?2:v;let y=d.getModuleCount()*1+v*2,k=v,$=y-v,L,C,K,H,J,O={"██":"█","█ ":"▀"," █":"▄","  ":" "},V={"██":"▀","█ ":"▀"," █":" ","  ":" "},q="";for(L=0;L<y;L+=2){for(K=Math.floor((L-k)/1),H=Math.floor((L+1-k)/1),C=0;C<y;C+=1)J="█",k<=C&&C<$&&k<=L&&L<$&&d.isDark(K,Math.floor((C-k)/1))&&(J=" "),k<=C&&C<$&&k<=L+1&&L+1<$&&d.isDark(H,Math.floor((C-k)/1))?J+=" ":J+="█",q+=v<1&&L+1>=$?V[J]:O[J];q+=`
`}return y%2&&v>0?q.substring(0,q.length-y-1)+Array(y+1).join("▀"):q.substring(0,q.length-1)};return d.createASCII=function(v,E){if(v=v||1,v<2)return re(E);v-=1,E=typeof E>"u"?v*2:E;let y=d.getModuleCount()*v+E*2,k=E,$=y-E,L,C,K,H,J=Array(v+1).join("██"),O=Array(v+1).join("  "),V="",q="";for(L=0;L<y;L+=1){for(K=Math.floor((L-k)/v),q="",C=0;C<y;C+=1)H=1,k<=C&&C<$&&k<=L&&L<$&&d.isDark(K,Math.floor((C-k)/v))&&(H=0),q+=H?J:O;for(K=0;K<v;K+=1)V+=q+`
`}return V.substring(0,V.length-1)},d.renderTo2dContext=function(v,E){E=E||2;let y=d.getModuleCount();for(let k=0;k<y;k++)for(let $=0;$<y;$++)v.fillStyle=d.isDark(k,$)?"black":"white",v.fillRect($*E,k*E,E,E)},d};dt.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};dt.createStringToBytes=function(s,t){let e=(function(){let i=hc(s),o=function(){let c=i.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=i.read();if(c==-1)break;let l=o(),d=o(),u=o(),h=String.fromCharCode(c<<8|l),g=d<<8|u;a[h]=g,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(i){let o=[];for(let r=0;r<i.length;r+=1){let a=i.charCodeAt(r);if(a<128)o.push(a);else{let c=e[i.charAt(r)];typeof c=="number"?(c&255)==c?o.push(c):(o.push(c>>>8),o.push(c&255)):o.push(n)}}return o}};var he={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Mt={L:1,M:0,Q:3,H:2},Ie={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Be=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,i={},o=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return i.getBCHTypeInfo=function(r){let a=r<<10;for(;o(a)-o(t)>=0;)a^=t<<o(a)-o(t);return(r<<10|a)^n},i.getBCHTypeNumber=function(r){let a=r<<12;for(;o(a)-o(e)>=0;)a^=e<<o(a)-o(e);return r<<12|a},i.getPatternPosition=function(r){return s[r-1]},i.getMaskFunction=function(r){switch(r){case Ie.PATTERN000:return function(a,c){return(a+c)%2==0};case Ie.PATTERN001:return function(a,c){return a%2==0};case Ie.PATTERN010:return function(a,c){return c%3==0};case Ie.PATTERN011:return function(a,c){return(a+c)%3==0};case Ie.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Ie.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Ie.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Ie.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},i.getErrorCorrectPolynomial=function(r){let a=Pt([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Pt([1,Oe.gexp(c)],0));return a},i.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case he.MODE_NUMBER:return 10;case he.MODE_ALPHA_NUM:return 9;case he.MODE_8BIT_BYTE:return 8;case he.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case he.MODE_NUMBER:return 12;case he.MODE_ALPHA_NUM:return 11;case he.MODE_8BIT_BYTE:return 16;case he.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case he.MODE_NUMBER:return 14;case he.MODE_ALPHA_NUM:return 13;case he.MODE_8BIT_BYTE:return 16;case he.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},i.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1){let g=0,_=r.isDark(u,h);for(let p=-1;p<=1;p+=1)if(!(u+p<0||a<=u+p))for(let w=-1;w<=1;w+=1)h+w<0||a<=h+w||p==0&&w==0||_==r.isDark(u+p,h+w)&&(g+=1);g>5&&(c+=3+g-5)}for(let u=0;u<a-1;u+=1)for(let h=0;h<a-1;h+=1){let g=0;r.isDark(u,h)&&(g+=1),r.isDark(u+1,h)&&(g+=1),r.isDark(u,h+1)&&(g+=1),r.isDark(u+1,h+1)&&(g+=1),(g==0||g==4)&&(c+=3)}for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(u,h)&&!r.isDark(u,h+1)&&r.isDark(u,h+2)&&r.isDark(u,h+3)&&r.isDark(u,h+4)&&!r.isDark(u,h+5)&&r.isDark(u,h+6)&&(c+=40);for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(h,u)&&!r.isDark(h+1,u)&&r.isDark(h+2,u)&&r.isDark(h+3,u)&&r.isDark(h+4,u)&&!r.isDark(h+5,u)&&r.isDark(h+6,u)&&(c+=40);let l=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1)r.isDark(h,u)&&(l+=1);let d=Math.abs(100*l/a/a-50)/5;return c+=d*10,c},i})(),Oe=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),Pt=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let i=0;for(;i<s.length&&s[i]==0;)i+=1;let o=new Array(s.length-i+t);for(let r=0;r<s.length-i;r+=1)o[r]=s[r+i];return o})(),n={};return n.getAt=function(i){return e[i]},n.getLength=function(){return e.length},n.multiply=function(i){let o=new Array(n.getLength()+i.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<i.getLength();a+=1)o[r+a]^=Oe.gexp(Oe.glog(n.getAt(r))+Oe.glog(i.getAt(a)));return Pt(o,0)},n.mod=function(i){if(n.getLength()-i.getLength()<0)return n;let o=Oe.glog(n.getAt(0))-Oe.glog(i.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<i.getLength();a+=1)r[a]^=Oe.gexp(Oe.glog(i.getAt(a))+o);return Pt(r,0).mod(i)},n},nr=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(i,o){let r={};return r.totalCount=i,r.dataCount=o,r},e={},n=function(i,o){switch(o){case Mt.L:return s[(i-1)*4+0];case Mt.M:return s[(i-1)*4+1];case Mt.Q:return s[(i-1)*4+2];case Mt.H:return s[(i-1)*4+3];default:return}};return e.getRSBlocks=function(i,o){let r=n(i,o);if(typeof r>"u")throw"bad rs block @ typeNumber:"+i+"/errorCorrectionLevel:"+o;let a=r.length/3,c=[];for(let l=0;l<a;l+=1){let d=r[l*3+0],u=r[l*3+1],h=r[l*3+2];for(let g=0;g<d;g+=1)c.push(t(u,h))}return c},e})(),sr=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let i=Math.floor(n/8);return(s[i]>>>7-n%8&1)==1},e.put=function(n,i){for(let o=0;o<i;o+=1)e.putBit((n>>>i-o-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let i=Math.floor(t/8);s.length<=i&&s.push(0),n&&(s[i]|=128>>>t%8),t+=1},e},ac=function(s){let t=he.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(i(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(i(a.substring(c,c+1)),4):a.length-c==2&&r.put(i(a.substring(c,c+2)),7))};let i=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+o(r.charAt(c));return a},o=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},lc=function(s){let t=he.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(o){return e.length},n.write=function(o){let r=e,a=0;for(;a+1<r.length;)o.put(i(r.charAt(a))*45+i(r.charAt(a+1)),11),a+=2;a<r.length&&o.put(i(r.charAt(a)),6)};let i=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;if("A"<=o&&o<="Z")return o.charCodeAt(0)-65+10;switch(o){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+o}};return n},cc=function(s){let t=he.MODE_8BIT_BYTE,e=s,n=dt.stringToBytes(s),i={};return i.getMode=function(){return t},i.getLength=function(o){return n.length},i.write=function(o){for(let r=0;r<n.length;r+=1)o.put(n[r],8)},i},dc=function(s){let t=he.MODE_KANJI,e=s,n=dt.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let i=n(s),o={};return o.getMode=function(){return t},o.getLength=function(r){return~~(i.length/2)},o.write=function(r){let a=i,c=0;for(;c+1<a.length;){let l=(255&a[c])<<8|255&a[c+1];if(33088<=l&&l<=40956)l-=33088;else if(57408<=l&&l<=60351)l-=49472;else throw"illegal char at "+(c+1)+"/"+l;l=(l>>>8&255)*192+(l&255),r.put(l,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},o},or=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,i){n=n||0,i=i||e.length;for(let o=0;o<i;o+=1)t.writeByte(e[o+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},uc=function(){let s=0,t=0,e=0,n="",i={},o=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return i.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)o(s>>>t-6),t-=6},i.flush=function(){if(t>0&&(o(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},i.toString=function(){return n},i},hc=function(s){let t=s,e=0,n=0,i=0,o={};o.read=function(){for(;i<8;){if(e>=t.length){if(i==0)return-1;throw"unexpected end of file./"+i}let c=t.charAt(e);if(e+=1,c=="=")return i=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),i+=6}let a=n>>>i-8&255;return i-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return o},pc=function(s,t){let e=s,n=t,i=new Array(s*t),o={};o.setPixel=function(l,d,u){i[d*e+l]=u},o.write=function(l){l.writeString("GIF87a"),l.writeShort(e),l.writeShort(n),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(e),l.writeShort(n),l.writeByte(0);let d=2,u=a(d);l.writeByte(d);let h=0;for(;u.length-h>255;)l.writeByte(255),l.writeBytes(u,h,255),h+=255;l.writeByte(u.length-h),l.writeBytes(u,h,u.length-h),l.writeByte(0),l.writeString(";")};let r=function(l){let d=l,u=0,h=0,g={};return g.write=function(_,p){if(_>>>p)throw"length over";for(;u+p>=8;)d.writeByte(255&(_<<u|h)),p-=8-u,_>>>=8-u,h=0,u=0;h=_<<u|h,u=u+p},g.flush=function(){u>0&&d.writeByte(h)},g},a=function(l){let d=1<<l,u=(1<<l)+1,h=l+1,g=c();for(let b=0;b<d;b+=1)g.add(String.fromCharCode(b));g.add(String.fromCharCode(d)),g.add(String.fromCharCode(u));let _=or(),p=r(_);p.write(d,h);let w=0,A=String.fromCharCode(i[w]);for(w+=1;w<i.length;){let b=String.fromCharCode(i[w]);w+=1,g.contains(A+b)?A=A+b:(p.write(g.indexOf(A),h),g.size()<4095&&(g.size()==1<<h&&(h+=1),g.add(A+b)),A=b)}return p.write(g.indexOf(A),h),p.write(u,h),p.flush(),_.toByteArray()},c=function(){let l={},d=0,u={};return u.add=function(h){if(u.contains(h))throw"dup key:"+h;l[h]=d,d+=1},u.size=function(){return d},u.indexOf=function(h){return l[h]},u.contains=function(h){return typeof l[h]<"u"},u};return o},fc=function(s,t,e){let n=pc(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let i=or();n.write(i);let o=uc(),r=i.toByteArray();for(let a=0;a<r.length;a+=1)o.writeByte(r[a]);return o.flush(),"data:image/gif;base64,"+o},ir=dt,Zd=dt.stringToBytes;function rr(s){let t=ir(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let i=0;i<e;i++)for(let o=0;o<e;o++)t.isDark(i,o)&&(n+=`M${o} ${i}h1v1h-1z`);return{size:e,d:n}}var gc=1e4,Lt=class extends be{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await er();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof Ze&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),gc)}}async poll(e){let n=this.secret;if(n)try{let i=await tr(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,i.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:i.auth}));return}if(i.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return T;let{size:e,d:n}=rr(Qi(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${le`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?Zi(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Ss}?${Ms}</span> and type the code.
          </li>
          <li>You’ll need to be a Home Assistant admin. The screen signs in as you.</li>
        </ol>
      </div>
      <div class="qr">${this.qr()}</div>
      <div class="foot">
        ${this.problem?f`<span class="problem" role="alert">${this.problem}</span>`:f`<span>${this.code?`A new code appears in ${e} minute${e===1?"":"s"}.`:"Getting a code…"}</span>`}
        <button type="button" class="link" @click=${()=>this.dispatchEvent(new CustomEvent("password"))}>
          Sign in with a password instead
        </button>
      </div>
    </div>`}};Lt.styles=Ne`
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
  `,Lt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Lt);var Ps="hassTokens";function ar(){try{let s=localStorage.getItem(Ps);return s?JSON.parse(s):null}catch{return null}}function Ls(s){try{s?localStorage.setItem(Ps,JSON.stringify(s)):localStorage.removeItem(Ps)}catch{}}function mc(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function bc(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function xc(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!ar()){let e=await bc();e&&Ls(e)}try{let e=await Zs({hassUrl:location.origin,loadTokens:async()=>ar(),saveTokens:Ls});t&&history.replaceState(null,"",location.pathname+as(location.search));let n=await Qs({auth:e});s.backend=new Nt(n),n.addEventListener("reconnect-error",(i,o)=>{o===2&&lr()})}catch(e){if(e===2){lr();return}mc(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function lr(){Ls(null),location.replace(location.pathname+as(location.search))}var dr=Et(location.search),cr=document.querySelector("mydashlight-keyboard");cr&&dr.keyboard!==!1&&Xi(cr);dr.cursor!=="show"&&Ki();xc();
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
