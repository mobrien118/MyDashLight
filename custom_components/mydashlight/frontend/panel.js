var Xe=globalThis,Je=Xe.ShadowRoot&&(Xe.ShadyCSS===void 0||Xe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xt=Symbol(),Ft=new WeakMap,Be=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==xt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Je&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Ft.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ft.set(e,t))}return t}toString(){return this.cssText}},Gt=s=>new Be(typeof s=="string"?s:s+"",void 0,xt),ve=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,i,r)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new Be(e,s,xt)},Yt=(s,t)=>{if(Je)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),i=Xe.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=e.cssText,s.appendChild(n)}},vt=Je?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Gt(e)})(s):s;var{is:qn,defineProperty:Wn,getOwnPropertyDescriptor:Vn,getOwnPropertyNames:Kn,getOwnPropertySymbols:Fn,getPrototypeOf:Gn}=Object,Qe=globalThis,Zt=Qe.trustedTypes,Yn=Zt?Zt.emptyScript:"",Zn=Qe.reactiveElementPolyfillSupport,Le=(s,t)=>s,yt={toAttribute(s,t){switch(t){case Boolean:s=s?Yn:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Jt=(s,t)=>!qn(s,t),Xt={attribute:!0,type:String,converter:yt,reflect:!1,useDefault:!1,hasChanged:Jt};Symbol.metadata??=Symbol("metadata"),Qe.litPropertyMetadata??=new WeakMap;var re=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Xt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(t,n,e);i!==void 0&&Wn(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){let{get:i,set:r}=Vn(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);r?.call(this,a),this.requestUpdate(t,o,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Xt}static _$Ei(){if(this.hasOwnProperty(Le("elementProperties")))return;let t=Gn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Le("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Le("properties"))){let e=this.properties,n=[...Kn(e),...Fn(e)];for(let i of n)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,i]of e)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let i=this._$Eu(e,n);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)e.unshift(vt(i))}else t!==void 0&&e.push(vt(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Yt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){let r=(n.converter?.toAttribute!==void 0?n.converter:yt).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=n.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:yt;this._$Em=i;let o=a.fromAttribute(e,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,n,i=!1,r){if(t!==void 0){let a=this.constructor;if(i===!1&&(r=this[t]),n??=a.getPropertyOptions(t),!((n.hasChanged??Jt)(r,e)||n.useDefault&&n.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:r},a){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),r!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,r]of n){let{wrapped:a}=r,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};re.elementStyles=[],re.shadowRootOptions={mode:"open"},re[Le("elementProperties")]=new Map,re[Le("finalized")]=new Map,Zn?.({ReactiveElement:re}),(Qe.reactiveElementVersions??=[]).push("2.1.2");var $t=globalThis,Qt=s=>s,et=$t.trustedTypes,en=et?et.createPolicy("lit-html",{createHTML:s=>s}):void 0,kt="$lit$",oe=`lit$${Math.random().toFixed(9).slice(2)}$`,_t="?"+oe,Xn=`<${_t}>`,$e=document,Ue=()=>$e.createComment(""),Oe=s=>s===null||typeof s!="object"&&typeof s!="function",At=Array.isArray,an=s=>At(s)||typeof s?.[Symbol.iterator]=="function",wt=`[ 	
\f\r]`,He=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,tn=/-->/g,nn=/>/g,ye=RegExp(`>|${wt}(?:([^\\s"'>=/]+)(${wt}*=${wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),sn=/'/g,rn=/"/g,ln=/^(?:script|style|textarea|title)$/i,Ct=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),d=Ct(1),le=Ct(2),Hs=Ct(3),ae=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),on=new WeakMap,we=$e.createTreeWalker($e,129);function dn(s,t){if(!At(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return en!==void 0?en.createHTML(t):t}var pn=(s,t)=>{let e=s.length-1,n=[],i,r=t===2?"<svg>":t===3?"<math>":"",a=He;for(let o=0;o<e;o++){let l=s[o],p,m,h=-1,g=0;for(;g<l.length&&(a.lastIndex=g,m=a.exec(l),m!==null);)g=a.lastIndex,a===He?m[1]==="!--"?a=tn:m[1]!==void 0?a=nn:m[2]!==void 0?(ln.test(m[2])&&(i=RegExp("</"+m[2],"g")),a=ye):m[3]!==void 0&&(a=ye):a===ye?m[0]===">"?(a=i??He,h=-1):m[1]===void 0?h=-2:(h=a.lastIndex-m[2].length,p=m[1],a=m[3]===void 0?ye:m[3]==='"'?rn:sn):a===rn||a===sn?a=ye:a===tn||a===nn?a=He:(a=ye,i=void 0);let b=a===ye&&s[o+1].startsWith("/>")?" ":"";r+=a===He?l+Xn:h>=0?(n.push(p),l.slice(0,h)+kt+l.slice(h)+oe+b):l+oe+(h===-2?o:b)}return[dn(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},je=class s{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let r=0,a=0,o=t.length-1,l=this.parts,[p,m]=pn(t,e);if(this.el=s.createElement(p,n),we.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=we.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(kt)){let g=m[a++],b=i.getAttribute(h).split(oe),v=/([.?@])?(.*)/.exec(g);l.push({type:1,index:r,name:v[2],strings:b,ctor:v[1]==="."?nt:v[1]==="?"?st:v[1]==="@"?it:_e}),i.removeAttribute(h)}else h.startsWith(oe)&&(l.push({type:6,index:r}),i.removeAttribute(h));if(ln.test(i.tagName)){let h=i.textContent.split(oe),g=h.length-1;if(g>0){i.textContent=et?et.emptyScript:"";for(let b=0;b<g;b++)i.append(h[b],Ue()),we.nextNode(),l.push({type:2,index:++r});i.append(h[g],Ue())}}}else if(i.nodeType===8)if(i.data===_t)l.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(oe,h+1))!==-1;)l.push({type:7,index:r}),h+=oe.length-1}r++}}static createElement(t,e){let n=$e.createElement("template");return n.innerHTML=t,n}};function ke(s,t,e=s,n){if(t===ae)return t;let i=n!==void 0?e._$Co?.[n]:e._$Cl,r=Oe(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=i:e._$Cl=i),i!==void 0&&(t=ke(s,i._$AS(s,t.values),i,n)),t}var tt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??$e).importNode(e,!0);we.currentNode=i;let r=we.nextNode(),a=0,o=0,l=n[0];for(;l!==void 0;){if(a===l.index){let p;l.type===2?p=new Me(r,r.nextSibling,this,t):l.type===1?p=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(p=new rt(r,this,t)),this._$AV.push(p),l=n[++o]}a!==l?.index&&(r=we.nextNode(),a++)}return we.currentNode=$e,i}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},Me=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ke(this,t,e),Oe(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==ae&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):an(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==f&&Oe(this._$AH)?this._$AA.nextSibling.data=t:this.T($e.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=je.createElement(dn(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new tt(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(t){let e=on.get(t.strings);return e===void 0&&on.set(t.strings,e=new je(t)),e}k(t){At(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,i=0;for(let r of t)i===e.length?e.push(n=new s(this.O(Ue()),this.O(Ue()),this,this.options)):n=e[i],n._$AI(r),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Qt(t).nextSibling;Qt(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},_e=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=f}_$AI(t,e=this,n,i){let r=this.strings,a=!1;if(r===void 0)t=ke(this,t,e,0),a=!Oe(t)||t!==this._$AH&&t!==ae,a&&(this._$AH=t);else{let o=t,l,p;for(t=r[0],l=0;l<r.length-1;l++)p=ke(this,o[n+l],e,l),p===ae&&(p=this._$AH[l]),a||=!Oe(p)||p!==this._$AH[l],p===f?t=f:t!==f&&(t+=(p??"")+r[l+1]),this._$AH[l]=p}a&&!i&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},nt=class extends _e{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}},st=class extends _e{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}},it=class extends _e{constructor(t,e,n,i,r){super(t,e,n,i,r),this.type=5}_$AI(t,e=this){if((t=ke(this,t,e,0)??f)===ae)return;let n=this._$AH,i=t===f&&n!==f||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==f&&(n===f||i);i&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},rt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){ke(this,t)}},cn={M:kt,P:oe,A:_t,C:1,L:pn,R:tt,D:an,V:ke,I:Me,H:_e,N:st,U:it,B:nt,F:rt},Jn=$t.litHtmlPolyfillSupport;Jn?.(je,Me),($t.litHtmlVersions??=[]).push("3.3.3");var hn=(s,t,e)=>{let n=e?.renderBefore??t,i=n._$litPart$;if(i===void 0){let r=e?.renderBefore??null;n._$litPart$=i=new Me(t.insertBefore(Ue(),r),r,void 0,e??{})}return i._$AI(s),i};var Pt=globalThis,X=class extends re{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=hn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ae}};X._$litElement$=!0,X.finalized=!0,Pt.litElementHydrateSupport?.({LitElement:X});var Qn=Pt.litElementPolyfillSupport;Qn?.({LitElement:X});(Pt.litElementVersions??=[]).push("4.2.2");var Se="mydashlight",Js=`/api/${Se}/pair`,Qs=`/api/${Se}/pair/poll`,ei=`/${Se}`,qe="pair";function un(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Tt(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function gn(s){let t=new URLSearchParams(s);return t.has(qe)?Tt(t.get(qe)??""):null}function es(s){if(s<60)return"just now";let t=Math.round(s/60);return`${t} minute${t===1?"":"s"} ago`}var We=class extends X{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let n=await this.connection.sendMessagePromise({type:`${Se}/pair/check`,code:e});n.found?(this.waiting=n,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(n){this.error=this.message(n),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${Se}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let n=e?.code;return n==="unauthorized"?"Only a Home Assistant admin can pair a screen.":n==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":n==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return d`<form @submit=${i=>{i.preventDefault();let r=Tt(this.typed);r&&this.check(r)}}>
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
    </form>`}confirm(){let e=this.waiting,n=this.step==="approving";return d`<h2>Allow this screen?</h2>
      <p class="code">${un(e.code??"")}</p>
      <p>
        A screen at ${e.address} asked ${es(e.age??0)}. Check the code matches the one on the screen. It will be
        signed in to Home Assistant as <b>${this.userName||"you"}</b>.
      </p>
      <p>To sign it out later, delete its entry under Refresh tokens on your Home Assistant profile’s Security tab.</p>
      <div class="actions">
        <button type="button" @click=${()=>this.close()} ?disabled=${n}>Cancel</button>
        <button type="button" class="dark" @click=${()=>void this.approve()} ?disabled=${n}>
          ${n?"Allowing…":"Allow"}
        </button>
      </div>`}render(){let e;return this.isAdmin?this.step==="done"?e=d`<h2>Screen paired</h2>
        <p>It will open the board in a few seconds.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Done</button></div>`:this.step==="confirm"||this.step==="approving"?e=this.confirm():e=this.enter():e=d`<h2>Pair a screen</h2>
        <p>Only a Home Assistant admin can pair a screen. Ask an admin to scan the code instead.</p>
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,d`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};We.styles=ve`
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
  `,We.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",We);function k(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Ve(s){let t=Math.floor(Math.round(s)/60)%24;return`${k(s)} ${t<12?"AM":"PM"}`}function fn(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Fe(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function mn(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var ts=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),ns=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),ss=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function ot(s){return new Date(`${s}T12:00:00Z`)}function Ae(s){let t=ot(s);return`${ts.format(t)}, ${ss.format(t)}`}function G(s){return ns.format(ot(s))}function he(s,t){return Math.round((ot(t).getTime()-ot(s).getTime())/864e5)}function Ke(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Ke("UTC",t)}let n=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function at(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let i=Ke(e,s),r=Ke(e,t).date;return i.date===r?`at ${Ve(i.minutes)}`:`on ${G(i.date)} at ${Ve(i.minutes)}`}var Y=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},De="mydashlight",is=7,bn=3e4;function Et(s){if(s instanceof Y)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new Y(String(t.code??"error"),t.message)}return typeof s=="number"?new Y("connection_lost","Lost the connection to Home Assistant."):new Y("error",String(s))}var lt=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new Y("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},bn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new Y("not_running","MyDashLight isn’t running right now."))},{type:`${De}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:De,service:"get_plan",service_data:{days:is},return_response:!0});this.emit(t.response)}catch(t){this.fail(Et(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:De,service:t,service_data:e})}catch(n){throw Et(n)}this.pushing||await this.refresh()}setRide(t,e,n,i){return this.call("set_ride",{event:t,side:e,driver:n,scope:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:mn(e),scope:n})}setTakeAlong(t,e,n){return this.call("set_take_along",{event:t,kids:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,n=null,i=null,r=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:De,service:"get_chores",service_data:{},return_response:!0});e||t(a.response??null)}catch{e||t(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(o=>{e||t(o.chores)},{type:`${De}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):n=a}catch{if(e)return;r(),i=setInterval(()=>void r(),bn)}})(),()=>{e=!0,i&&clearInterval(i),n&&n().catch(()=>{})}}async setChoreDone(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:De,service:"set_chore_done",service_data:{chore:t,done:e}})}catch(n){throw Et(n)}}};var xn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},vn=s=>(...t)=>({_$litDirective$:s,values:t}),dt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:rs}=cn,yn=s=>s;var wn=()=>document.createComment(""),ze=(s,t,e)=>{let n=s._$AA.parentNode,i=t===void 0?s._$AB:t._$AA;if(e===void 0){let r=n.insertBefore(wn(),i),a=n.insertBefore(wn(),i);e=new rs(r,a,s,s.options)}else{let r=e._$AB.nextSibling,a=e._$AM,o=a!==s;if(o){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(r!==i||o){let l=e._$AA;for(;l!==r;){let p=yn(l).nextSibling;yn(n).insertBefore(l,i),l=p}}}return e},ue=(s,t,e=s)=>(s._$AI(t,e),s),os={},$n=(s,t=os)=>s._$AH=t,kn=s=>s._$AH,pt=s=>{s._$AR(),s._$AA.remove()};var _n=(s,t,e)=>{let n=new Map;for(let i=t;i<=e;i++)n.set(s[i],i);return n},Q=vn(class extends dt{constructor(s){if(super(s),s.type!==xn.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let i=[],r=[],a=0;for(let o of s)i[a]=n?n(o,a):a,r[a]=e(o,a),a++;return{values:r,keys:i}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let i=kn(s),{values:r,keys:a}=this.dt(t,e,n);if(!Array.isArray(i))return this.ut=a,r;let o=this.ut??=[],l=[],p,m,h=0,g=i.length-1,b=0,v=r.length-1;for(;h<=g&&b<=v;)if(i[h]===null)h++;else if(i[g]===null)g--;else if(o[h]===a[b])l[b]=ue(i[h],r[b]),h++,b++;else if(o[g]===a[v])l[v]=ue(i[g],r[v]),g--,v--;else if(o[h]===a[v])l[v]=ue(i[h],r[v]),ze(s,l[v+1],i[h]),h++,v--;else if(o[g]===a[b])l[b]=ue(i[g],r[b]),ze(s,i[h],i[g]),g--,b++;else if(p===void 0&&(p=_n(a,b,v),m=_n(o,h,g)),p.has(o[h]))if(p.has(o[g])){let u=m.get(a[b]),y=u!==void 0?i[u]:null;if(y===null){let P=ze(s,i[h]);ue(P,r[b]),l[b]=P}else l[b]=ue(y,r[b]),ze(s,i[h],y),i[u]=null;b++}else pt(i[g]),g--;else pt(i[h]),h++;for(;b<=v;){let u=ze(s,l[v+1]);ue(u,r[b]),l[b++]=u}for(;h<=g;){let u=i[h++];u!==null&&pt(u)}return this.ut=a,$n(s,l),ae}});var ct=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function F(s){return ct[(s%ct.length+ct.length)%ct.length]}var An="#23272E",Cn="35,39,46";var as=3,mt=36,Mt=12,ls=8,St=60,Dt=10,ut=30,zt=10,ds=150,ps=200,ft=1.4;function Nt(s,t){let e=Math.max(ds,ps/ft);return Math.ceil(St+Math.max(0,s-1)*Dt+ut+Math.max(0,t-1)*zt+e*(s+ft*t))}function Pe(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function ge(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function de(s){return new Map(Pe(s).map((t,e)=>[t,F(e)]))}function Z(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function fe(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function It(s,t){return t==="none"?"Not needed":ge(s).includes(t)?fe(s,t):t}function cs(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function gt(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function ht(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(gt(t,n.from)),e.push(gt(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(gt(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function hs(s){let t=s.map(a=>({...a,col:0,cols:1})).sort((a,o)=>a.s-o.s||o.en-a.en),e=[],n=[],i=-1/0,r=()=>{for(let a of e)a.cols=n.length;e=[],n=[]};for(let a of t){a.s>=i&&(r(),i=-1/0);let o=n.findIndex(l=>l<=a.s);o<0?(o=n.length,n.push(a.en)):n[o]=a.en,a.col=o,e.push(a),i=Math.max(i,a.en)}return r(),t}function us(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.t)return i.t===n.t?n.y:Math.round(n.y+(t-n.t)/(i.t-n.t)*(i.y-n.y))}return s[s.length-1].y}function gs(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.y)return i.y===n.y?n.t:n.t+(t-n.y)/(i.y-n.y)*(i.t-n.t)}return s[s.length-1].t}function En(s,t){return us(s.anchors,t)}function Mn(s,t){return gs(s.anchors,t)}function fs(s,t){let e=Pe(s),n=ge(s),i=Math.max(t,Nt(e.length,n.length)),a=(i-St-Math.max(0,e.length-1)*Dt-ut-Math.max(0,n.length-1)*zt)/(e.length+ft*n.length||1),o=Math.floor(a),l=Math.floor(a*ft),p=new Map;for(let v of s.days)for(let u of v.events){let y=p.get(u.kid)??[];y.some(P=>P.event_id===u.event_id&&P.calendar_id===u.calendar_id)||y.push(u),p.set(u.kid,y)}let m=de(s),h=[],g=St;e.forEach((v,u)=>{let y=p.get(v)??[],P=s.days.some(x=>x.events.some(R=>R.kid===v&&(R.sides.includes("drop")&&R.drop===""||R.sides.includes("pick")&&R.pick==="")));h.push({id:v,kind:"kid",x:g,w:o,name:Z(s,v),dot:m.get(v).color,rgb:m.get(v).rgb,sub:`${P?"Needs a ride · ":""}${y.length} this week`,subWarn:P}),g+=o+(u<e.length-1?Dt:0)});let b=g+ut/2;return g+=ut,n.forEach((v,u)=>{let y=0,P=0;for(let x of s.days){let R=x.drivers[v];R&&(y+=R.outings.length,P+=R.drive??0)}h.push({id:v,kind:"driver",x:g,w:l,name:fe(s,v),dot:An,rgb:Cn,sub:`${y} ${y===1?"trip":"trips"} this week · ${Fe(P)} driving`,subWarn:!1}),g+=l+(u<n.length-1?zt:0)}),{columns:h,sepX:b,width:i}}function ms(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(t.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let a=i.slice(r[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Pn(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${k(s.start)}`:e||!t?`${s.title} until ${k(s.end)}`:`${s.title} ${k(s.start)}–${k(s.end)}`}function Bt(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length}function Lt(s,t){let e=he(t,s);return e===0?"Today":e===1?"Tomorrow":""}function W(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Rt(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),i=1,r=0;for(let a of s.split(/\s+/).filter(Boolean)){let o=a.length;for(r===0?r=o:r+1+o<=n?r+=1+o:(i++,r=o);r>n;)i++,r-=n}return i}var Sn=25,Dn=15,Ht=3;function Tn(s){return Math.max(0,Math.min(Ht,Math.floor((s-Sn)/Dn)))}function bs(s,t){let e=Math.min(Ht,Rt(s,t-19,6.6));return Sn+e*Dn+2}function xs(s,t){let e=t-23,n=`${k(s.start)}–${k(s.end)}`+(s.arrive_by!=null?` · arrive ${k(s.arrive_by)}`:""),i=33+Rt(n,e,6.6)*16;for(let r of[s.lines.drop,s.lines.pick])r&&(i+=2+Rt(r.text,e,7)*16);return i+4}function zn(s,t,e,n){let i=t==="compact",{columns:r,sepX:a,width:o}=fs(s,e),l=new Map(r.map(x=>[x.id,x])),p=Pe(s),m=ge(s),h=[...p,...m],g=de(s),b=cs(s),v=x=>Z(s,x),u=x=>fe(s,x),y={mode:t,width:o,height:0,columns:r,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},P=0;return s.days.forEach((x,R)=>{let K=R*1440,T=new Map(x.events.map(c=>[c.id,c])),H=c=>c&&T.has(c)?{day:x.date,event:c}:null,ee=Bt(x),me=x.events.length,Te=Lt(x.date,n.date);y.dayHeads.push({date:x.date,y:P,label:Ae(x.date),tag:Te,sub:(me?`${me} ${me===1?"activity":"activities"}`:"Nothing scheduled")+(ee?` · ${ee} to sort out`:""),warn:ee>0}),y.anchors.push({t:K,y:P});let pe=P+mt+Mt,Ne=m.flatMap(c=>x.drivers[c]?.outings??[]);if(!me&&!Ne.length){y.empties.push({key:x.date,y:pe,text:"Nothing planned"}),P=pe+40,y.anchors.push({t:K+1439,y:P});return}let M=(c,C,_,E,A,S,$)=>{let U=g.get(c.kid)??F(0),O=c.lines;return{key:`${x.date}|card|${c.id}`,x:C,y:_,w:E,h:A,target:{day:x.date,event:c.id},event:c,color:U,kidName:v(c.kid),clash:S,stayed:c.stay&&m.includes(c.drop),skipped:c.attending===!1,title:ms(c.title,v(c.kid)),time:`${k(c.start)}–${k(c.end)}`+(c.arrive_by!=null?` · arrive ${k(c.arrive_by)}`:""),drop:O.drop,pick:O.pick,showDrop:!!O.drop&&($||A>=56),showPick:!!O.pick&&($||A>=74),wrap:$,aria:`${v(c.kid)}, ${c.title} ${k(c.start)} to ${k(c.end)}. `+(c.attending===!1&&!O.drop?"Not attending. ":"")+[O.drop,O.pick].filter(ie=>!!ie).map(ie=>ie.text).join(". ")}},te=c=>{let C=x.rides[c];return C?(x.drivers[C.driver]?.segments??[]).filter(E=>E.type!=="home"&&E.kids.includes(C.kid)&&W(E.start)>=W(C.start)&&W(E.end)<=W(C.end)):[]},N=c=>{let C=x.rides[c];if(!C)return null;let _=C.serves.find(E=>T.get(E)?.kid===C.kid);return H(_??C.serves[0])},J=new Map;for(let c of x.issues)c.level!=="problem"||!c.event||(c.kind==="late"&&J.set(c.event,`${Math.round(W(c.minutes))} min late`),c.kind==="waiting"&&J.set(`${c.event}|pick`,`Waits ${Math.round(W(c.minutes))} min`));if(!i){let c=1/0,C=-1/0;for(let $ of x.events)c=Math.min(c,$.start-20,$.arrive_by!=null?$.arrive_by-10:1/0),C=Math.max(C,$.end+20);for(let $ of Ne)$.start!=null&&(c=Math.min(c,$.start)),$.end!=null&&(C=Math.max(C,$.end));x.date===n.date&&Number.isFinite(c)&&n.minutes>c-60&&n.minutes<C&&(c=Math.min(c,n.minutes-15));let _=Number.isFinite(c)?Math.floor((c-5)/30)*30:900,E=Number.isFinite(C)?Math.ceil((C+5)/30)*30:960,A=$=>Math.round(pe+(Math.max(_,Math.min(E,$))-_)*as);y.anchors.push({t:K+_,y:A(_)},{t:K+E,y:A(E)});for(let $ of p){let U=l.get($),O=g.get($),ie=(x.kids[$]?.items??[]).filter(D=>D.start!=null&&D.end!=null).map(D=>({item:D,s:W(D.start),en:W(D.end)}));for(let D of hs(ie)){let w=U.w/D.cols,B=Math.round(U.x+D.col*w),I=Math.round(w-(D.cols>1?4:0)),j=A(D.s),ce=D.item;if(ce.type==="act"){let V=T.get(ce.event??"");if(!V)continue;let qt=Math.max(30,A(D.en)-j);if(y.cards.push(M(V,B,j,I,qt,ce.clash,!1)),V.arrive_by!=null&&V.start-V.arrive_by>=5){let Kt=A(V.arrive_by);y.preps.push({key:`${x.date}|prep|${V.id}`,x:B,y:Kt,w:I,h:j-Kt+6,color:O,label:`Arrive by ${k(V.arrive_by)}`})}let Wt=J.get(V.id);Wt&&y.marks.push({key:`${x.date}|late|${V.id}`,x:B+I-4,y:j+4,text:Wt,right:!0});let Vt=J.get(`${V.id}|pick`);Vt&&y.marks.push({key:`${x.date}|wait|${V.id}`,x:B+4,y:j+qt+2,text:Vt,right:!1});continue}let q=x.rides[ce.ride??-1];if(!q)continue;let be=Math.max(22,A(D.en)-j),Ie=ht(te(q.index),b),L=u(q.driver);y.rides.push({key:`${x.date}|ride|${q.index}`,x:B,y:j,w:I,h:be,target:N(q.index),l1:`${q.own?"In":"Along in"} ${L}’s car`,l2:Ie.join(" → "),show2:Tn(be)>0,lines2:Tn(be),dashed:!q.own,clash:ce.clash,aria:`${v($)} ${q.own?"in":"riding along in"} ${L}’s car, ${k(W(q.start))} to ${k(W(q.end))}: ${Ie.join(" to ")}`});let xe=l.get(q.driver);xe&&y.bands.push({key:`${x.date}|band|${q.index}`,x:B+I,y:j,w:Math.max(0,xe.x+8-(B+I)),h:be,color:O})}}for(let $ of m){let U=l.get($),O=x.drivers[$];if(!O)continue;let ie=[],D=null;for(let w of O.segments)if(!(w.start==null||w.end==null)){if(w.type==="home"){D=null;continue}if(w.type==="stay"){D=null,ie.push({type:"stay",g:w,s:w.start,en:w.end});continue}D&&D.en===w.start?(D.en=w.end,D.legs.push(w)):(D={type:"trip",s:w.start,en:w.end,legs:[w]},ie.push(D))}for(let w of ie){let B=A(w.s),I=Math.max(24,A(w.en)-B);if(w.type==="stay"){let L=T.get(w.g.event??w.g.serves??""),xe=L?g.get(L.kid)??F(0):F(0),V=w.g.kids.map(v);y.stays.push({key:`${x.date}|stay|${$}|${w.s}`,x:U.x+8,y:B,w:U.w-16,h:I,target:H(L?.id),color:xe,l1:L?`At ${L.title} with ${v(L.kid)}`:"Staying",l2:`until ${k(w.en)}`+(V.length?` · ${V.join(" and ")} too`:"")});continue}let j=w.legs[0],ce=w.legs[w.legs.length-1],q=[];for(let L of w.legs)for(let xe of L.kids)q.includes(xe)||q.push(xe);let be=ce.type==="drive"&&ce.to==="home",Ie=ht(w.legs,b);y.trips.push({key:`${x.date}|trip|${$}|${w.s}`,x:U.x+8,y:B,w:U.w-16,h:I,target:H(w.legs.find(L=>L.serves)?.serves),l1:j.type==="drive"&&j.from==="home"?`Leave ${k(w.s)}`:`From ${gt(b,j.from??j.place)} ${k(w.s)}`,l2:Ie.join(" → "),show2:I>=36,l3:be?`Home ${k(w.en)}`:"",show3:be&&I>=62,stops:null,kids:q.map(L=>(g.get(L)??F(0)).color),bad:w.legs.some(L=>L.overlaps_busy),aria:`${u($)} drives ${Ie.join(" to ")}, ${k(w.s)} to ${k(w.en)}`})}for(let w of O.segments)if(!(!w.overlaps_busy||w.start==null||w.end==null))for(let B of O.busy){let I=Math.max(w.start,B.start),j=Math.min(w.end,B.end);j<=I||y.overlaps.push({key:`${x.date}|overlap|${$}|${I}`,x:U.x+6,y:A(I)-2,w:U.w-12,h:Math.max(8,A(j)-A(I)+4)})}for(let w of O.busy){if(w.end<=_||w.start>=E)continue;let B=A(w.start),I=A(w.end);y.busy.push({key:`${x.date}|busy|${$}|${w.start}`,x:U.x+1,y:B,w:U.w-2,h:I-B,labelY:8,label:Pn(w,!1)})}}let S=-1/0;for(let $=_;$<=E;$+=30)y.grid.push({key:`${x.date}|grid|${$}`,y:A($),strong:$%60===0}),$%60===0&&A($)-S>=22&&(y.hours.push({key:`${x.date}|hour|${$}`,y:A($)-8,label:fn($)}),S=A($));x.date===n.date&&n.minutes>_&&n.minutes<E&&(y.now={y:A(n.minutes),label:`Now ${k(n.minutes)}`}),P=A(E)+Mt;return}let ne=[];for(let c of p){let C=l.get(c);for(let _ of x.kids[c]?.items??[])if(_.start!=null){if(_.type==="act"){let E=T.get(_.event??"");if(!E)continue;ne.push({col:c,s:_.start,h:xs(E,C.w),kind:"act",item:_})}else if(!x.rides[_.ride??-1]?.own){let E=x.rides[_.ride??-1],A=E?ht(te(E.index),b).join(" → "):"";ne.push({col:c,s:_.start,h:bs(A,C.w),kind:"along",item:_})}}}for(let c of m){let C=x.drivers[c];if(C){for(let _ of C.busy)ne.push({col:c,s:_.start,h:32,kind:"busy",busy:_});for(let _ of C.outings)_.start!=null&&ne.push({col:c,s:_.start,h:30+_.lines.length*16+(_.warn?16:0),kind:"out",out:_})}}ne.sort((c,C)=>c.s-C.s||h.indexOf(c.col)-h.indexOf(C.col));let Ee=new Map,z=pe;ne.forEach((c,C)=>{let _=Ee.get(c.col),E=Math.max(_!=null?_+ls:pe,z);Ee.set(c.col,E+c.h),z=E,y.anchors.push({t:K+c.s,y:E});let A=l.get(c.col);if(c.kind==="busy")y.busy.push({key:`${x.date}|busy|${c.col}|${C}`,x:A.x+1,y:E,w:A.w-2,h:c.h,labelY:8,label:Pn(c.busy,!0)});else if(c.kind==="out"){let S=c.out;y.trips.push({key:`${x.date}|trip|${c.col}|${C}`,x:A.x+8,y:E,w:A.w-16,h:c.h,target:H(S.target),l1:S.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...S.lines.map($=>({text:$,warn:!1})),...S.warn?[{text:S.warn,warn:!0}]:[]],kids:S.kids.map($=>(g.get($)??F(0)).color),bad:!!S.warn,aria:`${u(c.col)}: ${S.lead}. ${S.lines.join(". ")}${S.warn?`. ${S.warn}`:""}`})}else if(c.kind==="act"){let S=T.get(c.item.event??"");y.cards.push(M(S,A.x,E,A.w,c.h,c.item.clash,!0))}else{let S=x.rides[c.item.ride??-1],$=ht(te(S.index),b),U=u(S.driver);y.rides.push({key:`${x.date}|ride|${S.index}`,x:A.x,y:E,w:A.w,h:c.h,target:N(S.index),l1:`Along with ${U} ${k(W(S.start))}`,l2:$.join(" → "),show2:!0,lines2:Ht,dashed:!0,clash:c.item.clash,aria:`${v(c.col)} riding along with ${U}, ${k(W(S.start))} to ${k(W(S.end))}: ${$.join(" to ")}`})}});let se=pe;for(let c of Ee.values())se=Math.max(se,c);P=se+Mt+6,y.anchors.push({t:K+1439,y:P})}),y.height=P,y}var vs=["","¼","½","¾"];function Ce(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Fe(n);let i=Math.round(n*4),r=Math.floor(i/4),a=vs[i%4];return`${r||!a?r:""}${a} min`})}function Rn(s){let t=e=>e?{...e,text:Ce(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,i])=>[n,{...i,outings:i.outings.map(r=>({...r,lines:r.lines.map(Ce),warn:r.warn==null?r.warn:Ce(r.warn)}))}])),issues:e.issues.map(n=>({...n,title:Ce(n.title),body:Ce(n.body),note:n.note==null?n.note:Ce(n.note),...n.suggestions?{suggestions:n.suggestions.map(i=>({...i,note:Ce(i.note)}))}:{}}))}))}}var ys=2,ws=48;function Nn(s,t,e=ws){let n=[],i=0,r=0,a=0,o=0,l=t.minutes+e*60;for(let p of s.days){let m=he(t.date,p.date),h=m===0?"":`${G(p.date)} · `,g=new Map(p.events.map(u=>[u.id,u])),b=u=>u&&g.has(u)?{day:p.date,event:u}:null,v=(u,y)=>m*1440+(u??g.get(y??"")?.start??0)<l;for(let u of p.issues)if(u.level==="problem"){if(!v(u.at,u.event)){a++,u.kind==="unassigned"&&o++;continue}i++,u.kind==="unassigned"&&r++,n.push({key:`${p.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:h+u.title,body:u.body,target:b(u.event),suggestions:(u.suggestions??[]).map(y=>({id:y.id,label:y.label,note:y.note}))})}if(p.clashes.forEach((u,y)=>{if(!v(u.a.start,u.a.event)){a++;return}i++;let P=g.get(u.a.event??""),x=Z(s,u.kid),R=(T,H)=>{let ee=b(H);return ee?{text:T,target:ee}:T},K=[];if(u.b.type==="act"){let T=g.get(u.b.event??"");P&&T&&(K=[R(P.title,P.id),` ${k(P.start)}–${k(P.end)} and `,R(T.title,T.id),` ${k(T.start)}–${k(T.end)} overlap.`])}else{let T=p.rides[u.b.ride??-1];P&&T&&(K=[`${x} is in `,R(`${fe(s,T.driver)}’s car`,T.serves[0]),` ${k(W(u.b.start))}–${k(W(u.b.end))}, during `,R(P.title,P.id),"."])}n.push({key:`${p.date}|clash|${y}`,tone:"problem",title:`${h}${x} is double-booked`,body:K.map(T=>typeof T=="string"?T:T.text).join(""),parts:K,target:null,suggestions:[]})}),m>=0&&m<ys)for(let u of p.issues)u.level!=="heads_up"||!v(u.at,u.event)||n.push({key:`${p.date}|${u.key}`,tone:"heads_up",title:h+u.title,body:u.body,target:b(u.event),suggestions:[]});for(let u of p.events)!u.problems.length||!v(u.start)||n.push({key:`${p.date}|notes|${u.id}`,tone:"heads_up",title:`${h}Check the notes on ${Z(s,u.kid)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:b(u.id),suggestions:[]})}return{items:n,problems:i,unassigned:r,later:a,laterUnassigned:o}}function In(s,t){let e=de(s),n=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of s.days){let a=he(t.date,r.date);if(!(a<0))for(let o of ge(s))for(let l of r.drivers[o]?.outings??[]){if(l.start==null)continue;let p=a*1440+l.start;if(a*1440+W(l.end,l.start)<=t.minutes)continue;let h=p-t.minutes,g={driver:o,name:fe(s,o),date:r.date,ahead:a,start:l.start,inMinutes:h,ongoing:h<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(b=>e.get(b)??F(0)),warn:l.warn,target:l.target&&r.events.some(b=>b.id===l.target)?{day:r.date,event:l.target}:null};(!n||i(g)<i(n)||i(g)===i(n)&&g.inMinutes<n.inMinutes)&&(n=g)}}return n}function Re(s){return s.state==="done"||s.state==="late"}function Bn(s){return s.state==="open"||s.state==="overdue"}function Ln(s,t,e){if(Re(s)){let n=s.done_at?ks(s.done_at,t,e):"";return s.state==="late"?`Done late${n?` · ${n}`:""}`:`Done${n?` ${n}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${$s(s.due,t)}`:"Missed";if(s.state==="upcoming"){let n=s.shows_from??s.due;if(!s.due||!n||s.due<=n)return"";let i=he(t,s.due);return`By ${i===1?"tomorrow":i<7?G(s.due):Ut(s.due)}`}if(s.due&&s.due>t){let n=he(t,s.due);return n===1?"By tomorrow":`By ${n<7?G(s.due):Ut(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function $s(s,t){let e=he(t,s);return e===0?"today":e===-1?"yesterday":Math.abs(e)<7?G(s):Ut(s)}function Ut(s){let[t,e,n]=s.split("-").map(Number);return new Date(Date.UTC(t,e-1,n)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ks(s,t,e){let n=new Date(s);if(Number.isNaN(n.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let r=n.toLocaleDateString("en-CA",{timeZone:i}),a=n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return r===t?a:`${G(r)} ${a}`}function Hn(s,t){let e=[...s.chores].sort((n,i)=>n.order-i.order);return s.kids.map((n,i)=>{let r=e.filter(p=>p.kid===n.id),a=new Map;for(let p of r){if(p.state!=="upcoming")continue;let m=p.shows_from??p.due??s.today;a.set(m,[...a.get(m)??[],p])}let o=r.filter(p=>p.state==="overdue"),l=r.filter(p=>p.state==="open");return{kid:n.id,name:n.name,color:t?.get(n.id)??F(i),overdue:o,now:l,done:r.filter(Re),later:[...a.entries()].sort(([p],[m])=>p.localeCompare(m)).map(([p,m])=>({date:p,chores:m})),left:o.length+l.length}})}function Un(s){return[...s.chores].filter(t=>t.state==="overdue"||t.state==="open"&&(t.due==null||t.due<=s.today)).sort((t,e)=>t.state===e.state?t.order-e.order:t.state==="overdue"?-1:1)}function Ot(s){return!s.chores.length&&!s.templates.length}var _s={timeline:"timeline",full:"timeline",compact:"compact"};function jt(s){let t=new URLSearchParams(s),e={},n=_s[(t.get("view")??"").trim().toLowerCase()];n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(t.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(t.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores")&&(e.page=i),e}var On=ve`
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
`;var jn="mydashlight.rides.mode",As=1100,Cs=440,Ps=700,Ts=3*6e4,Es=1200;function Ms(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}function Ge(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Ss(s,t){return Lt(s,t)||Ae(s).split(",")[0]}function Ds(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function zs(){try{return localStorage.getItem(jn)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Rs(s){try{localStorage.setItem(jn,s)}catch{}}function bt(s){return s.days.every(t=>!t.events.length)}var Ye=class extends X{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=jt(location.search).view;this.urlPage=jt(location.search).page;this.stopChores=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let i=e.clientX-n.x,r=e.clientY-n.y;if(!n.moved){if(Math.abs(i)+Math.abs(r)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-r,n.el.scrollLeft=n.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Ts))};this.onKey=e=>{e.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??zs(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.backend&&(this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let n=new Map(this.choreDraft);for(let i of e.chores)n.has(i.id)&&Re(i)===n.get(i.id)&&n.delete(i.id);for(let i of n.keys())e.chores.some(r=>r.id===i)||n.delete(i);this.choreDraft=n}}),this.stopWatching=this.backend.watch(e=>{this.plan=Rn(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<As)return!1;let e=this.plan;return!e||this.width-Cs>=Nt(Pe(e).length,ge(e).length)}today(){return Ke(this.plan?.time_zone??Ms())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),i=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=zn(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let i=this.scroller;if(!i||!this.board)return;let r=this.board.dayHeads.find(a=>a.date===n)?.y??0;i.scrollTop=Math.max(r,En(this.board,e)-mt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),a=n.days[r];if(!a)return;let o=1/0;if(this.mode==="timeline"){for(let l of a.events)o=Math.min(o,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let p of l.outings)p.start!=null&&(o=Math.min(o,p.start))}this.scrollToTime(r*1440+(Number.isFinite(o)?Math.max(0,o-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,i=this.board.dayHeads[0];for(let p of this.board.dayHeads)p.y<=n+1&&(i=p);let r=this.renderRoot,a=r.querySelector(".pinned .label"),o=r.querySelector(".pinned .tag"),l=r.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),o&&(o.textContent!==i.tag&&(o.textContent=i.tag),o.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let p of r.querySelectorAll(".day-tile"))p.classList.toggle("in-view",p.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.page=e,e==="rides"&&(this.scrolledOnce=!1))}async toggleChore(e){if(!this.backend)return;let n=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,n),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,n)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let o=r instanceof Y?r:new Y("error",String(r));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??Re(e)}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?Mn(this.board,n.scrollTop+mt+4):null,this.mode=e,this.urlView||Rs(e)}findEvent(e){let n=this.plan?.days.find(r=>r.date===e.day),i=n?.events.find(r=>r.id===e.event);return n&&i?{day:n,event:i}:null}open(e,n=!1){e&&(this.flushArrive(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),i=this.dayIndexOf(e.day);!n||i<0||this.scrollToTime(i*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,i){if(!this.pending){this.pending={key:e,value:n};try{await i()}catch(r){let a=r instanceof Y?r:new Y("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,n,i){if(!this.backend)return;let r=this.backend;this.save(`${n}`,i,()=>r.setRide(e.id,n,i,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let i=this.backend;this.save("attending",n,()=>i.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n){if(!this.backend)return;let i=this.backend,r=e.along.includes(n)?e.along.filter(a=>a!==n):[...e.along,n];this.save("along",r,()=>i.setTakeAlong(e.id,r,this.scope))}nudgeArrive(e,n){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;n<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Es)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let i=this.findEvent(n);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,a=i.event.id,o=this.scope;this.save("arrive",e,()=>r.setArriveBy(a,e,o)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),i=e?Nn(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?Un(this.chores).filter(p=>!this.choreDone(p)):[],o=d`<aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
      ${this.sel&&e?this.renderEditor(e):this.renderAttention(i,a)}
    </aside>`,l=this.page==="rides";return d`
      <div class="app ${r?"wide":this.width<Ps?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${l&&e?this.renderWeek(e):f}
          ${l?this.renderBanner(e):f}
          <main>
            ${l?d`<section class="board-area" aria-label="Everyone’s week">
                  ${n&&e?bt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
                </section>`:d`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel)?d`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${o}`:f}
          </main>
        </div>
        ${r?o:f}
        ${this.toast?d`<div class="toast" role="status">${this.toast}</div>`:f}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(e,n,i){let r=n.problems+i;this.tick;let a=this.today(),o="";if(e){let g=e.time_zone,b=new Date(e.updated);this.error?o=d`<span class="bad">Can’t reach Home Assistant · showing the plan from ${at(b,new Date,g)}</span>`:e.status&&!e.status.ok?o=d`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${at(b,new Date,g)}</span>`:this.backend?.live||(o=`Updated ${at(b,new Date,g)}`)}let l=(g,b,v,u)=>d`
      <button type="button" class="seg-btn" title=${u} aria-pressed=${this.mode===g?"true":"false"} @click=${()=>this.setMode(g)}>
        ${v}<span class="seg-label">${b}</span>
      </button>
    `,p=(g,b,v)=>d`
      <button type="button" class="seg-btn" aria-pressed=${this.page===g?"true":"false"} @click=${()=>this.setPage(g)}>
        ${v}<span class="seg-label">${b}</span>
      </button>
    `,m=Ve(a.minutes),h=!!e&&bt(e);return d`
      <header>
        ${this.showMenu?d`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${le`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:f}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ae(a.date)}, ${m}`}>
            <span class="hm">${m.slice(0,-3)}</span><span class="ampm">${m.slice(-2)}</span>
          </h1>
          <p class="today-line">${Ae(a.date)}</p>
          ${o?d`<p class="status">${o}</p>`:f}
        </div>
        ${e&&!h?this.renderNext(e,In(e,a),n):f}
        <div class="controls">
          ${this.wide||h&&!i?f:d`<button type="button" class="attn-btn ${r?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${r}</span>
              </button>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${p("rides","Rides",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${p("chores","Chores",le`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
          </div>
          ${this.page!=="rides"?f:d`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",le`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",le`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
        </div>
      </header>
    `}renderNext(e,n,i){if(!n){let p=this.today().date,m=i.unassigned,h=i.laterUnassigned;if(m){let b=d`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${m} ${m===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?d`<div class="next idle needs">${b}</div>`:d`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${b}</button>`}if(h)return d`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let g=e.days.some(b=>b.date>=p&&b.events.length);return d`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${g?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${g?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let r;n.ongoing?r="On the road now":n.ahead===0?r=n.inMinutes<180?`Next trip · in ${Fe(n.inMinutes)}`:"Next trip · later today":n.ahead===1?r="Next trip · tomorrow":r=`Next trip · ${G(n.date)}`;let a=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,o=d`
      <span class="next-eyebrow">${r}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Ge(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(p=>d`<span class="kid-dot" style="background:${p.color}"></span>`)}</span>
      </span>
      ${n.warn?d`<span class="next-stop warn">${n.warn}</span>`:n.stop?d`<span class="next-stop">${n.stop}</span>`:f}
    `,l=`next ${n.ongoing?"ongoing":a?"soon":""}`;return n.target?d`<button type="button" class=${l} @click=${()=>this.open(n.target)}>${o}</button>`:d`<div class=${l}>${o}</div>`}renderWeek(e){let n=this.today().date,i=de(e);return d`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let a=Bt(r),o=r.events.length,l=r.events.slice(0,6).map(m=>i.get(m.kid)?.color??F(0).color),p=`${Ae(r.date)}: ${o?`${o} ${o===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return d`<button
          type="button"
          class="day-tile ${r.date===n?"today":""}"
          data-date=${r.date}
          aria-label=${p}
          @click=${()=>this.goToDay(r.date)}
        >
          <span class="dt-wd">${r.date===n?"Today":G(r.date)}</span>
          <span class="dt-num">${Number(r.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(m=>d`<span class="dt-dot" style="background:${m}"></span>`):d`<span class="dt-free">free</span>`}
            ${o>6?d`<span class="dt-more">+${o-6}</span>`:f}
          </span>
          ${a?d`<span class="dt-badge" aria-hidden="true">${a}</span>`:f}
        </button>`})}
    </nav>`}renderQuiet(e){let n=Pe(e),i=ge(e),r=de(e),a=n.map(o=>Z(e,o));return d`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((o,l)=>le`<circle cx=${50+l*30} cy="80" r="11" fill=${r.get(o).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Ds(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(o=>{let l=r.get(o);return d`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${Ge(Z(e,o))}</span>
            <span class="qw-name">${Z(e,o)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(o=>d`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Ge(fe(e,o))}</span>
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
    </div>`}renderBanner(e){let n=e?.unavailable_calendars.length??0;return n?d`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:f}renderEmpty(){return this.error?d`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:d`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,i=o=>!!o&&!!n&&o.day===n.day&&o.event===n.event,r=e.dayHeads[0],a=e.width;return d`
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
              <span class="avatar ${o.kind}" aria-hidden="true">${Ge(o.name)}</span>
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
              <span class="label">${o.label}</span>${o.tag?d`<span class="tag">${o.tag}</span>`:f}<span
                class="sub ${o.warn?"warn":""}"
                >${o.sub}</span
              >
            </div>`)}
          ${e.empties.map(o=>d`<span class="empty" style="top:${o.y}px">${o.text}</span>`)}
          ${e.grid.map(o=>d`<div class="grid ${o.strong?"strong":""}" style="top:${o.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(o=>d`<span class="hour" style="top:${o.y}px">${o.label}</span>`)}
          ${Q(e.bands,o=>o.key,o=>d`<div
                class="band"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:rgba(${o.color.rgb},0.10);border-color:rgba(${o.color.rgb},0.45)"
              ></div>`)}
          ${Q(e.busy,o=>o.key,o=>d`<div class="busy" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px">
                <span style="top:${o.labelY}px">${o.label}</span>
              </div>`)}
          ${Q(e.preps,o=>o.key,o=>d`<div
                class="prep"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:rgba(${o.color.rgb},0.07);color:${o.color.ink}"
              >
                ${o.label}
              </div>`)}
          ${Q(e.cards,o=>o.key,o=>{let l=o.color,p=o.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:o.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return d`<button
                type="button"
                class="card ${o.wrap?"wrap":""} ${i(o.target)?"sel":""} ${o.clash?"clash":""} ${o.skipped?"skipped":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:${p};border-color:${o.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(o.target)}
              >
                <span class="top">
                  <span class="title">${o.title}</span>
                  <span class="time">${o.time}</span>
                  ${o.showDrop&&o.drop?d`<span class="line tone-${o.drop.tone}">${o.drop.text}</span>`:f}
                </span>
                ${o.showPick&&o.pick?d`<span class="line tone-${o.pick.tone}">${o.pick.text}</span>`:f}
              </button>`})}
          ${Q(e.rides,o=>o.key,o=>d`<button
                type="button"
                class="ride ${o.dashed?"dashed":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}</span>${o.show2?d`<span class="l2" style="-webkit-line-clamp:${o.lines2}">${o.l2}</span>`:f}
              </button>`)}
          ${Q(e.stays,o=>o.key,o=>d`<button
                type="button"
                class="stay"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:repeating-linear-gradient(135deg, rgba(${o.color.rgb},0.28) 0px, rgba(${o.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1" style="color:${o.color.ink}">${o.l1}</span><span class="l2">${o.l2}</span>
              </button>`)}
          ${Q(e.trips,o=>o.key,o=>d`<button
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
          ${Q(e.overlaps,o=>o.key,o=>d`<div class="overlap" aria-hidden="true" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`)}
          ${Q(e.marks,o=>o.key,o=>d`<span class="mark" style="left:${o.x}px;top:${o.y}px;${o.right?"transform:translateX(-100%)":""}">${o.text}</span>`)}
          ${e.now?d`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:f}
        </div>
      </div>
    `}renderAttention(e,n){let{items:i,problems:r,later:a}=e,o=this.plan,l=r+n.length,p=this.chores,m=!!p&&!Ot(p);return d`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?f:d`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${m?d`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${n.length?d`<div class="attn-chores">${n.map(h=>this.renderChoreRow(h,!0))}</div>`:d`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:d`<p class="panel-sub">Rides in the next two days</p>`}
      ${o&&!r?d`<div class="all-clear">
            <span class="check" aria-hidden="true">${le`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${bt(o)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
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
      ${this.wide&&o&&!bt(o)&&this.page==="rides"?this.renderLegend():f}
    `}renderChoreRow(e,n=!1){let i=this.chores,r=this.choreDone(e),a=i.kids.findIndex(y=>y.id===e.kid),o=(this.plan?de(this.plan).get(e.kid):void 0)??F(Math.max(0,a)),l=i.kids[a]?.name??"",p=r===Re(e)?e:{...e,state:r?"done":"open",done_at:r?new Date().toISOString():null},m=Ln(p,i.today,i.time_zone),h=r||Bn(e),g=`${n?`${l}: `:""}${e.title}. ${m?`${m}. `:""}${r?"Done. Tap to undo.":"Tap when it’s done."}`,b=d`<span class="box" aria-hidden="true"
        >${r?le`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:f}</span
      >
      ${e.icon?d`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:f}
      <span class="chore-text">
        <span class="chore-title">${n?d`<span class="chore-kid">${l}</span> · `:f}${e.title}</span>
        ${m?d`<span class="chore-note">${m}</span>`:f}
      </span>`,v=`chore ${r?"done":""} ${e.state==="overdue"&&!r?"overdue":""} ${h?"":"later"}`,u=`--c:${o.color};--rgb:${o.rgb};--k:${o.ink}`;return h?d`<button type="button" class=${v} style=${u} aria-pressed=${r?"true":"false"} aria-label=${g} @click=${()=>void this.toggleChore(e)}>
          ${b}
        </button>`:d`<div class=${v} style=${u}>${b}</div>`}renderChores(){let e=this.chores;if(e===void 0)return d`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return d`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return d`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;let n=e.templates.filter(a=>a.problems.length),i=n.length?d`<div class="banner">
          ${n.map(a=>d`<div><strong>${a.title}</strong>: ${a.problems.join("; ")}</div>`)}
        </div>`:f;if(Ot(e)){let a=e.kids[0]?.name??"Ava";return d`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Chores come from Google Tasks, in the Google account MyDashLight signs in with.</p>
        <ol>
          <li>Open Google Tasks and pick the list <strong>Chore templates: Daily</strong> (or Weekly or Monthly).</li>
          <li>Add a task named for the chore, such as <strong>🛏️ Make bed</strong>.</li>
          <li>In its details, add a line <code>Who: ${a}</code>. Add <code>Days: Mon-Fri</code> for weekdays only.</li>
        </ol>
        <p>Within a minute it shows here, and on ${a}’s own list in Google Tasks.</p>
      </div>`}let r=Hn(e,this.plan?de(this.plan):void 0);return d`<div class="chores-scroll">
      ${i}
      <div class="chore-cols" style="--n:${r.length}">
        ${r.map(a=>{let o=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return d`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Ge(a.name)}</span>
              <span class="ch-text">
                <span class="name">${a.name}</span>
                <span class="sub">${o?`${o} to do`:a.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
            </div>
            ${a.overdue.length?d`<h3 class="chore-group overdue">Missed</h3>
                  ${a.overdue.map(l=>this.renderChoreRow(l))}`:f}
            ${a.now.length?d`<h3 class="chore-group">To do</h3>
                  ${a.now.map(l=>this.renderChoreRow(l))}`:f}
            ${a.done.length?d`<h3 class="chore-group">Done</h3>
                  ${a.done.map(l=>this.renderChoreRow(l))}`:f}
            ${a.later.map(l=>d`<h3 class="chore-group">${Ss(l.date,e.today)}</h3>
                ${l.chores.map(p=>this.renderChoreRow(p))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?d`<p class="chore-none">No chores this week.</p>`:f}
          </section>`})}
      </div>
    </div>`}renderLegend(){return d`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return d``;let{day:i,event:r}=n,a=ge(e),l=de(e).get(r.kid)??F(0),p=!!this.pending,m=M=>this.pending?.key===M?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let M of e.days)for(let te of M.events)for(let N of[te.drop,te.pick])N&&N!=="none"&&!a.includes(N)&&!h.some(J=>J.toLowerCase()===N.toLowerCase())&&h.push(N);let g=M=>{if(!r.sides.includes(M))return f;let te=m(M),N=te!==void 0?String(te):M==="drop"?r.drop:r.pick,J=N&&N!=="none"&&!a.includes(N)?N:"",ne=z=>this.setRide(r,M,N===z?"":z),Ee=[...a.map(z=>[z,It(e,z)]),["none","Not needed"]];return d`<div class="field">
        <span class="field-label">${M==="drop"?"Drop-off":"Pick-up"} ${N===""?d`<span class="nobody">· nobody yet</span>`:f}</span>
        <div role="group" aria-label=${M==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${Ee.length}, minmax(0, 1fr))">
          ${Ee.map(([z,se])=>d`<button type="button" class="choice" aria-pressed=${N===z?"true":"false"} ?disabled=${p} @click=${()=>ne(z)}>
                ${se}
              </button>`)}
        </div>
        ${h.length?d`<div role="group" aria-label=${M==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(z=>d`<button type="button" class="chip" aria-pressed=${N.toLowerCase()===z.toLowerCase()?"true":"false"} ?disabled=${p} @click=${()=>ne(z)}>
                    ${z}
                  </button>`)}
            </div>`:f}
        <input
          type="text"
          .value=${J&&!h.some(z=>z.toLowerCase()===J.toLowerCase())?J:""}
          ?disabled=${p}
          aria-label=${M==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${z=>{let se=z.target.value.trim();se&&se!==N&&this.setRide(r,M,se)}}
          @keydown=${z=>{z.key==="Enter"&&z.target.blur()}}
        />
      </div>`},b=m("stay"),v=b!==void 0?!!b:r.stay,u=r.drop===r.pick&&a.includes(r.drop),y=m("along"),P=y!==void 0?y:r.along,x=Pe(e).filter(M=>M!==r.kid),R=a.includes(r.drop)&&r.sides.includes("drop"),K=m("arrive"),T=this.arriveDraft!==void 0?this.arriveDraft:K!==void 0?K:r.arrive_by,H=[],ee=M=>M==="none"?"Not needed":It(e,M);r.drop!==""&&H.push(`Drop-off: ${ee(r.drop)}`),r.pick!==""&&H.push(`Pick-up: ${ee(r.pick)}`),r.stay&&H.push("Stay: yes"),r.along.length&&H.push(`Take along: ${r.along.map(M=>Z(e,M)).join(", ")}`),r.arrive_by!=null&&H.push(`Arrive by: ${Ve(r.arrive_by)}`);let me=m("attending"),Te=me!==void 0?!!me:r.attending!==!1;r.attending===!1&&H.splice(0,H.length,"Attending: no");let pe=i.date===this.today().date?"":`${G(i.date)} · `,Ne=d`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${Z(e,r.kid)} · ${r.title}</span>
          <span class="ed-meta">${pe}${k(r.start)}–${k(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return r.where==="home"?d`${Ne}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${Z(e,r.kid)} can’t get home in time, the board shows it as a clash.</p>`:d`
      ${Ne}
      ${this.pending?d`<p class="saving" role="status">Saving to Google Calendar…</p>`:f}
      ${r.recurring?d`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${G(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:f}
      <div class="field">
        <span class="field-label">${Z(e,r.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${Te?"true":"false"} ?disabled=${p} @click=${()=>this.setAttending(r,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${Te?"false":"true"} ?disabled=${p} @click=${()=>this.setAttending(r,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${Te?d`${r.where==="anywhere"?d`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:f}
            ${g("drop")} ${g("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${v?"true":"false"} ?disabled=${!u||p} @click=${()=>this.toggleStay(r)}>
          ${u?v?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${R&&x.length?d`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${x.map(M=>d`<button type="button" class="chip" aria-pressed=${P.includes(M)?"true":"false"} ?disabled=${p} @click=${()=>this.toggleAlong(r,M)}>
                  ${Z(e,M)}
                </button>`)}
            </div>
          </div>`:f}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${T!=null?`${r.start-T} min before it starts`:`Aims for a few minutes before ${k(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${p} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${T!=null?k(T):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${p||T==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${T!=null?d`<button type="button" class="chip clear" ?disabled=${p} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:f}
`:d`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${H.length?H.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${r.problems.length?d`<p class="field-hint bad">These lines in the notes couldn’t be read: ${r.problems.join("; ")}</p>`:f}
      ${Te?d`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:f}
    `}};Ye.styles=On,Ye.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Ye);var Ze=class extends X{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=gn(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(qe);let n=e.toString();history.replaceState(history.state,"",`${location.pathname}${n?`?${n}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new lt(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return d`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?d`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:f}`}};Ze.styles=ve`
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
  `,Ze.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",Ze);
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
