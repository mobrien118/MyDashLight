var ta=Object.defineProperty;var Wn=(i,t)=>()=>(i&&(t=i(i=0)),t);var na=(i,t)=>{for(var e in t)ta(i,e,{get:t[e],enumerable:!0})};function Rn(i){if(typeof i!="string"||!i)throw new Error("expected a non-empty string, got: "+i)}function Di(i){if(typeof i!="number")throw new Error("expected a number, got: "+i)}function Al(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function Wo(i){return Al(i,t=>t.unicode)}function Sl(i){function t(e,n,o){let s=n?i.createObjectStore(e,{keyPath:n}):i.createObjectStore(e);if(o)for(let[r,[a,c]]of Object.entries(o))s.createIndex(r,a,{multiEntry:c});return s}t($t),t(rt,Tl,{[Go]:[$l,!0],[Yo]:[[El,_l]],[Xo]:[Cl,!0]}),t(Oi,void 0,{[qo]:[""]})}function Jo(i,t,e){e.onerror=()=>t(e.error),e.onblocked=()=>t(new Error("IDB blocked")),e.onsuccess=()=>i(e.result)}async function Ll(i){let t=await new Promise((e,n)=>{let o=indexedDB.open(i,wl);Ii[i]=o,o.onupgradeneeded=s=>{s.oldVersion<kl&&Sl(o.result)},Jo(e,n,o)});return t.onclose=()=>ji(i),t}function Dl(i){return Bn[i]||(Bn[i]=Ll(i)),Bn[i]}function Ue(i,t,e,n){return new Promise((o,s)=>{let r=i.transaction(t,e,{durability:"relaxed"}),a=typeof t=="string"?r.objectStore(t):t.map(d=>r.objectStore(d)),c;n(a,r,d=>{c=d}),r.oncomplete=()=>o(c),r.onerror=()=>s(r.error)})}function ji(i){let t=Ii[i],e=t&&t.result;if(e){e.close();let n=Nn[i];if(n)for(let o of n)o()}delete Ii[i],delete Bn[i],delete Nn[i]}function Rl(i){return new Promise((t,e)=>{ji(i);let n=indexedDB.deleteDatabase(i);Jo(t,e,n)})}function Il(i,t){let e=Nn[i];e||(e=Nn[i]=[]),e.push(t)}function kt(i){return i.split(/[\s_]+/).map(t=>!t.match(/\w/)||Bl.has(t)?t.toLowerCase():t.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}function Zo(i){return i.filter(Boolean).map(t=>t.toLowerCase()).filter(t=>t.length>=Ol)}function Nl(i){return i.map(({annotation:e,emoticon:n,group:o,order:s,shortcodes:r,skins:a,tags:c,emoji:d,version:u})=>{let l=[...new Set(Zo([...(r||[]).map(kt).flat(),...(c||[]).map(kt).flat(),...kt(e),n]))].sort(),p={annotation:e,group:o,order:s,tags:c,tokens:l,unicode:d,version:u};if(n&&(p.emoticon=n),r&&(p.shortcodes=r),a){p.skinTones=[],p.skinUnicodes=[],p.skinVersions=[];for(let{tone:b,emoji:T,version:m}of a)p.skinTones.push(b),p.skinUnicodes.push(T),p.skinVersions.push(m)}return p})}function Qo(i,t,e,n){i[t](e).onsuccess=o=>n&&n(o.target.result)}function ot(i,t,e){Qo(i,"get",t,e)}function er(i,t,e){Qo(i,"getAll",t,e)}function zi(i){i.commit&&i.commit()}function jl(i,t){let e=i[0];for(let n=1;n<i.length;n++){let o=i[n];t(e)>t(o)&&(e=o)}return e}function tr(i,t){let e=jl(i,o=>o.length),n=[];for(let o of e)i.some(s=>s.findIndex(r=>t(r)===t(o))===-1)||n.push(o);return n}async function zl(i){return!await Hi(i,$t,On)}async function Hl(i,t,e){let[n,o]=await Promise.all([Ri,On].map(s=>Hi(i,$t,s)));return n===e&&o===t}async function Ul(i,t){return Ue(i,rt,Et,(n,o,s)=>{let r,a=()=>{n.getAll(r&&IDBKeyRange.lowerBound(r,!0),50).onsuccess=c=>{let d=c.target.result;for(let u of d)if(r=u.unicode,t(u))return s(u);if(d.length<50)return s();a()}};a()})}async function nr(i,t,e,n){try{let o=Nl(t);await Ue(i,[rt,$t],Ni,([s,r],a)=>{let c,d,u=0;function l(){++u===2&&p()}function p(){if(!(c===n&&d===e)){s.clear();for(let b of o)s.put(b);r.put(n,Ri),r.put(e,On),zi(a)}}ot(r,Ri,b=>{c=b,l()}),ot(r,On,b=>{d=b,l()})})}finally{}}async function Fl(i,t){return Ue(i,rt,Et,(e,n,o)=>{let s=IDBKeyRange.bound([t,0],[t+1,0],!1,!0);er(e.index(Yo),s,o)})}async function ir(i,t){let e=Zo(kt(t));return e.length?Ue(i,rt,Et,(n,o,s)=>{let r=[],a=()=>{r.length===e.length&&c()},c=()=>{let d=tr(r,u=>u.unicode);s(d.sort((u,l)=>u.order<l.order?-1:1))};for(let d=0;d<e.length;d++){let u=e[d],l=d===e.length-1?IDBKeyRange.bound(u,u+"￿",!1,!0):IDBKeyRange.only(u);er(n.index(Go),l,p=>{r.push(p),a()})}}):[]}async function Kl(i,t){let e=await ir(i,t);return e.length?e.filter(n=>(n.shortcodes||[]).map(s=>s.toLowerCase()).includes(t.toLowerCase()))[0]||null:await Ul(i,o=>(o.shortcodes||[]).includes(t.toLowerCase()))||null}async function Wl(i,t){return Ue(i,rt,Et,(e,n,o)=>ot(e,t,s=>{if(s)return o(s);ot(e.index(Xo),t,r=>o(r||null))}))}function Hi(i,t,e){return Ue(i,t,Et,(n,o,s)=>ot(n,e,s))}function Vl(i,t,e,n){return Ue(i,t,Ni,(o,s)=>{o.put(n,e),zi(s)})}function Gl(i,t){return Ue(i,Oi,Ni,(e,n)=>ot(e,t,o=>{e.put((o||0)+1,t),zi(n)}))}function ql(i,t,e){return e===0?[]:Ue(i,[Oi,rt],Et,([n,o],s,r)=>{let a=[];n.index(qo).openCursor(void 0,"prev").onsuccess=c=>{let d=c.target.result;if(!d)return r(a);function u(b){if(a.push(b),a.length===e)return r(a);d.continue()}let l=d.primaryKey,p=t.byName(l);if(p)return u(p);ot(o,l,b=>{if(b)return u(b);d.continue()})}})}function Yl(i,t){let e=new Map;for(let o of i){let s=t(o);for(let r of s){let a=e;for(let d=0;d<r.length;d++){let u=r.charAt(d),l=a.get(u);l||(l=new Map,a.set(u,l)),a=l}let c=a.get(In);c||(c=[],a.set(In,c)),c.push(o)}}return(o,s)=>{let r=e;for(let d=0;d<o.length;d++){let u=o.charAt(d),l=r.get(u);if(l)r=l;else return[]}if(s)return r.get(In)||[];let a=[],c=[r];for(;c.length;){let u=[...c.shift().entries()].sort((l,p)=>l[0]<p[0]?-1:1);for(let[l,p]of u)l===In?a.push(...p):c.push(p)}return a}}function Jl(i){let t=i&&Array.isArray(i),e=t&&i.length&&(!i[0]||Xl.some(n=>!(n in i[0])));if(!t||e)throw new Error("Custom emojis are in the wrong format")}function Vo(i){Jl(i);let t=(p,b)=>p.name.toLowerCase()<b.name.toLowerCase()?-1:1,e=i.sort(t),o=Yl(i,p=>{let b=new Set;if(p.shortcodes)for(let T of p.shortcodes)for(let m of kt(T))b.add(m);return b}),s=p=>o(p,!0),r=p=>o(p,!1),a=p=>{let b=kt(p),T=b.map((m,x)=>(x<b.length-1?s:r)(m));return tr(T,m=>m.name).sort(t)},c=new Map,d=new Map;for(let p of i){d.set(p.name.toLowerCase(),p);for(let b of p.shortcodes||[])c.set(b.toLowerCase(),p)}return{all:e,search:a,byShortcode:p=>c.get(p.toLowerCase()),byName:p=>d.get(p.toLowerCase())}}function Vt(i){if(!i)return i;if(Zl&&(i=structuredClone(i)),delete i.tokens,i.skinTones){let t=i.skinTones.length;i.skins=Array(t);for(let e=0;e<t;e++)i.skins[e]={tone:i.skinTones[e],unicode:i.skinUnicodes[e],version:i.skinVersions[e]};delete i.skinTones,delete i.skinUnicodes,delete i.skinVersions}return i}function sr(i){i||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}function ec(i){if(!i||!Array.isArray(i)||!i[0]||typeof i[0]!="object"||Ql.some(t=>!(t in i[0])))throw new Error("Emoji data is in the wrong format")}function or(i,t){if(Math.floor(i.status/100)!==2)throw new Error("Failed to fetch: "+t+":  "+i.status)}async function tc(i){let t=await fetch(i,{method:"HEAD"});or(t,i);let e=t.headers.get("etag");return sr(e),e}async function Bi(i){let t=await fetch(i);or(t,i);let e=t.headers.get("etag");sr(e);let n=await t.json();return ec(n),[e,n]}function nc(i){for(var t="",e=new Uint8Array(i),n=e.byteLength,o=-1;++o<n;)t+=String.fromCharCode(e[o]);return t}function ic(i){for(var t=i.length,e=new ArrayBuffer(t),n=new Uint8Array(e),o=-1;++o<t;)n[o]=i.charCodeAt(o);return e}async function rr(i){let t=JSON.stringify(i),e=ic(t),n=await crypto.subtle.digest("SHA-1",e),o=nc(n);return btoa(o)}async function sc(i,t){let e,n=await tc(t);if(!n){let o=await Bi(t);n=o[0],e=o[1],n||(n=await rr(e))}await Hl(i,t,n)||(e||(e=(await Bi(t))[1]),await nr(i,e,t,n))}async function oc(i,t){let[e,n]=await Bi(t);e||(e=await rr(n)),await nr(i,n,t,e)}async function rc(i,t){try{await sc(i,t)}catch(e){if(e.name!=="InvalidStateError")throw e}}var wl,kl,rt,$t,Oi,$l,Go,Tl,qo,El,_l,Yo,Ri,On,Ko,Et,Ni,Xo,Cl,Pl,Ml,Ii,Bn,Nn,Bl,Ol,In,Xl,Zl,Ql,Tt,Ui=Wn(()=>{wl=1,kl=1,rt="emoji",$t="keyvalue",Oi="favorites",$l="tokens",Go="tokens",Tl="unicode",qo="count",El="group",_l="order",Yo="group-order",Ri="eTag",On="url",Ko="skinTone",Et="readonly",Ni="readwrite",Xo="skinUnicodes",Cl="skinUnicodes",Pl="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",Ml="en";Ii={},Bn={},Nn={};Bl=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);Ol=2;In="";Xl=["name","url"];Zl=typeof wrappedJSObject<"u";Ql=["annotation","emoji","group","order","version"];Tt=class{constructor({dataSource:t=Pl,locale:e=Ml,customEmoji:n=[]}={}){this.dataSource=t,this.locale=e,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Vo(n),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){let t=this._db=await Dl(this._dbName);Il(this._dbName,this._clear);let e=this.dataSource;await zl(t)?await oc(t,e):this._lazyUpdate=rc(t,e)}async ready(){let t=async()=>(this._ready||(this._ready=this._init()),this._ready);await t(),this._db||await t()}async getEmojiByGroup(t){return Di(t),await this.ready(),Wo(await Fl(this._db,t)).map(Vt)}async getEmojiBySearchQuery(t){Rn(t),await this.ready();let e=this._custom.search(t),n=Wo(await ir(this._db,t)).map(Vt);return[...e,...n]}async getEmojiByShortcode(t){Rn(t),await this.ready();let e=this._custom.byShortcode(t);return e||Vt(await Kl(this._db,t))}async getEmojiByUnicodeOrName(t){Rn(t),await this.ready();let e=this._custom.byName(t);return e||Vt(await Wl(this._db,t))}async getPreferredSkinTone(){return await this.ready(),await Hi(this._db,$t,Ko)||0}async setPreferredSkinTone(t){return Di(t),await this.ready(),Vl(this._db,$t,Ko,t)}async incrementFavoriteEmojiCount(t){return Rn(t),await this.ready(),Gl(this._db,t)}async getTopFavoriteEmoji(t){return Di(t),await this.ready(),(await ql(this._db,this._custom,t)).map(Vt)}set customEmoji(t){this._custom=Vo(t)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await ji(this._dbName)}async delete(){await this._shutdown(),await Rl(this._dbName)}}});function lr(i){return i.unicode.includes("‍")}function gc(i){let t=cr(i,"#000"),e=cr(i,"#fff");return t&&e&&fc(t,e)}function mc(){let i=Object.entries(lc);try{for(let[t,e]of i)if(gc(t))return e}catch{}finally{}return i[0][1]}function kc(i,t){if(t===0)return i;let e=i.indexOf(yc);return e!==-1?i.substring(0,e)+String.fromCodePoint(xc+t-1)+i.substring(e):(i.endsWith(bc)&&(i=i.substring(0,i.length-1)),i+vc+String.fromCodePoint(wc+t-1))}function Oe(i){i.preventDefault(),i.stopPropagation()}function Vi(i,t,e){return t+=i?-1:1,t<0?t=e.length-1:t>=e.length&&(t=0),t}function vr(i,t){let e=new Set,n=[];for(let o of i){let s=t(o);e.has(s)||(e.add(s),n.push(o))}return n}function $c(i,t){let e=n=>{let o={};for(let s of n)typeof s.tone=="number"&&s.version<=t&&(o[s.tone]=s.unicode);return o};return i.map(({unicode:n,skins:o,shortcodes:s,url:r,name:a,category:c,annotation:d})=>({unicode:n,name:a,shortcodes:s,url:r,category:c,annotation:d,id:n||a,skins:o&&e(o)}))}function Ec(i,t,e){let n;Tc?(n=new ResizeObserver(e),n.observe(i)):zn(e),t.addEventListener("abort",()=>{n&&n.disconnect()})}function dr(i){{let t=document.createRange();return t.selectNode(i.firstChild),t.getBoundingClientRect().width}}function hr(i,t,e){let n=dr(t);if(!n){if(!at){at=e.cloneNode(!0);let o=getComputedStyle(e);for(let s of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])at.style.setProperty(s,o.getPropertyValue(s),"important")}try{return document.body.appendChild(at),at.firstChild.nodeValue=i,dr(at)}finally{at.remove()}}return n}function Cc(i,t,e){let n=!0;for(let o of i){let s=e(o);if(!s)continue;typeof Gi>"u"&&(Gi=hr(_c,t,t));let a=hr(o.unicode,s,t)/1.8<Gi;Ji.set(o.unicode,a),a||(n=!1)}return n}function Pc(i){return vr(i,t=>t)}function Mc(i){i&&(i.scrollTop=0)}function Gt(i,t,e){let n=i.get(t);return n||(n=e(),i.set(t,n)),n}function ur(i){return""+i}function Ac(i){let t=document.createElement("template");return t.innerHTML=i,t}function Ic(i,t){Rc?i.replaceChildren(...t):(i.innerHTML="",i.append(...t))}function Bc(i,t){let e=i.firstChild,n=0;for(;e;){if(t[n]!==e)return!0;e=e.nextSibling,n++}return n!==t.length}function Oc(i,t){let{targetNode:e}=t,{targetParentNode:n}=t,o=!1;n?o=Bc(n,i):(o=!0,t.targetNode=void 0,t.targetParentNode=n=e.parentNode),o&&Ic(n,i)}function Nc(i,t){for(let e of t){let{targetNode:n,currentExpression:o,binding:{expressionIndex:s,attributeName:r,attributeValuePre:a,attributeValuePost:c}}=e,d=i[s];if(o!==d)if(e.currentExpression=d,r)if(d===null)n.removeAttribute(r);else{let u=a+ur(d)+c;n.setAttribute(r,u)}else{let u;Array.isArray(d)?Oc(d,e):d instanceof Element?(u=d,n.replaceWith(u)):n.nodeValue=ur(d),u&&(e.targetNode=u)}}}function jc(i){let t="",e=!1,n=!1,o=-1,s=new Map,r=[],a=0;for(let d=0,u=i.length;d<u;d++){let l=i[d];if(t+=l.slice(a),d===u-1)break;for(let g=0;g<l.length;g++)switch(l.charAt(g)){case"<":{l.charAt(g+1)==="/"?r.pop():(e=!0,r.push(++o));break}case">":{e=!1,n=!1;break}case"=":{n=!0;break}}let p=r[r.length-1],b=Gt(s,p,()=>[]),T,m,x;if(n){let g=/(\S+)="?([^"=]*)$/.exec(l);T=g[1],m=g[2];let I=/^([^">]*)("?)/.exec(i[d+1]);x=I[1],t=t.slice(0,-1*g[0].length),a=I[0].length}else a=0;let C={attributeName:T,attributeValuePre:m,attributeValuePost:x,expressionIndex:d};b.push(C),!e&&!n&&(t+=" ")}return{template:Ac(t),elementsToBindings:s}}function pr(i,t,e){for(let n=0;n<i.length;n++){let o=i[n],s=o.attributeName?t:t.firstChild,r={binding:o,targetNode:s,targetParentNode:void 0,currentExpression:void 0};e.push(r)}}function zc(i,t){let e=[],n;if(t.size===1&&(n=t.get(0)))pr(n,i,e);else{let o=document.createTreeWalker(i,NodeFilter.SHOW_ELEMENT),s=i,r=-1;do{let a=t.get(++r);a&&pr(a,s,e)}while(s=o.nextNode())}return e}function Hc(i){let{template:t,elementsToBindings:e}=Gt(Sc,i,()=>jc(i)),n=t.cloneNode(!0).content.firstElementChild,o=zc(n,e);return function(r){return Nc(r,o),n}}function Uc(i){let t=Gt(Lc,i,()=>new Map),e=Dc;function n(s,...r){let a=Gt(t,s,()=>new Map);return Gt(a,e,()=>Hc(s))(r)}function o(s,r,a){return s.map((c,d)=>{let u=e;e=a(c);try{return r(c,d)}finally{e=u}})}return{map:o,html:n}}function Fc(i,t,e,n,o,s,r,a,c){let{labelWithSkin:d,titleForEmoji:u,unicodeWithSkin:l}=e,{html:p,map:b}=Uc(t);function T(g,I,H){return b(g,(V,ue)=>p`<button role="${I?"option":"menuitem"}" aria-selected="${I?ue===t.activeSearchItem:null}" aria-label="${d(V,t.currentSkinTone)}" title="${u(V)}" class="${"emoji"+(I&&ue===t.activeSearchItem?" active":"")+(V.unicode?"":" custom-emoji")}" id="${`${H}-${V.id}`}" style="${V.unicode?null:`--custom-emoji-background: url(${JSON.stringify(V.url)})`}">${V.unicode?l(V,t.currentSkinTone):""}</button>`,V=>`${H}-${V.id}`)}let x=p`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(t.searchMode&&t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId?`emo-${t.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded?"hide-focus":""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(t.skinTones,(g,I)=>p`<div id="skintone-${I}" class="emoji ${I===t.activeSkinTone?"active":""}" aria-selected="${I===t.activeSkinTone}" role="option" title="${t.i18n.skinTones[I]}" aria-label="${t.i18n.skinTones[I]}">${g}</div>`,g=>g)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(t.groups,g=>p`<button role="tab" class="nav-button" aria-controls="tab-${g.id}" aria-label="${t.i18n.categories[g.name]}" aria-selected="${!t.searchMode&&t.currentGroup.id===g.id}" title="${t.i18n.categories[g.name]}" data-group-id="${g.id}"><div class="nav-emoji emoji">${g.emoji}</div></button>`,g=>g.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl?-1:1)*t.currentGroupIndex*100}%)"></div></div><div class="message ${t.message?"":"gone"}" role="alert" aria-live="polite">${t.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded||t.message?"gone":""}" role="${t.searchMode?"region":"tabpanel"}" aria-label="${t.searchMode?t.i18n.searchResultsLabel:t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode?null:`tab-${t.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(t.currentEmojisWithCategories,(g,I)=>p`<div><div id="menu-label-${I}" class="category ${t.currentEmojisWithCategories.length===1&&t.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${t.searchMode?t.i18n.searchResultsLabel:g.category?g.category:t.currentEmojisWithCategories.length>1?t.i18n.categories.custom:t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${I!==0&&!t.searchMode&&t.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(g.emojis.length/t.numColumns)}`}" data-action="updateOnIntersection" role="${t.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${I}" id="${t.searchMode?"search-results":null}">${T(g.emojis,t.searchMode,"emo")}</div></div>`,g=>g.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message?"gone":""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${T(t.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,C=(g,I)=>{for(let H of i.querySelectorAll(`[${g}]`))I(H,H.getAttribute(g))};if(c){i.appendChild(x);for(let g of["click","focusout","input","keydown","keyup"])C(`data-on-${g}`,(I,H)=>{I.addEventListener(g,n[H])});C("data-ref",(g,I)=>{s[I]=g}),r.addEventListener("abort",()=>{i.removeChild(x)})}C("data-action",(g,I)=>{let H=a.get(I);H||a.set(I,H=new WeakSet),H.has(g)||(H.add(g),o[I](g))})}function Kc(i){let t=!1,e,n=new Map,o=new Set,s,r=()=>{if(t)return;let d=[...o];o.clear();try{for(let u of d)u()}finally{s=!1,o.size&&(s=!0,Hn(r))}},a=new Proxy({},{get(d,u){if(e){let l=n.get(u);l||(l=new Set,n.set(u,l)),l.add(e)}return d[u]},set(d,u,l){if(d[u]!==l){d[u]=l;let p=n.get(u);if(p){for(let b of p)o.add(b);s||(s=!0,Hn(r))}}return!0}}),c=d=>{let u=()=>{let l=e;e=u;try{return d()}finally{e=l}};return u()};return i.addEventListener("abort",()=>{t=!0}),{state:a,createEffect:c}}function qi(i,t,e){if(i.length!==t.length)return!1;for(let n=0;n<i.length;n++)if(!e(i[n],t[n]))return!1;return!0}function Wc(i,t,e){{let n=i.closest(".tabpanel"),o=fr.get(n);o||(o=new IntersectionObserver(e,{root:n,rootMargin:"50% 0px 50% 0px",threshold:0}),fr.set(n,o),t.addEventListener("abort",()=>{o.disconnect()})),o.observe(i)}}function Vc(i,t){let e={},n=new AbortController,o=n.signal,{state:s,createEffect:r}=Kc(o),a=new Map;jn(s,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),jn(s,t),jn(s,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:hc,isRtl:!1,currentGroupIndex:0,groups:Fi,databaseLoaded:!1,activeSearchItemId:void 0}),r(()=>{s.currentGroup!==s.groups[s.currentGroupIndex]&&(s.currentGroup=s.groups[s.currentGroupIndex])});let c=h=>{i.getElementById(h).focus()},d=h=>i.getElementById(`emo-${h.id}`),u=(h,v)=>{e.rootElement.dispatchEvent(new CustomEvent(h,{detail:v,bubbles:!0,composed:!0}))},l=(h,v)=>h.id===v.id,p=(h,v)=>{let{category:E,emojis:_}=h,{category:B,emojis:j}=v;return E!==B?!1:qi(_,j,l)},b=h=>{qi(s.currentEmojis,h,l)||(s.currentEmojis=h)},T=h=>{s.searchMode!==h&&(s.searchMode=h)},m=h=>{qi(s.currentEmojisWithCategories,h,p)||(s.currentEmojisWithCategories=h)},x=(h,v)=>v&&h.skins&&h.skins[v]||h.unicode,I={labelWithSkin:(h,v)=>Pc([h.name||x(h,v),h.annotation,...h.shortcodes||Yi].filter(Boolean)).join(", "),titleForEmoji:h=>h.annotation||(h.shortcodes||Yi).join(", "),unicodeWithSkin:x},H={onClickSkinToneButton:fe,onEmojiClick:$e,onNavClick:Y,onNavKeydown:Q,onSearchKeydown:z,onSkinToneOptionsClick:ie,onSkinToneOptionsFocusOut:Fe,onSkinToneOptionsKeydown:we,onSkinToneOptionsKeyup:dt,onSearchInput:N},V={calculateEmojiGridStyle:k,updateOnIntersection:y},ue=!0;r(()=>{Fc(i,s,I,H,V,e,o,a,ue),ue=!1}),s.emojiVersion||Wi().then(h=>{h||(s.message=s.i18n.emojiUnsupportedMessage)}),r(()=>{async function h(){let v=!1,E=setTimeout(()=>{v=!0,s.message=s.i18n.loadingMessage},cc);try{await s.database.ready(),s.databaseLoaded=!0}catch(_){console.error(_),s.message=s.i18n.networkErrorMessage}finally{clearTimeout(E),v&&(v=!1,s.message="")}}s.database&&h()}),r(()=>{s.pickerStyle=`
      --num-groups: ${s.groups.length}; 
      --indicator-opacity: ${s.searchMode?0:1}; 
      --num-skintones: ${ar};`}),r(()=>{s.customEmoji&&s.database&&w()}),r(()=>{s.customEmoji&&s.customEmoji.length?s.groups!==Xi&&(s.groups=Xi):s.groups!==Fi&&(s.currentGroupIndex&&s.currentGroupIndex--,s.groups=Fi)}),r(()=>{async function h(){s.databaseLoaded&&(s.currentSkinTone=await s.database.getPreferredSkinTone())}h()}),r(()=>{s.skinTones=Array(ar).fill().map((h,v)=>kc(s.skinToneEmoji,v))}),r(()=>{s.skinToneButtonText=s.skinTones[s.currentSkinTone]}),r(()=>{s.skinToneButtonLabel=s.i18n.skinToneLabel.replace("{skinTone}",s.i18n.skinTones[s.currentSkinTone])}),r(()=>{async function h(){let{database:v}=s,E=(await Promise.all(uc.map(_=>v.getEmojiByUnicodeOrName(_)))).filter(Boolean);s.defaultFavoriteEmojis=E}s.databaseLoaded&&h()});function w(){let{customEmoji:h,database:v}=s,E=h||Yi;v.customEmoji!==E&&(v.customEmoji=E)}r(()=>{async function h(){w();let{database:v,defaultFavoriteEmojis:E,numColumns:_}=s,B=await v.getTopFavoriteEmoji(_),j=await W(vr([...B,...E],L=>L.unicode||L.name).slice(0,_));s.currentFavorites=j}s.databaseLoaded&&s.defaultFavoriteEmojis&&h()});function k(h){Ec(h,o,()=>{{let v=getComputedStyle(e.rootElement),E=parseInt(v.getPropertyValue("--num-columns"),10),_=v.getPropertyValue("direction")==="rtl";s.numColumns=E,s.isRtl=_}})}function y(h){Wc(h,o,v=>{for(let{target:E,isIntersecting:_}of v)E.classList.toggle("onscreen",_)})}r(()=>{async function h(){let{searchText:v,currentGroup:E,databaseLoaded:_,customEmoji:B}=s;if(!_)s.currentEmojis=[],s.searchMode=!1;else if(v.length>=ac){let j=await Z(v);s.searchText===v&&(b(j),T(!0))}else{let{id:j}=E;if(j!==-1||B&&B.length){let L=await X(j);s.currentGroup.id===j&&(b(L),T(!1))}}}h()});let P=()=>{zn(()=>Mc(e.tabpanelElement))};r(()=>{let{currentEmojis:h,emojiVersion:v}=s,E=h.filter(_=>_.unicode).filter(_=>lr(_)&&!Ji.has(_.unicode));if(!v&&E.length)b(h),zn(()=>M(E));else{let _=v?h:h.filter(S);b(_),P()}});function M(h){Cc(h,e.baselineEmoji,d)?P():s.currentEmojis=[...s.currentEmojis]}function S(h){return!h.unicode||!lr(h)||Ji.get(h.unicode)}async function O(h){let v=s.emojiVersion||await Wi();return h.filter(({version:E})=>!E||E<=v)}async function W(h){return $c(h,s.emojiVersion||await Wi())}async function X(h){let v=h===-1?s.customEmoji:await s.database.getEmojiByGroup(h);return W(await O(v))}async function Z(h){return W(await O(await s.database.getEmojiBySearchQuery(h)))}r(()=>{}),r(()=>{function h(){let{searchMode:E,currentEmojis:_}=s;if(E)return[{category:"",emojis:_}];let B=new Map;for(let j of _){let L=j.category||"",J=B.get(L);J||(J=[],B.set(L,J)),J.push(j)}return[...B.entries()].map(([j,L])=>({category:j,emojis:L})).sort((j,L)=>s.customCategorySorting(j.category,L.category))}let v=h();m(v)}),r(()=>{s.activeSearchItemId=s.activeSearchItem!==-1&&s.currentEmojis[s.activeSearchItem].id}),r(()=>{let{rawSearchText:h}=s;mr(()=>{s.searchText=(h||"").trim(),s.activeSearchItem=-1})});function z(h){if(!s.searchMode||!s.currentEmojis.length)return;let v=E=>{Oe(h),s.activeSearchItem=Vi(E,s.activeSearchItem,s.currentEmojis)};switch(h.key){case"ArrowDown":return v(!1);case"ArrowUp":return v(!0);case"Enter":if(s.activeSearchItem===-1)s.activeSearchItem=0;else return Oe(h),Ne(s.currentEmojis[s.activeSearchItem].id)}}function Y(h){let{target:v}=h,E=v.closest(".nav-button");if(!E)return;let _=parseInt(E.dataset.groupId,10);e.searchElement.value="",s.rawSearchText="",s.searchText="",s.activeSearchItem=-1,s.currentGroupIndex=s.groups.findIndex(B=>B.id===_)}function Q(h){let{target:v,key:E}=h,_=B=>{B&&(Oe(h),B.focus())};switch(E){case"ArrowLeft":return _(v.previousElementSibling);case"ArrowRight":return _(v.nextElementSibling);case"Home":return _(v.parentElement.firstElementChild);case"End":return _(v.parentElement.lastElementChild)}}async function Se(h){let v=await s.database.getEmojiByUnicodeOrName(h),E=[...s.currentEmojis,...s.currentFavorites].find(B=>B.id===h),_=E.unicode&&x(E,s.currentSkinTone);return await s.database.incrementFavoriteEmojiCount(h),{emoji:v,skinTone:s.currentSkinTone,..._&&{unicode:_},...E.name&&{name:E.name}}}async function Ne(h){let v=Se(h);u("emoji-click-sync",v),u("emoji-click",await v)}function $e(h){let{target:v}=h;if(!v.classList.contains("emoji"))return;Oe(h);let E=v.id.substring(4);Ne(E)}function le(h){s.currentSkinTone=h,s.skinTonePickerExpanded=!1,c("skintone-button"),u("skin-tone-change",{skinTone:h}),s.database.setPreferredSkinTone(h)}function ie(h){let{target:{id:v}}=h,E=v&&v.match(/^skintone-(\d)/);if(!E)return;Oe(h);let _=parseInt(E[1],10);le(_)}function fe(h){s.skinTonePickerExpanded=!s.skinTonePickerExpanded,s.activeSkinTone=s.currentSkinTone,s.skinTonePickerExpanded&&(Oe(h),zn(()=>c("skintone-list")))}r(()=>{s.skinTonePickerExpanded?e.skinToneDropdown.addEventListener("transitionend",()=>{s.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):s.skinTonePickerExpandedAfterAnimation=!1});function we(h){if(!s.skinTonePickerExpanded)return;let v=async E=>{Oe(h),s.activeSkinTone=E};switch(h.key){case"ArrowUp":return v(Vi(!0,s.activeSkinTone,s.skinTones));case"ArrowDown":return v(Vi(!1,s.activeSkinTone,s.skinTones));case"Home":return v(0);case"End":return v(s.skinTones.length-1);case"Enter":return Oe(h),le(s.activeSkinTone);case"Escape":return Oe(h),s.skinTonePickerExpanded=!1,c("skintone-button")}}function dt(h){if(s.skinTonePickerExpanded)switch(h.key){case" ":return Oe(h),le(s.activeSkinTone)}}async function Fe(h){let{relatedTarget:v}=h;(!v||v.id!=="skintone-list")&&(s.skinTonePickerExpanded=!1)}function N(h){s.rawSearchText=h.target.value}return{$set(h){jn(s,h)},$destroy(){n.abort()}}}function gr(i){i instanceof lt||Object.setPrototypeOf(i,customElements.get(i.tagName.toLowerCase()).prototype)}var Xi,Fi,ac,ar,mr,lc,cc,dc,hc,uc,br,pc,cr,fc,Ki,Wi,Ji,bc,vc,yc,xc,wc,zn,Tc,_c,Gi,at,Sc,Lc,Dc,Rc,Hn,fr,Yi,jn,Gc,qc,Yc,Xc,yr,Jc,lt,xr,wr=Wn(()=>{Ui();Xi=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([i,t,e])=>({id:i,emoji:t,name:e})),Fi=Xi.slice(1),ac=2,ar=6,mr=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;lc={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},cc=1e3,dc="🖐️",hc=8,uc=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],br='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',pc=(i,t)=>i<t?-1:i>t?1:0,cr=(i,t)=>{let e=document.createElement("canvas");e.width=e.height=1;let n=e.getContext("2d",{willReadFrequently:!0});return n.textBaseline="top",n.font=`100px ${br}`,n.fillStyle=t,n.scale(.01,.01),n.fillText(i,0,0),n.getImageData(0,0,1,1).data},fc=(i,t)=>{let e=[...i].join(","),n=[...t].join(",");return e===n&&!e.startsWith("0,0,0,")};Wi=()=>(Ki||(Ki=new Promise(i=>mr(()=>i(mc())))),Ki),Ji=new Map,bc="️",vc="\uD83C",yc="‍",xc=127995,wc=57339;zn=requestAnimationFrame,Tc=typeof ResizeObserver=="function";_c="😀";Sc=new WeakMap,Lc=new WeakMap,Dc=Symbol("un-keyed"),Rc="replaceChildren"in Element.prototype;Hn=typeof queueMicrotask=="function"?queueMicrotask:i=>Promise.resolve().then(i);fr=new WeakMap;Yi=[],{assign:jn}=Object;Gc="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",qc="en",Yc={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Xc=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}',yr=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Jc=`:host{--emoji-font-family:${br}}`,lt=class extends HTMLElement{constructor(t){super(),this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=Xc+Jc,this.shadowRoot.appendChild(e),this._ctx={locale:qc,dataSource:Gc,skinToneEmoji:dc,customCategorySorting:pc,customEmoji:null,i18n:Yc,emojiVersion:null,...t};for(let n of yr)n!=="database"&&Object.prototype.hasOwnProperty.call(this,n)&&(this._ctx[n]=this[n],delete this[n]);this._dbFlush()}connectedCallback(){gr(this),this._cmp||(this._cmp=Vc(this.shadowRoot,this._ctx))}disconnectedCallback(){gr(this),Hn(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;let{database:t}=this._ctx;t.close().catch(e=>console.error(e))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(t,e,n){this._set(t.replace(/-([a-z])/g,(o,s)=>s.toUpperCase()),t==="emoji-version"?parseFloat(n):n)}_set(t,e){this._ctx[t]=e,this._cmp&&this._cmp.$set({[t]:e}),["locale","dataSource"].includes(t)&&this._dbFlush()}_dbCreate(){let{locale:t,dataSource:e,database:n}=this._ctx;(!n||n.locale!==t||n.dataSource!==e)&&this._set("database",new Tt({locale:t,dataSource:e}))}_dbFlush(){Hn(()=>this._dbCreate())}},xr={};for(let i of yr)xr[i]={get(){return i==="database"&&this._dbCreate(),this._ctx[i]},set(t){if(i==="database")throw new Error("database is read-only");this._set(i,t)}};Object.defineProperties(lt.prototype,xr);customElements.get("emoji-picker")||customElements.define("emoji-picker",lt)});var kr={};na(kr,{Database:()=>Tt,Picker:()=>lt});var $r=Wn(()=>{wr();Ui()});function ps(i){return{type:"auth",access_token:i}}function fs(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function gs(i){let t={type:"subscribe_events"};return i&&(t.event_type=i),t}function Vn(i){return{type:"unsubscribe_events",subscription:i}}function ms(){return{type:"ping"}}function bs(i,t){return{type:"result",success:!1,error:{code:i,message:t}}}function ys(i){let t={},e=i.split("&");for(let n=0;n<e.length;n++){let o=e[n].split("="),s=decodeURIComponent(o[0]),r=o.length>1?decodeURIComponent(o[1]):void 0;t[s]=r}return t}var xs=(i,t,e,n)=>{let[o,s,r]=i.split(".",3);return Number(o)>t||Number(o)===t&&(n===void 0?Number(s)>=e:Number(s)>e)||n!==void 0&&Number(o)===t&&Number(s)===e&&Number(r)>=n};var sn=!1,sa="auth_required",oa="auth_invalid",ra="auth_ok";function ks(i){if(!i.auth)throw 4;let t=i.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;sn&&console.log("[Auth phase] Initializing",n);function o(s,r,a){sn&&console.log("[Auth Phase] New connection",n);let c=new WebSocket(n),d=!1,u=()=>{if(c.removeEventListener("close",u),d){a(2);return}if(s===0){a(1);return}let b=s===-1?-1:s-1;setTimeout(()=>o(b,r,a),1e3)},l=async b=>{try{t.expired&&await(e||t.refreshAccessToken()),c.send(JSON.stringify(ps(t.accessToken)))}catch(T){d=T===2,c.close()}},p=async b=>{let T=JSON.parse(b.data);switch(sn&&console.log("[Auth phase] Received",T),T.type){case oa:d=!0,c.close();break;case ra:c.removeEventListener("open",l),c.removeEventListener("message",p),c.removeEventListener("close",u),c.removeEventListener("error",u),c.haVersion=T.ha_version,xs(c.haVersion,2022,9)&&c.send(JSON.stringify(fs())),r(c);break;default:sn&&T.type!==sa&&console.warn("[Auth phase] Unhandled message",T)}};c.addEventListener("open",l),c.addEventListener("message",p),c.addEventListener("close",u),c.addEventListener("error",u)}return new Promise((s,r)=>o(i.setupRetry,s,r))}var At=!1,on=class{constructor(t,e){this._handleMessage=n=>{let o=JSON.parse(n.data);Array.isArray(o)||(o=[o]),o.forEach(s=>{At&&console.log("Received",s);let r=this.commands.get(s.id);switch(s.type){case"event":r?r.callback(s.event):(console.warn(`Received event for unknown subscription ${s.id}. Unsubscribing.`),this.sendMessagePromise(Vn(s.id)).catch(a=>{At&&console.warn(` Error unsubsribing from unknown subscription ${s.id}`,a)}));break;case"result":r&&(s.success?(r.resolve(s.result),"subscribe"in r||this.commands.delete(s.id)):(r.reject(s.error),this.commands.delete(s.id)));break;case"pong":r?(r.resolve(),this.commands.delete(s.id)):console.warn(`Received unknown pong response ${s.id}`);break;default:At&&console.warn("Unhandled message",s)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(r=>{"subscribe"in r||r.reject(bs(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let o=Object.assign(Object.assign({},this.options),{setupRetry:0}),s=r=>{setTimeout(async()=>{if(!this.closeRequested){At&&console.log("Trying to reconnect");try{let a=await o.createSocket(o);this._setSocket(a)}catch(a){if(this._queuedMessages){let c=this._queuedMessages;this._queuedMessages=void 0;for(let d of c)d.reject&&d.reject(3)}a===2?this.fireEvent("reconnect-error",a):s(r+1)}}},Math.min(r,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),s(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(o=>{"subscribe"in o&&o.subscribe&&o.subscribe().then(s=>{o.unsubscribe=s,o.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let o of n)o.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let o=n.indexOf(e);o!==-1&&n.splice(o,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,gs(e))}ping(){return this.sendMessagePromise(ms())}sendMessage(t,e){if(!this.connected)throw 3;if(At&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(s){n(s)}}});return}let o=this._genCmdId();this.commands.set(o,{resolve:e,reject:n}),this.sendMessage(t,o)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((s,r)=>{this._queuedMessages.push({resolve:s,reject:r})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let o;return await new Promise((s,r)=>{let a=this._genCmdId();o={resolve:s,reject:r,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Vn(a)),this.commands.delete(a)}},this.commands.set(a,o);try{this.sendMessage(e,a)}catch{}}),()=>o.unsubscribe()}_genCmdId(){return++this.commandId}};var aa=()=>`${location.protocol}//${location.host}/`,la=i=>i*1e3+Date.now();function ca(){let{protocol:i,host:t,pathname:e,search:n}=location;return`${i}//${t}${e}${n}`}function da(i,t,e,n){let o=`${i}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(o+=`&client_id=${encodeURIComponent(t)}`),n&&(o+=`&state=${encodeURIComponent(n)}`),o}function ha(i,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=da(i,t,e,n)}async function Es(i,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let a=document.createElement("a");if(a.href=i,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let o=new FormData;t!==null&&o.append("client_id",t),Object.keys(e).forEach(a=>{o.append(a,e[a])});let s=await fetch(`${i}/auth/token`,{method:"POST",credentials:"same-origin",body:o});if(!s.ok)throw s.status===400||s.status===403?2:new Error("Unable to fetch tokens");let r=await s.json();return r.hassUrl=i,r.clientId=t,r.expires=la(r.expires_in),r}function Ts(i,t,e){return Es(i,t,{code:e,grant_type:"authorization_code"})}function ua(i){return btoa(JSON.stringify(i))}function pa(i){return JSON.parse(atob(i))}var Gn=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await Es(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function _s(i={}){let t,e=i.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=i.clientId!==void 0?i.clientId:aa(),o=i.limitHassInstance===!0;if(i.authCode&&e&&(t=await Ts(e,n,i.authCode),i.saveTokens&&i.saveTokens(t)),!t){let s=ys(location.search.substr(1));if("auth_callback"in s){let r=pa(s.state);if(o&&(r.hassUrl!==e||r.clientId!==n))throw 6;t=await Ts(r.hassUrl,r.clientId,s.code),i.saveTokens&&i.saveTokens(t)}}if(!t&&i.loadTokens&&(t=await i.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new Gn(t,i.saveTokens);if(e===void 0)throw 4;return ha(e,n,i.redirectUrl||ca(),ua({hassUrl:e,clientId:n})),new Promise(()=>{})}async function Cs(i){let t=Object.assign({setupRetry:0,createSocket:ks},i),e=await t.createSocket(t);return new on(e,t)}function F(i){let t=Math.round(i),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Pe(i){let t=Math.floor(Math.round(i)/60)%24;return`${F(i)} ${t<12?"AM":"PM"}`}function Ps(i){let t=Math.floor(i/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Lt(i){let t=Math.max(0,Math.round(i)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function qn(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var fa=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),ga=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),ma=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function rn(i){return new Date(`${i}T12:00:00Z`)}function Me(i){let t=rn(i);return`${fa.format(t)}, ${ma.format(t)}`}function ve(i){return ga.format(rn(i))}function De(i,t){return Math.round((rn(t).getTime()-rn(i).getTime())/864e5)}function St(i,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return St("UTC",t)}let n=o=>e.find(s=>s.type===o)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function an(i,t,e){let n=Math.floor((t.getTime()-i.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let o=St(e,i),s=St(e,t).date;return o.date===s?`at ${Pe(o.minutes)}`:`on ${ve(o.date)} at ${Pe(o.minutes)}`}var se=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}};function Ss(i){switch(i.code){case"connection_lost":case"timeout":return"Can’t reach Home Assistant";case"not_running":return"MyDashLight isn’t running";default:return"Couldn’t get the latest plan"}}var qe="mydashlight",ba=7,Yn=3e4,Ms=3e4;function Xn(i){if(i instanceof se)return i;if(i&&typeof i=="object"){let t=i;if(typeof t.message=="string")return new se(String(t.code??"error"),t.message)}return typeof i=="number"?new se("connection_lost","Lost the connection to Home Assistant."):new se("error",String(i))}function As(i,t){return new Promise((e,n)=>{let o=setTimeout(()=>n(new se("timeout","Home Assistant didn’t answer.")),t);i.then(s=>{clearTimeout(o),e(s)},s=>{clearTimeout(o),n(s)})})}var Dt=class{constructor(t,e,n,o){this.live=!1;this.unsub=null;this.opening=!1;this.gen=0;this.closed=!1;this.onReady=()=>this.open();this.onDisconnected=()=>this.dropped();this.conn=t,this.type=e,this.onMessage=n,this.onFailed=o,t.addEventListener?.("ready",this.onReady),t.addEventListener?.("disconnected",this.onDisconnected)}get isOpen(){return this.unsub!==null||this.opening}open(){if(this.closed||this.isOpen||this.conn.connected===!1)return;let t=++this.gen;this.opening=!0,this.conn.subscribeMessage(e=>{t===this.gen&&(this.live=!0,this.onMessage(e))},{type:this.type},{resubscribe:!1}).then(e=>{if(t!==this.gen){e().catch(()=>{});return}this.opening=!1,this.unsub=e},e=>{t===this.gen&&(this.opening=!1,this.live=!1,this.onFailed(e))})}dropped(){this.gen++,this.opening=!1,this.unsub=null,this.live=!1}close(){this.closed=!0,this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsub;this.dropped(),t&&t().catch(()=>{})}},ln=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.rides=null;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new se("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.rides?.live??!1}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.rides=new Dt(this.conn,`${qe}/rides/subscribe`,t=>{t.plan?this.emit(t.plan):this.fail(new se("not_running","MyDashLight isn’t running right now."))},()=>{}),this.rides.open(),this.timer=setInterval(()=>{this.live||(this.refresh(),this.rides?.open())},Yn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected),this.rides?.close(),this.rides=null}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await As(this.conn.sendMessagePromise({type:"call_service",domain:qe,service:"get_plan",service_data:{days:ba},return_response:!0}),Ms);this.emit(t.response)}catch(t){this.fail(Xn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:qe,service:t,service_data:e})}catch(n){throw Xn(n)}this.live||await this.refresh()}setRide(t,e,n,o,s){return this.call("set_ride",s===void 0?{event:t,side:e,driver:n,scope:o}:{event:t,side:e,driver:n,scope:o,stay:s})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:qn(e),scope:n})}setLeaveBy(t,e,n){return this.call("set_leave_by",e==null?{event:t,scope:n}:{event:t,time:qn(e),scope:n})}setTakeAlong(t,e,n,o="drop"){return this.call("set_take_along",{event:t,kids:e,scope:n,side:o})}setTakes(t,e,n){return this.call("set_takes",e==null?{event:t,scope:n}:{event:t,minutes:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}setPeople(t,e,n){return this.call("set_people",{event:t,people:e,scope:n})}watchChores(t){let e=!1,n=!1,o=async()=>{try{let a=await As(this.conn.sendMessagePromise({type:"call_service",domain:qe,service:"get_chores",service_data:{},return_response:!0}),Ms);if(e)return;n=!0,t(a.response??null)}catch{!e&&!n&&t(null)}},s=new Dt(this.conn,`${qe}/chores/subscribe`,a=>{e||(n=!0,t(a.chores))},()=>void o());s.open();let r=setInterval(()=>{s.live||s.open()},Yn);return()=>{e=!0,clearInterval(r),s.close()}}watchLunch(t){let e=!1,n=!1,o=new Dt(this.conn,`${qe}/lunch/subscribe`,r=>{e||(n=!0,t(r.lunch))},()=>{!e&&!n&&t(null)});o.open();let s=setInterval(()=>{o.live||o.open()},Yn);return()=>{e=!0,clearInterval(s),o.close()}}async setLunch(t,e,n){await this.choreCall("set_lunch",{kid:t,dates:e,lunch:n??"default"})}async setLunchMenu(t,e,n,o){await this.choreCall("set_lunch_menu",{kids:t,date:e,menu:n,details:o})}async setChoreDone(t,e,n){await this.choreCall("set_chore_done",{chore:t,done:e,...e&&n?{by:n}:{}})}async saveChoreTemplate(t){await this.choreCall("save_chore_template",{...t})}async removeChoreTemplate(t){await this.choreCall("remove_chore_template",{template:t})}async choreCall(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:qe,service:t,service_data:e})}catch(n){throw Xn(n)}}};var cn=globalThis,dn=cn.ShadowRoot&&(cn.ShadyCSS===void 0||cn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Jn=Symbol(),Ls=new WeakMap,Rt=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Jn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(dn&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ls.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ls.set(e,t))}return t}toString(){return this.cssText}},Ds=i=>new Rt(typeof i=="string"?i:i+"",void 0,Jn),Ye=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[s+1],i[0]);return new Rt(e,i,Jn)},Rs=(i,t)=>{if(dn)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),o=cn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=e.cssText,i.appendChild(n)}},Zn=dn?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Ds(e)})(i):i;var{is:va,defineProperty:ya,getOwnPropertyDescriptor:xa,getOwnPropertyNames:wa,getOwnPropertySymbols:ka,getPrototypeOf:$a}=Object,hn=globalThis,Is=hn.trustedTypes,Ta=Is?Is.emptyScript:"",Ea=hn.reactiveElementPolyfillSupport,It=(i,t)=>i,Qn={toAttribute(i,t){switch(t){case Boolean:i=i?Ta:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Os=(i,t)=>!va(i,t),Bs={attribute:!0,type:String,converter:Qn,reflect:!1,useDefault:!1,hasChanged:Os};Symbol.metadata??=Symbol("metadata"),hn.litPropertyMetadata??=new WeakMap;var je=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Bs){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),o=this.getPropertyDescriptor(t,n,e);o!==void 0&&ya(this.prototype,t,o)}}static getPropertyDescriptor(t,e,n){let{get:o,set:s}=xa(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let a=o?.call(this);s?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Bs}static _$Ei(){if(this.hasOwnProperty(It("elementProperties")))return;let t=$a(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(It("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(It("properties"))){let e=this.properties,n=[...wa(e),...ka(e)];for(let o of n)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,o]of e)this.elementProperties.set(n,o)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let o=this._$Eu(e,n);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)e.unshift(Zn(o))}else t!==void 0&&e.push(Zn(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Rs(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){let s=(n.converter?.toAttribute!==void 0?n.converter:Qn).toAttribute(e,n.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){let n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let s=n.getPropertyOptions(o),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Qn;this._$Em=o;let a=r.fromAttribute(e,s.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,n,o=!1,s){if(t!==void 0){let r=this.constructor;if(o===!1&&(s=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Os)(s,e)||n.useDefault&&n.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:o,wrapped:s},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),s!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,s]of n){let{wrapped:r}=s,a=this[o];r!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,s,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};je.elementStyles=[],je.shadowRootOptions={mode:"open"},je[It("elementProperties")]=new Map,je[It("finalized")]=new Map,Ea?.({ReactiveElement:je}),(hn.reactiveElementVersions??=[]).push("2.1.2");var ti=globalThis,Ns=i=>i,un=ti.trustedTypes,js=un?un.createPolicy("lit-html",{createHTML:i=>i}):void 0,ni="$lit$",ze=`lit$${Math.random().toFixed(9).slice(2)}$`,ii="?"+ze,_a=`<${ii}>`,Ze=document,Ot=()=>Ze.createComment(""),Nt=i=>i===null||typeof i!="object"&&typeof i!="function",si=Array.isArray,Ws=i=>si(i)||typeof i?.[Symbol.iterator]=="function",ei=`[ 	
\f\r]`,Bt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,zs=/-->/g,Hs=/>/g,Xe=RegExp(`>|${ei}(?:([^\\s"'>=/]+)(${ei}*=${ei}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Us=/'/g,Fs=/"/g,Vs=/^(?:script|style|textarea|title)$/i,oi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),f=oi(1),oe=oi(2),hh=oi(3),He=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ks=new WeakMap,Je=Ze.createTreeWalker(Ze,129);function Gs(i,t){if(!si(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return js!==void 0?js.createHTML(t):t}var qs=(i,t)=>{let e=i.length-1,n=[],o,s=t===2?"<svg>":t===3?"<math>":"",r=Bt;for(let a=0;a<e;a++){let c=i[a],d,u,l=-1,p=0;for(;p<c.length&&(r.lastIndex=p,u=r.exec(c),u!==null);)p=r.lastIndex,r===Bt?u[1]==="!--"?r=zs:u[1]!==void 0?r=Hs:u[2]!==void 0?(Vs.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=Xe):u[3]!==void 0&&(r=Xe):r===Xe?u[0]===">"?(r=o??Bt,l=-1):u[1]===void 0?l=-2:(l=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?Xe:u[3]==='"'?Fs:Us):r===Fs||r===Us?r=Xe:r===zs||r===Hs?r=Bt:(r=Xe,o=void 0);let b=r===Xe&&i[a+1].startsWith("/>")?" ":"";s+=r===Bt?c+_a:l>=0?(n.push(d),c.slice(0,l)+ni+c.slice(l)+ze+b):c+ze+(l===-2?a:b)}return[Gs(i,s+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},jt=class i{constructor({strings:t,_$litType$:e},n){let o;this.parts=[];let s=0,r=0,a=t.length-1,c=this.parts,[d,u]=qs(t,e);if(this.el=i.createElement(d,n),Je.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(o=Je.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let l of o.getAttributeNames())if(l.endsWith(ni)){let p=u[r++],b=o.getAttribute(l).split(ze),T=/([.?@])?(.*)/.exec(p);c.push({type:1,index:s,name:T[2],strings:b,ctor:T[1]==="."?fn:T[1]==="?"?gn:T[1]==="@"?mn:et}),o.removeAttribute(l)}else l.startsWith(ze)&&(c.push({type:6,index:s}),o.removeAttribute(l));if(Vs.test(o.tagName)){let l=o.textContent.split(ze),p=l.length-1;if(p>0){o.textContent=un?un.emptyScript:"";for(let b=0;b<p;b++)o.append(l[b],Ot()),Je.nextNode(),c.push({type:2,index:++s});o.append(l[p],Ot())}}}else if(o.nodeType===8)if(o.data===ii)c.push({type:2,index:s});else{let l=-1;for(;(l=o.data.indexOf(ze,l+1))!==-1;)c.push({type:7,index:s}),l+=ze.length-1}s++}}static createElement(t,e){let n=Ze.createElement("template");return n.innerHTML=t,n}};function Qe(i,t,e=i,n){if(t===He)return t;let o=n!==void 0?e._$Co?.[n]:e._$Cl,s=Nt(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(i),o._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=o:e._$Cl=o),o!==void 0&&(t=Qe(i,o._$AS(i,t.values),o,n)),t}var pn=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,o=(t?.creationScope??Ze).importNode(e,!0);Je.currentNode=o;let s=Je.nextNode(),r=0,a=0,c=n[0];for(;c!==void 0;){if(r===c.index){let d;c.type===2?d=new pt(s,s.nextSibling,this,t):c.type===1?d=new c.ctor(s,c.name,c.strings,this,t):c.type===6&&(d=new bn(s,this,t)),this._$AV.push(d),c=n[++a]}r!==c?.index&&(s=Je.nextNode(),r++)}return Je.currentNode=Ze,o}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},pt=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,o){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Qe(this,t,e),Nt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==He&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ws(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&Nt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ze.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=jt.createElement(Gs(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===o)this._$AH.p(e);else{let s=new pn(o,this),r=s.u(this.options);s.p(e),this.T(r),this._$AH=s}}_$AC(t){let e=Ks.get(t.strings);return e===void 0&&Ks.set(t.strings,e=new jt(t)),e}k(t){si(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,o=0;for(let s of t)o===e.length?e.push(n=new i(this.O(Ot()),this.O(Ot()),this,this.options)):n=e[o],n._$AI(s),o++;o<e.length&&(this._$AR(n&&n._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Ns(t).nextSibling;Ns(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},et=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,o,s){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=$}_$AI(t,e=this,n,o){let s=this.strings,r=!1;if(s===void 0)t=Qe(this,t,e,0),r=!Nt(t)||t!==this._$AH&&t!==He,r&&(this._$AH=t);else{let a=t,c,d;for(t=s[0],c=0;c<s.length-1;c++)d=Qe(this,a[n+c],e,c),d===He&&(d=this._$AH[c]),r||=!Nt(d)||d!==this._$AH[c],d===$?t=$:t!==$&&(t+=(d??"")+s[c+1]),this._$AH[c]=d}r&&!o&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},fn=class extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},gn=class extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},mn=class extends et{constructor(t,e,n,o,s){super(t,e,n,o,s),this.type=5}_$AI(t,e=this){if((t=Qe(this,t,e,0)??$)===He)return;let n=this._$AH,o=t===$&&n!==$||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==$&&(n===$||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},bn=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Qe(this,t)}},Ys={M:ni,P:ze,A:ii,C:1,L:qs,R:pn,D:Ws,V:Qe,I:pt,H:et,N:gn,U:mn,B:fn,F:bn},Ca=ti.litHtmlPolyfillSupport;Ca?.(jt,pt),(ti.litHtmlVersions??=[]).push("3.3.3");var Xs=(i,t,e)=>{let n=e?.renderBefore??t,o=n._$litPart$;if(o===void 0){let s=e?.renderBefore??null;n._$litPart$=o=new pt(t.insertBefore(Ot(),s),s,void 0,e??{})}return o._$AI(i),o};var ri=globalThis,Ee=class extends je{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Xs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return He}};Ee._$litElement$=!0,Ee.finalized=!0,ri.litElementHydrateSupport?.({LitElement:Ee});var Pa=ri.litElementPolyfillSupport;Pa?.({LitElement:Ee});(ri.litElementVersions??=[]).push("4.2.2");var Js={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Zs=i=>(...t)=>({_$litDirective$:i,values:t}),vn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Ma}=Ys,Qs=i=>i;var eo=()=>document.createComment(""),ft=(i,t,e)=>{let n=i._$AA.parentNode,o=t===void 0?i._$AB:t._$AA;if(e===void 0){let s=n.insertBefore(eo(),o),r=n.insertBefore(eo(),o);e=new Ma(s,r,i,i.options)}else{let s=e._$AB.nextSibling,r=e._$AM,a=r!==i;if(a){let c;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(c=i._$AU)!==r._$AU&&e._$AP(c)}if(s!==o||a){let c=e._$AA;for(;c!==s;){let d=Qs(c).nextSibling;Qs(n).insertBefore(c,o),c=d}}}return e},Ke=(i,t,e=i)=>(i._$AI(t,e),i),Aa={},to=(i,t=Aa)=>i._$AH=t,no=i=>i._$AH,yn=i=>{i._$AR(),i._$AA.remove()};var io=(i,t,e)=>{let n=new Map;for(let o=t;o<=e;o++)n.set(i[o],o);return n},Re=Zs(class extends vn{constructor(i){if(super(i),i.type!==Js.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let o=[],s=[],r=0;for(let a of i)o[r]=n?n(a,r):r,s[r]=e(a,r),r++;return{values:s,keys:o}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,n]){let o=no(i),{values:s,keys:r}=this.dt(t,e,n);if(!Array.isArray(o))return this.ut=r,s;let a=this.ut??=[],c=[],d,u,l=0,p=o.length-1,b=0,T=s.length-1;for(;l<=p&&b<=T;)if(o[l]===null)l++;else if(o[p]===null)p--;else if(a[l]===r[b])c[b]=Ke(o[l],s[b]),l++,b++;else if(a[p]===r[T])c[T]=Ke(o[p],s[T]),p--,T--;else if(a[l]===r[T])c[T]=Ke(o[l],s[T]),ft(i,c[T+1],o[l]),l++,T--;else if(a[p]===r[b])c[b]=Ke(o[p],s[b]),ft(i,o[l],o[p]),p--,b++;else if(d===void 0&&(d=io(r,b,T),u=io(a,l,p)),d.has(a[l]))if(d.has(a[p])){let m=u.get(r[b]),x=m!==void 0?o[m]:null;if(x===null){let C=ft(i,o[l]);Ke(C,s[b]),c[b]=C}else c[b]=Ke(x,s[b]),ft(i,o[l],x),o[m]=null;b++}else yn(o[p]),p--;else yn(o[l]),l++;for(;b<=T;){let m=ft(i,c[T+1]);Ke(m,s[b]),c[b++]=m}for(;l<=p;){let m=o[l++];m!==null&&yn(m)}return this.ut=r,to(i,c),He}});var xn=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function de(i){return xn[(i%xn.length+xn.length)%xn.length]}var wn="#23272E",ai="35,39,46";var li=3,Ft=36,ci=12,kn=8,so=30,Ie=16,zt=100,mt=60,Sa=120,oo=44,ro=20,La=45,Da=30,ao=20,hi=10,Tn=30,ui=10,Ra=150,Ia=150,_n=1;function mo(i,t){return i.dayHeads[Math.max(0,Math.floor(t/1440))]?.h??Ft}function Ba(i,t,e){return 10+10.2*i.length+(t?30+8*t.length:0)+8+12+6.8*e.length+12+4}var Oa=26,bo=4;function fi(i,t){let e=Math.max(Ra,Ia/_n);return Math.ceil(mt+Math.max(0,i-1)*hi+Tn+Math.max(0,t-1)*ui+e*(i+_n*t))}function _e(i){return i.people?i.people.kids.map(t=>t.id):i.days.length?Object.keys(i.days[0].kids):[]}function xe(i){return i.people?i.people.drivers.map(t=>t.id):i.days.length?Object.keys(i.days[0].drivers):[]}function ke(i){return new Map(_e(i).map((t,e)=>[t,de(e)]))}function me(i,t){let e=i.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.kids[t])return n.kids[t].name;return t}function pe(i,t){let e=i.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.drivers[t])return n.drivers[t].name;return t}function gi(i,t){return t==="none"?"Not needed":xe(i).includes(t)?pe(i,t):t}function Na(i){return i.leave_by!=null&&i.leave_by>i.start&&i.leave_by<i.end?` · leave ${F(i.leave_by)}`:""}function Cn(i){if(i.busy_why==="days"){if(i.start<=0&&i.end>=1440)return"All day";if(i.start<=0)return`Until ${F(i.end)}`;if(i.end>=1440)return`From ${F(i.start)}`}return`${F(i.start)}–${F(i.end)}`}function Pn(i,t){return t.own?pe(i,t.own):me(i,t.kid)}var bt={color:wn,rgb:ai,ink:wn};function vo(i,t){return t.own?bt:ke(i).get(t.kid)??de(0)}function ja(i,t){let e=_e(i);return t.along.map(n=>e.includes(n)?me(i,n):pe(i,n))}function vt(i){return i.length<2?i.join(""):`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}function za(i){let t=new Map([["home","Home"]]);for(let e of i.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function En(i,t){return t?i.get(t)??(t.split(",")[0]?.trim()||t):""}function di(i,t){let e=[];for(let n of i)n.type==="drive"?(e.length||e.push(En(t,n.from)),e.push(En(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(En(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Ha(i){let t=i.map(r=>({...r,col:0,cols:1})).sort((r,a)=>r.s-a.s||a.en-r.en),e=[],n=[],o=-1/0,s=()=>{for(let r of e)r.cols=n.length;e=[],n=[]};for(let r of t){r.s>=o&&(s(),o=-1/0);let a=n.findIndex(c=>c<=r.s);a<0?(a=n.length,n.push(r.en)):n[a]=r.en,r.col=a,e.push(r),o=Math.max(o,r.en)}return s(),t}function Ua(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].y;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.t)return o.t===n.t?n.y:Math.round(n.y+(t-n.t)/(o.t-n.t)*(o.y-n.y))}return i[i.length-1].y}function Fa(i,t){if(!i.length)return 0;if(t<=i[0].y)return i[0].t;for(let e=0;e<i.length-1;e++){let n=i[e],o=i[e+1];if(t<=o.y)return o.y===n.y?n.t:n.t+(t-n.y)/(o.y-n.y)*(o.t-n.t)}return i[i.length-1].t}function yo(i,t){return Ua(i.anchors,t)}function mi(i,t){return Fa(i.anchors,t)}function Ka(i,t){let e=_e(i),n=xe(i),o=Math.max(t,fi(e.length,n.length)),r=(o-mt-Math.max(0,e.length-1)*hi-Tn-Math.max(0,n.length-1)*ui)/(e.length+_n*n.length||1),a=Math.floor(r),c=Math.floor(r*_n),d=i.whole_week??i.days,u=new Map;for(let m of d)for(let x of m.events)for(let C of x.own?x.along:[x.kid]){let g=u.get(C)??[];g.some(I=>I.event_id===x.event_id&&I.calendar_id===x.calendar_id)||g.push(x),u.set(C,g)}let l=ke(i),p=[],b=mt;e.forEach((m,x)=>{let C=u.get(m)??[],g=i.days.some(I=>I.events.some(H=>H.kid===m&&(H.sides.includes("drop")&&H.drop===""||H.sides.includes("pick")&&H.pick==="")));p.push({id:m,kind:"kid",x:b,w:a,name:me(i,m),dot:l.get(m).color,rgb:l.get(m).rgb,sub:`${g?"Needs a ride · ":""}${C.length} this week`,subWarn:g}),b+=a+(x<e.length-1?hi:0)});let T=b+Tn/2;return b+=Tn,n.forEach((m,x)=>{let C=0,g=0;for(let I of d){let H=I.drivers[m];H&&(C+=H.outings.length,g+=H.drive??0)}p.push({id:m,kind:"driver",x:b,w:c,name:pe(i,m),dot:wn,rgb:ai,sub:`${C} ${C===1?"trip":"trips"} this week · ${Lt(g)} driving`,subWarn:!1}),b+=c+(x<n.length-1?ui:0)}),{columns:p,sepX:T,width:o}}function Wa(i,t){let e=i.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let o=e.slice(t.length),s=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(o);if(!s)return e;let r=o.slice(s[0].length);return r?r[0].toUpperCase()+r.slice(1):e}function lo(i,t){let e=i.start<=0,n=i.end>=1440;return e&&n?`${i.title} · all day`:n?`${i.title} from ${F(i.start)}`:e||!t?`${i.title} until ${F(i.end)}`:`${i.title} ${F(i.start)}–${F(i.end)}`}function bi(i){return i.issues.filter(t=>t.level==="problem").length+i.clashes.length+(i.unplaced?.length??0)}function vi(i,t){let e=De(t,i);return e===0?"Today":e===1?"Tomorrow":""}function he(i,t=0){return i==null||!Number.isFinite(i)?t:i}var pi=null;function xo(i){pi=i}var $n='Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',gt={title:`800 14.5px ${$n}`,time:`400 12px ${$n}`,line:`600 12px ${$n}`,stop:`400 12px ${$n}`};function Va(i,t,e){let n=Math.max(8,Math.floor(t/e)),o=1,s=0;for(let r of i.split(/[ \t\n]+/).filter(Boolean)){let a=r.length;for(s===0?s=a:s+1+a<=n?s+=1+a:(o++,s=a);s>n;)o++,s-=n}return o}function Ga(i,t,e,n){let o=i.split(/[ \t\n]+/).filter(Boolean),s=1,r="";for(let a of o){let c=r?`${r} ${a}`:a,d=n(c,e);if(d==null)return null;if(d<=t){r=c;continue}r&&s++;let u=n(a,e);if(u==null)return null;u>t&&(s+=Math.ceil(u/t)-1),r=a}return s}function Ht(i,t,e=7,n){if(n&&pi){let o=Ga(i,t-.5,n,pi);if(o!=null)return o}return Va(i,t,e)}var wo=25,qa=15,ko=3;function co(i){return Math.max(0,Math.min(ko,Math.floor((i-wo)/qa)))}var Ya=wo+2,ho=20;function uo(i){return/^(\d+:\d\d)\s+Home$/.exec(i.at(-1)??"")?.[1]??null}var Ut="🚗";function po(i,t){if(i===(t==="drop"?"No ride there yet":"No ride home yet"))return"needed";let e=(o,s,r,a=!1)=>({at:o,who:s,stays:a,extra:r?` ·${r.slice(1)}`:""}),n;if(t==="drop"){if(n=/^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(i))return e(n[1],n[2],n[3]);if(n=/^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(i))return e(n[2],n[1],n[3],!0);if(n=/^(?:Drop-off: |Goes with |With )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}else{if(n=/^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(i))return e(n[1]??n[2],n[3],n[4]);if(n=/^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(i))return e("",n[1],n[2])}return null}var fo={muted:0,normal:1,pending:2,problem:3};function Xa(i){let{drop:t,pick:e}=i,n=t?po(t.text,"drop"):null,o=e?po(e.text,"pick"):null;if(t&&!n||e&&!o||!n&&!o)return i;let s=[t,e].reduce((c,d)=>d&&(fo[d.tone]??1)>(fo[c]??1)?d.tone:c,(t??e).tone);if(n==="needed"&&o==="needed")return{drop:{text:`${Ut} No rides yet`,tone:s},pick:null};if(n&&o&&n!=="needed"&&o!=="needed"&&n.who===o.who&&!n.extra&&!o.extra){let c=`${Ut} ${n.who}${n.stays?" stays":""}`;return!n.at&&!o.at?{drop:{text:`${c} both ways`,tone:s},pick:null}:!n.at||!o.at?{drop:{text:`${c} both ways · ${n.at?`↓${n.at}`:`↑${o.at}`}`,tone:s},pick:null}:{drop:{text:`${c} ↓${n.at} ↑${o.at}`.trimEnd(),tone:s},pick:null}}let r=(c,d)=>c==="needed"?`${d} needed`:`${d}${c.at?`${c.at} `:" "}${c.who}${c.stays?" stays":""}${c.extra}`,a=[n?r(n,"↓"):null,o?r(o,"↑"):null].filter(Boolean);return{drop:{text:`${Ut} ${a.join(" · ")}`,tone:s},pick:null}}function Ja(i,t){return!t&&!!i.drop&&!i.pick&&i.drop.tone==="muted"}var Za=5,Qa=13;function el(i,t,e={}){let n=e.clash?4:2,o=t-n-13-9,s=n+2*Za;s+=Ht(i.title,o-(e.noted?Qa:0),9,gt.title)*18;let r=i.inline&&i.drop?`${i.time} · ${i.drop.text}`:i.time;return s+=1+Ht(r,o,6.6,i.inline?gt.line:gt.time)*16,i.drop&&!i.inline&&(s+=1+Ht(i.drop.text,o,7,gt.line)*16),i.pick&&(s+=2+Ht(i.pick.text,o,7,gt.line)*16),Math.ceil(s)+1}function go(i){return i.replace(/^(\S+\s+Home), get (.+)$/u,"$1 ↑ $2").replace(/, drop off (.+)$/u," ↓ $1").replace(/, pick up (.+)$/u," ↑ $1")}function tl(i,t){let e=i.reduce((n,o)=>n+Ht(o,t-20,7,gt.stop),0);return 28+i.length+e*16+1}function $o(i,t,e,n){let o=t==="compact",{columns:s,sepX:r,width:a}=Ka(i,e),c=new Map(s.map(g=>[g.id,g])),d=_e(i),u=xe(i),l=[...d,...u],p=ke(i),b=za(i),T=g=>me(i,g),m=g=>pe(i,g),x={mode:t,width:a,height:0,columns:s,sepX:r,dayHeads:[],empties:[],grid:[],hours:[],folds:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},C=0;return i.days.forEach((g,I)=>{let H=I*1440,V=new Map(g.events.map(h=>[h.id,h])),ue=h=>h&&V.has(h)?{day:g.date,event:h}:null,w=bi(g),k=g.events.length,y=vi(g.date,n.date),P=Me(g.date),M=(k?`${k} ${k===1?"activity":"activities"}${g.done?" left":""}`:g.done?"All done for today":"Nothing scheduled")+(w?` · ${w} to sort out`:""),S=cl(i,g,p,a,a-Ba(P,y,M));x.dayHeads.push({date:g.date,y:C,label:P,tag:y,sub:M,warn:w>0,h:Ft+(S&&S.h?S.h+bo+2:0),allDay:S?.chips??[],inline:S?.inline??0}),x.anchors.push({t:H,y:C});let O=x.dayHeads[x.dayHeads.length-1],W=C+O.h+ci,X=u.flatMap(h=>g.drivers[h]?.outings??[]);if(!k&&!X.length){x.empties.push({key:g.date,y:W,text:g.done?"Nothing else today":"Nothing planned"}),C=W+40,x.anchors.push({t:H+1439,y:C});return}let Z=(h,v,E=h.kid)=>{let _=!!h.own&&E===h.own,B=!!h.own&&E!==h.own,j=_?m(E):T(E),L=B?{drop:{text:`${v?`${Ut} `:""}With ${m(h.own)}`,tone:h.attending===!1?"muted":"normal"},pick:null}:v&&!h.own?Xa(h.lines):h.lines,J=_?ja(i,h):[],U=(h.takes!=null?`${h.takes} min, any time ${F(h.start)}–${F(h.end)}`:Cn(h)+(h.arrive_by!=null?` · arrive ${F(h.arrive_by)}`:"")+Na(h))+(J.length?` · with ${vt(J)}`:"");return{who:j,mine:_,title:Wa(h.title,j),time:U,drop:L.drop,pick:L.pick,inline:v&&Ja(L,h.attending===!1)}},z=(h,v,E,_)=>el(Z(h,!0,E),v,{noted:!!h.notes,clash:_}),Y=(h,v,E,_,B,j,L,J=h.kid)=>{let U=Z(h,L,J),ee=U.mine?bt:p.get(J)??de(0),Ce=U.who,A={drop:U.drop,pick:U.pick};return{key:`${g.date}|card|${h.id}`+(h.own?`|${J}`:""),x:v,y:E,w:_,h:B,target:{day:g.date,event:h.id},event:h,color:ee,kidName:Ce,clash:j,stayed:!h.own&&h.stay&&u.includes(h.drop),skipped:h.attending===!1,title:U.title,time:U.time,drop:A.drop,pick:A.pick,showDrop:!!A.drop&&(L||B>=56),showPick:!!A.pick&&(L||B>=74),wrap:L,inline:U.inline,aria:`${Ce}, ${h.title} ${h.takes!=null?`any time from ${F(h.start)} to ${F(h.end)}`:Cn(h).replace("–"," to ")}. `+(h.attending===!1&&!A.drop?"Not attending. ":"")+[A.drop,A.pick].filter(re=>!!re).map(re=>re.text).join(". ")}},Q=h=>{let v=g.rides[h];return v?(g.drivers[v.driver]?.segments??[]).filter(_=>_.type!=="home"&&_.kids.includes(v.kid)&&he(_.start)>=he(v.start)&&he(_.end)<=he(v.end)):[]},Se=h=>{let v=g.rides[h];if(!v)return null;let E=v.serves.find(_=>V.get(_)?.kid===v.kid);return ue(E??v.serves[0])},Ne=(h,v)=>{if(v.event)return v;let E=g.events.find(_=>_.own&&_.own!==h&&_.along.includes(h)&&_.title===v.title);return E?{...v,title:`${v.title} with ${m(E.own)}`}:v},$e=h=>{if(h.takes==null)return[h.start,h.end];let v=h.planned??h.start;return[v,v+h.takes]},le=new Map;for(let h of g.issues)h.level!=="problem"||!h.event||(h.kind==="late"&&le.set(h.event,`${Math.round(he(h.minutes))} min late`),h.kind==="waiting"&&le.set(`${h.event}|pick`,`Waits ${Math.round(he(h.minutes))} min`));if(!o){let h=1/0,v=-1/0;for(let A of g.events)A.start<=0&&A.end>=1440||(A.start>0?h=Math.min(h,A.start-20,A.arrive_by!=null?A.arrive_by-10:1/0):h=Math.min(h,A.end-30),A.end<1440?v=Math.max(v,A.end+20):v=Math.max(v,A.start+30));for(let A of X)A.start!=null&&(h=Math.min(h,A.start)),A.end!=null&&(v=Math.max(v,A.end));let E=g.from;E!=null&&Number.isFinite(h)&&h<E+60?h=E-15:g.date===n.date&&Number.isFinite(h)&&n.minutes>h-60&&n.minutes<v&&(h=Math.min(h,n.minutes-15));let _=Number.isFinite(h)?Math.floor((h-5)/30)*30:900,B=Math.max(Number.isFinite(v)?Math.ceil((v+5)/30)*30:960,_+60),j=A=>E!=null&&he(A)<=_,L=A=>E!=null&&he(A)<_,J=il(nl(g,u,$e,g.date===n.date?n.minutes:null),_,B),U=A=>Math.round(W+sl(Math.max(_,Math.min(B,A))-_,J,_));x.anchors.push({t:H+_,y:U(_)});for(let A of J)x.anchors.push({t:H+A.from,y:U(A.from)},{t:H+A.to,y:U(A.to)}),x.folds.push({key:`${g.date}|fold|${A.from}`,y:U(A.from),h:U(A.to)-U(A.from),from:A.from,to:A.to,label:ol(A.to-A.from)});x.anchors.push({t:H+B,y:U(B)});let ee=(A,re)=>J.some(ge=>re?A>=ge.from&&A<=ge.to:A>ge.from&&A<ge.to);for(let A of d){let re=c.get(A),ge=p.get(A),Ct=(g.kids[A]?.items??[]).filter(D=>D.start!=null&&D.end!=null&&!j(D.end)).map(D=>({item:D,s:he(D.start),en:he(D.end)})),be=[];for(let D of Ha(Ct)){let K=re.w/D.cols,G=Math.round(re.x+D.col*K),te=Math.round(K-(D.cols>1?4:0)),ae=U(D.s),ne=D.item;if(ne.type==="act"){let Te=V.get(ne.event??"");if(!Te)continue;let nn=Math.max(30,U(D.en)-ae),ht=Y(Te,G,ae,te,nn,ne.clash,!1,A);if(ht.layer=zt,ht.cut=L(D.s),x.cards.push(ht),Te.arrive_by!=null&&Te.start-Te.arrive_by>=5&&!ht.cut){let Kn=U(Te.arrive_by),us={key:`${g.date}|prep|${Te.id}`,x:G,y:Kn,w:te,h:ae-Kn+Ie,color:ge,label:`Arrive by ${F(Te.arrive_by)}`,layer:zt-1};x.preps.push(us),be.push({s:Te.arrive_by,en:D.en,top:Kn,bottom:ae+nn,x:G,w:te,prep:us,card:ht})}else be.push({s:D.s,en:D.en,top:ae,bottom:ae+nn,x:G,w:te,card:ht});let ds=le.get(Te.id);ds&&x.marks.push({key:`${g.date}|late|${Te.id}`,x:G+te-4,y:ae+4,text:ds,right:!0});let hs=le.get(`${Te.id}|pick`);hs&&x.marks.push({key:`${g.date}|wait|${Te.id}`,x:G+4,y:ae+nn+2,text:hs,right:!1});continue}let q=g.rides[ne.ride??-1];if(!q)continue;let Le=Math.max(22,U(D.en)-ae),Mt=di(Q(q.index),b),as=m(q.driver),ls={key:`${g.date}|ride|${q.index}`,x:G,y:ae,w:te,h:Le,target:Se(q.index),l1:`${q.own?"In":"Along in"} ${as}’s car`,l2:Mt.join(" → "),show2:co(Le)>0,lines2:co(Le),dashed:!q.own,clash:ne.clash,aria:`${T(A)} ${q.own?"in":"riding along in"} ${as}’s car, ${F(he(q.start))} to ${F(he(q.end))}: ${Mt.join(" to ")}`};x.rides.push(ls);let cs=c.get(q.driver),Fn=null;cs&&(Fn={key:`${g.date}|band|${q.index}`,x:G+te,y:ae,w:Math.max(0,cs.x+8-(G+te)),h:Le,color:ge},x.bands.push(Fn)),be.push({s:D.s,en:D.en,top:ae,bottom:ae+Le,x:G,w:te,ride:ls,band:Fn})}let tn=D=>D.ride?.layer??(D.prep?zt-1:zt),Pt=(D,K,G,te)=>{G>Ie&&x.links.push({key:`${D.key}|link`,x:D.x,y:K,w:D.w,h:G,color:ge,layer:te})},R=(D,K)=>{if(!(K.x<D.x||K.x+K.w>D.x+D.w)&&(D.x=K.x,D.w=K.w,D.ride.x=K.x,D.ride.w=K.w,D.band)){let G=D.band.x+D.band.w;D.band.x=K.x+K.w,D.band.w=Math.max(0,G-D.band.x)}},ce=new Set;for(let D of[...be].sort((K,G)=>G.s-K.s)){let K=D.ride;if(!K)continue;let G=be.filter(ne=>ne!==D&&ne.s>=D.en&&ne.s-D.en<=so&&ne.top>=D.bottom).sort((ne,q)=>ne.s-q.s||ne.top-q.top)[0];if(!G)continue;ce.add(D),R(D,G);let te=tn(G),ae=G.top-D.bottom;Pt(K,D.bottom,ae+Ie,te-1),K.layer=te-(ae>0?2:1),K.h+=Ie,K.tuckBottom=Ie}for(let D of[...be].sort((K,G)=>K.s-G.s)){let K=D.ride;if(!K||ce.has(D))continue;let G=be.filter(ne=>ne!==D&&ne.en<=D.s&&D.s-ne.en<=so&&ne.bottom<=D.top&&(ne.card||ne.ride?.layer!=null)).sort((ne,q)=>q.en-ne.en||q.bottom-ne.bottom)[0];if(!G)continue;R(D,G);let te=G.ride?.layer??zt,ae=D.top-G.bottom;Pt(K,G.bottom-Ie,ae+Ie,te-1),K.layer=te-(ae>0?2:1),K.y-=Ie,K.h+=Ie,K.tuckTop=Ie}}for(let A of u){let re=c.get(A),ge=g.drivers[A];if(!ge)continue;let Ct=[],be=null;for(let R of ge.segments)if(!(R.start==null||R.end==null)){if(R.type==="home"){be=null;continue}if(R.type==="stay"){be=null,Ct.push({type:"stay",g:R,s:R.start,en:R.end});continue}be&&be.en===R.start?(be.en=R.end,be.legs.push(R)):(be={type:"trip",s:R.start,en:R.end,legs:[R]},Ct.push(be))}let tn=new Set,Pt=(R,ce,D,K)=>{tn.add(R.id);let G=U(ce),te=Y(R,re.x+8,G,re.w-16,Math.max(30,U(D)-G),!1,!1,A);te.cut=L(ce),K&&te.drop?.tone==="normal"&&(te.drop=null,te.showDrop=!1),x.cards.push(te)};for(let R of Ct){if(j(R.en))continue;let ce=U(R.s),D=Math.max(24,U(R.en)-ce);if(R.type==="stay"){let q=V.get(R.g.event??R.g.serves??"");if(q?.own===A){Pt(q,R.s,R.en,!0);continue}let Le=q?p.get(q.kid)??de(0):de(0),Mt=R.g.kids.map(T);x.stays.push({cut:L(R.s),key:`${g.date}|stay|${A}|${R.s}`,x:re.x+8,y:ce,w:re.w-16,h:D,target:ue(q?.id),color:Le,l1:q?`At ${q.title} with ${T(q.kid)}`:"Staying",l2:`until ${F(R.en)}`+(Mt.length?` · ${Mt.join(" and ")} too`:"")});continue}let K=R.legs[0],G=R.legs[R.legs.length-1],te=[];for(let q of R.legs)for(let Le of q.kids)te.includes(Le)||te.push(Le);let ae=G.type==="drive"&&G.to==="home",ne=di(R.legs,b);x.trips.push({key:`${g.date}|trip|${A}|${R.s}`,x:re.x+8,y:ce,w:re.w-16,h:D,target:ue(R.legs.find(q=>q.serves)?.serves),l1:K.type==="drive"&&K.from==="home"?`Leave ${F(R.s)}`:`From ${En(b,K.from??K.place)} ${F(R.s)}`,l2:ne.join(" → "),show2:D>=36,l3:ae?`Home ${F(R.en)}`:"",show3:ae&&D>=62,stops:null,kids:te.map(q=>(p.get(q)??de(0)).color),bad:R.legs.some(q=>q.overlaps_busy),aria:`${m(A)} drives ${ne.join(" to ")}, ${F(R.s)} to ${F(R.en)}`})}for(let R of ge.segments)if(!(!R.overlaps_busy||R.start==null||R.end==null))for(let ce of ge.busy){let D=Math.max(R.start,ce.start),K=Math.min(R.end,ce.end);K<=D||j(K)||x.overlaps.push({key:`${g.date}|overlap|${A}|${D}`,x:re.x+6,y:U(D)-2,w:re.w-12,h:Math.max(8,U(K)-U(D)+4)})}for(let R of g.events)if(R.own===A&&(!tn.has(R.id)&&!j($e(R)[1])&&Pt(R,...$e(R),!1),R.takes!=null&&R.attending!==!1&&!j(R.end))){let ce=U(R.start);x.windows.push({key:`${g.date}|window|${R.id}`,x:re.x+4,y:ce,w:re.w-8,h:Math.max(24,U(R.end)-ce),label:`${R.title} · any time ${F(R.start)}–${F(R.end)}`})}for(let R of ge.busy){if(R.event||R.end<=_||R.start>=B)continue;let ce=Ne(A,R),D=U(ce.start),K=U(ce.end);x.busy.push({key:`${g.date}|busy|${A}|${ce.start}`,x:re.x+1,y:D,w:re.w-2,h:K-D,labelY:8,label:lo(ce,!1)})}}let Ce=-1/0;for(let A=_;A<=B;A+=30)ee(A,!0)||x.grid.push({key:`${g.date}|grid|${A}`,y:U(A),strong:A%60===0}),(J.some(ge=>ge.from===A||ge.to===A)||A%60===0&&!ee(A,!1))&&U(A)-Ce>=22&&(x.hours.push({key:`${g.date}|hour|${A}`,y:U(A)-8,label:A%60===0?Ps(A):Pe(A)}),Ce=U(A));g.date===n.date&&n.minutes>_&&n.minutes<B&&(x.now={y:U(n.minutes),label:`Now ${F(n.minutes)}`}),C=U(B)+ci;return}let ie=[];for(let h of d){let v=c.get(h);for(let E of g.kids[h]?.items??[])if(E.start!=null){if(E.type==="act"){let _=V.get(E.event??"");if(!_)continue;ie.push({col:h,s:E.start,h:z(_,v.w,h,E.clash),kind:"act",item:E})}else if(!g.rides[E.ride??-1]?.own){let _=g.rides[E.ride??-1],B=_?g.drivers[_.driver]?.outings.find(j=>j.start!=null&&j.start<=he(_.start)&&he(_.start)<=he(j.end,j.start)):void 0;ie.push({col:h,s:B?.start??E.start,h:Ya,kind:"along",item:E})}}}for(let h of u){let v=g.drivers[h];if(!v)continue;for(let _ of v.busy)_.event||ie.push({col:h,s:_.start,h:32,kind:"busy",busy:Ne(h,_)});let E=c.get(h).w;for(let _ of g.events)_.own!==h||!_.busy_only&&_.attending!==!1&&(_.takes==null||_.planned!=null)||ie.push({col:h,s:$e(_)[0],h:z(_,E-16,h,!1),kind:"own",event:_});for(let _ of v.outings){if(_.start==null)continue;let B=(uo(_.lines)?_.lines.slice(0,-1):_.lines).map(go);ie.push({col:h,s:_.start,h:tl([...B,..._.warn?[_.warn]:[]],E-16),kind:"out",out:_})}}ie.sort((h,v)=>h.s-v.s||l.indexOf(h.col)-l.indexOf(v.col));let fe=new Map,we=[],dt=new Map,Fe=W-ho;for(let h=0;h<ie.length;){let v=h,E=Fe+ho;for(;v<ie.length&&ie[v].s===ie[h].s;v++){let B=fe.get(ie[v].col);B!=null&&(E=Math.max(E,B+kn))}let _=new Set;for(let B=h;B<v;B++){let j=ie[B],L=_.has(j.col)?fe.get(j.col)+kn:E;_.add(j.col),fe.set(j.col,L+j.h)}dt.set(ie[h].s,E),ie[h].s>0&&x.hours.push({key:`${g.date}|hour|${ie[h].s}`,y:E+2,label:Pe(ie[h].s)}),Fe=E,h=v}fe.clear(),ie.forEach((h,v)=>{let E=fe.get(h.col),_=Math.max(E!=null?E+kn:W,dt.get(h.s));fe.set(h.col,_+h.h);let B=h.kind==="busy"?h.busy.end:h.kind==="act"?V.get(h.item.event??"")?.end??null:h.kind==="own"?$e(h.event)[1]:null;we.push({col:h.col,s:h.s,end:B,y:_,h:h.h,box:null}),x.anchors.push({t:H+h.s,y:_});let j=c.get(h.col);if(h.kind==="busy"){let L={key:`${g.date}|busy|${h.col}|${v}`,x:j.x+1,y:_,w:j.w-2,h:h.h,labelY:8,label:lo(h.busy,!0)};x.busy.push(L),we[we.length-1].box=L}else if(h.kind==="out"){let L=h.out,J=uo(L.lines),U=J?L.lines.slice(0,-1):L.lines;x.trips.push({key:`${g.date}|trip|${h.col}|${v}`,x:j.x+8,y:_,w:j.w-16,h:h.h,target:ue(L.target),l1:J?`${L.lead} · home ${J}`:L.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...U.map(ee=>({text:go(ee),warn:!1})),...L.warn?[{text:L.warn,warn:!0}]:[]],kids:L.kids.map(ee=>(p.get(ee)??de(0)).color),bad:!!L.warn,aria:`${m(h.col)}: ${L.lead}. ${L.lines.join(". ")}${L.warn?`. ${L.warn}`:""}`})}else if(h.kind==="own"){let L=Y(h.event,j.x+8,_,j.w-16,h.h,!1,!0,h.col);x.cards.push(L),we[we.length-1].box=L}else if(h.kind==="act"){let L=V.get(h.item.event??""),J=Y(L,j.x,_,j.w,h.h,h.item.clash,!0,h.col);x.cards.push(J),we[we.length-1].box=J}else{let L=g.rides[h.item.ride??-1],J=di(Q(L.index),b),U=m(L.driver);x.rides.push({key:`${g.date}|ride|${L.index}`,x:j.x,y:_,w:j.w,h:h.h,target:Se(L.index),l1:`${Ut} with ${U}`,l2:J.join(" → "),show2:!1,lines2:ko,dashed:!0,clash:h.item.clash,aria:`${T(h.col)} riding along with ${U}, ${F(he(L.start))} to ${F(he(L.end))}: ${J.join(" to ")}`})}});let N=W;for(let h of fe.values())N=Math.max(N,h);for(let h of we){if(!h.box||h.end==null)continue;let v=h.y+h.h;for(let E of we)E.col!==h.col&&E.s>=h.s&&E.s<h.end&&(v=Math.max(v,E.y+E.h));h.end>=1440&&(v=N);for(let E of we)E.col===h.col&&E.y>h.y&&(v=Math.min(v,E.y-kn));v=Math.min(v,N),v>h.y+h.h&&(h.box.h=v-h.y)}C=N+ci+6,x.anchors.push({t:H+1439,y:C})}),x.height=C,x}function nl(i,t,e,n){let o=[],s=(r,a)=>{r==null||a==null||o.push([r-ro,Math.min(a,r+La)+ao],[Math.max(r,a-Da)-ro,a+ao])};for(let r of i.events)r.own?(s(...e(r)),r.takes!=null&&s(r.start,r.end)):s(r.arrive_by??r.start,r.end);for(let r of Object.values(i.kids))for(let a of r.items??[])s(a.start,a.end);for(let r of t){let a=i.drivers[r];if(a){for(let c of a.segments)c.type!=="home"&&s(c.start,c.end);for(let c of a.outings)s(c.start,c.end);for(let c of a.busy)s(c.start,c.end)}}return n!=null&&o.push([n-30,n+30]),o}function il(i,t,e){let n=i.map(([c,d])=>[Math.max(t,c),Math.min(e,d)]).filter(([c,d])=>d>c).sort((c,d)=>c[0]-d[0]),o=[],s=t,r=(c,d)=>{let u=Math.ceil(c/30)*30,l=Math.floor(d/30)*30;l-u>=Sa&&o.push({from:u,to:l})},a=!1;for(let[c,d]of n)a&&c>s&&r(s,c),s=a?Math.max(s,d):d,a=!0;return o}function sl(i,t,e){let n=i*li,o=e+i;for(let s of t){let r=s.to-s.from;o>=s.to?n-=r*li-oo:o>s.from&&(n-=(o-s.from)*li-(o-s.from)/r*oo)}return n}function ol(i){let t=Math.floor(i/60),e=i%60>=30;return`${t}${e?"½":""} hrs`}var rl=["","¼","½","¾"];function tt(i){return i.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Lt(n);let o=Math.round(n*4),s=Math.floor(o/4),r=rl[o%4];return`${s||!r?s:""}${r} min`})}function To(i){let t=e=>e?{...e,text:tt(e.text)}:null;return{...i,days:i.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,o])=>[n,{...o,outings:o.outings.map(s=>({...s,lines:s.lines.map(tt),warn:s.warn==null?s.warn:tt(s.warn)}))}])),issues:e.issues.map(n=>({...n,title:tt(n.title),body:tt(n.body),note:n.note==null?n.note:tt(n.note),...n.suggestions?{suggestions:n.suggestions.map(o=>({...o,note:tt(o.note)}))}:{}}))}))}}var al=2,ll=48;function Eo(i,t,e=ll){let n=[],o=new Set(xe(i)),s=_e(i).map(p=>me(i,p)),r=s.length>1?s.slice(0,2):[s[0]??"Ava","Ben"],a=0,c=0,d=0,u=0,l=t.minutes+e*60;for(let p of i.days){let b=De(t.date,p.date),T=b===0?"":`${ve(p.date)} · `,m=new Map(p.events.map(g=>[g.id,g])),x=g=>g&&m.has(g)?{day:p.date,event:g}:null,C=(g,I)=>b*1440+(g??m.get(I??"")?.start??0)<l;for(let g of p.issues)if(g.level==="problem"){if(!C(g.at,g.event)){d++,g.kind==="unassigned"&&u++;continue}a++,g.kind==="unassigned"&&c++,n.push({key:`${p.date}|${g.key}`,tone:g.kind==="unassigned"?"unassigned":"problem",title:T+g.title,body:g.body,target:x(g.event),suggestions:(g.suggestions??[]).map(I=>({id:I.id,label:I.label,note:I.note}))})}if(p.clashes.forEach((g,I)=>{if(!C(g.a.start,g.a.event)){d++;return}a++;let H=m.get(g.a.event??""),V=me(i,g.kid),ue=(k,y)=>{let P=x(y);return P?{text:k,target:P}:k},w=[];if(g.b.type==="act"){let k=m.get(g.b.event??"");H&&k&&(w=[ue(H.title,H.id),` ${F(H.start)}–${F(H.end)} and `,ue(k.title,k.id),` ${F(k.start)}–${F(k.end)} overlap.`])}else{let k=p.rides[g.b.ride??-1];H&&k&&(w=[`${V} is in `,ue(`${pe(i,k.driver)}’s car`,k.serves[0]),` ${F(he(g.b.start))}–${F(he(g.b.end))}, during `,ue(H.title,H.id),"."])}n.push({key:`${p.date}|clash|${I}`,tone:"problem",title:`${T}${V} is double-booked`,body:w.map(k=>typeof k=="string"?k:k.text).join(""),parts:w,target:null,suggestions:[]})}),b>=0&&b<al)for(let g of p.issues)g.level!=="heads_up"||!C(g.at,g.event)||n.push({key:`${p.date}|${g.key}`,tone:"heads_up",title:T+g.title,body:g.body,target:x(g.event),suggestions:[]});for(let g of p.unplaced??[]){if(!C(g.at)){d++;continue}a++;let I=g.people.map(V=>o.has(V)?pe(i,V):me(i,V)),H=g.from_notes?"The For line in its notes":"Its title";n.push({key:`${p.date}|unplaced|${g.id}`,tone:"problem",title:`${T}${F(g.at)} ${g.title}: ${_o(g).toLowerCase()}`,body:g.reason==="unknown"&&g.word?`${H} names “${g.word}”, who isn’t anyone in the family, so ${I.length?`it’s only in ${vt(I)}’s lane`:"it isn’t on the board"}. Tap to pick who it’s for.`:`Its title doesn’t start with anyone’s name, so it isn’t on the board. Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “${r[0]} Piano”.`,target:null,suggestions:[],pick:{day:p.date,id:g.id}})}for(let g of p.events)!g.problems.length||!C(g.start)||n.push({key:`${p.date}|notes|${g.id}`,tone:"heads_up",title:`${T}Check the notes on ${Pn(i,g)}’s ${g.title}`,body:`These lines couldn’t be read: ${g.problems.join("; ")}`,target:x(g.id),suggestions:[]})}return{items:n,problems:a,unassigned:c,later:d,laterUnassigned:u}}function _o(i){return i.reason==="unknown"&&i.word?`Who is “${i.word}”?`:"Who is this for?"}function cl(i,t,e,n,o=0){let s=new Set(xe(i)),r=T=>{let m=T[0];return m==null?null:s.has(m)?bt:e.get(m)??null},a=[...(t.all_day??[]).map(T=>({key:`${t.date}|allday|${T.id}`,title:T.title,note:T.days>1?`Day ${T.day_number} of ${T.days}`:"",color:r(T.people),cancelled:T.cancelled,warn:!1,pick:null,notes:T.notes??""})),...(t.unplaced??[]).map(T=>({key:`${t.date}|unplaced|${T.id}`,title:`${F(T.at)} ${T.title}`,note:_o(T),color:null,cancelled:!1,warn:!0,pick:T.id,notes:T.notes??""}))];if(!a.length)return null;let c=Math.max(120,n-mt),d=(T,m=7)=>30+m*T.title.length+(T.note?Math.min(m,5.6)*(T.note.length+2):0)+(T.notes?16:0),u=0,l=0;for(;u<a.length&&l+d(a[u],6.4)<=o;)l+=d(a[u++],6.4);let p=0;l=0;for(let T of a.slice(u)){let m=Math.min(c,d(T));(!p||l+m>c)&&(p++,l=0),l+=m}let b=p?p*Oa+(p-1)*bo:0;return{key:`${t.date}|allday`,h:b,chips:a,inline:u}}function Co(i,t){let e=ke(i),n=null,o=s=>s.ahead>0?2:s.ongoing?1:0;for(let s of i.days){let r=De(t.date,s.date);if(!(r<0))for(let a of xe(i))for(let c of s.drivers[a]?.outings??[]){if(c.start==null)continue;let d=r*1440+c.start;if(r*1440+he(c.end,c.start)<=t.minutes)continue;let l=d-t.minutes,p={driver:a,name:pe(i,a),date:s.date,ahead:r,start:c.start,inMinutes:l,ongoing:l<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(b=>e.get(b)??de(0)),warn:c.warn,target:c.target&&s.events.some(b=>b.id===c.target)?{day:s.date,event:c.target}:null};(!n||o(p)<o(n)||o(p)===o(n)&&p.inMinutes<n.inMinutes)&&(n=p)}}return n}function yt(i){return i.state==="done"||i.state==="late"}var dl=780;function hl(i,t,e){return i.state==="open"&&!!i.for_day&&i.due===t&&e<dl}function Po(i,t){return i.chores.map(e=>hl(e,i.today,t)?{...e,state:"upcoming",shows_from:i.today}:e)}function Mo(i){return i.state==="open"||i.state==="overdue"}function wi(i,t,e){if(yt(i)){let n=i.done_at?ul(i.done_at,t,e):"";return i.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(i.state==="overdue")return i.missed>1?`Missed ${i.missed} times`:i.due?`Missed ${yi(i.due,t)}`:"Missed";if(i.state==="upcoming"){if(i.for_day)return`From 1 PM · for ${yi(i.for_day,t)}`;let n=i.shows_from??i.due;if(!i.due||!n||i.due<=n)return"";let o=De(t,i.due);return`By ${o===1?"tomorrow":o<7?ve(i.due):xi(i.due)}`}if(i.for_day&&i.due===t)return`Tonight · for ${yi(i.for_day,t)}`;if(i.due&&i.due>t){let n=De(t,i.due);return n===1?"By tomorrow":`By ${n<7?ve(i.due):xi(i.due)}`}return i.missed?`Today · missed ${i.missed===1?"once":`${i.missed} times`} before`:"Today"}function yi(i,t){let e=De(t,i);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ve(i):xi(i)}function xi(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ul(i,t,e){let n=new Date(i);if(Number.isNaN(n.getTime()))return"";let o=e;try{new Intl.DateTimeFormat("en-US",{timeZone:o})}catch{o=void 0}let s=n.toLocaleDateString("en-CA",{timeZone:o}),r=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:o});return s===t?r:`${ve(s)} ${r}`}function Ao(i,t,e=1440){let n=Po(i,e).sort((o,s)=>o.order-s.order);return i.kids.map((o,s)=>{let r=n.filter(u=>u.kid===o.id),a=new Map;for(let u of r){if(u.state!=="upcoming")continue;let l=u.shows_from??u.due??i.today;a.set(l,[...a.get(l)??[],u])}let c=r.filter(u=>u.state==="overdue"),d=r.filter(u=>u.state==="open");return{kid:o.id,name:o.name,color:t?.get(o.id)??de(s),overdue:c,now:d,done:r.filter(yt),later:[...a.entries()].sort(([u],[l])=>u.localeCompare(l)).map(([u,l])=>({date:u,chores:l})),left:c.length+d.length}})}function So(i,t=1440){return Po(i,t).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=i.today)).sort((e,n)=>e.state===n.state?e.order-n.order:e.state==="overdue"?-1:1)}function ki(i){return!i.chores.length&&!i.templates.length}var nt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function $i(i){let t=i.trim();if(!t)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let n of t.split(",")){let[o,s]=n.split("-").map(r=>nt.indexOf(r.trim()));if(o===void 0||o<0||s!==void 0&&s<0)return null;if(s===void 0)e.add(o);else for(let r=0;r<=(s-o+7)%7;r++)e.add((o+r)%7)}return e}function Ti(i){let t=[...new Set(i)].sort((n,o)=>n-o);if(t.length===0||t.length===7)return"";let e=[];for(let n of t){let o=e.at(-1);o&&o.at(-1)===n-1?o.push(n):e.push([n])}return e.flatMap(n=>n.length>=3?[`${nt[n[0]]}-${nt[n.at(-1)]}`]:n.map(o=>nt[o])).join(", ")}var it="none";function Mn(i){return i==="daily"||i==="school"?"":"Any"}function Lo(i=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:i,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Do(i){let t=i.days??Mn(i.repeats),e=i.repeats==="daily"&&t!=="";return{template:i.id,repeats:e?"weekly":i.repeats,title:i.title,icon:i.icon,details:i.details??"",who:[...i.who],take_turns:!!i.take_turns,days:t,every:!e&&i.every&&i.every>0?i.every:1,paused:i.paused,night_before:!!i.night_before,bring_only:!!i.bring_only}}function Ei(i){return i.title.trim()?i.who.length?i.days===it?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Ro(i){return{...i.template?{template:i.template}:{},repeats:i.repeats,title:i.title.trim(),icon:i.icon??"",details:i.details.trim(),who:i.who,take_turns:i.take_turns&&i.who.length>1,days:i.repeats==="daily"?"":i.days,every:i.repeats==="school"?1:i.every,paused:i.paused,...i.repeats==="school"?{night_before:i.night_before,bring_only:i.bring_only}:{}}}function _i(i){let t=i%100;return t>=11&&t<=13?`${i}th`:`${i}${{1:"st",2:"nd",3:"rd"}[i%10]??"th"}`}function Ci(i,t,e=1,n=!1,o=!1){if(i==="school"){let u=t.trim().replace(/-/g,"–"),l=o?u?`${u} Bring lunch days`:"Bring lunch days":u?`${u} school days`:"Every school day";return n?`${l}, the night before`:l}let s={daily:"day",weekly:"week",monthly:"month"}[i],r=e>1?`every ${e} ${s}s`:`each ${s}`,a=t.trim();if(i==="daily")return e>1?`Every ${e} days`:"Every day";if(i==="weekly"&&/^mon\s*-\s*sun$/i.test(a))return e>1?`Every day, every ${e} weeks`:"Every day";if(!a||a.toLowerCase()==="any")return`Sometime ${r}`;if(i==="weekly")return`${a.replace(/-/g,"–")} ${r}`;let d=`${a.split(",").map(u=>{let l=u.trim();return l.toLowerCase()==="last"?"the last day":/^\d+$/.test(l)?`the ${_i(Number(l))}`:`the ${l}`}).join(" and ")} ${r}`;return d[0].toUpperCase()+d.slice(1)}function Pi(i,t,e=!1){let n=i.map(s=>t.find(r=>r.id===s)?.name??s);if(!n.length)return"Nobody yet";let o=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n.at(-1)}`;return e&&n.length>1?`${o} take turns`:o}function Mi(i){let t=i.indexOf(":"),e=t<0?i:i.slice(0,t),n=t<0?"":i.slice(t+1);switch(e){case"who":return n?`“${n}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${n}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${n}” couldn’t be read`;case"take_turns":return`“Take turns: ${n}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${n}”) couldn’t be read`}}function An(i,t){return`${i}|${t}`}function xt(i,t){let[e,n,o]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1,o+t)).toISOString().slice(0,10)}function Sn(i){let[t,e,n]=i.split("-").map(Number);return(new Date(Date.UTC(t,e-1,n)).getUTCDay()+6)%7}function Io(i,t){return i.days_off.find(e=>e.first<=t&&t<=e.last)??null}function Bo(i,t){return Sn(t)<5&&!Io(i,t)}function Kt(i,t,e=new Map){if(!Bo(i,t))return null;let n=An(i.id,t);if(e.has(n)){let s=e.get(n);return s?{lunch:s,picked:!0}:{lunch:i.default,picked:!1}}let o=i.picks[t];return o?{lunch:o,picked:!0}:{lunch:i.default,picked:!1}}function wt(i,t){return Bo(i,t)?i.menus?.[t]??null:null}var pl="From the school's menu feed.";function fl(i){let t=i.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==pl);return t.length?t.join(`
`):null}function Be(i){return i.slice(0,7)}function Ln(i){let[t,e]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Ai(i,t=1){let[e,n]=i.split("-").map(Number);return new Date(Date.UTC(e,n-1+t,1)).toISOString().slice(0,7)}function Oo(i){let t=[];for(let e=Be(i.first);e<=Be(i.last);e=Ai(e))t.push(e);return t}function No(i,t,e,n=new Map){let o=`${e}-01`,s=xt(o,-Sn(o)),r=[];for(;Be(s)<=e;){let a=[];for(let c=0;c<5;c++){let d=xt(s,c),u=Be(d)!==e,l=u?null:Io(t,d),p=u?null:Kt(t,d,n);a.push({date:d,day:Number(d.slice(8)),outside:u,off:l?l.title:null,lunch:p?.lunch??null,picked:p?.picked??!1,menu:u?null:wt(t,d)?.dish??null,sides:u?null:fl(wt(t,d)?.details??""),past:d<i.today,today:d===i.today})}a.some(c=>!c.outside)&&r.push(a),s=xt(s,7)}return r}function jo(i){return i.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function zo(i){let t=0,e=0;for(let n of i.flat())n.outside||n.past||!n.lunch||(n.lunch==="bring"?t++:e++);return{bring:t,buy:e}}function Ho(i,t,e,n=new Map){let o=e<780?0:1;for(let s=o;s<8;s++){let r=xt(t,s),a=Kt(i,r,n);if(!a)continue;let c=De(t,r);return{lunch:a.lunch,when:c===0?"today":c===1?"tomorrow":ve(r),date:r,menu:wt(i,r)?.dish??null}}return null}var gl={timeline:"timeline",full:"timeline",compact:"compact"};function st(i){let t=new URLSearchParams(i),e={},n=gl[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let o=(t.get("page")??"").trim().toLowerCase();return(o==="rides"||o==="chores"||o==="lunch")&&(e.page=o),["show","yes","on","true","1"].includes((t.get("past")??"").trim().toLowerCase())&&(e.past="show"),["off","no","false","0","hide"].includes((t.get("daypicker")??"").trim().toLowerCase())&&(e.daypicker=!1),e}var ml=["auth_callback","code","state"];function Si(i){let t=new URLSearchParams(i);for(let n of ml)t.delete(n);let e=t.toString();return e?`?${e}`:""}function Li(i,t=0){return i==null||!Number.isFinite(i)?t:i}function bl(i,t){let e=t.takes!=null&&t.planned!=null?t.planned+t.takes:t.end;if(t.attending===!1)return t.end;for(let n of i.rides)n.serves.includes(t.id)&&n.end!=null&&(e=Math.max(e,n.end));for(let n of Object.values(i.drivers))for(let o of n.segments)o.type==="home"||o.end==null||(o.serves===t.id||o.event===t.id)&&(e=Math.max(e,o.end));return e}function vl(i,t){let e=[],n=[],o=()=>{let s=n[n.length-1];s&&Li(s.end)>t&&e.push(...n),n=[]};for(let s of i){if(s.start==null||s.end==null)continue;if(s.type==="home"||s.type==="stay"){o(),s.end>t&&e.push(s);continue}let r=n[n.length-1];r&&r.end!==s.start&&o(),n.push(s)}return o(),e}function yl(i,t){let e=new Set(i.events.filter(s=>bl(i,s)<=t).map(s=>s.id)),n=s=>Li(i.rides[s??-1]?.end,-1)<=t,o=s=>s.type==="act"?e.has(s.event??""):n(s.ride);return{...i,events:i.events.filter(s=>!e.has(s.id)),kids:Object.fromEntries(Object.entries(i.kids).map(([s,r])=>[s,{...r,items:r.items.filter(a=>!o(a))}])),drivers:Object.fromEntries(Object.entries(i.drivers).map(([s,r])=>[s,{...r,segments:vl(r.segments,t),outings:r.outings.filter(a=>a.start==null||Li(a.end,a.start)>t),busy:r.busy.filter(a=>a.end>t)}])),clashes:i.clashes.filter(s=>!o(s.a)&&!o(s.b)),issues:i.issues.filter(s=>!s.event||!e.has(s.event)),done:e.size,from:t}}function Uo(i,t){return{...i,whole_week:i.whole_week??i.days,days:i.days.filter(e=>e.date>=t.date).map(e=>e.date===t.date?yl(e,t.minutes):e)}}var Fo=Ye`
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
`;function xl(i,t,e,n,o=14){let s=i.top-o-8,r=e.h-i.bottom-o-8,a=t.h<=s,c=t.h<=r,d=n?a||!c&&s>r:!c&&(a||s>r),u=d?i.top-o-t.h:i.bottom+o,l=Math.max(8,Math.min(u,e.h-8-t.h)),p=Math.max(8,Math.min(i.x-t.w/2,e.w-8-t.w));return{left:Math.round(p),top:Math.round(l),above:d}}function Wt(i,t){for(let e of i.composedPath()){if(e===t)break;if(e instanceof HTMLElement&&e.dataset.note)return e}return null}var Dn=class{constructor(t,e){this.tip=null;this.anchor=null;this.held=!1;this.hoverTimer=null;this.hideTimer=null;this.hoverAt={x:0,y:0};this.hoverEl=null;this.press=null;this.eatUntil=0;this.hide=()=>{this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting")),this.anchor=null,this.held=!1,this.tip?.classList.remove("on")};this.onHover=t=>{if(t.pointerType==="touch"||t.buttons)return;let e=t.composedPath().includes(this.host)?Wt(t,this.host):null;if(!e){this.clearHover(),this.laterHide();return}if(e===this.anchor){this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null;return}if(this.hoverAt={x:t.clientX,y:t.clientY},this.hoverEl!==e){if(this.anchor&&!this.held){this.show(e,this.pointAt(this.hoverAt),!1);return}this.clearHover(),this.hoverEl=e,this.hoverTimer=setTimeout(()=>{this.hoverTimer=null,this.hoverEl===e&&e.isConnected&&this.show(e,this.pointAt(this.hoverAt),!1)},400)}};this.onLeave=t=>{t.pointerType!=="touch"&&(this.clearHover(),this.held||this.hide())};this.onDown=t=>{if(this.eatUntil=0,this.endPress(),this.anchor&&this.hide(),this.clearHover(),t.pointerType!=="touch"||!t.isPrimary)return;let e=Wt(t,this.host);if(!e)return;let n={x:t.clientX,y:t.clientY},o=setTimeout(()=>{let s=this.press;!s||s.el!==e||!e.isConnected||(s.done=!0,this.show(e,{x:n.x,top:n.y,bottom:n.y},!0,36),this.held=!0)},500);this.press={id:t.pointerId,x:n.x,y:n.y,el:e,timer:o,done:!1}};this.onMove=t=>{let e=this.press;e&&t.pointerId===e.id&&!e.done&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>10&&this.endPress()};this.onUp=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done&&(this.eatUntil=performance.now()+700),this.endPress())};this.onCancel=t=>{let e=this.press;!e||t.pointerId!==e.id||(e.done?(this.endPress(),this.hide()):this.endPress())};this.onClick=t=>{if(!this.eatUntil)return;let e=performance.now()<this.eatUntil;this.eatUntil=0,e&&(t.stopPropagation(),t.preventDefault())};this.onContextMenu=t=>{let e=t.pointerType==="touch";(this.press||this.held&&this.anchor||e&&Wt(t,this.host))&&t.preventDefault()};this.onFocusIn=t=>{let e=Wt(t,this.host);if(!e||!e.matches(":focus-visible"))return;let n=e.getBoundingClientRect();this.show(e,{x:n.left+Math.min(n.width/2,120),top:n.top,bottom:n.bottom},!1,8)};this.onFocusOut=t=>{this.anchor&&Wt(t,this.host)===this.anchor&&!this.held&&this.hide()};this.onKey=t=>{t.key!=="Escape"||!this.anchor||(this.hide(),t.stopImmediatePropagation())};this.host=t,this.root=e}connect(){let t=this.host;window.addEventListener("pointermove",this.onHover,{passive:!0}),document.documentElement.addEventListener("pointerleave",this.onLeave),t.addEventListener("pointerdown",this.onDown,{capture:!0}),t.addEventListener("pointermove",this.onMove,{capture:!0,passive:!0}),t.addEventListener("pointerup",this.onUp,{capture:!0}),t.addEventListener("pointercancel",this.onCancel,{capture:!0}),t.addEventListener("click",this.onClick,{capture:!0}),t.addEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.addEventListener("wheel",this.hide,{passive:!0}),t.addEventListener("focusin",this.onFocusIn),t.addEventListener("focusout",this.onFocusOut),t.addEventListener("keydown",this.onKey,{capture:!0}),window.addEventListener("resize",this.hide),window.addEventListener("blur",this.hide)}disconnect(){let t=this.host;window.removeEventListener("pointermove",this.onHover),document.documentElement.removeEventListener("pointerleave",this.onLeave),t.removeEventListener("pointerdown",this.onDown,{capture:!0}),t.removeEventListener("pointermove",this.onMove,{capture:!0}),t.removeEventListener("pointerup",this.onUp,{capture:!0}),t.removeEventListener("pointercancel",this.onCancel,{capture:!0}),t.removeEventListener("click",this.onClick,{capture:!0}),t.removeEventListener("contextmenu",this.onContextMenu,{capture:!0}),t.removeEventListener("wheel",this.hide),t.removeEventListener("focusin",this.onFocusIn),t.removeEventListener("focusout",this.onFocusOut),t.removeEventListener("keydown",this.onKey,{capture:!0}),window.removeEventListener("resize",this.hide),window.removeEventListener("blur",this.hide),this.endPress(),this.hide()}get shown(){return this.anchor!==null}sync(){let t=this.anchor;t&&(!t.isConnected||!t.dataset.note?this.hide():this.tip&&this.tip.textContent!==t.dataset.note&&(this.tip.textContent=t.dataset.note))}ensureTip(){if(this.tip?.isConnected)return this.tip;let t=document.createElement("div");return t.className="note-tip",t.id="note-tip",t.setAttribute("role","tooltip"),this.root.appendChild(t),this.tip=t,t}show(t,e,n,o){let s=t.dataset.note;if(!s)return;this.clearHover(),this.hideTimer&&clearTimeout(this.hideTimer),this.hideTimer=null,this.anchor&&this.anchor!==t&&(this.anchor.removeAttribute("aria-describedby"),this.anchor.classList.remove("noting"));let r=this.ensureTip();r.textContent=s,r.classList.remove("on"),r.style.left="0px",r.style.top="0px";let a={w:r.offsetWidth,h:r.offsetHeight},c={w:window.innerWidth,h:window.innerHeight},d=xl(e,a,c,n,o);r.style.left=`${d.left}px`,r.style.top=`${d.top}px`,r.classList.toggle("above",d.above),r.classList.add("on"),t.setAttribute("aria-describedby",r.id),t.classList.add("noting"),this.anchor=t}clearHover(){this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=null,this.hoverEl=null}laterHide(){this.hideTimer||!this.anchor||this.held||(this.hideTimer=setTimeout(()=>{this.hideTimer=null,this.hide()},120))}pointAt(t){return{x:t.x,top:t.y-4,bottom:t.y+10}}endPress(){this.press&&clearTimeout(this.press.timer),this.press=null}};(()=>{if(typeof document>"u")return;let i=null,t=new Map;xo((e,n)=>{let o=`${n}|${e}`,s=t.get(o);if(s!==void 0)return s;if(!i){if(!document.body)return null;i=document.createElement("span"),i.setAttribute("aria-hidden","true"),i.style.cssText="position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;white-space:pre;letter-spacing:normal;word-spacing:normal;text-transform:none;contain:layout style",document.body.appendChild(i)}return i.style.font=n,i.style.font?(i.style.fontVariantNumeric="tabular-nums",i.textContent=e,s=i.getBoundingClientRect().width,t.size>2e4&&t.clear(),t.set(o,s),s):null})})();var Pr="mydashlight.rides.view",Zc=1100,Qc=440,ed=700,td=3*6e4,Tr=1200,nd=450,id=110;function sd(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Un=oe`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Er=oe`<svg class="note-mark" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 3h10l4 4v14H5zM9 11h6M9 15h6"/></svg>`,_r=oe`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,od=new URL("emoji.json",import.meta.url).href,Cr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Zi=oe`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Qi=oe`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,rd=oe`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,ad=oe`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,qt={bring:"Bring",buy:"Buy"};function ld(i,t){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[i];return t<=1?e:`${e}s${i==="monthly"&&t===3?" (quarterly)":i==="monthly"&&t===12?" (yearly)":""}`}function Ae(i){let t=/\p{L}|\p{N}/u.exec(i);return t?t[0].toUpperCase():"?"}function es(i){let[t,e,n]=i.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function cd(i,t){return vi(i,t)||Me(i).split(",")[0]}function dd(i){let t=i.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function hd(){try{return localStorage.getItem(Pr)==="timeline"?"timeline":"compact"}catch{return"compact"}}function ud(i){try{localStorage.setItem(Pr,i)}catch{}}function ts(i,t){return xe(i).includes(t)?pe(i,t):me(i,t)}function Yt(i){return i.days.every(t=>!t.events.length)}var Xt=class extends Ee{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.leaveTimer=null;this.holdTimer=null;this.holdRepeat=null;this.held=!1;this.railTimer=null;this.touchedAt=-1/0;this.railHeld=!1;this.drag=null;this.eatClick=!1;this.noteTip=null;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=st(location.search).view;this.urlPage=st(location.search).page;this.urlPast=st(location.search).past;this.urlDayPicker=st(location.search).daypicker;this.shownFor=null;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onScroll=()=>{this.noteTip?.hide(),this.syncDay(),(this.railShown||performance.now()-this.touchedAt<800)&&this.showRail()};this.onTouched=()=>{this.touchedAt=performance.now()};this.touchListener={handleEvent:this.onTouched,passive:!0};this.onDown=e=>{if(this.onTouched(),e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let o=e.clientX-n.x,s=e.clientY-n.y;if(!n.moved){if(Math.abs(o)+Math.abs(s)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging"),this.noteTip?.hide()}this.onTouched(),n.el.scrollTop=n.top-s,n.el.scrollLeft=n.left-o};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.noteTip?.hide(),this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},td))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor||this.forPick?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.pinDay=null,this.railShown=!1,this.away=null,this.error=null,this.mode=this.urlView??hd(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.iconMore=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null,this.forPick=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.noteTip??=new Dn(this,this.renderRoot),this.noteTip.connect(),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer,this.leaveTimer,this.railTimer])e&&clearTimeout(e);this.stopHold(),this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey),this.noteTip?.disconnect()}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){this.noteTip?.sync();let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let n=new Map(this.lunchDraft);for(let[o,s]of this.lunchDraft){let[r,a]=o.split("|"),c=e.kids.find(d=>d.id===r);(!c||(c.picks[a]??null)===s||!Kt(c,a))&&n.delete(o)}this.lunchDraft=n}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let o of e.chores)n.has(o.id)&&yt(o)===n.get(o.id)&&n.delete(o.id);for(let o of n.keys())e.chores.some(s=>s.id===o)||n.delete(o);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=To(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Zc)return!1;let e=this.plan;return!e||this.width-Qc>=fi(_e(e).length,xe(e).length)}today(){return St(this.plan?.time_zone??sd())}shownPlan(){let e=this.plan;if(!e||this.urlPast==="show")return e;let n=this.today(),o=`${n.date}|${n.minutes}`;return(this.shownFor?.plan!==e||this.shownFor.key!==o)&&(this.shownFor={plan:e,key:o,shown:Uo(e,n)}),this.shownFor.shown}currentBoard(){let e=this.shownPlan();if(!e)return null;let n=this.today(),o=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;if(this.board==null||e!==this.boardPlan||o!==this.boardKey){let s=this.board,r=this.boardPlan;this.board=$o(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=o,s&&r&&this.keepPlace(s,r,e)}return this.board}keepPlace(e,n,o){let s=this.scroller;if(!s||!this.scrolledOnce||this.keepAt!=null||e.mode!==this.mode||s.scrollTop<=0)return;let r=e.dayHeads.find(u=>u.date===this.pinDay)?.h??Ft,a=mi(e,s.scrollTop+r+4),c=n.days[Math.floor(a/1440)]?.date,d=c?o.days.findIndex(u=>u.date===c):-1;d>=0&&(this.keepAt=d*1440+(a-Math.floor(a/1440)*1440))}dayIndexOf(e){return this.boardPlan?this.boardPlan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n,o=!1){let s=this.scroller;if(!s||!this.board)return;let r=this.topFor(e,n);Math.abs(s.scrollTop-r)>=2&&(o&&!matchMedia("(prefers-reduced-motion: reduce)").matches?s.scrollTo({top:r,behavior:"smooth"}):s.scrollTop=r),this.syncDay()}topFor(e,n){let o=this.board,s=o.dayHeads.find(r=>r.date===n)?.y??0;return Math.max(s,yo(o,e)-mo(o,e)-4)}nowSpot(){let e=this.boardPlan;if(!e)return null;let n=this.today(),o=Math.max(0,this.dayIndexOf(n.date));return{t:o*1440+(this.mode==="timeline"&&o===this.dayIndexOf(n.date)?n.minutes-45:0),date:e.days[o]?.date}}scrollToNow(e=!1){let n=this.nowSpot();n&&this.scrollToTime(n.t,n.date,e)}goToDay(e,n=!1){let o=this.boardPlan;if(!o)return;let s=this.today();if(e===s.date){this.scrollToNow(n);return}let r=this.dayIndexOf(e),a=o.days[r];if(!a)return;let c=1/0;if(this.mode==="timeline"){for(let d of a.events)c=Math.min(c,d.arrive_by??d.start);for(let d of Object.values(a.drivers))for(let u of d.outings)u.start!=null&&(c=Math.min(c,u.start))}this.scrollToTime(r*1440+(Number.isFinite(c)?Math.max(0,c-30):0),e,n)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,o=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=n+1&&(o=c);this.pinDay!==o.date&&(this.pinDay=o.date);let s=null,r=this.nowSpot(),a=this.today().date;if(r){let c=n-Math.min(this.topFor(r.t,r.date),e.scrollHeight-e.clientHeight),d=c>0?"up":"down";this.board.dayHeads.some(u=>u.date===a)&&o.date!==a?s=`${d}|Today`:this.mode==="timeline"&&Math.abs(c)>e.clientHeight*.6&&(s=`${d}|${o.date===a?"Now":"Today"}`)}this.away!==s&&(this.away=s)}showRail(e=2500){this.urlDayPicker!==!1&&(this.railShown||(this.railShown=!0),this.railTimer&&clearTimeout(this.railTimer),this.railTimer=setTimeout(()=>{this.railTimer=null,this.railHeld?this.showRail(e):this.railShown=!1},e))}tapHead(e){this.goToDay(e,!0),this.showRail(4e3)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,n){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let o=!this.choreDone(e),s=new Map(this.choreDraft);s.set(e.id,o),this.choreDraft=s;try{await this.backend.setChoreDone(e.id,o,n&&n!==e.kid?n:void 0)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let c=r instanceof se?r:new se("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??yt(e)}editMenu(e,n){let o=this.lunch?.kids??[],s=wt(e,n),r=o.filter(a=>a.id===e.id||s&&wt(a,n)?.dish===s.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:n,dish:s?.dish??"",details:s?.details??"",kids:r,had:!!s,busy:!1}}async saveMenu(e=!1){let n=this.menuEdit;if(!(!n||!this.backend||!n.kids.length)){this.menuEdit={...n,busy:!0};try{await this.backend.setLunchMenu(n.kids,n.date,e?"":n.dish.trim(),e?"":n.details.trim()),this.menuEdit=null}catch(o){this.menuEdit={...n,busy:!1};let s=o instanceof se?o:new se("error",String(o));this.showToast(s.code==="preview"?s.message:`Couldn’t save that. ${s.message}`)}}}async saveLunch(e,n,o){if(!this.backend||!n.length)return;let s=new Map(this.lunchDraft);for(let r of n)s.set(An(e,r),o);this.lunchDraft=s;try{await this.backend.setLunch(e,n,o)}catch(r){let a=new Map(this.lunchDraft);for(let d of n)a.delete(An(e,d));this.lunchDraft=a;let c=r instanceof se?r:new se("error",String(r));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let n=this.chores?.kids[0]?.id;this.choreEdit=e?Do(e):Lo(this.chores?.kids.length===1&&n?[n]:[])}closeChorePanels(){this.forPick=null,this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.iconMore=!1}toggleIconMore(){this.iconMore=!this.iconMore,this.iconMore&&Promise.resolve().then(()=>($r(),kr))}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Ei(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Ro(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(n){this.choreBusy=!1;let o=n instanceof se?n:new se("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(n){this.choreBusy=!1,this.removeArmed=!1;let o=n instanceof se?n:new se("error",String(n));this.showToast(o.code==="preview"?o.message:`Couldn’t remove that. ${o.message}`)}}}setMode(e){if(e===this.mode)return;let n=this.scroller,o=this.board?.dayHeads.find(s=>s.date===this.pinDay)?.h??Ft;this.keepAt=n&&this.board?mi(this.board,n.scrollTop+o+4):null,this.mode=e,this.urlView||ud(e)}findUnplaced(e,n){return this.plan?.days.find(o=>o.date===e)?.unplaced?.find(o=>o.id===n)??null}openForPick(e,n){let o=this.findUnplaced(e,n),s=this.plan;if(!o||!s)return;this.closeEditor(),this.closeChorePanels(),this.sheet=!1;let r=new Set([..._e(s),...xe(s)]);this.forPick={day:e,id:n,placed:!1,label:`${F(o.at)} ${o.title}`,recurring:!!o.recurring,word:o.reason==="unknown"?o.word:null,fromNotes:!!o.from_notes,people:o.people.filter(a=>r.has(a)),scope:"this",busy:!1}}changeForPick(e,n,o){let s=e.who?.[o.event_id],r=s?.people??[o.own??o.kid];this.closeEditor(),this.forPick={day:n.date,id:o.id,placed:!0,label:`${F(o.start)} ${o.title}`,recurring:o.recurring,word:null,fromNotes:!!s?.from_notes,people:r,scope:"this",busy:!1}}async saveForPick(e=!1){let n=this.forPick,o=this.plan;if(!n||!o||!this.backend||!e&&!n.people.length)return;let s=e?[]:n.people;this.forPick={...n,busy:!0};try{await this.backend.setPeople(n.id,s,n.scope),this.forPick=null;let r=n.label.replace(/^\S+ /,""),a=s.map(c=>ts(o,c));this.showToast(e?`Saved. ${r} goes by the names in its title again.`:`Saved. ${r} is in ${vt(a)}’s ${a.length>1?"lanes":"lane"} now.`)}catch(r){this.forPick&&(this.forPick={...this.forPick,busy:!1});let a=r instanceof se?r:new se("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}}renderForPick(e){let n=this.plan,o=e.placed?n?.days.some(C=>C.date===e.day&&C.events.some(g=>g.id===e.id)):!!this.findUnplaced(e.day,e.id),s=f`<button type="button" class="btn" ?disabled=${e.busy} @click=${()=>this.closeChorePanels()}>Cancel</button>`;if(!n||!o&&!e.busy)return f`<div class="ed-head">
          <div class="ed-titles"><span class="ed-title">Who is this for?</span></div>
          ${s}
        </div>
        <p class="field-hint">This event is sorted now: someone changed it in Google Calendar, or it’s over.</p>`;let r=e.busy,a=C=>{this.forPick&&(this.forPick={...this.forPick,...C})},c=C=>a({people:e.people.includes(C)?e.people.filter(g=>g!==C):[...e.people,C]}),d=ke(n),u=_e(n),l=u.length>1&&u.every(C=>e.people.includes(C)),b=[...u,...xe(n)].filter(C=>e.people.includes(C)),T=b.map(C=>ts(n,C)),m=T.length<2?T.join(""):`${T.slice(0,-1).join(", ")} & ${T[T.length-1]}`,x=(C,g,I,H)=>f`<button
      type="button"
      class="who-chip"
      style="--c:${I.color};--rgb:${I.rgb}"
      aria-pressed=${e.people.includes(C)?"true":"false"}
      ?disabled=${r}
      @click=${()=>c(C)}
    >
      <span class="avatar ${H?"driver":""}" aria-hidden="true">${Ae(g)}</span>${g}
    </button>`;return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">Who is this for?</span>
          <span class="ed-meta">${Me(e.day)} · ${e.label}</span>
        </div>
        ${s}
      </div>
      ${e.word?f`<p class="field-hint">“${e.word}” isn’t anyone in the family. Pick who it’s for instead.</p>`:$}
      ${e.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${e.scope==="this"?"true":"false"} ?disabled=${r} @click=${()=>a({scope:"this"})}>
                Just ${ve(e.day)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${e.scope==="series"?"true":"false"} ?disabled=${r} @click=${()=>a({scope:"series"})}>
                Every time
              </button>
            </div>
          </div>`:$}
      <div class="field">
        <span class="field-label">Kids</span>
        <div role="group" aria-label="Kids it’s for" class="who-chips">
          ${u.map(C=>x(C,me(n,C),d.get(C)??de(0),!1))}
        </div>
        ${u.length>1?f`<button
              type="button"
              class="chip all-kids"
              aria-pressed=${l?"true":"false"}
              ?disabled=${r}
              @click=${()=>a({people:l?e.people.filter(C=>!u.includes(C)):[...u,...e.people.filter(C=>!u.includes(C))]})}
            >
              All the kids
            </button>`:$}
      </div>
      <div class="field">
        <span class="field-label">Parents</span>
        <div role="group" aria-label="Parents it’s for" class="who-chips">
          ${xe(n).map(C=>x(C,pe(n,C),bt,!0))}
        </div>
      </div>
      <p class="field-hint">
        ${b.length?f`Saved in the event’s notes as <strong>For: ${m}</strong>, so its title stays as it is. It shows in ${b.length>1?"their lanes":`${T[0]}’s lane`}${b.some(C=>u.includes(C))?", and rides are planned for the kids":""}.`:"Saved in the event’s notes, so its title stays as it is."}
      </p>
      ${e.fromNotes?f`<button type="button" class="chip clear" ?disabled=${r} @click=${()=>void this.saveForPick(!0)}>
            Go by the names in the title instead
          </button>`:$}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!b.length} @click=${()=>void this.saveForPick()}>
          ${r?"Saving to Google Calendar…":b.length?"Save":"Pick who it’s for"}
        </button>
      </div>
    `}renderForLine(e,n,o){let s=e.who?.[o.event_id];if(!s)return $;let r=s.people.map(a=>ts(e,a));return f`<span class="ed-for"
      >For ${vt(r)}<button type="button" class="ed-for-change" @click=${()=>this.changeForPick(e,n,o)}>Change</button></span
    >`}findEvent(e){let n=this.plan?.days.find(s=>s.date===e.day),o=n?.events.find(s=>s.id===e.event);return n&&o?{day:n,event:o}:null}open(e,n=!1){e&&(this.flushArrive(),this.flushLeave(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,this.leaveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),o=this.dayIndexOf(e.day);!n||o<0||this.scrollToTime(o*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.flushLeave(),this.sel=null,this.arriveDraft=void 0,this.leaveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,o){if(!this.pending){this.pending={key:e,value:n};try{await o()}catch(s){let r=s instanceof se?s:new se("error",String(s));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}finally{this.pending=null}}}setRide(e,n,o,s){if(!this.backend)return;let r=this.backend;if(e.stay&&e.drop===e.pick&&s.includes(e.drop)){s.includes(o)?this.save("both",o,()=>r.setRide(e.id,"both",o,this.scope)):this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope,!1));return}this.save(`${n}`,o,()=>r.setRide(e.id,n,o,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let o=this.backend;this.save("attending",n,()=>o.setAttending(e.id,n,this.scope))}toggleStay(e,n,o){if(!this.backend)return;let s=this.backend;if(n&&(e.drop!==o||e.pick!==o)){this.save("stay",!0,()=>s.setRide(e.id,"both",o,this.scope,!0));return}this.save("stay",n,()=>s.setStay(e.id,n,this.scope))}toggleAlong(e,n,o="drop"){if(!this.backend)return;let s=this.backend,r=o==="pick"?e.pick_along??[]:e.along,a=r.includes(n)?r.filter(c=>c!==n):[...r,n];this.save(`along-${o}`,a,()=>s.setTakeAlong(e.id,a,this.scope,o))}setTakes(e,n){if(!this.backend||(e.takes??null)===n)return;let o=this.backend;this.save("takes",n,()=>o.setTakes(e.id,n,this.scope))}nudgeArrive(e,n){let o=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,s;n<0?s=(o??e.start)-5:s=o==null||o+5>=e.start?null:o+5,this.arriveDraft=s,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Tr)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||o.event.arrive_by===e){this.arriveDraft=void 0;return}let s=this.backend,r=o.event.id,a=this.scope;this.save("arrive",e,()=>s.setArriveBy(r,e,a)).then(()=>{this.arriveDraft=void 0})}nudgeLeave(e,n){let o=this.leaveDraft!==void 0?this.leaveDraft:e.leave_by??null,s;o==null?s=n<0?Math.max(e.start+5,e.end-15):null:n<0?s=Math.max(e.start+5,o-5):s=o+5>=e.end?null:o+5,this.leaveDraft=s,this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=setTimeout(()=>this.flushLeave(),Tr)}clearLeave(){this.leaveDraft=null,this.flushLeave()}flushLeave(){this.leaveTimer&&clearTimeout(this.leaveTimer),this.leaveTimer=null;let e=this.leaveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let o=this.findEvent(n);if(!o||(o.event.leave_by??null)===e){this.leaveDraft=void 0;return}let s=this.backend,r=o.event.id,a=this.scope;this.save("leave",e,()=>s.setLeaveBy(r,e,a)).then(()=>{this.leaveDraft=void 0})}startHold(e){this.stopHold(),this.held=!1,this.holdTimer=setTimeout(()=>{this.held=!0,e(),this.holdRepeat=setInterval(e,id)},nd)}stopHold(){this.holdTimer&&clearTimeout(this.holdTimer),this.holdRepeat&&clearInterval(this.holdRepeat),this.holdTimer=this.holdRepeat=null}tapStep(e){this.held?this.held=!1:e()}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),o=this.shownPlan(),s=o?Eo(o,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?So(this.chores,this.today().minutes).filter(p=>!this.choreDone(p)):[],c=this.forPick?this.renderForPick(this.forPick):this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,d=this.forPick?"Who is this for?":this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",u=f`<aside class="panel" aria-label=${d}>
      ${c??(this.sel&&e?this.renderEditor(e):this.renderAttention(s,a))}
    </aside>`,l=this.page==="rides";return f`
      <div class="app ${r?"wide":this.width<ed?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,s,a.length)} ${l?this.renderBanner(e):$}
          <main>
            ${l?f`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?Yt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                  ${n&&o&&!Yt(o)?this.renderDayRail(o):$}
                  ${n&&this.away?this.renderBackToToday(this.away):$}
                </section>`:this.page==="lunch"?f`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit||this.forPick)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${u}`:$}
          </main>
        </div>
        ${r?u:$}
        ${this.toast?f`<div class="toast" role="status">${this.toast}</div>`:$}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,n,o){let s=n.problems+o;this.tick;let r=this.today(),a="";if(e){let p=e.time_zone,b=new Date(e.updated);this.error?a=f`<span class="bad">${Ss(this.error)} · showing the plan from ${an(b,new Date,p)}</span>`:e.status&&!e.status.ok?a=f`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${an(b,new Date,p)}</span>`:this.backend?.live||(a=`Updated ${an(b,new Date,p)}`)}let c=(p,b,T,m)=>f`
      <button type="button" class="seg-btn" title=${m} aria-pressed=${this.mode===p?"true":"false"} @click=${()=>this.setMode(p)}>
        ${T}<span class="seg-label">${b}</span>
      </button>
    `,d=(p,b,T)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===p?"true":"false"} @click=${()=>this.setPage(p)}>
        ${T}<span class="seg-label">${b}</span>
      </button>
    `,u=Pe(r.minutes),l=!!e&&Yt(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${oe`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:$}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Me(r.date)}, ${u}`}>
            <span class="hm">${u.slice(0,-3)}</span><span class="ampm">${u.slice(-2)}</span>
          </h1>
          <p class="today-line">
            ${Me(r.date)}${typeof a=="string"&&a?f`<span class="status"> · ${a}</span>`:$}
          </p>
          ${a&&typeof a!="string"?f`<p class="status">${a}</p>`:$}
        </div>
        ${e&&!l?this.renderNext(e,Co(e,r),n):$}
        <div class="controls">
          ${this.wide||l&&!o?$:f`<button type="button" class="attn-btn ${s?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${s}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?$:f`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",oe`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",oe`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${d("rides","Rides",oe`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${d("chores","Chores",oe`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?$:d("lunch","Lunch",oe`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,n,o){if(!n){let d=this.today().date,u=o.unassigned,l=o.laterUnassigned;if(u){let b=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">${u} ${u===1?"ride needs":"rides need"} a driver</span>
            <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>
          </span>`;return this.wide?f`<div class="next idle needs">${b}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(l)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-main">
            <span class="next-lead">All set for the next two days</span>
            <span class="next-stop">${l} ${l===1?"ride needs":"rides need"} a driver later this week.</span>
          </span>
        </div>`;let p=e.days.some(b=>b.date>=d&&b.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-main">
          <span class="next-lead">${p?"No more trips this week":"No trips this week"}</span>
          <span class="next-stop">${p?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
        </span>
      </div>`}let s;n.ongoing?s="On the road now":n.ahead===0?s=n.inMinutes<180?`Next trip · in ${Lt(n.inMinutes)}`:"Next trip · later today":n.ahead===1?s="Next trip · tomorrow":s=`Next trip · ${ve(n.date)}`;let r=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=f`
      <span class="next-eyebrow">${s}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Ae(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(d=>f`<span class="kid-dot" style="background:${d.color}"></span>`)}</span>
        ${n.warn?f`<span class="next-stop warn">${n.warn}</span>`:n.stop?f`<span class="next-stop">${n.stop}</span>`:$}
      </span>
    `,c=`next ${n.ongoing?"ongoing":r?"soon":""}`;return n.target?f`<button type="button" class=${c} @click=${()=>this.open(n.target)}>${a}</button>`:f`<div class=${c}>${a}</div>`}renderDayRail(e){if(this.urlDayPicker===!1||e.days.length<2)return $;let n=this.today().date,o=ke(e),s=this.railShown;return f`<div
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
        ${e.days.map(r=>{let a=bi(r),c=r.events.length,d=r.events.slice(0,4).map(l=>l.own?bt.color:o.get(l.kid)?.color??de(0).color),u=`${Me(r.date)}: ${c?`${c} ${c===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return f`<button
            type="button"
            class="rail-day ${r.date===n?"today":""} ${r.date===this.pinDay?"here":""}"
            aria-label=${u}
            aria-current=${r.date===this.pinDay?"date":"false"}
            @click=${()=>{this.goToDay(r.date,!0),this.showRail()}}
          >
            <span class="rd-wd">${r.date===n?"Today":ve(r.date)}</span>
            <span class="rd-num">${Number(r.date.slice(8))}</span>
            <span class="rd-dots" aria-hidden="true">
              ${d.length?d.map(l=>f`<span class="rd-dot" style="background:${l}"></span>`):f`<span class="rd-free">free</span>`}
            </span>
            ${a?f`<span class="rd-badge" aria-hidden="true">${a}</span>`:$}
          </button>`})}
      </nav>
    </div>`}renderBackToToday(e){let[n,o]=e.split("|");return f`<button type="button" class="back-today" @click=${()=>this.scrollToNow(!0)}>
      ${oe`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style=${n==="down"?"transform:rotate(180deg)":""}><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>`}
      <span>${o==="Now"?"Back to now":"Today"}</span>
    </button>`}renderQuiet(e){let n=_e(e),o=xe(e),s=ke(e),r=n.map(a=>me(e,a));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((a,c)=>oe`<circle cx=${50+c*30} cy="80" r="11" fill=${s.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${dd(r)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(a=>{let c=s.get(a);return f`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${Ae(me(e,a))}</span>
            <span class="qw-name">${me(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${o.map(a=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Ae(pe(e,a))}</span>
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
      ${e.allDay.length>e.inline?f`<div class="day-strip" style="padding-left:${mt}px">
            ${e.allDay.slice(e.inline).map(o=>this.renderStripChip(e,o,n))}
          </div>`:$}`}renderStripChip(e,n,o){let s=f`<span class="strip-title">${n.title}</span>${n.note?f`<span class="strip-note">${n.note}</span>`:$}${n.notes?Er:$}`,r=n.pick;return r?f`<button
          type="button"
          class="strip-chip warn plain pick"
          tabindex=${o?-1:0}
          data-note=${n.notes||$}
          aria-label=${`${n.title}: ${n.note} Pick who it’s for`}
          @click=${()=>this.openForPick(e.date,r)}
        >
          ${s}
        </button>`:f`<span
          class="strip-chip ${n.warn?"warn":""} ${n.cancelled?"skipped":""} ${n.color?"":"plain"} ${n.notes?"noted":""}"
          style=${n.color?`--c:${n.color.color};--rgb:${n.color.rgb};--ink:${n.color.ink}`:""}
          tabindex=${n.notes&&!o?0:$}
          data-note=${n.notes||$}
          >${s}</span
        >`}renderBoard(e){let n=this.sel,o=n?this.findEvent(n):null,s=new Set(o?o.event.own?[o.event.id]:o.day.events.filter(l=>!l.own&&l.event_id===o.event.event_id).map(l=>l.id):[]),r=l=>!!l&&!!n&&l.day===n.day&&s.has(l.event),a=e.dayHeads.find(l=>l.date===this.pinDay)??e.dayHeads[0],c=e.width,d=100,u=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??d-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??d})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??d+1}))].sort((l,p)=>l.z-p.z);return f`
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
          ${e.columns.map(l=>f`<div class="col-head ${l.kind}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${Ae(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0,l.w-58-l.name.length*10.6):$}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        ${a?f`<div class="pinned" aria-hidden="true" style="width:${c}px;height:${a.h}px;margin-bottom:${-a.h}px">
              ${this.renderHead(a,!0)}
            </div>`:$}
        <div class="canvas" style="width:${c}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(l=>f`<div
                class="col-bg ${l.kind}"
                style="left:${l.x}px;width:${l.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${l.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(l=>f`<div class="day-head" style="top:${l.y}px;width:${c}px;height:${l.h}px">${this.renderHead(l)}</div>`)}
          ${e.empties.map(l=>f`<span class="empty" style="top:${l.y}px">${l.text}</span>`)}
          ${e.grid.map(l=>f`<div class="grid ${l.strong?"strong":""}" style="top:${l.y}px;width:${c-60}px"></div>`)}
          ${e.hours.map(l=>f`<span class="hour" style="top:${l.y}px">${l.label}</span>`)}
          ${Re(e.bands,l=>l.key,l=>f`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Re(e.busy,l=>l.key,l=>f`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Re(e.windows,l=>l.key,l=>f`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Re(u,l=>l.x.key,l=>{if(l.t==="link"){let m=l.x;return f`<div
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
                  <span class="l1">${m.l1}</span>${m.show2?f`<span class="l2" style="-webkit-line-clamp:${m.lines2}">${m.l2}</span>`:$}
                </button>`}let p=l.x,b=p.color,T=p.skipped?`repeating-linear-gradient(135deg, rgba(${b.rgb},0.10) 0px, rgba(${b.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:p.stayed?`repeating-linear-gradient(135deg, rgba(${b.rgb},0.24) 0px, rgba(${b.rgb},0.24) 6px, rgba(${b.rgb},0.08) 6px, rgba(${b.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${b.rgb},0.15), rgba(${b.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${p.wrap?"wrap":""} ${r(p.target)?"sel":""} ${p.clash?"clash":""} ${p.skipped?"skipped":""} ${p.cut?"cut":""} ${p.event.notes?"noted":""}"
                aria-label=${p.aria}
                data-note=${p.event.notes||$}
                style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;background:${T};border-color:${p.clash?"var(--bad)":`rgba(${b.rgb},0.45)`};--c:${b.color};--rgb:${b.rgb};--ring:${b.color}"
                @click=${()=>this.open(p.target)}
              >
                ${p.event.notes?Er:$}
                <span class="top">
                  <span class="title">${p.title}</span>
                  <span class="time">${p.time}${p.inline&&p.drop?f`<span class="line tone-${p.drop.tone} inline"> · ${p.drop.text}</span>`:$}</span>
                  ${p.showDrop&&p.drop&&!p.inline?f`<span class="line tone-${p.drop.tone}">${p.drop.text}</span>`:$}
                </span>
                ${p.showPick&&p.pick?f`<span class="line tone-${p.pick.tone}">${p.pick.text}</span>`:$}
              </button>`})}
          ${Re(e.stays,l=>l.key,l=>f`<button
                type="button"
                class="stay ${l.cut?"cut":""}"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Re(e.trips,l=>l.key,l=>f`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(p=>f`<span class="kid-dot" style="background:${p}"></span>`)}</span>
                ${l.show2?f`<span class="l2">${l.l2}</span>`:$}
                ${l.stops?l.stops.map(p=>f`<span class="stop ${p.warn?"warn":""}">${p.text}</span>`):$}
                ${l.show3?f`<span class="l3">${l.l3}</span>`:$}
              </button>`)}
          ${Re(e.overlaps,l=>l.key,l=>f`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Re(e.marks,l=>l.key,l=>f`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${Re(e.folds,l=>l.key,l=>f`<div class="fold" style="top:${l.y}px;width:${c-60}px;height:${l.h}px" aria-hidden="true">
                ${pd(c-60,l.h)}
              </div>
              <span class="fold-label" style="top:${l.y+l.h/2-9}px" title="${Pe(l.from)} to ${Pe(l.to)}">${l.label}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${c-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:$}
        </div>
      </div>
    `}renderAttention(e,n){let{items:o,problems:s,later:r}=e,a=this.plan,c=s+n.length,d=this.chores,u=!!d&&!ki(d);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?$:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${u?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?f`<div class="attn-chores">${n.map(l=>this.renderChoreRow(l,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!s?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${oe`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Yt(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:$}
      ${o.map(l=>f`<div class="issue ${l.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${l.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${l.pick?f`<button type="button" class="issue-title" @click=${()=>l.pick&&this.openForPick(l.pick.day,l.pick.id)}>${l.title}</button>`:l.target?f`<button type="button" class="issue-title" @click=${()=>this.open(l.target,!0)}>${l.title}</button>`:f`<strong class="issue-title">${l.title}</strong>`}
              <span class="issue-body"
                >${l.parts?l.parts.map(p=>typeof p=="string"?p:f`<button type="button" class="issue-link" @click=${()=>this.open(p.target,!0)}>${p.text}</button>`):l.body}</span
              >
            </div>
          </div>
          ${l.suggestions.length?f`<div class="fixes">
                ${l.suggestions.map(p=>f`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(p.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${p.id}`?"Saving…":p.label}</span>
                    <span class="fix-note">${p.note}</span>
                  </button>`)}
              </div>`:$}
        </div>`)}
      ${this.wide&&a&&!Yt(a)&&this.page==="rides"?this.renderLegend():$}
    `}kidColorOf(e){let n=this.plan?ke(this.plan).get(e):void 0;if(n)return n;let o=this.lunch?.kids.findIndex(s=>s.id===e)??-1;return de(Math.max(0,o))}renderLunchChip(e,n=!1,o=1/0){let s=this.lunch,r=s?.kids.find(l=>l.id===e);if(!s||!r)return $;this.tick;let a=this.today(),c=Ho(r,a.date,a.minutes,this.lunchDraft);if(!c)return $;let d=qt[c.lunch],u=`${d} lunch ${c.when}${c.menu?`: ${c.menu}`:""}`;return n&&o<36+d.length*7.4?f`<span class="lunch-chip ${c.lunch} small icon" role="img" aria-label=${u} title=${u}
        >${c.lunch==="bring"?Zi:Qi}</span
      >`:f`<span class="lunch-chip ${c.lunch} ${n?"small":""}" title=${u}
      >${c.lunch==="bring"?Zi:Qi}<span class="lunch-chip-text"
        >${d}${n?$:` ${c.when}`}${!n&&c.menu?f`<span class="lunch-chip-menu"> · ${c.menu}</span>`:$}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return f`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let n=Oo(e),o=this.lunchMonth&&n.includes(this.lunchMonth)?this.lunchMonth:Be(e.today),s=n.indexOf(o),r=u=>{let l=n[s+u];l&&(this.lunchMonth=l)},a=e.kids.some(u=>u.id===this.lunchKid)?this.lunchKid:null,c=a?e.kids.filter(u=>u.id===a):e.kids,d=e.status&&!e.status.ok?f`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:$;return f`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${s<=0} @click=${()=>r(-1)}>
            ${oe`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Ln(o)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${s<0||s>=n.length-1} @click=${()=>r(1)}>
            ${oe`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":f`${_r} Edit menus`}
        </button>
      </div>
      ${d}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${c.length}">
        ${c.map(u=>this.renderLunchCard(e,u,o,a!==null))}
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
    </div>`}renderLunchCard(e,n,o,s){let r=this.kidColorOf(n.id),a=No(e,n,o,this.lunchDraft),c=zo(a),d=a.flat(),u=d.filter(m=>!m.outside&&!m.past&&m.lunch),l=n.days_off.filter(m=>Be(m.first)<=o&&o<=Be(m.last)),p=m=>u.filter(x=>Sn(x.date)===m),b=m=>{let x=p(m);if(!x.length)return;let C=x.every(g=>g.lunch==="bring")?"buy":"bring";this.saveLunch(n.id,x.map(g=>g.date),C)},T=u.length?`${c.bring} Bring · ${c.buy} Buy${o===Be(e.today)?" left this month":""}`:"No school days left this month";return f`<section class="chore-col lunch-card ${s?"wide":""}" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${n.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${Ae(n.name)}</span>
        <span class="ch-text">
          <span class="name">${n.name}</span>
          <span class="sub">${T}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${qt[n.default]} unless picked</span>
          ${e.kids.length<2?$:f`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${s?"Show everyone’s lunches":`Expand ${n.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=s?null:n.id}
              >
                ${s?ad:rd}${s?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${n.menu_feed&&!n.menu_feed.ok?f`<p class="field-hint bad">Couldn’t read the school menu feed${n.menu_feed.error?`: ${n.menu_feed.error}`:""}.</p>`:$}
      <div class="lunch-grid" role="grid" aria-label=${`${n.name}, ${Ln(o)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((m,x)=>f`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!p(x).length}
            aria-label=${`${p(x).every(C=>C.lunch==="bring")?"Buy":"Bring"} every ${m} left in ${Ln(o)} for ${n.name}`}
            @click=${()=>b(x)}
          >
            ${m}
          </button>`)}
        ${d.map(m=>this.renderLunchCell(n,m,s))}
      </div>
      ${l.length?f`<p class="lunch-offs">
            No school:
            ${l.map(m=>{let x=m.first<`${o}-01`?`${o}-01`:m.first,C=Be(m.last)>o?xt(`${Ai(o)}-01`,-1):m.last;return`${x===C?es(x):`${es(x)}–${es(C)}`} ${jo(m.title)}`}).join(" · ")}
          </p>`:$}
    </section>`}renderLunchCell(e,n,o=!1){if(n.outside)return f`<span class="lunch-day outside" aria-hidden="true"></span>`;if(n.off!==null||!n.lunch)return f`<span class="lunch-day off ${n.today?"today":""}" title=${n.off??""}>
        <span class="lunch-num">${n.day}</span><span class="lunch-word">No school</span>
      </span>`;let s=n.lunch,r=s==="buy"?"bring":"buy",a=n.menu?`, ${n.menu}`:"",c=this.menuMode,d=this.menuEdit?.date===n.date&&this.menuEdit.kids.includes(e.id),u=c?`${e.name}, ${Me(n.date)}${a||", no menu yet"}. Tap to ${n.menu?"change":"add"} the menu.`:`${e.name}, ${Me(n.date)}: ${qt[s]}${n.picked?"":" (not picked yet)"}${a}. Tap to ${qt[r]}.`;return f`<button
      type="button"
      class="lunch-day ${s} ${n.picked?"picked":"unpicked"} ${n.past?"past":""} ${n.today?"today":""} ${c?"editing":""} ${d?"sel":""}"
      ?disabled=${n.past&&!c}
      aria-label=${u}
      @click=${()=>c?this.editMenu(e,n.date):void this.saveLunch(e.id,[n.date],r)}
    >
      <span class="lunch-num">${n.day}</span>
      <span class="lunch-word">${s==="bring"?Zi:Qi}${qt[s]}</span>
      ${n.menu?f`<span class="lunch-menu">${n.menu}</span>${o&&n.sides?f`<span class="lunch-sides">${n.sides}</span>`:$}`:c?f`<span class="lunch-menu add">${Un} Menu</span>`:$}
    </button>`}renderChoreRow(e,n=!1){let o=this.chores,s=this.choreDone(e),r=o.kids.findIndex(C=>C.id===e.kid),a=(this.plan?ke(this.plan).get(e.kid):void 0)??de(Math.max(0,r)),c=o.kids[r]?.name??"",d=s===yt(e)?e:{...e,state:s?"done":"open",done_at:s?new Date().toISOString():null},u=s&&d.done_by&&d.done_by!==e.kid?o.people?.find(C=>C.id===d.done_by)?.name??d.done_by_name??null:null,l=`${wi(d,o.today,o.time_zone)}${u?` · by ${u}`:""}`,p=s||Mo(e),b=`${n?`${c}: `:""}${e.title}. ${l?`${l}. `:""}${s?"Done. Tap to undo.":"Tap when it’s done."}`,T=f`<span class="box" aria-hidden="true"
        >${s?oe`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:$}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:$}
      <span class="chore-text">
        <span class="chore-title">${n?f`<span class="chore-kid">${c}</span> · `:$}${e.title}</span>
        ${l?f`<span class="chore-note">${l}</span>`:$}
      </span>`,m=`chore ${s?"done":""} ${e.state==="overdue"&&!s?"overdue":""} ${p?"":"later"}`,x=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return p?f`<button type="button" class=${m} style=${x} aria-pressed=${s?"true":"false"} aria-label=${b} @click=${()=>this.tapChore(e)}>
          ${T}
        </button>`:f`<div class=${m} style=${x}>${T}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return f`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return f`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(ki(e))return f`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Un} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;let n=e.templates.filter(r=>r.problems.length),o=n.length?f`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${n.length===1?"1 chore needs setting up":`${n.length} chores need setting up`}</h3>
          <div class="setup-list">${n.map(r=>this.renderTemplateRow(r))}</div>
        </section>`:$;this.tick;let s=Ao(e,this.plan?ke(this.plan):void 0,this.today().minutes);return f`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Un} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${_r} Manage chores</button>
      </div>
      ${o}
      <div class="chore-cols" style="--n:${s.length}">
        ${s.map(r=>{let a=r.overdue.filter(c=>!this.choreDone(c)).length+r.now.filter(c=>!this.choreDone(c)).length;return f`<section class="chore-col" style="--c:${r.color.color};--rgb:${r.color.rgb}" aria-label=${`${r.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Ae(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub">${a?`${a} to do`:r.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(r.kid)}
            </div>
            ${r.overdue.length?f`<h3 class="chore-group overdue">Missed</h3>
                  ${r.overdue.map(c=>this.renderChoreRow(c))}`:$}
            ${r.now.length?f`<h3 class="chore-group">To do</h3>
                  ${r.now.map(c=>this.renderChoreRow(c))}`:$}
            ${r.done.length?f`<h3 class="chore-group">Done</h3>
                  ${r.done.map(c=>this.renderChoreRow(c))}`:$}
            ${r.later.map(c=>f`<h3 class="chore-group">${c.date===e.today?"Later today":cd(c.date,e.today)}</h3>
                ${c.chores.map(d=>this.renderChoreRow(d))}`)}
            ${!r.overdue.length&&!r.now.length&&!r.done.length&&!r.later.length?f`<p class="chore-none">No chores this week.</p>`:$}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let o=this.chores.kids,s=this.plan?ke(this.plan):void 0,r=this.choreEdit?.template===e.id,a=e.problems.length?f`<span class="tmpl-note bad">${e.problems.map(Mi).join(" · ")} · tap to set up</span>`:f`<span class="tmpl-note">${Pi(e.who,o,e.take_turns)} · ${Ci(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return f`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${r?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?f` <span class="tag-paused">Paused</span>`:$}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let d=o.findIndex(l=>l.id===c),u=s?.get(c)??de(Math.max(0,d));return f`<span class="kid-dot" style="background:${u.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let n=[["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["school","School days"]];return f`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Un} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?n.map(([o,s])=>{let r=e.templates.filter(a=>a.repeats===o);return r.length?f`<section class="manage-group" aria-label=${s}>
                  <h3 class="chore-group">${s}</h3>
                  <div class="tmpl-list">${r.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:$}):f`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let n=this.chores;if(!n)return f``;let o=n.kids,s=this.plan?ke(this.plan):void 0,r=this.choreBusy,a=e.template?n.templates.find(m=>m.id===e.template):void 0,c=Ei(e),d=(a?.problems??[]).filter(m=>m!=="who:"),u=(m,x,C,g=!1)=>f`<button type="button" class="choice ${g?"wide":""}" aria-pressed=${m?"true":"false"} ?disabled=${r} @click=${C}>${x}</button>`,l=(m,x,C,g)=>f`<button type="button" class="chip" aria-pressed=${m?"true":"false"} aria-label=${g??$} ?disabled=${r} @click=${C}>${x}</button>`,p=m=>{m!==e.repeats&&this.changeDraft({repeats:m,days:a&&a.repeats===m?a.days??Mn(m):Mn(m)})},b=m=>{let x=e.who.includes(m)?e.who.filter(C=>C!==m):o.filter(C=>C.id===m||e.who.includes(C.id)).map(C=>C.id);this.changeDraft({who:x})},T;if(e.repeats==="school"){let m=e.days===it?new Set:e.days===""?new Set([0,1,2,3,4]):$i(e.days)??new Set,x=C=>{let g=new Set(m);g.has(C)?g.delete(C):g.add(C),this.changeDraft({days:g.size===5?"":g.size?Ti(g):it})};T=f`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${nt.slice(0,5).map((C,g)=>l(m.has(g),C.slice(0,2),()=>x(g),C))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${u(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${u(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${u(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let m=e.days.trim(),x=/^\d+$/.test(m)?Number(m):null,C=m&&m.toLowerCase()!=="any"&&m.toLowerCase()!=="last"&&x===null;T=f`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${C?4:3}, minmax(0, 1fr))">
          ${u(m===""||m.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${u(x!==null,"On a date",()=>this.changeDraft({days:String(x??1)}))}
          ${u(m.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${C?u(!0,m,()=>{}):$}
        </div>
        ${x!==null?f`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${r||x<=1} @click=${()=>this.changeDraft({days:String(x-1)})}>−</button>
                <span class="arrive-value">${_i(x)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${r||x>=31} @click=${()=>this.changeDraft({days:String(x+1)})}>+</button>
              </span>
            </div>`:f`<p class="field-hint">${m.toLowerCase()==="last"?"Due on the month’s last day.":C?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else if(e.repeats==="daily")T=f`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;else{let m=e.days===""||e.days.toLowerCase()==="any",x=e.days===it?new Set:m?new Set:$i(e.days)??new Set,C=g=>{let I=new Set(x);I.has(g)?I.delete(g):I.add(g),this.changeDraft({days:I.size?Ti(I)||"Mon-Sun":it})};T=f`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${u(m,"Any day that week",()=>this.changeDraft({days:"Any"}))}
          ${u(!m,"On set days",()=>this.changeDraft({days:m?"Sat":e.days}))}
        </div>
        ${m?f`<p class="field-hint">Shows all week, due on Sunday.</p>`:f`<div role="group" aria-label="Days of the week" class="day-chips">
                ${nt.map((g,I)=>l(x.has(I),g.slice(0,2),()=>C(I),g))}
              </div>
              <div class="chips">
                ${l(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
                ${l(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`}return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:$}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Pi(e.who,o,e.take_turns):"Nobody yet"} · ${e.days===it?"No days picked":Ci(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${r} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${d.length?f`<p class="field-hint bad">${d.map(Mi).join(". ")}. Saving fixes it.</p>`:$}
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
          @input=${m=>this.changeDraft({title:m.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${Cr.map(m=>l(e.icon===m,m,()=>this.changeDraft({icon:e.icon===m?null:m}),`Picture ${m}`))}
          ${e.icon&&!Cr.includes(e.icon)?l(!0,e.icon,()=>this.changeDraft({icon:null}),`Picture ${e.icon}`):$}
          <button type="button" class="chip more" aria-pressed=${this.iconMore?"true":"false"} aria-expanded=${this.iconMore?"true":"false"} ?disabled=${r} @click=${()=>this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore?f`<emoji-picker
              class="emoji-more"
              .dataSource=${od}
              @emoji-click=${m=>{let x=m.detail.unicode;x&&this.changeDraft({icon:x}),this.iconMore=!1}}
            ></emoji-picker>`:$}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${o.map((m,x)=>{let C=s?.get(m.id)??de(x),g=e.who.includes(m.id);return f`<button type="button" class="who-chip" style="--c:${C.color};--rgb:${C.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${r} @click=${()=>b(m.id)}>
              <span class="avatar" aria-hidden="true">${Ae(m.name)}</span>${m.name}
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
          ${u(e.repeats==="daily","Every day",()=>p("daily"))}
          ${u(e.repeats==="weekly","Every week",()=>p("weekly"))}
          ${u(e.repeats==="monthly","Every month",()=>p("monthly"))}
          ${u(e.repeats==="school","School days",()=>p("school"))}
        </div>
      </div>
      ${T}
      ${e.repeats==="school"?$:f`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${r||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${r||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
        <span class="field-label every-unit">${ld(e.repeats,e.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${r}
          @input=${m=>this.changeDraft({details:m.target.value})}
        ></textarea>
      </div>
      ${e.template?f`<div class="field">
              ${u(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${r} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:$}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${r||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${r?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let n=this.lunch;if(!n)return f``;let o=e.busy,s=u=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...u})},r=u=>s({kids:e.kids.includes(u)?e.kids.filter(l=>l!==u):[...e.kids,u]}),a=n.kids.filter(u=>Kt(u,e.date)),c=e.dish.trim(),d=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${Me(e.date)}</span>
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
          @input=${u=>s({dish:u.target.value})}
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
          @input=${u=>s({details:u.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${a.map(u=>{let l=this.kidColorOf(u.id),p=e.kids.includes(u.id);return f`<button type="button" class="who-chip" style="--c:${l.color};--rgb:${l.rgb}" aria-pressed=${p?"true":"false"} ?disabled=${o} @click=${()=>r(u.id)}>
              <span class="avatar" aria-hidden="true">${Ae(u.name)}</span>${u.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?f`<button type="button" class="chip clear remove" ?disabled=${o||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:$}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!d} @click=${()=>void this.saveMenu()}>
          ${o?"Saving to Google Calendar…":d??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let n=this.chores;if(!n)return f``;let o=n.people?.length?n.people:n.kids.map(l=>({...l,role:"kid"})),s=n.kids.findIndex(l=>l.id===e.kid),r=n.kids[s],a=this.plan?ke(this.plan):void 0,c=a?.get(e.kid)??de(Math.max(0,s)),d=o.filter(l=>l.id!==e.kid),u=l=>{let p=n.kids.findIndex(b=>b.id===l.id);return p>=0?(a?.get(l.id)??de(p)).color:"var(--dark)"};return f`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?f`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:$}${e.title}</span>
          <span class="ed-meta">${r?.name??""} · ${wi(e,n.today,n.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${Ae(r?.name??"?")}</span>
          <span>${r?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?f`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${d.map(l=>f`<button type="button" class="done-by" style="--c:${u(l)}" @click=${()=>void this.toggleChore(e,l.id)}>
                  <span class="avatar ${l.role==="parent"?"driver":""}" aria-hidden="true">${Ae(l.name)}</span>
                  <span>${l.name}</span>
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
    </div>`}ownHint(e,n){let o=Pn(e,n);if(n.takes!=null){let r=n.planned!=null?`It’s fitted in at ${F(n.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${n.takes} min any time from ${F(n.start)} to ${F(n.end)}. ${r}, around ${o}’s other trips. Errands go alone.`}let s=n.along.map(r=>xe(e).includes(r)?pe(e,r):me(e,r));return`${o} drives there and back${s.length?`, with ${vt(s)}`:""}.`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return f``;let{day:o,event:s}=n,r=xe(e),a=vo(e,s),c=Pn(e,s),d=!!this.pending,u=N=>this.pending?.key===N?this.pending.value:void 0,l=[...e.people?.carpools??[]];for(let N of e.days)for(let h of N.events)for(let v of[h.drop,h.pick])v&&v!=="none"&&!r.includes(v)&&!l.some(E=>E.toLowerCase()===v.toLowerCase())&&l.push(v);let p=N=>{if(!s.sides.includes(N))return $;let h=u(N)??u("both"),v=N==="drop"?s.drop:s.pick,E=h!==void 0?String(h):s.no_ride_unless_named&&v==="none"?"":v,_=E===""&&!(h===void 0&&s.no_ride_unless_named),B=E&&E!=="none"&&!r.includes(E)?E:"",j=ee=>{this.otherOpen=null,this.setRide(s,N,E===ee?"":ee,r)},L=[...r.map(ee=>[ee,gi(e,ee)]),["none","Not needed"]],J=`${s.id}|${N}`,U=this.otherOpen===J;return f`<div class="field ride-box">
        <span class="field-label">${N==="drop"?"Drop-off":"Pick-up"} ${_?f`<span class="nobody">· nobody yet</span>`:$}</span>
        <div role="group" aria-label=${N==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${L.length+1}, minmax(0, 1fr))">
          ${L.map(([ee,Ce])=>f`<button type="button" class="choice" aria-pressed=${E===ee?"true":"false"} ?disabled=${d} @click=${()=>j(ee)}>
                ${Ce}
              </button>`)}
          <button
            type="button"
            class="choice"
            aria-pressed=${B?"true":"false"}
            aria-expanded=${U?"true":"false"}
            ?disabled=${d}
            @click=${()=>this.otherOpen=U?null:J}
          >
            ${B||"Other"}
          </button>
        </div>
        ${U?f`${l.length?f`<div role="group" aria-label=${N==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${l.map(ee=>f`<button type="button" class="chip" aria-pressed=${E.toLowerCase()===ee.toLowerCase()?"true":"false"} ?disabled=${d} @click=${()=>j(ee)}>
                    ${ee}
                  </button>`)}
            </div>`:$}
        <input
          type="text"
          .value=${B&&!l.some(ee=>ee.toLowerCase()===B.toLowerCase())?B:""}
          ?disabled=${d}
          aria-label=${N==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${ee=>{let Ce=ee.target.value.trim();Ce&&Ce!==E&&j(Ce)}}
          @keydown=${ee=>{ee.key==="Enter"&&ee.target.blur()}}
        />`:$}
        ${!C&&E!==""&&E!=="none"?b(N,E):$}
      </div>`},b=(N,h)=>{let v=u(`along-${N}`),E=v!==void 0?v:N==="pick"?s.pick_along??[]:s.along,_=new Set(o.events.filter(L=>L.event_id===s.event_id&&!L.own).map(L=>L.kid)),B=[..._e(e).filter(L=>L!==s.kid&&!_.has(L)),...r.filter(L=>L!==h)];return B.length?f`<div class="field-sub">
        <span class="field-label">${N==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${N==="pick"?"Coming home too. Anyone already there just gets in.":N==="both"?"In the car there and back.":"In the car too, from home unless they’re already out."}</span></span>
        <div role="group" aria-label=${N==="drop"?"Riding along on the drop-off":N==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${B.map(L=>f`<button type="button" class="chip" aria-pressed=${E.includes(L)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(s,L,N)}>
              ${r.includes(L)?pe(e,L):me(e,L)}
            </button>`)}
        </div>
      </div>`:$},T=r.includes(s.drop)?s.drop:r.includes(s.pick)?s.pick:"",m=s.drop===s.pick&&r.includes(s.drop),x=u("stay"),C=x!==void 0?!!x:s.stay&&m,g=u("along"),I=g!==void 0?g:s.along,H=s.own?[..._e(e),...r.filter(N=>N!==s.own)]:[],V=s.own!=null&&s.takes!=null,ue=s.own!=null&&!V,w=u("takes"),k=w!==void 0?w:s.takes??null,y=u("arrive"),P=this.arriveDraft!==void 0?this.arriveDraft:y!==void 0?y:s.arrive_by,M=u("leave"),S=this.leaveDraft!==void 0?this.leaveDraft:M!==void 0?M:s.leave_by??null,O=(N,h)=>{let v=N==="arrive",E=B=>()=>v?this.nudgeArrive(s,B):this.nudgeLeave(s,B),_=(B,j,L,J)=>f`<button
          type="button"
          class="step"
          aria-label=${j}
          ?disabled=${d||J}
          @pointerdown=${()=>this.startHold(E(B))}
          @pointerup=${()=>this.stopHold()}
          @pointerleave=${()=>this.stopHold()}
          @pointercancel=${()=>this.stopHold()}
          @click=${()=>this.tapStep(E(B))}
        >
          ${L}
        </button>`;return f`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">${v?"Arrive by":"Leave by"}</span>
          <span class="field-hint">${v?`${s.start-h} min before it starts`:`${s.end-h} min before it ends`}</span>
        </span>
        <span class="stepper">
          ${_(-5,"Five minutes earlier","−",!v&&h-5<=s.start)}
          <span class="arrive-value">${F(h)}</span>
          ${_(5,"Five minutes later","+",!1)}
          <button
            type="button"
            class="step clear-time"
            aria-label=${v?"Clear arrive-by time":"Clear leave-by time"}
            ?disabled=${d}
            @click=${()=>v?this.clearArrive():this.clearLeave()}
          >
            ×
          </button>
        </span>
      </div>`},W=s.sides.includes("pick")||s.own!=null,X=()=>f`${P!=null?O("arrive",P):$}
      ${S!=null?O("leave",S):$}
      ${P==null||S==null&&W?f`<div class="field time-chips">
            <div role="group" aria-label="Times" class="chips">
              ${P==null?f`<button type="button" class="chip" ?disabled=${d} @click=${()=>this.nudgeArrive(s,-5)}>Arrive early</button>`:$}
              ${S==null&&W?f`<button type="button" class="chip" ?disabled=${d} @click=${()=>this.nudgeLeave(s,-5)}>Leave early</button>`:$}
            </div>
          </div>`:$}`,Z=s.sides.includes("drop")&&s.sides.includes("pick"),z=Z&&(C||this.stayDraft===s.id),Y=()=>{let N=Z?f`<div class="field">
            <span class="field-label">Ride</span>
            <div role="group" aria-label="Stay or not" class="choices" style="grid-template-columns:1fr 1fr">
            <button
              type="button"
              class="choice"
              aria-pressed=${z?"false":"true"}
              ?disabled=${d}
              @click=${()=>{this.stayDraft=null,s.stay&&this.toggleStay(s,!1,T)}}
            >
              Drop off, pick up
            </button>
            <button
              type="button"
              class="choice"
              aria-pressed=${z?"true":"false"}
              ?disabled=${d}
              @click=${()=>{T?this.toggleStay(s,!0,T):this.stayDraft=s.id}}
            >
              Stays the whole time
            </button>
          </div>
          </div>`:$;if(!z)return f`${N} ${p("drop")} ${p("pick")}`;let h=C&&m?s.drop:"";return f`${N}
        <div class="field ride-box">
          <span class="field-label">Drop-off and pick-up ${h?$:f`<span class="nobody">· nobody yet</span>`}</span>
          <div role="group" aria-label="Driver, both ways" class="choices" style="grid-template-columns:repeat(${r.length}, minmax(0, 1fr))">
            ${r.map(v=>f`<button
                type="button"
                class="choice"
                aria-pressed=${h===v?"true":"false"}
                ?disabled=${d}
                @click=${()=>{if(h===v||!this.backend)return;let E=this.backend;this.stayDraft=null,this.save("stay",!0,()=>E.setRide(s.id,"both",v,this.scope,!0))}}
              >
                ${pe(e,v)}
              </button>`)}
          </div>
          ${h?b("both",h):$}
        </div>`},Q=[],Se=N=>N==="none"?"Not needed":gi(e,N),Ne=N=>r.includes(N)?pe(e,N):me(e,N),$e=(N,h,v)=>{h===""&&!v.length||Q.push(`${N}: ${[h===""?"TBD":Se(h),...v.map(Ne)].join(", ")}`)},le=N=>s.no_ride_unless_named&&N==="none"?"":N;s.own||$e("Drop-off",le(s.drop),s.along),s.own||$e("Pick-up",le(s.pick),s.pick_along??[]),!s.own&&s.stay&&Q.push("Stay: yes"),V&&Q.push(`Takes: ${s.takes} min`),s.own&&s.along.length&&Q.push(`Take along: ${s.along.map(Ne).join(", ")}`),s.arrive_by!=null&&Q.push(`Arrive by: ${Pe(s.arrive_by)}`),s.leave_by!=null&&Q.push(`Leave by: ${Pe(s.leave_by)}`);let ie=u("attending"),fe=ie!==void 0?!!ie:s.attending!==!1;s.attending===!1&&Q.splice(0,Q.length,"Attending: no");let we=o.date===this.today().date?"":`${ve(o.date)} · `,dt=Cn(s),Fe=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${c} · ${s.title}</span>
          <span class="ed-meta">${we}${V?"any time ":""}${dt}${s.place_name&&!s.place.startsWith("?")?` · ${s.place_name}`:""}</span>
          ${this.renderForLine(e,o,s)}
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;if(s.busy_only){let N=s.place_name&&s.place_name!==s.title?s.place_name:"",h=s.busy_why==="days"?"It runs over more than a day, so no drive is planned for it.":s.busy_why==="home"?"It’s at home, so no drive is planned for it.":"It has no address, so no drive is planned for it.";return f`${Fe}
        ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:$}
        ${N?f`<div class="field"><span class="field-label">Where</span><span class="field-hint">${N}</span></div>`:$}
        <p class="field-hint">
          ${fe?`This blocks ${c}’s time: ${c} can’t drive then, so a ride that needs ${c} shows as a problem.`:`Not going, so it doesn’t block ${c}’s time, and ${c} can drive then.`}
          ${h}
        </p>
        <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setAttending(s,!fe)}>
          ${fe?`${c} isn’t going this time`:`${c} is going after all`}
        </button>
        ${s.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:$}
        <details class="notes">
          <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
          <span class="notes-body">--- Rides ---\n${s.attending===!1?"Attending: no":"(nothing yet)"}</span>
        </details>`}return s.where==="home"?f`${Fe}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${Fe}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:$}
      ${s.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ve(o.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:$}
      ${fe?f`${s.where==="anywhere"?f`<p class="field-hint">
                  ${s.no_ride_unless_named?"No address, so it can happen anywhere and needs no ride. Pick a driver if it does.":"No address, so the drive time is a guess. Add the place to the event in Google Calendar for the real one."}
                </p>`:$}
            ${s.own?f`<p class="field-hint">${this.ownHint(e,s)}</p>`:Y()}
      ${s.own?f`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${k!=null?`Takes ${k} min, any time ${F(s.start)}–${F(s.end)}`:"At its set time"}</span>
            </span>
            ${k!=null?f`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${d||k<=5} @click=${()=>this.setTakes(s,Math.max(5,k-5))}>−</button>
                  <span class="arrive-value">${k} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${d||k+5>s.end-s.start} @click=${()=>this.setTakes(s,k+5)}>+</button>
                </span>`:$}
          </div>
          <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setTakes(s,k!=null?null:Math.min(10,Math.max(5,s.end-s.start)))}>
            ${k!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:$}
      ${ue&&H.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${H.map(N=>f`<button type="button" class="chip" aria-pressed=${I.includes(N)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(s,N)}>
                  ${r.includes(N)?pe(e,N):me(e,N)}
                </button>`)}
            </div>
          </div>`:$}
      ${V?$:X()}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its ride settings stay saved, so they all come back when ${c} is going again.
          </p>`}
      <button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.setAttending(s,!fe)}>
        ${fe?`${c} isn’t going this time`:`${c} is going after all`}
      </button>
      ${s.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${s.problems.join("; ")}</p>`:$}
      <details class="notes">
        <summary class="notes-label">${this.backend?.saves===!1?"What would be saved":"What’s saved"} in the event’s notes</summary>
        <span class="notes-body">--- Rides ---\n${Q.length?Q.join(`
`):"(no ride lines yet)"}</span>
      </details>
      ${fe&&!s.own?f`<p class="field-hint">Tap a selected driver again to clear it.</p>`:$}
    `}};Xt.styles=Fo,Xt.properties={backend:{attribute:!1},pinDay:{state:!0},railShown:{state:!0},away:{state:!0},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},leaveDraft:{state:!0},otherOpen:{state:!0},stayDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},iconMore:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0},forPick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Xt);function pd(i,t){let o=Math.max(1,Math.round(i/14)),s=i/o,r=[],a=[];for(let d=0;d<=o;d++){let u=+(d*s).toFixed(1);r.push(`${u},${d%2?5:0}`),a.push(`${u},${t-(d%2?0:5)}`)}let c=`M${r.join(" L")} L${[...a].reverse().join(" L")} Z`;return f`<svg width=${i} height=${t} viewBox="0 0 ${i} ${t}">
    ${oe`<path class="fold-fill" d=${c}></path>
      <path class="fold-edge" d=${`M${r.join(" L")}`}></path>
      <path class="fold-edge" d=${`M${a.join(" L")}`}></path>`}
  </svg>`}function fd(){let i=[document];for(let t of document.querySelectorAll("*"))t.shadowRoot&&i.push(t.shadowRoot);return i}function Mr(i=3e3){let t=new CSSStyleSheet;t.replaceSync("*, *::before, *::after { cursor: none !important; }"),t.disabled=!0;let e,n=s=>{if(s)for(let r of fd())r.adoptedStyleSheets.includes(t)||(r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]);t.disabled=!s},o=s=>{if(clearTimeout(e),s.pointerType==="touch"){n(!0);return}n(!1),e=setTimeout(()=>n(!0),i)};window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerdown",o,{passive:!0}),e=setTimeout(()=>n(!0),i)}function Ar(i){try{return new URL(i).searchParams.get("v")}catch{return null}}function Sr(i,t,e){if(!t)return()=>{};let n=e.everyMs??6e5,o=e.retryMs??3e4,s=e.idleMs??12e4,r=null,a=null,c=0,d=!1,u=T=>{if(d||a)return;let m=e.idleFor();if(m>=s){e.reload(T);return}a=setTimeout(()=>{a=null,u(T)},s-m)},l=async()=>{try{let T=await i.sendMessagePromise({type:"mydashlight/app_version"});c=0;let m=T["kiosk.js"];!d&&m&&m!==t&&u(m)}catch{if(d||r||++c>20)return;r=setTimeout(()=>{r=null,l()},o)}},p=()=>{c=0,l()};i.addEventListener?.("ready",p);let b=setInterval(()=>void l(),n);return()=>{d=!0,clearInterval(b),r&&clearTimeout(r),a&&clearTimeout(a),i.removeEventListener?.("ready",p)}}function Lr(i,t=6e4,e=15e3){let n=null,o=setInterval(()=>{if(!i.connected||n)return;let s=!1;n=setTimeout(()=>{n=null,!s&&i.connected&&i.reconnect(!0)},e);let r=()=>{s=!0,n&&clearTimeout(n),n=null};i.ping().then(r,r)},t);return()=>{clearInterval(o),n&&clearTimeout(n),n=null}}var Dr=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],Rr=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Ir(i,t,e,n){let o=Math.max(0,Math.min(t,i.length)),s=Math.max(o,Math.min(e,i.length));return{value:i.slice(0,o)+n+i.slice(s),caret:o+n.length}}function Br(i,t,e){let n=Math.max(0,Math.min(t,i.length)),o=Math.max(n,Math.min(e,i.length));if(n!==o)return{value:i.slice(0,n)+i.slice(o),caret:n};if(n===0)return{value:i,caret:0};let s=Array.from(i.slice(0,n));s.pop();let r=s.join("");return{value:r+i.slice(n),caret:r.length}}function Or(i,t){return t===0||/\s$/.test(i.slice(0,t))}var gd=new Set(["text","search","email","url","tel","number","password"]);function Nr(i){return i instanceof HTMLTextAreaElement?!i.readOnly&&!i.disabled:i instanceof HTMLInputElement&&gd.has(i.type)&&!i.readOnly&&!i.disabled}var md={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},bd={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Jt=class extends Ee{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,o=e.selectionEnd;if(n!==null&&o!==null)return[n,o]}catch{}return[e.value.length,e.value.length]}apply(e,n,o){e.value=n;try{e.setSelectionRange(o,o)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=Or(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[o,s]=this.selection(n),r=Br(n.value,o,s);this.apply(n,r.value,r.caret);break}default:{let o=e==="space"?" ":this.shift?e.toUpperCase():e,[s,r]=this.selection(n),a=Ir(n.value,s,r,o);this.apply(n,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,o=e==="layout"?this.layout==="letters"?"123":"ABC":md[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${bd[e]??o}
      aria-pressed=${e==="shift"?String(this.shift):$}
      @click=${()=>this.press(e)}
    >
      ${o}
    </button>`}render(){let e=this.layout==="letters"?Dr:Rr;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>f`<div class="row">${n.map(o=>this.key(o))}</div>`)}
      </div>`}};Jt.styles=Ye`
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
  `,Jt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Jt);function vd(){let i=document.activeElement;for(;i?.shadowRoot?.activeElement;)i=i.shadowRoot.activeElement;return i}function jr(i){let t=new WeakSet,e=r=>{let a=r.composedPath();s(a);let c=a[0];Nr(c)&&i.attach(c)},n=()=>{setTimeout(()=>{let r=vd();!i.target||r===i.target||(Nr(r)?i.attach(r):i.detach())},0)},o=r=>{t.has(r)||(t.add(r),r.addEventListener("focusin",e),r.addEventListener("focusout",n))},s=r=>{for(let a of r)a instanceof ShadowRoot&&o(a)};o(document),document.addEventListener("pointerdown",r=>s(r.composedPath()),{capture:!0}),setInterval(()=>{i.target&&!i.target.isConnected&&i.detach()},1e3)}var ns="mydashlight",yd=`/api/${ns}/pair`,xd=`/api/${ns}/pair/poll`,is=`/${ns}`,ss="pair";function zr(i){return i.length>4?`${i.slice(0,4)}-${i.slice(4)}`:i}function Hr(i,t){return`${i}${is}?${ss}=${encodeURIComponent(t)}`}function wd(i,t,e=Date.now()){return{hassUrl:i,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var ct=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function Ur(i=fetch){let t=await i(yd,{method:"POST",cache:"no-store"});if(t.status===429)throw new ct("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new ct(`Home Assistant answered ${t.status}.`);return await t.json()}async function Fr(i,t,e=fetch){let n=await e(xd,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:i})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new ct(`Home Assistant answered ${n.status}.`);let o=await n.json();return o.status==="paired"&&o.auth?{status:"paired",auth:wd(t,o.auth)}:{status:"pending"}}var _t=function(i,t){let o=i,s=Zt[t],r=null,a=0,c=null,d=[],u={},l=function(w,k){a=o*4+17,r=(function(y){let P=new Array(y);for(let M=0;M<y;M+=1){P[M]=new Array(y);for(let S=0;S<y;S+=1)P[M][S]=null}return P})(a),p(0,0),p(a-7,0),p(0,a-7),m(),T(),C(w,k),o>=7&&x(w),c==null&&(c=H(o,s,d)),g(c,k)},p=function(w,k){for(let y=-1;y<=7;y+=1)if(!(w+y<=-1||a<=w+y))for(let P=-1;P<=7;P+=1)k+P<=-1||a<=k+P||(0<=y&&y<=6&&(P==0||P==6)||0<=P&&P<=6&&(y==0||y==6)||2<=y&&y<=4&&2<=P&&P<=4?r[w+y][k+P]=!0:r[w+y][k+P]=!1)},b=function(){let w=0,k=0;for(let y=0;y<8;y+=1){l(!0,y);let P=Ve.getLostPoint(u);(y==0||w>P)&&(w=P,k=y)}return k},T=function(){for(let w=8;w<a-8;w+=1)r[w][6]==null&&(r[w][6]=w%2==0);for(let w=8;w<a-8;w+=1)r[6][w]==null&&(r[6][w]=w%2==0)},m=function(){let w=Ve.getPatternPosition(o);for(let k=0;k<w.length;k+=1)for(let y=0;y<w.length;y+=1){let P=w[k],M=w[y];if(r[P][M]==null)for(let S=-2;S<=2;S+=1)for(let O=-2;O<=2;O+=1)S==-2||S==2||O==-2||O==2||S==0&&O==0?r[P+S][M+O]=!0:r[P+S][M+O]=!1}},x=function(w){let k=Ve.getBCHTypeNumber(o);for(let y=0;y<18;y+=1){let P=!w&&(k>>y&1)==1;r[Math.floor(y/3)][y%3+a-8-3]=P}for(let y=0;y<18;y+=1){let P=!w&&(k>>y&1)==1;r[y%3+a-8-3][Math.floor(y/3)]=P}},C=function(w,k){let y=s<<3|k,P=Ve.getBCHTypeInfo(y);for(let M=0;M<15;M+=1){let S=!w&&(P>>M&1)==1;M<6?r[M][8]=S:M<8?r[M+1][8]=S:r[a-15+M][8]=S}for(let M=0;M<15;M+=1){let S=!w&&(P>>M&1)==1;M<8?r[8][a-M-1]=S:M<9?r[8][15-M-1+1]=S:r[8][15-M-1]=S}r[a-8][8]=!w},g=function(w,k){let y=-1,P=a-1,M=7,S=0,O=Ve.getMaskFunction(k);for(let W=a-1;W>0;W-=2)for(W==6&&(W-=1);;){for(let X=0;X<2;X+=1)if(r[P][W-X]==null){let Z=!1;S<w.length&&(Z=(w[S]>>>M&1)==1),O(P,W-X)&&(Z=!Z),r[P][W-X]=Z,M-=1,M==-1&&(S+=1,M=7)}if(P+=y,P<0||a<=P){P-=y,y=-y;break}}},I=function(w,k){let y=0,P=0,M=0,S=new Array(k.length),O=new Array(k.length);for(let z=0;z<k.length;z+=1){let Y=k[z].dataCount,Q=k[z].totalCount-Y;P=Math.max(P,Y),M=Math.max(M,Q),S[z]=new Array(Y);for(let le=0;le<S[z].length;le+=1)S[z][le]=255&w.getBuffer()[le+y];y+=Y;let Se=Ve.getErrorCorrectPolynomial(Q),$e=Qt(S[z],Se.getLength()-1).mod(Se);O[z]=new Array(Se.getLength()-1);for(let le=0;le<O[z].length;le+=1){let ie=le+$e.getLength()-O[z].length;O[z][le]=ie>=0?$e.getAt(ie):0}}let W=0;for(let z=0;z<k.length;z+=1)W+=k[z].totalCount;let X=new Array(W),Z=0;for(let z=0;z<P;z+=1)for(let Y=0;Y<k.length;Y+=1)z<S[Y].length&&(X[Z]=S[Y][z],Z+=1);for(let z=0;z<M;z+=1)for(let Y=0;Y<k.length;Y+=1)z<O[Y].length&&(X[Z]=O[Y][z],Z+=1);return X},H=function(w,k,y){let P=Kr.getRSBlocks(w,k),M=Wr();for(let O=0;O<y.length;O+=1){let W=y[O];M.put(W.getMode(),4),M.put(W.getLength(),Ve.getLengthInBits(W.getMode(),w)),W.write(M)}let S=0;for(let O=0;O<P.length;O+=1)S+=P[O].dataCount;if(M.getLengthInBits()>S*8)throw"code length overflow. ("+M.getLengthInBits()+">"+S*8+")";for(M.getLengthInBits()+4<=S*8&&M.put(0,4);M.getLengthInBits()%8!=0;)M.putBit(!1);for(;!(M.getLengthInBits()>=S*8||(M.put(236,8),M.getLengthInBits()>=S*8));)M.put(17,8);return I(M,P)};u.addData=function(w,k){k=k||"Byte";let y=null;switch(k){case"Numeric":y=kd(w);break;case"Alphanumeric":y=$d(w);break;case"Byte":y=Td(w);break;case"Kanji":y=Ed(w);break;default:throw"mode:"+k}d.push(y),c=null},u.isDark=function(w,k){if(w<0||a<=w||k<0||a<=k)throw w+","+k;return r[w][k]},u.getModuleCount=function(){return a},u.make=function(){if(o<1){let w=1;for(;w<40;w++){let k=Kr.getRSBlocks(w,s),y=Wr();for(let M=0;M<d.length;M++){let S=d[M];y.put(S.getMode(),4),y.put(S.getLength(),Ve.getLengthInBits(S.getMode(),w)),S.write(y)}let P=0;for(let M=0;M<k.length;M++)P+=k[M].dataCount;if(y.getLengthInBits()<=P*8)break}o=w}l(!1,b())},u.createTableTag=function(w,k){w=w||2,k=typeof k>"u"?w*4:k;let y="";y+='<table style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: "+k+"px;",y+='">',y+="<tbody>";for(let P=0;P<u.getModuleCount();P+=1){y+="<tr>";for(let M=0;M<u.getModuleCount();M+=1)y+='<td style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: 0px;",y+=" width: "+w+"px;",y+=" height: "+w+"px;",y+=" background-color: ",y+=u.isDark(P,M)?"#000000":"#ffffff",y+=";",y+='"/>';y+="</tr>"}return y+="</tbody>",y+="</table>",y},u.createSvgTag=function(w,k,y,P){let M={};typeof arguments[0]=="object"&&(M=arguments[0],w=M.cellSize,k=M.margin,y=M.alt,P=M.title),w=w||2,k=typeof k>"u"?w*4:k,y=typeof y=="string"?{text:y}:y||{},y.text=y.text||null,y.id=y.text?y.id||"qrcode-description":null,P=typeof P=="string"?{text:P}:P||{},P.text=P.text||null,P.id=P.text?P.id||"qrcode-title":null;let S=u.getModuleCount()*w+k*2,O,W,X,Z,z="",Y;for(Y="l"+w+",0 0,"+w+" -"+w+",0 0,-"+w+"z ",z+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',z+=M.scalable?"":' width="'+S+'px" height="'+S+'px"',z+=' viewBox="0 0 '+S+" "+S+'" ',z+=' preserveAspectRatio="xMinYMin meet"',z+=P.text||y.text?' role="img" aria-labelledby="'+V([P.id,y.id].join(" ").trim())+'"':"",z+=">",z+=P.text?'<title id="'+V(P.id)+'">'+V(P.text)+"</title>":"",z+=y.text?'<description id="'+V(y.id)+'">'+V(y.text)+"</description>":"",z+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',z+='<path d="',X=0;X<u.getModuleCount();X+=1)for(Z=X*w+k,O=0;O<u.getModuleCount();O+=1)u.isDark(X,O)&&(W=O*w+k,z+="M"+W+","+Z+Y);return z+='" stroke="transparent" fill="black"/>',z+="</svg>",z},u.createDataURL=function(w,k){w=w||2,k=typeof k>"u"?w*4:k;let y=u.getModuleCount()*w+k*2,P=k,M=y-k;return Md(y,y,function(S,O){if(P<=S&&S<M&&P<=O&&O<M){let W=Math.floor((S-P)/w),X=Math.floor((O-P)/w);return u.isDark(X,W)?0:1}else return 1})},u.createImgTag=function(w,k,y){w=w||2,k=typeof k>"u"?w*4:k;let P=u.getModuleCount()*w+k*2,M="";return M+="<img",M+=' src="',M+=u.createDataURL(w,k),M+='"',M+=' width="',M+=P,M+='"',M+=' height="',M+=P,M+='"',y&&(M+=' alt="',M+=V(y),M+='"'),M+="/>",M};let V=function(w){let k="";for(let y=0;y<w.length;y+=1){let P=w.charAt(y);switch(P){case"<":k+="&lt;";break;case">":k+="&gt;";break;case"&":k+="&amp;";break;case'"':k+="&quot;";break;default:k+=P;break}}return k},ue=function(w){w=typeof w>"u"?2:w;let y=u.getModuleCount()*1+w*2,P=w,M=y-w,S,O,W,X,Z,z={"██":"█","█ ":"▀"," █":"▄","  ":" "},Y={"██":"▀","█ ":"▀"," █":" ","  ":" "},Q="";for(S=0;S<y;S+=2){for(W=Math.floor((S-P)/1),X=Math.floor((S+1-P)/1),O=0;O<y;O+=1)Z="█",P<=O&&O<M&&P<=S&&S<M&&u.isDark(W,Math.floor((O-P)/1))&&(Z=" "),P<=O&&O<M&&P<=S+1&&S+1<M&&u.isDark(X,Math.floor((O-P)/1))?Z+=" ":Z+="█",Q+=w<1&&S+1>=M?Y[Z]:z[Z];Q+=`
`}return y%2&&w>0?Q.substring(0,Q.length-y-1)+Array(y+1).join("▀"):Q.substring(0,Q.length-1)};return u.createASCII=function(w,k){if(w=w||1,w<2)return ue(k);w-=1,k=typeof k>"u"?w*2:k;let y=u.getModuleCount()*w+k*2,P=k,M=y-k,S,O,W,X,Z=Array(w+1).join("██"),z=Array(w+1).join("  "),Y="",Q="";for(S=0;S<y;S+=1){for(W=Math.floor((S-P)/w),Q="",O=0;O<y;O+=1)X=1,P<=O&&O<M&&P<=S&&S<M&&u.isDark(W,Math.floor((O-P)/w))&&(X=0),Q+=X?Z:z;for(W=0;W<w;W+=1)Y+=Q+`
`}return Y.substring(0,Y.length-1)},u.renderTo2dContext=function(w,k){k=k||2;let y=u.getModuleCount();for(let P=0;P<y;P++)for(let M=0;M<y;M++)w.fillStyle=u.isDark(P,M)?"black":"white",w.fillRect(M*k,P*k,k,k)},u};_t.stringToBytes=function(i){let t=[];for(let e=0;e<i.length;e+=1){let n=i.charCodeAt(e);t.push(n&255)}return t};_t.createStringToBytes=function(i,t){let e=(function(){let o=Cd(i),s=function(){let c=o.read();if(c==-1)throw"eof";return c},r=0,a={};for(;;){let c=o.read();if(c==-1)break;let d=s(),u=s(),l=s(),p=String.fromCharCode(c<<8|d),b=u<<8|l;a[p]=b,r+=1}if(r!=t)throw r+" != "+t;return a})(),n=63;return function(o){let s=[];for(let r=0;r<o.length;r+=1){let a=o.charCodeAt(r);if(a<128)s.push(a);else{let c=e[o.charAt(r)];typeof c=="number"?(c&255)==c?s.push(c):(s.push(c>>>8),s.push(c&255)):s.push(n)}}return s}};var ye={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Zt={L:1,M:0,Q:3,H:2},We={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Ve=(function(){let i=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,o={},s=function(r){let a=0;for(;r!=0;)a+=1,r>>>=1;return a};return o.getBCHTypeInfo=function(r){let a=r<<10;for(;s(a)-s(t)>=0;)a^=t<<s(a)-s(t);return(r<<10|a)^n},o.getBCHTypeNumber=function(r){let a=r<<12;for(;s(a)-s(e)>=0;)a^=e<<s(a)-s(e);return r<<12|a},o.getPatternPosition=function(r){return i[r-1]},o.getMaskFunction=function(r){switch(r){case We.PATTERN000:return function(a,c){return(a+c)%2==0};case We.PATTERN001:return function(a,c){return a%2==0};case We.PATTERN010:return function(a,c){return c%3==0};case We.PATTERN011:return function(a,c){return(a+c)%3==0};case We.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case We.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case We.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case We.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+r}},o.getErrorCorrectPolynomial=function(r){let a=Qt([1],0);for(let c=0;c<r;c+=1)a=a.multiply(Qt([1,Ge.gexp(c)],0));return a},o.getLengthInBits=function(r,a){if(1<=a&&a<10)switch(r){case ye.MODE_NUMBER:return 10;case ye.MODE_ALPHA_NUM:return 9;case ye.MODE_8BIT_BYTE:return 8;case ye.MODE_KANJI:return 8;default:throw"mode:"+r}else if(a<27)switch(r){case ye.MODE_NUMBER:return 12;case ye.MODE_ALPHA_NUM:return 11;case ye.MODE_8BIT_BYTE:return 16;case ye.MODE_KANJI:return 10;default:throw"mode:"+r}else if(a<41)switch(r){case ye.MODE_NUMBER:return 14;case ye.MODE_ALPHA_NUM:return 13;case ye.MODE_8BIT_BYTE:return 16;case ye.MODE_KANJI:return 12;default:throw"mode:"+r}else throw"type:"+a},o.getLostPoint=function(r){let a=r.getModuleCount(),c=0;for(let l=0;l<a;l+=1)for(let p=0;p<a;p+=1){let b=0,T=r.isDark(l,p);for(let m=-1;m<=1;m+=1)if(!(l+m<0||a<=l+m))for(let x=-1;x<=1;x+=1)p+x<0||a<=p+x||m==0&&x==0||T==r.isDark(l+m,p+x)&&(b+=1);b>5&&(c+=3+b-5)}for(let l=0;l<a-1;l+=1)for(let p=0;p<a-1;p+=1){let b=0;r.isDark(l,p)&&(b+=1),r.isDark(l+1,p)&&(b+=1),r.isDark(l,p+1)&&(b+=1),r.isDark(l+1,p+1)&&(b+=1),(b==0||b==4)&&(c+=3)}for(let l=0;l<a;l+=1)for(let p=0;p<a-6;p+=1)r.isDark(l,p)&&!r.isDark(l,p+1)&&r.isDark(l,p+2)&&r.isDark(l,p+3)&&r.isDark(l,p+4)&&!r.isDark(l,p+5)&&r.isDark(l,p+6)&&(c+=40);for(let l=0;l<a;l+=1)for(let p=0;p<a-6;p+=1)r.isDark(p,l)&&!r.isDark(p+1,l)&&r.isDark(p+2,l)&&r.isDark(p+3,l)&&r.isDark(p+4,l)&&!r.isDark(p+5,l)&&r.isDark(p+6,l)&&(c+=40);let d=0;for(let l=0;l<a;l+=1)for(let p=0;p<a;p+=1)r.isDark(p,l)&&(d+=1);let u=Math.abs(100*d/a/a-50)/5;return c+=u*10,c},o})(),Ge=(function(){let i=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)i[n]=1<<n;for(let n=8;n<256;n+=1)i[n]=i[n-4]^i[n-5]^i[n-6]^i[n-8];for(let n=0;n<255;n+=1)t[i[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return i[n]},e})(),Qt=function(i,t){if(typeof i.length>"u")throw i.length+"/"+t;let e=(function(){let o=0;for(;o<i.length&&i[o]==0;)o+=1;let s=new Array(i.length-o+t);for(let r=0;r<i.length-o;r+=1)s[r]=i[r+o];return s})(),n={};return n.getAt=function(o){return e[o]},n.getLength=function(){return e.length},n.multiply=function(o){let s=new Array(n.getLength()+o.getLength()-1);for(let r=0;r<n.getLength();r+=1)for(let a=0;a<o.getLength();a+=1)s[r+a]^=Ge.gexp(Ge.glog(n.getAt(r))+Ge.glog(o.getAt(a)));return Qt(s,0)},n.mod=function(o){if(n.getLength()-o.getLength()<0)return n;let s=Ge.glog(n.getAt(0))-Ge.glog(o.getAt(0)),r=new Array(n.getLength());for(let a=0;a<n.getLength();a+=1)r[a]=n.getAt(a);for(let a=0;a<o.getLength();a+=1)r[a]^=Ge.gexp(Ge.glog(o.getAt(a))+s);return Qt(r,0).mod(o)},n},Kr=(function(){let i=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,s){let r={};return r.totalCount=o,r.dataCount=s,r},e={},n=function(o,s){switch(s){case Zt.L:return i[(o-1)*4+0];case Zt.M:return i[(o-1)*4+1];case Zt.Q:return i[(o-1)*4+2];case Zt.H:return i[(o-1)*4+3];default:return}};return e.getRSBlocks=function(o,s){let r=n(o,s);if(typeof r>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+s;let a=r.length/3,c=[];for(let d=0;d<a;d+=1){let u=r[d*3+0],l=r[d*3+1],p=r[d*3+2];for(let b=0;b<u;b+=1)c.push(t(l,p))}return c},e})(),Wr=function(){let i=[],t=0,e={};return e.getBuffer=function(){return i},e.getAt=function(n){let o=Math.floor(n/8);return(i[o]>>>7-n%8&1)==1},e.put=function(n,o){for(let s=0;s<o;s+=1)e.putBit((n>>>o-s-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let o=Math.floor(t/8);i.length<=o&&i.push(0),n&&(i[o]|=128>>>t%8),t+=1},e},kd=function(i){let t=ye.MODE_NUMBER,e=i,n={};n.getMode=function(){return t},n.getLength=function(r){return e.length},n.write=function(r){let a=e,c=0;for(;c+2<a.length;)r.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?r.put(o(a.substring(c,c+1)),4):a.length-c==2&&r.put(o(a.substring(c,c+2)),7))};let o=function(r){let a=0;for(let c=0;c<r.length;c+=1)a=a*10+s(r.charAt(c));return a},s=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;throw"illegal char :"+r};return n},$d=function(i){let t=ye.MODE_ALPHA_NUM,e=i,n={};n.getMode=function(){return t},n.getLength=function(s){return e.length},n.write=function(s){let r=e,a=0;for(;a+1<r.length;)s.put(o(r.charAt(a))*45+o(r.charAt(a+1)),11),a+=2;a<r.length&&s.put(o(r.charAt(a)),6)};let o=function(s){if("0"<=s&&s<="9")return s.charCodeAt(0)-48;if("A"<=s&&s<="Z")return s.charCodeAt(0)-65+10;switch(s){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+s}};return n},Td=function(i){let t=ye.MODE_8BIT_BYTE,e=i,n=_t.stringToBytes(i),o={};return o.getMode=function(){return t},o.getLength=function(s){return n.length},o.write=function(s){for(let r=0;r<n.length;r+=1)s.put(n[r],8)},o},Ed=function(i){let t=ye.MODE_KANJI,e=i,n=_t.stringToBytes;(function(r,a){let c=n(r);if(c.length!=2||(c[0]<<8|c[1])!=a)throw"sjis not supported."})("友",38726);let o=n(i),s={};return s.getMode=function(){return t},s.getLength=function(r){return~~(o.length/2)},s.write=function(r){let a=o,c=0;for(;c+1<a.length;){let d=(255&a[c])<<8|255&a[c+1];if(33088<=d&&d<=40956)d-=33088;else if(57408<=d&&d<=60351)d-=49472;else throw"illegal char at "+(c+1)+"/"+d;d=(d>>>8&255)*192+(d&255),r.put(d,13),c+=2}if(c<a.length)throw"illegal char at "+(c+1)},s},Vr=function(){let i=[],t={};return t.writeByte=function(e){i.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,o){n=n||0,o=o||e.length;for(let s=0;s<o;s+=1)t.writeByte(e[s+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return i},t.toString=function(){let e="";e+="[";for(let n=0;n<i.length;n+=1)n>0&&(e+=","),e+=i[n];return e+="]",e},t},_d=function(){let i=0,t=0,e=0,n="",o={},s=function(a){n+=String.fromCharCode(r(a&63))},r=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(i=i<<8|a&255,t+=8,e+=1;t>=6;)s(i>>>t-6),t-=6},o.flush=function(){if(t>0&&(s(i<<6-t),i=0,t=0),e%3!=0){let a=3-e%3;for(let c=0;c<a;c+=1)n+="="}},o.toString=function(){return n},o},Cd=function(i){let t=i,e=0,n=0,o=0,s={};s.read=function(){for(;o<8;){if(e>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}let c=t.charAt(e);if(e+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;n=n<<6|r(c.charCodeAt(0)),o+=6}let a=n>>>o-8&255;return o-=8,a};let r=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return s},Pd=function(i,t){let e=i,n=t,o=new Array(i*t),s={};s.setPixel=function(d,u,l){o[u*e+d]=l},s.write=function(d){d.writeString("GIF87a"),d.writeShort(e),d.writeShort(n),d.writeByte(128),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(255),d.writeByte(255),d.writeByte(255),d.writeString(","),d.writeShort(0),d.writeShort(0),d.writeShort(e),d.writeShort(n),d.writeByte(0);let u=2,l=a(u);d.writeByte(u);let p=0;for(;l.length-p>255;)d.writeByte(255),d.writeBytes(l,p,255),p+=255;d.writeByte(l.length-p),d.writeBytes(l,p,l.length-p),d.writeByte(0),d.writeString(";")};let r=function(d){let u=d,l=0,p=0,b={};return b.write=function(T,m){if(T>>>m)throw"length over";for(;l+m>=8;)u.writeByte(255&(T<<l|p)),m-=8-l,T>>>=8-l,p=0,l=0;p=T<<l|p,l=l+m},b.flush=function(){l>0&&u.writeByte(p)},b},a=function(d){let u=1<<d,l=(1<<d)+1,p=d+1,b=c();for(let g=0;g<u;g+=1)b.add(String.fromCharCode(g));b.add(String.fromCharCode(u)),b.add(String.fromCharCode(l));let T=Vr(),m=r(T);m.write(u,p);let x=0,C=String.fromCharCode(o[x]);for(x+=1;x<o.length;){let g=String.fromCharCode(o[x]);x+=1,b.contains(C+g)?C=C+g:(m.write(b.indexOf(C),p),b.size()<4095&&(b.size()==1<<p&&(p+=1),b.add(C+g)),C=g)}return m.write(b.indexOf(C),p),m.write(l,p),m.flush(),T.toByteArray()},c=function(){let d={},u=0,l={};return l.add=function(p){if(l.contains(p))throw"dup key:"+p;d[p]=u,u+=1},l.size=function(){return u},l.indexOf=function(p){return d[p]},l.contains=function(p){return typeof d[p]<"u"},l};return s},Md=function(i,t,e){let n=Pd(i,t);for(let a=0;a<t;a+=1)for(let c=0;c<i;c+=1)n.setPixel(c,a,e(c,a));let o=Vr();n.write(o);let s=_d(),r=o.toByteArray();for(let a=0;a<r.length;a+=1)s.writeByte(r[a]);return s.flush(),"data:image/gif;base64,"+s},Gr=_t,xu=_t.stringToBytes;function qr(i){let t=Gr(0,"M");t.addData(i),t.make();let e=t.getModuleCount(),n="";for(let o=0;o<e;o++)for(let s=0;s<e;s++)t.isDark(o,s)&&(n+=`M${s} ${o}h1v1h-1z`);return{size:e,d:n}}var Ad=1e4,en=class extends Ee{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await Ur();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof ct&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),Ad)}}async poll(e){let n=this.secret;if(n)try{let o=await Fr(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,o.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:o.auth}));return}if(o.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return $;let{size:e,d:n}=qr(Hr(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${oe`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?zr(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${is}?${ss}</span> and type the code.
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
    </div>`}};en.styles=Ye`
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
  `,en.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",en);var os="hassTokens";function Yr(){try{let i=localStorage.getItem(os);return i?JSON.parse(i):null}catch{return null}}function rs(i){try{i?localStorage.setItem(os,JSON.stringify(i)):localStorage.removeItem(os)}catch{}}function Sd(i){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=i)}function Ld(){let i=document.querySelector("mydashlight-pairing");return i?new Promise(t=>{let e=n=>{i.stop(),i.hidden=!0,t(n)};i.addEventListener("paired",n=>e(n.detail),{once:!0}),i.addEventListener("password",()=>e(null),{once:!0}),i.start()}):Promise.resolve(null)}async function Dd(){let i=document.querySelector("mydashlight-board");if(!i)return;i.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!Yr()){let e=await Ld();e&&rs(e)}try{let e=await _s({hassUrl:location.origin,loadTokens:async()=>Yr(),saveTokens:rs});t&&history.replaceState(null,"",location.pathname+Si(location.search));let n=await Cs({auth:e});i.backend=new ln(n),Lr(n),Sr(n,Ar(import.meta.url),{reload:Rd,idleFor:()=>Date.now()-Qr}),n.addEventListener("reconnect-error",(o,s)=>{s===2&&Jr()})}catch(e){if(e===2){Jr();return}Sd(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}var Qr=Date.now();for(let i of["pointerdown","keydown","wheel"])document.addEventListener(i,()=>Qr=Date.now(),{capture:!0,passive:!0});var Xr="mydashlight-reloaded-for";function Rd(i){try{if(sessionStorage.getItem(Xr)===i)return;sessionStorage.setItem(Xr,i)}catch{}location.reload()}function Jr(){rs(null),location.replace(location.pathname+Si(location.search))}var ea=st(location.search),Zr=document.querySelector("mydashlight-keyboard");Zr&&ea.keyboard!==!1&&jr(Zr);ea.cursor!=="show"&&Mr();Dd();
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
