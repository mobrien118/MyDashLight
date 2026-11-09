var kr=Object.defineProperty;var Sn=(s,t)=>()=>(s&&(t=s(s=0)),t);var $r=(s,t)=>{for(var e in t)kr(s,e,{get:t[e],enumerable:!0})};function bn(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function us(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}function Pa(s,t){let e=new Set,n=[];for(let i of s){let o=t(i);e.has(o)||(e.add(o),n.push(i))}return n}function bi(s){return Pa(s,t=>t.unicode)}function Da(s){function t(e,n,i){let o=n?s.createObjectStore(e,{keyPath:n}):s.createObjectStore(e);if(i)for(let[r,[a,c]]of Object.entries(i))o.createIndex(r,a,{multiEntry:c});return o}t(ht),t(et,_a,{[vi]:[Ea,!0],[wi]:[[Ta,Ca]],[ki]:[Aa,!0]}),t(gs,void 0,{[yi]:[""]})}function $i(s,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>s(e.result)}async function La(s){let t=await new Promise((e,n)=>{let i=indexedDB.open(s,ka);ps[s]=i,i.onupgradeneeded=o=>{o.oldVersion<$a&&Da(i.result)},$i(e,n,i)});return t.onclose=()=>bs(s),t}function Ra(s){return vn[s]||(vn[s]=La(s)),vn[s]}function Oe(s,t,e,n){return new Promise((i,o)=>{let r=s.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(l=>r.objectStore(l)),c;n(a,r,l=>{c=l}),r.oncomplete=()=>i(c),r.onerror=()=>o(r.error)})}function bs(s){let t=ps[s],e=t&&t.result;if(e){e.close();let n=wn[s];if(n)for(let i of n)i()}delete ps[s],delete vn[s],delete wn[s]}function Ia(s){return new Promise((t,e)=>{bs(s);let n=indexedDB.deleteDatabase(s);$i(t,e,n)})}function Ba(s,t){let e=wn[s];e||(e=wn[s]=[]),e.push(t)}function ut(s){return s.split(/[\s_]+/).map(t=>!t.match(/\w/)||Oa.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Ei(s){return s.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=ja)}function Na(s){return s.map(({annotation:e,emoticon:n,group:i,order:o,shortcodes:r,skins:a,tags:c,emoji:l,version:d})=>{let u=[...new Set(Ei([...(r||[]).map(ut).flat(),...(c||[]).map(ut).flat(),...ut(e),n]))].sort(),h={annotation:e,group:i,order:o,tags:c,tokens:u,unicode:l,version:d};if(n&&(h.emoticon=n),r&&(h.shortcodes=r),a){h.skinTones=[],h.skinUnicodes=[],h.skinVersions=[];for(let{tone:g,emoji:A,version:b}of a)h.skinTones.push(g),h.skinUnicodes.push(A),h.skinVersions.push(b)}return h})}function _i(s,t,e,n){s[t](e).onsuccess=i=>n&&n(i.target.result)}function Qe(s,t,e){_i(s,"get",t,e)}function Ti(s,t,e){_i(s,"getAll",t,e)}function xs(s){s.commit&&s.commit()}function za(s,t){let e=s[0];for(let n=1;n<s.length;n++){let i=s[n];t(e)>t(i)&&(e=i)}return e}function Ci(s,t){let e=za(s,i=>i.length),n=[];for(let i of e)s.some(o=>o.findIndex(r=>t(r)===t(i))===-1)||n.push(i);return n}async function Ua(s){return!await vs(s,ht,yn)}async function Ha(s,t,e){let[n,i]=await Promise.all([hs,yn].map(o=>vs(s,ht,o)));return n===e&&i===t}async function Fa(s,t){return Oe(s,et,ft,(n,i,o)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let l=c.target.result;for(let d of l)if(r=d.unicode,t(d))return o(d);if(l.length<50)return o();a()}};a()})}async function Ai(s,t,e,n){try{let i=Na(t);await Oe(s,[et,ht],ms,([o,r],a)=>{let c,l,d=0;function u(){++d===2&&h()}function h(){if(!(c===n&&l===e)){o.clear();for(let g of i)o.put(g);r.put(n,hs),r.put(e,yn),xs(a)}}Qe(r,hs,g=>{c=g,u()}),Qe(r,yn,g=>{l=g,u()})})}finally{}}async function Ka(s,t){return Oe(s,et,ft,(e,n,i)=>{let o=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);Ti(e.index(wi),o,i)})}async function Si(s,t){let e=Ei(ut(t));return e.length?Oe(s,et,ft,(n,i,o)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let l=Ci(r,d=>d.unicode);o(l.sort((d,u)=>d.order<u.order?-1:1))};for(let l=0;l<e.length;l++){let d=e[l],u=l===e.length-1?IDBKeyRange.bound(d,d+"￿",!1,!0):IDBKeyRange.only(d);Ti(n.index(vi),u,h=>{r.push(h),a()})}}):[]}async function Wa(s,t){let e=await Si(s,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(o=>o.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Fa(s,i=>(i.shortcodes||[]).includes(t.toLowerCase()))||null}async function qa(s,t){return Oe(s,et,ft,(e,n,i)=>Qe(e,t,o=>{if(o)return i(o);Qe(e.index(ki),t,r=>i(r||null))}))}function vs(s,t,e){return Oe(s,t,ft,(n,i,o)=>Qe(n,e,o))}function Va(s,t,e,n){return Oe(s,t,ms,(i,o)=>{i.put(n,e),xs(o)})}function Ga(s,t){return Oe(s,gs,ms,(e,n)=>Qe(e,t,i=>{e.put((i||0)+1,t),xs(n)}))}function Ya(s,t,e){return e===0?[]:Oe(s,[gs,et],ft,([n,i],o,r)=>{let a=[];n.index(yi).openCursor(void 0,"prev").onsuccess=c=>{let l=c.target.result;if(!l)return r(a);function d(g){if(a.push(g),a.length===e)return r(a);l.continue()}let u=l.primaryKey,h=t.byName(u);if(h)return d(h);Qe(i,u,g=>{if(g)return d(g);l.continue()})}})}function Ja(s,t){let e=new Map;for(let i of s){let o=t(i);for(let r of o){let a=e;for(let l=0;l<r.length;l++){let d=r.charAt(l),u=a.get(d);u||(u=new Map,a.set(d,u)),a=u}let c=a.get(xn);c||(c=[],a.set(xn,c)),c.push(i)}}return(i,o)=>{let r=e;for(let l=0;l<i.length;l++){let d=i.charAt(l),u=r.get(d);if(u)r=u;else return[]}if(o)return r.get(xn)||[];let a=[],c=[r];for(;c.length;){let d=[...c.shift().entries()].sort((u,h)=>u[0]<h[0]?-1:1);for(let[u,h]of d)u===xn?a.push(...h):c.push(h)}return a}}function Za(s){let t=s&&Array.isArray(s),e=t&&s.length&&(!s[0]||Xa.some(n=>!(n in s[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function xi(s){Za(s);let t=(h,g)=>h.name.toLowerCase()<g.name.toLowerCase()?-1:1,e=s.sort(t),i=Ja(s,h=>{let g=new Set;if(h.shortcodes)for(let A of h.shortcodes)for(let b of ut(A))g.add(b);return g}),o=h=>i(h,!0),r=h=>i(h,!1),a=h=>{let g=ut(h),A=g.map((b,k)=>(k<g.length-1?o:r)(b));return Ci(A,b=>b.name).sort(t)},c=new Map,l=new Map;for(let h of s){l.set(h.name.toLowerCase(),h);for(let g of h.shortcodes||[])c.set(g.toLowerCase(),h)}return{all:e,search:a,byShortcode:h=>c.get(h.toLowerCase()),byName:h=>l.get(h.toLowerCase())}}function Mt(s){if(!s)return s;if(Qa&&(s=structuredClone(s)),delete s.tokens,s.skinTones){let t=s.skinTones.length;s.skins=Array(t);for(let e=0;e<t;e++)s.skins[e]={tone:s.skinTones[e],unicode:s.skinUnicodes[e],version:s.skinVersions[e]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Mi(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function tl(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||el.some(t=>!(t in s[0])))throw new Error("Emoji data is in the wrong format")}function Pi(s,t){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+s.status)}async function nl(s){let t=await fetch(s,{method:"HEAD"});Pi(t,s);let e=t.headers.get("etag");return Mi(e),e}async function fs(s){let t=await fetch(s);Pi(t,s);let e=t.headers.get("etag");Mi(e);let n=await t.json();return tl(n),[e,n]}function sl(s){for(var t="",e=new Uint8Array(s),n=e.byteLength,i=-1;++i<n;)t+=String.fromCharCode(e[i]);return t}function ol(s){for(var t=s.length,e=new ArrayBuffer(t),n=new Uint8Array(e),i=-1;++i<t;)n[i]=s.charCodeAt(i);return e}async function Di(s){let t=JSON.stringify(s),e=ol(t),n=await crypto.subtle.digest("SHA-1",e),i=sl(n);return btoa(i)}async function il(s,t){let e,n=await nl(t);if(!n){let i=await fs(t);n=i[0],e=i[1],n||(n=await Di(e))}await Ha(s,t,n)||(e||(e=(await fs(t))[1]),await Ai(s,e,t,n))}async function rl(s,t){let[e,n]=await fs(t);e||(e=await Di(n)),await Ai(s,n,t,e)}async function al(s,t){try{await il(s,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var ka,$a,et,ht,gs,Ea,vi,_a,yi,Ta,Ca,wi,hs,yn,mi,ft,ms,ki,Aa,Sa,Ma,ps,vn,wn,Oa,ja,xn,Xa,Qa,el,pt,ys=Sn(()=>{ka=1,$a=1,et="emoji",ht="keyvalue",gs="favorites",Ea="tokens",vi="tokens",_a="unicode",yi="count",Ta="group",Ca="order",wi="group-order",hs="eTag",yn="url",mi="skinTone",ft="readonly",ms="readwrite",ki="skinUnicodes",Aa="skinUnicodes",Sa="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Ma="en";ps={},vn={},wn={};Oa=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);ja=2;xn="";Xa=["name","url"];Qa=typeof wrappedJSObject<"u";el=["annotation","emoji","group","order","version"];pt=class{constructor({dataSource:t=Sa,locale:e=Ma,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=xi(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Ra(this._dbName);Ba(this._dbName,this._clear);let e=this.dataSource;await Ua(t)?await rl(t,e):this._lazyUpdate=al(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return us(t),await this.ready(),bi(await Ka(this._db,t)).map(Mt)}async getEmojiBySearchQuery(t){bn(t),await this.ready();let e=this._custom.search(t),n=bi(await Si(this._db,t)).map(Mt);return[...e,...n]}async getEmojiByShortcode(t){bn(t),await this.ready();let e=this._custom.byShortcode(t);return e||Mt(await Wa(this._db,t))}async getEmojiByUnicodeOrName(t){bn(t),await this.ready();let e=this._custom.byName(t);return e||Mt(await qa(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await vs(this._db,ht,mi)||0}async setPreferredSkinTone(t){return us(t),await this.ready(),Va(this._db,ht,mi,t)}async incrementFavoriteEmojiCount(t){return bn(t),await this.ready(),Ga(this._db,t)}async getTopFavoriteEmoji(t){return us(t),await this.ready(),(await Ya(this._db,this._custom,t)).map(Mt)}set customEmoji(t){this._custom=xi(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await bs(this._dbName)}async delete(){await this._shutdown(),await Ia(this._dbName)}}});function Ri(s){return s.unicode.includes("‍")}function ml(s){let t=Ii(s,"#000"),e=Ii(s,"#fff");return t&&e&&gl(t,e)}function bl(){let s=Object.entries(cl);try{for(let[t,e]of s)if(ml(t))return e}catch{}finally{}return s[0][1]}function $l(s,t){if(t===0)return s;let e=s.indexOf(yl);return e!==-1?s.substring(0,e)+String.fromCodePoint(wl+t-1)+s.substring(e):(s.endsWith(xl)&&(s=s.substring(0,s.length-1)),s+vl+String.fromCodePoint(kl+t-1))}function Pe(s){s.preventDefault(),s.stopPropagation()}function Es(s,t,e){return t+=s?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function Ki(s,t){let e=new Set,n=[];for(let i of s){let o=t(i);e.has(o)||(e.add(o),n.push(i))}return n}function El(s,t){let e=n=>{let i={};for(let o of n)typeof o.tone=="number"&&o.version<=t&&(i[o.tone]=o.unicode);return i};return s.map(({unicode:n,skins:i,shortcodes:o,url:r,name:a,category:c,annotation:l})=>({unicode:n,name:a,shortcodes:o,url:r,category:c,annotation:l,id:n||a,skins:i&&e(i)}))}function Tl(s,t,e){let n;_l?(n=new ResizeObserver(e),n.observe(s)):$n(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function Bi(s){{let t=document.createRange();return t.selectNode(s.firstChild),t.getBoundingClientRect().width}}function Oi(s,t,e){let n=Bi(t);if(!n){if(!tt){tt=e.cloneNode(!0);let i=getComputedStyle(e);for(let o of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])tt.style.setProperty(o,i.getPropertyValue(o),"important")}try{return document.body.appendChild(tt),tt.firstChild.nodeValue=s,Bi(tt)}finally{tt.remove()}}return n}function Al(s,t,e){let n=!0;for(let i of s){let o=e(i);if(!o)continue;typeof _s>"u"&&(_s=Oi(Cl,t,t));let a=Oi(i.unicode,o,t)/1.8<_s;Ss.set(i.unicode,a),a||(n=!1)}return n}function Sl(s){return Ki(s,t=>t)}function Ml(s){s&&(s.scrollTop=0)}function Pt(s,t,e){let n=s.get(t);return n||(n=e(),s.set(t,n)),n}function ji(s){return""+s}function Pl(s){let t=document.createElement("template");return t.innerHTML=s,t}function Bl(s,t){Il?s.replaceChildren(...t):(s.innerHTML="",s.append(...t))}function Ol(s,t){let e=s.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function jl(s,t){let{targetNode:e}=t,{targetParentNode:n}=t,i=!1;n?i=Ol(n,s):(i=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),i&&Bl(n,s)}function Nl(s,t){for(let e of t){let{targetNode:n,currentExpression:i,binding:{expressionIndex:o,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,l=s[o];if(i!==l)if(e.currentExpression=l,r)if(l===null)n.removeAttribute(r);else{let d=a+ji(l)+c;n.setAttribute(r,d)}else{let d;Array.isArray(l)?jl(l,e):l instanceof Element?(d=l,n.replaceWith(d)):n.nodeValue=ji(l),d&&(e.targetNode=d)}}}function zl(s){let t="",e=!1,n=!1,i=-1,o=new Map,r=[],a=0;for(let l=0,d=s.length;l<d;l++){let u=s[l];if(t+=u.slice(a),l===d-1)break;for(let p=0;p<u.length;p++)switch(u.charAt(p)){case"<":{u.charAt(p+1)==="/"?r.pop():(e=!0,r.push(++i));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let h=r[r.length-1],g=Pt(o,h,()=>[]),A,b,k;if(n){let p=/(\S+)="?([^"=]*)$/.exec(u);A=p[1],b=p[2];let I=/^([^">]*)("?)/.exec(s[l+1]);k=I[1],t=t.slice(0,-1*p[0].length),a=I[0].length}else a=0;let S={attributeName:A,attributeValuePre:b,attributeValuePost:k,expressionIndex:l};g.push(S),!e&&!n&&(t+=" ")}return{template:Pl(t),elementsToBindings:o}}function Ni(s,t,e){for(let n=0;n<s.length;n++){let i=s[n],o=i.attributeName?t:t.firstChild,r={binding:i,targetNode:o,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function Ul(s,t){let e=[],n;if(t.size===1&&(n=t.get(0)))Ni(n,s,e);else{let i=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT),o=s,r=-1;do{let a=t.get(++r);a&&Ni(a,o,e)}while(o=i.nextNode())}return e}function Hl(s){let{template:t,elementsToBindings:e}=Pt(Dl,s,()=>zl(s)),n=t.cloneNode(!0).content.firstElementChild,i=Ul(n,e);return function(r){return Nl(r,i),n}}function Fl(s){let t=Pt(Ll,s,()=>new Map),e=Rl;function n(o,...r){let a=Pt(t,o,()=>new Map);return Pt(a,e,()=>Hl(o))(r)}function i(o,r,a){return o.map((c,l)=>{let d=e;e=a(c);try{return r(c,l)}finally{e=d}})}return{map:i,html:n}}function Kl(s,t,e,n,i,o,r,a,c){let{labelWithSkin:l,titleForEmoji:d,unicodeWithSkin:u}=e,{html:h,map:g}=Fl(t);function A(p,I,K){return g(p,(X,le)=>h`<button role="${I?"option":"menuitem"}" aria-selected="${I?le===t.activeSearchItem:null}" aria-label="${l(X,t.currentSkinTone)}" title="${d(X)}" class="${"emoji"+(I&&le===t.activeSearchItem?" active":"")+(X.unicode?"":" custom-emoji")}" id="${`${K}-${X.id}`}" style="${X.unicode?null:`--custom-emoji-background: url(${JSON.stringify(X.url)})`}">${X.unicode?u(X,t.currentSkinTone):""}</button>`,X=>`${K}-${X.id}`)}let k=h`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${g(t.skinTones,(p,I)=>h`<div id="skintone-${I}" class="emoji ${I===t.activeSkinTone?"active":""}" aria-selected="${I===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[I]}" aria-label="${t.i18n.skinTones[I]}">${p}</div>`,p=>p)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${g(t.groups,p=>h`<button role="tab" class="nav-button" aria-controls="tab-${p.id}" aria-label="${t.i18n.categories[p.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===p.id}" title="${t.i18n.categories[p.name]}" data-group-id="${p.id}"><div class="nav-emoji emoji">${p.emoji}</div></button>`,p=>p.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${g(t.currentEmojisWithCategories,(p,I)=>h`<div><div id="menu-label-${I}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:p.category?p.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${I!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(p.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${I}" id="${t.searchMode?"search-results":null}">${A(p.emojis,t.searchMode,"emo")}</div></div>`,p=>p.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${A(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,S=(p,I)=>{for(let K of s.querySelectorAll(`[${p}]`))I(K,K.getAttribute(p))};if(c){s.appendChild(k);for(let p of["click","focusout","input","keydown","keyup"])S(`data-on-${p}`,(I,K)=>{I.addEventListener(p,n[K])});S("data-ref",(p,I)=>{o[I]=p}),r.addEventListener("abort",()=>{s.removeChild(k)})}S("data-action",(p,I)=>{let K=a.get(I);K||a.set(I,K=new WeakSet),K.has(p)||(K.add(p),i[I](p))})}function Wl(s){let t=!1,e,n=new Map,i=new Set,o,r=()=>{if(t)return;let l=[...i];i.clear();try{for(let d of l)d()}finally{o=!1,i.size&&(o=!0,En(r))}},a=new Proxy({},{get(l,d){if(e){let u=n.get(d);u||(u=new Set,n.set(d,u)),u.add(e)}return l[d]},set(l,d,u){if(l[d]!==u){l[d]=u;let h=n.get(d);if(h){for(let g of h)i.add(g);o||(o=!0,En(r))}}return!0}}),c=l=>{let d=()=>{let u=e;e=d;try{return l()}finally{e=u}};return d()};return s.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function Ts(s,t,e){if(s.length!==t.length)return!1;for(let n=0;n<s.length;n++)if(!e(s[n],t[n]))return!1;return!0}function ql(s,t,e){{let n=s.closest(".tabpanel"),i=zi.get(n);i||(i=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),zi.set(n,i),t.addEventListener("abort",()=>{i.disconnect()})),i.observe(s)}}function Vl(s,t){let e={},n=new AbortController,i=n.signal,{state:o,createEffect:r}=Wl(i),a=new Map;kn(o,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),kn(o,t),kn(o,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:hl,isRtl:!1,currentGroupIndex:0,groups:ws,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{o.currentGroup!==o.groups[o.currentGroupIndex]&&(o.currentGroup=o.groups[o.currentGroupIndex])});let c=x=>{s.getElementById(x).focus()},l=x=>s.getElementById(`emo-${x.id}`),d=(x,C)=>{e.rootElement.dispatchEvent(new CustomEvent(x,{detail:C,bubbles:!0,composed:!0}))},u=(x,C)=>x.id===C.id,h=(x,C)=>{let{category:w,emojis:R}=x,{category:V,emojis:te}=C;return w!==V?!1:Ts(R,te,u)},g=x=>{Ts(o.currentEmojis,x,u)||(o.currentEmojis=x)},A=x=>{o.searchMode!==x&&(o.searchMode=x)},b=x=>{Ts(o.currentEmojisWithCategories,x,h)||(o.currentEmojisWithCategories=x)},k=(x,C)=>C&&x.skins&&x.skins[C]||x.unicode,I={labelWithSkin:(x,C)=>Sl([x.name||k(x,C),x.annotation,...x.shortcodes||Cs].filter(Boolean)).join(", "),titleForEmoji:x=>x.annotation||(x.shortcodes||Cs).join(", "),unicodeWithSkin:k},K={onClickSkinToneButton:xe,onEmojiClick:ie,onNavClick:L,onNavKeydown:Z,onSearchKeydown:N,onSkinToneOptionsClick:q,onSkinToneOptionsFocusOut:U,onSkinToneOptionsKeydown:m,onSkinToneOptionsKeyup:B,onSearchInput:O},X={calculateEmojiGridStyle:$,updateOnIntersection:y},le=!0;r(()=>{Kl(s,o,I,K,X,e,i,a,le),le=!1}),o.emojiVersion||$s().then(x=>{x||(o.message=o.i18n.emojiUnsupportedMessage)}),r(()=>{async function x(){let C=!1,w=setTimeout(()=>{C=!0,o.message=o.i18n.loadingMessage},dl);try{await o.database.ready(),o.databaseLoaded=!0}catch(R){console.error(R),o.message=o.i18n.networkErrorMessage}finally{clearTimeout(w),C&&(C=!1,o.message="")}}o.database&&x()}),r(()=>{o.pickerStyle=`
      --num-groups: ${o.groups.length}; 
      --indicator-opacity: ${o.searchMode?0:1}; 
      --num-skintones: ${Li};`}),r(()=>{o.customEmoji&&o.database&&v()}),r(()=>{o.customEmoji&&o.customEmoji.length?o.groups!==As&&(o.groups=As):o.groups!==ws&&(o.currentGroupIndex&&o.currentGroupIndex--,o.groups=ws)}),r(()=>{async function x(){o.databaseLoaded&&(o.currentSkinTone=await o.database.getPreferredSkinTone())}x()}),r(()=>{o.skinTones=Array(Li).fill().map((x,C)=>$l(o.skinToneEmoji,C))}),r(()=>{o.skinToneButtonText=o.skinTones[o.currentSkinTone]}),r(()=>{o.skinToneButtonLabel=o.i18n.skinToneLabel.replace("{skinTone}",o.i18n.skinTones[o.currentSkinTone])}),r(()=>{async function x(){let{database:C}=o,w=(await Promise.all(pl.map(R=>C.getEmojiByUnicodeOrName(R)))).filter(Boolean);o.defaultFavoriteEmojis=w}o.databaseLoaded&&x()});function v(){let{customEmoji:x,database:C}=o,w=x||Cs;C.customEmoji!==w&&(C.customEmoji=w)}r(()=>{async function x(){v();let{database:C,defaultFavoriteEmojis:w,numColumns:R}=o,V=await C.getTopFavoriteEmoji(R),te=await W(Ki([...V,...w],Q=>Q.unicode||Q.name).slice(0,R));o.currentFavorites=te}o.databaseLoaded&&o.defaultFavoriteEmojis&&x()});function $(x){Tl(x,i,()=>{{let C=getComputedStyle(e.rootElement),w=parseInt(C.getPropertyValue("--num-columns"),10),R=C.getPropertyValue("direction")==="rtl";o.numColumns=w,o.isRtl=R}})}function y(x){ql(x,i,C=>{for(let{target:w,isIntersecting:R}of C)w.classList.toggle("onscreen",R)})}r(()=>{async function x(){let{searchText:C,currentGroup:w,databaseLoaded:R,customEmoji:V}=o;if(!R)o.currentEmojis=[],o.searchMode=!1;else if(C.length>=ll){let te=await ee(C);o.searchText===C&&(g(te),A(!0))}else{let{id:te}=w;if(te!==-1||V&&V.length){let Q=await J(te);o.currentGroup.id===te&&(g(Q),A(!1))}}}x()});let E=()=>{$n(()=>Ml(e.tabpanelElement))};r(()=>{let{currentEmojis:x,emojiVersion:C}=o,w=x.filter(R=>R.unicode).filter(R=>Ri(R)&&!Ss.has(R.unicode));if(!C&&w.length)g(x),$n(()=>_(w));else{let R=C?x:x.filter(M);g(R),E()}});function _(x){Al(x,e.baselineEmoji,l)?E():o.currentEmojis=[...o.currentEmojis]}function M(x){return!x.unicode||!Ri(x)||Ss.get(x.unicode)}async function j(x){let C=o.emojiVersion||await $s();return x.filter(({version:w})=>!w||w<=C)}async function W(x){return El(x,o.emojiVersion||await $s())}async function J(x){let C=x===-1?o.customEmoji:await o.database.getEmojiByGroup(x);return W(await j(C))}async function ee(x){return W(await j(await o.database.getEmojiBySearchQuery(x)))}r(()=>{}),r(()=>{function x(){let{searchMode:w,currentEmojis:R}=o;if(w)return[{category:"",emojis:R}];let V=new Map;for(let te of R){let Q=te.category||"",ve=V.get(Q);ve||(ve=[],V.set(Q,ve)),ve.push(te)}return[...V.entries()].map(([te,Q])=>({category:te,emojis:Q})).sort((te,Q)=>o.customCategorySorting(te.category,Q.category))}let C=x();b(C)}),r(()=>{o.activeSearchItemId=o.activeSearchItem!==-1&&o.currentEmojis[o.activeSearchItem].id}),r(()=>{let{rawSearchText:x}=o;Hi(()=>{o.searchText=(x||"").trim(),o.activeSearchItem=-1})});function N(x){if(!o.searchMode||!o.currentEmojis.length)return;let C=w=>{Pe(x),o.activeSearchItem=Es(w,o.activeSearchItem,o.currentEmojis)};switch(x.key){case"ArrowDown":return C(!1);case"ArrowUp":return C(!0);case"Enter":if(o.activeSearchItem===-1)o.activeSearchItem=0;else return Pe(x),ue(o.currentEmojis[o.activeSearchItem].id)}}function L(x){let{target:C}=x,w=C.closest(".nav-button");if(!w)return;let R=parseInt(w.dataset.groupId,10);e.searchElement.value="",o.rawSearchText="",o.searchText="",o.activeSearchItem=-1,o.currentGroupIndex=o.groups.findIndex(V=>V.id===R)}function Z(x){let{target:C,key:w}=x,R=V=>{V&&(Pe(x),V.focus())};switch(w){case"ArrowLeft":return R(C.previousElementSibling);case"ArrowRight":return R(C.nextElementSibling);case"Home":return R(C.parentElement.firstElementChild);case"End":return R(C.parentElement.lastElementChild)}}async function H(x){let C=await o.database.getEmojiByUnicodeOrName(x),w=[...o.currentEmojis,...o.currentFavorites].find(V=>V.id===x),R=w.unicode&&k(w,o.currentSkinTone);return await o.database.incrementFavoriteEmojiCount(x),{emoji:C,skinTone:o.currentSkinTone,...R&&{unicode:R},...w.name&&{name:w.name}}}async function ue(x){let C=H(x);d("emoji-click-sync",C),d("emoji-click",await C)}function ie(x){let{target:C}=x;if(!C.classList.contains("emoji"))return;Pe(x);let w=C.id.substring(4);ue(w)}function ce(x){o.currentSkinTone=x,o.skinTonePickerExpanded=!1,c("skintone-button"),d("skin-tone-change",{skinTone:x}),o.database.setPreferredSkinTone(x)}function q(x){let{target:{id:C}}=x,w=C&&C.match(/^skintone-(\d)/);if(!w)return;Pe(x);let R=parseInt(w[1],10);ce(R)}function xe(x){o.skinTonePickerExpanded=!o.skinTonePickerExpanded,o.activeSkinTone=o.currentSkinTone,o.skinTonePickerExpanded&&(Pe(x),$n(()=>c("skintone-list")))}r(()=>{o.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{o.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):o.skinTonePickerExpandedAfterAnimation=!1});function m(x){if(!o.skinTonePickerExpanded)return;let C=async w=>{Pe(x),o.activeSkinTone=w};switch(x.key){case"ArrowUp":return C(Es(!0,o.activeSkinTone,o.skinTones));case"ArrowDown":return C(Es(!1,o.activeSkinTone,o.skinTones));case"Home":return C(0);case"End":return C(o.skinTones.length-1);case"Enter":return Pe(x),ce(o.activeSkinTone);case"Escape":return Pe(x),o.skinTonePickerExpanded=!1,c("skintone-button")}}function B(x){if(o.skinTonePickerExpanded)switch(x.key){case" ":return Pe(x),ce(o.activeSkinTone)}}async function U(x){let{relatedTarget:C}=x;(!C||C.id!=="skintone-list")&&(o.skinTonePickerExpanded=!1)}function O(x){o.rawSearchText=x.target.value}return{$set(x){kn(o,x)},$destroy(){n.abort()}}}function Ui(s){s instanceof nt||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}var As,ws,ll,Li,Hi,cl,dl,ul,hl,pl,Fi,fl,Ii,gl,ks,$s,Ss,xl,vl,yl,wl,kl,$n,_l,Cl,_s,tt,Dl,Ll,Rl,Il,En,zi,Cs,kn,Gl,Yl,Jl,Xl,Wi,Zl,nt,qi,Vi=Sn(()=>{ys();As=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,t,e])=>({id:s,emoji:t,name:e})),ws=As.slice(1),ll=2,Li=6,Hi=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;cl={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},dl=1e3,ul="🖐️",hl=8,pl=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Fi='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',fl=(s,t)=>s<t?-1:s>t?1:0,Ii=(s,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${Fi}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(s,0,0),n.getImageData(0,0,1,1).data},gl=(s,t)=>{let e=[...s].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};$s=()=>(ks||(ks=new Promise(s=>Hi(()=>s(bl())))),ks),Ss=new Map,xl="️",vl="\uD83C",yl="‍",wl=127995,kl=57339;$n=requestAnimationFrame,_l=typeof ResizeObserver=="function";Cl="😀";Dl=new WeakMap,Ll=new WeakMap,Rl=Symbol("un-keyed"),Il="replaceChildren"in Element.prototype;En=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);zi=new WeakMap;Cs=[],{assign:kn}=Object;Gl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Yl="en",Jl={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Xl=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',Wi=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Zl=`:host{--emoji-font-family:${Fi}}`,nt=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Xl+Zl,this.shadowRoot.appendChild(e),this._ctx={locale:Yl,dataSource:Gl,skinToneEmoji:ul,customCategorySorting:fl,customEmoji:null,i18n:Jl,emojiVersion:null,...t};for(let n of Wi)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){Ui(this),this._cmp||(this._cmp=Vl(this.shadowRoot,this._ctx))}disconnectedCallback(){Ui(this),En(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(i,o)=>o.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new pt({locale:t,dataSource:e}))}_dbFlush(){En(()=>this._dbCreate())}},qi={};for(let s of Wi)qi[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(t){if(s==="database")throw new Error("database is read-only");this._set(s,t)}};Object.defineProperties(nt.prototype,qi);customElements.get("emoji-picker")||customElements.define("emoji-picker",nt)});var Gi={};$r(Gi,{Database:()=>pt,Picker:()=>nt});var Yi=Sn(()=>{Vi();ys()});function Hs(s){return{type:"auth",access_token:s}}function Fs(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Ks(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function Mn(s){return{type:"unsubscribe_events",subscription:s}}function Ws(){return{type:"ping"}}function qs(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function Gs(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let i=e[n].split("="),o=decodeURIComponent(i[0]),r=i.length>1?decodeURIComponent(i[1]):void 0;t[o]=r}return t}var Ys=(s,t,e,n)=>{let[i,o,r]=s.split(".",3);return Number(i)>t||Number(i)===t&&(n===void 0?Number(o)>=e:Number(o)>e)||n!==void 0&&Number(i)===t&&Number(o)===e&&Number(r)>=n};var zt=!1,_r="auth_required",Tr="auth_invalid",Cr="auth_ok";function Xs(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;zt&&console.log("[Auth phase] Initializing",n);function i(o,r,a){zt&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),l=!1,d=()=>{if(c.removeEventListener("close",d),l){a(2);return}if(o===0){a(1);return}let g=o===-1?-1:o-1;setTimeout(()=>i(g,r,a),1e3)},u=async g=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(Hs(t.accessToken)))}catch(A){l=A===2,c.close()}},h=async g=>{let A=JSON.parse(g.data);switch(zt&&console.log("[Auth phase] Received",A),A.type){case Tr:l=!0,c.close();break;case Cr:c.removeEventListener("open",u),c.removeEventListener("message",h),c.removeEventListener("close",d),c.removeEventListener("error",d),c.haVersion=A.ha_version,Ys(c.haVersion,2022,9)&&c.send(JSON.stringify(Fs())),r(c);break;default:zt&&A.type!==_r&&console.warn("[Auth phase] Unhandled message",A)}};c.addEventListener("open",u),c.addEventListener("message",h),c.addEventListener("close",d),c.addEventListener("error",d)}return new Promise((o,r)=>i(s.setupRetry,o,r))}var bt=!1,Ut=class{constructor(t,e){this._handleMessage=n=>{let i=JSON.parse(n.data);Array.isArray(i)||(i=[i]),i.forEach(o=>{bt&&console.log("Received",o);let r=this.commands.get(o.id);switch(o.type){case"event":r?r.callback(o.event):(console.warn(`Received event for unknown subscription ${o.id}. Unsubscribing.`),this.sendMessagePromise(Mn(o.id)).catch(a=>{bt&&console.warn(` Error unsubsribing from unknown subscription ${o.id}`,a)}));break;case"result":r&&(o.success?(r.resolve(o.result),"subscribe"in r||this.commands.delete(o.id)):(r.reject(o.error),this.commands.delete(o.id)));break;case"pong":r?(r.resolve(),this.commands.delete(o.id)):console.warn(`Received unknown pong response ${o.id}`);break;default:bt&&console.warn("Unhandled message",o)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(qs(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),o=r=>{setTimeout(async()=>{if(!this.closeRequested){bt&&console.log("Trying to reconnect");try{let a=await i.createSocket(i);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let l of c)l.reject&&l.reject(3)}a===2?this.fireEvent("reconnect-error",a):o(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),o(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(o=>{i.unsubscribe=o,i.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let i of n)i.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let i=n.indexOf(e);i!==-1&&n.splice(i,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,Ks(e))}ping(){return this.sendMessagePromise(Ws())}sendMessage(t,e){if(!this.connected)throw 3;if(bt&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(o){n(o)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:n}),this.sendMessage(t,i)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((o,r)=>{this._queuedMessages.push({resolve:o,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((o,r)=>{let a=this._genCmdId();i={resolve:o,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Mn(a)),this.commands.delete(a)}},this.commands.set(a,i);try{this.sendMessage(e,a)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var Ar=()=>`${location.protocol}//${location.host}/`,Sr=s=>s*1e3+Date.now();function Mr(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function Pr(s,t,e,n){let i=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(i+=`&client_id=${encodeURIComponent(t)}`),n&&(i+=`&state=${encodeURIComponent(n)}`),i}function Dr(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Pr(s,t,e,n)}async function eo(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let i=new FormData;t!==null&&i.append("client_id",t),Object.keys(e).forEach(a=>{i.append(a,e[a])});let o=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!o.ok)throw o.status===400||o.status===403?2:new Error("Unable to fetch tokens");let r=await o.json();return r.hassUrl=s,r.clientId=t,r.expires=Sr(r.expires_in),r}function Qs(s,t,e){return eo(s,t,{code:e,grant_type:"authorization_code"})}function Lr(s){return btoa(JSON.stringify(s))}function Rr(s){return JSON.parse(atob(s))}var Pn=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await eo(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function to(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:Ar(),i=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await Qs(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let o=Gs(location.search.substr(1));if("auth_callback"in o){let r=Rr(o.state);if(i&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await Qs(r.hassUrl,r.clientId,o.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new Pn(t,s.saveTokens);if(e===void 0)throw 4;return Dr(e,n,s.redirectUrl||Mr(),Lr({hassUrl:e,clientId:n})),new Promise(()=>{})}async function no(s){let t=Object.assign({setupRetry:0,createSocket:Xs},s),e=await t.createSocket(t);return new Ut(e,t)}function z(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function He(s){let t=Math.floor(Math.round(s)/60)%24;return`${z(s)} ${t<12?"AM":"PM"}`}function so(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function vt(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function oo(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Ir=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Br=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Or=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Ht(s){return new Date(`${s}T12:00:00Z`)}function Te(s){let t=Ht(s);return`${Ir.format(t)}, ${Or.format(t)}`}function ge(s){return Br.format(Ht(s))}function Ce(s,t){return Math.round((Ht(t).getTime()-Ht(s).getTime())/864e5)}function xt(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return xt("UTC",t)}let n=i=>e.find(o=>o.type===i)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Ft(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let i=xt(e,s),o=xt(e,t).date;return i.date===o?`at ${He(i.minutes)}`:`on ${ge(i.date)} at ${He(i.minutes)}`}var ae=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},Fe="mydashlight",jr=7,io=3e4;function Dn(s){if(s instanceof ae)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new ae(String(t.code??"error"),t.message)}return typeof s=="number"?new ae("connection_lost","Lost the connection to Home Assistant."):new ae("error",String(s))}var Kt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new ae("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},io),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new ae("not_running","MyDashLight isn’t running right now."))},{type:`${Fe}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:"get_plan",service_data:{days:jr},return_response:!0});this.emit(t.response)}catch(t){this.fail(Dn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:t,service_data:e})}catch(n){throw Dn(n)}this.pushing||await this.refresh()}setRide(t,e,n,i){return this.call("set_ride",{event:t,side:e,driver:n,scope:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:oo(e),scope:n})}setTakeAlong(t,e,n,i="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:i})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,i=null,o=async()=>{try{let r=await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:"get_chores",service_data:{},return_response:!0});e||t(r.response??null)}catch{e||t(null)}};return(async()=>{try{let r=await this.conn.subscribeMessage(a=>{e||t(a.chores)},{type:`${Fe}/chores/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):n=r}catch{if(e)return;o(),i=setInterval(()=>void o(),io)}})(),()=>{e=!0,i&&clearInterval(i),n&&n().catch(()=>{})}}watchLunch(t){let e=!1,n=null;return(async()=>{try{let i=await this.conn.subscribeMessage(o=>{e||t(o.lunch)},{type:`${Fe}/lunch/subscribe`},{resubscribe:!0});e?i().catch(()=>{}):n=i}catch{e||t(null)}})(),()=>{e=!0,n&&n().catch(()=>{})}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,i){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:i})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Fe,service:t,service_data:e})}catch(n){throw Dn(n)}}};var Wt=globalThis,qt=Wt.ShadowRoot&&(Wt.ShadyCSS===void 0||Wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ln=Symbol(),ro=new WeakMap,yt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Ln)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(qt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=ro.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ro.set(e,t))}return t}toString(){return this.cssText}},ao=s=>new yt(typeof s=="string"?s:s+"",void 0,Ln),Ke=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,i,o)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new yt(e,s,Ln)},lo=(s,t)=>{if(qt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),i=Wt.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=e.cssText,s.appendChild(n)}},Rn=qt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return ao(e)})(s):s;var{is:Nr,defineProperty:zr,getOwnPropertyDescriptor:Ur,getOwnPropertyNames:Hr,getOwnPropertySymbols:Fr,getPrototypeOf:Kr}=Object,Vt=globalThis,co=Vt.trustedTypes,Wr=co?co.emptyScript:"",qr=Vt.reactiveElementPolyfillSupport,wt=(s,t)=>s,In={toAttribute(s,t){switch(t){case Boolean:s=s?Wr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},ho=(s,t)=>!Nr(s,t),uo={attribute:!0,type:String,converter:In,reflect:!1,useDefault:!1,hasChanged:ho};Symbol.metadata??=Symbol("metadata"),Vt.litPropertyMetadata??=new WeakMap;var Le=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=uo){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(t,n,e);i!==void 0&&zr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){let{get:i,set:o}=Ur(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let a=i?.call(this);o?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??uo}static _$Ei(){if(this.hasOwnProperty(wt("elementProperties")))return;let t=Kr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(wt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(wt("properties"))){let e=this.properties,n=[...Hr(e),...Fr(e)];for(let i of n)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,i]of e)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let i=this._$Eu(e,n);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)e.unshift(Rn(i))}else t!==void 0&&e.push(Rn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lo(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){let o=(n.converter?.toAttribute!==void 0?n.converter:In).toAttribute(e,n.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=n.getPropertyOptions(i),r=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:In;this._$Em=i;let a=r.fromAttribute(e,o.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,n,i=!1,o){if(t!==void 0){let r=this.constructor;if(i===!1&&(o=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??ho)(o,e)||n.useDefault&&n.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:o},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),o!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,o]of n){let{wrapped:r}=o,a=this[i];r!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,o,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Le.elementStyles=[],Le.shadowRootOptions={mode:"open"},Le[wt("elementProperties")]=new Map,Le[wt("finalized")]=new Map,qr?.({ReactiveElement:Le}),(Vt.reactiveElementVersions??=[]).push("2.1.2");var On=globalThis,po=s=>s,Gt=On.trustedTypes,fo=Gt?Gt.createPolicy("lit-html",{createHTML:s=>s}):void 0,jn="$lit$",Re=`lit$${Math.random().toFixed(9).slice(2)}$`,Nn="?"+Re,Vr=`<${Nn}>`,Ve=document,$t=()=>Ve.createComment(""),Et=s=>s===null||typeof s!="object"&&typeof s!="function",zn=Array.isArray,yo=s=>zn(s)||typeof s?.[Symbol.iterator]=="function",Bn=`[ 	
\f\r]`,kt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,go=/-->/g,mo=/>/g,We=RegExp(`>|${Bn}(?:([^\\s"'>=/]+)(${Bn}*=${Bn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),bo=/'/g,xo=/"/g,wo=/^(?:script|style|textarea|title)$/i,Un=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),f=Un(1),de=Un(2),cd=Un(3),Ie=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),vo=new WeakMap,qe=Ve.createTreeWalker(Ve,129);function ko(s,t){if(!zn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return fo!==void 0?fo.createHTML(t):t}var $o=(s,t)=>{let e=s.length-1,n=[],i,o=t===2?"<svg>":t===3?"<math>":"",r=kt;for(let a=0;a<e;a++){let c=s[a],l,d,u=-1,h=0;for(;h<c.length&&(r.lastIndex=h,d=r.exec(c),d!==null);)h=r.lastIndex,r===kt?d[1]==="!--"?r=go:d[1]!==void 0?r=mo:d[2]!==void 0?(wo.test(d[2])&&(i=RegExp("</"+d[2],"g")),r=We):d[3]!==void 0&&(r=We):r===We?d[0]===">"?(r=i??kt,u=-1):d[1]===void 0?u=-2:(u=r.lastIndex-d[2].length,l=d[1],r=d[3]===void 0?We:d[3]==='"'?xo:bo):r===xo||r===bo?r=We:r===go||r===mo?r=kt:(r=We,i=void 0);let g=r===We&&s[a+1].startsWith("/>")?" ":"";o+=r===kt?c+Vr:u>=0?(n.push(l),c.slice(0,u)+jn+c.slice(u)+Re+g):c+Re+(u===-2?a:g)}return[ko(s,o+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},_t=class s{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let o=0,r=0,a=t.length-1,c=this.parts,[l,d]=$o(t,e);if(this.el=s.createElement(l,n),qe.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=qe.nextNode())!==null&&c.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(jn)){let h=d[r++],g=i.getAttribute(u).split(Re),A=/([.?@])?(.*)/.exec(h);c.push({type:1,index:o,name:A[2],strings:g,ctor:A[1]==="."?Jt:A[1]==="?"?Xt:A[1]==="@"?Zt:Ye}),i.removeAttribute(u)}else u.startsWith(Re)&&(c.push({type:6,index:o}),i.removeAttribute(u));if(wo.test(i.tagName)){let u=i.textContent.split(Re),h=u.length-1;if(h>0){i.textContent=Gt?Gt.emptyScript:"";for(let g=0;g<h;g++)i.append(u[g],$t()),qe.nextNode(),c.push({type:2,index:++o});i.append(u[h],$t())}}}else if(i.nodeType===8)if(i.data===Nn)c.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(Re,u+1))!==-1;)c.push({type:7,index:o}),u+=Re.length-1}o++}}static createElement(t,e){let n=Ve.createElement("template");return n.innerHTML=t,n}};function Ge(s,t,e=s,n){if(t===Ie)return t;let i=n!==void 0?e._$Co?.[n]:e._$Cl,o=Et(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(s),i._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=i:e._$Cl=i),i!==void 0&&(t=Ge(s,i._$AS(s,t.values),i,n)),t}var Yt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??Ve).importNode(e,!0);qe.currentNode=i;let o=qe.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let l;c.type===2?l=new it(o,o.nextSibling,this,t):c.type===1?l=new c.ctor(o,c.name,c.strings,this,t):c.type===6&&(l=new Qt(o,this,t)),this._$AV.push(l),c=n[++a]}r!==c?.index&&(o=qe.nextNode(),r++)}return qe.currentNode=Ve,i}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},it=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ge(this,t,e),Et(t)?t===T||t==null||t===""?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==Ie&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):yo(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==T&&Et(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ve.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=_t.createElement(ko(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new Yt(i,this),r=o.u(this.options);o.p(e),this.T(r),this._$AH=o}}_$AC(t){let e=vo.get(t.strings);return e===void 0&&vo.set(t.strings,e=new _t(t)),e}k(t){zn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,i=0;for(let o of t)i===e.length?e.push(n=new s(this.O($t()),this.O($t()),this,this.options)):n=e[i],n._$AI(o),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=po(t).nextSibling;po(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ye=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,o){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=T}_$AI(t,e=this,n,i){let o=this.strings,r=!1;if(o===void 0)t=Ge(this,t,e,0),r=!Et(t)||t!==this._$AH&&t!==Ie,r&&(this._$AH=t);else{let a=t,c,l;for(t=o[0],c=0;c<o.length-1;c++)l=Ge(this,a[n+c],e,c),l===Ie&&(l=this._$AH[c]),r||=!Et(l)||l!==this._$AH[c],l===T?t=T:t!==T&&(t+=(l??"")+o[c+1]),this._$AH[c]=l}r&&!i&&this.j(t)}j(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Jt=class extends Ye{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===T?void 0:t}},Xt=class extends Ye{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==T)}},Zt=class extends Ye{constructor(t,e,n,i,o){super(t,e,n,i,o),this.type=5}_$AI(t,e=this){if((t=Ge(this,t,e,0)??T)===Ie)return;let n=this._$AH,i=t===T&&n!==T||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==T&&(n===T||i);i&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Qt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Ge(this,t)}},Eo={M:jn,P:Re,A:Nn,C:1,L:$o,R:Yt,D:yo,V:Ge,I:it,H:Ye,N:Xt,U:Zt,B:Jt,F:Qt},Gr=On.litHtmlPolyfillSupport;Gr?.(_t,it),(On.litHtmlVersions??=[]).push("3.3.3");var _o=(s,t,e)=>{let n=e?.renderBefore??t,i=n._$litPart$;if(i===void 0){let o=e?.renderBefore??null;n._$litPart$=i=new it(t.insertBefore($t(),o),o,void 0,e??{})}return i._$AI(s),i};var Hn=globalThis,$e=class extends Le{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=_o(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ie}};$e._$litElement$=!0,$e.finalized=!0,Hn.litElementHydrateSupport?.({LitElement:$e});var Yr=Hn.litElementPolyfillSupport;Yr?.({LitElement:$e});(Hn.litElementVersions??=[]).push("4.2.2");var To={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Co=s=>(...t)=>({_$litDirective$:s,values:t}),en=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Jr}=Eo,Ao=s=>s;var So=()=>document.createComment(""),rt=(s,t,e)=>{let n=s._$AA.parentNode,i=t===void 0?s._$AB:t._$AA;if(e===void 0){let o=n.insertBefore(So(),i),r=n.insertBefore(So(),i);e=new Jr(o,r,s,s.options)}else{let o=e._$AB.nextSibling,r=e._$AM,a=r!==s;if(a){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==r._$AU&&e._$AP(c)}if(o!==i||a){let c=e._$AA;for(;c!==o;){let l=Ao(c).nextSibling;Ao(n).insertBefore(c,i),c=l}}}return e},je=(s,t,e=s)=>(s._$AI(t,e),s),Xr={},Mo=(s,t=Xr)=>s._$AH=t,Po=s=>s._$AH,tn=s=>{s._$AR(),s._$AA.remove()};var Do=(s,t,e)=>{let n=new Map;for(let i=t;i<=e;i++)n.set(s[i],i);return n},Be=Co(class extends en{constructor(s){if(super(s),s.type!==To.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let i=[],o=[],r=0;for(let a of s)i[r]=n?n(a,r):r,o[r]=e(a,r),r++;return{values:o,keys:i}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let i=Po(s),{values:o,keys:r}=this.dt(t,e,n);if(!Array.isArray(i))return this.ut=r,o;let a=this.ut??=[],c=[],l,d,u=0,h=i.length-1,g=0,A=o.length-1;for(;u<=h&&g<=A;)if(i[u]===null)u++;else if(i[h]===null)h--;else if(a[u]===r[g])c[g]=je(i[u],o[g]),u++,g++;else if(a[h]===r[A])c[A]=je(i[h],o[A]),h--,A--;else if(a[u]===r[A])c[A]=je(i[u],o[A]),rt(s,c[A+1],i[u]),u++,A--;else if(a[h]===r[g])c[g]=je(i[h],o[g]),rt(s,i[u],i[h]),h--,g++;else if(l===void 0&&(l=Do(r,g,A),d=Do(a,u,h)),l.has(a[u]))if(l.has(a[h])){let b=d.get(r[g]),k=b!==void 0?i[b]:null;if(k===null){let S=rt(s,i[u]);je(S,o[g]),c[g]=S}else c[g]=je(k,o[g]),rt(s,i[u],k),i[b]=null;g++}else tn(i[h]),h--;else tn(i[u]),u++;for(;g<=A;){let b=rt(s,c[A+1]);je(b,o[g]),c[g++]=b}for(;u<=h;){let b=i[u++];b!==null&&tn(b)}return this.ut=r,Mo(s,c),Ie}});var nn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function he(s){return nn[(s%nn.length+nn.length)%nn.length]}var sn="#23272E",Fn="35,39,46";var Zr=3,dn=36,Kn=12,on=8,Lo=30,Ae=16,Tt=100,at=60,qn=10,rn=30,Vn=10,Qr=150,ea=200,cn=1.4;function Ho(s,t){return s.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??dn}var ta=26,Fo=4;function Gn(s,t){let e=Math.max(Qr,ea/cn);return Math.ceil(at+Math.max(0,s-1)*qn+rn+Math.max(0,t-1)*Vn+e*(s+cn*t))}function Se(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function Ee(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ke(s){return new Map(Se(s).map((t,e)=>[t,he(e)]))}function me(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function be(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Yn(s,t){return t==="none"?"Not needed":Ee(s).includes(t)?be(s,t):t}function un(s,t){return t.own?be(s,t.own):me(s,t.kid)}var Ct={color:sn,rgb:Fn,ink:sn};function Ko(s,t){return t.own?Ct:ke(s).get(t.kid)??he(0)}function na(s,t){let e=Se(s);return t.along.map(n=>e.includes(n)?me(s,n):be(s,n))}function hn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function sa(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function an(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function Wn(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(an(t,n.from)),e.push(an(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(an(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function oa(s){let t=s.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],i=-1/0,o=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=i&&(o(),i=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),i=Math.max(i,r.en)}return o(),t}function ia(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.t)return i.t===n.t?n.y:Math.round(n.y+(t-n.t)/(i.t-n.t)*(i.y-n.y))}return s[s.length-1].y}function ra(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.y)return i.y===n.y?n.t:n.t+(t-n.y)/(i.y-n.y)*(i.t-n.t)}return s[s.length-1].t}function Wo(s,t){return ia(s.anchors,t)}function qo(s,t){return ra(s.anchors,t)}function aa(s,t){let e=Se(s),n=Ee(s),i=Math.max(t,Gn(e.length,n.length)),r=(i-at-Math.max(0,e.length-1)*qn-rn-Math.max(0,n.length-1)*Vn)/(e.length+cn*n.length||1),a=Math.floor(r),c=Math.floor(r*cn),l=new Map;for(let A of s.days)for(let b of A.events)for(let k of b.own?b.along:[b.kid]){let S=l.get(k)??[];S.some(p=>p.event_id===b.event_id&&p.calendar_id===b.calendar_id)||S.push(b),l.set(k,S)}let d=ke(s),u=[],h=at;e.forEach((A,b)=>{let k=l.get(A)??[],S=s.days.some(p=>p.events.some(I=>I.kid===A&&(I.sides.includes("drop")&&I.drop===""||I.sides.includes("pick")&&I.pick==="")));u.push({id:A,kind:"kid",x:h,w:a,name:me(s,A),dot:d.get(A).color,rgb:d.get(A).rgb,sub:`${S?"Needs a ride · ":""}${k.length} this week`,subWarn:S}),h+=a+(b<e.length-1?qn:0)});let g=h+rn/2;return h+=rn,n.forEach((A,b)=>{let k=0,S=0;for(let p of s.days){let I=p.drivers[A];I&&(k+=I.outings.length,S+=I.drive??0)}u.push({id:A,kind:"driver",x:h,w:c,name:be(s,A),dot:sn,rgb:Fn,sub:`${k} ${k===1?"trip":"trips"} this week · ${vt(S)} driving`,subWarn:!1}),h+=c+(b<n.length-1?Vn:0)}),{columns:u,sepX:g,width:i}}function la(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(t.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!o)return e;let r=i.slice(o[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function Ro(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${z(s.start)}`:e||!t?`${s.title} until ${z(s.end)}`:`${s.title} ${z(s.start)}–${z(s.end)}`}function Jn(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length+(s.unplaced?.length??0)}function Xn(s,t){let e=Ce(t,s);return e===0?"Today":e===1?"Tomorrow":""}function pe(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Io(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),i=1,o=0;for(let r of s.split(/\s+/).filter(Boolean)){let a=r.length;for(o===0?o=a:o+1+a<=n?o+=1+a:(i++,o=a);o>n;)i++,o-=n}return i}var Vo=25,ca=15,Go=3;function Bo(s){return Math.max(0,Math.min(Go,Math.floor((s-Vo)/ca)))}var da=Vo+2,Oo=20;function jo(s){return/^(\d+:\d\d)\s+Home$/.exec(s.at(-1)??"")?.[1]??null}var ln="🚗";function No(s,t){if(s===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(i,o,r,a=!1)=>({at:i,who:o,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(s))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(s))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(s))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(s))return e("",n[1],n[2])}return null}var zo={muted:0,normal:1,pending:2,problem:3};function Yo(s){let{drop:t,pick:e}=s,n=t?No(t.text,"drop"):null,i=e?No(e.text,"pick"):null;if(t&&!n||e&&!i||!n&&!i)return s;let o=[t,e].reduce((c,l)=>l&&(zo[l.tone]??1)>(zo[c]??1)?l.tone:c,(t??e).tone);if(n==="needed"&&i==="needed")return{drop:{text:`${ln} No rides yet`,tone:o},pick:null};if(n&&i&&n!=="needed"&&i!=="needed"&&n.who===i.who&&!n.extra&&!i.extra){let c=`${ln} ${n.who}${n.stays?" stays":""}`;return!n.at&&!i.at?{drop:{text:`${c} both ways`,tone:o},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${i.at}`.trimEnd(),tone:o},pick:null}}let r=(c,l)=>c==="needed"?`${l} needed`:`${l}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[n?r(n,"↓"):null,i?r(i,"↑"):null].filter(Boolean);return{drop:{text:`${ln} ${a.join(" · ")}`,tone:o},pick:null}}function Uo(s,t){let e=t-23,n=`${z(s.start)}–${z(s.end)}`+(s.arrive_by!=null?` · arrive ${z(s.arrive_by)}`:""),i=33+Io(n,e,6.6)*16,o=s.own?s.lines:Yo(s.lines);for(let r of[o.drop,o.pick])r&&(i+=2+Io(r.text,e,7)*16);return i+4}function Jo(s,t,e,n){let i=t==="compact",{columns:o,sepX:r,width:a}=aa(s,e),c=new Map(o.map(p=>[p.id,p])),l=Se(s),d=Ee(s),u=[...l,...d],h=ke(s),g=sa(s),A=p=>me(s,p),b=p=>be(s,p),k={mode:t,width:a,height:0,columns:o,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},S=0;return s.days.forEach((p,I)=>{let K=I*1440,X=new Map(p.events.map(m=>[m.id,m])),le=m=>m&&X.has(m)?{day:p.date,event:m}:null,v=Jn(p),$=p.events.length,y=Xn(p.date,n.date),E=fa(s,p,h,a);k.dayHeads.push({date:p.date,y:S,label:Te(p.date),tag:y,sub:($?`${$} ${$===1?"activity":"activities"}`:"Nothing scheduled")+(v?` · ${v} to sort out`:""),warn:v>0,h:dn+(E?E.h+Fo+2:0),allDay:E?.chips??[]}),k.anchors.push({t:K,y:S});let _=k.dayHeads[k.dayHeads.length-1],M=S+_.h+Kn,j=d.flatMap(m=>p.drivers[m]?.outings??[]);if(!$&&!j.length){k.empties.push({key:p.date,y:M,text:"Nothing planned"}),S=M+40,k.anchors.push({t:K+1439,y:S});return}let W=(m,B,U,O,x,C,w,R=m.kid)=>{let V=!!m.own&&R===m.own,te=!!m.own&&R!==m.own,Q=V?Ct:h.get(R)??he(0),ve=V?b(R):A(R),ye=te?{drop:{text:`With ${b(m.own)}`,tone:m.attending===!1?"muted":"normal"},pick:null}:w&&!m.own?Yo(m.lines):m.lines,D=V?na(s,m):[],re=(m.takes!=null?`${m.takes} min, any time ${z(m.start)}–${z(m.end)}`:`${z(m.start)}–${z(m.end)}`+(m.arrive_by!=null?` · arrive ${z(m.arrive_by)}`:""))+(D.length?` · with ${hn(D)}`:"");return{key:`${p.date}|card|${m.id}`+(m.own?`|${R}`:""),x:B,y:U,w:O,h:x,target:{day:p.date,event:m.id},event:m,color:Q,kidName:ve,clash:C,stayed:!m.own&&m.stay&&d.includes(m.drop),skipped:m.attending===!1,title:la(m.title,ve),time:re,drop:ye.drop,pick:ye.pick,showDrop:!!ye.drop&&(w||x>=56),showPick:!!ye.pick&&(w||x>=74),wrap:w,aria:`${ve}, ${m.title} ${m.takes!=null?`any time from ${z(m.start)} to ${z(m.end)}`:`${z(m.start)} to ${z(m.end)}`}. `+(m.attending===!1&&!ye.drop?"Not attending. ":"")+[ye.drop,ye.pick].filter(P=>!!P).map(P=>P.text).join(". ")}},J=m=>{let B=p.rides[m];return B?(p.drivers[B.driver]?.segments??[]).filter(O=>O.type!=="home"&&O.kids.includes(B.kid)&&pe(O.start)>=pe(B.start)&&pe(O.end)<=pe(B.end)):[]},ee=m=>{let B=p.rides[m];if(!B)return null;let U=B.serves.find(O=>X.get(O)?.kid===B.kid);return le(U??B.serves[0])},N=(m,B)=>{if(B.event)return B;let U=p.events.find(O=>O.own&&O.own!==m&&O.along.includes(m)&&O.title===B.title);return U?{...B,title:`${B.title} with ${b(U.own)}`}:B},L=m=>{if(m.takes==null)return[m.start,m.end];let B=m.planned??m.start;return[B,B+m.takes]},Z=new Map;for(let m of p.issues)m.level!=="problem"||!m.event||(m.kind==="late"&&Z.set(m.event,`${Math.round(pe(m.minutes))} min late`),m.kind==="waiting"&&Z.set(`${m.event}|pick`,`Waits ${Math.round(pe(m.minutes))} min`));if(!i){let m=1/0,B=-1/0;for(let w of p.events)w.start<=0&&w.end>=1440||(w.start>0?m=Math.min(m,w.start-20,w.arrive_by!=null?w.arrive_by-10:1/0):m=Math.min(m,w.end-30),w.end<1440?B=Math.max(B,w.end+20):B=Math.max(B,w.start+30));for(let w of j)w.start!=null&&(m=Math.min(m,w.start)),w.end!=null&&(B=Math.max(B,w.end));p.date===n.date&&Number.isFinite(m)&&n.minutes>m-60&&n.minutes<B&&(m=Math.min(m,n.minutes-15));let U=Number.isFinite(m)?Math.floor((m-5)/30)*30:900,O=Number.isFinite(B)?Math.ceil((B+5)/30)*30:960,x=w=>Math.round(M+(Math.max(U,Math.min(O,w))-U)*Zr);k.anchors.push({t:K+U,y:x(U)},{t:K+O,y:x(O)});for(let w of l){let R=c.get(w),V=h.get(w),te=(p.kids[w]?.items??[]).filter(P=>P.start!=null&&P.end!=null).map(P=>({item:P,s:pe(P.start),en:pe(P.end)})),Q=[];for(let P of oa(te)){let F=R.w/P.cols,G=Math.round(R.x+P.col*F),ne=Math.round(F-(P.cols>1?4:0)),oe=x(P.s),se=P.item;if(se.type==="act"){let we=X.get(se.event??"");if(!we)continue;let jt=Math.max(30,x(P.en)-oe),Nt=W(we,G,oe,ne,jt,se.clash,!1,w);if(Nt.layer=Tt,k.cards.push(Nt),we.arrive_by!=null&&we.start-we.arrive_by>=5){let An=x(we.arrive_by),Us={key:`${p.date}|prep|${we.id}`,x:G,y:An,w:ne,h:oe-An+Ae,color:V,label:`Arrive by ${z(we.arrive_by)}`,layer:Tt-1};k.preps.push(Us),Q.push({s:we.arrive_by,en:P.en,top:An,bottom:oe+jt,x:G,w:ne,prep:Us,card:Nt})}else Q.push({s:P.s,en:P.en,top:oe,bottom:oe+jt,x:G,w:ne,card:Nt});let Ns=Z.get(we.id);Ns&&k.marks.push({key:`${p.date}|late|${we.id}`,x:G+ne-4,y:oe+4,text:Ns,right:!0});let zs=Z.get(`${we.id}|pick`);zs&&k.marks.push({key:`${p.date}|wait|${we.id}`,x:G+4,y:oe+jt+2,text:zs,right:!1});continue}let Y=p.rides[se.ride??-1];if(!Y)continue;let _e=Math.max(22,x(P.en)-oe),mt=Wn(J(Y.index),g),Bs=b(Y.driver),Os={key:`${p.date}|ride|${Y.index}`,x:G,y:oe,w:ne,h:_e,target:ee(Y.index),l1:`${Y.own?"In":"Along in"} ${Bs}’s car`,l2:mt.join(" → "),show2:Bo(_e)>0,lines2:Bo(_e),dashed:!Y.own,clash:se.clash,aria:`${A(w)} ${Y.own?"in":"riding along in"} ${Bs}’s car, ${z(pe(Y.start))} to ${z(pe(Y.end))}: ${mt.join(" to ")}`};k.rides.push(Os);let js=c.get(Y.driver),Cn=null;js&&(Cn={key:`${p.date}|band|${Y.index}`,x:G+ne,y:oe,w:Math.max(0,js.x+8-(G+ne)),h:_e,color:V},k.bands.push(Cn)),Q.push({s:P.s,en:P.en,top:oe,bottom:oe+_e,x:G,w:ne,ride:Os,band:Cn})}let ve=P=>P.ride?.layer??(P.prep?Tt-1:Tt),ye=(P,F,G,ne)=>{G>Ae&&k.links.push({key:`${P.key}|link`,x:P.x,y:F,w:P.w,h:G,color:V,layer:ne})},D=(P,F)=>{if(!(F.x<P.x||F.x+F.w>P.x+P.w)&&(P.x=F.x,P.w=F.w,P.ride.x=F.x,P.ride.w=F.w,P.band)){let G=P.band.x+P.band.w;P.band.x=F.x+F.w,P.band.w=Math.max(0,G-P.band.x)}},re=new Set;for(let P of[...Q].sort((F,G)=>G.s-F.s)){let F=P.ride;if(!F)continue;let G=Q.filter(se=>se!==P&&se.s>=P.en&&se.s-P.en<=Lo&&se.top>=P.bottom).sort((se,Y)=>se.s-Y.s||se.top-Y.top)[0];if(!G)continue;re.add(P),D(P,G);let ne=ve(G),oe=G.top-P.bottom;ye(F,P.bottom,oe+Ae,ne-1),F.layer=ne-(oe>0?2:1),F.h+=Ae,F.tuckBottom=Ae}for(let P of[...Q].sort((F,G)=>F.s-G.s)){let F=P.ride;if(!F||re.has(P))continue;let G=Q.filter(se=>se!==P&&se.en<=P.s&&P.s-se.en<=Lo&&se.bottom<=P.top&&(se.card||se.ride?.layer!=null)).sort((se,Y)=>Y.en-se.en||Y.bottom-se.bottom)[0];if(!G)continue;D(P,G);let ne=G.ride?.layer??Tt,oe=P.top-G.bottom;ye(F,G.bottom-Ae,oe+Ae,ne-1),F.layer=ne-(oe>0?2:1),F.y-=Ae,F.h+=Ae,F.tuckTop=Ae}}for(let w of d){let R=c.get(w),V=p.drivers[w];if(!V)continue;let te=[],Q=null;for(let D of V.segments)if(!(D.start==null||D.end==null)){if(D.type==="home"){Q=null;continue}if(D.type==="stay"){Q=null,te.push({type:"stay",g:D,s:D.start,en:D.end});continue}Q&&Q.en===D.start?(Q.en=D.end,Q.legs.push(D)):(Q={type:"trip",s:D.start,en:D.end,legs:[D]},te.push(Q))}let ve=new Set,ye=(D,re,P,F)=>{ve.add(D.id);let G=x(re),ne=W(D,R.x+8,G,R.w-16,Math.max(30,x(P)-G),!1,!1,w);F&&ne.drop?.tone==="normal"&&(ne.drop=null,ne.showDrop=!1),k.cards.push(ne)};for(let D of te){let re=x(D.s),P=Math.max(24,x(D.en)-re);if(D.type==="stay"){let Y=X.get(D.g.event??D.g.serves??"");if(Y?.own===w){ye(Y,D.s,D.en,!0);continue}let _e=Y?h.get(Y.kid)??he(0):he(0),mt=D.g.kids.map(A);k.stays.push({key:`${p.date}|stay|${w}|${D.s}`,x:R.x+8,y:re,w:R.w-16,h:P,target:le(Y?.id),color:_e,l1:Y?`At ${Y.title} with ${A(Y.kid)}`:"Staying",l2:`until ${z(D.en)}`+(mt.length?` · ${mt.join(" and ")} too`:"")});continue}let F=D.legs[0],G=D.legs[D.legs.length-1],ne=[];for(let Y of D.legs)for(let _e of Y.kids)ne.includes(_e)||ne.push(_e);let oe=G.type==="drive"&&G.to==="home",se=Wn(D.legs,g);k.trips.push({key:`${p.date}|trip|${w}|${D.s}`,x:R.x+8,y:re,w:R.w-16,h:P,target:le(D.legs.find(Y=>Y.serves)?.serves),l1:F.type==="drive"&&F.from==="home"?`Leave ${z(D.s)}`:`From ${an(g,F.from??F.place)} ${z(D.s)}`,l2:se.join(" → "),show2:P>=36,l3:oe?`Home ${z(D.en)}`:"",show3:oe&&P>=62,stops:null,kids:ne.map(Y=>(h.get(Y)??he(0)).color),bad:D.legs.some(Y=>Y.overlaps_busy),aria:`${b(w)} drives ${se.join(" to ")}, ${z(D.s)} to ${z(D.en)}`})}for(let D of V.segments)if(!(!D.overlaps_busy||D.start==null||D.end==null))for(let re of V.busy){let P=Math.max(D.start,re.start),F=Math.min(D.end,re.end);F<=P||k.overlaps.push({key:`${p.date}|overlap|${w}|${P}`,x:R.x+6,y:x(P)-2,w:R.w-12,h:Math.max(8,x(F)-x(P)+4)})}for(let D of p.events)if(D.own===w&&(ve.has(D.id)||ye(D,...L(D),!1),D.takes!=null&&D.attending!==!1)){let re=x(D.start);k.windows.push({key:`${p.date}|window|${D.id}`,x:R.x+4,y:re,w:R.w-8,h:Math.max(24,x(D.end)-re),label:`${D.title} · any time ${z(D.start)}–${z(D.end)}`})}for(let D of V.busy){if(D.event||D.end<=U||D.start>=O)continue;let re=N(w,D),P=x(re.start),F=x(re.end);k.busy.push({key:`${p.date}|busy|${w}|${re.start}`,x:R.x+1,y:P,w:R.w-2,h:F-P,labelY:8,label:Ro(re,!1)})}}let C=-1/0;for(let w=U;w<=O;w+=30)k.grid.push({key:`${p.date}|grid|${w}`,y:x(w),strong:w%60===0}),w%60===0&&x(w)-C>=22&&(k.hours.push({key:`${p.date}|hour|${w}`,y:x(w)-8,label:so(w)}),C=x(w));p.date===n.date&&n.minutes>U&&n.minutes<O&&(k.now={y:x(n.minutes),label:`Now ${z(n.minutes)}`}),S=x(O)+Kn;return}let H=[];for(let m of l){let B=c.get(m);for(let U of p.kids[m]?.items??[])if(U.start!=null){if(U.type==="act"){let O=X.get(U.event??"");if(!O)continue;H.push({col:m,s:U.start,h:Uo(O,B.w),kind:"act",item:U})}else if(!p.rides[U.ride??-1]?.own){let O=p.rides[U.ride??-1],x=O?p.drivers[O.driver]?.outings.find(C=>C.start!=null&&C.start<=pe(O.start)&&pe(O.start)<=pe(C.end,C.start)):void 0;H.push({col:m,s:x?.start??U.start,h:da,kind:"along",item:U})}}}for(let m of d){let B=p.drivers[m];if(!B)continue;for(let O of B.busy)O.event||H.push({col:m,s:O.start,h:32,kind:"busy",busy:N(m,O)});let U=c.get(m).w;for(let O of p.events)O.own!==m||O.attending!==!1&&(O.takes==null||O.planned!=null)||H.push({col:m,s:L(O)[0],h:Uo(O,U),kind:"own",event:O});for(let O of B.outings){if(O.start==null)continue;let x=O.lines.length-(jo(O.lines)?1:0);H.push({col:m,s:O.start,h:30+x*16+(O.warn?16:0),kind:"out",out:O})}}H.sort((m,B)=>m.s-B.s||u.indexOf(m.col)-u.indexOf(B.col));let ue=new Map,ie=[],ce=new Map,q=M-Oo;for(let m=0;m<H.length;){let B=m,U=q+Oo;for(;B<H.length&&H[B].s===H[m].s;B++){let x=ue.get(H[B].col);x!=null&&(U=Math.max(U,x+on))}let O=new Set;for(let x=m;x<B;x++){let C=H[x],w=O.has(C.col)?ue.get(C.col)+on:U;O.add(C.col),ue.set(C.col,w+C.h)}ce.set(H[m].s,U),H[m].s>0&&k.hours.push({key:`${p.date}|hour|${H[m].s}`,y:U+2,label:He(H[m].s)}),q=U,m=B}ue.clear(),H.forEach((m,B)=>{let U=ue.get(m.col),O=Math.max(U!=null?U+on:M,ce.get(m.s));ue.set(m.col,O+m.h);let x=m.kind==="busy"?m.busy.end:m.kind==="act"?X.get(m.item.event??"")?.end??null:m.kind==="own"?L(m.event)[1]:null;ie.push({col:m.col,s:m.s,end:x,y:O,h:m.h,box:null}),k.anchors.push({t:K+m.s,y:O});let C=c.get(m.col);if(m.kind==="busy"){let w={key:`${p.date}|busy|${m.col}|${B}`,x:C.x+1,y:O,w:C.w-2,h:m.h,labelY:8,label:Ro(m.busy,!0)};k.busy.push(w),ie[ie.length-1].box=w}else if(m.kind==="out"){let w=m.out,R=jo(w.lines),V=R?w.lines.slice(0,-1):w.lines;k.trips.push({key:`${p.date}|trip|${m.col}|${B}`,x:C.x+8,y:O,w:C.w-16,h:m.h,target:le(w.target),l1:R?`${w.lead} · home ${R}`:w.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...V.map(te=>({text:te,warn:!1})),...w.warn?[{text:w.warn,warn:!0}]:[]],kids:w.kids.map(te=>(h.get(te)??he(0)).color),bad:!!w.warn,aria:`${b(m.col)}: ${w.lead}. ${w.lines.join(". ")}${w.warn?`. ${w.warn}`:""}`})}else if(m.kind==="own"){let w=W(m.event,C.x+8,O,C.w-16,m.h,!1,!0,m.col);k.cards.push(w),ie[ie.length-1].box=w}else if(m.kind==="act"){let w=X.get(m.item.event??""),R=W(w,C.x,O,C.w,m.h,m.item.clash,!0,m.col);k.cards.push(R),ie[ie.length-1].box=R}else{let w=p.rides[m.item.ride??-1],R=Wn(J(w.index),g),V=b(w.driver);k.rides.push({key:`${p.date}|ride|${w.index}`,x:C.x,y:O,w:C.w,h:m.h,target:ee(w.index),l1:`${ln} with ${V}`,l2:R.join(" → "),show2:!1,lines2:Go,dashed:!0,clash:m.item.clash,aria:`${A(m.col)} riding along with ${V}, ${z(pe(w.start))} to ${z(pe(w.end))}: ${R.join(" to ")}`})}});let xe=M;for(let m of ue.values())xe=Math.max(xe,m);for(let m of ie){if(!m.box||m.end==null)continue;let B=m.y+m.h;for(let U of ie)U.col!==m.col&&U.s>=m.s&&U.s<m.end&&(B=Math.max(B,U.y+U.h));m.end>=1440&&(B=xe);for(let U of ie)U.col===m.col&&U.y>m.y&&(B=Math.min(B,U.y-on));B=Math.min(B,xe),B>m.y+m.h&&(m.box.h=B-m.y)}S=xe+Kn+6,k.anchors.push({t:K+1439,y:S})}),k.height=S,k}var ua=["","¼","½","¾"];function Je(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return vt(n);let i=Math.round(n*4),o=Math.floor(i/4),r=ua[i%4];return`${o||!r?o:""}${r} min`})}function Xo(s){let t=e=>e?{...e,text:Je(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,i])=>[n,{...i,outings:i.outings.map(o=>({...o,lines:o.lines.map(Je),warn:o.warn==null?o.warn:Je(o.warn)}))}])),issues:e.issues.map(n=>({...n,title:Je(n.title),body:Je(n.body),note:n.note==null?n.note:Je(n.note),...n.suggestions?{suggestions:n.suggestions.map(i=>({...i,note:Je(i.note)}))}:{}}))}))}}var ha=2,pa=48;function Zo(s,t,e=pa){let n=[],i=new Set(Ee(s)),o=Se(s).map(h=>me(s,h)),r=o.length>1?o.slice(0,2):[o[0]??"Ava","Ben"],a=0,c=0,l=0,d=0,u=t.minutes+e*60;for(let h of s.days){let g=Ce(t.date,h.date),A=g===0?"":`${ge(h.date)} · `,b=new Map(h.events.map(p=>[p.id,p])),k=p=>p&&b.has(p)?{day:h.date,event:p}:null,S=(p,I)=>g*1440+(p??b.get(I??"")?.start??0)<u;for(let p of h.issues)if(p.level==="problem"){if(!S(p.at,p.event)){l++,p.kind==="unassigned"&&d++;continue}a++,p.kind==="unassigned"&&c++,n.push({key:`${h.date}|${p.key}`,tone:p.kind==="unassigned"?"unassigned":"problem",title:A+p.title,body:p.body,target:k(p.event),suggestions:(p.suggestions??[]).map(I=>({id:I.id,label:I.label,note:I.note}))})}if(h.clashes.forEach((p,I)=>{if(!S(p.a.start,p.a.event)){l++;return}a++;let K=b.get(p.a.event??""),X=me(s,p.kid),le=($,y)=>{let E=k(y);return E?{text:$,target:E}:$},v=[];if(p.b.type==="act"){let $=b.get(p.b.event??"");K&&$&&(v=[le(K.title,K.id),` ${z(K.start)}–${z(K.end)} and `,le($.title,$.id),` ${z($.start)}–${z($.end)} overlap.`])}else{let $=h.rides[p.b.ride??-1];K&&$&&(v=[`${X} is in `,le(`${be(s,$.driver)}’s car`,$.serves[0]),` ${z(pe(p.b.start))}–${z(pe(p.b.end))}, during `,le(K.title,K.id),"."])}n.push({key:`${h.date}|clash|${I}`,tone:"problem",title:`${A}${X} is double-booked`,body:v.map($=>typeof $=="string"?$:$.text).join(""),parts:v,target:null,suggestions:[]})}),g>=0&&g<ha)for(let p of h.issues)p.level!=="heads_up"||!S(p.at,p.event)||n.push({key:`${h.date}|${p.key}`,tone:"heads_up",title:A+p.title,body:p.body,target:k(p.event),suggestions:[]});for(let p of h.unplaced??[]){if(!S(p.at)){l++;continue}a++;let I=p.people.map(K=>i.has(K)?be(s,K):me(s,K));n.push({key:`${h.date}|unplaced|${p.id}`,tone:"problem",title:`${A}${z(p.at)} ${p.title}: ${Qo(p).toLowerCase()}`,body:p.reason==="unknown"&&p.word?`“${p.word}” isn’t anyone in the family, so this is only in ${hn(I)}’s lane. If it’s a misspelt name, fix the title in Google Calendar.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Start the title in Google Calendar with who it’s for, such as “${r[0]} Piano”, or “${r.join(" & ")} Piano” for both.`,target:null,suggestions:[]})}for(let p of h.events)!p.problems.length||!S(p.start)||n.push({key:`${h.date}|notes|${p.id}`,tone:"heads_up",title:`${A}Check the notes on ${un(s,p)}’s ${p.title}`,body:`These lines couldn’t be read: ${p.problems.join("; ")}`,target:k(p.id),suggestions:[]})}return{items:n,problems:a,unassigned:c,later:l,laterUnassigned:d}}function Qo(s){return s.reason==="unknown"&&s.word?`Who is “${s.word}”?`:"Who is this for?"}function fa(s,t,e,n){let i=new Set(Ee(s)),o=d=>{let u=d[0];return u==null?null:i.has(u)?Ct:e.get(u)??null},r=[...(t.all_day??[]).map(d=>({key:`${t.date}|allday|${d.id}`,title:d.title,note:d.days>1?`Day ${d.day_number} of ${d.days}`:"",color:o(d.people),cancelled:d.cancelled,warn:!1})),...(t.unplaced??[]).map(d=>({key:`${t.date}|unplaced|${d.id}`,title:`${z(d.at)} ${d.title}`,note:Qo(d),color:null,cancelled:!1,warn:!0}))];if(!r.length)return null;let a=Math.max(120,n-at),c=1,l=0;for(let d of r){let u=Math.min(a,30+7*(d.title.length+(d.note?d.note.length+2:0)));l&&l+u>a&&(c++,l=0),l+=u}return{key:`${t.date}|allday`,h:c*ta+(c-1)*Fo,chips:r}}function ei(s,t){let e=ke(s),n=null,i=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of s.days){let r=Ce(t.date,o.date);if(!(r<0))for(let a of Ee(s))for(let c of o.drivers[a]?.outings??[]){if(c.start==null)continue;let l=r*1440+c.start;if(r*1440+pe(c.end,c.start)<=t.minutes)continue;let u=l-t.minutes,h={driver:a,name:be(s,a),date:o.date,ahead:r,start:c.start,inMinutes:u,ongoing:u<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(g=>e.get(g)??he(0)),warn:c.warn,target:c.target&&o.events.some(g=>g.id===c.target)?{day:o.date,event:c.target}:null};(!n||i(h)<i(n)||i(h)===i(n)&&h.inMinutes<n.inMinutes)&&(n=h)}}return n}function lt(s){return s.state==="done"||s.state==="late"}var ga=780;function ma(s,t,e){return s.state==="open"&&!!s.for_day&&s.due===t&&e<ga}function ti(s,t){return s.chores.map(e=>ma(e,s.today,t)?{...e,state:"upcoming",shows_from:s.today}:e)}function ni(s){return s.state==="open"||s.state==="overdue"}function es(s,t,e){if(lt(s)){let n=s.done_at?ba(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Zn(s.due,t)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Zn(s.for_day,t)}`;let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let i=Ce(t,s.due);return`By ${i===1?"tomorrow":i<7?ge(s.due):Qn(s.due)}`}if(s.for_day&&s.due===t)return`Tonight · for ${Zn(s.for_day,t)}`;if(s.due&&s.due>t){let n=Ce(t,s.due);return n===1?"By tomorrow":`By ${n<7?ge(s.due):Qn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Zn(s,t){let e=Ce(t,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ge(s):Qn(s)}function Qn(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ba(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let o=n.toLocaleDateString("en-CA",{timeZone:i}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return o===t?r:`${ge(o)} ${r}`}function si(s,t,e=1440){let n=ti(s,e).sort((i,o)=>i.order-o.order);return s.kids.map((i,o)=>{let r=n.filter(d=>d.kid===i.id),a=new Map;for(let d of r){if(d.state!=="upcoming")continue;let u=d.shows_from??d.due??s.today;a.set(u,[...a.get(u)??[],d])}let c=r.filter(d=>d.state==="overdue"),l=r.filter(d=>d.state==="open");return{kid:i.id,name:i.name,color:t?.get(i.id)??he(o),overdue:c,now:l,done:r.filter(lt),later:[...a.entries()].sort(([d],[u])=>d.localeCompare(u)).map(([d,u])=>({date:d,chores:u})),left:c.length+l.length}})}function oi(s,t=1440){return ti(s,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function ts(s){return!s.chores.length&&!s.templates.length}var Xe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function ns(s){let t=s.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[i,o]=n.split("-").map(r=>Xe.indexOf(r.trim()));if(i===void 0||i<0||o!==void 0&&o<0)return null;if(o===void 0)e.add(i);else for(let r=0;r<=(o-i+7)%7;r++)e.add((i+r)%7)}return e}function ss(s){let t=[...new Set(s)].sort((n,i)=>n-i);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let i=e.at(-1);i&&i.at(-1)===n-1?i.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${Xe[n[0]]}-${Xe[n.at(-1)]}`]:n.map(i=>Xe[i])).join(", ")}var Ze="none";function pn(s){return s==="daily"||s==="school"?"":"Any"}function ii(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function ri(s){let t=s.days??pn(s.repeats),e=s.repeats==="daily"&&t!=="";return{template:s.id,repeats:e?"weekly":s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:t,every:!e&&s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function os(s){return s.title.trim()?s.who.length?s.days===Ze?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function ai(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.repeats==="daily"?"":s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function is(s){let t=s%100;return t>=11&&t<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function rs(s,t,e=1,n=!1,i=!1){if(s==="school"){let d=t.trim().replace(/-/g,"–"),u=i?d?`${d} Bring lunch days`:"Bring lunch days":d?`${d} school days`:"Every school day";return n?`${u}, the night before`:u}let o={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${o}s`:`each ${o}`,a=t.trim();if(s==="daily")return e>1?`Every ${e} days`:"Every day";if(s==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let l=`${a.split(",").map(d=>{let u=d.trim();return u.toLowerCase()==="last"?"the last day":/^\d+$/.test(u)?`the ${is(Number(u))}`:`the ${u}`}).join(" and ")} ${r}`;return l[0].toUpperCase()+l.slice(1)}function as(s,t,e=!1){let n=s.map(o=>t.find(r=>r.id===o)?.name??o);if(!n.length)return"Nobody yet";let i=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${i} take turns`:i}function ls(s){let t=s.indexOf(":"),e=t<0?s:s.slice(0,t),n=t<0?"":s.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function fn(s,t){return`${s}|${t}`}function ct(s,t){let[e,n,i]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1,i+t)).toISOString().slice(0,10)}function gn(s){let[t,e,n]=s.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function li(s,t){return s.days_off.find(e=>e.first<=t&&t<=e.last)??null}function ci(s,t){return gn(t)<5&&!li(s,t)}function At(s,t,e=new Map){if(!ci(s,t))return null;let n=fn(s.id,t);if(e.has(n)){let o=e.get(n);return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}let i=s.picks[t];return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}function dt(s,t){return ci(s,t)?s.menus?.[t]??null:null}var xa="From the school's menu feed.";function va(s){let t=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==xa);return t.length?t.join(`
`):null}function Me(s){return s.slice(0,7)}function mn(s){let[t,e]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function cs(s,t=1){let[e,n]=s.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function di(s){let t=[];for(let e=Me(s.first);e<=Me(s.last);e=cs(e))t.push(e);return t}function ui(s,t,e,n=new Map){let i=`${e}-01`,o=ct(i,-gn(i)),r=[];for(;Me(o)<=e;){let a=[];for(let c=0;c<5;c++){let l=ct(o,c),d=Me(l)!==e,u=d?null:li(t,l),h=d?null:At(t,l,n);a.push({date:l,day:Number(l.slice(8)),outside:d,off:u?u.title:null,lunch:h?.lunch??null,picked:h?.picked??!1,menu:d?null:dt(t,l)?.dish??null,sides:d?null:va(dt(t,l)?.details??""),past:l<s.today,today:l===s.today})}a.some(c=>!c.outside)&&r.push(a),o=ct(o,7)}return r}function hi(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function pi(s){let t=0,e=0;for(let n of s.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function fi(s,t,e,n=new Map){let i=e<780?0:1;for(let o=i;o<8;o++){let r=ct(t,o),a=At(s,r,n);if(!a)continue;let c=Ce(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":ge(r),date:r,menu:dt(s,r)?.dish??null}}return null}var ya={timeline:"timeline",full:"timeline",compact:"compact"};function St(s){let t=new URLSearchParams(s),e={},n=ya[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(t.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores"||i==="lunch")&&(e.page=i),e}var wa=["auth_callback","code","state"];function ds(s){let t=new URLSearchParams(s);for(let n of wa)t.delete(n);let e=t.toString();return e?`?${e}`:""}var gi=Ke`
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
    top: 72px;
    z-index: 5;
    margin-bottom: -36px;
    pointer-events: none;
    border-radius: 12px 0 0 0;
    overflow: hidden;
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
  /* All-day events, glued under the date line and floating with it. */
  .allday {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 4px;
    padding-bottom: 4px;
  }
  .ad-chip {
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
    flex: 0 1 auto;
    min-width: 0;
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
`;var er="mydashlight.rides.mode",Ql=1100,ec=440,tc=700,nc=3*6e4,sc=1200;function oc(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var _n=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Ji=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,ic=new URL("emoji.json",import.meta.url).href,Xi=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Zi=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Qi=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,rc=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,ac=de`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,Dt={bring:"Bring",buy:"Buy"};function lc(s,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return t<=1?e:`${e}s${s==="monthly"&&t===3?" (quarterly)":s==="monthly"&&t===12?" (yearly)":""}`}function De(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Ms(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function cc(s,t){return Xn(s,t)||Te(s).split(",")[0]}function dc(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function uc(){try{return localStorage.getItem(er)==="compact"?"compact":"timeline"}catch{return"timeline"}}function hc(s){try{localStorage.setItem(er,s)}catch{}}function Tn(s){return s.days.every(t=>!t.events.length)}var Lt=class extends $e{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=St(location.search).view;this.urlPage=St(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let i=e.clientX-n.x,o=e.clientY-n.y;if(!n.moved){if(Math.abs(i)+Math.abs(o)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-o,n.el.scrollLeft=n.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},nc))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.error=null,this.mode=this.urlView??uc(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[i,o]of this.lunchDraft){let[r,a]=i.split("|"),c=e.kids.find(l=>l.id===r);(!c||(c.picks[a]??null)===o||!At(c,a))&&n.delete(i)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let i of e.chores)n.has(i.id)&&lt(i)===n.get(i.id)&&n.delete(i.id);for(let i of n.keys())e.chores.some(o=>o.id===i)||n.delete(i);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Xo(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Ql)return!1;let e=this.plan;return!e||this.width-ec>=Gn(Se(e).length,Ee(e).length)}today(){return xt(this.plan?.time_zone??oc())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),i=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=Jo(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let i=this.scroller;if(!i||!this.board)return;let o=this.board.dayHeads.find(r=>r.date===n)?.y??0;i.scrollTop=Math.max(o,Wo(this.board,e)-Ho(this.board,e)-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let o=this.dayIndexOf(e),r=n.days[o];if(!r)return;let a=1/0;if(this.mode==="timeline"){for(let c of r.events)a=Math.min(a,c.arrive_by??c.start);for(let c of Object.values(r.drivers))for(let l of c.outings)l.start!=null&&(a=Math.min(a,l.start))}this.scrollToTime(o*1440+(Number.isFinite(a)?Math.max(0,a-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,i=this.board.dayHeads[0];for(let r of this.board.dayHeads)r.y<=n+1&&(i=r);this.pinDay!==i.date&&(this.pinDay=i.date);let o=this.renderRoot;for(let r of o.querySelectorAll(".day-tile"))r.classList.toggle("in-view",r.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),o=new Map(this.choreDraft);o.set(e.id,i),this.choreDraft=o;try{await this.backend.setChoreDone(e.id,i,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof ae?r:new ae("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??lt(e)}editMenu(e,n){let i=this.lunch?.kids??[],o=dt(e,n),r=i.filter(a=>a.id===e.id||o&&dt(a,n)?.dish===o.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:o?.dish??"",details:o?.details??"",kids:r,had:!!o,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(i){this.menuEdit={...n,busy:!1};let o=i instanceof ae?i:new ae("error",String(i));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async saveLunch(e,n,i){if(!this.backend||!n.length)return;let o=new Map(this.lunchDraft);for(let r of n)o.set(fn(e,r),i);this.lunchDraft=o;try{await this.backend.setLunch(e,n,i)}catch(r){let a=new Map(this.lunchDraft);for(let l of n)a.delete(fn(e,l));this.lunchDraft=a;let c=r instanceof ae?r:new ae("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?ri(e):ii(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>(Yi(),Gi))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||os(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(ai(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let i=n instanceof ae?n:new ae("error",String(n));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let i=n instanceof ae?n:new ae("error",String(n));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,i=this.board?.dayHeads.find(o=>o.date===this.pinDay)?.h??dn;this.keepAt=n&&this.board?qo(this.board,n.scrollTop+i+4):null,this.mode=e,this.urlView||hc(e)}findEvent(e){let n=this.plan?.days.find(o=>o.date===e.day),i=n?.events.find(o=>o.id===e.event);return n&&i?{day:n,event:i}:null}open(e,n=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),i=this.dayIndexOf(e.day);!n||i<0||this.scrollToTime(i*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,i){if(!this.pending){this.pending={key:e,value:n};try{await i()}catch(o){let r=o instanceof ae?o:new ae("error",String(o));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,i){if(!this.backend)return;let o=this.backend;this.save(`${n}`,i,()=>o.setRide(e.id,n,i,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let i=this.backend;this.save("attending",n,()=>i.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n,i="drop"){if(!this.backend)return;let o=this.backend,r=i==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${i}`,a,()=>o.setTakeAlong(e.id,a,this.scope,i))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let i=this.backend;this.save("takes",n,()=>i.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;n<0?o=(i??e.start)-5:o=i==null||i+5>=e.start?null:i+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),sc)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let i=this.findEvent(n);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,r=i.event.id,a=this.scope;this.save("arrive",e,()=>o.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),i=e?Zo(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},o=this.wide,r=this.chores?oi(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],a=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",l=f`<aside class="panel" aria-label=${c}>
      ${a??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,r))}
    </aside>`,d=this.page==="rides";return f`
      <div class="app ${o?"wide":this.width<tc?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,r.length)} ${d&&e?this.renderWeek(e):T}
          ${d?this.renderBanner(e):T}
          <main>
            ${d?f`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Tn(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:this.page==="lunch"?f`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!o&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${l}`:T}
          </main>
        </div>
        ${o?l:T}
        ${this.toast?f`<div class="toast" role="status">${this.toast}</div>`:T}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,i){let o=n.problems+i;this.tick;let r=this.today(),a="";if(e){let h=e.time_zone,g=new Date(e.updated);this.error?a=f`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Ft(g,new Date,h)}</span>`:e.status&&!e.status.ok?a=f`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Ft(g,new Date,h)}</span>`:this.backend?.live||(a=`Updated ${Ft(g,new Date,h)}`)}let c=(h,g,A,b)=>f`
      <button type="button" class="seg-btn" title=${b} aria-pressed=${this.mode===h?"true":"false"} @click=${()=>this.setMode(h)}>
        ${A}<span class="seg-label">${g}</span>
      </button>
    `,l=(h,g,A)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===h?"true":"false"} @click=${()=>this.setPage(h)}>
        ${A}<span class="seg-label">${g}</span>
      </button>
    `,d=He(r.minutes),u=!!e&&Tn(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${de`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:T}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Te(r.date)}, ${d}`}>
            <span class="hm">${d.slice(0,-3)}</span><span class="ampm">${d.slice(-2)}</span>
          </h1>
          <p class="today-line">${Te(r.date)}</p>
          ${a?f`<p class="status">${a}</p>`:T}
        </div>
        ${e&&!u?this.renderNext(e,ei(e,r),n):T}
        <div class="controls">
          ${this.wide||u&&!i?T:f`<button type="button" class="attn-btn ${o?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${o}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?T:f`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",de`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",de`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${l("rides","Rides",de`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${l("chores","Chores",de`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?T:l("lunch","Lunch",de`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,i){if(!n){let l=this.today().date,d=i.unassigned,u=i.laterUnassigned;if(d){let g=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?f`<div class="next idle needs">${g}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${g}</button>`}if(u)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${u} ${u===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let h=e.days.some(g=>g.date>=l&&g.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${h?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${h?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let o;n.ongoing?o="On the road now":n.ahead===0?o=n.inMinutes<180?`Next trip · in ${vt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?o="Next trip · tomorrow":o=`Next trip · ${ge(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=f`
      <span class="next-eyebrow">${o}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${De(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(l=>f`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
      </span>
      ${n.warn?f`<span class="next-stop warn">${n.warn}</span>`:n.stop?f`<span class="next-stop">${n.stop}</span>`:T}
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?f`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:f`<div class=${c}>${a}</div>`}renderWeek(e){let n=this.today().date,i=ke(e);return f`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let r=Jn(o),a=o.events.length,c=o.events.slice(0,6).map(d=>d.own?Ct.color:i.get(d.kid)?.color??he(0).color),l=`${Te(o.date)}: ${a?`${a} ${a===1?"activity":"activities"}`:"nothing planned"}${r?`, ${r} to sort out`:""}`;return f`<button
          type="button"
          class="day-tile ${o.date===n?"today":""}"
          data-date=${o.date}
          aria-label=${l}
          @click=${()=>this.goToDay(o.date)}
        >
          <span class="dt-wd">${o.date===n?"Today":ge(o.date)}</span>
          <span class="dt-num">${Number(o.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${c.length?c.map(d=>f`<span class="dt-dot" style="background:${d}"></span>`):f`<span class="dt-free">free</span>`}
            ${a>6?f`<span class="dt-more">+${a-6}</span>`:T}
          </span>
          ${r?f`<span class="dt-badge" aria-hidden="true">${r}</span>`:T}
        </button>`})}
    </nav>`}renderQuiet(e){let n=Se(e),i=Ee(e),o=ke(e),r=n.map(a=>me(e,a));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>de`<circle cx=${50+c*30} cy="80" r="11" fill=${o.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${dc(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=o.get(a);return f`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${De(me(e,a))}</span>
            <span class="qw-name">${me(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(a=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${De(be(e,a))}</span>
            <span class="qw-name">${be(e,a)}</span>
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
    </div>`}renderBanner(e){if(e?.needs_setup==="events_calendar")return f`<div class="banner" role="status">
        Pick your family calendar to see the week: in Home Assistant, open Settings &gt; Devices &amp; services &gt; MyDashLight &gt;
        Configure &gt; Calendars.
      </div>`;let n=e?.unavailable_calendars.length??0;return n?f`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:T}renderEmpty(){return this.error?f`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:f`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderHead(e){return f`<div class="dh-line">
        <span class="label">${e.label}</span>${e.tag?f`<span class="tag">${e.tag}</span>`:T}<span
          class="sub ${e.warn?"warn":""}"
          >${e.sub}</span
        >
      </div>
      ${e.allDay.length?f`<div class="allday" style="padding-left:${at}px">
            ${e.allDay.map(n=>f`<span
                  class="ad-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"}"
                  style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
                  ><span class="ad-title">${n.title}</span>${n.note?f`<span class="ad-note">${n.note}</span>`:T}</span
                >`)}
          </div>`:T}`}renderBoard(e){let n=this.sel,i=l=>!!l&&!!n&&l.day===n.day&&l.event===n.event,o=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],r=e.width,a=100,c=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??a-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??a})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??a+1}))].sort((l,d)=>l.z-d.z);return f`
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
          ${e.columns.map(l=>f`<div class="col-head ${l.kind}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${De(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0):T}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        ${o?f`<div class="pinned" aria-hidden="true" style="width:${r}px;height:${o.h}px;margin-bottom:${-o.h}px">
              ${this.renderHead(o)}
            </div>`:T}
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
          ${Be(e.bands,l=>l.key,l=>f`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Be(e.busy,l=>l.key,l=>f`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Be(e.windows,l=>l.key,l=>f`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Be(c,l=>l.x.key,l=>{if(l.t==="link"){let g=l.x;return f`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-color:${g.color.color};background:linear-gradient(rgba(${g.color.rgb},0.11), rgba(${g.color.rgb},0.11)), var(--surface)"
                ></div>`}if(l.t==="prep"){let g=l.x;return f`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-color:${g.color.color};background:linear-gradient(rgba(${g.color.rgb},0.11), rgba(${g.color.rgb},0.11)), var(--surface);color:${g.color.ink}"
                >
                  ${g.label}
                </div>`}if(l.t==="ride"){let g=l.x;return f`<button
                  type="button"
                  class="ride ${g.dashed?"dashed":""} ${g.clash?"clash":""}"
                  aria-label=${g.aria}
                  style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;padding-top:${3+(g.tuckTop??0)}px;padding-bottom:${3+(g.tuckBottom??0)}px"
                  @click=${()=>this.open(g.target)}
                >
                  <span class="l1">${g.l1}</span>${g.show2?f`<span class="l2" style="-webkit-line-clamp:${g.lines2}">${g.l2}</span>`:T}
                </button>`}let d=l.x,u=d.color,h=d.skipped?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.10) 0px, rgba(${u.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:d.stayed?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.24) 0px, rgba(${u.rgb},0.24) 6px, rgba(${u.rgb},0.08) 6px, rgba(${u.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${u.rgb},0.15), rgba(${u.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${d.wrap?"wrap":""} ${i(d.target)?"sel":""} ${d.clash?"clash":""} ${d.skipped?"skipped":""}"
                aria-label=${d.aria}
                style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;background:${h};border-color:${d.clash?"var(--bad)":`rgba(${u.rgb},0.45)`};--c:${u.color};--rgb:${u.rgb};--ring:${u.color}"
                @click=${()=>this.open(d.target)}
              >
                <span class="top">
                  <span class="title">${d.title}</span>
                  <span class="time">${d.time}</span>
                  ${d.showDrop&&d.drop?f`<span class="line tone-${d.drop.tone}">${d.drop.text}</span>`:T}
                </span>
                ${d.showPick&&d.pick?f`<span class="line tone-${d.pick.tone}">${d.pick.text}</span>`:T}
              </button>`})}
          ${Be(e.stays,l=>l.key,l=>f`<button
                type="button"
                class="stay"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Be(e.trips,l=>l.key,l=>f`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(d=>f`<span class="kid-dot" style="background:${d}"></span>`)}</span>
                ${l.show2?f`<span class="l2">${l.l2}</span>`:T}
                ${l.stops?l.stops.map(d=>f`<span class="stop ${d.warn?"warn":""}">${d.text}</span>`):T}
                ${l.show3?f`<span class="l3">${l.l3}</span>`:T}
              </button>`)}
          ${Be(e.overlaps,l=>l.key,l=>f`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Be(e.marks,l=>l.key,l=>f`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${r-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:T}
        </div>
      </div>
    `}renderAttention(e,n){let{items:i,problems:o,later:r}=e,a=this.plan,c=o+n.length,l=this.chores,d=!!l&&!ts(l);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?T:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${d?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?f`<div class="attn-chores">${n.map(u=>this.renderChoreRow(u,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!o?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${de`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Tn(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:T}
      ${i.map(u=>f`<div class="issue ${u.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${u.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${u.target?f`<button type="button" class="issue-title" @click=${()=>this.open(u.target,!0)}>${u.title}</button>`:f`<strong class="issue-title">${u.title}</strong>`}
              <span class="issue-body"
                >${u.parts?u.parts.map(h=>typeof h=="string"?h:f`<button type="button" class="issue-link" @click=${()=>this.open(h.target,!0)}>${h.text}</button>`):u.body}</span
              >
            </div>
          </div>
          ${u.suggestions.length?f`<div class="fixes">
                ${u.suggestions.map(h=>f`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(h.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${h.id}`?"Saving…":h.label}</span>
                    <span class="fix-note">${h.note}</span>
                  </button>`)}
              </div>`:T}
        </div>`)}
      ${this.wide&&a&&!Tn(a)&&this.page==="rides"?this.renderLegend():T}
    `}kidColorOf(e){let n=this.plan?ke(this.plan).get(e):void 0;if(n)return n;let i=this.lunch?.kids.findIndex(o=>o.id===e)??-1;return he(Math.max(0,i))}renderLunchChip(e,n=!1){let i=this.lunch,o=i?.kids.find(l=>l.id===e);if(!i||!o)return T;this.tick;let r=this.today(),a=fi(o,r.date,r.minutes,this.lunchDraft);if(!a)return T;let c=Dt[a.lunch];return f`<span class="lunch-chip ${a.lunch} ${n?"small":""}" title=${`${c} lunch ${a.when}${a.menu?`: ${a.menu}`:""}`}
      >${a.lunch==="bring"?Zi:Qi}<span class="lunch-chip-text"
        >${c}${n?T:` ${a.when}`}${!n&&a.menu?f`<span class="lunch-chip-menu"> · ${a.menu}</span>`:T}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return f`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=di(e),i=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Me(e.today),o=n.indexOf(i),r=d=>{let u=n[o+d];u&&(this.lunchMonth=u)},a=e.kids.some(d=>d.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(d=>d.id===a):e.kids,l=e.status&&!e.status.ok?f`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:T;return f`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${o<=0} @click=${()=>r(-1)}>
            ${de`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${mn(i)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${o<0||o>=n.length-1} @click=${()=>r(1)}>
            ${de`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":f`${Ji} Edit menus`}
        </button>
      </div>
      ${l}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${c.length}">
        ${c.map(d=>this.renderLunchCard(e,d,i,a!==null))}
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
    </div>`}renderLunchCard(e,n,i,o){let r=this.kidColorOf(n.id),a=ui(e,n,i,this.lunchDraft),c=pi(a),l=a.flat(),d=l.filter(b=>!b.outside&&!b.past&&b.lunch),u=n.days_off.filter(b=>Me(b.first)<=i&&i<=Me(b.last)),h=b=>d.filter(k=>gn(k.date)===b),g=b=>{let k=h(b);if(!k.length)return;let S=k.every(p=>p.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,k.map(p=>p.date),S)},A=d.length?`${c.bring} Bring · ${c.buy} Buy${i===Me(e.today)?" left this month":""}`:"No school days left this month";return f`<section class="chore-col lunch-card ${o?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${De(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${A}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${Dt[n.default]} unless picked</span>
          ${e.kids.length<2?T:f`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${o?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=o?null:n.id}
              >
                ${o?ac:rc}${o?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?f`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:T}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${mn(i)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((b,k)=>f`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!h(k).length}
            aria-label=${`${h(k).every(S=>S.lunch==="bring")?"Buy":"Bring"} every ${b} left in ${mn(i)} for ${n.name}`}
            @click=${()=>g(k)}
          >
            ${b}
          </button>`)}
        ${l.map(b=>this.renderLunchCell(n,b,o))}
      </div>
      ${u.length?f`<p class="lunch-offs">
            No school:
            ${u.map(b=>{let k=b.first<`${i}-01`?`${i}-01`:b.first,S=Me(b.last)>i?ct(`${cs(i)}-01`,-1):b.last;return`${k===S?Ms(k):`${Ms(k)}–${Ms(S)}`} ${hi(b.title)}`}).join(" · ")}
          </p>`:T}
    </section>`}renderLunchCell(e,n,i=!1){if(n.outside)return f`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return f`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let o=n.lunch,r=o==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,l=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),d=c?`${e.name}, ${Te(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Te(n.date)}: ${Dt[o]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${Dt[r]}.`;return f`<button
      type="button"
      class="lunch-day ${o} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${l?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${d}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${o==="bring"?Zi:Qi}${Dt[o]}</span>
      ${n.menu?f`<span class="lunch-menu">${n.menu}</span>${i&&n.sides?f`<span class="lunch-sides">${n.sides}</span>`:T}`:c?f`<span class="lunch-menu add">${_n} Menu</span>`:T}
    </button>`}renderChoreRow(e,n=!1){let i=this.chores,o=this.choreDone(e),r=i.kids.findIndex(S=>S.id===e.kid),a=(this.plan?ke(this.plan).get(e.kid):void 0)??he(Math.max(0,r)),c=i.kids[r]?.name??"",l=o===lt(e)?e:{...e,state:o?"done":"open",done_at:o?new Date().toISOString():null},d=o&&l.done_by&&l.done_by!==e.kid?i.people?.find(S=>S.id===l.done_by)?.name??l.done_by_name??null:null,u=`${es(l,i.today,i.time_zone)}${d?` · by ${d}`:""}`,h=o||ni(e),g=`${n?`${c}: `:""}${e.title}. ${u?`${u}. `:""}${o?"Done. Tap to undo.":"Tap when it’s done."}`,A=f`<span class="box" aria-hidden="true"
        >${o?de`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:T}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:T}
      <span class="chore-text">
        <span class="chore-title">${n?f`<span class="chore-kid">${c}</span> · `:T}${e.title}</span>
        ${u?f`<span class="chore-note">${u}</span>`:T}
      </span>`,b=`chore ${o?"done":""} ${e.state==="overdue"&&!o?"overdue":""} ${h?"":"later"}`,k=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return h?f`<button type="button" class=${b} style=${k} aria-pressed=${o?"true":"false"} aria-label=${g} @click=${()=>this.tapChore(e)}>
          ${A}
        </button>`:f`<div class=${b} style=${k}>${A}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return f`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return f`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(ts(e))return f`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${_n} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),i=n.length?f`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:T;this.tick;let o=si(e,this.plan?ke(this.plan):void 0,this.today().minutes);return f`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${_n} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Ji} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${o.length}">
        ${o.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return f`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${De(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?f`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:T}
            ${r.now.length?f`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:T}
            ${r.done.length?f`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:T}
            ${r.later.map(c=>f`<h3 class="chore-group">${c.date===e.today?"Later today":cc(c.date,e.today)}</h3>
                ${c.chores.map(l=>this.renderChoreRow(l))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?f`<p class="chore-none">No chores this week.</p>`:T}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,o=this.plan?ke(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?f`<span class="tmpl-note bad">${e.problems.map(ls).join(" · ")} · tap to set up</span>`:f`<span class="tmpl-note">${as(e.who,i,e.take_turns)} · ${rs(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return f`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?f` <span class="tag-paused">Paused</span>`:T}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let l=i.findIndex(u=>u.id===c),d=o?.get(c)??he(Math.max(0,l));return f`<span class="kid-dot" style="background:${d.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return f`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${_n} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([i,o])=>{let r=e.templates.filter(a=>a.repeats===i);return r.length?f`<section class="manage-group" aria-label=${o}>
                  <h3 class="chore-group">${o}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:T}):f`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return f``;let i=n.kids,o=this.plan?ke(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(b=>b.id===e.template):void 0,c=os(e),l=(a?.problems??[]).filter(b=>b!=="who:"),d=(b,k,S,p=!1)=>f`<button type="button" class="choice ${p?"wide":""}" aria-pressed=${b?"true":"false"} ?disabled=${r} @click=${S}>${k}</button>`,u=(b,k,S,p)=>f`<button type="button" class="chip" aria-pressed=${b?"true":"false"} aria-label=${p??T} ?disabled=${r} @click=${S}>${k}</button>`,h=b=>{b!==e.repeats&&this.changeDraft({repeats:b,days:a&&a.repeats===b?a.days??pn(b):pn(b)})},g=b=>{let k=e.who.includes(b)?e.who.filter(S=>S!==b):i.filter(S=>S.id===b||e.who.includes(S.id)).map(S=>S.id);this.changeDraft({who:k})},A;if(e.repeats==="school"){let b=e.days===Ze?new Set:e.days===""?new Set([0,1,2,3,4]):ns(e.days)??new Set,k=S=>{let p=new Set(b);p.has(S)?p.delete(S):p.add(S),this.changeDraft({days:p.size===5?"":p.size?ss(p):Ze})};A=f`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Xe.slice(0,5).map((S,p)=>u(b.has(p),S.slice(0,2),()=>k(p),S))}
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
        </div>`}else if(e.repeats==="monthly"){let b=e.days.trim(),k=/^\d+$/.test(b)?Number(b):null,S=b&&b.toLowerCase()!=="any"&&b.toLowerCase()!=="last"&&k===null;A=f`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${S?4:3}, minmax(0, 1fr))">
          ${d(b===""||b.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${d(k!==null,"On a date",()=>this.changeDraft({days:String(k??1)}))}
          ${d(b.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${S?d(!0,b,()=>{}):T}
        </div>
        ${k!==null?f`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||k<=1} @click=${()=>this.changeDraft({days:String(k-1)})}>−</button>
                <span class="arrive-value">${is(k)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||k>=31} @click=${()=>this.changeDraft({days:String(k+1)})}>+</button>
              </span>
            </div>`:f`<p class="field-hint">${b.toLowerCase()==="last"?"Due on the month’s last day.":S?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")A=f`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let b=e.days===""||e.days.toLowerCase()==="any",k=e.days===Ze?new Set:b?new Set:ns(e.days)??new Set,S=p=>{let I=new Set(k);I.has(p)?I.delete(p):I.add(p),this.changeDraft({days:I.size?ss(I)||"Mon-Sun":Ze})};A=f`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${d(b,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${d(!b,"On set days",()=>this.changeDraft({days:b?"Sat":e.days}))}
        </div>
        ${b?f`<p class="field-hint">Shows all week, due on Sunday.</p>`:f`<div role="group" aria-label="Days of the week" class="day-chips">
                ${Xe.map((p,I)=>u(k.has(I),p.slice(0,2),()=>S(I),p))}
              </div>
              <div class="chips">
                ${u(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${u(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?as(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===Ze?"No days picked":rs(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${l.length?f`<p class="field-hint bad">${l.map(ls).join(". ")}. Saving fixes it.</p>`:T}
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
          ${Xi.map(b=>u(e.icon===b,b,()=>this.changeDraft({icon:e.icon===b?null:b}),`Picture ${b}`))}
          ${e.icon&&!Xi.includes(e.icon)?u(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):T}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?f`<emoji-picker
              class="emoji-more"
              .dataSource=${ic}
              @emoji-click=${b=>{let k=b.detail.unicode;k&&this.changeDraft({icon:k}),this.iconMore=!1}}
            ></emoji-picker>`:T}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((b,k)=>{let S=o?.get(b.id)??he(k),p=e.who.includes(b.id);return f`<button type="button" class="who-chip" style="--c:${S.color};--rgb:${S.rgb}" aria-pressed=${p?"true":"false"} ?disabled=${r} @click=${()=>g(b.id)}>
              <span class="avatar" aria-hidden="true">${De(b.name)}</span>${b.name}
            </button>`})}
        </div>
        ${e.who.length>1?f`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${d(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${d(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:T}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${d(e.repeats==="daily","Every day",()=>h("daily"))}
          ${d(e.repeats==="weekly","Every week",()=>h("weekly"))}
          ${d(e.repeats==="monthly","Every month",()=>h("monthly"))}
          ${d(e.repeats==="school","School days",()=>h("school"))}
        </div>
      </div>
      ${A}
      ${e.repeats==="school"?T:f`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${lc(e.repeats,e.every)}</span>
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
            </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return f``;let i=e.busy,o=d=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...d})},r=d=>o({kids:e.kids.includes(d)?e.kids.filter(u=>u!==d):[...e.kids,d]}),a=n.kids.filter(d=>At(d,e.date)),c=e.dish.trim(),l=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${Te(e.date)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${i} @click=${()=>this.menuEdit=null}>Cancel</button>
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
          ?disabled=${i}
          @input=${d=>o({dish:d.target.value})}
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
          ?disabled=${i}
          @input=${d=>o({details:d.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${a.map(d=>{let u=this.kidColorOf(d.id),h=e.kids.includes(d.id);return f`<button type="button" class="who-chip" style="--c:${u.color};--rgb:${u.rgb}" aria-pressed=${h?"true":"false"} ?disabled=${i} @click=${()=>r(d.id)}>
              <span class="avatar" aria-hidden="true">${De(d.name)}</span>${d.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?f`<button type="button" class="chip clear remove" ?disabled=${i||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${i||!!l} @click=${()=>void this.saveMenu()}>
          ${i?"Saving to Google Calendar…":l??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return f``;let i=n.people?.length?n.people:n.kids.map(u=>({...u,role:"kid"})),o=n.kids.findIndex(u=>u.id===e.kid),r=n.kids[o],a=this.plan?ke(this.plan):void 0,c=a?.get(e.kid)??he(Math.max(0,o)),l=i.filter(u=>u.id!==e.kid),d=u=>{let h=n.kids.findIndex(g=>g.id===u.id);return h>=0?(a?.get(u.id)??he(h)).color:"var(--dark)"};return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${es(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${De(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?f`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${l.map(u=>f`<button type="button" class="done-by" style="--c:${d(u)}" @click=${()=>void this.toggleChore(e,u.id)}>
                  <span class="avatar ${u.role==="parent"?"driver":""}" aria-hidden="true">${De(u.name)}</span>
                  <span>${u.name}</span>
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
    </div>`}ownHint(e,n){let i=un(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${z(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${z(n.start)} to ${z(n.end)}. ${r}, around ${i}’s other trips. Errands go alone.`}let o=n.along.map(r=>Ee(e).includes(r)?be(e,r):me(e,r));return`${i} drives there and back${o.length?`, with ${hn(o)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return f``;let{day:i,event:o}=n,r=Ee(e),a=Ko(e,o),c=un(e,o),l=!!this.pending,d=L=>this.pending?.key===L?this.pending.value:void 0,u=[...e.people?.carpools??[]];for(let L of e.days)for(let Z of L.events)for(let H of[Z.drop,Z.pick])H&&H!=="none"&&!r.includes(H)&&!u.some(ue=>ue.toLowerCase()===H.toLowerCase())&&u.push(H);let h=L=>{if(!o.sides.includes(L))return T;let Z=d(L),H=Z!==void 0?String(Z):L==="drop"?o.drop:o.pick,ue=H&&H!=="none"&&!r.includes(H)?H:"",ie=q=>this.setRide(o,L,H===q?"":q),ce=[...r.map(q=>[q,Yn(e,q)]),["none","Not needed"]];return f`<div class="field">
        <span class="field-label">${L==="drop"?"Drop-off":"Pick-up"} ${H===""?f`<span class="nobody">· nobody yet</span>`:T}</span>
        <div role="group" aria-label=${L==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${ce.length}, minmax(0, 1fr))">
          ${ce.map(([q,xe])=>f`<button type="button" class="choice" aria-pressed=${H===q?"true":"false"} ?disabled=${l} @click=${()=>ie(q)}>
                ${xe}
              </button>`)}
        </div>
        ${u.length?f`<div role="group" aria-label=${L==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${u.map(q=>f`<button type="button" class="chip" aria-pressed=${H.toLowerCase()===q.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>ie(q)}>
                    ${q}
                  </button>`)}
            </div>`:T}
        <input
          type="text"
          .value=${ue&&!u.some(q=>q.toLowerCase()===ue.toLowerCase())?ue:""}
          ?disabled=${l}
          aria-label=${L==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${q=>{let xe=q.target.value.trim();xe&&xe!==H&&this.setRide(o,L,xe)}}
          @keydown=${q=>{q.key==="Enter"&&q.target.blur()}}
        />
        ${!b&&H!==""&&H!=="none"?g(L,H):T}
      </div>`},g=(L,Z)=>{let H=d(`along-${L}`),ue=H!==void 0?H:L==="pick"?o.pick_along??[]:o.along,ie=[...Se(e).filter(q=>q!==o.kid),...r.filter(q=>q!==Z)];return ie.length?f`<div class="field-sub">
        <span class="field-label">${L==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${L==="pick"?"They come for the pick-up":"They leave home in the same car"}</span></span>
        <div role="group" aria-label=${L==="drop"?"Riding along on the drop-off":L==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${ie.map(q=>f`<button type="button" class="chip" aria-pressed=${ue.includes(q)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(o,q,L)}>
              ${r.includes(q)?be(e,q):me(e,q)}
            </button>`)}
        </div>
      </div>`:T},A=d("stay"),b=A!==void 0?!!A:o.stay,k=o.drop===o.pick&&r.includes(o.drop),S=d("along"),p=S!==void 0?S:o.along,I=o.own?[...Se(e),...r.filter(L=>L!==o.own)]:[],K=o.own!=null&&o.takes!=null,X=o.own!=null&&!K,le=d("takes"),v=le!==void 0?le:o.takes??null,$=d("arrive"),y=this.arriveDraft!==void 0?this.arriveDraft:$!==void 0?$:o.arrive_by,E=[],_=L=>L==="none"?"Not needed":Yn(e,L),M=L=>r.includes(L)?be(e,L):me(e,L),j=(L,Z,H)=>{Z===""&&!H.length||E.push(`${L}: ${[Z===""?"TBD":_(Z),...H.map(M)].join(", ")}`)};o.own||j("Drop-off",o.drop,o.along),o.own||j("Pick-up",o.pick,o.pick_along??[]),!o.own&&o.stay&&E.push("Stay: yes"),K&&E.push(`Takes: ${o.takes} min`),o.own&&o.along.length&&E.push(`Take along: ${o.along.map(M).join(", ")}`),o.arrive_by!=null&&E.push(`Arrive by: ${He(o.arrive_by)}`);let W=d("attending"),J=W!==void 0?!!W:o.attending!==!1;o.attending===!1&&E.splice(0,E.length,"Attending: no");let ee=i.date===this.today().date?"":`${ge(i.date)} · `,N=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${o.title}</span>
          <span class="ed-meta">${ee}${K?"any time ":""}${z(o.start)}–${z(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return o.where==="home"?f`${N}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${N}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
      ${o.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ge(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:T}
      <div class="field">
        <span class="field-label">${c} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${J?"true":"false"} ?disabled=${l} @click=${()=>this.setAttending(o,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${J?"false":"true"} ?disabled=${l} @click=${()=>this.setAttending(o,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${J?f`${o.where==="anywhere"?f`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:T}
            ${o.own?f`<p class="field-hint">${this.ownHint(e,o)}</p>`:f`${h("drop")} ${h("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${b?"true":"false"} ?disabled=${!k||l} @click=${()=>this.toggleStay(o)}>
                      ${k?b?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                    ${b&&k?g("both",o.drop):T}
                  </div>`}
      ${o.own?f`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${v!=null?`Takes ${v} min, any time ${z(o.start)}–${z(o.end)}`:"At its set time"}</span>
            </span>
            ${v!=null?f`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${l||v<=5} @click=${()=>this.setTakes(o,Math.max(5,v-5))}>−</button>
                  <span class="arrive-value">${v} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${l||v+5>o.end-o.start} @click=${()=>this.setTakes(o,v+5)}>+</button>
                </span>`:T}
          </div>
          <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setTakes(o,v!=null?null:Math.min(10,Math.max(5,o.end-o.start)))}>
            ${v!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:T}
      ${X&&I.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${I.map(L=>f`<button type="button" class="chip" aria-pressed=${p.includes(L)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(o,L)}>
                  ${r.includes(L)?be(e,L):me(e,L)}
                </button>`)}
            </div>
          </div>`:T}
      ${K?T:f`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${y!=null?`${o.start-y} min before it starts`:`Aims for a few minutes before ${z(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${l} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${y!=null?z(y):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${l||y==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${y!=null?f`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:T}`}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${E.length?E.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:T}
      ${J&&!o.own?f`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:T}
    `}};Lt.styles=gi,Lt.properties={backend:{attribute:!1},pinDay:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Lt);function pc(){let s=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&s.push(t.shadowRoot);return s}function tr(s=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=o=>{if(o)for(let r of pc())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!o},i=o=>{if(clearTimeout(e),o.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),s)};window.addEventListener("pointermove",i,{passive:!0}),window.addEventListener("pointerdown",i,{passive:!0}),e=setTimeout(()=>n(!0),s)}var nr=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],sr=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function or(s,t,e,n){let i=Math.max(0,Math.min(t,s.length)),o=Math.max(i,Math.min(e,s.length));return{value:s.slice(0,i)+n+s.slice(o),caret:i+n.length}}function ir(s,t,e){let n=Math.max(0,Math.min(t,s.length)),i=Math.max(n,Math.min(e,s.length));if(n!==i)return{value:s.slice(0,n)+s.slice(i),caret:n};if(n===0)return{value:s,caret:0};let o=Array.from(s.slice(0,n));o.pop();let r=o.join("");return{value:r+s.slice(n),caret:r.length}}function rr(s,t){return t===0||/\s$/.test(s.slice(0,t))}var fc=new Set(["text","search","email","url","tel","number","password"]);function ar(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&fc.has(s.type)&&!s.readOnly&&!s.disabled}var gc={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},mc={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Rt=class extends $e{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,i=e.selectionEnd;if(n!==null&&i!==null)return[n,i]}catch{}return[e.value.length,e.value.length]}apply(e,n,i){e.value=n;try{e.setSelectionRange(i,i)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=rr(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[i,o]=this.selection(n),r=ir(n.value,i,o);this.apply(n,r.value,r.caret);break}default:{let i=e==="space"?" ":this.shift?e.toUpperCase():e,[o,r]=this.selection(n),a=or(n.value,o,r,i);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,i=e==="layout"?this.layout==="letters"?"123":"ABC":gc[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${mc[e]??i}
      aria-pressed=${e==="shift"?String(this.shift):T}
      @click=${()=>this.press(e)}
    >
      ${i}
    </button>`}render(){let e=this.layout==="letters"?nr:sr;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>f`<div class="row">${n.map(i=>this.key(i))}</div>`)}
      </div>`}};Rt.styles=Ke`
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
  `,Rt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Rt);function bc(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function lr(s){let t=new WeakSet,e=r=>{let a=r.composedPath();o(a);let c=a[0];ar(c)&&s.attach(c)},n=()=>{setTimeout(()=>{let r=bc();!s.target||r===s.target||(ar(r)?s.attach(r):s.detach())},0)},i=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},o=r=>{for(let a of r)a instanceof ShadowRoot&&i(a)};i(document),document.addEventListener("pointerdown",r=>o(r.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var Ps="mydashlight",xc=`/api/${Ps}/pair`,vc=`/api/${Ps}/pair/poll`,Ds=`/${Ps}`,Ls="pair";function cr(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function dr(s,t){return`${s}${Ds}?${Ls}=${encodeURIComponent(t)}`}function yc(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var st=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function ur(s=fetch){let t=await s(xc,{method:"POST",cache:"no-store"});if(t.status===429)throw new st("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new st(`Home Assistant answered ${t.status}.`);return await t.json()}async function hr(s,t,e=fetch){let n=await e(vc,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new st(`Home Assistant answered ${n.status}.`);let i=await n.json();return i.status==="paired"&&i.auth?{status:"paired",auth:yc(t,i.auth)}:{status:"pending"}}var gt=function(s,t){let i=s,o=It[t],r=null,a=0,c=null,l=[],d={},u=function(v,$){a=i*4+17,r=(function(y){let E=new Array(y);for(let _=0;_<y;_+=1){E[_]=new Array(y);for(let M=0;M<y;M+=1)E[_][M]=null}return E})(a),h(0,0),h(a-7,0),h(0,a-7),b(),A(),S(v,$),i>=7&&k(v),c==null&&(c=K(i,o,l)),p(c,$)},h=function(v,$){for(let y=-1;y<=7;y+=1)if(!(v+y<=-1||a<=v+y))for(let E=-1;E<=7;E+=1)$+E<=-1||a<=$+E||(0<=y&&y<=6&&(E==0||E==6)||0<=E&&E<=6&&(y==0||y==6)||2<=y&&y<=4&&2<=E&&E<=4?r[v+y][$+E]=!0:r[v+y][$+E]=!1)},g=function(){let v=0,$=0;for(let y=0;y<8;y+=1){u(!0,y);let E=ze.getLostPoint(d);(y==0||v>E)&&(v=E,$=y)}return $},A=function(){for(let v=8;v<a-8;v+=1)r[v][6]==null&&(r[v][6]=v%2==0);for(let v=8;v<a-8;v+=1)r[6][v]==null&&(r[6][v]=v%2==0)},b=function(){let v=ze.getPatternPosition(i);for(let $=0;$<v.length;$+=1)for(let y=0;y<v.length;y+=1){let E=v[$],_=v[y];if(r[E][_]==null)for(let M=-2;M<=2;M+=1)for(let j=-2;j<=2;j+=1)M==-2||M==2||j==-2||j==2||M==0&&j==0?r[E+M][_+j]=!0:r[E+M][_+j]=!1}},k=function(v){let $=ze.getBCHTypeNumber(i);for(let y=0;y<18;y+=1){let E=!v&&($>>y&1)==1;r[Math.floor(y/3)][y%3+a-8-3]=E}for(let y=0;y<18;y+=1){let E=!v&&($>>y&1)==1;r[y%3+a-8-3][Math.floor(y/3)]=E}},S=function(v,$){let y=o<<3|$,E=ze.getBCHTypeInfo(y);for(let _=0;_<15;_+=1){let M=!v&&(E>>_&1)==1;_<6?r[_][8]=M:_<8?r[_+1][8]=M:r[a-15+_][8]=M}for(let _=0;_<15;_+=1){let M=!v&&(E>>_&1)==1;_<8?r[8][a-_-1]=M:_<9?r[8][15-_-1+1]=M:r[8][15-_-1]=M}r[a-8][8]=!v},p=function(v,$){let y=-1,E=a-1,_=7,M=0,j=ze.getMaskFunction($);for(let W=a-1;W>0;W-=2)for(W==6&&(W-=1);;){for(let J=0;J<2;J+=1)if(r[E][W-J]==null){let ee=!1;M<v.length&&(ee=(v[M]>>>_&1)==1),j(E,W-J)&&(ee=!ee),r[E][W-J]=ee,_-=1,_==-1&&(M+=1,_=7)}if(E+=y,E<0||a<=E){E-=y,y=-y;break}}},I=function(v,$){let y=0,E=0,_=0,M=new Array($.length),j=new Array($.length);for(let N=0;N<$.length;N+=1){let L=$[N].dataCount,Z=$[N].totalCount-L;E=Math.max(E,L),_=Math.max(_,Z),M[N]=new Array(L);for(let ce=0;ce<M[N].length;ce+=1)M[N][ce]=255&v.getBuffer()[ce+y];y+=L;let H=ze.getErrorCorrectPolynomial(Z),ie=Bt(M[N],H.getLength()-1).mod(H);j[N]=new Array(H.getLength()-1);for(let ce=0;ce<j[N].length;ce+=1){let q=ce+ie.getLength()-j[N].length;j[N][ce]=q>=0?ie.getAt(q):0}}let W=0;for(let N=0;N<$.length;N+=1)W+=$[N].totalCount;let J=new Array(W),ee=0;for(let N=0;N<E;N+=1)for(let L=0;L<$.length;L+=1)N<M[L].length&&(J[ee]=M[L][N],ee+=1);for(let N=0;N<_;N+=1)for(let L=0;L<$.length;L+=1)N<j[L].length&&(J[ee]=j[L][N],ee+=1);return J},K=function(v,$,y){let E=pr.getRSBlocks(v,$),_=fr();for(let j=0;j<y.length;j+=1){let W=y[j];_.put(W.getMode(),4),_.put(W.getLength(),ze.getLengthInBits(W.getMode(),v)),W.write(_)}let M=0;for(let j=0;j<E.length;j+=1)M+=E[j].dataCount;if(_.getLengthInBits()>M*8)throw"code length overflow. ("+_.getLengthInBits()+">"+M*8+")";for(_.getLengthInBits()+4<=M*8&&_.put(0,4);_.getLengthInBits()%8!=0;)_.putBit(!1);for(;!(_.getLengthInBits()>=M*8||(_.put(236,8),_.getLengthInBits()>=M*8));)_.put(17,8);return I(_,E)};d.addData=function(v,$){$=$||"Byte";let y=null;switch($){case"Numeric":y=wc(v);break;case"Alphanumeric":y=kc(v);break;case"Byte":y=$c(v);break;case"Kanji":y=Ec(v);break;default:throw"mode:"+$}l.push(y),c=null},d.isDark=function(v,$){if(v<0||a<=v||$<0||a<=$)throw v+","+$;return r[v][$]},d.getModuleCount=function(){return a},d.make=function(){if(i<1){let v=1;for(;v<40;v++){let $=pr.getRSBlocks(v,o),y=fr();for(let _=0;_<l.length;_++){let M=l[_];y.put(M.getMode(),4),y.put(M.getLength(),ze.getLengthInBits(M.getMode(),v)),M.write(y)}let E=0;for(let _=0;_<$.length;_++)E+=$[_].dataCount;if(y.getLengthInBits()<=E*8)break}i=v}u(!1,g())},d.createTableTag=function(v,$){v=v||2,$=typeof $>"u"?v*4:$;let y="";y+='<table style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: "+$+"px;",y+='">',y+="<tbody>";for(let E=0;E<d.getModuleCount();E+=1){y+="<tr>";for(let _=0;_<d.getModuleCount();_+=1)y+='<td style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: 0px;",y+=" width: "+v+"px;",y+=" height: "+v+"px;",y+=" background-color: ",y+=d.isDark(E,_)?"#000000":"#ffffff",y+=";",y+='"/>';y+="</tr>"}return y+="</tbody>",y+="</table>",y},d.createSvgTag=function(v,$,y,E){let _={};typeof arguments[0]=="object"&&(_=arguments[0],v=_.cellSize,$=_.margin,y=_.alt,E=_.title),v=v||2,$=typeof $>"u"?v*4:$,y=typeof y=="string"?{text:y}:y||{},y.text=y.text||null,y.id=y.text?y.id||"qrcode-description":null,E=typeof E=="string"?{text:E}:E||{},E.text=E.text||null,E.id=E.text?E.id||"qrcode-title":null;let M=d.getModuleCount()*v+$*2,j,W,J,ee,N="",L;for(L="l"+v+",0 0,"+v+" -"+v+",0 0,-"+v+"z ",N+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',N+=_.scalable?"":' width="'+M+'px" height="'+M+'px"',N+=' viewBox="0 0 '+M+" "+M+'" ',N+=' preserveAspectRatio="xMinYMin meet"',N+=E.text||y.text?' role="img" aria-labelledby="'+X([E.id,y.id].join(" ").trim())+'"':"",N+=">",N+=E.text?'<title id="'+X(E.id)+'">'+X(E.text)+"</title>":"",N+=y.text?'<description id="'+X(y.id)+'">'+X(y.text)+"</description>":"",N+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',N+='<path d="',J=0;J<d.getModuleCount();J+=1)for(ee=J*v+$,j=0;j<d.getModuleCount();j+=1)d.isDark(J,j)&&(W=j*v+$,N+="M"+W+","+ee+L);return N+='" stroke="transparent" fill="black"/>',N+="</svg>",N},d.createDataURL=function(v,$){v=v||2,$=typeof $>"u"?v*4:$;let y=d.getModuleCount()*v+$*2,E=$,_=y-$;return Ac(y,y,function(M,j){if(E<=M&&M<_&&E<=j&&j<_){let W=Math.floor((M-E)/v),J=Math.floor((j-E)/v);return d.isDark(J,W)?0:1}else return 1})},d.createImgTag=function(v,$,y){v=v||2,$=typeof $>"u"?v*4:$;let E=d.getModuleCount()*v+$*2,_="";return _+="<img",_+=' src="',_+=d.createDataURL(v,$),_+='"',_+=' width="',_+=E,_+='"',_+=' height="',_+=E,_+='"',y&&(_+=' alt="',_+=X(y),_+='"'),_+="/>",_};let X=function(v){let $="";for(let y=0;y<v.length;y+=1){let E=v.charAt(y);switch(E){case"<":$+="&lt;";break;case">":$+="&gt;";break;case"&":$+="&amp;";break;case'"':$+="&quot;";break;default:$+=E;break}}return $},le=function(v){v=typeof v>"u"?2:v;let y=d.getModuleCount()*1+v*2,E=v,_=y-v,M,j,W,J,ee,N={"██":"█","█ ":"▀"," █":"▄","  ":" "},L={"██":"▀","█ ":"▀"," █":" ","  ":" "},Z="";for(M=0;M<y;M+=2){for(W=Math.floor((M-E)/1),J=Math.floor((M+1-E)/1),j=0;j<y;j+=1)ee="█",E<=j&&j<_&&E<=M&&M<_&&d.isDark(W,Math.floor((j-E)/1))&&(ee=" "),E<=j&&j<_&&E<=M+1&&M+1<_&&d.isDark(J,Math.floor((j-E)/1))?ee+=" ":ee+="█",Z+=v<1&&M+1>=_?L[ee]:N[ee];Z+=`
`}return y%2&&v>0?Z.substring(0,Z.length-y-1)+Array(y+1).join("▀"):Z.substring(0,Z.length-1)};return d.createASCII=function(v,$){if(v=v||1,v<2)return le($);v-=1,$=typeof $>"u"?v*2:$;let y=d.getModuleCount()*v+$*2,E=$,_=y-$,M,j,W,J,ee=Array(v+1).join("██"),N=Array(v+1).join("  "),L="",Z="";for(M=0;M<y;M+=1){for(W=Math.floor((M-E)/v),Z="",j=0;j<y;j+=1)J=1,E<=j&&j<_&&E<=M&&M<_&&d.isDark(W,Math.floor((j-E)/v))&&(J=0),Z+=J?ee:N;for(W=0;W<v;W+=1)L+=Z+`
`}return L.substring(0,L.length-1)},d.renderTo2dContext=function(v,$){$=$||2;let y=d.getModuleCount();for(let E=0;E<y;E++)for(let _=0;_<y;_++)v.fillStyle=d.isDark(E,_)?"black":"white",v.fillRect(_*$,E*$,$,$)},d};gt.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};gt.createStringToBytes=function(s,t){let e=(function(){let i=Tc(s),o=function(){let c=i.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=i.read();if(c==-1)break;let l=o(),d=o(),u=o(),h=String.fromCharCode(c<<8|l),g=d<<8|u;a[h]=g,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(i){let o=[];for(let r=0;r<i.length;r+=1){let a=i.charCodeAt(r);if(a<128)o.push(a);else{let c=e[i.charAt(r)];typeof c=="number"?(c&255)==c?o.push(c):(o.push(c>>>8),o.push(c&255)):o.push(n)}}return o}};var fe={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},It={L:1,M:0,Q:3,H:2},Ne={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},ze=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,i={},o=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return i.getBCHTypeInfo=function(r){let a=r<<10;for(;o(a)-o(t)>=0;)a^=t<<o(a)-o(t);return(r<<10|a)^n},i.getBCHTypeNumber=function(r){let a=r<<12;for(;o(a)-o(e)>=0;)a^=e<<o(a)-o(e);return r<<12|a},i.getPatternPosition=function(r){return s[r-1]},i.getMaskFunction=function(r){switch(r){case Ne.PATTERN000:return function(a,c){return(a+c)%2==0};case Ne.PATTERN001:return function(a,c){return a%2==0};case Ne.PATTERN010:return function(a,c){return c%3==0};case Ne.PATTERN011:return function(a,c){return(a+c)%3==0};case Ne.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case Ne.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case Ne.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case Ne.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},i.getErrorCorrectPolynomial=function(r){let a=Bt([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Bt([1,Ue.gexp(c)],0));return a},i.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case fe.MODE_NUMBER:return 10;case fe.MODE_ALPHA_NUM:return 9;case fe.MODE_8BIT_BYTE:return 8;case fe.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case fe.MODE_NUMBER:return 12;case fe.MODE_ALPHA_NUM:return 11;case fe.MODE_8BIT_BYTE:return 16;case fe.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case fe.MODE_NUMBER:return 14;case fe.MODE_ALPHA_NUM:return 13;case fe.MODE_8BIT_BYTE:return 16;case fe.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},i.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1){let g=0,A=r.isDark(u,h);for(let b=-1;b<=1;b+=1)if(!(u+b<0||a<=u+b))for(let k=-1;k<=1;k+=1)h+k<0||a<=h+k||b==0&&k==0||A==r.isDark(u+b,h+k)&&(g+=1);g>5&&(c+=3+g-5)}for(let u=0;u<a-1;u+=1)for(let h=0;h<a-1;h+=1){let g=0;r.isDark(u,h)&&(g+=1),r.isDark(u+1,h)&&(g+=1),r.isDark(u,h+1)&&(g+=1),r.isDark(u+1,h+1)&&(g+=1),(g==0||g==4)&&(c+=3)}for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(u,h)&&!r.isDark(u,h+1)&&r.isDark(u,h+2)&&r.isDark(u,h+3)&&r.isDark(u,h+4)&&!r.isDark(u,h+5)&&r.isDark(u,h+6)&&(c+=40);for(let u=0;u<a;u+=1)for(let h=0;h<a-6;h+=1)r.isDark(h,u)&&!r.isDark(h+1,u)&&r.isDark(h+2,u)&&r.isDark(h+3,u)&&r.isDark(h+4,u)&&!r.isDark(h+5,u)&&r.isDark(h+6,u)&&(c+=40);let l=0;for(let u=0;u<a;u+=1)for(let h=0;h<a;h+=1)r.isDark(h,u)&&(l+=1);let d=Math.abs(100*l/a/a-50)/5;return c+=d*10,c},i})(),Ue=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),Bt=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let i=0;for(;i<s.length&&s[i]==0;)i+=1;let o=new Array(s.length-i+t);for(let r=0;r<s.length-i;r+=1)o[r]=s[r+i];return o})(),n={};return n.getAt=function(i){return e[i]},n.getLength=function(){return e.length},n.multiply=function(i){let o=new Array(n.getLength()+i.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<i.getLength();a+=1)o[r+a]^=Ue.gexp(Ue.glog(n.getAt(r))+Ue.glog(i.getAt(a)));return Bt(o,0)},n.mod=function(i){if(n.getLength()-i.getLength()<0)return n;let o=Ue.glog(n.getAt(0))-Ue.glog(i.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<i.getLength();a+=1)r[a]^=Ue.gexp(Ue.glog(i.getAt(a))+o);return Bt(r,0).mod(i)},n},pr=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(i,o){let r={};return r.totalCount=i,r.dataCount=o,r},e={},n=function(i,o){switch(o){case It.L:return s[(i-1)*4+0];case It.M:return s[(i-1)*4+1];case It.Q:return s[(i-1)*4+2];case It.H:return s[(i-1)*4+3];default:return}};return e.getRSBlocks=function(i,o){let r=n(i,o);if(typeof r>"u")throw"bad rs block @ typeNumber:"+i+"/errorCorrectionLevel:"+o;let a=r.length/3,c=[];for(let l=0;l<a;l+=1){let d=r[l*3+0],u=r[l*3+1],h=r[l*3+2];for(let g=0;g<d;g+=1)c.push(t(u,h))}return c},e})(),fr=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let i=Math.floor(n/8);return(s[i]>>>7-n%8&1)==1},e.put=function(n,i){for(let o=0;o<i;o+=1)e.putBit((n>>>i-o-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let i=Math.floor(t/8);s.length<=i&&s.push(0),n&&(s[i]|=128>>>t%8),t+=1},e},wc=function(s){let t=fe.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(i(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(i(a.substring(c,c+1)),4):a.length-c==2&&r.put(i(a.substring(c,c+2)),7))};let i=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+o(r.charAt(c));return a},o=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},kc=function(s){let t=fe.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(o){return e.length},n.write=function(o){let r=e,a=0;for(;a+1<r.length;)o.put(i(r.charAt(a))*45+i(r.charAt(a+1)),11),a+=2;a<r.length&&o.put(i(r.charAt(a)),6)};let i=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;if("A"<=o&&o<="Z")return o.charCodeAt(0)-65+10;switch(o){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+o}};return n},$c=function(s){let t=fe.MODE_8BIT_BYTE,e=s,n=gt.stringToBytes(s),i={};return i.getMode=function(){return t},i.getLength=function(o){return n.length},i.write=function(o){for(let r=0;r<n.length;r+=1)o.put(n[r],8)},i},Ec=function(s){let t=fe.MODE_KANJI,e=s,n=gt.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let i=n(s),o={};return o.getMode=function(){return t},o.getLength=function(r){return~~(i.length/2)},o.write=function(r){let a=i,c=0;for(;c+1<a.length;){let l=(255&a[c])<<8|255&a[c+1];if(33088<=l&&l<=40956)l-=33088;else if(57408<=l&&l<=60351)l-=49472;else throw"illegal char at "+(c+1)+"/"+l;l=(l>>>8&255)*192+(l&255),r.put(l,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},o},gr=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,i){n=n||0,i=i||e.length;for(let o=0;o<i;o+=1)t.writeByte(e[o+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},_c=function(){let s=0,t=0,e=0,n="",i={},o=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return i.writeByte=function(a){for(s=s<<8|a&255,t+=8,e+=1;t>=6;)o(s>>>t-6),t-=6},i.flush=function(){if(t>0&&(o(s<<6-t),s=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},i.toString=function(){return n},i},Tc=function(s){let t=s,e=0,n=0,i=0,o={};o.read=function(){for(;i<8;){if(e>=t.length){if(i==0)return-1;throw"unexpected end of file./"+i}let c=t.charAt(e);if(e+=1,c=="=")return i=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),i+=6}let a=n>>>i-8&255;return i-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return o},Cc=function(s,t){let e=s,n=t,i=new Array(s*t),o={};o.setPixel=function(l,d,u){i[d*e+l]=u},o.write=function(l){l.writeString("GIF87a"),l.writeShort(e),l.writeShort(n),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(e),l.writeShort(n),l.writeByte(0);let d=2,u=a(d);l.writeByte(d);let h=0;for(;u.length-h>255;)l.writeByte(255),l.writeBytes(u,h,255),h+=255;l.writeByte(u.length-h),l.writeBytes(u,h,u.length-h),l.writeByte(0),l.writeString(";")};let r=function(l){let d=l,u=0,h=0,g={};return g.write=function(A,b){if(A>>>b)throw"length over";for(;u+b>=8;)d.writeByte(255&(A<<u|h)),b-=8-u,A>>>=8-u,h=0,u=0;h=A<<u|h,u=u+b},g.flush=function(){u>0&&d.writeByte(h)},g},a=function(l){let d=1<<l,u=(1<<l)+1,h=l+1,g=c();for(let p=0;p<d;p+=1)g.add(String.fromCharCode(p));g.add(String.fromCharCode(d)),g.add(String.fromCharCode(u));let A=gr(),b=r(A);b.write(d,h);let k=0,S=String.fromCharCode(i[k]);for(k+=1;k<i.length;){let p=String.fromCharCode(i[k]);k+=1,g.contains(S+p)?S=S+p:(b.write(g.indexOf(S),h),g.size()<4095&&(g.size()==1<<h&&(h+=1),g.add(S+p)),S=p)}return b.write(g.indexOf(S),h),b.write(u,h),b.flush(),A.toByteArray()},c=function(){let l={},d=0,u={};return u.add=function(h){if(u.contains(h))throw"dup key:"+h;l[h]=d,d+=1},u.size=function(){return d},u.indexOf=function(h){return l[h]},u.contains=function(h){return typeof l[h]<"u"},u};return o},Ac=function(s,t,e){let n=Cc(s,t);for(let a=0;a<t;a+=1)for(let c=0;c<s;c+=1)n.setPixel(c,a,e(c,a));let i=gr();n.write(i);let o=_c(),r=i.toByteArray();for(let a=0;a<r.length;a+=1)o.writeByte(r[a]);return o.flush(),"data:image/gif;base64,"+o},mr=gt,hu=gt.stringToBytes;function br(s){let t=mr(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let i=0;i<e;i++)for(let o=0;o<e;o++)t.isDark(i,o)&&(n+=`M${o} ${i}h1v1h-1z`);return{size:e,d:n}}var Sc=1e4,Ot=class extends $e{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await ur();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof st&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),Sc)}}async poll(e){let n=this.secret;if(n)try{let i=await hr(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,i.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:i.auth}));return}if(i.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return T;let{size:e,d:n}=br(dr(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${de`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?cr(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Ds}?${Ls}</span> and type the code.
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
    </div>`}};Ot.styles=Ke`
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
  `,Ot.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",Ot);var Rs="hassTokens";function xr(){try{let s=localStorage.getItem(Rs);return s?JSON.parse(s):null}catch{return null}}function Is(s){try{s?localStorage.setItem(Rs,JSON.stringify(s)):localStorage.removeItem(Rs)}catch{}}function Mc(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function Pc(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function Dc(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!xr()){let e=await Pc();e&&Is(e)}try{let e=await to({hassUrl:location.origin,loadTokens:async()=>xr(),saveTokens:Is});t&&history.replaceState(null,"",location.pathname+ds(location.search));let n=await no({auth:e});s.backend=new Kt(n),n.addEventListener("reconnect-error",(i,o)=>{o===2&&vr()})}catch(e){if(e===2){vr();return}Mc(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function vr(){Is(null),location.replace(location.pathname+ds(location.search))}var wr=St(location.search),yr=document.querySelector("mydashlight-keyboard");yr&&wr.keyboard!==!1&&lr(yr);wr.cursor!=="show"&&tr();Dc();
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
