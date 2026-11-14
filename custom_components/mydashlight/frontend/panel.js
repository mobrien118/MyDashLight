var Bo=Object.defineProperty;var Tn=(s,t)=>()=>(s&&(t=s(s=0)),t);var Oo=(s,t)=>{for(var e in t)Bo(s,e,{get:t[e],enumerable:!0})};function un(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function ds(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Or(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function eo(s){return Or(s,t=>t.unicode)}function Nr(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[d,l]]of Object.entries(o))i.createIndex(r,d,{multiEntry:l});return i}t(ut),t(Ze,Lr,{[no]:[Dr,!0],[io]:[[Rr,jr]],[oo]:[Ir,!0]}),t(us,void 0,{[so]:[""]})}function ro(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Hr(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,Ar);hs[s]=o,o.onupgradeneeded=i=>{i.oldVersion<Mr&&Nr(o.result)},ro(e,n,o)});return t.onclose=()=>gs(s),t}function Ur(s){return gn[s]||(gn[s]=Hr(s)),gn[s]}function Me(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),d=typeof t=="string"?r.objectStore(t):t.map(p=>r.objectStore(p)),l;n(d,r,p=>{l=p}),r.oncomplete=()=>o(l),r.onerror=()=>i(r.error)})}function gs(s){let t=hs[s],e=t&&t.result;if(e){e.close();let n=bn[s];if(n)for(let o of n)o()}delete hs[s],delete gn[s],delete bn[s]}function Fr(s){return new Promise((t,e)=>{gs(s);let n=indexedDB.deleteDatabase(s);ro(t,e,n)})}function Wr(s,t){let e=bn[s];e||(e=bn[s]=[]),e.push(t)}function pt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||Kr.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function ao(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Vr)}function Gr(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:d,tags:l,emoji:p,version:c})=>{let a=[...new Set(ao([...(r||[]).map(pt).flat(),...(l||[]).map(pt).flat(),...pt(e),n]))].sort(),f={annotation:e,group:o,order:i,tags:l,tokens:a,unicode:p,version:c};if(n&&(f.emoticon=n),r&&(f.shortcodes=r),d){f.skinTones=[],f.skinUnicodes=[],f.skinVersions=[];for(let{tone:v,emoji:P,version:g}of d)f.skinTones.push(v),f.skinUnicodes.push(P),f.skinVersions.push(g)}return f})}function lo(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function Xe(s,t,e){lo(s,"get",t,e)}function co(s,t,e){lo(s,"getAll",t,e)}function ms(s){s.commit&&s.commit()}function qr(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function ho(s,t){let e=qr(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Yr(s){return!await bs(s,ut,mn)}async function Xr(s,t,e){let[n,o]=await Promise.all([cs,mn].map(i=>bs(s,ut,i)));return n===e&&o===t}async function Zr(s,t){return Me(s,Ze,gt,(n,o,i)=>{let r,d=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=l=>{let p=l.target.result;for(let c of p)if(r=c.unicode,t(c))return i(c);if(p.length<50)return i();d()}};d()})}async function po(s,t,e,n){try{let o=Gr(t);await Me(s,[Ze,ut],fs,([i,r],d)=>{let l,p,c=0;function a(){++c===2&&f()}function f(){if(!(l===n&&p===e)){i.clear();for(let v of o)i.put(v);r.put(n,cs),r.put(e,mn),ms(d)}}Xe(r,cs,v=>{l=v,a()}),Xe(r,mn,v=>{p=v,a()})})}finally{}}async function Jr(s,t){return Me(s,Ze,gt,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);co(e.index(io),i,o)})}async function uo(s,t){let e=ao(pt(t));return e.length?Me(s,Ze,gt,(n,o,i)=>{let r=[],d=()=>{r.length===e.length&&l()},l=()=>{let p=ho(r,c=>c.unicode);i(p.sort((c,a)=>c.order<a.order?-1:1))};for(let p=0;p<e.length;p++){let c=e[p],a=p===e.length-1?IDBKeyRange.bound(c,c+"￿",!1,!0):IDBKeyRange.only(c);co(n.index(no),a,f=>{r.push(f),d()})}}):[]}async function Qr(s,t){let e=await uo(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Zr(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function ea(s,t){return Me(s,Ze,gt,(e,n,o)=>Xe(e,t,i=>{if(i)return o(i);Xe(e.index(oo),t,r=>o(r||null))}))}function bs(s,t,e){return Me(s,t,gt,(n,o,i)=>Xe(n,e,i))}function ta(s,t,e,n){return Me(s,t,fs,(o,i)=>{o.put(n,e),ms(i)})}function na(s,t){return Me(s,us,fs,(e,n)=>Xe(e,t,o=>{e.put((o||0)+1,t),ms(n)}))}function sa(s,t,e){return e===0?[]:Me(s,[us,Ze],gt,([n,o],i,r)=>{let d=[];n.index(so).openCursor(void 0,"prev").onsuccess=l=>{let p=l.target.result;if(!p)return r(d);function c(v){if(d.push(v),d.length===e)return r(d);p.continue()}let a=p.primaryKey,f=t.byName(a);if(f)return c(f);Xe(o,a,v=>{if(v)return c(v);p.continue()})}})}function ia(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let d=e;for(let p=0;p<r.length;p++){let c=r.charAt(p),a=d.get(c);a||(a=new Map,d.set(c,a)),d=a}let l=d.get(fn);l||(l=[],d.set(fn,l)),l.push(o)}}return(o,i)=>{let r=e;for(let p=0;p<o.length;p++){let c=o.charAt(p),a=r.get(c);if(a)r=a;else return[]}if(i)return r.get(fn)||[];let d=[],l=[r];for(;l.length;){let c=[...l.shift().entries()].sort((a,f)=>a[0]<f[0]?-1:1);for(let[a,f]of c)a===fn?d.push(...f):l.push(f)}return d}}function ra(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||oa.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function to(s){ra(s);let t=(f,v)=>f.name.toLowerCase()<v.name.toLowerCase()?-1:1,e=s.sort(t),o=ia(s,f=>{let v=new Set;if(f.shortcodes)for(let P of f.shortcodes)for(let g of pt(P))v.add(g);return v}),i=f=>o(f,!0),r=f=>o(f,!1),d=f=>{let v=pt(f),P=v.map((g,$)=>($<v.length-1?i:r)(g));return ho(P,g=>g.name).sort(t)},l=new Map,p=new Map;for(let f of s){p.set(f.name.toLowerCase(),f);for(let v of f.shortcodes||[])l.set(v.toLowerCase(),f)}return{all:e,search:d,byShortcode:f=>l.get(f.toLowerCase()),byName:f=>p.get(f.toLowerCase())}}function Dt(s){if(!s)return s;if(aa&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function fo(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function da(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||la.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function go(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function ca(s){let t=await fetch(s,{method:"HEAD"});go(t,s);let e=t.headers.get("etag");return fo(e),e}async function ps(s){let t=await fetch(s);go(t,s);let e=t.headers.get("etag");fo(e);let n=await t.json();return da(n),[e,n]}function ha(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function pa(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function mo(s){let t=JSON.stringify(s),e=pa(t),n=await crypto.subtle.digest("SHA-1",e),o=ha(n);return btoa(o)}async function ua(s,t){let e,n=await ca(t);if(!n){let o=await ps(t);n=o[0],e=o[1],n||(n=await mo(e))}await Xr(s,t,n)||(e||(e=(await ps(t))[1]),await po(s,e,t,n))}async function fa(s,t){let[e,n]=await ps(t);e||(e=await mo(n)),await po(s,n,t,e)}async function ga(s,t){try{await ua(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var Ar,Mr,Ze,ut,us,Dr,no,Lr,so,Rr,jr,io,cs,mn,Qi,gt,fs,oo,Ir,zr,Br,hs,gn,bn,Kr,Vr,fn,oa,aa,la,ft,vs=Tn(()=>{Ar=1,Mr=1,Ze="emoji",ut="keyvalue",us="favorites",Dr="tokens",no="tokens",Lr="unicode",so="count",Rr="group",jr="order",io="group-order",cs="eTag",mn="url",Qi="skinTone",gt="readonly",fs="readwrite",oo="skinUnicodes",Ir="skinUnicodes",zr="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Br="en";hs={},gn={},bn={};Kr=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Vr=2;fn="";oa=["name","url"];aa=typeof wrappedJSObject<"u";la=["annotation","emoji","group","order","version"];ft=class{constructor({dataSource:t=zr,locale:e=Br,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=to(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Ur(this._dbName);Wr(this._dbName,this._clear);let e=this.dataSource;await Yr(t)?await fa(t,e):this._lazyUpdate=ga(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return ds(t),await this.ready(),eo(await Jr(this._db,t)).map(Dt)}async getEmojiBySearchQuery(t){un(t),await this.ready();let e=this._custom.search(t),n=eo(await uo(this._db,t)).map(Dt);return[...e,...n]}async getEmojiByShortcode(t){un(t),await this.ready();let e=this._custom.byShortcode(t);return e||Dt(await Qr(this._db,t))}async getEmojiByUnicodeOrName(t){un(t),await this.ready();let e=this._custom.byName(t);return e||Dt(await ea(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await bs(this._db,ut,Qi)||0}async setPreferredSkinTone(t){return ds(t),await this.ready(),ta(this._db,ut,Qi,t)}async incrementFavoriteEmojiCount(t){return un(t),await this.ready(),na(this._db,t)}async getTopFavoriteEmoji(t){return ds(t),await this.ready(),(await sa(this._db,this._custom,t)).map(Dt)}set customEmoji(t){this._custom=to(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await gs(this._dbName)}async delete(){await this._shutdown(),await Fr(this._dbName)}}});function vo(s){return s.unicode.includes("‍")}function Ta(s){let t=yo(s,"#000"),e=yo(s,"#fff");return t&&e&&ka(t,e)}function Ea(){let s=Object.entries(ba);try{for(let[t,e]of s)if(Ta(t))return e}catch{}finally{}return s[0][1]}function Ma(s,t){if(t===0)return s;let e=s.indexOf(Pa);return e!==-1?s.substring(0,e)+String.fromCodePoint(Sa+t-1)+s.substring(e):(s.endsWith(_a)&&(s=s.substring(0,s.length-1)),s+Ca+String.fromCodePoint(Aa+t-1))}function Te(s){s.preventDefault(),s.stopPropagation()}function $s(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Po(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Da(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:d,category:l,annotation:p})=>({unicode:n,name:d,shortcodes:i,url:r,category:l,annotation:p,id:n||d,skins:o&&e(o)}))}function Ra(s,t,e){let n;La?(n=new ResizeObserver(e),n.observe(s)):yn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function xo(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function wo(s,t,e){let n=xo(t);if(!n){if(!Je){Je=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])Je.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(Je),Je.firstChild.nodeValue=s,xo(Je)}finally{Je.remove()}}return n}function Ia(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof ks>"u"&&(ks=wo(ja,t,t));let d=wo(o.unicode,i,t)/1.8<ks;Cs.set(o.unicode,d),d||(n=!1)}return n}function za(s){return Po(s,t=>t)}function Ba(s){s&&(s.scrollTop=0)}function Lt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function $o(s){return""+s}function Oa(s){let t=document.createElement("template");return t.innerHTML=s,t}function Wa(s,t){Fa?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function Ka(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Va(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Ka(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&Wa(n,s)}function Ga(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:d,attributeValuePost:l}}=e,p=s[i];if(o!==p)if(e.currentExpression=p,r)if(p===null)n.removeAttribute(r);else{let c=d+$o(p)+l;n.setAttribute(r,c)}else{let c;Array.isArray(p)?Va(p,e):p instanceof Element?(c=p,n.replaceWith(c)):n.nodeValue=$o(p),c&&(e.targetNode=c)}}}function qa(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],d=0;for(let p=0,c=s.length;p<c;p++){let a=s[p];if(t+=a.slice(d),p===c-1)break;for(let u=0;u<a.length;u++)switch(a.charAt(u)){case"<":{a.charAt(u+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let f=r[r.length-1],v=Lt(i,f,()=>[]),P,g,$;if(n){let u=/(\S+)="?([^"=]*)$/.exec(a);P=u[1],g=u[2];let M=/^([^">]*)("?)/.exec(s[p+1]);$=M[1],t=t.slice(0,-1*u[0].length),d=M[0].length}else d=0;let T={attributeName:P,attributeValuePre:g,attributeValuePost:$,expressionIndex:p};v.push(T),!e&&!n&&(t+=" ")}return{template:Oa(t),elementsToBindings:i}}function ko(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Ya(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))ko(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let d=t.get(++r);d&&ko(d,i,e)}while(i=o.nextNode())}return e}function Xa(s){let{template:t,elementsToBindings:e}=Lt(Na,s,()=>qa(s)),n=t.cloneNode(!0).content.firstElementChild,o=Ya(n,e);return function(r){return Ga(r,o),n}}function Za(s){let t=Lt(Ha,s,()=>new Map),e=Ua;function n(i,...r){let d=Lt(t,i,()=>new Map);return Lt(d,e,()=>Xa(i))(r)}function o(i,r,d){return i.map((l,p)=>{let c=e;e=d(l);try{return r(l,p)}finally{e=c}})}return{map:o,html:n}}function Ja(s,t,e,n,o,i,r,d,l){let{labelWithSkin:p,titleForEmoji:c,unicodeWithSkin:a}=e,{html:f,map:v}=Za(t);function P(u,M,j){return v(u,(U,ee)=>f`<button role="${M?"option":"menuitem"}" aria-selected="${M?ee===t.activeSearchItem:null}" aria-label="${p(U,t.currentSkinTone)}" title="${c(U)}" class="${"emoji"+(M&&ee===t.activeSearchItem?" active":"")+(U.unicode?"":" custom-emoji")}" id="${`${j}-${U.id}`}" style="${U.unicode?null:`--custom-emoji-background: url(${JSON.stringify(U.url)})`}">${U.unicode?a(U,t.currentSkinTone):""}</button>`,U=>`${j}-${U.id}`)}let $=f`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${v(t.skinTones,(u,M)=>f`<div id="skintone-${M}" class="emoji ${M===t.activeSkinTone?"active":""}" aria-selected="${M===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[M]}" aria-label="${t.i18n.skinTones[M]}">${u}</div>`,u=>u)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${v(t.groups,u=>f`<button role="tab" class="nav-button" aria-controls="tab-${u.id}" aria-label="${t.i18n.categories[u.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===u.id}" title="${t.i18n.categories[u.name]}" data-group-id="${u.id}"><div class="nav-emoji emoji">${u.emoji}</div></button>`,u=>u.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${v(t.currentEmojisWithCategories,(u,M)=>f`<div><div id="menu-label-${M}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:u.category?u.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${M!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(u.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${M}" id="${t.searchMode?"search-results":null}">${P(u.emojis,t.searchMode,"emo")}</div></div>`,u=>u.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${P(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,T=(u,M)=>{for(let j of s.querySelectorAll(`[${u}]`))M(j,j.getAttribute(u))};if(l){s.appendChild($);for(let u of["click","focusout","input","keydown","keyup"])T(`data-on-${u}`,(M,j)=>{M.addEventListener(u,n[j])});T("data-ref",(u,M)=>{i[M]=u}),r.addEventListener("abort",()=>{s.removeChild($)})}T("data-action",(u,M)=>{let j=d.get(M);j||d.set(M,j=new WeakSet),j.has(u)||(j.add(u),o[M](u))})}function Qa(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let p=[...o];o.clear();try{for(let c of p)c()}finally{i=!1,o.size&&(i=!0,xn(r))}},d=new Proxy({},{get(p,c){if(e){let a=n.get(c);a||(a=new Set,n.set(c,a)),a.add(e)}return p[c]},set(p,c,a){if(p[c]!==a){p[c]=a;let f=n.get(c);if(f){for(let v of f)o.add(v);i||(i=!0,xn(r))}}return!0}}),l=p=>{let c=()=>{let a=e;e=c;try{return p()}finally{e=a}};return c()};return s.addEventListener("abort",()=>{t=!0}),{state:d,createEffect:l}}function Ts(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function el(s,t,e){{let n=s.closest(".tabpanel"),o=To.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),To.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function tl(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=Qa(o),d=new Map;vn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),vn(i,t),vn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:xa,isRtl:!1,currentGroupIndex:0,groups:ys,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let l=b=>{s.getElementById(b).focus()},p=b=>s.getElementById(`emo-${b.id}`),c=(b,y)=>{e.rootElement.dispatchEvent(new CustomEvent(b,{detail:y,bubbles:!0,composed:!0}))},a=(b,y)=>b.id===y.id,f=(b,y)=>{let{category:k,emojis:E}=b,{category:I,emojis:_}=y;return k!==I?!1:Ts(E,_,a)},v=b=>{Ts(i.currentEmojis,b,a)||(i.currentEmojis=b)},P=b=>{i.searchMode!==b&&(i.searchMode=b)},g=b=>{Ts(i.currentEmojisWithCategories,b,f)||(i.currentEmojisWithCategories=b)},$=(b,y)=>y&&b.skins&&b.skins[y]||b.unicode,M={labelWithSkin:(b,y)=>za([b.name||$(b,y),b.annotation,...b.shortcodes||Es].filter(Boolean)).join(", "),titleForEmoji:b=>b.annotation||(b.shortcodes||Es).join(", "),unicodeWithSkin:$},j={onClickSkinToneButton:re,onEmojiClick:oe,onNavClick:je,onNavKeydown:te,onSearchKeydown:Re,onSkinToneOptionsClick:Oe,onSkinToneOptionsFocusOut:D,onSkinToneOptionsKeydown:m,onSkinToneOptionsKeyup:A,onSearchInput:x},U={calculateEmojiGridStyle:H,updateOnIntersection:De},ee=!0;r(()=>{Ja(s,i,M,j,U,e,o,d,ee),ee=!1}),i.emojiVersion||ws().then(b=>{b||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function b(){let y=!1,k=setTimeout(()=>{y=!0,i.message=i.i18n.loadingMessage},va);try{await i.database.ready(),i.databaseLoaded=!0}catch(E){console.error(E),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(k),y&&(y=!1,i.message="")}}i.database&&b()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${bo};`}),r(()=>{i.customEmoji&&i.database&&le()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==_s&&(i.groups=_s):i.groups!==ys&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=ys)}),r(()=>{async function b(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}b()}),r(()=>{i.skinTones=Array(bo).fill().map((b,y)=>Ma(i.skinToneEmoji,y))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function b(){let{database:y}=i,k=(await Promise.all(wa.map(E=>y.getEmojiByUnicodeOrName(E)))).filter(Boolean);i.defaultFavoriteEmojis=k}i.databaseLoaded&&b()});function le(){let{customEmoji:b,database:y}=i,k=b||Es;y.customEmoji!==k&&(y.customEmoji=k)}r(()=>{async function b(){le();let{database:y,defaultFavoriteEmojis:k,numColumns:E}=i,I=await y.getTopFavoriteEmoji(E),_=await be(Po([...I,...k],L=>L.unicode||L.name).slice(0,E));i.currentFavorites=_}i.databaseLoaded&&i.defaultFavoriteEmojis&&b()});function H(b){Ra(b,o,()=>{{let y=getComputedStyle(e.rootElement),k=parseInt(y.getPropertyValue("--num-columns"),10),E=y.getPropertyValue("direction")==="rtl";i.numColumns=k,i.isRtl=E}})}function De(b){el(b,o,y=>{for(let{target:k,isIntersecting:E}of y)k.classList.toggle("onscreen",E)})}r(()=>{async function b(){let{searchText:y,currentGroup:k,databaseLoaded:E,customEmoji:I}=i;if(!E)i.currentEmojis=[],i.searchMode=!1;else if(y.length>=ma){let _=await Be(y);i.searchText===y&&(v(_),P(!0))}else{let{id:_}=k;if(_!==-1||I&&I.length){let L=await tt(_);i.currentGroup.id===_&&(v(L),P(!1))}}}b()});let de=()=>{yn(()=>Ba(e.tabpanelElement))};r(()=>{let{currentEmojis:b,emojiVersion:y}=i,k=b.filter(E=>E.unicode).filter(E=>vo(E)&&!Cs.has(E.unicode));if(!y&&k.length)v(b),yn(()=>et(k));else{let E=y?b:b.filter(he);v(E),de()}});function et(b){Ia(b,e.baselineEmoji,p)?de():i.currentEmojis=[...i.currentEmojis]}function he(b){return!b.unicode||!vo(b)||Cs.get(b.unicode)}async function Le(b){let y=i.emojiVersion||await ws();return b.filter(({version:k})=>!k||k<=y)}async function be(b){return Da(b,i.emojiVersion||await ws())}async function tt(b){let y=b===-1?i.customEmoji:await i.database.getEmojiByGroup(b);return be(await Le(y))}async function Be(b){return be(await Le(await i.database.getEmojiBySearchQuery(b)))}r(()=>{}),r(()=>{function b(){let{searchMode:k,currentEmojis:E}=i;if(k)return[{category:"",emojis:E}];let I=new Map;for(let _ of E){let L=_.category||"",V=I.get(L);V||(V=[],I.set(L,V)),V.push(_)}return[...I.entries()].map(([_,L])=>({category:_,emojis:L})).sort((_,L)=>i.customCategorySorting(_.category,L.category))}let y=b();g(y)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:b}=i;_o(()=>{i.searchText=(b||"").trim(),i.activeSearchItem=-1})});function Re(b){if(!i.searchMode||!i.currentEmojis.length)return;let y=k=>{Te(b),i.activeSearchItem=$s(k,i.activeSearchItem,i.currentEmojis)};switch(b.key){case"ArrowDown":return y(!1);case"ArrowUp":return y(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Te(b),pe(i.currentEmojis[i.activeSearchItem].id)}}function je(b){let{target:y}=b,k=y.closest(".nav-button");if(!k)return;let E=parseInt(k.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(I=>I.id===E)}function te(b){let{target:y,key:k}=b,E=I=>{I&&(Te(b),I.focus())};switch(k){case"ArrowLeft":return E(y.previousElementSibling);case"ArrowRight":return E(y.nextElementSibling);case"Home":return E(y.parentElement.firstElementChild);case"End":return E(y.parentElement.lastElementChild)}}async function q(b){let y=await i.database.getEmojiByUnicodeOrName(b),k=[...i.currentEmojis,...i.currentFavorites].find(I=>I.id===b),E=k.unicode&&$(k,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(b),{emoji:y,skinTone:i.currentSkinTone,...E&&{unicode:E},...k.name&&{name:k.name}}}async function pe(b){let y=q(b);c("emoji-click-sync",y),c("emoji-click",await y)}function oe(b){let{target:y}=b;if(!y.classList.contains("emoji"))return;Te(b);let k=y.id.substring(4);pe(k)}function Ee(b){i.currentSkinTone=b,i.skinTonePickerExpanded=!1,l("skintone-button"),c("skin-tone-change",{skinTone:b}),i.database.setPreferredSkinTone(b)}function Oe(b){let{target:{id:y}}=b,k=y&&y.match(/^skintone-(\d)/);if(!k)return;Te(b);let E=parseInt(k[1],10);Ee(E)}function re(b){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Te(b),yn(()=>l("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function m(b){if(!i.skinTonePickerExpanded)return;let y=async k=>{Te(b),i.activeSkinTone=k};switch(b.key){case"ArrowUp":return y($s(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return y($s(!1,i.activeSkinTone,i.skinTones));case"Home":return y(0);case"End":return y(i.skinTones.length-1);case"Enter":return Te(b),Ee(i.activeSkinTone);case"Escape":return Te(b),i.skinTonePickerExpanded=!1,l("skintone-button")}}function A(b){if(i.skinTonePickerExpanded)switch(b.key){case" ":return Te(b),Ee(i.activeSkinTone)}}async function D(b){let{relatedTarget:y}=b;(!y||y.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function x(b){i.rawSearchText=b.target.value}return{$set(b){vn(i,b)},$destroy(){n.abort()}}}function Eo(s){s instanceof Qe||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var _s,ys,ma,bo,_o,ba,va,ya,xa,wa,Co,$a,yo,ka,xs,ws,Cs,_a,Ca,Pa,Sa,Aa,yn,La,ja,ks,Je,Na,Ha,Ua,Fa,xn,To,Es,vn,nl,sl,il,ol,So,rl,Qe,Ao,Mo=Tn(()=>{vs();_s=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),ys=_s.slice(1),ma=2,bo=6,_o=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;ba={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},va=1e3,ya="🖐️",xa=8,wa=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Co='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',$a=(s,t)=>s<t?-1:s>t?1:0,yo=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Co}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},ka=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ws=()=>(xs||(xs=new Promise(s=>_o(()=>s(Ea())))),xs),Cs=new Map,_a="️",Ca="\uD83C",Pa="‍",Sa=127995,Aa=57339;yn=requestAnimationFrame,La=typeof ResizeObserver=="function";ja="😀";Na=new WeakMap,Ha=new WeakMap,Ua=Symbol("un-keyed"),Fa="replaceChildren"in Element.prototype;xn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);To=new WeakMap;Es=[],{assign:vn}=Object;nl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",sl="en",il={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},ol=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',So=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],rl=`:host{--emoji-font-family:${Co}}`,Qe=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=ol+rl,this.shadowRoot.appendChild(e),this._ctx={locale:sl,dataSource:nl,skinToneEmoji:ya,customCategorySorting:$a,customEmoji:null,i18n:il,emojiVersion:null,...t};for(let n of So)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Eo(this),this._cmp||(this._cmp=tl(this.shadowRoot,this._ctx))}disconnectedCallback(){Eo(this),xn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new ft({locale:t,dataSource:e}))}_dbFlush(){xn(()=>this._dbCreate())}},Ao={};for(let s of So)Ao[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(Qe.prototype,Ao);customElements.get("emoji-picker")||customElements.define("emoji-picker",Qe)});var Do={};Oo(Do,{Database:()=>ft,Picker:()=>Qe});var Lo=Tn(()=>{Mo();vs()});var Ot=globalThis,Nt=Ot.ShadowRoot&&(Ot.ShadyCSS===void 0||Ot.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,En=Symbol(),Bs=new WeakMap,bt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==En)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Nt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Bs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Bs.set(e,t))}return t}toString(){return this.cssText}},Os=s=>new bt(typeof s=="string"?s:s+"",void 0,En),Ne=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new bt(e,s,En)},Ns=(s,t)=>{if(Nt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Ot.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},_n=Nt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Os(e)})(s):s;var{is:No,defineProperty:Ho,getOwnPropertyDescriptor:Uo,getOwnPropertyNames:Fo,getOwnPropertySymbols:Wo,getPrototypeOf:Ko}=Object,Ht=globalThis,Hs=Ht.trustedTypes,Vo=Hs?Hs.emptyScript:"",Go=Ht.reactiveElementPolyfillSupport,vt=(s,t)=>s,Cn={toAttribute(s,t){switch(t){case Boolean:s=s?Vo:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Fs=(s,t)=>!No(s,t),Us={attribute:!0,type:String,converter:Cn,reflect:!1,useDefault:!1,hasChanged:Fs};Symbol.metadata??=Symbol("metadata"),Ht.litPropertyMetadata??=new WeakMap;var Ce=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Us){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&Ho(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=Uo(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let d=o?.call(this);i?.call(this,r),this.requestUpdate(t,d,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Us}static _$Ei(){if(this.hasOwnProperty(vt("elementProperties")))return;let t=Ko(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(vt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(vt("properties"))){let e=this.properties,n=[...Fo(e),...Wo(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(_n(o))}else t!==void 0&&e.push(_n(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ns(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:Cn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Cn;this._$Em=o;let d=r.fromAttribute(e,i.type);this[o]=d??this._$Ej?.get(o)??d,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Fs)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,d=this[o];r!==!0||this._$AL.has(o)||d===void 0||this.C(o,void 0,i,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Ce.elementStyles=[],Ce.shadowRootOptions={mode:"open"},Ce[vt("elementProperties")]=new Map,Ce[vt("finalized")]=new Map,Go?.({ReactiveElement:Ce}),(Ht.reactiveElementVersions??=[]).push("2.1.2");var Sn=globalThis,Ws=s=>s,Ut=Sn.trustedTypes,Ks=Ut?Ut.createPolicy("lit-html",{createHTML:s=>s}):void 0,An="$lit$",Pe=`lit$${Math.random().toFixed(9).slice(2)}$`,Mn="?"+Pe,qo=`<${Mn}>`,Fe=document,xt=()=>Fe.createComment(""),wt=s=>s===null||typeof s!="object"&&typeof s!="function",Dn=Array.isArray,Zs=s=>Dn(s)||typeof s?.[Symbol.iterator]=="function",Pn=`[ 	
\f\r]`,yt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Vs=/-->/g,Gs=/>/g,He=RegExp(`>|${Pn}(?:([^\\s"'>=/]+)(${Pn}*=${Pn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qs=/'/g,Ys=/"/g,Js=/^(?:script|style|textarea|title)$/i,Ln=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),h=Ln(1),J=Ln(2),Cl=Ln(3),Se=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),Xs=new WeakMap,Ue=Fe.createTreeWalker(Fe,129);function Qs(s,t){if(!Dn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ks!==void 0?Ks.createHTML(t):t}var ei=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=yt;for(let d=0;d<e;d++){let l=s[d],p,c,a=-1,f=0;for(;f<l.length&&(r.lastIndex=f,c=r.exec(l),c!==null);)f=r.lastIndex,r===yt?c[1]==="!--"?r=Vs:c[1]!==void 0?r=Gs:c[2]!==void 0?(Js.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=He):c[3]!==void 0&&(r=He):r===He?c[0]===">"?(r=o??yt,a=-1):c[1]===void 0?a=-2:(a=r.lastIndex-c[2].length,p=c[1],r=c[3]===void 0?He:c[3]==='"'?Ys:qs):r===Ys||r===qs?r=He:r===Vs||r===Gs?r=yt:(r=He,o=void 0);let v=r===He&&s[d+1].startsWith("/>")?" ":"";i+=r===yt?l+qo:a>=0?(n.push(p),l.slice(0,a)+An+l.slice(a)+Pe+v):l+Pe+(a===-2?d:v)}return[Qs(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},$t=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,d=t.length-1,l=this.parts,[p,c]=ei(t,e);if(this.el=s.createElement(p,n),Ue.currentNode=this.el.content,e===2||e===3){let a=this.el.content.firstChild;a.replaceWith(...a.childNodes)}for(;(o=Ue.nextNode())!==null&&l.length<d;){if(o.nodeType===1){if(o.hasAttributes())for(let a of o.getAttributeNames())if(a.endsWith(An)){let f=c[r++],v=o.getAttribute(a).split(Pe),P=/([.?@])?(.*)/.exec(f);l.push({type:1,index:i,name:P[2],strings:v,ctor:P[1]==="."?Wt:P[1]==="?"?Kt:P[1]==="@"?Vt:Ke}),o.removeAttribute(a)}else a.startsWith(Pe)&&(l.push({type:6,index:i}),o.removeAttribute(a));if(Js.test(o.tagName)){let a=o.textContent.split(Pe),f=a.length-1;if(f>0){o.textContent=Ut?Ut.emptyScript:"";for(let v=0;v<f;v++)o.append(a[v],xt()),Ue.nextNode(),l.push({type:2,index:++i});o.append(a[f],xt())}}}else if(o.nodeType===8)if(o.data===Mn)l.push({type:2,index:i});else{let a=-1;for(;(a=o.data.indexOf(Pe,a+1))!==-1;)l.push({type:7,index:i}),a+=Pe.length-1}i++}}static createElement(t,e){let n=Fe.createElement("template");return n.innerHTML=t,n}};function We(s,t,e=s,n){if(t===Se)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=wt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=We(s,o._$AS(s,t.values),o,n)),t}var Ft=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Fe).importNode(e,!0);Ue.currentNode=o;let i=Ue.nextNode(),r=0,d=0,l=n[0];for(;l!==void 0;){if(r===l.index){let p;l.type===2?p=new st(i,i.nextSibling,this,t):l.type===1?p=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(p=new Gt(i,this,t)),this._$AV.push(p),l=n[++d]}r!==l?.index&&(i=Ue.nextNode(),r++)}return Ue.currentNode=Fe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},st=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=We(this,t,e),wt(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==Se&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Zs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&wt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Fe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=$t.createElement(Qs(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new Ft(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Xs.get(t.strings);return e===void 0&&Xs.set(t.strings,e=new $t(t)),e}k(t){Dn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(xt()),this.O(xt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Ws(t).nextSibling;Ws(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ke=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=w}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=We(this,t,e,0),r=!wt(t)||t!==this._$AH&&t!==Se,r&&(this._$AH=t);else{let d=t,l,p;for(t=i[0],l=0;l<i.length-1;l++)p=We(this,d[n+l],e,l),p===Se&&(p=this._$AH[l]),r||=!wt(p)||p!==this._$AH[l],p===w?t=w:t!==w&&(t+=(p??"")+i[l+1]),this._$AH[l]=p}r&&!o&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Wt=class extends Ke{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},Kt=class extends Ke{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},Vt=class extends Ke{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=We(this,t,e,0)??w)===Se)return;let n=this._$AH,o=t===w&&n!==w||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==w&&(n===w||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Gt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){We(this,t)}},ti={M:An,P:Pe,A:Mn,C:1,L:ei,R:Ft,D:Zs,V:We,I:st,H:Ke,N:Kt,U:Vt,B:Wt,F:Gt},Yo=Sn.litHtmlPolyfillSupport;Yo?.($t,st),(Sn.litHtmlVersions??=[]).push("3.3.3");var ni=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new st(t.insertBefore(xt(),i),i,void 0,e??{})}return o._$AI(s),o};var Rn=globalThis,ge=class extends Ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ni(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Se}};ge._$litElement$=!0,ge.finalized=!0,Rn.litElementHydrateSupport?.({LitElement:ge});var Xo=Rn.litElementPolyfillSupport;Xo?.({LitElement:ge});(Rn.litElementVersions??=[]).push("4.2.2");var it="mydashlight",Nl=`/api/${it}/pair`,Hl=`/api/${it}/pair/poll`,Ul=`/${it}`,kt="pair";function si(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function jn(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function ii(s){let t=new URLSearchParams(s);return t.has(kt)?jn(t.get(kt)??""):null}function Zo(s){if(s<60)return"just now";let t=Math.round(s/60);return`${t} minute${t===1?"":"s"} ago`}var Tt=class extends ge{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${it}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${it}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return h`<form @submit=${o=>{o.preventDefault();let i=jn(this.typed);i&&this.check(i)}}>
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
      <p class="code">${si(e.code??"")}</p>
      ${o?h`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:w}
      <p>
        A screen at ${e.address} asked ${Zo(e.age??0)}. Check the code matches the one on the screen. It will be
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
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,h`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};Tt.styles=Ne`
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
  `,Tt.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Tt);function R(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Ie(s){let t=Math.floor(Math.round(s)/60)%24;return`${R(s)} ${t<12?"AM":"PM"}`}function oi(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function _t(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function In(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Jo=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Qo=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),er=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function qt(s){return new Date(`${s}T12:00:00Z`)}function ve(s){let t=qt(s);return`${Jo.format(t)}, ${er.format(t)}`}function ie(s){return Qo.format(qt(s))}function we(s,t){return Math.round((qt(t).getTime()-qt(s).getTime())/864e5)}function Et(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Et("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Yt(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=Et(e,s),i=Et(e,t).date;return o.date===i?`at ${Ie(o.minutes)}`:`on ${ie(o.date)} at ${Ie(o.minutes)}`}var K=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function li(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Ve="mydashlight",tr=7,zn=3e4,ri=3e4;function Bn(s){if(s instanceof K)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new K(String(t.code??"error"),t.message)}return typeof s=="number"?new K("connection_lost","Lost the connection to Home Assistant."):new K("error",String(s))}function ai(s,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new K("timeout","Home Assistant didn’t answer.")),t);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),n(i)})})}var Ct=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},Xt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new K("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Ct(this.conn,`${Ve}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new K("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},zn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await ai(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_plan",service_data:{days:tr},return_response:!0}),ri);this.emit(t.response)}catch(t){this.fail(Bn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Bn(n)}this.live||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:In(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:In(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n){return this.call("set_people",{event:t,people:e,scope:n})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let d=await ai(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_chores",service_data:{},return_response:!0}),ri);if(e)return;n=!0,t(d.response??null)}catch{!e&&!n&&t(null)}},i=new Ct(this.conn,`${Ve}/chores/subscribe`,d=>{e||(n=!0,t(d.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},zn);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(t){let e=!1,n=!1,o=new Ct(this.conn,`${Ve}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let i=setInterval(()=>{o.live||o.open()},zn);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Bn(n)}}};var di={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ci=s=>(...t)=>({_$litDirective$:s,values:t}),Zt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:nr}=ti,hi=s=>s;var pi=()=>document.createComment(""),ot=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(pi(),o),r=n.insertBefore(pi(),o);e=new nr(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,d=r!==s;if(d){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==r._$AU&&e._$AP(l)}if(i!==o||d){let l=e._$AA;for(;l!==i;){let p=hi(l).nextSibling;hi(n).insertBefore(l,o),l=p}}}return e},ze=(s,t,e=s)=>(s._$AI(t,e),s),sr={},ui=(s,t=sr)=>s._$AH=t,fi=s=>s._$AH,Jt=s=>{s._$AR(),s._$AA.remove()};var gi=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Ae=ci(class extends Zt{constructor(s){if(super(s),s.type!==di.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let d of s)o[r]=n?n(d,r):r,i[r]=e(d,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=fi(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let d=this.ut??=[],l=[],p,c,a=0,f=o.length-1,v=0,P=i.length-1;for(;a<=f&&v<=P;)if(o[a]===null)a++;else if(o[f]===null)f--;else if(d[a]===r[v])l[v]=ze(o[a],i[v]),a++,v++;else if(d[f]===r[P])l[P]=ze(o[f],i[P]),f--,P--;else if(d[a]===r[P])l[P]=ze(o[a],i[P]),ot(s,l[P+1],o[a]),a++,P--;else if(d[f]===r[v])l[v]=ze(o[f],i[v]),ot(s,o[a],o[f]),f--,v++;else if(p===void 0&&(p=gi(r,v,P),c=gi(d,a,f)),p.has(d[a]))if(p.has(d[f])){let g=c.get(r[v]),$=g!==void 0?o[g]:null;if($===null){let T=ot(s,o[a]);ze(T,i[v]),l[v]=T}else l[v]=ze($,i[v]),ot(s,o[a],$),o[g]=null;v++}else Jt(o[f]),f--;else Jt(o[a]),a++;for(;v<=P;){let g=ot(s,l[P+1]);ze(g,i[v]),l[v++]=g}for(;a<=f;){let g=o[a++];g!==null&&Jt(g)}return this.ut=r,ui(s,l),Se}});var Qt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function X(s){return Qt[(s%Qt.length+Qt.length)%Qt.length]}var en="#23272E",On="35,39,46";var ir=3,St=36,Nn=12,tn=8,mi=30,$e=16,Pt=100,rt=60,Un=10,nn=30,Fn=10,or=150,rr=150,rn=1;function Ti(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??St}var ar=26,Ei=4;function Kn(s,t){let e=Math.max(or,rr/rn);return Math.ceil(rt+Math.max(0,s-1)*Un+nn+Math.max(0,t-1)*Fn+e*(s+rn*t))}function me(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function ae(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ce(s){return new Map(me(s).map((t,e)=>[t,X(e)]))}function se(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function Q(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Vn(s,t){return t==="none"?"Not needed":ae(s).includes(t)?Q(s,t):t}function _i(s){return s.leave_by!=null&&s.leave_by>s.start&&s.leave_by<s.end?` · leave ${R(s.leave_by)}`:""}function an(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${R(s.end)}`;if(s.end>=1440)return`From ${R(s.start)}`}return`${R(s.start)}–${R(s.end)}`}function ln(s,t){return t.own?Q(s,t.own):se(s,t.kid)}var at={color:en,rgb:On,ink:en};function Ci(s,t){return t.own?at:ce(s).get(t.kid)??X(0)}function lr(s,t){let e=me(s);return t.along.map(n=>e.includes(n)?se(s,n):Q(s,n))}function lt(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function dr(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function sn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Hn(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(sn(t,n.from)),e.push(sn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(sn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function cr(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,d)=>r.s-d.s||d.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let d=n.findIndex(l=>l<=r.s);d<0?(d=n.length,n.push(r.en)):n[d]=r.en,r.col=d,e.push(r),o=Math.max(o,r.en)}return i(),t}function hr(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function pr(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function Pi(s,t){return hr(s.anchors,t)}function Gn(s,t){return pr(s.anchors,t)}function ur(s,t){let e=me(s),n=ae(s),o=Math.max(t,Kn(e.length,n.length)),r=(o-rt-Math.max(0,e.length-1)*Un-nn-Math.max(0,n.length-1)*Fn)/(e.length+rn*n.length||1),d=Math.floor(r),l=Math.floor(r*rn),p=s.whole_week??s.days,c=new Map;for(let g of p)for(let $ of g.events)for(let T of $.own?$.along:[$.kid]){let u=c.get(T)??[];u.some(M=>M.event_id===$.event_id&&M.calendar_id===$.calendar_id)||u.push($),c.set(T,u)}let a=ce(s),f=[],v=rt;e.forEach((g,$)=>{let T=c.get(g)??[],u=s.days.some(M=>M.events.some(j=>j.kid===g&&(j.sides.includes("drop")&&j.drop===""||j.sides.includes("pick")&&j.pick==="")));f.push({id:g,kind:"kid",x:v,w:d,name:se(s,g),dot:a.get(g).color,rgb:a.get(g).rgb,sub:`${u?"Needs a ride · ":""}${T.length} this week`,subWarn:u}),v+=d+($<e.length-1?Un:0)});let P=v+nn/2;return v+=nn,n.forEach((g,$)=>{let T=0,u=0;for(let M of p){let j=M.drivers[g];j&&(T+=j.outings.length,u+=j.drive??0)}f.push({id:g,kind:"driver",x:v,w:l,name:Q(s,g),dot:en,rgb:On,sub:`${T} ${T===1?"trip":"trips"} this week · ${_t(u)} driving`,subWarn:!1}),v+=l+($<n.length-1?Fn:0)}),{columns:f,sepX:P,width:o}}function fr(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function bi(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${R(s.start)}`:e||!t?`${s.title} until ${R(s.end)}`:`${s.title} ${R(s.start)}–${R(s.end)}`}function qn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function Yn(s,t){let e=we(t,s);return e===0?"Today":e===1?"Tomorrow":""}function Z(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Wn(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let d=r.length;for(i===0?i=d:i+1+d<=n?i+=1+d:(o++,i=d);i>n;)o++,i-=n}return o}var Si=25,gr=15,Ai=3;function vi(s){return Math.max(0,Math.min(Ai,Math.floor((s-Si)/gr)))}var mr=Si+2,yi=20;function xi(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var on="🚗";function wi(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,d=!1)=>({at:o,who:i,stays:d,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var $i={muted:0,normal:1,pending:2,problem:3};function Mi(s){let{drop:t,pick:e}=s,n=t?wi(t.text,"drop"):null,o=e?wi(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((l,p)=>p&&($i[p.tone]??1)>($i[l]??1)?p.tone:l,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${on} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let l=`${on} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${l} both ways`,tone:i},pick:null}:{drop:{text:`${l} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(l,p)=>l==="needed"?`${p} needed`:`${p}${l.at?`${l.at} `:" "}${l.who}${l.stays?" stays":""}${l.extra}`,d=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${on} ${d.join(" · ")}`,tone:i},pick:null}}function ki(s,t){let e=t-23,n=`${R(s.start)}–${R(s.end)}`+(s.arrive_by!=null?` · arrive ${R(s.arrive_by)}`:"")+_i(s),o=33+Wn(n,e,6.6)*16,i=s.own?s.lines:Mi(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+Wn(r.text,e,7)*16);return o+4}function Di(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:d}=ur(s,e),l=new Map(i.map(u=>[u.id,u])),p=me(s),c=ae(s),a=[...p,...c],f=ce(s),v=dr(s),P=u=>se(s,u),g=u=>Q(s,u),$={mode:t,width:d,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},T=0;return s.days.forEach((u,M)=>{let j=M*1440,U=new Map(u.events.map(m=>[m.id,m])),ee=m=>m&&U.has(m)?{day:u.date,event:m}:null,le=qn(u),H=u.events.length,De=Yn(u.date,n.date),de=xr(s,u,f,d);$.dayHeads.push({date:u.date,y:T,label:ve(u.date),tag:De,sub:(H?`${H} ${H===1?"activity":"activities"}${u.done?" left":""}`:u.done?"All done for today":"Nothing scheduled")+(le?` · ${le} to sort out`:""),warn:le>0,h:St+(de?de.h+Ei+2:0),allDay:de?.chips??[]}),$.anchors.push({t:j,y:T});let et=$.dayHeads[$.dayHeads.length-1],he=T+et.h+Nn,Le=c.flatMap(m=>u.drivers[m]?.outings??[]);if(!H&&!Le.length){$.empties.push({key:u.date,y:he,text:u.done?"Nothing else today":"Nothing planned"}),T=he+40,$.anchors.push({t:j+1439,y:T});return}let be=(m,A,D,x,b,y,k,E=m.kid)=>{let I=!!m.own&&E===m.own,_=!!m.own&&E!==m.own,L=I?at:f.get(E)??X(0),V=I?g(E):P(E),ne=_?{drop:{text:`With ${g(m.own)}`,tone:m.attending===!1?"muted":"normal"},pick:null}:k&&!m.own?Mi(m.lines):m.lines,B=I?lr(s,m):[],fe=(m.takes!=null?`${m.takes} min, any time ${R(m.start)}–${R(m.end)}`:an(m)+(m.arrive_by!=null?` · arrive ${R(m.arrive_by)}`:"")+_i(m))+(B.length?` · with ${lt(B)}`:"");return{key:`${u.date}|card|${m.id}`+(m.own?`|${E}`:""),x:A,y:D,w:x,h:b,target:{day:u.date,event:m.id},event:m,color:L,kidName:V,clash:y,stayed:!m.own&&m.stay&&c.includes(m.drop),skipped:m.attending===!1,title:fr(m.title,V),time:fe,drop:ne.drop,pick:ne.pick,showDrop:!!ne.drop&&(k||b>=56),showPick:!!ne.pick&&(k||b>=74),wrap:k,aria:`${V}, ${m.title} ${m.takes!=null?`any time from ${R(m.start)} to ${R(m.end)}`:an(m).replace("–"," to ")}. `+(m.attending===!1&&!ne.drop?"Not attending. ":"")+[ne.drop,ne.pick].filter(_e=>!!_e).map(_e=>_e.text).join(". ")}},tt=m=>{let A=u.rides[m];return A?(u.drivers[A.driver]?.segments??[]).filter(x=>x.type!=="home"&&x.kids.includes(A.kid)&&Z(x.start)>=Z(A.start)&&Z(x.end)<=Z(A.end)):[]},Be=m=>{let A=u.rides[m];if(!A)return null;let D=A.serves.find(x=>U.get(x)?.kid===A.kid);return ee(D??A.serves[0])},Re=(m,A)=>{if(A.event)return A;let D=u.events.find(x=>x.own&&x.own!==m&&x.along.includes(m)&&x.title===A.title);return D?{...A,title:`${A.title} with ${g(D.own)}`}:A},je=m=>{if(m.takes==null)return[m.start,m.end];let A=m.planned??m.start;return[A,A+m.takes]},te=new Map;for(let m of u.issues)m.level!=="problem"||!m.event||(m.kind==="late"&&te.set(m.event,`${Math.round(Z(m.minutes))} min late`),m.kind==="waiting"&&te.set(`${m.event}|pick`,`Waits ${Math.round(Z(m.minutes))} min`));if(!o){let m=1/0,A=-1/0;for(let _ of u.events)_.start<=0&&_.end>=1440||(_.start>0?m=Math.min(m,_.start-20,_.arrive_by!=null?_.arrive_by-10:1/0):m=Math.min(m,_.end-30),_.end<1440?A=Math.max(A,_.end+20):A=Math.max(A,_.start+30));for(let _ of Le)_.start!=null&&(m=Math.min(m,_.start)),_.end!=null&&(A=Math.max(A,_.end));let D=u.from;D!=null&&Number.isFinite(m)&&m<D+60?m=D-15:u.date===n.date&&Number.isFinite(m)&&n.minutes>m-60&&n.minutes<A&&(m=Math.min(m,n.minutes-15));let x=Number.isFinite(m)?Math.floor((m-5)/30)*30:900,b=Math.max(Number.isFinite(A)?Math.ceil((A+5)/30)*30:960,x+60),y=_=>D!=null&&Z(_)<=x,k=_=>D!=null&&Z(_)<x,E=_=>Math.round(he+(Math.max(x,Math.min(b,_))-x)*ir);$.anchors.push({t:j+x,y:E(x)},{t:j+b,y:E(b)});for(let _ of p){let L=l.get(_),V=f.get(_),ne=(u.kids[_]?.items??[]).filter(C=>C.start!=null&&C.end!=null&&!y(C.end)).map(C=>({item:C,s:Z(C.start),en:Z(C.end)})),B=[];for(let C of cr(ne)){let z=L.w/C.cols,O=Math.round(L.x+C.col*z),F=Math.round(z-(C.cols>1?4:0)),G=E(C.s),W=C.item;if(W.type==="act"){let ue=U.get(W.event??"");if(!ue)continue;let Bt=Math.max(30,E(C.en)-G),nt=be(ue,O,G,F,Bt,W.clash,!1,_);if(nt.layer=Pt,nt.cut=k(C.s),$.cards.push(nt),ue.arrive_by!=null&&ue.start-ue.arrive_by>=5&&!nt.cut){let kn=E(ue.arrive_by),zs={key:`${u.date}|prep|${ue.id}`,x:O,y:kn,w:F,h:G-kn+$e,color:V,label:`Arrive by ${R(ue.arrive_by)}`,layer:Pt-1};$.preps.push(zs),B.push({s:ue.arrive_by,en:C.en,top:kn,bottom:G+Bt,x:O,w:F,prep:zs,card:nt})}else B.push({s:C.s,en:C.en,top:G,bottom:G+Bt,x:O,w:F,card:nt});let js=te.get(ue.id);js&&$.marks.push({key:`${u.date}|late|${ue.id}`,x:O+F-4,y:G+4,text:js,right:!0});let Is=te.get(`${ue.id}|pick`);Is&&$.marks.push({key:`${u.date}|wait|${ue.id}`,x:O+4,y:G+Bt+2,text:Is,right:!1});continue}let N=u.rides[W.ride??-1];if(!N)continue;let xe=Math.max(22,E(C.en)-G),mt=Hn(tt(N.index),v),Ds=g(N.driver),Ls={key:`${u.date}|ride|${N.index}`,x:O,y:G,w:F,h:xe,target:Be(N.index),l1:`${N.own?"In":"Along in"} ${Ds}’s car`,l2:mt.join(" → "),show2:vi(xe)>0,lines2:vi(xe),dashed:!N.own,clash:W.clash,aria:`${P(_)} ${N.own?"in":"riding along in"} ${Ds}’s car, ${R(Z(N.start))} to ${R(Z(N.end))}: ${mt.join(" to ")}`};$.rides.push(Ls);let Rs=l.get(N.driver),$n=null;Rs&&($n={key:`${u.date}|band|${N.index}`,x:O+F,y:G,w:Math.max(0,Rs.x+8-(O+F)),h:xe,color:V},$.bands.push($n)),B.push({s:C.s,en:C.en,top:G,bottom:G+xe,x:O,w:F,ride:Ls,band:$n})}let fe=C=>C.ride?.layer??(C.prep?Pt-1:Pt),_e=(C,z,O,F)=>{O>$e&&$.links.push({key:`${C.key}|link`,x:C.x,y:z,w:C.w,h:O,color:V,layer:F})},S=(C,z)=>{if(!(z.x<C.x||z.x+z.w>C.x+C.w)&&(C.x=z.x,C.w=z.w,C.ride.x=z.x,C.ride.w=z.w,C.band)){let O=C.band.x+C.band.w;C.band.x=z.x+z.w,C.band.w=Math.max(0,O-C.band.x)}},Y=new Set;for(let C of[...B].sort((z,O)=>O.s-z.s)){let z=C.ride;if(!z)continue;let O=B.filter(W=>W!==C&&W.s>=C.en&&W.s-C.en<=mi&&W.top>=C.bottom).sort((W,N)=>W.s-N.s||W.top-N.top)[0];if(!O)continue;Y.add(C),S(C,O);let F=fe(O),G=O.top-C.bottom;_e(z,C.bottom,G+$e,F-1),z.layer=F-(G>0?2:1),z.h+=$e,z.tuckBottom=$e}for(let C of[...B].sort((z,O)=>z.s-O.s)){let z=C.ride;if(!z||Y.has(C))continue;let O=B.filter(W=>W!==C&&W.en<=C.s&&C.s-W.en<=mi&&W.bottom<=C.top&&(W.card||W.ride?.layer!=null)).sort((W,N)=>N.en-W.en||N.bottom-W.bottom)[0];if(!O)continue;S(C,O);let F=O.ride?.layer??Pt,G=C.top-O.bottom;_e(z,O.bottom-$e,G+$e,F-1),z.layer=F-(G>0?2:1),z.y-=$e,z.h+=$e,z.tuckTop=$e}}for(let _ of c){let L=l.get(_),V=u.drivers[_];if(!V)continue;let ne=[],B=null;for(let S of V.segments)if(!(S.start==null||S.end==null)){if(S.type==="home"){B=null;continue}if(S.type==="stay"){B=null,ne.push({type:"stay",g:S,s:S.start,en:S.end});continue}B&&B.en===S.start?(B.en=S.end,B.legs.push(S)):(B={type:"trip",s:S.start,en:S.end,legs:[S]},ne.push(B))}let fe=new Set,_e=(S,Y,C,z)=>{fe.add(S.id);let O=E(Y),F=be(S,L.x+8,O,L.w-16,Math.max(30,E(C)-O),!1,!1,_);F.cut=k(Y),z&&F.drop?.tone==="normal"&&(F.drop=null,F.showDrop=!1),$.cards.push(F)};for(let S of ne){if(y(S.en))continue;let Y=E(S.s),C=Math.max(24,E(S.en)-Y);if(S.type==="stay"){let N=U.get(S.g.event??S.g.serves??"");if(N?.own===_){_e(N,S.s,S.en,!0);continue}let xe=N?f.get(N.kid)??X(0):X(0),mt=S.g.kids.map(P);$.stays.push({cut:k(S.s),key:`${u.date}|stay|${_}|${S.s}`,x:L.x+8,y:Y,w:L.w-16,h:C,target:ee(N?.id),color:xe,l1:N?`At ${N.title} with ${P(N.kid)}`:"Staying",l2:`until ${R(S.en)}`+(mt.length?` · ${mt.join(" and ")} too`:"")});continue}let z=S.legs[0],O=S.legs[S.legs.length-1],F=[];for(let N of S.legs)for(let xe of N.kids)F.includes(xe)||F.push(xe);let G=O.type==="drive"&&O.to==="home",W=Hn(S.legs,v);$.trips.push({key:`${u.date}|trip|${_}|${S.s}`,x:L.x+8,y:Y,w:L.w-16,h:C,target:ee(S.legs.find(N=>N.serves)?.serves),l1:z.type==="drive"&&z.from==="home"?`Leave ${R(S.s)}`:`From ${sn(v,z.from??z.place)} ${R(S.s)}`,l2:W.join(" → "),show2:C>=36,l3:G?`Home ${R(S.en)}`:"",show3:G&&C>=62,stops:null,kids:F.map(N=>(f.get(N)??X(0)).color),bad:S.legs.some(N=>N.overlaps_busy),aria:`${g(_)} drives ${W.join(" to ")}, ${R(S.s)} to ${R(S.en)}`})}for(let S of V.segments)if(!(!S.overlaps_busy||S.start==null||S.end==null))for(let Y of V.busy){let C=Math.max(S.start,Y.start),z=Math.min(S.end,Y.end);z<=C||y(z)||$.overlaps.push({key:`${u.date}|overlap|${_}|${C}`,x:L.x+6,y:E(C)-2,w:L.w-12,h:Math.max(8,E(z)-E(C)+4)})}for(let S of u.events)if(S.own===_&&(!fe.has(S.id)&&!y(je(S)[1])&&_e(S,...je(S),!1),S.takes!=null&&S.attending!==!1&&!y(S.end))){let Y=E(S.start);$.windows.push({key:`${u.date}|window|${S.id}`,x:L.x+4,y:Y,w:L.w-8,h:Math.max(24,E(S.end)-Y),label:`${S.title} · any time ${R(S.start)}–${R(S.end)}`})}for(let S of V.busy){if(S.event||S.end<=x||S.start>=b)continue;let Y=Re(_,S),C=E(Y.start),z=E(Y.end);$.busy.push({key:`${u.date}|busy|${_}|${Y.start}`,x:L.x+1,y:C,w:L.w-2,h:z-C,labelY:8,label:bi(Y,!1)})}}let I=-1/0;for(let _=x;_<=b;_+=30)$.grid.push({key:`${u.date}|grid|${_}`,y:E(_),strong:_%60===0}),_%60===0&&E(_)-I>=22&&($.hours.push({key:`${u.date}|hour|${_}`,y:E(_)-8,label:oi(_)}),I=E(_));u.date===n.date&&n.minutes>x&&n.minutes<b&&($.now={y:E(n.minutes),label:`Now ${R(n.minutes)}`}),T=E(b)+Nn;return}let q=[];for(let m of p){let A=l.get(m);for(let D of u.kids[m]?.items??[])if(D.start!=null){if(D.type==="act"){let x=U.get(D.event??"");if(!x)continue;q.push({col:m,s:D.start,h:ki(x,A.w),kind:"act",item:D})}else if(!u.rides[D.ride??-1]?.own){let x=u.rides[D.ride??-1],b=x?u.drivers[x.driver]?.outings.find(y=>y.start!=null&&y.start<=Z(x.start)&&Z(x.start)<=Z(y.end,y.start)):void 0;q.push({col:m,s:b?.start??D.start,h:mr,kind:"along",item:D})}}}for(let m of c){let A=u.drivers[m];if(!A)continue;for(let x of A.busy)x.event||q.push({col:m,s:x.start,h:32,kind:"busy",busy:Re(m,x)});let D=l.get(m).w;for(let x of u.events)x.own!==m||!x.busy_only&&x.attending!==!1&&(x.takes==null||x.planned!=null)||q.push({col:m,s:je(x)[0],h:ki(x,D),kind:"own",event:x});for(let x of A.outings){if(x.start==null)continue;let y=[...xi(x.lines)?x.lines.slice(0,-1):x.lines,...x.warn?[x.warn]:[]].reduce((k,E)=>k+Wn(E,D-36,7),0);q.push({col:m,s:x.start,h:30+y*16,kind:"out",out:x})}}q.sort((m,A)=>m.s-A.s||a.indexOf(m.col)-a.indexOf(A.col));let pe=new Map,oe=[],Ee=new Map,Oe=he-yi;for(let m=0;m<q.length;){let A=m,D=Oe+yi;for(;A<q.length&&q[A].s===q[m].s;A++){let b=pe.get(q[A].col);b!=null&&(D=Math.max(D,b+tn))}let x=new Set;for(let b=m;b<A;b++){let y=q[b],k=x.has(y.col)?pe.get(y.col)+tn:D;x.add(y.col),pe.set(y.col,k+y.h)}Ee.set(q[m].s,D),q[m].s>0&&$.hours.push({key:`${u.date}|hour|${q[m].s}`,y:D+2,label:Ie(q[m].s)}),Oe=D,m=A}pe.clear(),q.forEach((m,A)=>{let D=pe.get(m.col),x=Math.max(D!=null?D+tn:he,Ee.get(m.s));pe.set(m.col,x+m.h);let b=m.kind==="busy"?m.busy.end:m.kind==="act"?U.get(m.item.event??"")?.end??null:m.kind==="own"?je(m.event)[1]:null;oe.push({col:m.col,s:m.s,end:b,y:x,h:m.h,box:null}),$.anchors.push({t:j+m.s,y:x});let y=l.get(m.col);if(m.kind==="busy"){let k={key:`${u.date}|busy|${m.col}|${A}`,x:y.x+1,y:x,w:y.w-2,h:m.h,labelY:8,label:bi(m.busy,!0)};$.busy.push(k),oe[oe.length-1].box=k}else if(m.kind==="out"){let k=m.out,E=xi(k.lines),I=E?k.lines.slice(0,-1):k.lines;$.trips.push({key:`${u.date}|trip|${m.col}|${A}`,x:y.x+8,y:x,w:y.w-16,h:m.h,target:ee(k.target),l1:E?`${k.lead} · home ${E}`:k.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...I.map(_=>({text:_,warn:!1})),...k.warn?[{text:k.warn,warn:!0}]:[]],kids:k.kids.map(_=>(f.get(_)??X(0)).color),bad:!!k.warn,aria:`${g(m.col)}: ${k.lead}. ${k.lines.join(". ")}${k.warn?`. ${k.warn}`:""}`})}else if(m.kind==="own"){let k=be(m.event,y.x+8,x,y.w-16,m.h,!1,!0,m.col);$.cards.push(k),oe[oe.length-1].box=k}else if(m.kind==="act"){let k=U.get(m.item.event??""),E=be(k,y.x,x,y.w,m.h,m.item.clash,!0,m.col);$.cards.push(E),oe[oe.length-1].box=E}else{let k=u.rides[m.item.ride??-1],E=Hn(tt(k.index),v),I=g(k.driver);$.rides.push({key:`${u.date}|ride|${k.index}`,x:y.x,y:x,w:y.w,h:m.h,target:Be(k.index),l1:`${on} with ${I}`,l2:E.join(" → "),show2:!1,lines2:Ai,dashed:!0,clash:m.item.clash,aria:`${P(m.col)} riding along with ${I}, ${R(Z(k.start))} to ${R(Z(k.end))}: ${E.join(" to ")}`})}});let re=he;for(let m of pe.values())re=Math.max(re,m);for(let m of oe){if(!m.box||m.end==null)continue;let A=m.y+m.h;for(let D of oe)D.col!==m.col&&D.s>=m.s&&D.s<m.end&&(A=Math.max(A,D.y+D.h));m.end>=1440&&(A=re);for(let D of oe)D.col===m.col&&D.y>m.y&&(A=Math.min(A,D.y-tn));A=Math.min(A,re),A>m.y+m.h&&(m.box.h=A-m.y)}T=re+Nn+6,$.anchors.push({t:j+1439,y:T})}),$.height=T,$}var br=["","¼","½","¾"];function Ge(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return _t(n);let o=Math.round(n*4),i=Math.floor(o/4),r=br[o%4];return`${i||!r?i:""}${r} min`})}function Li(s){let t=e=>e?{...e,text:Ge(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Ge),warn:i.warn==null?i.warn:Ge(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:Ge(n.title),body:Ge(n.body),note:n.note==null?n.note:Ge(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Ge(o.note)}))}:{}}))}))}}var vr=2,yr=48;function Ri(s,t,e=yr){let n=[],o=new Set(ae(s)),i=me(s).map(f=>se(s,f)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],d=0,l=0,p=0,c=0,a=t.minutes+e*60;for(let f of s.days){let v=we(t.date,f.date),P=v===0?"":`${ie(f.date)} · `,g=new Map(f.events.map(u=>[u.id,u])),$=u=>u&&g.has(u)?{day:f.date,event:u}:null,T=(u,M)=>v*1440+(u??g.get(M??"")?.start??0)<a;for(let u of f.issues)if(u.level==="problem"){if(!T(u.at,u.event)){p++,u.kind==="unassigned"&&c++;continue}d++,u.kind==="unassigned"&&l++,n.push({key:`${f.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:P+u.title,body:u.body,target:$(u.event),suggestions:(u.suggestions??[]).map(M=>({id:M.id,label:M.label,note:M.note}))})}if(f.clashes.forEach((u,M)=>{if(!T(u.a.start,u.a.event)){p++;return}d++;let j=g.get(u.a.event??""),U=se(s,u.kid),ee=(H,De)=>{let de=$(De);return de?{text:H,target:de}:H},le=[];if(u.b.type==="act"){let H=g.get(u.b.event??"");j&&H&&(le=[ee(j.title,j.id),` ${R(j.start)}–${R(j.end)} and `,ee(H.title,H.id),` ${R(H.start)}–${R(H.end)} overlap.`])}else{let H=f.rides[u.b.ride??-1];j&&H&&(le=[`${U} is in `,ee(`${Q(s,H.driver)}’s car`,H.serves[0]),` ${R(Z(u.b.start))}–${R(Z(u.b.end))}, during `,ee(j.title,j.id),"."])}n.push({key:`${f.date}|clash|${M}`,tone:"problem",title:`${P}${U} is double-booked`,body:le.map(H=>typeof H=="string"?H:H.text).join(""),parts:le,target:null,suggestions:[]})}),v>=0&&v<vr)for(let u of f.issues)u.level!=="heads_up"||!T(u.at,u.event)||n.push({key:`${f.date}|${u.key}`,tone:"heads_up",title:P+u.title,body:u.body,target:$(u.event),suggestions:[]});for(let u of f.unplaced??[]){if(!T(u.at)){p++;continue}d++;let M=u.people.map(U=>o.has(U)?Q(s,U):se(s,U)),j=u.from_notes?"The For line in its notes":"Its title";n.push({key:`${f.date}|unplaced|${u.id}`,tone:"problem",title:`${P}${R(u.at)} ${u.title}: ${ji(u).toLowerCase()}`,body:u.reason==="unknown"&&u.word?`${j} names “${u.word}”, who isn’t anyone in the family, so ${M.length?`it’s only in ${lt(M)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:f.date,id:u.id}})}for(let u of f.events)!u.problems.length||!T(u.start)||n.push({key:`${f.date}|notes|${u.id}`,tone:"heads_up",title:`${P}Check the notes on ${ln(s,u)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:$(u.id),suggestions:[]})}return{items:n,problems:d,unassigned:l,later:p,laterUnassigned:c}}function ji(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function xr(s,t,e,n){let o=new Set(ae(s)),i=c=>{let a=c[0];return a==null?null:o.has(a)?at:e.get(a)??null},r=[...(t.all_day??[]).map(c=>({key:`${t.date}|allday|${c.id}`,title:c.title,note:c.days>1?`Day ${c.day_number} of ${c.days}`:"",color:i(c.people),cancelled:c.cancelled,warn:!1,pick:null})),...(t.unplaced??[]).map(c=>({key:`${t.date}|unplaced|${c.id}`,title:`${R(c.at)} ${c.title}`,note:ji(c),color:null,cancelled:!1,warn:!0,pick:c.id}))];if(!r.length)return null;let d=Math.max(120,n-rt),l=1,p=0;for(let c of r){let a=Math.min(d,30+7*(c.title.length+(c.note?c.note.length+2:0)));p&&p+a>d&&(l++,p=0),p+=a}return{key:`${t.date}|allday`,h:l*ar+(l-1)*Ei,chips:r}}function Ii(s,t){let e=ce(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=we(t.date,i.date);if(!(r<0))for(let d of ae(s))for(let l of i.drivers[d]?.outings??[]){if(l.start==null)continue;let p=r*1440+l.start;if(r*1440+Z(l.end,l.start)<=t.minutes)continue;let a=p-t.minutes,f={driver:d,name:Q(s,d),date:i.date,ahead:r,start:l.start,inMinutes:a,ongoing:a<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(v=>e.get(v)??X(0)),warn:l.warn,target:l.target&&i.events.some(v=>v.id===l.target)?{day:i.date,event:l.target}:null};(!n||o(f)<o(n)||o(f)===o(n)&&f.inMinutes<n.inMinutes)&&(n=f)}}return n}function dt(s){return s.state==="done"||s.state==="late"}var wr=780;function $r(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<wr}function zi(s,t){return s.chores.map(e=>$r(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function Bi(s){return s.state==="open"||s.state==="overdue"}function Jn(s,t,e){if(dt(s)){let n=s.done_at?kr(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Xn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Xn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=we(t,s.due);return`By ${o===1?"tomorrow":o<7?ie(s.due):Zn(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Xn(s.for_day,t)}`;if(s.due&&s.due>t){let n=we(t,s.due);return n===1?"By tomorrow":`By ${n<7?ie(s.due):Zn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Xn(s,t){let e=we(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ie(s):Zn(s)}function Zn(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function kr(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${ie(i)} ${r}`}function Oi(s,t,e=1440){let n=zi(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(c=>c.kid===o.id),d=new Map;for(let c of r){if(c.state!=="upcoming")continue;let a=c.shows_from??c.due??s.today;d.set(a,[...d.get(a)??[],c])}let l=r.filter(c=>c.state==="overdue"),p=r.filter(c=>c.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??X(i),overdue:l,now:p,done:r.filter(dt),later:[...d.entries()].sort(([c],[a])=>c.localeCompare(a)).map(([c,a])=>({date:c,chores:a})),left:l.length+p.length}})}function Ni(s,t=1440){return zi(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Qn(s){return!s.chores.length&&!s.templates.length}var qe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function es(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>qe.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function ts(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${qe[n[0]]}-${qe[n.at(-1)]}`]:n.map(o=>qe[o])).join(", ")}var Ye="none";function dn(s){return s==="daily"||s==="school"?"":"Any"}function Hi(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Ui(s){let t=s.days??dn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function ns(s){return s.title.trim()?s.who.length?s.days===Ye?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Fi(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function ss(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function is(s,t,e=1,n=!1,o=!1){if(s==="school"){let c=t.trim().replace(/-/g,"–"),a=o?c?`${c} Bring lunch days`:"Bring lunch days":c?`${c} school days`:"Every school day";return n?`${a}, the night before`:a}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,d=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(d))return e>1?`Every day, every ${e} weeks`:"Every day";if(!d||d.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${d.replace(/-/g,"–")} ${r}`;let p=`${d.split(",").map(c=>{let a=c.trim();return a.toLowerCase()==="last"?"the last day":/^\d+$/.test(a)?`the ${ss(Number(a))}`:`the ${a}`}).join(" and ")} ${r}`;return p[0].toUpperCase()+p.slice(1)}function os(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function rs(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function cn(s,t){return`${s}|${t}`}function ct(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function hn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Wi(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Ki(s,t){return hn(t)<5&&!Wi(s,t)}function At(s,t,e=new Map){if(!Ki(s,t))return null;let n=cn(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function ht(s,t){return Ki(s,t)?s.menus?.[t]??null:null}var Tr="From the school's menu feed.";function Er(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Tr);return t.length?t.join(`
`):null}function ke(s){return s.slice(0,7)}function pn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function as(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Vi(s){let t=[];for(let e=ke(s.first);e<=ke(s.last);e=as(e))t.push(e);return t}function Gi(s,t,e,n=new Map){let o=`${e}-01`,i=ct(o,-hn(o)),r=[];for(;ke(i)<=e;){let d=[];for(let l=0;l<5;l++){let p=ct(i,l),c=ke(p)!==e,a=c?null:Wi(t,p),f=c?null:At(t,p,n);d.push({date:p,day:Number(p.slice(8)),outside:c,off:a?a.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:c?null:ht(t,p)?.dish??null,sides:c?null:Er(ht(t,p)?.details??""),past:p<s.today,today:p===s.today})}d.some(l=>!l.outside)&&r.push(d),i=ct(i,7)}return r}function qi(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Yi(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Xi(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=ct(t,i),d=At(s,r,n);if(!d)continue;let l=we(t,r);return{lunch:d.lunch,when:l===0?"today":l===1?"tomorrow":ie(r),date:r,menu:ht(s,r)?.dish??null}}return null}var _r={timeline:"timeline",full:"timeline",compact:"compact"};function Mt(s){let t=new URLSearchParams(s),e={},n=_r[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}function ls(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Cr(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function Pr(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&ls(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function Sr(s,t){let e=new Set(s.events.filter(i=>Cr(s,i)<=t).map(i=>i.id)),n=i=>ls(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(d=>!o(d))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:Pr(r.segments,t),outings:r.outings.filter(d=>d.start==null||ls(d.end,d.start)>t),busy:r.busy.filter(d=>d.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function Zi(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?Sr(e,t.minutes):e)}}var Ji=Ne`
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
`;var zo="mydashlight.rides.view",al=1100,ll=440,dl=700,cl=3*6e4,Ro=1200,hl=450,pl=110;function ul(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var wn=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,jo=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,fl=new URL("emoji.json",import.meta.url).href,Io=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Ps=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Ss=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,gl=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,ml=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Rt={bring:"Bring",buy:"Buy"};function bl(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function ye(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function As(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function vl(s,t){return Yn(s,t)||ve(s).split(",")[0]}function yl(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function xl(){try{return localStorage.getItem(zo)==="timeline"?"timeline":"compact"}catch{return"compact"}}function wl(s){try{localStorage.setItem(zo,s)}catch{}}function Ms(s,t){return ae(s).includes(t)?Q(s,t):se(s,t)}function jt(s){return s.days.every(t=>!t.events.length)}var It=class extends ge{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Mt(location.search).view;this.urlPage=Mt(location.search).page;this.urlPast=Mt(location.search).past;this.urlDayPicker=Mt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},cl))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??xl(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,d]=o.split("|"),l=e.kids.find(p=>p.id===r);(!l||(l.picks[d]??null)===i||!At(l,d))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&dt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Li(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<al)return!1;let e=this.plan;return!e||this.width-ll>=Kn(me(e).length,ae(e).length)}today(){return Et(this.plan?.time_zone??ul())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Zi(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=Di(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(c=>c.date===this.pinDay)?.h??St,d=Gn(e,i.scrollTop+r+4),l=n.days[Math.floor(d/1440)]?.date,p=l?o.days.findIndex(c=>c.date===l):-1;p>=0&&(this.keepAt=p*1440+(d-Math.floor(d/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,Pi(o,e)-Ti(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),d=o.days[r];if(!d)return;let l=1/0;if(this.mode==="timeline"){for(let p of d.events)l=Math.min(l,p.arrive_by??p.start);for(let p of Object.values(d.drivers))for(let c of p.outings)c.start!=null&&(l=Math.min(l,c.start))}this.scrollToTime(r*1440+(Number.isFinite(l)?Math.max(0,l-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let l of this.board.dayHeads)l.y<=n+1&&(o=l);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),d=this.today().date;if(r){let l=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),p=l>0?"up":"down";this.board.dayHeads.some(c=>c.date===d)&&o.date!==d?i=`${p}|Today`:this.mode==="timeline"&&Math.abs(l)>e.clientHeight*.6&&(i=`${p}|${o.date===d?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let d=new Map(this.choreDraft);d.delete(e.id),this.choreDraft=d;let l=r instanceof K?r:new K("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??dt(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=ht(e,n),r=o.filter(d=>d.id===e.id||i&&ht(d,n)?.dish===i.dish).map(d=>d.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof K?o:new K("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(cn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let d=new Map(this.lunchDraft);for(let p of n)d.delete(cn(e,p));this.lunchDraft=d;let l=r instanceof K?r:new K("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Ui(e):Hi(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(Lo(),Do))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ns(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Fi(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof K?n:new K("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof K?n:new K("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??St;this.keepAt=n&&this.board?Gn(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||wl(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),i=this.plan;if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...me(i),...ae(i)]);this.forPick={day:e,id:n,placed:!1,label:`${R(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(d=>r.has(d)),scope:"this",busy:!1}}changeForPick(e,n,o){let i=e.who?.[o.event_id],r=i?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${R(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!i?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let n=this.forPick,o=this.plan;if(!n||!o||!this.backend||!e&&!n.people.length)return;let i=e?[]:n.people;this.forPick={...n,busy:!0};try{await this.backend.setPeople(n.id,i,n.scope),this.forPick=null;let r=n.label.replace(/^\S+ /,""),d=i.map(l=>Ms(o,l));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:`Saved. ${r} is in ${lt(d)}’s ${d.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let d=r instanceof K?r:new K("error",String(r));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}renderForPick(e){let n=this.plan,o=e.placed?n?.days.some(T=>T.date===e.day&&T.events.some(u=>u.id===e.id)):!!this.findUnplaced(e.day,e.id),i=h`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return h`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">Who is this for?</span></div>
          ${i}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let r=e.busy,d=T=>{this.forPick&&(this.forPick={...this.forPick,...T})},l=T=>d({people:e.people.includes(T)?e.people.filter(u=>u!==T):[...e.people,T]}),p=ce(n),c=me(n),a=c.length>1&&c.every(T=>e.people.includes(T)),v=[...c,...ae(n)].filter(T=>e.people.includes(T)),P=v.map(T=>Ms(n,T)),g=P.length<2?P.join(""):`${P.slice(0,-1).join(", ")} & ${P[P.length-1]}`,$=(T,u,M,j)=>h`<button
      type="button"
      class="who-chip"
      style="--c:${M.color};--rgb:${M.rgb}"
      aria-pressed=${e.people.includes(T)?"true":"false"}
      ?disabled=${r}
      @click=${()=>l(T)}
    >
      <span class="avatar ${j?"driver":""}" aria-hidden="true">${ye(u)}</span>${u}
    </button>`;return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">Who is this for?</span>
          <span class="ed-meta">${ve(e.day)} · ${e.label}</span>
        </div>
        ${i}
      </div>
      ${e.word?h`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:w}
      ${e.recurring?h`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${r} @click=${()=>d({scope:"this"})}>
                Just ${ie(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${r} @click=${()=>d({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:w}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${c.map(T=>$(T,se(n,T),p.get(T)??X(0),!1))}
        </div>
        ${c.length>1?h`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${a?"true":"false"}
              ?disabled=${r}
              @click=${()=>d({people:a?e.people.filter(T=>!c.includes(T)):[...c,...e.people.filter(T=>!c.includes(T))]})}
            >
              All the kids
            </button>`:w}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${ae(n).map(T=>$(T,Q(n,T),at,!0))}
        </div>
      </div>
      <p class="field-hint">
        ${v.length?h`Saved in the event’s notes as <strong>For: ${g}</strong>, so its title stays as it is. It shows in ${v.length>1?"their lanes":`${P[0]}’s lane`}${v.some(T=>c.includes(T))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?h`<button type="button" class="chip clear" ?disabled=${r} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!v.length} @click=${()=>void this.saveForPick()}>
          ${r?"Saving to Google Calendar…":v.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderForLine(e,n,o){let i=e.who?.[o.event_id];if(!i)return w;let r=i.people.map(d=>Ms(e,d));return h`<span class="ed-for"
      >For ${lt(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,n,o)}>Change</button></span
    >`}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof K?i:new K("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,d=r.includes(n)?r.filter(l=>l!==n):[...r,n];this.save(`along-${o}`,d,()=>i.setTakeAlong(e.id,d,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Ro)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,d=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,d)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,i;o==null?i=n<0?Math.max(e.start+5,e.end-15):null:n<0?i=Math.max(e.start+5,o-5):i=o+5>=e.end?null:o+5,this.leaveDraft=i,this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),Ro)}clearLeave(){this.leaveDraft=null,this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let i=this.backend,r=o.event.id,d=this.scope;this.save("leave",e,()=>i.setLeaveBy(r,e,d)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,pl)},hl)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?Ri(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,d=this.chores?Ni(this.chores,this.today().minutes).filter(f=>!this.choreDone(f)):[],l=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,p=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",c=h`<aside class="panel" aria-label=${p}>
      ${l??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,d))}
    </aside>`,a=this.page==="rides";return h`
      <div class="app ${r?"wide":this.width<dl?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,d.length)} ${a?this.renderBanner(e):w}
          <main>
            ${a?h`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?jt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!jt(o)?this.renderDayRail(o):w}
                  ${n&&this.away?this.renderBackToToday(this.away):w}
                </section>`:this.page==="lunch"?h`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:h`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?h`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${c}`:w}
          </main>
        </div>
        ${r?c:w}
        ${this.toast?h`<div class="toast" role="status">${this.toast}</div>`:w}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),d="";if(e){let f=e.time_zone,v=new Date(e.updated);this.error?d=h`<span class="bad">${li(this.error)} · showing the plan from ${Yt(v,new Date,f)}</span>`:e.status&&!e.status.ok?d=h`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Yt(v,new Date,f)}</span>`:this.backend?.live||(d=`Updated ${Yt(v,new Date,f)}`)}let l=(f,v,P,g)=>h`
      <button type="button" class="seg-btn" title=${g} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${P}<span class="seg-label">${v}</span>
      </button>
    `,p=(f,v,P)=>h`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${P}<span class="seg-label">${v}</span>
      </button>
    `,c=Ie(r.minutes),a=!!e&&jt(e);return h`
      <header>
        ${this.showMenu?h`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${J`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:w}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ve(r.date)}, ${c}`}>
            <span class="hm">${c.slice(0,-3)}</span><span class="ampm">${c.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${ve(r.date)}${typeof d=="string"&&d?h`<span class="status"> · ${d}</span>`:w}
          </p>
          ${d&&typeof d!="string"?h`<p class="status">${d}</p>`:w}
        </div>
        ${e&&!a?this.renderNext(e,Ii(e,r),n):w}
        <div class="controls">
          ${this.wide||a&&!o?w:h`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?w:h`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",J`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",J`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${p("rides","Rides",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${p("chores","Chores",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?w:p("lunch","Lunch",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let p=this.today().date,c=o.unassigned,a=o.laterUnassigned;if(c){let v=h`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${c} ${c===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?h`<div class="next idle needs">${v}</div>`:h`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${v}</button>`}if(a)return h`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${a} ${a===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let f=e.days.some(v=>v.date>=p&&v.events.length);return h`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${_t(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${ie(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,d=h`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${ye(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(p=>h`<span class="kid-dot" style="background:${p.color}"></span>`)}</span>
        ${n.warn?h`<span class="next-stop warn">${n.warn}</span>`:n.stop?h`<span class="next-stop">${n.stop}</span>`:w}
      </span>
    `,l=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?h`<button type="button" class=${l} @click=${()=>this.open(n.target)}>${d}</button>`:h`<div class=${l}>${d}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return w;let n=this.today().date,o=ce(e),i=this.railShown;return h`<div
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
        ${e.days.map(r=>{let d=qn(r),l=r.events.length,p=r.events.slice(0,4).map(a=>a.own?at.color:o.get(a.kid)?.color??X(0).color),c=`${ve(r.date)}: ${l?`${l} ${l===1?"activity":"activities"}`:"nothing planned"}${d?`, ${d} to sort out`:""}`;return h`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${c}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":ie(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${p.length?p.map(a=>h`<span class="rd-dot" style="background:${a}"></span>`):h`<span class="rd-free">free</span>`}
            </span>
            ${d?h`<span class="rd-badge" aria-hidden="true">${d}</span>`:w}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return h`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${J`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=me(e),o=ae(e),i=ce(e),r=n.map(d=>se(e,d));return h`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((d,l)=>J`<circle cx=${50+l*30} cy="80" r="11" fill=${i.get(d).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${yl(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(d=>{let l=i.get(d);return h`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${ye(se(e,d))}</span>
            <span class="qw-name">${se(e,d)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(d=>h`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${ye(Q(e,d))}</span>
            <span class="qw-name">${Q(e,d)}</span>
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
    </div>`}renderBanner(e){if(e?.needs_setup==="events_calendar")return h`<div class="notice-bar" role="status">
        Pick your family calendar to see the week: in Home Assistant, open Settings &gt; Devices &amp; services &gt; MyDashLight &gt;
        Configure &gt; Calendars.
      </div>`;let n=e?.unavailable_calendars.length??0;return n?h`<div class="notice-bar" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:w}renderEmpty(){return this.error?h`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:h`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderHead(e,n=!1){return h`<div class="dh-line">
        <button
          type="button"
          class="dh-jump"
          tabindex=${n?-1:0}
          aria-label=${`${e.label}: go to this day`}
          @click=${()=>this.tapHead(e.date)}
        >
          <span class="label">${e.label}</span>${e.tag?h`<span class="tag">${e.tag}</span>`:w}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
      </div>
      ${e.allDay.length?h`<div class="day-strip" style="padding-left:${rt}px">
            ${e.allDay.map(o=>{let i=h`<span class="strip-title">${o.title}</span>${o.note?h`<span class="strip-note">${o.note}</span>`:w}`,r=o.pick;return r?h`<button
                    type="button"
                    class="strip-chip warn plain pick"
                    tabindex=${n?-1:0}
                    aria-label=${`${o.title}: ${o.note} Pick who it’s for`}
                    @click=${()=>this.openForPick(e.date,r)}
                  >
                    ${i}
                  </button>`:h`<span
                    class="strip-chip ${o.warn?"warn":""} ${o.cancelled?"skipped":""} ${o.color?"":"plain"}"
                    style=${o.color?`--c:${o.color.color};--rgb:${o.color.rgb};--ink:${o.color.ink}`:""}
                    >${i}</span
                  >`})}
          </div>`:w}`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,i=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(a=>!a.own&&a.event_id===o.event.event_id).map(a=>a.id):[]),r=a=>!!a&&!!n&&a.day===n.day&&i.has(a.event),d=e.dayHeads.find(a=>a.date===this.pinDay)??e.dayHeads[0],l=e.width,p=100,c=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??p-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??p})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??p+1}))].sort((a,f)=>a.z-f.z);return h`
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
          ${e.columns.map(a=>h`<div class="col-head ${a.kind}" style="left:${a.x}px;width:${a.w}px;--c:${a.dot};--rgb:${a.rgb}">
              <span class="avatar ${a.kind}" aria-hidden="true">${ye(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0,a.w-58-a.name.length*10.6):w}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        ${d?h`<div class="pinned" aria-hidden="true" style="width:${l}px;height:${d.h}px;margin-bottom:${-d.h}px">
              ${this.renderHead(d,!0)}
            </div>`:w}
        <div class="canvas" style="width:${l}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(a=>h`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>h`<div class="day-head" style="top:${a.y}px;width:${l}px;height:${a.h}px">${this.renderHead(a)}</div>`)}
          ${e.empties.map(a=>h`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>h`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${l-60}px"></div>`)}
          ${e.hours.map(a=>h`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${Ae(e.bands,a=>a.key,a=>h`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${Ae(e.busy,a=>a.key,a=>h`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${Ae(e.windows,a=>a.key,a=>h`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${Ae(c,a=>a.x.key,a=>{if(a.t==="link"){let g=a.x;return h`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-color:${g.color.color};background:linear-gradient(rgba(${g.color.rgb},0.11), rgba(${g.color.rgb},0.11)), var(--surface)"
                ></div>`}if(a.t==="prep"){let g=a.x;return h`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-color:${g.color.color};background:linear-gradient(rgba(${g.color.rgb},0.11), rgba(${g.color.rgb},0.11)), var(--surface);color:${g.color.ink}"
                >
                  ${g.label}
                </div>`}if(a.t==="ride"){let g=a.x;return h`<button
                  type="button"
                  class="ride ${g.dashed?"dashed":""} ${g.clash?"clash":""}"
                  aria-label=${g.aria}
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;padding-top:${3+(g.tuckTop??0)}px;padding-bottom:${3+(g.tuckBottom??0)}px"
                  @click=${()=>this.open(g.target)}
                >
                  <span class="l1">${g.l1}</span>${g.show2?h`<span class="l2" style="-webkit-line-clamp:${g.lines2}">${g.l2}</span>`:w}
                </button>`}let f=a.x,v=f.color,P=f.skipped?`repeating-linear-gradient(135deg, rgba(${v.rgb},0.10) 0px, rgba(${v.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:f.stayed?`repeating-linear-gradient(135deg, rgba(${v.rgb},0.24) 0px, rgba(${v.rgb},0.24) 6px, rgba(${v.rgb},0.08) 6px, rgba(${v.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${v.rgb},0.15), rgba(${v.rgb},0.15)), var(--surface)`;return h`<button
                type="button"
                class="card ${f.wrap?"wrap":""} ${r(f.target)?"sel":""} ${f.clash?"clash":""} ${f.skipped?"skipped":""} ${f.cut?"cut":""}"
                aria-label=${f.aria}
                style="left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;background:${P};border-color:${f.clash?"var(--bad)":`rgba(${v.rgb},0.45)`};--c:${v.color};--rgb:${v.rgb};--ring:${v.color}"
                @click=${()=>this.open(f.target)}
              >
                <span class="top">
                  <span class="title">${f.title}</span>
                  <span class="time">${f.time}</span>
                  ${f.showDrop&&f.drop?h`<span class="line tone-${f.drop.tone}">${f.drop.text}</span>`:w}
                </span>
                ${f.showPick&&f.pick?h`<span class="line tone-${f.pick.tone}">${f.pick.text}</span>`:w}
              </button>`})}
          ${Ae(e.stays,a=>a.key,a=>h`<button
                type="button"
                class="stay ${a.cut?"cut":""}"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${Ae(e.trips,a=>a.key,a=>h`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(f=>h`<span class="kid-dot" style="background:${f}"></span>`)}</span>
                ${a.show2?h`<span class="l2">${a.l2}</span>`:w}
                ${a.stops?a.stops.map(f=>h`<span class="stop ${f.warn?"warn":""}">${f.text}</span>`):w}
                ${a.show3?h`<span class="l3">${a.l3}</span>`:w}
              </button>`)}
          ${Ae(e.overlaps,a=>a.key,a=>h`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${Ae(e.marks,a=>a.key,a=>h`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${e.now?h`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${l-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:w}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,d=this.plan,l=i+n.length,p=this.chores,c=!!p&&!Qn(p);return h`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?w:h`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${c?h`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?h`<div class="attn-chores">${n.map(a=>this.renderChoreRow(a,!0))}</div>`:h`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:h`<p class="panel-sub">Rides in the next two days</p>`}
      ${d&&!i?h`<div class="all-clear">
            <span class="check" aria-hidden="true">${J`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${jt(d)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:w}
      ${o.map(a=>h`<div class="issue ${a.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${a.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${a.pick?h`<button type="button" class="issue-title" @click=${()=>a.pick&&this.openForPick(a.pick.day,a.pick.id)}>${a.title}</button>`:a.target?h`<button type="button" class="issue-title" @click=${()=>this.open(a.target,!0)}>${a.title}</button>`:h`<strong class="issue-title">${a.title}</strong>`}
              <span class="issue-body"
                >${a.parts?a.parts.map(f=>typeof f=="string"?f:h`<button type="button" class="issue-link" @click=${()=>this.open(f.target,!0)}>${f.text}</button>`):a.body}</span
              >
            </div>
          </div>
          ${a.suggestions.length?h`<div class="fixes">
                ${a.suggestions.map(f=>h`<button
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
      ${this.wide&&d&&!jt(d)&&this.page==="rides"?this.renderLegend():w}
    `}kidColorOf(e){let n=this.plan?ce(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return X(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let i=this.lunch,r=i?.kids.find(a=>a.id===e);if(!i||!r)return w;this.tick;let d=this.today(),l=Xi(r,d.date,d.minutes,this.lunchDraft);if(!l)return w;let p=Rt[l.lunch],c=`${p} lunch ${l.when}${l.menu?`: ${l.menu}`:""}`;return n&&o<36+p.length*7.4?h`<span class="lunch-chip ${l.lunch} small icon" role="img" aria-label=${c} title=${c}
        >${l.lunch==="bring"?Ps:Ss}</span
      >`:h`<span class="lunch-chip ${l.lunch} ${n?"small":""}" title=${c}
      >${l.lunch==="bring"?Ps:Ss}<span class="lunch-chip-text"
        >${p}${n?w:` ${l.when}`}${!n&&l.menu?h`<span class="lunch-chip-menu"> · ${l.menu}</span>`:w}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return h`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return h`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Vi(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:ke(e.today),i=n.indexOf(o),r=c=>{let a=n[i+c];a&&(this.lunchMonth=a)},d=e.kids.some(c=>c.id===this.lunchKid)?this.lunchKid:null,l=d?e.kids.filter(c=>c.id===d):e.kids,p=e.status&&!e.status.ok?h`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:w;return h`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${J`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${pn(o)}</h2>
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
          ${this.menuMode?"Done":h`${jo} Edit menus`}
        </button>
      </div>
      ${p}
      <div class="chore-cols lunch-cols ${d?"wide":""}" style="--n:${l.length}">
        ${l.map(c=>this.renderLunchCard(e,c,o,d!==null))}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),d=Gi(e,n,o,this.lunchDraft),l=Yi(d),p=d.flat(),c=p.filter(g=>!g.outside&&!g.past&&g.lunch),a=n.days_off.filter(g=>ke(g.first)<=o&&o<=ke(g.last)),f=g=>c.filter($=>hn($.date)===g),v=g=>{let $=f(g);if(!$.length)return;let T=$.every(u=>u.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(u=>u.date),T)},P=c.length?`${l.bring} Bring · ${l.buy} Buy${o===ke(e.today)?" left this month":""}`:"No school days left this month";return h`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${ye(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${P}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Rt[n.default]} unless picked</span>
          ${e.kids.length<2?w:h`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?ml:gl}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?h`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:w}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${pn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((g,$)=>h`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f($).length}
            aria-label=${`${f($).every(T=>T.lunch==="bring")?"Buy":"Bring"} every ${g} left in ${pn(o)} for ${n.name}`}
            @click=${()=>v($)}
          >
            ${g}
          </button>`)}
        ${p.map(g=>this.renderLunchCell(n,g,i))}
      </div>
      ${a.length?h`<p class="lunch-offs">
            No school:
            ${a.map(g=>{let $=g.first<`${o}-01`?`${o}-01`:g.first,T=ke(g.last)>o?ct(`${as(o)}-01`,-1):g.last;return`${$===T?As($):`${As($)}–${As(T)}`} ${qi(g.title)}`}).join(" · ")}
          </p>`:w}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return h`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return h`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",d=n.menu?`, ${n.menu}`:"",l=this.menuMode,p=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),c=l?`${e.name}, ${ve(n.date)}${d||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${ve(n.date)}: ${Rt[i]}${n.picked?"":" (not picked yet)"}${d}. Tap to ${Rt[r]}.`;return h`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${l?"editing":""} ${p?"sel":""}"
      ?disabled=${n.past&&!l}
      aria-label=${c}
      @click=${()=>l?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?Ps:Ss}${Rt[i]}</span>
      ${n.menu?h`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?h`<span class="lunch-sides">${n.sides}</span>`:w}`:l?h`<span class="lunch-menu add">${wn} Menu</span>`:w}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(T=>T.id===e.kid),d=(this.plan?ce(this.plan).get(e.kid):void 0)??X(Math.max(0,r)),l=o.kids[r]?.name??"",p=i===dt(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},c=i&&p.done_by&&p.done_by!==e.kid?o.people?.find(T=>T.id===p.done_by)?.name??p.done_by_name??null:null,a=`${Jn(p,o.today,o.time_zone)}${c?` · by ${c}`:""}`,f=i||Bi(e),v=`${n?`${l}: `:""}${e.title}. ${a?`${a}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,P=h`<span class="box" aria-hidden="true"
        >${i?J`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:w}</span
      >
      ${e.icon?h`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:w}
      <span class="chore-text">
        <span class="chore-title">${n?h`<span class="chore-kid">${l}</span> · `:w}${e.title}</span>
        ${a?h`<span class="chore-note">${a}</span>`:w}
      </span>`,g=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${f?"":"later"}`,$=`--c:${d.color};--rgb:${d.rgb};--k:${d.ink}`;return f?h`<button type="button" class=${g} style=${$} aria-pressed=${i?"true":"false"} aria-label=${v} @click=${()=>this.tapChore(e)}>
          ${P}
        </button>`:h`<div class=${g} style=${$}>${P}</div>`}renderChores(){let e=this.chores;if(e===void 0)return h`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return h`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return h`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return h`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Qn(e))return h`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${wn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?h`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:w;this.tick;let i=Oi(e,this.plan?ce(this.plan):void 0,this.today().minutes);return h`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${wn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${jo} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let d=r.overdue.filter(l=>!this.choreDone(l)).length+r.now.filter(l=>!this.choreDone(l)).length;return h`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${ye(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${d?`${d} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?h`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(l=>this.renderChoreRow(l))}`:w}
            ${r.now.length?h`<h3 class="chore-group">To do</h3>
                  ${r.now.map(l=>this.renderChoreRow(l))}`:w}
            ${r.done.length?h`<h3 class="chore-group">Done</h3>
                  ${r.done.map(l=>this.renderChoreRow(l))}`:w}
            ${r.later.map(l=>h`<h3 class="chore-group">${l.date===e.today?"Later today":vl(l.date,e.today)}</h3>
                ${l.chores.map(p=>this.renderChoreRow(p))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?h`<p class="chore-none">No chores this week.</p>`:w}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?ce(this.plan):void 0,r=this.choreEdit?.template===e.id,d=e.problems.length?h`<span class="tmpl-note bad">${e.problems.map(rs).join(" · ")} · tap to set up</span>`:h`<span class="tmpl-note">${os(e.who,o,e.take_turns)} · ${is(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return h`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?h` <span class="tag-paused">Paused</span>`:w}</span>
        ${d}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let p=o.findIndex(a=>a.id===l),c=i?.get(l)??X(Math.max(0,p));return h`<span class="kid-dot" style="background:${c.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return h`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${wn} Add a chore</button>
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
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return h``;let o=n.kids,i=this.plan?ce(this.plan):void 0,r=this.choreBusy,d=e.template?n.templates.find(g=>g.id===e.template):void 0,l=ns(e),p=(d?.problems??[]).filter(g=>g!=="who:"),c=(g,$,T,u=!1)=>h`<button type="button" class="choice ${u?"wide":""}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${T}>${$}</button>`,a=(g,$,T,u)=>h`<button type="button" class="chip" aria-pressed=${g?"true":"false"} aria-label=${u??w} ?disabled=${r} @click=${T}>${$}</button>`,f=g=>{g!==e.repeats&&this.changeDraft({repeats:g,days:d&&d.repeats===g?d.days??dn(g):dn(g)})},v=g=>{let $=e.who.includes(g)?e.who.filter(T=>T!==g):o.filter(T=>T.id===g||e.who.includes(T.id)).map(T=>T.id);this.changeDraft({who:$})},P;if(e.repeats==="school"){let g=e.days===Ye?new Set:e.days===""?new Set([0,1,2,3,4]):es(e.days)??new Set,$=T=>{let u=new Set(g);u.has(T)?u.delete(T):u.add(T),this.changeDraft({days:u.size===5?"":u.size?ts(u):Ye})};P=h`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${qe.slice(0,5).map((T,u)=>a(g.has(u),T.slice(0,2),()=>$(u),T))}
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
        </div>`}else if(e.repeats==="monthly"){let g=e.days.trim(),$=/^\d+$/.test(g)?Number(g):null,T=g&&g.toLowerCase()!=="any"&&g.toLowerCase()!=="last"&&$===null;P=h`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${T?4:3}, minmax(0, 1fr))">
          ${c(g===""||g.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${c($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${c(g.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${T?c(!0,g,()=>{}):w}
        </div>
        ${$!==null?h`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${ss($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:h`<p class="field-hint">${g.toLowerCase()==="last"?"Due on the month’s last day.":T?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")P=h`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let g=e.days===""||e.days.toLowerCase()==="any",$=e.days===Ye?new Set:g?new Set:es(e.days)??new Set,T=u=>{let M=new Set($);M.has(u)?M.delete(u):M.add(u),this.changeDraft({days:M.size?ts(M)||"Mon-Sun":Ye})};P=h`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${c(g,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${c(!g,"On set days",()=>this.changeDraft({days:g?"Sat":e.days}))}
        </div>
        ${g?h`<p class="field-hint">Shows all week, due on Sunday.</p>`:h`<div role="group" aria-label="Days of the week" class="day-chips">
                ${qe.map((u,M)=>a($.has(M),u.slice(0,2),()=>T(M),u))}
              </div>
              <div class="chips">
                ${a(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${a(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?h`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?os(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===Ye?"No days picked":is(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${p.length?h`<p class="field-hint bad">${p.map(rs).join(". ")}. Saving fixes it.</p>`:w}
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
          @input=${g=>this.changeDraft({title:g.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${Io.map(g=>a(e.icon===g,g,()=>this.changeDraft({icon:e.icon===g?null:g}),`Picture ${g}`))}
          ${e.icon&&!Io.includes(e.icon)?a(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):w}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?h`<emoji-picker
              class="emoji-more"
              .dataSource=${fl}
              @emoji-click=${g=>{let $=g.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:w}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((g,$)=>{let T=i?.get(g.id)??X($),u=e.who.includes(g.id);return h`<button type="button" class="who-chip" style="--c:${T.color};--rgb:${T.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${r} @click=${()=>v(g.id)}>
              <span class="avatar" aria-hidden="true">${ye(g.name)}</span>${g.name}
            </button>`})}
        </div>
        ${e.who.length>1?h`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${c(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${c(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:w}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${c(e.repeats==="daily","Every day",()=>f("daily"))}
          ${c(e.repeats==="weekly","Every week",()=>f("weekly"))}
          ${c(e.repeats==="monthly","Every month",()=>f("monthly"))}
          ${c(e.repeats==="school","School days",()=>f("school"))}
        </div>
      </div>
      ${P}
      ${e.repeats==="school"?w:h`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${bl(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${r}
          @input=${g=>this.changeDraft({details:g.target.value})}
        ></textarea>
      </div>
      ${e.template?h`<div class="field">
              ${c(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return h``;let o=e.busy,i=c=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...c})},r=c=>i({kids:e.kids.includes(c)?e.kids.filter(a=>a!==c):[...e.kids,c]}),d=n.kids.filter(c=>At(c,e.date)),l=e.dish.trim(),p=e.kids.length?l?null:"Type what’s served":"Pick who gets this menu";return h`
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
          ${d.map(c=>{let a=this.kidColorOf(c.id),f=e.kids.includes(c.id);return h`<button type="button" class="who-chip" style="--c:${a.color};--rgb:${a.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${o} @click=${()=>r(c.id)}>
              <span class="avatar" aria-hidden="true">${ye(c.name)}</span>${c.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${l||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?h`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:w}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!p} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":p??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return h``;let o=n.people?.length?n.people:n.kids.map(a=>({...a,role:"kid"})),i=n.kids.findIndex(a=>a.id===e.kid),r=n.kids[i],d=this.plan?ce(this.plan):void 0,l=d?.get(e.kid)??X(Math.max(0,i)),p=o.filter(a=>a.id!==e.kid),c=a=>{let f=n.kids.findIndex(v=>v.id===a.id);return f>=0?(d?.get(a.id)??X(f)).color:"var(--dark)"};return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?h`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:w}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${Jn(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${ye(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?h`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${p.map(a=>h`<button type="button" class="done-by" style="--c:${c(a)}" @click=${()=>void this.toggleChore(e,a.id)}>
                  <span class="avatar ${a.role==="parent"?"driver":""}" aria-hidden="true">${ye(a.name)}</span>
                  <span>${a.name}</span>
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
    </div>`}ownHint(e,n){let o=ln(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${R(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${R(n.start)} to ${R(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>ae(e).includes(r)?Q(e,r):se(e,r));return`${o} drives there and back${i.length?`, with ${lt(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return h``;let{day:o,event:i}=n,r=ae(e),d=Ci(e,i),l=ln(e,i),p=!!this.pending,c=x=>this.pending?.key===x?this.pending.value:void 0,a=[...e.people?.carpools??[]];for(let x of e.days)for(let b of x.events)for(let y of[b.drop,b.pick])y&&y!=="none"&&!r.includes(y)&&!a.some(k=>k.toLowerCase()===y.toLowerCase())&&a.push(y);let f=x=>{if(!i.sides.includes(x))return w;let b=c(x)??c("both"),y=x==="drop"?i.drop:i.pick,k=b!==void 0?String(b):i.no_ride_unless_named&&y==="none"?"":y,E=k===""&&!(b===void 0&&i.no_ride_unless_named),I=k&&k!=="none"&&!r.includes(k)?k:"",_=B=>{this.otherOpen=null,this.setRide(i,x,k===B?"":B,r)},L=[...r.map(B=>[B,Vn(e,B)]),["none","Not needed"]],V=`${i.id}|${x}`,ne=this.otherOpen===V;return h`<div class="field ride-box">
        <span class="field-label">${x==="drop"?"Drop-off":"Pick-up"} ${E?h`<span class="nobody">· nobody yet</span>`:w}</span>
        <div role="group" aria-label=${x==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${L.length+1}, minmax(0, 1fr))">
          ${L.map(([B,fe])=>h`<button type="button" class="choice" aria-pressed=${k===B?"true":"false"} ?disabled=${p} @click=${()=>_(B)}>
                ${fe}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${I?"true":"false"}
            aria-expanded=${ne?"true":"false"}
            ?disabled=${p}
            @click=${()=>this.otherOpen=ne?null:V}
          >
            ${I||"Other"}
          </button>
        </div>
        ${ne?h`${a.length?h`<div role="group" aria-label=${x==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${a.map(B=>h`<button type="button" class="chip" aria-pressed=${k.toLowerCase()===B.toLowerCase()?"true":"false"} ?disabled=${p} @click=${()=>_(B)}>
                    ${B}
                  </button>`)}
            </div>`:w}
        <input
          type="text"
          .value=${I&&!a.some(B=>B.toLowerCase()===I.toLowerCase())?I:""}
          ?disabled=${p}
          aria-label=${x==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${B=>{let fe=B.target.value.trim();fe&&fe!==k&&_(fe)}}
          @keydown=${B=>{B.key==="Enter"&&B.target.blur()}}
        />`:w}
        ${!T&&k!==""&&k!=="none"?v(x,k):w}
      </div>`},v=(x,b)=>{let y=c(`along-${x}`),k=y!==void 0?y:x==="pick"?i.pick_along??[]:i.along,E=new Set(o.events.filter(L=>L.event_id===i.event_id&&!L.own).map(L=>L.kid)),I=[...me(e).filter(L=>L!==i.kid&&!E.has(L)),...r.filter(L=>L!==b)];return I.length?h`<div class="field-sub">
        <span class="field-label">${x==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${x==="pick"?"Coming home too. Anyone already there just gets in.":x==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${x==="drop"?"Riding along on the drop-off":x==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${I.map(L=>h`<button type="button" class="chip" aria-pressed=${k.includes(L)?"true":"false"} ?disabled=${p} @click=${()=>this.toggleAlong(i,L,x)}>
              ${r.includes(L)?Q(e,L):se(e,L)}
            </button>`)}
        </div>
      </div>`:w},P=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",g=i.drop===i.pick&&r.includes(i.drop),$=c("stay"),T=$!==void 0?!!$:i.stay&&g,u=c("along"),M=u!==void 0?u:i.along,j=i.own?[...me(e),...r.filter(x=>x!==i.own)]:[],U=i.own!=null&&i.takes!=null,ee=i.own!=null&&!U,le=c("takes"),H=le!==void 0?le:i.takes??null,De=c("arrive"),de=this.arriveDraft!==void 0?this.arriveDraft:De!==void 0?De:i.arrive_by,et=c("leave"),he=this.leaveDraft!==void 0?this.leaveDraft:et!==void 0?et:i.leave_by??null,Le=(x,b)=>{let y=x==="arrive",k=I=>()=>y?this.nudgeArrive(i,I):this.nudgeLeave(i,I),E=(I,_,L,V)=>h`<button
          type="button"
          class="step"
          aria-label=${_}
          ?disabled=${p||V}
          @pointerdown=${()=>this.startHold(k(I))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(k(I))}
        >
          ${L}
        </button>`;return h`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${y?"Arrive by":"Leave by"}</span>
          <span class="field-hint">${y?`${i.start-b} min before it starts`:`${i.end-b} min before it ends`}</span>
        </span>
        <span class="stepper">
          ${E(-5,"Five minutes earlier","−",!y&&b-5<=i.start)}
          <span class="arrive-value">${R(b)}</span>
          ${E(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${y?"Clear arrive-by time":"Clear leave-by time"}
            ?disabled=${p}
            @click=${()=>y?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},be=i.sides.includes("pick")||i.own!=null,tt=()=>h`${de!=null?Le("arrive",de):w}
      ${he!=null?Le("leave",he):w}
      ${de==null||he==null&&be?h`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${de==null?h`<button type="button" class="chip" ?disabled=${p} @click=${()=>this.nudgeArrive(i,-5)}>Arrive early</button>`:w}
              ${he==null&&be?h`<button type="button" class="chip" ?disabled=${p} @click=${()=>this.nudgeLeave(i,-5)}>Leave early</button>`:w}
            </div>
          </div>`:w}`,Be=i.sides.includes("drop")&&i.sides.includes("pick"),Re=Be&&(T||this.stayDraft===i.id),je=()=>{let x=Be?h`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${Re?"false":"true"}
              ?disabled=${p}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,P)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${Re?"true":"false"}
              ?disabled=${p}
              @click=${()=>{P?this.toggleStay(i,!0,P):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:w;if(!Re)return h`${x} ${f("drop")} ${f("pick")}`;let b=T&&g?i.drop:"";return h`${x}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${b?w:h`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(y=>h`<button
                type="button"
                class="choice"
                aria-pressed=${b===y?"true":"false"}
                ?disabled=${p}
                @click=${()=>{if(b===y||!this.backend)return;let k=this.backend;this.stayDraft=null,this.save("stay",!0,()=>k.setRide(i.id,"both",y,this.scope,!0))}}
              >
                ${Q(e,y)}
              </button>`)}
          </div>
          ${b?v("both",b):w}
        </div>`},te=[],q=x=>x==="none"?"Not needed":Vn(e,x),pe=x=>r.includes(x)?Q(e,x):se(e,x),oe=(x,b,y)=>{b===""&&!y.length||te.push(`${x}: ${[b===""?"TBD":q(b),...y.map(pe)].join(", ")}`)},Ee=x=>i.no_ride_unless_named&&x==="none"?"":x;i.own||oe("Drop-off",Ee(i.drop),i.along),i.own||oe("Pick-up",Ee(i.pick),i.pick_along??[]),!i.own&&i.stay&&te.push("Stay: yes"),U&&te.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&te.push(`Take along: ${i.along.map(pe).join(", ")}`),i.arrive_by!=null&&te.push(`Arrive by: ${Ie(i.arrive_by)}`),i.leave_by!=null&&te.push(`Leave by: ${Ie(i.leave_by)}`);let Oe=c("attending"),re=Oe!==void 0?!!Oe:i.attending!==!1;i.attending===!1&&te.splice(0,te.length,"Attending: no");let m=o.date===this.today().date?"":`${ie(o.date)} · `,A=an(i),D=h`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${d.color}"></span>${l} · ${i.title}</span>
          <span class="ed-meta">${m}${U?"any time ":""}${A}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
          ${this.renderForLine(e,o,i)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let x=i.place_name&&i.place_name!==i.title?i.place_name:"",b=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return h`${D}
        ${this.pending?h`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
        ${x?h`<div class="field"><span class="field-label">Where</span><span class="field-hint">${x}</span></div>`:w}
        <p class="field-hint">
          ${re?`This blocks ${l}’s time: ${l} can’t drive then, so a ride that needs ${l} shows as a problem.`:`Not going, so it doesn’t block ${l}’s time, and ${l} can drive then.`}
          ${b}
        </p>
        <button type="button" class="chip clear" ?disabled=${p} @click=${()=>this.setAttending(i,!re)}>
          ${re?`${l} isn’t going this time`:`${l} is going after all`}
        </button>
        ${i.problems.length?h`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:w}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?h`${D}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${l} can’t get home in time, the board shows it as a clash.</p>`:h`
      ${D}
      ${this.pending?h`<p class="saving" role="status">Saving to Google Calendar…</p>`:w}
      ${i.recurring?h`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ie(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:w}
      ${re?h`${i.where==="anywhere"?h`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:w}
            ${i.own?h`<p class="field-hint">${this.ownHint(e,i)}</p>`:je()}
      ${i.own?h`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${H!=null?`Takes ${H} min, any time ${R(i.start)}–${R(i.end)}`:"At its set time"}</span>
            </span>
            ${H!=null?h`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${p||H<=5} @click=${()=>this.setTakes(i,Math.max(5,H-5))}>−</button>
                  <span class="arrive-value">${H} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${p||H+5>i.end-i.start} @click=${()=>this.setTakes(i,H+5)}>+</button>
                </span>`:w}
          </div>
          <button type="button" class="chip clear" ?disabled=${p} @click=${()=>this.setTakes(i,H!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${H!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:w}
      ${ee&&j.length?h`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${j.map(x=>h`<button type="button" class="chip" aria-pressed=${M.includes(x)?"true":"false"} ?disabled=${p} @click=${()=>this.toggleAlong(i,x)}>
                  ${r.includes(x)?Q(e,x):se(e,x)}
                </button>`)}
            </div>
          </div>`:w}
      ${U?w:tt()}
`:h`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${l} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${p} @click=${()=>this.setAttending(i,!re)}>
        ${re?`${l} isn’t going this time`:`${l} is going after all`}
      </button>
      ${i.problems.length?h`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:w}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${te.length?te.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${re&&!i.own?h`<p class="field-hint">Tap a selected driver again to clear it.</p>`:w}
    `}};It.styles=Ji,It.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",It);var zt=class extends ge{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=ii(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(kt);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new Xt(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return h`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?h`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:w}`}};zt.styles=Ne`
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
  `,zt.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",zt);
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
