var Gr=Object.defineProperty;var Hn=(i,t)=>()=>(i&&(t=i(i=0)),t);var qr=(i,t)=>{for(var e in t)Gr(i,e,{get:t[e],enumerable:!0})};function Mn(i){if(typeof i!="string"||!i)throw new Error("expected a non-empty string, got: "+i)}function Pi(i){if(typeof i!="number")throw new Error("expected a number, got: "+i)}function gl(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function Oo(i){return gl(i,t=>t.unicode)}function ml(i){function t(e,n,o){let s=n?i.createObjectStore(e,{keyPath:n}):i.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))s.createIndex(r,a,{multiEntry:c});return s}t(xt),t(it,cl,{[jo]:[ll,!0],[Ho]:[[dl,hl]],[Uo]:[ul,!0]}),t(Li,void 0,{[zo]:[""]})}function Fo(i,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>i(e.result)}async function bl(i){let t=await new Promise((e,n)=>{let o=indexedDB.open(i,rl);Mi[i]=o,o.onupgradeneeded=s=>{s.oldVersion<al&&ml(o.result)},Fo(e,n,o)});return t.onclose=()=>Ri(i),t}function vl(i){return Ln[i]||(Ln[i]=bl(i)),Ln[i]}function je(i,t,e,n){return new Promise((o,s)=>{let r=i.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(h=>r.objectStore(h)),c;n(a,r,h=>{c=h}),r.oncomplete=()=>o(c),r.onerror=()=>s(r.error)})}function Ri(i){let t=Mi[i],e=t&&t.result;if(e){e.close();let n=Rn[i];if(n)for(let o of n)o()}delete Mi[i],delete Ln[i],delete Rn[i]}function yl(i){return new Promise((t,e)=>{Ri(i);let n=indexedDB.deleteDatabase(i);Fo(t,e,n)})}function xl(i,t){let e=Rn[i];e||(e=Rn[i]=[]),e.push(t)}function yt(i){return i.split(/[\s_]+/).map(t=>!t.match(/\w/)||wl.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Ko(i){return i.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=kl)}function $l(i){return i.map(({annotation:e,emoticon:n,group:o,order:s,shortcodes:r,skins:a,tags:c,emoji:h,version:d})=>{let l=[...new Set(Ko([...(r||[]).map(yt).flat(),...(c||[]).map(yt).flat(),...yt(e),n]))].sort(),u={annotation:e,group:o,order:s,tags:c,tokens:l,unicode:h,version:d};if(n&&(u.emoticon=n),r&&(u.shortcodes=r),a){u.skinTones=[],u.skinUnicodes=[],u.skinVersions=[];for(let{tone:y,emoji:A,version:g}of a)u.skinTones.push(y),u.skinUnicodes.push(A),u.skinVersions.push(g)}return u})}function Wo(i,t,e,n){i[t](e).onsuccess=o=>n&&n(o.target.result)}function nt(i,t,e){Wo(i,"get",t,e)}function Vo(i,t,e){Wo(i,"getAll",t,e)}function Ii(i){i.commit&&i.commit()}function Tl(i,t){let e=i[0];for(let n=1;n<i.length;n++){let o=i[n];t(e)>t(o)&&(e=o)}return e}function Go(i,t){let e=Tl(i,o=>o.length),n=[];for(let o of e)i.some(s=>s.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function El(i){return!await Bi(i,xt,Dn)}async function _l(i,t,e){let[n,o]=await Promise.all([Ai,Dn].map(s=>Bi(i,xt,s)));return n===e&&o===t}async function Cl(i,t){return je(i,it,kt,(n,o,s)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let h=c.target.result;for(let d of h)if(r=d.unicode,t(d))return s(d);if(h.length<50)return s();a()}};a()})}async function qo(i,t,e,n){try{let o=$l(t);await je(i,[it,xt],Di,([s,r],a)=>{let c,h,d=0;function l(){++d===2&&u()}function u(){if(!(c===n&&h===e)){s.clear();for(let y of o)s.put(y);r.put(n,Ai),r.put(e,Dn),Ii(a)}}nt(r,Ai,y=>{c=y,l()}),nt(r,Dn,y=>{h=y,l()})})}finally{}}async function Pl(i,t){return je(i,it,kt,(e,n,o)=>{let s=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Vo(e.index(Ho),s,o)})}async function Yo(i,t){let e=Ko(yt(t));return e.length?je(i,it,kt,(n,o,s)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let h=Go(r,d=>d.unicode);s(h.sort((d,l)=>d.order<l.order?-1:1))};for(let h=0;h<e.length;h++){let d=e[h],l=h===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);Vo(n.index(jo),l,u=>{r.push(u),a()})}}):[]}async function Al(i,t){let e=await Yo(i,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(s=>s.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Cl(i,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Ml(i,t){return je(i,it,kt,(e,n,o)=>nt(e,t,s=>{if(s)return o(s);nt(e.index(Uo),t,r=>o(r||null))}))}function Bi(i,t,e){return je(i,t,kt,(n,o,s)=>nt(n,e,s))}function Sl(i,t,e,n){return je(i,t,Di,(o,s)=>{o.put(n,e),Ii(s)})}function Ll(i,t){return je(i,Li,Di,(e,n)=>nt(e,t,o=>{e.put((o||0)+1,t),Ii(n)}))}function Dl(i,t,e){return e===0?[]:je(i,[Li,it],kt,([n,o],s,r)=>{let a=[];n.index(zo).openCursor(void 0,"prev").onsuccess=c=>{let h=c.target.result;if(!h)return r(a);function d(y){if(a.push(y),a.length===e)return r(a);h.continue()}let l=h.primaryKey,u=t.byName(l);if(u)return d(u);nt(o,l,y=>{if(y)return d(y);h.continue()})}})}function Rl(i,t){let e=new Map;for(let o of i){let s=t(o);for(let r of s){let a=e;for(let h=0;h<r.length;h++){let d=r.charAt(h),l=a.get(d);l||(l=new Map,a.set(d,l)),a=l}let c=a.get(Sn);c||(c=[],a.set(Sn,c)),c.push(o)}}return(o,s)=>{let r=e;for(let h=0;h<o.length;h++){let d=o.charAt(h),l=r.get(d);if(l)r=l;else return[]}if(s)return r.get(Sn)||[];let a=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((l,u)=>l[0]<u[0]?-1:1);for(let[l,u]of d)l===Sn?a.push(...u):c.push(u)}return a}}function Bl(i){let t=i&&Array.isArray(i),e=t&&i.length&&(!i[0]||Il.some(n=>!(n in i[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function No(i){Bl(i);let t=(u,y)=>u.name.toLowerCase()<y.name.toLowerCase()?-1:1,e=i.sort(t),o=Rl(i,u=>{let y=new Set;if(u.shortcodes)for(let A of u.shortcodes)for(let g of yt(A))y.add(g);return y}),s=u=>o(u,!0),r=u=>o(u,!1),a=u=>{let y=yt(u),A=y.map((g,$)=>($<y.length-1?s:r)(g));return Go(A,g=>g.name).sort(t)},c=new Map,h=new Map;for(let u of i){h.set(u.name.toLowerCase(),u);for(let y of u.shortcodes||[])c.set(y.toLowerCase(),u)}return{all:e,search:a,byShortcode:u=>c.get(u.toLowerCase()),byName:u=>h.get(u.toLowerCase())}}function Ut(i){if(!i)return i;if(Ol&&(i=structuredClone(i)),delete i.tokens,i.skinTones){let t=i.skinTones.length;i.skins=Array(t);for(let e=0;e<t;e++)i.skins[e]={tone:i.skinTones[e],unicode:i.skinUnicodes[e],version:i.skinVersions[e]};delete i.skinTones,delete i.skinUnicodes,delete i.skinVersions}return i}function Xo(i){i||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function jl(i){if(!i||!Array.isArray(i)||!i[0]||typeof i[0]!="object"||Nl.some(t=>!(t in i[0])))throw new Error("Emoji data is in the wrong format")}function Jo(i,t){if(Math.floor(i.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+i.status)}async function zl(i){let t=await fetch(i,{method:"HEAD"});Jo(t,i);let e=t.headers.get("etag");return Xo(e),e}async function Si(i){let t=await fetch(i);Jo(t,i);let e=t.headers.get("etag");Xo(e);let n=await t.json();return jl(n),[e,n]}function Hl(i){for(var t="",e=new Uint8Array(i),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Ul(i){for(var t=i.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=i.charCodeAt(o);return e}async function Zo(i){let t=JSON.stringify(i),e=Ul(t),n=await crypto.subtle.digest("SHA-1",e),o=Hl(n);return btoa(o)}async function Fl(i,t){let e,n=await zl(t);if(!n){let o=await Si(t);n=o[0],e=o[1],n||(n=await Zo(e))}await _l(i,t,n)||(e||(e=(await Si(t))[1]),await qo(i,e,t,n))}async function Kl(i,t){let[e,n]=await Si(t);e||(e=await Zo(n)),await qo(i,n,t,e)}async function Wl(i,t){try{await Fl(i,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var rl,al,it,xt,Li,ll,jo,cl,zo,dl,hl,Ho,Ai,Dn,Bo,kt,Di,Uo,ul,pl,fl,Mi,Ln,Rn,wl,kl,Sn,Il,Ol,Nl,wt,Oi=Hn(()=>{rl=1,al=1,it="emoji",xt="keyvalue",Li="favorites",ll="tokens",jo="tokens",cl="unicode",zo="count",dl="group",hl="order",Ho="group-order",Ai="eTag",Dn="url",Bo="skinTone",kt="readonly",Di="readwrite",Uo="skinUnicodes",ul="skinUnicodes",pl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",fl="en";Mi={},Ln={},Rn={};wl=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);kl=2;Sn="";Il=["name","url"];Ol=typeof wrappedJSObject<"u";Nl=["annotation","emoji","group","order","version"];wt=class{constructor({dataSource:t=pl,locale:e=fl,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=No(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await vl(this._dbName);xl(this._dbName,this._clear);let e=this.dataSource;await El(t)?await Kl(t,e):this._lazyUpdate=Wl(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Pi(t),await this.ready(),Oo(await Pl(this._db,t)).map(Ut)}async getEmojiBySearchQuery(t){Mn(t),await this.ready();let e=this._custom.search(t),n=Oo(await Yo(this._db,t)).map(Ut);return[...e,...n]}async getEmojiByShortcode(t){Mn(t),await this.ready();let e=this._custom.byShortcode(t);return e||Ut(await Al(this._db,t))}async getEmojiByUnicodeOrName(t){Mn(t),await this.ready();let e=this._custom.byName(t);return e||Ut(await Ml(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Bi(this._db,xt,Bo)||0}async setPreferredSkinTone(t){return Pi(t),await this.ready(),Sl(this._db,xt,Bo,t)}async incrementFavoriteEmojiCount(t){return Mn(t),await this.ready(),Ll(this._db,t)}async getTopFavoriteEmoji(t){return Pi(t),await this.ready(),(await Dl(this._db,this._custom,t)).map(Ut)}set customEmoji(t){this._custom=No(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Ri(this._dbName)}async delete(){await this._shutdown(),await yl(this._dbName)}}});function er(i){return i.unicode.includes("‍")}function ec(i){let t=tr(i,"#000"),e=tr(i,"#fff");return t&&e&&Ql(t,e)}function tc(){let i=Object.entries(Gl);try{for(let[t,e]of i)if(ec(t))return e}catch{}finally{}return i[0][1]}function ac(i,t){if(t===0)return i;let e=i.indexOf(sc);return e!==-1?i.substring(0,e)+String.fromCodePoint(oc+t-1)+i.substring(e):(i.endsWith(nc)&&(i=i.substring(0,i.length-1)),i+ic+String.fromCodePoint(rc+t-1))}function De(i){i.preventDefault(),i.stopPropagation()}function Hi(i,t,e){return t+=i?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function dr(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function lc(i,t){let e=n=>{let o={};for(let s of n)typeof s.tone=="number"&&s.version<=t&&(o[s.tone]=s.unicode);return o};return i.map(({unicode:n,skins:o,shortcodes:s,url:r,name:a,category:c,annotation:h})=>({unicode:n,name:a,shortcodes:s,url:r,category:c,annotation:h,id:n||a,skins:o&&e(o)}))}function dc(i,t,e){let n;cc?(n=new ResizeObserver(e),n.observe(i)):Bn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function nr(i){{let t=document.createRange();return t.selectNode(i.firstChild),t.getBoundingClientRect().width}}function ir(i,t,e){let n=nr(t);if(!n){if(!st){st=e.cloneNode(!0);let o=getComputedStyle(e);for(let s of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])st.style.setProperty(s,o.getPropertyValue(s),"important")}try{return document.body.appendChild(st),st.firstChild.nodeValue=i,nr(st)}finally{st.remove()}}return n}function uc(i,t,e){let n=!0;for(let o of i){let s=e(o);if(!s)continue;typeof Ui>"u"&&(Ui=ir(hc,t,t));let a=ir(o.unicode,s,t)/1.8<Ui;Vi.set(o.unicode,a),a||(n=!1)}return n}function pc(i){return dr(i,t=>t)}function fc(i){i&&(i.scrollTop=0)}function Ft(i,t,e){let n=i.get(t);return n||(n=e(),i.set(t,n)),n}function sr(i){return""+i}function gc(i){let t=document.createElement("template");return t.innerHTML=i,t}function xc(i,t){yc?i.replaceChildren(...t):(i.innerHTML="",i.append(...t))}function wc(i,t){let e=i.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function kc(i,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=wc(n,i):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&xc(n,i)}function $c(i,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:s,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,h=i[s];if(o!==h)if(e.currentExpression=h,r)if(h===null)n.removeAttribute(r);else{let d=a+sr(h)+c;n.setAttribute(r,d)}else{let d;Array.isArray(h)?kc(h,e):h instanceof Element?(d=h,n.replaceWith(d)):n.nodeValue=sr(h),d&&(e.targetNode=d)}}}function Tc(i){let t="",e=!1,n=!1,o=-1,s=new Map,r=[],a=0;for(let h=0,d=i.length;h<d;h++){let l=i[h];if(t+=l.slice(a),h===d-1)break;for(let f=0;f<l.length;f++)switch(l.charAt(f)){case"<":{l.charAt(f+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let u=r[r.length-1],y=Ft(s,u,()=>[]),A,g,$;if(n){let f=/(\S+)="?([^"=]*)$/.exec(l);A=f[1],g=f[2];let O=/^([^">]*)("?)/.exec(i[h+1]);$=O[1],t=t.slice(0,-1*f[0].length),a=O[0].length}else a=0;let _={attributeName:A,attributeValuePre:g,attributeValuePost:$,expressionIndex:h};y.push(_),!e&&!n&&(t+=" ")}return{template:gc(t),elementsToBindings:s}}function or(i,t,e){for(let n=0;n<i.length;n++){let o=i[n],s=o.attributeName?t:t.firstChild,r={binding:o,targetNode:s,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Ec(i,t){let e=[],n;if(t.size===1&&(n=t.get(0)))or(n,i,e);else{let o=document.createTreeWalker(i,NodeFilter.SHOW_ELEMENT),s=i,r=-1;do{let a=t.get(++r);a&&or(a,s,e)}while(s=o.nextNode())}return e}function _c(i){let{template:t,elementsToBindings:e}=Ft(mc,i,()=>Tc(i)),n=t.cloneNode(!0).content.firstElementChild,o=Ec(n,e);return function(r){return $c(r,o),n}}function Cc(i){let t=Ft(bc,i,()=>new Map),e=vc;function n(s,...r){let a=Ft(t,s,()=>new Map);return Ft(a,e,()=>_c(s))(r)}function o(s,r,a){return s.map((c,h)=>{let d=e;e=a(c);try{return r(c,h)}finally{e=d}})}return{map:o,html:n}}function Pc(i,t,e,n,o,s,r,a,c){let{labelWithSkin:h,titleForEmoji:d,unicodeWithSkin:l}=e,{html:u,map:y}=Cc(t);function A(f,O,H){return y(f,(W,he)=>u`<button role="${O?"option":"menuitem"}" aria-selected="${O?he===t.activeSearchItem:null}" aria-label="${h(W,t.currentSkinTone)}" title="${d(W)}" class="${"emoji"+(O&&he===t.activeSearchItem?" active":"")+(W.unicode?"":" custom-emoji")}" id="${`${H}-${W.id}`}" style="${W.unicode?null:`--custom-emoji-background: url(${JSON.stringify(W.url)})`}">${W.unicode?l(W,t.currentSkinTone):""}</button>`,W=>`${H}-${W.id}`)}let $=u`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${y(t.skinTones,(f,O)=>u`<div id="skintone-${O}" class="emoji ${O===t.activeSkinTone?"active":""}" aria-selected="${O===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[O]}" aria-label="${t.i18n.skinTones[O]}">${f}</div>`,f=>f)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${y(t.groups,f=>u`<button role="tab" class="nav-button" aria-controls="tab-${f.id}" aria-label="${t.i18n.categories[f.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===f.id}" title="${t.i18n.categories[f.name]}" data-group-id="${f.id}"><div class="nav-emoji emoji">${f.emoji}</div></button>`,f=>f.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${y(t.currentEmojisWithCategories,(f,O)=>u`<div><div id="menu-label-${O}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:f.category?f.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${O!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(f.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${O}" id="${t.searchMode?"search-results":null}">${A(f.emojis,t.searchMode,"emo")}</div></div>`,f=>f.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${A(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,_=(f,O)=>{for(let H of i.querySelectorAll(`[${f}]`))O(H,H.getAttribute(f))};if(c){i.appendChild($);for(let f of["click","focusout","input","keydown","keyup"])_(`data-on-${f}`,(O,H)=>{O.addEventListener(f,n[H])});_("data-ref",(f,O)=>{s[O]=f}),r.addEventListener("abort",()=>{i.removeChild($)})}_("data-action",(f,O)=>{let H=a.get(O);H||a.set(O,H=new WeakSet),H.has(f)||(H.add(f),o[O](f))})}function Ac(i){let t=!1,e,n=new Map,o=new Set,s,r=()=>{if(t)return;let h=[...o];o.clear();try{for(let d of h)d()}finally{s=!1,o.size&&(s=!0,On(r))}},a=new Proxy({},{get(h,d){if(e){let l=n.get(d);l||(l=new Set,n.set(d,l)),l.add(e)}return h[d]},set(h,d,l){if(h[d]!==l){h[d]=l;let u=n.get(d);if(u){for(let y of u)o.add(y);s||(s=!0,On(r))}}return!0}}),c=h=>{let d=()=>{let l=e;e=d;try{return h()}finally{e=l}};return d()};return i.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function Fi(i,t,e){if(i.length!==t.length)return!1;for(let n=0;n<i.length;n++)if(!e(i[n],t[n]))return!1;return!0}function Mc(i,t,e){{let n=i.closest(".tabpanel"),o=rr.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),rr.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(i)}}function Sc(i,t){let e={},n=new AbortController,o=n.signal,{state:s,createEffect:r}=Ac(o),a=new Map;In(s,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),In(s,t),In(s,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Xl,isRtl:!1,currentGroupIndex:0,groups:Ni,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{s.currentGroup!==s.groups[s.currentGroupIndex]&&(s.currentGroup=s.groups[s.currentGroupIndex])});let c=m=>{i.getElementById(m).focus()},h=m=>i.getElementById(`emo-${m.id}`),d=(m,v)=>{e.rootElement.dispatchEvent(new CustomEvent(m,{detail:v,bubbles:!0,composed:!0}))},l=(m,v)=>m.id===v.id,u=(m,v)=>{let{category:M,emojis:D}=m,{category:L,emojis:N}=v;return M!==L?!1:Fi(D,N,l)},y=m=>{Fi(s.currentEmojis,m,l)||(s.currentEmojis=m)},A=m=>{s.searchMode!==m&&(s.searchMode=m)},g=m=>{Fi(s.currentEmojisWithCategories,m,u)||(s.currentEmojisWithCategories=m)},$=(m,v)=>v&&m.skins&&m.skins[v]||m.unicode,O={labelWithSkin:(m,v)=>pc([m.name||$(m,v),m.annotation,...m.shortcodes||Ki].filter(Boolean)).join(", "),titleForEmoji:m=>m.annotation||(m.shortcodes||Ki).join(", "),unicodeWithSkin:$},H={onClickSkinToneButton:$e,onEmojiClick:ne,onNavClick:Z,onNavKeydown:Q,onSearchKeydown:z,onSkinToneOptionsClick:ue,onSkinToneOptionsFocusOut:b,onSkinToneOptionsKeydown:at,onSkinToneOptionsKeyup:Re,onSearchInput:E},W={calculateEmojiGridStyle:k,updateOnIntersection:x},he=!0;r(()=>{Pc(i,s,O,H,W,e,o,a,he),he=!1}),s.emojiVersion||zi().then(m=>{m||(s.message=s.i18n.emojiUnsupportedMessage)}),r(()=>{async function m(){let v=!1,M=setTimeout(()=>{v=!0,s.message=s.i18n.loadingMessage},ql);try{await s.database.ready(),s.databaseLoaded=!0}catch(D){console.error(D),s.message=s.i18n.networkErrorMessage}finally{clearTimeout(M),v&&(v=!1,s.message="")}}s.database&&m()}),r(()=>{s.pickerStyle=`
      --num-groups: ${s.groups.length}; 
      --indicator-opacity: ${s.searchMode?0:1}; 
      --num-skintones: ${Qo};`}),r(()=>{s.customEmoji&&s.database&&w()}),r(()=>{s.customEmoji&&s.customEmoji.length?s.groups!==Wi&&(s.groups=Wi):s.groups!==Ni&&(s.currentGroupIndex&&s.currentGroupIndex--,s.groups=Ni)}),r(()=>{async function m(){s.databaseLoaded&&(s.currentSkinTone=await s.database.getPreferredSkinTone())}m()}),r(()=>{s.skinTones=Array(Qo).fill().map((m,v)=>ac(s.skinToneEmoji,v))}),r(()=>{s.skinToneButtonText=s.skinTones[s.currentSkinTone]}),r(()=>{s.skinToneButtonLabel=s.i18n.skinToneLabel.replace("{skinTone}",s.i18n.skinTones[s.currentSkinTone])}),r(()=>{async function m(){let{database:v}=s,M=(await Promise.all(Jl.map(D=>v.getEmojiByUnicodeOrName(D)))).filter(Boolean);s.defaultFavoriteEmojis=M}s.databaseLoaded&&m()});function w(){let{customEmoji:m,database:v}=s,M=m||Ki;v.customEmoji!==M&&(v.customEmoji=M)}r(()=>{async function m(){w();let{database:v,defaultFavoriteEmojis:M,numColumns:D}=s,L=await v.getTopFavoriteEmoji(D),N=await V(dr([...L,...M],U=>U.unicode||U.name).slice(0,D));s.currentFavorites=N}s.databaseLoaded&&s.defaultFavoriteEmojis&&m()});function k(m){dc(m,o,()=>{{let v=getComputedStyle(e.rootElement),M=parseInt(v.getPropertyValue("--num-columns"),10),D=v.getPropertyValue("direction")==="rtl";s.numColumns=M,s.isRtl=D}})}function x(m){Mc(m,o,v=>{for(let{target:M,isIntersecting:D}of v)M.classList.toggle("onscreen",D)})}r(()=>{async function m(){let{searchText:v,currentGroup:M,databaseLoaded:D,customEmoji:L}=s;if(!D)s.currentEmojis=[],s.searchMode=!1;else if(v.length>=Vl){let N=await J(v);s.searchText===v&&(y(N),A(!0))}else{let{id:N}=M;if(N!==-1||L&&L.length){let U=await X(N);s.currentGroup.id===N&&(y(U),A(!1))}}}m()});let C=()=>{Bn(()=>fc(e.tabpanelElement))};r(()=>{let{currentEmojis:m,emojiVersion:v}=s,M=m.filter(D=>D.unicode).filter(D=>er(D)&&!Vi.has(D.unicode));if(!v&&M.length)y(m),Bn(()=>P(M));else{let D=v?m:m.filter(S);y(D),C()}});function P(m){uc(m,e.baselineEmoji,h)?C():s.currentEmojis=[...s.currentEmojis]}function S(m){return!m.unicode||!er(m)||Vi.get(m.unicode)}async function j(m){let v=s.emojiVersion||await zi();return m.filter(({version:M})=>!M||M<=v)}async function V(m){return lc(m,s.emojiVersion||await zi())}async function X(m){let v=m===-1?s.customEmoji:await s.database.getEmojiByGroup(m);return V(await j(v))}async function J(m){return V(await j(await s.database.getEmojiBySearchQuery(m)))}r(()=>{}),r(()=>{function m(){let{searchMode:M,currentEmojis:D}=s;if(M)return[{category:"",emojis:D}];let L=new Map;for(let N of D){let U=N.category||"",B=L.get(U);B||(B=[],L.set(U,B)),B.push(N)}return[...L.entries()].map(([N,U])=>({category:N,emojis:U})).sort((N,U)=>s.customCategorySorting(N.category,U.category))}let v=m();g(v)}),r(()=>{s.activeSearchItemId=s.activeSearchItem!==-1&&s.currentEmojis[s.activeSearchItem].id}),r(()=>{let{rawSearchText:m}=s;lr(()=>{s.searchText=(m||"").trim(),s.activeSearchItem=-1})});function z(m){if(!s.searchMode||!s.currentEmojis.length)return;let v=M=>{De(m),s.activeSearchItem=Hi(M,s.activeSearchItem,s.currentEmojis)};switch(m.key){case"ArrowDown":return v(!1);case"ArrowUp":return v(!0);case"Enter":if(s.activeSearchItem===-1)s.activeSearchItem=0;else return De(m),_e(s.currentEmojis[s.activeSearchItem].id)}}function Z(m){let{target:v}=m,M=v.closest(".nav-button");if(!M)return;let D=parseInt(M.dataset.groupId,10);e.searchElement.value="",s.rawSearchText="",s.searchText="",s.activeSearchItem=-1,s.currentGroupIndex=s.groups.findIndex(L=>L.id===D)}function Q(m){let{target:v,key:M}=m,D=L=>{L&&(De(m),L.focus())};switch(M){case"ArrowLeft":return D(v.previousElementSibling);case"ArrowRight":return D(v.nextElementSibling);case"Home":return D(v.parentElement.firstElementChild);case"End":return D(v.parentElement.lastElementChild)}}async function ke(m){let v=await s.database.getEmojiByUnicodeOrName(m),M=[...s.currentEmojis,...s.currentFavorites].find(L=>L.id===m),D=M.unicode&&$(M,s.currentSkinTone);return await s.database.incrementFavoriteEmojiCount(m),{emoji:v,skinTone:s.currentSkinTone,...D&&{unicode:D},...M.name&&{name:M.name}}}async function _e(m){let v=ke(m);d("emoji-click-sync",v),d("emoji-click",await v)}function ne(m){let{target:v}=m;if(!v.classList.contains("emoji"))return;De(m);let M=v.id.substring(4);_e(M)}function ie(m){s.currentSkinTone=m,s.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:m}),s.database.setPreferredSkinTone(m)}function ue(m){let{target:{id:v}}=m,M=v&&v.match(/^skintone-(\d)/);if(!M)return;De(m);let D=parseInt(M[1],10);ie(D)}function $e(m){s.skinTonePickerExpanded=!s.skinTonePickerExpanded,s.activeSkinTone=s.currentSkinTone,s.skinTonePickerExpanded&&(De(m),Bn(()=>c("skintone-list")))}r(()=>{s.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{s.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):s.skinTonePickerExpandedAfterAnimation=!1});function at(m){if(!s.skinTonePickerExpanded)return;let v=async M=>{De(m),s.activeSkinTone=M};switch(m.key){case"ArrowUp":return v(Hi(!0,s.activeSkinTone,s.skinTones));case"ArrowDown":return v(Hi(!1,s.activeSkinTone,s.skinTones));case"Home":return v(0);case"End":return v(s.skinTones.length-1);case"Enter":return De(m),ie(s.activeSkinTone);case"Escape":return De(m),s.skinTonePickerExpanded=!1,c("skintone-button")}}function Re(m){if(s.skinTonePickerExpanded)switch(m.key){case" ":return De(m),ie(s.activeSkinTone)}}async function b(m){let{relatedTarget:v}=m;(!v||v.id!=="skintone-list")&&(s.skinTonePickerExpanded=!1)}function E(m){s.rawSearchText=m.target.value}return{$set(m){In(s,m)},$destroy(){n.abort()}}}function ar(i){i instanceof ot||Object.setPrototypeOf(i,customElements.get(i.tagName.toLowerCase()).prototype)}var Wi,Ni,Vl,Qo,lr,Gl,ql,Yl,Xl,Jl,cr,Zl,tr,Ql,ji,zi,Vi,nc,ic,sc,oc,rc,Bn,cc,hc,Ui,st,mc,bc,vc,yc,On,rr,Ki,In,Lc,Dc,Rc,Ic,hr,Bc,ot,ur,pr=Hn(()=>{Oi();Wi=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([i,t,e])=>({id:i,emoji:t,name:e})),Ni=Wi.slice(1),Vl=2,Qo=6,lr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Gl={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},ql=1e3,Yl="🖐️",Xl=8,Jl=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],cr='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Zl=(i,t)=>i<t?-1:i>t?1:0,tr=(i,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${cr}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(i,0,0),n.getImageData(0,0,1,1).data},Ql=(i,t)=>{let e=[...i].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};zi=()=>(ji||(ji=new Promise(i=>lr(()=>i(tc())))),ji),Vi=new Map,nc="️",ic="\uD83C",sc="‍",oc=127995,rc=57339;Bn=requestAnimationFrame,cc=typeof ResizeObserver=="function";hc="😀";mc=new WeakMap,bc=new WeakMap,vc=Symbol("un-keyed"),yc="replaceChildren"in Element.prototype;On=typeof queueMicrotask=="function"?queueMicrotask:i=>Promise.resolve().then(i);rr=new WeakMap;Ki=[],{assign:In}=Object;Lc="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Dc="en",Rc={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Ic=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',hr=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Bc=`:host{--emoji-font-family:${cr}}`,ot=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Ic+Bc,this.shadowRoot.appendChild(e),this._ctx={locale:Dc,dataSource:Lc,skinToneEmoji:Yl,customCategorySorting:Zl,customEmoji:null,i18n:Rc,emojiVersion:null,...t};for(let n of hr)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){ar(this),this._cmp||(this._cmp=Sc(this.shadowRoot,this._ctx))}disconnectedCallback(){ar(this),On(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,s)=>s.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new wt({locale:t,dataSource:e}))}_dbFlush(){On(()=>this._dbCreate())}},ur={};for(let i of hr)ur[i]={get(){return i==="database"&&this._dbCreate(),this._ctx[i]},set(t){if(i==="database")throw new Error("database is read-only");this._set(i,t)}};Object.defineProperties(ot.prototype,ur);customElements.get("emoji-picker")||customElements.define("emoji-picker",ot)});var fr={};qr(fr,{Database:()=>wt,Picker:()=>ot});var gr=Hn(()=>{pr();Oi()});function ls(i){return{type:"auth",access_token:i}}function cs(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function ds(i){let t={type:"subscribe_events"};return i&&(t.event_type=i),t}function Un(i){return{type:"unsubscribe_events",subscription:i}}function hs(){return{type:"ping"}}function us(i,t){return{type:"result",success:!1,error:{code:i,message:t}}}function fs(i){let t={},e=i.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),s=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[s]=r}return t}var gs=(i,t,e,n)=>{let[o,s,r]=i.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(s)>=e:Number(s)>e)||n!==void 0&&Number(o)===t&&Number(s)===e&&Number(r)>=n};var Qt=!1,Xr="auth_required",Jr="auth_invalid",Zr="auth_ok";function bs(i){if(!i.auth)throw 4;let t=i.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;Qt&&console.log("[Auth phase] Initializing",n);function o(s,r,a){Qt&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),h=!1,d=()=>{if(c.removeEventListener("close",d),h){a(2);return}if(s===0){a(1);return}let y=s===-1?-1:s-1;setTimeout(()=>o(y,r,a),1e3)},l=async y=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(ls(t.accessToken)))}catch(A){h=A===2,c.close()}},u=async y=>{let A=JSON.parse(y.data);switch(Qt&&console.log("[Auth phase] Received",A),A.type){case Jr:h=!0,c.close();break;case Zr:c.removeEventListener("open",l),c.removeEventListener("message",u),c.removeEventListener("close",d),c.removeEventListener("error",d),c.haVersion=A.ha_version,gs(c.haVersion,2022,9)&&c.send(JSON.stringify(cs())),r(c);break;default:Qt&&A.type!==Xr&&console.warn("[Auth phase] Unhandled message",A)}};c.addEventListener("open",l),c.addEventListener("message",u),c.addEventListener("close",d),c.addEventListener("error",d)}return new Promise((s,r)=>o(i.setupRetry,s,r))}var _t=!1,en=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(s=>{_t&&console.log("Received",s);let r=this.commands.get(s.id);switch(s.type){case"event":r?r.callback(s.event):(console.warn(`Received event for unknown subscription ${s.id}. Unsubscribing.`),this.sendMessagePromise(Un(s.id)).catch(a=>{_t&&console.warn(` Error unsubsribing from unknown subscription ${s.id}`,a)}));break;case"result":r&&(s.success?(r.resolve(s.result),"subscribe"in r||this.commands.delete(s.id)):(r.reject(s.error),this.commands.delete(s.id)));break;case"pong":r?(r.resolve(),this.commands.delete(s.id)):console.warn(`Received unknown pong response ${s.id}`);break;default:_t&&console.warn("Unhandled message",s)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(us(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),s=r=>{setTimeout(async()=>{if(!this.closeRequested){_t&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let h of c)h.reject&&h.reject(3)}a===2?this.fireEvent("reconnect-error",a):s(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),s(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(s=>{o.unsubscribe=s,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,ds(e))}ping(){return this.sendMessagePromise(hs())}sendMessage(t,e){if(!this.connected)throw 3;if(_t&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(s){n(s)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((s,r)=>{this._queuedMessages.push({resolve:s,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((s,r)=>{let a=this._genCmdId();o={resolve:s,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Un(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var Qr=()=>`${location.protocol}//${location.host}/`,ea=i=>i*1e3+Date.now();function ta(){let{protocol:i,host:t,pathname:e,search:n}=location;return`${i}//${t}${e}${n}`}function na(i,t,e,n){let o=`${i}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function ia(i,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=na(i,t,e,n)}async function xs(i,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=i,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let s=await fetch(`${i}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!s.ok)throw s.status===400||s.status===403?2:new Error("Unable to fetch tokens");let r=await s.json();return r.hassUrl=i,r.clientId=t,r.expires=ea(r.expires_in),r}function ys(i,t,e){return xs(i,t,{code:e,grant_type:"authorization_code"})}function sa(i){return btoa(JSON.stringify(i))}function oa(i){return JSON.parse(atob(i))}var Fn=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await xs(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function ws(i={}){let t,e=i.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=i.clientId!==void 0?i.clientId:Qr(),o=i.limitHassInstance===!0;if(i.authCode&&e&&(t=await ys(e,n,i.authCode),i.saveTokens&&i.saveTokens(t)),!t){let s=fs(location.search.substr(1));if("auth_callback"in s){let r=oa(s.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await ys(r.hassUrl,r.clientId,s.code),i.saveTokens&&i.saveTokens(t)}}if(!t&&i.loadTokens&&(t=await i.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new Fn(t,i.saveTokens);if(e===void 0)throw 4;return ia(e,n,i.redirectUrl||ta(),sa({hassUrl:e,clientId:n})),new Promise(()=>{})}async function ks(i){let t=Object.assign({setupRetry:0,createSocket:bs},i),e=await t.createSocket(t);return new en(e,t)}function F(i){let t=Math.round(i),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function ze(i){let t=Math.floor(Math.round(i)/60)%24;return`${F(i)} ${t<12?"AM":"PM"}`}function $s(i){let t=Math.floor(i/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Pt(i){let t=Math.max(0,Math.round(i)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function Kn(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var ra=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),aa=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),la=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function tn(i){return new Date(`${i}T12:00:00Z`)}function Ce(i){let t=tn(i);return`${ra.format(t)}, ${la.format(t)}`}function me(i){return aa.format(tn(i))}function Me(i,t){return Math.round((tn(t).getTime()-tn(i).getTime())/864e5)}function Ct(i,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Ct("UTC",t)}let n=o=>e.find(s=>s.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function nn(i,t,e){let n=Math.floor((t.getTime()-i.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=Ct(e,i),s=Ct(e,t).date;return o.date===s?`at ${ze(o.minutes)}`:`on ${me(o.date)} at ${ze(o.minutes)}`}var se=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function _s(i){switch(i.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var We="mydashlight",ca=7,Wn=3e4,Ts=3e4;function Vn(i){if(i instanceof se)return i;if(i&&typeof i=="object"){let t=i;if(typeof t.message=="string")return new se(String(t.code??"error"),t.message)}return typeof i=="number"?new se("connection_lost","Lost the connection to Home Assistant."):new se("error",String(i))}function Es(i,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new se("timeout","Home Assistant didn’t answer.")),t);i.then(s=>{clearTimeout(o),e(s)},s=>{clearTimeout(o),n(s)})})}var At=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},sn=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new se("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new At(this.conn,`${We}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new se("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},Wn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await Es(this.conn.sendMessagePromise({type:"call_service",domain:We,service:"get_plan",service_data:{days:ca},return_response:!0}),Ts);this.emit(t.response)}catch(t){this.fail(Vn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:We,service:t,service_data:e})}catch(n){throw Vn(n)}this.live||await this.refresh()}setRide(t,e,n,o,s){return this.call("set_ride",s===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:s})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Kn(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:Kn(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n){return this.call("set_people",{event:t,people:e,scope:n})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let a=await Es(this.conn.sendMessagePromise({type:"call_service",domain:We,service:"get_chores",service_data:{},return_response:!0}),Ts);if(e)return;n=!0,t(a.response??null)}catch{!e&&!n&&t(null)}},s=new At(this.conn,`${We}/chores/subscribe`,a=>{e||(n=!0,t(a.chores))},()=>void o());s.open();let r=setInterval(()=>{s.live||s.open()},Wn);return()=>{e=!0,clearInterval(r),s.close()}}watchLunch(t){let e=!1,n=!1,o=new At(this.conn,`${We}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let s=setInterval(()=>{o.live||o.open()},Wn);return()=>{e=!0,clearInterval(s),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:We,service:t,service_data:e})}catch(n){throw Vn(n)}}};var on=globalThis,rn=on.ShadowRoot&&(on.ShadyCSS===void 0||on.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Gn=Symbol(),Cs=new WeakMap,Mt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Gn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(rn&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Cs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Cs.set(e,t))}return t}toString(){return this.cssText}},Ps=i=>new Mt(typeof i=="string"?i:i+"",void 0,Gn),Ve=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[s+1],i[0]);return new Mt(e,i,Gn)},As=(i,t)=>{if(rn)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=on.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,i.appendChild(n)}},qn=rn?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Ps(e)})(i):i;var{is:da,defineProperty:ha,getOwnPropertyDescriptor:ua,getOwnPropertyNames:pa,getOwnPropertySymbols:fa,getPrototypeOf:ga}=Object,an=globalThis,Ms=an.trustedTypes,ma=Ms?Ms.emptyScript:"",ba=an.reactiveElementPolyfillSupport,St=(i,t)=>i,Yn={toAttribute(i,t){switch(t){case Boolean:i=i?ma:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ls=(i,t)=>!da(i,t),Ss={attribute:!0,type:String,converter:Yn,reflect:!1,useDefault:!1,hasChanged:Ls};Symbol.metadata??=Symbol("metadata"),an.litPropertyMetadata??=new WeakMap;var Ie=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ss){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&ha(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:s}=ua(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);s?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ss}static _$Ei(){if(this.hasOwnProperty(St("elementProperties")))return;let t=ga(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(St("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(St("properties"))){let e=this.properties,n=[...pa(e),...fa(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(qn(o))}else t!==void 0&&e.push(qn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return As(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let s=(n.converter?.toAttribute!==void 0?n.converter:Yn).toAttribute(e,n.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let s=n.getPropertyOptions(o),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Yn;this._$Em=o;let a=r.fromAttribute(e,s.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,s){if(t!==void 0){let r=this.constructor;if(o===!1&&(s=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Ls)(s,e)||n.useDefault&&n.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:s},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),s!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,s]of n){let{wrapped:r}=s,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,s,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Ie.elementStyles=[],Ie.shadowRootOptions={mode:"open"},Ie[St("elementProperties")]=new Map,Ie[St("finalized")]=new Map,ba?.({ReactiveElement:Ie}),(an.reactiveElementVersions??=[]).push("2.1.2");var Jn=globalThis,Ds=i=>i,ln=Jn.trustedTypes,Rs=ln?ln.createPolicy("lit-html",{createHTML:i=>i}):void 0,Zn="$lit$",Be=`lit$${Math.random().toFixed(9).slice(2)}$`,Qn="?"+Be,va=`<${Qn}>`,Ye=document,Dt=()=>Ye.createComment(""),Rt=i=>i===null||typeof i!="object"&&typeof i!="function",ei=Array.isArray,zs=i=>ei(i)||typeof i?.[Symbol.iterator]=="function",Xn=`[ 	
\f\r]`,Lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Is=/-->/g,Bs=/>/g,Ge=RegExp(`>|${Xn}(?:([^\\s"'>=/]+)(${Xn}*=${Xn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Os=/'/g,Ns=/"/g,Hs=/^(?:script|style|textarea|title)$/i,ti=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),p=ti(1),ae=ti(2),Yd=ti(3),Oe=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),js=new WeakMap,qe=Ye.createTreeWalker(Ye,129);function Us(i,t){if(!ei(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Rs!==void 0?Rs.createHTML(t):t}var Fs=(i,t)=>{let e=i.length-1,n=[],o,s=t===2?"<svg>":t===3?"<math>":"",r=Lt;for(let a=0;a<e;a++){let c=i[a],h,d,l=-1,u=0;for(;u<c.length&&(r.lastIndex=u,d=r.exec(c),d!==null);)u=r.lastIndex,r===Lt?d[1]==="!--"?r=Is:d[1]!==void 0?r=Bs:d[2]!==void 0?(Hs.test(d[2])&&(o=RegExp("</"+d[2],"g")),r=Ge):d[3]!==void 0&&(r=Ge):r===Ge?d[0]===">"?(r=o??Lt,l=-1):d[1]===void 0?l=-2:(l=r.lastIndex-d[2].length,h=d[1],r=d[3]===void 0?Ge:d[3]==='"'?Ns:Os):r===Ns||r===Os?r=Ge:r===Is||r===Bs?r=Lt:(r=Ge,o=void 0);let y=r===Ge&&i[a+1].startsWith("/>")?" ":"";s+=r===Lt?c+va:l>=0?(n.push(h),c.slice(0,l)+Zn+c.slice(l)+Be+y):c+Be+(l===-2?a:y)}return[Us(i,s+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},It=class i{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let s=0,r=0,a=t.length-1,c=this.parts,[h,d]=Fs(t,e);if(this.el=i.createElement(h,n),qe.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(o=qe.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let l of o.getAttributeNames())if(l.endsWith(Zn)){let u=d[r++],y=o.getAttribute(l).split(Be),A=/([.?@])?(.*)/.exec(u);c.push({type:1,index:s,name:A[2],strings:y,ctor:A[1]==="."?dn:A[1]==="?"?hn:A[1]==="@"?un:Je}),o.removeAttribute(l)}else l.startsWith(Be)&&(c.push({type:6,index:s}),o.removeAttribute(l));if(Hs.test(o.tagName)){let l=o.textContent.split(Be),u=l.length-1;if(u>0){o.textContent=ln?ln.emptyScript:"";for(let y=0;y<u;y++)o.append(l[y],Dt()),qe.nextNode(),c.push({type:2,index:++s});o.append(l[u],Dt())}}}else if(o.nodeType===8)if(o.data===Qn)c.push({type:2,index:s});else{let l=-1;for(;(l=o.data.indexOf(Be,l+1))!==-1;)c.push({type:7,index:s}),l+=Be.length-1}s++}}static createElement(t,e){let n=Ye.createElement("template");return n.innerHTML=t,n}};function Xe(i,t,e=i,n){if(t===Oe)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,s=Rt(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(i),o._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Xe(i,o._$AS(i,t.values),o,n)),t}var cn=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Ye).importNode(e,!0);qe.currentNode=o;let s=qe.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let h;c.type===2?h=new dt(s,s.nextSibling,this,t):c.type===1?h=new c.ctor(s,c.name,c.strings,this,t):c.type===6&&(h=new pn(s,this,t)),this._$AV.push(h),c=n[++a]}r!==c?.index&&(s=qe.nextNode(),r++)}return qe.currentNode=Ye,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},dt=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Xe(this,t,e),Rt(t)?t===T||t==null||t===""?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==Oe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):zs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==T&&Rt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ye.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=It.createElement(Us(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let s=new cn(o,this),r=s.u(this.options);s.p(e),this.T(r),this._$AH=s}}_$AC(t){let e=js.get(t.strings);return e===void 0&&js.set(t.strings,e=new It(t)),e}k(t){ei(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let s of t)o===e.length?e.push(n=new i(this.O(Dt()),this.O(Dt()),this,this.options)):n=e[o],n._$AI(s),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Ds(t).nextSibling;Ds(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Je=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,s){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=T}_$AI(t,e=this,n,o){let s=this.strings,r=!1;if(s===void 0)t=Xe(this,t,e,0),r=!Rt(t)||t!==this._$AH&&t!==Oe,r&&(this._$AH=t);else{let a=t,c,h;for(t=s[0],c=0;c<s.length-1;c++)h=Xe(this,a[n+c],e,c),h===Oe&&(h=this._$AH[c]),r||=!Rt(h)||h!==this._$AH[c],h===T?t=T:t!==T&&(t+=(h??"")+s[c+1]),this._$AH[c]=h}r&&!o&&this.j(t)}j(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},dn=class extends Je{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===T?void 0:t}},hn=class extends Je{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==T)}},un=class extends Je{constructor(t,e,n,o,s){super(t,e,n,o,s),this.type=5}_$AI(t,e=this){if((t=Xe(this,t,e,0)??T)===Oe)return;let n=this._$AH,o=t===T&&n!==T||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==T&&(n===T||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},pn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Xe(this,t)}},Ks={M:Zn,P:Be,A:Qn,C:1,L:Fs,R:cn,D:zs,V:Xe,I:dt,H:Je,N:hn,U:un,B:dn,F:pn},ya=Jn.litHtmlPolyfillSupport;ya?.(It,dt),(Jn.litHtmlVersions??=[]).push("3.3.3");var Ws=(i,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let s=e?.renderBefore??null;n._$litPart$=o=new dt(t.insertBefore(Dt(),s),s,void 0,e??{})}return o._$AI(i),o};var ni=globalThis,Te=class extends Ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ws(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Oe}};Te._$litElement$=!0,Te.finalized=!0,ni.litElementHydrateSupport?.({LitElement:Te});var xa=ni.litElementPolyfillSupport;xa?.({LitElement:Te});(ni.litElementVersions??=[]).push("4.2.2");var Vs={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Gs=i=>(...t)=>({_$litDirective$:i,values:t}),fn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:wa}=Ks,qs=i=>i;var Ys=()=>document.createComment(""),ht=(i,t,e)=>{let n=i._$AA.parentNode,o=t===void 0?i._$AB:t._$AA;if(e===void 0){let s=n.insertBefore(Ys(),o),r=n.insertBefore(Ys(),o);e=new wa(s,r,i,i.options)}else{let s=e._$AB.nextSibling,r=e._$AM,a=r!==i;if(a){let c;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(c=i._$AU)!==r._$AU&&e._$AP(c)}if(s!==o||a){let c=e._$AA;for(;c!==s;){let h=qs(c).nextSibling;qs(n).insertBefore(c,o),c=h}}}return e},He=(i,t,e=i)=>(i._$AI(t,e),i),ka={},Xs=(i,t=ka)=>i._$AH=t,Js=i=>i._$AH,gn=i=>{i._$AR(),i._$AA.remove()};var Zs=(i,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(i[o],o);return n},Ne=Gs(class extends fn{constructor(i){if(super(i),i.type!==Vs.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],s=[],r=0;for(let a of i)o[r]=n?n(a,r):r,s[r]=e(a,r),r++;return{values:s,keys:o}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,n]){let o=Js(i),{values:s,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,s;let a=this.ut??=[],c=[],h,d,l=0,u=o.length-1,y=0,A=s.length-1;for(;l<=u&&y<=A;)if(o[l]===null)l++;else if(o[u]===null)u--;else if(a[l]===r[y])c[y]=He(o[l],s[y]),l++,y++;else if(a[u]===r[A])c[A]=He(o[u],s[A]),u--,A--;else if(a[l]===r[A])c[A]=He(o[l],s[A]),ht(i,c[A+1],o[l]),l++,A--;else if(a[u]===r[y])c[y]=He(o[u],s[y]),ht(i,o[l],o[u]),u--,y++;else if(h===void 0&&(h=Zs(r,y,A),d=Zs(a,l,u)),h.has(a[l]))if(h.has(a[u])){let g=d.get(r[y]),$=g!==void 0?o[g]:null;if($===null){let _=ht(i,o[l]);He(_,s[y]),c[y]=_}else c[y]=He($,s[y]),ht(i,o[l],$),o[g]=null;y++}else gn(o[u]),u--;else gn(o[l]),l++;for(;y<=A;){let g=ht(i,c[A+1]);He(g,s[y]),c[y++]=g}for(;l<=u;){let g=o[l++];g!==null&&gn(g)}return this.ut=r,Xs(i,c),Oe}});var mn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ce(i){return mn[(i%mn.length+mn.length)%mn.length]}var bn="#23272E",ii="35,39,46";var $a=3,jt=36,si=12,vn=8,Qs=30,Se=16,Bt=100,pt=60,ri=10,xn=30,ai=10,Ta=150,Ea=150,kn=1;function ao(i,t){return i.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??jt}var _a=26,lo=4;function ci(i,t){let e=Math.max(Ta,Ea/kn);return Math.ceil(pt+Math.max(0,i-1)*ri+xn+Math.max(0,t-1)*ai+e*(i+kn*t))}function Ee(i){return i.people?i.people.kids.map(t=>t.id):i.days.length?Object.keys(i.days[0].kids):[]}function ye(i){return i.people?i.people.drivers.map(t=>t.id):i.days.length?Object.keys(i.days[0].drivers):[]}function xe(i){return new Map(Ee(i).map((t,e)=>[t,ce(e)]))}function fe(i,t){let e=i.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.kids[t])return n.kids[t].name;return t}function pe(i,t){let e=i.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.drivers[t])return n.drivers[t].name;return t}function di(i,t){return t==="none"?"Not needed":ye(i).includes(t)?pe(i,t):t}function Ca(i){return i.leave_by!=null&&i.leave_by>i.start&&i.leave_by<i.end?` · leave ${F(i.leave_by)}`:""}function $n(i){if(i.busy_why==="days"){if(i.start<=0&&i.end>=1440)return"All day";if(i.start<=0)return`Until ${F(i.end)}`;if(i.end>=1440)return`From ${F(i.start)}`}return`${F(i.start)}–${F(i.end)}`}function Tn(i,t){return t.own?pe(i,t.own):fe(i,t.kid)}var ft={color:bn,rgb:ii,ink:bn};function co(i,t){return t.own?ft:xe(i).get(t.kid)??ce(0)}function Pa(i,t){let e=Ee(i);return t.along.map(n=>e.includes(n)?fe(i,n):pe(i,n))}function gt(i){return i.length<2?i.join(""):`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}function Aa(i){let t=new Map([["home","Home"]]);for(let e of i.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function wn(i,t){return t?i.get(t)??(t.split(",")[0]?.trim()||t):""}function oi(i,t){let e=[];for(let n of i)n.type==="drive"?(e.length||e.push(wn(t,n.from)),e.push(wn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(wn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Ma(i){let t=i.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,s=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(s(),o=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return s(),t}function Sa(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].y;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return i[i.length-1].y}function La(i,t){if(!i.length)return 0;if(t<=i[0].y)return i[0].t;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return i[i.length-1].t}function ho(i,t){return Sa(i.anchors,t)}function hi(i,t){return La(i.anchors,t)}function Da(i,t){let e=Ee(i),n=ye(i),o=Math.max(t,ci(e.length,n.length)),r=(o-pt-Math.max(0,e.length-1)*ri-xn-Math.max(0,n.length-1)*ai)/(e.length+kn*n.length||1),a=Math.floor(r),c=Math.floor(r*kn),h=i.whole_week??i.days,d=new Map;for(let g of h)for(let $ of g.events)for(let _ of $.own?$.along:[$.kid]){let f=d.get(_)??[];f.some(O=>O.event_id===$.event_id&&O.calendar_id===$.calendar_id)||f.push($),d.set(_,f)}let l=xe(i),u=[],y=pt;e.forEach((g,$)=>{let _=d.get(g)??[],f=i.days.some(O=>O.events.some(H=>H.kid===g&&(H.sides.includes("drop")&&H.drop===""||H.sides.includes("pick")&&H.pick==="")));u.push({id:g,kind:"kid",x:y,w:a,name:fe(i,g),dot:l.get(g).color,rgb:l.get(g).rgb,sub:`${f?"Needs a ride · ":""}${_.length} this week`,subWarn:f}),y+=a+($<e.length-1?ri:0)});let A=y+xn/2;return y+=xn,n.forEach((g,$)=>{let _=0,f=0;for(let O of h){let H=O.drivers[g];H&&(_+=H.outings.length,f+=H.drive??0)}u.push({id:g,kind:"driver",x:y,w:c,name:pe(i,g),dot:bn,rgb:ii,sub:`${_} ${_===1?"trip":"trips"} this week · ${Pt(f)} driving`,subWarn:!1}),y+=c+($<n.length-1?ai:0)}),{columns:u,sepX:A,width:o}}function Ra(i,t){let e=i.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),s=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!s)return e;let r=o.slice(s[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function eo(i,t){let e=i.start<=0,n=i.end>=1440;return e&&n?`${i.title} · all day`:n?`${i.title} from ${F(i.start)}`:e||!t?`${i.title} until ${F(i.end)}`:`${i.title} ${F(i.start)}–${F(i.end)}`}function ui(i){return i.issues.filter(t=>t.level==="problem").length+i.clashes.length+(i.unplaced?.length??0)}function pi(i,t){let e=Me(t,i);return e===0?"Today":e===1?"Tomorrow":""}function de(i,t=0){return i==null||!Number.isFinite(i)?t:i}var li=null;function uo(i){li=i}var yn='Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',ut={title:`800 14.5px ${yn}`,time:`400 12px ${yn}`,line:`600 12px ${yn}`,stop:`400 12px ${yn}`};function Ia(i,t,e){let n=Math.max(8,Math.floor(t/e)),o=1,s=0;for(let r of i.split(/[ \t\n]+/).filter(Boolean)){let a=r.length;for(s===0?s=a:s+1+a<=n?s+=1+a:(o++,s=a);s>n;)o++,s-=n}return o}function Ba(i,t,e,n){let o=i.split(/[ \t\n]+/).filter(Boolean),s=1,r="";for(let a of o){let c=r?`${r} ${a}`:a,h=n(c,e);if(h==null)return null;if(h<=t){r=c;continue}r&&s++;let d=n(a,e);if(d==null)return null;d>t&&(s+=Math.ceil(d/t)-1),r=a}return s}function Ot(i,t,e=7,n){if(n&&li){let o=Ba(i,t-.5,n,li);if(o!=null)return o}return Ia(i,t,e)}var po=25,Oa=15,fo=3;function to(i){return Math.max(0,Math.min(fo,Math.floor((i-po)/Oa)))}var Na=po+2,no=20;function io(i){return/^(\d+:\d\d)\s+Home$/.exec(i.at(-1)??"")?.[1]??null}var Nt="🚗";function so(i,t){if(i===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,s,r,a=!1)=>({at:o,who:s,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(i))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(i))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(i))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}return null}var oo={muted:0,normal:1,pending:2,problem:3};function ja(i){let{drop:t,pick:e}=i,n=t?so(t.text,"drop"):null,o=e?so(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return i;let s=[t,e].reduce((c,h)=>h&&(oo[h.tone]??1)>(oo[c]??1)?h.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Nt} No rides yet`,tone:s},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${Nt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:s},pick:null}:!n.at||!o.at?{drop:{text:`${c} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:s},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:s},pick:null}}let r=(c,h)=>c==="needed"?`${h} needed`:`${h}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Nt} ${a.join(" · ")}`,tone:s},pick:null}}function za(i,t){return!t&&!!i.drop&&!i.pick&&i.drop.tone==="muted"}var Ha=5,Ua=13;function Fa(i,t,e={}){let n=e.clash?4:2,o=t-n-13-9,s=n+2*Ha;s+=Ot(i.title,o-(e.noted?Ua:0),9,ut.title)*18;let r=i.inline&&i.drop?`${i.time} · ${i.drop.text}`:i.time;return s+=1+Ot(r,o,6.6,i.inline?ut.line:ut.time)*16,i.drop&&!i.inline&&(s+=1+Ot(i.drop.text,o,7,ut.line)*16),i.pick&&(s+=2+Ot(i.pick.text,o,7,ut.line)*16),Math.ceil(s)+1}function ro(i){return i.replace(/^(\S+\s+Home), get (.+)$/u,"$1 ↑ $2").replace(/, drop off (.+)$/u," ↓ $1").replace(/, pick up (.+)$/u," ↑ $1")}function Ka(i,t){let e=i.reduce((n,o)=>n+Ot(o,t-20,7,ut.stop),0);return 28+i.length+e*16+1}function go(i,t,e,n){let o=t==="compact",{columns:s,sepX:r,width:a}=Da(i,e),c=new Map(s.map(f=>[f.id,f])),h=Ee(i),d=ye(i),l=[...h,...d],u=xe(i),y=Aa(i),A=f=>fe(i,f),g=f=>pe(i,f),$={mode:t,width:a,height:0,columns:s,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},_=0;return i.days.forEach((f,O)=>{let H=O*1440,W=new Map(f.events.map(b=>[b.id,b])),he=b=>b&&W.has(b)?{day:f.date,event:b}:null,w=ui(f),k=f.events.length,x=pi(f.date,n.date),C=qa(i,f,u,a);$.dayHeads.push({date:f.date,y:_,label:Ce(f.date),tag:x,sub:(k?`${k} ${k===1?"activity":"activities"}${f.done?" left":""}`:f.done?"All done for today":"Nothing scheduled")+(w?` · ${w} to sort out`:""),warn:w>0,h:jt+(C?C.h+lo+2:0),allDay:C?.chips??[]}),$.anchors.push({t:H,y:_});let P=$.dayHeads[$.dayHeads.length-1],S=_+P.h+si,j=d.flatMap(b=>f.drivers[b]?.outings??[]);if(!k&&!j.length){$.empties.push({key:f.date,y:S,text:f.done?"Nothing else today":"Nothing planned"}),_=S+40,$.anchors.push({t:H+1439,y:_});return}let V=(b,E,m=b.kid)=>{let v=!!b.own&&m===b.own,M=!!b.own&&m!==b.own,D=v?g(m):A(m),L=M?{drop:{text:`${E?`${Nt} `:""}With ${g(b.own)}`,tone:b.attending===!1?"muted":"normal"},pick:null}:E&&!b.own?ja(b.lines):b.lines,N=v?Pa(i,b):[],U=(b.takes!=null?`${b.takes} min, any time ${F(b.start)}–${F(b.end)}`:$n(b)+(b.arrive_by!=null?` · arrive ${F(b.arrive_by)}`:"")+Ca(b))+(N.length?` · with ${gt(N)}`:"");return{who:D,mine:v,title:Ra(b.title,D),time:U,drop:L.drop,pick:L.pick,inline:E&&za(L,b.attending===!1)}},X=(b,E,m,v)=>Fa(V(b,!0,m),E,{noted:!!b.notes,clash:v}),J=(b,E,m,v,M,D,L,N=b.kid)=>{let U=V(b,L,N),B=U.mine?ft:u.get(N)??ce(0),oe=U.who,G={drop:U.drop,pick:U.pick};return{key:`${f.date}|card|${b.id}`+(b.own?`|${N}`:""),x:E,y:m,w:v,h:M,target:{day:f.date,event:b.id},event:b,color:B,kidName:oe,clash:D,stayed:!b.own&&b.stay&&d.includes(b.drop),skipped:b.attending===!1,title:U.title,time:U.time,drop:G.drop,pick:G.pick,showDrop:!!G.drop&&(L||M>=56),showPick:!!G.pick&&(L||M>=74),wrap:L,inline:U.inline,aria:`${oe}, ${b.title} ${b.takes!=null?`any time from ${F(b.start)} to ${F(b.end)}`:$n(b).replace("–"," to ")}. `+(b.attending===!1&&!G.drop?"Not attending. ":"")+[G.drop,G.pick].filter(ve=>!!ve).map(ve=>ve.text).join(". ")}},z=b=>{let E=f.rides[b];return E?(f.drivers[E.driver]?.segments??[]).filter(v=>v.type!=="home"&&v.kids.includes(E.kid)&&de(v.start)>=de(E.start)&&de(v.end)<=de(E.end)):[]},Z=b=>{let E=f.rides[b];if(!E)return null;let m=E.serves.find(v=>W.get(v)?.kid===E.kid);return he(m??E.serves[0])},Q=(b,E)=>{if(E.event)return E;let m=f.events.find(v=>v.own&&v.own!==b&&v.along.includes(b)&&v.title===E.title);return m?{...E,title:`${E.title} with ${g(m.own)}`}:E},ke=b=>{if(b.takes==null)return[b.start,b.end];let E=b.planned??b.start;return[E,E+b.takes]},_e=new Map;for(let b of f.issues)b.level!=="problem"||!b.event||(b.kind==="late"&&_e.set(b.event,`${Math.round(de(b.minutes))} min late`),b.kind==="waiting"&&_e.set(`${b.event}|pick`,`Waits ${Math.round(de(b.minutes))} min`));if(!o){let b=1/0,E=-1/0;for(let B of f.events)B.start<=0&&B.end>=1440||(B.start>0?b=Math.min(b,B.start-20,B.arrive_by!=null?B.arrive_by-10:1/0):b=Math.min(b,B.end-30),B.end<1440?E=Math.max(E,B.end+20):E=Math.max(E,B.start+30));for(let B of j)B.start!=null&&(b=Math.min(b,B.start)),B.end!=null&&(E=Math.max(E,B.end));let m=f.from;m!=null&&Number.isFinite(b)&&b<m+60?b=m-15:f.date===n.date&&Number.isFinite(b)&&n.minutes>b-60&&n.minutes<E&&(b=Math.min(b,n.minutes-15));let v=Number.isFinite(b)?Math.floor((b-5)/30)*30:900,M=Math.max(Number.isFinite(E)?Math.ceil((E+5)/30)*30:960,v+60),D=B=>m!=null&&de(B)<=v,L=B=>m!=null&&de(B)<v,N=B=>Math.round(S+(Math.max(v,Math.min(M,B))-v)*$a);$.anchors.push({t:H+v,y:N(v)},{t:H+M,y:N(M)});for(let B of h){let oe=c.get(B),G=u.get(B),ve=(f.kids[B]?.items??[]).filter(R=>R.start!=null&&R.end!=null&&!D(R.end)).map(R=>({item:R,s:de(R.start),en:de(R.end)})),ge=[];for(let R of Ma(ve)){let K=oe.w/R.cols,q=Math.round(oe.x+R.col*K),ee=Math.round(K-(R.cols>1?4:0)),re=N(R.s),te=R.item;if(te.type==="act"){let we=W.get(te.event??"");if(!we)continue;let Zt=Math.max(30,N(R.en)-re),lt=J(we,q,re,ee,Zt,te.clash,!1,B);if(lt.layer=Bt,lt.cut=L(R.s),$.cards.push(lt),we.arrive_by!=null&&we.start-we.arrive_by>=5&&!lt.cut){let zn=N(we.arrive_by),as={key:`${f.date}|prep|${we.id}`,x:q,y:zn,w:ee,h:re-zn+Se,color:G,label:`Arrive by ${F(we.arrive_by)}`,layer:Bt-1};$.preps.push(as),ge.push({s:we.arrive_by,en:R.en,top:zn,bottom:re+Zt,x:q,w:ee,prep:as,card:lt})}else ge.push({s:R.s,en:R.en,top:re,bottom:re+Zt,x:q,w:ee,card:lt});let os=_e.get(we.id);os&&$.marks.push({key:`${f.date}|late|${we.id}`,x:q+ee-4,y:re+4,text:os,right:!0});let rs=_e.get(`${we.id}|pick`);rs&&$.marks.push({key:`${f.date}|wait|${we.id}`,x:q+4,y:re+Zt+2,text:rs,right:!1});continue}let Y=f.rides[te.ride??-1];if(!Y)continue;let Ae=Math.max(22,N(R.en)-re),Et=oi(z(Y.index),y),ns=g(Y.driver),is={key:`${f.date}|ride|${Y.index}`,x:q,y:re,w:ee,h:Ae,target:Z(Y.index),l1:`${Y.own?"In":"Along in"} ${ns}’s car`,l2:Et.join(" → "),show2:to(Ae)>0,lines2:to(Ae),dashed:!Y.own,clash:te.clash,aria:`${A(B)} ${Y.own?"in":"riding along in"} ${ns}’s car, ${F(de(Y.start))} to ${F(de(Y.end))}: ${Et.join(" to ")}`};$.rides.push(is);let ss=c.get(Y.driver),jn=null;ss&&(jn={key:`${f.date}|band|${Y.index}`,x:q+ee,y:re,w:Math.max(0,ss.x+8-(q+ee)),h:Ae,color:G},$.bands.push(jn)),ge.push({s:R.s,en:R.en,top:re,bottom:re+Ae,x:q,w:ee,ride:is,band:jn})}let Jt=R=>R.ride?.layer??(R.prep?Bt-1:Bt),Tt=(R,K,q,ee)=>{q>Se&&$.links.push({key:`${R.key}|link`,x:R.x,y:K,w:R.w,h:q,color:G,layer:ee})},I=(R,K)=>{if(!(K.x<R.x||K.x+K.w>R.x+R.w)&&(R.x=K.x,R.w=K.w,R.ride.x=K.x,R.ride.w=K.w,R.band)){let q=R.band.x+R.band.w;R.band.x=K.x+K.w,R.band.w=Math.max(0,q-R.band.x)}},le=new Set;for(let R of[...ge].sort((K,q)=>q.s-K.s)){let K=R.ride;if(!K)continue;let q=ge.filter(te=>te!==R&&te.s>=R.en&&te.s-R.en<=Qs&&te.top>=R.bottom).sort((te,Y)=>te.s-Y.s||te.top-Y.top)[0];if(!q)continue;le.add(R),I(R,q);let ee=Jt(q),re=q.top-R.bottom;Tt(K,R.bottom,re+Se,ee-1),K.layer=ee-(re>0?2:1),K.h+=Se,K.tuckBottom=Se}for(let R of[...ge].sort((K,q)=>K.s-q.s)){let K=R.ride;if(!K||le.has(R))continue;let q=ge.filter(te=>te!==R&&te.en<=R.s&&R.s-te.en<=Qs&&te.bottom<=R.top&&(te.card||te.ride?.layer!=null)).sort((te,Y)=>Y.en-te.en||Y.bottom-te.bottom)[0];if(!q)continue;I(R,q);let ee=q.ride?.layer??Bt,re=R.top-q.bottom;Tt(K,q.bottom-Se,re+Se,ee-1),K.layer=ee-(re>0?2:1),K.y-=Se,K.h+=Se,K.tuckTop=Se}}for(let B of d){let oe=c.get(B),G=f.drivers[B];if(!G)continue;let ve=[],ge=null;for(let I of G.segments)if(!(I.start==null||I.end==null)){if(I.type==="home"){ge=null;continue}if(I.type==="stay"){ge=null,ve.push({type:"stay",g:I,s:I.start,en:I.end});continue}ge&&ge.en===I.start?(ge.en=I.end,ge.legs.push(I)):(ge={type:"trip",s:I.start,en:I.end,legs:[I]},ve.push(ge))}let Jt=new Set,Tt=(I,le,R,K)=>{Jt.add(I.id);let q=N(le),ee=J(I,oe.x+8,q,oe.w-16,Math.max(30,N(R)-q),!1,!1,B);ee.cut=L(le),K&&ee.drop?.tone==="normal"&&(ee.drop=null,ee.showDrop=!1),$.cards.push(ee)};for(let I of ve){if(D(I.en))continue;let le=N(I.s),R=Math.max(24,N(I.en)-le);if(I.type==="stay"){let Y=W.get(I.g.event??I.g.serves??"");if(Y?.own===B){Tt(Y,I.s,I.en,!0);continue}let Ae=Y?u.get(Y.kid)??ce(0):ce(0),Et=I.g.kids.map(A);$.stays.push({cut:L(I.s),key:`${f.date}|stay|${B}|${I.s}`,x:oe.x+8,y:le,w:oe.w-16,h:R,target:he(Y?.id),color:Ae,l1:Y?`At ${Y.title} with ${A(Y.kid)}`:"Staying",l2:`until ${F(I.en)}`+(Et.length?` · ${Et.join(" and ")} too`:"")});continue}let K=I.legs[0],q=I.legs[I.legs.length-1],ee=[];for(let Y of I.legs)for(let Ae of Y.kids)ee.includes(Ae)||ee.push(Ae);let re=q.type==="drive"&&q.to==="home",te=oi(I.legs,y);$.trips.push({key:`${f.date}|trip|${B}|${I.s}`,x:oe.x+8,y:le,w:oe.w-16,h:R,target:he(I.legs.find(Y=>Y.serves)?.serves),l1:K.type==="drive"&&K.from==="home"?`Leave ${F(I.s)}`:`From ${wn(y,K.from??K.place)} ${F(I.s)}`,l2:te.join(" → "),show2:R>=36,l3:re?`Home ${F(I.en)}`:"",show3:re&&R>=62,stops:null,kids:ee.map(Y=>(u.get(Y)??ce(0)).color),bad:I.legs.some(Y=>Y.overlaps_busy),aria:`${g(B)} drives ${te.join(" to ")}, ${F(I.s)} to ${F(I.en)}`})}for(let I of G.segments)if(!(!I.overlaps_busy||I.start==null||I.end==null))for(let le of G.busy){let R=Math.max(I.start,le.start),K=Math.min(I.end,le.end);K<=R||D(K)||$.overlaps.push({key:`${f.date}|overlap|${B}|${R}`,x:oe.x+6,y:N(R)-2,w:oe.w-12,h:Math.max(8,N(K)-N(R)+4)})}for(let I of f.events)if(I.own===B&&(!Jt.has(I.id)&&!D(ke(I)[1])&&Tt(I,...ke(I),!1),I.takes!=null&&I.attending!==!1&&!D(I.end))){let le=N(I.start);$.windows.push({key:`${f.date}|window|${I.id}`,x:oe.x+4,y:le,w:oe.w-8,h:Math.max(24,N(I.end)-le),label:`${I.title} · any time ${F(I.start)}–${F(I.end)}`})}for(let I of G.busy){if(I.event||I.end<=v||I.start>=M)continue;let le=Q(B,I),R=N(le.start),K=N(le.end);$.busy.push({key:`${f.date}|busy|${B}|${le.start}`,x:oe.x+1,y:R,w:oe.w-2,h:K-R,labelY:8,label:eo(le,!1)})}}let U=-1/0;for(let B=v;B<=M;B+=30)$.grid.push({key:`${f.date}|grid|${B}`,y:N(B),strong:B%60===0}),B%60===0&&N(B)-U>=22&&($.hours.push({key:`${f.date}|hour|${B}`,y:N(B)-8,label:$s(B)}),U=N(B));f.date===n.date&&n.minutes>v&&n.minutes<M&&($.now={y:N(n.minutes),label:`Now ${F(n.minutes)}`}),_=N(M)+si;return}let ne=[];for(let b of h){let E=c.get(b);for(let m of f.kids[b]?.items??[])if(m.start!=null){if(m.type==="act"){let v=W.get(m.event??"");if(!v)continue;ne.push({col:b,s:m.start,h:X(v,E.w,b,m.clash),kind:"act",item:m})}else if(!f.rides[m.ride??-1]?.own){let v=f.rides[m.ride??-1],M=v?f.drivers[v.driver]?.outings.find(D=>D.start!=null&&D.start<=de(v.start)&&de(v.start)<=de(D.end,D.start)):void 0;ne.push({col:b,s:M?.start??m.start,h:Na,kind:"along",item:m})}}}for(let b of d){let E=f.drivers[b];if(!E)continue;for(let v of E.busy)v.event||ne.push({col:b,s:v.start,h:32,kind:"busy",busy:Q(b,v)});let m=c.get(b).w;for(let v of f.events)v.own!==b||!v.busy_only&&v.attending!==!1&&(v.takes==null||v.planned!=null)||ne.push({col:b,s:ke(v)[0],h:X(v,m-16,b,!1),kind:"own",event:v});for(let v of E.outings){if(v.start==null)continue;let M=(io(v.lines)?v.lines.slice(0,-1):v.lines).map(ro);ne.push({col:b,s:v.start,h:Ka([...M,...v.warn?[v.warn]:[]],m-16),kind:"out",out:v})}}ne.sort((b,E)=>b.s-E.s||l.indexOf(b.col)-l.indexOf(E.col));let ie=new Map,ue=[],$e=new Map,at=S-no;for(let b=0;b<ne.length;){let E=b,m=at+no;for(;E<ne.length&&ne[E].s===ne[b].s;E++){let M=ie.get(ne[E].col);M!=null&&(m=Math.max(m,M+vn))}let v=new Set;for(let M=b;M<E;M++){let D=ne[M],L=v.has(D.col)?ie.get(D.col)+vn:m;v.add(D.col),ie.set(D.col,L+D.h)}$e.set(ne[b].s,m),ne[b].s>0&&$.hours.push({key:`${f.date}|hour|${ne[b].s}`,y:m+2,label:ze(ne[b].s)}),at=m,b=E}ie.clear(),ne.forEach((b,E)=>{let m=ie.get(b.col),v=Math.max(m!=null?m+vn:S,$e.get(b.s));ie.set(b.col,v+b.h);let M=b.kind==="busy"?b.busy.end:b.kind==="act"?W.get(b.item.event??"")?.end??null:b.kind==="own"?ke(b.event)[1]:null;ue.push({col:b.col,s:b.s,end:M,y:v,h:b.h,box:null}),$.anchors.push({t:H+b.s,y:v});let D=c.get(b.col);if(b.kind==="busy"){let L={key:`${f.date}|busy|${b.col}|${E}`,x:D.x+1,y:v,w:D.w-2,h:b.h,labelY:8,label:eo(b.busy,!0)};$.busy.push(L),ue[ue.length-1].box=L}else if(b.kind==="out"){let L=b.out,N=io(L.lines),U=N?L.lines.slice(0,-1):L.lines;$.trips.push({key:`${f.date}|trip|${b.col}|${E}`,x:D.x+8,y:v,w:D.w-16,h:b.h,target:he(L.target),l1:N?`${L.lead} · home ${N}`:L.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...U.map(B=>({text:ro(B),warn:!1})),...L.warn?[{text:L.warn,warn:!0}]:[]],kids:L.kids.map(B=>(u.get(B)??ce(0)).color),bad:!!L.warn,aria:`${g(b.col)}: ${L.lead}. ${L.lines.join(". ")}${L.warn?`. ${L.warn}`:""}`})}else if(b.kind==="own"){let L=J(b.event,D.x+8,v,D.w-16,b.h,!1,!0,b.col);$.cards.push(L),ue[ue.length-1].box=L}else if(b.kind==="act"){let L=W.get(b.item.event??""),N=J(L,D.x,v,D.w,b.h,b.item.clash,!0,b.col);$.cards.push(N),ue[ue.length-1].box=N}else{let L=f.rides[b.item.ride??-1],N=oi(z(L.index),y),U=g(L.driver);$.rides.push({key:`${f.date}|ride|${L.index}`,x:D.x,y:v,w:D.w,h:b.h,target:Z(L.index),l1:`${Nt} with ${U}`,l2:N.join(" → "),show2:!1,lines2:fo,dashed:!0,clash:b.item.clash,aria:`${A(b.col)} riding along with ${U}, ${F(de(L.start))} to ${F(de(L.end))}: ${N.join(" to ")}`})}});let Re=S;for(let b of ie.values())Re=Math.max(Re,b);for(let b of ue){if(!b.box||b.end==null)continue;let E=b.y+b.h;for(let m of ue)m.col!==b.col&&m.s>=b.s&&m.s<b.end&&(E=Math.max(E,m.y+m.h));b.end>=1440&&(E=Re);for(let m of ue)m.col===b.col&&m.y>b.y&&(E=Math.min(E,m.y-vn));E=Math.min(E,Re),E>b.y+b.h&&(b.box.h=E-b.y)}_=Re+si+6,$.anchors.push({t:H+1439,y:_})}),$.height=_,$}var Wa=["","¼","½","¾"];function Ze(i){return i.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Pt(n);let o=Math.round(n*4),s=Math.floor(o/4),r=Wa[o%4];return`${s||!r?s:""}${r} min`})}function mo(i){let t=e=>e?{...e,text:Ze(e.text)}:null;return{...i,days:i.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(s=>({...s,lines:s.lines.map(Ze),warn:s.warn==null?s.warn:Ze(s.warn)}))}])),issues:e.issues.map(n=>({...n,title:Ze(n.title),body:Ze(n.body),note:n.note==null?n.note:Ze(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Ze(o.note)}))}:{}}))}))}}var Va=2,Ga=48;function bo(i,t,e=Ga){let n=[],o=new Set(ye(i)),s=Ee(i).map(u=>fe(i,u)),r=s.length>1?s.slice(0,2):[s[0]??"Ava","Ben"],a=0,c=0,h=0,d=0,l=t.minutes+e*60;for(let u of i.days){let y=Me(t.date,u.date),A=y===0?"":`${me(u.date)} · `,g=new Map(u.events.map(f=>[f.id,f])),$=f=>f&&g.has(f)?{day:u.date,event:f}:null,_=(f,O)=>y*1440+(f??g.get(O??"")?.start??0)<l;for(let f of u.issues)if(f.level==="problem"){if(!_(f.at,f.event)){h++,f.kind==="unassigned"&&d++;continue}a++,f.kind==="unassigned"&&c++,n.push({key:`${u.date}|${f.key}`,tone:f.kind==="unassigned"?"unassigned":"problem",title:A+f.title,body:f.body,target:$(f.event),suggestions:(f.suggestions??[]).map(O=>({id:O.id,label:O.label,note:O.note}))})}if(u.clashes.forEach((f,O)=>{if(!_(f.a.start,f.a.event)){h++;return}a++;let H=g.get(f.a.event??""),W=fe(i,f.kid),he=(k,x)=>{let C=$(x);return C?{text:k,target:C}:k},w=[];if(f.b.type==="act"){let k=g.get(f.b.event??"");H&&k&&(w=[he(H.title,H.id),` ${F(H.start)}–${F(H.end)} and `,he(k.title,k.id),` ${F(k.start)}–${F(k.end)} overlap.`])}else{let k=u.rides[f.b.ride??-1];H&&k&&(w=[`${W} is in `,he(`${pe(i,k.driver)}’s car`,k.serves[0]),` ${F(de(f.b.start))}–${F(de(f.b.end))}, during `,he(H.title,H.id),"."])}n.push({key:`${u.date}|clash|${O}`,tone:"problem",title:`${A}${W} is double-booked`,body:w.map(k=>typeof k=="string"?k:k.text).join(""),parts:w,target:null,suggestions:[]})}),y>=0&&y<Va)for(let f of u.issues)f.level!=="heads_up"||!_(f.at,f.event)||n.push({key:`${u.date}|${f.key}`,tone:"heads_up",title:A+f.title,body:f.body,target:$(f.event),suggestions:[]});for(let f of u.unplaced??[]){if(!_(f.at)){h++;continue}a++;let O=f.people.map(W=>o.has(W)?pe(i,W):fe(i,W)),H=f.from_notes?"The For line in its notes":"Its title";n.push({key:`${u.date}|unplaced|${f.id}`,tone:"problem",title:`${A}${F(f.at)} ${f.title}: ${vo(f).toLowerCase()}`,body:f.reason==="unknown"&&f.word?`${H} names “${f.word}”, who isn’t anyone in the family, so ${O.length?`it’s only in ${gt(O)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:u.date,id:f.id}})}for(let f of u.events)!f.problems.length||!_(f.start)||n.push({key:`${u.date}|notes|${f.id}`,tone:"heads_up",title:`${A}Check the notes on ${Tn(i,f)}’s ${f.title}`,body:`These lines couldn’t be read: ${f.problems.join("; ")}`,target:$(f.id),suggestions:[]})}return{items:n,problems:a,unassigned:c,later:h,laterUnassigned:d}}function vo(i){return i.reason==="unknown"&&i.word?`Who is “${i.word}”?`:"Who is this for?"}function qa(i,t,e,n){let o=new Set(ye(i)),s=d=>{let l=d[0];return l==null?null:o.has(l)?ft:e.get(l)??null},r=[...(t.all_day??[]).map(d=>({key:`${t.date}|allday|${d.id}`,title:d.title,note:d.days>1?`Day ${d.day_number} of ${d.days}`:"",color:s(d.people),cancelled:d.cancelled,warn:!1,pick:null,notes:d.notes??""})),...(t.unplaced??[]).map(d=>({key:`${t.date}|unplaced|${d.id}`,title:`${F(d.at)} ${d.title}`,note:vo(d),color:null,cancelled:!1,warn:!0,pick:d.id,notes:d.notes??""}))];if(!r.length)return null;let a=Math.max(120,n-pt),c=1,h=0;for(let d of r){let l=Math.min(a,30+7*(d.title.length+(d.note?d.note.length+2:0))+(d.notes?16:0));h&&h+l>a&&(c++,h=0),h+=l}return{key:`${t.date}|allday`,h:c*_a+(c-1)*lo,chips:r}}function yo(i,t){let e=xe(i),n=null,o=s=>s.ahead>0?2:s.ongoing?1:0;for(let s of i.days){let r=Me(t.date,s.date);if(!(r<0))for(let a of ye(i))for(let c of s.drivers[a]?.outings??[]){if(c.start==null)continue;let h=r*1440+c.start;if(r*1440+de(c.end,c.start)<=t.minutes)continue;let l=h-t.minutes,u={driver:a,name:pe(i,a),date:s.date,ahead:r,start:c.start,inMinutes:l,ongoing:l<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(y=>e.get(y)??ce(0)),warn:c.warn,target:c.target&&s.events.some(y=>y.id===c.target)?{day:s.date,event:c.target}:null};(!n||o(u)<o(n)||o(u)===o(n)&&u.inMinutes<n.inMinutes)&&(n=u)}}return n}function mt(i){return i.state==="done"||i.state==="late"}var Ya=780;function Xa(i,t,e){return i.state==="open"&&!!i.for_day&&i.due===t&&e<Ya}function xo(i,t){return i.chores.map(e=>Xa(e,i.today,t)?{...e,state:"upcoming",shows_from:i.today}:e)}function wo(i){return i.state==="open"||i.state==="overdue"}function mi(i,t,e){if(mt(i)){let n=i.done_at?Ja(i.done_at,t,e):"";return i.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(i.state==="overdue")return i.missed>1?`Missed ${i.missed} times`:i.due?`Missed ${fi(i.due,t)}`:"Missed";if(i.state==="upcoming"){if(i.for_day)return`From 1 PM · for ${fi(i.for_day,t)}`;let n=i.shows_from??i.due;if(!i.due||!n||i.due<=n)return"";let o=Me(t,i.due);return`By ${o===1?"tomorrow":o<7?me(i.due):gi(i.due)}`}if(i.for_day&&i.due===t)return`Tonight · for ${fi(i.for_day,t)}`;if(i.due&&i.due>t){let n=Me(t,i.due);return n===1?"By tomorrow":`By ${n<7?me(i.due):gi(i.due)}`}return i.missed?`Today · missed ${i.missed===1?"once":`${i.missed} times`} before`:"Today"}function fi(i,t){let e=Me(t,i);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?me(i):gi(i)}function gi(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Ja(i,t,e){let n=new Date(i);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let s=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return s===t?r:`${me(s)} ${r}`}function ko(i,t,e=1440){let n=xo(i,e).sort((o,s)=>o.order-s.order);return i.kids.map((o,s)=>{let r=n.filter(d=>d.kid===o.id),a=new Map;for(let d of r){if(d.state!=="upcoming")continue;let l=d.shows_from??d.due??i.today;a.set(l,[...a.get(l)??[],d])}let c=r.filter(d=>d.state==="overdue"),h=r.filter(d=>d.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??ce(s),overdue:c,now:h,done:r.filter(mt),later:[...a.entries()].sort(([d],[l])=>d.localeCompare(l)).map(([d,l])=>({date:d,chores:l})),left:c.length+h.length}})}function $o(i,t=1440){return xo(i,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=i.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function bi(i){return!i.chores.length&&!i.templates.length}var Qe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function vi(i){let t=i.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,s]=n.split("-").map(r=>Qe.indexOf(r.trim()));if(o===void 0||o<0||s!==void 0&&s<0)return null;if(s===void 0)e.add(o);else for(let r=0;r<=(s-o+7)%7;r++)e.add((o+r)%7)}return e}function yi(i){let t=[...new Set(i)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Qe[n[0]]}-${Qe[n.at(-1)]}`]:n.map(o=>Qe[o])).join(", ")}var et="none";function En(i){return i==="daily"||i==="school"?"":"Any"}function To(i=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:i,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Eo(i){let t=i.days??En(i.repeats),e=i.repeats==="daily"&&t!=="";return{template:i.id,repeats:e?"weekly":i.repeats,title:i.title,icon:i.icon,details:i.details??"",who:[...i.who],take_turns:!!i.take_turns,days:t,every:!e&&i.every&&i.every>0?i.every:1,paused:i.paused,night_before:!!i.night_before,bring_only:!!i.bring_only}}function xi(i){return i.title.trim()?i.who.length?i.days===et?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function _o(i){return{...i.template?{template:i.template}:{},repeats:i.repeats,title:i.title.trim(),icon:i.icon??"",details:i.details.trim(),who:i.who,take_turns:i.take_turns&&i.who.length>1,days:i.repeats==="daily"?"":i.days,every:i.repeats==="school"?1:i.every,paused:i.paused,...i.repeats==="school"?{night_before:i.night_before,bring_only:i.bring_only}:{}}}function wi(i){let t=i%100;return t>=11&&t<=13?`${i}th`:`${i}${{1:"st",2:"nd",3:"rd"}[i%10]??"th"}`}function ki(i,t,e=1,n=!1,o=!1){if(i==="school"){let d=t.trim().replace(/-/g,"–"),l=o?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return n?`${l}, the night before`:l}let s={daily:"day",weekly:"week",monthly:"month"}[i],r=e>1?`every ${e} ${s}s`:`each ${s}`,a=t.trim();if(i==="daily")return e>1?`Every ${e} days`:"Every day";if(i==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(i==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let h=`${a.split(",").map(d=>{let l=d.trim();return l.toLowerCase()==="last"?"the last day":/^\d+$/.test(l)?`the ${wi(Number(l))}`:`the ${l}`}).join(" and ")} ${r}`;return h[0].toUpperCase()+h.slice(1)}function $i(i,t,e=!1){let n=i.map(s=>t.find(r=>r.id===s)?.name??s);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function Ti(i){let t=i.indexOf(":"),e=t<0?i:i.slice(0,t),n=t<0?"":i.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function _n(i,t){return`${i}|${t}`}function bt(i,t){let[e,n,o]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function Cn(i){let[t,e,n]=i.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Co(i,t){return i.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Po(i,t){return Cn(t)<5&&!Co(i,t)}function zt(i,t,e=new Map){if(!Po(i,t))return null;let n=_n(i.id,t);if(e.has(n)){let s=e.get(n);return s?{lunch:s,picked:!0}:{lunch:i.default,picked:!1}}let o=i.picks[t];return o?{lunch:o,picked:!0}:{lunch:i.default,picked:!1}}function vt(i,t){return Po(i,t)?i.menus?.[t]??null:null}var Za="From the school's menu feed.";function Qa(i){let t=i.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Za);return t.length?t.join(`
`):null}function Le(i){return i.slice(0,7)}function Pn(i){let[t,e]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Ei(i,t=1){let[e,n]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Ao(i){let t=[];for(let e=Le(i.first);e<=Le(i.last);e=Ei(e))t.push(e);return t}function Mo(i,t,e,n=new Map){let o=`${e}-01`,s=bt(o,-Cn(o)),r=[];for(;Le(s)<=e;){let a=[];for(let c=0;c<5;c++){let h=bt(s,c),d=Le(h)!==e,l=d?null:Co(t,h),u=d?null:zt(t,h,n);a.push({date:h,day:Number(h.slice(8)),outside:d,off:l?l.title:null,lunch:u?.lunch??null,picked:u?.picked??!1,menu:d?null:vt(t,h)?.dish??null,sides:d?null:Qa(vt(t,h)?.details??""),past:h<i.today,today:h===i.today})}a.some(c=>!c.outside)&&r.push(a),s=bt(s,7)}return r}function So(i){return i.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Lo(i){let t=0,e=0;for(let n of i.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Do(i,t,e,n=new Map){let o=e<780?0:1;for(let s=o;s<8;s++){let r=bt(t,s),a=zt(i,r,n);if(!a)continue;let c=Me(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":me(r),date:r,menu:vt(i,r)?.dish??null}}return null}var el={timeline:"timeline",full:"timeline",compact:"compact"};function tt(i){let t=new URLSearchParams(i),e={},n=el[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var tl=["auth_callback","code","state"];function _i(i){let t=new URLSearchParams(i);for(let n of tl)t.delete(n);let e=t.toString();return e?`?${e}`:""}function Ci(i,t=0){return i==null||!Number.isFinite(i)?t:i}function nl(i,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of i.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(i.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function il(i,t){let e=[],n=[],o=()=>{let s=n[n.length-1];s&&Ci(s.end)>t&&e.push(...n),n=[]};for(let s of i){if(s.start==null||s.end==null)continue;if(s.type==="home"||s.type==="stay"){o(),s.end>t&&e.push(s);continue}let r=n[n.length-1];r&&r.end!==s.start&&o(),n.push(s)}return o(),e}function sl(i,t){let e=new Set(i.events.filter(s=>nl(i,s)<=t).map(s=>s.id)),n=s=>Ci(i.rides[s??-1]?.end,-1)<=t,o=s=>s.type==="act"?e.has(s.event??""):n(s.ride);return{...i,events:i.events.filter(s=>!e.has(s.id)),kids:Object.fromEntries(Object.entries(i.kids).map(([s,r])=>[s,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(i.drivers).map(([s,r])=>[s,{...r,segments:il(r.segments,t),outings:r.outings.filter(a=>a.start==null||Ci(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:i.clashes.filter(s=>!o(s.a)&&!o(s.b)),issues:i.issues.filter(s=>!s.event||!e.has(s.event)),done:e.size,from:t}}function Ro(i,t){return{...i,whole_week:i.whole_week??i.days,days:i.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?sl(e,t.minutes):e)}}var Io=Ve`
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
    box-shadow: inset 5px 0 0 var(--c), 0 0 0 2px rgba(var(--rgb), 0.6), var(--shadow);
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
`;function ol(i,t,e,n,o=14){let s=i.top-o-8,r=e.h-i.bottom-o-8,a=t.h<=s,c=t.h<=r,h=n?a||!c&&s>r:!c&&(a||s>r),d=h?i.top-o-t.h:i.bottom+o,l=Math.max(8,Math.min(d,e.h-8-t.h)),u=Math.max(8,Math.min(i.x-t.w/2,e.w-8-t.w));return{left:Math.round(u),top:Math.round(l),above:h}}function Ht(i,t){for(let e of i.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var An=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?Ht(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=Ht(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let s=this.press;!s||s.el!==e||!e.isConnected||(s.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&Ht(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=Ht(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&Ht(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let s=t.dataset.note;if(!s)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=s,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let a={w:r.offsetWidth,h:r.offsetHeight},c={w:window.innerWidth,h:window.innerHeight},h=ol(e,a,c,n,o);r.style.left=`${h.left}px`,r.style.top=`${h.top}px`,r.classList.toggle("above",h.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};(()=>{if(typeof document>"u")return;let i=null,t=new Map;uo((e,n)=>{let o=`${n}|${e}`,s=t.get(o);if(s!==void 0)return s;if(!i){if(!document.body)return null;i=document.createElement("span"),i.setAttribute("aria-hidden","true"),i.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;white-space:pre;letter-spacing:normal;word-spacing:normal;text-transform:none;contain:layout style",document.body.appendChild(i)}return i.style.font=n,i.style.font?(i.style.fontVariantNumeric="tabular-nums",i.textContent=e,s=i.getBoundingClientRect().width,t.size>2e4&&t.clear(),t.set(o,s),s):null})})();var xr="mydashlight.rides.view",Oc=1100,Nc=440,jc=700,zc=3*6e4,mr=1200,Hc=450,Uc=110;function Fc(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Nn=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,br=ae`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,vr=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Kc=new URL("emoji.json",import.meta.url).href,yr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Gi=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,qi=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Wc=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Vc=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Kt={bring:"Bring",buy:"Buy"};function Gc(i,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[i];return t<=1?e:`${e}s${i==="monthly"&&t===3?" (quarterly)":i==="monthly"&&t===12?" (yearly)":""}`}function Pe(i){let t=/\p{L}|\p{N}/u.exec(i);return t?t[0].toUpperCase():"?"}function Yi(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function qc(i,t){return pi(i,t)||Ce(i).split(",")[0]}function Yc(i){let t=i.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Xc(){try{return localStorage.getItem(xr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function Jc(i){try{localStorage.setItem(xr,i)}catch{}}function Xi(i,t){return ye(i).includes(t)?pe(i,t):fe(i,t)}function Wt(i){return i.days.every(t=>!t.events.length)}var Vt=class extends Te{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=tt(location.search).view;this.urlPage=tt(location.search).page;this.urlPast=tt(location.search).past;this.urlDayPicker=tt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,s=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(s)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-s,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},zc))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??Xc(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new An(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,s]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(h=>h.id===r);(!c||(c.picks[a]??null)===s||!zt(c,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&mt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(s=>s.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=mo(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Oc)return!1;let e=this.plan;return!e||this.width-Nc>=ci(Ee(e).length,ye(e).length)}today(){return Ct(this.plan?.time_zone??Fc())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Ro(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let s=this.board,r=this.boardPlan;this.board=go(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,s&&r&&this.keepPlace(s,r,e)}return this.board}keepPlace(e,n,o){let s=this.scroller;if(!s||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||s.scrollTop<=0)return;let r=e.dayHeads.find(d=>d.date===this.pinDay)?.h??jt,a=hi(e,s.scrollTop+r+4),c=n.days[Math.floor(a/1440)]?.date,h=c?o.days.findIndex(d=>d.date===c):-1;h>=0&&(this.keepAt=h*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let s=this.scroller;if(!s||!this.board)return;let r=this.topFor(e,n);Math.abs(s.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?s.scrollTo({top:r,behavior:"smooth"}):s.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,s=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(s,ho(o,e)-ao(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let s=this.today();if(e===s.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let c=1/0;if(this.mode==="timeline"){for(let h of a.events)c=Math.min(c,h.arrive_by??h.start);for(let h of Object.values(a.drivers))for(let d of h.outings)d.start!=null&&(c=Math.min(c,d.start))}this.scrollToTime(r*1440+(Number.isFinite(c)?Math.max(0,c-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=n+1&&(o=c);this.pinDay!==o.date&&(this.pinDay=o.date);let s=null,r=this.nowSpot(),a=this.today().date;if(r){let c=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),h=c>0?"up":"down";this.board.dayHeads.some(d=>d.date===a)&&o.date!==a?s=`${h}|Today`:this.mode==="timeline"&&Math.abs(c)>e.clientHeight*.6&&(s=`${h}|${o.date===a?"Now":"Today"}`)}this.away!==s&&(this.away=s)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),s=new Map(this.choreDraft);s.set(e.id,o),this.choreDraft=s;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof se?r:new se("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??mt(e)}editMenu(e,n){let o=this.lunch?.kids??[],s=vt(e,n),r=o.filter(a=>a.id===e.id||s&&vt(a,n)?.dish===s.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:s?.dish??"",details:s?.details??"",kids:r,had:!!s,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let s=o instanceof se?o:new se("error",String(o));this.showToast(s.code==="preview"?s.message:`Couldn’t save that. ${s.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let s=new Map(this.lunchDraft);for(let r of n)s.set(_n(e,r),o);this.lunchDraft=s;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let h of n)a.delete(_n(e,h));this.lunchDraft=a;let c=r instanceof se?r:new se("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Eo(e):To(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(gr(),fr))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||xi(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(_o(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof se?n:new se("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof se?n:new se("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(s=>s.date===this.pinDay)?.h??jt;this.keepAt=n&&this.board?hi(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||Jc(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),s=this.plan;if(!o||!s)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...Ee(s),...ye(s)]);this.forPick={day:e,id:n,placed:!1,label:`${F(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}changeForPick(e,n,o){let s=e.who?.[o.event_id],r=s?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${F(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!s?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let n=this.forPick,o=this.plan;if(!n||!o||!this.backend||!e&&!n.people.length)return;let s=e?[]:n.people;this.forPick={...n,busy:!0};try{await this.backend.setPeople(n.id,s,n.scope),this.forPick=null;let r=n.label.replace(/^\S+ /,""),a=s.map(c=>Xi(o,c));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:`Saved. ${r} is in ${gt(a)}’s ${a.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let a=r instanceof se?r:new se("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}}renderForPick(e){let n=this.plan,o=e.placed?n?.days.some(_=>_.date===e.day&&_.events.some(f=>f.id===e.id)):!!this.findUnplaced(e.day,e.id),s=p`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return p`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">Who is this for?</span></div>
          ${s}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let r=e.busy,a=_=>{this.forPick&&(this.forPick={...this.forPick,..._})},c=_=>a({people:e.people.includes(_)?e.people.filter(f=>f!==_):[...e.people,_]}),h=xe(n),d=Ee(n),l=d.length>1&&d.every(_=>e.people.includes(_)),y=[...d,...ye(n)].filter(_=>e.people.includes(_)),A=y.map(_=>Xi(n,_)),g=A.length<2?A.join(""):`${A.slice(0,-1).join(", ")} & ${A[A.length-1]}`,$=(_,f,O,H)=>p`<button
      type="button"
      class="who-chip"
      style="--c:${O.color};--rgb:${O.rgb}"
      aria-pressed=${e.people.includes(_)?"true":"false"}
      ?disabled=${r}
      @click=${()=>c(_)}
    >
      <span class="avatar ${H?"driver":""}" aria-hidden="true">${Pe(f)}</span>${f}
    </button>`;return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">Who is this for?</span>
          <span class="ed-meta">${Ce(e.day)} · ${e.label}</span>
        </div>
        ${s}
      </div>
      ${e.word?p`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:T}
      ${e.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${r} @click=${()=>a({scope:"this"})}>
                Just ${me(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${r} @click=${()=>a({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:T}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${d.map(_=>$(_,fe(n,_),h.get(_)??ce(0),!1))}
        </div>
        ${d.length>1?p`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${l?"true":"false"}
              ?disabled=${r}
              @click=${()=>a({people:l?e.people.filter(_=>!d.includes(_)):[...d,...e.people.filter(_=>!d.includes(_))]})}
            >
              All the kids
            </button>`:T}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${ye(n).map(_=>$(_,pe(n,_),ft,!0))}
        </div>
      </div>
      <p class="field-hint">
        ${y.length?p`Saved in the event’s notes as <strong>For: ${g}</strong>, so its title stays as it is. It shows in ${y.length>1?"their lanes":`${A[0]}’s lane`}${y.some(_=>d.includes(_))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?p`<button type="button" class="chip clear" ?disabled=${r} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!y.length} @click=${()=>void this.saveForPick()}>
          ${r?"Saving to Google Calendar…":y.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderForLine(e,n,o){let s=e.who?.[o.event_id];if(!s)return T;let r=s.people.map(a=>Xi(e,a));return p`<span class="ed-for"
      >For ${gt(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,n,o)}>Change</button></span
    >`}findEvent(e){let n=this.plan?.days.find(s=>s.date===e.day),o=n?.events.find(s=>s.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(s){let r=s instanceof se?s:new se("error",String(s));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,s){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&s.includes(e.drop)){s.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let s=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>s.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>s.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let s=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,a,()=>s.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,s;n<0?s=(o??e.start)-5:s=o==null||o+5>=e.start?null:o+5,this.arriveDraft=s,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),mr)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let s=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>s.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,s;o==null?s=n<0?Math.max(e.start+5,e.end-15):null:n<0?s=Math.max(e.start+5,o-5):s=o+5>=e.end?null:o+5,this.leaveDraft=s,this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),mr)}clearLeave(){this.leaveDraft=null,this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let s=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>s.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,Uc)},Hc)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),s=o?bo(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?$o(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],c=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,h=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",d=p`<aside class="panel" aria-label=${h}>
      ${c??(this.sel&&e?this.renderEditor(e):this.renderAttention(s,a))}
    </aside>`,l=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<jc?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,s,a.length)} ${l?this.renderBanner(e):T}
          <main>
            ${l?p`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Wt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Wt(o)?this.renderDayRail(o):T}
                  ${n&&this.away?this.renderBackToToday(this.away):T}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${d}`:T}
          </main>
        </div>
        ${r?d:T}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:T}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let s=n.problems+o;this.tick;let r=this.today(),a="";if(e){let u=e.time_zone,y=new Date(e.updated);this.error?a=p`<span class="bad">${_s(this.error)} · showing the plan from ${nn(y,new Date,u)}</span>`:e.status&&!e.status.ok?a=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${nn(y,new Date,u)}</span>`:this.backend?.live||(a=`Updated ${nn(y,new Date,u)}`)}let c=(u,y,A,g)=>p`
      <button type="button" class="seg-btn" title=${g} aria-pressed=${this.mode===u?"true":"false"} @click=${()=>this.setMode(u)}>
        ${A}<span class="seg-label">${y}</span>
      </button>
    `,h=(u,y,A)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===u?"true":"false"} @click=${()=>this.setPage(u)}>
        ${A}<span class="seg-label">${y}</span>
      </button>
    `,d=ze(r.minutes),l=!!e&&Wt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ae`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:T}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ce(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Ce(r.date)}${typeof a=="string"&&a?p`<span class="status"> · ${a}</span>`:T}
          </p>
          ${a&&typeof a!="string"?p`<p class="status">${a}</p>`:T}
        </div>
        ${e&&!l?this.renderNext(e,yo(e,r),n):T}
        <div class="controls">
          ${this.wide||l&&!o?T:p`<button type="button" class="attn-btn ${s?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${s}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?T:p`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${h("rides","Rides",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${h("chores","Chores",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?T:h("lunch","Lunch",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let h=this.today().date,d=o.unassigned,l=o.laterUnassigned;if(d){let y=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?p`<div class="next idle needs">${y}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${y}</button>`}if(l)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${l} ${l===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let u=e.days.some(y=>y.date>=h&&y.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${u?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${u?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let s;n.ongoing?s="On the road now":n.ahead===0?s=n.inMinutes<180?`Next trip · in ${Pt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?s="Next trip · tomorrow":s=`Next trip · ${me(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=p`
      <span class="next-eyebrow">${s}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Pe(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(h=>p`<span class="kid-dot" style="background:${h.color}"></span>`)}</span>
        ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:T}
      </span>
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?p`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:p`<div class=${c}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return T;let n=this.today().date,o=xe(e),s=this.railShown;return p`<div
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
        ${e.days.map(r=>{let a=ui(r),c=r.events.length,h=r.events.slice(0,4).map(l=>l.own?ft.color:o.get(l.kid)?.color??ce(0).color),d=`${Ce(r.date)}: ${c?`${c} ${c===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return p`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${d}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":me(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${h.length?h.map(l=>p`<span class="rd-dot" style="background:${l}"></span>`):p`<span class="rd-free">free</span>`}
            </span>
            ${a?p`<span class="rd-badge" aria-hidden="true">${a}</span>`:T}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return p`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${ae`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=Ee(e),o=ye(e),s=xe(e),r=n.map(a=>fe(e,a));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>ae`<circle cx=${50+c*30} cy="80" r="11" fill=${s.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Yc(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=s.get(a);return p`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Pe(fe(e,a))}</span>
            <span class="qw-name">${fe(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Pe(pe(e,a))}</span>
            <span class="qw-name">${pe(e,a)}</span>
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
    </div>`:T}renderEmpty(){return this.error?p`<div class="empty-state">
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
          <span class="label">${e.label}</span>${e.tag?p`<span class="tag">${e.tag}</span>`:T}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
      </div>
      ${e.allDay.length?p`<div class="day-strip" style="padding-left:${pt}px">
            ${e.allDay.map(o=>{let s=p`<span class="strip-title">${o.title}</span>${o.note?p`<span class="strip-note">${o.note}</span>`:T}${o.notes?br:T}`,r=o.pick;return r?p`<button
                    type="button"
                    class="strip-chip warn plain pick"
                    tabindex=${n?-1:0}
                    data-note=${o.notes||T}
                    aria-label=${`${o.title}: ${o.note} Pick who it’s for`}
                    @click=${()=>this.openForPick(e.date,r)}
                  >
                    ${s}
                  </button>`:p`<span
                    class="strip-chip ${o.warn?"warn":""} ${o.cancelled?"skipped":""} ${o.color?"":"plain"} ${o.notes?"noted":""}"
                    style=${o.color?`--c:${o.color.color};--rgb:${o.color.rgb};--ink:${o.color.ink}`:""}
                    tabindex=${o.notes&&!n?0:T}
                    data-note=${o.notes||T}
                    >${s}</span
                  >`})}
          </div>`:T}`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,s=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(l=>!l.own&&l.event_id===o.event.event_id).map(l=>l.id):[]),r=l=>!!l&&!!n&&l.day===n.day&&s.has(l.event),a=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],c=e.width,h=100,d=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??h-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??h})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??h+1}))].sort((l,u)=>l.z-u.z);return p`
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
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0,l.w-58-l.name.length*10.6):T}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        ${a?p`<div class="pinned" aria-hidden="true" style="width:${c}px;height:${a.h}px;margin-bottom:${-a.h}px">
              ${this.renderHead(a,!0)}
            </div>`:T}
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
          ${Ne(e.bands,l=>l.key,l=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Ne(e.busy,l=>l.key,l=>p`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Ne(e.windows,l=>l.key,l=>p`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Ne(d,l=>l.x.key,l=>{if(l.t==="link"){let g=l.x;return p`<div
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
                  <span class="l1">${g.l1}</span>${g.show2?p`<span class="l2" style="-webkit-line-clamp:${g.lines2}">${g.l2}</span>`:T}
                </button>`}let u=l.x,y=u.color,A=u.skipped?`repeating-linear-gradient(135deg, rgba(${y.rgb},0.10) 0px, rgba(${y.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:u.stayed?`repeating-linear-gradient(135deg, rgba(${y.rgb},0.24) 0px, rgba(${y.rgb},0.24) 6px, rgba(${y.rgb},0.08) 6px, rgba(${y.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${y.rgb},0.15), rgba(${y.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${u.wrap?"wrap":""} ${r(u.target)?"sel":""} ${u.clash?"clash":""} ${u.skipped?"skipped":""} ${u.cut?"cut":""} ${u.event.notes?"noted":""}"
                aria-label=${u.aria}
                data-note=${u.event.notes||T}
                style="left:${u.x}px;top:${u.y}px;width:${u.w}px;height:${u.h}px;background:${A};border-color:${u.clash?"var(--bad)":`rgba(${y.rgb},0.45)`};--c:${y.color};--rgb:${y.rgb};--ring:${y.color}"
                @click=${()=>this.open(u.target)}
              >
                ${u.event.notes?br:T}
                <span class="top">
                  <span class="title">${u.title}</span>
                  <span class="time">${u.time}${u.inline&&u.drop?p`<span class="line tone-${u.drop.tone} inline"> · ${u.drop.text}</span>`:T}</span>
                  ${u.showDrop&&u.drop&&!u.inline?p`<span class="line tone-${u.drop.tone}">${u.drop.text}</span>`:T}
                </span>
                ${u.showPick&&u.pick?p`<span class="line tone-${u.pick.tone}">${u.pick.text}</span>`:T}
              </button>`})}
          ${Ne(e.stays,l=>l.key,l=>p`<button
                type="button"
                class="stay ${l.cut?"cut":""}"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Ne(e.trips,l=>l.key,l=>p`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(u=>p`<span class="kid-dot" style="background:${u}"></span>`)}</span>
                ${l.show2?p`<span class="l2">${l.l2}</span>`:T}
                ${l.stops?l.stops.map(u=>p`<span class="stop ${u.warn?"warn":""}">${u.text}</span>`):T}
                ${l.show3?p`<span class="l3">${l.l3}</span>`:T}
              </button>`)}
          ${Ne(e.overlaps,l=>l.key,l=>p`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Ne(e.marks,l=>l.key,l=>p`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${c-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:T}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:s,later:r}=e,a=this.plan,c=s+n.length,h=this.chores,d=!!h&&!bi(h);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?T:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?p`<div class="attn-chores">${n.map(l=>this.renderChoreRow(l,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!s?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${ae`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Wt(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:T}
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
              </div>`:T}
        </div>`)}
      ${this.wide&&a&&!Wt(a)&&this.page==="rides"?this.renderLegend():T}
    `}kidColorOf(e){let n=this.plan?xe(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(s=>s.id===e)??-1;return ce(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let s=this.lunch,r=s?.kids.find(l=>l.id===e);if(!s||!r)return T;this.tick;let a=this.today(),c=Do(r,a.date,a.minutes,this.lunchDraft);if(!c)return T;let h=Kt[c.lunch],d=`${h} lunch ${c.when}${c.menu?`: ${c.menu}`:""}`;return n&&o<36+h.length*7.4?p`<span class="lunch-chip ${c.lunch} small icon" role="img" aria-label=${d} title=${d}
        >${c.lunch==="bring"?Gi:qi}</span
      >`:p`<span class="lunch-chip ${c.lunch} ${n?"small":""}" title=${d}
      >${c.lunch==="bring"?Gi:qi}<span class="lunch-chip-text"
        >${h}${n?T:` ${c.when}`}${!n&&c.menu?p`<span class="lunch-chip-menu"> · ${c.menu}</span>`:T}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Ao(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Le(e.today),s=n.indexOf(o),r=d=>{let l=n[s+d];l&&(this.lunchMonth=l)},a=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(d=>d.id===a):e.kids,h=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:T;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${s<=0} @click=${()=>r(-1)}>
            ${ae`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Pn(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${s<0||s>=n.length-1} @click=${()=>r(1)}>
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
          ${this.menuMode?"Done":p`${vr} Edit menus`}
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
    </div>`}renderLunchCard(e,n,o,s){let r=this.kidColorOf(n.id),a=Mo(e,n,o,this.lunchDraft),c=Lo(a),h=a.flat(),d=h.filter(g=>!g.outside&&!g.past&&g.lunch),l=n.days_off.filter(g=>Le(g.first)<=o&&o<=Le(g.last)),u=g=>d.filter($=>Cn($.date)===g),y=g=>{let $=u(g);if(!$.length)return;let _=$.every(f=>f.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(f=>f.date),_)},A=d.length?`${c.bring} Bring · ${c.buy} Buy${o===Le(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${s?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Pe(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${A}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Kt[n.default]} unless picked</span>
          ${e.kids.length<2?T:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${s?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=s?null:n.id}
              >
                ${s?Vc:Wc}${s?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:T}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${Pn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((g,$)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!u($).length}
            aria-label=${`${u($).every(_=>_.lunch==="bring")?"Buy":"Bring"} every ${g} left in ${Pn(o)} for ${n.name}`}
            @click=${()=>y($)}
          >
            ${g}
          </button>`)}
        ${h.map(g=>this.renderLunchCell(n,g,s))}
      </div>
      ${l.length?p`<p class="lunch-offs">
            No school:
            ${l.map(g=>{let $=g.first<`${o}-01`?`${o}-01`:g.first,_=Le(g.last)>o?bt(`${Ei(o)}-01`,-1):g.last;return`${$===_?Yi($):`${Yi($)}–${Yi(_)}`} ${So(g.title)}`}).join(" · ")}
          </p>`:T}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return p`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let s=n.lunch,r=s==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,h=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${Ce(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Ce(n.date)}: ${Kt[s]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Kt[r]}.`;return p`<button
      type="button"
      class="lunch-day ${s} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${h?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${s==="bring"?Gi:qi}${Kt[s]}</span>
      ${n.menu?p`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?p`<span class="lunch-sides">${n.sides}</span>`:T}`:c?p`<span class="lunch-menu add">${Nn} Menu</span>`:T}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,s=this.choreDone(e),r=o.kids.findIndex(_=>_.id===e.kid),a=(this.plan?xe(this.plan).get(e.kid):void 0)??ce(Math.max(0,r)),c=o.kids[r]?.name??"",h=s===mt(e)?e:{...e,state:s?"done":"open",done_at:s?new Date().toISOString():null},d=s&&h.done_by&&h.done_by!==e.kid?o.people?.find(_=>_.id===h.done_by)?.name??h.done_by_name??null:null,l=`${mi(h,o.today,o.time_zone)}${d?` · by ${d}`:""}`,u=s||wo(e),y=`${n?`${c}: `:""}${e.title}. ${l?`${l}. `:""}${s?"Done. Tap to undo.":"Tap when it’s done."}`,A=p`<span class="box" aria-hidden="true"
        >${s?ae`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:T}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:T}
      <span class="chore-text">
        <span class="chore-title">${n?p`<span class="chore-kid">${c}</span> · `:T}${e.title}</span>
        ${l?p`<span class="chore-note">${l}</span>`:T}
      </span>`,g=`chore ${s?"done":""} ${e.state==="overdue"&&!s?"overdue":""} ${u?"":"later"}`,$=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return u?p`<button type="button" class=${g} style=${$} aria-pressed=${s?"true":"false"} aria-label=${y} @click=${()=>this.tapChore(e)}>
          ${A}
        </button>`:p`<div class=${g} style=${$}>${A}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(bi(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Nn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:T;this.tick;let s=ko(e,this.plan?xe(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Nn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${vr} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${s.length}">
        ${s.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return p`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Pe(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:T}
            ${r.now.length?p`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:T}
            ${r.done.length?p`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:T}
            ${r.later.map(c=>p`<h3 class="chore-group">${c.date===e.today?"Later today":qc(c.date,e.today)}</h3>
                ${c.chores.map(h=>this.renderChoreRow(h))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?p`<p class="chore-none">No chores this week.</p>`:T}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,s=this.plan?xe(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(Ti).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${$i(e.who,o,e.take_turns)} · ${ki(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:T}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let h=o.findIndex(l=>l.id===c),d=s?.get(c)??ce(Math.max(0,h));return p`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Nn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,s])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?p`<section class="manage-group" aria-label=${s}>
                  <h3 class="chore-group">${s}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:T}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return p``;let o=n.kids,s=this.plan?xe(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(g=>g.id===e.template):void 0,c=xi(e),h=(a?.problems??[]).filter(g=>g!=="who:"),d=(g,$,_,f=!1)=>p`<button type="button" class="choice ${f?"wide":""}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${_}>${$}</button>`,l=(g,$,_,f)=>p`<button type="button" class="chip" aria-pressed=${g?"true":"false"} aria-label=${f??T} ?disabled=${r} @click=${_}>${$}</button>`,u=g=>{g!==e.repeats&&this.changeDraft({repeats:g,days:a&&a.repeats===g?a.days??En(g):En(g)})},y=g=>{let $=e.who.includes(g)?e.who.filter(_=>_!==g):o.filter(_=>_.id===g||e.who.includes(_.id)).map(_=>_.id);this.changeDraft({who:$})},A;if(e.repeats==="school"){let g=e.days===et?new Set:e.days===""?new Set([0,1,2,3,4]):vi(e.days)??new Set,$=_=>{let f=new Set(g);f.has(_)?f.delete(_):f.add(_),this.changeDraft({days:f.size===5?"":f.size?yi(f):et})};A=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Qe.slice(0,5).map((_,f)=>l(g.has(f),_.slice(0,2),()=>$(f),_))}
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
        </div>`}else if(e.repeats==="monthly"){let g=e.days.trim(),$=/^\d+$/.test(g)?Number(g):null,_=g&&g.toLowerCase()!=="any"&&g.toLowerCase()!=="last"&&$===null;A=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${_?4:3}, minmax(0, 1fr))">
          ${d(g===""||g.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${d(g.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${_?d(!0,g,()=>{}):T}
        </div>
        ${$!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${wi($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${g.toLowerCase()==="last"?"Due on the month’s last day.":_?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")A=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let g=e.days===""||e.days.toLowerCase()==="any",$=e.days===et?new Set:g?new Set:vi(e.days)??new Set,_=f=>{let O=new Set($);O.has(f)?O.delete(f):O.add(f),this.changeDraft({days:O.size?yi(O)||"Mon-Sun":et})};A=p`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(g,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!g,"On set days",()=>this.changeDraft({days:g?"Sat":e.days}))}
        </div>
        ${g?p`<p class="field-hint">Shows all week, due on Sunday.</p>`:p`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Qe.map((f,O)=>l($.has(O),f.slice(0,2),()=>_(O),f))}
              </div>
              <div class="chips">
                ${l(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${l(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?$i(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===et?"No days picked":ki(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${h.length?p`<p class="field-hint bad">${h.map(Ti).join(". ")}. Saving fixes it.</p>`:T}
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
          ${yr.map(g=>l(e.icon===g,g,()=>this.changeDraft({icon:e.icon===g?null:g}),`Picture ${g}`))}
          ${e.icon&&!yr.includes(e.icon)?l(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):T}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${Kc}
              @emoji-click=${g=>{let $=g.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:T}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((g,$)=>{let _=s?.get(g.id)??ce($),f=e.who.includes(g.id);return p`<button type="button" class="who-chip" style="--c:${_.color};--rgb:${_.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${r} @click=${()=>y(g.id)}>
              <span class="avatar" aria-hidden="true">${Pe(g.name)}</span>${g.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${d(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${d(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:T}
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
      ${A}
      ${e.repeats==="school"?T:p`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Gc(e.repeats,e.every)}</span>
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
            </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return p``;let o=e.busy,s=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>s({kids:e.kids.includes(d)?e.kids.filter(l=>l!==d):[...e.kids,d]}),a=n.kids.filter(d=>zt(d,e.date)),c=e.dish.trim(),h=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return p`
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
          @input=${d=>s({dish:d.target.value})}
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
          @input=${d=>s({details:d.target.value})}
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
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!h} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":h??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return p``;let o=n.people?.length?n.people:n.kids.map(l=>({...l,role:"kid"})),s=n.kids.findIndex(l=>l.id===e.kid),r=n.kids[s],a=this.plan?xe(this.plan):void 0,c=a?.get(e.kid)??ce(Math.max(0,s)),h=o.filter(l=>l.id!==e.kid),d=l=>{let u=n.kids.findIndex(y=>y.id===l.id);return u>=0?(a?.get(l.id)??ce(u)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${mi(e,n.today,n.time_zone)}</span>
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
    </div>`}ownHint(e,n){let o=Tn(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${F(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${F(n.start)} to ${F(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let s=n.along.map(r=>ye(e).includes(r)?pe(e,r):fe(e,r));return`${o} drives there and back${s.length?`, with ${gt(s)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:o,event:s}=n,r=ye(e),a=co(e,s),c=Tn(e,s),h=!!this.pending,d=E=>this.pending?.key===E?this.pending.value:void 0,l=[...e.people?.carpools??[]];for(let E of e.days)for(let m of E.events)for(let v of[m.drop,m.pick])v&&v!=="none"&&!r.includes(v)&&!l.some(M=>M.toLowerCase()===v.toLowerCase())&&l.push(v);let u=E=>{if(!s.sides.includes(E))return T;let m=d(E)??d("both"),v=E==="drop"?s.drop:s.pick,M=m!==void 0?String(m):s.no_ride_unless_named&&v==="none"?"":v,D=M===""&&!(m===void 0&&s.no_ride_unless_named),L=M&&M!=="none"&&!r.includes(M)?M:"",N=G=>{this.otherOpen=null,this.setRide(s,E,M===G?"":G,r)},U=[...r.map(G=>[G,di(e,G)]),["none","Not needed"]],B=`${s.id}|${E}`,oe=this.otherOpen===B;return p`<div class="field ride-box">
        <span class="field-label">${E==="drop"?"Drop-off":"Pick-up"} ${D?p`<span class="nobody">· nobody yet</span>`:T}</span>
        <div role="group" aria-label=${E==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${U.length+1}, minmax(0, 1fr))">
          ${U.map(([G,ve])=>p`<button type="button" class="choice" aria-pressed=${M===G?"true":"false"} ?disabled=${h} @click=${()=>N(G)}>
                ${ve}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${L?"true":"false"}
            aria-expanded=${oe?"true":"false"}
            ?disabled=${h}
            @click=${()=>this.otherOpen=oe?null:B}
          >
            ${L||"Other"}
          </button>
        </div>
        ${oe?p`${l.length?p`<div role="group" aria-label=${E==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${l.map(G=>p`<button type="button" class="chip" aria-pressed=${M.toLowerCase()===G.toLowerCase()?"true":"false"} ?disabled=${h} @click=${()=>N(G)}>
                    ${G}
                  </button>`)}
            </div>`:T}
        <input
          type="text"
          .value=${L&&!l.some(G=>G.toLowerCase()===L.toLowerCase())?L:""}
          ?disabled=${h}
          aria-label=${E==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${G=>{let ve=G.target.value.trim();ve&&ve!==M&&N(ve)}}
          @keydown=${G=>{G.key==="Enter"&&G.target.blur()}}
        />`:T}
        ${!_&&M!==""&&M!=="none"?y(E,M):T}
      </div>`},y=(E,m)=>{let v=d(`along-${E}`),M=v!==void 0?v:E==="pick"?s.pick_along??[]:s.along,D=new Set(o.events.filter(U=>U.event_id===s.event_id&&!U.own).map(U=>U.kid)),L=[...Ee(e).filter(U=>U!==s.kid&&!D.has(U)),...r.filter(U=>U!==m)];return L.length?p`<div class="field-sub">
        <span class="field-label">${E==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${E==="pick"?"Coming home too. Anyone already there just gets in.":E==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${E==="drop"?"Riding along on the drop-off":E==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${L.map(U=>p`<button type="button" class="chip" aria-pressed=${M.includes(U)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,U,E)}>
              ${r.includes(U)?pe(e,U):fe(e,U)}
            </button>`)}
        </div>
      </div>`:T},A=r.includes(s.drop)?s.drop:r.includes(s.pick)?s.pick:"",g=s.drop===s.pick&&r.includes(s.drop),$=d("stay"),_=$!==void 0?!!$:s.stay&&g,f=d("along"),O=f!==void 0?f:s.along,H=s.own?[...Ee(e),...r.filter(E=>E!==s.own)]:[],W=s.own!=null&&s.takes!=null,he=s.own!=null&&!W,w=d("takes"),k=w!==void 0?w:s.takes??null,x=d("arrive"),C=this.arriveDraft!==void 0?this.arriveDraft:x!==void 0?x:s.arrive_by,P=d("leave"),S=this.leaveDraft!==void 0?this.leaveDraft:P!==void 0?P:s.leave_by??null,j=(E,m)=>{let v=E==="arrive",M=L=>()=>v?this.nudgeArrive(s,L):this.nudgeLeave(s,L),D=(L,N,U,B)=>p`<button
          type="button"
          class="step"
          aria-label=${N}
          ?disabled=${h||B}
          @pointerdown=${()=>this.startHold(M(L))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(M(L))}
        >
          ${U}
        </button>`;return p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${v?"Arrive by":"Leave by"}</span>
          <span class="field-hint">${v?`${s.start-m} min before it starts`:`${s.end-m} min before it ends`}</span>
        </span>
        <span class="stepper">
          ${D(-5,"Five minutes earlier","−",!v&&m-5<=s.start)}
          <span class="arrive-value">${F(m)}</span>
          ${D(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${v?"Clear arrive-by time":"Clear leave-by time"}
            ?disabled=${h}
            @click=${()=>v?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},V=s.sides.includes("pick")||s.own!=null,X=()=>p`${C!=null?j("arrive",C):T}
      ${S!=null?j("leave",S):T}
      ${C==null||S==null&&V?p`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${C==null?p`<button type="button" class="chip" ?disabled=${h} @click=${()=>this.nudgeArrive(s,-5)}>Arrive early</button>`:T}
              ${S==null&&V?p`<button type="button" class="chip" ?disabled=${h} @click=${()=>this.nudgeLeave(s,-5)}>Leave early</button>`:T}
            </div>
          </div>`:T}`,J=s.sides.includes("drop")&&s.sides.includes("pick"),z=J&&(_||this.stayDraft===s.id),Z=()=>{let E=J?p`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${z?"false":"true"}
              ?disabled=${h}
              @click=${()=>{this.stayDraft=null,s.stay&&this.toggleStay(s,!1,A)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${z?"true":"false"}
              ?disabled=${h}
              @click=${()=>{A?this.toggleStay(s,!0,A):this.stayDraft=s.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:T;if(!z)return p`${E} ${u("drop")} ${u("pick")}`;let m=_&&g?s.drop:"";return p`${E}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${m?T:p`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(v=>p`<button
                type="button"
                class="choice"
                aria-pressed=${m===v?"true":"false"}
                ?disabled=${h}
                @click=${()=>{if(m===v||!this.backend)return;let M=this.backend;this.stayDraft=null,this.save("stay",!0,()=>M.setRide(s.id,"both",v,this.scope,!0))}}
              >
                ${pe(e,v)}
              </button>`)}
          </div>
          ${m?y("both",m):T}
        </div>`},Q=[],ke=E=>E==="none"?"Not needed":di(e,E),_e=E=>r.includes(E)?pe(e,E):fe(e,E),ne=(E,m,v)=>{m===""&&!v.length||Q.push(`${E}: ${[m===""?"TBD":ke(m),...v.map(_e)].join(", ")}`)},ie=E=>s.no_ride_unless_named&&E==="none"?"":E;s.own||ne("Drop-off",ie(s.drop),s.along),s.own||ne("Pick-up",ie(s.pick),s.pick_along??[]),!s.own&&s.stay&&Q.push("Stay: yes"),W&&Q.push(`Takes: ${s.takes} min`),s.own&&s.along.length&&Q.push(`Take along: ${s.along.map(_e).join(", ")}`),s.arrive_by!=null&&Q.push(`Arrive by: ${ze(s.arrive_by)}`),s.leave_by!=null&&Q.push(`Leave by: ${ze(s.leave_by)}`);let ue=d("attending"),$e=ue!==void 0?!!ue:s.attending!==!1;s.attending===!1&&Q.splice(0,Q.length,"Attending: no");let at=o.date===this.today().date?"":`${me(o.date)} · `,Re=$n(s),b=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${s.title}</span>
          <span class="ed-meta">${at}${W?"any time ":""}${Re}${s.place_name&&!s.place.startsWith("?")?` · ${s.place_name}`:""}</span>
          ${this.renderForLine(e,o,s)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(s.busy_only){let E=s.place_name&&s.place_name!==s.title?s.place_name:"",m=s.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":s.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return p`${b}
        ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
        ${E?p`<div class="field"><span class="field-label">Where</span><span class="field-hint">${E}</span></div>`:T}
        <p class="field-hint">
          ${$e?`This blocks ${c}’s time: ${c} can’t drive then, so a ride that needs ${c} shows as a problem.`:`Not going, so it doesn’t block ${c}’s time, and ${c} can drive then.`}
          ${m}
        </p>
        <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!$e)}>
          ${$e?`${c} isn’t going this time`:`${c} is going after all`}
        </button>
        ${s.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:T}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${s.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return s.where==="home"?p`${b}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${b}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
      ${s.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${me(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:T}
      ${$e?p`${s.where==="anywhere"?p`<p class="field-hint">
                  ${s.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:T}
            ${s.own?p`<p class="field-hint">${this.ownHint(e,s)}</p>`:Z()}
      ${s.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${k!=null?`Takes ${k} min, any time ${F(s.start)}–${F(s.end)}`:"At its set time"}</span>
            </span>
            ${k!=null?p`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${h||k<=5} @click=${()=>this.setTakes(s,Math.max(5,k-5))}>−</button>
                  <span class="arrive-value">${k} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${h||k+5>s.end-s.start} @click=${()=>this.setTakes(s,k+5)}>+</button>
                </span>`:T}
          </div>
          <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setTakes(s,k!=null?null:Math.min(10,Math.max(5,s.end-s.start)))}>
            ${k!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:T}
      ${he&&H.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${H.map(E=>p`<button type="button" class="chip" aria-pressed=${O.includes(E)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(s,E)}>
                  ${r.includes(E)?pe(e,E):fe(e,E)}
                </button>`)}
            </div>
          </div>`:T}
      ${W?T:X()}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${c} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.setAttending(s,!$e)}>
        ${$e?`${c} isn’t going this time`:`${c} is going after all`}
      </button>
      ${s.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:T}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${Q.length?Q.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${$e&&!s.own?p`<p class="field-hint">Tap a selected driver again to clear it.</p>`:T}
    `}};Vt.styles=Io,Vt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Vt);function Zc(){let i=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&i.push(t.shadowRoot);return i}function wr(i=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=s=>{if(s)for(let r of Zc())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!s},o=s=>{if(clearTimeout(e),s.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),i)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),i)}function kr(i){try{return new URL(i).searchParams.get("v")}catch{return null}}function $r(i,t,e){if(!t)return()=>{};let n=e.everyMs??6e5,o=e.retryMs??3e4,s=e.idleMs??12e4,r=null,a=null,c=0,h=!1,d=A=>{if(h||a)return;let g=e.idleFor();if(g>=s){e.reload(A);return}a=setTimeout(()=>{a=null,d(A)},s-g)},l=async()=>{try{let A=await i.sendMessagePromise({type:"mydashlight/app_version"});c=0;let g=A["kiosk.js"];!h&&g&&g!==t&&d(g)}catch{if(h||r||++c>20)return;r=setTimeout(()=>{r=null,l()},o)}},u=()=>{c=0,l()};i.addEventListener?.("ready",u);let y=setInterval(()=>void l(),n);return()=>{h=!0,clearInterval(y),r&&clearTimeout(r),a&&clearTimeout(a),i.removeEventListener?.("ready",u)}}function Tr(i,t=6e4,e=15e3){let n=null,o=setInterval(()=>{if(!i.connected||n)return;let s=!1;n=setTimeout(()=>{n=null,!s&&i.connected&&i.reconnect(!0)},e);let r=()=>{s=!0,n&&clearTimeout(n),n=null};i.ping().then(r,r)},t);return()=>{clearInterval(o),n&&clearTimeout(n),n=null}}var Er=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],_r=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Cr(i,t,e,n){let o=Math.max(0,Math.min(t,i.length)),s=Math.max(o,Math.min(e,i.length));return{value:i.slice(0,o)+n+i.slice(s),caret:o+n.length}}function Pr(i,t,e){let n=Math.max(0,Math.min(t,i.length)),o=Math.max(n,Math.min(e,i.length));if(n!==o)return{value:i.slice(0,n)+i.slice(o),caret:n};if(n===0)return{value:i,caret:0};let s=Array.from(i.slice(0,n));s.pop();let r=s.join("");return{value:r+i.slice(n),caret:r.length}}function Ar(i,t){return t===0||/\s$/.test(i.slice(0,t))}var Qc=new Set(["text","search","email","url","tel","number","password"]);function Mr(i){return i instanceof HTMLTextAreaElement?!i.readOnly&&!i.disabled:i instanceof HTMLInputElement&&Qc.has(i.type)&&!i.readOnly&&!i.disabled}var ed={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},td={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Gt=class extends Te{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=Ar(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,s]=this.selection(n),r=Pr(n.value,o,s);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[s,r]=this.selection(n),a=Cr(n.value,s,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":ed[e]??(this.shift?e.toUpperCase():e);return p`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${td[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):T}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?Er:_r;return p`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>p`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};Gt.styles=Ve`
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
  `,Gt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Gt);function nd(){let i=document.activeElement;for(;i?.shadowRoot?.activeElement;)i=i.shadowRoot.activeElement;return i}function Sr(i){let t=new WeakSet,e=r=>{let a=r.composedPath();s(a);let c=a[0];Mr(c)&&i.attach(c)},n=()=>{setTimeout(()=>{let r=nd();!i.target||r===i.target||(Mr(r)?i.attach(r):i.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},s=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>s(r.composedPath()),{capture:!0}),setInterval(()=>{i.target&&!i.target.isConnected&&i.detach()},1e3)}var Ji="mydashlight",id=`/api/${Ji}/pair`,sd=`/api/${Ji}/pair/poll`,Zi=`/${Ji}`,Qi="pair";function Lr(i){return i.length>4?`${i.slice(0,4)}-${i.slice(4)}`:i}function Dr(i,t){return`${i}${Zi}?${Qi}=${encodeURIComponent(t)}`}function od(i,t,e=Date.now()){return{hassUrl:i,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var rt=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function Rr(i=fetch){let t=await i(id,{method:"POST",cache:"no-store"});if(t.status===429)throw new rt("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new rt(`Home Assistant answered ${t.status}.`);return await t.json()}async function Ir(i,t,e=fetch){let n=await e(sd,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:i})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new rt(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:od(t,o.auth)}:{status:"pending"}}var $t=function(i,t){let o=i,s=qt[t],r=null,a=0,c=null,h=[],d={},l=function(w,k){a=o*4+17,r=(function(x){let C=new Array(x);for(let P=0;P<x;P+=1){C[P]=new Array(x);for(let S=0;S<x;S+=1)C[P][S]=null}return C})(a),u(0,0),u(a-7,0),u(0,a-7),g(),A(),_(w,k),o>=7&&$(w),c==null&&(c=H(o,s,h)),f(c,k)},u=function(w,k){for(let x=-1;x<=7;x+=1)if(!(w+x<=-1||a<=w+x))for(let C=-1;C<=7;C+=1)k+C<=-1||a<=k+C||(0<=x&&x<=6&&(C==0||C==6)||0<=C&&C<=6&&(x==0||x==6)||2<=x&&x<=4&&2<=C&&C<=4?r[w+x][k+C]=!0:r[w+x][k+C]=!1)},y=function(){let w=0,k=0;for(let x=0;x<8;x+=1){l(!0,x);let C=Fe.getLostPoint(d);(x==0||w>C)&&(w=C,k=x)}return k},A=function(){for(let w=8;w<a-8;w+=1)r[w][6]==null&&(r[w][6]=w%2==0);for(let w=8;w<a-8;w+=1)r[6][w]==null&&(r[6][w]=w%2==0)},g=function(){let w=Fe.getPatternPosition(o);for(let k=0;k<w.length;k+=1)for(let x=0;x<w.length;x+=1){let C=w[k],P=w[x];if(r[C][P]==null)for(let S=-2;S<=2;S+=1)for(let j=-2;j<=2;j+=1)S==-2||S==2||j==-2||j==2||S==0&&j==0?r[C+S][P+j]=!0:r[C+S][P+j]=!1}},$=function(w){let k=Fe.getBCHTypeNumber(o);for(let x=0;x<18;x+=1){let C=!w&&(k>>x&1)==1;r[Math.floor(x/3)][x%3+a-8-3]=C}for(let x=0;x<18;x+=1){let C=!w&&(k>>x&1)==1;r[x%3+a-8-3][Math.floor(x/3)]=C}},_=function(w,k){let x=s<<3|k,C=Fe.getBCHTypeInfo(x);for(let P=0;P<15;P+=1){let S=!w&&(C>>P&1)==1;P<6?r[P][8]=S:P<8?r[P+1][8]=S:r[a-15+P][8]=S}for(let P=0;P<15;P+=1){let S=!w&&(C>>P&1)==1;P<8?r[8][a-P-1]=S:P<9?r[8][15-P-1+1]=S:r[8][15-P-1]=S}r[a-8][8]=!w},f=function(w,k){let x=-1,C=a-1,P=7,S=0,j=Fe.getMaskFunction(k);for(let V=a-1;V>0;V-=2)for(V==6&&(V-=1);;){for(let X=0;X<2;X+=1)if(r[C][V-X]==null){let J=!1;S<w.length&&(J=(w[S]>>>P&1)==1),j(C,V-X)&&(J=!J),r[C][V-X]=J,P-=1,P==-1&&(S+=1,P=7)}if(C+=x,C<0||a<=C){C-=x,x=-x;break}}},O=function(w,k){let x=0,C=0,P=0,S=new Array(k.length),j=new Array(k.length);for(let z=0;z<k.length;z+=1){let Z=k[z].dataCount,Q=k[z].totalCount-Z;C=Math.max(C,Z),P=Math.max(P,Q),S[z]=new Array(Z);for(let ie=0;ie<S[z].length;ie+=1)S[z][ie]=255&w.getBuffer()[ie+x];x+=Z;let ke=Fe.getErrorCorrectPolynomial(Q),ne=Yt(S[z],ke.getLength()-1).mod(ke);j[z]=new Array(ke.getLength()-1);for(let ie=0;ie<j[z].length;ie+=1){let ue=ie+ne.getLength()-j[z].length;j[z][ie]=ue>=0?ne.getAt(ue):0}}let V=0;for(let z=0;z<k.length;z+=1)V+=k[z].totalCount;let X=new Array(V),J=0;for(let z=0;z<C;z+=1)for(let Z=0;Z<k.length;Z+=1)z<S[Z].length&&(X[J]=S[Z][z],J+=1);for(let z=0;z<P;z+=1)for(let Z=0;Z<k.length;Z+=1)z<j[Z].length&&(X[J]=j[Z][z],J+=1);return X},H=function(w,k,x){let C=Br.getRSBlocks(w,k),P=Or();for(let j=0;j<x.length;j+=1){let V=x[j];P.put(V.getMode(),4),P.put(V.getLength(),Fe.getLengthInBits(V.getMode(),w)),V.write(P)}let S=0;for(let j=0;j<C.length;j+=1)S+=C[j].dataCount;if(P.getLengthInBits()>S*8)throw"code length overflow. ("+P.getLengthInBits()+">"+S*8+")";for(P.getLengthInBits()+4<=S*8&&P.put(0,4);P.getLengthInBits()%8!=0;)P.putBit(!1);for(;!(P.getLengthInBits()>=S*8||(P.put(236,8),P.getLengthInBits()>=S*8));)P.put(17,8);return O(P,C)};d.addData=function(w,k){k=k||"Byte";let x=null;switch(k){case"Numeric":x=rd(w);break;case"Alphanumeric":x=ad(w);break;case"Byte":x=ld(w);break;case"Kanji":x=cd(w);break;default:throw"mode:"+k}h.push(x),c=null},d.isDark=function(w,k){if(w<0||a<=w||k<0||a<=k)throw w+","+k;return r[w][k]},d.getModuleCount=function(){return a},d.make=function(){if(o<1){let w=1;for(;w<40;w++){let k=Br.getRSBlocks(w,s),x=Or();for(let P=0;P<h.length;P++){let S=h[P];x.put(S.getMode(),4),x.put(S.getLength(),Fe.getLengthInBits(S.getMode(),w)),S.write(x)}let C=0;for(let P=0;P<k.length;P++)C+=k[P].dataCount;if(x.getLengthInBits()<=C*8)break}o=w}l(!1,y())},d.createTableTag=function(w,k){w=w||2,k=typeof k>"u"?w*4:k;let x="";x+='<table style="',x+=" border-width: 0px; border-style: none;",x+=" border-collapse: collapse;",x+=" padding: 0px; margin: "+k+"px;",x+='">',x+="<tbody>";for(let C=0;C<d.getModuleCount();C+=1){x+="<tr>";for(let P=0;P<d.getModuleCount();P+=1)x+='<td style="',x+=" border-width: 0px; border-style: none;",x+=" border-collapse: collapse;",x+=" padding: 0px; margin: 0px;",x+=" width: "+w+"px;",x+=" height: "+w+"px;",x+=" background-color: ",x+=d.isDark(C,P)?"#000000":"#ffffff",x+=";",x+='"/>';x+="</tr>"}return x+="</tbody>",x+="</table>",x},d.createSvgTag=function(w,k,x,C){let P={};typeof arguments[0]=="object"&&(P=arguments[0],w=P.cellSize,k=P.margin,x=P.alt,C=P.title),w=w||2,k=typeof k>"u"?w*4:k,x=typeof x=="string"?{text:x}:x||{},x.text=x.text||null,x.id=x.text?x.id||"qrcode-description":null,C=typeof C=="string"?{text:C}:C||{},C.text=C.text||null,C.id=C.text?C.id||"qrcode-title":null;let S=d.getModuleCount()*w+k*2,j,V,X,J,z="",Z;for(Z="l"+w+",0 0,"+w+" -"+w+",0 0,-"+w+"z ",z+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',z+=P.scalable?"":' width="'+S+'px" height="'+S+'px"',z+=' viewBox="0 0 '+S+" "+S+'" ',z+=' preserveAspectRatio="xMinYMin meet"',z+=C.text||x.text?' role="img" aria-labelledby="'+W([C.id,x.id].join(" ").trim())+'"':"",z+=">",z+=C.text?'<title id="'+W(C.id)+'">'+W(C.text)+"</title>":"",z+=x.text?'<description id="'+W(x.id)+'">'+W(x.text)+"</description>":"",z+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',z+='<path d="',X=0;X<d.getModuleCount();X+=1)for(J=X*w+k,j=0;j<d.getModuleCount();j+=1)d.isDark(X,j)&&(V=j*w+k,z+="M"+V+","+J+Z);return z+='" stroke="transparent" fill="black"/>',z+="</svg>",z},d.createDataURL=function(w,k){w=w||2,k=typeof k>"u"?w*4:k;let x=d.getModuleCount()*w+k*2,C=k,P=x-k;return pd(x,x,function(S,j){if(C<=S&&S<P&&C<=j&&j<P){let V=Math.floor((S-C)/w),X=Math.floor((j-C)/w);return d.isDark(X,V)?0:1}else return 1})},d.createImgTag=function(w,k,x){w=w||2,k=typeof k>"u"?w*4:k;let C=d.getModuleCount()*w+k*2,P="";return P+="<img",P+=' src="',P+=d.createDataURL(w,k),P+='"',P+=' width="',P+=C,P+='"',P+=' height="',P+=C,P+='"',x&&(P+=' alt="',P+=W(x),P+='"'),P+="/>",P};let W=function(w){let k="";for(let x=0;x<w.length;x+=1){let C=w.charAt(x);switch(C){case"<":k+="&lt;";break;case">":k+="&gt;";break;case"&":k+="&amp;";break;case'"':k+="&quot;";break;default:k+=C;break}}return k},he=function(w){w=typeof w>"u"?2:w;let x=d.getModuleCount()*1+w*2,C=w,P=x-w,S,j,V,X,J,z={"██":"█","█ ":"▀"," █":"▄","  ":" "},Z={"██":"▀","█ ":"▀"," █":" ","  ":" "},Q="";for(S=0;S<x;S+=2){for(V=Math.floor((S-C)/1),X=Math.floor((S+1-C)/1),j=0;j<x;j+=1)J="█",C<=j&&j<P&&C<=S&&S<P&&d.isDark(V,Math.floor((j-C)/1))&&(J=" "),C<=j&&j<P&&C<=S+1&&S+1<P&&d.isDark(X,Math.floor((j-C)/1))?J+=" ":J+="█",Q+=w<1&&S+1>=P?Z[J]:z[J];Q+=`
`}return x%2&&w>0?Q.substring(0,Q.length-x-1)+Array(x+1).join("▀"):Q.substring(0,Q.length-1)};return d.createASCII=function(w,k){if(w=w||1,w<2)return he(k);w-=1,k=typeof k>"u"?w*2:k;let x=d.getModuleCount()*w+k*2,C=k,P=x-k,S,j,V,X,J=Array(w+1).join("██"),z=Array(w+1).join("  "),Z="",Q="";for(S=0;S<x;S+=1){for(V=Math.floor((S-C)/w),Q="",j=0;j<x;j+=1)X=1,C<=j&&j<P&&C<=S&&S<P&&d.isDark(V,Math.floor((j-C)/w))&&(X=0),Q+=X?J:z;for(V=0;V<w;V+=1)Z+=Q+`
`}return Z.substring(0,Z.length-1)},d.renderTo2dContext=function(w,k){k=k||2;let x=d.getModuleCount();for(let C=0;C<x;C++)for(let P=0;P<x;P++)w.fillStyle=d.isDark(C,P)?"black":"white",w.fillRect(P*k,C*k,k,k)},d};$t.stringToBytes=function(i){let t=[];for(let e=0;e<i.length;e+=1){let n=i.charCodeAt(e);t.push(n&255)}return t};$t.createStringToBytes=function(i,t){let e=(function(){let o=hd(i),s=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let h=s(),d=s(),l=s(),u=String.fromCharCode(c<<8|h),y=d<<8|l;a[u]=y,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let s=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)s.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?s.push(c):(s.push(c>>>8),s.push(c&255)):s.push(n)}}return s}};var be={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},qt={L:1,M:0,Q:3,H:2},Ue={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Fe=(function(){let i=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},s=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;s(a)-s(t)>=0;)a^=t<<s(a)-s(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;s(a)-s(e)>=0;)a^=e<<s(a)-s(e);return r<<12|a},o.getPatternPosition=function(r){return i[r-1]},o.getMaskFunction=function(r){switch(r){case Ue.PATTERN000:return function(a,c){return(a+c)%2==0};case Ue.PATTERN001:return function(a,c){return a%2==0};case Ue.PATTERN010:return function(a,c){return c%3==0};case Ue.PATTERN011:return function(a,c){return(a+c)%3==0};case Ue.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Ue.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Ue.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Ue.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=Yt([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Yt([1,Ke.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case be.MODE_NUMBER:return 10;case be.MODE_ALPHA_NUM:return 9;case be.MODE_8BIT_BYTE:return 8;case be.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case be.MODE_NUMBER:return 12;case be.MODE_ALPHA_NUM:return 11;case be.MODE_8BIT_BYTE:return 16;case be.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case be.MODE_NUMBER:return 14;case be.MODE_ALPHA_NUM:return 13;case be.MODE_8BIT_BYTE:return 16;case be.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let l=0;l<a;l+=1)for(let u=0;u<a;u+=1){let y=0,A=r.isDark(l,u);for(let g=-1;g<=1;g+=1)if(!(l+g<0||a<=l+g))for(let $=-1;$<=1;$+=1)u+$<0||a<=u+$||g==0&&$==0||A==r.isDark(l+g,u+$)&&(y+=1);y>5&&(c+=3+y-5)}for(let l=0;l<a-1;l+=1)for(let u=0;u<a-1;u+=1){let y=0;r.isDark(l,u)&&(y+=1),r.isDark(l+1,u)&&(y+=1),r.isDark(l,u+1)&&(y+=1),r.isDark(l+1,u+1)&&(y+=1),(y==0||y==4)&&(c+=3)}for(let l=0;l<a;l+=1)for(let u=0;u<a-6;u+=1)r.isDark(l,u)&&!r.isDark(l,u+1)&&r.isDark(l,u+2)&&r.isDark(l,u+3)&&r.isDark(l,u+4)&&!r.isDark(l,u+5)&&r.isDark(l,u+6)&&(c+=40);for(let l=0;l<a;l+=1)for(let u=0;u<a-6;u+=1)r.isDark(u,l)&&!r.isDark(u+1,l)&&r.isDark(u+2,l)&&r.isDark(u+3,l)&&r.isDark(u+4,l)&&!r.isDark(u+5,l)&&r.isDark(u+6,l)&&(c+=40);let h=0;for(let l=0;l<a;l+=1)for(let u=0;u<a;u+=1)r.isDark(u,l)&&(h+=1);let d=Math.abs(100*h/a/a-50)/5;return c+=d*10,c},o})(),Ke=(function(){let i=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)i[n]=1<<n;for(let n=8;n<256;n+=1)i[n]=i[n-4]^i[n-5]^i[n-6]^i[n-8];for(let n=0;n<255;n+=1)t[i[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return i[n]},e})(),Yt=function(i,t){if(typeof i.length>"u")throw i.length+"/"+t;let e=(function(){let o=0;for(;o<i.length&&i[o]==0;)o+=1;let s=new Array(i.length-o+t);for(let r=0;r<i.length-o;r+=1)s[r]=i[r+o];return s})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let s=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)s[r+a]^=Ke.gexp(Ke.glog(n.getAt(r))+Ke.glog(o.getAt(a)));return Yt(s,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let s=Ke.glog(n.getAt(0))-Ke.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=Ke.gexp(Ke.glog(o.getAt(a))+s);return Yt(r,0).mod(o)},n},Br=(function(){let i=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,s){let r={};return r.totalCount=o,r.dataCount=s,r},e={},n=function(o,s){switch(s){case qt.L:return i[(o-1)*4+0];case qt.M:return i[(o-1)*4+1];case qt.Q:return i[(o-1)*4+2];case qt.H:return i[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,s){let r=n(o,s);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+s;let a=r.length/3,c=[];for(let h=0;h<a;h+=1){let d=r[h*3+0],l=r[h*3+1],u=r[h*3+2];for(let y=0;y<d;y+=1)c.push(t(l,u))}return c},e})(),Or=function(){let i=[],t=0,e={};return e.getBuffer=function(){return i},e.getAt=function(n){let o=Math.floor(n/8);return(i[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let s=0;s<o;s+=1)e.putBit((n>>>o-s-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);i.length<=o&&i.push(0),n&&(i[o]|=128>>>t%8),t+=1},e},rd=function(i){let t=be.MODE_NUMBER,e=i,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+s(r.charAt(c));return a},s=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},ad=function(i){let t=be.MODE_ALPHA_NUM,e=i,n={};n.getMode=function(){return t},n.getLength=function(s){return e.length},n.write=function(s){let r=e,a=0;for(;a+1<r.length;)s.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&s.put(o(r.charAt(a)),6)};let o=function(s){if("0"<=s&&s<="9")return s.charCodeAt(0)-48;if("A"<=s&&s<="Z")return s.charCodeAt(0)-65+10;switch(s){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+s}};return n},ld=function(i){let t=be.MODE_8BIT_BYTE,e=i,n=$t.stringToBytes(i),o={};return o.getMode=function(){return t},o.getLength=function(s){return n.length},o.write=function(s){for(let r=0;r<n.length;r+=1)s.put(n[r],8)},o},cd=function(i){let t=be.MODE_KANJI,e=i,n=$t.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=n(i),s={};return s.getMode=function(){return t},s.getLength=function(r){return~~(o.length/2)},s.write=function(r){let a=o,c=0;for(;c+1<a.length;){let h=(255&a[c])<<8|255&a[c+1];if(33088<=h&&h<=40956)h-=33088;else if(57408<=h&&h<=60351)h-=49472;else throw"illegal char at "+(c+1)+"/"+h;h=(h>>>8&255)*192+(h&255),r.put(h,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},s},Nr=function(){let i=[],t={};return t.writeByte=function(e){i.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let s=0;s<o;s+=1)t.writeByte(e[s+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return i},t.toString=function(){let e="";e+="[";for(let n=0;n<i.length;n+=1)n>0&&(e+=","),e+=i[n];return e+="]",e},t},dd=function(){let i=0,t=0,e=0,n="",o={},s=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(i=i<<8|a&255,t+=8,e+=1;t>=6;)s(i>>>t-6),t-=6},o.flush=function(){if(t>0&&(s(i<<6-t),i=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},o.toString=function(){return n},o},hd=function(i){let t=i,e=0,n=0,o=0,s={};s.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=t.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return s},ud=function(i,t){let e=i,n=t,o=new Array(i*t),s={};s.setPixel=function(h,d,l){o[d*e+h]=l},s.write=function(h){h.writeString("GIF87a"),h.writeShort(e),h.writeShort(n),h.writeByte(128),h.writeByte(0),h.writeByte(0),h.writeByte(0),h.writeByte(0),h.writeByte(0),h.writeByte(255),h.writeByte(255),h.writeByte(255),h.writeString(","),h.writeShort(0),h.writeShort(0),h.writeShort(e),h.writeShort(n),h.writeByte(0);let d=2,l=a(d);h.writeByte(d);let u=0;for(;l.length-u>255;)h.writeByte(255),h.writeBytes(l,u,255),u+=255;h.writeByte(l.length-u),h.writeBytes(l,u,l.length-u),h.writeByte(0),h.writeString(";")};let r=function(h){let d=h,l=0,u=0,y={};return y.write=function(A,g){if(A>>>g)throw"length over";for(;l+g>=8;)d.writeByte(255&(A<<l|u)),g-=8-l,A>>>=8-l,u=0,l=0;u=A<<l|u,l=l+g},y.flush=function(){l>0&&d.writeByte(u)},y},a=function(h){let d=1<<h,l=(1<<h)+1,u=h+1,y=c();for(let f=0;f<d;f+=1)y.add(String.fromCharCode(f));y.add(String.fromCharCode(d)),y.add(String.fromCharCode(l));let A=Nr(),g=r(A);g.write(d,u);let $=0,_=String.fromCharCode(o[$]);for($+=1;$<o.length;){let f=String.fromCharCode(o[$]);$+=1,y.contains(_+f)?_=_+f:(g.write(y.indexOf(_),u),y.size()<4095&&(y.size()==1<<u&&(u+=1),y.add(_+f)),_=f)}return g.write(y.indexOf(_),u),g.write(l,u),g.flush(),A.toByteArray()},c=function(){let h={},d=0,l={};return l.add=function(u){if(l.contains(u))throw"dup key:"+u;h[u]=d,d+=1},l.size=function(){return d},l.indexOf=function(u){return h[u]},l.contains=function(u){return typeof h[u]<"u"},l};return s},pd=function(i,t,e){let n=ud(i,t);for(let a=0;a<t;a+=1)for(let c=0;c<i;c+=1)n.setPixel(c,a,e(c,a));let o=Nr();n.write(o);let s=dd(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)s.writeByte(r[a]);return s.flush(),"data:image/gif;base64,"+s},jr=$t,su=$t.stringToBytes;function zr(i){let t=jr(0,"M");t.addData(i),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let s=0;s<e;s++)t.isDark(o,s)&&(n+=`M${s} ${o}h1v1h-1z`);return{size:e,d:n}}var fd=1e4,Xt=class extends Te{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await Rr();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof rt&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),fd)}}async poll(e){let n=this.secret;if(n)try{let o=await Ir(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return T;let{size:e,d:n}=zr(Dr(location.origin,this.code));return p`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${ae`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return p`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?Lr(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Zi}?${Qi}</span> and type the code.
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
    </div>`}};Xt.styles=Ve`
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
  `,Xt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Xt);var es="hassTokens";function Hr(){try{let i=localStorage.getItem(es);return i?JSON.parse(i):null}catch{return null}}function ts(i){try{i?localStorage.setItem(es,JSON.stringify(i)):localStorage.removeItem(es)}catch{}}function gd(i){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=i)}function md(){let i=document.querySelector("mydashlight-pairing");return i?new Promise(t=>{let e=n=>{i.stop(),i.hidden=!0,t(n)};i.addEventListener("paired",n=>e(n.detail),{once:!0}),i.addEventListener("password",()=>e(null),{once:!0}),i.start()}):Promise.resolve(null)}async function bd(){let i=document.querySelector("mydashlight-board");if(!i)return;i.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!Hr()){let e=await md();e&&ts(e)}try{let e=await ws({hassUrl:location.origin,loadTokens:async()=>Hr(),saveTokens:ts});t&&history.replaceState(null,"",location.pathname+_i(location.search));let n=await ks({auth:e});i.backend=new sn(n),Tr(n),$r(n,kr(import.meta.url),{reload:vd,idleFor:()=>Date.now()-Wr}),n.addEventListener("reconnect-error",(o,s)=>{s===2&&Fr()})}catch(e){if(e===2){Fr();return}gd(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}var Wr=Date.now();for(let i of["pointerdown","keydown","wheel"])document.addEventListener(i,()=>Wr=Date.now(),{capture:!0,passive:!0});var Ur="mydashlight-reloaded-for";function vd(i){try{if(sessionStorage.getItem(Ur)===i)return;sessionStorage.setItem(Ur,i)}catch{}location.reload()}function Fr(){ts(null),location.replace(location.pathname+_i(location.search))}var Vr=tt(location.search),Kr=document.querySelector("mydashlight-keyboard");Kr&&Vr.keyboard!==!1&&Sr(Kr);Vr.cursor!=="show"&&wr();bd();
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
