var yo=Object.defineProperty;var gn=(s,t)=>()=>(s&&(t=s(s=0)),t);var wo=(s,t)=>{for(var e in t)yo(s,e,{get:t[e],enumerable:!0})};function tn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function Zn(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function mr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Ri(s){return mr(s,t=>t.unicode)}function br(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[l,d]]of Object.entries(o))i.createIndex(r,l,{multiEntry:d});return i}t(it),t(Ge,cr,{[Ii]:[dr,!0],[Oi]:[[pr,hr]],[Ni]:[ur,!0]}),t(ts,void 0,{[Bi]:[""]})}function Ui(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function vr(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,ar);Qn[s]=o,o.onupgradeneeded=i=>{i.oldVersion<lr&&br(o.result)},Ui(e,n,o)});return t.onclose=()=>ss(s),t}function xr(s){return sn[s]||(sn[s]=vr(s)),sn[s]}function Me(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),l=typeof t=="string"?r.objectStore(t):t.map(a=>r.objectStore(a)),d;n(l,r,a=>{d=a}),r.oncomplete=()=>o(d),r.onerror=()=>i(r.error)})}function ss(s){let t=Qn[s],e=t&&t.result;if(e){e.close();let n=rn[s];if(n)for(let o of n)o()}delete Qn[s],delete sn[s],delete rn[s]}function yr(s){return new Promise((t,e)=>{ss(s);let n=indexedDB.deleteDatabase(s);Ui(t,e,n)})}function wr(s,t){let e=rn[s];e||(e=rn[s]=[]),e.push(t)}function st(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||$r.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Hi(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=kr)}function Er(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:l,tags:d,emoji:a,version:c})=>{let p=[...new Set(Hi([...(r||[]).map(st).flat(),...(d||[]).map(st).flat(),...st(e),n]))].sort(),m={annotation:e,group:o,order:i,tags:d,tokens:p,unicode:a,version:c};if(n&&(m.emoticon=n),r&&(m.shortcodes=r),l){m.skinTones=[],m.skinUnicodes=[],m.skinVersions=[];for(let{tone:b,emoji:E,version:f}of l)m.skinTones.push(b),m.skinUnicodes.push(E),m.skinVersions.push(f)}return m})}function Fi(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function Ve(s,t,e){Fi(s,"get",t,e)}function Wi(s,t,e){Fi(s,"getAll",t,e)}function is(s){s.commit&&s.commit()}function Tr(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function Ki(s,t){let e=Tr(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Cr(s){return!await os(s,it,on)}async function _r(s,t,e){let[n,o]=await Promise.all([Jn,on].map(i=>os(s,it,i)));return n===e&&o===t}async function Sr(s,t){return Me(s,Ge,rt,(n,o,i)=>{let r,l=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=d=>{let a=d.target.result;for(let c of a)if(r=c.unicode,t(c))return i(c);if(a.length<50)return i();l()}};l()})}async function Vi(s,t,e,n){try{let o=Er(t);await Me(s,[Ge,it],ns,([i,r],l)=>{let d,a,c=0;function p(){++c===2&&m()}function m(){if(!(d===n&&a===e)){i.clear();for(let b of o)i.put(b);r.put(n,Jn),r.put(e,on),is(l)}}Ve(r,Jn,b=>{d=b,p()}),Ve(r,on,b=>{a=b,p()})})}finally{}}async function Ar(s,t){return Me(s,Ge,rt,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Wi(e.index(Oi),i,o)})}async function Gi(s,t){let e=Hi(st(t));return e.length?Me(s,Ge,rt,(n,o,i)=>{let r=[],l=()=>{r.length===e.length&&d()},d=()=>{let a=Ki(r,c=>c.unicode);i(a.sort((c,p)=>c.order<p.order?-1:1))};for(let a=0;a<e.length;a++){let c=e[a],p=a===e.length-1?IDBKeyRange.bound(c,c+"￿",!1,!0):IDBKeyRange.only(c);Wi(n.index(Ii),p,m=>{r.push(m),l()})}}):[]}async function Pr(s,t){let e=await Gi(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Sr(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Mr(s,t){return Me(s,Ge,rt,(e,n,o)=>Ve(e,t,i=>{if(i)return o(i);Ve(e.index(Ni),t,r=>o(r||null))}))}function os(s,t,e){return Me(s,t,rt,(n,o,i)=>Ve(n,e,i))}function Dr(s,t,e,n){return Me(s,t,ns,(o,i)=>{o.put(n,e),is(i)})}function Lr(s,t){return Me(s,ts,ns,(e,n)=>Ve(e,t,o=>{e.put((o||0)+1,t),is(n)}))}function jr(s,t,e){return e===0?[]:Me(s,[ts,Ge],rt,([n,o],i,r)=>{let l=[];n.index(Bi).openCursor(void 0,"prev").onsuccess=d=>{let a=d.target.result;if(!a)return r(l);function c(b){if(l.push(b),l.length===e)return r(l);a.continue()}let p=a.primaryKey,m=t.byName(p);if(m)return c(m);Ve(o,p,b=>{if(b)return c(b);a.continue()})}})}function Rr(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let l=e;for(let a=0;a<r.length;a++){let c=r.charAt(a),p=l.get(c);p||(p=new Map,l.set(c,p)),l=p}let d=l.get(nn);d||(d=[],l.set(nn,d)),d.push(o)}}return(o,i)=>{let r=e;for(let a=0;a<o.length;a++){let c=o.charAt(a),p=r.get(c);if(p)r=p;else return[]}if(i)return r.get(nn)||[];let l=[],d=[r];for(;d.length;){let c=[...d.shift().entries()].sort((p,m)=>p[0]<m[0]?-1:1);for(let[p,m]of c)p===nn?l.push(...m):d.push(m)}return l}}function Ir(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||zr.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function zi(s){Ir(s);let t=(m,b)=>m.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=s.sort(t),o=Rr(s,m=>{let b=new Set;if(m.shortcodes)for(let E of m.shortcodes)for(let f of st(E))b.add(f);return b}),i=m=>o(m,!0),r=m=>o(m,!1),l=m=>{let b=st(m),E=b.map((f,x)=>(x<b.length-1?i:r)(f));return Ki(E,f=>f.name).sort(t)},d=new Map,a=new Map;for(let m of s){a.set(m.name.toLowerCase(),m);for(let b of m.shortcodes||[])d.set(b.toLowerCase(),m)}return{all:e,search:l,byShortcode:m=>d.get(m.toLowerCase()),byName:m=>a.get(m.toLowerCase())}}function yt(s){if(!s)return s;if(Br&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function qi(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Nr(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Or.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function Yi(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function Ur(s){let t=await fetch(s,{method:"HEAD"});Yi(t,s);let e=t.headers.get("etag");return qi(e),e}async function es(s){let t=await fetch(s);Yi(t,s);let e=t.headers.get("etag");qi(e);let n=await t.json();return Nr(n),[e,n]}function Hr(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Fr(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function Xi(s){let t=JSON.stringify(s),e=Fr(t),n=await crypto.subtle.digest("SHA-1",e),o=Hr(n);return btoa(o)}async function Wr(s,t){let e,n=await Ur(t);if(!n){let o=await es(t);n=o[0],e=o[1],n||(n=await Xi(e))}await _r(s,t,n)||(e||(e=(await es(t))[1]),await Vi(s,e,t,n))}async function Kr(s,t){let[e,n]=await es(t);e||(e=await Xi(n)),await Vi(s,n,t,e)}async function Vr(s,t){try{await Wr(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var ar,lr,Ge,it,ts,dr,Ii,cr,Bi,pr,hr,Oi,Jn,on,ji,rt,ns,Ni,ur,gr,fr,Qn,sn,rn,$r,kr,nn,zr,Br,Or,ot,rs=gn(()=>{ar=1,lr=1,Ge="emoji",it="keyvalue",ts="favorites",dr="tokens",Ii="tokens",cr="unicode",Bi="count",pr="group",hr="order",Oi="group-order",Jn="eTag",on="url",ji="skinTone",rt="readonly",ns="readwrite",Ni="skinUnicodes",ur="skinUnicodes",gr="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",fr="en";Qn={},sn={},rn={};$r=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);kr=2;nn="";zr=["name","url"];Br=typeof wrappedJSObject<"u";Or=["annotation","emoji","group","order","version"];ot=class{constructor({dataSource:t=gr,locale:e=fr,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=zi(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await xr(this._dbName);wr(this._dbName,this._clear);let e=this.dataSource;await Cr(t)?await Kr(t,e):this._lazyUpdate=Vr(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Zn(t),await this.ready(),Ri(await Ar(this._db,t)).map(yt)}async getEmojiBySearchQuery(t){tn(t),await this.ready();let e=this._custom.search(t),n=Ri(await Gi(this._db,t)).map(yt);return[...e,...n]}async getEmojiByShortcode(t){tn(t),await this.ready();let e=this._custom.byShortcode(t);return e||yt(await Pr(this._db,t))}async getEmojiByUnicodeOrName(t){tn(t),await this.ready();let e=this._custom.byName(t);return e||yt(await Mr(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await os(this._db,it,ji)||0}async setPreferredSkinTone(t){return Zn(t),await this.ready(),Dr(this._db,it,ji,t)}async incrementFavoriteEmojiCount(t){return tn(t),await this.ready(),Lr(this._db,t)}async getTopFavoriteEmoji(t){return Zn(t),await this.ready(),(await jr(this._db,this._custom,t)).map(yt)}set customEmoji(t){this._custom=zi(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await ss(this._dbName)}async delete(){await this._shutdown(),await yr(this._dbName)}}});function Ji(s){return s.unicode.includes("‍")}function ta(s){let t=Qi(s,"#000"),e=Qi(s,"#fff");return t&&e&&ea(t,e)}function na(){let s=Object.entries(qr);try{for(let[t,e]of s)if(ta(t))return e}catch{}finally{}return s[0][1]}function la(s,t){if(t===0)return s;let e=s.indexOf(oa);return e!==-1?s.substring(0,e)+String.fromCodePoint(ra+t-1)+s.substring(e):(s.endsWith(sa)&&(s=s.substring(0,s.length-1)),s+ia+String.fromCodePoint(aa+t-1))}function ve(s){s.preventDefault(),s.stopPropagation()}function cs(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function lo(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function da(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:l,category:d,annotation:a})=>({unicode:n,name:l,shortcodes:i,url:r,category:d,annotation:a,id:n||l,skins:o&&e(o)}))}function pa(s,t,e){let n;ca?(n=new ResizeObserver(e),n.observe(s)):ln(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function eo(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function to(s,t,e){let n=eo(t);if(!n){if(!qe){qe=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])qe.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(qe),qe.firstChild.nodeValue=s,eo(qe)}finally{qe.remove()}}return n}function ua(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof ps>"u"&&(ps=to(ha,t,t));let l=to(o.unicode,i,t)/1.8<ps;fs.set(o.unicode,l),l||(n=!1)}return n}function ga(s){return lo(s,t=>t)}function fa(s){s&&(s.scrollTop=0)}function wt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function no(s){return""+s}function ma(s){let t=document.createElement("template");return t.innerHTML=s,t}function wa(s,t){ya?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function $a(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function ka(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=$a(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&wa(n,s)}function Ea(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:l,attributeValuePost:d}}=e,a=s[i];if(o!==a)if(e.currentExpression=a,r)if(a===null)n.removeAttribute(r);else{let c=l+no(a)+d;n.setAttribute(r,c)}else{let c;Array.isArray(a)?ka(a,e):a instanceof Element?(c=a,n.replaceWith(c)):n.nodeValue=no(a),c&&(e.targetNode=c)}}}function Ta(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],l=0;for(let a=0,c=s.length;a<c;a++){let p=s[a];if(t+=p.slice(l),a===c-1)break;for(let v=0;v<p.length;v++)switch(p.charAt(v)){case"<":{p.charAt(v+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let m=r[r.length-1],b=wt(i,m,()=>[]),E,f,x;if(n){let v=/(\S+)="?([^"=]*)$/.exec(p);E=v[1],f=v[2];let P=/^([^">]*)("?)/.exec(s[a+1]);x=P[1],t=t.slice(0,-1*v[0].length),l=P[0].length}else l=0;let $={attributeName:E,attributeValuePre:f,attributeValuePost:x,expressionIndex:a};b.push($),!e&&!n&&(t+=" ")}return{template:ma(t),elementsToBindings:i}}function so(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Ca(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))so(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let l=t.get(++r);l&&so(l,i,e)}while(i=o.nextNode())}return e}function _a(s){let{template:t,elementsToBindings:e}=wt(ba,s,()=>Ta(s)),n=t.cloneNode(!0).content.firstElementChild,o=Ca(n,e);return function(r){return Ea(r,o),n}}function Sa(s){let t=wt(va,s,()=>new Map),e=xa;function n(i,...r){let l=wt(t,i,()=>new Map);return wt(l,e,()=>_a(i))(r)}function o(i,r,l){return i.map((d,a)=>{let c=e;e=l(d);try{return r(d,a)}finally{e=c}})}return{map:o,html:n}}function Aa(s,t,e,n,o,i,r,l,d){let{labelWithSkin:a,titleForEmoji:c,unicodeWithSkin:p}=e,{html:m,map:b}=Sa(t);function E(v,P,U){return b(v,(z,ne)=>m`<button role="${P?"option":"menuitem"}" aria-selected="${P?ne===t.activeSearchItem:null}" aria-label="${a(z,t.currentSkinTone)}" title="${c(z)}" class="${"emoji"+(P&&ne===t.activeSearchItem?" active":"")+(z.unicode?"":" custom-emoji")}" id="${`${U}-${z.id}`}" style="${z.unicode?null:`--custom-emoji-background: url(${JSON.stringify(z.url)})`}">${z.unicode?p(z,t.currentSkinTone):""}</button>`,z=>`${U}-${z.id}`)}let x=m`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(v,P)=>m`<div id="skintone-${P}" class="emoji ${P===t.activeSkinTone?"active":""}" aria-selected="${P===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[P]}" aria-label="${t.i18n.skinTones[P]}">${v}</div>`,v=>v)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,v=>m`<button role="tab" class="nav-button" aria-controls="tab-${v.id}" aria-label="${t.i18n.categories[v.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===v.id}" title="${t.i18n.categories[v.name]}" data-group-id="${v.id}"><div class="nav-emoji emoji">${v.emoji}</div></button>`,v=>v.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(v,P)=>m`<div><div id="menu-label-${P}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:v.category?v.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${P!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(v.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${P}" id="${t.searchMode?"search-results":null}">${E(v.emojis,t.searchMode,"emo")}</div></div>`,v=>v.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${E(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,$=(v,P)=>{for(let U of s.querySelectorAll(`[${v}]`))P(U,U.getAttribute(v))};if(d){s.appendChild(x);for(let v of["click","focusout","input","keydown","keyup"])$(`data-on-${v}`,(P,U)=>{P.addEventListener(v,n[U])});$("data-ref",(v,P)=>{i[P]=v}),r.addEventListener("abort",()=>{s.removeChild(x)})}$("data-action",(v,P)=>{let U=l.get(P);U||l.set(P,U=new WeakSet),U.has(v)||(U.add(v),o[P](v))})}function Pa(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let a=[...o];o.clear();try{for(let c of a)c()}finally{i=!1,o.size&&(i=!0,dn(r))}},l=new Proxy({},{get(a,c){if(e){let p=n.get(c);p||(p=new Set,n.set(c,p)),p.add(e)}return a[c]},set(a,c,p){if(a[c]!==p){a[c]=p;let m=n.get(c);if(m){for(let b of m)o.add(b);i||(i=!0,dn(r))}}return!0}}),d=a=>{let c=()=>{let p=e;e=c;try{return a()}finally{e=p}};return c()};return s.addEventListener("abort",()=>{t=!0}),{state:l,createEffect:d}}function hs(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Ma(s,t,e){{let n=s.closest(".tabpanel"),o=io.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),io.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function Da(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=Pa(o),l=new Map;an(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),an(i,t),an(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Zr,isRtl:!1,currentGroupIndex:0,groups:as,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let d=h=>{s.getElementById(h).focus()},a=h=>s.getElementById(`emo-${h.id}`),c=(h,y)=>{e.rootElement.dispatchEvent(new CustomEvent(h,{detail:y,bubbles:!0,composed:!0}))},p=(h,y)=>h.id===y.id,m=(h,y)=>{let{category:S,emojis:D}=h,{category:B,emojis:K}=y;return S!==B?!1:hs(D,K,p)},b=h=>{hs(i.currentEmojis,h,p)||(i.currentEmojis=h)},E=h=>{i.searchMode!==h&&(i.searchMode=h)},f=h=>{hs(i.currentEmojisWithCategories,h,m)||(i.currentEmojisWithCategories=h)},x=(h,y)=>y&&h.skins&&h.skins[y]||h.unicode,P={labelWithSkin:(h,y)=>ga([h.name||x(h,y),h.annotation,...h.shortcodes||us].filter(Boolean)).join(", "),titleForEmoji:h=>h.annotation||(h.shortcodes||us).join(", "),unicodeWithSkin:x},U={onClickSkinToneButton:C,onEmojiClick:he,onNavClick:A,onNavKeydown:q,onSearchKeydown:Ee,onSkinToneOptionsClick:u,onSkinToneOptionsFocusOut:R,onSkinToneOptionsKeydown:M,onSkinToneOptionsKeyup:_,onSearchInput:H},z={calculateEmojiGridStyle:ye,updateOnIntersection:pe},ne=!0;r(()=>{Aa(s,i,P,U,z,e,o,l,ne),ne=!1}),i.emojiVersion||ds().then(h=>{h||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function h(){let y=!1,S=setTimeout(()=>{y=!0,i.message=i.i18n.loadingMessage},Yr);try{await i.database.ready(),i.databaseLoaded=!0}catch(D){console.error(D),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(S),y&&(y=!1,i.message="")}}i.database&&h()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${Zi};`}),r(()=>{i.customEmoji&&i.database&&Z()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==gs&&(i.groups=gs):i.groups!==as&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=as)}),r(()=>{async function h(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}h()}),r(()=>{i.skinTones=Array(Zi).fill().map((h,y)=>la(i.skinToneEmoji,y))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function h(){let{database:y}=i,S=(await Promise.all(Jr.map(D=>y.getEmojiByUnicodeOrName(D)))).filter(Boolean);i.defaultFavoriteEmojis=S}i.databaseLoaded&&h()});function Z(){let{customEmoji:h,database:y}=i,S=h||us;y.customEmoji!==S&&(y.customEmoji=S)}r(()=>{async function h(){Z();let{database:y,defaultFavoriteEmojis:S,numColumns:D}=i,B=await y.getTopFavoriteEmoji(D),K=await $e(lo([...B,...S],V=>V.unicode||V.name).slice(0,D));i.currentFavorites=K}i.databaseLoaded&&i.defaultFavoriteEmojis&&h()});function ye(h){pa(h,o,()=>{{let y=getComputedStyle(e.rootElement),S=parseInt(y.getPropertyValue("--num-columns"),10),D=y.getPropertyValue("direction")==="rtl";i.numColumns=S,i.isRtl=D}})}function pe(h){Ma(h,o,y=>{for(let{target:S,isIntersecting:D}of y)S.classList.toggle("onscreen",D)})}r(()=>{async function h(){let{searchText:y,currentGroup:S,databaseLoaded:D,customEmoji:B}=i;if(!D)i.currentEmojis=[],i.searchMode=!1;else if(y.length>=Gr){let K=await je(y);i.searchText===y&&(b(K),E(!0))}else{let{id:K}=S;if(K!==-1||B&&B.length){let V=await ke(K);i.currentGroup.id===K&&(b(V),E(!1))}}}h()});let J=()=>{ln(()=>fa(e.tabpanelElement))};r(()=>{let{currentEmojis:h,emojiVersion:y}=i,S=h.filter(D=>D.unicode).filter(D=>Ji(D)&&!fs.has(D.unicode));if(!y&&S.length)b(h),ln(()=>Xe(S));else{let D=y?h:h.filter(we);b(D),J()}});function Xe(h){ua(h,e.baselineEmoji,a)?J():i.currentEmojis=[...i.currentEmojis]}function we(h){return!h.unicode||!Ji(h)||fs.get(h.unicode)}async function De(h){let y=i.emojiVersion||await ds();return h.filter(({version:S})=>!S||S<=y)}async function $e(h){return da(h,i.emojiVersion||await ds())}async function ke(h){let y=h===-1?i.customEmoji:await i.database.getEmojiByGroup(h);return $e(await De(y))}async function je(h){return $e(await De(await i.database.getEmojiBySearchQuery(h)))}r(()=>{}),r(()=>{function h(){let{searchMode:S,currentEmojis:D}=i;if(S)return[{category:"",emojis:D}];let B=new Map;for(let K of D){let V=K.category||"",T=B.get(V);T||(T=[],B.set(V,T)),T.push(K)}return[...B.entries()].map(([K,V])=>({category:K,emojis:V})).sort((K,V)=>i.customCategorySorting(K.category,V.category))}let y=h();f(y)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:h}=i;ro(()=>{i.searchText=(h||"").trim(),i.activeSearchItem=-1})});function Ee(h){if(!i.searchMode||!i.currentEmojis.length)return;let y=S=>{ve(h),i.activeSearchItem=cs(S,i.activeSearchItem,i.currentEmojis)};switch(h.key){case"ArrowDown":return y(!1);case"ArrowUp":return y(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return ve(h),oe(i.currentEmojis[i.activeSearchItem].id)}}function A(h){let{target:y}=h,S=y.closest(".nav-button");if(!S)return;let D=parseInt(S.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(B=>B.id===D)}function q(h){let{target:y,key:S}=h,D=B=>{B&&(ve(h),B.focus())};switch(S){case"ArrowLeft":return D(y.previousElementSibling);case"ArrowRight":return D(y.nextElementSibling);case"Home":return D(y.parentElement.firstElementChild);case"End":return D(y.parentElement.lastElementChild)}}async function I(h){let y=await i.database.getEmojiByUnicodeOrName(h),S=[...i.currentEmojis,...i.currentFavorites].find(B=>B.id===h),D=S.unicode&&x(S,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(h),{emoji:y,skinTone:i.currentSkinTone,...D&&{unicode:D},...S.name&&{name:S.name}}}async function oe(h){let y=I(h);c("emoji-click-sync",y),c("emoji-click",await y)}function he(h){let{target:y}=h;if(!y.classList.contains("emoji"))return;ve(h);let S=y.id.substring(4);oe(S)}function re(h){i.currentSkinTone=h,i.skinTonePickerExpanded=!1,d("skintone-button"),c("skin-tone-change",{skinTone:h}),i.database.setPreferredSkinTone(h)}function u(h){let{target:{id:y}}=h,S=y&&y.match(/^skintone-(\d)/);if(!S)return;ve(h);let D=parseInt(S[1],10);re(D)}function C(h){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(ve(h),ln(()=>d("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function M(h){if(!i.skinTonePickerExpanded)return;let y=async S=>{ve(h),i.activeSkinTone=S};switch(h.key){case"ArrowUp":return y(cs(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return y(cs(!1,i.activeSkinTone,i.skinTones));case"Home":return y(0);case"End":return y(i.skinTones.length-1);case"Enter":return ve(h),re(i.activeSkinTone);case"Escape":return ve(h),i.skinTonePickerExpanded=!1,d("skintone-button")}}function _(h){if(i.skinTonePickerExpanded)switch(h.key){case" ":return ve(h),re(i.activeSkinTone)}}async function R(h){let{relatedTarget:y}=h;(!y||y.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function H(h){i.rawSearchText=h.target.value}return{$set(h){an(i,h)},$destroy(){n.abort()}}}function oo(s){s instanceof Ye||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var gs,as,Gr,Zi,ro,qr,Yr,Xr,Zr,Jr,ao,Qr,Qi,ea,ls,ds,fs,sa,ia,oa,ra,aa,ln,ca,ha,ps,qe,ba,va,xa,ya,dn,io,us,an,La,ja,Ra,za,co,Ia,Ye,po,ho=gn(()=>{rs();gs=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),as=gs.slice(1),Gr=2,Zi=6,ro=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;qr={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Yr=1e3,Xr="🖐️",Zr=8,Jr=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],ao='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Qr=(s,t)=>s<t?-1:s>t?1:0,Qi=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${ao}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},ea=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ds=()=>(ls||(ls=new Promise(s=>ro(()=>s(na())))),ls),fs=new Map,sa="️",ia="\uD83C",oa="‍",ra=127995,aa=57339;ln=requestAnimationFrame,ca=typeof ResizeObserver=="function";ha="😀";ba=new WeakMap,va=new WeakMap,xa=Symbol("un-keyed"),ya="replaceChildren"in Element.prototype;dn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);io=new WeakMap;us=[],{assign:an}=Object;La="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",ja="en",Ra={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},za=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',co=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Ia=`:host{--emoji-font-family:${ao}}`,Ye=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=za+Ia,this.shadowRoot.appendChild(e),this._ctx={locale:ja,dataSource:La,skinToneEmoji:Xr,customCategorySorting:Qr,customEmoji:null,i18n:Ra,emojiVersion:null,...t};for(let n of co)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){oo(this),this._cmp||(this._cmp=Da(this.shadowRoot,this._ctx))}disconnectedCallback(){oo(this),dn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new ot({locale:t,dataSource:e}))}_dbFlush(){dn(()=>this._dbCreate())}},po={};for(let s of co)po[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(Ye.prototype,po);customElements.get("emoji-picker")||customElements.define("emoji-picker",Ye)});var uo={};wo(uo,{Database:()=>ot,Picker:()=>Ye});var go=gn(()=>{ho();rs()});var _t=globalThis,St=_t.ShadowRoot&&(_t.ShadyCSS===void 0||_t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fn=Symbol(),ks=new WeakMap,lt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==fn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(St&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=ks.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ks.set(e,t))}return t}toString(){return this.cssText}},Es=s=>new lt(typeof s=="string"?s:s+"",void 0,fn),Re=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new lt(e,s,fn)},Ts=(s,t)=>{if(St)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=_t.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},mn=St?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Es(e)})(s):s;var{is:$o,defineProperty:ko,getOwnPropertyDescriptor:Eo,getOwnPropertyNames:To,getOwnPropertySymbols:Co,getPrototypeOf:_o}=Object,At=globalThis,Cs=At.trustedTypes,So=Cs?Cs.emptyScript:"",Ao=At.reactiveElementPolyfillSupport,dt=(s,t)=>s,bn={toAttribute(s,t){switch(t){case Boolean:s=s?So:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ss=(s,t)=>!$o(s,t),_s={attribute:!0,type:String,converter:bn,reflect:!1,useDefault:!1,hasChanged:Ss};Symbol.metadata??=Symbol("metadata"),At.litPropertyMetadata??=new WeakMap;var Te=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_s){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&ko(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=Eo(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let l=o?.call(this);i?.call(this,r),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_s}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;let t=_o(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){let e=this.properties,n=[...To(e),...Co(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(mn(o))}else t!==void 0&&e.push(mn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ts(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:bn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:bn;this._$Em=o;let l=r.fromAttribute(e,i.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Ss)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,l=this[o];r!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,i,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Te.elementStyles=[],Te.shadowRootOptions={mode:"open"},Te[dt("elementProperties")]=new Map,Te[dt("finalized")]=new Map,Ao?.({ReactiveElement:Te}),(At.reactiveElementVersions??=[]).push("2.1.2");var xn=globalThis,As=s=>s,Pt=xn.trustedTypes,Ps=Pt?Pt.createPolicy("lit-html",{createHTML:s=>s}):void 0,yn="$lit$",Ce=`lit$${Math.random().toFixed(9).slice(2)}$`,wn="?"+Ce,Po=`<${wn}>`,Be=document,pt=()=>Be.createComment(""),ht=s=>s===null||typeof s!="object"&&typeof s!="function",$n=Array.isArray,zs=s=>$n(s)||typeof s?.[Symbol.iterator]=="function",vn=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ms=/-->/g,Ds=/>/g,ze=RegExp(`>|${vn}(?:([^\\s"'>=/]+)(${vn}*=${vn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ls=/'/g,js=/"/g,Is=/^(?:script|style|textarea|title)$/i,kn=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),g=kn(1),ee=kn(2),sl=kn(3),_e=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),Rs=new WeakMap,Ie=Be.createTreeWalker(Be,129);function Bs(s,t){if(!$n(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ps!==void 0?Ps.createHTML(t):t}var Os=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=ct;for(let l=0;l<e;l++){let d=s[l],a,c,p=-1,m=0;for(;m<d.length&&(r.lastIndex=m,c=r.exec(d),c!==null);)m=r.lastIndex,r===ct?c[1]==="!--"?r=Ms:c[1]!==void 0?r=Ds:c[2]!==void 0?(Is.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=ze):c[3]!==void 0&&(r=ze):r===ze?c[0]===">"?(r=o??ct,p=-1):c[1]===void 0?p=-2:(p=r.lastIndex-c[2].length,a=c[1],r=c[3]===void 0?ze:c[3]==='"'?js:Ls):r===js||r===Ls?r=ze:r===Ms||r===Ds?r=ct:(r=ze,o=void 0);let b=r===ze&&s[l+1].startsWith("/>")?" ":"";i+=r===ct?d+Po:p>=0?(n.push(a),d.slice(0,p)+yn+d.slice(p)+Ce+b):d+Ce+(p===-2?l:b)}return[Bs(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},ut=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,l=t.length-1,d=this.parts,[a,c]=Os(t,e);if(this.el=s.createElement(a,n),Ie.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(o=Ie.nextNode())!==null&&d.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let p of o.getAttributeNames())if(p.endsWith(yn)){let m=c[r++],b=o.getAttribute(p).split(Ce),E=/([.?@])?(.*)/.exec(m);d.push({type:1,index:i,name:E[2],strings:b,ctor:E[1]==="."?Dt:E[1]==="?"?Lt:E[1]==="@"?jt:Ne}),o.removeAttribute(p)}else p.startsWith(Ce)&&(d.push({type:6,index:i}),o.removeAttribute(p));if(Is.test(o.tagName)){let p=o.textContent.split(Ce),m=p.length-1;if(m>0){o.textContent=Pt?Pt.emptyScript:"";for(let b=0;b<m;b++)o.append(p[b],pt()),Ie.nextNode(),d.push({type:2,index:++i});o.append(p[m],pt())}}}else if(o.nodeType===8)if(o.data===wn)d.push({type:2,index:i});else{let p=-1;for(;(p=o.data.indexOf(Ce,p+1))!==-1;)d.push({type:7,index:i}),p+=Ce.length-1}i++}}static createElement(t,e){let n=Be.createElement("template");return n.innerHTML=t,n}};function Oe(s,t,e=s,n){if(t===_e)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=ht(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Oe(s,o._$AS(s,t.values),o,n)),t}var Mt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Be).importNode(e,!0);Ie.currentNode=o;let i=Ie.nextNode(),r=0,l=0,d=n[0];for(;d!==void 0;){if(r===d.index){let a;d.type===2?a=new Ze(i,i.nextSibling,this,t):d.type===1?a=new d.ctor(i,d.name,d.strings,this,t):d.type===6&&(a=new Rt(i,this,t)),this._$AV.push(a),d=n[++l]}r!==d?.index&&(i=Ie.nextNode(),r++)}return Ie.currentNode=Be,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},Ze=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Oe(this,t,e),ht(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==_e&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):zs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&ht(this._$AH)?this._$AA.nextSibling.data=t:this.T(Be.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=ut.createElement(Bs(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new Mt(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Rs.get(t.strings);return e===void 0&&Rs.set(t.strings,e=new ut(t)),e}k(t){$n(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(pt()),this.O(pt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=As(t).nextSibling;As(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ne=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=w}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Oe(this,t,e,0),r=!ht(t)||t!==this._$AH&&t!==_e,r&&(this._$AH=t);else{let l=t,d,a;for(t=i[0],d=0;d<i.length-1;d++)a=Oe(this,l[n+d],e,d),a===_e&&(a=this._$AH[d]),r||=!ht(a)||a!==this._$AH[d],a===w?t=w:t!==w&&(t+=(a??"")+i[d+1]),this._$AH[d]=a}r&&!o&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Dt=class extends Ne{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},Lt=class extends Ne{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},jt=class extends Ne{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Oe(this,t,e,0)??w)===_e)return;let n=this._$AH,o=t===w&&n!==w||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==w&&(n===w||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Rt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Oe(this,t)}},Ns={M:yn,P:Ce,A:wn,C:1,L:Os,R:Mt,D:zs,V:Oe,I:Ze,H:Ne,N:Lt,U:jt,B:Dt,F:Rt},Mo=xn.litHtmlPolyfillSupport;Mo?.(ut,Ze),(xn.litHtmlVersions??=[]).push("3.3.3");var Us=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new Ze(t.insertBefore(pt(),i),i,void 0,e??{})}return o._$AI(s),o};var En=globalThis,ce=class extends Te{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Us(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return _e}};ce._$litElement$=!0,ce.finalized=!0,En.litElementHydrateSupport?.({LitElement:ce});var Do=En.litElementPolyfillSupport;Do?.({LitElement:ce});(En.litElementVersions??=[]).push("4.2.2");var Je="mydashlight",ml=`/api/${Je}/pair`,bl=`/api/${Je}/pair/poll`,vl=`/${Je}`,gt="pair";function Hs(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Tn(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function Fs(s){let t=new URLSearchParams(s);return t.has(gt)?Tn(t.get(gt)??""):null}function Lo(s){if(s<60)return"just now";let t=Math.round(s/60);return`${t} minute${t===1?"":"s"} ago`}var ft=class extends ce{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${Je}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${Je}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return g`<form @submit=${o=>{o.preventDefault();let i=Tn(this.typed);i&&this.check(i)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?g`<p class="error" role="alert">${this.error}</p>`:w}
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
    </form>`}confirm(){let e=this.waiting,n=this.step==="approving",o=e.home===!1;return g`<h2>Allow this screen?</h2>
      <p class="code">${Hs(e.code??"")}</p>
      ${o?g`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:w}
      <p>
        A screen at ${e.address} asked ${Lo(e.age??0)}. Check the code matches the one on the screen. It will be
        signed in to Home Assistant as <b>${this.userName||"you"}</b>.
      </p>
      <p>To sign it out later, delete its entry under Refresh tokens on your Home Assistant profile’s Security tab.</p>
      <div class="actions">
        <button type="button" @click=${()=>this.close()} ?disabled=${n}>Cancel</button>
        <button type="button" class="dark" @click=${()=>void this.approve()} ?disabled=${n}>
          ${n?"Allowing…":o?"Allow anyway":"Allow"}
        </button>
      </div>`}render(){let e;return this.isAdmin?this.step==="done"?e=g`<h2>Screen paired</h2>
        <p>It will open the board in a few seconds.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Done</button></div>`:this.step==="confirm"||this.step==="approving"?e=this.confirm():e=this.enter():e=g`<h2>Pair a screen</h2>
        <p>Only a Home Assistant admin can pair a screen. Ask an admin to scan the code instead.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,g`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};ft.styles=Re`
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
  `,ft.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",ft);function L(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Ue(s){let t=Math.floor(Math.round(s)/60)%24;return`${L(s)} ${t<12?"AM":"PM"}`}function Ws(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function bt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function Ks(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var jo=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Ro=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),zo=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function zt(s){return new Date(`${s}T12:00:00Z`)}function ge(s){let t=zt(s);return`${jo.format(t)}, ${zo.format(t)}`}function se(s){return Ro.format(zt(s))}function fe(s,t){return Math.round((zt(t).getTime()-zt(s).getTime())/864e5)}function mt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return mt("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function It(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=mt(e,s),i=mt(e,t).date;return o.date===i?`at ${Ue(o.minutes)}`:`on ${se(o.date)} at ${Ue(o.minutes)}`}var X=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},He="mydashlight",Io=7,Vs=3e4;function Cn(s){if(s instanceof X)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new X(String(t.code??"error"),t.message)}return typeof s=="number"?new X("connection_lost","Lost the connection to Home Assistant."):new X("error",String(s))}var Bt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new X("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Vs),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new X("not_running","MyDashLight isn’t running right now."))},{type:`${He}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:He,service:"get_plan",service_data:{days:Io},return_response:!0});this.emit(t.response)}catch(t){this.fail(Cn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:He,service:t,service_data:e})}catch(n){throw Cn(n)}this.pushing||await this.refresh()}setRide(t,e,n,o){return this.call("set_ride",{event:t,side:e,driver:n,scope:o})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Ks(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,o=null,i=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:He,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(l=>{e||t(l.chores)},{type:`${He}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;i(),o=setInterval(()=>void i(),Vs)}})(),()=>{e=!0,o&&clearInterval(o),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let o=await this.conn.subscribeMessage(i=>{e||t(i.lunch)},{type:`${He}/lunch/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):n=o}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:He,service:t,service_data:e})}catch(n){throw Cn(n)}}};var Gs={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},qs=s=>(...t)=>({_$litDirective$:s,values:t}),Ot=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Bo}=Ns,Ys=s=>s;var Xs=()=>document.createComment(""),Qe=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Xs(),o),r=n.insertBefore(Xs(),o);e=new Bo(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,l=r!==s;if(l){let d;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(d=s._$AU)!==r._$AU&&e._$AP(d)}if(i!==o||l){let d=e._$AA;for(;d!==i;){let a=Ys(d).nextSibling;Ys(n).insertBefore(d,o),d=a}}}return e},Le=(s,t,e=s)=>(s._$AI(t,e),s),Oo={},Zs=(s,t=Oo)=>s._$AH=t,Js=s=>s._$AH,Nt=s=>{s._$AR(),s._$AA.remove()};var Qs=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Se=qs(class extends Ot{constructor(s){if(super(s),s.type!==Gs.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let l of s)o[r]=n?n(l,r):r,i[r]=e(l,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=Js(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let l=this.ut??=[],d=[],a,c,p=0,m=o.length-1,b=0,E=i.length-1;for(;p<=m&&b<=E;)if(o[p]===null)p++;else if(o[m]===null)m--;else if(l[p]===r[b])d[b]=Le(o[p],i[b]),p++,b++;else if(l[m]===r[E])d[E]=Le(o[m],i[E]),m--,E--;else if(l[p]===r[E])d[E]=Le(o[p],i[E]),Qe(s,d[E+1],o[p]),p++,E--;else if(l[m]===r[b])d[b]=Le(o[m],i[b]),Qe(s,o[p],o[m]),m--,b++;else if(a===void 0&&(a=Qs(r,b,E),c=Qs(l,p,m)),a.has(l[p]))if(a.has(l[m])){let f=c.get(r[b]),x=f!==void 0?o[f]:null;if(x===null){let $=Qe(s,o[p]);Le($,i[b]),d[b]=$}else d[b]=Le(x,i[b]),Qe(s,o[p],x),o[f]=null;b++}else Nt(o[m]),m--;else Nt(o[p]),p++;for(;b<=E;){let f=Qe(s,d[E+1]);Le(f,i[b]),d[b++]=f}for(;p<=m;){let f=o[p++];f!==null&&Nt(f)}return this.ut=r,Zs(s,d),_e}});var Ut=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function Q(s){return Ut[(s%Ut.length+Ut.length)%Ut.length]}var Ht="#23272E",_n="35,39,46";var No=3,qt=36,Sn=12,Ft=8,ei=30,me=16,vt=100,Pn=60,Mn=10,Wt=30,Dn=10,Uo=150,Ho=200,Gt=1.4;function Ln(s,t){let e=Math.max(Uo,Ho/Gt);return Math.ceil(Pn+Math.max(0,s-1)*Mn+Wt+Math.max(0,t-1)*Dn+e*(s+Gt*t))}function Ae(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function Pe(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function le(s){return new Map(Ae(s).map((t,e)=>[t,Q(e)]))}function de(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function ie(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function jn(s,t){return t==="none"?"Not needed":Pe(s).includes(t)?ie(s,t):t}function Yt(s,t){return t.own?ie(s,t.own):de(s,t.kid)}var Xt={color:Ht,rgb:_n,ink:Ht};function di(s,t){return t.own?Xt:le(s).get(t.kid)??Q(0)}function Fo(s,t){let e=Ae(s);return t.along.map(n=>e.includes(n)?de(s,n):ie(s,n))}function Rn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Wo(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function Kt(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function An(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(Kt(t,n.from)),e.push(Kt(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(Kt(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Ko(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,l)=>r.s-l.s||l.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let l=n.findIndex(d=>d<=r.s);l<0?(l=n.length,n.push(r.en)):n[l]=r.en,r.col=l,e.push(r),o=Math.max(o,r.en)}return i(),t}function Vo(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function Go(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function ci(s,t){return Vo(s.anchors,t)}function pi(s,t){return Go(s.anchors,t)}function qo(s,t){let e=Ae(s),n=Pe(s),o=Math.max(t,Ln(e.length,n.length)),r=(o-Pn-Math.max(0,e.length-1)*Mn-Wt-Math.max(0,n.length-1)*Dn)/(e.length+Gt*n.length||1),l=Math.floor(r),d=Math.floor(r*Gt),a=new Map;for(let E of s.days)for(let f of E.events)for(let x of f.own?f.along:[f.kid]){let $=a.get(x)??[];$.some(v=>v.event_id===f.event_id&&v.calendar_id===f.calendar_id)||$.push(f),a.set(x,$)}let c=le(s),p=[],m=Pn;e.forEach((E,f)=>{let x=a.get(E)??[],$=s.days.some(v=>v.events.some(P=>P.kid===E&&(P.sides.includes("drop")&&P.drop===""||P.sides.includes("pick")&&P.pick==="")));p.push({id:E,kind:"kid",x:m,w:l,name:de(s,E),dot:c.get(E).color,rgb:c.get(E).rgb,sub:`${$?"Needs a ride · ":""}${x.length} this week`,subWarn:$}),m+=l+(f<e.length-1?Mn:0)});let b=m+Wt/2;return m+=Wt,n.forEach((E,f)=>{let x=0,$=0;for(let v of s.days){let P=v.drivers[E];P&&(x+=P.outings.length,$+=P.drive??0)}p.push({id:E,kind:"driver",x:m,w:d,name:ie(s,E),dot:Ht,rgb:_n,sub:`${x} ${x===1?"trip":"trips"} this week · ${bt($)} driving`,subWarn:!1}),m+=d+(f<n.length-1?Dn:0)}),{columns:p,sepX:b,width:o}}function Yo(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function ti(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${L(s.start)}`:e||!t?`${s.title} until ${L(s.end)}`:`${s.title} ${L(s.start)}–${L(s.end)}`}function zn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length}function In(s,t){let e=fe(t,s);return e===0?"Today":e===1?"Tomorrow":""}function te(s,t=0){return s==null||!Number.isFinite(s)?t:s}function ni(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let l=r.length;for(i===0?i=l:i+1+l<=n?i+=1+l:(o++,i=l);i>n;)o++,i-=n}return o}var hi=25,Xo=15,ui=3;function si(s){return Math.max(0,Math.min(ui,Math.floor((s-hi)/Xo)))}var Zo=hi+2,ii=20;function oi(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var Vt="🚗";function ri(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,l=!1)=>({at:o,who:i,stays:l,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var ai={muted:0,normal:1,pending:2,problem:3};function gi(s){let{drop:t,pick:e}=s,n=t?ri(t.text,"drop"):null,o=e?ri(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((d,a)=>a&&(ai[a.tone]??1)>(ai[d]??1)?a.tone:d,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Vt} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let d=`${Vt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${d} both ways`,tone:i},pick:null}:{drop:{text:`${d} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(d,a)=>d==="needed"?`${a} needed`:`${a}${d.at?`${d.at} `:" "}${d.who}${d.stays?" stays":""}${d.extra}`,l=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Vt} ${l.join(" · ")}`,tone:i},pick:null}}function li(s,t){let e=t-23,n=`${L(s.start)}–${L(s.end)}`+(s.arrive_by!=null?` · arrive ${L(s.arrive_by)}`:""),o=33+ni(n,e,6.6)*16,i=s.own?s.lines:gi(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+ni(r.text,e,7)*16);return o+4}function fi(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:l}=qo(s,e),d=new Map(i.map(v=>[v.id,v])),a=Ae(s),c=Pe(s),p=[...a,...c],m=le(s),b=Wo(s),E=v=>de(s,v),f=v=>ie(s,v),x={mode:t,width:l,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},$=0;return s.days.forEach((v,P)=>{let U=P*1440,z=new Map(v.events.map(u=>[u.id,u])),ne=u=>u&&z.has(u)?{day:v.date,event:u}:null,Z=zn(v),ye=v.events.length,pe=In(v.date,n.date);x.dayHeads.push({date:v.date,y:$,label:ge(v.date),tag:pe,sub:(ye?`${ye} ${ye===1?"activity":"activities"}`:"Nothing scheduled")+(Z?` · ${Z} to sort out`:""),warn:Z>0}),x.anchors.push({t:U,y:$});let J=$+qt+Sn,Xe=c.flatMap(u=>v.drivers[u]?.outings??[]);if(!ye&&!Xe.length){x.empties.push({key:v.date,y:J,text:"Nothing planned"}),$=J+40,x.anchors.push({t:U+1439,y:$});return}let we=(u,C,M,_,R,H,h,y=u.kid)=>{let S=!!u.own&&y===u.own,D=!!u.own&&y!==u.own,B=S?Xt:m.get(y)??Q(0),K=S?f(y):E(y),V=D?{drop:{text:`With ${f(u.own)}`,tone:u.attending===!1?"muted":"normal"},pick:null}:h&&!u.own?gi(u.lines):u.lines,T=S?Fo(s,u):[],Y=(u.takes!=null?`${u.takes} min, any time ${L(u.start)}–${L(u.end)}`:`${L(u.start)}–${L(u.end)}`+(u.arrive_by!=null?` · arrive ${L(u.arrive_by)}`:""))+(T.length?` · with ${Rn(T)}`:"");return{key:`${v.date}|card|${u.id}`+(u.own?`|${y}`:""),x:C,y:M,w:_,h:R,target:{day:v.date,event:u.id},event:u,color:B,kidName:K,clash:H,stayed:!u.own&&u.stay&&c.includes(u.drop),skipped:u.attending===!1,title:Yo(u.title,K),time:Y,drop:V.drop,pick:V.pick,showDrop:!!V.drop&&(h||R>=56),showPick:!!V.pick&&(h||R>=74),wrap:h,aria:`${K}, ${u.title} ${u.takes!=null?`any time from ${L(u.start)} to ${L(u.end)}`:`${L(u.start)} to ${L(u.end)}`}. `+(u.attending===!1&&!V.drop?"Not attending. ":"")+[V.drop,V.pick].filter(k=>!!k).map(k=>k.text).join(". ")}},De=u=>{let C=v.rides[u];return C?(v.drivers[C.driver]?.segments??[]).filter(_=>_.type!=="home"&&_.kids.includes(C.kid)&&te(_.start)>=te(C.start)&&te(_.end)<=te(C.end)):[]},$e=u=>{let C=v.rides[u];if(!C)return null;let M=C.serves.find(_=>z.get(_)?.kid===C.kid);return ne(M??C.serves[0])},ke=(u,C)=>{if(C.event)return C;let M=v.events.find(_=>_.own&&_.own!==u&&_.along.includes(u)&&_.title===C.title);return M?{...C,title:`${C.title} with ${f(M.own)}`}:C},je=u=>{if(u.takes==null)return[u.start,u.end];let C=u.planned??u.start;return[C,C+u.takes]},Ee=new Map;for(let u of v.issues)u.level!=="problem"||!u.event||(u.kind==="late"&&Ee.set(u.event,`${Math.round(te(u.minutes))} min late`),u.kind==="waiting"&&Ee.set(`${u.event}|pick`,`Waits ${Math.round(te(u.minutes))} min`));if(!o){let u=1/0,C=-1/0;for(let h of v.events)h.start<=0&&h.end>=1440||(h.start>0?u=Math.min(u,h.start-20,h.arrive_by!=null?h.arrive_by-10:1/0):u=Math.min(u,h.end-30),h.end<1440?C=Math.max(C,h.end+20):C=Math.max(C,h.start+30));for(let h of Xe)h.start!=null&&(u=Math.min(u,h.start)),h.end!=null&&(C=Math.max(C,h.end));v.date===n.date&&Number.isFinite(u)&&n.minutes>u-60&&n.minutes<C&&(u=Math.min(u,n.minutes-15));let M=Number.isFinite(u)?Math.floor((u-5)/30)*30:900,_=Number.isFinite(C)?Math.ceil((C+5)/30)*30:960,R=h=>Math.round(J+(Math.max(M,Math.min(_,h))-M)*No);x.anchors.push({t:U+M,y:R(M)},{t:U+_,y:R(_)});for(let h of a){let y=d.get(h),S=m.get(h),D=(v.kids[h]?.items??[]).filter(k=>k.start!=null&&k.end!=null).map(k=>({item:k,s:te(k.start),en:te(k.end)})),B=[];for(let k of Ko(D)){let j=y.w/k.cols,O=Math.round(y.x+k.col*j),F=Math.round(j-(k.cols>1?4:0)),G=R(k.s),W=k.item;if(W.type==="act"){let ae=z.get(W.event??"");if(!ae)continue;let Tt=Math.max(30,R(k.en)-G),Ct=we(ae,O,G,F,Tt,W.clash,!1,h);if(Ct.layer=vt,x.cards.push(Ct),ae.arrive_by!=null&&ae.start-ae.arrive_by>=5){let un=R(ae.arrive_by),$s={key:`${v.date}|prep|${ae.id}`,x:O,y:un,w:F,h:G-un+me,color:S,label:`Arrive by ${L(ae.arrive_by)}`,layer:vt-1};x.preps.push($s),B.push({s:ae.arrive_by,en:k.en,top:un,bottom:G+Tt,x:O,w:F,prep:$s,card:Ct})}else B.push({s:k.s,en:k.en,top:G,bottom:G+Tt,x:O,w:F,card:Ct});let ys=Ee.get(ae.id);ys&&x.marks.push({key:`${v.date}|late|${ae.id}`,x:O+F-4,y:G+4,text:ys,right:!0});let ws=Ee.get(`${ae.id}|pick`);ws&&x.marks.push({key:`${v.date}|wait|${ae.id}`,x:O+4,y:G+Tt+2,text:ws,right:!1});continue}let N=v.rides[W.ride??-1];if(!N)continue;let ue=Math.max(22,R(k.en)-G),at=An(De(N.index),b),bs=f(N.driver),vs={key:`${v.date}|ride|${N.index}`,x:O,y:G,w:F,h:ue,target:$e(N.index),l1:`${N.own?"In":"Along in"} ${bs}’s car`,l2:at.join(" → "),show2:si(ue)>0,lines2:si(ue),dashed:!N.own,clash:W.clash,aria:`${E(h)} ${N.own?"in":"riding along in"} ${bs}’s car, ${L(te(N.start))} to ${L(te(N.end))}: ${at.join(" to ")}`};x.rides.push(vs);let xs=d.get(N.driver),hn=null;xs&&(hn={key:`${v.date}|band|${N.index}`,x:O+F,y:G,w:Math.max(0,xs.x+8-(O+F)),h:ue,color:S},x.bands.push(hn)),B.push({s:k.s,en:k.en,top:G,bottom:G+ue,x:O,w:F,ride:vs,band:hn})}let K=k=>k.ride?.layer??(k.prep?vt-1:vt),V=(k,j,O,F)=>{O>me&&x.links.push({key:`${k.key}|link`,x:k.x,y:j,w:k.w,h:O,color:S,layer:F})},T=(k,j)=>{if(!(j.x<k.x||j.x+j.w>k.x+k.w)&&(k.x=j.x,k.w=j.w,k.ride.x=j.x,k.ride.w=j.w,k.band)){let O=k.band.x+k.band.w;k.band.x=j.x+j.w,k.band.w=Math.max(0,O-k.band.x)}},Y=new Set;for(let k of[...B].sort((j,O)=>O.s-j.s)){let j=k.ride;if(!j)continue;let O=B.filter(W=>W!==k&&W.s>=k.en&&W.s-k.en<=ei&&W.top>=k.bottom).sort((W,N)=>W.s-N.s||W.top-N.top)[0];if(!O)continue;Y.add(k),T(k,O);let F=K(O),G=O.top-k.bottom;V(j,k.bottom,G+me,F-1),j.layer=F-(G>0?2:1),j.h+=me,j.tuckBottom=me}for(let k of[...B].sort((j,O)=>j.s-O.s)){let j=k.ride;if(!j||Y.has(k))continue;let O=B.filter(W=>W!==k&&W.en<=k.s&&k.s-W.en<=ei&&W.bottom<=k.top&&(W.card||W.ride?.layer!=null)).sort((W,N)=>N.en-W.en||N.bottom-W.bottom)[0];if(!O)continue;T(k,O);let F=O.ride?.layer??vt,G=k.top-O.bottom;V(j,O.bottom-me,G+me,F-1),j.layer=F-(G>0?2:1),j.y-=me,j.h+=me,j.tuckTop=me}}for(let h of c){let y=d.get(h),S=v.drivers[h];if(!S)continue;let D=[],B=null;for(let T of S.segments)if(!(T.start==null||T.end==null)){if(T.type==="home"){B=null;continue}if(T.type==="stay"){B=null,D.push({type:"stay",g:T,s:T.start,en:T.end});continue}B&&B.en===T.start?(B.en=T.end,B.legs.push(T)):(B={type:"trip",s:T.start,en:T.end,legs:[T]},D.push(B))}let K=new Set,V=(T,Y,k,j)=>{K.add(T.id);let O=R(Y),F=we(T,y.x+8,O,y.w-16,Math.max(30,R(k)-O),!1,!1,h);j&&F.drop?.tone==="normal"&&(F.drop=null,F.showDrop=!1),x.cards.push(F)};for(let T of D){let Y=R(T.s),k=Math.max(24,R(T.en)-Y);if(T.type==="stay"){let N=z.get(T.g.event??T.g.serves??"");if(N?.own===h){V(N,T.s,T.en,!0);continue}let ue=N?m.get(N.kid)??Q(0):Q(0),at=T.g.kids.map(E);x.stays.push({key:`${v.date}|stay|${h}|${T.s}`,x:y.x+8,y:Y,w:y.w-16,h:k,target:ne(N?.id),color:ue,l1:N?`At ${N.title} with ${E(N.kid)}`:"Staying",l2:`until ${L(T.en)}`+(at.length?` · ${at.join(" and ")} too`:"")});continue}let j=T.legs[0],O=T.legs[T.legs.length-1],F=[];for(let N of T.legs)for(let ue of N.kids)F.includes(ue)||F.push(ue);let G=O.type==="drive"&&O.to==="home",W=An(T.legs,b);x.trips.push({key:`${v.date}|trip|${h}|${T.s}`,x:y.x+8,y:Y,w:y.w-16,h:k,target:ne(T.legs.find(N=>N.serves)?.serves),l1:j.type==="drive"&&j.from==="home"?`Leave ${L(T.s)}`:`From ${Kt(b,j.from??j.place)} ${L(T.s)}`,l2:W.join(" → "),show2:k>=36,l3:G?`Home ${L(T.en)}`:"",show3:G&&k>=62,stops:null,kids:F.map(N=>(m.get(N)??Q(0)).color),bad:T.legs.some(N=>N.overlaps_busy),aria:`${f(h)} drives ${W.join(" to ")}, ${L(T.s)} to ${L(T.en)}`})}for(let T of S.segments)if(!(!T.overlaps_busy||T.start==null||T.end==null))for(let Y of S.busy){let k=Math.max(T.start,Y.start),j=Math.min(T.end,Y.end);j<=k||x.overlaps.push({key:`${v.date}|overlap|${h}|${k}`,x:y.x+6,y:R(k)-2,w:y.w-12,h:Math.max(8,R(j)-R(k)+4)})}for(let T of v.events)if(T.own===h&&(K.has(T.id)||V(T,...je(T),!1),T.takes!=null&&T.attending!==!1)){let Y=R(T.start);x.windows.push({key:`${v.date}|window|${T.id}`,x:y.x+4,y:Y,w:y.w-8,h:Math.max(24,R(T.end)-Y),label:`${T.title} · any time ${L(T.start)}–${L(T.end)}`})}for(let T of S.busy){if(T.event||T.end<=M||T.start>=_)continue;let Y=ke(h,T),k=R(Y.start),j=R(Y.end);x.busy.push({key:`${v.date}|busy|${h}|${Y.start}`,x:y.x+1,y:k,w:y.w-2,h:j-k,labelY:8,label:ti(Y,!1)})}}let H=-1/0;for(let h=M;h<=_;h+=30)x.grid.push({key:`${v.date}|grid|${h}`,y:R(h),strong:h%60===0}),h%60===0&&R(h)-H>=22&&(x.hours.push({key:`${v.date}|hour|${h}`,y:R(h)-8,label:Ws(h)}),H=R(h));v.date===n.date&&n.minutes>M&&n.minutes<_&&(x.now={y:R(n.minutes),label:`Now ${L(n.minutes)}`}),$=R(_)+Sn;return}let A=[];for(let u of a){let C=d.get(u);for(let M of v.kids[u]?.items??[])if(M.start!=null){if(M.type==="act"){let _=z.get(M.event??"");if(!_)continue;A.push({col:u,s:M.start,h:li(_,C.w),kind:"act",item:M})}else if(!v.rides[M.ride??-1]?.own){let _=v.rides[M.ride??-1],R=_?v.drivers[_.driver]?.outings.find(H=>H.start!=null&&H.start<=te(_.start)&&te(_.start)<=te(H.end,H.start)):void 0;A.push({col:u,s:R?.start??M.start,h:Zo,kind:"along",item:M})}}}for(let u of c){let C=v.drivers[u];if(!C)continue;for(let _ of C.busy)_.event||A.push({col:u,s:_.start,h:32,kind:"busy",busy:ke(u,_)});let M=d.get(u).w;for(let _ of v.events)_.own!==u||_.attending!==!1&&(_.takes==null||_.planned!=null)||A.push({col:u,s:je(_)[0],h:li(_,M),kind:"own",event:_});for(let _ of C.outings){if(_.start==null)continue;let R=_.lines.length-(oi(_.lines)?1:0);A.push({col:u,s:_.start,h:30+R*16+(_.warn?16:0),kind:"out",out:_})}}A.sort((u,C)=>u.s-C.s||p.indexOf(u.col)-p.indexOf(C.col));let q=new Map,I=[],oe=new Map,he=J-ii;for(let u=0;u<A.length;){let C=u,M=he+ii;for(;C<A.length&&A[C].s===A[u].s;C++){let R=q.get(A[C].col);R!=null&&(M=Math.max(M,R+Ft))}let _=new Set;for(let R=u;R<C;R++){let H=A[R],h=_.has(H.col)?q.get(H.col)+Ft:M;_.add(H.col),q.set(H.col,h+H.h)}oe.set(A[u].s,M),A[u].s>0&&x.hours.push({key:`${v.date}|hour|${A[u].s}`,y:M+2,label:Ue(A[u].s)}),he=M,u=C}q.clear(),A.forEach((u,C)=>{let M=q.get(u.col),_=Math.max(M!=null?M+Ft:J,oe.get(u.s));q.set(u.col,_+u.h);let R=u.kind==="busy"?u.busy.end:u.kind==="act"?z.get(u.item.event??"")?.end??null:u.kind==="own"?je(u.event)[1]:null;I.push({col:u.col,s:u.s,end:R,y:_,h:u.h,box:null}),x.anchors.push({t:U+u.s,y:_});let H=d.get(u.col);if(u.kind==="busy"){let h={key:`${v.date}|busy|${u.col}|${C}`,x:H.x+1,y:_,w:H.w-2,h:u.h,labelY:8,label:ti(u.busy,!0)};x.busy.push(h),I[I.length-1].box=h}else if(u.kind==="out"){let h=u.out,y=oi(h.lines),S=y?h.lines.slice(0,-1):h.lines;x.trips.push({key:`${v.date}|trip|${u.col}|${C}`,x:H.x+8,y:_,w:H.w-16,h:u.h,target:ne(h.target),l1:y?`${h.lead} · home ${y}`:h.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...S.map(D=>({text:D,warn:!1})),...h.warn?[{text:h.warn,warn:!0}]:[]],kids:h.kids.map(D=>(m.get(D)??Q(0)).color),bad:!!h.warn,aria:`${f(u.col)}: ${h.lead}. ${h.lines.join(". ")}${h.warn?`. ${h.warn}`:""}`})}else if(u.kind==="own"){let h=we(u.event,H.x+8,_,H.w-16,u.h,!1,!0,u.col);x.cards.push(h),I[I.length-1].box=h}else if(u.kind==="act"){let h=z.get(u.item.event??""),y=we(h,H.x,_,H.w,u.h,u.item.clash,!0,u.col);x.cards.push(y),I[I.length-1].box=y}else{let h=v.rides[u.item.ride??-1],y=An(De(h.index),b),S=f(h.driver);x.rides.push({key:`${v.date}|ride|${h.index}`,x:H.x,y:_,w:H.w,h:u.h,target:$e(h.index),l1:`${Vt} with ${S}`,l2:y.join(" → "),show2:!1,lines2:ui,dashed:!0,clash:u.item.clash,aria:`${E(u.col)} riding along with ${S}, ${L(te(h.start))} to ${L(te(h.end))}: ${y.join(" to ")}`})}});let re=J;for(let u of q.values())re=Math.max(re,u);for(let u of I){if(!u.box||u.end==null)continue;let C=u.y+u.h;for(let M of I)M.col!==u.col&&M.s>=u.s&&M.s<u.end&&(C=Math.max(C,M.y+M.h));u.end>=1440&&(C=re);for(let M of I)M.col===u.col&&M.y>u.y&&(C=Math.min(C,M.y-Ft));C=Math.min(C,re),C>u.y+u.h&&(u.box.h=C-u.y)}$=re+Sn+6,x.anchors.push({t:U+1439,y:$})}),x.height=$,x}var Jo=["","¼","½","¾"];function Fe(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return bt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=Jo[o%4];return`${i||!r?i:""}${r} min`})}function mi(s){let t=e=>e?{...e,text:Fe(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Fe),warn:i.warn==null?i.warn:Fe(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:Fe(n.title),body:Fe(n.body),note:n.note==null?n.note:Fe(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Fe(o.note)}))}:{}}))}))}}var Qo=2,er=48;function bi(s,t,e=er){let n=[],o=0,i=0,r=0,l=0,d=t.minutes+e*60;for(let a of s.days){let c=fe(t.date,a.date),p=c===0?"":`${se(a.date)} · `,m=new Map(a.events.map(f=>[f.id,f])),b=f=>f&&m.has(f)?{day:a.date,event:f}:null,E=(f,x)=>c*1440+(f??m.get(x??"")?.start??0)<d;for(let f of a.issues)if(f.level==="problem"){if(!E(f.at,f.event)){r++,f.kind==="unassigned"&&l++;continue}o++,f.kind==="unassigned"&&i++,n.push({key:`${a.date}|${f.key}`,tone:f.kind==="unassigned"?"unassigned":"problem",title:p+f.title,body:f.body,target:b(f.event),suggestions:(f.suggestions??[]).map(x=>({id:x.id,label:x.label,note:x.note}))})}if(a.clashes.forEach((f,x)=>{if(!E(f.a.start,f.a.event)){r++;return}o++;let $=m.get(f.a.event??""),v=de(s,f.kid),P=(z,ne)=>{let Z=b(ne);return Z?{text:z,target:Z}:z},U=[];if(f.b.type==="act"){let z=m.get(f.b.event??"");$&&z&&(U=[P($.title,$.id),` ${L($.start)}–${L($.end)} and `,P(z.title,z.id),` ${L(z.start)}–${L(z.end)} overlap.`])}else{let z=a.rides[f.b.ride??-1];$&&z&&(U=[`${v} is in `,P(`${ie(s,z.driver)}’s car`,z.serves[0]),` ${L(te(f.b.start))}–${L(te(f.b.end))}, during `,P($.title,$.id),"."])}n.push({key:`${a.date}|clash|${x}`,tone:"problem",title:`${p}${v} is double-booked`,body:U.map(z=>typeof z=="string"?z:z.text).join(""),parts:U,target:null,suggestions:[]})}),c>=0&&c<Qo)for(let f of a.issues)f.level!=="heads_up"||!E(f.at,f.event)||n.push({key:`${a.date}|${f.key}`,tone:"heads_up",title:p+f.title,body:f.body,target:b(f.event),suggestions:[]});for(let f of a.events)!f.problems.length||!E(f.start)||n.push({key:`${a.date}|notes|${f.id}`,tone:"heads_up",title:`${p}Check the notes on ${Yt(s,f)}’s ${f.title}`,body:`These lines couldn’t be read: ${f.problems.join("; ")}`,target:b(f.id),suggestions:[]})}return{items:n,problems:o,unassigned:i,later:r,laterUnassigned:l}}function vi(s,t){let e=le(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=fe(t.date,i.date);if(!(r<0))for(let l of Pe(s))for(let d of i.drivers[l]?.outings??[]){if(d.start==null)continue;let a=r*1440+d.start;if(r*1440+te(d.end,d.start)<=t.minutes)continue;let p=a-t.minutes,m={driver:l,name:ie(s,l),date:i.date,ahead:r,start:d.start,inMinutes:p,ongoing:p<=0,lead:d.lead,stop:(d.lines[0]??"").replace(/\s+/g," ").trim(),kids:d.kids.map(b=>e.get(b)??Q(0)),warn:d.warn,target:d.target&&i.events.some(b=>b.id===d.target)?{day:i.date,event:d.target}:null};(!n||o(m)<o(n)||o(m)===o(n)&&m.inMinutes<n.inMinutes)&&(n=m)}}return n}function et(s){return s.state==="done"||s.state==="late"}var tr=780;function nr(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<tr}function xi(s,t){return s.chores.map(e=>nr(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function yi(s){return s.state==="open"||s.state==="overdue"}function Nn(s,t,e){if(et(s)){let n=s.done_at?sr(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Bn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Bn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=fe(t,s.due);return`By ${o===1?"tomorrow":o<7?se(s.due):On(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Bn(s.for_day,t)}`;if(s.due&&s.due>t){let n=fe(t,s.due);return n===1?"By tomorrow":`By ${n<7?se(s.due):On(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Bn(s,t){let e=fe(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?se(s):On(s)}function On(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function sr(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${se(i)} ${r}`}function wi(s,t,e=1440){let n=xi(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(c=>c.kid===o.id),l=new Map;for(let c of r){if(c.state!=="upcoming")continue;let p=c.shows_from??c.due??s.today;l.set(p,[...l.get(p)??[],c])}let d=r.filter(c=>c.state==="overdue"),a=r.filter(c=>c.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??Q(i),overdue:d,now:a,done:r.filter(et),later:[...l.entries()].sort(([c],[p])=>c.localeCompare(p)).map(([c,p])=>({date:c,chores:p})),left:d.length+a.length}})}function $i(s,t=1440){return xi(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Un(s){return!s.chores.length&&!s.templates.length}var We=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Hn(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>We.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function Fn(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${We[n[0]]}-${We[n.at(-1)]}`]:n.map(o=>We[o])).join(", ")}var Ke="none";function Zt(s){return s==="daily"||s==="school"?"":"Any"}function ki(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Ei(s){let t=s.days??Zt(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function Wn(s){return s.title.trim()?s.who.length?s.days===Ke?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Ti(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function Kn(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function Vn(s,t,e=1,n=!1,o=!1){if(s==="school"){let c=t.trim().replace(/-/g,"–"),p=o?c?`${c} Bring lunch days`:"Bring lunch days":c?`${c} school days`:"Every school day";return n?`${p}, the night before`:p}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,l=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(l))return e>1?`Every day, every ${e} weeks`:"Every day";if(!l||l.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${l.replace(/-/g,"–")} ${r}`;let a=`${l.split(",").map(c=>{let p=c.trim();return p.toLowerCase()==="last"?"the last day":/^\d+$/.test(p)?`the ${Kn(Number(p))}`:`the ${p}`}).join(" and ")} ${r}`;return a[0].toUpperCase()+a.slice(1)}function Gn(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function qn(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function Jt(s,t){return`${s}|${t}`}function tt(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function Qt(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Ci(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function _i(s,t){return Qt(t)<5&&!Ci(s,t)}function xt(s,t,e=new Map){if(!_i(s,t))return null;let n=Jt(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function nt(s,t){return _i(s,t)?s.menus?.[t]??null:null}var ir="From the school's menu feed.";function or(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==ir);return t.length?t.join(`
`):null}function be(s){return s.slice(0,7)}function en(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Yn(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Si(s){let t=[];for(let e=be(s.first);e<=be(s.last);e=Yn(e))t.push(e);return t}function Ai(s,t,e,n=new Map){let o=`${e}-01`,i=tt(o,-Qt(o)),r=[];for(;be(i)<=e;){let l=[];for(let d=0;d<5;d++){let a=tt(i,d),c=be(a)!==e,p=c?null:Ci(t,a),m=c?null:xt(t,a,n);l.push({date:a,day:Number(a.slice(8)),outside:c,off:p?p.title:null,lunch:m?.lunch??null,picked:m?.picked??!1,menu:c?null:nt(t,a)?.dish??null,sides:c?null:or(nt(t,a)?.details??""),past:a<s.today,today:a===s.today})}l.some(d=>!d.outside)&&r.push(l),i=tt(i,7)}return r}function Pi(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Mi(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Di(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=tt(t,i),l=xt(s,r,n);if(!l)continue;let d=fe(t,r);return{lunch:l.lunch,when:d===0?"today":d===1?"tomorrow":se(r),date:r,menu:nt(s,r)?.dish??null}}return null}var rr={timeline:"timeline",full:"timeline",compact:"compact"};function Xn(s){let t=new URLSearchParams(s),e={},n=rr[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),e}var Li=Re`
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
`;var xo="mydashlight.rides.mode",Ba=1100,Oa=440,Na=700,Ua=3*6e4,Ha=1200;function Fa(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var cn=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,fo=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Wa=new URL("emoji.json",import.meta.url).href,mo=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],bo=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,vo=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Ka=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Va=ee`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,$t={bring:"Bring",buy:"Buy"};function Ga(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function xe(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function ms(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function qa(s,t){return In(s,t)||ge(s).split(",")[0]}function Ya(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Xa(){try{return localStorage.getItem(xo)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Za(s){try{localStorage.setItem(xo,s)}catch{}}function pn(s){return s.days.every(t=>!t.events.length)}var kt=class extends ce{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Xn(location.search).view;this.urlPage=Xn(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Ua))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Xa(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,l]=o.split("|"),d=e.kids.find(a=>a.id===r);(!d||(d.picks[l]??null)===i||!xt(d,l))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&et(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=mi(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Ba)return!1;let e=this.plan;return!e||this.width-Oa>=Ln(Ae(e).length,Pe(e).length)}today(){return mt(this.plan?.time_zone??Fa())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||o!==this.boardKey)&&(this.board=fi(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let o=this.scroller;if(!o||!this.board)return;let i=this.board.dayHeads.find(r=>r.date===n)?.y??0;o.scrollTop=Math.max(i,ci(this.board,e)-qt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let o=this.today();if(e===o.date){this.scrollToNow();return}let i=this.dayIndexOf(e),r=n.days[i];if(!r)return;let l=1/0;if(this.mode==="timeline"){for(let d of r.events)l=Math.min(l,d.arrive_by??d.start);for(let d of Object.values(r.drivers))for(let a of d.outings)a.start!=null&&(l=Math.min(l,a.start))}this.scrollToTime(i*1440+(Number.isFinite(l)?Math.max(0,l-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let a of this.board.dayHeads)a.y<=n+1&&(o=a);let i=this.renderRoot,r=i.querySelector(".pinned .label"),l=i.querySelector(".pinned .tag"),d=i.querySelector(".pinned .sub");r&&r.textContent!==o.label&&(r.textContent=o.label),l&&(l.textContent!==o.tag&&(l.textContent=o.tag),l.hidden=!o.tag),d&&d.textContent!==o.sub&&(d.textContent=o.sub),d?.classList.toggle("warn",o.warn);for(let a of i.querySelectorAll(".day-tile"))a.classList.toggle("in-view",a.dataset.date===o.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let d=r instanceof X?r:new X("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??et(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=nt(e,n),r=o.filter(l=>l.id===e.id||i&&nt(l,n)?.dish===i.dish).map(l=>l.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof X?o:new X("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(Jt(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let l=new Map(this.lunchDraft);for(let a of n)l.delete(Jt(e,a));this.lunchDraft=l;let d=r instanceof X?r:new X("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Ei(e):ki(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(go(),uo))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Wn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Ti(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof X?n:new X("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof X?n:new X("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?pi(this.board,n.scrollTop+qt+4):null,this.mode=e,this.urlView||Za(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof X?i:new X("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o){if(!this.backend)return;let i=this.backend;this.save(`${n}`,o,()=>i.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,l=r.includes(n)?r.filter(d=>d!==n):[...r,n];this.save(`along-${o}`,l,()=>i.setTakeAlong(e.id,l,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Ha)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,l=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,l)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=e?bi(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},i=this.wide,r=this.chores?$i(this.chores,this.today().minutes).filter(p=>!this.choreDone(p)):[],l=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,d=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",a=g`<aside class="panel" aria-label=${d}>
      ${l??(this.sel&&e?this.renderEditor(e):this.renderAttention(o,r))}
    </aside>`,c=this.page==="rides";return g`
      <div class="app ${i?"wide":this.width<Na?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,o,r.length)} ${c&&e?this.renderWeek(e):w}
          ${c?this.renderBanner(e):w}
          <main>
            ${c?g`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?pn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:this.page==="lunch"?g`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:g`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!i&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?g`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${a}`:w}
          </main>
        </div>
        ${i?a:w}
        ${this.toast?g`<div class="toast" role="status">${this.toast}</div>`:w}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),l="";if(e){let m=e.time_zone,b=new Date(e.updated);this.error?l=g`<span class="bad">Can’t reach Home Assistant · showing the plan from ${It(b,new Date,m)}</span>`:e.status&&!e.status.ok?l=g`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${It(b,new Date,m)}</span>`:this.backend?.live||(l=`Updated ${It(b,new Date,m)}`)}let d=(m,b,E,f)=>g`
      <button type="button" class="seg-btn" title=${f} aria-pressed=${this.mode===m?"true":"false"} @click=${()=>this.setMode(m)}>
        ${E}<span class="seg-label">${b}</span>
      </button>
    `,a=(m,b,E)=>g`
      <button type="button" class="seg-btn" aria-pressed=${this.page===m?"true":"false"} @click=${()=>this.setPage(m)}>
        ${E}<span class="seg-label">${b}</span>
      </button>
    `,c=Ue(r.minutes),p=!!e&&pn(e);return g`
      <header>
        ${this.showMenu?g`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ee`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:w}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ge(r.date)}, ${c}`}>
            <span class="hm">${c.slice(0,-3)}</span><span class="ampm">${c.slice(-2)}</span>
          </h1>
          <p class="today-line">${ge(r.date)}</p>
          ${l?g`<p class="status">${l}</p>`:w}
        </div>
        ${e&&!p?this.renderNext(e,vi(e,r),n):w}
        <div class="controls">
          ${this.wide||p&&!o?w:g`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?w:g`<div role="group" aria-label="View" class="seg">
            ${d("timeline","Timeline",ee`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${d("compact","Compact",ee`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${a("rides","Rides",ee`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${a("chores","Chores",ee`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?w:a("lunch","Lunch",ee`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let a=this.today().date,c=o.unassigned,p=o.laterUnassigned;if(c){let b=g`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${c} ${c===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?g`<div class="next idle needs">${b}</div>`:g`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(p)return g`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${p} ${p===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let m=e.days.some(b=>b.date>=a&&b.events.length);return g`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${m?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${m?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${bt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${se(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,l=g`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${xe(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(a=>g`<span class="kid-dot" style="background:${a.color}"></span>`)}</span>
      </span>
      ${n.warn?g`<span class="next-stop warn">${n.warn}</span>`:n.stop?g`<span class="next-stop">${n.stop}</span>`:w}
    `,d=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?g`<button type="button" class=${d} @click=${()=>this.open(n.target)}>${l}</button>`:g`<div class=${d}>${l}</div>`}renderWeek(e){let n=this.today().date,o=le(e);return g`<nav class="week" aria-label="Days">
      ${e.days.map(i=>{let r=zn(i),l=i.events.length,d=i.events.slice(0,6).map(c=>c.own?Xt.color:o.get(c.kid)?.color??Q(0).color),a=`${ge(i.date)}: ${l?`${l} ${l===1?"activity":"activities"}`:"nothing planned"}${r?`, ${r} to sort out`:""}`;return g`<button
          type="button"
          class="day-tile ${i.date===n?"today":""}"
          data-date=${i.date}
          aria-label=${a}
          @click=${()=>this.goToDay(i.date)}
        >
          <span class="dt-wd">${i.date===n?"Today":se(i.date)}</span>
          <span class="dt-num">${Number(i.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${d.length?d.map(c=>g`<span class="dt-dot" style="background:${c}"></span>`):g`<span class="dt-free">free</span>`}
            ${l>6?g`<span class="dt-more">+${l-6}</span>`:w}
          </span>
          ${r?g`<span class="dt-badge" aria-hidden="true">${r}</span>`:w}
        </button>`})}
    </nav>`}renderQuiet(e){let n=Ae(e),o=Pe(e),i=le(e),r=n.map(l=>de(e,l));return g`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((l,d)=>ee`<circle cx=${50+d*30} cy="80" r="11" fill=${i.get(l).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Ya(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(l=>{let d=i.get(l);return g`<div class="qw-person" style="--c:${d.color};--rgb:${d.rgb}">
            <span class="avatar" aria-hidden="true">${xe(de(e,l))}</span>
            <span class="qw-name">${de(e,l)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(l=>g`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${xe(ie(e,l))}</span>
            <span class="qw-name">${ie(e,l)}</span>
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
    </div>`}renderBanner(e){let n=e?.unavailable_calendars.length??0;return n?g`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:w}renderEmpty(){return this.error?g`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:g`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,o=a=>!!a&&!!n&&a.day===n.day&&a.event===n.event,i=e.dayHeads[0],r=e.width,l=100,d=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??l-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??l})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??l+1}))].sort((a,c)=>a.z-c.z);return g`
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
          ${e.columns.map(a=>g`<div class="col-head ${a.kind}" style="left:${a.x}px;width:${a.w}px;--c:${a.dot};--rgb:${a.rgb}">
              <span class="avatar ${a.kind}" aria-hidden="true">${xe(a.name)}</span>
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
          ${e.columns.map(a=>g`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>g`<div class="day-head" style="top:${a.y}px;width:${r}px">
              <span class="label">${a.label}</span>${a.tag?g`<span class="tag">${a.tag}</span>`:w}<span
                class="sub ${a.warn?"warn":""}"
                >${a.sub}</span
              >
            </div>`)}
          ${e.empties.map(a=>g`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>g`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(a=>g`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${Se(e.bands,a=>a.key,a=>g`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${Se(e.busy,a=>a.key,a=>g`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${Se(e.windows,a=>a.key,a=>g`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${Se(d,a=>a.x.key,a=>{if(a.t==="link"){let b=a.x;return g`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-color:${b.color.color};background:linear-gradient(rgba(${b.color.rgb},0.11), rgba(${b.color.rgb},0.11)), var(--surface)"
                ></div>`}if(a.t==="prep"){let b=a.x;return g`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-color:${b.color.color};background:linear-gradient(rgba(${b.color.rgb},0.11), rgba(${b.color.rgb},0.11)), var(--surface);color:${b.color.ink}"
                >
                  ${b.label}
                </div>`}if(a.t==="ride"){let b=a.x;return g`<button
                  type="button"
                  class="ride ${b.dashed?"dashed":""} ${b.clash?"clash":""}"
                  aria-label=${b.aria}
                  style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;padding-top:${3+(b.tuckTop??0)}px;padding-bottom:${3+(b.tuckBottom??0)}px"
                  @click=${()=>this.open(b.target)}
                >
                  <span class="l1">${b.l1}</span>${b.show2?g`<span class="l2" style="-webkit-line-clamp:${b.lines2}">${b.l2}</span>`:w}
                </button>`}let c=a.x,p=c.color,m=c.skipped?`repeating-linear-gradient(135deg, rgba(${p.rgb},0.10) 0px, rgba(${p.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:c.stayed?`repeating-linear-gradient(135deg, rgba(${p.rgb},0.24) 0px, rgba(${p.rgb},0.24) 6px, rgba(${p.rgb},0.08) 6px, rgba(${p.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${p.rgb},0.15), rgba(${p.rgb},0.15)), var(--surface)`;return g`<button
                type="button"
                class="card ${c.wrap?"wrap":""} ${o(c.target)?"sel":""} ${c.clash?"clash":""} ${c.skipped?"skipped":""}"
                aria-label=${c.aria}
                style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px;background:${m};border-color:${c.clash?"var(--bad)":`rgba(${p.rgb},0.45)`};--c:${p.color};--rgb:${p.rgb};--ring:${p.color}"
                @click=${()=>this.open(c.target)}
              >
                <span class="top">
                  <span class="title">${c.title}</span>
                  <span class="time">${c.time}</span>
                  ${c.showDrop&&c.drop?g`<span class="line tone-${c.drop.tone}">${c.drop.text}</span>`:w}
                </span>
                ${c.showPick&&c.pick?g`<span class="line tone-${c.pick.tone}">${c.pick.text}</span>`:w}
              </button>`})}
          ${Se(e.stays,a=>a.key,a=>g`<button
                type="button"
                class="stay"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${Se(e.trips,a=>a.key,a=>g`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(c=>g`<span class="kid-dot" style="background:${c}"></span>`)}</span>
                ${a.show2?g`<span class="l2">${a.l2}</span>`:w}
                ${a.stops?a.stops.map(c=>g`<span class="stop ${c.warn?"warn":""}">${c.text}</span>`):w}
                ${a.show3?g`<span class="l3">${a.l3}</span>`:w}
              </button>`)}
          ${Se(e.overlaps,a=>a.key,a=>g`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${Se(e.marks,a=>a.key,a=>g`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${e.now?g`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:w}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,l=this.plan,d=i+n.length,a=this.chores,c=!!a&&!Un(a);return g`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${d?"bad":"ok"}">${d}</span>
        ${this.wide?w:g`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${c?g`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?g`<div class="attn-chores">${n.map(p=>this.renderChoreRow(p,!0))}</div>`:g`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:g`<p class="panel-sub">Rides in the next two days</p>`}
      ${l&&!i?g`<div class="all-clear">
            <span class="check" aria-hidden="true">${ee`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${pn(l)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:w}
      ${o.map(p=>g`<div class="issue ${p.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${p.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${p.target?g`<button type="button" class="issue-title" @click=${()=>this.open(p.target,!0)}>${p.title}</button>`:g`<strong class="issue-title">${p.title}</strong>`}
              <span class="issue-body"
                >${p.parts?p.parts.map(m=>typeof m=="string"?m:g`<button type="button" class="issue-link" @click=${()=>this.open(m.target,!0)}>${m.text}</button>`):p.body}</span
              >
            </div>
          </div>
          ${p.suggestions.length?g`<div class="fixes">
                ${p.suggestions.map(m=>g`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(m.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${m.id}`?"Saving…":m.label}</span>
                    <span class="fix-note">${m.note}</span>
                  </button>`)}
              </div>`:w}
        </div>`)}
      ${this.wide&&l&&!pn(l)&&this.page==="rides"?this.renderLegend():w}
    `}kidColorOf(e){let n=this.plan?le(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return Q(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(a=>a.id===e);if(!o||!i)return w;this.tick;let r=this.today(),l=Di(i,r.date,r.minutes,this.lunchDraft);if(!l)return w;let d=$t[l.lunch];return g`<span class="lunch-chip ${l.lunch} ${n?"small":""}" title=${`${d} lunch ${l.when}${l.menu?`: ${l.menu}`:""}`}
      >${l.lunch==="bring"?bo:vo}<span class="lunch-chip-text"
        >${d}${n?w:` ${l.when}`}${!n&&l.menu?g`<span class="lunch-chip-menu"> · ${l.menu}</span>`:w}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return g`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return g`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Si(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:be(e.today),i=n.indexOf(o),r=c=>{let p=n[i+c];p&&(this.lunchMonth=p)},l=e.kids.some(c=>c.id===this.lunchKid)?this.lunchKid:null,d=l?e.kids.filter(c=>c.id===l):e.kids,a=e.status&&!e.status.ok?g`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:w;return g`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${ee`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${en(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${ee`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":g`${fo} Edit menus`}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),l=Ai(e,n,o,this.lunchDraft),d=Mi(l),a=l.flat(),c=a.filter(f=>!f.outside&&!f.past&&f.lunch),p=n.days_off.filter(f=>be(f.first)<=o&&o<=be(f.last)),m=f=>c.filter(x=>Qt(x.date)===f),b=f=>{let x=m(f);if(!x.length)return;let $=x.every(v=>v.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,x.map(v=>v.date),$)},E=c.length?`${d.bring} Bring · ${d.buy} Buy${o===be(e.today)?" left this month":""}`:"No school days left this month";return g`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${xe(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${E}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${$t[n.default]} unless picked</span>
          ${e.kids.length<2?w:g`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?Va:Ka}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?g`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:w}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${en(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((f,x)=>g`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!m(x).length}
            aria-label=${`${m(x).every($=>$.lunch==="bring")?"Buy":"Bring"} every ${f} left in ${en(o)} for ${n.name}`}
            @click=${()=>b(x)}
          >
            ${f}
          </button>`)}
        ${a.map(f=>this.renderLunchCell(n,f,i))}
      </div>
      ${p.length?g`<p class="lunch-offs">
            No school:
            ${p.map(f=>{let x=f.first<`${o}-01`?`${o}-01`:f.first,$=be(f.last)>o?tt(`${Yn(o)}-01`,-1):f.last;return`${x===$?ms(x):`${ms(x)}–${ms($)}`} ${Pi(f.title)}`}).join(" · ")}
          </p>`:w}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return g`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return g`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",l=n.menu?`, ${n.menu}`:"",d=this.menuMode,a=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),c=d?`${e.name}, ${ge(n.date)}${l||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${ge(n.date)}: ${$t[i]}${n.picked?"":" (not picked yet)"}${l}. Tap to ${$t[r]}.`;return g`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${d?"editing":""} ${a?"sel":""}"
      ?disabled=${n.past&&!d}
      aria-label=${c}
      @click=${()=>d?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?bo:vo}${$t[i]}</span>
      ${n.menu?g`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?g`<span class="lunch-sides">${n.sides}</span>`:w}`:d?g`<span class="lunch-menu add">${cn} Menu</span>`:w}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex($=>$.id===e.kid),l=(this.plan?le(this.plan).get(e.kid):void 0)??Q(Math.max(0,r)),d=o.kids[r]?.name??"",a=i===et(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},c=i&&a.done_by&&a.done_by!==e.kid?o.people?.find($=>$.id===a.done_by)?.name??a.done_by_name??null:null,p=`${Nn(a,o.today,o.time_zone)}${c?` · by ${c}`:""}`,m=i||yi(e),b=`${n?`${d}: `:""}${e.title}. ${p?`${p}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,E=g`<span class="box" aria-hidden="true"
        >${i?ee`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:w}</span
      >
      ${e.icon?g`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:w}
      <span class="chore-text">
        <span class="chore-title">${n?g`<span class="chore-kid">${d}</span> · `:w}${e.title}</span>
        ${p?g`<span class="chore-note">${p}</span>`:w}
      </span>`,f=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${m?"":"later"}`,x=`--c:${l.color};--rgb:${l.rgb};--k:${l.ink}`;return m?g`<button type="button" class=${f} style=${x} aria-pressed=${i?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${E}
        </button>`:g`<div class=${f} style=${x}>${E}</div>`}renderChores(){let e=this.chores;if(e===void 0)return g`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return g`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return g`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return g`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Un(e))return g`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${cn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?g`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:w;this.tick;let i=wi(e,this.plan?le(this.plan):void 0,this.today().minutes);return g`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${cn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${fo} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let l=r.overdue.filter(d=>!this.choreDone(d)).length+r.now.filter(d=>!this.choreDone(d)).length;return g`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${xe(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${l?`${l} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?g`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(d=>this.renderChoreRow(d))}`:w}
            ${r.now.length?g`<h3 class="chore-group">To do</h3>
                  ${r.now.map(d=>this.renderChoreRow(d))}`:w}
            ${r.done.length?g`<h3 class="chore-group">Done</h3>
                  ${r.done.map(d=>this.renderChoreRow(d))}`:w}
            ${r.later.map(d=>g`<h3 class="chore-group">${d.date===e.today?"Later today":qa(d.date,e.today)}</h3>
                ${d.chores.map(a=>this.renderChoreRow(a))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?g`<p class="chore-none">No chores this week.</p>`:w}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?le(this.plan):void 0,r=this.choreEdit?.template===e.id,l=e.problems.length?g`<span class="tmpl-note bad">${e.problems.map(qn).join(" · ")} · tap to set up</span>`:g`<span class="tmpl-note">${Gn(e.who,o,e.take_turns)} · ${Vn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return g`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?g` <span class="tag-paused">Paused</span>`:w}</span>
        ${l}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(d=>{let a=o.findIndex(p=>p.id===d),c=i?.get(d)??Q(Math.max(0,a));return g`<span class="kid-dot" style="background:${c.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return g`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${cn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(l=>l.repeats===o);return r.length?g`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(l=>this.renderTemplateRow(l))}</div>
                </section>`:w}):g`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return g``;let o=n.kids,i=this.plan?le(this.plan):void 0,r=this.choreBusy,l=e.template?n.templates.find(f=>f.id===e.template):void 0,d=Wn(e),a=(l?.problems??[]).filter(f=>f!=="who:"),c=(f,x,$,v=!1)=>g`<button type="button" class="choice ${v?"wide":""}" aria-pressed=${f?"true":"false"} ?disabled=${r} @click=${$}>${x}</button>`,p=(f,x,$,v)=>g`<button type="button" class="chip" aria-pressed=${f?"true":"false"} aria-label=${v??w} ?disabled=${r} @click=${$}>${x}</button>`,m=f=>{f!==e.repeats&&this.changeDraft({repeats:f,days:l&&l.repeats===f?l.days??Zt(f):Zt(f)})},b=f=>{let x=e.who.includes(f)?e.who.filter($=>$!==f):o.filter($=>$.id===f||e.who.includes($.id)).map($=>$.id);this.changeDraft({who:x})},E;if(e.repeats==="school"){let f=e.days===Ke?new Set:e.days===""?new Set([0,1,2,3,4]):Hn(e.days)??new Set,x=$=>{let v=new Set(f);v.has($)?v.delete($):v.add($),this.changeDraft({days:v.size===5?"":v.size?Fn(v):Ke})};E=g`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${We.slice(0,5).map(($,v)=>p(f.has(v),$.slice(0,2),()=>x(v),$))}
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
        </div>`}else if(e.repeats==="monthly"){let f=e.days.trim(),x=/^\d+$/.test(f)?Number(f):null,$=f&&f.toLowerCase()!=="any"&&f.toLowerCase()!=="last"&&x===null;E=g`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${$?4:3}, minmax(0, 1fr))">
          ${c(f===""||f.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${c(x!==null,"On a date",()=>this.changeDraft({days:String(x??1)}))}
          ${c(f.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${$?c(!0,f,()=>{}):w}
        </div>
        ${x!==null?g`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||x<=1} @click=${()=>this.changeDraft({days:String(x-1)})}>−</button>
                <span class="arrive-value">${Kn(x)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||x>=31} @click=${()=>this.changeDraft({days:String(x+1)})}>+</button>
              </span>
            </div>`:g`<p class="field-hint">${f.toLowerCase()==="last"?"Due on the month’s last day.":$?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")E=g`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let f=e.days===""||e.days.toLowerCase()==="any",x=e.days===Ke?new Set:f?new Set:Hn(e.days)??new Set,$=v=>{let P=new Set(x);P.has(v)?P.delete(v):P.add(v),this.changeDraft({days:P.size?Fn(P)||"Mon-Sun":Ke})};E=g`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${c(f,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${c(!f,"On set days",()=>this.changeDraft({days:f?"Sat":e.days}))}
        </div>
        ${f?g`<p class="field-hint">Shows all week, due on Sunday.</p>`:g`<div role="group" aria-label="Days of the week" class="day-chips">
                ${We.map((v,P)=>p(x.has(P),v.slice(0,2),()=>$(P),v))}
              </div>
              <div class="chips">
                ${p(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${p(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return g`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?g`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Gn(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===Ke?"No days picked":Vn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${a.length?g`<p class="field-hint bad">${a.map(qn).join(". ")}. Saving fixes it.</p>`:w}
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
          ${mo.map(f=>p(e.icon===f,f,()=>this.changeDraft({icon:e.icon===f?null:f}),`Picture ${f}`))}
          ${e.icon&&!mo.includes(e.icon)?p(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):w}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?g`<emoji-picker
              class="emoji-more"
              .dataSource=${Wa}
              @emoji-click=${f=>{let x=f.detail.unicode;x&&this.changeDraft({icon:x}),this.iconMore=!1}}
            ></emoji-picker>`:w}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((f,x)=>{let $=i?.get(f.id)??Q(x),v=e.who.includes(f.id);return g`<button type="button" class="who-chip" style="--c:${$.color};--rgb:${$.rgb}" aria-pressed=${v?"true":"false"} ?disabled=${r} @click=${()=>b(f.id)}>
              <span class="avatar" aria-hidden="true">${xe(f.name)}</span>${f.name}
            </button>`})}
        </div>
        ${e.who.length>1?g`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${c(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${c(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:w}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${c(e.repeats==="daily","Every day",()=>m("daily"))}
          ${c(e.repeats==="weekly","Every week",()=>m("weekly"))}
          ${c(e.repeats==="monthly","Every month",()=>m("monthly"))}
          ${c(e.repeats==="school","School days",()=>m("school"))}
        </div>
      </div>
      ${E}
      ${e.repeats==="school"?w:g`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Ga(e.repeats,e.every)}</span>
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
      ${e.template?g`<div class="field">
              ${c(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!d} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":d?d.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return g``;let o=e.busy,i=c=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...c})},r=c=>i({kids:e.kids.includes(c)?e.kids.filter(p=>p!==c):[...e.kids,c]}),l=n.kids.filter(c=>xt(c,e.date)),d=e.dish.trim(),a=e.kids.length?d?null:"Type what’s served":"Pick who gets this menu";return g`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${ge(e.date)}</span>
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
          ${l.map(c=>{let p=this.kidColorOf(c.id),m=e.kids.includes(c.id);return g`<button type="button" class="who-chip" style="--c:${p.color};--rgb:${p.rgb}" aria-pressed=${m?"true":"false"} ?disabled=${o} @click=${()=>r(c.id)}>
              <span class="avatar" aria-hidden="true">${xe(c.name)}</span>${c.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${d||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?g`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!a} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":a??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return g``;let o=n.people?.length?n.people:n.kids.map(p=>({...p,role:"kid"})),i=n.kids.findIndex(p=>p.id===e.kid),r=n.kids[i],l=this.plan?le(this.plan):void 0,d=l?.get(e.kid)??Q(Math.max(0,i)),a=o.filter(p=>p.id!==e.kid),c=p=>{let m=n.kids.findIndex(b=>b.id===p.id);return m>=0?(l?.get(p.id)??Q(m)).color:"var(--dark)"};return g`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?g`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Nn(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${d.color};--rgb:${d.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${xe(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?g`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${a.map(p=>g`<button type="button" class="done-by" style="--c:${c(p)}" @click=${()=>void this.toggleChore(e,p.id)}>
                  <span class="avatar ${p.role==="parent"?"driver":""}" aria-hidden="true">${xe(p.name)}</span>
                  <span>${p.name}</span>
                </button>`)}
            </div>`:g`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return g`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let o=Yt(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${L(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${L(n.start)} to ${L(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>Pe(e).includes(r)?ie(e,r):de(e,r));return`${o} drives there and back${i.length?`, with ${Rn(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return g``;let{day:o,event:i}=n,r=Pe(e),l=di(e,i),d=Yt(e,i),a=!!this.pending,c=A=>this.pending?.key===A?this.pending.value:void 0,p=[...e.people?.carpools??[]];for(let A of e.days)for(let q of A.events)for(let I of[q.drop,q.pick])I&&I!=="none"&&!r.includes(I)&&!p.some(oe=>oe.toLowerCase()===I.toLowerCase())&&p.push(I);let m=A=>{if(!i.sides.includes(A))return w;let q=c(A),I=q!==void 0?String(q):A==="drop"?i.drop:i.pick,oe=I&&I!=="none"&&!r.includes(I)?I:"",he=u=>this.setRide(i,A,I===u?"":u),re=[...r.map(u=>[u,jn(e,u)]),["none","Not needed"]];return g`<div class="field">
        <span class="field-label">${A==="drop"?"Drop-off":"Pick-up"} ${I===""?g`<span class="nobody">· nobody yet</span>`:w}</span>
        <div role="group" aria-label=${A==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${re.length}, minmax(0, 1fr))">
          ${re.map(([u,C])=>g`<button type="button" class="choice" aria-pressed=${I===u?"true":"false"} ?disabled=${a} @click=${()=>he(u)}>
                ${C}
              </button>`)}
        </div>
        ${p.length?g`<div role="group" aria-label=${A==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${p.map(u=>g`<button type="button" class="chip" aria-pressed=${I.toLowerCase()===u.toLowerCase()?"true":"false"} ?disabled=${a} @click=${()=>he(u)}>
                    ${u}
                  </button>`)}
            </div>`:w}
        <input
          type="text"
          .value=${oe&&!p.some(u=>u.toLowerCase()===oe.toLowerCase())?oe:""}
          ?disabled=${a}
          aria-label=${A==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${u=>{let C=u.target.value.trim();C&&C!==I&&this.setRide(i,A,C)}}
          @keydown=${u=>{u.key==="Enter"&&u.target.blur()}}
        />
        ${!f&&I!==""&&I!=="none"?b(A,I):w}
      </div>`},b=(A,q)=>{let I=c(`along-${A}`),oe=I!==void 0?I:A==="pick"?i.pick_along??[]:i.along,he=[...Ae(e).filter(u=>u!==i.kid),...r.filter(u=>u!==q)];return he.length?g`<div class="field-sub">
        <span class="field-label">${A==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${A==="pick"?"They come for the pick-up":"They leave home in the same car"}</span></span>
        <div role="group" aria-label=${A==="drop"?"Riding along on the drop-off":A==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${he.map(u=>g`<button type="button" class="chip" aria-pressed=${oe.includes(u)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,u,A)}>
              ${r.includes(u)?ie(e,u):de(e,u)}
            </button>`)}
        </div>
      </div>`:w},E=c("stay"),f=E!==void 0?!!E:i.stay,x=i.drop===i.pick&&r.includes(i.drop),$=c("along"),v=$!==void 0?$:i.along,P=i.own?[...Ae(e),...r.filter(A=>A!==i.own)]:[],U=i.own!=null&&i.takes!=null,z=i.own!=null&&!U,ne=c("takes"),Z=ne!==void 0?ne:i.takes??null,ye=c("arrive"),pe=this.arriveDraft!==void 0?this.arriveDraft:ye!==void 0?ye:i.arrive_by,J=[],Xe=A=>A==="none"?"Not needed":jn(e,A),we=A=>r.includes(A)?ie(e,A):de(e,A),De=(A,q,I)=>{q===""&&!I.length||J.push(`${A}: ${[q===""?"TBD":Xe(q),...I.map(we)].join(", ")}`)};i.own||De("Drop-off",i.drop,i.along),i.own||De("Pick-up",i.pick,i.pick_along??[]),!i.own&&i.stay&&J.push("Stay: yes"),U&&J.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&J.push(`Take along: ${i.along.map(we).join(", ")}`),i.arrive_by!=null&&J.push(`Arrive by: ${Ue(i.arrive_by)}`);let $e=c("attending"),ke=$e!==void 0?!!$e:i.attending!==!1;i.attending===!1&&J.splice(0,J.length,"Attending: no");let je=o.date===this.today().date?"":`${se(o.date)} · `,Ee=g`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${d} · ${i.title}</span>
          <span class="ed-meta">${je}${U?"any time ":""}${L(i.start)}–${L(i.end)}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return i.where==="home"?g`${Ee}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${d} can’t get home in time, the board shows it as a clash.</p>`:g`
      ${Ee}
      ${this.pending?g`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
      ${i.recurring?g`<div class="field">
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
      <div class="field">
        <span class="field-label">${d} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${ke?"true":"false"} ?disabled=${a} @click=${()=>this.setAttending(i,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${ke?"false":"true"} ?disabled=${a} @click=${()=>this.setAttending(i,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${ke?g`${i.where==="anywhere"?g`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:w}
            ${i.own?g`<p class="field-hint">${this.ownHint(e,i)}</p>`:g`${m("drop")} ${m("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${f?"true":"false"} ?disabled=${!x||a} @click=${()=>this.toggleStay(i)}>
                      ${x?f?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                    ${f&&x?b("both",i.drop):w}
                  </div>`}
      ${i.own?g`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${Z!=null?`Takes ${Z} min, any time ${L(i.start)}–${L(i.end)}`:"At its set time"}</span>
            </span>
            ${Z!=null?g`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${a||Z<=5} @click=${()=>this.setTakes(i,Math.max(5,Z-5))}>−</button>
                  <span class="arrive-value">${Z} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${a||Z+5>i.end-i.start} @click=${()=>this.setTakes(i,Z+5)}>+</button>
                </span>`:w}
          </div>
          <button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.setTakes(i,Z!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${Z!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:w}
      ${z&&P.length?g`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${P.map(A=>g`<button type="button" class="chip" aria-pressed=${v.includes(A)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(i,A)}>
                  ${r.includes(A)?ie(e,A):de(e,A)}
                </button>`)}
            </div>
          </div>`:w}
      ${U?w:g`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${pe!=null?`${i.start-pe} min before it starts`:`Aims for a few minutes before ${L(i.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${a} @click=${()=>this.nudgeArrive(i,-5)}>−</button>
          <span class="arrive-value">${pe!=null?L(pe):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${a||pe==null} @click=${()=>this.nudgeArrive(i,5)}>+</button>
        </span>
      </div>
      ${pe!=null?g`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:w}`}
`:g`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${J.length?J.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${i.problems.length?g`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:w}
      ${ke&&!i.own?g`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:w}
    `}};kt.styles=Li,kt.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",kt);var Et=class extends ce{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=Fs(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(gt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new Bt(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return g`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?g`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:w}`}};Et.styles=Re`
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
  `,Et.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",Et);
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
