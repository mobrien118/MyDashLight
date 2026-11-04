var We=globalThis,Ve=We.ShadowRoot&&(We.ShadyCSS===void 0||We.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ut=Symbol(),Ht=new WeakMap,ze=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==ut)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Ve&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ht.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ht.set(e,t))}return t}toString(){return this.cssText}},It=i=>new ze(typeof i=="string"?i:i+"",void 0,ut),De=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,r,o)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new ze(e,i,ut)},Lt=(i,t)=>{if(Ve)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),r=We.litNonce;r!==void 0&&n.setAttribute("nonce",r),n.textContent=e.cssText,i.appendChild(n)}},gt=Ve?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return It(e)})(i):i;var{is:Pn,defineProperty:Sn,getOwnPropertyDescriptor:Mn,getOwnPropertyNames:Cn,getOwnPropertySymbols:zn,getPrototypeOf:Dn}=Object,Ke=globalThis,Ut=Ke.trustedTypes,Rn=Ut?Ut.emptyScript:"",Nn=Ke.reactiveElementPolyfillSupport,Re=(i,t)=>i,ft={toAttribute(i,t){switch(t){case Boolean:i=i?Rn:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},jt=(i,t)=>!Pn(i,t),Ot={attribute:!0,type:String,converter:ft,reflect:!1,useDefault:!1,hasChanged:jt};Symbol.metadata??=Symbol("metadata"),Ke.litPropertyMetadata??=new WeakMap;var se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ot){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(t,n,e);r!==void 0&&Sn(this.prototype,t,r)}}static getPropertyDescriptor(t,e,n){let{get:r,set:o}=Mn(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let s=r?.call(this);o?.call(this,a),this.requestUpdate(t,s,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ot}static _$Ei(){if(this.hasOwnProperty(Re("elementProperties")))return;let t=Dn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Re("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Re("properties"))){let e=this.properties,n=[...Cn(e),...zn(e)];for(let r of n)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,r]of e)this.elementProperties.set(n,r)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let r=this._$Eu(e,n);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let r of n)e.unshift(gt(r))}else t!==void 0&&e.push(gt(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Lt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,n);if(r!==void 0&&n.reflect===!0){let o=(n.converter?.toAttribute!==void 0?n.converter:ft).toAttribute(e,n.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let n=this.constructor,r=n._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=n.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:ft;this._$Em=r;let s=a.fromAttribute(e,o.type);this[r]=s??this._$Ej?.get(r)??s,this._$Em=null}}requestUpdate(t,e,n,r=!1,o){if(t!==void 0){let a=this.constructor;if(r===!1&&(o=this[t]),n??=a.getPropertyOptions(t),!((n.hasChanged??jt)(o,e)||n.useDefault&&n.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:r,wrapped:o},a){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[r,o]of n){let{wrapped:a}=o,s=this[r];a!==!0||this._$AL.has(r)||s===void 0||this.C(r,void 0,o,s)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};se.elementStyles=[],se.shadowRootOptions={mode:"open"},se[Re("elementProperties")]=new Map,se[Re("finalized")]=new Map,Nn?.({ReactiveElement:se}),(Ke.reactiveElementVersions??=[]).push("2.1.2");var mt=globalThis,qt=i=>i,Fe=mt.trustedTypes,Wt=Fe?Fe.createPolicy("lit-html",{createHTML:i=>i}):void 0,xt="$lit$",re=`lit$${Math.random().toFixed(9).slice(2)}$`,vt="?"+re,Bn=`<${vt}>`,xe=document,Be=()=>xe.createComment(""),He=i=>i===null||typeof i!="object"&&typeof i!="function",yt=Array.isArray,Xt=i=>yt(i)||typeof i?.[Symbol.iterator]=="function",bt=`[ 	
\f\r]`,Ne=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Vt=/-->/g,Kt=/>/g,be=RegExp(`>|${bt}(?:([^\\s"'>=/]+)(${bt}*=${bt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ft=/'/g,Yt=/"/g,Zt=/^(?:script|style|textarea|title)$/i,$t=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),d=$t(1),Ee=$t(2),wi=$t(3),oe=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),Gt=new WeakMap,me=xe.createTreeWalker(xe,129);function Qt(i,t){if(!yt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Wt!==void 0?Wt.createHTML(t):t}var Jt=(i,t)=>{let e=i.length-1,n=[],r,o=t===2?"<svg>":t===3?"<math>":"",a=Ne;for(let s=0;s<e;s++){let l=i[s],c,m,h=-1,f=0;for(;f<l.length&&(a.lastIndex=f,m=a.exec(l),m!==null);)f=a.lastIndex,a===Ne?m[1]==="!--"?a=Vt:m[1]!==void 0?a=Kt:m[2]!==void 0?(Zt.test(m[2])&&(r=RegExp("</"+m[2],"g")),a=be):m[3]!==void 0&&(a=be):a===be?m[0]===">"?(a=r??Ne,h=-1):m[1]===void 0?h=-2:(h=a.lastIndex-m[2].length,c=m[1],a=m[3]===void 0?be:m[3]==='"'?Yt:Ft):a===Yt||a===Ft?a=be:a===Vt||a===Kt?a=Ne:(a=be,r=void 0);let b=a===be&&i[s+1].startsWith("/>")?" ":"";o+=a===Ne?l+Bn:h>=0?(n.push(c),l.slice(0,h)+xt+l.slice(h)+re+b):l+re+(h===-2?s:b)}return[Qt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Ie=class i{constructor({strings:t,_$litType$:e},n){let r;this.parts=[];let o=0,a=0,s=t.length-1,l=this.parts,[c,m]=Jt(t,e);if(this.el=i.createElement(c,n),me.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=me.nextNode())!==null&&l.length<s;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(xt)){let f=m[a++],b=r.getAttribute(h).split(re),$=/([.?@])?(.*)/.exec(f);l.push({type:1,index:o,name:$[2],strings:b,ctor:$[1]==="."?Ge:$[1]==="?"?Xe:$[1]==="@"?Ze:ye}),r.removeAttribute(h)}else h.startsWith(re)&&(l.push({type:6,index:o}),r.removeAttribute(h));if(Zt.test(r.tagName)){let h=r.textContent.split(re),f=h.length-1;if(f>0){r.textContent=Fe?Fe.emptyScript:"";for(let b=0;b<f;b++)r.append(h[b],Be()),me.nextNode(),l.push({type:2,index:++o});r.append(h[f],Be())}}}else if(r.nodeType===8)if(r.data===vt)l.push({type:2,index:o});else{let h=-1;for(;(h=r.data.indexOf(re,h+1))!==-1;)l.push({type:7,index:o}),h+=re.length-1}o++}}static createElement(t,e){let n=xe.createElement("template");return n.innerHTML=t,n}};function ve(i,t,e=i,n){if(t===oe)return t;let r=n!==void 0?e._$Co?.[n]:e._$Cl,o=He(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=r:e._$Cl=r),r!==void 0&&(t=ve(i,r._$AS(i,t.values),r,n)),t}var Ye=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,r=(t?.creationScope??xe).importNode(e,!0);me.currentNode=r;let o=me.nextNode(),a=0,s=0,l=n[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new Te(o,o.nextSibling,this,t):l.type===1?c=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(c=new Qe(o,this,t)),this._$AV.push(c),l=n[++s]}a!==l?.index&&(o=me.nextNode(),a++)}return me.currentNode=xe,r}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},Te=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,r){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ve(this,t,e),He(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==oe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Xt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&He(this._$AH)?this._$AA.nextSibling.data=t:this.T(xe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,r=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Ie.createElement(Qt(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new Ye(r,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=Gt.get(t.strings);return e===void 0&&Gt.set(t.strings,e=new Ie(t)),e}k(t){yt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,r=0;for(let o of t)r===e.length?e.push(n=new i(this.O(Be()),this.O(Be()),this,this.options)):n=e[r],n._$AI(o),r++;r<e.length&&(this._$AR(n&&n._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=qt(t).nextSibling;qt(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ye=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,r,o){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=x}_$AI(t,e=this,n,r){let o=this.strings,a=!1;if(o===void 0)t=ve(this,t,e,0),a=!He(t)||t!==this._$AH&&t!==oe,a&&(this._$AH=t);else{let s=t,l,c;for(t=o[0],l=0;l<o.length-1;l++)c=ve(this,s[n+l],e,l),c===oe&&(c=this._$AH[l]),a||=!He(c)||c!==this._$AH[l],c===x?t=x:t!==x&&(t+=(c??"")+o[l+1]),this._$AH[l]=c}a&&!r&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ge=class extends ye{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},Xe=class extends ye{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},Ze=class extends ye{constructor(t,e,n,r,o){super(t,e,n,r,o),this.type=5}_$AI(t,e=this){if((t=ve(this,t,e,0)??x)===oe)return;let n=this._$AH,r=t===x&&n!==x||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==x&&(n===x||r);r&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Qe=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){ve(this,t)}},en={M:xt,P:re,A:vt,C:1,L:Jt,R:Ye,D:Xt,V:ve,I:Te,H:ye,N:Xe,U:Ze,B:Ge,F:Qe},Hn=mt.litHtmlPolyfillSupport;Hn?.(Ie,Te),(mt.litHtmlVersions??=[]).push("3.3.3");var tn=(i,t,e)=>{let n=e?.renderBefore??t,r=n._$litPart$;if(r===void 0){let o=e?.renderBefore??null;n._$litPart$=r=new Te(t.insertBefore(Be(),o),o,void 0,e??{})}return r._$AI(i),r};var wt=globalThis,Z=class extends se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=tn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return oe}};Z._$litElement$=!0,Z.finalized=!0,wt.litElementHydrateSupport?.({LitElement:Z});var In=wt.litElementPolyfillSupport;In?.({LitElement:Z});(wt.litElementVersions??=[]).push("4.2.2");function k(i){let t=Math.round(i),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Le(i){let t=Math.floor(Math.round(i)/60)%24;return`${k(i)} ${t<12?"AM":"PM"}`}function nn(i){let t=Math.floor(i/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Oe(i){let t=Math.max(0,Math.round(i)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function sn(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Ln=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Un=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),On=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Je(i){return new Date(`${i}T12:00:00Z`)}function Pe(i){let t=Je(i);return`${Ln.format(t)}, ${On.format(t)}`}function de(i){return Un.format(Je(i))}function et(i,t){return Math.round((Je(t).getTime()-Je(i).getTime())/864e5)}function Ue(i,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Ue("UTC",t)}let n=r=>e.find(o=>o.type===r)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function tt(i,t,e){let n=Math.floor((t.getTime()-i.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let r=Ue(e,i),o=Ue(e,t).date;return r.date===o?`at ${Le(r.minutes)}`:`on ${de(r.date)} at ${Le(r.minutes)}`}var Y=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},kt="mydashlight",jn=7,qn=3e4;function rn(i){if(i instanceof Y)return i;if(i&&typeof i=="object"){let t=i;if(typeof t.message=="string")return new Y(String(t.code??"error"),t.message)}return typeof i=="number"?new Y("connection_lost","Lost the connection to Home Assistant."):new Y("error",String(i))}var nt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new Y("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},qn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new Y("not_running","MyDashLight isn’t running right now."))},{type:`${kt}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:kt,service:"get_plan",service_data:{days:jn},return_response:!0});this.emit(t.response)}catch(t){this.fail(rn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:kt,service:t,service_data:e})}catch(n){throw rn(n)}this.pushing||await this.refresh()}setRide(t,e,n,r){return this.call("set_ride",{event:t,side:e,driver:n,scope:r})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:sn(e),scope:n})}setTakeAlong(t,e,n){return this.call("set_take_along",{event:t,kids:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}};var on={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},an=i=>(...t)=>({_$litDirective$:i,values:t}),it=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Wn}=en,ln=i=>i;var dn=()=>document.createComment(""),Se=(i,t,e)=>{let n=i._$AA.parentNode,r=t===void 0?i._$AB:t._$AA;if(e===void 0){let o=n.insertBefore(dn(),r),a=n.insertBefore(dn(),r);e=new Wn(o,a,i,i.options)}else{let o=e._$AB.nextSibling,a=e._$AM,s=a!==i;if(s){let l;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(l=i._$AU)!==a._$AU&&e._$AP(l)}if(o!==r||s){let l=e._$AA;for(;l!==o;){let c=ln(l).nextSibling;ln(n).insertBefore(l,r),l=c}}}return e},pe=(i,t,e=i)=>(i._$AI(t,e),i),Vn={},pn=(i,t=Vn)=>i._$AH=t,cn=i=>i._$AH,st=i=>{i._$AR(),i._$AA.remove()};var hn=(i,t,e)=>{let n=new Map;for(let r=t;r<=e;r++)n.set(i[r],r);return n},Q=an(class extends it{constructor(i){if(super(i),i.type!==on.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let r=[],o=[],a=0;for(let s of i)r[a]=n?n(s,a):a,o[a]=e(s,a),a++;return{values:o,keys:r}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,n]){let r=cn(i),{values:o,keys:a}=this.dt(t,e,n);if(!Array.isArray(r))return this.ut=a,o;let s=this.ut??=[],l=[],c,m,h=0,f=r.length-1,b=0,$=o.length-1;for(;h<=f&&b<=$;)if(r[h]===null)h++;else if(r[f]===null)f--;else if(s[h]===a[b])l[b]=pe(r[h],o[b]),h++,b++;else if(s[f]===a[$])l[$]=pe(r[f],o[$]),f--,$--;else if(s[h]===a[$])l[$]=pe(r[h],o[$]),Se(i,l[$+1],r[h]),h++,$--;else if(s[f]===a[b])l[b]=pe(r[f],o[b]),Se(i,r[h],r[f]),f--,b++;else if(c===void 0&&(c=hn(a,b,$),m=hn(s,h,f)),c.has(s[h]))if(c.has(s[f])){let u=m.get(a[b]),v=u!==void 0?r[u]:null;if(v===null){let E=Se(i,r[h]);pe(E,o[b]),l[b]=E}else l[b]=pe(v,o[b]),Se(i,r[h],v),r[u]=null;b++}else st(r[f]),f--;else st(r[h]),h++;for(;b<=$;){let u=Se(i,l[$+1]);pe(u,o[b]),l[b++]=u}for(;h<=f;){let u=r[h++];u!==null&&st(u)}return this.ut=a,pn(i,l),oe}});var rt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function G(i){return rt[(i%rt.length+rt.length)%rt.length]}var un="#23272E",gn="35,39,46";var Kn=3,pt=36,_t=12,Fn=8,At=60,Tt=10,at=30,Et=10,Yn=150,Gn=200,dt=1.4;function St(i,t){let e=Math.max(Yn,Gn/dt);return Math.ceil(At+Math.max(0,i-1)*Tt+at+Math.max(0,t-1)*Et+e*(i+dt*t))}function we(i){return i.people?i.people.kids.map(t=>t.id):i.days.length?Object.keys(i.days[0].kids):[]}function ce(i){return i.people?i.people.drivers.map(t=>t.id):i.days.length?Object.keys(i.days[0].drivers):[]}function ke(i){return new Map(we(i).map((t,e)=>[t,G(e)]))}function F(i,t){let e=i.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.kids[t])return n.kids[t].name;return t}function he(i,t){let e=i.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.drivers[t])return n.drivers[t].name;return t}function Mt(i,t){return t==="none"?"Not needed":ce(i).includes(t)?he(i,t):t}function Xn(i){let t=new Map([["home","Home"]]);for(let e of i.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function lt(i,t){return t?i.get(t)??(t.split(",")[0]?.trim()||t):""}function ot(i,t){let e=[];for(let n of i)n.type==="drive"?(e.length||e.push(lt(t,n.from)),e.push(lt(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(lt(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Zn(i){let t=i.map(a=>({...a,col:0,cols:1})).sort((a,s)=>a.s-s.s||s.en-a.en),e=[],n=[],r=-1/0,o=()=>{for(let a of e)a.cols=n.length;e=[],n=[]};for(let a of t){a.s>=r&&(o(),r=-1/0);let s=n.findIndex(l=>l<=a.s);s<0?(s=n.length,n.push(a.en)):n[s]=a.en,a.col=s,e.push(a),r=Math.max(r,a.en)}return o(),t}function Qn(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].y;for(let e=0;e<i.length-1;e++){let n=i[e],r=i[e+1];if(t<=r.t)return r.t===n.t?n.y:Math.round(n.y+(t-n.t)/(r.t-n.t)*(r.y-n.y))}return i[i.length-1].y}function Jn(i,t){if(!i.length)return 0;if(t<=i[0].y)return i[0].t;for(let e=0;e<i.length-1;e++){let n=i[e],r=i[e+1];if(t<=r.y)return r.y===n.y?n.t:n.t+(t-n.y)/(r.y-n.y)*(r.t-n.t)}return i[i.length-1].t}function mn(i,t){return Qn(i.anchors,t)}function xn(i,t){return Jn(i.anchors,t)}function ei(i,t){let e=we(i),n=ce(i),r=Math.max(t,St(e.length,n.length)),a=(r-At-Math.max(0,e.length-1)*Tt-at-Math.max(0,n.length-1)*Et)/(e.length+dt*n.length||1),s=Math.floor(a),l=Math.floor(a*dt),c=new Map;for(let $ of i.days)for(let u of $.events){let v=c.get(u.kid)??[];v.some(E=>E.event_id===u.event_id&&E.calendar_id===u.calendar_id)||v.push(u),c.set(u.kid,v)}let m=ke(i),h=[],f=At;e.forEach(($,u)=>{let v=c.get($)??[],E=i.days.some(g=>g.events.some(R=>R.kid===$&&(R.sides.includes("drop")&&R.drop===""||R.sides.includes("pick")&&R.pick==="")));h.push({id:$,kind:"kid",x:f,w:s,name:F(i,$),dot:m.get($).color,rgb:m.get($).rgb,sub:`${E?"Needs a ride · ":""}${v.length} this week`,subWarn:E}),f+=s+(u<e.length-1?Tt:0)});let b=f+at/2;return f+=at,n.forEach(($,u)=>{let v=0,E=0;for(let g of i.days){let R=g.drivers[$];R&&(v+=R.outings.length,E+=R.drive??0)}h.push({id:$,kind:"driver",x:f,w:l,name:he(i,$),dot:un,rgb:gn,sub:`${v} ${v===1?"trip":"trips"} this week · ${Oe(E)} driving`,subWarn:!1}),f+=l+(u<n.length-1?Et:0)}),{columns:h,sepX:b,width:r}}function ti(i,t){let e=i.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let r=e.slice(t.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(r);if(!o)return e;let a=r.slice(o[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function fn(i,t){let e=i.start<=0,n=i.end>=1440;return e&&n?`${i.title} · all day`:n?`${i.title} from ${k(i.start)}`:e||!t?`${i.title} until ${k(i.end)}`:`${i.title} ${k(i.start)}–${k(i.end)}`}function Ct(i){return i.issues.filter(t=>t.level==="problem").length+i.clashes.length}function ni(i,t){let e=et(t,i);return e===0?"Today":e===1?"Tomorrow":""}function W(i,t=0){return i==null||!Number.isFinite(i)?t:i}function Pt(i,t,e=7){let n=Math.max(8,Math.floor(t/e)),r=1,o=0;for(let a of i.split(/\s+/).filter(Boolean)){let s=a.length;for(o===0?o=s:o+1+s<=n?o+=1+s:(r++,o=s);o>n;)r++,o-=n}return r}var vn=25,yn=15,zt=3;function bn(i){return Math.max(0,Math.min(zt,Math.floor((i-vn)/yn)))}function ii(i,t){let e=Math.min(zt,Pt(i,t-19,6.6));return vn+e*yn+2}function si(i,t){let e=t-23,n=`${k(i.start)}–${k(i.end)}`+(i.arrive_by!=null?` · arrive ${k(i.arrive_by)}`:""),r=33+Pt(n,e,6.6)*16;for(let o of[i.lines.drop,i.lines.pick])o&&(r+=2+Pt(o.text,e,7)*16);return r+4}function $n(i,t,e,n){let r=t==="compact",{columns:o,sepX:a,width:s}=ei(i,e),l=new Map(o.map(g=>[g.id,g])),c=we(i),m=ce(i),h=[...c,...m],f=ke(i),b=Xn(i),$=g=>F(i,g),u=g=>he(i,g),v={mode:t,width:s,height:0,columns:o,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},E=0;return i.days.forEach((g,R)=>{let K=R*1440,P=new Map(g.events.map(p=>[p.id,p])),L=p=>p&&P.has(p)?{day:g.date,event:p}:null,J=Ct(g),ue=g.events.length,_e=ni(g.date,n.date);v.dayHeads.push({date:g.date,y:E,label:Pe(g.date),tag:_e,sub:(ue?`${ue} ${ue===1?"activity":"activities"}`:"Nothing scheduled")+(J?` · ${J} to sort out`:""),warn:J>0}),v.anchors.push({t:K,y:E});let ae=E+pt+_t,Me=m.flatMap(p=>g.drivers[p]?.outings??[]);if(!ue&&!Me.length){v.empties.push({key:g.date,y:ae,text:"Nothing planned"}),E=ae+40,v.anchors.push({t:K+1439,y:E});return}let M=(p,T,_,S,A,C,w)=>{let U=f.get(p.kid)??G(0),O=p.lines;return{key:`${g.date}|card|${p.id}`,x:T,y:_,w:S,h:A,target:{day:g.date,event:p.id},event:p,color:U,kidName:$(p.kid),clash:C,stayed:p.stay&&m.includes(p.drop),skipped:p.attending===!1,title:ti(p.title,$(p.kid)),time:`${k(p.start)}–${k(p.end)}`+(p.arrive_by!=null?` · arrive ${k(p.arrive_by)}`:""),drop:O.drop,pick:O.pick,showDrop:!!O.drop&&(w||A>=56),showPick:!!O.pick&&(w||A>=74),wrap:w,aria:`${$(p.kid)}, ${p.title} ${k(p.start)} to ${k(p.end)}. `+(p.attending===!1&&!O.drop?"Not attending. ":"")+[O.drop,O.pick].filter(ie=>!!ie).map(ie=>ie.text).join(". ")}},ee=p=>{let T=g.rides[p];return T?(g.drivers[T.driver]?.segments??[]).filter(S=>S.type!=="home"&&S.kids.includes(T.kid)&&W(S.start)>=W(T.start)&&W(S.end)<=W(T.end)):[]},N=p=>{let T=g.rides[p];if(!T)return null;let _=T.serves.find(S=>P.get(S)?.kid===T.kid);return L(_??T.serves[0])},X=new Map;for(let p of g.issues)p.level!=="problem"||!p.event||(p.kind==="late"&&X.set(p.event,`${Math.round(W(p.minutes))} min late`),p.kind==="waiting"&&X.set(`${p.event}|pick`,`Waits ${Math.round(W(p.minutes))} min`));if(!r){let p=1/0,T=-1/0;for(let w of g.events)p=Math.min(p,w.start-20,w.arrive_by!=null?w.arrive_by-10:1/0),T=Math.max(T,w.end+20);for(let w of Me)w.start!=null&&(p=Math.min(p,w.start)),w.end!=null&&(T=Math.max(T,w.end));g.date===n.date&&Number.isFinite(p)&&n.minutes>p-60&&n.minutes<T&&(p=Math.min(p,n.minutes-15));let _=Number.isFinite(p)?Math.floor((p-5)/30)*30:900,S=Number.isFinite(T)?Math.ceil((T+5)/30)*30:960,A=w=>Math.round(ae+(Math.max(_,Math.min(S,w))-_)*Kn);v.anchors.push({t:K+_,y:A(_)},{t:K+S,y:A(S)});for(let w of c){let U=l.get(w),O=f.get(w),ie=(g.kids[w]?.items??[]).filter(z=>z.start!=null&&z.end!=null).map(z=>({item:z,s:W(z.start),en:W(z.end)}));for(let z of Zn(ie)){let y=U.w/z.cols,H=Math.round(U.x+z.col*y),B=Math.round(y-(z.cols>1?4:0)),j=A(z.s),le=z.item;if(le.type==="act"){let V=P.get(le.event??"");if(!V)continue;let Dt=Math.max(30,A(z.en)-j);if(v.cards.push(M(V,H,j,B,Dt,le.clash,!1)),V.arrive_by!=null&&V.start-V.arrive_by>=5){let Bt=A(V.arrive_by);v.preps.push({key:`${g.date}|prep|${V.id}`,x:H,y:Bt,w:B,h:j-Bt+6,color:O,label:`Arrive by ${k(V.arrive_by)}`})}let Rt=X.get(V.id);Rt&&v.marks.push({key:`${g.date}|late|${V.id}`,x:H+B-4,y:j+4,text:Rt,right:!0});let Nt=X.get(`${V.id}|pick`);Nt&&v.marks.push({key:`${g.date}|wait|${V.id}`,x:H+4,y:j+Dt+2,text:Nt,right:!1});continue}let q=g.rides[le.ride??-1];if(!q)continue;let ge=Math.max(22,A(z.en)-j),Ce=ot(ee(q.index),b),I=u(q.driver);v.rides.push({key:`${g.date}|ride|${q.index}`,x:H,y:j,w:B,h:ge,target:N(q.index),l1:`${q.own?"In":"Along in"} ${I}’s car`,l2:Ce.join(" → "),show2:bn(ge)>0,lines2:bn(ge),dashed:!q.own,clash:le.clash,aria:`${$(w)} ${q.own?"in":"riding along in"} ${I}’s car, ${k(W(q.start))} to ${k(W(q.end))}: ${Ce.join(" to ")}`});let fe=l.get(q.driver);fe&&v.bands.push({key:`${g.date}|band|${q.index}`,x:H+B,y:j,w:Math.max(0,fe.x+8-(H+B)),h:ge,color:O})}}for(let w of m){let U=l.get(w),O=g.drivers[w];if(!O)continue;let ie=[],z=null;for(let y of O.segments)if(!(y.start==null||y.end==null)){if(y.type==="home"){z=null;continue}if(y.type==="stay"){z=null,ie.push({type:"stay",g:y,s:y.start,en:y.end});continue}z&&z.en===y.start?(z.en=y.end,z.legs.push(y)):(z={type:"trip",s:y.start,en:y.end,legs:[y]},ie.push(z))}for(let y of ie){let H=A(y.s),B=Math.max(24,A(y.en)-H);if(y.type==="stay"){let I=P.get(y.g.event??y.g.serves??""),fe=I?f.get(I.kid)??G(0):G(0),V=y.g.kids.map($);v.stays.push({key:`${g.date}|stay|${w}|${y.s}`,x:U.x+8,y:H,w:U.w-16,h:B,target:L(I?.id),color:fe,l1:I?`At ${I.title} with ${$(I.kid)}`:"Staying",l2:`until ${k(y.en)}`+(V.length?` · ${V.join(" and ")} too`:"")});continue}let j=y.legs[0],le=y.legs[y.legs.length-1],q=[];for(let I of y.legs)for(let fe of I.kids)q.includes(fe)||q.push(fe);let ge=le.type==="drive"&&le.to==="home",Ce=ot(y.legs,b);v.trips.push({key:`${g.date}|trip|${w}|${y.s}`,x:U.x+8,y:H,w:U.w-16,h:B,target:L(y.legs.find(I=>I.serves)?.serves),l1:j.type==="drive"&&j.from==="home"?`Leave ${k(y.s)}`:`From ${lt(b,j.from??j.place)} ${k(y.s)}`,l2:Ce.join(" → "),show2:B>=36,l3:ge?`Home ${k(y.en)}`:"",show3:ge&&B>=62,stops:null,kids:q.map(I=>(f.get(I)??G(0)).color),bad:y.legs.some(I=>I.overlaps_busy),aria:`${u(w)} drives ${Ce.join(" to ")}, ${k(y.s)} to ${k(y.en)}`})}for(let y of O.segments)if(!(!y.overlaps_busy||y.start==null||y.end==null))for(let H of O.busy){let B=Math.max(y.start,H.start),j=Math.min(y.end,H.end);j<=B||v.overlaps.push({key:`${g.date}|overlap|${w}|${B}`,x:U.x+6,y:A(B)-2,w:U.w-12,h:Math.max(8,A(j)-A(B)+4)})}for(let y of O.busy){if(y.end<=_||y.start>=S)continue;let H=A(y.start),B=A(y.end);v.busy.push({key:`${g.date}|busy|${w}|${y.start}`,x:U.x+1,y:H,w:U.w-2,h:B-H,labelY:8,label:fn(y,!1)})}}let C=-1/0;for(let w=_;w<=S;w+=30)v.grid.push({key:`${g.date}|grid|${w}`,y:A(w),strong:w%60===0}),w%60===0&&A(w)-C>=22&&(v.hours.push({key:`${g.date}|hour|${w}`,y:A(w)-8,label:nn(w)}),C=A(w));g.date===n.date&&n.minutes>_&&n.minutes<S&&(v.now={y:A(n.minutes),label:`Now ${k(n.minutes)}`}),E=A(S)+_t;return}let te=[];for(let p of c){let T=l.get(p);for(let _ of g.kids[p]?.items??[])if(_.start!=null){if(_.type==="act"){let S=P.get(_.event??"");if(!S)continue;te.push({col:p,s:_.start,h:si(S,T.w),kind:"act",item:_})}else if(!g.rides[_.ride??-1]?.own){let S=g.rides[_.ride??-1],A=S?ot(ee(S.index),b).join(" → "):"";te.push({col:p,s:_.start,h:ii(A,T.w),kind:"along",item:_})}}}for(let p of m){let T=g.drivers[p];if(T){for(let _ of T.busy)te.push({col:p,s:_.start,h:32,kind:"busy",busy:_});for(let _ of T.outings)_.start!=null&&te.push({col:p,s:_.start,h:30+_.lines.length*16+(_.warn?16:0),kind:"out",out:_})}}te.sort((p,T)=>p.s-T.s||h.indexOf(p.col)-h.indexOf(T.col));let Ae=new Map,D=ae;te.forEach((p,T)=>{let _=Ae.get(p.col),S=Math.max(_!=null?_+Fn:ae,D);Ae.set(p.col,S+p.h),D=S,v.anchors.push({t:K+p.s,y:S});let A=l.get(p.col);if(p.kind==="busy")v.busy.push({key:`${g.date}|busy|${p.col}|${T}`,x:A.x+1,y:S,w:A.w-2,h:p.h,labelY:8,label:fn(p.busy,!0)});else if(p.kind==="out"){let C=p.out;v.trips.push({key:`${g.date}|trip|${p.col}|${T}`,x:A.x+8,y:S,w:A.w-16,h:p.h,target:L(C.target),l1:C.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...C.lines.map(w=>({text:w,warn:!1})),...C.warn?[{text:C.warn,warn:!0}]:[]],kids:C.kids.map(w=>(f.get(w)??G(0)).color),bad:!!C.warn,aria:`${u(p.col)}: ${C.lead}. ${C.lines.join(". ")}${C.warn?`. ${C.warn}`:""}`})}else if(p.kind==="act"){let C=P.get(p.item.event??"");v.cards.push(M(C,A.x,S,A.w,p.h,p.item.clash,!0))}else{let C=g.rides[p.item.ride??-1],w=ot(ee(C.index),b),U=u(C.driver);v.rides.push({key:`${g.date}|ride|${C.index}`,x:A.x,y:S,w:A.w,h:p.h,target:N(C.index),l1:`Along with ${U} ${k(W(C.start))}`,l2:w.join(" → "),show2:!0,lines2:zt,dashed:!0,clash:p.item.clash,aria:`${$(p.col)} riding along with ${U}, ${k(W(C.start))} to ${k(W(C.end))}: ${w.join(" to ")}`})}});let ne=ae;for(let p of Ae.values())ne=Math.max(ne,p);E=ne+_t+6,v.anchors.push({t:K+1439,y:E})}),v.height=E,v}var ri=["","¼","½","¾"];function $e(i){return i.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Oe(n);let r=Math.round(n*4),o=Math.floor(r/4),a=ri[r%4];return`${o||!a?o:""}${a} min`})}function wn(i){let t=e=>e?{...e,text:$e(e.text)}:null;return{...i,days:i.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,r])=>[n,{...r,outings:r.outings.map(o=>({...o,lines:o.lines.map($e),warn:o.warn==null?o.warn:$e(o.warn)}))}])),issues:e.issues.map(n=>({...n,title:$e(n.title),body:$e(n.body),note:n.note==null?n.note:$e(n.note),...n.suggestions?{suggestions:n.suggestions.map(r=>({...r,note:$e(r.note)}))}:{}}))}))}}var oi=2,ai=48;function kn(i,t,e=ai){let n=[],r=0,o=0,a=0,s=0,l=t.minutes+e*60;for(let c of i.days){let m=et(t.date,c.date),h=m===0?"":`${de(c.date)} · `,f=new Map(c.events.map(u=>[u.id,u])),b=u=>u&&f.has(u)?{day:c.date,event:u}:null,$=(u,v)=>m*1440+(u??f.get(v??"")?.start??0)<l;for(let u of c.issues)if(u.level==="problem"){if(!$(u.at,u.event)){a++,u.kind==="unassigned"&&s++;continue}r++,u.kind==="unassigned"&&o++,n.push({key:`${c.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:h+u.title,body:u.body,target:b(u.event),suggestions:(u.suggestions??[]).map(v=>({id:v.id,label:v.label,note:v.note}))})}if(c.clashes.forEach((u,v)=>{if(!$(u.a.start,u.a.event)){a++;return}r++;let E=f.get(u.a.event??""),g=F(i,u.kid),R=(P,L)=>{let J=b(L);return J?{text:P,target:J}:P},K=[];if(u.b.type==="act"){let P=f.get(u.b.event??"");E&&P&&(K=[R(E.title,E.id),` ${k(E.start)}–${k(E.end)} and `,R(P.title,P.id),` ${k(P.start)}–${k(P.end)} overlap.`])}else{let P=c.rides[u.b.ride??-1];E&&P&&(K=[`${g} is in `,R(`${he(i,P.driver)}’s car`,P.serves[0]),` ${k(W(u.b.start))}–${k(W(u.b.end))}, during `,R(E.title,E.id),"."])}n.push({key:`${c.date}|clash|${v}`,tone:"problem",title:`${h}${g} is double-booked`,body:K.map(P=>typeof P=="string"?P:P.text).join(""),parts:K,target:null,suggestions:[]})}),m>=0&&m<oi)for(let u of c.issues)u.level!=="heads_up"||!$(u.at,u.event)||n.push({key:`${c.date}|${u.key}`,tone:"heads_up",title:h+u.title,body:u.body,target:b(u.event),suggestions:[]});for(let u of c.events)!u.problems.length||!$(u.start)||n.push({key:`${c.date}|notes|${u.id}`,tone:"heads_up",title:`${h}Check the notes on ${F(i,u.kid)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:b(u.id),suggestions:[]})}return{items:n,problems:r,unassigned:o,later:a,laterUnassigned:s}}function _n(i,t){let e=ke(i),n=null,r=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of i.days){let a=et(t.date,o.date);if(!(a<0))for(let s of ce(i))for(let l of o.drivers[s]?.outings??[]){if(l.start==null)continue;let c=a*1440+l.start;if(a*1440+W(l.end,l.start)<=t.minutes)continue;let h=c-t.minutes,f={driver:s,name:he(i,s),date:o.date,ahead:a,start:l.start,inMinutes:h,ongoing:h<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(b=>e.get(b)??G(0)),warn:l.warn,target:l.target&&o.events.some(b=>b.id===l.target)?{day:o.date,event:l.target}:null};(!n||r(f)<r(n)||r(f)===r(n)&&f.inMinutes<n.inMinutes)&&(n=f)}}return n}var li={timeline:"timeline",full:"timeline",compact:"compact"};function An(i){let t=new URLSearchParams(i),e={},n=li[(t.get("view")??"").trim().toLowerCase()];return n&&(e.view=n),e}var Tn=De`
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
    top: 72px;
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
`;var En="mydashlight.rides.mode",di=1100,pi=440,ci=700,hi=3*6e4,ui=1200;function gi(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}function ct(i){let t=/\p{L}|\p{N}/u.exec(i);return t?t[0].toUpperCase():"?"}function fi(i){let t=i.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function bi(){try{return localStorage.getItem(En)==="compact"?"compact":"timeline"}catch{return"timeline"}}function mi(i){try{localStorage.setItem(En,i)}catch{}}function ht(i){return i.days.every(t=>!t.events.length)}var je=class extends Z{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=An(location.search).view;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let r=e.clientX-n.x,o=e.clientY-n.y;if(!n.moved){if(Math.abs(r)+Math.abs(o)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-o,n.el.scrollLeft=n.left-r};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},hi))};this.onKey=e=>{e.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??bi(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.backend&&(this.stopWatching=this.backend.watch(e=>{this.plan=wn(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<di)return!1;let e=this.plan;return!e||this.width-pi>=St(we(e).length,ce(e).length)}today(){return Ue(this.plan?.time_zone??gi())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),r=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||r!==this.boardKey)&&(this.board=$n(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=r),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let r=this.scroller;if(!r||!this.board)return;let o=this.board.dayHeads.find(a=>a.date===n)?.y??0;r.scrollTop=Math.max(o,mn(this.board,e)-pt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let r=this.today();if(e===r.date){this.scrollToNow();return}let o=this.dayIndexOf(e),a=n.days[o];if(!a)return;let s=1/0;if(this.mode==="timeline"){for(let l of a.events)s=Math.min(s,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let c of l.outings)c.start!=null&&(s=Math.min(s,c.start))}this.scrollToTime(o*1440+(Number.isFinite(s)?Math.max(0,s-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,r=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=n+1&&(r=c);let o=this.renderRoot,a=o.querySelector(".pinned .label"),s=o.querySelector(".pinned .tag"),l=o.querySelector(".pinned .sub");a&&a.textContent!==r.label&&(a.textContent=r.label),s&&(s.textContent!==r.tag&&(s.textContent=r.tag),s.hidden=!r.tag),l&&l.textContent!==r.sub&&(l.textContent=r.sub),l?.classList.toggle("warn",r.warn);for(let c of o.querySelectorAll(".day-tile"))c.classList.toggle("in-view",c.dataset.date===r.date)}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?xn(this.board,n.scrollTop+pt+4):null,this.mode=e,this.urlView||mi(e)}findEvent(e){let n=this.plan?.days.find(o=>o.date===e.day),r=n?.events.find(o=>o.id===e.event);return n&&r?{day:n,event:r}:null}open(e,n=!1){e&&(this.flushArrive(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),r=this.dayIndexOf(e.day);!n||r<0||this.scrollToTime(r*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,r){if(!this.pending){this.pending={key:e,value:n};try{await r()}catch(o){let a=o instanceof Y?o:new Y("error",String(o));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,n,r){if(!this.backend)return;let o=this.backend;this.save(`${n}`,r,()=>o.setRide(e.id,n,r,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let r=this.backend;this.save("attending",n,()=>r.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n){if(!this.backend)return;let r=this.backend,o=e.along.includes(n)?e.along.filter(a=>a!==n):[...e.along,n];this.save("along",o,()=>r.setTakeAlong(e.id,o,this.scope))}nudgeArrive(e,n){let r=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;n<0?o=(r??e.start)-5:o=r==null||r+5>=e.start?null:r+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),ui)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let r=this.findEvent(n);if(!r||r.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,a=r.event.id,s=this.scope;this.save("arrive",e,()=>o.setArriveBy(a,e,s)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),r=e?kn(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},o=this.wide,a=d`<aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
      ${this.sel&&e?this.renderEditor(e):this.renderAttention(r)}
    </aside>`;return d`
      <div class="app ${o?"wide":this.width<ci?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,r)} ${e?this.renderWeek(e):x} ${this.renderBanner(e)}
          <main>
            <section class="board-area" aria-label="Everyone’s week">
              ${n&&e?ht(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
            </section>
            ${!o&&(this.sheet||this.sel)?d`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${a}`:x}
          </main>
        </div>
        ${o?a:x}
        ${this.toast?d`<div class="toast" role="status">${this.toast}</div>`:x}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(e,n){let r=n.problems;this.tick;let o=this.today(),a="";if(e){let m=e.time_zone,h=new Date(e.updated);this.error?a=d`<span class="bad">Can’t reach Home Assistant · showing the plan from ${tt(h,new Date,m)}</span>`:e.status&&!e.status.ok?a=d`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${tt(h,new Date,m)}</span>`:this.backend?.live||(a=`Updated ${tt(h,new Date,m)}`)}let s=(m,h,f,b)=>d`
      <button type="button" class="seg-btn" title=${b} aria-pressed=${this.mode===m?"true":"false"} @click=${()=>this.setMode(m)}>
        ${f}<span class="seg-label">${h}</span>
      </button>
    `,l=Le(o.minutes),c=!!e&&ht(e);return d`
      <header>
        ${this.showMenu?d`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Ee`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:x}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Pe(o.date)}, ${l}`}>
            <span class="hm">${l.slice(0,-3)}</span><span class="ampm">${l.slice(-2)}</span>
          </h1>
          <p class="today-line">${Pe(o.date)}</p>
          ${a?d`<p class="status">${a}</p>`:x}
        </div>
        ${e&&!c?this.renderNext(e,_n(e,o),n):x}
        <div class="controls">
          ${this.wide||c?x:d`<button type="button" class="attn-btn ${r?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${r}</span>
              </button>`}
          <div role="group" aria-label="View" class="seg">
            ${s("timeline","Timeline",Ee`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${s("compact","Compact",Ee`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>
        </div>
      </header>
    `}renderNext(e,n,r){if(!n){let c=this.today().date,m=r.unassigned,h=r.laterUnassigned;if(m){let b=d`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${m} ${m===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?d`<div class="next idle needs">${b}</div>`:d`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(h)return d`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let f=e.days.some(b=>b.date>=c&&b.events.length);return d`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let o;n.ongoing?o="On the road now":n.ahead===0?o=n.inMinutes<180?`Next trip · in ${Oe(n.inMinutes)}`:"Next trip · later today":n.ahead===1?o="Next trip · tomorrow":o=`Next trip · ${de(n.date)}`;let a=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,s=d`
      <span class="next-eyebrow">${o}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${ct(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(c=>d`<span class="kid-dot" style="background:${c.color}"></span>`)}</span>
      </span>
      ${n.warn?d`<span class="next-stop warn">${n.warn}</span>`:n.stop?d`<span class="next-stop">${n.stop}</span>`:x}
    `,l=`next ${n.ongoing?"ongoing":a?"soon":""}`;return n.target?d`<button type="button" class=${l} @click=${()=>this.open(n.target)}>${s}</button>`:d`<div class=${l}>${s}</div>`}renderWeek(e){let n=this.today().date,r=ke(e);return d`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let a=Ct(o),s=o.events.length,l=o.events.slice(0,6).map(m=>r.get(m.kid)?.color??G(0).color),c=`${Pe(o.date)}: ${s?`${s} ${s===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return d`<button
          type="button"
          class="day-tile ${o.date===n?"today":""}"
          data-date=${o.date}
          aria-label=${c}
          @click=${()=>this.goToDay(o.date)}
        >
          <span class="dt-wd">${o.date===n?"Today":de(o.date)}</span>
          <span class="dt-num">${Number(o.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(m=>d`<span class="dt-dot" style="background:${m}"></span>`):d`<span class="dt-free">free</span>`}
            ${s>6?d`<span class="dt-more">+${s-6}</span>`:x}
          </span>
          ${a?d`<span class="dt-badge" aria-hidden="true">${a}</span>`:x}
        </button>`})}
    </nav>`}renderQuiet(e){let n=we(e),r=ce(e),o=ke(e),a=n.map(s=>F(e,s));return d`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((s,l)=>Ee`<circle cx=${50+l*30} cy="80" r="11" fill=${o.get(s).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${fi(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(s=>{let l=o.get(s);return d`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${ct(F(e,s))}</span>
            <span class="qw-name">${F(e,s)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${r.map(s=>d`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${ct(he(e,s))}</span>
            <span class="qw-name">${he(e,s)}</span>
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
    </div>`}renderBanner(e){let n=e?.unavailable_calendars.length??0;return n?d`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:x}renderEmpty(){return this.error?d`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:d`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,r=s=>!!s&&!!n&&s.day===n.day&&s.event===n.event,o=e.dayHeads[0],a=e.width;return d`
      <div
        class="scroller"
        @pointerdown=${this.onDown}
        @pointermove=${this.onMove}
        @pointerup=${this.onUp}
        @pointercancel=${this.onUp}
        @click=${this.onClickCapture}
        @scroll=${()=>this.syncDay()}
      >
        <div class="heads" style="width:${a}px">
          ${e.columns.map(s=>d`<div class="col-head ${s.kind}" style="left:${s.x}px;width:${s.w}px;--c:${s.dot};--rgb:${s.rgb}">
              <span class="avatar ${s.kind}" aria-hidden="true">${ct(s.name)}</span>
              <span class="ch-text">
                <span class="name">${s.name}</span>
                <span class="sub ${s.subWarn?"warn":""}">${s.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${a}px">
          <span class="label">${o?.label??""}</span><span class="tag" ?hidden=${!o?.tag}>${o?.tag??""}</span
          ><span class="sub ${o?.warn?"warn":""}">${o?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${a}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(s=>d`<div
                class="col-bg ${s.kind}"
                style="left:${s.x}px;width:${s.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${s.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(s=>d`<div class="day-head" style="top:${s.y}px;width:${a}px">
              <span class="label">${s.label}</span>${s.tag?d`<span class="tag">${s.tag}</span>`:x}<span
                class="sub ${s.warn?"warn":""}"
                >${s.sub}</span
              >
            </div>`)}
          ${e.empties.map(s=>d`<span class="empty" style="top:${s.y}px">${s.text}</span>`)}
          ${e.grid.map(s=>d`<div class="grid ${s.strong?"strong":""}" style="top:${s.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(s=>d`<span class="hour" style="top:${s.y}px">${s.label}</span>`)}
          ${Q(e.bands,s=>s.key,s=>d`<div
                class="band"
                aria-hidden="true"
                style="left:${s.x}px;top:${s.y}px;width:${s.w}px;height:${s.h}px;background:rgba(${s.color.rgb},0.10);border-color:rgba(${s.color.rgb},0.45)"
              ></div>`)}
          ${Q(e.busy,s=>s.key,s=>d`<div class="busy" style="left:${s.x}px;top:${s.y}px;width:${s.w}px;height:${s.h}px">
                <span style="top:${s.labelY}px">${s.label}</span>
              </div>`)}
          ${Q(e.preps,s=>s.key,s=>d`<div
                class="prep"
                aria-hidden="true"
                style="left:${s.x}px;top:${s.y}px;width:${s.w}px;height:${s.h}px;border-color:${s.color.color};background:rgba(${s.color.rgb},0.07);color:${s.color.ink}"
              >
                ${s.label}
              </div>`)}
          ${Q(e.cards,s=>s.key,s=>{let l=s.color,c=s.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:s.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return d`<button
                type="button"
                class="card ${s.wrap?"wrap":""} ${r(s.target)?"sel":""} ${s.clash?"clash":""} ${s.skipped?"skipped":""}"
                aria-label=${s.aria}
                style="left:${s.x}px;top:${s.y}px;width:${s.w}px;height:${s.h}px;background:${c};border-color:${s.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(s.target)}
              >
                <span class="top">
                  <span class="title">${s.title}</span>
                  <span class="time">${s.time}</span>
                  ${s.showDrop&&s.drop?d`<span class="line tone-${s.drop.tone}">${s.drop.text}</span>`:x}
                </span>
                ${s.showPick&&s.pick?d`<span class="line tone-${s.pick.tone}">${s.pick.text}</span>`:x}
              </button>`})}
          ${Q(e.rides,s=>s.key,s=>d`<button
                type="button"
                class="ride ${s.dashed?"dashed":""} ${s.clash?"clash":""}"
                aria-label=${s.aria}
                style="left:${s.x}px;top:${s.y}px;width:${s.w}px;height:${s.h}px"
                @click=${()=>this.open(s.target)}
              >
                <span class="l1">${s.l1}</span>${s.show2?d`<span class="l2" style="-webkit-line-clamp:${s.lines2}">${s.l2}</span>`:x}
              </button>`)}
          ${Q(e.stays,s=>s.key,s=>d`<button
                type="button"
                class="stay"
                style="left:${s.x}px;top:${s.y}px;width:${s.w}px;height:${s.h}px;border-color:${s.color.color};background:repeating-linear-gradient(135deg, rgba(${s.color.rgb},0.28) 0px, rgba(${s.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(s.target)}
              >
                <span class="l1" style="color:${s.color.ink}">${s.l1}</span><span class="l2">${s.l2}</span>
              </button>`)}
          ${Q(e.trips,s=>s.key,s=>d`<button
                type="button"
                class="trip ${s.bad?"bad":""} ${s.stops?"list":""}"
                aria-label=${s.aria}
                style="left:${s.x}px;top:${s.y}px;width:${s.w}px;height:${s.h}px"
                @click=${()=>this.open(s.target)}
              >
                <span class="l1">${s.l1}${s.kids.map(l=>d`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${s.show2?d`<span class="l2">${s.l2}</span>`:x}
                ${s.stops?s.stops.map(l=>d`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):x}
                ${s.show3?d`<span class="l3">${s.l3}</span>`:x}
              </button>`)}
          ${Q(e.overlaps,s=>s.key,s=>d`<div class="overlap" aria-hidden="true" style="left:${s.x}px;top:${s.y}px;width:${s.w}px;height:${s.h}px"></div>`)}
          ${Q(e.marks,s=>s.key,s=>d`<span class="mark" style="left:${s.x}px;top:${s.y}px;${s.right?"transform:translateX(-100%)":""}">${s.text}</span>`)}
          ${e.now?d`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:x}
        </div>
      </div>
    `}renderAttention(e){let{items:n,problems:r,later:o}=e,a=this.plan;return d`
      <div class="panel-head">
        <h2>Needs attention <span class="panel-sub">Next two days</span></h2>
        <span class="count-pill ${r?"bad":"ok"}">${r}</span>
        ${this.wide?x:d`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${a&&!r?d`<div class="all-clear">
            <span class="check" aria-hidden="true">${Ee`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${ht(a)?"Nothing needs you this week.":o?`Nothing for the next two days. ${o} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:x}
      ${n.map(s=>d`<div class="issue ${s.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${s.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${s.target?d`<button type="button" class="issue-title" @click=${()=>this.open(s.target,!0)}>${s.title}</button>`:d`<strong class="issue-title">${s.title}</strong>`}
              <span class="issue-body"
                >${s.parts?s.parts.map(l=>typeof l=="string"?l:d`<button type="button" class="issue-link" @click=${()=>this.open(l.target,!0)}>${l.text}</button>`):s.body}</span
              >
            </div>
          </div>
          ${s.suggestions.length?d`<div class="fixes">
                ${s.suggestions.map(l=>d`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(l.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${l.id}`?"Saving…":l.label}</span>
                    <span class="fix-note">${l.note}</span>
                  </button>`)}
              </div>`:x}
        </div>`)}
      ${this.wide&&a&&!ht(a)?this.renderLegend():x}
    `}renderLegend(){return d`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return d``;let{day:r,event:o}=n,a=ce(e),l=ke(e).get(o.kid)??G(0),c=!!this.pending,m=M=>this.pending?.key===M?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let M of e.days)for(let ee of M.events)for(let N of[ee.drop,ee.pick])N&&N!=="none"&&!a.includes(N)&&!h.some(X=>X.toLowerCase()===N.toLowerCase())&&h.push(N);let f=M=>{if(!o.sides.includes(M))return x;let ee=m(M),N=ee!==void 0?String(ee):M==="drop"?o.drop:o.pick,X=N&&N!=="none"&&!a.includes(N)?N:"",te=D=>this.setRide(o,M,N===D?"":D),Ae=[...a.map(D=>[D,Mt(e,D)]),["none","Not needed"]];return d`<div class="field">
        <span class="field-label">${M==="drop"?"Drop-off":"Pick-up"} ${N===""?d`<span class="nobody">· nobody yet</span>`:x}</span>
        <div role="group" aria-label=${M==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${Ae.length}, minmax(0, 1fr))">
          ${Ae.map(([D,ne])=>d`<button type="button" class="choice" aria-pressed=${N===D?"true":"false"} ?disabled=${c} @click=${()=>te(D)}>
                ${ne}
              </button>`)}
        </div>
        ${h.length?d`<div role="group" aria-label=${M==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(D=>d`<button type="button" class="chip" aria-pressed=${N.toLowerCase()===D.toLowerCase()?"true":"false"} ?disabled=${c} @click=${()=>te(D)}>
                    ${D}
                  </button>`)}
            </div>`:x}
        <input
          type="text"
          .value=${X&&!h.some(D=>D.toLowerCase()===X.toLowerCase())?X:""}
          ?disabled=${c}
          aria-label=${M==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${D=>{let ne=D.target.value.trim();ne&&ne!==N&&this.setRide(o,M,ne)}}
          @keydown=${D=>{D.key==="Enter"&&D.target.blur()}}
        />
      </div>`},b=m("stay"),$=b!==void 0?!!b:o.stay,u=o.drop===o.pick&&a.includes(o.drop),v=m("along"),E=v!==void 0?v:o.along,g=we(e).filter(M=>M!==o.kid),R=a.includes(o.drop)&&o.sides.includes("drop"),K=m("arrive"),P=this.arriveDraft!==void 0?this.arriveDraft:K!==void 0?K:o.arrive_by,L=[],J=M=>M==="none"?"Not needed":Mt(e,M);o.drop!==""&&L.push(`Drop-off: ${J(o.drop)}`),o.pick!==""&&L.push(`Pick-up: ${J(o.pick)}`),o.stay&&L.push("Stay: yes"),o.along.length&&L.push(`Take along: ${o.along.map(M=>F(e,M)).join(", ")}`),o.arrive_by!=null&&L.push(`Arrive by: ${Le(o.arrive_by)}`);let ue=m("attending"),_e=ue!==void 0?!!ue:o.attending!==!1;o.attending===!1&&L.splice(0,L.length,"Attending: no");let ae=r.date===this.today().date?"":`${de(r.date)} · `,Me=d`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${F(e,o.kid)} · ${o.title}</span>
          <span class="ed-meta">${ae}${k(o.start)}–${k(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return o.where==="home"?d`${Me}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${F(e,o.kid)} can’t get home in time, the board shows it as a clash.</p>`:d`
      ${Me}
      ${this.pending?d`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
      ${o.recurring?d`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${de(r.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:x}
      <div class="field">
        <span class="field-label">${F(e,o.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${_e?"true":"false"} ?disabled=${c} @click=${()=>this.setAttending(o,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${_e?"false":"true"} ?disabled=${c} @click=${()=>this.setAttending(o,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${_e?d`${o.where==="anywhere"?d`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:x}
            ${f("drop")} ${f("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${$?"true":"false"} ?disabled=${!u||c} @click=${()=>this.toggleStay(o)}>
          ${u?$?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${R&&g.length?d`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${g.map(M=>d`<button type="button" class="chip" aria-pressed=${E.includes(M)?"true":"false"} ?disabled=${c} @click=${()=>this.toggleAlong(o,M)}>
                  ${F(e,M)}
                </button>`)}
            </div>
          </div>`:x}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${P!=null?`${o.start-P} min before it starts`:`Aims for a few minutes before ${k(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${c} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${P!=null?k(P):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${c||P==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${P!=null?d`<button type="button" class="chip clear" ?disabled=${c} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:x}
`:d`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${L.length?L.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?d`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:x}
      ${_e?d`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:x}
    `}};je.styles=Tn,je.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",je);var qe=class extends Z{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new nt(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return d`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>`}};qe.styles=De`
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
  `,qe.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",qe);
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
