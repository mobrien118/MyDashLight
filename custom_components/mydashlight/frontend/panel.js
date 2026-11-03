var ze=globalThis,He=ze.ShadowRoot&&(ze.ShadyCSS===void 0||ze.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ot=Symbol(),St=new WeakMap,ke=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ot)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(He&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=St.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&St.set(e,t))}return t}toString(){return this.cssText}},Ct=i=>new ke(typeof i=="string"?i:i+"",void 0,ot),_e=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,n,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[o+1],i[0]);return new ke(e,i,ot)},Mt=(i,t)=>{if(He)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),n=ze.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}},at=He?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return Ct(e)})(i):i;var{is:fs,defineProperty:gs,getOwnPropertyDescriptor:bs,getOwnPropertyNames:ms,getOwnPropertySymbols:vs,getPrototypeOf:xs}=Object,Ie=globalThis,Dt=Ie.trustedTypes,ys=Dt?Dt.emptyScript:"",$s=Ie.reactiveElementPolyfillSupport,Ae=(i,t)=>i,lt={toAttribute(i,t){switch(t){case Boolean:i=i?ys:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Bt=(i,t)=>!fs(i,t),Rt={attribute:!0,type:String,converter:lt,reflect:!1,useDefault:!1,hasChanged:Bt};Symbol.metadata??=Symbol("metadata"),Ie.litPropertyMetadata??=new WeakMap;var Q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Rt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),n=this.getPropertyDescriptor(t,s,e);n!==void 0&&gs(this.prototype,t,n)}}static getPropertyDescriptor(t,e,s){let{get:n,set:o}=bs(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:n,set(a){let p=n?.call(this);o?.call(this,a),this.requestUpdate(t,p,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Rt}static _$Ei(){if(this.hasOwnProperty(Ae("elementProperties")))return;let t=xs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ae("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ae("properties"))){let e=this.properties,s=[...ms(e),...vs(e)];for(let n of s)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,n]of e)this.elementProperties.set(s,n)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let n=this._$Eu(e,s);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let n of s)e.unshift(at(n))}else t!==void 0&&e.push(at(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Mt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:lt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let o=s.getPropertyOptions(n),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:lt;this._$Em=n;let p=a.fromAttribute(e,o.type);this[n]=p??this._$Ej?.get(n)??p,this._$Em=null}}requestUpdate(t,e,s,n=!1,o){if(t!==void 0){let a=this.constructor;if(n===!1&&(o=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??Bt)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:n,wrapped:o},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[n,o]of s){let{wrapped:a}=o,p=this[n];a!==!0||this._$AL.has(n)||p===void 0||this.C(n,void 0,o,p)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[Ae("elementProperties")]=new Map,Q[Ae("finalized")]=new Map,$s?.({ReactiveElement:Q}),(Ie.reactiveElementVersions??=[]).push("2.1.2");var pt=globalThis,zt=i=>i,Le=pt.trustedTypes,Ht=Le?Le.createPolicy("lit-html",{createHTML:i=>i}):void 0,ct="$lit$",ee=`lit$${Math.random().toFixed(9).slice(2)}$`,ht="?"+ee,ws=`<${ht}>`,pe=document,Te=()=>pe.createComment(""),Pe=i=>i===null||typeof i!="object"&&typeof i!="function",ut=Array.isArray,jt=i=>ut(i)||typeof i?.[Symbol.iterator]=="function",dt=`[ 	
\f\r]`,Ee=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,It=/-->/g,Lt=/>/g,le=RegExp(`>|${dt}(?:([^\\s"'>=/]+)(${dt}*=${dt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Nt=/'/g,Ot=/"/g,Wt=/^(?:script|style|textarea|title)$/i,ft=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),h=ft(1),Ve=ft(2),si=ft(3),te=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Ut=new WeakMap,de=pe.createTreeWalker(pe,129);function Vt(i,t){if(!ut(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ht!==void 0?Ht.createHTML(t):t}var Kt=(i,t)=>{let e=i.length-1,s=[],n,o=t===2?"<svg>":t===3?"<math>":"",a=Ee;for(let p=0;p<e;p++){let r=i[p],l,$,c=-1,m=0;for(;m<r.length&&(a.lastIndex=m,$=a.exec(r),$!==null);)m=a.lastIndex,a===Ee?$[1]==="!--"?a=It:$[1]!==void 0?a=Lt:$[2]!==void 0?(Wt.test($[2])&&(n=RegExp("</"+$[2],"g")),a=le):$[3]!==void 0&&(a=le):a===le?$[0]===">"?(a=n??Ee,c=-1):$[1]===void 0?c=-2:(c=a.lastIndex-$[2].length,l=$[1],a=$[3]===void 0?le:$[3]==='"'?Ot:Nt):a===Ot||a===Nt?a=le:a===It||a===Lt?a=Ee:(a=le,n=void 0);let y=a===le&&i[p+1].startsWith("/>")?" ":"";o+=a===Ee?r+ws:c>=0?(s.push(l),r.slice(0,c)+ct+r.slice(c)+ee+y):r+ee+(c===-2?p:y)}return[Vt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},Se=class i{constructor({strings:t,_$litType$:e},s){let n;this.parts=[];let o=0,a=0,p=t.length-1,r=this.parts,[l,$]=Kt(t,e);if(this.el=i.createElement(l,s),de.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(n=de.nextNode())!==null&&r.length<p;){if(n.nodeType===1){if(n.hasAttributes())for(let c of n.getAttributeNames())if(c.endsWith(ct)){let m=$[a++],y=n.getAttribute(c).split(ee),g=/([.?@])?(.*)/.exec(m);r.push({type:1,index:o,name:g[2],strings:y,ctor:g[1]==="."?Oe:g[1]==="?"?Ue:g[1]==="@"?je:he}),n.removeAttribute(c)}else c.startsWith(ee)&&(r.push({type:6,index:o}),n.removeAttribute(c));if(Wt.test(n.tagName)){let c=n.textContent.split(ee),m=c.length-1;if(m>0){n.textContent=Le?Le.emptyScript:"";for(let y=0;y<m;y++)n.append(c[y],Te()),de.nextNode(),r.push({type:2,index:++o});n.append(c[m],Te())}}}else if(n.nodeType===8)if(n.data===ht)r.push({type:2,index:o});else{let c=-1;for(;(c=n.data.indexOf(ee,c+1))!==-1;)r.push({type:7,index:o}),c+=ee.length-1}o++}}static createElement(t,e){let s=pe.createElement("template");return s.innerHTML=t,s}};function ce(i,t,e=i,s){if(t===te)return t;let n=s!==void 0?e._$Co?.[s]:e._$Cl,o=Pe(t)?void 0:t._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),o===void 0?n=void 0:(n=new o(i),n._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=n:e._$Cl=n),n!==void 0&&(t=ce(i,n._$AS(i,t.values),n,s)),t}var Ne=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,n=(t?.creationScope??pe).importNode(e,!0);de.currentNode=n;let o=de.nextNode(),a=0,p=0,r=s[0];for(;r!==void 0;){if(a===r.index){let l;r.type===2?l=new be(o,o.nextSibling,this,t):r.type===1?l=new r.ctor(o,r.name,r.strings,this,t):r.type===6&&(l=new We(o,this,t)),this._$AV.push(l),r=s[++p]}a!==r?.index&&(o=de.nextNode(),a++)}return de.currentNode=pe,n}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},be=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,n){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ce(this,t,e),Pe(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==te&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):jt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&Pe(this._$AH)?this._$AA.nextSibling.data=t:this.T(pe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Se.createElement(Vt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(e);else{let o=new Ne(n,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=Ut.get(t.strings);return e===void 0&&Ut.set(t.strings,e=new Se(t)),e}k(t){ut(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,n=0;for(let o of t)n===e.length?e.push(s=new i(this.O(Te()),this.O(Te()),this,this.options)):s=e[n],s._$AI(o),n++;n<e.length&&(this._$AR(s&&s._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=zt(t).nextSibling;zt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},he=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,n,o){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(t,e=this,s,n){let o=this.strings,a=!1;if(o===void 0)t=ce(this,t,e,0),a=!Pe(t)||t!==this._$AH&&t!==te,a&&(this._$AH=t);else{let p=t,r,l;for(t=o[0],r=0;r<o.length-1;r++)l=ce(this,p[s+r],e,r),l===te&&(l=this._$AH[r]),a||=!Pe(l)||l!==this._$AH[r],l===v?t=v:t!==v&&(t+=(l??"")+o[r+1]),this._$AH[r]=l}a&&!n&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Oe=class extends he{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}},Ue=class extends he{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}},je=class extends he{constructor(t,e,s,n,o){super(t,e,s,n,o),this.type=5}_$AI(t,e=this){if((t=ce(this,t,e,0)??v)===te)return;let s=this._$AH,n=t===v&&s!==v||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==v&&(s===v||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},We=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ce(this,t)}},Ft={M:ct,P:ee,A:ht,C:1,L:Kt,R:Ne,D:jt,V:ce,I:be,H:he,N:Ue,U:je,B:Oe,F:We},ks=pt.litHtmlPolyfillSupport;ks?.(Se,be),(pt.litHtmlVersions??=[]).push("3.3.3");var Yt=(i,t,e)=>{let s=e?.renderBefore??t,n=s._$litPart$;if(n===void 0){let o=e?.renderBefore??null;s._$litPart$=n=new be(t.insertBefore(Te(),o),o,void 0,e??{})}return n._$AI(i),n};var gt=globalThis,G=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Yt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return te}};G._$litElement$=!0,G.finalized=!0,gt.litElementHydrateSupport?.({LitElement:G});var _s=gt.litElementPolyfillSupport;_s?.({LitElement:G});(gt.litElementVersions??=[]).push("4.2.2");function w(i){let t=Math.round(i),e=Math.floor(t/60),s=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${s<10?"0":""}${s}`}function Ke(i){let t=Math.floor(Math.round(i)/60)%24;return`${w(i)} ${t<12?"AM":"PM"}`}function qt(i){let t=Math.floor(i/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Gt(i){let t=Math.max(0,Math.round(i)),e=Math.floor(t/60),s=t%60;return e?s?`${e} hr ${s} min`:`${e} hr`:`${s} min`}function Xt(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var As=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Es=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Ts=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Fe(i){return new Date(`${i}T12:00:00Z`)}function Ce(i){let t=Fe(i);return`${As.format(t)}, ${Ts.format(t)}`}function me(i){return Es.format(Fe(i))}function Zt(i,t){return i===t?Ce(i):`${Ce(i)} to ${Ce(t)}`}function bt(i,t){return Math.round((Fe(t).getTime()-Fe(i).getTime())/864e5)}function Me(i,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Me("UTC",t)}let s=n=>e.find(o=>o.type===n)?.value??"0";return{date:`${s("year")}-${s("month")}-${s("day")}`,minutes:Number(s("hour"))*60+Number(s("minute"))}}function Ye(i,t,e){let s=Math.floor((t.getTime()-i.getTime())/6e4);if(s<1)return"just now";if(s<60)return`${s} min ago`;let n=Me(e,i),o=Me(e,t).date;return n.date===o?`at ${Ke(n.minutes)}`:`on ${me(n.date)} at ${Ke(n.minutes)}`}var q=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},mt="mydashlight",Ps=7,Ss=3e4;function Jt(i){if(i instanceof q)return i;if(i&&typeof i=="object"){let t=i;if(typeof t.message=="string")return new q(String(t.code??"error"),t.message)}return typeof i=="number"?new q("connection_lost","Lost the connection to Home Assistant."):new q("error",String(i))}var qe=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new q("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let s={onPlan:t,onError:e};return this.listeners.add(s),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(s),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Ss),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new q("not_running","MyDashLight isn’t running right now."))},{type:`${mt}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:mt,service:"get_plan",service_data:{days:Ps},return_response:!0});this.emit(t.response)}catch(t){this.fail(Jt(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:mt,service:t,service_data:e})}catch(s){throw Jt(s)}this.pushing||await this.refresh()}setRide(t,e,s,n){return this.call("set_ride",{event:t,side:e,driver:s,scope:n})}setStay(t,e,s){return this.call("set_stay",{event:t,stay:e,scope:s})}setArriveBy(t,e,s){return this.call("set_arrive_by",e==null?{event:t,scope:s}:{event:t,time:Xt(e),scope:s})}setTakeAlong(t,e,s){return this.call("set_take_along",{event:t,kids:e,scope:s})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}};var Qt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},es=i=>(...t)=>({_$litDirective$:i,values:t}),Ge=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Cs}=Ft,ts=i=>i;var ss=()=>document.createComment(""),ve=(i,t,e)=>{let s=i._$AA.parentNode,n=t===void 0?i._$AB:t._$AA;if(e===void 0){let o=s.insertBefore(ss(),n),a=s.insertBefore(ss(),n);e=new Cs(o,a,i,i.options)}else{let o=e._$AB.nextSibling,a=e._$AM,p=a!==i;if(p){let r;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(r=i._$AU)!==a._$AU&&e._$AP(r)}if(o!==n||p){let r=e._$AA;for(;r!==o;){let l=ts(r).nextSibling;ts(s).insertBefore(r,n),r=l}}}return e},oe=(i,t,e=i)=>(i._$AI(t,e),i),Ms={},is=(i,t=Ms)=>i._$AH=t,ns=i=>i._$AH,Xe=i=>{i._$AR(),i._$AA.remove()};var rs=(i,t,e)=>{let s=new Map;for(let n=t;n<=e;n++)s.set(i[n],n);return s},X=es(class extends Ge{constructor(i){if(super(i),i.type!==Qt.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let s;e===void 0?e=t:t!==void 0&&(s=t);let n=[],o=[],a=0;for(let p of i)n[a]=s?s(p,a):a,o[a]=e(p,a),a++;return{values:o,keys:n}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,s]){let n=ns(i),{values:o,keys:a}=this.dt(t,e,s);if(!Array.isArray(n))return this.ut=a,o;let p=this.ut??=[],r=[],l,$,c=0,m=n.length-1,y=0,g=o.length-1;for(;c<=m&&y<=g;)if(n[c]===null)c++;else if(n[m]===null)m--;else if(p[c]===a[y])r[y]=oe(n[c],o[y]),c++,y++;else if(p[m]===a[g])r[g]=oe(n[m],o[g]),m--,g--;else if(p[c]===a[g])r[g]=oe(n[c],o[g]),ve(i,r[g+1],n[c]),c++,g--;else if(p[m]===a[y])r[y]=oe(n[m],o[y]),ve(i,n[c],n[m]),m--,y++;else if(l===void 0&&(l=rs(a,y,g),$=rs(p,c,m)),l.has(p[c]))if(l.has(p[m])){let E=$.get(a[y]),x=E!==void 0?n[E]:null;if(x===null){let M=ve(i,n[c]);oe(M,o[y]),r[y]=M}else r[y]=oe(x,o[y]),ve(i,n[c],x),n[E]=null;y++}else Xe(n[m]),m--;else Xe(n[c]),c++;for(;y<=g;){let E=ve(i,r[g+1]);oe(E,o[y]),r[y++]=E}for(;c<=m;){let E=n[c++];E!==null&&Xe(E)}return this.ut=a,is(i,r),te}});var Ze=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function se(i){return Ze[(i%Ze.length+Ze.length)%Ze.length]}var os="#23272E";var Ds=3,tt=36,vt=12,Rs=8,yt=60,$t=10,Je=30,wt=10,Bs=150,zs=200,et=1.4;function Hs(i,t){let e=Math.max(Bs,zs/et);return Math.ceil(yt+Math.max(0,i-1)*$t+Je+Math.max(0,t-1)*wt+e*(i+et*t))}function xe(i){return i.people?i.people.kids.map(t=>t.id):i.days.length?Object.keys(i.days[0].kids):[]}function De(i){return i.people?i.people.drivers.map(t=>t.id):i.days.length?Object.keys(i.days[0].drivers):[]}function st(i){return new Map(xe(i).map((t,e)=>[t,se(e)]))}function ie(i,t){let e=i.people?.kids.find(s=>s.id===t);if(e)return e.name;for(let s of i.days)if(s.kids[t])return s.kids[t].name;return t}function it(i,t){let e=i.people?.drivers.find(s=>s.id===t);if(e)return e.name;for(let s of i.days)if(s.drivers[t])return s.drivers[t].name;return t}function kt(i,t){return t==="none"?"Not needed":De(i).includes(t)?it(i,t):t}function Is(i){let t=new Map([["home","Home"]]);for(let e of i.days)for(let s of e.events)t.set(s.place,s.short_place||s.place_name||s.place);return t}function Qe(i,t){return t?i.get(t)??(t.split(",")[0]?.trim()||t):""}function xt(i,t){let e=[];for(let s of i)s.type==="drive"?(e.length||e.push(Qe(t,s.from)),e.push(Qe(t,s.to))):(s.type==="wait"||s.type==="stay")&&(e.length||e.push(Qe(t,s.place)),s.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Ls(i){let t=i.map(a=>({...a,col:0,cols:1})).sort((a,p)=>a.s-p.s||p.en-a.en),e=[],s=[],n=-1/0,o=()=>{for(let a of e)a.cols=s.length;e=[],s=[]};for(let a of t){a.s>=n&&(o(),n=-1/0);let p=s.findIndex(r=>r<=a.s);p<0?(p=s.length,s.push(a.en)):s[p]=a.en,a.col=p,e.push(a),n=Math.max(n,a.en)}return o(),t}function Ns(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].y;for(let e=0;e<i.length-1;e++){let s=i[e],n=i[e+1];if(t<=n.t)return n.t===s.t?s.y:Math.round(s.y+(t-s.t)/(n.t-s.t)*(n.y-s.y))}return i[i.length-1].y}function Os(i,t){if(!i.length)return 0;if(t<=i[0].y)return i[0].t;for(let e=0;e<i.length-1;e++){let s=i[e],n=i[e+1];if(t<=n.y)return n.y===s.y?s.t:s.t+(t-s.y)/(n.y-s.y)*(n.t-s.t)}return i[i.length-1].t}function ls(i,t){return Ns(i.anchors,t)}function ds(i,t){return Os(i.anchors,t)}function Us(i,t){let e=xe(i),s=De(i),n=Math.max(t,Hs(e.length,s.length)),a=(n-yt-Math.max(0,e.length-1)*$t-Je-Math.max(0,s.length-1)*wt)/(e.length+et*s.length||1),p=Math.floor(a),r=Math.floor(a*et),l=new Map;for(let g of i.days)for(let E of g.events){let x=l.get(E.kid)??[];x.some(M=>M.event_id===E.event_id&&M.calendar_id===E.calendar_id)||x.push(E),l.set(E.kid,x)}let $=st(i),c=[],m=yt;e.forEach((g,E)=>{let x=l.get(g)??[],M=i.days.some(u=>u.events.some(W=>W.kid===g&&(W.sides.includes("drop")&&W.drop===""||W.sides.includes("pick")&&W.pick==="")));c.push({id:g,kind:"kid",x:m,w:p,name:ie(i,g),dot:$.get(g).color,sub:`${x.length} this week${M?" · needs a ride":""}`,subWarn:M}),m+=p+(E<e.length-1?$t:0)});let y=m+Je/2;return m+=Je,s.forEach((g,E)=>{let x=0,M=0;for(let u of i.days){let W=u.drivers[g];W&&(x+=W.outings.length,M+=W.drive??0)}c.push({id:g,kind:"driver",x:m,w:r,name:it(i,g),dot:os,sub:`${x} ${x===1?"trip":"trips"} this week · ${Gt(M)} driving`,subWarn:!1}),m+=r+(E<s.length-1?wt:0)}),{columns:c,sepX:y,width:n}}function js(i){return i.issues.filter(t=>t.level==="problem").length+i.clashes.length}function Ws(i,t){let e=bt(t,i);return e===0?"Today":e===1?"Tomorrow":""}function j(i,t=0){return i==null||!Number.isFinite(i)?t:i}function as(i,t,e=7){let s=Math.max(8,Math.floor(t/e)),n=1,o=0;for(let a of i.split(/\s+/).filter(Boolean)){let p=a.length;for(o===0?o=p:o+1+p<=s?o+=1+p:(n++,o=p);o>s;)n++,o-=s}return n}function Vs(i,t){let e=t-21,s=`${w(i.start)}–${w(i.end)}`+(i.arrive_by!=null?` · arrive ${w(i.arrive_by)}`:""),n=33+as(s,e,6.6)*16;for(let o of[i.lines.drop,i.lines.pick])o&&(n+=2+as(o.text,e,7)*16);return n+4}function ps(i,t,e,s){let n=t==="compact",{columns:o,sepX:a,width:p}=Us(i,e),r=new Map(o.map(u=>[u.id,u])),l=xe(i),$=De(i),c=[...l,...$],m=st(i),y=Is(i),g=u=>ie(i,u),E=u=>it(i,u),x={mode:t,width:p,height:0,columns:o,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},M=0;return i.days.forEach((u,W)=>{let Z=W*1440,V=new Map(u.events.map(d=>[d.id,d])),K=d=>d&&V.has(d)?{day:u.date,event:d}:null,ue=js(u),fe=u.events.length,T=Ws(u.date,s.date);x.dayHeads.push({date:u.date,y:M,label:Ce(u.date)+(T?` · ${T}`:""),sub:(fe?`${fe} ${fe===1?"activity":"activities"}`:"Nothing scheduled")+(ue?` · ${ue} to sort out`:""),warn:ue>0}),x.anchors.push({t:Z,y:M});let F=M+tt+vt,R=$.flatMap(d=>u.drivers[d]?.outings??[]);if(!fe&&!R.length){x.empties.push({key:u.date,y:F,text:"No activities or rides"}),M=F+40,x.anchors.push({t:Z+1439,y:M});return}let ne=(d,_,k,P,A,S,b)=>{let I=m.get(d.kid)??se(0),O=d.lines;return{key:`${u.date}|card|${d.id}`,x:_,y:k,w:P,h:A,target:{day:u.date,event:d.id},event:d,color:I,kidName:g(d.kid),clash:S,stayed:d.stay&&$.includes(d.drop),time:`${w(d.start)}–${w(d.end)}`+(d.arrive_by!=null?` · arrive ${w(d.arrive_by)}`:""),drop:O.drop,pick:O.pick,showDrop:!!O.drop&&(b||A>=56),showPick:!!O.pick&&(b||A>=74),wrap:b,aria:`${g(d.kid)}, ${d.title} ${w(d.start)} to ${w(d.end)}. `+[O.drop,O.pick].filter(J=>!!J).map(J=>J.text).join(". ")}},ye=d=>{let _=u.rides[d];return _?(u.drivers[_.driver]?.segments??[]).filter(P=>P.type!=="home"&&P.kids.includes(_.kid)&&j(P.start)>=j(_.start)&&j(P.end)<=j(_.end)):[]},$e=d=>{let _=u.rides[d];if(!_)return null;let k=_.serves.find(P=>V.get(P)?.kid===_.kid);return K(k??_.serves[0])},C=new Map;for(let d of u.issues)d.level!=="problem"||!d.event||(d.kind==="late"&&C.set(d.event,`${Math.round(j(d.minutes))} min late`),d.kind==="waiting"&&C.set(`${d.event}|pick`,`Waits ${Math.round(j(d.minutes))} min`));if(!n){let d=1/0,_=-1/0;for(let b of u.events)d=Math.min(d,b.start-20,b.arrive_by!=null?b.arrive_by-10:1/0),_=Math.max(_,b.end+20);for(let b of R)b.start!=null&&(d=Math.min(d,b.start)),b.end!=null&&(_=Math.max(_,b.end));u.date===s.date&&Number.isFinite(d)&&s.minutes>d-60&&s.minutes<_&&(d=Math.min(d,s.minutes-15));let k=Number.isFinite(d)?Math.floor((d-5)/30)*30:900,P=Number.isFinite(_)?Math.ceil((_+5)/30)*30:960,A=b=>Math.round(F+(Math.max(k,Math.min(P,b))-k)*Ds);x.anchors.push({t:Z+k,y:A(k)},{t:Z+P,y:A(P)});for(let b of l){let I=r.get(b),O=m.get(b),J=(u.kids[b]?.items??[]).filter(D=>D.start!=null&&D.end!=null).map(D=>({item:D,s:j(D.start),en:j(D.end)}));for(let D of Ls(J)){let f=I.w/D.cols,z=Math.round(I.x+D.col*f),B=Math.round(f-(D.cols>1?4:0)),L=A(D.s),re=D.item;if(re.type==="act"){let U=V.get(re.event??"");if(!U)continue;let At=Math.max(30,A(D.en)-L);if(x.cards.push(ne(U,z,L,B,At,re.clash,!1)),U.arrive_by!=null&&U.start-U.arrive_by>=5){let Pt=A(U.arrive_by);x.preps.push({key:`${u.date}|prep|${U.id}`,x:z,y:Pt,w:B,h:L-Pt+6,color:O,label:`Arrive by ${w(U.arrive_by)}`})}let Et=C.get(U.id);Et&&x.marks.push({key:`${u.date}|late|${U.id}`,x:z+B-4,y:L+4,text:Et,right:!0});let Tt=C.get(`${U.id}|pick`);Tt&&x.marks.push({key:`${u.date}|wait|${U.id}`,x:z+4,y:L+At+2,text:Tt,right:!1});continue}let N=u.rides[re.ride??-1];if(!N)continue;let ge=Math.max(22,A(D.en)-L),we=xt(ye(N.index),y),H=E(N.driver);x.rides.push({key:`${u.date}|ride|${N.index}`,x:z,y:L,w:B,h:ge,target:$e(N.index),l1:`${N.own?"In":"Along in"} ${H}’s car`,l2:we.join(" → "),show2:ge>=36,dashed:!N.own,clash:re.clash,aria:`${g(b)} ${N.own?"in":"riding along in"} ${H}’s car, ${w(j(N.start))} to ${w(j(N.end))}: ${we.join(" to ")}`});let ae=r.get(N.driver);ae&&x.bands.push({key:`${u.date}|band|${N.index}`,x:z+B,y:L,w:Math.max(0,ae.x+8-(z+B)),h:ge,color:O})}}for(let b of $){let I=r.get(b),O=u.drivers[b];if(!O)continue;let J=[],D=null;for(let f of O.segments)if(!(f.start==null||f.end==null)){if(f.type==="home"){D=null;continue}if(f.type==="stay"){D=null,J.push({type:"stay",g:f,s:f.start,en:f.end});continue}D&&D.en===f.start?(D.en=f.end,D.legs.push(f)):(D={type:"trip",s:f.start,en:f.end,legs:[f]},J.push(D))}for(let f of J){let z=A(f.s),B=Math.max(24,A(f.en)-z);if(f.type==="stay"){let H=V.get(f.g.event??f.g.serves??""),ae=H?m.get(H.kid)??se(0):se(0),U=f.g.kids.map(g);x.stays.push({key:`${u.date}|stay|${b}|${f.s}`,x:I.x+8,y:z,w:I.w-16,h:B,target:K(H?.id),color:ae,l1:H?`At ${H.title} with ${g(H.kid)}`:"Staying",l2:`until ${w(f.en)}`+(U.length?` · ${U.join(" and ")} too`:"")});continue}let L=f.legs[0],re=f.legs[f.legs.length-1],N=[];for(let H of f.legs)for(let ae of H.kids)N.includes(ae)||N.push(ae);let ge=re.type==="drive"&&re.to==="home",we=xt(f.legs,y);x.trips.push({key:`${u.date}|trip|${b}|${f.s}`,x:I.x+8,y:z,w:I.w-16,h:B,target:K(f.legs.find(H=>H.serves)?.serves),l1:L.type==="drive"&&L.from==="home"?`Leave ${w(f.s)}`:`From ${Qe(y,L.from??L.place)} ${w(f.s)}`,l2:we.join(" → "),show2:B>=36,l3:ge?`Home ${w(f.en)}`:"",show3:ge&&B>=62,stops:null,kids:N.map(H=>(m.get(H)??se(0)).color),bad:f.legs.some(H=>H.overlaps_busy),aria:`${E(b)} drives ${we.join(" to ")}, ${w(f.s)} to ${w(f.en)}`})}for(let f of O.segments)if(!(!f.overlaps_busy||f.start==null||f.end==null))for(let z of O.busy){let B=Math.max(f.start,z.start),L=Math.min(f.end,z.end);L<=B||x.overlaps.push({key:`${u.date}|overlap|${b}|${B}`,x:I.x+6,y:A(B)-2,w:I.w-12,h:Math.max(8,A(L)-A(B)+4)})}for(let f of O.busy){if(f.end<=k||f.start>=P)continue;let z=A(f.start),B=A(f.end);x.busy.push({key:`${u.date}|busy|${b}|${f.start}`,x:I.x+1,y:z,w:I.w-2,h:B-z,labelY:8,label:`${f.title} until ${w(f.end)}`})}}let S=-1/0;for(let b=k;b<=P;b+=30)x.grid.push({key:`${u.date}|grid|${b}`,y:A(b),strong:b%60===0}),b%60===0&&A(b)-S>=22&&(x.hours.push({key:`${u.date}|hour|${b}`,y:A(b)-8,label:qt(b)}),S=A(b));u.date===s.date&&s.minutes>k&&s.minutes<P&&(x.now={y:A(s.minutes),label:`Now ${w(s.minutes)}`}),M=A(P)+vt;return}let Y=[];for(let d of l){let _=r.get(d);for(let k of u.kids[d]?.items??[])if(k.start!=null)if(k.type==="act"){let P=V.get(k.event??"");if(!P)continue;Y.push({col:d,s:k.start,h:Vs(P,_.w),kind:"act",item:k})}else u.rides[k.ride??-1]?.own||Y.push({col:d,s:k.start,h:44,kind:"along",item:k})}for(let d of $){let _=u.drivers[d];if(_){for(let k of _.busy)Y.push({col:d,s:k.start,h:32,kind:"busy",busy:k});for(let k of _.outings)k.start!=null&&Y.push({col:d,s:k.start,h:30+k.lines.length*16+(k.warn?16:0),kind:"out",out:k})}}Y.sort((d,_)=>d.s-_.s||c.indexOf(d.col)-c.indexOf(_.col));let nt=new Map,_t=F;Y.forEach((d,_)=>{let k=nt.get(d.col),P=Math.max(k!=null?k+Rs:F,_t);nt.set(d.col,P+d.h),_t=P,x.anchors.push({t:Z+d.s,y:P});let A=r.get(d.col);if(d.kind==="busy")x.busy.push({key:`${u.date}|busy|${d.col}|${_}`,x:A.x+1,y:P,w:A.w-2,h:d.h,labelY:8,label:`${d.busy.title} ${w(d.busy.start)}–${w(d.busy.end)}`});else if(d.kind==="out"){let S=d.out;x.trips.push({key:`${u.date}|trip|${d.col}|${_}`,x:A.x+8,y:P,w:A.w-16,h:d.h,target:K(S.target),l1:S.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...S.lines.map(b=>({text:b,warn:!1})),...S.warn?[{text:S.warn,warn:!0}]:[]],kids:S.kids.map(b=>(m.get(b)??se(0)).color),bad:!!S.warn,aria:`${E(d.col)}: ${S.lead}. ${S.lines.join(". ")}${S.warn?`. ${S.warn}`:""}`})}else if(d.kind==="act"){let S=V.get(d.item.event??"");x.cards.push(ne(S,A.x,P,A.w,d.h,d.item.clash,!0))}else{let S=u.rides[d.item.ride??-1],b=xt(ye(S.index),y),I=E(S.driver);x.rides.push({key:`${u.date}|ride|${S.index}`,x:A.x,y:P,w:A.w,h:d.h,target:$e(S.index),l1:`Along with ${I} ${w(j(S.start))}`,l2:b.join(" → "),show2:!0,dashed:!0,clash:d.item.clash,aria:`${g(d.col)} riding along with ${I}, ${w(j(S.start))} to ${w(j(S.end))}: ${b.join(" to ")}`})}});let rt=F;for(let d of nt.values())rt=Math.max(rt,d);M=rt+vt+6,x.anchors.push({t:Z+1439,y:M})}),x.height=M,x}var Ks=2;function cs(i,t){let e=[],s=0;for(let n of i.days){let o=bt(t,n.date),a=o===0?"":`${me(n.date)} · `,p=new Map(n.events.map(l=>[l.id,l])),r=l=>l&&p.has(l)?{day:n.date,event:l}:null;for(let l of n.issues)l.level==="problem"&&(s++,e.push({key:`${n.date}|${l.key}`,tone:l.kind==="unassigned"?"unassigned":"problem",title:a+l.title,body:l.body,target:r(l.event),suggestions:(l.suggestions??[]).map($=>({id:$.id,label:$.label,note:$.note}))}));if(n.clashes.forEach((l,$)=>{s++;let c=p.get(l.a.event??""),m=ie(i,l.kid),y="";if(l.b.type==="act"){let g=p.get(l.b.event??"");y=c&&g?`${c.title} ${w(c.start)}–${w(c.end)} and ${g.title} ${w(g.start)}–${w(g.end)} overlap.`:""}else{let g=n.rides[l.b.ride??-1];y=c&&g?`${m} is in ${it(i,g.driver)}’s car ${w(j(l.b.start))}–${w(j(l.b.end))}, during ${c.title}.`:""}e.push({key:`${n.date}|clash|${$}`,tone:"problem",title:`${a}${m} is double-booked`,body:y,target:r(l.a.event),suggestions:[]})}),o>=0&&o<Ks)for(let l of n.issues)l.level==="heads_up"&&e.push({key:`${n.date}|${l.key}`,tone:"heads_up",title:a+l.title,body:l.body,target:r(l.event),suggestions:[]});for(let l of n.events)l.problems.length&&e.push({key:`${n.date}|notes|${l.id}`,tone:"heads_up",title:`${a}Check the notes on ${ie(i,l.kid)}’s ${l.title}`,body:`These lines couldn’t be read: ${l.problems.join("; ")}`,target:r(l.id),suggestions:[]})}return{items:e,problems:s}}var hs=_e`
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
    gap: 10px;
  }

  header {
    flex: none;
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 56px;
  }
  .narrow header {
    flex-wrap: wrap;
    row-gap: 8px;
  }
  .narrow .titles {
    flex-basis: calc(100% - 60px);
  }
  .narrow .controls {
    flex: 1 1 100%;
    justify-content: space-between;
  }
  .titles {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  h1 {
    margin: 0;
    font-size: 32px;
    line-height: 38px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .narrow h1 {
    font-size: 22px;
    line-height: 28px;
  }
  .titles p {
    margin: 0;
    font-size: 16px;
    color: var(--muted);
  }
  .narrow .titles p {
    font-size: 13px;
  }
  .titles .bad {
    color: var(--bad-ink);
    font-weight: 600;
  }
  .controls {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: none;
  }
  .narrow .controls {
    gap: 8px;
  }
  .hint {
    font-size: 14px;
    color: var(--muted);
    text-align: right;
    max-width: 230px;
  }
  .seg {
    display: inline-flex;
    padding: 4px;
    gap: 4px;
    border-radius: 13px;
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
  .seg-btn[aria-pressed="true"] {
    background: var(--ink);
    color: #fff;
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
    height: 60px;
    background: var(--bg);
  }
  .col-head {
    position: absolute;
    top: 0;
    height: 52px;
    padding: 4px 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .col-head .name {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    line-height: 24px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    flex: none;
    display: inline-block;
  }
  .col-head .sub {
    font-size: 12.5px;
    line-height: 17px;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    top: 60px;
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
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    white-space: nowrap;
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
    background: var(--surface);
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
  .card {
    padding: 6px 9px;
    border-radius: 10px;
    border: 1.5px solid;
    text-align: left;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2px;
  }
  .card.sel {
    box-shadow: 0 0 0 3px var(--ring);
    z-index: 2;
  }
  .card .top {
    display: flex;
    flex-direction: column;
    gap: 1px;
    max-width: 100%;
  }
  .card .title {
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    background: #fff;
    border: 1.5px solid var(--dark);
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
    display: -webkit-box;
    -webkit-line-clamp: 2;
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
    border-radius: 9px;
    border: 0;
    background: var(--dark);
    color: #fff;
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
    width: 9px;
    height: 9px;
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
    height: 2px;
    background: var(--bad);
    opacity: 0.85;
    pointer-events: none;
    z-index: 4;
  }
  .now-label {
    left: 0;
    padding: 1px 5px;
    border-radius: 5px;
    background: var(--bad);
    color: #fff;
    font-size: 11.5px;
    line-height: 16px;
    font-weight: 700;
    pointer-events: none;
    z-index: 4;
  }

  .empty-state,
  .quiet {
    margin: auto;
    max-width: 460px;
    text-align: center;
    color: var(--muted);
    font-size: 15px;
    line-height: 22px;
  }
  .quiet {
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    width: min(460px, 90%);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 18px 20px;
    pointer-events: none;
    z-index: 7;
  }
  .big {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin: 0 0 6px;
  }
  .empty-state p,
  .quiet p {
    margin: 0 0 12px;
  }

  .panel {
    width: 360px;
    flex: none;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 16px;
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
  .all-clear {
    margin: 0;
    font-size: 15px;
    line-height: 22px;
    color: var(--ok);
    font-weight: 600;
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
`;var us="mydashlight.rides.mode",Fs=1100,Ys=700,qs=3*6e4,Gs=1200;function Xs(){try{return localStorage.getItem(us)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Zs(i){try{localStorage.setItem(us,i)}catch{}}var Re=class extends G{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let s=e.currentTarget;this.drag={el:s,x:e.clientX,y:e.clientY,top:s.scrollTop,left:s.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let s=this.drag;if(!s)return;let n=e.clientX-s.x,o=e.clientY-s.y;if(!s.moved){if(Math.abs(n)+Math.abs(o)<6)return;s.moved=!0;try{s.el.setPointerCapture(s.id)}catch{}s.el.classList.add("dragging")}s.el.scrollTop=s.top-o,s.el.scrollLeft=s.left-n};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.scrollToNow()},qs))};this.onKey=e=>{e.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=Xs(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{this.tick++},3e4),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){if(!(!this.scroller||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let s=this.keepAt;this.keepAt=null,this.scrollToTime(s)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.backend&&(this.stopWatching=this.backend.watch(e=>{this.plan=e,this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){return this.width>=Fs}today(){return Me(this.plan?.time_zone??"UTC")}currentBoard(){let e=this.plan;if(!e)return null;let s=this.today(),n=`${this.mode}|${this.boardWidth}|${s.date}|${s.minutes}`;return(this.board==null||e!==this.boardPlan||n!==this.boardKey)&&(this.board=ps(e,this.mode,this.boardWidth,s),this.boardPlan=e,this.boardKey=n),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(s=>s.date===e):-1}scrollToTime(e){let s=this.scroller;!s||!this.board||(s.scrollTop=Math.max(0,ls(this.board,e)-tt-4),this.syncDay())}scrollToNow(){if(!this.plan)return;let e=this.today(),s=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(s*1440+(this.mode==="timeline"&&s===this.dayIndexOf(e.date)?e.minutes-45:0))}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let s=e.scrollTop,n=this.board.dayHeads[0];for(let p of this.board.dayHeads)p.y<=s+1&&(n=p);let o=this.renderRoot.querySelector(".pinned .label"),a=this.renderRoot.querySelector(".pinned .sub");o&&o.textContent!==n.label&&(o.textContent=n.label),a&&a.textContent!==n.sub&&(a.textContent=n.sub),a?.classList.toggle("warn",n.warn)}setMode(e){if(e===this.mode)return;let s=this.scroller;this.keepAt=s&&this.board?ds(this.board,s.scrollTop+tt+4):null,this.mode=e,Zs(e)}findEvent(e){let s=this.plan?.days.find(o=>o.date===e.day),n=s?.events.find(o=>o.id===e.event);return s&&n?{day:s,event:n}:null}open(e){e&&(this.flushArrive(),this.sel=e,this.scope="this",this.arriveDraft=void 0)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,s,n){if(!this.pending){this.pending={key:e,value:s};try{await n()}catch(o){let a=o instanceof q?o:new q("error",String(o));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,s,n){if(!this.backend)return;let o=this.backend;this.save(`${s}`,n,()=>o.setRide(e.id,s,n,this.scope))}toggleStay(e){if(!this.backend)return;let s=this.backend;this.save("stay",!e.stay,()=>s.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,s){if(!this.backend)return;let n=this.backend,o=e.along.includes(s)?e.along.filter(a=>a!==s):[...e.along,s];this.save("along",o,()=>n.setTakeAlong(e.id,o,this.scope))}nudgeArrive(e,s){let n=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;s<0?o=(n??e.start)-5:o=n==null||n+5>=e.start?null:n+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Gs)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,s=this.sel;if(e===void 0||!s||!this.backend)return;let n=this.findEvent(s);if(!n||n.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,a=n.event.id,p=this.scope;this.save("arrive",e,()=>o.setArriveBy(a,e,p)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let s=this.backend;this.save(`fix|${e}`,e,()=>s.applySuggestion(e))}render(){let e=this.plan,s=this.currentBoard(),n=e?cs(e,this.today().date):{items:[],problems:0},o=this.wide||this.sheet||!!this.sel;return h`
      <div class="app ${this.wide?"wide":this.width<Ys?"narrow phone":"narrow"}">
        ${this.renderHeader(e,n.problems)} ${this.renderBanner(e)}
        <main>
          <section class="board-area" aria-label="Everyone’s week">${s?this.renderBoard(s):this.renderEmpty()}</section>
          ${o?h`${this.wide?v:h`<div class="backdrop" @click=${()=>this.closePanel()}></div>`}
                <aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
                  ${this.sel&&e?this.renderEditor(e):this.renderAttention(n.items,n.problems)}
                </aside>`:v}
        </main>
        ${this.toast?h`<div class="toast" role="status">${this.toast}</div>`:v}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(e,s){let n=e?.days.length?Zt(e.days[0].date,e.days[e.days.length-1].date):"";this.tick;let o="";if(e){let p=e.time_zone,r=new Date(e.updated);this.error?o=h`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Ye(r,new Date,p)}</span>`:e.status&&!e.status.ok?o=h`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Ye(r,new Date,p)}</span>`:this.backend?.live||(o=`Updated ${Ye(r,new Date,p)}`)}let a=(p,r,l)=>h`
      <button type="button" class="seg-btn" aria-pressed=${this.mode===p?"true":"false"} @click=${()=>this.setMode(p)}>
        ${l}${r}
      </button>
    `;return h`
      <header>
        ${this.showMenu?h`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Ve`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:v}
        <div class="titles">
          <h1>Everyone’s week</h1>
          <p>${n}${n&&o?" · ":""}${o}</p>
        </div>
        <div class="controls">
          ${this.wide?h`<span class="hint">${this.mode==="compact"?"Everything in order, no time scale":"Spacing matches the clock"}</span>`:h`<button type="button" class="attn-btn ${s?"has":""}" @click=${()=>{this.sheet=!0}}>
                Needs attention <span class="count">${s}</span>
              </button>`}
          <div role="group" aria-label="View" class="seg">
            ${a("timeline","Timeline",Ve`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`)}
            ${a("compact","Compact",Ve`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderBanner(e){let s=e?.unavailable_calendars.length??0;return s?h`<div class="banner" role="status">
      Couldn’t read ${s===1?"one calendar":`${s} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:v}renderEmpty(){return this.error?h`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:h`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let s=this.plan,n=this.sel,o=r=>!!r&&!!n&&r.day===n.day&&r.event===n.event,a=e.dayHeads[0],p=e.width;return h`
      <div
        class="scroller"
        @pointerdown=${this.onDown}
        @pointermove=${this.onMove}
        @pointerup=${this.onUp}
        @pointercancel=${this.onUp}
        @click=${this.onClickCapture}
        @scroll=${()=>this.syncDay()}
      >
        <div class="heads" style="width:${p}px">
          ${e.columns.map(r=>h`<div class="col-head" style="left:${r.x}px;width:${r.w}px">
              <span class="name"><span class="dot" style="background:${r.dot}"></span>${r.name}</span>
              <span class="sub ${r.subWarn?"warn":""}">${r.sub}</span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${p}px">
          <span class="label">${a?.label??""}</span><span class="sub ${a?.warn?"warn":""}">${a?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${p}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(r=>h`<div class="col-bg ${r.kind}" style="left:${r.x}px;width:${r.w}px;height:${Math.max(e.height+392,592)}px"></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(r=>h`<div class="day-head" style="top:${r.y}px;width:${p}px">
              <span class="label">${r.label}</span><span class="sub ${r.warn?"warn":""}">${r.sub}</span>
            </div>`)}
          ${e.empties.map(r=>h`<span class="empty" style="top:${r.y}px">${r.text}</span>`)}
          ${e.grid.map(r=>h`<div class="grid ${r.strong?"strong":""}" style="top:${r.y}px;width:${p-60}px"></div>`)}
          ${e.hours.map(r=>h`<span class="hour" style="top:${r.y}px">${r.label}</span>`)}
          ${X(e.bands,r=>r.key,r=>h`<div
                class="band"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:rgba(${r.color.rgb},0.10);border-color:rgba(${r.color.rgb},0.45)"
              ></div>`)}
          ${X(e.busy,r=>r.key,r=>h`<div class="busy" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px">
                <span style="top:${r.labelY}px">${r.label}</span>
              </div>`)}
          ${X(e.preps,r=>r.key,r=>h`<div
                class="prep"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:rgba(${r.color.rgb},0.07);color:${r.color.ink}"
              >
                ${r.label}
              </div>`)}
          ${X(e.cards,r=>r.key,r=>{let l=r.color,$=r.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), #fff`:`linear-gradient(rgba(${l.rgb},0.13), rgba(${l.rgb},0.13)), #fff`;return h`<button
                type="button"
                class="card ${r.wrap?"wrap":""} ${o(r.target)?"sel":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:${$};border-color:${r.clash?"var(--bad)":l.color};--ring:${l.color}"
                @click=${()=>this.open(r.target)}
              >
                <span class="top">
                  <span class="title" style="color:${l.ink}">${r.event.title}</span>
                  <span class="time">${r.time}</span>
                  ${r.showDrop&&r.drop?h`<span class="line tone-${r.drop.tone}">${r.drop.text}</span>`:v}
                </span>
                ${r.showPick&&r.pick?h`<span class="line tone-${r.pick.tone}">${r.pick.text}</span>`:v}
              </button>`})}
          ${X(e.rides,r=>r.key,r=>h`<button
                type="button"
                class="ride ${r.dashed?"dashed":""} ${r.clash?"clash":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}</span>${r.show2?h`<span class="l2">${r.l2}</span>`:v}
              </button>`)}
          ${X(e.stays,r=>r.key,r=>h`<button
                type="button"
                class="stay"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:repeating-linear-gradient(135deg, rgba(${r.color.rgb},0.28) 0px, rgba(${r.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1" style="color:${r.color.ink}">${r.l1}</span><span class="l2">${r.l2}</span>
              </button>`)}
          ${X(e.trips,r=>r.key,r=>h`<button
                type="button"
                class="trip ${r.bad?"bad":""} ${r.stops?"list":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}${r.kids.map(l=>h`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${r.show2?h`<span class="l2">${r.l2}</span>`:v}
                ${r.stops?r.stops.map(l=>h`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):v}
                ${r.show3?h`<span class="l3">${r.l3}</span>`:v}
              </button>`)}
          ${X(e.overlaps,r=>r.key,r=>h`<div class="overlap" aria-hidden="true" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`)}
          ${X(e.marks,r=>r.key,r=>h`<span class="mark" style="left:${r.x}px;top:${r.y}px;${r.right?"transform:translateX(-100%)":""}">${r.text}</span>`)}
          ${e.now?h`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1}px;width:${p-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:v}
        </div>
      </div>
      ${s.days.every(r=>!r.events.length)?h`<div class="quiet" role="status">
            <p class="big">Nothing on the kids’ calendars this week</p>
            <p>Activities on ${xe(s).map(r=>ie(s,r)).join(", ")}’s calendars show up here within a minute.</p>
          </div>`:v}
    `}renderAttention(e,s){let n=this.plan;return h`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${s?"bad":"ok"}">${s}</span>
        ${this.wide?v:h`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${n&&!s?h`<p class="all-clear">Every ride is covered and nobody is double-booked.</p>`:v}
      ${e.map(o=>h`<div class="issue ${o.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${o.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${o.target?h`<button type="button" class="issue-title" @click=${()=>this.open(o.target)}>${o.title}</button>`:h`<strong class="issue-title">${o.title}</strong>`}
              <span class="issue-body">${o.body}</span>
            </div>
          </div>
          ${o.suggestions.length?h`<div class="fixes">
                ${o.suggestions.map(a=>h`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(a.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${a.id}`?"Saving…":a.label}</span>
                    <span class="fix-note">${a.note}</span>
                  </button>`)}
              </div>`:v}
        </div>`)}
      ${this.wide?this.renderLegend():v}
    `}renderLegend(){return h`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let s=this.findEvent(this.sel);if(!s)return h``;let{day:n,event:o}=s,a=De(e),r=st(e).get(o.kid)??se(0),l=!!this.pending,$=T=>this.pending?.key===T?this.pending.value:void 0,c=[...e.people?.carpools??[]];for(let T of e.days)for(let F of T.events)for(let R of[F.drop,F.pick])R&&R!=="none"&&!a.includes(R)&&!c.some(ne=>ne.toLowerCase()===R.toLowerCase())&&c.push(R);let m=T=>{if(!o.sides.includes(T))return v;let F=$(T),R=F!==void 0?String(F):T==="drop"?o.drop:o.pick,ne=R&&R!=="none"&&!a.includes(R)?R:"",ye=C=>this.setRide(o,T,R===C?"":C),$e=[...a.map(C=>[C,kt(e,C)]),["none","Not needed"]];return h`<div class="field">
        <span class="field-label">${T==="drop"?"Drop-off":"Pick-up"} ${R===""?h`<span class="nobody">· nobody yet</span>`:v}</span>
        <div role="group" aria-label=${T==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${$e.length}, minmax(0, 1fr))">
          ${$e.map(([C,Y])=>h`<button type="button" class="choice" aria-pressed=${R===C?"true":"false"} ?disabled=${l} @click=${()=>ye(C)}>
                ${Y}
              </button>`)}
        </div>
        ${c.length?h`<div role="group" aria-label=${T==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${c.map(C=>h`<button type="button" class="chip" aria-pressed=${R.toLowerCase()===C.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>ye(C)}>
                    ${C}
                  </button>`)}
            </div>`:v}
        <input
          type="text"
          .value=${ne&&!c.some(C=>C.toLowerCase()===ne.toLowerCase())?ne:""}
          ?disabled=${l}
          aria-label=${T==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${C=>{let Y=C.target.value.trim();Y&&Y!==R&&this.setRide(o,T,Y)}}
          @keydown=${C=>{C.key==="Enter"&&C.target.blur()}}
        />
      </div>`},y=$("stay"),g=y!==void 0?!!y:o.stay,E=o.drop===o.pick&&a.includes(o.drop),x=$("along"),M=x!==void 0?x:o.along,u=xe(e).filter(T=>T!==o.kid),W=a.includes(o.drop)&&o.sides.includes("drop"),Z=$("arrive"),V=this.arriveDraft!==void 0?this.arriveDraft:Z!==void 0?Z:o.arrive_by,K=[],ue=T=>T==="none"?"Not needed":kt(e,T);o.drop!==""&&K.push(`Drop-off: ${ue(o.drop)}`),o.pick!==""&&K.push(`Pick-up: ${ue(o.pick)}`),o.stay&&K.push("Stay: yes"),o.along.length&&K.push(`Take along: ${o.along.map(T=>ie(e,T)).join(", ")}`),o.arrive_by!=null&&K.push(`Arrive by: ${Ke(o.arrive_by)}`);let fe=n.date===this.today().date?"":`${me(n.date)} · `;return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${r.color}"></span>${ie(e,o.kid)} · ${o.title}</span>
          <span class="ed-meta">${fe}${w(o.start)}–${w(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>
      ${this.pending?h`<p class="saving" role="status">Saving to Google Calendar…</p>`:v}
      ${o.recurring?h`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${me(n.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:v}
      ${m("drop")} ${m("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${g?"true":"false"} ?disabled=${!E||l} @click=${()=>this.toggleStay(o)}>
          ${E?g?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${W&&u.length?h`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${u.map(T=>h`<button type="button" class="chip" aria-pressed=${M.includes(T)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(o,T)}>
                  ${ie(e,T)}
                </button>`)}
            </div>
          </div>`:v}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${V!=null?`${o.start-V} min before it starts`:`Aims for a few minutes before ${w(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${l} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${V!=null?w(V):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${l||V==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${V!=null?h`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:v}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${K.length?K.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?h`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:v}
      <p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>
    `}};Re.styles=hs,Re.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Re);var Be=class extends G{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new qe(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return h`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>`}};Be.styles=_e`
    :host {
      display: block;
      height: 100%;
    }
    mydashlight-board {
      height: 100%;
    }
  `,Be.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",Be);
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
