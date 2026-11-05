var Qe=globalThis,et=Qe.ShadowRoot&&(Qe.ShadyCSS===void 0||Qe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$t=Symbol(),is=new WeakMap,Oe=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==$t)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(et&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=is.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&is.set(e,s))}return s}toString(){return this.cssText}},rs=n=>new Oe(typeof n=="string"?n:n+"",void 0,$t),ye=(n,...s)=>{let e=n.length===1?n[0]:s.reduce((t,i,r)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new Oe(e,n,$t)},os=(n,s)=>{if(et)n.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),i=Qe.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,n.appendChild(t)}},wt=et?n=>n:n=>n instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return rs(e)})(n):n;var{is:sn,defineProperty:nn,getOwnPropertyDescriptor:rn,getOwnPropertyNames:on,getOwnPropertySymbols:an,getPrototypeOf:ln}=Object,tt=globalThis,as=tt.trustedTypes,dn=as?as.emptyScript:"",pn=tt.reactiveElementPolyfillSupport,He=(n,s)=>n,kt={toAttribute(n,s){switch(s){case Boolean:n=n?dn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,s){let e=n;switch(s){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ds=(n,s)=>!sn(n,s),ls={attribute:!0,type:String,converter:kt,reflect:!1,useDefault:!1,hasChanged:ds};Symbol.metadata??=Symbol("metadata"),tt.litPropertyMetadata??=new WeakMap;var ae=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=ls){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(s,t,e);i!==void 0&&nn(this.prototype,s,i)}}static getPropertyDescriptor(s,e,t){let{get:i,set:r}=rn(this.prototype,s)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);r?.call(this,a),this.requestUpdate(s,o,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??ls}static _$Ei(){if(this.hasOwnProperty(He("elementProperties")))return;let s=ln(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(He("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(He("properties"))){let e=this.properties,t=[...on(e),...an(e)];for(let i of t)this.createProperty(i,e[i])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let i of t)e.unshift(wt(i))}else s!==void 0&&e.push(wt(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return os(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,t);if(i!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:kt).toAttribute(e,t.type);this._$Em=s,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(s,e){let t=this.constructor,i=t._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let r=t.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:kt;this._$Em=i;let o=a.fromAttribute(e,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(s,e,t,i=!1,r){if(s!==void 0){let a=this.constructor;if(i===!1&&(r=this[s]),t??=a.getPropertyOptions(s),!((t.hasChanged??ds)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(s)&&!this.hasAttribute(a._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:i,wrapped:r},a){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,a??e??this[s]),r!==!0||a!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,r]of t){let{wrapped:a}=r,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};ae.elementStyles=[],ae.shadowRootOptions={mode:"open"},ae[He("elementProperties")]=new Map,ae[He("finalized")]=new Map,pn?.({ReactiveElement:ae}),(tt.reactiveElementVersions??=[]).push("2.1.2");var _t=globalThis,ps=n=>n,st=_t.trustedTypes,cs=st?st.createPolicy("lit-html",{createHTML:n=>n}):void 0,At="$lit$",le=`lit$${Math.random().toFixed(9).slice(2)}$`,Tt="?"+le,cn=`<${Tt}>`,ke=document,je=()=>ke.createComment(""),We=n=>n===null||typeof n!="object"&&typeof n!="function",Pt=Array.isArray,bs=n=>Pt(n)||typeof n?.[Symbol.iterator]=="function",Ct=`[ 	
\f\r]`,Ue=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,hs=/-->/g,us=/>/g,$e=RegExp(`>|${Ct}(?:([^\\s"'>=/]+)(${Ct}*=${Ct}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gs=/'/g,fs=/"/g,xs=/^(?:script|style|textarea|title)$/i,Et=n=>(s,...e)=>({_$litType$:n,strings:s,values:e}),d=Et(1),Q=Et(2),si=Et(3),de=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),ms=new WeakMap,we=ke.createTreeWalker(ke,129);function vs(n,s){if(!Pt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return cs!==void 0?cs.createHTML(s):s}var ys=(n,s)=>{let e=n.length-1,t=[],i,r=s===2?"<svg>":s===3?"<math>":"",a=Ue;for(let o=0;o<e;o++){let l=n[o],c,g,h=-1,f=0;for(;f<l.length&&(a.lastIndex=f,g=a.exec(l),g!==null);)f=a.lastIndex,a===Ue?g[1]==="!--"?a=hs:g[1]!==void 0?a=us:g[2]!==void 0?(xs.test(g[2])&&(i=RegExp("</"+g[2],"g")),a=$e):g[3]!==void 0&&(a=$e):a===$e?g[0]===">"?(a=i??Ue,h=-1):g[1]===void 0?h=-2:(h=a.lastIndex-g[2].length,c=g[1],a=g[3]===void 0?$e:g[3]==='"'?fs:gs):a===fs||a===gs?a=$e:a===hs||a===us?a=Ue:(a=$e,i=void 0);let v=a===$e&&n[o+1].startsWith("/>")?" ":"";r+=a===Ue?l+cn:h>=0?(t.push(c),l.slice(0,h)+At+l.slice(h)+le+v):l+le+(h===-2?o:v)}return[vs(n,r+(n[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},qe=class n{constructor({strings:s,_$litType$:e},t){let i;this.parts=[];let r=0,a=0,o=s.length-1,l=this.parts,[c,g]=ys(s,e);if(this.el=n.createElement(c,t),we.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=we.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(At)){let f=g[a++],v=i.getAttribute(h).split(le),y=/([.?@])?(.*)/.exec(f);l.push({type:1,index:r,name:y[2],strings:v,ctor:y[1]==="."?it:y[1]==="?"?rt:y[1]==="@"?ot:_e}),i.removeAttribute(h)}else h.startsWith(le)&&(l.push({type:6,index:r}),i.removeAttribute(h));if(xs.test(i.tagName)){let h=i.textContent.split(le),f=h.length-1;if(f>0){i.textContent=st?st.emptyScript:"";for(let v=0;v<f;v++)i.append(h[v],je()),we.nextNode(),l.push({type:2,index:++r});i.append(h[f],je())}}}else if(i.nodeType===8)if(i.data===Tt)l.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(le,h+1))!==-1;)l.push({type:7,index:r}),h+=le.length-1}r++}}static createElement(s,e){let t=ke.createElement("template");return t.innerHTML=s,t}};function Ce(n,s,e=n,t){if(s===de)return s;let i=t!==void 0?e._$Co?.[t]:e._$Cl,r=We(s)?void 0:s._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(s=Ce(n,i._$AS(n,s.values),i,t)),s}var nt=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,i=(s?.creationScope??ke).importNode(e,!0);we.currentNode=i;let r=we.nextNode(),a=0,o=0,l=t[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new Me(r,r.nextSibling,this,s):l.type===1?c=new l.ctor(r,l.name,l.strings,this,s):l.type===6&&(c=new at(r,this,s)),this._$AV.push(c),l=t[++o]}a!==l?.index&&(r=we.nextNode(),a++)}return we.currentNode=ke,i}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},Me=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=Ce(this,s,e),We(s)?s===m||s==null||s===""?(this._$AH!==m&&this._$AR(),this._$AH=m):s!==this._$AH&&s!==de&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):bs(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==m&&We(this._$AH)?this._$AA.nextSibling.data=s:this.T(ke.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,i=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=qe.createElement(vs(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new nt(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(s){let e=ms.get(s.strings);return e===void 0&&ms.set(s.strings,e=new qe(s)),e}k(s){Pt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let r of s)i===e.length?e.push(t=new n(this.O(je()),this.O(je()),this,this.options)):t=e[i],t._$AI(r),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=ps(s).nextSibling;ps(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},_e=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,i,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=s,this.name=e,this._$AM=i,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=m}_$AI(s,e=this,t,i){let r=this.strings,a=!1;if(r===void 0)s=Ce(this,s,e,0),a=!We(s)||s!==this._$AH&&s!==de,a&&(this._$AH=s);else{let o=s,l,c;for(s=r[0],l=0;l<r.length-1;l++)c=Ce(this,o[t+l],e,l),c===de&&(c=this._$AH[l]),a||=!We(c)||c!==this._$AH[l],c===m?s=m:s!==m&&(s+=(c??"")+r[l+1]),this._$AH[l]=c}a&&!i&&this.j(s)}j(s){s===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},it=class extends _e{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===m?void 0:s}},rt=class extends _e{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==m)}},ot=class extends _e{constructor(s,e,t,i,r){super(s,e,t,i,r),this.type=5}_$AI(s,e=this){if((s=Ce(this,s,e,0)??m)===de)return;let t=this._$AH,i=s===m&&t!==m||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,r=s!==m&&(t===m||i);i&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},at=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){Ce(this,s)}},$s={M:At,P:le,A:Tt,C:1,L:ys,R:nt,D:bs,V:Ce,I:Me,H:_e,N:rt,U:ot,B:it,F:at},hn=_t.litHtmlPolyfillSupport;hn?.(qe,Me),(_t.litHtmlVersions??=[]).push("3.3.3");var ws=(n,s,e)=>{let t=e?.renderBefore??s,i=t._$litPart$;if(i===void 0){let r=e?.renderBefore??null;t._$litPart$=i=new Me(s.insertBefore(je(),r),r,void 0,e??{})}return i._$AI(n),i};var St=globalThis,X=class extends ae{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=ws(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return de}};X._$litElement$=!0,X.finalized=!0,St.litElementHydrateSupport?.({LitElement:X});var un=St.litElementPolyfillSupport;un?.({LitElement:X});(St.litElementVersions??=[]).push("4.2.2");var De="mydashlight",fi=`/api/${De}/pair`,mi=`/api/${De}/pair/poll`,bi=`/${De}`,Fe="pair";function ks(n){return n.length>4?`${n.slice(0,4)}-${n.slice(4)}`:n}function Mt(n){return n.toUpperCase().replace(/[^A-Z0-9]/g,"")}function Cs(n){let s=new URLSearchParams(n);return s.has(Fe)?Mt(s.get(Fe)??""):null}function gn(n){if(n<60)return"just now";let s=Math.round(n/60);return`${s} minute${s===1?"":"s"} ago`}var Ve=class extends X{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let t=await this.connection.sendMessagePromise({type:`${De}/pair/check`,code:e});t.found?(this.waiting=t,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(t){this.error=this.message(t),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${De}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let t=e?.code;return t==="unauthorized"?"Only a Home Assistant admin can pair a screen.":t==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":t==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return d`<form @submit=${i=>{i.preventDefault();let r=Mt(this.typed);r&&this.check(r)}}>
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
    </form>`}confirm(){let e=this.waiting,t=this.step==="approving";return d`<h2>Allow this screen?</h2>
      <p class="code">${ks(e.code??"")}</p>
      <p>
        A screen at ${e.address} asked ${gn(e.age??0)}. Check the code matches the one on the screen. It will be
        signed in to Home Assistant as <b>${this.userName||"you"}</b>.
      </p>
      <p>To sign it out later, delete its entry under Refresh tokens on your Home Assistant profile’s Security tab.</p>
      <div class="actions">
        <button type="button" @click=${()=>this.close()} ?disabled=${t}>Cancel</button>
        <button type="button" class="dark" @click=${()=>void this.approve()} ?disabled=${t}>
          ${t?"Allowing…":"Allow"}
        </button>
      </div>`}render(){let e;return this.isAdmin?this.step==="done"?e=d`<h2>Screen paired</h2>
        <p>It will open the board in a few seconds.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Done</button></div>`:this.step==="confirm"||this.step==="approving"?e=this.confirm():e=this.enter():e=d`<h2>Pair a screen</h2>
        <p>Only a Home Assistant admin can pair a screen. Ask an admin to scan the code instead.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,d`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};Ve.styles=ye`
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
  `,Ve.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",Ve);function C(n){let s=Math.round(n),e=Math.floor(s/60),t=(s%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function Ke(n){let s=Math.floor(Math.round(n)/60)%24;return`${C(n)} ${s<12?"AM":"PM"}`}function _s(n){let s=Math.floor(n/60)%24;return`${(s+11)%12+1} ${s<12?"AM":"PM"}`}function Ye(n){let s=Math.max(0,Math.round(n)),e=Math.floor(s/60),t=s%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function As(n){let s=Math.floor(n/60)%24,e=n%60;return`${String(s).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var fn=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),mn=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),bn=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function lt(n){return new Date(`${n}T12:00:00Z`)}function Ae(n){let s=lt(n);return`${fn.format(s)}, ${bn.format(s)}`}function Y(n){return mn.format(lt(n))}function he(n,s){return Math.round((lt(s).getTime()-lt(n).getTime())/864e5)}function Ge(n,s=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:n,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(s)}catch{return Ge("UTC",s)}let t=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function dt(n,s,e){let t=Math.floor((s.getTime()-n.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let i=Ge(e,n),r=Ge(e,s).date;return i.date===r?`at ${Ke(i.minutes)}`:`on ${Y(i.date)} at ${Ke(i.minutes)}`}var H=class extends Error{constructor(s,e){super(e),this.code=s,this.name="BackendError"}},ze="mydashlight",xn=7,Ts=3e4;function Dt(n){if(n instanceof H)return n;if(n&&typeof n=="object"){let s=n;if(typeof s.message=="string")return new H(String(s.code??"error"),s.message)}return typeof n=="number"?new H("connection_lost","Lost the connection to Home Assistant."):new H("error",String(n))}var pt=class{constructor(s){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new H("connection_lost","Lost the connection to Home Assistant."));this.conn=s}get live(){return this.pushing}watch(s,e){let t={onPlan:s,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Ts),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let s=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,s&&s().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(s=>{this.pushing=!0,s.plan?this.emit(s.plan):this.fail(new H("not_running","MyDashLight isn’t running right now."))},{type:`${ze}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(s){for(let e of this.listeners)e.onError(s)}emit(s){for(let e of this.listeners)e.onPlan(s)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let s=await this.conn.sendMessagePromise({type:"call_service",domain:ze,service:"get_plan",service_data:{days:xn},return_response:!0});this.emit(s.response)}catch(s){this.fail(Dt(s))}}async call(s,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:ze,service:s,service_data:e})}catch(t){throw Dt(t)}this.pushing||await this.refresh()}setRide(s,e,t,i){return this.call("set_ride",{event:s,side:e,driver:t,scope:i})}setStay(s,e,t){return this.call("set_stay",{event:s,stay:e,scope:t})}setAttending(s,e,t){return this.call("set_attending",{event:s,attending:e,scope:t})}setArriveBy(s,e,t){return this.call("set_arrive_by",e==null?{event:s,scope:t}:{event:s,time:As(e),scope:t})}setTakeAlong(s,e,t){return this.call("set_take_along",{event:s,kids:e,scope:t})}applySuggestion(s){return this.call("apply_suggestion",{suggestion:s})}watchChores(s){let e=!1,t=null,i=null,r=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:ze,service:"get_chores",service_data:{},return_response:!0});e||s(a.response??null)}catch{e||s(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(o=>{e||s(o.chores)},{type:`${ze}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):t=a}catch{if(e)return;r(),i=setInterval(()=>void r(),Ts)}})(),()=>{e=!0,i&&clearInterval(i),t&&t().catch(()=>{})}}async setChoreDone(s,e,t){await this.choreCall("set_chore_done",{chore:s,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(s){await this.choreCall("save_chore_template",{...s})}async removeChoreTemplate(s){await this.choreCall("remove_chore_template",{template:s})}async choreCall(s,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:ze,service:s,service_data:e})}catch(t){throw Dt(t)}}};var Ps={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Es=n=>(...s)=>({_$litDirective$:n,values:s}),ct=class{constructor(s){}get _$AU(){return this._$AM._$AU}_$AT(s,e,t){this._$Ct=s,this._$AM=e,this._$Ci=t}_$AS(s,e){return this.update(s,e)}update(s,e){return this.render(...e)}};var{I:vn}=$s,Ss=n=>n;var Ms=()=>document.createComment(""),Re=(n,s,e)=>{let t=n._$AA.parentNode,i=s===void 0?n._$AB:s._$AA;if(e===void 0){let r=t.insertBefore(Ms(),i),a=t.insertBefore(Ms(),i);e=new vn(r,a,n,n.options)}else{let r=e._$AB.nextSibling,a=e._$AM,o=a!==n;if(o){let l;e._$AQ?.(n),e._$AM=n,e._$AP!==void 0&&(l=n._$AU)!==a._$AU&&e._$AP(l)}if(r!==i||o){let l=e._$AA;for(;l!==r;){let c=Ss(l).nextSibling;Ss(t).insertBefore(l,i),l=c}}}return e},ue=(n,s,e=n)=>(n._$AI(s,e),n),yn={},Ds=(n,s=yn)=>n._$AH=s,zs=n=>n._$AH,ht=n=>{n._$AR(),n._$AA.remove()};var Rs=(n,s,e)=>{let t=new Map;for(let i=s;i<=e;i++)t.set(n[i],i);return t},te=Es(class extends ct{constructor(n){if(super(n),n.type!==Ps.CHILD)throw Error("repeat() can only be used in text expressions")}dt(n,s,e){let t;e===void 0?e=s:s!==void 0&&(t=s);let i=[],r=[],a=0;for(let o of n)i[a]=t?t(o,a):a,r[a]=e(o,a),a++;return{values:r,keys:i}}render(n,s,e){return this.dt(n,s,e).values}update(n,[s,e,t]){let i=zs(n),{values:r,keys:a}=this.dt(s,e,t);if(!Array.isArray(i))return this.ut=a,r;let o=this.ut??=[],l=[],c,g,h=0,f=i.length-1,v=0,y=r.length-1;for(;h<=f&&v<=y;)if(i[h]===null)h++;else if(i[f]===null)f--;else if(o[h]===a[v])l[v]=ue(i[h],r[v]),h++,v++;else if(o[f]===a[y])l[y]=ue(i[f],r[y]),f--,y--;else if(o[h]===a[y])l[y]=ue(i[h],r[y]),Re(n,l[y+1],i[h]),h++,y--;else if(o[f]===a[v])l[v]=ue(i[f],r[v]),Re(n,i[h],i[f]),f--,v++;else if(c===void 0&&(c=Rs(a,v,y),g=Rs(o,h,f)),c.has(o[h]))if(c.has(o[f])){let p=g.get(a[v]),b=p!==void 0?i[p]:null;if(b===null){let $=Re(n,i[h]);ue($,r[v]),l[v]=$}else l[v]=ue(b,r[v]),Re(n,i[h],b),i[p]=null;v++}else ht(i[f]),f--;else ht(i[h]),h++;for(;v<=y;){let p=Re(n,l[y+1]);ue(p,r[v]),l[v++]=p}for(;h<=f;){let p=i[h++];p!==null&&ht(p)}return this.ut=a,Ds(n,l),de}});var ut=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function L(n){return ut[(n%ut.length+ut.length)%ut.length]}var Ns="#23272E",Is="35,39,46";var $n=3,xt=36,zt=12,wn=8,Rt=60,Nt=10,ft=30,It=10,kn=150,Cn=200,bt=1.4;function Bt(n,s){let e=Math.max(kn,Cn/bt);return Math.ceil(Rt+Math.max(0,n-1)*Nt+ft+Math.max(0,s-1)*It+e*(n+bt*s))}function Pe(n){return n.people?n.people.kids.map(s=>s.id):n.days.length?Object.keys(n.days[0].kids):[]}function ge(n){return n.people?n.people.drivers.map(s=>s.id):n.days.length?Object.keys(n.days[0].drivers):[]}function J(n){return new Map(Pe(n).map((s,e)=>[s,L(e)]))}function Z(n,s){let e=n.people?.kids.find(t=>t.id===s);if(e)return e.name;for(let t of n.days)if(t.kids[s])return t.kids[s].name;return s}function fe(n,s){let e=n.people?.drivers.find(t=>t.id===s);if(e)return e.name;for(let t of n.days)if(t.drivers[s])return t.drivers[s].name;return s}function Ot(n,s){return s==="none"?"Not needed":ge(n).includes(s)?fe(n,s):s}function _n(n){let s=new Map([["home","Home"]]);for(let e of n.days)for(let t of e.events)s.set(t.place,t.short_place||t.place_name||t.place);return s}function mt(n,s){return s?n.get(s)??(s.split(",")[0]?.trim()||s):""}function gt(n,s){let e=[];for(let t of n)t.type==="drive"?(e.length||e.push(mt(s,t.from)),e.push(mt(s,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(mt(s,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function An(n){let s=n.map(a=>({...a,col:0,cols:1})).sort((a,o)=>a.s-o.s||o.en-a.en),e=[],t=[],i=-1/0,r=()=>{for(let a of e)a.cols=t.length;e=[],t=[]};for(let a of s){a.s>=i&&(r(),i=-1/0);let o=t.findIndex(l=>l<=a.s);o<0?(o=t.length,t.push(a.en)):t[o]=a.en,a.col=o,e.push(a),i=Math.max(i,a.en)}return r(),s}function Tn(n,s){if(!n.length)return 0;if(s<=n[0].t)return n[0].y;for(let e=0;e<n.length-1;e++){let t=n[e],i=n[e+1];if(s<=i.t)return i.t===t.t?t.y:Math.round(t.y+(s-t.t)/(i.t-t.t)*(i.y-t.y))}return n[n.length-1].y}function Pn(n,s){if(!n.length)return 0;if(s<=n[0].y)return n[0].t;for(let e=0;e<n.length-1;e++){let t=n[e],i=n[e+1];if(s<=i.y)return i.y===t.y?t.t:t.t+(s-t.y)/(i.y-t.y)*(i.t-t.t)}return n[n.length-1].t}function Os(n,s){return Tn(n.anchors,s)}function Hs(n,s){return Pn(n.anchors,s)}function En(n,s){let e=Pe(n),t=ge(n),i=Math.max(s,Bt(e.length,t.length)),a=(i-Rt-Math.max(0,e.length-1)*Nt-ft-Math.max(0,t.length-1)*It)/(e.length+bt*t.length||1),o=Math.floor(a),l=Math.floor(a*bt),c=new Map;for(let y of n.days)for(let p of y.events){let b=c.get(p.kid)??[];b.some($=>$.event_id===p.event_id&&$.calendar_id===p.calendar_id)||b.push(p),c.set(p.kid,b)}let g=J(n),h=[],f=Rt;e.forEach((y,p)=>{let b=c.get(y)??[],$=n.days.some(x=>x.events.some(S=>S.kid===y&&(S.sides.includes("drop")&&S.drop===""||S.sides.includes("pick")&&S.pick==="")));h.push({id:y,kind:"kid",x:f,w:o,name:Z(n,y),dot:g.get(y).color,rgb:g.get(y).rgb,sub:`${$?"Needs a ride · ":""}${b.length} this week`,subWarn:$}),f+=o+(p<e.length-1?Nt:0)});let v=f+ft/2;return f+=ft,t.forEach((y,p)=>{let b=0,$=0;for(let x of n.days){let S=x.drivers[y];S&&(b+=S.outings.length,$+=S.drive??0)}h.push({id:y,kind:"driver",x:f,w:l,name:fe(n,y),dot:Ns,rgb:Is,sub:`${b} ${b===1?"trip":"trips"} this week · ${Ye($)} driving`,subWarn:!1}),f+=l+(p<t.length-1?It:0)}),{columns:h,sepX:v,width:i}}function Sn(n,s){let e=n.trim();if(!s||e.length<=s.length||e.slice(0,s.length).localeCompare(s,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(s.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let a=i.slice(r[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Ls(n,s){let e=n.start<=0,t=n.end>=1440;return e&&t?`${n.title} · all day`:t?`${n.title} from ${C(n.start)}`:e||!s?`${n.title} until ${C(n.end)}`:`${n.title} ${C(n.start)}–${C(n.end)}`}function Ht(n){return n.issues.filter(s=>s.level==="problem").length+n.clashes.length}function Ut(n,s){let e=he(s,n);return e===0?"Today":e===1?"Tomorrow":""}function V(n,s=0){return n==null||!Number.isFinite(n)?s:n}function Lt(n,s,e=7){let t=Math.max(8,Math.floor(s/e)),i=1,r=0;for(let a of n.split(/\s+/).filter(Boolean)){let o=a.length;for(r===0?r=o:r+1+o<=t?r+=1+o:(i++,r=o);r>t;)i++,r-=t}return i}var Us=25,js=15,jt=3;function Bs(n){return Math.max(0,Math.min(jt,Math.floor((n-Us)/js)))}function Mn(n,s){let e=Math.min(jt,Lt(n,s-19,6.6));return Us+e*js+2}function Dn(n,s){let e=s-23,t=`${C(n.start)}–${C(n.end)}`+(n.arrive_by!=null?` · arrive ${C(n.arrive_by)}`:""),i=33+Lt(t,e,6.6)*16;for(let r of[n.lines.drop,n.lines.pick])r&&(i+=2+Lt(r.text,e,7)*16);return i+4}function Ws(n,s,e,t){let i=s==="compact",{columns:r,sepX:a,width:o}=En(n,e),l=new Map(r.map(x=>[x.id,x])),c=Pe(n),g=ge(n),h=[...c,...g],f=J(n),v=_n(n),y=x=>Z(n,x),p=x=>fe(n,x),b={mode:s,width:o,height:0,columns:r,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},$=0;return n.days.forEach((x,S)=>{let G=S*1440,P=new Map(x.events.map(u=>[u.id,u])),U=u=>u&&P.has(u)?{day:x.date,event:u}:null,se=Ht(x),be=x.events.length,Ee=Ut(x.date,t.date);b.dayHeads.push({date:x.date,y:$,label:Ae(x.date),tag:Ee,sub:(be?`${be} ${be===1?"activity":"activities"}`:"Nothing scheduled")+(se?` · ${se} to sort out`:""),warn:se>0}),b.anchors.push({t:G,y:$});let pe=$+xt+zt,Le=g.flatMap(u=>x.drivers[u]?.outings??[]);if(!be&&!Le.length){b.empties.push({key:x.date,y:pe,text:"Nothing planned"}),$=pe+40,b.anchors.push({t:G+1439,y:$});return}let M=(u,T,_,E,A,D,k)=>{let j=f.get(u.kid)??L(0),W=u.lines;return{key:`${x.date}|card|${u.id}`,x:T,y:_,w:E,h:A,target:{day:x.date,event:u.id},event:u,color:j,kidName:y(u.kid),clash:D,stayed:u.stay&&g.includes(u.drop),skipped:u.attending===!1,title:Sn(u.title,y(u.kid)),time:`${C(u.start)}–${C(u.end)}`+(u.arrive_by!=null?` · arrive ${C(u.arrive_by)}`:""),drop:W.drop,pick:W.pick,showDrop:!!W.drop&&(k||A>=56),showPick:!!W.pick&&(k||A>=74),wrap:k,aria:`${y(u.kid)}, ${u.title} ${C(u.start)} to ${C(u.end)}. `+(u.attending===!1&&!W.drop?"Not attending. ":"")+[W.drop,W.pick].filter(oe=>!!oe).map(oe=>oe.text).join(". ")}},ne=u=>{let T=x.rides[u];return T?(x.drivers[T.driver]?.segments??[]).filter(E=>E.type!=="home"&&E.kids.includes(T.kid)&&V(E.start)>=V(T.start)&&V(E.end)<=V(T.end)):[]},N=u=>{let T=x.rides[u];if(!T)return null;let _=T.serves.find(E=>P.get(E)?.kid===T.kid);return U(_??T.serves[0])},ee=new Map;for(let u of x.issues)u.level!=="problem"||!u.event||(u.kind==="late"&&ee.set(u.event,`${Math.round(V(u.minutes))} min late`),u.kind==="waiting"&&ee.set(`${u.event}|pick`,`Waits ${Math.round(V(u.minutes))} min`));if(!i){let u=1/0,T=-1/0;for(let k of x.events)u=Math.min(u,k.start-20,k.arrive_by!=null?k.arrive_by-10:1/0),T=Math.max(T,k.end+20);for(let k of Le)k.start!=null&&(u=Math.min(u,k.start)),k.end!=null&&(T=Math.max(T,k.end));x.date===t.date&&Number.isFinite(u)&&t.minutes>u-60&&t.minutes<T&&(u=Math.min(u,t.minutes-15));let _=Number.isFinite(u)?Math.floor((u-5)/30)*30:900,E=Number.isFinite(T)?Math.ceil((T+5)/30)*30:960,A=k=>Math.round(pe+(Math.max(_,Math.min(E,k))-_)*$n);b.anchors.push({t:G+_,y:A(_)},{t:G+E,y:A(E)});for(let k of c){let j=l.get(k),W=f.get(k),oe=(x.kids[k]?.items??[]).filter(z=>z.start!=null&&z.end!=null).map(z=>({item:z,s:V(z.start),en:V(z.end)}));for(let z of An(oe)){let w=j.w/z.cols,B=Math.round(j.x+z.col*w),I=Math.round(w-(z.cols>1?4:0)),q=A(z.s),ce=z.item;if(ce.type==="act"){let K=P.get(ce.event??"");if(!K)continue;let es=Math.max(30,A(z.en)-q);if(b.cards.push(M(K,B,q,I,es,ce.clash,!1)),K.arrive_by!=null&&K.start-K.arrive_by>=5){let ns=A(K.arrive_by);b.preps.push({key:`${x.date}|prep|${K.id}`,x:B,y:ns,w:I,h:q-ns+6,color:W,label:`Arrive by ${C(K.arrive_by)}`})}let ts=ee.get(K.id);ts&&b.marks.push({key:`${x.date}|late|${K.id}`,x:B+I-4,y:q+4,text:ts,right:!0});let ss=ee.get(`${K.id}|pick`);ss&&b.marks.push({key:`${x.date}|wait|${K.id}`,x:B+4,y:q+es+2,text:ss,right:!1});continue}let F=x.rides[ce.ride??-1];if(!F)continue;let xe=Math.max(22,A(z.en)-q),Be=gt(ne(F.index),v),O=p(F.driver);b.rides.push({key:`${x.date}|ride|${F.index}`,x:B,y:q,w:I,h:xe,target:N(F.index),l1:`${F.own?"In":"Along in"} ${O}’s car`,l2:Be.join(" → "),show2:Bs(xe)>0,lines2:Bs(xe),dashed:!F.own,clash:ce.clash,aria:`${y(k)} ${F.own?"in":"riding along in"} ${O}’s car, ${C(V(F.start))} to ${C(V(F.end))}: ${Be.join(" to ")}`});let ve=l.get(F.driver);ve&&b.bands.push({key:`${x.date}|band|${F.index}`,x:B+I,y:q,w:Math.max(0,ve.x+8-(B+I)),h:xe,color:W})}}for(let k of g){let j=l.get(k),W=x.drivers[k];if(!W)continue;let oe=[],z=null;for(let w of W.segments)if(!(w.start==null||w.end==null)){if(w.type==="home"){z=null;continue}if(w.type==="stay"){z=null,oe.push({type:"stay",g:w,s:w.start,en:w.end});continue}z&&z.en===w.start?(z.en=w.end,z.legs.push(w)):(z={type:"trip",s:w.start,en:w.end,legs:[w]},oe.push(z))}for(let w of oe){let B=A(w.s),I=Math.max(24,A(w.en)-B);if(w.type==="stay"){let O=P.get(w.g.event??w.g.serves??""),ve=O?f.get(O.kid)??L(0):L(0),K=w.g.kids.map(y);b.stays.push({key:`${x.date}|stay|${k}|${w.s}`,x:j.x+8,y:B,w:j.w-16,h:I,target:U(O?.id),color:ve,l1:O?`At ${O.title} with ${y(O.kid)}`:"Staying",l2:`until ${C(w.en)}`+(K.length?` · ${K.join(" and ")} too`:"")});continue}let q=w.legs[0],ce=w.legs[w.legs.length-1],F=[];for(let O of w.legs)for(let ve of O.kids)F.includes(ve)||F.push(ve);let xe=ce.type==="drive"&&ce.to==="home",Be=gt(w.legs,v);b.trips.push({key:`${x.date}|trip|${k}|${w.s}`,x:j.x+8,y:B,w:j.w-16,h:I,target:U(w.legs.find(O=>O.serves)?.serves),l1:q.type==="drive"&&q.from==="home"?`Leave ${C(w.s)}`:`From ${mt(v,q.from??q.place)} ${C(w.s)}`,l2:Be.join(" → "),show2:I>=36,l3:xe?`Home ${C(w.en)}`:"",show3:xe&&I>=62,stops:null,kids:F.map(O=>(f.get(O)??L(0)).color),bad:w.legs.some(O=>O.overlaps_busy),aria:`${p(k)} drives ${Be.join(" to ")}, ${C(w.s)} to ${C(w.en)}`})}for(let w of W.segments)if(!(!w.overlaps_busy||w.start==null||w.end==null))for(let B of W.busy){let I=Math.max(w.start,B.start),q=Math.min(w.end,B.end);q<=I||b.overlaps.push({key:`${x.date}|overlap|${k}|${I}`,x:j.x+6,y:A(I)-2,w:j.w-12,h:Math.max(8,A(q)-A(I)+4)})}for(let w of W.busy){if(w.end<=_||w.start>=E)continue;let B=A(w.start),I=A(w.end);b.busy.push({key:`${x.date}|busy|${k}|${w.start}`,x:j.x+1,y:B,w:j.w-2,h:I-B,labelY:8,label:Ls(w,!1)})}}let D=-1/0;for(let k=_;k<=E;k+=30)b.grid.push({key:`${x.date}|grid|${k}`,y:A(k),strong:k%60===0}),k%60===0&&A(k)-D>=22&&(b.hours.push({key:`${x.date}|hour|${k}`,y:A(k)-8,label:_s(k)}),D=A(k));x.date===t.date&&t.minutes>_&&t.minutes<E&&(b.now={y:A(t.minutes),label:`Now ${C(t.minutes)}`}),$=A(E)+zt;return}let ie=[];for(let u of c){let T=l.get(u);for(let _ of x.kids[u]?.items??[])if(_.start!=null){if(_.type==="act"){let E=P.get(_.event??"");if(!E)continue;ie.push({col:u,s:_.start,h:Dn(E,T.w),kind:"act",item:_})}else if(!x.rides[_.ride??-1]?.own){let E=x.rides[_.ride??-1],A=E?gt(ne(E.index),v).join(" → "):"";ie.push({col:u,s:_.start,h:Mn(A,T.w),kind:"along",item:_})}}}for(let u of g){let T=x.drivers[u];if(T){for(let _ of T.busy)ie.push({col:u,s:_.start,h:32,kind:"busy",busy:_});for(let _ of T.outings)_.start!=null&&ie.push({col:u,s:_.start,h:30+_.lines.length*16+(_.warn?16:0),kind:"out",out:_})}}ie.sort((u,T)=>u.s-T.s||h.indexOf(u.col)-h.indexOf(T.col));let Se=new Map,R=pe;ie.forEach((u,T)=>{let _=Se.get(u.col),E=Math.max(_!=null?_+wn:pe,R);Se.set(u.col,E+u.h),R=E,b.anchors.push({t:G+u.s,y:E});let A=l.get(u.col);if(u.kind==="busy")b.busy.push({key:`${x.date}|busy|${u.col}|${T}`,x:A.x+1,y:E,w:A.w-2,h:u.h,labelY:8,label:Ls(u.busy,!0)});else if(u.kind==="out"){let D=u.out;b.trips.push({key:`${x.date}|trip|${u.col}|${T}`,x:A.x+8,y:E,w:A.w-16,h:u.h,target:U(D.target),l1:D.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...D.lines.map(k=>({text:k,warn:!1})),...D.warn?[{text:D.warn,warn:!0}]:[]],kids:D.kids.map(k=>(f.get(k)??L(0)).color),bad:!!D.warn,aria:`${p(u.col)}: ${D.lead}. ${D.lines.join(". ")}${D.warn?`. ${D.warn}`:""}`})}else if(u.kind==="act"){let D=P.get(u.item.event??"");b.cards.push(M(D,A.x,E,A.w,u.h,u.item.clash,!0))}else{let D=x.rides[u.item.ride??-1],k=gt(ne(D.index),v),j=p(D.driver);b.rides.push({key:`${x.date}|ride|${D.index}`,x:A.x,y:E,w:A.w,h:u.h,target:N(D.index),l1:`Along with ${j} ${C(V(D.start))}`,l2:k.join(" → "),show2:!0,lines2:jt,dashed:!0,clash:u.item.clash,aria:`${y(u.col)} riding along with ${j}, ${C(V(D.start))} to ${C(V(D.end))}: ${k.join(" to ")}`})}});let re=pe;for(let u of Se.values())re=Math.max(re,u);$=re+zt+6,b.anchors.push({t:G+1439,y:$})}),b.height=$,b}var zn=["","¼","½","¾"];function Te(n){return n.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(s,e)=>{let t=Number(e);if(t>=59.5)return Ye(t);let i=Math.round(t*4),r=Math.floor(i/4),a=zn[i%4];return`${r||!a?r:""}${a} min`})}function qs(n){let s=e=>e?{...e,text:Te(e.text)}:null;return{...n,days:n.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:s(t.lines.drop),pick:s(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,i])=>[t,{...i,outings:i.outings.map(r=>({...r,lines:r.lines.map(Te),warn:r.warn==null?r.warn:Te(r.warn)}))}])),issues:e.issues.map(t=>({...t,title:Te(t.title),body:Te(t.body),note:t.note==null?t.note:Te(t.note),...t.suggestions?{suggestions:t.suggestions.map(i=>({...i,note:Te(i.note)}))}:{}}))}))}}var Rn=2,Nn=48;function Fs(n,s,e=Nn){let t=[],i=0,r=0,a=0,o=0,l=s.minutes+e*60;for(let c of n.days){let g=he(s.date,c.date),h=g===0?"":`${Y(c.date)} · `,f=new Map(c.events.map(p=>[p.id,p])),v=p=>p&&f.has(p)?{day:c.date,event:p}:null,y=(p,b)=>g*1440+(p??f.get(b??"")?.start??0)<l;for(let p of c.issues)if(p.level==="problem"){if(!y(p.at,p.event)){a++,p.kind==="unassigned"&&o++;continue}i++,p.kind==="unassigned"&&r++,t.push({key:`${c.date}|${p.key}`,tone:p.kind==="unassigned"?"unassigned":"problem",title:h+p.title,body:p.body,target:v(p.event),suggestions:(p.suggestions??[]).map(b=>({id:b.id,label:b.label,note:b.note}))})}if(c.clashes.forEach((p,b)=>{if(!y(p.a.start,p.a.event)){a++;return}i++;let $=f.get(p.a.event??""),x=Z(n,p.kid),S=(P,U)=>{let se=v(U);return se?{text:P,target:se}:P},G=[];if(p.b.type==="act"){let P=f.get(p.b.event??"");$&&P&&(G=[S($.title,$.id),` ${C($.start)}–${C($.end)} and `,S(P.title,P.id),` ${C(P.start)}–${C(P.end)} overlap.`])}else{let P=c.rides[p.b.ride??-1];$&&P&&(G=[`${x} is in `,S(`${fe(n,P.driver)}’s car`,P.serves[0]),` ${C(V(p.b.start))}–${C(V(p.b.end))}, during `,S($.title,$.id),"."])}t.push({key:`${c.date}|clash|${b}`,tone:"problem",title:`${h}${x} is double-booked`,body:G.map(P=>typeof P=="string"?P:P.text).join(""),parts:G,target:null,suggestions:[]})}),g>=0&&g<Rn)for(let p of c.issues)p.level!=="heads_up"||!y(p.at,p.event)||t.push({key:`${c.date}|${p.key}`,tone:"heads_up",title:h+p.title,body:p.body,target:v(p.event),suggestions:[]});for(let p of c.events)!p.problems.length||!y(p.start)||t.push({key:`${c.date}|notes|${p.id}`,tone:"heads_up",title:`${h}Check the notes on ${Z(n,p.kid)}’s ${p.title}`,body:`These lines couldn’t be read: ${p.problems.join("; ")}`,target:v(p.id),suggestions:[]})}return{items:t,problems:i,unassigned:r,later:a,laterUnassigned:o}}function Vs(n,s){let e=J(n),t=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of n.days){let a=he(s.date,r.date);if(!(a<0))for(let o of ge(n))for(let l of r.drivers[o]?.outings??[]){if(l.start==null)continue;let c=a*1440+l.start;if(a*1440+V(l.end,l.start)<=s.minutes)continue;let h=c-s.minutes,f={driver:o,name:fe(n,o),date:r.date,ahead:a,start:l.start,inMinutes:h,ongoing:h<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(v=>e.get(v)??L(0)),warn:l.warn,target:l.target&&r.events.some(v=>v.id===l.target)?{day:r.date,event:l.target}:null};(!t||i(f)<i(t)||i(f)===i(t)&&f.inMinutes<t.inMinutes)&&(t=f)}}return t}function Ie(n){return n.state==="done"||n.state==="late"}function Ks(n){return n.state==="open"||n.state==="overdue"}function qt(n,s,e){if(Ie(n)){let t=n.done_at?Ln(n.done_at,s,e):"";return n.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(n.state==="overdue")return n.missed>1?`Missed ${n.missed} times`:n.due?`Missed ${In(n.due,s)}`:"Missed";if(n.state==="upcoming"){let t=n.shows_from??n.due;if(!n.due||!t||n.due<=t)return"";let i=he(s,n.due);return`By ${i===1?"tomorrow":i<7?Y(n.due):Wt(n.due)}`}if(n.due&&n.due>s){let t=he(s,n.due);return t===1?"By tomorrow":`By ${t<7?Y(n.due):Wt(n.due)}`}return n.missed?`Today · missed ${n.missed===1?"once":`${n.missed} times`} before`:"Today"}function In(n,s){let e=he(s,n);return e===0?"today":e===-1?"yesterday":Math.abs(e)<7?Y(n):Wt(n)}function Wt(n){let[s,e,t]=n.split("-").map(Number);return new Date(Date.UTC(s,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Ln(n,s,e){let t=new Date(n);if(Number.isNaN(t.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let r=t.toLocaleDateString("en-CA",{timeZone:i}),a=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return r===s?a:`${Y(r)} ${a}`}function Gs(n,s){let e=[...n.chores].sort((t,i)=>t.order-i.order);return n.kids.map((t,i)=>{let r=e.filter(c=>c.kid===t.id),a=new Map;for(let c of r){if(c.state!=="upcoming")continue;let g=c.shows_from??c.due??n.today;a.set(g,[...a.get(g)??[],c])}let o=r.filter(c=>c.state==="overdue"),l=r.filter(c=>c.state==="open");return{kid:t.id,name:t.name,color:s?.get(t.id)??L(i),overdue:o,now:l,done:r.filter(Ie),later:[...a.entries()].sort(([c],[g])=>c.localeCompare(g)).map(([c,g])=>({date:c,chores:g})),left:o.length+l.length}})}function Ys(n){return[...n.chores].filter(s=>s.state==="overdue"||s.state==="open"&&(s.due==null||s.due<=n.today)).sort((s,e)=>s.state===e.state?s.order-e.order:s.state==="overdue"?-1:1)}function Ft(n){return!n.chores.length&&!n.templates.length}var Ne=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Zs(n){let s=n.trim();if(!s)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of s.split(",")){let[i,r]=t.split("-").map(a=>Ne.indexOf(a.trim()));if(i===void 0||i<0||r!==void 0&&r<0)return null;if(r===void 0)e.add(i);else for(let a=0;a<=(r-i+7)%7;a++)e.add((i+a)%7)}return e}function Vt(n){let s=[...new Set(n)].sort((t,i)=>t-i);if(s.length===0||s.length===7)return"";let e=[];for(let t of s){let i=e.at(-1);i&&i.at(-1)===t-1?i.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${Ne[t[0]]}-${Ne[t.at(-1)]}`]:t.map(i=>Ne[i])).join(", ")}var Ze="none";function vt(n){return n==="daily"?"":"Any"}function Xs(n=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:n,take_turns:!1,days:"",every:1,paused:!1}}function Js(n){return{template:n.id,repeats:n.repeats,title:n.title,icon:n.icon,details:n.details??"",who:[...n.who],take_turns:!!n.take_turns,days:n.days??vt(n.repeats),every:n.every&&n.every>0?n.every:1,paused:n.paused}}function Kt(n){return n.title.trim()?n.who.length?n.days===Ze?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Qs(n){return{...n.template?{template:n.template}:{},repeats:n.repeats,title:n.title.trim(),icon:n.icon??"",details:n.details.trim(),who:n.who,take_turns:n.take_turns&&n.who.length>1,days:n.days,every:n.every,paused:n.paused}}function Gt(n){let s=n%100;return s>=11&&s<=13?`${n}th`:`${n}${{1:"st",2:"nd",3:"rd"}[n%10]??"th"}`}function Yt(n,s,e=1){let t={daily:"day",weekly:"week",monthly:"month"}[n],i=e>1?`every ${e} ${t}s`:`each ${t}`,r=s.trim();if(n==="daily"){let l=r.replace(/-/g,"–");return e>1?l?`${l}, every ${e} days`:`Every ${e} days`:l||"Every day"}if(!r||r.toLowerCase()==="any")return`Sometime ${i}`;if(n==="weekly")return`${r.replace(/-/g,"–")} ${i}`;let o=`${r.split(",").map(l=>{let c=l.trim();return c.toLowerCase()==="last"?"the last day":/^\d+$/.test(c)?`the ${Gt(Number(c))}`:`the ${c}`}).join(" and ")} ${i}`;return o[0].toUpperCase()+o.slice(1)}function Zt(n,s,e=!1){let t=n.map(r=>s.find(a=>a.id===r)?.name??r);if(!t.length)return"Nobody yet";let i=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${i} take turns`:i}function Xt(n){let s=n.indexOf(":"),e=s<0?n:n.slice(0,s),t=s<0?"":n.slice(s+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}var Bn={timeline:"timeline",full:"timeline",compact:"compact"};function Jt(n){let s=new URLSearchParams(n),e={},t=Bn[(s.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((s.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(s.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(s.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores")&&(e.page=i),e}var en=ye`
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
`;var tn="mydashlight.rides.mode",On=1100,Hn=440,Un=700,jn=3*6e4,Wn=1200;function qn(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Qt=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Fn=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Vn=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"];function Kn(n,s){let e={daily:"day",weekly:"week",monthly:"month"}[n];return s<=1?`Every ${e}`:s===2?`Every other ${e}`:`Every ${s} ${e}s${n==="monthly"&&s===3?" (quarterly)":""}`}function me(n){let s=/\p{L}|\p{N}/u.exec(n);return s?s[0].toUpperCase():"?"}function Gn(n,s){return Ut(n,s)||Ae(n).split(",")[0]}function Yn(n){let s=n.map(e=>`${e}’s`);return s.length<2?s[0]??"":`${s.slice(0,-1).join(", ")} or ${s[s.length-1]}`}function Zn(){try{return localStorage.getItem(tn)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Xn(n){try{localStorage.setItem(tn,n)}catch{}}function yt(n){return n.days.every(s=>!s.events.length)}var Xe=class extends X{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Jt(location.search).view;this.urlPage=Jt(location.search).page;this.stopChores=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let i=e.clientX-t.x,r=e.clientY-t.y;if(!t.moved){if(Math.abs(i)+Math.abs(r)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-r,t.el.scrollLeft=t.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},jn))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Zn(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.backend&&(this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let i of e.chores)t.has(i.id)&&Ie(i)===t.get(i.id)&&t.delete(i.id);for(let i of t.keys())e.chores.some(r=>r.id===i)||t.delete(i);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=qs(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<On)return!1;let e=this.plan;return!e||this.width-Hn>=Bt(Pe(e).length,ge(e).length)}today(){return Ge(this.plan?.time_zone??qn())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),i=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=Ws(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let i=this.scroller;if(!i||!this.board)return;let r=this.board.dayHeads.find(a=>a.date===t)?.y??0;i.scrollTop=Math.max(r,Os(this.board,e)-xt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),a=t.days[r];if(!a)return;let o=1/0;if(this.mode==="timeline"){for(let l of a.events)o=Math.min(o,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let c of l.outings)c.start!=null&&(o=Math.min(o,c.start))}this.scrollToTime(r*1440+(Number.isFinite(o)?Math.max(0,o-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,i=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=t+1&&(i=c);let r=this.renderRoot,a=r.querySelector(".pinned .label"),o=r.querySelector(".pinned .tag"),l=r.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),o&&(o.textContent!==i.tag&&(o.textContent=i.tag),o.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let c of r.querySelectorAll(".day-tile"))c.classList.toggle("in-view",c.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),r=new Map(this.choreDraft);r.set(e.id,i),this.choreDraft=r;try{await this.backend.setChoreDone(e.id,i,t&&t!==e.kid?t:void 0)}catch(a){let o=new Map(this.choreDraft);o.delete(e.id),this.choreDraft=o;let l=a instanceof H?a:new H("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??Ie(e)}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?Js(e):Xs(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Kt(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Qs(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let i=t instanceof H?t:new H("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let i=t instanceof H?t:new H("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?Hs(this.board,t.scrollTop+xt+4):null,this.mode=e,this.urlView||Xn(e)}findEvent(e){let t=this.plan?.days.find(r=>r.date===e.day),i=t?.events.find(r=>r.id===e.event);return t&&i?{day:t,event:i}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),i=this.dayIndexOf(e.day);!t||i<0||this.scrollToTime(i*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,i){if(!this.pending){this.pending={key:e,value:t};try{await i()}catch(r){let a=r instanceof H?r:new H("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,t,i){if(!this.backend)return;let r=this.backend;this.save(`${t}`,i,()=>r.setRide(e.id,t,i,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let i=this.backend;this.save("attending",t,()=>i.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t){if(!this.backend)return;let i=this.backend,r=e.along.includes(t)?e.along.filter(a=>a!==t):[...e.along,t];this.save("along",r,()=>i.setTakeAlong(e.id,r,this.scope))}nudgeArrive(e,t){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;t<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Wn)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let i=this.findEvent(t);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,a=i.event.id,o=this.scope;this.save("arrive",e,()=>r.setArriveBy(a,e,o)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),i=e?Fs(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?Ys(this.chores).filter(h=>!this.choreDone(h)):[],o=this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",c=d`<aside class="panel" aria-label=${l}>
      ${o??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,g=this.page==="rides";return d`
      <div class="app ${r?"wide":this.width<Un?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${g&&e?this.renderWeek(e):m}
          ${g?this.renderBanner(e):m}
          <main>
            ${g?d`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?yt(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:d`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor)?d`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${c}`:m}
          </main>
        </div>
        ${r?c:m}
        ${this.toast?d`<div class="toast" role="status">${this.toast}</div>`:m}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,i){let r=t.problems+i;this.tick;let a=this.today(),o="";if(e){let f=e.time_zone,v=new Date(e.updated);this.error?o=d`<span class="bad">Can’t reach Home Assistant · showing the plan from ${dt(v,new Date,f)}</span>`:e.status&&!e.status.ok?o=d`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${dt(v,new Date,f)}</span>`:this.backend?.live||(o=`Updated ${dt(v,new Date,f)}`)}let l=(f,v,y,p)=>d`
      <button type="button" class="seg-btn" title=${p} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${y}<span class="seg-label">${v}</span>
      </button>
    `,c=(f,v,y)=>d`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${y}<span class="seg-label">${v}</span>
      </button>
    `,g=Ke(a.minutes),h=!!e&&yt(e);return d`
      <header>
        ${this.showMenu?d`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Q`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:m}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ae(a.date)}, ${g}`}>
            <span class="hm">${g.slice(0,-3)}</span><span class="ampm">${g.slice(-2)}</span>
          </h1>
          <p class="today-line">${Ae(a.date)}</p>
          ${o?d`<p class="status">${o}</p>`:m}
        </div>
        ${e&&!h?this.renderNext(e,Vs(e,a),t):m}
        <div class="controls">
          ${this.wide||h&&!i?m:d`<button type="button" class="attn-btn ${r?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${r}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?m:d`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",Q`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",Q`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${c("rides","Rides",Q`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${c("chores","Chores",Q`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,i){if(!t){let c=this.today().date,g=i.unassigned,h=i.laterUnassigned;if(g){let v=d`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${g} ${g===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?d`<div class="next idle needs">${v}</div>`:d`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${v}</button>`}if(h)return d`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let f=e.days.some(v=>v.date>=c&&v.events.length);return d`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let r;t.ongoing?r="On the road now":t.ahead===0?r=t.inMinutes<180?`Next trip · in ${Ye(t.inMinutes)}`:"Next trip · later today":t.ahead===1?r="Next trip · tomorrow":r=`Next trip · ${Y(t.date)}`;let a=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,o=d`
      <span class="next-eyebrow">${r}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${me(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(c=>d`<span class="kid-dot" style="background:${c.color}"></span>`)}</span>
      </span>
      ${t.warn?d`<span class="next-stop warn">${t.warn}</span>`:t.stop?d`<span class="next-stop">${t.stop}</span>`:m}
    `,l=`next ${t.ongoing?"ongoing":a?"soon":""}`;return t.target?d`<button type="button" class=${l} @click=${()=>this.open(t.target)}>${o}</button>`:d`<div class=${l}>${o}</div>`}renderWeek(e){let t=this.today().date,i=J(e);return d`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let a=Ht(r),o=r.events.length,l=r.events.slice(0,6).map(g=>i.get(g.kid)?.color??L(0).color),c=`${Ae(r.date)}: ${o?`${o} ${o===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return d`<button
          type="button"
          class="day-tile ${r.date===t?"today":""}"
          data-date=${r.date}
          aria-label=${c}
          @click=${()=>this.goToDay(r.date)}
        >
          <span class="dt-wd">${r.date===t?"Today":Y(r.date)}</span>
          <span class="dt-num">${Number(r.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(g=>d`<span class="dt-dot" style="background:${g}"></span>`):d`<span class="dt-free">free</span>`}
            ${o>6?d`<span class="dt-more">+${o-6}</span>`:m}
          </span>
          ${a?d`<span class="dt-badge" aria-hidden="true">${a}</span>`:m}
        </button>`})}
    </nav>`}renderQuiet(e){let t=Pe(e),i=ge(e),r=J(e),a=t.map(o=>Z(e,o));return d`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((o,l)=>Q`<circle cx=${50+l*30} cy="80" r="11" fill=${r.get(o).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Yn(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(o=>{let l=r.get(o);return d`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${me(Z(e,o))}</span>
            <span class="qw-name">${Z(e,o)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(o=>d`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${me(fe(e,o))}</span>
            <span class="qw-name">${fe(e,o)}</span>
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
              <span class="avatar ${o.kind}" aria-hidden="true">${me(o.name)}</span>
              <span class="ch-text">
                <span class="name">${o.name}</span>
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
          ${te(e.bands,o=>o.key,o=>d`<div
                class="band"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:rgba(${o.color.rgb},0.10);border-color:rgba(${o.color.rgb},0.45)"
              ></div>`)}
          ${te(e.busy,o=>o.key,o=>d`<div class="busy" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px">
                <span style="top:${o.labelY}px">${o.label}</span>
              </div>`)}
          ${te(e.preps,o=>o.key,o=>d`<div
                class="prep"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:rgba(${o.color.rgb},0.07);color:${o.color.ink}"
              >
                ${o.label}
              </div>`)}
          ${te(e.cards,o=>o.key,o=>{let l=o.color,c=o.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:o.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return d`<button
                type="button"
                class="card ${o.wrap?"wrap":""} ${i(o.target)?"sel":""} ${o.clash?"clash":""} ${o.skipped?"skipped":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:${c};border-color:${o.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(o.target)}
              >
                <span class="top">
                  <span class="title">${o.title}</span>
                  <span class="time">${o.time}</span>
                  ${o.showDrop&&o.drop?d`<span class="line tone-${o.drop.tone}">${o.drop.text}</span>`:m}
                </span>
                ${o.showPick&&o.pick?d`<span class="line tone-${o.pick.tone}">${o.pick.text}</span>`:m}
              </button>`})}
          ${te(e.rides,o=>o.key,o=>d`<button
                type="button"
                class="ride ${o.dashed?"dashed":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}</span>${o.show2?d`<span class="l2" style="-webkit-line-clamp:${o.lines2}">${o.l2}</span>`:m}
              </button>`)}
          ${te(e.stays,o=>o.key,o=>d`<button
                type="button"
                class="stay"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:repeating-linear-gradient(135deg, rgba(${o.color.rgb},0.28) 0px, rgba(${o.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1" style="color:${o.color.ink}">${o.l1}</span><span class="l2">${o.l2}</span>
              </button>`)}
          ${te(e.trips,o=>o.key,o=>d`<button
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
          ${te(e.overlaps,o=>o.key,o=>d`<div class="overlap" aria-hidden="true" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`)}
          ${te(e.marks,o=>o.key,o=>d`<span class="mark" style="left:${o.x}px;top:${o.y}px;${o.right?"transform:translateX(-100%)":""}">${o.text}</span>`)}
          ${e.now?d`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:m}
        </div>
      </div>
    `}renderAttention(e,t){let{items:i,problems:r,later:a}=e,o=this.plan,l=r+t.length,c=this.chores,g=!!c&&!Ft(c);return d`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?m:d`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${g?d`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?d`<div class="attn-chores">${t.map(h=>this.renderChoreRow(h,!0))}</div>`:d`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:d`<p class="panel-sub">Rides in the next two days</p>`}
      ${o&&!r?d`<div class="all-clear">
            <span class="check" aria-hidden="true">${Q`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${yt(o)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
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
      ${this.wide&&o&&!yt(o)&&this.page==="rides"?this.renderLegend():m}
    `}renderChoreRow(e,t=!1){let i=this.chores,r=this.choreDone(e),a=i.kids.findIndex($=>$.id===e.kid),o=(this.plan?J(this.plan).get(e.kid):void 0)??L(Math.max(0,a)),l=i.kids[a]?.name??"",c=r===Ie(e)?e:{...e,state:r?"done":"open",done_at:r?new Date().toISOString():null},g=r&&c.done_by&&c.done_by!==e.kid?i.people?.find($=>$.id===c.done_by)?.name??c.done_by_name??null:null,h=`${qt(c,i.today,i.time_zone)}${g?` · by ${g}`:""}`,f=r||Ks(e),v=`${t?`${l}: `:""}${e.title}. ${h?`${h}. `:""}${r?"Done. Tap to undo.":"Tap when it’s done."}`,y=d`<span class="box" aria-hidden="true"
        >${r?Q`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:m}</span
      >
      ${e.icon?d`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:m}
      <span class="chore-text">
        <span class="chore-title">${t?d`<span class="chore-kid">${l}</span> · `:m}${e.title}</span>
        ${h?d`<span class="chore-note">${h}</span>`:m}
      </span>`,p=`chore ${r?"done":""} ${e.state==="overdue"&&!r?"overdue":""} ${f?"":"later"}`,b=`--c:${o.color};--rgb:${o.rgb};--k:${o.ink}`;return f?d`<button type="button" class=${p} style=${b} aria-pressed=${r?"true":"false"} aria-label=${v} @click=${()=>this.tapChore(e)}>
          ${y}
        </button>`:d`<div class=${p} style=${b}>${y}</div>`}renderChores(){let e=this.chores;if(e===void 0)return d`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return d`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return d`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Ft(e))return d`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Qt} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore templates: Daily</strong> (or Weekly or Monthly). It
          shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(a=>a.problems.length),i=t.length?d`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(a=>this.renderTemplateRow(a))}</div>
        </section>`:m,r=Gs(e,this.plan?J(this.plan):void 0);return d`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Qt} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Fn} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${r.length}">
        ${r.map(a=>{let o=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return d`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${me(a.name)}</span>
              <span class="ch-text">
                <span class="name">${a.name}</span>
                <span class="sub">${o?`${o} to do`:a.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
            </div>
            ${a.overdue.length?d`<h3 class="chore-group overdue">Missed</h3>
                  ${a.overdue.map(l=>this.renderChoreRow(l))}`:m}
            ${a.now.length?d`<h3 class="chore-group">To do</h3>
                  ${a.now.map(l=>this.renderChoreRow(l))}`:m}
            ${a.done.length?d`<h3 class="chore-group">Done</h3>
                  ${a.done.map(l=>this.renderChoreRow(l))}`:m}
            ${a.later.map(l=>d`<h3 class="chore-group">${Gn(l.date,e.today)}</h3>
                ${l.chores.map(c=>this.renderChoreRow(c))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?d`<p class="chore-none">No chores this week.</p>`:m}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,r=this.plan?J(this.plan):void 0,a=this.choreEdit?.template===e.id,o=e.problems.length?d`<span class="tmpl-note bad">${e.problems.map(Xt).join(" · ")} · tap to set up</span>`:d`<span class="tmpl-note">${Zt(e.who,i,e.take_turns)} · ${Yt(e.repeats,e.days??"",e.every??1)}</span>`;return d`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${a?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?d` <span class="tag-paused">Paused</span>`:m}</span>
        ${o}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let c=i.findIndex(h=>h.id===l),g=r?.get(l)??L(Math.max(0,c));return d`<span class="kid-dot" style="background:${g.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day or some days"],["weekly","Weekly"],["monthly","Monthly"]];return d`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Qt} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([i,r])=>{let a=e.templates.filter(o=>o.repeats===i);return a.length?d`<section class="manage-group" aria-label=${r}>
                  <h3 class="chore-group">${r}</h3>
                  <div class="tmpl-list">${a.map(o=>this.renderTemplateRow(o))}</div>
                </section>`:m}):d`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the lists <strong>Chore templates: Daily</strong>, <strong>Weekly</strong> and
        <strong>Monthly</strong>. A task added there by hand shows up here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return d``;let i=t.kids,r=this.plan?J(this.plan):void 0,a=this.choreBusy,o=e.template?t.templates.find(p=>p.id===e.template):void 0,l=Kt(e),c=(o?.problems??[]).filter(p=>p!=="who:"),g=(p,b,$,x=!1)=>d`<button type="button" class="choice ${x?"wide":""}" aria-pressed=${p?"true":"false"} ?disabled=${a} @click=${$}>${b}</button>`,h=(p,b,$,x)=>d`<button type="button" class="chip" aria-pressed=${p?"true":"false"} aria-label=${x??m} ?disabled=${a} @click=${$}>${b}</button>`,f=p=>{p!==e.repeats&&this.changeDraft({repeats:p,days:o&&o.repeats===p?o.days??vt(p):vt(p)})},v=p=>{let b=e.who.includes(p)?e.who.filter($=>$!==p):i.filter($=>$.id===p||e.who.includes($.id)).map($=>$.id);this.changeDraft({who:b})},y;if(e.repeats==="monthly"){let p=e.days.trim(),b=/^\d+$/.test(p)?Number(p):null,$=p&&p.toLowerCase()!=="any"&&p.toLowerCase()!=="last"&&b===null;y=d`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${$?4:3}, minmax(0, 1fr))">
          ${g(p===""||p.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${g(b!==null,"On a date",()=>this.changeDraft({days:String(b??1)}))}
          ${g(p.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${$?g(!0,p,()=>{}):m}
        </div>
        ${b!==null?d`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${a||b<=1} @click=${()=>this.changeDraft({days:String(b-1)})}>−</button>
                <span class="arrive-value">${Gt(b)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${a||b>=31} @click=${()=>this.changeDraft({days:String(b+1)})}>+</button>
              </span>
            </div>`:d`<p class="field-hint">${p.toLowerCase()==="last"?"Due on the month’s last day.":$?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else{let p=e.repeats==="weekly"&&(e.days===""||e.days.toLowerCase()==="any"),b=e.days===Ze?new Set:p?new Set:Zs(e.days)??new Set,$=x=>{let S=new Set(b);S.has(x)?S.delete(x):S.add(x),e.repeats==="weekly"?this.changeDraft({days:S.size?Vt(S)||"Mon-Sun":"Any"}):this.changeDraft({days:S.size?Vt(S):Ze})};y=d`<div class="field">
        <span class="field-label">${e.repeats==="weekly"?"Which day":"Which days"}</span>
        ${e.repeats==="weekly"?d`<div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
              ${g(p,"Any day that week",()=>this.changeDraft({days:"Any"}))}
              ${g(!p,"On a set day",()=>this.changeDraft({days:p?"Sat":e.days}))}
            </div>`:m}
        ${e.repeats==="daily"||!p?d`<div role="group" aria-label="Days of the week" class="day-chips">
              ${Ne.map((x,S)=>h(b.has(S),x.slice(0,2),()=>$(S),x))}
            </div>`:m}
        ${e.repeats==="daily"?d`<div class="chips">
              ${h(e.days==="","Every day",()=>this.changeDraft({days:""}))}
              ${h(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
              ${h(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
            </div>`:d`<p class="field-hint">${p?"Shows all week, due on Sunday.":"Due that day."}</p>`}
      </div>`}return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?d`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:m}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Zt(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===Ze?"No days picked":Yt(e.repeats,e.days,e.every)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${a} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${c.length?d`<p class="field-hint bad">${c.map(Xt).join(". ")}. Saving fixes it.</p>`:m}
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
          @input=${p=>this.changeDraft({title:p.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${Vn.map(p=>h(e.icon===p,p,()=>this.changeDraft({icon:e.icon===p?null:p}),`Picture ${p}`))}
        </div>
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((p,b)=>{let $=r?.get(p.id)??L(b),x=e.who.includes(p.id);return d`<button type="button" class="who-chip" style="--c:${$.color};--rgb:${$.rgb}" aria-pressed=${x?"true":"false"} ?disabled=${a} @click=${()=>v(p.id)}>
              <span class="avatar" aria-hidden="true">${me(p.name)}</span>${p.name}
            </button>`})}
        </div>
        ${e.who.length>1?d`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${g(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${g(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:m}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(3, minmax(0, 1fr))">
          ${g(e.repeats==="daily","Days",()=>f("daily"))}
          ${g(e.repeats==="weekly","Weekly",()=>f("weekly"))}
          ${g(e.repeats==="monthly","Monthly",()=>f("monthly"))}
        </div>
      </div>
      ${y}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Repeats</span>
          <span class="field-hint">${Kn(e.repeats,e.every)}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${a||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${a||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
      </div>
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${a}
          @input=${p=>this.changeDraft({details:p.target.value})}
        ></textarea>
      </div>
      ${e.template?d`<div class="field">
              ${g(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${a} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:m}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${a?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return d``;let i=t.people?.length?t.people:t.kids.map(h=>({...h,role:"kid"})),r=t.kids.findIndex(h=>h.id===e.kid),a=t.kids[r],o=this.plan?J(this.plan):void 0,l=o?.get(e.kid)??L(Math.max(0,r)),c=i.filter(h=>h.id!==e.kid),g=h=>{let f=t.kids.findIndex(v=>v.id===h.id);return f>=0?(o?.get(h.id)??L(f)).color:"var(--dark)"};return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?d`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:m}${e.title}</span>
          <span class="ed-meta">${a?.name??""} · ${qt(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${me(a?.name??"?")}</span>
          <span>${a?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?d`<div role="group" aria-label="Somebody else" class="done-by-list">
              ${c.map(h=>d`<button type="button" class="done-by" style="--c:${g(h)}" @click=${()=>void this.toggleChore(e,h.id)}>
                  <span class="avatar ${h.role==="parent"?"driver":""}" aria-hidden="true">${me(h.name)}</span>
                  <span>${h.name}</span>
                </button>`)}
            </div>`:d`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Somebody else…</button>`}
      </div>
    `}renderLegend(){return d`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return d``;let{day:i,event:r}=t,a=ge(e),l=J(e).get(r.kid)??L(0),c=!!this.pending,g=M=>this.pending?.key===M?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let M of e.days)for(let ne of M.events)for(let N of[ne.drop,ne.pick])N&&N!=="none"&&!a.includes(N)&&!h.some(ee=>ee.toLowerCase()===N.toLowerCase())&&h.push(N);let f=M=>{if(!r.sides.includes(M))return m;let ne=g(M),N=ne!==void 0?String(ne):M==="drop"?r.drop:r.pick,ee=N&&N!=="none"&&!a.includes(N)?N:"",ie=R=>this.setRide(r,M,N===R?"":R),Se=[...a.map(R=>[R,Ot(e,R)]),["none","Not needed"]];return d`<div class="field">
        <span class="field-label">${M==="drop"?"Drop-off":"Pick-up"} ${N===""?d`<span class="nobody">· nobody yet</span>`:m}</span>
        <div role="group" aria-label=${M==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${Se.length}, minmax(0, 1fr))">
          ${Se.map(([R,re])=>d`<button type="button" class="choice" aria-pressed=${N===R?"true":"false"} ?disabled=${c} @click=${()=>ie(R)}>
                ${re}
              </button>`)}
        </div>
        ${h.length?d`<div role="group" aria-label=${M==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(R=>d`<button type="button" class="chip" aria-pressed=${N.toLowerCase()===R.toLowerCase()?"true":"false"} ?disabled=${c} @click=${()=>ie(R)}>
                    ${R}
                  </button>`)}
            </div>`:m}
        <input
          type="text"
          .value=${ee&&!h.some(R=>R.toLowerCase()===ee.toLowerCase())?ee:""}
          ?disabled=${c}
          aria-label=${M==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${R=>{let re=R.target.value.trim();re&&re!==N&&this.setRide(r,M,re)}}
          @keydown=${R=>{R.key==="Enter"&&R.target.blur()}}
        />
      </div>`},v=g("stay"),y=v!==void 0?!!v:r.stay,p=r.drop===r.pick&&a.includes(r.drop),b=g("along"),$=b!==void 0?b:r.along,x=Pe(e).filter(M=>M!==r.kid),S=a.includes(r.drop)&&r.sides.includes("drop"),G=g("arrive"),P=this.arriveDraft!==void 0?this.arriveDraft:G!==void 0?G:r.arrive_by,U=[],se=M=>M==="none"?"Not needed":Ot(e,M);r.drop!==""&&U.push(`Drop-off: ${se(r.drop)}`),r.pick!==""&&U.push(`Pick-up: ${se(r.pick)}`),r.stay&&U.push("Stay: yes"),r.along.length&&U.push(`Take along: ${r.along.map(M=>Z(e,M)).join(", ")}`),r.arrive_by!=null&&U.push(`Arrive by: ${Ke(r.arrive_by)}`);let be=g("attending"),Ee=be!==void 0?!!be:r.attending!==!1;r.attending===!1&&U.splice(0,U.length,"Attending: no");let pe=i.date===this.today().date?"":`${Y(i.date)} · `,Le=d`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${Z(e,r.kid)} · ${r.title}</span>
          <span class="ed-meta">${pe}${C(r.start)}–${C(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return r.where==="home"?d`${Le}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${Z(e,r.kid)} can’t get home in time, the board shows it as a clash.</p>`:d`
      ${Le}
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
        <span class="field-label">${Z(e,r.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${Ee?"true":"false"} ?disabled=${c} @click=${()=>this.setAttending(r,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${Ee?"false":"true"} ?disabled=${c} @click=${()=>this.setAttending(r,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${Ee?d`${r.where==="anywhere"?d`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:m}
            ${f("drop")} ${f("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${y?"true":"false"} ?disabled=${!p||c} @click=${()=>this.toggleStay(r)}>
          ${p?y?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${S&&x.length?d`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${x.map(M=>d`<button type="button" class="chip" aria-pressed=${$.includes(M)?"true":"false"} ?disabled=${c} @click=${()=>this.toggleAlong(r,M)}>
                  ${Z(e,M)}
                </button>`)}
            </div>
          </div>`:m}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${P!=null?`${r.start-P} min before it starts`:`Aims for a few minutes before ${C(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${c} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${P!=null?C(P):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${c||P==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${P!=null?d`<button type="button" class="chip clear" ?disabled=${c} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:m}
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
      ${Ee?d`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:m}
    `}};Xe.styles=en,Xe.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Xe);var Je=class extends X{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=Cs(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(Fe);let t=e.toString();history.replaceState(history.state,"",`${location.pathname}${t?`?${t}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new pt(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return d`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?d`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:m}`}};Je.styles=ye`
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
  `,Je.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",Je);
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
