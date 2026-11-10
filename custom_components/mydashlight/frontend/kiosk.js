var Cr=Object.defineProperty;var Dn=(s,t)=>()=>(s&&(t=s(s=0)),t);var Ar=(s,t)=>{for(var e in t)Cr(s,e,{get:t[e],enumerable:!0})};function wn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function ms(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Na(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function ko(s){return Na(s,t=>t.unicode)}function za(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))i.createIndex(r,a,{multiEntry:c});return i}t(bt),t(st,La,{[Eo]:[Da,!0],[To]:[[Ra,Ia]],[Co]:[Ba,!0]}),t(vs,void 0,{[_o]:[""]})}function Ao(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function Ua(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,Ma);ys[s]=o,o.onupgradeneeded=i=>{i.oldVersion<Pa&&za(o.result)},Ao(e,n,o)});return t.onclose=()=>ks(s),t}function Ha(s){return $n[s]||($n[s]=Ua(s)),$n[s]}function Ne(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(l=>r.objectStore(l)),c;n(a,r,l=>{c=l}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function ks(s){let t=ys[s],e=t&&t.result;if(e){e.close();let n=_n[s];if(n)for(let o of n)o()}delete ys[s],delete $n[s],delete _n[s]}function Fa(s){return new Promise((t,e)=>{ks(s);let n=indexedDB.deleteDatabase(s);Ao(t,e,n)})}function Ka(s,t){let e=_n[s];e||(e=_n[s]=[]),e.push(t)}function mt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||Wa.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function So(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=qa)}function Va(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:a,tags:c,emoji:l,version:d})=>{let h=[...new Set(So([...(r||[]).map(mt).flat(),...(c||[]).map(mt).flat(),...mt(e),n]))].sort(),u={annotation:e,group:o,order:i,tags:c,tokens:h,unicode:l,version:d};if(n&&(u.emoticon=n),r&&(u.shortcodes=r),a){u.skinTones=[],u.skinUnicodes=[],u.skinVersions=[];for(let{tone:m,emoji:S,version:b}of a)u.skinTones.push(m),u.skinUnicodes.push(S),u.skinVersions.push(b)}return u})}function Mo(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function nt(s,t,e){Mo(s,"get",t,e)}function Po(s,t,e){Mo(s,"getAll",t,e)}function $s(s){s.commit&&s.commit()}function Ga(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function Do(s,t){let e=Ga(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Ya(s){return!await Es(s,bt,En)}async function Xa(s,t,e){let[n,o]=await Promise.all([bs,En].map(i=>Es(s,bt,i)));return n===e&&o===t}async function Ja(s,t){return Ne(s,st,xt,(n,o,i)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let l=c.target.result;for(let d of l)if(r=d.unicode,t(d))return i(d);if(l.length<50)return i();a()}};a()})}async function Lo(s,t,e,n){try{let o=Va(t);await Ne(s,[st,bt],ws,([i,r],a)=>{let c,l,d=0;function h(){++d===2&&u()}function u(){if(!(c===n&&l===e)){i.clear();for(let m of o)i.put(m);r.put(n,bs),r.put(e,En),$s(a)}}nt(r,bs,m=>{c=m,h()}),nt(r,En,m=>{l=m,h()})})}finally{}}async function Za(s,t){return Ne(s,st,xt,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Po(e.index(To),i,o)})}async function Ro(s,t){let e=So(mt(t));return e.length?Ne(s,st,xt,(n,o,i)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let l=Do(r,d=>d.unicode);i(l.sort((d,h)=>d.order<h.order?-1:1))};for(let l=0;l<e.length;l++){let d=e[l],h=l===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);Po(n.index(Eo),h,u=>{r.push(u),a()})}}):[]}async function Qa(s,t){let e=await Ro(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Ja(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function el(s,t){return Ne(s,st,xt,(e,n,o)=>nt(e,t,i=>{if(i)return o(i);nt(e.index(Co),t,r=>o(r||null))}))}function Es(s,t,e){return Ne(s,t,xt,(n,o,i)=>nt(n,e,i))}function tl(s,t,e,n){return Ne(s,t,ws,(o,i)=>{o.put(n,e),$s(i)})}function nl(s,t){return Ne(s,vs,ws,(e,n)=>nt(e,t,o=>{e.put((o||0)+1,t),$s(n)}))}function sl(s,t,e){return e===0?[]:Ne(s,[vs,st],xt,([n,o],i,r)=>{let a=[];n.index(_o).openCursor(void 0,"prev").onsuccess=c=>{let l=c.target.result;if(!l)return r(a);function d(m){if(a.push(m),a.length===e)return r(a);l.continue()}let h=l.primaryKey,u=t.byName(h);if(u)return d(u);nt(o,h,m=>{if(m)return d(m);l.continue()})}})}function il(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let a=e;for(let l=0;l<r.length;l++){let d=r.charAt(l),h=a.get(d);h||(h=new Map,a.set(d,h)),a=h}let c=a.get(kn);c||(c=[],a.set(kn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let l=0;l<o.length;l++){let d=o.charAt(l),h=r.get(d);if(h)r=h;else return[]}if(i)return r.get(kn)||[];let a=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((h,u)=>h[0]<u[0]?-1:1);for(let[h,u]of d)h===kn?a.push(...u):c.push(u)}return a}}function rl(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||ol.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function $o(s){rl(s);let t=(u,m)=>u.name.toLowerCase()<m.name.toLowerCase()?-1:1,e=s.sort(t),o=il(s,u=>{let m=new Set;if(u.shortcodes)for(let S of u.shortcodes)for(let b of mt(S))m.add(b);return m}),i=u=>o(u,!0),r=u=>o(u,!1),a=u=>{let m=mt(u),S=m.map((b,k)=>(k<m.length-1?i:r)(b));return Do(S,b=>b.name).sort(t)},c=new Map,l=new Map;for(let u of s){l.set(u.name.toLowerCase(),u);for(let m of u.shortcodes||[])c.set(m.toLowerCase(),u)}return{all:e,search:a,byShortcode:u=>c.get(u.toLowerCase()),byName:u=>l.get(u.toLowerCase())}}function It(s){if(!s)return s;if(al&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Io(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function cl(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||ll.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function Bo(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function dl(s){let t=await fetch(s,{method:"HEAD"});Bo(t,s);let e=t.headers.get("etag");return Io(e),e}async function xs(s){let t=await fetch(s);Bo(t,s);let e=t.headers.get("etag");Io(e);let n=await t.json();return cl(n),[e,n]}function hl(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function ul(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function Oo(s){let t=JSON.stringify(s),e=ul(t),n=await crypto.subtle.digest("SHA-1",e),o=hl(n);return btoa(o)}async function pl(s,t){let e,n=await dl(t);if(!n){let o=await xs(t);n=o[0],e=o[1],n||(n=await Oo(e))}await Xa(s,t,n)||(e||(e=(await xs(t))[1]),await Lo(s,e,t,n))}async function fl(s,t){let[e,n]=await xs(t);e||(e=await Oo(n)),await Lo(s,n,t,e)}async function gl(s,t){try{await pl(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var Ma,Pa,st,bt,vs,Da,Eo,La,_o,Ra,Ia,To,bs,En,wo,xt,ws,Co,Ba,Oa,ja,ys,$n,_n,Wa,qa,kn,ol,al,ll,yt,_s=Dn(()=>{Ma=1,Pa=1,st="emoji",bt="keyvalue",vs="favorites",Da="tokens",Eo="tokens",La="unicode",_o="count",Ra="group",Ia="order",To="group-order",bs="eTag",En="url",wo="skinTone",xt="readonly",ws="readwrite",Co="skinUnicodes",Ba="skinUnicodes",Oa="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",ja="en";ys={},$n={},_n={};Wa=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);qa=2;kn="";ol=["name","url"];al=typeof wrappedJSObject<"u";ll=["annotation","emoji","group","order","version"];yt=class{constructor({dataSource:t=Oa,locale:e=ja,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=$o(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Ha(this._dbName);Ka(this._dbName,this._clear);let e=this.dataSource;await Ya(t)?await fl(t,e):this._lazyUpdate=gl(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return ms(t),await this.ready(),ko(await Za(this._db,t)).map(It)}async getEmojiBySearchQuery(t){wn(t),await this.ready();let e=this._custom.search(t),n=ko(await Ro(this._db,t)).map(It);return[...e,...n]}async getEmojiByShortcode(t){wn(t),await this.ready();let e=this._custom.byShortcode(t);return e||It(await Qa(this._db,t))}async getEmojiByUnicodeOrName(t){wn(t),await this.ready();let e=this._custom.byName(t);return e||It(await el(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Es(this._db,bt,wo)||0}async setPreferredSkinTone(t){return ms(t),await this.ready(),tl(this._db,bt,wo,t)}async incrementFavoriteEmojiCount(t){return wn(t),await this.ready(),nl(this._db,t)}async getTopFavoriteEmoji(t){return ms(t),await this.ready(),(await sl(this._db,this._custom,t)).map(It)}set customEmoji(t){this._custom=$o(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await ks(this._dbName)}async delete(){await this._shutdown(),await Fa(this._dbName)}}});function No(s){return s.unicode.includes("‍")}function El(s){let t=zo(s,"#000"),e=zo(s,"#fff");return t&&e&&$l(t,e)}function _l(){let s=Object.entries(bl);try{for(let[t,e]of s)if(El(t))return e}catch{}finally{}return s[0][1]}function Pl(s,t){if(t===0)return s;let e=s.indexOf(Al);return e!==-1?s.substring(0,e)+String.fromCodePoint(Sl+t-1)+s.substring(e):(s.endsWith(Tl)&&(s=s.substring(0,s.length-1)),s+Cl+String.fromCodePoint(Ml+t-1))}function De(s){s.preventDefault(),s.stopPropagation()}function Ss(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Yo(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Dl(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:a,category:c,annotation:l})=>({unicode:n,name:a,shortcodes:i,url:r,category:c,annotation:l,id:n||a,skins:o&&e(o)}))}function Rl(s,t,e){let n;Ll?(n=new ResizeObserver(e),n.observe(s)):Cn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Uo(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function Ho(s,t,e){let n=Uo(t);if(!n){if(!it){it=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])it.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(it),it.firstChild.nodeValue=s,Uo(it)}finally{it.remove()}}return n}function Bl(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof Ms>"u"&&(Ms=Ho(Il,t,t));let a=Ho(o.unicode,i,t)/1.8<Ms;Rs.set(o.unicode,a),a||(n=!1)}return n}function Ol(s){return Yo(s,t=>t)}function jl(s){s&&(s.scrollTop=0)}function Bt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Fo(s){return""+s}function Nl(s){let t=document.createElement("template");return t.innerHTML=s,t}function Kl(s,t){Fl?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function Wl(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function ql(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Wl(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&Kl(n,s)}function Vl(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,l=s[i];if(o!==l)if(e.currentExpression=l,r)if(l===null)n.removeAttribute(r);else{let d=a+Fo(l)+c;n.setAttribute(r,d)}else{let d;Array.isArray(l)?ql(l,e):l instanceof Element?(d=l,n.replaceWith(d)):n.nodeValue=Fo(l),d&&(e.targetNode=d)}}}function Gl(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],a=0;for(let l=0,d=s.length;l<d;l++){let h=s[l];if(t+=h.slice(a),l===d-1)break;for(let p=0;p<h.length;p++)switch(h.charAt(p)){case"<":{h.charAt(p+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let u=r[r.length-1],m=Bt(i,u,()=>[]),S,b,k;if(n){let p=/(\S+)="?([^"=]*)$/.exec(h);S=p[1],b=p[2];let j=/^([^">]*)("?)/.exec(s[l+1]);k=j[1],t=t.slice(0,-1*p[0].length),a=j[0].length}else a=0;let M={attributeName:S,attributeValuePre:b,attributeValuePost:k,expressionIndex:l};m.push(M),!e&&!n&&(t+=" ")}return{template:Nl(t),elementsToBindings:i}}function Ko(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Yl(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Ko(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=t.get(++r);a&&Ko(a,i,e)}while(i=o.nextNode())}return e}function Xl(s){let{template:t,elementsToBindings:e}=Bt(zl,s,()=>Gl(s)),n=t.cloneNode(!0).content.firstElementChild,o=Yl(n,e);return function(r){return Vl(r,o),n}}function Jl(s){let t=Bt(Ul,s,()=>new Map),e=Hl;function n(i,...r){let a=Bt(t,i,()=>new Map);return Bt(a,e,()=>Xl(i))(r)}function o(i,r,a){return i.map((c,l)=>{let d=e;e=a(c);try{return r(c,l)}finally{e=d}})}return{map:o,html:n}}function Zl(s,t,e,n,o,i,r,a,c){let{labelWithSkin:l,titleForEmoji:d,unicodeWithSkin:h}=e,{html:u,map:m}=Jl(t);function S(p,j,H){return m(p,(V,he)=>u`<button role="${j?"option":"menuitem"}" aria-selected="${j?he===t.activeSearchItem:null}" aria-label="${l(V,t.currentSkinTone)}" title="${d(V)}" class="${"emoji"+(j&&he===t.activeSearchItem?" active":"")+(V.unicode?"":" custom-emoji")}" id="${`${H}-${V.id}`}" style="${V.unicode?null:`--custom-emoji-background: url(${JSON.stringify(V.url)})`}">${V.unicode?h(V,t.currentSkinTone):""}</button>`,V=>`${H}-${V.id}`)}let k=u`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${m(t.skinTones,(p,j)=>u`<div id="skintone-${j}" class="emoji ${j===t.activeSkinTone?"active":""}" aria-selected="${j===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[j]}" aria-label="${t.i18n.skinTones[j]}">${p}</div>`,p=>p)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${m(t.groups,p=>u`<button role="tab" class="nav-button" aria-controls="tab-${p.id}" aria-label="${t.i18n.categories[p.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===p.id}" title="${t.i18n.categories[p.name]}" data-group-id="${p.id}"><div class="nav-emoji emoji">${p.emoji}</div></button>`,p=>p.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${m(t.currentEmojisWithCategories,(p,j)=>u`<div><div id="menu-label-${j}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:p.category?p.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${j!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(p.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${j}" id="${t.searchMode?"search-results":null}">${S(p.emojis,t.searchMode,"emo")}</div></div>`,p=>p.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${S(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,M=(p,j)=>{for(let H of s.querySelectorAll(`[${p}]`))j(H,H.getAttribute(p))};if(c){s.appendChild(k);for(let p of["click","focusout","input","keydown","keyup"])M(`data-on-${p}`,(j,H)=>{j.addEventListener(p,n[H])});M("data-ref",(p,j)=>{i[j]=p}),r.addEventListener("abort",()=>{s.removeChild(k)})}M("data-action",(p,j)=>{let H=a.get(j);H||a.set(j,H=new WeakSet),H.has(p)||(H.add(p),o[j](p))})}function Ql(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let l=[...o];o.clear();try{for(let d of l)d()}finally{i=!1,o.size&&(i=!0,An(r))}},a=new Proxy({},{get(l,d){if(e){let h=n.get(d);h||(h=new Set,n.set(d,h)),h.add(e)}return l[d]},set(l,d,h){if(l[d]!==h){l[d]=h;let u=n.get(d);if(u){for(let m of u)o.add(m);i||(i=!0,An(r))}}return!0}}),c=l=>{let d=()=>{let h=e;e=d;try{return l()}finally{e=h}};return d()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function Ps(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function ec(s,t,e){{let n=s.closest(".tabpanel"),o=Wo.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),Wo.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function tc(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=Ql(o),a=new Map;Tn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),Tn(i,t),Tn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:vl,isRtl:!1,currentGroupIndex:0,groups:Ts,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=y=>{s.getElementById(y).focus()},l=y=>s.getElementById(`emo-${y.id}`),d=(y,T)=>{e.rootElement.dispatchEvent(new CustomEvent(y,{detail:T,bubbles:!0,composed:!0}))},h=(y,T)=>y.id===T.id,u=(y,T)=>{let{category:A,emojis:C}=y,{category:G,emojis:R}=T;return A!==G?!1:Ps(C,R,h)},m=y=>{Ps(i.currentEmojis,y,h)||(i.currentEmojis=y)},S=y=>{i.searchMode!==y&&(i.searchMode=y)},b=y=>{Ps(i.currentEmojisWithCategories,y,u)||(i.currentEmojisWithCategories=y)},k=(y,T)=>T&&y.skins&&y.skins[T]||y.unicode,j={labelWithSkin:(y,T)=>Ol([y.name||k(y,T),y.annotation,...y.shortcodes||Ds].filter(Boolean)).join(", "),titleForEmoji:y=>y.annotation||(y.shortcodes||Ds).join(", "),unicodeWithSkin:k},H={onClickSkinToneButton:te,onEmojiClick:fe,onNavClick:X,onNavKeydown:oe,onSearchKeydown:z,onSkinToneOptionsClick:se,onSkinToneOptionsFocusOut:U,onSkinToneOptionsKeydown:g,onSkinToneOptionsKeyup:B,onSearchInput:D},V={calculateEmojiGridStyle:w,updateOnIntersection:x},he=!0;r(()=>{Zl(s,i,j,H,V,e,o,a,he),he=!1}),i.emojiVersion||As().then(y=>{y||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function y(){let T=!1,A=setTimeout(()=>{T=!0,i.message=i.i18n.loadingMessage},yl);try{await i.database.ready(),i.databaseLoaded=!0}catch(C){console.error(C),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(A),T&&(T=!1,i.message="")}}i.database&&y()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${jo};`}),r(()=>{i.customEmoji&&i.database&&v()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==Ls&&(i.groups=Ls):i.groups!==Ts&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=Ts)}),r(()=>{async function y(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}y()}),r(()=>{i.skinTones=Array(jo).fill().map((y,T)=>Pl(i.skinToneEmoji,T))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function y(){let{database:T}=i,A=(await Promise.all(wl.map(C=>T.getEmojiByUnicodeOrName(C)))).filter(Boolean);i.defaultFavoriteEmojis=A}i.databaseLoaded&&y()});function v(){let{customEmoji:y,database:T}=i,A=y||Ds;T.customEmoji!==A&&(T.customEmoji=A)}r(()=>{async function y(){v();let{database:T,defaultFavoriteEmojis:A,numColumns:C}=i,G=await T.getTopFavoriteEmoji(C),R=await K(Yo([...G,...A],Q=>Q.unicode||Q.name).slice(0,C));i.currentFavorites=R}i.databaseLoaded&&i.defaultFavoriteEmojis&&y()});function w(y){Rl(y,o,()=>{{let T=getComputedStyle(e.rootElement),A=parseInt(T.getPropertyValue("--num-columns"),10),C=T.getPropertyValue("direction")==="rtl";i.numColumns=A,i.isRtl=C}})}function x(y){ec(y,o,T=>{for(let{target:A,isIntersecting:C}of T)A.classList.toggle("onscreen",C)})}r(()=>{async function y(){let{searchText:T,currentGroup:A,databaseLoaded:C,customEmoji:G}=i;if(!C)i.currentEmojis=[],i.searchMode=!1;else if(T.length>=ml){let R=await Z(T);i.searchText===T&&(m(R),S(!0))}else{let{id:R}=A;if(R!==-1||G&&G.length){let Q=await J(R);i.currentGroup.id===R&&(m(Q),S(!1))}}}y()});let $=()=>{Cn(()=>jl(e.tabpanelElement))};r(()=>{let{currentEmojis:y,emojiVersion:T}=i,A=y.filter(C=>C.unicode).filter(C=>No(C)&&!Rs.has(C.unicode));if(!T&&A.length)m(y),Cn(()=>E(A));else{let C=T?y:y.filter(P);m(C),$()}});function E(y){Bl(y,e.baselineEmoji,l)?$():i.currentEmojis=[...i.currentEmojis]}function P(y){return!y.unicode||!No(y)||Rs.get(y.unicode)}async function N(y){let T=i.emojiVersion||await As();return y.filter(({version:A})=>!A||A<=T)}async function K(y){return Dl(y,i.emojiVersion||await As())}async function J(y){let T=y===-1?i.customEmoji:await i.database.getEmojiByGroup(y);return K(await N(T))}async function Z(y){return K(await N(await i.database.getEmojiBySearchQuery(y)))}r(()=>{}),r(()=>{function y(){let{searchMode:A,currentEmojis:C}=i;if(A)return[{category:"",emojis:C}];let G=new Map;for(let R of C){let Q=R.category||"",ge=G.get(Q);ge||(ge=[],G.set(Q,ge)),ge.push(R)}return[...G.entries()].map(([R,Q])=>({category:R,emojis:Q})).sort((R,Q)=>i.customCategorySorting(R.category,Q.category))}let T=y();b(T)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:y}=i;Vo(()=>{i.searchText=(y||"").trim(),i.activeSearchItem=-1})});function z(y){if(!i.searchMode||!i.currentEmojis.length)return;let T=A=>{De(y),i.activeSearchItem=Ss(A,i.activeSearchItem,i.currentEmojis)};switch(y.key){case"ArrowDown":return T(!1);case"ArrowUp":return T(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return De(y),ve(i.currentEmojis[i.activeSearchItem].id)}}function X(y){let{target:T}=y,A=T.closest(".nav-button");if(!A)return;let C=parseInt(A.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(G=>G.id===C)}function oe(y){let{target:T,key:A}=y,C=G=>{G&&(De(y),G.focus())};switch(A){case"ArrowLeft":return C(T.previousElementSibling);case"ArrowRight":return C(T.nextElementSibling);case"Home":return C(T.parentElement.firstElementChild);case"End":return C(T.parentElement.lastElementChild)}}async function ee(y){let T=await i.database.getEmojiByUnicodeOrName(y),A=[...i.currentEmojis,...i.currentFavorites].find(G=>G.id===y),C=A.unicode&&k(A,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(y),{emoji:T,skinTone:i.currentSkinTone,...C&&{unicode:C},...A.name&&{name:A.name}}}async function ve(y){let T=ee(y);d("emoji-click-sync",T),d("emoji-click",await T)}function fe(y){let{target:T}=y;if(!T.classList.contains("emoji"))return;De(y);let A=T.id.substring(4);ve(A)}function O(y){i.currentSkinTone=y,i.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:y}),i.database.setPreferredSkinTone(y)}function se(y){let{target:{id:T}}=y,A=T&&T.match(/^skintone-(\d)/);if(!A)return;De(y);let C=parseInt(A[1],10);O(C)}function te(y){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(De(y),Cn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function g(y){if(!i.skinTonePickerExpanded)return;let T=async A=>{De(y),i.activeSkinTone=A};switch(y.key){case"ArrowUp":return T(Ss(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return T(Ss(!1,i.activeSkinTone,i.skinTones));case"Home":return T(0);case"End":return T(i.skinTones.length-1);case"Enter":return De(y),O(i.activeSkinTone);case"Escape":return De(y),i.skinTonePickerExpanded=!1,c("skintone-button")}}function B(y){if(i.skinTonePickerExpanded)switch(y.key){case" ":return De(y),O(i.activeSkinTone)}}async function U(y){let{relatedTarget:T}=y;(!T||T.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function D(y){i.rawSearchText=y.target.value}return{$set(y){Tn(i,y)},$destroy(){n.abort()}}}function qo(s){s instanceof ot||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var Ls,Ts,ml,jo,Vo,bl,yl,xl,vl,wl,Go,kl,zo,$l,Cs,As,Rs,Tl,Cl,Al,Sl,Ml,Cn,Ll,Il,Ms,it,zl,Ul,Hl,Fl,An,Wo,Ds,Tn,nc,sc,ic,oc,Xo,rc,ot,Jo,Zo=Dn(()=>{_s();Ls=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),Ts=Ls.slice(1),ml=2,jo=6,Vo=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;bl={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},yl=1e3,xl="🖐️",vl=8,wl=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Go='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',kl=(s,t)=>s<t?-1:s>t?1:0,zo=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Go}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},$l=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};As=()=>(Cs||(Cs=new Promise(s=>Vo(()=>s(_l())))),Cs),Rs=new Map,Tl="️",Cl="\uD83C",Al="‍",Sl=127995,Ml=57339;Cn=requestAnimationFrame,Ll=typeof ResizeObserver=="function";Il="😀";zl=new WeakMap,Ul=new WeakMap,Hl=Symbol("un-keyed"),Fl="replaceChildren"in Element.prototype;An=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);Wo=new WeakMap;Ds=[],{assign:Tn}=Object;nc="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",sc="en",ic={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},oc=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Xo=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],rc=`:host{--emoji-font-family:${Go}}`,ot=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=oc+rc,this.shadowRoot.appendChild(e),this._ctx={locale:sc,dataSource:nc,skinToneEmoji:xl,customCategorySorting:kl,customEmoji:null,i18n:ic,emojiVersion:null,...t};for(let n of Xo)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){qo(this),this._cmp||(this._cmp=tc(this.shadowRoot,this._ctx))}disconnectedCallback(){qo(this),An(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new yt({locale:t,dataSource:e}))}_dbFlush(){An(()=>this._dbCreate())}},Jo={};for(let s of Xo)Jo[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(ot.prototype,Jo);customElements.get("emoji-picker")||customElements.define("emoji-picker",ot)});var Qo={};Ar(Qo,{Database:()=>yt,Picker:()=>ot});var er=Dn(()=>{Zo();_s()});function Vs(s){return{type:"auth",access_token:s}}function Gs(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Ys(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function Ln(s){return{type:"unsubscribe_events",subscription:s}}function Xs(){return{type:"ping"}}function Js(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function Qs(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[i]=r}return t}var ei=(s,t,e,n)=>{let[o,i,r]=s.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(i)>=e:Number(i)>e)||n!==void 0&&Number(o)===t&&Number(i)===e&&Number(r)>=n};var Wt=!1,Mr="auth_required",Pr="auth_invalid",Dr="auth_ok";function ni(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;Wt&&console.log("[Auth phase] Initializing",n);function o(i,r,a){Wt&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),l=!1,d=()=>{if(c.removeEventListener("close",d),l){a(2);return}if(i===0){a(1);return}let m=i===-1?-1:i-1;setTimeout(()=>o(m,r,a),1e3)},h=async m=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(Vs(t.accessToken)))}catch(S){l=S===2,c.close()}},u=async m=>{let S=JSON.parse(m.data);switch(Wt&&console.log("[Auth phase] Received",S),S.type){case Pr:l=!0,c.close();break;case Dr:c.removeEventListener("open",h),c.removeEventListener("message",u),c.removeEventListener("close",d),c.removeEventListener("error",d),c.haVersion=S.ha_version,ei(c.haVersion,2022,9)&&c.send(JSON.stringify(Gs())),r(c);break;default:Wt&&S.type!==Mr&&console.warn("[Auth phase] Unhandled message",S)}};c.addEventListener("open",h),c.addEventListener("message",u),c.addEventListener("close",d),c.addEventListener("error",d)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var kt=!1,qt=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{kt&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(Ln(i.id)).catch(a=>{kt&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:kt&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(Js(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){kt&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let l of c)l.reject&&l.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,Ys(e))}ping(){return this.sendMessagePromise(Xs())}sendMessage(t,e){if(!this.connected)throw 3;if(kt&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(i){n(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Ln(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var Lr=()=>`${location.protocol}//${location.host}/`,Rr=s=>s*1e3+Date.now();function Ir(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function Br(s,t,e,n){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function Or(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Br(s,t,e,n)}async function oi(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=t,r.expires=Rr(r.expires_in),r}function ii(s,t,e){return oi(s,t,{code:e,grant_type:"authorization_code"})}function jr(s){return btoa(JSON.stringify(s))}function Nr(s){return JSON.parse(atob(s))}var Rn=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await oi(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function ri(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:Lr(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await ii(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let i=Qs(location.search.substr(1));if("auth_callback"in i){let r=Nr(i.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await ii(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new Rn(t,s.saveTokens);if(e===void 0)throw 4;return Or(e,n,s.redirectUrl||Ir(),jr({hassUrl:e,clientId:n})),new Promise(()=>{})}async function ai(s){let t=Object.assign({setupRetry:0,createSocket:ni},s),e=await t.createSocket(t);return new qt(e,t)}function F(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Ke(s){let t=Math.floor(Math.round(s)/60)%24;return`${F(s)} ${t<12?"AM":"PM"}`}function li(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Et(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function ci(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var zr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Ur=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Hr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Vt(s){return new Date(`${s}T12:00:00Z`)}function Ce(s){let t=Vt(s);return`${zr.format(t)}, ${Hr.format(t)}`}function ye(s){return Ur.format(Vt(s))}function Ae(s,t){return Math.round((Vt(t).getTime()-Vt(s).getTime())/864e5)}function $t(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return $t("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Gt(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=$t(e,s),i=$t(e,t).date;return o.date===i?`at ${Ke(o.minutes)}`:`on ${ye(o.date)} at ${Ke(o.minutes)}`}var ae=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},We="mydashlight",Fr=7,di=3e4;function In(s){if(s instanceof ae)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new ae(String(t.code??"error"),t.message)}return typeof s=="number"?new ae("connection_lost","Lost the connection to Home Assistant."):new ae("error",String(s))}var Yt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new ae("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},di),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new ae("not_running","MyDashLight isn’t running right now."))},{type:`${We}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:We,service:"get_plan",service_data:{days:Fr},return_response:!0});this.emit(t.response)}catch(t){this.fail(In(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:We,service:t,service_data:e})}catch(n){throw In(n)}this.pushing||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:ci(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,o=null,i=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:We,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(a=>{e||t(a.chores)},{type:`${We}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;i(),o=setInterval(()=>void i(),di)}})(),()=>{e=!0,o&&clearInterval(o),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let o=await this.conn.subscribeMessage(i=>{e||t(i.lunch)},{type:`${We}/lunch/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):n=o}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:We,service:t,service_data:e})}catch(n){throw In(n)}}};var Xt=globalThis,Jt=Xt.ShadowRoot&&(Xt.ShadyCSS===void 0||Xt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Bn=Symbol(),hi=new WeakMap,_t=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Bn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Jt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=hi.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&hi.set(e,t))}return t}toString(){return this.cssText}},ui=s=>new _t(typeof s=="string"?s:s+"",void 0,Bn),qe=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new _t(e,s,Bn)},pi=(s,t)=>{if(Jt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=Xt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},On=Jt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return ui(e)})(s):s;var{is:Kr,defineProperty:Wr,getOwnPropertyDescriptor:qr,getOwnPropertyNames:Vr,getOwnPropertySymbols:Gr,getPrototypeOf:Yr}=Object,Zt=globalThis,fi=Zt.trustedTypes,Xr=fi?fi.emptyScript:"",Jr=Zt.reactiveElementPolyfillSupport,Tt=(s,t)=>s,jn={toAttribute(s,t){switch(t){case Boolean:s=s?Xr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},mi=(s,t)=>!Kr(s,t),gi={attribute:!0,type:String,converter:jn,reflect:!1,useDefault:!1,hasChanged:mi};Symbol.metadata??=Symbol("metadata"),Zt.litPropertyMetadata??=new WeakMap;var Ie=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=gi){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&Wr(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=qr(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??gi}static _$Ei(){if(this.hasOwnProperty(Tt("elementProperties")))return;let t=Yr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Tt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Tt("properties"))){let e=this.properties,n=[...Vr(e),...Gr(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(On(o))}else t!==void 0&&e.push(On(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:jn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:jn;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??mi)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Ie.elementStyles=[],Ie.shadowRootOptions={mode:"open"},Ie[Tt("elementProperties")]=new Map,Ie[Tt("finalized")]=new Map,Jr?.({ReactiveElement:Ie}),(Zt.reactiveElementVersions??=[]).push("2.1.2");var zn=globalThis,bi=s=>s,Qt=zn.trustedTypes,yi=Qt?Qt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Un="$lit$",Be=`lit$${Math.random().toFixed(9).slice(2)}$`,Hn="?"+Be,Zr=`<${Hn}>`,Ye=document,At=()=>Ye.createComment(""),St=s=>s===null||typeof s!="object"&&typeof s!="function",Fn=Array.isArray,Ei=s=>Fn(s)||typeof s?.[Symbol.iterator]=="function",Nn=`[ 	
\f\r]`,Ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xi=/-->/g,vi=/>/g,Ve=RegExp(`>|${Nn}(?:([^\\s"'>=/]+)(${Nn}*=${Nn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),wi=/'/g,ki=/"/g,_i=/^(?:script|style|textarea|title)$/i,Kn=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),f=Kn(1),le=Kn(2),bd=Kn(3),Oe=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),$i=new WeakMap,Ge=Ye.createTreeWalker(Ye,129);function Ti(s,t){if(!Fn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return yi!==void 0?yi.createHTML(t):t}var Ci=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=Ct;for(let a=0;a<e;a++){let c=s[a],l,d,h=-1,u=0;for(;u<c.length&&(r.lastIndex=u,d=r.exec(c),d!==null);)u=r.lastIndex,r===Ct?d[1]==="!--"?r=xi:d[1]!==void 0?r=vi:d[2]!==void 0?(_i.test(d[2])&&(o=RegExp("</"+d[2],"g")),r=Ve):d[3]!==void 0&&(r=Ve):r===Ve?d[0]===">"?(r=o??Ct,h=-1):d[1]===void 0?h=-2:(h=r.lastIndex-d[2].length,l=d[1],r=d[3]===void 0?Ve:d[3]==='"'?ki:wi):r===ki||r===wi?r=Ve:r===xi||r===vi?r=Ct:(r=Ve,o=void 0);let m=r===Ve&&s[a+1].startsWith("/>")?" ":"";i+=r===Ct?c+Zr:h>=0?(n.push(l),c.slice(0,h)+Un+c.slice(h)+Be+m):c+Be+(h===-2?a:m)}return[Ti(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Mt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,a=t.length-1,c=this.parts,[l,d]=Ci(t,e);if(this.el=s.createElement(l,n),Ge.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(o=Ge.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let h of o.getAttributeNames())if(h.endsWith(Un)){let u=d[r++],m=o.getAttribute(h).split(Be),S=/([.?@])?(.*)/.exec(u);c.push({type:1,index:i,name:S[2],strings:m,ctor:S[1]==="."?tn:S[1]==="?"?nn:S[1]==="@"?sn:Je}),o.removeAttribute(h)}else h.startsWith(Be)&&(c.push({type:6,index:i}),o.removeAttribute(h));if(_i.test(o.tagName)){let h=o.textContent.split(Be),u=h.length-1;if(u>0){o.textContent=Qt?Qt.emptyScript:"";for(let m=0;m<u;m++)o.append(h[m],At()),Ge.nextNode(),c.push({type:2,index:++i});o.append(h[u],At())}}}else if(o.nodeType===8)if(o.data===Hn)c.push({type:2,index:i});else{let h=-1;for(;(h=o.data.indexOf(Be,h+1))!==-1;)c.push({type:7,index:i}),h+=Be.length-1}i++}}static createElement(t,e){let n=Ye.createElement("template");return n.innerHTML=t,n}};function Xe(s,t,e=s,n){if(t===Oe)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=St(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Xe(s,o._$AS(s,t.values),o,n)),t}var en=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Ye).importNode(e,!0);Ge.currentNode=o;let i=Ge.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let l;c.type===2?l=new dt(i,i.nextSibling,this,t):c.type===1?l=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(l=new on(i,this,t)),this._$AV.push(l),c=n[++a]}r!==c?.index&&(i=Ge.nextNode(),r++)}return Ge.currentNode=Ye,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},dt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Xe(this,t,e),St(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==Oe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ei(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&St(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ye.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Mt.createElement(Ti(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new en(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=$i.get(t.strings);return e===void 0&&$i.set(t.strings,e=new Mt(t)),e}k(t){Fn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(At()),this.O(At()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=bi(t).nextSibling;bi(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Je=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=_}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Xe(this,t,e,0),r=!St(t)||t!==this._$AH&&t!==Oe,r&&(this._$AH=t);else{let a=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=Xe(this,a[n+c],e,c),l===Oe&&(l=this._$AH[c]),r||=!St(l)||l!==this._$AH[c],l===_?t=_:t!==_&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}r&&!o&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},tn=class extends Je{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},nn=class extends Je{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},sn=class extends Je{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Xe(this,t,e,0)??_)===Oe)return;let n=this._$AH,o=t===_&&n!==_||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==_&&(n===_||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},on=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Xe(this,t)}},Ai={M:Un,P:Be,A:Hn,C:1,L:Ci,R:en,D:Ei,V:Xe,I:dt,H:Je,N:nn,U:sn,B:tn,F:on},Qr=zn.litHtmlPolyfillSupport;Qr?.(Mt,dt),(zn.litHtmlVersions??=[]).push("3.3.3");var Si=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new dt(t.insertBefore(At(),i),i,void 0,e??{})}return o._$AI(s),o};var Wn=globalThis,Ee=class extends Ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Si(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Oe}};Ee._$litElement$=!0,Ee.finalized=!0,Wn.litElementHydrateSupport?.({LitElement:Ee});var ea=Wn.litElementPolyfillSupport;ea?.({LitElement:Ee});(Wn.litElementVersions??=[]).push("4.2.2");var Mi={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Pi=s=>(...t)=>({_$litDirective$:s,values:t}),rn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:ta}=Ai,Di=s=>s;var Li=()=>document.createComment(""),ht=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Li(),o),r=n.insertBefore(Li(),o);e=new ta(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||a){let c=e._$AA;for(;c!==i;){let l=Di(c).nextSibling;Di(n).insertBefore(c,o),c=l}}}return e},ze=(s,t,e=s)=>(s._$AI(t,e),s),na={},Ri=(s,t=na)=>s._$AH=t,Ii=s=>s._$AH,an=s=>{s._$AR(),s._$AA.remove()};var Bi=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},je=Pi(class extends rn{constructor(s){if(super(s),s.type!==Mi.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let a of s)o[r]=n?n(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=Ii(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],c=[],l,d,h=0,u=o.length-1,m=0,S=i.length-1;for(;h<=u&&m<=S;)if(o[h]===null)h++;else if(o[u]===null)u--;else if(a[h]===r[m])c[m]=ze(o[h],i[m]),h++,m++;else if(a[u]===r[S])c[S]=ze(o[u],i[S]),u--,S--;else if(a[h]===r[S])c[S]=ze(o[h],i[S]),ht(s,c[S+1],o[h]),h++,S--;else if(a[u]===r[m])c[m]=ze(o[u],i[m]),ht(s,o[h],o[u]),u--,m++;else if(l===void 0&&(l=Bi(r,m,S),d=Bi(a,h,u)),l.has(a[h]))if(l.has(a[u])){let b=d.get(r[m]),k=b!==void 0?o[b]:null;if(k===null){let M=ht(s,o[h]);ze(M,i[m]),c[m]=M}else c[m]=ze(k,i[m]),ht(s,o[h],k),o[b]=null;m++}else an(o[u]),u--;else an(o[h]),h++;for(;m<=S;){let b=ht(s,c[S+1]);ze(b,i[m]),c[m++]=b}for(;h<=u;){let b=o[h++];b!==null&&an(b)}return this.ut=r,Ri(s,c),Oe}});var ln=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function pe(s){return ln[(s%ln.length+ln.length)%ln.length]}var cn="#23272E",qn="35,39,46";var sa=3,Dt=36,Vn=12,dn=8,Oi=30,Se=16,Pt=100,ut=60,Yn=10,hn=30,Xn=10,ia=150,oa=200,fn=1.4;function qi(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Dt}var ra=26,Vi=4;function Jn(s,t){let e=Math.max(ia,oa/fn);return Math.ceil(ut+Math.max(0,s-1)*Yn+hn+Math.max(0,t-1)*Xn+e*(s+fn*t))}function Me(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function _e(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function $e(s){return new Map(Me(s).map((t,e)=>[t,pe(e)]))}function xe(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function me(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Zn(s,t){return t==="none"?"Not needed":_e(s).includes(t)?me(s,t):t}function gn(s,t){return t.own?me(s,t.own):xe(s,t.kid)}var Lt={color:cn,rgb:qn,ink:cn};function Gi(s,t){return t.own?Lt:$e(s).get(t.kid)??pe(0)}function aa(s,t){let e=Me(s);return t.along.map(n=>e.includes(n)?xe(s,n):me(s,n))}function mn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function la(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function un(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Gn(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(un(t,n.from)),e.push(un(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(un(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function ca(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),t}function da(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function ha(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function Yi(s,t){return da(s.anchors,t)}function Qn(s,t){return ha(s.anchors,t)}function ua(s,t){let e=Me(s),n=_e(s),o=Math.max(t,Jn(e.length,n.length)),r=(o-ut-Math.max(0,e.length-1)*Yn-hn-Math.max(0,n.length-1)*Xn)/(e.length+fn*n.length||1),a=Math.floor(r),c=Math.floor(r*fn),l=s.whole_week??s.days,d=new Map;for(let b of l)for(let k of b.events)for(let M of k.own?k.along:[k.kid]){let p=d.get(M)??[];p.some(j=>j.event_id===k.event_id&&j.calendar_id===k.calendar_id)||p.push(k),d.set(M,p)}let h=$e(s),u=[],m=ut;e.forEach((b,k)=>{let M=d.get(b)??[],p=s.days.some(j=>j.events.some(H=>H.kid===b&&(H.sides.includes("drop")&&H.drop===""||H.sides.includes("pick")&&H.pick==="")));u.push({id:b,kind:"kid",x:m,w:a,name:xe(s,b),dot:h.get(b).color,rgb:h.get(b).rgb,sub:`${p?"Needs a ride · ":""}${M.length} this week`,subWarn:p}),m+=a+(k<e.length-1?Yn:0)});let S=m+hn/2;return m+=hn,n.forEach((b,k)=>{let M=0,p=0;for(let j of l){let H=j.drivers[b];H&&(M+=H.outings.length,p+=H.drive??0)}u.push({id:b,kind:"driver",x:m,w:c,name:me(s,b),dot:cn,rgb:qn,sub:`${M} ${M===1?"trip":"trips"} this week · ${Et(p)} driving`,subWarn:!1}),m+=c+(k<n.length-1?Xn:0)}),{columns:u,sepX:S,width:o}}function pa(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function ji(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${F(s.start)}`:e||!t?`${s.title} until ${F(s.end)}`:`${s.title} ${F(s.start)}–${F(s.end)}`}function es(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function ts(s,t){let e=Ae(t,s);return e===0?"Today":e===1?"Tomorrow":""}function de(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Ni(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=n?i+=1+a:(o++,i=a);i>n;)o++,i-=n}return o}var Xi=25,fa=15,Ji=3;function zi(s){return Math.max(0,Math.min(Ji,Math.floor((s-Xi)/fa)))}var ga=Xi+2,Ui=20;function Hi(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var pn="🚗";function Fi(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var Ki={muted:0,normal:1,pending:2,problem:3};function Zi(s){let{drop:t,pick:e}=s,n=t?Fi(t.text,"drop"):null,o=e?Fi(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((c,l)=>l&&(Ki[l.tone]??1)>(Ki[c]??1)?l.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${pn} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${pn} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,l)=>c==="needed"?`${l} needed`:`${l}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${pn} ${a.join(" · ")}`,tone:i},pick:null}}function Wi(s,t){let e=t-23,n=`${F(s.start)}–${F(s.end)}`+(s.arrive_by!=null?` · arrive ${F(s.arrive_by)}`:""),o=33+Ni(n,e,6.6)*16,i=s.own?s.lines:Zi(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+Ni(r.text,e,7)*16);return o+4}function Qi(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:a}=ua(s,e),c=new Map(i.map(p=>[p.id,p])),l=Me(s),d=_e(s),h=[...l,...d],u=$e(s),m=la(s),S=p=>xe(s,p),b=p=>me(s,p),k={mode:t,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},M=0;return s.days.forEach((p,j)=>{let H=j*1440,V=new Map(p.events.map(g=>[g.id,g])),he=g=>g&&V.has(g)?{day:p.date,event:g}:null,v=es(p),w=p.events.length,x=ts(p.date,n.date),$=xa(s,p,u,a);k.dayHeads.push({date:p.date,y:M,label:Ce(p.date),tag:x,sub:(w?`${w} ${w===1?"activity":"activities"}${p.done?" left":""}`:p.done?"All done for today":"Nothing scheduled")+(v?` · ${v} to sort out`:""),warn:v>0,h:Dt+($?$.h+Vi+2:0),allDay:$?.chips??[]}),k.anchors.push({t:H,y:M});let E=k.dayHeads[k.dayHeads.length-1],P=M+E.h+Vn,N=d.flatMap(g=>p.drivers[g]?.outings??[]);if(!w&&!N.length){k.empties.push({key:p.date,y:P,text:p.done?"Nothing else today":"Nothing planned"}),M=P+40,k.anchors.push({t:H+1439,y:M});return}let K=(g,B,U,D,y,T,A,C=g.kid)=>{let G=!!g.own&&C===g.own,R=!!g.own&&C!==g.own,Q=G?Lt:u.get(C)??pe(0),ge=G?b(C):S(C),we=R?{drop:{text:`With ${b(g.own)}`,tone:g.attending===!1?"muted":"normal"},pick:null}:A&&!g.own?Zi(g.lines):g.lines,ue=G?aa(s,g):[],at=(g.takes!=null?`${g.takes} min, any time ${F(g.start)}–${F(g.end)}`:`${F(g.start)}–${F(g.end)}`+(g.arrive_by!=null?` · arrive ${F(g.arrive_by)}`:""))+(ue.length?` · with ${mn(ue)}`:"");return{key:`${p.date}|card|${g.id}`+(g.own?`|${C}`:""),x:B,y:U,w:D,h:y,target:{day:p.date,event:g.id},event:g,color:Q,kidName:ge,clash:T,stayed:!g.own&&g.stay&&d.includes(g.drop),skipped:g.attending===!1,title:pa(g.title,ge),time:at,drop:we.drop,pick:we.pick,showDrop:!!we.drop&&(A||y>=56),showPick:!!we.pick&&(A||y>=74),wrap:A,aria:`${ge}, ${g.title} ${g.takes!=null?`any time from ${F(g.start)} to ${F(g.end)}`:`${F(g.start)} to ${F(g.end)}`}. `+(g.attending===!1&&!we.drop?"Not attending. ":"")+[we.drop,we.pick].filter(Re=>!!Re).map(Re=>Re.text).join(". ")}},J=g=>{let B=p.rides[g];return B?(p.drivers[B.driver]?.segments??[]).filter(D=>D.type!=="home"&&D.kids.includes(B.kid)&&de(D.start)>=de(B.start)&&de(D.end)<=de(B.end)):[]},Z=g=>{let B=p.rides[g];if(!B)return null;let U=B.serves.find(D=>V.get(D)?.kid===B.kid);return he(U??B.serves[0])},z=(g,B)=>{if(B.event)return B;let U=p.events.find(D=>D.own&&D.own!==g&&D.along.includes(g)&&D.title===B.title);return U?{...B,title:`${B.title} with ${b(U.own)}`}:B},X=g=>{if(g.takes==null)return[g.start,g.end];let B=g.planned??g.start;return[B,B+g.takes]},oe=new Map;for(let g of p.issues)g.level!=="problem"||!g.event||(g.kind==="late"&&oe.set(g.event,`${Math.round(de(g.minutes))} min late`),g.kind==="waiting"&&oe.set(`${g.event}|pick`,`Waits ${Math.round(de(g.minutes))} min`));if(!o){let g=1/0,B=-1/0;for(let R of p.events)R.start<=0&&R.end>=1440||(R.start>0?g=Math.min(g,R.start-20,R.arrive_by!=null?R.arrive_by-10:1/0):g=Math.min(g,R.end-30),R.end<1440?B=Math.max(B,R.end+20):B=Math.max(B,R.start+30));for(let R of N)R.start!=null&&(g=Math.min(g,R.start)),R.end!=null&&(B=Math.max(B,R.end));let U=p.from;U!=null&&Number.isFinite(g)&&g<U+60?g=U-15:p.date===n.date&&Number.isFinite(g)&&n.minutes>g-60&&n.minutes<B&&(g=Math.min(g,n.minutes-15));let D=Number.isFinite(g)?Math.floor((g-5)/30)*30:900,y=Math.max(Number.isFinite(B)?Math.ceil((B+5)/30)*30:960,D+60),T=R=>U!=null&&de(R)<=D,A=R=>U!=null&&de(R)<D,C=R=>Math.round(P+(Math.max(D,Math.min(y,R))-D)*sa);k.anchors.push({t:H+D,y:C(D)},{t:H+y,y:C(y)});for(let R of l){let Q=c.get(R),ge=u.get(R),we=(p.kids[R]?.items??[]).filter(L=>L.start!=null&&L.end!=null&&!T(L.end)).map(L=>({item:L,s:de(L.start),en:de(L.end)})),ue=[];for(let L of ca(we)){let W=Q.w/L.cols,q=Math.round(Q.x+L.col*W),ne=Math.round(W-(L.cols>1?4:0)),re=C(L.s),ie=L.item;if(ie.type==="act"){let ke=V.get(ie.event??"");if(!ke)continue;let Kt=Math.max(30,C(L.en)-re),lt=K(ke,q,re,ne,Kt,ie.clash,!1,R);if(lt.layer=Pt,lt.cut=A(L.s),k.cards.push(lt),ke.arrive_by!=null&&ke.start-ke.arrive_by>=5&&!lt.cut){let Pn=C(ke.arrive_by),qs={key:`${p.date}|prep|${ke.id}`,x:q,y:Pn,w:ne,h:re-Pn+Se,color:ge,label:`Arrive by ${F(ke.arrive_by)}`,layer:Pt-1};k.preps.push(qs),ue.push({s:ke.arrive_by,en:L.en,top:Pn,bottom:re+Kt,x:q,w:ne,prep:qs,card:lt})}else ue.push({s:L.s,en:L.en,top:re,bottom:re+Kt,x:q,w:ne,card:lt});let Ks=oe.get(ke.id);Ks&&k.marks.push({key:`${p.date}|late|${ke.id}`,x:q+ne-4,y:re+4,text:Ks,right:!0});let Ws=oe.get(`${ke.id}|pick`);Ws&&k.marks.push({key:`${p.date}|wait|${ke.id}`,x:q+4,y:re+Kt+2,text:Ws,right:!1});continue}let Y=p.rides[ie.ride??-1];if(!Y)continue;let Te=Math.max(22,C(L.en)-re),wt=Gn(J(Y.index),m),Us=b(Y.driver),Hs={key:`${p.date}|ride|${Y.index}`,x:q,y:re,w:ne,h:Te,target:Z(Y.index),l1:`${Y.own?"In":"Along in"} ${Us}’s car`,l2:wt.join(" → "),show2:zi(Te)>0,lines2:zi(Te),dashed:!Y.own,clash:ie.clash,aria:`${S(R)} ${Y.own?"in":"riding along in"} ${Us}’s car, ${F(de(Y.start))} to ${F(de(Y.end))}: ${wt.join(" to ")}`};k.rides.push(Hs);let Fs=c.get(Y.driver),Mn=null;Fs&&(Mn={key:`${p.date}|band|${Y.index}`,x:q+ne,y:re,w:Math.max(0,Fs.x+8-(q+ne)),h:Te,color:ge},k.bands.push(Mn)),ue.push({s:L.s,en:L.en,top:re,bottom:re+Te,x:q,w:ne,ride:Hs,band:Mn})}let at=L=>L.ride?.layer??(L.prep?Pt-1:Pt),Re=(L,W,q,ne)=>{q>Se&&k.links.push({key:`${L.key}|link`,x:L.x,y:W,w:L.w,h:q,color:ge,layer:ne})},I=(L,W)=>{if(!(W.x<L.x||W.x+W.w>L.x+L.w)&&(L.x=W.x,L.w=W.w,L.ride.x=W.x,L.ride.w=W.w,L.band)){let q=L.band.x+L.band.w;L.band.x=W.x+W.w,L.band.w=Math.max(0,q-L.band.x)}},ce=new Set;for(let L of[...ue].sort((W,q)=>q.s-W.s)){let W=L.ride;if(!W)continue;let q=ue.filter(ie=>ie!==L&&ie.s>=L.en&&ie.s-L.en<=Oi&&ie.top>=L.bottom).sort((ie,Y)=>ie.s-Y.s||ie.top-Y.top)[0];if(!q)continue;ce.add(L),I(L,q);let ne=at(q),re=q.top-L.bottom;Re(W,L.bottom,re+Se,ne-1),W.layer=ne-(re>0?2:1),W.h+=Se,W.tuckBottom=Se}for(let L of[...ue].sort((W,q)=>W.s-q.s)){let W=L.ride;if(!W||ce.has(L))continue;let q=ue.filter(ie=>ie!==L&&ie.en<=L.s&&L.s-ie.en<=Oi&&ie.bottom<=L.top&&(ie.card||ie.ride?.layer!=null)).sort((ie,Y)=>Y.en-ie.en||Y.bottom-ie.bottom)[0];if(!q)continue;I(L,q);let ne=q.ride?.layer??Pt,re=L.top-q.bottom;Re(W,q.bottom-Se,re+Se,ne-1),W.layer=ne-(re>0?2:1),W.y-=Se,W.h+=Se,W.tuckTop=Se}}for(let R of d){let Q=c.get(R),ge=p.drivers[R];if(!ge)continue;let we=[],ue=null;for(let I of ge.segments)if(!(I.start==null||I.end==null)){if(I.type==="home"){ue=null;continue}if(I.type==="stay"){ue=null,we.push({type:"stay",g:I,s:I.start,en:I.end});continue}ue&&ue.en===I.start?(ue.en=I.end,ue.legs.push(I)):(ue={type:"trip",s:I.start,en:I.end,legs:[I]},we.push(ue))}let at=new Set,Re=(I,ce,L,W)=>{at.add(I.id);let q=C(ce),ne=K(I,Q.x+8,q,Q.w-16,Math.max(30,C(L)-q),!1,!1,R);ne.cut=A(ce),W&&ne.drop?.tone==="normal"&&(ne.drop=null,ne.showDrop=!1),k.cards.push(ne)};for(let I of we){if(T(I.en))continue;let ce=C(I.s),L=Math.max(24,C(I.en)-ce);if(I.type==="stay"){let Y=V.get(I.g.event??I.g.serves??"");if(Y?.own===R){Re(Y,I.s,I.en,!0);continue}let Te=Y?u.get(Y.kid)??pe(0):pe(0),wt=I.g.kids.map(S);k.stays.push({cut:A(I.s),key:`${p.date}|stay|${R}|${I.s}`,x:Q.x+8,y:ce,w:Q.w-16,h:L,target:he(Y?.id),color:Te,l1:Y?`At ${Y.title} with ${S(Y.kid)}`:"Staying",l2:`until ${F(I.en)}`+(wt.length?` · ${wt.join(" and ")} too`:"")});continue}let W=I.legs[0],q=I.legs[I.legs.length-1],ne=[];for(let Y of I.legs)for(let Te of Y.kids)ne.includes(Te)||ne.push(Te);let re=q.type==="drive"&&q.to==="home",ie=Gn(I.legs,m);k.trips.push({key:`${p.date}|trip|${R}|${I.s}`,x:Q.x+8,y:ce,w:Q.w-16,h:L,target:he(I.legs.find(Y=>Y.serves)?.serves),l1:W.type==="drive"&&W.from==="home"?`Leave ${F(I.s)}`:`From ${un(m,W.from??W.place)} ${F(I.s)}`,l2:ie.join(" → "),show2:L>=36,l3:re?`Home ${F(I.en)}`:"",show3:re&&L>=62,stops:null,kids:ne.map(Y=>(u.get(Y)??pe(0)).color),bad:I.legs.some(Y=>Y.overlaps_busy),aria:`${b(R)} drives ${ie.join(" to ")}, ${F(I.s)} to ${F(I.en)}`})}for(let I of ge.segments)if(!(!I.overlaps_busy||I.start==null||I.end==null))for(let ce of ge.busy){let L=Math.max(I.start,ce.start),W=Math.min(I.end,ce.end);W<=L||T(W)||k.overlaps.push({key:`${p.date}|overlap|${R}|${L}`,x:Q.x+6,y:C(L)-2,w:Q.w-12,h:Math.max(8,C(W)-C(L)+4)})}for(let I of p.events)if(I.own===R&&(!at.has(I.id)&&!T(X(I)[1])&&Re(I,...X(I),!1),I.takes!=null&&I.attending!==!1&&!T(I.end))){let ce=C(I.start);k.windows.push({key:`${p.date}|window|${I.id}`,x:Q.x+4,y:ce,w:Q.w-8,h:Math.max(24,C(I.end)-ce),label:`${I.title} · any time ${F(I.start)}–${F(I.end)}`})}for(let I of ge.busy){if(I.event||I.end<=D||I.start>=y)continue;let ce=z(R,I),L=C(ce.start),W=C(ce.end);k.busy.push({key:`${p.date}|busy|${R}|${ce.start}`,x:Q.x+1,y:L,w:Q.w-2,h:W-L,labelY:8,label:ji(ce,!1)})}}let G=-1/0;for(let R=D;R<=y;R+=30)k.grid.push({key:`${p.date}|grid|${R}`,y:C(R),strong:R%60===0}),R%60===0&&C(R)-G>=22&&(k.hours.push({key:`${p.date}|hour|${R}`,y:C(R)-8,label:li(R)}),G=C(R));p.date===n.date&&n.minutes>D&&n.minutes<y&&(k.now={y:C(n.minutes),label:`Now ${F(n.minutes)}`}),M=C(y)+Vn;return}let ee=[];for(let g of l){let B=c.get(g);for(let U of p.kids[g]?.items??[])if(U.start!=null){if(U.type==="act"){let D=V.get(U.event??"");if(!D)continue;ee.push({col:g,s:U.start,h:Wi(D,B.w),kind:"act",item:U})}else if(!p.rides[U.ride??-1]?.own){let D=p.rides[U.ride??-1],y=D?p.drivers[D.driver]?.outings.find(T=>T.start!=null&&T.start<=de(D.start)&&de(D.start)<=de(T.end,T.start)):void 0;ee.push({col:g,s:y?.start??U.start,h:ga,kind:"along",item:U})}}}for(let g of d){let B=p.drivers[g];if(!B)continue;for(let D of B.busy)D.event||ee.push({col:g,s:D.start,h:32,kind:"busy",busy:z(g,D)});let U=c.get(g).w;for(let D of p.events)D.own!==g||D.attending!==!1&&(D.takes==null||D.planned!=null)||ee.push({col:g,s:X(D)[0],h:Wi(D,U),kind:"own",event:D});for(let D of B.outings){if(D.start==null)continue;let y=D.lines.length-(Hi(D.lines)?1:0);ee.push({col:g,s:D.start,h:30+y*16+(D.warn?16:0),kind:"out",out:D})}}ee.sort((g,B)=>g.s-B.s||h.indexOf(g.col)-h.indexOf(B.col));let ve=new Map,fe=[],O=new Map,se=P-Ui;for(let g=0;g<ee.length;){let B=g,U=se+Ui;for(;B<ee.length&&ee[B].s===ee[g].s;B++){let y=ve.get(ee[B].col);y!=null&&(U=Math.max(U,y+dn))}let D=new Set;for(let y=g;y<B;y++){let T=ee[y],A=D.has(T.col)?ve.get(T.col)+dn:U;D.add(T.col),ve.set(T.col,A+T.h)}O.set(ee[g].s,U),ee[g].s>0&&k.hours.push({key:`${p.date}|hour|${ee[g].s}`,y:U+2,label:Ke(ee[g].s)}),se=U,g=B}ve.clear(),ee.forEach((g,B)=>{let U=ve.get(g.col),D=Math.max(U!=null?U+dn:P,O.get(g.s));ve.set(g.col,D+g.h);let y=g.kind==="busy"?g.busy.end:g.kind==="act"?V.get(g.item.event??"")?.end??null:g.kind==="own"?X(g.event)[1]:null;fe.push({col:g.col,s:g.s,end:y,y:D,h:g.h,box:null}),k.anchors.push({t:H+g.s,y:D});let T=c.get(g.col);if(g.kind==="busy"){let A={key:`${p.date}|busy|${g.col}|${B}`,x:T.x+1,y:D,w:T.w-2,h:g.h,labelY:8,label:ji(g.busy,!0)};k.busy.push(A),fe[fe.length-1].box=A}else if(g.kind==="out"){let A=g.out,C=Hi(A.lines),G=C?A.lines.slice(0,-1):A.lines;k.trips.push({key:`${p.date}|trip|${g.col}|${B}`,x:T.x+8,y:D,w:T.w-16,h:g.h,target:he(A.target),l1:C?`${A.lead} · home ${C}`:A.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...G.map(R=>({text:R,warn:!1})),...A.warn?[{text:A.warn,warn:!0}]:[]],kids:A.kids.map(R=>(u.get(R)??pe(0)).color),bad:!!A.warn,aria:`${b(g.col)}: ${A.lead}. ${A.lines.join(". ")}${A.warn?`. ${A.warn}`:""}`})}else if(g.kind==="own"){let A=K(g.event,T.x+8,D,T.w-16,g.h,!1,!0,g.col);k.cards.push(A),fe[fe.length-1].box=A}else if(g.kind==="act"){let A=V.get(g.item.event??""),C=K(A,T.x,D,T.w,g.h,g.item.clash,!0,g.col);k.cards.push(C),fe[fe.length-1].box=C}else{let A=p.rides[g.item.ride??-1],C=Gn(J(A.index),m),G=b(A.driver);k.rides.push({key:`${p.date}|ride|${A.index}`,x:T.x,y:D,w:T.w,h:g.h,target:Z(A.index),l1:`${pn} with ${G}`,l2:C.join(" → "),show2:!1,lines2:Ji,dashed:!0,clash:g.item.clash,aria:`${S(g.col)} riding along with ${G}, ${F(de(A.start))} to ${F(de(A.end))}: ${C.join(" to ")}`})}});let te=P;for(let g of ve.values())te=Math.max(te,g);for(let g of fe){if(!g.box||g.end==null)continue;let B=g.y+g.h;for(let U of fe)U.col!==g.col&&U.s>=g.s&&U.s<g.end&&(B=Math.max(B,U.y+U.h));g.end>=1440&&(B=te);for(let U of fe)U.col===g.col&&U.y>g.y&&(B=Math.min(B,U.y-dn));B=Math.min(B,te),B>g.y+g.h&&(g.box.h=B-g.y)}M=te+Vn+6,k.anchors.push({t:H+1439,y:M})}),k.height=M,k}var ma=["","¼","½","¾"];function Ze(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Et(n);let o=Math.round(n*4),i=Math.floor(o/4),r=ma[o%4];return`${i||!r?i:""}${r} min`})}function eo(s){let t=e=>e?{...e,text:Ze(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Ze),warn:i.warn==null?i.warn:Ze(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:Ze(n.title),body:Ze(n.body),note:n.note==null?n.note:Ze(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Ze(o.note)}))}:{}}))}))}}var ba=2,ya=48;function to(s,t,e=ya){let n=[],o=new Set(_e(s)),i=Me(s).map(u=>xe(s,u)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],a=0,c=0,l=0,d=0,h=t.minutes+e*60;for(let u of s.days){let m=Ae(t.date,u.date),S=m===0?"":`${ye(u.date)} · `,b=new Map(u.events.map(p=>[p.id,p])),k=p=>p&&b.has(p)?{day:u.date,event:p}:null,M=(p,j)=>m*1440+(p??b.get(j??"")?.start??0)<h;for(let p of u.issues)if(p.level==="problem"){if(!M(p.at,p.event)){l++,p.kind==="unassigned"&&d++;continue}a++,p.kind==="unassigned"&&c++,n.push({key:`${u.date}|${p.key}`,tone:p.kind==="unassigned"?"unassigned":"problem",title:S+p.title,body:p.body,target:k(p.event),suggestions:(p.suggestions??[]).map(j=>({id:j.id,label:j.label,note:j.note}))})}if(u.clashes.forEach((p,j)=>{if(!M(p.a.start,p.a.event)){l++;return}a++;let H=b.get(p.a.event??""),V=xe(s,p.kid),he=(w,x)=>{let $=k(x);return $?{text:w,target:$}:w},v=[];if(p.b.type==="act"){let w=b.get(p.b.event??"");H&&w&&(v=[he(H.title,H.id),` ${F(H.start)}–${F(H.end)} and `,he(w.title,w.id),` ${F(w.start)}–${F(w.end)} overlap.`])}else{let w=u.rides[p.b.ride??-1];H&&w&&(v=[`${V} is in `,he(`${me(s,w.driver)}’s car`,w.serves[0]),` ${F(de(p.b.start))}–${F(de(p.b.end))}, during `,he(H.title,H.id),"."])}n.push({key:`${u.date}|clash|${j}`,tone:"problem",title:`${S}${V} is double-booked`,body:v.map(w=>typeof w=="string"?w:w.text).join(""),parts:v,target:null,suggestions:[]})}),m>=0&&m<ba)for(let p of u.issues)p.level!=="heads_up"||!M(p.at,p.event)||n.push({key:`${u.date}|${p.key}`,tone:"heads_up",title:S+p.title,body:p.body,target:k(p.event),suggestions:[]});for(let p of u.unplaced??[]){if(!M(p.at)){l++;continue}a++;let j=p.people.map(H=>o.has(H)?me(s,H):xe(s,H));n.push({key:`${u.date}|unplaced|${p.id}`,tone:"problem",title:`${S}${F(p.at)} ${p.title}: ${no(p).toLowerCase()}`,body:p.reason==="unknown"&&p.word?`“${p.word}” isn’t anyone in the family, so this is only in ${mn(j)}’s lane. If it’s a misspelt name, fix the title in Google Calendar.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Start the title in Google Calendar with who it’s for, such as “${r[0]} Piano”, or “${r.join(" & ")} Piano” for both.`,target:null,suggestions:[]})}for(let p of u.events)!p.problems.length||!M(p.start)||n.push({key:`${u.date}|notes|${p.id}`,tone:"heads_up",title:`${S}Check the notes on ${gn(s,p)}’s ${p.title}`,body:`These lines couldn’t be read: ${p.problems.join("; ")}`,target:k(p.id),suggestions:[]})}return{items:n,problems:a,unassigned:c,later:l,laterUnassigned:d}}function no(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function xa(s,t,e,n){let o=new Set(_e(s)),i=d=>{let h=d[0];return h==null?null:o.has(h)?Lt:e.get(h)??null},r=[...(t.all_day??[]).map(d=>({key:`${t.date}|allday|${d.id}`,title:d.title,note:d.days>1?`Day ${d.day_number} of ${d.days}`:"",color:i(d.people),cancelled:d.cancelled,warn:!1})),...(t.unplaced??[]).map(d=>({key:`${t.date}|unplaced|${d.id}`,title:`${F(d.at)} ${d.title}`,note:no(d),color:null,cancelled:!1,warn:!0}))];if(!r.length)return null;let a=Math.max(120,n-ut),c=1,l=0;for(let d of r){let h=Math.min(a,30+7*(d.title.length+(d.note?d.note.length+2:0)));l&&l+h>a&&(c++,l=0),l+=h}return{key:`${t.date}|allday`,h:c*ra+(c-1)*Vi,chips:r}}function so(s,t){let e=$e(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=Ae(t.date,i.date);if(!(r<0))for(let a of _e(s))for(let c of i.drivers[a]?.outings??[]){if(c.start==null)continue;let l=r*1440+c.start;if(r*1440+de(c.end,c.start)<=t.minutes)continue;let h=l-t.minutes,u={driver:a,name:me(s,a),date:i.date,ahead:r,start:c.start,inMinutes:h,ongoing:h<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(m=>e.get(m)??pe(0)),warn:c.warn,target:c.target&&i.events.some(m=>m.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(u)<o(n)||o(u)===o(n)&&u.inMinutes<n.inMinutes)&&(n=u)}}return n}function pt(s){return s.state==="done"||s.state==="late"}var va=780;function wa(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<va}function io(s,t){return s.chores.map(e=>wa(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function oo(s){return s.state==="open"||s.state==="overdue"}function is(s,t,e){if(pt(s)){let n=s.done_at?ka(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${ns(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${ns(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=Ae(t,s.due);return`By ${o===1?"tomorrow":o<7?ye(s.due):ss(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${ns(s.for_day,t)}`;if(s.due&&s.due>t){let n=Ae(t,s.due);return n===1?"By tomorrow":`By ${n<7?ye(s.due):ss(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function ns(s,t){let e=Ae(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ye(s):ss(s)}function ss(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ka(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${ye(i)} ${r}`}function ro(s,t,e=1440){let n=io(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(d=>d.kid===o.id),a=new Map;for(let d of r){if(d.state!=="upcoming")continue;let h=d.shows_from??d.due??s.today;a.set(h,[...a.get(h)??[],d])}let c=r.filter(d=>d.state==="overdue"),l=r.filter(d=>d.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??pe(i),overdue:c,now:l,done:r.filter(pt),later:[...a.entries()].sort(([d],[h])=>d.localeCompare(h)).map(([d,h])=>({date:d,chores:h})),left:c.length+l.length}})}function ao(s,t=1440){return io(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function os(s){return!s.chores.length&&!s.templates.length}var Qe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function rs(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>Qe.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function as(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Qe[n[0]]}-${Qe[n.at(-1)]}`]:n.map(o=>Qe[o])).join(", ")}var et="none";function bn(s){return s==="daily"||s==="school"?"":"Any"}function lo(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function co(s){let t=s.days??bn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function ls(s){return s.title.trim()?s.who.length?s.days===et?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function ho(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function cs(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function ds(s,t,e=1,n=!1,o=!1){if(s==="school"){let d=t.trim().replace(/-/g,"–"),h=o?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return n?`${h}, the night before`:h}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let l=`${a.split(",").map(d=>{let h=d.trim();return h.toLowerCase()==="last"?"the last day":/^\d+$/.test(h)?`the ${cs(Number(h))}`:`the ${h}`}).join(" and ")} ${r}`;return l[0].toUpperCase()+l.slice(1)}function hs(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function us(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function yn(s,t){return`${s}|${t}`}function ft(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function xn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function uo(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function po(s,t){return xn(t)<5&&!uo(s,t)}function Rt(s,t,e=new Map){if(!po(s,t))return null;let n=yn(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function gt(s,t){return po(s,t)?s.menus?.[t]??null:null}var $a="From the school's menu feed.";function Ea(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==$a);return t.length?t.join(`
`):null}function Pe(s){return s.slice(0,7)}function vn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function ps(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function fo(s){let t=[];for(let e=Pe(s.first);e<=Pe(s.last);e=ps(e))t.push(e);return t}function go(s,t,e,n=new Map){let o=`${e}-01`,i=ft(o,-xn(o)),r=[];for(;Pe(i)<=e;){let a=[];for(let c=0;c<5;c++){let l=ft(i,c),d=Pe(l)!==e,h=d?null:uo(t,l),u=d?null:Rt(t,l,n);a.push({date:l,day:Number(l.slice(8)),outside:d,off:h?h.title:null,lunch:u?.lunch??null,picked:u?.picked??!1,menu:d?null:gt(t,l)?.dish??null,sides:d?null:Ea(gt(t,l)?.details??""),past:l<s.today,today:l===s.today})}a.some(c=>!c.outside)&&r.push(a),i=ft(i,7)}return r}function mo(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function bo(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function yo(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=ft(t,i),a=Rt(s,r,n);if(!a)continue;let c=Ae(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":ye(r),date:r,menu:gt(s,r)?.dish??null}}return null}var _a={timeline:"timeline",full:"timeline",compact:"compact"};function tt(s){let t=new URLSearchParams(s),e={},n=_a[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var Ta=["auth_callback","code","state"];function fs(s){let t=new URLSearchParams(s);for(let n of Ta)t.delete(n);let e=t.toString();return e?`?${e}`:""}function gs(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Ca(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function Aa(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&gs(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function Sa(s,t){let e=new Set(s.events.filter(i=>Ca(s,i)<=t).map(i=>i.id)),n=i=>gs(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:Aa(r.segments,t),outings:r.outings.filter(a=>a.start==null||gs(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function xo(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?Sa(e,t.minutes):e)}}var vo=qe`
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
`;var or="mydashlight.rides.mode",ac=1100,lc=440,cc=700,dc=3*6e4,hc=1200;function uc(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Sn=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,tr=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,pc=new URL("emoji.json",import.meta.url).href,nr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],sr=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,ir=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,fc=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,gc=le`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Ot={bring:"Bring",buy:"Buy"};function mc(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Le(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Is(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function bc(s,t){return ts(s,t)||Ce(s).split(",")[0]}function yc(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function xc(){try{return localStorage.getItem(or)==="compact"?"compact":"timeline"}catch{return"timeline"}}function vc(s){try{localStorage.setItem(or,s)}catch{}}function jt(s){return s.days.every(t=>!t.events.length)}var Nt=class extends Ee{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=tt(location.search).view;this.urlPage=tt(location.search).page;this.urlPast=tt(location.search).past;this.urlDayPicker=tt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},dc))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??xc(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.railTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(l=>l.id===r);(!c||(c.picks[a]??null)===i||!Rt(c,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&pt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=eo(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<ac)return!1;let e=this.plan;return!e||this.width-lc>=Jn(Me(e).length,_e(e).length)}today(){return $t(this.plan?.time_zone??uc())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:xo(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=Qi(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(d=>d.date===this.pinDay)?.h??Dt,a=Qn(e,i.scrollTop+r+4),c=n.days[Math.floor(a/1440)]?.date,l=c?o.days.findIndex(d=>d.date===c):-1;l>=0&&(this.keepAt=l*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,Yi(o,e)-qi(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let c=1/0;if(this.mode==="timeline"){for(let l of a.events)c=Math.min(c,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let d of l.outings)d.start!=null&&(c=Math.min(c,d.start))}this.scrollToTime(r*1440+(Number.isFinite(c)?Math.max(0,c-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=n+1&&(o=c);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),a=this.today().date;if(r){let c=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),l=c>0?"up":"down";this.board.dayHeads.some(d=>d.date===a)&&o.date!==a?i=`${l}|Today`:this.mode==="timeline"&&Math.abs(c)>e.clientHeight*.6&&(i=`${l}|${o.date===a?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof ae?r:new ae("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??pt(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=gt(e,n),r=o.filter(a=>a.id===e.id||i&&gt(a,n)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof ae?o:new ae("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(yn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let l of n)a.delete(yn(e,l));this.lunchDraft=a;let c=r instanceof ae?r:new ae("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?co(e):lo(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(er(),Qo))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ls(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(ho(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof ae?n:new ae("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof ae?n:new ae("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Dt;this.keepAt=n&&this.board?Qn(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||vc(e)}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof ae?i:new ae("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),hc)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?to(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?ao(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],c=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",d=f`<aside class="panel" aria-label=${l}>
      ${c??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,h=this.page==="rides";return f`
      <div class="app ${r?"wide":this.width<cc?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${h?this.renderBanner(e):_}
          <main>
            ${h?f`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?jt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!jt(o)?this.renderDayRail(o):_}
                  ${n&&this.away?this.renderBackToToday(this.away):_}
                </section>`:this.page==="lunch"?f`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${d}`:_}
          </main>
        </div>
        ${r?d:_}
        ${this.toast?f`<div class="toast" role="status">${this.toast}</div>`:_}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),a="";if(e){let u=e.time_zone,m=new Date(e.updated);this.error?a=f`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Gt(m,new Date,u)}</span>`:e.status&&!e.status.ok?a=f`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Gt(m,new Date,u)}</span>`:this.backend?.live||(a=`Updated ${Gt(m,new Date,u)}`)}let c=(u,m,S,b)=>f`
      <button type="button" class="seg-btn" title=${b} aria-pressed=${this.mode===u?"true":"false"} @click=${()=>this.setMode(u)}>
        ${S}<span class="seg-label">${m}</span>
      </button>
    `,l=(u,m,S)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===u?"true":"false"} @click=${()=>this.setPage(u)}>
        ${S}<span class="seg-label">${m}</span>
      </button>
    `,d=Ke(r.minutes),h=!!e&&jt(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${le`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:_}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ce(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Ce(r.date)}${typeof a=="string"&&a?f`<span class="status"> · ${a}</span>`:_}
          </p>
          ${a&&typeof a!="string"?f`<p class="status">${a}</p>`:_}
        </div>
        ${e&&!h?this.renderNext(e,so(e,r),n):_}
        <div class="controls">
          ${this.wide||h&&!o?_:f`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?_:f`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",le`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",le`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${l("rides","Rides",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${l("chores","Chores",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?_:l("lunch","Lunch",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let l=this.today().date,d=o.unassigned,h=o.laterUnassigned;if(d){let m=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?f`<div class="next idle needs">${m}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${m}</button>`}if(h)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let u=e.days.some(m=>m.date>=l&&m.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${u?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${u?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${Et(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${ye(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=f`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Le(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(l=>f`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
        ${n.warn?f`<span class="next-stop warn">${n.warn}</span>`:n.stop?f`<span class="next-stop">${n.stop}</span>`:_}
      </span>
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?f`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:f`<div class=${c}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return _;let n=this.today().date,o=$e(e),i=this.railShown;return f`<div
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
        ${e.days.map(r=>{let a=es(r),c=r.events.length,l=r.events.slice(0,4).map(h=>h.own?Lt.color:o.get(h.kid)?.color??pe(0).color),d=`${Ce(r.date)}: ${c?`${c} ${c===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return f`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${d}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":ye(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${l.length?l.map(h=>f`<span class="rd-dot" style="background:${h}"></span>`):f`<span class="rd-free">free</span>`}
            </span>
            ${a?f`<span class="rd-badge" aria-hidden="true">${a}</span>`:_}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return f`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${le`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=Me(e),o=_e(e),i=$e(e),r=n.map(a=>xe(e,a));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>le`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${yc(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=i.get(a);return f`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Le(xe(e,a))}</span>
            <span class="qw-name">${xe(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Le(me(e,a))}</span>
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
    </div>`}renderBanner(e){if(e?.needs_setup==="events_calendar")return f`<div class="notice-bar" role="status">
        Pick your family calendar to see the week: in Home Assistant, open Settings &gt; Devices &amp; services &gt; MyDashLight &gt;
        Configure &gt; Calendars.
      </div>`;let n=e?.unavailable_calendars.length??0;return n?f`<div class="notice-bar" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:_}renderEmpty(){return this.error?f`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:f`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderHead(e,n=!1){return f`<div class="dh-line">
        <button
          type="button"
          class="dh-jump"
          tabindex=${n?-1:0}
          aria-label=${`${e.label}: go to this day`}
          @click=${()=>this.tapHead(e.date)}
        >
          <span class="label">${e.label}</span>${e.tag?f`<span class="tag">${e.tag}</span>`:_}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
      </div>
      ${e.allDay.length?f`<div class="day-strip" style="padding-left:${ut}px">
            ${e.allDay.map(o=>f`<span
                  class="strip-chip ${o.warn?"warn":""} ${o.cancelled?"skipped":""} ${o.color?"":"plain"}"
                  style=${o.color?`--c:${o.color.color};--rgb:${o.color.rgb};--ink:${o.color.ink}`:""}
                  ><span class="strip-title">${o.title}</span>${o.note?f`<span class="strip-note">${o.note}</span>`:_}</span
                >`)}
          </div>`:_}`}renderBoard(e){let n=this.sel,o=l=>!!l&&!!n&&l.day===n.day&&l.event===n.event,i=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],r=e.width,a=100,c=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??a-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??a})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??a+1}))].sort((l,d)=>l.z-d.z);return f`
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
          ${e.columns.map(l=>f`<div class="col-head ${l.kind}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${Le(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0):_}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        ${i?f`<div class="pinned" aria-hidden="true" style="width:${r}px;height:${i.h}px;margin-bottom:${-i.h}px">
              ${this.renderHead(i,!0)}
            </div>`:_}
        <div class="canvas" style="width:${r}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(l=>f`<div
                class="col-bg ${l.kind}"
                style="left:${l.x}px;width:${l.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${l.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(l=>f`<div class="day-head" style="top:${l.y}px;width:${r}px;height:${l.h}px">${this.renderHead(l)}</div>`)}
          ${e.empties.map(l=>f`<span class="empty" style="top:${l.y}px">${l.text}</span>`)}
          ${e.grid.map(l=>f`<div class="grid ${l.strong?"strong":""}" style="top:${l.y}px;width:${r-60}px"></div>`)}
          ${e.hours.map(l=>f`<span class="hour" style="top:${l.y}px">${l.label}</span>`)}
          ${je(e.bands,l=>l.key,l=>f`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${je(e.busy,l=>l.key,l=>f`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${je(e.windows,l=>l.key,l=>f`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${je(c,l=>l.x.key,l=>{if(l.t==="link"){let m=l.x;return f`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-color:${m.color.color};background:linear-gradient(rgba(${m.color.rgb},0.11), rgba(${m.color.rgb},0.11)), var(--surface)"
                ></div>`}if(l.t==="prep"){let m=l.x;return f`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-color:${m.color.color};background:linear-gradient(rgba(${m.color.rgb},0.11), rgba(${m.color.rgb},0.11)), var(--surface);color:${m.color.ink}"
                >
                  ${m.label}
                </div>`}if(l.t==="ride"){let m=l.x;return f`<button
                  type="button"
                  class="ride ${m.dashed?"dashed":""} ${m.clash?"clash":""}"
                  aria-label=${m.aria}
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;padding-top:${3+(m.tuckTop??0)}px;padding-bottom:${3+(m.tuckBottom??0)}px"
                  @click=${()=>this.open(m.target)}
                >
                  <span class="l1">${m.l1}</span>${m.show2?f`<span class="l2" style="-webkit-line-clamp:${m.lines2}">${m.l2}</span>`:_}
                </button>`}let d=l.x,h=d.color,u=d.skipped?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.10) 0px, rgba(${h.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:d.stayed?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.24) 0px, rgba(${h.rgb},0.24) 6px, rgba(${h.rgb},0.08) 6px, rgba(${h.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${h.rgb},0.15), rgba(${h.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${d.wrap?"wrap":""} ${o(d.target)?"sel":""} ${d.clash?"clash":""} ${d.skipped?"skipped":""} ${d.cut?"cut":""}"
                aria-label=${d.aria}
                style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:${u};border-color:${d.clash?"var(--bad)":`rgba(${h.rgb},0.45)`};--c:${h.color};--rgb:${h.rgb};--ring:${h.color}"
                @click=${()=>this.open(d.target)}
              >
                <span class="top">
                  <span class="title">${d.title}</span>
                  <span class="time">${d.time}</span>
                  ${d.showDrop&&d.drop?f`<span class="line tone-${d.drop.tone}">${d.drop.text}</span>`:_}
                </span>
                ${d.showPick&&d.pick?f`<span class="line tone-${d.pick.tone}">${d.pick.text}</span>`:_}
              </button>`})}
          ${je(e.stays,l=>l.key,l=>f`<button
                type="button"
                class="stay ${l.cut?"cut":""}"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${je(e.trips,l=>l.key,l=>f`<button
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
          ${je(e.overlaps,l=>l.key,l=>f`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${je(e.marks,l=>l.key,l=>f`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:_}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,a=this.plan,c=i+n.length,l=this.chores,d=!!l&&!os(l);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?_:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?f`<div class="attn-chores">${n.map(h=>this.renderChoreRow(h,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${le`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${jt(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:_}
      ${o.map(h=>f`<div class="issue ${h.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${h.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${h.target?f`<button type="button" class="issue-title" @click=${()=>this.open(h.target,!0)}>${h.title}</button>`:f`<strong class="issue-title">${h.title}</strong>`}
              <span class="issue-body"
                >${h.parts?h.parts.map(u=>typeof u=="string"?u:f`<button type="button" class="issue-link" @click=${()=>this.open(u.target,!0)}>${u.text}</button>`):h.body}</span
              >
            </div>
          </div>
          ${h.suggestions.length?f`<div class="fixes">
                ${h.suggestions.map(u=>f`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(u.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${u.id}`?"Saving…":u.label}</span>
                    <span class="fix-note">${u.note}</span>
                  </button>`)}
              </div>`:_}
        </div>`)}
      ${this.wide&&a&&!jt(a)&&this.page==="rides"?this.renderLegend():_}
    `}kidColorOf(e){let n=this.plan?$e(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return pe(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(l=>l.id===e);if(!o||!i)return _;this.tick;let r=this.today(),a=yo(i,r.date,r.minutes,this.lunchDraft);if(!a)return _;let c=Ot[a.lunch];return f`<span class="lunch-chip ${a.lunch} ${n?"small":""}" title=${`${c} lunch ${a.when}${a.menu?`: ${a.menu}`:""}`}
      >${a.lunch==="bring"?sr:ir}<span class="lunch-chip-text"
        >${c}${n?_:` ${a.when}`}${!n&&a.menu?f`<span class="lunch-chip-menu"> · ${a.menu}</span>`:_}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return f`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=fo(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Pe(e.today),i=n.indexOf(o),r=d=>{let h=n[i+d];h&&(this.lunchMonth=h)},a=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(d=>d.id===a):e.kids,l=e.status&&!e.status.ok?f`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:_;return f`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${le`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${vn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
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
          ${this.menuMode?"Done":f`${tr} Edit menus`}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),a=go(e,n,o,this.lunchDraft),c=bo(a),l=a.flat(),d=l.filter(b=>!b.outside&&!b.past&&b.lunch),h=n.days_off.filter(b=>Pe(b.first)<=o&&o<=Pe(b.last)),u=b=>d.filter(k=>xn(k.date)===b),m=b=>{let k=u(b);if(!k.length)return;let M=k.every(p=>p.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,k.map(p=>p.date),M)},S=d.length?`${c.bring} Bring · ${c.buy} Buy${o===Pe(e.today)?" left this month":""}`:"No school days left this month";return f`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Le(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${S}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Ot[n.default]} unless picked</span>
          ${e.kids.length<2?_:f`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?gc:fc}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?f`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:_}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${vn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((b,k)=>f`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!u(k).length}
            aria-label=${`${u(k).every(M=>M.lunch==="bring")?"Buy":"Bring"} every ${b} left in ${vn(o)} for ${n.name}`}
            @click=${()=>m(k)}
          >
            ${b}
          </button>`)}
        ${l.map(b=>this.renderLunchCell(n,b,i))}
      </div>
      ${h.length?f`<p class="lunch-offs">
            No school:
            ${h.map(b=>{let k=b.first<`${o}-01`?`${o}-01`:b.first,M=Pe(b.last)>o?ft(`${ps(o)}-01`,-1):b.last;return`${k===M?Is(k):`${Is(k)}–${Is(M)}`} ${mo(b.title)}`}).join(" · ")}
          </p>`:_}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return f`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return f`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,l=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${Ce(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Ce(n.date)}: ${Ot[i]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Ot[r]}.`;return f`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${l?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?sr:ir}${Ot[i]}</span>
      ${n.menu?f`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?f`<span class="lunch-sides">${n.sides}</span>`:_}`:c?f`<span class="lunch-menu add">${Sn} Menu</span>`:_}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(M=>M.id===e.kid),a=(this.plan?$e(this.plan).get(e.kid):void 0)??pe(Math.max(0,r)),c=o.kids[r]?.name??"",l=i===pt(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},d=i&&l.done_by&&l.done_by!==e.kid?o.people?.find(M=>M.id===l.done_by)?.name??l.done_by_name??null:null,h=`${is(l,o.today,o.time_zone)}${d?` · by ${d}`:""}`,u=i||oo(e),m=`${n?`${c}: `:""}${e.title}. ${h?`${h}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,S=f`<span class="box" aria-hidden="true"
        >${i?le`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:_}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:_}
      <span class="chore-text">
        <span class="chore-title">${n?f`<span class="chore-kid">${c}</span> · `:_}${e.title}</span>
        ${h?f`<span class="chore-note">${h}</span>`:_}
      </span>`,b=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${u?"":"later"}`,k=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return u?f`<button type="button" class=${b} style=${k} aria-pressed=${i?"true":"false"} aria-label=${m} @click=${()=>this.tapChore(e)}>
          ${S}
        </button>`:f`<div class=${b} style=${k}>${S}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return f`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return f`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(os(e))return f`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Sn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?f`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:_;this.tick;let i=ro(e,this.plan?$e(this.plan):void 0,this.today().minutes);return f`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Sn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${tr} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return f`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Le(r.name)}</span>
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
            ${r.later.map(c=>f`<h3 class="chore-group">${c.date===e.today?"Later today":bc(c.date,e.today)}</h3>
                ${c.chores.map(l=>this.renderChoreRow(l))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?f`<p class="chore-none">No chores this week.</p>`:_}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?$e(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?f`<span class="tmpl-note bad">${e.problems.map(us).join(" · ")} · tap to set up</span>`:f`<span class="tmpl-note">${hs(e.who,o,e.take_turns)} · ${ds(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return f`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?f` <span class="tag-paused">Paused</span>`:_}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let l=o.findIndex(h=>h.id===c),d=i?.get(c)??pe(Math.max(0,l));return f`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return f`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Sn} Add a chore</button>
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
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return f``;let o=n.kids,i=this.plan?$e(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(b=>b.id===e.template):void 0,c=ls(e),l=(a?.problems??[]).filter(b=>b!=="who:"),d=(b,k,M,p=!1)=>f`<button type="button" class="choice ${p?"wide":""}" aria-pressed=${b?"true":"false"} ?disabled=${r} @click=${M}>${k}</button>`,h=(b,k,M,p)=>f`<button type="button" class="chip" aria-pressed=${b?"true":"false"} aria-label=${p??_} ?disabled=${r} @click=${M}>${k}</button>`,u=b=>{b!==e.repeats&&this.changeDraft({repeats:b,days:a&&a.repeats===b?a.days??bn(b):bn(b)})},m=b=>{let k=e.who.includes(b)?e.who.filter(M=>M!==b):o.filter(M=>M.id===b||e.who.includes(M.id)).map(M=>M.id);this.changeDraft({who:k})},S;if(e.repeats==="school"){let b=e.days===et?new Set:e.days===""?new Set([0,1,2,3,4]):rs(e.days)??new Set,k=M=>{let p=new Set(b);p.has(M)?p.delete(M):p.add(M),this.changeDraft({days:p.size===5?"":p.size?as(p):et})};S=f`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Qe.slice(0,5).map((M,p)=>h(b.has(p),M.slice(0,2),()=>k(p),M))}
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
        </div>`}else if(e.repeats==="monthly"){let b=e.days.trim(),k=/^\d+$/.test(b)?Number(b):null,M=b&&b.toLowerCase()!=="any"&&b.toLowerCase()!=="last"&&k===null;S=f`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${M?4:3}, minmax(0, 1fr))">
          ${d(b===""||b.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d(k!==null,"On a date",()=>this.changeDraft({days:String(k??1)}))}
          ${d(b.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${M?d(!0,b,()=>{}):_}
        </div>
        ${k!==null?f`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||k<=1} @click=${()=>this.changeDraft({days:String(k-1)})}>−</button>
                <span class="arrive-value">${cs(k)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||k>=31} @click=${()=>this.changeDraft({days:String(k+1)})}>+</button>
              </span>
            </div>`:f`<p class="field-hint">${b.toLowerCase()==="last"?"Due on the month’s last day.":M?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")S=f`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let b=e.days===""||e.days.toLowerCase()==="any",k=e.days===et?new Set:b?new Set:rs(e.days)??new Set,M=p=>{let j=new Set(k);j.has(p)?j.delete(p):j.add(p),this.changeDraft({days:j.size?as(j)||"Mon-Sun":et})};S=f`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(b,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!b,"On set days",()=>this.changeDraft({days:b?"Sat":e.days}))}
        </div>
        ${b?f`<p class="field-hint">Shows all week, due on Sunday.</p>`:f`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Qe.map((p,j)=>h(k.has(j),p.slice(0,2),()=>M(j),p))}
              </div>
              <div class="chips">
                ${h(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${h(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:_}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?hs(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===et?"No days picked":ds(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${l.length?f`<p class="field-hint bad">${l.map(us).join(". ")}. Saving fixes it.</p>`:_}
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
          @input=${b=>this.changeDraft({title:b.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${nr.map(b=>h(e.icon===b,b,()=>this.changeDraft({icon:e.icon===b?null:b}),`Picture ${b}`))}
          ${e.icon&&!nr.includes(e.icon)?h(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):_}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?f`<emoji-picker
              class="emoji-more"
              .dataSource=${pc}
              @emoji-click=${b=>{let k=b.detail.unicode;k&&this.changeDraft({icon:k}),this.iconMore=!1}}
            ></emoji-picker>`:_}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((b,k)=>{let M=i?.get(b.id)??pe(k),p=e.who.includes(b.id);return f`<button type="button" class="who-chip" style="--c:${M.color};--rgb:${M.rgb}" aria-pressed=${p?"true":"false"} ?disabled=${r} @click=${()=>m(b.id)}>
              <span class="avatar" aria-hidden="true">${Le(b.name)}</span>${b.name}
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
          ${d(e.repeats==="daily","Every day",()=>u("daily"))}
          ${d(e.repeats==="weekly","Every week",()=>u("weekly"))}
          ${d(e.repeats==="monthly","Every month",()=>u("monthly"))}
          ${d(e.repeats==="school","School days",()=>u("school"))}
        </div>
      </div>
      ${S}
      ${e.repeats==="school"?_:f`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${mc(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${r}
          @input=${b=>this.changeDraft({details:b.target.value})}
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
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return f``;let o=e.busy,i=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>i({kids:e.kids.includes(d)?e.kids.filter(h=>h!==d):[...e.kids,d]}),a=n.kids.filter(d=>Rt(d,e.date)),c=e.dish.trim(),l=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${Ce(e.date)}</span>
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
          ${a.map(d=>{let h=this.kidColorOf(d.id),u=e.kids.includes(d.id);return f`<button type="button" class="who-chip" style="--c:${h.color};--rgb:${h.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${o} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${Le(d.name)}</span>${d.name}
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
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return f``;let o=n.people?.length?n.people:n.kids.map(h=>({...h,role:"kid"})),i=n.kids.findIndex(h=>h.id===e.kid),r=n.kids[i],a=this.plan?$e(this.plan):void 0,c=a?.get(e.kid)??pe(Math.max(0,i)),l=o.filter(h=>h.id!==e.kid),d=h=>{let u=n.kids.findIndex(m=>m.id===h.id);return u>=0?(a?.get(h.id)??pe(u)).color:"var(--dark)"};return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:_}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${is(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Le(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?f`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${l.map(h=>f`<button type="button" class="done-by" style="--c:${d(h)}" @click=${()=>void this.toggleChore(e,h.id)}>
                  <span class="avatar ${h.role==="parent"?"driver":""}" aria-hidden="true">${Le(h.name)}</span>
                  <span>${h.name}</span>
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
    </div>`}ownHint(e,n){let o=gn(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${F(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${F(n.start)} to ${F(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>_e(e).includes(r)?me(e,r):xe(e,r));return`${o} drives there and back${i.length?`, with ${mn(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return f``;let{day:o,event:i}=n,r=_e(e),a=Gi(e,i),c=gn(e,i),l=!!this.pending,d=O=>this.pending?.key===O?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let O of e.days)for(let se of O.events)for(let te of[se.drop,se.pick])te&&te!=="none"&&!r.includes(te)&&!h.some(g=>g.toLowerCase()===te.toLowerCase())&&h.push(te);let u=O=>{if(!i.sides.includes(O))return _;let se=d(O)??d("both"),te=O==="drop"?i.drop:i.pick,g=se!==void 0?String(se):i.no_ride_unless_named&&te==="none"?"":te,B=g===""&&!(se===void 0&&i.no_ride_unless_named),U=g&&g!=="none"&&!r.includes(g)?g:"",D=C=>{this.otherOpen=null,this.setRide(i,O,g===C?"":C,r)},y=[...r.map(C=>[C,Zn(e,C)]),["none","No ride"]],T=`${i.id}|${O}`,A=this.otherOpen===T;return f`<div class="field ride-box">
        <span class="field-label">${O==="drop"?"Drop-off":"Pick-up"} ${B?f`<span class="nobody">· nobody yet</span>`:_}</span>
        <div role="group" aria-label=${O==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${y.length+1}, minmax(0, 1fr))">
          ${y.map(([C,G])=>f`<button type="button" class="choice" aria-pressed=${g===C?"true":"false"} ?disabled=${l} @click=${()=>D(C)}>
                ${G}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${U?"true":"false"}
            aria-expanded=${A?"true":"false"}
            ?disabled=${l}
            @click=${()=>this.otherOpen=A?null:T}
          >
            ${U||"Other"}
          </button>
        </div>
        ${A?f`${h.length?f`<div role="group" aria-label=${O==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(C=>f`<button type="button" class="chip" aria-pressed=${g.toLowerCase()===C.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>D(C)}>
                    ${C}
                  </button>`)}
            </div>`:_}
        <input
          type="text"
          .value=${U&&!h.some(C=>C.toLowerCase()===U.toLowerCase())?U:""}
          ?disabled=${l}
          aria-label=${O==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${C=>{let G=C.target.value.trim();G&&G!==g&&D(G)}}
          @keydown=${C=>{C.key==="Enter"&&C.target.blur()}}
        />`:_}
        ${!M&&g!==""&&g!=="none"?m(O,g):_}
      </div>`},m=(O,se)=>{let te=d(`along-${O}`),g=te!==void 0?te:O==="pick"?i.pick_along??[]:i.along,B=[...Me(e).filter(D=>D!==i.kid),...r.filter(D=>D!==se)];return B.length?f`<div class="field-sub">
        <span class="field-label">${O==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${O==="pick"?"Coming home too. Anyone already there just gets in.":O==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${O==="drop"?"Riding along on the drop-off":O==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${B.map(D=>f`<button type="button" class="chip" aria-pressed=${g.includes(D)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(i,D,O)}>
              ${r.includes(D)?me(e,D):xe(e,D)}
            </button>`)}
        </div>
      </div>`:_},S=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",b=i.drop===i.pick&&r.includes(i.drop),k=d("stay"),M=k!==void 0?!!k:i.stay&&b,p=d("along"),j=p!==void 0?p:i.along,H=i.own?[...Me(e),...r.filter(O=>O!==i.own)]:[],V=i.own!=null&&i.takes!=null,he=i.own!=null&&!V,v=d("takes"),w=v!==void 0?v:i.takes??null,x=d("arrive"),$=this.arriveDraft!==void 0?this.arriveDraft:x!==void 0?x:i.arrive_by,E=i.sides.includes("drop")&&i.sides.includes("pick"),P=E&&(M||this.stayDraft===i.id),N=()=>{let O=E?f`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${P?"false":"true"}
              ?disabled=${l}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,S)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${P?"true":"false"}
              ?disabled=${l}
              @click=${()=>{S?this.toggleStay(i,!0,S):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:_;if(!P)return f`${O} ${u("drop")} ${u("pick")}`;let se=M&&b?i.drop:"";return f`${O}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${se?_:f`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(te=>f`<button
                type="button"
                class="choice"
                aria-pressed=${se===te?"true":"false"}
                ?disabled=${l}
                @click=${()=>{if(se===te||!this.backend)return;let g=this.backend;this.stayDraft=null,this.save("stay",!0,()=>g.setRide(i.id,"both",te,this.scope,!0))}}
              >
                ${me(e,te)}
              </button>`)}
          </div>
          ${se?m("both",se):_}
        </div>`},K=[],J=O=>O==="none"?"Not needed":Zn(e,O),Z=O=>r.includes(O)?me(e,O):xe(e,O),z=(O,se,te)=>{se===""&&!te.length||K.push(`${O}: ${[se===""?"TBD":J(se),...te.map(Z)].join(", ")}`)},X=O=>i.no_ride_unless_named&&O==="none"?"":O;i.own||z("Drop-off",X(i.drop),i.along),i.own||z("Pick-up",X(i.pick),i.pick_along??[]),!i.own&&i.stay&&K.push("Stay: yes"),V&&K.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&K.push(`Take along: ${i.along.map(Z).join(", ")}`),i.arrive_by!=null&&K.push(`Arrive by: ${Ke(i.arrive_by)}`);let oe=d("attending"),ee=oe!==void 0?!!oe:i.attending!==!1;i.attending===!1&&K.splice(0,K.length,"Attending: no");let ve=o.date===this.today().date?"":`${ye(o.date)} · `,fe=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${ve}${V?"any time ":""}${F(i.start)}–${F(i.end)}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return i.where==="home"?f`${fe}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${fe}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:_}
      ${i.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ye(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:_}
      ${ee?f`${i.where==="anywhere"?f`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:_}
            ${i.own?f`<p class="field-hint">${this.ownHint(e,i)}</p>`:N()}
      ${i.own?f`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${w!=null?`Takes ${w} min, any time ${F(i.start)}–${F(i.end)}`:"At its set time"}</span>
            </span>
            ${w!=null?f`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${l||w<=5} @click=${()=>this.setTakes(i,Math.max(5,w-5))}>−</button>
                  <span class="arrive-value">${w} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${l||w+5>i.end-i.start} @click=${()=>this.setTakes(i,w+5)}>+</button>
                </span>`:_}
          </div>
          <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setTakes(i,w!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${w!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:_}
      ${he&&H.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${H.map(O=>f`<button type="button" class="chip" aria-pressed=${j.includes(O)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(i,O)}>
                  ${r.includes(O)?me(e,O):xe(e,O)}
                </button>`)}
            </div>
          </div>`:_}
      ${V?_:f`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${$!=null?`${i.start-$} min before it starts`:`Aims for a few minutes before ${F(i.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${l} @click=${()=>this.nudgeArrive(i,-5)}>−</button>
          <span class="arrive-value">${$!=null?F($):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${l||$==null} @click=${()=>this.nudgeArrive(i,5)}>+</button>
        </span>
      </div>
      ${$!=null?f`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:_}`}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${c} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setAttending(i,!ee)}>
        ${ee?`${c} isn’t going this time`:`${c} is going after all`}
      </button>
      ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:_}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${K.length?K.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${ee&&!i.own?f`<p class="field-hint">Tap a selected driver again to clear it.</p>`:_}
    `}};Nt.styles=vo,Nt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Nt);function wc(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function rr(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=i=>{if(i)for(let r of wc())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),s)}var ar=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],lr=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function cr(s,t,e,n){let o=Math.max(0,Math.min(t,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+n+s.slice(i),caret:o+n.length}}function dr(s,t,e){let n=Math.max(0,Math.min(t,s.length)),o=Math.max(n,Math.min(e,s.length));if(n!==o)return{value:s.slice(0,n)+s.slice(o),caret:n};if(n===0)return{value:s,caret:0};let i=Array.from(s.slice(0,n));i.pop();let r=i.join("");return{value:r+s.slice(n),caret:r.length}}function hr(s,t){return t===0||/\s$/.test(s.slice(0,t))}var kc=new Set(["text","search","email","url","tel","number","password"]);function ur(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&kc.has(s.type)&&!s.readOnly&&!s.disabled}var $c={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Ec={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},zt=class extends Ee{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=hr(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(n),r=dr(n.value,o,i);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(n),a=cr(n.value,i,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":$c[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${Ec[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):_}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?ar:lr;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>f`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};zt.styles=qe`
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
  `,zt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",zt);function _c(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function pr(s){let t=new WeakSet,e=r=>{let a=r.composedPath();i(a);let c=a[0];ur(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=_c();!s.target||r===s.target||(ur(r)?s.attach(r):s.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var Bs="mydashlight",Tc=`/api/${Bs}/pair`,Cc=`/api/${Bs}/pair/poll`,Os=`/${Bs}`,js="pair";function fr(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function gr(s,t){return`${s}${Os}?${js}=${encodeURIComponent(t)}`}function Ac(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var rt=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function mr(s=fetch){let t=await s(Tc,{method:"POST",cache:"no-store"});if(t.status===429)throw new rt("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new rt(`Home Assistant answered ${t.status}.`);return await t.json()}async function br(s,t,e=fetch){let n=await e(Cc,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new rt(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:Ac(t,o.auth)}:{status:"pending"}}var vt=function(s,t){let o=s,i=Ut[t],r=null,a=0,c=null,l=[],d={},h=function(v,w){a=o*4+17,r=(function(x){let $=new Array(x);for(let E=0;E<x;E+=1){$[E]=new Array(x);for(let P=0;P<x;P+=1)$[E][P]=null}return $})(a),u(0,0),u(a-7,0),u(0,a-7),b(),S(),M(v,w),o>=7&&k(v),c==null&&(c=H(o,i,l)),p(c,w)},u=function(v,w){for(let x=-1;x<=7;x+=1)if(!(v+x<=-1||a<=v+x))for(let $=-1;$<=7;$+=1)w+$<=-1||a<=w+$||(0<=x&&x<=6&&($==0||$==6)||0<=$&&$<=6&&(x==0||x==6)||2<=x&&x<=4&&2<=$&&$<=4?r[v+x][w+$]=!0:r[v+x][w+$]=!1)},m=function(){let v=0,w=0;for(let x=0;x<8;x+=1){h(!0,x);let $=He.getLostPoint(d);(x==0||v>$)&&(v=$,w=x)}return w},S=function(){for(let v=8;v<a-8;v+=1)r[v][6]==null&&(r[v][6]=v%2==0);for(let v=8;v<a-8;v+=1)r[6][v]==null&&(r[6][v]=v%2==0)},b=function(){let v=He.getPatternPosition(o);for(let w=0;w<v.length;w+=1)for(let x=0;x<v.length;x+=1){let $=v[w],E=v[x];if(r[$][E]==null)for(let P=-2;P<=2;P+=1)for(let N=-2;N<=2;N+=1)P==-2||P==2||N==-2||N==2||P==0&&N==0?r[$+P][E+N]=!0:r[$+P][E+N]=!1}},k=function(v){let w=He.getBCHTypeNumber(o);for(let x=0;x<18;x+=1){let $=!v&&(w>>x&1)==1;r[Math.floor(x/3)][x%3+a-8-3]=$}for(let x=0;x<18;x+=1){let $=!v&&(w>>x&1)==1;r[x%3+a-8-3][Math.floor(x/3)]=$}},M=function(v,w){let x=i<<3|w,$=He.getBCHTypeInfo(x);for(let E=0;E<15;E+=1){let P=!v&&($>>E&1)==1;E<6?r[E][8]=P:E<8?r[E+1][8]=P:r[a-15+E][8]=P}for(let E=0;E<15;E+=1){let P=!v&&($>>E&1)==1;E<8?r[8][a-E-1]=P:E<9?r[8][15-E-1+1]=P:r[8][15-E-1]=P}r[a-8][8]=!v},p=function(v,w){let x=-1,$=a-1,E=7,P=0,N=He.getMaskFunction(w);for(let K=a-1;K>0;K-=2)for(K==6&&(K-=1);;){for(let J=0;J<2;J+=1)if(r[$][K-J]==null){let Z=!1;P<v.length&&(Z=(v[P]>>>E&1)==1),N($,K-J)&&(Z=!Z),r[$][K-J]=Z,E-=1,E==-1&&(P+=1,E=7)}if($+=x,$<0||a<=$){$-=x,x=-x;break}}},j=function(v,w){let x=0,$=0,E=0,P=new Array(w.length),N=new Array(w.length);for(let z=0;z<w.length;z+=1){let X=w[z].dataCount,oe=w[z].totalCount-X;$=Math.max($,X),E=Math.max(E,oe),P[z]=new Array(X);for(let O=0;O<P[z].length;O+=1)P[z][O]=255&v.getBuffer()[O+x];x+=X;let ee=He.getErrorCorrectPolynomial(oe),fe=Ht(P[z],ee.getLength()-1).mod(ee);N[z]=new Array(ee.getLength()-1);for(let O=0;O<N[z].length;O+=1){let se=O+fe.getLength()-N[z].length;N[z][O]=se>=0?fe.getAt(se):0}}let K=0;for(let z=0;z<w.length;z+=1)K+=w[z].totalCount;let J=new Array(K),Z=0;for(let z=0;z<$;z+=1)for(let X=0;X<w.length;X+=1)z<P[X].length&&(J[Z]=P[X][z],Z+=1);for(let z=0;z<E;z+=1)for(let X=0;X<w.length;X+=1)z<N[X].length&&(J[Z]=N[X][z],Z+=1);return J},H=function(v,w,x){let $=yr.getRSBlocks(v,w),E=xr();for(let N=0;N<x.length;N+=1){let K=x[N];E.put(K.getMode(),4),E.put(K.getLength(),He.getLengthInBits(K.getMode(),v)),K.write(E)}let P=0;for(let N=0;N<$.length;N+=1)P+=$[N].dataCount;if(E.getLengthInBits()>P*8)throw"code length overflow. ("+E.getLengthInBits()+">"+P*8+")";for(E.getLengthInBits()+4<=P*8&&E.put(0,4);E.getLengthInBits()%8!=0;)E.putBit(!1);for(;!(E.getLengthInBits()>=P*8||(E.put(236,8),E.getLengthInBits()>=P*8));)E.put(17,8);return j(E,$)};d.addData=function(v,w){w=w||"Byte";let x=null;switch(w){case"Numeric":x=Sc(v);break;case"Alphanumeric":x=Mc(v);break;case"Byte":x=Pc(v);break;case"Kanji":x=Dc(v);break;default:throw"mode:"+w}l.push(x),c=null},d.isDark=function(v,w){if(v<0||a<=v||w<0||a<=w)throw v+","+w;return r[v][w]},d.getModuleCount=function(){return a},d.make=function(){if(o<1){let v=1;for(;v<40;v++){let w=yr.getRSBlocks(v,i),x=xr();for(let E=0;E<l.length;E++){let P=l[E];x.put(P.getMode(),4),x.put(P.getLength(),He.getLengthInBits(P.getMode(),v)),P.write(x)}let $=0;for(let E=0;E<w.length;E++)$+=w[E].dataCount;if(x.getLengthInBits()<=$*8)break}o=v}h(!1,m())},d.createTableTag=function(v,w){v=v||2,w=typeof w>"u"?v*4:w;let x="";x+='<table style="',x+=" border-width: 0px; border-style: none;",x+=" border-collapse: collapse;",x+=" padding: 0px; margin: "+w+"px;",x+='">',x+="<tbody>";for(let $=0;$<d.getModuleCount();$+=1){x+="<tr>";for(let E=0;E<d.getModuleCount();E+=1)x+='<td style="',x+=" border-width: 0px; border-style: none;",x+=" border-collapse: collapse;",x+=" padding: 0px; margin: 0px;",x+=" width: "+v+"px;",x+=" height: "+v+"px;",x+=" background-color: ",x+=d.isDark($,E)?"#000000":"#ffffff",x+=";",x+='"/>';x+="</tr>"}return x+="</tbody>",x+="</table>",x},d.createSvgTag=function(v,w,x,$){let E={};typeof arguments[0]=="object"&&(E=arguments[0],v=E.cellSize,w=E.margin,x=E.alt,$=E.title),v=v||2,w=typeof w>"u"?v*4:w,x=typeof x=="string"?{text:x}:x||{},x.text=x.text||null,x.id=x.text?x.id||"qrcode-description":null,$=typeof $=="string"?{text:$}:$||{},$.text=$.text||null,$.id=$.text?$.id||"qrcode-title":null;let P=d.getModuleCount()*v+w*2,N,K,J,Z,z="",X;for(X="l"+v+",0 0,"+v+" -"+v+",0 0,-"+v+"z ",z+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',z+=E.scalable?"":' width="'+P+'px" height="'+P+'px"',z+=' viewBox="0 0 '+P+" "+P+'" ',z+=' preserveAspectRatio="xMinYMin meet"',z+=$.text||x.text?' role="img" aria-labelledby="'+V([$.id,x.id].join(" ").trim())+'"':"",z+=">",z+=$.text?'<title id="'+V($.id)+'">'+V($.text)+"</title>":"",z+=x.text?'<description id="'+V(x.id)+'">'+V(x.text)+"</description>":"",z+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',z+='<path d="',J=0;J<d.getModuleCount();J+=1)for(Z=J*v+w,N=0;N<d.getModuleCount();N+=1)d.isDark(J,N)&&(K=N*v+w,z+="M"+K+","+Z+X);return z+='" stroke="transparent" fill="black"/>',z+="</svg>",z},d.createDataURL=function(v,w){v=v||2,w=typeof w>"u"?v*4:w;let x=d.getModuleCount()*v+w*2,$=w,E=x-w;return Bc(x,x,function(P,N){if($<=P&&P<E&&$<=N&&N<E){let K=Math.floor((P-$)/v),J=Math.floor((N-$)/v);return d.isDark(J,K)?0:1}else return 1})},d.createImgTag=function(v,w,x){v=v||2,w=typeof w>"u"?v*4:w;let $=d.getModuleCount()*v+w*2,E="";return E+="<img",E+=' src="',E+=d.createDataURL(v,w),E+='"',E+=' width="',E+=$,E+='"',E+=' height="',E+=$,E+='"',x&&(E+=' alt="',E+=V(x),E+='"'),E+="/>",E};let V=function(v){let w="";for(let x=0;x<v.length;x+=1){let $=v.charAt(x);switch($){case"<":w+="&lt;";break;case">":w+="&gt;";break;case"&":w+="&amp;";break;case'"':w+="&quot;";break;default:w+=$;break}}return w},he=function(v){v=typeof v>"u"?2:v;let x=d.getModuleCount()*1+v*2,$=v,E=x-v,P,N,K,J,Z,z={"██":"█","█ ":"▀"," █":"▄","  ":" "},X={"██":"▀","█ ":"▀"," █":" ","  ":" "},oe="";for(P=0;P<x;P+=2){for(K=Math.floor((P-$)/1),J=Math.floor((P+1-$)/1),N=0;N<x;N+=1)Z="█",$<=N&&N<E&&$<=P&&P<E&&d.isDark(K,Math.floor((N-$)/1))&&(Z=" "),$<=N&&N<E&&$<=P+1&&P+1<E&&d.isDark(J,Math.floor((N-$)/1))?Z+=" ":Z+="█",oe+=v<1&&P+1>=E?X[Z]:z[Z];oe+=`
`}return x%2&&v>0?oe.substring(0,oe.length-x-1)+Array(x+1).join("▀"):oe.substring(0,oe.length-1)};return d.createASCII=function(v,w){if(v=v||1,v<2)return he(w);v-=1,w=typeof w>"u"?v*2:w;let x=d.getModuleCount()*v+w*2,$=w,E=x-w,P,N,K,J,Z=Array(v+1).join("██"),z=Array(v+1).join("  "),X="",oe="";for(P=0;P<x;P+=1){for(K=Math.floor((P-$)/v),oe="",N=0;N<x;N+=1)J=1,$<=N&&N<E&&$<=P&&P<E&&d.isDark(K,Math.floor((N-$)/v))&&(J=0),oe+=J?Z:z;for(K=0;K<v;K+=1)X+=oe+`
`}return X.substring(0,X.length-1)},d.renderTo2dContext=function(v,w){w=w||2;let x=d.getModuleCount();for(let $=0;$<x;$++)for(let E=0;E<x;E++)v.fillStyle=d.isDark($,E)?"black":"white",v.fillRect(E*w,$*w,w,w)},d};vt.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};vt.createStringToBytes=function(s,t){let e=(function(){let o=Rc(s),i=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let l=i(),d=i(),h=i(),u=String.fromCharCode(c<<8|l),m=d<<8|h;a[u]=m,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(n)}}return i}};var be={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Ut={L:1,M:0,Q:3,H:2},Ue={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},He=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(t)>=0;)a^=t<<i(a)-i(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case Ue.PATTERN000:return function(a,c){return(a+c)%2==0};case Ue.PATTERN001:return function(a,c){return a%2==0};case Ue.PATTERN010:return function(a,c){return c%3==0};case Ue.PATTERN011:return function(a,c){return(a+c)%3==0};case Ue.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Ue.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Ue.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Ue.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=Ht([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Ht([1,Fe.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case be.MODE_NUMBER:return 10;case be.MODE_ALPHA_NUM:return 9;case be.MODE_8BIT_BYTE:return 8;case be.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case be.MODE_NUMBER:return 12;case be.MODE_ALPHA_NUM:return 11;case be.MODE_8BIT_BYTE:return 16;case be.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case be.MODE_NUMBER:return 14;case be.MODE_ALPHA_NUM:return 13;case be.MODE_8BIT_BYTE:return 16;case be.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let h=0;h<a;h+=1)for(let u=0;u<a;u+=1){let m=0,S=r.isDark(h,u);for(let b=-1;b<=1;b+=1)if(!(h+b<0||a<=h+b))for(let k=-1;k<=1;k+=1)u+k<0||a<=u+k||b==0&&k==0||S==r.isDark(h+b,u+k)&&(m+=1);m>5&&(c+=3+m-5)}for(let h=0;h<a-1;h+=1)for(let u=0;u<a-1;u+=1){let m=0;r.isDark(h,u)&&(m+=1),r.isDark(h+1,u)&&(m+=1),r.isDark(h,u+1)&&(m+=1),r.isDark(h+1,u+1)&&(m+=1),(m==0||m==4)&&(c+=3)}for(let h=0;h<a;h+=1)for(let u=0;u<a-6;u+=1)r.isDark(h,u)&&!r.isDark(h,u+1)&&r.isDark(h,u+2)&&r.isDark(h,u+3)&&r.isDark(h,u+4)&&!r.isDark(h,u+5)&&r.isDark(h,u+6)&&(c+=40);for(let h=0;h<a;h+=1)for(let u=0;u<a-6;u+=1)r.isDark(u,h)&&!r.isDark(u+1,h)&&r.isDark(u+2,h)&&r.isDark(u+3,h)&&r.isDark(u+4,h)&&!r.isDark(u+5,h)&&r.isDark(u+6,h)&&(c+=40);let l=0;for(let h=0;h<a;h+=1)for(let u=0;u<a;u+=1)r.isDark(u,h)&&(l+=1);let d=Math.abs(100*l/a/a-50)/5;return c+=d*10,c},o})(),Fe=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),Ht=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+t);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let i=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=Fe.gexp(Fe.glog(n.getAt(r))+Fe.glog(o.getAt(a)));return Ht(i,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let i=Fe.glog(n.getAt(0))-Fe.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=Fe.gexp(Fe.glog(o.getAt(a))+i);return Ht(r,0).mod(o)},n},yr=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},n=function(o,i){switch(i){case Ut.L:return s[(o-1)*4+0];case Ut.M:return s[(o-1)*4+1];case Ut.Q:return s[(o-1)*4+2];case Ut.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=n(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,c=[];for(let l=0;l<a;l+=1){let d=r[l*3+0],h=r[l*3+1],u=r[l*3+2];for(let m=0;m<d;m+=1)c.push(t(h,u))}return c},e})(),xr=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let o=Math.floor(n/8);return(s[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let i=0;i<o;i+=1)e.putBit((n>>>o-i-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);s.length<=o&&s.push(0),n&&(s[o]|=128>>>t%8),t+=1},e},Sc=function(s){let t=be.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+i(r.charAt(c));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},Mc=function(s){let t=be.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(i){return e.length},n.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return n},Pc=function(s){let t=be.MODE_8BIT_BYTE,e=s,n=vt.stringToBytes(s),o={};return o.getMode=function(){return t},o.getLength=function(i){return n.length},o.write=function(i){for(let r=0;r<n.length;r+=1)i.put(n[r],8)},o},Dc=function(s){let t=be.MODE_KANJI,e=s,n=vt.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=n(s),i={};return i.getMode=function(){return t},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,c=0;for(;c+1<a.length;){let l=(255&a[c])<<8|255&a[c+1];if(33088<=l&&l<=40956)l-=33088;else if(57408<=l&&l<=60351)l-=49472;else throw"illegal char at "+(c+1)+"/"+l;l=(l>>>8&255)*192+(l&255),r.put(l,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},i},vr=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let i=0;i<o;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},Lc=function(){let s=0,t=0,e=0,n="",o={},i=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)i(s>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},o.toString=function(){return n},o},Rc=function(s){let t=s,e=0,n=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=t.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},Ic=function(s,t){let e=s,n=t,o=new Array(s*t),i={};i.setPixel=function(l,d,h){o[d*e+l]=h},i.write=function(l){l.writeString("GIF87a"),l.writeShort(e),l.writeShort(n),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(e),l.writeShort(n),l.writeByte(0);let d=2,h=a(d);l.writeByte(d);let u=0;for(;h.length-u>255;)l.writeByte(255),l.writeBytes(h,u,255),u+=255;l.writeByte(h.length-u),l.writeBytes(h,u,h.length-u),l.writeByte(0),l.writeString(";")};let r=function(l){let d=l,h=0,u=0,m={};return m.write=function(S,b){if(S>>>b)throw"length over";for(;h+b>=8;)d.writeByte(255&(S<<h|u)),b-=8-h,S>>>=8-h,u=0,h=0;u=S<<h|u,h=h+b},m.flush=function(){h>0&&d.writeByte(u)},m},a=function(l){let d=1<<l,h=(1<<l)+1,u=l+1,m=c();for(let p=0;p<d;p+=1)m.add(String.fromCharCode(p));m.add(String.fromCharCode(d)),m.add(String.fromCharCode(h));let S=vr(),b=r(S);b.write(d,u);let k=0,M=String.fromCharCode(o[k]);for(k+=1;k<o.length;){let p=String.fromCharCode(o[k]);k+=1,m.contains(M+p)?M=M+p:(b.write(m.indexOf(M),u),m.size()<4095&&(m.size()==1<<u&&(u+=1),m.add(M+p)),M=p)}return b.write(m.indexOf(M),u),b.write(h,u),b.flush(),S.toByteArray()},c=function(){let l={},d=0,h={};return h.add=function(u){if(h.contains(u))throw"dup key:"+u;l[u]=d,d+=1},h.size=function(){return d},h.indexOf=function(u){return l[u]},h.contains=function(u){return typeof l[u]<"u"},h};return i},Bc=function(s,t,e){let n=Ic(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let o=vr();n.write(o);let i=Lc(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},wr=vt,kh=vt.stringToBytes;function kr(s){let t=wr(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)t.isDark(o,i)&&(n+=`M${i} ${o}h1v1h-1z`);return{size:e,d:n}}var Oc=1e4,Ft=class extends Ee{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await mr();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof rt&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),Oc)}}async poll(e){let n=this.secret;if(n)try{let o=await br(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return _;let{size:e,d:n}=kr(gr(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${le`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?fr(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Os}?${js}</span> and type the code.
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
    </div>`}};Ft.styles=qe`
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
  `,Ft.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Ft);var Ns="hassTokens";function $r(){try{let s=localStorage.getItem(Ns);return s?JSON.parse(s):null}catch{return null}}function zs(s){try{s?localStorage.setItem(Ns,JSON.stringify(s)):localStorage.removeItem(Ns)}catch{}}function jc(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function Nc(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function zc(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!$r()){let e=await Nc();e&&zs(e)}try{let e=await ri({hassUrl:location.origin,loadTokens:async()=>$r(),saveTokens:zs});t&&history.replaceState(null,"",location.pathname+fs(location.search));let n=await ai({auth:e});s.backend=new Yt(n),n.addEventListener("reconnect-error",(o,i)=>{i===2&&Er()})}catch(e){if(e===2){Er();return}jc(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function Er(){zs(null),location.replace(location.pathname+fs(location.search))}var Tr=tt(location.search),_r=document.querySelector("mydashlight-keyboard");_r&&Tr.keyboard!==!1&&pr(_r);Tr.cursor!=="show"&&rr();zc();
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
