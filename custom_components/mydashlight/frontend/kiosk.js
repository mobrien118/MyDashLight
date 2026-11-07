var ur=Object.defineProperty;var $n=(s,t)=>()=>(s&&(t=s(s=0)),t);var hr=(s,t)=>{for(var e in t)ur(s,e,{get:t[e],enumerable:!0})};function un(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function ls(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function ba(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function oo(s){return ba(s,t=>t.unicode)}function xa(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))i.createIndex(r,a,{multiEntry:c});return i}t(at),t(Je,ua,{[ao]:[da,!0],[co]:[[ha,pa]],[uo]:[fa,!0]}),t(hs,void 0,{[lo]:[""]})}function ho(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function va(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,la);ds[s]=o,o.onupgradeneeded=i=>{i.oldVersion<ca&&xa(o.result)},ho(e,n,o)});return t.onclose=()=>fs(s),t}function ya(s){return pn[s]||(pn[s]=va(s)),pn[s]}function Re(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(l=>r.objectStore(l)),c;n(a,r,l=>{c=l}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function fs(s){let t=ds[s],e=t&&t.result;if(e){e.close();let n=gn[s];if(n)for(let o of n)o()}delete ds[s],delete pn[s],delete gn[s]}function wa(s){return new Promise((t,e)=>{fs(s);let n=indexedDB.deleteDatabase(s);ho(t,e,n)})}function ka(s,t){let e=gn[s];e||(e=gn[s]=[]),e.push(t)}function rt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||$a.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function po(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Ea)}function _a(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:a,tags:c,emoji:l,version:d})=>{let u=[...new Set(po([...(r||[]).map(rt).flat(),...(c||[]).map(rt).flat(),...rt(e),n]))].sort(),h={annotation:e,group:o,order:i,tags:c,tokens:u,unicode:l,version:d};if(n&&(h.emoticon=n),r&&(h.shortcodes=r),a){h.skinTones=[],h.skinUnicodes=[],h.skinVersions=[];for(let{tone:g,emoji:T,version:p}of a)h.skinTones.push(g),h.skinUnicodes.push(T),h.skinVersions.push(p)}return h})}function fo(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function Ye(s,t,e){fo(s,"get",t,e)}function go(s,t,e){fo(s,"getAll",t,e)}function gs(s){s.commit&&s.commit()}function Ta(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function mo(s,t){let e=Ta(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Ca(s){return!await ms(s,at,fn)}async function Aa(s,t,e){let[n,o]=await Promise.all([cs,fn].map(i=>ms(s,at,i)));return n===e&&o===t}async function Sa(s,t){return Re(s,Je,ct,(n,o,i)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let l=c.target.result;for(let d of l)if(r=d.unicode,t(d))return i(d);if(l.length<50)return i();a()}};a()})}async function bo(s,t,e,n){try{let o=_a(t);await Re(s,[Je,at],ps,([i,r],a)=>{let c,l,d=0;function u(){++d===2&&h()}function h(){if(!(c===n&&l===e)){i.clear();for(let g of o)i.put(g);r.put(n,cs),r.put(e,fn),gs(a)}}Ye(r,cs,g=>{c=g,u()}),Ye(r,fn,g=>{l=g,u()})})}finally{}}async function Ma(s,t){return Re(s,Je,ct,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);go(e.index(co),i,o)})}async function xo(s,t){let e=po(rt(t));return e.length?Re(s,Je,ct,(n,o,i)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let l=mo(r,d=>d.unicode);i(l.sort((d,u)=>d.order<u.order?-1:1))};for(let l=0;l<e.length;l++){let d=e[l],u=l===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);go(n.index(ao),u,h=>{r.push(h),a()})}}):[]}async function Pa(s,t){let e=await xo(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Sa(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Da(s,t){return Re(s,Je,ct,(e,n,o)=>Ye(e,t,i=>{if(i)return o(i);Ye(e.index(uo),t,r=>o(r||null))}))}function ms(s,t,e){return Re(s,t,ct,(n,o,i)=>Ye(n,e,i))}function La(s,t,e,n){return Re(s,t,ps,(o,i)=>{o.put(n,e),gs(i)})}function Ra(s,t){return Re(s,hs,ps,(e,n)=>Ye(e,t,o=>{e.put((o||0)+1,t),gs(n)}))}function Ia(s,t,e){return e===0?[]:Re(s,[hs,Je],ct,([n,o],i,r)=>{let a=[];n.index(lo).openCursor(void 0,"prev").onsuccess=c=>{let l=c.target.result;if(!l)return r(a);function d(g){if(a.push(g),a.length===e)return r(a);l.continue()}let u=l.primaryKey,h=t.byName(u);if(h)return d(h);Ye(o,u,g=>{if(g)return d(g);l.continue()})}})}function Ba(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let a=e;for(let l=0;l<r.length;l++){let d=r.charAt(l),u=a.get(d);u||(u=new Map,a.set(d,u)),a=u}let c=a.get(hn);c||(c=[],a.set(hn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let l=0;l<o.length;l++){let d=o.charAt(l),u=r.get(d);if(u)r=u;else return[]}if(i)return r.get(hn)||[];let a=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((u,h)=>u[0]<h[0]?-1:1);for(let[u,h]of d)u===hn?a.push(...h):c.push(h)}return a}}function Oa(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||ja.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function ro(s){Oa(s);let t=(h,g)=>h.name.toLowerCase()<g.name.toLowerCase()?-1:1,e=s.sort(t),o=Ba(s,h=>{let g=new Set;if(h.shortcodes)for(let T of h.shortcodes)for(let p of rt(T))g.add(p);return g}),i=h=>o(h,!0),r=h=>o(h,!1),a=h=>{let g=rt(h),T=g.map((p,w)=>(w<g.length-1?i:r)(p));return mo(T,p=>p.name).sort(t)},c=new Map,l=new Map;for(let h of s){l.set(h.name.toLowerCase(),h);for(let g of h.shortcodes||[])c.set(g.toLowerCase(),h)}return{all:e,search:a,byShortcode:h=>c.get(h.toLowerCase()),byName:h=>l.get(h.toLowerCase())}}function _t(s){if(!s)return s;if(Na&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function vo(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Ua(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||za.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function yo(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function Ha(s){let t=await fetch(s,{method:"HEAD"});yo(t,s);let e=t.headers.get("etag");return vo(e),e}async function us(s){let t=await fetch(s);yo(t,s);let e=t.headers.get("etag");vo(e);let n=await t.json();return Ua(n),[e,n]}function Fa(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Ka(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function wo(s){let t=JSON.stringify(s),e=Ka(t),n=await crypto.subtle.digest("SHA-1",e),o=Fa(n);return btoa(o)}async function Wa(s,t){let e,n=await Ha(t);if(!n){let o=await us(t);n=o[0],e=o[1],n||(n=await wo(e))}await Aa(s,t,n)||(e||(e=(await us(t))[1]),await bo(s,e,t,n))}async function qa(s,t){let[e,n]=await us(t);e||(e=await wo(n)),await bo(s,n,t,e)}async function Va(s,t){try{await Wa(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var la,ca,Je,at,hs,da,ao,ua,lo,ha,pa,co,cs,fn,io,ct,ps,uo,fa,ga,ma,ds,pn,gn,$a,Ea,hn,ja,Na,za,lt,bs=$n(()=>{la=1,ca=1,Je="emoji",at="keyvalue",hs="favorites",da="tokens",ao="tokens",ua="unicode",lo="count",ha="group",pa="order",co="group-order",cs="eTag",fn="url",io="skinTone",ct="readonly",ps="readwrite",uo="skinUnicodes",fa="skinUnicodes",ga="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",ma="en";ds={},pn={},gn={};$a=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Ea=2;hn="";ja=["name","url"];Na=typeof wrappedJSObject<"u";za=["annotation","emoji","group","order","version"];lt=class{constructor({dataSource:t=ga,locale:e=ma,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=ro(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await ya(this._dbName);ka(this._dbName,this._clear);let e=this.dataSource;await Ca(t)?await qa(t,e):this._lazyUpdate=Va(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return ls(t),await this.ready(),oo(await Ma(this._db,t)).map(_t)}async getEmojiBySearchQuery(t){un(t),await this.ready();let e=this._custom.search(t),n=oo(await xo(this._db,t)).map(_t);return[...e,...n]}async getEmojiByShortcode(t){un(t),await this.ready();let e=this._custom.byShortcode(t);return e||_t(await Pa(this._db,t))}async getEmojiByUnicodeOrName(t){un(t),await this.ready();let e=this._custom.byName(t);return e||_t(await Da(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await ms(this._db,at,io)||0}async setPreferredSkinTone(t){return ls(t),await this.ready(),La(this._db,at,io,t)}async incrementFavoriteEmojiCount(t){return un(t),await this.ready(),Ra(this._db,t)}async getTopFavoriteEmoji(t){return ls(t),await this.ready(),(await Ia(this._db,this._custom,t)).map(_t)}set customEmoji(t){this._custom=ro(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await fs(this._dbName)}async delete(){await this._shutdown(),await wa(this._dbName)}}});function $o(s){return s.unicode.includes("‍")}function nl(s){let t=Eo(s,"#000"),e=Eo(s,"#fff");return t&&e&&tl(t,e)}function sl(){let s=Object.entries(Ya);try{for(let[t,e]of s)if(nl(t))return e}catch{}finally{}return s[0][1]}function cl(s,t){if(t===0)return s;let e=s.indexOf(rl);return e!==-1?s.substring(0,e)+String.fromCodePoint(al+t-1)+s.substring(e):(s.endsWith(il)&&(s=s.substring(0,s.length-1)),s+ol+String.fromCodePoint(ll+t-1))}function Te(s){s.preventDefault(),s.stopPropagation()}function ws(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Lo(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function dl(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:a,category:c,annotation:l})=>({unicode:n,name:a,shortcodes:i,url:r,category:c,annotation:l,id:n||a,skins:o&&e(o)}))}function hl(s,t,e){let n;ul?(n=new ResizeObserver(e),n.observe(s)):bn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function _o(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function To(s,t,e){let n=_o(t);if(!n){if(!Xe){Xe=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])Xe.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(Xe),Xe.firstChild.nodeValue=s,_o(Xe)}finally{Xe.remove()}}return n}function fl(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof ks>"u"&&(ks=To(pl,t,t));let a=To(o.unicode,i,t)/1.8<ks;Ts.set(o.unicode,a),a||(n=!1)}return n}function gl(s){return Lo(s,t=>t)}function ml(s){s&&(s.scrollTop=0)}function Tt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Co(s){return""+s}function bl(s){let t=document.createElement("template");return t.innerHTML=s,t}function kl(s,t){wl?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function $l(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function El(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=$l(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&kl(n,s)}function _l(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,l=s[i];if(o!==l)if(e.currentExpression=l,r)if(l===null)n.removeAttribute(r);else{let d=a+Co(l)+c;n.setAttribute(r,d)}else{let d;Array.isArray(l)?El(l,e):l instanceof Element?(d=l,n.replaceWith(d)):n.nodeValue=Co(l),d&&(e.targetNode=d)}}}function Tl(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],a=0;for(let l=0,d=s.length;l<d;l++){let u=s[l];if(t+=u.slice(a),l===d-1)break;for(let x=0;x<u.length;x++)switch(u.charAt(x)){case"<":{u.charAt(x+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let h=r[r.length-1],g=Tt(i,h,()=>[]),T,p,w;if(n){let x=/(\S+)="?([^"=]*)$/.exec(u);T=x[1],p=x[2];let B=/^([^">]*)("?)/.exec(s[l+1]);w=B[1],t=t.slice(0,-1*x[0].length),a=B[0].length}else a=0;let A={attributeName:T,attributeValuePre:p,attributeValuePost:w,expressionIndex:l};g.push(A),!e&&!n&&(t+=" ")}return{template:bl(t),elementsToBindings:i}}function Ao(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Cl(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Ao(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=t.get(++r);a&&Ao(a,i,e)}while(i=o.nextNode())}return e}function Al(s){let{template:t,elementsToBindings:e}=Tt(xl,s,()=>Tl(s)),n=t.cloneNode(!0).content.firstElementChild,o=Cl(n,e);return function(r){return _l(r,o),n}}function Sl(s){let t=Tt(vl,s,()=>new Map),e=yl;function n(i,...r){let a=Tt(t,i,()=>new Map);return Tt(a,e,()=>Al(i))(r)}function o(i,r,a){return i.map((c,l)=>{let d=e;e=a(c);try{return r(c,l)}finally{e=d}})}return{map:o,html:n}}function Ml(s,t,e,n,o,i,r,a,c){let{labelWithSkin:l,titleForEmoji:d,unicodeWithSkin:u}=e,{html:h,map:g}=Sl(t);function T(x,B,Y){return g(x,(F,ce)=>h`<button role="${B?"option":"menuitem"}" aria-selected="${B?ce===t.activeSearchItem:null}" aria-label="${l(F,t.currentSkinTone)}" title="${d(F)}" class="${"emoji"+(B&&ce===t.activeSearchItem?" active":"")+(F.unicode?"":" custom-emoji")}" id="${`${Y}-${F.id}`}" style="${F.unicode?null:`--custom-emoji-background: url(${JSON.stringify(F.url)})`}">${F.unicode?u(F,t.currentSkinTone):""}</button>`,F=>`${Y}-${F.id}`)}let w=h`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${g(t.skinTones,(x,B)=>h`<div id="skintone-${B}" class="emoji ${B===t.activeSkinTone?"active":""}" aria-selected="${B===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[B]}" aria-label="${t.i18n.skinTones[B]}">${x}</div>`,x=>x)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${g(t.groups,x=>h`<button role="tab" class="nav-button" aria-controls="tab-${x.id}" aria-label="${t.i18n.categories[x.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===x.id}" title="${t.i18n.categories[x.name]}" data-group-id="${x.id}"><div class="nav-emoji emoji">${x.emoji}</div></button>`,x=>x.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${g(t.currentEmojisWithCategories,(x,B)=>h`<div><div id="menu-label-${B}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:x.category?x.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${B!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(x.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${B}" id="${t.searchMode?"search-results":null}">${T(x.emojis,t.searchMode,"emo")}</div></div>`,x=>x.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${T(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,A=(x,B)=>{for(let Y of s.querySelectorAll(`[${x}]`))B(Y,Y.getAttribute(x))};if(c){s.appendChild(w);for(let x of["click","focusout","input","keydown","keyup"])A(`data-on-${x}`,(B,Y)=>{B.addEventListener(x,n[Y])});A("data-ref",(x,B)=>{i[B]=x}),r.addEventListener("abort",()=>{s.removeChild(w)})}A("data-action",(x,B)=>{let Y=a.get(B);Y||a.set(B,Y=new WeakSet),Y.has(x)||(Y.add(x),o[B](x))})}function Pl(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let l=[...o];o.clear();try{for(let d of l)d()}finally{i=!1,o.size&&(i=!0,xn(r))}},a=new Proxy({},{get(l,d){if(e){let u=n.get(d);u||(u=new Set,n.set(d,u)),u.add(e)}return l[d]},set(l,d,u){if(l[d]!==u){l[d]=u;let h=n.get(d);if(h){for(let g of h)o.add(g);i||(i=!0,xn(r))}}return!0}}),c=l=>{let d=()=>{let u=e;e=d;try{return l()}finally{e=u}};return d()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function $s(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Dl(s,t,e){{let n=s.closest(".tabpanel"),o=So.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),So.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function Ll(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=Pl(o),a=new Map;mn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),mn(i,t),mn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Za,isRtl:!1,currentGroupIndex:0,groups:xs,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=b=>{s.getElementById(b).focus()},l=b=>s.getElementById(`emo-${b.id}`),d=(b,S)=>{e.rootElement.dispatchEvent(new CustomEvent(b,{detail:S,bubbles:!0,composed:!0}))},u=(b,S)=>b.id===S.id,h=(b,S)=>{let{category:z,emojis:N}=b,{category:te,emojis:Q}=S;return z!==te?!1:$s(N,Q,u)},g=b=>{$s(i.currentEmojis,b,u)||(i.currentEmojis=b)},T=b=>{i.searchMode!==b&&(i.searchMode=b)},p=b=>{$s(i.currentEmojisWithCategories,b,h)||(i.currentEmojisWithCategories=b)},w=(b,S)=>S&&b.skins&&b.skins[S]||b.unicode,B={labelWithSkin:(b,S)=>gl([b.name||w(b,S),b.annotation,...b.shortcodes||Es].filter(Boolean)).join(", "),titleForEmoji:b=>b.annotation||(b.shortcodes||Es).join(", "),unicodeWithSkin:w},Y={onClickSkinToneButton:H,onEmojiClick:ue,onNavClick:R,onNavKeydown:Z,onSearchKeydown:O,onSkinToneOptionsClick:C,onSkinToneOptionsFocusOut:de,onSkinToneOptionsKeydown:j,onSkinToneOptionsKeyup:X,onSearchInput:P},F={calculateEmojiGridStyle:E,updateOnIntersection:y},ce=!0;r(()=>{Ml(s,i,B,Y,F,e,o,a,ce),ce=!1}),i.emojiVersion||ys().then(b=>{b||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function b(){let S=!1,z=setTimeout(()=>{S=!0,i.message=i.i18n.loadingMessage},Ja);try{await i.database.ready(),i.databaseLoaded=!0}catch(N){console.error(N),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(z),S&&(S=!1,i.message="")}}i.database&&b()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${ko};`}),r(()=>{i.customEmoji&&i.database&&v()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==_s&&(i.groups=_s):i.groups!==xs&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=xs)}),r(()=>{async function b(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}b()}),r(()=>{i.skinTones=Array(ko).fill().map((b,S)=>cl(i.skinToneEmoji,S))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function b(){let{database:S}=i,z=(await Promise.all(Qa.map(N=>S.getEmojiByUnicodeOrName(N)))).filter(Boolean);i.defaultFavoriteEmojis=z}i.databaseLoaded&&b()});function v(){let{customEmoji:b,database:S}=i,z=b||Es;S.customEmoji!==z&&(S.customEmoji=z)}r(()=>{async function b(){v();let{database:S,defaultFavoriteEmojis:z,numColumns:N}=i,te=await S.getTopFavoriteEmoji(N),Q=await q(Lo([...te,...z],M=>M.unicode||M.name).slice(0,N));i.currentFavorites=Q}i.databaseLoaded&&i.defaultFavoriteEmojis&&b()});function E(b){hl(b,o,()=>{{let S=getComputedStyle(e.rootElement),z=parseInt(S.getPropertyValue("--num-columns"),10),N=S.getPropertyValue("direction")==="rtl";i.numColumns=z,i.isRtl=N}})}function y(b){Dl(b,o,S=>{for(let{target:z,isIntersecting:N}of S)z.classList.toggle("onscreen",N)})}r(()=>{async function b(){let{searchText:S,currentGroup:z,databaseLoaded:N,customEmoji:te}=i;if(!N)i.currentEmojis=[],i.searchMode=!1;else if(S.length>=Ga){let Q=await ee(S);i.searchText===S&&(g(Q),T(!0))}else{let{id:Q}=z;if(Q!==-1||te&&te.length){let M=await J(Q);i.currentGroup.id===Q&&(g(M),T(!1))}}}b()});let k=()=>{bn(()=>ml(e.tabpanelElement))};r(()=>{let{currentEmojis:b,emojiVersion:S}=i,z=b.filter(N=>N.unicode).filter(N=>$o(N)&&!Ts.has(N.unicode));if(!S&&z.length)g(b),bn(()=>$(z));else{let N=S?b:b.filter(D);g(N),k()}});function $(b){fl(b,e.baselineEmoji,l)?k():i.currentEmojis=[...i.currentEmojis]}function D(b){return!b.unicode||!$o(b)||Ts.get(b.unicode)}async function I(b){let S=i.emojiVersion||await ys();return b.filter(({version:z})=>!z||z<=S)}async function q(b){return dl(b,i.emojiVersion||await ys())}async function J(b){let S=b===-1?i.customEmoji:await i.database.getEmojiByGroup(b);return q(await I(S))}async function ee(b){return q(await I(await i.database.getEmojiBySearchQuery(b)))}r(()=>{}),r(()=>{function b(){let{searchMode:z,currentEmojis:N}=i;if(z)return[{category:"",emojis:N}];let te=new Map;for(let Q of N){let M=Q.category||"",ne=te.get(M);ne||(ne=[],te.set(M,ne)),ne.push(Q)}return[...te.entries()].map(([Q,M])=>({category:Q,emojis:M})).sort((Q,M)=>i.customCategorySorting(Q.category,M.category))}let S=b();p(S)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:b}=i;Po(()=>{i.searchText=(b||"").trim(),i.activeSearchItem=-1})});function O(b){if(!i.searchMode||!i.currentEmojis.length)return;let S=z=>{Te(b),i.activeSearchItem=ws(z,i.activeSearchItem,i.currentEmojis)};switch(b.key){case"ArrowDown":return S(!1);case"ArrowUp":return S(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Te(b),ge(i.currentEmojis[i.activeSearchItem].id)}}function R(b){let{target:S}=b,z=S.closest(".nav-button");if(!z)return;let N=parseInt(z.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(te=>te.id===N)}function Z(b){let{target:S,key:z}=b,N=te=>{te&&(Te(b),te.focus())};switch(z){case"ArrowLeft":return N(S.previousElementSibling);case"ArrowRight":return N(S.nextElementSibling);case"Home":return N(S.parentElement.firstElementChild);case"End":return N(S.parentElement.lastElementChild)}}async function W(b){let S=await i.database.getEmojiByUnicodeOrName(b),z=[...i.currentEmojis,...i.currentFavorites].find(te=>te.id===b),N=z.unicode&&w(z,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(b),{emoji:S,skinTone:i.currentSkinTone,...N&&{unicode:N},...z.name&&{name:z.name}}}async function ge(b){let S=W(b);d("emoji-click-sync",S),d("emoji-click",await S)}function ue(b){let{target:S}=b;if(!S.classList.contains("emoji"))return;Te(b);let z=S.id.substring(4);ge(z)}function m(b){i.currentSkinTone=b,i.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:b}),i.database.setPreferredSkinTone(b)}function C(b){let{target:{id:S}}=b,z=S&&S.match(/^skintone-(\d)/);if(!z)return;Te(b);let N=parseInt(z[1],10);m(N)}function H(b){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Te(b),bn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function j(b){if(!i.skinTonePickerExpanded)return;let S=async z=>{Te(b),i.activeSkinTone=z};switch(b.key){case"ArrowUp":return S(ws(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return S(ws(!1,i.activeSkinTone,i.skinTones));case"Home":return S(0);case"End":return S(i.skinTones.length-1);case"Enter":return Te(b),m(i.activeSkinTone);case"Escape":return Te(b),i.skinTonePickerExpanded=!1,c("skintone-button")}}function X(b){if(i.skinTonePickerExpanded)switch(b.key){case" ":return Te(b),m(i.activeSkinTone)}}async function de(b){let{relatedTarget:S}=b;(!S||S.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function P(b){i.rawSearchText=b.target.value}return{$set(b){mn(i,b)},$destroy(){n.abort()}}}function Mo(s){s instanceof Ze||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var _s,xs,Ga,ko,Po,Ya,Ja,Xa,Za,Qa,Do,el,Eo,tl,vs,ys,Ts,il,ol,rl,al,ll,bn,ul,pl,ks,Xe,xl,vl,yl,wl,xn,So,Es,mn,Rl,Il,Bl,jl,Ro,Ol,Ze,Io,Bo=$n(()=>{bs();_s=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),xs=_s.slice(1),Ga=2,ko=6,Po=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Ya={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Ja=1e3,Xa="🖐️",Za=8,Qa=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Do='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',el=(s,t)=>s<t?-1:s>t?1:0,Eo=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Do}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},tl=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ys=()=>(vs||(vs=new Promise(s=>Po(()=>s(sl())))),vs),Ts=new Map,il="️",ol="\uD83C",rl="‍",al=127995,ll=57339;bn=requestAnimationFrame,ul=typeof ResizeObserver=="function";pl="😀";xl=new WeakMap,vl=new WeakMap,yl=Symbol("un-keyed"),wl="replaceChildren"in Element.prototype;xn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);So=new WeakMap;Es=[],{assign:mn}=Object;Rl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Il="en",Bl={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},jl=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Ro=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Ol=`:host{--emoji-font-family:${Do}}`,Ze=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=jl+Ol,this.shadowRoot.appendChild(e),this._ctx={locale:Il,dataSource:Rl,skinToneEmoji:Xa,customCategorySorting:el,customEmoji:null,i18n:Bl,emojiVersion:null,...t};for(let n of Ro)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Mo(this),this._cmp||(this._cmp=Ll(this.shadowRoot,this._ctx))}disconnectedCallback(){Mo(this),xn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new lt({locale:t,dataSource:e}))}_dbFlush(){xn(()=>this._dbCreate())}},Io={};for(let s of Ro)Io[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(Ze.prototype,Io);customElements.get("emoji-picker")||customElements.define("emoji-picker",Ze)});var jo={};hr(jo,{Database:()=>lt,Picker:()=>Ze});var Oo=$n(()=>{Bo();bs()});function Ns(s){return{type:"auth",access_token:s}}function zs(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Us(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function En(s){return{type:"unsubscribe_events",subscription:s}}function Hs(){return{type:"ping"}}function Fs(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function Ws(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[i]=r}return t}var qs=(s,t,e,n)=>{let[o,i,r]=s.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(i)>=e:Number(i)>e)||n!==void 0&&Number(o)===t&&Number(i)===e&&Number(r)>=n};var It=!1,fr="auth_required",gr="auth_invalid",mr="auth_ok";function Gs(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;It&&console.log("[Auth phase] Initializing",n);function o(i,r,a){It&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),l=!1,d=()=>{if(c.removeEventListener("close",d),l){a(2);return}if(i===0){a(1);return}let g=i===-1?-1:i-1;setTimeout(()=>o(g,r,a),1e3)},u=async g=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(Ns(t.accessToken)))}catch(T){l=T===2,c.close()}},h=async g=>{let T=JSON.parse(g.data);switch(It&&console.log("[Auth phase] Received",T),T.type){case gr:l=!0,c.close();break;case mr:c.removeEventListener("open",u),c.removeEventListener("message",h),c.removeEventListener("close",d),c.removeEventListener("error",d),c.haVersion=T.ha_version,qs(c.haVersion,2022,9)&&c.send(JSON.stringify(zs())),r(c);break;default:It&&T.type!==fr&&console.warn("[Auth phase] Unhandled message",T)}};c.addEventListener("open",u),c.addEventListener("message",h),c.addEventListener("close",d),c.addEventListener("error",d)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var ht=!1,Bt=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{ht&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(En(i.id)).catch(a=>{ht&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:ht&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(Fs(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){ht&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let l of c)l.reject&&l.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,Us(e))}ping(){return this.sendMessagePromise(Hs())}sendMessage(t,e){if(!this.connected)throw 3;if(ht&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(i){n(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(En(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var br=()=>`${location.protocol}//${location.host}/`,xr=s=>s*1e3+Date.now();function vr(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function yr(s,t,e,n){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function wr(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=yr(s,t,e,n)}async function Xs(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=t,r.expires=xr(r.expires_in),r}function Js(s,t,e){return Xs(s,t,{code:e,grant_type:"authorization_code"})}function kr(s){return btoa(JSON.stringify(s))}function $r(s){return JSON.parse(atob(s))}var _n=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await Xs(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function Zs(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:br(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await Js(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let i=Ws(location.search.substr(1));if("auth_callback"in i){let r=$r(i.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await Js(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new _n(t,s.saveTokens);if(e===void 0)throw 4;return wr(e,n,s.redirectUrl||vr(),kr({hassUrl:e,clientId:n})),new Promise(()=>{})}async function Qs(s){let t=Object.assign({setupRetry:0,createSocket:Gs},s),e=await t.createSocket(t);return new Bt(e,t)}function U(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function pt(s){let t=Math.floor(Math.round(s)/60)%24;return`${U(s)} ${t<12?"AM":"PM"}`}function ei(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function gt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function ti(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Er=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),_r=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Tr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function jt(s){return new Date(`${s}T12:00:00Z`)}function ke(s){let t=jt(s);return`${Er.format(t)}, ${Tr.format(t)}`}function fe(s){return _r.format(jt(s))}function $e(s,t){return Math.round((jt(t).getTime()-jt(s).getTime())/864e5)}function ft(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return ft("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Ot(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=ft(e,s),i=ft(e,t).date;return o.date===i?`at ${pt(o.minutes)}`:`on ${fe(o.date)} at ${pt(o.minutes)}`}var re=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},Ne="mydashlight",Cr=7,ni=3e4;function Tn(s){if(s instanceof re)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new re(String(t.code??"error"),t.message)}return typeof s=="number"?new re("connection_lost","Lost the connection to Home Assistant."):new re("error",String(s))}var Nt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new re("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},ni),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new re("not_running","MyDashLight isn’t running right now."))},{type:`${Ne}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:Ne,service:"get_plan",service_data:{days:Cr},return_response:!0});this.emit(t.response)}catch(t){this.fail(Tn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ne,service:t,service_data:e})}catch(n){throw Tn(n)}this.pushing||await this.refresh()}setRide(t,e,n,o){return this.call("set_ride",{event:t,side:e,driver:n,scope:o})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:ti(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,o=null,i=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:Ne,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(a=>{e||t(a.chores)},{type:`${Ne}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;i(),o=setInterval(()=>void i(),ni)}})(),()=>{e=!0,o&&clearInterval(o),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let o=await this.conn.subscribeMessage(i=>{e||t(i.lunch)},{type:`${Ne}/lunch/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):n=o}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ne,service:t,service_data:e})}catch(n){throw Tn(n)}}};var zt=globalThis,Ut=zt.ShadowRoot&&(zt.ShadyCSS===void 0||zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Cn=Symbol(),si=new WeakMap,mt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Cn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Ut&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=si.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&si.set(e,t))}return t}toString(){return this.cssText}},ii=s=>new mt(typeof s=="string"?s:s+"",void 0,Cn),ze=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new mt(e,s,Cn)},oi=(s,t)=>{if(Ut)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=zt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},An=Ut?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return ii(e)})(s):s;var{is:Ar,defineProperty:Sr,getOwnPropertyDescriptor:Mr,getOwnPropertyNames:Pr,getOwnPropertySymbols:Dr,getPrototypeOf:Lr}=Object,Ht=globalThis,ri=Ht.trustedTypes,Rr=ri?ri.emptyScript:"",Ir=Ht.reactiveElementPolyfillSupport,bt=(s,t)=>s,Sn={toAttribute(s,t){switch(t){case Boolean:s=s?Rr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},li=(s,t)=>!Ar(s,t),ai={attribute:!0,type:String,converter:Sn,reflect:!1,useDefault:!1,hasChanged:li};Symbol.metadata??=Symbol("metadata"),Ht.litPropertyMetadata??=new WeakMap;var Ae=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ai){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&Sr(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=Mr(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ai}static _$Ei(){if(this.hasOwnProperty(bt("elementProperties")))return;let t=Lr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(bt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bt("properties"))){let e=this.properties,n=[...Pr(e),...Dr(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(An(o))}else t!==void 0&&e.push(An(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return oi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:Sn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Sn;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??li)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Ae.elementStyles=[],Ae.shadowRootOptions={mode:"open"},Ae[bt("elementProperties")]=new Map,Ae[bt("finalized")]=new Map,Ir?.({ReactiveElement:Ae}),(Ht.reactiveElementVersions??=[]).push("2.1.2");var Pn=globalThis,ci=s=>s,Ft=Pn.trustedTypes,di=Ft?Ft.createPolicy("lit-html",{createHTML:s=>s}):void 0,Dn="$lit$",Se=`lit$${Math.random().toFixed(9).slice(2)}$`,Ln="?"+Se,Br=`<${Ln}>`,Fe=document,vt=()=>Fe.createComment(""),yt=s=>s===null||typeof s!="object"&&typeof s!="function",Rn=Array.isArray,mi=s=>Rn(s)||typeof s?.[Symbol.iterator]=="function",Mn=`[ 	
\f\r]`,xt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ui=/-->/g,hi=/>/g,Ue=RegExp(`>|${Mn}(?:([^\\s"'>=/]+)(${Mn}*=${Mn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pi=/'/g,fi=/"/g,bi=/^(?:script|style|textarea|title)$/i,In=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),f=In(1),ae=In(2),Yc=In(3),Me=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),gi=new WeakMap,He=Fe.createTreeWalker(Fe,129);function xi(s,t){if(!Rn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return di!==void 0?di.createHTML(t):t}var vi=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=xt;for(let a=0;a<e;a++){let c=s[a],l,d,u=-1,h=0;for(;h<c.length&&(r.lastIndex=h,d=r.exec(c),d!==null);)h=r.lastIndex,r===xt?d[1]==="!--"?r=ui:d[1]!==void 0?r=hi:d[2]!==void 0?(bi.test(d[2])&&(o=RegExp("</"+d[2],"g")),r=Ue):d[3]!==void 0&&(r=Ue):r===Ue?d[0]===">"?(r=o??xt,u=-1):d[1]===void 0?u=-2:(u=r.lastIndex-d[2].length,l=d[1],r=d[3]===void 0?Ue:d[3]==='"'?fi:pi):r===fi||r===pi?r=Ue:r===ui||r===hi?r=xt:(r=Ue,o=void 0);let g=r===Ue&&s[a+1].startsWith("/>")?" ":"";i+=r===xt?c+Br:u>=0?(n.push(l),c.slice(0,u)+Dn+c.slice(u)+Se+g):c+Se+(u===-2?a:g)}return[xi(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},wt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,a=t.length-1,c=this.parts,[l,d]=vi(t,e);if(this.el=s.createElement(l,n),He.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(o=He.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let u of o.getAttributeNames())if(u.endsWith(Dn)){let h=d[r++],g=o.getAttribute(u).split(Se),T=/([.?@])?(.*)/.exec(h);c.push({type:1,index:i,name:T[2],strings:g,ctor:T[1]==="."?Wt:T[1]==="?"?qt:T[1]==="@"?Vt:We}),o.removeAttribute(u)}else u.startsWith(Se)&&(c.push({type:6,index:i}),o.removeAttribute(u));if(bi.test(o.tagName)){let u=o.textContent.split(Se),h=u.length-1;if(h>0){o.textContent=Ft?Ft.emptyScript:"";for(let g=0;g<h;g++)o.append(u[g],vt()),He.nextNode(),c.push({type:2,index:++i});o.append(u[h],vt())}}}else if(o.nodeType===8)if(o.data===Ln)c.push({type:2,index:i});else{let u=-1;for(;(u=o.data.indexOf(Se,u+1))!==-1;)c.push({type:7,index:i}),u+=Se.length-1}i++}}static createElement(t,e){let n=Fe.createElement("template");return n.innerHTML=t,n}};function Ke(s,t,e=s,n){if(t===Me)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=yt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Ke(s,o._$AS(s,t.values),o,n)),t}var Kt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Fe).importNode(e,!0);He.currentNode=o;let i=He.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let l;c.type===2?l=new tt(i,i.nextSibling,this,t):c.type===1?l=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(l=new Gt(i,this,t)),this._$AV.push(l),c=n[++a]}r!==c?.index&&(i=He.nextNode(),r++)}return He.currentNode=Fe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},tt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ke(this,t,e),yt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==Me&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):mi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Fe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=wt.createElement(xi(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new Kt(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=gi.get(t.strings);return e===void 0&&gi.set(t.strings,e=new wt(t)),e}k(t){Rn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(vt()),this.O(vt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=ci(t).nextSibling;ci(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},We=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=_}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Ke(this,t,e,0),r=!yt(t)||t!==this._$AH&&t!==Me,r&&(this._$AH=t);else{let a=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=Ke(this,a[n+c],e,c),l===Me&&(l=this._$AH[c]),r||=!yt(l)||l!==this._$AH[c],l===_?t=_:t!==_&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}r&&!o&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Wt=class extends We{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},qt=class extends We{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},Vt=class extends We{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Ke(this,t,e,0)??_)===Me)return;let n=this._$AH,o=t===_&&n!==_||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==_&&(n===_||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Gt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Ke(this,t)}},yi={M:Dn,P:Se,A:Ln,C:1,L:vi,R:Kt,D:mi,V:Ke,I:tt,H:We,N:qt,U:Vt,B:Wt,F:Gt},jr=Pn.litHtmlPolyfillSupport;jr?.(wt,tt),(Pn.litHtmlVersions??=[]).push("3.3.3");var wi=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new tt(t.insertBefore(vt(),i),i,void 0,e??{})}return o._$AI(s),o};var Bn=globalThis,ye=class extends Ae{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=wi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Me}};ye._$litElement$=!0,ye.finalized=!0,Bn.litElementHydrateSupport?.({LitElement:ye});var Or=Bn.litElementPolyfillSupport;Or?.({LitElement:ye});(Bn.litElementVersions??=[]).push("4.2.2");var ki={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},$i=s=>(...t)=>({_$litDirective$:s,values:t}),Yt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Nr}=yi,Ei=s=>s;var _i=()=>document.createComment(""),nt=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(_i(),o),r=n.insertBefore(_i(),o);e=new Nr(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||a){let c=e._$AA;for(;c!==i;){let l=Ei(c).nextSibling;Ei(n).insertBefore(c,o),c=l}}}return e},Ie=(s,t,e=s)=>(s._$AI(t,e),s),zr={},Ti=(s,t=zr)=>s._$AH=t,Ci=s=>s._$AH,Jt=s=>{s._$AR(),s._$AA.remove()};var Ai=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Pe=$i(class extends Yt{constructor(s){if(super(s),s.type!==ki.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let a of s)o[r]=n?n(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=Ci(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],c=[],l,d,u=0,h=o.length-1,g=0,T=i.length-1;for(;u<=h&&g<=T;)if(o[u]===null)u++;else if(o[h]===null)h--;else if(a[u]===r[g])c[g]=Ie(o[u],i[g]),u++,g++;else if(a[h]===r[T])c[T]=Ie(o[h],i[T]),h--,T--;else if(a[u]===r[T])c[T]=Ie(o[u],i[T]),nt(s,c[T+1],o[u]),u++,T--;else if(a[h]===r[g])c[g]=Ie(o[h],i[g]),nt(s,o[u],o[h]),h--,g++;else if(l===void 0&&(l=Ai(r,g,T),d=Ai(a,u,h)),l.has(a[u]))if(l.has(a[h])){let p=d.get(r[g]),w=p!==void 0?o[p]:null;if(w===null){let A=nt(s,o[u]);Ie(A,i[g]),c[g]=A}else c[g]=Ie(w,i[g]),nt(s,o[u],w),o[p]=null;g++}else Jt(o[h]),h--;else Jt(o[u]),u++;for(;g<=T;){let p=nt(s,c[T+1]);Ie(p,i[g]),c[g++]=p}for(;u<=h;){let p=o[u++];p!==null&&Jt(p)}return this.ut=r,Ti(s,c),Me}});var Xt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function le(s){return Xt[(s%Xt.length+Xt.length)%Xt.length]}var Zt="#23272E",jn="35,39,46";var Ur=3,sn=36,On=12,Si=8,Mi=30,Ee=16,kt=100,Nn=60,zn=10,en=30,Un=10,Hr=150,Fr=200,nn=1.4;function Fn(s,t){let e=Math.max(Hr,Fr/nn);return Math.ceil(Nn+Math.max(0,s-1)*zn+en+Math.max(0,t-1)*Un+e*(s+nn*t))}function De(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function Le(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function xe(s){return new Map(De(s).map((t,e)=>[t,le(e)]))}function ve(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function me(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Kn(s,t){return t==="none"?"Not needed":Le(s).includes(t)?me(s,t):t}function on(s,t){return t.own?me(s,t.own):ve(s,t.kid)}var rn={color:Zt,rgb:jn,ink:Zt};function Ri(s,t){return t.own?rn:xe(s).get(t.kid)??le(0)}function Kr(s,t){let e=De(s);return t.along.map(n=>e.includes(n)?ve(s,n):me(s,n))}function Wn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Wr(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function tn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Qt(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(tn(t,n.from)),e.push(tn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(tn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function qr(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),t}function Vr(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function Gr(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function Ii(s,t){return Vr(s.anchors,t)}function Bi(s,t){return Gr(s.anchors,t)}function Yr(s,t){let e=De(s),n=Le(s),o=Math.max(t,Fn(e.length,n.length)),r=(o-Nn-Math.max(0,e.length-1)*zn-en-Math.max(0,n.length-1)*Un)/(e.length+nn*n.length||1),a=Math.floor(r),c=Math.floor(r*nn),l=new Map;for(let T of s.days)for(let p of T.events)for(let w of p.own?p.along:[p.kid]){let A=l.get(w)??[];A.some(x=>x.event_id===p.event_id&&x.calendar_id===p.calendar_id)||A.push(p),l.set(w,A)}let d=xe(s),u=[],h=Nn;e.forEach((T,p)=>{let w=l.get(T)??[],A=s.days.some(x=>x.events.some(B=>B.kid===T&&(B.sides.includes("drop")&&B.drop===""||B.sides.includes("pick")&&B.pick==="")));u.push({id:T,kind:"kid",x:h,w:a,name:ve(s,T),dot:d.get(T).color,rgb:d.get(T).rgb,sub:`${A?"Needs a ride · ":""}${w.length} this week`,subWarn:A}),h+=a+(p<e.length-1?zn:0)});let g=h+en/2;return h+=en,n.forEach((T,p)=>{let w=0,A=0;for(let x of s.days){let B=x.drivers[T];B&&(w+=B.outings.length,A+=B.drive??0)}u.push({id:T,kind:"driver",x:h,w:c,name:me(s,T),dot:Zt,rgb:jn,sub:`${w} ${w===1?"trip":"trips"} this week · ${gt(A)} driving`,subWarn:!1}),h+=c+(p<n.length-1?Un:0)}),{columns:u,sepX:g,width:o}}function Jr(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Pi(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${U(s.start)}`:e||!t?`${s.title} until ${U(s.end)}`:`${s.title} ${U(s.start)}–${U(s.end)}`}function qn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length}function Vn(s,t){let e=$e(t,s);return e===0?"Today":e===1?"Tomorrow":""}function he(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Hn(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=n?i+=1+a:(o++,i=a);i>n;)o++,i-=n}return o}var ji=25,Oi=15,Gn=3;function Di(s){return Math.max(0,Math.min(Gn,Math.floor((s-ji)/Oi)))}function Xr(s,t){let e=Math.min(Gn,Hn(s,t-19,6.6));return ji+e*Oi+2}function Li(s,t){let e=t-23,n=`${U(s.start)}–${U(s.end)}`+(s.arrive_by!=null?` · arrive ${U(s.arrive_by)}`:""),o=33+Hn(n,e,6.6)*16;for(let i of[s.lines.drop,s.lines.pick])i&&(o+=2+Hn(i.text,e,7)*16);return o+4}function Ni(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:a}=Yr(s,e),c=new Map(i.map(x=>[x.id,x])),l=De(s),d=Le(s),u=[...l,...d],h=xe(s),g=Wr(s),T=x=>ve(s,x),p=x=>me(s,x),w={mode:t,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},A=0;return s.days.forEach((x,B)=>{let Y=B*1440,F=new Map(x.events.map(m=>[m.id,m])),ce=m=>m&&F.has(m)?{day:x.date,event:m}:null,v=qn(x),E=x.events.length,y=Vn(x.date,n.date);w.dayHeads.push({date:x.date,y:A,label:ke(x.date),tag:y,sub:(E?`${E} ${E===1?"activity":"activities"}`:"Nothing scheduled")+(v?` · ${v} to sort out`:""),warn:v>0}),w.anchors.push({t:Y,y:A});let k=A+sn+On,$=d.flatMap(m=>x.drivers[m]?.outings??[]);if(!E&&!$.length){w.empties.push({key:x.date,y:k,text:"Nothing planned"}),A=k+40,w.anchors.push({t:Y+1439,y:A});return}let D=(m,C,H,j,X,de,P,b=m.kid)=>{let S=!!m.own&&b===m.own,z=!!m.own&&b!==m.own,N=S?rn:h.get(b)??le(0),te=S?p(b):T(b),Q=z?{drop:{text:`With ${p(m.own)}`,tone:m.attending===!1?"muted":"normal"},pick:null}:m.lines,M=S?Kr(s,m):[],ne=(m.takes!=null?`${m.takes} min, any time ${U(m.start)}–${U(m.end)}`:`${U(m.start)}–${U(m.end)}`+(m.arrive_by!=null?` · arrive ${U(m.arrive_by)}`:""))+(M.length?` · with ${Wn(M)}`:"");return{key:`${x.date}|card|${m.id}`+(m.own?`|${b}`:""),x:C,y:H,w:j,h:X,target:{day:x.date,event:m.id},event:m,color:N,kidName:te,clash:de,stayed:!m.own&&m.stay&&d.includes(m.drop),skipped:m.attending===!1,title:Jr(m.title,te),time:ne,drop:Q.drop,pick:Q.pick,showDrop:!!Q.drop&&(P||X>=56),showPick:!!Q.pick&&(P||X>=74),wrap:P,aria:`${te}, ${m.title} ${m.takes!=null?`any time from ${U(m.start)} to ${U(m.end)}`:`${U(m.start)} to ${U(m.end)}`}. `+(m.attending===!1&&!Q.drop?"Not attending. ":"")+[Q.drop,Q.pick].filter(L=>!!L).map(L=>L.text).join(". ")}},I=m=>{let C=x.rides[m];return C?(x.drivers[C.driver]?.segments??[]).filter(j=>j.type!=="home"&&j.kids.includes(C.kid)&&he(j.start)>=he(C.start)&&he(j.end)<=he(C.end)):[]},q=m=>{let C=x.rides[m];if(!C)return null;let H=C.serves.find(j=>F.get(j)?.kid===C.kid);return ce(H??C.serves[0])},J=(m,C)=>{if(C.event)return C;let H=x.events.find(j=>j.own&&j.own!==m&&j.along.includes(m)&&j.title===C.title);return H?{...C,title:`${C.title} with ${p(H.own)}`}:C},ee=m=>{if(m.takes==null)return[m.start,m.end];let C=m.planned??m.start;return[C,C+m.takes]},O=new Map;for(let m of x.issues)m.level!=="problem"||!m.event||(m.kind==="late"&&O.set(m.event,`${Math.round(he(m.minutes))} min late`),m.kind==="waiting"&&O.set(`${m.event}|pick`,`Waits ${Math.round(he(m.minutes))} min`));if(!o){let m=1/0,C=-1/0;for(let P of x.events)P.start<=0&&P.end>=1440||(P.start>0?m=Math.min(m,P.start-20,P.arrive_by!=null?P.arrive_by-10:1/0):m=Math.min(m,P.end-30),P.end<1440?C=Math.max(C,P.end+20):C=Math.max(C,P.start+30));for(let P of $)P.start!=null&&(m=Math.min(m,P.start)),P.end!=null&&(C=Math.max(C,P.end));x.date===n.date&&Number.isFinite(m)&&n.minutes>m-60&&n.minutes<C&&(m=Math.min(m,n.minutes-15));let H=Number.isFinite(m)?Math.floor((m-5)/30)*30:900,j=Number.isFinite(C)?Math.ceil((C+5)/30)*30:960,X=P=>Math.round(k+(Math.max(H,Math.min(j,P))-H)*Ur);w.anchors.push({t:Y+H,y:X(H)},{t:Y+j,y:X(j)});for(let P of l){let b=c.get(P),S=h.get(P),z=(x.kids[P]?.items??[]).filter(L=>L.start!=null&&L.end!=null).map(L=>({item:L,s:he(L.start),en:he(L.end)})),N=[];for(let L of qr(z)){let K=b.w/L.cols,V=Math.round(b.x+L.col*K),se=Math.round(K-(L.cols>1?4:0)),oe=X(L.s),ie=L.item;if(ie.type==="act"){let be=F.get(ie.event??"");if(!be)continue;let Lt=Math.max(30,X(L.en)-oe),Rt=D(be,V,oe,se,Lt,ie.clash,!1,P);if(Rt.layer=kt,w.cards.push(Rt),be.arrive_by!=null&&be.start-be.arrive_by>=5){let kn=X(be.arrive_by),Os={key:`${x.date}|prep|${be.id}`,x:V,y:kn,w:se,h:oe-kn+Ee,color:S,label:`Arrive by ${U(be.arrive_by)}`,layer:kt-1};w.preps.push(Os),N.push({s:be.arrive_by,en:L.en,top:kn,bottom:oe+Lt,x:V,w:se,prep:Os,card:Rt})}else N.push({s:L.s,en:L.en,top:oe,bottom:oe+Lt,x:V,w:se,card:Rt});let Bs=O.get(be.id);Bs&&w.marks.push({key:`${x.date}|late|${be.id}`,x:V+se-4,y:oe+4,text:Bs,right:!0});let js=O.get(`${be.id}|pick`);js&&w.marks.push({key:`${x.date}|wait|${be.id}`,x:V+4,y:oe+Lt+2,text:js,right:!1});continue}let G=x.rides[ie.ride??-1];if(!G)continue;let we=Math.max(22,X(L.en)-oe),ut=Qt(I(G.index),g),Ls=p(G.driver),Rs={key:`${x.date}|ride|${G.index}`,x:V,y:oe,w:se,h:we,target:q(G.index),l1:`${G.own?"In":"Along in"} ${Ls}’s car`,l2:ut.join(" → "),show2:Di(we)>0,lines2:Di(we),dashed:!G.own,clash:ie.clash,aria:`${T(P)} ${G.own?"in":"riding along in"} ${Ls}’s car, ${U(he(G.start))} to ${U(he(G.end))}: ${ut.join(" to ")}`};w.rides.push(Rs);let Is=c.get(G.driver),wn=null;Is&&(wn={key:`${x.date}|band|${G.index}`,x:V+se,y:oe,w:Math.max(0,Is.x+8-(V+se)),h:we,color:S},w.bands.push(wn)),N.push({s:L.s,en:L.en,top:oe,bottom:oe+we,x:V,w:se,ride:Rs,band:wn})}let te=L=>L.ride?.layer??(L.prep?kt-1:kt),Q=(L,K,V,se)=>{V>Ee&&w.links.push({key:`${L.key}|link`,x:L.x,y:K,w:L.w,h:V,color:S,layer:se})},M=(L,K)=>{if(!(K.x<L.x||K.x+K.w>L.x+L.w)&&(L.x=K.x,L.w=K.w,L.ride.x=K.x,L.ride.w=K.w,L.band)){let V=L.band.x+L.band.w;L.band.x=K.x+K.w,L.band.w=Math.max(0,V-L.band.x)}},ne=new Set;for(let L of[...N].sort((K,V)=>V.s-K.s)){let K=L.ride;if(!K)continue;let V=N.filter(ie=>ie!==L&&ie.s>=L.en&&ie.s-L.en<=Mi&&ie.top>=L.bottom).sort((ie,G)=>ie.s-G.s||ie.top-G.top)[0];if(!V)continue;ne.add(L),M(L,V);let se=te(V),oe=V.top-L.bottom;Q(K,L.bottom,oe+Ee,se-1),K.layer=se-(oe>0?2:1),K.h+=Ee,K.tuckBottom=Ee}for(let L of[...N].sort((K,V)=>K.s-V.s)){let K=L.ride;if(!K||ne.has(L))continue;let V=N.filter(ie=>ie!==L&&ie.en<=L.s&&L.s-ie.en<=Mi&&ie.bottom<=L.top&&(ie.card||ie.ride?.layer!=null)).sort((ie,G)=>G.en-ie.en||G.bottom-ie.bottom)[0];if(!V)continue;M(L,V);let se=V.ride?.layer??kt,oe=L.top-V.bottom;Q(K,V.bottom-Ee,oe+Ee,se-1),K.layer=se-(oe>0?2:1),K.y-=Ee,K.h+=Ee,K.tuckTop=Ee}}for(let P of d){let b=c.get(P),S=x.drivers[P];if(!S)continue;let z=[],N=null;for(let M of S.segments)if(!(M.start==null||M.end==null)){if(M.type==="home"){N=null;continue}if(M.type==="stay"){N=null,z.push({type:"stay",g:M,s:M.start,en:M.end});continue}N&&N.en===M.start?(N.en=M.end,N.legs.push(M)):(N={type:"trip",s:M.start,en:M.end,legs:[M]},z.push(N))}let te=new Set,Q=(M,ne,L,K)=>{te.add(M.id);let V=X(ne),se=D(M,b.x+8,V,b.w-16,Math.max(30,X(L)-V),!1,!1,P);K&&se.drop?.tone==="normal"&&(se.drop=null,se.showDrop=!1),w.cards.push(se)};for(let M of z){let ne=X(M.s),L=Math.max(24,X(M.en)-ne);if(M.type==="stay"){let G=F.get(M.g.event??M.g.serves??"");if(G?.own===P){Q(G,M.s,M.en,!0);continue}let we=G?h.get(G.kid)??le(0):le(0),ut=M.g.kids.map(T);w.stays.push({key:`${x.date}|stay|${P}|${M.s}`,x:b.x+8,y:ne,w:b.w-16,h:L,target:ce(G?.id),color:we,l1:G?`At ${G.title} with ${T(G.kid)}`:"Staying",l2:`until ${U(M.en)}`+(ut.length?` · ${ut.join(" and ")} too`:"")});continue}let K=M.legs[0],V=M.legs[M.legs.length-1],se=[];for(let G of M.legs)for(let we of G.kids)se.includes(we)||se.push(we);let oe=V.type==="drive"&&V.to==="home",ie=Qt(M.legs,g);w.trips.push({key:`${x.date}|trip|${P}|${M.s}`,x:b.x+8,y:ne,w:b.w-16,h:L,target:ce(M.legs.find(G=>G.serves)?.serves),l1:K.type==="drive"&&K.from==="home"?`Leave ${U(M.s)}`:`From ${tn(g,K.from??K.place)} ${U(M.s)}`,l2:ie.join(" → "),show2:L>=36,l3:oe?`Home ${U(M.en)}`:"",show3:oe&&L>=62,stops:null,kids:se.map(G=>(h.get(G)??le(0)).color),bad:M.legs.some(G=>G.overlaps_busy),aria:`${p(P)} drives ${ie.join(" to ")}, ${U(M.s)} to ${U(M.en)}`})}for(let M of S.segments)if(!(!M.overlaps_busy||M.start==null||M.end==null))for(let ne of S.busy){let L=Math.max(M.start,ne.start),K=Math.min(M.end,ne.end);K<=L||w.overlaps.push({key:`${x.date}|overlap|${P}|${L}`,x:b.x+6,y:X(L)-2,w:b.w-12,h:Math.max(8,X(K)-X(L)+4)})}for(let M of x.events)if(M.own===P&&(te.has(M.id)||Q(M,...ee(M),!1),M.takes!=null&&M.attending!==!1)){let ne=X(M.start);w.windows.push({key:`${x.date}|window|${M.id}`,x:b.x+4,y:ne,w:b.w-8,h:Math.max(24,X(M.end)-ne),label:`${M.title} · any time ${U(M.start)}–${U(M.end)}`})}for(let M of S.busy){if(M.event||M.end<=H||M.start>=j)continue;let ne=J(P,M),L=X(ne.start),K=X(ne.end);w.busy.push({key:`${x.date}|busy|${P}|${ne.start}`,x:b.x+1,y:L,w:b.w-2,h:K-L,labelY:8,label:Pi(ne,!1)})}}let de=-1/0;for(let P=H;P<=j;P+=30)w.grid.push({key:`${x.date}|grid|${P}`,y:X(P),strong:P%60===0}),P%60===0&&X(P)-de>=22&&(w.hours.push({key:`${x.date}|hour|${P}`,y:X(P)-8,label:ei(P)}),de=X(P));x.date===n.date&&n.minutes>H&&n.minutes<j&&(w.now={y:X(n.minutes),label:`Now ${U(n.minutes)}`}),A=X(j)+On;return}let R=[];for(let m of l){let C=c.get(m);for(let H of x.kids[m]?.items??[])if(H.start!=null){if(H.type==="act"){let j=F.get(H.event??"");if(!j)continue;R.push({col:m,s:H.start,h:Li(j,C.w),kind:"act",item:H})}else if(!x.rides[H.ride??-1]?.own){let j=x.rides[H.ride??-1],X=j?Qt(I(j.index),g).join(" → "):"";R.push({col:m,s:H.start,h:Xr(X,C.w),kind:"along",item:H})}}}for(let m of d){let C=x.drivers[m];if(!C)continue;for(let j of C.busy)j.event||R.push({col:m,s:j.start,h:32,kind:"busy",busy:J(m,j)});let H=c.get(m).w;for(let j of x.events)j.own!==m||j.attending!==!1&&(j.takes==null||j.planned!=null)||R.push({col:m,s:ee(j)[0],h:Li(j,H),kind:"own",event:j});for(let j of C.outings)j.start!=null&&R.push({col:m,s:j.start,h:30+j.lines.length*16+(j.warn?16:0),kind:"out",out:j})}R.sort((m,C)=>m.s-C.s||u.indexOf(m.col)-u.indexOf(C.col));let Z=new Map,W=[],ge=k;R.forEach((m,C)=>{let H=Z.get(m.col),j=Math.max(H!=null?H+Si:k,ge);Z.set(m.col,j+m.h),ge=j;let X=m.kind==="busy"?m.busy.end:m.kind==="act"?F.get(m.item.event??"")?.end??null:m.kind==="own"?ee(m.event)[1]:null;W.push({col:m.col,s:m.s,end:X,y:j,h:m.h,box:null}),w.anchors.push({t:Y+m.s,y:j});let de=c.get(m.col);if(m.kind==="busy"){let P={key:`${x.date}|busy|${m.col}|${C}`,x:de.x+1,y:j,w:de.w-2,h:m.h,labelY:8,label:Pi(m.busy,!0)};w.busy.push(P),W[W.length-1].box=P}else if(m.kind==="out"){let P=m.out;w.trips.push({key:`${x.date}|trip|${m.col}|${C}`,x:de.x+8,y:j,w:de.w-16,h:m.h,target:ce(P.target),l1:P.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...P.lines.map(b=>({text:b,warn:!1})),...P.warn?[{text:P.warn,warn:!0}]:[]],kids:P.kids.map(b=>(h.get(b)??le(0)).color),bad:!!P.warn,aria:`${p(m.col)}: ${P.lead}. ${P.lines.join(". ")}${P.warn?`. ${P.warn}`:""}`})}else if(m.kind==="own"){let P=D(m.event,de.x+8,j,de.w-16,m.h,!1,!0,m.col);w.cards.push(P),W[W.length-1].box=P}else if(m.kind==="act"){let P=F.get(m.item.event??""),b=D(P,de.x,j,de.w,m.h,m.item.clash,!0,m.col);w.cards.push(b),W[W.length-1].box=b}else{let P=x.rides[m.item.ride??-1],b=Qt(I(P.index),g),S=p(P.driver);w.rides.push({key:`${x.date}|ride|${P.index}`,x:de.x,y:j,w:de.w,h:m.h,target:q(P.index),l1:`Along with ${S} ${U(he(P.start))}`,l2:b.join(" → "),show2:!0,lines2:Gn,dashed:!0,clash:m.item.clash,aria:`${T(m.col)} riding along with ${S}, ${U(he(P.start))} to ${U(he(P.end))}: ${b.join(" to ")}`})}});let ue=k;for(let m of Z.values())ue=Math.max(ue,m);for(let m of W){if(!m.box||m.end==null)continue;let C=m.y+m.h;for(let H of W)H.col!==m.col&&H.s>=m.s&&H.s<m.end&&(C=Math.max(C,H.y+H.h));m.end>=1440&&(C=ue);for(let H of W)H.col===m.col&&H.y>m.y&&(C=Math.min(C,H.y-Si));C=Math.min(C,ue),C>m.y+m.h&&(m.box.h=C-m.y)}A=ue+On+6,w.anchors.push({t:Y+1439,y:A})}),w.height=A,w}var Zr=["","¼","½","¾"];function qe(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return gt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=Zr[o%4];return`${i||!r?i:""}${r} min`})}function zi(s){let t=e=>e?{...e,text:qe(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(qe),warn:i.warn==null?i.warn:qe(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:qe(n.title),body:qe(n.body),note:n.note==null?n.note:qe(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:qe(o.note)}))}:{}}))}))}}var Qr=2,ea=48;function Ui(s,t,e=ea){let n=[],o=0,i=0,r=0,a=0,c=t.minutes+e*60;for(let l of s.days){let d=$e(t.date,l.date),u=d===0?"":`${fe(l.date)} · `,h=new Map(l.events.map(p=>[p.id,p])),g=p=>p&&h.has(p)?{day:l.date,event:p}:null,T=(p,w)=>d*1440+(p??h.get(w??"")?.start??0)<c;for(let p of l.issues)if(p.level==="problem"){if(!T(p.at,p.event)){r++,p.kind==="unassigned"&&a++;continue}o++,p.kind==="unassigned"&&i++,n.push({key:`${l.date}|${p.key}`,tone:p.kind==="unassigned"?"unassigned":"problem",title:u+p.title,body:p.body,target:g(p.event),suggestions:(p.suggestions??[]).map(w=>({id:w.id,label:w.label,note:w.note}))})}if(l.clashes.forEach((p,w)=>{if(!T(p.a.start,p.a.event)){r++;return}o++;let A=h.get(p.a.event??""),x=ve(s,p.kid),B=(F,ce)=>{let v=g(ce);return v?{text:F,target:v}:F},Y=[];if(p.b.type==="act"){let F=h.get(p.b.event??"");A&&F&&(Y=[B(A.title,A.id),` ${U(A.start)}–${U(A.end)} and `,B(F.title,F.id),` ${U(F.start)}–${U(F.end)} overlap.`])}else{let F=l.rides[p.b.ride??-1];A&&F&&(Y=[`${x} is in `,B(`${me(s,F.driver)}’s car`,F.serves[0]),` ${U(he(p.b.start))}–${U(he(p.b.end))}, during `,B(A.title,A.id),"."])}n.push({key:`${l.date}|clash|${w}`,tone:"problem",title:`${u}${x} is double-booked`,body:Y.map(F=>typeof F=="string"?F:F.text).join(""),parts:Y,target:null,suggestions:[]})}),d>=0&&d<Qr)for(let p of l.issues)p.level!=="heads_up"||!T(p.at,p.event)||n.push({key:`${l.date}|${p.key}`,tone:"heads_up",title:u+p.title,body:p.body,target:g(p.event),suggestions:[]});for(let p of l.events)!p.problems.length||!T(p.start)||n.push({key:`${l.date}|notes|${p.id}`,tone:"heads_up",title:`${u}Check the notes on ${on(s,p)}’s ${p.title}`,body:`These lines couldn’t be read: ${p.problems.join("; ")}`,target:g(p.id),suggestions:[]})}return{items:n,problems:o,unassigned:i,later:r,laterUnassigned:a}}function Hi(s,t){let e=xe(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=$e(t.date,i.date);if(!(r<0))for(let a of Le(s))for(let c of i.drivers[a]?.outings??[]){if(c.start==null)continue;let l=r*1440+c.start;if(r*1440+he(c.end,c.start)<=t.minutes)continue;let u=l-t.minutes,h={driver:a,name:me(s,a),date:i.date,ahead:r,start:c.start,inMinutes:u,ongoing:u<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(g=>e.get(g)??le(0)),warn:c.warn,target:c.target&&i.events.some(g=>g.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(h)<o(n)||o(h)===o(n)&&h.inMinutes<n.inMinutes)&&(n=h)}}return n}function st(s){return s.state==="done"||s.state==="late"}var ta=780;function na(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<ta}function Fi(s,t){return s.chores.map(e=>na(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function Ki(s){return s.state==="open"||s.state==="overdue"}function Xn(s,t,e){if(st(s)){let n=s.done_at?sa(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Yn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Yn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=$e(t,s.due);return`By ${o===1?"tomorrow":o<7?fe(s.due):Jn(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Yn(s.for_day,t)}`;if(s.due&&s.due>t){let n=$e(t,s.due);return n===1?"By tomorrow":`By ${n<7?fe(s.due):Jn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Yn(s,t){let e=$e(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?fe(s):Jn(s)}function Jn(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function sa(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${fe(i)} ${r}`}function Wi(s,t,e=1440){let n=Fi(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(d=>d.kid===o.id),a=new Map;for(let d of r){if(d.state!=="upcoming")continue;let u=d.shows_from??d.due??s.today;a.set(u,[...a.get(u)??[],d])}let c=r.filter(d=>d.state==="overdue"),l=r.filter(d=>d.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??le(i),overdue:c,now:l,done:r.filter(st),later:[...a.entries()].sort(([d],[u])=>d.localeCompare(u)).map(([d,u])=>({date:d,chores:u})),left:c.length+l.length}})}function qi(s,t=1440){return Fi(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Zn(s){return!s.chores.length&&!s.templates.length}var Ve=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Qn(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>Ve.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function es(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Ve[n[0]]}-${Ve[n.at(-1)]}`]:n.map(o=>Ve[o])).join(", ")}var Ge="none";function an(s){return s==="daily"||s==="school"?"":"Any"}function Vi(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Gi(s){let t=s.days??an(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function ts(s){return s.title.trim()?s.who.length?s.days===Ge?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Yi(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function ns(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function ss(s,t,e=1,n=!1,o=!1){if(s==="school"){let d=t.trim().replace(/-/g,"–"),u=o?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return n?`${u}, the night before`:u}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let l=`${a.split(",").map(d=>{let u=d.trim();return u.toLowerCase()==="last"?"the last day":/^\d+$/.test(u)?`the ${ns(Number(u))}`:`the ${u}`}).join(" and ")} ${r}`;return l[0].toUpperCase()+l.slice(1)}function is(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function os(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function ln(s,t){return`${s}|${t}`}function it(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function cn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Ji(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Xi(s,t){return cn(t)<5&&!Ji(s,t)}function $t(s,t,e=new Map){if(!Xi(s,t))return null;let n=ln(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function ot(s,t){return Xi(s,t)?s.menus?.[t]??null:null}var ia="From the school's menu feed.";function oa(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==ia);return t.length?t.join(`
`):null}function _e(s){return s.slice(0,7)}function dn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function rs(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Zi(s){let t=[];for(let e=_e(s.first);e<=_e(s.last);e=rs(e))t.push(e);return t}function Qi(s,t,e,n=new Map){let o=`${e}-01`,i=it(o,-cn(o)),r=[];for(;_e(i)<=e;){let a=[];for(let c=0;c<5;c++){let l=it(i,c),d=_e(l)!==e,u=d?null:Ji(t,l),h=d?null:$t(t,l,n);a.push({date:l,day:Number(l.slice(8)),outside:d,off:u?u.title:null,lunch:h?.lunch??null,picked:h?.picked??!1,menu:d?null:ot(t,l)?.dish??null,sides:d?null:oa(ot(t,l)?.details??""),past:l<s.today,today:l===s.today})}a.some(c=>!c.outside)&&r.push(a),i=it(i,7)}return r}function eo(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function to(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function no(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=it(t,i),a=$t(s,r,n);if(!a)continue;let c=$e(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":fe(r),date:r,menu:ot(s,r)?.dish??null}}return null}var ra={timeline:"timeline",full:"timeline",compact:"compact"};function Et(s){let t=new URLSearchParams(s),e={},n=ra[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),e}var aa=["auth_callback","code","state"];function as(s){let t=new URLSearchParams(s);for(let n of aa)t.delete(n);let e=t.toString();return e?`?${e}`:""}var so=ze`
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
`;var Fo="mydashlight.rides.mode",Nl=1100,zl=440,Ul=700,Hl=3*6e4,Fl=1200;function Kl(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var vn=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,No=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Wl=new URL("emoji.json",import.meta.url).href,zo=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Uo=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Ho=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,ql=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Vl=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Ct={bring:"Bring",buy:"Buy"};function Gl(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Ce(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Cs(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Yl(s,t){return Vn(s,t)||ke(s).split(",")[0]}function Jl(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Xl(){try{return localStorage.getItem(Fo)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Zl(s){try{localStorage.setItem(Fo,s)}catch{}}function yn(s){return s.days.every(t=>!t.events.length)}var At=class extends ye{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Et(location.search).view;this.urlPage=Et(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Hl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Xl(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(l=>l.id===r);(!c||(c.picks[a]??null)===i||!$t(c,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&st(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=zi(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Nl)return!1;let e=this.plan;return!e||this.width-zl>=Fn(De(e).length,Le(e).length)}today(){return ft(this.plan?.time_zone??Kl())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||o!==this.boardKey)&&(this.board=Ni(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let o=this.scroller;if(!o||!this.board)return;let i=this.board.dayHeads.find(r=>r.date===n)?.y??0;o.scrollTop=Math.max(i,Ii(this.board,e)-sn-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let o=this.today();if(e===o.date){this.scrollToNow();return}let i=this.dayIndexOf(e),r=n.days[i];if(!r)return;let a=1/0;if(this.mode==="timeline"){for(let c of r.events)a=Math.min(a,c.arrive_by??c.start);for(let c of Object.values(r.drivers))for(let l of c.outings)l.start!=null&&(a=Math.min(a,l.start))}this.scrollToTime(i*1440+(Number.isFinite(a)?Math.max(0,a-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let l of this.board.dayHeads)l.y<=n+1&&(o=l);let i=this.renderRoot,r=i.querySelector(".pinned .label"),a=i.querySelector(".pinned .tag"),c=i.querySelector(".pinned .sub");r&&r.textContent!==o.label&&(r.textContent=o.label),a&&(a.textContent!==o.tag&&(a.textContent=o.tag),a.hidden=!o.tag),c&&c.textContent!==o.sub&&(c.textContent=o.sub),c?.classList.toggle("warn",o.warn);for(let l of i.querySelectorAll(".day-tile"))l.classList.toggle("in-view",l.dataset.date===o.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof re?r:new re("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??st(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=ot(e,n),r=o.filter(a=>a.id===e.id||i&&ot(a,n)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof re?o:new re("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(ln(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let l of n)a.delete(ln(e,l));this.lunchDraft=a;let c=r instanceof re?r:new re("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Gi(e):Vi(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(Oo(),jo))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ts(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Yi(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof re?n:new re("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof re?n:new re("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?Bi(this.board,n.scrollTop+sn+4):null,this.mode=e,this.urlView||Zl(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof re?i:new re("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o){if(!this.backend)return;let i=this.backend;this.save(`${n}`,o,()=>i.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Fl)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=e?Ui(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},i=this.wide,r=this.chores?qi(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],a=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",l=f`<aside class="panel" aria-label=${c}>
      ${a??(this.sel&&e?this.renderEditor(e):this.renderAttention(o,r))}
    </aside>`,d=this.page==="rides";return f`
      <div class="app ${i?"wide":this.width<Ul?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,o,r.length)} ${d&&e?this.renderWeek(e):_}
          ${d?this.renderBanner(e):_}
          <main>
            ${d?f`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?yn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:this.page==="lunch"?f`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!i&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${l}`:_}
          </main>
        </div>
        ${i?l:_}
        ${this.toast?f`<div class="toast" role="status">${this.toast}</div>`:_}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),a="";if(e){let h=e.time_zone,g=new Date(e.updated);this.error?a=f`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Ot(g,new Date,h)}</span>`:e.status&&!e.status.ok?a=f`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Ot(g,new Date,h)}</span>`:this.backend?.live||(a=`Updated ${Ot(g,new Date,h)}`)}let c=(h,g,T,p)=>f`
      <button type="button" class="seg-btn" title=${p} aria-pressed=${this.mode===h?"true":"false"} @click=${()=>this.setMode(h)}>
        ${T}<span class="seg-label">${g}</span>
      </button>
    `,l=(h,g,T)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===h?"true":"false"} @click=${()=>this.setPage(h)}>
        ${T}<span class="seg-label">${g}</span>
      </button>
    `,d=pt(r.minutes),u=!!e&&yn(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ae`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:_}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ke(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">${ke(r.date)}</p>
          ${a?f`<p class="status">${a}</p>`:_}
        </div>
        ${e&&!u?this.renderNext(e,Hi(e,r),n):_}
        <div class="controls">
          ${this.wide||u&&!o?_:f`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?_:f`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${l("rides","Rides",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${l("chores","Chores",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?_:l("lunch","Lunch",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let l=this.today().date,d=o.unassigned,u=o.laterUnassigned;if(d){let g=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?f`<div class="next idle needs">${g}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${g}</button>`}if(u)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${u} ${u===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let h=e.days.some(g=>g.date>=l&&g.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${h?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${h?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${gt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${fe(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=f`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Ce(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(l=>f`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
      </span>
      ${n.warn?f`<span class="next-stop warn">${n.warn}</span>`:n.stop?f`<span class="next-stop">${n.stop}</span>`:_}
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?f`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:f`<div class=${c}>${a}</div>`}renderWeek(e){let n=this.today().date,o=xe(e);return f`<nav class="week" aria-label="Days">
      ${e.days.map(i=>{let r=qn(i),a=i.events.length,c=i.events.slice(0,6).map(d=>d.own?rn.color:o.get(d.kid)?.color??le(0).color),l=`${ke(i.date)}: ${a?`${a} ${a===1?"activity":"activities"}`:"nothing planned"}${r?`, ${r} to sort out`:""}`;return f`<button
          type="button"
          class="day-tile ${i.date===n?"today":""}"
          data-date=${i.date}
          aria-label=${l}
          @click=${()=>this.goToDay(i.date)}
        >
          <span class="dt-wd">${i.date===n?"Today":fe(i.date)}</span>
          <span class="dt-num">${Number(i.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${c.length?c.map(d=>f`<span class="dt-dot" style="background:${d}"></span>`):f`<span class="dt-free">free</span>`}
            ${a>6?f`<span class="dt-more">+${a-6}</span>`:_}
          </span>
          ${r?f`<span class="dt-badge" aria-hidden="true">${r}</span>`:_}
        </button>`})}
    </nav>`}renderQuiet(e){let n=De(e),o=Le(e),i=xe(e),r=n.map(a=>ve(e,a));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>ae`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Jl(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=i.get(a);return f`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Ce(ve(e,a))}</span>
            <span class="qw-name">${ve(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Ce(me(e,a))}</span>
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
    </div>`:_}renderEmpty(){return this.error?f`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:f`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,o=l=>!!l&&!!n&&l.day===n.day&&l.event===n.event,i=e.dayHeads[0],r=e.width,a=100,c=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??a-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??a})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??a+1}))].sort((l,d)=>l.z-d.z);return f`
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
              <span class="avatar ${l.kind}" aria-hidden="true">${Ce(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0):_}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${r}px">
          <span class="label">${i?.label??""}</span><span class="tag" ?hidden=${!i?.tag}>${i?.tag??""}</span
          ><span class="sub ${i?.warn?"warn":""}">${i?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(l=>f`<div
                class="col-bg ${l.kind}"
                style="left:${l.x}px;width:${l.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${l.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(l=>f`<div class="day-head" style="top:${l.y}px;width:${r}px">
              <span class="label">${l.label}</span>${l.tag?f`<span class="tag">${l.tag}</span>`:_}<span
                class="sub ${l.warn?"warn":""}"
                >${l.sub}</span
              >
            </div>`)}
          ${e.empties.map(l=>f`<span class="empty" style="top:${l.y}px">${l.text}</span>`)}
          ${e.grid.map(l=>f`<div class="grid ${l.strong?"strong":""}" style="top:${l.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(l=>f`<span class="hour" style="top:${l.y}px">${l.label}</span>`)}
          ${Pe(e.bands,l=>l.key,l=>f`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Pe(e.busy,l=>l.key,l=>f`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Pe(e.windows,l=>l.key,l=>f`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Pe(c,l=>l.x.key,l=>{if(l.t==="link"){let g=l.x;return f`<div
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
                  <span class="l1">${g.l1}</span>${g.show2?f`<span class="l2" style="-webkit-line-clamp:${g.lines2}">${g.l2}</span>`:_}
                </button>`}let d=l.x,u=d.color,h=d.skipped?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.10) 0px, rgba(${u.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:d.stayed?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.24) 0px, rgba(${u.rgb},0.24) 6px, rgba(${u.rgb},0.08) 6px, rgba(${u.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${u.rgb},0.15), rgba(${u.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${d.wrap?"wrap":""} ${o(d.target)?"sel":""} ${d.clash?"clash":""} ${d.skipped?"skipped":""}"
                aria-label=${d.aria}
                style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:${h};border-color:${d.clash?"var(--bad)":`rgba(${u.rgb},0.45)`};--c:${u.color};--rgb:${u.rgb};--ring:${u.color}"
                @click=${()=>this.open(d.target)}
              >
                <span class="top">
                  <span class="title">${d.title}</span>
                  <span class="time">${d.time}</span>
                  ${d.showDrop&&d.drop?f`<span class="line tone-${d.drop.tone}">${d.drop.text}</span>`:_}
                </span>
                ${d.showPick&&d.pick?f`<span class="line tone-${d.pick.tone}">${d.pick.text}</span>`:_}
              </button>`})}
          ${Pe(e.stays,l=>l.key,l=>f`<button
                type="button"
                class="stay"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Pe(e.trips,l=>l.key,l=>f`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(d=>f`<span class="kid-dot" style="background:${d}"></span>`)}</span>
                ${l.show2?f`<span class="l2">${l.l2}</span>`:_}
                ${l.stops?l.stops.map(d=>f`<span class="stop ${d.warn?"warn":""}">${d.text}</span>`):_}
                ${l.show3?f`<span class="l3">${l.l3}</span>`:_}
              </button>`)}
          ${Pe(e.overlaps,l=>l.key,l=>f`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Pe(e.marks,l=>l.key,l=>f`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:_}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,a=this.plan,c=i+n.length,l=this.chores,d=!!l&&!Zn(l);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?_:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?f`<div class="attn-chores">${n.map(u=>this.renderChoreRow(u,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${ae`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${yn(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:_}
      ${o.map(u=>f`<div class="issue ${u.tone}">
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
              </div>`:_}
        </div>`)}
      ${this.wide&&a&&!yn(a)&&this.page==="rides"?this.renderLegend():_}
    `}kidColorOf(e){let n=this.plan?xe(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return le(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(l=>l.id===e);if(!o||!i)return _;this.tick;let r=this.today(),a=no(i,r.date,r.minutes,this.lunchDraft);if(!a)return _;let c=Ct[a.lunch];return f`<span class="lunch-chip ${a.lunch} ${n?"small":""}" title=${`${c} lunch ${a.when}${a.menu?`: ${a.menu}`:""}`}
      >${a.lunch==="bring"?Uo:Ho}<span class="lunch-chip-text"
        >${c}${n?_:` ${a.when}`}${!n&&a.menu?f`<span class="lunch-chip-menu"> · ${a.menu}</span>`:_}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return f`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Zi(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:_e(e.today),i=n.indexOf(o),r=d=>{let u=n[i+d];u&&(this.lunchMonth=u)},a=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(d=>d.id===a):e.kids,l=e.status&&!e.status.ok?f`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:_;return f`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${ae`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${dn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${ae`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":f`${No} Edit menus`}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),a=Qi(e,n,o,this.lunchDraft),c=to(a),l=a.flat(),d=l.filter(p=>!p.outside&&!p.past&&p.lunch),u=n.days_off.filter(p=>_e(p.first)<=o&&o<=_e(p.last)),h=p=>d.filter(w=>cn(w.date)===p),g=p=>{let w=h(p);if(!w.length)return;let A=w.every(x=>x.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,w.map(x=>x.date),A)},T=d.length?`${c.bring} Bring · ${c.buy} Buy${o===_e(e.today)?" left this month":""}`:"No school days left this month";return f`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Ce(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${T}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Ct[n.default]} unless picked</span>
          ${e.kids.length<2?_:f`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?Vl:ql}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?f`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:_}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${dn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((p,w)=>f`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!h(w).length}
            aria-label=${`${h(w).every(A=>A.lunch==="bring")?"Buy":"Bring"} every ${p} left in ${dn(o)} for ${n.name}`}
            @click=${()=>g(w)}
          >
            ${p}
          </button>`)}
        ${l.map(p=>this.renderLunchCell(n,p,i))}
      </div>
      ${u.length?f`<p class="lunch-offs">
            No school:
            ${u.map(p=>{let w=p.first<`${o}-01`?`${o}-01`:p.first,A=_e(p.last)>o?it(`${rs(o)}-01`,-1):p.last;return`${w===A?Cs(w):`${Cs(w)}–${Cs(A)}`} ${eo(p.title)}`}).join(" · ")}
          </p>`:_}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return f`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return f`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,l=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${ke(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${ke(n.date)}: ${Ct[i]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Ct[r]}.`;return f`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${l?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?Uo:Ho}${Ct[i]}</span>
      ${n.menu?f`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?f`<span class="lunch-sides">${n.sides}</span>`:_}`:c?f`<span class="lunch-menu add">${vn} Menu</span>`:_}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(A=>A.id===e.kid),a=(this.plan?xe(this.plan).get(e.kid):void 0)??le(Math.max(0,r)),c=o.kids[r]?.name??"",l=i===st(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},d=i&&l.done_by&&l.done_by!==e.kid?o.people?.find(A=>A.id===l.done_by)?.name??l.done_by_name??null:null,u=`${Xn(l,o.today,o.time_zone)}${d?` · by ${d}`:""}`,h=i||Ki(e),g=`${n?`${c}: `:""}${e.title}. ${u?`${u}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,T=f`<span class="box" aria-hidden="true"
        >${i?ae`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:_}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:_}
      <span class="chore-text">
        <span class="chore-title">${n?f`<span class="chore-kid">${c}</span> · `:_}${e.title}</span>
        ${u?f`<span class="chore-note">${u}</span>`:_}
      </span>`,p=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${h?"":"later"}`,w=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return h?f`<button type="button" class=${p} style=${w} aria-pressed=${i?"true":"false"} aria-label=${g} @click=${()=>this.tapChore(e)}>
          ${T}
        </button>`:f`<div class=${p} style=${w}>${T}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
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
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?f`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:_;this.tick;let i=Wi(e,this.plan?xe(this.plan):void 0,this.today().minutes);return f`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${vn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${No} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return f`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Ce(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?f`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:_}
            ${r.now.length?f`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:_}
            ${r.done.length?f`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:_}
            ${r.later.map(c=>f`<h3 class="chore-group">${c.date===e.today?"Later today":Yl(c.date,e.today)}</h3>
                ${c.chores.map(l=>this.renderChoreRow(l))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?f`<p class="chore-none">No chores this week.</p>`:_}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?xe(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?f`<span class="tmpl-note bad">${e.problems.map(os).join(" · ")} · tap to set up</span>`:f`<span class="tmpl-note">${is(e.who,o,e.take_turns)} · ${ss(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return f`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?f` <span class="tag-paused">Paused</span>`:_}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let l=o.findIndex(u=>u.id===c),d=i?.get(c)??le(Math.max(0,l));return f`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return f`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${vn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?f`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:_}):f`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return f``;let o=n.kids,i=this.plan?xe(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(p=>p.id===e.template):void 0,c=ts(e),l=(a?.problems??[]).filter(p=>p!=="who:"),d=(p,w,A,x=!1)=>f`<button type="button" class="choice ${x?"wide":""}" aria-pressed=${p?"true":"false"} ?disabled=${r} @click=${A}>${w}</button>`,u=(p,w,A,x)=>f`<button type="button" class="chip" aria-pressed=${p?"true":"false"} aria-label=${x??_} ?disabled=${r} @click=${A}>${w}</button>`,h=p=>{p!==e.repeats&&this.changeDraft({repeats:p,days:a&&a.repeats===p?a.days??an(p):an(p)})},g=p=>{let w=e.who.includes(p)?e.who.filter(A=>A!==p):o.filter(A=>A.id===p||e.who.includes(A.id)).map(A=>A.id);this.changeDraft({who:w})},T;if(e.repeats==="school"){let p=e.days===Ge?new Set:e.days===""?new Set([0,1,2,3,4]):Qn(e.days)??new Set,w=A=>{let x=new Set(p);x.has(A)?x.delete(A):x.add(A),this.changeDraft({days:x.size===5?"":x.size?es(x):Ge})};T=f`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Ve.slice(0,5).map((A,x)=>u(p.has(x),A.slice(0,2),()=>w(x),A))}
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
        </div>`}else if(e.repeats==="monthly"){let p=e.days.trim(),w=/^\d+$/.test(p)?Number(p):null,A=p&&p.toLowerCase()!=="any"&&p.toLowerCase()!=="last"&&w===null;T=f`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${A?4:3}, minmax(0, 1fr))">
          ${d(p===""||p.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d(w!==null,"On a date",()=>this.changeDraft({days:String(w??1)}))}
          ${d(p.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${A?d(!0,p,()=>{}):_}
        </div>
        ${w!==null?f`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||w<=1} @click=${()=>this.changeDraft({days:String(w-1)})}>−</button>
                <span class="arrive-value">${ns(w)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||w>=31} @click=${()=>this.changeDraft({days:String(w+1)})}>+</button>
              </span>
            </div>`:f`<p class="field-hint">${p.toLowerCase()==="last"?"Due on the month’s last day.":A?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")T=f`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let p=e.days===""||e.days.toLowerCase()==="any",w=e.days===Ge?new Set:p?new Set:Qn(e.days)??new Set,A=x=>{let B=new Set(w);B.has(x)?B.delete(x):B.add(x),this.changeDraft({days:B.size?es(B)||"Mon-Sun":Ge})};T=f`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(p,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!p,"On set days",()=>this.changeDraft({days:p?"Sat":e.days}))}
        </div>
        ${p?f`<p class="field-hint">Shows all week, due on Sunday.</p>`:f`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Ve.map((x,B)=>u(w.has(B),x.slice(0,2),()=>A(B),x))}
              </div>
              <div class="chips">
                ${u(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${u(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:_}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?is(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===Ge?"No days picked":ss(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${l.length?f`<p class="field-hint bad">${l.map(os).join(". ")}. Saving fixes it.</p>`:_}
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
          ${zo.map(p=>u(e.icon===p,p,()=>this.changeDraft({icon:e.icon===p?null:p}),`Picture ${p}`))}
          ${e.icon&&!zo.includes(e.icon)?u(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):_}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?f`<emoji-picker
              class="emoji-more"
              .dataSource=${Wl}
              @emoji-click=${p=>{let w=p.detail.unicode;w&&this.changeDraft({icon:w}),this.iconMore=!1}}
            ></emoji-picker>`:_}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((p,w)=>{let A=i?.get(p.id)??le(w),x=e.who.includes(p.id);return f`<button type="button" class="who-chip" style="--c:${A.color};--rgb:${A.rgb}" aria-pressed=${x?"true":"false"} ?disabled=${r} @click=${()=>g(p.id)}>
              <span class="avatar" aria-hidden="true">${Ce(p.name)}</span>${p.name}
            </button>`})}
        </div>
        ${e.who.length>1?f`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${d(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${d(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:_}
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
      ${T}
      ${e.repeats==="school"?_:f`<div class="field arrive every-row">
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
            </button>`:_}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return f``;let o=e.busy,i=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>i({kids:e.kids.includes(d)?e.kids.filter(u=>u!==d):[...e.kids,d]}),a=n.kids.filter(d=>$t(d,e.date)),c=e.dish.trim(),l=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${ke(e.date)}</span>
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
          ${a.map(d=>{let u=this.kidColorOf(d.id),h=e.kids.includes(d.id);return f`<button type="button" class="who-chip" style="--c:${u.color};--rgb:${u.rgb}" aria-pressed=${h?"true":"false"} ?disabled=${o} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${Ce(d.name)}</span>${d.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?f`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:_}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!l} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":l??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return f``;let o=n.people?.length?n.people:n.kids.map(u=>({...u,role:"kid"})),i=n.kids.findIndex(u=>u.id===e.kid),r=n.kids[i],a=this.plan?xe(this.plan):void 0,c=a?.get(e.kid)??le(Math.max(0,i)),l=o.filter(u=>u.id!==e.kid),d=u=>{let h=n.kids.findIndex(g=>g.id===u.id);return h>=0?(a?.get(u.id)??le(h)).color:"var(--dark)"};return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:_}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Xn(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Ce(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?f`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${l.map(u=>f`<button type="button" class="done-by" style="--c:${d(u)}" @click=${()=>void this.toggleChore(e,u.id)}>
                  <span class="avatar ${u.role==="parent"?"driver":""}" aria-hidden="true">${Ce(u.name)}</span>
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
    </div>`}ownHint(e,n){let o=on(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${U(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${U(n.start)} to ${U(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>Le(e).includes(r)?me(e,r):ve(e,r));return`${o} drives there and back${i.length?`, with ${Wn(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return f``;let{day:o,event:i}=n,r=Le(e),a=Ri(e,i),c=on(e,i),l=!!this.pending,d=R=>this.pending?.key===R?this.pending.value:void 0,u=[...e.people?.carpools??[]];for(let R of e.days)for(let Z of R.events)for(let W of[Z.drop,Z.pick])W&&W!=="none"&&!r.includes(W)&&!u.some(ge=>ge.toLowerCase()===W.toLowerCase())&&u.push(W);let h=R=>{if(!i.sides.includes(R))return _;let Z=d(R),W=Z!==void 0?String(Z):R==="drop"?i.drop:i.pick,ge=W&&W!=="none"&&!r.includes(W)?W:"",ue=C=>this.setRide(i,R,W===C?"":C),m=[...r.map(C=>[C,Kn(e,C)]),["none","Not needed"]];return f`<div class="field">
        <span class="field-label">${R==="drop"?"Drop-off":"Pick-up"} ${W===""?f`<span class="nobody">· nobody yet</span>`:_}</span>
        <div role="group" aria-label=${R==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${m.length}, minmax(0, 1fr))">
          ${m.map(([C,H])=>f`<button type="button" class="choice" aria-pressed=${W===C?"true":"false"} ?disabled=${l} @click=${()=>ue(C)}>
                ${H}
              </button>`)}
        </div>
        ${u.length?f`<div role="group" aria-label=${R==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${u.map(C=>f`<button type="button" class="chip" aria-pressed=${W.toLowerCase()===C.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>ue(C)}>
                    ${C}
                  </button>`)}
            </div>`:_}
        <input
          type="text"
          .value=${ge&&!u.some(C=>C.toLowerCase()===ge.toLowerCase())?ge:""}
          ?disabled=${l}
          aria-label=${R==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${C=>{let H=C.target.value.trim();H&&H!==W&&this.setRide(i,R,H)}}
          @keydown=${C=>{C.key==="Enter"&&C.target.blur()}}
        />
        ${!p&&W!==""&&W!=="none"?g(R,W):_}
      </div>`},g=(R,Z)=>{let W=d(`along-${R}`),ge=W!==void 0?W:R==="pick"?i.pick_along??[]:i.along,ue=[...De(e).filter(C=>C!==i.kid),...r.filter(C=>C!==Z)];return ue.length?f`<div class="field-sub">
        <span class="field-label">${R==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${R==="pick"?"They come for the pick-up":"They leave home in the same car"}</span></span>
        <div role="group" aria-label=${R==="drop"?"Riding along on the drop-off":R==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${ue.map(C=>f`<button type="button" class="chip" aria-pressed=${ge.includes(C)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(i,C,R)}>
              ${r.includes(C)?me(e,C):ve(e,C)}
            </button>`)}
        </div>
      </div>`:_},T=d("stay"),p=T!==void 0?!!T:i.stay,w=i.drop===i.pick&&r.includes(i.drop),A=d("along"),x=A!==void 0?A:i.along,B=i.own?[...De(e),...r.filter(R=>R!==i.own)]:[],Y=i.own!=null&&i.takes!=null,F=i.own!=null&&!Y,ce=d("takes"),v=ce!==void 0?ce:i.takes??null,E=d("arrive"),y=this.arriveDraft!==void 0?this.arriveDraft:E!==void 0?E:i.arrive_by,k=[],$=R=>R==="none"?"Not needed":Kn(e,R),D=R=>r.includes(R)?me(e,R):ve(e,R),I=(R,Z,W)=>{Z===""&&!W.length||k.push(`${R}: ${[Z===""?"TBD":$(Z),...W.map(D)].join(", ")}`)};i.own||I("Drop-off",i.drop,i.along),i.own||I("Pick-up",i.pick,i.pick_along??[]),!i.own&&i.stay&&k.push("Stay: yes"),Y&&k.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&k.push(`Take along: ${i.along.map(D).join(", ")}`),i.arrive_by!=null&&k.push(`Arrive by: ${pt(i.arrive_by)}`);let q=d("attending"),J=q!==void 0?!!q:i.attending!==!1;i.attending===!1&&k.splice(0,k.length,"Attending: no");let ee=o.date===this.today().date?"":`${fe(o.date)} · `,O=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${ee}${Y?"any time ":""}${U(i.start)}–${U(i.end)}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return i.where==="home"?f`${O}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${O}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:_}
      ${i.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${fe(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:_}
      <div class="field">
        <span class="field-label">${c} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${J?"true":"false"} ?disabled=${l} @click=${()=>this.setAttending(i,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${J?"false":"true"} ?disabled=${l} @click=${()=>this.setAttending(i,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${J?f`${i.where==="anywhere"?f`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:_}
            ${i.own?f`<p class="field-hint">${this.ownHint(e,i)}</p>`:f`${h("drop")} ${h("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${p?"true":"false"} ?disabled=${!w||l} @click=${()=>this.toggleStay(i)}>
                      ${w?p?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                    ${p&&w?g("both",i.drop):_}
                  </div>`}
      ${i.own?f`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${v!=null?`Takes ${v} min, any time ${U(i.start)}–${U(i.end)}`:"At its set time"}</span>
            </span>
            ${v!=null?f`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${l||v<=5} @click=${()=>this.setTakes(i,Math.max(5,v-5))}>−</button>
                  <span class="arrive-value">${v} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${l||v+5>i.end-i.start} @click=${()=>this.setTakes(i,v+5)}>+</button>
                </span>`:_}
          </div>
          <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setTakes(i,v!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${v!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:_}
      ${F&&B.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${B.map(R=>f`<button type="button" class="chip" aria-pressed=${x.includes(R)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(i,R)}>
                  ${r.includes(R)?me(e,R):ve(e,R)}
                </button>`)}
            </div>
          </div>`:_}
      ${Y?_:f`<div class="field arrive">
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
      ${y!=null?f`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:_}`}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${k.length?k.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:_}
      ${J&&!i.own?f`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:_}
    `}};At.styles=so,At.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",At);function Ql(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function Ko(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=i=>{if(i)for(let r of Ql())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),s)}var Wo=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],qo=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Vo(s,t,e,n){let o=Math.max(0,Math.min(t,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+n+s.slice(i),caret:o+n.length}}function Go(s,t,e){let n=Math.max(0,Math.min(t,s.length)),o=Math.max(n,Math.min(e,s.length));if(n!==o)return{value:s.slice(0,n)+s.slice(o),caret:n};if(n===0)return{value:s,caret:0};let i=Array.from(s.slice(0,n));i.pop();let r=i.join("");return{value:r+s.slice(n),caret:r.length}}function Yo(s,t){return t===0||/\s$/.test(s.slice(0,t))}var ec=new Set(["text","search","email","url","tel","number","password"]);function Jo(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&ec.has(s.type)&&!s.readOnly&&!s.disabled}var tc={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},nc={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},St=class extends ye{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=Yo(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(n),r=Go(n.value,o,i);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(n),a=Vo(n.value,i,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":tc[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${nc[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):_}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?Wo:qo;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>f`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};St.styles=ze`
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
  `,St.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",St);function sc(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function Xo(s){let t=new WeakSet,e=r=>{let a=r.composedPath();i(a);let c=a[0];Jo(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=sc();!s.target||r===s.target||(Jo(r)?s.attach(r):s.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var As="mydashlight",ic=`/api/${As}/pair`,oc=`/api/${As}/pair/poll`,Ss=`/${As}`,Ms="pair";function Zo(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Qo(s,t){return`${s}${Ss}?${Ms}=${encodeURIComponent(t)}`}function rc(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var Qe=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function er(s=fetch){let t=await s(ic,{method:"POST",cache:"no-store"});if(t.status===429)throw new Qe("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new Qe(`Home Assistant answered ${t.status}.`);return await t.json()}async function tr(s,t,e=fetch){let n=await e(oc,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new Qe(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:rc(t,o.auth)}:{status:"pending"}}var dt=function(s,t){let o=s,i=Mt[t],r=null,a=0,c=null,l=[],d={},u=function(v,E){a=o*4+17,r=(function(y){let k=new Array(y);for(let $=0;$<y;$+=1){k[$]=new Array(y);for(let D=0;D<y;D+=1)k[$][D]=null}return k})(a),h(0,0),h(a-7,0),h(0,a-7),p(),T(),A(v,E),o>=7&&w(v),c==null&&(c=Y(o,i,l)),x(c,E)},h=function(v,E){for(let y=-1;y<=7;y+=1)if(!(v+y<=-1||a<=v+y))for(let k=-1;k<=7;k+=1)E+k<=-1||a<=E+k||(0<=y&&y<=6&&(k==0||k==6)||0<=k&&k<=6&&(y==0||y==6)||2<=y&&y<=4&&2<=k&&k<=4?r[v+y][E+k]=!0:r[v+y][E+k]=!1)},g=function(){let v=0,E=0;for(let y=0;y<8;y+=1){u(!0,y);let k=je.getLostPoint(d);(y==0||v>k)&&(v=k,E=y)}return E},T=function(){for(let v=8;v<a-8;v+=1)r[v][6]==null&&(r[v][6]=v%2==0);for(let v=8;v<a-8;v+=1)r[6][v]==null&&(r[6][v]=v%2==0)},p=function(){let v=je.getPatternPosition(o);for(let E=0;E<v.length;E+=1)for(let y=0;y<v.length;y+=1){let k=v[E],$=v[y];if(r[k][$]==null)for(let D=-2;D<=2;D+=1)for(let I=-2;I<=2;I+=1)D==-2||D==2||I==-2||I==2||D==0&&I==0?r[k+D][$+I]=!0:r[k+D][$+I]=!1}},w=function(v){let E=je.getBCHTypeNumber(o);for(let y=0;y<18;y+=1){let k=!v&&(E>>y&1)==1;r[Math.floor(y/3)][y%3+a-8-3]=k}for(let y=0;y<18;y+=1){let k=!v&&(E>>y&1)==1;r[y%3+a-8-3][Math.floor(y/3)]=k}},A=function(v,E){let y=i<<3|E,k=je.getBCHTypeInfo(y);for(let $=0;$<15;$+=1){let D=!v&&(k>>$&1)==1;$<6?r[$][8]=D:$<8?r[$+1][8]=D:r[a-15+$][8]=D}for(let $=0;$<15;$+=1){let D=!v&&(k>>$&1)==1;$<8?r[8][a-$-1]=D:$<9?r[8][15-$-1+1]=D:r[8][15-$-1]=D}r[a-8][8]=!v},x=function(v,E){let y=-1,k=a-1,$=7,D=0,I=je.getMaskFunction(E);for(let q=a-1;q>0;q-=2)for(q==6&&(q-=1);;){for(let J=0;J<2;J+=1)if(r[k][q-J]==null){let ee=!1;D<v.length&&(ee=(v[D]>>>$&1)==1),I(k,q-J)&&(ee=!ee),r[k][q-J]=ee,$-=1,$==-1&&(D+=1,$=7)}if(k+=y,k<0||a<=k){k-=y,y=-y;break}}},B=function(v,E){let y=0,k=0,$=0,D=new Array(E.length),I=new Array(E.length);for(let O=0;O<E.length;O+=1){let R=E[O].dataCount,Z=E[O].totalCount-R;k=Math.max(k,R),$=Math.max($,Z),D[O]=new Array(R);for(let m=0;m<D[O].length;m+=1)D[O][m]=255&v.getBuffer()[m+y];y+=R;let W=je.getErrorCorrectPolynomial(Z),ue=Pt(D[O],W.getLength()-1).mod(W);I[O]=new Array(W.getLength()-1);for(let m=0;m<I[O].length;m+=1){let C=m+ue.getLength()-I[O].length;I[O][m]=C>=0?ue.getAt(C):0}}let q=0;for(let O=0;O<E.length;O+=1)q+=E[O].totalCount;let J=new Array(q),ee=0;for(let O=0;O<k;O+=1)for(let R=0;R<E.length;R+=1)O<D[R].length&&(J[ee]=D[R][O],ee+=1);for(let O=0;O<$;O+=1)for(let R=0;R<E.length;R+=1)O<I[R].length&&(J[ee]=I[R][O],ee+=1);return J},Y=function(v,E,y){let k=nr.getRSBlocks(v,E),$=sr();for(let I=0;I<y.length;I+=1){let q=y[I];$.put(q.getMode(),4),$.put(q.getLength(),je.getLengthInBits(q.getMode(),v)),q.write($)}let D=0;for(let I=0;I<k.length;I+=1)D+=k[I].dataCount;if($.getLengthInBits()>D*8)throw"code length overflow. ("+$.getLengthInBits()+">"+D*8+")";for($.getLengthInBits()+4<=D*8&&$.put(0,4);$.getLengthInBits()%8!=0;)$.putBit(!1);for(;!($.getLengthInBits()>=D*8||($.put(236,8),$.getLengthInBits()>=D*8));)$.put(17,8);return B($,k)};d.addData=function(v,E){E=E||"Byte";let y=null;switch(E){case"Numeric":y=ac(v);break;case"Alphanumeric":y=lc(v);break;case"Byte":y=cc(v);break;case"Kanji":y=dc(v);break;default:throw"mode:"+E}l.push(y),c=null},d.isDark=function(v,E){if(v<0||a<=v||E<0||a<=E)throw v+","+E;return r[v][E]},d.getModuleCount=function(){return a},d.make=function(){if(o<1){let v=1;for(;v<40;v++){let E=nr.getRSBlocks(v,i),y=sr();for(let $=0;$<l.length;$++){let D=l[$];y.put(D.getMode(),4),y.put(D.getLength(),je.getLengthInBits(D.getMode(),v)),D.write(y)}let k=0;for(let $=0;$<E.length;$++)k+=E[$].dataCount;if(y.getLengthInBits()<=k*8)break}o=v}u(!1,g())},d.createTableTag=function(v,E){v=v||2,E=typeof E>"u"?v*4:E;let y="";y+='<table style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: "+E+"px;",y+='">',y+="<tbody>";for(let k=0;k<d.getModuleCount();k+=1){y+="<tr>";for(let $=0;$<d.getModuleCount();$+=1)y+='<td style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: 0px;",y+=" width: "+v+"px;",y+=" height: "+v+"px;",y+=" background-color: ",y+=d.isDark(k,$)?"#000000":"#ffffff",y+=";",y+='"/>';y+="</tr>"}return y+="</tbody>",y+="</table>",y},d.createSvgTag=function(v,E,y,k){let $={};typeof arguments[0]=="object"&&($=arguments[0],v=$.cellSize,E=$.margin,y=$.alt,k=$.title),v=v||2,E=typeof E>"u"?v*4:E,y=typeof y=="string"?{text:y}:y||{},y.text=y.text||null,y.id=y.text?y.id||"qrcode-description":null,k=typeof k=="string"?{text:k}:k||{},k.text=k.text||null,k.id=k.text?k.id||"qrcode-title":null;let D=d.getModuleCount()*v+E*2,I,q,J,ee,O="",R;for(R="l"+v+",0 0,"+v+" -"+v+",0 0,-"+v+"z ",O+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',O+=$.scalable?"":' width="'+D+'px" height="'+D+'px"',O+=' viewBox="0 0 '+D+" "+D+'" ',O+=' preserveAspectRatio="xMinYMin meet"',O+=k.text||y.text?' role="img" aria-labelledby="'+F([k.id,y.id].join(" ").trim())+'"':"",O+=">",O+=k.text?'<title id="'+F(k.id)+'">'+F(k.text)+"</title>":"",O+=y.text?'<description id="'+F(y.id)+'">'+F(y.text)+"</description>":"",O+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',O+='<path d="',J=0;J<d.getModuleCount();J+=1)for(ee=J*v+E,I=0;I<d.getModuleCount();I+=1)d.isDark(J,I)&&(q=I*v+E,O+="M"+q+","+ee+R);return O+='" stroke="transparent" fill="black"/>',O+="</svg>",O},d.createDataURL=function(v,E){v=v||2,E=typeof E>"u"?v*4:E;let y=d.getModuleCount()*v+E*2,k=E,$=y-E;return fc(y,y,function(D,I){if(k<=D&&D<$&&k<=I&&I<$){let q=Math.floor((D-k)/v),J=Math.floor((I-k)/v);return d.isDark(J,q)?0:1}else return 1})},d.createImgTag=function(v,E,y){v=v||2,E=typeof E>"u"?v*4:E;let k=d.getModuleCount()*v+E*2,$="";return $+="<img",$+=' src="',$+=d.createDataURL(v,E),$+='"',$+=' width="',$+=k,$+='"',$+=' height="',$+=k,$+='"',y&&($+=' alt="',$+=F(y),$+='"'),$+="/>",$};let F=function(v){let E="";for(let y=0;y<v.length;y+=1){let k=v.charAt(y);switch(k){case"<":E+="&lt;";break;case">":E+="&gt;";break;case"&":E+="&amp;";break;case'"':E+="&quot;";break;default:E+=k;break}}return E},ce=function(v){v=typeof v>"u"?2:v;let y=d.getModuleCount()*1+v*2,k=v,$=y-v,D,I,q,J,ee,O={"██":"█","█ ":"▀"," █":"▄","  ":" "},R={"██":"▀","█ ":"▀"," █":" ","  ":" "},Z="";for(D=0;D<y;D+=2){for(q=Math.floor((D-k)/1),J=Math.floor((D+1-k)/1),I=0;I<y;I+=1)ee="█",k<=I&&I<$&&k<=D&&D<$&&d.isDark(q,Math.floor((I-k)/1))&&(ee=" "),k<=I&&I<$&&k<=D+1&&D+1<$&&d.isDark(J,Math.floor((I-k)/1))?ee+=" ":ee+="█",Z+=v<1&&D+1>=$?R[ee]:O[ee];Z+=`
`}return y%2&&v>0?Z.substring(0,Z.length-y-1)+Array(y+1).join("▀"):Z.substring(0,Z.length-1)};return d.createASCII=function(v,E){if(v=v||1,v<2)return ce(E);v-=1,E=typeof E>"u"?v*2:E;let y=d.getModuleCount()*v+E*2,k=E,$=y-E,D,I,q,J,ee=Array(v+1).join("██"),O=Array(v+1).join("  "),R="",Z="";for(D=0;D<y;D+=1){for(q=Math.floor((D-k)/v),Z="",I=0;I<y;I+=1)J=1,k<=I&&I<$&&k<=D&&D<$&&d.isDark(q,Math.floor((I-k)/v))&&(J=0),Z+=J?ee:O;for(q=0;q<v;q+=1)R+=Z+`
`}return R.substring(0,R.length-1)},d.renderTo2dContext=function(v,E){E=E||2;let y=d.getModuleCount();for(let k=0;k<y;k++)for(let $=0;$<y;$++)v.fillStyle=d.isDark(k,$)?"black":"white",v.fillRect($*E,k*E,E,E)},d};dt.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};dt.createStringToBytes=function(s,t){let e=(function(){let o=hc(s),i=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let l=i(),d=i(),u=i(),h=String.fromCharCode(c<<8|l),g=d<<8|u;a[h]=g,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(n)}}return i}};var pe={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Mt={L:1,M:0,Q:3,H:2},Be={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},je=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(t)>=0;)a^=t<<i(a)-i(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case Be.PATTERN000:return function(a,c){return(a+c)%2==0};case Be.PATTERN001:return function(a,c){return a%2==0};case Be.PATTERN010:return function(a,c){return c%3==0};case Be.PATTERN011:return function(a,c){return(a+c)%3==0};case Be.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Be.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Be.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Be.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=Pt([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Pt([1,Oe.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case pe.MODE_NUMBER:return 10;case pe.MODE_ALPHA_NUM:return 9;case pe.MODE_8BIT_BYTE:return 8;case pe.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case pe.MODE_NUMBER:return 12;case pe.MODE_ALPHA_NUM:return 11;case pe.MODE_8BIT_BYTE:return 16;case pe.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case pe.MODE_NUMBER:return 14;case pe.MODE_ALPHA_NUM:return 13;case pe.MODE_8BIT_BYTE:return 16;case pe.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1){let g=0,T=r.isDark(u,h);for(let p=-1;p<=1;p+=1)if(!(u+p<0||a<=u+p))for(let w=-1;w<=1;w+=1)h+w<0||a<=h+w||p==0&&w==0||T==r.isDark(u+p,h+w)&&(g+=1);g>5&&(c+=3+g-5)}for(let u=0;u<a-1;u+=1)for(let h=0;h<a-1;h+=1){let g=0;r.isDark(u,h)&&(g+=1),r.isDark(u+1,h)&&(g+=1),r.isDark(u,h+1)&&(g+=1),r.isDark(u+1,h+1)&&(g+=1),(g==0||g==4)&&(c+=3)}for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(u,h)&&!r.isDark(u,h+1)&&r.isDark(u,h+2)&&r.isDark(u,h+3)&&r.isDark(u,h+4)&&!r.isDark(u,h+5)&&r.isDark(u,h+6)&&(c+=40);for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(h,u)&&!r.isDark(h+1,u)&&r.isDark(h+2,u)&&r.isDark(h+3,u)&&r.isDark(h+4,u)&&!r.isDark(h+5,u)&&r.isDark(h+6,u)&&(c+=40);let l=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1)r.isDark(h,u)&&(l+=1);let d=Math.abs(100*l/a/a-50)/5;return c+=d*10,c},o})(),Oe=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),Pt=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+t);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let i=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=Oe.gexp(Oe.glog(n.getAt(r))+Oe.glog(o.getAt(a)));return Pt(i,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let i=Oe.glog(n.getAt(0))-Oe.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=Oe.gexp(Oe.glog(o.getAt(a))+i);return Pt(r,0).mod(o)},n},nr=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},n=function(o,i){switch(i){case Mt.L:return s[(o-1)*4+0];case Mt.M:return s[(o-1)*4+1];case Mt.Q:return s[(o-1)*4+2];case Mt.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=n(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,c=[];for(let l=0;l<a;l+=1){let d=r[l*3+0],u=r[l*3+1],h=r[l*3+2];for(let g=0;g<d;g+=1)c.push(t(u,h))}return c},e})(),sr=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let o=Math.floor(n/8);return(s[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let i=0;i<o;i+=1)e.putBit((n>>>o-i-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);s.length<=o&&s.push(0),n&&(s[o]|=128>>>t%8),t+=1},e},ac=function(s){let t=pe.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+i(r.charAt(c));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},lc=function(s){let t=pe.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(i){return e.length},n.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return n},cc=function(s){let t=pe.MODE_8BIT_BYTE,e=s,n=dt.stringToBytes(s),o={};return o.getMode=function(){return t},o.getLength=function(i){return n.length},o.write=function(i){for(let r=0;r<n.length;r+=1)i.put(n[r],8)},o},dc=function(s){let t=pe.MODE_KANJI,e=s,n=dt.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=n(s),i={};return i.getMode=function(){return t},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,c=0;for(;c+1<a.length;){let l=(255&a[c])<<8|255&a[c+1];if(33088<=l&&l<=40956)l-=33088;else if(57408<=l&&l<=60351)l-=49472;else throw"illegal char at "+(c+1)+"/"+l;l=(l>>>8&255)*192+(l&255),r.put(l,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},i},ir=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let i=0;i<o;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},uc=function(){let s=0,t=0,e=0,n="",o={},i=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)i(s>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},o.toString=function(){return n},o},hc=function(s){let t=s,e=0,n=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=t.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},pc=function(s,t){let e=s,n=t,o=new Array(s*t),i={};i.setPixel=function(l,d,u){o[d*e+l]=u},i.write=function(l){l.writeString("GIF87a"),l.writeShort(e),l.writeShort(n),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(e),l.writeShort(n),l.writeByte(0);let d=2,u=a(d);l.writeByte(d);let h=0;for(;u.length-h>255;)l.writeByte(255),l.writeBytes(u,h,255),h+=255;l.writeByte(u.length-h),l.writeBytes(u,h,u.length-h),l.writeByte(0),l.writeString(";")};let r=function(l){let d=l,u=0,h=0,g={};return g.write=function(T,p){if(T>>>p)throw"length over";for(;u+p>=8;)d.writeByte(255&(T<<u|h)),p-=8-u,T>>>=8-u,h=0,u=0;h=T<<u|h,u=u+p},g.flush=function(){u>0&&d.writeByte(h)},g},a=function(l){let d=1<<l,u=(1<<l)+1,h=l+1,g=c();for(let x=0;x<d;x+=1)g.add(String.fromCharCode(x));g.add(String.fromCharCode(d)),g.add(String.fromCharCode(u));let T=ir(),p=r(T);p.write(d,h);let w=0,A=String.fromCharCode(o[w]);for(w+=1;w<o.length;){let x=String.fromCharCode(o[w]);w+=1,g.contains(A+x)?A=A+x:(p.write(g.indexOf(A),h),g.size()<4095&&(g.size()==1<<h&&(h+=1),g.add(A+x)),A=x)}return p.write(g.indexOf(A),h),p.write(u,h),p.flush(),T.toByteArray()},c=function(){let l={},d=0,u={};return u.add=function(h){if(u.contains(h))throw"dup key:"+h;l[h]=d,d+=1},u.size=function(){return d},u.indexOf=function(h){return l[h]},u.contains=function(h){return typeof l[h]<"u"},u};return i},fc=function(s,t,e){let n=pc(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let o=ir();n.write(o);let i=uc(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},or=dt,Zd=dt.stringToBytes;function rr(s){let t=or(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)t.isDark(o,i)&&(n+=`M${i} ${o}h1v1h-1z`);return{size:e,d:n}}var gc=1e4,Dt=class extends ye{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await er();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof Qe&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),gc)}}async poll(e){let n=this.secret;if(n)try{let o=await tr(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return _;let{size:e,d:n}=rr(Qo(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${ae`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?Zo(this.code):"····-····"}</p>
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
    </div>`}};Dt.styles=ze`
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
  `,Dt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Dt);var Ps="hassTokens";function ar(){try{let s=localStorage.getItem(Ps);return s?JSON.parse(s):null}catch{return null}}function Ds(s){try{s?localStorage.setItem(Ps,JSON.stringify(s)):localStorage.removeItem(Ps)}catch{}}function mc(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function bc(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function xc(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!ar()){let e=await bc();e&&Ds(e)}try{let e=await Zs({hassUrl:location.origin,loadTokens:async()=>ar(),saveTokens:Ds});t&&history.replaceState(null,"",location.pathname+as(location.search));let n=await Qs({auth:e});s.backend=new Nt(n),n.addEventListener("reconnect-error",(o,i)=>{i===2&&lr()})}catch(e){if(e===2){lr();return}mc(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function lr(){Ds(null),location.replace(location.pathname+as(location.search))}var dr=Et(location.search),cr=document.querySelector("mydashlight-keyboard");cr&&dr.keyboard!==!1&&Xo(cr);dr.cursor!=="show"&&Ko();xc();
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
