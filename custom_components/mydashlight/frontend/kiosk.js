var ka=Object.defineProperty;var Qn=(s,t)=>()=>(s&&(t=s(s=0)),t);var $a=(s,t)=>{for(var e in t)ka(s,e,{get:t[e],enumerable:!0})};function zn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function Fs(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function tc(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function ar(s){return tc(s,t=>t.unicode)}function nc(s){function t(e,n,o){let i=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(o)for(let[r,[a,l]]of Object.entries(o))i.createIndex(r,a,{multiEntry:l});return i}t(Pt),t(ht,Yl,{[cr]:[ql,!0],[hr]:[[Xl,Jl]],[ur]:[Ql,!0]}),t(Vs,void 0,{[dr]:[""]})}function pr(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function sc(s){let t=await new Promise((e,n)=>{let o=indexedDB.open(s,Gl);Ks[s]=o,o.onupgradeneeded=i=>{i.oldVersion<Vl&&nc(o.result)},pr(e,n,o)});return t.onclose=()=>Ys(s),t}function ic(s){return Un[s]||(Un[s]=sc(s)),Un[s]}function Ke(s,t,e,n){return new Promise((o,i)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(c=>r.objectStore(c)),l;n(a,r,c=>{l=c}),r.oncomplete=()=>o(l),r.onerror=()=>i(r.error)})}function Ys(s){let t=Ks[s],e=t&&t.result;if(e){e.close();let n=Wn[s];if(n)for(let o of n)o()}delete Ks[s],delete Un[s],delete Wn[s]}function oc(s){return new Promise((t,e)=>{Ys(s);let n=indexedDB.deleteDatabase(s);pr(t,e,n)})}function rc(s,t){let e=Wn[s];e||(e=Wn[s]=[]),e.push(t)}function Ct(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||ac.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function fr(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=lc)}function cc(s){return s.map(({annotation:e,emoticon:n,group:o,order:i,shortcodes:r,skins:a,tags:l,emoji:c,version:u})=>{let d=[...new Set(fr([...(r||[]).map(Ct).flat(),...(l||[]).map(Ct).flat(),...Ct(e),n]))].sort(),g={annotation:e,group:o,order:i,tags:l,tokens:d,unicode:c,version:u};if(n&&(g.emoticon=n),r&&(g.shortcodes=r),a){g.skinTones=[],g.skinUnicodes=[],g.skinVersions=[];for(let{tone:h,emoji:v,version:b}of a)g.skinTones.push(h),g.skinUnicodes.push(v),g.skinVersions.push(b)}return g})}function gr(s,t,e,n){s[t](e).onsuccess=o=>n&&n(o.target.result)}function dt(s,t,e){gr(s,"get",t,e)}function mr(s,t,e){gr(s,"getAll",t,e)}function Xs(s){s.commit&&s.commit()}function dc(s,t){let e=s[0];for(let n=1;n<s.length;n++){let o=s[n];t(e)>t(o)&&(e=o)}return e}function br(s,t){let e=dc(s,o=>o.length),n=[];for(let o of e)s.some(i=>i.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function hc(s){return!await Js(s,Pt,Fn)}async function uc(s,t,e){let[n,o]=await Promise.all([Ws,Fn].map(i=>Js(s,Pt,i)));return n===e&&o===t}async function pc(s,t){return Ke(s,ht,Mt,(n,o,i)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=l=>{let c=l.target.result;for(let u of c)if(r=u.unicode,t(u))return i(u);if(c.length<50)return i();a()}};a()})}async function vr(s,t,e,n){try{let o=cc(t);await Ke(s,[ht,Pt],qs,([i,r],a)=>{let l,c,u=0;function d(){++u===2&&g()}function g(){if(!(l===n&&c===e)){i.clear();for(let h of o)i.put(h);r.put(n,Ws),r.put(e,Fn),Xs(a)}}dt(r,Ws,h=>{l=h,d()}),dt(r,Fn,h=>{c=h,d()})})}finally{}}async function fc(s,t){return Ke(s,ht,Mt,(e,n,o)=>{let i=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);mr(e.index(hr),i,o)})}async function yr(s,t){let e=fr(Ct(t));return e.length?Ke(s,ht,Mt,(n,o,i)=>{let r=[],a=()=>{r.length===e.length&&l()},l=()=>{let c=br(r,u=>u.unicode);i(c.sort((u,d)=>u.order<d.order?-1:1))};for(let c=0;c<e.length;c++){let u=e[c],d=c===e.length-1?IDBKeyRange.bound(u,u+"￿",!1,!0):IDBKeyRange.only(u);mr(n.index(cr),d,g=>{r.push(g),a()})}}):[]}async function gc(s,t){let e=await yr(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(i=>i.toLowerCase()).includes(t.toLowerCase()))[0]||null:await pc(s,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function mc(s,t){return Ke(s,ht,Mt,(e,n,o)=>dt(e,t,i=>{if(i)return o(i);dt(e.index(ur),t,r=>o(r||null))}))}function Js(s,t,e){return Ke(s,t,Mt,(n,o,i)=>dt(n,e,i))}function bc(s,t,e,n){return Ke(s,t,qs,(o,i)=>{o.put(n,e),Xs(i)})}function vc(s,t){return Ke(s,Vs,qs,(e,n)=>dt(e,t,o=>{e.put((o||0)+1,t),Xs(n)}))}function yc(s,t,e){return e===0?[]:Ke(s,[Vs,ht],Mt,([n,o],i,r)=>{let a=[];n.index(dr).openCursor(void 0,"prev").onsuccess=l=>{let c=l.target.result;if(!c)return r(a);function u(h){if(a.push(h),a.length===e)return r(a);c.continue()}let d=c.primaryKey,g=t.byName(d);if(g)return u(g);dt(o,d,h=>{if(h)return u(h);c.continue()})}})}function xc(s,t){let e=new Map;for(let o of s){let i=t(o);for(let r of i){let a=e;for(let c=0;c<r.length;c++){let u=r.charAt(c),d=a.get(u);d||(d=new Map,a.set(u,d)),a=d}let l=a.get(Hn);l||(l=[],a.set(Hn,l)),l.push(o)}}return(o,i)=>{let r=e;for(let c=0;c<o.length;c++){let u=o.charAt(c),d=r.get(u);if(d)r=d;else return[]}if(i)return r.get(Hn)||[];let a=[],l=[r];for(;l.length;){let u=[...l.shift().entries()].sort((d,g)=>d[0]<g[0]?-1:1);for(let[d,g]of u)d===Hn?a.push(...g):l.push(g)}return a}}function kc(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||wc.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function lr(s){kc(s);let t=(g,h)=>g.name.toLowerCase()<h.name.toLowerCase()?-1:1,e=s.sort(t),o=xc(s,g=>{let h=new Set;if(g.shortcodes)for(let v of g.shortcodes)for(let b of Ct(v))h.add(b);return h}),i=g=>o(g,!0),r=g=>o(g,!1),a=g=>{let h=Ct(g),v=h.map((b,w)=>(w<h.length-1?i:r)(b));return br(v,b=>b.name).sort(t)},l=new Map,c=new Map;for(let g of s){c.set(g.name.toLowerCase(),g);for(let h of g.shortcodes||[])l.set(h.toLowerCase(),g)}return{all:e,search:a,byShortcode:g=>l.get(g.toLowerCase()),byName:g=>c.get(g.toLowerCase())}}function Zt(s){if(!s)return s;if($c&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function xr(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function Ec(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Tc.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function wr(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function _c(s){let t=await fetch(s,{method:"HEAD"});wr(t,s);let e=t.headers.get("etag");return xr(e),e}async function Gs(s){let t=await fetch(s);wr(t,s);let e=t.headers.get("etag");xr(e);let n=await t.json();return Ec(n),[e,n]}function Cc(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function Pc(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=s.charCodeAt(o);return e}async function kr(s){let t=JSON.stringify(s),e=Pc(t),n=await crypto.subtle.digest("SHA-1",e),o=Cc(n);return btoa(o)}async function Sc(s,t){let e,n=await _c(t);if(!n){let o=await Gs(t);n=o[0],e=o[1],n||(n=await kr(e))}await uc(s,t,n)||(e||(e=(await Gs(t))[1]),await vr(s,e,t,n))}async function Mc(s,t){let[e,n]=await Gs(t);e||(e=await kr(n)),await vr(s,n,t,e)}async function Ac(s,t){try{await Sc(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var Gl,Vl,ht,Pt,Vs,ql,cr,Yl,dr,Xl,Jl,hr,Ws,Fn,rr,Mt,qs,ur,Ql,Zl,ec,Ks,Un,Wn,ac,lc,Hn,wc,$c,Tc,St,Qs=Qn(()=>{Gl=1,Vl=1,ht="emoji",Pt="keyvalue",Vs="favorites",ql="tokens",cr="tokens",Yl="unicode",dr="count",Xl="group",Jl="order",hr="group-order",Ws="eTag",Fn="url",rr="skinTone",Mt="readonly",qs="readwrite",ur="skinUnicodes",Ql="skinUnicodes",Zl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",ec="en";Ks={},Un={},Wn={};ac=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);lc=2;Hn="";wc=["name","url"];$c=typeof wrappedJSObject<"u";Tc=["annotation","emoji","group","order","version"];St=class{constructor({dataSource:t=Zl,locale:e=ec,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=lr(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await ic(this._dbName);rc(this._dbName,this._clear);let e=this.dataSource;await hc(t)?await Mc(t,e):this._lazyUpdate=Ac(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Fs(t),await this.ready(),ar(await fc(this._db,t)).map(Zt)}async getEmojiBySearchQuery(t){zn(t),await this.ready();let e=this._custom.search(t),n=ar(await yr(this._db,t)).map(Zt);return[...e,...n]}async getEmojiByShortcode(t){zn(t),await this.ready();let e=this._custom.byShortcode(t);return e||Zt(await gc(this._db,t))}async getEmojiByUnicodeOrName(t){zn(t),await this.ready();let e=this._custom.byName(t);return e||Zt(await mc(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Js(this._db,Pt,rr)||0}async setPreferredSkinTone(t){return Fs(t),await this.ready(),bc(this._db,Pt,rr,t)}async incrementFavoriteEmojiCount(t){return zn(t),await this.ready(),vc(this._db,t)}async getTopFavoriteEmoji(t){return Fs(t),await this.ready(),(await yc(this._db,this._custom,t)).map(Zt)}set customEmoji(t){this._custom=lr(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await Ys(this._dbName)}async delete(){await this._shutdown(),await oc(this._dbName)}}});function Tr(s){return s.unicode.includes("‍")}function zc(s){let t=Er(s,"#000"),e=Er(s,"#fff");return t&&e&&jc(t,e)}function Hc(){let s=Object.entries(Dc);try{for(let[t,e]of s)if(zc(t))return e}catch{}finally{}return s[0][1]}function Vc(s,t){if(t===0)return s;let e=s.indexOf(Wc);return e!==-1?s.substring(0,e)+String.fromCodePoint(Kc+t-1)+s.substring(e):(s.endsWith(Uc)&&(s=s.substring(0,s.length-1)),s+Fc+String.fromCodePoint(Gc+t-1))}function Ne(s){s.preventDefault(),s.stopPropagation()}function ni(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Rr(s,t){let e=new Set,n=[];for(let o of s){let i=t(o);e.has(i)||(e.add(i),n.push(o))}return n}function qc(s,t){let e=n=>{let o={};for(let i of n)typeof i.tone=="number"&&i.version<=t&&(o[i.tone]=i.unicode);return o};return s.map(({unicode:n,skins:o,shortcodes:i,url:r,name:a,category:l,annotation:c})=>({unicode:n,name:a,shortcodes:i,url:r,category:l,annotation:c,id:n||a,skins:o&&e(o)}))}function Xc(s,t,e){let n;Yc?(n=new ResizeObserver(e),n.observe(s)):Gn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function _r(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function Cr(s,t,e){let n=_r(t);if(!n){if(!ut){ut=e.cloneNode(!0);let o=getComputedStyle(e);for(let i of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])ut.style.setProperty(i,o.getPropertyValue(i),"important")}try{return document.body.appendChild(ut),ut.firstChild.nodeValue=s,_r(ut)}finally{ut.remove()}}return n}function Qc(s,t,e){let n=!0;for(let o of s){let i=e(o);if(!i)continue;typeof si>"u"&&(si=Cr(Jc,t,t));let a=Cr(o.unicode,i,t)/1.8<si;ai.set(o.unicode,a),a||(n=!1)}return n}function Zc(s){return Rr(s,t=>t)}function ed(s){s&&(s.scrollTop=0)}function en(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function Pr(s){return""+s}function td(s){let t=document.createElement("template");return t.innerHTML=s,t}function rd(s,t){od?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function ad(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function ld(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=ad(n,s):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&rd(n,s)}function cd(s,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:i,attributeName:r,attributeValuePre:a,attributeValuePost:l}}=e,c=s[i];if(o!==c)if(e.currentExpression=c,r)if(c===null)n.removeAttribute(r);else{let u=a+Pr(c)+l;n.setAttribute(r,u)}else{let u;Array.isArray(c)?ld(c,e):c instanceof Element?(u=c,n.replaceWith(u)):n.nodeValue=Pr(c),u&&(e.targetNode=u)}}}function dd(s){let t="",e=!1,n=!1,o=-1,i=new Map,r=[],a=0;for(let c=0,u=s.length;c<u;c++){let d=s[c];if(t+=d.slice(a),c===u-1)break;for(let m=0;m<d.length;m++)switch(d.charAt(m)){case"<":{d.charAt(m+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let g=r[r.length-1],h=en(i,g,()=>[]),v,b,w;if(n){let m=/(\S+)="?([^"=]*)$/.exec(d);v=m[1],b=m[2];let S=/^([^">]*)("?)/.exec(s[c+1]);w=S[1],t=t.slice(0,-1*m[0].length),a=S[0].length}else a=0;let E={attributeName:v,attributeValuePre:b,attributeValuePost:w,expressionIndex:c};h.push(E),!e&&!n&&(t+=" ")}return{template:td(t),elementsToBindings:i}}function Sr(s,t,e){for(let n=0;n<s.length;n++){let o=s[n],i=o.attributeName?t:t.firstChild,r={binding:o,targetNode:i,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function hd(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Sr(n,s,e);else{let o=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),i=s,r=-1;do{let a=t.get(++r);a&&Sr(a,i,e)}while(i=o.nextNode())}return e}function ud(s){let{template:t,elementsToBindings:e}=en(nd,s,()=>dd(s)),n=t.cloneNode(!0).content.firstElementChild,o=hd(n,e);return function(r){return cd(r,o),n}}function pd(s){let t=en(sd,s,()=>new Map),e=id;function n(i,...r){let a=en(t,i,()=>new Map);return en(a,e,()=>ud(i))(r)}function o(i,r,a){return i.map((l,c)=>{let u=e;e=a(l);try{return r(l,c)}finally{e=u}})}return{map:o,html:n}}function fd(s,t,e,n,o,i,r,a,l){let{labelWithSkin:c,titleForEmoji:u,unicodeWithSkin:d}=e,{html:g,map:h}=pd(t);function v(m,S,N){return h(m,(K,se)=>g`<button role="${S?"option":"menuitem"}" aria-selected="${S?se===t.activeSearchItem:null}" aria-label="${c(K,t.currentSkinTone)}" title="${u(K)}" class="${"emoji"+(S&&se===t.activeSearchItem?" active":"")+(K.unicode?"":" custom-emoji")}" id="${`${N}-${K.id}`}" style="${K.unicode?null:`--custom-emoji-background: url(${JSON.stringify(K.url)})`}">${K.unicode?d(K,t.currentSkinTone):""}</button>`,K=>`${N}-${K.id}`)}let w=g`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${h(t.skinTones,(m,S)=>g`<div id="skintone-${S}" class="emoji ${S===t.activeSkinTone?"active":""}" aria-selected="${S===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[S]}" aria-label="${t.i18n.skinTones[S]}">${m}</div>`,m=>m)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${h(t.groups,m=>g`<button role="tab" class="nav-button" aria-controls="tab-${m.id}" aria-label="${t.i18n.categories[m.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===m.id}" title="${t.i18n.categories[m.name]}" data-group-id="${m.id}"><div class="nav-emoji emoji">${m.emoji}</div></button>`,m=>m.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${h(t.currentEmojisWithCategories,(m,S)=>g`<div><div id="menu-label-${S}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:m.category?m.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${S!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(m.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${S}" id="${t.searchMode?"search-results":null}">${v(m.emojis,t.searchMode,"emo")}</div></div>`,m=>m.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${v(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,E=(m,S)=>{for(let N of s.querySelectorAll(`[${m}]`))S(N,N.getAttribute(m))};if(l){s.appendChild(w);for(let m of["click","focusout","input","keydown","keyup"])E(`data-on-${m}`,(S,N)=>{S.addEventListener(m,n[N])});E("data-ref",(m,S)=>{i[S]=m}),r.addEventListener("abort",()=>{s.removeChild(w)})}E("data-action",(m,S)=>{let N=a.get(S);N||a.set(S,N=new WeakSet),N.has(m)||(N.add(m),o[S](m))})}function gd(s){let t=!1,e,n=new Map,o=new Set,i,r=()=>{if(t)return;let c=[...o];o.clear();try{for(let u of c)u()}finally{i=!1,o.size&&(i=!0,Vn(r))}},a=new Proxy({},{get(c,u){if(e){let d=n.get(u);d||(d=new Set,n.set(u,d)),d.add(e)}return c[u]},set(c,u,d){if(c[u]!==d){c[u]=d;let g=n.get(u);if(g){for(let h of g)o.add(h);i||(i=!0,Vn(r))}}return!0}}),l=c=>{let u=()=>{let d=e;e=u;try{return c()}finally{e=d}};return u()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:l}}function ii(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function md(s,t,e){{let n=s.closest(".tabpanel"),o=Mr.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),Mr.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(s)}}function bd(s,t){let e={},n=new AbortController,o=n.signal,{state:i,createEffect:r}=gd(o),a=new Map;Kn(i,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),Kn(i,t),Kn(i,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:Oc,isRtl:!1,currentGroupIndex:0,groups:Zs,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{i.currentGroup!==i.groups[i.currentGroupIndex]&&(i.currentGroup=i.groups[i.currentGroupIndex])});let l=p=>{s.getElementById(p).focus()},c=p=>s.getElementById(`emo-${p.id}`),u=(p,k)=>{e.rootElement.dispatchEvent(new CustomEvent(p,{detail:k,bubbles:!0,composed:!0}))},d=(p,k)=>p.id===k.id,g=(p,k)=>{let{category:M,emojis:y}=p,{category:I,emojis:R}=k;return M!==I?!1:ii(y,R,d)},h=p=>{ii(i.currentEmojis,p,d)||(i.currentEmojis=p)},v=p=>{i.searchMode!==p&&(i.searchMode=p)},b=p=>{ii(i.currentEmojisWithCategories,p,g)||(i.currentEmojisWithCategories=p)},w=(p,k)=>k&&p.skins&&p.skins[k]||p.unicode,S={labelWithSkin:(p,k)=>Zc([p.name||w(p,k),p.annotation,...p.shortcodes||oi].filter(Boolean)).join(", "),titleForEmoji:p=>p.annotation||(p.shortcodes||oi).join(", "),unicodeWithSkin:w},N={onClickSkinToneButton:Pe,onEmojiClick:Ce,onNavClick:Y,onNavKeydown:pe,onSearchKeydown:z,onSkinToneOptionsClick:ie,onSkinToneOptionsFocusOut:Je,onSkinToneOptionsKeydown:$e,onSkinToneOptionsKeyup:Xe,onSearchInput:Te},K={calculateEmojiGridStyle:_,updateOnIntersection:x},se=!0;r(()=>{fd(s,i,S,N,K,e,o,a,se),se=!1}),i.emojiVersion||ti().then(p=>{p||(i.message=i.i18n.emojiUnsupportedMessage)}),r(()=>{async function p(){let k=!1,M=setTimeout(()=>{k=!0,i.message=i.i18n.loadingMessage},Rc);try{await i.database.ready(),i.databaseLoaded=!0}catch(y){console.error(y),i.message=i.i18n.networkErrorMessage}finally{clearTimeout(M),k&&(k=!1,i.message="")}}i.database&&p()}),r(()=>{i.pickerStyle=`
      --num-groups: ${i.groups.length}; 
      --indicator-opacity: ${i.searchMode?0:1}; 
      --num-skintones: ${$r};`}),r(()=>{i.customEmoji&&i.database&&T()}),r(()=>{i.customEmoji&&i.customEmoji.length?i.groups!==ri&&(i.groups=ri):i.groups!==Zs&&(i.currentGroupIndex&&i.currentGroupIndex--,i.groups=Zs)}),r(()=>{async function p(){i.databaseLoaded&&(i.currentSkinTone=await i.database.getPreferredSkinTone())}p()}),r(()=>{i.skinTones=Array($r).fill().map((p,k)=>Vc(i.skinToneEmoji,k))}),r(()=>{i.skinToneButtonText=i.skinTones[i.currentSkinTone]}),r(()=>{i.skinToneButtonLabel=i.i18n.skinToneLabel.replace("{skinTone}",i.i18n.skinTones[i.currentSkinTone])}),r(()=>{async function p(){let{database:k}=i,M=(await Promise.all(Bc.map(y=>k.getEmojiByUnicodeOrName(y)))).filter(Boolean);i.defaultFavoriteEmojis=M}i.databaseLoaded&&p()});function T(){let{customEmoji:p,database:k}=i,M=p||oi;k.customEmoji!==M&&(k.customEmoji=M)}r(()=>{async function p(){T();let{database:k,defaultFavoriteEmojis:M,numColumns:y}=i,I=await k.getTopFavoriteEmoji(y),R=await W(Rr([...I,...M],L=>L.unicode||L.name).slice(0,y));i.currentFavorites=R}i.databaseLoaded&&i.defaultFavoriteEmojis&&p()});function _(p){Xc(p,o,()=>{{let k=getComputedStyle(e.rootElement),M=parseInt(k.getPropertyValue("--num-columns"),10),y=k.getPropertyValue("direction")==="rtl";i.numColumns=M,i.isRtl=y}})}function x(p){md(p,o,k=>{for(let{target:M,isIntersecting:y}of k)M.classList.toggle("onscreen",y)})}r(()=>{async function p(){let{searchText:k,currentGroup:M,databaseLoaded:y,customEmoji:I}=i;if(!y)i.currentEmojis=[],i.searchMode=!1;else if(k.length>=Lc){let R=await Q(k);i.searchText===k&&(h(R),v(!0))}else{let{id:R}=M;if(R!==-1||I&&I.length){let L=await q(R);i.currentGroup.id===R&&(h(L),v(!1))}}}p()});let C=()=>{Gn(()=>ed(e.tabpanelElement))};r(()=>{let{currentEmojis:p,emojiVersion:k}=i,M=p.filter(y=>y.unicode).filter(y=>Tr(y)&&!ai.has(y.unicode));if(!k&&M.length)h(p),Gn(()=>P(M));else{let y=k?p:p.filter(D);h(y),C()}});function P(p){Qc(p,e.baselineEmoji,c)?C():i.currentEmojis=[...i.currentEmojis]}function D(p){return!p.unicode||!Tr(p)||ai.get(p.unicode)}async function j(p){let k=i.emojiVersion||await ti();return p.filter(({version:M})=>!M||M<=k)}async function W(p){return qc(p,i.emojiVersion||await ti())}async function q(p){let k=p===-1?i.customEmoji:await i.database.getEmojiByGroup(p);return W(await j(k))}async function Q(p){return W(await j(await i.database.getEmojiBySearchQuery(p)))}r(()=>{}),r(()=>{function p(){let{searchMode:M,currentEmojis:y}=i;if(M)return[{category:"",emojis:y}];let I=new Map;for(let R of y){let L=R.category||"",X=I.get(L);X||(X=[],I.set(L,X)),X.push(R)}return[...I.entries()].map(([R,L])=>({category:R,emojis:L})).sort((R,L)=>i.customCategorySorting(R.category,L.category))}let k=p();b(k)}),r(()=>{i.activeSearchItemId=i.activeSearchItem!==-1&&i.currentEmojis[i.activeSearchItem].id}),r(()=>{let{rawSearchText:p}=i;Lr(()=>{i.searchText=(p||"").trim(),i.activeSearchItem=-1})});function z(p){if(!i.searchMode||!i.currentEmojis.length)return;let k=M=>{Ne(p),i.activeSearchItem=ni(M,i.activeSearchItem,i.currentEmojis)};switch(p.key){case"ArrowDown":return k(!1);case"ArrowUp":return k(!0);case"Enter":if(i.activeSearchItem===-1)i.activeSearchItem=0;else return Ne(p),De(i.currentEmojis[i.activeSearchItem].id)}}function Y(p){let{target:k}=p,M=k.closest(".nav-button");if(!M)return;let y=parseInt(M.dataset.groupId,10);e.searchElement.value="",i.rawSearchText="",i.searchText="",i.activeSearchItem=-1,i.currentGroupIndex=i.groups.findIndex(I=>I.id===y)}function pe(p){let{target:k,key:M}=p,y=I=>{I&&(Ne(p),I.focus())};switch(M){case"ArrowLeft":return y(k.previousElementSibling);case"ArrowRight":return y(k.nextElementSibling);case"Home":return y(k.parentElement.firstElementChild);case"End":return y(k.parentElement.lastElementChild)}}async function Me(p){let k=await i.database.getEmojiByUnicodeOrName(p),M=[...i.currentEmojis,...i.currentFavorites].find(I=>I.id===p),y=M.unicode&&w(M,i.currentSkinTone);return await i.database.incrementFavoriteEmojiCount(p),{emoji:k,skinTone:i.currentSkinTone,...y&&{unicode:y},...M.name&&{name:M.name}}}async function De(p){let k=Me(p);u("emoji-click-sync",k),u("emoji-click",await k)}function Ce(p){let{target:k}=p;if(!k.classList.contains("emoji"))return;Ne(p);let M=k.id.substring(4);De(M)}function Z(p){i.currentSkinTone=p,i.skinTonePickerExpanded=!1,l("skintone-button"),u("skin-tone-change",{skinTone:p}),i.database.setPreferredSkinTone(p)}function ie(p){let{target:{id:k}}=p,M=k&&k.match(/^skintone-(\d)/);if(!M)return;Ne(p);let y=parseInt(M[1],10);Z(y)}function Pe(p){i.skinTonePickerExpanded=!i.skinTonePickerExpanded,i.activeSkinTone=i.currentSkinTone,i.skinTonePickerExpanded&&(Ne(p),Gn(()=>l("skintone-list")))}r(()=>{i.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{i.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):i.skinTonePickerExpandedAfterAnimation=!1});function $e(p){if(!i.skinTonePickerExpanded)return;let k=async M=>{Ne(p),i.activeSkinTone=M};switch(p.key){case"ArrowUp":return k(ni(!0,i.activeSkinTone,i.skinTones));case"ArrowDown":return k(ni(!1,i.activeSkinTone,i.skinTones));case"Home":return k(0);case"End":return k(i.skinTones.length-1);case"Enter":return Ne(p),Z(i.activeSkinTone);case"Escape":return Ne(p),i.skinTonePickerExpanded=!1,l("skintone-button")}}function Xe(p){if(i.skinTonePickerExpanded)switch(p.key){case" ":return Ne(p),Z(i.activeSkinTone)}}async function Je(p){let{relatedTarget:k}=p;(!k||k.id!=="skintone-list")&&(i.skinTonePickerExpanded=!1)}function Te(p){i.rawSearchText=p.target.value}return{$set(p){Kn(i,p)},$destroy(){n.abort()}}}function Ar(s){s instanceof pt||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var ri,Zs,Lc,$r,Lr,Dc,Rc,Ic,Oc,Bc,Dr,Nc,Er,jc,ei,ti,ai,Uc,Fc,Wc,Kc,Gc,Gn,Yc,Jc,si,ut,nd,sd,id,od,Vn,Mr,oi,Kn,vd,yd,xd,wd,Ir,kd,pt,Or,Br=Qn(()=>{Qs();ri=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),Zs=ri.slice(1),Lc=2,$r=6,Lr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;Dc={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},Rc=1e3,Ic="🖐️",Oc=8,Bc=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Dr='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',Nc=(s,t)=>s<t?-1:s>t?1:0,Er=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Dr}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},jc=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};ti=()=>(ei||(ei=new Promise(s=>Lr(()=>s(Hc())))),ei),ai=new Map,Uc="️",Fc="\uD83C",Wc="‍",Kc=127995,Gc=57339;Gn=requestAnimationFrame,Yc=typeof ResizeObserver=="function";Jc="😀";nd=new WeakMap,sd=new WeakMap,id=Symbol("un-keyed"),od="replaceChildren"in Element.prototype;Vn=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);Mr=new WeakMap;oi=[],{assign:Kn}=Object;vd="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",yd="en",xd={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},wd=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Ir=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],kd=`:host{--emoji-font-family:${Dr}}`,pt=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=wd+kd,this.shadowRoot.appendChild(e),this._ctx={locale:yd,dataSource:vd,skinToneEmoji:Ic,customCategorySorting:Nc,customEmoji:null,i18n:xd,emojiVersion:null,...t};for(let n of Ir)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Ar(this),this._cmp||(this._cmp=bd(this.shadowRoot,this._ctx))}disconnectedCallback(){Ar(this),Vn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,i)=>i.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new St({locale:t,dataSource:e}))}_dbFlush(){Vn(()=>this._dbCreate())}},Or={};for(let s of Ir)Or[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(pt.prototype,Or);customElements.get("emoji-picker")||customElements.define("emoji-picker",pt)});var Nr={};$a(Nr,{Database:()=>St,Picker:()=>pt});var jr=Qn(()=>{Br();Qs()});function yi(s){return{type:"auth",access_token:s}}function xi(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function wi(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function Zn(s){return{type:"unsubscribe_events",subscription:s}}function ki(){return{type:"ping"}}function $i(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function Ei(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),i=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[i]=r}return t}var _i=(s,t,e,n)=>{let[o,i,r]=s.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(i)>=e:Number(i)>e)||n!==void 0&&Number(o)===t&&Number(i)===e&&Number(r)>=n};var hn=!1,Ea="auth_required",_a="auth_invalid",Ca="auth_ok";function Pi(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;hn&&console.log("[Auth phase] Initializing",n);function o(i,r,a){hn&&console.log("[Auth Phase] New connection",n);let l=new WebSocket(n),c=!1,u=()=>{if(l.removeEventListener("close",u),c){a(2);return}if(i===0){a(1);return}let h=i===-1?-1:i-1;setTimeout(()=>o(h,r,a),1e3)},d=async h=>{try{t.expired&&await(e||t.refreshAccessToken()),l.send(JSON.stringify(yi(t.accessToken)))}catch(v){c=v===2,l.close()}},g=async h=>{let v=JSON.parse(h.data);switch(hn&&console.log("[Auth phase] Received",v),v.type){case _a:c=!0,l.close();break;case Ca:l.removeEventListener("open",d),l.removeEventListener("message",g),l.removeEventListener("close",u),l.removeEventListener("error",u),l.haVersion=v.ha_version,_i(l.haVersion,2022,9)&&l.send(JSON.stringify(xi())),r(l);break;default:hn&&v.type!==Ea&&console.warn("[Auth phase] Unhandled message",v)}};l.addEventListener("open",d),l.addEventListener("message",g),l.addEventListener("close",u),l.addEventListener("error",u)}return new Promise((i,r)=>o(s.setupRetry,i,r))}var Rt=!1,un=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(i=>{Rt&&console.log("Received",i);let r=this.commands.get(i.id);switch(i.type){case"event":r?r.callback(i.event):(console.warn(`Received event for unknown subscription ${i.id}. Unsubscribing.`),this.sendMessagePromise(Zn(i.id)).catch(a=>{Rt&&console.warn(` Error unsubsribing from unknown subscription ${i.id}`,a)}));break;case"result":r&&(i.success?(r.resolve(i.result),"subscribe"in r||this.commands.delete(i.id)):(r.reject(i.error),this.commands.delete(i.id)));break;case"pong":r?(r.resolve(),this.commands.delete(i.id)):console.warn(`Received unknown pong response ${i.id}`);break;default:Rt&&console.warn("Unhandled message",i)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject($i(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),i=r=>{setTimeout(async()=>{if(!this.closeRequested){Rt&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let c of l)c.reject&&c.reject(3)}a===2?this.fireEvent("reconnect-error",a):i(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),i(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(i=>{o.unsubscribe=i,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,wi(e))}ping(){return this.sendMessagePromise(ki())}sendMessage(t,e){if(!this.connected)throw 3;if(Rt&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(i){n(i)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((i,r)=>{this._queuedMessages.push({resolve:i,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((i,r)=>{let a=this._genCmdId();o={resolve:i,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Zn(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var Pa=()=>`${location.protocol}//${location.host}/`,Sa=s=>s*1e3+Date.now();function Ma(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function Aa(s,t,e,n){let o=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function La(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Aa(s,t,e,n)}async function Ai(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let i=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!i.ok)throw i.status===400||i.status===403?2:new Error("Unable to fetch tokens");let r=await i.json();return r.hassUrl=s,r.clientId=t,r.expires=Sa(r.expires_in),r}function Mi(s,t,e){return Ai(s,t,{code:e,grant_type:"authorization_code"})}function Da(s){return btoa(JSON.stringify(s))}function Ra(s){return JSON.parse(atob(s))}var es=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await Ai(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function Li(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:Pa(),o=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await Mi(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let i=Ei(location.search.substr(1));if("auth_callback"in i){let r=Ra(i.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await Mi(r.hassUrl,r.clientId,i.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new es(t,s.saveTokens);if(e===void 0)throw 4;return La(e,n,s.redirectUrl||Ma(),Da({hassUrl:e,clientId:n})),new Promise(()=>{})}async function Di(s){let t=Object.assign({setupRetry:0,createSocket:Pi},s),e=await t.createSocket(t);return new un(e,t)}function U(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function je(s){let t=Math.floor(Math.round(s)/60)%24;return`${U(s)} ${t<12?"AM":"PM"}`}function Ii(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function bt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function pn(s){return s?`${bt(Math.abs(s))} ${s<0?"early":"late"}`:"on time"}function ts(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Ia=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Oa=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Ba=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"}),Na=new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"UTC"});function It(s){return new Date(`${s}T12:00:00Z`)}function Le(s){let t=It(s);return`${Ia.format(t)}, ${Ba.format(t)}`}function fn(s){return Na.format(It(s))}function xe(s){return Oa.format(It(s))}function Re(s,t){return Math.round((It(t).getTime()-It(s).getTime())/864e5)}function Ot(s,t=new Date){let e=ja(s);if(!e)return Ot("UTC",t);let n=e.formatToParts(t),o=i=>n.find(r=>r.type===i)?.value??"0";return{date:`${o("year")}-${o("month")}-${o("day")}`,minutes:Number(o("hour"))*60+Number(o("minute"))}}var Ri=new Map;function ja(s){let t=Ri.get(s);if(t!==void 0)return t;try{t=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"})}catch{t=null}return Ri.set(s,t),t}function ns(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=Ot(e,s),i=Ot(e,t).date;return o.date===i?`at ${je(o.minutes)}`:`on ${xe(o.date)} at ${je(o.minutes)}`}var oe=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function Ni(s){switch(s.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}function ji(s){let t=(s??"").trim(),e=o=>{let i=o.exec(t);return i?(t=t.slice(i[0].length).trim(),!0):!1};for(;e(/^Couldn['’]t read Google Calendar:?/i););return{short:e(/^Couldn['’]t reach Google Calendar:?/i)?"Can’t reach Google Calendar":"Couldn’t read Google Calendar",detail:t||null}}var Ze="mydashlight",za=7,ss=3e4,Oi=3e4;function is(s){if(s instanceof oe)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new oe(String(t.code??"error"),t.message)}return typeof s=="number"?new oe("connection_lost","Lost the connection to Home Assistant."):new oe("error",String(s))}function Bi(s,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new oe("timeout","Home Assistant didn’t answer.")),t);s.then(i=>{clearTimeout(o),e(i)},i=>{clearTimeout(o),n(i)})})}var Bt=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},gn=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new oe("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Bt(this.conn,`${Ze}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new oe("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},ss),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await Bi(this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:"get_plan",service_data:{days:za},return_response:!0}),Oi);this.emit(t.response)}catch(t){this.fail(is(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:t,service_data:e})}catch(n){throw is(n)}this.live||await this.refresh()}setRide(t,e,n,o,i){return this.call("set_ride",i===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:ts(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:ts(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n,o,i){return this.call("set_people",{event:t,...e?{people:e}:{},...i!==void 0?{overnight:i}:{},scope:n,...o?{driver:o.driver,riders:o.riders,back_riders:o.backRiders}:{}})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let a=await Bi(this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:"get_chores",service_data:{},return_response:!0}),Oi);if(e)return;n=!0,t(a.response??null)}catch{!e&&!n&&t(null)}},i=new Bt(this.conn,`${Ze}/chores/subscribe`,a=>{e||(n=!0,t(a.chores))},()=>void o());i.open();let r=setInterval(()=>{i.live||i.open()},ss);return()=>{e=!0,clearInterval(r),i.close()}}watchLunch(t){let e=!1,n=!1,o=new Bt(this.conn,`${Ze}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let i=setInterval(()=>{o.live||o.open()},ss);return()=>{e=!0,clearInterval(i),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n,o){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{},...e&&o?{skip:o}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ze,service:t,service_data:e})}catch(n){throw is(n)}}};var mn=globalThis,bn=mn.ShadowRoot&&(mn.ShadyCSS===void 0||mn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,os=Symbol(),zi=new WeakMap,Nt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==os)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(bn&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=zi.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&zi.set(e,t))}return t}toString(){return this.cssText}},Hi=s=>new Nt(typeof s=="string"?s:s+"",void 0,os),et=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,o,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[i+1],s[0]);return new Nt(e,s,os)},Ui=(s,t)=>{if(bn)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=mn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}},rs=bn?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Hi(e)})(s):s;var{is:Ha,defineProperty:Ua,getOwnPropertyDescriptor:Fa,getOwnPropertyNames:Wa,getOwnPropertySymbols:Ka,getPrototypeOf:Ga}=Object,vn=globalThis,Fi=vn.trustedTypes,Va=Fi?Fi.emptyScript:"",qa=vn.reactiveElementPolyfillSupport,jt=(s,t)=>s,as={toAttribute(s,t){switch(t){case Boolean:s=s?Va:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ki=(s,t)=>!Ha(s,t),Wi={attribute:!0,type:String,converter:as,reflect:!1,useDefault:!1,hasChanged:Ki};Symbol.metadata??=Symbol("metadata"),vn.litPropertyMetadata??=new WeakMap;var ze=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Wi){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&Ua(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:i}=Fa(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);i?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Wi}static _$Ei(){if(this.hasOwnProperty(jt("elementProperties")))return;let t=Ga(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(jt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(jt("properties"))){let e=this.properties,n=[...Wa(e),...Ka(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(rs(o))}else t!==void 0&&e.push(rs(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ui(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:as).toAttribute(e,n.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=n.getPropertyOptions(o),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:as;this._$Em=o;let a=r.fromAttribute(e,i.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,i){if(t!==void 0){let r=this.constructor;if(o===!1&&(i=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Ki)(i,e)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:i},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,i]of n){let{wrapped:r}=i,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};ze.elementStyles=[],ze.shadowRootOptions={mode:"open"},ze[jt("elementProperties")]=new Map,ze[jt("finalized")]=new Map,qa?.({ReactiveElement:ze}),(vn.reactiveElementVersions??=[]).push("2.1.2");var cs=globalThis,Gi=s=>s,yn=cs.trustedTypes,Vi=yn?yn.createPolicy("lit-html",{createHTML:s=>s}):void 0,ds="$lit$",He=`lit$${Math.random().toFixed(9).slice(2)}$`,hs="?"+He,Ya=`<${hs}>`,st=document,Ht=()=>st.createComment(""),Ut=s=>s===null||typeof s!="object"&&typeof s!="function",us=Array.isArray,Zi=s=>us(s)||typeof s?.[Symbol.iterator]=="function",ls=`[ 	
\f\r]`,zt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qi=/-->/g,Yi=/>/g,tt=RegExp(`>|${ls}(?:([^\\s"'>=/]+)(${ls}*=${ls}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xi=/'/g,Ji=/"/g,eo=/^(?:script|style|textarea|title)$/i,ps=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),f=ps(1),re=ps(2),Hh=ps(3),Ue=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Qi=new WeakMap,nt=st.createTreeWalker(st,129);function to(s,t){if(!us(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Vi!==void 0?Vi.createHTML(t):t}var no=(s,t)=>{let e=s.length-1,n=[],o,i=t===2?"<svg>":t===3?"<math>":"",r=zt;for(let a=0;a<e;a++){let l=s[a],c,u,d=-1,g=0;for(;g<l.length&&(r.lastIndex=g,u=r.exec(l),u!==null);)g=r.lastIndex,r===zt?u[1]==="!--"?r=qi:u[1]!==void 0?r=Yi:u[2]!==void 0?(eo.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=tt):u[3]!==void 0&&(r=tt):r===tt?u[0]===">"?(r=o??zt,d=-1):u[1]===void 0?d=-2:(d=r.lastIndex-u[2].length,c=u[1],r=u[3]===void 0?tt:u[3]==='"'?Ji:Xi):r===Ji||r===Xi?r=tt:r===qi||r===Yi?r=zt:(r=tt,o=void 0);let h=r===tt&&s[a+1].startsWith("/>")?" ":"";i+=r===zt?l+Ya:d>=0?(n.push(c),l.slice(0,d)+ds+l.slice(d)+He+h):l+He+(d===-2?a:h)}return[to(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Ft=class s{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let i=0,r=0,a=t.length-1,l=this.parts,[c,u]=no(t,e);if(this.el=s.createElement(c,n),nt.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(o=nt.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let d of o.getAttributeNames())if(d.endsWith(ds)){let g=u[r++],h=o.getAttribute(d).split(He),v=/([.?@])?(.*)/.exec(g);l.push({type:1,index:i,name:v[2],strings:h,ctor:v[1]==="."?wn:v[1]==="?"?kn:v[1]==="@"?$n:ot}),o.removeAttribute(d)}else d.startsWith(He)&&(l.push({type:6,index:i}),o.removeAttribute(d));if(eo.test(o.tagName)){let d=o.textContent.split(He),g=d.length-1;if(g>0){o.textContent=yn?yn.emptyScript:"";for(let h=0;h<g;h++)o.append(d[h],Ht()),nt.nextNode(),l.push({type:2,index:++i});o.append(d[g],Ht())}}}else if(o.nodeType===8)if(o.data===hs)l.push({type:2,index:i});else{let d=-1;for(;(d=o.data.indexOf(He,d+1))!==-1;)l.push({type:7,index:i}),d+=He.length-1}i++}}static createElement(t,e){let n=st.createElement("template");return n.innerHTML=t,n}};function it(s,t,e=s,n){if(t===Ue)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,i=Ut(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(s),o._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=it(s,o._$AS(s,t.values),o,n)),t}var xn=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??st).importNode(e,!0);nt.currentNode=o;let i=nt.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let c;l.type===2?c=new vt(i,i.nextSibling,this,t):l.type===1?c=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(c=new Tn(i,this,t)),this._$AV.push(c),l=n[++a]}r!==l?.index&&(i=nt.nextNode(),r++)}return nt.currentNode=st,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},vt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=it(this,t,e),Ut(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==Ue&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Zi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&Ut(this._$AH)?this._$AA.nextSibling.data=t:this.T(st.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Ft.createElement(to(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new xn(o,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Qi.get(t.strings);return e===void 0&&Qi.set(t.strings,e=new Ft(t)),e}k(t){us(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let i of t)o===e.length?e.push(n=new s(this.O(Ht()),this.O(Ht()),this,this.options)):n=e[o],n._$AI(i),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Gi(t).nextSibling;Gi(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ot=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,i){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=$}_$AI(t,e=this,n,o){let i=this.strings,r=!1;if(i===void 0)t=it(this,t,e,0),r=!Ut(t)||t!==this._$AH&&t!==Ue,r&&(this._$AH=t);else{let a=t,l,c;for(t=i[0],l=0;l<i.length-1;l++)c=it(this,a[n+l],e,l),c===Ue&&(c=this._$AH[l]),r||=!Ut(c)||c!==this._$AH[l],c===$?t=$:t!==$&&(t+=(c??"")+i[l+1]),this._$AH[l]=c}r&&!o&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},wn=class extends ot{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},kn=class extends ot{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},$n=class extends ot{constructor(t,e,n,o,i){super(t,e,n,o,i),this.type=5}_$AI(t,e=this){if((t=it(this,t,e,0)??$)===Ue)return;let n=this._$AH,o=t===$&&n!==$||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==$&&(n===$||o);o&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Tn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}},so={M:ds,P:He,A:hs,C:1,L:no,R:xn,D:Zi,V:it,I:vt,H:ot,N:kn,U:$n,B:wn,F:Tn},Xa=cs.litHtmlPolyfillSupport;Xa?.(Ft,vt),(cs.litHtmlVersions??=[]).push("3.3.3");var io=(s,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let i=e?.renderBefore??null;n._$litPart$=o=new vt(t.insertBefore(Ht(),i),i,void 0,e??{})}return o._$AI(s),o};var fs=globalThis,Se=class extends ze{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=io(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ue}};Se._$litElement$=!0,Se.finalized=!0,fs.litElementHydrateSupport?.({LitElement:Se});var Ja=fs.litElementPolyfillSupport;Ja?.({LitElement:Se});(fs.litElementVersions??=[]).push("4.2.2");var oo={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ro=s=>(...t)=>({_$litDirective$:s,values:t}),En=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Qa}=so,ao=s=>s;var lo=()=>document.createComment(""),yt=(s,t,e)=>{let n=s._$AA.parentNode,o=t===void 0?s._$AB:t._$AA;if(e===void 0){let i=n.insertBefore(lo(),o),r=n.insertBefore(lo(),o);e=new Qa(i,r,s,s.options)}else{let i=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==r._$AU&&e._$AP(l)}if(i!==o||a){let l=e._$AA;for(;l!==i;){let c=ao(l).nextSibling;ao(n).insertBefore(l,o),l=c}}}return e},Ge=(s,t,e=s)=>(s._$AI(t,e),s),Za={},co=(s,t=Za)=>s._$AH=t,ho=s=>s._$AH,_n=s=>{s._$AR(),s._$AA.remove()};var uo=(s,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(s[o],o);return n},Ie=ro(class extends En{constructor(s){if(super(s),s.type!==oo.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],i=[],r=0;for(let a of s)o[r]=n?n(a,r):r,i[r]=e(a,r),r++;return{values:i,keys:o}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let o=ho(s),{values:i,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,i;let a=this.ut??=[],l=[],c,u,d=0,g=o.length-1,h=0,v=i.length-1;for(;d<=g&&h<=v;)if(o[d]===null)d++;else if(o[g]===null)g--;else if(a[d]===r[h])l[h]=Ge(o[d],i[h]),d++,h++;else if(a[g]===r[v])l[v]=Ge(o[g],i[v]),g--,v--;else if(a[d]===r[v])l[v]=Ge(o[d],i[v]),yt(s,l[v+1],o[d]),d++,v--;else if(a[g]===r[h])l[h]=Ge(o[g],i[h]),yt(s,o[d],o[g]),g--,h++;else if(c===void 0&&(c=uo(r,h,v),u=uo(a,d,g)),c.has(a[d]))if(c.has(a[g])){let b=u.get(r[h]),w=b!==void 0?o[b]:null;if(w===null){let E=yt(s,o[d]);Ge(E,i[h]),l[h]=E}else l[h]=Ge(w,i[h]),yt(s,o[d],w),o[b]=null;h++}else _n(o[g]),g--;else _n(o[d]),d++;for(;h<=v;){let b=yt(s,l[v+1]);Ge(b,i[h]),l[h++]=b}for(;d<=g;){let b=o[d++];b!==null&&_n(b)}return this.ut=r,co(s,l),Ue}});var Cn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ce(s){return Cn[(s%Cn.length+Cn.length)%Cn.length]}var Pn="#23272E",gs="35,39,46";var ms=3,Vt=36,bs=12,Sn=8,po=30,Oe=16,Wt=100,wt=60,el=120,fo=44,go=20,tl=45,nl=30,mo=20,xs=10,An=30,ws=10,sl=150,il=150,Dn=1;function To(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Vt}function ol(s,t,e){return 10+10.2*s.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var rl=26,Eo=4;function $s(s,t){let e=Math.max(sl,il/Dn);return Math.ceil(wt+Math.max(0,s-1)*xs+An+Math.max(0,t-1)*ws+e*(s+Dn*t))}function we(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function ae(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function _o(s,t){let e=s.who?.[t.event_id]?.people??[],n=t.own??t.kid;if(!e.includes(n))return null;let o=e.filter(r=>r!==n),i=we(s);return o.length&&(t.own!=null||o.some(r=>i.includes(r)))?o:null}function ve(s){return new Map(we(s).map((t,e)=>[t,ce(e)]))}function be(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function ue(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Ts(s,t){return t==="none"?"Not needed":ae(s).includes(t)?ue(s,t):t}function al(s){return s.leave_by!=null&&s.leave_by>s.start&&s.leave_by!==s.end?` · leave ${U(s.leave_by)}`:""}function Rn(s){if(s.busy_why==="days"){if(s.start<=0&&s.end>=1440)return"All day";if(s.start<=0)return`Until ${U(s.end)}`;if(s.end>=1440)return`From ${U(s.start)}`}return`${U(s.start)}–${U(s.end)}`}function qt(s,t){return t.own?ue(s,t.own):be(s,t.kid)}var Fe={color:Pn,rgb:gs,ink:Pn};function Co(s,t){return t.own?Fe:ve(s).get(t.kid)??ce(0)}function ll(s,t){let e=we(s);return t.along.map(n=>e.includes(n)?be(s,n):ue(s,n))}function kt(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function cl(s,t){let e=we(s),n=ae(s).filter(a=>t.includes(a)),o=e.filter(a=>t.includes(a)),i=e.length>1&&o.length===e.length;if(i&&n.length===ae(s).length)return"Everyone";let r=[...n.map(a=>ue(s,a)),...i?["the kids"]:o.map(a=>be(s,a))];return r.length<2?r.join(""):`${r.slice(0,-1).join(", ")} & ${r[r.length-1]}`}function dl(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function Ln(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function vs(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(Ln(t,n.from)),e.push(Ln(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(Ln(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function hl(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,i=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(i(),o=-1/0);let a=n.findIndex(l=>l<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return i(),t}function ul(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return s[s.length-1].y}function pl(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],o=s[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return s[s.length-1].t}function Po(s,t){return ul(s.anchors,t)}function Es(s,t){return pl(s.anchors,t)}function fl(s,t){let e=we(s),n=ae(s),o=Math.max(t,$s(e.length,n.length)),r=(o-wt-Math.max(0,e.length-1)*xs-An-Math.max(0,n.length-1)*ws)/(e.length+Dn*n.length||1),a=Math.floor(r),l=Math.floor(r*Dn),c=s.whole_week??s.days,u=new Map;for(let b of c)for(let w of b.events)for(let E of w.own?w.along:[w.kid]){let m=u.get(E)??[];m.some(S=>S.event_id===w.event_id&&S.calendar_id===w.calendar_id)||m.push(w),u.set(E,m)}let d=ve(s),g=[],h=wt;e.forEach((b,w)=>{let E=u.get(b)??[],m=s.days.some(S=>S.events.some(N=>N.kid===b&&(N.sides.includes("drop")&&N.drop===""||N.sides.includes("pick")&&N.pick==="")));g.push({id:b,kind:"kid",x:h,w:a,name:be(s,b),dot:d.get(b).color,rgb:d.get(b).rgb,sub:m?"Needs a ride":`${E.length} this week`,subWarn:m}),h+=a+(w<e.length-1?xs:0)});let v=h+An/2;return h+=An,n.forEach((b,w)=>{let E=0,m=0;for(let S of c){let N=S.drivers[b];N&&(E+=N.outings.length,m+=N.drive??0)}g.push({id:b,kind:"driver",x:h,w:l,name:ue(s,b),dot:Pn,rgb:gs,sub:`${E} ${E===1?"trip":"trips"} this week · ${bt(m)} driving`,subWarn:!1}),h+=l+(w<n.length-1?ws:0)}),{columns:g,sepX:v,width:o}}function gl(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),i=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!i)return e;let r=o.slice(i[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function bo(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${U(s.start)}`:e||!t?`${s.title} until ${U(s.end)}`:`${s.title} ${U(s.start)}–${U(s.end)}`}function _s(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function Cs(s,t){let e=Re(t,s);return e===0?"Today":e===1?"Tomorrow":""}function ge(s,t=0){return s==null||!Number.isFinite(s)?t:s}var ks=null;function So(s){ks=s}var Mn='Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',xt={title:`800 14.5px ${Mn}`,time:`400 12px ${Mn}`,line:`600 12px ${Mn}`,stop:`400 12px ${Mn}`};function ml(s,t,e){let n=Math.max(8,Math.floor(t/e)),o=1,i=0;for(let r of s.split(/[ \t\n]+/).filter(Boolean)){let a=r.length;for(i===0?i=a:i+1+a<=n?i+=1+a:(o++,i=a);i>n;)o++,i-=n}return o}function bl(s,t,e,n){let o=s.split(/[ \t\n]+/).filter(Boolean),i=1,r="";for(let a of o){let l=r?`${r} ${a}`:a,c=n(l,e);if(c==null)return null;if(c<=t){r=l;continue}r&&i++;let u=n(a,e);if(u==null)return null;u>t&&(i+=Math.ceil(u/t)-1),r=a}return i}function Kt(s,t,e=7,n){if(n&&ks){let o=bl(s,t-.5,n,ks);if(o!=null)return o}return ml(s,t,e)}var Mo=25,vl=15,Ao=3;function vo(s){return Math.max(0,Math.min(Ao,Math.floor((s-Mo)/vl)))}var yl=Mo+2,yo=20;function xo(s,t="Home"){let e=/^(\d+:\d\d)\s+(.+)$/.exec(s.at(-1)??"");return e&&e[2]===t?e[1]:null}function ys(s,t,e,n){let o=t.drivers[e],i=o?.home;if(!i)return s;let r=n==null?void 0:o.outings.find(a=>(a.start??1/0)<=n&&n<(a.end??-1/0));return new Map(s).set(i.place,i.name).set("home",r?.home??i.name)}var Gt="🚗";function wo(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,i,r,a=!1)=>({at:o,who:i,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var ko={muted:0,normal:1,pending:2,problem:3};function xl(s){let{drop:t,pick:e}=s,n=t?wo(t.text,"drop"):null,o=e?wo(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return s;let i=[t,e].reduce((l,c)=>c&&(ko[c.tone]??1)>(ko[l]??1)?c.tone:l,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Gt} No rides yet`,tone:i},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let l=`${Gt} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${l} both ways`,tone:i},pick:null}:!n.at||!o.at?{drop:{text:`${l} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:i},pick:null}:{drop:{text:`${l} ↓${n.at} ↑${o.at}`.trimEnd(),tone:i},pick:null}}let r=(l,c)=>l==="needed"?`${c} needed`:`${c}${l.at?`${l.at} `:" "}${l.who}${l.stays?" stays":""}${l.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Gt} ${a.join(" · ")}`,tone:i},pick:null}}function wl(s,t){return!t&&!!s.drop&&!s.pick&&s.drop.tone==="muted"}var kl=5,$l=13;function Tl(s,t,e={}){let n=e.clash?4:2,o=t-n-13-9,i=n+2*kl;i+=Kt(s.title,o-(e.noted?$l:0),9,xt.title)*18;let r=s.inline&&s.drop?`${s.time} · ${s.drop.text}`:s.time;return i+=1+Kt(r,o,6.6,s.inline?xt.line:xt.time)*16,s.drop&&!s.inline&&(i+=1+Kt(s.drop.text,o,7,xt.line)*16),s.pick&&(i+=2+Kt(s.pick.text,o,7,xt.line)*16),Math.ceil(i)+1}function $o(s,t="Home"){let e=/^(\S+\s+)(.+?), get (.+)$/u.exec(s);return e&&e[2]===t?`${e[1]}${t} ↑ ${e[3]}`:s.replace(/, drop off (.+)$/u," ↓ $1").replace(/, pick up (.+)$/u," ↑ $1")}function El(s,t){let e=s.reduce((n,o)=>n+Kt(o,t-20,7,xt.stop),0);return 28+s.length+e*16+1}function Lo(s,t,e,n){let o=t==="compact",{columns:i,sepX:r,width:a}=fl(s,e),l=new Map(i.map(m=>[m.id,m])),c=we(s),u=ae(s),d=[...c,...u],g=ve(s),h=dl(s),v=m=>be(s,m),b=m=>ue(s,m),w={mode:t,width:a,height:0,columns:i,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],folds:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},E=0;return s.days.forEach((m,S)=>{let N=S*1440,K=new Map(m.events.map(p=>[p.id,p])),se=p=>p&&K.has(p)?{day:m.date,event:p}:null,T=_s(m),_=m.events.length,x=Cs(m.date,n.date),C=Le(m.date),P=(_?`${_} ${_===1?"activity":"activities"}${m.done?" left":""}`:m.done?"All done for today":"Nothing scheduled")+(T?` · ${T} to sort out`:""),D=Dl(s,m,g,a,a-ol(C,x,P));w.dayHeads.push({date:m.date,y:E,label:C,tag:x,sub:P,warn:T>0,h:Vt+(D&&D.h?D.h+Eo+2:0),allDay:D?.chips??[],inline:D?.inline??0}),w.anchors.push({t:N,y:E});let j=w.dayHeads[w.dayHeads.length-1],W=E+j.h+bs,q=u.flatMap(p=>m.drivers[p]?.outings??[]);if(!_&&!q.length){w.empties.push({key:m.date,y:W,text:m.done?"Nothing else today":"Nothing planned"}),E=W+40,w.anchors.push({t:N+1439,y:E});return}let Q=(p,k,M=p.kid)=>{let y=!!p.own&&M===p.own,I=!!p.own&&M!==p.own,R=y?b(M):v(M),L=I?{drop:{text:`${k?`${Gt} `:""}With ${b(p.own)}`,tone:p.attending===!1?"muted":"normal"},pick:null}:k&&!p.own?xl(p.lines):p.lines,X=y?ll(s,p):[],H=(p.takes!=null?`${p.takes} min, any time ${U(p.start)}–${U(p.end)}`:Rn(p)+(p.arrive_by!=null?` · arrive ${U(p.arrive_by)}`:"")+al(p))+(X.length?` · with ${kt(X)}`:"");return{who:R,mine:y,title:gl(p.title,R),time:H,drop:L.drop,pick:L.pick,inline:k&&wl(L,p.attending===!1)}},z=(p,k,M,y)=>Tl(Q(p,!0,M),k,{noted:!!p.notes,clash:y}),Y=(p,k,M,y,I,R,L,X=p.kid)=>{let H=Q(p,L,X),me=H.mine?Fe:g.get(X)??ce(0),ee=H.who,A={drop:H.drop,pick:H.pick};return{key:`${m.date}|card|${p.id}`+(p.own?`|${X}`:""),x:k,y:M,w:y,h:I,target:{day:m.date,event:p.id},event:p,color:me,kidName:ee,clash:R,stayed:!p.own&&p.stay&&u.includes(p.drop),skipped:p.attending===!1,title:H.title,time:H.time,drop:A.drop,pick:A.pick,showDrop:!!A.drop&&(L||I>=56),showPick:!!A.pick&&(L||I>=74),wrap:L,inline:H.inline,aria:`${ee}, ${p.title} ${p.takes!=null?`any time from ${U(p.start)} to ${U(p.end)}`:Rn(p).replace("–"," to ")}. `+(p.attending===!1&&!A.drop?"Not attending. ":"")+[A.drop,A.pick].filter(J=>!!J).map(J=>J.text).join(". ")}},pe=p=>{let k=m.rides[p];return k?(m.drivers[k.driver]?.segments??[]).filter(y=>y.type!=="home"&&y.kids.includes(k.kid)&&ge(y.start)>=ge(k.start)&&ge(y.end)<=ge(k.end)):[]},Me=p=>{let k=m.rides[p];if(!k)return null;let M=k.serves.find(y=>K.get(y)?.kid===k.kid);return se(M??k.serves[0])},De=(p,k)=>{if(k.event)return k;let M=m.events.find(y=>y.own&&y.own!==p&&y.along.includes(p)&&y.title===k.title);return M?{...k,title:`${k.title} with ${b(M.own)}`}:k},Ce=p=>{if(p.takes==null)return[p.start,p.end];let k=p.planned??p.start;return[k,k+p.takes]},Z=new Map;for(let p of m.issues)p.level!=="problem"||!p.event||(p.kind==="late"&&Z.set(p.event,`${Math.round(ge(p.minutes))} min late`),p.kind==="waiting"&&Z.set(`${p.event}|pick`,`Waits ${Math.round(ge(p.minutes))} min`));if(!o){let p=1/0,k=-1/0;for(let A of m.events)A.start<=0&&A.end>=1440||(A.start>0?p=Math.min(p,A.start-20,A.arrive_by!=null?A.arrive_by-10:1/0):p=Math.min(p,A.end-30),A.end<1440?k=Math.max(k,A.end+20):k=Math.max(k,A.start+30));for(let A of q)A.start!=null&&(p=Math.min(p,A.start)),A.end!=null&&(k=Math.max(k,A.end));let M=m.from;M!=null&&Number.isFinite(p)&&p<M+60?p=M-15:m.date===n.date&&Number.isFinite(p)&&n.minutes>p-60&&n.minutes<k&&(p=Math.min(p,n.minutes-15));let y=Number.isFinite(p)?Math.floor((p-5)/30)*30:900,I=Math.max(Number.isFinite(k)?Math.ceil((k+5)/30)*30:960,y+60),R=A=>M!=null&&ge(A)<=y,L=A=>M!=null&&ge(A)<y,X=Cl(_l(m,u,Ce,m.date===n.date?n.minutes:null),y,I),H=A=>Math.round(W+Pl(Math.max(y,Math.min(I,A))-y,X,y));w.anchors.push({t:N+y,y:H(y)});for(let A of X)w.anchors.push({t:N+A.from,y:H(A.from)},{t:N+A.to,y:H(A.to)}),w.folds.push({key:`${m.date}|fold|${A.from}`,y:H(A.from),h:H(A.to)-H(A.from),from:A.from,to:A.to,label:Sl(A.to-A.from)});w.anchors.push({t:N+I,y:H(I)});let me=(A,J)=>X.some(G=>J?A>=G.from&&A<=G.to:A>G.from&&A<G.to);for(let A of c){let J=l.get(A),G=g.get(A),Ae=(m.kids[A]?.items??[]).filter(O=>O.start!=null&&O.end!=null&&!R(O.end)).map(O=>({item:O,s:ge(O.start),en:ge(O.end)})),ye=[];for(let O of hl(Ae)){let F=J.w/O.cols,V=Math.round(J.x+O.col*F),te=Math.round(F-(O.cols>1?4:0)),de=H(O.s),ne=O.item;if(ne.type==="act"){let _e=K.get(ne.event??"");if(!_e)continue;let dn=Math.max(30,H(O.en)-de),gt=Y(_e,V,de,te,dn,ne.clash,!1,A);if(gt.layer=Wt,gt.cut=L(O.s),w.cards.push(gt),_e.arrive_by!=null&&_e.start-_e.arrive_by>=5&&!gt.cut){let Jn=H(_e.arrive_by),vi={key:`${m.date}|prep|${_e.id}`,x:V,y:Jn,w:te,h:de-Jn+Oe,color:G,label:`Arrive by ${U(_e.arrive_by)}`,layer:Wt-1};w.preps.push(vi),ye.push({s:_e.arrive_by,en:O.en,top:Jn,bottom:de+dn,x:V,w:te,prep:vi,card:gt})}else ye.push({s:O.s,en:O.en,top:de,bottom:de+dn,x:V,w:te,card:gt});let mi=Z.get(_e.id);mi&&w.marks.push({key:`${m.date}|late|${_e.id}`,x:V+te-4,y:de+4,text:mi,right:!0});let bi=Z.get(`${_e.id}|pick`);bi&&w.marks.push({key:`${m.date}|wait|${_e.id}`,x:V+4,y:de+dn+2,text:bi,right:!1});continue}let le=m.rides[ne.ride??-1];if(!le)continue;let he=Math.max(22,H(O.en)-de),Qe=vs(pe(le.index),ys(h,m,le.driver,le.start??void 0)),Dt=b(le.driver),fi={key:`${m.date}|ride|${le.index}`,x:V,y:de,w:te,h:he,target:Me(le.index),l1:`${le.own?"In":"Along in"} ${Dt}’s car`,l2:Qe.join(" → "),show2:vo(he)>0,lines2:vo(he),dashed:!le.own,clash:ne.clash,aria:`${v(A)} ${le.own?"in":"riding along in"} ${Dt}’s car, ${U(ge(le.start))} to ${U(ge(le.end))}: ${Qe.join(" to ")}`};w.rides.push(fi);let gi=l.get(le.driver),Xn=null;gi&&(Xn={key:`${m.date}|band|${le.index}`,x:V+te,y:de,w:Math.max(0,gi.x+8-(V+te)),h:he,color:G},w.bands.push(Xn)),ye.push({s:O.s,en:O.en,top:de,bottom:de+he,x:V,w:te,ride:fi,band:Xn})}let cn=O=>O.ride?.layer??(O.prep?Wt-1:Wt),Lt=(O,F,V,te)=>{V>Oe&&w.links.push({key:`${O.key}|link`,x:O.x,y:F,w:O.w,h:V,color:G,layer:te})},B=(O,F)=>{if(!(F.x<O.x||F.x+F.w>O.x+O.w)&&(O.x=F.x,O.w=F.w,O.ride.x=F.x,O.ride.w=F.w,O.band)){let V=O.band.x+O.band.w;O.band.x=F.x+F.w,O.band.w=Math.max(0,V-O.band.x)}},fe=new Set;for(let O of[...ye].sort((F,V)=>V.s-F.s)){let F=O.ride;if(!F)continue;let V=ye.filter(ne=>ne!==O&&ne.s>=O.en&&ne.s-O.en<=po&&ne.top>=O.bottom).sort((ne,le)=>ne.s-le.s||ne.top-le.top)[0];if(!V)continue;fe.add(O),B(O,V);let te=cn(V),de=V.top-O.bottom;Lt(F,O.bottom,de+Oe,te-1),F.layer=te-(de>0?2:1),F.h+=Oe,F.tuckBottom=Oe}for(let O of[...ye].sort((F,V)=>F.s-V.s)){let F=O.ride;if(!F||fe.has(O))continue;let V=ye.filter(ne=>ne!==O&&ne.en<=O.s&&O.s-ne.en<=po&&ne.bottom<=O.top&&(ne.card||ne.ride?.layer!=null)).sort((ne,le)=>le.en-ne.en||le.bottom-ne.bottom)[0];if(!V)continue;B(O,V);let te=V.ride?.layer??Wt,de=O.top-V.bottom;Lt(F,V.bottom-Oe,de+Oe,te-1),F.layer=te-(de>0?2:1),F.y-=Oe,F.h+=Oe,F.tuckTop=Oe}}for(let A of u){let J=l.get(A),G=m.drivers[A];if(!G)continue;let Ae=[],ye=null;for(let B of G.segments)if(!(B.start==null||B.end==null)){if(B.type==="home"){ye=null;continue}if(B.type==="stay"){ye=null,Ae.push({type:"stay",g:B,s:B.start,en:B.end});continue}ye&&ye.en===B.start?(ye.en=B.end,ye.legs.push(B)):(ye={type:"trip",s:B.start,en:B.end,legs:[B]},Ae.push(ye))}let cn=new Set,Lt=(B,fe,O,F)=>{cn.add(B.id);let V=H(fe),te=Y(B,J.x+8,V,J.w-16,Math.max(30,H(O)-V),!1,!1,A);te.cut=L(fe),F&&te.drop?.tone==="normal"&&(te.drop=null,te.showDrop=!1),w.cards.push(te)};for(let B of Ae){if(R(B.en))continue;let fe=H(B.s),O=Math.max(24,H(B.en)-fe);if(B.type==="stay"){let he=K.get(B.g.event??B.g.serves??"");if(he?.own===A){Lt(he,B.s,B.en,!0);continue}let Qe=he?g.get(he.kid)??ce(0):ce(0),Dt=B.g.kids.map(v);w.stays.push({cut:L(B.s),key:`${m.date}|stay|${A}|${B.s}`,x:J.x+8,y:fe,w:J.w-16,h:O,target:se(he?.id),color:Qe,l1:he?`At ${he.title} with ${v(he.kid)}`:"Staying",l2:`until ${U(B.en)}`+(Dt.length?` · ${Dt.join(" and ")} too`:"")});continue}let F=B.legs[0],V=B.legs[B.legs.length-1],te=[];for(let he of B.legs)for(let Qe of he.kids)te.includes(Qe)||te.push(Qe);let de=V.type==="drive"&&V.to==="home",ne=ys(h,m,A,B.s),le=vs(B.legs,ne);w.trips.push({key:`${m.date}|trip|${A}|${B.s}`,x:J.x+8,y:fe,w:J.w-16,h:O,target:se(B.legs.find(he=>he.serves)?.serves),l1:F.type==="drive"&&F.from==="home"?`Leave ${U(B.s)}`:`From ${Ln(h,F.from??F.place)} ${U(B.s)}`,l2:le.join(" → "),show2:O>=36,l3:de?`${ne.get("home")??"Home"} ${U(B.en)}`:"",show3:de&&O>=62,stops:null,kids:te.map(he=>(g.get(he)??ce(0)).color),bad:B.legs.some(he=>he.overlaps_busy),aria:`${b(A)} drives ${le.join(" to ")}, ${U(B.s)} to ${U(B.en)}`})}for(let B of G.segments)if(!(!B.overlaps_busy||B.start==null||B.end==null))for(let fe of G.busy){let O=Math.max(B.start,fe.start),F=Math.min(B.end,fe.end);F<=O||R(F)||w.overlaps.push({key:`${m.date}|overlap|${A}|${O}`,x:J.x+6,y:H(O)-2,w:J.w-12,h:Math.max(8,H(F)-H(O)+4)})}for(let B of m.events)if(B.own===A&&(!cn.has(B.id)&&!R(Ce(B)[1])&&Lt(B,...Ce(B),!1),B.takes!=null&&B.attending!==!1&&!R(B.end))){let fe=H(B.start);w.windows.push({key:`${m.date}|window|${B.id}`,x:J.x+4,y:fe,w:J.w-8,h:Math.max(24,H(B.end)-fe),label:`${B.title} · any time ${U(B.start)}–${U(B.end)}`})}for(let B of G.busy){if(B.event||B.end<=y||B.start>=I)continue;let fe=De(A,B),O=H(fe.start),F=H(fe.end);w.busy.push({key:`${m.date}|busy|${A}|${fe.start}`,x:J.x+1,y:O,w:J.w-2,h:F-O,labelY:8,label:bo(fe,!1)})}}let ee=-1/0;for(let A=y;A<=I;A+=30)me(A,!0)||w.grid.push({key:`${m.date}|grid|${A}`,y:H(A),strong:A%60===0}),(X.some(G=>G.from===A||G.to===A)||A%60===0&&!me(A,!1))&&H(A)-ee>=22&&(w.hours.push({key:`${m.date}|hour|${A}`,y:H(A)-8,label:A%60===0?Ii(A):je(A)}),ee=H(A));m.date===n.date&&n.minutes>y&&n.minutes<I&&(w.now={y:H(n.minutes),label:`Now ${U(n.minutes)}`}),E=H(I)+bs;return}let ie=[];for(let p of c){let k=l.get(p);for(let M of m.kids[p]?.items??[])if(M.start!=null){if(M.type==="act"){let y=K.get(M.event??"");if(!y)continue;ie.push({col:p,s:M.start,h:z(y,k.w,p,M.clash),kind:"act",item:M})}else if(!m.rides[M.ride??-1]?.own){let y=m.rides[M.ride??-1],I=y?m.drivers[y.driver]?.outings.find(R=>R.start!=null&&R.start<=ge(y.start)&&ge(y.start)<=ge(R.end,R.start)):void 0;ie.push({col:p,s:I?.start??M.start,h:yl,kind:"along",item:M})}}}for(let p of u){let k=m.drivers[p];if(!k)continue;for(let y of k.busy)y.event||ie.push({col:p,s:y.start,h:32,kind:"busy",busy:De(p,y)});let M=l.get(p).w;for(let y of m.events)y.own!==p||!y.busy_only&&y.attending!==!1&&(y.takes==null||y.planned!=null)||ie.push({col:p,s:Ce(y)[0],h:z(y,M-16,p,!1),kind:"own",event:y});for(let y of k.outings){if(y.start==null)continue;let I=(xo(y.lines,y.home)?y.lines.slice(0,-1):y.lines).map(R=>$o(R,y.home));ie.push({col:p,s:y.start,h:El([...I,...y.warn?[y.warn]:[]],M-16),kind:"out",out:y})}}ie.sort((p,k)=>p.s-k.s||d.indexOf(p.col)-d.indexOf(k.col));let Pe=new Map,$e=[],Xe=new Map,Je=W-yo;for(let p=0;p<ie.length;){let k=p,M=Je+yo;for(;k<ie.length&&ie[k].s===ie[p].s;k++){let I=Pe.get(ie[k].col);I!=null&&(M=Math.max(M,I+Sn))}let y=new Set;for(let I=p;I<k;I++){let R=ie[I],L=y.has(R.col)?Pe.get(R.col)+Sn:M;y.add(R.col),Pe.set(R.col,L+R.h)}Xe.set(ie[p].s,M),ie[p].s>0&&w.hours.push({key:`${m.date}|hour|${ie[p].s}`,y:M+2,label:je(ie[p].s)}),Je=M,p=k}Pe.clear(),ie.forEach((p,k)=>{let M=Pe.get(p.col),y=Math.max(M!=null?M+Sn:W,Xe.get(p.s));Pe.set(p.col,y+p.h);let I=p.kind==="busy"?p.busy.end:p.kind==="act"?K.get(p.item.event??"")?.end??null:p.kind==="own"?Ce(p.event)[1]:null;$e.push({col:p.col,s:p.s,end:I,y,h:p.h,box:null}),w.anchors.push({t:N+p.s,y});let R=l.get(p.col);if(p.kind==="busy"){let L={key:`${m.date}|busy|${p.col}|${k}`,x:R.x+1,y,w:R.w-2,h:p.h,labelY:8,label:bo(p.busy,!0)};w.busy.push(L),$e[$e.length-1].box=L}else if(p.kind==="out"){let L=p.out,X=xo(L.lines,L.home),H=X?L.lines.slice(0,-1):L.lines;w.trips.push({key:`${m.date}|trip|${p.col}|${k}`,x:R.x+8,y,w:R.w-16,h:p.h,target:se(L.target),l1:X?`${L.lead} · ${L.home&&L.home!=="Home"?L.home:"home"} ${X}`:L.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...H.map(me=>({text:$o(me,L.home),warn:!1})),...L.warn?[{text:L.warn,warn:!0}]:[]],kids:L.kids.map(me=>(g.get(me)??ce(0)).color),bad:!!L.warn,aria:`${b(p.col)}: ${L.lead}. ${L.lines.join(". ")}${L.warn?`. ${L.warn}`:""}`})}else if(p.kind==="own"){let L=Y(p.event,R.x+8,y,R.w-16,p.h,!1,!0,p.col);w.cards.push(L),$e[$e.length-1].box=L}else if(p.kind==="act"){let L=K.get(p.item.event??""),X=Y(L,R.x,y,R.w,p.h,p.item.clash,!0,p.col);w.cards.push(X),$e[$e.length-1].box=X}else{let L=m.rides[p.item.ride??-1],X=vs(pe(L.index),ys(h,m,L.driver,L.start??void 0)),H=b(L.driver);w.rides.push({key:`${m.date}|ride|${L.index}`,x:R.x,y,w:R.w,h:p.h,target:Me(L.index),l1:`${Gt} with ${H}`,l2:X.join(" → "),show2:!1,lines2:Ao,dashed:!0,clash:p.item.clash,aria:`${v(p.col)} riding along with ${H}, ${U(ge(L.start))} to ${U(ge(L.end))}: ${X.join(" to ")}`})}});let Te=W;for(let p of Pe.values())Te=Math.max(Te,p);for(let p of $e){if(!p.box||p.end==null)continue;let k=p.y+p.h;for(let M of $e)M.col!==p.col&&M.s>=p.s&&M.s<p.end&&(k=Math.max(k,M.y+M.h));p.end>=1440&&(k=Te);for(let M of $e)M.col===p.col&&M.y>p.y&&(k=Math.min(k,M.y-Sn));k=Math.min(k,Te),k>p.y+p.h&&(p.box.h=k-p.y)}E=Te+bs+6,w.anchors.push({t:N+1439,y:E})}),w.height=E,w}function _l(s,t,e,n){let o=[],i=(r,a)=>{r==null||a==null||o.push([r-go,Math.min(a,r+tl)+mo],[Math.max(r,a-nl)-go,a+mo])};for(let r of s.events)r.own?(i(...e(r)),r.takes!=null&&i(r.start,r.end)):i(r.arrive_by??r.start,r.end);for(let r of Object.values(s.kids))for(let a of r.items??[])i(a.start,a.end);for(let r of t){let a=s.drivers[r];if(a){for(let l of a.segments)l.type!=="home"&&i(l.start,l.end);for(let l of a.outings)i(l.start,l.end);for(let l of a.busy)i(l.start,l.end)}}return n!=null&&o.push([n-30,n+30]),o}function Cl(s,t,e){let n=s.map(([l,c])=>[Math.max(t,l),Math.min(e,c)]).filter(([l,c])=>c>l).sort((l,c)=>l[0]-c[0]),o=[],i=t,r=(l,c)=>{let u=Math.ceil(l/30)*30,d=Math.floor(c/30)*30;d-u>=el&&o.push({from:u,to:d})},a=!1;for(let[l,c]of n)a&&l>i&&r(i,l),i=a?Math.max(i,c):c,a=!0;return o}function Pl(s,t,e){let n=s*ms,o=e+s;for(let i of t){let r=i.to-i.from;o>=i.to?n-=r*ms-fo:o>i.from&&(n-=(o-i.from)*ms-(o-i.from)/r*fo)}return n}function Sl(s){let t=Math.floor(s/60),e=s%60>=30;return`${t}${e?"½":""} hrs`}var Ml=["","¼","½","¾"];function rt(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return bt(n);let o=Math.round(n*4),i=Math.floor(o/4),r=Ml[o%4];return`${i||!r?i:""}${r} min`})}function Do(s){let t=e=>e?{...e,text:rt(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(i=>({...i,lines:i.lines.map(rt),warn:i.warn==null?i.warn:rt(i.warn)}))}])),issues:e.issues.map(n=>({...n,title:rt(n.title),body:rt(n.body),note:n.note==null?n.note:rt(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:rt(o.note)}))}:{}}))}))}}var Al=2,Ll=48;function Ro(s,t,e=Ll){let n=[],o=new Set(ae(s)),i=we(s).map(g=>be(s,g)),r=i.length>1?i.slice(0,2):[i[0]??"Ava","Ben"],a=0,l=0,c=0,u=0,d=t.minutes+e*60;for(let g of s.days){let h=Re(t.date,g.date),v=h===0?"":`${xe(g.date)} · `,b=new Map(g.events.map(m=>[m.id,m])),w=m=>m&&b.has(m)?{day:g.date,event:m}:null,E=(m,S)=>h*1440+(m??b.get(S??"")?.start??0)<d;for(let m of g.issues)if(m.level==="problem"){if(!E(m.at,m.event)){c++,m.kind==="unassigned"&&u++;continue}a++,m.kind==="unassigned"&&l++,n.push({key:`${g.date}|${m.key}`,tone:m.kind==="unassigned"?"unassigned":"problem",title:v+m.title,body:m.body,target:w(m.event),suggestions:(m.suggestions??[]).map(S=>({id:S.id,label:S.label,note:S.note}))})}if(g.clashes.forEach((m,S)=>{if(!E(m.a.start,m.a.event)){c++;return}a++;let N=b.get(m.a.event??""),K=be(s,m.kid),se=(_,x)=>{let C=w(x);return C?{text:_,target:C}:_},T=[];if(m.b.type==="act"){let _=b.get(m.b.event??"");N&&_&&(T=[se(N.title,N.id),` ${U(N.start)}–${U(N.end)} and `,se(_.title,_.id),` ${U(_.start)}–${U(_.end)} overlap.`])}else{let _=g.rides[m.b.ride??-1];N&&_&&(T=[`${K} is in `,se(`${ue(s,_.driver)}’s car`,_.serves[0]),` ${U(ge(m.b.start))}–${U(ge(m.b.end))}, during `,se(N.title,N.id),"."])}n.push({key:`${g.date}|clash|${S}`,tone:"problem",title:`${v}${K} is double-booked`,body:T.map(_=>typeof _=="string"?_:_.text).join(""),parts:T,target:null,suggestions:[]})}),h>=0&&h<Al)for(let m of g.issues)m.level!=="heads_up"||!E(m.at,m.event)||n.push({key:`${g.date}|${m.key}`,tone:"heads_up",title:v+m.title,body:m.body,target:w(m.event),suggestions:[]});for(let m of g.unplaced??[]){if(!E(m.at)){c++;continue}a++;let S=m.people.map(K=>o.has(K)?ue(s,K):be(s,K)),N=m.from_notes?"The For line in its notes":"Its title";n.push({key:`${g.date}|unplaced|${m.id}`,tone:"problem",title:`${v}${U(m.at)} ${m.title}: ${Io(m).toLowerCase()}`,body:m.reason==="unknown"&&m.word?`${N} names “${m.word}”, who isn’t anyone in the family, so ${S.length?`it’s only in ${kt(S)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:g.date,id:m.id}})}for(let m of g.events)!m.problems.length||!E(m.start)||n.push({key:`${g.date}|notes|${m.id}`,tone:"heads_up",title:`${v}Check the notes on ${qt(s,m)}’s ${m.title}`,body:`These lines couldn’t be read: ${m.problems.join("; ")}`,target:w(m.id),suggestions:[]})}return{items:n,problems:a,unassigned:l,later:c,laterUnassigned:u}}function Io(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function Dl(s,t,e,n,o=0){let i=new Set(ae(s)),r=v=>{let b=v[0];return b==null?null:i.has(b)?Fe:e.get(b)??null},a=[...(t.all_day??[]).map(v=>{let b=v.days>1?`Day ${v.day_number} of ${v.days}`:"";return{key:`${t.date}|allday|${v.id}`,title:v.stay?`🏨 ${v.title}`:v.title,note:v.stay?[cl(s,v.people),b].filter(Boolean).join(" · "):b,color:r(v.people),cancelled:v.cancelled,warn:!1,pick:null,stay:v.stay&&!v.cancelled?v.id:null,canStay:!v.stay&&v.can_stay?v.id:null,notes:v.notes??""}}),...(t.unplaced??[]).map(v=>({key:`${t.date}|unplaced|${v.id}`,title:`${U(v.at)} ${v.title}`,note:Io(v),color:null,cancelled:!1,warn:!0,pick:v.id,stay:null,canStay:null,notes:v.notes??""}))];if(!a.length)return null;let l=Math.max(120,n-wt),c=(v,b=7)=>30+b*v.title.length+(v.note?Math.min(b,5.6)*(v.note.length+2):0)+(v.notes?16:0)+(v.stay?12:0),u=0,d=0;for(;u<a.length&&d+c(a[u],6.4)<=o;)d+=c(a[u++],6.4);let g=0;d=0;for(let v of a.slice(u)){let b=Math.min(l,c(v));(!g||d+b>l)&&(g++,d=0),d+=b}let h=g?g*rl+(g-1)*Eo:0;return{key:`${t.date}|allday`,h,chips:a,inline:u}}function Oo(s,t){let e=ve(s),n=null,o=i=>i.ahead>0?2:i.ongoing?1:0;for(let i of s.days){let r=Re(t.date,i.date);if(!(r<0))for(let a of ae(s))for(let l of i.drivers[a]?.outings??[]){if(l.start==null)continue;let c=r*1440+l.start;if(r*1440+ge(l.end,l.start)<=t.minutes)continue;let d=c-t.minutes,g={driver:a,name:ue(s,a),date:i.date,ahead:r,start:l.start,inMinutes:d,ongoing:d<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(h=>e.get(h)??ce(0)),warn:l.warn,target:l.target&&i.events.some(h=>h.id===l.target)?{day:i.date,event:l.target}:null};(!n||o(g)<o(n)||o(g)===o(n)&&g.inMinutes<n.inMinutes)&&(n=g)}}return n}function Ms(s,t){return(s.points?.log??[]).filter(e=>e.by===t)}function No(s,t){let e=[s.done_at?Fo(s.done_at,t.today,t.time_zone):""];return s.late&&e.push("late"),s.kid!==s.by&&(e.push(`from ${t.kids.find(n=>n.id===s.kid)?.name??"someone else"}`),!s.late&&!s.points&&e.push("a favor")),e.filter(Boolean).join(" · ")}function $t(s){return s.state==="done"||s.state==="late"||Tt(s.state)}function Tt(s){return s==="skipped"||s==="excused"}var jo=780;function As(s,t){return!!s.for_day&&(s.shows_from??s.due)===t&&!!s.due&&s.due>t}function Rl(s,t,e){return s.state==="open"&&As(s,t)&&e<jo}function zo(s,t){return s.state==="open"&&!!s.for_day&&s.for_day===t}function Ho(s,t){return s.chores.map(e=>Rl(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:t>=jo&&zo(e,s.today)?{...e,state:"overdue"}:e)}function Il(s,t){return s.state==="overdue"&&s.for_day===t}function Uo(s){return s.state==="open"||s.state==="overdue"}function In(s,t,e){if(s.state==="skipped")return"Skipped";if(s.state==="excused")return"Excused";if($t(s)){let n=s.done_at?Fo(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Ps(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Ps(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let o=Re(t,s.due);return`By ${o===1?"tomorrow":o<7?xe(s.due):Ss(s.due)}`}if(As(s,t))return`Tonight · for ${Ps(s.for_day,t)}`;if(zo(s,t))return"For school today";if(s.due&&s.due>t){let n=Re(t,s.due);return n===1?"By tomorrow":`By ${n<7?xe(s.due):Ss(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Ps(s,t){let e=Re(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?xe(s):Ss(s)}function Ss(s){return fn(s)}function Fo(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let o=Ol(e),i=o.day.format(n),r=o.time.format(n);return i===t?r:`${xe(i)} ${r}`}var Bo=new Map;function Ol(s){let t=Bo.get(s);if(t)return t;let e=s;try{new Intl.DateTimeFormat("en-US",{timeZone:e})}catch{e=void 0}return t={day:new Intl.DateTimeFormat("en-CA",{year:"numeric",month:"numeric",day:"numeric",timeZone:e}),time:new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZone:e})},Bo.set(s,t),t}function Wo(s,t,e=1440){let n=Ho(s,e).sort((o,i)=>o.order-i.order);return s.kids.map((o,i)=>{let r=n.filter(u=>u.kid===o.id),a=new Map;for(let u of r){if(u.state!=="upcoming")continue;let d=u.shows_from??u.due??s.today;a.set(d,[...a.get(d)??[],u])}let l=r.filter(u=>u.state==="overdue"),c=r.filter(u=>u.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??ce(i),overdue:l,now:c,done:r.filter($t),later:[...a.entries()].sort(([u],[d])=>u.localeCompare(d)).map(([u,d])=>({date:u,chores:d})),left:l.length+c.length}})}function Ko(s,t=1440){return Ho(s,t).filter(e=>e.state==="overdue"&&!Il(e,s.today)||e.state==="open"&&(e.due==null||e.due<=s.today||As(e,s.today))).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function Ls(s){return!s.chores.length&&!s.templates.length}var at=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Yt(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,i]=n.split("-").map(r=>at.indexOf(r.trim()));if(o===void 0||o<0||i!==void 0&&i<0)return null;if(i===void 0)e.add(o);else for(let r=0;r<=(i-o+7)%7;r++)e.add((o+r)%7)}return e}function Ds(s){let t=[...new Set(s)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${at[n[0]]}-${at[n.at(-1)]}`]:n.map(o=>at[o])).join(", ")}var lt="none";function Xt(s){return s==="daily"||s==="school"?"":"Any"}function Go(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1,points:null}}function Vo(s){let t=s.days??Xt(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only,points:s.points??null}}function Rs(s){return s.title.trim()?s.who.length?s.days===lt?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function qo(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{},points:s.points}}function Is(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function Os(s,t,e=1,n=!1,o=!1){if(s==="school"){let u=t.trim().replace(/-/g,"–"),d=o?u?`${u} Bring lunch days`:"Bring lunch days":u?`${u} school days`:"Every school day";return n?`${d}, the night before`:d}let i={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${i}s`:`each ${i}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let c=`${a.split(",").map(u=>{let d=u.trim();return d.toLowerCase()==="last"?"the last day":/^\d+$/.test(d)?`the ${Is(Number(d))}`:`the ${d}`}).join(" and ")} ${r}`;return c[0].toUpperCase()+c.slice(1)}function Bs(s,t,e=!1){let n=s.map(i=>t.find(r=>r.id===i)?.name??i);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function Ns(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function We(s){if(Number.isInteger(s))return String(s);let t=Math.trunc(s);return Math.abs(Math.abs(s-t)-.5)<1e-9?`${s<0?"-":""}${Math.abs(t)||""}½`:String(Math.round(s*10)/10)}function js(s,t){return!!s?.points?.leaders.includes(t)}function Yo(s){let t=/\d+/.exec(s)?.[0];return t?Math.min(1e3,Number(t.slice(0,5))):null}function Bl(s){let t=Math.max(1,s.every??1),e=(s.days??Xt(s.repeats)).trim(),n;return s.repeats==="daily"?n=7/t:s.repeats==="monthly"?n=12/52/t:s.repeats==="school"?n=e?Yt(e)?.size??5:5:n=e===""||e.toLowerCase()==="any"?1/t:(Yt(e)?.size??1)/t,s.take_turns&&s.who.length>1?n/s.who.length:n}function Xo(s,t,e=1){let n=Object.fromEntries(t.map(o=>[o,0]));for(let o of s){if(o.paused||o.problems.length)continue;let i=(o.points??e)*Bl(o);for(let r of o.who)r in n&&(n[r]=n[r]+i)}for(let o of t)n[o]=Math.round(n[o]*2)/2;return n}function On(s,t){return`${s}|${t}`}function Et(s,t){let[e,n,o]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function Bn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Jo(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Qo(s,t){return Bn(t)<5&&!Jo(s,t)}function Jt(s,t,e=new Map){if(!Qo(s,t))return null;let n=On(s.id,t);if(e.has(n)){let i=e.get(n);return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}let o=s.picks[t];return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}function _t(s,t){return Qo(s,t)?s.menus?.[t]??null:null}var Nl="From the school's menu feed.";function jl(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Nl);return t.length?t.join(`
`):null}function Be(s){return s.slice(0,7)}function Nn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function zs(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Zo(s){let t=[];for(let e=Be(s.first);e<=Be(s.last);e=zs(e))t.push(e);return t}function er(s,t,e,n=new Map){let o=`${e}-01`,i=Et(o,-Bn(o)),r=[];for(;Be(i)<=e;){let a=[];for(let l=0;l<5;l++){let c=Et(i,l),u=Be(c)!==e,d=u?null:Jo(t,c),g=u?null:Jt(t,c,n);a.push({date:c,day:Number(c.slice(8)),outside:u,off:d?d.title:null,lunch:g?.lunch??null,picked:g?.picked??!1,menu:u?null:_t(t,c)?.dish??null,sides:u?null:jl(_t(t,c)?.details??""),past:c<s.today,today:c===s.today})}a.some(l=>!l.outside)&&r.push(a),i=Et(i,7)}return r}function tr(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function nr(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function sr(s,t,e,n=new Map){let o=e<780?0:1;for(let i=o;i<8;i++){let r=Et(t,i),a=Jt(s,r,n);if(!a)continue;let l=Re(t,r);return{lunch:a.lunch,when:l===0?"today":l===1?"tomorrow":xe(r),date:r,menu:_t(s,r)?.dish??null}}return null}var zl={timeline:"timeline",full:"timeline",compact:"compact"};function ct(s){let t=new URLSearchParams(s),e={},n=zl[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var Hl=["auth_callback","code","state"];function Hs(s){let t=new URLSearchParams(s);for(let n of Hl)t.delete(n);let e=t.toString();return e?`?${e}`:""}function Us(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Ul(s,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of s.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(s.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function Fl(s,t){let e=[],n=[],o=()=>{let i=n[n.length-1];i&&Us(i.end)>t&&e.push(...n),n=[]};for(let i of s){if(i.start==null||i.end==null)continue;if(i.type==="home"||i.type==="stay"){o(),i.end>t&&e.push(i);continue}let r=n[n.length-1];r&&r.end!==i.start&&o(),n.push(i)}return o(),e}function Wl(s,t){let e=new Set(s.events.filter(i=>Ul(s,i)<=t).map(i=>i.id)),n=i=>Us(s.rides[i??-1]?.end,-1)<=t,o=i=>i.type==="act"?e.has(i.event??""):n(i.ride);return{...s,events:s.events.filter(i=>!e.has(i.id)),kids:Object.fromEntries(Object.entries(s.kids).map(([i,r])=>[i,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(s.drivers).map(([i,r])=>[i,{...r,segments:Fl(r.segments,t),outings:r.outings.filter(a=>a.start==null||Us(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:s.clashes.filter(i=>!o(i.a)&&!o(i.b)),issues:s.issues.filter(i=>!i.event||!e.has(i.event)),done:e.size,from:t}}function ir(s,t){return{...s,whole_week:s.whole_week??s.days,days:s.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?Wl(e,t.minutes):e)}}var or=et`
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
    --shadow:
      0 1px 2px rgba(28, 30, 34, 0.06), 0 2px 8px rgba(28, 30, 34, 0.06);
    display: block;
    height: 100%;
    background: var(--bg);
    color: var(--ink);
    font-family:
      Inter,
      "Segoe UI",
      Roboto,
      system-ui,
      -apple-system,
      sans-serif;
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
  /* What's wrong, on one line across the bottom of the header. */
  .problem-row {
    flex: none;
    margin: -6px 0 0;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    color: var(--bad-ink);
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button.problem-row {
    cursor: pointer;
  }
  .problem-row.open {
    white-space: normal;
  }
  .problem-age,
  .problem-more {
    font-weight: 500;
  }
  .problem-link {
    text-decoration: underline;
  }
  .problem-detail {
    display: block;
    font-weight: 500;
    color: var(--ink-2);
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
    background: repeating-linear-gradient(
      90deg,
      var(--dark) 0 10px,
      transparent 10px 16px
    );
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
  .col-head .ch-text {
    flex: 1;
  }
  /* The second line: this week's count, and a kid's lunch tucked at the right. */
  .sub-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .sub-row .sub {
    min-width: 0;
  }
  /* Bring or Buy never shrinks: the count beside it gives way instead. */
  .sub-row .lunch-chip.small {
    flex: none;
    max-width: none;
    margin-left: auto;
    height: 18px;
    font-size: 11.5px;
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
    background:
      linear-gradient(rgba(var(--rgb), 0.04), rgba(var(--rgb), 0.04)),
      var(--surface);
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
  /* A hotel stay: tap it to pick who's staying. */
  button.strip-chip.hotel:hover,
  button.strip-chip.hotel:focus-visible {
    background: rgba(var(--rgb), 0.2);
  }
  /* Over days at an address: tap it to say who's staying there. */
  button.strip-chip.maybe:hover,
  button.strip-chip.maybe:focus-visible {
    background: rgba(0, 0, 0, 0.05);
  }
  button.strip-chip.maybe::after {
    content: "›";
    align-self: center;
    margin-left: -2px;
    opacity: 0.45;
    font-size: 16px;
    font-weight: 800;
    line-height: 1;
  }
  button.strip-chip.hotel::after {
    content: "›";
    align-self: center;
    margin-left: -2px;
    color: var(--ink);
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
    box-shadow:
      inset 5px 0 0 var(--c),
      0 0 0 2px rgba(var(--rgb), 0.6),
      var(--shadow);
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
    box-shadow:
      inset 5px 0 0 var(--c),
      var(--shadow);
  }
  .card.clash {
    border-width: 2px;
  }
  .card.sel {
    box-shadow:
      inset 5px 0 0 var(--c),
      0 0 0 3px var(--ring);
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
  .ride.tall {
    justify-content: flex-start;
    padding-top: 6px;
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
  /* A long drive, such as to a hotel hours away: its words at the top, not lost in a fold. */
  .trip.tall {
    justify-content: flex-start;
    padding-top: 8px;
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
    background:
      linear-gradient(rgba(var(--rgb), 0.08), rgba(var(--rgb), 0.08)),
      var(--surface);
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
    background: repeating-linear-gradient(
      135deg,
      rgba(18, 135, 122, 0.35) 0px,
      rgba(18, 135, 122, 0.35) 4px,
      #fff 4px,
      #fff 8px
    );
  }
  .busy-sw {
    background: repeating-linear-gradient(
      135deg,
      rgba(90, 96, 105, 0.25) 0px,
      rgba(90, 96, 105, 0.25) 4px,
      rgba(90, 96, 105, 0.06) 4px,
      rgba(90, 96, 105, 0.06) 8px
    );
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
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .toast-undo {
    flex: none;
    min-height: 36px;
    padding: 0 12px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 18px;
    background: transparent;
    color: #fff;
    font-weight: 700;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chore-head .ch-text {
    flex: 1;
  }
  /* The name gets the whole first line; the lunch chip sits beside the count below it. */
  .chore-head .sub-row .sub {
    flex: none;
    max-width: 100%;
  }
  .chore-head .sub-row .lunch-chip {
    height: 24px;
    padding: 0 9px;
    font-size: 12.5px;
    max-width: 78%;
  }
  .chore-list,
  .points-log {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .chore-cols.flip .chore-col {
    animation: card-flip 0.32s ease-out both;
  }
  @keyframes card-flip {
    from {
      transform: perspective(900px) rotateY(-80deg);
      opacity: 0.4;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .chore-cols.flip .chore-col {
      animation: none;
    }
  }
  .log-row {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 52px;
    padding: 6px 12px;
    border-radius: 12px;
    background: rgba(var(--rgb), 0.06);
    border: 1px solid rgba(var(--rgb), 0.14);
  }
  .log-row .chore-icon {
    width: 26px;
    text-align: center;
  }
  .log-row .chore-text {
    flex: 1;
  }
  .log-pts {
    flex: none;
    font-size: 18px;
    font-weight: 800;
    color: var(--k, var(--ink));
  }
  .log-row.nothing {
    background: transparent;
  }
  .log-row.nothing .chore-title,
  .log-row.nothing .log-pts {
    color: var(--muted);
    font-weight: 600;
  }
  .out-of {
    opacity: 0.6;
    font-weight: 600;
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
    transition:
      background-color 0.15s ease,
      opacity 0.15s ease;
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
  .chore.skipped .chore-note {
    color: var(--muted);
    font-weight: 600;
  }
  .pts-flash {
    margin-left: auto;
    flex: none;
    font-size: 17px;
    font-weight: 800;
    color: var(--ok);
    animation: pts-rise 2.6s ease-out forwards;
  }
  @keyframes pts-rise {
    0% {
      opacity: 0;
      transform: translateY(6px) scale(0.9);
    }
    12% {
      opacity: 1;
      transform: none;
    }
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-6px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .pts-flash {
      animation: none;
    }
  }
  .score {
    flex: none;
    font-size: 12.5px;
    line-height: 18px;
    font-weight: 700;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .score.lead {
    padding: 0 6px;
    border-radius: 999px;
    color: #7a4b00;
    background: linear-gradient(135deg, #fff3c4, #f7d774);
    box-shadow: 0 0 0 1px rgba(183, 121, 31, 0.35);
  }
  /* The kid leading on points: a gold name, a gold ring and a little crown. */
  .leader .name {
    background: linear-gradient(100deg, #a8660a 0%, #e0a91c 35%, #fff1a8 50%, #e0a91c 65%, #a8660a 100%);
    background-size: 250% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    background-position: 100% 0;
    /* Its own layer: each frame of the shine redraws just the name, not the board around it. */
    will-change: transform;
  }
  .leader .avatar {
    position: relative;
    overflow: visible;
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px #e0a91c,
      0 0 10px rgba(224, 169, 28, 0.55);
  }
  .leader .avatar::after {
    content: "👑";
    position: absolute;
    top: -13px;
    right: -9px;
    font-size: 15px;
    line-height: 1;
    transform: rotate(18deg);
  }
  /* The rides board's heads sit at the very top of the scroller: keep the crown inside. */
  .col-head.leader .avatar::after {
    top: -9px;
    right: -11px;
  }
  /* The shine sweeps across every 6 s (board.ts runs it). Between sweeps nothing moves, so the
     screen isn't redrawn 60 times a second for a name that's standing still. */
  @media (prefers-reduced-motion: reduce) {
    .leader .name {
      background-position: 50% 0;
    }
  }
  .points-input {
    max-width: 120px;
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
  .week-points {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 14px;
    padding: 10px 14px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--surface);
  }
  .week-points-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--muted);
    margin-right: 4px;
  }
  .week-kid {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 650;
  }
  .week-kid .avatar {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  .week-kid strong {
    font-variant-numeric: tabular-nums;
    color: var(--c);
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
  .ed-for {
    flex-wrap: wrap;
  }
  /* The driver picks stay quiet (outlined, not a solid black block) so the kids lead the eye. */
  .ride-box > .choices .choice {
    min-height: 40px;
    font-weight: 600;
    color: var(--ink-2);
  }
  .ride-box > .choices .choice[aria-pressed="true"] {
    background: var(--control);
    border-color: var(--ink);
    box-shadow: inset 0 0 0 1px var(--ink);
    color: var(--ink);
    font-weight: 800;
  }
  /* A kid picked to ride along is filled in their own color. */
  .field-sub .who-chip[aria-pressed="true"] {
    background: var(--c);
    color: #fff;
  }
  .field-sub .who-chip[aria-pressed="true"] .avatar {
    background: #fff;
    color: var(--c);
  }
  /* Riders: the same colored chips as everywhere else, a size down to fit the driver box. */
  .field-sub .who-chip {
    min-height: 40px;
    padding: 0 12px 0 4px;
    gap: 6px;
    font-size: 14px;
  }
  .field-sub .who-chip .avatar {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }
  /* Who the event is for, in their colors, so the kids stand out as much as the drivers. */
  .for-who {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 12px 3px 3px;
    border-radius: 16px;
    background: rgba(var(--rgb), 0.14);
    box-shadow: inset 0 0 0 1px rgba(var(--rgb), 0.5);
    color: var(--ink);
    font-size: 15px;
    font-weight: 800;
  }
  .for-who .avatar {
    width: 26px;
    height: 26px;
    font-size: 12px;
  }
  .for-guess {
    font-size: 12px;
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
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      var(--surface) 12px
    );
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
    transition:
      background-color 0.15s ease,
      opacity 0.15s ease;
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
    background: repeating-linear-gradient(
      135deg,
      var(--line-2) 0 6px,
      var(--surface-2) 6px 12px
    );
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
    box-shadow:
      0 10px 30px rgba(28, 30, 34, 0.18),
      0 2px 6px rgba(28, 30, 34, 0.08);
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
`;function Kl(s,t,e,n,o=14){let i=s.top-o-8,r=e.h-s.bottom-o-8,a=t.h<=i,l=t.h<=r,c=n?a||!l&&i>r:!l&&(a||i>r),u=c?s.top-o-t.h:s.bottom+o,d=Math.max(8,Math.min(u,e.h-8-t.h)),g=Math.max(8,Math.min(s.x-t.w/2,e.w-8-t.w));return{left:Math.round(g),top:Math.round(d),above:c}}function Qt(s,t){for(let e of s.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var jn=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?Qt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=Qt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let i=this.press;!i||i.el!==e||!e.isConnected||(i.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&Qt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=Qt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&Qt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let i=t.dataset.note;if(!i)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=i,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let a={w:r.offsetWidth,h:r.offsetHeight},l={w:window.innerWidth,h:window.innerHeight},c=Kl(e,a,l,n,o);r.style.left=`${c.left}px`,r.style.top=`${c.top}px`,r.classList.toggle("above",c.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};(()=>{if(typeof document>"u")return;let s=null,t=new Map;So((e,n)=>{let o=`${n}|${e}`,i=t.get(o);if(i!==void 0)return i;if(!s){if(!document.body)return null;s=document.createElement("span"),s.setAttribute("aria-hidden","true"),s.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;white-space:pre;letter-spacing:normal;word-spacing:normal;text-transform:none;contain:layout style",document.body.appendChild(s)}return s.style.font=n,s.style.font?(s.style.fontVariantNumeric="tabular-nums",s.textContent=e,i=s.getBoundingClientRect().width,t.size>2e4&&t.clear(),t.set(o,i),i):null})})();var $d=6e3,Td=1800,qr="mydashlight.rides.view",Ed=1100,_d=440,Cd=700,Pd=3*6e4,zr=1200,Sd=450,Md=110;function Ad(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var qn=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Hr=re`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,Ld=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9z"/></svg>`,Ur=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Dd=new URL("emoji.json",import.meta.url).href,Fr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Wr=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Kr=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Rd=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Id=re`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,tn={bring:"Bring",buy:"Buy"};function Od(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function Ee(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function li(s){return fn(s)}function Bd(s,t){return Cs(s,t)||Le(s).split(",")[0]}function Nd(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function jd(){try{return localStorage.getItem(qr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function zd(s){try{localStorage.setItem(qr,s)}catch{}}function Yn(s,t){return ae(s).includes(t)?ue(s,t):be(s,t)}function Hd(s,t){if(t.driver==="none")return{driver:"none",riders:[],backRiders:[]};let e=Yr(s,t),n=l=>(l??[]).filter(c=>t.people.includes(c)&&c!==e),o=n(t.ownWay),i=n(t.ownBack),r=t.people.find(l=>ae(s).includes(l));if(!e||e===r&&!o.length&&!i.length)return{driver:"",riders:[],backRiders:[]};let a=l=>t.people.filter(c=>c!==e&&!l.includes(c));return{driver:e,riders:a(o),backRiders:a(i)}}function Yr(s,t){if(t.driver==="none")return null;let e=ae(s).filter(o=>t.people.includes(o)),n=t.people.filter(o=>e.includes(o));return t.driver&&n.includes(t.driver)?t.driver:n[0]??null}function nn(s){return s.days.every(t=>!t.events.length)}var sn=class extends Se{constructor(){super();this.flipUntil=0;this.stopWatching=null;this.resize=null;this.clockTimer=null;this.shineTimer=null;this.idleTimer=null;this.toastTimer=null;this.toastUndo=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=ct(location.search).view;this.urlPage=ct(location.search).page;this.urlPast=ct(location.search).past;this.urlDayPicker=ct(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,i=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(i)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-i,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Pd))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.problemOpen=!1,this.mode=this.urlView??jd(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.pointsFlash=new Map,this.manage=!1,this.totals=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.shineTimer=setInterval(()=>this.shineLeaders(),$d),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new jn(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.shineTimer&&clearInterval(this.shineTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,i]of this.lunchDraft){let[r,a]=o.split("|"),l=e.kids.find(c=>c.id===r);(!l||(l.picks[a]??null)===i||!Jt(l,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores){let i=n.get(o.id);i===void 0||!Gr(o,i)||(n.delete(o.id),i===!0&&o.earned&&this.flashPoints(o.id,o.earned))}for(let o of n.keys())e.chores.some(i=>i.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Do(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}shineLeaders(){if(!(document.hidden||matchMedia("(prefers-reduced-motion: reduce)").matches))for(let e of this.renderRoot.querySelectorAll(".leader .name"))e.animate?.([{backgroundPosition:"100% 0"},{backgroundPosition:"0 0"}],{duration:Td,easing:"ease-in-out"})}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Ed)return!1;let e=this.plan;return!e||this.width-_d>=$s(we(e).length,ae(e).length)}today(){return Ot(this.plan?.time_zone??Ad())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:ir(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let i=this.board,r=this.boardPlan;this.board=Lo(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,i&&r&&this.keepPlace(i,r,e)}return this.board}keepPlace(e,n,o){let i=this.scroller;if(!i||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||i.scrollTop<=0)return;let r=e.dayHeads.find(u=>u.date===this.pinDay)?.h??Vt,a=Es(e,i.scrollTop+r+4),l=n.days[Math.floor(a/1440)]?.date,c=l?o.days.findIndex(u=>u.date===l):-1;c>=0&&(this.keepAt=c*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let i=this.scroller;if(!i||!this.board)return;let r=this.topFor(e,n);Math.abs(i.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?i.scrollTo({top:r,behavior:"smooth"}):i.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,i=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(i,Po(o,e)-To(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let i=this.today();if(e===i.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let l=1/0;if(this.mode==="timeline"){for(let c of a.events)l=Math.min(l,c.arrive_by??c.start);for(let c of Object.values(a.drivers))for(let u of c.outings)u.start!=null&&(l=Math.min(l,u.start))}this.scrollToTime(r*1440+(Number.isFinite(l)?Math.max(0,l-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let l of this.board.dayHeads)l.y<=n+1&&(o=l);this.pinDay!==o.date&&(this.pinDay=o.date);let i=null,r=this.nowSpot(),a=this.today().date;if(r){let l=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),c=l>0?"up":"down";this.board.dayHeads.some(u=>u.date===a)&&o.date!==a?i=`${c}|Today`:this.mode==="timeline"&&Math.abs(l)>e.clientHeight*.6&&(i=`${c}|${o.date===a?"Now":"Today"}`)}this.away!==i&&(this.away=i)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.totals=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(!this.choreDone(e)&&!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n,o){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=o!==void 0||!this.choreDone(e),r=new Map(this.choreDraft);r.set(e.id,o??i),this.choreDraft=r;try{await this.backend.setChoreDone(e.id,i,n&&n!==e.kid?n:void 0,o)}catch(a){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let c=a instanceof oe?a:new oe("error",String(a));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}flashPoints(e,n){this.pointsFlash=new Map(this.pointsFlash).set(e,n),window.setTimeout(()=>{if(this.pointsFlash.get(e)!==n)return;let o=new Map(this.pointsFlash);o.delete(e),this.pointsFlash=o},2600)}renderScore(e,n=!1){let o=this.chores?.points,i=o?.scores[e];if(!o||i===void 0)return $;let r=o.leaders.includes(e),a=We(i),l=n?o.possible?.[e]:void 0,c=`${a} ${i===1?"point":"points"}${l!==void 0?` out of ${We(l)}`:""} in the last ${o.days} days${r?", the most":""}`;return f`<span class="score ${r?"lead":""}" role="img" aria-label=${c} title=${c}
      >${r?"★ ":""}${a}${l!==void 0?f`<span class="out-of">/${We(l)}</span>`:$}</span
    >`}choreDone(e){let n=this.choreDraft.get(e.id);return n===void 0?$t(e):n!==!1}editMenu(e,n){let o=this.lunch?.kids??[],i=_t(e,n),r=o.filter(a=>a.id===e.id||i&&_t(a,n)?.dish===i.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:i?.dish??"",details:i?.details??"",kids:r,had:!!i,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let i=o instanceof oe?o:new oe("error",String(o));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let i=new Map(this.lunchDraft);for(let r of n)i.set(On(e,r),o);this.lunchDraft=i;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let c of n)a.delete(On(e,c));this.lunchDraft=a;let l=r instanceof oe?r:new oe("error",String(r));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Vo(e):Go(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(jr(),Nr))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Rs(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(qo(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof oe?n:new oe("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof oe?n:new oe("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(i=>i.date===this.pinDay)?.h??Vt;this.keepAt=n&&this.board?Es(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||zd(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),i=this.plan;if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...we(i),...ae(i)]);this.forPick={day:e,id:n,placed:!1,label:`${U(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}openStayPick(e,n){let o=this.plan,i=o?.days.find(l=>l.date===e)?.all_day?.find(l=>l.id===n);if(!o||!i)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([...we(o),...ae(o)]),a=l=>i.driver&&i.driver!=="none"?i.people.filter(c=>r.has(c)&&c!==i.driver&&!(l??[]).includes(c)):[];this.forPick={day:e,id:n,placed:!1,label:`🏨 ${i.title}`,recurring:!1,word:null,fromNotes:!!i.from_notes,people:i.people.filter(l=>r.has(l)),scope:"this",busy:!1,stay:!0,timed:!!i.timed,driver:i.driver==="none"||ae(o).includes(i.driver??"")?i.driver??"":"",ownWay:a(i.riders),ownBack:a(i.back_riders??i.riders),noAddress:!!i.no_address,maybe:!i.stay}}changeForPick(e,n,o){let i=e.who?.[o.event_id],r=i?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${U(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!i?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e="save"){let n=this.forPick,o=this.plan,i=this.backend;if(!n||!o||!i||e==="save"&&!n.people.length)return;let r=e==="clear"?[]:n.people;this.forPick={...n,busy:!0};try{e==="notStay"?await i.setPeople(n.id,null,"this",void 0,!1):await i.setPeople(n.id,r,n.scope,n.stay&&n.timed&&e==="save"?Hd(o,n):void 0,n.maybe&&e==="save"?!0:void 0),this.forPick=null;let a=n.label.replace(/^\S+ /,""),l=r.map(u=>Yn(o,u)),c=ae(o).filter(u=>r.includes(u));this.showToast(e==="notStay"?`Saved. ${a} isn’t a stay now.`:e==="clear"?`Saved. ${a} goes by the names in its title again.`:n.stay?`Saved. ${kt(c.map(u=>ue(o,u)))}’s rides start from ${a} now.`:`Saved. ${a} is in ${kt(l)}’s ${l.length>1?"lanes":"lane"} now.`,e==="notStay"?()=>void i.setPeople(n.id,null,"this",void 0,null).catch(u=>this.showToast(`Couldn’t undo that. ${String(u)}`)):null)}catch(a){this.forPick&&(this.forPick={...this.forPick,busy:!1});let l=a instanceof oe?a:new oe("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}renderForPick(e){let n=this.plan,o=e.stay?n?.days.some(S=>S.date===e.day&&S.all_day?.some(N=>N.id===e.id&&(N.stay||N.can_stay))):e.placed?n?.days.some(S=>S.date===e.day&&S.events.some(N=>N.id===e.id)):!!this.findUnplaced(e.day,e.id),i=e.stay?"Who’s staying?":"Who is this for?",r=f`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return f`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">${i}</span></div>
          ${r}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let a=e.busy,l=S=>{this.forPick&&(this.forPick={...this.forPick,...S})},c=S=>l({people:e.people.includes(S)?e.people.filter(N=>N!==S):[...e.people,S]}),u=ve(n),d=we(n),g=d.length>1&&d.every(S=>e.people.includes(S)),v=[...d,...ae(n)].filter(S=>e.people.includes(S)),b=v.map(S=>Yn(n,S)),w=!!e.stay&&!v.some(S=>ae(n).includes(S)),E=b.length<2?b.join(""):`${b.slice(0,-1).join(", ")} & ${b[b.length-1]}`,m=(S,N,K,se)=>f`<button
      type="button"
      class="who-chip"
      style="--c:${K.color};--rgb:${K.rgb}"
      aria-pressed=${e.people.includes(S)?"true":"false"}
      ?disabled=${a}
      @click=${()=>c(S)}
    >
      <span class="avatar ${se?"driver":""}" aria-hidden="true">${Ee(N)}</span>${N}
    </button>`;return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${i}</span>
          <span class="ed-meta">${Le(e.day)} · ${e.label}</span>
        </div>
        ${r}
      </div>
      ${e.word?f`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:!e.stay&&!e.fromNotes&&e.people.length?f`<p class="field-hint">Guessed from the names at the start of the title.</p>`:$}
      ${e.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${a} @click=${()=>l({scope:"this"})}>
                Just ${xe(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${a} @click=${()=>l({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:$}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${d.map(S=>m(S,be(n,S),u.get(S)??ce(0),!1))}
        </div>
        ${d.length>1?f`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${g?"true":"false"}
              ?disabled=${a}
              @click=${()=>l({people:g?e.people.filter(S=>!d.includes(S)):[...d,...e.people.filter(S=>!d.includes(S))]})}
            >
              All the kids
            </button>`:$}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${ae(n).map(S=>m(S,ue(n,S),Fe,!0))}
        </div>
      </div>
      ${e.stay&&e.timed&&!w?this.renderStayDrive(n,e,l):$}
      <p class="field-hint">
        ${e.stay?f`${e.timed?f`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} while they’re there. Pick the kids
                  going too, so they’re in the car on the drive.`:f`Rides for the parents you pick start and end at ${e.label.replace(/^\S+ /,"")} on every day of the stay. The kids
                  go wherever their driver goes, so picking just the parents is enough.`}${v.length?f` Saved in the event’s notes as <strong>For: ${E}</strong>.`:$}`:v.length?f`Saved in the event’s notes as <strong>For: ${E}</strong>, so its title stays as it is. It shows in ${v.length>1?"their lanes":`${b[0]}’s lane`}${v.some(S=>d.includes(S))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?f`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>void this.saveForPick("clear")}>
            Go by the names in the title instead
          </button>`:$}
      ${e.stay&&!e.maybe?f`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>void this.saveForPick("notStay")}>Not a stay</button>`:$}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!v.length||w} @click=${()=>void this.saveForPick()}>
          ${a?"Saving to Google Calendar…":w?"Pick a parent too":v.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderStayDrive(e,n,o){let i=n.people.filter(d=>ae(e).includes(d)),r=Yr(e,n),a=n.people.filter(d=>d!==r),l=ve(e),c=we(e),u=(d,g)=>{let h=n[g]??[],v=!c.includes(d),b=v?Fe:l.get(d)??ce(0),w=Yn(e,d);return f`<button
        type="button"
        class="who-chip"
        style="--c:${b.color};--rgb:${b.rgb}"
        aria-pressed=${h.includes(d)?"false":"true"}
        ?disabled=${n.busy}
        @click=${()=>o({[g]:h.includes(d)?h.filter(E=>E!==d):[...h,d]})}
      >
        <span class="avatar ${v?"driver":""}" aria-hidden="true">${Ee(w)}</span>${w}
      </button>`};return f`<div class="field">
        <span class="field-label">Drives there and back</span>
        <div role="group" aria-label="Who drives there and back" class="choices" style="grid-template-columns:repeat(${i.length+1},1fr)">
          ${i.map(d=>f`<button type="button" class="choice" aria-pressed=${r===d?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:d})}>
              ${ue(e,d)}
            </button>`)}
          <button type="button" class="choice" aria-pressed=${r===null?"true":"false"} ?disabled=${n.busy} @click=${()=>o({driver:"none"})}>
            No drive
          </button>
        </div>
      </div>
      ${r&&a.length?f`<div class="field">
              <span class="field-label">In the car there with ${ue(e,r)}</span>
              <div role="group" aria-label="Who rides there" class="who-chips">${a.map(d=>u(d,"ownWay"))}</div>
            </div>
            <div class="field">
              <span class="field-label">In the car back home</span>
              <div role="group" aria-label="Who rides back" class="who-chips">${a.map(d=>u(d,"ownBack"))}</div>
              <p class="field-hint">Anyone not in the car makes their own way, and the hotel is home for them while it lasts.</p>
            </div>`:$}
      ${n.noAddress?f`<p class="field-hint">Add the hotel’s address to the event for exact drive times.</p>`:$}`}renderForLine(e,n,o){let i=e.who?.[o.event_id];if(!i)return $;let r=ve(e);return f`<span class="ed-for"
      >${i.people.map(a=>{let l=r.get(a)??Fe,c=Yn(e,a);return f`<span class="for-who" style="--c:${l.color};--rgb:${l.rgb}"
          ><span class="avatar ${r.has(a)?"":"driver"}" aria-hidden="true">${Ee(c)}</span>${c}</span
        >`})}${i.from_notes?"":f`<span class="for-guess">from the title</span>`}<button
        type="button"
        class="ed-for-change"
        @click=${()=>this.changeForPick(e,n,o)}
      >
        Change
      </button></span
    >`}findEvent(e){let n=this.plan?.days.find(i=>i.date===e.day),o=n?.events.find(i=>i.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1},n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0,this.timesOpen={arrive:!1,leave:!1}}showToast(e,n=null){this.toast=e,this.toastUndo=n,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null,this.toastUndo=null},n?1e4:7e3)}undoToast(){let e=this.toastUndo;this.toast=null,this.toastUndo=null,this.toastTimer&&clearTimeout(this.toastTimer),e?.()}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(i){let r=i instanceof oe?i:new oe("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,i){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&i.includes(e.drop)){i.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend,i=this.plan,r=!n&&i?_o(i,e):null;if(r&&i){let a=qt(i,e),l=i.who?.[e.event_id]?.people??[],c=this.findAnyCopy(e,r);this.save("attending",n,async()=>{await o.setPeople(e.id,r,"this"),this.closeEditor(),this.showToast(`Saved. ${a} is off ${e.title} now.`,c?()=>void this.save("attending",!0,()=>o.setPeople(c,l,"this")):null)});return}this.save("attending",n,()=>o.setAttending(e.id,n,"this"))}findAnyCopy(e,n){return this.plan?.days.find(r=>r.events.some(a=>a.id===e.id))?.events.find(r=>r.event_id===e.event_id&&r.id!==e.id&&n.includes(r.own??r.kid))?.id??null}toggleStay(e,n,o){if(!this.backend)return;let i=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>i.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>i.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let i=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(l=>l!==n):[...r,n];this.save(`along-${o}`,a,()=>i.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let i=((this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by)??e.start)+n;this.arriveDraft=i===e.start?null:i,this.timesOpen={...this.timesOpen,arrive:!0},this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),zr)}clearArrive(){this.arriveDraft=null,this.timesOpen={...this.timesOpen,arrive:!1},this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>i.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,i=Math.max(e.start+5,(o??e.end)+n);this.leaveDraft=i===e.end?null:i,this.timesOpen={...this.timesOpen,leave:!0},this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),zr)}clearLeave(){this.leaveDraft=null,this.timesOpen={...this.timesOpen,leave:!1},this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let i=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>i.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,Md)},Sd)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),i=o?Ro(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?Ko(this.chores,this.today().minutes).filter(g=>!this.choreDone(g)):[],l=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?this.choreDone(this.whoFor)?"Done chore":"Who did it":this.sel?"Change this ride":"Needs attention",u=f`<aside class="panel" aria-label=${c}>
      ${l??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,d=this.page==="rides";return f`
      <div class="app ${r?"wide":this.width<Cd?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${d?this.renderBanner(e):$}
          <main>
            ${d?f`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?nn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!nn(o)?this.renderDayRail(o):$}
                  ${n&&this.away?this.renderBackToToday(this.away):$}
                </section>`:this.page==="lunch"?f`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${u}`:$}
          </main>
        </div>
        ${r?u:$}
        ${this.toast?f`<div class="toast" role="status">
              ${this.toast}${this.toastUndo?f`<button type="button" class="toast-undo" @click=${()=>this.undoToast()}>Undo</button>`:$}
            </div>`:$}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let i=n.problems+o;this.tick;let r=this.today(),a="",l=null;if(e){let h=e.time_zone,v=`Plan from ${ns(new Date(e.updated),new Date,h)}`;if(this.error){let b=["connection_lost","timeout","not_running"].includes(this.error.code);l={short:Ni(this.error),detail:b?null:this.error.message,age:v}}else e.status&&!e.status.ok?l={...ji(e.status.error),age:v}:this.backend?.live||(a=`Updated ${ns(new Date(e.updated),new Date,h)}`)}let c=(h,v,b,w)=>f`
      <button type="button" class="seg-btn" title=${w} aria-pressed=${this.mode===h?"true":"false"} @click=${()=>this.setMode(h)}>
        ${b}<span class="seg-label">${v}</span>
      </button>
    `,u=(h,v,b)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===h?"true":"false"} @click=${()=>this.setPage(h)}>
        ${b}<span class="seg-label">${v}</span>
      </button>
    `,d=je(r.minutes),g=!!e&&nn(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${re`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:$}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Le(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Le(r.date)}${a?f`<span class="status"> · ${a}</span>`:$}
          </p>
        </div>
        ${e&&!g?this.renderNext(e,Oo(e,r),n):$}
        <div class="controls">
          ${this.wide||g&&!o?$:f`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?$:f`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",re`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",re`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${u("rides","Rides",re`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${u("chores","Chores",re`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?$:u("lunch","Lunch",re`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
      ${l?this.renderProblem(l):$}
    `}renderProblem(e){let n=f`<span class="problem-what">${e.short}</span><span class="problem-age"> · ${e.age}</span>`;if(!e.detail)return f`<p class="problem-row" role="status">${n}</p>`;let o=this.problemOpen;return f`<button
      type="button"
      class="problem-row ${o?"open":""}"
      role="status"
      title=${e.detail}
      aria-expanded=${o?"true":"false"}
      @click=${()=>this.problemOpen=!o}
    >
      ${n}${o?f`<span class="problem-detail">${e.detail}</span>`:f`<span class="problem-more"> · <span class="problem-link">Details</span></span>`}
    </button>`}renderNext(e,n,o){if(!n){let c=this.today().date,u=o.unassigned,d=o.laterUnassigned;if(u){let h=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${u} ${u===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?f`<div class="next idle needs">${h}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${h}</button>`}if(d)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${d} ${d===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let g=e.days.some(h=>h.date>=c&&h.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${g?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${g?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let i;n.ongoing?i="On the road now":n.ahead===0?i=n.inMinutes<180?`Next trip · in ${bt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${xe(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=f`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Ee(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(c=>f`<span class="kid-dot" style="background:${c.color}"></span>`)}</span>
        ${n.warn?f`<span class="next-stop warn">${n.warn}</span>`:n.stop?f`<span class="next-stop">${n.stop}</span>`:$}
      </span>
    `,l=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?f`<button type="button" class=${l} @click=${()=>this.open(n.target)}>${a}</button>`:f`<div class=${l}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return $;let n=this.today().date,o=ve(e),i=this.railShown;return f`<div
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
        ${e.days.map(r=>{let a=_s(r),l=r.events.length,c=r.events.slice(0,4).map(d=>d.own?Fe.color:o.get(d.kid)?.color??ce(0).color),u=`${Le(r.date)}: ${l?`${l} ${l===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return f`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${u}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":xe(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${c.length?c.map(d=>f`<span class="rd-dot" style="background:${d}"></span>`):f`<span class="rd-free">free</span>`}
            </span>
            ${a?f`<span class="rd-badge" aria-hidden="true">${a}</span>`:$}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return f`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${re`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=we(e),o=ae(e),i=ve(e),r=n.map(a=>be(e,a));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,l)=>re`<circle cx=${50+l*30} cy="80" r="11" fill=${i.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Nd(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let l=i.get(a);return f`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${Ee(be(e,a))}</span>
            <span class="qw-name">${be(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Ee(ue(e,a))}</span>
            <span class="qw-name">${ue(e,a)}</span>
            <span class="qw-sub">No trips</span>
          </div>`)}
      </div>
      <ol class="qw-steps">
        <li>
          <span class="qw-num">1</span>
          <span><strong>Add it to the family calendar</strong>Start the title with who it’s for, and put the address in the event’s location so drive times come out right.</span>
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
    </div>`:$}renderEmpty(){return this.error?f`<div class="empty-state">
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
          <span class="label">${e.label}</span>${e.tag?f`<span class="tag">${e.tag}</span>`:$}
        </button>
        <span class="sub ${e.warn?"warn":""}">${e.sub}</span>
        ${e.inline?f`<div class="dh-chips">${e.allDay.slice(0,e.inline).map(o=>this.renderStripChip(e,o,n))}</div>`:$}
      </div>
      ${e.allDay.length>e.inline?f`<div class="day-strip" style="padding-left:${wt}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:$}`}renderStripChip(e,n,o){let i=f`<span class="strip-title">${n.title}</span>${n.note?f`<span class="strip-note">${n.note}</span>`:$}${n.notes?Hr:$}`,r=n.pick,a=n.stay??n.canStay;return a?f`<button
        type="button"
        class="strip-chip ${n.stay?"hotel":"maybe"} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
        style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
        tabindex=${o?-1:0}
        data-note=${n.notes||$}
        aria-label=${`${n.title}: ${n.note}. ${n.stay?"Pick who’s staying":"Staying here? Pick who"}`}
        @click=${()=>this.openStayPick(e.date,a)}
      >
        ${i}
      </button>`:r?f`<button
          type="button"
          class="strip-chip warn plain pick"
          tabindex=${o?-1:0}
          data-note=${n.notes||$}
          aria-label=${`${n.title}: ${n.note} Pick who it’s for`}
          @click=${()=>this.openForPick(e.date,r)}
        >
          ${i}
        </button>`:f`<span
          class="strip-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
          style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
          tabindex=${n.notes&&!o?0:$}
          data-note=${n.notes||$}
          >${i}</span
        >`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,i=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(h=>!h.own&&h.event_id===o.event.event_id).map(h=>h.id):[]),r=h=>!!h&&!!n&&h.day===n.day&&i.has(h.event),a=e.dayHeads.find(h=>h.date===this.pinDay)??e.dayHeads[0],l=e.width,c=e.dayHeads[e.dayHeads.length-1],u=Math.max(e.height+8,192),d=100,g=[...e.links.map(h=>({t:"link",x:h,z:h.layer??0})),...e.preps.map(h=>({t:"prep",x:h,z:h.layer??d-1})),...e.cards.map(h=>({t:"card",x:h,z:h.layer??d})),...e.rides.map(h=>({t:"ride",x:h,z:h.layer??d+1}))].sort((h,v)=>h.z-v.z);return f`
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
          ${e.columns.map(h=>f`<div class="col-head ${h.kind} ${js(this.chores,h.id)?"leader":""}" style="left:${h.x}px;width:${h.w}px;--c:${h.dot};--rgb:${h.rgb}">
              <span class="avatar ${h.kind}" aria-hidden="true">${Ee(h.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${h.name}</span>${this.renderScore(h.id)}</span>
                <span class="sub-row"
                  ><span class="sub ${h.subWarn?"warn":""}">${h.sub}</span>${h.kind==="kid"?this.renderLunchChip(h.id,!0):$}</span
                >
              </span>
            </div>`)}
        </div>
        ${a?f`<div class="pinned" aria-hidden="true" style="width:${l}px;height:${a.h}px;margin-bottom:${-a.h}px">
              ${this.renderHead(a,!0)}
            </div>`:$}
        <div class="canvas" style="width:${l}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(h=>f`<div
                class="col-bg ${h.kind}"
                style="left:${h.x}px;width:${h.w}px;height:${u}px;--rgb:${h.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${u}px"></span>
          ${c?f`<span class="empty board-end" style="top:${u+14}px">That’s everything through ${c.label}.</span>`:$}
          ${e.dayHeads.map(h=>f`<div class="day-head" style="top:${h.y}px;width:${l}px;height:${h.h}px">${this.renderHead(h)}</div>`)}
          ${e.empties.map(h=>f`<span class="empty" style="top:${h.y}px">${h.text}</span>`)}
          ${e.grid.map(h=>f`<div class="grid ${h.strong?"strong":""}" style="top:${h.y}px;width:${l-60}px"></div>`)}
          ${e.hours.map(h=>f`<span class="hour" style="top:${h.y}px">${h.label}</span>`)}
          ${Ie(e.bands,h=>h.key,h=>f`<div
                class="band"
                aria-hidden="true"
                style="left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px;background:rgba(${h.color.rgb},0.10);border-color:rgba(${h.color.rgb},0.45)"
              ></div>`)}
          ${Ie(e.busy,h=>h.key,h=>f`<div class="busy" style="left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px">
                <span style="top:${h.labelY}px">${h.label}</span>
              </div>`)}
          ${Ie(e.windows,h=>h.key,h=>f`<div class="window" aria-hidden="true" style="left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px">
                <span>${h.label}</span>
              </div>`)}
          ${Ie(g,h=>h.x.key,h=>{if(h.t==="link"){let E=h.x;return f`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${E.x}px;top:${E.y}px;width:${E.w}px;height:${E.h}px;border-color:${E.color.color};background:linear-gradient(rgba(${E.color.rgb},0.11), rgba(${E.color.rgb},0.11)), var(--surface)"
                ></div>`}if(h.t==="prep"){let E=h.x;return f`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${E.x}px;top:${E.y}px;width:${E.w}px;height:${E.h}px;border-color:${E.color.color};background:linear-gradient(rgba(${E.color.rgb},0.11), rgba(${E.color.rgb},0.11)), var(--surface);color:${E.color.ink}"
                >
                  ${E.label}
                </div>`}if(h.t==="ride"){let E=h.x;return f`<button
                  type="button"
                  class="ride ${E.dashed?"dashed":""} ${E.clash?"clash":""} ${E.h>=120?"tall":""}"
                  aria-label=${E.aria}
                  style="left:${E.x}px;top:${E.y}px;width:${E.w}px;height:${E.h}px;padding-top:${3+(E.tuckTop??0)}px;padding-bottom:${3+(E.tuckBottom??0)}px"
                  @click=${()=>this.open(E.target)}
                >
                  <span class="l1">${E.l1}</span>${E.show2?f`<span class="l2" style="-webkit-line-clamp:${E.lines2}">${E.l2}</span>`:$}
                </button>`}let v=h.x,b=v.color,w=v.skipped?`repeating-linear-gradient(135deg, rgba(${b.rgb},0.10) 0px, rgba(${b.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:v.stayed?`repeating-linear-gradient(135deg, rgba(${b.rgb},0.24) 0px, rgba(${b.rgb},0.24) 6px, rgba(${b.rgb},0.08) 6px, rgba(${b.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${b.rgb},0.15), rgba(${b.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${v.wrap?"wrap":""} ${r(v.target)?"sel":""} ${v.clash?"clash":""} ${v.skipped?"skipped":""} ${v.cut?"cut":""} ${v.event.notes?"noted":""}"
                aria-label=${v.aria}
                data-note=${v.event.notes||$}
                style="left:${v.x}px;top:${v.y}px;width:${v.w}px;height:${v.h}px;background:${w};border-color:${v.clash?"var(--bad)":`rgba(${b.rgb},0.45)`};--c:${b.color};--rgb:${b.rgb};--ring:${b.color}"
                @click=${()=>this.open(v.target)}
              >
                ${v.event.notes?Hr:$}
                <span class="top">
                  <span class="title">${v.title}</span>
                  <span class="time">${v.time}${v.inline&&v.drop?f`<span class="line tone-${v.drop.tone} inline"> · ${v.drop.text}</span>`:$}</span>
                  ${v.showDrop&&v.drop&&!v.inline?f`<span class="line tone-${v.drop.tone}">${v.drop.text}</span>`:$}
                </span>
                ${v.showPick&&v.pick?f`<span class="line tone-${v.pick.tone}">${v.pick.text}</span>`:$}
              </button>`})}
          ${Ie(e.stays,h=>h.key,h=>f`<button
                type="button"
                class="stay ${h.cut?"cut":""}"
                style="left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px;border-color:${h.color.color};background:repeating-linear-gradient(135deg, rgba(${h.color.rgb},0.28) 0px, rgba(${h.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(h.target)}
              >
                <span class="l1" style="color:${h.color.ink}">${h.l1}</span><span class="l2">${h.l2}</span>
              </button>`)}
          ${Ie(e.trips,h=>h.key,h=>f`<button
                type="button"
                class="trip ${h.bad?"bad":""} ${h.stops?"list":""} ${h.h>=120?"tall":""}"
                aria-label=${h.aria}
                style="left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px"
                @click=${()=>this.open(h.target)}
              >
                <span class="l1">${h.l1}${h.kids.map(v=>f`<span class="kid-dot" style="background:${v}"></span>`)}</span>
                ${h.show2?f`<span class="l2">${h.l2}</span>`:$}
                ${h.stops?h.stops.map(v=>f`<span class="stop ${v.warn?"warn":""}">${v.text}</span>`):$}
                ${h.show3?f`<span class="l3">${h.l3}</span>`:$}
              </button>`)}
          ${Ie(e.overlaps,h=>h.key,h=>f`<div class="overlap" aria-hidden="true" style="left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px"></div>`)}
          ${Ie(e.marks,h=>h.key,h=>f`<span class="mark" style="left:${h.x}px;top:${h.y}px;${h.right?"transform:translateX(-100%)":""}">${h.text}</span>`)}
          ${Ie(e.folds,h=>h.key,h=>f`<div class="fold" style="top:${h.y}px;width:${l-60}px;height:${h.h}px" aria-hidden="true">
                ${Ud(l-60,h.h)}
              </div>
              <span class="fold-label" style="top:${h.y+h.h/2-9}px" title="${je(h.from)} to ${je(h.to)}">${h.label}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${l-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:$}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:i,later:r}=e,a=this.plan,l=i+n.length,c=this.chores,u=!!c&&!Ls(c);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?$:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${u?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?f`<div class="attn-chores">${n.map(d=>this.renderChoreRow(d,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!i?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${re`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${nn(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:$}
      ${o.map(d=>f`<div class="issue ${d.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${d.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${d.pick?f`<button type="button" class="issue-title" @click=${()=>d.pick&&this.openForPick(d.pick.day,d.pick.id)}>${d.title}</button>`:d.target?f`<button type="button" class="issue-title" @click=${()=>this.open(d.target,!0)}>${d.title}</button>`:f`<strong class="issue-title">${d.title}</strong>`}
              <span class="issue-body"
                >${d.parts?d.parts.map(g=>typeof g=="string"?g:f`<button type="button" class="issue-link" @click=${()=>this.open(g.target,!0)}>${g.text}</button>`):d.body}</span
              >
            </div>
          </div>
          ${d.suggestions.length?f`<div class="fixes">
                ${d.suggestions.map(g=>f`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(g.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${g.id}`?"Saving…":g.label}</span>
                    <span class="fix-note">${g.note}</span>
                  </button>`)}
              </div>`:$}
        </div>`)}
      ${this.wide&&a&&!nn(a)&&this.page==="rides"?this.renderLegend():$}
    `}kidColorOf(e){let n=this.plan?ve(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(i=>i.id===e)??-1;return ce(Math.max(0,o))}renderLunchChip(e,n=!1){let o=this.lunch,i=o?.kids.find(u=>u.id===e);if(!o||!i)return $;this.tick;let r=this.today(),a=sr(i,r.date,r.minutes,this.lunchDraft);if(!a)return $;let l=tn[a.lunch],c=`${l} lunch ${a.when}${a.menu?`: ${a.menu}`:""}`;return f`<span class="lunch-chip ${a.lunch} ${n?"small":""}" title=${c}
      >${a.lunch==="bring"?Wr:Kr}<span class="lunch-chip-text"
        >${l}${n?$:` ${a.when}`}${!n&&a.menu?f`<span class="lunch-chip-menu"> · ${a.menu}</span>`:$}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return f`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Zo(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Be(e.today),i=n.indexOf(o),r=u=>{let d=n[i+u];d&&(this.lunchMonth=d)},a=e.kids.some(u=>u.id===this.lunchKid)?this.lunchKid:null,l=a?e.kids.filter(u=>u.id===a):e.kids,c=e.status&&!e.status.ok?f`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:$;return f`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${i<=0} @click=${()=>r(-1)}>
            ${re`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Nn(o)}</h2>
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
          ${this.menuMode?"Done":f`${Ur} Edit menus`}
        </button>
      </div>
      ${c}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${l.length}">
        ${l.map(u=>this.renderLunchCard(e,u,o,a!==null))}
      </div>
      <p class="message-aside">
        Each day’s lunch is an all-day event on the lunch calendar that starts with the kid’s name, like
        <strong>${e.kids[0]?.name??"Ava"} Lunch: Pizza</strong>, with the rest of the menu in its notes and the Bring
        or Buy pick at the end. Menus can
        come from the school’s menu feed (set in Home Assistant under MyDashLight’s options, Lunch), a calendar file
        imported once a month, or <strong>Edit menus</strong> here.
        Days off come from <strong>No School</strong> all-day events on the family calendar. A day nobody picked gets the kid’s default, set in
        Home Assistant under MyDashLight’s options. For a Pack lunch reminder, add a School days chore set to
        <strong>Only on Bring lunch days</strong>.
      </p>
    </div>`}renderLunchCard(e,n,o,i){let r=this.kidColorOf(n.id),a=er(e,n,o,this.lunchDraft),l=nr(a),c=a.flat(),u=c.filter(b=>!b.outside&&!b.past&&b.lunch),d=n.days_off.filter(b=>Be(b.first)<=o&&o<=Be(b.last)),g=b=>u.filter(w=>Bn(w.date)===b),h=b=>{let w=g(b);if(!w.length)return;let E=w.every(m=>m.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,w.map(m=>m.date),E)},v=u.length?`${l.bring} Bring · ${l.buy} Buy${o===Be(e.today)?" left this month":""}`:"No school days left this month";return f`<section class="chore-col lunch-card ${i?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Ee(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${v}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${tn[n.default]} unless picked</span>
          ${e.kids.length<2?$:f`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${i?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=i?null:n.id}
              >
                ${i?Id:Rd}${i?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?f`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:$}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${Nn(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((b,w)=>f`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!g(w).length}
            aria-label=${`${g(w).every(E=>E.lunch==="bring")?"Buy":"Bring"} every ${b} left in ${Nn(o)} for ${n.name}`}
            @click=${()=>h(w)}
          >
            ${b}
          </button>`)}
        ${c.map(b=>this.renderLunchCell(n,b,i))}
      </div>
      ${d.length?f`<p class="lunch-offs">
            No school:
            ${d.map(b=>{let w=b.first<`${o}-01`?`${o}-01`:b.first,E=Be(b.last)>o?Et(`${zs(o)}-01`,-1):b.last;return`${w===E?li(w):`${li(w)}–${li(E)}`} ${tr(b.title)}`}).join(" · ")}
          </p>`:$}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return f`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return f`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=n.lunch,r=i==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",l=this.menuMode,c=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),u=l?`${e.name}, ${Le(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Le(n.date)}: ${tn[i]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${tn[r]}.`;return f`<button
      type="button"
      class="lunch-day ${i} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${l?"editing":""} ${c?"sel":""}"
      ?disabled=${n.past&&!l}
      aria-label=${u}
      @click=${()=>l?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${i==="bring"?Wr:Kr}${tn[i]}</span>
      ${n.menu?f`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?f`<span class="lunch-sides">${n.sides}</span>`:$}`:l?f`<span class="lunch-menu add">${qn} Menu</span>`:$}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,i=this.choreDone(e),r=o.kids.findIndex(S=>S.id===e.kid),a=(this.plan?ve(this.plan).get(e.kid):void 0)??ce(Math.max(0,r)),l=o.kids[r]?.name??"",c=this.choreDraft.get(e.id),u=c===void 0||Gr(e,c)?e:{...e,state:c===!1?"open":c===!0?"done":c,done_at:c===!1?null:new Date().toISOString()},d=i&&u.done_by&&u.done_by!==e.kid?o.people?.find(S=>S.id===u.done_by)?.name??u.done_by_name??null:null,g=`${In(u,o.today,o.time_zone)}${d?` · by ${d}`:""}`,h=i||Uo(e),v=i?this.pointsFlash.get(e.id):void 0,b=`${n?`${l}: `:""}${e.title}. ${g?`${g}. `:""}${v?`Earned ${We(v)}. `:""}${i?"Done.":"Tap when it’s done."}`,w=f`<span class="box" aria-hidden="true"
        >${i?re`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d=${Tt(u.state)?"M6 12h12":"M5 12.5l4.5 4.5L19 7.5"}/></svg>`:$}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:$}
      <span class="chore-text">
        <span class="chore-title">${n?f`<span class="chore-kid">${l}</span> · `:$}${e.title}</span>
        ${g?f`<span class="chore-note">${g}</span>`:$}
      </span>
      ${v?f`<span class="pts-flash" aria-hidden="true">+${We(v)}</span>`:$}`,E=`chore ${i?"done":""} ${Tt(u.state)?"skipped":""} ${e.state==="overdue"&&!i?"overdue":""} ${h?"":"later"}`,m=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return h?f`<button type="button" class=${E} style=${m} aria-pressed=${i?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${w}
        </button>`:f`<div class=${E} style=${m}>${w}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return f`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return f`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Ls(e))return f`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${qn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?f`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:$;this.tick;let i=Wo(e,this.plan?ve(this.plan):void 0,this.today().minutes);return f`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">${this.totals?`Points from the last ${e.points?.days??7} days, out of what each kid’s own chores were worth.`:"Tap a chore when it’s done."}</span>
        ${e.points?f`<button type="button" class="btn ${this.totals?"dark":""}" aria-pressed=${this.totals?"true":"false"} @click=${()=>{this.closeChorePanels(),this.flipUntil=Date.now()+400,this.totals=!this.totals}}>${this.totals?"Back to chores":f`${Ld} Points this week`}</button>`:$}
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${qn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Ur} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols ${Date.now()<this.flipUntil?"flip":""}" style="--n:${i.length}">
        ${i.map(r=>{let a=r.overdue.filter(l=>!this.choreDone(l)).length+r.now.filter(l=>!this.choreDone(l)).length;return f`<section class="chore-col ${js(e,r.kid)?"leader":""}" style="--c:${r.color.color};--rgb:${r.color.rgb};--k:${r.color.ink}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Ee(r.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${r.name}</span>${this.renderScore(r.kid,this.totals)}</span>
                <span class="sub-row"
                  ><span class="sub">${this.totals?Fd(Ms(e,r.kid).length):a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span
                  >${this.renderLunchChip(r.kid)}</span
                >
              </span>
            </div>
            ${this.totals?this.renderPointsLog(e,r.kid):this.renderChoreList(e,r)}
          </section>`})}
      </div>
    </div>`}renderChoreList(e,n){return f`<div class="chore-list">
            ${n.overdue.length?f`<h3 class="chore-group overdue">Missed</h3>
                  ${n.overdue.map(o=>this.renderChoreRow(o))}`:$}
            ${n.now.length?f`<h3 class="chore-group">To do</h3>
                  ${n.now.map(o=>this.renderChoreRow(o))}`:$}
            ${n.done.length?f`<h3 class="chore-group">Done</h3>
                  ${n.done.map(o=>this.renderChoreRow(o))}`:$}
            ${n.later.map(o=>f`<h3 class="chore-group">${o.date===e.today?"Later today":Bd(o.date,e.today)}</h3>
                ${o.chores.map(i=>this.renderChoreRow(i))}`)}
            ${!n.overdue.length&&!n.now.length&&!n.done.length&&!n.later.length?f`<p class="chore-none">No chores this week.</p>`:$}
          </div>`}renderPointsLog(e,n){let o=Ms(e,n);return f`<div class="points-log">
      ${o.length?o.map(i=>f`<div class="log-row ${i.points?"":"nothing"}">
              ${i.icon?f`<span class="chore-icon" aria-hidden="true">${i.icon}</span>`:f`<span class="chore-icon"></span>`}
              <span class="chore-text">
                <span class="chore-title">${i.title}</span>
                <span class="chore-note">${No(i,e)}</span>
              </span>
              <span class="log-pts">${i.points?`+${We(i.points)}`:"0"}</span>
            </div>`):f`<p class="chore-none">No chores done in the last ${e.points?.days??7} days.</p>`}
    </div>`}renderWeeklyPoints(e){let n=Xo(e.templates,e.kids.map(i=>i.id),e.points?.default??1),o=this.plan?ve(this.plan):void 0;return f`<section class="week-points" aria-label="Points a week">
      <span class="week-points-label">Points available per week</span>
      ${e.kids.map((i,r)=>{let a=o?.get(i.id)??ce(r);return f`<span class="week-kid" style="--c:${a.color};--rgb:${a.rgb}"
          ><span class="avatar" aria-hidden="true">${Ee(i.name)}</span>${i.name} <strong>${We(n[i.id]??0)}</strong></span
        >`})}
    </section>`}renderTemplateRow(e){let n=this.chores,o=n.kids,i=this.plan?ve(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?f`<span class="tmpl-note bad">${e.problems.map(Ns).join(" · ")} · tap to set up</span>`:f`<span class="tmpl-note">${Bs(e.who,o,e.take_turns)} · ${Os(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}${n.points?` · ${Vr(e.points??n.points.default)}`:""}</span>`;return f`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?f` <span class="tag-paused">Paused</span>`:$}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let c=o.findIndex(d=>d.id===l),u=i?.get(l)??ce(Math.max(0,c));return f`<span class="kid-dot" style="background:${u.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return f`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${qn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.points&&e.templates.length?this.renderWeeklyPoints(e):$}
      ${e.templates.length?n.map(([o,i])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?f`<section class="manage-group" aria-label=${i}>
                  <h3 class="chore-group">${i}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:$}):f`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return f``;let o=n.kids,i=this.plan?ve(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(b=>b.id===e.template):void 0,l=Rs(e),c=(a?.problems??[]).filter(b=>b!=="who:"),u=(b,w,E,m=!1)=>f`<button type="button" class="choice ${m?"wide":""}" aria-pressed=${b?"true":"false"} ?disabled=${r} @click=${E}>${w}</button>`,d=(b,w,E,m)=>f`<button type="button" class="chip" aria-pressed=${b?"true":"false"} aria-label=${m??$} ?disabled=${r} @click=${E}>${w}</button>`,g=b=>{b!==e.repeats&&this.changeDraft({repeats:b,days:a&&a.repeats===b?a.days??Xt(b):Xt(b)})},h=b=>{let w=e.who.includes(b)?e.who.filter(E=>E!==b):o.filter(E=>E.id===b||e.who.includes(E.id)).map(E=>E.id);this.changeDraft({who:w})},v;if(e.repeats==="school"){let b=e.days===lt?new Set:e.days===""?new Set([0,1,2,3,4]):Yt(e.days)??new Set,w=E=>{let m=new Set(b);m.has(E)?m.delete(E):m.add(E),this.changeDraft({days:m.size===5?"":m.size?Ds(m):lt})};v=f`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${at.slice(0,5).map((E,m)=>d(b.has(m),E.slice(0,2),()=>w(m),E))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event for the kid on the family calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${u(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${u(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Shows from the evening before each school day. Still on time that morning.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${u(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let b=e.days.trim(),w=/^\d+$/.test(b)?Number(b):null,E=b&&b.toLowerCase()!=="any"&&b.toLowerCase()!=="last"&&w===null;v=f`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${E?4:3}, minmax(0, 1fr))">
          ${u(b===""||b.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${u(w!==null,"On a date",()=>this.changeDraft({days:String(w??1)}))}
          ${u(b.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${E?u(!0,b,()=>{}):$}
        </div>
        ${w!==null?f`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||w<=1} @click=${()=>this.changeDraft({days:String(w-1)})}>−</button>
                <span class="arrive-value">${Is(w)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||w>=31} @click=${()=>this.changeDraft({days:String(w+1)})}>+</button>
              </span>
            </div>`:f`<p class="field-hint">${b.toLowerCase()==="last"?"Due on the month’s last day.":E?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")v=f`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let b=e.days===""||e.days.toLowerCase()==="any",w=e.days===lt?new Set:b?new Set:Yt(e.days)??new Set,E=m=>{let S=new Set(w);S.has(m)?S.delete(m):S.add(m),this.changeDraft({days:S.size?Ds(S)||"Mon-Sun":lt})};v=f`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${u(b,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${u(!b,"On set days",()=>this.changeDraft({days:b?"Sat":e.days}))}
        </div>
        ${b?f`<p class="field-hint">Shows all week, due on Sunday.</p>`:f`<div role="group" aria-label="Days of the week" class="day-chips">
                ${at.map((m,S)=>d(w.has(S),m.slice(0,2),()=>E(S),m))}
              </div>
              <div class="chips">
                ${d(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${d(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:$}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Bs(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===lt?"No days picked":Os(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${c.length?f`<p class="field-hint bad">${c.map(Ns).join(". ")}. Saving fixes it.</p>`:$}
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
          ${Fr.map(b=>d(e.icon===b,b,()=>this.changeDraft({icon:e.icon===b?null:b}),`Picture ${b}`))}
          ${e.icon&&!Fr.includes(e.icon)?d(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):$}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?f`<emoji-picker
              class="emoji-more"
              .dataSource=${Dd}
              @emoji-click=${b=>{let w=b.detail.unicode;w&&this.changeDraft({icon:w}),this.iconMore=!1}}
            ></emoji-picker>`:$}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((b,w)=>{let E=i?.get(b.id)??ce(w),m=e.who.includes(b.id);return f`<button type="button" class="who-chip" style="--c:${E.color};--rgb:${E.rgb}" aria-pressed=${m?"true":"false"} ?disabled=${r} @click=${()=>h(b.id)}>
              <span class="avatar" aria-hidden="true">${Ee(b.name)}</span>${b.name}
            </button>`})}
        </div>
        ${e.who.length>1?f`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${u(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${u(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:$}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${u(e.repeats==="daily","Every day",()=>g("daily"))}
          ${u(e.repeats==="weekly","Every week",()=>g("weekly"))}
          ${u(e.repeats==="monthly","Every month",()=>g("monthly"))}
          ${u(e.repeats==="school","School days",()=>g("school"))}
        </div>
      </div>
      ${v}
      ${e.repeats==="school"?$:f`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${Od(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-points">Points <span class="field-hint">For doing it on time</span></label>
        <input
          id="chore-points"
          class="text-input points-input"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          placeholder=${String(n.points?.default??1)}
          .value=${e.points===null?"":String(e.points)}
          ?disabled=${r}
          @input=${b=>{let w=b.target,E=Yo(w.value);w.value=E===null?"":String(E),this.changeDraft({points:E})}}
        />
        <p class="field-hint">Blank uses the default from Configure › Chore points.</p>
      </div>
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
              ${u(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:$}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return f``;let o=e.busy,i=u=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...u})},r=u=>i({kids:e.kids.includes(u)?e.kids.filter(d=>d!==u):[...e.kids,u]}),a=n.kids.filter(u=>Jt(u,e.date)),l=e.dish.trim(),c=e.kids.length?l?null:"Type what’s served":"Pick who gets this menu";return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${Le(e.date)}</span>
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
          @input=${u=>i({dish:u.target.value})}
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
          @input=${u=>i({details:u.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${a.map(u=>{let d=this.kidColorOf(u.id),g=e.kids.includes(u.id);return f`<button type="button" class="who-chip" style="--c:${d.color};--rgb:${d.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${o} @click=${()=>r(u.id)}>
              <span class="avatar" aria-hidden="true">${Ee(u.name)}</span>${u.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${l||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?f`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:$}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!c} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":c??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return f``;if(this.choreDone(e))return this.renderDoneChore(e,n);let o=n.people?.length?n.people:n.kids.map(d=>({...d,role:"kid"})),i=n.kids.findIndex(d=>d.id===e.kid),r=n.kids[i],a=this.plan?ve(this.plan):void 0,l=a?.get(e.kid)??ce(Math.max(0,i)),c=o.filter(d=>d.id!==e.kid),u=d=>{let g=n.kids.findIndex(h=>h.id===d.id);return g>=0?(a?.get(d.id)??ce(g)).color:"var(--dark)"};return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:$}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${In(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Ee(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?f`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${c.map(d=>f`<button type="button" class="done-by" style="--c:${u(d)}" @click=${()=>void this.toggleChore(e,d.id)}>
                  <span class="avatar ${d.role==="parent"?"driver":""}" aria-hidden="true">${Ee(d.name)}</span>
                  <span>${d.name}</span>
                </button>`)}
            </div>`:f`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
      <div class="field">
        <span class="field-label">Not done?</span>
        <div role="group" aria-label="Not done" class="choices skip-choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" @click=${()=>void this.toggleChore(e,void 0,"skipped")}>Skipped</button>
          <button type="button" class="choice" @click=${()=>void this.toggleChore(e,void 0,"excused")}>Excused (sick, away)</button>
        </div>
        <p class="field-hint">Takes it off the list with no points. Skipped counts as missed; excused doesn’t.</p>
      </div>
    `}renderDoneChore(e,n){let o=n.kids.find(l=>l.id===e.kid),i=e.done_by&&e.done_by!==e.kid?n.people?.find(l=>l.id===e.done_by)?.name??e.done_by_name:null,r=`${In(e,n.today,n.time_zone)}${i?` · by ${i}`:""}`,a=!Tt(e.state)&&e.earned!=null?` · ${Vr(e.earned)}`:"";return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:$}${e.title}</span>
          <span class="ed-meta">${o?.name??""} · ${r}${a}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Close</button>
      </div>
      <div class="field">
        <span class="field-label">Not done after all?</span>
        <button type="button" class="choice wide" @click=${()=>void this.toggleChore(e)}>Mark not done</button>
        <p class="field-hint">Puts it back on the list to do${e.earned?", and takes off its points":""}.</p>
      </div>
    `}renderLegend(){return f`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,n){let o=qt(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${U(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${U(n.start)} to ${U(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let i=n.along.map(r=>ae(e).includes(r)?ue(e,r):be(e,r));return`${o} drives there and back${i.length?`, with ${kt(i)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return f``;let{day:o,event:i}=n,r=ae(e),a=Co(e,i),l=qt(e,i),c=!!this.pending,u=y=>this.pending?.key===y?this.pending.value:void 0,d=[...e.people?.carpools??[]];for(let y of e.days)for(let I of y.events)for(let R of[I.drop,I.pick])R&&R!=="none"&&!r.includes(R)&&!d.some(L=>L.toLowerCase()===R.toLowerCase())&&d.push(R);let g=new Set(e.days.flatMap(y=>y.events.filter(I=>I.title===i.title).flatMap(I=>[I.drop,I.pick].map(R=>(R??"").toLowerCase()))));d.sort((y,I)=>Number(g.has(I.toLowerCase()))-Number(g.has(y.toLowerCase())));let h=y=>{if(!i.sides.includes(y))return $;let I=u(y)??u("both"),R=y==="drop"?i.drop:i.pick,L=I!==void 0?String(I):i.no_ride_unless_named&&R==="none"?"":R,X=L===""&&!(I===void 0&&i.no_ride_unless_named),H=L&&L!=="none"&&!r.includes(L)?L:"",me=G=>{this.otherOpen=null,this.setRide(i,y,L===G?"":G,r)},ee=[...r.map(G=>[G,Ts(e,G)]),["none","Not needed"]],A=`${i.id}|${y}`,J=this.otherOpen===A;return f`<div class="field ride-box">
        <span class="field-label">${y==="drop"?"Drop-off":"Pick-up"} ${X?f`<span class="nobody">· nobody yet</span>`:$}</span>
        <div role="group" aria-label=${y==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${ee.length+1}, minmax(0, 1fr))">
          ${ee.map(([G,Ae])=>f`<button type="button" class="choice" aria-pressed=${L===G?"true":"false"} ?disabled=${c} @click=${()=>me(G)}>
                ${Ae}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${H?"true":"false"}
            aria-expanded=${J?"true":"false"}
            ?disabled=${c}
            @click=${()=>this.otherOpen=J?null:A}
          >
            ${H||"Other"}
          </button>
        </div>
        ${J?f`${d.length?f`<div role="group" aria-label=${y==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${d.map(G=>f`<button type="button" class="chip" aria-pressed=${L.toLowerCase()===G.toLowerCase()?"true":"false"} ?disabled=${c} @click=${()=>me(G)}>
                    ${G}
                  </button>`)}
            </div>`:$}
        <input
          type="text"
          .value=${H&&!d.some(G=>G.toLowerCase()===H.toLowerCase())?H:""}
          ?disabled=${c}
          aria-label=${y==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${G=>{let Ae=G.target.value.trim();Ae&&Ae!==L&&me(Ae)}}
          @keydown=${G=>{G.key==="Enter"&&G.target.blur()}}
        />`:$}
        ${!m&&L!==""&&L!=="none"?v(y,L):$}
      </div>`},v=(y,I)=>{let R=u(`along-${y}`),L=R!==void 0?R:y==="pick"?i.pick_along??[]:i.along,X=new Set(o.events.filter(ee=>ee.event_id===i.event_id&&!ee.own).map(ee=>ee.kid)),H=[...we(e).filter(ee=>ee!==i.kid&&!X.has(ee)),...r.filter(ee=>ee!==I)];return H.length?f`<div class="field-sub">
        <span class="field-label">${y==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${y==="pick"?"Coming home too. Anyone already there just gets in.":y==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${y==="drop"?"Riding along on the drop-off":y==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="who-chips">
          ${H.map(ee=>{let A=r.includes(ee),J=A?ue(e,ee):be(e,ee),G=A?Fe:ve(e).get(ee)??ce(0);return f`<button
              type="button"
              class="who-chip"
              style="--c:${G.color};--rgb:${G.rgb}"
              aria-pressed=${L.includes(ee)?"true":"false"}
              ?disabled=${c}
              @click=${()=>this.toggleAlong(i,ee,y)}
            >
              <span class="avatar ${A?"driver":""}" aria-hidden="true">${Ee(J)}</span>${J}
            </button>`})}
        </div>
      </div>`:$},b=r.includes(i.drop)?i.drop:r.includes(i.pick)?i.pick:"",w=i.drop===i.pick&&r.includes(i.drop),E=u("stay"),m=E!==void 0?!!E:i.stay&&w,S=u("along"),N=S!==void 0?S:i.along,K=i.own?[...we(e),...r.filter(y=>y!==i.own)]:[],se=i.own!=null&&i.takes!=null,T=i.own!=null&&!se,_=u("takes"),x=_!==void 0?_:i.takes??null,C=u("arrive"),P=this.arriveDraft!==void 0?this.arriveDraft:C!==void 0?C:i.arrive_by,D=u("leave"),j=this.leaveDraft!==void 0?this.leaveDraft:D!==void 0?D:i.leave_by??null,W=(y,I)=>{let R=y==="arrive",L=R?i.start:i.end,X=me=>()=>R?this.nudgeArrive(i,me):this.nudgeLeave(i,me),H=(me,ee,A,J)=>f`<button
          type="button"
          class="step"
          aria-label=${ee}
          ?disabled=${c||J}
          @pointerdown=${()=>this.startHold(X(me))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(X(me))}
        >
          ${A}
        </button>`;return f`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${R?"Arrive":"Leave"}</span>
          <span class="field-hint">${pn(I-L)}</span>
        </span>
        <span class="stepper">
          ${H(-5,"Five minutes earlier","−",!R&&I-5<=i.start)}
          <span class="arrive-value">${U(I)}</span>
          ${H(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${R?"Arrive on time":"Leave at the end"}
            ?disabled=${c}
            @click=${()=>R?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},q=i.sides.includes("pick")||i.own!=null,Q=P!=null||this.timesOpen.arrive,z=q&&(j!=null||this.timesOpen.leave),Y=y=>()=>{this.timesOpen={...this.timesOpen,[y]:!0}},pe=()=>f`${Q?W("arrive",P??i.start):$}
      ${z?W("leave",j??i.end):$}
      ${!Q||!z&&q?f`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${Q?$:f`<button type="button" class="chip" ?disabled=${c} @click=${Y("arrive")}>Arrive early or late</button>`}
              ${!z&&q?f`<button type="button" class="chip" ?disabled=${c} @click=${Y("leave")}>Leave early or late</button>`:$}
            </div>
          </div>`:$}`,Me=i.sides.includes("drop")&&i.sides.includes("pick"),De=Me&&(m||this.stayDraft===i.id),Ce=()=>{let y=Me?f`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${De?"false":"true"}
              ?disabled=${c}
              @click=${()=>{this.stayDraft=null,i.stay&&this.toggleStay(i,!1,b)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${De?"true":"false"}
              ?disabled=${c}
              @click=${()=>{b?this.toggleStay(i,!0,b):this.stayDraft=i.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:$;if(!De)return f`${y} ${h("drop")} ${h("pick")}`;let I=m&&w?i.drop:"";return f`${y}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${I?$:f`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(R=>f`<button
                type="button"
                class="choice"
                aria-pressed=${I===R?"true":"false"}
                ?disabled=${c}
                @click=${()=>{if(I===R||!this.backend)return;let L=this.backend;this.stayDraft=null,this.save("stay",!0,()=>L.setRide(i.id,"both",R,this.scope,!0))}}
              >
                ${ue(e,R)}
              </button>`)}
          </div>
          ${I?v("both",I):$}
        </div>`},Z=[],ie=y=>y==="none"?"Not needed":Ts(e,y),Pe=y=>r.includes(y)?ue(e,y):be(e,y),$e=(y,I,R)=>{I===""&&!R.length||Z.push(`${y}: ${[I===""?"TBD":ie(I),...R.map(Pe)].join(", ")}`)},Xe=y=>i.no_ride_unless_named&&y==="none"?"":y;i.own||$e("Drop-off",Xe(i.drop),i.along),i.own||$e("Pick-up",Xe(i.pick),i.pick_along??[]),!i.own&&i.stay&&Z.push("Stay: yes"),se&&Z.push(`Takes: ${i.takes} min`),i.own&&i.along.length&&Z.push(`Take along: ${i.along.map(Pe).join(", ")}`),i.arrive_by!=null&&i.arrive_by!==i.start&&Z.push(`Arrive: ${pn(i.arrive_by-i.start)}`),i.leave_by!=null&&i.leave_by!==i.end&&Z.push(`Leave: ${pn(i.leave_by-i.end)}`);let Je=u("attending"),Te=Je!==void 0?!!Je:i.attending!==!1;i.attending===!1&&Z.splice(0,Z.length,"Attending: no");let p=o.date===this.today().date?"":`${xe(o.date)} · `,k=Rn(i),M=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${l} · ${i.title}</span>
          <span class="ed-meta">${p}${se?"any time ":""}${k}${i.place_name&&!i.place.startsWith("?")?` · ${i.place_name}`:""}</span>
          ${this.renderForLine(e,o,i)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(i.busy_only){let y=i.place_name&&i.place_name!==i.title?i.place_name:"",I=i.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":i.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return f`${M}
        ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:$}
        ${y?f`<div class="field"><span class="field-label">Where</span><span class="field-hint">${y}</span></div>`:$}
        <p class="field-hint">
          ${Te?`This blocks ${l}’s time: ${l} can’t drive then, so a ride that needs ${l} shows as a problem.`:`Not going, so it doesn’t block ${l}’s time, and ${l} can drive then.`}
          ${I}
        </p>
        <button type="button" class="chip clear" ?disabled=${c} @click=${()=>this.setAttending(i,!Te)}>
          ${Te?`${l} isn’t going this time`:`${l} is going after all`}
        </button>
        ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:$}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${i.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return i.where==="home"?f`${M}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${l} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${M}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:$}
      ${i.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${xe(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:$}
      ${Te?f`${i.where==="anywhere"?f`<p class="field-hint">
                  ${i.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:$}
            ${i.own?f`<p class="field-hint">${this.ownHint(e,i)}</p>`:Ce()}
      ${i.own?f`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${x!=null?`Takes ${x} min, any time ${U(i.start)}–${U(i.end)}`:"At its set time"}</span>
            </span>
            ${x!=null?f`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${c||x<=5} @click=${()=>this.setTakes(i,Math.max(5,x-5))}>−</button>
                  <span class="arrive-value">${x} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${c||x+5>i.end-i.start} @click=${()=>this.setTakes(i,x+5)}>+</button>
                </span>`:$}
          </div>
          <button type="button" class="chip clear" ?disabled=${c} @click=${()=>this.setTakes(i,x!=null?null:Math.min(10,Math.max(5,i.end-i.start)))}>
            ${x!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:$}
      ${T&&K.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${K.map(y=>f`<button type="button" class="chip" aria-pressed=${N.includes(y)?"true":"false"} ?disabled=${c} @click=${()=>this.toggleAlong(i,y)}>
                  ${r.includes(y)?ue(e,y):be(e,y)}
                </button>`)}
            </div>
          </div>`:$}
      ${se?$:pe()}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${l} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${c} @click=${()=>this.setAttending(i,!Te)}>
        ${Te?`${l} isn’t going this time`:`${l} is going after all`}
      </button>
      ${i.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${i.problems.join("; ")}</p>`:$}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${Z.length?Z.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${Te&&!i.own?f`<p class="field-hint">Tap a selected driver again to clear it.</p>`:$}
    `}};sn.styles=or,sn.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},problemOpen:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},timesOpen:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},pointsFlash:{state:!0},manage:{state:!0},totals:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",sn);function Ud(s,t){let o=Math.max(1,Math.round(s/14)),i=s/o,r=[],a=[];for(let c=0;c<=o;c++){let u=+(c*i).toFixed(1);r.push(`${u},${c%2?5:0}`),a.push(`${u},${t-(c%2?0:5)}`)}let l=`M${r.join(" L")} L${[...a].reverse().join(" L")} Z`;return f`<svg width=${s} height=${t} viewBox="0 0 ${s} ${t}">
    ${re`<path class="fold-fill" d=${l}></path>
      <path class="fold-edge" d=${`M${r.join(" L")}`}></path>
      <path class="fold-edge" d=${`M${a.join(" L")}`}></path>`}
  </svg>`}function Gr(s,t){return t===!1?!$t(s):t===!0?$t(s)&&!Tt(s.state):s.state===t}function Fd(s){return`${s} ${s===1?"chore":"chores"} done`}function Vr(s){return`${We(s)} ${s===1?"point":"points"}`}function Wd(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function Xr(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=i=>{if(i)for(let r of Wd())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!i},o=i=>{if(clearTimeout(e),i.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),s)}function Jr(s){try{return new URL(s).searchParams.get("v")}catch{return null}}function Qr(s,t,e){if(!t)return()=>{};let n=e.everyMs??6e5,o=e.retryMs??3e4,i=e.idleMs??12e4,r=null,a=null,l=0,c=!1,u=v=>{if(c||a)return;let b=e.idleFor();if(b>=i){e.reload(v);return}a=setTimeout(()=>{a=null,u(v)},i-b)},d=async()=>{try{let v=await s.sendMessagePromise({type:"mydashlight/app_version"});l=0;let b=v["kiosk.js"];!c&&b&&b!==t&&u(b)}catch{if(c||r||++l>20)return;r=setTimeout(()=>{r=null,d()},o)}},g=()=>{l=0,d()};s.addEventListener?.("ready",g);let h=setInterval(()=>void d(),n);return()=>{c=!0,clearInterval(h),r&&clearTimeout(r),a&&clearTimeout(a),s.removeEventListener?.("ready",g)}}function Zr(s,t=6e4,e=15e3){let n=null,o=setInterval(()=>{if(!s.connected||n)return;let i=!1;n=setTimeout(()=>{n=null,!i&&s.connected&&s.reconnect(!0)},e);let r=()=>{i=!0,n&&clearTimeout(n),n=null};s.ping().then(r,r)},t);return()=>{clearInterval(o),n&&clearTimeout(n),n=null}}var ea=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],ta=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function na(s,t,e,n){let o=Math.max(0,Math.min(t,s.length)),i=Math.max(o,Math.min(e,s.length));return{value:s.slice(0,o)+n+s.slice(i),caret:o+n.length}}function sa(s,t,e){let n=Math.max(0,Math.min(t,s.length)),o=Math.max(n,Math.min(e,s.length));if(n!==o)return{value:s.slice(0,n)+s.slice(o),caret:n};if(n===0)return{value:s,caret:0};let i=Array.from(s.slice(0,n));i.pop();let r=i.join("");return{value:r+s.slice(n),caret:r.length}}function ia(s,t){return t===0||/\s$/.test(s.slice(0,t))}var Kd=new Set(["text","search","email","url","tel","number","password"]);function oa(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Kd.has(s.type)&&!s.readOnly&&!s.disabled}var Gd={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Vd={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},on=class extends Se{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=ia(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,i]=this.selection(n),r=sa(n.value,o,i);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[i,r]=this.selection(n),a=na(n.value,i,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":Gd[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${Vd[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):$}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?ea:ta;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>f`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};on.styles=et`
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
  `,on.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",on);function qd(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function ra(s){let t=new WeakSet,e=r=>{let a=r.composedPath();i(a);let l=a[0];oa(l)&&s.attach(l)},n=()=>{setTimeout(()=>{let r=qd();!s.target||r===s.target||(oa(r)?s.attach(r):s.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},i=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>i(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var ci="mydashlight",Yd=`/api/${ci}/pair`,Xd=`/api/${ci}/pair/poll`,di=`/${ci}`,hi="pair";function aa(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function la(s,t){return`${s}${di}?${hi}=${encodeURIComponent(t)}`}function Jd(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var ft=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function ca(s=fetch){let t=await s(Yd,{method:"POST",cache:"no-store"});if(t.status===429)throw new ft("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new ft(`Home Assistant answered ${t.status}.`);return await t.json()}async function da(s,t,e=fetch){let n=await e(Xd,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new ft(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:Jd(t,o.auth)}:{status:"pending"}}var At=function(s,t){let o=s,i=rn[t],r=null,a=0,l=null,c=[],u={},d=function(T,_){a=o*4+17,r=(function(x){let C=new Array(x);for(let P=0;P<x;P+=1){C[P]=new Array(x);for(let D=0;D<x;D+=1)C[P][D]=null}return C})(a),g(0,0),g(a-7,0),g(0,a-7),b(),v(),E(T,_),o>=7&&w(T),l==null&&(l=N(o,i,c)),m(l,_)},g=function(T,_){for(let x=-1;x<=7;x+=1)if(!(T+x<=-1||a<=T+x))for(let C=-1;C<=7;C+=1)_+C<=-1||a<=_+C||(0<=x&&x<=6&&(C==0||C==6)||0<=C&&C<=6&&(x==0||x==6)||2<=x&&x<=4&&2<=C&&C<=4?r[T+x][_+C]=!0:r[T+x][_+C]=!1)},h=function(){let T=0,_=0;for(let x=0;x<8;x+=1){d(!0,x);let C=qe.getLostPoint(u);(x==0||T>C)&&(T=C,_=x)}return _},v=function(){for(let T=8;T<a-8;T+=1)r[T][6]==null&&(r[T][6]=T%2==0);for(let T=8;T<a-8;T+=1)r[6][T]==null&&(r[6][T]=T%2==0)},b=function(){let T=qe.getPatternPosition(o);for(let _=0;_<T.length;_+=1)for(let x=0;x<T.length;x+=1){let C=T[_],P=T[x];if(r[C][P]==null)for(let D=-2;D<=2;D+=1)for(let j=-2;j<=2;j+=1)D==-2||D==2||j==-2||j==2||D==0&&j==0?r[C+D][P+j]=!0:r[C+D][P+j]=!1}},w=function(T){let _=qe.getBCHTypeNumber(o);for(let x=0;x<18;x+=1){let C=!T&&(_>>x&1)==1;r[Math.floor(x/3)][x%3+a-8-3]=C}for(let x=0;x<18;x+=1){let C=!T&&(_>>x&1)==1;r[x%3+a-8-3][Math.floor(x/3)]=C}},E=function(T,_){let x=i<<3|_,C=qe.getBCHTypeInfo(x);for(let P=0;P<15;P+=1){let D=!T&&(C>>P&1)==1;P<6?r[P][8]=D:P<8?r[P+1][8]=D:r[a-15+P][8]=D}for(let P=0;P<15;P+=1){let D=!T&&(C>>P&1)==1;P<8?r[8][a-P-1]=D:P<9?r[8][15-P-1+1]=D:r[8][15-P-1]=D}r[a-8][8]=!T},m=function(T,_){let x=-1,C=a-1,P=7,D=0,j=qe.getMaskFunction(_);for(let W=a-1;W>0;W-=2)for(W==6&&(W-=1);;){for(let q=0;q<2;q+=1)if(r[C][W-q]==null){let Q=!1;D<T.length&&(Q=(T[D]>>>P&1)==1),j(C,W-q)&&(Q=!Q),r[C][W-q]=Q,P-=1,P==-1&&(D+=1,P=7)}if(C+=x,C<0||a<=C){C-=x,x=-x;break}}},S=function(T,_){let x=0,C=0,P=0,D=new Array(_.length),j=new Array(_.length);for(let z=0;z<_.length;z+=1){let Y=_[z].dataCount,pe=_[z].totalCount-Y;C=Math.max(C,Y),P=Math.max(P,pe),D[z]=new Array(Y);for(let Z=0;Z<D[z].length;Z+=1)D[z][Z]=255&T.getBuffer()[Z+x];x+=Y;let Me=qe.getErrorCorrectPolynomial(pe),Ce=an(D[z],Me.getLength()-1).mod(Me);j[z]=new Array(Me.getLength()-1);for(let Z=0;Z<j[z].length;Z+=1){let ie=Z+Ce.getLength()-j[z].length;j[z][Z]=ie>=0?Ce.getAt(ie):0}}let W=0;for(let z=0;z<_.length;z+=1)W+=_[z].totalCount;let q=new Array(W),Q=0;for(let z=0;z<C;z+=1)for(let Y=0;Y<_.length;Y+=1)z<D[Y].length&&(q[Q]=D[Y][z],Q+=1);for(let z=0;z<P;z+=1)for(let Y=0;Y<_.length;Y+=1)z<j[Y].length&&(q[Q]=j[Y][z],Q+=1);return q},N=function(T,_,x){let C=ha.getRSBlocks(T,_),P=ua();for(let j=0;j<x.length;j+=1){let W=x[j];P.put(W.getMode(),4),P.put(W.getLength(),qe.getLengthInBits(W.getMode(),T)),W.write(P)}let D=0;for(let j=0;j<C.length;j+=1)D+=C[j].dataCount;if(P.getLengthInBits()>D*8)throw"code length overflow. ("+P.getLengthInBits()+">"+D*8+")";for(P.getLengthInBits()+4<=D*8&&P.put(0,4);P.getLengthInBits()%8!=0;)P.putBit(!1);for(;!(P.getLengthInBits()>=D*8||(P.put(236,8),P.getLengthInBits()>=D*8));)P.put(17,8);return S(P,C)};u.addData=function(T,_){_=_||"Byte";let x=null;switch(_){case"Numeric":x=Qd(T);break;case"Alphanumeric":x=Zd(T);break;case"Byte":x=eh(T);break;case"Kanji":x=th(T);break;default:throw"mode:"+_}c.push(x),l=null},u.isDark=function(T,_){if(T<0||a<=T||_<0||a<=_)throw T+","+_;return r[T][_]},u.getModuleCount=function(){return a},u.make=function(){if(o<1){let T=1;for(;T<40;T++){let _=ha.getRSBlocks(T,i),x=ua();for(let P=0;P<c.length;P++){let D=c[P];x.put(D.getMode(),4),x.put(D.getLength(),qe.getLengthInBits(D.getMode(),T)),D.write(x)}let C=0;for(let P=0;P<_.length;P++)C+=_[P].dataCount;if(x.getLengthInBits()<=C*8)break}o=T}d(!1,h())},u.createTableTag=function(T,_){T=T||2,_=typeof _>"u"?T*4:_;let x="";x+='<table style="',x+=" border-width: 0px; border-style: none;",x+=" border-collapse: collapse;",x+=" padding: 0px; margin: "+_+"px;",x+='">',x+="<tbody>";for(let C=0;C<u.getModuleCount();C+=1){x+="<tr>";for(let P=0;P<u.getModuleCount();P+=1)x+='<td style="',x+=" border-width: 0px; border-style: none;",x+=" border-collapse: collapse;",x+=" padding: 0px; margin: 0px;",x+=" width: "+T+"px;",x+=" height: "+T+"px;",x+=" background-color: ",x+=u.isDark(C,P)?"#000000":"#ffffff",x+=";",x+='"/>';x+="</tr>"}return x+="</tbody>",x+="</table>",x},u.createSvgTag=function(T,_,x,C){let P={};typeof arguments[0]=="object"&&(P=arguments[0],T=P.cellSize,_=P.margin,x=P.alt,C=P.title),T=T||2,_=typeof _>"u"?T*4:_,x=typeof x=="string"?{text:x}:x||{},x.text=x.text||null,x.id=x.text?x.id||"qrcode-description":null,C=typeof C=="string"?{text:C}:C||{},C.text=C.text||null,C.id=C.text?C.id||"qrcode-title":null;let D=u.getModuleCount()*T+_*2,j,W,q,Q,z="",Y;for(Y="l"+T+",0 0,"+T+" -"+T+",0 0,-"+T+"z ",z+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',z+=P.scalable?"":' width="'+D+'px" height="'+D+'px"',z+=' viewBox="0 0 '+D+" "+D+'" ',z+=' preserveAspectRatio="xMinYMin meet"',z+=C.text||x.text?' role="img" aria-labelledby="'+K([C.id,x.id].join(" ").trim())+'"':"",z+=">",z+=C.text?'<title id="'+K(C.id)+'">'+K(C.text)+"</title>":"",z+=x.text?'<description id="'+K(x.id)+'">'+K(x.text)+"</description>":"",z+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',z+='<path d="',q=0;q<u.getModuleCount();q+=1)for(Q=q*T+_,j=0;j<u.getModuleCount();j+=1)u.isDark(q,j)&&(W=j*T+_,z+="M"+W+","+Q+Y);return z+='" stroke="transparent" fill="black"/>',z+="</svg>",z},u.createDataURL=function(T,_){T=T||2,_=typeof _>"u"?T*4:_;let x=u.getModuleCount()*T+_*2,C=_,P=x-_;return oh(x,x,function(D,j){if(C<=D&&D<P&&C<=j&&j<P){let W=Math.floor((D-C)/T),q=Math.floor((j-C)/T);return u.isDark(q,W)?0:1}else return 1})},u.createImgTag=function(T,_,x){T=T||2,_=typeof _>"u"?T*4:_;let C=u.getModuleCount()*T+_*2,P="";return P+="<img",P+=' src="',P+=u.createDataURL(T,_),P+='"',P+=' width="',P+=C,P+='"',P+=' height="',P+=C,P+='"',x&&(P+=' alt="',P+=K(x),P+='"'),P+="/>",P};let K=function(T){let _="";for(let x=0;x<T.length;x+=1){let C=T.charAt(x);switch(C){case"<":_+="&lt;";break;case">":_+="&gt;";break;case"&":_+="&amp;";break;case'"':_+="&quot;";break;default:_+=C;break}}return _},se=function(T){T=typeof T>"u"?2:T;let x=u.getModuleCount()*1+T*2,C=T,P=x-T,D,j,W,q,Q,z={"██":"█","█ ":"▀"," █":"▄","  ":" "},Y={"██":"▀","█ ":"▀"," █":" ","  ":" "},pe="";for(D=0;D<x;D+=2){for(W=Math.floor((D-C)/1),q=Math.floor((D+1-C)/1),j=0;j<x;j+=1)Q="█",C<=j&&j<P&&C<=D&&D<P&&u.isDark(W,Math.floor((j-C)/1))&&(Q=" "),C<=j&&j<P&&C<=D+1&&D+1<P&&u.isDark(q,Math.floor((j-C)/1))?Q+=" ":Q+="█",pe+=T<1&&D+1>=P?Y[Q]:z[Q];pe+=`
`}return x%2&&T>0?pe.substring(0,pe.length-x-1)+Array(x+1).join("▀"):pe.substring(0,pe.length-1)};return u.createASCII=function(T,_){if(T=T||1,T<2)return se(_);T-=1,_=typeof _>"u"?T*2:_;let x=u.getModuleCount()*T+_*2,C=_,P=x-_,D,j,W,q,Q=Array(T+1).join("██"),z=Array(T+1).join("  "),Y="",pe="";for(D=0;D<x;D+=1){for(W=Math.floor((D-C)/T),pe="",j=0;j<x;j+=1)q=1,C<=j&&j<P&&C<=D&&D<P&&u.isDark(W,Math.floor((j-C)/T))&&(q=0),pe+=q?Q:z;for(W=0;W<T;W+=1)Y+=pe+`
`}return Y.substring(0,Y.length-1)},u.renderTo2dContext=function(T,_){_=_||2;let x=u.getModuleCount();for(let C=0;C<x;C++)for(let P=0;P<x;P++)T.fillStyle=u.isDark(C,P)?"black":"white",T.fillRect(P*_,C*_,_,_)},u};At.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};At.createStringToBytes=function(s,t){let e=(function(){let o=sh(s),i=function(){let l=o.read();if(l==-1)throw"eof";return l},r=0,a={};for(;;){let l=o.read();if(l==-1)break;let c=i(),u=i(),d=i(),g=String.fromCharCode(l<<8|c),h=u<<8|d;a[g]=h,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let i=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)i.push(a);else{let l=e[o.charAt(r)];typeof l=="number"?(l&255)==l?i.push(l):(i.push(l>>>8),i.push(l&255)):i.push(n)}}return i}};var ke={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},rn={L:1,M:0,Q:3,H:2},Ve={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},qe=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},i=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;i(a)-i(t)>=0;)a^=t<<i(a)-i(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;i(a)-i(e)>=0;)a^=e<<i(a)-i(e);return r<<12|a},o.getPatternPosition=function(r){return s[r-1]},o.getMaskFunction=function(r){switch(r){case Ve.PATTERN000:return function(a,l){return(a+l)%2==0};case Ve.PATTERN001:return function(a,l){return a%2==0};case Ve.PATTERN010:return function(a,l){return l%3==0};case Ve.PATTERN011:return function(a,l){return(a+l)%3==0};case Ve.PATTERN100:return function(a,l){return(Math.floor(a/2)+Math.floor(l/3))%2==0};case Ve.PATTERN101:return function(a,l){return a*l%2+a*l%3==0};case Ve.PATTERN110:return function(a,l){return(a*l%2+a*l%3)%2==0};case Ve.PATTERN111:return function(a,l){return(a*l%3+(a+l)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=an([1],0);for(let l=0;l<r;l+=1)a=a.multiply(an([1,Ye.gexp(l)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case ke.MODE_NUMBER:return 10;case ke.MODE_ALPHA_NUM:return 9;case ke.MODE_8BIT_BYTE:return 8;case ke.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case ke.MODE_NUMBER:return 12;case ke.MODE_ALPHA_NUM:return 11;case ke.MODE_8BIT_BYTE:return 16;case ke.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case ke.MODE_NUMBER:return 14;case ke.MODE_ALPHA_NUM:return 13;case ke.MODE_8BIT_BYTE:return 16;case ke.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),l=0;for(let d=0;d<a;d+=1)for(let g=0;g<a;g+=1){let h=0,v=r.isDark(d,g);for(let b=-1;b<=1;b+=1)if(!(d+b<0||a<=d+b))for(let w=-1;w<=1;w+=1)g+w<0||a<=g+w||b==0&&w==0||v==r.isDark(d+b,g+w)&&(h+=1);h>5&&(l+=3+h-5)}for(let d=0;d<a-1;d+=1)for(let g=0;g<a-1;g+=1){let h=0;r.isDark(d,g)&&(h+=1),r.isDark(d+1,g)&&(h+=1),r.isDark(d,g+1)&&(h+=1),r.isDark(d+1,g+1)&&(h+=1),(h==0||h==4)&&(l+=3)}for(let d=0;d<a;d+=1)for(let g=0;g<a-6;g+=1)r.isDark(d,g)&&!r.isDark(d,g+1)&&r.isDark(d,g+2)&&r.isDark(d,g+3)&&r.isDark(d,g+4)&&!r.isDark(d,g+5)&&r.isDark(d,g+6)&&(l+=40);for(let d=0;d<a;d+=1)for(let g=0;g<a-6;g+=1)r.isDark(g,d)&&!r.isDark(g+1,d)&&r.isDark(g+2,d)&&r.isDark(g+3,d)&&r.isDark(g+4,d)&&!r.isDark(g+5,d)&&r.isDark(g+6,d)&&(l+=40);let c=0;for(let d=0;d<a;d+=1)for(let g=0;g<a;g+=1)r.isDark(g,d)&&(c+=1);let u=Math.abs(100*c/a/a-50)/5;return l+=u*10,l},o})(),Ye=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),an=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let o=0;for(;o<s.length&&s[o]==0;)o+=1;let i=new Array(s.length-o+t);for(let r=0;r<s.length-o;r+=1)i[r]=s[r+o];return i})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let i=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)i[r+a]^=Ye.gexp(Ye.glog(n.getAt(r))+Ye.glog(o.getAt(a)));return an(i,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let i=Ye.glog(n.getAt(0))-Ye.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=Ye.gexp(Ye.glog(o.getAt(a))+i);return an(r,0).mod(o)},n},ha=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,i){let r={};return r.totalCount=o,r.dataCount=i,r},e={},n=function(o,i){switch(i){case rn.L:return s[(o-1)*4+0];case rn.M:return s[(o-1)*4+1];case rn.Q:return s[(o-1)*4+2];case rn.H:return s[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,i){let r=n(o,i);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+i;let a=r.length/3,l=[];for(let c=0;c<a;c+=1){let u=r[c*3+0],d=r[c*3+1],g=r[c*3+2];for(let h=0;h<u;h+=1)l.push(t(d,g))}return l},e})(),ua=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let o=Math.floor(n/8);return(s[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let i=0;i<o;i+=1)e.putBit((n>>>o-i-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);s.length<=o&&s.push(0),n&&(s[o]|=128>>>t%8),t+=1},e},Qd=function(s){let t=ke.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,l=0;for(;l+2<a.length;)r.put(o(a.substring(l,l+3)),10),l+=3;l<a.length&&(a.length-l==1?r.put(o(a.substring(l,l+1)),4):a.length-l==2&&r.put(o(a.substring(l,l+2)),7))};let o=function(r){let a=0;for(let l=0;l<r.length;l+=1)a=a*10+i(r.charAt(l));return a},i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},Zd=function(s){let t=ke.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(i){return e.length},n.write=function(i){let r=e,a=0;for(;a+1<r.length;)i.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&i.put(o(r.charAt(a)),6)};let o=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;if("A"<=i&&i<="Z")return i.charCodeAt(0)-65+10;switch(i){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+i}};return n},eh=function(s){let t=ke.MODE_8BIT_BYTE,e=s,n=At.stringToBytes(s),o={};return o.getMode=function(){return t},o.getLength=function(i){return n.length},o.write=function(i){for(let r=0;r<n.length;r+=1)i.put(n[r],8)},o},th=function(s){let t=ke.MODE_KANJI,e=s,n=At.stringToBytes;(function(r,a){let l=n(r);if(l.length!=2||(l[0]<<8|l[1])!=a)throw"sjis not supported."})("友",38726);let o=n(s),i={};return i.getMode=function(){return t},i.getLength=function(r){return~~(o.length/2)},i.write=function(r){let a=o,l=0;for(;l+1<a.length;){let c=(255&a[l])<<8|255&a[l+1];if(33088<=c&&c<=40956)c-=33088;else if(57408<=c&&c<=60351)c-=49472;else throw"illegal char at "+(l+1)+"/"+c;c=(c>>>8&255)*192+(c&255),r.put(c,13),l+=2}if(l<a.length)throw"illegal char at "+(l+1)},i},pa=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let i=0;i<o;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},nh=function(){let s=0,t=0,e=0,n="",o={},i=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)i(s>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let l=0;l<a;l+=1)n+="="}},o.toString=function(){return n},o},sh=function(s){let t=s,e=0,n=0,o=0,i={};i.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let l=t.charAt(e);if(e+=1,l=="=")return o=0,-1;if(l.match(/^\s$/))continue;n=n<<6|r(l.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return i},ih=function(s,t){let e=s,n=t,o=new Array(s*t),i={};i.setPixel=function(c,u,d){o[u*e+c]=d},i.write=function(c){c.writeString("GIF87a"),c.writeShort(e),c.writeShort(n),c.writeByte(128),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(255),c.writeByte(255),c.writeByte(255),c.writeString(","),c.writeShort(0),c.writeShort(0),c.writeShort(e),c.writeShort(n),c.writeByte(0);let u=2,d=a(u);c.writeByte(u);let g=0;for(;d.length-g>255;)c.writeByte(255),c.writeBytes(d,g,255),g+=255;c.writeByte(d.length-g),c.writeBytes(d,g,d.length-g),c.writeByte(0),c.writeString(";")};let r=function(c){let u=c,d=0,g=0,h={};return h.write=function(v,b){if(v>>>b)throw"length over";for(;d+b>=8;)u.writeByte(255&(v<<d|g)),b-=8-d,v>>>=8-d,g=0,d=0;g=v<<d|g,d=d+b},h.flush=function(){d>0&&u.writeByte(g)},h},a=function(c){let u=1<<c,d=(1<<c)+1,g=c+1,h=l();for(let m=0;m<u;m+=1)h.add(String.fromCharCode(m));h.add(String.fromCharCode(u)),h.add(String.fromCharCode(d));let v=pa(),b=r(v);b.write(u,g);let w=0,E=String.fromCharCode(o[w]);for(w+=1;w<o.length;){let m=String.fromCharCode(o[w]);w+=1,h.contains(E+m)?E=E+m:(b.write(h.indexOf(E),g),h.size()<4095&&(h.size()==1<<g&&(g+=1),h.add(E+m)),E=m)}return b.write(h.indexOf(E),g),b.write(d,g),b.flush(),v.toByteArray()},l=function(){let c={},u=0,d={};return d.add=function(g){if(d.contains(g))throw"dup key:"+g;c[g]=u,u+=1},d.size=function(){return u},d.indexOf=function(g){return c[g]},d.contains=function(g){return typeof c[g]<"u"},d};return i},oh=function(s,t,e){let n=ih(s,t);for(let a=0;a<t;a+=1)for(let l=0;l<s;l+=1)n.setPixel(l,a,e(l,a));let o=pa();n.write(o);let i=nh(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)i.writeByte(r[a]);return i.flush(),"data:image/gif;base64,"+i},fa=At,Xu=At.stringToBytes;function ga(s){let t=fa(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let i=0;i<e;i++)t.isDark(o,i)&&(n+=`M${i} ${o}h1v1h-1z`);return{size:e,d:n}}var rh=1e4,ln=class extends Se{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await ca();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof ft&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),rh)}}async poll(e){let n=this.secret;if(n)try{let o=await da(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return $;let{size:e,d:n}=ga(la(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${re`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?aa(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${di}?${hi}</span> and type the code.
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
    </div>`}};ln.styles=et`
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
  `,ln.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",ln);var ui="hassTokens";function ma(){try{let s=localStorage.getItem(ui);return s?JSON.parse(s):null}catch{return null}}function pi(s){try{s?localStorage.setItem(ui,JSON.stringify(s)):localStorage.removeItem(ui)}catch{}}function ah(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function lh(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function ch(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!ma()){let e=await lh();e&&pi(e)}try{let e=await Li({hassUrl:location.origin,loadTokens:async()=>ma(),saveTokens:pi});t&&history.replaceState(null,"",location.pathname+Hs(location.search));let n=await Di({auth:e});s.backend=new gn(n),Zr(n),Qr(n,Jr(import.meta.url),{reload:dh,idleFor:()=>Date.now()-xa}),n.addEventListener("reconnect-error",(o,i)=>{i===2&&va()})}catch(e){if(e===2){va();return}ah(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}var xa=Date.now();for(let s of["pointerdown","keydown","wheel"])document.addEventListener(s,()=>xa=Date.now(),{capture:!0,passive:!0});var ba="mydashlight-reloaded-for";function dh(s){try{if(sessionStorage.getItem(ba)===s)return;sessionStorage.setItem(ba,s)}catch{}location.reload()}function va(){pi(null),location.replace(location.pathname+Hs(location.search))}var wa=ct(location.search),ya=document.querySelector("mydashlight-keyboard");ya&&wa.keyboard!==!1&&ra(ya);wa.cursor!=="show"&&Xr();ch();
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
