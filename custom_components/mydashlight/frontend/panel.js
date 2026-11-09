var ko=Object.defineProperty;var bn=(s,t)=>()=>(s&&(t=s(s=0)),t);var Eo=(s,t)=>{for(var e in t)ko(s,e,{get:t[e],enumerable:!0})};function on(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function Qn(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function wr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Bi(s){return wr(s,t=>t.unicode)}function $r(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[d,c]]of Object.entries(o))i.createIndex(r,d,{multiEntry:c});return i}t(rt),t(Ye,gr,{[Ni]:[fr,!0],[Hi]:[[mr,br]],[Fi]:[vr,!0]}),t(ss,void 0,{[Ui]:[""]})}function Wi(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function kr(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,hr);ts[s]=o,o.onupgradeneeded=i=>{i.oldVersion<ur&&$r(o.result)},Wi(e,n,o)});return t.onclose=()=>os(s),t}function Er(s){return an[s]||(an[s]=kr(s)),an[s]}function De(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),d=typeof t=="string"?r.objectStore(t):t.map(a=>r.objectStore(a)),c;n(d,r,a=>{c=a}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function os(s){let t=ts[s],e=t&&t.result;if(e){e.close();let n=dn[s];if(n)for(let o of n)o()}delete ts[s],delete an[s],delete dn[s]}function Cr(s){return new Promise((t,e)=>{os(s);let n=indexedDB.deleteDatabase(s);Wi(t,e,n)})}function Tr(s,t){let e=dn[s];e||(e=dn[s]=[]),e.push(t)}function ot(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||_r.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Ki(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Sr)}function Ar(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:d,tags:c,emoji:a,version:l})=>{let p=[...new Set(Ki([...(r||[]).map(ot).flat(),...(c||[]).map(ot).flat(),...ot(e),n]))].sort(),g={annotation:e,group:o,order:i,tags:c,tokens:p,unicode:a,version:l};if(n&&(g.emoticon=n),r&&(g.shortcodes=r),d){g.skinTones=[],g.skinUnicodes=[],g.skinVersions=[];for(let{tone:v,emoji:E,version:x}of d)g.skinTones.push(v),g.skinUnicodes.push(E),g.skinVersions.push(x)}return g})}function Vi(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function qe(s,t,e){Vi(s,"get",t,e)}function Gi(s,t,e){Vi(s,"getAll",t,e)}function rs(s){s.commit&&s.commit()}function Pr(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function qi(s,t){let e=Pr(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Mr(s){return!await as(s,rt,ln)}async function Dr(s,t,e){let[n,o]=await Promise.all([es,ln].map(i=>as(s,rt,i)));return n===e&&o===t}async function Lr(s,t){return De(s,Ye,lt,(n,o,i)=>{let r,d=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let a=c.target.result;for(let l of a)if(r=l.unicode,t(l))return i(l);if(a.length<50)return i();d()}};d()})}async function Yi(s,t,e,n){try{let o=Ar(t);await De(s,[Ye,rt],is,([i,r],d)=>{let c,a,l=0;function p(){++l===2&&g()}function g(){if(!(c===n&&a===e)){i.clear();for(let v of o)i.put(v);r.put(n,es),r.put(e,ln),rs(d)}}qe(r,es,v=>{c=v,p()}),qe(r,ln,v=>{a=v,p()})})}finally{}}async function jr(s,t){return De(s,Ye,lt,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Gi(e.index(Hi),i,o)})}async function Xi(s,t){let e=Ki(ot(t));return e.length?De(s,Ye,lt,(n,o,i)=>{let r=[],d=()=>{r.length===e.length&&c()},c=()=>{let a=qi(r,l=>l.unicode);i(a.sort((l,p)=>l.order<p.order?-1:1))};for(let a=0;a<e.length;a++){let l=e[a],p=a===e.length-1?IDBKeyRange.bound(l,l+"￿",!1,!0):IDBKeyRange.only(l);Gi(n.index(Ni),p,g=>{r.push(g),d()})}}):[]}async function Rr(s,t){let e=await Xi(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Lr(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function zr(s,t){return De(s,Ye,lt,(e,n,o)=>qe(e,t,i=>{if(i)return o(i);qe(e.index(Fi),t,r=>o(r||null))}))}function as(s,t,e){return De(s,t,lt,(n,o,i)=>qe(n,e,i))}function Ir(s,t,e,n){return De(s,t,is,(o,i)=>{o.put(n,e),rs(i)})}function Br(s,t){return De(s,ss,is,(e,n)=>qe(e,t,o=>{e.put((o||0)+1,t),rs(n)}))}function Or(s,t,e){return e===0?[]:De(s,[ss,Ye],lt,([n,o],i,r)=>{let d=[];n.index(Ui).openCursor(void 0,"prev").onsuccess=c=>{let a=c.target.result;if(!a)return r(d);function l(v){if(d.push(v),d.length===e)return r(d);a.continue()}let p=a.primaryKey,g=t.byName(p);if(g)return l(g);qe(o,p,v=>{if(v)return l(v);a.continue()})}})}function Nr(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let d=e;for(let a=0;a<r.length;a++){let l=r.charAt(a),p=d.get(l);p||(p=new Map,d.set(l,p)),d=p}let c=d.get(rn);c||(c=[],d.set(rn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let a=0;a<o.length;a++){let l=o.charAt(a),p=r.get(l);if(p)r=p;else return[]}if(i)return r.get(rn)||[];let d=[],c=[r];for(;c.length;){let l=[...c.shift().entries()].sort((p,g)=>p[0]<g[0]?-1:1);for(let[p,g]of l)p===rn?d.push(...g):c.push(g)}return d}}function Hr(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||Ur.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function Oi(s){Hr(s);let t=(g,v)=>g.name.toLowerCase()<v.name.toLowerCase()?-1:1,e=s.sort(t),o=Nr(s,g=>{let v=new Set;if(g.shortcodes)for(let E of g.shortcodes)for(let x of ot(E))v.add(x);return v}),i=g=>o(g,!0),r=g=>o(g,!1),d=g=>{let v=ot(g),E=v.map((x,y)=>(y<v.length-1?i:r)(x));return qi(E,x=>x.name).sort(t)},c=new Map,a=new Map;for(let g of s){a.set(g.name.toLowerCase(),g);for(let v of g.shortcodes||[])c.set(v.toLowerCase(),g)}return{all:e,search:d,byShortcode:g=>c.get(g.toLowerCase()),byName:g=>a.get(g.toLowerCase())}}function Et(s){if(!s)return s;if(Fr&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Zi(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Kr(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Wr.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function Ji(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function Vr(s){let t=await fetch(s,{method:"HEAD"});Ji(t,s);let e=t.headers.get("etag");return Zi(e),e}async function ns(s){let t=await fetch(s);Ji(t,s);let e=t.headers.get("etag");Zi(e);let n=await t.json();return Kr(n),[e,n]}function Gr(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function qr(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function Qi(s){let t=JSON.stringify(s),e=qr(t),n=await crypto.subtle.digest("SHA-1",e),o=Gr(n);return btoa(o)}async function Yr(s,t){let e,n=await Vr(t);if(!n){let o=await ns(t);n=o[0],e=o[1],n||(n=await Qi(e))}await Dr(s,t,n)||(e||(e=(await ns(t))[1]),await Yi(s,e,t,n))}async function Xr(s,t){let[e,n]=await ns(t);e||(e=await Qi(n)),await Yi(s,n,t,e)}async function Zr(s,t){try{await Yr(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var hr,ur,Ye,rt,ss,fr,Ni,gr,Ui,mr,br,Hi,es,ln,Ii,lt,is,Fi,vr,xr,yr,ts,an,dn,_r,Sr,rn,Ur,Fr,Wr,at,ls=bn(()=>{hr=1,ur=1,Ye="emoji",rt="keyvalue",ss="favorites",fr="tokens",Ni="tokens",gr="unicode",Ui="count",mr="group",br="order",Hi="group-order",es="eTag",ln="url",Ii="skinTone",lt="readonly",is="readwrite",Fi="skinUnicodes",vr="skinUnicodes",xr="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",yr="en";ts={},an={},dn={};_r=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Sr=2;rn="";Ur=["name","url"];Fr=typeof wrappedJSObject<"u";Wr=["annotation","emoji","group","order","version"];at=class{constructor({dataSource:t=xr,locale:e=yr,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Oi(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Er(this._dbName);Tr(this._dbName,this._clear);let e=this.dataSource;await Mr(t)?await Xr(t,e):this._lazyUpdate=Zr(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Qn(t),await this.ready(),Bi(await jr(this._db,t)).map(Et)}async getEmojiBySearchQuery(t){on(t),await this.ready();let e=this._custom.search(t),n=Bi(await Xi(this._db,t)).map(Et);return[...e,...n]}async getEmojiByShortcode(t){on(t),await this.ready();let e=this._custom.byShortcode(t);return e||Et(await Rr(this._db,t))}async getEmojiByUnicodeOrName(t){on(t),await this.ready();let e=this._custom.byName(t);return e||Et(await zr(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await as(this._db,rt,Ii)||0}async setPreferredSkinTone(t){return Qn(t),await this.ready(),Ir(this._db,rt,Ii,t)}async incrementFavoriteEmojiCount(t){return on(t),await this.ready(),Br(this._db,t)}async getTopFavoriteEmoji(t){return Qn(t),await this.ready(),(await Or(this._db,this._custom,t)).map(Et)}set customEmoji(t){this._custom=Oi(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await os(this._dbName)}async delete(){await this._shutdown(),await Cr(this._dbName)}}});function to(s){return s.unicode.includes("‍")}function ra(s){let t=no(s,"#000"),e=no(s,"#fff");return t&&e&&oa(t,e)}function aa(){let s=Object.entries(Qr);try{for(let[t,e]of s)if(ra(t))return e}catch{}finally{}return s[0][1]}function ua(s,t){if(t===0)return s;let e=s.indexOf(ca);return e!==-1?s.substring(0,e)+String.fromCodePoint(pa+t-1)+s.substring(e):(s.endsWith(la)&&(s=s.substring(0,s.length-1)),s+da+String.fromCodePoint(ha+t-1))}function Ee(s){s.preventDefault(),s.stopPropagation()}function hs(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function ho(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function fa(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:d,category:c,annotation:a})=>({unicode:n,name:d,shortcodes:i,url:r,category:c,annotation:a,id:n||d,skins:o&&e(o)}))}function ma(s,t,e){let n;ga?(n=new ResizeObserver(e),n.observe(s)):pn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function so(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function io(s,t,e){let n=so(t);if(!n){if(!Xe){Xe=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])Xe.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(Xe),Xe.firstChild.nodeValue=s,so(Xe)}finally{Xe.remove()}}return n}function va(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof us>"u"&&(us=io(ba,t,t));let d=io(o.unicode,i,t)/1.8<us;bs.set(o.unicode,d),d||(n=!1)}return n}function xa(s){return ho(s,t=>t)}function ya(s){s&&(s.scrollTop=0)}function Ct(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function oo(s){return""+s}function wa(s){let t=document.createElement("template");return t.innerHTML=s,t}function Ta(s,t){Ca?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function _a(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Sa(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=_a(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&Ta(n,s)}function Aa(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:d,attributeValuePost:c}}=e,a=s[i];if(o!==a)if(e.currentExpression=a,r)if(a===null)n.removeAttribute(r);else{let l=d+oo(a)+c;n.setAttribute(r,l)}else{let l;Array.isArray(a)?Sa(a,e):a instanceof Element?(l=a,n.replaceWith(l)):n.nodeValue=oo(a),l&&(e.targetNode=l)}}}function Pa(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],d=0;for(let a=0,l=s.length;a<l;a++){let p=s[a];if(t+=p.slice(d),a===l-1)break;for(let u=0;u<p.length;u++)switch(p.charAt(u)){case"<":{p.charAt(u+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let g=r[r.length-1],v=Ct(i,g,()=>[]),E,x,y;if(n){let u=/(\S+)="?([^"=]*)$/.exec(p);E=u[1],x=u[2];let _=/^([^">]*)("?)/.exec(s[a+1]);y=_[1],t=t.slice(0,-1*u[0].length),d=_[0].length}else d=0;let k={attributeName:E,attributeValuePre:x,attributeValuePost:y,expressionIndex:a};v.push(k),!e&&!n&&(t+=" ")}return{template:wa(t),elementsToBindings:i}}function ro(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Ma(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))ro(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let d=t.get(++r);d&&ro(d,i,e)}while(i=o.nextNode())}return e}function Da(s){let{template:t,elementsToBindings:e}=Ct($a,s,()=>Pa(s)),n=t.cloneNode(!0).content.firstElementChild,o=Ma(n,e);return function(r){return Aa(r,o),n}}function La(s){let t=Ct(ka,s,()=>new Map),e=Ea;function n(i,...r){let d=Ct(t,i,()=>new Map);return Ct(d,e,()=>Da(i))(r)}function o(i,r,d){return i.map((c,a)=>{let l=e;e=d(c);try{return r(c,a)}finally{e=l}})}return{map:o,html:n}}function ja(s,t,e,n,o,i,r,d,c){let{labelWithSkin:a,titleForEmoji:l,unicodeWithSkin:p}=e,{html:g,map:v}=La(t);function E(u,_,z){return v(u,(G,ne)=>g`<button role="${_?"option":"menuitem"}" aria-selected="${_?ne===t.activeSearchItem:null}" aria-label="${a(G,t.currentSkinTone)}" title="${l(G)}" class="${"emoji"+(_&&ne===t.activeSearchItem?" active":"")+(G.unicode?"":" custom-emoji")}" id="${`${z}-${G.id}`}" style="${G.unicode?null:`--custom-emoji-background: url(${JSON.stringify(G.url)})`}">${G.unicode?p(G,t.currentSkinTone):""}</button>`,G=>`${z}-${G.id}`)}let y=g`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${v(t.skinTones,(u,_)=>g`<div id="skintone-${_}" class="emoji ${_===t.activeSkinTone?"active":""}" aria-selected="${_===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[_]}" aria-label="${t.i18n.skinTones[_]}">${u}</div>`,u=>u)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${v(t.groups,u=>g`<button role="tab" class="nav-button" aria-controls="tab-${u.id}" aria-label="${t.i18n.categories[u.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===u.id}" title="${t.i18n.categories[u.name]}" data-group-id="${u.id}"><div class="nav-emoji emoji">${u.emoji}</div></button>`,u=>u.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${v(t.currentEmojisWithCategories,(u,_)=>g`<div><div id="menu-label-${_}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:u.category?u.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${_!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(u.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${_}" id="${t.searchMode?"search-results":null}">${E(u.emojis,t.searchMode,"emo")}</div></div>`,u=>u.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${E(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,k=(u,_)=>{for(let z of s.querySelectorAll(`[${u}]`))_(z,z.getAttribute(u))};if(c){s.appendChild(y);for(let u of["click","focusout","input","keydown","keyup"])k(`data-on-${u}`,(_,z)=>{_.addEventListener(u,n[z])});k("data-ref",(u,_)=>{i[_]=u}),r.addEventListener("abort",()=>{s.removeChild(y)})}k("data-action",(u,_)=>{let z=d.get(_);z||d.set(_,z=new WeakSet),z.has(u)||(z.add(u),o[_](u))})}function Ra(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let a=[...o];o.clear();try{for(let l of a)l()}finally{i=!1,o.size&&(i=!0,hn(r))}},d=new Proxy({},{get(a,l){if(e){let p=n.get(l);p||(p=new Set,n.set(l,p)),p.add(e)}return a[l]},set(a,l,p){if(a[l]!==p){a[l]=p;let g=n.get(l);if(g){for(let v of g)o.add(v);i||(i=!0,hn(r))}}return!0}}),c=a=>{let l=()=>{let p=e;e=l;try{return a()}finally{e=p}};return l()};return s.addEventListener("abort",()=>{t=!0}),{state:d,createEffect:c}}function fs(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function za(s,t,e){{let n=s.closest(".tabpanel"),o=ao.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),ao.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function Ia(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=Ra(o),d=new Map;cn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),cn(i,t),cn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:na,isRtl:!1,currentGroupIndex:0,groups:ds,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=b=>{s.getElementById(b).focus()},a=b=>s.getElementById(`emo-${b.id}`),l=(b,m)=>{e.rootElement.dispatchEvent(new CustomEvent(b,{detail:m,bubbles:!0,composed:!0}))},p=(b,m)=>b.id===m.id,g=(b,m)=>{let{category:C,emojis:P}=b,{category:F,emojis:O}=m;return C!==F?!1:fs(P,O,p)},v=b=>{fs(i.currentEmojis,b,p)||(i.currentEmojis=b)},E=b=>{i.searchMode!==b&&(i.searchMode=b)},x=b=>{fs(i.currentEmojisWithCategories,b,g)||(i.currentEmojisWithCategories=b)},y=(b,m)=>m&&b.skins&&b.skins[m]||b.unicode,_={labelWithSkin:(b,m)=>xa([b.name||y(b,m),b.annotation,...b.shortcodes||gs].filter(Boolean)).join(", "),titleForEmoji:b=>b.annotation||(b.shortcodes||gs).join(", "),unicodeWithSkin:y},z={onClickSkinToneButton:f,onEmojiClick:me,onNavClick:L,onNavKeydown:H,onSearchKeydown:Le,onSkinToneOptionsClick:I,onSkinToneOptionsFocusOut:A,onSkinToneOptionsKeydown:S,onSkinToneOptionsKeyup:D,onSearchInput:R},G={calculateEmojiGridStyle:W,updateOnIntersection:pe},ne=!0;r(()=>{ja(s,i,_,z,G,e,o,d,ne),ne=!1}),i.emojiVersion||ps().then(b=>{b||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function b(){let m=!1,C=setTimeout(()=>{m=!0,i.message=i.i18n.loadingMessage},ea);try{await i.database.ready(),i.databaseLoaded=!0}catch(P){console.error(P),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(C),m&&(m=!1,i.message="")}}i.database&&b()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${eo};`}),r(()=>{i.customEmoji&&i.database&&q()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==ms&&(i.groups=ms):i.groups!==ds&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=ds)}),r(()=>{async function b(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}b()}),r(()=>{i.skinTones=Array(eo).fill().map((b,m)=>ua(i.skinToneEmoji,m))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function b(){let{database:m}=i,C=(await Promise.all(sa.map(P=>m.getEmojiByUnicodeOrName(P)))).filter(Boolean);i.defaultFavoriteEmojis=C}i.databaseLoaded&&b()});function q(){let{customEmoji:b,database:m}=i,C=b||gs;m.customEmoji!==C&&(m.customEmoji=C)}r(()=>{async function b(){q();let{database:m,defaultFavoriteEmojis:C,numColumns:P}=i,F=await m.getTopFavoriteEmoji(P),O=await Te(ho([...F,...C],ee=>ee.unicode||ee.name).slice(0,P));i.currentFavorites=O}i.databaseLoaded&&i.defaultFavoriteEmojis&&b()});function W(b){ma(b,o,()=>{{let m=getComputedStyle(e.rootElement),C=parseInt(m.getPropertyValue("--num-columns"),10),P=m.getPropertyValue("direction")==="rtl";i.numColumns=C,i.isRtl=P}})}function pe(b){za(b,o,m=>{for(let{target:C,isIntersecting:P}of m)C.classList.toggle("onscreen",P)})}r(()=>{async function b(){let{searchText:m,currentGroup:C,databaseLoaded:P,customEmoji:F}=i;if(!P)i.currentEmojis=[],i.searchMode=!1;else if(m.length>=Jr){let O=await Je(m);i.searchText===m&&(v(O),E(!0))}else{let{id:O}=C;if(O!==-1||F&&F.length){let ee=await _e(O);i.currentGroup.id===O&&(v(ee),E(!1))}}}b()});let Q=()=>{pn(()=>ya(e.tabpanelElement))};r(()=>{let{currentEmojis:b,emojiVersion:m}=i,C=b.filter(P=>P.unicode).filter(P=>to(P)&&!bs.has(P.unicode));if(!m&&C.length)v(b),pn(()=>fe(C));else{let P=m?b:b.filter(Re);v(P),Q()}});function fe(b){va(b,e.baselineEmoji,a)?Q():i.currentEmojis=[...i.currentEmojis]}function Re(b){return!b.unicode||!to(b)||bs.get(b.unicode)}async function ge(b){let m=i.emojiVersion||await ps();return b.filter(({version:C})=>!C||C<=m)}async function Te(b){return fa(b,i.emojiVersion||await ps())}async function _e(b){let m=b===-1?i.customEmoji:await i.database.getEmojiByGroup(b);return Te(await ge(m))}async function Je(b){return Te(await ge(await i.database.getEmojiBySearchQuery(b)))}r(()=>{}),r(()=>{function b(){let{searchMode:C,currentEmojis:P}=i;if(C)return[{category:"",emojis:P}];let F=new Map;for(let O of P){let ee=O.category||"",se=F.get(ee);se||(se=[],F.set(ee,se)),se.push(O)}return[...F.entries()].map(([O,ee])=>({category:O,emojis:ee})).sort((O,ee)=>i.customCategorySorting(O.category,ee.category))}let m=b();x(m)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:b}=i;co(()=>{i.searchText=(b||"").trim(),i.activeSearchItem=-1})});function Le(b){if(!i.searchMode||!i.currentEmojis.length)return;let m=C=>{Ee(b),i.activeSearchItem=hs(C,i.activeSearchItem,i.currentEmojis)};switch(b.key){case"ArrowDown":return m(!1);case"ArrowUp":return m(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Ee(b),X(i.currentEmojis[i.activeSearchItem].id)}}function L(b){let{target:m}=b,C=m.closest(".nav-button");if(!C)return;let P=parseInt(C.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(F=>F.id===P)}function H(b){let{target:m,key:C}=b,P=F=>{F&&(Ee(b),F.focus())};switch(C){case"ArrowLeft":return P(m.previousElementSibling);case"ArrowRight":return P(m.nextElementSibling);case"Home":return P(m.parentElement.firstElementChild);case"End":return P(m.parentElement.lastElementChild)}}async function U(b){let m=await i.database.getEmojiByUnicodeOrName(b),C=[...i.currentEmojis,...i.currentFavorites].find(F=>F.id===b),P=C.unicode&&y(C,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(b),{emoji:m,skinTone:i.currentSkinTone,...P&&{unicode:P},...C.name&&{name:C.name}}}async function X(b){let m=U(b);l("emoji-click-sync",m),l("emoji-click",await m)}function me(b){let{target:m}=b;if(!m.classList.contains("emoji"))return;Ee(b);let C=m.id.substring(4);X(C)}function be(b){i.currentSkinTone=b,i.skinTonePickerExpanded=!1,c("skintone-button"),l("skin-tone-change",{skinTone:b}),i.database.setPreferredSkinTone(b)}function I(b){let{target:{id:m}}=b,C=m&&m.match(/^skintone-(\d)/);if(!C)return;Ee(b);let P=parseInt(C[1],10);be(P)}function f(b){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Ee(b),pn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function S(b){if(!i.skinTonePickerExpanded)return;let m=async C=>{Ee(b),i.activeSkinTone=C};switch(b.key){case"ArrowUp":return m(hs(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return m(hs(!1,i.activeSkinTone,i.skinTones));case"Home":return m(0);case"End":return m(i.skinTones.length-1);case"Enter":return Ee(b),be(i.activeSkinTone);case"Escape":return Ee(b),i.skinTonePickerExpanded=!1,c("skintone-button")}}function D(b){if(i.skinTonePickerExpanded)switch(b.key){case" ":return Ee(b),be(i.activeSkinTone)}}async function A(b){let{relatedTarget:m}=b;(!m||m.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function R(b){i.rawSearchText=b.target.value}return{$set(b){cn(i,b)},$destroy(){n.abort()}}}function lo(s){s instanceof Ze||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var ms,ds,Jr,eo,co,Qr,ea,ta,na,sa,po,ia,no,oa,cs,ps,bs,la,da,ca,pa,ha,pn,ga,ba,us,Xe,$a,ka,Ea,Ca,hn,ao,gs,cn,Ba,Oa,Na,Ua,uo,Ha,Ze,fo,go=bn(()=>{ls();ms=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),ds=ms.slice(1),Jr=2,eo=6,co=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Qr={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},ea=1e3,ta="🖐️",na=8,sa=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],po='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',ia=(s,t)=>s<t?-1:s>t?1:0,no=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${po}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},oa=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ps=()=>(cs||(cs=new Promise(s=>co(()=>s(aa())))),cs),bs=new Map,la="️",da="\uD83C",ca="‍",pa=127995,ha=57339;pn=requestAnimationFrame,ga=typeof ResizeObserver=="function";ba="😀";$a=new WeakMap,ka=new WeakMap,Ea=Symbol("un-keyed"),Ca="replaceChildren"in Element.prototype;hn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);ao=new WeakMap;gs=[],{assign:cn}=Object;Ba="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Oa="en",Na={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Ua=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',uo=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Ha=`:host{--emoji-font-family:${po}}`,Ze=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Ua+Ha,this.shadowRoot.appendChild(e),this._ctx={locale:Oa,dataSource:Ba,skinToneEmoji:ta,customCategorySorting:ia,customEmoji:null,i18n:Na,emojiVersion:null,...t};for(let n of uo)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){lo(this),this._cmp||(this._cmp=Ia(this.shadowRoot,this._ctx))}disconnectedCallback(){lo(this),hn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new at({locale:t,dataSource:e}))}_dbFlush(){hn(()=>this._dbCreate())}},fo={};for(let s of uo)fo[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(Ze.prototype,fo);customElements.get("emoji-picker")||customElements.define("emoji-picker",Ze)});var mo={};Eo(mo,{Database:()=>at,Picker:()=>Ze});var bo=bn(()=>{go();ls()});var Mt=globalThis,Dt=Mt.ShadowRoot&&(Mt.ShadyCSS===void 0||Mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,vn=Symbol(),Cs=new WeakMap,ct=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==vn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Dt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Cs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Cs.set(e,t))}return t}toString(){return this.cssText}},Ts=s=>new ct(typeof s=="string"?s:s+"",void 0,vn),ze=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new ct(e,s,vn)},_s=(s,t)=>{if(Dt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Mt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},xn=Dt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Ts(e)})(s):s;var{is:Co,defineProperty:To,getOwnPropertyDescriptor:_o,getOwnPropertyNames:So,getOwnPropertySymbols:Ao,getPrototypeOf:Po}=Object,Lt=globalThis,Ss=Lt.trustedTypes,Mo=Ss?Ss.emptyScript:"",Do=Lt.reactiveElementPolyfillSupport,pt=(s,t)=>s,yn={toAttribute(s,t){switch(t){case Boolean:s=s?Mo:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ps=(s,t)=>!Co(s,t),As={attribute:!0,type:String,converter:yn,reflect:!1,useDefault:!1,hasChanged:Ps};Symbol.metadata??=Symbol("metadata"),Lt.litPropertyMetadata??=new WeakMap;var Se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=As){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&To(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=_o(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let d=o?.call(this);i?.call(this,r),this.requestUpdate(t,d,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??As}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;let t=Po(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){let e=this.properties,n=[...So(e),...Ao(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(xn(o))}else t!==void 0&&e.push(xn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _s(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:yn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:yn;this._$Em=o;let d=r.fromAttribute(e,i.type);this[o]=d??this._$Ej?.get(o)??d,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Ps)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,d=this[o];r!==!0||this._$AL.has(o)||d===void 0||this.C(o,void 0,i,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Se.elementStyles=[],Se.shadowRootOptions={mode:"open"},Se[pt("elementProperties")]=new Map,Se[pt("finalized")]=new Map,Do?.({ReactiveElement:Se}),(Lt.reactiveElementVersions??=[]).push("2.1.2");var $n=globalThis,Ms=s=>s,jt=$n.trustedTypes,Ds=jt?jt.createPolicy("lit-html",{createHTML:s=>s}):void 0,kn="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,En="?"+Ae,Lo=`<${En}>`,Oe=document,ut=()=>Oe.createComment(""),ft=s=>s===null||typeof s!="object"&&typeof s!="function",Cn=Array.isArray,Bs=s=>Cn(s)||typeof s?.[Symbol.iterator]=="function",wn=`[ 	
\f\r]`,ht=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ls=/-->/g,js=/>/g,Ie=RegExp(`>|${wn}(?:([^\\s"'>=/]+)(${wn}*=${wn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Rs=/'/g,zs=/"/g,Os=/^(?:script|style|textarea|title)$/i,Tn=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),h=Tn(1),ie=Tn(2),ll=Tn(3),Pe=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),Is=new WeakMap,Be=Oe.createTreeWalker(Oe,129);function Ns(s,t){if(!Cn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ds!==void 0?Ds.createHTML(t):t}var Us=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=ht;for(let d=0;d<e;d++){let c=s[d],a,l,p=-1,g=0;for(;g<c.length&&(r.lastIndex=g,l=r.exec(c),l!==null);)g=r.lastIndex,r===ht?l[1]==="!--"?r=Ls:l[1]!==void 0?r=js:l[2]!==void 0?(Os.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=Ie):l[3]!==void 0&&(r=Ie):r===Ie?l[0]===">"?(r=o??ht,p=-1):l[1]===void 0?p=-2:(p=r.lastIndex-l[2].length,a=l[1],r=l[3]===void 0?Ie:l[3]==='"'?zs:Rs):r===zs||r===Rs?r=Ie:r===Ls||r===js?r=ht:(r=Ie,o=void 0);let v=r===Ie&&s[d+1].startsWith("/>")?" ":"";i+=r===ht?c+Lo:p>=0?(n.push(a),c.slice(0,p)+kn+c.slice(p)+Ae+v):c+Ae+(p===-2?d:v)}return[Ns(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},gt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,d=t.length-1,c=this.parts,[a,l]=Us(t,e);if(this.el=s.createElement(a,n),Be.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(o=Be.nextNode())!==null&&c.length<d;){if(o.nodeType===1){if(o.hasAttributes())for(let p of o.getAttributeNames())if(p.endsWith(kn)){let g=l[r++],v=o.getAttribute(p).split(Ae),E=/([.?@])?(.*)/.exec(g);c.push({type:1,index:i,name:E[2],strings:v,ctor:E[1]==="."?zt:E[1]==="?"?It:E[1]==="@"?Bt:Ue}),o.removeAttribute(p)}else p.startsWith(Ae)&&(c.push({type:6,index:i}),o.removeAttribute(p));if(Os.test(o.tagName)){let p=o.textContent.split(Ae),g=p.length-1;if(g>0){o.textContent=jt?jt.emptyScript:"";for(let v=0;v<g;v++)o.append(p[v],ut()),Be.nextNode(),c.push({type:2,index:++i});o.append(p[g],ut())}}}else if(o.nodeType===8)if(o.data===En)c.push({type:2,index:i});else{let p=-1;for(;(p=o.data.indexOf(Ae,p+1))!==-1;)c.push({type:7,index:i}),p+=Ae.length-1}i++}}static createElement(t,e){let n=Oe.createElement("template");return n.innerHTML=t,n}};function Ne(s,t,e=s,n){if(t===Pe)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=ft(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Ne(s,o._$AS(s,t.values),o,n)),t}var Rt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Oe).importNode(e,!0);Be.currentNode=o;let i=Be.nextNode(),r=0,d=0,c=n[0];for(;c!==void 0;){if(r===c.index){let a;c.type===2?a=new Qe(i,i.nextSibling,this,t):c.type===1?a=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(a=new Ot(i,this,t)),this._$AV.push(a),c=n[++d]}r!==c?.index&&(i=Be.nextNode(),r++)}return Be.currentNode=Oe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},Qe=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ne(this,t,e),ft(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==Pe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Bs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(Oe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=gt.createElement(Ns(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new Rt(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Is.get(t.strings);return e===void 0&&Is.set(t.strings,e=new gt(t)),e}k(t){Cn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(ut()),this.O(ut()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Ms(t).nextSibling;Ms(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ue=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=w}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Ne(this,t,e,0),r=!ft(t)||t!==this._$AH&&t!==Pe,r&&(this._$AH=t);else{let d=t,c,a;for(t=i[0],c=0;c<i.length-1;c++)a=Ne(this,d[n+c],e,c),a===Pe&&(a=this._$AH[c]),r||=!ft(a)||a!==this._$AH[c],a===w?t=w:t!==w&&(t+=(a??"")+i[c+1]),this._$AH[c]=a}r&&!o&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},zt=class extends Ue{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},It=class extends Ue{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},Bt=class extends Ue{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Ne(this,t,e,0)??w)===Pe)return;let n=this._$AH,o=t===w&&n!==w||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==w&&(n===w||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Ot=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Ne(this,t)}},Hs={M:kn,P:Ae,A:En,C:1,L:Us,R:Rt,D:Bs,V:Ne,I:Qe,H:Ue,N:It,U:Bt,B:zt,F:Ot},jo=$n.litHtmlPolyfillSupport;jo?.(gt,Qe),($n.litHtmlVersions??=[]).push("3.3.3");var Fs=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new Qe(t.insertBefore(ut(),i),i,void 0,e??{})}return o._$AI(s),o};var _n=globalThis,he=class extends Se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Fs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Pe}};he._$litElement$=!0,he.finalized=!0,_n.litElementHydrateSupport?.({LitElement:he});var Ro=_n.litElementPolyfillSupport;Ro?.({LitElement:he});(_n.litElementVersions??=[]).push("4.2.2");var et="mydashlight",wl=`/api/${et}/pair`,$l=`/api/${et}/pair/poll`,kl=`/${et}`,mt="pair";function Ws(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Sn(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function Ks(s){let t=new URLSearchParams(s);return t.has(mt)?Sn(t.get(mt)??""):null}function zo(s){if(s<60)return"just now";let t=Math.round(s/60);return`${t} minute${t===1?"":"s"} ago`}var bt=class extends he{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${et}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${et}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return h`<form @submit=${o=>{o.preventDefault();let i=Sn(this.typed);i&&this.check(i)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?h`<p class="error" role="alert">${this.error}</p>`:w}
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
    </form>`}confirm(){let e=this.waiting,n=this.step==="approving",o=e.home===!1;return h`<h2>Allow this screen?</h2>
      <p class="code">${Ws(e.code??"")}</p>
      ${o?h`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:w}
      <p>
        A screen at ${e.address} asked ${zo(e.age??0)}. Check the code matches the one on the screen. It will be
        signed in to Home Assistant as <b>${this.userName||"you"}</b>.
      </p>
      <p>To sign it out later, delete its entry under Refresh tokens on your Home Assistant profile’s Security tab.</p>
      <div class="actions">
        <button type="button" @click=${()=>this.close()} ?disabled=${n}>Cancel</button>
        <button type="button" class="dark" @click=${()=>void this.approve()} ?disabled=${n}>
          ${n?"Allowing…":o?"Allow anyway":"Allow"}
        </button>
      </div>`}render(){let e;return this.isAdmin?this.step==="done"?e=h`<h2>Screen paired</h2>
        <p>It will open the board in a few seconds.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Done</button></div>`:this.step==="confirm"||this.step==="approving"?e=this.confirm():e=this.enter():e=h`<h2>Pair a screen</h2>
        <p>Only a Home Assistant admin can pair a screen. Ask an admin to scan the code instead.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,h`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};bt.styles=ze`
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
  `,bt.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",bt);function M(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function He(s){let t=Math.floor(Math.round(s)/60)%24;return`${M(s)} ${t<12?"AM":"PM"}`}function Vs(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function xt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function Gs(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Io=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Bo=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Oo=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Nt(s){return new Date(`${s}T12:00:00Z`)}function xe(s){let t=Nt(s);return`${Io.format(t)}, ${Oo.format(t)}`}function re(s){return Bo.format(Nt(s))}function ye(s,t){return Math.round((Nt(t).getTime()-Nt(s).getTime())/864e5)}function vt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return vt("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Ut(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=vt(e,s),i=vt(e,t).date;return o.date===i?`at ${He(o.minutes)}`:`on ${re(o.date)} at ${He(o.minutes)}`}var J=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},Fe="mydashlight",No=7,qs=3e4;function An(s){if(s instanceof J)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new J(String(t.code??"error"),t.message)}return typeof s=="number"?new J("connection_lost","Lost the connection to Home Assistant."):new J("error",String(s))}var Ht=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new J("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},qs),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new J("not_running","MyDashLight isn’t running right now."))},{type:`${Fe}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:"get_plan",service_data:{days:No},return_response:!0});this.emit(t.response)}catch(t){this.fail(An(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:t,service_data:e})}catch(n){throw An(n)}this.pushing||await this.refresh()}setRide(t,e,n,o){return this.call("set_ride",{event:t,side:e,driver:n,scope:o})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Gs(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,o=null,i=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(d=>{e||t(d.chores)},{type:`${Fe}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;i(),o=setInterval(()=>void i(),qs)}})(),()=>{e=!0,o&&clearInterval(o),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let o=await this.conn.subscribeMessage(i=>{e||t(i.lunch)},{type:`${Fe}/lunch/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):n=o}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:t,service_data:e})}catch(n){throw An(n)}}};var Ys={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Xs=s=>(...t)=>({_$litDirective$:s,values:t}),Ft=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Uo}=Hs,Zs=s=>s;var Js=()=>document.createComment(""),tt=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Js(),o),r=n.insertBefore(Js(),o);e=new Uo(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,d=r!==s;if(d){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||d){let c=e._$AA;for(;c!==i;){let a=Zs(c).nextSibling;Zs(n).insertBefore(c,o),c=a}}}return e},je=(s,t,e=s)=>(s._$AI(t,e),s),Ho={},Qs=(s,t=Ho)=>s._$AH=t,ei=s=>s._$AH,Wt=s=>{s._$AR(),s._$AA.remove()};var ti=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Me=Xs(class extends Ft{constructor(s){if(super(s),s.type!==Ys.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let d of s)o[r]=n?n(d,r):r,i[r]=e(d,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=ei(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let d=this.ut??=[],c=[],a,l,p=0,g=o.length-1,v=0,E=i.length-1;for(;p<=g&&v<=E;)if(o[p]===null)p++;else if(o[g]===null)g--;else if(d[p]===r[v])c[v]=je(o[p],i[v]),p++,v++;else if(d[g]===r[E])c[E]=je(o[g],i[E]),g--,E--;else if(d[p]===r[E])c[E]=je(o[p],i[E]),tt(s,c[E+1],o[p]),p++,E--;else if(d[g]===r[v])c[v]=je(o[g],i[v]),tt(s,o[p],o[g]),g--,v++;else if(a===void 0&&(a=ti(r,v,E),l=ti(d,p,g)),a.has(d[p]))if(a.has(d[g])){let x=l.get(r[v]),y=x!==void 0?o[x]:null;if(y===null){let k=tt(s,o[p]);je(k,i[v]),c[v]=k}else c[v]=je(y,i[v]),tt(s,o[p],y),o[x]=null;v++}else Wt(o[g]),g--;else Wt(o[p]),p++;for(;v<=E;){let x=tt(s,c[E+1]);je(x,i[v]),c[v++]=x}for(;p<=g;){let x=o[p++];x!==null&&Wt(x)}return this.ut=r,Qs(s,c),Pe}});var Kt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function te(s){return Kt[(s%Kt.length+Kt.length)%Kt.length]}var Vt="#23272E",Pn="35,39,46";var Fo=3,wt=36,Mn=12,Gt=8,ni=30,we=16,yt=100,Ke=60,Ln=10,qt=30,jn=10,Wo=150,Ko=200,Zt=1.4,Vo=26,Rn=4;function zn(s,t){let e=Math.max(Wo,Ko/Zt);return Math.ceil(Ke+Math.max(0,s-1)*Ln+qt+Math.max(0,t-1)*jn+e*(s+Zt*t))}function $e(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function ue(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ce(s){return new Map($e(s).map((t,e)=>[t,te(e)]))}function ae(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function le(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function In(s,t){return t==="none"?"Not needed":ue(s).includes(t)?le(s,t):t}function Jt(s,t){return t.own?le(s,t.own):ae(s,t.kid)}var $t={color:Vt,rgb:Pn,ink:Vt};function pi(s,t){return t.own?$t:ce(s).get(t.kid)??te(0)}function Go(s,t){let e=$e(s);return t.along.map(n=>e.includes(n)?ae(s,n):le(s,n))}function Qt(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function qo(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function Yt(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Dn(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(Yt(t,n.from)),e.push(Yt(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(Yt(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Yo(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,d)=>r.s-d.s||d.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let d=n.findIndex(c=>c<=r.s);d<0?(d=n.length,n.push(r.en)):n[d]=r.en,r.col=d,e.push(r),o=Math.max(o,r.en)}return i(),t}function Xo(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function Zo(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function hi(s,t){return Xo(s.anchors,t)}function ui(s,t){return Zo(s.anchors,t)}function Jo(s,t){let e=$e(s),n=ue(s),o=Math.max(t,zn(e.length,n.length)),r=(o-Ke-Math.max(0,e.length-1)*Ln-qt-Math.max(0,n.length-1)*jn)/(e.length+Zt*n.length||1),d=Math.floor(r),c=Math.floor(r*Zt),a=new Map;for(let E of s.days)for(let x of E.events)for(let y of x.own?x.along:[x.kid]){let k=a.get(y)??[];k.some(u=>u.event_id===x.event_id&&u.calendar_id===x.calendar_id)||k.push(x),a.set(y,k)}let l=ce(s),p=[],g=Ke;e.forEach((E,x)=>{let y=a.get(E)??[],k=s.days.some(u=>u.events.some(_=>_.kid===E&&(_.sides.includes("drop")&&_.drop===""||_.sides.includes("pick")&&_.pick==="")));p.push({id:E,kind:"kid",x:g,w:d,name:ae(s,E),dot:l.get(E).color,rgb:l.get(E).rgb,sub:`${k?"Needs a ride · ":""}${y.length} this week`,subWarn:k}),g+=d+(x<e.length-1?Ln:0)});let v=g+qt/2;return g+=qt,n.forEach((E,x)=>{let y=0,k=0;for(let u of s.days){let _=u.drivers[E];_&&(y+=_.outings.length,k+=_.drive??0)}p.push({id:E,kind:"driver",x:g,w:c,name:le(s,E),dot:Vt,rgb:Pn,sub:`${y} ${y===1?"trip":"trips"} this week · ${xt(k)} driving`,subWarn:!1}),g+=c+(x<n.length-1?jn:0)}),{columns:p,sepX:v,width:o}}function Qo(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function si(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${M(s.start)}`:e||!t?`${s.title} until ${M(s.end)}`:`${s.title} ${M(s.start)}–${M(s.end)}`}function Bn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function On(s,t){let e=ye(t,s);return e===0?"Today":e===1?"Tomorrow":""}function oe(s,t=0){return s==null||!Number.isFinite(s)?t:s}function ii(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let d=r.length;for(i===0?i=d:i+1+d<=n?i+=1+d:(o++,i=d);i>n;)o++,i-=n}return o}var fi=25,er=15,gi=3;function oi(s){return Math.max(0,Math.min(gi,Math.floor((s-fi)/er)))}var tr=fi+2,ri=20;function ai(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var Xt="🚗";function li(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,d=!1)=>({at:o,who:i,stays:d,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var di={muted:0,normal:1,pending:2,problem:3};function mi(s){let{drop:t,pick:e}=s,n=t?li(t.text,"drop"):null,o=e?li(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((c,a)=>a&&(di[a.tone]??1)>(di[c]??1)?a.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Xt} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${Xt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,a)=>c==="needed"?`${a} needed`:`${a}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,d=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Xt} ${d.join(" · ")}`,tone:i},pick:null}}function ci(s,t){let e=t-23,n=`${M(s.start)}–${M(s.end)}`+(s.arrive_by!=null?` · arrive ${M(s.arrive_by)}`:""),o=33+ii(n,e,6.6)*16,i=s.own?s.lines:mi(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+ii(r.text,e,7)*16);return o+4}function bi(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:d}=Jo(s,e),c=new Map(i.map(u=>[u.id,u])),a=$e(s),l=ue(s),p=[...a,...l],g=ce(s),v=qo(s),E=u=>ae(s,u),x=u=>le(s,u),y={mode:t,width:d,height:0,columns:i,sepX:r,dayHeads:[],allDay:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},k=0;return s.days.forEach((u,_)=>{let z=_*1440,G=new Map(u.events.map(f=>[f.id,f])),ne=f=>f&&G.has(f)?{day:u.date,event:f}:null,q=Bn(u),W=u.events.length,pe=On(u.date,n.date);y.dayHeads.push({date:u.date,y:k,label:xe(u.date),tag:pe,sub:(W?`${W} ${W===1?"activity":"activities"}`:"Nothing scheduled")+(q?` · ${q} to sort out`:""),warn:q>0}),y.anchors.push({t:z,y:k});let Q=or(s,u,g,d);Q&&y.allDay.push({...Q,y:k+wt+Rn});let fe=k+wt+Mn+(Q?Q.h+Rn:0),Re=l.flatMap(f=>u.drivers[f]?.outings??[]);if(!W&&!Re.length){y.empties.push({key:u.date,y:fe,text:"Nothing planned"}),k=fe+40,y.anchors.push({t:z+1439,y:k});return}let ge=(f,S,D,A,R,b,m,C=f.kid)=>{let P=!!f.own&&C===f.own,F=!!f.own&&C!==f.own,O=P?$t:g.get(C)??te(0),ee=P?x(C):E(C),se=F?{drop:{text:`With ${x(f.own)}`,tone:f.attending===!1?"muted":"normal"},pick:null}:m&&!f.own?mi(f.lines):f.lines,T=P?Go(s,f):[],Z=(f.takes!=null?`${f.takes} min, any time ${M(f.start)}–${M(f.end)}`:`${M(f.start)}–${M(f.end)}`+(f.arrive_by!=null?` · arrive ${M(f.arrive_by)}`:""))+(T.length?` · with ${Qt(T)}`:"");return{key:`${u.date}|card|${f.id}`+(f.own?`|${C}`:""),x:S,y:D,w:A,h:R,target:{day:u.date,event:f.id},event:f,color:O,kidName:ee,clash:b,stayed:!f.own&&f.stay&&l.includes(f.drop),skipped:f.attending===!1,title:Qo(f.title,ee),time:Z,drop:se.drop,pick:se.pick,showDrop:!!se.drop&&(m||R>=56),showPick:!!se.pick&&(m||R>=74),wrap:m,aria:`${ee}, ${f.title} ${f.takes!=null?`any time from ${M(f.start)} to ${M(f.end)}`:`${M(f.start)} to ${M(f.end)}`}. `+(f.attending===!1&&!se.drop?"Not attending. ":"")+[se.drop,se.pick].filter($=>!!$).map($=>$.text).join(". ")}},Te=f=>{let S=u.rides[f];return S?(u.drivers[S.driver]?.segments??[]).filter(A=>A.type!=="home"&&A.kids.includes(S.kid)&&oe(A.start)>=oe(S.start)&&oe(A.end)<=oe(S.end)):[]},_e=f=>{let S=u.rides[f];if(!S)return null;let D=S.serves.find(A=>G.get(A)?.kid===S.kid);return ne(D??S.serves[0])},Je=(f,S)=>{if(S.event)return S;let D=u.events.find(A=>A.own&&A.own!==f&&A.along.includes(f)&&A.title===S.title);return D?{...S,title:`${S.title} with ${x(D.own)}`}:S},Le=f=>{if(f.takes==null)return[f.start,f.end];let S=f.planned??f.start;return[S,S+f.takes]},L=new Map;for(let f of u.issues)f.level!=="problem"||!f.event||(f.kind==="late"&&L.set(f.event,`${Math.round(oe(f.minutes))} min late`),f.kind==="waiting"&&L.set(`${f.event}|pick`,`Waits ${Math.round(oe(f.minutes))} min`));if(!o){let f=1/0,S=-1/0;for(let m of u.events)m.start<=0&&m.end>=1440||(m.start>0?f=Math.min(f,m.start-20,m.arrive_by!=null?m.arrive_by-10:1/0):f=Math.min(f,m.end-30),m.end<1440?S=Math.max(S,m.end+20):S=Math.max(S,m.start+30));for(let m of Re)m.start!=null&&(f=Math.min(f,m.start)),m.end!=null&&(S=Math.max(S,m.end));u.date===n.date&&Number.isFinite(f)&&n.minutes>f-60&&n.minutes<S&&(f=Math.min(f,n.minutes-15));let D=Number.isFinite(f)?Math.floor((f-5)/30)*30:900,A=Number.isFinite(S)?Math.ceil((S+5)/30)*30:960,R=m=>Math.round(fe+(Math.max(D,Math.min(A,m))-D)*Fo);y.anchors.push({t:z+D,y:R(D)},{t:z+A,y:R(A)});for(let m of a){let C=c.get(m),P=g.get(m),F=(u.kids[m]?.items??[]).filter($=>$.start!=null&&$.end!=null).map($=>({item:$,s:oe($.start),en:oe($.end)})),O=[];for(let $ of Yo(F)){let j=C.w/$.cols,B=Math.round(C.x+$.col*j),K=Math.round(j-($.cols>1?4:0)),Y=R($.s),V=$.item;if(V.type==="act"){let de=G.get(V.event??"");if(!de)continue;let At=Math.max(30,R($.en)-Y),Pt=ge(de,B,Y,K,At,V.clash,!1,m);if(Pt.layer=yt,y.cards.push(Pt),de.arrive_by!=null&&de.start-de.arrive_by>=5){let mn=R(de.arrive_by),Es={key:`${u.date}|prep|${de.id}`,x:B,y:mn,w:K,h:Y-mn+we,color:P,label:`Arrive by ${M(de.arrive_by)}`,layer:yt-1};y.preps.push(Es),O.push({s:de.arrive_by,en:$.en,top:mn,bottom:Y+At,x:B,w:K,prep:Es,card:Pt})}else O.push({s:$.s,en:$.en,top:Y,bottom:Y+At,x:B,w:K,card:Pt});let $s=L.get(de.id);$s&&y.marks.push({key:`${u.date}|late|${de.id}`,x:B+K-4,y:Y+4,text:$s,right:!0});let ks=L.get(`${de.id}|pick`);ks&&y.marks.push({key:`${u.date}|wait|${de.id}`,x:B+4,y:Y+At+2,text:ks,right:!1});continue}let N=u.rides[V.ride??-1];if(!N)continue;let ve=Math.max(22,R($.en)-Y),dt=Dn(Te(N.index),v),xs=x(N.driver),ys={key:`${u.date}|ride|${N.index}`,x:B,y:Y,w:K,h:ve,target:_e(N.index),l1:`${N.own?"In":"Along in"} ${xs}’s car`,l2:dt.join(" → "),show2:oi(ve)>0,lines2:oi(ve),dashed:!N.own,clash:V.clash,aria:`${E(m)} ${N.own?"in":"riding along in"} ${xs}’s car, ${M(oe(N.start))} to ${M(oe(N.end))}: ${dt.join(" to ")}`};y.rides.push(ys);let ws=c.get(N.driver),gn=null;ws&&(gn={key:`${u.date}|band|${N.index}`,x:B+K,y:Y,w:Math.max(0,ws.x+8-(B+K)),h:ve,color:P},y.bands.push(gn)),O.push({s:$.s,en:$.en,top:Y,bottom:Y+ve,x:B,w:K,ride:ys,band:gn})}let ee=$=>$.ride?.layer??($.prep?yt-1:yt),se=($,j,B,K)=>{B>we&&y.links.push({key:`${$.key}|link`,x:$.x,y:j,w:$.w,h:B,color:P,layer:K})},T=($,j)=>{if(!(j.x<$.x||j.x+j.w>$.x+$.w)&&($.x=j.x,$.w=j.w,$.ride.x=j.x,$.ride.w=j.w,$.band)){let B=$.band.x+$.band.w;$.band.x=j.x+j.w,$.band.w=Math.max(0,B-$.band.x)}},Z=new Set;for(let $ of[...O].sort((j,B)=>B.s-j.s)){let j=$.ride;if(!j)continue;let B=O.filter(V=>V!==$&&V.s>=$.en&&V.s-$.en<=ni&&V.top>=$.bottom).sort((V,N)=>V.s-N.s||V.top-N.top)[0];if(!B)continue;Z.add($),T($,B);let K=ee(B),Y=B.top-$.bottom;se(j,$.bottom,Y+we,K-1),j.layer=K-(Y>0?2:1),j.h+=we,j.tuckBottom=we}for(let $ of[...O].sort((j,B)=>j.s-B.s)){let j=$.ride;if(!j||Z.has($))continue;let B=O.filter(V=>V!==$&&V.en<=$.s&&$.s-V.en<=ni&&V.bottom<=$.top&&(V.card||V.ride?.layer!=null)).sort((V,N)=>N.en-V.en||N.bottom-V.bottom)[0];if(!B)continue;T($,B);let K=B.ride?.layer??yt,Y=$.top-B.bottom;se(j,B.bottom-we,Y+we,K-1),j.layer=K-(Y>0?2:1),j.y-=we,j.h+=we,j.tuckTop=we}}for(let m of l){let C=c.get(m),P=u.drivers[m];if(!P)continue;let F=[],O=null;for(let T of P.segments)if(!(T.start==null||T.end==null)){if(T.type==="home"){O=null;continue}if(T.type==="stay"){O=null,F.push({type:"stay",g:T,s:T.start,en:T.end});continue}O&&O.en===T.start?(O.en=T.end,O.legs.push(T)):(O={type:"trip",s:T.start,en:T.end,legs:[T]},F.push(O))}let ee=new Set,se=(T,Z,$,j)=>{ee.add(T.id);let B=R(Z),K=ge(T,C.x+8,B,C.w-16,Math.max(30,R($)-B),!1,!1,m);j&&K.drop?.tone==="normal"&&(K.drop=null,K.showDrop=!1),y.cards.push(K)};for(let T of F){let Z=R(T.s),$=Math.max(24,R(T.en)-Z);if(T.type==="stay"){let N=G.get(T.g.event??T.g.serves??"");if(N?.own===m){se(N,T.s,T.en,!0);continue}let ve=N?g.get(N.kid)??te(0):te(0),dt=T.g.kids.map(E);y.stays.push({key:`${u.date}|stay|${m}|${T.s}`,x:C.x+8,y:Z,w:C.w-16,h:$,target:ne(N?.id),color:ve,l1:N?`At ${N.title} with ${E(N.kid)}`:"Staying",l2:`until ${M(T.en)}`+(dt.length?` · ${dt.join(" and ")} too`:"")});continue}let j=T.legs[0],B=T.legs[T.legs.length-1],K=[];for(let N of T.legs)for(let ve of N.kids)K.includes(ve)||K.push(ve);let Y=B.type==="drive"&&B.to==="home",V=Dn(T.legs,v);y.trips.push({key:`${u.date}|trip|${m}|${T.s}`,x:C.x+8,y:Z,w:C.w-16,h:$,target:ne(T.legs.find(N=>N.serves)?.serves),l1:j.type==="drive"&&j.from==="home"?`Leave ${M(T.s)}`:`From ${Yt(v,j.from??j.place)} ${M(T.s)}`,l2:V.join(" → "),show2:$>=36,l3:Y?`Home ${M(T.en)}`:"",show3:Y&&$>=62,stops:null,kids:K.map(N=>(g.get(N)??te(0)).color),bad:T.legs.some(N=>N.overlaps_busy),aria:`${x(m)} drives ${V.join(" to ")}, ${M(T.s)} to ${M(T.en)}`})}for(let T of P.segments)if(!(!T.overlaps_busy||T.start==null||T.end==null))for(let Z of P.busy){let $=Math.max(T.start,Z.start),j=Math.min(T.end,Z.end);j<=$||y.overlaps.push({key:`${u.date}|overlap|${m}|${$}`,x:C.x+6,y:R($)-2,w:C.w-12,h:Math.max(8,R(j)-R($)+4)})}for(let T of u.events)if(T.own===m&&(ee.has(T.id)||se(T,...Le(T),!1),T.takes!=null&&T.attending!==!1)){let Z=R(T.start);y.windows.push({key:`${u.date}|window|${T.id}`,x:C.x+4,y:Z,w:C.w-8,h:Math.max(24,R(T.end)-Z),label:`${T.title} · any time ${M(T.start)}–${M(T.end)}`})}for(let T of P.busy){if(T.event||T.end<=D||T.start>=A)continue;let Z=Je(m,T),$=R(Z.start),j=R(Z.end);y.busy.push({key:`${u.date}|busy|${m}|${Z.start}`,x:C.x+1,y:$,w:C.w-2,h:j-$,labelY:8,label:si(Z,!1)})}}let b=-1/0;for(let m=D;m<=A;m+=30)y.grid.push({key:`${u.date}|grid|${m}`,y:R(m),strong:m%60===0}),m%60===0&&R(m)-b>=22&&(y.hours.push({key:`${u.date}|hour|${m}`,y:R(m)-8,label:Vs(m)}),b=R(m));u.date===n.date&&n.minutes>D&&n.minutes<A&&(y.now={y:R(n.minutes),label:`Now ${M(n.minutes)}`}),k=R(A)+Mn;return}let H=[];for(let f of a){let S=c.get(f);for(let D of u.kids[f]?.items??[])if(D.start!=null){if(D.type==="act"){let A=G.get(D.event??"");if(!A)continue;H.push({col:f,s:D.start,h:ci(A,S.w),kind:"act",item:D})}else if(!u.rides[D.ride??-1]?.own){let A=u.rides[D.ride??-1],R=A?u.drivers[A.driver]?.outings.find(b=>b.start!=null&&b.start<=oe(A.start)&&oe(A.start)<=oe(b.end,b.start)):void 0;H.push({col:f,s:R?.start??D.start,h:tr,kind:"along",item:D})}}}for(let f of l){let S=u.drivers[f];if(!S)continue;for(let A of S.busy)A.event||H.push({col:f,s:A.start,h:32,kind:"busy",busy:Je(f,A)});let D=c.get(f).w;for(let A of u.events)A.own!==f||A.attending!==!1&&(A.takes==null||A.planned!=null)||H.push({col:f,s:Le(A)[0],h:ci(A,D),kind:"own",event:A});for(let A of S.outings){if(A.start==null)continue;let R=A.lines.length-(ai(A.lines)?1:0);H.push({col:f,s:A.start,h:30+R*16+(A.warn?16:0),kind:"out",out:A})}}H.sort((f,S)=>f.s-S.s||p.indexOf(f.col)-p.indexOf(S.col));let U=new Map,X=[],me=new Map,be=fe-ri;for(let f=0;f<H.length;){let S=f,D=be+ri;for(;S<H.length&&H[S].s===H[f].s;S++){let R=U.get(H[S].col);R!=null&&(D=Math.max(D,R+Gt))}let A=new Set;for(let R=f;R<S;R++){let b=H[R],m=A.has(b.col)?U.get(b.col)+Gt:D;A.add(b.col),U.set(b.col,m+b.h)}me.set(H[f].s,D),H[f].s>0&&y.hours.push({key:`${u.date}|hour|${H[f].s}`,y:D+2,label:He(H[f].s)}),be=D,f=S}U.clear(),H.forEach((f,S)=>{let D=U.get(f.col),A=Math.max(D!=null?D+Gt:fe,me.get(f.s));U.set(f.col,A+f.h);let R=f.kind==="busy"?f.busy.end:f.kind==="act"?G.get(f.item.event??"")?.end??null:f.kind==="own"?Le(f.event)[1]:null;X.push({col:f.col,s:f.s,end:R,y:A,h:f.h,box:null}),y.anchors.push({t:z+f.s,y:A});let b=c.get(f.col);if(f.kind==="busy"){let m={key:`${u.date}|busy|${f.col}|${S}`,x:b.x+1,y:A,w:b.w-2,h:f.h,labelY:8,label:si(f.busy,!0)};y.busy.push(m),X[X.length-1].box=m}else if(f.kind==="out"){let m=f.out,C=ai(m.lines),P=C?m.lines.slice(0,-1):m.lines;y.trips.push({key:`${u.date}|trip|${f.col}|${S}`,x:b.x+8,y:A,w:b.w-16,h:f.h,target:ne(m.target),l1:C?`${m.lead} · home ${C}`:m.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...P.map(F=>({text:F,warn:!1})),...m.warn?[{text:m.warn,warn:!0}]:[]],kids:m.kids.map(F=>(g.get(F)??te(0)).color),bad:!!m.warn,aria:`${x(f.col)}: ${m.lead}. ${m.lines.join(". ")}${m.warn?`. ${m.warn}`:""}`})}else if(f.kind==="own"){let m=ge(f.event,b.x+8,A,b.w-16,f.h,!1,!0,f.col);y.cards.push(m),X[X.length-1].box=m}else if(f.kind==="act"){let m=G.get(f.item.event??""),C=ge(m,b.x,A,b.w,f.h,f.item.clash,!0,f.col);y.cards.push(C),X[X.length-1].box=C}else{let m=u.rides[f.item.ride??-1],C=Dn(Te(m.index),v),P=x(m.driver);y.rides.push({key:`${u.date}|ride|${m.index}`,x:b.x,y:A,w:b.w,h:f.h,target:_e(m.index),l1:`${Xt} with ${P}`,l2:C.join(" → "),show2:!1,lines2:gi,dashed:!0,clash:f.item.clash,aria:`${E(f.col)} riding along with ${P}, ${M(oe(m.start))} to ${M(oe(m.end))}: ${C.join(" to ")}`})}});let I=fe;for(let f of U.values())I=Math.max(I,f);for(let f of X){if(!f.box||f.end==null)continue;let S=f.y+f.h;for(let D of X)D.col!==f.col&&D.s>=f.s&&D.s<f.end&&(S=Math.max(S,D.y+D.h));f.end>=1440&&(S=I);for(let D of X)D.col===f.col&&D.y>f.y&&(S=Math.min(S,D.y-Gt));S=Math.min(S,I),S>f.y+f.h&&(f.box.h=S-f.y)}k=I+Mn+6,y.anchors.push({t:z+1439,y:k})}),y.height=k,y}var nr=["","¼","½","¾"];function We(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return xt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=nr[o%4];return`${i||!r?i:""}${r} min`})}function vi(s){let t=e=>e?{...e,text:We(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(We),warn:i.warn==null?i.warn:We(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:We(n.title),body:We(n.body),note:n.note==null?n.note:We(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:We(o.note)}))}:{}}))}))}}var sr=2,ir=48;function xi(s,t,e=ir){let n=[],o=new Set(ue(s)),i=$e(s).map(g=>ae(s,g)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],d=0,c=0,a=0,l=0,p=t.minutes+e*60;for(let g of s.days){let v=ye(t.date,g.date),E=v===0?"":`${re(g.date)} · `,x=new Map(g.events.map(u=>[u.id,u])),y=u=>u&&x.has(u)?{day:g.date,event:u}:null,k=(u,_)=>v*1440+(u??x.get(_??"")?.start??0)<p;for(let u of g.issues)if(u.level==="problem"){if(!k(u.at,u.event)){a++,u.kind==="unassigned"&&l++;continue}d++,u.kind==="unassigned"&&c++,n.push({key:`${g.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:E+u.title,body:u.body,target:y(u.event),suggestions:(u.suggestions??[]).map(_=>({id:_.id,label:_.label,note:_.note}))})}if(g.clashes.forEach((u,_)=>{if(!k(u.a.start,u.a.event)){a++;return}d++;let z=x.get(u.a.event??""),G=ae(s,u.kid),ne=(W,pe)=>{let Q=y(pe);return Q?{text:W,target:Q}:W},q=[];if(u.b.type==="act"){let W=x.get(u.b.event??"");z&&W&&(q=[ne(z.title,z.id),` ${M(z.start)}–${M(z.end)} and `,ne(W.title,W.id),` ${M(W.start)}–${M(W.end)} overlap.`])}else{let W=g.rides[u.b.ride??-1];z&&W&&(q=[`${G} is in `,ne(`${le(s,W.driver)}’s car`,W.serves[0]),` ${M(oe(u.b.start))}–${M(oe(u.b.end))}, during `,ne(z.title,z.id),"."])}n.push({key:`${g.date}|clash|${_}`,tone:"problem",title:`${E}${G} is double-booked`,body:q.map(W=>typeof W=="string"?W:W.text).join(""),parts:q,target:null,suggestions:[]})}),v>=0&&v<sr)for(let u of g.issues)u.level!=="heads_up"||!k(u.at,u.event)||n.push({key:`${g.date}|${u.key}`,tone:"heads_up",title:E+u.title,body:u.body,target:y(u.event),suggestions:[]});for(let u of g.unplaced??[]){if(!k(u.at)){a++;continue}d++;let _=u.people.map(z=>o.has(z)?le(s,z):ae(s,z));n.push({key:`${g.date}|unplaced|${u.id}`,tone:"problem",title:`${E}${M(u.at)} ${u.title}: ${yi(u).toLowerCase()}`,body:u.reason==="unknown"&&u.word?`“${u.word}” isn’t anyone in the family, so this is only in ${Qt(_)}’s lane. If it’s a misspelt name, fix the title in Google Calendar.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Start the title in Google Calendar with who it’s for, such as “${r[0]} Piano”, or “${r.join(" & ")} Piano” for both.`,target:null,suggestions:[]})}for(let u of g.events)!u.problems.length||!k(u.start)||n.push({key:`${g.date}|notes|${u.id}`,tone:"heads_up",title:`${E}Check the notes on ${Jt(s,u)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:y(u.id),suggestions:[]})}return{items:n,problems:d,unassigned:c,later:a,laterUnassigned:l}}function yi(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function or(s,t,e,n){let o=new Set(ue(s)),i=l=>{let p=l[0];return p==null?null:o.has(p)?$t:e.get(p)??null},r=[...(t.all_day??[]).map(l=>({key:`${t.date}|allday|${l.id}`,title:l.title,note:l.days>1?`Day ${l.day_number} of ${l.days}`:"",color:i(l.people),cancelled:l.cancelled,warn:!1})),...(t.unplaced??[]).map(l=>({key:`${t.date}|unplaced|${l.id}`,title:`${M(l.at)} ${l.title}`,note:yi(l),color:null,cancelled:!1,warn:!0}))];if(!r.length)return null;let d=Math.max(120,n-Ke),c=1,a=0;for(let l of r){let p=Math.min(d,30+7*(l.title.length+(l.note?l.note.length+2:0)));a&&a+p>d&&(c++,a=0),a+=p}return{key:`${t.date}|allday`,h:c*Vo+(c-1)*Rn,chips:r}}function wi(s,t){let e=ce(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=ye(t.date,i.date);if(!(r<0))for(let d of ue(s))for(let c of i.drivers[d]?.outings??[]){if(c.start==null)continue;let a=r*1440+c.start;if(r*1440+oe(c.end,c.start)<=t.minutes)continue;let p=a-t.minutes,g={driver:d,name:le(s,d),date:i.date,ahead:r,start:c.start,inMinutes:p,ongoing:p<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(v=>e.get(v)??te(0)),warn:c.warn,target:c.target&&i.events.some(v=>v.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(g)<o(n)||o(g)===o(n)&&g.inMinutes<n.inMinutes)&&(n=g)}}return n}function nt(s){return s.state==="done"||s.state==="late"}var rr=780;function ar(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<rr}function $i(s,t){return s.chores.map(e=>ar(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function ki(s){return s.state==="open"||s.state==="overdue"}function Hn(s,t,e){if(nt(s)){let n=s.done_at?lr(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Nn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Nn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=ye(t,s.due);return`By ${o===1?"tomorrow":o<7?re(s.due):Un(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Nn(s.for_day,t)}`;if(s.due&&s.due>t){let n=ye(t,s.due);return n===1?"By tomorrow":`By ${n<7?re(s.due):Un(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Nn(s,t){let e=ye(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?re(s):Un(s)}function Un(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function lr(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${re(i)} ${r}`}function Ei(s,t,e=1440){let n=$i(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(l=>l.kid===o.id),d=new Map;for(let l of r){if(l.state!=="upcoming")continue;let p=l.shows_from??l.due??s.today;d.set(p,[...d.get(p)??[],l])}let c=r.filter(l=>l.state==="overdue"),a=r.filter(l=>l.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??te(i),overdue:c,now:a,done:r.filter(nt),later:[...d.entries()].sort(([l],[p])=>l.localeCompare(p)).map(([l,p])=>({date:l,chores:p})),left:c.length+a.length}})}function Ci(s,t=1440){return $i(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Fn(s){return!s.chores.length&&!s.templates.length}var Ve=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Wn(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>Ve.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function Kn(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Ve[n[0]]}-${Ve[n.at(-1)]}`]:n.map(o=>Ve[o])).join(", ")}var Ge="none";function en(s){return s==="daily"||s==="school"?"":"Any"}function Ti(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function _i(s){let t=s.days??en(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function Vn(s){return s.title.trim()?s.who.length?s.days===Ge?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Si(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function Gn(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function qn(s,t,e=1,n=!1,o=!1){if(s==="school"){let l=t.trim().replace(/-/g,"–"),p=o?l?`${l} Bring lunch days`:"Bring lunch days":l?`${l} school days`:"Every school day";return n?`${p}, the night before`:p}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,d=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(d))return e>1?`Every day, every ${e} weeks`:"Every day";if(!d||d.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${d.replace(/-/g,"–")} ${r}`;let a=`${d.split(",").map(l=>{let p=l.trim();return p.toLowerCase()==="last"?"the last day":/^\d+$/.test(p)?`the ${Gn(Number(p))}`:`the ${p}`}).join(" and ")} ${r}`;return a[0].toUpperCase()+a.slice(1)}function Yn(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function Xn(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function tn(s,t){return`${s}|${t}`}function st(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function nn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Ai(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Pi(s,t){return nn(t)<5&&!Ai(s,t)}function kt(s,t,e=new Map){if(!Pi(s,t))return null;let n=tn(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function it(s,t){return Pi(s,t)?s.menus?.[t]??null:null}var dr="From the school's menu feed.";function cr(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==dr);return t.length?t.join(`
`):null}function ke(s){return s.slice(0,7)}function sn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Zn(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Mi(s){let t=[];for(let e=ke(s.first);e<=ke(s.last);e=Zn(e))t.push(e);return t}function Di(s,t,e,n=new Map){let o=`${e}-01`,i=st(o,-nn(o)),r=[];for(;ke(i)<=e;){let d=[];for(let c=0;c<5;c++){let a=st(i,c),l=ke(a)!==e,p=l?null:Ai(t,a),g=l?null:kt(t,a,n);d.push({date:a,day:Number(a.slice(8)),outside:l,off:p?p.title:null,lunch:g?.lunch??null,picked:g?.picked??!1,menu:l?null:it(t,a)?.dish??null,sides:l?null:cr(it(t,a)?.details??""),past:a<s.today,today:a===s.today})}d.some(c=>!c.outside)&&r.push(d),i=st(i,7)}return r}function Li(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function ji(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Ri(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=st(t,i),d=kt(s,r,n);if(!d)continue;let c=ye(t,r);return{lunch:d.lunch,when:c===0?"today":c===1?"tomorrow":re(r),date:r,menu:it(s,r)?.dish??null}}return null}var pr={timeline:"timeline",full:"timeline",compact:"compact"};function Jn(s){let t=new URLSearchParams(s),e={},n=pr[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),e}var zi=ze`
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
`;var $o="mydashlight.rides.mode",Fa=1100,Wa=440,Ka=700,Va=3*6e4,Ga=1200;function qa(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var un=ie`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,vo=ie`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Ya=new URL("emoji.json",import.meta.url).href,xo=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],yo=ie`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,wo=ie`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Xa=ie`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Za=ie`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Tt={bring:"Bring",buy:"Buy"};function Ja(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Ce(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function vs(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Qa(s,t){return On(s,t)||xe(s).split(",")[0]}function el(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function tl(){try{return localStorage.getItem($o)==="compact"?"compact":"timeline"}catch{return"timeline"}}function nl(s){try{localStorage.setItem($o,s)}catch{}}function fn(s){return s.days.every(t=>!t.events.length)}var _t=class extends he{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Jn(location.search).view;this.urlPage=Jn(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Va))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??tl(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,d]=o.split("|"),c=e.kids.find(a=>a.id===r);(!c||(c.picks[d]??null)===i||!kt(c,d))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&nt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=vi(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Fa)return!1;let e=this.plan;return!e||this.width-Wa>=zn($e(e).length,ue(e).length)}today(){return vt(this.plan?.time_zone??qa())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||o!==this.boardKey)&&(this.board=bi(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let o=this.scroller;if(!o||!this.board)return;let i=this.board.dayHeads.find(r=>r.date===n)?.y??0;o.scrollTop=Math.max(i,hi(this.board,e)-wt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let o=this.today();if(e===o.date){this.scrollToNow();return}let i=this.dayIndexOf(e),r=n.days[i];if(!r)return;let d=1/0;if(this.mode==="timeline"){for(let c of r.events)d=Math.min(d,c.arrive_by??c.start);for(let c of Object.values(r.drivers))for(let a of c.outings)a.start!=null&&(d=Math.min(d,a.start))}this.scrollToTime(i*1440+(Number.isFinite(d)?Math.max(0,d-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let a of this.board.dayHeads)a.y<=n+1&&(o=a);let i=this.renderRoot,r=i.querySelector(".pinned .label"),d=i.querySelector(".pinned .tag"),c=i.querySelector(".pinned .sub");r&&r.textContent!==o.label&&(r.textContent=o.label),d&&(d.textContent!==o.tag&&(d.textContent=o.tag),d.hidden=!o.tag),c&&c.textContent!==o.sub&&(c.textContent=o.sub),c?.classList.toggle("warn",o.warn);for(let a of i.querySelectorAll(".day-tile"))a.classList.toggle("in-view",a.dataset.date===o.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let d=new Map(this.choreDraft);d.delete(e.id),this.choreDraft=d;let c=r instanceof J?r:new J("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??nt(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=it(e,n),r=o.filter(d=>d.id===e.id||i&&it(d,n)?.dish===i.dish).map(d=>d.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof J?o:new J("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(tn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let d=new Map(this.lunchDraft);for(let a of n)d.delete(tn(e,a));this.lunchDraft=d;let c=r instanceof J?r:new J("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?_i(e):Ti(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(bo(),mo))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Vn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Si(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof J?n:new J("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof J?n:new J("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?ui(this.board,n.scrollTop+wt+4):null,this.mode=e,this.urlView||nl(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof J?i:new J("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o){if(!this.backend)return;let i=this.backend;this.save(`${n}`,o,()=>i.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,d=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,d,()=>i.setTakeAlong(e.id,d,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Ga)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,d=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,d)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=e?xi(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},i=this.wide,r=this.chores?Ci(this.chores,this.today().minutes).filter(p=>!this.choreDone(p)):[],d=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",a=h`<aside class="panel" aria-label=${c}>
      ${d??(this.sel&&e?this.renderEditor(e):this.renderAttention(o,r))}
    </aside>`,l=this.page==="rides";return h`
      <div class="app ${i?"wide":this.width<Ka?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,o,r.length)} ${l&&e?this.renderWeek(e):w}
          ${l?this.renderBanner(e):w}
          <main>
            ${l?h`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?fn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:this.page==="lunch"?h`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:h`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!i&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?h`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${a}`:w}
          </main>
        </div>
        ${i?a:w}
        ${this.toast?h`<div class="toast" role="status">${this.toast}</div>`:w}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),d="";if(e){let g=e.time_zone,v=new Date(e.updated);this.error?d=h`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Ut(v,new Date,g)}</span>`:e.status&&!e.status.ok?d=h`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Ut(v,new Date,g)}</span>`:this.backend?.live||(d=`Updated ${Ut(v,new Date,g)}`)}let c=(g,v,E,x)=>h`
      <button type="button" class="seg-btn" title=${x} aria-pressed=${this.mode===g?"true":"false"} @click=${()=>this.setMode(g)}>
        ${E}<span class="seg-label">${v}</span>
      </button>
    `,a=(g,v,E)=>h`
      <button type="button" class="seg-btn" aria-pressed=${this.page===g?"true":"false"} @click=${()=>this.setPage(g)}>
        ${E}<span class="seg-label">${v}</span>
      </button>
    `,l=He(r.minutes),p=!!e&&fn(e);return h`
      <header>
        ${this.showMenu?h`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ie`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:w}
        <div class="titles">
          <h1 class="clock" aria-label=${`${xe(r.date)}, ${l}`}>
            <span class="hm">${l.slice(0,-3)}</span><span class="ampm">${l.slice(-2)}</span>
          </h1>
          <p class="today-line">${xe(r.date)}</p>
          ${d?h`<p class="status">${d}</p>`:w}
        </div>
        ${e&&!p?this.renderNext(e,wi(e,r),n):w}
        <div class="controls">
          ${this.wide||p&&!o?w:h`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?w:h`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",ie`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",ie`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${a("rides","Rides",ie`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${a("chores","Chores",ie`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?w:a("lunch","Lunch",ie`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let a=this.today().date,l=o.unassigned,p=o.laterUnassigned;if(l){let v=h`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${l} ${l===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?h`<div class="next idle needs">${v}</div>`:h`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${v}</button>`}if(p)return h`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${p} ${p===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let g=e.days.some(v=>v.date>=a&&v.events.length);return h`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${g?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${g?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${xt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${re(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,d=h`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Ce(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(a=>h`<span class="kid-dot" style="background:${a.color}"></span>`)}</span>
      </span>
      ${n.warn?h`<span class="next-stop warn">${n.warn}</span>`:n.stop?h`<span class="next-stop">${n.stop}</span>`:w}
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?h`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${d}</button>`:h`<div class=${c}>${d}</div>`}renderWeek(e){let n=this.today().date,o=ce(e);return h`<nav class="week" aria-label="Days">
      ${e.days.map(i=>{let r=Bn(i),d=i.events.length,c=i.events.slice(0,6).map(l=>l.own?$t.color:o.get(l.kid)?.color??te(0).color),a=`${xe(i.date)}: ${d?`${d} ${d===1?"activity":"activities"}`:"nothing planned"}${r?`, ${r} to sort out`:""}`;return h`<button
          type="button"
          class="day-tile ${i.date===n?"today":""}"
          data-date=${i.date}
          aria-label=${a}
          @click=${()=>this.goToDay(i.date)}
        >
          <span class="dt-wd">${i.date===n?"Today":re(i.date)}</span>
          <span class="dt-num">${Number(i.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${c.length?c.map(l=>h`<span class="dt-dot" style="background:${l}"></span>`):h`<span class="dt-free">free</span>`}
            ${d>6?h`<span class="dt-more">+${d-6}</span>`:w}
          </span>
          ${r?h`<span class="dt-badge" aria-hidden="true">${r}</span>`:w}
        </button>`})}
    </nav>`}renderQuiet(e){let n=$e(e),o=ue(e),i=ce(e),r=n.map(d=>ae(e,d));return h`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((d,c)=>ie`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(d).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${el(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(d=>{let c=i.get(d);return h`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Ce(ae(e,d))}</span>
            <span class="qw-name">${ae(e,d)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(d=>h`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Ce(le(e,d))}</span>
            <span class="qw-name">${le(e,d)}</span>
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
    </div>`}renderBanner(e){if(e?.needs_setup==="events_calendar")return h`<div class="banner" role="status">
        Pick your family calendar to see the week: in Home Assistant, open Settings &gt; Devices &amp; services &gt; MyDashLight &gt;
        Configure &gt; Calendars.
      </div>`;let n=e?.unavailable_calendars.length??0;return n?h`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:w}renderEmpty(){return this.error?h`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:h`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,o=a=>!!a&&!!n&&a.day===n.day&&a.event===n.event,i=e.dayHeads[0],r=e.width,d=100,c=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??d-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??d})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??d+1}))].sort((a,l)=>a.z-l.z);return h`
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
          ${e.columns.map(a=>h`<div class="col-head ${a.kind}" style="left:${a.x}px;width:${a.w}px;--c:${a.dot};--rgb:${a.rgb}">
              <span class="avatar ${a.kind}" aria-hidden="true">${Ce(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0):w}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${r}px">
          <span class="label">${i?.label??""}</span><span class="tag" ?hidden=${!i?.tag}>${i?.tag??""}</span
          ><span class="sub ${i?.warn?"warn":""}">${i?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(a=>h`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>h`<div class="day-head" style="top:${a.y}px;width:${r}px">
              <span class="label">${a.label}</span>${a.tag?h`<span class="tag">${a.tag}</span>`:w}<span
                class="sub ${a.warn?"warn":""}"
                >${a.sub}</span
              >
            </div>`)}
          ${e.allDay.map(a=>h`<div class="allday" style="top:${a.y}px;left:${Ke}px;width:${r-Ke}px;height:${a.h}px">
              ${a.chips.map(l=>h`<span
                    class="ad-chip ${l.warn?"warn":""} ${l.cancelled?"skipped":""} ${l.color?"":"plain"}"
                    style=${l.color?`--c:${l.color.color};--rgb:${l.color.rgb};--ink:${l.color.ink}`:""}
                    ><span class="ad-title">${l.title}</span>${l.note?h`<span class="ad-note">${l.note}</span>`:w}</span
                  >`)}
            </div>`)}
          ${e.empties.map(a=>h`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>h`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(a=>h`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${Me(e.bands,a=>a.key,a=>h`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${Me(e.busy,a=>a.key,a=>h`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${Me(e.windows,a=>a.key,a=>h`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${Me(c,a=>a.x.key,a=>{if(a.t==="link"){let v=a.x;return h`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${v.x}px;top:${v.y}px;width:${v.w}px;height:${v.h}px;border-color:${v.color.color};background:linear-gradient(rgba(${v.color.rgb},0.11), rgba(${v.color.rgb},0.11)), var(--surface)"
                ></div>`}if(a.t==="prep"){let v=a.x;return h`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${v.x}px;top:${v.y}px;width:${v.w}px;height:${v.h}px;border-color:${v.color.color};background:linear-gradient(rgba(${v.color.rgb},0.11), rgba(${v.color.rgb},0.11)), var(--surface);color:${v.color.ink}"
                >
                  ${v.label}
                </div>`}if(a.t==="ride"){let v=a.x;return h`<button
                  type="button"
                  class="ride ${v.dashed?"dashed":""} ${v.clash?"clash":""}"
                  aria-label=${v.aria}
                  style="left:${v.x}px;top:${v.y}px;width:${v.w}px;height:${v.h}px;padding-top:${3+(v.tuckTop??0)}px;padding-bottom:${3+(v.tuckBottom??0)}px"
                  @click=${()=>this.open(v.target)}
                >
                  <span class="l1">${v.l1}</span>${v.show2?h`<span class="l2" style="-webkit-line-clamp:${v.lines2}">${v.l2}</span>`:w}
                </button>`}let l=a.x,p=l.color,g=l.skipped?`repeating-linear-gradient(135deg, rgba(${p.rgb},0.10) 0px, rgba(${p.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:l.stayed?`repeating-linear-gradient(135deg, rgba(${p.rgb},0.24) 0px, rgba(${p.rgb},0.24) 6px, rgba(${p.rgb},0.08) 6px, rgba(${p.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${p.rgb},0.15), rgba(${p.rgb},0.15)), var(--surface)`;return h`<button
                type="button"
                class="card ${l.wrap?"wrap":""} ${o(l.target)?"sel":""} ${l.clash?"clash":""} ${l.skipped?"skipped":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:${g};border-color:${l.clash?"var(--bad)":`rgba(${p.rgb},0.45)`};--c:${p.color};--rgb:${p.rgb};--ring:${p.color}"
                @click=${()=>this.open(l.target)}
              >
                <span class="top">
                  <span class="title">${l.title}</span>
                  <span class="time">${l.time}</span>
                  ${l.showDrop&&l.drop?h`<span class="line tone-${l.drop.tone}">${l.drop.text}</span>`:w}
                </span>
                ${l.showPick&&l.pick?h`<span class="line tone-${l.pick.tone}">${l.pick.text}</span>`:w}
              </button>`})}
          ${Me(e.stays,a=>a.key,a=>h`<button
                type="button"
                class="stay"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${Me(e.trips,a=>a.key,a=>h`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(l=>h`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${a.show2?h`<span class="l2">${a.l2}</span>`:w}
                ${a.stops?a.stops.map(l=>h`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):w}
                ${a.show3?h`<span class="l3">${a.l3}</span>`:w}
              </button>`)}
          ${Me(e.overlaps,a=>a.key,a=>h`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${Me(e.marks,a=>a.key,a=>h`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${e.now?h`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:w}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,d=this.plan,c=i+n.length,a=this.chores,l=!!a&&!Fn(a);return h`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?w:h`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${l?h`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?h`<div class="attn-chores">${n.map(p=>this.renderChoreRow(p,!0))}</div>`:h`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:h`<p class="panel-sub">Rides in the next two days</p>`}
      ${d&&!i?h`<div class="all-clear">
            <span class="check" aria-hidden="true">${ie`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${fn(d)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:w}
      ${o.map(p=>h`<div class="issue ${p.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${p.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${p.target?h`<button type="button" class="issue-title" @click=${()=>this.open(p.target,!0)}>${p.title}</button>`:h`<strong class="issue-title">${p.title}</strong>`}
              <span class="issue-body"
                >${p.parts?p.parts.map(g=>typeof g=="string"?g:h`<button type="button" class="issue-link" @click=${()=>this.open(g.target,!0)}>${g.text}</button>`):p.body}</span
              >
            </div>
          </div>
          ${p.suggestions.length?h`<div class="fixes">
                ${p.suggestions.map(g=>h`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(g.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${g.id}`?"Saving…":g.label}</span>
                    <span class="fix-note">${g.note}</span>
                  </button>`)}
              </div>`:w}
        </div>`)}
      ${this.wide&&d&&!fn(d)&&this.page==="rides"?this.renderLegend():w}
    `}kidColorOf(e){let n=this.plan?ce(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return te(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(a=>a.id===e);if(!o||!i)return w;this.tick;let r=this.today(),d=Ri(i,r.date,r.minutes,this.lunchDraft);if(!d)return w;let c=Tt[d.lunch];return h`<span class="lunch-chip ${d.lunch} ${n?"small":""}" title=${`${c} lunch ${d.when}${d.menu?`: ${d.menu}`:""}`}
      >${d.lunch==="bring"?yo:wo}<span class="lunch-chip-text"
        >${c}${n?w:` ${d.when}`}${!n&&d.menu?h`<span class="lunch-chip-menu"> · ${d.menu}</span>`:w}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return h`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return h`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Mi(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:ke(e.today),i=n.indexOf(o),r=l=>{let p=n[i+l];p&&(this.lunchMonth=p)},d=e.kids.some(l=>l.id===this.lunchKid)?this.lunchKid:null,c=d?e.kids.filter(l=>l.id===d):e.kids,a=e.status&&!e.status.ok?h`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:w;return h`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${ie`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${sn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${ie`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":h`${vo} Edit menus`}
        </button>
      </div>
      ${a}
      <div class="chore-cols lunch-cols ${d?"wide":""}" style="--n:${c.length}">
        ${c.map(l=>this.renderLunchCard(e,l,o,d!==null))}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),d=Di(e,n,o,this.lunchDraft),c=ji(d),a=d.flat(),l=a.filter(x=>!x.outside&&!x.past&&x.lunch),p=n.days_off.filter(x=>ke(x.first)<=o&&o<=ke(x.last)),g=x=>l.filter(y=>nn(y.date)===x),v=x=>{let y=g(x);if(!y.length)return;let k=y.every(u=>u.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,y.map(u=>u.date),k)},E=l.length?`${c.bring} Bring · ${c.buy} Buy${o===ke(e.today)?" left this month":""}`:"No school days left this month";return h`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Ce(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${E}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Tt[n.default]} unless picked</span>
          ${e.kids.length<2?w:h`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?Za:Xa}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?h`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:w}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${sn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((x,y)=>h`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!g(y).length}
            aria-label=${`${g(y).every(k=>k.lunch==="bring")?"Buy":"Bring"} every ${x} left in ${sn(o)} for ${n.name}`}
            @click=${()=>v(y)}
          >
            ${x}
          </button>`)}
        ${a.map(x=>this.renderLunchCell(n,x,i))}
      </div>
      ${p.length?h`<p class="lunch-offs">
            No school:
            ${p.map(x=>{let y=x.first<`${o}-01`?`${o}-01`:x.first,k=ke(x.last)>o?st(`${Zn(o)}-01`,-1):x.last;return`${y===k?vs(y):`${vs(y)}–${vs(k)}`} ${Li(x.title)}`}).join(" · ")}
          </p>`:w}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return h`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return h`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",d=n.menu?`, ${n.menu}`:"",c=this.menuMode,a=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),l=c?`${e.name}, ${xe(n.date)}${d||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${xe(n.date)}: ${Tt[i]}${n.picked?"":" (not picked yet)"}${d}. Tap to ${Tt[r]}.`;return h`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${a?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${l}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?yo:wo}${Tt[i]}</span>
      ${n.menu?h`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?h`<span class="lunch-sides">${n.sides}</span>`:w}`:c?h`<span class="lunch-menu add">${un} Menu</span>`:w}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(k=>k.id===e.kid),d=(this.plan?ce(this.plan).get(e.kid):void 0)??te(Math.max(0,r)),c=o.kids[r]?.name??"",a=i===nt(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},l=i&&a.done_by&&a.done_by!==e.kid?o.people?.find(k=>k.id===a.done_by)?.name??a.done_by_name??null:null,p=`${Hn(a,o.today,o.time_zone)}${l?` · by ${l}`:""}`,g=i||ki(e),v=`${n?`${c}: `:""}${e.title}. ${p?`${p}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,E=h`<span class="box" aria-hidden="true"
        >${i?ie`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:w}</span
      >
      ${e.icon?h`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:w}
      <span class="chore-text">
        <span class="chore-title">${n?h`<span class="chore-kid">${c}</span> · `:w}${e.title}</span>
        ${p?h`<span class="chore-note">${p}</span>`:w}
      </span>`,x=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${g?"":"later"}`,y=`--c:${d.color};--rgb:${d.rgb};--k:${d.ink}`;return g?h`<button type="button" class=${x} style=${y} aria-pressed=${i?"true":"false"} aria-label=${v} @click=${()=>this.tapChore(e)}>
          ${E}
        </button>`:h`<div class=${x} style=${y}>${E}</div>`}renderChores(){let e=this.chores;if(e===void 0)return h`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return h`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return h`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return h`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Fn(e))return h`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${un} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?h`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:w;this.tick;let i=Ei(e,this.plan?ce(this.plan):void 0,this.today().minutes);return h`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${un} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${vo} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let d=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return h`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Ce(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${d?`${d} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?h`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:w}
            ${r.now.length?h`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:w}
            ${r.done.length?h`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:w}
            ${r.later.map(c=>h`<h3 class="chore-group">${c.date===e.today?"Later today":Qa(c.date,e.today)}</h3>
                ${c.chores.map(a=>this.renderChoreRow(a))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?h`<p class="chore-none">No chores this week.</p>`:w}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?ce(this.plan):void 0,r=this.choreEdit?.template===e.id,d=e.problems.length?h`<span class="tmpl-note bad">${e.problems.map(Xn).join(" · ")} · tap to set up</span>`:h`<span class="tmpl-note">${Yn(e.who,o,e.take_turns)} · ${qn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return h`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?h` <span class="tag-paused">Paused</span>`:w}</span>
        ${d}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let a=o.findIndex(p=>p.id===c),l=i?.get(c)??te(Math.max(0,a));return h`<span class="kid-dot" style="background:${l.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return h`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${un} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(d=>d.repeats===o);return r.length?h`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(d=>this.renderTemplateRow(d))}</div>
                </section>`:w}):h`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return h``;let o=n.kids,i=this.plan?ce(this.plan):void 0,r=this.choreBusy,d=e.template?n.templates.find(x=>x.id===e.template):void 0,c=Vn(e),a=(d?.problems??[]).filter(x=>x!=="who:"),l=(x,y,k,u=!1)=>h`<button type="button" class="choice ${u?"wide":""}" aria-pressed=${x?"true":"false"} ?disabled=${r} @click=${k}>${y}</button>`,p=(x,y,k,u)=>h`<button type="button" class="chip" aria-pressed=${x?"true":"false"} aria-label=${u??w} ?disabled=${r} @click=${k}>${y}</button>`,g=x=>{x!==e.repeats&&this.changeDraft({repeats:x,days:d&&d.repeats===x?d.days??en(x):en(x)})},v=x=>{let y=e.who.includes(x)?e.who.filter(k=>k!==x):o.filter(k=>k.id===x||e.who.includes(k.id)).map(k=>k.id);this.changeDraft({who:y})},E;if(e.repeats==="school"){let x=e.days===Ge?new Set:e.days===""?new Set([0,1,2,3,4]):Wn(e.days)??new Set,y=k=>{let u=new Set(x);u.has(k)?u.delete(k):u.add(k),this.changeDraft({days:u.size===5?"":u.size?Kn(u):Ge})};E=h`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Ve.slice(0,5).map((k,u)=>p(x.has(u),k.slice(0,2),()=>y(u),k))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${l(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${l(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${l(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let x=e.days.trim(),y=/^\d+$/.test(x)?Number(x):null,k=x&&x.toLowerCase()!=="any"&&x.toLowerCase()!=="last"&&y===null;E=h`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${k?4:3}, minmax(0, 1fr))">
          ${l(x===""||x.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${l(y!==null,"On a date",()=>this.changeDraft({days:String(y??1)}))}
          ${l(x.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${k?l(!0,x,()=>{}):w}
        </div>
        ${y!==null?h`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||y<=1} @click=${()=>this.changeDraft({days:String(y-1)})}>−</button>
                <span class="arrive-value">${Gn(y)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||y>=31} @click=${()=>this.changeDraft({days:String(y+1)})}>+</button>
              </span>
            </div>`:h`<p class="field-hint">${x.toLowerCase()==="last"?"Due on the month’s last day.":k?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")E=h`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let x=e.days===""||e.days.toLowerCase()==="any",y=e.days===Ge?new Set:x?new Set:Wn(e.days)??new Set,k=u=>{let _=new Set(y);_.has(u)?_.delete(u):_.add(u),this.changeDraft({days:_.size?Kn(_)||"Mon-Sun":Ge})};E=h`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${l(x,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${l(!x,"On set days",()=>this.changeDraft({days:x?"Sat":e.days}))}
        </div>
        ${x?h`<p class="field-hint">Shows all week, due on Sunday.</p>`:h`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Ve.map((u,_)=>p(y.has(_),u.slice(0,2),()=>k(_),u))}
              </div>
              <div class="chips">
                ${p(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${p(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?h`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Yn(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===Ge?"No days picked":qn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${a.length?h`<p class="field-hint bad">${a.map(Xn).join(". ")}. Saving fixes it.</p>`:w}
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
          ${xo.map(x=>p(e.icon===x,x,()=>this.changeDraft({icon:e.icon===x?null:x}),`Picture ${x}`))}
          ${e.icon&&!xo.includes(e.icon)?p(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):w}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?h`<emoji-picker
              class="emoji-more"
              .dataSource=${Ya}
              @emoji-click=${x=>{let y=x.detail.unicode;y&&this.changeDraft({icon:y}),this.iconMore=!1}}
            ></emoji-picker>`:w}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((x,y)=>{let k=i?.get(x.id)??te(y),u=e.who.includes(x.id);return h`<button type="button" class="who-chip" style="--c:${k.color};--rgb:${k.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${r} @click=${()=>v(x.id)}>
              <span class="avatar" aria-hidden="true">${Ce(x.name)}</span>${x.name}
            </button>`})}
        </div>
        ${e.who.length>1?h`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${l(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${l(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:w}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${l(e.repeats==="daily","Every day",()=>g("daily"))}
          ${l(e.repeats==="weekly","Every week",()=>g("weekly"))}
          ${l(e.repeats==="monthly","Every month",()=>g("monthly"))}
          ${l(e.repeats==="school","School days",()=>g("school"))}
        </div>
      </div>
      ${E}
      ${e.repeats==="school"?w:h`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Ja(e.repeats,e.every)}</span>
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
      ${e.template?h`<div class="field">
              ${l(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return h``;let o=e.busy,i=l=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...l})},r=l=>i({kids:e.kids.includes(l)?e.kids.filter(p=>p!==l):[...e.kids,l]}),d=n.kids.filter(l=>kt(l,e.date)),c=e.dish.trim(),a=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${xe(e.date)}</span>
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
          @input=${l=>i({dish:l.target.value})}
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
          @input=${l=>i({details:l.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${d.map(l=>{let p=this.kidColorOf(l.id),g=e.kids.includes(l.id);return h`<button type="button" class="who-chip" style="--c:${p.color};--rgb:${p.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${o} @click=${()=>r(l.id)}>
              <span class="avatar" aria-hidden="true">${Ce(l.name)}</span>${l.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?h`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!a} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":a??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return h``;let o=n.people?.length?n.people:n.kids.map(p=>({...p,role:"kid"})),i=n.kids.findIndex(p=>p.id===e.kid),r=n.kids[i],d=this.plan?ce(this.plan):void 0,c=d?.get(e.kid)??te(Math.max(0,i)),a=o.filter(p=>p.id!==e.kid),l=p=>{let g=n.kids.findIndex(v=>v.id===p.id);return g>=0?(d?.get(p.id)??te(g)).color:"var(--dark)"};return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?h`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Hn(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Ce(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?h`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${a.map(p=>h`<button type="button" class="done-by" style="--c:${l(p)}" @click=${()=>void this.toggleChore(e,p.id)}>
                  <span class="avatar ${p.role==="parent"?"driver":""}" aria-hidden="true">${Ce(p.name)}</span>
                  <span>${p.name}</span>
                </button>`)}
            </div>`:h`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return h`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let o=Jt(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${M(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${M(n.start)} to ${M(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>ue(e).includes(r)?le(e,r):ae(e,r));return`${o} drives there and back${i.length?`, with ${Qt(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return h``;let{day:o,event:i}=n,r=ue(e),d=pi(e,i),c=Jt(e,i),a=!!this.pending,l=L=>this.pending?.key===L?this.pending.value:void 0,p=[...e.people?.carpools??[]];for(let L of e.days)for(let H of L.events)for(let U of[H.drop,H.pick])U&&U!=="none"&&!r.includes(U)&&!p.some(X=>X.toLowerCase()===U.toLowerCase())&&p.push(U);let g=L=>{if(!i.sides.includes(L))return w;let H=l(L),U=H!==void 0?String(H):L==="drop"?i.drop:i.pick,X=U&&U!=="none"&&!r.includes(U)?U:"",me=I=>this.setRide(i,L,U===I?"":I),be=[...r.map(I=>[I,In(e,I)]),["none","Not needed"]];return h`<div class="field">
        <span class="field-label">${L==="drop"?"Drop-off":"Pick-up"} ${U===""?h`<span class="nobody">· nobody yet</span>`:w}</span>
        <div role="group" aria-label=${L==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${be.length}, minmax(0, 1fr))">
          ${be.map(([I,f])=>h`<button type="button" class="choice" aria-pressed=${U===I?"true":"false"} ?disabled=${a} @click=${()=>me(I)}>
                ${f}
              </button>`)}
        </div>
        ${p.length?h`<div role="group" aria-label=${L==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${p.map(I=>h`<button type="button" class="chip" aria-pressed=${U.toLowerCase()===I.toLowerCase()?"true":"false"} ?disabled=${a} @click=${()=>me(I)}>
                    ${I}
                  </button>`)}
            </div>`:w}
        <input
          type="text"
          .value=${X&&!p.some(I=>I.toLowerCase()===X.toLowerCase())?X:""}
          ?disabled=${a}
          aria-label=${L==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${I=>{let f=I.target.value.trim();f&&f!==U&&this.setRide(i,L,f)}}
          @keydown=${I=>{I.key==="Enter"&&I.target.blur()}}
        />
        ${!x&&U!==""&&U!=="none"?v(L,U):w}
      </div>`},v=(L,H)=>{let U=l(`along-${L}`),X=U!==void 0?U:L==="pick"?i.pick_along??[]:i.along,me=[...$e(e).filter(I=>I!==i.kid),...r.filter(I=>I!==H)];return me.length?h`<div class="field-sub">
        <span class="field-label">${L==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${L==="pick"?"They come for the pick-up":"They leave home in the same car"}</span></span>
        <div role="group" aria-label=${L==="drop"?"Riding along on the drop-off":L==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${me.map(I=>h`<button type="button" class="chip" aria-pressed=${X.includes(I)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,I,L)}>
              ${r.includes(I)?le(e,I):ae(e,I)}
            </button>`)}
        </div>
      </div>`:w},E=l("stay"),x=E!==void 0?!!E:i.stay,y=i.drop===i.pick&&r.includes(i.drop),k=l("along"),u=k!==void 0?k:i.along,_=i.own?[...$e(e),...r.filter(L=>L!==i.own)]:[],z=i.own!=null&&i.takes!=null,G=i.own!=null&&!z,ne=l("takes"),q=ne!==void 0?ne:i.takes??null,W=l("arrive"),pe=this.arriveDraft!==void 0?this.arriveDraft:W!==void 0?W:i.arrive_by,Q=[],fe=L=>L==="none"?"Not needed":In(e,L),Re=L=>r.includes(L)?le(e,L):ae(e,L),ge=(L,H,U)=>{H===""&&!U.length||Q.push(`${L}: ${[H===""?"TBD":fe(H),...U.map(Re)].join(", ")}`)};i.own||ge("Drop-off",i.drop,i.along),i.own||ge("Pick-up",i.pick,i.pick_along??[]),!i.own&&i.stay&&Q.push("Stay: yes"),z&&Q.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&Q.push(`Take along: ${i.along.map(Re).join(", ")}`),i.arrive_by!=null&&Q.push(`Arrive by: ${He(i.arrive_by)}`);let Te=l("attending"),_e=Te!==void 0?!!Te:i.attending!==!1;i.attending===!1&&Q.splice(0,Q.length,"Attending: no");let Je=o.date===this.today().date?"":`${re(o.date)} · `,Le=h`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${d.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${Je}${z?"any time ":""}${M(i.start)}–${M(i.end)}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return i.where==="home"?h`${Le}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:h`
      ${Le}
      ${this.pending?h`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
      ${i.recurring?h`<div class="field">
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
      <div class="field">
        <span class="field-label">${c} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${_e?"true":"false"} ?disabled=${a} @click=${()=>this.setAttending(i,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${_e?"false":"true"} ?disabled=${a} @click=${()=>this.setAttending(i,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${_e?h`${i.where==="anywhere"?h`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:w}
            ${i.own?h`<p class="field-hint">${this.ownHint(e,i)}</p>`:h`${g("drop")} ${g("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${x?"true":"false"} ?disabled=${!y||a} @click=${()=>this.toggleStay(i)}>
                      ${y?x?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                    ${x&&y?v("both",i.drop):w}
                  </div>`}
      ${i.own?h`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${q!=null?`Takes ${q} min, any time ${M(i.start)}–${M(i.end)}`:"At its set time"}</span>
            </span>
            ${q!=null?h`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${a||q<=5} @click=${()=>this.setTakes(i,Math.max(5,q-5))}>−</button>
                  <span class="arrive-value">${q} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${a||q+5>i.end-i.start} @click=${()=>this.setTakes(i,q+5)}>+</button>
                </span>`:w}
          </div>
          <button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.setTakes(i,q!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${q!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:w}
      ${G&&_.length?h`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${_.map(L=>h`<button type="button" class="chip" aria-pressed=${u.includes(L)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,L)}>
                  ${r.includes(L)?le(e,L):ae(e,L)}
                </button>`)}
            </div>
          </div>`:w}
      ${z?w:h`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${pe!=null?`${i.start-pe} min before it starts`:`Aims for a few minutes before ${M(i.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${a} @click=${()=>this.nudgeArrive(i,-5)}>−</button>
          <span class="arrive-value">${pe!=null?M(pe):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${a||pe==null} @click=${()=>this.nudgeArrive(i,5)}>+</button>
        </span>
      </div>
      ${pe!=null?h`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:w}`}
`:h`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${Q.length?Q.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${i.problems.length?h`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:w}
      ${_e&&!i.own?h`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:w}
    `}};_t.styles=zi,_t.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",_t);var St=class extends he{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=Ks(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(mt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new Ht(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return h`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?h`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:w}`}};St.styles=ze`
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
  `,St.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",St);
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
