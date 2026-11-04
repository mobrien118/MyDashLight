function Vt(s){return{type:"auth",access_token:s}}function Wt(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Kt(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function gt(s){return{type:"unsubscribe_events",subscription:s}}function Ft(){return{type:"ping"}}function Yt(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function Jt(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let i=e[n].split("="),r=decodeURIComponent(i[0]),a=i.length>1?decodeURIComponent(i[1]):void 0;t[r]=a}return t}var Xt=(s,t,e,n)=>{let[i,r,a]=s.split(".",3);return Number(i)>t||Number(i)===t&&(n===void 0?Number(r)>=e:Number(r)>e)||n!==void 0&&Number(i)===t&&Number(r)===e&&Number(a)>=n};var qe=!1,Qn="auth_required",Zn="auth_invalid",es="auth_ok";function Zt(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;qe&&console.log("[Auth phase] Initializing",n);function i(r,a,o){qe&&console.log("[Auth Phase] New connection",n);let l=new WebSocket(n),c=!1,f=()=>{if(l.removeEventListener("close",f),c){o(2);return}if(r===0){o(1);return}let g=r===-1?-1:r-1;setTimeout(()=>i(g,a,o),1e3)},h=async g=>{try{t.expired&&await(e||t.refreshAccessToken()),l.send(JSON.stringify(Vt(t.accessToken)))}catch(x){c=x===2,l.close()}},m=async g=>{let x=JSON.parse(g.data);switch(qe&&console.log("[Auth phase] Received",x),x.type){case Zn:c=!0,l.close();break;case es:l.removeEventListener("open",h),l.removeEventListener("message",m),l.removeEventListener("close",f),l.removeEventListener("error",f),l.haVersion=x.ha_version,Xt(l.haVersion,2022,9)&&l.send(JSON.stringify(Wt())),a(l);break;default:qe&&x.type!==Qn&&console.warn("[Auth phase] Unhandled message",x)}};l.addEventListener("open",h),l.addEventListener("message",m),l.addEventListener("close",f),l.addEventListener("error",f)}return new Promise((r,a)=>i(s.setupRetry,r,a))}var Me=!1,je=class{constructor(t,e){this._handleMessage=n=>{let i=JSON.parse(n.data);Array.isArray(i)||(i=[i]),i.forEach(r=>{Me&&console.log("Received",r);let a=this.commands.get(r.id);switch(r.type){case"event":a?a.callback(r.event):(console.warn(`Received event for unknown subscription ${r.id}. Unsubscribing.`),this.sendMessagePromise(gt(r.id)).catch(o=>{Me&&console.warn(` Error unsubsribing from unknown subscription ${r.id}`,o)}));break;case"result":a&&(r.success?(a.resolve(r.result),"subscribe"in a||this.commands.delete(r.id)):(a.reject(r.error),this.commands.delete(r.id)));break;case"pong":a?(a.resolve(),this.commands.delete(r.id)):console.warn(`Received unknown pong response ${r.id}`);break;default:Me&&console.warn("Unhandled message",r)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(a=>{"subscribe"in a||a.reject(Yt(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),r=a=>{setTimeout(async()=>{if(!this.closeRequested){Me&&console.log("Trying to reconnect");try{let o=await i.createSocket(i);this._setSocket(o)}catch(o){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let c of l)c.reject&&c.reject(3)}o===2?this.fireEvent("reconnect-error",o):r(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),r(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(r=>{i.unsubscribe=r,i.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let i of n)i.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let i=n.indexOf(e);i!==-1&&n.splice(i,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,Kt(e))}ping(){return this.sendMessagePromise(Ft())}sendMessage(t,e){if(!this.connected)throw 3;if(Me&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(r){n(r)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:n}),this.sendMessage(t,i)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((r,a)=>{this._queuedMessages.push({resolve:r,reject:a})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((r,a)=>{let o=this._genCmdId();i={resolve:r,reject:a,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(gt(o)),this.commands.delete(o)}},this.commands.set(o,i);try{this.sendMessage(e,o)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var ts=()=>`${location.protocol}//${location.host}/`,ns=s=>s*1e3+Date.now();function ss(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function is(s,t,e,n){let i=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(i+=`&client_id=${encodeURIComponent(t)}`),n&&(i+=`&state=${encodeURIComponent(n)}`),i}function rs(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=is(s,t,e,n)}async function nn(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let o=document.createElement("a");if(o.href=s,o.protocol==="http:"&&o.hostname!=="localhost")throw 5}let i=new FormData;t!==null&&i.append("client_id",t),Object.keys(e).forEach(o=>{i.append(o,e[o])});let r=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!r.ok)throw r.status===400||r.status===403?2:new Error("Unable to fetch tokens");let a=await r.json();return a.hassUrl=s,a.clientId=t,a.expires=ns(a.expires_in),a}function tn(s,t,e){return nn(s,t,{code:e,grant_type:"authorization_code"})}function os(s){return btoa(JSON.stringify(s))}function as(s){return JSON.parse(atob(s))}var ft=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await nn(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function sn(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:ts(),i=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await tn(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let r=Jt(location.search.substr(1));if("auth_callback"in r){let a=as(r.state);if(i&&(a.hassUrl!==e||a.clientId!==n))throw 6;t=await tn(a.hassUrl,a.clientId,r.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new ft(t,s.saveTokens);if(e===void 0)throw 4;return rs(e,n,s.redirectUrl||ss(),os({hassUrl:e,clientId:n})),new Promise(()=>{})}async function rn(s){let t=Object.assign({setupRetry:0,createSocket:Zt},s),e=await t.createSocket(t);return new je(e,t)}function k(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function Ce(s){let t=Math.floor(Math.round(s)/60)%24;return`${k(s)} ${t<12?"AM":"PM"}`}function on(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Ne(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function an(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var ls=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),ds=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),cs=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Ve(s){return new Date(`${s}T12:00:00Z`)}function ke(s){let t=Ve(s);return`${ls.format(t)}, ${cs.format(t)}`}function re(s){return ds.format(Ve(s))}function We(s,t){return Math.round((Ve(t).getTime()-Ve(s).getTime())/864e5)}function Re(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Re("UTC",t)}let n=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Ke(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let i=Re(e,s),r=Re(e,t).date;return i.date===r?`at ${Ce(i.minutes)}`:`on ${re(i.date)} at ${Ce(i.minutes)}`}var Y=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},mt="mydashlight",ps=7,hs=3e4;function ln(s){if(s instanceof Y)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new Y(String(t.code??"error"),t.message)}return typeof s=="number"?new Y("connection_lost","Lost the connection to Home Assistant."):new Y("error",String(s))}var Fe=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new Y("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},hs),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new Y("not_running","MyDashLight isn’t running right now."))},{type:`${mt}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:mt,service:"get_plan",service_data:{days:ps},return_response:!0});this.emit(t.response)}catch(t){this.fail(ln(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:mt,service:t,service_data:e})}catch(n){throw ln(n)}this.pushing||await this.refresh()}setRide(t,e,n,i){return this.call("set_ride",{event:t,side:e,driver:n,scope:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:an(e),scope:n})}setTakeAlong(t,e,n){return this.call("set_take_along",{event:t,kids:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}};var Ye=globalThis,Ge=Ye.ShadowRoot&&(Ye.ShadyCSS===void 0||Ye.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,bt=Symbol(),dn=new WeakMap,De=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==bt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Ge&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=dn.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&dn.set(e,t))}return t}toString(){return this.cssText}},cn=s=>new De(typeof s=="string"?s:s+"",void 0,bt),xt=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,i,r)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new De(e,s,bt)},pn=(s,t)=>{if(Ge)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),i=Ye.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=e.cssText,s.appendChild(n)}},vt=Ge?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return cn(e)})(s):s;var{is:us,defineProperty:gs,getOwnPropertyDescriptor:fs,getOwnPropertyNames:ms,getOwnPropertySymbols:bs,getPrototypeOf:xs}=Object,Je=globalThis,hn=Je.trustedTypes,vs=hn?hn.emptyScript:"",ys=Je.reactiveElementPolyfillSupport,ze=(s,t)=>s,yt={toAttribute(s,t){switch(t){case Boolean:s=s?vs:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},gn=(s,t)=>!us(s,t),un={attribute:!0,type:String,converter:yt,reflect:!1,useDefault:!1,hasChanged:gn};Symbol.metadata??=Symbol("metadata"),Je.litPropertyMetadata??=new WeakMap;var ee=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=un){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(t,n,e);i!==void 0&&gs(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){let{get:i,set:r}=fs(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);r?.call(this,a),this.requestUpdate(t,o,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??un}static _$Ei(){if(this.hasOwnProperty(ze("elementProperties")))return;let t=xs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ze("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ze("properties"))){let e=this.properties,n=[...ms(e),...bs(e)];for(let i of n)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,i]of e)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let i=this._$Eu(e,n);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)e.unshift(vt(i))}else t!==void 0&&e.push(vt(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pn(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){let r=(n.converter?.toAttribute!==void 0?n.converter:yt).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=n.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:yt;this._$Em=i;let o=a.fromAttribute(e,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,n,i=!1,r){if(t!==void 0){let a=this.constructor;if(i===!1&&(r=this[t]),n??=a.getPropertyOptions(t),!((n.hasChanged??gn)(r,e)||n.useDefault&&n.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:r},a){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),r!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,r]of n){let{wrapped:a}=r,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};ee.elementStyles=[],ee.shadowRootOptions={mode:"open"},ee[ze("elementProperties")]=new Map,ee[ze("finalized")]=new Map,ys?.({ReactiveElement:ee}),(Je.reactiveElementVersions??=[]).push("2.1.2");var $t=globalThis,fn=s=>s,Xe=$t.trustedTypes,mn=Xe?Xe.createPolicy("lit-html",{createHTML:s=>s}):void 0,kt="$lit$",te=`lit$${Math.random().toFixed(9).slice(2)}$`,_t="?"+te,ws=`<${_t}>`,fe=document,Le=()=>fe.createComment(""),Ue=s=>s===null||typeof s!="object"&&typeof s!="function",At=Array.isArray,$n=s=>At(s)||typeof s?.[Symbol.iterator]=="function",wt=`[ 	
\f\r]`,Ie=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bn=/-->/g,xn=/>/g,ue=RegExp(`>|${wt}(?:([^\\s"'>=/]+)(${wt}*=${wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vn=/'/g,yn=/"/g,kn=/^(?:script|style|textarea|title)$/i,Et=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=Et(1),Ae=Et(2),Ci=Et(3),ne=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),wn=new WeakMap,ge=fe.createTreeWalker(fe,129);function _n(s,t){if(!At(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return mn!==void 0?mn.createHTML(t):t}var An=(s,t)=>{let e=s.length-1,n=[],i,r=t===2?"<svg>":t===3?"<math>":"",a=Ie;for(let o=0;o<e;o++){let l=s[o],c,f,h=-1,m=0;for(;m<l.length&&(a.lastIndex=m,f=a.exec(l),f!==null);)m=a.lastIndex,a===Ie?f[1]==="!--"?a=bn:f[1]!==void 0?a=xn:f[2]!==void 0?(kn.test(f[2])&&(i=RegExp("</"+f[2],"g")),a=ue):f[3]!==void 0&&(a=ue):a===ue?f[0]===">"?(a=i??Ie,h=-1):f[1]===void 0?h=-2:(h=a.lastIndex-f[2].length,c=f[1],a=f[3]===void 0?ue:f[3]==='"'?yn:vn):a===yn||a===vn?a=ue:a===bn||a===xn?a=Ie:(a=ue,i=void 0);let g=a===ue&&s[o+1].startsWith("/>")?" ":"";r+=a===Ie?l+ws:h>=0?(n.push(c),l.slice(0,h)+kt+l.slice(h)+te+g):l+te+(h===-2?o:g)}return[_n(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},Oe=class s{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let r=0,a=0,o=t.length-1,l=this.parts,[c,f]=An(t,e);if(this.el=s.createElement(c,n),ge.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=ge.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(kt)){let m=f[a++],g=i.getAttribute(h).split(te),x=/([.?@])?(.*)/.exec(m);l.push({type:1,index:r,name:x[2],strings:g,ctor:x[1]==="."?Ze:x[1]==="?"?et:x[1]==="@"?tt:be}),i.removeAttribute(h)}else h.startsWith(te)&&(l.push({type:6,index:r}),i.removeAttribute(h));if(kn.test(i.tagName)){let h=i.textContent.split(te),m=h.length-1;if(m>0){i.textContent=Xe?Xe.emptyScript:"";for(let g=0;g<m;g++)i.append(h[g],Le()),ge.nextNode(),l.push({type:2,index:++r});i.append(h[m],Le())}}}else if(i.nodeType===8)if(i.data===_t)l.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(te,h+1))!==-1;)l.push({type:7,index:r}),h+=te.length-1}r++}}static createElement(t,e){let n=fe.createElement("template");return n.innerHTML=t,n}};function me(s,t,e=s,n){if(t===ne)return t;let i=n!==void 0?e._$Co?.[n]:e._$Cl,r=Ue(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=i:e._$Cl=i),i!==void 0&&(t=me(s,i._$AS(s,t.values),i,n)),t}var Qe=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??fe).importNode(e,!0);ge.currentNode=i;let r=ge.nextNode(),a=0,o=0,l=n[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new _e(r,r.nextSibling,this,t):l.type===1?c=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(c=new nt(r,this,t)),this._$AV.push(c),l=n[++o]}a!==l?.index&&(r=ge.nextNode(),a++)}return ge.currentNode=fe,i}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},_e=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=me(this,t,e),Ue(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==ne&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):$n(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&Ue(this._$AH)?this._$AA.nextSibling.data=t:this.T(fe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Oe.createElement(_n(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new Qe(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(t){let e=wn.get(t.strings);return e===void 0&&wn.set(t.strings,e=new Oe(t)),e}k(t){At(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,i=0;for(let r of t)i===e.length?e.push(n=new s(this.O(Le()),this.O(Le()),this,this.options)):n=e[i],n._$AI(r),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=fn(t).nextSibling;fn(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},be=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,r){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=v}_$AI(t,e=this,n,i){let r=this.strings,a=!1;if(r===void 0)t=me(this,t,e,0),a=!Ue(t)||t!==this._$AH&&t!==ne,a&&(this._$AH=t);else{let o=t,l,c;for(t=r[0],l=0;l<r.length-1;l++)c=me(this,o[n+l],e,l),c===ne&&(c=this._$AH[l]),a||=!Ue(c)||c!==this._$AH[l],c===v?t=v:t!==v&&(t+=(c??"")+r[l+1]),this._$AH[l]=c}a&&!i&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ze=class extends be{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}},et=class extends be{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}},tt=class extends be{constructor(t,e,n,i,r){super(t,e,n,i,r),this.type=5}_$AI(t,e=this){if((t=me(this,t,e,0)??v)===ne)return;let n=this._$AH,i=t===v&&n!==v||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==v&&(n===v||i);i&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},nt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){me(this,t)}},En={M:kt,P:te,A:_t,C:1,L:An,R:Qe,D:$n,V:me,I:_e,H:be,N:et,U:tt,B:Ze,F:nt},$s=$t.litHtmlPolyfillSupport;$s?.(Oe,_e),($t.litHtmlVersions??=[]).push("3.3.3");var Tn=(s,t,e)=>{let n=e?.renderBefore??t,i=n._$litPart$;if(i===void 0){let r=e?.renderBefore??null;n._$litPart$=i=new _e(t.insertBefore(Le(),r),r,void 0,e??{})}return i._$AI(s),i};var Tt=globalThis,oe=class extends ee{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Tn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ne}};oe._$litElement$=!0,oe.finalized=!0,Tt.litElementHydrateSupport?.({LitElement:oe});var ks=Tt.litElementPolyfillSupport;ks?.({LitElement:oe});(Tt.litElementVersions??=[]).push("4.2.2");var Sn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Pn=s=>(...t)=>({_$litDirective$:s,values:t}),st=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:_s}=En,Mn=s=>s;var Cn=()=>document.createComment(""),Ee=(s,t,e)=>{let n=s._$AA.parentNode,i=t===void 0?s._$AB:t._$AA;if(e===void 0){let r=n.insertBefore(Cn(),i),a=n.insertBefore(Cn(),i);e=new _s(r,a,s,s.options)}else{let r=e._$AB.nextSibling,a=e._$AM,o=a!==s;if(o){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(r!==i||o){let l=e._$AA;for(;l!==r;){let c=Mn(l).nextSibling;Mn(n).insertBefore(l,i),l=c}}}return e},ae=(s,t,e=s)=>(s._$AI(t,e),s),As={},Rn=(s,t=As)=>s._$AH=t,Nn=s=>s._$AH,it=s=>{s._$AR(),s._$AA.remove()};var Dn=(s,t,e)=>{let n=new Map;for(let i=t;i<=e;i++)n.set(s[i],i);return n},J=Pn(class extends st{constructor(s){if(super(s),s.type!==Sn.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let i=[],r=[],a=0;for(let o of s)i[a]=n?n(o,a):a,r[a]=e(o,a),a++;return{values:r,keys:i}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let i=Nn(s),{values:r,keys:a}=this.dt(t,e,n);if(!Array.isArray(i))return this.ut=a,r;let o=this.ut??=[],l=[],c,f,h=0,m=i.length-1,g=0,x=r.length-1;for(;h<=m&&g<=x;)if(i[h]===null)h++;else if(i[m]===null)m--;else if(o[h]===a[g])l[g]=ae(i[h],r[g]),h++,g++;else if(o[m]===a[x])l[x]=ae(i[m],r[x]),m--,x--;else if(o[h]===a[x])l[x]=ae(i[h],r[x]),Ee(s,l[x+1],i[h]),h++,x--;else if(o[m]===a[g])l[g]=ae(i[m],r[g]),Ee(s,i[h],i[m]),m--,g++;else if(c===void 0&&(c=Dn(a,g,x),f=Dn(o,h,m)),c.has(o[h]))if(c.has(o[m])){let u=f.get(a[g]),y=u!==void 0?i[u]:null;if(y===null){let S=Ee(s,i[h]);ae(S,r[g]),l[g]=S}else l[g]=ae(y,r[g]),Ee(s,i[h],y),i[u]=null;g++}else it(i[m]),m--;else it(i[h]),h++;for(;g<=x;){let u=Ee(s,l[x+1]);ae(u,r[g]),l[g++]=u}for(;h<=m;){let u=i[h++];u!==null&&it(u)}return this.ut=a,Rn(s,l),ne}});var rt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function G(s){return rt[(s%rt.length+rt.length)%rt.length]}var zn="#23272E",In="35,39,46";var Es=3,ct=36,St=12,Ts=8,Pt=60,Mt=10,at=30,Ct=10,Ss=150,Ps=200,dt=1.4;function Nt(s,t){let e=Math.max(Ss,Ps/dt);return Math.ceil(Pt+Math.max(0,s-1)*Mt+at+Math.max(0,t-1)*Ct+e*(s+dt*t))}function ve(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function le(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ye(s){return new Map(ve(s).map((t,e)=>[t,G(e)]))}function F(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function de(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function Dt(s,t){return t==="none"?"Not needed":le(s).includes(t)?de(s,t):t}function Ms(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function lt(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function ot(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(lt(t,n.from)),e.push(lt(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(lt(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Cs(s){let t=s.map(a=>({...a,col:0,cols:1})).sort((a,o)=>a.s-o.s||o.en-a.en),e=[],n=[],i=-1/0,r=()=>{for(let a of e)a.cols=n.length;e=[],n=[]};for(let a of t){a.s>=i&&(r(),i=-1/0);let o=n.findIndex(l=>l<=a.s);o<0?(o=n.length,n.push(a.en)):n[o]=a.en,a.col=o,e.push(a),i=Math.max(i,a.en)}return r(),t}function Rs(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.t)return i.t===n.t?n.y:Math.round(n.y+(t-n.t)/(i.t-n.t)*(i.y-n.y))}return s[s.length-1].y}function Ns(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.y)return i.y===n.y?n.t:n.t+(t-n.y)/(i.y-n.y)*(i.t-n.t)}return s[s.length-1].t}function On(s,t){return Rs(s.anchors,t)}function Hn(s,t){return Ns(s.anchors,t)}function Ds(s,t){let e=ve(s),n=le(s),i=Math.max(t,Nt(e.length,n.length)),a=(i-Pt-Math.max(0,e.length-1)*Mt-at-Math.max(0,n.length-1)*Ct)/(e.length+dt*n.length||1),o=Math.floor(a),l=Math.floor(a*dt),c=new Map;for(let x of s.days)for(let u of x.events){let y=c.get(u.kid)??[];y.some(S=>S.event_id===u.event_id&&S.calendar_id===u.calendar_id)||y.push(u),c.set(u.kid,y)}let f=ye(s),h=[],m=Pt;e.forEach((x,u)=>{let y=c.get(x)??[],S=s.days.some(b=>b.events.some(z=>z.kid===x&&(z.sides.includes("drop")&&z.drop===""||z.sides.includes("pick")&&z.pick==="")));h.push({id:x,kind:"kid",x:m,w:o,name:F(s,x),dot:f.get(x).color,rgb:f.get(x).rgb,sub:`${S?"Needs a ride · ":""}${y.length} this week`,subWarn:S}),m+=o+(u<e.length-1?Mt:0)});let g=m+at/2;return m+=at,n.forEach((x,u)=>{let y=0,S=0;for(let b of s.days){let z=b.drivers[x];z&&(y+=z.outings.length,S+=z.drive??0)}h.push({id:x,kind:"driver",x:m,w:l,name:de(s,x),dot:zn,rgb:In,sub:`${y} ${y===1?"trip":"trips"} this week · ${Ne(S)} driving`,subWarn:!1}),m+=l+(u<n.length-1?Ct:0)}),{columns:h,sepX:g,width:i}}function zs(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(t.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let a=i.slice(r[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Ln(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${k(s.start)}`:e||!t?`${s.title} until ${k(s.end)}`:`${s.title} ${k(s.start)}–${k(s.end)}`}function zt(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length}function Is(s,t){let e=We(t,s);return e===0?"Today":e===1?"Tomorrow":""}function q(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Rt(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),i=1,r=0;for(let a of s.split(/\s+/).filter(Boolean)){let o=a.length;for(r===0?r=o:r+1+o<=n?r+=1+o:(i++,r=o);r>n;)i++,r-=n}return i}var Bn=25,qn=15,It=3;function Un(s){return Math.max(0,Math.min(It,Math.floor((s-Bn)/qn)))}function Ls(s,t){let e=Math.min(It,Rt(s,t-19,6.6));return Bn+e*qn+2}function Us(s,t){let e=t-23,n=`${k(s.start)}–${k(s.end)}`+(s.arrive_by!=null?` · arrive ${k(s.arrive_by)}`:""),i=33+Rt(n,e,6.6)*16;for(let r of[s.lines.drop,s.lines.pick])r&&(i+=2+Rt(r.text,e,7)*16);return i+4}function jn(s,t,e,n){let i=t==="compact",{columns:r,sepX:a,width:o}=Ds(s,e),l=new Map(r.map(b=>[b.id,b])),c=ve(s),f=le(s),h=[...c,...f],m=ye(s),g=Ms(s),x=b=>F(s,b),u=b=>de(s,b),y={mode:t,width:o,height:0,columns:r,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},S=0;return s.days.forEach((b,z)=>{let I=z*1440,W=new Map(b.events.map(d=>[d.id,d])),K=d=>d&&W.has(d)?{day:b.date,event:d}:null,we=zt(b),$e=b.events.length,Be=Is(b.date,n.date);y.dayHeads.push({date:b.date,y:S,label:ke(b.date),tag:Be,sub:($e?`${$e} ${$e===1?"activity":"activities"}`:"Nothing scheduled")+(we?` · ${we} to sort out`:""),warn:we>0}),y.anchors.push({t:I,y:S});let T=S+ct+St,se=f.flatMap(d=>b.drivers[d]?.outings??[]);if(!$e&&!se.length){y.empties.push({key:b.date,y:T,text:"Nothing planned"}),S=T+40,y.anchors.push({t:I+1439,y:S});return}let N=(d,E,_,P,A,C,$)=>{let O=m.get(d.kid)??G(0),j=d.lines;return{key:`${b.date}|card|${d.id}`,x:E,y:_,w:P,h:A,target:{day:b.date,event:d.id},event:d,color:O,kidName:x(d.kid),clash:C,stayed:d.stay&&f.includes(d.drop),title:zs(d.title,x(d.kid)),time:`${k(d.start)}–${k(d.end)}`+(d.arrive_by!=null?` · arrive ${k(d.arrive_by)}`:""),drop:j.drop,pick:j.pick,showDrop:!!j.drop&&($||A>=56),showPick:!!j.pick&&($||A>=74),wrap:$,aria:`${x(d.kid)}, ${d.title} ${k(d.start)} to ${k(d.end)}. `+[j.drop,j.pick].filter(Z=>!!Z).map(Z=>Z.text).join(". ")}},X=d=>{let E=b.rides[d];return E?(b.drivers[E.driver]?.segments??[]).filter(P=>P.type!=="home"&&P.kids.includes(E.kid)&&q(P.start)>=q(E.start)&&q(P.end)<=q(E.end)):[]},Te=d=>{let E=b.rides[d];if(!E)return null;let _=E.serves.find(P=>W.get(P)?.kid===E.kid);return K(_??E.serves[0])},ce=new Map;for(let d of b.issues)d.level!=="problem"||!d.event||(d.kind==="late"&&ce.set(d.event,`${Math.round(q(d.minutes))} min late`),d.kind==="waiting"&&ce.set(`${d.event}|pick`,`Waits ${Math.round(q(d.minutes))} min`));if(!i){let d=1/0,E=-1/0;for(let $ of b.events)d=Math.min(d,$.start-20,$.arrive_by!=null?$.arrive_by-10:1/0),E=Math.max(E,$.end+20);for(let $ of se)$.start!=null&&(d=Math.min(d,$.start)),$.end!=null&&(E=Math.max(E,$.end));b.date===n.date&&Number.isFinite(d)&&n.minutes>d-60&&n.minutes<E&&(d=Math.min(d,n.minutes-15));let _=Number.isFinite(d)?Math.floor((d-5)/30)*30:900,P=Number.isFinite(E)?Math.ceil((E+5)/30)*30:960,A=$=>Math.round(T+(Math.max(_,Math.min(P,$))-_)*Es);y.anchors.push({t:I+_,y:A(_)},{t:I+P,y:A(P)});for(let $ of c){let O=l.get($),j=m.get($),Z=(b.kids[$]?.items??[]).filter(R=>R.start!=null&&R.end!=null).map(R=>({item:R,s:q(R.start),en:q(R.end)}));for(let R of Cs(Z)){let w=O.w/R.cols,L=Math.round(O.x+R.col*w),D=Math.round(w-(R.cols>1?4:0)),H=A(R.s),ie=R.item;if(ie.type==="act"){let V=W.get(ie.event??"");if(!V)continue;let Ht=Math.max(30,A(R.en)-H);if(y.cards.push(N(V,L,H,D,Ht,ie.clash,!1)),V.arrive_by!=null&&V.start-V.arrive_by>=5){let jt=A(V.arrive_by);y.preps.push({key:`${b.date}|prep|${V.id}`,x:L,y:jt,w:D,h:H-jt+6,color:j,label:`Arrive by ${k(V.arrive_by)}`})}let Bt=ce.get(V.id);Bt&&y.marks.push({key:`${b.date}|late|${V.id}`,x:L+D-4,y:H+4,text:Bt,right:!0});let qt=ce.get(`${V.id}|pick`);qt&&y.marks.push({key:`${b.date}|wait|${V.id}`,x:L+4,y:H+Ht+2,text:qt,right:!1});continue}let B=b.rides[ie.ride??-1];if(!B)continue;let pe=Math.max(22,A(R.en)-H),Se=ot(X(B.index),g),U=u(B.driver);y.rides.push({key:`${b.date}|ride|${B.index}`,x:L,y:H,w:D,h:pe,target:Te(B.index),l1:`${B.own?"In":"Along in"} ${U}’s car`,l2:Se.join(" → "),show2:Un(pe)>0,lines2:Un(pe),dashed:!B.own,clash:ie.clash,aria:`${x($)} ${B.own?"in":"riding along in"} ${U}’s car, ${k(q(B.start))} to ${k(q(B.end))}: ${Se.join(" to ")}`});let he=l.get(B.driver);he&&y.bands.push({key:`${b.date}|band|${B.index}`,x:L+D,y:H,w:Math.max(0,he.x+8-(L+D)),h:pe,color:j})}}for(let $ of f){let O=l.get($),j=b.drivers[$];if(!j)continue;let Z=[],R=null;for(let w of j.segments)if(!(w.start==null||w.end==null)){if(w.type==="home"){R=null;continue}if(w.type==="stay"){R=null,Z.push({type:"stay",g:w,s:w.start,en:w.end});continue}R&&R.en===w.start?(R.en=w.end,R.legs.push(w)):(R={type:"trip",s:w.start,en:w.end,legs:[w]},Z.push(R))}for(let w of Z){let L=A(w.s),D=Math.max(24,A(w.en)-L);if(w.type==="stay"){let U=W.get(w.g.event??w.g.serves??""),he=U?m.get(U.kid)??G(0):G(0),V=w.g.kids.map(x);y.stays.push({key:`${b.date}|stay|${$}|${w.s}`,x:O.x+8,y:L,w:O.w-16,h:D,target:K(U?.id),color:he,l1:U?`At ${U.title} with ${x(U.kid)}`:"Staying",l2:`until ${k(w.en)}`+(V.length?` · ${V.join(" and ")} too`:"")});continue}let H=w.legs[0],ie=w.legs[w.legs.length-1],B=[];for(let U of w.legs)for(let he of U.kids)B.includes(he)||B.push(he);let pe=ie.type==="drive"&&ie.to==="home",Se=ot(w.legs,g);y.trips.push({key:`${b.date}|trip|${$}|${w.s}`,x:O.x+8,y:L,w:O.w-16,h:D,target:K(w.legs.find(U=>U.serves)?.serves),l1:H.type==="drive"&&H.from==="home"?`Leave ${k(w.s)}`:`From ${lt(g,H.from??H.place)} ${k(w.s)}`,l2:Se.join(" → "),show2:D>=36,l3:pe?`Home ${k(w.en)}`:"",show3:pe&&D>=62,stops:null,kids:B.map(U=>(m.get(U)??G(0)).color),bad:w.legs.some(U=>U.overlaps_busy),aria:`${u($)} drives ${Se.join(" to ")}, ${k(w.s)} to ${k(w.en)}`})}for(let w of j.segments)if(!(!w.overlaps_busy||w.start==null||w.end==null))for(let L of j.busy){let D=Math.max(w.start,L.start),H=Math.min(w.end,L.end);H<=D||y.overlaps.push({key:`${b.date}|overlap|${$}|${D}`,x:O.x+6,y:A(D)-2,w:O.w-12,h:Math.max(8,A(H)-A(D)+4)})}for(let w of j.busy){if(w.end<=_||w.start>=P)continue;let L=A(w.start),D=A(w.end);y.busy.push({key:`${b.date}|busy|${$}|${w.start}`,x:O.x+1,y:L,w:O.w-2,h:D-L,labelY:8,label:Ln(w,!1)})}}let C=-1/0;for(let $=_;$<=P;$+=30)y.grid.push({key:`${b.date}|grid|${$}`,y:A($),strong:$%60===0}),$%60===0&&A($)-C>=22&&(y.hours.push({key:`${b.date}|hour|${$}`,y:A($)-8,label:on($)}),C=A($));b.date===n.date&&n.minutes>_&&n.minutes<P&&(y.now={y:A(n.minutes),label:`Now ${k(n.minutes)}`}),S=A(P)+St;return}let M=[];for(let d of c){let E=l.get(d);for(let _ of b.kids[d]?.items??[])if(_.start!=null){if(_.type==="act"){let P=W.get(_.event??"");if(!P)continue;M.push({col:d,s:_.start,h:Us(P,E.w),kind:"act",item:_})}else if(!b.rides[_.ride??-1]?.own){let P=b.rides[_.ride??-1],A=P?ot(X(P.index),g).join(" → "):"";M.push({col:d,s:_.start,h:Ls(A,E.w),kind:"along",item:_})}}}for(let d of f){let E=b.drivers[d];if(E){for(let _ of E.busy)M.push({col:d,s:_.start,h:32,kind:"busy",busy:_});for(let _ of E.outings)_.start!=null&&M.push({col:d,s:_.start,h:30+_.lines.length*16+(_.warn?16:0),kind:"out",out:_})}}M.sort((d,E)=>d.s-E.s||h.indexOf(d.col)-h.indexOf(E.col));let Q=new Map,Ot=T;M.forEach((d,E)=>{let _=Q.get(d.col),P=Math.max(_!=null?_+Ts:T,Ot);Q.set(d.col,P+d.h),Ot=P,y.anchors.push({t:I+d.s,y:P});let A=l.get(d.col);if(d.kind==="busy")y.busy.push({key:`${b.date}|busy|${d.col}|${E}`,x:A.x+1,y:P,w:A.w-2,h:d.h,labelY:8,label:Ln(d.busy,!0)});else if(d.kind==="out"){let C=d.out;y.trips.push({key:`${b.date}|trip|${d.col}|${E}`,x:A.x+8,y:P,w:A.w-16,h:d.h,target:K(C.target),l1:C.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...C.lines.map($=>({text:$,warn:!1})),...C.warn?[{text:C.warn,warn:!0}]:[]],kids:C.kids.map($=>(m.get($)??G(0)).color),bad:!!C.warn,aria:`${u(d.col)}: ${C.lead}. ${C.lines.join(". ")}${C.warn?`. ${C.warn}`:""}`})}else if(d.kind==="act"){let C=W.get(d.item.event??"");y.cards.push(N(C,A.x,P,A.w,d.h,d.item.clash,!0))}else{let C=b.rides[d.item.ride??-1],$=ot(X(C.index),g),O=u(C.driver);y.rides.push({key:`${b.date}|ride|${C.index}`,x:A.x,y:P,w:A.w,h:d.h,target:Te(C.index),l1:`Along with ${O} ${k(q(C.start))}`,l2:$.join(" → "),show2:!0,lines2:It,dashed:!0,clash:d.item.clash,aria:`${x(d.col)} riding along with ${O}, ${k(q(C.start))} to ${k(q(C.end))}: ${$.join(" to ")}`})}});let ut=T;for(let d of Q.values())ut=Math.max(ut,d);S=ut+St+6,y.anchors.push({t:I+1439,y:S})}),y.height=S,y}var Os=["","¼","½","¾"];function xe(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Ne(n);let i=Math.round(n*4),r=Math.floor(i/4),a=Os[i%4];return`${r||!a?r:""}${a} min`})}function Vn(s){let t=e=>e?{...e,text:xe(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,i])=>[n,{...i,outings:i.outings.map(r=>({...r,lines:r.lines.map(xe),warn:r.warn==null?r.warn:xe(r.warn)}))}])),issues:e.issues.map(n=>({...n,title:xe(n.title),body:xe(n.body),note:n.note==null?n.note:xe(n.note),...n.suggestions?{suggestions:n.suggestions.map(i=>({...i,note:xe(i.note)}))}:{}}))}))}}var Hs=2,Bs=48;function Wn(s,t,e=Bs){let n=[],i=0,r=0,a=0,o=0,l=t.minutes+e*60;for(let c of s.days){let f=We(t.date,c.date),h=f===0?"":`${re(c.date)} · `,m=new Map(c.events.map(u=>[u.id,u])),g=u=>u&&m.has(u)?{day:c.date,event:u}:null,x=(u,y)=>f*1440+(u??m.get(y??"")?.start??0)<l;for(let u of c.issues)if(u.level==="problem"){if(!x(u.at,u.event)){a++,u.kind==="unassigned"&&o++;continue}i++,u.kind==="unassigned"&&r++,n.push({key:`${c.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:h+u.title,body:u.body,target:g(u.event),suggestions:(u.suggestions??[]).map(y=>({id:y.id,label:y.label,note:y.note}))})}if(c.clashes.forEach((u,y)=>{if(!x(u.a.start,u.a.event)){a++;return}i++;let S=m.get(u.a.event??""),b=F(s,u.kid),z="";if(u.b.type==="act"){let I=m.get(u.b.event??"");z=S&&I?`${S.title} ${k(S.start)}–${k(S.end)} and ${I.title} ${k(I.start)}–${k(I.end)} overlap.`:""}else{let I=c.rides[u.b.ride??-1];z=S&&I?`${b} is in ${de(s,I.driver)}’s car ${k(q(u.b.start))}–${k(q(u.b.end))}, during ${S.title}.`:""}n.push({key:`${c.date}|clash|${y}`,tone:"problem",title:`${h}${b} is double-booked`,body:z,target:g(u.a.event),suggestions:[]})}),f>=0&&f<Hs)for(let u of c.issues)u.level!=="heads_up"||!x(u.at,u.event)||n.push({key:`${c.date}|${u.key}`,tone:"heads_up",title:h+u.title,body:u.body,target:g(u.event),suggestions:[]});for(let u of c.events)!u.problems.length||!x(u.start)||n.push({key:`${c.date}|notes|${u.id}`,tone:"heads_up",title:`${h}Check the notes on ${F(s,u.kid)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:g(u.id),suggestions:[]})}return{items:n,problems:i,unassigned:r,later:a,laterUnassigned:o}}function Kn(s,t){let e=ye(s),n=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of s.days){let a=We(t.date,r.date);if(!(a<0))for(let o of le(s))for(let l of r.drivers[o]?.outings??[]){if(l.start==null)continue;let c=a*1440+l.start;if(a*1440+q(l.end,l.start)<=t.minutes)continue;let h=c-t.minutes,m={driver:o,name:de(s,o),date:r.date,ahead:a,start:l.start,inMinutes:h,ongoing:h<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(g=>e.get(g)??G(0)),warn:l.warn,target:l.target&&r.events.some(g=>g.id===l.target)?{day:r.date,event:l.target}:null};(!n||i(m)<i(n)||i(m)===i(n)&&m.inMinutes<n.inMinutes)&&(n=m)}}return n}var qs={timeline:"timeline",full:"timeline",compact:"compact"};function Fn(s){let t=new URLSearchParams(s),e={},n=qs[(t.get("view")??"").trim().toLowerCase()];return n&&(e.view=n),e}var js=["auth_callback","code","state"];function Lt(s){let t=new URLSearchParams(s);for(let n of js)t.delete(n);let e=t.toString();return e?`?${e}`:""}var Yn=xt`
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
`;var Gn="mydashlight.rides.mode",Vs=1100,Ws=440,Ks=700,Fs=3*6e4,Ys=1200;function Gs(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}function pt(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Js(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Xs(){try{return localStorage.getItem(Gn)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Qs(s){try{localStorage.setItem(Gn,s)}catch{}}function ht(s){return s.days.every(t=>!t.events.length)}var He=class extends oe{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Fn(location.search).view;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let i=e.clientX-n.x,r=e.clientY-n.y;if(!n.moved){if(Math.abs(i)+Math.abs(r)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-r,n.el.scrollLeft=n.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Fs))};this.onKey=e=>{e.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Xs(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.backend&&(this.stopWatching=this.backend.watch(e=>{this.plan=Vn(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Vs)return!1;let e=this.plan;return!e||this.width-Ws>=Nt(ve(e).length,le(e).length)}today(){return Re(this.plan?.time_zone??Gs())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),i=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=jn(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let i=this.scroller;if(!i||!this.board)return;let r=this.board.dayHeads.find(a=>a.date===n)?.y??0;i.scrollTop=Math.max(r,On(this.board,e)-ct-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),a=n.days[r];if(!a)return;let o=1/0;if(this.mode==="timeline"){for(let l of a.events)o=Math.min(o,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let c of l.outings)c.start!=null&&(o=Math.min(o,c.start))}this.scrollToTime(r*1440+(Number.isFinite(o)?Math.max(0,o-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,i=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=n+1&&(i=c);let r=this.renderRoot,a=r.querySelector(".pinned .label"),o=r.querySelector(".pinned .tag"),l=r.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),o&&(o.textContent!==i.tag&&(o.textContent=i.tag),o.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let c of r.querySelectorAll(".day-tile"))c.classList.toggle("in-view",c.dataset.date===i.date)}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?Hn(this.board,n.scrollTop+ct+4):null,this.mode=e,this.urlView||Qs(e)}findEvent(e){let n=this.plan?.days.find(r=>r.date===e.day),i=n?.events.find(r=>r.id===e.event);return n&&i?{day:n,event:i}:null}open(e){e&&(this.flushArrive(),this.sel=e,this.scope="this",this.arriveDraft=void 0)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,i){if(!this.pending){this.pending={key:e,value:n};try{await i()}catch(r){let a=r instanceof Y?r:new Y("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,n,i){if(!this.backend)return;let r=this.backend;this.save(`${n}`,i,()=>r.setRide(e.id,n,i,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n){if(!this.backend)return;let i=this.backend,r=e.along.includes(n)?e.along.filter(a=>a!==n):[...e.along,n];this.save("along",r,()=>i.setTakeAlong(e.id,r,this.scope))}nudgeArrive(e,n){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;n<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Ys)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let i=this.findEvent(n);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,a=i.event.id,o=this.scope;this.save("arrive",e,()=>r.setArriveBy(a,e,o)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),i=e?Wn(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide||this.sheet||!!this.sel;return p`
      <div class="app ${this.wide?"wide":this.width<Ks?"narrow phone":"narrow"}">
        ${this.renderHeader(e,i)} ${e?this.renderWeek(e):v} ${this.renderBanner(e)}
        <main>
          <section class="board-area" aria-label="Everyone’s week">
            ${n&&e?ht(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
          </section>
          ${r?p`${this.wide?v:p`<div class="backdrop" @click=${()=>this.closePanel()}></div>`}
                <aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
                  ${this.sel&&e?this.renderEditor(e):this.renderAttention(i)}
                </aside>`:v}
        </main>
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:v}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(e,n){let i=n.problems;this.tick;let r=this.today(),a="";if(e){let f=e.time_zone,h=new Date(e.updated);this.error?a=p`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Ke(h,new Date,f)}</span>`:e.status&&!e.status.ok?a=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Ke(h,new Date,f)}</span>`:this.backend?.live||(a=`Updated ${Ke(h,new Date,f)}`)}let o=(f,h,m,g)=>p`
      <button type="button" class="seg-btn" title=${g} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${m}<span class="seg-label">${h}</span>
      </button>
    `,l=Ce(r.minutes),c=!!e&&ht(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Ae`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:v}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ke(r.date)}, ${l}`}>
            <span class="hm">${l.slice(0,-3)}</span><span class="ampm">${l.slice(-2)}</span>
          </h1>
          <p class="today-line">${ke(r.date)}</p>
          ${a?p`<p class="status">${a}</p>`:v}
        </div>
        ${e&&!c?this.renderNext(e,Kn(e,r),n):v}
        <div class="controls">
          ${this.wide||c?v:p`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <div role="group" aria-label="View" class="seg">
            ${o("timeline","Timeline",Ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${o("compact","Compact",Ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>
        </div>
      </header>
    `}renderNext(e,n,i){if(!n){let c=this.today().date,f=i.unassigned,h=i.laterUnassigned;if(f){let g=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${f} ${f===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?p`<div class="next idle needs">${g}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${g}</button>`}if(h)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let m=e.days.some(g=>g.date>=c&&g.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${m?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${m?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let r;n.ongoing?r="On the road now":n.ahead===0?r=n.inMinutes<180?`Next trip · in ${Ne(n.inMinutes)}`:"Next trip · later today":n.ahead===1?r="Next trip · tomorrow":r=`Next trip · ${re(n.date)}`;let a=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,o=p`
      <span class="next-eyebrow">${r}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${pt(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(c=>p`<span class="kid-dot" style="background:${c.color}"></span>`)}</span>
      </span>
      ${n.warn?p`<span class="next-stop warn">${n.warn}</span>`:n.stop?p`<span class="next-stop">${n.stop}</span>`:v}
    `,l=`next ${n.ongoing?"ongoing":a?"soon":""}`;return n.target?p`<button type="button" class=${l} @click=${()=>this.open(n.target)}>${o}</button>`:p`<div class=${l}>${o}</div>`}renderWeek(e){let n=this.today().date,i=ye(e);return p`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let a=zt(r),o=r.events.length,l=r.events.slice(0,6).map(f=>i.get(f.kid)?.color??G(0).color),c=`${ke(r.date)}: ${o?`${o} ${o===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return p`<button
          type="button"
          class="day-tile ${r.date===n?"today":""}"
          data-date=${r.date}
          aria-label=${c}
          @click=${()=>this.goToDay(r.date)}
        >
          <span class="dt-wd">${r.date===n?"Today":re(r.date)}</span>
          <span class="dt-num">${Number(r.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(f=>p`<span class="dt-dot" style="background:${f}"></span>`):p`<span class="dt-free">free</span>`}
            ${o>6?p`<span class="dt-more">+${o-6}</span>`:v}
          </span>
          ${a?p`<span class="dt-badge" aria-hidden="true">${a}</span>`:v}
        </button>`})}
    </nav>`}renderQuiet(e){let n=ve(e),i=le(e),r=ye(e),a=n.map(o=>F(e,o));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((o,l)=>Ae`<circle cx=${50+l*30} cy="80" r="11" fill=${r.get(o).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Js(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(o=>{let l=r.get(o);return p`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${pt(F(e,o))}</span>
            <span class="qw-name">${F(e,o)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(o=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${pt(de(e,o))}</span>
            <span class="qw-name">${de(e,o)}</span>
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
    </div>`}renderBanner(e){let n=e?.unavailable_calendars.length??0;return n?p`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:v}renderEmpty(){return this.error?p`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:p`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,i=o=>!!o&&!!n&&o.day===n.day&&o.event===n.event,r=e.dayHeads[0],a=e.width;return p`
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
          ${e.columns.map(o=>p`<div class="col-head ${o.kind}" style="left:${o.x}px;width:${o.w}px;--c:${o.dot};--rgb:${o.rgb}">
              <span class="avatar ${o.kind}" aria-hidden="true">${pt(o.name)}</span>
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
          ${e.columns.map(o=>p`<div
                class="col-bg ${o.kind}"
                style="left:${o.x}px;width:${o.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${o.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(o=>p`<div class="day-head" style="top:${o.y}px;width:${a}px">
              <span class="label">${o.label}</span>${o.tag?p`<span class="tag">${o.tag}</span>`:v}<span
                class="sub ${o.warn?"warn":""}"
                >${o.sub}</span
              >
            </div>`)}
          ${e.empties.map(o=>p`<span class="empty" style="top:${o.y}px">${o.text}</span>`)}
          ${e.grid.map(o=>p`<div class="grid ${o.strong?"strong":""}" style="top:${o.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(o=>p`<span class="hour" style="top:${o.y}px">${o.label}</span>`)}
          ${J(e.bands,o=>o.key,o=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:rgba(${o.color.rgb},0.10);border-color:rgba(${o.color.rgb},0.45)"
              ></div>`)}
          ${J(e.busy,o=>o.key,o=>p`<div class="busy" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px">
                <span style="top:${o.labelY}px">${o.label}</span>
              </div>`)}
          ${J(e.preps,o=>o.key,o=>p`<div
                class="prep"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:rgba(${o.color.rgb},0.07);color:${o.color.ink}"
              >
                ${o.label}
              </div>`)}
          ${J(e.cards,o=>o.key,o=>{let l=o.color,c=o.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${o.wrap?"wrap":""} ${i(o.target)?"sel":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:${c};border-color:${o.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--ring:${l.color}"
                @click=${()=>this.open(o.target)}
              >
                <span class="top">
                  <span class="title">${o.title}</span>
                  <span class="time">${o.time}</span>
                  ${o.showDrop&&o.drop?p`<span class="line tone-${o.drop.tone}">${o.drop.text}</span>`:v}
                </span>
                ${o.showPick&&o.pick?p`<span class="line tone-${o.pick.tone}">${o.pick.text}</span>`:v}
              </button>`})}
          ${J(e.rides,o=>o.key,o=>p`<button
                type="button"
                class="ride ${o.dashed?"dashed":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}</span>${o.show2?p`<span class="l2" style="-webkit-line-clamp:${o.lines2}">${o.l2}</span>`:v}
              </button>`)}
          ${J(e.stays,o=>o.key,o=>p`<button
                type="button"
                class="stay"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:repeating-linear-gradient(135deg, rgba(${o.color.rgb},0.28) 0px, rgba(${o.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1" style="color:${o.color.ink}">${o.l1}</span><span class="l2">${o.l2}</span>
              </button>`)}
          ${J(e.trips,o=>o.key,o=>p`<button
                type="button"
                class="trip ${o.bad?"bad":""} ${o.stops?"list":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}${o.kids.map(l=>p`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${o.show2?p`<span class="l2">${o.l2}</span>`:v}
                ${o.stops?o.stops.map(l=>p`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):v}
                ${o.show3?p`<span class="l3">${o.l3}</span>`:v}
              </button>`)}
          ${J(e.overlaps,o=>o.key,o=>p`<div class="overlap" aria-hidden="true" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`)}
          ${J(e.marks,o=>o.key,o=>p`<span class="mark" style="left:${o.x}px;top:${o.y}px;${o.right?"transform:translateX(-100%)":""}">${o.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:v}
        </div>
      </div>
    `}renderAttention(e){let{items:n,problems:i,later:r}=e,a=this.plan;return p`
      <div class="panel-head">
        <h2>Needs attention <span class="panel-sub">Next two days</span></h2>
        <span class="count-pill ${i?"bad":"ok"}">${i}</span>
        ${this.wide?v:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${a&&!i?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${Ae`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${ht(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:v}
      ${n.map(o=>p`<div class="issue ${o.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${o.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${o.target?p`<button type="button" class="issue-title" @click=${()=>this.open(o.target)}>${o.title}</button>`:p`<strong class="issue-title">${o.title}</strong>`}
              <span class="issue-body">${o.body}</span>
            </div>
          </div>
          ${o.suggestions.length?p`<div class="fixes">
                ${o.suggestions.map(l=>p`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(l.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${l.id}`?"Saving…":l.label}</span>
                    <span class="fix-note">${l.note}</span>
                  </button>`)}
              </div>`:v}
        </div>`)}
      ${this.wide&&a&&!ht(a)?this.renderLegend():v}
    `}renderLegend(){return p`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return p``;let{day:i,event:r}=n,a=le(e),l=ye(e).get(r.kid)??G(0),c=!!this.pending,f=T=>this.pending?.key===T?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let T of e.days)for(let se of T.events)for(let N of[se.drop,se.pick])N&&N!=="none"&&!a.includes(N)&&!h.some(X=>X.toLowerCase()===N.toLowerCase())&&h.push(N);let m=T=>{if(!r.sides.includes(T))return v;let se=f(T),N=se!==void 0?String(se):T==="drop"?r.drop:r.pick,X=N&&N!=="none"&&!a.includes(N)?N:"",Te=M=>this.setRide(r,T,N===M?"":M),ce=[...a.map(M=>[M,Dt(e,M)]),["none","Not needed"]];return p`<div class="field">
        <span class="field-label">${T==="drop"?"Drop-off":"Pick-up"} ${N===""?p`<span class="nobody">· nobody yet</span>`:v}</span>
        <div role="group" aria-label=${T==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${ce.length}, minmax(0, 1fr))">
          ${ce.map(([M,Q])=>p`<button type="button" class="choice" aria-pressed=${N===M?"true":"false"} ?disabled=${c} @click=${()=>Te(M)}>
                ${Q}
              </button>`)}
        </div>
        ${h.length?p`<div role="group" aria-label=${T==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(M=>p`<button type="button" class="chip" aria-pressed=${N.toLowerCase()===M.toLowerCase()?"true":"false"} ?disabled=${c} @click=${()=>Te(M)}>
                    ${M}
                  </button>`)}
            </div>`:v}
        <input
          type="text"
          .value=${X&&!h.some(M=>M.toLowerCase()===X.toLowerCase())?X:""}
          ?disabled=${c}
          aria-label=${T==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${M=>{let Q=M.target.value.trim();Q&&Q!==N&&this.setRide(r,T,Q)}}
          @keydown=${M=>{M.key==="Enter"&&M.target.blur()}}
        />
      </div>`},g=f("stay"),x=g!==void 0?!!g:r.stay,u=r.drop===r.pick&&a.includes(r.drop),y=f("along"),S=y!==void 0?y:r.along,b=ve(e).filter(T=>T!==r.kid),z=a.includes(r.drop)&&r.sides.includes("drop"),I=f("arrive"),W=this.arriveDraft!==void 0?this.arriveDraft:I!==void 0?I:r.arrive_by,K=[],we=T=>T==="none"?"Not needed":Dt(e,T);r.drop!==""&&K.push(`Drop-off: ${we(r.drop)}`),r.pick!==""&&K.push(`Pick-up: ${we(r.pick)}`),r.stay&&K.push("Stay: yes"),r.along.length&&K.push(`Take along: ${r.along.map(T=>F(e,T)).join(", ")}`),r.arrive_by!=null&&K.push(`Arrive by: ${Ce(r.arrive_by)}`);let $e=i.date===this.today().date?"":`${re(i.date)} · `,Be=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${F(e,r.kid)} · ${r.title}</span>
          <span class="ed-meta">${$e}${k(r.start)}–${k(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return r.where==="home"?p`${Be}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${F(e,r.kid)} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${Be}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:v}
      ${r.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${re(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:v}
      ${r.where==="anywhere"?p`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:v}
      ${m("drop")} ${m("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${x?"true":"false"} ?disabled=${!u||c} @click=${()=>this.toggleStay(r)}>
          ${u?x?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${z&&b.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${b.map(T=>p`<button type="button" class="chip" aria-pressed=${S.includes(T)?"true":"false"} ?disabled=${c} @click=${()=>this.toggleAlong(r,T)}>
                  ${F(e,T)}
                </button>`)}
            </div>
          </div>`:v}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${W!=null?`${r.start-W} min before it starts`:`Aims for a few minutes before ${k(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${c} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${W!=null?k(W):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${c||W==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${W!=null?p`<button type="button" class="chip clear" ?disabled=${c} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:v}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${K.length?K.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${r.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${r.problems.join("; ")}</p>`:v}
      <p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>
    `}};He.styles=Yn,He.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",He);var Ut="hassTokens";function Zs(){try{let s=localStorage.getItem(Ut);return s?JSON.parse(s):null}catch{return null}}function Jn(s){try{s?localStorage.setItem(Ut,JSON.stringify(s)):localStorage.removeItem(Ut)}catch{}}function ei(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}async function ti(){let s=document.querySelector("mydashlight-board");if(s){s.kiosk=!0;try{let t=await sn({hassUrl:location.origin,loadTokens:async()=>Zs(),saveTokens:Jn});location.search.includes("auth_callback")&&history.replaceState(null,"",location.pathname+Lt(location.search));let e=await rn({auth:t});s.backend=new Fe(e)}catch(t){if(t===2){Jn(null),location.replace(location.pathname+Lt(location.search));return}ei(t===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(t)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}}ti();
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
