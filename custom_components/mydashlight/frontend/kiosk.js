function Lt(n){return{type:"auth",access_token:n}}function Nt(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function zt(n){let e={type:"subscribe_events"};return n&&(e.event_type=n),e}function lt(n){return{type:"unsubscribe_events",subscription:n}}function Bt(){return{type:"ping"}}function Ht(n,e){return{type:"result",success:!1,error:{code:n,message:e}}}function Ot(n){let e={},t=n.split("&");for(let s=0;s<t.length;s++){let i=t[s].split("="),o=decodeURIComponent(i[0]),a=i.length>1?decodeURIComponent(i[1]):void 0;e[o]=a}return e}var jt=(n,e,t,s)=>{let[i,o,a]=n.split(".",3);return Number(i)>e||Number(i)===e&&(s===void 0?Number(o)>=t:Number(o)>t)||s!==void 0&&Number(i)===e&&Number(o)===t&&Number(a)>=s};var Le=!1,zs="auth_required",Bs="auth_invalid",Hs="auth_ok";function qt(n){if(!n.auth)throw 4;let e=n.auth,t=e.expired?e.refreshAccessToken().then(()=>{t=void 0},()=>{t=void 0}):void 0,s=e.wsUrl;Le&&console.log("[Auth phase] Initializing",s);function i(o,a,d){Le&&console.log("[Auth Phase] New connection",s);let r=new WebSocket(s),l=!1,x=()=>{if(r.removeEventListener("close",x),l){d(2);return}if(o===0){d(1);return}let b=o===-1?-1:o-1;setTimeout(()=>i(b,a,d),1e3)},p=async b=>{try{e.expired&&await(t||e.refreshAccessToken()),r.send(JSON.stringify(Lt(e.accessToken)))}catch(u){l=u===2,r.close()}},m=async b=>{let u=JSON.parse(b.data);switch(Le&&console.log("[Auth phase] Received",u),u.type){case Bs:l=!0,r.close();break;case Hs:r.removeEventListener("open",p),r.removeEventListener("message",m),r.removeEventListener("close",x),r.removeEventListener("error",x),r.haVersion=u.ha_version,jt(r.haVersion,2022,9)&&r.send(JSON.stringify(Nt())),a(r);break;default:Le&&u.type!==zs&&console.warn("[Auth phase] Unhandled message",u)}};r.addEventListener("open",p),r.addEventListener("message",m),r.addEventListener("close",x),r.addEventListener("error",x)}return new Promise((o,a)=>i(n.setupRetry,o,a))}var _e=!1,Ne=class{constructor(e,t){this._handleMessage=s=>{let i=JSON.parse(s.data);Array.isArray(i)||(i=[i]),i.forEach(o=>{_e&&console.log("Received",o);let a=this.commands.get(o.id);switch(o.type){case"event":a?a.callback(o.event):(console.warn(`Received event for unknown subscription ${o.id}. Unsubscribing.`),this.sendMessagePromise(lt(o.id)).catch(d=>{_e&&console.warn(` Error unsubsribing from unknown subscription ${o.id}`,d)}));break;case"result":a&&(o.success?(a.resolve(o.result),"subscribe"in a||this.commands.delete(o.id)):(a.reject(o.error),this.commands.delete(o.id)));break;case"pong":a?(a.resolve(),this.commands.delete(o.id)):console.warn(`Received unknown pong response ${o.id}`);break;default:_e&&console.warn("Unhandled message",o)}})},this._handleClose=async()=>{let s=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,s.forEach(a=>{"subscribe"in a||a.reject(Ht(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),o=a=>{setTimeout(async()=>{if(!this.closeRequested){_e&&console.log("Trying to reconnect");try{let d=await i.createSocket(i);this._setSocket(d)}catch(d){if(this._queuedMessages){let r=this._queuedMessages;this._queuedMessages=void 0;for(let l of r)l.reject&&l.reject(3)}d===2?this.fireEvent("reconnect-error",d):o(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),o(0)},this.options=t,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(e)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(e){this.socket=e,this.haVersion=e.haVersion,e.addEventListener("message",this._handleMessage),e.addEventListener("close",this._handleClose);let t=this.oldSubscriptions;t&&(this.oldSubscriptions=void 0,t.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(o=>{i.unsubscribe=o,i.resolve()})}));let s=this._queuedMessages;if(s){this._queuedMessages=void 0;for(let i of s)i.resolve()}this.fireEvent("ready")}addEventListener(e,t){let s=this.eventListeners.get(e);s||(s=[],this.eventListeners.set(e,s)),s.push(t)}removeEventListener(e,t){let s=this.eventListeners.get(e);if(!s)return;let i=s.indexOf(t);i!==-1&&s.splice(i,1)}fireEvent(e,t){(this.eventListeners.get(e)||[]).forEach(s=>s(this,t))}suspendReconnectUntil(e){this.suspendReconnectPromise=e}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(e=!1){if(this.socket){if(!e){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(e,t){return this.subscribeMessage(e,zt(t))}ping(){return this.sendMessagePromise(Bt())}sendMessage(e,t){if(!this.connected)throw 3;if(_e&&console.log("Sending",e),this._queuedMessages){if(t)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(e)});return}t||(t=this._genCmdId()),e.id=t,this.socket.send(JSON.stringify(e))}sendMessagePromise(e){return new Promise((t,s)=>{if(this._queuedMessages){this._queuedMessages.push({reject:s,resolve:async()=>{try{t(await this.sendMessagePromise(e))}catch(o){s(o)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:t,reject:s}),this.sendMessage(e,i)})}async subscribeMessage(e,t,s){if(this._queuedMessages&&await new Promise((o,a)=>{this._queuedMessages.push({resolve:o,reject:a})}),s?.preCheck&&!await s.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((o,a)=>{let d=this._genCmdId();i={resolve:o,reject:a,callback:e,subscribe:s?.resubscribe!==!1?()=>this.subscribeMessage(e,t,s):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(lt(d)),this.commands.delete(d)}},this.commands.set(d,i);try{this.sendMessage(t,d)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var Us=()=>`${location.protocol}//${location.host}/`,Os=n=>n*1e3+Date.now();function js(){let{protocol:n,host:e,pathname:t,search:s}=location;return`${n}//${e}${t}${s}`}function Vs(n,e,t,s){let i=`${n}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(t)}`;return e!==null&&(i+=`&client_id=${encodeURIComponent(e)}`),s&&(i+=`&state=${encodeURIComponent(s)}`),i}function qs(n,e,t,s){t+=(t.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Vs(n,e,t,s)}async function Ft(n,e,t){let s=typeof location<"u"&&location;if(s&&s.protocol==="https:"){let d=document.createElement("a");if(d.href=n,d.protocol==="http:"&&d.hostname!=="localhost")throw 5}let i=new FormData;e!==null&&i.append("client_id",e),Object.keys(t).forEach(d=>{i.append(d,t[d])});let o=await fetch(`${n}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!o.ok)throw o.status===400||o.status===403?2:new Error("Unable to fetch tokens");let a=await o.json();return a.hassUrl=n,a.clientId=e,a.expires=Os(a.expires_in),a}function Kt(n,e,t){return Ft(n,e,{code:t,grant_type:"authorization_code"})}function Ws(n){return btoa(JSON.stringify(n))}function Ks(n){return JSON.parse(atob(n))}var dt=class{constructor(e,t){this.data=e,this._saveTokens=t}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let e=await Ft(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});e.refresh_token=this.data.refresh_token,this.data=e,this._saveTokens&&this._saveTokens(e)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let e=new FormData;e.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:e}),this._saveTokens&&this._saveTokens(null)}};async function Yt(n={}){let e,t=n.hassUrl;t&&t[t.length-1]==="/"&&(t=t.substr(0,t.length-1));let s=n.clientId!==void 0?n.clientId:Us(),i=n.limitHassInstance===!0;if(n.authCode&&t&&(e=await Kt(t,s,n.authCode),n.saveTokens&&n.saveTokens(e)),!e){let o=Ot(location.search.substr(1));if("auth_callback"in o){let a=Ks(o.state);if(i&&(a.hassUrl!==t||a.clientId!==s))throw 6;e=await Kt(a.hassUrl,a.clientId,o.code),n.saveTokens&&n.saveTokens(e)}}if(!e&&n.loadTokens&&(e=await n.loadTokens()),e&&(t===void 0||e.hassUrl===t))return new dt(e,n.saveTokens);if(t===void 0)throw 4;return qs(t,s,n.redirectUrl||js(),Ws({hassUrl:t,clientId:s})),new Promise(()=>{})}async function Gt(n){let e=Object.assign({setupRetry:0,createSocket:qt},n),t=await e.createSocket(e);return new Ne(t,e)}function w(n){let e=Math.round(n),t=Math.floor(e/60),s=(e%60+60)%60;return`${((t+11)%12+12)%12+1}:${s<10?"0":""}${s}`}function ze(n){let e=Math.floor(Math.round(n)/60)%24;return`${w(n)} ${e<12?"AM":"PM"}`}function Jt(n){let e=Math.floor(n/60)%24;return`${(e+11)%12+1} ${e<12?"AM":"PM"}`}function Xt(n){let e=Math.max(0,Math.round(n)),t=Math.floor(e/60),s=e%60;return t?s?`${t} hr ${s} min`:`${t} hr`:`${s} min`}function Qt(n){let e=Math.floor(n/60)%24,t=n%60;return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}:00`}var Fs=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Ys=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Gs=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Be(n){return new Date(`${n}T12:00:00Z`)}function Ae(n){let e=Be(n);return`${Fs.format(e)}, ${Gs.format(e)}`}function me(n){return Ys.format(Be(n))}function Zt(n,e){return n===e?Ae(n):`${Ae(n)} to ${Ae(e)}`}function ct(n,e){return Math.round((Be(e).getTime()-Be(n).getTime())/864e5)}function Ee(n,e=new Date){let t;try{t=new Intl.DateTimeFormat("en-CA",{timeZone:n,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(e)}catch{return Ee("UTC",e)}let s=i=>t.find(o=>o.type===i)?.value??"0";return{date:`${s("year")}-${s("month")}-${s("day")}`,minutes:Number(s("hour"))*60+Number(s("minute"))}}function He(n,e,t){let s=Math.floor((e.getTime()-n.getTime())/6e4);if(s<1)return"just now";if(s<60)return`${s} min ago`;let i=Ee(t,n),o=Ee(t,e).date;return i.date===o?`at ${ze(i.minutes)}`:`on ${me(i.date)} at ${ze(i.minutes)}`}var Y=class extends Error{constructor(e,t){super(t),this.code=e,this.name="BackendError"}},pt="mydashlight",Js=7,Xs=3e4;function es(n){if(n instanceof Y)return n;if(n&&typeof n=="object"){let e=n;if(typeof e.message=="string")return new Y(String(e.code??"error"),e.message)}return typeof n=="number"?new Y("connection_lost","Lost the connection to Home Assistant."):new Y("error",String(n))}var Ue=class{constructor(e){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new Y("connection_lost","Lost the connection to Home Assistant."));this.conn=e}get live(){return this.pushing}watch(e,t){let s={onPlan:e,onError:t};return this.listeners.add(s),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(s),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Xs),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let e=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,e&&e().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(e=>{this.pushing=!0,e.plan?this.emit(e.plan):this.fail(new Y("not_running","MyDashLight isn’t running right now."))},{type:`${pt}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(e){for(let t of this.listeners)t.onError(e)}emit(e){for(let t of this.listeners)t.onPlan(e)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let e=await this.conn.sendMessagePromise({type:"call_service",domain:pt,service:"get_plan",service_data:{days:Js},return_response:!0});this.emit(e.response)}catch(e){this.fail(es(e))}}async call(e,t){try{await this.conn.sendMessagePromise({type:"call_service",domain:pt,service:e,service_data:t})}catch(s){throw es(s)}this.pushing||await this.refresh()}setRide(e,t,s,i){return this.call("set_ride",{event:e,side:t,driver:s,scope:i})}setStay(e,t,s){return this.call("set_stay",{event:e,stay:t,scope:s})}setArriveBy(e,t,s){return this.call("set_arrive_by",t==null?{event:e,scope:s}:{event:e,time:Qt(t),scope:s})}setTakeAlong(e,t,s){return this.call("set_take_along",{event:e,kids:t,scope:s})}applySuggestion(e){return this.call("apply_suggestion",{suggestion:e})}};var Oe=globalThis,je=Oe.ShadowRoot&&(Oe.ShadyCSS===void 0||Oe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ht=Symbol(),ts=new WeakMap,Te=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ht)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(je&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ts.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ts.set(t,e))}return e}toString(){return this.cssText}},ss=n=>new Te(typeof n=="string"?n:n+"",void 0,ht),ut=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((s,i,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[o+1],n[0]);return new Te(t,n,ht)},ns=(n,e)=>{if(je)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=Oe.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},ft=je?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ss(t)})(n):n;var{is:Qs,defineProperty:Zs,getOwnPropertyDescriptor:en,getOwnPropertyNames:tn,getOwnPropertySymbols:sn,getPrototypeOf:nn}=Object,Ve=globalThis,is=Ve.trustedTypes,rn=is?is.emptyScript:"",on=Ve.reactiveElementPolyfillSupport,Se=(n,e)=>n,gt={toAttribute(n,e){switch(e){case Boolean:n=n?rn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},os=(n,e)=>!Qs(n,e),rs={attribute:!0,type:String,converter:gt,reflect:!1,useDefault:!1,hasChanged:os};Symbol.metadata??=Symbol("metadata"),Ve.litPropertyMetadata??=new WeakMap;var Q=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=rs){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Zs(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:o}=en(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let d=i?.call(this);o?.call(this,a),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??rs}static _$Ei(){if(this.hasOwnProperty(Se("elementProperties")))return;let e=nn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Se("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Se("properties"))){let t=this.properties,s=[...tn(t),...sn(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(ft(i))}else e!==void 0&&t.push(ft(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ns(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:gt).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:gt;this._$Em=i;let d=a.fromAttribute(t,o.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){if(e!==void 0){let a=this.constructor;if(i===!1&&(o=this[e]),s??=a.getPropertyOptions(e),!((s.hasChanged??os)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},a){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),o!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:a}=o,d=this[i];a!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,o,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[Se("elementProperties")]=new Map,Q[Se("finalized")]=new Map,on?.({ReactiveElement:Q}),(Ve.reactiveElementVersions??=[]).push("2.1.2");var bt=globalThis,as=n=>n,qe=bt.trustedTypes,ls=qe?qe.createPolicy("lit-html",{createHTML:n=>n}):void 0,vt="$lit$",Z=`lit$${Math.random().toFixed(9).slice(2)}$`,xt="?"+Z,an=`<${xt}>`,ce=document,Me=()=>ce.createComment(""),Ce=n=>n===null||typeof n!="object"&&typeof n!="function",yt=Array.isArray,fs=n=>yt(n)||typeof n?.[Symbol.iterator]=="function",mt=`[ 	
\f\r]`,Pe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ds=/-->/g,cs=/>/g,le=RegExp(`>|${mt}(?:([^\\s"'>=/]+)(${mt}*=${mt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ps=/'/g,hs=/"/g,gs=/^(?:script|style|textarea|title)$/i,$t=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),h=$t(1),Je=$t(2),ci=$t(3),ee=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),us=new WeakMap,de=ce.createTreeWalker(ce,129);function ms(n,e){if(!yt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ls!==void 0?ls.createHTML(e):e}var bs=(n,e)=>{let t=n.length-1,s=[],i,o=e===2?"<svg>":e===3?"<math>":"",a=Pe;for(let d=0;d<t;d++){let r=n[d],l,x,p=-1,m=0;for(;m<r.length&&(a.lastIndex=m,x=a.exec(r),x!==null);)m=a.lastIndex,a===Pe?x[1]==="!--"?a=ds:x[1]!==void 0?a=cs:x[2]!==void 0?(gs.test(x[2])&&(i=RegExp("</"+x[2],"g")),a=le):x[3]!==void 0&&(a=le):a===le?x[0]===">"?(a=i??Pe,p=-1):x[1]===void 0?p=-2:(p=a.lastIndex-x[2].length,l=x[1],a=x[3]===void 0?le:x[3]==='"'?hs:ps):a===hs||a===ps?a=le:a===ds||a===cs?a=Pe:(a=le,i=void 0);let b=a===le&&n[d+1].startsWith("/>")?" ":"";o+=a===Pe?r+an:p>=0?(s.push(l),r.slice(0,p)+vt+r.slice(p)+Z+b):r+Z+(p===-2?d:b)}return[ms(n,o+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},Re=class n{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,a=0,d=e.length-1,r=this.parts,[l,x]=bs(e,t);if(this.el=n.createElement(l,s),de.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=de.nextNode())!==null&&r.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(vt)){let m=x[a++],b=i.getAttribute(p).split(Z),u=/([.?@])?(.*)/.exec(m);r.push({type:1,index:o,name:u[2],strings:b,ctor:u[1]==="."?Ke:u[1]==="?"?Fe:u[1]==="@"?Ye:he}),i.removeAttribute(p)}else p.startsWith(Z)&&(r.push({type:6,index:o}),i.removeAttribute(p));if(gs.test(i.tagName)){let p=i.textContent.split(Z),m=p.length-1;if(m>0){i.textContent=qe?qe.emptyScript:"";for(let b=0;b<m;b++)i.append(p[b],Me()),de.nextNode(),r.push({type:2,index:++o});i.append(p[m],Me())}}}else if(i.nodeType===8)if(i.data===xt)r.push({type:2,index:o});else{let p=-1;for(;(p=i.data.indexOf(Z,p+1))!==-1;)r.push({type:7,index:o}),p+=Z.length-1}o++}}static createElement(e,t){let s=ce.createElement("template");return s.innerHTML=e,s}};function pe(n,e,t=n,s){if(e===ee)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,o=Ce(e)?void 0:e._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=pe(n,i._$AS(n,e.values),i,s)),e}var We=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??ce).importNode(t,!0);de.currentNode=i;let o=de.nextNode(),a=0,d=0,r=s[0];for(;r!==void 0;){if(a===r.index){let l;r.type===2?l=new be(o,o.nextSibling,this,e):r.type===1?l=new r.ctor(o,r.name,r.strings,this,e):r.type===6&&(l=new Ge(o,this,e)),this._$AV.push(l),r=s[++d]}a!==r?.index&&(o=de.nextNode(),a++)}return de.currentNode=ce,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},be=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=pe(this,e,t),Ce(e)?e===y||e==null||e===""?(this._$AH!==y&&this._$AR(),this._$AH=y):e!==this._$AH&&e!==ee&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):fs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==y&&Ce(this._$AH)?this._$AA.nextSibling.data=e:this.T(ce.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Re.createElement(ms(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let o=new We(i,this),a=o.u(this.options);o.p(t),this.T(a),this._$AH=o}}_$AC(e){let t=us.get(e.strings);return t===void 0&&us.set(e.strings,t=new Re(e)),t}k(e){yt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let o of e)i===t.length?t.push(s=new n(this.O(Me()),this.O(Me()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=as(e).nextSibling;as(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},he=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=y,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=y}_$AI(e,t=this,s,i){let o=this.strings,a=!1;if(o===void 0)e=pe(this,e,t,0),a=!Ce(e)||e!==this._$AH&&e!==ee,a&&(this._$AH=e);else{let d=e,r,l;for(e=o[0],r=0;r<o.length-1;r++)l=pe(this,d[s+r],t,r),l===ee&&(l=this._$AH[r]),a||=!Ce(l)||l!==this._$AH[r],l===y?e=y:e!==y&&(e+=(l??"")+o[r+1]),this._$AH[r]=l}a&&!i&&this.j(e)}j(e){e===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ke=class extends he{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===y?void 0:e}},Fe=class extends he{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==y)}},Ye=class extends he{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){if((e=pe(this,e,t,0)??y)===ee)return;let s=this._$AH,i=e===y&&s!==y||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==y&&(s===y||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ge=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){pe(this,e)}},vs={M:vt,P:Z,A:xt,C:1,L:bs,R:We,D:fs,V:pe,I:be,H:he,N:Fe,U:Ye,B:Ke,F:Ge},ln=bt.litHtmlPolyfillSupport;ln?.(Re,be),(bt.litHtmlVersions??=[]).push("3.3.3");var xs=(n,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let o=t?.renderBefore??null;s._$litPart$=i=new be(e.insertBefore(Me(),o),o,void 0,t??{})}return i._$AI(n),i};var wt=globalThis,re=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=xs(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ee}};re._$litElement$=!0,re.finalized=!0,wt.litElementHydrateSupport?.({LitElement:re});var dn=wt.litElementPolyfillSupport;dn?.({LitElement:re});(wt.litElementVersions??=[]).push("4.2.2");var ys={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},$s=n=>(...e)=>({_$litDirective$:n,values:e}),Xe=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:cn}=vs,ws=n=>n;var ks=()=>document.createComment(""),ve=(n,e,t)=>{let s=n._$AA.parentNode,i=e===void 0?n._$AB:e._$AA;if(t===void 0){let o=s.insertBefore(ks(),i),a=s.insertBefore(ks(),i);t=new cn(o,a,n,n.options)}else{let o=t._$AB.nextSibling,a=t._$AM,d=a!==n;if(d){let r;t._$AQ?.(n),t._$AM=n,t._$AP!==void 0&&(r=n._$AU)!==a._$AU&&t._$AP(r)}if(o!==i||d){let r=t._$AA;for(;r!==o;){let l=ws(r).nextSibling;ws(s).insertBefore(r,i),r=l}}}return t},oe=(n,e,t=n)=>(n._$AI(e,t),n),pn={},_s=(n,e=pn)=>n._$AH=e,As=n=>n._$AH,Qe=n=>{n._$AR(),n._$AA.remove()};var Es=(n,e,t)=>{let s=new Map;for(let i=e;i<=t;i++)s.set(n[i],i);return s},G=$s(class extends Xe{constructor(n){if(super(n),n.type!==ys.CHILD)throw Error("repeat() can only be used in text expressions")}dt(n,e,t){let s;t===void 0?t=e:e!==void 0&&(s=e);let i=[],o=[],a=0;for(let d of n)i[a]=s?s(d,a):a,o[a]=t(d,a),a++;return{values:o,keys:i}}render(n,e,t){return this.dt(n,e,t).values}update(n,[e,t,s]){let i=As(n),{values:o,keys:a}=this.dt(e,t,s);if(!Array.isArray(i))return this.ut=a,o;let d=this.ut??=[],r=[],l,x,p=0,m=i.length-1,b=0,u=o.length-1;for(;p<=m&&b<=u;)if(i[p]===null)p++;else if(i[m]===null)m--;else if(d[p]===a[b])r[b]=oe(i[p],o[b]),p++,b++;else if(d[m]===a[u])r[u]=oe(i[m],o[u]),m--,u--;else if(d[p]===a[u])r[u]=oe(i[p],o[u]),ve(n,r[u+1],i[p]),p++,u--;else if(d[m]===a[b])r[b]=oe(i[m],o[b]),ve(n,i[p],i[m]),m--,b++;else if(l===void 0&&(l=Es(a,b,u),x=Es(d,p,m)),l.has(d[p]))if(l.has(d[m])){let E=x.get(a[b]),$=E!==void 0?i[E]:null;if($===null){let C=ve(n,i[p]);oe(C,o[b]),r[b]=C}else r[b]=oe($,o[b]),ve(n,i[p],$),i[E]=null;b++}else Qe(i[m]),m--;else Qe(i[p]),p++;for(;b<=u;){let E=ve(n,r[u+1]);oe(E,o[b]),r[b++]=E}for(;p<=m;){let E=i[p++];E!==null&&Qe(E)}return this.ut=a,_s(n,r),ee}});var Ze=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function te(n){return Ze[(n%Ze.length+Ze.length)%Ze.length]}var Ts="#23272E";var hn=3,nt=36,kt=12,un=8,At=60,Et=10,et=30,Tt=10,fn=150,gn=200,st=1.4;function mn(n,e){let t=Math.max(fn,gn/st);return Math.ceil(At+Math.max(0,n-1)*Et+et+Math.max(0,e-1)*Tt+t*(n+st*e))}function xe(n){return n.people?n.people.kids.map(e=>e.id):n.days.length?Object.keys(n.days[0].kids):[]}function De(n){return n.people?n.people.drivers.map(e=>e.id):n.days.length?Object.keys(n.days[0].drivers):[]}function it(n){return new Map(xe(n).map((e,t)=>[e,te(t)]))}function se(n,e){let t=n.people?.kids.find(s=>s.id===e);if(t)return t.name;for(let s of n.days)if(s.kids[e])return s.kids[e].name;return e}function rt(n,e){let t=n.people?.drivers.find(s=>s.id===e);if(t)return t.name;for(let s of n.days)if(s.drivers[e])return s.drivers[e].name;return e}function St(n,e){return e==="none"?"Not needed":De(n).includes(e)?rt(n,e):e}function bn(n){let e=new Map([["home","Home"]]);for(let t of n.days)for(let s of t.events)e.set(s.place,s.short_place||s.place_name||s.place);return e}function tt(n,e){return e?n.get(e)??(e.split(",")[0]?.trim()||e):""}function _t(n,e){let t=[];for(let s of n)s.type==="drive"?(t.length||t.push(tt(e,s.from)),t.push(tt(e,s.to))):(s.type==="wait"||s.type==="stay")&&(t.length||t.push(tt(e,s.place)),s.type==="wait"&&!t[t.length-1].endsWith("(wait)")&&(t[t.length-1]+=" (wait)"));return t}function vn(n){let e=n.map(a=>({...a,col:0,cols:1})).sort((a,d)=>a.s-d.s||d.en-a.en),t=[],s=[],i=-1/0,o=()=>{for(let a of t)a.cols=s.length;t=[],s=[]};for(let a of e){a.s>=i&&(o(),i=-1/0);let d=s.findIndex(r=>r<=a.s);d<0?(d=s.length,s.push(a.en)):s[d]=a.en,a.col=d,t.push(a),i=Math.max(i,a.en)}return o(),e}function xn(n,e){if(!n.length)return 0;if(e<=n[0].t)return n[0].y;for(let t=0;t<n.length-1;t++){let s=n[t],i=n[t+1];if(e<=i.t)return i.t===s.t?s.y:Math.round(s.y+(e-s.t)/(i.t-s.t)*(i.y-s.y))}return n[n.length-1].y}function yn(n,e){if(!n.length)return 0;if(e<=n[0].y)return n[0].t;for(let t=0;t<n.length-1;t++){let s=n[t],i=n[t+1];if(e<=i.y)return i.y===s.y?s.t:s.t+(e-s.y)/(i.y-s.y)*(i.t-s.t)}return n[n.length-1].t}function Ps(n,e){return xn(n.anchors,e)}function Ms(n,e){return yn(n.anchors,e)}function $n(n,e){let t=xe(n),s=De(n),i=Math.max(e,mn(t.length,s.length)),a=(i-At-Math.max(0,t.length-1)*Et-et-Math.max(0,s.length-1)*Tt)/(t.length+st*s.length||1),d=Math.floor(a),r=Math.floor(a*st),l=new Map;for(let u of n.days)for(let E of u.events){let $=l.get(E.kid)??[];$.some(C=>C.event_id===E.event_id&&C.calendar_id===E.calendar_id)||$.push(E),l.set(E.kid,$)}let x=it(n),p=[],m=At;t.forEach((u,E)=>{let $=l.get(u)??[],C=n.days.some(f=>f.events.some(V=>V.kid===u&&(V.sides.includes("drop")&&V.drop===""||V.sides.includes("pick")&&V.pick==="")));p.push({id:u,kind:"kid",x:m,w:d,name:se(n,u),dot:x.get(u).color,sub:`${$.length} this week${C?" · needs a ride":""}`,subWarn:C}),m+=d+(E<t.length-1?Et:0)});let b=m+et/2;return m+=et,s.forEach((u,E)=>{let $=0,C=0;for(let f of n.days){let V=f.drivers[u];V&&($+=V.outings.length,C+=V.drive??0)}p.push({id:u,kind:"driver",x:m,w:r,name:rt(n,u),dot:Ts,sub:`${$} ${$===1?"trip":"trips"} this week · ${Xt(C)} driving`,subWarn:!1}),m+=r+(E<s.length-1?Tt:0)}),{columns:p,sepX:b,width:i}}function wn(n){return n.issues.filter(e=>e.level==="problem").length+n.clashes.length}function kn(n,e){let t=ct(e,n);return t===0?"Today":t===1?"Tomorrow":""}function j(n,e=0){return n==null||!Number.isFinite(n)?e:n}function Ss(n,e,t=7){let s=Math.max(8,Math.floor(e/t)),i=1,o=0;for(let a of n.split(/\s+/).filter(Boolean)){let d=a.length;for(o===0?o=d:o+1+d<=s?o+=1+d:(i++,o=d);o>s;)i++,o-=s}return i}function _n(n,e){let t=e-21,s=`${w(n.start)}–${w(n.end)}`+(n.arrive_by!=null?` · arrive ${w(n.arrive_by)}`:""),i=33+Ss(s,t,6.6)*16;for(let o of[n.lines.drop,n.lines.pick])o&&(i+=2+Ss(o.text,t,7)*16);return i+4}function Cs(n,e,t,s){let i=e==="compact",{columns:o,sepX:a,width:d}=$n(n,t),r=new Map(o.map(f=>[f.id,f])),l=xe(n),x=De(n),p=[...l,...x],m=it(n),b=bn(n),u=f=>se(n,f),E=f=>rt(n,f),$={mode:e,width:d,height:0,columns:o,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},C=0;return n.days.forEach((f,V)=>{let J=V*1440,q=new Map(f.events.map(c=>[c.id,c])),W=c=>c&&q.has(c)?{day:f.date,event:c}:null,ue=wn(f),fe=f.events.length,T=kn(f.date,s.date);$.dayHeads.push({date:f.date,y:C,label:Ae(f.date)+(T?` · ${T}`:""),sub:(fe?`${fe} ${fe===1?"activity":"activities"}`:"Nothing scheduled")+(ue?` · ${ue} to sort out`:""),warn:ue>0}),$.anchors.push({t:J,y:C});let K=C+nt+kt,D=x.flatMap(c=>f.drivers[c]?.outings??[]);if(!fe&&!D.length){$.empties.push({key:f.date,y:K,text:"No activities or rides"}),C=K+40,$.anchors.push({t:J+1439,y:C});return}let ne=(c,_,k,S,A,P,v)=>{let z=m.get(c.kid)??te(0),U=c.lines;return{key:`${f.date}|card|${c.id}`,x:_,y:k,w:S,h:A,target:{day:f.date,event:c.id},event:c,color:z,kidName:u(c.kid),clash:P,stayed:c.stay&&x.includes(c.drop),time:`${w(c.start)}–${w(c.end)}`+(c.arrive_by!=null?` · arrive ${w(c.arrive_by)}`:""),drop:U.drop,pick:U.pick,showDrop:!!U.drop&&(v||A>=56),showPick:!!U.pick&&(v||A>=74),wrap:v,aria:`${u(c.kid)}, ${c.title} ${w(c.start)} to ${w(c.end)}. `+[U.drop,U.pick].filter(X=>!!X).map(X=>X.text).join(". ")}},ye=c=>{let _=f.rides[c];return _?(f.drivers[_.driver]?.segments??[]).filter(S=>S.type!=="home"&&S.kids.includes(_.kid)&&j(S.start)>=j(_.start)&&j(S.end)<=j(_.end)):[]},$e=c=>{let _=f.rides[c];if(!_)return null;let k=_.serves.find(S=>q.get(S)?.kid===_.kid);return W(k??_.serves[0])},M=new Map;for(let c of f.issues)c.level!=="problem"||!c.event||(c.kind==="late"&&M.set(c.event,`${Math.round(j(c.minutes))} min late`),c.kind==="waiting"&&M.set(`${c.event}|pick`,`Waits ${Math.round(j(c.minutes))} min`));if(!i){let c=1/0,_=-1/0;for(let v of f.events)c=Math.min(c,v.start-20,v.arrive_by!=null?v.arrive_by-10:1/0),_=Math.max(_,v.end+20);for(let v of D)v.start!=null&&(c=Math.min(c,v.start)),v.end!=null&&(_=Math.max(_,v.end));f.date===s.date&&Number.isFinite(c)&&s.minutes>c-60&&s.minutes<_&&(c=Math.min(c,s.minutes-15));let k=Number.isFinite(c)?Math.floor((c-5)/30)*30:900,S=Number.isFinite(_)?Math.ceil((_+5)/30)*30:960,A=v=>Math.round(K+(Math.max(k,Math.min(S,v))-k)*hn);$.anchors.push({t:J+k,y:A(k)},{t:J+S,y:A(S)});for(let v of l){let z=r.get(v),U=m.get(v),X=(f.kids[v]?.items??[]).filter(R=>R.start!=null&&R.end!=null).map(R=>({item:R,s:j(R.start),en:j(R.end)}));for(let R of vn(X)){let g=z.w/R.cols,L=Math.round(z.x+R.col*g),I=Math.round(g-(R.cols>1?4:0)),B=A(R.s),ie=R.item;if(ie.type==="act"){let O=q.get(ie.event??"");if(!O)continue;let Ct=Math.max(30,A(R.en)-B);if($.cards.push(ne(O,L,B,I,Ct,ie.clash,!1)),O.arrive_by!=null&&O.start-O.arrive_by>=5){let It=A(O.arrive_by);$.preps.push({key:`${f.date}|prep|${O.id}`,x:L,y:It,w:I,h:B-It+6,color:U,label:`Arrive by ${w(O.arrive_by)}`})}let Rt=M.get(O.id);Rt&&$.marks.push({key:`${f.date}|late|${O.id}`,x:L+I-4,y:B+4,text:Rt,right:!0});let Dt=M.get(`${O.id}|pick`);Dt&&$.marks.push({key:`${f.date}|wait|${O.id}`,x:L+4,y:B+Ct+2,text:Dt,right:!1});continue}let H=f.rides[ie.ride??-1];if(!H)continue;let ge=Math.max(22,A(R.en)-B),we=_t(ye(H.index),b),N=E(H.driver);$.rides.push({key:`${f.date}|ride|${H.index}`,x:L,y:B,w:I,h:ge,target:$e(H.index),l1:`${H.own?"In":"Along in"} ${N}’s car`,l2:we.join(" → "),show2:ge>=36,dashed:!H.own,clash:ie.clash,aria:`${u(v)} ${H.own?"in":"riding along in"} ${N}’s car, ${w(j(H.start))} to ${w(j(H.end))}: ${we.join(" to ")}`});let ae=r.get(H.driver);ae&&$.bands.push({key:`${f.date}|band|${H.index}`,x:L+I,y:B,w:Math.max(0,ae.x+8-(L+I)),h:ge,color:U})}}for(let v of x){let z=r.get(v),U=f.drivers[v];if(!U)continue;let X=[],R=null;for(let g of U.segments)if(!(g.start==null||g.end==null)){if(g.type==="home"){R=null;continue}if(g.type==="stay"){R=null,X.push({type:"stay",g,s:g.start,en:g.end});continue}R&&R.en===g.start?(R.en=g.end,R.legs.push(g)):(R={type:"trip",s:g.start,en:g.end,legs:[g]},X.push(R))}for(let g of X){let L=A(g.s),I=Math.max(24,A(g.en)-L);if(g.type==="stay"){let N=q.get(g.g.event??g.g.serves??""),ae=N?m.get(N.kid)??te(0):te(0),O=g.g.kids.map(u);$.stays.push({key:`${f.date}|stay|${v}|${g.s}`,x:z.x+8,y:L,w:z.w-16,h:I,target:W(N?.id),color:ae,l1:N?`At ${N.title} with ${u(N.kid)}`:"Staying",l2:`until ${w(g.en)}`+(O.length?` · ${O.join(" and ")} too`:"")});continue}let B=g.legs[0],ie=g.legs[g.legs.length-1],H=[];for(let N of g.legs)for(let ae of N.kids)H.includes(ae)||H.push(ae);let ge=ie.type==="drive"&&ie.to==="home",we=_t(g.legs,b);$.trips.push({key:`${f.date}|trip|${v}|${g.s}`,x:z.x+8,y:L,w:z.w-16,h:I,target:W(g.legs.find(N=>N.serves)?.serves),l1:B.type==="drive"&&B.from==="home"?`Leave ${w(g.s)}`:`From ${tt(b,B.from??B.place)} ${w(g.s)}`,l2:we.join(" → "),show2:I>=36,l3:ge?`Home ${w(g.en)}`:"",show3:ge&&I>=62,stops:null,kids:H.map(N=>(m.get(N)??te(0)).color),bad:g.legs.some(N=>N.overlaps_busy),aria:`${E(v)} drives ${we.join(" to ")}, ${w(g.s)} to ${w(g.en)}`})}for(let g of U.segments)if(!(!g.overlaps_busy||g.start==null||g.end==null))for(let L of U.busy){let I=Math.max(g.start,L.start),B=Math.min(g.end,L.end);B<=I||$.overlaps.push({key:`${f.date}|overlap|${v}|${I}`,x:z.x+6,y:A(I)-2,w:z.w-12,h:Math.max(8,A(B)-A(I)+4)})}for(let g of U.busy){if(g.end<=k||g.start>=S)continue;let L=A(g.start),I=A(g.end);$.busy.push({key:`${f.date}|busy|${v}|${g.start}`,x:z.x+1,y:L,w:z.w-2,h:I-L,labelY:8,label:`${g.title} until ${w(g.end)}`})}}let P=-1/0;for(let v=k;v<=S;v+=30)$.grid.push({key:`${f.date}|grid|${v}`,y:A(v),strong:v%60===0}),v%60===0&&A(v)-P>=22&&($.hours.push({key:`${f.date}|hour|${v}`,y:A(v)-8,label:Jt(v)}),P=A(v));f.date===s.date&&s.minutes>k&&s.minutes<S&&($.now={y:A(s.minutes),label:`Now ${w(s.minutes)}`}),C=A(S)+kt;return}let F=[];for(let c of l){let _=r.get(c);for(let k of f.kids[c]?.items??[])if(k.start!=null)if(k.type==="act"){let S=q.get(k.event??"");if(!S)continue;F.push({col:c,s:k.start,h:_n(S,_.w),kind:"act",item:k})}else f.rides[k.ride??-1]?.own||F.push({col:c,s:k.start,h:44,kind:"along",item:k})}for(let c of x){let _=f.drivers[c];if(_){for(let k of _.busy)F.push({col:c,s:k.start,h:32,kind:"busy",busy:k});for(let k of _.outings)k.start!=null&&F.push({col:c,s:k.start,h:30+k.lines.length*16+(k.warn?16:0),kind:"out",out:k})}}F.sort((c,_)=>c.s-_.s||p.indexOf(c.col)-p.indexOf(_.col));let ot=new Map,Mt=K;F.forEach((c,_)=>{let k=ot.get(c.col),S=Math.max(k!=null?k+un:K,Mt);ot.set(c.col,S+c.h),Mt=S,$.anchors.push({t:J+c.s,y:S});let A=r.get(c.col);if(c.kind==="busy")$.busy.push({key:`${f.date}|busy|${c.col}|${_}`,x:A.x+1,y:S,w:A.w-2,h:c.h,labelY:8,label:`${c.busy.title} ${w(c.busy.start)}–${w(c.busy.end)}`});else if(c.kind==="out"){let P=c.out;$.trips.push({key:`${f.date}|trip|${c.col}|${_}`,x:A.x+8,y:S,w:A.w-16,h:c.h,target:W(P.target),l1:P.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...P.lines.map(v=>({text:v,warn:!1})),...P.warn?[{text:P.warn,warn:!0}]:[]],kids:P.kids.map(v=>(m.get(v)??te(0)).color),bad:!!P.warn,aria:`${E(c.col)}: ${P.lead}. ${P.lines.join(". ")}${P.warn?`. ${P.warn}`:""}`})}else if(c.kind==="act"){let P=q.get(c.item.event??"");$.cards.push(ne(P,A.x,S,A.w,c.h,c.item.clash,!0))}else{let P=f.rides[c.item.ride??-1],v=_t(ye(P.index),b),z=E(P.driver);$.rides.push({key:`${f.date}|ride|${P.index}`,x:A.x,y:S,w:A.w,h:c.h,target:$e(P.index),l1:`Along with ${z} ${w(j(P.start))}`,l2:v.join(" → "),show2:!0,dashed:!0,clash:c.item.clash,aria:`${u(c.col)} riding along with ${z}, ${w(j(P.start))} to ${w(j(P.end))}: ${v.join(" to ")}`})}});let at=K;for(let c of ot.values())at=Math.max(at,c);C=at+kt+6,$.anchors.push({t:J+1439,y:C})}),$.height=C,$}var An=2;function Rs(n,e){let t=[],s=0;for(let i of n.days){let o=ct(e,i.date),a=o===0?"":`${me(i.date)} · `,d=new Map(i.events.map(l=>[l.id,l])),r=l=>l&&d.has(l)?{day:i.date,event:l}:null;for(let l of i.issues)l.level==="problem"&&(s++,t.push({key:`${i.date}|${l.key}`,tone:l.kind==="unassigned"?"unassigned":"problem",title:a+l.title,body:l.body,target:r(l.event),suggestions:(l.suggestions??[]).map(x=>({id:x.id,label:x.label,note:x.note}))}));if(i.clashes.forEach((l,x)=>{s++;let p=d.get(l.a.event??""),m=se(n,l.kid),b="";if(l.b.type==="act"){let u=d.get(l.b.event??"");b=p&&u?`${p.title} ${w(p.start)}–${w(p.end)} and ${u.title} ${w(u.start)}–${w(u.end)} overlap.`:""}else{let u=i.rides[l.b.ride??-1];b=p&&u?`${m} is in ${rt(n,u.driver)}’s car ${w(j(l.b.start))}–${w(j(l.b.end))}, during ${p.title}.`:""}t.push({key:`${i.date}|clash|${x}`,tone:"problem",title:`${a}${m} is double-booked`,body:b,target:r(l.a.event),suggestions:[]})}),o>=0&&o<An)for(let l of i.issues)l.level==="heads_up"&&t.push({key:`${i.date}|${l.key}`,tone:"heads_up",title:a+l.title,body:l.body,target:r(l.event),suggestions:[]});for(let l of i.events)l.problems.length&&t.push({key:`${i.date}|notes|${l.id}`,tone:"heads_up",title:`${a}Check the notes on ${se(n,l.kid)}’s ${l.title}`,body:`These lines couldn’t be read: ${l.problems.join("; ")}`,target:r(l.id),suggestions:[]})}return{items:t,problems:s}}var Ds=ut`
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
    gap: 16px;
    min-height: 56px;
  }
  .narrow header {
    flex-wrap: wrap;
    row-gap: 8px;
  }
  .narrow .titles {
    flex-basis: calc(100% - 60px);
  }
  .narrow .controls {
    flex: 1 1 100%;
    justify-content: space-between;
  }
  .titles {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  h1 {
    margin: 0;
    font-size: 32px;
    line-height: 38px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .narrow h1 {
    font-size: 22px;
    line-height: 28px;
  }
  .titles p {
    margin: 0;
    font-size: 16px;
    color: var(--muted);
  }
  .narrow .titles p {
    font-size: 13px;
  }
  .titles .bad {
    color: var(--bad-ink);
    font-weight: 600;
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
  .hint {
    font-size: 14px;
    color: var(--muted);
    text-align: right;
    max-width: 230px;
  }
  .seg {
    display: inline-flex;
    padding: 4px;
    gap: 4px;
    border-radius: 13px;
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
  .seg-btn[aria-pressed="true"] {
    background: var(--ink);
    color: #fff;
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
    height: 60px;
    background: var(--bg);
  }
  .col-head {
    position: absolute;
    top: 0;
    height: 52px;
    padding: 4px 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .col-head .name {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    line-height: 24px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    flex: none;
    display: inline-block;
  }
  .col-head .sub {
    font-size: 12.5px;
    line-height: 17px;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    top: 60px;
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
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    white-space: nowrap;
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
    background: var(--surface);
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
    padding: 6px 9px;
    border-radius: 10px;
    border: 1.5px solid;
    text-align: left;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2px;
  }
  .card.sel {
    box-shadow: 0 0 0 3px var(--ring);
    z-index: 2;
  }
  .card .top {
    display: flex;
    flex-direction: column;
    gap: 1px;
    max-width: 100%;
  }
  .card .title {
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
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
    background: #fff;
    border: 1.5px solid var(--dark);
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
    display: -webkit-box;
    -webkit-line-clamp: 2;
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
    border-radius: 9px;
    border: 0;
    background: var(--dark);
    color: #fff;
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
    width: 9px;
    height: 9px;
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
    height: 2px;
    background: var(--bad);
    opacity: 0.85;
    pointer-events: none;
    z-index: 4;
  }
  .now-label {
    left: 0;
    padding: 1px 5px;
    border-radius: 5px;
    background: var(--bad);
    color: #fff;
    font-size: 11.5px;
    line-height: 16px;
    font-weight: 700;
    pointer-events: none;
    z-index: 4;
  }

  .empty-state,
  .quiet {
    margin: auto;
    max-width: 460px;
    text-align: center;
    color: var(--muted);
    font-size: 15px;
    line-height: 22px;
  }
  .quiet {
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    width: min(460px, 90%);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 18px 20px;
    pointer-events: none;
    z-index: 7;
  }
  .big {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin: 0 0 6px;
  }
  .empty-state p,
  .quiet p {
    margin: 0 0 12px;
  }

  .panel {
    width: 360px;
    flex: none;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 16px;
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
    margin: 0;
    font-size: 15px;
    line-height: 22px;
    color: var(--ok);
    font-weight: 600;
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
`;var Is="mydashlight.rides.mode",En=1100,Tn=700,Sn=3*6e4,Pn=1200;function Mn(){try{return localStorage.getItem(Is)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Cn(n){try{localStorage.setItem(Is,n)}catch{}}var Ie=class extends re{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.scrolledOnce=!1;this.onDown=t=>{if(t.pointerType==="touch"||t.button!==0)return;let s=t.currentTarget;this.drag={el:s,x:t.clientX,y:t.clientY,top:s.scrollTop,left:s.scrollLeft,moved:!1,id:t.pointerId}};this.onMove=t=>{let s=this.drag;if(!s)return;let i=t.clientX-s.x,o=t.clientY-s.y;if(!s.moved){if(Math.abs(i)+Math.abs(o)<6)return;s.moved=!0;try{s.el.setPointerCapture(s.id)}catch{}s.el.classList.add("dragging")}s.el.scrollTop=s.top-o,s.el.scrollLeft=s.left-i};this.onUp=()=>{let t=this.drag;this.drag=null,t&&(t.el.classList.remove("dragging"),t.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=t=>{this.eatClick&&(t.stopPropagation(),t.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.scrollToNow()},Sn))};this.onKey=t=>{t.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=Mn(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{this.tick++},3e4),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.resize?.disconnect(),this.resize=null;for(let t of[this.idleTimer,this.toastTimer,this.arriveTimer])t&&clearTimeout(t);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(t){t.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){if(!(!this.scroller||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let s=this.keepAt;this.keepAt=null,this.scrollToTime(s)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.backend&&(this.stopWatching=this.backend.watch(t=>{this.plan=t,this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},t=>{this.error=t}))}measure(){this.width=this.clientWidth||window.innerWidth;let t=this.scroller;t&&(this.boardWidth=t.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){return this.width>=En}today(){return Ee(this.plan?.time_zone??"UTC")}currentBoard(){let t=this.plan;if(!t)return null;let s=this.today(),i=`${this.mode}|${this.boardWidth}|${s.date}|${s.minutes}`;return(this.board==null||t!==this.boardPlan||i!==this.boardKey)&&(this.board=Cs(t,this.mode,this.boardWidth,s),this.boardPlan=t,this.boardKey=i),this.board}dayIndexOf(t){return this.plan?this.plan.days.findIndex(s=>s.date===t):-1}scrollToTime(t){let s=this.scroller;!s||!this.board||(s.scrollTop=Math.max(0,Ps(this.board,t)-nt-4),this.syncDay())}scrollToNow(){if(!this.plan)return;let t=this.today(),s=Math.max(0,this.dayIndexOf(t.date));this.scrollToTime(s*1440+(this.mode==="timeline"&&s===this.dayIndexOf(t.date)?t.minutes-45:0))}syncDay(){let t=this.scroller;if(!t||!this.board||!this.board.dayHeads.length)return;let s=t.scrollTop,i=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=s+1&&(i=d);let o=this.renderRoot.querySelector(".pinned .label"),a=this.renderRoot.querySelector(".pinned .sub");o&&o.textContent!==i.label&&(o.textContent=i.label),a&&a.textContent!==i.sub&&(a.textContent=i.sub),a?.classList.toggle("warn",i.warn)}setMode(t){if(t===this.mode)return;let s=this.scroller;this.keepAt=s&&this.board?Ms(this.board,s.scrollTop+nt+4):null,this.mode=t,Cn(t)}findEvent(t){let s=this.plan?.days.find(o=>o.date===t.day),i=s?.events.find(o=>o.id===t.event);return s&&i?{day:s,event:i}:null}open(t){t&&(this.flushArrive(),this.sel=t,this.scope="this",this.arriveDraft=void 0)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(t){this.toast=t,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(t,s,i){if(!this.pending){this.pending={key:t,value:s};try{await i()}catch(o){let a=o instanceof Y?o:new Y("error",String(o));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(t,s,i){if(!this.backend)return;let o=this.backend;this.save(`${s}`,i,()=>o.setRide(t.id,s,i,this.scope))}toggleStay(t){if(!this.backend)return;let s=this.backend;this.save("stay",!t.stay,()=>s.setStay(t.id,!t.stay,this.scope))}toggleAlong(t,s){if(!this.backend)return;let i=this.backend,o=t.along.includes(s)?t.along.filter(a=>a!==s):[...t.along,s];this.save("along",o,()=>i.setTakeAlong(t.id,o,this.scope))}nudgeArrive(t,s){let i=this.arriveDraft!==void 0?this.arriveDraft:t.arrive_by,o;s<0?o=(i??t.start)-5:o=i==null||i+5>=t.start?null:i+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Pn)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let t=this.arriveDraft,s=this.sel;if(t===void 0||!s||!this.backend)return;let i=this.findEvent(s);if(!i||i.event.arrive_by===t){this.arriveDraft=void 0;return}let o=this.backend,a=i.event.id,d=this.scope;this.save("arrive",t,()=>o.setArriveBy(a,t,d)).then(()=>{this.arriveDraft=void 0})}apply(t){if(!this.backend)return;let s=this.backend;this.save(`fix|${t}`,t,()=>s.applySuggestion(t))}render(){let t=this.plan,s=this.currentBoard(),i=t?Rs(t,this.today().date):{items:[],problems:0},o=this.wide||this.sheet||!!this.sel;return h`
      <div class="app ${this.wide?"wide":this.width<Tn?"narrow phone":"narrow"}">
        ${this.renderHeader(t,i.problems)} ${this.renderBanner(t)}
        <main>
          <section class="board-area" aria-label="Everyone’s week">${s?this.renderBoard(s):this.renderEmpty()}</section>
          ${o?h`${this.wide?y:h`<div class="backdrop" @click=${()=>this.closePanel()}></div>`}
                <aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
                  ${this.sel&&t?this.renderEditor(t):this.renderAttention(i.items,i.problems)}
                </aside>`:y}
        </main>
        ${this.toast?h`<div class="toast" role="status">${this.toast}</div>`:y}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(t,s){let i=t?.days.length?Zt(t.days[0].date,t.days[t.days.length-1].date):"";this.tick;let o="";if(t){let d=t.time_zone,r=new Date(t.updated);this.error?o=h`<span class="bad">Can’t reach Home Assistant · showing the plan from ${He(r,new Date,d)}</span>`:t.status&&!t.status.ok?o=h`<span class="bad">Couldn’t read Google Calendar${t.status.error?`: ${t.status.error}`:""} · plan from ${He(r,new Date,d)}</span>`:this.backend?.live||(o=`Updated ${He(r,new Date,d)}`)}let a=(d,r,l)=>h`
      <button type="button" class="seg-btn" aria-pressed=${this.mode===d?"true":"false"} @click=${()=>this.setMode(d)}>
        ${l}${r}
      </button>
    `;return h`
      <header>
        ${this.showMenu?h`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Je`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:y}
        <div class="titles">
          <h1>Everyone’s week</h1>
          <p>${i}${i&&o?" · ":""}${o}</p>
        </div>
        <div class="controls">
          ${this.wide?h`<span class="hint">${this.mode==="compact"?"Everything in order, no time scale":"Spacing matches the clock"}</span>`:h`<button type="button" class="attn-btn ${s?"has":""}" @click=${()=>{this.sheet=!0}}>
                Needs attention <span class="count">${s}</span>
              </button>`}
          <div role="group" aria-label="View" class="seg">
            ${a("timeline","Timeline",Je`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`)}
            ${a("compact","Compact",Je`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderBanner(t){let s=t?.unavailable_calendars.length??0;return s?h`<div class="banner" role="status">
      Couldn’t read ${s===1?"one calendar":`${s} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:y}renderEmpty(){return this.error?h`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:h`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(t){let s=this.plan,i=this.sel,o=r=>!!r&&!!i&&r.day===i.day&&r.event===i.event,a=t.dayHeads[0],d=t.width;return h`
      <div
        class="scroller"
        @pointerdown=${this.onDown}
        @pointermove=${this.onMove}
        @pointerup=${this.onUp}
        @pointercancel=${this.onUp}
        @click=${this.onClickCapture}
        @scroll=${()=>this.syncDay()}
      >
        <div class="heads" style="width:${d}px">
          ${t.columns.map(r=>h`<div class="col-head" style="left:${r.x}px;width:${r.w}px">
              <span class="name"><span class="dot" style="background:${r.dot}"></span>${r.name}</span>
              <span class="sub ${r.subWarn?"warn":""}">${r.sub}</span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${d}px">
          <span class="label">${a?.label??""}</span><span class="sub ${a?.warn?"warn":""}">${a?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${d}px;height:${Math.max(t.height+400,600)}px">
          ${t.columns.map(r=>h`<div class="col-bg ${r.kind}" style="left:${r.x}px;width:${r.w}px;height:${Math.max(t.height+392,592)}px"></div>`)}
          <span class="sep" style="left:${t.sepX}px;height:${Math.max(t.height+392,592)}px"></span>
          ${t.dayHeads.map(r=>h`<div class="day-head" style="top:${r.y}px;width:${d}px">
              <span class="label">${r.label}</span><span class="sub ${r.warn?"warn":""}">${r.sub}</span>
            </div>`)}
          ${t.empties.map(r=>h`<span class="empty" style="top:${r.y}px">${r.text}</span>`)}
          ${t.grid.map(r=>h`<div class="grid ${r.strong?"strong":""}" style="top:${r.y}px;width:${d-60}px"></div>`)}
          ${t.hours.map(r=>h`<span class="hour" style="top:${r.y}px">${r.label}</span>`)}
          ${G(t.bands,r=>r.key,r=>h`<div
                class="band"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:rgba(${r.color.rgb},0.10);border-color:rgba(${r.color.rgb},0.45)"
              ></div>`)}
          ${G(t.busy,r=>r.key,r=>h`<div class="busy" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px">
                <span style="top:${r.labelY}px">${r.label}</span>
              </div>`)}
          ${G(t.preps,r=>r.key,r=>h`<div
                class="prep"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:rgba(${r.color.rgb},0.07);color:${r.color.ink}"
              >
                ${r.label}
              </div>`)}
          ${G(t.cards,r=>r.key,r=>{let l=r.color,x=r.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), #fff`:`linear-gradient(rgba(${l.rgb},0.13), rgba(${l.rgb},0.13)), #fff`;return h`<button
                type="button"
                class="card ${r.wrap?"wrap":""} ${o(r.target)?"sel":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:${x};border-color:${r.clash?"var(--bad)":l.color};--ring:${l.color}"
                @click=${()=>this.open(r.target)}
              >
                <span class="top">
                  <span class="title" style="color:${l.ink}">${r.event.title}</span>
                  <span class="time">${r.time}</span>
                  ${r.showDrop&&r.drop?h`<span class="line tone-${r.drop.tone}">${r.drop.text}</span>`:y}
                </span>
                ${r.showPick&&r.pick?h`<span class="line tone-${r.pick.tone}">${r.pick.text}</span>`:y}
              </button>`})}
          ${G(t.rides,r=>r.key,r=>h`<button
                type="button"
                class="ride ${r.dashed?"dashed":""} ${r.clash?"clash":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}</span>${r.show2?h`<span class="l2">${r.l2}</span>`:y}
              </button>`)}
          ${G(t.stays,r=>r.key,r=>h`<button
                type="button"
                class="stay"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:repeating-linear-gradient(135deg, rgba(${r.color.rgb},0.28) 0px, rgba(${r.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1" style="color:${r.color.ink}">${r.l1}</span><span class="l2">${r.l2}</span>
              </button>`)}
          ${G(t.trips,r=>r.key,r=>h`<button
                type="button"
                class="trip ${r.bad?"bad":""} ${r.stops?"list":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}${r.kids.map(l=>h`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${r.show2?h`<span class="l2">${r.l2}</span>`:y}
                ${r.stops?r.stops.map(l=>h`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):y}
                ${r.show3?h`<span class="l3">${r.l3}</span>`:y}
              </button>`)}
          ${G(t.overlaps,r=>r.key,r=>h`<div class="overlap" aria-hidden="true" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`)}
          ${G(t.marks,r=>r.key,r=>h`<span class="mark" style="left:${r.x}px;top:${r.y}px;${r.right?"transform:translateX(-100%)":""}">${r.text}</span>`)}
          ${t.now?h`<div class="now-line" aria-hidden="true" style="top:${t.now.y-1}px;width:${d-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${t.now.y-9}px">${t.now.label}</span>`:y}
        </div>
      </div>
      ${s.days.every(r=>!r.events.length)?h`<div class="quiet" role="status">
            <p class="big">Nothing on the kids’ calendars this week</p>
            <p>Activities on ${xe(s).map(r=>se(s,r)).join(", ")}’s calendars show up here within a minute.</p>
          </div>`:y}
    `}renderAttention(t,s){let i=this.plan;return h`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${s?"bad":"ok"}">${s}</span>
        ${this.wide?y:h`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${i&&!s?h`<p class="all-clear">Every ride is covered and nobody is double-booked.</p>`:y}
      ${t.map(o=>h`<div class="issue ${o.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${o.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${o.target?h`<button type="button" class="issue-title" @click=${()=>this.open(o.target)}>${o.title}</button>`:h`<strong class="issue-title">${o.title}</strong>`}
              <span class="issue-body">${o.body}</span>
            </div>
          </div>
          ${o.suggestions.length?h`<div class="fixes">
                ${o.suggestions.map(a=>h`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(a.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${a.id}`?"Saving…":a.label}</span>
                    <span class="fix-note">${a.note}</span>
                  </button>`)}
              </div>`:y}
        </div>`)}
      ${this.wide?this.renderLegend():y}
    `}renderLegend(){return h`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(t){let s=this.findEvent(this.sel);if(!s)return h``;let{day:i,event:o}=s,a=De(t),r=it(t).get(o.kid)??te(0),l=!!this.pending,x=T=>this.pending?.key===T?this.pending.value:void 0,p=[...t.people?.carpools??[]];for(let T of t.days)for(let K of T.events)for(let D of[K.drop,K.pick])D&&D!=="none"&&!a.includes(D)&&!p.some(ne=>ne.toLowerCase()===D.toLowerCase())&&p.push(D);let m=T=>{if(!o.sides.includes(T))return y;let K=x(T),D=K!==void 0?String(K):T==="drop"?o.drop:o.pick,ne=D&&D!=="none"&&!a.includes(D)?D:"",ye=M=>this.setRide(o,T,D===M?"":M),$e=[...a.map(M=>[M,St(t,M)]),["none","Not needed"]];return h`<div class="field">
        <span class="field-label">${T==="drop"?"Drop-off":"Pick-up"} ${D===""?h`<span class="nobody">· nobody yet</span>`:y}</span>
        <div role="group" aria-label=${T==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${$e.length}, minmax(0, 1fr))">
          ${$e.map(([M,F])=>h`<button type="button" class="choice" aria-pressed=${D===M?"true":"false"} ?disabled=${l} @click=${()=>ye(M)}>
                ${F}
              </button>`)}
        </div>
        ${p.length?h`<div role="group" aria-label=${T==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${p.map(M=>h`<button type="button" class="chip" aria-pressed=${D.toLowerCase()===M.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>ye(M)}>
                    ${M}
                  </button>`)}
            </div>`:y}
        <input
          type="text"
          .value=${ne&&!p.some(M=>M.toLowerCase()===ne.toLowerCase())?ne:""}
          ?disabled=${l}
          aria-label=${T==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${M=>{let F=M.target.value.trim();F&&F!==D&&this.setRide(o,T,F)}}
          @keydown=${M=>{M.key==="Enter"&&M.target.blur()}}
        />
      </div>`},b=x("stay"),u=b!==void 0?!!b:o.stay,E=o.drop===o.pick&&a.includes(o.drop),$=x("along"),C=$!==void 0?$:o.along,f=xe(t).filter(T=>T!==o.kid),V=a.includes(o.drop)&&o.sides.includes("drop"),J=x("arrive"),q=this.arriveDraft!==void 0?this.arriveDraft:J!==void 0?J:o.arrive_by,W=[],ue=T=>T==="none"?"Not needed":St(t,T);o.drop!==""&&W.push(`Drop-off: ${ue(o.drop)}`),o.pick!==""&&W.push(`Pick-up: ${ue(o.pick)}`),o.stay&&W.push("Stay: yes"),o.along.length&&W.push(`Take along: ${o.along.map(T=>se(t,T)).join(", ")}`),o.arrive_by!=null&&W.push(`Arrive by: ${ze(o.arrive_by)}`);let fe=i.date===this.today().date?"":`${me(i.date)} · `;return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${r.color}"></span>${se(t,o.kid)} · ${o.title}</span>
          <span class="ed-meta">${fe}${w(o.start)}–${w(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>
      ${this.pending?h`<p class="saving" role="status">Saving to Google Calendar…</p>`:y}
      ${o.recurring?h`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${me(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:y}
      ${m("drop")} ${m("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${u?"true":"false"} ?disabled=${!E||l} @click=${()=>this.toggleStay(o)}>
          ${E?u?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${V&&f.length?h`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${f.map(T=>h`<button type="button" class="chip" aria-pressed=${C.includes(T)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(o,T)}>
                  ${se(t,T)}
                </button>`)}
            </div>
          </div>`:y}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${q!=null?`${o.start-q} min before it starts`:`Aims for a few minutes before ${w(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${l} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${q!=null?w(q):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${l||q==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${q!=null?h`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:y}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${W.length?W.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?h`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:y}
      <p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>
    `}};Ie.styles=Ds,Ie.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Ie);var Pt="hassTokens";function Rn(){try{let n=localStorage.getItem(Pt);return n?JSON.parse(n):null}catch{return null}}function Ls(n){try{n?localStorage.setItem(Pt,JSON.stringify(n)):localStorage.removeItem(Pt)}catch{}}function Dn(n){let e=document.getElementById("problem");e&&(e.hidden=!1,e.querySelector("p").textContent=n)}async function In(){let n=document.querySelector("mydashlight-board");if(n){n.kiosk=!0;try{let e=await Yt({hassUrl:location.origin,loadTokens:async()=>Rn(),saveTokens:Ls});location.search.includes("auth_callback")&&history.replaceState(null,"",location.pathname);let t=await Gt({auth:e});n.backend=new Ue(t)}catch(e){if(e===2){Ls(null),location.replace(location.pathname);return}Dn(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}}In();
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
