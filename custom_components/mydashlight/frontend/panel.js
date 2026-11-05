var it=globalThis,rt=it.ShadowRoot&&(it.ShadyCSS===void 0||it.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,St=Symbol(),bn=new WeakMap,We=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==St)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(rt&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=bn.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&bn.set(e,n))}return n}toString(){return this.cssText}},vn=s=>new We(typeof s=="string"?s:s+"",void 0,St),we=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,i,r)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new We(e,s,St)},xn=(s,n)=>{if(rt)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=it.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,s.appendChild(t)}},Dt=rt?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return vn(e)})(s):s;var{is:_s,defineProperty:Ts,getOwnPropertyDescriptor:As,getOwnPropertyNames:Ps,getOwnPropertySymbols:Ms,getPrototypeOf:Es}=Object,ot=globalThis,yn=ot.trustedTypes,Ss=yn?yn.emptyScript:"",Ds=ot.reactiveElementPolyfillSupport,Ke=(s,n)=>s,Lt={toAttribute(s,n){switch(n){case Boolean:s=s?Ss:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},wn=(s,n)=>!_s(s,n),$n={attribute:!0,type:String,converter:Lt,reflect:!1,useDefault:!1,hasChanged:wn};Symbol.metadata??=Symbol("metadata"),ot.litPropertyMetadata??=new WeakMap;var he=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=$n){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&Ts(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:r}=As(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);r?.call(this,a),this.requestUpdate(n,o,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??$n}static _$Ei(){if(this.hasOwnProperty(Ke("elementProperties")))return;let n=Es(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Ke("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ke("properties"))){let e=this.properties,t=[...Ps(e),...Ms(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(Dt(i))}else n!==void 0&&e.push(Dt(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xn(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:Lt).toAttribute(e,t.type);this._$Em=n,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let r=t.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Lt;this._$Em=i;let o=a.fromAttribute(e,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(n,e,t,i=!1,r){if(n!==void 0){let a=this.constructor;if(i===!1&&(r=this[n]),t??=a.getPropertyOptions(n),!((t.hasChanged??wn)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:r},a){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),r!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,r]of t){let{wrapped:a}=r,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};he.elementStyles=[],he.shadowRootOptions={mode:"open"},he[Ke("elementProperties")]=new Map,he[Ke("finalized")]=new Map,Ds?.({ReactiveElement:he}),(ot.reactiveElementVersions??=[]).push("2.1.2");var Rt=globalThis,kn=s=>s,at=Rt.trustedTypes,Cn=at?at.createPolicy("lit-html",{createHTML:s=>s}):void 0,Nt="$lit$",pe=`lit$${Math.random().toFixed(9).slice(2)}$`,Bt="?"+pe,Ls=`<${Bt}>`,_e=document,Fe=()=>_e.createComment(""),Ve=s=>s===null||typeof s!="object"&&typeof s!="function",Ot=Array.isArray,En=s=>Ot(s)||typeof s?.[Symbol.iterator]=="function",zt=`[ 	
\f\r]`,qe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_n=/-->/g,Tn=/>/g,ke=RegExp(`>|${zt}(?:([^\\s"'>=/]+)(${zt}*=${zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),An=/'/g,Pn=/"/g,Sn=/^(?:script|style|textarea|title)$/i,It=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),d=It(1),I=It(2),Pi=It(3),ue=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),Mn=new WeakMap,Ce=_e.createTreeWalker(_e,129);function Dn(s,n){if(!Ot(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Cn!==void 0?Cn.createHTML(n):n}var Ln=(s,n)=>{let e=s.length-1,t=[],i,r=n===2?"<svg>":n===3?"<math>":"",a=qe;for(let o=0;o<e;o++){let l=s[o],u,p,h=-1,g=0;for(;g<l.length&&(a.lastIndex=g,p=a.exec(l),p!==null);)g=a.lastIndex,a===qe?p[1]==="!--"?a=_n:p[1]!==void 0?a=Tn:p[2]!==void 0?(Sn.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=ke):p[3]!==void 0&&(a=ke):a===ke?p[0]===">"?(a=i??qe,h=-1):p[1]===void 0?h=-2:(h=a.lastIndex-p[2].length,u=p[1],a=p[3]===void 0?ke:p[3]==='"'?Pn:An):a===Pn||a===An?a=ke:a===_n||a===Tn?a=qe:(a=ke,i=void 0);let x=a===ke&&s[o+1].startsWith("/>")?" ":"";r+=a===qe?l+Ls:h>=0?(t.push(u),l.slice(0,h)+Nt+l.slice(h)+pe+x):l+pe+(h===-2?o:x)}return[Dn(s,r+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},Ge=class s{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let r=0,a=0,o=n.length-1,l=this.parts,[u,p]=Ln(n,e);if(this.el=s.createElement(u,t),Ce.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=Ce.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(Nt)){let g=p[a++],x=i.getAttribute(h).split(pe),$=/([.?@])?(.*)/.exec(g);l.push({type:1,index:r,name:$[2],strings:x,ctor:$[1]==="."?dt:$[1]==="?"?ct:$[1]==="@"?ht:Ae}),i.removeAttribute(h)}else h.startsWith(pe)&&(l.push({type:6,index:r}),i.removeAttribute(h));if(Sn.test(i.tagName)){let h=i.textContent.split(pe),g=h.length-1;if(g>0){i.textContent=at?at.emptyScript:"";for(let x=0;x<g;x++)i.append(h[x],Fe()),Ce.nextNode(),l.push({type:2,index:++r});i.append(h[g],Fe())}}}else if(i.nodeType===8)if(i.data===Bt)l.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(pe,h+1))!==-1;)l.push({type:7,index:r}),h+=pe.length-1}r++}}static createElement(n,e){let t=_e.createElement("template");return t.innerHTML=n,t}};function Te(s,n,e=s,t){if(n===ue)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,r=Ve(n)?void 0:n._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=Te(s,i._$AS(s,n.values),i,t)),n}var lt=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??_e).importNode(e,!0);Ce.currentNode=i;let r=Ce.nextNode(),a=0,o=0,l=t[0];for(;l!==void 0;){if(a===l.index){let u;l.type===2?u=new Re(r,r.nextSibling,this,n):l.type===1?u=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(u=new pt(r,this,n)),this._$AV.push(u),l=t[++o]}a!==l?.index&&(r=Ce.nextNode(),a++)}return Ce.currentNode=_e,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},Re=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Te(this,n,e),Ve(n)?n===f||n==null||n===""?(this._$AH!==f&&this._$AR(),this._$AH=f):n!==this._$AH&&n!==ue&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):En(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==f&&Ve(this._$AH)?this._$AA.nextSibling.data=n:this.T(_e.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=Ge.createElement(Dn(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new lt(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(n){let e=Mn.get(n.strings);return e===void 0&&Mn.set(n.strings,e=new Ge(n)),e}k(n){Ot(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let r of n)i===e.length?e.push(t=new s(this.O(Fe()),this.O(Fe()),this,this.options)):t=e[i],t._$AI(r),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=kn(n).nextSibling;kn(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Ae=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=f}_$AI(n,e=this,t,i){let r=this.strings,a=!1;if(r===void 0)n=Te(this,n,e,0),a=!Ve(n)||n!==this._$AH&&n!==ue,a&&(this._$AH=n);else{let o=n,l,u;for(n=r[0],l=0;l<r.length-1;l++)u=Te(this,o[t+l],e,l),u===ue&&(u=this._$AH[l]),a||=!Ve(u)||u!==this._$AH[l],u===f?n=f:n!==f&&(n+=(u??"")+r[l+1]),this._$AH[l]=u}a&&!i&&this.j(n)}j(n){n===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},dt=class extends Ae{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===f?void 0:n}},ct=class extends Ae{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==f)}},ht=class extends Ae{constructor(n,e,t,i,r){super(n,e,t,i,r),this.type=5}_$AI(n,e=this){if((n=Te(this,n,e,0)??f)===ue)return;let t=this._$AH,i=n===f&&t!==f||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,r=n!==f&&(t===f||i);i&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},pt=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){Te(this,n)}},zn={M:Nt,P:pe,A:Bt,C:1,L:Ln,R:lt,D:En,V:Te,I:Re,H:Ae,N:ct,U:ht,B:dt,F:pt},zs=Rt.litHtmlPolyfillSupport;zs?.(Ge,Re),(Rt.litHtmlVersions??=[]).push("3.3.3");var Rn=(s,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let r=e?.renderBefore??null;t._$litPart$=i=new Re(n.insertBefore(Fe(),r),r,void 0,e??{})}return i._$AI(s),i};var Ht=globalThis,Q=class extends he{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Rn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ue}};Q._$litElement$=!0,Q.finalized=!0,Ht.litElementHydrateSupport?.({LitElement:Q});var Rs=Ht.litElementPolyfillSupport;Rs?.({LitElement:Q});(Ht.litElementVersions??=[]).push("4.2.2");var Ne="mydashlight",Ui=`/api/${Ne}/pair`,ji=`/api/${Ne}/pair/poll`,Wi=`/${Ne}`,Ye="pair";function Nn(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Ut(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function Bn(s){let n=new URLSearchParams(s);return n.has(Ye)?Ut(n.get(Ye)??""):null}function Ns(s){if(s<60)return"just now";let n=Math.round(s/60);return`${n} minute${n===1?"":"s"} ago`}var Ze=class extends Q{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let t=await this.connection.sendMessagePromise({type:`${Ne}/pair/check`,code:e});t.found?(this.waiting=t,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(t){this.error=this.message(t),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${Ne}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let t=e?.code;return t==="unauthorized"?"Only a Home Assistant admin can pair a screen.":t==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":t==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return d`<form @submit=${i=>{i.preventDefault();let r=Ut(this.typed);r&&this.check(r)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?d`<p class="error" role="alert">${this.error}</p>`:f}
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
      <p class="code">${Nn(e.code??"")}</p>
      ${i?d`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:f}
      <p>
        A screen at ${e.address} asked ${Ns(e.age??0)}. Check the code matches the one on the screen. It will be
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
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,d`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};Ze.styles=we`
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
  `,Ze.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Ze);function C(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function Xe(s){let n=Math.floor(Math.round(s)/60)%24;return`${C(s)} ${n<12?"AM":"PM"}`}function On(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function Qe(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function In(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Bs=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Os=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Is=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function ut(s){return new Date(`${s}T12:00:00Z`)}function te(s){let n=ut(s);return`${Bs.format(n)}, ${Is.format(n)}`}function Y(s){return Os.format(ut(s))}function ne(s,n){return Math.round((ut(n).getTime()-ut(s).getTime())/864e5)}function Je(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return Je("UTC",n)}let t=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function gt(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let i=Je(e,s),r=Je(e,n).date;return i.date===r?`at ${Xe(i.minutes)}`:`on ${Y(i.date)} at ${Xe(i.minutes)}`}var R=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}},Pe="mydashlight",Hs=7,Hn=3e4;function jt(s){if(s instanceof R)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new R(String(n.code??"error"),n.message)}return typeof s=="number"?new R("connection_lost","Lost the connection to Home Assistant."):new R("error",String(s))}var ft=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new R("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.pushing}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Hn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,n&&n().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(n=>{this.pushing=!0,n.plan?this.emit(n.plan):this.fail(new R("not_running","MyDashLight isn’t running right now."))},{type:`${Pe}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:"get_plan",service_data:{days:Hs},return_response:!0});this.emit(n.response)}catch(n){this.fail(jt(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:n,service_data:e})}catch(t){throw jt(t)}this.pushing||await this.refresh()}setRide(n,e,t,i){return this.call("set_ride",{event:n,side:e,driver:t,scope:i})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:In(e),scope:t})}setTakeAlong(n,e,t){return this.call("set_take_along",{event:n,kids:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}watchChores(n){let e=!1,t=null,i=null,r=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:"get_chores",service_data:{},return_response:!0});e||n(a.response??null)}catch{e||n(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(o=>{e||n(o.chores)},{type:`${Pe}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):t=a}catch{if(e)return;r(),i=setInterval(()=>void r(),Hn)}})(),()=>{e=!0,i&&clearInterval(i),t&&t().catch(()=>{})}}watchLunch(n){let e=!1,t=null;return(async()=>{try{let i=await this.conn.subscribeMessage(r=>{e||n(r.lunch)},{type:`${Pe}/lunch/subscribe`},{resubscribe:!0});e?i().catch(()=>{}):t=i}catch{e||n(null)}})(),()=>{e=!0,t&&t().catch(()=>{})}}async setLunch(n,e,t){await this.choreCall("set_lunch",{kid:n,dates:e,lunch:t??"default"})}async setLunchMenu(n,e,t,i){await this.choreCall("set_lunch_menu",{kids:n,date:e,menu:t,details:i})}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:n,service_data:e})}catch(t){throw jt(t)}}};var Un={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},jn=s=>(...n)=>({_$litDirective$:s,values:n}),mt=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:Us}=zn,Wn=s=>s;var Kn=()=>document.createComment(""),Be=(s,n,e)=>{let t=s._$AA.parentNode,i=n===void 0?s._$AB:n._$AA;if(e===void 0){let r=t.insertBefore(Kn(),i),a=t.insertBefore(Kn(),i);e=new Us(r,a,s,s.options)}else{let r=e._$AB.nextSibling,a=e._$AM,o=a!==s;if(o){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(r!==i||o){let l=e._$AA;for(;l!==r;){let u=Wn(l).nextSibling;Wn(t).insertBefore(l,i),l=u}}}return e},me=(s,n,e=s)=>(s._$AI(n,e),s),js={},qn=(s,n=js)=>s._$AH=n,Fn=s=>s._$AH,bt=s=>{s._$AR(),s._$AA.remove()};var Vn=(s,n,e)=>{let t=new Map;for(let i=n;i<=e;i++)t.set(s[i],i);return t},se=jn(class extends mt{constructor(s){if(super(s),s.type!==Un.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let i=[],r=[],a=0;for(let o of s)i[a]=t?t(o,a):a,r[a]=e(o,a),a++;return{values:r,keys:i}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let i=Fn(s),{values:r,keys:a}=this.dt(n,e,t);if(!Array.isArray(i))return this.ut=a,r;let o=this.ut??=[],l=[],u,p,h=0,g=i.length-1,x=0,$=r.length-1;for(;h<=g&&x<=$;)if(i[h]===null)h++;else if(i[g]===null)g--;else if(o[h]===a[x])l[x]=me(i[h],r[x]),h++,x++;else if(o[g]===a[$])l[$]=me(i[g],r[$]),g--,$--;else if(o[h]===a[$])l[$]=me(i[h],r[$]),Be(s,l[$+1],i[h]),h++,$--;else if(o[g]===a[x])l[x]=me(i[g],r[x]),Be(s,i[h],i[g]),g--,x++;else if(u===void 0&&(u=Vn(a,x,$),p=Vn(o,h,g)),u.has(o[h]))if(u.has(o[g])){let c=p.get(a[x]),m=c!==void 0?i[c]:null;if(m===null){let y=Be(s,i[h]);me(y,r[x]),l[x]=y}else l[x]=me(m,r[x]),Be(s,i[h],m),i[c]=null;x++}else bt(i[g]),g--;else bt(i[h]),h++;for(;x<=$;){let c=Be(s,l[$+1]);me(c,r[x]),l[x++]=c}for(;h<=g;){let c=i[h++];c!==null&&bt(c)}return this.ut=a,qn(s,l),ue}});var vt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function N(s){return vt[(s%vt.length+vt.length)%vt.length]}var Gn="#23272E",Yn="35,39,46";var Ws=3,kt=36,Wt=12,Ks=8,Kt=60,qt=10,yt=30,Ft=10,qs=150,Fs=200,wt=1.4;function Gt(s,n){let e=Math.max(qs,Fs/wt);return Math.ceil(Kt+Math.max(0,s-1)*qt+yt+Math.max(0,n-1)*Ft+e*(s+wt*n))}function Ee(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function be(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function J(s){return new Map(Ee(s).map((n,e)=>[n,N(e)]))}function X(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function ve(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function Yt(s,n){return n==="none"?"Not needed":be(s).includes(n)?ve(s,n):n}function Vs(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function $t(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function xt(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push($t(n,t.from)),e.push($t(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push($t(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Gs(s){let n=s.map(a=>({...a,col:0,cols:1})).sort((a,o)=>a.s-o.s||o.en-a.en),e=[],t=[],i=-1/0,r=()=>{for(let a of e)a.cols=t.length;e=[],t=[]};for(let a of n){a.s>=i&&(r(),i=-1/0);let o=t.findIndex(l=>l<=a.s);o<0?(o=t.length,t.push(a.en)):t[o]=a.en,a.col=o,e.push(a),i=Math.max(i,a.en)}return r(),n}function Ys(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.t)return i.t===t.t?t.y:Math.round(t.y+(n-t.t)/(i.t-t.t)*(i.y-t.y))}return s[s.length-1].y}function Zs(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.y)return i.y===t.y?t.t:t.t+(n-t.y)/(i.y-t.y)*(i.t-t.t)}return s[s.length-1].t}function Jn(s,n){return Ys(s.anchors,n)}function Qn(s,n){return Zs(s.anchors,n)}function Xs(s,n){let e=Ee(s),t=be(s),i=Math.max(n,Gt(e.length,t.length)),a=(i-Kt-Math.max(0,e.length-1)*qt-yt-Math.max(0,t.length-1)*Ft)/(e.length+wt*t.length||1),o=Math.floor(a),l=Math.floor(a*wt),u=new Map;for(let $ of s.days)for(let c of $.events){let m=u.get(c.kid)??[];m.some(y=>y.event_id===c.event_id&&y.calendar_id===c.calendar_id)||m.push(c),u.set(c.kid,m)}let p=J(s),h=[],g=Kt;e.forEach(($,c)=>{let m=u.get($)??[],y=s.days.some(v=>v.events.some(E=>E.kid===$&&(E.sides.includes("drop")&&E.drop===""||E.sides.includes("pick")&&E.pick==="")));h.push({id:$,kind:"kid",x:g,w:o,name:X(s,$),dot:p.get($).color,rgb:p.get($).rgb,sub:`${y?"Needs a ride · ":""}${m.length} this week`,subWarn:y}),g+=o+(c<e.length-1?qt:0)});let x=g+yt/2;return g+=yt,t.forEach(($,c)=>{let m=0,y=0;for(let v of s.days){let E=v.drivers[$];E&&(m+=E.outings.length,y+=E.drive??0)}h.push({id:$,kind:"driver",x:g,w:l,name:ve(s,$),dot:Gn,rgb:Yn,sub:`${m} ${m===1?"trip":"trips"} this week · ${Qe(y)} driving`,subWarn:!1}),g+=l+(c<t.length-1?Ft:0)}),{columns:h,sepX:x,width:i}}function Js(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(n.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let a=i.slice(r[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Zn(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${C(s.start)}`:e||!n?`${s.title} until ${C(s.end)}`:`${s.title} ${C(s.start)}–${C(s.end)}`}function Zt(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length}function Xt(s,n){let e=ne(n,s);return e===0?"Today":e===1?"Tomorrow":""}function V(s,n=0){return s==null||!Number.isFinite(s)?n:s}function Vt(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),i=1,r=0;for(let a of s.split(/\s+/).filter(Boolean)){let o=a.length;for(r===0?r=o:r+1+o<=t?r+=1+o:(i++,r=o);r>t;)i++,r-=t}return i}var es=25,ts=15,Jt=3;function Xn(s){return Math.max(0,Math.min(Jt,Math.floor((s-es)/ts)))}function Qs(s,n){let e=Math.min(Jt,Vt(s,n-19,6.6));return es+e*ts+2}function ei(s,n){let e=n-23,t=`${C(s.start)}–${C(s.end)}`+(s.arrive_by!=null?` · arrive ${C(s.arrive_by)}`:""),i=33+Vt(t,e,6.6)*16;for(let r of[s.lines.drop,s.lines.pick])r&&(i+=2+Vt(r.text,e,7)*16);return i+4}function ns(s,n,e,t){let i=n==="compact",{columns:r,sepX:a,width:o}=Xs(s,e),l=new Map(r.map(v=>[v.id,v])),u=Ee(s),p=be(s),h=[...u,...p],g=J(s),x=Vs(s),$=v=>X(s,v),c=v=>ve(s,v),m={mode:n,width:o,height:0,columns:r,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},y=0;return s.days.forEach((v,E)=>{let Z=E*1440,P=new Map(v.events.map(b=>[b.id,b])),j=b=>b&&P.has(b)?{day:v.date,event:b}:null,oe=Zt(v),xe=v.events.length,Le=Xt(v.date,t.date);m.dayHeads.push({date:v.date,y,label:te(v.date),tag:Le,sub:(xe?`${xe} ${xe===1?"activity":"activities"}`:"Nothing scheduled")+(oe?` · ${oe} to sort out`:""),warn:oe>0}),m.anchors.push({t:Z,y});let ge=y+kt+Wt,Ue=p.flatMap(b=>v.drivers[b]?.outings??[]);if(!xe&&!Ue.length){m.empties.push({key:v.date,y:ge,text:"Nothing planned"}),y=ge+40,m.anchors.push({t:Z+1439,y});return}let S=(b,A,_,M,T,D,k)=>{let W=g.get(b.kid)??N(0),K=b.lines;return{key:`${v.date}|card|${b.id}`,x:A,y:_,w:M,h:T,target:{day:v.date,event:b.id},event:b,color:W,kidName:$(b.kid),clash:D,stayed:b.stay&&p.includes(b.drop),skipped:b.attending===!1,title:Js(b.title,$(b.kid)),time:`${C(b.start)}–${C(b.end)}`+(b.arrive_by!=null?` · arrive ${C(b.arrive_by)}`:""),drop:K.drop,pick:K.pick,showDrop:!!K.drop&&(k||T>=56),showPick:!!K.pick&&(k||T>=74),wrap:k,aria:`${$(b.kid)}, ${b.title} ${C(b.start)} to ${C(b.end)}. `+(b.attending===!1&&!K.drop?"Not attending. ":"")+[K.drop,K.pick].filter(ce=>!!ce).map(ce=>ce.text).join(". ")}},ae=b=>{let A=v.rides[b];return A?(v.drivers[A.driver]?.segments??[]).filter(M=>M.type!=="home"&&M.kids.includes(A.kid)&&V(M.start)>=V(A.start)&&V(M.end)<=V(A.end)):[]},B=b=>{let A=v.rides[b];if(!A)return null;let _=A.serves.find(M=>P.get(M)?.kid===A.kid);return j(_??A.serves[0])},ee=new Map;for(let b of v.issues)b.level!=="problem"||!b.event||(b.kind==="late"&&ee.set(b.event,`${Math.round(V(b.minutes))} min late`),b.kind==="waiting"&&ee.set(`${b.event}|pick`,`Waits ${Math.round(V(b.minutes))} min`));if(!i){let b=1/0,A=-1/0;for(let k of v.events)b=Math.min(b,k.start-20,k.arrive_by!=null?k.arrive_by-10:1/0),A=Math.max(A,k.end+20);for(let k of Ue)k.start!=null&&(b=Math.min(b,k.start)),k.end!=null&&(A=Math.max(A,k.end));v.date===t.date&&Number.isFinite(b)&&t.minutes>b-60&&t.minutes<A&&(b=Math.min(b,t.minutes-15));let _=Number.isFinite(b)?Math.floor((b-5)/30)*30:900,M=Number.isFinite(A)?Math.ceil((A+5)/30)*30:960,T=k=>Math.round(ge+(Math.max(_,Math.min(M,k))-_)*Ws);m.anchors.push({t:Z+_,y:T(_)},{t:Z+M,y:T(M)});for(let k of u){let W=l.get(k),K=g.get(k),ce=(v.kids[k]?.items??[]).filter(L=>L.start!=null&&L.end!=null).map(L=>({item:L,s:V(L.start),en:V(L.end)}));for(let L of Gs(ce)){let w=W.w/L.cols,H=Math.round(W.x+L.col*w),O=Math.round(w-(L.cols>1?4:0)),q=T(L.s),fe=L.item;if(fe.type==="act"){let G=P.get(fe.event??"");if(!G)continue;let un=Math.max(30,T(L.en)-q);if(m.cards.push(S(G,H,q,O,un,fe.clash,!1)),G.arrive_by!=null&&G.start-G.arrive_by>=5){let mn=T(G.arrive_by);m.preps.push({key:`${v.date}|prep|${G.id}`,x:H,y:mn,w:O,h:q-mn+6,color:K,label:`Arrive by ${C(G.arrive_by)}`})}let gn=ee.get(G.id);gn&&m.marks.push({key:`${v.date}|late|${G.id}`,x:H+O-4,y:q+4,text:gn,right:!0});let fn=ee.get(`${G.id}|pick`);fn&&m.marks.push({key:`${v.date}|wait|${G.id}`,x:H+4,y:q+un+2,text:fn,right:!1});continue}let F=v.rides[fe.ride??-1];if(!F)continue;let ye=Math.max(22,T(L.en)-q),je=xt(ae(F.index),x),U=c(F.driver);m.rides.push({key:`${v.date}|ride|${F.index}`,x:H,y:q,w:O,h:ye,target:B(F.index),l1:`${F.own?"In":"Along in"} ${U}’s car`,l2:je.join(" → "),show2:Xn(ye)>0,lines2:Xn(ye),dashed:!F.own,clash:fe.clash,aria:`${$(k)} ${F.own?"in":"riding along in"} ${U}’s car, ${C(V(F.start))} to ${C(V(F.end))}: ${je.join(" to ")}`});let $e=l.get(F.driver);$e&&m.bands.push({key:`${v.date}|band|${F.index}`,x:H+O,y:q,w:Math.max(0,$e.x+8-(H+O)),h:ye,color:K})}}for(let k of p){let W=l.get(k),K=v.drivers[k];if(!K)continue;let ce=[],L=null;for(let w of K.segments)if(!(w.start==null||w.end==null)){if(w.type==="home"){L=null;continue}if(w.type==="stay"){L=null,ce.push({type:"stay",g:w,s:w.start,en:w.end});continue}L&&L.en===w.start?(L.en=w.end,L.legs.push(w)):(L={type:"trip",s:w.start,en:w.end,legs:[w]},ce.push(L))}for(let w of ce){let H=T(w.s),O=Math.max(24,T(w.en)-H);if(w.type==="stay"){let U=P.get(w.g.event??w.g.serves??""),$e=U?g.get(U.kid)??N(0):N(0),G=w.g.kids.map($);m.stays.push({key:`${v.date}|stay|${k}|${w.s}`,x:W.x+8,y:H,w:W.w-16,h:O,target:j(U?.id),color:$e,l1:U?`At ${U.title} with ${$(U.kid)}`:"Staying",l2:`until ${C(w.en)}`+(G.length?` · ${G.join(" and ")} too`:"")});continue}let q=w.legs[0],fe=w.legs[w.legs.length-1],F=[];for(let U of w.legs)for(let $e of U.kids)F.includes($e)||F.push($e);let ye=fe.type==="drive"&&fe.to==="home",je=xt(w.legs,x);m.trips.push({key:`${v.date}|trip|${k}|${w.s}`,x:W.x+8,y:H,w:W.w-16,h:O,target:j(w.legs.find(U=>U.serves)?.serves),l1:q.type==="drive"&&q.from==="home"?`Leave ${C(w.s)}`:`From ${$t(x,q.from??q.place)} ${C(w.s)}`,l2:je.join(" → "),show2:O>=36,l3:ye?`Home ${C(w.en)}`:"",show3:ye&&O>=62,stops:null,kids:F.map(U=>(g.get(U)??N(0)).color),bad:w.legs.some(U=>U.overlaps_busy),aria:`${c(k)} drives ${je.join(" to ")}, ${C(w.s)} to ${C(w.en)}`})}for(let w of K.segments)if(!(!w.overlaps_busy||w.start==null||w.end==null))for(let H of K.busy){let O=Math.max(w.start,H.start),q=Math.min(w.end,H.end);q<=O||m.overlaps.push({key:`${v.date}|overlap|${k}|${O}`,x:W.x+6,y:T(O)-2,w:W.w-12,h:Math.max(8,T(q)-T(O)+4)})}for(let w of K.busy){if(w.end<=_||w.start>=M)continue;let H=T(w.start),O=T(w.end);m.busy.push({key:`${v.date}|busy|${k}|${w.start}`,x:W.x+1,y:H,w:W.w-2,h:O-H,labelY:8,label:Zn(w,!1)})}}let D=-1/0;for(let k=_;k<=M;k+=30)m.grid.push({key:`${v.date}|grid|${k}`,y:T(k),strong:k%60===0}),k%60===0&&T(k)-D>=22&&(m.hours.push({key:`${v.date}|hour|${k}`,y:T(k)-8,label:On(k)}),D=T(k));v.date===t.date&&t.minutes>_&&t.minutes<M&&(m.now={y:T(t.minutes),label:`Now ${C(t.minutes)}`}),y=T(M)+Wt;return}let le=[];for(let b of u){let A=l.get(b);for(let _ of v.kids[b]?.items??[])if(_.start!=null){if(_.type==="act"){let M=P.get(_.event??"");if(!M)continue;le.push({col:b,s:_.start,h:ei(M,A.w),kind:"act",item:_})}else if(!v.rides[_.ride??-1]?.own){let M=v.rides[_.ride??-1],T=M?xt(ae(M.index),x).join(" → "):"";le.push({col:b,s:_.start,h:Qs(T,A.w),kind:"along",item:_})}}}for(let b of p){let A=v.drivers[b];if(A){for(let _ of A.busy)le.push({col:b,s:_.start,h:32,kind:"busy",busy:_});for(let _ of A.outings)_.start!=null&&le.push({col:b,s:_.start,h:30+_.lines.length*16+(_.warn?16:0),kind:"out",out:_})}}le.sort((b,A)=>b.s-A.s||h.indexOf(b.col)-h.indexOf(A.col));let ze=new Map,z=ge;le.forEach((b,A)=>{let _=ze.get(b.col),M=Math.max(_!=null?_+Ks:ge,z);ze.set(b.col,M+b.h),z=M,m.anchors.push({t:Z+b.s,y:M});let T=l.get(b.col);if(b.kind==="busy")m.busy.push({key:`${v.date}|busy|${b.col}|${A}`,x:T.x+1,y:M,w:T.w-2,h:b.h,labelY:8,label:Zn(b.busy,!0)});else if(b.kind==="out"){let D=b.out;m.trips.push({key:`${v.date}|trip|${b.col}|${A}`,x:T.x+8,y:M,w:T.w-16,h:b.h,target:j(D.target),l1:D.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...D.lines.map(k=>({text:k,warn:!1})),...D.warn?[{text:D.warn,warn:!0}]:[]],kids:D.kids.map(k=>(g.get(k)??N(0)).color),bad:!!D.warn,aria:`${c(b.col)}: ${D.lead}. ${D.lines.join(". ")}${D.warn?`. ${D.warn}`:""}`})}else if(b.kind==="act"){let D=P.get(b.item.event??"");m.cards.push(S(D,T.x,M,T.w,b.h,b.item.clash,!0))}else{let D=v.rides[b.item.ride??-1],k=xt(ae(D.index),x),W=c(D.driver);m.rides.push({key:`${v.date}|ride|${D.index}`,x:T.x,y:M,w:T.w,h:b.h,target:B(D.index),l1:`Along with ${W} ${C(V(D.start))}`,l2:k.join(" → "),show2:!0,lines2:Jt,dashed:!0,clash:b.item.clash,aria:`${$(b.col)} riding along with ${W}, ${C(V(D.start))} to ${C(V(D.end))}: ${k.join(" to ")}`})}});let de=ge;for(let b of ze.values())de=Math.max(de,b);y=de+Wt+6,m.anchors.push({t:Z+1439,y})}),m.height=y,m}var ti=["","¼","½","¾"];function Me(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return Qe(t);let i=Math.round(t*4),r=Math.floor(i/4),a=ti[i%4];return`${r||!a?r:""}${a} min`})}function ss(s){let n=e=>e?{...e,text:Me(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,i])=>[t,{...i,outings:i.outings.map(r=>({...r,lines:r.lines.map(Me),warn:r.warn==null?r.warn:Me(r.warn)}))}])),issues:e.issues.map(t=>({...t,title:Me(t.title),body:Me(t.body),note:t.note==null?t.note:Me(t.note),...t.suggestions?{suggestions:t.suggestions.map(i=>({...i,note:Me(i.note)}))}:{}}))}))}}var ni=2,si=48;function is(s,n,e=si){let t=[],i=0,r=0,a=0,o=0,l=n.minutes+e*60;for(let u of s.days){let p=ne(n.date,u.date),h=p===0?"":`${Y(u.date)} · `,g=new Map(u.events.map(c=>[c.id,c])),x=c=>c&&g.has(c)?{day:u.date,event:c}:null,$=(c,m)=>p*1440+(c??g.get(m??"")?.start??0)<l;for(let c of u.issues)if(c.level==="problem"){if(!$(c.at,c.event)){a++,c.kind==="unassigned"&&o++;continue}i++,c.kind==="unassigned"&&r++,t.push({key:`${u.date}|${c.key}`,tone:c.kind==="unassigned"?"unassigned":"problem",title:h+c.title,body:c.body,target:x(c.event),suggestions:(c.suggestions??[]).map(m=>({id:m.id,label:m.label,note:m.note}))})}if(u.clashes.forEach((c,m)=>{if(!$(c.a.start,c.a.event)){a++;return}i++;let y=g.get(c.a.event??""),v=X(s,c.kid),E=(P,j)=>{let oe=x(j);return oe?{text:P,target:oe}:P},Z=[];if(c.b.type==="act"){let P=g.get(c.b.event??"");y&&P&&(Z=[E(y.title,y.id),` ${C(y.start)}–${C(y.end)} and `,E(P.title,P.id),` ${C(P.start)}–${C(P.end)} overlap.`])}else{let P=u.rides[c.b.ride??-1];y&&P&&(Z=[`${v} is in `,E(`${ve(s,P.driver)}’s car`,P.serves[0]),` ${C(V(c.b.start))}–${C(V(c.b.end))}, during `,E(y.title,y.id),"."])}t.push({key:`${u.date}|clash|${m}`,tone:"problem",title:`${h}${v} is double-booked`,body:Z.map(P=>typeof P=="string"?P:P.text).join(""),parts:Z,target:null,suggestions:[]})}),p>=0&&p<ni)for(let c of u.issues)c.level!=="heads_up"||!$(c.at,c.event)||t.push({key:`${u.date}|${c.key}`,tone:"heads_up",title:h+c.title,body:c.body,target:x(c.event),suggestions:[]});for(let c of u.events)!c.problems.length||!$(c.start)||t.push({key:`${u.date}|notes|${c.id}`,tone:"heads_up",title:`${h}Check the notes on ${X(s,c.kid)}’s ${c.title}`,body:`These lines couldn’t be read: ${c.problems.join("; ")}`,target:x(c.id),suggestions:[]})}return{items:t,problems:i,unassigned:r,later:a,laterUnassigned:o}}function rs(s,n){let e=J(s),t=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of s.days){let a=ne(n.date,r.date);if(!(a<0))for(let o of be(s))for(let l of r.drivers[o]?.outings??[]){if(l.start==null)continue;let u=a*1440+l.start;if(a*1440+V(l.end,l.start)<=n.minutes)continue;let h=u-n.minutes,g={driver:o,name:ve(s,o),date:r.date,ahead:a,start:l.start,inMinutes:h,ongoing:h<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(x=>e.get(x)??N(0)),warn:l.warn,target:l.target&&r.events.some(x=>x.id===l.target)?{day:r.date,event:l.target}:null};(!t||i(g)<i(t)||i(g)===i(t)&&g.inMinutes<t.inMinutes)&&(t=g)}}return t}function Oe(s){return s.state==="done"||s.state==="late"}var ii=780;function ri(s,n,e){return s.state==="open"&&!!s.for_day&&s.due===n&&e<ii}function os(s,n){return s.chores.map(e=>ri(e,s.today,n)?{...e,state:"upcoming",shows_from:s.today}:e)}function as(s){return s.state==="open"||s.state==="overdue"}function tn(s,n,e){if(Oe(s)){let t=s.done_at?oi(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Qt(s.due,n)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Qt(s.for_day,n)}`;let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let i=ne(n,s.due);return`By ${i===1?"tomorrow":i<7?Y(s.due):en(s.due)}`}if(s.for_day&&s.due===n)return`Tonight · for ${Qt(s.for_day,n)}`;if(s.due&&s.due>n){let t=ne(n,s.due);return t===1?"By tomorrow":`By ${t<7?Y(s.due):en(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Qt(s,n){let e=ne(n,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?Y(s):en(s)}function en(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function oi(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let r=t.toLocaleDateString("en-CA",{timeZone:i}),a=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return r===n?a:`${Y(r)} ${a}`}function ls(s,n,e=1440){let t=os(s,e).sort((i,r)=>i.order-r.order);return s.kids.map((i,r)=>{let a=t.filter(p=>p.kid===i.id),o=new Map;for(let p of a){if(p.state!=="upcoming")continue;let h=p.shows_from??p.due??s.today;o.set(h,[...o.get(h)??[],p])}let l=a.filter(p=>p.state==="overdue"),u=a.filter(p=>p.state==="open");return{kid:i.id,name:i.name,color:n?.get(i.id)??N(r),overdue:l,now:u,done:a.filter(Oe),later:[...o.entries()].sort(([p],[h])=>p.localeCompare(h)).map(([p,h])=>({date:p,chores:h})),left:l.length+u.length}})}function ds(s,n=1440){return os(s,n).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,t)=>e.state===t.state?e.order-t.order:e.state==="overdue"?-1:1)}function nn(s){return!s.chores.length&&!s.templates.length}var Se=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function sn(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[i,r]=t.split("-").map(a=>Se.indexOf(a.trim()));if(i===void 0||i<0||r!==void 0&&r<0)return null;if(r===void 0)e.add(i);else for(let a=0;a<=(r-i+7)%7;a++)e.add((i+a)%7)}return e}function Ct(s){let n=[...new Set(s)].sort((t,i)=>t-i);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let i=e.at(-1);i&&i.at(-1)===t-1?i.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${Se[t[0]]}-${Se[t.at(-1)]}`]:t.map(i=>Se[i])).join(", ")}var De="none";function _t(s){return s==="daily"||s==="school"?"":"Any"}function cs(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function hs(s){return{template:s.id,repeats:s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:s.days??_t(s.repeats),every:s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function rn(s){return s.title.trim()?s.who.length?s.days===De?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function ps(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function on(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function an(s,n,e=1,t=!1,i=!1){if(s==="school"){let p=n.trim().replace(/-/g,"–"),h=i?p?`${p} Bring lunch days`:"Bring lunch days":p?`${p} school days`:"Every school day";return t?`${h}, the night before`:h}let r={daily:"day",weekly:"week",monthly:"month"}[s],a=e>1?`every ${e} ${r}s`:`each ${r}`,o=n.trim();if(s==="daily"){let p=o.replace(/-/g,"–");return e>1?p?`${p}, every ${e} days`:`Every ${e} days`:p||"Every day"}if(!o||o.toLowerCase()==="any")return`Sometime ${a}`;if(s==="weekly")return`${o.replace(/-/g,"–")} ${a}`;let u=`${o.split(",").map(p=>{let h=p.trim();return h.toLowerCase()==="last"?"the last day":/^\d+$/.test(h)?`the ${on(Number(h))}`:`the ${h}`}).join(" and ")} ${a}`;return u[0].toUpperCase()+u.slice(1)}function ln(s,n,e=!1){let t=s.map(r=>n.find(a=>a.id===r)?.name??r);if(!t.length)return"Nobody yet";let i=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${i} take turns`:i}function dn(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}function Tt(s,n){return`${s}|${n}`}function Ie(s,n){let[e,t,i]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1,i+n)).toISOString().slice(0,10)}function At(s){let[n,e,t]=s.split("-").map(Number);return(new Date(Date.UTC(n,e-1,t)).getUTCDay()+6)%7}function us(s,n){return s.days_off.find(e=>e.first<=n&&n<=e.last)??null}function gs(s,n){return At(n)<5&&!us(s,n)}function et(s,n,e=new Map){if(!gs(s,n))return null;let t=Tt(s.id,n);if(e.has(t)){let r=e.get(t);return r?{lunch:r,picked:!0}:{lunch:s.default,picked:!1}}let i=s.picks[n];return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}function He(s,n){return gs(s,n)?s.menus?.[n]??null:null}var ai="From the school's menu feed.";function li(s){let n=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==ai);return n.length?n.join(`
`):null}function ie(s){return s.slice(0,7)}function Pt(s){let[n,e]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function cn(s,n=1){let[e,t]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1+n,1)).toISOString().slice(0,7)}function fs(s){let n=[];for(let e=ie(s.first);e<=ie(s.last);e=cn(e))n.push(e);return n}function ms(s,n,e,t=new Map){let i=`${e}-01`,r=Ie(i,-At(i)),a=[];for(;ie(r)<=e;){let o=[];for(let l=0;l<5;l++){let u=Ie(r,l),p=ie(u)!==e,h=p?null:us(n,u),g=p?null:et(n,u,t);o.push({date:u,day:Number(u.slice(8)),outside:p,off:h?h.title:null,lunch:g?.lunch??null,picked:g?.picked??!1,menu:p?null:He(n,u)?.dish??null,sides:p?null:li(He(n,u)?.details??""),past:u<s.today,today:u===s.today})}o.some(l=>!l.outside)&&a.push(o),r=Ie(r,7)}return a}function bs(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function vs(s){let n=0,e=0;for(let t of s.flat())t.outside||t.past||!t.lunch||(t.lunch==="bring"?n++:e++);return{bring:n,buy:e}}function xs(s,n,e,t=new Map){let i=e<780?0:1;for(let r=i;r<8;r++){let a=Ie(n,r),o=et(s,a,t);if(!o)continue;let l=ne(n,a);return{lunch:o.lunch,when:l===0?"today":l===1?"tomorrow":Y(a),date:a,menu:He(s,a)?.dish??null}}return null}var di={timeline:"timeline",full:"timeline",compact:"compact"};function hn(s){let n=new URLSearchParams(s),e={},t=di[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(n.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores"||i==="lunch")&&(e.page=i),e}var ys=we`
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
`;var Cs="mydashlight.rides.mode",ci=1100,hi=440,pi=700,ui=3*6e4,gi=1200;function fi(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Mt=I`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,$s=I`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,mi=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],ws=I`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,ks=I`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,bi=I`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,vi=I`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,tt={bring:"Bring",buy:"Buy"};function xi(s,n){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return n<=1?`Every ${e}`:n===2?`Every other ${e}`:`Every ${n} ${e}s${s==="monthly"&&n===3?" (quarterly)":""}`}function re(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function pn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function yi(s,n){return Xt(s,n)||te(s).split(",")[0]}function $i(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function wi(){try{return localStorage.getItem(Cs)==="compact"?"compact":"timeline"}catch{return"timeline"}}function ki(s){try{localStorage.setItem(Cs,s)}catch{}}function Et(s){return s.days.every(n=>!n.events.length)}var nt=class extends Q{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=hn(location.search).view;this.urlPage=hn(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let i=e.clientX-t.x,r=e.clientY-t.y;if(!t.moved){if(Math.abs(i)+Math.abs(r)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-r,t.el.scrollLeft=t.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},ui))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??wi(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let t=new Map(this.lunchDraft);for(let[i,r]of this.lunchDraft){let[a,o]=i.split("|"),l=e.kids.find(u=>u.id===a);(!l||(l.picks[o]??null)===r||!et(l,o))&&t.delete(i)}this.lunchDraft=t}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let i of e.chores)t.has(i.id)&&Oe(i)===t.get(i.id)&&t.delete(i.id);for(let i of t.keys())e.chores.some(r=>r.id===i)||t.delete(i);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=ss(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<ci)return!1;let e=this.plan;return!e||this.width-hi>=Gt(Ee(e).length,be(e).length)}today(){return Je(this.plan?.time_zone??fi())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),i=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=ns(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let i=this.scroller;if(!i||!this.board)return;let r=this.board.dayHeads.find(a=>a.date===t)?.y??0;i.scrollTop=Math.max(r,Jn(this.board,e)-kt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),a=t.days[r];if(!a)return;let o=1/0;if(this.mode==="timeline"){for(let l of a.events)o=Math.min(o,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let u of l.outings)u.start!=null&&(o=Math.min(o,u.start))}this.scrollToTime(r*1440+(Number.isFinite(o)?Math.max(0,o-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,i=this.board.dayHeads[0];for(let u of this.board.dayHeads)u.y<=t+1&&(i=u);let r=this.renderRoot,a=r.querySelector(".pinned .label"),o=r.querySelector(".pinned .tag"),l=r.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),o&&(o.textContent!==i.tag&&(o.textContent=i.tag),o.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let u of r.querySelectorAll(".day-tile"))u.classList.toggle("in-view",u.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),r=new Map(this.choreDraft);r.set(e.id,i),this.choreDraft=r;try{await this.backend.setChoreDone(e.id,i,t&&t!==e.kid?t:void 0)}catch(a){let o=new Map(this.choreDraft);o.delete(e.id),this.choreDraft=o;let l=a instanceof R?a:new R("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??Oe(e)}editMenu(e,t){let i=this.lunch?.kids??[],r=He(e,t),a=i.filter(o=>o.id===e.id||r&&He(o,t)?.dish===r.dish).map(o=>o.id);this.closePanel(),this.menuEdit={kid:e.id,date:t,dish:r?.dish??"",details:r?.details??"",kids:a,had:!!r,busy:!1}}async saveMenu(e=!1){let t=this.menuEdit;if(!(!t||!this.backend||!t.kids.length)){this.menuEdit={...t,busy:!0};try{await this.backend.setLunchMenu(t.kids,t.date,e?"":t.dish.trim(),e?"":t.details.trim()),this.menuEdit=null}catch(i){this.menuEdit={...t,busy:!1};let r=i instanceof R?i:new R("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}}}async saveLunch(e,t,i){if(!this.backend||!t.length)return;let r=new Map(this.lunchDraft);for(let a of t)r.set(Tt(e,a),i);this.lunchDraft=r;try{await this.backend.setLunch(e,t,i)}catch(a){let o=new Map(this.lunchDraft);for(let u of t)o.delete(Tt(e,u));this.lunchDraft=o;let l=a instanceof R?a:new R("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?hs(e):cs(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||rn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(ps(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let i=t instanceof R?t:new R("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let i=t instanceof R?t:new R("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?Qn(this.board,t.scrollTop+kt+4):null,this.mode=e,this.urlView||ki(e)}findEvent(e){let t=this.plan?.days.find(r=>r.date===e.day),i=t?.events.find(r=>r.id===e.event);return t&&i?{day:t,event:i}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),i=this.dayIndexOf(e.day);!t||i<0||this.scrollToTime(i*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,i){if(!this.pending){this.pending={key:e,value:t};try{await i()}catch(r){let a=r instanceof R?r:new R("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,t,i){if(!this.backend)return;let r=this.backend;this.save(`${t}`,i,()=>r.setRide(e.id,t,i,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let i=this.backend;this.save("attending",t,()=>i.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t){if(!this.backend)return;let i=this.backend,r=e.along.includes(t)?e.along.filter(a=>a!==t):[...e.along,t];this.save("along",r,()=>i.setTakeAlong(e.id,r,this.scope))}nudgeArrive(e,t){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;t<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),gi)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let i=this.findEvent(t);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,a=i.event.id,o=this.scope;this.save("arrive",e,()=>r.setArriveBy(a,e,o)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),i=e?is(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?ds(this.chores,this.today().minutes).filter(h=>!this.choreDone(h)):[],o=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",u=d`<aside class="panel" aria-label=${l}>
      ${o??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,p=this.page==="rides";return d`
      <div class="app ${r?"wide":this.width<pi?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${p&&e?this.renderWeek(e):f}
          ${p?this.renderBanner(e):f}
          <main>
            ${p?d`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?Et(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:this.page==="lunch"?d`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:d`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?d`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${u}`:f}
          </main>
        </div>
        ${r?u:f}
        ${this.toast?d`<div class="toast" role="status">${this.toast}</div>`:f}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,i){let r=t.problems+i;this.tick;let a=this.today(),o="";if(e){let g=e.time_zone,x=new Date(e.updated);this.error?o=d`<span class="bad">Can’t reach Home Assistant · showing the plan from ${gt(x,new Date,g)}</span>`:e.status&&!e.status.ok?o=d`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${gt(x,new Date,g)}</span>`:this.backend?.live||(o=`Updated ${gt(x,new Date,g)}`)}let l=(g,x,$,c)=>d`
      <button type="button" class="seg-btn" title=${c} aria-pressed=${this.mode===g?"true":"false"} @click=${()=>this.setMode(g)}>
        ${$}<span class="seg-label">${x}</span>
      </button>
    `,u=(g,x,$)=>d`
      <button type="button" class="seg-btn" aria-pressed=${this.page===g?"true":"false"} @click=${()=>this.setPage(g)}>
        ${$}<span class="seg-label">${x}</span>
      </button>
    `,p=Xe(a.minutes),h=!!e&&Et(e);return d`
      <header>
        ${this.showMenu?d`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${I`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:f}
        <div class="titles">
          <h1 class="clock" aria-label=${`${te(a.date)}, ${p}`}>
            <span class="hm">${p.slice(0,-3)}</span><span class="ampm">${p.slice(-2)}</span>
          </h1>
          <p class="today-line">${te(a.date)}</p>
          ${o?d`<p class="status">${o}</p>`:f}
        </div>
        ${e&&!h?this.renderNext(e,rs(e,a),t):f}
        <div class="controls">
          ${this.wide||h&&!i?f:d`<button type="button" class="attn-btn ${r?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${r}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?f:d`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",I`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",I`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${u("rides","Rides",I`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${u("chores","Chores",I`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?f:u("lunch","Lunch",I`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,i){if(!t){let u=this.today().date,p=i.unassigned,h=i.laterUnassigned;if(p){let x=d`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${p} ${p===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?d`<div class="next idle needs">${x}</div>`:d`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${x}</button>`}if(h)return d`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let g=e.days.some(x=>x.date>=u&&x.events.length);return d`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${g?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${g?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let r;t.ongoing?r="On the road now":t.ahead===0?r=t.inMinutes<180?`Next trip · in ${Qe(t.inMinutes)}`:"Next trip · later today":t.ahead===1?r="Next trip · tomorrow":r=`Next trip · ${Y(t.date)}`;let a=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,o=d`
      <span class="next-eyebrow">${r}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${re(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(u=>d`<span class="kid-dot" style="background:${u.color}"></span>`)}</span>
      </span>
      ${t.warn?d`<span class="next-stop warn">${t.warn}</span>`:t.stop?d`<span class="next-stop">${t.stop}</span>`:f}
    `,l=`next ${t.ongoing?"ongoing":a?"soon":""}`;return t.target?d`<button type="button" class=${l} @click=${()=>this.open(t.target)}>${o}</button>`:d`<div class=${l}>${o}</div>`}renderWeek(e){let t=this.today().date,i=J(e);return d`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let a=Zt(r),o=r.events.length,l=r.events.slice(0,6).map(p=>i.get(p.kid)?.color??N(0).color),u=`${te(r.date)}: ${o?`${o} ${o===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return d`<button
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
            ${o>6?d`<span class="dt-more">+${o-6}</span>`:f}
          </span>
          ${a?d`<span class="dt-badge" aria-hidden="true">${a}</span>`:f}
        </button>`})}
    </nav>`}renderQuiet(e){let t=Ee(e),i=be(e),r=J(e),a=t.map(o=>X(e,o));return d`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((o,l)=>I`<circle cx=${50+l*30} cy="80" r="11" fill=${r.get(o).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${$i(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(o=>{let l=r.get(o);return d`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${re(X(e,o))}</span>
            <span class="qw-name">${X(e,o)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(o=>d`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${re(ve(e,o))}</span>
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
    </div>`:f}renderEmpty(){return this.error?d`<div class="empty-state">
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
              <span class="avatar ${o.kind}" aria-hidden="true">${re(o.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${o.name}</span>${o.kind==="kid"?this.renderLunchChip(o.id,!0):f}</span>
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
              <span class="label">${o.label}</span>${o.tag?d`<span class="tag">${o.tag}</span>`:f}<span
                class="sub ${o.warn?"warn":""}"
                >${o.sub}</span
              >
            </div>`)}
          ${e.empties.map(o=>d`<span class="empty" style="top:${o.y}px">${o.text}</span>`)}
          ${e.grid.map(o=>d`<div class="grid ${o.strong?"strong":""}" style="top:${o.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(o=>d`<span class="hour" style="top:${o.y}px">${o.label}</span>`)}
          ${se(e.bands,o=>o.key,o=>d`<div
                class="band"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:rgba(${o.color.rgb},0.10);border-color:rgba(${o.color.rgb},0.45)"
              ></div>`)}
          ${se(e.busy,o=>o.key,o=>d`<div class="busy" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px">
                <span style="top:${o.labelY}px">${o.label}</span>
              </div>`)}
          ${se(e.preps,o=>o.key,o=>d`<div
                class="prep"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:rgba(${o.color.rgb},0.07);color:${o.color.ink}"
              >
                ${o.label}
              </div>`)}
          ${se(e.cards,o=>o.key,o=>{let l=o.color,u=o.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:o.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return d`<button
                type="button"
                class="card ${o.wrap?"wrap":""} ${i(o.target)?"sel":""} ${o.clash?"clash":""} ${o.skipped?"skipped":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:${u};border-color:${o.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(o.target)}
              >
                <span class="top">
                  <span class="title">${o.title}</span>
                  <span class="time">${o.time}</span>
                  ${o.showDrop&&o.drop?d`<span class="line tone-${o.drop.tone}">${o.drop.text}</span>`:f}
                </span>
                ${o.showPick&&o.pick?d`<span class="line tone-${o.pick.tone}">${o.pick.text}</span>`:f}
              </button>`})}
          ${se(e.rides,o=>o.key,o=>d`<button
                type="button"
                class="ride ${o.dashed?"dashed":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}</span>${o.show2?d`<span class="l2" style="-webkit-line-clamp:${o.lines2}">${o.l2}</span>`:f}
              </button>`)}
          ${se(e.stays,o=>o.key,o=>d`<button
                type="button"
                class="stay"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:repeating-linear-gradient(135deg, rgba(${o.color.rgb},0.28) 0px, rgba(${o.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1" style="color:${o.color.ink}">${o.l1}</span><span class="l2">${o.l2}</span>
              </button>`)}
          ${se(e.trips,o=>o.key,o=>d`<button
                type="button"
                class="trip ${o.bad?"bad":""} ${o.stops?"list":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}${o.kids.map(l=>d`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${o.show2?d`<span class="l2">${o.l2}</span>`:f}
                ${o.stops?o.stops.map(l=>d`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):f}
                ${o.show3?d`<span class="l3">${o.l3}</span>`:f}
              </button>`)}
          ${se(e.overlaps,o=>o.key,o=>d`<div class="overlap" aria-hidden="true" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`)}
          ${se(e.marks,o=>o.key,o=>d`<span class="mark" style="left:${o.x}px;top:${o.y}px;${o.right?"transform:translateX(-100%)":""}">${o.text}</span>`)}
          ${e.now?d`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:f}
        </div>
      </div>
    `}renderAttention(e,t){let{items:i,problems:r,later:a}=e,o=this.plan,l=r+t.length,u=this.chores,p=!!u&&!nn(u);return d`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?f:d`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${p?d`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?d`<div class="attn-chores">${t.map(h=>this.renderChoreRow(h,!0))}</div>`:d`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:d`<p class="panel-sub">Rides in the next two days</p>`}
      ${o&&!r?d`<div class="all-clear">
            <span class="check" aria-hidden="true">${I`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Et(o)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:f}
      ${i.map(h=>d`<div class="issue ${h.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${h.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${h.target?d`<button type="button" class="issue-title" @click=${()=>this.open(h.target,!0)}>${h.title}</button>`:d`<strong class="issue-title">${h.title}</strong>`}
              <span class="issue-body"
                >${h.parts?h.parts.map(g=>typeof g=="string"?g:d`<button type="button" class="issue-link" @click=${()=>this.open(g.target,!0)}>${g.text}</button>`):h.body}</span
              >
            </div>
          </div>
          ${h.suggestions.length?d`<div class="fixes">
                ${h.suggestions.map(g=>d`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(g.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${g.id}`?"Saving…":g.label}</span>
                    <span class="fix-note">${g.note}</span>
                  </button>`)}
              </div>`:f}
        </div>`)}
      ${this.wide&&o&&!Et(o)&&this.page==="rides"?this.renderLegend():f}
    `}kidColorOf(e){let t=this.plan?J(this.plan).get(e):void 0;if(t)return t;let i=this.lunch?.kids.findIndex(r=>r.id===e)??-1;return N(Math.max(0,i))}renderLunchChip(e,t=!1){let i=this.lunch,r=i?.kids.find(u=>u.id===e);if(!i||!r)return f;this.tick;let a=this.today(),o=xs(r,a.date,a.minutes,this.lunchDraft);if(!o)return f;let l=tt[o.lunch];return d`<span class="lunch-chip ${o.lunch} ${t?"small":""}" title=${`${l} lunch ${o.when}${o.menu?`: ${o.menu}`:""}`}
      >${o.lunch==="bring"?ws:ks}<span class="lunch-chip-text"
        >${l}${t?f:` ${o.when}`}${!t&&o.menu?d`<span class="lunch-chip-menu"> · ${o.menu}</span>`:f}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return d`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let t=fs(e),i=this.lunchMonth&&t.includes(this.lunchMonth)?this.lunchMonth:ie(e.today),r=t.indexOf(i),a=p=>{let h=t[r+p];h&&(this.lunchMonth=h)},o=e.kids.some(p=>p.id===this.lunchKid)?this.lunchKid:null,l=o?e.kids.filter(p=>p.id===o):e.kids,u=e.status&&!e.status.ok?d`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:f;return d`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${r<=0} @click=${()=>a(-1)}>
            ${I`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Pt(i)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${r<0||r>=t.length-1} @click=${()=>a(1)}>
            ${I`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":d`${$s} Edit menus`}
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
    </div>`}renderLunchCard(e,t,i,r){let a=this.kidColorOf(t.id),o=ms(e,t,i,this.lunchDraft),l=vs(o),u=o.flat(),p=u.filter(c=>!c.outside&&!c.past&&c.lunch),h=t.days_off.filter(c=>ie(c.first)<=i&&i<=ie(c.last)),g=c=>p.filter(m=>At(m.date)===c),x=c=>{let m=g(c);if(!m.length)return;let y=m.every(v=>v.lunch==="bring")?"buy":"bring";this.saveLunch(t.id,m.map(v=>v.date),y)},$=p.length?`${l.bring} Bring · ${l.buy} Buy${i===ie(e.today)?" left this month":""}`:"No school days left this month";return d`<section class="chore-col lunch-card ${r?"wide":""}" style="--c:${a.color};--rgb:${a.rgb};--k:${a.ink}" aria-label=${`${t.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${re(t.name)}</span>
        <span class="ch-text">
          <span class="name">${t.name}</span>
          <span class="sub">${$}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${tt[t.default]} unless picked</span>
          ${e.kids.length<2?f:d`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${r?"Show everyone’s lunches":`Expand ${t.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=r?null:t.id}
              >
                ${r?vi:bi}${r?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${t.menu_feed&&!t.menu_feed.ok?d`<p class="field-hint bad">Couldn’t read the school menu feed${t.menu_feed.error?`: ${t.menu_feed.error}`:""}.</p>`:f}
      <div class="lunch-grid" role="grid" aria-label=${`${t.name}, ${Pt(i)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((c,m)=>d`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!g(m).length}
            aria-label=${`${g(m).every(y=>y.lunch==="bring")?"Buy":"Bring"} every ${c} left in ${Pt(i)} for ${t.name}`}
            @click=${()=>x(m)}
          >
            ${c}
          </button>`)}
        ${u.map(c=>this.renderLunchCell(t,c,r))}
      </div>
      ${h.length?d`<p class="lunch-offs">
            No school:
            ${h.map(c=>{let m=c.first<`${i}-01`?`${i}-01`:c.first,y=ie(c.last)>i?Ie(`${cn(i)}-01`,-1):c.last;return`${m===y?pn(m):`${pn(m)}–${pn(y)}`} ${bs(c.title)}`}).join(" · ")}
          </p>`:f}
    </section>`}renderLunchCell(e,t,i=!1){if(t.outside)return d`<span class="lunch-day outside" aria-hidden="true"></span>`;if(t.off!==null||!t.lunch)return d`<span class="lunch-day off ${t.today?"today":""}" title=${t.off??""}>
        <span class="lunch-num">${t.day}</span><span class="lunch-word">No school</span>
      </span>`;let r=t.lunch,a=r==="buy"?"bring":"buy",o=t.menu?`, ${t.menu}`:"",l=this.menuMode,u=this.menuEdit?.date===t.date&&this.menuEdit.kids.includes(e.id),p=l?`${e.name}, ${te(t.date)}${o||", no menu yet"}. Tap to ${t.menu?"change":"add"} the menu.`:`${e.name}, ${te(t.date)}: ${tt[r]}${t.picked?"":" (not picked yet)"}${o}. Tap to ${tt[a]}.`;return d`<button
      type="button"
      class="lunch-day ${r} ${t.picked?"picked":"unpicked"} ${t.past?"past":""} ${t.today?"today":""} ${l?"editing":""} ${u?"sel":""}"
      ?disabled=${t.past&&!l}
      aria-label=${p}
      @click=${()=>l?this.editMenu(e,t.date):void this.saveLunch(e.id,[t.date],a)}
    >
      <span class="lunch-num">${t.day}</span>
      <span class="lunch-word">${r==="bring"?ws:ks}${tt[r]}</span>
      ${t.menu?d`<span class="lunch-menu">${t.menu}</span>${i&&t.sides?d`<span class="lunch-sides">${t.sides}</span>`:f}`:l?d`<span class="lunch-menu add">${Mt} Menu</span>`:f}
    </button>`}renderChoreRow(e,t=!1){let i=this.chores,r=this.choreDone(e),a=i.kids.findIndex(y=>y.id===e.kid),o=(this.plan?J(this.plan).get(e.kid):void 0)??N(Math.max(0,a)),l=i.kids[a]?.name??"",u=r===Oe(e)?e:{...e,state:r?"done":"open",done_at:r?new Date().toISOString():null},p=r&&u.done_by&&u.done_by!==e.kid?i.people?.find(y=>y.id===u.done_by)?.name??u.done_by_name??null:null,h=`${tn(u,i.today,i.time_zone)}${p?` · by ${p}`:""}`,g=r||as(e),x=`${t?`${l}: `:""}${e.title}. ${h?`${h}. `:""}${r?"Done. Tap to undo.":"Tap when it’s done."}`,$=d`<span class="box" aria-hidden="true"
        >${r?I`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:f}</span
      >
      ${e.icon?d`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:f}
      <span class="chore-text">
        <span class="chore-title">${t?d`<span class="chore-kid">${l}</span> · `:f}${e.title}</span>
        ${h?d`<span class="chore-note">${h}</span>`:f}
      </span>`,c=`chore ${r?"done":""} ${e.state==="overdue"&&!r?"overdue":""} ${g?"":"later"}`,m=`--c:${o.color};--rgb:${o.rgb};--k:${o.ink}`;return g?d`<button type="button" class=${c} style=${m} aria-pressed=${r?"true":"false"} aria-label=${x} @click=${()=>this.tapChore(e)}>
          ${$}
        </button>`:d`<div class=${c} style=${m}>${$}</div>`}renderChores(){let e=this.chores;if(e===void 0)return d`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return d`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return d`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(nn(e))return d`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Mt} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore templates: Daily</strong> (or Weekly or Monthly). It
          shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(a=>a.problems.length),i=t.length?d`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(a=>this.renderTemplateRow(a))}</div>
        </section>`:f;this.tick;let r=ls(e,this.plan?J(this.plan):void 0,this.today().minutes);return d`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Mt} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${$s} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${r.length}">
        ${r.map(a=>{let o=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return d`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${re(a.name)}</span>
              <span class="ch-text">
                <span class="name">${a.name}</span>
                <span class="sub">${o?`${o} to do`:a.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(a.kid)}
            </div>
            ${a.overdue.length?d`<h3 class="chore-group overdue">Missed</h3>
                  ${a.overdue.map(l=>this.renderChoreRow(l))}`:f}
            ${a.now.length?d`<h3 class="chore-group">To do</h3>
                  ${a.now.map(l=>this.renderChoreRow(l))}`:f}
            ${a.done.length?d`<h3 class="chore-group">Done</h3>
                  ${a.done.map(l=>this.renderChoreRow(l))}`:f}
            ${a.later.map(l=>d`<h3 class="chore-group">${l.date===e.today?"Later today":yi(l.date,e.today)}</h3>
                ${l.chores.map(u=>this.renderChoreRow(u))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?d`<p class="chore-none">No chores this week.</p>`:f}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,r=this.plan?J(this.plan):void 0,a=this.choreEdit?.template===e.id,o=e.problems.length?d`<span class="tmpl-note bad">${e.problems.map(dn).join(" · ")} · tap to set up</span>`:d`<span class="tmpl-note">${ln(e.who,i,e.take_turns)} · ${an(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return d`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${a?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?d` <span class="tag-paused">Paused</span>`:f}</span>
        ${o}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let u=i.findIndex(h=>h.id===l),p=r?.get(l)??N(Math.max(0,u));return d`<span class="kid-dot" style="background:${p.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day or some days"],["school","School days"],["weekly","Weekly"],["monthly","Monthly"]];return d`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Mt} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([i,r])=>{let a=e.templates.filter(o=>o.repeats===i);return a.length?d`<section class="manage-group" aria-label=${r}>
                  <h3 class="chore-group">${r}</h3>
                  <div class="tmpl-list">${a.map(o=>this.renderTemplateRow(o))}</div>
                </section>`:f}):d`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the lists <strong>Chore templates: Daily</strong>, <strong>Weekly</strong>,
        <strong>Monthly</strong> and <strong>School days</strong>. A task added there by hand shows up here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return d``;let i=t.kids,r=this.plan?J(this.plan):void 0,a=this.choreBusy,o=e.template?t.templates.find(c=>c.id===e.template):void 0,l=rn(e),u=(o?.problems??[]).filter(c=>c!=="who:"),p=(c,m,y,v=!1)=>d`<button type="button" class="choice ${v?"wide":""}" aria-pressed=${c?"true":"false"} ?disabled=${a} @click=${y}>${m}</button>`,h=(c,m,y,v)=>d`<button type="button" class="chip" aria-pressed=${c?"true":"false"} aria-label=${v??f} ?disabled=${a} @click=${y}>${m}</button>`,g=c=>{c!==e.repeats&&this.changeDraft({repeats:c,days:o&&o.repeats===c?o.days??_t(c):_t(c)})},x=c=>{let m=e.who.includes(c)?e.who.filter(y=>y!==c):i.filter(y=>y.id===c||e.who.includes(y.id)).map(y=>y.id);this.changeDraft({who:m})},$;if(e.repeats==="school"){let c=e.days===De?new Set:e.days===""?new Set([0,1,2,3,4]):sn(e.days)??new Set,m=y=>{let v=new Set(c);v.has(y)?v.delete(y):v.add(y),this.changeDraft({days:v.size===5?"":v.size?Ct(v):De})};$=d`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Se.slice(0,5).map((y,v)=>h(c.has(v),y.slice(0,2),()=>m(v),y))}
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
        </div>`}else if(e.repeats==="monthly"){let c=e.days.trim(),m=/^\d+$/.test(c)?Number(c):null,y=c&&c.toLowerCase()!=="any"&&c.toLowerCase()!=="last"&&m===null;$=d`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${y?4:3}, minmax(0, 1fr))">
          ${p(c===""||c.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${p(m!==null,"On a date",()=>this.changeDraft({days:String(m??1)}))}
          ${p(c.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${y?p(!0,c,()=>{}):f}
        </div>
        ${m!==null?d`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${a||m<=1} @click=${()=>this.changeDraft({days:String(m-1)})}>−</button>
                <span class="arrive-value">${on(m)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${a||m>=31} @click=${()=>this.changeDraft({days:String(m+1)})}>+</button>
              </span>
            </div>`:d`<p class="field-hint">${c.toLowerCase()==="last"?"Due on the month’s last day.":y?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else{let c=e.repeats==="weekly"&&(e.days===""||e.days.toLowerCase()==="any"),m=e.days===De?new Set:c?new Set:sn(e.days)??new Set,y=v=>{let E=new Set(m);E.has(v)?E.delete(v):E.add(v),e.repeats==="weekly"?this.changeDraft({days:E.size?Ct(E)||"Mon-Sun":"Any"}):this.changeDraft({days:E.size?Ct(E):De})};$=d`<div class="field">
        <span class="field-label">${e.repeats==="weekly"?"Which day":"Which days"}</span>
        ${e.repeats==="weekly"?d`<div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
              ${p(c,"Any day that week",()=>this.changeDraft({days:"Any"}))}
              ${p(!c,"On a set day",()=>this.changeDraft({days:c?"Sat":e.days}))}
            </div>`:f}
        ${e.repeats==="daily"||!c?d`<div role="group" aria-label="Days of the week" class="day-chips">
              ${Se.map((v,E)=>h(m.has(E),v.slice(0,2),()=>y(E),v))}
            </div>`:f}
        ${e.repeats==="daily"?d`<div class="chips">
              ${h(e.days==="","Every day",()=>this.changeDraft({days:""}))}
              ${h(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
              ${h(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
            </div>`:d`<p class="field-hint">${c?"Shows all week, due on Sunday.":"Due that day."}</p>`}
      </div>`}return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?d`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:f}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?ln(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===De?"No days picked":an(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${a} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${u.length?d`<p class="field-hint bad">${u.map(dn).join(". ")}. Saving fixes it.</p>`:f}
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
          ${mi.map(c=>h(e.icon===c,c,()=>this.changeDraft({icon:e.icon===c?null:c}),`Picture ${c}`))}
        </div>
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((c,m)=>{let y=r?.get(c.id)??N(m),v=e.who.includes(c.id);return d`<button type="button" class="who-chip" style="--c:${y.color};--rgb:${y.rgb}" aria-pressed=${v?"true":"false"} ?disabled=${a} @click=${()=>x(c.id)}>
              <span class="avatar" aria-hidden="true">${re(c.name)}</span>${c.name}
            </button>`})}
        </div>
        ${e.who.length>1?d`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${p(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${p(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:f}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${p(e.repeats==="daily","Days",()=>g("daily"))}
          ${p(e.repeats==="school","School days",()=>g("school"))}
          ${p(e.repeats==="weekly","Weekly",()=>g("weekly"))}
          ${p(e.repeats==="monthly","Monthly",()=>g("monthly"))}
        </div>
      </div>
      ${$}
      ${e.repeats==="school"?f:d`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Repeats</span>
          <span class="field-hint">${xi(e.repeats,e.every)}</span>
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
            </button>`:f}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${a?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let t=this.lunch;if(!t)return d``;let i=e.busy,r=p=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...p})},a=p=>r({kids:e.kids.includes(p)?e.kids.filter(h=>h!==p):[...e.kids,p]}),o=t.kids.filter(p=>et(p,e.date)),l=e.dish.trim(),u=e.kids.length?l?null:"Type what’s served":"Pick who gets this menu";return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${te(e.date)}</span>
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
          ${o.map(p=>{let h=this.kidColorOf(p.id),g=e.kids.includes(p.id);return d`<button type="button" class="who-chip" style="--c:${h.color};--rgb:${h.rgb}" aria-pressed=${g?"true":"false"} ?disabled=${i} @click=${()=>a(p.id)}>
              <span class="avatar" aria-hidden="true">${re(p.name)}</span>${p.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${l||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?d`<button type="button" class="chip clear remove" ?disabled=${i||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:f}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${i||!!u} @click=${()=>void this.saveMenu()}>
          ${i?"Saving to Google Calendar…":u??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return d``;let i=t.people?.length?t.people:t.kids.map(h=>({...h,role:"kid"})),r=t.kids.findIndex(h=>h.id===e.kid),a=t.kids[r],o=this.plan?J(this.plan):void 0,l=o?.get(e.kid)??N(Math.max(0,r)),u=i.filter(h=>h.id!==e.kid),p=h=>{let g=t.kids.findIndex(x=>x.id===h.id);return g>=0?(o?.get(h.id)??N(g)).color:"var(--dark)"};return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?d`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:f}${e.title}</span>
          <span class="ed-meta">${a?.name??""} · ${tn(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${re(a?.name??"?")}</span>
          <span>${a?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?d`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${u.map(h=>d`<button type="button" class="done-by" style="--c:${p(h)}" @click=${()=>void this.toggleChore(e,h.id)}>
                  <span class="avatar ${h.role==="parent"?"driver":""}" aria-hidden="true">${re(h.name)}</span>
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
    </div>`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return d``;let{day:i,event:r}=t,a=be(e),l=J(e).get(r.kid)??N(0),u=!!this.pending,p=S=>this.pending?.key===S?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let S of e.days)for(let ae of S.events)for(let B of[ae.drop,ae.pick])B&&B!=="none"&&!a.includes(B)&&!h.some(ee=>ee.toLowerCase()===B.toLowerCase())&&h.push(B);let g=S=>{if(!r.sides.includes(S))return f;let ae=p(S),B=ae!==void 0?String(ae):S==="drop"?r.drop:r.pick,ee=B&&B!=="none"&&!a.includes(B)?B:"",le=z=>this.setRide(r,S,B===z?"":z),ze=[...a.map(z=>[z,Yt(e,z)]),["none","Not needed"]];return d`<div class="field">
        <span class="field-label">${S==="drop"?"Drop-off":"Pick-up"} ${B===""?d`<span class="nobody">· nobody yet</span>`:f}</span>
        <div role="group" aria-label=${S==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${ze.length}, minmax(0, 1fr))">
          ${ze.map(([z,de])=>d`<button type="button" class="choice" aria-pressed=${B===z?"true":"false"} ?disabled=${u} @click=${()=>le(z)}>
                ${de}
              </button>`)}
        </div>
        ${h.length?d`<div role="group" aria-label=${S==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(z=>d`<button type="button" class="chip" aria-pressed=${B.toLowerCase()===z.toLowerCase()?"true":"false"} ?disabled=${u} @click=${()=>le(z)}>
                    ${z}
                  </button>`)}
            </div>`:f}
        <input
          type="text"
          .value=${ee&&!h.some(z=>z.toLowerCase()===ee.toLowerCase())?ee:""}
          ?disabled=${u}
          aria-label=${S==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${z=>{let de=z.target.value.trim();de&&de!==B&&this.setRide(r,S,de)}}
          @keydown=${z=>{z.key==="Enter"&&z.target.blur()}}
        />
      </div>`},x=p("stay"),$=x!==void 0?!!x:r.stay,c=r.drop===r.pick&&a.includes(r.drop),m=p("along"),y=m!==void 0?m:r.along,v=Ee(e).filter(S=>S!==r.kid),E=a.includes(r.drop)&&r.sides.includes("drop"),Z=p("arrive"),P=this.arriveDraft!==void 0?this.arriveDraft:Z!==void 0?Z:r.arrive_by,j=[],oe=S=>S==="none"?"Not needed":Yt(e,S);r.drop!==""&&j.push(`Drop-off: ${oe(r.drop)}`),r.pick!==""&&j.push(`Pick-up: ${oe(r.pick)}`),r.stay&&j.push("Stay: yes"),r.along.length&&j.push(`Take along: ${r.along.map(S=>X(e,S)).join(", ")}`),r.arrive_by!=null&&j.push(`Arrive by: ${Xe(r.arrive_by)}`);let xe=p("attending"),Le=xe!==void 0?!!xe:r.attending!==!1;r.attending===!1&&j.splice(0,j.length,"Attending: no");let ge=i.date===this.today().date?"":`${Y(i.date)} · `,Ue=d`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${X(e,r.kid)} · ${r.title}</span>
          <span class="ed-meta">${ge}${C(r.start)}–${C(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return r.where==="home"?d`${Ue}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${X(e,r.kid)} can’t get home in time, the board shows it as a clash.</p>`:d`
      ${Ue}
      ${this.pending?d`<p class="saving" role="status">Saving to Google Calendar…</p>`:f}
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
          </div>`:f}
      <div class="field">
        <span class="field-label">${X(e,r.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${Le?"true":"false"} ?disabled=${u} @click=${()=>this.setAttending(r,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${Le?"false":"true"} ?disabled=${u} @click=${()=>this.setAttending(r,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${Le?d`${r.where==="anywhere"?d`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:f}
            ${g("drop")} ${g("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${$?"true":"false"} ?disabled=${!c||u} @click=${()=>this.toggleStay(r)}>
          ${c?$?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${E&&v.length?d`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${v.map(S=>d`<button type="button" class="chip" aria-pressed=${y.includes(S)?"true":"false"} ?disabled=${u} @click=${()=>this.toggleAlong(r,S)}>
                  ${X(e,S)}
                </button>`)}
            </div>
          </div>`:f}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${P!=null?`${r.start-P} min before it starts`:`Aims for a few minutes before ${C(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${u} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${P!=null?C(P):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${u||P==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${P!=null?d`<button type="button" class="chip clear" ?disabled=${u} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:f}
`:d`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${j.length?j.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${r.problems.length?d`<p class="field-hint bad">These lines in the notes couldn’t be read: ${r.problems.join("; ")}</p>`:f}
      ${Le?d`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:f}
    `}};nt.styles=ys,nt.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",nt);var st=class extends Q{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=Bn(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(Ye);let t=e.toString();history.replaceState(history.state,"",`${location.pathname}${t?`?${t}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new ft(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return d`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?d`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:f}`}};st.styles=we`
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
  `,st.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",st);
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
