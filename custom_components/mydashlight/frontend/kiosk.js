function Ot(n){return{type:"auth",access_token:n}}function Ht(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function qt(n){let t={type:"subscribe_events"};return n&&(t.event_type=n),t}function ht(n){return{type:"unsubscribe_events",subscription:n}}function jt(){return{type:"ping"}}function Vt(n,t){return{type:"result",success:!1,error:{code:n,message:t}}}function Kt(n){let t={},e=n.split("&");for(let s=0;s<e.length;s++){let i=e[s].split("="),r=decodeURIComponent(i[0]),a=i.length>1?decodeURIComponent(i[1]):void 0;t[r]=a}return t}var Ft=(n,t,e,s)=>{let[i,r,a]=n.split(".",3);return Number(i)>t||Number(i)===t&&(s===void 0?Number(r)>=e:Number(r)>e)||s!==void 0&&Number(i)===t&&Number(r)===e&&Number(a)>=s};var Be=!1,qs="auth_required",js="auth_invalid",Vs="auth_ok";function Gt(n){if(!n.auth)throw 4;let t=n.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,s=t.wsUrl;Be&&console.log("[Auth phase] Initializing",s);function i(r,a,o){Be&&console.log("[Auth Phase] New connection",s);let l=new WebSocket(s),d=!1,u=()=>{if(l.removeEventListener("close",u),d){o(2);return}if(r===0){o(1);return}let b=r===-1?-1:r-1;setTimeout(()=>i(b,a,o),1e3)},p=async b=>{try{t.expired&&await(e||t.refreshAccessToken()),l.send(JSON.stringify(Ot(t.accessToken)))}catch(g){d=g===2,l.close()}},f=async b=>{let g=JSON.parse(b.data);switch(Be&&console.log("[Auth phase] Received",g),g.type){case js:d=!0,l.close();break;case Vs:l.removeEventListener("open",p),l.removeEventListener("message",f),l.removeEventListener("close",u),l.removeEventListener("error",u),l.haVersion=g.ha_version,Ft(l.haVersion,2022,9)&&l.send(JSON.stringify(Ht())),a(l);break;default:Be&&g.type!==qs&&console.warn("[Auth phase] Unhandled message",g)}};l.addEventListener("open",p),l.addEventListener("message",f),l.addEventListener("close",u),l.addEventListener("error",u)}return new Promise((r,a)=>i(n.setupRetry,r,a))}var Pe=!1,Oe=class{constructor(t,e){this._handleMessage=s=>{let i=JSON.parse(s.data);Array.isArray(i)||(i=[i]),i.forEach(r=>{Pe&&console.log("Received",r);let a=this.commands.get(r.id);switch(r.type){case"event":a?a.callback(r.event):(console.warn(`Received event for unknown subscription ${r.id}. Unsubscribing.`),this.sendMessagePromise(ht(r.id)).catch(o=>{Pe&&console.warn(` Error unsubsribing from unknown subscription ${r.id}`,o)}));break;case"result":a&&(r.success?(a.resolve(r.result),"subscribe"in a||this.commands.delete(r.id)):(a.reject(r.error),this.commands.delete(r.id)));break;case"pong":a?(a.resolve(),this.commands.delete(r.id)):console.warn(`Received unknown pong response ${r.id}`);break;default:Pe&&console.warn("Unhandled message",r)}})},this._handleClose=async()=>{let s=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,s.forEach(a=>{"subscribe"in a||a.reject(Vt(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),r=a=>{setTimeout(async()=>{if(!this.closeRequested){Pe&&console.log("Trying to reconnect");try{let o=await i.createSocket(i);this._setSocket(o)}catch(o){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let d of l)d.reject&&d.reject(3)}o===2?this.fireEvent("reconnect-error",o):r(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),r(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(r=>{i.unsubscribe=r,i.resolve()})}));let s=this._queuedMessages;if(s){this._queuedMessages=void 0;for(let i of s)i.resolve()}this.fireEvent("ready")}addEventListener(t,e){let s=this.eventListeners.get(t);s||(s=[],this.eventListeners.set(t,s)),s.push(e)}removeEventListener(t,e){let s=this.eventListeners.get(t);if(!s)return;let i=s.indexOf(e);i!==-1&&s.splice(i,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(s=>s(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,qt(e))}ping(){return this.sendMessagePromise(jt())}sendMessage(t,e){if(!this.connected)throw 3;if(Pe&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,s)=>{if(this._queuedMessages){this._queuedMessages.push({reject:s,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(r){s(r)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:s}),this.sendMessage(t,i)})}async subscribeMessage(t,e,s){if(this._queuedMessages&&await new Promise((r,a)=>{this._queuedMessages.push({resolve:r,reject:a})}),s?.preCheck&&!await s.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((r,a)=>{let o=this._genCmdId();i={resolve:r,reject:a,callback:t,subscribe:s?.resubscribe!==!1?()=>this.subscribeMessage(t,e,s):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(ht(o)),this.commands.delete(o)}},this.commands.set(o,i);try{this.sendMessage(e,o)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var Ws=()=>`${location.protocol}//${location.host}/`,Ks=n=>n*1e3+Date.now();function Fs(){let{protocol:n,host:t,pathname:e,search:s}=location;return`${n}//${t}${e}${s}`}function Ys(n,t,e,s){let i=`${n}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(i+=`&client_id=${encodeURIComponent(t)}`),s&&(i+=`&state=${encodeURIComponent(s)}`),i}function Gs(n,t,e,s){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Ys(n,t,e,s)}async function Qt(n,t,e){let s=typeof location<"u"&&location;if(s&&s.protocol==="https:"){let o=document.createElement("a");if(o.href=n,o.protocol==="http:"&&o.hostname!=="localhost")throw 5}let i=new FormData;t!==null&&i.append("client_id",t),Object.keys(e).forEach(o=>{i.append(o,e[o])});let r=await fetch(`${n}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!r.ok)throw r.status===400||r.status===403?2:new Error("Unable to fetch tokens");let a=await r.json();return a.hassUrl=n,a.clientId=t,a.expires=Ks(a.expires_in),a}function Xt(n,t,e){return Qt(n,t,{code:e,grant_type:"authorization_code"})}function Js(n){return btoa(JSON.stringify(n))}function Xs(n){return JSON.parse(atob(n))}var ut=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await Qt(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function Zt(n={}){let t,e=n.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let s=n.clientId!==void 0?n.clientId:Ws(),i=n.limitHassInstance===!0;if(n.authCode&&e&&(t=await Xt(e,s,n.authCode),n.saveTokens&&n.saveTokens(t)),!t){let r=Kt(location.search.substr(1));if("auth_callback"in r){let a=Xs(r.state);if(i&&(a.hassUrl!==e||a.clientId!==s))throw 6;t=await Xt(a.hassUrl,a.clientId,r.code),n.saveTokens&&n.saveTokens(t)}}if(!t&&n.loadTokens&&(t=await n.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new ut(t,n.saveTokens);if(e===void 0)throw 4;return Gs(e,s,n.redirectUrl||Fs(),Js({hassUrl:e,clientId:s})),new Promise(()=>{})}async function es(n){let t=Object.assign({setupRetry:0,createSocket:Gt},n),e=await t.createSocket(t);return new Oe(e,t)}function $(n){let t=Math.round(n),e=Math.floor(t/60),s=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${s<10?"0":""}${s}`}function Me(n){let t=Math.floor(Math.round(n)/60)%24;return`${$(n)} ${t<12?"AM":"PM"}`}function ts(n){let t=Math.floor(n/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function qe(n){let t=Math.max(0,Math.round(n)),e=Math.floor(t/60),s=t%60;return e?s?`${e} hr ${s} min`:`${e} hr`:`${s} min`}function ss(n){let t=Math.floor(n/60)%24,e=n%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Qs=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Zs=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),en=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function He(n){return new Date(`${n}T12:00:00Z`)}function we(n){let t=He(n);return`${Qs.format(t)}, ${en.format(t)}`}function re(n){return Zs.format(He(n))}function je(n,t){return Math.round((He(t).getTime()-He(n).getTime())/864e5)}function Ce(n,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:n,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Ce("UTC",t)}let s=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${s("year")}-${s("month")}-${s("day")}`,minutes:Number(s("hour"))*60+Number(s("minute"))}}function Ve(n,t,e){let s=Math.floor((t.getTime()-n.getTime())/6e4);if(s<1)return"just now";if(s<60)return`${s} min ago`;let i=Ce(e,n),r=Ce(e,t).date;return i.date===r?`at ${Me(i.minutes)}`:`on ${re(i.date)} at ${Me(i.minutes)}`}var Y=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},gt="mydashlight",tn=7,sn=3e4;function ns(n){if(n instanceof Y)return n;if(n&&typeof n=="object"){let t=n;if(typeof t.message=="string")return new Y(String(t.code??"error"),t.message)}return typeof n=="number"?new Y("connection_lost","Lost the connection to Home Assistant."):new Y("error",String(n))}var We=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new Y("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let s={onPlan:t,onError:e};return this.listeners.add(s),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(s),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},sn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new Y("not_running","MyDashLight isn’t running right now."))},{type:`${gt}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:gt,service:"get_plan",service_data:{days:tn},return_response:!0});this.emit(t.response)}catch(t){this.fail(ns(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:gt,service:t,service_data:e})}catch(s){throw ns(s)}this.pushing||await this.refresh()}setRide(t,e,s,i){return this.call("set_ride",{event:t,side:e,driver:s,scope:i})}setStay(t,e,s){return this.call("set_stay",{event:t,stay:e,scope:s})}setArriveBy(t,e,s){return this.call("set_arrive_by",e==null?{event:t,scope:s}:{event:t,time:ss(e),scope:s})}setTakeAlong(t,e,s){return this.call("set_take_along",{event:t,kids:e,scope:s})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}};var Ke=globalThis,Fe=Ke.ShadowRoot&&(Ke.ShadyCSS===void 0||Ke.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ft=Symbol(),is=new WeakMap,Re=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ft)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Fe&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=is.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&is.set(e,t))}return t}toString(){return this.cssText}},rs=n=>new Re(typeof n=="string"?n:n+"",void 0,ft),bt=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new Re(e,n,ft)},os=(n,t)=>{if(Fe)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=Ke.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},mt=Fe?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return rs(e)})(n):n;var{is:nn,defineProperty:rn,getOwnPropertyDescriptor:on,getOwnPropertyNames:an,getOwnPropertySymbols:ln,getPrototypeOf:dn}=Object,Ye=globalThis,as=Ye.trustedTypes,cn=as?as.emptyScript:"",pn=Ye.reactiveElementPolyfillSupport,De=(n,t)=>n,xt={toAttribute(n,t){switch(t){case Boolean:n=n?cn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ds=(n,t)=>!nn(n,t),ls={attribute:!0,type:String,converter:xt,reflect:!1,useDefault:!1,hasChanged:ds};Symbol.metadata??=Symbol("metadata"),Ye.litPropertyMetadata??=new WeakMap;var ee=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ls){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&rn(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:r}=on(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);r?.call(this,a),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ls}static _$Ei(){if(this.hasOwnProperty(De("elementProperties")))return;let t=dn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(De("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(De("properties"))){let e=this.properties,s=[...an(e),...ln(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(mt(i))}else t!==void 0&&e.push(mt(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return os(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:xt).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:xt;this._$Em=i;let o=a.fromAttribute(e,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){let a=this.constructor;if(i===!1&&(r=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??ds)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),r!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:a}=r,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};ee.elementStyles=[],ee.shadowRootOptions={mode:"open"},ee[De("elementProperties")]=new Map,ee[De("finalized")]=new Map,pn?.({ReactiveElement:ee}),(Ye.reactiveElementVersions??=[]).push("2.1.2");var yt=globalThis,cs=n=>n,Ge=yt.trustedTypes,ps=Ge?Ge.createPolicy("lit-html",{createHTML:n=>n}):void 0,wt="$lit$",te=`lit$${Math.random().toFixed(9).slice(2)}$`,$t="?"+te,hn=`<${$t}>`,ue=document,ze=()=>ue.createComment(""),Ie=n=>n===null||typeof n!="object"&&typeof n!="function",kt=Array.isArray,ms=n=>kt(n)||typeof n?.[Symbol.iterator]=="function",vt=`[ 	
\f\r]`,Ne=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,hs=/-->/g,us=/>/g,pe=RegExp(`>|${vt}(?:([^\\s"'>=/]+)(${vt}*=${vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gs=/'/g,fs=/"/g,xs=/^(?:script|style|textarea|title)$/i,_t=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),h=_t(1),ke=_t(2),xi=_t(3),se=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),bs=new WeakMap,he=ue.createTreeWalker(ue,129);function vs(n,t){if(!kt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ps!==void 0?ps.createHTML(t):t}var ys=(n,t)=>{let e=n.length-1,s=[],i,r=t===2?"<svg>":t===3?"<math>":"",a=Ne;for(let o=0;o<e;o++){let l=n[o],d,u,p=-1,f=0;for(;f<l.length&&(a.lastIndex=f,u=a.exec(l),u!==null);)f=a.lastIndex,a===Ne?u[1]==="!--"?a=hs:u[1]!==void 0?a=us:u[2]!==void 0?(xs.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=pe):u[3]!==void 0&&(a=pe):a===pe?u[0]===">"?(a=i??Ne,p=-1):u[1]===void 0?p=-2:(p=a.lastIndex-u[2].length,d=u[1],a=u[3]===void 0?pe:u[3]==='"'?fs:gs):a===fs||a===gs?a=pe:a===hs||a===us?a=Ne:(a=pe,i=void 0);let b=a===pe&&n[o+1].startsWith("/>")?" ":"";r+=a===Ne?l+hn:p>=0?(s.push(d),l.slice(0,p)+wt+l.slice(p)+te+b):l+te+(p===-2?o:b)}return[vs(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},Le=class n{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,a=0,o=t.length-1,l=this.parts,[d,u]=ys(t,e);if(this.el=n.createElement(d,s),he.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=he.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(wt)){let f=u[a++],b=i.getAttribute(p).split(te),g=/([.?@])?(.*)/.exec(f);l.push({type:1,index:r,name:g[2],strings:b,ctor:g[1]==="."?Xe:g[1]==="?"?Qe:g[1]==="@"?Ze:fe}),i.removeAttribute(p)}else p.startsWith(te)&&(l.push({type:6,index:r}),i.removeAttribute(p));if(xs.test(i.tagName)){let p=i.textContent.split(te),f=p.length-1;if(f>0){i.textContent=Ge?Ge.emptyScript:"";for(let b=0;b<f;b++)i.append(p[b],ze()),he.nextNode(),l.push({type:2,index:++r});i.append(p[f],ze())}}}else if(i.nodeType===8)if(i.data===$t)l.push({type:2,index:r});else{let p=-1;for(;(p=i.data.indexOf(te,p+1))!==-1;)l.push({type:7,index:r}),p+=te.length-1}r++}}static createElement(t,e){let s=ue.createElement("template");return s.innerHTML=t,s}};function ge(n,t,e=n,s){if(t===se)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,r=Ie(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=ge(n,i._$AS(n,t.values),i,s)),t}var Je=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??ue).importNode(e,!0);he.currentNode=i;let r=he.nextNode(),a=0,o=0,l=s[0];for(;l!==void 0;){if(a===l.index){let d;l.type===2?d=new $e(r,r.nextSibling,this,t):l.type===1?d=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(d=new et(r,this,t)),this._$AV.push(d),l=s[++o]}a!==l?.index&&(r=he.nextNode(),a++)}return he.currentNode=ue,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},$e=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ge(this,t,e),Ie(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==se&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ms(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&Ie(this._$AH)?this._$AA.nextSibling.data=t:this.T(ue.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Le.createElement(vs(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new Je(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(t){let e=bs.get(t.strings);return e===void 0&&bs.set(t.strings,e=new Le(t)),e}k(t){kt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let r of t)i===e.length?e.push(s=new n(this.O(ze()),this.O(ze()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=cs(t).nextSibling;cs(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},fe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(t,e=this,s,i){let r=this.strings,a=!1;if(r===void 0)t=ge(this,t,e,0),a=!Ie(t)||t!==this._$AH&&t!==se,a&&(this._$AH=t);else{let o=t,l,d;for(t=r[0],l=0;l<r.length-1;l++)d=ge(this,o[s+l],e,l),d===se&&(d=this._$AH[l]),a||=!Ie(d)||d!==this._$AH[l],d===v?t=v:t!==v&&(t+=(d??"")+r[l+1]),this._$AH[l]=d}a&&!i&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Xe=class extends fe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}},Qe=class extends fe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}},Ze=class extends fe{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=ge(this,t,e,0)??v)===se)return;let s=this._$AH,i=t===v&&s!==v||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},et=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ge(this,t)}},ws={M:wt,P:te,A:$t,C:1,L:ys,R:Je,D:ms,V:ge,I:$e,H:fe,N:Qe,U:Ze,B:Xe,F:et},un=yt.litHtmlPolyfillSupport;un?.(Le,$e),(yt.litHtmlVersions??=[]).push("3.3.3");var $s=(n,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let r=e?.renderBefore??null;s._$litPart$=i=new $e(t.insertBefore(ze(),r),r,void 0,e??{})}return i._$AI(n),i};var At=globalThis,oe=class extends ee{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$s(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return se}};oe._$litElement$=!0,oe.finalized=!0,At.litElementHydrateSupport?.({LitElement:oe});var gn=At.litElementPolyfillSupport;gn?.({LitElement:oe});(At.litElementVersions??=[]).push("4.2.2");var ks={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},_s=n=>(...t)=>({_$litDirective$:n,values:t}),tt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:fn}=ws,As=n=>n;var Ts=()=>document.createComment(""),_e=(n,t,e)=>{let s=n._$AA.parentNode,i=t===void 0?n._$AB:t._$AA;if(e===void 0){let r=s.insertBefore(Ts(),i),a=s.insertBefore(Ts(),i);e=new fn(r,a,n,n.options)}else{let r=e._$AB.nextSibling,a=e._$AM,o=a!==n;if(o){let l;e._$AQ?.(n),e._$AM=n,e._$AP!==void 0&&(l=n._$AU)!==a._$AU&&e._$AP(l)}if(r!==i||o){let l=e._$AA;for(;l!==r;){let d=As(l).nextSibling;As(s).insertBefore(l,i),l=d}}}return e},ae=(n,t,e=n)=>(n._$AI(t,e),n),bn={},Es=(n,t=bn)=>n._$AH=t,Ss=n=>n._$AH,st=n=>{n._$AR(),n._$AA.remove()};var Ps=(n,t,e)=>{let s=new Map;for(let i=t;i<=e;i++)s.set(n[i],i);return s},X=_s(class extends tt{constructor(n){if(super(n),n.type!==ks.CHILD)throw Error("repeat() can only be used in text expressions")}dt(n,t,e){let s;e===void 0?e=t:t!==void 0&&(s=t);let i=[],r=[],a=0;for(let o of n)i[a]=s?s(o,a):a,r[a]=e(o,a),a++;return{values:r,keys:i}}render(n,t,e){return this.dt(n,t,e).values}update(n,[t,e,s]){let i=Ss(n),{values:r,keys:a}=this.dt(t,e,s);if(!Array.isArray(i))return this.ut=a,r;let o=this.ut??=[],l=[],d,u,p=0,f=i.length-1,b=0,g=r.length-1;for(;p<=f&&b<=g;)if(i[p]===null)p++;else if(i[f]===null)f--;else if(o[p]===a[b])l[b]=ae(i[p],r[b]),p++,b++;else if(o[f]===a[g])l[g]=ae(i[f],r[g]),f--,g--;else if(o[p]===a[g])l[g]=ae(i[p],r[g]),_e(n,l[g+1],i[p]),p++,g--;else if(o[f]===a[b])l[b]=ae(i[f],r[b]),_e(n,i[p],i[f]),f--,b++;else if(d===void 0&&(d=Ps(a,b,g),u=Ps(o,p,f)),d.has(o[p]))if(d.has(o[f])){let T=u.get(a[b]),w=T!==void 0?i[T]:null;if(w===null){let C=_e(n,i[p]);ae(C,r[b]),l[b]=C}else l[b]=ae(w,r[b]),_e(n,i[p],w),i[T]=null;b++}else st(i[f]),f--;else st(i[p]),p++;for(;b<=g;){let T=_e(n,l[g+1]);ae(T,r[b]),l[b++]=T}for(;p<=f;){let T=i[p++];T!==null&&st(T)}return this.ut=a,Es(n,l),se}});var nt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function G(n){return nt[(n%nt.length+nt.length)%nt.length]}var Ms="#23272E",Cs="35,39,46";var mn=3,at=36,Tt=12,xn=8,St=60,Pt=10,it=30,Mt=10,vn=150,yn=200,ot=1.4;function Ct(n,t){let e=Math.max(vn,yn/ot);return Math.ceil(St+Math.max(0,n-1)*Pt+it+Math.max(0,t-1)*Mt+e*(n+ot*t))}function be(n){return n.people?n.people.kids.map(t=>t.id):n.days.length?Object.keys(n.days[0].kids):[]}function le(n){return n.people?n.people.drivers.map(t=>t.id):n.days.length?Object.keys(n.days[0].drivers):[]}function me(n){return new Map(be(n).map((t,e)=>[t,G(e)]))}function J(n,t){let e=n.people?.kids.find(s=>s.id===t);if(e)return e.name;for(let s of n.days)if(s.kids[t])return s.kids[t].name;return t}function de(n,t){let e=n.people?.drivers.find(s=>s.id===t);if(e)return e.name;for(let s of n.days)if(s.drivers[t])return s.drivers[t].name;return t}function Rt(n,t){return t==="none"?"Not needed":le(n).includes(t)?de(n,t):t}function wn(n){let t=new Map([["home","Home"]]);for(let e of n.days)for(let s of e.events)t.set(s.place,s.short_place||s.place_name||s.place);return t}function rt(n,t){return t?n.get(t)??(t.split(",")[0]?.trim()||t):""}function Et(n,t){let e=[];for(let s of n)s.type==="drive"?(e.length||e.push(rt(t,s.from)),e.push(rt(t,s.to))):(s.type==="wait"||s.type==="stay")&&(e.length||e.push(rt(t,s.place)),s.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function $n(n){let t=n.map(a=>({...a,col:0,cols:1})).sort((a,o)=>a.s-o.s||o.en-a.en),e=[],s=[],i=-1/0,r=()=>{for(let a of e)a.cols=s.length;e=[],s=[]};for(let a of t){a.s>=i&&(r(),i=-1/0);let o=s.findIndex(l=>l<=a.s);o<0?(o=s.length,s.push(a.en)):s[o]=a.en,a.col=o,e.push(a),i=Math.max(i,a.en)}return r(),t}function kn(n,t){if(!n.length)return 0;if(t<=n[0].t)return n[0].y;for(let e=0;e<n.length-1;e++){let s=n[e],i=n[e+1];if(t<=i.t)return i.t===s.t?s.y:Math.round(s.y+(t-s.t)/(i.t-s.t)*(i.y-s.y))}return n[n.length-1].y}function _n(n,t){if(!n.length)return 0;if(t<=n[0].y)return n[0].t;for(let e=0;e<n.length-1;e++){let s=n[e],i=n[e+1];if(t<=i.y)return i.y===s.y?s.t:s.t+(t-s.y)/(i.y-s.y)*(i.t-s.t)}return n[n.length-1].t}function Ds(n,t){return kn(n.anchors,t)}function Ns(n,t){return _n(n.anchors,t)}function An(n,t){let e=be(n),s=le(n),i=Math.max(t,Ct(e.length,s.length)),a=(i-St-Math.max(0,e.length-1)*Pt-it-Math.max(0,s.length-1)*Mt)/(e.length+ot*s.length||1),o=Math.floor(a),l=Math.floor(a*ot),d=new Map;for(let g of n.days)for(let T of g.events){let w=d.get(T.kid)??[];w.some(C=>C.event_id===T.event_id&&C.calendar_id===T.calendar_id)||w.push(T),d.set(T.kid,w)}let u=me(n),p=[],f=St;e.forEach((g,T)=>{let w=d.get(g)??[],C=n.days.some(m=>m.events.some(j=>j.kid===g&&(j.sides.includes("drop")&&j.drop===""||j.sides.includes("pick")&&j.pick==="")));p.push({id:g,kind:"kid",x:f,w:o,name:J(n,g),dot:u.get(g).color,rgb:u.get(g).rgb,sub:`${C?"Needs a ride · ":""}${w.length} this week`,subWarn:C}),f+=o+(T<e.length-1?Pt:0)});let b=f+it/2;return f+=it,s.forEach((g,T)=>{let w=0,C=0;for(let m of n.days){let j=m.drivers[g];j&&(w+=j.outings.length,C+=j.drive??0)}p.push({id:g,kind:"driver",x:f,w:l,name:de(n,g),dot:Ms,rgb:Cs,sub:`${w} ${w===1?"trip":"trips"} this week · ${qe(C)} driving`,subWarn:!1}),f+=l+(T<s.length-1?Mt:0)}),{columns:p,sepX:b,width:i}}function Tn(n,t){let e=n.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(t.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let a=i.slice(r[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Dt(n){return n.issues.filter(t=>t.level==="problem").length+n.clashes.length}function En(n,t){let e=je(t,n);return e===0?"Today":e===1?"Tomorrow":""}function O(n,t=0){return n==null||!Number.isFinite(n)?t:n}function Rs(n,t,e=7){let s=Math.max(8,Math.floor(t/e)),i=1,r=0;for(let a of n.split(/\s+/).filter(Boolean)){let o=a.length;for(r===0?r=o:r+1+o<=s?r+=1+o:(i++,r=o);r>s;)i++,r-=s}return i}function Sn(n,t){let e=t-23,s=`${$(n.start)}–${$(n.end)}`+(n.arrive_by!=null?` · arrive ${$(n.arrive_by)}`:""),i=33+Rs(s,e,6.6)*16;for(let r of[n.lines.drop,n.lines.pick])r&&(i+=2+Rs(r.text,e,7)*16);return i+4}function zs(n,t,e,s){let i=t==="compact",{columns:r,sepX:a,width:o}=An(n,e),l=new Map(r.map(m=>[m.id,m])),d=be(n),u=le(n),p=[...d,...u],f=me(n),b=wn(n),g=m=>J(n,m),T=m=>de(n,m),w={mode:t,width:o,height:0,columns:r,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},C=0;return n.days.forEach((m,j)=>{let Q=j*1440,V=new Map(m.events.map(c=>[c.id,c])),W=c=>c&&V.has(c)?{day:m.date,event:c}:null,xe=Dt(m),ve=m.events.length,S=En(m.date,s.date);w.dayHeads.push({date:m.date,y:C,label:we(m.date),tag:S,sub:(ve?`${ve} ${ve===1?"activity":"activities"}`:"Nothing scheduled")+(xe?` · ${xe} to sort out`:""),warn:xe>0}),w.anchors.push({t:Q,y:C});let K=C+at+Tt,D=u.flatMap(c=>m.drivers[c]?.outings??[]);if(!ve&&!D.length){w.empties.push({key:m.date,y:K,text:"Nothing planned"}),C=K+40,w.anchors.push({t:Q+1439,y:C});return}let ne=(c,_,k,E,A,P,y)=>{let L=f.get(c.kid)??G(0),H=c.lines;return{key:`${m.date}|card|${c.id}`,x:_,y:k,w:E,h:A,target:{day:m.date,event:c.id},event:c,color:L,kidName:g(c.kid),clash:P,stayed:c.stay&&u.includes(c.drop),title:Tn(c.title,g(c.kid)),time:`${$(c.start)}–${$(c.end)}`+(c.arrive_by!=null?` · arrive ${$(c.arrive_by)}`:""),drop:H.drop,pick:H.pick,showDrop:!!H.drop&&(y||A>=56),showPick:!!H.pick&&(y||A>=74),wrap:y,aria:`${g(c.kid)}, ${c.title} ${$(c.start)} to ${$(c.end)}. `+[H.drop,H.pick].filter(Z=>!!Z).map(Z=>Z.text).join(". ")}},Ae=c=>{let _=m.rides[c];return _?(m.drivers[_.driver]?.segments??[]).filter(E=>E.type!=="home"&&E.kids.includes(_.kid)&&O(E.start)>=O(_.start)&&O(E.end)<=O(_.end)):[]},Te=c=>{let _=m.rides[c];if(!_)return null;let k=_.serves.find(E=>V.get(E)?.kid===_.kid);return W(k??_.serves[0])},M=new Map;for(let c of m.issues)c.level!=="problem"||!c.event||(c.kind==="late"&&M.set(c.event,`${Math.round(O(c.minutes))} min late`),c.kind==="waiting"&&M.set(`${c.event}|pick`,`Waits ${Math.round(O(c.minutes))} min`));if(!i){let c=1/0,_=-1/0;for(let y of m.events)c=Math.min(c,y.start-20,y.arrive_by!=null?y.arrive_by-10:1/0),_=Math.max(_,y.end+20);for(let y of D)y.start!=null&&(c=Math.min(c,y.start)),y.end!=null&&(_=Math.max(_,y.end));m.date===s.date&&Number.isFinite(c)&&s.minutes>c-60&&s.minutes<_&&(c=Math.min(c,s.minutes-15));let k=Number.isFinite(c)?Math.floor((c-5)/30)*30:900,E=Number.isFinite(_)?Math.ceil((_+5)/30)*30:960,A=y=>Math.round(K+(Math.max(k,Math.min(E,y))-k)*mn);w.anchors.push({t:Q+k,y:A(k)},{t:Q+E,y:A(E)});for(let y of d){let L=l.get(y),H=f.get(y),Z=(m.kids[y]?.items??[]).filter(R=>R.start!=null&&R.end!=null).map(R=>({item:R,s:O(R.start),en:O(R.end)}));for(let R of $n(Z)){let x=L.w/R.cols,z=Math.round(L.x+R.col*x),N=Math.round(x-(R.cols>1?4:0)),U=A(R.s),ie=R.item;if(ie.type==="act"){let q=V.get(ie.event??"");if(!q)continue;let It=Math.max(30,A(R.en)-U);if(w.cards.push(ne(q,z,U,N,It,ie.clash,!1)),q.arrive_by!=null&&q.start-q.arrive_by>=5){let Bt=A(q.arrive_by);w.preps.push({key:`${m.date}|prep|${q.id}`,x:z,y:Bt,w:N,h:U-Bt+6,color:H,label:`Arrive by ${$(q.arrive_by)}`})}let Lt=M.get(q.id);Lt&&w.marks.push({key:`${m.date}|late|${q.id}`,x:z+N-4,y:U+4,text:Lt,right:!0});let Ut=M.get(`${q.id}|pick`);Ut&&w.marks.push({key:`${m.date}|wait|${q.id}`,x:z+4,y:U+It+2,text:Ut,right:!1});continue}let B=m.rides[ie.ride??-1];if(!B)continue;let ye=Math.max(22,A(R.en)-U),Ee=Et(Ae(B.index),b),I=T(B.driver);w.rides.push({key:`${m.date}|ride|${B.index}`,x:z,y:U,w:N,h:ye,target:Te(B.index),l1:`${B.own?"In":"Along in"} ${I}’s car`,l2:Ee.join(" → "),show2:ye>=36,dashed:!B.own,clash:ie.clash,aria:`${g(y)} ${B.own?"in":"riding along in"} ${I}’s car, ${$(O(B.start))} to ${$(O(B.end))}: ${Ee.join(" to ")}`});let ce=l.get(B.driver);ce&&w.bands.push({key:`${m.date}|band|${B.index}`,x:z+N,y:U,w:Math.max(0,ce.x+8-(z+N)),h:ye,color:H})}}for(let y of u){let L=l.get(y),H=m.drivers[y];if(!H)continue;let Z=[],R=null;for(let x of H.segments)if(!(x.start==null||x.end==null)){if(x.type==="home"){R=null;continue}if(x.type==="stay"){R=null,Z.push({type:"stay",g:x,s:x.start,en:x.end});continue}R&&R.en===x.start?(R.en=x.end,R.legs.push(x)):(R={type:"trip",s:x.start,en:x.end,legs:[x]},Z.push(R))}for(let x of Z){let z=A(x.s),N=Math.max(24,A(x.en)-z);if(x.type==="stay"){let I=V.get(x.g.event??x.g.serves??""),ce=I?f.get(I.kid)??G(0):G(0),q=x.g.kids.map(g);w.stays.push({key:`${m.date}|stay|${y}|${x.s}`,x:L.x+8,y:z,w:L.w-16,h:N,target:W(I?.id),color:ce,l1:I?`At ${I.title} with ${g(I.kid)}`:"Staying",l2:`until ${$(x.en)}`+(q.length?` · ${q.join(" and ")} too`:"")});continue}let U=x.legs[0],ie=x.legs[x.legs.length-1],B=[];for(let I of x.legs)for(let ce of I.kids)B.includes(ce)||B.push(ce);let ye=ie.type==="drive"&&ie.to==="home",Ee=Et(x.legs,b);w.trips.push({key:`${m.date}|trip|${y}|${x.s}`,x:L.x+8,y:z,w:L.w-16,h:N,target:W(x.legs.find(I=>I.serves)?.serves),l1:U.type==="drive"&&U.from==="home"?`Leave ${$(x.s)}`:`From ${rt(b,U.from??U.place)} ${$(x.s)}`,l2:Ee.join(" → "),show2:N>=36,l3:ye?`Home ${$(x.en)}`:"",show3:ye&&N>=62,stops:null,kids:B.map(I=>(f.get(I)??G(0)).color),bad:x.legs.some(I=>I.overlaps_busy),aria:`${T(y)} drives ${Ee.join(" to ")}, ${$(x.s)} to ${$(x.en)}`})}for(let x of H.segments)if(!(!x.overlaps_busy||x.start==null||x.end==null))for(let z of H.busy){let N=Math.max(x.start,z.start),U=Math.min(x.end,z.end);U<=N||w.overlaps.push({key:`${m.date}|overlap|${y}|${N}`,x:L.x+6,y:A(N)-2,w:L.w-12,h:Math.max(8,A(U)-A(N)+4)})}for(let x of H.busy){if(x.end<=k||x.start>=E)continue;let z=A(x.start),N=A(x.end);w.busy.push({key:`${m.date}|busy|${y}|${x.start}`,x:L.x+1,y:z,w:L.w-2,h:N-z,labelY:8,label:`${x.title} until ${$(x.end)}`})}}let P=-1/0;for(let y=k;y<=E;y+=30)w.grid.push({key:`${m.date}|grid|${y}`,y:A(y),strong:y%60===0}),y%60===0&&A(y)-P>=22&&(w.hours.push({key:`${m.date}|hour|${y}`,y:A(y)-8,label:ts(y)}),P=A(y));m.date===s.date&&s.minutes>k&&s.minutes<E&&(w.now={y:A(s.minutes),label:`Now ${$(s.minutes)}`}),C=A(E)+Tt;return}let F=[];for(let c of d){let _=l.get(c);for(let k of m.kids[c]?.items??[])if(k.start!=null)if(k.type==="act"){let E=V.get(k.event??"");if(!E)continue;F.push({col:c,s:k.start,h:Sn(E,_.w),kind:"act",item:k})}else m.rides[k.ride??-1]?.own||F.push({col:c,s:k.start,h:44,kind:"along",item:k})}for(let c of u){let _=m.drivers[c];if(_){for(let k of _.busy)F.push({col:c,s:k.start,h:32,kind:"busy",busy:k});for(let k of _.outings)k.start!=null&&F.push({col:c,s:k.start,h:30+k.lines.length*16+(k.warn?16:0),kind:"out",out:k})}}F.sort((c,_)=>c.s-_.s||p.indexOf(c.col)-p.indexOf(_.col));let ct=new Map,zt=K;F.forEach((c,_)=>{let k=ct.get(c.col),E=Math.max(k!=null?k+xn:K,zt);ct.set(c.col,E+c.h),zt=E,w.anchors.push({t:Q+c.s,y:E});let A=l.get(c.col);if(c.kind==="busy")w.busy.push({key:`${m.date}|busy|${c.col}|${_}`,x:A.x+1,y:E,w:A.w-2,h:c.h,labelY:8,label:`${c.busy.title} ${$(c.busy.start)}–${$(c.busy.end)}`});else if(c.kind==="out"){let P=c.out;w.trips.push({key:`${m.date}|trip|${c.col}|${_}`,x:A.x+8,y:E,w:A.w-16,h:c.h,target:W(P.target),l1:P.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...P.lines.map(y=>({text:y,warn:!1})),...P.warn?[{text:P.warn,warn:!0}]:[]],kids:P.kids.map(y=>(f.get(y)??G(0)).color),bad:!!P.warn,aria:`${T(c.col)}: ${P.lead}. ${P.lines.join(". ")}${P.warn?`. ${P.warn}`:""}`})}else if(c.kind==="act"){let P=V.get(c.item.event??"");w.cards.push(ne(P,A.x,E,A.w,c.h,c.item.clash,!0))}else{let P=m.rides[c.item.ride??-1],y=Et(Ae(P.index),b),L=T(P.driver);w.rides.push({key:`${m.date}|ride|${P.index}`,x:A.x,y:E,w:A.w,h:c.h,target:Te(P.index),l1:`Along with ${L} ${$(O(P.start))}`,l2:y.join(" → "),show2:!0,dashed:!0,clash:c.item.clash,aria:`${g(c.col)} riding along with ${L}, ${$(O(P.start))} to ${$(O(P.end))}: ${y.join(" to ")}`})}});let pt=K;for(let c of ct.values())pt=Math.max(pt,c);C=pt+Tt+6,w.anchors.push({t:Q+1439,y:C})}),w.height=C,w}function Pn(n){return n.replace(/(\d+\.\d+)(?=\s*min\b)/g,t=>{let e=Math.round(Number(t)*2)/2;return Number.isInteger(e)?String(e):e.toFixed(1)})}var Mn=2;function Is(n,t){let e=[],s=0;for(let i of n.days){let r=je(t,i.date),a=r===0?"":`${re(i.date)} · `,o=new Map(i.events.map(d=>[d.id,d])),l=d=>d&&o.has(d)?{day:i.date,event:d}:null;for(let d of i.issues)d.level==="problem"&&(s++,e.push({key:`${i.date}|${d.key}`,tone:d.kind==="unassigned"?"unassigned":"problem",title:a+d.title,body:d.body,target:l(d.event),suggestions:(d.suggestions??[]).map(u=>({id:u.id,label:u.label,note:Pn(u.note)}))}));if(i.clashes.forEach((d,u)=>{s++;let p=o.get(d.a.event??""),f=J(n,d.kid),b="";if(d.b.type==="act"){let g=o.get(d.b.event??"");b=p&&g?`${p.title} ${$(p.start)}–${$(p.end)} and ${g.title} ${$(g.start)}–${$(g.end)} overlap.`:""}else{let g=i.rides[d.b.ride??-1];b=p&&g?`${f} is in ${de(n,g.driver)}’s car ${$(O(d.b.start))}–${$(O(d.b.end))}, during ${p.title}.`:""}e.push({key:`${i.date}|clash|${u}`,tone:"problem",title:`${a}${f} is double-booked`,body:b,target:l(d.a.event),suggestions:[]})}),r>=0&&r<Mn)for(let d of i.issues)d.level==="heads_up"&&e.push({key:`${i.date}|${d.key}`,tone:"heads_up",title:a+d.title,body:d.body,target:l(d.event),suggestions:[]});for(let d of i.events)d.problems.length&&e.push({key:`${i.date}|notes|${d.id}`,tone:"heads_up",title:`${a}Check the notes on ${J(n,d.kid)}’s ${d.title}`,body:`These lines couldn’t be read: ${d.problems.join("; ")}`,target:l(d.id),suggestions:[]})}return{items:e,problems:s}}function Ls(n,t){let e=me(n),s=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of n.days){let a=je(t.date,r.date);if(!(a<0))for(let o of le(n))for(let l of r.drivers[o]?.outings??[]){if(l.start==null)continue;let d=a*1440+l.start;if(a*1440+O(l.end,l.start)<=t.minutes)continue;let p=d-t.minutes,f={driver:o,name:de(n,o),date:r.date,ahead:a,start:l.start,inMinutes:p,ongoing:p<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(b=>e.get(b)??G(0)),warn:l.warn,target:l.target&&r.events.some(b=>b.id===l.target)?{day:r.date,event:l.target}:null};(!s||i(f)<i(s)||i(f)===i(s)&&f.inMinutes<s.inMinutes)&&(s=f)}}return s}var Us=bt`
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
    height: 60px;
    background: var(--bg);
  }
  .col-head {
    position: absolute;
    top: 0;
    height: 54px;
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
`;var Bs="mydashlight.rides.mode",Cn=1100,Rn=440,Dn=700,Nn=3*6e4,zn=1200;function In(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}function lt(n){let t=/\p{L}|\p{N}/u.exec(n);return t?t[0].toUpperCase():"?"}function Ln(n){let t=n.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Un(){try{return localStorage.getItem(Bs)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Bn(n){try{localStorage.setItem(Bs,n)}catch{}}function dt(n){return n.days.every(t=>!t.events.length)}var Ue=class extends oe{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.boardPlan=null;this.boardKey="";this.keepAt=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let s=e.currentTarget;this.drag={el:s,x:e.clientX,y:e.clientY,top:s.scrollTop,left:s.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let s=this.drag;if(!s)return;let i=e.clientX-s.x,r=e.clientY-s.y;if(!s.moved){if(Math.abs(i)+Math.abs(r)<6)return;s.moved=!0;try{s.el.setPointerCapture(s.id)}catch{}s.el.classList.add("dragging")}s.el.scrollTop=s.top-r,s.el.scrollLeft=s.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.scrollToNow()},Nn))};this.onKey=e=>{e.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=Un(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),s=`${e.date}|${e.minutes}`;s!==this.minuteKey&&(this.minuteKey=s,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){if(!(!this.scroller||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let s=this.keepAt;this.keepAt=null,this.scrollToTime(s)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.backend&&(this.stopWatching=this.backend.watch(e=>{this.plan=e,this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Cn)return!1;let e=this.plan;return!e||this.width-Rn>=Ct(be(e).length,le(e).length)}today(){return Ce(this.plan?.time_zone??In())}currentBoard(){let e=this.plan;if(!e)return null;let s=this.today(),i=`${this.mode}|${this.boardWidth}|${s.date}|${s.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=zs(e,this.mode,this.boardWidth,s),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(s=>s.date===e):-1}scrollToTime(e){let s=this.scroller;!s||!this.board||(s.scrollTop=Math.max(0,Ds(this.board,e)-at-4),this.syncDay())}scrollToNow(){if(!this.plan)return;let e=this.today(),s=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(s*1440+(this.mode==="timeline"&&s===this.dayIndexOf(e.date)?e.minutes-45:0))}goToDay(e){let s=this.plan;if(!s)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),a=s.days[r];if(!a)return;let o=1/0;if(this.mode==="timeline"){for(let l of a.events)o=Math.min(o,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let d of l.outings)d.start!=null&&(o=Math.min(o,d.start))}this.scrollToTime(r*1440+(Number.isFinite(o)?Math.max(0,o-30):0))}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let s=e.scrollTop,i=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=s+1&&(i=d);let r=this.renderRoot,a=r.querySelector(".pinned .label"),o=r.querySelector(".pinned .tag"),l=r.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),o&&(o.textContent!==i.tag&&(o.textContent=i.tag),o.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let d of r.querySelectorAll(".day-tile"))d.classList.toggle("in-view",d.dataset.date===i.date)}setMode(e){if(e===this.mode)return;let s=this.scroller;this.keepAt=s&&this.board?Ns(this.board,s.scrollTop+at+4):null,this.mode=e,Bn(e)}findEvent(e){let s=this.plan?.days.find(r=>r.date===e.day),i=s?.events.find(r=>r.id===e.event);return s&&i?{day:s,event:i}:null}open(e){e&&(this.flushArrive(),this.sel=e,this.scope="this",this.arriveDraft=void 0)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,s,i){if(!this.pending){this.pending={key:e,value:s};try{await i()}catch(r){let a=r instanceof Y?r:new Y("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,s,i){if(!this.backend)return;let r=this.backend;this.save(`${s}`,i,()=>r.setRide(e.id,s,i,this.scope))}toggleStay(e){if(!this.backend)return;let s=this.backend;this.save("stay",!e.stay,()=>s.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,s){if(!this.backend)return;let i=this.backend,r=e.along.includes(s)?e.along.filter(a=>a!==s):[...e.along,s];this.save("along",r,()=>i.setTakeAlong(e.id,r,this.scope))}nudgeArrive(e,s){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;s<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),zn)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,s=this.sel;if(e===void 0||!s||!this.backend)return;let i=this.findEvent(s);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,a=i.event.id,o=this.scope;this.save("arrive",e,()=>r.setArriveBy(a,e,o)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let s=this.backend;this.save(`fix|${e}`,e,()=>s.applySuggestion(e))}render(){let e=this.plan,s=this.currentBoard(),i=e?Is(e,this.today().date):{items:[],problems:0},r=this.wide||this.sheet||!!this.sel;return h`
      <div class="app ${this.wide?"wide":this.width<Dn?"narrow phone":"narrow"}">
        ${this.renderHeader(e,i.problems)} ${e?this.renderWeek(e):v} ${this.renderBanner(e)}
        <main>
          <section class="board-area" aria-label="Everyone’s week">
            ${s&&e?dt(e)?this.renderQuiet(e):this.renderBoard(s):this.renderEmpty()}
          </section>
          ${r?h`${this.wide?v:h`<div class="backdrop" @click=${()=>this.closePanel()}></div>`}
                <aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
                  ${this.sel&&e?this.renderEditor(e):this.renderAttention(i.items,i.problems)}
                </aside>`:v}
        </main>
        ${this.toast?h`<div class="toast" role="status">${this.toast}</div>`:v}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(e,s){this.tick;let i=this.today(),r="";if(e){let d=e.time_zone,u=new Date(e.updated);this.error?r=h`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Ve(u,new Date,d)}</span>`:e.status&&!e.status.ok?r=h`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Ve(u,new Date,d)}</span>`:this.backend?.live||(r=`Updated ${Ve(u,new Date,d)}`)}let a=(d,u,p,f)=>h`
      <button type="button" class="seg-btn" title=${f} aria-pressed=${this.mode===d?"true":"false"} @click=${()=>this.setMode(d)}>
        ${p}<span class="seg-label">${u}</span>
      </button>
    `,o=Me(i.minutes),l=!!e&&dt(e);return h`
      <header>
        ${this.showMenu?h`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ke`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:v}
        <div class="titles">
          <h1 class="clock" aria-label=${`${we(i.date)}, ${o}`}>
            <span class="hm">${o.slice(0,-3)}</span><span class="ampm">${o.slice(-2)}</span>
          </h1>
          <p class="today-line">${we(i.date)}</p>
          ${r?h`<p class="status">${r}</p>`:v}
        </div>
        ${e&&!l?this.renderNext(e,Ls(e,i)):v}
        <div class="controls">
          ${this.wide||l?v:h`<button type="button" class="attn-btn ${s?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${s}</span>
              </button>`}
          <div role="group" aria-label="View" class="seg">
            ${a("timeline","Timeline",ke`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${a("compact","Compact",ke`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>
        </div>
      </header>
    `}renderNext(e,s){if(!s){let l=this.today().date,d=e.days.filter(p=>p.date>=l).reduce((p,f)=>p+f.issues.filter(b=>b.level==="problem"&&b.kind==="unassigned").length,0);if(d){let p=h`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${d} ${d===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?h`<div class="next idle needs">${p}</div>`:h`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${p}</button>`}let u=e.days.some(p=>p.date>=l&&p.events.length);return h`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${u?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${u?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let i;s.ongoing?i="On the road now":s.ahead===0?i=s.inMinutes<180?`Next trip · in ${qe(s.inMinutes)}`:"Next trip · later today":s.ahead===1?i="Next trip · tomorrow":i=`Next trip · ${re(s.date)}`;let r=!s.ongoing&&s.ahead===0&&s.inMinutes<=30,a=h`
      <span class="next-eyebrow">${i}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${lt(s.name)}</span>
        <span class="next-lead">${s.name} · ${s.lead}</span>
        <span class="next-kids">${s.kids.map(l=>h`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
      </span>
      ${s.warn?h`<span class="next-stop warn">${s.warn}</span>`:s.stop?h`<span class="next-stop">${s.stop}</span>`:v}
    `,o=`next ${s.ongoing?"ongoing":r?"soon":""}`;return s.target?h`<button type="button" class=${o} @click=${()=>this.open(s.target)}>${a}</button>`:h`<div class=${o}>${a}</div>`}renderWeek(e){let s=this.today().date,i=me(e);return h`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let a=Dt(r),o=r.events.length,l=r.events.slice(0,6).map(u=>i.get(u.kid)?.color??G(0).color),d=`${we(r.date)}: ${o?`${o} ${o===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return h`<button
          type="button"
          class="day-tile ${r.date===s?"today":""}"
          data-date=${r.date}
          aria-label=${d}
          @click=${()=>this.goToDay(r.date)}
        >
          <span class="dt-wd">${r.date===s?"Today":re(r.date)}</span>
          <span class="dt-num">${Number(r.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(u=>h`<span class="dt-dot" style="background:${u}"></span>`):h`<span class="dt-free">free</span>`}
            ${o>6?h`<span class="dt-more">+${o-6}</span>`:v}
          </span>
          ${a?h`<span class="dt-badge" aria-hidden="true">${a}</span>`:v}
        </button>`})}
    </nav>`}renderQuiet(e){let s=be(e),i=le(e),r=me(e),a=s.map(o=>J(e,o));return h`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${s.slice(0,3).map((o,l)=>ke`<circle cx=${50+l*30} cy="80" r="11" fill=${r.get(o).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Ln(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${s.map(o=>{let l=r.get(o);return h`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${lt(J(e,o))}</span>
            <span class="qw-name">${J(e,o)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(o=>h`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${lt(de(e,o))}</span>
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
    </div>`}renderBanner(e){let s=e?.unavailable_calendars.length??0;return s?h`<div class="banner" role="status">
      Couldn’t read ${s===1?"one calendar":`${s} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:v}renderEmpty(){return this.error?h`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:h`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let s=this.sel,i=o=>!!o&&!!s&&o.day===s.day&&o.event===s.event,r=e.dayHeads[0],a=e.width;return h`
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
          ${e.columns.map(o=>h`<div class="col-head ${o.kind}" style="left:${o.x}px;width:${o.w}px;--c:${o.dot};--rgb:${o.rgb}">
              <span class="avatar ${o.kind}" aria-hidden="true">${lt(o.name)}</span>
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
          ${e.columns.map(o=>h`<div
                class="col-bg ${o.kind}"
                style="left:${o.x}px;width:${o.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${o.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(o=>h`<div class="day-head" style="top:${o.y}px;width:${a}px">
              <span class="label">${o.label}</span>${o.tag?h`<span class="tag">${o.tag}</span>`:v}<span
                class="sub ${o.warn?"warn":""}"
                >${o.sub}</span
              >
            </div>`)}
          ${e.empties.map(o=>h`<span class="empty" style="top:${o.y}px">${o.text}</span>`)}
          ${e.grid.map(o=>h`<div class="grid ${o.strong?"strong":""}" style="top:${o.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(o=>h`<span class="hour" style="top:${o.y}px">${o.label}</span>`)}
          ${X(e.bands,o=>o.key,o=>h`<div
                class="band"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:rgba(${o.color.rgb},0.10);border-color:rgba(${o.color.rgb},0.45)"
              ></div>`)}
          ${X(e.busy,o=>o.key,o=>h`<div class="busy" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px">
                <span style="top:${o.labelY}px">${o.label}</span>
              </div>`)}
          ${X(e.preps,o=>o.key,o=>h`<div
                class="prep"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:rgba(${o.color.rgb},0.07);color:${o.color.ink}"
              >
                ${o.label}
              </div>`)}
          ${X(e.cards,o=>o.key,o=>{let l=o.color,d=o.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return h`<button
                type="button"
                class="card ${o.wrap?"wrap":""} ${i(o.target)?"sel":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:${d};border-color:${o.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--ring:${l.color}"
                @click=${()=>this.open(o.target)}
              >
                <span class="top">
                  <span class="title">${o.title}</span>
                  <span class="time">${o.time}</span>
                  ${o.showDrop&&o.drop?h`<span class="line tone-${o.drop.tone}">${o.drop.text}</span>`:v}
                </span>
                ${o.showPick&&o.pick?h`<span class="line tone-${o.pick.tone}">${o.pick.text}</span>`:v}
              </button>`})}
          ${X(e.rides,o=>o.key,o=>h`<button
                type="button"
                class="ride ${o.dashed?"dashed":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}</span>${o.show2?h`<span class="l2">${o.l2}</span>`:v}
              </button>`)}
          ${X(e.stays,o=>o.key,o=>h`<button
                type="button"
                class="stay"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:repeating-linear-gradient(135deg, rgba(${o.color.rgb},0.28) 0px, rgba(${o.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1" style="color:${o.color.ink}">${o.l1}</span><span class="l2">${o.l2}</span>
              </button>`)}
          ${X(e.trips,o=>o.key,o=>h`<button
                type="button"
                class="trip ${o.bad?"bad":""} ${o.stops?"list":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}${o.kids.map(l=>h`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${o.show2?h`<span class="l2">${o.l2}</span>`:v}
                ${o.stops?o.stops.map(l=>h`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):v}
                ${o.show3?h`<span class="l3">${o.l3}</span>`:v}
              </button>`)}
          ${X(e.overlaps,o=>o.key,o=>h`<div class="overlap" aria-hidden="true" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`)}
          ${X(e.marks,o=>o.key,o=>h`<span class="mark" style="left:${o.x}px;top:${o.y}px;${o.right?"transform:translateX(-100%)":""}">${o.text}</span>`)}
          ${e.now?h`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:v}
        </div>
      </div>
    `}renderAttention(e,s){let i=this.plan;return h`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${s?"bad":"ok"}">${s}</span>
        ${this.wide?v:h`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${i&&!s?h`<div class="all-clear">
            <span class="check" aria-hidden="true">${ke`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${dt(i)?"Nothing needs you this week.":"Every ride is covered and nobody is double-booked."}</span>
          </div>`:v}
      ${e.map(r=>h`<div class="issue ${r.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${r.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${r.target?h`<button type="button" class="issue-title" @click=${()=>this.open(r.target)}>${r.title}</button>`:h`<strong class="issue-title">${r.title}</strong>`}
              <span class="issue-body">${r.body}</span>
            </div>
          </div>
          ${r.suggestions.length?h`<div class="fixes">
                ${r.suggestions.map(a=>h`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(a.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${a.id}`?"Saving…":a.label}</span>
                    <span class="fix-note">${a.note}</span>
                  </button>`)}
              </div>`:v}
        </div>`)}
      ${this.wide&&i&&!dt(i)?this.renderLegend():v}
    `}renderLegend(){return h`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let s=this.findEvent(this.sel);if(!s)return h``;let{day:i,event:r}=s,a=le(e),l=me(e).get(r.kid)??G(0),d=!!this.pending,u=S=>this.pending?.key===S?this.pending.value:void 0,p=[...e.people?.carpools??[]];for(let S of e.days)for(let K of S.events)for(let D of[K.drop,K.pick])D&&D!=="none"&&!a.includes(D)&&!p.some(ne=>ne.toLowerCase()===D.toLowerCase())&&p.push(D);let f=S=>{if(!r.sides.includes(S))return v;let K=u(S),D=K!==void 0?String(K):S==="drop"?r.drop:r.pick,ne=D&&D!=="none"&&!a.includes(D)?D:"",Ae=M=>this.setRide(r,S,D===M?"":M),Te=[...a.map(M=>[M,Rt(e,M)]),["none","Not needed"]];return h`<div class="field">
        <span class="field-label">${S==="drop"?"Drop-off":"Pick-up"} ${D===""?h`<span class="nobody">· nobody yet</span>`:v}</span>
        <div role="group" aria-label=${S==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${Te.length}, minmax(0, 1fr))">
          ${Te.map(([M,F])=>h`<button type="button" class="choice" aria-pressed=${D===M?"true":"false"} ?disabled=${d} @click=${()=>Ae(M)}>
                ${F}
              </button>`)}
        </div>
        ${p.length?h`<div role="group" aria-label=${S==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${p.map(M=>h`<button type="button" class="chip" aria-pressed=${D.toLowerCase()===M.toLowerCase()?"true":"false"} ?disabled=${d} @click=${()=>Ae(M)}>
                    ${M}
                  </button>`)}
            </div>`:v}
        <input
          type="text"
          .value=${ne&&!p.some(M=>M.toLowerCase()===ne.toLowerCase())?ne:""}
          ?disabled=${d}
          aria-label=${S==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${M=>{let F=M.target.value.trim();F&&F!==D&&this.setRide(r,S,F)}}
          @keydown=${M=>{M.key==="Enter"&&M.target.blur()}}
        />
      </div>`},b=u("stay"),g=b!==void 0?!!b:r.stay,T=r.drop===r.pick&&a.includes(r.drop),w=u("along"),C=w!==void 0?w:r.along,m=be(e).filter(S=>S!==r.kid),j=a.includes(r.drop)&&r.sides.includes("drop"),Q=u("arrive"),V=this.arriveDraft!==void 0?this.arriveDraft:Q!==void 0?Q:r.arrive_by,W=[],xe=S=>S==="none"?"Not needed":Rt(e,S);r.drop!==""&&W.push(`Drop-off: ${xe(r.drop)}`),r.pick!==""&&W.push(`Pick-up: ${xe(r.pick)}`),r.stay&&W.push("Stay: yes"),r.along.length&&W.push(`Take along: ${r.along.map(S=>J(e,S)).join(", ")}`),r.arrive_by!=null&&W.push(`Arrive by: ${Me(r.arrive_by)}`);let ve=i.date===this.today().date?"":`${re(i.date)} · `;return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${J(e,r.kid)} · ${r.title}</span>
          <span class="ed-meta">${ve}${$(r.start)}–${$(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>
      ${this.pending?h`<p class="saving" role="status">Saving to Google Calendar…</p>`:v}
      ${r.recurring?h`<div class="field">
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
      ${f("drop")} ${f("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${g?"true":"false"} ?disabled=${!T||d} @click=${()=>this.toggleStay(r)}>
          ${T?g?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${j&&m.length?h`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${m.map(S=>h`<button type="button" class="chip" aria-pressed=${C.includes(S)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(r,S)}>
                  ${J(e,S)}
                </button>`)}
            </div>
          </div>`:v}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${V!=null?`${r.start-V} min before it starts`:`Aims for a few minutes before ${$(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${d} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${V!=null?$(V):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${d||V==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${V!=null?h`<button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:v}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${W.length?W.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${r.problems.length?h`<p class="field-hint bad">These lines in the notes couldn’t be read: ${r.problems.join("; ")}</p>`:v}
      <p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>
    `}};Ue.styles=Us,Ue.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Ue);var Nt="hassTokens";function On(){try{let n=localStorage.getItem(Nt);return n?JSON.parse(n):null}catch{return null}}function Os(n){try{n?localStorage.setItem(Nt,JSON.stringify(n)):localStorage.removeItem(Nt)}catch{}}function Hn(n){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=n)}async function qn(){let n=document.querySelector("mydashlight-board");if(n){n.kiosk=!0;try{let t=await Zt({hassUrl:location.origin,loadTokens:async()=>On(),saveTokens:Os});location.search.includes("auth_callback")&&history.replaceState(null,"",location.pathname);let e=await es({auth:t});n.backend=new We(e)}catch(t){if(t===2){Os(null),location.replace(location.pathname);return}Hn(t===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(t)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}}qn();
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
