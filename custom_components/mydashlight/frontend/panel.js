var ot=globalThis,at=ot.ShadowRoot&&(ot.ShadyCSS===void 0||ot.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Rt=Symbol(),wn=new WeakMap,qe=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==Rt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(at&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=wn.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&wn.set(e,n))}return n}toString(){return this.cssText}},kn=s=>new qe(typeof s=="string"?s:s+"",void 0,Rt),ke=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,i,r)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new qe(e,s,Rt)},Cn=(s,n)=>{if(at)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=ot.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,s.appendChild(t)}},Nt=at?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return kn(e)})(s):s;var{is:Es,defineProperty:Ss,getOwnPropertyDescriptor:Ds,getOwnPropertyNames:Ls,getOwnPropertySymbols:zs,getPrototypeOf:Rs}=Object,lt=globalThis,_n=lt.trustedTypes,Ns=_n?_n.emptyScript:"",Bs=lt.reactiveElementPolyfillSupport,Fe=(s,n)=>s,Bt={toAttribute(s,n){switch(n){case Boolean:s=s?Ns:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},An=(s,n)=>!Es(s,n),Tn={attribute:!0,type:String,converter:Bt,reflect:!1,useDefault:!1,hasChanged:An};Symbol.metadata??=Symbol("metadata"),lt.litPropertyMetadata??=new WeakMap;var pe=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Tn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&Ss(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:r}=Ds(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);r?.call(this,a),this.requestUpdate(n,o,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Tn}static _$Ei(){if(this.hasOwnProperty(Fe("elementProperties")))return;let n=Rs(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Fe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Fe("properties"))){let e=this.properties,t=[...Ls(e),...zs(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(Nt(i))}else n!==void 0&&e.push(Nt(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Cn(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:Bt).toAttribute(e,t.type);this._$Em=n,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let r=t.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Bt;this._$Em=i;let o=a.fromAttribute(e,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(n,e,t,i=!1,r){if(n!==void 0){let a=this.constructor;if(i===!1&&(r=this[n]),t??=a.getPropertyOptions(n),!((t.hasChanged??An)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:r},a){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),r!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,r]of t){let{wrapped:a}=r,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};pe.elementStyles=[],pe.shadowRootOptions={mode:"open"},pe[Fe("elementProperties")]=new Map,pe[Fe("finalized")]=new Map,Bs?.({ReactiveElement:pe}),(lt.reactiveElementVersions??=[]).push("2.1.2");var It=globalThis,Pn=s=>s,dt=It.trustedTypes,Mn=dt?dt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Ht="$lit$",ue=`lit$${Math.random().toFixed(9).slice(2)}$`,Ut="?"+ue,Os=`<${Ut}>`,Te=document,Ge=()=>Te.createComment(""),Ye=s=>s===null||typeof s!="object"&&typeof s!="function",jt=Array.isArray,Rn=s=>jt(s)||typeof s?.[Symbol.iterator]=="function",Ot=`[ 	
\f\r]`,Ve=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,En=/-->/g,Sn=/>/g,Ce=RegExp(`>|${Ot}(?:([^\\s"'>=/]+)(${Ot}*=${Ot}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Dn=/'/g,Ln=/"/g,Nn=/^(?:script|style|textarea|title)$/i,Wt=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),d=Wt(1),H=Wt(2),Li=Wt(3),ge=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),zn=new WeakMap,_e=Te.createTreeWalker(Te,129);function Bn(s,n){if(!jt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Mn!==void 0?Mn.createHTML(n):n}var On=(s,n)=>{let e=s.length-1,t=[],i,r=n===2?"<svg>":n===3?"<math>":"",a=Ve;for(let o=0;o<e;o++){let l=s[o],u,p,h=-1,f=0;for(;f<l.length&&(a.lastIndex=f,p=a.exec(l),p!==null);)f=a.lastIndex,a===Ve?p[1]==="!--"?a=En:p[1]!==void 0?a=Sn:p[2]!==void 0?(Nn.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=Ce):p[3]!==void 0&&(a=Ce):a===Ce?p[0]===">"?(a=i??Ve,h=-1):p[1]===void 0?h=-2:(h=a.lastIndex-p[2].length,u=p[1],a=p[3]===void 0?Ce:p[3]==='"'?Ln:Dn):a===Ln||a===Dn?a=Ce:a===En||a===Sn?a=Ve:(a=Ce,i=void 0);let y=a===Ce&&s[o+1].startsWith("/>")?" ":"";r+=a===Ve?l+Os:h>=0?(t.push(u),l.slice(0,h)+Ht+l.slice(h)+ue+y):l+ue+(h===-2?o:y)}return[Bn(s,r+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},Ze=class s{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let r=0,a=0,o=n.length-1,l=this.parts,[u,p]=On(n,e);if(this.el=s.createElement(u,t),_e.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=_e.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(Ht)){let f=p[a++],y=i.getAttribute(h).split(ue),k=/([.?@])?(.*)/.exec(f);l.push({type:1,index:r,name:k[2],strings:y,ctor:k[1]==="."?ht:k[1]==="?"?pt:k[1]==="@"?ut:Pe}),i.removeAttribute(h)}else h.startsWith(ue)&&(l.push({type:6,index:r}),i.removeAttribute(h));if(Nn.test(i.tagName)){let h=i.textContent.split(ue),f=h.length-1;if(f>0){i.textContent=dt?dt.emptyScript:"";for(let y=0;y<f;y++)i.append(h[y],Ge()),_e.nextNode(),l.push({type:2,index:++r});i.append(h[f],Ge())}}}else if(i.nodeType===8)if(i.data===Ut)l.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(ue,h+1))!==-1;)l.push({type:7,index:r}),h+=ue.length-1}r++}}static createElement(n,e){let t=Te.createElement("template");return t.innerHTML=n,t}};function Ae(s,n,e=s,t){if(n===ge)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,r=Ye(n)?void 0:n._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=Ae(s,i._$AS(s,n.values),i,t)),n}var ct=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??Te).importNode(e,!0);_e.currentNode=i;let r=_e.nextNode(),a=0,o=0,l=t[0];for(;l!==void 0;){if(a===l.index){let u;l.type===2?u=new Ne(r,r.nextSibling,this,n):l.type===1?u=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(u=new gt(r,this,n)),this._$AV.push(u),l=t[++o]}a!==l?.index&&(r=_e.nextNode(),a++)}return _e.currentNode=Te,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},Ne=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Ae(this,n,e),Ye(n)?n===m||n==null||n===""?(this._$AH!==m&&this._$AR(),this._$AH=m):n!==this._$AH&&n!==ge&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Rn(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==m&&Ye(this._$AH)?this._$AA.nextSibling.data=n:this.T(Te.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=Ze.createElement(Bn(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new ct(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(n){let e=zn.get(n.strings);return e===void 0&&zn.set(n.strings,e=new Ze(n)),e}k(n){jt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let r of n)i===e.length?e.push(t=new s(this.O(Ge()),this.O(Ge()),this,this.options)):t=e[i],t._$AI(r),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=Pn(n).nextSibling;Pn(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Pe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=m}_$AI(n,e=this,t,i){let r=this.strings,a=!1;if(r===void 0)n=Ae(this,n,e,0),a=!Ye(n)||n!==this._$AH&&n!==ge,a&&(this._$AH=n);else{let o=n,l,u;for(n=r[0],l=0;l<r.length-1;l++)u=Ae(this,o[t+l],e,l),u===ge&&(u=this._$AH[l]),a||=!Ye(u)||u!==this._$AH[l],u===m?n=m:n!==m&&(n+=(u??"")+r[l+1]),this._$AH[l]=u}a&&!i&&this.j(n)}j(n){n===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},ht=class extends Pe{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===m?void 0:n}},pt=class extends Pe{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==m)}},ut=class extends Pe{constructor(n,e,t,i,r){super(n,e,t,i,r),this.type=5}_$AI(n,e=this){if((n=Ae(this,n,e,0)??m)===ge)return;let t=this._$AH,i=n===m&&t!==m||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,r=n!==m&&(t===m||i);i&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},gt=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){Ae(this,n)}},In={M:Ht,P:ue,A:Ut,C:1,L:On,R:ct,D:Rn,V:Ae,I:Ne,H:Pe,N:pt,U:ut,B:ht,F:gt},Is=It.litHtmlPolyfillSupport;Is?.(Ze,Ne),(It.litHtmlVersions??=[]).push("3.3.3");var Hn=(s,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let r=e?.renderBefore??null;t._$litPart$=i=new Ne(n.insertBefore(Ge(),r),r,void 0,e??{})}return i._$AI(s),i};var Kt=globalThis,ee=class extends pe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Hn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ge}};ee._$litElement$=!0,ee.finalized=!0,Kt.litElementHydrateSupport?.({LitElement:ee});var Hs=Kt.litElementPolyfillSupport;Hs?.({LitElement:ee});(Kt.litElementVersions??=[]).push("4.2.2");var Be="mydashlight",Fi=`/api/${Be}/pair`,Vi=`/api/${Be}/pair/poll`,Gi=`/${Be}`,Xe="pair";function Un(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function qt(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function jn(s){let n=new URLSearchParams(s);return n.has(Xe)?qt(n.get(Xe)??""):null}function Us(s){if(s<60)return"just now";let n=Math.round(s/60);return`${n} minute${n===1?"":"s"} ago`}var Je=class extends ee{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let t=await this.connection.sendMessagePromise({type:`${Be}/pair/check`,code:e});t.found?(this.waiting=t,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(t){this.error=this.message(t),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${Be}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let t=e?.code;return t==="unauthorized"?"Only a Home Assistant admin can pair a screen.":t==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":t==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return d`<form @submit=${i=>{i.preventDefault();let r=qt(this.typed);r&&this.check(r)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?d`<p class="error" role="alert">${this.error}</p>`:m}
      <input
        aria-label="Code"
        autocomplete="off"
        autocapitalize="characters"
        spellcheck="false"
        placeholder="ABCD-1234"
        .value=${this.typed}
        @input=${i=>this.typed=i.target.value}
        ?disabled=${e}
      />
      <div class="actions">
        <button type="button" @click=${()=>this.close()}>Cancel</button>
        <button type="submit" class="dark" ?disabled=${e}>${e?"Checking…":"Next"}</button>
      </div>
    </form>`}confirm(){let e=this.waiting,t=this.step==="approving",i=e.home===!1;return d`<h2>Allow this screen?</h2>
      <p class="code">${Un(e.code??"")}</p>
      ${i?d`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:m}
      <p>
        A screen at ${e.address} asked ${Us(e.age??0)}. Check the code matches the one on the screen. It will be
        signed in to Home Assistant as <b>${this.userName||"you"}</b>.
      </p>
      <p>To sign it out later, delete its entry under Refresh tokens on your Home Assistant profile’s Security tab.</p>
      <div class="actions">
        <button type="button" @click=${()=>this.close()} ?disabled=${t}>Cancel</button>
        <button type="button" class="dark" @click=${()=>void this.approve()} ?disabled=${t}>
          ${t?"Allowing…":i?"Allow anyway":"Allow"}
        </button>
      </div>`}render(){let e;return this.isAdmin?this.step==="done"?e=d`<h2>Screen paired</h2>
        <p>It will open the board in a few seconds.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Done</button></div>`:this.step==="confirm"||this.step==="approving"?e=this.confirm():e=this.enter():e=d`<h2>Pair a screen</h2>
        <p>Only a Home Assistant admin can pair a screen. Ask an admin to scan the code instead.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,d`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};Je.styles=ke`
    :host {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(28, 30, 34, 0.45);
      font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
      color: #1c1e22;
    }
    .card {
      width: min(440px, 100%);
      padding: 24px;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 12px 40px rgba(28, 30, 34, 0.25);
    }
    h2 {
      margin: 0 0 8px;
      font-size: 21px;
      line-height: 28px;
    }
    p {
      margin: 0 0 16px;
      font-size: 15px;
      line-height: 22px;
      color: #3d434b;
    }
    .code {
      font-size: 30px;
      line-height: 38px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #1c1e22;
      font-variant-numeric: tabular-nums;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      min-height: 52px;
      padding: 0 14px;
      margin-bottom: 16px;
      border: 1px solid #cfccc4;
      border-radius: 10px;
      font: inherit;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .error {
      color: #b42318;
      font-weight: 600;
    }
    .warning {
      padding: 12px 14px;
      border-radius: 10px;
      background: #fdecea;
      color: #8a1c12;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    button {
      min-height: 44px;
      padding: 0 18px;
      border-radius: 10px;
      border: 1px solid #cfccc4;
      background: #fff;
      font: inherit;
      font-size: 15px;
      font-weight: 600;
      color: inherit;
      cursor: pointer;
    }
    button.dark {
      border-color: #1c1e22;
      background: #1c1e22;
      color: #fff;
    }
    button:disabled {
      opacity: 0.55;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 3px solid #2d5fc4;
      outline-offset: 2px;
    }
  `,Je.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Je);function T(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function Qe(s){let n=Math.floor(Math.round(s)/60)%24;return`${T(s)} ${n<12?"AM":"PM"}`}function Wn(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function tt(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function Kn(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var js=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Ws=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Ks=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function ft(s){return new Date(`${s}T12:00:00Z`)}function ne(s){let n=ft(s);return`${js.format(n)}, ${Ks.format(n)}`}function Y(s){return Ws.format(ft(s))}function se(s,n){return Math.round((ft(n).getTime()-ft(s).getTime())/864e5)}function et(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return et("UTC",n)}let t=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function mt(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let i=et(e,s),r=et(e,n).date;return i.date===r?`at ${Qe(i.minutes)}`:`on ${Y(i.date)} at ${Qe(i.minutes)}`}var N=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}},Me="mydashlight",qs=7,qn=3e4;function Ft(s){if(s instanceof N)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new N(String(n.code??"error"),n.message)}return typeof s=="number"?new N("connection_lost","Lost the connection to Home Assistant."):new N("error",String(s))}var bt=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new N("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.pushing}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},qn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,n&&n().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(n=>{this.pushing=!0,n.plan?this.emit(n.plan):this.fail(new N("not_running","MyDashLight isn’t running right now."))},{type:`${Me}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await this.conn.sendMessagePromise({type:"call_service",domain:Me,service:"get_plan",service_data:{days:qs},return_response:!0});this.emit(n.response)}catch(n){this.fail(Ft(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Me,service:n,service_data:e})}catch(t){throw Ft(t)}this.pushing||await this.refresh()}setRide(n,e,t,i){return this.call("set_ride",{event:n,side:e,driver:t,scope:i})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:Kn(e),scope:t})}setTakeAlong(n,e,t){return this.call("set_take_along",{event:n,kids:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}watchChores(n){let e=!1,t=null,i=null,r=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:Me,service:"get_chores",service_data:{},return_response:!0});e||n(a.response??null)}catch{e||n(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(o=>{e||n(o.chores)},{type:`${Me}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):t=a}catch{if(e)return;r(),i=setInterval(()=>void r(),qn)}})(),()=>{e=!0,i&&clearInterval(i),t&&t().catch(()=>{})}}watchLunch(n){let e=!1,t=null;return(async()=>{try{let i=await this.conn.subscribeMessage(r=>{e||n(r.lunch)},{type:`${Me}/lunch/subscribe`},{resubscribe:!0});e?i().catch(()=>{}):t=i}catch{e||n(null)}})(),()=>{e=!0,t&&t().catch(()=>{})}}async setLunch(n,e,t){await this.choreCall("set_lunch",{kid:n,dates:e,lunch:t??"default"})}async setLunchMenu(n,e,t,i){await this.choreCall("set_lunch_menu",{kids:n,date:e,menu:t,details:i})}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Me,service:n,service_data:e})}catch(t){throw Ft(t)}}};var Fn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Vn=s=>(...n)=>({_$litDirective$:s,values:n}),vt=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:Fs}=In,Gn=s=>s;var Yn=()=>document.createComment(""),Oe=(s,n,e)=>{let t=s._$AA.parentNode,i=n===void 0?s._$AB:n._$AA;if(e===void 0){let r=t.insertBefore(Yn(),i),a=t.insertBefore(Yn(),i);e=new Fs(r,a,s,s.options)}else{let r=e._$AB.nextSibling,a=e._$AM,o=a!==s;if(o){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(r!==i||o){let l=e._$AA;for(;l!==r;){let u=Gn(l).nextSibling;Gn(t).insertBefore(l,i),l=u}}}return e},be=(s,n,e=s)=>(s._$AI(n,e),s),Vs={},Zn=(s,n=Vs)=>s._$AH=n,Xn=s=>s._$AH,xt=s=>{s._$AR(),s._$AA.remove()};var Jn=(s,n,e)=>{let t=new Map;for(let i=n;i<=e;i++)t.set(s[i],i);return t},ie=Vn(class extends vt{constructor(s){if(super(s),s.type!==Fn.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let i=[],r=[],a=0;for(let o of s)i[a]=t?t(o,a):a,r[a]=e(o,a),a++;return{values:r,keys:i}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let i=Xn(s),{values:r,keys:a}=this.dt(n,e,t);if(!Array.isArray(i))return this.ut=a,r;let o=this.ut??=[],l=[],u,p,h=0,f=i.length-1,y=0,k=r.length-1;for(;h<=f&&y<=k;)if(i[h]===null)h++;else if(i[f]===null)f--;else if(o[h]===a[y])l[y]=be(i[h],r[y]),h++,y++;else if(o[f]===a[k])l[k]=be(i[f],r[k]),f--,k--;else if(o[h]===a[k])l[k]=be(i[h],r[k]),Oe(s,l[k+1],i[h]),h++,k--;else if(o[f]===a[y])l[y]=be(i[f],r[y]),Oe(s,i[h],i[f]),f--,y++;else if(u===void 0&&(u=Jn(a,y,k),p=Jn(o,h,f)),u.has(o[h]))if(u.has(o[f])){let c=p.get(a[y]),b=c!==void 0?i[c]:null;if(b===null){let $=Oe(s,i[h]);be($,r[y]),l[y]=$}else l[y]=be(b,r[y]),Oe(s,i[h],b),i[c]=null;y++}else xt(i[f]),f--;else xt(i[h]),h++;for(;y<=k;){let c=Oe(s,l[k+1]);be(c,r[y]),l[y++]=c}for(;h<=f;){let c=i[h++];c!==null&&xt(c)}return this.ut=a,Zn(s,l),ge}});var yt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function O(s){return yt[(s%yt.length+yt.length)%yt.length]}var Qn="#23272E",es="35,39,46";var Gs=3,_t=36,Vt=12,ts=8,Ys=30,Yt=60,Zt=10,wt=30,Xt=10,Zs=150,Xs=200,Ct=1.4;function Qt(s,n){let e=Math.max(Zs,Xs/Ct);return Math.ceil(Yt+Math.max(0,s-1)*Zt+wt+Math.max(0,n-1)*Xt+e*(s+Ct*n))}function Se(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function ve(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function Q(s){return new Map(Se(s).map((n,e)=>[n,O(e)]))}function J(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function xe(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function en(s,n){return n==="none"?"Not needed":ve(s).includes(n)?xe(s,n):n}function Js(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function kt(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function $t(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(kt(n,t.from)),e.push(kt(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(kt(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Qs(s){let n=s.map(a=>({...a,col:0,cols:1})).sort((a,o)=>a.s-o.s||o.en-a.en),e=[],t=[],i=-1/0,r=()=>{for(let a of e)a.cols=t.length;e=[],t=[]};for(let a of n){a.s>=i&&(r(),i=-1/0);let o=t.findIndex(l=>l<=a.s);o<0?(o=t.length,t.push(a.en)):t[o]=a.en,a.col=o,e.push(a),i=Math.max(i,a.en)}return r(),n}function ei(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.t)return i.t===t.t?t.y:Math.round(t.y+(n-t.t)/(i.t-t.t)*(i.y-t.y))}return s[s.length-1].y}function ti(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.y)return i.y===t.y?t.t:t.t+(n-t.y)/(i.y-t.y)*(i.t-t.t)}return s[s.length-1].t}function ss(s,n){return ei(s.anchors,n)}function is(s,n){return ti(s.anchors,n)}function ni(s,n){let e=Se(s),t=ve(s),i=Math.max(n,Qt(e.length,t.length)),a=(i-Yt-Math.max(0,e.length-1)*Zt-wt-Math.max(0,t.length-1)*Xt)/(e.length+Ct*t.length||1),o=Math.floor(a),l=Math.floor(a*Ct),u=new Map;for(let k of s.days)for(let c of k.events){let b=u.get(c.kid)??[];b.some($=>$.event_id===c.event_id&&$.calendar_id===c.calendar_id)||b.push(c),u.set(c.kid,b)}let p=Q(s),h=[],f=Yt;e.forEach((k,c)=>{let b=u.get(k)??[],$=s.days.some(v=>v.events.some(M=>M.kid===k&&(M.sides.includes("drop")&&M.drop===""||M.sides.includes("pick")&&M.pick==="")));h.push({id:k,kind:"kid",x:f,w:o,name:J(s,k),dot:p.get(k).color,rgb:p.get(k).rgb,sub:`${$?"Needs a ride · ":""}${b.length} this week`,subWarn:$}),f+=o+(c<e.length-1?Zt:0)});let y=f+wt/2;return f+=wt,t.forEach((k,c)=>{let b=0,$=0;for(let v of s.days){let M=v.drivers[k];M&&(b+=M.outings.length,$+=M.drive??0)}h.push({id:k,kind:"driver",x:f,w:l,name:xe(s,k),dot:Qn,rgb:es,sub:`${b} ${b===1?"trip":"trips"} this week · ${tt($)} driving`,subWarn:!1}),f+=l+(c<t.length-1?Xt:0)}),{columns:h,sepX:y,width:i}}function si(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(n.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let a=i.slice(r[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function ns(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${T(s.start)}`:e||!n?`${s.title} until ${T(s.end)}`:`${s.title} ${T(s.start)}–${T(s.end)}`}function tn(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length}function nn(s,n){let e=se(n,s);return e===0?"Today":e===1?"Tomorrow":""}function F(s,n=0){return s==null||!Number.isFinite(s)?n:s}function Jt(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),i=1,r=0;for(let a of s.split(/\s+/).filter(Boolean)){let o=a.length;for(r===0?r=o:r+1+o<=t?r+=1+o:(i++,r=o);r>t;)i++,r-=t}return i}var rs=25,os=15,sn=3;function Gt(s){return Math.max(0,Math.min(sn,Math.floor((s-rs)/os)))}function ii(s,n){let e=Math.min(sn,Jt(s,n-19,6.6));return rs+e*os+2}function ri(s,n){let e=n-23,t=`${T(s.start)}–${T(s.end)}`+(s.arrive_by!=null?` · arrive ${T(s.arrive_by)}`:""),i=33+Jt(t,e,6.6)*16;for(let r of[s.lines.drop,s.lines.pick])r&&(i+=2+Jt(r.text,e,7)*16);return i+4}function as(s,n,e,t){let i=n==="compact",{columns:r,sepX:a,width:o}=ni(s,e),l=new Map(r.map(v=>[v.id,v])),u=Se(s),p=ve(s),h=[...u,...p],f=Q(s),y=Js(s),k=v=>J(s,v),c=v=>xe(s,v),b={mode:n,width:o,height:0,columns:r,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},$=0;return s.days.forEach((v,M)=>{let Z=M*1440,A=new Map(v.events.map(g=>[g.id,g])),j=g=>g&&A.has(g)?{day:v.date,event:g}:null,ae=tn(v),ye=v.events.length,ze=nn(v.date,t.date);b.dayHeads.push({date:v.date,y:$,label:ne(v.date),tag:ze,sub:(ye?`${ye} ${ye===1?"activity":"activities"}`:"Nothing scheduled")+(ae?` · ${ae} to sort out`:""),warn:ae>0}),b.anchors.push({t:Z,y:$});let fe=$+_t+Vt,je=p.flatMap(g=>v.drivers[g]?.outings??[]);if(!ye&&!je.length){b.empties.push({key:v.date,y:fe,text:"Nothing planned"}),$=fe+40,b.anchors.push({t:Z+1439,y:$});return}let S=(g,_,C,P,D,X,w)=>{let L=f.get(g.kid)??O(0),B=g.lines;return{key:`${v.date}|card|${g.id}`,x:_,y:C,w:P,h:D,target:{day:v.date,event:g.id},event:g,color:L,kidName:k(g.kid),clash:X,stayed:g.stay&&p.includes(g.drop),skipped:g.attending===!1,title:si(g.title,k(g.kid)),time:`${T(g.start)}–${T(g.end)}`+(g.arrive_by!=null?` · arrive ${T(g.arrive_by)}`:""),drop:B.drop,pick:B.pick,showDrop:!!B.drop&&(w||D>=56),showPick:!!B.pick&&(w||D>=74),wrap:w,aria:`${k(g.kid)}, ${g.title} ${T(g.start)} to ${T(g.end)}. `+(g.attending===!1&&!B.drop?"Not attending. ":"")+[B.drop,B.pick].filter(ce=>!!ce).map(ce=>ce.text).join(". ")}},le=g=>{let _=v.rides[g];return _?(v.drivers[_.driver]?.segments??[]).filter(P=>P.type!=="home"&&P.kids.includes(_.kid)&&F(P.start)>=F(_.start)&&F(P.end)<=F(_.end)):[]},I=g=>{let _=v.rides[g];if(!_)return null;let C=_.serves.find(P=>A.get(P)?.kid===_.kid);return j(C??_.serves[0])},te=new Map;for(let g of v.issues)g.level!=="problem"||!g.event||(g.kind==="late"&&te.set(g.event,`${Math.round(F(g.minutes))} min late`),g.kind==="waiting"&&te.set(`${g.event}|pick`,`Waits ${Math.round(F(g.minutes))} min`));if(!i){let g=1/0,_=-1/0;for(let w of v.events)g=Math.min(g,w.start-20,w.arrive_by!=null?w.arrive_by-10:1/0),_=Math.max(_,w.end+20);for(let w of je)w.start!=null&&(g=Math.min(g,w.start)),w.end!=null&&(_=Math.max(_,w.end));v.date===t.date&&Number.isFinite(g)&&t.minutes>g-60&&t.minutes<_&&(g=Math.min(g,t.minutes-15));let C=Number.isFinite(g)?Math.floor((g-5)/30)*30:900,P=Number.isFinite(_)?Math.ceil((_+5)/30)*30:960,D=w=>Math.round(fe+(Math.max(C,Math.min(P,w))-C)*Gs);b.anchors.push({t:Z+C,y:D(C)},{t:Z+P,y:D(P)});for(let w of u){let L=l.get(w),B=f.get(w),ce=(v.kids[w]?.items??[]).filter(x=>x.start!=null&&x.end!=null).map(x=>({item:x,s:F(x.start),en:F(x.end)})),V=[];for(let x of Qs(ce)){let W=L.w/x.cols,z=Math.round(L.x+x.col*W),R=Math.round(W-(x.cols>1?4:0)),K=D(x.s),he=x.item;if(he.type==="act"){let q=A.get(he.event??"");if(!q)continue;let xn=Math.max(30,D(x.en)-K);if(b.cards.push(S(q,z,K,R,xn,he.clash,!1)),V.push({s:q.arrive_by!=null&&q.start-q.arrive_by>=5?q.arrive_by:x.s,en:x.en,top:K}),q.arrive_by!=null&&q.start-q.arrive_by>=5){let zt=D(q.arrive_by);V[V.length-1].top=zt,b.preps.push({key:`${v.date}|prep|${q.id}`,x:z,y:zt,w:R,h:K-zt+6,color:B,label:`Arrive by ${T(q.arrive_by)}`})}let yn=te.get(q.id);yn&&b.marks.push({key:`${v.date}|late|${q.id}`,x:z+R-4,y:K+4,text:yn,right:!0});let $n=te.get(`${q.id}|pick`);$n&&b.marks.push({key:`${v.date}|wait|${q.id}`,x:z+4,y:K+xn+2,text:$n,right:!1});continue}let G=v.rides[he.ride??-1];if(!G)continue;let $e=Math.max(22,D(x.en)-K),U=$t(le(G.index),y),we=c(G.driver),Ke={key:`${v.date}|ride|${G.index}`,x:z,y:K,w:R,h:$e,target:I(G.index),l1:`${G.own?"In":"Along in"} ${we}’s car`,l2:U.join(" → "),show2:Gt($e)>0,lines2:Gt($e),dashed:!G.own,clash:he.clash,aria:`${k(w)} ${G.own?"in":"riding along in"} ${we}’s car, ${T(F(G.start))} to ${T(F(G.end))}: ${U.join(" to ")}`};b.rides.push(Ke);let vn=l.get(G.driver),Lt=null;vn&&(Lt={key:`${v.date}|band|${G.index}`,x:z+R,y:K,w:Math.max(0,vn.x+8-(z+R)),h:$e,color:B},b.bands.push(Lt)),V.push({s:x.s,en:x.en,top:K,ride:{box:Ke,band:Lt}})}for(let x of V){if(!x.ride)continue;let W=V.filter(R=>R!==x&&R.s>=x.en&&R.s-x.en<=Ys).sort((R,K)=>R.s-K.s||R.top-K.top)[0];if(!W||W.top<=x.ride.box.y+x.ride.box.h)continue;let z=W.top-x.ride.box.y;x.ride.box.h=z,x.ride.box.lines2=Gt(z),x.ride.box.show2=x.ride.box.lines2>0,x.ride.band&&(x.ride.band.h=z)}}for(let w of p){let L=l.get(w),B=v.drivers[w];if(!B)continue;let ce=[],V=null;for(let x of B.segments)if(!(x.start==null||x.end==null)){if(x.type==="home"){V=null;continue}if(x.type==="stay"){V=null,ce.push({type:"stay",g:x,s:x.start,en:x.end});continue}V&&V.en===x.start?(V.en=x.end,V.legs.push(x)):(V={type:"trip",s:x.start,en:x.end,legs:[x]},ce.push(V))}for(let x of ce){let W=D(x.s),z=Math.max(24,D(x.en)-W);if(x.type==="stay"){let U=A.get(x.g.event??x.g.serves??""),we=U?f.get(U.kid)??O(0):O(0),Ke=x.g.kids.map(k);b.stays.push({key:`${v.date}|stay|${w}|${x.s}`,x:L.x+8,y:W,w:L.w-16,h:z,target:j(U?.id),color:we,l1:U?`At ${U.title} with ${k(U.kid)}`:"Staying",l2:`until ${T(x.en)}`+(Ke.length?` · ${Ke.join(" and ")} too`:"")});continue}let R=x.legs[0],K=x.legs[x.legs.length-1],he=[];for(let U of x.legs)for(let we of U.kids)he.includes(we)||he.push(we);let G=K.type==="drive"&&K.to==="home",$e=$t(x.legs,y);b.trips.push({key:`${v.date}|trip|${w}|${x.s}`,x:L.x+8,y:W,w:L.w-16,h:z,target:j(x.legs.find(U=>U.serves)?.serves),l1:R.type==="drive"&&R.from==="home"?`Leave ${T(x.s)}`:`From ${kt(y,R.from??R.place)} ${T(x.s)}`,l2:$e.join(" → "),show2:z>=36,l3:G?`Home ${T(x.en)}`:"",show3:G&&z>=62,stops:null,kids:he.map(U=>(f.get(U)??O(0)).color),bad:x.legs.some(U=>U.overlaps_busy),aria:`${c(w)} drives ${$e.join(" to ")}, ${T(x.s)} to ${T(x.en)}`})}for(let x of B.segments)if(!(!x.overlaps_busy||x.start==null||x.end==null))for(let W of B.busy){let z=Math.max(x.start,W.start),R=Math.min(x.end,W.end);R<=z||b.overlaps.push({key:`${v.date}|overlap|${w}|${z}`,x:L.x+6,y:D(z)-2,w:L.w-12,h:Math.max(8,D(R)-D(z)+4)})}for(let x of B.busy){if(x.end<=C||x.start>=P)continue;let W=D(x.start),z=D(x.end);b.busy.push({key:`${v.date}|busy|${w}|${x.start}`,x:L.x+1,y:W,w:L.w-2,h:z-W,labelY:8,label:ns(x,!1)})}}let X=-1/0;for(let w=C;w<=P;w+=30)b.grid.push({key:`${v.date}|grid|${w}`,y:D(w),strong:w%60===0}),w%60===0&&D(w)-X>=22&&(b.hours.push({key:`${v.date}|hour|${w}`,y:D(w)-8,label:Wn(w)}),X=D(w));v.date===t.date&&t.minutes>C&&t.minutes<P&&(b.now={y:D(t.minutes),label:`Now ${T(t.minutes)}`}),$=D(P)+Vt;return}let de=[];for(let g of u){let _=l.get(g);for(let C of v.kids[g]?.items??[])if(C.start!=null){if(C.type==="act"){let P=A.get(C.event??"");if(!P)continue;de.push({col:g,s:C.start,h:ri(P,_.w),kind:"act",item:C})}else if(!v.rides[C.ride??-1]?.own){let P=v.rides[C.ride??-1],D=P?$t(le(P.index),y).join(" → "):"";de.push({col:g,s:C.start,h:ii(D,_.w),kind:"along",item:C})}}}for(let g of p){let _=v.drivers[g];if(_){for(let C of _.busy)de.push({col:g,s:C.start,h:32,kind:"busy",busy:C});for(let C of _.outings)C.start!=null&&de.push({col:g,s:C.start,h:30+C.lines.length*16+(C.warn?16:0),kind:"out",out:C})}}de.sort((g,_)=>g.s-_.s||h.indexOf(g.col)-h.indexOf(_.col));let Re=new Map,E=[],me=fe;de.forEach((g,_)=>{let C=Re.get(g.col),P=Math.max(C!=null?C+ts:fe,me);Re.set(g.col,P+g.h),me=P;let D=g.kind==="busy"?g.busy.end:g.kind==="act"?A.get(g.item.event??"")?.end??null:null;E.push({col:g.col,s:g.s,end:D,y:P,h:g.h,box:null}),b.anchors.push({t:Z+g.s,y:P});let X=l.get(g.col);if(g.kind==="busy"){let w={key:`${v.date}|busy|${g.col}|${_}`,x:X.x+1,y:P,w:X.w-2,h:g.h,labelY:8,label:ns(g.busy,!0)};b.busy.push(w),E[E.length-1].box=w}else if(g.kind==="out"){let w=g.out;b.trips.push({key:`${v.date}|trip|${g.col}|${_}`,x:X.x+8,y:P,w:X.w-16,h:g.h,target:j(w.target),l1:w.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...w.lines.map(L=>({text:L,warn:!1})),...w.warn?[{text:w.warn,warn:!0}]:[]],kids:w.kids.map(L=>(f.get(L)??O(0)).color),bad:!!w.warn,aria:`${c(g.col)}: ${w.lead}. ${w.lines.join(". ")}${w.warn?`. ${w.warn}`:""}`})}else if(g.kind==="act"){let w=A.get(g.item.event??""),L=S(w,X.x,P,X.w,g.h,g.item.clash,!0);b.cards.push(L),E[E.length-1].box=L}else{let w=v.rides[g.item.ride??-1],L=$t(le(w.index),y),B=c(w.driver);b.rides.push({key:`${v.date}|ride|${w.index}`,x:X.x,y:P,w:X.w,h:g.h,target:I(w.index),l1:`Along with ${B} ${T(F(w.start))}`,l2:L.join(" → "),show2:!0,lines2:sn,dashed:!0,clash:g.item.clash,aria:`${k(g.col)} riding along with ${B}, ${T(F(w.start))} to ${T(F(w.end))}: ${L.join(" to ")}`})}});let We=fe;for(let g of Re.values())We=Math.max(We,g);for(let g of E){if(!g.box||g.end==null)continue;let _=g.y+g.h;for(let C of E)C.col!==g.col&&C.s>=g.s&&C.s<g.end&&(_=Math.max(_,C.y+C.h));g.end>=1440&&(_=We);for(let C of E)C.col===g.col&&C.y>g.y&&(_=Math.min(_,C.y-ts));_=Math.min(_,We),_>g.y+g.h&&(g.box.h=_-g.y)}$=We+Vt+6,b.anchors.push({t:Z+1439,y:$})}),b.height=$,b}var oi=["","¼","½","¾"];function Ee(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return tt(t);let i=Math.round(t*4),r=Math.floor(i/4),a=oi[i%4];return`${r||!a?r:""}${a} min`})}function ls(s){let n=e=>e?{...e,text:Ee(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,i])=>[t,{...i,outings:i.outings.map(r=>({...r,lines:r.lines.map(Ee),warn:r.warn==null?r.warn:Ee(r.warn)}))}])),issues:e.issues.map(t=>({...t,title:Ee(t.title),body:Ee(t.body),note:t.note==null?t.note:Ee(t.note),...t.suggestions?{suggestions:t.suggestions.map(i=>({...i,note:Ee(i.note)}))}:{}}))}))}}var ai=2,li=48;function ds(s,n,e=li){let t=[],i=0,r=0,a=0,o=0,l=n.minutes+e*60;for(let u of s.days){let p=se(n.date,u.date),h=p===0?"":`${Y(u.date)} · `,f=new Map(u.events.map(c=>[c.id,c])),y=c=>c&&f.has(c)?{day:u.date,event:c}:null,k=(c,b)=>p*1440+(c??f.get(b??"")?.start??0)<l;for(let c of u.issues)if(c.level==="problem"){if(!k(c.at,c.event)){a++,c.kind==="unassigned"&&o++;continue}i++,c.kind==="unassigned"&&r++,t.push({key:`${u.date}|${c.key}`,tone:c.kind==="unassigned"?"unassigned":"problem",title:h+c.title,body:c.body,target:y(c.event),suggestions:(c.suggestions??[]).map(b=>({id:b.id,label:b.label,note:b.note}))})}if(u.clashes.forEach((c,b)=>{if(!k(c.a.start,c.a.event)){a++;return}i++;let $=f.get(c.a.event??""),v=J(s,c.kid),M=(A,j)=>{let ae=y(j);return ae?{text:A,target:ae}:A},Z=[];if(c.b.type==="act"){let A=f.get(c.b.event??"");$&&A&&(Z=[M($.title,$.id),` ${T($.start)}–${T($.end)} and `,M(A.title,A.id),` ${T(A.start)}–${T(A.end)} overlap.`])}else{let A=u.rides[c.b.ride??-1];$&&A&&(Z=[`${v} is in `,M(`${xe(s,A.driver)}’s car`,A.serves[0]),` ${T(F(c.b.start))}–${T(F(c.b.end))}, during `,M($.title,$.id),"."])}t.push({key:`${u.date}|clash|${b}`,tone:"problem",title:`${h}${v} is double-booked`,body:Z.map(A=>typeof A=="string"?A:A.text).join(""),parts:Z,target:null,suggestions:[]})}),p>=0&&p<ai)for(let c of u.issues)c.level!=="heads_up"||!k(c.at,c.event)||t.push({key:`${u.date}|${c.key}`,tone:"heads_up",title:h+c.title,body:c.body,target:y(c.event),suggestions:[]});for(let c of u.events)!c.problems.length||!k(c.start)||t.push({key:`${u.date}|notes|${c.id}`,tone:"heads_up",title:`${h}Check the notes on ${J(s,c.kid)}’s ${c.title}`,body:`These lines couldn’t be read: ${c.problems.join("; ")}`,target:y(c.id),suggestions:[]})}return{items:t,problems:i,unassigned:r,later:a,laterUnassigned:o}}function cs(s,n){let e=Q(s),t=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of s.days){let a=se(n.date,r.date);if(!(a<0))for(let o of ve(s))for(let l of r.drivers[o]?.outings??[]){if(l.start==null)continue;let u=a*1440+l.start;if(a*1440+F(l.end,l.start)<=n.minutes)continue;let h=u-n.minutes,f={driver:o,name:xe(s,o),date:r.date,ahead:a,start:l.start,inMinutes:h,ongoing:h<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(y=>e.get(y)??O(0)),warn:l.warn,target:l.target&&r.events.some(y=>y.id===l.target)?{day:r.date,event:l.target}:null};(!t||i(f)<i(t)||i(f)===i(t)&&f.inMinutes<t.inMinutes)&&(t=f)}}return t}function Ie(s){return s.state==="done"||s.state==="late"}var di=780;function ci(s,n,e){return s.state==="open"&&!!s.for_day&&s.due===n&&e<di}function hs(s,n){return s.chores.map(e=>ci(e,s.today,n)?{...e,state:"upcoming",shows_from:s.today}:e)}function ps(s){return s.state==="open"||s.state==="overdue"}function an(s,n,e){if(Ie(s)){let t=s.done_at?hi(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${rn(s.due,n)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${rn(s.for_day,n)}`;let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let i=se(n,s.due);return`By ${i===1?"tomorrow":i<7?Y(s.due):on(s.due)}`}if(s.for_day&&s.due===n)return`Tonight · for ${rn(s.for_day,n)}`;if(s.due&&s.due>n){let t=se(n,s.due);return t===1?"By tomorrow":`By ${t<7?Y(s.due):on(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function rn(s,n){let e=se(n,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?Y(s):on(s)}function on(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function hi(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let r=t.toLocaleDateString("en-CA",{timeZone:i}),a=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return r===n?a:`${Y(r)} ${a}`}function us(s,n,e=1440){let t=hs(s,e).sort((i,r)=>i.order-r.order);return s.kids.map((i,r)=>{let a=t.filter(p=>p.kid===i.id),o=new Map;for(let p of a){if(p.state!=="upcoming")continue;let h=p.shows_from??p.due??s.today;o.set(h,[...o.get(h)??[],p])}let l=a.filter(p=>p.state==="overdue"),u=a.filter(p=>p.state==="open");return{kid:i.id,name:i.name,color:n?.get(i.id)??O(r),overdue:l,now:u,done:a.filter(Ie),later:[...o.entries()].sort(([p],[h])=>p.localeCompare(h)).map(([p,h])=>({date:p,chores:h})),left:l.length+u.length}})}function gs(s,n=1440){return hs(s,n).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,t)=>e.state===t.state?e.order-t.order:e.state==="overdue"?-1:1)}function ln(s){return!s.chores.length&&!s.templates.length}var De=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function dn(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[i,r]=t.split("-").map(a=>De.indexOf(a.trim()));if(i===void 0||i<0||r!==void 0&&r<0)return null;if(r===void 0)e.add(i);else for(let a=0;a<=(r-i+7)%7;a++)e.add((i+a)%7)}return e}function Tt(s){let n=[...new Set(s)].sort((t,i)=>t-i);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let i=e.at(-1);i&&i.at(-1)===t-1?i.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${De[t[0]]}-${De[t.at(-1)]}`]:t.map(i=>De[i])).join(", ")}var Le="none";function At(s){return s==="daily"||s==="school"?"":"Any"}function fs(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function ms(s){return{template:s.id,repeats:s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:s.days??At(s.repeats),every:s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function cn(s){return s.title.trim()?s.who.length?s.days===Le?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function bs(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function hn(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function pn(s,n,e=1,t=!1,i=!1){if(s==="school"){let p=n.trim().replace(/-/g,"–"),h=i?p?`${p} Bring lunch days`:"Bring lunch days":p?`${p} school days`:"Every school day";return t?`${h}, the night before`:h}let r={daily:"day",weekly:"week",monthly:"month"}[s],a=e>1?`every ${e} ${r}s`:`each ${r}`,o=n.trim();if(s==="daily"){let p=o.replace(/-/g,"–");return e>1?p?`${p}, every ${e} days`:`Every ${e} days`:p||"Every day"}if(!o||o.toLowerCase()==="any")return`Sometime ${a}`;if(s==="weekly")return`${o.replace(/-/g,"–")} ${a}`;let u=`${o.split(",").map(p=>{let h=p.trim();return h.toLowerCase()==="last"?"the last day":/^\d+$/.test(h)?`the ${hn(Number(h))}`:`the ${h}`}).join(" and ")} ${a}`;return u[0].toUpperCase()+u.slice(1)}function un(s,n,e=!1){let t=s.map(r=>n.find(a=>a.id===r)?.name??r);if(!t.length)return"Nobody yet";let i=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${i} take turns`:i}function gn(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}function Pt(s,n){return`${s}|${n}`}function He(s,n){let[e,t,i]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1,i+n)).toISOString().slice(0,10)}function Mt(s){let[n,e,t]=s.split("-").map(Number);return(new Date(Date.UTC(n,e-1,t)).getUTCDay()+6)%7}function vs(s,n){return s.days_off.find(e=>e.first<=n&&n<=e.last)??null}function xs(s,n){return Mt(n)<5&&!vs(s,n)}function nt(s,n,e=new Map){if(!xs(s,n))return null;let t=Pt(s.id,n);if(e.has(t)){let r=e.get(t);return r?{lunch:r,picked:!0}:{lunch:s.default,picked:!1}}let i=s.picks[n];return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}function Ue(s,n){return xs(s,n)?s.menus?.[n]??null:null}var pi="From the school's menu feed.";function ui(s){let n=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==pi);return n.length?n.join(`
`):null}function re(s){return s.slice(0,7)}function Et(s){let[n,e]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function fn(s,n=1){let[e,t]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1+n,1)).toISOString().slice(0,7)}function ys(s){let n=[];for(let e=re(s.first);e<=re(s.last);e=fn(e))n.push(e);return n}function $s(s,n,e,t=new Map){let i=`${e}-01`,r=He(i,-Mt(i)),a=[];for(;re(r)<=e;){let o=[];for(let l=0;l<5;l++){let u=He(r,l),p=re(u)!==e,h=p?null:vs(n,u),f=p?null:nt(n,u,t);o.push({date:u,day:Number(u.slice(8)),outside:p,off:h?h.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:p?null:Ue(n,u)?.dish??null,sides:p?null:ui(Ue(n,u)?.details??""),past:u<s.today,today:u===s.today})}o.some(l=>!l.outside)&&a.push(o),r=He(r,7)}return a}function ws(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function ks(s){let n=0,e=0;for(let t of s.flat())t.outside||t.past||!t.lunch||(t.lunch==="bring"?n++:e++);return{bring:n,buy:e}}function Cs(s,n,e,t=new Map){let i=e<780?0:1;for(let r=i;r<8;r++){let a=He(n,r),o=nt(s,a,t);if(!o)continue;let l=se(n,a);return{lunch:o.lunch,when:l===0?"today":l===1?"tomorrow":Y(a),date:a,menu:Ue(s,a)?.dish??null}}return null}var gi={timeline:"timeline",full:"timeline",compact:"compact"};function mn(s){let n=new URLSearchParams(s),e={},t=gi[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(n.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores"||i==="lunch")&&(e.page=i),e}var _s=ke`
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
`;var Ms="mydashlight.rides.mode",fi=1100,mi=440,bi=700,vi=3*6e4,xi=1200;function yi(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var St=H`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Ts=H`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,$i=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],As=H`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Ps=H`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,wi=H`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,ki=H`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,st={bring:"Bring",buy:"Buy"};function Ci(s,n){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return n<=1?`Every ${e}`:n===2?`Every other ${e}`:`Every ${n} ${e}s${s==="monthly"&&n===3?" (quarterly)":""}`}function oe(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function bn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function _i(s,n){return nn(s,n)||ne(s).split(",")[0]}function Ti(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function Ai(){try{return localStorage.getItem(Ms)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Pi(s){try{localStorage.setItem(Ms,s)}catch{}}function Dt(s){return s.days.every(n=>!n.events.length)}var it=class extends ee{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=mn(location.search).view;this.urlPage=mn(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let i=e.clientX-t.x,r=e.clientY-t.y;if(!t.moved){if(Math.abs(i)+Math.abs(r)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-r,t.el.scrollLeft=t.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},vi))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Ai(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let t=new Map(this.lunchDraft);for(let[i,r]of this.lunchDraft){let[a,o]=i.split("|"),l=e.kids.find(u=>u.id===a);(!l||(l.picks[o]??null)===r||!nt(l,o))&&t.delete(i)}this.lunchDraft=t}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let i of e.chores)t.has(i.id)&&Ie(i)===t.get(i.id)&&t.delete(i.id);for(let i of t.keys())e.chores.some(r=>r.id===i)||t.delete(i);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=ls(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<fi)return!1;let e=this.plan;return!e||this.width-mi>=Qt(Se(e).length,ve(e).length)}today(){return et(this.plan?.time_zone??yi())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),i=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=as(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let i=this.scroller;if(!i||!this.board)return;let r=this.board.dayHeads.find(a=>a.date===t)?.y??0;i.scrollTop=Math.max(r,ss(this.board,e)-_t-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),a=t.days[r];if(!a)return;let o=1/0;if(this.mode==="timeline"){for(let l of a.events)o=Math.min(o,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let u of l.outings)u.start!=null&&(o=Math.min(o,u.start))}this.scrollToTime(r*1440+(Number.isFinite(o)?Math.max(0,o-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,i=this.board.dayHeads[0];for(let u of this.board.dayHeads)u.y<=t+1&&(i=u);let r=this.renderRoot,a=r.querySelector(".pinned .label"),o=r.querySelector(".pinned .tag"),l=r.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),o&&(o.textContent!==i.tag&&(o.textContent=i.tag),o.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let u of r.querySelectorAll(".day-tile"))u.classList.toggle("in-view",u.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),r=new Map(this.choreDraft);r.set(e.id,i),this.choreDraft=r;try{await this.backend.setChoreDone(e.id,i,t&&t!==e.kid?t:void 0)}catch(a){let o=new Map(this.choreDraft);o.delete(e.id),this.choreDraft=o;let l=a instanceof N?a:new N("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??Ie(e)}editMenu(e,t){let i=this.lunch?.kids??[],r=Ue(e,t),a=i.filter(o=>o.id===e.id||r&&Ue(o,t)?.dish===r.dish).map(o=>o.id);this.closePanel(),this.menuEdit={kid:e.id,date:t,dish:r?.dish??"",details:r?.details??"",kids:a,had:!!r,busy:!1}}async saveMenu(e=!1){let t=this.menuEdit;if(!(!t||!this.backend||!t.kids.length)){this.menuEdit={...t,busy:!0};try{await this.backend.setLunchMenu(t.kids,t.date,e?"":t.dish.trim(),e?"":t.details.trim()),this.menuEdit=null}catch(i){this.menuEdit={...t,busy:!1};let r=i instanceof N?i:new N("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}}}async saveLunch(e,t,i){if(!this.backend||!t.length)return;let r=new Map(this.lunchDraft);for(let a of t)r.set(Pt(e,a),i);this.lunchDraft=r;try{await this.backend.setLunch(e,t,i)}catch(a){let o=new Map(this.lunchDraft);for(let u of t)o.delete(Pt(e,u));this.lunchDraft=o;let l=a instanceof N?a:new N("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?ms(e):fs(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||cn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(bs(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let i=t instanceof N?t:new N("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let i=t instanceof N?t:new N("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?is(this.board,t.scrollTop+_t+4):null,this.mode=e,this.urlView||Pi(e)}findEvent(e){let t=this.plan?.days.find(r=>r.date===e.day),i=t?.events.find(r=>r.id===e.event);return t&&i?{day:t,event:i}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),i=this.dayIndexOf(e.day);!t||i<0||this.scrollToTime(i*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,i){if(!this.pending){this.pending={key:e,value:t};try{await i()}catch(r){let a=r instanceof N?r:new N("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,t,i){if(!this.backend)return;let r=this.backend;this.save(`${t}`,i,()=>r.setRide(e.id,t,i,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let i=this.backend;this.save("attending",t,()=>i.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t){if(!this.backend)return;let i=this.backend,r=e.along.includes(t)?e.along.filter(a=>a!==t):[...e.along,t];this.save("along",r,()=>i.setTakeAlong(e.id,r,this.scope))}nudgeArrive(e,t){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;t<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),xi)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let i=this.findEvent(t);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,a=i.event.id,o=this.scope;this.save("arrive",e,()=>r.setArriveBy(a,e,o)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),i=e?ds(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?gs(this.chores,this.today().minutes).filter(h=>!this.choreDone(h)):[],o=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",u=d`<aside class="panel" aria-label=${l}>
      ${o??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,p=this.page==="rides";return d`
      <div class="app ${r?"wide":this.width<bi?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${p&&e?this.renderWeek(e):m}
          ${p?this.renderBanner(e):m}
          <main>
            ${p?d`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?Dt(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:this.page==="lunch"?d`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:d`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?d`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${u}`:m}
          </main>
        </div>
        ${r?u:m}
        ${this.toast?d`<div class="toast" role="status">${this.toast}</div>`:m}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,i){let r=t.problems+i;this.tick;let a=this.today(),o="";if(e){let f=e.time_zone,y=new Date(e.updated);this.error?o=d`<span class="bad">Can’t reach Home Assistant · showing the plan from ${mt(y,new Date,f)}</span>`:e.status&&!e.status.ok?o=d`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${mt(y,new Date,f)}</span>`:this.backend?.live||(o=`Updated ${mt(y,new Date,f)}`)}let l=(f,y,k,c)=>d`
      <button type="button" class="seg-btn" title=${c} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${k}<span class="seg-label">${y}</span>
      </button>
    `,u=(f,y,k)=>d`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${k}<span class="seg-label">${y}</span>
      </button>
    `,p=Qe(a.minutes),h=!!e&&Dt(e);return d`
      <header>
        ${this.showMenu?d`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${H`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:m}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ne(a.date)}, ${p}`}>
            <span class="hm">${p.slice(0,-3)}</span><span class="ampm">${p.slice(-2)}</span>
          </h1>
          <p class="today-line">${ne(a.date)}</p>
          ${o?d`<p class="status">${o}</p>`:m}
        </div>
        ${e&&!h?this.renderNext(e,cs(e,a),t):m}
        <div class="controls">
          ${this.wide||h&&!i?m:d`<button type="button" class="attn-btn ${r?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${r}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?m:d`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",H`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",H`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${u("rides","Rides",H`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${u("chores","Chores",H`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?m:u("lunch","Lunch",H`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,i){if(!t){let u=this.today().date,p=i.unassigned,h=i.laterUnassigned;if(p){let y=d`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${p} ${p===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?d`<div class="next idle needs">${y}</div>`:d`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${y}</button>`}if(h)return d`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let f=e.days.some(y=>y.date>=u&&y.events.length);return d`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let r;t.ongoing?r="On the road now":t.ahead===0?r=t.inMinutes<180?`Next trip · in ${tt(t.inMinutes)}`:"Next trip · later today":t.ahead===1?r="Next trip · tomorrow":r=`Next trip · ${Y(t.date)}`;let a=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,o=d`
      <span class="next-eyebrow">${r}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${oe(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(u=>d`<span class="kid-dot" style="background:${u.color}"></span>`)}</span>
      </span>
      ${t.warn?d`<span class="next-stop warn">${t.warn}</span>`:t.stop?d`<span class="next-stop">${t.stop}</span>`:m}
    `,l=`next ${t.ongoing?"ongoing":a?"soon":""}`;return t.target?d`<button type="button" class=${l} @click=${()=>this.open(t.target)}>${o}</button>`:d`<div class=${l}>${o}</div>`}renderWeek(e){let t=this.today().date,i=Q(e);return d`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let a=tn(r),o=r.events.length,l=r.events.slice(0,6).map(p=>i.get(p.kid)?.color??O(0).color),u=`${ne(r.date)}: ${o?`${o} ${o===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return d`<button
          type="button"
          class="day-tile ${r.date===t?"today":""}"
          data-date=${r.date}
          aria-label=${u}
          @click=${()=>this.goToDay(r.date)}
        >
          <span class="dt-wd">${r.date===t?"Today":Y(r.date)}</span>
          <span class="dt-num">${Number(r.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(p=>d`<span class="dt-dot" style="background:${p}"></span>`):d`<span class="dt-free">free</span>`}
            ${o>6?d`<span class="dt-more">+${o-6}</span>`:m}
          </span>
          ${a?d`<span class="dt-badge" aria-hidden="true">${a}</span>`:m}
        </button>`})}
    </nav>`}renderQuiet(e){let t=Se(e),i=ve(e),r=Q(e),a=t.map(o=>J(e,o));return d`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((o,l)=>H`<circle cx=${50+l*30} cy="80" r="11" fill=${r.get(o).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Ti(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(o=>{let l=r.get(o);return d`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${oe(J(e,o))}</span>
            <span class="qw-name">${J(e,o)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(o=>d`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${oe(xe(e,o))}</span>
            <span class="qw-name">${xe(e,o)}</span>
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
    </div>`}renderBanner(e){let t=e?.unavailable_calendars.length??0;return t?d`<div class="banner" role="status">
      Couldn’t read ${t===1?"one calendar":`${t} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:m}renderEmpty(){return this.error?d`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:d`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let t=this.sel,i=o=>!!o&&!!t&&o.day===t.day&&o.event===t.event,r=e.dayHeads[0],a=e.width;return d`
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
          ${e.columns.map(o=>d`<div class="col-head ${o.kind}" style="left:${o.x}px;width:${o.w}px;--c:${o.dot};--rgb:${o.rgb}">
              <span class="avatar ${o.kind}" aria-hidden="true">${oe(o.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${o.name}</span>${o.kind==="kid"?this.renderLunchChip(o.id,!0):m}</span>
                <span class="sub ${o.subWarn?"warn":""}">${o.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${a}px">
          <span class="label">${r?.label??""}</span><span class="tag" ?hidden=${!r?.tag}>${r?.tag??""}</span
          ><span class="sub ${r?.warn?"warn":""}">${r?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${a}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(o=>d`<div
                class="col-bg ${o.kind}"
                style="left:${o.x}px;width:${o.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${o.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(o=>d`<div class="day-head" style="top:${o.y}px;width:${a}px">
              <span class="label">${o.label}</span>${o.tag?d`<span class="tag">${o.tag}</span>`:m}<span
                class="sub ${o.warn?"warn":""}"
                >${o.sub}</span
              >
            </div>`)}
          ${e.empties.map(o=>d`<span class="empty" style="top:${o.y}px">${o.text}</span>`)}
          ${e.grid.map(o=>d`<div class="grid ${o.strong?"strong":""}" style="top:${o.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(o=>d`<span class="hour" style="top:${o.y}px">${o.label}</span>`)}
          ${ie(e.bands,o=>o.key,o=>d`<div
                class="band"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:rgba(${o.color.rgb},0.10);border-color:rgba(${o.color.rgb},0.45)"
              ></div>`)}
          ${ie(e.busy,o=>o.key,o=>d`<div class="busy" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px">
                <span style="top:${o.labelY}px">${o.label}</span>
              </div>`)}
          ${ie(e.preps,o=>o.key,o=>d`<div
                class="prep"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:rgba(${o.color.rgb},0.07);color:${o.color.ink}"
              >
                ${o.label}
              </div>`)}
          ${ie(e.cards,o=>o.key,o=>{let l=o.color,u=o.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:o.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return d`<button
                type="button"
                class="card ${o.wrap?"wrap":""} ${i(o.target)?"sel":""} ${o.clash?"clash":""} ${o.skipped?"skipped":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:${u};border-color:${o.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(o.target)}
              >
                <span class="top">
                  <span class="title">${o.title}</span>
                  <span class="time">${o.time}</span>
                  ${o.showDrop&&o.drop?d`<span class="line tone-${o.drop.tone}">${o.drop.text}</span>`:m}
                </span>
                ${o.showPick&&o.pick?d`<span class="line tone-${o.pick.tone}">${o.pick.text}</span>`:m}
              </button>`})}
          ${ie(e.rides,o=>o.key,o=>d`<button
                type="button"
                class="ride ${o.dashed?"dashed":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}</span>${o.show2?d`<span class="l2" style="-webkit-line-clamp:${o.lines2}">${o.l2}</span>`:m}
              </button>`)}
          ${ie(e.stays,o=>o.key,o=>d`<button
                type="button"
                class="stay"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:repeating-linear-gradient(135deg, rgba(${o.color.rgb},0.28) 0px, rgba(${o.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1" style="color:${o.color.ink}">${o.l1}</span><span class="l2">${o.l2}</span>
              </button>`)}
          ${ie(e.trips,o=>o.key,o=>d`<button
                type="button"
                class="trip ${o.bad?"bad":""} ${o.stops?"list":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}${o.kids.map(l=>d`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${o.show2?d`<span class="l2">${o.l2}</span>`:m}
                ${o.stops?o.stops.map(l=>d`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):m}
                ${o.show3?d`<span class="l3">${o.l3}</span>`:m}
              </button>`)}
          ${ie(e.overlaps,o=>o.key,o=>d`<div class="overlap" aria-hidden="true" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`)}
          ${ie(e.marks,o=>o.key,o=>d`<span class="mark" style="left:${o.x}px;top:${o.y}px;${o.right?"transform:translateX(-100%)":""}">${o.text}</span>`)}
          ${e.now?d`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:m}
        </div>
      </div>
    `}renderAttention(e,t){let{items:i,problems:r,later:a}=e,o=this.plan,l=r+t.length,u=this.chores,p=!!u&&!ln(u);return d`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?m:d`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${p?d`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?d`<div class="attn-chores">${t.map(h=>this.renderChoreRow(h,!0))}</div>`:d`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:d`<p class="panel-sub">Rides in the next two days</p>`}
      ${o&&!r?d`<div class="all-clear">
            <span class="check" aria-hidden="true">${H`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Dt(o)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:m}
      ${i.map(h=>d`<div class="issue ${h.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${h.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${h.target?d`<button type="button" class="issue-title" @click=${()=>this.open(h.target,!0)}>${h.title}</button>`:d`<strong class="issue-title">${h.title}</strong>`}
              <span class="issue-body"
                >${h.parts?h.parts.map(f=>typeof f=="string"?f:d`<button type="button" class="issue-link" @click=${()=>this.open(f.target,!0)}>${f.text}</button>`):h.body}</span
              >
            </div>
          </div>
          ${h.suggestions.length?d`<div class="fixes">
                ${h.suggestions.map(f=>d`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(f.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${f.id}`?"Saving…":f.label}</span>
                    <span class="fix-note">${f.note}</span>
                  </button>`)}
              </div>`:m}
        </div>`)}
      ${this.wide&&o&&!Dt(o)&&this.page==="rides"?this.renderLegend():m}
    `}kidColorOf(e){let t=this.plan?Q(this.plan).get(e):void 0;if(t)return t;let i=this.lunch?.kids.findIndex(r=>r.id===e)??-1;return O(Math.max(0,i))}renderLunchChip(e,t=!1){let i=this.lunch,r=i?.kids.find(u=>u.id===e);if(!i||!r)return m;this.tick;let a=this.today(),o=Cs(r,a.date,a.minutes,this.lunchDraft);if(!o)return m;let l=st[o.lunch];return d`<span class="lunch-chip ${o.lunch} ${t?"small":""}" title=${`${l} lunch ${o.when}${o.menu?`: ${o.menu}`:""}`}
      >${o.lunch==="bring"?As:Ps}<span class="lunch-chip-text"
        >${l}${t?m:` ${o.when}`}${!t&&o.menu?d`<span class="lunch-chip-menu"> · ${o.menu}</span>`:m}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return d`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let t=ys(e),i=this.lunchMonth&&t.includes(this.lunchMonth)?this.lunchMonth:re(e.today),r=t.indexOf(i),a=p=>{let h=t[r+p];h&&(this.lunchMonth=h)},o=e.kids.some(p=>p.id===this.lunchKid)?this.lunchKid:null,l=o?e.kids.filter(p=>p.id===o):e.kids,u=e.status&&!e.status.ok?d`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:m;return d`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${r<=0} @click=${()=>a(-1)}>
            ${H`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Et(i)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${r<0||r>=t.length-1} @click=${()=>a(1)}>
            ${H`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":d`${Ts} Edit menus`}
        </button>
      </div>
      ${u}
      <div class="chore-cols lunch-cols ${o?"wide":""}" style="--n:${l.length}">
        ${l.map(p=>this.renderLunchCard(e,p,i,o!==null))}
      </div>
      <p class="message-aside">
        Picks are saved as <strong>Bring Lunch</strong> and <strong>Buy Lunch</strong> all-day events on each kid’s calendar.
        Menus are <strong>Lunch: Pizza</strong> all-day events there, with the rest of the menu in the notes. They can
        come from the school’s menu feed (set in Home Assistant under MyDashLight’s options, Lunch), a calendar file
        imported once a month, or <strong>Edit menus</strong> here.
        Days off come from <strong>No School</strong> events there. A day nobody picked gets the kid’s default, set in
        Home Assistant under MyDashLight’s options. For a Pack lunch reminder, add a School days chore set to
        <strong>Only on Bring lunch days</strong>.
      </p>
    </div>`}renderLunchCard(e,t,i,r){let a=this.kidColorOf(t.id),o=$s(e,t,i,this.lunchDraft),l=ks(o),u=o.flat(),p=u.filter(c=>!c.outside&&!c.past&&c.lunch),h=t.days_off.filter(c=>re(c.first)<=i&&i<=re(c.last)),f=c=>p.filter(b=>Mt(b.date)===c),y=c=>{let b=f(c);if(!b.length)return;let $=b.every(v=>v.lunch==="bring")?"buy":"bring";this.saveLunch(t.id,b.map(v=>v.date),$)},k=p.length?`${l.bring} Bring · ${l.buy} Buy${i===re(e.today)?" left this month":""}`:"No school days left this month";return d`<section class="chore-col lunch-card ${r?"wide":""}" style="--c:${a.color};--rgb:${a.rgb};--k:${a.ink}" aria-label=${`${t.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${oe(t.name)}</span>
        <span class="ch-text">
          <span class="name">${t.name}</span>
          <span class="sub">${k}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${st[t.default]} unless picked</span>
          ${e.kids.length<2?m:d`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${r?"Show everyone’s lunches":`Expand ${t.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=r?null:t.id}
              >
                ${r?ki:wi}${r?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${t.menu_feed&&!t.menu_feed.ok?d`<p class="field-hint bad">Couldn’t read the school menu feed${t.menu_feed.error?`: ${t.menu_feed.error}`:""}.</p>`:m}
      <div class="lunch-grid" role="grid" aria-label=${`${t.name}, ${Et(i)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((c,b)=>d`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f(b).length}
            aria-label=${`${f(b).every($=>$.lunch==="bring")?"Buy":"Bring"} every ${c} left in ${Et(i)} for ${t.name}`}
            @click=${()=>y(b)}
          >
            ${c}
          </button>`)}
        ${u.map(c=>this.renderLunchCell(t,c,r))}
      </div>
      ${h.length?d`<p class="lunch-offs">
            No school:
            ${h.map(c=>{let b=c.first<`${i}-01`?`${i}-01`:c.first,$=re(c.last)>i?He(`${fn(i)}-01`,-1):c.last;return`${b===$?bn(b):`${bn(b)}–${bn($)}`} ${ws(c.title)}`}).join(" · ")}
          </p>`:m}
    </section>`}renderLunchCell(e,t,i=!1){if(t.outside)return d`<span class="lunch-day outside" aria-hidden="true"></span>`;if(t.off!==null||!t.lunch)return d`<span class="lunch-day off ${t.today?"today":""}" title=${t.off??""}>
        <span class="lunch-num">${t.day}</span><span class="lunch-word">No school</span>
      </span>`;let r=t.lunch,a=r==="buy"?"bring":"buy",o=t.menu?`, ${t.menu}`:"",l=this.menuMode,u=this.menuEdit?.date===t.date&&this.menuEdit.kids.includes(e.id),p=l?`${e.name}, ${ne(t.date)}${o||", no menu yet"}. Tap to ${t.menu?"change":"add"} the menu.`:`${e.name}, ${ne(t.date)}: ${st[r]}${t.picked?"":" (not picked yet)"}${o}. Tap to ${st[a]}.`;return d`<button
      type="button"
      class="lunch-day ${r} ${t.picked?"picked":"unpicked"} ${t.past?"past":""} ${t.today?"today":""} ${l?"editing":""} ${u?"sel":""}"
      ?disabled=${t.past&&!l}
      aria-label=${p}
      @click=${()=>l?this.editMenu(e,t.date):void this.saveLunch(e.id,[t.date],a)}
    >
      <span class="lunch-num">${t.day}</span>
      <span class="lunch-word">${r==="bring"?As:Ps}${st[r]}</span>
      ${t.menu?d`<span class="lunch-menu">${t.menu}</span>${i&&t.sides?d`<span class="lunch-sides">${t.sides}</span>`:m}`:l?d`<span class="lunch-menu add">${St} Menu</span>`:m}
    </button>`}renderChoreRow(e,t=!1){let i=this.chores,r=this.choreDone(e),a=i.kids.findIndex($=>$.id===e.kid),o=(this.plan?Q(this.plan).get(e.kid):void 0)??O(Math.max(0,a)),l=i.kids[a]?.name??"",u=r===Ie(e)?e:{...e,state:r?"done":"open",done_at:r?new Date().toISOString():null},p=r&&u.done_by&&u.done_by!==e.kid?i.people?.find($=>$.id===u.done_by)?.name??u.done_by_name??null:null,h=`${an(u,i.today,i.time_zone)}${p?` · by ${p}`:""}`,f=r||ps(e),y=`${t?`${l}: `:""}${e.title}. ${h?`${h}. `:""}${r?"Done. Tap to undo.":"Tap when it’s done."}`,k=d`<span class="box" aria-hidden="true"
        >${r?H`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:m}</span
      >
      ${e.icon?d`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:m}
      <span class="chore-text">
        <span class="chore-title">${t?d`<span class="chore-kid">${l}</span> · `:m}${e.title}</span>
        ${h?d`<span class="chore-note">${h}</span>`:m}
      </span>`,c=`chore ${r?"done":""} ${e.state==="overdue"&&!r?"overdue":""} ${f?"":"later"}`,b=`--c:${o.color};--rgb:${o.rgb};--k:${o.ink}`;return f?d`<button type="button" class=${c} style=${b} aria-pressed=${r?"true":"false"} aria-label=${y} @click=${()=>this.tapChore(e)}>
          ${k}
        </button>`:d`<div class=${c} style=${b}>${k}</div>`}renderChores(){let e=this.chores;if(e===void 0)return d`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return d`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return d`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(ln(e))return d`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${St} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore templates: Daily</strong> (or Weekly or Monthly). It
          shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(a=>a.problems.length),i=t.length?d`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(a=>this.renderTemplateRow(a))}</div>
        </section>`:m;this.tick;let r=us(e,this.plan?Q(this.plan):void 0,this.today().minutes);return d`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${St} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Ts} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${r.length}">
        ${r.map(a=>{let o=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return d`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${oe(a.name)}</span>
              <span class="ch-text">
                <span class="name">${a.name}</span>
                <span class="sub">${o?`${o} to do`:a.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(a.kid)}
            </div>
            ${a.overdue.length?d`<h3 class="chore-group overdue">Missed</h3>
                  ${a.overdue.map(l=>this.renderChoreRow(l))}`:m}
            ${a.now.length?d`<h3 class="chore-group">To do</h3>
                  ${a.now.map(l=>this.renderChoreRow(l))}`:m}
            ${a.done.length?d`<h3 class="chore-group">Done</h3>
                  ${a.done.map(l=>this.renderChoreRow(l))}`:m}
            ${a.later.map(l=>d`<h3 class="chore-group">${l.date===e.today?"Later today":_i(l.date,e.today)}</h3>
                ${l.chores.map(u=>this.renderChoreRow(u))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?d`<p class="chore-none">No chores this week.</p>`:m}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,r=this.plan?Q(this.plan):void 0,a=this.choreEdit?.template===e.id,o=e.problems.length?d`<span class="tmpl-note bad">${e.problems.map(gn).join(" · ")} · tap to set up</span>`:d`<span class="tmpl-note">${un(e.who,i,e.take_turns)} · ${pn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return d`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${a?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?d` <span class="tag-paused">Paused</span>`:m}</span>
        ${o}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let u=i.findIndex(h=>h.id===l),p=r?.get(l)??O(Math.max(0,u));return d`<span class="kid-dot" style="background:${p.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day or some days"],["school","School days"],["weekly","Weekly"],["monthly","Monthly"]];return d`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${St} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([i,r])=>{let a=e.templates.filter(o=>o.repeats===i);return a.length?d`<section class="manage-group" aria-label=${r}>
                  <h3 class="chore-group">${r}</h3>
                  <div class="tmpl-list">${a.map(o=>this.renderTemplateRow(o))}</div>
                </section>`:m}):d`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the lists <strong>Chore templates: Daily</strong>, <strong>Weekly</strong>,
        <strong>Monthly</strong> and <strong>School days</strong>. A task added there by hand shows up here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return d``;let i=t.kids,r=this.plan?Q(this.plan):void 0,a=this.choreBusy,o=e.template?t.templates.find(c=>c.id===e.template):void 0,l=cn(e),u=(o?.problems??[]).filter(c=>c!=="who:"),p=(c,b,$,v=!1)=>d`<button type="button" class="choice ${v?"wide":""}" aria-pressed=${c?"true":"false"} ?disabled=${a} @click=${$}>${b}</button>`,h=(c,b,$,v)=>d`<button type="button" class="chip" aria-pressed=${c?"true":"false"} aria-label=${v??m} ?disabled=${a} @click=${$}>${b}</button>`,f=c=>{c!==e.repeats&&this.changeDraft({repeats:c,days:o&&o.repeats===c?o.days??At(c):At(c)})},y=c=>{let b=e.who.includes(c)?e.who.filter($=>$!==c):i.filter($=>$.id===c||e.who.includes($.id)).map($=>$.id);this.changeDraft({who:b})},k;if(e.repeats==="school"){let c=e.days===Le?new Set:e.days===""?new Set([0,1,2,3,4]):dn(e.days)??new Set,b=$=>{let v=new Set(c);v.has($)?v.delete($):v.add($),this.changeDraft({days:v.size===5?"":v.size?Tt(v):Le})};k=d`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${De.slice(0,5).map(($,v)=>h(c.has(v),$.slice(0,2),()=>b(v),$))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${p(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${p(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${p(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let c=e.days.trim(),b=/^\d+$/.test(c)?Number(c):null,$=c&&c.toLowerCase()!=="any"&&c.toLowerCase()!=="last"&&b===null;k=d`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${$?4:3}, minmax(0, 1fr))">
          ${p(c===""||c.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${p(b!==null,"On a date",()=>this.changeDraft({days:String(b??1)}))}
          ${p(c.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${$?p(!0,c,()=>{}):m}
        </div>
        ${b!==null?d`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${a||b<=1} @click=${()=>this.changeDraft({days:String(b-1)})}>−</button>
                <span class="arrive-value">${hn(b)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${a||b>=31} @click=${()=>this.changeDraft({days:String(b+1)})}>+</button>
              </span>
            </div>`:d`<p class="field-hint">${c.toLowerCase()==="last"?"Due on the month’s last day.":$?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else{let c=e.repeats==="weekly"&&(e.days===""||e.days.toLowerCase()==="any"),b=e.days===Le?new Set:c?new Set:dn(e.days)??new Set,$=v=>{let M=new Set(b);M.has(v)?M.delete(v):M.add(v),e.repeats==="weekly"?this.changeDraft({days:M.size?Tt(M)||"Mon-Sun":"Any"}):this.changeDraft({days:M.size?Tt(M):Le})};k=d`<div class="field">
        <span class="field-label">${e.repeats==="weekly"?"Which day":"Which days"}</span>
        ${e.repeats==="weekly"?d`<div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
              ${p(c,"Any day that week",()=>this.changeDraft({days:"Any"}))}
              ${p(!c,"On a set day",()=>this.changeDraft({days:c?"Sat":e.days}))}
            </div>`:m}
        ${e.repeats==="daily"||!c?d`<div role="group" aria-label="Days of the week" class="day-chips">
              ${De.map((v,M)=>h(b.has(M),v.slice(0,2),()=>$(M),v))}
            </div>`:m}
        ${e.repeats==="daily"?d`<div class="chips">
              ${h(e.days==="","Every day",()=>this.changeDraft({days:""}))}
              ${h(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
              ${h(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
            </div>`:d`<p class="field-hint">${c?"Shows all week, due on Sunday.":"Due that day."}</p>`}
      </div>`}return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?d`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:m}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?un(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===Le?"No days picked":pn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${a} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${u.length?d`<p class="field-hint bad">${u.map(gn).join(". ")}. Saving fixes it.</p>`:m}
      <div class="field">
        <label class="field-label" for="chore-name">Chore</label>
        <input
          id="chore-name"
          class="text-input"
          type="text"
          autocomplete="off"
          placeholder="Make bed"
          .value=${e.title}
          ?disabled=${a}
          @input=${c=>this.changeDraft({title:c.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${$i.map(c=>h(e.icon===c,c,()=>this.changeDraft({icon:e.icon===c?null:c}),`Picture ${c}`))}
        </div>
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((c,b)=>{let $=r?.get(c.id)??O(b),v=e.who.includes(c.id);return d`<button type="button" class="who-chip" style="--c:${$.color};--rgb:${$.rgb}" aria-pressed=${v?"true":"false"} ?disabled=${a} @click=${()=>y(c.id)}>
              <span class="avatar" aria-hidden="true">${oe(c.name)}</span>${c.name}
            </button>`})}
        </div>
        ${e.who.length>1?d`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${p(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${p(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:m}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${p(e.repeats==="daily","Days",()=>f("daily"))}
          ${p(e.repeats==="school","School days",()=>f("school"))}
          ${p(e.repeats==="weekly","Weekly",()=>f("weekly"))}
          ${p(e.repeats==="monthly","Monthly",()=>f("monthly"))}
        </div>
      </div>
      ${k}
      ${e.repeats==="school"?m:d`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Repeats</span>
          <span class="field-hint">${Ci(e.repeats,e.every)}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${a||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${a||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${a}
          @input=${c=>this.changeDraft({details:c.target.value})}
        ></textarea>
      </div>
      ${e.template?d`<div class="field">
              ${p(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${a} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:m}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${a?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let t=this.lunch;if(!t)return d``;let i=e.busy,r=p=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...p})},a=p=>r({kids:e.kids.includes(p)?e.kids.filter(h=>h!==p):[...e.kids,p]}),o=t.kids.filter(p=>nt(p,e.date)),l=e.dish.trim(),u=e.kids.length?l?null:"Type what’s served":"Pick who gets this menu";return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${ne(e.date)}</span>
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
          @input=${p=>r({dish:p.target.value})}
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
          @input=${p=>r({details:p.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${o.map(p=>{let h=this.kidColorOf(p.id),f=e.kids.includes(p.id);return d`<button type="button" class="who-chip" style="--c:${h.color};--rgb:${h.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${i} @click=${()=>a(p.id)}>
              <span class="avatar" aria-hidden="true">${oe(p.name)}</span>${p.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${l||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?d`<button type="button" class="chip clear remove" ?disabled=${i||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:m}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${i||!!u} @click=${()=>void this.saveMenu()}>
          ${i?"Saving to Google Calendar…":u??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return d``;let i=t.people?.length?t.people:t.kids.map(h=>({...h,role:"kid"})),r=t.kids.findIndex(h=>h.id===e.kid),a=t.kids[r],o=this.plan?Q(this.plan):void 0,l=o?.get(e.kid)??O(Math.max(0,r)),u=i.filter(h=>h.id!==e.kid),p=h=>{let f=t.kids.findIndex(y=>y.id===h.id);return f>=0?(o?.get(h.id)??O(f)).color:"var(--dark)"};return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?d`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:m}${e.title}</span>
          <span class="ed-meta">${a?.name??""} · ${an(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${oe(a?.name??"?")}</span>
          <span>${a?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?d`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${u.map(h=>d`<button type="button" class="done-by" style="--c:${p(h)}" @click=${()=>void this.toggleChore(e,h.id)}>
                  <span class="avatar ${h.role==="parent"?"driver":""}" aria-hidden="true">${oe(h.name)}</span>
                  <span>${h.name}</span>
                </button>`)}
            </div>`:d`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return d`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return d``;let{day:i,event:r}=t,a=ve(e),l=Q(e).get(r.kid)??O(0),u=!!this.pending,p=S=>this.pending?.key===S?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let S of e.days)for(let le of S.events)for(let I of[le.drop,le.pick])I&&I!=="none"&&!a.includes(I)&&!h.some(te=>te.toLowerCase()===I.toLowerCase())&&h.push(I);let f=S=>{if(!r.sides.includes(S))return m;let le=p(S),I=le!==void 0?String(le):S==="drop"?r.drop:r.pick,te=I&&I!=="none"&&!a.includes(I)?I:"",de=E=>this.setRide(r,S,I===E?"":E),Re=[...a.map(E=>[E,en(e,E)]),["none","Not needed"]];return d`<div class="field">
        <span class="field-label">${S==="drop"?"Drop-off":"Pick-up"} ${I===""?d`<span class="nobody">· nobody yet</span>`:m}</span>
        <div role="group" aria-label=${S==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${Re.length}, minmax(0, 1fr))">
          ${Re.map(([E,me])=>d`<button type="button" class="choice" aria-pressed=${I===E?"true":"false"} ?disabled=${u} @click=${()=>de(E)}>
                ${me}
              </button>`)}
        </div>
        ${h.length?d`<div role="group" aria-label=${S==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(E=>d`<button type="button" class="chip" aria-pressed=${I.toLowerCase()===E.toLowerCase()?"true":"false"} ?disabled=${u} @click=${()=>de(E)}>
                    ${E}
                  </button>`)}
            </div>`:m}
        <input
          type="text"
          .value=${te&&!h.some(E=>E.toLowerCase()===te.toLowerCase())?te:""}
          ?disabled=${u}
          aria-label=${S==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${E=>{let me=E.target.value.trim();me&&me!==I&&this.setRide(r,S,me)}}
          @keydown=${E=>{E.key==="Enter"&&E.target.blur()}}
        />
      </div>`},y=p("stay"),k=y!==void 0?!!y:r.stay,c=r.drop===r.pick&&a.includes(r.drop),b=p("along"),$=b!==void 0?b:r.along,v=Se(e).filter(S=>S!==r.kid),M=a.includes(r.drop)&&r.sides.includes("drop"),Z=p("arrive"),A=this.arriveDraft!==void 0?this.arriveDraft:Z!==void 0?Z:r.arrive_by,j=[],ae=S=>S==="none"?"Not needed":en(e,S);r.drop!==""&&j.push(`Drop-off: ${ae(r.drop)}`),r.pick!==""&&j.push(`Pick-up: ${ae(r.pick)}`),r.stay&&j.push("Stay: yes"),r.along.length&&j.push(`Take along: ${r.along.map(S=>J(e,S)).join(", ")}`),r.arrive_by!=null&&j.push(`Arrive by: ${Qe(r.arrive_by)}`);let ye=p("attending"),ze=ye!==void 0?!!ye:r.attending!==!1;r.attending===!1&&j.splice(0,j.length,"Attending: no");let fe=i.date===this.today().date?"":`${Y(i.date)} · `,je=d`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${J(e,r.kid)} · ${r.title}</span>
          <span class="ed-meta">${fe}${T(r.start)}–${T(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return r.where==="home"?d`${je}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${J(e,r.kid)} can’t get home in time, the board shows it as a clash.</p>`:d`
      ${je}
      ${this.pending?d`<p class="saving" role="status">Saving to Google Calendar…</p>`:m}
      ${r.recurring?d`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${Y(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:m}
      <div class="field">
        <span class="field-label">${J(e,r.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${ze?"true":"false"} ?disabled=${u} @click=${()=>this.setAttending(r,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${ze?"false":"true"} ?disabled=${u} @click=${()=>this.setAttending(r,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${ze?d`${r.where==="anywhere"?d`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:m}
            ${f("drop")} ${f("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${k?"true":"false"} ?disabled=${!c||u} @click=${()=>this.toggleStay(r)}>
          ${c?k?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${M&&v.length?d`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${v.map(S=>d`<button type="button" class="chip" aria-pressed=${$.includes(S)?"true":"false"} ?disabled=${u} @click=${()=>this.toggleAlong(r,S)}>
                  ${J(e,S)}
                </button>`)}
            </div>
          </div>`:m}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${A!=null?`${r.start-A} min before it starts`:`Aims for a few minutes before ${T(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${u} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${A!=null?T(A):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${u||A==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${A!=null?d`<button type="button" class="chip clear" ?disabled=${u} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:m}
`:d`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${j.length?j.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${r.problems.length?d`<p class="field-hint bad">These lines in the notes couldn’t be read: ${r.problems.join("; ")}</p>`:m}
      ${ze?d`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:m}
    `}};it.styles=_s,it.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",it);var rt=class extends ee{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=jn(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(Xe);let t=e.toString();history.replaceState(history.state,"",`${location.pathname}${t?`?${t}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new bt(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return d`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?d`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:m}`}};rt.styles=ke`
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
  `,rt.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",rt);
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
