var Yr=Object.defineProperty;var Nn=(s,t)=>()=>(s&&(t=s(s=0)),t);var Xr=(s,t)=>{for(var e in t)Yr(s,e,{get:t[e],enumerable:!0})};function Cn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function _s(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function fl(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function jo(s){return fl(s,t=>t.unicode)}function gl(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))i.createIndex(r,a,{multiEntry:c});return i}t(yt),t(it,ll,{[Ho]:[al,!0],[Fo]:[[cl,dl]],[Ko]:[hl,!0]}),t(Ms,void 0,{[Uo]:[""]})}function Wo(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function ml(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,ol);Ps[s]=o,o.onupgradeneeded=i=>{i.oldVersion<rl&&gl(o.result)},Wo(e,n,o)});return t.onclose=()=>Ls(s),t}function bl(s){return An[s]||(An[s]=ml(s)),An[s]}function He(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(d=>r.objectStore(d)),c;n(a,r,d=>{c=d}),r.oncomplete=()=>o(c),r.onerror=()=>i(r.error)})}function Ls(s){let t=Ps[s],e=t&&t.result;if(e){e.close();let n=Sn[s];if(n)for(let o of n)o()}delete Ps[s],delete An[s],delete Sn[s]}function vl(s){return new Promise((t,e)=>{Ls(s);let n=indexedDB.deleteDatabase(s);Wo(t,e,n)})}function yl(s,t){let e=Sn[s];e||(e=Sn[s]=[]),e.push(t)}function vt(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||xl.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Vo(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=wl)}function kl(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:a,tags:c,emoji:d,version:h})=>{let l=[...new Set(Vo([...(r||[]).map(vt).flat(),...(c||[]).map(vt).flat(),...vt(e),n]))].sort(),u={annotation:e,group:o,order:i,tags:c,tokens:l,unicode:d,version:h};if(n&&(u.emoticon=n),r&&(u.shortcodes=r),a){u.skinTones=[],u.skinUnicodes=[],u.skinVersions=[];for(let{tone:m,emoji:M,version:g}of a)u.skinTones.push(m),u.skinUnicodes.push(M),u.skinVersions.push(g)}return u})}function Go(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function st(s,t,e){Go(s,"get",t,e)}function qo(s,t,e){Go(s,"getAll",t,e)}function Ds(s){s.commit&&s.commit()}function $l(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function Yo(s,t){let e=$l(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function Tl(s){return!await Rs(s,yt,Mn)}async function El(s,t,e){let[n,o]=await Promise.all([Cs,Mn].map(i=>Rs(s,yt,i)));return n===e&&o===t}async function _l(s,t){return He(s,it,wt,(n,o,i)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let d=c.target.result;for(let h of d)if(r=h.unicode,t(h))return i(h);if(d.length<50)return i();a()}};a()})}async function Xo(s,t,e,n){try{let o=kl(t);await He(s,[it,yt],Ss,([i,r],a)=>{let c,d,h=0;function l(){++h===2&&u()}function u(){if(!(c===n&&d===e)){i.clear();for(let m of o)i.put(m);r.put(n,Cs),r.put(e,Mn),Ds(a)}}st(r,Cs,m=>{c=m,l()}),st(r,Mn,m=>{d=m,l()})})}finally{}}async function Cl(s,t){return He(s,it,wt,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);qo(e.index(Fo),i,o)})}async function Jo(s,t){let e=Vo(vt(t));return e.length?He(s,it,wt,(n,o,i)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let d=Yo(r,h=>h.unicode);i(d.sort((h,l)=>h.order<l.order?-1:1))};for(let d=0;d<e.length;d++){let h=e[d],l=d===e.length-1?IDBKeyRange.bound(h,h+"￿",!1,!0):IDBKeyRange.only(h);qo(n.index(Ho),l,u=>{r.push(u),a()})}}):[]}async function Pl(s,t){let e=await Jo(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await _l(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Al(s,t){return He(s,it,wt,(e,n,o)=>st(e,t,i=>{if(i)return o(i);st(e.index(Ko),t,r=>o(r||null))}))}function Rs(s,t,e){return He(s,t,wt,(n,o,i)=>st(n,e,i))}function Ml(s,t,e,n){return He(s,t,Ss,(o,i)=>{o.put(n,e),Ds(i)})}function Sl(s,t){return He(s,Ms,Ss,(e,n)=>st(e,t,o=>{e.put((o||0)+1,t),Ds(n)}))}function Ll(s,t,e){return e===0?[]:He(s,[Ms,it],wt,([n,o],i,r)=>{let a=[];n.index(Uo).openCursor(void 0,"prev").onsuccess=c=>{let d=c.target.result;if(!d)return r(a);function h(m){if(a.push(m),a.length===e)return r(a);d.continue()}let l=d.primaryKey,u=t.byName(l);if(u)return h(u);st(o,l,m=>{if(m)return h(m);d.continue()})}})}function Dl(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let a=e;for(let d=0;d<r.length;d++){let h=r.charAt(d),l=a.get(h);l||(l=new Map,a.set(h,l)),a=l}let c=a.get(Pn);c||(c=[],a.set(Pn,c)),c.push(o)}}return(o,i)=>{let r=e;for(let d=0;d<o.length;d++){let h=o.charAt(d),l=r.get(h);if(l)r=l;else return[]}if(i)return r.get(Pn)||[];let a=[],c=[r];for(;c.length;){let h=[...c.shift().entries()].sort((l,u)=>l[0]<u[0]?-1:1);for(let[l,u]of h)l===Pn?a.push(...u):c.push(u)}return a}}function Il(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||Rl.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function zo(s){Il(s);let t=(u,m)=>u.name.toLowerCase()<m.name.toLowerCase()?-1:1,e=s.sort(t),o=Dl(s,u=>{let m=new Set;if(u.shortcodes)for(let M of u.shortcodes)for(let g of vt(M))m.add(g);return m}),i=u=>o(u,!0),r=u=>o(u,!1),a=u=>{let m=vt(u),M=m.map((g,x)=>(x<m.length-1?i:r)(g));return Yo(M,g=>g.name).sort(t)},c=new Map,d=new Map;for(let u of s){d.set(u.name.toLowerCase(),u);for(let m of u.shortcodes||[])c.set(m.toLowerCase(),u)}return{all:e,search:a,byShortcode:u=>c.get(u.toLowerCase()),byName:u=>d.get(u.toLowerCase())}}function zt(s){if(!s)return s;if(Bl&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Zo(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Nl(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Ol.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function Qo(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function jl(s){let t=await fetch(s,{method:"HEAD"});Qo(t,s);let e=t.headers.get("etag");return Zo(e),e}async function As(s){let t=await fetch(s);Qo(t,s);let e=t.headers.get("etag");Zo(e);let n=await t.json();return Nl(n),[e,n]}function zl(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Hl(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function er(s){let t=JSON.stringify(s),e=Hl(t),n=await crypto.subtle.digest("SHA-1",e),o=zl(n);return btoa(o)}async function Ul(s,t){let e,n=await jl(t);if(!n){let o=await As(t);n=o[0],e=o[1],n||(n=await er(e))}await El(s,t,n)||(e||(e=(await As(t))[1]),await Xo(s,e,t,n))}async function Fl(s,t){let[e,n]=await As(t);e||(e=await er(n)),await Xo(s,n,t,e)}async function Kl(s,t){try{await Ul(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var ol,rl,it,yt,Ms,al,Ho,ll,Uo,cl,dl,Fo,Cs,Mn,No,wt,Ss,Ko,hl,ul,pl,Ps,An,Sn,xl,wl,Pn,Rl,Bl,Ol,xt,Is=Nn(()=>{ol=1,rl=1,it="emoji",yt="keyvalue",Ms="favorites",al="tokens",Ho="tokens",ll="unicode",Uo="count",cl="group",dl="order",Fo="group-order",Cs="eTag",Mn="url",No="skinTone",wt="readonly",Ss="readwrite",Ko="skinUnicodes",hl="skinUnicodes",ul="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",pl="en";Ps={},An={},Sn={};xl=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);wl=2;Pn="";Rl=["name","url"];Bl=typeof wrappedJSObject<"u";Ol=["annotation","emoji","group","order","version"];xt=class{constructor({dataSource:t=ul,locale:e=pl,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=zo(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await bl(this._dbName);yl(this._dbName,this._clear);let e=this.dataSource;await Tl(t)?await Fl(t,e):this._lazyUpdate=Kl(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return _s(t),await this.ready(),jo(await Cl(this._db,t)).map(zt)}async getEmojiBySearchQuery(t){Cn(t),await this.ready();let e=this._custom.search(t),n=jo(await Jo(this._db,t)).map(zt);return[...e,...n]}async getEmojiByShortcode(t){Cn(t),await this.ready();let e=this._custom.byShortcode(t);return e||zt(await Pl(this._db,t))}async getEmojiByUnicodeOrName(t){Cn(t),await this.ready();let e=this._custom.byName(t);return e||zt(await Al(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Rs(this._db,yt,No)||0}async setPreferredSkinTone(t){return _s(t),await this.ready(),Ml(this._db,yt,No,t)}async incrementFavoriteEmojiCount(t){return Cn(t),await this.ready(),Sl(this._db,t)}async getTopFavoriteEmoji(t){return _s(t),await this.ready(),(await Ll(this._db,this._custom,t)).map(zt)}set customEmoji(t){this._custom=zo(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Ls(this._dbName)}async delete(){await this._shutdown(),await vl(this._dbName)}}});function nr(s){return s.unicode.includes("‍")}function Ql(s){let t=sr(s,"#000"),e=sr(s,"#fff");return t&&e&&Zl(t,e)}function ec(){let s=Object.entries(Vl);try{for(let[t,e]of s)if(Ql(t))return e}catch{}finally{}return s[0][1]}function rc(s,t){if(t===0)return s;let e=s.indexOf(sc);return e!==-1?s.substring(0,e)+String.fromCodePoint(ic+t-1)+s.substring(e):(s.endsWith(tc)&&(s=s.substring(0,s.length-1)),s+nc+String.fromCodePoint(oc+t-1))}function Oe(s){s.preventDefault(),s.stopPropagation()}function js(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function ur(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function ac(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:a,category:c,annotation:d})=>({unicode:n,name:a,shortcodes:i,url:r,category:c,annotation:d,id:n||a,skins:o&&e(o)}))}function cc(s,t,e){let n;lc?(n=new ResizeObserver(e),n.observe(s)):Dn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function ir(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function or(s,t,e){let n=ir(t);if(!n){if(!ot){ot=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])ot.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(ot),ot.firstChild.nodeValue=s,ir(ot)}finally{ot.remove()}}return n}function hc(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof zs>"u"&&(zs=or(dc,t,t));let a=or(o.unicode,i,t)/1.8<zs;Ks.set(o.unicode,a),a||(n=!1)}return n}function uc(s){return ur(s,t=>t)}function pc(s){s&&(s.scrollTop=0)}function Ht(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function rr(s){return""+s}function fc(s){let t=document.createElement("template");return t.innerHTML=s,t}function yc(s,t){vc?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function xc(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function wc(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=xc(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&yc(n,s)}function kc(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,d=s[i];if(o!==d)if(e.currentExpression=d,r)if(d===null)n.removeAttribute(r);else{let h=a+rr(d)+c;n.setAttribute(r,h)}else{let h;Array.isArray(d)?wc(d,e):d instanceof Element?(h=d,n.replaceWith(h)):n.nodeValue=rr(d),h&&(e.targetNode=h)}}}function $c(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],a=0;for(let d=0,h=s.length;d<h;d++){let l=s[d];if(t+=l.slice(a),d===h-1)break;for(let f=0;f<l.length;f++)switch(l.charAt(f)){case"<":{l.charAt(f+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let u=r[r.length-1],m=Ht(i,u,()=>[]),M,g,x;if(n){let f=/(\S+)="?([^"=]*)$/.exec(l);M=f[1],g=f[2];let O=/^([^">]*)("?)/.exec(s[d+1]);x=O[1],t=t.slice(0,-1*f[0].length),a=O[0].length}else a=0;let _={attributeName:M,attributeValuePre:g,attributeValuePost:x,expressionIndex:d};m.push(_),!e&&!n&&(t+=" ")}return{template:fc(t),elementsToBindings:i}}function ar(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Tc(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))ar(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=t.get(++r);a&&ar(a,i,e)}while(i=o.nextNode())}return e}function Ec(s){let{template:t,elementsToBindings:e}=Ht(gc,s,()=>$c(s)),n=t.cloneNode(!0).content.firstElementChild,o=Tc(n,e);return function(r){return kc(r,o),n}}function _c(s){let t=Ht(mc,s,()=>new Map),e=bc;function n(i,...r){let a=Ht(t,i,()=>new Map);return Ht(a,e,()=>Ec(i))(r)}function o(i,r,a){return i.map((c,d)=>{let h=e;e=a(c);try{return r(c,d)}finally{e=h}})}return{map:o,html:n}}function Cc(s,t,e,n,o,i,r,a,c){let{labelWithSkin:d,titleForEmoji:h,unicodeWithSkin:l}=e,{html:u,map:m}=_c(t);function M(f,O,H){return m(f,(G,pe)=>u`<button role="${O?"option":"menuitem"}" aria-selected="${O?pe===t.activeSearchItem:null}" aria-label="${d(G,t.currentSkinTone)}" title="${h(G)}" class="${"emoji"+(O&&pe===t.activeSearchItem?" active":"")+(G.unicode?"":" custom-emoji")}" id="${`${H}-${G.id}`}" style="${G.unicode?null:`--custom-emoji-background: url(${JSON.stringify(G.url)})`}">${G.unicode?l(G,t.currentSkinTone):""}</button>`,G=>`${H}-${G.id}`)}let x=u`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${m(t.skinTones,(f,O)=>u`<div id="skintone-${O}" class="emoji ${O===t.activeSkinTone?"active":""}" aria-selected="${O===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[O]}" aria-label="${t.i18n.skinTones[O]}">${f}</div>`,f=>f)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${m(t.groups,f=>u`<button role="tab" class="nav-button" aria-controls="tab-${f.id}" aria-label="${t.i18n.categories[f.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===f.id}" title="${t.i18n.categories[f.name]}" data-group-id="${f.id}"><div class="nav-emoji emoji">${f.emoji}</div></button>`,f=>f.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${m(t.currentEmojisWithCategories,(f,O)=>u`<div><div id="menu-label-${O}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:f.category?f.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${O!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(f.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${O}" id="${t.searchMode?"search-results":null}">${M(f.emojis,t.searchMode,"emo")}</div></div>`,f=>f.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${M(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,_=(f,O)=>{for(let H of s.querySelectorAll(`[${f}]`))O(H,H.getAttribute(f))};if(c){s.appendChild(x);for(let f of["click","focusout","input","keydown","keyup"])_(`data-on-${f}`,(O,H)=>{O.addEventListener(f,n[H])});_("data-ref",(f,O)=>{i[O]=f}),r.addEventListener("abort",()=>{s.removeChild(x)})}_("data-action",(f,O)=>{let H=a.get(O);H||a.set(O,H=new WeakSet),H.has(f)||(H.add(f),o[O](f))})}function Pc(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let d=[...o];o.clear();try{for(let h of d)h()}finally{i=!1,o.size&&(i=!0,Rn(r))}},a=new Proxy({},{get(d,h){if(e){let l=n.get(h);l||(l=new Set,n.set(h,l)),l.add(e)}return d[h]},set(d,h,l){if(d[h]!==l){d[h]=l;let u=n.get(h);if(u){for(let m of u)o.add(m);i||(i=!0,Rn(r))}}return!0}}),c=d=>{let h=()=>{let l=e;e=h;try{return d()}finally{e=l}};return h()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function Hs(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function Ac(s,t,e){{let n=s.closest(".tabpanel"),o=lr.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),lr.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function Mc(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=Pc(o),a=new Map;Ln(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),Ln(i,t),Ln(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Yl,isRtl:!1,currentGroupIndex:0,groups:Bs,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let c=v=>{s.getElementById(v).focus()},d=v=>s.getElementById(`emo-${v.id}`),h=(v,$)=>{e.rootElement.dispatchEvent(new CustomEvent(v,{detail:$,bubbles:!0,composed:!0}))},l=(v,$)=>v.id===$.id,u=(v,$)=>{let{category:A,emojis:B}=v,{category:I,emojis:Z}=$;return A!==I?!1:Hs(B,Z,l)},m=v=>{Hs(i.currentEmojis,v,l)||(i.currentEmojis=v)},M=v=>{i.searchMode!==v&&(i.searchMode=v)},g=v=>{Hs(i.currentEmojisWithCategories,v,u)||(i.currentEmojisWithCategories=v)},x=(v,$)=>$&&v.skins&&v.skins[$]||v.unicode,O={labelWithSkin:(v,$)=>uc([v.name||x(v,$),v.annotation,...v.shortcodes||Us].filter(Boolean)).join(", "),titleForEmoji:v=>v.annotation||(v.shortcodes||Us).join(", "),unicodeWithSkin:x},H={onClickSkinToneButton:xe,onEmojiClick:ge,onNavClick:J,onNavKeydown:ee,onSearchKeydown:z,onSkinToneOptionsClick:Se,onSkinToneOptionsFocusOut:U,onSkinToneOptionsKeydown:b,onSkinToneOptionsKeyup:N,onSearchInput:E},G={calculateEmojiGridStyle:k,updateOnIntersection:y},pe=!0;r(()=>{Cc(s,i,O,H,G,e,o,a,pe),pe=!1}),i.emojiVersion||Ns().then(v=>{v||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function v(){let $=!1,A=setTimeout(()=>{$=!0,i.message=i.i18n.loadingMessage},Gl);try{await i.database.ready(),i.databaseLoaded=!0}catch(B){console.error(B),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(A),$&&($=!1,i.message="")}}i.database&&v()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${tr};`}),r(()=>{i.customEmoji&&i.database&&w()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==Fs&&(i.groups=Fs):i.groups!==Bs&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=Bs)}),r(()=>{async function v(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}v()}),r(()=>{i.skinTones=Array(tr).fill().map((v,$)=>rc(i.skinToneEmoji,$))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function v(){let{database:$}=i,A=(await Promise.all(Xl.map(B=>$.getEmojiByUnicodeOrName(B)))).filter(Boolean);i.defaultFavoriteEmojis=A}i.databaseLoaded&&v()});function w(){let{customEmoji:v,database:$}=i,A=v||Us;$.customEmoji!==A&&($.customEmoji=A)}r(()=>{async function v(){w();let{database:$,defaultFavoriteEmojis:A,numColumns:B}=i,I=await $.getTopFavoriteEmoji(B),Z=await W(ur([...I,...A],q=>q.unicode||q.name).slice(0,B));i.currentFavorites=Z}i.databaseLoaded&&i.defaultFavoriteEmojis&&v()});function k(v){cc(v,o,()=>{{let $=getComputedStyle(e.rootElement),A=parseInt($.getPropertyValue("--num-columns"),10),B=$.getPropertyValue("direction")==="rtl";i.numColumns=A,i.isRtl=B}})}function y(v){Ac(v,o,$=>{for(let{target:A,isIntersecting:B}of $)A.classList.toggle("onscreen",B)})}r(()=>{async function v(){let{searchText:$,currentGroup:A,databaseLoaded:B,customEmoji:I}=i;if(!B)i.currentEmojis=[],i.searchMode=!1;else if($.length>=Wl){let Z=await ne($);i.searchText===$&&(m(Z),M(!0))}else{let{id:Z}=A;if(Z!==-1||I&&I.length){let q=await Q(Z);i.currentGroup.id===Z&&(m(q),M(!1))}}}v()});let C=()=>{Dn(()=>pc(e.tabpanelElement))};r(()=>{let{currentEmojis:v,emojiVersion:$}=i,A=v.filter(B=>B.unicode).filter(B=>nr(B)&&!Ks.has(B.unicode));if(!$&&A.length)m(v),Dn(()=>P(A));else{let B=$?v:v.filter(L);m(B),C()}});function P(v){hc(v,e.baselineEmoji,d)?C():i.currentEmojis=[...i.currentEmojis]}function L(v){return!v.unicode||!nr(v)||Ks.get(v.unicode)}async function j(v){let $=i.emojiVersion||await Ns();return v.filter(({version:A})=>!A||A<=$)}async function W(v){return ac(v,i.emojiVersion||await Ns())}async function Q(v){let $=v===-1?i.customEmoji:await i.database.getEmojiByGroup(v);return W(await j($))}async function ne(v){return W(await j(await i.database.getEmojiBySearchQuery(v)))}r(()=>{}),r(()=>{function v(){let{searchMode:A,currentEmojis:B}=i;if(A)return[{category:"",emojis:B}];let I=new Map;for(let Z of B){let q=Z.category||"",S=I.get(q);S||(S=[],I.set(q,S)),S.push(Z)}return[...I.entries()].map(([Z,q])=>({category:Z,emojis:q})).sort((Z,q)=>i.customCategorySorting(Z.category,q.category))}let $=v();g($)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:v}=i;dr(()=>{i.searchText=(v||"").trim(),i.activeSearchItem=-1})});function z(v){if(!i.searchMode||!i.currentEmojis.length)return;let $=A=>{Oe(v),i.activeSearchItem=js(A,i.activeSearchItem,i.currentEmojis)};switch(v.key){case"ArrowDown":return $(!1);case"ArrowUp":return $(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Oe(v),ke(i.currentEmojis[i.activeSearchItem].id)}}function J(v){let{target:$}=v,A=$.closest(".nav-button");if(!A)return;let B=parseInt(A.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(I=>I.id===B)}function ee(v){let{target:$,key:A}=v,B=I=>{I&&(Oe(v),I.focus())};switch(A){case"ArrowLeft":return B($.previousElementSibling);case"ArrowRight":return B($.nextElementSibling);case"Home":return B($.parentElement.firstElementChild);case"End":return B($.parentElement.lastElementChild)}}async function oe(v){let $=await i.database.getEmojiByUnicodeOrName(v),A=[...i.currentEmojis,...i.currentFavorites].find(I=>I.id===v),B=A.unicode&&x(A,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(v),{emoji:$,skinTone:i.currentSkinTone,...B&&{unicode:B},...A.name&&{name:A.name}}}async function ke(v){let $=oe(v);h("emoji-click-sync",$),h("emoji-click",await $)}function ge(v){let{target:$}=v;if(!$.classList.contains("emoji"))return;Oe(v);let A=$.id.substring(4);ke(A)}function fe(v){i.currentSkinTone=v,i.skinTonePickerExpanded=!1,c("skintone-button"),h("skin-tone-change",{skinTone:v}),i.database.setPreferredSkinTone(v)}function Se(v){let{target:{id:$}}=v,A=$&&$.match(/^skintone-(\d)/);if(!A)return;Oe(v);let B=parseInt(A[1],10);fe(B)}function xe(v){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Oe(v),Dn(()=>c("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function b(v){if(!i.skinTonePickerExpanded)return;let $=async A=>{Oe(v),i.activeSkinTone=A};switch(v.key){case"ArrowUp":return $(js(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return $(js(!1,i.activeSkinTone,i.skinTones));case"Home":return $(0);case"End":return $(i.skinTones.length-1);case"Enter":return Oe(v),fe(i.activeSkinTone);case"Escape":return Oe(v),i.skinTonePickerExpanded=!1,c("skintone-button")}}function N(v){if(i.skinTonePickerExpanded)switch(v.key){case" ":return Oe(v),fe(i.activeSkinTone)}}async function U(v){let{relatedTarget:$}=v;(!$||$.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function E(v){i.rawSearchText=v.target.value}return{$set(v){Ln(i,v)},$destroy(){n.abort()}}}function cr(s){s instanceof rt||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var Fs,Bs,Wl,tr,dr,Vl,Gl,ql,Yl,Xl,hr,Jl,sr,Zl,Os,Ns,Ks,tc,nc,sc,ic,oc,Dn,lc,dc,zs,ot,gc,mc,bc,vc,Rn,lr,Us,Ln,Sc,Lc,Dc,Rc,pr,Ic,rt,fr,gr=Nn(()=>{Is();Fs=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),Bs=Fs.slice(1),Wl=2,tr=6,dr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Vl={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Gl=1e3,ql="🖐️",Yl=8,Xl=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],hr='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Jl=(s,t)=>s<t?-1:s>t?1:0,sr=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${hr}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},Zl=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};Ns=()=>(Os||(Os=new Promise(s=>dr(()=>s(ec())))),Os),Ks=new Map,tc="️",nc="\uD83C",sc="‍",ic=127995,oc=57339;Dn=requestAnimationFrame,lc=typeof ResizeObserver=="function";dc="😀";gc=new WeakMap,mc=new WeakMap,bc=Symbol("un-keyed"),vc="replaceChildren"in Element.prototype;Rn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);lr=new WeakMap;Us=[],{assign:Ln}=Object;Sc="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Lc="en",Dc={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Rc=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',pr=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Ic=`:host{--emoji-font-family:${hr}}`,rt=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Rc+Ic,this.shadowRoot.appendChild(e),this._ctx={locale:Lc,dataSource:Sc,skinToneEmoji:ql,customCategorySorting:Jl,customEmoji:null,i18n:Dc,emojiVersion:null,...t};for(let n of pr)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){cr(this),this._cmp||(this._cmp=Mc(this.shadowRoot,this._ctx))}disconnectedCallback(){cr(this),Rn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new xt({locale:t,dataSource:e}))}_dbFlush(){Rn(()=>this._dbCreate())}},fr={};for(let s of pr)fr[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(rt.prototype,fr);customElements.get("emoji-picker")||customElements.define("emoji-picker",rt)});var mr={};Xr(mr,{Database:()=>xt,Picker:()=>rt});var br=Nn(()=>{gr();Is()});function ri(s){return{type:"auth",access_token:s}}function ai(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function li(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function jn(s){return{type:"unsubscribe_events",subscription:s}}function ci(){return{type:"ping"}}function di(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function ui(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[i]=r}return t}var pi=(s,t,e,n)=>{let[o,i,r]=s.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(i)>=e:Number(i)>e)||n!==void 0&&Number(o)===t&&Number(i)===e&&Number(r)>=n};var Jt=!1,Zr="auth_required",Qr="auth_invalid",ea="auth_ok";function gi(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;Jt&&console.log("[Auth phase] Initializing",n);function o(i,r,a){Jt&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),d=!1,h=()=>{if(c.removeEventListener("close",h),d){a(2);return}if(i===0){a(1);return}let m=i===-1?-1:i-1;setTimeout(()=>o(m,r,a),1e3)},l=async m=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(ri(t.accessToken)))}catch(M){d=M===2,c.close()}},u=async m=>{let M=JSON.parse(m.data);switch(Jt&&console.log("[Auth phase] Received",M),M.type){case Qr:d=!0,c.close();break;case ea:c.removeEventListener("open",l),c.removeEventListener("message",u),c.removeEventListener("close",h),c.removeEventListener("error",h),c.haVersion=M.ha_version,pi(c.haVersion,2022,9)&&c.send(JSON.stringify(ai())),r(c);break;default:Jt&&M.type!==Zr&&console.warn("[Auth phase] Unhandled message",M)}};c.addEventListener("open",l),c.addEventListener("message",u),c.addEventListener("close",h),c.addEventListener("error",h)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var Et=!1,Zt=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{Et&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(jn(i.id)).catch(a=>{Et&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:Et&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(di(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){Et&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let d of c)d.reject&&d.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,li(e))}ping(){return this.sendMessagePromise(ci())}sendMessage(t,e){if(!this.connected)throw 3;if(Et&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(i){n(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(jn(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var ta=()=>`${location.protocol}//${location.host}/`,na=s=>s*1e3+Date.now();function sa(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function ia(s,t,e,n){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function oa(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=ia(s,t,e,n)}async function vi(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=t,r.expires=na(r.expires_in),r}function bi(s,t,e){return vi(s,t,{code:e,grant_type:"authorization_code"})}function ra(s){return btoa(JSON.stringify(s))}function aa(s){return JSON.parse(atob(s))}var zn=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await vi(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function yi(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:ta(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await bi(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let i=ui(location.search.substr(1));if("auth_callback"in i){let r=aa(i.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await bi(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new zn(t,s.saveTokens);if(e===void 0)throw 4;return oa(e,n,s.redirectUrl||sa(),ra({hassUrl:e,clientId:n})),new Promise(()=>{})}async function xi(s){let t=Object.assign({setupRetry:0,createSocket:gi},s),e=await t.createSocket(t);return new Zt(e,t)}function F(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Pe(s){let t=Math.floor(Math.round(s)/60)%24;return`${F(s)} ${t<12?"AM":"PM"}`}function wi(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Ct(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function Hn(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var la=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),ca=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),da=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Qt(s){return new Date(`${s}T12:00:00Z`)}function Ae(s){let t=Qt(s);return`${la.format(t)}, ${da.format(t)}`}function ve(s){return ca.format(Qt(s))}function De(s,t){return Math.round((Qt(t).getTime()-Qt(s).getTime())/864e5)}function _t(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return _t("UTC",t)}let n=o=>e.find(i=>i.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function en(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=_t(e,s),i=_t(e,t).date;return o.date===i?`at ${Pe(o.minutes)}`:`on ${ve(o.date)} at ${Pe(o.minutes)}`}var re=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function Ti(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var Ve="mydashlight",ha=7,Un=3e4,ki=3e4;function Fn(s){if(s instanceof re)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new re(String(t.code??"error"),t.message)}return typeof s=="number"?new re("connection_lost","Lost the connection to Home Assistant."):new re("error",String(s))}function $i(s,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new re("timeout","Home Assistant didn’t answer.")),t);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),n(i)})})}var Pt=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},tn=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new re("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Pt(this.conn,`${Ve}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new re("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},Un),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await $i(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_plan",service_data:{days:ha},return_response:!0}),ki);this.emit(t.response)}catch(t){this.fail(Fn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Fn(n)}this.live||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:Hn(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:Hn(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n){return this.call("set_people",{event:t,people:e,scope:n})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let a=await $i(this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:"get_chores",service_data:{},return_response:!0}),ki);if(e)return;n=!0,t(a.response??null)}catch{!e&&!n&&t(null)}},i=new Pt(this.conn,`${Ve}/chores/subscribe`,a=>{e||(n=!0,t(a.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},Un);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(t){let e=!1,n=!1,o=new Pt(this.conn,`${Ve}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let i=setInterval(()=>{o.live||o.open()},Un);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ve,service:t,service_data:e})}catch(n){throw Fn(n)}}};var nn=globalThis,sn=nn.ShadowRoot&&(nn.ShadyCSS===void 0||nn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Kn=Symbol(),Ei=new WeakMap,At=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Kn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(sn&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ei.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ei.set(e,t))}return t}toString(){return this.cssText}},_i=s=>new At(typeof s=="string"?s:s+"",void 0,Kn),Ge=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new At(e,s,Kn)},Ci=(s,t)=>{if(sn)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=nn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},Wn=sn?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return _i(e)})(s):s;var{is:ua,defineProperty:pa,getOwnPropertyDescriptor:fa,getOwnPropertyNames:ga,getOwnPropertySymbols:ma,getPrototypeOf:ba}=Object,on=globalThis,Pi=on.trustedTypes,va=Pi?Pi.emptyScript:"",ya=on.reactiveElementPolyfillSupport,Mt=(s,t)=>s,Vn={toAttribute(s,t){switch(t){case Boolean:s=s?va:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Mi=(s,t)=>!ua(s,t),Ai={attribute:!0,type:String,converter:Vn,reflect:!1,useDefault:!1,hasChanged:Mi};Symbol.metadata??=Symbol("metadata"),on.litPropertyMetadata??=new WeakMap;var Ne=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ai){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&pa(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=fa(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ai}static _$Ei(){if(this.hasOwnProperty(Mt("elementProperties")))return;let t=ba(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Mt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Mt("properties"))){let e=this.properties,n=[...ga(e),...ma(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(Wn(o))}else t!==void 0&&e.push(Wn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ci(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:Vn).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Vn;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Mi)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Ne.elementStyles=[],Ne.shadowRootOptions={mode:"open"},Ne[Mt("elementProperties")]=new Map,Ne[Mt("finalized")]=new Map,ya?.({ReactiveElement:Ne}),(on.reactiveElementVersions??=[]).push("2.1.2");var qn=globalThis,Si=s=>s,rn=qn.trustedTypes,Li=rn?rn.createPolicy("lit-html",{createHTML:s=>s}):void 0,Yn="$lit$",je=`lit$${Math.random().toFixed(9).slice(2)}$`,Xn="?"+je,xa=`<${Xn}>`,Xe=document,Lt=()=>Xe.createComment(""),Dt=s=>s===null||typeof s!="object"&&typeof s!="function",Jn=Array.isArray,Ni=s=>Jn(s)||typeof s?.[Symbol.iterator]=="function",Gn=`[ 	
\f\r]`,St=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Di=/-->/g,Ri=/>/g,qe=RegExp(`>|${Gn}(?:([^\\s"'>=/]+)(${Gn}*=${Gn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ii=/'/g,Bi=/"/g,ji=/^(?:script|style|textarea|title)$/i,Zn=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=Zn(1),ae=Zn(2),Yd=Zn(3),ze=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),Oi=new WeakMap,Ye=Xe.createTreeWalker(Xe,129);function zi(s,t){if(!Jn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Li!==void 0?Li.createHTML(t):t}var Hi=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=St;for(let a=0;a<e;a++){let c=s[a],d,h,l=-1,u=0;for(;u<c.length&&(r.lastIndex=u,h=r.exec(c),h!==null);)u=r.lastIndex,r===St?h[1]==="!--"?r=Di:h[1]!==void 0?r=Ri:h[2]!==void 0?(ji.test(h[2])&&(o=RegExp("</"+h[2],"g")),r=qe):h[3]!==void 0&&(r=qe):r===qe?h[0]===">"?(r=o??St,l=-1):h[1]===void 0?l=-2:(l=r.lastIndex-h[2].length,d=h[1],r=h[3]===void 0?qe:h[3]==='"'?Bi:Ii):r===Bi||r===Ii?r=qe:r===Di||r===Ri?r=St:(r=qe,o=void 0);let m=r===qe&&s[a+1].startsWith("/>")?" ":"";i+=r===St?c+xa:l>=0?(n.push(d),c.slice(0,l)+Yn+c.slice(l)+je+m):c+je+(l===-2?a:m)}return[zi(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Rt=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,a=t.length-1,c=this.parts,[d,h]=Hi(t,e);if(this.el=s.createElement(d,n),Ye.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(o=Ye.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let l of o.getAttributeNames())if(l.endsWith(Yn)){let u=h[r++],m=o.getAttribute(l).split(je),M=/([.?@])?(.*)/.exec(u);c.push({type:1,index:i,name:M[2],strings:m,ctor:M[1]==="."?ln:M[1]==="?"?cn:M[1]==="@"?dn:Ze}),o.removeAttribute(l)}else l.startsWith(je)&&(c.push({type:6,index:i}),o.removeAttribute(l));if(ji.test(o.tagName)){let l=o.textContent.split(je),u=l.length-1;if(u>0){o.textContent=rn?rn.emptyScript:"";for(let m=0;m<u;m++)o.append(l[m],Lt()),Ye.nextNode(),c.push({type:2,index:++i});o.append(l[u],Lt())}}}else if(o.nodeType===8)if(o.data===Xn)c.push({type:2,index:i});else{let l=-1;for(;(l=o.data.indexOf(je,l+1))!==-1;)c.push({type:7,index:i}),l+=je.length-1}i++}}static createElement(t,e){let n=Xe.createElement("template");return n.innerHTML=t,n}};function Je(s,t,e=s,n){if(t===ze)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=Dt(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Je(s,o._$AS(s,t.values),o,n)),t}var an=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Xe).importNode(e,!0);Ye.currentNode=o;let i=Ye.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let d;c.type===2?d=new dt(i,i.nextSibling,this,t):c.type===1?d=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(d=new hn(i,this,t)),this._$AV.push(d),c=n[++a]}r!==c?.index&&(i=Ye.nextNode(),r++)}return Ye.currentNode=Xe,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},dt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Je(this,t,e),Dt(t)?t===T||t==null||t===""?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==ze&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ni(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==T&&Dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Xe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Rt.createElement(zi(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new an(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Oi.get(t.strings);return e===void 0&&Oi.set(t.strings,e=new Rt(t)),e}k(t){Jn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(Lt()),this.O(Lt()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Si(t).nextSibling;Si(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ze=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=T}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=Je(this,t,e,0),r=!Dt(t)||t!==this._$AH&&t!==ze,r&&(this._$AH=t);else{let a=t,c,d;for(t=i[0],c=0;c<i.length-1;c++)d=Je(this,a[n+c],e,c),d===ze&&(d=this._$AH[c]),r||=!Dt(d)||d!==this._$AH[c],d===T?t=T:t!==T&&(t+=(d??"")+i[c+1]),this._$AH[c]=d}r&&!o&&this.j(t)}j(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ln=class extends Ze{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===T?void 0:t}},cn=class extends Ze{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==T)}},dn=class extends Ze{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=Je(this,t,e,0)??T)===ze)return;let n=this._$AH,o=t===T&&n!==T||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==T&&(n===T||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},hn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Je(this,t)}},Ui={M:Yn,P:je,A:Xn,C:1,L:Hi,R:an,D:Ni,V:Je,I:dt,H:Ze,N:cn,U:dn,B:ln,F:hn},wa=qn.litHtmlPolyfillSupport;wa?.(Rt,dt),(qn.litHtmlVersions??=[]).push("3.3.3");var Fi=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new dt(t.insertBefore(Lt(),i),i,void 0,e??{})}return o._$AI(s),o};var Qn=globalThis,_e=class extends Ne{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Fi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ze}};_e._$litElement$=!0,_e.finalized=!0,Qn.litElementHydrateSupport?.({LitElement:_e});var ka=Qn.litElementPolyfillSupport;ka?.({LitElement:_e});(Qn.litElementVersions??=[]).push("4.2.2");var Ki={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Wi=s=>(...t)=>({_$litDirective$:s,values:t}),un=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:$a}=Ui,Vi=s=>s;var Gi=()=>document.createComment(""),ht=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(Gi(),o),r=n.insertBefore(Gi(),o);e=new $a(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(i!==o||a){let c=e._$AA;for(;c!==i;){let d=Vi(c).nextSibling;Vi(n).insertBefore(c,o),c=d}}}return e},Ue=(s,t,e=s)=>(s._$AI(t,e),s),Ta={},qi=(s,t=Ta)=>s._$AH=t,Yi=s=>s._$AH,pn=s=>{s._$AR(),s._$AA.remove()};var Xi=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Re=Wi(class extends un{constructor(s){if(super(s),s.type!==Ki.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let a of s)o[r]=n?n(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=Yi(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],c=[],d,h,l=0,u=o.length-1,m=0,M=i.length-1;for(;l<=u&&m<=M;)if(o[l]===null)l++;else if(o[u]===null)u--;else if(a[l]===r[m])c[m]=Ue(o[l],i[m]),l++,m++;else if(a[u]===r[M])c[M]=Ue(o[u],i[M]),u--,M--;else if(a[l]===r[M])c[M]=Ue(o[l],i[M]),ht(s,c[M+1],o[l]),l++,M--;else if(a[u]===r[m])c[m]=Ue(o[u],i[m]),ht(s,o[l],o[u]),u--,m++;else if(d===void 0&&(d=Xi(r,m,M),h=Xi(a,l,u)),d.has(a[l]))if(d.has(a[u])){let g=h.get(r[m]),x=g!==void 0?o[g]:null;if(x===null){let _=ht(s,o[l]);Ue(_,i[m]),c[m]=_}else c[m]=Ue(x,i[m]),ht(s,o[l],x),o[g]=null;m++}else pn(o[u]),u--;else pn(o[l]),l++;for(;m<=M;){let g=ht(s,c[M+1]);Ue(g,i[m]),c[m++]=g}for(;l<=u;){let g=o[l++];g!==null&&pn(g)}return this.ut=r,qi(s,c),ze}});var fn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function he(s){return fn[(s%fn.length+fn.length)%fn.length]}var gn="#23272E",es="35,39,46";var ts=3,Ot=36,ns=12,mn=8,Ji=30,Ie=16,It=100,ut=60,Ea=120,Zi=44,Qi=20,_a=45,Ca=30,eo=20,is=10,bn=30,os=10,Pa=150,Aa=150,yn=1;function lo(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Ot}var Ma=26,co=4;function as(s,t){let e=Math.max(Pa,Aa/yn);return Math.ceil(ut+Math.max(0,s-1)*is+bn+Math.max(0,t-1)*os+e*(s+yn*t))}function Ce(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function we(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function $e(s){return new Map(Ce(s).map((t,e)=>[t,he(e)]))}function be(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function me(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function ls(s,t){return t==="none"?"Not needed":we(s).includes(t)?me(s,t):t}function ho(s){return s.leave_by!=null&&s.leave_by>s.start&&s.leave_by<s.end?` · leave ${F(s.leave_by)}`:""}function xn(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${F(s.end)}`;if(s.end>=1440)return`From ${F(s.start)}`}return`${F(s.start)}–${F(s.end)}`}function wn(s,t){return t.own?me(s,t.own):be(s,t.kid)}var pt={color:gn,rgb:es,ink:gn};function uo(s,t){return t.own?pt:$e(s).get(t.kid)??he(0)}function Sa(s,t){let e=Ce(s);return t.along.map(n=>e.includes(n)?be(s,n):me(s,n))}function ft(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function La(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function vn(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function ss(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(vn(t,n.from)),e.push(vn(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(vn(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Da(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),t}function Ra(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function Ia(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function po(s,t){return Ra(s.anchors,t)}function cs(s,t){return Ia(s.anchors,t)}function Ba(s,t){let e=Ce(s),n=we(s),o=Math.max(t,as(e.length,n.length)),r=(o-ut-Math.max(0,e.length-1)*is-bn-Math.max(0,n.length-1)*os)/(e.length+yn*n.length||1),a=Math.floor(r),c=Math.floor(r*yn),d=s.whole_week??s.days,h=new Map;for(let g of d)for(let x of g.events)for(let _ of x.own?x.along:[x.kid]){let f=h.get(_)??[];f.some(O=>O.event_id===x.event_id&&O.calendar_id===x.calendar_id)||f.push(x),h.set(_,f)}let l=$e(s),u=[],m=ut;e.forEach((g,x)=>{let _=h.get(g)??[],f=s.days.some(O=>O.events.some(H=>H.kid===g&&(H.sides.includes("drop")&&H.drop===""||H.sides.includes("pick")&&H.pick==="")));u.push({id:g,kind:"kid",x:m,w:a,name:be(s,g),dot:l.get(g).color,rgb:l.get(g).rgb,sub:`${f?"Needs a ride · ":""}${_.length} this week`,subWarn:f}),m+=a+(x<e.length-1?is:0)});let M=m+bn/2;return m+=bn,n.forEach((g,x)=>{let _=0,f=0;for(let O of d){let H=O.drivers[g];H&&(_+=H.outings.length,f+=H.drive??0)}u.push({id:g,kind:"driver",x:m,w:c,name:me(s,g),dot:gn,rgb:es,sub:`${_} ${_===1?"trip":"trips"} this week · ${Ct(f)} driving`,subWarn:!1}),m+=c+(x<n.length-1?os:0)}),{columns:u,sepX:M,width:o}}function Oa(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function to(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${F(s.start)}`:e||!t?`${s.title} until ${F(s.end)}`:`${s.title} ${F(s.start)}–${F(s.end)}`}function ds(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function hs(s,t){let e=De(t,s);return e===0?"Today":e===1?"Tomorrow":""}function ue(s,t=0){return s==null||!Number.isFinite(s)?t:s}function rs(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=n?i+=1+a:(o++,i=a);i>n;)o++,i-=n}return o}var fo=25,Na=15,go=3;function no(s){return Math.max(0,Math.min(go,Math.floor((s-fo)/Na)))}var ja=fo+2,so=20;function io(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var Bt="🚗";function oo(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var ro={muted:0,normal:1,pending:2,problem:3};function mo(s){let{drop:t,pick:e}=s,n=t?oo(t.text,"drop"):null,o=e?oo(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((c,d)=>d&&(ro[d.tone]??1)>(ro[c]??1)?d.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Bt} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${Bt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:i},pick:null}:!n.at||!o.at?{drop:{text:`${c} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:i},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(c,d)=>c==="needed"?`${d} needed`:`${d}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Bt} ${a.join(" · ")}`,tone:i},pick:null}}function ao(s,t){let e=t-23,n=`${F(s.start)}–${F(s.end)}`+(s.arrive_by!=null?` · arrive ${F(s.arrive_by)}`:"")+ho(s),o=33+rs(n,e,6.6)*16,i=s.own?s.lines:mo(s.lines);for(let r of[i.drop,i.pick])r&&(o+=2+rs(r.text,e,7)*16);return o+4}function bo(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:a}=Ba(s,e),c=new Map(i.map(f=>[f.id,f])),d=Ce(s),h=we(s),l=[...d,...h],u=$e(s),m=La(s),M=f=>be(s,f),g=f=>me(s,f),x={mode:t,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],folds:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},_=0;return s.days.forEach((f,O)=>{let H=O*1440,G=new Map(f.events.map(b=>[b.id,b])),pe=b=>b&&G.has(b)?{day:f.date,event:b}:null,w=ds(f),k=f.events.length,y=hs(f.date,n.date),C=Ga(s,f,u,a);x.dayHeads.push({date:f.date,y:_,label:Ae(f.date),tag:y,sub:(k?`${k} ${k===1?"activity":"activities"}${f.done?" left":""}`:f.done?"All done for today":"Nothing scheduled")+(w?` · ${w} to sort out`:""),warn:w>0,h:Ot+(C?C.h+co+2:0),allDay:C?.chips??[]}),x.anchors.push({t:H,y:_});let P=x.dayHeads[x.dayHeads.length-1],L=_+P.h+ns,j=h.flatMap(b=>f.drivers[b]?.outings??[]);if(!k&&!j.length){x.empties.push({key:f.date,y:L,text:f.done?"Nothing else today":"Nothing planned"}),_=L+40,x.anchors.push({t:H+1439,y:_});return}let W=(b,N,U,E,v,$,A,B=b.kid)=>{let I=!!b.own&&B===b.own,Z=!!b.own&&B!==b.own,q=I?pt:u.get(B)??he(0),S=I?g(B):M(B),te=Z?{drop:{text:`${A?`${Bt} `:""}With ${g(b.own)}`,tone:b.attending===!1?"muted":"normal"},pick:null}:A&&!b.own?mo(b.lines):b.lines,V=I?Sa(s,b):[],Te=(b.takes!=null?`${b.takes} min, any time ${F(b.start)}–${F(b.end)}`:xn(b)+(b.arrive_by!=null?` · arrive ${F(b.arrive_by)}`:"")+ho(b))+(V.length?` · with ${ft(V)}`:"");return{key:`${f.date}|card|${b.id}`+(b.own?`|${B}`:""),x:N,y:U,w:E,h:v,target:{day:f.date,event:b.id},event:b,color:q,kidName:S,clash:$,stayed:!b.own&&b.stay&&h.includes(b.drop),skipped:b.attending===!1,title:Oa(b.title,S),time:Te,drop:te.drop,pick:te.pick,showDrop:!!te.drop&&(A||v>=56),showPick:!!te.pick&&(A||v>=74),wrap:A,aria:`${S}, ${b.title} ${b.takes!=null?`any time from ${F(b.start)} to ${F(b.end)}`:xn(b).replace("–"," to ")}. `+(b.attending===!1&&!te.drop?"Not attending. ":"")+[te.drop,te.pick].filter(ce=>!!ce).map(ce=>ce.text).join(". ")}},Q=b=>{let N=f.rides[b];return N?(f.drivers[N.driver]?.segments??[]).filter(E=>E.type!=="home"&&E.kids.includes(N.kid)&&ue(E.start)>=ue(N.start)&&ue(E.end)<=ue(N.end)):[]},ne=b=>{let N=f.rides[b];if(!N)return null;let U=N.serves.find(E=>G.get(E)?.kid===N.kid);return pe(U??N.serves[0])},z=(b,N)=>{if(N.event)return N;let U=f.events.find(E=>E.own&&E.own!==b&&E.along.includes(b)&&E.title===N.title);return U?{...N,title:`${N.title} with ${g(U.own)}`}:N},J=b=>{if(b.takes==null)return[b.start,b.end];let N=b.planned??b.start;return[N,N+b.takes]},ee=new Map;for(let b of f.issues)b.level!=="problem"||!b.event||(b.kind==="late"&&ee.set(b.event,`${Math.round(ue(b.minutes))} min late`),b.kind==="waiting"&&ee.set(`${b.event}|pick`,`Waits ${Math.round(ue(b.minutes))} min`));if(!o){let b=1/0,N=-1/0;for(let S of f.events)S.start<=0&&S.end>=1440||(S.start>0?b=Math.min(b,S.start-20,S.arrive_by!=null?S.arrive_by-10:1/0):b=Math.min(b,S.end-30),S.end<1440?N=Math.max(N,S.end+20):N=Math.max(N,S.start+30));for(let S of j)S.start!=null&&(b=Math.min(b,S.start)),S.end!=null&&(N=Math.max(N,S.end));let U=f.from;U!=null&&Number.isFinite(b)&&b<U+60?b=U-15:f.date===n.date&&Number.isFinite(b)&&n.minutes>b-60&&n.minutes<N&&(b=Math.min(b,n.minutes-15));let E=Number.isFinite(b)?Math.floor((b-5)/30)*30:900,v=Math.max(Number.isFinite(N)?Math.ceil((N+5)/30)*30:960,E+60),$=S=>U!=null&&ue(S)<=E,A=S=>U!=null&&ue(S)<E,B=Ha(za(f,h,J,f.date===n.date?n.minutes:null),E,v),I=S=>Math.round(L+Ua(Math.max(E,Math.min(v,S))-E,B,E));x.anchors.push({t:H+E,y:I(E)});for(let S of B)x.anchors.push({t:H+S.from,y:I(S.from)},{t:H+S.to,y:I(S.to)}),x.folds.push({key:`${f.date}|fold|${S.from}`,y:I(S.from),h:I(S.to)-I(S.from),from:S.from,to:S.to,label:Fa(S.to-S.from)});x.anchors.push({t:H+v,y:I(v)});let Z=(S,te)=>B.some(V=>te?S>=V.from&&S<=V.to:S>V.from&&S<V.to);for(let S of d){let te=c.get(S),V=u.get(S),Te=(f.kids[S]?.items??[]).filter(D=>D.start!=null&&D.end!=null&&!$(D.end)).map(D=>({item:D,s:ue(D.start),en:ue(D.end)})),ce=[];for(let D of Da(Te)){let K=te.w/D.cols,Y=Math.round(te.x+D.col*K),se=Math.round(K-(D.cols>1?4:0)),le=I(D.s),ie=D.item;if(ie.type==="act"){let Ee=G.get(ie.event??"");if(!Ee)continue;let Xt=Math.max(30,I(D.en)-le),lt=W(Ee,Y,le,se,Xt,ie.clash,!1,S);if(lt.layer=It,lt.cut=A(D.s),x.cards.push(lt),Ee.arrive_by!=null&&Ee.start-Ee.arrive_by>=5&&!lt.cut){let On=I(Ee.arrive_by),oi={key:`${f.date}|prep|${Ee.id}`,x:Y,y:On,w:se,h:le-On+Ie,color:V,label:`Arrive by ${F(Ee.arrive_by)}`,layer:It-1};x.preps.push(oi),ce.push({s:Ee.arrive_by,en:D.en,top:On,bottom:le+Xt,x:Y,w:se,prep:oi,card:lt})}else ce.push({s:D.s,en:D.en,top:le,bottom:le+Xt,x:Y,w:se,card:lt});let si=ee.get(Ee.id);si&&x.marks.push({key:`${f.date}|late|${Ee.id}`,x:Y+se-4,y:le+4,text:si,right:!0});let ii=ee.get(`${Ee.id}|pick`);ii&&x.marks.push({key:`${f.date}|wait|${Ee.id}`,x:Y+4,y:le+Xt+2,text:ii,right:!1});continue}let X=f.rides[ie.ride??-1];if(!X)continue;let Le=Math.max(22,I(D.en)-le),Tt=ss(Q(X.index),m),ei=g(X.driver),ti={key:`${f.date}|ride|${X.index}`,x:Y,y:le,w:se,h:Le,target:ne(X.index),l1:`${X.own?"In":"Along in"} ${ei}’s car`,l2:Tt.join(" → "),show2:no(Le)>0,lines2:no(Le),dashed:!X.own,clash:ie.clash,aria:`${M(S)} ${X.own?"in":"riding along in"} ${ei}’s car, ${F(ue(X.start))} to ${F(ue(X.end))}: ${Tt.join(" to ")}`};x.rides.push(ti);let ni=c.get(X.driver),Bn=null;ni&&(Bn={key:`${f.date}|band|${X.index}`,x:Y+se,y:le,w:Math.max(0,ni.x+8-(Y+se)),h:Le,color:V},x.bands.push(Bn)),ce.push({s:D.s,en:D.en,top:le,bottom:le+Le,x:Y,w:se,ride:ti,band:Bn})}let Yt=D=>D.ride?.layer??(D.prep?It-1:It),$t=(D,K,Y,se)=>{Y>Ie&&x.links.push({key:`${D.key}|link`,x:D.x,y:K,w:D.w,h:Y,color:V,layer:se})},R=(D,K)=>{if(!(K.x<D.x||K.x+K.w>D.x+D.w)&&(D.x=K.x,D.w=K.w,D.ride.x=K.x,D.ride.w=K.w,D.band)){let Y=D.band.x+D.band.w;D.band.x=K.x+K.w,D.band.w=Math.max(0,Y-D.band.x)}},de=new Set;for(let D of[...ce].sort((K,Y)=>Y.s-K.s)){let K=D.ride;if(!K)continue;let Y=ce.filter(ie=>ie!==D&&ie.s>=D.en&&ie.s-D.en<=Ji&&ie.top>=D.bottom).sort((ie,X)=>ie.s-X.s||ie.top-X.top)[0];if(!Y)continue;de.add(D),R(D,Y);let se=Yt(Y),le=Y.top-D.bottom;$t(K,D.bottom,le+Ie,se-1),K.layer=se-(le>0?2:1),K.h+=Ie,K.tuckBottom=Ie}for(let D of[...ce].sort((K,Y)=>K.s-Y.s)){let K=D.ride;if(!K||de.has(D))continue;let Y=ce.filter(ie=>ie!==D&&ie.en<=D.s&&D.s-ie.en<=Ji&&ie.bottom<=D.top&&(ie.card||ie.ride?.layer!=null)).sort((ie,X)=>X.en-ie.en||X.bottom-ie.bottom)[0];if(!Y)continue;R(D,Y);let se=Y.ride?.layer??It,le=D.top-Y.bottom;$t(K,Y.bottom-Ie,le+Ie,se-1),K.layer=se-(le>0?2:1),K.y-=Ie,K.h+=Ie,K.tuckTop=Ie}}for(let S of h){let te=c.get(S),V=f.drivers[S];if(!V)continue;let Te=[],ce=null;for(let R of V.segments)if(!(R.start==null||R.end==null)){if(R.type==="home"){ce=null;continue}if(R.type==="stay"){ce=null,Te.push({type:"stay",g:R,s:R.start,en:R.end});continue}ce&&ce.en===R.start?(ce.en=R.end,ce.legs.push(R)):(ce={type:"trip",s:R.start,en:R.end,legs:[R]},Te.push(ce))}let Yt=new Set,$t=(R,de,D,K)=>{Yt.add(R.id);let Y=I(de),se=W(R,te.x+8,Y,te.w-16,Math.max(30,I(D)-Y),!1,!1,S);se.cut=A(de),K&&se.drop?.tone==="normal"&&(se.drop=null,se.showDrop=!1),x.cards.push(se)};for(let R of Te){if($(R.en))continue;let de=I(R.s),D=Math.max(24,I(R.en)-de);if(R.type==="stay"){let X=G.get(R.g.event??R.g.serves??"");if(X?.own===S){$t(X,R.s,R.en,!0);continue}let Le=X?u.get(X.kid)??he(0):he(0),Tt=R.g.kids.map(M);x.stays.push({cut:A(R.s),key:`${f.date}|stay|${S}|${R.s}`,x:te.x+8,y:de,w:te.w-16,h:D,target:pe(X?.id),color:Le,l1:X?`At ${X.title} with ${M(X.kid)}`:"Staying",l2:`until ${F(R.en)}`+(Tt.length?` · ${Tt.join(" and ")} too`:"")});continue}let K=R.legs[0],Y=R.legs[R.legs.length-1],se=[];for(let X of R.legs)for(let Le of X.kids)se.includes(Le)||se.push(Le);let le=Y.type==="drive"&&Y.to==="home",ie=ss(R.legs,m);x.trips.push({key:`${f.date}|trip|${S}|${R.s}`,x:te.x+8,y:de,w:te.w-16,h:D,target:pe(R.legs.find(X=>X.serves)?.serves),l1:K.type==="drive"&&K.from==="home"?`Leave ${F(R.s)}`:`From ${vn(m,K.from??K.place)} ${F(R.s)}`,l2:ie.join(" → "),show2:D>=36,l3:le?`Home ${F(R.en)}`:"",show3:le&&D>=62,stops:null,kids:se.map(X=>(u.get(X)??he(0)).color),bad:R.legs.some(X=>X.overlaps_busy),aria:`${g(S)} drives ${ie.join(" to ")}, ${F(R.s)} to ${F(R.en)}`})}for(let R of V.segments)if(!(!R.overlaps_busy||R.start==null||R.end==null))for(let de of V.busy){let D=Math.max(R.start,de.start),K=Math.min(R.end,de.end);K<=D||$(K)||x.overlaps.push({key:`${f.date}|overlap|${S}|${D}`,x:te.x+6,y:I(D)-2,w:te.w-12,h:Math.max(8,I(K)-I(D)+4)})}for(let R of f.events)if(R.own===S&&(!Yt.has(R.id)&&!$(J(R)[1])&&$t(R,...J(R),!1),R.takes!=null&&R.attending!==!1&&!$(R.end))){let de=I(R.start);x.windows.push({key:`${f.date}|window|${R.id}`,x:te.x+4,y:de,w:te.w-8,h:Math.max(24,I(R.end)-de),label:`${R.title} · any time ${F(R.start)}–${F(R.end)}`})}for(let R of V.busy){if(R.event||R.end<=E||R.start>=v)continue;let de=z(S,R),D=I(de.start),K=I(de.end);x.busy.push({key:`${f.date}|busy|${S}|${de.start}`,x:te.x+1,y:D,w:te.w-2,h:K-D,labelY:8,label:to(de,!1)})}}let q=-1/0;for(let S=E;S<=v;S+=30)Z(S,!0)||x.grid.push({key:`${f.date}|grid|${S}`,y:I(S),strong:S%60===0}),(B.some(V=>V.from===S||V.to===S)||S%60===0&&!Z(S,!1))&&I(S)-q>=22&&(x.hours.push({key:`${f.date}|hour|${S}`,y:I(S)-8,label:S%60===0?wi(S):Pe(S)}),q=I(S));f.date===n.date&&n.minutes>E&&n.minutes<v&&(x.now={y:I(n.minutes),label:`Now ${F(n.minutes)}`}),_=I(v)+ns;return}let oe=[];for(let b of d){let N=c.get(b);for(let U of f.kids[b]?.items??[])if(U.start!=null){if(U.type==="act"){let E=G.get(U.event??"");if(!E)continue;oe.push({col:b,s:U.start,h:ao(E,N.w),kind:"act",item:U})}else if(!f.rides[U.ride??-1]?.own){let E=f.rides[U.ride??-1],v=E?f.drivers[E.driver]?.outings.find($=>$.start!=null&&$.start<=ue(E.start)&&ue(E.start)<=ue($.end,$.start)):void 0;oe.push({col:b,s:v?.start??U.start,h:ja,kind:"along",item:U})}}}for(let b of h){let N=f.drivers[b];if(!N)continue;for(let E of N.busy)E.event||oe.push({col:b,s:E.start,h:32,kind:"busy",busy:z(b,E)});let U=c.get(b).w;for(let E of f.events)E.own!==b||!E.busy_only&&E.attending!==!1&&(E.takes==null||E.planned!=null)||oe.push({col:b,s:J(E)[0],h:ao(E,U),kind:"own",event:E});for(let E of N.outings){if(E.start==null)continue;let $=[...io(E.lines)?E.lines.slice(0,-1):E.lines,...E.warn?[E.warn]:[]].reduce((A,B)=>A+rs(B,U-36,7),0);oe.push({col:b,s:E.start,h:30+$*16,kind:"out",out:E})}}oe.sort((b,N)=>b.s-N.s||l.indexOf(b.col)-l.indexOf(N.col));let ke=new Map,ge=[],fe=new Map,Se=L-so;for(let b=0;b<oe.length;){let N=b,U=Se+so;for(;N<oe.length&&oe[N].s===oe[b].s;N++){let v=ke.get(oe[N].col);v!=null&&(U=Math.max(U,v+mn))}let E=new Set;for(let v=b;v<N;v++){let $=oe[v],A=E.has($.col)?ke.get($.col)+mn:U;E.add($.col),ke.set($.col,A+$.h)}fe.set(oe[b].s,U),oe[b].s>0&&x.hours.push({key:`${f.date}|hour|${oe[b].s}`,y:U+2,label:Pe(oe[b].s)}),Se=U,b=N}ke.clear(),oe.forEach((b,N)=>{let U=ke.get(b.col),E=Math.max(U!=null?U+mn:L,fe.get(b.s));ke.set(b.col,E+b.h);let v=b.kind==="busy"?b.busy.end:b.kind==="act"?G.get(b.item.event??"")?.end??null:b.kind==="own"?J(b.event)[1]:null;ge.push({col:b.col,s:b.s,end:v,y:E,h:b.h,box:null}),x.anchors.push({t:H+b.s,y:E});let $=c.get(b.col);if(b.kind==="busy"){let A={key:`${f.date}|busy|${b.col}|${N}`,x:$.x+1,y:E,w:$.w-2,h:b.h,labelY:8,label:to(b.busy,!0)};x.busy.push(A),ge[ge.length-1].box=A}else if(b.kind==="out"){let A=b.out,B=io(A.lines),I=B?A.lines.slice(0,-1):A.lines;x.trips.push({key:`${f.date}|trip|${b.col}|${N}`,x:$.x+8,y:E,w:$.w-16,h:b.h,target:pe(A.target),l1:B?`${A.lead} · home ${B}`:A.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...I.map(Z=>({text:Z,warn:!1})),...A.warn?[{text:A.warn,warn:!0}]:[]],kids:A.kids.map(Z=>(u.get(Z)??he(0)).color),bad:!!A.warn,aria:`${g(b.col)}: ${A.lead}. ${A.lines.join(". ")}${A.warn?`. ${A.warn}`:""}`})}else if(b.kind==="own"){let A=W(b.event,$.x+8,E,$.w-16,b.h,!1,!0,b.col);x.cards.push(A),ge[ge.length-1].box=A}else if(b.kind==="act"){let A=G.get(b.item.event??""),B=W(A,$.x,E,$.w,b.h,b.item.clash,!0,b.col);x.cards.push(B),ge[ge.length-1].box=B}else{let A=f.rides[b.item.ride??-1],B=ss(Q(A.index),m),I=g(A.driver);x.rides.push({key:`${f.date}|ride|${A.index}`,x:$.x,y:E,w:$.w,h:b.h,target:ne(A.index),l1:`${Bt} with ${I}`,l2:B.join(" → "),show2:!1,lines2:go,dashed:!0,clash:b.item.clash,aria:`${M(b.col)} riding along with ${I}, ${F(ue(A.start))} to ${F(ue(A.end))}: ${B.join(" to ")}`})}});let xe=L;for(let b of ke.values())xe=Math.max(xe,b);for(let b of ge){if(!b.box||b.end==null)continue;let N=b.y+b.h;for(let U of ge)U.col!==b.col&&U.s>=b.s&&U.s<b.end&&(N=Math.max(N,U.y+U.h));b.end>=1440&&(N=xe);for(let U of ge)U.col===b.col&&U.y>b.y&&(N=Math.min(N,U.y-mn));N=Math.min(N,xe),N>b.y+b.h&&(b.box.h=N-b.y)}_=xe+ns+6,x.anchors.push({t:H+1439,y:_})}),x.height=_,x}function za(s,t,e,n){let o=[],i=(r,a)=>{r==null||a==null||o.push([r-Qi,Math.min(a,r+_a)+eo],[Math.max(r,a-Ca)-Qi,a+eo])};for(let r of s.events)r.own?(i(...e(r)),r.takes!=null&&i(r.start,r.end)):i(r.arrive_by??r.start,r.end);for(let r of Object.values(s.kids))for(let a of r.items??[])i(a.start,a.end);for(let r of t){let a=s.drivers[r];if(a){for(let c of a.segments)c.type!=="home"&&i(c.start,c.end);for(let c of a.outings)i(c.start,c.end);for(let c of a.busy)i(c.start,c.end)}}return n!=null&&o.push([n-30,n+30]),o}function Ha(s,t,e){let n=s.map(([c,d])=>[Math.max(t,c),Math.min(e,d)]).filter(([c,d])=>d>c).sort((c,d)=>c[0]-d[0]),o=[],i=t,r=(c,d)=>{let h=Math.ceil(c/30)*30,l=Math.floor(d/30)*30;l-h>=Ea&&o.push({from:h,to:l})},a=!1;for(let[c,d]of n)a&&c>i&&r(i,c),i=a?Math.max(i,d):d,a=!0;return o}function Ua(s,t,e){let n=s*ts,o=e+s;for(let i of t){let r=i.to-i.from;o>=i.to?n-=r*ts-Zi:o>i.from&&(n-=(o-i.from)*ts-(o-i.from)/r*Zi)}return n}function Fa(s){let t=Math.floor(s/60),e=s%60>=30;return`${t}${e?"½":""} hrs`}var Ka=["","¼","½","¾"];function Qe(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Ct(n);let o=Math.round(n*4),i=Math.floor(o/4),r=Ka[o%4];return`${i||!r?i:""}${r} min`})}function vo(s){let t=e=>e?{...e,text:Qe(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(Qe),warn:i.warn==null?i.warn:Qe(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:Qe(n.title),body:Qe(n.body),note:n.note==null?n.note:Qe(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:Qe(o.note)}))}:{}}))}))}}var Wa=2,Va=48;function yo(s,t,e=Va){let n=[],o=new Set(we(s)),i=Ce(s).map(u=>be(s,u)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],a=0,c=0,d=0,h=0,l=t.minutes+e*60;for(let u of s.days){let m=De(t.date,u.date),M=m===0?"":`${ve(u.date)} · `,g=new Map(u.events.map(f=>[f.id,f])),x=f=>f&&g.has(f)?{day:u.date,event:f}:null,_=(f,O)=>m*1440+(f??g.get(O??"")?.start??0)<l;for(let f of u.issues)if(f.level==="problem"){if(!_(f.at,f.event)){d++,f.kind==="unassigned"&&h++;continue}a++,f.kind==="unassigned"&&c++,n.push({key:`${u.date}|${f.key}`,tone:f.kind==="unassigned"?"unassigned":"problem",title:M+f.title,body:f.body,target:x(f.event),suggestions:(f.suggestions??[]).map(O=>({id:O.id,label:O.label,note:O.note}))})}if(u.clashes.forEach((f,O)=>{if(!_(f.a.start,f.a.event)){d++;return}a++;let H=g.get(f.a.event??""),G=be(s,f.kid),pe=(k,y)=>{let C=x(y);return C?{text:k,target:C}:k},w=[];if(f.b.type==="act"){let k=g.get(f.b.event??"");H&&k&&(w=[pe(H.title,H.id),` ${F(H.start)}–${F(H.end)} and `,pe(k.title,k.id),` ${F(k.start)}–${F(k.end)} overlap.`])}else{let k=u.rides[f.b.ride??-1];H&&k&&(w=[`${G} is in `,pe(`${me(s,k.driver)}’s car`,k.serves[0]),` ${F(ue(f.b.start))}–${F(ue(f.b.end))}, during `,pe(H.title,H.id),"."])}n.push({key:`${u.date}|clash|${O}`,tone:"problem",title:`${M}${G} is double-booked`,body:w.map(k=>typeof k=="string"?k:k.text).join(""),parts:w,target:null,suggestions:[]})}),m>=0&&m<Wa)for(let f of u.issues)f.level!=="heads_up"||!_(f.at,f.event)||n.push({key:`${u.date}|${f.key}`,tone:"heads_up",title:M+f.title,body:f.body,target:x(f.event),suggestions:[]});for(let f of u.unplaced??[]){if(!_(f.at)){d++;continue}a++;let O=f.people.map(G=>o.has(G)?me(s,G):be(s,G)),H=f.from_notes?"The For line in its notes":"Its title";n.push({key:`${u.date}|unplaced|${f.id}`,tone:"problem",title:`${M}${F(f.at)} ${f.title}: ${xo(f).toLowerCase()}`,body:f.reason==="unknown"&&f.word?`${H} names “${f.word}”, who isn’t anyone in the family, so ${O.length?`it’s only in ${ft(O)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:u.date,id:f.id}})}for(let f of u.events)!f.problems.length||!_(f.start)||n.push({key:`${u.date}|notes|${f.id}`,tone:"heads_up",title:`${M}Check the notes on ${wn(s,f)}’s ${f.title}`,body:`These lines couldn’t be read: ${f.problems.join("; ")}`,target:x(f.id),suggestions:[]})}return{items:n,problems:a,unassigned:c,later:d,laterUnassigned:h}}function xo(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function Ga(s,t,e,n){let o=new Set(we(s)),i=h=>{let l=h[0];return l==null?null:o.has(l)?pt:e.get(l)??null},r=[...(t.all_day??[]).map(h=>({key:`${t.date}|allday|${h.id}`,title:h.title,note:h.days>1?`Day ${h.day_number} of ${h.days}`:"",color:i(h.people),cancelled:h.cancelled,warn:!1,pick:null,notes:h.notes??""})),...(t.unplaced??[]).map(h=>({key:`${t.date}|unplaced|${h.id}`,title:`${F(h.at)} ${h.title}`,note:xo(h),color:null,cancelled:!1,warn:!0,pick:h.id,notes:h.notes??""}))];if(!r.length)return null;let a=Math.max(120,n-ut),c=1,d=0;for(let h of r){let l=Math.min(a,30+7*(h.title.length+(h.note?h.note.length+2:0))+(h.notes?16:0));d&&d+l>a&&(c++,d=0),d+=l}return{key:`${t.date}|allday`,h:c*Ma+(c-1)*co,chips:r}}function wo(s,t){let e=$e(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=De(t.date,i.date);if(!(r<0))for(let a of we(s))for(let c of i.drivers[a]?.outings??[]){if(c.start==null)continue;let d=r*1440+c.start;if(r*1440+ue(c.end,c.start)<=t.minutes)continue;let l=d-t.minutes,u={driver:a,name:me(s,a),date:i.date,ahead:r,start:c.start,inMinutes:l,ongoing:l<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(m=>e.get(m)??he(0)),warn:c.warn,target:c.target&&i.events.some(m=>m.id===c.target)?{day:i.date,event:c.target}:null};(!n||o(u)<o(n)||o(u)===o(n)&&u.inMinutes<n.inMinutes)&&(n=u)}}return n}function gt(s){return s.state==="done"||s.state==="late"}var qa=780;function Ya(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<qa}function ko(s,t){return s.chores.map(e=>Ya(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function $o(s){return s.state==="open"||s.state==="overdue"}function fs(s,t,e){if(gt(s)){let n=s.done_at?Xa(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${us(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${us(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=De(t,s.due);return`By ${o===1?"tomorrow":o<7?ve(s.due):ps(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${us(s.for_day,t)}`;if(s.due&&s.due>t){let n=De(t,s.due);return n===1?"By tomorrow":`By ${n<7?ve(s.due):ps(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function us(s,t){let e=De(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ve(s):ps(s)}function ps(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Xa(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let i=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return i===t?r:`${ve(i)} ${r}`}function To(s,t,e=1440){let n=ko(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(h=>h.kid===o.id),a=new Map;for(let h of r){if(h.state!=="upcoming")continue;let l=h.shows_from??h.due??s.today;a.set(l,[...a.get(l)??[],h])}let c=r.filter(h=>h.state==="overdue"),d=r.filter(h=>h.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??he(i),overdue:c,now:d,done:r.filter(gt),later:[...a.entries()].sort(([h],[l])=>h.localeCompare(l)).map(([h,l])=>({date:h,chores:l})),left:c.length+d.length}})}function Eo(s,t=1440){return ko(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function gs(s){return!s.chores.length&&!s.templates.length}var et=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function ms(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>et.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function bs(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${et[n[0]]}-${et[n.at(-1)]}`]:n.map(o=>et[o])).join(", ")}var tt="none";function kn(s){return s==="daily"||s==="school"?"":"Any"}function _o(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Co(s){let t=s.days??kn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function vs(s){return s.title.trim()?s.who.length?s.days===tt?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Po(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function ys(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function xs(s,t,e=1,n=!1,o=!1){if(s==="school"){let h=t.trim().replace(/-/g,"–"),l=o?h?`${h} Bring lunch days`:"Bring lunch days":h?`${h} school days`:"Every school day";return n?`${l}, the night before`:l}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let d=`${a.split(",").map(h=>{let l=h.trim();return l.toLowerCase()==="last"?"the last day":/^\d+$/.test(l)?`the ${ys(Number(l))}`:`the ${l}`}).join(" and ")} ${r}`;return d[0].toUpperCase()+d.slice(1)}function ws(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function ks(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function $n(s,t){return`${s}|${t}`}function mt(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function Tn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Ao(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Mo(s,t){return Tn(t)<5&&!Ao(s,t)}function Nt(s,t,e=new Map){if(!Mo(s,t))return null;let n=$n(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function bt(s,t){return Mo(s,t)?s.menus?.[t]??null:null}var Ja="From the school's menu feed.";function Za(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Ja);return t.length?t.join(`
`):null}function Be(s){return s.slice(0,7)}function En(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function $s(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function So(s){let t=[];for(let e=Be(s.first);e<=Be(s.last);e=$s(e))t.push(e);return t}function Lo(s,t,e,n=new Map){let o=`${e}-01`,i=mt(o,-Tn(o)),r=[];for(;Be(i)<=e;){let a=[];for(let c=0;c<5;c++){let d=mt(i,c),h=Be(d)!==e,l=h?null:Ao(t,d),u=h?null:Nt(t,d,n);a.push({date:d,day:Number(d.slice(8)),outside:h,off:l?l.title:null,lunch:u?.lunch??null,picked:u?.picked??!1,menu:h?null:bt(t,d)?.dish??null,sides:h?null:Za(bt(t,d)?.details??""),past:d<s.today,today:d===s.today})}a.some(c=>!c.outside)&&r.push(a),i=mt(i,7)}return r}function Do(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Ro(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Io(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=mt(t,i),a=Nt(s,r,n);if(!a)continue;let c=De(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":ve(r),date:r,menu:bt(s,r)?.dish??null}}return null}var Qa={timeline:"timeline",full:"timeline",compact:"compact"};function nt(s){let t=new URLSearchParams(s),e={},n=Qa[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var el=["auth_callback","code","state"];function Ts(s){let t=new URLSearchParams(s);for(let n of el)t.delete(n);let e=t.toString();return e?`?${e}`:""}function Es(s,t=0){return s==null||!Number.isFinite(s)?t:s}function tl(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function nl(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&Es(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function sl(s,t){let e=new Set(s.events.filter(i=>tl(s,i)<=t).map(i=>i.id)),n=i=>Es(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:nl(r.segments,t),outings:r.outings.filter(a=>a.start==null||Es(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function Bo(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?sl(e,t.minutes):e)}}var Oo=Ge`
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
  /* A folded stretch of Timeline: a torn strip over the quiet time, saying how long it hides. */
  .fold {
    left: 60px;
    z-index: 2;
    pointer-events: none;
  }
  .fold svg {
    display: block;
    overflow: visible;
  }
  .fold-fill {
    fill: var(--bg);
  }
  .fold-edge {
    fill: none;
    stroke: #cfccc4;
    stroke-width: 1.5;
    stroke-linejoin: round;
  }
  .fold-label {
    left: 0;
    padding: 1px 6px;
    border-radius: 9px;
    background: var(--surface);
    border: 1px solid var(--line);
    white-space: nowrap;
    font-size: 11.5px;
    line-height: 15px;
    font-weight: 700;
    color: var(--muted);
    z-index: 2;
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
`;function il(s,t,e,n,o=14){let i=s.top-o-8,r=e.h-s.bottom-o-8,a=t.h<=i,c=t.h<=r,d=n?a||!c&&i>r:!c&&(a||i>r),h=d?s.top-o-t.h:s.bottom+o,l=Math.max(8,Math.min(h,e.h-8-t.h)),u=Math.max(8,Math.min(s.x-t.w/2,e.w-8-t.w));return{left:Math.round(u),top:Math.round(l),above:d}}function jt(s,t){for(let e of s.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var _n=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?jt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=jt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let i=this.press;!i||i.el!==e||!e.isConnected||(i.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&jt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=jt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&jt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let i=t.dataset.note;if(!i)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=i,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let a={w:r.offsetWidth,h:r.offsetHeight},c={w:window.innerWidth,h:window.innerHeight},d=il(e,a,c,n,o);r.style.left=`${d.left}px`,r.style.top=`${d.top}px`,r.classList.toggle("above",d.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};var kr="mydashlight.rides.view",Bc=1100,Oc=440,Nc=700,jc=3*6e4,vr=1200,zc=450,Hc=110;function Uc(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var In=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,yr=ae`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,xr=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Fc=new URL("emoji.json",import.meta.url).href,wr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Ws=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Vs=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Kc=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Wc=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Ut={bring:"Bring",buy:"Buy"};function Vc(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Me(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Gs(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Gc(s,t){return hs(s,t)||Ae(s).split(",")[0]}function qc(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Yc(){try{return localStorage.getItem(kr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function Xc(s){try{localStorage.setItem(kr,s)}catch{}}function qs(s,t){return we(s).includes(t)?me(s,t):be(s,t)}function Ft(s){return s.days.every(t=>!t.events.length)}var Kt=class extends _e{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=nt(location.search).view;this.urlPage=nt(location.search).page;this.urlPast=nt(location.search).past;this.urlDayPicker=nt(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},jc))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??Yc(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new _n(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(d=>d.id===r);(!c||(c.picks[a]??null)===i||!Nt(c,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&gt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=vo(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Bc)return!1;let e=this.plan;return!e||this.width-Oc>=as(Ce(e).length,we(e).length)}today(){return _t(this.plan?.time_zone??Uc())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Bo(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=bo(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(h=>h.date===this.pinDay)?.h??Ot,a=cs(e,i.scrollTop+r+4),c=n.days[Math.floor(a/1440)]?.date,d=c?o.days.findIndex(h=>h.date===c):-1;d>=0&&(this.keepAt=d*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,po(o,e)-lo(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let c=1/0;if(this.mode==="timeline"){for(let d of a.events)c=Math.min(c,d.arrive_by??d.start);for(let d of Object.values(a.drivers))for(let h of d.outings)h.start!=null&&(c=Math.min(c,h.start))}this.scrollToTime(r*1440+(Number.isFinite(c)?Math.max(0,c-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=n+1&&(o=c);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),a=this.today().date;if(r){let c=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),d=c>0?"up":"down";this.board.dayHeads.some(h=>h.date===a)&&o.date!==a?i=`${d}|Today`:this.mode==="timeline"&&Math.abs(c)>e.clientHeight*.6&&(i=`${d}|${o.date===a?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,o),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof re?r:new re("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??gt(e)}editMenu(e,n){let o=this.lunch?.kids??[],i=bt(e,n),r=o.filter(a=>a.id===e.id||i&&bt(a,n)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof re?o:new re("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set($n(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let d of n)a.delete($n(e,d));this.lunchDraft=a;let c=r instanceof re?r:new re("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Co(e):_o(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(br(),mr))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||vs(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Po(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof re?n:new re("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof re?n:new re("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Ot;this.keepAt=n&&this.board?cs(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||Xc(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),i=this.plan;if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...Ce(i),...we(i)]);this.forPick={day:e,id:n,placed:!1,label:`${F(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}changeForPick(e,n,o){let i=e.who?.[o.event_id],r=i?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${F(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!i?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let n=this.forPick,o=this.plan;if(!n||!o||!this.backend||!e&&!n.people.length)return;let i=e?[]:n.people;this.forPick={...n,busy:!0};try{await this.backend.setPeople(n.id,i,n.scope),this.forPick=null;let r=n.label.replace(/^\S+ /,""),a=i.map(c=>qs(o,c));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:`Saved. ${r} is in ${ft(a)}’s ${a.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let a=r instanceof re?r:new re("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}}renderForPick(e){let n=this.plan,o=e.placed?n?.days.some(_=>_.date===e.day&&_.events.some(f=>f.id===e.id)):!!this.findUnplaced(e.day,e.id),i=p`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return p`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">Who is this for?</span></div>
          ${i}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let r=e.busy,a=_=>{this.forPick&&(this.forPick={...this.forPick,..._})},c=_=>a({people:e.people.includes(_)?e.people.filter(f=>f!==_):[...e.people,_]}),d=$e(n),h=Ce(n),l=h.length>1&&h.every(_=>e.people.includes(_)),m=[...h,...we(n)].filter(_=>e.people.includes(_)),M=m.map(_=>qs(n,_)),g=M.length<2?M.join(""):`${M.slice(0,-1).join(", ")} & ${M[M.length-1]}`,x=(_,f,O,H)=>p`<button
      type="button"
      class="who-chip"
      style="--c:${O.color};--rgb:${O.rgb}"
      aria-pressed=${e.people.includes(_)?"true":"false"}
      ?disabled=${r}
      @click=${()=>c(_)}
    >
      <span class="avatar ${H?"driver":""}" aria-hidden="true">${Me(f)}</span>${f}
    </button>`;return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">Who is this for?</span>
          <span class="ed-meta">${Ae(e.day)} · ${e.label}</span>
        </div>
        ${i}
      </div>
      ${e.word?p`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:T}
      ${e.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${r} @click=${()=>a({scope:"this"})}>
                Just ${ve(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${r} @click=${()=>a({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:T}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${h.map(_=>x(_,be(n,_),d.get(_)??he(0),!1))}
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
          ${we(n).map(_=>x(_,me(n,_),pt,!0))}
        </div>
      </div>
      <p class="field-hint">
        ${m.length?p`Saved in the event’s notes as <strong>For: ${g}</strong>, so its title stays as it is. It shows in ${m.length>1?"their lanes":`${M[0]}’s lane`}${m.some(_=>h.includes(_))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?p`<button type="button" class="chip clear" ?disabled=${r} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!m.length} @click=${()=>void this.saveForPick()}>
          ${r?"Saving to Google Calendar…":m.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderForLine(e,n,o){let i=e.who?.[o.event_id];if(!i)return T;let r=i.people.map(a=>qs(e,a));return p`<span class="ed-for"
      >For ${ft(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,n,o)}>Change</button></span
    >`}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof re?i:new re("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,i;n<0?i=(o??e.start)-5:i=o==null||o+5>=e.start?null:o+5,this.arriveDraft=i,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),vr)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,i;o==null?i=n<0?Math.max(e.start+5,e.end-15):null:n<0?i=Math.max(e.start+5,o-5):i=o+5>=e.end?null:o+5,this.leaveDraft=i,this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),vr)}clearLeave(){this.leaveDraft=null,this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>i.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,Hc)},zc)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?yo(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?Eo(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],c=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,d=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",h=p`<aside class="panel" aria-label=${d}>
      ${c??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,l=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<Nc?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${l?this.renderBanner(e):T}
          <main>
            ${l?p`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Ft(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Ft(o)?this.renderDayRail(o):T}
                  ${n&&this.away?this.renderBackToToday(this.away):T}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${h}`:T}
          </main>
        </div>
        ${r?h:T}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:T}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),a="";if(e){let u=e.time_zone,m=new Date(e.updated);this.error?a=p`<span class="bad">${Ti(this.error)} · showing the plan from ${en(m,new Date,u)}</span>`:e.status&&!e.status.ok?a=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${en(m,new Date,u)}</span>`:this.backend?.live||(a=`Updated ${en(m,new Date,u)}`)}let c=(u,m,M,g)=>p`
      <button type="button" class="seg-btn" title=${g} aria-pressed=${this.mode===u?"true":"false"} @click=${()=>this.setMode(u)}>
        ${M}<span class="seg-label">${m}</span>
      </button>
    `,d=(u,m,M)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===u?"true":"false"} @click=${()=>this.setPage(u)}>
        ${M}<span class="seg-label">${m}</span>
      </button>
    `,h=Pe(r.minutes),l=!!e&&Ft(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ae`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:T}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ae(r.date)}, ${h}`}>
            <span class="hm">${h.slice(0,-3)}</span><span class="ampm">${h.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Ae(r.date)}${typeof a=="string"&&a?p`<span class="status"> · ${a}</span>`:T}
          </p>
          ${a&&typeof a!="string"?p`<p class="status">${a}</p>`:T}
        </div>
        ${e&&!l?this.renderNext(e,wo(e,r),n):T}
        <div class="controls">
          ${this.wide||l&&!o?T:p`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?T:p`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${d("rides","Rides",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${d("chores","Chores",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?T:d("lunch","Lunch",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let d=this.today().date,h=o.unassigned,l=o.laterUnassigned;if(h){let m=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${h} ${h===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?p`<div class="next idle needs">${m}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${m}</button>`}if(l)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${l} ${l===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let u=e.days.some(m=>m.date>=d&&m.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${u?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${u?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${Ct(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${ve(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=p`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Me(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(d=>p`<span class="kid-dot" style="background:${d.color}"></span>`)}</span>
        ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:T}
      </span>
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?p`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:p`<div class=${c}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return T;let n=this.today().date,o=$e(e),i=this.railShown;return p`<div
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
        ${e.days.map(r=>{let a=ds(r),c=r.events.length,d=r.events.slice(0,4).map(l=>l.own?pt.color:o.get(l.kid)?.color??he(0).color),h=`${Ae(r.date)}: ${c?`${c} ${c===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return p`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${h}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":ve(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${d.length?d.map(l=>p`<span class="rd-dot" style="background:${l}"></span>`):p`<span class="rd-free">free</span>`}
            </span>
            ${a?p`<span class="rd-badge" aria-hidden="true">${a}</span>`:T}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return p`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${ae`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=Ce(e),o=we(e),i=$e(e),r=n.map(a=>be(e,a));return p`<div class="quiet-week">
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
          When something lands on ${qc(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=i.get(a);return p`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Me(be(e,a))}</span>
            <span class="qw-name">${be(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Me(me(e,a))}</span>
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
      ${e.allDay.length?p`<div class="day-strip" style="padding-left:${ut}px">
            ${e.allDay.map(o=>{let i=p`<span class="strip-title">${o.title}</span>${o.note?p`<span class="strip-note">${o.note}</span>`:T}${o.notes?yr:T}`,r=o.pick;return r?p`<button
                    type="button"
                    class="strip-chip warn plain pick"
                    tabindex=${n?-1:0}
                    data-note=${o.notes||T}
                    aria-label=${`${o.title}: ${o.note} Pick who it’s for`}
                    @click=${()=>this.openForPick(e.date,r)}
                  >
                    ${i}
                  </button>`:p`<span
                    class="strip-chip ${o.warn?"warn":""} ${o.cancelled?"skipped":""} ${o.color?"":"plain"} ${o.notes?"noted":""}"
                    style=${o.color?`--c:${o.color.color};--rgb:${o.color.rgb};--ink:${o.color.ink}`:""}
                    tabindex=${o.notes&&!n?0:T}
                    data-note=${o.notes||T}
                    >${i}</span
                  >`})}
          </div>`:T}`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,i=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(l=>!l.own&&l.event_id===o.event.event_id).map(l=>l.id):[]),r=l=>!!l&&!!n&&l.day===n.day&&i.has(l.event),a=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],c=e.width,d=100,h=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??d-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??d})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??d+1}))].sort((l,u)=>l.z-u.z);return p`
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
              <span class="avatar ${l.kind}" aria-hidden="true">${Me(l.name)}</span>
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
          ${Re(e.bands,l=>l.key,l=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Re(e.busy,l=>l.key,l=>p`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Re(e.windows,l=>l.key,l=>p`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Re(h,l=>l.x.key,l=>{if(l.t==="link"){let g=l.x;return p`<div
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
                </button>`}let u=l.x,m=u.color,M=u.skipped?`repeating-linear-gradient(135deg, rgba(${m.rgb},0.10) 0px, rgba(${m.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:u.stayed?`repeating-linear-gradient(135deg, rgba(${m.rgb},0.24) 0px, rgba(${m.rgb},0.24) 6px, rgba(${m.rgb},0.08) 6px, rgba(${m.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${m.rgb},0.15), rgba(${m.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${u.wrap?"wrap":""} ${r(u.target)?"sel":""} ${u.clash?"clash":""} ${u.skipped?"skipped":""} ${u.cut?"cut":""} ${u.event.notes?"noted":""}"
                aria-label=${u.aria}
                data-note=${u.event.notes||T}
                style="left:${u.x}px;top:${u.y}px;width:${u.w}px;height:${u.h}px;background:${M};border-color:${u.clash?"var(--bad)":`rgba(${m.rgb},0.45)`};--c:${m.color};--rgb:${m.rgb};--ring:${m.color}"
                @click=${()=>this.open(u.target)}
              >
                ${u.event.notes?yr:T}
                <span class="top">
                  <span class="title">${u.title}</span>
                  <span class="time">${u.time}</span>
                  ${u.showDrop&&u.drop?p`<span class="line tone-${u.drop.tone}">${u.drop.text}</span>`:T}
                </span>
                ${u.showPick&&u.pick?p`<span class="line tone-${u.pick.tone}">${u.pick.text}</span>`:T}
              </button>`})}
          ${Re(e.stays,l=>l.key,l=>p`<button
                type="button"
                class="stay ${l.cut?"cut":""}"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Re(e.trips,l=>l.key,l=>p`<button
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
          ${Re(e.overlaps,l=>l.key,l=>p`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Re(e.marks,l=>l.key,l=>p`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${Re(e.folds,l=>l.key,l=>p`<div class="fold" style="top:${l.y}px;width:${c-60}px;height:${l.h}px" aria-hidden="true">
                ${Jc(c-60,l.h)}
              </div>
              <span class="fold-label" style="top:${l.y+l.h/2-9}px" title="${Pe(l.from)} to ${Pe(l.to)}">${l.label}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${c-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:T}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,a=this.plan,c=i+n.length,d=this.chores,h=!!d&&!gs(d);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?T:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${h?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?p`<div class="attn-chores">${n.map(l=>this.renderChoreRow(l,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${ae`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Ft(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
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
      ${this.wide&&a&&!Ft(a)&&this.page==="rides"?this.renderLegend():T}
    `}kidColorOf(e){let n=this.plan?$e(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return he(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let i=this.lunch,r=i?.kids.find(l=>l.id===e);if(!i||!r)return T;this.tick;let a=this.today(),c=Io(r,a.date,a.minutes,this.lunchDraft);if(!c)return T;let d=Ut[c.lunch],h=`${d} lunch ${c.when}${c.menu?`: ${c.menu}`:""}`;return n&&o<36+d.length*7.4?p`<span class="lunch-chip ${c.lunch} small icon" role="img" aria-label=${h} title=${h}
        >${c.lunch==="bring"?Ws:Vs}</span
      >`:p`<span class="lunch-chip ${c.lunch} ${n?"small":""}" title=${h}
      >${c.lunch==="bring"?Ws:Vs}<span class="lunch-chip-text"
        >${d}${n?T:` ${c.when}`}${!n&&c.menu?p`<span class="lunch-chip-menu"> · ${c.menu}</span>`:T}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=So(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Be(e.today),i=n.indexOf(o),r=h=>{let l=n[i+h];l&&(this.lunchMonth=l)},a=e.kids.some(h=>h.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(h=>h.id===a):e.kids,d=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:T;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${ae`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${En(o)}</h2>
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
          ${this.menuMode?"Done":p`${xr} Edit menus`}
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
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),a=Lo(e,n,o,this.lunchDraft),c=Ro(a),d=a.flat(),h=d.filter(g=>!g.outside&&!g.past&&g.lunch),l=n.days_off.filter(g=>Be(g.first)<=o&&o<=Be(g.last)),u=g=>h.filter(x=>Tn(x.date)===g),m=g=>{let x=u(g);if(!x.length)return;let _=x.every(f=>f.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,x.map(f=>f.date),_)},M=h.length?`${c.bring} Bring · ${c.buy} Buy${o===Be(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Me(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${M}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Ut[n.default]} unless picked</span>
          ${e.kids.length<2?T:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?Wc:Kc}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:T}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${En(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((g,x)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!u(x).length}
            aria-label=${`${u(x).every(_=>_.lunch==="bring")?"Buy":"Bring"} every ${g} left in ${En(o)} for ${n.name}`}
            @click=${()=>m(x)}
          >
            ${g}
          </button>`)}
        ${d.map(g=>this.renderLunchCell(n,g,i))}
      </div>
      ${l.length?p`<p class="lunch-offs">
            No school:
            ${l.map(g=>{let x=g.first<`${o}-01`?`${o}-01`:g.first,_=Be(g.last)>o?mt(`${$s(o)}-01`,-1):g.last;return`${x===_?Gs(x):`${Gs(x)}–${Gs(_)}`} ${Do(g.title)}`}).join(" · ")}
          </p>`:T}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return p`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,d=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),h=c?`${e.name}, ${Ae(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Ae(n.date)}: ${Ut[i]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Ut[r]}.`;return p`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${d?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${h}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?Ws:Vs}${Ut[i]}</span>
      ${n.menu?p`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?p`<span class="lunch-sides">${n.sides}</span>`:T}`:c?p`<span class="lunch-menu add">${In} Menu</span>`:T}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(_=>_.id===e.kid),a=(this.plan?$e(this.plan).get(e.kid):void 0)??he(Math.max(0,r)),c=o.kids[r]?.name??"",d=i===gt(e)?e:{...e,state:i?"done":"open",done_at:i?new Date().toISOString():null},h=i&&d.done_by&&d.done_by!==e.kid?o.people?.find(_=>_.id===d.done_by)?.name??d.done_by_name??null:null,l=`${fs(d,o.today,o.time_zone)}${h?` · by ${h}`:""}`,u=i||$o(e),m=`${n?`${c}: `:""}${e.title}. ${l?`${l}. `:""}${i?"Done. Tap to undo.":"Tap when it’s done."}`,M=p`<span class="box" aria-hidden="true"
        >${i?ae`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:T}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:T}
      <span class="chore-text">
        <span class="chore-title">${n?p`<span class="chore-kid">${c}</span> · `:T}${e.title}</span>
        ${l?p`<span class="chore-note">${l}</span>`:T}
      </span>`,g=`chore ${i?"done":""} ${e.state==="overdue"&&!i?"overdue":""} ${u?"":"later"}`,x=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return u?p`<button type="button" class=${g} style=${x} aria-pressed=${i?"true":"false"} aria-label=${m} @click=${()=>this.tapChore(e)}>
          ${M}
        </button>`:p`<div class=${g} style=${x}>${M}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(gs(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${In} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:T;this.tick;let i=To(e,this.plan?$e(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${In} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${xr} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return p`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Me(r.name)}</span>
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
            ${r.later.map(c=>p`<h3 class="chore-group">${c.date===e.today?"Later today":Gc(c.date,e.today)}</h3>
                ${c.chores.map(d=>this.renderChoreRow(d))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?p`<p class="chore-none">No chores this week.</p>`:T}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,i=this.plan?$e(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(ks).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${ws(e.who,o,e.take_turns)} · ${xs(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:T}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let d=o.findIndex(l=>l.id===c),h=i?.get(c)??he(Math.max(0,d));return p`<span class="kid-dot" style="background:${h.color}"></span>`})}
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
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return p``;let o=n.kids,i=this.plan?$e(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(g=>g.id===e.template):void 0,c=vs(e),d=(a?.problems??[]).filter(g=>g!=="who:"),h=(g,x,_,f=!1)=>p`<button type="button" class="choice ${f?"wide":""}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${_}>${x}</button>`,l=(g,x,_,f)=>p`<button type="button" class="chip" aria-pressed=${g?"true":"false"} aria-label=${f??T} ?disabled=${r} @click=${_}>${x}</button>`,u=g=>{g!==e.repeats&&this.changeDraft({repeats:g,days:a&&a.repeats===g?a.days??kn(g):kn(g)})},m=g=>{let x=e.who.includes(g)?e.who.filter(_=>_!==g):o.filter(_=>_.id===g||e.who.includes(_.id)).map(_=>_.id);this.changeDraft({who:x})},M;if(e.repeats==="school"){let g=e.days===tt?new Set:e.days===""?new Set([0,1,2,3,4]):ms(e.days)??new Set,x=_=>{let f=new Set(g);f.has(_)?f.delete(_):f.add(_),this.changeDraft({days:f.size===5?"":f.size?bs(f):tt})};M=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${et.slice(0,5).map((_,f)=>l(g.has(f),_.slice(0,2),()=>x(f),_))}
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
        </div>`}else if(e.repeats==="monthly"){let g=e.days.trim(),x=/^\d+$/.test(g)?Number(g):null,_=g&&g.toLowerCase()!=="any"&&g.toLowerCase()!=="last"&&x===null;M=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${_?4:3}, minmax(0, 1fr))">
          ${h(g===""||g.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${h(x!==null,"On a date",()=>this.changeDraft({days:String(x??1)}))}
          ${h(g.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${_?h(!0,g,()=>{}):T}
        </div>
        ${x!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||x<=1} @click=${()=>this.changeDraft({days:String(x-1)})}>−</button>
                <span class="arrive-value">${ys(x)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||x>=31} @click=${()=>this.changeDraft({days:String(x+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${g.toLowerCase()==="last"?"Due on the month’s last day.":_?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")M=p`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let g=e.days===""||e.days.toLowerCase()==="any",x=e.days===tt?new Set:g?new Set:ms(e.days)??new Set,_=f=>{let O=new Set(x);O.has(f)?O.delete(f):O.add(f),this.changeDraft({days:O.size?bs(O)||"Mon-Sun":tt})};M=p`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${h(g,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${h(!g,"On set days",()=>this.changeDraft({days:g?"Sat":e.days}))}
        </div>
        ${g?p`<p class="field-hint">Shows all week, due on Sunday.</p>`:p`<div role="group" aria-label="Days of the week" class="day-chips">
                ${et.map((f,O)=>l(x.has(O),f.slice(0,2),()=>_(O),f))}
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
          <span class="ed-meta">${e.who.length?ws(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===tt?"No days picked":xs(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${d.length?p`<p class="field-hint bad">${d.map(ks).join(". ")}. Saving fixes it.</p>`:T}
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
          ${wr.map(g=>l(e.icon===g,g,()=>this.changeDraft({icon:e.icon===g?null:g}),`Picture ${g}`))}
          ${e.icon&&!wr.includes(e.icon)?l(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):T}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?p`<emoji-picker
              class="emoji-more"
              .dataSource=${Fc}
              @emoji-click=${g=>{let x=g.detail.unicode;x&&this.changeDraft({icon:x}),this.iconMore=!1}}
            ></emoji-picker>`:T}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((g,x)=>{let _=i?.get(g.id)??he(x),f=e.who.includes(g.id);return p`<button type="button" class="who-chip" style="--c:${_.color};--rgb:${_.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${r} @click=${()=>m(g.id)}>
              <span class="avatar" aria-hidden="true">${Me(g.name)}</span>${g.name}
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
      ${M}
      ${e.repeats==="school"?T:p`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Vc(e.repeats,e.every)}</span>
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
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return p``;let o=e.busy,i=h=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...h})},r=h=>i({kids:e.kids.includes(h)?e.kids.filter(l=>l!==h):[...e.kids,h]}),a=n.kids.filter(h=>Nt(h,e.date)),c=e.dish.trim(),d=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${Ae(e.date)}</span>
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
              <span class="avatar" aria-hidden="true">${Me(h.name)}</span>${h.name}
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
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return p``;let o=n.people?.length?n.people:n.kids.map(l=>({...l,role:"kid"})),i=n.kids.findIndex(l=>l.id===e.kid),r=n.kids[i],a=this.plan?$e(this.plan):void 0,c=a?.get(e.kid)??he(Math.max(0,i)),d=o.filter(l=>l.id!==e.kid),h=l=>{let u=n.kids.findIndex(m=>m.id===l.id);return u>=0?(a?.get(l.id)??he(u)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${fs(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Me(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${d.map(l=>p`<button type="button" class="done-by" style="--c:${h(l)}" @click=${()=>void this.toggleChore(e,l.id)}>
                  <span class="avatar ${l.role==="parent"?"driver":""}" aria-hidden="true">${Me(l.name)}</span>
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
    </div>`}ownHint(e,n){let o=wn(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${F(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${F(n.start)} to ${F(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>we(e).includes(r)?me(e,r):be(e,r));return`${o} drives there and back${i.length?`, with ${ft(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:o,event:i}=n,r=we(e),a=uo(e,i),c=wn(e,i),d=!!this.pending,h=E=>this.pending?.key===E?this.pending.value:void 0,l=[...e.people?.carpools??[]];for(let E of e.days)for(let v of E.events)for(let $ of[v.drop,v.pick])$&&$!=="none"&&!r.includes($)&&!l.some(A=>A.toLowerCase()===$.toLowerCase())&&l.push($);let u=E=>{if(!i.sides.includes(E))return T;let v=h(E)??h("both"),$=E==="drop"?i.drop:i.pick,A=v!==void 0?String(v):i.no_ride_unless_named&&$==="none"?"":$,B=A===""&&!(v===void 0&&i.no_ride_unless_named),I=A&&A!=="none"&&!r.includes(A)?A:"",Z=V=>{this.otherOpen=null,this.setRide(i,E,A===V?"":V,r)},q=[...r.map(V=>[V,ls(e,V)]),["none","Not needed"]],S=`${i.id}|${E}`,te=this.otherOpen===S;return p`<div class="field ride-box">
        <span class="field-label">${E==="drop"?"Drop-off":"Pick-up"} ${B?p`<span class="nobody">· nobody yet</span>`:T}</span>
        <div role="group" aria-label=${E==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${q.length+1}, minmax(0, 1fr))">
          ${q.map(([V,Te])=>p`<button type="button" class="choice" aria-pressed=${A===V?"true":"false"} ?disabled=${d} @click=${()=>Z(V)}>
                ${Te}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${I?"true":"false"}
            aria-expanded=${te?"true":"false"}
            ?disabled=${d}
            @click=${()=>this.otherOpen=te?null:S}
          >
            ${I||"Other"}
          </button>
        </div>
        ${te?p`${l.length?p`<div role="group" aria-label=${E==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${l.map(V=>p`<button type="button" class="chip" aria-pressed=${A.toLowerCase()===V.toLowerCase()?"true":"false"} ?disabled=${d} @click=${()=>Z(V)}>
                    ${V}
                  </button>`)}
            </div>`:T}
        <input
          type="text"
          .value=${I&&!l.some(V=>V.toLowerCase()===I.toLowerCase())?I:""}
          ?disabled=${d}
          aria-label=${E==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${V=>{let Te=V.target.value.trim();Te&&Te!==A&&Z(Te)}}
          @keydown=${V=>{V.key==="Enter"&&V.target.blur()}}
        />`:T}
        ${!_&&A!==""&&A!=="none"?m(E,A):T}
      </div>`},m=(E,v)=>{let $=h(`along-${E}`),A=$!==void 0?$:E==="pick"?i.pick_along??[]:i.along,B=new Set(o.events.filter(q=>q.event_id===i.event_id&&!q.own).map(q=>q.kid)),I=[...Ce(e).filter(q=>q!==i.kid&&!B.has(q)),...r.filter(q=>q!==v)];return I.length?p`<div class="field-sub">
        <span class="field-label">${E==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${E==="pick"?"Coming home too. Anyone already there just gets in.":E==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${E==="drop"?"Riding along on the drop-off":E==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${I.map(q=>p`<button type="button" class="chip" aria-pressed=${A.includes(q)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(i,q,E)}>
              ${r.includes(q)?me(e,q):be(e,q)}
            </button>`)}
        </div>
      </div>`:T},M=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",g=i.drop===i.pick&&r.includes(i.drop),x=h("stay"),_=x!==void 0?!!x:i.stay&&g,f=h("along"),O=f!==void 0?f:i.along,H=i.own?[...Ce(e),...r.filter(E=>E!==i.own)]:[],G=i.own!=null&&i.takes!=null,pe=i.own!=null&&!G,w=h("takes"),k=w!==void 0?w:i.takes??null,y=h("arrive"),C=this.arriveDraft!==void 0?this.arriveDraft:y!==void 0?y:i.arrive_by,P=h("leave"),L=this.leaveDraft!==void 0?this.leaveDraft:P!==void 0?P:i.leave_by??null,j=(E,v)=>{let $=E==="arrive",A=I=>()=>$?this.nudgeArrive(i,I):this.nudgeLeave(i,I),B=(I,Z,q,S)=>p`<button
          type="button"
          class="step"
          aria-label=${Z}
          ?disabled=${d||S}
          @pointerdown=${()=>this.startHold(A(I))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(A(I))}
        >
          ${q}
        </button>`;return p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${$?"Arrive by":"Leave by"}</span>
          <span class="field-hint">${$?`${i.start-v} min before it starts`:`${i.end-v} min before it ends`}</span>
        </span>
        <span class="stepper">
          ${B(-5,"Five minutes earlier","−",!$&&v-5<=i.start)}
          <span class="arrive-value">${F(v)}</span>
          ${B(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${$?"Clear arrive-by time":"Clear leave-by time"}
            ?disabled=${d}
            @click=${()=>$?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},W=i.sides.includes("pick")||i.own!=null,Q=()=>p`${C!=null?j("arrive",C):T}
      ${L!=null?j("leave",L):T}
      ${C==null||L==null&&W?p`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${C==null?p`<button type="button" class="chip" ?disabled=${d} @click=${()=>this.nudgeArrive(i,-5)}>Arrive early</button>`:T}
              ${L==null&&W?p`<button type="button" class="chip" ?disabled=${d} @click=${()=>this.nudgeLeave(i,-5)}>Leave early</button>`:T}
            </div>
          </div>`:T}`,ne=i.sides.includes("drop")&&i.sides.includes("pick"),z=ne&&(_||this.stayDraft===i.id),J=()=>{let E=ne?p`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${z?"false":"true"}
              ?disabled=${d}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,M)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${z?"true":"false"}
              ?disabled=${d}
              @click=${()=>{M?this.toggleStay(i,!0,M):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:T;if(!z)return p`${E} ${u("drop")} ${u("pick")}`;let v=_&&g?i.drop:"";return p`${E}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${v?T:p`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map($=>p`<button
                type="button"
                class="choice"
                aria-pressed=${v===$?"true":"false"}
                ?disabled=${d}
                @click=${()=>{if(v===$||!this.backend)return;let A=this.backend;this.stayDraft=null,this.save("stay",!0,()=>A.setRide(i.id,"both",$,this.scope,!0))}}
              >
                ${me(e,$)}
              </button>`)}
          </div>
          ${v?m("both",v):T}
        </div>`},ee=[],oe=E=>E==="none"?"Not needed":ls(e,E),ke=E=>r.includes(E)?me(e,E):be(e,E),ge=(E,v,$)=>{v===""&&!$.length||ee.push(`${E}: ${[v===""?"TBD":oe(v),...$.map(ke)].join(", ")}`)},fe=E=>i.no_ride_unless_named&&E==="none"?"":E;i.own||ge("Drop-off",fe(i.drop),i.along),i.own||ge("Pick-up",fe(i.pick),i.pick_along??[]),!i.own&&i.stay&&ee.push("Stay: yes"),G&&ee.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&ee.push(`Take along: ${i.along.map(ke).join(", ")}`),i.arrive_by!=null&&ee.push(`Arrive by: ${Pe(i.arrive_by)}`),i.leave_by!=null&&ee.push(`Leave by: ${Pe(i.leave_by)}`);let Se=h("attending"),xe=Se!==void 0?!!Se:i.attending!==!1;i.attending===!1&&ee.splice(0,ee.length,"Attending: no");let b=o.date===this.today().date?"":`${ve(o.date)} · `,N=xn(i),U=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${i.title}</span>
          <span class="ed-meta">${b}${G?"any time ":""}${N}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
          ${this.renderForLine(e,o,i)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let E=i.place_name&&i.place_name!==i.title?i.place_name:"",v=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return p`${U}
        ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
        ${E?p`<div class="field"><span class="field-label">Where</span><span class="field-hint">${E}</span></div>`:T}
        <p class="field-hint">
          ${xe?`This blocks ${c}’s time: ${c} can’t drive then, so a ride that needs ${c} shows as a problem.`:`Not going, so it doesn’t block ${c}’s time, and ${c} can drive then.`}
          ${v}
        </p>
        <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setAttending(i,!xe)}>
          ${xe?`${c} isn’t going this time`:`${c} is going after all`}
        </button>
        ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:T}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?p`${U}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${U}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
      ${i.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ve(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:T}
      ${xe?p`${i.where==="anywhere"?p`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:T}
            ${i.own?p`<p class="field-hint">${this.ownHint(e,i)}</p>`:J()}
      ${i.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${k!=null?`Takes ${k} min, any time ${F(i.start)}–${F(i.end)}`:"At its set time"}</span>
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
      ${pe&&H.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${H.map(E=>p`<button type="button" class="chip" aria-pressed=${O.includes(E)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(i,E)}>
                  ${r.includes(E)?me(e,E):be(e,E)}
                </button>`)}
            </div>
          </div>`:T}
      ${G?T:Q()}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${c} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setAttending(i,!xe)}>
        ${xe?`${c} isn’t going this time`:`${c} is going after all`}
      </button>
      ${i.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:T}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${ee.length?ee.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${xe&&!i.own?p`<p class="field-hint">Tap a selected driver again to clear it.</p>`:T}
    `}};Kt.styles=Oo,Kt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Kt);function Jc(s,t){let o=Math.max(1,Math.round(s/14)),i=s/o,r=[],a=[];for(let d=0;d<=o;d++){let h=+(d*i).toFixed(1);r.push(`${h},${d%2?5:0}`),a.push(`${h},${t-(d%2?0:5)}`)}let c=`M${r.join(" L")} L${[...a].reverse().join(" L")} Z`;return p`<svg width=${s} height=${t} viewBox="0 0 ${s} ${t}">
    ${ae`<path class="fold-fill" d=${c}></path>
      <path class="fold-edge" d=${`M${r.join(" L")}`}></path>
      <path class="fold-edge" d=${`M${a.join(" L")}`}></path>`}
  </svg>`}function Zc(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function $r(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=i=>{if(i)for(let r of Zc())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),s)}function Tr(s){try{return new URL(s).searchParams.get("v")}catch{return null}}function Er(s,t,e){if(!t)return()=>{};let n=e.everyMs??6e5,o=e.retryMs??3e4,i=e.idleMs??12e4,r=null,a=null,c=0,d=!1,h=M=>{if(d||a)return;let g=e.idleFor();if(g>=i){e.reload(M);return}a=setTimeout(()=>{a=null,h(M)},i-g)},l=async()=>{try{let M=await s.sendMessagePromise({type:"mydashlight/app_version"});c=0;let g=M["kiosk.js"];!d&&g&&g!==t&&h(g)}catch{if(d||r||++c>20)return;r=setTimeout(()=>{r=null,l()},o)}},u=()=>{c=0,l()};s.addEventListener?.("ready",u);let m=setInterval(()=>void l(),n);return()=>{d=!0,clearInterval(m),r&&clearTimeout(r),a&&clearTimeout(a),s.removeEventListener?.("ready",u)}}function _r(s,t=6e4,e=15e3){let n=null,o=setInterval(()=>{if(!s.connected||n)return;let i=!1;n=setTimeout(()=>{n=null,!i&&s.connected&&s.reconnect(!0)},e);let r=()=>{i=!0,n&&clearTimeout(n),n=null};s.ping().then(r,r)},t);return()=>{clearInterval(o),n&&clearTimeout(n),n=null}}var Cr=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],Pr=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Ar(s,t,e,n){let o=Math.max(0,Math.min(t,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+n+s.slice(i),caret:o+n.length}}function Mr(s,t,e){let n=Math.max(0,Math.min(t,s.length)),o=Math.max(n,Math.min(e,s.length));if(n!==o)return{value:s.slice(0,n)+s.slice(o),caret:n};if(n===0)return{value:s,caret:0};let i=Array.from(s.slice(0,n));i.pop();let r=i.join("");return{value:r+s.slice(n),caret:r.length}}function Sr(s,t){return t===0||/\s$/.test(s.slice(0,t))}var Qc=new Set(["text","search","email","url","tel","number","password"]);function Lr(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Qc.has(s.type)&&!s.readOnly&&!s.disabled}var ed={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},td={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Wt=class extends _e{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=Sr(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(n),r=Mr(n.value,o,i);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(n),a=Ar(n.value,i,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":ed[e]??(this.shift?e.toUpperCase():e);return p`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${td[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):T}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?Cr:Pr;return p`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>p`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};Wt.styles=Ge`
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
  `,Wt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Wt);function nd(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function Dr(s){let t=new WeakSet,e=r=>{let a=r.composedPath();i(a);let c=a[0];Lr(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=nd();!s.target||r===s.target||(Lr(r)?s.attach(r):s.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var Ys="mydashlight",sd=`/api/${Ys}/pair`,id=`/api/${Ys}/pair/poll`,Xs=`/${Ys}`,Js="pair";function Rr(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Ir(s,t){return`${s}${Xs}?${Js}=${encodeURIComponent(t)}`}function od(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var at=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function Br(s=fetch){let t=await s(sd,{method:"POST",cache:"no-store"});if(t.status===429)throw new at("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new at(`Home Assistant answered ${t.status}.`);return await t.json()}async function Or(s,t,e=fetch){let n=await e(id,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new at(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:od(t,o.auth)}:{status:"pending"}}var kt=function(s,t){let o=s,i=Vt[t],r=null,a=0,c=null,d=[],h={},l=function(w,k){a=o*4+17,r=(function(y){let C=new Array(y);for(let P=0;P<y;P+=1){C[P]=new Array(y);for(let L=0;L<y;L+=1)C[P][L]=null}return C})(a),u(0,0),u(a-7,0),u(0,a-7),g(),M(),_(w,k),o>=7&&x(w),c==null&&(c=H(o,i,d)),f(c,k)},u=function(w,k){for(let y=-1;y<=7;y+=1)if(!(w+y<=-1||a<=w+y))for(let C=-1;C<=7;C+=1)k+C<=-1||a<=k+C||(0<=y&&y<=6&&(C==0||C==6)||0<=C&&C<=6&&(y==0||y==6)||2<=y&&y<=4&&2<=C&&C<=4?r[w+y][k+C]=!0:r[w+y][k+C]=!1)},m=function(){let w=0,k=0;for(let y=0;y<8;y+=1){l(!0,y);let C=Ke.getLostPoint(h);(y==0||w>C)&&(w=C,k=y)}return k},M=function(){for(let w=8;w<a-8;w+=1)r[w][6]==null&&(r[w][6]=w%2==0);for(let w=8;w<a-8;w+=1)r[6][w]==null&&(r[6][w]=w%2==0)},g=function(){let w=Ke.getPatternPosition(o);for(let k=0;k<w.length;k+=1)for(let y=0;y<w.length;y+=1){let C=w[k],P=w[y];if(r[C][P]==null)for(let L=-2;L<=2;L+=1)for(let j=-2;j<=2;j+=1)L==-2||L==2||j==-2||j==2||L==0&&j==0?r[C+L][P+j]=!0:r[C+L][P+j]=!1}},x=function(w){let k=Ke.getBCHTypeNumber(o);for(let y=0;y<18;y+=1){let C=!w&&(k>>y&1)==1;r[Math.floor(y/3)][y%3+a-8-3]=C}for(let y=0;y<18;y+=1){let C=!w&&(k>>y&1)==1;r[y%3+a-8-3][Math.floor(y/3)]=C}},_=function(w,k){let y=i<<3|k,C=Ke.getBCHTypeInfo(y);for(let P=0;P<15;P+=1){let L=!w&&(C>>P&1)==1;P<6?r[P][8]=L:P<8?r[P+1][8]=L:r[a-15+P][8]=L}for(let P=0;P<15;P+=1){let L=!w&&(C>>P&1)==1;P<8?r[8][a-P-1]=L:P<9?r[8][15-P-1+1]=L:r[8][15-P-1]=L}r[a-8][8]=!w},f=function(w,k){let y=-1,C=a-1,P=7,L=0,j=Ke.getMaskFunction(k);for(let W=a-1;W>0;W-=2)for(W==6&&(W-=1);;){for(let Q=0;Q<2;Q+=1)if(r[C][W-Q]==null){let ne=!1;L<w.length&&(ne=(w[L]>>>P&1)==1),j(C,W-Q)&&(ne=!ne),r[C][W-Q]=ne,P-=1,P==-1&&(L+=1,P=7)}if(C+=y,C<0||a<=C){C-=y,y=-y;break}}},O=function(w,k){let y=0,C=0,P=0,L=new Array(k.length),j=new Array(k.length);for(let z=0;z<k.length;z+=1){let J=k[z].dataCount,ee=k[z].totalCount-J;C=Math.max(C,J),P=Math.max(P,ee),L[z]=new Array(J);for(let fe=0;fe<L[z].length;fe+=1)L[z][fe]=255&w.getBuffer()[fe+y];y+=J;let oe=Ke.getErrorCorrectPolynomial(ee),ge=Gt(L[z],oe.getLength()-1).mod(oe);j[z]=new Array(oe.getLength()-1);for(let fe=0;fe<j[z].length;fe+=1){let Se=fe+ge.getLength()-j[z].length;j[z][fe]=Se>=0?ge.getAt(Se):0}}let W=0;for(let z=0;z<k.length;z+=1)W+=k[z].totalCount;let Q=new Array(W),ne=0;for(let z=0;z<C;z+=1)for(let J=0;J<k.length;J+=1)z<L[J].length&&(Q[ne]=L[J][z],ne+=1);for(let z=0;z<P;z+=1)for(let J=0;J<k.length;J+=1)z<j[J].length&&(Q[ne]=j[J][z],ne+=1);return Q},H=function(w,k,y){let C=Nr.getRSBlocks(w,k),P=jr();for(let j=0;j<y.length;j+=1){let W=y[j];P.put(W.getMode(),4),P.put(W.getLength(),Ke.getLengthInBits(W.getMode(),w)),W.write(P)}let L=0;for(let j=0;j<C.length;j+=1)L+=C[j].dataCount;if(P.getLengthInBits()>L*8)throw"code length overflow. ("+P.getLengthInBits()+">"+L*8+")";for(P.getLengthInBits()+4<=L*8&&P.put(0,4);P.getLengthInBits()%8!=0;)P.putBit(!1);for(;!(P.getLengthInBits()>=L*8||(P.put(236,8),P.getLengthInBits()>=L*8));)P.put(17,8);return O(P,C)};h.addData=function(w,k){k=k||"Byte";let y=null;switch(k){case"Numeric":y=rd(w);break;case"Alphanumeric":y=ad(w);break;case"Byte":y=ld(w);break;case"Kanji":y=cd(w);break;default:throw"mode:"+k}d.push(y),c=null},h.isDark=function(w,k){if(w<0||a<=w||k<0||a<=k)throw w+","+k;return r[w][k]},h.getModuleCount=function(){return a},h.make=function(){if(o<1){let w=1;for(;w<40;w++){let k=Nr.getRSBlocks(w,i),y=jr();for(let P=0;P<d.length;P++){let L=d[P];y.put(L.getMode(),4),y.put(L.getLength(),Ke.getLengthInBits(L.getMode(),w)),L.write(y)}let C=0;for(let P=0;P<k.length;P++)C+=k[P].dataCount;if(y.getLengthInBits()<=C*8)break}o=w}l(!1,m())},h.createTableTag=function(w,k){w=w||2,k=typeof k>"u"?w*4:k;let y="";y+='<table style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: "+k+"px;",y+='">',y+="<tbody>";for(let C=0;C<h.getModuleCount();C+=1){y+="<tr>";for(let P=0;P<h.getModuleCount();P+=1)y+='<td style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: 0px;",y+=" width: "+w+"px;",y+=" height: "+w+"px;",y+=" background-color: ",y+=h.isDark(C,P)?"#000000":"#ffffff",y+=";",y+='"/>';y+="</tr>"}return y+="</tbody>",y+="</table>",y},h.createSvgTag=function(w,k,y,C){let P={};typeof arguments[0]=="object"&&(P=arguments[0],w=P.cellSize,k=P.margin,y=P.alt,C=P.title),w=w||2,k=typeof k>"u"?w*4:k,y=typeof y=="string"?{text:y}:y||{},y.text=y.text||null,y.id=y.text?y.id||"qrcode-description":null,C=typeof C=="string"?{text:C}:C||{},C.text=C.text||null,C.id=C.text?C.id||"qrcode-title":null;let L=h.getModuleCount()*w+k*2,j,W,Q,ne,z="",J;for(J="l"+w+",0 0,"+w+" -"+w+",0 0,-"+w+"z ",z+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',z+=P.scalable?"":' width="'+L+'px" height="'+L+'px"',z+=' viewBox="0 0 '+L+" "+L+'" ',z+=' preserveAspectRatio="xMinYMin meet"',z+=C.text||y.text?' role="img" aria-labelledby="'+G([C.id,y.id].join(" ").trim())+'"':"",z+=">",z+=C.text?'<title id="'+G(C.id)+'">'+G(C.text)+"</title>":"",z+=y.text?'<description id="'+G(y.id)+'">'+G(y.text)+"</description>":"",z+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',z+='<path d="',Q=0;Q<h.getModuleCount();Q+=1)for(ne=Q*w+k,j=0;j<h.getModuleCount();j+=1)h.isDark(Q,j)&&(W=j*w+k,z+="M"+W+","+ne+J);return z+='" stroke="transparent" fill="black"/>',z+="</svg>",z},h.createDataURL=function(w,k){w=w||2,k=typeof k>"u"?w*4:k;let y=h.getModuleCount()*w+k*2,C=k,P=y-k;return pd(y,y,function(L,j){if(C<=L&&L<P&&C<=j&&j<P){let W=Math.floor((L-C)/w),Q=Math.floor((j-C)/w);return h.isDark(Q,W)?0:1}else return 1})},h.createImgTag=function(w,k,y){w=w||2,k=typeof k>"u"?w*4:k;let C=h.getModuleCount()*w+k*2,P="";return P+="<img",P+=' src="',P+=h.createDataURL(w,k),P+='"',P+=' width="',P+=C,P+='"',P+=' height="',P+=C,P+='"',y&&(P+=' alt="',P+=G(y),P+='"'),P+="/>",P};let G=function(w){let k="";for(let y=0;y<w.length;y+=1){let C=w.charAt(y);switch(C){case"<":k+="&lt;";break;case">":k+="&gt;";break;case"&":k+="&amp;";break;case'"':k+="&quot;";break;default:k+=C;break}}return k},pe=function(w){w=typeof w>"u"?2:w;let y=h.getModuleCount()*1+w*2,C=w,P=y-w,L,j,W,Q,ne,z={"██":"█","█ ":"▀"," █":"▄","  ":" "},J={"██":"▀","█ ":"▀"," █":" ","  ":" "},ee="";for(L=0;L<y;L+=2){for(W=Math.floor((L-C)/1),Q=Math.floor((L+1-C)/1),j=0;j<y;j+=1)ne="█",C<=j&&j<P&&C<=L&&L<P&&h.isDark(W,Math.floor((j-C)/1))&&(ne=" "),C<=j&&j<P&&C<=L+1&&L+1<P&&h.isDark(Q,Math.floor((j-C)/1))?ne+=" ":ne+="█",ee+=w<1&&L+1>=P?J[ne]:z[ne];ee+=`
`}return y%2&&w>0?ee.substring(0,ee.length-y-1)+Array(y+1).join("▀"):ee.substring(0,ee.length-1)};return h.createASCII=function(w,k){if(w=w||1,w<2)return pe(k);w-=1,k=typeof k>"u"?w*2:k;let y=h.getModuleCount()*w+k*2,C=k,P=y-k,L,j,W,Q,ne=Array(w+1).join("██"),z=Array(w+1).join("  "),J="",ee="";for(L=0;L<y;L+=1){for(W=Math.floor((L-C)/w),ee="",j=0;j<y;j+=1)Q=1,C<=j&&j<P&&C<=L&&L<P&&h.isDark(W,Math.floor((j-C)/w))&&(Q=0),ee+=Q?ne:z;for(W=0;W<w;W+=1)J+=ee+`
`}return J.substring(0,J.length-1)},h.renderTo2dContext=function(w,k){k=k||2;let y=h.getModuleCount();for(let C=0;C<y;C++)for(let P=0;P<y;P++)w.fillStyle=h.isDark(C,P)?"black":"white",w.fillRect(P*k,C*k,k,k)},h};kt.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};kt.createStringToBytes=function(s,t){let e=(function(){let o=hd(s),i=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let d=i(),h=i(),l=i(),u=String.fromCharCode(c<<8|d),m=h<<8|l;a[u]=m,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?i.push(c):(i.push(c>>>8),i.push(c&255)):i.push(n)}}return i}};var ye={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Vt={L:1,M:0,Q:3,H:2},Fe={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Ke=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(t)>=0;)a^=t<<i(a)-i(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case Fe.PATTERN000:return function(a,c){return(a+c)%2==0};case Fe.PATTERN001:return function(a,c){return a%2==0};case Fe.PATTERN010:return function(a,c){return c%3==0};case Fe.PATTERN011:return function(a,c){return(a+c)%3==0};case Fe.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Fe.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Fe.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Fe.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=Gt([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Gt([1,We.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case ye.MODE_NUMBER:return 10;case ye.MODE_ALPHA_NUM:return 9;case ye.MODE_8BIT_BYTE:return 8;case ye.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case ye.MODE_NUMBER:return 12;case ye.MODE_ALPHA_NUM:return 11;case ye.MODE_8BIT_BYTE:return 16;case ye.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case ye.MODE_NUMBER:return 14;case ye.MODE_ALPHA_NUM:return 13;case ye.MODE_8BIT_BYTE:return 16;case ye.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let l=0;l<a;l+=1)for(let u=0;u<a;u+=1){let m=0,M=r.isDark(l,u);for(let g=-1;g<=1;g+=1)if(!(l+g<0||a<=l+g))for(let x=-1;x<=1;x+=1)u+x<0||a<=u+x||g==0&&x==0||M==r.isDark(l+g,u+x)&&(m+=1);m>5&&(c+=3+m-5)}for(let l=0;l<a-1;l+=1)for(let u=0;u<a-1;u+=1){let m=0;r.isDark(l,u)&&(m+=1),r.isDark(l+1,u)&&(m+=1),r.isDark(l,u+1)&&(m+=1),r.isDark(l+1,u+1)&&(m+=1),(m==0||m==4)&&(c+=3)}for(let l=0;l<a;l+=1)for(let u=0;u<a-6;u+=1)r.isDark(l,u)&&!r.isDark(l,u+1)&&r.isDark(l,u+2)&&r.isDark(l,u+3)&&r.isDark(l,u+4)&&!r.isDark(l,u+5)&&r.isDark(l,u+6)&&(c+=40);for(let l=0;l<a;l+=1)for(let u=0;u<a-6;u+=1)r.isDark(u,l)&&!r.isDark(u+1,l)&&r.isDark(u+2,l)&&r.isDark(u+3,l)&&r.isDark(u+4,l)&&!r.isDark(u+5,l)&&r.isDark(u+6,l)&&(c+=40);let d=0;for(let l=0;l<a;l+=1)for(let u=0;u<a;u+=1)r.isDark(u,l)&&(d+=1);let h=Math.abs(100*d/a/a-50)/5;return c+=h*10,c},o})(),We=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),Gt=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+t);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let i=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=We.gexp(We.glog(n.getAt(r))+We.glog(o.getAt(a)));return Gt(i,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let i=We.glog(n.getAt(0))-We.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=We.gexp(We.glog(o.getAt(a))+i);return Gt(r,0).mod(o)},n},Nr=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},n=function(o,i){switch(i){case Vt.L:return s[(o-1)*4+0];case Vt.M:return s[(o-1)*4+1];case Vt.Q:return s[(o-1)*4+2];case Vt.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=n(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,c=[];for(let d=0;d<a;d+=1){let h=r[d*3+0],l=r[d*3+1],u=r[d*3+2];for(let m=0;m<h;m+=1)c.push(t(l,u))}return c},e})(),jr=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let o=Math.floor(n/8);return(s[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let i=0;i<o;i+=1)e.putBit((n>>>o-i-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);s.length<=o&&s.push(0),n&&(s[o]|=128>>>t%8),t+=1},e},rd=function(s){let t=ye.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+i(r.charAt(c));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},ad=function(s){let t=ye.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(i){return e.length},n.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return n},ld=function(s){let t=ye.MODE_8BIT_BYTE,e=s,n=kt.stringToBytes(s),o={};return o.getMode=function(){return t},o.getLength=function(i){return n.length},o.write=function(i){for(let r=0;r<n.length;r+=1)i.put(n[r],8)},o},cd=function(s){let t=ye.MODE_KANJI,e=s,n=kt.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=n(s),i={};return i.getMode=function(){return t},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,c=0;for(;c+1<a.length;){let d=(255&a[c])<<8|255&a[c+1];if(33088<=d&&d<=40956)d-=33088;else if(57408<=d&&d<=60351)d-=49472;else throw"illegal char at "+(c+1)+"/"+d;d=(d>>>8&255)*192+(d&255),r.put(d,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},i},zr=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let i=0;i<o;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},dd=function(){let s=0,t=0,e=0,n="",o={},i=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)i(s>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},o.toString=function(){return n},o},hd=function(s){let t=s,e=0,n=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=t.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},ud=function(s,t){let e=s,n=t,o=new Array(s*t),i={};i.setPixel=function(d,h,l){o[h*e+d]=l},i.write=function(d){d.writeString("GIF87a"),d.writeShort(e),d.writeShort(n),d.writeByte(128),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(255),d.writeByte(255),d.writeByte(255),d.writeString(","),d.writeShort(0),d.writeShort(0),d.writeShort(e),d.writeShort(n),d.writeByte(0);let h=2,l=a(h);d.writeByte(h);let u=0;for(;l.length-u>255;)d.writeByte(255),d.writeBytes(l,u,255),u+=255;d.writeByte(l.length-u),d.writeBytes(l,u,l.length-u),d.writeByte(0),d.writeString(";")};let r=function(d){let h=d,l=0,u=0,m={};return m.write=function(M,g){if(M>>>g)throw"length over";for(;l+g>=8;)h.writeByte(255&(M<<l|u)),g-=8-l,M>>>=8-l,u=0,l=0;u=M<<l|u,l=l+g},m.flush=function(){l>0&&h.writeByte(u)},m},a=function(d){let h=1<<d,l=(1<<d)+1,u=d+1,m=c();for(let f=0;f<h;f+=1)m.add(String.fromCharCode(f));m.add(String.fromCharCode(h)),m.add(String.fromCharCode(l));let M=zr(),g=r(M);g.write(h,u);let x=0,_=String.fromCharCode(o[x]);for(x+=1;x<o.length;){let f=String.fromCharCode(o[x]);x+=1,m.contains(_+f)?_=_+f:(g.write(m.indexOf(_),u),m.size()<4095&&(m.size()==1<<u&&(u+=1),m.add(_+f)),_=f)}return g.write(m.indexOf(_),u),g.write(l,u),g.flush(),M.toByteArray()},c=function(){let d={},h=0,l={};return l.add=function(u){if(l.contains(u))throw"dup key:"+u;d[u]=h,h+=1},l.size=function(){return h},l.indexOf=function(u){return d[u]},l.contains=function(u){return typeof d[u]<"u"},l};return i},pd=function(s,t,e){let n=ud(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let o=zr();n.write(o);let i=dd(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},Hr=kt,iu=kt.stringToBytes;function Ur(s){let t=Hr(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)t.isDark(o,i)&&(n+=`M${i} ${o}h1v1h-1z`);return{size:e,d:n}}var fd=1e4,qt=class extends _e{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await Br();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof at&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),fd)}}async poll(e){let n=this.secret;if(n)try{let o=await Or(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return T;let{size:e,d:n}=Ur(Ir(location.origin,this.code));return p`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${ae`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return p`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?Rr(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Xs}?${Js}</span> and type the code.
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
    </div>`}};qt.styles=Ge`
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
  `,qt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",qt);var Zs="hassTokens";function Fr(){try{let s=localStorage.getItem(Zs);return s?JSON.parse(s):null}catch{return null}}function Qs(s){try{s?localStorage.setItem(Zs,JSON.stringify(s)):localStorage.removeItem(Zs)}catch{}}function gd(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function md(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function bd(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!Fr()){let e=await md();e&&Qs(e)}try{let e=await yi({hassUrl:location.origin,loadTokens:async()=>Fr(),saveTokens:Qs});t&&history.replaceState(null,"",location.pathname+Ts(location.search));let n=await xi({auth:e});s.backend=new tn(n),_r(n),Er(n,Tr(import.meta.url),{reload:vd,idleFor:()=>Date.now()-Gr}),n.addEventListener("reconnect-error",(o,i)=>{i===2&&Wr()})}catch(e){if(e===2){Wr();return}gd(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}var Gr=Date.now();for(let s of["pointerdown","keydown","wheel"])document.addEventListener(s,()=>Gr=Date.now(),{capture:!0,passive:!0});var Kr="mydashlight-reloaded-for";function vd(s){try{if(sessionStorage.getItem(Kr)===s)return;sessionStorage.setItem(Kr,s)}catch{}location.reload()}function Wr(){Qs(null),location.replace(location.pathname+Ts(location.search))}var qr=nt(location.search),Vr=document.querySelector("mydashlight-keyboard");Vr&&qr.keyboard!==!1&&Dr(Vr);qr.cursor!=="show"&&$r();bd();
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
