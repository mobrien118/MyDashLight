var Po=Object.defineProperty;var $n=(s,t)=>()=>(s&&(t=s(s=0)),t);var Mo=(s,t)=>{for(var e in t)Po(s,e,{get:t[e],enumerable:!0})};function hn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function is(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Mr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Ki(s){return Mr(s,t=>t.unicode)}function Dr(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[l,d]]of Object.entries(o))i.createIndex(r,l,{multiEntry:d});return i}t(ht),t(Xe,Er,{[Gi]:[Tr,!0],[Yi]:[[Cr,_r]],[Xi]:[Sr,!0]}),t(ls,void 0,{[qi]:[""]})}function Zi(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Lr(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,$r);rs[s]=o,o.onupgradeneeded=i=>{i.oldVersion<kr&&Dr(o.result)},Zi(e,n,o)});return t.onclose=()=>cs(s),t}function jr(s){return un[s]||(un[s]=Lr(s)),un[s]}function De(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),l=typeof t=="string"?r.objectStore(t):t.map(a=>r.objectStore(a)),d;n(l,r,a=>{d=a}),r.oncomplete=()=>o(d),r.onerror=()=>i(r.error)})}function cs(s){let t=rs[s],e=t&&t.result;if(e){e.close();let n=gn[s];if(n)for(let o of n)o()}delete rs[s],delete un[s],delete gn[s]}function Rr(s){return new Promise((t,e)=>{cs(s);let n=indexedDB.deleteDatabase(s);Zi(t,e,n)})}function zr(s,t){let e=gn[s];e||(e=gn[s]=[]),e.push(t)}function ct(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||Ir.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Ji(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Br)}function Or(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:l,tags:d,emoji:a,version:c})=>{let h=[...new Set(Ji([...(r||[]).map(ct).flat(),...(d||[]).map(ct).flat(),...ct(e),n]))].sort(),g={annotation:e,group:o,order:i,tags:d,tokens:h,unicode:a,version:c};if(n&&(g.emoticon=n),r&&(g.shortcodes=r),l){g.skinTones=[],g.skinUnicodes=[],g.skinVersions=[];for(let{tone:m,emoji:P,version:v}of l)g.skinTones.push(m),g.skinUnicodes.push(P),g.skinVersions.push(v)}return g})}function Qi(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function Ye(s,t,e){Qi(s,"get",t,e)}function eo(s,t,e){Qi(s,"getAll",t,e)}function hs(s){s.commit&&s.commit()}function Nr(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function to(s,t){let e=Nr(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Ur(s){return!await ps(s,ht,fn)}async function Hr(s,t,e){let[n,o]=await Promise.all([os,fn].map(i=>ps(s,ht,i)));return n===e&&o===t}async function Fr(s,t){return De(s,Xe,ut,(n,o,i)=>{let r,l=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=d=>{let a=d.target.result;for(let c of a)if(r=c.unicode,t(c))return i(c);if(a.length<50)return i();l()}};l()})}async function no(s,t,e,n){try{let o=Or(t);await De(s,[Xe,ht],ds,([i,r],l)=>{let d,a,c=0;function h(){++c===2&&g()}function g(){if(!(d===n&&a===e)){i.clear();for(let m of o)i.put(m);r.put(n,os),r.put(e,fn),hs(l)}}Ye(r,os,m=>{d=m,h()}),Ye(r,fn,m=>{a=m,h()})})}finally{}}async function Wr(s,t){return De(s,Xe,ut,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);eo(e.index(Yi),i,o)})}async function so(s,t){let e=Ji(ct(t));return e.length?De(s,Xe,ut,(n,o,i)=>{let r=[],l=()=>{r.length===e.length&&d()},d=()=>{let a=to(r,c=>c.unicode);i(a.sort((c,h)=>c.order<h.order?-1:1))};for(let a=0;a<e.length;a++){let c=e[a],h=a===e.length-1?IDBKeyRange.bound(c,c+"￿",!1,!0):IDBKeyRange.only(c);eo(n.index(Gi),h,g=>{r.push(g),l()})}}):[]}async function Kr(s,t){let e=await so(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Fr(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Vr(s,t){return De(s,Xe,ut,(e,n,o)=>Ye(e,t,i=>{if(i)return o(i);Ye(e.index(Xi),t,r=>o(r||null))}))}function ps(s,t,e){return De(s,t,ut,(n,o,i)=>Ye(n,e,i))}function Gr(s,t,e,n){return De(s,t,ds,(o,i)=>{o.put(n,e),hs(i)})}function qr(s,t){return De(s,ls,ds,(e,n)=>Ye(e,t,o=>{e.put((o||0)+1,t),hs(n)}))}function Yr(s,t,e){return e===0?[]:De(s,[ls,Xe],ut,([n,o],i,r)=>{let l=[];n.index(qi).openCursor(void 0,"prev").onsuccess=d=>{let a=d.target.result;if(!a)return r(l);function c(m){if(l.push(m),l.length===e)return r(l);a.continue()}let h=a.primaryKey,g=t.byName(h);if(g)return c(g);Ye(o,h,m=>{if(m)return c(m);a.continue()})}})}function Xr(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let l=e;for(let a=0;a<r.length;a++){let c=r.charAt(a),h=l.get(c);h||(h=new Map,l.set(c,h)),l=h}let d=l.get(pn);d||(d=[],l.set(pn,d)),d.push(o)}}return(o,i)=>{let r=e;for(let a=0;a<o.length;a++){let c=o.charAt(a),h=r.get(c);if(h)r=h;else return[]}if(i)return r.get(pn)||[];let l=[],d=[r];for(;d.length;){let c=[...d.shift().entries()].sort((h,g)=>h[0]<g[0]?-1:1);for(let[h,g]of c)h===pn?l.push(...g):d.push(g)}return l}}function Jr(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||Zr.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function Vi(s){Jr(s);let t=(g,m)=>g.name.toLowerCase()<m.name.toLowerCase()?-1:1,e=s.sort(t),o=Xr(s,g=>{let m=new Set;if(g.shortcodes)for(let P of g.shortcodes)for(let v of ct(P))m.add(v);return m}),i=g=>o(g,!0),r=g=>o(g,!1),l=g=>{let m=ct(g),P=m.map((v,y)=>(y<m.length-1?i:r)(v));return to(P,v=>v.name).sort(t)},d=new Map,a=new Map;for(let g of s){a.set(g.name.toLowerCase(),g);for(let m of g.shortcodes||[])d.set(m.toLowerCase(),g)}return{all:e,search:l,byShortcode:g=>d.get(g.toLowerCase()),byName:g=>a.get(g.toLowerCase())}}function Pt(s){if(!s)return s;if(Qr&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function io(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function ta(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||ea.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function oo(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function na(s){let t=await fetch(s,{method:"HEAD"});oo(t,s);let e=t.headers.get("etag");return io(e),e}async function as(s){let t=await fetch(s);oo(t,s);let e=t.headers.get("etag");io(e);let n=await t.json();return ta(n),[e,n]}function sa(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function ia(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function ro(s){let t=JSON.stringify(s),e=ia(t),n=await crypto.subtle.digest("SHA-1",e),o=sa(n);return btoa(o)}async function oa(s,t){let e,n=await na(t);if(!n){let o=await as(t);n=o[0],e=o[1],n||(n=await ro(e))}await Hr(s,t,n)||(e||(e=(await as(t))[1]),await no(s,e,t,n))}async function ra(s,t){let[e,n]=await as(t);e||(e=await ro(n)),await no(s,n,t,e)}async function aa(s,t){try{await oa(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var $r,kr,Xe,ht,ls,Tr,Gi,Er,qi,Cr,_r,Yi,os,fn,Wi,ut,ds,Xi,Sr,Ar,Pr,rs,un,gn,Ir,Br,pn,Zr,Qr,ea,pt,us=$n(()=>{$r=1,kr=1,Xe="emoji",ht="keyvalue",ls="favorites",Tr="tokens",Gi="tokens",Er="unicode",qi="count",Cr="group",_r="order",Yi="group-order",os="eTag",fn="url",Wi="skinTone",ut="readonly",ds="readwrite",Xi="skinUnicodes",Sr="skinUnicodes",Ar="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Pr="en";rs={},un={},gn={};Ir=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Br=2;pn="";Zr=["name","url"];Qr=typeof wrappedJSObject<"u";ea=["annotation","emoji","group","order","version"];pt=class{constructor({dataSource:t=Ar,locale:e=Pr,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Vi(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await jr(this._dbName);zr(this._dbName,this._clear);let e=this.dataSource;await Ur(t)?await ra(t,e):this._lazyUpdate=aa(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return is(t),await this.ready(),Ki(await Wr(this._db,t)).map(Pt)}async getEmojiBySearchQuery(t){hn(t),await this.ready();let e=this._custom.search(t),n=Ki(await so(this._db,t)).map(Pt);return[...e,...n]}async getEmojiByShortcode(t){hn(t),await this.ready();let e=this._custom.byShortcode(t);return e||Pt(await Kr(this._db,t))}async getEmojiByUnicodeOrName(t){hn(t),await this.ready();let e=this._custom.byName(t);return e||Pt(await Vr(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await ps(this._db,ht,Wi)||0}async setPreferredSkinTone(t){return is(t),await this.ready(),Gr(this._db,ht,Wi,t)}async incrementFavoriteEmojiCount(t){return hn(t),await this.ready(),qr(this._db,t)}async getTopFavoriteEmoji(t){return is(t),await this.ready(),(await Yr(this._db,this._custom,t)).map(Pt)}set customEmoji(t){this._custom=Vi(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await cs(this._dbName)}async delete(){await this._shutdown(),await Rr(this._dbName)}}});function lo(s){return s.unicode.includes("‍")}function ma(s){let t=co(s,"#000"),e=co(s,"#fff");return t&&e&&ga(t,e)}function ba(){let s=Object.entries(da);try{for(let[t,e]of s)if(ma(t))return e}catch{}finally{}return s[0][1]}function ka(s,t){if(t===0)return s;let e=s.indexOf(xa);return e!==-1?s.substring(0,e)+String.fromCodePoint(wa+t-1)+s.substring(e):(s.endsWith(va)&&(s=s.substring(0,s.length-1)),s+ya+String.fromCodePoint($a+t-1))}function ke(s){s.preventDefault(),s.stopPropagation()}function bs(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function yo(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Ta(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:l,category:d,annotation:a})=>({unicode:n,name:l,shortcodes:i,url:r,category:d,annotation:a,id:n||l,skins:o&&e(o)}))}function Ca(s,t,e){let n;Ea?(n=new ResizeObserver(e),n.observe(s)):bn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function ho(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function po(s,t,e){let n=ho(t);if(!n){if(!Ze){Ze=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])Ze.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(Ze),Ze.firstChild.nodeValue=s,ho(Ze)}finally{Ze.remove()}}return n}function Sa(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof vs>"u"&&(vs=po(_a,t,t));let l=po(o.unicode,i,t)/1.8<vs;$s.set(o.unicode,l),l||(n=!1)}return n}function Aa(s){return yo(s,t=>t)}function Pa(s){s&&(s.scrollTop=0)}function Mt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function uo(s){return""+s}function Ma(s){let t=document.createElement("template");return t.innerHTML=s,t}function za(s,t){Ra?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function Ia(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Ba(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Ia(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&za(n,s)}function Oa(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:l,attributeValuePost:d}}=e,a=s[i];if(o!==a)if(e.currentExpression=a,r)if(a===null)n.removeAttribute(r);else{let c=l+uo(a)+d;n.setAttribute(r,c)}else{let c;Array.isArray(a)?Ba(a,e):a instanceof Element?(c=a,n.replaceWith(c)):n.nodeValue=uo(a),c&&(e.targetNode=c)}}}function Na(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],l=0;for(let a=0,c=s.length;a<c;a++){let h=s[a];if(t+=h.slice(l),a===c-1)break;for(let u=0;u<h.length;u++)switch(h.charAt(u)){case"<":{h.charAt(u+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let g=r[r.length-1],m=Mt(i,g,()=>[]),P,v,y;if(n){let u=/(\S+)="?([^"=]*)$/.exec(h);P=u[1],v=u[2];let M=/^([^">]*)("?)/.exec(s[a+1]);y=M[1],t=t.slice(0,-1*u[0].length),l=M[0].length}else l=0;let E={attributeName:P,attributeValuePre:v,attributeValuePost:y,expressionIndex:a};m.push(E),!e&&!n&&(t+=" ")}return{template:Ma(t),elementsToBindings:i}}function fo(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Ua(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))fo(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let l=t.get(++r);l&&fo(l,i,e)}while(i=o.nextNode())}return e}function Ha(s){let{template:t,elementsToBindings:e}=Mt(Da,s,()=>Na(s)),n=t.cloneNode(!0).content.firstElementChild,o=Ua(n,e);return function(r){return Oa(r,o),n}}function Fa(s){let t=Mt(La,s,()=>new Map),e=ja;function n(i,...r){let l=Mt(t,i,()=>new Map);return Mt(l,e,()=>Ha(i))(r)}function o(i,r,l){return i.map((d,a)=>{let c=e;e=l(d);try{return r(d,a)}finally{e=c}})}return{map:o,html:n}}function Wa(s,t,e,n,o,i,r,l,d){let{labelWithSkin:a,titleForEmoji:c,unicodeWithSkin:h}=e,{html:g,map:m}=Fa(t);function P(u,M,R){return m(u,(H,se)=>g`<button role="${M?"option":"menuitem"}" aria-selected="${M?se===t.activeSearchItem:null}" aria-label="${a(H,t.currentSkinTone)}" title="${c(H)}" class="${"emoji"+(M&&se===t.activeSearchItem?" active":"")+(H.unicode?"":" custom-emoji")}" id="${`${R}-${H.id}`}" style="${H.unicode?null:`--custom-emoji-background: url(${JSON.stringify(H.url)})`}">${H.unicode?h(H,t.currentSkinTone):""}</button>`,H=>`${R}-${H.id}`)}let y=g`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${m(t.skinTones,(u,M)=>g`<div id="skintone-${M}" class="emoji ${M===t.activeSkinTone?"active":""}" aria-selected="${M===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[M]}" aria-label="${t.i18n.skinTones[M]}">${u}</div>`,u=>u)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${m(t.groups,u=>g`<button role="tab" class="nav-button" aria-controls="tab-${u.id}" aria-label="${t.i18n.categories[u.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===u.id}" title="${t.i18n.categories[u.name]}" data-group-id="${u.id}"><div class="nav-emoji emoji">${u.emoji}</div></button>`,u=>u.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${m(t.currentEmojisWithCategories,(u,M)=>g`<div><div id="menu-label-${M}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:u.category?u.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${M!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(u.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${M}" id="${t.searchMode?"search-results":null}">${P(u.emojis,t.searchMode,"emo")}</div></div>`,u=>u.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${P(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,E=(u,M)=>{for(let R of s.querySelectorAll(`[${u}]`))M(R,R.getAttribute(u))};if(d){s.appendChild(y);for(let u of["click","focusout","input","keydown","keyup"])E(`data-on-${u}`,(M,R)=>{M.addEventListener(u,n[R])});E("data-ref",(u,M)=>{i[M]=u}),r.addEventListener("abort",()=>{s.removeChild(y)})}E("data-action",(u,M)=>{let R=l.get(M);R||l.set(M,R=new WeakSet),R.has(u)||(R.add(u),o[M](u))})}function Ka(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let a=[...o];o.clear();try{for(let c of a)c()}finally{i=!1,o.size&&(i=!0,vn(r))}},l=new Proxy({},{get(a,c){if(e){let h=n.get(c);h||(h=new Set,n.set(c,h)),h.add(e)}return a[c]},set(a,c,h){if(a[c]!==h){a[c]=h;let g=n.get(c);if(g){for(let m of g)o.add(m);i||(i=!0,vn(r))}}return!0}}),d=a=>{let c=()=>{let h=e;e=c;try{return a()}finally{e=h}};return c()};return s.addEventListener("abort",()=>{t=!0}),{state:l,createEffect:d}}function ys(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Va(s,t,e){{let n=s.closest(".tabpanel"),o=go.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),go.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function Ga(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=Ka(o),l=new Map;mn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),mn(i,t),mn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:pa,isRtl:!1,currentGroupIndex:0,groups:fs,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let d=b=>{s.getElementById(b).focus()},a=b=>s.getElementById(`emo-${b.id}`),c=(b,w)=>{e.rootElement.dispatchEvent(new CustomEvent(b,{detail:w,bubbles:!0,composed:!0}))},h=(b,w)=>b.id===w.id,g=(b,w)=>{let{category:k,emojis:$}=b,{category:B,emojis:_}=w;return k!==B?!1:ys($,_,h)},m=b=>{ys(i.currentEmojis,b,h)||(i.currentEmojis=b)},P=b=>{i.searchMode!==b&&(i.searchMode=b)},v=b=>{ys(i.currentEmojisWithCategories,b,g)||(i.currentEmojisWithCategories=b)},y=(b,w)=>w&&b.skins&&b.skins[w]||b.unicode,M={labelWithSkin:(b,w)=>Aa([b.name||y(b,w),b.annotation,...b.shortcodes||xs].filter(Boolean)).join(", "),titleForEmoji:b=>b.annotation||(b.shortcodes||xs).join(", "),unicodeWithSkin:y},R={onClickSkinToneButton:F,onEmojiClick:re,onNavClick:Ee,onNavKeydown:Ce,onSearchKeydown:Ie,onSkinToneOptionsClick:G,onSkinToneOptionsFocusOut:D,onSkinToneOptionsKeydown:f,onSkinToneOptionsKeyup:A,onSearchInput:T},H={calculateEmojiGridStyle:N,updateOnIntersection:Le},se=!0;r(()=>{Wa(s,i,M,R,H,e,o,l,se),se=!1}),i.emojiVersion||ms().then(b=>{b||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function b(){let w=!1,k=setTimeout(()=>{w=!0,i.message=i.i18n.loadingMessage},ca);try{await i.database.ready(),i.databaseLoaded=!0}catch($){console.error($),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(k),w&&(w=!1,i.message="")}}i.database&&b()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${ao};`}),r(()=>{i.customEmoji&&i.database&&de()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==ws&&(i.groups=ws):i.groups!==fs&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=fs)}),r(()=>{async function b(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}b()}),r(()=>{i.skinTones=Array(ao).fill().map((b,w)=>ka(i.skinToneEmoji,w))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function b(){let{database:w}=i,k=(await Promise.all(ua.map($=>w.getEmojiByUnicodeOrName($)))).filter(Boolean);i.defaultFavoriteEmojis=k}i.databaseLoaded&&b()});function de(){let{customEmoji:b,database:w}=i,k=b||xs;w.customEmoji!==k&&(w.customEmoji=k)}r(()=>{async function b(){de();let{database:w,defaultFavoriteEmojis:k,numColumns:$}=i,B=await w.getTopFavoriteEmoji($),_=await te(yo([...B,...k],U=>U.unicode||U.name).slice(0,$));i.currentFavorites=_}i.databaseLoaded&&i.defaultFavoriteEmojis&&b()});function N(b){Ca(b,o,()=>{{let w=getComputedStyle(e.rootElement),k=parseInt(w.getPropertyValue("--num-columns"),10),$=w.getPropertyValue("direction")==="rtl";i.numColumns=k,i.isRtl=$}})}function Le(b){Va(b,o,w=>{for(let{target:k,isIntersecting:$}of w)k.classList.toggle("onscreen",$)})}r(()=>{async function b(){let{searchText:w,currentGroup:k,databaseLoaded:$,customEmoji:B}=i;if(!$)i.currentEmojis=[],i.searchMode=!1;else if(w.length>=la){let _=await ze(w);i.searchText===w&&(m(_),P(!0))}else{let{id:_}=k;if(_!==-1||B&&B.length){let U=await et(_);i.currentGroup.id===_&&(m(U),P(!1))}}}b()});let ie=()=>{bn(()=>Pa(e.tabpanelElement))};r(()=>{let{currentEmojis:b,emojiVersion:w}=i,k=b.filter($=>$.unicode).filter($=>lo($)&&!$s.has($.unicode));if(!w&&k.length)m(b),bn(()=>Qe(k));else{let $=w?b:b.filter(ue);m($),ie()}});function Qe(b){Sa(b,e.baselineEmoji,a)?ie():i.currentEmojis=[...i.currentEmojis]}function ue(b){return!b.unicode||!lo(b)||$s.get(b.unicode)}async function Re(b){let w=i.emojiVersion||await ms();return b.filter(({version:k})=>!k||k<=w)}async function te(b){return Ta(b,i.emojiVersion||await ms())}async function et(b){let w=b===-1?i.customEmoji:await i.database.getEmojiByGroup(b);return te(await Re(w))}async function ze(b){return te(await Re(await i.database.getEmojiBySearchQuery(b)))}r(()=>{}),r(()=>{function b(){let{searchMode:k,currentEmojis:$}=i;if(k)return[{category:"",emojis:$}];let B=new Map;for(let _ of $){let U=_.category||"",ne=B.get(U);ne||(ne=[],B.set(U,ne)),ne.push(_)}return[...B.entries()].map(([_,U])=>({category:_,emojis:U})).sort((_,U)=>i.customCategorySorting(_.category,U.category))}let w=b();v(w)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:b}=i;bo(()=>{i.searchText=(b||"").trim(),i.activeSearchItem=-1})});function Ie(b){if(!i.searchMode||!i.currentEmojis.length)return;let w=k=>{ke(b),i.activeSearchItem=bs(k,i.activeSearchItem,i.currentEmojis)};switch(b.key){case"ArrowDown":return w(!1);case"ArrowUp":return w(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return ke(b),fe(i.currentEmojis[i.activeSearchItem].id)}}function Ee(b){let{target:w}=b,k=w.closest(".nav-button");if(!k)return;let $=parseInt(k.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(B=>B.id===$)}function Ce(b){let{target:w,key:k}=b,$=B=>{B&&(ke(b),B.focus())};switch(k){case"ArrowLeft":return $(w.previousElementSibling);case"ArrowRight":return $(w.nextElementSibling);case"Home":return $(w.parentElement.firstElementChild);case"End":return $(w.parentElement.lastElementChild)}}async function V(b){let w=await i.database.getEmojiByUnicodeOrName(b),k=[...i.currentEmojis,...i.currentFavorites].find(B=>B.id===b),$=k.unicode&&y(k,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(b),{emoji:w,skinTone:i.currentSkinTone,...$&&{unicode:$},...k.name&&{name:k.name}}}async function fe(b){let w=V(b);c("emoji-click-sync",w),c("emoji-click",await w)}function re(b){let{target:w}=b;if(!w.classList.contains("emoji"))return;ke(b);let k=w.id.substring(4);fe(k)}function L(b){i.currentSkinTone=b,i.skinTonePickerExpanded=!1,d("skintone-button"),c("skin-tone-change",{skinTone:b}),i.database.setPreferredSkinTone(b)}function G(b){let{target:{id:w}}=b,k=w&&w.match(/^skintone-(\d)/);if(!k)return;ke(b);let $=parseInt(k[1],10);L($)}function F(b){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(ke(b),bn(()=>d("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function f(b){if(!i.skinTonePickerExpanded)return;let w=async k=>{ke(b),i.activeSkinTone=k};switch(b.key){case"ArrowUp":return w(bs(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return w(bs(!1,i.activeSkinTone,i.skinTones));case"Home":return w(0);case"End":return w(i.skinTones.length-1);case"Enter":return ke(b),L(i.activeSkinTone);case"Escape":return ke(b),i.skinTonePickerExpanded=!1,d("skintone-button")}}function A(b){if(i.skinTonePickerExpanded)switch(b.key){case" ":return ke(b),L(i.activeSkinTone)}}async function D(b){let{relatedTarget:w}=b;(!w||w.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function T(b){i.rawSearchText=b.target.value}return{$set(b){mn(i,b)},$destroy(){n.abort()}}}function mo(s){s instanceof Je||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var ws,fs,la,ao,bo,da,ca,ha,pa,ua,vo,fa,co,ga,gs,ms,$s,va,ya,xa,wa,$a,bn,Ea,_a,vs,Ze,Da,La,ja,Ra,vn,go,xs,mn,qa,Ya,Xa,Za,xo,Ja,Je,wo,$o=$n(()=>{us();ws=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),fs=ws.slice(1),la=2,ao=6,bo=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;da={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},ca=1e3,ha="🖐️",pa=8,ua=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],vo='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',fa=(s,t)=>s<t?-1:s>t?1:0,co=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${vo}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},ga=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ms=()=>(gs||(gs=new Promise(s=>bo(()=>s(ba())))),gs),$s=new Map,va="️",ya="\uD83C",xa="‍",wa=127995,$a=57339;bn=requestAnimationFrame,Ea=typeof ResizeObserver=="function";_a="😀";Da=new WeakMap,La=new WeakMap,ja=Symbol("un-keyed"),Ra="replaceChildren"in Element.prototype;vn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);go=new WeakMap;xs=[],{assign:mn}=Object;qa="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Ya="en",Xa={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Za=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',xo=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Ja=`:host{--emoji-font-family:${vo}}`,Je=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Za+Ja,this.shadowRoot.appendChild(e),this._ctx={locale:Ya,dataSource:qa,skinToneEmoji:ha,customCategorySorting:fa,customEmoji:null,i18n:Xa,emojiVersion:null,...t};for(let n of xo)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){mo(this),this._cmp||(this._cmp=Ga(this.shadowRoot,this._ctx))}disconnectedCallback(){mo(this),vn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new pt({locale:t,dataSource:e}))}_dbFlush(){vn(()=>this._dbCreate())}},wo={};for(let s of xo)wo[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(Je.prototype,wo);customElements.get("emoji-picker")||customElements.define("emoji-picker",Je)});var ko={};Mo(ko,{Database:()=>pt,Picker:()=>Je});var To=$n(()=>{$o();us()});var It=globalThis,Bt=It.ShadowRoot&&(It.ShadyCSS===void 0||It.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,kn=Symbol(),Ps=new WeakMap,gt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==kn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Bt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ps.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ps.set(e,t))}return t}toString(){return this.cssText}},Ms=s=>new gt(typeof s=="string"?s:s+"",void 0,kn),Be=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new gt(e,s,kn)},Ds=(s,t)=>{if(Bt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=It.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},Tn=Bt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Ms(e)})(s):s;var{is:Do,defineProperty:Lo,getOwnPropertyDescriptor:jo,getOwnPropertyNames:Ro,getOwnPropertySymbols:zo,getPrototypeOf:Io}=Object,Ot=globalThis,Ls=Ot.trustedTypes,Bo=Ls?Ls.emptyScript:"",Oo=Ot.reactiveElementPolyfillSupport,mt=(s,t)=>s,En={toAttribute(s,t){switch(t){case Boolean:s=s?Bo:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Rs=(s,t)=>!Do(s,t),js={attribute:!0,type:String,converter:En,reflect:!1,useDefault:!1,hasChanged:Rs};Symbol.metadata??=Symbol("metadata"),Ot.litPropertyMetadata??=new WeakMap;var Se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=js){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&Lo(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=jo(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let l=o?.call(this);i?.call(this,r),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??js}static _$Ei(){if(this.hasOwnProperty(mt("elementProperties")))return;let t=Io(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(mt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(mt("properties"))){let e=this.properties,n=[...Ro(e),...zo(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(Tn(o))}else t!==void 0&&e.push(Tn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ds(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:En).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:En;this._$Em=o;let l=r.fromAttribute(e,i.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Rs)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,l=this[o];r!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,i,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Se.elementStyles=[],Se.shadowRootOptions={mode:"open"},Se[mt("elementProperties")]=new Map,Se[mt("finalized")]=new Map,Oo?.({ReactiveElement:Se}),(Ot.reactiveElementVersions??=[]).push("2.1.2");var _n=globalThis,zs=s=>s,Nt=_n.trustedTypes,Is=Nt?Nt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Sn="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,An="?"+Ae,No=`<${An}>`,Ue=document,vt=()=>Ue.createComment(""),yt=s=>s===null||typeof s!="object"&&typeof s!="function",Pn=Array.isArray,Fs=s=>Pn(s)||typeof s?.[Symbol.iterator]=="function",Cn=`[ 	
\f\r]`,bt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Bs=/-->/g,Os=/>/g,Oe=RegExp(`>|${Cn}(?:([^\\s"'>=/]+)(${Cn}*=${Cn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ns=/'/g,Us=/"/g,Ws=/^(?:script|style|textarea|title)$/i,Mn=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=Mn(1),Q=Mn(2),vl=Mn(3),Pe=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),Hs=new WeakMap,Ne=Ue.createTreeWalker(Ue,129);function Ks(s,t){if(!Pn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Is!==void 0?Is.createHTML(t):t}var Vs=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=bt;for(let l=0;l<e;l++){let d=s[l],a,c,h=-1,g=0;for(;g<d.length&&(r.lastIndex=g,c=r.exec(d),c!==null);)g=r.lastIndex,r===bt?c[1]==="!--"?r=Bs:c[1]!==void 0?r=Os:c[2]!==void 0?(Ws.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=Oe):c[3]!==void 0&&(r=Oe):r===Oe?c[0]===">"?(r=o??bt,h=-1):c[1]===void 0?h=-2:(h=r.lastIndex-c[2].length,a=c[1],r=c[3]===void 0?Oe:c[3]==='"'?Us:Ns):r===Us||r===Ns?r=Oe:r===Bs||r===Os?r=bt:(r=Oe,o=void 0);let m=r===Oe&&s[l+1].startsWith("/>")?" ":"";i+=r===bt?d+No:h>=0?(n.push(a),d.slice(0,h)+Sn+d.slice(h)+Ae+m):d+Ae+(h===-2?l:m)}return[Ks(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},xt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,l=t.length-1,d=this.parts,[a,c]=Vs(t,e);if(this.el=s.createElement(a,n),Ne.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(o=Ne.nextNode())!==null&&d.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let h of o.getAttributeNames())if(h.endsWith(Sn)){let g=c[r++],m=o.getAttribute(h).split(Ae),P=/([.?@])?(.*)/.exec(g);d.push({type:1,index:i,name:P[2],strings:m,ctor:P[1]==="."?Ht:P[1]==="?"?Ft:P[1]==="@"?Wt:Fe}),o.removeAttribute(h)}else h.startsWith(Ae)&&(d.push({type:6,index:i}),o.removeAttribute(h));if(Ws.test(o.tagName)){let h=o.textContent.split(Ae),g=h.length-1;if(g>0){o.textContent=Nt?Nt.emptyScript:"";for(let m=0;m<g;m++)o.append(h[m],vt()),Ne.nextNode(),d.push({type:2,index:++i});o.append(h[g],vt())}}}else if(o.nodeType===8)if(o.data===An)d.push({type:2,index:i});else{let h=-1;for(;(h=o.data.indexOf(Ae,h+1))!==-1;)d.push({type:7,index:i}),h+=Ae.length-1}i++}}static createElement(t,e){let n=Ue.createElement("template");return n.innerHTML=t,n}};function He(s,t,e=s,n){if(t===Pe)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=yt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=He(s,o._$AS(s,t.values),o,n)),t}var Ut=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Ue).importNode(e,!0);Ne.currentNode=o;let i=Ne.nextNode(),r=0,l=0,d=n[0];for(;d!==void 0;){if(r===d.index){let a;d.type===2?a=new st(i,i.nextSibling,this,t):d.type===1?a=new d.ctor(i,d.name,d.strings,this,t):d.type===6&&(a=new Kt(i,this,t)),this._$AV.push(a),d=n[++l]}r!==d?.index&&(i=Ne.nextNode(),r++)}return Ne.currentNode=Ue,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},st=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=He(this,t,e),yt(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==Pe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Fs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ue.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=xt.createElement(Ks(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new Ut(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Hs.get(t.strings);return e===void 0&&Hs.set(t.strings,e=new xt(t)),e}k(t){Pn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(vt()),this.O(vt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=zs(t).nextSibling;zs(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Fe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=x}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=He(this,t,e,0),r=!yt(t)||t!==this._$AH&&t!==Pe,r&&(this._$AH=t);else{let l=t,d,a;for(t=i[0],d=0;d<i.length-1;d++)a=He(this,l[n+d],e,d),a===Pe&&(a=this._$AH[d]),r||=!yt(a)||a!==this._$AH[d],a===x?t=x:t!==x&&(t+=(a??"")+i[d+1]),this._$AH[d]=a}r&&!o&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ht=class extends Fe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},Ft=class extends Fe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},Wt=class extends Fe{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=He(this,t,e,0)??x)===Pe)return;let n=this._$AH,o=t===x&&n!==x||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==x&&(n===x||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Kt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){He(this,t)}},Gs={M:Sn,P:Ae,A:An,C:1,L:Vs,R:Ut,D:Fs,V:He,I:st,H:Fe,N:Ft,U:Wt,B:Ht,F:Kt},Uo=_n.litHtmlPolyfillSupport;Uo?.(xt,st),(_n.litHtmlVersions??=[]).push("3.3.3");var qs=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new st(t.insertBefore(vt(),i),i,void 0,e??{})}return o._$AI(s),o};var Dn=globalThis,ge=class extends Se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=qs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Pe}};ge._$litElement$=!0,ge.finalized=!0,Dn.litElementHydrateSupport?.({LitElement:ge});var Ho=Dn.litElementPolyfillSupport;Ho?.({LitElement:ge});(Dn.litElementVersions??=[]).push("4.2.2");var it="mydashlight",Ml=`/api/${it}/pair`,Dl=`/api/${it}/pair/poll`,Ll=`/${it}`,wt="pair";function Ys(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Ln(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function Xs(s){let t=new URLSearchParams(s);return t.has(wt)?Ln(t.get(wt)??""):null}function Fo(s){if(s<60)return"just now";let t=Math.round(s/60);return`${t} minute${t===1?"":"s"} ago`}var $t=class extends ge{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${it}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${it}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return p`<form @submit=${o=>{o.preventDefault();let i=Ln(this.typed);i&&this.check(i)}}>
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
      <p class="code">${Ys(e.code??"")}</p>
      ${o?p`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:x}
      <p>
        A screen at ${e.address} asked ${Fo(e.age??0)}. Check the code matches the one on the screen. It will be
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
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,p`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};$t.styles=Be`
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
  `,$t.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",$t);function j(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function We(s){let t=Math.floor(Math.round(s)/60)%24;return`${j(s)} ${t<12?"AM":"PM"}`}function Zs(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Tt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function Js(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Wo=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Ko=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Vo=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Vt(s){return new Date(`${s}T12:00:00Z`)}function ve(s){let t=Vt(s);return`${Wo.format(t)}, ${Vo.format(t)}`}function ae(s){return Ko.format(Vt(s))}function ye(s,t){return Math.round((Vt(t).getTime()-Vt(s).getTime())/864e5)}function kt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return kt("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Gt(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=kt(e,s),i=kt(e,t).date;return o.date===i?`at ${We(o.minutes)}`:`on ${ae(o.date)} at ${We(o.minutes)}`}var Y=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},Ke="mydashlight",Go=7,Qs=3e4;function jn(s){if(s instanceof Y)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new Y(String(t.code??"error"),t.message)}return typeof s=="number"?new Y("connection_lost","Lost the connection to Home Assistant."):new Y("error",String(s))}var qt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new Y("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Qs),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new Y("not_running","MyDashLight isn’t running right now."))},{type:`${Ke}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:Ke,service:"get_plan",service_data:{days:Go},return_response:!0});this.emit(t.response)}catch(t){this.fail(jn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ke,service:t,service_data:e})}catch(n){throw jn(n)}this.pushing||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Js(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,o=null,i=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:Ke,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(l=>{e||t(l.chores)},{type:`${Ke}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;i(),o=setInterval(()=>void i(),Qs)}})(),()=>{e=!0,o&&clearInterval(o),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let o=await this.conn.subscribeMessage(i=>{e||t(i.lunch)},{type:`${Ke}/lunch/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):n=o}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ke,service:t,service_data:e})}catch(n){throw jn(n)}}};var ei={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ti=s=>(...t)=>({_$litDirective$:s,values:t}),Yt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:qo}=Gs,ni=s=>s;var si=()=>document.createComment(""),ot=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(si(),o),r=n.insertBefore(si(),o);e=new qo(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,l=r!==s;if(l){let d;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(d=s._$AU)!==r._$AU&&e._$AP(d)}if(i!==o||l){let d=e._$AA;for(;d!==i;){let a=ni(d).nextSibling;ni(n).insertBefore(d,o),d=a}}}return e},je=(s,t,e=s)=>(s._$AI(t,e),s),Yo={},ii=(s,t=Yo)=>s._$AH=t,oi=s=>s._$AH,Xt=s=>{s._$AR(),s._$AA.remove()};var ri=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Me=ti(class extends Yt{constructor(s){if(super(s),s.type!==ei.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let l of s)o[r]=n?n(l,r):r,i[r]=e(l,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=oi(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let l=this.ut??=[],d=[],a,c,h=0,g=o.length-1,m=0,P=i.length-1;for(;h<=g&&m<=P;)if(o[h]===null)h++;else if(o[g]===null)g--;else if(l[h]===r[m])d[m]=je(o[h],i[m]),h++,m++;else if(l[g]===r[P])d[P]=je(o[g],i[P]),g--,P--;else if(l[h]===r[P])d[P]=je(o[h],i[P]),ot(s,d[P+1],o[h]),h++,P--;else if(l[g]===r[m])d[m]=je(o[g],i[m]),ot(s,o[h],o[g]),g--,m++;else if(a===void 0&&(a=ri(r,m,P),c=ri(l,h,g)),a.has(l[h]))if(a.has(l[g])){let v=c.get(r[m]),y=v!==void 0?o[v]:null;if(y===null){let E=ot(s,o[h]);je(E,i[m]),d[m]=E}else d[m]=je(y,i[m]),ot(s,o[h],y),o[v]=null;m++}else Xt(o[g]),g--;else Xt(o[h]),h++;for(;m<=P;){let v=ot(s,d[P+1]);je(v,i[m]),d[m++]=v}for(;h<=g;){let v=o[h++];v!==null&&Xt(v)}return this.ut=r,ii(s,d),Pe}});var Zt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ee(s){return Zt[(s%Zt.length+Zt.length)%Zt.length]}var Jt="#23272E",Rn="35,39,46";var Xo=3,Ct=36,zn=12,Qt=8,ai=30,xe=16,Et=100,rt=60,Bn=10,en=30,On=10,Zo=150,Jo=200,sn=1.4;function mi(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Ct}var Qo=26,bi=4;function Nn(s,t){let e=Math.max(Zo,Jo/sn);return Math.ceil(rt+Math.max(0,s-1)*Bn+en+Math.max(0,t-1)*On+e*(s+sn*t))}function we(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function me(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function pe(s){return new Map(we(s).map((t,e)=>[t,ee(e)]))}function le(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function oe(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Un(s,t){return t==="none"?"Not needed":me(s).includes(t)?oe(s,t):t}function on(s,t){return t.own?oe(s,t.own):le(s,t.kid)}var _t={color:Jt,rgb:Rn,ink:Jt};function vi(s,t){return t.own?_t:pe(s).get(t.kid)??ee(0)}function er(s,t){let e=we(s);return t.along.map(n=>e.includes(n)?le(s,n):oe(s,n))}function rn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function tr(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function tn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function In(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(tn(t,n.from)),e.push(tn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(tn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function nr(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,l)=>r.s-l.s||l.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let l=n.findIndex(d=>d<=r.s);l<0?(l=n.length,n.push(r.en)):n[l]=r.en,r.col=l,e.push(r),o=Math.max(o,r.en)}return i(),t}function sr(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function ir(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function yi(s,t){return sr(s.anchors,t)}function Hn(s,t){return ir(s.anchors,t)}function or(s,t){let e=we(s),n=me(s),o=Math.max(t,Nn(e.length,n.length)),r=(o-rt-Math.max(0,e.length-1)*Bn-en-Math.max(0,n.length-1)*On)/(e.length+sn*n.length||1),l=Math.floor(r),d=Math.floor(r*sn),a=s.whole_week??s.days,c=new Map;for(let v of a)for(let y of v.events)for(let E of y.own?y.along:[y.kid]){let u=c.get(E)??[];u.some(M=>M.event_id===y.event_id&&M.calendar_id===y.calendar_id)||u.push(y),c.set(E,u)}let h=pe(s),g=[],m=rt;e.forEach((v,y)=>{let E=c.get(v)??[],u=s.days.some(M=>M.events.some(R=>R.kid===v&&(R.sides.includes("drop")&&R.drop===""||R.sides.includes("pick")&&R.pick==="")));g.push({id:v,kind:"kid",x:m,w:l,name:le(s,v),dot:h.get(v).color,rgb:h.get(v).rgb,sub:`${u?"Needs a ride · ":""}${E.length} this week`,subWarn:u}),m+=l+(y<e.length-1?Bn:0)});let P=m+en/2;return m+=en,n.forEach((v,y)=>{let E=0,u=0;for(let M of a){let R=M.drivers[v];R&&(E+=R.outings.length,u+=R.drive??0)}g.push({id:v,kind:"driver",x:m,w:d,name:oe(s,v),dot:Jt,rgb:Rn,sub:`${E} ${E===1?"trip":"trips"} this week · ${Tt(u)} driving`,subWarn:!1}),m+=d+(y<n.length-1?On:0)}),{columns:g,sepX:P,width:o}}function rr(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function li(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${j(s.start)}`:e||!t?`${s.title} until ${j(s.end)}`:`${s.title} ${j(s.start)}–${j(s.end)}`}function Fn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function Wn(s,t){let e=ye(t,s);return e===0?"Today":e===1?"Tomorrow":""}function Z(s,t=0){return s==null||!Number.isFinite(s)?t:s}function di(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let l=r.length;for(i===0?i=l:i+1+l<=n?i+=1+l:(o++,i=l);i>n;)o++,i-=n}return o}var xi=25,ar=15,wi=3;function ci(s){return Math.max(0,Math.min(wi,Math.floor((s-xi)/ar)))}var lr=xi+2,hi=20;function pi(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var nn="🚗";function ui(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,l=!1)=>({at:o,who:i,stays:l,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var fi={muted:0,normal:1,pending:2,problem:3};function $i(s){let{drop:t,pick:e}=s,n=t?ui(t.text,"drop"):null,o=e?ui(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((d,a)=>a&&(fi[a.tone]??1)>(fi[d]??1)?a.tone:d,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${nn} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let d=`${nn} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${d} both ways`,tone:i},pick:null}:{drop:{text:`${d} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(d,a)=>d==="needed"?`${a} needed`:`${a}${d.at?`${d.at} `:" "}${d.who}${d.stays?" stays":""}${d.extra}`,l=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${nn} ${l.join(" · ")}`,tone:i},pick:null}}function gi(s,t){let e=t-23,n=`${j(s.start)}–${j(s.end)}`+(s.arrive_by!=null?` · arrive ${j(s.arrive_by)}`:""),o=33+di(n,e,6.6)*16,i=s.own?s.lines:$i(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+di(r.text,e,7)*16);return o+4}function ki(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:l}=or(s,e),d=new Map(i.map(u=>[u.id,u])),a=we(s),c=me(s),h=[...a,...c],g=pe(s),m=tr(s),P=u=>le(s,u),v=u=>oe(s,u),y={mode:t,width:l,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},E=0;return s.days.forEach((u,M)=>{let R=M*1440,H=new Map(u.events.map(f=>[f.id,f])),se=f=>f&&H.has(f)?{day:u.date,event:f}:null,de=Fn(u),N=u.events.length,Le=Wn(u.date,n.date),ie=pr(s,u,g,l);y.dayHeads.push({date:u.date,y:E,label:ve(u.date),tag:Le,sub:(N?`${N} ${N===1?"activity":"activities"}${u.done?" left":""}`:u.done?"All done for today":"Nothing scheduled")+(de?` · ${de} to sort out`:""),warn:de>0,h:Ct+(ie?ie.h+bi+2:0),allDay:ie?.chips??[]}),y.anchors.push({t:R,y:E});let Qe=y.dayHeads[y.dayHeads.length-1],ue=E+Qe.h+zn,Re=c.flatMap(f=>u.drivers[f]?.outings??[]);if(!N&&!Re.length){y.empties.push({key:u.date,y:ue,text:u.done?"Nothing else today":"Nothing planned"}),E=ue+40,y.anchors.push({t:R+1439,y:E});return}let te=(f,A,D,T,b,w,k,$=f.kid)=>{let B=!!f.own&&$===f.own,_=!!f.own&&$!==f.own,U=B?_t:g.get($)??ee(0),ne=B?v($):P($),ce=_?{drop:{text:`With ${v(f.own)}`,tone:f.attending===!1?"muted":"normal"},pick:null}:k&&!f.own?$i(f.lines):f.lines,J=B?er(s,f):[],tt=(f.takes!=null?`${f.takes} min, any time ${j(f.start)}–${j(f.end)}`:`${j(f.start)}–${j(f.end)}`+(f.arrive_by!=null?` · arrive ${j(f.arrive_by)}`:""))+(J.length?` · with ${rn(J)}`:"");return{key:`${u.date}|card|${f.id}`+(f.own?`|${$}`:""),x:A,y:D,w:T,h:b,target:{day:u.date,event:f.id},event:f,color:U,kidName:ne,clash:w,stayed:!f.own&&f.stay&&c.includes(f.drop),skipped:f.attending===!1,title:rr(f.title,ne),time:tt,drop:ce.drop,pick:ce.pick,showDrop:!!ce.drop&&(k||b>=56),showPick:!!ce.pick&&(k||b>=74),wrap:k,aria:`${ne}, ${f.title} ${f.takes!=null?`any time from ${j(f.start)} to ${j(f.end)}`:`${j(f.start)} to ${j(f.end)}`}. `+(f.attending===!1&&!ce.drop?"Not attending. ":"")+[ce.drop,ce.pick].filter(_e=>!!_e).map(_e=>_e.text).join(". ")}},et=f=>{let A=u.rides[f];return A?(u.drivers[A.driver]?.segments??[]).filter(T=>T.type!=="home"&&T.kids.includes(A.kid)&&Z(T.start)>=Z(A.start)&&Z(T.end)<=Z(A.end)):[]},ze=f=>{let A=u.rides[f];if(!A)return null;let D=A.serves.find(T=>H.get(T)?.kid===A.kid);return se(D??A.serves[0])},Ie=(f,A)=>{if(A.event)return A;let D=u.events.find(T=>T.own&&T.own!==f&&T.along.includes(f)&&T.title===A.title);return D?{...A,title:`${A.title} with ${v(D.own)}`}:A},Ee=f=>{if(f.takes==null)return[f.start,f.end];let A=f.planned??f.start;return[A,A+f.takes]},Ce=new Map;for(let f of u.issues)f.level!=="problem"||!f.event||(f.kind==="late"&&Ce.set(f.event,`${Math.round(Z(f.minutes))} min late`),f.kind==="waiting"&&Ce.set(`${f.event}|pick`,`Waits ${Math.round(Z(f.minutes))} min`));if(!o){let f=1/0,A=-1/0;for(let _ of u.events)_.start<=0&&_.end>=1440||(_.start>0?f=Math.min(f,_.start-20,_.arrive_by!=null?_.arrive_by-10:1/0):f=Math.min(f,_.end-30),_.end<1440?A=Math.max(A,_.end+20):A=Math.max(A,_.start+30));for(let _ of Re)_.start!=null&&(f=Math.min(f,_.start)),_.end!=null&&(A=Math.max(A,_.end));let D=u.from;D!=null&&Number.isFinite(f)&&f<D+60?f=D-15:u.date===n.date&&Number.isFinite(f)&&n.minutes>f-60&&n.minutes<A&&(f=Math.min(f,n.minutes-15));let T=Number.isFinite(f)?Math.floor((f-5)/30)*30:900,b=Math.max(Number.isFinite(A)?Math.ceil((A+5)/30)*30:960,T+60),w=_=>D!=null&&Z(_)<=T,k=_=>D!=null&&Z(_)<T,$=_=>Math.round(ue+(Math.max(T,Math.min(b,_))-T)*Xo);y.anchors.push({t:R+T,y:$(T)},{t:R+b,y:$(b)});for(let _ of a){let U=d.get(_),ne=g.get(_),ce=(u.kids[_]?.items??[]).filter(C=>C.start!=null&&C.end!=null&&!w(C.end)).map(C=>({item:C,s:Z(C.start),en:Z(C.end)})),J=[];for(let C of nr(ce)){let z=U.w/C.cols,I=Math.round(U.x+C.col*z),W=Math.round(z-(C.cols>1?4:0)),q=$(C.s),K=C.item;if(K.type==="act"){let he=H.get(K.event??"");if(!he)continue;let zt=Math.max(30,$(C.en)-q),nt=te(he,I,q,W,zt,K.clash,!1,_);if(nt.layer=Et,nt.cut=k(C.s),y.cards.push(nt),he.arrive_by!=null&&he.start-he.arrive_by>=5&&!nt.cut){let wn=$(he.arrive_by),As={key:`${u.date}|prep|${he.id}`,x:I,y:wn,w:W,h:q-wn+xe,color:ne,label:`Arrive by ${j(he.arrive_by)}`,layer:Et-1};y.preps.push(As),J.push({s:he.arrive_by,en:C.en,top:wn,bottom:q+zt,x:I,w:W,prep:As,card:nt})}else J.push({s:C.s,en:C.en,top:q,bottom:q+zt,x:I,w:W,card:nt});let _s=Ce.get(he.id);_s&&y.marks.push({key:`${u.date}|late|${he.id}`,x:I+W-4,y:q+4,text:_s,right:!0});let Ss=Ce.get(`${he.id}|pick`);Ss&&y.marks.push({key:`${u.date}|wait|${he.id}`,x:I+4,y:q+zt+2,text:Ss,right:!1});continue}let O=u.rides[K.ride??-1];if(!O)continue;let be=Math.max(22,$(C.en)-q),ft=In(et(O.index),m),Ts=v(O.driver),Es={key:`${u.date}|ride|${O.index}`,x:I,y:q,w:W,h:be,target:ze(O.index),l1:`${O.own?"In":"Along in"} ${Ts}’s car`,l2:ft.join(" → "),show2:ci(be)>0,lines2:ci(be),dashed:!O.own,clash:K.clash,aria:`${P(_)} ${O.own?"in":"riding along in"} ${Ts}’s car, ${j(Z(O.start))} to ${j(Z(O.end))}: ${ft.join(" to ")}`};y.rides.push(Es);let Cs=d.get(O.driver),xn=null;Cs&&(xn={key:`${u.date}|band|${O.index}`,x:I+W,y:q,w:Math.max(0,Cs.x+8-(I+W)),h:be,color:ne},y.bands.push(xn)),J.push({s:C.s,en:C.en,top:q,bottom:q+be,x:I,w:W,ride:Es,band:xn})}let tt=C=>C.ride?.layer??(C.prep?Et-1:Et),_e=(C,z,I,W)=>{I>xe&&y.links.push({key:`${C.key}|link`,x:C.x,y:z,w:C.w,h:I,color:ne,layer:W})},S=(C,z)=>{if(!(z.x<C.x||z.x+z.w>C.x+C.w)&&(C.x=z.x,C.w=z.w,C.ride.x=z.x,C.ride.w=z.w,C.band)){let I=C.band.x+C.band.w;C.band.x=z.x+z.w,C.band.w=Math.max(0,I-C.band.x)}},X=new Set;for(let C of[...J].sort((z,I)=>I.s-z.s)){let z=C.ride;if(!z)continue;let I=J.filter(K=>K!==C&&K.s>=C.en&&K.s-C.en<=ai&&K.top>=C.bottom).sort((K,O)=>K.s-O.s||K.top-O.top)[0];if(!I)continue;X.add(C),S(C,I);let W=tt(I),q=I.top-C.bottom;_e(z,C.bottom,q+xe,W-1),z.layer=W-(q>0?2:1),z.h+=xe,z.tuckBottom=xe}for(let C of[...J].sort((z,I)=>z.s-I.s)){let z=C.ride;if(!z||X.has(C))continue;let I=J.filter(K=>K!==C&&K.en<=C.s&&C.s-K.en<=ai&&K.bottom<=C.top&&(K.card||K.ride?.layer!=null)).sort((K,O)=>O.en-K.en||O.bottom-K.bottom)[0];if(!I)continue;S(C,I);let W=I.ride?.layer??Et,q=C.top-I.bottom;_e(z,I.bottom-xe,q+xe,W-1),z.layer=W-(q>0?2:1),z.y-=xe,z.h+=xe,z.tuckTop=xe}}for(let _ of c){let U=d.get(_),ne=u.drivers[_];if(!ne)continue;let ce=[],J=null;for(let S of ne.segments)if(!(S.start==null||S.end==null)){if(S.type==="home"){J=null;continue}if(S.type==="stay"){J=null,ce.push({type:"stay",g:S,s:S.start,en:S.end});continue}J&&J.en===S.start?(J.en=S.end,J.legs.push(S)):(J={type:"trip",s:S.start,en:S.end,legs:[S]},ce.push(J))}let tt=new Set,_e=(S,X,C,z)=>{tt.add(S.id);let I=$(X),W=te(S,U.x+8,I,U.w-16,Math.max(30,$(C)-I),!1,!1,_);W.cut=k(X),z&&W.drop?.tone==="normal"&&(W.drop=null,W.showDrop=!1),y.cards.push(W)};for(let S of ce){if(w(S.en))continue;let X=$(S.s),C=Math.max(24,$(S.en)-X);if(S.type==="stay"){let O=H.get(S.g.event??S.g.serves??"");if(O?.own===_){_e(O,S.s,S.en,!0);continue}let be=O?g.get(O.kid)??ee(0):ee(0),ft=S.g.kids.map(P);y.stays.push({cut:k(S.s),key:`${u.date}|stay|${_}|${S.s}`,x:U.x+8,y:X,w:U.w-16,h:C,target:se(O?.id),color:be,l1:O?`At ${O.title} with ${P(O.kid)}`:"Staying",l2:`until ${j(S.en)}`+(ft.length?` · ${ft.join(" and ")} too`:"")});continue}let z=S.legs[0],I=S.legs[S.legs.length-1],W=[];for(let O of S.legs)for(let be of O.kids)W.includes(be)||W.push(be);let q=I.type==="drive"&&I.to==="home",K=In(S.legs,m);y.trips.push({key:`${u.date}|trip|${_}|${S.s}`,x:U.x+8,y:X,w:U.w-16,h:C,target:se(S.legs.find(O=>O.serves)?.serves),l1:z.type==="drive"&&z.from==="home"?`Leave ${j(S.s)}`:`From ${tn(m,z.from??z.place)} ${j(S.s)}`,l2:K.join(" → "),show2:C>=36,l3:q?`Home ${j(S.en)}`:"",show3:q&&C>=62,stops:null,kids:W.map(O=>(g.get(O)??ee(0)).color),bad:S.legs.some(O=>O.overlaps_busy),aria:`${v(_)} drives ${K.join(" to ")}, ${j(S.s)} to ${j(S.en)}`})}for(let S of ne.segments)if(!(!S.overlaps_busy||S.start==null||S.end==null))for(let X of ne.busy){let C=Math.max(S.start,X.start),z=Math.min(S.end,X.end);z<=C||w(z)||y.overlaps.push({key:`${u.date}|overlap|${_}|${C}`,x:U.x+6,y:$(C)-2,w:U.w-12,h:Math.max(8,$(z)-$(C)+4)})}for(let S of u.events)if(S.own===_&&(!tt.has(S.id)&&!w(Ee(S)[1])&&_e(S,...Ee(S),!1),S.takes!=null&&S.attending!==!1&&!w(S.end))){let X=$(S.start);y.windows.push({key:`${u.date}|window|${S.id}`,x:U.x+4,y:X,w:U.w-8,h:Math.max(24,$(S.end)-X),label:`${S.title} · any time ${j(S.start)}–${j(S.end)}`})}for(let S of ne.busy){if(S.event||S.end<=T||S.start>=b)continue;let X=Ie(_,S),C=$(X.start),z=$(X.end);y.busy.push({key:`${u.date}|busy|${_}|${X.start}`,x:U.x+1,y:C,w:U.w-2,h:z-C,labelY:8,label:li(X,!1)})}}let B=-1/0;for(let _=T;_<=b;_+=30)y.grid.push({key:`${u.date}|grid|${_}`,y:$(_),strong:_%60===0}),_%60===0&&$(_)-B>=22&&(y.hours.push({key:`${u.date}|hour|${_}`,y:$(_)-8,label:Zs(_)}),B=$(_));u.date===n.date&&n.minutes>T&&n.minutes<b&&(y.now={y:$(n.minutes),label:`Now ${j(n.minutes)}`}),E=$(b)+zn;return}let V=[];for(let f of a){let A=d.get(f);for(let D of u.kids[f]?.items??[])if(D.start!=null){if(D.type==="act"){let T=H.get(D.event??"");if(!T)continue;V.push({col:f,s:D.start,h:gi(T,A.w),kind:"act",item:D})}else if(!u.rides[D.ride??-1]?.own){let T=u.rides[D.ride??-1],b=T?u.drivers[T.driver]?.outings.find(w=>w.start!=null&&w.start<=Z(T.start)&&Z(T.start)<=Z(w.end,w.start)):void 0;V.push({col:f,s:b?.start??D.start,h:lr,kind:"along",item:D})}}}for(let f of c){let A=u.drivers[f];if(!A)continue;for(let T of A.busy)T.event||V.push({col:f,s:T.start,h:32,kind:"busy",busy:Ie(f,T)});let D=d.get(f).w;for(let T of u.events)T.own!==f||T.attending!==!1&&(T.takes==null||T.planned!=null)||V.push({col:f,s:Ee(T)[0],h:gi(T,D),kind:"own",event:T});for(let T of A.outings){if(T.start==null)continue;let b=T.lines.length-(pi(T.lines)?1:0);V.push({col:f,s:T.start,h:30+b*16+(T.warn?16:0),kind:"out",out:T})}}V.sort((f,A)=>f.s-A.s||h.indexOf(f.col)-h.indexOf(A.col));let fe=new Map,re=[],L=new Map,G=ue-hi;for(let f=0;f<V.length;){let A=f,D=G+hi;for(;A<V.length&&V[A].s===V[f].s;A++){let b=fe.get(V[A].col);b!=null&&(D=Math.max(D,b+Qt))}let T=new Set;for(let b=f;b<A;b++){let w=V[b],k=T.has(w.col)?fe.get(w.col)+Qt:D;T.add(w.col),fe.set(w.col,k+w.h)}L.set(V[f].s,D),V[f].s>0&&y.hours.push({key:`${u.date}|hour|${V[f].s}`,y:D+2,label:We(V[f].s)}),G=D,f=A}fe.clear(),V.forEach((f,A)=>{let D=fe.get(f.col),T=Math.max(D!=null?D+Qt:ue,L.get(f.s));fe.set(f.col,T+f.h);let b=f.kind==="busy"?f.busy.end:f.kind==="act"?H.get(f.item.event??"")?.end??null:f.kind==="own"?Ee(f.event)[1]:null;re.push({col:f.col,s:f.s,end:b,y:T,h:f.h,box:null}),y.anchors.push({t:R+f.s,y:T});let w=d.get(f.col);if(f.kind==="busy"){let k={key:`${u.date}|busy|${f.col}|${A}`,x:w.x+1,y:T,w:w.w-2,h:f.h,labelY:8,label:li(f.busy,!0)};y.busy.push(k),re[re.length-1].box=k}else if(f.kind==="out"){let k=f.out,$=pi(k.lines),B=$?k.lines.slice(0,-1):k.lines;y.trips.push({key:`${u.date}|trip|${f.col}|${A}`,x:w.x+8,y:T,w:w.w-16,h:f.h,target:se(k.target),l1:$?`${k.lead} · home ${$}`:k.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...B.map(_=>({text:_,warn:!1})),...k.warn?[{text:k.warn,warn:!0}]:[]],kids:k.kids.map(_=>(g.get(_)??ee(0)).color),bad:!!k.warn,aria:`${v(f.col)}: ${k.lead}. ${k.lines.join(". ")}${k.warn?`. ${k.warn}`:""}`})}else if(f.kind==="own"){let k=te(f.event,w.x+8,T,w.w-16,f.h,!1,!0,f.col);y.cards.push(k),re[re.length-1].box=k}else if(f.kind==="act"){let k=H.get(f.item.event??""),$=te(k,w.x,T,w.w,f.h,f.item.clash,!0,f.col);y.cards.push($),re[re.length-1].box=$}else{let k=u.rides[f.item.ride??-1],$=In(et(k.index),m),B=v(k.driver);y.rides.push({key:`${u.date}|ride|${k.index}`,x:w.x,y:T,w:w.w,h:f.h,target:ze(k.index),l1:`${nn} with ${B}`,l2:$.join(" → "),show2:!1,lines2:wi,dashed:!0,clash:f.item.clash,aria:`${P(f.col)} riding along with ${B}, ${j(Z(k.start))} to ${j(Z(k.end))}: ${$.join(" to ")}`})}});let F=ue;for(let f of fe.values())F=Math.max(F,f);for(let f of re){if(!f.box||f.end==null)continue;let A=f.y+f.h;for(let D of re)D.col!==f.col&&D.s>=f.s&&D.s<f.end&&(A=Math.max(A,D.y+D.h));f.end>=1440&&(A=F);for(let D of re)D.col===f.col&&D.y>f.y&&(A=Math.min(A,D.y-Qt));A=Math.min(A,F),A>f.y+f.h&&(f.box.h=A-f.y)}E=F+zn+6,y.anchors.push({t:R+1439,y:E})}),y.height=E,y}var dr=["","¼","½","¾"];function Ve(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Tt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=dr[o%4];return`${i||!r?i:""}${r} min`})}function Ti(s){let t=e=>e?{...e,text:Ve(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Ve),warn:i.warn==null?i.warn:Ve(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:Ve(n.title),body:Ve(n.body),note:n.note==null?n.note:Ve(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Ve(o.note)}))}:{}}))}))}}var cr=2,hr=48;function Ei(s,t,e=hr){let n=[],o=new Set(me(s)),i=we(s).map(g=>le(s,g)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],l=0,d=0,a=0,c=0,h=t.minutes+e*60;for(let g of s.days){let m=ye(t.date,g.date),P=m===0?"":`${ae(g.date)} · `,v=new Map(g.events.map(u=>[u.id,u])),y=u=>u&&v.has(u)?{day:g.date,event:u}:null,E=(u,M)=>m*1440+(u??v.get(M??"")?.start??0)<h;for(let u of g.issues)if(u.level==="problem"){if(!E(u.at,u.event)){a++,u.kind==="unassigned"&&c++;continue}l++,u.kind==="unassigned"&&d++,n.push({key:`${g.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:P+u.title,body:u.body,target:y(u.event),suggestions:(u.suggestions??[]).map(M=>({id:M.id,label:M.label,note:M.note}))})}if(g.clashes.forEach((u,M)=>{if(!E(u.a.start,u.a.event)){a++;return}l++;let R=v.get(u.a.event??""),H=le(s,u.kid),se=(N,Le)=>{let ie=y(Le);return ie?{text:N,target:ie}:N},de=[];if(u.b.type==="act"){let N=v.get(u.b.event??"");R&&N&&(de=[se(R.title,R.id),` ${j(R.start)}–${j(R.end)} and `,se(N.title,N.id),` ${j(N.start)}–${j(N.end)} overlap.`])}else{let N=g.rides[u.b.ride??-1];R&&N&&(de=[`${H} is in `,se(`${oe(s,N.driver)}’s car`,N.serves[0]),` ${j(Z(u.b.start))}–${j(Z(u.b.end))}, during `,se(R.title,R.id),"."])}n.push({key:`${g.date}|clash|${M}`,tone:"problem",title:`${P}${H} is double-booked`,body:de.map(N=>typeof N=="string"?N:N.text).join(""),parts:de,target:null,suggestions:[]})}),m>=0&&m<cr)for(let u of g.issues)u.level!=="heads_up"||!E(u.at,u.event)||n.push({key:`${g.date}|${u.key}`,tone:"heads_up",title:P+u.title,body:u.body,target:y(u.event),suggestions:[]});for(let u of g.unplaced??[]){if(!E(u.at)){a++;continue}l++;let M=u.people.map(R=>o.has(R)?oe(s,R):le(s,R));n.push({key:`${g.date}|unplaced|${u.id}`,tone:"problem",title:`${P}${j(u.at)} ${u.title}: ${Ci(u).toLowerCase()}`,body:u.reason==="unknown"&&u.word?`“${u.word}” isn’t anyone in the family, so this is only in ${rn(M)}’s lane. If it’s a misspelt name, fix the title in Google Calendar.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Start the title in Google Calendar with who it’s for, such as “${r[0]} Piano”, or “${r.join(" & ")} Piano” for both.`,target:null,suggestions:[]})}for(let u of g.events)!u.problems.length||!E(u.start)||n.push({key:`${g.date}|notes|${u.id}`,tone:"heads_up",title:`${P}Check the notes on ${on(s,u)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:y(u.id),suggestions:[]})}return{items:n,problems:l,unassigned:d,later:a,laterUnassigned:c}}function Ci(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function pr(s,t,e,n){let o=new Set(me(s)),i=c=>{let h=c[0];return h==null?null:o.has(h)?_t:e.get(h)??null},r=[...(t.all_day??[]).map(c=>({key:`${t.date}|allday|${c.id}`,title:c.title,note:c.days>1?`Day ${c.day_number} of ${c.days}`:"",color:i(c.people),cancelled:c.cancelled,warn:!1})),...(t.unplaced??[]).map(c=>({key:`${t.date}|unplaced|${c.id}`,title:`${j(c.at)} ${c.title}`,note:Ci(c),color:null,cancelled:!1,warn:!0}))];if(!r.length)return null;let l=Math.max(120,n-rt),d=1,a=0;for(let c of r){let h=Math.min(l,30+7*(c.title.length+(c.note?c.note.length+2:0)));a&&a+h>l&&(d++,a=0),a+=h}return{key:`${t.date}|allday`,h:d*Qo+(d-1)*bi,chips:r}}function _i(s,t){let e=pe(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=ye(t.date,i.date);if(!(r<0))for(let l of me(s))for(let d of i.drivers[l]?.outings??[]){if(d.start==null)continue;let a=r*1440+d.start;if(r*1440+Z(d.end,d.start)<=t.minutes)continue;let h=a-t.minutes,g={driver:l,name:oe(s,l),date:i.date,ahead:r,start:d.start,inMinutes:h,ongoing:h<=0,lead:d.lead,stop:(d.lines[0]??"").replace(/\s+/g," ").trim(),kids:d.kids.map(m=>e.get(m)??ee(0)),warn:d.warn,target:d.target&&i.events.some(m=>m.id===d.target)?{day:i.date,event:d.target}:null};(!n||o(g)<o(n)||o(g)===o(n)&&g.inMinutes<n.inMinutes)&&(n=g)}}return n}function at(s){return s.state==="done"||s.state==="late"}var ur=780;function fr(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<ur}function Si(s,t){return s.chores.map(e=>fr(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function Ai(s){return s.state==="open"||s.state==="overdue"}function Gn(s,t,e){if(at(s)){let n=s.done_at?gr(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Kn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Kn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=ye(t,s.due);return`By ${o===1?"tomorrow":o<7?ae(s.due):Vn(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Kn(s.for_day,t)}`;if(s.due&&s.due>t){let n=ye(t,s.due);return n===1?"By tomorrow":`By ${n<7?ae(s.due):Vn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Kn(s,t){let e=ye(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ae(s):Vn(s)}function Vn(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function gr(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${ae(i)} ${r}`}function Pi(s,t,e=1440){let n=Si(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(c=>c.kid===o.id),l=new Map;for(let c of r){if(c.state!=="upcoming")continue;let h=c.shows_from??c.due??s.today;l.set(h,[...l.get(h)??[],c])}let d=r.filter(c=>c.state==="overdue"),a=r.filter(c=>c.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??ee(i),overdue:d,now:a,done:r.filter(at),later:[...l.entries()].sort(([c],[h])=>c.localeCompare(h)).map(([c,h])=>({date:c,chores:h})),left:d.length+a.length}})}function Mi(s,t=1440){return Si(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function qn(s){return!s.chores.length&&!s.templates.length}var Ge=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Yn(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>Ge.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function Xn(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Ge[n[0]]}-${Ge[n.at(-1)]}`]:n.map(o=>Ge[o])).join(", ")}var qe="none";function an(s){return s==="daily"||s==="school"?"":"Any"}function Di(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Li(s){let t=s.days??an(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function Zn(s){return s.title.trim()?s.who.length?s.days===qe?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function ji(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function Jn(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function Qn(s,t,e=1,n=!1,o=!1){if(s==="school"){let c=t.trim().replace(/-/g,"–"),h=o?c?`${c} Bring lunch days`:"Bring lunch days":c?`${c} school days`:"Every school day";return n?`${h}, the night before`:h}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,l=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(l))return e>1?`Every day, every ${e} weeks`:"Every day";if(!l||l.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${l.replace(/-/g,"–")} ${r}`;let a=`${l.split(",").map(c=>{let h=c.trim();return h.toLowerCase()==="last"?"the last day":/^\d+$/.test(h)?`the ${Jn(Number(h))}`:`the ${h}`}).join(" and ")} ${r}`;return a[0].toUpperCase()+a.slice(1)}function es(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function ts(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function ln(s,t){return`${s}|${t}`}function lt(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function dn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Ri(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function zi(s,t){return dn(t)<5&&!Ri(s,t)}function St(s,t,e=new Map){if(!zi(s,t))return null;let n=ln(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function dt(s,t){return zi(s,t)?s.menus?.[t]??null:null}var mr="From the school's menu feed.";function br(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==mr);return t.length?t.join(`
`):null}function $e(s){return s.slice(0,7)}function cn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function ns(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Ii(s){let t=[];for(let e=$e(s.first);e<=$e(s.last);e=ns(e))t.push(e);return t}function Bi(s,t,e,n=new Map){let o=`${e}-01`,i=lt(o,-dn(o)),r=[];for(;$e(i)<=e;){let l=[];for(let d=0;d<5;d++){let a=lt(i,d),c=$e(a)!==e,h=c?null:Ri(t,a),g=c?null:St(t,a,n);l.push({date:a,day:Number(a.slice(8)),outside:c,off:h?h.title:null,lunch:g?.lunch??null,picked:g?.picked??!1,menu:c?null:dt(t,a)?.dish??null,sides:c?null:br(dt(t,a)?.details??""),past:a<s.today,today:a===s.today})}l.some(d=>!d.outside)&&r.push(l),i=lt(i,7)}return r}function Oi(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Ni(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Ui(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=lt(t,i),l=St(s,r,n);if(!l)continue;let d=ye(t,r);return{lunch:l.lunch,when:d===0?"today":d===1?"tomorrow":ae(r),date:r,menu:dt(s,r)?.dish??null}}return null}var vr={timeline:"timeline",full:"timeline",compact:"compact"};function At(s){let t=new URLSearchParams(s),e={},n=vr[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}function ss(s,t=0){return s==null||!Number.isFinite(s)?t:s}function yr(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function xr(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&ss(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function wr(s,t){let e=new Set(s.events.filter(i=>yr(s,i)<=t).map(i=>i.id)),n=i=>ss(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(l=>!o(l))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:xr(r.segments,t),outings:r.outings.filter(l=>l.start==null||ss(l.end,l.start)>t),busy:r.busy.filter(l=>l.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function Hi(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?wr(e,t.minutes):e)}}var Fi=Be`
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
  /* All-day events, glued under the date line and floating with it. */
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
    cursor: pointer;
  }
  .choice {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
`;var Ao="mydashlight.rides.mode",Qa=1100,el=440,tl=700,nl=3*6e4,sl=1200;function il(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var yn=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Eo=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,ol=new URL("emoji.json",import.meta.url).href,Co=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],_o=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,So=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,rl=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,al=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Dt={bring:"Bring",buy:"Buy"};function ll(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Te(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function ks(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function dl(s,t){return Wn(s,t)||ve(s).split(",")[0]}function cl(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function hl(){try{return localStorage.getItem(Ao)==="compact"?"compact":"timeline"}catch{return"timeline"}}function pl(s){try{localStorage.setItem(Ao,s)}catch{}}function Lt(s){return s.days.every(t=>!t.events.length)}var jt=class extends ge{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=At(location.search).view;this.urlPage=At(location.search).page;this.urlPast=At(location.search).past;this.urlDayPicker=At(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},nl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??hl(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.railTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,l]=o.split("|"),d=e.kids.find(a=>a.id===r);(!d||(d.picks[l]??null)===i||!St(d,l))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&at(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Ti(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Qa)return!1;let e=this.plan;return!e||this.width-el>=Nn(we(e).length,me(e).length)}today(){return kt(this.plan?.time_zone??il())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Hi(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=ki(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(c=>c.date===this.pinDay)?.h??Ct,l=Hn(e,i.scrollTop+r+4),d=n.days[Math.floor(l/1440)]?.date,a=d?o.days.findIndex(c=>c.date===d):-1;a>=0&&(this.keepAt=a*1440+(l-Math.floor(l/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,yi(o,e)-mi(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),l=o.days[r];if(!l)return;let d=1/0;if(this.mode==="timeline"){for(let a of l.events)d=Math.min(d,a.arrive_by??a.start);for(let a of Object.values(l.drivers))for(let c of a.outings)c.start!=null&&(d=Math.min(d,c.start))}this.scrollToTime(r*1440+(Number.isFinite(d)?Math.max(0,d-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=n+1&&(o=d);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),l=this.today().date;if(r){let d=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),a=d>0?"up":"down";this.board.dayHeads.some(c=>c.date===l)&&o.date!==l?i=`${a}|Today`:this.mode==="timeline"&&Math.abs(d)>e.clientHeight*.6&&(i=`${a}|${o.date===l?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let d=r instanceof Y?r:new Y("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??at(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=dt(e,n),r=o.filter(l=>l.id===e.id||i&&dt(l,n)?.dish===i.dish).map(l=>l.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof Y?o:new Y("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(ln(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let l=new Map(this.lunchDraft);for(let a of n)l.delete(ln(e,a));this.lunchDraft=l;let d=r instanceof Y?r:new Y("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Li(e):Di(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(To(),ko))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Zn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(ji(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof Y?n:new Y("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof Y?n:new Y("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Ct;this.keepAt=n&&this.board?Hn(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||pl(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof Y?i:new Y("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,l=r.includes(n)?r.filter(d=>d!==n):[...r,n];this.save(`along-${o}`,l,()=>i.setTakeAlong(e.id,l,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),sl)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,l=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,l)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?Ei(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,l=this.chores?Mi(this.chores,this.today().minutes).filter(g=>!this.choreDone(g)):[],d=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,a=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",c=p`<aside class="panel" aria-label=${a}>
      ${d??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,l))}
    </aside>`,h=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<tl?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,l.length)} ${h?this.renderBanner(e):x}
          <main>
            ${h?p`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Lt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Lt(o)?this.renderDayRail(o):x}
                  ${n&&this.away?this.renderBackToToday(this.away):x}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${c}`:x}
          </main>
        </div>
        ${r?c:x}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:x}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),l="";if(e){let g=e.time_zone,m=new Date(e.updated);this.error?l=p`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Gt(m,new Date,g)}</span>`:e.status&&!e.status.ok?l=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Gt(m,new Date,g)}</span>`:this.backend?.live||(l=`Updated ${Gt(m,new Date,g)}`)}let d=(g,m,P,v)=>p`
      <button type="button" class="seg-btn" title=${v} aria-pressed=${this.mode===g?"true":"false"} @click=${()=>this.setMode(g)}>
        ${P}<span class="seg-label">${m}</span>
      </button>
    `,a=(g,m,P)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===g?"true":"false"} @click=${()=>this.setPage(g)}>
        ${P}<span class="seg-label">${m}</span>
      </button>
    `,c=We(r.minutes),h=!!e&&Lt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Q`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:x}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ve(r.date)}, ${c}`}>
            <span class="hm">${c.slice(0,-3)}</span><span class="ampm">${c.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${ve(r.date)}${typeof l=="string"&&l?p`<span class="status"> · ${l}</span>`:x}
          </p>
          ${l&&typeof l!="string"?p`<p class="status">${l}</p>`:x}
        </div>
        ${e&&!h?this.renderNext(e,_i(e,r),n):x}
        <div class="controls">
          ${this.wide||h&&!o?x:p`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?x:p`<div role="group" aria-label="View" class="seg">
            ${d("timeline","Timeline",Q`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${d("compact","Compact",Q`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${a("rides","Rides",Q`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${a("chores","Chores",Q`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?x:a("lunch","Lunch",Q`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let a=this.today().date,c=o.unassigned,h=o.laterUnassigned;if(c){let m=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${c} ${c===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?p`<div class="next idle needs">${m}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${m}</button>`}if(h)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let g=e.days.some(m=>m.date>=a&&m.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${g?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${g?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${Tt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${ae(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,l=p`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Te(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(a=>p`<span class="kid-dot" style="background:${a.color}"></span>`)}</span>
        ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:x}
      </span>
    `,d=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?p`<button type="button" class=${d} @click=${()=>this.open(n.target)}>${l}</button>`:p`<div class=${d}>${l}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return x;let n=this.today().date,o=pe(e),i=this.railShown;return p`<div
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
        ${e.days.map(r=>{let l=Fn(r),d=r.events.length,a=r.events.slice(0,4).map(h=>h.own?_t.color:o.get(h.kid)?.color??ee(0).color),c=`${ve(r.date)}: ${d?`${d} ${d===1?"activity":"activities"}`:"nothing planned"}${l?`, ${l} to sort out`:""}`;return p`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${c}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":ae(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${a.length?a.map(h=>p`<span class="rd-dot" style="background:${h}"></span>`):p`<span class="rd-free">free</span>`}
            </span>
            ${l?p`<span class="rd-badge" aria-hidden="true">${l}</span>`:x}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return p`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${Q`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=we(e),o=me(e),i=pe(e),r=n.map(l=>le(e,l));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((l,d)=>Q`<circle cx=${50+d*30} cy="80" r="11" fill=${i.get(l).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${cl(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(l=>{let d=i.get(l);return p`<div class="qw-person" style="--c:${d.color};--rgb:${d.rgb}">
            <span class="avatar" aria-hidden="true">${Te(le(e,l))}</span>
            <span class="qw-name">${le(e,l)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(l=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Te(oe(e,l))}</span>
            <span class="qw-name">${oe(e,l)}</span>
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
      </div>
      ${e.allDay.length?p`<div class="day-strip" style="padding-left:${rt}px">
            ${e.allDay.map(o=>p`<span
                  class="strip-chip ${o.warn?"warn":""} ${o.cancelled?"skipped":""} ${o.color?"":"plain"}"
                  style=${o.color?`--c:${o.color.color};--rgb:${o.color.rgb};--ink:${o.color.ink}`:""}
                  ><span class="strip-title">${o.title}</span>${o.note?p`<span class="strip-note">${o.note}</span>`:x}</span
                >`)}
          </div>`:x}`}renderBoard(e){let n=this.sel,o=a=>!!a&&!!n&&a.day===n.day&&a.event===n.event,i=e.dayHeads.find(a=>a.date===this.pinDay)??e.dayHeads[0],r=e.width,l=100,d=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??l-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??l})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??l+1}))].sort((a,c)=>a.z-c.z);return p`
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
        <div class="heads" style="width:${r}px">
          ${e.columns.map(a=>p`<div class="col-head ${a.kind}" style="left:${a.x}px;width:${a.w}px;--c:${a.dot};--rgb:${a.rgb}">
              <span class="avatar ${a.kind}" aria-hidden="true">${Te(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0):x}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        ${i?p`<div class="pinned" aria-hidden="true" style="width:${r}px;height:${i.h}px;margin-bottom:${-i.h}px">
              ${this.renderHead(i,!0)}
            </div>`:x}
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(a=>p`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>p`<div class="day-head" style="top:${a.y}px;width:${r}px;height:${a.h}px">${this.renderHead(a)}</div>`)}
          ${e.empties.map(a=>p`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>p`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(a=>p`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${Me(e.bands,a=>a.key,a=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${Me(e.busy,a=>a.key,a=>p`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${Me(e.windows,a=>a.key,a=>p`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${Me(d,a=>a.x.key,a=>{if(a.t==="link"){let m=a.x;return p`<div
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
                  class="ride ${m.dashed?"dashed":""} ${m.clash?"clash":""}"
                  aria-label=${m.aria}
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;padding-top:${3+(m.tuckTop??0)}px;padding-bottom:${3+(m.tuckBottom??0)}px"
                  @click=${()=>this.open(m.target)}
                >
                  <span class="l1">${m.l1}</span>${m.show2?p`<span class="l2" style="-webkit-line-clamp:${m.lines2}">${m.l2}</span>`:x}
                </button>`}let c=a.x,h=c.color,g=c.skipped?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.10) 0px, rgba(${h.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:c.stayed?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.24) 0px, rgba(${h.rgb},0.24) 6px, rgba(${h.rgb},0.08) 6px, rgba(${h.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${h.rgb},0.15), rgba(${h.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${c.wrap?"wrap":""} ${o(c.target)?"sel":""} ${c.clash?"clash":""} ${c.skipped?"skipped":""} ${c.cut?"cut":""}"
                aria-label=${c.aria}
                style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px;background:${g};border-color:${c.clash?"var(--bad)":`rgba(${h.rgb},0.45)`};--c:${h.color};--rgb:${h.rgb};--ring:${h.color}"
                @click=${()=>this.open(c.target)}
              >
                <span class="top">
                  <span class="title">${c.title}</span>
                  <span class="time">${c.time}</span>
                  ${c.showDrop&&c.drop?p`<span class="line tone-${c.drop.tone}">${c.drop.text}</span>`:x}
                </span>
                ${c.showPick&&c.pick?p`<span class="line tone-${c.pick.tone}">${c.pick.text}</span>`:x}
              </button>`})}
          ${Me(e.stays,a=>a.key,a=>p`<button
                type="button"
                class="stay ${a.cut?"cut":""}"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${Me(e.trips,a=>a.key,a=>p`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(c=>p`<span class="kid-dot" style="background:${c}"></span>`)}</span>
                ${a.show2?p`<span class="l2">${a.l2}</span>`:x}
                ${a.stops?a.stops.map(c=>p`<span class="stop ${c.warn?"warn":""}">${c.text}</span>`):x}
                ${a.show3?p`<span class="l3">${a.l3}</span>`:x}
              </button>`)}
          ${Me(e.overlaps,a=>a.key,a=>p`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${Me(e.marks,a=>a.key,a=>p`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:x}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,l=this.plan,d=i+n.length,a=this.chores,c=!!a&&!qn(a);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${d?"bad":"ok"}">${d}</span>
        ${this.wide?x:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${c?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?p`<div class="attn-chores">${n.map(h=>this.renderChoreRow(h,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${l&&!i?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${Q`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Lt(l)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:x}
      ${o.map(h=>p`<div class="issue ${h.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${h.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${h.target?p`<button type="button" class="issue-title" @click=${()=>this.open(h.target,!0)}>${h.title}</button>`:p`<strong class="issue-title">${h.title}</strong>`}
              <span class="issue-body"
                >${h.parts?h.parts.map(g=>typeof g=="string"?g:p`<button type="button" class="issue-link" @click=${()=>this.open(g.target,!0)}>${g.text}</button>`):h.body}</span
              >
            </div>
          </div>
          ${h.suggestions.length?p`<div class="fixes">
                ${h.suggestions.map(g=>p`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(g.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${g.id}`?"Saving…":g.label}</span>
                    <span class="fix-note">${g.note}</span>
                  </button>`)}
              </div>`:x}
        </div>`)}
      ${this.wide&&l&&!Lt(l)&&this.page==="rides"?this.renderLegend():x}
    `}kidColorOf(e){let n=this.plan?pe(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return ee(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(a=>a.id===e);if(!o||!i)return x;this.tick;let r=this.today(),l=Ui(i,r.date,r.minutes,this.lunchDraft);if(!l)return x;let d=Dt[l.lunch];return p`<span class="lunch-chip ${l.lunch} ${n?"small":""}" title=${`${d} lunch ${l.when}${l.menu?`: ${l.menu}`:""}`}
      >${l.lunch==="bring"?_o:So}<span class="lunch-chip-text"
        >${d}${n?x:` ${l.when}`}${!n&&l.menu?p`<span class="lunch-chip-menu"> · ${l.menu}</span>`:x}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Ii(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:$e(e.today),i=n.indexOf(o),r=c=>{let h=n[i+c];h&&(this.lunchMonth=h)},l=e.kids.some(c=>c.id===this.lunchKid)?this.lunchKid:null,d=l?e.kids.filter(c=>c.id===l):e.kids,a=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:x;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${Q`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${cn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${Q`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":p`${Eo} Edit menus`}
        </button>
      </div>
      ${a}
      <div class="chore-cols lunch-cols ${l?"wide":""}" style="--n:${d.length}">
        ${d.map(c=>this.renderLunchCard(e,c,o,l!==null))}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),l=Bi(e,n,o,this.lunchDraft),d=Ni(l),a=l.flat(),c=a.filter(v=>!v.outside&&!v.past&&v.lunch),h=n.days_off.filter(v=>$e(v.first)<=o&&o<=$e(v.last)),g=v=>c.filter(y=>dn(y.date)===v),m=v=>{let y=g(v);if(!y.length)return;let E=y.every(u=>u.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,y.map(u=>u.date),E)},P=c.length?`${d.bring} Bring · ${d.buy} Buy${o===$e(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Te(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${P}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Dt[n.default]} unless picked</span>
          ${e.kids.length<2?x:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?al:rl}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:x}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${cn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((v,y)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!g(y).length}
            aria-label=${`${g(y).every(E=>E.lunch==="bring")?"Buy":"Bring"} every ${v} left in ${cn(o)} for ${n.name}`}
            @click=${()=>m(y)}
          >
            ${v}
          </button>`)}
        ${a.map(v=>this.renderLunchCell(n,v,i))}
      </div>
      ${h.length?p`<p class="lunch-offs">
            No school:
            ${h.map(v=>{let y=v.first<`${o}-01`?`${o}-01`:v.first,E=$e(v.last)>o?lt(`${ns(o)}-01`,-1):v.last;return`${y===E?ks(y):`${ks(y)}–${ks(E)}`} ${Oi(v.title)}`}).join(" · ")}
          </p>`:x}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return p`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",l=n.menu?`, ${n.menu}`:"",d=this.menuMode,a=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),c=d?`${e.name}, ${ve(n.date)}${l||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${ve(n.date)}: ${Dt[i]}${n.picked?"":" (not picked yet)"}${l}. Tap to ${Dt[r]}.`;return p`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${d?"editing":""} ${a?"sel":""}"
      ?disabled=${n.past&&!d}
      aria-label=${c}
      @click=${()=>d?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?_o:So}${Dt[i]}</span>
      ${n.menu?p`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?p`<span class="lunch-sides">${n.sides}</span>`:x}`:d?p`<span class="lunch-menu add">${yn} Menu</span>`:x}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(E=>E.id===e.kid),l=(this.plan?pe(this.plan).get(e.kid):void 0)??ee(Math.max(0,r)),d=o.kids[r]?.name??"",a=i===at(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},c=i&&a.done_by&&a.done_by!==e.kid?o.people?.find(E=>E.id===a.done_by)?.name??a.done_by_name??null:null,h=`${Gn(a,o.today,o.time_zone)}${c?` · by ${c}`:""}`,g=i||Ai(e),m=`${n?`${d}: `:""}${e.title}. ${h?`${h}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,P=p`<span class="box" aria-hidden="true"
        >${i?Q`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:x}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:x}
      <span class="chore-text">
        <span class="chore-title">${n?p`<span class="chore-kid">${d}</span> · `:x}${e.title}</span>
        ${h?p`<span class="chore-note">${h}</span>`:x}
      </span>`,v=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${g?"":"later"}`,y=`--c:${l.color};--rgb:${l.rgb};--k:${l.ink}`;return g?p`<button type="button" class=${v} style=${y} aria-pressed=${i?"true":"false"} aria-label=${m} @click=${()=>this.tapChore(e)}>
          ${P}
        </button>`:p`<div class=${v} style=${y}>${P}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(qn(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${yn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:x;this.tick;let i=Pi(e,this.plan?pe(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${yn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Eo} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let l=r.overdue.filter(d=>!this.choreDone(d)).length+r.now.filter(d=>!this.choreDone(d)).length;return p`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Te(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${l?`${l} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(d=>this.renderChoreRow(d))}`:x}
            ${r.now.length?p`<h3 class="chore-group">To do</h3>
                  ${r.now.map(d=>this.renderChoreRow(d))}`:x}
            ${r.done.length?p`<h3 class="chore-group">Done</h3>
                  ${r.done.map(d=>this.renderChoreRow(d))}`:x}
            ${r.later.map(d=>p`<h3 class="chore-group">${d.date===e.today?"Later today":dl(d.date,e.today)}</h3>
                ${d.chores.map(a=>this.renderChoreRow(a))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?p`<p class="chore-none">No chores this week.</p>`:x}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?pe(this.plan):void 0,r=this.choreEdit?.template===e.id,l=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(ts).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${es(e.who,o,e.take_turns)} · ${Qn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:x}</span>
        ${l}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(d=>{let a=o.findIndex(h=>h.id===d),c=i?.get(d)??ee(Math.max(0,a));return p`<span class="kid-dot" style="background:${c.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${yn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(l=>l.repeats===o);return r.length?p`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(l=>this.renderTemplateRow(l))}</div>
                </section>`:x}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return p``;let o=n.kids,i=this.plan?pe(this.plan):void 0,r=this.choreBusy,l=e.template?n.templates.find(v=>v.id===e.template):void 0,d=Zn(e),a=(l?.problems??[]).filter(v=>v!=="who:"),c=(v,y,E,u=!1)=>p`<button type="button" class="choice ${u?"wide":""}" aria-pressed=${v?"true":"false"} ?disabled=${r} @click=${E}>${y}</button>`,h=(v,y,E,u)=>p`<button type="button" class="chip" aria-pressed=${v?"true":"false"} aria-label=${u??x} ?disabled=${r} @click=${E}>${y}</button>`,g=v=>{v!==e.repeats&&this.changeDraft({repeats:v,days:l&&l.repeats===v?l.days??an(v):an(v)})},m=v=>{let y=e.who.includes(v)?e.who.filter(E=>E!==v):o.filter(E=>E.id===v||e.who.includes(E.id)).map(E=>E.id);this.changeDraft({who:y})},P;if(e.repeats==="school"){let v=e.days===qe?new Set:e.days===""?new Set([0,1,2,3,4]):Yn(e.days)??new Set,y=E=>{let u=new Set(v);u.has(E)?u.delete(E):u.add(E),this.changeDraft({days:u.size===5?"":u.size?Xn(u):qe})};P=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Ge.slice(0,5).map((E,u)=>h(v.has(u),E.slice(0,2),()=>y(u),E))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${c(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${c(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${c(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let v=e.days.trim(),y=/^\d+$/.test(v)?Number(v):null,E=v&&v.toLowerCase()!=="any"&&v.toLowerCase()!=="last"&&y===null;P=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${E?4:3}, minmax(0, 1fr))">
          ${c(v===""||v.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${c(y!==null,"On a date",()=>this.changeDraft({days:String(y??1)}))}
          ${c(v.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${E?c(!0,v,()=>{}):x}
        </div>
        ${y!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||y<=1} @click=${()=>this.changeDraft({days:String(y-1)})}>−</button>
                <span class="arrive-value">${Jn(y)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||y>=31} @click=${()=>this.changeDraft({days:String(y+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${v.toLowerCase()==="last"?"Due on the month’s last day.":E?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")P=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let v=e.days===""||e.days.toLowerCase()==="any",y=e.days===qe?new Set:v?new Set:Yn(e.days)??new Set,E=u=>{let M=new Set(y);M.has(u)?M.delete(u):M.add(u),this.changeDraft({days:M.size?Xn(M)||"Mon-Sun":qe})};P=p`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${c(v,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${c(!v,"On set days",()=>this.changeDraft({days:v?"Sat":e.days}))}
        </div>
        ${v?p`<p class="field-hint">Shows all week, due on Sunday.</p>`:p`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Ge.map((u,M)=>h(y.has(M),u.slice(0,2),()=>E(M),u))}
              </div>
              <div class="chips">
                ${h(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${h(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:x}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?es(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===qe?"No days picked":Qn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${a.length?p`<p class="field-hint bad">${a.map(ts).join(". ")}. Saving fixes it.</p>`:x}
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
          ${Co.map(v=>h(e.icon===v,v,()=>this.changeDraft({icon:e.icon===v?null:v}),`Picture ${v}`))}
          ${e.icon&&!Co.includes(e.icon)?h(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):x}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${ol}
              @emoji-click=${v=>{let y=v.detail.unicode;y&&this.changeDraft({icon:y}),this.iconMore=!1}}
            ></emoji-picker>`:x}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((v,y)=>{let E=i?.get(v.id)??ee(y),u=e.who.includes(v.id);return p`<button type="button" class="who-chip" style="--c:${E.color};--rgb:${E.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${r} @click=${()=>m(v.id)}>
              <span class="avatar" aria-hidden="true">${Te(v.name)}</span>${v.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${c(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${c(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:x}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${c(e.repeats==="daily","Every day",()=>g("daily"))}
          ${c(e.repeats==="weekly","Every week",()=>g("weekly"))}
          ${c(e.repeats==="monthly","Every month",()=>g("monthly"))}
          ${c(e.repeats==="school","School days",()=>g("school"))}
        </div>
      </div>
      ${P}
      ${e.repeats==="school"?x:p`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${ll(e.repeats,e.every)}</span>
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
      ${e.template?p`<div class="field">
              ${c(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:x}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!d} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":d?d.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return p``;let o=e.busy,i=c=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...c})},r=c=>i({kids:e.kids.includes(c)?e.kids.filter(h=>h!==c):[...e.kids,c]}),l=n.kids.filter(c=>St(c,e.date)),d=e.dish.trim(),a=e.kids.length?d?null:"Type what’s served":"Pick who gets this menu";return p`
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
          @input=${c=>i({dish:c.target.value})}
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
          @input=${c=>i({details:c.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${l.map(c=>{let h=this.kidColorOf(c.id),g=e.kids.includes(c.id);return p`<button type="button" class="who-chip" style="--c:${h.color};--rgb:${h.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${o} @click=${()=>r(c.id)}>
              <span class="avatar" aria-hidden="true">${Te(c.name)}</span>${c.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${d||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:x}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!a} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":a??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return p``;let o=n.people?.length?n.people:n.kids.map(h=>({...h,role:"kid"})),i=n.kids.findIndex(h=>h.id===e.kid),r=n.kids[i],l=this.plan?pe(this.plan):void 0,d=l?.get(e.kid)??ee(Math.max(0,i)),a=o.filter(h=>h.id!==e.kid),c=h=>{let g=n.kids.findIndex(m=>m.id===h.id);return g>=0?(l?.get(h.id)??ee(g)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:x}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Gn(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${d.color};--rgb:${d.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Te(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${a.map(h=>p`<button type="button" class="done-by" style="--c:${c(h)}" @click=${()=>void this.toggleChore(e,h.id)}>
                  <span class="avatar ${h.role==="parent"?"driver":""}" aria-hidden="true">${Te(h.name)}</span>
                  <span>${h.name}</span>
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
    </div>`}ownHint(e,n){let o=on(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${j(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${j(n.start)} to ${j(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>me(e).includes(r)?oe(e,r):le(e,r));return`${o} drives there and back${i.length?`, with ${rn(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:o,event:i}=n,r=me(e),l=vi(e,i),d=on(e,i),a=!!this.pending,c=L=>this.pending?.key===L?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let L of e.days)for(let G of L.events)for(let F of[G.drop,G.pick])F&&F!=="none"&&!r.includes(F)&&!h.some(f=>f.toLowerCase()===F.toLowerCase())&&h.push(F);let g=L=>{if(!i.sides.includes(L))return x;let G=c(L)??c("both"),F=L==="drop"?i.drop:i.pick,f=G!==void 0?String(G):i.no_ride_unless_named&&F==="none"?"":F,A=f===""&&!(G===void 0&&i.no_ride_unless_named),D=f&&f!=="none"&&!r.includes(f)?f:"",T=$=>{this.otherOpen=null,this.setRide(i,L,f===$?"":$,r)},b=[...r.map($=>[$,Un(e,$)]),["none","No ride"]],w=`${i.id}|${L}`,k=this.otherOpen===w;return p`<div class="field ride-box">
        <span class="field-label">${L==="drop"?"Drop-off":"Pick-up"} ${A?p`<span class="nobody">· nobody yet</span>`:x}</span>
        <div role="group" aria-label=${L==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${b.length+1}, minmax(0, 1fr))">
          ${b.map(([$,B])=>p`<button type="button" class="choice" aria-pressed=${f===$?"true":"false"} ?disabled=${a} @click=${()=>T($)}>
                ${B}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${D?"true":"false"}
            aria-expanded=${k?"true":"false"}
            ?disabled=${a}
            @click=${()=>this.otherOpen=k?null:w}
          >
            ${D||"Other"}
          </button>
        </div>
        ${k?p`${h.length?p`<div role="group" aria-label=${L==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map($=>p`<button type="button" class="chip" aria-pressed=${f.toLowerCase()===$.toLowerCase()?"true":"false"} ?disabled=${a} @click=${()=>T($)}>
                    ${$}
                  </button>`)}
            </div>`:x}
        <input
          type="text"
          .value=${D&&!h.some($=>$.toLowerCase()===D.toLowerCase())?D:""}
          ?disabled=${a}
          aria-label=${L==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${$=>{let B=$.target.value.trim();B&&B!==f&&T(B)}}
          @keydown=${$=>{$.key==="Enter"&&$.target.blur()}}
        />`:x}
        ${!E&&f!==""&&f!=="none"?m(L,f):x}
      </div>`},m=(L,G)=>{let F=c(`along-${L}`),f=F!==void 0?F:L==="pick"?i.pick_along??[]:i.along,A=[...we(e).filter(T=>T!==i.kid),...r.filter(T=>T!==G)];return A.length?p`<div class="field-sub">
        <span class="field-label">${L==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${L==="pick"?"Coming home too. Anyone already there just gets in.":L==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${L==="drop"?"Riding along on the drop-off":L==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${A.map(T=>p`<button type="button" class="chip" aria-pressed=${f.includes(T)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,T,L)}>
              ${r.includes(T)?oe(e,T):le(e,T)}
            </button>`)}
        </div>
      </div>`:x},P=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",v=i.drop===i.pick&&r.includes(i.drop),y=c("stay"),E=y!==void 0?!!y:i.stay&&v,u=c("along"),M=u!==void 0?u:i.along,R=i.own?[...we(e),...r.filter(L=>L!==i.own)]:[],H=i.own!=null&&i.takes!=null,se=i.own!=null&&!H,de=c("takes"),N=de!==void 0?de:i.takes??null,Le=c("arrive"),ie=this.arriveDraft!==void 0?this.arriveDraft:Le!==void 0?Le:i.arrive_by,Qe=i.sides.includes("drop")&&i.sides.includes("pick"),ue=Qe&&(E||this.stayDraft===i.id),Re=()=>{let L=Qe?p`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${ue?"false":"true"}
              ?disabled=${a}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,P)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${ue?"true":"false"}
              ?disabled=${a}
              @click=${()=>{P?this.toggleStay(i,!0,P):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:x;if(!ue)return p`${L} ${g("drop")} ${g("pick")}`;let G=E&&v?i.drop:"";return p`${L}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${G?x:p`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(F=>p`<button
                type="button"
                class="choice"
                aria-pressed=${G===F?"true":"false"}
                ?disabled=${a}
                @click=${()=>{if(G===F||!this.backend)return;let f=this.backend;this.stayDraft=null,this.save("stay",!0,()=>f.setRide(i.id,"both",F,this.scope,!0))}}
              >
                ${oe(e,F)}
              </button>`)}
          </div>
          ${G?m("both",G):x}
        </div>`},te=[],et=L=>L==="none"?"Not needed":Un(e,L),ze=L=>r.includes(L)?oe(e,L):le(e,L),Ie=(L,G,F)=>{G===""&&!F.length||te.push(`${L}: ${[G===""?"TBD":et(G),...F.map(ze)].join(", ")}`)},Ee=L=>i.no_ride_unless_named&&L==="none"?"":L;i.own||Ie("Drop-off",Ee(i.drop),i.along),i.own||Ie("Pick-up",Ee(i.pick),i.pick_along??[]),!i.own&&i.stay&&te.push("Stay: yes"),H&&te.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&te.push(`Take along: ${i.along.map(ze).join(", ")}`),i.arrive_by!=null&&te.push(`Arrive by: ${We(i.arrive_by)}`);let Ce=c("attending"),V=Ce!==void 0?!!Ce:i.attending!==!1;i.attending===!1&&te.splice(0,te.length,"Attending: no");let fe=o.date===this.today().date?"":`${ae(o.date)} · `,re=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${d} · ${i.title}</span>
          <span class="ed-meta">${fe}${H?"any time ":""}${j(i.start)}–${j(i.end)}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return i.where==="home"?p`${re}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${d} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${re}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
      ${i.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ae(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:x}
      ${V?p`${i.where==="anywhere"?p`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:x}
            ${i.own?p`<p class="field-hint">${this.ownHint(e,i)}</p>`:Re()}
      ${i.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${N!=null?`Takes ${N} min, any time ${j(i.start)}–${j(i.end)}`:"At its set time"}</span>
            </span>
            ${N!=null?p`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${a||N<=5} @click=${()=>this.setTakes(i,Math.max(5,N-5))}>−</button>
                  <span class="arrive-value">${N} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${a||N+5>i.end-i.start} @click=${()=>this.setTakes(i,N+5)}>+</button>
                </span>`:x}
          </div>
          <button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.setTakes(i,N!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${N!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:x}
      ${se&&R.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${R.map(L=>p`<button type="button" class="chip" aria-pressed=${M.includes(L)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,L)}>
                  ${r.includes(L)?oe(e,L):le(e,L)}
                </button>`)}
            </div>
          </div>`:x}
      ${H?x:p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${ie!=null?`${i.start-ie} min before it starts`:`Aims for a few minutes before ${j(i.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${a} @click=${()=>this.nudgeArrive(i,-5)}>−</button>
          <span class="arrive-value">${ie!=null?j(ie):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${a||ie==null} @click=${()=>this.nudgeArrive(i,5)}>+</button>
        </span>
      </div>
      ${ie!=null?p`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:x}`}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${d} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.setAttending(i,!V)}>
        ${V?`${d} isn’t going this time`:`${d} is going after all`}
      </button>
      ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:x}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${te.length?te.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${V&&!i.own?p`<p class="field-hint">Tap a selected driver again to clear it.</p>`:x}
    `}};jt.styles=Fi,jt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",jt);var Rt=class extends ge{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=Xs(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(wt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new qt(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return p`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?p`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:x}`}};Rt.styles=Be`
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
  `,Rt.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",Rt);
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
