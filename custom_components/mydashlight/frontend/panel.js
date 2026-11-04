var Ue=globalThis,Oe=Ue.ShadowRoot&&(Ue.ShadyCSS===void 0||Ue.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ct=Symbol(),Nt=new WeakMap,Pe=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==ct)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Oe&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Nt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Nt.set(e,t))}return t}toString(){return this.cssText}},Ht=i=>new Pe(typeof i=="string"?i:i+"",void 0,ct),Se=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,s,o)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new Pe(e,i,ct)},It=(i,t)=>{if(Oe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),s=Ue.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=e.cssText,i.appendChild(n)}},ht=Oe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Ht(e)})(i):i;var{is:An,defineProperty:Tn,getOwnPropertyDescriptor:En,getOwnPropertyNames:Pn,getOwnPropertySymbols:Sn,getPrototypeOf:Mn}=Object,je=globalThis,Lt=je.trustedTypes,Cn=Lt?Lt.emptyScript:"",zn=je.reactiveElementPolyfillSupport,Me=(i,t)=>i,ut={toAttribute(i,t){switch(t){case Boolean:i=i?Cn:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ot=(i,t)=>!An(i,t),Ut={attribute:!0,type:String,converter:ut,reflect:!1,useDefault:!1,hasChanged:Ot};Symbol.metadata??=Symbol("metadata"),je.litPropertyMetadata??=new WeakMap;var te=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ut){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),s=this.getPropertyDescriptor(t,n,e);s!==void 0&&Tn(this.prototype,t,s)}}static getPropertyDescriptor(t,e,n){let{get:s,set:o}=En(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:s,set(a){let r=s?.call(this);o?.call(this,a),this.requestUpdate(t,r,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ut}static _$Ei(){if(this.hasOwnProperty(Me("elementProperties")))return;let t=Mn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Me("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Me("properties"))){let e=this.properties,n=[...Pn(e),...Sn(e)];for(let s of n)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,s]of e)this.elementProperties.set(n,s)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let s=this._$Eu(e,n);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let s of n)e.unshift(ht(s))}else t!==void 0&&e.push(ht(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return It(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,n);if(s!==void 0&&n.reflect===!0){let o=(n.converter?.toAttribute!==void 0?n.converter:ut).toAttribute(e,n.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){let n=this.constructor,s=n._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let o=n.getPropertyOptions(s),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:ut;this._$Em=s;let r=a.fromAttribute(e,o.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,n,s=!1,o){if(t!==void 0){let a=this.constructor;if(s===!1&&(o=this[t]),n??=a.getPropertyOptions(t),!((n.hasChanged??Ot)(o,e)||n.useDefault&&n.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:s,wrapped:o},a){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[s,o]of n){let{wrapped:a}=o,r=this[s];a!==!0||this._$AL.has(s)||r===void 0||this.C(s,void 0,o,r)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};te.elementStyles=[],te.shadowRootOptions={mode:"open"},te[Me("elementProperties")]=new Map,te[Me("finalized")]=new Map,zn?.({ReactiveElement:te}),(je.reactiveElementVersions??=[]).push("2.1.2");var ft=globalThis,jt=i=>i,qe=ft.trustedTypes,qt=qe?qe.createPolicy("lit-html",{createHTML:i=>i}):void 0,bt="$lit$",ne=`lit$${Math.random().toFixed(9).slice(2)}$`,xt="?"+ne,Dn=`<${xt}>`,ge=document,ze=()=>ge.createComment(""),De=i=>i===null||typeof i!="object"&&typeof i!="function",mt=Array.isArray,Gt=i=>mt(i)||typeof i?.[Symbol.iterator]=="function",gt=`[ 	
\f\r]`,Ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Wt=/-->/g,Kt=/>/g,he=RegExp(`>|${gt}(?:([^\\s"'>=/]+)(${gt}*=${gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Vt=/'/g,Ft=/"/g,Xt=/^(?:script|style|textarea|title)$/i,vt=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),c=vt(1),ke=vt(2),mi=vt(3),ie=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),Yt=new WeakMap,ue=ge.createTreeWalker(ge,129);function Zt(i,t){if(!mt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return qt!==void 0?qt.createHTML(t):t}var Qt=(i,t)=>{let e=i.length-1,n=[],s,o=t===2?"<svg>":t===3?"<math>":"",a=Ce;for(let r=0;r<e;r++){let l=i[r],d,g,h=-1,f=0;for(;f<l.length&&(a.lastIndex=f,g=a.exec(l),g!==null);)f=a.lastIndex,a===Ce?g[1]==="!--"?a=Wt:g[1]!==void 0?a=Kt:g[2]!==void 0?(Xt.test(g[2])&&(s=RegExp("</"+g[2],"g")),a=he):g[3]!==void 0&&(a=he):a===he?g[0]===">"?(a=s??Ce,h=-1):g[1]===void 0?h=-2:(h=a.lastIndex-g[2].length,d=g[1],a=g[3]===void 0?he:g[3]==='"'?Ft:Vt):a===Ft||a===Vt?a=he:a===Wt||a===Kt?a=Ce:(a=he,s=void 0);let m=a===he&&i[r+1].startsWith("/>")?" ":"";o+=a===Ce?l+Dn:h>=0?(n.push(d),l.slice(0,h)+bt+l.slice(h)+ne+m):l+ne+(h===-2?r:m)}return[Zt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Re=class i{constructor({strings:t,_$litType$:e},n){let s;this.parts=[];let o=0,a=0,r=t.length-1,l=this.parts,[d,g]=Qt(t,e);if(this.el=i.createElement(d,n),ue.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=ue.nextNode())!==null&&l.length<r;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(bt)){let f=g[a++],m=s.getAttribute(h).split(ne),v=/([.?@])?(.*)/.exec(f);l.push({type:1,index:o,name:v[2],strings:m,ctor:v[1]==="."?Ke:v[1]==="?"?Ve:v[1]==="@"?Fe:be}),s.removeAttribute(h)}else h.startsWith(ne)&&(l.push({type:6,index:o}),s.removeAttribute(h));if(Xt.test(s.tagName)){let h=s.textContent.split(ne),f=h.length-1;if(f>0){s.textContent=qe?qe.emptyScript:"";for(let m=0;m<f;m++)s.append(h[m],ze()),ue.nextNode(),l.push({type:2,index:++o});s.append(h[f],ze())}}}else if(s.nodeType===8)if(s.data===xt)l.push({type:2,index:o});else{let h=-1;for(;(h=s.data.indexOf(ne,h+1))!==-1;)l.push({type:7,index:o}),h+=ne.length-1}o++}}static createElement(t,e){let n=ge.createElement("template");return n.innerHTML=t,n}};function fe(i,t,e=i,n){if(t===ie)return t;let s=n!==void 0?e._$Co?.[n]:e._$Cl,o=De(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=s:e._$Cl=s),s!==void 0&&(t=fe(i,s._$AS(i,t.values),s,n)),t}var We=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,s=(t?.creationScope??ge).importNode(e,!0);ue.currentNode=s;let o=ue.nextNode(),a=0,r=0,l=n[0];for(;l!==void 0;){if(a===l.index){let d;l.type===2?d=new we(o,o.nextSibling,this,t):l.type===1?d=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(d=new Ye(o,this,t)),this._$AV.push(d),l=n[++r]}a!==l?.index&&(o=ue.nextNode(),a++)}return ue.currentNode=ge,s}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},we=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,s){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=fe(this,t,e),De(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==ie&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Gt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&De(this._$AH)?this._$AA.nextSibling.data=t:this.T(ge.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,s=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Re.createElement(Zt(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===s)this._$AH.p(e);else{let o=new We(s,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=Yt.get(t.strings);return e===void 0&&Yt.set(t.strings,e=new Re(t)),e}k(t){mt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,s=0;for(let o of t)s===e.length?e.push(n=new i(this.O(ze()),this.O(ze()),this,this.options)):n=e[s],n._$AI(o),s++;s<e.length&&(this._$AR(n&&n._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=jt(t).nextSibling;jt(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},be=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,s,o){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=x}_$AI(t,e=this,n,s){let o=this.strings,a=!1;if(o===void 0)t=fe(this,t,e,0),a=!De(t)||t!==this._$AH&&t!==ie,a&&(this._$AH=t);else{let r=t,l,d;for(t=o[0],l=0;l<o.length-1;l++)d=fe(this,r[n+l],e,l),d===ie&&(d=this._$AH[l]),a||=!De(d)||d!==this._$AH[l],d===x?t=x:t!==x&&(t+=(d??"")+o[l+1]),this._$AH[l]=d}a&&!s&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ke=class extends be{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},Ve=class extends be{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},Fe=class extends be{constructor(t,e,n,s,o){super(t,e,n,s,o),this.type=5}_$AI(t,e=this){if((t=fe(this,t,e,0)??x)===ie)return;let n=this._$AH,s=t===x&&n!==x||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==x&&(n===x||s);s&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Ye=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){fe(this,t)}},Jt={M:bt,P:ne,A:xt,C:1,L:Qt,R:We,D:Gt,V:fe,I:we,H:be,N:Ve,U:Fe,B:Ke,F:Ye},Rn=ft.litHtmlPolyfillSupport;Rn?.(Re,we),(ft.litHtmlVersions??=[]).push("3.3.3");var en=(i,t,e)=>{let n=e?.renderBefore??t,s=n._$litPart$;if(s===void 0){let o=e?.renderBefore??null;n._$litPart$=s=new we(t.insertBefore(ze(),o),o,void 0,e??{})}return s._$AI(i),s};var yt=globalThis,Z=class extends te{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=en(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ie}};Z._$litElement$=!0,Z.finalized=!0,yt.litElementHydrateSupport?.({LitElement:Z});var Bn=yt.litElementPolyfillSupport;Bn?.({LitElement:Z});(yt.litElementVersions??=[]).push("4.2.2");function w(i){let t=Math.round(i),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Be(i){let t=Math.floor(Math.round(i)/60)%24;return`${w(i)} ${t<12?"AM":"PM"}`}function tn(i){let t=Math.floor(i/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function He(i){let t=Math.max(0,Math.round(i)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function nn(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Nn=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Hn=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),In=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Ge(i){return new Date(`${i}T12:00:00Z`)}function _e(i){let t=Ge(i);return`${Nn.format(t)}, ${In.format(t)}`}function oe(i){return Hn.format(Ge(i))}function Xe(i,t){return Math.round((Ge(t).getTime()-Ge(i).getTime())/864e5)}function Ne(i,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Ne("UTC",t)}let n=s=>e.find(o=>o.type===s)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Ze(i,t,e){let n=Math.floor((t.getTime()-i.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let s=Ne(e,i),o=Ne(e,t).date;return s.date===o?`at ${Be(s.minutes)}`:`on ${oe(s.date)} at ${Be(s.minutes)}`}var Y=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},$t="mydashlight",Ln=7,Un=3e4;function sn(i){if(i instanceof Y)return i;if(i&&typeof i=="object"){let t=i;if(typeof t.message=="string")return new Y(String(t.code??"error"),t.message)}return typeof i=="number"?new Y("connection_lost","Lost the connection to Home Assistant."):new Y("error",String(i))}var Qe=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new Y("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Un),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new Y("not_running","MyDashLight isn’t running right now."))},{type:`${$t}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:$t,service:"get_plan",service_data:{days:Ln},return_response:!0});this.emit(t.response)}catch(t){this.fail(sn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:$t,service:t,service_data:e})}catch(n){throw sn(n)}this.pushing||await this.refresh()}setRide(t,e,n,s){return this.call("set_ride",{event:t,side:e,driver:n,scope:s})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:nn(e),scope:n})}setTakeAlong(t,e,n){return this.call("set_take_along",{event:t,kids:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}};var rn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},on=i=>(...t)=>({_$litDirective$:i,values:t}),Je=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:On}=Jt,an=i=>i;var ln=()=>document.createComment(""),Ae=(i,t,e)=>{let n=i._$AA.parentNode,s=t===void 0?i._$AB:t._$AA;if(e===void 0){let o=n.insertBefore(ln(),s),a=n.insertBefore(ln(),s);e=new On(o,a,i,i.options)}else{let o=e._$AB.nextSibling,a=e._$AM,r=a!==i;if(r){let l;e._$AQ?.(i),e._$AM=i,e._$AP!==void 0&&(l=i._$AU)!==a._$AU&&e._$AP(l)}if(o!==s||r){let l=e._$AA;for(;l!==o;){let d=an(l).nextSibling;an(n).insertBefore(l,s),l=d}}}return e},ae=(i,t,e=i)=>(i._$AI(t,e),i),jn={},dn=(i,t=jn)=>i._$AH=t,pn=i=>i._$AH,et=i=>{i._$AR(),i._$AA.remove()};var cn=(i,t,e)=>{let n=new Map;for(let s=t;s<=e;s++)n.set(i[s],s);return n},Q=on(class extends Je{constructor(i){if(super(i),i.type!==rn.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let s=[],o=[],a=0;for(let r of i)s[a]=n?n(r,a):a,o[a]=e(r,a),a++;return{values:o,keys:s}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,n]){let s=pn(i),{values:o,keys:a}=this.dt(t,e,n);if(!Array.isArray(s))return this.ut=a,o;let r=this.ut??=[],l=[],d,g,h=0,f=s.length-1,m=0,v=o.length-1;for(;h<=f&&m<=v;)if(s[h]===null)h++;else if(s[f]===null)f--;else if(r[h]===a[m])l[m]=ae(s[h],o[m]),h++,m++;else if(r[f]===a[v])l[v]=ae(s[f],o[v]),f--,v--;else if(r[h]===a[v])l[v]=ae(s[h],o[v]),Ae(i,l[v+1],s[h]),h++,v--;else if(r[f]===a[m])l[m]=ae(s[f],o[m]),Ae(i,s[h],s[f]),f--,m++;else if(d===void 0&&(d=cn(a,m,v),g=cn(r,h,f)),d.has(r[h]))if(d.has(r[f])){let E=g.get(a[m]),$=E!==void 0?s[E]:null;if($===null){let C=Ae(i,s[h]);ae(C,o[m]),l[m]=C}else l[m]=ae($,o[m]),Ae(i,s[h],$),s[E]=null;m++}else et(s[f]),f--;else et(s[h]),h++;for(;m<=v;){let E=Ae(i,l[v+1]);ae(E,o[m]),l[m++]=E}for(;h<=f;){let E=s[h++];E!==null&&et(E)}return this.ut=a,dn(i,l),ie}});var tt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function G(i){return tt[(i%tt.length+tt.length)%tt.length]}var hn="#23272E",un="35,39,46";var qn=3,ot=36,wt=12,Wn=8,kt=60,_t=10,it=30,At=10,Kn=150,Vn=200,rt=1.4;function Et(i,t){let e=Math.max(Kn,Vn/rt);return Math.ceil(kt+Math.max(0,i-1)*_t+it+Math.max(0,t-1)*At+e*(i+rt*t))}function xe(i){return i.people?i.people.kids.map(t=>t.id):i.days.length?Object.keys(i.days[0].kids):[]}function le(i){return i.people?i.people.drivers.map(t=>t.id):i.days.length?Object.keys(i.days[0].drivers):[]}function me(i){return new Map(xe(i).map((t,e)=>[t,G(e)]))}function X(i,t){let e=i.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.kids[t])return n.kids[t].name;return t}function de(i,t){let e=i.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of i.days)if(n.drivers[t])return n.drivers[t].name;return t}function Pt(i,t){return t==="none"?"Not needed":le(i).includes(t)?de(i,t):t}function Fn(i){let t=new Map([["home","Home"]]);for(let e of i.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function st(i,t){return t?i.get(t)??(t.split(",")[0]?.trim()||t):""}function nt(i,t){let e=[];for(let n of i)n.type==="drive"?(e.length||e.push(st(t,n.from)),e.push(st(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(st(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Yn(i){let t=i.map(a=>({...a,col:0,cols:1})).sort((a,r)=>a.s-r.s||r.en-a.en),e=[],n=[],s=-1/0,o=()=>{for(let a of e)a.cols=n.length;e=[],n=[]};for(let a of t){a.s>=s&&(o(),s=-1/0);let r=n.findIndex(l=>l<=a.s);r<0?(r=n.length,n.push(a.en)):n[r]=a.en,a.col=r,e.push(a),s=Math.max(s,a.en)}return o(),t}function Gn(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].y;for(let e=0;e<i.length-1;e++){let n=i[e],s=i[e+1];if(t<=s.t)return s.t===n.t?n.y:Math.round(n.y+(t-n.t)/(s.t-n.t)*(s.y-n.y))}return i[i.length-1].y}function Xn(i,t){if(!i.length)return 0;if(t<=i[0].y)return i[0].t;for(let e=0;e<i.length-1;e++){let n=i[e],s=i[e+1];if(t<=s.y)return s.y===n.y?n.t:n.t+(t-n.y)/(s.y-n.y)*(s.t-n.t)}return i[i.length-1].t}function bn(i,t){return Gn(i.anchors,t)}function xn(i,t){return Xn(i.anchors,t)}function Zn(i,t){let e=xe(i),n=le(i),s=Math.max(t,Et(e.length,n.length)),a=(s-kt-Math.max(0,e.length-1)*_t-it-Math.max(0,n.length-1)*At)/(e.length+rt*n.length||1),r=Math.floor(a),l=Math.floor(a*rt),d=new Map;for(let v of i.days)for(let E of v.events){let $=d.get(E.kid)??[];$.some(C=>C.event_id===E.event_id&&C.calendar_id===E.calendar_id)||$.push(E),d.set(E.kid,$)}let g=me(i),h=[],f=kt;e.forEach((v,E)=>{let $=d.get(v)??[],C=i.days.some(u=>u.events.some(q=>q.kid===v&&(q.sides.includes("drop")&&q.drop===""||q.sides.includes("pick")&&q.pick==="")));h.push({id:v,kind:"kid",x:f,w:r,name:X(i,v),dot:g.get(v).color,rgb:g.get(v).rgb,sub:`${C?"Needs a ride · ":""}${$.length} this week`,subWarn:C}),f+=r+(E<e.length-1?_t:0)});let m=f+it/2;return f+=it,n.forEach((v,E)=>{let $=0,C=0;for(let u of i.days){let q=u.drivers[v];q&&($+=q.outings.length,C+=q.drive??0)}h.push({id:v,kind:"driver",x:f,w:l,name:de(i,v),dot:hn,rgb:un,sub:`${$} ${$===1?"trip":"trips"} this week · ${He(C)} driving`,subWarn:!1}),f+=l+(E<n.length-1?At:0)}),{columns:h,sepX:m,width:s}}function Qn(i,t){let e=i.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let s=e.slice(t.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(s);if(!o)return e;let a=s.slice(o[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function gn(i,t){let e=i.start<=0,n=i.end>=1440;return e&&n?`${i.title} · all day`:n?`${i.title} from ${w(i.start)}`:e||!t?`${i.title} until ${w(i.end)}`:`${i.title} ${w(i.start)}–${w(i.end)}`}function St(i){return i.issues.filter(t=>t.level==="problem").length+i.clashes.length}function Jn(i,t){let e=Xe(t,i);return e===0?"Today":e===1?"Tomorrow":""}function U(i,t=0){return i==null||!Number.isFinite(i)?t:i}function Tt(i,t,e=7){let n=Math.max(8,Math.floor(t/e)),s=1,o=0;for(let a of i.split(/\s+/).filter(Boolean)){let r=a.length;for(o===0?o=r:o+1+r<=n?o+=1+r:(s++,o=r);o>n;)s++,o-=n}return s}var mn=25,vn=15,Mt=3;function fn(i){return Math.max(0,Math.min(Mt,Math.floor((i-mn)/vn)))}function ei(i,t){let e=Math.min(Mt,Tt(i,t-19,6.6));return mn+e*vn+2}function ti(i,t){let e=t-23,n=`${w(i.start)}–${w(i.end)}`+(i.arrive_by!=null?` · arrive ${w(i.arrive_by)}`:""),s=33+Tt(n,e,6.6)*16;for(let o of[i.lines.drop,i.lines.pick])o&&(s+=2+Tt(o.text,e,7)*16);return s+4}function yn(i,t,e,n){let s=t==="compact",{columns:o,sepX:a,width:r}=Zn(i,e),l=new Map(o.map(u=>[u.id,u])),d=xe(i),g=le(i),h=[...d,...g],f=me(i),m=Fn(i),v=u=>X(i,u),E=u=>de(i,u),$={mode:t,width:r,height:0,columns:o,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},C=0;return i.days.forEach((u,q)=>{let J=q*1440,W=new Map(u.events.map(p=>[p.id,p])),K=p=>p&&W.has(p)?{day:u.date,event:p}:null,ve=St(u),ye=u.events.length,P=Jn(u.date,n.date);$.dayHeads.push({date:u.date,y:C,label:_e(u.date),tag:P,sub:(ye?`${ye} ${ye===1?"activity":"activities"}`:"Nothing scheduled")+(ve?` · ${ve} to sort out`:""),warn:ve>0}),$.anchors.push({t:J,y:C});let V=C+ot+wt,D=g.flatMap(p=>u.drivers[p]?.outings??[]);if(!ye&&!D.length){$.empties.push({key:u.date,y:V,text:"Nothing planned"}),C=V+40,$.anchors.push({t:J+1439,y:C});return}let se=(p,A,k,T,_,S,y)=>{let H=f.get(p.kid)??G(0),O=p.lines;return{key:`${u.date}|card|${p.id}`,x:A,y:k,w:T,h:_,target:{day:u.date,event:p.id},event:p,color:H,kidName:v(p.kid),clash:S,stayed:p.stay&&g.includes(p.drop),title:Qn(p.title,v(p.kid)),time:`${w(p.start)}–${w(p.end)}`+(p.arrive_by!=null?` · arrive ${w(p.arrive_by)}`:""),drop:O.drop,pick:O.pick,showDrop:!!O.drop&&(y||_>=56),showPick:!!O.pick&&(y||_>=74),wrap:y,aria:`${v(p.kid)}, ${p.title} ${w(p.start)} to ${w(p.end)}. `+[O.drop,O.pick].filter(ee=>!!ee).map(ee=>ee.text).join(". ")}},$e=p=>{let A=u.rides[p];return A?(u.drivers[A.driver]?.segments??[]).filter(T=>T.type!=="home"&&T.kids.includes(A.kid)&&U(T.start)>=U(A.start)&&U(T.end)<=U(A.end)):[]},Te=p=>{let A=u.rides[p];if(!A)return null;let k=A.serves.find(T=>W.get(T)?.kid===A.kid);return K(k??A.serves[0])},M=new Map;for(let p of u.issues)p.level!=="problem"||!p.event||(p.kind==="late"&&M.set(p.event,`${Math.round(U(p.minutes))} min late`),p.kind==="waiting"&&M.set(`${p.event}|pick`,`Waits ${Math.round(U(p.minutes))} min`));if(!s){let p=1/0,A=-1/0;for(let y of u.events)p=Math.min(p,y.start-20,y.arrive_by!=null?y.arrive_by-10:1/0),A=Math.max(A,y.end+20);for(let y of D)y.start!=null&&(p=Math.min(p,y.start)),y.end!=null&&(A=Math.max(A,y.end));u.date===n.date&&Number.isFinite(p)&&n.minutes>p-60&&n.minutes<A&&(p=Math.min(p,n.minutes-15));let k=Number.isFinite(p)?Math.floor((p-5)/30)*30:900,T=Number.isFinite(A)?Math.ceil((A+5)/30)*30:960,_=y=>Math.round(V+(Math.max(k,Math.min(T,y))-k)*qn);$.anchors.push({t:J+k,y:_(k)},{t:J+T,y:_(T)});for(let y of d){let H=l.get(y),O=f.get(y),ee=(u.kids[y]?.items??[]).filter(z=>z.start!=null&&z.end!=null).map(z=>({item:z,s:U(z.start),en:U(z.end)}));for(let z of Yn(ee)){let b=H.w/z.cols,B=Math.round(H.x+z.col*b),R=Math.round(b-(z.cols>1?4:0)),I=_(z.s),re=z.item;if(re.type==="act"){let j=W.get(re.event??"");if(!j)continue;let zt=Math.max(30,_(z.en)-I);if($.cards.push(se(j,B,I,R,zt,re.clash,!1)),j.arrive_by!=null&&j.start-j.arrive_by>=5){let Bt=_(j.arrive_by);$.preps.push({key:`${u.date}|prep|${j.id}`,x:B,y:Bt,w:R,h:I-Bt+6,color:O,label:`Arrive by ${w(j.arrive_by)}`})}let Dt=M.get(j.id);Dt&&$.marks.push({key:`${u.date}|late|${j.id}`,x:B+R-4,y:I+4,text:Dt,right:!0});let Rt=M.get(`${j.id}|pick`);Rt&&$.marks.push({key:`${u.date}|wait|${j.id}`,x:B+4,y:I+zt+2,text:Rt,right:!1});continue}let L=u.rides[re.ride??-1];if(!L)continue;let pe=Math.max(22,_(z.en)-I),Ee=nt($e(L.index),m),N=E(L.driver);$.rides.push({key:`${u.date}|ride|${L.index}`,x:B,y:I,w:R,h:pe,target:Te(L.index),l1:`${L.own?"In":"Along in"} ${N}’s car`,l2:Ee.join(" → "),show2:fn(pe)>0,lines2:fn(pe),dashed:!L.own,clash:re.clash,aria:`${v(y)} ${L.own?"in":"riding along in"} ${N}’s car, ${w(U(L.start))} to ${w(U(L.end))}: ${Ee.join(" to ")}`});let ce=l.get(L.driver);ce&&$.bands.push({key:`${u.date}|band|${L.index}`,x:B+R,y:I,w:Math.max(0,ce.x+8-(B+R)),h:pe,color:O})}}for(let y of g){let H=l.get(y),O=u.drivers[y];if(!O)continue;let ee=[],z=null;for(let b of O.segments)if(!(b.start==null||b.end==null)){if(b.type==="home"){z=null;continue}if(b.type==="stay"){z=null,ee.push({type:"stay",g:b,s:b.start,en:b.end});continue}z&&z.en===b.start?(z.en=b.end,z.legs.push(b)):(z={type:"trip",s:b.start,en:b.end,legs:[b]},ee.push(z))}for(let b of ee){let B=_(b.s),R=Math.max(24,_(b.en)-B);if(b.type==="stay"){let N=W.get(b.g.event??b.g.serves??""),ce=N?f.get(N.kid)??G(0):G(0),j=b.g.kids.map(v);$.stays.push({key:`${u.date}|stay|${y}|${b.s}`,x:H.x+8,y:B,w:H.w-16,h:R,target:K(N?.id),color:ce,l1:N?`At ${N.title} with ${v(N.kid)}`:"Staying",l2:`until ${w(b.en)}`+(j.length?` · ${j.join(" and ")} too`:"")});continue}let I=b.legs[0],re=b.legs[b.legs.length-1],L=[];for(let N of b.legs)for(let ce of N.kids)L.includes(ce)||L.push(ce);let pe=re.type==="drive"&&re.to==="home",Ee=nt(b.legs,m);$.trips.push({key:`${u.date}|trip|${y}|${b.s}`,x:H.x+8,y:B,w:H.w-16,h:R,target:K(b.legs.find(N=>N.serves)?.serves),l1:I.type==="drive"&&I.from==="home"?`Leave ${w(b.s)}`:`From ${st(m,I.from??I.place)} ${w(b.s)}`,l2:Ee.join(" → "),show2:R>=36,l3:pe?`Home ${w(b.en)}`:"",show3:pe&&R>=62,stops:null,kids:L.map(N=>(f.get(N)??G(0)).color),bad:b.legs.some(N=>N.overlaps_busy),aria:`${E(y)} drives ${Ee.join(" to ")}, ${w(b.s)} to ${w(b.en)}`})}for(let b of O.segments)if(!(!b.overlaps_busy||b.start==null||b.end==null))for(let B of O.busy){let R=Math.max(b.start,B.start),I=Math.min(b.end,B.end);I<=R||$.overlaps.push({key:`${u.date}|overlap|${y}|${R}`,x:H.x+6,y:_(R)-2,w:H.w-12,h:Math.max(8,_(I)-_(R)+4)})}for(let b of O.busy){if(b.end<=k||b.start>=T)continue;let B=_(b.start),R=_(b.end);$.busy.push({key:`${u.date}|busy|${y}|${b.start}`,x:H.x+1,y:B,w:H.w-2,h:R-B,labelY:8,label:gn(b,!1)})}}let S=-1/0;for(let y=k;y<=T;y+=30)$.grid.push({key:`${u.date}|grid|${y}`,y:_(y),strong:y%60===0}),y%60===0&&_(y)-S>=22&&($.hours.push({key:`${u.date}|hour|${y}`,y:_(y)-8,label:tn(y)}),S=_(y));u.date===n.date&&n.minutes>k&&n.minutes<T&&($.now={y:_(n.minutes),label:`Now ${w(n.minutes)}`}),C=_(T)+wt;return}let F=[];for(let p of d){let A=l.get(p);for(let k of u.kids[p]?.items??[])if(k.start!=null){if(k.type==="act"){let T=W.get(k.event??"");if(!T)continue;F.push({col:p,s:k.start,h:ti(T,A.w),kind:"act",item:k})}else if(!u.rides[k.ride??-1]?.own){let T=u.rides[k.ride??-1],_=T?nt($e(T.index),m).join(" → "):"";F.push({col:p,s:k.start,h:ei(_,A.w),kind:"along",item:k})}}}for(let p of g){let A=u.drivers[p];if(A){for(let k of A.busy)F.push({col:p,s:k.start,h:32,kind:"busy",busy:k});for(let k of A.outings)k.start!=null&&F.push({col:p,s:k.start,h:30+k.lines.length*16+(k.warn?16:0),kind:"out",out:k})}}F.sort((p,A)=>p.s-A.s||h.indexOf(p.col)-h.indexOf(A.col));let dt=new Map,Ct=V;F.forEach((p,A)=>{let k=dt.get(p.col),T=Math.max(k!=null?k+Wn:V,Ct);dt.set(p.col,T+p.h),Ct=T,$.anchors.push({t:J+p.s,y:T});let _=l.get(p.col);if(p.kind==="busy")$.busy.push({key:`${u.date}|busy|${p.col}|${A}`,x:_.x+1,y:T,w:_.w-2,h:p.h,labelY:8,label:gn(p.busy,!0)});else if(p.kind==="out"){let S=p.out;$.trips.push({key:`${u.date}|trip|${p.col}|${A}`,x:_.x+8,y:T,w:_.w-16,h:p.h,target:K(S.target),l1:S.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...S.lines.map(y=>({text:y,warn:!1})),...S.warn?[{text:S.warn,warn:!0}]:[]],kids:S.kids.map(y=>(f.get(y)??G(0)).color),bad:!!S.warn,aria:`${E(p.col)}: ${S.lead}. ${S.lines.join(". ")}${S.warn?`. ${S.warn}`:""}`})}else if(p.kind==="act"){let S=W.get(p.item.event??"");$.cards.push(se(S,_.x,T,_.w,p.h,p.item.clash,!0))}else{let S=u.rides[p.item.ride??-1],y=nt($e(S.index),m),H=E(S.driver);$.rides.push({key:`${u.date}|ride|${S.index}`,x:_.x,y:T,w:_.w,h:p.h,target:Te(S.index),l1:`Along with ${H} ${w(U(S.start))}`,l2:y.join(" → "),show2:!0,lines2:Mt,dashed:!0,clash:p.item.clash,aria:`${v(p.col)} riding along with ${H}, ${w(U(S.start))} to ${w(U(S.end))}: ${y.join(" to ")}`})}});let pt=V;for(let p of dt.values())pt=Math.max(pt,p);C=pt+wt+6,$.anchors.push({t:J+1439,y:C})}),$.height=C,$}var ni=["","¼","½","¾"];function ii(i){return i.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return He(n);let s=Math.round(n*4),o=Math.floor(s/4),a=ni[s%4];return`${o||!a?o:""}${a} min`})}var si=2;function $n(i,t){let e=[],n=0;for(let s of i.days){let o=Xe(t,s.date),a=o===0?"":`${oe(s.date)} · `,r=new Map(s.events.map(d=>[d.id,d])),l=d=>d&&r.has(d)?{day:s.date,event:d}:null;for(let d of s.issues)d.level==="problem"&&(n++,e.push({key:`${s.date}|${d.key}`,tone:d.kind==="unassigned"?"unassigned":"problem",title:a+d.title,body:d.body,target:l(d.event),suggestions:(d.suggestions??[]).map(g=>({id:g.id,label:g.label,note:ii(g.note)}))}));if(s.clashes.forEach((d,g)=>{n++;let h=r.get(d.a.event??""),f=X(i,d.kid),m="";if(d.b.type==="act"){let v=r.get(d.b.event??"");m=h&&v?`${h.title} ${w(h.start)}–${w(h.end)} and ${v.title} ${w(v.start)}–${w(v.end)} overlap.`:""}else{let v=s.rides[d.b.ride??-1];m=h&&v?`${f} is in ${de(i,v.driver)}’s car ${w(U(d.b.start))}–${w(U(d.b.end))}, during ${h.title}.`:""}e.push({key:`${s.date}|clash|${g}`,tone:"problem",title:`${a}${f} is double-booked`,body:m,target:l(d.a.event),suggestions:[]})}),o>=0&&o<si)for(let d of s.issues)d.level==="heads_up"&&e.push({key:`${s.date}|${d.key}`,tone:"heads_up",title:a+d.title,body:d.body,target:l(d.event),suggestions:[]});for(let d of s.events)d.problems.length&&e.push({key:`${s.date}|notes|${d.id}`,tone:"heads_up",title:`${a}Check the notes on ${X(i,d.kid)}’s ${d.title}`,body:`These lines couldn’t be read: ${d.problems.join("; ")}`,target:l(d.id),suggestions:[]})}return{items:e,problems:n}}function wn(i,t){let e=me(i),n=null,s=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of i.days){let a=Xe(t.date,o.date);if(!(a<0))for(let r of le(i))for(let l of o.drivers[r]?.outings??[]){if(l.start==null)continue;let d=a*1440+l.start;if(a*1440+U(l.end,l.start)<=t.minutes)continue;let h=d-t.minutes,f={driver:r,name:de(i,r),date:o.date,ahead:a,start:l.start,inMinutes:h,ongoing:h<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(m=>e.get(m)??G(0)),warn:l.warn,target:l.target&&o.events.some(m=>m.id===l.target)?{day:o.date,event:l.target}:null};(!n||s(f)<s(n)||s(f)===s(n)&&f.inMinutes<n.inMinutes)&&(n=f)}}return n}var kn=Se`
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
`;var _n="mydashlight.rides.mode",ri=1100,oi=440,ai=700,li=3*6e4,di=1200;function pi(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}function at(i){let t=/\p{L}|\p{N}/u.exec(i);return t?t[0].toUpperCase():"?"}function ci(i){let t=i.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function hi(){try{return localStorage.getItem(_n)==="compact"?"compact":"timeline"}catch{return"timeline"}}function ui(i){try{localStorage.setItem(_n,i)}catch{}}function lt(i){return i.days.every(t=>!t.events.length)}var Ie=class extends Z{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let s=e.clientX-n.x,o=e.clientY-n.y;if(!n.moved){if(Math.abs(s)+Math.abs(o)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-o,n.el.scrollLeft=n.left-s};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.scrollToNow()},li))};this.onKey=e=>{e.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=hi(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.backend&&(this.stopWatching=this.backend.watch(e=>{this.plan=e,this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<ri)return!1;let e=this.plan;return!e||this.width-oi>=Et(xe(e).length,le(e).length)}today(){return Ne(this.plan?.time_zone??pi())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),s=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||s!==this.boardKey)&&(this.board=yn(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=s),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e){let n=this.scroller;!n||!this.board||(n.scrollTop=Math.max(0,bn(this.board,e)-ot-4),this.syncDay())}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0))}goToDay(e){let n=this.plan;if(!n)return;let s=this.today();if(e===s.date){this.scrollToNow();return}let o=this.dayIndexOf(e),a=n.days[o];if(!a)return;let r=1/0;if(this.mode==="timeline"){for(let l of a.events)r=Math.min(r,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let d of l.outings)d.start!=null&&(r=Math.min(r,d.start))}this.scrollToTime(o*1440+(Number.isFinite(r)?Math.max(0,r-30):0))}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,s=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=n+1&&(s=d);let o=this.renderRoot,a=o.querySelector(".pinned .label"),r=o.querySelector(".pinned .tag"),l=o.querySelector(".pinned .sub");a&&a.textContent!==s.label&&(a.textContent=s.label),r&&(r.textContent!==s.tag&&(r.textContent=s.tag),r.hidden=!s.tag),l&&l.textContent!==s.sub&&(l.textContent=s.sub),l?.classList.toggle("warn",s.warn);for(let d of o.querySelectorAll(".day-tile"))d.classList.toggle("in-view",d.dataset.date===s.date)}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?xn(this.board,n.scrollTop+ot+4):null,this.mode=e,ui(e)}findEvent(e){let n=this.plan?.days.find(o=>o.date===e.day),s=n?.events.find(o=>o.id===e.event);return n&&s?{day:n,event:s}:null}open(e){e&&(this.flushArrive(),this.sel=e,this.scope="this",this.arriveDraft=void 0)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,s){if(!this.pending){this.pending={key:e,value:n};try{await s()}catch(o){let a=o instanceof Y?o:new Y("error",String(o));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,n,s){if(!this.backend)return;let o=this.backend;this.save(`${n}`,s,()=>o.setRide(e.id,n,s,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n){if(!this.backend)return;let s=this.backend,o=e.along.includes(n)?e.along.filter(a=>a!==n):[...e.along,n];this.save("along",o,()=>s.setTakeAlong(e.id,o,this.scope))}nudgeArrive(e,n){let s=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;n<0?o=(s??e.start)-5:o=s==null||s+5>=e.start?null:s+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),di)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let s=this.findEvent(n);if(!s||s.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,a=s.event.id,r=this.scope;this.save("arrive",e,()=>o.setArriveBy(a,e,r)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),s=e?$n(e,this.today().date):{items:[],problems:0},o=this.wide||this.sheet||!!this.sel;return c`
      <div class="app ${this.wide?"wide":this.width<ai?"narrow phone":"narrow"}">
        ${this.renderHeader(e,s.problems)} ${e?this.renderWeek(e):x} ${this.renderBanner(e)}
        <main>
          <section class="board-area" aria-label="Everyone’s week">
            ${n&&e?lt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
          </section>
          ${o?c`${this.wide?x:c`<div class="backdrop" @click=${()=>this.closePanel()}></div>`}
                <aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
                  ${this.sel&&e?this.renderEditor(e):this.renderAttention(s.items,s.problems)}
                </aside>`:x}
        </main>
        ${this.toast?c`<div class="toast" role="status">${this.toast}</div>`:x}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(e,n){this.tick;let s=this.today(),o="";if(e){let d=e.time_zone,g=new Date(e.updated);this.error?o=c`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Ze(g,new Date,d)}</span>`:e.status&&!e.status.ok?o=c`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Ze(g,new Date,d)}</span>`:this.backend?.live||(o=`Updated ${Ze(g,new Date,d)}`)}let a=(d,g,h,f)=>c`
      <button type="button" class="seg-btn" title=${f} aria-pressed=${this.mode===d?"true":"false"} @click=${()=>this.setMode(d)}>
        ${h}<span class="seg-label">${g}</span>
      </button>
    `,r=Be(s.minutes),l=!!e&&lt(e);return c`
      <header>
        ${this.showMenu?c`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ke`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:x}
        <div class="titles">
          <h1 class="clock" aria-label=${`${_e(s.date)}, ${r}`}>
            <span class="hm">${r.slice(0,-3)}</span><span class="ampm">${r.slice(-2)}</span>
          </h1>
          <p class="today-line">${_e(s.date)}</p>
          ${o?c`<p class="status">${o}</p>`:x}
        </div>
        ${e&&!l?this.renderNext(e,wn(e,s)):x}
        <div class="controls">
          ${this.wide||l?x:c`<button type="button" class="attn-btn ${n?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${n}</span>
              </button>`}
          <div role="group" aria-label="View" class="seg">
            ${a("timeline","Timeline",ke`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${a("compact","Compact",ke`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>
        </div>
      </header>
    `}renderNext(e,n){if(!n){let l=this.today().date,d=e.days.filter(h=>h.date>=l).reduce((h,f)=>h+f.issues.filter(m=>m.level==="problem"&&m.kind==="unassigned").length,0);if(d){let h=c`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?c`<div class="next idle needs">${h}</div>`:c`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${h}</button>`}let g=e.days.some(h=>h.date>=l&&h.events.length);return c`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${g?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${g?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let s;n.ongoing?s="On the road now":n.ahead===0?s=n.inMinutes<180?`Next trip · in ${He(n.inMinutes)}`:"Next trip · later today":n.ahead===1?s="Next trip · tomorrow":s=`Next trip · ${oe(n.date)}`;let o=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,a=c`
      <span class="next-eyebrow">${s}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${at(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(l=>c`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
      </span>
      ${n.warn?c`<span class="next-stop warn">${n.warn}</span>`:n.stop?c`<span class="next-stop">${n.stop}</span>`:x}
    `,r=`next ${n.ongoing?"ongoing":o?"soon":""}`;return n.target?c`<button type="button" class=${r} @click=${()=>this.open(n.target)}>${a}</button>`:c`<div class=${r}>${a}</div>`}renderWeek(e){let n=this.today().date,s=me(e);return c`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let a=St(o),r=o.events.length,l=o.events.slice(0,6).map(g=>s.get(g.kid)?.color??G(0).color),d=`${_e(o.date)}: ${r?`${r} ${r===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return c`<button
          type="button"
          class="day-tile ${o.date===n?"today":""}"
          data-date=${o.date}
          aria-label=${d}
          @click=${()=>this.goToDay(o.date)}
        >
          <span class="dt-wd">${o.date===n?"Today":oe(o.date)}</span>
          <span class="dt-num">${Number(o.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(g=>c`<span class="dt-dot" style="background:${g}"></span>`):c`<span class="dt-free">free</span>`}
            ${r>6?c`<span class="dt-more">+${r-6}</span>`:x}
          </span>
          ${a?c`<span class="dt-badge" aria-hidden="true">${a}</span>`:x}
        </button>`})}
    </nav>`}renderQuiet(e){let n=xe(e),s=le(e),o=me(e),a=n.map(r=>X(e,r));return c`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((r,l)=>ke`<circle cx=${50+l*30} cy="80" r="11" fill=${o.get(r).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${ci(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(r=>{let l=o.get(r);return c`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${at(X(e,r))}</span>
            <span class="qw-name">${X(e,r)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${s.map(r=>c`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${at(de(e,r))}</span>
            <span class="qw-name">${de(e,r)}</span>
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
    </div>`}renderBanner(e){let n=e?.unavailable_calendars.length??0;return n?c`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:x}renderEmpty(){return this.error?c`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:c`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,s=r=>!!r&&!!n&&r.day===n.day&&r.event===n.event,o=e.dayHeads[0],a=e.width;return c`
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
          ${e.columns.map(r=>c`<div class="col-head ${r.kind}" style="left:${r.x}px;width:${r.w}px;--c:${r.dot};--rgb:${r.rgb}">
              <span class="avatar ${r.kind}" aria-hidden="true">${at(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub ${r.subWarn?"warn":""}">${r.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${a}px">
          <span class="label">${o?.label??""}</span><span class="tag" ?hidden=${!o?.tag}>${o?.tag??""}</span
          ><span class="sub ${o?.warn?"warn":""}">${o?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${a}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(r=>c`<div
                class="col-bg ${r.kind}"
                style="left:${r.x}px;width:${r.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${r.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(r=>c`<div class="day-head" style="top:${r.y}px;width:${a}px">
              <span class="label">${r.label}</span>${r.tag?c`<span class="tag">${r.tag}</span>`:x}<span
                class="sub ${r.warn?"warn":""}"
                >${r.sub}</span
              >
            </div>`)}
          ${e.empties.map(r=>c`<span class="empty" style="top:${r.y}px">${r.text}</span>`)}
          ${e.grid.map(r=>c`<div class="grid ${r.strong?"strong":""}" style="top:${r.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(r=>c`<span class="hour" style="top:${r.y}px">${r.label}</span>`)}
          ${Q(e.bands,r=>r.key,r=>c`<div
                class="band"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:rgba(${r.color.rgb},0.10);border-color:rgba(${r.color.rgb},0.45)"
              ></div>`)}
          ${Q(e.busy,r=>r.key,r=>c`<div class="busy" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px">
                <span style="top:${r.labelY}px">${r.label}</span>
              </div>`)}
          ${Q(e.preps,r=>r.key,r=>c`<div
                class="prep"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:rgba(${r.color.rgb},0.07);color:${r.color.ink}"
              >
                ${r.label}
              </div>`)}
          ${Q(e.cards,r=>r.key,r=>{let l=r.color,d=r.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return c`<button
                type="button"
                class="card ${r.wrap?"wrap":""} ${s(r.target)?"sel":""} ${r.clash?"clash":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:${d};border-color:${r.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--ring:${l.color}"
                @click=${()=>this.open(r.target)}
              >
                <span class="top">
                  <span class="title">${r.title}</span>
                  <span class="time">${r.time}</span>
                  ${r.showDrop&&r.drop?c`<span class="line tone-${r.drop.tone}">${r.drop.text}</span>`:x}
                </span>
                ${r.showPick&&r.pick?c`<span class="line tone-${r.pick.tone}">${r.pick.text}</span>`:x}
              </button>`})}
          ${Q(e.rides,r=>r.key,r=>c`<button
                type="button"
                class="ride ${r.dashed?"dashed":""} ${r.clash?"clash":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}</span>${r.show2?c`<span class="l2" style="-webkit-line-clamp:${r.lines2}">${r.l2}</span>`:x}
              </button>`)}
          ${Q(e.stays,r=>r.key,r=>c`<button
                type="button"
                class="stay"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:repeating-linear-gradient(135deg, rgba(${r.color.rgb},0.28) 0px, rgba(${r.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1" style="color:${r.color.ink}">${r.l1}</span><span class="l2">${r.l2}</span>
              </button>`)}
          ${Q(e.trips,r=>r.key,r=>c`<button
                type="button"
                class="trip ${r.bad?"bad":""} ${r.stops?"list":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}${r.kids.map(l=>c`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${r.show2?c`<span class="l2">${r.l2}</span>`:x}
                ${r.stops?r.stops.map(l=>c`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):x}
                ${r.show3?c`<span class="l3">${r.l3}</span>`:x}
              </button>`)}
          ${Q(e.overlaps,r=>r.key,r=>c`<div class="overlap" aria-hidden="true" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`)}
          ${Q(e.marks,r=>r.key,r=>c`<span class="mark" style="left:${r.x}px;top:${r.y}px;${r.right?"transform:translateX(-100%)":""}">${r.text}</span>`)}
          ${e.now?c`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:x}
        </div>
      </div>
    `}renderAttention(e,n){let s=this.plan;return c`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${n?"bad":"ok"}">${n}</span>
        ${this.wide?x:c`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${s&&!n?c`<div class="all-clear">
            <span class="check" aria-hidden="true">${ke`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${lt(s)?"Nothing needs you this week.":"Every ride is covered and nobody is double-booked."}</span>
          </div>`:x}
      ${e.map(o=>c`<div class="issue ${o.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${o.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${o.target?c`<button type="button" class="issue-title" @click=${()=>this.open(o.target)}>${o.title}</button>`:c`<strong class="issue-title">${o.title}</strong>`}
              <span class="issue-body">${o.body}</span>
            </div>
          </div>
          ${o.suggestions.length?c`<div class="fixes">
                ${o.suggestions.map(a=>c`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(a.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${a.id}`?"Saving…":a.label}</span>
                    <span class="fix-note">${a.note}</span>
                  </button>`)}
              </div>`:x}
        </div>`)}
      ${this.wide&&s&&!lt(s)?this.renderLegend():x}
    `}renderLegend(){return c`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return c``;let{day:s,event:o}=n,a=le(e),l=me(e).get(o.kid)??G(0),d=!!this.pending,g=P=>this.pending?.key===P?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let P of e.days)for(let V of P.events)for(let D of[V.drop,V.pick])D&&D!=="none"&&!a.includes(D)&&!h.some(se=>se.toLowerCase()===D.toLowerCase())&&h.push(D);let f=P=>{if(!o.sides.includes(P))return x;let V=g(P),D=V!==void 0?String(V):P==="drop"?o.drop:o.pick,se=D&&D!=="none"&&!a.includes(D)?D:"",$e=M=>this.setRide(o,P,D===M?"":M),Te=[...a.map(M=>[M,Pt(e,M)]),["none","Not needed"]];return c`<div class="field">
        <span class="field-label">${P==="drop"?"Drop-off":"Pick-up"} ${D===""?c`<span class="nobody">· nobody yet</span>`:x}</span>
        <div role="group" aria-label=${P==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${Te.length}, minmax(0, 1fr))">
          ${Te.map(([M,F])=>c`<button type="button" class="choice" aria-pressed=${D===M?"true":"false"} ?disabled=${d} @click=${()=>$e(M)}>
                ${F}
              </button>`)}
        </div>
        ${h.length?c`<div role="group" aria-label=${P==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(M=>c`<button type="button" class="chip" aria-pressed=${D.toLowerCase()===M.toLowerCase()?"true":"false"} ?disabled=${d} @click=${()=>$e(M)}>
                    ${M}
                  </button>`)}
            </div>`:x}
        <input
          type="text"
          .value=${se&&!h.some(M=>M.toLowerCase()===se.toLowerCase())?se:""}
          ?disabled=${d}
          aria-label=${P==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${M=>{let F=M.target.value.trim();F&&F!==D&&this.setRide(o,P,F)}}
          @keydown=${M=>{M.key==="Enter"&&M.target.blur()}}
        />
      </div>`},m=g("stay"),v=m!==void 0?!!m:o.stay,E=o.drop===o.pick&&a.includes(o.drop),$=g("along"),C=$!==void 0?$:o.along,u=xe(e).filter(P=>P!==o.kid),q=a.includes(o.drop)&&o.sides.includes("drop"),J=g("arrive"),W=this.arriveDraft!==void 0?this.arriveDraft:J!==void 0?J:o.arrive_by,K=[],ve=P=>P==="none"?"Not needed":Pt(e,P);o.drop!==""&&K.push(`Drop-off: ${ve(o.drop)}`),o.pick!==""&&K.push(`Pick-up: ${ve(o.pick)}`),o.stay&&K.push("Stay: yes"),o.along.length&&K.push(`Take along: ${o.along.map(P=>X(e,P)).join(", ")}`),o.arrive_by!=null&&K.push(`Arrive by: ${Be(o.arrive_by)}`);let ye=s.date===this.today().date?"":`${oe(s.date)} · `;return c`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${X(e,o.kid)} · ${o.title}</span>
          <span class="ed-meta">${ye}${w(o.start)}–${w(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>
      ${this.pending?c`<p class="saving" role="status">Saving to Google Calendar…</p>`:x}
      ${o.recurring?c`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${oe(s.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:x}
      ${f("drop")} ${f("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${v?"true":"false"} ?disabled=${!E||d} @click=${()=>this.toggleStay(o)}>
          ${E?v?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${q&&u.length?c`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${u.map(P=>c`<button type="button" class="chip" aria-pressed=${C.includes(P)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(o,P)}>
                  ${X(e,P)}
                </button>`)}
            </div>
          </div>`:x}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${W!=null?`${o.start-W} min before it starts`:`Aims for a few minutes before ${w(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${d} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${W!=null?w(W):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${d||W==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${W!=null?c`<button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:x}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${K.length?K.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?c`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:x}
      <p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>
    `}};Ie.styles=kn,Ie.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Ie);var Le=class extends Z{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new Qe(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return c`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>`}};Le.styles=Se`
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
  `,Le.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",Le);
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
