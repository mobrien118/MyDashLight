var Wr=Object.defineProperty;var Nn=(s,t)=>()=>(s&&(t=s(s=0)),t);var Vr=(s,t)=>{for(var e in t)Wr(s,e,{get:t[e],enumerable:!0})};function Cn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function Es(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function ol(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Io(s){return ol(s,t=>t.unicode)}function rl(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))i.createIndex(r,a,{multiEntry:c});return i}t(wt),t(it,Qa,{[Oo]:[Za,!0],[jo]:[[el,tl]],[zo]:[nl,!0]}),t(As,void 0,{[No]:[""]})}function Ho(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function al(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,Xa);Cs[s]=o,o.onupgradeneeded=i=>{i.oldVersion<Ja&&rl(o.result)},Ho(e,n,o)});return t.onclose=()=>Ss(s),t}function ll(s){return An[s]||(An[s]=al(s)),An[s]}function ze(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(d=>r.objectStore(d)),c;n(a,r,d=>{c=d}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function Ss(s){let t=Cs[s],e=t&&t.result;if(e){e.close();let n=Sn[s];if(n)for(let o of n)o()}delete Cs[s],delete An[s],delete Sn[s]}function cl(s){return new Promise((t,e)=>{Ss(s);let n=indexedDB.deleteDatabase(s);Ho(t,e,n)})}function dl(s,t){let e=Sn[s];e||(e=Sn[s]=[]),e.push(t)}function xt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||hl.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Uo(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=ul)}function pl(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:a,tags:c,emoji:d,version:h})=>{let l=[...new Set(Uo([...(r||[]).map(xt).flat(),...(c||[]).map(xt).flat(),...xt(e),n]))].sort(),u={annotation:e,group:o,order:i,tags:c,tokens:l,unicode:d,version:h};if(n&&(u.emoticon=n),r&&(u.shortcodes=r),a){u.skinTones=[],u.skinUnicodes=[],u.skinVersions=[];for(let{tone:b,emoji:E,version:g}of a)u.skinTones.push(b),u.skinUnicodes.push(E),u.skinVersions.push(g)}return u})}function Fo(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function st(s,t,e){Fo(s,"get",t,e)}function Ko(s,t,e){Fo(s,"getAll",t,e)}function Ls(s){s.commit&&s.commit()}function fl(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function Wo(s,t){let e=fl(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function gl(s){return!await Ds(s,wt,Mn)}async function ml(s,t,e){let[n,o]=await Promise.all([_s,Mn].map(i=>Ds(s,wt,i)));return n===e&&o===t}async function bl(s,t){return ze(s,it,$t,(n,o,i)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let d=c.target.result;for(let h of d)if(r=h.unicode,t(h))return i(h);if(d.length<50)return i();a()}};a()})}async function Vo(s,t,e,n){try{let o=pl(t);await ze(s,[it,wt],Ms,([i,r],a)=>{let c,d,h=0;function l(){++h===2&&u()}function u(){if(!(c===n&&d===e)){i.clear();for(let b of o)i.put(b);r.put(n,_s),r.put(e,Mn),Ls(a)}}st(r,_s,b=>{c=b,l()}),st(r,Mn,b=>{d=b,l()})})}finally{}}async function vl(s,t){return ze(s,it,$t,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Ko(e.index(jo),i,o)})}async function Go(s,t){let e=Uo(xt(t));return e.length?ze(s,it,$t,(n,o,i)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let d=Wo(r,h=>h.unicode);i(d.sort((h,l)=>h.order<l.order?-1:1))};for(let d=0;d<e.length;d++){let h=e[d],l=d===e.length-1?IDBKeyRange.bound(h,h+"￿",!1,!0):IDBKeyRange.only(h);Ko(n.index(Oo),l,u=>{r.push(u),a()})}}):[]}async function yl(s,t){let e=await Go(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await bl(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function xl(s,t){return ze(s,it,$t,(e,n,o)=>st(e,t,i=>{if(i)return o(i);st(e.index(zo),t,r=>o(r||null))}))}function Ds(s,t,e){return ze(s,t,$t,(n,o,i)=>st(n,e,i))}function wl(s,t,e,n){return ze(s,t,Ms,(o,i)=>{o.put(n,e),Ls(i)})}function kl(s,t){return ze(s,As,Ms,(e,n)=>st(e,t,o=>{e.put((o||0)+1,t),Ls(n)}))}function $l(s,t,e){return e===0?[]:ze(s,[As,it],$t,([n,o],i,r)=>{let a=[];n.index(No).openCursor(void 0,"prev").onsuccess=c=>{let d=c.target.result;if(!d)return r(a);function h(b){if(a.push(b),a.length===e)return r(a);d.continue()}let l=d.primaryKey,u=t.byName(l);if(u)return h(u);st(o,l,b=>{if(b)return h(b);d.continue()})}})}function Tl(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let a=e;for(let d=0;d<r.length;d++){let h=r.charAt(d),l=a.get(h);l||(l=new Map,a.set(h,l)),a=l}let c=a.get(Pn);c||(c=[],a.set(Pn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let d=0;d<o.length;d++){let h=o.charAt(d),l=r.get(h);if(l)r=l;else return[]}if(i)return r.get(Pn)||[];let a=[],c=[r];for(;c.length;){let h=[...c.shift().entries()].sort((l,u)=>l[0]<u[0]?-1:1);for(let[l,u]of h)l===Pn?a.push(...u):c.push(u)}return a}}function _l(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||El.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function Bo(s){_l(s);let t=(u,b)=>u.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=s.sort(t),o=Tl(s,u=>{let b=new Set;if(u.shortcodes)for(let E of u.shortcodes)for(let g of xt(E))b.add(g);return b}),i=u=>o(u,!0),r=u=>o(u,!1),a=u=>{let b=xt(u),E=b.map((g,$)=>($<b.length-1?i:r)(g));return Wo(E,g=>g.name).sort(t)},c=new Map,d=new Map;for(let u of s){d.set(u.name.toLowerCase(),u);for(let b of u.shortcodes||[])c.set(b.toLowerCase(),u)}return{all:e,search:a,byShortcode:u=>c.get(u.toLowerCase()),byName:u=>d.get(u.toLowerCase())}}function Ht(s){if(!s)return s;if(Cl&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function qo(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Al(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Pl.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function Yo(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function Ml(s){let t=await fetch(s,{method:"HEAD"});Yo(t,s);let e=t.headers.get("etag");return qo(e),e}async function Ps(s){let t=await fetch(s);Yo(t,s);let e=t.headers.get("etag");qo(e);let n=await t.json();return Al(n),[e,n]}function Sl(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Ll(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function Xo(s){let t=JSON.stringify(s),e=Ll(t),n=await crypto.subtle.digest("SHA-1",e),o=Sl(n);return btoa(o)}async function Dl(s,t){let e,n=await Ml(t);if(!n){let o=await Ps(t);n=o[0],e=o[1],n||(n=await Xo(e))}await ml(s,t,n)||(e||(e=(await Ps(t))[1]),await Vo(s,e,t,n))}async function Rl(s,t){let[e,n]=await Ps(t);e||(e=await Xo(n)),await Vo(s,n,t,e)}async function Il(s,t){try{await Dl(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var Xa,Ja,it,wt,As,Za,Oo,Qa,No,el,tl,jo,_s,Mn,Ro,$t,Ms,zo,nl,sl,il,Cs,An,Sn,hl,ul,Pn,El,Cl,Pl,kt,Rs=Nn(()=>{Xa=1,Ja=1,it="emoji",wt="keyvalue",As="favorites",Za="tokens",Oo="tokens",Qa="unicode",No="count",el="group",tl="order",jo="group-order",_s="eTag",Mn="url",Ro="skinTone",$t="readonly",Ms="readwrite",zo="skinUnicodes",nl="skinUnicodes",sl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",il="en";Cs={},An={},Sn={};hl=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);ul=2;Pn="";El=["name","url"];Cl=typeof wrappedJSObject<"u";Pl=["annotation","emoji","group","order","version"];kt=class{constructor({dataSource:t=sl,locale:e=il,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Bo(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await ll(this._dbName);dl(this._dbName,this._clear);let e=this.dataSource;await gl(t)?await Rl(t,e):this._lazyUpdate=Il(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Es(t),await this.ready(),Io(await vl(this._db,t)).map(Ht)}async getEmojiBySearchQuery(t){Cn(t),await this.ready();let e=this._custom.search(t),n=Io(await Go(this._db,t)).map(Ht);return[...e,...n]}async getEmojiByShortcode(t){Cn(t),await this.ready();let e=this._custom.byShortcode(t);return e||Ht(await yl(this._db,t))}async getEmojiByUnicodeOrName(t){Cn(t),await this.ready();let e=this._custom.byName(t);return e||Ht(await xl(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Ds(this._db,wt,Ro)||0}async setPreferredSkinTone(t){return Es(t),await this.ready(),wl(this._db,wt,Ro,t)}async incrementFavoriteEmojiCount(t){return Cn(t),await this.ready(),kl(this._db,t)}async getTopFavoriteEmoji(t){return Es(t),await this.ready(),(await $l(this._db,this._custom,t)).map(Ht)}set customEmoji(t){this._custom=Bo(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Ss(this._dbName)}async delete(){await this._shutdown(),await cl(this._dbName)}}});function Zo(s){return s.unicode.includes("‍")}function Kl(s){let t=Qo(s,"#000"),e=Qo(s,"#fff");return t&&e&&Fl(t,e)}function Wl(){let s=Object.entries(Ol);try{for(let[t,e]of s)if(Kl(t))return e}catch{}finally{}return s[0][1]}function Jl(s,t){if(t===0)return s;let e=s.indexOf(ql);return e!==-1?s.substring(0,e)+String.fromCodePoint(Yl+t-1)+s.substring(e):(s.endsWith(Vl)&&(s=s.substring(0,s.length-1)),s+Gl+String.fromCodePoint(Xl+t-1))}function De(s){s.preventDefault(),s.stopPropagation()}function Ns(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function lr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function Zl(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:a,category:c,annotation:d})=>({unicode:n,name:a,shortcodes:i,url:r,category:c,annotation:d,id:n||a,skins:o&&e(o)}))}function ec(s,t,e){let n;Ql?(n=new ResizeObserver(e),n.observe(s)):Dn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function er(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function tr(s,t,e){let n=er(t);if(!n){if(!ot){ot=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])ot.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(ot),ot.firstChild.nodeValue=s,er(ot)}finally{ot.remove()}}return n}function nc(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof js>"u"&&(js=tr(tc,t,t));let a=tr(o.unicode,i,t)/1.8<js;Fs.set(o.unicode,a),a||(n=!1)}return n}function sc(s){return lr(s,t=>t)}function ic(s){s&&(s.scrollTop=0)}function Ut(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function nr(s){return""+s}function oc(s){let t=document.createElement("template");return t.innerHTML=s,t}function dc(s,t){cc?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function hc(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function uc(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=hc(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&dc(n,s)}function pc(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,d=s[i];if(o!==d)if(e.currentExpression=d,r)if(d===null)n.removeAttribute(r);else{let h=a+nr(d)+c;n.setAttribute(r,h)}else{let h;Array.isArray(d)?uc(d,e):d instanceof Element?(h=d,n.replaceWith(h)):n.nodeValue=nr(d),h&&(e.targetNode=h)}}}function fc(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],a=0;for(let d=0,h=s.length;d<h;d++){let l=s[d];if(t+=l.slice(a),d===h-1)break;for(let f=0;f<l.length;f++)switch(l.charAt(f)){case"<":{l.charAt(f+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let u=r[r.length-1],b=Ut(i,u,()=>[]),E,g,$;if(n){let f=/(\S+)="?([^"=]*)$/.exec(l);E=f[1],g=f[2];let N=/^([^">]*)("?)/.exec(s[d+1]);$=N[1],t=t.slice(0,-1*f[0].length),a=N[0].length}else a=0;let _={attributeName:E,attributeValuePre:g,attributeValuePost:$,expressionIndex:d};b.push(_),!e&&!n&&(t+=" ")}return{template:oc(t),elementsToBindings:i}}function sr(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function gc(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))sr(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=t.get(++r);a&&sr(a,i,e)}while(i=o.nextNode())}return e}function mc(s){let{template:t,elementsToBindings:e}=Ut(rc,s,()=>fc(s)),n=t.cloneNode(!0).content.firstElementChild,o=gc(n,e);return function(r){return pc(r,o),n}}function bc(s){let t=Ut(ac,s,()=>new Map),e=lc;function n(i,...r){let a=Ut(t,i,()=>new Map);return Ut(a,e,()=>mc(i))(r)}function o(i,r,a){return i.map((c,d)=>{let h=e;e=a(c);try{return r(c,d)}finally{e=h}})}return{map:o,html:n}}function vc(s,t,e,n,o,i,r,a,c){let{labelWithSkin:d,titleForEmoji:h,unicodeWithSkin:l}=e,{html:u,map:b}=bc(t);function E(f,N,H){return b(f,(V,he)=>u`<button role="${N?"option":"menuitem"}" aria-selected="${N?he===t.activeSearchItem:null}" aria-label="${d(V,t.currentSkinTone)}" title="${h(V)}" class="${"emoji"+(N&&he===t.activeSearchItem?" active":"")+(V.unicode?"":" custom-emoji")}" id="${`${H}-${V.id}`}" style="${V.unicode?null:`--custom-emoji-background: url(${JSON.stringify(V.url)})`}">${V.unicode?l(V,t.currentSkinTone):""}</button>`,V=>`${H}-${V.id}`)}let $=u`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(f,N)=>u`<div id="skintone-${N}" class="emoji ${N===t.activeSkinTone?"active":""}" aria-selected="${N===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[N]}" aria-label="${t.i18n.skinTones[N]}">${f}</div>`,f=>f)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,f=>u`<button role="tab" class="nav-button" aria-controls="tab-${f.id}" aria-label="${t.i18n.categories[f.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===f.id}" title="${t.i18n.categories[f.name]}" data-group-id="${f.id}"><div class="nav-emoji emoji">${f.emoji}</div></button>`,f=>f.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(f,N)=>u`<div><div id="menu-label-${N}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:f.category?f.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${N!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(f.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${N}" id="${t.searchMode?"search-results":null}">${E(f.emojis,t.searchMode,"emo")}</div></div>`,f=>f.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${E(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,_=(f,N)=>{for(let H of s.querySelectorAll(`[${f}]`))N(H,H.getAttribute(f))};if(c){s.appendChild($);for(let f of["click","focusout","input","keydown","keyup"])_(`data-on-${f}`,(N,H)=>{N.addEventListener(f,n[H])});_("data-ref",(f,N)=>{i[N]=f}),r.addEventListener("abort",()=>{s.removeChild($)})}_("data-action",(f,N)=>{let H=a.get(N);H||a.set(N,H=new WeakSet),H.has(f)||(H.add(f),o[N](f))})}function yc(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let d=[...o];o.clear();try{for(let h of d)h()}finally{i=!1,o.size&&(i=!0,Rn(r))}},a=new Proxy({},{get(d,h){if(e){let l=n.get(h);l||(l=new Set,n.set(h,l)),l.add(e)}return d[h]},set(d,h,l){if(d[h]!==l){d[h]=l;let u=n.get(h);if(u){for(let b of u)o.add(b);i||(i=!0,Rn(r))}}return!0}}),c=d=>{let h=()=>{let l=e;e=h;try{return d()}finally{e=l}};return h()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function zs(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function xc(s,t,e){{let n=s.closest(".tabpanel"),o=ir.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),ir.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function wc(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=yc(o),a=new Map;Ln(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),Ln(i,t),Ln(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:zl,isRtl:!1,currentGroupIndex:0,groups:Is,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=m=>{s.getElementById(m).focus()},d=m=>s.getElementById(`emo-${m.id}`),h=(m,y)=>{e.rootElement.dispatchEvent(new CustomEvent(m,{detail:y,bubbles:!0,composed:!0}))},l=(m,y)=>m.id===y.id,u=(m,y)=>{let{category:M,emojis:R}=m,{category:L,emojis:O}=y;return M!==L?!1:zs(R,O,l)},b=m=>{zs(i.currentEmojis,m,l)||(i.currentEmojis=m)},E=m=>{i.searchMode!==m&&(i.searchMode=m)},g=m=>{zs(i.currentEmojisWithCategories,m,u)||(i.currentEmojisWithCategories=m)},$=(m,y)=>y&&m.skins&&m.skins[y]||m.unicode,N={labelWithSkin:(m,y)=>sc([m.name||$(m,y),m.annotation,...m.shortcodes||Hs].filter(Boolean)).join(", "),titleForEmoji:m=>m.annotation||(m.shortcodes||Hs).join(", "),unicodeWithSkin:$},H={onClickSkinToneButton:$e,onEmojiClick:ne,onNavClick:Z,onNavKeydown:Q,onSearchKeydown:z,onSkinToneOptionsClick:fe,onSkinToneOptionsFocusOut:v,onSkinToneOptionsKeydown:lt,onSkinToneOptionsKeyup:Re,onSearchInput:C},V={calculateEmojiGridStyle:k,updateOnIntersection:x},he=!0;r(()=>{vc(s,i,N,H,V,e,o,a,he),he=!1}),i.emojiVersion||Os().then(m=>{m||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function m(){let y=!1,M=setTimeout(()=>{y=!0,i.message=i.i18n.loadingMessage},Nl);try{await i.database.ready(),i.databaseLoaded=!0}catch(R){console.error(R),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(M),y&&(y=!1,i.message="")}}i.database&&m()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${Jo};`}),r(()=>{i.customEmoji&&i.database&&w()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==Us&&(i.groups=Us):i.groups!==Is&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=Is)}),r(()=>{async function m(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}m()}),r(()=>{i.skinTones=Array(Jo).fill().map((m,y)=>Jl(i.skinToneEmoji,y))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function m(){let{database:y}=i,M=(await Promise.all(Hl.map(R=>y.getEmojiByUnicodeOrName(R)))).filter(Boolean);i.defaultFavoriteEmojis=M}i.databaseLoaded&&m()});function w(){let{customEmoji:m,database:y}=i,M=m||Hs;y.customEmoji!==M&&(y.customEmoji=M)}r(()=>{async function m(){w();let{database:y,defaultFavoriteEmojis:M,numColumns:R}=i,L=await y.getTopFavoriteEmoji(R),O=await W(lr([...L,...M],F=>F.unicode||F.name).slice(0,R));i.currentFavorites=O}i.databaseLoaded&&i.defaultFavoriteEmojis&&m()});function k(m){ec(m,o,()=>{{let y=getComputedStyle(e.rootElement),M=parseInt(y.getPropertyValue("--num-columns"),10),R=y.getPropertyValue("direction")==="rtl";i.numColumns=M,i.isRtl=R}})}function x(m){xc(m,o,y=>{for(let{target:M,isIntersecting:R}of y)M.classList.toggle("onscreen",R)})}r(()=>{async function m(){let{searchText:y,currentGroup:M,databaseLoaded:R,customEmoji:L}=i;if(!R)i.currentEmojis=[],i.searchMode=!1;else if(y.length>=Bl){let O=await J(y);i.searchText===y&&(b(O),E(!0))}else{let{id:O}=M;if(O!==-1||L&&L.length){let F=await X(O);i.currentGroup.id===O&&(b(F),E(!1))}}}m()});let P=()=>{Dn(()=>ic(e.tabpanelElement))};r(()=>{let{currentEmojis:m,emojiVersion:y}=i,M=m.filter(R=>R.unicode).filter(R=>Zo(R)&&!Fs.has(R.unicode));if(!y&&M.length)b(m),Dn(()=>A(M));else{let R=y?m:m.filter(S);b(R),P()}});function A(m){nc(m,e.baselineEmoji,d)?P():i.currentEmojis=[...i.currentEmojis]}function S(m){return!m.unicode||!Zo(m)||Fs.get(m.unicode)}async function j(m){let y=i.emojiVersion||await Os();return m.filter(({version:M})=>!M||M<=y)}async function W(m){return Zl(m,i.emojiVersion||await Os())}async function X(m){let y=m===-1?i.customEmoji:await i.database.getEmojiByGroup(m);return W(await j(y))}async function J(m){return W(await j(await i.database.getEmojiBySearchQuery(m)))}r(()=>{}),r(()=>{function m(){let{searchMode:M,currentEmojis:R}=i;if(M)return[{category:"",emojis:R}];let L=new Map;for(let O of R){let F=O.category||"",B=L.get(F);B||(B=[],L.set(F,B)),B.push(O)}return[...L.entries()].map(([O,F])=>({category:O,emojis:F})).sort((O,F)=>i.customCategorySorting(O.category,F.category))}let y=m();g(y)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:m}=i;rr(()=>{i.searchText=(m||"").trim(),i.activeSearchItem=-1})});function z(m){if(!i.searchMode||!i.currentEmojis.length)return;let y=M=>{De(m),i.activeSearchItem=Ns(M,i.activeSearchItem,i.currentEmojis)};switch(m.key){case"ArrowDown":return y(!1);case"ArrowUp":return y(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return De(m),_e(i.currentEmojis[i.activeSearchItem].id)}}function Z(m){let{target:y}=m,M=y.closest(".nav-button");if(!M)return;let R=parseInt(M.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(L=>L.id===R)}function Q(m){let{target:y,key:M}=m,R=L=>{L&&(De(m),L.focus())};switch(M){case"ArrowLeft":return R(y.previousElementSibling);case"ArrowRight":return R(y.nextElementSibling);case"Home":return R(y.parentElement.firstElementChild);case"End":return R(y.parentElement.lastElementChild)}}async function ke(m){let y=await i.database.getEmojiByUnicodeOrName(m),M=[...i.currentEmojis,...i.currentFavorites].find(L=>L.id===m),R=M.unicode&&$(M,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(m),{emoji:y,skinTone:i.currentSkinTone,...R&&{unicode:R},...M.name&&{name:M.name}}}async function _e(m){let y=ke(m);h("emoji-click-sync",y),h("emoji-click",await y)}function ne(m){let{target:y}=m;if(!y.classList.contains("emoji"))return;De(m);let M=y.id.substring(4);_e(M)}function se(m){i.currentSkinTone=m,i.skinTonePickerExpanded=!1,c("skintone-button"),h("skin-tone-change",{skinTone:m}),i.database.setPreferredSkinTone(m)}function fe(m){let{target:{id:y}}=m,M=y&&y.match(/^skintone-(\d)/);if(!M)return;De(m);let R=parseInt(M[1],10);se(R)}function $e(m){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(De(m),Dn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function lt(m){if(!i.skinTonePickerExpanded)return;let y=async M=>{De(m),i.activeSkinTone=M};switch(m.key){case"ArrowUp":return y(Ns(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return y(Ns(!1,i.activeSkinTone,i.skinTones));case"Home":return y(0);case"End":return y(i.skinTones.length-1);case"Enter":return De(m),se(i.activeSkinTone);case"Escape":return De(m),i.skinTonePickerExpanded=!1,c("skintone-button")}}function Re(m){if(i.skinTonePickerExpanded)switch(m.key){case" ":return De(m),se(i.activeSkinTone)}}async function v(m){let{relatedTarget:y}=m;(!y||y.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function C(m){i.rawSearchText=m.target.value}return{$set(m){Ln(i,m)},$destroy(){n.abort()}}}function or(s){s instanceof rt||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var Us,Is,Bl,Jo,rr,Ol,Nl,jl,zl,Hl,ar,Ul,Qo,Fl,Bs,Os,Fs,Vl,Gl,ql,Yl,Xl,Dn,Ql,tc,js,ot,rc,ac,lc,cc,Rn,ir,Hs,Ln,kc,$c,Tc,Ec,cr,_c,rt,dr,hr=Nn(()=>{Rs();Us=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),Is=Us.slice(1),Bl=2,Jo=6,rr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Ol={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Nl=1e3,jl="🖐️",zl=8,Hl=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],ar='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Ul=(s,t)=>s<t?-1:s>t?1:0,Qo=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${ar}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},Fl=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};Os=()=>(Bs||(Bs=new Promise(s=>rr(()=>s(Wl())))),Bs),Fs=new Map,Vl="️",Gl="\uD83C",ql="‍",Yl=127995,Xl=57339;Dn=requestAnimationFrame,Ql=typeof ResizeObserver=="function";tc="😀";rc=new WeakMap,ac=new WeakMap,lc=Symbol("un-keyed"),cc="replaceChildren"in Element.prototype;Rn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);ir=new WeakMap;Hs=[],{assign:Ln}=Object;kc="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",$c="en",Tc={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Ec=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',cr=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],_c=`:host{--emoji-font-family:${ar}}`,rt=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Ec+_c,this.shadowRoot.appendChild(e),this._ctx={locale:$c,dataSource:kc,skinToneEmoji:jl,customCategorySorting:Ul,customEmoji:null,i18n:Tc,emojiVersion:null,...t};for(let n of cr)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){or(this),this._cmp||(this._cmp=wc(this.shadowRoot,this._ctx))}disconnectedCallback(){or(this),Rn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new kt({locale:t,dataSource:e}))}_dbFlush(){Rn(()=>this._dbCreate())}},dr={};for(let s of cr)dr[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(rt.prototype,dr);customElements.get("emoji-picker")||customElements.define("emoji-picker",rt)});var ur={};Vr(ur,{Database:()=>kt,Picker:()=>rt});var pr=Nn(()=>{hr();Rs()});function oi(s){return{type:"auth",access_token:s}}function ri(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function ai(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function jn(s){return{type:"unsubscribe_events",subscription:s}}function li(){return{type:"ping"}}function ci(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function hi(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[i]=r}return t}var ui=(s,t,e,n)=>{let[o,i,r]=s.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(i)>=e:Number(i)>e)||n!==void 0&&Number(o)===t&&Number(i)===e&&Number(r)>=n};var Jt=!1,qr="auth_required",Yr="auth_invalid",Xr="auth_ok";function fi(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;Jt&&console.log("[Auth phase] Initializing",n);function o(i,r,a){Jt&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),d=!1,h=()=>{if(c.removeEventListener("close",h),d){a(2);return}if(i===0){a(1);return}let b=i===-1?-1:i-1;setTimeout(()=>o(b,r,a),1e3)},l=async b=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(oi(t.accessToken)))}catch(E){d=E===2,c.close()}},u=async b=>{let E=JSON.parse(b.data);switch(Jt&&console.log("[Auth phase] Received",E),E.type){case Yr:d=!0,c.close();break;case Xr:c.removeEventListener("open",l),c.removeEventListener("message",u),c.removeEventListener("close",h),c.removeEventListener("error",h),c.haVersion=E.ha_version,ui(c.haVersion,2022,9)&&c.send(JSON.stringify(ri())),r(c);break;default:Jt&&E.type!==qr&&console.warn("[Auth phase] Unhandled message",E)}};c.addEventListener("open",l),c.addEventListener("message",u),c.addEventListener("close",h),c.addEventListener("error",h)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var _t=!1,Zt=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{_t&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(jn(i.id)).catch(a=>{_t&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:_t&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(ci(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){_t&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let d of c)d.reject&&d.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,ai(e))}ping(){return this.sendMessagePromise(li())}sendMessage(t,e){if(!this.connected)throw 3;if(_t&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(i){n(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(jn(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var Jr=()=>`${location.protocol}//${location.host}/`,Zr=s=>s*1e3+Date.now();function Qr(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function ea(s,t,e,n){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function ta(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=ea(s,t,e,n)}async function bi(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=t,r.expires=Zr(r.expires_in),r}function mi(s,t,e){return bi(s,t,{code:e,grant_type:"authorization_code"})}function na(s){return btoa(JSON.stringify(s))}function sa(s){return JSON.parse(atob(s))}var zn=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await bi(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function vi(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:Jr(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await mi(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let i=hi(location.search.substr(1));if("auth_callback"in i){let r=sa(i.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await mi(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new zn(t,s.saveTokens);if(e===void 0)throw 4;return ta(e,n,s.redirectUrl||Qr(),na({hassUrl:e,clientId:n})),new Promise(()=>{})}async function yi(s){let t=Object.assign({setupRetry:0,createSocket:fi},s),e=await t.createSocket(t);return new Zt(e,t)}function U(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function He(s){let t=Math.floor(Math.round(s)/60)%24;return`${U(s)} ${t<12?"AM":"PM"}`}function xi(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Pt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function Hn(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var ia=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),oa=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),ra=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Qt(s){return new Date(`${s}T12:00:00Z`)}function Ce(s){let t=Qt(s);return`${ia.format(t)}, ${ra.format(t)}`}function be(s){return oa.format(Qt(s))}function Me(s,t){return Math.round((Qt(t).getTime()-Qt(s).getTime())/864e5)}function Ct(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Ct("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function en(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=Ct(e,s),i=Ct(e,t).date;return o.date===i?`at ${He(o.minutes)}`:`on ${be(o.date)} at ${He(o.minutes)}`}var ie=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function $i(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Ve="mydashlight",aa=7,Un=3e4,wi=3e4;function Fn(s){if(s instanceof ie)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new ie(String(t.code??"error"),t.message)}return typeof s=="number"?new ie("connection_lost","Lost the connection to Home Assistant."):new ie("error",String(s))}function ki(s,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new ie("timeout","Home Assistant didn’t answer.")),t);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),n(i)})})}var At=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},tn=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new ie("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new At(this.conn,`${Ve}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new ie("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},Un),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await ki(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_plan",service_data:{days:aa},return_response:!0}),wi);this.emit(t.response)}catch(t){this.fail(Fn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Fn(n)}this.live||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Hn(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:Hn(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n){return this.call("set_people",{event:t,people:e,scope:n})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let a=await ki(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_chores",service_data:{},return_response:!0}),wi);if(e)return;n=!0,t(a.response??null)}catch{!e&&!n&&t(null)}},i=new At(this.conn,`${Ve}/chores/subscribe`,a=>{e||(n=!0,t(a.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},Un);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(t){let e=!1,n=!1,o=new At(this.conn,`${Ve}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let i=setInterval(()=>{o.live||o.open()},Un);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Fn(n)}}};var nn=globalThis,sn=nn.ShadowRoot&&(nn.ShadyCSS===void 0||nn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Kn=Symbol(),Ti=new WeakMap,Mt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Kn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(sn&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ti.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ti.set(e,t))}return t}toString(){return this.cssText}},Ei=s=>new Mt(typeof s=="string"?s:s+"",void 0,Kn),Ge=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new Mt(e,s,Kn)},_i=(s,t)=>{if(sn)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=nn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},Wn=sn?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Ei(e)})(s):s;var{is:la,defineProperty:ca,getOwnPropertyDescriptor:da,getOwnPropertyNames:ha,getOwnPropertySymbols:ua,getPrototypeOf:pa}=Object,on=globalThis,Ci=on.trustedTypes,fa=Ci?Ci.emptyScript:"",ga=on.reactiveElementPolyfillSupport,St=(s,t)=>s,Vn={toAttribute(s,t){switch(t){case Boolean:s=s?fa:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ai=(s,t)=>!la(s,t),Pi={attribute:!0,type:String,converter:Vn,reflect:!1,useDefault:!1,hasChanged:Ai};Symbol.metadata??=Symbol("metadata"),on.litPropertyMetadata??=new WeakMap;var Be=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Pi){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&ca(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=da(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Pi}static _$Ei(){if(this.hasOwnProperty(St("elementProperties")))return;let t=pa(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(St("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(St("properties"))){let e=this.properties,n=[...ha(e),...ua(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(Wn(o))}else t!==void 0&&e.push(Wn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _i(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:Vn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Vn;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Ai)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Be.elementStyles=[],Be.shadowRootOptions={mode:"open"},Be[St("elementProperties")]=new Map,Be[St("finalized")]=new Map,ga?.({ReactiveElement:Be}),(on.reactiveElementVersions??=[]).push("2.1.2");var qn=globalThis,Mi=s=>s,rn=qn.trustedTypes,Si=rn?rn.createPolicy("lit-html",{createHTML:s=>s}):void 0,Yn="$lit$",Oe=`lit$${Math.random().toFixed(9).slice(2)}$`,Xn="?"+Oe,ma=`<${Xn}>`,Xe=document,Dt=()=>Xe.createComment(""),Rt=s=>s===null||typeof s!="object"&&typeof s!="function",Jn=Array.isArray,Oi=s=>Jn(s)||typeof s?.[Symbol.iterator]=="function",Gn=`[ 	
\f\r]`,Lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Li=/-->/g,Di=/>/g,qe=RegExp(`>|${Gn}(?:([^\\s"'>=/]+)(${Gn}*=${Gn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ri=/'/g,Ii=/"/g,Ni=/^(?:script|style|textarea|title)$/i,Zn=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=Zn(1),re=Zn(2),jd=Zn(3),Ne=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),Bi=new WeakMap,Ye=Xe.createTreeWalker(Xe,129);function ji(s,t){if(!Jn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Si!==void 0?Si.createHTML(t):t}var zi=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=Lt;for(let a=0;a<e;a++){let c=s[a],d,h,l=-1,u=0;for(;u<c.length&&(r.lastIndex=u,h=r.exec(c),h!==null);)u=r.lastIndex,r===Lt?h[1]==="!--"?r=Li:h[1]!==void 0?r=Di:h[2]!==void 0?(Ni.test(h[2])&&(o=RegExp("</"+h[2],"g")),r=qe):h[3]!==void 0&&(r=qe):r===qe?h[0]===">"?(r=o??Lt,l=-1):h[1]===void 0?l=-2:(l=r.lastIndex-h[2].length,d=h[1],r=h[3]===void 0?qe:h[3]==='"'?Ii:Ri):r===Ii||r===Ri?r=qe:r===Li||r===Di?r=Lt:(r=qe,o=void 0);let b=r===qe&&s[a+1].startsWith("/>")?" ":"";i+=r===Lt?c+ma:l>=0?(n.push(d),c.slice(0,l)+Yn+c.slice(l)+Oe+b):c+Oe+(l===-2?a:b)}return[ji(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},It=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,a=t.length-1,c=this.parts,[d,h]=zi(t,e);if(this.el=s.createElement(d,n),Ye.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(o=Ye.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let l of o.getAttributeNames())if(l.endsWith(Yn)){let u=h[r++],b=o.getAttribute(l).split(Oe),E=/([.?@])?(.*)/.exec(u);c.push({type:1,index:i,name:E[2],strings:b,ctor:E[1]==="."?ln:E[1]==="?"?cn:E[1]==="@"?dn:Ze}),o.removeAttribute(l)}else l.startsWith(Oe)&&(c.push({type:6,index:i}),o.removeAttribute(l));if(Ni.test(o.tagName)){let l=o.textContent.split(Oe),u=l.length-1;if(u>0){o.textContent=rn?rn.emptyScript:"";for(let b=0;b<u;b++)o.append(l[b],Dt()),Ye.nextNode(),c.push({type:2,index:++i});o.append(l[u],Dt())}}}else if(o.nodeType===8)if(o.data===Xn)c.push({type:2,index:i});else{let l=-1;for(;(l=o.data.indexOf(Oe,l+1))!==-1;)c.push({type:7,index:i}),l+=Oe.length-1}i++}}static createElement(t,e){let n=Xe.createElement("template");return n.innerHTML=t,n}};function Je(s,t,e=s,n){if(t===Ne)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=Rt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Je(s,o._$AS(s,t.values),o,n)),t}var an=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Xe).importNode(e,!0);Ye.currentNode=o;let i=Ye.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let d;c.type===2?d=new ut(i,i.nextSibling,this,t):c.type===1?d=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(d=new hn(i,this,t)),this._$AV.push(d),c=n[++a]}r!==c?.index&&(i=Ye.nextNode(),r++)}return Ye.currentNode=Xe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},ut=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Je(this,t,e),Rt(t)?t===T||t==null||t===""?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==Ne&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Oi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==T&&Rt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Xe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=It.createElement(ji(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new an(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Bi.get(t.strings);return e===void 0&&Bi.set(t.strings,e=new It(t)),e}k(t){Jn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(Dt()),this.O(Dt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Mi(t).nextSibling;Mi(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ze=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=T}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Je(this,t,e,0),r=!Rt(t)||t!==this._$AH&&t!==Ne,r&&(this._$AH=t);else{let a=t,c,d;for(t=i[0],c=0;c<i.length-1;c++)d=Je(this,a[n+c],e,c),d===Ne&&(d=this._$AH[c]),r||=!Rt(d)||d!==this._$AH[c],d===T?t=T:t!==T&&(t+=(d??"")+i[c+1]),this._$AH[c]=d}r&&!o&&this.j(t)}j(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ln=class extends Ze{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===T?void 0:t}},cn=class extends Ze{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==T)}},dn=class extends Ze{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Je(this,t,e,0)??T)===Ne)return;let n=this._$AH,o=t===T&&n!==T||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==T&&(n===T||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},hn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Je(this,t)}},Hi={M:Yn,P:Oe,A:Xn,C:1,L:zi,R:an,D:Oi,V:Je,I:ut,H:Ze,N:cn,U:dn,B:ln,F:hn},ba=qn.litHtmlPolyfillSupport;ba?.(It,ut),(qn.litHtmlVersions??=[]).push("3.3.3");var Ui=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new ut(t.insertBefore(Dt(),i),i,void 0,e??{})}return o._$AI(s),o};var Qn=globalThis,Te=class extends Be{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ui(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ne}};Te._$litElement$=!0,Te.finalized=!0,Qn.litElementHydrateSupport?.({LitElement:Te});var va=Qn.litElementPolyfillSupport;va?.({LitElement:Te});(Qn.litElementVersions??=[]).push("4.2.2");var Fi={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ki=s=>(...t)=>({_$litDirective$:s,values:t}),un=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:ya}=Hi,Wi=s=>s;var Vi=()=>document.createComment(""),pt=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Vi(),o),r=n.insertBefore(Vi(),o);e=new ya(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||a){let c=e._$AA;for(;c!==i;){let d=Wi(c).nextSibling;Wi(n).insertBefore(c,o),c=d}}}return e},Ue=(s,t,e=s)=>(s._$AI(t,e),s),xa={},Gi=(s,t=xa)=>s._$AH=t,qi=s=>s._$AH,pn=s=>{s._$AR(),s._$AA.remove()};var Yi=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},je=Ki(class extends un{constructor(s){if(super(s),s.type!==Fi.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let a of s)o[r]=n?n(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=qi(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],c=[],d,h,l=0,u=o.length-1,b=0,E=i.length-1;for(;l<=u&&b<=E;)if(o[l]===null)l++;else if(o[u]===null)u--;else if(a[l]===r[b])c[b]=Ue(o[l],i[b]),l++,b++;else if(a[u]===r[E])c[E]=Ue(o[u],i[E]),u--,E--;else if(a[l]===r[E])c[E]=Ue(o[l],i[E]),pt(s,c[E+1],o[l]),l++,E--;else if(a[u]===r[b])c[b]=Ue(o[u],i[b]),pt(s,o[l],o[u]),u--,b++;else if(d===void 0&&(d=Yi(r,b,E),h=Yi(a,l,u)),d.has(a[l]))if(d.has(a[u])){let g=h.get(r[b]),$=g!==void 0?o[g]:null;if($===null){let _=pt(s,o[l]);Ue(_,i[b]),c[b]=_}else c[b]=Ue($,i[b]),pt(s,o[l],$),o[g]=null;b++}else pn(o[u]),u--;else pn(o[l]),l++;for(;b<=E;){let g=pt(s,c[E+1]);Ue(g,i[b]),c[b++]=g}for(;l<=u;){let g=o[l++];g!==null&&pn(g)}return this.ut=r,Gi(s,c),Ne}});var fn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ce(s){return fn[(s%fn.length+fn.length)%fn.length]}var gn="#23272E",es="35,39,46";var wa=3,Nt=36,ts=12,mn=8,Xi=30,Se=16,Bt=100,ft=60,ss=10,bn=30,is=10,ka=150,$a=150,yn=1;function io(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Nt}function Ta(s,t,e){return 10+10.2*s.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var Ea=26,oo=4;function rs(s,t){let e=Math.max(ka,$a/yn);return Math.ceil(ft+Math.max(0,s-1)*ss+bn+Math.max(0,t-1)*is+e*(s+yn*t))}function Ee(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function ye(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function xe(s){return new Map(Ee(s).map((t,e)=>[t,ce(e)]))}function me(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function ge(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function as(s,t){return t==="none"?"Not needed":ye(s).includes(t)?ge(s,t):t}function ro(s){return s.leave_by!=null&&s.leave_by>s.start&&s.leave_by<s.end?` · leave ${U(s.leave_by)}`:""}function xn(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${U(s.end)}`;if(s.end>=1440)return`From ${U(s.start)}`}return`${U(s.start)}–${U(s.end)}`}function wn(s,t){return t.own?ge(s,t.own):me(s,t.kid)}var gt={color:gn,rgb:es,ink:gn};function ao(s,t){return t.own?gt:xe(s).get(t.kid)??ce(0)}function _a(s,t){let e=Ee(s);return t.along.map(n=>e.includes(n)?me(s,n):ge(s,n))}function mt(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Ca(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function vn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function ns(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(vn(t,n.from)),e.push(vn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(vn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Pa(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),t}function Aa(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function Ma(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function lo(s,t){return Aa(s.anchors,t)}function ls(s,t){return Ma(s.anchors,t)}function Sa(s,t){let e=Ee(s),n=ye(s),o=Math.max(t,rs(e.length,n.length)),r=(o-ft-Math.max(0,e.length-1)*ss-bn-Math.max(0,n.length-1)*is)/(e.length+yn*n.length||1),a=Math.floor(r),c=Math.floor(r*yn),d=s.whole_week??s.days,h=new Map;for(let g of d)for(let $ of g.events)for(let _ of $.own?$.along:[$.kid]){let f=h.get(_)??[];f.some(N=>N.event_id===$.event_id&&N.calendar_id===$.calendar_id)||f.push($),h.set(_,f)}let l=xe(s),u=[],b=ft;e.forEach((g,$)=>{let _=h.get(g)??[],f=s.days.some(N=>N.events.some(H=>H.kid===g&&(H.sides.includes("drop")&&H.drop===""||H.sides.includes("pick")&&H.pick==="")));u.push({id:g,kind:"kid",x:b,w:a,name:me(s,g),dot:l.get(g).color,rgb:l.get(g).rgb,sub:`${f?"Needs a ride · ":""}${_.length} this week`,subWarn:f}),b+=a+($<e.length-1?ss:0)});let E=b+bn/2;return b+=bn,n.forEach((g,$)=>{let _=0,f=0;for(let N of d){let H=N.drivers[g];H&&(_+=H.outings.length,f+=H.drive??0)}u.push({id:g,kind:"driver",x:b,w:c,name:ge(s,g),dot:gn,rgb:es,sub:`${_} ${_===1?"trip":"trips"} this week · ${Pt(f)} driving`,subWarn:!1}),b+=c+($<n.length-1?is:0)}),{columns:u,sepX:E,width:o}}function La(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Ji(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${U(s.start)}`:e||!t?`${s.title} until ${U(s.end)}`:`${s.title} ${U(s.start)}–${U(s.end)}`}function cs(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function ds(s,t){let e=Me(t,s);return e===0?"Today":e===1?"Tomorrow":""}function de(s,t=0){return s==null||!Number.isFinite(s)?t:s}function os(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=n?i+=1+a:(o++,i=a);i>n;)o++,i-=n}return o}var co=25,Da=15,ho=3;function Zi(s){return Math.max(0,Math.min(ho,Math.floor((s-co)/Da)))}var Ra=co+2,Qi=20;function eo(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var Ot="🚗";function to(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var no={muted:0,normal:1,pending:2,problem:3};function uo(s){let{drop:t,pick:e}=s,n=t?to(t.text,"drop"):null,o=e?to(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((c,d)=>d&&(no[d.tone]??1)>(no[c]??1)?d.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Ot} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${Ot} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:!n.at||!o.at?{drop:{text:`${c} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:i},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,d)=>c==="needed"?`${d} needed`:`${d}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Ot} ${a.join(" · ")}`,tone:i},pick:null}}function so(s,t){let e=t-23,n=`${U(s.start)}–${U(s.end)}`+(s.arrive_by!=null?` · arrive ${U(s.arrive_by)}`:"")+ro(s),o=33+os(n,e,6.6)*16,i=s.own?s.lines:uo(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+os(r.text,e,7)*16);return o+4}function po(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:a}=Sa(s,e),c=new Map(i.map(f=>[f.id,f])),d=Ee(s),h=ye(s),l=[...d,...h],u=xe(s),b=Ca(s),E=f=>me(s,f),g=f=>ge(s,f),$={mode:t,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},_=0;return s.days.forEach((f,N)=>{let H=N*1440,V=new Map(f.events.map(v=>[v.id,v])),he=v=>v&&V.has(v)?{day:f.date,event:v}:null,w=cs(f),k=f.events.length,x=ds(f.date,n.date),P=Ce(f.date),A=(k?`${k} ${k===1?"activity":"activities"}${f.done?" left":""}`:f.done?"All done for today":"Nothing scheduled")+(w?` · ${w} to sort out`:""),S=Na(s,f,u,a,a-Ta(P,x,A));$.dayHeads.push({date:f.date,y:_,label:P,tag:x,sub:A,warn:w>0,h:Nt+(S&&S.h?S.h+oo+2:0),allDay:S?.chips??[],inline:S?.inline??0}),$.anchors.push({t:H,y:_});let j=$.dayHeads[$.dayHeads.length-1],W=_+j.h+ts,X=h.flatMap(v=>f.drivers[v]?.outings??[]);if(!k&&!X.length){$.empties.push({key:f.date,y:W,text:f.done?"Nothing else today":"Nothing planned"}),_=W+40,$.anchors.push({t:H+1439,y:_});return}let J=(v,C,m,y,M,R,L,O=v.kid)=>{let F=!!v.own&&O===v.own,B=!!v.own&&O!==v.own,ae=F?gt:u.get(O)??ce(0),Y=F?g(O):E(O),ue=B?{drop:{text:`${L?`${Ot} `:""}With ${g(v.own)}`,tone:v.attending===!1?"muted":"normal"},pick:null}:L&&!v.own?uo(v.lines):v.lines,pe=F?_a(s,v):[],ct=(v.takes!=null?`${v.takes} min, any time ${U(v.start)}–${U(v.end)}`:xn(v)+(v.arrive_by!=null?` · arrive ${U(v.arrive_by)}`:"")+ro(v))+(pe.length?` · with ${mt(pe)}`:"");return{key:`${f.date}|card|${v.id}`+(v.own?`|${O}`:""),x:C,y:m,w:y,h:M,target:{day:f.date,event:v.id},event:v,color:ae,kidName:Y,clash:R,stayed:!v.own&&v.stay&&h.includes(v.drop),skipped:v.attending===!1,title:La(v.title,Y),time:ct,drop:ue.drop,pick:ue.pick,showDrop:!!ue.drop&&(L||M>=56),showPick:!!ue.pick&&(L||M>=74),wrap:L,aria:`${Y}, ${v.title} ${v.takes!=null?`any time from ${U(v.start)} to ${U(v.end)}`:xn(v).replace("–"," to ")}. `+(v.attending===!1&&!ue.drop?"Not attending. ":"")+[ue.drop,ue.pick].filter(Ie=>!!Ie).map(Ie=>Ie.text).join(". ")}},z=v=>{let C=f.rides[v];return C?(f.drivers[C.driver]?.segments??[]).filter(y=>y.type!=="home"&&y.kids.includes(C.kid)&&de(y.start)>=de(C.start)&&de(y.end)<=de(C.end)):[]},Z=v=>{let C=f.rides[v];if(!C)return null;let m=C.serves.find(y=>V.get(y)?.kid===C.kid);return he(m??C.serves[0])},Q=(v,C)=>{if(C.event)return C;let m=f.events.find(y=>y.own&&y.own!==v&&y.along.includes(v)&&y.title===C.title);return m?{...C,title:`${C.title} with ${g(m.own)}`}:C},ke=v=>{if(v.takes==null)return[v.start,v.end];let C=v.planned??v.start;return[C,C+v.takes]},_e=new Map;for(let v of f.issues)v.level!=="problem"||!v.event||(v.kind==="late"&&_e.set(v.event,`${Math.round(de(v.minutes))} min late`),v.kind==="waiting"&&_e.set(`${v.event}|pick`,`Waits ${Math.round(de(v.minutes))} min`));if(!o){let v=1/0,C=-1/0;for(let B of f.events)B.start<=0&&B.end>=1440||(B.start>0?v=Math.min(v,B.start-20,B.arrive_by!=null?B.arrive_by-10:1/0):v=Math.min(v,B.end-30),B.end<1440?C=Math.max(C,B.end+20):C=Math.max(C,B.start+30));for(let B of X)B.start!=null&&(v=Math.min(v,B.start)),B.end!=null&&(C=Math.max(C,B.end));let m=f.from;m!=null&&Number.isFinite(v)&&v<m+60?v=m-15:f.date===n.date&&Number.isFinite(v)&&n.minutes>v-60&&n.minutes<C&&(v=Math.min(v,n.minutes-15));let y=Number.isFinite(v)?Math.floor((v-5)/30)*30:900,M=Math.max(Number.isFinite(C)?Math.ceil((C+5)/30)*30:960,y+60),R=B=>m!=null&&de(B)<=y,L=B=>m!=null&&de(B)<y,O=B=>Math.round(W+(Math.max(y,Math.min(M,B))-y)*wa);$.anchors.push({t:H+y,y:O(y)},{t:H+M,y:O(M)});for(let B of d){let ae=c.get(B),Y=u.get(B),ue=(f.kids[B]?.items??[]).filter(D=>D.start!=null&&D.end!=null&&!R(D.end)).map(D=>({item:D,s:de(D.start),en:de(D.end)})),pe=[];for(let D of Pa(ue)){let K=ae.w/D.cols,G=Math.round(ae.x+D.col*K),ee=Math.round(K-(D.cols>1?4:0)),oe=O(D.s),te=D.item;if(te.type==="act"){let we=V.get(te.event??"");if(!we)continue;let Xt=Math.max(30,O(D.en)-oe),dt=J(we,G,oe,ee,Xt,te.clash,!1,B);if(dt.layer=Bt,dt.cut=L(D.s),$.cards.push(dt),we.arrive_by!=null&&we.start-we.arrive_by>=5&&!dt.cut){let On=O(we.arrive_by),ii={key:`${f.date}|prep|${we.id}`,x:G,y:On,w:ee,h:oe-On+Se,color:Y,label:`Arrive by ${U(we.arrive_by)}`,layer:Bt-1};$.preps.push(ii),pe.push({s:we.arrive_by,en:D.en,top:On,bottom:oe+Xt,x:G,w:ee,prep:ii,card:dt})}else pe.push({s:D.s,en:D.en,top:oe,bottom:oe+Xt,x:G,w:ee,card:dt});let ni=_e.get(we.id);ni&&$.marks.push({key:`${f.date}|late|${we.id}`,x:G+ee-4,y:oe+4,text:ni,right:!0});let si=_e.get(`${we.id}|pick`);si&&$.marks.push({key:`${f.date}|wait|${we.id}`,x:G+4,y:oe+Xt+2,text:si,right:!1});continue}let q=f.rides[te.ride??-1];if(!q)continue;let Ae=Math.max(22,O(D.en)-oe),Et=ns(z(q.index),b),Qs=g(q.driver),ei={key:`${f.date}|ride|${q.index}`,x:G,y:oe,w:ee,h:Ae,target:Z(q.index),l1:`${q.own?"In":"Along in"} ${Qs}’s car`,l2:Et.join(" → "),show2:Zi(Ae)>0,lines2:Zi(Ae),dashed:!q.own,clash:te.clash,aria:`${E(B)} ${q.own?"in":"riding along in"} ${Qs}’s car, ${U(de(q.start))} to ${U(de(q.end))}: ${Et.join(" to ")}`};$.rides.push(ei);let ti=c.get(q.driver),Bn=null;ti&&(Bn={key:`${f.date}|band|${q.index}`,x:G+ee,y:oe,w:Math.max(0,ti.x+8-(G+ee)),h:Ae,color:Y},$.bands.push(Bn)),pe.push({s:D.s,en:D.en,top:oe,bottom:oe+Ae,x:G,w:ee,ride:ei,band:Bn})}let ct=D=>D.ride?.layer??(D.prep?Bt-1:Bt),Ie=(D,K,G,ee)=>{G>Se&&$.links.push({key:`${D.key}|link`,x:D.x,y:K,w:D.w,h:G,color:Y,layer:ee})},I=(D,K)=>{if(!(K.x<D.x||K.x+K.w>D.x+D.w)&&(D.x=K.x,D.w=K.w,D.ride.x=K.x,D.ride.w=K.w,D.band)){let G=D.band.x+D.band.w;D.band.x=K.x+K.w,D.band.w=Math.max(0,G-D.band.x)}},le=new Set;for(let D of[...pe].sort((K,G)=>G.s-K.s)){let K=D.ride;if(!K)continue;let G=pe.filter(te=>te!==D&&te.s>=D.en&&te.s-D.en<=Xi&&te.top>=D.bottom).sort((te,q)=>te.s-q.s||te.top-q.top)[0];if(!G)continue;le.add(D),I(D,G);let ee=ct(G),oe=G.top-D.bottom;Ie(K,D.bottom,oe+Se,ee-1),K.layer=ee-(oe>0?2:1),K.h+=Se,K.tuckBottom=Se}for(let D of[...pe].sort((K,G)=>K.s-G.s)){let K=D.ride;if(!K||le.has(D))continue;let G=pe.filter(te=>te!==D&&te.en<=D.s&&D.s-te.en<=Xi&&te.bottom<=D.top&&(te.card||te.ride?.layer!=null)).sort((te,q)=>q.en-te.en||q.bottom-te.bottom)[0];if(!G)continue;I(D,G);let ee=G.ride?.layer??Bt,oe=D.top-G.bottom;Ie(K,G.bottom-Se,oe+Se,ee-1),K.layer=ee-(oe>0?2:1),K.y-=Se,K.h+=Se,K.tuckTop=Se}}for(let B of h){let ae=c.get(B),Y=f.drivers[B];if(!Y)continue;let ue=[],pe=null;for(let I of Y.segments)if(!(I.start==null||I.end==null)){if(I.type==="home"){pe=null;continue}if(I.type==="stay"){pe=null,ue.push({type:"stay",g:I,s:I.start,en:I.end});continue}pe&&pe.en===I.start?(pe.en=I.end,pe.legs.push(I)):(pe={type:"trip",s:I.start,en:I.end,legs:[I]},ue.push(pe))}let ct=new Set,Ie=(I,le,D,K)=>{ct.add(I.id);let G=O(le),ee=J(I,ae.x+8,G,ae.w-16,Math.max(30,O(D)-G),!1,!1,B);ee.cut=L(le),K&&ee.drop?.tone==="normal"&&(ee.drop=null,ee.showDrop=!1),$.cards.push(ee)};for(let I of ue){if(R(I.en))continue;let le=O(I.s),D=Math.max(24,O(I.en)-le);if(I.type==="stay"){let q=V.get(I.g.event??I.g.serves??"");if(q?.own===B){Ie(q,I.s,I.en,!0);continue}let Ae=q?u.get(q.kid)??ce(0):ce(0),Et=I.g.kids.map(E);$.stays.push({cut:L(I.s),key:`${f.date}|stay|${B}|${I.s}`,x:ae.x+8,y:le,w:ae.w-16,h:D,target:he(q?.id),color:Ae,l1:q?`At ${q.title} with ${E(q.kid)}`:"Staying",l2:`until ${U(I.en)}`+(Et.length?` · ${Et.join(" and ")} too`:"")});continue}let K=I.legs[0],G=I.legs[I.legs.length-1],ee=[];for(let q of I.legs)for(let Ae of q.kids)ee.includes(Ae)||ee.push(Ae);let oe=G.type==="drive"&&G.to==="home",te=ns(I.legs,b);$.trips.push({key:`${f.date}|trip|${B}|${I.s}`,x:ae.x+8,y:le,w:ae.w-16,h:D,target:he(I.legs.find(q=>q.serves)?.serves),l1:K.type==="drive"&&K.from==="home"?`Leave ${U(I.s)}`:`From ${vn(b,K.from??K.place)} ${U(I.s)}`,l2:te.join(" → "),show2:D>=36,l3:oe?`Home ${U(I.en)}`:"",show3:oe&&D>=62,stops:null,kids:ee.map(q=>(u.get(q)??ce(0)).color),bad:I.legs.some(q=>q.overlaps_busy),aria:`${g(B)} drives ${te.join(" to ")}, ${U(I.s)} to ${U(I.en)}`})}for(let I of Y.segments)if(!(!I.overlaps_busy||I.start==null||I.end==null))for(let le of Y.busy){let D=Math.max(I.start,le.start),K=Math.min(I.end,le.end);K<=D||R(K)||$.overlaps.push({key:`${f.date}|overlap|${B}|${D}`,x:ae.x+6,y:O(D)-2,w:ae.w-12,h:Math.max(8,O(K)-O(D)+4)})}for(let I of f.events)if(I.own===B&&(!ct.has(I.id)&&!R(ke(I)[1])&&Ie(I,...ke(I),!1),I.takes!=null&&I.attending!==!1&&!R(I.end))){let le=O(I.start);$.windows.push({key:`${f.date}|window|${I.id}`,x:ae.x+4,y:le,w:ae.w-8,h:Math.max(24,O(I.end)-le),label:`${I.title} · any time ${U(I.start)}–${U(I.end)}`})}for(let I of Y.busy){if(I.event||I.end<=y||I.start>=M)continue;let le=Q(B,I),D=O(le.start),K=O(le.end);$.busy.push({key:`${f.date}|busy|${B}|${le.start}`,x:ae.x+1,y:D,w:ae.w-2,h:K-D,labelY:8,label:Ji(le,!1)})}}let F=-1/0;for(let B=y;B<=M;B+=30)$.grid.push({key:`${f.date}|grid|${B}`,y:O(B),strong:B%60===0}),B%60===0&&O(B)-F>=22&&($.hours.push({key:`${f.date}|hour|${B}`,y:O(B)-8,label:xi(B)}),F=O(B));f.date===n.date&&n.minutes>y&&n.minutes<M&&($.now={y:O(n.minutes),label:`Now ${U(n.minutes)}`}),_=O(M)+ts;return}let ne=[];for(let v of d){let C=c.get(v);for(let m of f.kids[v]?.items??[])if(m.start!=null){if(m.type==="act"){let y=V.get(m.event??"");if(!y)continue;ne.push({col:v,s:m.start,h:so(y,C.w),kind:"act",item:m})}else if(!f.rides[m.ride??-1]?.own){let y=f.rides[m.ride??-1],M=y?f.drivers[y.driver]?.outings.find(R=>R.start!=null&&R.start<=de(y.start)&&de(y.start)<=de(R.end,R.start)):void 0;ne.push({col:v,s:M?.start??m.start,h:Ra,kind:"along",item:m})}}}for(let v of h){let C=f.drivers[v];if(!C)continue;for(let y of C.busy)y.event||ne.push({col:v,s:y.start,h:32,kind:"busy",busy:Q(v,y)});let m=c.get(v).w;for(let y of f.events)y.own!==v||!y.busy_only&&y.attending!==!1&&(y.takes==null||y.planned!=null)||ne.push({col:v,s:ke(y)[0],h:so(y,m),kind:"own",event:y});for(let y of C.outings){if(y.start==null)continue;let R=[...eo(y.lines)?y.lines.slice(0,-1):y.lines,...y.warn?[y.warn]:[]].reduce((L,O)=>L+os(O,m-36,7),0);ne.push({col:v,s:y.start,h:30+R*16,kind:"out",out:y})}}ne.sort((v,C)=>v.s-C.s||l.indexOf(v.col)-l.indexOf(C.col));let se=new Map,fe=[],$e=new Map,lt=W-Qi;for(let v=0;v<ne.length;){let C=v,m=lt+Qi;for(;C<ne.length&&ne[C].s===ne[v].s;C++){let M=se.get(ne[C].col);M!=null&&(m=Math.max(m,M+mn))}let y=new Set;for(let M=v;M<C;M++){let R=ne[M],L=y.has(R.col)?se.get(R.col)+mn:m;y.add(R.col),se.set(R.col,L+R.h)}$e.set(ne[v].s,m),ne[v].s>0&&$.hours.push({key:`${f.date}|hour|${ne[v].s}`,y:m+2,label:He(ne[v].s)}),lt=m,v=C}se.clear(),ne.forEach((v,C)=>{let m=se.get(v.col),y=Math.max(m!=null?m+mn:W,$e.get(v.s));se.set(v.col,y+v.h);let M=v.kind==="busy"?v.busy.end:v.kind==="act"?V.get(v.item.event??"")?.end??null:v.kind==="own"?ke(v.event)[1]:null;fe.push({col:v.col,s:v.s,end:M,y,h:v.h,box:null}),$.anchors.push({t:H+v.s,y});let R=c.get(v.col);if(v.kind==="busy"){let L={key:`${f.date}|busy|${v.col}|${C}`,x:R.x+1,y,w:R.w-2,h:v.h,labelY:8,label:Ji(v.busy,!0)};$.busy.push(L),fe[fe.length-1].box=L}else if(v.kind==="out"){let L=v.out,O=eo(L.lines),F=O?L.lines.slice(0,-1):L.lines;$.trips.push({key:`${f.date}|trip|${v.col}|${C}`,x:R.x+8,y,w:R.w-16,h:v.h,target:he(L.target),l1:O?`${L.lead} · home ${O}`:L.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...F.map(B=>({text:B,warn:!1})),...L.warn?[{text:L.warn,warn:!0}]:[]],kids:L.kids.map(B=>(u.get(B)??ce(0)).color),bad:!!L.warn,aria:`${g(v.col)}: ${L.lead}. ${L.lines.join(". ")}${L.warn?`. ${L.warn}`:""}`})}else if(v.kind==="own"){let L=J(v.event,R.x+8,y,R.w-16,v.h,!1,!0,v.col);$.cards.push(L),fe[fe.length-1].box=L}else if(v.kind==="act"){let L=V.get(v.item.event??""),O=J(L,R.x,y,R.w,v.h,v.item.clash,!0,v.col);$.cards.push(O),fe[fe.length-1].box=O}else{let L=f.rides[v.item.ride??-1],O=ns(z(L.index),b),F=g(L.driver);$.rides.push({key:`${f.date}|ride|${L.index}`,x:R.x,y,w:R.w,h:v.h,target:Z(L.index),l1:`${Ot} with ${F}`,l2:O.join(" → "),show2:!1,lines2:ho,dashed:!0,clash:v.item.clash,aria:`${E(v.col)} riding along with ${F}, ${U(de(L.start))} to ${U(de(L.end))}: ${O.join(" to ")}`})}});let Re=W;for(let v of se.values())Re=Math.max(Re,v);for(let v of fe){if(!v.box||v.end==null)continue;let C=v.y+v.h;for(let m of fe)m.col!==v.col&&m.s>=v.s&&m.s<v.end&&(C=Math.max(C,m.y+m.h));v.end>=1440&&(C=Re);for(let m of fe)m.col===v.col&&m.y>v.y&&(C=Math.min(C,m.y-mn));C=Math.min(C,Re),C>v.y+v.h&&(v.box.h=C-v.y)}_=Re+ts+6,$.anchors.push({t:H+1439,y:_})}),$.height=_,$}var Ia=["","¼","½","¾"];function Qe(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Pt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=Ia[o%4];return`${i||!r?i:""}${r} min`})}function fo(s){let t=e=>e?{...e,text:Qe(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Qe),warn:i.warn==null?i.warn:Qe(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:Qe(n.title),body:Qe(n.body),note:n.note==null?n.note:Qe(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Qe(o.note)}))}:{}}))}))}}var Ba=2,Oa=48;function go(s,t,e=Oa){let n=[],o=new Set(ye(s)),i=Ee(s).map(u=>me(s,u)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],a=0,c=0,d=0,h=0,l=t.minutes+e*60;for(let u of s.days){let b=Me(t.date,u.date),E=b===0?"":`${be(u.date)} · `,g=new Map(u.events.map(f=>[f.id,f])),$=f=>f&&g.has(f)?{day:u.date,event:f}:null,_=(f,N)=>b*1440+(f??g.get(N??"")?.start??0)<l;for(let f of u.issues)if(f.level==="problem"){if(!_(f.at,f.event)){d++,f.kind==="unassigned"&&h++;continue}a++,f.kind==="unassigned"&&c++,n.push({key:`${u.date}|${f.key}`,tone:f.kind==="unassigned"?"unassigned":"problem",title:E+f.title,body:f.body,target:$(f.event),suggestions:(f.suggestions??[]).map(N=>({id:N.id,label:N.label,note:N.note}))})}if(u.clashes.forEach((f,N)=>{if(!_(f.a.start,f.a.event)){d++;return}a++;let H=g.get(f.a.event??""),V=me(s,f.kid),he=(k,x)=>{let P=$(x);return P?{text:k,target:P}:k},w=[];if(f.b.type==="act"){let k=g.get(f.b.event??"");H&&k&&(w=[he(H.title,H.id),` ${U(H.start)}–${U(H.end)} and `,he(k.title,k.id),` ${U(k.start)}–${U(k.end)} overlap.`])}else{let k=u.rides[f.b.ride??-1];H&&k&&(w=[`${V} is in `,he(`${ge(s,k.driver)}’s car`,k.serves[0]),` ${U(de(f.b.start))}–${U(de(f.b.end))}, during `,he(H.title,H.id),"."])}n.push({key:`${u.date}|clash|${N}`,tone:"problem",title:`${E}${V} is double-booked`,body:w.map(k=>typeof k=="string"?k:k.text).join(""),parts:w,target:null,suggestions:[]})}),b>=0&&b<Ba)for(let f of u.issues)f.level!=="heads_up"||!_(f.at,f.event)||n.push({key:`${u.date}|${f.key}`,tone:"heads_up",title:E+f.title,body:f.body,target:$(f.event),suggestions:[]});for(let f of u.unplaced??[]){if(!_(f.at)){d++;continue}a++;let N=f.people.map(V=>o.has(V)?ge(s,V):me(s,V)),H=f.from_notes?"The For line in its notes":"Its title";n.push({key:`${u.date}|unplaced|${f.id}`,tone:"problem",title:`${E}${U(f.at)} ${f.title}: ${mo(f).toLowerCase()}`,body:f.reason==="unknown"&&f.word?`${H} names “${f.word}”, who isn’t anyone in the family, so ${N.length?`it’s only in ${mt(N)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:u.date,id:f.id}})}for(let f of u.events)!f.problems.length||!_(f.start)||n.push({key:`${u.date}|notes|${f.id}`,tone:"heads_up",title:`${E}Check the notes on ${wn(s,f)}’s ${f.title}`,body:`These lines couldn’t be read: ${f.problems.join("; ")}`,target:$(f.id),suggestions:[]})}return{items:n,problems:a,unassigned:c,later:d,laterUnassigned:h}}function mo(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function Na(s,t,e,n,o=0){let i=new Set(ye(s)),r=E=>{let g=E[0];return g==null?null:i.has(g)?gt:e.get(g)??null},a=[...(t.all_day??[]).map(E=>({key:`${t.date}|allday|${E.id}`,title:E.title,note:E.days>1?`Day ${E.day_number} of ${E.days}`:"",color:r(E.people),cancelled:E.cancelled,warn:!1,pick:null,notes:E.notes??""})),...(t.unplaced??[]).map(E=>({key:`${t.date}|unplaced|${E.id}`,title:`${U(E.at)} ${E.title}`,note:mo(E),color:null,cancelled:!1,warn:!0,pick:E.id,notes:E.notes??""}))];if(!a.length)return null;let c=Math.max(120,n-ft),d=(E,g=7)=>30+g*E.title.length+(E.note?Math.min(g,5.6)*(E.note.length+2):0)+(E.notes?16:0),h=0,l=0;for(;h<a.length&&l+d(a[h],6.4)<=o;)l+=d(a[h++],6.4);let u=0;l=0;for(let E of a.slice(h)){let g=Math.min(c,d(E));(!u||l+g>c)&&(u++,l=0),l+=g}let b=u?u*Ea+(u-1)*oo:0;return{key:`${t.date}|allday`,h:b,chips:a,inline:h}}function bo(s,t){let e=xe(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=Me(t.date,i.date);if(!(r<0))for(let a of ye(s))for(let c of i.drivers[a]?.outings??[]){if(c.start==null)continue;let d=r*1440+c.start;if(r*1440+de(c.end,c.start)<=t.minutes)continue;let l=d-t.minutes,u={driver:a,name:ge(s,a),date:i.date,ahead:r,start:c.start,inMinutes:l,ongoing:l<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(b=>e.get(b)??ce(0)),warn:c.warn,target:c.target&&i.events.some(b=>b.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(u)<o(n)||o(u)===o(n)&&u.inMinutes<n.inMinutes)&&(n=u)}}return n}function bt(s){return s.state==="done"||s.state==="late"}var ja=780;function za(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<ja}function vo(s,t){return s.chores.map(e=>za(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function yo(s){return s.state==="open"||s.state==="overdue"}function ps(s,t,e){if(bt(s)){let n=s.done_at?Ha(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${hs(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${hs(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=Me(t,s.due);return`By ${o===1?"tomorrow":o<7?be(s.due):us(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${hs(s.for_day,t)}`;if(s.due&&s.due>t){let n=Me(t,s.due);return n===1?"By tomorrow":`By ${n<7?be(s.due):us(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function hs(s,t){let e=Me(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?be(s):us(s)}function us(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Ha(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${be(i)} ${r}`}function xo(s,t,e=1440){let n=vo(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(h=>h.kid===o.id),a=new Map;for(let h of r){if(h.state!=="upcoming")continue;let l=h.shows_from??h.due??s.today;a.set(l,[...a.get(l)??[],h])}let c=r.filter(h=>h.state==="overdue"),d=r.filter(h=>h.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??ce(i),overdue:c,now:d,done:r.filter(bt),later:[...a.entries()].sort(([h],[l])=>h.localeCompare(l)).map(([h,l])=>({date:h,chores:l})),left:c.length+d.length}})}function wo(s,t=1440){return vo(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function fs(s){return!s.chores.length&&!s.templates.length}var et=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function gs(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>et.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function ms(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${et[n[0]]}-${et[n.at(-1)]}`]:n.map(o=>et[o])).join(", ")}var tt="none";function kn(s){return s==="daily"||s==="school"?"":"Any"}function ko(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function $o(s){let t=s.days??kn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function bs(s){return s.title.trim()?s.who.length?s.days===tt?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function To(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function vs(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function ys(s,t,e=1,n=!1,o=!1){if(s==="school"){let h=t.trim().replace(/-/g,"–"),l=o?h?`${h} Bring lunch days`:"Bring lunch days":h?`${h} school days`:"Every school day";return n?`${l}, the night before`:l}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let d=`${a.split(",").map(h=>{let l=h.trim();return l.toLowerCase()==="last"?"the last day":/^\d+$/.test(l)?`the ${vs(Number(l))}`:`the ${l}`}).join(" and ")} ${r}`;return d[0].toUpperCase()+d.slice(1)}function xs(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function ws(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function $n(s,t){return`${s}|${t}`}function vt(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function Tn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Eo(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function _o(s,t){return Tn(t)<5&&!Eo(s,t)}function jt(s,t,e=new Map){if(!_o(s,t))return null;let n=$n(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function yt(s,t){return _o(s,t)?s.menus?.[t]??null:null}var Ua="From the school's menu feed.";function Fa(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Ua);return t.length?t.join(`
`):null}function Le(s){return s.slice(0,7)}function En(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function ks(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Co(s){let t=[];for(let e=Le(s.first);e<=Le(s.last);e=ks(e))t.push(e);return t}function Po(s,t,e,n=new Map){let o=`${e}-01`,i=vt(o,-Tn(o)),r=[];for(;Le(i)<=e;){let a=[];for(let c=0;c<5;c++){let d=vt(i,c),h=Le(d)!==e,l=h?null:Eo(t,d),u=h?null:jt(t,d,n);a.push({date:d,day:Number(d.slice(8)),outside:h,off:l?l.title:null,lunch:u?.lunch??null,picked:u?.picked??!1,menu:h?null:yt(t,d)?.dish??null,sides:h?null:Fa(yt(t,d)?.details??""),past:d<s.today,today:d===s.today})}a.some(c=>!c.outside)&&r.push(a),i=vt(i,7)}return r}function Ao(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Mo(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function So(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=vt(t,i),a=jt(s,r,n);if(!a)continue;let c=Me(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":be(r),date:r,menu:yt(s,r)?.dish??null}}return null}var Ka={timeline:"timeline",full:"timeline",compact:"compact"};function nt(s){let t=new URLSearchParams(s),e={},n=Ka[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var Wa=["auth_callback","code","state"];function $s(s){let t=new URLSearchParams(s);for(let n of Wa)t.delete(n);let e=t.toString();return e?`?${e}`:""}function Ts(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Va(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function Ga(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&Ts(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function qa(s,t){let e=new Set(s.events.filter(i=>Va(s,i)<=t).map(i=>i.id)),n=i=>Ts(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:Ga(r.segments,t),outings:r.outings.filter(a=>a.start==null||Ts(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function Lo(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?qa(e,t.minutes):e)}}var Do=Ge`
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
  /* Compact: the lines follow one another, with no gap opening up when the card is taller. */
  .card.wrap {
    justify-content: flex-start;
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
`;function Ya(s,t,e,n,o=14){let i=s.top-o-8,r=e.h-s.bottom-o-8,a=t.h<=i,c=t.h<=r,d=n?a||!c&&i>r:!c&&(a||i>r),h=d?s.top-o-t.h:s.bottom+o,l=Math.max(8,Math.min(h,e.h-8-t.h)),u=Math.max(8,Math.min(s.x-t.w/2,e.w-8-t.w));return{left:Math.round(u),top:Math.round(l),above:d}}function zt(s,t){for(let e of s.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var _n=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?zt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=zt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let i=this.press;!i||i.el!==e||!e.isConnected||(i.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&zt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=zt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&zt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let i=t.dataset.note;if(!i)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=i,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let a={w:r.offsetWidth,h:r.offsetHeight},c={w:window.innerWidth,h:window.innerHeight},d=Ya(e,a,c,n,o);r.style.left=`${d.left}px`,r.style.top=`${d.top}px`,r.classList.toggle("above",d.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};var vr="mydashlight.rides.view",Cc=1100,Pc=440,Ac=700,Mc=3*6e4,fr=1200,Sc=450,Lc=110;function Dc(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var In=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,gr=re`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,mr=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Rc=new URL("emoji.json",import.meta.url).href,br=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Ks=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Ws=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Ic=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Bc=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Ft={bring:"Bring",buy:"Buy"};function Oc(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Pe(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Vs(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Nc(s,t){return ds(s,t)||Ce(s).split(",")[0]}function jc(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function zc(){try{return localStorage.getItem(vr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function Hc(s){try{localStorage.setItem(vr,s)}catch{}}function Gs(s,t){return ye(s).includes(t)?ge(s,t):me(s,t)}function Kt(s){return s.days.every(t=>!t.events.length)}var Wt=class extends Te{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=nt(location.search).view;this.urlPage=nt(location.search).page;this.urlPast=nt(location.search).past;this.urlDayPicker=nt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Mc))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??zc(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new _n(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(d=>d.id===r);(!c||(c.picks[a]??null)===i||!jt(c,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&bt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=fo(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Cc)return!1;let e=this.plan;return!e||this.width-Pc>=rs(Ee(e).length,ye(e).length)}today(){return Ct(this.plan?.time_zone??Dc())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Lo(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=po(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(h=>h.date===this.pinDay)?.h??Nt,a=ls(e,i.scrollTop+r+4),c=n.days[Math.floor(a/1440)]?.date,d=c?o.days.findIndex(h=>h.date===c):-1;d>=0&&(this.keepAt=d*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,lo(o,e)-io(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let c=1/0;if(this.mode==="timeline"){for(let d of a.events)c=Math.min(c,d.arrive_by??d.start);for(let d of Object.values(a.drivers))for(let h of d.outings)h.start!=null&&(c=Math.min(c,h.start))}this.scrollToTime(r*1440+(Number.isFinite(c)?Math.max(0,c-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=n+1&&(o=c);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),a=this.today().date;if(r){let c=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),d=c>0?"up":"down";this.board.dayHeads.some(h=>h.date===a)&&o.date!==a?i=`${d}|Today`:this.mode==="timeline"&&Math.abs(c)>e.clientHeight*.6&&(i=`${d}|${o.date===a?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof ie?r:new ie("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??bt(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=yt(e,n),r=o.filter(a=>a.id===e.id||i&&yt(a,n)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof ie?o:new ie("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set($n(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let d of n)a.delete($n(e,d));this.lunchDraft=a;let c=r instanceof ie?r:new ie("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?$o(e):ko(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(pr(),ur))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||bs(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(To(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof ie?n:new ie("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof ie?n:new ie("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Nt;this.keepAt=n&&this.board?ls(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||Hc(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),i=this.plan;if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...Ee(i),...ye(i)]);this.forPick={day:e,id:n,placed:!1,label:`${U(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}changeForPick(e,n,o){let i=e.who?.[o.event_id],r=i?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${U(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!i?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let n=this.forPick,o=this.plan;if(!n||!o||!this.backend||!e&&!n.people.length)return;let i=e?[]:n.people;this.forPick={...n,busy:!0};try{await this.backend.setPeople(n.id,i,n.scope),this.forPick=null;let r=n.label.replace(/^\S+ /,""),a=i.map(c=>Gs(o,c));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:`Saved. ${r} is in ${mt(a)}’s ${a.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let a=r instanceof ie?r:new ie("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}}renderForPick(e){let n=this.plan,o=e.placed?n?.days.some(_=>_.date===e.day&&_.events.some(f=>f.id===e.id)):!!this.findUnplaced(e.day,e.id),i=p`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return p`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">Who is this for?</span></div>
          ${i}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let r=e.busy,a=_=>{this.forPick&&(this.forPick={...this.forPick,..._})},c=_=>a({people:e.people.includes(_)?e.people.filter(f=>f!==_):[...e.people,_]}),d=xe(n),h=Ee(n),l=h.length>1&&h.every(_=>e.people.includes(_)),b=[...h,...ye(n)].filter(_=>e.people.includes(_)),E=b.map(_=>Gs(n,_)),g=E.length<2?E.join(""):`${E.slice(0,-1).join(", ")} & ${E[E.length-1]}`,$=(_,f,N,H)=>p`<button
      type="button"
      class="who-chip"
      style="--c:${N.color};--rgb:${N.rgb}"
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
        ${i}
      </div>
      ${e.word?p`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:T}
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
          </div>`:T}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${h.map(_=>$(_,me(n,_),d.get(_)??ce(0),!1))}
        </div>
        ${h.length>1?p`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${l?"true":"false"}
              ?disabled=${r}
              @click=${()=>a({people:l?e.people.filter(_=>!h.includes(_)):[...h,...e.people.filter(_=>!h.includes(_))]})}
            >
              All the kids
            </button>`:T}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${ye(n).map(_=>$(_,ge(n,_),gt,!0))}
        </div>
      </div>
      <p class="field-hint">
        ${b.length?p`Saved in the event’s notes as <strong>For: ${g}</strong>, so its title stays as it is. It shows in ${b.length>1?"their lanes":`${E[0]}’s lane`}${b.some(_=>h.includes(_))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?p`<button type="button" class="chip clear" ?disabled=${r} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!b.length} @click=${()=>void this.saveForPick()}>
          ${r?"Saving to Google Calendar…":b.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderForLine(e,n,o){let i=e.who?.[o.event_id];if(!i)return T;let r=i.people.map(a=>Gs(e,a));return p`<span class="ed-for"
      >For ${mt(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,n,o)}>Change</button></span
    >`}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof ie?i:new ie("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),fr)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,i;o==null?i=n<0?Math.max(e.start+5,e.end-15):null:n<0?i=Math.max(e.start+5,o-5):i=o+5>=e.end?null:o+5,this.leaveDraft=i,this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),fr)}clearLeave(){this.leaveDraft=null,this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>i.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,Lc)},Sc)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?go(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?wo(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],c=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,d=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",h=p`<aside class="panel" aria-label=${d}>
      ${c??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,l=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<Ac?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${l?this.renderBanner(e):T}
          <main>
            ${l?p`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Kt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Kt(o)?this.renderDayRail(o):T}
                  ${n&&this.away?this.renderBackToToday(this.away):T}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${h}`:T}
          </main>
        </div>
        ${r?h:T}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:T}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),a="";if(e){let u=e.time_zone,b=new Date(e.updated);this.error?a=p`<span class="bad">${$i(this.error)} · showing the plan from ${en(b,new Date,u)}</span>`:e.status&&!e.status.ok?a=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${en(b,new Date,u)}</span>`:this.backend?.live||(a=`Updated ${en(b,new Date,u)}`)}let c=(u,b,E,g)=>p`
      <button type="button" class="seg-btn" title=${g} aria-pressed=${this.mode===u?"true":"false"} @click=${()=>this.setMode(u)}>
        ${E}<span class="seg-label">${b}</span>
      </button>
    `,d=(u,b,E)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===u?"true":"false"} @click=${()=>this.setPage(u)}>
        ${E}<span class="seg-label">${b}</span>
      </button>
    `,h=He(r.minutes),l=!!e&&Kt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${re`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:T}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ce(r.date)}, ${h}`}>
            <span class="hm">${h.slice(0,-3)}</span><span class="ampm">${h.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Ce(r.date)}${typeof a=="string"&&a?p`<span class="status"> · ${a}</span>`:T}
          </p>
          ${a&&typeof a!="string"?p`<p class="status">${a}</p>`:T}
        </div>
        ${e&&!l?this.renderNext(e,bo(e,r),n):T}
        <div class="controls">
          ${this.wide||l&&!o?T:p`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?T:p`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",re`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",re`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${d("rides","Rides",re`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${d("chores","Chores",re`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?T:d("lunch","Lunch",re`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let d=this.today().date,h=o.unassigned,l=o.laterUnassigned;if(h){let b=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${h} ${h===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?p`<div class="next idle needs">${b}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(l)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${l} ${l===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let u=e.days.some(b=>b.date>=d&&b.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${u?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${u?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${Pt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${be(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=p`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Pe(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(d=>p`<span class="kid-dot" style="background:${d.color}"></span>`)}</span>
        ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:T}
      </span>
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?p`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:p`<div class=${c}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return T;let n=this.today().date,o=xe(e),i=this.railShown;return p`<div
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
        ${e.days.map(r=>{let a=cs(r),c=r.events.length,d=r.events.slice(0,4).map(l=>l.own?gt.color:o.get(l.kid)?.color??ce(0).color),h=`${Ce(r.date)}: ${c?`${c} ${c===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return p`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${h}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":be(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${d.length?d.map(l=>p`<span class="rd-dot" style="background:${l}"></span>`):p`<span class="rd-free">free</span>`}
            </span>
            ${a?p`<span class="rd-badge" aria-hidden="true">${a}</span>`:T}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return p`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${re`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=Ee(e),o=ye(e),i=xe(e),r=n.map(a=>me(e,a));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>re`<circle cx=${50+c*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${jc(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=i.get(a);return p`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Pe(me(e,a))}</span>
            <span class="qw-name">${me(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Pe(ge(e,a))}</span>
            <span class="qw-name">${ge(e,a)}</span>
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
        ${e.inline?p`<div class="dh-chips">${e.allDay.slice(0,e.inline).map(o=>this.renderStripChip(e,o,n))}</div>`:T}
      </div>
      ${e.allDay.length>e.inline?p`<div class="day-strip" style="padding-left:${ft}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:T}`}renderStripChip(e,n,o){let i=p`<span class="strip-title">${n.title}</span>${n.note?p`<span class="strip-note">${n.note}</span>`:T}${n.notes?gr:T}`,r=n.pick;return r?p`<button
          type="button"
          class="strip-chip warn plain pick"
          tabindex=${o?-1:0}
          data-note=${n.notes||T}
          aria-label=${`${n.title}: ${n.note} Pick who it’s for`}
          @click=${()=>this.openForPick(e.date,r)}
        >
          ${i}
        </button>`:p`<span
          class="strip-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
          style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
          tabindex=${n.notes&&!o?0:T}
          data-note=${n.notes||T}
          >${i}</span
        >`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,i=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(l=>!l.own&&l.event_id===o.event.event_id).map(l=>l.id):[]),r=l=>!!l&&!!n&&l.day===n.day&&i.has(l.event),a=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],c=e.width,d=100,h=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??d-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??d})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??d+1}))].sort((l,u)=>l.z-u.z);return p`
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
          ${je(h,l=>l.x.key,l=>{if(l.t==="link"){let g=l.x;return p`<div
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
                </button>`}let u=l.x,b=u.color,E=u.skipped?`repeating-linear-gradient(135deg, rgba(${b.rgb},0.10) 0px, rgba(${b.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:u.stayed?`repeating-linear-gradient(135deg, rgba(${b.rgb},0.24) 0px, rgba(${b.rgb},0.24) 6px, rgba(${b.rgb},0.08) 6px, rgba(${b.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${b.rgb},0.15), rgba(${b.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${u.wrap?"wrap":""} ${r(u.target)?"sel":""} ${u.clash?"clash":""} ${u.skipped?"skipped":""} ${u.cut?"cut":""} ${u.event.notes?"noted":""}"
                aria-label=${u.aria}
                data-note=${u.event.notes||T}
                style="left:${u.x}px;top:${u.y}px;width:${u.w}px;height:${u.h}px;background:${E};border-color:${u.clash?"var(--bad)":`rgba(${b.rgb},0.45)`};--c:${b.color};--rgb:${b.rgb};--ring:${b.color}"
                @click=${()=>this.open(u.target)}
              >
                ${u.event.notes?gr:T}
                <span class="top">
                  <span class="title">${u.title}</span>
                  <span class="time">${u.time}</span>
                  ${u.showDrop&&u.drop?p`<span class="line tone-${u.drop.tone}">${u.drop.text}</span>`:T}
                </span>
                ${u.showPick&&u.pick?p`<span class="line tone-${u.pick.tone}">${u.pick.text}</span>`:T}
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
                ${l.show2?p`<span class="l2">${l.l2}</span>`:T}
                ${l.stops?l.stops.map(u=>p`<span class="stop ${u.warn?"warn":""}">${u.text}</span>`):T}
                ${l.show3?p`<span class="l3">${l.l3}</span>`:T}
              </button>`)}
          ${je(e.overlaps,l=>l.key,l=>p`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${je(e.marks,l=>l.key,l=>p`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${c-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:T}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,a=this.plan,c=i+n.length,d=this.chores,h=!!d&&!fs(d);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?T:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${h?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?p`<div class="attn-chores">${n.map(l=>this.renderChoreRow(l,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${re`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Kt(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
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
      ${this.wide&&a&&!Kt(a)&&this.page==="rides"?this.renderLegend():T}
    `}kidColorOf(e){let n=this.plan?xe(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return ce(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let i=this.lunch,r=i?.kids.find(l=>l.id===e);if(!i||!r)return T;this.tick;let a=this.today(),c=So(r,a.date,a.minutes,this.lunchDraft);if(!c)return T;let d=Ft[c.lunch],h=`${d} lunch ${c.when}${c.menu?`: ${c.menu}`:""}`;return n&&o<36+d.length*7.4?p`<span class="lunch-chip ${c.lunch} small icon" role="img" aria-label=${h} title=${h}
        >${c.lunch==="bring"?Ks:Ws}</span
      >`:p`<span class="lunch-chip ${c.lunch} ${n?"small":""}" title=${h}
      >${c.lunch==="bring"?Ks:Ws}<span class="lunch-chip-text"
        >${d}${n?T:` ${c.when}`}${!n&&c.menu?p`<span class="lunch-chip-menu"> · ${c.menu}</span>`:T}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Co(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Le(e.today),i=n.indexOf(o),r=h=>{let l=n[i+h];l&&(this.lunchMonth=l)},a=e.kids.some(h=>h.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(h=>h.id===a):e.kids,d=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:T;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${re`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${En(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${i<0||i>=n.length-1} @click=${()=>r(1)}>
            ${re`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":p`${mr} Edit menus`}
        </button>
      </div>
      ${d}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${c.length}">
        ${c.map(h=>this.renderLunchCard(e,h,o,a!==null))}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),a=Po(e,n,o,this.lunchDraft),c=Mo(a),d=a.flat(),h=d.filter(g=>!g.outside&&!g.past&&g.lunch),l=n.days_off.filter(g=>Le(g.first)<=o&&o<=Le(g.last)),u=g=>h.filter($=>Tn($.date)===g),b=g=>{let $=u(g);if(!$.length)return;let _=$.every(f=>f.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,$.map(f=>f.date),_)},E=h.length?`${c.bring} Bring · ${c.buy} Buy${o===Le(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Pe(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${E}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Ft[n.default]} unless picked</span>
          ${e.kids.length<2?T:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?Bc:Ic}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:T}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${En(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((g,$)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!u($).length}
            aria-label=${`${u($).every(_=>_.lunch==="bring")?"Buy":"Bring"} every ${g} left in ${En(o)} for ${n.name}`}
            @click=${()=>b($)}
          >
            ${g}
          </button>`)}
        ${d.map(g=>this.renderLunchCell(n,g,i))}
      </div>
      ${l.length?p`<p class="lunch-offs">
            No school:
            ${l.map(g=>{let $=g.first<`${o}-01`?`${o}-01`:g.first,_=Le(g.last)>o?vt(`${ks(o)}-01`,-1):g.last;return`${$===_?Vs($):`${Vs($)}–${Vs(_)}`} ${Ao(g.title)}`}).join(" · ")}
          </p>`:T}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return p`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,d=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),h=c?`${e.name}, ${Ce(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Ce(n.date)}: ${Ft[i]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Ft[r]}.`;return p`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${d?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${h}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?Ks:Ws}${Ft[i]}</span>
      ${n.menu?p`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?p`<span class="lunch-sides">${n.sides}</span>`:T}`:c?p`<span class="lunch-menu add">${In} Menu</span>`:T}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(_=>_.id===e.kid),a=(this.plan?xe(this.plan).get(e.kid):void 0)??ce(Math.max(0,r)),c=o.kids[r]?.name??"",d=i===bt(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},h=i&&d.done_by&&d.done_by!==e.kid?o.people?.find(_=>_.id===d.done_by)?.name??d.done_by_name??null:null,l=`${ps(d,o.today,o.time_zone)}${h?` · by ${h}`:""}`,u=i||yo(e),b=`${n?`${c}: `:""}${e.title}. ${l?`${l}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,E=p`<span class="box" aria-hidden="true"
        >${i?re`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:T}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:T}
      <span class="chore-text">
        <span class="chore-title">${n?p`<span class="chore-kid">${c}</span> · `:T}${e.title}</span>
        ${l?p`<span class="chore-note">${l}</span>`:T}
      </span>`,g=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${u?"":"later"}`,$=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return u?p`<button type="button" class=${g} style=${$} aria-pressed=${i?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${E}
        </button>`:p`<div class=${g} style=${$}>${E}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(fs(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${In} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:T;this.tick;let i=xo(e,this.plan?xe(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${In} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${mr} Manage chores</button>
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
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:T}
            ${r.now.length?p`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:T}
            ${r.done.length?p`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:T}
            ${r.later.map(c=>p`<h3 class="chore-group">${c.date===e.today?"Later today":Nc(c.date,e.today)}</h3>
                ${c.chores.map(d=>this.renderChoreRow(d))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?p`<p class="chore-none">No chores this week.</p>`:T}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?xe(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(ws).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${xs(e.who,o,e.take_turns)} · ${ys(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:T}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let d=o.findIndex(l=>l.id===c),h=i?.get(c)??ce(Math.max(0,d));return p`<span class="kid-dot" style="background:${h.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${In} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?p`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:T}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return p``;let o=n.kids,i=this.plan?xe(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(g=>g.id===e.template):void 0,c=bs(e),d=(a?.problems??[]).filter(g=>g!=="who:"),h=(g,$,_,f=!1)=>p`<button type="button" class="choice ${f?"wide":""}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${_}>${$}</button>`,l=(g,$,_,f)=>p`<button type="button" class="chip" aria-pressed=${g?"true":"false"} aria-label=${f??T} ?disabled=${r} @click=${_}>${$}</button>`,u=g=>{g!==e.repeats&&this.changeDraft({repeats:g,days:a&&a.repeats===g?a.days??kn(g):kn(g)})},b=g=>{let $=e.who.includes(g)?e.who.filter(_=>_!==g):o.filter(_=>_.id===g||e.who.includes(_.id)).map(_=>_.id);this.changeDraft({who:$})},E;if(e.repeats==="school"){let g=e.days===tt?new Set:e.days===""?new Set([0,1,2,3,4]):gs(e.days)??new Set,$=_=>{let f=new Set(g);f.has(_)?f.delete(_):f.add(_),this.changeDraft({days:f.size===5?"":f.size?ms(f):tt})};E=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${et.slice(0,5).map((_,f)=>l(g.has(f),_.slice(0,2),()=>$(f),_))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${h(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${h(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${h(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let g=e.days.trim(),$=/^\d+$/.test(g)?Number(g):null,_=g&&g.toLowerCase()!=="any"&&g.toLowerCase()!=="last"&&$===null;E=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${_?4:3}, minmax(0, 1fr))">
          ${h(g===""||g.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${h($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${h(g.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${_?h(!0,g,()=>{}):T}
        </div>
        ${$!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${vs($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${g.toLowerCase()==="last"?"Due on the month’s last day.":_?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")E=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let g=e.days===""||e.days.toLowerCase()==="any",$=e.days===tt?new Set:g?new Set:gs(e.days)??new Set,_=f=>{let N=new Set($);N.has(f)?N.delete(f):N.add(f),this.changeDraft({days:N.size?ms(N)||"Mon-Sun":tt})};E=p`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${h(g,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${h(!g,"On set days",()=>this.changeDraft({days:g?"Sat":e.days}))}
        </div>
        ${g?p`<p class="field-hint">Shows all week, due on Sunday.</p>`:p`<div role="group" aria-label="Days of the week" class="day-chips">
                ${et.map((f,N)=>l($.has(N),f.slice(0,2),()=>_(N),f))}
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
          <span class="ed-meta">${e.who.length?xs(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===tt?"No days picked":ys(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${d.length?p`<p class="field-hint bad">${d.map(ws).join(". ")}. Saving fixes it.</p>`:T}
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
          ${br.map(g=>l(e.icon===g,g,()=>this.changeDraft({icon:e.icon===g?null:g}),`Picture ${g}`))}
          ${e.icon&&!br.includes(e.icon)?l(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):T}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${Rc}
              @emoji-click=${g=>{let $=g.detail.unicode;$&&this.changeDraft({icon:$}),this.iconMore=!1}}
            ></emoji-picker>`:T}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((g,$)=>{let _=i?.get(g.id)??ce($),f=e.who.includes(g.id);return p`<button type="button" class="who-chip" style="--c:${_.color};--rgb:${_.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${r} @click=${()=>b(g.id)}>
              <span class="avatar" aria-hidden="true">${Pe(g.name)}</span>${g.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${h(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${h(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:T}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${h(e.repeats==="daily","Every day",()=>u("daily"))}
          ${h(e.repeats==="weekly","Every week",()=>u("weekly"))}
          ${h(e.repeats==="monthly","Every month",()=>u("monthly"))}
          ${h(e.repeats==="school","School days",()=>u("school"))}
        </div>
      </div>
      ${E}
      ${e.repeats==="school"?T:p`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Oc(e.repeats,e.every)}</span>
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
              ${h(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return p``;let o=e.busy,i=h=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...h})},r=h=>i({kids:e.kids.includes(h)?e.kids.filter(l=>l!==h):[...e.kids,h]}),a=n.kids.filter(h=>jt(h,e.date)),c=e.dish.trim(),d=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return p`
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
          @input=${h=>i({dish:h.target.value})}
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
          @input=${h=>i({details:h.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${a.map(h=>{let l=this.kidColorOf(h.id),u=e.kids.includes(h.id);return p`<button type="button" class="who-chip" style="--c:${l.color};--rgb:${l.rgb}" aria-pressed=${u?"true":"false"} ?disabled=${o} @click=${()=>r(h.id)}>
              <span class="avatar" aria-hidden="true">${Pe(h.name)}</span>${h.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!d} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":d??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return p``;let o=n.people?.length?n.people:n.kids.map(l=>({...l,role:"kid"})),i=n.kids.findIndex(l=>l.id===e.kid),r=n.kids[i],a=this.plan?xe(this.plan):void 0,c=a?.get(e.kid)??ce(Math.max(0,i)),d=o.filter(l=>l.id!==e.kid),h=l=>{let u=n.kids.findIndex(b=>b.id===l.id);return u>=0?(a?.get(l.id)??ce(u)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${ps(e,n.today,n.time_zone)}</span>
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
              ${d.map(l=>p`<button type="button" class="done-by" style="--c:${h(l)}" @click=${()=>void this.toggleChore(e,l.id)}>
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
    </div>`}ownHint(e,n){let o=wn(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${U(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${U(n.start)} to ${U(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>ye(e).includes(r)?ge(e,r):me(e,r));return`${o} drives there and back${i.length?`, with ${mt(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:o,event:i}=n,r=ye(e),a=ao(e,i),c=wn(e,i),d=!!this.pending,h=C=>this.pending?.key===C?this.pending.value:void 0,l=[...e.people?.carpools??[]];for(let C of e.days)for(let m of C.events)for(let y of[m.drop,m.pick])y&&y!=="none"&&!r.includes(y)&&!l.some(M=>M.toLowerCase()===y.toLowerCase())&&l.push(y);let u=C=>{if(!i.sides.includes(C))return T;let m=h(C)??h("both"),y=C==="drop"?i.drop:i.pick,M=m!==void 0?String(m):i.no_ride_unless_named&&y==="none"?"":y,R=M===""&&!(m===void 0&&i.no_ride_unless_named),L=M&&M!=="none"&&!r.includes(M)?M:"",O=Y=>{this.otherOpen=null,this.setRide(i,C,M===Y?"":Y,r)},F=[...r.map(Y=>[Y,as(e,Y)]),["none","Not needed"]],B=`${i.id}|${C}`,ae=this.otherOpen===B;return p`<div class="field ride-box">
        <span class="field-label">${C==="drop"?"Drop-off":"Pick-up"} ${R?p`<span class="nobody">· nobody yet</span>`:T}</span>
        <div role="group" aria-label=${C==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${F.length+1}, minmax(0, 1fr))">
          ${F.map(([Y,ue])=>p`<button type="button" class="choice" aria-pressed=${M===Y?"true":"false"} ?disabled=${d} @click=${()=>O(Y)}>
                ${ue}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${L?"true":"false"}
            aria-expanded=${ae?"true":"false"}
            ?disabled=${d}
            @click=${()=>this.otherOpen=ae?null:B}
          >
            ${L||"Other"}
          </button>
        </div>
        ${ae?p`${l.length?p`<div role="group" aria-label=${C==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${l.map(Y=>p`<button type="button" class="chip" aria-pressed=${M.toLowerCase()===Y.toLowerCase()?"true":"false"} ?disabled=${d} @click=${()=>O(Y)}>
                    ${Y}
                  </button>`)}
            </div>`:T}
        <input
          type="text"
          .value=${L&&!l.some(Y=>Y.toLowerCase()===L.toLowerCase())?L:""}
          ?disabled=${d}
          aria-label=${C==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${Y=>{let ue=Y.target.value.trim();ue&&ue!==M&&O(ue)}}
          @keydown=${Y=>{Y.key==="Enter"&&Y.target.blur()}}
        />`:T}
        ${!_&&M!==""&&M!=="none"?b(C,M):T}
      </div>`},b=(C,m)=>{let y=h(`along-${C}`),M=y!==void 0?y:C==="pick"?i.pick_along??[]:i.along,R=new Set(o.events.filter(F=>F.event_id===i.event_id&&!F.own).map(F=>F.kid)),L=[...Ee(e).filter(F=>F!==i.kid&&!R.has(F)),...r.filter(F=>F!==m)];return L.length?p`<div class="field-sub">
        <span class="field-label">${C==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${C==="pick"?"Coming home too. Anyone already there just gets in.":C==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${C==="drop"?"Riding along on the drop-off":C==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${L.map(F=>p`<button type="button" class="chip" aria-pressed=${M.includes(F)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(i,F,C)}>
              ${r.includes(F)?ge(e,F):me(e,F)}
            </button>`)}
        </div>
      </div>`:T},E=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",g=i.drop===i.pick&&r.includes(i.drop),$=h("stay"),_=$!==void 0?!!$:i.stay&&g,f=h("along"),N=f!==void 0?f:i.along,H=i.own?[...Ee(e),...r.filter(C=>C!==i.own)]:[],V=i.own!=null&&i.takes!=null,he=i.own!=null&&!V,w=h("takes"),k=w!==void 0?w:i.takes??null,x=h("arrive"),P=this.arriveDraft!==void 0?this.arriveDraft:x!==void 0?x:i.arrive_by,A=h("leave"),S=this.leaveDraft!==void 0?this.leaveDraft:A!==void 0?A:i.leave_by??null,j=(C,m)=>{let y=C==="arrive",M=L=>()=>y?this.nudgeArrive(i,L):this.nudgeLeave(i,L),R=(L,O,F,B)=>p`<button
          type="button"
          class="step"
          aria-label=${O}
          ?disabled=${d||B}
          @pointerdown=${()=>this.startHold(M(L))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(M(L))}
        >
          ${F}
        </button>`;return p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${y?"Arrive by":"Leave by"}</span>
          <span class="field-hint">${y?`${i.start-m} min before it starts`:`${i.end-m} min before it ends`}</span>
        </span>
        <span class="stepper">
          ${R(-5,"Five minutes earlier","−",!y&&m-5<=i.start)}
          <span class="arrive-value">${U(m)}</span>
          ${R(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${y?"Clear arrive-by time":"Clear leave-by time"}
            ?disabled=${d}
            @click=${()=>y?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},W=i.sides.includes("pick")||i.own!=null,X=()=>p`${P!=null?j("arrive",P):T}
      ${S!=null?j("leave",S):T}
      ${P==null||S==null&&W?p`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${P==null?p`<button type="button" class="chip" ?disabled=${d} @click=${()=>this.nudgeArrive(i,-5)}>Arrive early</button>`:T}
              ${S==null&&W?p`<button type="button" class="chip" ?disabled=${d} @click=${()=>this.nudgeLeave(i,-5)}>Leave early</button>`:T}
            </div>
          </div>`:T}`,J=i.sides.includes("drop")&&i.sides.includes("pick"),z=J&&(_||this.stayDraft===i.id),Z=()=>{let C=J?p`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${z?"false":"true"}
              ?disabled=${d}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,E)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${z?"true":"false"}
              ?disabled=${d}
              @click=${()=>{E?this.toggleStay(i,!0,E):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:T;if(!z)return p`${C} ${u("drop")} ${u("pick")}`;let m=_&&g?i.drop:"";return p`${C}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${m?T:p`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(y=>p`<button
                type="button"
                class="choice"
                aria-pressed=${m===y?"true":"false"}
                ?disabled=${d}
                @click=${()=>{if(m===y||!this.backend)return;let M=this.backend;this.stayDraft=null,this.save("stay",!0,()=>M.setRide(i.id,"both",y,this.scope,!0))}}
              >
                ${ge(e,y)}
              </button>`)}
          </div>
          ${m?b("both",m):T}
        </div>`},Q=[],ke=C=>C==="none"?"Not needed":as(e,C),_e=C=>r.includes(C)?ge(e,C):me(e,C),ne=(C,m,y)=>{m===""&&!y.length||Q.push(`${C}: ${[m===""?"TBD":ke(m),...y.map(_e)].join(", ")}`)},se=C=>i.no_ride_unless_named&&C==="none"?"":C;i.own||ne("Drop-off",se(i.drop),i.along),i.own||ne("Pick-up",se(i.pick),i.pick_along??[]),!i.own&&i.stay&&Q.push("Stay: yes"),V&&Q.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&Q.push(`Take along: ${i.along.map(_e).join(", ")}`),i.arrive_by!=null&&Q.push(`Arrive by: ${He(i.arrive_by)}`),i.leave_by!=null&&Q.push(`Leave by: ${He(i.leave_by)}`);let fe=h("attending"),$e=fe!==void 0?!!fe:i.attending!==!1;i.attending===!1&&Q.splice(0,Q.length,"Attending: no");let lt=o.date===this.today().date?"":`${be(o.date)} · `,Re=xn(i),v=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${lt}${V?"any time ":""}${Re}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
          ${this.renderForLine(e,o,i)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let C=i.place_name&&i.place_name!==i.title?i.place_name:"",m=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return p`${v}
        ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
        ${C?p`<div class="field"><span class="field-label">Where</span><span class="field-hint">${C}</span></div>`:T}
        <p class="field-hint">
          ${$e?`This blocks ${c}’s time: ${c} can’t drive then, so a ride that needs ${c} shows as a problem.`:`Not going, so it doesn’t block ${c}’s time, and ${c} can drive then.`}
          ${m}
        </p>
        <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setAttending(i,!$e)}>
          ${$e?`${c} isn’t going this time`:`${c} is going after all`}
        </button>
        ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:T}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?p`${v}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${v}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
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
          </div>`:T}
      ${$e?p`${i.where==="anywhere"?p`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:T}
            ${i.own?p`<p class="field-hint">${this.ownHint(e,i)}</p>`:Z()}
      ${i.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${k!=null?`Takes ${k} min, any time ${U(i.start)}–${U(i.end)}`:"At its set time"}</span>
            </span>
            ${k!=null?p`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${d||k<=5} @click=${()=>this.setTakes(i,Math.max(5,k-5))}>−</button>
                  <span class="arrive-value">${k} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${d||k+5>i.end-i.start} @click=${()=>this.setTakes(i,k+5)}>+</button>
                </span>`:T}
          </div>
          <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setTakes(i,k!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${k!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:T}
      ${he&&H.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${H.map(C=>p`<button type="button" class="chip" aria-pressed=${N.includes(C)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(i,C)}>
                  ${r.includes(C)?ge(e,C):me(e,C)}
                </button>`)}
            </div>
          </div>`:T}
      ${V?T:X()}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${c} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setAttending(i,!$e)}>
        ${$e?`${c} isn’t going this time`:`${c} is going after all`}
      </button>
      ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:T}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${Q.length?Q.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${$e&&!i.own?p`<p class="field-hint">Tap a selected driver again to clear it.</p>`:T}
    `}};Wt.styles=Do,Wt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Wt);function Uc(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function yr(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=i=>{if(i)for(let r of Uc())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),s)}function xr(s){try{return new URL(s).searchParams.get("v")}catch{return null}}function wr(s,t,e){if(!t)return()=>{};let n=e.everyMs??6e5,o=e.retryMs??3e4,i=e.idleMs??12e4,r=null,a=null,c=0,d=!1,h=E=>{if(d||a)return;let g=e.idleFor();if(g>=i){e.reload(E);return}a=setTimeout(()=>{a=null,h(E)},i-g)},l=async()=>{try{let E=await s.sendMessagePromise({type:"mydashlight/app_version"});c=0;let g=E["kiosk.js"];!d&&g&&g!==t&&h(g)}catch{if(d||r||++c>20)return;r=setTimeout(()=>{r=null,l()},o)}},u=()=>{c=0,l()};s.addEventListener?.("ready",u);let b=setInterval(()=>void l(),n);return()=>{d=!0,clearInterval(b),r&&clearTimeout(r),a&&clearTimeout(a),s.removeEventListener?.("ready",u)}}function kr(s,t=6e4,e=15e3){let n=null,o=setInterval(()=>{if(!s.connected||n)return;let i=!1;n=setTimeout(()=>{n=null,!i&&s.connected&&s.reconnect(!0)},e);let r=()=>{i=!0,n&&clearTimeout(n),n=null};s.ping().then(r,r)},t);return()=>{clearInterval(o),n&&clearTimeout(n),n=null}}var $r=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],Tr=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Er(s,t,e,n){let o=Math.max(0,Math.min(t,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+n+s.slice(i),caret:o+n.length}}function _r(s,t,e){let n=Math.max(0,Math.min(t,s.length)),o=Math.max(n,Math.min(e,s.length));if(n!==o)return{value:s.slice(0,n)+s.slice(o),caret:n};if(n===0)return{value:s,caret:0};let i=Array.from(s.slice(0,n));i.pop();let r=i.join("");return{value:r+s.slice(n),caret:r.length}}function Cr(s,t){return t===0||/\s$/.test(s.slice(0,t))}var Fc=new Set(["text","search","email","url","tel","number","password"]);function Pr(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Fc.has(s.type)&&!s.readOnly&&!s.disabled}var Kc={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Wc={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Vt=class extends Te{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=Cr(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(n),r=_r(n.value,o,i);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(n),a=Er(n.value,i,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":Kc[e]??(this.shift?e.toUpperCase():e);return p`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${Wc[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):T}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?$r:Tr;return p`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>p`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};Vt.styles=Ge`
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
  `,Vt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Vt);function Vc(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function Ar(s){let t=new WeakSet,e=r=>{let a=r.composedPath();i(a);let c=a[0];Pr(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=Vc();!s.target||r===s.target||(Pr(r)?s.attach(r):s.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var qs="mydashlight",Gc=`/api/${qs}/pair`,qc=`/api/${qs}/pair/poll`,Ys=`/${qs}`,Xs="pair";function Mr(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Sr(s,t){return`${s}${Ys}?${Xs}=${encodeURIComponent(t)}`}function Yc(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var at=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function Lr(s=fetch){let t=await s(Gc,{method:"POST",cache:"no-store"});if(t.status===429)throw new at("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new at(`Home Assistant answered ${t.status}.`);return await t.json()}async function Dr(s,t,e=fetch){let n=await e(qc,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new at(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:Yc(t,o.auth)}:{status:"pending"}}var Tt=function(s,t){let o=s,i=Gt[t],r=null,a=0,c=null,d=[],h={},l=function(w,k){a=o*4+17,r=(function(x){let P=new Array(x);for(let A=0;A<x;A+=1){P[A]=new Array(x);for(let S=0;S<x;S+=1)P[A][S]=null}return P})(a),u(0,0),u(a-7,0),u(0,a-7),g(),E(),_(w,k),o>=7&&$(w),c==null&&(c=H(o,i,d)),f(c,k)},u=function(w,k){for(let x=-1;x<=7;x+=1)if(!(w+x<=-1||a<=w+x))for(let P=-1;P<=7;P+=1)k+P<=-1||a<=k+P||(0<=x&&x<=6&&(P==0||P==6)||0<=P&&P<=6&&(x==0||x==6)||2<=x&&x<=4&&2<=P&&P<=4?r[w+x][k+P]=!0:r[w+x][k+P]=!1)},b=function(){let w=0,k=0;for(let x=0;x<8;x+=1){l(!0,x);let P=Ke.getLostPoint(h);(x==0||w>P)&&(w=P,k=x)}return k},E=function(){for(let w=8;w<a-8;w+=1)r[w][6]==null&&(r[w][6]=w%2==0);for(let w=8;w<a-8;w+=1)r[6][w]==null&&(r[6][w]=w%2==0)},g=function(){let w=Ke.getPatternPosition(o);for(let k=0;k<w.length;k+=1)for(let x=0;x<w.length;x+=1){let P=w[k],A=w[x];if(r[P][A]==null)for(let S=-2;S<=2;S+=1)for(let j=-2;j<=2;j+=1)S==-2||S==2||j==-2||j==2||S==0&&j==0?r[P+S][A+j]=!0:r[P+S][A+j]=!1}},$=function(w){let k=Ke.getBCHTypeNumber(o);for(let x=0;x<18;x+=1){let P=!w&&(k>>x&1)==1;r[Math.floor(x/3)][x%3+a-8-3]=P}for(let x=0;x<18;x+=1){let P=!w&&(k>>x&1)==1;r[x%3+a-8-3][Math.floor(x/3)]=P}},_=function(w,k){let x=i<<3|k,P=Ke.getBCHTypeInfo(x);for(let A=0;A<15;A+=1){let S=!w&&(P>>A&1)==1;A<6?r[A][8]=S:A<8?r[A+1][8]=S:r[a-15+A][8]=S}for(let A=0;A<15;A+=1){let S=!w&&(P>>A&1)==1;A<8?r[8][a-A-1]=S:A<9?r[8][15-A-1+1]=S:r[8][15-A-1]=S}r[a-8][8]=!w},f=function(w,k){let x=-1,P=a-1,A=7,S=0,j=Ke.getMaskFunction(k);for(let W=a-1;W>0;W-=2)for(W==6&&(W-=1);;){for(let X=0;X<2;X+=1)if(r[P][W-X]==null){let J=!1;S<w.length&&(J=(w[S]>>>A&1)==1),j(P,W-X)&&(J=!J),r[P][W-X]=J,A-=1,A==-1&&(S+=1,A=7)}if(P+=x,P<0||a<=P){P-=x,x=-x;break}}},N=function(w,k){let x=0,P=0,A=0,S=new Array(k.length),j=new Array(k.length);for(let z=0;z<k.length;z+=1){let Z=k[z].dataCount,Q=k[z].totalCount-Z;P=Math.max(P,Z),A=Math.max(A,Q),S[z]=new Array(Z);for(let se=0;se<S[z].length;se+=1)S[z][se]=255&w.getBuffer()[se+x];x+=Z;let ke=Ke.getErrorCorrectPolynomial(Q),ne=qt(S[z],ke.getLength()-1).mod(ke);j[z]=new Array(ke.getLength()-1);for(let se=0;se<j[z].length;se+=1){let fe=se+ne.getLength()-j[z].length;j[z][se]=fe>=0?ne.getAt(fe):0}}let W=0;for(let z=0;z<k.length;z+=1)W+=k[z].totalCount;let X=new Array(W),J=0;for(let z=0;z<P;z+=1)for(let Z=0;Z<k.length;Z+=1)z<S[Z].length&&(X[J]=S[Z][z],J+=1);for(let z=0;z<A;z+=1)for(let Z=0;Z<k.length;Z+=1)z<j[Z].length&&(X[J]=j[Z][z],J+=1);return X},H=function(w,k,x){let P=Rr.getRSBlocks(w,k),A=Ir();for(let j=0;j<x.length;j+=1){let W=x[j];A.put(W.getMode(),4),A.put(W.getLength(),Ke.getLengthInBits(W.getMode(),w)),W.write(A)}let S=0;for(let j=0;j<P.length;j+=1)S+=P[j].dataCount;if(A.getLengthInBits()>S*8)throw"code length overflow. ("+A.getLengthInBits()+">"+S*8+")";for(A.getLengthInBits()+4<=S*8&&A.put(0,4);A.getLengthInBits()%8!=0;)A.putBit(!1);for(;!(A.getLengthInBits()>=S*8||(A.put(236,8),A.getLengthInBits()>=S*8));)A.put(17,8);return N(A,P)};h.addData=function(w,k){k=k||"Byte";let x=null;switch(k){case"Numeric":x=Xc(w);break;case"Alphanumeric":x=Jc(w);break;case"Byte":x=Zc(w);break;case"Kanji":x=Qc(w);break;default:throw"mode:"+k}d.push(x),c=null},h.isDark=function(w,k){if(w<0||a<=w||k<0||a<=k)throw w+","+k;return r[w][k]},h.getModuleCount=function(){return a},h.make=function(){if(o<1){let w=1;for(;w<40;w++){let k=Rr.getRSBlocks(w,i),x=Ir();for(let A=0;A<d.length;A++){let S=d[A];x.put(S.getMode(),4),x.put(S.getLength(),Ke.getLengthInBits(S.getMode(),w)),S.write(x)}let P=0;for(let A=0;A<k.length;A++)P+=k[A].dataCount;if(x.getLengthInBits()<=P*8)break}o=w}l(!1,b())},h.createTableTag=function(w,k){w=w||2,k=typeof k>"u"?w*4:k;let x="";x+='<table style="',x+=" border-width: 0px; border-style: none;",x+=" border-collapse: collapse;",x+=" padding: 0px; margin: "+k+"px;",x+='">',x+="<tbody>";for(let P=0;P<h.getModuleCount();P+=1){x+="<tr>";for(let A=0;A<h.getModuleCount();A+=1)x+='<td style="',x+=" border-width: 0px; border-style: none;",x+=" border-collapse: collapse;",x+=" padding: 0px; margin: 0px;",x+=" width: "+w+"px;",x+=" height: "+w+"px;",x+=" background-color: ",x+=h.isDark(P,A)?"#000000":"#ffffff",x+=";",x+='"/>';x+="</tr>"}return x+="</tbody>",x+="</table>",x},h.createSvgTag=function(w,k,x,P){let A={};typeof arguments[0]=="object"&&(A=arguments[0],w=A.cellSize,k=A.margin,x=A.alt,P=A.title),w=w||2,k=typeof k>"u"?w*4:k,x=typeof x=="string"?{text:x}:x||{},x.text=x.text||null,x.id=x.text?x.id||"qrcode-description":null,P=typeof P=="string"?{text:P}:P||{},P.text=P.text||null,P.id=P.text?P.id||"qrcode-title":null;let S=h.getModuleCount()*w+k*2,j,W,X,J,z="",Z;for(Z="l"+w+",0 0,"+w+" -"+w+",0 0,-"+w+"z ",z+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',z+=A.scalable?"":' width="'+S+'px" height="'+S+'px"',z+=' viewBox="0 0 '+S+" "+S+'" ',z+=' preserveAspectRatio="xMinYMin meet"',z+=P.text||x.text?' role="img" aria-labelledby="'+V([P.id,x.id].join(" ").trim())+'"':"",z+=">",z+=P.text?'<title id="'+V(P.id)+'">'+V(P.text)+"</title>":"",z+=x.text?'<description id="'+V(x.id)+'">'+V(x.text)+"</description>":"",z+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',z+='<path d="',X=0;X<h.getModuleCount();X+=1)for(J=X*w+k,j=0;j<h.getModuleCount();j+=1)h.isDark(X,j)&&(W=j*w+k,z+="M"+W+","+J+Z);return z+='" stroke="transparent" fill="black"/>',z+="</svg>",z},h.createDataURL=function(w,k){w=w||2,k=typeof k>"u"?w*4:k;let x=h.getModuleCount()*w+k*2,P=k,A=x-k;return sd(x,x,function(S,j){if(P<=S&&S<A&&P<=j&&j<A){let W=Math.floor((S-P)/w),X=Math.floor((j-P)/w);return h.isDark(X,W)?0:1}else return 1})},h.createImgTag=function(w,k,x){w=w||2,k=typeof k>"u"?w*4:k;let P=h.getModuleCount()*w+k*2,A="";return A+="<img",A+=' src="',A+=h.createDataURL(w,k),A+='"',A+=' width="',A+=P,A+='"',A+=' height="',A+=P,A+='"',x&&(A+=' alt="',A+=V(x),A+='"'),A+="/>",A};let V=function(w){let k="";for(let x=0;x<w.length;x+=1){let P=w.charAt(x);switch(P){case"<":k+="&lt;";break;case">":k+="&gt;";break;case"&":k+="&amp;";break;case'"':k+="&quot;";break;default:k+=P;break}}return k},he=function(w){w=typeof w>"u"?2:w;let x=h.getModuleCount()*1+w*2,P=w,A=x-w,S,j,W,X,J,z={"██":"█","█ ":"▀"," █":"▄","  ":" "},Z={"██":"▀","█ ":"▀"," █":" ","  ":" "},Q="";for(S=0;S<x;S+=2){for(W=Math.floor((S-P)/1),X=Math.floor((S+1-P)/1),j=0;j<x;j+=1)J="█",P<=j&&j<A&&P<=S&&S<A&&h.isDark(W,Math.floor((j-P)/1))&&(J=" "),P<=j&&j<A&&P<=S+1&&S+1<A&&h.isDark(X,Math.floor((j-P)/1))?J+=" ":J+="█",Q+=w<1&&S+1>=A?Z[J]:z[J];Q+=`
`}return x%2&&w>0?Q.substring(0,Q.length-x-1)+Array(x+1).join("▀"):Q.substring(0,Q.length-1)};return h.createASCII=function(w,k){if(w=w||1,w<2)return he(k);w-=1,k=typeof k>"u"?w*2:k;let x=h.getModuleCount()*w+k*2,P=k,A=x-k,S,j,W,X,J=Array(w+1).join("██"),z=Array(w+1).join("  "),Z="",Q="";for(S=0;S<x;S+=1){for(W=Math.floor((S-P)/w),Q="",j=0;j<x;j+=1)X=1,P<=j&&j<A&&P<=S&&S<A&&h.isDark(W,Math.floor((j-P)/w))&&(X=0),Q+=X?J:z;for(W=0;W<w;W+=1)Z+=Q+`
`}return Z.substring(0,Z.length-1)},h.renderTo2dContext=function(w,k){k=k||2;let x=h.getModuleCount();for(let P=0;P<x;P++)for(let A=0;A<x;A++)w.fillStyle=h.isDark(P,A)?"black":"white",w.fillRect(A*k,P*k,k,k)},h};Tt.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};Tt.createStringToBytes=function(s,t){let e=(function(){let o=td(s),i=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let d=i(),h=i(),l=i(),u=String.fromCharCode(c<<8|d),b=h<<8|l;a[u]=b,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(n)}}return i}};var ve={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Gt={L:1,M:0,Q:3,H:2},Fe={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Ke=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(t)>=0;)a^=t<<i(a)-i(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case Fe.PATTERN000:return function(a,c){return(a+c)%2==0};case Fe.PATTERN001:return function(a,c){return a%2==0};case Fe.PATTERN010:return function(a,c){return c%3==0};case Fe.PATTERN011:return function(a,c){return(a+c)%3==0};case Fe.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Fe.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Fe.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Fe.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=qt([1],0);for(let c=0;c<r;c+=1)a=a.multiply(qt([1,We.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case ve.MODE_NUMBER:return 10;case ve.MODE_ALPHA_NUM:return 9;case ve.MODE_8BIT_BYTE:return 8;case ve.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case ve.MODE_NUMBER:return 12;case ve.MODE_ALPHA_NUM:return 11;case ve.MODE_8BIT_BYTE:return 16;case ve.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case ve.MODE_NUMBER:return 14;case ve.MODE_ALPHA_NUM:return 13;case ve.MODE_8BIT_BYTE:return 16;case ve.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let l=0;l<a;l+=1)for(let u=0;u<a;u+=1){let b=0,E=r.isDark(l,u);for(let g=-1;g<=1;g+=1)if(!(l+g<0||a<=l+g))for(let $=-1;$<=1;$+=1)u+$<0||a<=u+$||g==0&&$==0||E==r.isDark(l+g,u+$)&&(b+=1);b>5&&(c+=3+b-5)}for(let l=0;l<a-1;l+=1)for(let u=0;u<a-1;u+=1){let b=0;r.isDark(l,u)&&(b+=1),r.isDark(l+1,u)&&(b+=1),r.isDark(l,u+1)&&(b+=1),r.isDark(l+1,u+1)&&(b+=1),(b==0||b==4)&&(c+=3)}for(let l=0;l<a;l+=1)for(let u=0;u<a-6;u+=1)r.isDark(l,u)&&!r.isDark(l,u+1)&&r.isDark(l,u+2)&&r.isDark(l,u+3)&&r.isDark(l,u+4)&&!r.isDark(l,u+5)&&r.isDark(l,u+6)&&(c+=40);for(let l=0;l<a;l+=1)for(let u=0;u<a-6;u+=1)r.isDark(u,l)&&!r.isDark(u+1,l)&&r.isDark(u+2,l)&&r.isDark(u+3,l)&&r.isDark(u+4,l)&&!r.isDark(u+5,l)&&r.isDark(u+6,l)&&(c+=40);let d=0;for(let l=0;l<a;l+=1)for(let u=0;u<a;u+=1)r.isDark(u,l)&&(d+=1);let h=Math.abs(100*d/a/a-50)/5;return c+=h*10,c},o})(),We=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),qt=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+t);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let i=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=We.gexp(We.glog(n.getAt(r))+We.glog(o.getAt(a)));return qt(i,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let i=We.glog(n.getAt(0))-We.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=We.gexp(We.glog(o.getAt(a))+i);return qt(r,0).mod(o)},n},Rr=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},n=function(o,i){switch(i){case Gt.L:return s[(o-1)*4+0];case Gt.M:return s[(o-1)*4+1];case Gt.Q:return s[(o-1)*4+2];case Gt.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=n(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,c=[];for(let d=0;d<a;d+=1){let h=r[d*3+0],l=r[d*3+1],u=r[d*3+2];for(let b=0;b<h;b+=1)c.push(t(l,u))}return c},e})(),Ir=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let o=Math.floor(n/8);return(s[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let i=0;i<o;i+=1)e.putBit((n>>>o-i-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);s.length<=o&&s.push(0),n&&(s[o]|=128>>>t%8),t+=1},e},Xc=function(s){let t=ve.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+i(r.charAt(c));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},Jc=function(s){let t=ve.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(i){return e.length},n.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return n},Zc=function(s){let t=ve.MODE_8BIT_BYTE,e=s,n=Tt.stringToBytes(s),o={};return o.getMode=function(){return t},o.getLength=function(i){return n.length},o.write=function(i){for(let r=0;r<n.length;r+=1)i.put(n[r],8)},o},Qc=function(s){let t=ve.MODE_KANJI,e=s,n=Tt.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=n(s),i={};return i.getMode=function(){return t},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,c=0;for(;c+1<a.length;){let d=(255&a[c])<<8|255&a[c+1];if(33088<=d&&d<=40956)d-=33088;else if(57408<=d&&d<=60351)d-=49472;else throw"illegal char at "+(c+1)+"/"+d;d=(d>>>8&255)*192+(d&255),r.put(d,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},i},Br=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let i=0;i<o;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},ed=function(){let s=0,t=0,e=0,n="",o={},i=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)i(s>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},o.toString=function(){return n},o},td=function(s){let t=s,e=0,n=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=t.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},nd=function(s,t){let e=s,n=t,o=new Array(s*t),i={};i.setPixel=function(d,h,l){o[h*e+d]=l},i.write=function(d){d.writeString("GIF87a"),d.writeShort(e),d.writeShort(n),d.writeByte(128),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(255),d.writeByte(255),d.writeByte(255),d.writeString(","),d.writeShort(0),d.writeShort(0),d.writeShort(e),d.writeShort(n),d.writeByte(0);let h=2,l=a(h);d.writeByte(h);let u=0;for(;l.length-u>255;)d.writeByte(255),d.writeBytes(l,u,255),u+=255;d.writeByte(l.length-u),d.writeBytes(l,u,l.length-u),d.writeByte(0),d.writeString(";")};let r=function(d){let h=d,l=0,u=0,b={};return b.write=function(E,g){if(E>>>g)throw"length over";for(;l+g>=8;)h.writeByte(255&(E<<l|u)),g-=8-l,E>>>=8-l,u=0,l=0;u=E<<l|u,l=l+g},b.flush=function(){l>0&&h.writeByte(u)},b},a=function(d){let h=1<<d,l=(1<<d)+1,u=d+1,b=c();for(let f=0;f<h;f+=1)b.add(String.fromCharCode(f));b.add(String.fromCharCode(h)),b.add(String.fromCharCode(l));let E=Br(),g=r(E);g.write(h,u);let $=0,_=String.fromCharCode(o[$]);for($+=1;$<o.length;){let f=String.fromCharCode(o[$]);$+=1,b.contains(_+f)?_=_+f:(g.write(b.indexOf(_),u),b.size()<4095&&(b.size()==1<<u&&(u+=1),b.add(_+f)),_=f)}return g.write(b.indexOf(_),u),g.write(l,u),g.flush(),E.toByteArray()},c=function(){let d={},h=0,l={};return l.add=function(u){if(l.contains(u))throw"dup key:"+u;d[u]=h,h+=1},l.size=function(){return h},l.indexOf=function(u){return d[u]},l.contains=function(u){return typeof d[u]<"u"},l};return i},sd=function(s,t,e){let n=nd(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let o=Br();n.write(o);let i=ed(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},Or=Tt,qh=Tt.stringToBytes;function Nr(s){let t=Or(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)t.isDark(o,i)&&(n+=`M${i} ${o}h1v1h-1z`);return{size:e,d:n}}var id=1e4,Yt=class extends Te{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await Lr();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof at&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),id)}}async poll(e){let n=this.secret;if(n)try{let o=await Dr(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return T;let{size:e,d:n}=Nr(Sr(location.origin,this.code));return p`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${re`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return p`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?Mr(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Ys}?${Xs}</span> and type the code.
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
    </div>`}};Yt.styles=Ge`
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
  `,Yt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Yt);var Js="hassTokens";function jr(){try{let s=localStorage.getItem(Js);return s?JSON.parse(s):null}catch{return null}}function Zs(s){try{s?localStorage.setItem(Js,JSON.stringify(s)):localStorage.removeItem(Js)}catch{}}function od(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function rd(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function ad(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!jr()){let e=await rd();e&&Zs(e)}try{let e=await vi({hassUrl:location.origin,loadTokens:async()=>jr(),saveTokens:Zs});t&&history.replaceState(null,"",location.pathname+$s(location.search));let n=await yi({auth:e});s.backend=new tn(n),kr(n),wr(n,xr(import.meta.url),{reload:ld,idleFor:()=>Date.now()-Fr}),n.addEventListener("reconnect-error",(o,i)=>{i===2&&Hr()})}catch(e){if(e===2){Hr();return}od(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}var Fr=Date.now();for(let s of["pointerdown","keydown","wheel"])document.addEventListener(s,()=>Fr=Date.now(),{capture:!0,passive:!0});var zr="mydashlight-reloaded-for";function ld(s){try{if(sessionStorage.getItem(zr)===s)return;sessionStorage.setItem(zr,s)}catch{}location.reload()}function Hr(){Zs(null),location.replace(location.pathname+$s(location.search))}var Kr=nt(location.search),Ur=document.querySelector("mydashlight-keyboard");Ur&&Kr.keyboard!==!1&&Ar(Ur);Kr.cursor!=="show"&&yr();ad();
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
