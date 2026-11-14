var zr=Object.defineProperty;var Rn=(s,n)=>()=>(s&&(n=s(s=0)),n);var Ur=(s,n)=>{for(var e in n)zr(s,e,{get:n[e],enumerable:!0})};function $n(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function ws(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Za(s,n){let e=new Set,t=[];for(let o of s){let i=n(o);e.has(i)||(e.add(i),t.push(o))}return t}function Mo(s){return Za(s,n=>n.unicode)}function Qa(s){function n(e,t,o){let i=t?s.createObjectStore(e,{keyPath:t}):s.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))i.createIndex(r,a,{multiEntry:c});return i}n(yt),n(it,Va,{[Lo]:[Wa,!0],[Io]:[[qa,Ga]],[Bo]:[Ya,!0]}),n(_s,void 0,{[Ro]:[""]})}function Oo(s,n,e){e.onerror=()=>n(e.error),e.onblocked=()=>n(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function el(s){let n=await new Promise((e,t)=>{let o=indexedDB.open(s,Fa);$s[s]=o,o.onupgradeneeded=i=>{i.oldVersion<Ka&&Qa(o.result)},Oo(e,t,o)});return n.onclose=()=>Cs(s),n}function tl(s){return _n[s]||(_n[s]=el(s)),_n[s]}function ze(s,n,e,t){return new Promise((o,i)=>{let r=s.transaction(n,e,{durability:"relaxed"}),a=typeof n=="string"?r.objectStore(n):n.map(h=>r.objectStore(h)),c;t(a,r,h=>{c=h}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function Cs(s){let n=$s[s],e=n&&n.result;if(e){e.close();let t=Cn[s];if(t)for(let o of t)o()}delete $s[s],delete _n[s],delete Cn[s]}function nl(s){return new Promise((n,e)=>{Cs(s);let t=indexedDB.deleteDatabase(s);Oo(n,e,t)})}function sl(s,n){let e=Cn[s];e||(e=Cn[s]=[]),e.push(n)}function vt(s){return s.split(/[\s_]+/).map(n=>!n.match(/\w/)||il.has(n)?n.toLowerCase():n.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function No(s){return s.filter(Boolean).map(n=>n.toLowerCase()).filter(n=>n.length>=ol)}function rl(s){return s.map(({annotation:e,emoticon:t,group:o,order:i,shortcodes:r,skins:a,tags:c,emoji:h,version:d})=>{let l=[...new Set(No([...(r||[]).map(vt).flat(),...(c||[]).map(vt).flat(),...vt(e),t]))].sort(),u={annotation:e,group:o,order:i,tags:c,tokens:l,unicode:h,version:d};if(t&&(u.emoticon=t),r&&(u.shortcodes=r),a){u.skinTones=[],u.skinUnicodes=[],u.skinVersions=[];for(let{tone:m,emoji:S,version:g}of a)u.skinTones.push(m),u.skinUnicodes.push(S),u.skinVersions.push(g)}return u})}function jo(s,n,e,t){s[n](e).onsuccess=o=>t&&t(o.target.result)}function st(s,n,e){jo(s,"get",n,e)}function zo(s,n,e){jo(s,"getAll",n,e)}function Ps(s){s.commit&&s.commit()}function al(s,n){let e=s[0];for(let t=1;t<s.length;t++){let o=s[t];n(e)>n(o)&&(e=o)}return e}function Uo(s,n){let e=al(s,o=>o.length),t=[];for(let o of e)s.some(i=>i.findIndex(r=>n(r)===n(o))===-1)||t.push(o);return t}async function ll(s){return!await As(s,yt,En)}async function cl(s,n,e){let[t,o]=await Promise.all([ks,En].map(i=>As(s,yt,i)));return t===e&&o===n}async function dl(s,n){return ze(s,it,wt,(t,o,i)=>{let r,a=()=>{t.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let h=c.target.result;for(let d of h)if(r=d.unicode,n(d))return i(d);if(h.length<50)return i();a()}};a()})}async function Ho(s,n,e,t){try{let o=rl(n);await ze(s,[it,yt],Es,([i,r],a)=>{let c,h,d=0;function l(){++d===2&&u()}function u(){if(!(c===t&&h===e)){i.clear();for(let m of o)i.put(m);r.put(t,ks),r.put(e,En),Ps(a)}}st(r,ks,m=>{c=m,l()}),st(r,En,m=>{h=m,l()})})}finally{}}async function hl(s,n){return ze(s,it,wt,(e,t,o)=>{let i=IDBKeyRange.bound([n,0],[n+1,0],!1,!0);zo(e.index(Io),i,o)})}async function Fo(s,n){let e=No(vt(n));return e.length?ze(s,it,wt,(t,o,i)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let h=Uo(r,d=>d.unicode);i(h.sort((d,l)=>d.order<l.order?-1:1))};for(let h=0;h<e.length;h++){let d=e[h],l=h===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);zo(t.index(Lo),l,u=>{r.push(u),a()})}}):[]}async function ul(s,n){let e=await Fo(s,n);return e.length?e.filter(t=>(t.shortcodes||[]).map(i=>i.toLowerCase()).includes(n.toLowerCase()))[0]||null:await dl(s,o=>(o.shortcodes||[]).includes(n.toLowerCase()))||null}async function pl(s,n){return ze(s,it,wt,(e,t,o)=>st(e,n,i=>{if(i)return o(i);st(e.index(Bo),n,r=>o(r||null))}))}function As(s,n,e){return ze(s,n,wt,(t,o,i)=>st(t,e,i))}function fl(s,n,e,t){return ze(s,n,Es,(o,i)=>{o.put(t,e),Ps(i)})}function gl(s,n){return ze(s,_s,Es,(e,t)=>st(e,n,o=>{e.put((o||0)+1,n),Ps(t)}))}function ml(s,n,e){return e===0?[]:ze(s,[_s,it],wt,([t,o],i,r)=>{let a=[];t.index(Ro).openCursor(void 0,"prev").onsuccess=c=>{let h=c.target.result;if(!h)return r(a);function d(m){if(a.push(m),a.length===e)return r(a);h.continue()}let l=h.primaryKey,u=n.byName(l);if(u)return d(u);st(o,l,m=>{if(m)return d(m);h.continue()})}})}function bl(s,n){let e=new Map;for(let o of s){let i=n(o);for(let r of i){let a=e;for(let h=0;h<r.length;h++){let d=r.charAt(h),l=a.get(d);l||(l=new Map,a.set(d,l)),a=l}let c=a.get(Tn);c||(c=[],a.set(Tn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let h=0;h<o.length;h++){let d=o.charAt(h),l=r.get(d);if(l)r=l;else return[]}if(i)return r.get(Tn)||[];let a=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((l,u)=>l[0]<u[0]?-1:1);for(let[l,u]of d)l===Tn?a.push(...u):c.push(u)}return a}}function yl(s){let n=s&&Array.isArray(s),e=n&&s.length&&(!s[0]||vl.some(t=>!(t in s[0])));if(!n||e)throw new Error("Custom emojis are in the wrong format")}function Do(s){yl(s);let n=(u,m)=>u.name.toLowerCase()<m.name.toLowerCase()?-1:1,e=s.sort(n),o=bl(s,u=>{let m=new Set;if(u.shortcodes)for(let S of u.shortcodes)for(let g of vt(S))m.add(g);return m}),i=u=>o(u,!0),r=u=>o(u,!1),a=u=>{let m=vt(u),S=m.map((g,$)=>($<m.length-1?i:r)(g));return Uo(S,g=>g.name).sort(n)},c=new Map,h=new Map;for(let u of s){h.set(u.name.toLowerCase(),u);for(let m of u.shortcodes||[])c.set(m.toLowerCase(),u)}return{all:e,search:a,byShortcode:u=>c.get(u.toLowerCase()),byName:u=>h.get(u.toLowerCase())}}function Ot(s){if(!s)return s;if(xl&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let n=s.skinTones.length;s.skins=Array(n);for(let e=0;e<n;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Ko(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function kl(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||wl.some(n=>!(n in s[0])))throw new Error("Emoji data is in the wrong format")}function Wo(s,n){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+n+":  "+s.status)}async function $l(s){let n=await fetch(s,{method:"HEAD"});Wo(n,s);let e=n.headers.get("etag");return Ko(e),e}async function Ts(s){let n=await fetch(s);Wo(n,s);let e=n.headers.get("etag");Ko(e);let t=await n.json();return kl(t),[e,t]}function Tl(s){for(var n="",e=new Uint8Array(s),t=e.byteLength,o=-1;++o<t;)n+=String.fromCharCode(e[o]);return n}function _l(s){for(var n=s.length,e=new ArrayBuffer(n),t=new Uint8Array(e),o=-1;++o<n;)t[o]=s.charCodeAt(o);return e}async function Vo(s){let n=JSON.stringify(s),e=_l(n),t=await crypto.subtle.digest("SHA-1",e),o=Tl(t);return btoa(o)}async function El(s,n){let e,t=await $l(n);if(!t){let o=await Ts(n);t=o[0],e=o[1],t||(t=await Vo(e))}await cl(s,n,t)||(e||(e=(await Ts(n))[1]),await Ho(s,e,n,t))}async function Cl(s,n){let[e,t]=await Ts(n);e||(e=await Vo(t)),await Ho(s,t,n,e)}async function Pl(s,n){try{await El(s,n)}catch(e){if(e.name!=="InvalidStateError")throw e}}var Fa,Ka,it,yt,_s,Wa,Lo,Va,Ro,qa,Ga,Io,ks,En,So,wt,Es,Bo,Ya,Ja,Xa,$s,_n,Cn,il,ol,Tn,vl,xl,wl,xt,Ss=Rn(()=>{Fa=1,Ka=1,it="emoji",yt="keyvalue",_s="favorites",Wa="tokens",Lo="tokens",Va="unicode",Ro="count",qa="group",Ga="order",Io="group-order",ks="eTag",En="url",So="skinTone",wt="readonly",Es="readwrite",Bo="skinUnicodes",Ya="skinUnicodes",Ja="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Xa="en";$s={},_n={},Cn={};il=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);ol=2;Tn="";vl=["name","url"];xl=typeof wrappedJSObject<"u";wl=["annotation","emoji","group","order","version"];xt=class{constructor({dataSource:n=Ja,locale:e=Xa,customEmoji:t=[]}={}){this.dataSource=n,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Do(t),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let n=this._db=await tl(this._dbName);sl(this._dbName,this._clear);let e=this.dataSource;await ll(n)?await Cl(n,e):this._lazyUpdate=Pl(n,e)}async ready(){let n=async()=>(this._ready||(this._ready=this._init()),this._ready);await n(),this._db||await n()}async getEmojiByGroup(n){return ws(n),await this.ready(),Mo(await hl(this._db,n)).map(Ot)}async getEmojiBySearchQuery(n){$n(n),await this.ready();let e=this._custom.search(n),t=Mo(await Fo(this._db,n)).map(Ot);return[...e,...t]}async getEmojiByShortcode(n){$n(n),await this.ready();let e=this._custom.byShortcode(n);return e||Ot(await ul(this._db,n))}async getEmojiByUnicodeOrName(n){$n(n),await this.ready();let e=this._custom.byName(n);return e||Ot(await pl(this._db,n))}async getPreferredSkinTone(){return await this.ready(),await As(this._db,yt,So)||0}async setPreferredSkinTone(n){return ws(n),await this.ready(),fl(this._db,yt,So,n)}async incrementFavoriteEmojiCount(n){return $n(n),await this.ready(),gl(this._db,n)}async getTopFavoriteEmoji(n){return ws(n),await this.ready(),(await ml(this._db,this._custom,n)).map(Ot)}set customEmoji(n){this._custom=Do(n)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Cs(this._dbName)}async delete(){await this._shutdown(),await nl(this._dbName)}}});function Go(s){return s.unicode.includes("‍")}function Ol(s){let n=Yo(s,"#000"),e=Yo(s,"#fff");return n&&e&&Bl(n,e)}function Nl(){let s=Object.entries(Sl);try{for(let[n,e]of s)if(Ol(n))return e}catch{}finally{}return s[0][1]}function Kl(s,n){if(n===0)return s;let e=s.indexOf(Ul);return e!==-1?s.substring(0,e)+String.fromCodePoint(Hl+n-1)+s.substring(e):(s.endsWith(jl)&&(s=s.substring(0,s.length-1)),s+zl+String.fromCodePoint(Fl+n-1))}function Re(s){s.preventDefault(),s.stopPropagation()}function Rs(s,n,e){return n+=s?-1:1,n<0?n=e.length-1:n>=e.length&&(n=0),n}function ir(s,n){let e=new Set,t=[];for(let o of s){let i=n(o);e.has(i)||(e.add(i),t.push(o))}return t}function Wl(s,n){let e=t=>{let o={};for(let i of t)typeof i.tone=="number"&&i.version<=n&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:t,skins:o,shortcodes:i,url:r,name:a,category:c,annotation:h})=>({unicode:t,name:a,shortcodes:i,url:r,category:c,annotation:h,id:t||a,skins:o&&e(o)}))}function ql(s,n,e){let t;Vl?(t=new ResizeObserver(e),t.observe(s)):An(e),n.addEventListener("abort",()=>{t&&t.disconnect()})}function Jo(s){{let n=document.createRange();return n.selectNode(s.firstChild),n.getBoundingClientRect().width}}function Xo(s,n,e){let t=Jo(n);if(!t){if(!ot){ot=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])ot.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(ot),ot.firstChild.nodeValue=s,Jo(ot)}finally{ot.remove()}}return t}function Yl(s,n,e){let t=!0;for(let o of s){let i=e(o);if(!i)continue;typeof Is>"u"&&(Is=Xo(Gl,n,n));let a=Xo(o.unicode,i,n)/1.8<Is;js.set(o.unicode,a),a||(t=!1)}return t}function Jl(s){return ir(s,n=>n)}function Xl(s){s&&(s.scrollTop=0)}function Nt(s,n,e){let t=s.get(n);return t||(t=e(),s.set(n,t)),t}function Zo(s){return""+s}function Zl(s){let n=document.createElement("template");return n.innerHTML=s,n}function sc(s,n){nc?s.replaceChildren(...n):(s.innerHTML="",s.append(...n))}function ic(s,n){let e=s.firstChild,t=0;for(;e;){if(n[t]!==e)return!0;e=e.nextSibling,t++}return t!==n.length}function oc(s,n){let{targetNode:e}=n,{targetParentNode:t}=n,o=!1;t?o=ic(t,s):(o=!0,n.targetNode=void 0,n.targetParentNode=t=e.parentNode),o&&sc(t,s)}function rc(s,n){for(let e of n){let{targetNode:t,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,h=s[i];if(o!==h)if(e.currentExpression=h,r)if(h===null)t.removeAttribute(r);else{let d=a+Zo(h)+c;t.setAttribute(r,d)}else{let d;Array.isArray(h)?oc(h,e):h instanceof Element?(d=h,t.replaceWith(d)):t.nodeValue=Zo(h),d&&(e.targetNode=d)}}}function ac(s){let n="",e=!1,t=!1,o=-1,i=new Map,r=[],a=0;for(let h=0,d=s.length;h<d;h++){let l=s[h];if(n+=l.slice(a),h===d-1)break;for(let f=0;f<l.length;f++)switch(l.charAt(f)){case"<":{l.charAt(f+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,t=!1;break}case"=":{t=!0;break}}let u=r[r.length-1],m=Nt(i,u,()=>[]),S,g,$;if(t){let f=/(\S+)="?([^"=]*)$/.exec(l);S=f[1],g=f[2];let B=/^([^">]*)("?)/.exec(s[h+1]);$=B[1],n=n.slice(0,-1*f[0].length),a=B[0].length}else a=0;let E={attributeName:S,attributeValuePre:g,attributeValuePost:$,expressionIndex:h};m.push(E),!e&&!t&&(n+=" ")}return{template:Zl(n),elementsToBindings:i}}function Qo(s,n,e){for(let t=0;t<s.length;t++){let o=s[t],i=o.attributeName?n:n.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function lc(s,n){let e=[],t;if(n.size===1&&(t=n.get(0)))Qo(t,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=n.get(++r);a&&Qo(a,i,e)}while(i=o.nextNode())}return e}function cc(s){let{template:n,elementsToBindings:e}=Nt(Ql,s,()=>ac(s)),t=n.cloneNode(!0).content.firstElementChild,o=lc(t,e);return function(r){return rc(r,o),t}}function dc(s){let n=Nt(ec,s,()=>new Map),e=tc;function t(i,...r){let a=Nt(n,i,()=>new Map);return Nt(a,e,()=>cc(i))(r)}function o(i,r,a){return i.map((c,h)=>{let d=e;e=a(c);try{return r(c,h)}finally{e=d}})}return{map:o,html:t}}function hc(s,n,e,t,o,i,r,a,c){let{labelWithSkin:h,titleForEmoji:d,unicodeWithSkin:l}=e,{html:u,map:m}=dc(n);function S(f,B,U){return m(f,(q,he)=>u`<button role="${B?"option":"menuitem"}" aria-selected="${B?he===n.activeSearchItem:null}" aria-label="${h(q,n.currentSkinTone)}" title="${d(q)}" class="${"emoji"+(B&&he===n.activeSearchItem?" active":"")+(q.unicode?"":" custom-emoji")}" id="${`${U}-${q.id}`}" style="${q.unicode?null:`--custom-emoji-background: url(${JSON.stringify(q.url)})`}">${q.unicode?l(q,n.currentSkinTone):""}</button>`,q=>`${U}-${q.id}`)}let $=u`<section data-ref="rootElement" class="picker" aria-label="${n.i18n.regionLabel}" style="${n.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${n.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(n.searchMode&&n.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${n.activeSearchItemId?`emo-${n.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${n.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${n.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${n.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${n.skinTonePickerExpanded?"hide-focus":""}" aria-label="${n.skinToneButtonLabel}" title="${n.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${n.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${n.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${n.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${n.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${n.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${n.i18n.skinTonesLabel}" aria-activedescendant="skintone-${n.activeSkinTone}" aria-hidden="${!n.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${m(n.skinTones,(f,B)=>u`<div id="skintone-${B}" class="emoji ${B===n.activeSkinTone?"active":""}" aria-selected="${B===n.activeSkinTone}" role="option" title="${n.i18n.skinTones[B]}" aria-label="${n.i18n.skinTones[B]}">${f}</div>`,f=>f)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${n.groups.length},1fr)" aria-label="${n.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${m(n.groups,f=>u`<button role="tab" class="nav-button" aria-controls="tab-${f.id}" aria-label="${n.i18n.categories[f.name]}" aria-selected="${!n.searchMode&&n.currentGroup.id===f.id}" title="${n.i18n.categories[f.name]}" data-group-id="${f.id}"><div class="nav-emoji emoji">${f.emoji}</div></button>`,f=>f.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(n.isRtl?-1:1)*n.currentGroupIndex*100}%)"></div></div><div class="message ${n.message?"":"gone"}" role="alert" aria-live="polite">${n.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!n.databaseLoaded||n.message?"gone":""}" role="${n.searchMode?"region":"tabpanel"}" aria-label="${n.searchMode?n.i18n.searchResultsLabel:n.i18n.categories[n.currentGroup.name]}" id="${n.searchMode?null:`tab-${n.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${m(n.currentEmojisWithCategories,(f,B)=>u`<div><div id="menu-label-${B}" class="category ${n.currentEmojisWithCategories.length===1&&n.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${n.searchMode?n.i18n.searchResultsLabel:f.category?f.category:n.currentEmojisWithCategories.length>1?n.i18n.categories.custom:n.i18n.categories[n.currentGroup.name]}</div><div class="emoji-menu ${B!==0&&!n.searchMode&&n.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(f.emojis.length/n.numColumns)}`}" data-action="updateOnIntersection" role="${n.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${B}" id="${n.searchMode?"search-results":null}">${S(f.emojis,n.searchMode,"emo")}</div></div>`,f=>f.category)}</div></div><div class="favorites onscreen emoji-menu ${n.message?"gone":""}" role="menu" aria-label="${n.i18n.favoritesLabel}" data-on-click="onEmojiClick">${S(n.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,E=(f,B)=>{for(let U of s.querySelectorAll(`[${f}]`))B(U,U.getAttribute(f))};if(c){s.appendChild($);for(let f of["click","focusout","input","keydown","keyup"])E(`data-on-${f}`,(B,U)=>{B.addEventListener(f,t[U])});E("data-ref",(f,B)=>{i[B]=f}),r.addEventListener("abort",()=>{s.removeChild($)})}E("data-action",(f,B)=>{let U=a.get(B);U||a.set(B,U=new WeakSet),U.has(f)||(U.add(f),o[B](f))})}function uc(s){let n=!1,e,t=new Map,o=new Set,i,r=()=>{if(n)return;let h=[...o];o.clear();try{for(let d of h)d()}finally{i=!1,o.size&&(i=!0,Sn(r))}},a=new Proxy({},{get(h,d){if(e){let l=t.get(d);l||(l=new Set,t.set(d,l)),l.add(e)}return h[d]},set(h,d,l){if(h[d]!==l){h[d]=l;let u=t.get(d);if(u){for(let m of u)o.add(m);i||(i=!0,Sn(r))}}return!0}}),c=h=>{let d=()=>{let l=e;e=d;try{return h()}finally{e=l}};return d()};return s.addEventListener("abort",()=>{n=!0}),{state:a,createEffect:c}}function Bs(s,n,e){if(s.length!==n.length)return!1;for(let t=0;t<s.length;t++)if(!e(s[t],n[t]))return!1;return!0}function pc(s,n,e){{let t=s.closest(".tabpanel"),o=er.get(t);o||(o=new IntersectionObserver(e,{root:t,rootMargin:"50% 0px 50% 0px",threshold:0}),er.set(t,o),n.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function fc(s,n){let e={},t=new AbortController,o=t.signal,{state:i,createEffect:r}=uc(o),a=new Map;Pn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),Pn(i,n),Pn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Ll,isRtl:!1,currentGroupIndex:0,groups:Ms,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=v=>{s.getElementById(v).focus()},h=v=>s.getElementById(`emo-${v.id}`),d=(v,k)=>{e.rootElement.dispatchEvent(new CustomEvent(v,{detail:k,bubbles:!0,composed:!0}))},l=(v,k)=>v.id===k.id,u=(v,k)=>{let{category:A,emojis:M}=v,{category:K,emojis:L}=k;return A!==K?!1:Bs(M,L,l)},m=v=>{Bs(i.currentEmojis,v,l)||(i.currentEmojis=v)},S=v=>{i.searchMode!==v&&(i.searchMode=v)},g=v=>{Bs(i.currentEmojisWithCategories,v,u)||(i.currentEmojisWithCategories=v)},$=(v,k)=>k&&v.skins&&v.skins[k]||v.unicode,B={labelWithSkin:(v,k)=>Jl([v.name||$(v,k),v.annotation,...v.shortcodes||Os].filter(Boolean)).join(", "),titleForEmoji:v=>v.annotation||(v.shortcodes||Os).join(", "),unicodeWithSkin:$},U={onClickSkinToneButton:ye,onEmojiClick:pe,onNavClick:X,onNavKeydown:Q,onSearchKeydown:j,onSkinToneOptionsClick:Ae,onSkinToneOptionsFocusOut:z,onSkinToneOptionsKeydown:b,onSkinToneOptionsKeyup:O,onSearchInput:T},q={calculateEmojiGridStyle:w,updateOnIntersection:y},he=!0;r(()=>{hc(s,i,B,U,q,e,o,a,he),he=!1}),i.emojiVersion||Ls().then(v=>{v||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function v(){let k=!1,A=setTimeout(()=>{k=!0,i.message=i.i18n.loadingMessage},Ml);try{await i.database.ready(),i.databaseLoaded=!0}catch(M){console.error(M),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(A),k&&(k=!1,i.message="")}}i.database&&v()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${qo};`}),r(()=>{i.customEmoji&&i.database&&x()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==Ns&&(i.groups=Ns):i.groups!==Ms&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=Ms)}),r(()=>{async function v(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}v()}),r(()=>{i.skinTones=Array(qo).fill().map((v,k)=>Kl(i.skinToneEmoji,k))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function v(){let{database:k}=i,A=(await Promise.all(Rl.map(M=>k.getEmojiByUnicodeOrName(M)))).filter(Boolean);i.defaultFavoriteEmojis=A}i.databaseLoaded&&v()});function x(){let{customEmoji:v,database:k}=i,A=v||Os;k.customEmoji!==A&&(k.customEmoji=A)}r(()=>{async function v(){x();let{database:k,defaultFavoriteEmojis:A,numColumns:M}=i,K=await k.getTopFavoriteEmoji(M),L=await V(ir([...K,...A],H=>H.unicode||H.name).slice(0,M));i.currentFavorites=L}i.databaseLoaded&&i.defaultFavoriteEmojis&&v()});function w(v){ql(v,o,()=>{{let k=getComputedStyle(e.rootElement),A=parseInt(k.getPropertyValue("--num-columns"),10),M=k.getPropertyValue("direction")==="rtl";i.numColumns=A,i.isRtl=M}})}function y(v){pc(v,o,k=>{for(let{target:A,isIntersecting:M}of k)A.classList.toggle("onscreen",M)})}r(()=>{async function v(){let{searchText:k,currentGroup:A,databaseLoaded:M,customEmoji:K}=i;if(!M)i.currentEmojis=[],i.searchMode=!1;else if(k.length>=Al){let L=await ee(k);i.searchText===k&&(m(L),S(!0))}else{let{id:L}=A;if(L!==-1||K&&K.length){let H=await Z(L);i.currentGroup.id===L&&(m(H),S(!1))}}}v()});let C=()=>{An(()=>Xl(e.tabpanelElement))};r(()=>{let{currentEmojis:v,emojiVersion:k}=i,A=v.filter(M=>M.unicode).filter(M=>Go(M)&&!js.has(M.unicode));if(!k&&A.length)m(v),An(()=>P(A));else{let M=k?v:v.filter(D);m(M),C()}});function P(v){Yl(v,e.baselineEmoji,h)?C():i.currentEmojis=[...i.currentEmojis]}function D(v){return!v.unicode||!Go(v)||js.get(v.unicode)}async function N(v){let k=i.emojiVersion||await Ls();return v.filter(({version:A})=>!A||A<=k)}async function V(v){return Wl(v,i.emojiVersion||await Ls())}async function Z(v){let k=v===-1?i.customEmoji:await i.database.getEmojiByGroup(v);return V(await N(k))}async function ee(v){return V(await N(await i.database.getEmojiBySearchQuery(v)))}r(()=>{}),r(()=>{function v(){let{searchMode:A,currentEmojis:M}=i;if(A)return[{category:"",emojis:M}];let K=new Map;for(let L of M){let H=L.category||"",oe=K.get(H);oe||(oe=[],K.set(H,oe)),oe.push(L)}return[...K.entries()].map(([L,H])=>({category:L,emojis:H})).sort((L,H)=>i.customCategorySorting(L.category,H.category))}let k=v();g(k)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:v}=i;nr(()=>{i.searchText=(v||"").trim(),i.activeSearchItem=-1})});function j(v){if(!i.searchMode||!i.currentEmojis.length)return;let k=A=>{Re(v),i.activeSearchItem=Rs(A,i.activeSearchItem,i.currentEmojis)};switch(v.key){case"ArrowDown":return k(!1);case"ArrowUp":return k(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Re(v),we(i.currentEmojis[i.activeSearchItem].id)}}function X(v){let{target:k}=v,A=k.closest(".nav-button");if(!A)return;let M=parseInt(A.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(K=>K.id===M)}function Q(v){let{target:k,key:A}=v,M=K=>{K&&(Re(v),K.focus())};switch(A){case"ArrowLeft":return M(k.previousElementSibling);case"ArrowRight":return M(k.nextElementSibling);case"Home":return M(k.parentElement.firstElementChild);case"End":return M(k.parentElement.lastElementChild)}}async function se(v){let k=await i.database.getEmojiByUnicodeOrName(v),A=[...i.currentEmojis,...i.currentFavorites].find(K=>K.id===v),M=A.unicode&&$(A,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(v),{emoji:k,skinTone:i.currentSkinTone,...M&&{unicode:M},...A.name&&{name:A.name}}}async function we(v){let k=se(v);d("emoji-click-sync",k),d("emoji-click",await k)}function pe(v){let{target:k}=v;if(!k.classList.contains("emoji"))return;Re(v);let A=k.id.substring(4);we(A)}function ue(v){i.currentSkinTone=v,i.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:v}),i.database.setPreferredSkinTone(v)}function Ae(v){let{target:{id:k}}=v,A=k&&k.match(/^skintone-(\d)/);if(!A)return;Re(v);let M=parseInt(A[1],10);ue(M)}function ye(v){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Re(v),An(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function b(v){if(!i.skinTonePickerExpanded)return;let k=async A=>{Re(v),i.activeSkinTone=A};switch(v.key){case"ArrowUp":return k(Rs(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return k(Rs(!1,i.activeSkinTone,i.skinTones));case"Home":return k(0);case"End":return k(i.skinTones.length-1);case"Enter":return Re(v),ue(i.activeSkinTone);case"Escape":return Re(v),i.skinTonePickerExpanded=!1,c("skintone-button")}}function O(v){if(i.skinTonePickerExpanded)switch(v.key){case" ":return Re(v),ue(i.activeSkinTone)}}async function z(v){let{relatedTarget:k}=v;(!k||k.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function T(v){i.rawSearchText=v.target.value}return{$set(v){Pn(i,v)},$destroy(){t.abort()}}}function tr(s){s instanceof rt||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var Ns,Ms,Al,qo,nr,Sl,Ml,Dl,Ll,Rl,sr,Il,Yo,Bl,Ds,Ls,js,jl,zl,Ul,Hl,Fl,An,Vl,Gl,Is,ot,Ql,ec,tc,nc,Sn,er,Os,Pn,gc,mc,bc,vc,or,yc,rt,rr,ar=Rn(()=>{Ss();Ns=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,n,e])=>({id:s,emoji:n,name:e})),Ms=Ns.slice(1),Al=2,qo=6,nr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Sl={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Ml=1e3,Dl="🖐️",Ll=8,Rl=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],sr='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Il=(s,n)=>s<n?-1:s>n?1:0,Yo=(s,n)=>{let e=document.createElement("canvas");e.width=e.height=1;let t=e.getContext("2d",{willReadFrequently:!0});return t.textBaseline="top",t.font=`100px ${sr}`,t.fillStyle=n,t.scale(.01,.01),t.fillText(s,0,0),t.getImageData(0,0,1,1).data},Bl=(s,n)=>{let e=[...s].join(","),t=[...n].join(",");return e===t&&!e.startsWith("0,0,0,")};Ls=()=>(Ds||(Ds=new Promise(s=>nr(()=>s(Nl())))),Ds),js=new Map,jl="️",zl="\uD83C",Ul="‍",Hl=127995,Fl=57339;An=requestAnimationFrame,Vl=typeof ResizeObserver=="function";Gl="😀";Ql=new WeakMap,ec=new WeakMap,tc=Symbol("un-keyed"),nc="replaceChildren"in Element.prototype;Sn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);er=new WeakMap;Os=[],{assign:Pn}=Object;gc="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",mc="en",bc={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},vc=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',or=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],yc=`:host{--emoji-font-family:${sr}}`,rt=class extends HTMLElement{constructor(n){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=vc+yc,this.shadowRoot.appendChild(e),this._ctx={locale:mc,dataSource:gc,skinToneEmoji:Dl,customCategorySorting:Il,customEmoji:null,i18n:bc,emojiVersion:null,...n};for(let t of or)t!=="database"&&Object.prototype.hasOwnProperty.call(this,t)&&(this._ctx[t]=this[t],delete this[t]);this._dbFlush()}connectedCallback(){tr(this),this._cmp||(this._cmp=fc(this.shadowRoot,this._ctx))}disconnectedCallback(){tr(this),Sn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:n}=this._ctx;n.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(n,e,t){this._set(n.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),n==="emoji-version"?parseFloat(t):t)}_set(n,e){this._ctx[n]=e,this._cmp&&this._cmp.$set({[n]:e}),["locale","dataSource"].includes(n)&&this._dbFlush()}_dbCreate(){let{locale:n,dataSource:e,database:t}=this._ctx;(!t||t.locale!==n||t.dataSource!==e)&&this._set("database",new xt({locale:n,dataSource:e}))}_dbFlush(){Sn(()=>this._dbCreate())}},rr={};for(let s of or)rr[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(n){if(s==="database")throw new Error("database is read-only");this._set(s,n)}};Object.defineProperties(rt.prototype,rr);customElements.get("emoji-picker")||customElements.define("emoji-picker",rt)});var lr={};Ur(lr,{Database:()=>xt,Picker:()=>rt});var cr=Rn(()=>{ar();Ss()});function ti(s){return{type:"auth",access_token:s}}function ni(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function si(s){let n={type:"subscribe_events"};return s&&(n.event_type=s),n}function In(s){return{type:"unsubscribe_events",subscription:s}}function ii(){return{type:"ping"}}function oi(s,n){return{type:"result",success:!1,error:{code:s,message:n}}}function ai(s){let n={},e=s.split("&");for(let t=0;t<e.length;t++){let o=e[t].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;n[i]=r}return n}var li=(s,n,e,t)=>{let[o,i,r]=s.split(".",3);return Number(o)>n||Number(o)===n&&(t===void 0?Number(i)>=e:Number(i)>e)||t!==void 0&&Number(o)===n&&Number(i)===e&&Number(r)>=t};var qt=!1,Fr="auth_required",Kr="auth_invalid",Wr="auth_ok";function di(s){if(!s.auth)throw 4;let n=s.auth,e=n.expired?n.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,t=n.wsUrl;qt&&console.log("[Auth phase] Initializing",t);function o(i,r,a){qt&&console.log("[Auth Phase] New connection",t);let c=new WebSocket(t),h=!1,d=()=>{if(c.removeEventListener("close",d),h){a(2);return}if(i===0){a(1);return}let m=i===-1?-1:i-1;setTimeout(()=>o(m,r,a),1e3)},l=async m=>{try{n.expired&&await(e||n.refreshAccessToken()),c.send(JSON.stringify(ti(n.accessToken)))}catch(S){h=S===2,c.close()}},u=async m=>{let S=JSON.parse(m.data);switch(qt&&console.log("[Auth phase] Received",S),S.type){case Kr:h=!0,c.close();break;case Wr:c.removeEventListener("open",l),c.removeEventListener("message",u),c.removeEventListener("close",d),c.removeEventListener("error",d),c.haVersion=S.ha_version,li(c.haVersion,2022,9)&&c.send(JSON.stringify(ni())),r(c);break;default:qt&&S.type!==Fr&&console.warn("[Auth phase] Unhandled message",S)}};c.addEventListener("open",l),c.addEventListener("message",u),c.addEventListener("close",d),c.addEventListener("error",d)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var Tt=!1,Gt=class{constructor(n,e){this._handleMessage=t=>{let o=JSON.parse(t.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{Tt&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(In(i.id)).catch(a=>{Tt&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:Tt&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let t=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,t.forEach(r=>{"subscribe"in r||r.reject(oi(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){Tt&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let h of c)h.reject&&h.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(n)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(n){this.socket=n,this.haVersion=n.haVersion,n.addEventListener("message",this._handleMessage),n.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let t=this._queuedMessages;if(t){this._queuedMessages=void 0;for(let o of t)o.resolve()}this.fireEvent("ready")}addEventListener(n,e){let t=this.eventListeners.get(n);t||(t=[],this.eventListeners.set(n,t)),t.push(e)}removeEventListener(n,e){let t=this.eventListeners.get(n);if(!t)return;let o=t.indexOf(e);o!==-1&&t.splice(o,1)}fireEvent(n,e){(this.eventListeners.get(n)||[]).forEach(t=>t(this,e))}suspendReconnectUntil(n){this.suspendReconnectPromise=n}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(n=!1){if(this.socket){if(!n){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(n,e){return this.subscribeMessage(n,si(e))}ping(){return this.sendMessagePromise(ii())}sendMessage(n,e){if(!this.connected)throw 3;if(Tt&&console.log("Sending",n),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(n)});return}e||(e=this._genCmdId()),n.id=e,this.socket.send(JSON.stringify(n))}sendMessagePromise(n){return new Promise((e,t)=>{if(this._queuedMessages){this._queuedMessages.push({reject:t,resolve:async()=>{try{e(await this.sendMessagePromise(n))}catch(i){t(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:t}),this.sendMessage(n,o)})}async subscribeMessage(n,e,t){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),t?.preCheck&&!await t.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:n,subscribe:t?.resubscribe!==!1?()=>this.subscribeMessage(n,e,t):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(In(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var Vr=()=>`${location.protocol}//${location.host}/`,qr=s=>s*1e3+Date.now();function Gr(){let{protocol:s,host:n,pathname:e,search:t}=location;return`${s}//${n}${e}${t}`}function Yr(s,n,e,t){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return n!==null&&(o+=`&client_id=${encodeURIComponent(n)}`),t&&(o+=`&state=${encodeURIComponent(t)}`),o}function Jr(s,n,e,t){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Yr(s,n,e,t)}async function pi(s,n,e){let t=typeof location<"u"&&location;if(t&&t.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;n!==null&&o.append("client_id",n),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=n,r.expires=qr(r.expires_in),r}function ui(s,n,e){return pi(s,n,{code:e,grant_type:"authorization_code"})}function Xr(s){return btoa(JSON.stringify(s))}function Zr(s){return JSON.parse(atob(s))}var Bn=class{constructor(n,e){this.data=n,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let n=await pi(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});n.refresh_token=this.data.refresh_token,this.data=n,this._saveTokens&&this._saveTokens(n)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let n=new FormData;n.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:n}),this._saveTokens&&this._saveTokens(null)}};async function fi(s={}){let n,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let t=s.clientId!==void 0?s.clientId:Vr(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(n=await ui(e,t,s.authCode),s.saveTokens&&s.saveTokens(n)),!n){let i=ai(location.search.substr(1));if("auth_callback"in i){let r=Zr(i.state);if(o&&(r.hassUrl!==e||r.clientId!==t))throw 6;n=await ui(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(n)}}if(!n&&s.loadTokens&&(n=await s.loadTokens()),n&&(e===void 0||n.hassUrl===e))return new Bn(n,s.saveTokens);if(e===void 0)throw 4;return Jr(e,t,s.redirectUrl||Gr(),Xr({hassUrl:e,clientId:t})),new Promise(()=>{})}async function gi(s){let n=Object.assign({setupRetry:0,createSocket:di},s),e=await n.createSocket(n);return new Gt(e,n)}function F(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function Ue(s){let n=Math.floor(Math.round(s)/60)%24;return`${F(s)} ${n<12?"AM":"PM"}`}function mi(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function Et(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function On(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Qr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),ea=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),ta=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Yt(s){return new Date(`${s}T12:00:00Z`)}function Ce(s){let n=Yt(s);return`${Qr.format(n)}, ${ta.format(n)}`}function be(s){return ea.format(Yt(s))}function Me(s,n){return Math.round((Yt(n).getTime()-Yt(s).getTime())/864e5)}function _t(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return _t("UTC",n)}let t=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function Jt(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let o=_t(e,s),i=_t(e,n).date;return o.date===i?`at ${Ue(o.minutes)}`:`on ${be(o.date)} at ${Ue(o.minutes)}`}var ie=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}};function yi(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Ve="mydashlight",na=7,Nn=3e4,bi=3e4;function jn(s){if(s instanceof ie)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new ie(String(n.code??"error"),n.message)}return typeof s=="number"?new ie("connection_lost","Lost the connection to Home Assistant."):new ie("error",String(s))}function vi(s,n){return new Promise((e,t)=>{let o=setTimeout(()=>t(new ie("timeout","Home Assistant didn’t answer.")),n);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),t(i)})})}var Ct=class{constructor(n,e,t,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=n,this.type=e,this.onMessage=t,this.onFailed=o,n.addEventListener?.("ready",this.onReady),n.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let n=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{n===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(n!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{n===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsub;this.dropped(),n&&n().catch(()=>{})}},Xt=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new ie("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.rides?.live??!1}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Ct(this.conn,`${Ve}/rides/subscribe`,n=>{n.plan?this.emit(n.plan):this.fail(new ie("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},Nn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await vi(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_plan",service_data:{days:na},return_response:!0}),bi);this.emit(n.response)}catch(n){this.fail(jn(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:n,service_data:e})}catch(t){throw jn(t)}this.live||await this.refresh()}setRide(n,e,t,o,i){return this.call("set_ride",i===void 0?{event:n,side:e,driver:t,scope:o}:{event:n,side:e,driver:t,scope:o,stay:i})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:On(e),scope:t})}setLeaveBy(n,e,t){return this.call("set_leave_by",e==null?{event:n,scope:t}:{event:n,time:On(e),scope:t})}setTakeAlong(n,e,t,o="drop"){return this.call("set_take_along",{event:n,kids:e,scope:t,side:o})}setTakes(n,e,t){return this.call("set_takes",e==null?{event:n,scope:t}:{event:n,minutes:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}setPeople(n,e,t){return this.call("set_people",{event:n,people:e,scope:t})}watchChores(n){let e=!1,t=!1,o=async()=>{try{let a=await vi(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_chores",service_data:{},return_response:!0}),bi);if(e)return;t=!0,n(a.response??null)}catch{!e&&!t&&n(null)}},i=new Ct(this.conn,`${Ve}/chores/subscribe`,a=>{e||(t=!0,n(a.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},Nn);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(n){let e=!1,t=!1,o=new Ct(this.conn,`${Ve}/lunch/subscribe`,r=>{e||(t=!0,n(r.lunch))},()=>{!e&&!t&&n(null)});o.open();let i=setInterval(()=>{o.live||o.open()},Nn);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(n,e,t){await this.choreCall("set_lunch",{kid:n,dates:e,lunch:t??"default"})}async setLunchMenu(n,e,t,o){await this.choreCall("set_lunch_menu",{kids:n,date:e,menu:t,details:o})}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:n,service_data:e})}catch(t){throw jn(t)}}};var Zt=globalThis,Qt=Zt.ShadowRoot&&(Zt.ShadyCSS===void 0||Zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zn=Symbol(),xi=new WeakMap,Pt=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==zn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(Qt&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=xi.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&xi.set(e,n))}return n}toString(){return this.cssText}},wi=s=>new Pt(typeof s=="string"?s:s+"",void 0,zn),qe=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,o,i)=>t+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new Pt(e,s,zn)},ki=(s,n)=>{if(Qt)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),o=Zt.litNonce;o!==void 0&&t.setAttribute("nonce",o),t.textContent=e.cssText,s.appendChild(t)}},Un=Qt?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return wi(e)})(s):s;var{is:sa,defineProperty:ia,getOwnPropertyDescriptor:oa,getOwnPropertyNames:ra,getOwnPropertySymbols:aa,getPrototypeOf:la}=Object,en=globalThis,$i=en.trustedTypes,ca=$i?$i.emptyScript:"",da=en.reactiveElementPolyfillSupport,At=(s,n)=>s,Hn={toAttribute(s,n){switch(n){case Boolean:s=s?ca:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},_i=(s,n)=>!sa(s,n),Ti={attribute:!0,type:String,converter:Hn,reflect:!1,useDefault:!1,hasChanged:_i};Symbol.metadata??=Symbol("metadata"),en.litPropertyMetadata??=new WeakMap;var Be=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Ti){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),o=this.getPropertyDescriptor(n,t,e);o!==void 0&&ia(this.prototype,n,o)}}static getPropertyDescriptor(n,e,t){let{get:o,set:i}=oa(this.prototype,n)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(n,a,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Ti}static _$Ei(){if(this.hasOwnProperty(At("elementProperties")))return;let n=la(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(At("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(At("properties"))){let e=this.properties,t=[...ra(e),...aa(e)];for(let o of t)this.createProperty(o,e[o])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,o]of e)this.elementProperties.set(t,o)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let o=this._$Eu(e,t);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let o of t)e.unshift(Un(o))}else n!==void 0&&e.push(Un(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ki(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),o=this.constructor._$Eu(n,t);if(o!==void 0&&t.reflect===!0){let i=(t.converter?.toAttribute!==void 0?t.converter:Hn).toAttribute(e,t.type);this._$Em=n,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(n,e){let t=this.constructor,o=t._$Eh.get(n);if(o!==void 0&&this._$Em!==o){let i=t.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Hn;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(n,e,t,o=!1,i){if(n!==void 0){let r=this.constructor;if(o===!1&&(i=this[n]),t??=r.getPropertyOptions(n),!((t.hasChanged??_i)(i,e)||t.useDefault&&t.reflect&&i===this._$Ej?.get(n)&&!this.hasAttribute(r._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:o,wrapped:i},r){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,r??e??this[n]),i!==!0||r!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),o===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[o,i]of t){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};Be.elementStyles=[],Be.shadowRootOptions={mode:"open"},Be[At("elementProperties")]=new Map,Be[At("finalized")]=new Map,da?.({ReactiveElement:Be}),(en.reactiveElementVersions??=[]).push("2.1.2");var Kn=globalThis,Ei=s=>s,tn=Kn.trustedTypes,Ci=tn?tn.createPolicy("lit-html",{createHTML:s=>s}):void 0,Wn="$lit$",Oe=`lit$${Math.random().toFixed(9).slice(2)}$`,Vn="?"+Oe,ha=`<${Vn}>`,Je=document,Mt=()=>Je.createComment(""),Dt=s=>s===null||typeof s!="object"&&typeof s!="function",qn=Array.isArray,Li=s=>qn(s)||typeof s?.[Symbol.iterator]=="function",Fn=`[ 	
\f\r]`,St=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pi=/-->/g,Ai=/>/g,Ge=RegExp(`>|${Fn}(?:([^\\s"'>=/]+)(${Fn}*=${Fn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Si=/'/g,Mi=/"/g,Ri=/^(?:script|style|textarea|title)$/i,Gn=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),p=Gn(1),ae=Gn(2),Dd=Gn(3),Ne=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Di=new WeakMap,Ye=Je.createTreeWalker(Je,129);function Ii(s,n){if(!qn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ci!==void 0?Ci.createHTML(n):n}var Bi=(s,n)=>{let e=s.length-1,t=[],o,i=n===2?"<svg>":n===3?"<math>":"",r=St;for(let a=0;a<e;a++){let c=s[a],h,d,l=-1,u=0;for(;u<c.length&&(r.lastIndex=u,d=r.exec(c),d!==null);)u=r.lastIndex,r===St?d[1]==="!--"?r=Pi:d[1]!==void 0?r=Ai:d[2]!==void 0?(Ri.test(d[2])&&(o=RegExp("</"+d[2],"g")),r=Ge):d[3]!==void 0&&(r=Ge):r===Ge?d[0]===">"?(r=o??St,l=-1):d[1]===void 0?l=-2:(l=r.lastIndex-d[2].length,h=d[1],r=d[3]===void 0?Ge:d[3]==='"'?Mi:Si):r===Mi||r===Si?r=Ge:r===Pi||r===Ai?r=St:(r=Ge,o=void 0);let m=r===Ge&&s[a+1].startsWith("/>")?" ":"";i+=r===St?c+ha:l>=0?(t.push(h),c.slice(0,l)+Wn+c.slice(l)+Oe+m):c+Oe+(l===-2?a:m)}return[Ii(s,i+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},Lt=class s{constructor({strings:n,_$litType$:e},t){let o;this.parts=[];let i=0,r=0,a=n.length-1,c=this.parts,[h,d]=Bi(n,e);if(this.el=s.createElement(h,t),Ye.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(o=Ye.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let l of o.getAttributeNames())if(l.endsWith(Wn)){let u=d[r++],m=o.getAttribute(l).split(Oe),S=/([.?@])?(.*)/.exec(u);c.push({type:1,index:i,name:S[2],strings:m,ctor:S[1]==="."?sn:S[1]==="?"?on:S[1]==="@"?rn:Ze}),o.removeAttribute(l)}else l.startsWith(Oe)&&(c.push({type:6,index:i}),o.removeAttribute(l));if(Ri.test(o.tagName)){let l=o.textContent.split(Oe),u=l.length-1;if(u>0){o.textContent=tn?tn.emptyScript:"";for(let m=0;m<u;m++)o.append(l[m],Mt()),Ye.nextNode(),c.push({type:2,index:++i});o.append(l[u],Mt())}}}else if(o.nodeType===8)if(o.data===Vn)c.push({type:2,index:i});else{let l=-1;for(;(l=o.data.indexOf(Oe,l+1))!==-1;)c.push({type:7,index:i}),l+=Oe.length-1}i++}}static createElement(n,e){let t=Je.createElement("template");return t.innerHTML=n,t}};function Xe(s,n,e=s,t){if(n===Ne)return n;let o=t!==void 0?e._$Co?.[t]:e._$Cl,i=Dt(n)?void 0:n._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=o:e._$Cl=o),o!==void 0&&(n=Xe(s,o._$AS(s,n.values),o,t)),n}var nn=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,o=(n?.creationScope??Je).importNode(e,!0);Ye.currentNode=o;let i=Ye.nextNode(),r=0,a=0,c=t[0];for(;c!==void 0;){if(r===c.index){let h;c.type===2?h=new dt(i,i.nextSibling,this,n):c.type===1?h=new c.ctor(i,c.name,c.strings,this,n):c.type===6&&(h=new an(i,this,n)),this._$AV.push(h),c=t[++a]}r!==c?.index&&(i=Ye.nextNode(),r++)}return Ye.currentNode=Je,o}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},dt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,o){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Xe(this,n,e),Dt(n)?n===_||n==null||n===""?(this._$AH!==_&&this._$AR(),this._$AH=_):n!==this._$AH&&n!==Ne&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Li(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==_&&Dt(this._$AH)?this._$AA.nextSibling.data=n:this.T(Je.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,o=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=Lt.createElement(Ii(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new nn(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(n){let e=Di.get(n.strings);return e===void 0&&Di.set(n.strings,e=new Lt(n)),e}k(n){qn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,o=0;for(let i of n)o===e.length?e.push(t=new s(this.O(Mt()),this.O(Mt()),this,this.options)):t=e[o],t._$AI(i),o++;o<e.length&&(this._$AR(t&&t._$AB.nextSibling,o),e.length=o)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=Ei(n).nextSibling;Ei(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Ze=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,o,i){this.type=1,this._$AH=_,this._$AN=void 0,this.element=n,this.name=e,this._$AM=o,this.options=i,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=_}_$AI(n,e=this,t,o){let i=this.strings,r=!1;if(i===void 0)n=Xe(this,n,e,0),r=!Dt(n)||n!==this._$AH&&n!==Ne,r&&(this._$AH=n);else{let a=n,c,h;for(n=i[0],c=0;c<i.length-1;c++)h=Xe(this,a[t+c],e,c),h===Ne&&(h=this._$AH[c]),r||=!Dt(h)||h!==this._$AH[c],h===_?n=_:n!==_&&(n+=(h??"")+i[c+1]),this._$AH[c]=h}r&&!o&&this.j(n)}j(n){n===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},sn=class extends Ze{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===_?void 0:n}},on=class extends Ze{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==_)}},rn=class extends Ze{constructor(n,e,t,o,i){super(n,e,t,o,i),this.type=5}_$AI(n,e=this){if((n=Xe(this,n,e,0)??_)===Ne)return;let t=this._$AH,o=n===_&&t!==_||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,i=n!==_&&(t===_||o);o&&this.element.removeEventListener(this.name,this,t),i&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},an=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){Xe(this,n)}},Oi={M:Wn,P:Oe,A:Vn,C:1,L:Bi,R:nn,D:Li,V:Xe,I:dt,H:Ze,N:on,U:rn,B:sn,F:an},ua=Kn.litHtmlPolyfillSupport;ua?.(Lt,dt),(Kn.litHtmlVersions??=[]).push("3.3.3");var Ni=(s,n,e)=>{let t=e?.renderBefore??n,o=t._$litPart$;if(o===void 0){let i=e?.renderBefore??null;t._$litPart$=o=new dt(n.insertBefore(Mt(),i),i,void 0,e??{})}return o._$AI(s),o};var Yn=globalThis,_e=class extends Be{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Ni(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ne}};_e._$litElement$=!0,_e.finalized=!0,Yn.litElementHydrateSupport?.({LitElement:_e});var pa=Yn.litElementPolyfillSupport;pa?.({LitElement:_e});(Yn.litElementVersions??=[]).push("4.2.2");var ji={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},zi=s=>(...n)=>({_$litDirective$:s,values:n}),ln=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:fa}=Oi,Ui=s=>s;var Hi=()=>document.createComment(""),ht=(s,n,e)=>{let t=s._$AA.parentNode,o=n===void 0?s._$AB:n._$AA;if(e===void 0){let i=t.insertBefore(Hi(),o),r=t.insertBefore(Hi(),o);e=new fa(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||a){let c=e._$AA;for(;c!==i;){let h=Ui(c).nextSibling;Ui(t).insertBefore(c,o),c=h}}}return e},He=(s,n,e=s)=>(s._$AI(n,e),s),ga={},Fi=(s,n=ga)=>s._$AH=n,Ki=s=>s._$AH,cn=s=>{s._$AR(),s._$AA.remove()};var Wi=(s,n,e)=>{let t=new Map;for(let o=n;o<=e;o++)t.set(s[o],o);return t},je=zi(class extends ln{constructor(s){if(super(s),s.type!==ji.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let o=[],i=[],r=0;for(let a of s)o[r]=t?t(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let o=Ki(s),{values:i,keys:r}=this.dt(n,e,t);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],c=[],h,d,l=0,u=o.length-1,m=0,S=i.length-1;for(;l<=u&&m<=S;)if(o[l]===null)l++;else if(o[u]===null)u--;else if(a[l]===r[m])c[m]=He(o[l],i[m]),l++,m++;else if(a[u]===r[S])c[S]=He(o[u],i[S]),u--,S--;else if(a[l]===r[S])c[S]=He(o[l],i[S]),ht(s,c[S+1],o[l]),l++,S--;else if(a[u]===r[m])c[m]=He(o[u],i[m]),ht(s,o[l],o[u]),u--,m++;else if(h===void 0&&(h=Wi(r,m,S),d=Wi(a,l,u)),h.has(a[l]))if(h.has(a[u])){let g=d.get(r[m]),$=g!==void 0?o[g]:null;if($===null){let E=ht(s,o[l]);He(E,i[m]),c[m]=E}else c[m]=He($,i[m]),ht(s,o[l],$),o[g]=null;m++}else cn(o[u]),u--;else cn(o[l]),l++;for(;m<=S;){let g=ht(s,c[S+1]);He(g,i[m]),c[m++]=g}for(;l<=u;){let g=o[l++];g!==null&&cn(g)}return this.ut=r,Fi(s,c),Ne}});var dn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ce(s){return dn[(s%dn.length+dn.length)%dn.length]}var hn="#23272E",Jn="35,39,46";var ma=3,It=36,Xn=12,un=8,Vi=30,De=16,Rt=100,ut=60,Qn=10,pn=30,es=10,ba=150,va=150,mn=1;function eo(s,n){return s.dayHeads[Math.max(0,Math.floor(n/1440))]?.h??It}var ya=26,to=4;function ns(s,n){let e=Math.max(ba,va/mn);return Math.ceil(ut+Math.max(0,s-1)*Qn+pn+Math.max(0,n-1)*es+e*(s+mn*n))}function Ee(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function xe(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ke(s){return new Map(Ee(s).map((n,e)=>[n,ce(e)]))}function me(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function fe(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function ss(s,n){return n==="none"?"Not needed":xe(s).includes(n)?fe(s,n):n}function no(s){return s.leave_by!=null&&s.leave_by>s.start&&s.leave_by<s.end?` · leave ${F(s.leave_by)}`:""}function bn(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${F(s.end)}`;if(s.end>=1440)return`From ${F(s.start)}`}return`${F(s.start)}–${F(s.end)}`}function vn(s,n){return n.own?fe(s,n.own):me(s,n.kid)}var pt={color:hn,rgb:Jn,ink:hn};function so(s,n){return n.own?pt:ke(s).get(n.kid)??ce(0)}function xa(s,n){let e=Ee(s);return n.along.map(t=>e.includes(t)?me(s,t):fe(s,t))}function ft(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function wa(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function fn(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function Zn(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(fn(n,t.from)),e.push(fn(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(fn(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function ka(s){let n=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],t=[],o=-1/0,i=()=>{for(let r of e)r.cols=t.length;e=[],t=[]};for(let r of n){r.s>=o&&(i(),o=-1/0);let a=t.findIndex(c=>c<=r.s);a<0?(a=t.length,t.push(r.en)):t[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),n}function $a(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],o=s[e+1];if(n<=o.t)return o.t===t.t?t.y:Math.round(t.y+(n-t.t)/(o.t-t.t)*(o.y-t.y))}return s[s.length-1].y}function Ta(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],o=s[e+1];if(n<=o.y)return o.y===t.y?t.t:t.t+(n-t.y)/(o.y-t.y)*(o.t-t.t)}return s[s.length-1].t}function io(s,n){return $a(s.anchors,n)}function is(s,n){return Ta(s.anchors,n)}function _a(s,n){let e=Ee(s),t=xe(s),o=Math.max(n,ns(e.length,t.length)),r=(o-ut-Math.max(0,e.length-1)*Qn-pn-Math.max(0,t.length-1)*es)/(e.length+mn*t.length||1),a=Math.floor(r),c=Math.floor(r*mn),h=s.whole_week??s.days,d=new Map;for(let g of h)for(let $ of g.events)for(let E of $.own?$.along:[$.kid]){let f=d.get(E)??[];f.some(B=>B.event_id===$.event_id&&B.calendar_id===$.calendar_id)||f.push($),d.set(E,f)}let l=ke(s),u=[],m=ut;e.forEach((g,$)=>{let E=d.get(g)??[],f=s.days.some(B=>B.events.some(U=>U.kid===g&&(U.sides.includes("drop")&&U.drop===""||U.sides.includes("pick")&&U.pick==="")));u.push({id:g,kind:"kid",x:m,w:a,name:me(s,g),dot:l.get(g).color,rgb:l.get(g).rgb,sub:`${f?"Needs a ride · ":""}${E.length} this week`,subWarn:f}),m+=a+($<e.length-1?Qn:0)});let S=m+pn/2;return m+=pn,t.forEach((g,$)=>{let E=0,f=0;for(let B of h){let U=B.drivers[g];U&&(E+=U.outings.length,f+=U.drive??0)}u.push({id:g,kind:"driver",x:m,w:c,name:fe(s,g),dot:hn,rgb:Jn,sub:`${E} ${E===1?"trip":"trips"} this week · ${Et(f)} driving`,subWarn:!1}),m+=c+($<t.length-1?es:0)}),{columns:u,sepX:S,width:o}}function Ea(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(n.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function qi(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${F(s.start)}`:e||!n?`${s.title} until ${F(s.end)}`:`${s.title} ${F(s.start)}–${F(s.end)}`}function os(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function rs(s,n){let e=Me(n,s);return e===0?"Today":e===1?"Tomorrow":""}function de(s,n=0){return s==null||!Number.isFinite(s)?n:s}function ts(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=t?i+=1+a:(o++,i=a);i>t;)o++,i-=t}return o}var oo=25,Ca=15,ro=3;function Gi(s){return Math.max(0,Math.min(ro,Math.floor((s-oo)/Ca)))}var Pa=oo+2,Yi=20;function Ji(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var gn="🚗";function Xi(s,n){if(s===(n==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),t;if(n==="drop"){if(t=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(t[1],t[2],t[3]);if(t=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(t[2],t[1],t[3],!0);if(t=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",t[1],t[2])}else{if(t=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(t[1]??t[2],t[3],t[4]);if(t=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",t[1],t[2])}return null}var Zi={muted:0,normal:1,pending:2,problem:3};function ao(s){let{drop:n,pick:e}=s,t=n?Xi(n.text,"drop"):null,o=e?Xi(e.text,"pick"):null;if(n&&!t||e&&!o||!t&&!o)return s;let i=[n,e].reduce((c,h)=>h&&(Zi[h.tone]??1)>(Zi[c]??1)?h.tone:c,(n??e).tone);if(t==="needed"&&o==="needed")return{drop:{text:`${gn} No rides yet`,tone:i},pick:null};if(t&&o&&t!=="needed"&&o!=="needed"&&t.who===o.who&&!t.extra&&!o.extra){let c=`${gn} ${t.who}${t.stays?" stays":""}`;return!t.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:{drop:{text:`${c} ↓${t.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,h)=>c==="needed"?`${h} needed`:`${h}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[t?r(t,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${gn} ${a.join(" · ")}`,tone:i},pick:null}}function Qi(s,n){let e=n-23,t=`${F(s.start)}–${F(s.end)}`+(s.arrive_by!=null?` · arrive ${F(s.arrive_by)}`:"")+no(s),o=33+ts(t,e,6.6)*16,i=s.own?s.lines:ao(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+ts(r.text,e,7)*16);return o+4}function lo(s,n,e,t){let o=n==="compact",{columns:i,sepX:r,width:a}=_a(s,e),c=new Map(i.map(f=>[f.id,f])),h=Ee(s),d=xe(s),l=[...h,...d],u=ke(s),m=wa(s),S=f=>me(s,f),g=f=>fe(s,f),$={mode:n,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},E=0;return s.days.forEach((f,B)=>{let U=B*1440,q=new Map(f.events.map(b=>[b.id,b])),he=b=>b&&q.has(b)?{day:f.date,event:b}:null,x=os(f),w=f.events.length,y=rs(f.date,t.date),C=Da(s,f,u,a);$.dayHeads.push({date:f.date,y:E,label:Ce(f.date),tag:y,sub:(w?`${w} ${w===1?"activity":"activities"}${f.done?" left":""}`:f.done?"All done for today":"Nothing scheduled")+(x?` · ${x} to sort out`:""),warn:x>0,h:It+(C?C.h+to+2:0),allDay:C?.chips??[]}),$.anchors.push({t:U,y:E});let P=$.dayHeads[$.dayHeads.length-1],D=E+P.h+Xn,N=d.flatMap(b=>f.drivers[b]?.outings??[]);if(!w&&!N.length){$.empties.push({key:f.date,y:D,text:f.done?"Nothing else today":"Nothing planned"}),E=D+40,$.anchors.push({t:U+1439,y:E});return}let V=(b,O,z,T,v,k,A,M=b.kid)=>{let K=!!b.own&&M===b.own,L=!!b.own&&M!==b.own,H=K?pt:u.get(M)??ce(0),oe=K?g(M):S(M),ge=L?{drop:{text:`With ${g(b.own)}`,tone:b.attending===!1?"muted":"normal"},pick:null}:A&&!b.own?ao(b.lines):b.lines,G=K?xa(s,b):[],Te=(b.takes!=null?`${b.takes} min, any time ${F(b.start)}–${F(b.end)}`:bn(b)+(b.arrive_by!=null?` · arrive ${F(b.arrive_by)}`:"")+no(b))+(G.length?` · with ${ft(G)}`:"");return{key:`${f.date}|card|${b.id}`+(b.own?`|${M}`:""),x:O,y:z,w:T,h:v,target:{day:f.date,event:b.id},event:b,color:H,kidName:oe,clash:k,stayed:!b.own&&b.stay&&d.includes(b.drop),skipped:b.attending===!1,title:Ea(b.title,oe),time:Te,drop:ge.drop,pick:ge.pick,showDrop:!!ge.drop&&(A||v>=56),showPick:!!ge.pick&&(A||v>=74),wrap:A,aria:`${oe}, ${b.title} ${b.takes!=null?`any time from ${F(b.start)} to ${F(b.end)}`:bn(b).replace("–"," to ")}. `+(b.attending===!1&&!ge.drop?"Not attending. ":"")+[ge.drop,ge.pick].filter(Ie=>!!Ie).map(Ie=>Ie.text).join(". ")}},Z=b=>{let O=f.rides[b];return O?(f.drivers[O.driver]?.segments??[]).filter(T=>T.type!=="home"&&T.kids.includes(O.kid)&&de(T.start)>=de(O.start)&&de(T.end)<=de(O.end)):[]},ee=b=>{let O=f.rides[b];if(!O)return null;let z=O.serves.find(T=>q.get(T)?.kid===O.kid);return he(z??O.serves[0])},j=(b,O)=>{if(O.event)return O;let z=f.events.find(T=>T.own&&T.own!==b&&T.along.includes(b)&&T.title===O.title);return z?{...O,title:`${O.title} with ${g(z.own)}`}:O},X=b=>{if(b.takes==null)return[b.start,b.end];let O=b.planned??b.start;return[O,O+b.takes]},Q=new Map;for(let b of f.issues)b.level!=="problem"||!b.event||(b.kind==="late"&&Q.set(b.event,`${Math.round(de(b.minutes))} min late`),b.kind==="waiting"&&Q.set(`${b.event}|pick`,`Waits ${Math.round(de(b.minutes))} min`));if(!o){let b=1/0,O=-1/0;for(let L of f.events)L.start<=0&&L.end>=1440||(L.start>0?b=Math.min(b,L.start-20,L.arrive_by!=null?L.arrive_by-10:1/0):b=Math.min(b,L.end-30),L.end<1440?O=Math.max(O,L.end+20):O=Math.max(O,L.start+30));for(let L of N)L.start!=null&&(b=Math.min(b,L.start)),L.end!=null&&(O=Math.max(O,L.end));let z=f.from;z!=null&&Number.isFinite(b)&&b<z+60?b=z-15:f.date===t.date&&Number.isFinite(b)&&t.minutes>b-60&&t.minutes<O&&(b=Math.min(b,t.minutes-15));let T=Number.isFinite(b)?Math.floor((b-5)/30)*30:900,v=Math.max(Number.isFinite(O)?Math.ceil((O+5)/30)*30:960,T+60),k=L=>z!=null&&de(L)<=T,A=L=>z!=null&&de(L)<T,M=L=>Math.round(D+(Math.max(T,Math.min(v,L))-T)*ma);$.anchors.push({t:U+T,y:M(T)},{t:U+v,y:M(v)});for(let L of h){let H=c.get(L),oe=u.get(L),ge=(f.kids[L]?.items??[]).filter(R=>R.start!=null&&R.end!=null&&!k(R.end)).map(R=>({item:R,s:de(R.start),en:de(R.end)})),G=[];for(let R of ka(ge)){let W=H.w/R.cols,Y=Math.round(H.x+R.col*W),te=Math.round(W-(R.cols>1?4:0)),re=M(R.s),ne=R.item;if(ne.type==="act"){let $e=q.get(ne.event??"");if(!$e)continue;let Vt=Math.max(30,M(R.en)-re),lt=V($e,Y,re,te,Vt,ne.clash,!1,L);if(lt.layer=Rt,lt.cut=A(R.s),$.cards.push(lt),$e.arrive_by!=null&&$e.start-$e.arrive_by>=5&&!lt.cut){let Ln=M($e.arrive_by),ei={key:`${f.date}|prep|${$e.id}`,x:Y,y:Ln,w:te,h:re-Ln+De,color:oe,label:`Arrive by ${F($e.arrive_by)}`,layer:Rt-1};$.preps.push(ei),G.push({s:$e.arrive_by,en:R.en,top:Ln,bottom:re+Vt,x:Y,w:te,prep:ei,card:lt})}else G.push({s:R.s,en:R.en,top:re,bottom:re+Vt,x:Y,w:te,card:lt});let Zs=Q.get($e.id);Zs&&$.marks.push({key:`${f.date}|late|${$e.id}`,x:Y+te-4,y:re+4,text:Zs,right:!0});let Qs=Q.get(`${$e.id}|pick`);Qs&&$.marks.push({key:`${f.date}|wait|${$e.id}`,x:Y+4,y:re+Vt+2,text:Qs,right:!1});continue}let J=f.rides[ne.ride??-1];if(!J)continue;let Se=Math.max(22,M(R.en)-re),$t=Zn(Z(J.index),m),Ys=g(J.driver),Js={key:`${f.date}|ride|${J.index}`,x:Y,y:re,w:te,h:Se,target:ee(J.index),l1:`${J.own?"In":"Along in"} ${Ys}’s car`,l2:$t.join(" → "),show2:Gi(Se)>0,lines2:Gi(Se),dashed:!J.own,clash:ne.clash,aria:`${S(L)} ${J.own?"in":"riding along in"} ${Ys}’s car, ${F(de(J.start))} to ${F(de(J.end))}: ${$t.join(" to ")}`};$.rides.push(Js);let Xs=c.get(J.driver),Dn=null;Xs&&(Dn={key:`${f.date}|band|${J.index}`,x:Y+te,y:re,w:Math.max(0,Xs.x+8-(Y+te)),h:Se,color:oe},$.bands.push(Dn)),G.push({s:R.s,en:R.en,top:re,bottom:re+Se,x:Y,w:te,ride:Js,band:Dn})}let Te=R=>R.ride?.layer??(R.prep?Rt-1:Rt),Ie=(R,W,Y,te)=>{Y>De&&$.links.push({key:`${R.key}|link`,x:R.x,y:W,w:R.w,h:Y,color:oe,layer:te})},I=(R,W)=>{if(!(W.x<R.x||W.x+W.w>R.x+R.w)&&(R.x=W.x,R.w=W.w,R.ride.x=W.x,R.ride.w=W.w,R.band)){let Y=R.band.x+R.band.w;R.band.x=W.x+W.w,R.band.w=Math.max(0,Y-R.band.x)}},le=new Set;for(let R of[...G].sort((W,Y)=>Y.s-W.s)){let W=R.ride;if(!W)continue;let Y=G.filter(ne=>ne!==R&&ne.s>=R.en&&ne.s-R.en<=Vi&&ne.top>=R.bottom).sort((ne,J)=>ne.s-J.s||ne.top-J.top)[0];if(!Y)continue;le.add(R),I(R,Y);let te=Te(Y),re=Y.top-R.bottom;Ie(W,R.bottom,re+De,te-1),W.layer=te-(re>0?2:1),W.h+=De,W.tuckBottom=De}for(let R of[...G].sort((W,Y)=>W.s-Y.s)){let W=R.ride;if(!W||le.has(R))continue;let Y=G.filter(ne=>ne!==R&&ne.en<=R.s&&R.s-ne.en<=Vi&&ne.bottom<=R.top&&(ne.card||ne.ride?.layer!=null)).sort((ne,J)=>J.en-ne.en||J.bottom-ne.bottom)[0];if(!Y)continue;I(R,Y);let te=Y.ride?.layer??Rt,re=R.top-Y.bottom;Ie(W,Y.bottom-De,re+De,te-1),W.layer=te-(re>0?2:1),W.y-=De,W.h+=De,W.tuckTop=De}}for(let L of d){let H=c.get(L),oe=f.drivers[L];if(!oe)continue;let ge=[],G=null;for(let I of oe.segments)if(!(I.start==null||I.end==null)){if(I.type==="home"){G=null;continue}if(I.type==="stay"){G=null,ge.push({type:"stay",g:I,s:I.start,en:I.end});continue}G&&G.en===I.start?(G.en=I.end,G.legs.push(I)):(G={type:"trip",s:I.start,en:I.end,legs:[I]},ge.push(G))}let Te=new Set,Ie=(I,le,R,W)=>{Te.add(I.id);let Y=M(le),te=V(I,H.x+8,Y,H.w-16,Math.max(30,M(R)-Y),!1,!1,L);te.cut=A(le),W&&te.drop?.tone==="normal"&&(te.drop=null,te.showDrop=!1),$.cards.push(te)};for(let I of ge){if(k(I.en))continue;let le=M(I.s),R=Math.max(24,M(I.en)-le);if(I.type==="stay"){let J=q.get(I.g.event??I.g.serves??"");if(J?.own===L){Ie(J,I.s,I.en,!0);continue}let Se=J?u.get(J.kid)??ce(0):ce(0),$t=I.g.kids.map(S);$.stays.push({cut:A(I.s),key:`${f.date}|stay|${L}|${I.s}`,x:H.x+8,y:le,w:H.w-16,h:R,target:he(J?.id),color:Se,l1:J?`At ${J.title} with ${S(J.kid)}`:"Staying",l2:`until ${F(I.en)}`+($t.length?` · ${$t.join(" and ")} too`:"")});continue}let W=I.legs[0],Y=I.legs[I.legs.length-1],te=[];for(let J of I.legs)for(let Se of J.kids)te.includes(Se)||te.push(Se);let re=Y.type==="drive"&&Y.to==="home",ne=Zn(I.legs,m);$.trips.push({key:`${f.date}|trip|${L}|${I.s}`,x:H.x+8,y:le,w:H.w-16,h:R,target:he(I.legs.find(J=>J.serves)?.serves),l1:W.type==="drive"&&W.from==="home"?`Leave ${F(I.s)}`:`From ${fn(m,W.from??W.place)} ${F(I.s)}`,l2:ne.join(" → "),show2:R>=36,l3:re?`Home ${F(I.en)}`:"",show3:re&&R>=62,stops:null,kids:te.map(J=>(u.get(J)??ce(0)).color),bad:I.legs.some(J=>J.overlaps_busy),aria:`${g(L)} drives ${ne.join(" to ")}, ${F(I.s)} to ${F(I.en)}`})}for(let I of oe.segments)if(!(!I.overlaps_busy||I.start==null||I.end==null))for(let le of oe.busy){let R=Math.max(I.start,le.start),W=Math.min(I.end,le.end);W<=R||k(W)||$.overlaps.push({key:`${f.date}|overlap|${L}|${R}`,x:H.x+6,y:M(R)-2,w:H.w-12,h:Math.max(8,M(W)-M(R)+4)})}for(let I of f.events)if(I.own===L&&(!Te.has(I.id)&&!k(X(I)[1])&&Ie(I,...X(I),!1),I.takes!=null&&I.attending!==!1&&!k(I.end))){let le=M(I.start);$.windows.push({key:`${f.date}|window|${I.id}`,x:H.x+4,y:le,w:H.w-8,h:Math.max(24,M(I.end)-le),label:`${I.title} · any time ${F(I.start)}–${F(I.end)}`})}for(let I of oe.busy){if(I.event||I.end<=T||I.start>=v)continue;let le=j(L,I),R=M(le.start),W=M(le.end);$.busy.push({key:`${f.date}|busy|${L}|${le.start}`,x:H.x+1,y:R,w:H.w-2,h:W-R,labelY:8,label:qi(le,!1)})}}let K=-1/0;for(let L=T;L<=v;L+=30)$.grid.push({key:`${f.date}|grid|${L}`,y:M(L),strong:L%60===0}),L%60===0&&M(L)-K>=22&&($.hours.push({key:`${f.date}|hour|${L}`,y:M(L)-8,label:mi(L)}),K=M(L));f.date===t.date&&t.minutes>T&&t.minutes<v&&($.now={y:M(t.minutes),label:`Now ${F(t.minutes)}`}),E=M(v)+Xn;return}let se=[];for(let b of h){let O=c.get(b);for(let z of f.kids[b]?.items??[])if(z.start!=null){if(z.type==="act"){let T=q.get(z.event??"");if(!T)continue;se.push({col:b,s:z.start,h:Qi(T,O.w),kind:"act",item:z})}else if(!f.rides[z.ride??-1]?.own){let T=f.rides[z.ride??-1],v=T?f.drivers[T.driver]?.outings.find(k=>k.start!=null&&k.start<=de(T.start)&&de(T.start)<=de(k.end,k.start)):void 0;se.push({col:b,s:v?.start??z.start,h:Pa,kind:"along",item:z})}}}for(let b of d){let O=f.drivers[b];if(!O)continue;for(let T of O.busy)T.event||se.push({col:b,s:T.start,h:32,kind:"busy",busy:j(b,T)});let z=c.get(b).w;for(let T of f.events)T.own!==b||!T.busy_only&&T.attending!==!1&&(T.takes==null||T.planned!=null)||se.push({col:b,s:X(T)[0],h:Qi(T,z),kind:"own",event:T});for(let T of O.outings){if(T.start==null)continue;let k=[...Ji(T.lines)?T.lines.slice(0,-1):T.lines,...T.warn?[T.warn]:[]].reduce((A,M)=>A+ts(M,z-36,7),0);se.push({col:b,s:T.start,h:30+k*16,kind:"out",out:T})}}se.sort((b,O)=>b.s-O.s||l.indexOf(b.col)-l.indexOf(O.col));let we=new Map,pe=[],ue=new Map,Ae=D-Yi;for(let b=0;b<se.length;){let O=b,z=Ae+Yi;for(;O<se.length&&se[O].s===se[b].s;O++){let v=we.get(se[O].col);v!=null&&(z=Math.max(z,v+un))}let T=new Set;for(let v=b;v<O;v++){let k=se[v],A=T.has(k.col)?we.get(k.col)+un:z;T.add(k.col),we.set(k.col,A+k.h)}ue.set(se[b].s,z),se[b].s>0&&$.hours.push({key:`${f.date}|hour|${se[b].s}`,y:z+2,label:Ue(se[b].s)}),Ae=z,b=O}we.clear(),se.forEach((b,O)=>{let z=we.get(b.col),T=Math.max(z!=null?z+un:D,ue.get(b.s));we.set(b.col,T+b.h);let v=b.kind==="busy"?b.busy.end:b.kind==="act"?q.get(b.item.event??"")?.end??null:b.kind==="own"?X(b.event)[1]:null;pe.push({col:b.col,s:b.s,end:v,y:T,h:b.h,box:null}),$.anchors.push({t:U+b.s,y:T});let k=c.get(b.col);if(b.kind==="busy"){let A={key:`${f.date}|busy|${b.col}|${O}`,x:k.x+1,y:T,w:k.w-2,h:b.h,labelY:8,label:qi(b.busy,!0)};$.busy.push(A),pe[pe.length-1].box=A}else if(b.kind==="out"){let A=b.out,M=Ji(A.lines),K=M?A.lines.slice(0,-1):A.lines;$.trips.push({key:`${f.date}|trip|${b.col}|${O}`,x:k.x+8,y:T,w:k.w-16,h:b.h,target:he(A.target),l1:M?`${A.lead} · home ${M}`:A.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...K.map(L=>({text:L,warn:!1})),...A.warn?[{text:A.warn,warn:!0}]:[]],kids:A.kids.map(L=>(u.get(L)??ce(0)).color),bad:!!A.warn,aria:`${g(b.col)}: ${A.lead}. ${A.lines.join(". ")}${A.warn?`. ${A.warn}`:""}`})}else if(b.kind==="own"){let A=V(b.event,k.x+8,T,k.w-16,b.h,!1,!0,b.col);$.cards.push(A),pe[pe.length-1].box=A}else if(b.kind==="act"){let A=q.get(b.item.event??""),M=V(A,k.x,T,k.w,b.h,b.item.clash,!0,b.col);$.cards.push(M),pe[pe.length-1].box=M}else{let A=f.rides[b.item.ride??-1],M=Zn(Z(A.index),m),K=g(A.driver);$.rides.push({key:`${f.date}|ride|${A.index}`,x:k.x,y:T,w:k.w,h:b.h,target:ee(A.index),l1:`${gn} with ${K}`,l2:M.join(" → "),show2:!1,lines2:ro,dashed:!0,clash:b.item.clash,aria:`${S(b.col)} riding along with ${K}, ${F(de(A.start))} to ${F(de(A.end))}: ${M.join(" to ")}`})}});let ye=D;for(let b of we.values())ye=Math.max(ye,b);for(let b of pe){if(!b.box||b.end==null)continue;let O=b.y+b.h;for(let z of pe)z.col!==b.col&&z.s>=b.s&&z.s<b.end&&(O=Math.max(O,z.y+z.h));b.end>=1440&&(O=ye);for(let z of pe)z.col===b.col&&z.y>b.y&&(O=Math.min(O,z.y-un));O=Math.min(O,ye),O>b.y+b.h&&(b.box.h=O-b.y)}E=ye+Xn+6,$.anchors.push({t:U+1439,y:E})}),$.height=E,$}var Aa=["","¼","½","¾"];function Qe(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return Et(t);let o=Math.round(t*4),i=Math.floor(o/4),r=Aa[o%4];return`${i||!r?i:""}${r} min`})}function co(s){let n=e=>e?{...e,text:Qe(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,o])=>[t,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Qe),warn:i.warn==null?i.warn:Qe(i.warn)}))}])),issues:e.issues.map(t=>({...t,title:Qe(t.title),body:Qe(t.body),note:t.note==null?t.note:Qe(t.note),...t.suggestions?{suggestions:t.suggestions.map(o=>({...o,note:Qe(o.note)}))}:{}}))}))}}var Sa=2,Ma=48;function ho(s,n,e=Ma){let t=[],o=new Set(xe(s)),i=Ee(s).map(u=>me(s,u)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],a=0,c=0,h=0,d=0,l=n.minutes+e*60;for(let u of s.days){let m=Me(n.date,u.date),S=m===0?"":`${be(u.date)} · `,g=new Map(u.events.map(f=>[f.id,f])),$=f=>f&&g.has(f)?{day:u.date,event:f}:null,E=(f,B)=>m*1440+(f??g.get(B??"")?.start??0)<l;for(let f of u.issues)if(f.level==="problem"){if(!E(f.at,f.event)){h++,f.kind==="unassigned"&&d++;continue}a++,f.kind==="unassigned"&&c++,t.push({key:`${u.date}|${f.key}`,tone:f.kind==="unassigned"?"unassigned":"problem",title:S+f.title,body:f.body,target:$(f.event),suggestions:(f.suggestions??[]).map(B=>({id:B.id,label:B.label,note:B.note}))})}if(u.clashes.forEach((f,B)=>{if(!E(f.a.start,f.a.event)){h++;return}a++;let U=g.get(f.a.event??""),q=me(s,f.kid),he=(w,y)=>{let C=$(y);return C?{text:w,target:C}:w},x=[];if(f.b.type==="act"){let w=g.get(f.b.event??"");U&&w&&(x=[he(U.title,U.id),` ${F(U.start)}–${F(U.end)} and `,he(w.title,w.id),` ${F(w.start)}–${F(w.end)} overlap.`])}else{let w=u.rides[f.b.ride??-1];U&&w&&(x=[`${q} is in `,he(`${fe(s,w.driver)}’s car`,w.serves[0]),` ${F(de(f.b.start))}–${F(de(f.b.end))}, during `,he(U.title,U.id),"."])}t.push({key:`${u.date}|clash|${B}`,tone:"problem",title:`${S}${q} is double-booked`,body:x.map(w=>typeof w=="string"?w:w.text).join(""),parts:x,target:null,suggestions:[]})}),m>=0&&m<Sa)for(let f of u.issues)f.level!=="heads_up"||!E(f.at,f.event)||t.push({key:`${u.date}|${f.key}`,tone:"heads_up",title:S+f.title,body:f.body,target:$(f.event),suggestions:[]});for(let f of u.unplaced??[]){if(!E(f.at)){h++;continue}a++;let B=f.people.map(q=>o.has(q)?fe(s,q):me(s,q)),U=f.from_notes?"The For line in its notes":"Its title";t.push({key:`${u.date}|unplaced|${f.id}`,tone:"problem",title:`${S}${F(f.at)} ${f.title}: ${uo(f).toLowerCase()}`,body:f.reason==="unknown"&&f.word?`${U} names “${f.word}”, who isn’t anyone in the family, so ${B.length?`it’s only in ${ft(B)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:u.date,id:f.id}})}for(let f of u.events)!f.problems.length||!E(f.start)||t.push({key:`${u.date}|notes|${f.id}`,tone:"heads_up",title:`${S}Check the notes on ${vn(s,f)}’s ${f.title}`,body:`These lines couldn’t be read: ${f.problems.join("; ")}`,target:$(f.id),suggestions:[]})}return{items:t,problems:a,unassigned:c,later:h,laterUnassigned:d}}function uo(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function Da(s,n,e,t){let o=new Set(xe(s)),i=d=>{let l=d[0];return l==null?null:o.has(l)?pt:e.get(l)??null},r=[...(n.all_day??[]).map(d=>({key:`${n.date}|allday|${d.id}`,title:d.title,note:d.days>1?`Day ${d.day_number} of ${d.days}`:"",color:i(d.people),cancelled:d.cancelled,warn:!1,pick:null})),...(n.unplaced??[]).map(d=>({key:`${n.date}|unplaced|${d.id}`,title:`${F(d.at)} ${d.title}`,note:uo(d),color:null,cancelled:!1,warn:!0,pick:d.id}))];if(!r.length)return null;let a=Math.max(120,t-ut),c=1,h=0;for(let d of r){let l=Math.min(a,30+7*(d.title.length+(d.note?d.note.length+2:0)));h&&h+l>a&&(c++,h=0),h+=l}return{key:`${n.date}|allday`,h:c*ya+(c-1)*to,chips:r}}function po(s,n){let e=ke(s),t=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=Me(n.date,i.date);if(!(r<0))for(let a of xe(s))for(let c of i.drivers[a]?.outings??[]){if(c.start==null)continue;let h=r*1440+c.start;if(r*1440+de(c.end,c.start)<=n.minutes)continue;let l=h-n.minutes,u={driver:a,name:fe(s,a),date:i.date,ahead:r,start:c.start,inMinutes:l,ongoing:l<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(m=>e.get(m)??ce(0)),warn:c.warn,target:c.target&&i.events.some(m=>m.id===c.target)?{day:i.date,event:c.target}:null};(!t||o(u)<o(t)||o(u)===o(t)&&u.inMinutes<t.inMinutes)&&(t=u)}}return t}function gt(s){return s.state==="done"||s.state==="late"}var La=780;function Ra(s,n,e){return s.state==="open"&&!!s.for_day&&s.due===n&&e<La}function fo(s,n){return s.chores.map(e=>Ra(e,s.today,n)?{...e,state:"upcoming",shows_from:s.today}:e)}function go(s){return s.state==="open"||s.state==="overdue"}function cs(s,n,e){if(gt(s)){let t=s.done_at?Ia(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${as(s.due,n)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${as(s.for_day,n)}`;let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let o=Me(n,s.due);return`By ${o===1?"tomorrow":o<7?be(s.due):ls(s.due)}`}if(s.for_day&&s.due===n)return`Tonight · for ${as(s.for_day,n)}`;if(s.due&&s.due>n){let t=Me(n,s.due);return t===1?"By tomorrow":`By ${t<7?be(s.due):ls(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function as(s,n){let e=Me(n,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?be(s):ls(s)}function ls(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Ia(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=t.toLocaleDateString("en-CA",{timeZone:o}),r=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===n?r:`${be(i)} ${r}`}function mo(s,n,e=1440){let t=fo(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=t.filter(d=>d.kid===o.id),a=new Map;for(let d of r){if(d.state!=="upcoming")continue;let l=d.shows_from??d.due??s.today;a.set(l,[...a.get(l)??[],d])}let c=r.filter(d=>d.state==="overdue"),h=r.filter(d=>d.state==="open");return{kid:o.id,name:o.name,color:n?.get(o.id)??ce(i),overdue:c,now:h,done:r.filter(gt),later:[...a.entries()].sort(([d],[l])=>d.localeCompare(l)).map(([d,l])=>({date:d,chores:l})),left:c.length+h.length}})}function bo(s,n=1440){return fo(s,n).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,t)=>e.state===t.state?e.order-t.order:e.state==="overdue"?-1:1)}function ds(s){return!s.chores.length&&!s.templates.length}var et=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function hs(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[o,i]=t.split("-").map(r=>et.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function us(s){let n=[...new Set(s)].sort((t,o)=>t-o);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let o=e.at(-1);o&&o.at(-1)===t-1?o.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${et[t[0]]}-${et[t.at(-1)]}`]:t.map(o=>et[o])).join(", ")}var tt="none";function yn(s){return s==="daily"||s==="school"?"":"Any"}function vo(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function yo(s){let n=s.days??yn(s.repeats),e=s.repeats==="daily"&&n!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:n,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function ps(s){return s.title.trim()?s.who.length?s.days===tt?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function xo(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function fs(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function gs(s,n,e=1,t=!1,o=!1){if(s==="school"){let d=n.trim().replace(/-/g,"–"),l=o?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return t?`${l}, the night before`:l}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=n.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let h=`${a.split(",").map(d=>{let l=d.trim();return l.toLowerCase()==="last"?"the last day":/^\d+$/.test(l)?`the ${fs(Number(l))}`:`the ${l}`}).join(" and ")} ${r}`;return h[0].toUpperCase()+h.slice(1)}function ms(s,n,e=!1){let t=s.map(i=>n.find(r=>r.id===i)?.name??i);if(!t.length)return"Nobody yet";let o=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${o} take turns`:o}function bs(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}function xn(s,n){return`${s}|${n}`}function mt(s,n){let[e,t,o]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1,o+n)).toISOString().slice(0,10)}function wn(s){let[n,e,t]=s.split("-").map(Number);return(new Date(Date.UTC(n,e-1,t)).getUTCDay()+6)%7}function wo(s,n){return s.days_off.find(e=>e.first<=n&&n<=e.last)??null}function ko(s,n){return wn(n)<5&&!wo(s,n)}function Bt(s,n,e=new Map){if(!ko(s,n))return null;let t=xn(s.id,n);if(e.has(t)){let i=e.get(t);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[n];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function bt(s,n){return ko(s,n)?s.menus?.[n]??null:null}var Ba="From the school's menu feed.";function Oa(s){let n=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Ba);return n.length?n.join(`
`):null}function Le(s){return s.slice(0,7)}function kn(s){let[n,e]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function vs(s,n=1){let[e,t]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1+n,1)).toISOString().slice(0,7)}function $o(s){let n=[];for(let e=Le(s.first);e<=Le(s.last);e=vs(e))n.push(e);return n}function To(s,n,e,t=new Map){let o=`${e}-01`,i=mt(o,-wn(o)),r=[];for(;Le(i)<=e;){let a=[];for(let c=0;c<5;c++){let h=mt(i,c),d=Le(h)!==e,l=d?null:wo(n,h),u=d?null:Bt(n,h,t);a.push({date:h,day:Number(h.slice(8)),outside:d,off:l?l.title:null,lunch:u?.lunch??null,picked:u?.picked??!1,menu:d?null:bt(n,h)?.dish??null,sides:d?null:Oa(bt(n,h)?.details??""),past:h<s.today,today:h===s.today})}a.some(c=>!c.outside)&&r.push(a),i=mt(i,7)}return r}function _o(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Eo(s){let n=0,e=0;for(let t of s.flat())t.outside||t.past||!t.lunch||(t.lunch==="bring"?n++:e++);return{bring:n,buy:e}}function Co(s,n,e,t=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=mt(n,i),a=Bt(s,r,t);if(!a)continue;let c=Me(n,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":be(r),date:r,menu:bt(s,r)?.dish??null}}return null}var Na={timeline:"timeline",full:"timeline",compact:"compact"};function nt(s){let n=new URLSearchParams(s),e={},t=Na[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(n.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((n.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((n.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var ja=["auth_callback","code","state"];function ys(s){let n=new URLSearchParams(s);for(let t of ja)n.delete(t);let e=n.toString();return e?`?${e}`:""}function xs(s,n=0){return s==null||!Number.isFinite(s)?n:s}function za(s,n){let e=n.takes!=null&&n.planned!=null?n.planned+n.takes:n.end;if(n.attending===!1)return n.end;for(let t of s.rides)t.serves.includes(n.id)&&t.end!=null&&(e=Math.max(e,t.end));for(let t of Object.values(s.drivers))for(let o of t.segments)o.type==="home"||o.end==null||(o.serves===n.id||o.event===n.id)&&(e=Math.max(e,o.end));return e}function Ua(s,n){let e=[],t=[],o=()=>{let i=t[t.length-1];i&&xs(i.end)>n&&e.push(...t),t=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>n&&e.push(i);continue}let r=t[t.length-1];r&&r.end!==i.start&&o(),t.push(i)}return o(),e}function Ha(s,n){let e=new Set(s.events.filter(i=>za(s,i)<=n).map(i=>i.id)),t=i=>xs(s.rides[i??-1]?.end,-1)<=n,o=i=>i.type==="act"?e.has(i.event??""):t(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:Ua(r.segments,n),outings:r.outings.filter(a=>a.start==null||xs(a.end,a.start)>n),busy:r.busy.filter(a=>a.end>n)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:n}}function Po(s,n){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=n.date).map(e=>e.date===n.date?Ha(e,n.minutes):e)}}var Ao=qe`
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
`;var pr="mydashlight.rides.view",xc=1100,wc=440,kc=700,$c=3*6e4,dr=1200,Tc=450,_c=110;function Ec(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Mn=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,hr=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Cc=new URL("emoji.json",import.meta.url).href,ur=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],zs=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Us=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Pc=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Ac=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,jt={bring:"Bring",buy:"Buy"};function Sc(s,n){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return n<=1?e:`${e}s${s==="monthly"&&n===3?" (quarterly)":s==="monthly"&&n===12?" (yearly)":""}`}function Pe(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function Hs(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Mc(s,n){return rs(s,n)||Ce(s).split(",")[0]}function Dc(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function Lc(){try{return localStorage.getItem(pr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function Rc(s){try{localStorage.setItem(pr,s)}catch{}}function Fs(s,n){return xe(s).includes(n)?fe(s,n):me(s,n)}function zt(s){return s.days.every(n=>!n.events.length)}var Ut=class extends _e{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=nt(location.search).view;this.urlPage=nt(location.search).page;this.urlPast=nt(location.search).past;this.urlDayPicker=nt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let o=e.clientX-t.x,i=e.clientY-t.y;if(!t.moved){if(Math.abs(o)+Math.abs(i)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}this.onTouched(),t.el.scrollTop=t.top-i,t.el.scrollLeft=t.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},$c))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??Lc(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let t=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(h=>h.id===r);(!c||(c.picks[a]??null)===i||!Bt(c,a))&&t.delete(o)}this.lunchDraft=t}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let o of e.chores)t.has(o.id)&&gt(o)===t.get(o.id)&&t.delete(o.id);for(let o of t.keys())e.chores.some(i=>i.id===o)||t.delete(o);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=co(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<xc)return!1;let e=this.plan;return!e||this.width-wc>=ns(Ee(e).length,xe(e).length)}today(){return _t(this.plan?.time_zone??Ec())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let t=this.today(),o=`${t.date}|${t.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Po(e,t)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let t=this.today(),o=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=lo(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,t,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(d=>d.date===this.pinDay)?.h??It,a=is(e,i.scrollTop+r+4),c=t.days[Math.floor(a/1440)]?.date,h=c?o.days.findIndex(d=>d.date===c):-1;h>=0&&(this.keepAt=h*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,t);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,t){let o=this.board,i=o.dayHeads.find(r=>r.date===t)?.y??0;return Math.max(i,io(o,e)-eo(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let t=this.today(),o=Math.max(0,this.dayIndexOf(t.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(t.date)?t.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let t=this.nowSpot();t&&this.scrollToTime(t.t,t.date,e)}goToDay(e,t=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(t);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let c=1/0;if(this.mode==="timeline"){for(let h of a.events)c=Math.min(c,h.arrive_by??h.start);for(let h of Object.values(a.drivers))for(let d of h.outings)d.start!=null&&(c=Math.min(c,d.start))}this.scrollToTime(r*1440+(Number.isFinite(c)?Math.max(0,c-30):0),e,t)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,o=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=t+1&&(o=c);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),a=this.today().date;if(r){let c=t-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),h=c>0?"up":"down";this.board.dayHeads.some(d=>d.date===a)&&o.date!==a?i=`${h}|Today`:this.mode==="timeline"&&Math.abs(c)>e.clientHeight*.6&&(i=`${h}|${o.date===a?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,t&&t!==e.kid?t:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof ie?r:new ie("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??gt(e)}editMenu(e,t){let o=this.lunch?.kids??[],i=bt(e,t),r=o.filter(a=>a.id===e.id||i&&bt(a,t)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:t,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let t=this.menuEdit;if(!(!t||!this.backend||!t.kids.length)){this.menuEdit={...t,busy:!0};try{await this.backend.setLunchMenu(t.kids,t.date,e?"":t.dish.trim(),e?"":t.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...t,busy:!1};let i=o instanceof ie?o:new ie("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,t,o){if(!this.backend||!t.length)return;let i=new Map(this.lunchDraft);for(let r of t)i.set(xn(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,t,o)}catch(r){let a=new Map(this.lunchDraft);for(let h of t)a.delete(xn(e,h));this.lunchDraft=a;let c=r instanceof ie?r:new ie("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?yo(e):vo(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(cr(),lr))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||ps(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(xo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let o=t instanceof ie?t:new ie("error",String(t));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let o=t instanceof ie?t:new ie("error",String(t));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??It;this.keepAt=t&&this.board?is(this.board,t.scrollTop+o+4):null,this.mode=e,this.urlView||Rc(e)}findUnplaced(e,t){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===t)??null}openForPick(e,t){let o=this.findUnplaced(e,t),i=this.plan;if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...Ee(i),...xe(i)]);this.forPick={day:e,id:t,placed:!1,label:`${F(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}changeForPick(e,t,o){let i=e.who?.[o.event_id],r=i?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:t.date,id:o.id,placed:!0,label:`${F(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!i?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let t=this.forPick,o=this.plan;if(!t||!o||!this.backend||!e&&!t.people.length)return;let i=e?[]:t.people;this.forPick={...t,busy:!0};try{await this.backend.setPeople(t.id,i,t.scope),this.forPick=null;let r=t.label.replace(/^\S+ /,""),a=i.map(c=>Fs(o,c));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:`Saved. ${r} is in ${ft(a)}’s ${a.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let a=r instanceof ie?r:new ie("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}}renderForPick(e){let t=this.plan,o=e.placed?t?.days.some(E=>E.date===e.day&&E.events.some(f=>f.id===e.id)):!!this.findUnplaced(e.day,e.id),i=p`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!t||!o&&!e.busy)return p`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">Who is this for?</span></div>
          ${i}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let r=e.busy,a=E=>{this.forPick&&(this.forPick={...this.forPick,...E})},c=E=>a({people:e.people.includes(E)?e.people.filter(f=>f!==E):[...e.people,E]}),h=ke(t),d=Ee(t),l=d.length>1&&d.every(E=>e.people.includes(E)),m=[...d,...xe(t)].filter(E=>e.people.includes(E)),S=m.map(E=>Fs(t,E)),g=S.length<2?S.join(""):`${S.slice(0,-1).join(", ")} & ${S[S.length-1]}`,$=(E,f,B,U)=>p`<button
      type="button"
      class="who-chip"
      style="--c:${B.color};--rgb:${B.rgb}"
      aria-pressed=${e.people.includes(E)?"true":"false"}
      ?disabled=${r}
      @click=${()=>c(E)}
    >
      <span class="avatar ${U?"driver":""}" aria-hidden="true">${Pe(f)}</span>${f}
    </button>`;return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">Who is this for?</span>
          <span class="ed-meta">${Ce(e.day)} · ${e.label}</span>
        </div>
        ${i}
      </div>
      ${e.word?p`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:_}
      ${e.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${r} @click=${()=>a({scope:"this"})}>
                Just ${be(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${r} @click=${()=>a({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:_}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${d.map(E=>$(E,me(t,E),h.get(E)??ce(0),!1))}
        </div>
        ${d.length>1?p`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${l?"true":"false"}
              ?disabled=${r}
              @click=${()=>a({people:l?e.people.filter(E=>!d.includes(E)):[...d,...e.people.filter(E=>!d.includes(E))]})}
            >
              All the kids
            </button>`:_}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${xe(t).map(E=>$(E,fe(t,E),pt,!0))}
        </div>
      </div>
      <p class="field-hint">
        ${m.length?p`Saved in the event’s notes as <strong>For: ${g}</strong>, so its title stays as it is. It shows in ${m.length>1?"their lanes":`${S[0]}’s lane`}${m.some(E=>d.includes(E))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?p`<button type="button" class="chip clear" ?disabled=${r} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:_}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!m.length} @click=${()=>void this.saveForPick()}>
          ${r?"Saving to Google Calendar…":m.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderForLine(e,t,o){let i=e.who?.[o.event_id];if(!i)return _;let r=i.people.map(a=>Fs(e,a));return p`<span class="ed-for"
      >For ${ft(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,t,o)}>Change</button></span
    >`}findEvent(e){let t=this.plan?.days.find(i=>i.date===e.day),o=t?.events.find(i=>i.id===e.event);return t&&o?{day:t,event:o}:null}open(e,t=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),o=this.dayIndexOf(e.day);!t||o<0||this.scrollToTime(o*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,o){if(!this.pending){this.pending={key:e,value:t};try{await o()}catch(i){let r=i instanceof ie?i:new ie("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,t,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${t}`,o,()=>r.setRide(e.id,t,o,this.scope,!1));return}this.save(`${t}`,o,()=>r.setRide(e.id,t,o,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let o=this.backend;this.save("attending",t,()=>o.setAttending(e.id,t,this.scope))}toggleStay(e,t,o){if(!this.backend)return;let i=this.backend;if(t&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",t,()=>i.setStay(e.id,t,this.scope))}toggleAlong(e,t,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(t)?r.filter(c=>c!==t):[...r,t];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,t){if(!this.backend||(e.takes??null)===t)return;let o=this.backend;this.save("takes",t,()=>o.setTakes(e.id,t,this.scope))}nudgeArrive(e,t){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;t<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),dr)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let o=this.findEvent(t);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,t){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,i;o==null?i=t<0?Math.max(e.start+5,e.end-15):null:t<0?i=Math.max(e.start+5,o-5):i=o+5>=e.end?null:o+5,this.leaveDraft=i,this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),dr)}clearLeave(){this.leaveDraft=null,this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let o=this.findEvent(t);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>i.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,_c)},Tc)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),o=this.shownPlan(),i=o?ho(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?bo(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],c=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,h=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",d=p`<aside class="panel" aria-label=${h}>
      ${c??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,l=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<kc?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${l?this.renderBanner(e):_}
          <main>
            ${l?p`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?zt(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                  ${t&&o&&!zt(o)?this.renderDayRail(o):_}
                  ${t&&this.away?this.renderBackToToday(this.away):_}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${d}`:_}
          </main>
        </div>
        ${r?d:_}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:_}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,o){let i=t.problems+o;this.tick;let r=this.today(),a="";if(e){let u=e.time_zone,m=new Date(e.updated);this.error?a=p`<span class="bad">${yi(this.error)} · showing the plan from ${Jt(m,new Date,u)}</span>`:e.status&&!e.status.ok?a=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Jt(m,new Date,u)}</span>`:this.backend?.live||(a=`Updated ${Jt(m,new Date,u)}`)}let c=(u,m,S,g)=>p`
      <button type="button" class="seg-btn" title=${g} aria-pressed=${this.mode===u?"true":"false"} @click=${()=>this.setMode(u)}>
        ${S}<span class="seg-label">${m}</span>
      </button>
    `,h=(u,m,S)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===u?"true":"false"} @click=${()=>this.setPage(u)}>
        ${S}<span class="seg-label">${m}</span>
      </button>
    `,d=Ue(r.minutes),l=!!e&&zt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ae`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:_}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ce(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Ce(r.date)}${typeof a=="string"&&a?p`<span class="status"> · ${a}</span>`:_}
          </p>
          ${a&&typeof a!="string"?p`<p class="status">${a}</p>`:_}
        </div>
        ${e&&!l?this.renderNext(e,po(e,r),t):_}
        <div class="controls">
          ${this.wide||l&&!o?_:p`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?_:p`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${h("rides","Rides",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${h("chores","Chores",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?_:h("lunch","Lunch",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,o){if(!t){let h=this.today().date,d=o.unassigned,l=o.laterUnassigned;if(d){let m=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?p`<div class="next idle needs">${m}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${m}</button>`}if(l)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${l} ${l===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let u=e.days.some(m=>m.date>=h&&m.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${u?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${u?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;t.ongoing?i="On the road now":t.ahead===0?i=t.inMinutes<180?`Next trip · in ${Et(t.inMinutes)}`:"Next trip · later today":t.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${be(t.date)}`;let r=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,a=p`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Pe(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(h=>p`<span class="kid-dot" style="background:${h.color}"></span>`)}</span>
        ${t.warn?p`<span class="next-stop warn">${t.warn}</span>`:t.stop?p`<span class="next-stop">${t.stop}</span>`:_}
      </span>
    `,c=`next ${t.ongoing?"ongoing":r?"soon":""}`;return t.target?p`<button type="button" class=${c} @click=${()=>this.open(t.target)}>${a}</button>`:p`<div class=${c}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return _;let t=this.today().date,o=ke(e),i=this.railShown;return p`<div
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
        ${e.days.map(r=>{let a=os(r),c=r.events.length,h=r.events.slice(0,4).map(l=>l.own?pt.color:o.get(l.kid)?.color??ce(0).color),d=`${Ce(r.date)}: ${c?`${c} ${c===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return p`<button
            type="button"
            class="rail-day ${r.date===t?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${d}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===t?"Today":be(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${h.length?h.map(l=>p`<span class="rd-dot" style="background:${l}"></span>`):p`<span class="rd-free">free</span>`}
            </span>
            ${a?p`<span class="rd-badge" aria-hidden="true">${a}</span>`:_}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[t,o]=e.split("|");return p`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${ae`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${t==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let t=Ee(e),o=xe(e),i=ke(e),r=t.map(a=>me(e,a));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((a,c)=>ae`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Dc(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(a=>{let c=i.get(a);return p`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Pe(me(e,a))}</span>
            <span class="qw-name">${me(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Pe(fe(e,a))}</span>
            <span class="qw-name">${fe(e,a)}</span>
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
      </div>`;let t=e?.unavailable_calendars.length??0;return t?p`<div class="notice-bar" role="status">
      Couldn’t read ${t===1?"one calendar":`${t} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:_}renderEmpty(){return this.error?p`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:p`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderHead(e,t=!1){return p`<div class="dh-line">
        <button
          type="button"
          class="dh-jump"
          tabindex=${t?-1:0}
          aria-label=${`${e.label}: go to this day`}
          @click=${()=>this.tapHead(e.date)}
        >
          <span class="label">${e.label}</span>${e.tag?p`<span class="tag">${e.tag}</span>`:_}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
      </div>
      ${e.allDay.length?p`<div class="day-strip" style="padding-left:${ut}px">
            ${e.allDay.map(o=>{let i=p`<span class="strip-title">${o.title}</span>${o.note?p`<span class="strip-note">${o.note}</span>`:_}`,r=o.pick;return r?p`<button
                    type="button"
                    class="strip-chip warn plain pick"
                    tabindex=${t?-1:0}
                    aria-label=${`${o.title}: ${o.note} Pick who it’s for`}
                    @click=${()=>this.openForPick(e.date,r)}
                  >
                    ${i}
                  </button>`:p`<span
                    class="strip-chip ${o.warn?"warn":""} ${o.cancelled?"skipped":""} ${o.color?"":"plain"}"
                    style=${o.color?`--c:${o.color.color};--rgb:${o.color.rgb};--ink:${o.color.ink}`:""}
                    >${i}</span
                  >`})}
          </div>`:_}`}renderBoard(e){let t=this.sel,o=t?this.findEvent(t):null,i=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(l=>!l.own&&l.event_id===o.event.event_id).map(l=>l.id):[]),r=l=>!!l&&!!t&&l.day===t.day&&i.has(l.event),a=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],c=e.width,h=100,d=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??h-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??h})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??h+1}))].sort((l,u)=>l.z-u.z);return p`
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
        <div class="heads" style="width:${c}px">
          ${e.columns.map(l=>p`<div class="col-head ${l.kind}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${Pe(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0,l.w-58-l.name.length*10.6):_}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        ${a?p`<div class="pinned" aria-hidden="true" style="width:${c}px;height:${a.h}px;margin-bottom:${-a.h}px">
              ${this.renderHead(a,!0)}
            </div>`:_}
        <div class="canvas" style="width:${c}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(l=>p`<div
                class="col-bg ${l.kind}"
                style="left:${l.x}px;width:${l.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${l.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(l=>p`<div class="day-head" style="top:${l.y}px;width:${c}px;height:${l.h}px">${this.renderHead(l)}</div>`)}
          ${e.empties.map(l=>p`<span class="empty" style="top:${l.y}px">${l.text}</span>`)}
          ${e.grid.map(l=>p`<div class="grid ${l.strong?"strong":""}" style="top:${l.y}px;width:${c-60}px"></div>`)}
          ${e.hours.map(l=>p`<span class="hour" style="top:${l.y}px">${l.label}</span>`)}
          ${je(e.bands,l=>l.key,l=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${je(e.busy,l=>l.key,l=>p`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${je(e.windows,l=>l.key,l=>p`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${je(d,l=>l.x.key,l=>{if(l.t==="link"){let g=l.x;return p`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-color:${g.color.color};background:linear-gradient(rgba(${g.color.rgb},0.11), rgba(${g.color.rgb},0.11)), var(--surface)"
                ></div>`}if(l.t==="prep"){let g=l.x;return p`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-color:${g.color.color};background:linear-gradient(rgba(${g.color.rgb},0.11), rgba(${g.color.rgb},0.11)), var(--surface);color:${g.color.ink}"
                >
                  ${g.label}
                </div>`}if(l.t==="ride"){let g=l.x;return p`<button
                  type="button"
                  class="ride ${g.dashed?"dashed":""} ${g.clash?"clash":""}"
                  aria-label=${g.aria}
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;padding-top:${3+(g.tuckTop??0)}px;padding-bottom:${3+(g.tuckBottom??0)}px"
                  @click=${()=>this.open(g.target)}
                >
                  <span class="l1">${g.l1}</span>${g.show2?p`<span class="l2" style="-webkit-line-clamp:${g.lines2}">${g.l2}</span>`:_}
                </button>`}let u=l.x,m=u.color,S=u.skipped?`repeating-linear-gradient(135deg, rgba(${m.rgb},0.10) 0px, rgba(${m.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:u.stayed?`repeating-linear-gradient(135deg, rgba(${m.rgb},0.24) 0px, rgba(${m.rgb},0.24) 6px, rgba(${m.rgb},0.08) 6px, rgba(${m.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${m.rgb},0.15), rgba(${m.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${u.wrap?"wrap":""} ${r(u.target)?"sel":""} ${u.clash?"clash":""} ${u.skipped?"skipped":""} ${u.cut?"cut":""}"
                aria-label=${u.aria}
                style="left:${u.x}px;top:${u.y}px;width:${u.w}px;height:${u.h}px;background:${S};border-color:${u.clash?"var(--bad)":`rgba(${m.rgb},0.45)`};--c:${m.color};--rgb:${m.rgb};--ring:${m.color}"
                @click=${()=>this.open(u.target)}
              >
                <span class="top">
                  <span class="title">${u.title}</span>
                  <span class="time">${u.time}</span>
                  ${u.showDrop&&u.drop?p`<span class="line tone-${u.drop.tone}">${u.drop.text}</span>`:_}
                </span>
                ${u.showPick&&u.pick?p`<span class="line tone-${u.pick.tone}">${u.pick.text}</span>`:_}
              </button>`})}
          ${je(e.stays,l=>l.key,l=>p`<button
                type="button"
                class="stay ${l.cut?"cut":""}"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${je(e.trips,l=>l.key,l=>p`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(u=>p`<span class="kid-dot" style="background:${u}"></span>`)}</span>
                ${l.show2?p`<span class="l2">${l.l2}</span>`:_}
                ${l.stops?l.stops.map(u=>p`<span class="stop ${u.warn?"warn":""}">${u.text}</span>`):_}
                ${l.show3?p`<span class="l3">${l.l3}</span>`:_}
              </button>`)}
          ${je(e.overlaps,l=>l.key,l=>p`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${je(e.marks,l=>l.key,l=>p`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${c-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:_}
        </div>
      </div>
    `}renderAttention(e,t){let{items:o,problems:i,later:r}=e,a=this.plan,c=i+t.length,h=this.chores,d=!!h&&!ds(h);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?_:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?p`<div class="attn-chores">${t.map(l=>this.renderChoreRow(l,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${ae`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${zt(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:_}
      ${o.map(l=>p`<div class="issue ${l.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${l.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${l.pick?p`<button type="button" class="issue-title" @click=${()=>l.pick&&this.openForPick(l.pick.day,l.pick.id)}>${l.title}</button>`:l.target?p`<button type="button" class="issue-title" @click=${()=>this.open(l.target,!0)}>${l.title}</button>`:p`<strong class="issue-title">${l.title}</strong>`}
              <span class="issue-body"
                >${l.parts?l.parts.map(u=>typeof u=="string"?u:p`<button type="button" class="issue-link" @click=${()=>this.open(u.target,!0)}>${u.text}</button>`):l.body}</span
              >
            </div>
          </div>
          ${l.suggestions.length?p`<div class="fixes">
                ${l.suggestions.map(u=>p`<button
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
      ${this.wide&&a&&!zt(a)&&this.page==="rides"?this.renderLegend():_}
    `}kidColorOf(e){let t=this.plan?ke(this.plan).get(e):void 0;if(t)return t;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return ce(Math.max(0,o))}renderLunchChip(e,t=!1,o=1/0){let i=this.lunch,r=i?.kids.find(l=>l.id===e);if(!i||!r)return _;this.tick;let a=this.today(),c=Co(r,a.date,a.minutes,this.lunchDraft);if(!c)return _;let h=jt[c.lunch],d=`${h} lunch ${c.when}${c.menu?`: ${c.menu}`:""}`;return t&&o<36+h.length*7.4?p`<span class="lunch-chip ${c.lunch} small icon" role="img" aria-label=${d} title=${d}
        >${c.lunch==="bring"?zs:Us}</span
      >`:p`<span class="lunch-chip ${c.lunch} ${t?"small":""}" title=${d}
      >${c.lunch==="bring"?zs:Us}<span class="lunch-chip-text"
        >${h}${t?_:` ${c.when}`}${!t&&c.menu?p`<span class="lunch-chip-menu"> · ${c.menu}</span>`:_}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let t=$o(e),o=this.lunchMonth&&t.includes(this.lunchMonth)?this.lunchMonth:Le(e.today),i=t.indexOf(o),r=d=>{let l=t[i+d];l&&(this.lunchMonth=l)},a=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(d=>d.id===a):e.kids,h=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:_;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${ae`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${kn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=t.length-1} @click=${()=>r(1)}>
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
          ${this.menuMode?"Done":p`${hr} Edit menus`}
        </button>
      </div>
      ${h}
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
    </div>`}renderLunchCard(e,t,o,i){let r=this.kidColorOf(t.id),a=To(e,t,o,this.lunchDraft),c=Eo(a),h=a.flat(),d=h.filter(g=>!g.outside&&!g.past&&g.lunch),l=t.days_off.filter(g=>Le(g.first)<=o&&o<=Le(g.last)),u=g=>d.filter($=>wn($.date)===g),m=g=>{let $=u(g);if(!$.length)return;let E=$.every(f=>f.lunch==="bring")?"buy":"bring";this.saveLunch(t.id,$.map(f=>f.date),E)},S=d.length?`${c.bring} Bring · ${c.buy} Buy${o===Le(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${t.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Pe(t.name)}</span>
        <span class="ch-text">
          <span class="name">${t.name}</span>
          <span class="sub">${S}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${jt[t.default]} unless picked</span>
          ${e.kids.length<2?_:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${t.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:t.id}
              >
                ${i?Ac:Pc}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${t.menu_feed&&!t.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${t.menu_feed.error?`: ${t.menu_feed.error}`:""}.</p>`:_}
      <div class="lunch-grid" role="grid" aria-label=${`${t.name}, ${kn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((g,$)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!u($).length}
            aria-label=${`${u($).every(E=>E.lunch==="bring")?"Buy":"Bring"} every ${g} left in ${kn(o)} for ${t.name}`}
            @click=${()=>m($)}
          >
            ${g}
          </button>`)}
        ${h.map(g=>this.renderLunchCell(t,g,i))}
      </div>
      ${l.length?p`<p class="lunch-offs">
            No school:
            ${l.map(g=>{let $=g.first<`${o}-01`?`${o}-01`:g.first,E=Le(g.last)>o?mt(`${vs(o)}-01`,-1):g.last;return`${$===E?Hs($):`${Hs($)}–${Hs(E)}`} ${_o(g.title)}`}).join(" · ")}
          </p>`:_}
    </section>`}renderLunchCell(e,t,o=!1){if(t.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(t.off!==null||!t.lunch)return p`<span class="lunch-day off ${t.today?"today":""}" title=${t.off??""}>
        <span class="lunch-num">${t.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=t.lunch,r=i==="buy"?"bring":"buy",a=t.menu?`, ${t.menu}`:"",c=this.menuMode,h=this.menuEdit?.date===t.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${Ce(t.date)}${a||", no menu yet"}. Tap to ${t.menu?"change":"add"} the menu.`:`${e.name}, ${Ce(t.date)}: ${jt[i]}${t.picked?"":" (not picked yet)"}${a}. Tap to ${jt[r]}.`;return p`<button
      type="button"
      class="lunch-day ${i} ${t.picked?"picked":"unpicked"} ${t.past?"past":""} ${t.today?"today":""} ${c?"editing":""} ${h?"sel":""}"
      ?disabled=${t.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,t.date):void this.saveLunch(e.id,[t.date],r)}
    >
      <span class="lunch-num">${t.day}</span>
      <span class="lunch-word">${i==="bring"?zs:Us}${jt[i]}</span>
      ${t.menu?p`<span class="lunch-menu">${t.menu}</span>${o&&t.sides?p`<span class="lunch-sides">${t.sides}</span>`:_}`:c?p`<span class="lunch-menu add">${Mn} Menu</span>`:_}
    </button>`}renderChoreRow(e,t=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(E=>E.id===e.kid),a=(this.plan?ke(this.plan).get(e.kid):void 0)??ce(Math.max(0,r)),c=o.kids[r]?.name??"",h=i===gt(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},d=i&&h.done_by&&h.done_by!==e.kid?o.people?.find(E=>E.id===h.done_by)?.name??h.done_by_name??null:null,l=`${cs(h,o.today,o.time_zone)}${d?` · by ${d}`:""}`,u=i||go(e),m=`${t?`${c}: `:""}${e.title}. ${l?`${l}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,S=p`<span class="box" aria-hidden="true"
        >${i?ae`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:_}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:_}
      <span class="chore-text">
        <span class="chore-title">${t?p`<span class="chore-kid">${c}</span> · `:_}${e.title}</span>
        ${l?p`<span class="chore-note">${l}</span>`:_}
      </span>`,g=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${u?"":"later"}`,$=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return u?p`<button type="button" class=${g} style=${$} aria-pressed=${i?"true":"false"} aria-label=${m} @click=${()=>this.tapChore(e)}>
          ${S}
        </button>`:p`<div class=${g} style=${$}>${S}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(ds(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Mn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(r=>r.problems.length),o=t.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:_;this.tick;let i=mo(e,this.plan?ke(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Mn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${hr} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return p`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Pe(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:_}
            ${r.now.length?p`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:_}
            ${r.done.length?p`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:_}
            ${r.later.map(c=>p`<h3 class="chore-group">${c.date===e.today?"Later today":Mc(c.date,e.today)}</h3>
                ${c.chores.map(h=>this.renderChoreRow(h))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?p`<p class="chore-none">No chores this week.</p>`:_}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?ke(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(bs).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${ms(e.who,o,e.take_turns)} · ${gs(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:_}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let h=o.findIndex(l=>l.id===c),d=i?.get(c)??ce(Math.max(0,h));return p`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Mn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([o,i])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?p`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:_}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return p``;let o=t.kids,i=this.plan?ke(this.plan):void 0,r=this.choreBusy,a=e.template?t.templates.find(g=>g.id===e.template):void 0,c=ps(e),h=(a?.problems??[]).filter(g=>g!=="who:"),d=(g,$,E,f=!1)=>p`<button type="button" class="choice ${f?"wide":""}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${E}>${$}</button>`,l=(g,$,E,f)=>p`<button type="button" class="chip" aria-pressed=${g?"true":"false"} aria-label=${f??_} ?disabled=${r} @click=${E}>${$}</button>`,u=g=>{g!==e.repeats&&this.changeDraft({repeats:g,days:a&&a.repeats===g?a.days??yn(g):yn(g)})},m=g=>{let $=e.who.includes(g)?e.who.filter(E=>E!==g):o.filter(E=>E.id===g||e.who.includes(E.id)).map(E=>E.id);this.changeDraft({who:$})},S;if(e.repeats==="school"){let g=e.days===tt?new Set:e.days===""?new Set([0,1,2,3,4]):hs(e.days)??new Set,$=E=>{let f=new Set(g);f.has(E)?f.delete(E):f.add(E),this.changeDraft({days:f.size===5?"":f.size?us(f):tt})};S=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${et.slice(0,5).map((E,f)=>l(g.has(f),E.slice(0,2),()=>$(f),E))}
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
        </div>`}else if(e.repeats==="monthly"){let g=e.days.trim(),$=/^\d+$/.test(g)?Number(g):null,E=g&&g.toLowerCase()!=="any"&&g.toLowerCase()!=="last"&&$===null;S=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${E?4:3}, minmax(0, 1fr))">
          ${d(g===""||g.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${d(g.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${E?d(!0,g,()=>{}):_}
        </div>
        ${$!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${fs($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${g.toLowerCase()==="last"?"Due on the month’s last day.":E?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")S=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let g=e.days===""||e.days.toLowerCase()==="any",$=e.days===tt?new Set:g?new Set:hs(e.days)??new Set,E=f=>{let B=new Set($);B.has(f)?B.delete(f):B.add(f),this.changeDraft({days:B.size?us(B)||"Mon-Sun":tt})};S=p`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(g,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!g,"On set days",()=>this.changeDraft({days:g?"Sat":e.days}))}
        </div>
        ${g?p`<p class="field-hint">Shows all week, due on Sunday.</p>`:p`<div role="group" aria-label="Days of the week" class="day-chips">
                ${et.map((f,B)=>l($.has(B),f.slice(0,2),()=>E(B),f))}
              </div>
              <div class="chips">
                ${l(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${l(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:_}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?ms(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===tt?"No days picked":gs(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${h.length?p`<p class="field-hint bad">${h.map(bs).join(". ")}. Saving fixes it.</p>`:_}
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
          ${ur.map(g=>l(e.icon===g,g,()=>this.changeDraft({icon:e.icon===g?null:g}),`Picture ${g}`))}
          ${e.icon&&!ur.includes(e.icon)?l(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):_}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${Cc}
              @emoji-click=${g=>{let $=g.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:_}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((g,$)=>{let E=i?.get(g.id)??ce($),f=e.who.includes(g.id);return p`<button type="button" class="who-chip" style="--c:${E.color};--rgb:${E.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${r} @click=${()=>m(g.id)}>
              <span class="avatar" aria-hidden="true">${Pe(g.name)}</span>${g.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
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
      ${e.repeats==="school"?_:p`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Sc(e.repeats,e.every)}</span>
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
      ${e.template?p`<div class="field">
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
    `}renderMenuEditor(e){let t=this.lunch;if(!t)return p``;let o=e.busy,i=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>i({kids:e.kids.includes(d)?e.kids.filter(l=>l!==d):[...e.kids,d]}),a=t.kids.filter(d=>Bt(d,e.date)),c=e.dish.trim(),h=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return p`
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
          ${a.map(d=>{let l=this.kidColorOf(d.id),u=e.kids.includes(d.id);return p`<button type="button" class="who-chip" style="--c:${l.color};--rgb:${l.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${o} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${Pe(d.name)}</span>${d.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:_}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!h} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":h??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return p``;let o=t.people?.length?t.people:t.kids.map(l=>({...l,role:"kid"})),i=t.kids.findIndex(l=>l.id===e.kid),r=t.kids[i],a=this.plan?ke(this.plan):void 0,c=a?.get(e.kid)??ce(Math.max(0,i)),h=o.filter(l=>l.id!==e.kid),d=l=>{let u=t.kids.findIndex(m=>m.id===l.id);return u>=0?(a?.get(l.id)??ce(u)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:_}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${cs(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Pe(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${h.map(l=>p`<button type="button" class="done-by" style="--c:${d(l)}" @click=${()=>void this.toggleChore(e,l.id)}>
                  <span class="avatar ${l.role==="parent"?"driver":""}" aria-hidden="true">${Pe(l.name)}</span>
                  <span>${l.name}</span>
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
    </div>`}ownHint(e,t){let o=vn(e,t);if(t.takes!=null){let r=t.planned!=null?`It’s fitted in at ${F(t.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${t.takes} min any time from ${F(t.start)} to ${F(t.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=t.along.map(r=>xe(e).includes(r)?fe(e,r):me(e,r));return`${o} drives there and back${i.length?`, with ${ft(i)}`:""}.`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return p``;let{day:o,event:i}=t,r=xe(e),a=so(e,i),c=vn(e,i),h=!!this.pending,d=T=>this.pending?.key===T?this.pending.value:void 0,l=[...e.people?.carpools??[]];for(let T of e.days)for(let v of T.events)for(let k of[v.drop,v.pick])k&&k!=="none"&&!r.includes(k)&&!l.some(A=>A.toLowerCase()===k.toLowerCase())&&l.push(k);let u=T=>{if(!i.sides.includes(T))return _;let v=d(T)??d("both"),k=T==="drop"?i.drop:i.pick,A=v!==void 0?String(v):i.no_ride_unless_named&&k==="none"?"":k,M=A===""&&!(v===void 0&&i.no_ride_unless_named),K=A&&A!=="none"&&!r.includes(A)?A:"",L=G=>{this.otherOpen=null,this.setRide(i,T,A===G?"":G,r)},H=[...r.map(G=>[G,ss(e,G)]),["none","Not needed"]],oe=`${i.id}|${T}`,ge=this.otherOpen===oe;return p`<div class="field ride-box">
        <span class="field-label">${T==="drop"?"Drop-off":"Pick-up"} ${M?p`<span class="nobody">· nobody yet</span>`:_}</span>
        <div role="group" aria-label=${T==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${H.length+1}, minmax(0, 1fr))">
          ${H.map(([G,Te])=>p`<button type="button" class="choice" aria-pressed=${A===G?"true":"false"} ?disabled=${h} @click=${()=>L(G)}>
                ${Te}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${K?"true":"false"}
            aria-expanded=${ge?"true":"false"}
            ?disabled=${h}
            @click=${()=>this.otherOpen=ge?null:oe}
          >
            ${K||"Other"}
          </button>
        </div>
        ${ge?p`${l.length?p`<div role="group" aria-label=${T==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${l.map(G=>p`<button type="button" class="chip" aria-pressed=${A.toLowerCase()===G.toLowerCase()?"true":"false"} ?disabled=${h} @click=${()=>L(G)}>
                    ${G}
                  </button>`)}
            </div>`:_}
        <input
          type="text"
          .value=${K&&!l.some(G=>G.toLowerCase()===K.toLowerCase())?K:""}
          ?disabled=${h}
          aria-label=${T==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${G=>{let Te=G.target.value.trim();Te&&Te!==A&&L(Te)}}
          @keydown=${G=>{G.key==="Enter"&&G.target.blur()}}
        />`:_}
        ${!E&&A!==""&&A!=="none"?m(T,A):_}
      </div>`},m=(T,v)=>{let k=d(`along-${T}`),A=k!==void 0?k:T==="pick"?i.pick_along??[]:i.along,M=new Set(o.events.filter(H=>H.event_id===i.event_id&&!H.own).map(H=>H.kid)),K=[...Ee(e).filter(H=>H!==i.kid&&!M.has(H)),...r.filter(H=>H!==v)];return K.length?p`<div class="field-sub">
        <span class="field-label">${T==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${T==="pick"?"Coming home too. Anyone already there just gets in.":T==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${T==="drop"?"Riding along on the drop-off":T==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${K.map(H=>p`<button type="button" class="chip" aria-pressed=${A.includes(H)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(i,H,T)}>
              ${r.includes(H)?fe(e,H):me(e,H)}
            </button>`)}
        </div>
      </div>`:_},S=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",g=i.drop===i.pick&&r.includes(i.drop),$=d("stay"),E=$!==void 0?!!$:i.stay&&g,f=d("along"),B=f!==void 0?f:i.along,U=i.own?[...Ee(e),...r.filter(T=>T!==i.own)]:[],q=i.own!=null&&i.takes!=null,he=i.own!=null&&!q,x=d("takes"),w=x!==void 0?x:i.takes??null,y=d("arrive"),C=this.arriveDraft!==void 0?this.arriveDraft:y!==void 0?y:i.arrive_by,P=d("leave"),D=this.leaveDraft!==void 0?this.leaveDraft:P!==void 0?P:i.leave_by??null,N=(T,v)=>{let k=T==="arrive",A=K=>()=>k?this.nudgeArrive(i,K):this.nudgeLeave(i,K),M=(K,L,H,oe)=>p`<button
          type="button"
          class="step"
          aria-label=${L}
          ?disabled=${h||oe}
          @pointerdown=${()=>this.startHold(A(K))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(A(K))}
        >
          ${H}
        </button>`;return p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${k?"Arrive by":"Leave by"}</span>
          <span class="field-hint">${k?`${i.start-v} min before it starts`:`${i.end-v} min before it ends`}</span>
        </span>
        <span class="stepper">
          ${M(-5,"Five minutes earlier","−",!k&&v-5<=i.start)}
          <span class="arrive-value">${F(v)}</span>
          ${M(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${k?"Clear arrive-by time":"Clear leave-by time"}
            ?disabled=${h}
            @click=${()=>k?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},V=i.sides.includes("pick")||i.own!=null,Z=()=>p`${C!=null?N("arrive",C):_}
      ${D!=null?N("leave",D):_}
      ${C==null||D==null&&V?p`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${C==null?p`<button type="button" class="chip" ?disabled=${h} @click=${()=>this.nudgeArrive(i,-5)}>Arrive early</button>`:_}
              ${D==null&&V?p`<button type="button" class="chip" ?disabled=${h} @click=${()=>this.nudgeLeave(i,-5)}>Leave early</button>`:_}
            </div>
          </div>`:_}`,ee=i.sides.includes("drop")&&i.sides.includes("pick"),j=ee&&(E||this.stayDraft===i.id),X=()=>{let T=ee?p`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${j?"false":"true"}
              ?disabled=${h}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,S)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${j?"true":"false"}
              ?disabled=${h}
              @click=${()=>{S?this.toggleStay(i,!0,S):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:_;if(!j)return p`${T} ${u("drop")} ${u("pick")}`;let v=E&&g?i.drop:"";return p`${T}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${v?_:p`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(k=>p`<button
                type="button"
                class="choice"
                aria-pressed=${v===k?"true":"false"}
                ?disabled=${h}
                @click=${()=>{if(v===k||!this.backend)return;let A=this.backend;this.stayDraft=null,this.save("stay",!0,()=>A.setRide(i.id,"both",k,this.scope,!0))}}
              >
                ${fe(e,k)}
              </button>`)}
          </div>
          ${v?m("both",v):_}
        </div>`},Q=[],se=T=>T==="none"?"Not needed":ss(e,T),we=T=>r.includes(T)?fe(e,T):me(e,T),pe=(T,v,k)=>{v===""&&!k.length||Q.push(`${T}: ${[v===""?"TBD":se(v),...k.map(we)].join(", ")}`)},ue=T=>i.no_ride_unless_named&&T==="none"?"":T;i.own||pe("Drop-off",ue(i.drop),i.along),i.own||pe("Pick-up",ue(i.pick),i.pick_along??[]),!i.own&&i.stay&&Q.push("Stay: yes"),q&&Q.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&Q.push(`Take along: ${i.along.map(we).join(", ")}`),i.arrive_by!=null&&Q.push(`Arrive by: ${Ue(i.arrive_by)}`),i.leave_by!=null&&Q.push(`Leave by: ${Ue(i.leave_by)}`);let Ae=d("attending"),ye=Ae!==void 0?!!Ae:i.attending!==!1;i.attending===!1&&Q.splice(0,Q.length,"Attending: no");let b=o.date===this.today().date?"":`${be(o.date)} · `,O=bn(i),z=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${b}${q?"any time ":""}${O}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
          ${this.renderForLine(e,o,i)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let T=i.place_name&&i.place_name!==i.title?i.place_name:"",v=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return p`${z}
        ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:_}
        ${T?p`<div class="field"><span class="field-label">Where</span><span class="field-hint">${T}</span></div>`:_}
        <p class="field-hint">
          ${ye?`This blocks ${c}’s time: ${c} can’t drive then, so a ride that needs ${c} shows as a problem.`:`Not going, so it doesn’t block ${c}’s time, and ${c} can drive then.`}
          ${v}
        </p>
        <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(i,!ye)}>
          ${ye?`${c} isn’t going this time`:`${c} is going after all`}
        </button>
        ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:_}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?p`${z}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${z}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:_}
      ${i.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${be(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:_}
      ${ye?p`${i.where==="anywhere"?p`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:_}
            ${i.own?p`<p class="field-hint">${this.ownHint(e,i)}</p>`:X()}
      ${i.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${w!=null?`Takes ${w} min, any time ${F(i.start)}–${F(i.end)}`:"At its set time"}</span>
            </span>
            ${w!=null?p`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${h||w<=5} @click=${()=>this.setTakes(i,Math.max(5,w-5))}>−</button>
                  <span class="arrive-value">${w} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${h||w+5>i.end-i.start} @click=${()=>this.setTakes(i,w+5)}>+</button>
                </span>`:_}
          </div>
          <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setTakes(i,w!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${w!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:_}
      ${he&&U.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${U.map(T=>p`<button type="button" class="chip" aria-pressed=${B.includes(T)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(i,T)}>
                  ${r.includes(T)?fe(e,T):me(e,T)}
                </button>`)}
            </div>
          </div>`:_}
      ${q?_:Z()}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${c} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(i,!ye)}>
        ${ye?`${c} isn’t going this time`:`${c} is going after all`}
      </button>
      ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:_}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${Q.length?Q.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${ye&&!i.own?p`<p class="field-hint">Tap a selected driver again to clear it.</p>`:_}
    `}};Ut.styles=Ao,Ut.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Ut);function Ic(){let s=[document];for(let n of document.querySelectorAll("*"))n.shadowRoot&&s.push(n.shadowRoot);return s}function fr(s=3e3){let n=new CSSStyleSheet;n.replaceSync("*, *::before, *::after { cursor: none !important; }"),n.disabled=!0;let e,t=i=>{if(i)for(let r of Ic())r.adoptedStyleSheets.includes(n)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,n]);n.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){t(!0);return}t(!1),e=setTimeout(()=>t(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>t(!0),s)}function gr(s){try{return new URL(s).searchParams.get("v")}catch{return null}}function mr(s,n,e){if(!n)return()=>{};let t=e.everyMs??6e5,o=e.retryMs??3e4,i=e.idleMs??12e4,r=null,a=null,c=0,h=!1,d=S=>{if(h||a)return;let g=e.idleFor();if(g>=i){e.reload(S);return}a=setTimeout(()=>{a=null,d(S)},i-g)},l=async()=>{try{let S=await s.sendMessagePromise({type:"mydashlight/app_version"});c=0;let g=S["kiosk.js"];!h&&g&&g!==n&&d(g)}catch{if(h||r||++c>20)return;r=setTimeout(()=>{r=null,l()},o)}},u=()=>{c=0,l()};s.addEventListener?.("ready",u);let m=setInterval(()=>void l(),t);return()=>{h=!0,clearInterval(m),r&&clearTimeout(r),a&&clearTimeout(a),s.removeEventListener?.("ready",u)}}function br(s,n=6e4,e=15e3){let t=null,o=setInterval(()=>{if(!s.connected||t)return;let i=!1;t=setTimeout(()=>{t=null,!i&&s.connected&&s.reconnect(!0)},e);let r=()=>{i=!0,t&&clearTimeout(t),t=null};s.ping().then(r,r)},n);return()=>{clearInterval(o),t&&clearTimeout(t),t=null}}var vr=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],yr=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function xr(s,n,e,t){let o=Math.max(0,Math.min(n,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+t+s.slice(i),caret:o+t.length}}function wr(s,n,e){let t=Math.max(0,Math.min(n,s.length)),o=Math.max(t,Math.min(e,s.length));if(t!==o)return{value:s.slice(0,t)+s.slice(o),caret:t};if(t===0)return{value:s,caret:0};let i=Array.from(s.slice(0,t));i.pop();let r=i.join("");return{value:r+s.slice(t),caret:r.length}}function kr(s,n){return n===0||/\s$/.test(s.slice(0,n))}var Bc=new Set(["text","search","email","url","tel","number","password"]);function $r(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Bc.has(s.type)&&!s.readOnly&&!s.disabled}var Oc={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Nc={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Ht=class extends _e{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=t=>t.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let t=e.selectionStart,o=e.selectionEnd;if(t!==null&&o!==null)return[t,o]}catch{}return[e.value.length,e.value.length]}apply(e,t,o){e.value=t;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=kr(this.field.value,e)}press(e){let t=this.field;if(t){switch(e){case"hide":t.blur();return;case"done":this.commit(),t.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),t.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(t),r=wr(t.value,o,i);this.apply(t,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(t),a=xr(t.value,i,r,o);this.apply(t,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let t=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":Oc[e]??(this.shift?e.toUpperCase():e);return p`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":t?"wide":""}
      aria-label=${Nc[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):_}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?vr:yr;return p`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(t=>p`<div class="row">${t.map(o=>this.key(o))}</div>`)}
      </div>`}};Ht.styles=qe`
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
  `,Ht.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Ht);function jc(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function Tr(s){let n=new WeakSet,e=r=>{let a=r.composedPath();i(a);let c=a[0];$r(c)&&s.attach(c)},t=()=>{setTimeout(()=>{let r=jc();!s.target||r===s.target||($r(r)?s.attach(r):s.detach())},0)},o=r=>{n.has(r)||(n.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",t))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var Ks="mydashlight",zc=`/api/${Ks}/pair`,Uc=`/api/${Ks}/pair/poll`,Ws=`/${Ks}`,Vs="pair";function _r(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Er(s,n){return`${s}${Ws}?${Vs}=${encodeURIComponent(n)}`}function Hc(s,n,e=Date.now()){return{hassUrl:s,clientId:n.client_id,access_token:n.access_token,refresh_token:n.refresh_token,expires_in:n.expires_in,expires:e+n.expires_in*1e3}}var at=class extends Error{constructor(n,e=!1){super(n),this.busy=e}};async function Cr(s=fetch){let n=await s(zc,{method:"POST",cache:"no-store"});if(n.status===429)throw new at("Too many screens are asking to pair right now.",!0);if(!n.ok)throw new at(`Home Assistant answered ${n.status}.`);return await n.json()}async function Pr(s,n,e=fetch){let t=await e(Uc,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(t.status===404)return{status:"expired"};if(!t.ok)throw new at(`Home Assistant answered ${t.status}.`);let o=await t.json();return o.status==="paired"&&o.auth?{status:"paired",auth:Hc(n,o.auth)}:{status:"pending"}}var kt=function(s,n){let o=s,i=Ft[n],r=null,a=0,c=null,h=[],d={},l=function(x,w){a=o*4+17,r=(function(y){let C=new Array(y);for(let P=0;P<y;P+=1){C[P]=new Array(y);for(let D=0;D<y;D+=1)C[P][D]=null}return C})(a),u(0,0),u(a-7,0),u(0,a-7),g(),S(),E(x,w),o>=7&&$(x),c==null&&(c=U(o,i,h)),f(c,w)},u=function(x,w){for(let y=-1;y<=7;y+=1)if(!(x+y<=-1||a<=x+y))for(let C=-1;C<=7;C+=1)w+C<=-1||a<=w+C||(0<=y&&y<=6&&(C==0||C==6)||0<=C&&C<=6&&(y==0||y==6)||2<=y&&y<=4&&2<=C&&C<=4?r[x+y][w+C]=!0:r[x+y][w+C]=!1)},m=function(){let x=0,w=0;for(let y=0;y<8;y+=1){l(!0,y);let C=Ke.getLostPoint(d);(y==0||x>C)&&(x=C,w=y)}return w},S=function(){for(let x=8;x<a-8;x+=1)r[x][6]==null&&(r[x][6]=x%2==0);for(let x=8;x<a-8;x+=1)r[6][x]==null&&(r[6][x]=x%2==0)},g=function(){let x=Ke.getPatternPosition(o);for(let w=0;w<x.length;w+=1)for(let y=0;y<x.length;y+=1){let C=x[w],P=x[y];if(r[C][P]==null)for(let D=-2;D<=2;D+=1)for(let N=-2;N<=2;N+=1)D==-2||D==2||N==-2||N==2||D==0&&N==0?r[C+D][P+N]=!0:r[C+D][P+N]=!1}},$=function(x){let w=Ke.getBCHTypeNumber(o);for(let y=0;y<18;y+=1){let C=!x&&(w>>y&1)==1;r[Math.floor(y/3)][y%3+a-8-3]=C}for(let y=0;y<18;y+=1){let C=!x&&(w>>y&1)==1;r[y%3+a-8-3][Math.floor(y/3)]=C}},E=function(x,w){let y=i<<3|w,C=Ke.getBCHTypeInfo(y);for(let P=0;P<15;P+=1){let D=!x&&(C>>P&1)==1;P<6?r[P][8]=D:P<8?r[P+1][8]=D:r[a-15+P][8]=D}for(let P=0;P<15;P+=1){let D=!x&&(C>>P&1)==1;P<8?r[8][a-P-1]=D:P<9?r[8][15-P-1+1]=D:r[8][15-P-1]=D}r[a-8][8]=!x},f=function(x,w){let y=-1,C=a-1,P=7,D=0,N=Ke.getMaskFunction(w);for(let V=a-1;V>0;V-=2)for(V==6&&(V-=1);;){for(let Z=0;Z<2;Z+=1)if(r[C][V-Z]==null){let ee=!1;D<x.length&&(ee=(x[D]>>>P&1)==1),N(C,V-Z)&&(ee=!ee),r[C][V-Z]=ee,P-=1,P==-1&&(D+=1,P=7)}if(C+=y,C<0||a<=C){C-=y,y=-y;break}}},B=function(x,w){let y=0,C=0,P=0,D=new Array(w.length),N=new Array(w.length);for(let j=0;j<w.length;j+=1){let X=w[j].dataCount,Q=w[j].totalCount-X;C=Math.max(C,X),P=Math.max(P,Q),D[j]=new Array(X);for(let ue=0;ue<D[j].length;ue+=1)D[j][ue]=255&x.getBuffer()[ue+y];y+=X;let se=Ke.getErrorCorrectPolynomial(Q),pe=Kt(D[j],se.getLength()-1).mod(se);N[j]=new Array(se.getLength()-1);for(let ue=0;ue<N[j].length;ue+=1){let Ae=ue+pe.getLength()-N[j].length;N[j][ue]=Ae>=0?pe.getAt(Ae):0}}let V=0;for(let j=0;j<w.length;j+=1)V+=w[j].totalCount;let Z=new Array(V),ee=0;for(let j=0;j<C;j+=1)for(let X=0;X<w.length;X+=1)j<D[X].length&&(Z[ee]=D[X][j],ee+=1);for(let j=0;j<P;j+=1)for(let X=0;X<w.length;X+=1)j<N[X].length&&(Z[ee]=N[X][j],ee+=1);return Z},U=function(x,w,y){let C=Ar.getRSBlocks(x,w),P=Sr();for(let N=0;N<y.length;N+=1){let V=y[N];P.put(V.getMode(),4),P.put(V.getLength(),Ke.getLengthInBits(V.getMode(),x)),V.write(P)}let D=0;for(let N=0;N<C.length;N+=1)D+=C[N].dataCount;if(P.getLengthInBits()>D*8)throw"code length overflow. ("+P.getLengthInBits()+">"+D*8+")";for(P.getLengthInBits()+4<=D*8&&P.put(0,4);P.getLengthInBits()%8!=0;)P.putBit(!1);for(;!(P.getLengthInBits()>=D*8||(P.put(236,8),P.getLengthInBits()>=D*8));)P.put(17,8);return B(P,C)};d.addData=function(x,w){w=w||"Byte";let y=null;switch(w){case"Numeric":y=Fc(x);break;case"Alphanumeric":y=Kc(x);break;case"Byte":y=Wc(x);break;case"Kanji":y=Vc(x);break;default:throw"mode:"+w}h.push(y),c=null},d.isDark=function(x,w){if(x<0||a<=x||w<0||a<=w)throw x+","+w;return r[x][w]},d.getModuleCount=function(){return a},d.make=function(){if(o<1){let x=1;for(;x<40;x++){let w=Ar.getRSBlocks(x,i),y=Sr();for(let P=0;P<h.length;P++){let D=h[P];y.put(D.getMode(),4),y.put(D.getLength(),Ke.getLengthInBits(D.getMode(),x)),D.write(y)}let C=0;for(let P=0;P<w.length;P++)C+=w[P].dataCount;if(y.getLengthInBits()<=C*8)break}o=x}l(!1,m())},d.createTableTag=function(x,w){x=x||2,w=typeof w>"u"?x*4:w;let y="";y+='<table style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: "+w+"px;",y+='">',y+="<tbody>";for(let C=0;C<d.getModuleCount();C+=1){y+="<tr>";for(let P=0;P<d.getModuleCount();P+=1)y+='<td style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: 0px;",y+=" width: "+x+"px;",y+=" height: "+x+"px;",y+=" background-color: ",y+=d.isDark(C,P)?"#000000":"#ffffff",y+=";",y+='"/>';y+="</tr>"}return y+="</tbody>",y+="</table>",y},d.createSvgTag=function(x,w,y,C){let P={};typeof arguments[0]=="object"&&(P=arguments[0],x=P.cellSize,w=P.margin,y=P.alt,C=P.title),x=x||2,w=typeof w>"u"?x*4:w,y=typeof y=="string"?{text:y}:y||{},y.text=y.text||null,y.id=y.text?y.id||"qrcode-description":null,C=typeof C=="string"?{text:C}:C||{},C.text=C.text||null,C.id=C.text?C.id||"qrcode-title":null;let D=d.getModuleCount()*x+w*2,N,V,Z,ee,j="",X;for(X="l"+x+",0 0,"+x+" -"+x+",0 0,-"+x+"z ",j+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',j+=P.scalable?"":' width="'+D+'px" height="'+D+'px"',j+=' viewBox="0 0 '+D+" "+D+'" ',j+=' preserveAspectRatio="xMinYMin meet"',j+=C.text||y.text?' role="img" aria-labelledby="'+q([C.id,y.id].join(" ").trim())+'"':"",j+=">",j+=C.text?'<title id="'+q(C.id)+'">'+q(C.text)+"</title>":"",j+=y.text?'<description id="'+q(y.id)+'">'+q(y.text)+"</description>":"",j+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',j+='<path d="',Z=0;Z<d.getModuleCount();Z+=1)for(ee=Z*x+w,N=0;N<d.getModuleCount();N+=1)d.isDark(Z,N)&&(V=N*x+w,j+="M"+V+","+ee+X);return j+='" stroke="transparent" fill="black"/>',j+="</svg>",j},d.createDataURL=function(x,w){x=x||2,w=typeof w>"u"?x*4:w;let y=d.getModuleCount()*x+w*2,C=w,P=y-w;return Jc(y,y,function(D,N){if(C<=D&&D<P&&C<=N&&N<P){let V=Math.floor((D-C)/x),Z=Math.floor((N-C)/x);return d.isDark(Z,V)?0:1}else return 1})},d.createImgTag=function(x,w,y){x=x||2,w=typeof w>"u"?x*4:w;let C=d.getModuleCount()*x+w*2,P="";return P+="<img",P+=' src="',P+=d.createDataURL(x,w),P+='"',P+=' width="',P+=C,P+='"',P+=' height="',P+=C,P+='"',y&&(P+=' alt="',P+=q(y),P+='"'),P+="/>",P};let q=function(x){let w="";for(let y=0;y<x.length;y+=1){let C=x.charAt(y);switch(C){case"<":w+="&lt;";break;case">":w+="&gt;";break;case"&":w+="&amp;";break;case'"':w+="&quot;";break;default:w+=C;break}}return w},he=function(x){x=typeof x>"u"?2:x;let y=d.getModuleCount()*1+x*2,C=x,P=y-x,D,N,V,Z,ee,j={"██":"█","█ ":"▀"," █":"▄","  ":" "},X={"██":"▀","█ ":"▀"," █":" ","  ":" "},Q="";for(D=0;D<y;D+=2){for(V=Math.floor((D-C)/1),Z=Math.floor((D+1-C)/1),N=0;N<y;N+=1)ee="█",C<=N&&N<P&&C<=D&&D<P&&d.isDark(V,Math.floor((N-C)/1))&&(ee=" "),C<=N&&N<P&&C<=D+1&&D+1<P&&d.isDark(Z,Math.floor((N-C)/1))?ee+=" ":ee+="█",Q+=x<1&&D+1>=P?X[ee]:j[ee];Q+=`
`}return y%2&&x>0?Q.substring(0,Q.length-y-1)+Array(y+1).join("▀"):Q.substring(0,Q.length-1)};return d.createASCII=function(x,w){if(x=x||1,x<2)return he(w);x-=1,w=typeof w>"u"?x*2:w;let y=d.getModuleCount()*x+w*2,C=w,P=y-w,D,N,V,Z,ee=Array(x+1).join("██"),j=Array(x+1).join("  "),X="",Q="";for(D=0;D<y;D+=1){for(V=Math.floor((D-C)/x),Q="",N=0;N<y;N+=1)Z=1,C<=N&&N<P&&C<=D&&D<P&&d.isDark(V,Math.floor((N-C)/x))&&(Z=0),Q+=Z?ee:j;for(V=0;V<x;V+=1)X+=Q+`
`}return X.substring(0,X.length-1)},d.renderTo2dContext=function(x,w){w=w||2;let y=d.getModuleCount();for(let C=0;C<y;C++)for(let P=0;P<y;P++)x.fillStyle=d.isDark(C,P)?"black":"white",x.fillRect(P*w,C*w,w,w)},d};kt.stringToBytes=function(s){let n=[];for(let e=0;e<s.length;e+=1){let t=s.charCodeAt(e);n.push(t&255)}return n};kt.createStringToBytes=function(s,n){let e=(function(){let o=Gc(s),i=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let h=i(),d=i(),l=i(),u=String.fromCharCode(c<<8|h),m=d<<8|l;a[u]=m,r+=1}if(r!=n)throw r+" != "+n;return a})(),t=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(t)}}return i}};var ve={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Ft={L:1,M:0,Q:3,H:2},Fe={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Ke=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,e=7973,t=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(n)>=0;)a^=n<<i(a)-i(n);return(r<<10|a)^t},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case Fe.PATTERN000:return function(a,c){return(a+c)%2==0};case Fe.PATTERN001:return function(a,c){return a%2==0};case Fe.PATTERN010:return function(a,c){return c%3==0};case Fe.PATTERN011:return function(a,c){return(a+c)%3==0};case Fe.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Fe.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Fe.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Fe.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=Kt([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Kt([1,We.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case ve.MODE_NUMBER:return 10;case ve.MODE_ALPHA_NUM:return 9;case ve.MODE_8BIT_BYTE:return 8;case ve.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case ve.MODE_NUMBER:return 12;case ve.MODE_ALPHA_NUM:return 11;case ve.MODE_8BIT_BYTE:return 16;case ve.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case ve.MODE_NUMBER:return 14;case ve.MODE_ALPHA_NUM:return 13;case ve.MODE_8BIT_BYTE:return 16;case ve.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let l=0;l<a;l+=1)for(let u=0;u<a;u+=1){let m=0,S=r.isDark(l,u);for(let g=-1;g<=1;g+=1)if(!(l+g<0||a<=l+g))for(let $=-1;$<=1;$+=1)u+$<0||a<=u+$||g==0&&$==0||S==r.isDark(l+g,u+$)&&(m+=1);m>5&&(c+=3+m-5)}for(let l=0;l<a-1;l+=1)for(let u=0;u<a-1;u+=1){let m=0;r.isDark(l,u)&&(m+=1),r.isDark(l+1,u)&&(m+=1),r.isDark(l,u+1)&&(m+=1),r.isDark(l+1,u+1)&&(m+=1),(m==0||m==4)&&(c+=3)}for(let l=0;l<a;l+=1)for(let u=0;u<a-6;u+=1)r.isDark(l,u)&&!r.isDark(l,u+1)&&r.isDark(l,u+2)&&r.isDark(l,u+3)&&r.isDark(l,u+4)&&!r.isDark(l,u+5)&&r.isDark(l,u+6)&&(c+=40);for(let l=0;l<a;l+=1)for(let u=0;u<a-6;u+=1)r.isDark(u,l)&&!r.isDark(u+1,l)&&r.isDark(u+2,l)&&r.isDark(u+3,l)&&r.isDark(u+4,l)&&!r.isDark(u+5,l)&&r.isDark(u+6,l)&&(c+=40);let h=0;for(let l=0;l<a;l+=1)for(let u=0;u<a;u+=1)r.isDark(u,l)&&(h+=1);let d=Math.abs(100*h/a/a-50)/5;return c+=d*10,c},o})(),We=(function(){let s=new Array(256),n=new Array(256);for(let t=0;t<8;t+=1)s[t]=1<<t;for(let t=8;t<256;t+=1)s[t]=s[t-4]^s[t-5]^s[t-6]^s[t-8];for(let t=0;t<255;t+=1)n[s[t]]=t;let e={};return e.glog=function(t){if(t<1)throw"glog("+t+")";return n[t]},e.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return s[t]},e})(),Kt=function(s,n){if(typeof s.length>"u")throw s.length+"/"+n;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+n);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),t={};return t.getAt=function(o){return e[o]},t.getLength=function(){return e.length},t.multiply=function(o){let i=new Array(t.getLength()+o.getLength()-1);for(let r=0;r<t.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=We.gexp(We.glog(t.getAt(r))+We.glog(o.getAt(a)));return Kt(i,0)},t.mod=function(o){if(t.getLength()-o.getLength()<0)return t;let i=We.glog(t.getAt(0))-We.glog(o.getAt(0)),r=new Array(t.getLength());for(let a=0;a<t.getLength();a+=1)r[a]=t.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=We.gexp(We.glog(o.getAt(a))+i);return Kt(r,0).mod(o)},t},Ar=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],n=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},t=function(o,i){switch(i){case Ft.L:return s[(o-1)*4+0];case Ft.M:return s[(o-1)*4+1];case Ft.Q:return s[(o-1)*4+2];case Ft.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=t(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,c=[];for(let h=0;h<a;h+=1){let d=r[h*3+0],l=r[h*3+1],u=r[h*3+2];for(let m=0;m<d;m+=1)c.push(n(l,u))}return c},e})(),Sr=function(){let s=[],n=0,e={};return e.getBuffer=function(){return s},e.getAt=function(t){let o=Math.floor(t/8);return(s[o]>>>7-t%8&1)==1},e.put=function(t,o){for(let i=0;i<o;i+=1)e.putBit((t>>>o-i-1&1)==1)},e.getLengthInBits=function(){return n},e.putBit=function(t){let o=Math.floor(n/8);s.length<=o&&s.push(0),t&&(s[o]|=128>>>n%8),n+=1},e},Fc=function(s){let n=ve.MODE_NUMBER,e=s,t={};t.getMode=function(){return n},t.getLength=function(r){return e.length},t.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+i(r.charAt(c));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return t},Kc=function(s){let n=ve.MODE_ALPHA_NUM,e=s,t={};t.getMode=function(){return n},t.getLength=function(i){return e.length},t.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return t},Wc=function(s){let n=ve.MODE_8BIT_BYTE,e=s,t=kt.stringToBytes(s),o={};return o.getMode=function(){return n},o.getLength=function(i){return t.length},o.write=function(i){for(let r=0;r<t.length;r+=1)i.put(t[r],8)},o},Vc=function(s){let n=ve.MODE_KANJI,e=s,t=kt.stringToBytes;(function(r,a){let c=t(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=t(s),i={};return i.getMode=function(){return n},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,c=0;for(;c+1<a.length;){let h=(255&a[c])<<8|255&a[c+1];if(33088<=h&&h<=40956)h-=33088;else if(57408<=h&&h<=60351)h-=49472;else throw"illegal char at "+(c+1)+"/"+h;h=(h>>>8&255)*192+(h&255),r.put(h,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},i},Mr=function(){let s=[],n={};return n.writeByte=function(e){s.push(e&255)},n.writeShort=function(e){n.writeByte(e),n.writeByte(e>>>8)},n.writeBytes=function(e,t,o){t=t||0,o=o||e.length;for(let i=0;i<o;i+=1)n.writeByte(e[i+t])},n.writeString=function(e){for(let t=0;t<e.length;t+=1)n.writeByte(e.charCodeAt(t))},n.toByteArray=function(){return s},n.toString=function(){let e="";e+="[";for(let t=0;t<s.length;t+=1)t>0&&(e+=","),e+=s[t];return e+="]",e},n},qc=function(){let s=0,n=0,e=0,t="",o={},i=function(a){t+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,n+=8,e+=1;n>=6;)i(s>>>n-6),n-=6},o.flush=function(){if(n>0&&(i(s<<6-n),s=0,n=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)t+="="}},o.toString=function(){return t},o},Gc=function(s){let n=s,e=0,t=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=n.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=n.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;t=t<<6|r(c.charCodeAt(0)),o+=6}let a=t>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},Yc=function(s,n){let e=s,t=n,o=new Array(s*n),i={};i.setPixel=function(h,d,l){o[d*e+h]=l},i.write=function(h){h.writeString("GIF87a"),h.writeShort(e),h.writeShort(t),h.writeByte(128),h.writeByte(0),h.writeByte(0),h.writeByte(0),h.writeByte(0),h.writeByte(0),h.writeByte(255),h.writeByte(255),h.writeByte(255),h.writeString(","),h.writeShort(0),h.writeShort(0),h.writeShort(e),h.writeShort(t),h.writeByte(0);let d=2,l=a(d);h.writeByte(d);let u=0;for(;l.length-u>255;)h.writeByte(255),h.writeBytes(l,u,255),u+=255;h.writeByte(l.length-u),h.writeBytes(l,u,l.length-u),h.writeByte(0),h.writeString(";")};let r=function(h){let d=h,l=0,u=0,m={};return m.write=function(S,g){if(S>>>g)throw"length over";for(;l+g>=8;)d.writeByte(255&(S<<l|u)),g-=8-l,S>>>=8-l,u=0,l=0;u=S<<l|u,l=l+g},m.flush=function(){l>0&&d.writeByte(u)},m},a=function(h){let d=1<<h,l=(1<<h)+1,u=h+1,m=c();for(let f=0;f<d;f+=1)m.add(String.fromCharCode(f));m.add(String.fromCharCode(d)),m.add(String.fromCharCode(l));let S=Mr(),g=r(S);g.write(d,u);let $=0,E=String.fromCharCode(o[$]);for($+=1;$<o.length;){let f=String.fromCharCode(o[$]);$+=1,m.contains(E+f)?E=E+f:(g.write(m.indexOf(E),u),m.size()<4095&&(m.size()==1<<u&&(u+=1),m.add(E+f)),E=f)}return g.write(m.indexOf(E),u),g.write(l,u),g.flush(),S.toByteArray()},c=function(){let h={},d=0,l={};return l.add=function(u){if(l.contains(u))throw"dup key:"+u;h[u]=d,d+=1},l.size=function(){return d},l.indexOf=function(u){return h[u]},l.contains=function(u){return typeof h[u]<"u"},l};return i},Jc=function(s,n,e){let t=Yc(s,n);for(let a=0;a<n;a+=1)for(let c=0;c<s;c+=1)t.setPixel(c,a,e(c,a));let o=Mr();t.write(o);let i=qc(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},Dr=kt,jh=kt.stringToBytes;function Lr(s){let n=Dr(0,"M");n.addData(s),n.make();let e=n.getModuleCount(),t="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)n.isDark(o,i)&&(t+=`M${i} ${o}h1v1h-1z`);return{size:e,d:t}}var Xc=1e4,Wt=class extends _e{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,t){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,t))}async newCode(){try{let e=await Cr();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof at&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),Xc)}}async poll(e){let t=this.secret;if(t)try{let o=await Pr(t,location.origin);if(!this.running||t!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return _;let{size:e,d:t}=Lr(Er(location.origin,this.code));return p`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${ae`<path d=${t} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return p`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?_r(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Ws}?${Vs}</span> and type the code.
          </li>
          <li>You’ll need to be a Home Assistant admin. The screen signs in as you.</li>
        </ol>
      </div>
      <div class="qr">${this.qr()}</div>
      <div class="foot">
        ${this.problem?p`<span class="problem" role="alert">${this.problem}</span>`:p`<span>${this.code?`A new code appears in ${e} minute${e===1?"":"s"}.`:"Getting a code…"}</span>`}
        <button type="button" class="link" @click=${()=>this.dispatchEvent(new CustomEvent("password"))}>
          Sign in with a password instead
        </button>
      </div>
    </div>`}};Wt.styles=qe`
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
  `,Wt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Wt);var qs="hassTokens";function Rr(){try{let s=localStorage.getItem(qs);return s?JSON.parse(s):null}catch{return null}}function Gs(s){try{s?localStorage.setItem(qs,JSON.stringify(s)):localStorage.removeItem(qs)}catch{}}function Zc(s){let n=document.getElementById("problem");n&&(n.hidden=!1,n.querySelector("p").textContent=s)}function Qc(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(n=>{let e=t=>{s.stop(),s.hidden=!0,n(t)};s.addEventListener("paired",t=>e(t.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function ed(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let n=location.search.includes("auth_callback");if(!n&&!Rr()){let e=await Qc();e&&Gs(e)}try{let e=await fi({hassUrl:location.origin,loadTokens:async()=>Rr(),saveTokens:Gs});n&&history.replaceState(null,"",location.pathname+ys(location.search));let t=await gi({auth:e});s.backend=new Xt(t),br(t),mr(t,gr(import.meta.url),{reload:td,idleFor:()=>Date.now()-Nr}),t.addEventListener("reconnect-error",(o,i)=>{i===2&&Br()})}catch(e){if(e===2){Br();return}Zc(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}var Nr=Date.now();for(let s of["pointerdown","keydown","wheel"])document.addEventListener(s,()=>Nr=Date.now(),{capture:!0,passive:!0});var Ir="mydashlight-reloaded-for";function td(s){try{if(sessionStorage.getItem(Ir)===s)return;sessionStorage.setItem(Ir,s)}catch{}location.reload()}function Br(){Gs(null),location.replace(location.pathname+ys(location.search))}var jr=nt(location.search),Or=document.querySelector("mydashlight-keyboard");Or&&jr.keyboard!==!1&&Tr(Or);jr.cursor!=="show"&&fr();ed();
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
