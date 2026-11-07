var ut=globalThis,gt=ut.ShadowRoot&&(ut.ShadyCSS===void 0||ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ft=Symbol(),Bn=new WeakMap,qe=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==Ft)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(gt&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=Bn.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&Bn.set(e,n))}return n}toString(){return this.cssText}},Nn=s=>new qe(typeof s=="string"?s:s+"",void 0,Ft),Me=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,i,r)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new qe(e,s,Ft)},On=(s,n)=>{if(gt)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=ut.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,s.appendChild(t)}},Vt=gt?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return Nn(e)})(s):s;var{is:Vs,defineProperty:qs,getOwnPropertyDescriptor:Gs,getOwnPropertyNames:Ys,getOwnPropertySymbols:Zs,getPrototypeOf:Xs}=Object,ft=globalThis,In=ft.trustedTypes,Js=In?In.emptyScript:"",Qs=ft.reactiveElementPolyfillSupport,Ge=(s,n)=>s,qt={toAttribute(s,n){switch(n){case Boolean:s=s?Js:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Un=(s,n)=>!Vs(s,n),Hn={attribute:!0,type:String,converter:qt,reflect:!1,useDefault:!1,hasChanged:Un};Symbol.metadata??=Symbol("metadata"),ft.litPropertyMetadata??=new WeakMap;var me=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Hn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&qs(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:r}=Gs(this.prototype,n)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let l=i?.call(this);r?.call(this,o),this.requestUpdate(n,l,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Hn}static _$Ei(){if(this.hasOwnProperty(Ge("elementProperties")))return;let n=Xs(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Ge("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ge("properties"))){let e=this.properties,t=[...Ys(e),...Zs(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(Vt(i))}else n!==void 0&&e.push(Vt(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return On(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:qt).toAttribute(e,t.type);this._$Em=n,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let r=t.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:qt;this._$Em=i;let l=o.fromAttribute(e,r.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(n,e,t,i=!1,r){if(n!==void 0){let o=this.constructor;if(i===!1&&(r=this[n]),t??=o.getPropertyOptions(n),!((t.hasChanged??Un)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:r},o){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??e??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,r]of t){let{wrapped:o}=r,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,r,l)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};me.elementStyles=[],me.shadowRootOptions={mode:"open"},me[Ge("elementProperties")]=new Map,me[Ge("finalized")]=new Map,Qs?.({ReactiveElement:me}),(ft.reactiveElementVersions??=[]).push("2.1.2");var Yt=globalThis,jn=s=>s,mt=Yt.trustedTypes,Wn=mt?mt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Zt="$lit$",be=`lit$${Math.random().toFixed(9).slice(2)}$`,Xt="?"+be,ei=`<${Xt}>`,De=document,Ze=()=>De.createComment(""),Xe=s=>s===null||typeof s!="object"&&typeof s!="function",Jt=Array.isArray,Yn=s=>Jt(s)||typeof s?.[Symbol.iterator]=="function",Gt=`[ 	
\f\r]`,Ye=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Kn=/-->/g,Fn=/>/g,Ee=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Vn=/'/g,qn=/"/g,Zn=/^(?:script|style|textarea|title)$/i,Qt=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),d=Qt(1),V=Qt(2),Gi=Qt(3),xe=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Gn=new WeakMap,Se=De.createTreeWalker(De,129);function Xn(s,n){if(!Jt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Wn!==void 0?Wn.createHTML(n):n}var Jn=(s,n)=>{let e=s.length-1,t=[],i,r=n===2?"<svg>":n===3?"<math>":"",o=Ye;for(let l=0;l<e;l++){let c=s[l],a,h,u=-1,m=0;for(;m<c.length&&(o.lastIndex=m,h=o.exec(c),h!==null);)m=o.lastIndex,o===Ye?h[1]==="!--"?o=Kn:h[1]!==void 0?o=Fn:h[2]!==void 0?(Zn.test(h[2])&&(i=RegExp("</"+h[2],"g")),o=Ee):h[3]!==void 0&&(o=Ee):o===Ee?h[0]===">"?(o=i??Ye,u=-1):h[1]===void 0?u=-2:(u=o.lastIndex-h[2].length,a=h[1],o=h[3]===void 0?Ee:h[3]==='"'?qn:Vn):o===qn||o===Vn?o=Ee:o===Kn||o===Fn?o=Ye:(o=Ee,i=void 0);let f=o===Ee&&s[l+1].startsWith("/>")?" ":"";r+=o===Ye?c+ei:u>=0?(t.push(a),c.slice(0,u)+Zt+c.slice(u)+be+f):c+be+(u===-2?l:f)}return[Xn(s,r+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},Je=class s{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let r=0,o=0,l=n.length-1,c=this.parts,[a,h]=Jn(n,e);if(this.el=s.createElement(a,t),Se.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=Se.nextNode())!==null&&c.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Zt)){let m=h[o++],f=i.getAttribute(u).split(be),C=/([.?@])?(.*)/.exec(m);c.push({type:1,index:r,name:C[2],strings:f,ctor:C[1]==="."?xt:C[1]==="?"?vt:C[1]==="@"?yt:ze}),i.removeAttribute(u)}else u.startsWith(be)&&(c.push({type:6,index:r}),i.removeAttribute(u));if(Zn.test(i.tagName)){let u=i.textContent.split(be),m=u.length-1;if(m>0){i.textContent=mt?mt.emptyScript:"";for(let f=0;f<m;f++)i.append(u[f],Ze()),Se.nextNode(),c.push({type:2,index:++r});i.append(u[m],Ze())}}}else if(i.nodeType===8)if(i.data===Xt)c.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf(be,u+1))!==-1;)c.push({type:7,index:r}),u+=be.length-1}r++}}static createElement(n,e){let t=De.createElement("template");return t.innerHTML=n,t}};function Le(s,n,e=s,t){if(n===xe)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,r=Xe(n)?void 0:n._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=Le(s,i._$AS(s,n.values),i,t)),n}var bt=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??De).importNode(e,!0);Se.currentNode=i;let r=Se.nextNode(),o=0,l=0,c=t[0];for(;c!==void 0;){if(o===c.index){let a;c.type===2?a=new Ie(r,r.nextSibling,this,n):c.type===1?a=new c.ctor(r,c.name,c.strings,this,n):c.type===6&&(a=new wt(r,this,n)),this._$AV.push(a),c=t[++l]}o!==c?.index&&(r=Se.nextNode(),o++)}return Se.currentNode=De,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},Ie=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Le(this,n,e),Xe(n)?n===b||n==null||n===""?(this._$AH!==b&&this._$AR(),this._$AH=b):n!==this._$AH&&n!==xe&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Yn(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==b&&Xe(this._$AH)?this._$AA.nextSibling.data=n:this.T(De.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=Je.createElement(Xn(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new bt(i,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(n){let e=Gn.get(n.strings);return e===void 0&&Gn.set(n.strings,e=new Je(n)),e}k(n){Jt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let r of n)i===e.length?e.push(t=new s(this.O(Ze()),this.O(Ze()),this,this.options)):t=e[i],t._$AI(r),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=jn(n).nextSibling;jn(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},ze=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,r){this.type=1,this._$AH=b,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=b}_$AI(n,e=this,t,i){let r=this.strings,o=!1;if(r===void 0)n=Le(this,n,e,0),o=!Xe(n)||n!==this._$AH&&n!==xe,o&&(this._$AH=n);else{let l=n,c,a;for(n=r[0],c=0;c<r.length-1;c++)a=Le(this,l[t+c],e,c),a===xe&&(a=this._$AH[c]),o||=!Xe(a)||a!==this._$AH[c],a===b?n=b:n!==b&&(n+=(a??"")+r[c+1]),this._$AH[c]=a}o&&!i&&this.j(n)}j(n){n===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},xt=class extends ze{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===b?void 0:n}},vt=class extends ze{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==b)}},yt=class extends ze{constructor(n,e,t,i,r){super(n,e,t,i,r),this.type=5}_$AI(n,e=this){if((n=Le(this,n,e,0)??b)===xe)return;let t=this._$AH,i=n===b&&t!==b||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,r=n!==b&&(t===b||i);i&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},wt=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){Le(this,n)}},Qn={M:Zt,P:be,A:Xt,C:1,L:Jn,R:bt,D:Yn,V:Le,I:Ie,H:ze,N:vt,U:yt,B:xt,F:wt},ti=Yt.litHtmlPolyfillSupport;ti?.(Je,Ie),(Yt.litHtmlVersions??=[]).push("3.3.3");var es=(s,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let r=e?.renderBefore??null;t._$litPart$=i=new Ie(n.insertBefore(Ze(),r),r,void 0,e??{})}return i._$AI(s),i};var en=globalThis,re=class extends me{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=es(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return xe}};re._$litElement$=!0,re.finalized=!0,en.litElementHydrateSupport?.({LitElement:re});var ni=en.litElementPolyfillSupport;ni?.({LitElement:re});(en.litElementVersions??=[]).push("4.2.2");var He="mydashlight",ar=`/api/${He}/pair`,lr=`/api/${He}/pair/poll`,dr=`/${He}`,Qe="pair";function ts(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function tn(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,"")}function ns(s){let n=new URLSearchParams(s);return n.has(Qe)?tn(n.get(Qe)??""):null}function si(s){if(s<60)return"just now";let n=Math.round(s/60);return`${n} minute${n===1?"":"s"} ago`}var et=class extends re{constructor(){super();this.typed="";this.connection=null,this.userName="",this.isAdmin=!0,this.code="",this.step="enter",this.error=null,this.waiting=null}willUpdate(e){(e.has("code")||e.has("connection"))&&this.connection&&this.code&&this.step==="enter"&&this.check(this.code)}close(){this.dispatchEvent(new CustomEvent("close"))}async check(e){if(this.connection){this.step="checking",this.error=null;try{let t=await this.connection.sendMessagePromise({type:`${He}/pair/check`,code:e});t.found?(this.waiting=t,this.step="confirm"):(this.error="No screen is showing that code. Codes change every 10 minutes; check the screen.",this.step="enter")}catch(t){this.error=this.message(t),this.step="enter"}}}async approve(){if(!(!this.connection||!this.waiting?.code)){this.step="approving",this.error=null;try{await this.connection.sendMessagePromise({type:`${He}/pair/approve`,code:this.waiting.code}),this.step="done"}catch(e){this.error=this.message(e),this.step="enter"}}}message(e){let t=e?.code;return t==="unauthorized"?"Only a Home Assistant admin can pair a screen.":t==="not_found"?"That code isn’t waiting any more. Check the screen for a new one.":t==="unknown_command"?"This version of MyDashLight can’t pair screens. Update it in HACS.":"Something went wrong. Try again."}enter(){let e=this.step==="checking";return d`<form @submit=${i=>{i.preventDefault();let r=tn(this.typed);r&&this.check(r)}}>
      <h2>Pair a screen</h2>
      <p>Type the code the screen is showing.</p>
      ${this.error?d`<p class="error" role="alert">${this.error}</p>`:b}
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
      <p class="code">${ts(e.code??"")}</p>
      ${i?d`<p class="warning" role="alert">
            <b>This code came from outside your home network.</b> Only allow it if you can see this code on a
            screen of your own right now. If someone sent you this code or link, press Cancel.
          </p>`:b}
      <p>
        A screen at ${e.address} asked ${si(e.age??0)}. Check the code matches the one on the screen. It will be
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
        <div class="actions"><button type="button" class="dark" @click=${()=>this.close()}>Close</button></div>`,d`<div class="card" role="dialog" aria-modal="true" aria-label="Pair a screen">${e}</div>`}};et.styles=Me`
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
  `,et.properties={connection:{attribute:!1},userName:{attribute:!1},isAdmin:{attribute:!1},code:{},step:{state:!0},error:{state:!0},waiting:{state:!0}};customElements.get("mydashlight-pair-approve")||customElements.define("mydashlight-pair-approve",et);function T(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function tt(s){let n=Math.floor(Math.round(s)/60)%24;return`${T(s)} ${n<12?"AM":"PM"}`}function ss(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function st(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function is(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var ii=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),ri=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),oi=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function $t(s){return new Date(`${s}T12:00:00Z`)}function ce(s){let n=$t(s);return`${ii.format(n)}, ${oi.format(n)}`}function J(s){return ri.format($t(s))}function he(s,n){return Math.round(($t(n).getTime()-$t(s).getTime())/864e5)}function nt(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return nt("UTC",n)}let t=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function kt(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let i=nt(e,s),r=nt(e,n).date;return i.date===r?`at ${tt(i.minutes)}`:`on ${J(i.date)} at ${tt(i.minutes)}`}var j=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}},Re="mydashlight",ai=7,rs=3e4;function nn(s){if(s instanceof j)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new j(String(n.code??"error"),n.message)}return typeof s=="number"?new j("connection_lost","Lost the connection to Home Assistant."):new j("error",String(s))}var Ct=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new j("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.pushing}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},rs),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,n&&n().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(n=>{this.pushing=!0,n.plan?this.emit(n.plan):this.fail(new j("not_running","MyDashLight isn’t running right now."))},{type:`${Re}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await this.conn.sendMessagePromise({type:"call_service",domain:Re,service:"get_plan",service_data:{days:ai},return_response:!0});this.emit(n.response)}catch(n){this.fail(nn(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Re,service:n,service_data:e})}catch(t){throw nn(t)}this.pushing||await this.refresh()}setRide(n,e,t,i){return this.call("set_ride",{event:n,side:e,driver:t,scope:i})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:is(e),scope:t})}setTakeAlong(n,e,t){return this.call("set_take_along",{event:n,kids:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}watchChores(n){let e=!1,t=null,i=null,r=async()=>{try{let o=await this.conn.sendMessagePromise({type:"call_service",domain:Re,service:"get_chores",service_data:{},return_response:!0});e||n(o.response??null)}catch{e||n(null)}};return(async()=>{try{let o=await this.conn.subscribeMessage(l=>{e||n(l.chores)},{type:`${Re}/chores/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):t=o}catch{if(e)return;r(),i=setInterval(()=>void r(),rs)}})(),()=>{e=!0,i&&clearInterval(i),t&&t().catch(()=>{})}}watchLunch(n){let e=!1,t=null;return(async()=>{try{let i=await this.conn.subscribeMessage(r=>{e||n(r.lunch)},{type:`${Re}/lunch/subscribe`},{resubscribe:!0});e?i().catch(()=>{}):t=i}catch{e||n(null)}})(),()=>{e=!0,t&&t().catch(()=>{})}}async setLunch(n,e,t){await this.choreCall("set_lunch",{kid:n,dates:e,lunch:t??"default"})}async setLunchMenu(n,e,t,i){await this.choreCall("set_lunch_menu",{kids:n,date:e,menu:t,details:i})}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Re,service:n,service_data:e})}catch(t){throw nn(t)}}};var os={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},as=s=>(...n)=>({_$litDirective$:s,values:n}),_t=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:li}=Qn,ls=s=>s;var ds=()=>document.createComment(""),Ue=(s,n,e)=>{let t=s._$AA.parentNode,i=n===void 0?s._$AB:n._$AA;if(e===void 0){let r=t.insertBefore(ds(),i),o=t.insertBefore(ds(),i);e=new li(r,o,s,s.options)}else{let r=e._$AB.nextSibling,o=e._$AM,l=o!==s;if(l){let c;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(c=s._$AU)!==o._$AU&&e._$AP(c)}if(r!==i||l){let c=e._$AA;for(;c!==r;){let a=ls(c).nextSibling;ls(t).insertBefore(c,i),c=a}}}return e},Ce=(s,n,e=s)=>(s._$AI(n,e),s),di={},cs=(s,n=di)=>s._$AH=n,hs=s=>s._$AH,Pt=s=>{s._$AR(),s._$AA.remove()};var ps=(s,n,e)=>{let t=new Map;for(let i=n;i<=e;i++)t.set(s[i],i);return t},ve=as(class extends _t{constructor(s){if(super(s),s.type!==os.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let i=[],r=[],o=0;for(let l of s)i[o]=t?t(l,o):o,r[o]=e(l,o),o++;return{values:r,keys:i}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let i=hs(s),{values:r,keys:o}=this.dt(n,e,t);if(!Array.isArray(i))return this.ut=o,r;let l=this.ut??=[],c=[],a,h,u=0,m=i.length-1,f=0,C=r.length-1;for(;u<=m&&f<=C;)if(i[u]===null)u++;else if(i[m]===null)m--;else if(l[u]===o[f])c[f]=Ce(i[u],r[f]),u++,f++;else if(l[m]===o[C])c[C]=Ce(i[m],r[C]),m--,C--;else if(l[u]===o[C])c[C]=Ce(i[u],r[C]),Ue(s,c[C+1],i[u]),u++,C--;else if(l[m]===o[f])c[f]=Ce(i[m],r[f]),Ue(s,i[u],i[m]),m--,f++;else if(a===void 0&&(a=ps(o,f,C),h=ps(l,u,m)),a.has(l[u]))if(a.has(l[m])){let p=h.get(o[f]),x=p!==void 0?i[p]:null;if(x===null){let $=Ue(s,i[u]);Ce($,r[f]),c[f]=$}else c[f]=Ce(x,r[f]),Ue(s,i[u],x),i[p]=null;f++}else Pt(i[m]),m--;else Pt(i[u]),u++;for(;f<=C;){let p=Ue(s,c[C+1]);Ce(p,r[f]),c[f++]=p}for(;u<=m;){let p=i[u++];p!==null&&Pt(p)}return this.ut=o,cs(s,c),xe}});var Tt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function W(s){return Tt[(s%Tt.length+Tt.length)%Tt.length]}var At="#23272E",sn="35,39,46";var ci=3,Lt=36,rn=12,us=8,gs=30,pe=16,it=100,on=60,an=10,Et=30,ln=10,hi=150,pi=200,Dt=1.4;function cn(s,n){let e=Math.max(hi,pi/Dt);return Math.ceil(on+Math.max(0,s-1)*an+Et+Math.max(0,n-1)*ln+e*(s+Dt*n))}function ye(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function we(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function se(s){return new Map(ye(s).map((n,e)=>[n,W(e)]))}function oe(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function ie(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function hn(s,n){return n==="none"?"Not needed":we(s).includes(n)?ie(s,n):n}function zt(s,n){return n.own?ie(s,n.own):oe(s,n.kid)}var Rt={color:At,rgb:sn,ink:At};function xs(s,n){return n.own?Rt:se(s).get(n.kid)??W(0)}function ui(s,n){let e=ye(s);return n.along.map(t=>e.includes(t)?oe(s,t):ie(s,t))}function pn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function gi(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function St(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function Mt(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(St(n,t.from)),e.push(St(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(St(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function fi(s){let n=s.map(o=>({...o,col:0,cols:1})).sort((o,l)=>o.s-l.s||l.en-o.en),e=[],t=[],i=-1/0,r=()=>{for(let o of e)o.cols=t.length;e=[],t=[]};for(let o of n){o.s>=i&&(r(),i=-1/0);let l=t.findIndex(c=>c<=o.s);l<0?(l=t.length,t.push(o.en)):t[l]=o.en,o.col=l,e.push(o),i=Math.max(i,o.en)}return r(),n}function mi(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.t)return i.t===t.t?t.y:Math.round(t.y+(n-t.t)/(i.t-t.t)*(i.y-t.y))}return s[s.length-1].y}function bi(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.y)return i.y===t.y?t.t:t.t+(n-t.y)/(i.y-t.y)*(i.t-t.t)}return s[s.length-1].t}function vs(s,n){return mi(s.anchors,n)}function ys(s,n){return bi(s.anchors,n)}function xi(s,n){let e=ye(s),t=we(s),i=Math.max(n,cn(e.length,t.length)),o=(i-on-Math.max(0,e.length-1)*an-Et-Math.max(0,t.length-1)*ln)/(e.length+Dt*t.length||1),l=Math.floor(o),c=Math.floor(o*Dt),a=new Map;for(let C of s.days)for(let p of C.events)for(let x of p.own?p.along:[p.kid]){let $=a.get(x)??[];$.some(v=>v.event_id===p.event_id&&v.calendar_id===p.calendar_id)||$.push(p),a.set(x,$)}let h=se(s),u=[],m=on;e.forEach((C,p)=>{let x=a.get(C)??[],$=s.days.some(v=>v.events.some(L=>L.kid===C&&(L.sides.includes("drop")&&L.drop===""||L.sides.includes("pick")&&L.pick==="")));u.push({id:C,kind:"kid",x:m,w:l,name:oe(s,C),dot:h.get(C).color,rgb:h.get(C).rgb,sub:`${$?"Needs a ride · ":""}${x.length} this week`,subWarn:$}),m+=l+(p<e.length-1?an:0)});let f=m+Et/2;return m+=Et,t.forEach((C,p)=>{let x=0,$=0;for(let v of s.days){let L=v.drivers[C];L&&(x+=L.outings.length,$+=L.drive??0)}u.push({id:C,kind:"driver",x:m,w:c,name:ie(s,C),dot:At,rgb:sn,sub:`${x} ${x===1?"trip":"trips"} this week · ${st($)} driving`,subWarn:!1}),m+=c+(p<t.length-1?ln:0)}),{columns:u,sepX:f,width:i}}function vi(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(n.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let o=i.slice(r[0].length);return o?o[0].toUpperCase()+o.slice(1):e}function fs(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${T(s.start)}`:e||!n?`${s.title} until ${T(s.end)}`:`${s.title} ${T(s.start)}–${T(s.end)}`}function un(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length}function gn(s,n){let e=he(n,s);return e===0?"Today":e===1?"Tomorrow":""}function Z(s,n=0){return s==null||!Number.isFinite(s)?n:s}function dn(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),i=1,r=0;for(let o of s.split(/\s+/).filter(Boolean)){let l=o.length;for(r===0?r=l:r+1+l<=t?r+=1+l:(i++,r=l);r>t;)i++,r-=t}return i}var ws=25,$s=15,fn=3;function ms(s){return Math.max(0,Math.min(fn,Math.floor((s-ws)/$s)))}function yi(s,n){let e=Math.min(fn,dn(s,n-19,6.6));return ws+e*$s+2}function bs(s,n){let e=n-23,t=`${T(s.start)}–${T(s.end)}`+(s.arrive_by!=null?` · arrive ${T(s.arrive_by)}`:""),i=33+dn(t,e,6.6)*16;for(let r of[s.lines.drop,s.lines.pick])r&&(i+=2+dn(r.text,e,7)*16);return i+4}function ks(s,n,e,t){let i=n==="compact",{columns:r,sepX:o,width:l}=xi(s,e),c=new Map(r.map(v=>[v.id,v])),a=ye(s),h=we(s),u=[...a,...h],m=se(s),f=gi(s),C=v=>oe(s,v),p=v=>ie(s,v),x={mode:n,width:l,height:0,columns:r,sepX:o,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},$=0;return s.days.forEach((v,L)=>{let Q=L*1440,B=new Map(v.events.map(g=>[g.id,g])),ee=g=>g&&B.has(g)?{day:v.date,event:g}:null,q=un(v),_e=v.events.length,dt=gn(v.date,t.date);x.dayHeads.push({date:v.date,y:$,label:ce(v.date),tag:dt,sub:(_e?`${_e} ${_e===1?"activity":"activities"}`:"Nothing scheduled")+(q?` · ${q} to sort out`:""),warn:q>0}),x.anchors.push({t:Q,y:$});let ae=$+Lt+rn,ct=h.flatMap(g=>v.drivers[g]?.outings??[]);if(!_e&&!ct.length){x.empties.push({key:v.date,y:ae,text:"Nothing planned"}),$=ae+40,x.anchors.push({t:Q+1439,y:$});return}let Pe=(g,_,M,P,R,X,y,z=g.kid)=>{let Y=!!g.own&&z===g.own,Ae=!!g.own&&z!==g.own,F=Y?Rt:m.get(z)??W(0),ke=Y?p(z):C(z),te=Ae?{drop:{text:`With ${p(g.own)}`,tone:g.attending===!1?"muted":"normal"},pick:null}:g.lines,k=Y?ui(s,g):[],U=(g.takes!=null?`${g.takes} min, any time ${T(g.start)}–${T(g.end)}`:`${T(g.start)}–${T(g.end)}`+(g.arrive_by!=null?` · arrive ${T(g.arrive_by)}`:""))+(k.length?` · with ${pn(k)}`:"");return{key:`${v.date}|card|${g.id}`+(g.own?`|${z}`:""),x:_,y:M,w:P,h:R,target:{day:v.date,event:g.id},event:g,color:F,kidName:ke,clash:X,stayed:!g.own&&g.stay&&h.includes(g.drop),skipped:g.attending===!1,title:vi(g.title,ke),time:U,drop:te.drop,pick:te.pick,showDrop:!!te.drop&&(y||R>=56),showPick:!!te.pick&&(y||R>=74),wrap:y,aria:`${ke}, ${g.title} ${g.takes!=null?`any time from ${T(g.start)} to ${T(g.end)}`:`${T(g.start)} to ${T(g.end)}`}. `+(g.attending===!1&&!te.drop?"Not attending. ":"")+[te.drop,te.pick].filter(w=>!!w).map(w=>w.text).join(". ")}},D=g=>{let _=v.rides[g];return _?(v.drivers[_.driver]?.segments??[]).filter(P=>P.type!=="home"&&P.kids.includes(_.kid)&&Z(P.start)>=Z(_.start)&&Z(P.end)<=Z(_.end)):[]},$e=g=>{let _=v.rides[g];if(!_)return null;let M=_.serves.find(P=>B.get(P)?.kid===_.kid);return ee(M??_.serves[0])},K=(g,_)=>{if(_.event)return _;let M=v.events.find(P=>P.own&&P.own!==g&&P.along.includes(g)&&P.title===_.title);return M?{..._,title:`${_.title} with ${p(M.own)}`}:_},fe=g=>{if(g.takes==null)return[g.start,g.end];let _=g.planned??g.start;return[_,_+g.takes]},Te=new Map;for(let g of v.issues)g.level!=="problem"||!g.event||(g.kind==="late"&&Te.set(g.event,`${Math.round(Z(g.minutes))} min late`),g.kind==="waiting"&&Te.set(`${g.event}|pick`,`Waits ${Math.round(Z(g.minutes))} min`));if(!i){let g=1/0,_=-1/0;for(let y of v.events)y.start<=0&&y.end>=1440||(y.start>0?g=Math.min(g,y.start-20,y.arrive_by!=null?y.arrive_by-10:1/0):g=Math.min(g,y.end-30),y.end<1440?_=Math.max(_,y.end+20):_=Math.max(_,y.start+30));for(let y of ct)y.start!=null&&(g=Math.min(g,y.start)),y.end!=null&&(_=Math.max(_,y.end));v.date===t.date&&Number.isFinite(g)&&t.minutes>g-60&&t.minutes<_&&(g=Math.min(g,t.minutes-15));let M=Number.isFinite(g)?Math.floor((g-5)/30)*30:900,P=Number.isFinite(_)?Math.ceil((_+5)/30)*30:960,R=y=>Math.round(ae+(Math.max(M,Math.min(P,y))-M)*ci);x.anchors.push({t:Q+M,y:R(M)},{t:Q+P,y:R(P)});for(let y of a){let z=c.get(y),Y=m.get(y),Ae=(v.kids[y]?.items??[]).filter(w=>w.start!=null&&w.end!=null).map(w=>({item:w,s:Z(w.start),en:Z(w.end)})),F=[];for(let w of fi(Ae)){let A=z.w/w.cols,E=Math.round(z.x+w.col*A),N=Math.round(A-(w.cols>1?4:0)),H=R(w.s),O=w.item;if(O.type==="act"){let ne=B.get(O.event??"");if(!ne)continue;let ht=Math.max(30,R(w.en)-H),pt=Pe(ne,E,H,N,ht,O.clash,!1,y);if(pt.layer=it,x.cards.push(pt),ne.arrive_by!=null&&ne.start-ne.arrive_by>=5){let Kt=R(ne.arrive_by),Rn={key:`${v.date}|prep|${ne.id}`,x:E,y:Kt,w:N,h:H-Kt+pe,color:Y,label:`Arrive by ${T(ne.arrive_by)}`,layer:it-1};x.preps.push(Rn),F.push({s:ne.arrive_by,en:w.en,top:Kt,bottom:H+ht,x:E,w:N,prep:Rn,card:pt})}else F.push({s:w.s,en:w.en,top:H,bottom:H+ht,x:E,w:N,card:pt});let Ln=Te.get(ne.id);Ln&&x.marks.push({key:`${v.date}|late|${ne.id}`,x:E+N-4,y:H+4,text:Ln,right:!0});let zn=Te.get(`${ne.id}|pick`);zn&&x.marks.push({key:`${v.date}|wait|${ne.id}`,x:E+4,y:H+ht+2,text:zn,right:!1});continue}let S=v.rides[O.ride??-1];if(!S)continue;let de=Math.max(22,R(w.en)-H),Ve=Mt(D(S.index),f),En=p(S.driver),Sn={key:`${v.date}|ride|${S.index}`,x:E,y:H,w:N,h:de,target:$e(S.index),l1:`${S.own?"In":"Along in"} ${En}’s car`,l2:Ve.join(" → "),show2:ms(de)>0,lines2:ms(de),dashed:!S.own,clash:O.clash,aria:`${C(y)} ${S.own?"in":"riding along in"} ${En}’s car, ${T(Z(S.start))} to ${T(Z(S.end))}: ${Ve.join(" to ")}`};x.rides.push(Sn);let Dn=c.get(S.driver),Wt=null;Dn&&(Wt={key:`${v.date}|band|${S.index}`,x:E+N,y:H,w:Math.max(0,Dn.x+8-(E+N)),h:de,color:Y},x.bands.push(Wt)),F.push({s:w.s,en:w.en,top:H,bottom:H+de,x:E,w:N,ride:Sn,band:Wt})}let ke=w=>w.ride?.layer??(w.prep?it-1:it),te=(w,A,E,N)=>{E>pe&&x.links.push({key:`${w.key}|link`,x:w.x,y:A,w:w.w,h:E,color:Y,layer:N})},k=(w,A)=>{if(!(A.x<w.x||A.x+A.w>w.x+w.w)&&(w.x=A.x,w.w=A.w,w.ride.x=A.x,w.ride.w=A.w,w.band)){let E=w.band.x+w.band.w;w.band.x=A.x+A.w,w.band.w=Math.max(0,E-w.band.x)}},U=new Set;for(let w of[...F].sort((A,E)=>E.s-A.s)){let A=w.ride;if(!A)continue;let E=F.filter(O=>O!==w&&O.s>=w.en&&O.s-w.en<=gs&&O.top>=w.bottom).sort((O,S)=>O.s-S.s||O.top-S.top)[0];if(!E)continue;U.add(w),k(w,E);let N=ke(E),H=E.top-w.bottom;te(A,w.bottom,H+pe,N-1),A.layer=N-(H>0?2:1),A.h+=pe,A.tuckBottom=pe}for(let w of[...F].sort((A,E)=>A.s-E.s)){let A=w.ride;if(!A||U.has(w))continue;let E=F.filter(O=>O!==w&&O.en<=w.s&&w.s-O.en<=gs&&O.bottom<=w.top&&(O.card||O.ride?.layer!=null)).sort((O,S)=>S.en-O.en||S.bottom-O.bottom)[0];if(!E)continue;k(w,E);let N=E.ride?.layer??it,H=w.top-E.bottom;te(A,E.bottom-pe,H+pe,N-1),A.layer=N-(H>0?2:1),A.y-=pe,A.h+=pe,A.tuckTop=pe}}for(let y of h){let z=c.get(y),Y=v.drivers[y];if(!Y)continue;let Ae=[],F=null;for(let k of Y.segments)if(!(k.start==null||k.end==null)){if(k.type==="home"){F=null;continue}if(k.type==="stay"){F=null,Ae.push({type:"stay",g:k,s:k.start,en:k.end});continue}F&&F.en===k.start?(F.en=k.end,F.legs.push(k)):(F={type:"trip",s:k.start,en:k.end,legs:[k]},Ae.push(F))}let ke=new Set,te=(k,U,w,A)=>{ke.add(k.id);let E=R(U),N=Pe(k,z.x+8,E,z.w-16,Math.max(30,R(w)-E),!1,!1,y);A&&N.drop?.tone==="normal"&&(N.drop=null,N.showDrop=!1),x.cards.push(N)};for(let k of Ae){let U=R(k.s),w=Math.max(24,R(k.en)-U);if(k.type==="stay"){let S=B.get(k.g.event??k.g.serves??"");if(S?.own===y){te(S,k.s,k.en,!0);continue}let de=S?m.get(S.kid)??W(0):W(0),Ve=k.g.kids.map(C);x.stays.push({key:`${v.date}|stay|${y}|${k.s}`,x:z.x+8,y:U,w:z.w-16,h:w,target:ee(S?.id),color:de,l1:S?`At ${S.title} with ${C(S.kid)}`:"Staying",l2:`until ${T(k.en)}`+(Ve.length?` · ${Ve.join(" and ")} too`:"")});continue}let A=k.legs[0],E=k.legs[k.legs.length-1],N=[];for(let S of k.legs)for(let de of S.kids)N.includes(de)||N.push(de);let H=E.type==="drive"&&E.to==="home",O=Mt(k.legs,f);x.trips.push({key:`${v.date}|trip|${y}|${k.s}`,x:z.x+8,y:U,w:z.w-16,h:w,target:ee(k.legs.find(S=>S.serves)?.serves),l1:A.type==="drive"&&A.from==="home"?`Leave ${T(k.s)}`:`From ${St(f,A.from??A.place)} ${T(k.s)}`,l2:O.join(" → "),show2:w>=36,l3:H?`Home ${T(k.en)}`:"",show3:H&&w>=62,stops:null,kids:N.map(S=>(m.get(S)??W(0)).color),bad:k.legs.some(S=>S.overlaps_busy),aria:`${p(y)} drives ${O.join(" to ")}, ${T(k.s)} to ${T(k.en)}`})}for(let k of Y.segments)if(!(!k.overlaps_busy||k.start==null||k.end==null))for(let U of Y.busy){let w=Math.max(k.start,U.start),A=Math.min(k.end,U.end);A<=w||x.overlaps.push({key:`${v.date}|overlap|${y}|${w}`,x:z.x+6,y:R(w)-2,w:z.w-12,h:Math.max(8,R(A)-R(w)+4)})}for(let k of v.events)if(k.own===y&&(ke.has(k.id)||te(k,...fe(k),!1),k.takes!=null&&k.attending!==!1)){let U=R(k.start);x.windows.push({key:`${v.date}|window|${k.id}`,x:z.x+4,y:U,w:z.w-8,h:Math.max(24,R(k.end)-U),label:`${k.title} · any time ${T(k.start)}–${T(k.end)}`})}for(let k of Y.busy){if(k.event||k.end<=M||k.start>=P)continue;let U=K(y,k),w=R(U.start),A=R(U.end);x.busy.push({key:`${v.date}|busy|${y}|${U.start}`,x:z.x+1,y:w,w:z.w-2,h:A-w,labelY:8,label:fs(U,!1)})}}let X=-1/0;for(let y=M;y<=P;y+=30)x.grid.push({key:`${v.date}|grid|${y}`,y:R(y),strong:y%60===0}),y%60===0&&R(y)-X>=22&&(x.hours.push({key:`${v.date}|hour|${y}`,y:R(y)-8,label:ss(y)}),X=R(y));v.date===t.date&&t.minutes>M&&t.minutes<P&&(x.now={y:R(t.minutes),label:`Now ${T(t.minutes)}`}),$=R(P)+rn;return}let le=[];for(let g of a){let _=c.get(g);for(let M of v.kids[g]?.items??[])if(M.start!=null){if(M.type==="act"){let P=B.get(M.event??"");if(!P)continue;le.push({col:g,s:M.start,h:bs(P,_.w),kind:"act",item:M})}else if(!v.rides[M.ride??-1]?.own){let P=v.rides[M.ride??-1],R=P?Mt(D(P.index),f).join(" → "):"";le.push({col:g,s:M.start,h:yi(R,_.w),kind:"along",item:M})}}}for(let g of h){let _=v.drivers[g];if(!_)continue;for(let P of _.busy)P.event||le.push({col:g,s:P.start,h:32,kind:"busy",busy:K(g,P)});let M=c.get(g).w;for(let P of v.events)P.own!==g||P.attending!==!1&&(P.takes==null||P.planned!=null)||le.push({col:g,s:fe(P)[0],h:bs(P,M),kind:"own",event:P});for(let P of _.outings)P.start!=null&&le.push({col:g,s:P.start,h:30+P.lines.length*16+(P.warn?16:0),kind:"out",out:P})}le.sort((g,_)=>g.s-_.s||u.indexOf(g.col)-u.indexOf(_.col));let I=new Map,G=[],Mn=ae;le.forEach((g,_)=>{let M=I.get(g.col),P=Math.max(M!=null?M+us:ae,Mn);I.set(g.col,P+g.h),Mn=P;let R=g.kind==="busy"?g.busy.end:g.kind==="act"?B.get(g.item.event??"")?.end??null:g.kind==="own"?fe(g.event)[1]:null;G.push({col:g.col,s:g.s,end:R,y:P,h:g.h,box:null}),x.anchors.push({t:Q+g.s,y:P});let X=c.get(g.col);if(g.kind==="busy"){let y={key:`${v.date}|busy|${g.col}|${_}`,x:X.x+1,y:P,w:X.w-2,h:g.h,labelY:8,label:fs(g.busy,!0)};x.busy.push(y),G[G.length-1].box=y}else if(g.kind==="out"){let y=g.out;x.trips.push({key:`${v.date}|trip|${g.col}|${_}`,x:X.x+8,y:P,w:X.w-16,h:g.h,target:ee(y.target),l1:y.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...y.lines.map(z=>({text:z,warn:!1})),...y.warn?[{text:y.warn,warn:!0}]:[]],kids:y.kids.map(z=>(m.get(z)??W(0)).color),bad:!!y.warn,aria:`${p(g.col)}: ${y.lead}. ${y.lines.join(". ")}${y.warn?`. ${y.warn}`:""}`})}else if(g.kind==="own"){let y=Pe(g.event,X.x+8,P,X.w-16,g.h,!1,!0,g.col);x.cards.push(y),G[G.length-1].box=y}else if(g.kind==="act"){let y=B.get(g.item.event??""),z=Pe(y,X.x,P,X.w,g.h,g.item.clash,!0,g.col);x.cards.push(z),G[G.length-1].box=z}else{let y=v.rides[g.item.ride??-1],z=Mt(D(y.index),f),Y=p(y.driver);x.rides.push({key:`${v.date}|ride|${y.index}`,x:X.x,y:P,w:X.w,h:g.h,target:$e(y.index),l1:`Along with ${Y} ${T(Z(y.start))}`,l2:z.join(" → "),show2:!0,lines2:fn,dashed:!0,clash:g.item.clash,aria:`${C(g.col)} riding along with ${Y}, ${T(Z(y.start))} to ${T(Z(y.end))}: ${z.join(" to ")}`})}});let Fe=ae;for(let g of I.values())Fe=Math.max(Fe,g);for(let g of G){if(!g.box||g.end==null)continue;let _=g.y+g.h;for(let M of G)M.col!==g.col&&M.s>=g.s&&M.s<g.end&&(_=Math.max(_,M.y+M.h));g.end>=1440&&(_=Fe);for(let M of G)M.col===g.col&&M.y>g.y&&(_=Math.min(_,M.y-us));_=Math.min(_,Fe),_>g.y+g.h&&(g.box.h=_-g.y)}$=Fe+rn+6,x.anchors.push({t:Q+1439,y:$})}),x.height=$,x}var wi=["","¼","½","¾"];function Be(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return st(t);let i=Math.round(t*4),r=Math.floor(i/4),o=wi[i%4];return`${r||!o?r:""}${o} min`})}function Cs(s){let n=e=>e?{...e,text:Be(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,i])=>[t,{...i,outings:i.outings.map(r=>({...r,lines:r.lines.map(Be),warn:r.warn==null?r.warn:Be(r.warn)}))}])),issues:e.issues.map(t=>({...t,title:Be(t.title),body:Be(t.body),note:t.note==null?t.note:Be(t.note),...t.suggestions?{suggestions:t.suggestions.map(i=>({...i,note:Be(i.note)}))}:{}}))}))}}var $i=2,ki=48;function _s(s,n,e=ki){let t=[],i=0,r=0,o=0,l=0,c=n.minutes+e*60;for(let a of s.days){let h=he(n.date,a.date),u=h===0?"":`${J(a.date)} · `,m=new Map(a.events.map(p=>[p.id,p])),f=p=>p&&m.has(p)?{day:a.date,event:p}:null,C=(p,x)=>h*1440+(p??m.get(x??"")?.start??0)<c;for(let p of a.issues)if(p.level==="problem"){if(!C(p.at,p.event)){o++,p.kind==="unassigned"&&l++;continue}i++,p.kind==="unassigned"&&r++,t.push({key:`${a.date}|${p.key}`,tone:p.kind==="unassigned"?"unassigned":"problem",title:u+p.title,body:p.body,target:f(p.event),suggestions:(p.suggestions??[]).map(x=>({id:x.id,label:x.label,note:x.note}))})}if(a.clashes.forEach((p,x)=>{if(!C(p.a.start,p.a.event)){o++;return}i++;let $=m.get(p.a.event??""),v=oe(s,p.kid),L=(B,ee)=>{let q=f(ee);return q?{text:B,target:q}:B},Q=[];if(p.b.type==="act"){let B=m.get(p.b.event??"");$&&B&&(Q=[L($.title,$.id),` ${T($.start)}–${T($.end)} and `,L(B.title,B.id),` ${T(B.start)}–${T(B.end)} overlap.`])}else{let B=a.rides[p.b.ride??-1];$&&B&&(Q=[`${v} is in `,L(`${ie(s,B.driver)}’s car`,B.serves[0]),` ${T(Z(p.b.start))}–${T(Z(p.b.end))}, during `,L($.title,$.id),"."])}t.push({key:`${a.date}|clash|${x}`,tone:"problem",title:`${u}${v} is double-booked`,body:Q.map(B=>typeof B=="string"?B:B.text).join(""),parts:Q,target:null,suggestions:[]})}),h>=0&&h<$i)for(let p of a.issues)p.level!=="heads_up"||!C(p.at,p.event)||t.push({key:`${a.date}|${p.key}`,tone:"heads_up",title:u+p.title,body:p.body,target:f(p.event),suggestions:[]});for(let p of a.events)!p.problems.length||!C(p.start)||t.push({key:`${a.date}|notes|${p.id}`,tone:"heads_up",title:`${u}Check the notes on ${zt(s,p)}’s ${p.title}`,body:`These lines couldn’t be read: ${p.problems.join("; ")}`,target:f(p.id),suggestions:[]})}return{items:t,problems:i,unassigned:r,later:o,laterUnassigned:l}}function Ps(s,n){let e=se(s),t=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of s.days){let o=he(n.date,r.date);if(!(o<0))for(let l of we(s))for(let c of r.drivers[l]?.outings??[]){if(c.start==null)continue;let a=o*1440+c.start;if(o*1440+Z(c.end,c.start)<=n.minutes)continue;let u=a-n.minutes,m={driver:l,name:ie(s,l),date:r.date,ahead:o,start:c.start,inMinutes:u,ongoing:u<=0,lead:c.lead,stop:(c.lines[0]??"").replace(/\s+/g," ").trim(),kids:c.kids.map(f=>e.get(f)??W(0)),warn:c.warn,target:c.target&&r.events.some(f=>f.id===c.target)?{day:r.date,event:c.target}:null};(!t||i(m)<i(t)||i(m)===i(t)&&m.inMinutes<t.inMinutes)&&(t=m)}}return t}function je(s){return s.state==="done"||s.state==="late"}var Ci=780;function _i(s,n,e){return s.state==="open"&&!!s.for_day&&s.due===n&&e<Ci}function Ts(s,n){return s.chores.map(e=>_i(e,s.today,n)?{...e,state:"upcoming",shows_from:s.today}:e)}function As(s){return s.state==="open"||s.state==="overdue"}function xn(s,n,e){if(je(s)){let t=s.done_at?Pi(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${mn(s.due,n)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${mn(s.for_day,n)}`;let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let i=he(n,s.due);return`By ${i===1?"tomorrow":i<7?J(s.due):bn(s.due)}`}if(s.for_day&&s.due===n)return`Tonight · for ${mn(s.for_day,n)}`;if(s.due&&s.due>n){let t=he(n,s.due);return t===1?"By tomorrow":`By ${t<7?J(s.due):bn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function mn(s,n){let e=he(n,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?J(s):bn(s)}function bn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Pi(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let r=t.toLocaleDateString("en-CA",{timeZone:i}),o=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return r===n?o:`${J(r)} ${o}`}function Ms(s,n,e=1440){let t=Ts(s,e).sort((i,r)=>i.order-r.order);return s.kids.map((i,r)=>{let o=t.filter(h=>h.kid===i.id),l=new Map;for(let h of o){if(h.state!=="upcoming")continue;let u=h.shows_from??h.due??s.today;l.set(u,[...l.get(u)??[],h])}let c=o.filter(h=>h.state==="overdue"),a=o.filter(h=>h.state==="open");return{kid:i.id,name:i.name,color:n?.get(i.id)??W(r),overdue:c,now:a,done:o.filter(je),later:[...l.entries()].sort(([h],[u])=>h.localeCompare(u)).map(([h,u])=>({date:h,chores:u})),left:c.length+a.length}})}function Es(s,n=1440){return Ts(s,n).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,t)=>e.state===t.state?e.order-t.order:e.state==="overdue"?-1:1)}function vn(s){return!s.chores.length&&!s.templates.length}var Ne=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function yn(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[i,r]=t.split("-").map(o=>Ne.indexOf(o.trim()));if(i===void 0||i<0||r!==void 0&&r<0)return null;if(r===void 0)e.add(i);else for(let o=0;o<=(r-i+7)%7;o++)e.add((i+o)%7)}return e}function Bt(s){let n=[...new Set(s)].sort((t,i)=>t-i);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let i=e.at(-1);i&&i.at(-1)===t-1?i.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${Ne[t[0]]}-${Ne[t.at(-1)]}`]:t.map(i=>Ne[i])).join(", ")}var Oe="none";function Nt(s){return s==="daily"||s==="school"?"":"Any"}function Ss(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Ds(s){return{template:s.id,repeats:s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:s.days??Nt(s.repeats),every:s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function wn(s){return s.title.trim()?s.who.length?s.days===Oe?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Ls(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function $n(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function kn(s,n,e=1,t=!1,i=!1){if(s==="school"){let h=n.trim().replace(/-/g,"–"),u=i?h?`${h} Bring lunch days`:"Bring lunch days":h?`${h} school days`:"Every school day";return t?`${u}, the night before`:u}let r={daily:"day",weekly:"week",monthly:"month"}[s],o=e>1?`every ${e} ${r}s`:`each ${r}`,l=n.trim();if(s==="daily"){let h=l.replace(/-/g,"–");return e>1?h?`${h}, every ${e} days`:`Every ${e} days`:h||"Every day"}if(!l||l.toLowerCase()==="any")return`Sometime ${o}`;if(s==="weekly")return`${l.replace(/-/g,"–")} ${o}`;let a=`${l.split(",").map(h=>{let u=h.trim();return u.toLowerCase()==="last"?"the last day":/^\d+$/.test(u)?`the ${$n(Number(u))}`:`the ${u}`}).join(" and ")} ${o}`;return a[0].toUpperCase()+a.slice(1)}function Cn(s,n,e=!1){let t=s.map(r=>n.find(o=>o.id===r)?.name??r);if(!t.length)return"Nobody yet";let i=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${i} take turns`:i}function _n(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}function Ot(s,n){return`${s}|${n}`}function We(s,n){let[e,t,i]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1,i+n)).toISOString().slice(0,10)}function It(s){let[n,e,t]=s.split("-").map(Number);return(new Date(Date.UTC(n,e-1,t)).getUTCDay()+6)%7}function zs(s,n){return s.days_off.find(e=>e.first<=n&&n<=e.last)??null}function Rs(s,n){return It(n)<5&&!zs(s,n)}function rt(s,n,e=new Map){if(!Rs(s,n))return null;let t=Ot(s.id,n);if(e.has(t)){let r=e.get(t);return r?{lunch:r,picked:!0}:{lunch:s.default,picked:!1}}let i=s.picks[n];return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}function Ke(s,n){return Rs(s,n)?s.menus?.[n]??null:null}var Ti="From the school's menu feed.";function Ai(s){let n=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Ti);return n.length?n.join(`
`):null}function ue(s){return s.slice(0,7)}function Ht(s){let[n,e]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Pn(s,n=1){let[e,t]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1+n,1)).toISOString().slice(0,7)}function Bs(s){let n=[];for(let e=ue(s.first);e<=ue(s.last);e=Pn(e))n.push(e);return n}function Ns(s,n,e,t=new Map){let i=`${e}-01`,r=We(i,-It(i)),o=[];for(;ue(r)<=e;){let l=[];for(let c=0;c<5;c++){let a=We(r,c),h=ue(a)!==e,u=h?null:zs(n,a),m=h?null:rt(n,a,t);l.push({date:a,day:Number(a.slice(8)),outside:h,off:u?u.title:null,lunch:m?.lunch??null,picked:m?.picked??!1,menu:h?null:Ke(n,a)?.dish??null,sides:h?null:Ai(Ke(n,a)?.details??""),past:a<s.today,today:a===s.today})}l.some(c=>!c.outside)&&o.push(l),r=We(r,7)}return o}function Os(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Is(s){let n=0,e=0;for(let t of s.flat())t.outside||t.past||!t.lunch||(t.lunch==="bring"?n++:e++);return{bring:n,buy:e}}function Hs(s,n,e,t=new Map){let i=e<780?0:1;for(let r=i;r<8;r++){let o=We(n,r),l=rt(s,o,t);if(!l)continue;let c=he(n,o);return{lunch:l.lunch,when:c===0?"today":c===1?"tomorrow":J(o),date:o,menu:Ke(s,o)?.dish??null}}return null}var Mi={timeline:"timeline",full:"timeline",compact:"compact"};function Tn(s){let n=new URLSearchParams(s),e={},t=Mi[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(n.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores"||i==="lunch")&&(e.page=i),e}var Us=Me`
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
`;var Fs="mydashlight.rides.mode",Ei=1100,Si=440,Di=700,Li=3*6e4,zi=1200;function Ri(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Ut=V`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,js=V`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Bi=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Ws=V`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Ks=V`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Ni=V`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Oi=V`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,ot={bring:"Bring",buy:"Buy"};function Ii(s,n){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return n<=1?`Every ${e}`:n===2?`Every other ${e}`:`Every ${n} ${e}s${s==="monthly"&&n===3?" (quarterly)":""}`}function ge(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function An(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Hi(s,n){return gn(s,n)||ce(s).split(",")[0]}function Ui(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function ji(){try{return localStorage.getItem(Fs)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Wi(s){try{localStorage.setItem(Fs,s)}catch{}}function jt(s){return s.days.every(n=>!n.events.length)}var at=class extends re{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Tn(location.search).view;this.urlPage=Tn(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let i=e.clientX-t.x,r=e.clientY-t.y;if(!t.moved){if(Math.abs(i)+Math.abs(r)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-r,t.el.scrollLeft=t.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Li))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??ji(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let t=new Map(this.lunchDraft);for(let[i,r]of this.lunchDraft){let[o,l]=i.split("|"),c=e.kids.find(a=>a.id===o);(!c||(c.picks[l]??null)===r||!rt(c,l))&&t.delete(i)}this.lunchDraft=t}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let i of e.chores)t.has(i.id)&&je(i)===t.get(i.id)&&t.delete(i.id);for(let i of t.keys())e.chores.some(r=>r.id===i)||t.delete(i);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=Cs(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Ei)return!1;let e=this.plan;return!e||this.width-Si>=cn(ye(e).length,we(e).length)}today(){return nt(this.plan?.time_zone??Ri())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),i=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=ks(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let i=this.scroller;if(!i||!this.board)return;let r=this.board.dayHeads.find(o=>o.date===t)?.y??0;i.scrollTop=Math.max(r,vs(this.board,e)-Lt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),o=t.days[r];if(!o)return;let l=1/0;if(this.mode==="timeline"){for(let c of o.events)l=Math.min(l,c.arrive_by??c.start);for(let c of Object.values(o.drivers))for(let a of c.outings)a.start!=null&&(l=Math.min(l,a.start))}this.scrollToTime(r*1440+(Number.isFinite(l)?Math.max(0,l-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,i=this.board.dayHeads[0];for(let a of this.board.dayHeads)a.y<=t+1&&(i=a);let r=this.renderRoot,o=r.querySelector(".pinned .label"),l=r.querySelector(".pinned .tag"),c=r.querySelector(".pinned .sub");o&&o.textContent!==i.label&&(o.textContent=i.label),l&&(l.textContent!==i.tag&&(l.textContent=i.tag),l.hidden=!i.tag),c&&c.textContent!==i.sub&&(c.textContent=i.sub),c?.classList.toggle("warn",i.warn);for(let a of r.querySelectorAll(".day-tile"))a.classList.toggle("in-view",a.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),r=new Map(this.choreDraft);r.set(e.id,i),this.choreDraft=r;try{await this.backend.setChoreDone(e.id,i,t&&t!==e.kid?t:void 0)}catch(o){let l=new Map(this.choreDraft);l.delete(e.id),this.choreDraft=l;let c=o instanceof j?o:new j("error",String(o));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??je(e)}editMenu(e,t){let i=this.lunch?.kids??[],r=Ke(e,t),o=i.filter(l=>l.id===e.id||r&&Ke(l,t)?.dish===r.dish).map(l=>l.id);this.closePanel(),this.menuEdit={kid:e.id,date:t,dish:r?.dish??"",details:r?.details??"",kids:o,had:!!r,busy:!1}}async saveMenu(e=!1){let t=this.menuEdit;if(!(!t||!this.backend||!t.kids.length)){this.menuEdit={...t,busy:!0};try{await this.backend.setLunchMenu(t.kids,t.date,e?"":t.dish.trim(),e?"":t.details.trim()),this.menuEdit=null}catch(i){this.menuEdit={...t,busy:!1};let r=i instanceof j?i:new j("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}}}async saveLunch(e,t,i){if(!this.backend||!t.length)return;let r=new Map(this.lunchDraft);for(let o of t)r.set(Ot(e,o),i);this.lunchDraft=r;try{await this.backend.setLunch(e,t,i)}catch(o){let l=new Map(this.lunchDraft);for(let a of t)l.delete(Ot(e,a));this.lunchDraft=l;let c=o instanceof j?o:new j("error",String(o));this.showToast(c.code==="preview"?c.message:`Couldn’t save that. ${c.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?Ds(e):Ss(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||wn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Ls(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let i=t instanceof j?t:new j("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let i=t instanceof j?t:new j("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?ys(this.board,t.scrollTop+Lt+4):null,this.mode=e,this.urlView||Wi(e)}findEvent(e){let t=this.plan?.days.find(r=>r.date===e.day),i=t?.events.find(r=>r.id===e.event);return t&&i?{day:t,event:i}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),i=this.dayIndexOf(e.day);!t||i<0||this.scrollToTime(i*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,i){if(!this.pending){this.pending={key:e,value:t};try{await i()}catch(r){let o=r instanceof j?r:new j("error",String(r));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}finally{this.pending=null}}}setRide(e,t,i){if(!this.backend)return;let r=this.backend;this.save(`${t}`,i,()=>r.setRide(e.id,t,i,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let i=this.backend;this.save("attending",t,()=>i.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t){if(!this.backend)return;let i=this.backend,r=e.along.includes(t)?e.along.filter(o=>o!==t):[...e.along,t];this.save("along",r,()=>i.setTakeAlong(e.id,r,this.scope))}nudgeArrive(e,t){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;t<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),zi)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let i=this.findEvent(t);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,o=i.event.id,l=this.scope;this.save("arrive",e,()=>r.setArriveBy(o,e,l)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),i=e?_s(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,o=this.chores?Es(this.chores,this.today().minutes).filter(u=>!this.choreDone(u)):[],l=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,c=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",a=d`<aside class="panel" aria-label=${c}>
      ${l??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,o))}
    </aside>`,h=this.page==="rides";return d`
      <div class="app ${r?"wide":this.width<Di?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,o.length)} ${h&&e?this.renderWeek(e):b}
          ${h?this.renderBanner(e):b}
          <main>
            ${h?d`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?jt(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:this.page==="lunch"?d`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:d`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?d`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${a}`:b}
          </main>
        </div>
        ${r?a:b}
        ${this.toast?d`<div class="toast" role="status">${this.toast}</div>`:b}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,i){let r=t.problems+i;this.tick;let o=this.today(),l="";if(e){let m=e.time_zone,f=new Date(e.updated);this.error?l=d`<span class="bad">Can’t reach Home Assistant · showing the plan from ${kt(f,new Date,m)}</span>`:e.status&&!e.status.ok?l=d`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${kt(f,new Date,m)}</span>`:this.backend?.live||(l=`Updated ${kt(f,new Date,m)}`)}let c=(m,f,C,p)=>d`
      <button type="button" class="seg-btn" title=${p} aria-pressed=${this.mode===m?"true":"false"} @click=${()=>this.setMode(m)}>
        ${C}<span class="seg-label">${f}</span>
      </button>
    `,a=(m,f,C)=>d`
      <button type="button" class="seg-btn" aria-pressed=${this.page===m?"true":"false"} @click=${()=>this.setPage(m)}>
        ${C}<span class="seg-label">${f}</span>
      </button>
    `,h=tt(o.minutes),u=!!e&&jt(e);return d`
      <header>
        ${this.showMenu?d`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${V`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:b}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ce(o.date)}, ${h}`}>
            <span class="hm">${h.slice(0,-3)}</span><span class="ampm">${h.slice(-2)}</span>
          </h1>
          <p class="today-line">${ce(o.date)}</p>
          ${l?d`<p class="status">${l}</p>`:b}
        </div>
        ${e&&!u?this.renderNext(e,Ps(e,o),t):b}
        <div class="controls">
          ${this.wide||u&&!i?b:d`<button type="button" class="attn-btn ${r?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${r}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?b:d`<div role="group" aria-label="View" class="seg">
            ${c("timeline","Timeline",V`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${c("compact","Compact",V`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${a("rides","Rides",V`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${a("chores","Chores",V`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?b:a("lunch","Lunch",V`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,i){if(!t){let a=this.today().date,h=i.unassigned,u=i.laterUnassigned;if(h){let f=d`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${h} ${h===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?d`<div class="next idle needs">${f}</div>`:d`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${f}</button>`}if(u)return d`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${u} ${u===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let m=e.days.some(f=>f.date>=a&&f.events.length);return d`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${m?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${m?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let r;t.ongoing?r="On the road now":t.ahead===0?r=t.inMinutes<180?`Next trip · in ${st(t.inMinutes)}`:"Next trip · later today":t.ahead===1?r="Next trip · tomorrow":r=`Next trip · ${J(t.date)}`;let o=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,l=d`
      <span class="next-eyebrow">${r}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${ge(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(a=>d`<span class="kid-dot" style="background:${a.color}"></span>`)}</span>
      </span>
      ${t.warn?d`<span class="next-stop warn">${t.warn}</span>`:t.stop?d`<span class="next-stop">${t.stop}</span>`:b}
    `,c=`next ${t.ongoing?"ongoing":o?"soon":""}`;return t.target?d`<button type="button" class=${c} @click=${()=>this.open(t.target)}>${l}</button>`:d`<div class=${c}>${l}</div>`}renderWeek(e){let t=this.today().date,i=se(e);return d`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let o=un(r),l=r.events.length,c=r.events.slice(0,6).map(h=>h.own?Rt.color:i.get(h.kid)?.color??W(0).color),a=`${ce(r.date)}: ${l?`${l} ${l===1?"activity":"activities"}`:"nothing planned"}${o?`, ${o} to sort out`:""}`;return d`<button
          type="button"
          class="day-tile ${r.date===t?"today":""}"
          data-date=${r.date}
          aria-label=${a}
          @click=${()=>this.goToDay(r.date)}
        >
          <span class="dt-wd">${r.date===t?"Today":J(r.date)}</span>
          <span class="dt-num">${Number(r.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${c.length?c.map(h=>d`<span class="dt-dot" style="background:${h}"></span>`):d`<span class="dt-free">free</span>`}
            ${l>6?d`<span class="dt-more">+${l-6}</span>`:b}
          </span>
          ${o?d`<span class="dt-badge" aria-hidden="true">${o}</span>`:b}
        </button>`})}
    </nav>`}renderQuiet(e){let t=ye(e),i=we(e),r=se(e),o=t.map(l=>oe(e,l));return d`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((l,c)=>V`<circle cx=${50+c*30} cy="80" r="11" fill=${r.get(l).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Ui(o)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(l=>{let c=r.get(l);return d`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${ge(oe(e,l))}</span>
            <span class="qw-name">${oe(e,l)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(l=>d`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${ge(ie(e,l))}</span>
            <span class="qw-name">${ie(e,l)}</span>
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
    </div>`:b}renderEmpty(){return this.error?d`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:d`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let t=this.sel,i=a=>!!a&&!!t&&a.day===t.day&&a.event===t.event,r=e.dayHeads[0],o=e.width,l=100,c=[...e.links.map(a=>({t:"link",x:a,z:a.layer??0})),...e.preps.map(a=>({t:"prep",x:a,z:a.layer??l-1})),...e.cards.map(a=>({t:"card",x:a,z:a.layer??l})),...e.rides.map(a=>({t:"ride",x:a,z:a.layer??l+1}))].sort((a,h)=>a.z-h.z);return d`
      <div
        class="scroller"
        @pointerdown=${this.onDown}
        @pointermove=${this.onMove}
        @pointerup=${this.onUp}
        @pointercancel=${this.onUp}
        @click=${this.onClickCapture}
        @scroll=${()=>this.syncDay()}
      >
        <div class="heads" style="width:${o}px">
          ${e.columns.map(a=>d`<div class="col-head ${a.kind}" style="left:${a.x}px;width:${a.w}px;--c:${a.dot};--rgb:${a.rgb}">
              <span class="avatar ${a.kind}" aria-hidden="true">${ge(a.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${a.name}</span>${a.kind==="kid"?this.renderLunchChip(a.id,!0):b}</span>
                <span class="sub ${a.subWarn?"warn":""}">${a.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${o}px">
          <span class="label">${r?.label??""}</span><span class="tag" ?hidden=${!r?.tag}>${r?.tag??""}</span
          ><span class="sub ${r?.warn?"warn":""}">${r?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${o}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(a=>d`<div
                class="col-bg ${a.kind}"
                style="left:${a.x}px;width:${a.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${a.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(a=>d`<div class="day-head" style="top:${a.y}px;width:${o}px">
              <span class="label">${a.label}</span>${a.tag?d`<span class="tag">${a.tag}</span>`:b}<span
                class="sub ${a.warn?"warn":""}"
                >${a.sub}</span
              >
            </div>`)}
          ${e.empties.map(a=>d`<span class="empty" style="top:${a.y}px">${a.text}</span>`)}
          ${e.grid.map(a=>d`<div class="grid ${a.strong?"strong":""}" style="top:${a.y}px;width:${o-60}px"></div>`)}
          ${e.hours.map(a=>d`<span class="hour" style="top:${a.y}px">${a.label}</span>`)}
          ${ve(e.bands,a=>a.key,a=>d`<div
                class="band"
                aria-hidden="true"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(${a.color.rgb},0.10);border-color:rgba(${a.color.rgb},0.45)"
              ></div>`)}
          ${ve(e.busy,a=>a.key,a=>d`<div class="busy" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span style="top:${a.labelY}px">${a.label}</span>
              </div>`)}
          ${ve(e.windows,a=>a.key,a=>d`<div class="window" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px">
                <span>${a.label}</span>
              </div>`)}
          ${ve(c,a=>a.x.key,a=>{if(a.t==="link"){let f=a.x;return d`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;border-color:${f.color.color};background:linear-gradient(rgba(${f.color.rgb},0.11), rgba(${f.color.rgb},0.11)), var(--surface)"
                ></div>`}if(a.t==="prep"){let f=a.x;return d`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;border-color:${f.color.color};background:linear-gradient(rgba(${f.color.rgb},0.11), rgba(${f.color.rgb},0.11)), var(--surface);color:${f.color.ink}"
                >
                  ${f.label}
                </div>`}if(a.t==="ride"){let f=a.x;return d`<button
                  type="button"
                  class="ride ${f.dashed?"dashed":""} ${f.clash?"clash":""}"
                  aria-label=${f.aria}
                  style="left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;padding-top:${3+(f.tuckTop??0)}px;padding-bottom:${3+(f.tuckBottom??0)}px"
                  @click=${()=>this.open(f.target)}
                >
                  <span class="l1">${f.l1}</span>${f.show2?d`<span class="l2" style="-webkit-line-clamp:${f.lines2}">${f.l2}</span>`:b}
                </button>`}let h=a.x,u=h.color,m=h.skipped?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.10) 0px, rgba(${u.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:h.stayed?`repeating-linear-gradient(135deg, rgba(${u.rgb},0.24) 0px, rgba(${u.rgb},0.24) 6px, rgba(${u.rgb},0.08) 6px, rgba(${u.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${u.rgb},0.15), rgba(${u.rgb},0.15)), var(--surface)`;return d`<button
                type="button"
                class="card ${h.wrap?"wrap":""} ${i(h.target)?"sel":""} ${h.clash?"clash":""} ${h.skipped?"skipped":""}"
                aria-label=${h.aria}
                style="left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px;background:${m};border-color:${h.clash?"var(--bad)":`rgba(${u.rgb},0.45)`};--c:${u.color};--rgb:${u.rgb};--ring:${u.color}"
                @click=${()=>this.open(h.target)}
              >
                <span class="top">
                  <span class="title">${h.title}</span>
                  <span class="time">${h.time}</span>
                  ${h.showDrop&&h.drop?d`<span class="line tone-${h.drop.tone}">${h.drop.text}</span>`:b}
                </span>
                ${h.showPick&&h.pick?d`<span class="line tone-${h.pick.tone}">${h.pick.text}</span>`:b}
              </button>`})}
          ${ve(e.stays,a=>a.key,a=>d`<button
                type="button"
                class="stay"
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;border-color:${a.color.color};background:repeating-linear-gradient(135deg, rgba(${a.color.rgb},0.28) 0px, rgba(${a.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1" style="color:${a.color.ink}">${a.l1}</span><span class="l2">${a.l2}</span>
              </button>`)}
          ${ve(e.trips,a=>a.key,a=>d`<button
                type="button"
                class="trip ${a.bad?"bad":""} ${a.stops?"list":""}"
                aria-label=${a.aria}
                style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"
                @click=${()=>this.open(a.target)}
              >
                <span class="l1">${a.l1}${a.kids.map(h=>d`<span class="kid-dot" style="background:${h}"></span>`)}</span>
                ${a.show2?d`<span class="l2">${a.l2}</span>`:b}
                ${a.stops?a.stops.map(h=>d`<span class="stop ${h.warn?"warn":""}">${h.text}</span>`):b}
                ${a.show3?d`<span class="l3">${a.l3}</span>`:b}
              </button>`)}
          ${ve(e.overlaps,a=>a.key,a=>d`<div class="overlap" aria-hidden="true" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`)}
          ${ve(e.marks,a=>a.key,a=>d`<span class="mark" style="left:${a.x}px;top:${a.y}px;${a.right?"transform:translateX(-100%)":""}">${a.text}</span>`)}
          ${e.now?d`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${o-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:b}
        </div>
      </div>
    `}renderAttention(e,t){let{items:i,problems:r,later:o}=e,l=this.plan,c=r+t.length,a=this.chores,h=!!a&&!vn(a);return d`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${c?"bad":"ok"}">${c}</span>
        ${this.wide?b:d`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${h?d`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?d`<div class="attn-chores">${t.map(u=>this.renderChoreRow(u,!0))}</div>`:d`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:d`<p class="panel-sub">Rides in the next two days</p>`}
      ${l&&!r?d`<div class="all-clear">
            <span class="check" aria-hidden="true">${V`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${jt(l)?"Nothing needs you this week.":o?`Nothing for the next two days. ${o} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:b}
      ${i.map(u=>d`<div class="issue ${u.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${u.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${u.target?d`<button type="button" class="issue-title" @click=${()=>this.open(u.target,!0)}>${u.title}</button>`:d`<strong class="issue-title">${u.title}</strong>`}
              <span class="issue-body"
                >${u.parts?u.parts.map(m=>typeof m=="string"?m:d`<button type="button" class="issue-link" @click=${()=>this.open(m.target,!0)}>${m.text}</button>`):u.body}</span
              >
            </div>
          </div>
          ${u.suggestions.length?d`<div class="fixes">
                ${u.suggestions.map(m=>d`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(m.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${m.id}`?"Saving…":m.label}</span>
                    <span class="fix-note">${m.note}</span>
                  </button>`)}
              </div>`:b}
        </div>`)}
      ${this.wide&&l&&!jt(l)&&this.page==="rides"?this.renderLegend():b}
    `}kidColorOf(e){let t=this.plan?se(this.plan).get(e):void 0;if(t)return t;let i=this.lunch?.kids.findIndex(r=>r.id===e)??-1;return W(Math.max(0,i))}renderLunchChip(e,t=!1){let i=this.lunch,r=i?.kids.find(a=>a.id===e);if(!i||!r)return b;this.tick;let o=this.today(),l=Hs(r,o.date,o.minutes,this.lunchDraft);if(!l)return b;let c=ot[l.lunch];return d`<span class="lunch-chip ${l.lunch} ${t?"small":""}" title=${`${c} lunch ${l.when}${l.menu?`: ${l.menu}`:""}`}
      >${l.lunch==="bring"?Ws:Ks}<span class="lunch-chip-text"
        >${c}${t?b:` ${l.when}`}${!t&&l.menu?d`<span class="lunch-chip-menu"> · ${l.menu}</span>`:b}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return d`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let t=Bs(e),i=this.lunchMonth&&t.includes(this.lunchMonth)?this.lunchMonth:ue(e.today),r=t.indexOf(i),o=h=>{let u=t[r+h];u&&(this.lunchMonth=u)},l=e.kids.some(h=>h.id===this.lunchKid)?this.lunchKid:null,c=l?e.kids.filter(h=>h.id===l):e.kids,a=e.status&&!e.status.ok?d`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:b;return d`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${r<=0} @click=${()=>o(-1)}>
            ${V`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Ht(i)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${r<0||r>=t.length-1} @click=${()=>o(1)}>
            ${V`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":d`${js} Edit menus`}
        </button>
      </div>
      ${a}
      <div class="chore-cols lunch-cols ${l?"wide":""}" style="--n:${c.length}">
        ${c.map(h=>this.renderLunchCard(e,h,i,l!==null))}
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
    </div>`}renderLunchCard(e,t,i,r){let o=this.kidColorOf(t.id),l=Ns(e,t,i,this.lunchDraft),c=Is(l),a=l.flat(),h=a.filter(p=>!p.outside&&!p.past&&p.lunch),u=t.days_off.filter(p=>ue(p.first)<=i&&i<=ue(p.last)),m=p=>h.filter(x=>It(x.date)===p),f=p=>{let x=m(p);if(!x.length)return;let $=x.every(v=>v.lunch==="bring")?"buy":"bring";this.saveLunch(t.id,x.map(v=>v.date),$)},C=h.length?`${c.bring} Bring · ${c.buy} Buy${i===ue(e.today)?" left this month":""}`:"No school days left this month";return d`<section class="chore-col lunch-card ${r?"wide":""}" style="--c:${o.color};--rgb:${o.rgb};--k:${o.ink}" aria-label=${`${t.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${ge(t.name)}</span>
        <span class="ch-text">
          <span class="name">${t.name}</span>
          <span class="sub">${C}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${ot[t.default]} unless picked</span>
          ${e.kids.length<2?b:d`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${r?"Show everyone’s lunches":`Expand ${t.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=r?null:t.id}
              >
                ${r?Oi:Ni}${r?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${t.menu_feed&&!t.menu_feed.ok?d`<p class="field-hint bad">Couldn’t read the school menu feed${t.menu_feed.error?`: ${t.menu_feed.error}`:""}.</p>`:b}
      <div class="lunch-grid" role="grid" aria-label=${`${t.name}, ${Ht(i)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((p,x)=>d`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!m(x).length}
            aria-label=${`${m(x).every($=>$.lunch==="bring")?"Buy":"Bring"} every ${p} left in ${Ht(i)} for ${t.name}`}
            @click=${()=>f(x)}
          >
            ${p}
          </button>`)}
        ${a.map(p=>this.renderLunchCell(t,p,r))}
      </div>
      ${u.length?d`<p class="lunch-offs">
            No school:
            ${u.map(p=>{let x=p.first<`${i}-01`?`${i}-01`:p.first,$=ue(p.last)>i?We(`${Pn(i)}-01`,-1):p.last;return`${x===$?An(x):`${An(x)}–${An($)}`} ${Os(p.title)}`}).join(" · ")}
          </p>`:b}
    </section>`}renderLunchCell(e,t,i=!1){if(t.outside)return d`<span class="lunch-day outside" aria-hidden="true"></span>`;if(t.off!==null||!t.lunch)return d`<span class="lunch-day off ${t.today?"today":""}" title=${t.off??""}>
        <span class="lunch-num">${t.day}</span><span class="lunch-word">No school</span>
      </span>`;let r=t.lunch,o=r==="buy"?"bring":"buy",l=t.menu?`, ${t.menu}`:"",c=this.menuMode,a=this.menuEdit?.date===t.date&&this.menuEdit.kids.includes(e.id),h=c?`${e.name}, ${ce(t.date)}${l||", no menu yet"}. Tap to ${t.menu?"change":"add"} the menu.`:`${e.name}, ${ce(t.date)}: ${ot[r]}${t.picked?"":" (not picked yet)"}${l}. Tap to ${ot[o]}.`;return d`<button
      type="button"
      class="lunch-day ${r} ${t.picked?"picked":"unpicked"} ${t.past?"past":""} ${t.today?"today":""} ${c?"editing":""} ${a?"sel":""}"
      ?disabled=${t.past&&!c}
      aria-label=${h}
      @click=${()=>c?this.editMenu(e,t.date):void this.saveLunch(e.id,[t.date],o)}
    >
      <span class="lunch-num">${t.day}</span>
      <span class="lunch-word">${r==="bring"?Ws:Ks}${ot[r]}</span>
      ${t.menu?d`<span class="lunch-menu">${t.menu}</span>${i&&t.sides?d`<span class="lunch-sides">${t.sides}</span>`:b}`:c?d`<span class="lunch-menu add">${Ut} Menu</span>`:b}
    </button>`}renderChoreRow(e,t=!1){let i=this.chores,r=this.choreDone(e),o=i.kids.findIndex($=>$.id===e.kid),l=(this.plan?se(this.plan).get(e.kid):void 0)??W(Math.max(0,o)),c=i.kids[o]?.name??"",a=r===je(e)?e:{...e,state:r?"done":"open",done_at:r?new Date().toISOString():null},h=r&&a.done_by&&a.done_by!==e.kid?i.people?.find($=>$.id===a.done_by)?.name??a.done_by_name??null:null,u=`${xn(a,i.today,i.time_zone)}${h?` · by ${h}`:""}`,m=r||As(e),f=`${t?`${c}: `:""}${e.title}. ${u?`${u}. `:""}${r?"Done. Tap to undo.":"Tap when it’s done."}`,C=d`<span class="box" aria-hidden="true"
        >${r?V`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:b}</span
      >
      ${e.icon?d`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:b}
      <span class="chore-text">
        <span class="chore-title">${t?d`<span class="chore-kid">${c}</span> · `:b}${e.title}</span>
        ${u?d`<span class="chore-note">${u}</span>`:b}
      </span>`,p=`chore ${r?"done":""} ${e.state==="overdue"&&!r?"overdue":""} ${m?"":"later"}`,x=`--c:${l.color};--rgb:${l.rgb};--k:${l.ink}`;return m?d`<button type="button" class=${p} style=${x} aria-pressed=${r?"true":"false"} aria-label=${f} @click=${()=>this.tapChore(e)}>
          ${C}
        </button>`:d`<div class=${p} style=${x}>${C}</div>`}renderChores(){let e=this.chores;if(e===void 0)return d`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return d`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return d`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(vn(e))return d`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Ut} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore templates: Daily</strong> (or Weekly or Monthly). It
          shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(o=>o.problems.length),i=t.length?d`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(o=>this.renderTemplateRow(o))}</div>
        </section>`:b;this.tick;let r=Ms(e,this.plan?se(this.plan):void 0,this.today().minutes);return d`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Ut} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${js} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${r.length}">
        ${r.map(o=>{let l=o.overdue.filter(c=>!this.choreDone(c)).length+o.now.filter(c=>!this.choreDone(c)).length;return d`<section class="chore-col" style="--c:${o.color.color};--rgb:${o.color.rgb}" aria-label=${`${o.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${ge(o.name)}</span>
              <span class="ch-text">
                <span class="name">${o.name}</span>
                <span class="sub">${l?`${l} to do`:o.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(o.kid)}
            </div>
            ${o.overdue.length?d`<h3 class="chore-group overdue">Missed</h3>
                  ${o.overdue.map(c=>this.renderChoreRow(c))}`:b}
            ${o.now.length?d`<h3 class="chore-group">To do</h3>
                  ${o.now.map(c=>this.renderChoreRow(c))}`:b}
            ${o.done.length?d`<h3 class="chore-group">Done</h3>
                  ${o.done.map(c=>this.renderChoreRow(c))}`:b}
            ${o.later.map(c=>d`<h3 class="chore-group">${c.date===e.today?"Later today":Hi(c.date,e.today)}</h3>
                ${c.chores.map(a=>this.renderChoreRow(a))}`)}
            ${!o.overdue.length&&!o.now.length&&!o.done.length&&!o.later.length?d`<p class="chore-none">No chores this week.</p>`:b}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,r=this.plan?se(this.plan):void 0,o=this.choreEdit?.template===e.id,l=e.problems.length?d`<span class="tmpl-note bad">${e.problems.map(_n).join(" · ")} · tap to set up</span>`:d`<span class="tmpl-note">${Cn(e.who,i,e.take_turns)} · ${kn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return d`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${o?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?d` <span class="tag-paused">Paused</span>`:b}</span>
        ${l}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(c=>{let a=i.findIndex(u=>u.id===c),h=r?.get(c)??W(Math.max(0,a));return d`<span class="kid-dot" style="background:${h.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day or some days"],["school","School days"],["weekly","Weekly"],["monthly","Monthly"]];return d`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Ut} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([i,r])=>{let o=e.templates.filter(l=>l.repeats===i);return o.length?d`<section class="manage-group" aria-label=${r}>
                  <h3 class="chore-group">${r}</h3>
                  <div class="tmpl-list">${o.map(l=>this.renderTemplateRow(l))}</div>
                </section>`:b}):d`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the lists <strong>Chore templates: Daily</strong>, <strong>Weekly</strong>,
        <strong>Monthly</strong> and <strong>School days</strong>. A task added there by hand shows up here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return d``;let i=t.kids,r=this.plan?se(this.plan):void 0,o=this.choreBusy,l=e.template?t.templates.find(p=>p.id===e.template):void 0,c=wn(e),a=(l?.problems??[]).filter(p=>p!=="who:"),h=(p,x,$,v=!1)=>d`<button type="button" class="choice ${v?"wide":""}" aria-pressed=${p?"true":"false"} ?disabled=${o} @click=${$}>${x}</button>`,u=(p,x,$,v)=>d`<button type="button" class="chip" aria-pressed=${p?"true":"false"} aria-label=${v??b} ?disabled=${o} @click=${$}>${x}</button>`,m=p=>{p!==e.repeats&&this.changeDraft({repeats:p,days:l&&l.repeats===p?l.days??Nt(p):Nt(p)})},f=p=>{let x=e.who.includes(p)?e.who.filter($=>$!==p):i.filter($=>$.id===p||e.who.includes($.id)).map($=>$.id);this.changeDraft({who:x})},C;if(e.repeats==="school"){let p=e.days===Oe?new Set:e.days===""?new Set([0,1,2,3,4]):yn(e.days)??new Set,x=$=>{let v=new Set(p);v.has($)?v.delete($):v.add($),this.changeDraft({days:v.size===5?"":v.size?Bt(v):Oe})};C=d`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Ne.slice(0,5).map(($,v)=>u(p.has(v),$.slice(0,2),()=>x(v),$))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${h(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${h(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${h(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let p=e.days.trim(),x=/^\d+$/.test(p)?Number(p):null,$=p&&p.toLowerCase()!=="any"&&p.toLowerCase()!=="last"&&x===null;C=d`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${$?4:3}, minmax(0, 1fr))">
          ${h(p===""||p.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${h(x!==null,"On a date",()=>this.changeDraft({days:String(x??1)}))}
          ${h(p.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${$?h(!0,p,()=>{}):b}
        </div>
        ${x!==null?d`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${o||x<=1} @click=${()=>this.changeDraft({days:String(x-1)})}>−</button>
                <span class="arrive-value">${$n(x)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${o||x>=31} @click=${()=>this.changeDraft({days:String(x+1)})}>+</button>
              </span>
            </div>`:d`<p class="field-hint">${p.toLowerCase()==="last"?"Due on the month’s last day.":$?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else{let p=e.repeats==="weekly"&&(e.days===""||e.days.toLowerCase()==="any"),x=e.days===Oe?new Set:p?new Set:yn(e.days)??new Set,$=v=>{let L=new Set(x);L.has(v)?L.delete(v):L.add(v),e.repeats==="weekly"?this.changeDraft({days:L.size?Bt(L)||"Mon-Sun":"Any"}):this.changeDraft({days:L.size?Bt(L):Oe})};C=d`<div class="field">
        <span class="field-label">${e.repeats==="weekly"?"Which day":"Which days"}</span>
        ${e.repeats==="weekly"?d`<div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
              ${h(p,"Any day that week",()=>this.changeDraft({days:"Any"}))}
              ${h(!p,"On a set day",()=>this.changeDraft({days:p?"Sat":e.days}))}
            </div>`:b}
        ${e.repeats==="daily"||!p?d`<div role="group" aria-label="Days of the week" class="day-chips">
              ${Ne.map((v,L)=>u(x.has(L),v.slice(0,2),()=>$(L),v))}
            </div>`:b}
        ${e.repeats==="daily"?d`<div class="chips">
              ${u(e.days==="","Every day",()=>this.changeDraft({days:""}))}
              ${u(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
              ${u(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
            </div>`:d`<p class="field-hint">${p?"Shows all week, due on Sunday.":"Due that day."}</p>`}
      </div>`}return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?d`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:b}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Cn(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===Oe?"No days picked":kn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${o} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${a.length?d`<p class="field-hint bad">${a.map(_n).join(". ")}. Saving fixes it.</p>`:b}
      <div class="field">
        <label class="field-label" for="chore-name">Chore</label>
        <input
          id="chore-name"
          class="text-input"
          type="text"
          autocomplete="off"
          placeholder="Make bed"
          .value=${e.title}
          ?disabled=${o}
          @input=${p=>this.changeDraft({title:p.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${Bi.map(p=>u(e.icon===p,p,()=>this.changeDraft({icon:e.icon===p?null:p}),`Picture ${p}`))}
        </div>
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((p,x)=>{let $=r?.get(p.id)??W(x),v=e.who.includes(p.id);return d`<button type="button" class="who-chip" style="--c:${$.color};--rgb:${$.rgb}" aria-pressed=${v?"true":"false"} ?disabled=${o} @click=${()=>f(p.id)}>
              <span class="avatar" aria-hidden="true">${ge(p.name)}</span>${p.name}
            </button>`})}
        </div>
        ${e.who.length>1?d`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${h(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${h(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:b}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${h(e.repeats==="daily","Days",()=>m("daily"))}
          ${h(e.repeats==="school","School days",()=>m("school"))}
          ${h(e.repeats==="weekly","Weekly",()=>m("weekly"))}
          ${h(e.repeats==="monthly","Monthly",()=>m("monthly"))}
        </div>
      </div>
      ${C}
      ${e.repeats==="school"?b:d`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Repeats</span>
          <span class="field-hint">${Ii(e.repeats,e.every)}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${o||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${o||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${o}
          @input=${p=>this.changeDraft({details:p.target.value})}
        ></textarea>
      </div>
      ${e.template?d`<div class="field">
              ${h(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${o} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:b}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!c} @click=${()=>void this.saveChoreEdit()}>
          ${o?"Saving to Google Tasks…":c?c.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let t=this.lunch;if(!t)return d``;let i=e.busy,r=h=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...h})},o=h=>r({kids:e.kids.includes(h)?e.kids.filter(u=>u!==h):[...e.kids,h]}),l=t.kids.filter(h=>rt(h,e.date)),c=e.dish.trim(),a=e.kids.length?c?null:"Type what’s served":"Pick who gets this menu";return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${ce(e.date)}</span>
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
          @input=${h=>r({dish:h.target.value})}
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
          @input=${h=>r({details:h.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${l.map(h=>{let u=this.kidColorOf(h.id),m=e.kids.includes(h.id);return d`<button type="button" class="who-chip" style="--c:${u.color};--rgb:${u.rgb}" aria-pressed=${m?"true":"false"} ?disabled=${i} @click=${()=>o(h.id)}>
              <span class="avatar" aria-hidden="true">${ge(h.name)}</span>${h.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${c||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?d`<button type="button" class="chip clear remove" ?disabled=${i||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:b}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${i||!!a} @click=${()=>void this.saveMenu()}>
          ${i?"Saving to Google Calendar…":a??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return d``;let i=t.people?.length?t.people:t.kids.map(u=>({...u,role:"kid"})),r=t.kids.findIndex(u=>u.id===e.kid),o=t.kids[r],l=this.plan?se(this.plan):void 0,c=l?.get(e.kid)??W(Math.max(0,r)),a=i.filter(u=>u.id!==e.kid),h=u=>{let m=t.kids.findIndex(f=>f.id===u.id);return m>=0?(l?.get(u.id)??W(m)).color:"var(--dark)"};return d`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?d`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:b}${e.title}</span>
          <span class="ed-meta">${o?.name??""} · ${xn(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${c.color};--rgb:${c.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${ge(o?.name??"?")}</span>
          <span>${o?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?d`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${a.map(u=>d`<button type="button" class="done-by" style="--c:${h(u)}" @click=${()=>void this.toggleChore(e,u.id)}>
                  <span class="avatar ${u.role==="parent"?"driver":""}" aria-hidden="true">${ge(u.name)}</span>
                  <span>${u.name}</span>
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
    </div>`}ownHint(e,t){let i=zt(e,t);if(t.takes!=null){let o=t.planned!=null?`It’s fitted in at ${T(t.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${t.takes} min any time from ${T(t.start)} to ${T(t.end)}. ${o}, around ${i}’s other trips. Errands go alone.`}let r=t.along.map(o=>we(e).includes(o)?ie(e,o):oe(e,o));return`${i} drives there and back${r.length?`, with ${pn(r)}`:""}.`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return d``;let{day:i,event:r}=t,o=we(e),l=xs(e,r),c=zt(e,r),a=!!this.pending,h=D=>this.pending?.key===D?this.pending.value:void 0,u=[...e.people?.carpools??[]];for(let D of e.days)for(let $e of D.events)for(let K of[$e.drop,$e.pick])K&&K!=="none"&&!o.includes(K)&&!u.some(fe=>fe.toLowerCase()===K.toLowerCase())&&u.push(K);let m=D=>{if(!r.sides.includes(D))return b;let $e=h(D),K=$e!==void 0?String($e):D==="drop"?r.drop:r.pick,fe=K&&K!=="none"&&!o.includes(K)?K:"",Te=I=>this.setRide(r,D,K===I?"":I),le=[...o.map(I=>[I,hn(e,I)]),["none","Not needed"]];return d`<div class="field">
        <span class="field-label">${D==="drop"?"Drop-off":"Pick-up"} ${K===""?d`<span class="nobody">· nobody yet</span>`:b}</span>
        <div role="group" aria-label=${D==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${le.length}, minmax(0, 1fr))">
          ${le.map(([I,G])=>d`<button type="button" class="choice" aria-pressed=${K===I?"true":"false"} ?disabled=${a} @click=${()=>Te(I)}>
                ${G}
              </button>`)}
        </div>
        ${u.length?d`<div role="group" aria-label=${D==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${u.map(I=>d`<button type="button" class="chip" aria-pressed=${K.toLowerCase()===I.toLowerCase()?"true":"false"} ?disabled=${a} @click=${()=>Te(I)}>
                    ${I}
                  </button>`)}
            </div>`:b}
        <input
          type="text"
          .value=${fe&&!u.some(I=>I.toLowerCase()===fe.toLowerCase())?fe:""}
          ?disabled=${a}
          aria-label=${D==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${I=>{let G=I.target.value.trim();G&&G!==K&&this.setRide(r,D,G)}}
          @keydown=${I=>{I.key==="Enter"&&I.target.blur()}}
        />
      </div>`},f=h("stay"),C=f!==void 0?!!f:r.stay,p=r.drop===r.pick&&o.includes(r.drop),x=h("along"),$=x!==void 0?x:r.along,v=r.own?[...ye(e),...o.filter(D=>D!==r.own)]:ye(e).filter(D=>D!==r.kid),L=r.own!=null&&r.takes!=null,Q=o.includes(r.drop)&&r.sides.includes("drop")&&!L,B=h("arrive"),ee=this.arriveDraft!==void 0?this.arriveDraft:B!==void 0?B:r.arrive_by,q=[],_e=D=>D==="none"?"Not needed":hn(e,D);!r.own&&r.drop!==""&&q.push(`Drop-off: ${_e(r.drop)}`),!r.own&&r.pick!==""&&q.push(`Pick-up: ${_e(r.pick)}`),!r.own&&r.stay&&q.push("Stay: yes"),L&&q.push(`Takes: ${r.takes} min`),r.along.length&&q.push(`Take along: ${r.along.map(D=>o.includes(D)?ie(e,D):oe(e,D)).join(", ")}`),r.arrive_by!=null&&q.push(`Arrive by: ${tt(r.arrive_by)}`);let dt=h("attending"),ae=dt!==void 0?!!dt:r.attending!==!1;r.attending===!1&&q.splice(0,q.length,"Attending: no");let ct=i.date===this.today().date?"":`${J(i.date)} · `,Pe=d`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${c} · ${r.title}</span>
          <span class="ed-meta">${ct}${L?"any time ":""}${T(r.start)}–${T(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return r.where==="home"?d`${Pe}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${c} can’t get home in time, the board shows it as a clash.</p>`:d`
      ${Pe}
      ${this.pending?d`<p class="saving" role="status">Saving to Google Calendar…</p>`:b}
      ${r.recurring?d`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${J(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:b}
      <div class="field">
        <span class="field-label">${c} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${ae?"true":"false"} ?disabled=${a} @click=${()=>this.setAttending(r,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${ae?"false":"true"} ?disabled=${a} @click=${()=>this.setAttending(r,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${ae?d`${r.where==="anywhere"?d`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:b}
            ${r.own?d`<p class="field-hint">${this.ownHint(e,r)}</p>`:d`${m("drop")} ${m("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${C?"true":"false"} ?disabled=${!p||a} @click=${()=>this.toggleStay(r)}>
                      ${p?C?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                  </div>`}
      ${Q&&v.length?d`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label=${r.own?"Who goes along":"Kids taken along"} class="chips">
              ${v.map(D=>d`<button type="button" class="chip" aria-pressed=${$.includes(D)?"true":"false"} ?disabled=${a} @click=${()=>this.toggleAlong(r,D)}>
                  ${o.includes(D)?ie(e,D):oe(e,D)}
                </button>`)}
            </div>
          </div>`:b}
      ${L?b:d`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${ee!=null?`${r.start-ee} min before it starts`:`Aims for a few minutes before ${T(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${a} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${ee!=null?T(ee):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${a||ee==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${ee!=null?d`<button type="button" class="chip clear" ?disabled=${a} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:b}`}
`:d`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${q.length?q.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${r.problems.length?d`<p class="field-hint bad">These lines in the notes couldn’t be read: ${r.problems.join("; ")}</p>`:b}
      ${ae&&!r.own?d`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:b}
    `}};at.styles=Us,at.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",at);var lt=class extends re{constructor(){super();this.conn=null;this.hass=void 0,this.narrow=!1,this.backend=null,this.pairing=null}connectedCallback(){super.connectedCallback(),this.pairing=ns(location.search)}closePairing(){this.pairing=null;let e=new URLSearchParams(location.search);e.delete(Qe);let t=e.toString();history.replaceState(history.state,"",`${location.pathname}${t?`?${t}`:""}`)}willUpdate(e){e.has("hass")&&this.hass&&this.hass.connection!==this.conn&&(this.conn=this.hass.connection,this.backend=new Ct(this.conn))}render(){let e=this.narrow||this.hass?.dockedSidebar==="always_hidden";return d`<mydashlight-board .backend=${this.backend} ?show-menu=${e}></mydashlight-board>
      ${this.pairing!==null?d`<mydashlight-pair-approve
            .connection=${this.hass?.connection??null}
            .userName=${this.hass?.user?.name??""}
            .isAdmin=${this.hass?.user?.is_admin??!0}
            .code=${this.pairing}
            @close=${()=>this.closePairing()}
          ></mydashlight-pair-approve>`:b}`}};lt.styles=Me`
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
  `,lt.properties={hass:{attribute:!1},narrow:{type:Boolean},backend:{state:!0},pairing:{state:!0}};customElements.get("mydashlight-panel")||customElements.define("mydashlight-panel",lt);
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
