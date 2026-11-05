var nt=globalThis,st=nt.ShadowRoot&&(nt.ShadyCSS===void 0||nt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Mt=Symbol(),mn=new WeakMap,je=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==Mt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(st&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=mn.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&mn.set(e,n))}return n}toString(){return this.cssText}},bn=s=>new je(typeof s=="string"?s:s+"",void 0,Mt),we=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,i,r)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new je(e,s,Mt)},vn=(s,n)=>{if(st)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=nt.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,s.appendChild(t)}},Et=st?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return bn(e)})(s):s;var{is:ws,defineProperty:ks,getOwnPropertyDescriptor:Cs,getOwnPropertyNames:_s,getOwnPropertySymbols:As,getPrototypeOf:Ts}=Object,it=globalThis,xn=it.trustedTypes,Ps=xn?xn.emptyScript:"",Ms=it.reactiveElementPolyfillSupport,We=(s,n)=>s,St={toAttribute(s,n){switch(n){case Boolean:s=s?Ps:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},$n=(s,n)=>!ws(s,n),yn={attribute:!0,type:String,converter:St,reflect:!1,useDefault:!1,hasChanged:$n};Symbol.metadata??=Symbol("metadata"),it.litPropertyMetadata??=new WeakMap;var de=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=yn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&ks(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:r}=Cs(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);r?.call(this,a),this.requestUpdate(n,o,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??yn}static _$Ei(){if(this.hasOwnProperty(We("elementProperties")))return;let n=Ts(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(We("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(We("properties"))){let e=this.properties,t=[..._s(e),...As(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(Et(i))}else n!==void 0&&e.push(Et(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vn(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:St).toAttribute(e,t.type);this._$Em=n,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let r=t.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:St;this._$Em=i;let o=a.fromAttribute(e,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(n,e,t,i=!1,r){if(n!==void 0){let a=this.constructor;if(i===!1&&(r=this[n]),t??=a.getPropertyOptions(n),!((t.hasChanged??$n)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:r},a){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),r!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,r]of t){let{wrapped:a}=r,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};de.elementStyles=[],de.shadowRootOptions={mode:"open"},de[We("elementProperties")]=new Map,de[We("finalized")]=new Map,Ms?.({ReactiveElement:de}),(it.reactiveElementVersions??=[]).push("2.1.2");var Lt=globalThis,wn=s=>s,rt=Lt.trustedTypes,kn=rt?rt.createPolicy("lit-html",{createHTML:s=>s}):void 0,zt="$lit$",ce=`lit$${Math.random().toFixed(9).slice(2)}$`,Rt="?"+ce,Es=`<${Rt}>`,_e=document,Fe=()=>_e.createComment(""),Ke=s=>s===null||typeof s!="object"&&typeof s!="function",Nt=Array.isArray,Mn=s=>Nt(s)||typeof s?.[Symbol.iterator]=="function",Dt=`[ 	
\f\r]`,qe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Cn=/-->/g,_n=/>/g,ke=RegExp(`>|${Dt}(?:([^\\s"'>=/]+)(${Dt}*=${Dt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),An=/'/g,Tn=/"/g,En=/^(?:script|style|textarea|title)$/i,Bt=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),d=Bt(1),K=Bt(2),ki=Bt(3),pe=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),Pn=new WeakMap,Ce=_e.createTreeWalker(_e,129);function Sn(s,n){if(!Nt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return kn!==void 0?kn.createHTML(n):n}var Dn=(s,n)=>{let e=s.length-1,t=[],i,r=n===2?"<svg>":n===3?"<math>":"",a=qe;for(let o=0;o<e;o++){let l=s[o],h,u,p=-1,g=0;for(;g<l.length&&(a.lastIndex=g,u=a.exec(l),u!==null);)g=a.lastIndex,a===qe?u[1]==="!--"?a=Cn:u[1]!==void 0?a=_n:u[2]!==void 0?(En.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=ke):u[3]!==void 0&&(a=ke):a===ke?u[0]===">"?(a=i??qe,p=-1):u[1]===void 0?p=-2:(p=a.lastIndex-u[2].length,h=u[1],a=u[3]===void 0?ke:u[3]==='"'?Tn:An):a===Tn||a===An?a=ke:a===Cn||a===_n?a=qe:(a=ke,i=void 0);let y=a===ke&&s[o+1].startsWith("/>")?" ":"";r+=a===qe?l+Es:p>=0?(t.push(h),l.slice(0,p)+zt+l.slice(p)+ce+y):l+ce+(p===-2?o:y)}return[Sn(s,r+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},Ve=class s{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let r=0,a=0,o=n.length-1,l=this.parts,[h,u]=Dn(n,e);if(this.el=s.createElement(h,t),Ce.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=Ce.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(zt)){let g=u[a++],y=i.getAttribute(p).split(ce),v=/([.?@])?(.*)/.exec(g);l.push({type:1,index:r,name:v[2],strings:y,ctor:v[1]==="."?at:v[1]==="?"?lt:v[1]==="@"?dt:Te}),i.removeAttribute(p)}else p.startsWith(ce)&&(l.push({type:6,index:r}),i.removeAttribute(p));if(En.test(i.tagName)){let p=i.textContent.split(ce),g=p.length-1;if(g>0){i.textContent=rt?rt.emptyScript:"";for(let y=0;y<g;y++)i.append(p[y],Fe()),Ce.nextNode(),l.push({type:2,index:++r});i.append(p[g],Fe())}}}else if(i.nodeType===8)if(i.data===Rt)l.push({type:2,index:r});else{let p=-1;for(;(p=i.data.indexOf(ce,p+1))!==-1;)l.push({type:7,index:r}),p+=ce.length-1}r++}}static createElement(n,e){let t=_e.createElement("template");return t.innerHTML=n,t}};function Ae(s,n,e=s,t){if(n===pe)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,r=Ke(n)?void 0:n._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=Ae(s,i._$AS(s,n.values),i,t)),n}var ot=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??_e).importNode(e,!0);Ce.currentNode=i;let r=Ce.nextNode(),a=0,o=0,l=t[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new Re(r,r.nextSibling,this,n):l.type===1?h=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(h=new ct(r,this,n)),this._$AV.push(h),l=t[++o]}a!==l?.index&&(r=Ce.nextNode(),a++)}return Ce.currentNode=_e,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},Re=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Ae(this,n,e),Ke(n)?n===m||n==null||n===""?(this._$AH!==m&&this._$AR(),this._$AH=m):n!==this._$AH&&n!==pe&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Mn(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==m&&Ke(this._$AH)?this._$AA.nextSibling.data=n:this.T(_e.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=Ve.createElement(Sn(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new ot(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(n){let e=Pn.get(n.strings);return e===void 0&&Pn.set(n.strings,e=new Ve(n)),e}k(n){Nt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let r of n)i===e.length?e.push(t=new s(this.O(Fe()),this.O(Fe()),this,this.options)):t=e[i],t._$AI(r),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=wn(n).nextSibling;wn(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Te=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=m}_$AI(n,e=this,t,i){let r=this.strings,a=!1;if(r===void 0)n=Ae(this,n,e,0),a=!Ke(n)||n!==this._$AH&&n!==pe,a&&(this._$AH=n);else{let o=n,l,h;for(n=r[0],l=0;l<r.length-1;l++)h=Ae(this,o[t+l],e,l),h===pe&&(h=this._$AH[l]),a||=!Ke(h)||h!==this._$AH[l],h===m?n=m:n!==m&&(n+=(h??"")+r[l+1]),this._$AH[l]=h}a&&!i&&this.j(n)}j(n){n===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},at=class extends Te{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===m?void 0:n}},lt=class extends Te{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==m)}},dt=class extends Te{constructor(n,e,t,i,r){super(n,e,t,i,r),this.type=5}_$AI(n,e=this){if((n=Ae(this,n,e,0)??m)===pe)return;let t=this._$AH,i=n===m&&t!==m||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,r=n!==m&&(t===m||i);i&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},ct=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){Ae(this,n)}},Ln={M:zt,P:ce,A:Rt,C:1,L:Dn,R:ot,D:Mn,V:Ae,I:Re,H:Te,N:lt,U:dt,B:at,F:ct},Ss=Lt.litHtmlPolyfillSupport;Ss?.(Ve,Re),(Lt.litHtmlVersions??=[]).push("3.3.3");var zn=(s,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let r=e?.renderBefore??null;t._$litPart$=i=new Re(n.insertBefore(Fe(),r),r,void 0,e??{})}return i._$AI(s),i};var It=globalThis,Q=class extends de{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=zn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return pe}};Q._$litElement$=!0,Q.finalized=!0,It.litElementHydrateSupport?.({LitElement:Q});var Ds=It.litElementPolyfillSupport;Ds?.({LitElement:Q});(It.litElementVersions??=[]).push("4.2.2");var Ne="mydashlight",Ni=`/api/${Ne}/pair`,Bi=`/api/${Ne}/pair/poll`,Ii=`/${Ne}`,Ge="pair";function Rn(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Ot(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function Nn(s){let n=new URLSearchParams(s);return n.has(Ge)?Ot(n.get(Ge)??""):null}function Ls(s){if(s<60)return"just now";let n=Math.round(s/60);return`${n} minute${n===1?"":"s"} ago`}var Ye=class extends Q{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let t=await this.connection.sendMessagePromise({type:`${Ne}/pair/check`,code:e});t.found?(this.waiting=t,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(t){this.error=this.message(t),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${Ne}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let t=e?.code;return t==="unauthorized"?"Only a Home Assistant admin can pair a screen.":t==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":t==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return d`<form @submit=${i=>{i.preventDefault();let r=Ot(this.typed);r&&this.check(r)}}>
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
      <p class="code">${Rn(e.code??"")}</p>
      ${i?d`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:m}
      <p>
        A screen at ${e.address} asked ${Ls(e.age??0)}. Check the code matches the one on the screen. It will be
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
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,d`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};Ye.styles=we`
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
  `,Ye.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Ye);function C(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function Ze(s){let n=Math.floor(Math.round(s)/60)%24;return`${C(s)} ${n<12?"AM":"PM"}`}function Bn(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function Je(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function In(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var zs=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Rs=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Ns=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function pt(s){return new Date(`${s}T12:00:00Z`)}function fe(s){let n=pt(s);return`${zs.format(n)}, ${Ns.format(n)}`}function Y(s){return Rs.format(pt(s))}function te(s,n){return Math.round((pt(n).getTime()-pt(s).getTime())/864e5)}function Xe(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return Xe("UTC",n)}let t=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function ht(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let i=Xe(e,s),r=Xe(e,n).date;return i.date===r?`at ${Ze(i.minutes)}`:`on ${Y(i.date)} at ${Ze(i.minutes)}`}var R=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}},Pe="mydashlight",Bs=7,On=3e4;function Ht(s){if(s instanceof R)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new R(String(n.code??"error"),n.message)}return typeof s=="number"?new R("connection_lost","Lost the connection to Home Assistant."):new R("error",String(s))}var ut=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new R("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.pushing}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},On),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,n&&n().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(n=>{this.pushing=!0,n.plan?this.emit(n.plan):this.fail(new R("not_running","MyDashLight isn’t running right now."))},{type:`${Pe}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:"get_plan",service_data:{days:Bs},return_response:!0});this.emit(n.response)}catch(n){this.fail(Ht(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:n,service_data:e})}catch(t){throw Ht(t)}this.pushing||await this.refresh()}setRide(n,e,t,i){return this.call("set_ride",{event:n,side:e,driver:t,scope:i})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:In(e),scope:t})}setTakeAlong(n,e,t){return this.call("set_take_along",{event:n,kids:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}watchChores(n){let e=!1,t=null,i=null,r=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:"get_chores",service_data:{},return_response:!0});e||n(a.response??null)}catch{e||n(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(o=>{e||n(o.chores)},{type:`${Pe}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):t=a}catch{if(e)return;r(),i=setInterval(()=>void r(),On)}})(),()=>{e=!0,i&&clearInterval(i),t&&t().catch(()=>{})}}watchLunch(n){let e=!1,t=null;return(async()=>{try{let i=await this.conn.subscribeMessage(r=>{e||n(r.lunch)},{type:`${Pe}/lunch/subscribe`},{resubscribe:!0});e?i().catch(()=>{}):t=i}catch{e||n(null)}})(),()=>{e=!0,t&&t().catch(()=>{})}}async setLunch(n,e,t){await this.choreCall("set_lunch",{kid:n,dates:e,lunch:t??"default"})}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:n,service_data:e})}catch(t){throw Ht(t)}}};var Hn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Un=s=>(...n)=>({_$litDirective$:s,values:n}),gt=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:Is}=Ln,jn=s=>s;var Wn=()=>document.createComment(""),Be=(s,n,e)=>{let t=s._$AA.parentNode,i=n===void 0?s._$AB:n._$AA;if(e===void 0){let r=t.insertBefore(Wn(),i),a=t.insertBefore(Wn(),i);e=new Is(r,a,s,s.options)}else{let r=e._$AB.nextSibling,a=e._$AM,o=a!==s;if(o){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(r!==i||o){let l=e._$AA;for(;l!==r;){let h=jn(l).nextSibling;jn(t).insertBefore(l,i),l=h}}}return e},me=(s,n,e=s)=>(s._$AI(n,e),s),Os={},qn=(s,n=Os)=>s._$AH=n,Fn=s=>s._$AH,ft=s=>{s._$AR(),s._$AA.remove()};var Kn=(s,n,e)=>{let t=new Map;for(let i=n;i<=e;i++)t.set(s[i],i);return t},ne=Un(class extends gt{constructor(s){if(super(s),s.type!==Hn.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let i=[],r=[],a=0;for(let o of s)i[a]=t?t(o,a):a,r[a]=e(o,a),a++;return{values:r,keys:i}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let i=Fn(s),{values:r,keys:a}=this.dt(n,e,t);if(!Array.isArray(i))return this.ut=a,r;let o=this.ut??=[],l=[],h,u,p=0,g=i.length-1,y=0,v=r.length-1;for(;p<=g&&y<=v;)if(i[p]===null)p++;else if(i[g]===null)g--;else if(o[p]===a[y])l[y]=me(i[p],r[y]),p++,y++;else if(o[g]===a[v])l[v]=me(i[g],r[v]),g--,v--;else if(o[p]===a[v])l[v]=me(i[p],r[v]),Be(s,l[v+1],i[p]),p++,v--;else if(o[g]===a[y])l[y]=me(i[g],r[y]),Be(s,i[p],i[g]),g--,y++;else if(h===void 0&&(h=Kn(a,y,v),u=Kn(o,p,g)),h.has(o[p]))if(h.has(o[g])){let c=u.get(a[y]),b=c!==void 0?i[c]:null;if(b===null){let $=Be(s,i[p]);me($,r[y]),l[y]=$}else l[y]=me(b,r[y]),Be(s,i[p],b),i[c]=null;y++}else ft(i[g]),g--;else ft(i[p]),p++;for(;y<=v;){let c=Be(s,l[v+1]);me(c,r[y]),l[y++]=c}for(;p<=g;){let c=i[p++];c!==null&&ft(c)}return this.ut=a,qn(s,l),pe}});var mt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function N(s){return mt[(s%mt.length+mt.length)%mt.length]}var Vn="#23272E",Gn="35,39,46";var Hs=3,$t=36,Ut=12,Us=8,jt=60,Wt=10,vt=30,qt=10,js=150,Ws=200,yt=1.4;function Kt(s,n){let e=Math.max(js,Ws/yt);return Math.ceil(jt+Math.max(0,s-1)*Wt+vt+Math.max(0,n-1)*qt+e*(s+yt*n))}function Ee(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function be(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function J(s){return new Map(Ee(s).map((n,e)=>[n,N(e)]))}function X(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function ve(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function Vt(s,n){return n==="none"?"Not needed":be(s).includes(n)?ve(s,n):n}function qs(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function xt(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function bt(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(xt(n,t.from)),e.push(xt(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(xt(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Fs(s){let n=s.map(a=>({...a,col:0,cols:1})).sort((a,o)=>a.s-o.s||o.en-a.en),e=[],t=[],i=-1/0,r=()=>{for(let a of e)a.cols=t.length;e=[],t=[]};for(let a of n){a.s>=i&&(r(),i=-1/0);let o=t.findIndex(l=>l<=a.s);o<0?(o=t.length,t.push(a.en)):t[o]=a.en,a.col=o,e.push(a),i=Math.max(i,a.en)}return r(),n}function Ks(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.t)return i.t===t.t?t.y:Math.round(t.y+(n-t.t)/(i.t-t.t)*(i.y-t.y))}return s[s.length-1].y}function Vs(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.y)return i.y===t.y?t.t:t.t+(n-t.y)/(i.y-t.y)*(i.t-t.t)}return s[s.length-1].t}function Xn(s,n){return Ks(s.anchors,n)}function Jn(s,n){return Vs(s.anchors,n)}function Gs(s,n){let e=Ee(s),t=be(s),i=Math.max(n,Kt(e.length,t.length)),a=(i-jt-Math.max(0,e.length-1)*Wt-vt-Math.max(0,t.length-1)*qt)/(e.length+yt*t.length||1),o=Math.floor(a),l=Math.floor(a*yt),h=new Map;for(let v of s.days)for(let c of v.events){let b=h.get(c.kid)??[];b.some($=>$.event_id===c.event_id&&$.calendar_id===c.calendar_id)||b.push(c),h.set(c.kid,b)}let u=J(s),p=[],g=jt;e.forEach((v,c)=>{let b=h.get(v)??[],$=s.days.some(x=>x.events.some(E=>E.kid===v&&(E.sides.includes("drop")&&E.drop===""||E.sides.includes("pick")&&E.pick==="")));p.push({id:v,kind:"kid",x:g,w:o,name:X(s,v),dot:u.get(v).color,rgb:u.get(v).rgb,sub:`${$?"Needs a ride · ":""}${b.length} this week`,subWarn:$}),g+=o+(c<e.length-1?Wt:0)});let y=g+vt/2;return g+=vt,t.forEach((v,c)=>{let b=0,$=0;for(let x of s.days){let E=x.drivers[v];E&&(b+=E.outings.length,$+=E.drive??0)}p.push({id:v,kind:"driver",x:g,w:l,name:ve(s,v),dot:Vn,rgb:Gn,sub:`${b} ${b===1?"trip":"trips"} this week · ${Je($)} driving`,subWarn:!1}),g+=l+(c<t.length-1?qt:0)}),{columns:p,sepX:y,width:i}}function Ys(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(n.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let a=i.slice(r[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Yn(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${C(s.start)}`:e||!n?`${s.title} until ${C(s.end)}`:`${s.title} ${C(s.start)}–${C(s.end)}`}function Gt(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length}function Yt(s,n){let e=te(n,s);return e===0?"Today":e===1?"Tomorrow":""}function V(s,n=0){return s==null||!Number.isFinite(s)?n:s}function Ft(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),i=1,r=0;for(let a of s.split(/\s+/).filter(Boolean)){let o=a.length;for(r===0?r=o:r+1+o<=t?r+=1+o:(i++,r=o);r>t;)i++,r-=t}return i}var Qn=25,es=15,Zt=3;function Zn(s){return Math.max(0,Math.min(Zt,Math.floor((s-Qn)/es)))}function Zs(s,n){let e=Math.min(Zt,Ft(s,n-19,6.6));return Qn+e*es+2}function Xs(s,n){let e=n-23,t=`${C(s.start)}–${C(s.end)}`+(s.arrive_by!=null?` · arrive ${C(s.arrive_by)}`:""),i=33+Ft(t,e,6.6)*16;for(let r of[s.lines.drop,s.lines.pick])r&&(i+=2+Ft(r.text,e,7)*16);return i+4}function ts(s,n,e,t){let i=n==="compact",{columns:r,sepX:a,width:o}=Gs(s,e),l=new Map(r.map(x=>[x.id,x])),h=Ee(s),u=be(s),p=[...h,...u],g=J(s),y=qs(s),v=x=>X(s,x),c=x=>ve(s,x),b={mode:n,width:o,height:0,columns:r,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},$=0;return s.days.forEach((x,E)=>{let Z=E*1440,P=new Map(x.events.map(f=>[f.id,f])),U=f=>f&&P.has(f)?{day:x.date,event:f}:null,ie=Gt(x),xe=x.events.length,Le=Yt(x.date,t.date);b.dayHeads.push({date:x.date,y:$,label:fe(x.date),tag:Le,sub:(xe?`${xe} ${xe===1?"activity":"activities"}`:"Nothing scheduled")+(ie?` · ${ie} to sort out`:""),warn:ie>0}),b.anchors.push({t:Z,y:$});let ue=$+$t+Ut,He=u.flatMap(f=>x.drivers[f]?.outings??[]);if(!xe&&!He.length){b.empties.push({key:x.date,y:ue,text:"Nothing planned"}),$=ue+40,b.anchors.push({t:Z+1439,y:$});return}let S=(f,T,_,M,A,D,k)=>{let j=g.get(f.kid)??N(0),W=f.lines;return{key:`${x.date}|card|${f.id}`,x:T,y:_,w:M,h:A,target:{day:x.date,event:f.id},event:f,color:j,kidName:v(f.kid),clash:D,stayed:f.stay&&u.includes(f.drop),skipped:f.attending===!1,title:Ys(f.title,v(f.kid)),time:`${C(f.start)}–${C(f.end)}`+(f.arrive_by!=null?` · arrive ${C(f.arrive_by)}`:""),drop:W.drop,pick:W.pick,showDrop:!!W.drop&&(k||A>=56),showPick:!!W.pick&&(k||A>=74),wrap:k,aria:`${v(f.kid)}, ${f.title} ${C(f.start)} to ${C(f.end)}. `+(f.attending===!1&&!W.drop?"Not attending. ":"")+[W.drop,W.pick].filter(le=>!!le).map(le=>le.text).join(". ")}},re=f=>{let T=x.rides[f];return T?(x.drivers[T.driver]?.segments??[]).filter(M=>M.type!=="home"&&M.kids.includes(T.kid)&&V(M.start)>=V(T.start)&&V(M.end)<=V(T.end)):[]},B=f=>{let T=x.rides[f];if(!T)return null;let _=T.serves.find(M=>P.get(M)?.kid===T.kid);return U(_??T.serves[0])},ee=new Map;for(let f of x.issues)f.level!=="problem"||!f.event||(f.kind==="late"&&ee.set(f.event,`${Math.round(V(f.minutes))} min late`),f.kind==="waiting"&&ee.set(`${f.event}|pick`,`Waits ${Math.round(V(f.minutes))} min`));if(!i){let f=1/0,T=-1/0;for(let k of x.events)f=Math.min(f,k.start-20,k.arrive_by!=null?k.arrive_by-10:1/0),T=Math.max(T,k.end+20);for(let k of He)k.start!=null&&(f=Math.min(f,k.start)),k.end!=null&&(T=Math.max(T,k.end));x.date===t.date&&Number.isFinite(f)&&t.minutes>f-60&&t.minutes<T&&(f=Math.min(f,t.minutes-15));let _=Number.isFinite(f)?Math.floor((f-5)/30)*30:900,M=Number.isFinite(T)?Math.ceil((T+5)/30)*30:960,A=k=>Math.round(ue+(Math.max(_,Math.min(M,k))-_)*Hs);b.anchors.push({t:Z+_,y:A(_)},{t:Z+M,y:A(M)});for(let k of h){let j=l.get(k),W=g.get(k),le=(x.kids[k]?.items??[]).filter(L=>L.start!=null&&L.end!=null).map(L=>({item:L,s:V(L.start),en:V(L.end)}));for(let L of Fs(le)){let w=j.w/L.cols,O=Math.round(j.x+L.col*w),I=Math.round(w-(L.cols>1?4:0)),q=A(L.s),ge=L.item;if(ge.type==="act"){let G=P.get(ge.event??"");if(!G)continue;let hn=Math.max(30,A(L.en)-q);if(b.cards.push(S(G,O,q,I,hn,ge.clash,!1)),G.arrive_by!=null&&G.start-G.arrive_by>=5){let fn=A(G.arrive_by);b.preps.push({key:`${x.date}|prep|${G.id}`,x:O,y:fn,w:I,h:q-fn+6,color:W,label:`Arrive by ${C(G.arrive_by)}`})}let un=ee.get(G.id);un&&b.marks.push({key:`${x.date}|late|${G.id}`,x:O+I-4,y:q+4,text:un,right:!0});let gn=ee.get(`${G.id}|pick`);gn&&b.marks.push({key:`${x.date}|wait|${G.id}`,x:O+4,y:q+hn+2,text:gn,right:!1});continue}let F=x.rides[ge.ride??-1];if(!F)continue;let ye=Math.max(22,A(L.en)-q),Ue=bt(re(F.index),y),H=c(F.driver);b.rides.push({key:`${x.date}|ride|${F.index}`,x:O,y:q,w:I,h:ye,target:B(F.index),l1:`${F.own?"In":"Along in"} ${H}’s car`,l2:Ue.join(" → "),show2:Zn(ye)>0,lines2:Zn(ye),dashed:!F.own,clash:ge.clash,aria:`${v(k)} ${F.own?"in":"riding along in"} ${H}’s car, ${C(V(F.start))} to ${C(V(F.end))}: ${Ue.join(" to ")}`});let $e=l.get(F.driver);$e&&b.bands.push({key:`${x.date}|band|${F.index}`,x:O+I,y:q,w:Math.max(0,$e.x+8-(O+I)),h:ye,color:W})}}for(let k of u){let j=l.get(k),W=x.drivers[k];if(!W)continue;let le=[],L=null;for(let w of W.segments)if(!(w.start==null||w.end==null)){if(w.type==="home"){L=null;continue}if(w.type==="stay"){L=null,le.push({type:"stay",g:w,s:w.start,en:w.end});continue}L&&L.en===w.start?(L.en=w.end,L.legs.push(w)):(L={type:"trip",s:w.start,en:w.end,legs:[w]},le.push(L))}for(let w of le){let O=A(w.s),I=Math.max(24,A(w.en)-O);if(w.type==="stay"){let H=P.get(w.g.event??w.g.serves??""),$e=H?g.get(H.kid)??N(0):N(0),G=w.g.kids.map(v);b.stays.push({key:`${x.date}|stay|${k}|${w.s}`,x:j.x+8,y:O,w:j.w-16,h:I,target:U(H?.id),color:$e,l1:H?`At ${H.title} with ${v(H.kid)}`:"Staying",l2:`until ${C(w.en)}`+(G.length?` · ${G.join(" and ")} too`:"")});continue}let q=w.legs[0],ge=w.legs[w.legs.length-1],F=[];for(let H of w.legs)for(let $e of H.kids)F.includes($e)||F.push($e);let ye=ge.type==="drive"&&ge.to==="home",Ue=bt(w.legs,y);b.trips.push({key:`${x.date}|trip|${k}|${w.s}`,x:j.x+8,y:O,w:j.w-16,h:I,target:U(w.legs.find(H=>H.serves)?.serves),l1:q.type==="drive"&&q.from==="home"?`Leave ${C(w.s)}`:`From ${xt(y,q.from??q.place)} ${C(w.s)}`,l2:Ue.join(" → "),show2:I>=36,l3:ye?`Home ${C(w.en)}`:"",show3:ye&&I>=62,stops:null,kids:F.map(H=>(g.get(H)??N(0)).color),bad:w.legs.some(H=>H.overlaps_busy),aria:`${c(k)} drives ${Ue.join(" to ")}, ${C(w.s)} to ${C(w.en)}`})}for(let w of W.segments)if(!(!w.overlaps_busy||w.start==null||w.end==null))for(let O of W.busy){let I=Math.max(w.start,O.start),q=Math.min(w.end,O.end);q<=I||b.overlaps.push({key:`${x.date}|overlap|${k}|${I}`,x:j.x+6,y:A(I)-2,w:j.w-12,h:Math.max(8,A(q)-A(I)+4)})}for(let w of W.busy){if(w.end<=_||w.start>=M)continue;let O=A(w.start),I=A(w.end);b.busy.push({key:`${x.date}|busy|${k}|${w.start}`,x:j.x+1,y:O,w:j.w-2,h:I-O,labelY:8,label:Yn(w,!1)})}}let D=-1/0;for(let k=_;k<=M;k+=30)b.grid.push({key:`${x.date}|grid|${k}`,y:A(k),strong:k%60===0}),k%60===0&&A(k)-D>=22&&(b.hours.push({key:`${x.date}|hour|${k}`,y:A(k)-8,label:Bn(k)}),D=A(k));x.date===t.date&&t.minutes>_&&t.minutes<M&&(b.now={y:A(t.minutes),label:`Now ${C(t.minutes)}`}),$=A(M)+Ut;return}let oe=[];for(let f of h){let T=l.get(f);for(let _ of x.kids[f]?.items??[])if(_.start!=null){if(_.type==="act"){let M=P.get(_.event??"");if(!M)continue;oe.push({col:f,s:_.start,h:Xs(M,T.w),kind:"act",item:_})}else if(!x.rides[_.ride??-1]?.own){let M=x.rides[_.ride??-1],A=M?bt(re(M.index),y).join(" → "):"";oe.push({col:f,s:_.start,h:Zs(A,T.w),kind:"along",item:_})}}}for(let f of u){let T=x.drivers[f];if(T){for(let _ of T.busy)oe.push({col:f,s:_.start,h:32,kind:"busy",busy:_});for(let _ of T.outings)_.start!=null&&oe.push({col:f,s:_.start,h:30+_.lines.length*16+(_.warn?16:0),kind:"out",out:_})}}oe.sort((f,T)=>f.s-T.s||p.indexOf(f.col)-p.indexOf(T.col));let ze=new Map,z=ue;oe.forEach((f,T)=>{let _=ze.get(f.col),M=Math.max(_!=null?_+Us:ue,z);ze.set(f.col,M+f.h),z=M,b.anchors.push({t:Z+f.s,y:M});let A=l.get(f.col);if(f.kind==="busy")b.busy.push({key:`${x.date}|busy|${f.col}|${T}`,x:A.x+1,y:M,w:A.w-2,h:f.h,labelY:8,label:Yn(f.busy,!0)});else if(f.kind==="out"){let D=f.out;b.trips.push({key:`${x.date}|trip|${f.col}|${T}`,x:A.x+8,y:M,w:A.w-16,h:f.h,target:U(D.target),l1:D.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...D.lines.map(k=>({text:k,warn:!1})),...D.warn?[{text:D.warn,warn:!0}]:[]],kids:D.kids.map(k=>(g.get(k)??N(0)).color),bad:!!D.warn,aria:`${c(f.col)}: ${D.lead}. ${D.lines.join(". ")}${D.warn?`. ${D.warn}`:""}`})}else if(f.kind==="act"){let D=P.get(f.item.event??"");b.cards.push(S(D,A.x,M,A.w,f.h,f.item.clash,!0))}else{let D=x.rides[f.item.ride??-1],k=bt(re(D.index),y),j=c(D.driver);b.rides.push({key:`${x.date}|ride|${D.index}`,x:A.x,y:M,w:A.w,h:f.h,target:B(D.index),l1:`Along with ${j} ${C(V(D.start))}`,l2:k.join(" → "),show2:!0,lines2:Zt,dashed:!0,clash:f.item.clash,aria:`${v(f.col)} riding along with ${j}, ${C(V(D.start))} to ${C(V(D.end))}: ${k.join(" to ")}`})}});let ae=ue;for(let f of ze.values())ae=Math.max(ae,f);$=ae+Ut+6,b.anchors.push({t:Z+1439,y:$})}),b.height=$,b}var Js=["","¼","½","¾"];function Me(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return Je(t);let i=Math.round(t*4),r=Math.floor(i/4),a=Js[i%4];return`${r||!a?r:""}${a} min`})}function ns(s){let n=e=>e?{...e,text:Me(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,i])=>[t,{...i,outings:i.outings.map(r=>({...r,lines:r.lines.map(Me),warn:r.warn==null?r.warn:Me(r.warn)}))}])),issues:e.issues.map(t=>({...t,title:Me(t.title),body:Me(t.body),note:t.note==null?t.note:Me(t.note),...t.suggestions?{suggestions:t.suggestions.map(i=>({...i,note:Me(i.note)}))}:{}}))}))}}var Qs=2,ei=48;function ss(s,n,e=ei){let t=[],i=0,r=0,a=0,o=0,l=n.minutes+e*60;for(let h of s.days){let u=te(n.date,h.date),p=u===0?"":`${Y(h.date)} · `,g=new Map(h.events.map(c=>[c.id,c])),y=c=>c&&g.has(c)?{day:h.date,event:c}:null,v=(c,b)=>u*1440+(c??g.get(b??"")?.start??0)<l;for(let c of h.issues)if(c.level==="problem"){if(!v(c.at,c.event)){a++,c.kind==="unassigned"&&o++;continue}i++,c.kind==="unassigned"&&r++,t.push({key:`${h.date}|${c.key}`,tone:c.kind==="unassigned"?"unassigned":"problem",title:p+c.title,body:c.body,target:y(c.event),suggestions:(c.suggestions??[]).map(b=>({id:b.id,label:b.label,note:b.note}))})}if(h.clashes.forEach((c,b)=>{if(!v(c.a.start,c.a.event)){a++;return}i++;let $=g.get(c.a.event??""),x=X(s,c.kid),E=(P,U)=>{let ie=y(U);return ie?{text:P,target:ie}:P},Z=[];if(c.b.type==="act"){let P=g.get(c.b.event??"");$&&P&&(Z=[E($.title,$.id),` ${C($.start)}–${C($.end)} and `,E(P.title,P.id),` ${C(P.start)}–${C(P.end)} overlap.`])}else{let P=h.rides[c.b.ride??-1];$&&P&&(Z=[`${x} is in `,E(`${ve(s,P.driver)}’s car`,P.serves[0]),` ${C(V(c.b.start))}–${C(V(c.b.end))}, during `,E($.title,$.id),"."])}t.push({key:`${h.date}|clash|${b}`,tone:"problem",title:`${p}${x} is double-booked`,body:Z.map(P=>typeof P=="string"?P:P.text).join(""),parts:Z,target:null,suggestions:[]})}),u>=0&&u<Qs)for(let c of h.issues)c.level!=="heads_up"||!v(c.at,c.event)||t.push({key:`${h.date}|${c.key}`,tone:"heads_up",title:p+c.title,body:c.body,target:y(c.event),suggestions:[]});for(let c of h.events)!c.problems.length||!v(c.start)||t.push({key:`${h.date}|notes|${c.id}`,tone:"heads_up",title:`${p}Check the notes on ${X(s,c.kid)}’s ${c.title}`,body:`These lines couldn’t be read: ${c.problems.join("; ")}`,target:y(c.id),suggestions:[]})}return{items:t,problems:i,unassigned:r,later:a,laterUnassigned:o}}function is(s,n){let e=J(s),t=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of s.days){let a=te(n.date,r.date);if(!(a<0))for(let o of be(s))for(let l of r.drivers[o]?.outings??[]){if(l.start==null)continue;let h=a*1440+l.start;if(a*1440+V(l.end,l.start)<=n.minutes)continue;let p=h-n.minutes,g={driver:o,name:ve(s,o),date:r.date,ahead:a,start:l.start,inMinutes:p,ongoing:p<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(y=>e.get(y)??N(0)),warn:l.warn,target:l.target&&r.events.some(y=>y.id===l.target)?{day:r.date,event:l.target}:null};(!t||i(g)<i(t)||i(g)===i(t)&&g.inMinutes<t.inMinutes)&&(t=g)}}return t}function Ie(s){return s.state==="done"||s.state==="late"}var ti=780;function ni(s,n,e){return s.state==="open"&&!!s.for_day&&s.due===n&&e<ti}function rs(s,n){return s.chores.map(e=>ni(e,s.today,n)?{...e,state:"upcoming",shows_from:s.today}:e)}function os(s){return s.state==="open"||s.state==="overdue"}function Qt(s,n,e){if(Ie(s)){let t=s.done_at?si(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Xt(s.due,n)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Xt(s.for_day,n)}`;let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let i=te(n,s.due);return`By ${i===1?"tomorrow":i<7?Y(s.due):Jt(s.due)}`}if(s.for_day&&s.due===n)return`Tonight · for ${Xt(s.for_day,n)}`;if(s.due&&s.due>n){let t=te(n,s.due);return t===1?"By tomorrow":`By ${t<7?Y(s.due):Jt(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Xt(s,n){let e=te(n,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?Y(s):Jt(s)}function Jt(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function si(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let r=t.toLocaleDateString("en-CA",{timeZone:i}),a=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return r===n?a:`${Y(r)} ${a}`}function as(s,n,e=1440){let t=rs(s,e).sort((i,r)=>i.order-r.order);return s.kids.map((i,r)=>{let a=t.filter(u=>u.kid===i.id),o=new Map;for(let u of a){if(u.state!=="upcoming")continue;let p=u.shows_from??u.due??s.today;o.set(p,[...o.get(p)??[],u])}let l=a.filter(u=>u.state==="overdue"),h=a.filter(u=>u.state==="open");return{kid:i.id,name:i.name,color:n?.get(i.id)??N(r),overdue:l,now:h,done:a.filter(Ie),later:[...o.entries()].sort(([u],[p])=>u.localeCompare(p)).map(([u,p])=>({date:u,chores:p})),left:l.length+h.length}})}function ls(s,n=1440){return rs(s,n).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,t)=>e.state===t.state?e.order-t.order:e.state==="overdue"?-1:1)}function en(s){return!s.chores.length&&!s.templates.length}var Se=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function tn(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[i,r]=t.split("-").map(a=>Se.indexOf(a.trim()));if(i===void 0||i<0||r!==void 0&&r<0)return null;if(r===void 0)e.add(i);else for(let a=0;a<=(r-i+7)%7;a++)e.add((i+a)%7)}return e}function wt(s){let n=[...new Set(s)].sort((t,i)=>t-i);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let i=e.at(-1);i&&i.at(-1)===t-1?i.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${Se[t[0]]}-${Se[t.at(-1)]}`]:t.map(i=>Se[i])).join(", ")}var De="none";function kt(s){return s==="daily"||s==="school"?"":"Any"}function ds(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function cs(s){return{template:s.id,repeats:s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:s.days??kt(s.repeats),every:s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function nn(s){return s.title.trim()?s.who.length?s.days===De?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function ps(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function sn(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function rn(s,n,e=1,t=!1,i=!1){if(s==="school"){let u=n.trim().replace(/-/g,"–"),p=i?u?`${u} Bring lunch days`:"Bring lunch days":u?`${u} school days`:"Every school day";return t?`${p}, the night before`:p}let r={daily:"day",weekly:"week",monthly:"month"}[s],a=e>1?`every ${e} ${r}s`:`each ${r}`,o=n.trim();if(s==="daily"){let u=o.replace(/-/g,"–");return e>1?u?`${u}, every ${e} days`:`Every ${e} days`:u||"Every day"}if(!o||o.toLowerCase()==="any")return`Sometime ${a}`;if(s==="weekly")return`${o.replace(/-/g,"–")} ${a}`;let h=`${o.split(",").map(u=>{let p=u.trim();return p.toLowerCase()==="last"?"the last day":/^\d+$/.test(p)?`the ${sn(Number(p))}`:`the ${p}`}).join(" and ")} ${a}`;return h[0].toUpperCase()+h.slice(1)}function on(s,n,e=!1){let t=s.map(r=>n.find(a=>a.id===r)?.name??r);if(!t.length)return"Nobody yet";let i=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${i} take turns`:i}function an(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}function Ct(s,n){return`${s}|${n}`}function Oe(s,n){let[e,t,i]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1,i+n)).toISOString().slice(0,10)}function _t(s){let[n,e,t]=s.split("-").map(Number);return(new Date(Date.UTC(n,e-1,t)).getUTCDay()+6)%7}function hs(s,n){return s.days_off.find(e=>e.first<=n&&n<=e.last)??null}function ii(s,n){return _t(n)<5&&!hs(s,n)}function At(s,n,e=new Map){if(!ii(s,n))return null;let t=Ct(s.id,n);if(e.has(t)){let r=e.get(t);return r?{lunch:r,picked:!0}:{lunch:s.default,picked:!1}}let i=s.picks[n];return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}function se(s){return s.slice(0,7)}function Tt(s){let[n,e]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function ln(s,n=1){let[e,t]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1+n,1)).toISOString().slice(0,7)}function us(s){let n=[];for(let e=se(s.first);e<=se(s.last);e=ln(e))n.push(e);return n}function gs(s,n,e,t=new Map){let i=`${e}-01`,r=Oe(i,-_t(i)),a=[];for(;se(r)<=e;){let o=[];for(let l=0;l<5;l++){let h=Oe(r,l),u=se(h)!==e,p=u?null:hs(n,h),g=u?null:At(n,h,t);o.push({date:h,day:Number(h.slice(8)),outside:u,off:p?p.title:null,lunch:g?.lunch??null,picked:g?.picked??!1,past:h<s.today,today:h===s.today})}o.some(l=>!l.outside)&&a.push(o),r=Oe(r,7)}return a}function fs(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function ms(s){let n=0,e=0;for(let t of s.flat())t.outside||t.past||!t.lunch||(t.lunch==="bring"?n++:e++);return{bring:n,buy:e}}function bs(s,n,e,t=new Map){let i=e<780?0:1;for(let r=i;r<8;r++){let a=Oe(n,r),o=At(s,a,t);if(!o)continue;let l=te(n,a);return{lunch:o.lunch,when:l===0?"today":l===1?"tomorrow":Y(a)}}return null}var ri={timeline:"timeline",full:"timeline",compact:"compact"};function dn(s){let n=new URLSearchParams(s),e={},t=ri[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(n.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores"||i==="lunch")&&(e.page=i),e}var vs=we`
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
    flex: none;
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
    height: 64px;
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
`;var $s="mydashlight.rides.mode",oi=1100,ai=440,li=700,di=3*6e4,ci=1200;function pi(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var cn=K`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,hi=K`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,ui=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],xs=K`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,ys=K`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Qe={bring:"Bring",buy:"Buy"};function gi(s,n){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return n<=1?`Every ${e}`:n===2?`Every other ${e}`:`Every ${n} ${e}s${s==="monthly"&&n===3?" (quarterly)":""}`}function he(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function pn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function fi(s,n){return Yt(s,n)||fe(s).split(",")[0]}function mi(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function bi(){try{return localStorage.getItem($s)==="compact"?"compact":"timeline"}catch{return"timeline"}}function vi(s){try{localStorage.setItem($s,s)}catch{}}function Pt(s){return s.days.every(n=>!n.events.length)}var et=class extends Q{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=dn(location.search).view;this.urlPage=dn(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let i=e.clientX-t.x,r=e.clientY-t.y;if(!t.moved){if(Math.abs(i)+Math.abs(r)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-r,t.el.scrollLeft=t.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},di))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??bi(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let t=new Map(this.lunchDraft);for(let[i,r]of this.lunchDraft){let[a,o]=i.split("|"),l=e.kids.find(h=>h.id===a);(!l||(l.picks[o]??null)===r||!At(l,o))&&t.delete(i)}this.lunchDraft=t}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let i of e.chores)t.has(i.id)&&Ie(i)===t.get(i.id)&&t.delete(i.id);for(let i of t.keys())e.chores.some(r=>r.id===i)||t.delete(i);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=ns(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<oi)return!1;let e=this.plan;return!e||this.width-ai>=Kt(Ee(e).length,be(e).length)}today(){return Xe(this.plan?.time_zone??pi())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),i=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=ts(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let i=this.scroller;if(!i||!this.board)return;let r=this.board.dayHeads.find(a=>a.date===t)?.y??0;i.scrollTop=Math.max(r,Xn(this.board,e)-$t-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),a=t.days[r];if(!a)return;let o=1/0;if(this.mode==="timeline"){for(let l of a.events)o=Math.min(o,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let h of l.outings)h.start!=null&&(o=Math.min(o,h.start))}this.scrollToTime(r*1440+(Number.isFinite(o)?Math.max(0,o-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,i=this.board.dayHeads[0];for(let h of this.board.dayHeads)h.y<=t+1&&(i=h);let r=this.renderRoot,a=r.querySelector(".pinned .label"),o=r.querySelector(".pinned .tag"),l=r.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),o&&(o.textContent!==i.tag&&(o.textContent=i.tag),o.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let h of r.querySelectorAll(".day-tile"))h.classList.toggle("in-view",h.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),r=new Map(this.choreDraft);r.set(e.id,i),this.choreDraft=r;try{await this.backend.setChoreDone(e.id,i,t&&t!==e.kid?t:void 0)}catch(a){let o=new Map(this.choreDraft);o.delete(e.id),this.choreDraft=o;let l=a instanceof R?a:new R("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??Ie(e)}async saveLunch(e,t,i){if(!this.backend||!t.length)return;let r=new Map(this.lunchDraft);for(let a of t)r.set(Ct(e,a),i);this.lunchDraft=r;try{await this.backend.setLunch(e,t,i)}catch(a){let o=new Map(this.lunchDraft);for(let h of t)o.delete(Ct(e,h));this.lunchDraft=o;let l=a instanceof R?a:new R("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?cs(e):ds(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||nn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(ps(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let i=t instanceof R?t:new R("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let i=t instanceof R?t:new R("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?Jn(this.board,t.scrollTop+$t+4):null,this.mode=e,this.urlView||vi(e)}findEvent(e){let t=this.plan?.days.find(r=>r.date===e.day),i=t?.events.find(r=>r.id===e.event);return t&&i?{day:t,event:i}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),i=this.dayIndexOf(e.day);!t||i<0||this.scrollToTime(i*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,i){if(!this.pending){this.pending={key:e,value:t};try{await i()}catch(r){let a=r instanceof R?r:new R("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,t,i){if(!this.backend)return;let r=this.backend;this.save(`${t}`,i,()=>r.setRide(e.id,t,i,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let i=this.backend;this.save("attending",t,()=>i.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t){if(!this.backend)return;let i=this.backend,r=e.along.includes(t)?e.along.filter(a=>a!==t):[...e.along,t];this.save("along",r,()=>i.setTakeAlong(e.id,r,this.scope))}nudgeArrive(e,t){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;t<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),ci)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let i=this.findEvent(t);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,a=i.event.id,o=this.scope;this.save("arrive",e,()=>r.setArriveBy(a,e,o)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),i=e?ss(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?ls(this.chores,this.today().minutes).filter(p=>!this.choreDone(p)):[],o=this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",h=d`<aside class="panel" aria-label=${l}>
      ${o??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,u=this.page==="rides";return d`
      <div class="app ${r?"wide":this.width<li?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${u&&e?this.renderWeek(e):m}
          ${u?this.renderBanner(e):m}
          <main>
            ${u?d`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?Pt(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:this.page==="lunch"?d`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:d`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor)?d`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${h}`:m}
          </main>
        </div>
        ${r?h:m}
        ${this.toast?d`<div class="toast" role="status">${this.toast}</div>`:m}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,i){let r=t.problems+i;this.tick;let a=this.today(),o="";if(e){let g=e.time_zone,y=new Date(e.updated);this.error?o=d`<span class="bad">Can’t reach Home Assistant · showing the plan from ${ht(y,new Date,g)}</span>`:e.status&&!e.status.ok?o=d`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${ht(y,new Date,g)}</span>`:this.backend?.live||(o=`Updated ${ht(y,new Date,g)}`)}let l=(g,y,v,c)=>d`
      <button type="button" class="seg-btn" title=${c} aria-pressed=${this.mode===g?"true":"false"} @click=${()=>this.setMode(g)}>
        ${v}<span class="seg-label">${y}</span>
      </button>
    `,h=(g,y,v)=>d`
      <button type="button" class="seg-btn" aria-pressed=${this.page===g?"true":"false"} @click=${()=>this.setPage(g)}>
        ${v}<span class="seg-label">${y}</span>
      </button>
    `,u=Ze(a.minutes),p=!!e&&Pt(e);return d`
      <header>
        ${this.showMenu?d`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${K`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:m}
        <div class="titles">
          <h1 class="clock" aria-label=${`${fe(a.date)}, ${u}`}>
            <span class="hm">${u.slice(0,-3)}</span><span class="ampm">${u.slice(-2)}</span>
          </h1>
          <p class="today-line">${fe(a.date)}</p>
          ${o?d`<p class="status">${o}</p>`:m}
        </div>
        ${e&&!p?this.renderNext(e,is(e,a),t):m}
        <div class="controls">
          ${this.wide||p&&!i?m:d`<button type="button" class="attn-btn ${r?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${r}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?m:d`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",K`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",K`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${h("rides","Rides",K`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${h("chores","Chores",K`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?m:h("lunch","Lunch",K`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,i){if(!t){let h=this.today().date,u=i.unassigned,p=i.laterUnassigned;if(u){let y=d`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${u} ${u===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?d`<div class="next idle needs">${y}</div>`:d`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${y}</button>`}if(p)return d`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${p} ${p===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let g=e.days.some(y=>y.date>=h&&y.events.length);return d`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${g?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${g?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let r;t.ongoing?r="On the road now":t.ahead===0?r=t.inMinutes<180?`Next trip · in ${Je(t.inMinutes)}`:"Next trip · later today":t.ahead===1?r="Next trip · tomorrow":r=`Next trip · ${Y(t.date)}`;let a=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,o=d`
      <span class="next-eyebrow">${r}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${he(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(h=>d`<span class="kid-dot" style="background:${h.color}"></span>`)}</span>
      </span>
      ${t.warn?d`<span class="next-stop warn">${t.warn}</span>`:t.stop?d`<span class="next-stop">${t.stop}</span>`:m}
    `,l=`next ${t.ongoing?"ongoing":a?"soon":""}`;return t.target?d`<button type="button" class=${l} @click=${()=>this.open(t.target)}>${o}</button>`:d`<div class=${l}>${o}</div>`}renderWeek(e){let t=this.today().date,i=J(e);return d`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let a=Gt(r),o=r.events.length,l=r.events.slice(0,6).map(u=>i.get(u.kid)?.color??N(0).color),h=`${fe(r.date)}: ${o?`${o} ${o===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return d`<button
          type="button"
          class="day-tile ${r.date===t?"today":""}"
          data-date=${r.date}
          aria-label=${h}
          @click=${()=>this.goToDay(r.date)}
        >
          <span class="dt-wd">${r.date===t?"Today":Y(r.date)}</span>
          <span class="dt-num">${Number(r.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(u=>d`<span class="dt-dot" style="background:${u}"></span>`):d`<span class="dt-free">free</span>`}
            ${o>6?d`<span class="dt-more">+${o-6}</span>`:m}
          </span>
          ${a?d`<span class="dt-badge" aria-hidden="true">${a}</span>`:m}
        </button>`})}
    </nav>`}renderQuiet(e){let t=Ee(e),i=be(e),r=J(e),a=t.map(o=>X(e,o));return d`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((o,l)=>K`<circle cx=${50+l*30} cy="80" r="11" fill=${r.get(o).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${mi(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(o=>{let l=r.get(o);return d`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${he(X(e,o))}</span>
            <span class="qw-name">${X(e,o)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(o=>d`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${he(ve(e,o))}</span>
            <span class="qw-name">${ve(e,o)}</span>
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
              <span class="avatar ${o.kind}" aria-hidden="true">${he(o.name)}</span>
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
          ${ne(e.bands,o=>o.key,o=>d`<div
                class="band"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:rgba(${o.color.rgb},0.10);border-color:rgba(${o.color.rgb},0.45)"
              ></div>`)}
          ${ne(e.busy,o=>o.key,o=>d`<div class="busy" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px">
                <span style="top:${o.labelY}px">${o.label}</span>
              </div>`)}
          ${ne(e.preps,o=>o.key,o=>d`<div
                class="prep"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:rgba(${o.color.rgb},0.07);color:${o.color.ink}"
              >
                ${o.label}
              </div>`)}
          ${ne(e.cards,o=>o.key,o=>{let l=o.color,h=o.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:o.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return d`<button
                type="button"
                class="card ${o.wrap?"wrap":""} ${i(o.target)?"sel":""} ${o.clash?"clash":""} ${o.skipped?"skipped":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:${h};border-color:${o.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(o.target)}
              >
                <span class="top">
                  <span class="title">${o.title}</span>
                  <span class="time">${o.time}</span>
                  ${o.showDrop&&o.drop?d`<span class="line tone-${o.drop.tone}">${o.drop.text}</span>`:m}
                </span>
                ${o.showPick&&o.pick?d`<span class="line tone-${o.pick.tone}">${o.pick.text}</span>`:m}
              </button>`})}
          ${ne(e.rides,o=>o.key,o=>d`<button
                type="button"
                class="ride ${o.dashed?"dashed":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}</span>${o.show2?d`<span class="l2" style="-webkit-line-clamp:${o.lines2}">${o.l2}</span>`:m}
              </button>`)}
          ${ne(e.stays,o=>o.key,o=>d`<button
                type="button"
                class="stay"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:repeating-linear-gradient(135deg, rgba(${o.color.rgb},0.28) 0px, rgba(${o.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1" style="color:${o.color.ink}">${o.l1}</span><span class="l2">${o.l2}</span>
              </button>`)}
          ${ne(e.trips,o=>o.key,o=>d`<button
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
          ${ne(e.overlaps,o=>o.key,o=>d`<div class="overlap" aria-hidden="true" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`)}
          ${ne(e.marks,o=>o.key,o=>d`<span class="mark" style="left:${o.x}px;top:${o.y}px;${o.right?"transform:translateX(-100%)":""}">${o.text}</span>`)}
          ${e.now?d`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:m}
        </div>
      </div>
    `}renderAttention(e,t){let{items:i,problems:r,later:a}=e,o=this.plan,l=r+t.length,h=this.chores,u=!!h&&!en(h);return d`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?m:d`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${u?d`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?d`<div class="attn-chores">${t.map(p=>this.renderChoreRow(p,!0))}</div>`:d`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:d`<p class="panel-sub">Rides in the next two days</p>`}
      ${o&&!r?d`<div class="all-clear">
            <span class="check" aria-hidden="true">${K`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Pt(o)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:m}
      ${i.map(p=>d`<div class="issue ${p.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${p.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${p.target?d`<button type="button" class="issue-title" @click=${()=>this.open(p.target,!0)}>${p.title}</button>`:d`<strong class="issue-title">${p.title}</strong>`}
              <span class="issue-body"
                >${p.parts?p.parts.map(g=>typeof g=="string"?g:d`<button type="button" class="issue-link" @click=${()=>this.open(g.target,!0)}>${g.text}</button>`):p.body}</span
              >
            </div>
          </div>
          ${p.suggestions.length?d`<div class="fixes">
                ${p.suggestions.map(g=>d`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(g.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${g.id}`?"Saving…":g.label}</span>
                    <span class="fix-note">${g.note}</span>
                  </button>`)}
              </div>`:m}
        </div>`)}
      ${this.wide&&o&&!Pt(o)&&this.page==="rides"?this.renderLegend():m}
    `}kidColorOf(e){let t=this.plan?J(this.plan).get(e):void 0;if(t)return t;let i=this.lunch?.kids.findIndex(r=>r.id===e)??-1;return N(Math.max(0,i))}renderLunchChip(e,t=!1){let i=this.lunch,r=i?.kids.find(h=>h.id===e);if(!i||!r)return m;this.tick;let a=this.today(),o=bs(r,a.date,a.minutes,this.lunchDraft);if(!o)return m;let l=Qe[o.lunch];return d`<span class="lunch-chip ${o.lunch} ${t?"small":""}" title=${`${l} lunch ${o.when}`}
      >${o.lunch==="bring"?xs:ys}<span class="lunch-chip-text">${l}${t?m:` ${o.when}`}</span></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return d`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let t=us(e),i=this.lunchMonth&&t.includes(this.lunchMonth)?this.lunchMonth:se(e.today),r=t.indexOf(i),a=l=>{let h=t[r+l];h&&(this.lunchMonth=h)},o=e.status&&!e.status.ok?d`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:m;return d`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${r<=0} @click=${()=>a(-1)}>
            ${K`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Tt(i)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${r<0||r>=t.length-1} @click=${()=>a(1)}>
            ${K`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
          </button>
        </div>
        <span class="chores-hint">Tap a day to switch between Buy and Bring. Tap a weekday to set the whole month.</span>
      </div>
      ${o}
      <div class="chore-cols lunch-cols" style="--n:${e.kids.length}">
        ${e.kids.map(l=>this.renderLunchCard(e,l,i))}
      </div>
      <p class="message-aside">
        Picks are saved as <strong>Bring Lunch</strong> and <strong>Buy Lunch</strong> all-day events on each kid’s calendar.
        Days off come from <strong>No School</strong> events there. A day nobody picked gets the kid’s default, set in
        Home Assistant under MyDashLight’s options. For a Pack lunch reminder, add a School days chore set to
        <strong>Only on Bring lunch days</strong>.
      </p>
    </div>`}renderLunchCard(e,t,i){let r=this.kidColorOf(t.id),a=gs(e,t,i,this.lunchDraft),o=ms(a),l=a.flat(),h=l.filter(v=>!v.outside&&!v.past&&v.lunch),u=t.days_off.filter(v=>se(v.first)<=i&&i<=se(v.last)),p=v=>h.filter(c=>_t(c.date)===v),g=v=>{let c=p(v);if(!c.length)return;let b=c.every($=>$.lunch==="bring")?"buy":"bring";this.saveLunch(t.id,c.map($=>$.date),b)},y=h.length?`${o.bring} Bring · ${o.buy} Buy${i===se(e.today)?" left this month":""}`:"No school days left this month";return d`<section class="chore-col lunch-card" style="--c:${r.color};--rgb:${r.rgb};--k:${r.ink}" aria-label=${`${t.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${he(t.name)}</span>
        <span class="ch-text">
          <span class="name">${t.name}</span>
          <span class="sub">${y}</span>
        </span>
        <span class="lunch-default">${Qe[t.default]} unless picked</span>
      </div>
      <div class="lunch-grid" role="grid" aria-label=${`${t.name}, ${Tt(i)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((v,c)=>d`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!p(c).length}
            aria-label=${`${p(c).every(b=>b.lunch==="bring")?"Buy":"Bring"} every ${v} left in ${Tt(i)} for ${t.name}`}
            @click=${()=>g(c)}
          >
            ${v}
          </button>`)}
        ${l.map(v=>this.renderLunchCell(t,v))}
      </div>
      ${u.length?d`<p class="lunch-offs">
            No school:
            ${u.map(v=>{let c=v.first<`${i}-01`?`${i}-01`:v.first,b=se(v.last)>i?Oe(`${ln(i)}-01`,-1):v.last;return`${c===b?pn(c):`${pn(c)}–${pn(b)}`} ${fs(v.title)}`}).join(" · ")}
          </p>`:m}
    </section>`}renderLunchCell(e,t){if(t.outside)return d`<span class="lunch-day outside" aria-hidden="true"></span>`;if(t.off!==null||!t.lunch)return d`<span class="lunch-day off ${t.today?"today":""}" title=${t.off??""}>
        <span class="lunch-num">${t.day}</span><span class="lunch-word">No school</span>
      </span>`;let i=t.lunch,r=i==="buy"?"bring":"buy",a=`${e.name}, ${fe(t.date)}: ${Qe[i]}${t.picked?"":" (not picked yet)"}. Tap to ${Qe[r]}.`;return d`<button
      type="button"
      class="lunch-day ${i} ${t.picked?"picked":"unpicked"} ${t.past?"past":""} ${t.today?"today":""}"
      ?disabled=${t.past}
      aria-label=${a}
      @click=${()=>void this.saveLunch(e.id,[t.date],r)}
    >
      <span class="lunch-num">${t.day}</span>
      <span class="lunch-word">${i==="bring"?xs:ys}${Qe[i]}</span>
    </button>`}renderChoreRow(e,t=!1){let i=this.chores,r=this.choreDone(e),a=i.kids.findIndex($=>$.id===e.kid),o=(this.plan?J(this.plan).get(e.kid):void 0)??N(Math.max(0,a)),l=i.kids[a]?.name??"",h=r===Ie(e)?e:{...e,state:r?"done":"open",done_at:r?new Date().toISOString():null},u=r&&h.done_by&&h.done_by!==e.kid?i.people?.find($=>$.id===h.done_by)?.name??h.done_by_name??null:null,p=`${Qt(h,i.today,i.time_zone)}${u?` · by ${u}`:""}`,g=r||os(e),y=`${t?`${l}: `:""}${e.title}. ${p?`${p}. `:""}${r?"Done. Tap to undo.":"Tap when it’s done."}`,v=d`<span class="box" aria-hidden="true"
        >${r?K`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:m}</span
      >
      ${e.icon?d`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:m}
      <span class="chore-text">
        <span class="chore-title">${t?d`<span class="chore-kid">${l}</span> · `:m}${e.title}</span>
        ${p?d`<span class="chore-note">${p}</span>`:m}
      </span>`,c=`chore ${r?"done":""} ${e.state==="overdue"&&!r?"overdue":""} ${g?"":"later"}`,b=`--c:${o.color};--rgb:${o.rgb};--k:${o.ink}`;return g?d`<button type="button" class=${c} style=${b} aria-pressed=${r?"true":"false"} aria-label=${y} @click=${()=>this.tapChore(e)}>
          ${v}
        </button>`:d`<div class=${c} style=${b}>${v}</div>`}renderChores(){let e=this.chores;if(e===void 0)return d`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return d`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return d`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(en(e))return d`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${cn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore templates: Daily</strong> (or Weekly or Monthly). It
          shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(a=>a.problems.length),i=t.length?d`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(a=>this.renderTemplateRow(a))}</div>
        </section>`:m;this.tick;let r=as(e,this.plan?J(this.plan):void 0,this.today().minutes);return d`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${cn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${hi} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${r.length}">
        ${r.map(a=>{let o=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return d`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${he(a.name)}</span>
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
            ${a.later.map(l=>d`<h3 class="chore-group">${l.date===e.today?"Later today":fi(l.date,e.today)}</h3>
                ${l.chores.map(h=>this.renderChoreRow(h))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?d`<p class="chore-none">No chores this week.</p>`:m}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,r=this.plan?J(this.plan):void 0,a=this.choreEdit?.template===e.id,o=e.problems.length?d`<span class="tmpl-note bad">${e.problems.map(an).join(" · ")} · tap to set up</span>`:d`<span class="tmpl-note">${on(e.who,i,e.take_turns)} · ${rn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return d`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${a?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?d` <span class="tag-paused">Paused</span>`:m}</span>
        ${o}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let h=i.findIndex(p=>p.id===l),u=r?.get(l)??N(Math.max(0,h));return d`<span class="kid-dot" style="background:${u.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day or some days"],["school","School days"],["weekly","Weekly"],["monthly","Monthly"]];return d`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${cn} Add a chore</button>
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
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return d``;let i=t.kids,r=this.plan?J(this.plan):void 0,a=this.choreBusy,o=e.template?t.templates.find(c=>c.id===e.template):void 0,l=nn(e),h=(o?.problems??[]).filter(c=>c!=="who:"),u=(c,b,$,x=!1)=>d`<button type="button" class="choice ${x?"wide":""}" aria-pressed=${c?"true":"false"} ?disabled=${a} @click=${$}>${b}</button>`,p=(c,b,$,x)=>d`<button type="button" class="chip" aria-pressed=${c?"true":"false"} aria-label=${x??m} ?disabled=${a} @click=${$}>${b}</button>`,g=c=>{c!==e.repeats&&this.changeDraft({repeats:c,days:o&&o.repeats===c?o.days??kt(c):kt(c)})},y=c=>{let b=e.who.includes(c)?e.who.filter($=>$!==c):i.filter($=>$.id===c||e.who.includes($.id)).map($=>$.id);this.changeDraft({who:b})},v;if(e.repeats==="school"){let c=e.days===De?new Set:e.days===""?new Set([0,1,2,3,4]):tn(e.days)??new Set,b=$=>{let x=new Set(c);x.has($)?x.delete($):x.add($),this.changeDraft({days:x.size===5?"":x.size?wt(x):De})};v=d`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Se.slice(0,5).map(($,x)=>p(c.has(x),$.slice(0,2),()=>b(x),$))}
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
        </div>`}else if(e.repeats==="monthly"){let c=e.days.trim(),b=/^\d+$/.test(c)?Number(c):null,$=c&&c.toLowerCase()!=="any"&&c.toLowerCase()!=="last"&&b===null;v=d`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${$?4:3}, minmax(0, 1fr))">
          ${u(c===""||c.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${u(b!==null,"On a date",()=>this.changeDraft({days:String(b??1)}))}
          ${u(c.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${$?u(!0,c,()=>{}):m}
        </div>
        ${b!==null?d`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${a||b<=1} @click=${()=>this.changeDraft({days:String(b-1)})}>−</button>
                <span class="arrive-value">${sn(b)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${a||b>=31} @click=${()=>this.changeDraft({days:String(b+1)})}>+</button>
              </span>
            </div>`:d`<p class="field-hint">${c.toLowerCase()==="last"?"Due on the month’s last day.":$?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else{let c=e.repeats==="weekly"&&(e.days===""||e.days.toLowerCase()==="any"),b=e.days===De?new Set:c?new Set:tn(e.days)??new Set,$=x=>{let E=new Set(b);E.has(x)?E.delete(x):E.add(x),e.repeats==="weekly"?this.changeDraft({days:E.size?wt(E)||"Mon-Sun":"Any"}):this.changeDraft({days:E.size?wt(E):De})};v=d`<div class="field">
        <span class="field-label">${e.repeats==="weekly"?"Which day":"Which days"}</span>
        ${e.repeats==="weekly"?d`<div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
              ${u(c,"Any day that week",()=>this.changeDraft({days:"Any"}))}
              ${u(!c,"On a set day",()=>this.changeDraft({days:c?"Sat":e.days}))}
            </div>`:m}
        ${e.repeats==="daily"||!c?d`<div role="group" aria-label="Days of the week" class="day-chips">
              ${Se.map((x,E)=>p(b.has(E),x.slice(0,2),()=>$(E),x))}
            </div>`:m}
        ${e.repeats==="daily"?d`<div class="chips">
              ${p(e.days==="","Every day",()=>this.changeDraft({days:""}))}
              ${p(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
              ${p(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
            </div>`:d`<p class="field-hint">${c?"Shows all week, due on Sunday.":"Due that day."}</p>`}
      </div>`}return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?d`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:m}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?on(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===De?"No days picked":rn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${a} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${h.length?d`<p class="field-hint bad">${h.map(an).join(". ")}. Saving fixes it.</p>`:m}
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
          ${ui.map(c=>p(e.icon===c,c,()=>this.changeDraft({icon:e.icon===c?null:c}),`Picture ${c}`))}
        </div>
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((c,b)=>{let $=r?.get(c.id)??N(b),x=e.who.includes(c.id);return d`<button type="button" class="who-chip" style="--c:${$.color};--rgb:${$.rgb}" aria-pressed=${x?"true":"false"} ?disabled=${a} @click=${()=>y(c.id)}>
              <span class="avatar" aria-hidden="true">${he(c.name)}</span>${c.name}
            </button>`})}
        </div>
        ${e.who.length>1?d`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${u(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${u(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:m}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${u(e.repeats==="daily","Days",()=>g("daily"))}
          ${u(e.repeats==="school","School days",()=>g("school"))}
          ${u(e.repeats==="weekly","Weekly",()=>g("weekly"))}
          ${u(e.repeats==="monthly","Monthly",()=>g("monthly"))}
        </div>
      </div>
      ${v}
      ${e.repeats==="school"?m:d`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Repeats</span>
          <span class="field-hint">${gi(e.repeats,e.every)}</span>
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
              ${u(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${a} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:m}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${a?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return d``;let i=t.people?.length?t.people:t.kids.map(p=>({...p,role:"kid"})),r=t.kids.findIndex(p=>p.id===e.kid),a=t.kids[r],o=this.plan?J(this.plan):void 0,l=o?.get(e.kid)??N(Math.max(0,r)),h=i.filter(p=>p.id!==e.kid),u=p=>{let g=t.kids.findIndex(y=>y.id===p.id);return g>=0?(o?.get(p.id)??N(g)).color:"var(--dark)"};return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?d`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:m}${e.title}</span>
          <span class="ed-meta">${a?.name??""} · ${Qt(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${he(a?.name??"?")}</span>
          <span>${a?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?d`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${h.map(p=>d`<button type="button" class="done-by" style="--c:${u(p)}" @click=${()=>void this.toggleChore(e,p.id)}>
                  <span class="avatar ${p.role==="parent"?"driver":""}" aria-hidden="true">${he(p.name)}</span>
                  <span>${p.name}</span>
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
    </div>`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return d``;let{day:i,event:r}=t,a=be(e),l=J(e).get(r.kid)??N(0),h=!!this.pending,u=S=>this.pending?.key===S?this.pending.value:void 0,p=[...e.people?.carpools??[]];for(let S of e.days)for(let re of S.events)for(let B of[re.drop,re.pick])B&&B!=="none"&&!a.includes(B)&&!p.some(ee=>ee.toLowerCase()===B.toLowerCase())&&p.push(B);let g=S=>{if(!r.sides.includes(S))return m;let re=u(S),B=re!==void 0?String(re):S==="drop"?r.drop:r.pick,ee=B&&B!=="none"&&!a.includes(B)?B:"",oe=z=>this.setRide(r,S,B===z?"":z),ze=[...a.map(z=>[z,Vt(e,z)]),["none","Not needed"]];return d`<div class="field">
        <span class="field-label">${S==="drop"?"Drop-off":"Pick-up"} ${B===""?d`<span class="nobody">· nobody yet</span>`:m}</span>
        <div role="group" aria-label=${S==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${ze.length}, minmax(0, 1fr))">
          ${ze.map(([z,ae])=>d`<button type="button" class="choice" aria-pressed=${B===z?"true":"false"} ?disabled=${h} @click=${()=>oe(z)}>
                ${ae}
              </button>`)}
        </div>
        ${p.length?d`<div role="group" aria-label=${S==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${p.map(z=>d`<button type="button" class="chip" aria-pressed=${B.toLowerCase()===z.toLowerCase()?"true":"false"} ?disabled=${h} @click=${()=>oe(z)}>
                    ${z}
                  </button>`)}
            </div>`:m}
        <input
          type="text"
          .value=${ee&&!p.some(z=>z.toLowerCase()===ee.toLowerCase())?ee:""}
          ?disabled=${h}
          aria-label=${S==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${z=>{let ae=z.target.value.trim();ae&&ae!==B&&this.setRide(r,S,ae)}}
          @keydown=${z=>{z.key==="Enter"&&z.target.blur()}}
        />
      </div>`},y=u("stay"),v=y!==void 0?!!y:r.stay,c=r.drop===r.pick&&a.includes(r.drop),b=u("along"),$=b!==void 0?b:r.along,x=Ee(e).filter(S=>S!==r.kid),E=a.includes(r.drop)&&r.sides.includes("drop"),Z=u("arrive"),P=this.arriveDraft!==void 0?this.arriveDraft:Z!==void 0?Z:r.arrive_by,U=[],ie=S=>S==="none"?"Not needed":Vt(e,S);r.drop!==""&&U.push(`Drop-off: ${ie(r.drop)}`),r.pick!==""&&U.push(`Pick-up: ${ie(r.pick)}`),r.stay&&U.push("Stay: yes"),r.along.length&&U.push(`Take along: ${r.along.map(S=>X(e,S)).join(", ")}`),r.arrive_by!=null&&U.push(`Arrive by: ${Ze(r.arrive_by)}`);let xe=u("attending"),Le=xe!==void 0?!!xe:r.attending!==!1;r.attending===!1&&U.splice(0,U.length,"Attending: no");let ue=i.date===this.today().date?"":`${Y(i.date)} · `,He=d`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${X(e,r.kid)} · ${r.title}</span>
          <span class="ed-meta">${ue}${C(r.start)}–${C(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return r.where==="home"?d`${He}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${X(e,r.kid)} can’t get home in time, the board shows it as a clash.</p>`:d`
      ${He}
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
        <span class="field-label">${X(e,r.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${Le?"true":"false"} ?disabled=${h} @click=${()=>this.setAttending(r,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${Le?"false":"true"} ?disabled=${h} @click=${()=>this.setAttending(r,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${Le?d`${r.where==="anywhere"?d`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:m}
            ${g("drop")} ${g("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${v?"true":"false"} ?disabled=${!c||h} @click=${()=>this.toggleStay(r)}>
          ${c?v?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${E&&x.length?d`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${x.map(S=>d`<button type="button" class="chip" aria-pressed=${$.includes(S)?"true":"false"} ?disabled=${h} @click=${()=>this.toggleAlong(r,S)}>
                  ${X(e,S)}
                </button>`)}
            </div>
          </div>`:m}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${P!=null?`${r.start-P} min before it starts`:`Aims for a few minutes before ${C(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${h} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${P!=null?C(P):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${h||P==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${P!=null?d`<button type="button" class="chip clear" ?disabled=${h} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:m}
`:d`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${U.length?U.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${r.problems.length?d`<p class="field-hint bad">These lines in the notes couldn’t be read: ${r.problems.join("; ")}</p>`:m}
      ${Le?d`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:m}
    `}};et.styles=vs,et.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",et);var tt=class extends Q{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=Nn(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(Ge);let t=e.toString();history.replaceState(history.state,"",`${location.pathname}${t?`?${t}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new ut(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return d`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?d`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:m}`}};tt.styles=we`
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
  `,tt.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",tt);
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
