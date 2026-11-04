function on(s){return{type:"auth",access_token:s}}function an(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function ln(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function Et(s){return{type:"unsubscribe_events",subscription:s}}function dn(){return{type:"ping"}}function cn(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function hn(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let r=e[n].split("="),o=decodeURIComponent(r[0]),a=r.length>1?decodeURIComponent(r[1]):void 0;t[o]=a}return t}var un=(s,t,e,n)=>{let[r,o,a]=s.split(".",3);return Number(r)>t||Number(r)===t&&(n===void 0?Number(o)>=e:Number(o)>e)||n!==void 0&&Number(r)===t&&Number(o)===e&&Number(a)>=n};var tt=!1,Cs="auth_required",Ss="auth_invalid",Rs="auth_ok";function gn(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;tt&&console.log("[Auth phase] Initializing",n);function r(o,a,i){tt&&console.log("[Auth Phase] New connection",n);let l=new WebSocket(n),d=!1,g=()=>{if(l.removeEventListener("close",g),d){i(2);return}if(o===0){i(1);return}let y=o===-1?-1:o-1;setTimeout(()=>r(y,a,i),1e3)},c=async y=>{try{t.expired&&await(e||t.refreshAccessToken()),l.send(JSON.stringify(on(t.accessToken)))}catch(_){d=_===2,l.close()}},p=async y=>{let _=JSON.parse(y.data);switch(tt&&console.log("[Auth phase] Received",_),_.type){case Ss:d=!0,l.close();break;case Rs:l.removeEventListener("open",c),l.removeEventListener("message",p),l.removeEventListener("close",g),l.removeEventListener("error",g),l.haVersion=_.ha_version,un(l.haVersion,2022,9)&&l.send(JSON.stringify(an())),a(l);break;default:tt&&_.type!==Cs&&console.warn("[Auth phase] Unhandled message",_)}};l.addEventListener("open",c),l.addEventListener("message",p),l.addEventListener("close",g),l.addEventListener("error",g)}return new Promise((o,a)=>r(s.setupRetry,o,a))}var He=!1,nt=class{constructor(t,e){this._handleMessage=n=>{let r=JSON.parse(n.data);Array.isArray(r)||(r=[r]),r.forEach(o=>{He&&console.log("Received",o);let a=this.commands.get(o.id);switch(o.type){case"event":a?a.callback(o.event):(console.warn(`Received event for unknown subscription ${o.id}. Unsubscribing.`),this.sendMessagePromise(Et(o.id)).catch(i=>{He&&console.warn(` Error unsubsribing from unknown subscription ${o.id}`,i)}));break;case"result":a&&(o.success?(a.resolve(o.result),"subscribe"in a||this.commands.delete(o.id)):(a.reject(o.error),this.commands.delete(o.id)));break;case"pong":a?(a.resolve(),this.commands.delete(o.id)):console.warn(`Received unknown pong response ${o.id}`);break;default:He&&console.warn("Unhandled message",o)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(a=>{"subscribe"in a||a.reject(cn(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let r=Object.assign(Object.assign({},this.options),{setupRetry:0}),o=a=>{setTimeout(async()=>{if(!this.closeRequested){He&&console.log("Trying to reconnect");try{let i=await r.createSocket(r);this._setSocket(i)}catch(i){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let d of l)d.reject&&d.reject(3)}i===2?this.fireEvent("reconnect-error",i):o(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),o(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(r=>{"subscribe"in r&&r.subscribe&&r.subscribe().then(o=>{r.unsubscribe=o,r.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let r of n)r.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let r=n.indexOf(e);r!==-1&&n.splice(r,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,ln(e))}ping(){return this.sendMessagePromise(dn())}sendMessage(t,e){if(!this.connected)throw 3;if(He&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(o){n(o)}}});return}let r=this._genCmdId();this.commands.set(r,{resolve:e,reject:n}),this.sendMessage(t,r)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((o,a)=>{this._queuedMessages.push({resolve:o,reject:a})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let r;return await new Promise((o,a)=>{let i=this._genCmdId();r={resolve:o,reject:a,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Et(i)),this.commands.delete(i)}},this.commands.set(i,r);try{this.sendMessage(e,i)}catch{}}),()=>r.unsubscribe()}_genCmdId(){return++this.commandId}};var Ds=()=>`${location.protocol}//${location.host}/`,Ls=s=>s*1e3+Date.now();function Bs(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function Is(s,t,e,n){let r=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(r+=`&client_id=${encodeURIComponent(t)}`),n&&(r+=`&state=${encodeURIComponent(n)}`),r}function Ns(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Is(s,t,e,n)}async function xn(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let i=document.createElement("a");if(i.href=s,i.protocol==="http:"&&i.hostname!=="localhost")throw 5}let r=new FormData;t!==null&&r.append("client_id",t),Object.keys(e).forEach(i=>{r.append(i,e[i])});let o=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:r});if(!o.ok)throw o.status===400||o.status===403?2:new Error("Unable to fetch tokens");let a=await o.json();return a.hassUrl=s,a.clientId=t,a.expires=Ls(a.expires_in),a}function bn(s,t,e){return xn(s,t,{code:e,grant_type:"authorization_code"})}function Os(s){return btoa(JSON.stringify(s))}function Us(s){return JSON.parse(atob(s))}var Mt=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await xn(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function vn(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:Ds(),r=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await bn(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let o=hn(location.search.substr(1));if("auth_callback"in o){let a=Us(o.state);if(r&&(a.hassUrl!==e||a.clientId!==n))throw 6;t=await bn(a.hassUrl,a.clientId,o.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new Mt(t,s.saveTokens);if(e===void 0)throw 4;return Ns(e,n,s.redirectUrl||Bs(),Os({hassUrl:e,clientId:n})),new Promise(()=>{})}async function yn(s){let t=Object.assign({setupRetry:0,createSocket:gn},s),e=await t.createSocket(t);return new nt(e,t)}function L(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function ze(s){let t=Math.floor(Math.round(s)/60)%24;return`${L(s)} ${t<12?"AM":"PM"}`}function wn(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function je(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function $n(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Hs=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),zs=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),qs=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function st(s){return new Date(`${s}T12:00:00Z`)}function Be(s){let t=st(s);return`${Hs.format(t)}, ${qs.format(t)}`}function fe(s){return zs.format(st(s))}function it(s,t){return Math.round((st(t).getTime()-st(s).getTime())/864e5)}function qe(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return qe("UTC",t)}let n=r=>e.find(o=>o.type===r)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function rt(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let r=qe(e,s),o=qe(e,t).date;return r.date===o?`at ${ze(r.minutes)}`:`on ${fe(r.date)} at ${ze(r.minutes)}`}var oe=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},Pt="mydashlight",js=7,Ks=3e4;function kn(s){if(s instanceof oe)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new oe(String(t.code??"error"),t.message)}return typeof s=="number"?new oe("connection_lost","Lost the connection to Home Assistant."):new oe("error",String(s))}var ot=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new oe("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Ks),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new oe("not_running","MyDashLight isn’t running right now."))},{type:`${Pt}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:Pt,service:"get_plan",service_data:{days:js},return_response:!0});this.emit(t.response)}catch(t){this.fail(kn(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Pt,service:t,service_data:e})}catch(n){throw kn(n)}this.pushing||await this.refresh()}setRide(t,e,n,r){return this.call("set_ride",{event:t,side:e,driver:n,scope:r})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:$n(e),scope:n})}setTakeAlong(t,e,n){return this.call("set_take_along",{event:t,kids:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}};var at=globalThis,lt=at.ShadowRoot&&(at.ShadyCSS===void 0||at.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ct=Symbol(),_n=new WeakMap,Ke=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Ct)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(lt&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=_n.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&_n.set(e,t))}return t}toString(){return this.cssText}},An=s=>new Ke(typeof s=="string"?s:s+"",void 0,Ct),_e=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,r,o)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new Ke(e,s,Ct)},Tn=(s,t)=>{if(lt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),r=at.litNonce;r!==void 0&&n.setAttribute("nonce",r),n.textContent=e.cssText,s.appendChild(n)}},St=lt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return An(e)})(s):s;var{is:Vs,defineProperty:Ws,getOwnPropertyDescriptor:Fs,getOwnPropertyNames:Ys,getOwnPropertySymbols:Gs,getPrototypeOf:Qs}=Object,dt=globalThis,En=dt.trustedTypes,Js=En?En.emptyScript:"",Xs=dt.reactiveElementPolyfillSupport,Ve=(s,t)=>s,Rt={toAttribute(s,t){switch(t){case Boolean:s=s?Js:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Pn=(s,t)=>!Vs(s,t),Mn={attribute:!0,type:String,converter:Rt,reflect:!1,useDefault:!1,hasChanged:Pn};Symbol.metadata??=Symbol("metadata"),dt.litPropertyMetadata??=new WeakMap;var ce=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Mn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(t,n,e);r!==void 0&&Ws(this.prototype,t,r)}}static getPropertyDescriptor(t,e,n){let{get:r,set:o}=Fs(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let i=r?.call(this);o?.call(this,a),this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Mn}static _$Ei(){if(this.hasOwnProperty(Ve("elementProperties")))return;let t=Qs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ve("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ve("properties"))){let e=this.properties,n=[...Ys(e),...Gs(e)];for(let r of n)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,r]of e)this.elementProperties.set(n,r)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let r=this._$Eu(e,n);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let r of n)e.unshift(St(r))}else t!==void 0&&e.push(St(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Tn(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,n);if(r!==void 0&&n.reflect===!0){let o=(n.converter?.toAttribute!==void 0?n.converter:Rt).toAttribute(e,n.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let n=this.constructor,r=n._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=n.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:Rt;this._$Em=r;let i=a.fromAttribute(e,o.type);this[r]=i??this._$Ej?.get(r)??i,this._$Em=null}}requestUpdate(t,e,n,r=!1,o){if(t!==void 0){let a=this.constructor;if(r===!1&&(o=this[t]),n??=a.getPropertyOptions(t),!((n.hasChanged??Pn)(o,e)||n.useDefault&&n.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:r,wrapped:o},a){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[r,o]of n){let{wrapped:a}=o,i=this[r];a!==!0||this._$AL.has(r)||i===void 0||this.C(r,void 0,o,i)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};ce.elementStyles=[],ce.shadowRootOptions={mode:"open"},ce[Ve("elementProperties")]=new Map,ce[Ve("finalized")]=new Map,Xs?.({ReactiveElement:ce}),(dt.reactiveElementVersions??=[]).push("2.1.2");var Lt=globalThis,Cn=s=>s,ct=Lt.trustedTypes,Sn=ct?ct.createPolicy("lit-html",{createHTML:s=>s}):void 0,Bt="$lit$",pe=`lit$${Math.random().toFixed(9).slice(2)}$`,It="?"+pe,Zs=`<${It}>`,Ee=document,Fe=()=>Ee.createComment(""),Ye=s=>s===null||typeof s!="object"&&typeof s!="function",Nt=Array.isArray,Nn=s=>Nt(s)||typeof s?.[Symbol.iterator]=="function",Dt=`[ 	
\f\r]`,We=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Rn=/-->/g,Dn=/>/g,Ae=RegExp(`>|${Dt}(?:([^\\s"'>=/]+)(${Dt}*=${Dt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ln=/'/g,Bn=/"/g,On=/^(?:script|style|textarea|title)$/i,Ot=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),v=Ot(1),ge=Ot(2),Ar=Ot(3),he=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),In=new WeakMap,Te=Ee.createTreeWalker(Ee,129);function Un(s,t){if(!Nt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Sn!==void 0?Sn.createHTML(t):t}var Hn=(s,t)=>{let e=s.length-1,n=[],r,o=t===2?"<svg>":t===3?"<math>":"",a=We;for(let i=0;i<e;i++){let l=s[i],d,g,c=-1,p=0;for(;p<l.length&&(a.lastIndex=p,g=a.exec(l),g!==null);)p=a.lastIndex,a===We?g[1]==="!--"?a=Rn:g[1]!==void 0?a=Dn:g[2]!==void 0?(On.test(g[2])&&(r=RegExp("</"+g[2],"g")),a=Ae):g[3]!==void 0&&(a=Ae):a===Ae?g[0]===">"?(a=r??We,c=-1):g[1]===void 0?c=-2:(c=a.lastIndex-g[2].length,d=g[1],a=g[3]===void 0?Ae:g[3]==='"'?Bn:Ln):a===Bn||a===Ln?a=Ae:a===Rn||a===Dn?a=We:(a=Ae,r=void 0);let y=a===Ae&&s[i+1].startsWith("/>")?" ":"";o+=a===We?l+Zs:c>=0?(n.push(d),l.slice(0,c)+Bt+l.slice(c)+pe+y):l+pe+(c===-2?i:y)}return[Un(s,o+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Ge=class s{constructor({strings:t,_$litType$:e},n){let r;this.parts=[];let o=0,a=0,i=t.length-1,l=this.parts,[d,g]=Hn(t,e);if(this.el=s.createElement(d,n),Te.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=Te.nextNode())!==null&&l.length<i;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith(Bt)){let p=g[a++],y=r.getAttribute(c).split(pe),_=/([.?@])?(.*)/.exec(p);l.push({type:1,index:o,name:_[2],strings:y,ctor:_[1]==="."?ht:_[1]==="?"?ut:_[1]==="@"?ft:Pe}),r.removeAttribute(c)}else c.startsWith(pe)&&(l.push({type:6,index:o}),r.removeAttribute(c));if(On.test(r.tagName)){let c=r.textContent.split(pe),p=c.length-1;if(p>0){r.textContent=ct?ct.emptyScript:"";for(let y=0;y<p;y++)r.append(c[y],Fe()),Te.nextNode(),l.push({type:2,index:++o});r.append(c[p],Fe())}}}else if(r.nodeType===8)if(r.data===It)l.push({type:2,index:o});else{let c=-1;for(;(c=r.data.indexOf(pe,c+1))!==-1;)l.push({type:7,index:o}),c+=pe.length-1}o++}}static createElement(t,e){let n=Ee.createElement("template");return n.innerHTML=t,n}};function Me(s,t,e=s,n){if(t===he)return t;let r=n!==void 0?e._$Co?.[n]:e._$Cl,o=Ye(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(s),r._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=r:e._$Cl=r),r!==void 0&&(t=Me(s,r._$AS(s,t.values),r,n)),t}var pt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,r=(t?.creationScope??Ee).importNode(e,!0);Te.currentNode=r;let o=Te.nextNode(),a=0,i=0,l=n[0];for(;l!==void 0;){if(a===l.index){let d;l.type===2?d=new Ie(o,o.nextSibling,this,t):l.type===1?d=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(d=new gt(o,this,t)),this._$AV.push(d),l=n[++i]}a!==l?.index&&(o=Te.nextNode(),a++)}return Te.currentNode=Ee,r}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},Ie=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,r){this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Me(this,t,e),Ye(t)?t===M||t==null||t===""?(this._$AH!==M&&this._$AR(),this._$AH=M):t!==this._$AH&&t!==he&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Nn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==M&&Ye(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ee.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,r=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Ge.createElement(Un(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new pt(r,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=In.get(t.strings);return e===void 0&&In.set(t.strings,e=new Ge(t)),e}k(t){Nt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,r=0;for(let o of t)r===e.length?e.push(n=new s(this.O(Fe()),this.O(Fe()),this,this.options)):n=e[r],n._$AI(o),r++;r<e.length&&(this._$AR(n&&n._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Cn(t).nextSibling;Cn(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Pe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,r,o){this.type=1,this._$AH=M,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=M}_$AI(t,e=this,n,r){let o=this.strings,a=!1;if(o===void 0)t=Me(this,t,e,0),a=!Ye(t)||t!==this._$AH&&t!==he,a&&(this._$AH=t);else{let i=t,l,d;for(t=o[0],l=0;l<o.length-1;l++)d=Me(this,i[n+l],e,l),d===he&&(d=this._$AH[l]),a||=!Ye(d)||d!==this._$AH[l],d===M?t=M:t!==M&&(t+=(d??"")+o[l+1]),this._$AH[l]=d}a&&!r&&this.j(t)}j(t){t===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ht=class extends Pe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===M?void 0:t}},ut=class extends Pe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==M)}},ft=class extends Pe{constructor(t,e,n,r,o){super(t,e,n,r,o),this.type=5}_$AI(t,e=this){if((t=Me(this,t,e,0)??M)===he)return;let n=this._$AH,r=t===M&&n!==M||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==M&&(n===M||r);r&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},gt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Me(this,t)}},zn={M:Bt,P:pe,A:It,C:1,L:Hn,R:pt,D:Nn,V:Me,I:Ie,H:Pe,N:ut,U:ft,B:ht,F:gt},ei=Lt.litHtmlPolyfillSupport;ei?.(Ge,Ie),(Lt.litHtmlVersions??=[]).push("3.3.3");var qn=(s,t,e)=>{let n=e?.renderBefore??t,r=n._$litPart$;if(r===void 0){let o=e?.renderBefore??null;n._$litPart$=r=new Ie(t.insertBefore(Fe(),o),o,void 0,e??{})}return r._$AI(s),r};var Ut=globalThis,ie=class extends ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=qn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return he}};ie._$litElement$=!0,ie.finalized=!0,Ut.litElementHydrateSupport?.({LitElement:ie});var ti=Ut.litElementPolyfillSupport;ti?.({LitElement:ie});(Ut.litElementVersions??=[]).push("4.2.2");var jn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Kn=s=>(...t)=>({_$litDirective$:s,values:t}),mt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:ni}=zn,Vn=s=>s;var Wn=()=>document.createComment(""),Ne=(s,t,e)=>{let n=s._$AA.parentNode,r=t===void 0?s._$AB:t._$AA;if(e===void 0){let o=n.insertBefore(Wn(),r),a=n.insertBefore(Wn(),r);e=new ni(o,a,s,s.options)}else{let o=e._$AB.nextSibling,a=e._$AM,i=a!==s;if(i){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(o!==r||i){let l=e._$AA;for(;l!==o;){let d=Vn(l).nextSibling;Vn(n).insertBefore(l,r),l=d}}}return e},me=(s,t,e=s)=>(s._$AI(t,e),s),si={},Fn=(s,t=si)=>s._$AH=t,Yn=s=>s._$AH,bt=s=>{s._$AR(),s._$AA.remove()};var Gn=(s,t,e)=>{let n=new Map;for(let r=t;r<=e;r++)n.set(s[r],r);return n},le=Kn(class extends mt{constructor(s){if(super(s),s.type!==jn.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let r=[],o=[],a=0;for(let i of s)r[a]=n?n(i,a):a,o[a]=e(i,a),a++;return{values:o,keys:r}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let r=Yn(s),{values:o,keys:a}=this.dt(t,e,n);if(!Array.isArray(r))return this.ut=a,o;let i=this.ut??=[],l=[],d,g,c=0,p=r.length-1,y=0,_=o.length-1;for(;c<=p&&y<=_;)if(r[c]===null)c++;else if(r[p]===null)p--;else if(i[c]===a[y])l[y]=me(r[c],o[y]),c++,y++;else if(i[p]===a[_])l[_]=me(r[p],o[_]),p--,_--;else if(i[c]===a[_])l[_]=me(r[c],o[_]),Ne(s,l[_+1],r[c]),c++,_--;else if(i[p]===a[y])l[y]=me(r[p],o[y]),Ne(s,r[c],r[p]),p--,y++;else if(d===void 0&&(d=Gn(a,y,_),g=Gn(i,c,p)),d.has(i[c]))if(d.has(i[p])){let x=g.get(a[y]),A=x!==void 0?r[x]:null;if(A===null){let R=Ne(s,r[c]);me(R,o[y]),l[y]=R}else l[y]=me(A,o[y]),Ne(s,r[c],A),r[x]=null;y++}else bt(r[p]),p--;else bt(r[c]),c++;for(;y<=_;){let x=Ne(s,l[_+1]);me(x,o[y]),l[y++]=x}for(;c<=p;){let x=r[c++];x!==null&&bt(x)}return this.ut=a,Fn(s,l),he}});var xt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ae(s){return xt[(s%xt.length+xt.length)%xt.length]}var Qn="#23272E",Jn="35,39,46";var ii=3,kt=36,Ht=12,ri=8,zt=60,qt=10,yt=30,jt=10,oi=150,ai=200,$t=1.4;function Vt(s,t){let e=Math.max(oi,ai/$t);return Math.ceil(zt+Math.max(0,s-1)*qt+yt+Math.max(0,t-1)*jt+e*(s+$t*t))}function Se(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function be(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function Re(s){return new Map(Se(s).map((t,e)=>[t,ae(e)]))}function re(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function xe(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Wt(s,t){return t==="none"?"Not needed":be(s).includes(t)?xe(s,t):t}function li(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function wt(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function vt(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(wt(t,n.from)),e.push(wt(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(wt(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function di(s){let t=s.map(a=>({...a,col:0,cols:1})).sort((a,i)=>a.s-i.s||i.en-a.en),e=[],n=[],r=-1/0,o=()=>{for(let a of e)a.cols=n.length;e=[],n=[]};for(let a of t){a.s>=r&&(o(),r=-1/0);let i=n.findIndex(l=>l<=a.s);i<0?(i=n.length,n.push(a.en)):n[i]=a.en,a.col=i,e.push(a),r=Math.max(r,a.en)}return o(),t}function ci(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],r=s[e+1];if(t<=r.t)return r.t===n.t?n.y:Math.round(n.y+(t-n.t)/(r.t-n.t)*(r.y-n.y))}return s[s.length-1].y}function pi(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],r=s[e+1];if(t<=r.y)return r.y===n.y?n.t:n.t+(t-n.y)/(r.y-n.y)*(r.t-n.t)}return s[s.length-1].t}function es(s,t){return ci(s.anchors,t)}function ts(s,t){return pi(s.anchors,t)}function hi(s,t){let e=Se(s),n=be(s),r=Math.max(t,Vt(e.length,n.length)),a=(r-zt-Math.max(0,e.length-1)*qt-yt-Math.max(0,n.length-1)*jt)/(e.length+$t*n.length||1),i=Math.floor(a),l=Math.floor(a*$t),d=new Map;for(let _ of s.days)for(let x of _.events){let A=d.get(x.kid)??[];A.some(R=>R.event_id===x.event_id&&R.calendar_id===x.calendar_id)||A.push(x),d.set(x.kid,A)}let g=Re(s),c=[],p=zt;e.forEach((_,x)=>{let A=d.get(_)??[],R=s.days.some(k=>k.events.some(K=>K.kid===_&&(K.sides.includes("drop")&&K.drop===""||K.sides.includes("pick")&&K.pick==="")));c.push({id:_,kind:"kid",x:p,w:i,name:re(s,_),dot:g.get(_).color,rgb:g.get(_).rgb,sub:`${R?"Needs a ride · ":""}${A.length} this week`,subWarn:R}),p+=i+(x<e.length-1?qt:0)});let y=p+yt/2;return p+=yt,n.forEach((_,x)=>{let A=0,R=0;for(let k of s.days){let K=k.drivers[_];K&&(A+=K.outings.length,R+=K.drive??0)}c.push({id:_,kind:"driver",x:p,w:l,name:xe(s,_),dot:Qn,rgb:Jn,sub:`${A} ${A===1?"trip":"trips"} this week · ${je(R)} driving`,subWarn:!1}),p+=l+(x<n.length-1?jt:0)}),{columns:c,sepX:y,width:r}}function ui(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let r=e.slice(t.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(r);if(!o)return e;let a=r.slice(o[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Xn(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${L(s.start)}`:e||!t?`${s.title} until ${L(s.end)}`:`${s.title} ${L(s.start)}–${L(s.end)}`}function Ft(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length}function fi(s,t){let e=it(t,s);return e===0?"Today":e===1?"Tomorrow":""}function Z(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Kt(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),r=1,o=0;for(let a of s.split(/\s+/).filter(Boolean)){let i=a.length;for(o===0?o=i:o+1+i<=n?o+=1+i:(r++,o=i);o>n;)r++,o-=n}return r}var ns=25,ss=15,Yt=3;function Zn(s){return Math.max(0,Math.min(Yt,Math.floor((s-ns)/ss)))}function gi(s,t){let e=Math.min(Yt,Kt(s,t-19,6.6));return ns+e*ss+2}function mi(s,t){let e=t-23,n=`${L(s.start)}–${L(s.end)}`+(s.arrive_by!=null?` · arrive ${L(s.arrive_by)}`:""),r=33+Kt(n,e,6.6)*16;for(let o of[s.lines.drop,s.lines.pick])o&&(r+=2+Kt(o.text,e,7)*16);return r+4}function is(s,t,e,n){let r=t==="compact",{columns:o,sepX:a,width:i}=hi(s,e),l=new Map(o.map(k=>[k.id,k])),d=Se(s),g=be(s),c=[...d,...g],p=Re(s),y=li(s),_=k=>re(s,k),x=k=>xe(s,k),A={mode:t,width:i,height:0,columns:o,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},R=0;return s.days.forEach((k,K)=>{let V=K*1440,j=new Map(k.events.map(w=>[w.id,w])),se=w=>w&&j.has(w)?{day:k.date,event:w}:null,f=Ft(k),b=k.events.length,h=fi(k.date,n.date);A.dayHeads.push({date:k.date,y:R,label:Be(k.date),tag:h,sub:(b?`${b} ${b===1?"activity":"activities"}`:"Nothing scheduled")+(f?` · ${f} to sort out`:""),warn:f>0}),A.anchors.push({t:V,y:R});let u=R+kt+Ht,m=g.flatMap(w=>k.drivers[w]?.outings??[]);if(!b&&!m.length){A.empties.push({key:k.date,y:u,text:"Nothing planned"}),R=u+40,A.anchors.push({t:V+1439,y:R});return}let $=(w,O,B,D,I,z,S)=>{let Q=p.get(w.kid)??ae(0),te=w.lines;return{key:`${k.date}|card|${w.id}`,x:O,y:B,w:D,h:I,target:{day:k.date,event:w.id},event:w,color:Q,kidName:_(w.kid),clash:z,stayed:w.stay&&g.includes(w.drop),title:ui(w.title,_(w.kid)),time:`${L(w.start)}–${L(w.end)}`+(w.arrive_by!=null?` · arrive ${L(w.arrive_by)}`:""),drop:te.drop,pick:te.pick,showDrop:!!te.drop&&(S||I>=56),showPick:!!te.pick&&(S||I>=74),wrap:S,aria:`${_(w.kid)}, ${w.title} ${L(w.start)} to ${L(w.end)}. `+[te.drop,te.pick].filter(de=>!!de).map(de=>de.text).join(". ")}},T=w=>{let O=k.rides[w];return O?(k.drivers[O.driver]?.segments??[]).filter(D=>D.type!=="home"&&D.kids.includes(O.kid)&&Z(D.start)>=Z(O.start)&&Z(D.end)<=Z(O.end)):[]},N=w=>{let O=k.rides[w];if(!O)return null;let B=O.serves.find(D=>j.get(D)?.kid===O.kid);return se(B??O.serves[0])},U=new Map;for(let w of k.issues)w.level!=="problem"||!w.event||(w.kind==="late"&&U.set(w.event,`${Math.round(Z(w.minutes))} min late`),w.kind==="waiting"&&U.set(`${w.event}|pick`,`Waits ${Math.round(Z(w.minutes))} min`));if(!r){let w=1/0,O=-1/0;for(let S of k.events)w=Math.min(w,S.start-20,S.arrive_by!=null?S.arrive_by-10:1/0),O=Math.max(O,S.end+20);for(let S of m)S.start!=null&&(w=Math.min(w,S.start)),S.end!=null&&(O=Math.max(O,S.end));k.date===n.date&&Number.isFinite(w)&&n.minutes>w-60&&n.minutes<O&&(w=Math.min(w,n.minutes-15));let B=Number.isFinite(w)?Math.floor((w-5)/30)*30:900,D=Number.isFinite(O)?Math.ceil((O+5)/30)*30:960,I=S=>Math.round(u+(Math.max(B,Math.min(D,S))-B)*ii);A.anchors.push({t:V+B,y:I(B)},{t:V+D,y:I(D)});for(let S of d){let Q=l.get(S),te=p.get(S),de=(k.kids[S]?.items??[]).filter(q=>q.start!=null&&q.end!=null).map(q=>({item:q,s:Z(q.start),en:Z(q.end)}));for(let q of di(de)){let P=Q.w/q.cols,Y=Math.round(Q.x+q.col*P),W=Math.round(P-(q.cols>1?4:0)),J=I(q.s),ue=q.item;if(ue.type==="act"){let ne=j.get(ue.event??"");if(!ne)continue;let tn=Math.max(30,I(q.en)-J);if(A.cards.push($(ne,Y,J,W,tn,ue.clash,!1)),ne.arrive_by!=null&&ne.start-ne.arrive_by>=5){let rn=I(ne.arrive_by);A.preps.push({key:`${k.date}|prep|${ne.id}`,x:Y,y:rn,w:W,h:J-rn+6,color:te,label:`Arrive by ${L(ne.arrive_by)}`})}let nn=U.get(ne.id);nn&&A.marks.push({key:`${k.date}|late|${ne.id}`,x:Y+W-4,y:J+4,text:nn,right:!0});let sn=U.get(`${ne.id}|pick`);sn&&A.marks.push({key:`${k.date}|wait|${ne.id}`,x:Y+4,y:J+tn+2,text:sn,right:!1});continue}let X=k.rides[ue.ride??-1];if(!X)continue;let $e=Math.max(22,I(q.en)-J),Ue=vt(T(X.index),y),G=x(X.driver);A.rides.push({key:`${k.date}|ride|${X.index}`,x:Y,y:J,w:W,h:$e,target:N(X.index),l1:`${X.own?"In":"Along in"} ${G}’s car`,l2:Ue.join(" → "),show2:Zn($e)>0,lines2:Zn($e),dashed:!X.own,clash:ue.clash,aria:`${_(S)} ${X.own?"in":"riding along in"} ${G}’s car, ${L(Z(X.start))} to ${L(Z(X.end))}: ${Ue.join(" to ")}`});let ke=l.get(X.driver);ke&&A.bands.push({key:`${k.date}|band|${X.index}`,x:Y+W,y:J,w:Math.max(0,ke.x+8-(Y+W)),h:$e,color:te})}}for(let S of g){let Q=l.get(S),te=k.drivers[S];if(!te)continue;let de=[],q=null;for(let P of te.segments)if(!(P.start==null||P.end==null)){if(P.type==="home"){q=null;continue}if(P.type==="stay"){q=null,de.push({type:"stay",g:P,s:P.start,en:P.end});continue}q&&q.en===P.start?(q.en=P.end,q.legs.push(P)):(q={type:"trip",s:P.start,en:P.end,legs:[P]},de.push(q))}for(let P of de){let Y=I(P.s),W=Math.max(24,I(P.en)-Y);if(P.type==="stay"){let G=j.get(P.g.event??P.g.serves??""),ke=G?p.get(G.kid)??ae(0):ae(0),ne=P.g.kids.map(_);A.stays.push({key:`${k.date}|stay|${S}|${P.s}`,x:Q.x+8,y:Y,w:Q.w-16,h:W,target:se(G?.id),color:ke,l1:G?`At ${G.title} with ${_(G.kid)}`:"Staying",l2:`until ${L(P.en)}`+(ne.length?` · ${ne.join(" and ")} too`:"")});continue}let J=P.legs[0],ue=P.legs[P.legs.length-1],X=[];for(let G of P.legs)for(let ke of G.kids)X.includes(ke)||X.push(ke);let $e=ue.type==="drive"&&ue.to==="home",Ue=vt(P.legs,y);A.trips.push({key:`${k.date}|trip|${S}|${P.s}`,x:Q.x+8,y:Y,w:Q.w-16,h:W,target:se(P.legs.find(G=>G.serves)?.serves),l1:J.type==="drive"&&J.from==="home"?`Leave ${L(P.s)}`:`From ${wt(y,J.from??J.place)} ${L(P.s)}`,l2:Ue.join(" → "),show2:W>=36,l3:$e?`Home ${L(P.en)}`:"",show3:$e&&W>=62,stops:null,kids:X.map(G=>(p.get(G)??ae(0)).color),bad:P.legs.some(G=>G.overlaps_busy),aria:`${x(S)} drives ${Ue.join(" to ")}, ${L(P.s)} to ${L(P.en)}`})}for(let P of te.segments)if(!(!P.overlaps_busy||P.start==null||P.end==null))for(let Y of te.busy){let W=Math.max(P.start,Y.start),J=Math.min(P.end,Y.end);J<=W||A.overlaps.push({key:`${k.date}|overlap|${S}|${W}`,x:Q.x+6,y:I(W)-2,w:Q.w-12,h:Math.max(8,I(J)-I(W)+4)})}for(let P of te.busy){if(P.end<=B||P.start>=D)continue;let Y=I(P.start),W=I(P.end);A.busy.push({key:`${k.date}|busy|${S}|${P.start}`,x:Q.x+1,y:Y,w:Q.w-2,h:W-Y,labelY:8,label:Xn(P,!1)})}}let z=-1/0;for(let S=B;S<=D;S+=30)A.grid.push({key:`${k.date}|grid|${S}`,y:I(S),strong:S%60===0}),S%60===0&&I(S)-z>=22&&(A.hours.push({key:`${k.date}|hour|${S}`,y:I(S)-8,label:wn(S)}),z=I(S));k.date===n.date&&n.minutes>B&&n.minutes<D&&(A.now={y:I(n.minutes),label:`Now ${L(n.minutes)}`}),R=I(D)+Ht;return}let C=[];for(let w of d){let O=l.get(w);for(let B of k.kids[w]?.items??[])if(B.start!=null){if(B.type==="act"){let D=j.get(B.event??"");if(!D)continue;C.push({col:w,s:B.start,h:mi(D,O.w),kind:"act",item:B})}else if(!k.rides[B.ride??-1]?.own){let D=k.rides[B.ride??-1],I=D?vt(T(D.index),y).join(" → "):"";C.push({col:w,s:B.start,h:gi(I,O.w),kind:"along",item:B})}}}for(let w of g){let O=k.drivers[w];if(O){for(let B of O.busy)C.push({col:w,s:B.start,h:32,kind:"busy",busy:B});for(let B of O.outings)B.start!=null&&C.push({col:w,s:B.start,h:30+B.lines.length*16+(B.warn?16:0),kind:"out",out:B})}}C.sort((w,O)=>w.s-O.s||c.indexOf(w.col)-c.indexOf(O.col));let E=new Map,H=u;C.forEach((w,O)=>{let B=E.get(w.col),D=Math.max(B!=null?B+ri:u,H);E.set(w.col,D+w.h),H=D,A.anchors.push({t:V+w.s,y:D});let I=l.get(w.col);if(w.kind==="busy")A.busy.push({key:`${k.date}|busy|${w.col}|${O}`,x:I.x+1,y:D,w:I.w-2,h:w.h,labelY:8,label:Xn(w.busy,!0)});else if(w.kind==="out"){let z=w.out;A.trips.push({key:`${k.date}|trip|${w.col}|${O}`,x:I.x+8,y:D,w:I.w-16,h:w.h,target:se(z.target),l1:z.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...z.lines.map(S=>({text:S,warn:!1})),...z.warn?[{text:z.warn,warn:!0}]:[]],kids:z.kids.map(S=>(p.get(S)??ae(0)).color),bad:!!z.warn,aria:`${x(w.col)}: ${z.lead}. ${z.lines.join(". ")}${z.warn?`. ${z.warn}`:""}`})}else if(w.kind==="act"){let z=j.get(w.item.event??"");A.cards.push($(z,I.x,D,I.w,w.h,w.item.clash,!0))}else{let z=k.rides[w.item.ride??-1],S=vt(T(z.index),y),Q=x(z.driver);A.rides.push({key:`${k.date}|ride|${z.index}`,x:I.x,y:D,w:I.w,h:w.h,target:N(z.index),l1:`Along with ${Q} ${L(Z(z.start))}`,l2:S.join(" → "),show2:!0,lines2:Yt,dashed:!0,clash:w.item.clash,aria:`${_(w.col)} riding along with ${Q}, ${L(Z(z.start))} to ${L(Z(z.end))}: ${S.join(" to ")}`})}});let F=u;for(let w of E.values())F=Math.max(F,w);R=F+Ht+6,A.anchors.push({t:V+1439,y:R})}),A.height=R,A}var bi=["","¼","½","¾"];function Ce(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return je(n);let r=Math.round(n*4),o=Math.floor(r/4),a=bi[r%4];return`${o||!a?o:""}${a} min`})}function rs(s){let t=e=>e?{...e,text:Ce(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,r])=>[n,{...r,outings:r.outings.map(o=>({...o,lines:o.lines.map(Ce),warn:o.warn==null?o.warn:Ce(o.warn)}))}])),issues:e.issues.map(n=>({...n,title:Ce(n.title),body:Ce(n.body),note:n.note==null?n.note:Ce(n.note),...n.suggestions?{suggestions:n.suggestions.map(r=>({...r,note:Ce(r.note)}))}:{}}))}))}}var xi=2,vi=48;function os(s,t,e=vi){let n=[],r=0,o=0,a=0,i=0,l=t.minutes+e*60;for(let d of s.days){let g=it(t.date,d.date),c=g===0?"":`${fe(d.date)} · `,p=new Map(d.events.map(x=>[x.id,x])),y=x=>x&&p.has(x)?{day:d.date,event:x}:null,_=(x,A)=>g*1440+(x??p.get(A??"")?.start??0)<l;for(let x of d.issues)if(x.level==="problem"){if(!_(x.at,x.event)){a++,x.kind==="unassigned"&&i++;continue}r++,x.kind==="unassigned"&&o++,n.push({key:`${d.date}|${x.key}`,tone:x.kind==="unassigned"?"unassigned":"problem",title:c+x.title,body:x.body,target:y(x.event),suggestions:(x.suggestions??[]).map(A=>({id:A.id,label:A.label,note:A.note}))})}if(d.clashes.forEach((x,A)=>{if(!_(x.a.start,x.a.event)){a++;return}r++;let R=p.get(x.a.event??""),k=re(s,x.kid),K="";if(x.b.type==="act"){let V=p.get(x.b.event??"");K=R&&V?`${R.title} ${L(R.start)}–${L(R.end)} and ${V.title} ${L(V.start)}–${L(V.end)} overlap.`:""}else{let V=d.rides[x.b.ride??-1];K=R&&V?`${k} is in ${xe(s,V.driver)}’s car ${L(Z(x.b.start))}–${L(Z(x.b.end))}, during ${R.title}.`:""}n.push({key:`${d.date}|clash|${A}`,tone:"problem",title:`${c}${k} is double-booked`,body:K,target:y(x.a.event),suggestions:[]})}),g>=0&&g<xi)for(let x of d.issues)x.level!=="heads_up"||!_(x.at,x.event)||n.push({key:`${d.date}|${x.key}`,tone:"heads_up",title:c+x.title,body:x.body,target:y(x.event),suggestions:[]});for(let x of d.events)!x.problems.length||!_(x.start)||n.push({key:`${d.date}|notes|${x.id}`,tone:"heads_up",title:`${c}Check the notes on ${re(s,x.kid)}’s ${x.title}`,body:`These lines couldn’t be read: ${x.problems.join("; ")}`,target:y(x.id),suggestions:[]})}return{items:n,problems:r,unassigned:o,later:a,laterUnassigned:i}}function as(s,t){let e=Re(s),n=null,r=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of s.days){let a=it(t.date,o.date);if(!(a<0))for(let i of be(s))for(let l of o.drivers[i]?.outings??[]){if(l.start==null)continue;let d=a*1440+l.start;if(a*1440+Z(l.end,l.start)<=t.minutes)continue;let c=d-t.minutes,p={driver:i,name:xe(s,i),date:o.date,ahead:a,start:l.start,inMinutes:c,ongoing:c<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(y=>e.get(y)??ae(0)),warn:l.warn,target:l.target&&o.events.some(y=>y.id===l.target)?{day:o.date,event:l.target}:null};(!n||r(p)<r(n)||r(p)===r(n)&&p.inMinutes<n.inMinutes)&&(n=p)}}return n}var yi={timeline:"timeline",full:"timeline",compact:"compact"};function _t(s){let t=new URLSearchParams(s),e={},n=yi[(t.get("view")??"").trim().toLowerCase()];return n&&(e.view=n),["off","no","false","0"].includes((t.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),e}var wi=["auth_callback","code","state"];function Gt(s){let t=new URLSearchParams(s);for(let n of wi)t.delete(n);let e=t.toString();return e?`?${e}`:""}var ls=_e`
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
`;var ds="mydashlight.rides.mode",$i=1100,ki=440,_i=700,Ai=3*6e4,Ti=1200;function Ei(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}function At(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Mi(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Pi(){try{return localStorage.getItem(ds)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Ci(s){try{localStorage.setItem(ds,s)}catch{}}function Tt(s){return s.days.every(t=>!t.events.length)}var Qe=class extends ie{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=_t(location.search).view;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let r=e.clientX-n.x,o=e.clientY-n.y;if(!n.moved){if(Math.abs(r)+Math.abs(o)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-o,n.el.scrollLeft=n.left-r};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Ai))};this.onKey=e=>{e.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Pi(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.backend&&(this.stopWatching=this.backend.watch(e=>{this.plan=rs(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<$i)return!1;let e=this.plan;return!e||this.width-ki>=Vt(Se(e).length,be(e).length)}today(){return qe(this.plan?.time_zone??Ei())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),r=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||r!==this.boardKey)&&(this.board=is(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=r),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let r=this.scroller;if(!r||!this.board)return;let o=this.board.dayHeads.find(a=>a.date===n)?.y??0;r.scrollTop=Math.max(o,es(this.board,e)-kt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let r=this.today();if(e===r.date){this.scrollToNow();return}let o=this.dayIndexOf(e),a=n.days[o];if(!a)return;let i=1/0;if(this.mode==="timeline"){for(let l of a.events)i=Math.min(i,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let d of l.outings)d.start!=null&&(i=Math.min(i,d.start))}this.scrollToTime(o*1440+(Number.isFinite(i)?Math.max(0,i-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,r=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=n+1&&(r=d);let o=this.renderRoot,a=o.querySelector(".pinned .label"),i=o.querySelector(".pinned .tag"),l=o.querySelector(".pinned .sub");a&&a.textContent!==r.label&&(a.textContent=r.label),i&&(i.textContent!==r.tag&&(i.textContent=r.tag),i.hidden=!r.tag),l&&l.textContent!==r.sub&&(l.textContent=r.sub),l?.classList.toggle("warn",r.warn);for(let d of o.querySelectorAll(".day-tile"))d.classList.toggle("in-view",d.dataset.date===r.date)}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?ts(this.board,n.scrollTop+kt+4):null,this.mode=e,this.urlView||Ci(e)}findEvent(e){let n=this.plan?.days.find(o=>o.date===e.day),r=n?.events.find(o=>o.id===e.event);return n&&r?{day:n,event:r}:null}open(e){e&&(this.flushArrive(),this.sel=e,this.scope="this",this.arriveDraft=void 0)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,r){if(!this.pending){this.pending={key:e,value:n};try{await r()}catch(o){let a=o instanceof oe?o:new oe("error",String(o));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,n,r){if(!this.backend)return;let o=this.backend;this.save(`${n}`,r,()=>o.setRide(e.id,n,r,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n){if(!this.backend)return;let r=this.backend,o=e.along.includes(n)?e.along.filter(a=>a!==n):[...e.along,n];this.save("along",o,()=>r.setTakeAlong(e.id,o,this.scope))}nudgeArrive(e,n){let r=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;n<0?o=(r??e.start)-5:o=r==null||r+5>=e.start?null:r+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Ti)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let r=this.findEvent(n);if(!r||r.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,a=r.event.id,i=this.scope;this.save("arrive",e,()=>o.setArriveBy(a,e,i)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),r=e?os(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},o=this.wide,a=v`<aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
      ${this.sel&&e?this.renderEditor(e):this.renderAttention(r)}
    </aside>`;return v`
      <div class="app ${o?"wide":this.width<_i?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,r)} ${e?this.renderWeek(e):M} ${this.renderBanner(e)}
          <main>
            <section class="board-area" aria-label="Everyone’s week">
              ${n&&e?Tt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
            </section>
            ${!o&&(this.sheet||this.sel)?v`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${a}`:M}
          </main>
        </div>
        ${o?a:M}
        ${this.toast?v`<div class="toast" role="status">${this.toast}</div>`:M}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(e,n){let r=n.problems;this.tick;let o=this.today(),a="";if(e){let g=e.time_zone,c=new Date(e.updated);this.error?a=v`<span class="bad">Can’t reach Home Assistant · showing the plan from ${rt(c,new Date,g)}</span>`:e.status&&!e.status.ok?a=v`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${rt(c,new Date,g)}</span>`:this.backend?.live||(a=`Updated ${rt(c,new Date,g)}`)}let i=(g,c,p,y)=>v`
      <button type="button" class="seg-btn" title=${y} aria-pressed=${this.mode===g?"true":"false"} @click=${()=>this.setMode(g)}>
        ${p}<span class="seg-label">${c}</span>
      </button>
    `,l=ze(o.minutes),d=!!e&&Tt(e);return v`
      <header>
        ${this.showMenu?v`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ge`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:M}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Be(o.date)}, ${l}`}>
            <span class="hm">${l.slice(0,-3)}</span><span class="ampm">${l.slice(-2)}</span>
          </h1>
          <p class="today-line">${Be(o.date)}</p>
          ${a?v`<p class="status">${a}</p>`:M}
        </div>
        ${e&&!d?this.renderNext(e,as(e,o),n):M}
        <div class="controls">
          ${this.wide||d?M:v`<button type="button" class="attn-btn ${r?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${r}</span>
              </button>`}
          <div role="group" aria-label="View" class="seg">
            ${i("timeline","Timeline",ge`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${i("compact","Compact",ge`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>
        </div>
      </header>
    `}renderNext(e,n,r){if(!n){let d=this.today().date,g=r.unassigned,c=r.laterUnassigned;if(g){let y=v`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${g} ${g===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?v`<div class="next idle needs">${y}</div>`:v`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${y}</button>`}if(c)return v`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${c} ${c===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let p=e.days.some(y=>y.date>=d&&y.events.length);return v`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${p?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${p?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let o;n.ongoing?o="On the road now":n.ahead===0?o=n.inMinutes<180?`Next trip · in ${je(n.inMinutes)}`:"Next trip · later today":n.ahead===1?o="Next trip · tomorrow":o=`Next trip · ${fe(n.date)}`;let a=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,i=v`
      <span class="next-eyebrow">${o}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${At(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(d=>v`<span class="kid-dot" style="background:${d.color}"></span>`)}</span>
      </span>
      ${n.warn?v`<span class="next-stop warn">${n.warn}</span>`:n.stop?v`<span class="next-stop">${n.stop}</span>`:M}
    `,l=`next ${n.ongoing?"ongoing":a?"soon":""}`;return n.target?v`<button type="button" class=${l} @click=${()=>this.open(n.target)}>${i}</button>`:v`<div class=${l}>${i}</div>`}renderWeek(e){let n=this.today().date,r=Re(e);return v`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let a=Ft(o),i=o.events.length,l=o.events.slice(0,6).map(g=>r.get(g.kid)?.color??ae(0).color),d=`${Be(o.date)}: ${i?`${i} ${i===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return v`<button
          type="button"
          class="day-tile ${o.date===n?"today":""}"
          data-date=${o.date}
          aria-label=${d}
          @click=${()=>this.goToDay(o.date)}
        >
          <span class="dt-wd">${o.date===n?"Today":fe(o.date)}</span>
          <span class="dt-num">${Number(o.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(g=>v`<span class="dt-dot" style="background:${g}"></span>`):v`<span class="dt-free">free</span>`}
            ${i>6?v`<span class="dt-more">+${i-6}</span>`:M}
          </span>
          ${a?v`<span class="dt-badge" aria-hidden="true">${a}</span>`:M}
        </button>`})}
    </nav>`}renderQuiet(e){let n=Se(e),r=be(e),o=Re(e),a=n.map(i=>re(e,i));return v`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((i,l)=>ge`<circle cx=${50+l*30} cy="80" r="11" fill=${o.get(i).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Mi(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(i=>{let l=o.get(i);return v`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${At(re(e,i))}</span>
            <span class="qw-name">${re(e,i)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${r.map(i=>v`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${At(xe(e,i))}</span>
            <span class="qw-name">${xe(e,i)}</span>
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
    </div>`}renderBanner(e){let n=e?.unavailable_calendars.length??0;return n?v`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:M}renderEmpty(){return this.error?v`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:v`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,r=i=>!!i&&!!n&&i.day===n.day&&i.event===n.event,o=e.dayHeads[0],a=e.width;return v`
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
          ${e.columns.map(i=>v`<div class="col-head ${i.kind}" style="left:${i.x}px;width:${i.w}px;--c:${i.dot};--rgb:${i.rgb}">
              <span class="avatar ${i.kind}" aria-hidden="true">${At(i.name)}</span>
              <span class="ch-text">
                <span class="name">${i.name}</span>
                <span class="sub ${i.subWarn?"warn":""}">${i.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${a}px">
          <span class="label">${o?.label??""}</span><span class="tag" ?hidden=${!o?.tag}>${o?.tag??""}</span
          ><span class="sub ${o?.warn?"warn":""}">${o?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${a}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(i=>v`<div
                class="col-bg ${i.kind}"
                style="left:${i.x}px;width:${i.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${i.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(i=>v`<div class="day-head" style="top:${i.y}px;width:${a}px">
              <span class="label">${i.label}</span>${i.tag?v`<span class="tag">${i.tag}</span>`:M}<span
                class="sub ${i.warn?"warn":""}"
                >${i.sub}</span
              >
            </div>`)}
          ${e.empties.map(i=>v`<span class="empty" style="top:${i.y}px">${i.text}</span>`)}
          ${e.grid.map(i=>v`<div class="grid ${i.strong?"strong":""}" style="top:${i.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(i=>v`<span class="hour" style="top:${i.y}px">${i.label}</span>`)}
          ${le(e.bands,i=>i.key,i=>v`<div
                class="band"
                aria-hidden="true"
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;background:rgba(${i.color.rgb},0.10);border-color:rgba(${i.color.rgb},0.45)"
              ></div>`)}
          ${le(e.busy,i=>i.key,i=>v`<div class="busy" style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px">
                <span style="top:${i.labelY}px">${i.label}</span>
              </div>`)}
          ${le(e.preps,i=>i.key,i=>v`<div
                class="prep"
                aria-hidden="true"
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;border-color:${i.color.color};background:rgba(${i.color.rgb},0.07);color:${i.color.ink}"
              >
                ${i.label}
              </div>`)}
          ${le(e.cards,i=>i.key,i=>{let l=i.color,d=i.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return v`<button
                type="button"
                class="card ${i.wrap?"wrap":""} ${r(i.target)?"sel":""} ${i.clash?"clash":""}"
                aria-label=${i.aria}
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;background:${d};border-color:${i.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--ring:${l.color}"
                @click=${()=>this.open(i.target)}
              >
                <span class="top">
                  <span class="title">${i.title}</span>
                  <span class="time">${i.time}</span>
                  ${i.showDrop&&i.drop?v`<span class="line tone-${i.drop.tone}">${i.drop.text}</span>`:M}
                </span>
                ${i.showPick&&i.pick?v`<span class="line tone-${i.pick.tone}">${i.pick.text}</span>`:M}
              </button>`})}
          ${le(e.rides,i=>i.key,i=>v`<button
                type="button"
                class="ride ${i.dashed?"dashed":""} ${i.clash?"clash":""}"
                aria-label=${i.aria}
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px"
                @click=${()=>this.open(i.target)}
              >
                <span class="l1">${i.l1}</span>${i.show2?v`<span class="l2" style="-webkit-line-clamp:${i.lines2}">${i.l2}</span>`:M}
              </button>`)}
          ${le(e.stays,i=>i.key,i=>v`<button
                type="button"
                class="stay"
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;border-color:${i.color.color};background:repeating-linear-gradient(135deg, rgba(${i.color.rgb},0.28) 0px, rgba(${i.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(i.target)}
              >
                <span class="l1" style="color:${i.color.ink}">${i.l1}</span><span class="l2">${i.l2}</span>
              </button>`)}
          ${le(e.trips,i=>i.key,i=>v`<button
                type="button"
                class="trip ${i.bad?"bad":""} ${i.stops?"list":""}"
                aria-label=${i.aria}
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px"
                @click=${()=>this.open(i.target)}
              >
                <span class="l1">${i.l1}${i.kids.map(l=>v`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${i.show2?v`<span class="l2">${i.l2}</span>`:M}
                ${i.stops?i.stops.map(l=>v`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):M}
                ${i.show3?v`<span class="l3">${i.l3}</span>`:M}
              </button>`)}
          ${le(e.overlaps,i=>i.key,i=>v`<div class="overlap" aria-hidden="true" style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px"></div>`)}
          ${le(e.marks,i=>i.key,i=>v`<span class="mark" style="left:${i.x}px;top:${i.y}px;${i.right?"transform:translateX(-100%)":""}">${i.text}</span>`)}
          ${e.now?v`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:M}
        </div>
      </div>
    `}renderAttention(e){let{items:n,problems:r,later:o}=e,a=this.plan;return v`
      <div class="panel-head">
        <h2>Needs attention <span class="panel-sub">Next two days</span></h2>
        <span class="count-pill ${r?"bad":"ok"}">${r}</span>
        ${this.wide?M:v`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${a&&!r?v`<div class="all-clear">
            <span class="check" aria-hidden="true">${ge`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Tt(a)?"Nothing needs you this week.":o?`Nothing for the next two days. ${o} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:M}
      ${n.map(i=>v`<div class="issue ${i.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${i.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${i.target?v`<button type="button" class="issue-title" @click=${()=>this.open(i.target)}>${i.title}</button>`:v`<strong class="issue-title">${i.title}</strong>`}
              <span class="issue-body">${i.body}</span>
            </div>
          </div>
          ${i.suggestions.length?v`<div class="fixes">
                ${i.suggestions.map(l=>v`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(l.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${l.id}`?"Saving…":l.label}</span>
                    <span class="fix-note">${l.note}</span>
                  </button>`)}
              </div>`:M}
        </div>`)}
      ${this.wide&&a&&!Tt(a)?this.renderLegend():M}
    `}renderLegend(){return v`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return v``;let{day:r,event:o}=n,a=be(e),l=Re(e).get(o.kid)??ae(0),d=!!this.pending,g=u=>this.pending?.key===u?this.pending.value:void 0,c=[...e.people?.carpools??[]];for(let u of e.days)for(let m of u.events)for(let $ of[m.drop,m.pick])$&&$!=="none"&&!a.includes($)&&!c.some(T=>T.toLowerCase()===$.toLowerCase())&&c.push($);let p=u=>{if(!o.sides.includes(u))return M;let m=g(u),$=m!==void 0?String(m):u==="drop"?o.drop:o.pick,T=$&&$!=="none"&&!a.includes($)?$:"",N=C=>this.setRide(o,u,$===C?"":C),U=[...a.map(C=>[C,Wt(e,C)]),["none","Not needed"]];return v`<div class="field">
        <span class="field-label">${u==="drop"?"Drop-off":"Pick-up"} ${$===""?v`<span class="nobody">· nobody yet</span>`:M}</span>
        <div role="group" aria-label=${u==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${U.length}, minmax(0, 1fr))">
          ${U.map(([C,E])=>v`<button type="button" class="choice" aria-pressed=${$===C?"true":"false"} ?disabled=${d} @click=${()=>N(C)}>
                ${E}
              </button>`)}
        </div>
        ${c.length?v`<div role="group" aria-label=${u==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${c.map(C=>v`<button type="button" class="chip" aria-pressed=${$.toLowerCase()===C.toLowerCase()?"true":"false"} ?disabled=${d} @click=${()=>N(C)}>
                    ${C}
                  </button>`)}
            </div>`:M}
        <input
          type="text"
          .value=${T&&!c.some(C=>C.toLowerCase()===T.toLowerCase())?T:""}
          ?disabled=${d}
          aria-label=${u==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${C=>{let E=C.target.value.trim();E&&E!==$&&this.setRide(o,u,E)}}
          @keydown=${C=>{C.key==="Enter"&&C.target.blur()}}
        />
      </div>`},y=g("stay"),_=y!==void 0?!!y:o.stay,x=o.drop===o.pick&&a.includes(o.drop),A=g("along"),R=A!==void 0?A:o.along,k=Se(e).filter(u=>u!==o.kid),K=a.includes(o.drop)&&o.sides.includes("drop"),V=g("arrive"),j=this.arriveDraft!==void 0?this.arriveDraft:V!==void 0?V:o.arrive_by,se=[],f=u=>u==="none"?"Not needed":Wt(e,u);o.drop!==""&&se.push(`Drop-off: ${f(o.drop)}`),o.pick!==""&&se.push(`Pick-up: ${f(o.pick)}`),o.stay&&se.push("Stay: yes"),o.along.length&&se.push(`Take along: ${o.along.map(u=>re(e,u)).join(", ")}`),o.arrive_by!=null&&se.push(`Arrive by: ${ze(o.arrive_by)}`);let b=r.date===this.today().date?"":`${fe(r.date)} · `,h=v`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${re(e,o.kid)} · ${o.title}</span>
          <span class="ed-meta">${b}${L(o.start)}–${L(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return o.where==="home"?v`${h}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${re(e,o.kid)} can’t get home in time, the board shows it as a clash.</p>`:v`
      ${h}
      ${this.pending?v`<p class="saving" role="status">Saving to Google Calendar…</p>`:M}
      ${o.recurring?v`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${fe(r.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:M}
      ${o.where==="anywhere"?v`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:M}
      ${p("drop")} ${p("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${_?"true":"false"} ?disabled=${!x||d} @click=${()=>this.toggleStay(o)}>
          ${x?_?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${K&&k.length?v`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${k.map(u=>v`<button type="button" class="chip" aria-pressed=${R.includes(u)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(o,u)}>
                  ${re(e,u)}
                </button>`)}
            </div>
          </div>`:M}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${j!=null?`${o.start-j} min before it starts`:`Aims for a few minutes before ${L(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${d} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${j!=null?L(j):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${d||j==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${j!=null?v`<button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:M}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${se.length?se.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?v`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:M}
      <p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>
    `}};Qe.styles=ls,Qe.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Qe);var cs=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],ps=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function hs(s,t,e,n){let r=Math.max(0,Math.min(t,s.length)),o=Math.max(r,Math.min(e,s.length));return{value:s.slice(0,r)+n+s.slice(o),caret:r+n.length}}function us(s,t,e){let n=Math.max(0,Math.min(t,s.length)),r=Math.max(n,Math.min(e,s.length));if(n!==r)return{value:s.slice(0,n)+s.slice(r),caret:n};if(n===0)return{value:s,caret:0};let o=Array.from(s.slice(0,n));o.pop();let a=o.join("");return{value:a+s.slice(n),caret:a.length}}function fs(s,t){return t===0||/\s$/.test(s.slice(0,t))}var Si=new Set(["text","search","email","url","tel","number","password"]);function gs(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Si.has(s.type)&&!s.readOnly&&!s.disabled}var Ri={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Di={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},Je=class extends ie{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=n=>n.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let n=e.selectionStart,r=e.selectionEnd;if(n!==null&&r!==null)return[n,r]}catch{}return[e.value.length,e.value.length]}apply(e,n,r){e.value=n;try{e.setSelectionRange(r,r)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=fs(this.field.value,e)}press(e){let n=this.field;if(n){switch(e){case"hide":n.blur();return;case"done":this.commit(),n.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),n.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[r,o]=this.selection(n),a=us(n.value,r,o);this.apply(n,a.value,a.caret);break}default:{let r=e==="space"?" ":this.shift?e.toUpperCase():e,[o,a]=this.selection(n),i=hs(n.value,o,a,r);this.apply(n,i.value,i.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let n=e.length>1,r=e==="layout"?this.layout==="letters"?"123":"ABC":Ri[e]??(this.shift?e.toUpperCase():e);return v`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":n?"wide":""}
      aria-label=${Di[e]??r}
      aria-pressed=${e==="shift"?String(this.shift):M}
      @click=${()=>this.press(e)}
    >
      ${r}
    </button>`}render(){let e=this.layout==="letters"?cs:ps;return v`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(n=>v`<div class="row">${n.map(r=>this.key(r))}</div>`)}
      </div>`}};Je.styles=_e`
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
  `,Je.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",Je);function Li(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function ms(s){document.addEventListener("focusin",t=>{let e=t.composedPath()[0];gs(e)&&s.attach(e)}),document.addEventListener("focusout",()=>{setTimeout(()=>{let t=Li();!s.target||t===s.target||(gs(t)?s.attach(t):s.detach())},0)}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var Qt="mydashlight",Bi=`/api/${Qt}/pair`,Ii=`/api/${Qt}/pair/poll`,Jt=`/${Qt}`,Xt="pair";function bs(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function xs(s,t){return`${s}${Jt}?${Xt}=${encodeURIComponent(t)}`}function Ni(s,t,e=Date.now()){return{hassUrl:s,clientId:t.client_id,access_token:t.access_token,refresh_token:t.refresh_token,expires_in:t.expires_in,expires:e+t.expires_in*1e3}}var De=class extends Error{constructor(t,e=!1){super(t),this.busy=e}};async function vs(s=fetch){let t=await s(Bi,{method:"POST",cache:"no-store"});if(t.status===429)throw new De("Too many screens are asking to pair right now.",!0);if(!t.ok)throw new De(`Home Assistant answered ${t.status}.`);return await t.json()}async function ys(s,t,e=fetch){let n=await e(Ii,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(n.status===404)return{status:"expired"};if(!n.ok)throw new De(`Home Assistant answered ${n.status}.`);let r=await n.json();return r.status==="paired"&&r.auth?{status:"paired",auth:Ni(t,r.auth)}:{status:"pending"}}var Oe=function(s,t){let r=s,o=Xe[t],a=null,i=0,l=null,d=[],g={},c=function(f,b){i=r*4+17,a=(function(h){let u=new Array(h);for(let m=0;m<h;m+=1){u[m]=new Array(h);for(let $=0;$<h;$+=1)u[m][$]=null}return u})(i),p(0,0),p(i-7,0),p(0,i-7),x(),_(),R(f,b),r>=7&&A(f),l==null&&(l=V(r,o,d)),k(l,b)},p=function(f,b){for(let h=-1;h<=7;h+=1)if(!(f+h<=-1||i<=f+h))for(let u=-1;u<=7;u+=1)b+u<=-1||i<=b+u||(0<=h&&h<=6&&(u==0||u==6)||0<=u&&u<=6&&(h==0||h==6)||2<=h&&h<=4&&2<=u&&u<=4?a[f+h][b+u]=!0:a[f+h][b+u]=!1)},y=function(){let f=0,b=0;for(let h=0;h<8;h+=1){c(!0,h);let u=ye.getLostPoint(g);(h==0||f>u)&&(f=u,b=h)}return b},_=function(){for(let f=8;f<i-8;f+=1)a[f][6]==null&&(a[f][6]=f%2==0);for(let f=8;f<i-8;f+=1)a[6][f]==null&&(a[6][f]=f%2==0)},x=function(){let f=ye.getPatternPosition(r);for(let b=0;b<f.length;b+=1)for(let h=0;h<f.length;h+=1){let u=f[b],m=f[h];if(a[u][m]==null)for(let $=-2;$<=2;$+=1)for(let T=-2;T<=2;T+=1)$==-2||$==2||T==-2||T==2||$==0&&T==0?a[u+$][m+T]=!0:a[u+$][m+T]=!1}},A=function(f){let b=ye.getBCHTypeNumber(r);for(let h=0;h<18;h+=1){let u=!f&&(b>>h&1)==1;a[Math.floor(h/3)][h%3+i-8-3]=u}for(let h=0;h<18;h+=1){let u=!f&&(b>>h&1)==1;a[h%3+i-8-3][Math.floor(h/3)]=u}},R=function(f,b){let h=o<<3|b,u=ye.getBCHTypeInfo(h);for(let m=0;m<15;m+=1){let $=!f&&(u>>m&1)==1;m<6?a[m][8]=$:m<8?a[m+1][8]=$:a[i-15+m][8]=$}for(let m=0;m<15;m+=1){let $=!f&&(u>>m&1)==1;m<8?a[8][i-m-1]=$:m<9?a[8][15-m-1+1]=$:a[8][15-m-1]=$}a[i-8][8]=!f},k=function(f,b){let h=-1,u=i-1,m=7,$=0,T=ye.getMaskFunction(b);for(let N=i-1;N>0;N-=2)for(N==6&&(N-=1);;){for(let U=0;U<2;U+=1)if(a[u][N-U]==null){let C=!1;$<f.length&&(C=(f[$]>>>m&1)==1),T(u,N-U)&&(C=!C),a[u][N-U]=C,m-=1,m==-1&&($+=1,m=7)}if(u+=h,u<0||i<=u){u-=h,h=-h;break}}},K=function(f,b){let h=0,u=0,m=0,$=new Array(b.length),T=new Array(b.length);for(let E=0;E<b.length;E+=1){let H=b[E].dataCount,F=b[E].totalCount-H;u=Math.max(u,H),m=Math.max(m,F),$[E]=new Array(H);for(let D=0;D<$[E].length;D+=1)$[E][D]=255&f.getBuffer()[D+h];h+=H;let w=ye.getErrorCorrectPolynomial(F),B=Ze($[E],w.getLength()-1).mod(w);T[E]=new Array(w.getLength()-1);for(let D=0;D<T[E].length;D+=1){let I=D+B.getLength()-T[E].length;T[E][D]=I>=0?B.getAt(I):0}}let N=0;for(let E=0;E<b.length;E+=1)N+=b[E].totalCount;let U=new Array(N),C=0;for(let E=0;E<u;E+=1)for(let H=0;H<b.length;H+=1)E<$[H].length&&(U[C]=$[H][E],C+=1);for(let E=0;E<m;E+=1)for(let H=0;H<b.length;H+=1)E<T[H].length&&(U[C]=T[H][E],C+=1);return U},V=function(f,b,h){let u=ws.getRSBlocks(f,b),m=$s();for(let T=0;T<h.length;T+=1){let N=h[T];m.put(N.getMode(),4),m.put(N.getLength(),ye.getLengthInBits(N.getMode(),f)),N.write(m)}let $=0;for(let T=0;T<u.length;T+=1)$+=u[T].dataCount;if(m.getLengthInBits()>$*8)throw"code length overflow. ("+m.getLengthInBits()+">"+$*8+")";for(m.getLengthInBits()+4<=$*8&&m.put(0,4);m.getLengthInBits()%8!=0;)m.putBit(!1);for(;!(m.getLengthInBits()>=$*8||(m.put(236,8),m.getLengthInBits()>=$*8));)m.put(17,8);return K(m,u)};g.addData=function(f,b){b=b||"Byte";let h=null;switch(b){case"Numeric":h=Oi(f);break;case"Alphanumeric":h=Ui(f);break;case"Byte":h=Hi(f);break;case"Kanji":h=zi(f);break;default:throw"mode:"+b}d.push(h),l=null},g.isDark=function(f,b){if(f<0||i<=f||b<0||i<=b)throw f+","+b;return a[f][b]},g.getModuleCount=function(){return i},g.make=function(){if(r<1){let f=1;for(;f<40;f++){let b=ws.getRSBlocks(f,o),h=$s();for(let m=0;m<d.length;m++){let $=d[m];h.put($.getMode(),4),h.put($.getLength(),ye.getLengthInBits($.getMode(),f)),$.write(h)}let u=0;for(let m=0;m<b.length;m++)u+=b[m].dataCount;if(h.getLengthInBits()<=u*8)break}r=f}c(!1,y())},g.createTableTag=function(f,b){f=f||2,b=typeof b>"u"?f*4:b;let h="";h+='<table style="',h+=" border-width: 0px; border-style: none;",h+=" border-collapse: collapse;",h+=" padding: 0px; margin: "+b+"px;",h+='">',h+="<tbody>";for(let u=0;u<g.getModuleCount();u+=1){h+="<tr>";for(let m=0;m<g.getModuleCount();m+=1)h+='<td style="',h+=" border-width: 0px; border-style: none;",h+=" border-collapse: collapse;",h+=" padding: 0px; margin: 0px;",h+=" width: "+f+"px;",h+=" height: "+f+"px;",h+=" background-color: ",h+=g.isDark(u,m)?"#000000":"#ffffff",h+=";",h+='"/>';h+="</tr>"}return h+="</tbody>",h+="</table>",h},g.createSvgTag=function(f,b,h,u){let m={};typeof arguments[0]=="object"&&(m=arguments[0],f=m.cellSize,b=m.margin,h=m.alt,u=m.title),f=f||2,b=typeof b>"u"?f*4:b,h=typeof h=="string"?{text:h}:h||{},h.text=h.text||null,h.id=h.text?h.id||"qrcode-description":null,u=typeof u=="string"?{text:u}:u||{},u.text=u.text||null,u.id=u.text?u.id||"qrcode-title":null;let $=g.getModuleCount()*f+b*2,T,N,U,C,E="",H;for(H="l"+f+",0 0,"+f+" -"+f+",0 0,-"+f+"z ",E+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',E+=m.scalable?"":' width="'+$+'px" height="'+$+'px"',E+=' viewBox="0 0 '+$+" "+$+'" ',E+=' preserveAspectRatio="xMinYMin meet"',E+=u.text||h.text?' role="img" aria-labelledby="'+j([u.id,h.id].join(" ").trim())+'"':"",E+=">",E+=u.text?'<title id="'+j(u.id)+'">'+j(u.text)+"</title>":"",E+=h.text?'<description id="'+j(h.id)+'">'+j(h.text)+"</description>":"",E+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',E+='<path d="',U=0;U<g.getModuleCount();U+=1)for(C=U*f+b,T=0;T<g.getModuleCount();T+=1)g.isDark(U,T)&&(N=T*f+b,E+="M"+N+","+C+H);return E+='" stroke="transparent" fill="black"/>',E+="</svg>",E},g.createDataURL=function(f,b){f=f||2,b=typeof b>"u"?f*4:b;let h=g.getModuleCount()*f+b*2,u=b,m=h-b;return Vi(h,h,function($,T){if(u<=$&&$<m&&u<=T&&T<m){let N=Math.floor(($-u)/f),U=Math.floor((T-u)/f);return g.isDark(U,N)?0:1}else return 1})},g.createImgTag=function(f,b,h){f=f||2,b=typeof b>"u"?f*4:b;let u=g.getModuleCount()*f+b*2,m="";return m+="<img",m+=' src="',m+=g.createDataURL(f,b),m+='"',m+=' width="',m+=u,m+='"',m+=' height="',m+=u,m+='"',h&&(m+=' alt="',m+=j(h),m+='"'),m+="/>",m};let j=function(f){let b="";for(let h=0;h<f.length;h+=1){let u=f.charAt(h);switch(u){case"<":b+="&lt;";break;case">":b+="&gt;";break;case"&":b+="&amp;";break;case'"':b+="&quot;";break;default:b+=u;break}}return b},se=function(f){f=typeof f>"u"?2:f;let h=g.getModuleCount()*1+f*2,u=f,m=h-f,$,T,N,U,C,E={"██":"█","█ ":"▀"," █":"▄","  ":" "},H={"██":"▀","█ ":"▀"," █":" ","  ":" "},F="";for($=0;$<h;$+=2){for(N=Math.floor(($-u)/1),U=Math.floor(($+1-u)/1),T=0;T<h;T+=1)C="█",u<=T&&T<m&&u<=$&&$<m&&g.isDark(N,Math.floor((T-u)/1))&&(C=" "),u<=T&&T<m&&u<=$+1&&$+1<m&&g.isDark(U,Math.floor((T-u)/1))?C+=" ":C+="█",F+=f<1&&$+1>=m?H[C]:E[C];F+=`
`}return h%2&&f>0?F.substring(0,F.length-h-1)+Array(h+1).join("▀"):F.substring(0,F.length-1)};return g.createASCII=function(f,b){if(f=f||1,f<2)return se(b);f-=1,b=typeof b>"u"?f*2:b;let h=g.getModuleCount()*f+b*2,u=b,m=h-b,$,T,N,U,C=Array(f+1).join("██"),E=Array(f+1).join("  "),H="",F="";for($=0;$<h;$+=1){for(N=Math.floor(($-u)/f),F="",T=0;T<h;T+=1)U=1,u<=T&&T<m&&u<=$&&$<m&&g.isDark(N,Math.floor((T-u)/f))&&(U=0),F+=U?C:E;for(N=0;N<f;N+=1)H+=F+`
`}return H.substring(0,H.length-1)},g.renderTo2dContext=function(f,b){b=b||2;let h=g.getModuleCount();for(let u=0;u<h;u++)for(let m=0;m<h;m++)f.fillStyle=g.isDark(u,m)?"black":"white",f.fillRect(m*b,u*b,b,b)},g};Oe.stringToBytes=function(s){let t=[];for(let e=0;e<s.length;e+=1){let n=s.charCodeAt(e);t.push(n&255)}return t};Oe.createStringToBytes=function(s,t){let e=(function(){let r=ji(s),o=function(){let l=r.read();if(l==-1)throw"eof";return l},a=0,i={};for(;;){let l=r.read();if(l==-1)break;let d=o(),g=o(),c=o(),p=String.fromCharCode(l<<8|d),y=g<<8|c;i[p]=y,a+=1}if(a!=t)throw a+" != "+t;return i})(),n=63;return function(r){let o=[];for(let a=0;a<r.length;a+=1){let i=r.charCodeAt(a);if(i<128)o.push(i);else{let l=e[r.charAt(a)];typeof l=="number"?(l&255)==l?o.push(l):(o.push(l>>>8),o.push(l&255)):o.push(n)}}return o}};var ee={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Xe={L:1,M:0,Q:3,H:2},ve={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},ye=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,e=7973,n=21522,r={},o=function(a){let i=0;for(;a!=0;)i+=1,a>>>=1;return i};return r.getBCHTypeInfo=function(a){let i=a<<10;for(;o(i)-o(t)>=0;)i^=t<<o(i)-o(t);return(a<<10|i)^n},r.getBCHTypeNumber=function(a){let i=a<<12;for(;o(i)-o(e)>=0;)i^=e<<o(i)-o(e);return a<<12|i},r.getPatternPosition=function(a){return s[a-1]},r.getMaskFunction=function(a){switch(a){case ve.PATTERN000:return function(i,l){return(i+l)%2==0};case ve.PATTERN001:return function(i,l){return i%2==0};case ve.PATTERN010:return function(i,l){return l%3==0};case ve.PATTERN011:return function(i,l){return(i+l)%3==0};case ve.PATTERN100:return function(i,l){return(Math.floor(i/2)+Math.floor(l/3))%2==0};case ve.PATTERN101:return function(i,l){return i*l%2+i*l%3==0};case ve.PATTERN110:return function(i,l){return(i*l%2+i*l%3)%2==0};case ve.PATTERN111:return function(i,l){return(i*l%3+(i+l)%2)%2==0};default:throw"bad maskPattern:"+a}},r.getErrorCorrectPolynomial=function(a){let i=Ze([1],0);for(let l=0;l<a;l+=1)i=i.multiply(Ze([1,we.gexp(l)],0));return i},r.getLengthInBits=function(a,i){if(1<=i&&i<10)switch(a){case ee.MODE_NUMBER:return 10;case ee.MODE_ALPHA_NUM:return 9;case ee.MODE_8BIT_BYTE:return 8;case ee.MODE_KANJI:return 8;default:throw"mode:"+a}else if(i<27)switch(a){case ee.MODE_NUMBER:return 12;case ee.MODE_ALPHA_NUM:return 11;case ee.MODE_8BIT_BYTE:return 16;case ee.MODE_KANJI:return 10;default:throw"mode:"+a}else if(i<41)switch(a){case ee.MODE_NUMBER:return 14;case ee.MODE_ALPHA_NUM:return 13;case ee.MODE_8BIT_BYTE:return 16;case ee.MODE_KANJI:return 12;default:throw"mode:"+a}else throw"type:"+i},r.getLostPoint=function(a){let i=a.getModuleCount(),l=0;for(let c=0;c<i;c+=1)for(let p=0;p<i;p+=1){let y=0,_=a.isDark(c,p);for(let x=-1;x<=1;x+=1)if(!(c+x<0||i<=c+x))for(let A=-1;A<=1;A+=1)p+A<0||i<=p+A||x==0&&A==0||_==a.isDark(c+x,p+A)&&(y+=1);y>5&&(l+=3+y-5)}for(let c=0;c<i-1;c+=1)for(let p=0;p<i-1;p+=1){let y=0;a.isDark(c,p)&&(y+=1),a.isDark(c+1,p)&&(y+=1),a.isDark(c,p+1)&&(y+=1),a.isDark(c+1,p+1)&&(y+=1),(y==0||y==4)&&(l+=3)}for(let c=0;c<i;c+=1)for(let p=0;p<i-6;p+=1)a.isDark(c,p)&&!a.isDark(c,p+1)&&a.isDark(c,p+2)&&a.isDark(c,p+3)&&a.isDark(c,p+4)&&!a.isDark(c,p+5)&&a.isDark(c,p+6)&&(l+=40);for(let c=0;c<i;c+=1)for(let p=0;p<i-6;p+=1)a.isDark(p,c)&&!a.isDark(p+1,c)&&a.isDark(p+2,c)&&a.isDark(p+3,c)&&a.isDark(p+4,c)&&!a.isDark(p+5,c)&&a.isDark(p+6,c)&&(l+=40);let d=0;for(let c=0;c<i;c+=1)for(let p=0;p<i;p+=1)a.isDark(p,c)&&(d+=1);let g=Math.abs(100*d/i/i-50)/5;return l+=g*10,l},r})(),we=(function(){let s=new Array(256),t=new Array(256);for(let n=0;n<8;n+=1)s[n]=1<<n;for(let n=8;n<256;n+=1)s[n]=s[n-4]^s[n-5]^s[n-6]^s[n-8];for(let n=0;n<255;n+=1)t[s[n]]=n;let e={};return e.glog=function(n){if(n<1)throw"glog("+n+")";return t[n]},e.gexp=function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return s[n]},e})(),Ze=function(s,t){if(typeof s.length>"u")throw s.length+"/"+t;let e=(function(){let r=0;for(;r<s.length&&s[r]==0;)r+=1;let o=new Array(s.length-r+t);for(let a=0;a<s.length-r;a+=1)o[a]=s[a+r];return o})(),n={};return n.getAt=function(r){return e[r]},n.getLength=function(){return e.length},n.multiply=function(r){let o=new Array(n.getLength()+r.getLength()-1);for(let a=0;a<n.getLength();a+=1)for(let i=0;i<r.getLength();i+=1)o[a+i]^=we.gexp(we.glog(n.getAt(a))+we.glog(r.getAt(i)));return Ze(o,0)},n.mod=function(r){if(n.getLength()-r.getLength()<0)return n;let o=we.glog(n.getAt(0))-we.glog(r.getAt(0)),a=new Array(n.getLength());for(let i=0;i<n.getLength();i+=1)a[i]=n.getAt(i);for(let i=0;i<r.getLength();i+=1)a[i]^=we.gexp(we.glog(r.getAt(i))+o);return Ze(a,0).mod(r)},n},ws=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(r,o){let a={};return a.totalCount=r,a.dataCount=o,a},e={},n=function(r,o){switch(o){case Xe.L:return s[(r-1)*4+0];case Xe.M:return s[(r-1)*4+1];case Xe.Q:return s[(r-1)*4+2];case Xe.H:return s[(r-1)*4+3];default:return}};return e.getRSBlocks=function(r,o){let a=n(r,o);if(typeof a>"u")throw"bad rs block @ typeNumber:"+r+"/errorCorrectionLevel:"+o;let i=a.length/3,l=[];for(let d=0;d<i;d+=1){let g=a[d*3+0],c=a[d*3+1],p=a[d*3+2];for(let y=0;y<g;y+=1)l.push(t(c,p))}return l},e})(),$s=function(){let s=[],t=0,e={};return e.getBuffer=function(){return s},e.getAt=function(n){let r=Math.floor(n/8);return(s[r]>>>7-n%8&1)==1},e.put=function(n,r){for(let o=0;o<r;o+=1)e.putBit((n>>>r-o-1&1)==1)},e.getLengthInBits=function(){return t},e.putBit=function(n){let r=Math.floor(t/8);s.length<=r&&s.push(0),n&&(s[r]|=128>>>t%8),t+=1},e},Oi=function(s){let t=ee.MODE_NUMBER,e=s,n={};n.getMode=function(){return t},n.getLength=function(a){return e.length},n.write=function(a){let i=e,l=0;for(;l+2<i.length;)a.put(r(i.substring(l,l+3)),10),l+=3;l<i.length&&(i.length-l==1?a.put(r(i.substring(l,l+1)),4):i.length-l==2&&a.put(r(i.substring(l,l+2)),7))};let r=function(a){let i=0;for(let l=0;l<a.length;l+=1)i=i*10+o(a.charAt(l));return i},o=function(a){if("0"<=a&&a<="9")return a.charCodeAt(0)-48;throw"illegal char :"+a};return n},Ui=function(s){let t=ee.MODE_ALPHA_NUM,e=s,n={};n.getMode=function(){return t},n.getLength=function(o){return e.length},n.write=function(o){let a=e,i=0;for(;i+1<a.length;)o.put(r(a.charAt(i))*45+r(a.charAt(i+1)),11),i+=2;i<a.length&&o.put(r(a.charAt(i)),6)};let r=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;if("A"<=o&&o<="Z")return o.charCodeAt(0)-65+10;switch(o){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+o}};return n},Hi=function(s){let t=ee.MODE_8BIT_BYTE,e=s,n=Oe.stringToBytes(s),r={};return r.getMode=function(){return t},r.getLength=function(o){return n.length},r.write=function(o){for(let a=0;a<n.length;a+=1)o.put(n[a],8)},r},zi=function(s){let t=ee.MODE_KANJI,e=s,n=Oe.stringToBytes;(function(a,i){let l=n(a);if(l.length!=2||(l[0]<<8|l[1])!=i)throw"sjis not supported."})("友",38726);let r=n(s),o={};return o.getMode=function(){return t},o.getLength=function(a){return~~(r.length/2)},o.write=function(a){let i=r,l=0;for(;l+1<i.length;){let d=(255&i[l])<<8|255&i[l+1];if(33088<=d&&d<=40956)d-=33088;else if(57408<=d&&d<=60351)d-=49472;else throw"illegal char at "+(l+1)+"/"+d;d=(d>>>8&255)*192+(d&255),a.put(d,13),l+=2}if(l<i.length)throw"illegal char at "+(l+1)},o},ks=function(){let s=[],t={};return t.writeByte=function(e){s.push(e&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,r){n=n||0,r=r||e.length;for(let o=0;o<r;o+=1)t.writeByte(e[o+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return s},t.toString=function(){let e="";e+="[";for(let n=0;n<s.length;n+=1)n>0&&(e+=","),e+=s[n];return e+="]",e},t},qi=function(){let s=0,t=0,e=0,n="",r={},o=function(i){n+=String.fromCharCode(a(i&63))},a=function(i){if(i<0)throw"n:"+i;if(i<26)return 65+i;if(i<52)return 97+(i-26);if(i<62)return 48+(i-52);if(i==62)return 43;if(i==63)return 47;throw"n:"+i};return r.writeByte=function(i){for(s=s<<8|i&255,t+=8,e+=1;t>=6;)o(s>>>t-6),t-=6},r.flush=function(){if(t>0&&(o(s<<6-t),s=0,t=0),e%3!=0){let i=3-e%3;for(let l=0;l<i;l+=1)n+="="}},r.toString=function(){return n},r},ji=function(s){let t=s,e=0,n=0,r=0,o={};o.read=function(){for(;r<8;){if(e>=t.length){if(r==0)return-1;throw"unexpected end of file./"+r}let l=t.charAt(e);if(e+=1,l=="=")return r=0,-1;if(l.match(/^\s$/))continue;n=n<<6|a(l.charCodeAt(0)),r+=6}let i=n>>>r-8&255;return r-=8,i};let a=function(i){if(65<=i&&i<=90)return i-65;if(97<=i&&i<=122)return i-97+26;if(48<=i&&i<=57)return i-48+52;if(i==43)return 62;if(i==47)return 63;throw"c:"+i};return o},Ki=function(s,t){let e=s,n=t,r=new Array(s*t),o={};o.setPixel=function(d,g,c){r[g*e+d]=c},o.write=function(d){d.writeString("GIF87a"),d.writeShort(e),d.writeShort(n),d.writeByte(128),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(255),d.writeByte(255),d.writeByte(255),d.writeString(","),d.writeShort(0),d.writeShort(0),d.writeShort(e),d.writeShort(n),d.writeByte(0);let g=2,c=i(g);d.writeByte(g);let p=0;for(;c.length-p>255;)d.writeByte(255),d.writeBytes(c,p,255),p+=255;d.writeByte(c.length-p),d.writeBytes(c,p,c.length-p),d.writeByte(0),d.writeString(";")};let a=function(d){let g=d,c=0,p=0,y={};return y.write=function(_,x){if(_>>>x)throw"length over";for(;c+x>=8;)g.writeByte(255&(_<<c|p)),x-=8-c,_>>>=8-c,p=0,c=0;p=_<<c|p,c=c+x},y.flush=function(){c>0&&g.writeByte(p)},y},i=function(d){let g=1<<d,c=(1<<d)+1,p=d+1,y=l();for(let k=0;k<g;k+=1)y.add(String.fromCharCode(k));y.add(String.fromCharCode(g)),y.add(String.fromCharCode(c));let _=ks(),x=a(_);x.write(g,p);let A=0,R=String.fromCharCode(r[A]);for(A+=1;A<r.length;){let k=String.fromCharCode(r[A]);A+=1,y.contains(R+k)?R=R+k:(x.write(y.indexOf(R),p),y.size()<4095&&(y.size()==1<<p&&(p+=1),y.add(R+k)),R=k)}return x.write(y.indexOf(R),p),x.write(c,p),x.flush(),_.toByteArray()},l=function(){let d={},g=0,c={};return c.add=function(p){if(c.contains(p))throw"dup key:"+p;d[p]=g,g+=1},c.size=function(){return g},c.indexOf=function(p){return d[p]},c.contains=function(p){return typeof d[p]<"u"},c};return o},Vi=function(s,t,e){let n=Ki(s,t);for(let i=0;i<t;i+=1)for(let l=0;l<s;l+=1)n.setPixel(l,i,e(l,i));let r=ks();n.write(r);let o=qi(),a=r.toByteArray();for(let i=0;i<a.length;i+=1)o.writeByte(a[i]);return o.flush(),"data:image/gif;base64,"+o},_s=Oe,mo=Oe.stringToBytes;function As(s){let t=_s(0,"M");t.addData(s),t.make();let e=t.getModuleCount(),n="";for(let r=0;r<e;r++)for(let o=0;o<e;o++)t.isDark(r,o)&&(n+=`M${o} ${r}h1v1h-1z`);return{size:e,d:n}}var Wi=1e4,et=class extends ie{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,n){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,n))}async newCode(){try{let e=await vs();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof De&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),Wi)}}async poll(e){let n=this.secret;if(n)try{let r=await ys(n,location.origin);if(!this.running||n!==this.secret)return;if(this.problem=null,r.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:r.auth}));return}if(r.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return M;let{size:e,d:n}=As(xs(location.origin,this.code));return v`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${ge`<path d=${n} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return v`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?bs(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Jt}?${Xt}</span> and type the code.
          </li>
          <li>You’ll need to be a Home Assistant admin. The screen signs in as you.</li>
        </ol>
      </div>
      <div class="qr">${this.qr()}</div>
      <div class="foot">
        ${this.problem?v`<span class="problem" role="alert">${this.problem}</span>`:v`<span>${this.code?`A new code appears in ${e} minute${e===1?"":"s"}.`:"Getting a code…"}</span>`}
        <button type="button" class="link" @click=${()=>this.dispatchEvent(new CustomEvent("password"))}>
          Sign in with a password instead
        </button>
      </div>
    </div>`}};et.styles=_e`
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
  `,et.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",et);var Zt="hassTokens";function Ts(){try{let s=localStorage.getItem(Zt);return s?JSON.parse(s):null}catch{return null}}function en(s){try{s?localStorage.setItem(Zt,JSON.stringify(s)):localStorage.removeItem(Zt)}catch{}}function Fi(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}function Yi(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(t=>{let e=n=>{s.stop(),s.hidden=!0,t(n)};s.addEventListener("paired",n=>e(n.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function Gi(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let t=location.search.includes("auth_callback");if(!t&&!Ts()){let e=await Yi();e&&en(e)}try{let e=await vn({hassUrl:location.origin,loadTokens:async()=>Ts(),saveTokens:en});t&&history.replaceState(null,"",location.pathname+Gt(location.search));let n=await yn({auth:e});s.backend=new ot(n),n.addEventListener("reconnect-error",(r,o)=>{o===2&&Es()})}catch(e){if(e===2){Es();return}Fi(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function Es(){en(null),location.replace(location.pathname+Gt(location.search))}var Ms=document.querySelector("mydashlight-keyboard");Ms&&_t(location.search).keyboard!==!1&&ms(Ms);Gi();
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
