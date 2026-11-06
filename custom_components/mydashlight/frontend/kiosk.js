function Fn(s){return{type:"auth",access_token:s}}function Vn(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Gn(s){let n={type:"subscribe_events"};return s&&(n.event_type=s),n}function Zt(s){return{type:"unsubscribe_events",subscription:s}}function Yn(){return{type:"ping"}}function Jn(s,n){return{type:"result",success:!1,error:{code:s,message:n}}}function Zn(s){let n={},e=s.split("&");for(let t=0;t<e.length;t++){let i=e[t].split("="),o=decodeURIComponent(i[0]),a=i.length>1?decodeURIComponent(i[1]):void 0;n[o]=a}return n}var Xn=(s,n,e,t)=>{let[i,o,a]=s.split(".",3);return Number(i)>n||Number(i)===n&&(t===void 0?Number(o)>=e:Number(o)>e)||t!==void 0&&Number(i)===n&&Number(o)===e&&Number(a)>=t};var xt=!1,Bi="auth_required",Ni="auth_invalid",Ii="auth_ok";function ts(s){if(!s.auth)throw 4;let n=s.auth,e=n.expired?n.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,t=n.wsUrl;xt&&console.log("[Auth phase] Initializing",t);function i(o,a,r){xt&&console.log("[Auth Phase] New connection",t);let l=new WebSocket(t),c=!1,h=()=>{if(l.removeEventListener("close",h),c){r(2);return}if(o===0){r(1);return}let y=o===-1?-1:o-1;setTimeout(()=>i(y,a,r),1e3)},d=async y=>{try{n.expired&&await(e||n.refreshAccessToken()),l.send(JSON.stringify(Fn(n.accessToken)))}catch(A){c=A===2,l.close()}},f=async y=>{let A=JSON.parse(y.data);switch(xt&&console.log("[Auth phase] Received",A),A.type){case Ni:c=!0,l.close();break;case Ii:l.removeEventListener("open",d),l.removeEventListener("message",f),l.removeEventListener("close",h),l.removeEventListener("error",h),l.haVersion=A.ha_version,Xn(l.haVersion,2022,9)&&l.send(JSON.stringify(Vn())),a(l);break;default:xt&&A.type!==Bi&&console.warn("[Auth phase] Unhandled message",A)}};l.addEventListener("open",d),l.addEventListener("message",f),l.addEventListener("close",h),l.addEventListener("error",h)}return new Promise((o,a)=>i(s.setupRetry,o,a))}var et=!1,vt=class{constructor(n,e){this._handleMessage=t=>{let i=JSON.parse(t.data);Array.isArray(i)||(i=[i]),i.forEach(o=>{et&&console.log("Received",o);let a=this.commands.get(o.id);switch(o.type){case"event":a?a.callback(o.event):(console.warn(`Received event for unknown subscription ${o.id}. Unsubscribing.`),this.sendMessagePromise(Zt(o.id)).catch(r=>{et&&console.warn(` Error unsubsribing from unknown subscription ${o.id}`,r)}));break;case"result":a&&(o.success?(a.resolve(o.result),"subscribe"in a||this.commands.delete(o.id)):(a.reject(o.error),this.commands.delete(o.id)));break;case"pong":a?(a.resolve(),this.commands.delete(o.id)):console.warn(`Received unknown pong response ${o.id}`);break;default:et&&console.warn("Unhandled message",o)}})},this._handleClose=async()=>{let t=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,t.forEach(a=>{"subscribe"in a||a.reject(Jn(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),o=a=>{setTimeout(async()=>{if(!this.closeRequested){et&&console.log("Trying to reconnect");try{let r=await i.createSocket(i);this._setSocket(r)}catch(r){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let c of l)c.reject&&c.reject(3)}r===2?this.fireEvent("reconnect-error",r):o(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),o(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(n)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(n){this.socket=n,this.haVersion=n.haVersion,n.addEventListener("message",this._handleMessage),n.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(o=>{i.unsubscribe=o,i.resolve()})}));let t=this._queuedMessages;if(t){this._queuedMessages=void 0;for(let i of t)i.resolve()}this.fireEvent("ready")}addEventListener(n,e){let t=this.eventListeners.get(n);t||(t=[],this.eventListeners.set(n,t)),t.push(e)}removeEventListener(n,e){let t=this.eventListeners.get(n);if(!t)return;let i=t.indexOf(e);i!==-1&&t.splice(i,1)}fireEvent(n,e){(this.eventListeners.get(n)||[]).forEach(t=>t(this,e))}suspendReconnectUntil(n){this.suspendReconnectPromise=n}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(n=!1){if(this.socket){if(!n){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(n,e){return this.subscribeMessage(n,Gn(e))}ping(){return this.sendMessagePromise(Yn())}sendMessage(n,e){if(!this.connected)throw 3;if(et&&console.log("Sending",n),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(n)});return}e||(e=this._genCmdId()),n.id=e,this.socket.send(JSON.stringify(n))}sendMessagePromise(n){return new Promise((e,t)=>{if(this._queuedMessages){this._queuedMessages.push({reject:t,resolve:async()=>{try{e(await this.sendMessagePromise(n))}catch(o){t(o)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:t}),this.sendMessage(n,i)})}async subscribeMessage(n,e,t){if(this._queuedMessages&&await new Promise((o,a)=>{this._queuedMessages.push({resolve:o,reject:a})}),t?.preCheck&&!await t.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((o,a)=>{let r=this._genCmdId();i={resolve:o,reject:a,callback:n,subscribe:t?.resubscribe!==!1?()=>this.subscribeMessage(n,e,t):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Zt(r)),this.commands.delete(r)}},this.commands.set(r,i);try{this.sendMessage(e,r)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var Oi=()=>`${location.protocol}//${location.host}/`,zi=s=>s*1e3+Date.now();function Ui(){let{protocol:s,host:n,pathname:e,search:t}=location;return`${s}//${n}${e}${t}`}function Hi(s,n,e,t){let i=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return n!==null&&(i+=`&client_id=${encodeURIComponent(n)}`),t&&(i+=`&state=${encodeURIComponent(t)}`),i}function ji(s,n,e,t){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Hi(s,n,e,t)}async function is(s,n,e){let t=typeof location<"u"&&location;if(t&&t.protocol==="https:"){let r=document.createElement("a");if(r.href=s,r.protocol==="http:"&&r.hostname!=="localhost")throw 5}let i=new FormData;n!==null&&i.append("client_id",n),Object.keys(e).forEach(r=>{i.append(r,e[r])});let o=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!o.ok)throw o.status===400||o.status===403?2:new Error("Unable to fetch tokens");let a=await o.json();return a.hassUrl=s,a.clientId=n,a.expires=zi(a.expires_in),a}function ss(s,n,e){return is(s,n,{code:e,grant_type:"authorization_code"})}function qi(s){return btoa(JSON.stringify(s))}function Ki(s){return JSON.parse(atob(s))}var Xt=class{constructor(n,e){this.data=n,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let n=await is(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});n.refresh_token=this.data.refresh_token,this.data=n,this._saveTokens&&this._saveTokens(n)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let n=new FormData;n.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:n}),this._saveTokens&&this._saveTokens(null)}};async function rs(s={}){let n,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let t=s.clientId!==void 0?s.clientId:Oi(),i=s.limitHassInstance===!0;if(s.authCode&&e&&(n=await ss(e,t,s.authCode),s.saveTokens&&s.saveTokens(n)),!n){let o=Zn(location.search.substr(1));if("auth_callback"in o){let a=Ki(o.state);if(i&&(a.hassUrl!==e||a.clientId!==t))throw 6;n=await ss(a.hassUrl,a.clientId,o.code),s.saveTokens&&s.saveTokens(n)}}if(!n&&s.loadTokens&&(n=await s.loadTokens()),n&&(e===void 0||n.hassUrl===e))return new Xt(n,s.saveTokens);if(e===void 0)throw 4;return ji(e,t,s.redirectUrl||Ui(),qi({hassUrl:e,clientId:t})),new Promise(()=>{})}async function os(s){let n=Object.assign({setupRetry:0,createSocket:ts},s),e=await n.createSocket(n);return new vt(e,n)}function R(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function tt(s){let n=Math.floor(Math.round(s)/60)%24;return`${R(s)} ${n<12?"AM":"PM"}`}function as(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function st(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function ls(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Wi=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Fi=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Vi=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function yt(s){return new Date(`${s}T12:00:00Z`)}function be(s){let n=yt(s);return`${Wi.format(n)}, ${Vi.format(n)}`}function ce(s){return Fi.format(yt(s))}function xe(s,n){return Math.round((yt(n).getTime()-yt(s).getTime())/864e5)}function nt(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return nt("UTC",n)}let t=i=>e.find(o=>o.type===i)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function wt(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let i=nt(e,s),o=nt(e,n).date;return i.date===o?`at ${tt(i.minutes)}`:`on ${ce(i.date)} at ${tt(i.minutes)}`}var G=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}},Le="mydashlight",Gi=7,ds=3e4;function en(s){if(s instanceof G)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new G(String(n.code??"error"),n.message)}return typeof s=="number"?new G("connection_lost","Lost the connection to Home Assistant."):new G("error",String(s))}var $t=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new G("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.pushing}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},ds),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,n&&n().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(n=>{this.pushing=!0,n.plan?this.emit(n.plan):this.fail(new G("not_running","MyDashLight isn’t running right now."))},{type:`${Le}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await this.conn.sendMessagePromise({type:"call_service",domain:Le,service:"get_plan",service_data:{days:Gi},return_response:!0});this.emit(n.response)}catch(n){this.fail(en(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Le,service:n,service_data:e})}catch(t){throw en(t)}this.pushing||await this.refresh()}setRide(n,e,t,i){return this.call("set_ride",{event:n,side:e,driver:t,scope:i})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:ls(e),scope:t})}setTakeAlong(n,e,t){return this.call("set_take_along",{event:n,kids:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}watchChores(n){let e=!1,t=null,i=null,o=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:Le,service:"get_chores",service_data:{},return_response:!0});e||n(a.response??null)}catch{e||n(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(r=>{e||n(r.chores)},{type:`${Le}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):t=a}catch{if(e)return;o(),i=setInterval(()=>void o(),ds)}})(),()=>{e=!0,i&&clearInterval(i),t&&t().catch(()=>{})}}watchLunch(n){let e=!1,t=null;return(async()=>{try{let i=await this.conn.subscribeMessage(o=>{e||n(o.lunch)},{type:`${Le}/lunch/subscribe`},{resubscribe:!0});e?i().catch(()=>{}):t=i}catch{e||n(null)}})(),()=>{e=!0,t&&t().catch(()=>{})}}async setLunch(n,e,t){await this.choreCall("set_lunch",{kid:n,dates:e,lunch:t??"default"})}async setLunchMenu(n,e,t,i){await this.choreCall("set_lunch_menu",{kids:n,date:e,menu:t,details:i})}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Le,service:n,service_data:e})}catch(t){throw en(t)}}};var kt=globalThis,_t=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,tn=Symbol(),cs=new WeakMap,it=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==tn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(_t&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=cs.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&cs.set(e,n))}return n}toString(){return this.cssText}},hs=s=>new it(typeof s=="string"?s:s+"",void 0,tn),Re=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,i,o)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new it(e,s,tn)},ps=(s,n)=>{if(_t)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=kt.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,s.appendChild(t)}},nn=_t?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return hs(e)})(s):s;var{is:Yi,defineProperty:Ji,getOwnPropertyDescriptor:Qi,getOwnPropertyNames:Zi,getOwnPropertySymbols:Xi,getPrototypeOf:er}=Object,Ct=globalThis,us=Ct.trustedTypes,tr=us?us.emptyScript:"",nr=Ct.reactiveElementPolyfillSupport,rt=(s,n)=>s,sn={toAttribute(s,n){switch(n){case Boolean:s=s?tr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},gs=(s,n)=>!Yi(s,n),fs={attribute:!0,type:String,converter:sn,reflect:!1,useDefault:!1,hasChanged:gs};Symbol.metadata??=Symbol("metadata"),Ct.litPropertyMetadata??=new WeakMap;var we=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=fs){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&Ji(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:o}=Qi(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let r=i?.call(this);o?.call(this,a),this.requestUpdate(n,r,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??fs}static _$Ei(){if(this.hasOwnProperty(rt("elementProperties")))return;let n=er(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(rt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(rt("properties"))){let e=this.properties,t=[...Zi(e),...Xi(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(nn(i))}else n!==void 0&&e.push(nn(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ps(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let o=(t.converter?.toAttribute!==void 0?t.converter:sn).toAttribute(e,t.type);this._$Em=n,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let o=t.getPropertyOptions(i),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:sn;this._$Em=i;let r=a.fromAttribute(e,o.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(n,e,t,i=!1,o){if(n!==void 0){let a=this.constructor;if(i===!1&&(o=this[n]),t??=a.getPropertyOptions(n),!((t.hasChanged??gs)(o,e)||t.useDefault&&t.reflect&&o===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:o},a){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),o!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,o]of t){let{wrapped:a}=o,r=this[i];a!==!0||this._$AL.has(i)||r===void 0||this.C(i,void 0,o,r)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};we.elementStyles=[],we.shadowRootOptions={mode:"open"},we[rt("elementProperties")]=new Map,we[rt("finalized")]=new Map,nr?.({ReactiveElement:we}),(Ct.reactiveElementVersions??=[]).push("2.1.2");var on=globalThis,ms=s=>s,Tt=on.trustedTypes,bs=Tt?Tt.createPolicy("lit-html",{createHTML:s=>s}):void 0,an="$lit$",$e=`lit$${Math.random().toFixed(9).slice(2)}$`,ln="?"+$e,sr=`<${ln}>`,Ie=document,at=()=>Ie.createComment(""),lt=s=>s===null||typeof s!="object"&&typeof s!="function",dn=Array.isArray,ks=s=>dn(s)||typeof s?.[Symbol.iterator]=="function",rn=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xs=/-->/g,vs=/>/g,Be=RegExp(`>|${rn}(?:([^\\s"'>=/]+)(${rn}*=${rn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ys=/'/g,ws=/"/g,_s=/^(?:script|style|textarea|title)$/i,cn=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),p=cn(1),J=cn(2),Uo=cn(3),ke=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),$s=new WeakMap,Ne=Ie.createTreeWalker(Ie,129);function Cs(s,n){if(!dn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return bs!==void 0?bs.createHTML(n):n}var Ts=(s,n)=>{let e=s.length-1,t=[],i,o=n===2?"<svg>":n===3?"<math>":"",a=ot;for(let r=0;r<e;r++){let l=s[r],c,h,d=-1,f=0;for(;f<l.length&&(a.lastIndex=f,h=a.exec(l),h!==null);)f=a.lastIndex,a===ot?h[1]==="!--"?a=xs:h[1]!==void 0?a=vs:h[2]!==void 0?(_s.test(h[2])&&(i=RegExp("</"+h[2],"g")),a=Be):h[3]!==void 0&&(a=Be):a===Be?h[0]===">"?(a=i??ot,d=-1):h[1]===void 0?d=-2:(d=a.lastIndex-h[2].length,c=h[1],a=h[3]===void 0?Be:h[3]==='"'?ws:ys):a===ws||a===ys?a=Be:a===xs||a===vs?a=ot:(a=Be,i=void 0);let y=a===Be&&s[r+1].startsWith("/>")?" ":"";o+=a===ot?l+sr:d>=0?(t.push(c),l.slice(0,d)+an+l.slice(d)+$e+y):l+$e+(d===-2?r:y)}return[Cs(s,o+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},dt=class s{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let o=0,a=0,r=n.length-1,l=this.parts,[c,h]=Ts(n,e);if(this.el=s.createElement(c,t),Ne.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=Ne.nextNode())!==null&&l.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(an)){let f=h[a++],y=i.getAttribute(d).split($e),A=/([.?@])?(.*)/.exec(f);l.push({type:1,index:o,name:A[2],strings:y,ctor:A[1]==="."?Et:A[1]==="?"?Mt:A[1]==="@"?Pt:ze}),i.removeAttribute(d)}else d.startsWith($e)&&(l.push({type:6,index:o}),i.removeAttribute(d));if(_s.test(i.tagName)){let d=i.textContent.split($e),f=d.length-1;if(f>0){i.textContent=Tt?Tt.emptyScript:"";for(let y=0;y<f;y++)i.append(d[y],at()),Ne.nextNode(),l.push({type:2,index:++o});i.append(d[f],at())}}}else if(i.nodeType===8)if(i.data===ln)l.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf($e,d+1))!==-1;)l.push({type:7,index:o}),d+=$e.length-1}o++}}static createElement(n,e){let t=Ie.createElement("template");return t.innerHTML=n,t}};function Oe(s,n,e=s,t){if(n===ke)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,o=lt(n)?void 0:n._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(s),i._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=Oe(s,i._$AS(s,n.values),i,t)),n}var At=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??Ie).importNode(e,!0);Ne.currentNode=i;let o=Ne.nextNode(),a=0,r=0,l=t[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new Fe(o,o.nextSibling,this,n):l.type===1?c=new l.ctor(o,l.name,l.strings,this,n):l.type===6&&(c=new St(o,this,n)),this._$AV.push(c),l=t[++r]}a!==l?.index&&(o=Ne.nextNode(),a++)}return Ne.currentNode=Ie,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},Fe=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Oe(this,n,e),lt(n)?n===_||n==null||n===""?(this._$AH!==_&&this._$AR(),this._$AH=_):n!==this._$AH&&n!==ke&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):ks(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==_&&lt(this._$AH)?this._$AA.nextSibling.data=n:this.T(Ie.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=dt.createElement(Cs(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new At(i,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(n){let e=$s.get(n.strings);return e===void 0&&$s.set(n.strings,e=new dt(n)),e}k(n){dn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let o of n)i===e.length?e.push(t=new s(this.O(at()),this.O(at()),this,this.options)):t=e[i],t._$AI(o),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=ms(n).nextSibling;ms(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},ze=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=o,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=_}_$AI(n,e=this,t,i){let o=this.strings,a=!1;if(o===void 0)n=Oe(this,n,e,0),a=!lt(n)||n!==this._$AH&&n!==ke,a&&(this._$AH=n);else{let r=n,l,c;for(n=o[0],l=0;l<o.length-1;l++)c=Oe(this,r[t+l],e,l),c===ke&&(c=this._$AH[l]),a||=!lt(c)||c!==this._$AH[l],c===_?n=_:n!==_&&(n+=(c??"")+o[l+1]),this._$AH[l]=c}a&&!i&&this.j(n)}j(n){n===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Et=class extends ze{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===_?void 0:n}},Mt=class extends ze{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==_)}},Pt=class extends ze{constructor(n,e,t,i,o){super(n,e,t,i,o),this.type=5}_$AI(n,e=this){if((n=Oe(this,n,e,0)??_)===ke)return;let t=this._$AH,i=n===_&&t!==_||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,o=n!==_&&(t===_||i);i&&this.element.removeEventListener(this.name,this,t),o&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},St=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){Oe(this,n)}},As={M:an,P:$e,A:ln,C:1,L:Ts,R:At,D:ks,V:Oe,I:Fe,H:ze,N:Mt,U:Pt,B:Et,F:St},ir=on.litHtmlPolyfillSupport;ir?.(dt,Fe),(on.litHtmlVersions??=[]).push("3.3.3");var Es=(s,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let o=e?.renderBefore??null;t._$litPart$=i=new Fe(n.insertBefore(at(),o),o,void 0,e??{})}return i._$AI(s),i};var hn=globalThis,fe=class extends we{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Es(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ke}};fe._$litElement$=!0,fe.finalized=!0,hn.litElementHydrateSupport?.({LitElement:fe});var rr=hn.litElementPolyfillSupport;rr?.({LitElement:fe});(hn.litElementVersions??=[]).push("4.2.2");var Ms={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ps=s=>(...n)=>({_$litDirective$:s,values:n}),Dt=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:or}=As,Ss=s=>s;var Ds=()=>document.createComment(""),Ve=(s,n,e)=>{let t=s._$AA.parentNode,i=n===void 0?s._$AB:n._$AA;if(e===void 0){let o=t.insertBefore(Ds(),i),a=t.insertBefore(Ds(),i);e=new or(o,a,s,s.options)}else{let o=e._$AB.nextSibling,a=e._$AM,r=a!==s;if(r){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(o!==i||r){let l=e._$AA;for(;l!==o;){let c=Ss(l).nextSibling;Ss(t).insertBefore(l,i),l=c}}}return e},Ae=(s,n,e=s)=>(s._$AI(n,e),s),ar={},Ls=(s,n=ar)=>s._$AH=n,Rs=s=>s._$AH,Lt=s=>{s._$AR(),s._$AA.remove()};var Bs=(s,n,e)=>{let t=new Map;for(let i=n;i<=e;i++)t.set(s[i],i);return t},me=Ps(class extends Dt{constructor(s){if(super(s),s.type!==Ms.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let i=[],o=[],a=0;for(let r of s)i[a]=t?t(r,a):a,o[a]=e(r,a),a++;return{values:o,keys:i}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let i=Rs(s),{values:o,keys:a}=this.dt(n,e,t);if(!Array.isArray(i))return this.ut=a,o;let r=this.ut??=[],l=[],c,h,d=0,f=i.length-1,y=0,A=o.length-1;for(;d<=f&&y<=A;)if(i[d]===null)d++;else if(i[f]===null)f--;else if(r[d]===a[y])l[y]=Ae(i[d],o[y]),d++,y++;else if(r[f]===a[A])l[A]=Ae(i[f],o[A]),f--,A--;else if(r[d]===a[A])l[A]=Ae(i[d],o[A]),Ve(s,l[A+1],i[d]),d++,A--;else if(r[f]===a[y])l[y]=Ae(i[f],o[y]),Ve(s,i[d],i[f]),f--,y++;else if(c===void 0&&(c=Bs(a,y,A),h=Bs(r,d,f)),c.has(r[d]))if(c.has(r[f])){let u=h.get(a[y]),v=u!==void 0?i[u]:null;if(v===null){let T=Ve(s,i[d]);Ae(T,o[y]),l[y]=T}else l[y]=Ae(v,o[y]),Ve(s,i[d],v),i[u]=null;y++}else Lt(i[f]),f--;else Lt(i[d]),d++;for(;y<=A;){let u=Ve(s,l[A+1]);Ae(u,o[y]),l[y++]=u}for(;d<=f;){let u=i[d++];u!==null&&Lt(u)}return this.ut=a,Ls(s,l),ke}});var Rt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function Z(s){return Rt[(s%Rt.length+Rt.length)%Rt.length]}var Bt="#23272E",pn="35,39,46";var lr=3,Ut=36,un=12,Ns=8,dr=30,gn=60,mn=10,It=30,bn=10,cr=150,hr=200,zt=1.4;function vn(s,n){let e=Math.max(cr,hr/zt);return Math.ceil(gn+Math.max(0,s-1)*mn+It+Math.max(0,n-1)*bn+e*(s+zt*n))}function _e(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function Ce(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function pe(s){return new Map(_e(s).map((n,e)=>[n,Z(e)]))}function ge(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function ue(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function yn(s,n){return n==="none"?"Not needed":Ce(s).includes(n)?ue(s,n):n}function Ht(s,n){return n.own?ue(s,n.own):ge(s,n.kid)}var jt={color:Bt,rgb:pn,ink:Bt};function zs(s,n){return n.own?jt:pe(s).get(n.kid)??Z(0)}function pr(s,n){let e=_e(s);return n.along.map(t=>e.includes(t)?ge(s,t):ue(s,t))}function wn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function ur(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function Ot(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function Nt(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(Ot(n,t.from)),e.push(Ot(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(Ot(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function fr(s){let n=s.map(a=>({...a,col:0,cols:1})).sort((a,r)=>a.s-r.s||r.en-a.en),e=[],t=[],i=-1/0,o=()=>{for(let a of e)a.cols=t.length;e=[],t=[]};for(let a of n){a.s>=i&&(o(),i=-1/0);let r=t.findIndex(l=>l<=a.s);r<0?(r=t.length,t.push(a.en)):t[r]=a.en,a.col=r,e.push(a),i=Math.max(i,a.en)}return o(),n}function gr(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.t)return i.t===t.t?t.y:Math.round(t.y+(n-t.t)/(i.t-t.t)*(i.y-t.y))}return s[s.length-1].y}function mr(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.y)return i.y===t.y?t.t:t.t+(n-t.y)/(i.y-t.y)*(i.t-t.t)}return s[s.length-1].t}function Us(s,n){return gr(s.anchors,n)}function Hs(s,n){return mr(s.anchors,n)}function br(s,n){let e=_e(s),t=Ce(s),i=Math.max(n,vn(e.length,t.length)),a=(i-gn-Math.max(0,e.length-1)*mn-It-Math.max(0,t.length-1)*bn)/(e.length+zt*t.length||1),r=Math.floor(a),l=Math.floor(a*zt),c=new Map;for(let A of s.days)for(let u of A.events)for(let v of u.own?u.along:[u.kid]){let T=c.get(v)??[];T.some($=>$.event_id===u.event_id&&$.calendar_id===u.calendar_id)||T.push(u),c.set(v,T)}let h=pe(s),d=[],f=gn;e.forEach((A,u)=>{let v=c.get(A)??[],T=s.days.some($=>$.events.some(U=>U.kid===A&&(U.sides.includes("drop")&&U.drop===""||U.sides.includes("pick")&&U.pick==="")));d.push({id:A,kind:"kid",x:f,w:r,name:ge(s,A),dot:h.get(A).color,rgb:h.get(A).rgb,sub:`${T?"Needs a ride · ":""}${v.length} this week`,subWarn:T}),f+=r+(u<e.length-1?mn:0)});let y=f+It/2;return f+=It,t.forEach((A,u)=>{let v=0,T=0;for(let $ of s.days){let U=$.drivers[A];U&&(v+=U.outings.length,T+=U.drive??0)}d.push({id:A,kind:"driver",x:f,w:l,name:ue(s,A),dot:Bt,rgb:pn,sub:`${v} ${v===1?"trip":"trips"} this week · ${st(T)} driving`,subWarn:!1}),f+=l+(u<t.length-1?bn:0)}),{columns:d,sepX:y,width:i}}function xr(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(n.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!o)return e;let a=i.slice(o[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Is(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${R(s.start)}`:e||!n?`${s.title} until ${R(s.end)}`:`${s.title} ${R(s.start)}–${R(s.end)}`}function $n(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length}function kn(s,n){let e=xe(n,s);return e===0?"Today":e===1?"Tomorrow":""}function ie(s,n=0){return s==null||!Number.isFinite(s)?n:s}function xn(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),i=1,o=0;for(let a of s.split(/\s+/).filter(Boolean)){let r=a.length;for(o===0?o=r:o+1+r<=t?o+=1+r:(i++,o=r);o>t;)i++,o-=t}return i}var js=25,qs=15,_n=3;function fn(s){return Math.max(0,Math.min(_n,Math.floor((s-js)/qs)))}function vr(s,n){let e=Math.min(_n,xn(s,n-19,6.6));return js+e*qs+2}function Os(s,n){let e=n-23,t=`${R(s.start)}–${R(s.end)}`+(s.arrive_by!=null?` · arrive ${R(s.arrive_by)}`:""),i=33+xn(t,e,6.6)*16;for(let o of[s.lines.drop,s.lines.pick])o&&(i+=2+xn(o.text,e,7)*16);return i+4}function Ks(s,n,e,t){let i=n==="compact",{columns:o,sepX:a,width:r}=br(s,e),l=new Map(o.map($=>[$.id,$])),c=_e(s),h=Ce(s),d=[...c,...h],f=pe(s),y=ur(s),A=$=>ge(s,$),u=$=>ue(s,$),v={mode:n,width:r,height:0,columns:o,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},T=0;return s.days.forEach(($,U)=>{let oe=U*1440,H=new Map($.events.map(g=>[g.id,g])),ae=g=>g&&H.has(g)?{day:$.date,event:g}:null,m=$n($),k=$.events.length,b=kn($.date,t.date);v.dayHeads.push({date:$.date,y:T,label:be($.date),tag:b,sub:(k?`${k} ${k===1?"activity":"activities"}`:"Nothing scheduled")+(m?` · ${m} to sort out`:""),warn:m>0}),v.anchors.push({t:oe,y:T});let x=T+Ut+un,w=h.flatMap(g=>$.drivers[g]?.outings??[]);if(!k&&!w.length){v.empties.push({key:$.date,y:x,text:"Nothing planned"}),T=x+40,v.anchors.push({t:oe+1439,y:T});return}let M=(g,S,N,D,V,le,P,q=g.kid)=>{let de=!!g.own&&q===g.own,Se=!!g.own&&q!==g.own,ee=de?jt:f.get(q)??Z(0),I=de?u(q):A(q),te=Se?{drop:{text:`With ${u(g.own)}`,tone:g.attending===!1?"muted":"normal"},pick:null}:g.lines,E=de?pr(s,g):[],K=(g.takes!=null?`${g.takes} min, any time ${R(g.start)}–${R(g.end)}`:`${R(g.start)}–${R(g.end)}`+(g.arrive_by!=null?` · arrive ${R(g.arrive_by)}`:""))+(E.length?` · with ${wn(E)}`:"");return{key:`${$.date}|card|${g.id}`+(g.own?`|${q}`:""),x:S,y:N,w:D,h:V,target:{day:$.date,event:g.id},event:g,color:ee,kidName:I,clash:le,stayed:!g.own&&g.stay&&h.includes(g.drop),skipped:g.attending===!1,title:xr(g.title,I),time:K,drop:te.drop,pick:te.pick,showDrop:!!te.drop&&(P||V>=56),showPick:!!te.pick&&(P||V>=74),wrap:P,aria:`${I}, ${g.title} ${g.takes!=null?`any time from ${R(g.start)} to ${R(g.end)}`:`${R(g.start)} to ${R(g.end)}`}. `+(g.attending===!1&&!te.drop?"Not attending. ":"")+[te.drop,te.pick].filter(W=>!!W).map(W=>W.text).join(". ")}},C=g=>{let S=$.rides[g];return S?($.drivers[S.driver]?.segments??[]).filter(D=>D.type!=="home"&&D.kids.includes(S.kid)&&ie(D.start)>=ie(S.start)&&ie(D.end)<=ie(S.end)):[]},O=g=>{let S=$.rides[g];if(!S)return null;let N=S.serves.find(D=>H.get(D)?.kid===S.kid);return ae(N??S.serves[0])},B=(g,S)=>{if(S.event)return S;let N=$.events.find(D=>D.own&&D.own!==g&&D.along.includes(g)&&D.title===S.title);return N?{...S,title:`${S.title} with ${u(N.own)}`}:S},F=g=>{if(g.takes==null)return[g.start,g.end];let S=g.planned??g.start;return[S,S+g.takes]},L=new Map;for(let g of $.issues)g.level!=="problem"||!g.event||(g.kind==="late"&&L.set(g.event,`${Math.round(ie(g.minutes))} min late`),g.kind==="waiting"&&L.set(`${g.event}|pick`,`Waits ${Math.round(ie(g.minutes))} min`));if(!i){let g=1/0,S=-1/0;for(let P of $.events)g=Math.min(g,P.start-20,P.arrive_by!=null?P.arrive_by-10:1/0),S=Math.max(S,P.end+20);for(let P of w)P.start!=null&&(g=Math.min(g,P.start)),P.end!=null&&(S=Math.max(S,P.end));$.date===t.date&&Number.isFinite(g)&&t.minutes>g-60&&t.minutes<S&&(g=Math.min(g,t.minutes-15));let N=Number.isFinite(g)?Math.floor((g-5)/30)*30:900,D=Number.isFinite(S)?Math.ceil((S+5)/30)*30:960,V=P=>Math.round(x+(Math.max(N,Math.min(D,P))-N)*lr);v.anchors.push({t:oe+N,y:V(N)},{t:oe+D,y:V(D)});for(let P of c){let q=l.get(P),de=f.get(P),Se=($.kids[P]?.items??[]).filter(I=>I.start!=null&&I.end!=null).map(I=>({item:I,s:ie(I.start),en:ie(I.end)})),ee=[];for(let I of fr(Se)){let te=q.w/I.cols,E=Math.round(q.x+I.col*te),K=Math.round(te-(I.cols>1?4:0)),W=V(I.s),ne=I.item;if(ne.type==="act"){let se=H.get(ne.event??"");if(!se)continue;let qn=Math.max(30,V(I.en)-W);if(v.cards.push(M(se,E,W,K,qn,ne.clash,!1,P)),ee.push({s:se.arrive_by!=null&&se.start-se.arrive_by>=5?se.arrive_by:I.s,en:I.en,top:W}),se.arrive_by!=null&&se.start-se.arrive_by>=5){let Qt=V(se.arrive_by);ee[ee.length-1].top=Qt,v.preps.push({key:`${$.date}|prep|${se.id}`,x:E,y:Qt,w:K,h:W-Qt+6,color:de,label:`Arrive by ${R(se.arrive_by)}`})}let Kn=L.get(se.id);Kn&&v.marks.push({key:`${$.date}|late|${se.id}`,x:E+K-4,y:W+4,text:Kn,right:!0});let Wn=L.get(`${se.id}|pick`);Wn&&v.marks.push({key:`${$.date}|wait|${se.id}`,x:E+4,y:W+qn+2,text:Wn,right:!1});continue}let X=$.rides[ne.ride??-1];if(!X)continue;let he=Math.max(22,V(I.en)-W),Ze=Nt(C(X.index),y),Xe=u(X.driver),Q={key:`${$.date}|ride|${X.index}`,x:E,y:W,w:K,h:he,target:O(X.index),l1:`${X.own?"In":"Along in"} ${Xe}’s car`,l2:Ze.join(" → "),show2:fn(he)>0,lines2:fn(he),dashed:!X.own,clash:ne.clash,aria:`${A(P)} ${X.own?"in":"riding along in"} ${Xe}’s car, ${R(ie(X.start))} to ${R(ie(X.end))}: ${Ze.join(" to ")}`};v.rides.push(Q);let De=l.get(X.driver),Ke=null;De&&(Ke={key:`${$.date}|band|${X.index}`,x:E+K,y:W,w:Math.max(0,De.x+8-(E+K)),h:he,color:de},v.bands.push(Ke)),ee.push({s:I.s,en:I.en,top:W,ride:{box:Q,band:Ke}})}for(let I of ee){if(!I.ride)continue;let te=ee.filter(K=>K!==I&&K.s>=I.en&&K.s-I.en<=dr).sort((K,W)=>K.s-W.s||K.top-W.top)[0];if(!te||te.top<=I.ride.box.y+I.ride.box.h)continue;let E=te.top-I.ride.box.y;I.ride.box.h=E,I.ride.box.lines2=fn(E),I.ride.box.show2=I.ride.box.lines2>0,I.ride.band&&(I.ride.band.h=E)}}for(let P of h){let q=l.get(P),de=$.drivers[P];if(!de)continue;let Se=[],ee=null;for(let E of de.segments)if(!(E.start==null||E.end==null)){if(E.type==="home"){ee=null;continue}if(E.type==="stay"){ee=null,Se.push({type:"stay",g:E,s:E.start,en:E.end});continue}ee&&ee.en===E.start?(ee.en=E.end,ee.legs.push(E)):(ee={type:"trip",s:E.start,en:E.end,legs:[E]},Se.push(ee))}let I=new Set,te=(E,K,W,ne)=>{I.add(E.id);let X=V(K),he=M(E,q.x+8,X,q.w-16,Math.max(30,V(W)-X),!1,!1,P);ne&&he.drop?.tone==="normal"&&(he.drop=null,he.showDrop=!1),v.cards.push(he)};for(let E of Se){let K=V(E.s),W=Math.max(24,V(E.en)-K);if(E.type==="stay"){let Q=H.get(E.g.event??E.g.serves??"");if(Q?.own===P){te(Q,E.s,E.en,!0);continue}let De=Q?f.get(Q.kid)??Z(0):Z(0),Ke=E.g.kids.map(A);v.stays.push({key:`${$.date}|stay|${P}|${E.s}`,x:q.x+8,y:K,w:q.w-16,h:W,target:ae(Q?.id),color:De,l1:Q?`At ${Q.title} with ${A(Q.kid)}`:"Staying",l2:`until ${R(E.en)}`+(Ke.length?` · ${Ke.join(" and ")} too`:"")});continue}let ne=E.legs[0],X=E.legs[E.legs.length-1],he=[];for(let Q of E.legs)for(let De of Q.kids)he.includes(De)||he.push(De);let Ze=X.type==="drive"&&X.to==="home",Xe=Nt(E.legs,y);v.trips.push({key:`${$.date}|trip|${P}|${E.s}`,x:q.x+8,y:K,w:q.w-16,h:W,target:ae(E.legs.find(Q=>Q.serves)?.serves),l1:ne.type==="drive"&&ne.from==="home"?`Leave ${R(E.s)}`:`From ${Ot(y,ne.from??ne.place)} ${R(E.s)}`,l2:Xe.join(" → "),show2:W>=36,l3:Ze?`Home ${R(E.en)}`:"",show3:Ze&&W>=62,stops:null,kids:he.map(Q=>(f.get(Q)??Z(0)).color),bad:E.legs.some(Q=>Q.overlaps_busy),aria:`${u(P)} drives ${Xe.join(" to ")}, ${R(E.s)} to ${R(E.en)}`})}for(let E of de.segments)if(!(!E.overlaps_busy||E.start==null||E.end==null))for(let K of de.busy){let W=Math.max(E.start,K.start),ne=Math.min(E.end,K.end);ne<=W||v.overlaps.push({key:`${$.date}|overlap|${P}|${W}`,x:q.x+6,y:V(W)-2,w:q.w-12,h:Math.max(8,V(ne)-V(W)+4)})}for(let E of $.events)if(E.own===P&&(I.has(E.id)||te(E,...F(E),!1),E.takes!=null&&E.attending!==!1)){let K=V(E.start);v.windows.push({key:`${$.date}|window|${E.id}`,x:q.x+4,y:K,w:q.w-8,h:Math.max(24,V(E.end)-K),label:`${E.title} · any time ${R(E.start)}–${R(E.end)}`})}for(let E of de.busy){if(E.event||E.end<=N||E.start>=D)continue;let K=B(P,E),W=V(K.start),ne=V(K.end);v.busy.push({key:`${$.date}|busy|${P}|${K.start}`,x:q.x+1,y:W,w:q.w-2,h:ne-W,labelY:8,label:Is(K,!1)})}}let le=-1/0;for(let P=N;P<=D;P+=30)v.grid.push({key:`${$.date}|grid|${P}`,y:V(P),strong:P%60===0}),P%60===0&&V(P)-le>=22&&(v.hours.push({key:`${$.date}|hour|${P}`,y:V(P)-8,label:as(P)}),le=V(P));$.date===t.date&&t.minutes>N&&t.minutes<D&&(v.now={y:V(t.minutes),label:`Now ${R(t.minutes)}`}),T=V(D)+un;return}let j=[];for(let g of c){let S=l.get(g);for(let N of $.kids[g]?.items??[])if(N.start!=null){if(N.type==="act"){let D=H.get(N.event??"");if(!D)continue;j.push({col:g,s:N.start,h:Os(D,S.w),kind:"act",item:N})}else if(!$.rides[N.ride??-1]?.own){let D=$.rides[N.ride??-1],V=D?Nt(C(D.index),y).join(" → "):"";j.push({col:g,s:N.start,h:vr(V,S.w),kind:"along",item:N})}}}for(let g of h){let S=$.drivers[g];if(!S)continue;for(let D of S.busy)D.event||j.push({col:g,s:D.start,h:32,kind:"busy",busy:B(g,D)});let N=l.get(g).w;for(let D of $.events)D.own!==g||D.attending!==!1&&(D.takes==null||D.planned!=null)||j.push({col:g,s:F(D)[0],h:Os(D,N),kind:"own",event:D});for(let D of S.outings)D.start!=null&&j.push({col:g,s:D.start,h:30+D.lines.length*16+(D.warn?16:0),kind:"out",out:D})}j.sort((g,S)=>g.s-S.s||d.indexOf(g.col)-d.indexOf(S.col));let z=new Map,Y=[],Jt=x;j.forEach((g,S)=>{let N=z.get(g.col),D=Math.max(N!=null?N+Ns:x,Jt);z.set(g.col,D+g.h),Jt=D;let V=g.kind==="busy"?g.busy.end:g.kind==="act"?H.get(g.item.event??"")?.end??null:g.kind==="own"?F(g.event)[1]:null;Y.push({col:g.col,s:g.s,end:V,y:D,h:g.h,box:null}),v.anchors.push({t:oe+g.s,y:D});let le=l.get(g.col);if(g.kind==="busy"){let P={key:`${$.date}|busy|${g.col}|${S}`,x:le.x+1,y:D,w:le.w-2,h:g.h,labelY:8,label:Is(g.busy,!0)};v.busy.push(P),Y[Y.length-1].box=P}else if(g.kind==="out"){let P=g.out;v.trips.push({key:`${$.date}|trip|${g.col}|${S}`,x:le.x+8,y:D,w:le.w-16,h:g.h,target:ae(P.target),l1:P.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...P.lines.map(q=>({text:q,warn:!1})),...P.warn?[{text:P.warn,warn:!0}]:[]],kids:P.kids.map(q=>(f.get(q)??Z(0)).color),bad:!!P.warn,aria:`${u(g.col)}: ${P.lead}. ${P.lines.join(". ")}${P.warn?`. ${P.warn}`:""}`})}else if(g.kind==="own"){let P=M(g.event,le.x+8,D,le.w-16,g.h,!1,!0,g.col);v.cards.push(P),Y[Y.length-1].box=P}else if(g.kind==="act"){let P=H.get(g.item.event??""),q=M(P,le.x,D,le.w,g.h,g.item.clash,!0,g.col);v.cards.push(q),Y[Y.length-1].box=q}else{let P=$.rides[g.item.ride??-1],q=Nt(C(P.index),y),de=u(P.driver);v.rides.push({key:`${$.date}|ride|${P.index}`,x:le.x,y:D,w:le.w,h:g.h,target:O(P.index),l1:`Along with ${de} ${R(ie(P.start))}`,l2:q.join(" → "),show2:!0,lines2:_n,dashed:!0,clash:g.item.clash,aria:`${A(g.col)} riding along with ${de}, ${R(ie(P.start))} to ${R(ie(P.end))}: ${q.join(" to ")}`})}});let Te=x;for(let g of z.values())Te=Math.max(Te,g);for(let g of Y){if(!g.box||g.end==null)continue;let S=g.y+g.h;for(let N of Y)N.col!==g.col&&N.s>=g.s&&N.s<g.end&&(S=Math.max(S,N.y+N.h));g.end>=1440&&(S=Te);for(let N of Y)N.col===g.col&&N.y>g.y&&(S=Math.min(S,N.y-Ns));S=Math.min(S,Te),S>g.y+g.h&&(g.box.h=S-g.y)}T=Te+un+6,v.anchors.push({t:oe+1439,y:T})}),v.height=T,v}var yr=["","¼","½","¾"];function Ue(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return st(t);let i=Math.round(t*4),o=Math.floor(i/4),a=yr[i%4];return`${o||!a?o:""}${a} min`})}function Ws(s){let n=e=>e?{...e,text:Ue(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,i])=>[t,{...i,outings:i.outings.map(o=>({...o,lines:o.lines.map(Ue),warn:o.warn==null?o.warn:Ue(o.warn)}))}])),issues:e.issues.map(t=>({...t,title:Ue(t.title),body:Ue(t.body),note:t.note==null?t.note:Ue(t.note),...t.suggestions?{suggestions:t.suggestions.map(i=>({...i,note:Ue(i.note)}))}:{}}))}))}}var wr=2,$r=48;function Fs(s,n,e=$r){let t=[],i=0,o=0,a=0,r=0,l=n.minutes+e*60;for(let c of s.days){let h=xe(n.date,c.date),d=h===0?"":`${ce(c.date)} · `,f=new Map(c.events.map(u=>[u.id,u])),y=u=>u&&f.has(u)?{day:c.date,event:u}:null,A=(u,v)=>h*1440+(u??f.get(v??"")?.start??0)<l;for(let u of c.issues)if(u.level==="problem"){if(!A(u.at,u.event)){a++,u.kind==="unassigned"&&r++;continue}i++,u.kind==="unassigned"&&o++,t.push({key:`${c.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:d+u.title,body:u.body,target:y(u.event),suggestions:(u.suggestions??[]).map(v=>({id:v.id,label:v.label,note:v.note}))})}if(c.clashes.forEach((u,v)=>{if(!A(u.a.start,u.a.event)){a++;return}i++;let T=f.get(u.a.event??""),$=ge(s,u.kid),U=(H,ae)=>{let m=y(ae);return m?{text:H,target:m}:H},oe=[];if(u.b.type==="act"){let H=f.get(u.b.event??"");T&&H&&(oe=[U(T.title,T.id),` ${R(T.start)}–${R(T.end)} and `,U(H.title,H.id),` ${R(H.start)}–${R(H.end)} overlap.`])}else{let H=c.rides[u.b.ride??-1];T&&H&&(oe=[`${$} is in `,U(`${ue(s,H.driver)}’s car`,H.serves[0]),` ${R(ie(u.b.start))}–${R(ie(u.b.end))}, during `,U(T.title,T.id),"."])}t.push({key:`${c.date}|clash|${v}`,tone:"problem",title:`${d}${$} is double-booked`,body:oe.map(H=>typeof H=="string"?H:H.text).join(""),parts:oe,target:null,suggestions:[]})}),h>=0&&h<wr)for(let u of c.issues)u.level!=="heads_up"||!A(u.at,u.event)||t.push({key:`${c.date}|${u.key}`,tone:"heads_up",title:d+u.title,body:u.body,target:y(u.event),suggestions:[]});for(let u of c.events)!u.problems.length||!A(u.start)||t.push({key:`${c.date}|notes|${u.id}`,tone:"heads_up",title:`${d}Check the notes on ${Ht(s,u)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:y(u.id),suggestions:[]})}return{items:t,problems:i,unassigned:o,later:a,laterUnassigned:r}}function Vs(s,n){let e=pe(s),t=null,i=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of s.days){let a=xe(n.date,o.date);if(!(a<0))for(let r of Ce(s))for(let l of o.drivers[r]?.outings??[]){if(l.start==null)continue;let c=a*1440+l.start;if(a*1440+ie(l.end,l.start)<=n.minutes)continue;let d=c-n.minutes,f={driver:r,name:ue(s,r),date:o.date,ahead:a,start:l.start,inMinutes:d,ongoing:d<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(y=>e.get(y)??Z(0)),warn:l.warn,target:l.target&&o.events.some(y=>y.id===l.target)?{day:o.date,event:l.target}:null};(!t||i(f)<i(t)||i(f)===i(t)&&f.inMinutes<t.inMinutes)&&(t=f)}}return t}function Ge(s){return s.state==="done"||s.state==="late"}var kr=780;function _r(s,n,e){return s.state==="open"&&!!s.for_day&&s.due===n&&e<kr}function Gs(s,n){return s.chores.map(e=>_r(e,s.today,n)?{...e,state:"upcoming",shows_from:s.today}:e)}function Ys(s){return s.state==="open"||s.state==="overdue"}function An(s,n,e){if(Ge(s)){let t=s.done_at?Cr(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Cn(s.due,n)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Cn(s.for_day,n)}`;let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let i=xe(n,s.due);return`By ${i===1?"tomorrow":i<7?ce(s.due):Tn(s.due)}`}if(s.for_day&&s.due===n)return`Tonight · for ${Cn(s.for_day,n)}`;if(s.due&&s.due>n){let t=xe(n,s.due);return t===1?"By tomorrow":`By ${t<7?ce(s.due):Tn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Cn(s,n){let e=xe(n,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ce(s):Tn(s)}function Tn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Cr(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let o=t.toLocaleDateString("en-CA",{timeZone:i}),a=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return o===n?a:`${ce(o)} ${a}`}function Js(s,n,e=1440){let t=Gs(s,e).sort((i,o)=>i.order-o.order);return s.kids.map((i,o)=>{let a=t.filter(h=>h.kid===i.id),r=new Map;for(let h of a){if(h.state!=="upcoming")continue;let d=h.shows_from??h.due??s.today;r.set(d,[...r.get(d)??[],h])}let l=a.filter(h=>h.state==="overdue"),c=a.filter(h=>h.state==="open");return{kid:i.id,name:i.name,color:n?.get(i.id)??Z(o),overdue:l,now:c,done:a.filter(Ge),later:[...r.entries()].sort(([h],[d])=>h.localeCompare(d)).map(([h,d])=>({date:h,chores:d})),left:l.length+c.length}})}function Qs(s,n=1440){return Gs(s,n).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,t)=>e.state===t.state?e.order-t.order:e.state==="overdue"?-1:1)}function En(s){return!s.chores.length&&!s.templates.length}var He=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Mn(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[i,o]=t.split("-").map(a=>He.indexOf(a.trim()));if(i===void 0||i<0||o!==void 0&&o<0)return null;if(o===void 0)e.add(i);else for(let a=0;a<=(o-i+7)%7;a++)e.add((i+a)%7)}return e}function qt(s){let n=[...new Set(s)].sort((t,i)=>t-i);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let i=e.at(-1);i&&i.at(-1)===t-1?i.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${He[t[0]]}-${He[t.at(-1)]}`]:t.map(i=>He[i])).join(", ")}var je="none";function Kt(s){return s==="daily"||s==="school"?"":"Any"}function Zs(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Xs(s){return{template:s.id,repeats:s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:s.days??Kt(s.repeats),every:s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function Pn(s){return s.title.trim()?s.who.length?s.days===je?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function ei(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function Sn(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function Dn(s,n,e=1,t=!1,i=!1){if(s==="school"){let h=n.trim().replace(/-/g,"–"),d=i?h?`${h} Bring lunch days`:"Bring lunch days":h?`${h} school days`:"Every school day";return t?`${d}, the night before`:d}let o={daily:"day",weekly:"week",monthly:"month"}[s],a=e>1?`every ${e} ${o}s`:`each ${o}`,r=n.trim();if(s==="daily"){let h=r.replace(/-/g,"–");return e>1?h?`${h}, every ${e} days`:`Every ${e} days`:h||"Every day"}if(!r||r.toLowerCase()==="any")return`Sometime ${a}`;if(s==="weekly")return`${r.replace(/-/g,"–")} ${a}`;let c=`${r.split(",").map(h=>{let d=h.trim();return d.toLowerCase()==="last"?"the last day":/^\d+$/.test(d)?`the ${Sn(Number(d))}`:`the ${d}`}).join(" and ")} ${a}`;return c[0].toUpperCase()+c.slice(1)}function Ln(s,n,e=!1){let t=s.map(o=>n.find(a=>a.id===o)?.name??o);if(!t.length)return"Nobody yet";let i=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${i} take turns`:i}function Rn(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}function Wt(s,n){return`${s}|${n}`}function Ye(s,n){let[e,t,i]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1,i+n)).toISOString().slice(0,10)}function Ft(s){let[n,e,t]=s.split("-").map(Number);return(new Date(Date.UTC(n,e-1,t)).getUTCDay()+6)%7}function ti(s,n){return s.days_off.find(e=>e.first<=n&&n<=e.last)??null}function ni(s,n){return Ft(n)<5&&!ti(s,n)}function ct(s,n,e=new Map){if(!ni(s,n))return null;let t=Wt(s.id,n);if(e.has(t)){let o=e.get(t);return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}let i=s.picks[n];return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}function Je(s,n){return ni(s,n)?s.menus?.[n]??null:null}var Tr="From the school's menu feed.";function Ar(s){let n=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Tr);return n.length?n.join(`
`):null}function ve(s){return s.slice(0,7)}function Vt(s){let[n,e]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function Bn(s,n=1){let[e,t]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1+n,1)).toISOString().slice(0,7)}function si(s){let n=[];for(let e=ve(s.first);e<=ve(s.last);e=Bn(e))n.push(e);return n}function ii(s,n,e,t=new Map){let i=`${e}-01`,o=Ye(i,-Ft(i)),a=[];for(;ve(o)<=e;){let r=[];for(let l=0;l<5;l++){let c=Ye(o,l),h=ve(c)!==e,d=h?null:ti(n,c),f=h?null:ct(n,c,t);r.push({date:c,day:Number(c.slice(8)),outside:h,off:d?d.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:h?null:Je(n,c)?.dish??null,sides:h?null:Ar(Je(n,c)?.details??""),past:c<s.today,today:c===s.today})}r.some(l=>!l.outside)&&a.push(r),o=Ye(o,7)}return a}function ri(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function oi(s){let n=0,e=0;for(let t of s.flat())t.outside||t.past||!t.lunch||(t.lunch==="bring"?n++:e++);return{bring:n,buy:e}}function ai(s,n,e,t=new Map){let i=e<780?0:1;for(let o=i;o<8;o++){let a=Ye(n,o),r=ct(s,a,t);if(!r)continue;let l=xe(n,a);return{lunch:r.lunch,when:l===0?"today":l===1?"tomorrow":ce(a),date:a,menu:Je(s,a)?.dish??null}}return null}var Er={timeline:"timeline",full:"timeline",compact:"compact"};function ht(s){let n=new URLSearchParams(s),e={},t=Er[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(n.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores"||i==="lunch")&&(e.page=i),e}var Mr=["auth_callback","code","state"];function Nn(s){let n=new URLSearchParams(s);for(let t of Mr)n.delete(t);let e=n.toString();return e?`?${e}`:""}var li=Re`
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
`;var pi="mydashlight.rides.mode",Pr=1100,Sr=440,Dr=700,Lr=3*6e4,Rr=1200;function Br(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Gt=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,di=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Nr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],ci=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,hi=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Ir=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Or=J`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,pt={bring:"Bring",buy:"Buy"};function zr(s,n){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return n<=1?`Every ${e}`:n===2?`Every other ${e}`:`Every ${n} ${e}s${s==="monthly"&&n===3?" (quarterly)":""}`}function ye(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function In(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Ur(s,n){return kn(s,n)||be(s).split(",")[0]}function Hr(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function jr(){try{return localStorage.getItem(pi)==="compact"?"compact":"timeline"}catch{return"timeline"}}function qr(s){try{localStorage.setItem(pi,s)}catch{}}function Yt(s){return s.days.every(n=>!n.events.length)}var ut=class extends fe{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=ht(location.search).view;this.urlPage=ht(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let i=e.clientX-t.x,o=e.clientY-t.y;if(!t.moved){if(Math.abs(i)+Math.abs(o)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-o,t.el.scrollLeft=t.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Lr))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??jr(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let t=new Map(this.lunchDraft);for(let[i,o]of this.lunchDraft){let[a,r]=i.split("|"),l=e.kids.find(c=>c.id===a);(!l||(l.picks[r]??null)===o||!ct(l,r))&&t.delete(i)}this.lunchDraft=t}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let i of e.chores)t.has(i.id)&&Ge(i)===t.get(i.id)&&t.delete(i.id);for(let i of t.keys())e.chores.some(o=>o.id===i)||t.delete(i);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=Ws(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Pr)return!1;let e=this.plan;return!e||this.width-Sr>=vn(_e(e).length,Ce(e).length)}today(){return nt(this.plan?.time_zone??Br())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),i=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=Ks(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let i=this.scroller;if(!i||!this.board)return;let o=this.board.dayHeads.find(a=>a.date===t)?.y??0;i.scrollTop=Math.max(o,Us(this.board,e)-Ut-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let o=this.dayIndexOf(e),a=t.days[o];if(!a)return;let r=1/0;if(this.mode==="timeline"){for(let l of a.events)r=Math.min(r,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let c of l.outings)c.start!=null&&(r=Math.min(r,c.start))}this.scrollToTime(o*1440+(Number.isFinite(r)?Math.max(0,r-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,i=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=t+1&&(i=c);let o=this.renderRoot,a=o.querySelector(".pinned .label"),r=o.querySelector(".pinned .tag"),l=o.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),r&&(r.textContent!==i.tag&&(r.textContent=i.tag),r.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let c of o.querySelectorAll(".day-tile"))c.classList.toggle("in-view",c.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),o=new Map(this.choreDraft);o.set(e.id,i),this.choreDraft=o;try{await this.backend.setChoreDone(e.id,i,t&&t!==e.kid?t:void 0)}catch(a){let r=new Map(this.choreDraft);r.delete(e.id),this.choreDraft=r;let l=a instanceof G?a:new G("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??Ge(e)}editMenu(e,t){let i=this.lunch?.kids??[],o=Je(e,t),a=i.filter(r=>r.id===e.id||o&&Je(r,t)?.dish===o.dish).map(r=>r.id);this.closePanel(),this.menuEdit={kid:e.id,date:t,dish:o?.dish??"",details:o?.details??"",kids:a,had:!!o,busy:!1}}async saveMenu(e=!1){let t=this.menuEdit;if(!(!t||!this.backend||!t.kids.length)){this.menuEdit={...t,busy:!0};try{await this.backend.setLunchMenu(t.kids,t.date,e?"":t.dish.trim(),e?"":t.details.trim()),this.menuEdit=null}catch(i){this.menuEdit={...t,busy:!1};let o=i instanceof G?i:new G("error",String(i));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async saveLunch(e,t,i){if(!this.backend||!t.length)return;let o=new Map(this.lunchDraft);for(let a of t)o.set(Wt(e,a),i);this.lunchDraft=o;try{await this.backend.setLunch(e,t,i)}catch(a){let r=new Map(this.lunchDraft);for(let c of t)r.delete(Wt(e,c));this.lunchDraft=r;let l=a instanceof G?a:new G("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?Xs(e):Zs(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Pn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(ei(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let i=t instanceof G?t:new G("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let i=t instanceof G?t:new G("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?Hs(this.board,t.scrollTop+Ut+4):null,this.mode=e,this.urlView||qr(e)}findEvent(e){let t=this.plan?.days.find(o=>o.date===e.day),i=t?.events.find(o=>o.id===e.event);return t&&i?{day:t,event:i}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),i=this.dayIndexOf(e.day);!t||i<0||this.scrollToTime(i*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,i){if(!this.pending){this.pending={key:e,value:t};try{await i()}catch(o){let a=o instanceof G?o:new G("error",String(o));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,t,i){if(!this.backend)return;let o=this.backend;this.save(`${t}`,i,()=>o.setRide(e.id,t,i,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let i=this.backend;this.save("attending",t,()=>i.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t){if(!this.backend)return;let i=this.backend,o=e.along.includes(t)?e.along.filter(a=>a!==t):[...e.along,t];this.save("along",o,()=>i.setTakeAlong(e.id,o,this.scope))}nudgeArrive(e,t){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;t<0?o=(i??e.start)-5:o=i==null||i+5>=e.start?null:i+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Rr)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let i=this.findEvent(t);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,a=i.event.id,r=this.scope;this.save("arrive",e,()=>o.setArriveBy(a,e,r)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),i=e?Fs(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},o=this.wide,a=this.chores?Qs(this.chores,this.today().minutes).filter(d=>!this.choreDone(d)):[],r=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",c=p`<aside class="panel" aria-label=${l}>
      ${r??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,h=this.page==="rides";return p`
      <div class="app ${o?"wide":this.width<Dr?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${h&&e?this.renderWeek(e):_}
          ${h?this.renderBanner(e):_}
          <main>
            ${h?p`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?Yt(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!o&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${c}`:_}
          </main>
        </div>
        ${o?c:_}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:_}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,i){let o=t.problems+i;this.tick;let a=this.today(),r="";if(e){let f=e.time_zone,y=new Date(e.updated);this.error?r=p`<span class="bad">Can’t reach Home Assistant · showing the plan from ${wt(y,new Date,f)}</span>`:e.status&&!e.status.ok?r=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${wt(y,new Date,f)}</span>`:this.backend?.live||(r=`Updated ${wt(y,new Date,f)}`)}let l=(f,y,A,u)=>p`
      <button type="button" class="seg-btn" title=${u} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${A}<span class="seg-label">${y}</span>
      </button>
    `,c=(f,y,A)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${A}<span class="seg-label">${y}</span>
      </button>
    `,h=tt(a.minutes),d=!!e&&Yt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${J`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:_}
        <div class="titles">
          <h1 class="clock" aria-label=${`${be(a.date)}, ${h}`}>
            <span class="hm">${h.slice(0,-3)}</span><span class="ampm">${h.slice(-2)}</span>
          </h1>
          <p class="today-line">${be(a.date)}</p>
          ${r?p`<p class="status">${r}</p>`:_}
        </div>
        ${e&&!d?this.renderNext(e,Vs(e,a),t):_}
        <div class="controls">
          ${this.wide||d&&!i?_:p`<button type="button" class="attn-btn ${o?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${o}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?_:p`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",J`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",J`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${c("rides","Rides",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${c("chores","Chores",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?_:c("lunch","Lunch",J`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,i){if(!t){let c=this.today().date,h=i.unassigned,d=i.laterUnassigned;if(h){let y=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${h} ${h===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?p`<div class="next idle needs">${y}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${y}</button>`}if(d)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${d} ${d===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let f=e.days.some(y=>y.date>=c&&y.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let o;t.ongoing?o="On the road now":t.ahead===0?o=t.inMinutes<180?`Next trip · in ${st(t.inMinutes)}`:"Next trip · later today":t.ahead===1?o="Next trip · tomorrow":o=`Next trip · ${ce(t.date)}`;let a=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,r=p`
      <span class="next-eyebrow">${o}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${ye(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(c=>p`<span class="kid-dot" style="background:${c.color}"></span>`)}</span>
      </span>
      ${t.warn?p`<span class="next-stop warn">${t.warn}</span>`:t.stop?p`<span class="next-stop">${t.stop}</span>`:_}
    `,l=`next ${t.ongoing?"ongoing":a?"soon":""}`;return t.target?p`<button type="button" class=${l} @click=${()=>this.open(t.target)}>${r}</button>`:p`<div class=${l}>${r}</div>`}renderWeek(e){let t=this.today().date,i=pe(e);return p`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let a=$n(o),r=o.events.length,l=o.events.slice(0,6).map(h=>h.own?jt.color:i.get(h.kid)?.color??Z(0).color),c=`${be(o.date)}: ${r?`${r} ${r===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return p`<button
          type="button"
          class="day-tile ${o.date===t?"today":""}"
          data-date=${o.date}
          aria-label=${c}
          @click=${()=>this.goToDay(o.date)}
        >
          <span class="dt-wd">${o.date===t?"Today":ce(o.date)}</span>
          <span class="dt-num">${Number(o.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(h=>p`<span class="dt-dot" style="background:${h}"></span>`):p`<span class="dt-free">free</span>`}
            ${r>6?p`<span class="dt-more">+${r-6}</span>`:_}
          </span>
          ${a?p`<span class="dt-badge" aria-hidden="true">${a}</span>`:_}
        </button>`})}
    </nav>`}renderQuiet(e){let t=_e(e),i=Ce(e),o=pe(e),a=t.map(r=>ge(e,r));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((r,l)=>J`<circle cx=${50+l*30} cy="80" r="11" fill=${o.get(r).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Hr(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(r=>{let l=o.get(r);return p`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${ye(ge(e,r))}</span>
            <span class="qw-name">${ge(e,r)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(r=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${ye(ue(e,r))}</span>
            <span class="qw-name">${ue(e,r)}</span>
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
    </div>`}renderBanner(e){let t=e?.unavailable_calendars.length??0;return t?p`<div class="banner" role="status">
      Couldn’t read ${t===1?"one calendar":`${t} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:_}renderEmpty(){return this.error?p`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:p`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let t=this.sel,i=r=>!!r&&!!t&&r.day===t.day&&r.event===t.event,o=e.dayHeads[0],a=e.width;return p`
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
          ${e.columns.map(r=>p`<div class="col-head ${r.kind}" style="left:${r.x}px;width:${r.w}px;--c:${r.dot};--rgb:${r.rgb}">
              <span class="avatar ${r.kind}" aria-hidden="true">${ye(r.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${r.name}</span>${r.kind==="kid"?this.renderLunchChip(r.id,!0):_}</span>
                <span class="sub ${r.subWarn?"warn":""}">${r.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${a}px">
          <span class="label">${o?.label??""}</span><span class="tag" ?hidden=${!o?.tag}>${o?.tag??""}</span
          ><span class="sub ${o?.warn?"warn":""}">${o?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${a}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(r=>p`<div
                class="col-bg ${r.kind}"
                style="left:${r.x}px;width:${r.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${r.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(r=>p`<div class="day-head" style="top:${r.y}px;width:${a}px">
              <span class="label">${r.label}</span>${r.tag?p`<span class="tag">${r.tag}</span>`:_}<span
                class="sub ${r.warn?"warn":""}"
                >${r.sub}</span
              >
            </div>`)}
          ${e.empties.map(r=>p`<span class="empty" style="top:${r.y}px">${r.text}</span>`)}
          ${e.grid.map(r=>p`<div class="grid ${r.strong?"strong":""}" style="top:${r.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(r=>p`<span class="hour" style="top:${r.y}px">${r.label}</span>`)}
          ${me(e.bands,r=>r.key,r=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:rgba(${r.color.rgb},0.10);border-color:rgba(${r.color.rgb},0.45)"
              ></div>`)}
          ${me(e.busy,r=>r.key,r=>p`<div class="busy" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px">
                <span style="top:${r.labelY}px">${r.label}</span>
              </div>`)}
          ${me(e.windows,r=>r.key,r=>p`<div class="window" aria-hidden="true" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px">
                <span>${r.label}</span>
              </div>`)}
          ${me(e.preps,r=>r.key,r=>p`<div
                class="prep"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:rgba(${r.color.rgb},0.07);color:${r.color.ink}"
              >
                ${r.label}
              </div>`)}
          ${me(e.cards,r=>r.key,r=>{let l=r.color,c=r.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:r.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${r.wrap?"wrap":""} ${i(r.target)?"sel":""} ${r.clash?"clash":""} ${r.skipped?"skipped":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:${c};border-color:${r.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(r.target)}
              >
                <span class="top">
                  <span class="title">${r.title}</span>
                  <span class="time">${r.time}</span>
                  ${r.showDrop&&r.drop?p`<span class="line tone-${r.drop.tone}">${r.drop.text}</span>`:_}
                </span>
                ${r.showPick&&r.pick?p`<span class="line tone-${r.pick.tone}">${r.pick.text}</span>`:_}
              </button>`})}
          ${me(e.rides,r=>r.key,r=>p`<button
                type="button"
                class="ride ${r.dashed?"dashed":""} ${r.clash?"clash":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}</span>${r.show2?p`<span class="l2" style="-webkit-line-clamp:${r.lines2}">${r.l2}</span>`:_}
              </button>`)}
          ${me(e.stays,r=>r.key,r=>p`<button
                type="button"
                class="stay"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:repeating-linear-gradient(135deg, rgba(${r.color.rgb},0.28) 0px, rgba(${r.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1" style="color:${r.color.ink}">${r.l1}</span><span class="l2">${r.l2}</span>
              </button>`)}
          ${me(e.trips,r=>r.key,r=>p`<button
                type="button"
                class="trip ${r.bad?"bad":""} ${r.stops?"list":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}${r.kids.map(l=>p`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${r.show2?p`<span class="l2">${r.l2}</span>`:_}
                ${r.stops?r.stops.map(l=>p`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):_}
                ${r.show3?p`<span class="l3">${r.l3}</span>`:_}
              </button>`)}
          ${me(e.overlaps,r=>r.key,r=>p`<div class="overlap" aria-hidden="true" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`)}
          ${me(e.marks,r=>r.key,r=>p`<span class="mark" style="left:${r.x}px;top:${r.y}px;${r.right?"transform:translateX(-100%)":""}">${r.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:_}
        </div>
      </div>
    `}renderAttention(e,t){let{items:i,problems:o,later:a}=e,r=this.plan,l=o+t.length,c=this.chores,h=!!c&&!En(c);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?_:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${h?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?p`<div class="attn-chores">${t.map(d=>this.renderChoreRow(d,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${r&&!o?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${J`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Yt(r)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:_}
      ${i.map(d=>p`<div class="issue ${d.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${d.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${d.target?p`<button type="button" class="issue-title" @click=${()=>this.open(d.target,!0)}>${d.title}</button>`:p`<strong class="issue-title">${d.title}</strong>`}
              <span class="issue-body"
                >${d.parts?d.parts.map(f=>typeof f=="string"?f:p`<button type="button" class="issue-link" @click=${()=>this.open(f.target,!0)}>${f.text}</button>`):d.body}</span
              >
            </div>
          </div>
          ${d.suggestions.length?p`<div class="fixes">
                ${d.suggestions.map(f=>p`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(f.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${f.id}`?"Saving…":f.label}</span>
                    <span class="fix-note">${f.note}</span>
                  </button>`)}
              </div>`:_}
        </div>`)}
      ${this.wide&&r&&!Yt(r)&&this.page==="rides"?this.renderLegend():_}
    `}kidColorOf(e){let t=this.plan?pe(this.plan).get(e):void 0;if(t)return t;let i=this.lunch?.kids.findIndex(o=>o.id===e)??-1;return Z(Math.max(0,i))}renderLunchChip(e,t=!1){let i=this.lunch,o=i?.kids.find(c=>c.id===e);if(!i||!o)return _;this.tick;let a=this.today(),r=ai(o,a.date,a.minutes,this.lunchDraft);if(!r)return _;let l=pt[r.lunch];return p`<span class="lunch-chip ${r.lunch} ${t?"small":""}" title=${`${l} lunch ${r.when}${r.menu?`: ${r.menu}`:""}`}
      >${r.lunch==="bring"?ci:hi}<span class="lunch-chip-text"
        >${l}${t?_:` ${r.when}`}${!t&&r.menu?p`<span class="lunch-chip-menu"> · ${r.menu}</span>`:_}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let t=si(e),i=this.lunchMonth&&t.includes(this.lunchMonth)?this.lunchMonth:ve(e.today),o=t.indexOf(i),a=h=>{let d=t[o+h];d&&(this.lunchMonth=d)},r=e.kids.some(h=>h.id===this.lunchKid)?this.lunchKid:null,l=r?e.kids.filter(h=>h.id===r):e.kids,c=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:_;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${o<=0} @click=${()=>a(-1)}>
            ${J`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Vt(i)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${o<0||o>=t.length-1} @click=${()=>a(1)}>
            ${J`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":p`${di} Edit menus`}
        </button>
      </div>
      ${c}
      <div class="chore-cols lunch-cols ${r?"wide":""}" style="--n:${l.length}">
        ${l.map(h=>this.renderLunchCard(e,h,i,r!==null))}
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
    </div>`}renderLunchCard(e,t,i,o){let a=this.kidColorOf(t.id),r=ii(e,t,i,this.lunchDraft),l=oi(r),c=r.flat(),h=c.filter(u=>!u.outside&&!u.past&&u.lunch),d=t.days_off.filter(u=>ve(u.first)<=i&&i<=ve(u.last)),f=u=>h.filter(v=>Ft(v.date)===u),y=u=>{let v=f(u);if(!v.length)return;let T=v.every($=>$.lunch==="bring")?"buy":"bring";this.saveLunch(t.id,v.map($=>$.date),T)},A=h.length?`${l.bring} Bring · ${l.buy} Buy${i===ve(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${o?"wide":""}" style="--c:${a.color};--rgb:${a.rgb};--k:${a.ink}" aria-label=${`${t.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${ye(t.name)}</span>
        <span class="ch-text">
          <span class="name">${t.name}</span>
          <span class="sub">${A}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${pt[t.default]} unless picked</span>
          ${e.kids.length<2?_:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${o?"Show everyone’s lunches":`Expand ${t.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=o?null:t.id}
              >
                ${o?Or:Ir}${o?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${t.menu_feed&&!t.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${t.menu_feed.error?`: ${t.menu_feed.error}`:""}.</p>`:_}
      <div class="lunch-grid" role="grid" aria-label=${`${t.name}, ${Vt(i)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((u,v)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f(v).length}
            aria-label=${`${f(v).every(T=>T.lunch==="bring")?"Buy":"Bring"} every ${u} left in ${Vt(i)} for ${t.name}`}
            @click=${()=>y(v)}
          >
            ${u}
          </button>`)}
        ${c.map(u=>this.renderLunchCell(t,u,o))}
      </div>
      ${d.length?p`<p class="lunch-offs">
            No school:
            ${d.map(u=>{let v=u.first<`${i}-01`?`${i}-01`:u.first,T=ve(u.last)>i?Ye(`${Bn(i)}-01`,-1):u.last;return`${v===T?In(v):`${In(v)}–${In(T)}`} ${ri(u.title)}`}).join(" · ")}
          </p>`:_}
    </section>`}renderLunchCell(e,t,i=!1){if(t.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(t.off!==null||!t.lunch)return p`<span class="lunch-day off ${t.today?"today":""}" title=${t.off??""}>
        <span class="lunch-num">${t.day}</span><span class="lunch-word">No school</span>
      </span>`;let o=t.lunch,a=o==="buy"?"bring":"buy",r=t.menu?`, ${t.menu}`:"",l=this.menuMode,c=this.menuEdit?.date===t.date&&this.menuEdit.kids.includes(e.id),h=l?`${e.name}, ${be(t.date)}${r||", no menu yet"}. Tap to ${t.menu?"change":"add"} the menu.`:`${e.name}, ${be(t.date)}: ${pt[o]}${t.picked?"":" (not picked yet)"}${r}. Tap to ${pt[a]}.`;return p`<button
      type="button"
      class="lunch-day ${o} ${t.picked?"picked":"unpicked"} ${t.past?"past":""} ${t.today?"today":""} ${l?"editing":""} ${c?"sel":""}"
      ?disabled=${t.past&&!l}
      aria-label=${h}
      @click=${()=>l?this.editMenu(e,t.date):void this.saveLunch(e.id,[t.date],a)}
    >
      <span class="lunch-num">${t.day}</span>
      <span class="lunch-word">${o==="bring"?ci:hi}${pt[o]}</span>
      ${t.menu?p`<span class="lunch-menu">${t.menu}</span>${i&&t.sides?p`<span class="lunch-sides">${t.sides}</span>`:_}`:l?p`<span class="lunch-menu add">${Gt} Menu</span>`:_}
    </button>`}renderChoreRow(e,t=!1){let i=this.chores,o=this.choreDone(e),a=i.kids.findIndex(T=>T.id===e.kid),r=(this.plan?pe(this.plan).get(e.kid):void 0)??Z(Math.max(0,a)),l=i.kids[a]?.name??"",c=o===Ge(e)?e:{...e,state:o?"done":"open",done_at:o?new Date().toISOString():null},h=o&&c.done_by&&c.done_by!==e.kid?i.people?.find(T=>T.id===c.done_by)?.name??c.done_by_name??null:null,d=`${An(c,i.today,i.time_zone)}${h?` · by ${h}`:""}`,f=o||Ys(e),y=`${t?`${l}: `:""}${e.title}. ${d?`${d}. `:""}${o?"Done. Tap to undo.":"Tap when it’s done."}`,A=p`<span class="box" aria-hidden="true"
        >${o?J`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:_}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:_}
      <span class="chore-text">
        <span class="chore-title">${t?p`<span class="chore-kid">${l}</span> · `:_}${e.title}</span>
        ${d?p`<span class="chore-note">${d}</span>`:_}
      </span>`,u=`chore ${o?"done":""} ${e.state==="overdue"&&!o?"overdue":""} ${f?"":"later"}`,v=`--c:${r.color};--rgb:${r.rgb};--k:${r.ink}`;return f?p`<button type="button" class=${u} style=${v} aria-pressed=${o?"true":"false"} aria-label=${y} @click=${()=>this.tapChore(e)}>
          ${A}
        </button>`:p`<div class=${u} style=${v}>${A}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(En(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Gt} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore templates: Daily</strong> (or Weekly or Monthly). It
          shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(a=>a.problems.length),i=t.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(a=>this.renderTemplateRow(a))}</div>
        </section>`:_;this.tick;let o=Js(e,this.plan?pe(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Gt} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${di} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${o.length}">
        ${o.map(a=>{let r=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return p`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${ye(a.name)}</span>
              <span class="ch-text">
                <span class="name">${a.name}</span>
                <span class="sub">${r?`${r} to do`:a.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(a.kid)}
            </div>
            ${a.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${a.overdue.map(l=>this.renderChoreRow(l))}`:_}
            ${a.now.length?p`<h3 class="chore-group">To do</h3>
                  ${a.now.map(l=>this.renderChoreRow(l))}`:_}
            ${a.done.length?p`<h3 class="chore-group">Done</h3>
                  ${a.done.map(l=>this.renderChoreRow(l))}`:_}
            ${a.later.map(l=>p`<h3 class="chore-group">${l.date===e.today?"Later today":Ur(l.date,e.today)}</h3>
                ${l.chores.map(c=>this.renderChoreRow(c))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?p`<p class="chore-none">No chores this week.</p>`:_}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,o=this.plan?pe(this.plan):void 0,a=this.choreEdit?.template===e.id,r=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(Rn).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${Ln(e.who,i,e.take_turns)} · ${Dn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${a?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:_}</span>
        ${r}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let c=i.findIndex(d=>d.id===l),h=o?.get(l)??Z(Math.max(0,c));return p`<span class="kid-dot" style="background:${h.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day or some days"],["school","School days"],["weekly","Weekly"],["monthly","Monthly"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Gt} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([i,o])=>{let a=e.templates.filter(r=>r.repeats===i);return a.length?p`<section class="manage-group" aria-label=${o}>
                  <h3 class="chore-group">${o}</h3>
                  <div class="tmpl-list">${a.map(r=>this.renderTemplateRow(r))}</div>
                </section>`:_}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the lists <strong>Chore templates: Daily</strong>, <strong>Weekly</strong>,
        <strong>Monthly</strong> and <strong>School days</strong>. A task added there by hand shows up here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return p``;let i=t.kids,o=this.plan?pe(this.plan):void 0,a=this.choreBusy,r=e.template?t.templates.find(u=>u.id===e.template):void 0,l=Pn(e),c=(r?.problems??[]).filter(u=>u!=="who:"),h=(u,v,T,$=!1)=>p`<button type="button" class="choice ${$?"wide":""}" aria-pressed=${u?"true":"false"} ?disabled=${a} @click=${T}>${v}</button>`,d=(u,v,T,$)=>p`<button type="button" class="chip" aria-pressed=${u?"true":"false"} aria-label=${$??_} ?disabled=${a} @click=${T}>${v}</button>`,f=u=>{u!==e.repeats&&this.changeDraft({repeats:u,days:r&&r.repeats===u?r.days??Kt(u):Kt(u)})},y=u=>{let v=e.who.includes(u)?e.who.filter(T=>T!==u):i.filter(T=>T.id===u||e.who.includes(T.id)).map(T=>T.id);this.changeDraft({who:v})},A;if(e.repeats==="school"){let u=e.days===je?new Set:e.days===""?new Set([0,1,2,3,4]):Mn(e.days)??new Set,v=T=>{let $=new Set(u);$.has(T)?$.delete(T):$.add(T),this.changeDraft({days:$.size===5?"":$.size?qt($):je})};A=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${He.slice(0,5).map((T,$)=>d(u.has($),T.slice(0,2),()=>v($),T))}
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
        </div>`}else if(e.repeats==="monthly"){let u=e.days.trim(),v=/^\d+$/.test(u)?Number(u):null,T=u&&u.toLowerCase()!=="any"&&u.toLowerCase()!=="last"&&v===null;A=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${T?4:3}, minmax(0, 1fr))">
          ${h(u===""||u.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${h(v!==null,"On a date",()=>this.changeDraft({days:String(v??1)}))}
          ${h(u.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${T?h(!0,u,()=>{}):_}
        </div>
        ${v!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${a||v<=1} @click=${()=>this.changeDraft({days:String(v-1)})}>−</button>
                <span class="arrive-value">${Sn(v)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${a||v>=31} @click=${()=>this.changeDraft({days:String(v+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${u.toLowerCase()==="last"?"Due on the month’s last day.":T?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else{let u=e.repeats==="weekly"&&(e.days===""||e.days.toLowerCase()==="any"),v=e.days===je?new Set:u?new Set:Mn(e.days)??new Set,T=$=>{let U=new Set(v);U.has($)?U.delete($):U.add($),e.repeats==="weekly"?this.changeDraft({days:U.size?qt(U)||"Mon-Sun":"Any"}):this.changeDraft({days:U.size?qt(U):je})};A=p`<div class="field">
        <span class="field-label">${e.repeats==="weekly"?"Which day":"Which days"}</span>
        ${e.repeats==="weekly"?p`<div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
              ${h(u,"Any day that week",()=>this.changeDraft({days:"Any"}))}
              ${h(!u,"On a set day",()=>this.changeDraft({days:u?"Sat":e.days}))}
            </div>`:_}
        ${e.repeats==="daily"||!u?p`<div role="group" aria-label="Days of the week" class="day-chips">
              ${He.map(($,U)=>d(v.has(U),$.slice(0,2),()=>T(U),$))}
            </div>`:_}
        ${e.repeats==="daily"?p`<div class="chips">
              ${d(e.days==="","Every day",()=>this.changeDraft({days:""}))}
              ${d(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
              ${d(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
            </div>`:p`<p class="field-hint">${u?"Shows all week, due on Sunday.":"Due that day."}</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:_}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Ln(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===je?"No days picked":Dn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${a} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${c.length?p`<p class="field-hint bad">${c.map(Rn).join(". ")}. Saving fixes it.</p>`:_}
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
          @input=${u=>this.changeDraft({title:u.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${Nr.map(u=>d(e.icon===u,u,()=>this.changeDraft({icon:e.icon===u?null:u}),`Picture ${u}`))}
        </div>
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((u,v)=>{let T=o?.get(u.id)??Z(v),$=e.who.includes(u.id);return p`<button type="button" class="who-chip" style="--c:${T.color};--rgb:${T.rgb}" aria-pressed=${$?"true":"false"} ?disabled=${a} @click=${()=>y(u.id)}>
              <span class="avatar" aria-hidden="true">${ye(u.name)}</span>${u.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${h(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${h(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:_}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${h(e.repeats==="daily","Days",()=>f("daily"))}
          ${h(e.repeats==="school","School days",()=>f("school"))}
          ${h(e.repeats==="weekly","Weekly",()=>f("weekly"))}
          ${h(e.repeats==="monthly","Monthly",()=>f("monthly"))}
        </div>
      </div>
      ${A}
      ${e.repeats==="school"?_:p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Repeats</span>
          <span class="field-hint">${zr(e.repeats,e.every)}</span>
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
          @input=${u=>this.changeDraft({details:u.target.value})}
        ></textarea>
      </div>
      ${e.template?p`<div class="field">
              ${h(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${a} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:_}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${a?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let t=this.lunch;if(!t)return p``;let i=e.busy,o=h=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...h})},a=h=>o({kids:e.kids.includes(h)?e.kids.filter(d=>d!==h):[...e.kids,h]}),r=t.kids.filter(h=>ct(h,e.date)),l=e.dish.trim(),c=e.kids.length?l?null:"Type what’s served":"Pick who gets this menu";return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${be(e.date)}</span>
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
          @input=${h=>o({dish:h.target.value})}
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
          @input=${h=>o({details:h.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${r.map(h=>{let d=this.kidColorOf(h.id),f=e.kids.includes(h.id);return p`<button type="button" class="who-chip" style="--c:${d.color};--rgb:${d.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${i} @click=${()=>a(h.id)}>
              <span class="avatar" aria-hidden="true">${ye(h.name)}</span>${h.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${l||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${i||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:_}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${i||!!c} @click=${()=>void this.saveMenu()}>
          ${i?"Saving to Google Calendar…":c??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return p``;let i=t.people?.length?t.people:t.kids.map(d=>({...d,role:"kid"})),o=t.kids.findIndex(d=>d.id===e.kid),a=t.kids[o],r=this.plan?pe(this.plan):void 0,l=r?.get(e.kid)??Z(Math.max(0,o)),c=i.filter(d=>d.id!==e.kid),h=d=>{let f=t.kids.findIndex(y=>y.id===d.id);return f>=0?(r?.get(d.id)??Z(f)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:_}${e.title}</span>
          <span class="ed-meta">${a?.name??""} · ${An(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${ye(a?.name??"?")}</span>
          <span>${a?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${c.map(d=>p`<button type="button" class="done-by" style="--c:${h(d)}" @click=${()=>void this.toggleChore(e,d.id)}>
                  <span class="avatar ${d.role==="parent"?"driver":""}" aria-hidden="true">${ye(d.name)}</span>
                  <span>${d.name}</span>
                </button>`)}
            </div>`:p`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Someone else did</button>`}
      </div>
    `}renderLegend(){return p`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}ownHint(e,t){let i=Ht(e,t);if(t.takes!=null){let a=t.planned!=null?`It’s fitted in at ${R(t.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${t.takes} min any time from ${R(t.start)} to ${R(t.end)}. ${a}, around ${i}’s other trips. Errands go alone.`}let o=t.along.map(a=>Ce(e).includes(a)?ue(e,a):ge(e,a));return`${i} drives there and back${o.length?`, with ${wn(o)}`:""}.`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return p``;let{day:i,event:o}=t,a=Ce(e),r=zs(e,o),l=Ht(e,o),c=!!this.pending,h=C=>this.pending?.key===C?this.pending.value:void 0,d=[...e.people?.carpools??[]];for(let C of e.days)for(let O of C.events)for(let B of[O.drop,O.pick])B&&B!=="none"&&!a.includes(B)&&!d.some(F=>F.toLowerCase()===B.toLowerCase())&&d.push(B);let f=C=>{if(!o.sides.includes(C))return _;let O=h(C),B=O!==void 0?String(O):C==="drop"?o.drop:o.pick,F=B&&B!=="none"&&!a.includes(B)?B:"",L=z=>this.setRide(o,C,B===z?"":z),j=[...a.map(z=>[z,yn(e,z)]),["none","Not needed"]];return p`<div class="field">
        <span class="field-label">${C==="drop"?"Drop-off":"Pick-up"} ${B===""?p`<span class="nobody">· nobody yet</span>`:_}</span>
        <div role="group" aria-label=${C==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${j.length}, minmax(0, 1fr))">
          ${j.map(([z,Y])=>p`<button type="button" class="choice" aria-pressed=${B===z?"true":"false"} ?disabled=${c} @click=${()=>L(z)}>
                ${Y}
              </button>`)}
        </div>
        ${d.length?p`<div role="group" aria-label=${C==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${d.map(z=>p`<button type="button" class="chip" aria-pressed=${B.toLowerCase()===z.toLowerCase()?"true":"false"} ?disabled=${c} @click=${()=>L(z)}>
                    ${z}
                  </button>`)}
            </div>`:_}
        <input
          type="text"
          .value=${F&&!d.some(z=>z.toLowerCase()===F.toLowerCase())?F:""}
          ?disabled=${c}
          aria-label=${C==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${z=>{let Y=z.target.value.trim();Y&&Y!==B&&this.setRide(o,C,Y)}}
          @keydown=${z=>{z.key==="Enter"&&z.target.blur()}}
        />
      </div>`},y=h("stay"),A=y!==void 0?!!y:o.stay,u=o.drop===o.pick&&a.includes(o.drop),v=h("along"),T=v!==void 0?v:o.along,$=o.own?[..._e(e),...a.filter(C=>C!==o.own)]:_e(e).filter(C=>C!==o.kid),U=o.own!=null&&o.takes!=null,oe=a.includes(o.drop)&&o.sides.includes("drop")&&!U,H=h("arrive"),ae=this.arriveDraft!==void 0?this.arriveDraft:H!==void 0?H:o.arrive_by,m=[],k=C=>C==="none"?"Not needed":yn(e,C);!o.own&&o.drop!==""&&m.push(`Drop-off: ${k(o.drop)}`),!o.own&&o.pick!==""&&m.push(`Pick-up: ${k(o.pick)}`),!o.own&&o.stay&&m.push("Stay: yes"),U&&m.push(`Takes: ${o.takes} min`),o.along.length&&m.push(`Take along: ${o.along.map(C=>a.includes(C)?ue(e,C):ge(e,C)).join(", ")}`),o.arrive_by!=null&&m.push(`Arrive by: ${tt(o.arrive_by)}`);let b=h("attending"),x=b!==void 0?!!b:o.attending!==!1;o.attending===!1&&m.splice(0,m.length,"Attending: no");let w=i.date===this.today().date?"":`${ce(i.date)} · `,M=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${r.color}"></span>${l} · ${o.title}</span>
          <span class="ed-meta">${w}${U?"any time ":""}${R(o.start)}–${R(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return o.where==="home"?p`${M}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${l} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${M}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:_}
      ${o.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ce(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:_}
      <div class="field">
        <span class="field-label">${l} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${x?"true":"false"} ?disabled=${c} @click=${()=>this.setAttending(o,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${x?"false":"true"} ?disabled=${c} @click=${()=>this.setAttending(o,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${x?p`${o.where==="anywhere"?p`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:_}
            ${o.own?p`<p class="field-hint">${this.ownHint(e,o)}</p>`:p`${f("drop")} ${f("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${A?"true":"false"} ?disabled=${!u||c} @click=${()=>this.toggleStay(o)}>
                      ${u?A?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                  </div>`}
      ${oe&&$.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label=${o.own?"Who goes along":"Kids taken along"} class="chips">
              ${$.map(C=>p`<button type="button" class="chip" aria-pressed=${T.includes(C)?"true":"false"} ?disabled=${c} @click=${()=>this.toggleAlong(o,C)}>
                  ${a.includes(C)?ue(e,C):ge(e,C)}
                </button>`)}
            </div>
          </div>`:_}
      ${U?_:p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${ae!=null?`${o.start-ae} min before it starts`:`Aims for a few minutes before ${R(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${c} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${ae!=null?R(ae):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${c||ae==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${ae!=null?p`<button type="button" class="chip clear" ?disabled=${c} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:_}`}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${m.length?m.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:_}
      ${x&&!o.own?p`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:_}
    `}};ut.styles=li,ut.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",ut);function Kr(){let s=[document];for(let n of document.querySelectorAll("*"))n.shadowRoot&&s.push(n.shadowRoot);return s}function ui(s=3e3){let n=new CSSStyleSheet;n.replaceSync("*, *::before, *::after { cursor: none !important; }"),n.disabled=!0;let e,t=o=>{if(o)for(let a of Kr())a.adoptedStyleSheets.includes(n)||(a.adoptedStyleSheets=[...a.adoptedStyleSheets,n]);n.disabled=!o},i=o=>{if(clearTimeout(e),o.pointerType==="touch"){t(!0);return}t(!1),e=setTimeout(()=>t(!0),s)};window.addEventListener("pointermove",i,{passive:!0}),window.addEventListener("pointerdown",i,{passive:!0}),e=setTimeout(()=>t(!0),s)}var fi=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],gi=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function mi(s,n,e,t){let i=Math.max(0,Math.min(n,s.length)),o=Math.max(i,Math.min(e,s.length));return{value:s.slice(0,i)+t+s.slice(o),caret:i+t.length}}function bi(s,n,e){let t=Math.max(0,Math.min(n,s.length)),i=Math.max(t,Math.min(e,s.length));if(t!==i)return{value:s.slice(0,t)+s.slice(i),caret:t};if(t===0)return{value:s,caret:0};let o=Array.from(s.slice(0,t));o.pop();let a=o.join("");return{value:a+s.slice(t),caret:a.length}}function xi(s,n){return n===0||/\s$/.test(s.slice(0,n))}var Wr=new Set(["text","search","email","url","tel","number","password"]);function vi(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Wr.has(s.type)&&!s.readOnly&&!s.disabled}var Fr={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Vr={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},ft=class extends fe{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=t=>t.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let t=e.selectionStart,i=e.selectionEnd;if(t!==null&&i!==null)return[t,i]}catch{}return[e.value.length,e.value.length]}apply(e,t,i){e.value=t;try{e.setSelectionRange(i,i)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=xi(this.field.value,e)}press(e){let t=this.field;if(t){switch(e){case"hide":t.blur();return;case"done":this.commit(),t.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),t.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[i,o]=this.selection(t),a=bi(t.value,i,o);this.apply(t,a.value,a.caret);break}default:{let i=e==="space"?" ":this.shift?e.toUpperCase():e,[o,a]=this.selection(t),r=mi(t.value,o,a,i);this.apply(t,r.value,r.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let t=e.length>1,i=e==="layout"?this.layout==="letters"?"123":"ABC":Fr[e]??(this.shift?e.toUpperCase():e);return p`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":t?"wide":""}
      aria-label=${Vr[e]??i}
      aria-pressed=${e==="shift"?String(this.shift):_}
      @click=${()=>this.press(e)}
    >
      ${i}
    </button>`}render(){let e=this.layout==="letters"?fi:gi;return p`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(t=>p`<div class="row">${t.map(i=>this.key(i))}</div>`)}
      </div>`}};ft.styles=Re`
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
  `,ft.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",ft);function Gr(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function yi(s){let n=new WeakSet,e=a=>{let r=a.composedPath();o(r);let l=r[0];vi(l)&&s.attach(l)},t=()=>{setTimeout(()=>{let a=Gr();!s.target||a===s.target||(vi(a)?s.attach(a):s.detach())},0)},i=a=>{n.has(a)||(n.add(a),a.addEventListener("focusin",e),a.addEventListener("focusout",t))},o=a=>{for(let r of a)r instanceof ShadowRoot&&i(r)};i(document),document.addEventListener("pointerdown",a=>o(a.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var On="mydashlight",Yr=`/api/${On}/pair`,Jr=`/api/${On}/pair/poll`,zn=`/${On}`,Un="pair";function wi(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function $i(s,n){return`${s}${zn}?${Un}=${encodeURIComponent(n)}`}function Qr(s,n,e=Date.now()){return{hassUrl:s,clientId:n.client_id,access_token:n.access_token,refresh_token:n.refresh_token,expires_in:n.expires_in,expires:e+n.expires_in*1e3}}var qe=class extends Error{constructor(n,e=!1){super(n),this.busy=e}};async function ki(s=fetch){let n=await s(Yr,{method:"POST",cache:"no-store"});if(n.status===429)throw new qe("Too many screens are asking to pair right now.",!0);if(!n.ok)throw new qe(`Home Assistant answered ${n.status}.`);return await n.json()}async function _i(s,n,e=fetch){let t=await e(Jr,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(t.status===404)return{status:"expired"};if(!t.ok)throw new qe(`Home Assistant answered ${t.status}.`);let i=await t.json();return i.status==="paired"&&i.auth?{status:"paired",auth:Qr(n,i.auth)}:{status:"pending"}}var Qe=function(s,n){let i=s,o=gt[n],a=null,r=0,l=null,c=[],h={},d=function(m,k){r=i*4+17,a=(function(b){let x=new Array(b);for(let w=0;w<b;w+=1){x[w]=new Array(b);for(let M=0;M<b;M+=1)x[w][M]=null}return x})(r),f(0,0),f(r-7,0),f(0,r-7),u(),A(),T(m,k),i>=7&&v(m),l==null&&(l=oe(i,o,c)),$(l,k)},f=function(m,k){for(let b=-1;b<=7;b+=1)if(!(m+b<=-1||r<=m+b))for(let x=-1;x<=7;x+=1)k+x<=-1||r<=k+x||(0<=b&&b<=6&&(x==0||x==6)||0<=x&&x<=6&&(b==0||b==6)||2<=b&&b<=4&&2<=x&&x<=4?a[m+b][k+x]=!0:a[m+b][k+x]=!1)},y=function(){let m=0,k=0;for(let b=0;b<8;b+=1){d(!0,b);let x=Me.getLostPoint(h);(b==0||m>x)&&(m=x,k=b)}return k},A=function(){for(let m=8;m<r-8;m+=1)a[m][6]==null&&(a[m][6]=m%2==0);for(let m=8;m<r-8;m+=1)a[6][m]==null&&(a[6][m]=m%2==0)},u=function(){let m=Me.getPatternPosition(i);for(let k=0;k<m.length;k+=1)for(let b=0;b<m.length;b+=1){let x=m[k],w=m[b];if(a[x][w]==null)for(let M=-2;M<=2;M+=1)for(let C=-2;C<=2;C+=1)M==-2||M==2||C==-2||C==2||M==0&&C==0?a[x+M][w+C]=!0:a[x+M][w+C]=!1}},v=function(m){let k=Me.getBCHTypeNumber(i);for(let b=0;b<18;b+=1){let x=!m&&(k>>b&1)==1;a[Math.floor(b/3)][b%3+r-8-3]=x}for(let b=0;b<18;b+=1){let x=!m&&(k>>b&1)==1;a[b%3+r-8-3][Math.floor(b/3)]=x}},T=function(m,k){let b=o<<3|k,x=Me.getBCHTypeInfo(b);for(let w=0;w<15;w+=1){let M=!m&&(x>>w&1)==1;w<6?a[w][8]=M:w<8?a[w+1][8]=M:a[r-15+w][8]=M}for(let w=0;w<15;w+=1){let M=!m&&(x>>w&1)==1;w<8?a[8][r-w-1]=M:w<9?a[8][15-w-1+1]=M:a[8][15-w-1]=M}a[r-8][8]=!m},$=function(m,k){let b=-1,x=r-1,w=7,M=0,C=Me.getMaskFunction(k);for(let O=r-1;O>0;O-=2)for(O==6&&(O-=1);;){for(let B=0;B<2;B+=1)if(a[x][O-B]==null){let F=!1;M<m.length&&(F=(m[M]>>>w&1)==1),C(x,O-B)&&(F=!F),a[x][O-B]=F,w-=1,w==-1&&(M+=1,w=7)}if(x+=b,x<0||r<=x){x-=b,b=-b;break}}},U=function(m,k){let b=0,x=0,w=0,M=new Array(k.length),C=new Array(k.length);for(let L=0;L<k.length;L+=1){let j=k[L].dataCount,z=k[L].totalCount-j;x=Math.max(x,j),w=Math.max(w,z),M[L]=new Array(j);for(let g=0;g<M[L].length;g+=1)M[L][g]=255&m.getBuffer()[g+b];b+=j;let Y=Me.getErrorCorrectPolynomial(z),Te=mt(M[L],Y.getLength()-1).mod(Y);C[L]=new Array(Y.getLength()-1);for(let g=0;g<C[L].length;g+=1){let S=g+Te.getLength()-C[L].length;C[L][g]=S>=0?Te.getAt(S):0}}let O=0;for(let L=0;L<k.length;L+=1)O+=k[L].totalCount;let B=new Array(O),F=0;for(let L=0;L<x;L+=1)for(let j=0;j<k.length;j+=1)L<M[j].length&&(B[F]=M[j][L],F+=1);for(let L=0;L<w;L+=1)for(let j=0;j<k.length;j+=1)L<C[j].length&&(B[F]=C[j][L],F+=1);return B},oe=function(m,k,b){let x=Ci.getRSBlocks(m,k),w=Ti();for(let C=0;C<b.length;C+=1){let O=b[C];w.put(O.getMode(),4),w.put(O.getLength(),Me.getLengthInBits(O.getMode(),m)),O.write(w)}let M=0;for(let C=0;C<x.length;C+=1)M+=x[C].dataCount;if(w.getLengthInBits()>M*8)throw"code length overflow. ("+w.getLengthInBits()+">"+M*8+")";for(w.getLengthInBits()+4<=M*8&&w.put(0,4);w.getLengthInBits()%8!=0;)w.putBit(!1);for(;!(w.getLengthInBits()>=M*8||(w.put(236,8),w.getLengthInBits()>=M*8));)w.put(17,8);return U(w,x)};h.addData=function(m,k){k=k||"Byte";let b=null;switch(k){case"Numeric":b=Zr(m);break;case"Alphanumeric":b=Xr(m);break;case"Byte":b=eo(m);break;case"Kanji":b=to(m);break;default:throw"mode:"+k}c.push(b),l=null},h.isDark=function(m,k){if(m<0||r<=m||k<0||r<=k)throw m+","+k;return a[m][k]},h.getModuleCount=function(){return r},h.make=function(){if(i<1){let m=1;for(;m<40;m++){let k=Ci.getRSBlocks(m,o),b=Ti();for(let w=0;w<c.length;w++){let M=c[w];b.put(M.getMode(),4),b.put(M.getLength(),Me.getLengthInBits(M.getMode(),m)),M.write(b)}let x=0;for(let w=0;w<k.length;w++)x+=k[w].dataCount;if(b.getLengthInBits()<=x*8)break}i=m}d(!1,y())},h.createTableTag=function(m,k){m=m||2,k=typeof k>"u"?m*4:k;let b="";b+='<table style="',b+=" border-width: 0px; border-style: none;",b+=" border-collapse: collapse;",b+=" padding: 0px; margin: "+k+"px;",b+='">',b+="<tbody>";for(let x=0;x<h.getModuleCount();x+=1){b+="<tr>";for(let w=0;w<h.getModuleCount();w+=1)b+='<td style="',b+=" border-width: 0px; border-style: none;",b+=" border-collapse: collapse;",b+=" padding: 0px; margin: 0px;",b+=" width: "+m+"px;",b+=" height: "+m+"px;",b+=" background-color: ",b+=h.isDark(x,w)?"#000000":"#ffffff",b+=";",b+='"/>';b+="</tr>"}return b+="</tbody>",b+="</table>",b},h.createSvgTag=function(m,k,b,x){let w={};typeof arguments[0]=="object"&&(w=arguments[0],m=w.cellSize,k=w.margin,b=w.alt,x=w.title),m=m||2,k=typeof k>"u"?m*4:k,b=typeof b=="string"?{text:b}:b||{},b.text=b.text||null,b.id=b.text?b.id||"qrcode-description":null,x=typeof x=="string"?{text:x}:x||{},x.text=x.text||null,x.id=x.text?x.id||"qrcode-title":null;let M=h.getModuleCount()*m+k*2,C,O,B,F,L="",j;for(j="l"+m+",0 0,"+m+" -"+m+",0 0,-"+m+"z ",L+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',L+=w.scalable?"":' width="'+M+'px" height="'+M+'px"',L+=' viewBox="0 0 '+M+" "+M+'" ',L+=' preserveAspectRatio="xMinYMin meet"',L+=x.text||b.text?' role="img" aria-labelledby="'+H([x.id,b.id].join(" ").trim())+'"':"",L+=">",L+=x.text?'<title id="'+H(x.id)+'">'+H(x.text)+"</title>":"",L+=b.text?'<description id="'+H(b.id)+'">'+H(b.text)+"</description>":"",L+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',L+='<path d="',B=0;B<h.getModuleCount();B+=1)for(F=B*m+k,C=0;C<h.getModuleCount();C+=1)h.isDark(B,C)&&(O=C*m+k,L+="M"+O+","+F+j);return L+='" stroke="transparent" fill="black"/>',L+="</svg>",L},h.createDataURL=function(m,k){m=m||2,k=typeof k>"u"?m*4:k;let b=h.getModuleCount()*m+k*2,x=k,w=b-k;return ro(b,b,function(M,C){if(x<=M&&M<w&&x<=C&&C<w){let O=Math.floor((M-x)/m),B=Math.floor((C-x)/m);return h.isDark(B,O)?0:1}else return 1})},h.createImgTag=function(m,k,b){m=m||2,k=typeof k>"u"?m*4:k;let x=h.getModuleCount()*m+k*2,w="";return w+="<img",w+=' src="',w+=h.createDataURL(m,k),w+='"',w+=' width="',w+=x,w+='"',w+=' height="',w+=x,w+='"',b&&(w+=' alt="',w+=H(b),w+='"'),w+="/>",w};let H=function(m){let k="";for(let b=0;b<m.length;b+=1){let x=m.charAt(b);switch(x){case"<":k+="&lt;";break;case">":k+="&gt;";break;case"&":k+="&amp;";break;case'"':k+="&quot;";break;default:k+=x;break}}return k},ae=function(m){m=typeof m>"u"?2:m;let b=h.getModuleCount()*1+m*2,x=m,w=b-m,M,C,O,B,F,L={"██":"█","█ ":"▀"," █":"▄","  ":" "},j={"██":"▀","█ ":"▀"," █":" ","  ":" "},z="";for(M=0;M<b;M+=2){for(O=Math.floor((M-x)/1),B=Math.floor((M+1-x)/1),C=0;C<b;C+=1)F="█",x<=C&&C<w&&x<=M&&M<w&&h.isDark(O,Math.floor((C-x)/1))&&(F=" "),x<=C&&C<w&&x<=M+1&&M+1<w&&h.isDark(B,Math.floor((C-x)/1))?F+=" ":F+="█",z+=m<1&&M+1>=w?j[F]:L[F];z+=`
`}return b%2&&m>0?z.substring(0,z.length-b-1)+Array(b+1).join("▀"):z.substring(0,z.length-1)};return h.createASCII=function(m,k){if(m=m||1,m<2)return ae(k);m-=1,k=typeof k>"u"?m*2:k;let b=h.getModuleCount()*m+k*2,x=k,w=b-k,M,C,O,B,F=Array(m+1).join("██"),L=Array(m+1).join("  "),j="",z="";for(M=0;M<b;M+=1){for(O=Math.floor((M-x)/m),z="",C=0;C<b;C+=1)B=1,x<=C&&C<w&&x<=M&&M<w&&h.isDark(O,Math.floor((C-x)/m))&&(B=0),z+=B?F:L;for(O=0;O<m;O+=1)j+=z+`
`}return j.substring(0,j.length-1)},h.renderTo2dContext=function(m,k){k=k||2;let b=h.getModuleCount();for(let x=0;x<b;x++)for(let w=0;w<b;w++)m.fillStyle=h.isDark(x,w)?"black":"white",m.fillRect(w*k,x*k,k,k)},h};Qe.stringToBytes=function(s){let n=[];for(let e=0;e<s.length;e+=1){let t=s.charCodeAt(e);n.push(t&255)}return n};Qe.createStringToBytes=function(s,n){let e=(function(){let i=so(s),o=function(){let l=i.read();if(l==-1)throw"eof";return l},a=0,r={};for(;;){let l=i.read();if(l==-1)break;let c=o(),h=o(),d=o(),f=String.fromCharCode(l<<8|c),y=h<<8|d;r[f]=y,a+=1}if(a!=n)throw a+" != "+n;return r})(),t=63;return function(i){let o=[];for(let a=0;a<i.length;a+=1){let r=i.charCodeAt(a);if(r<128)o.push(r);else{let l=e[i.charAt(a)];typeof l=="number"?(l&255)==l?o.push(l):(o.push(l>>>8),o.push(l&255)):o.push(t)}}return o}};var re={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},gt={L:1,M:0,Q:3,H:2},Ee={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Me=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,e=7973,t=21522,i={},o=function(a){let r=0;for(;a!=0;)r+=1,a>>>=1;return r};return i.getBCHTypeInfo=function(a){let r=a<<10;for(;o(r)-o(n)>=0;)r^=n<<o(r)-o(n);return(a<<10|r)^t},i.getBCHTypeNumber=function(a){let r=a<<12;for(;o(r)-o(e)>=0;)r^=e<<o(r)-o(e);return a<<12|r},i.getPatternPosition=function(a){return s[a-1]},i.getMaskFunction=function(a){switch(a){case Ee.PATTERN000:return function(r,l){return(r+l)%2==0};case Ee.PATTERN001:return function(r,l){return r%2==0};case Ee.PATTERN010:return function(r,l){return l%3==0};case Ee.PATTERN011:return function(r,l){return(r+l)%3==0};case Ee.PATTERN100:return function(r,l){return(Math.floor(r/2)+Math.floor(l/3))%2==0};case Ee.PATTERN101:return function(r,l){return r*l%2+r*l%3==0};case Ee.PATTERN110:return function(r,l){return(r*l%2+r*l%3)%2==0};case Ee.PATTERN111:return function(r,l){return(r*l%3+(r+l)%2)%2==0};default:throw"bad maskPattern:"+a}},i.getErrorCorrectPolynomial=function(a){let r=mt([1],0);for(let l=0;l<a;l+=1)r=r.multiply(mt([1,Pe.gexp(l)],0));return r},i.getLengthInBits=function(a,r){if(1<=r&&r<10)switch(a){case re.MODE_NUMBER:return 10;case re.MODE_ALPHA_NUM:return 9;case re.MODE_8BIT_BYTE:return 8;case re.MODE_KANJI:return 8;default:throw"mode:"+a}else if(r<27)switch(a){case re.MODE_NUMBER:return 12;case re.MODE_ALPHA_NUM:return 11;case re.MODE_8BIT_BYTE:return 16;case re.MODE_KANJI:return 10;default:throw"mode:"+a}else if(r<41)switch(a){case re.MODE_NUMBER:return 14;case re.MODE_ALPHA_NUM:return 13;case re.MODE_8BIT_BYTE:return 16;case re.MODE_KANJI:return 12;default:throw"mode:"+a}else throw"type:"+r},i.getLostPoint=function(a){let r=a.getModuleCount(),l=0;for(let d=0;d<r;d+=1)for(let f=0;f<r;f+=1){let y=0,A=a.isDark(d,f);for(let u=-1;u<=1;u+=1)if(!(d+u<0||r<=d+u))for(let v=-1;v<=1;v+=1)f+v<0||r<=f+v||u==0&&v==0||A==a.isDark(d+u,f+v)&&(y+=1);y>5&&(l+=3+y-5)}for(let d=0;d<r-1;d+=1)for(let f=0;f<r-1;f+=1){let y=0;a.isDark(d,f)&&(y+=1),a.isDark(d+1,f)&&(y+=1),a.isDark(d,f+1)&&(y+=1),a.isDark(d+1,f+1)&&(y+=1),(y==0||y==4)&&(l+=3)}for(let d=0;d<r;d+=1)for(let f=0;f<r-6;f+=1)a.isDark(d,f)&&!a.isDark(d,f+1)&&a.isDark(d,f+2)&&a.isDark(d,f+3)&&a.isDark(d,f+4)&&!a.isDark(d,f+5)&&a.isDark(d,f+6)&&(l+=40);for(let d=0;d<r;d+=1)for(let f=0;f<r-6;f+=1)a.isDark(f,d)&&!a.isDark(f+1,d)&&a.isDark(f+2,d)&&a.isDark(f+3,d)&&a.isDark(f+4,d)&&!a.isDark(f+5,d)&&a.isDark(f+6,d)&&(l+=40);let c=0;for(let d=0;d<r;d+=1)for(let f=0;f<r;f+=1)a.isDark(f,d)&&(c+=1);let h=Math.abs(100*c/r/r-50)/5;return l+=h*10,l},i})(),Pe=(function(){let s=new Array(256),n=new Array(256);for(let t=0;t<8;t+=1)s[t]=1<<t;for(let t=8;t<256;t+=1)s[t]=s[t-4]^s[t-5]^s[t-6]^s[t-8];for(let t=0;t<255;t+=1)n[s[t]]=t;let e={};return e.glog=function(t){if(t<1)throw"glog("+t+")";return n[t]},e.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return s[t]},e})(),mt=function(s,n){if(typeof s.length>"u")throw s.length+"/"+n;let e=(function(){let i=0;for(;i<s.length&&s[i]==0;)i+=1;let o=new Array(s.length-i+n);for(let a=0;a<s.length-i;a+=1)o[a]=s[a+i];return o})(),t={};return t.getAt=function(i){return e[i]},t.getLength=function(){return e.length},t.multiply=function(i){let o=new Array(t.getLength()+i.getLength()-1);for(let a=0;a<t.getLength();a+=1)for(let r=0;r<i.getLength();r+=1)o[a+r]^=Pe.gexp(Pe.glog(t.getAt(a))+Pe.glog(i.getAt(r)));return mt(o,0)},t.mod=function(i){if(t.getLength()-i.getLength()<0)return t;let o=Pe.glog(t.getAt(0))-Pe.glog(i.getAt(0)),a=new Array(t.getLength());for(let r=0;r<t.getLength();r+=1)a[r]=t.getAt(r);for(let r=0;r<i.getLength();r+=1)a[r]^=Pe.gexp(Pe.glog(i.getAt(r))+o);return mt(a,0).mod(i)},t},Ci=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],n=function(i,o){let a={};return a.totalCount=i,a.dataCount=o,a},e={},t=function(i,o){switch(o){case gt.L:return s[(i-1)*4+0];case gt.M:return s[(i-1)*4+1];case gt.Q:return s[(i-1)*4+2];case gt.H:return s[(i-1)*4+3];default:return}};return e.getRSBlocks=function(i,o){let a=t(i,o);if(typeof a>"u")throw"bad rs block @ typeNumber:"+i+"/errorCorrectionLevel:"+o;let r=a.length/3,l=[];for(let c=0;c<r;c+=1){let h=a[c*3+0],d=a[c*3+1],f=a[c*3+2];for(let y=0;y<h;y+=1)l.push(n(d,f))}return l},e})(),Ti=function(){let s=[],n=0,e={};return e.getBuffer=function(){return s},e.getAt=function(t){let i=Math.floor(t/8);return(s[i]>>>7-t%8&1)==1},e.put=function(t,i){for(let o=0;o<i;o+=1)e.putBit((t>>>i-o-1&1)==1)},e.getLengthInBits=function(){return n},e.putBit=function(t){let i=Math.floor(n/8);s.length<=i&&s.push(0),t&&(s[i]|=128>>>n%8),n+=1},e},Zr=function(s){let n=re.MODE_NUMBER,e=s,t={};t.getMode=function(){return n},t.getLength=function(a){return e.length},t.write=function(a){let r=e,l=0;for(;l+2<r.length;)a.put(i(r.substring(l,l+3)),10),l+=3;l<r.length&&(r.length-l==1?a.put(i(r.substring(l,l+1)),4):r.length-l==2&&a.put(i(r.substring(l,l+2)),7))};let i=function(a){let r=0;for(let l=0;l<a.length;l+=1)r=r*10+o(a.charAt(l));return r},o=function(a){if("0"<=a&&a<="9")return a.charCodeAt(0)-48;throw"illegal char :"+a};return t},Xr=function(s){let n=re.MODE_ALPHA_NUM,e=s,t={};t.getMode=function(){return n},t.getLength=function(o){return e.length},t.write=function(o){let a=e,r=0;for(;r+1<a.length;)o.put(i(a.charAt(r))*45+i(a.charAt(r+1)),11),r+=2;r<a.length&&o.put(i(a.charAt(r)),6)};let i=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;if("A"<=o&&o<="Z")return o.charCodeAt(0)-65+10;switch(o){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+o}};return t},eo=function(s){let n=re.MODE_8BIT_BYTE,e=s,t=Qe.stringToBytes(s),i={};return i.getMode=function(){return n},i.getLength=function(o){return t.length},i.write=function(o){for(let a=0;a<t.length;a+=1)o.put(t[a],8)},i},to=function(s){let n=re.MODE_KANJI,e=s,t=Qe.stringToBytes;(function(a,r){let l=t(a);if(l.length!=2||(l[0]<<8|l[1])!=r)throw"sjis not supported."})("友",38726);let i=t(s),o={};return o.getMode=function(){return n},o.getLength=function(a){return~~(i.length/2)},o.write=function(a){let r=i,l=0;for(;l+1<r.length;){let c=(255&r[l])<<8|255&r[l+1];if(33088<=c&&c<=40956)c-=33088;else if(57408<=c&&c<=60351)c-=49472;else throw"illegal char at "+(l+1)+"/"+c;c=(c>>>8&255)*192+(c&255),a.put(c,13),l+=2}if(l<r.length)throw"illegal char at "+(l+1)},o},Ai=function(){let s=[],n={};return n.writeByte=function(e){s.push(e&255)},n.writeShort=function(e){n.writeByte(e),n.writeByte(e>>>8)},n.writeBytes=function(e,t,i){t=t||0,i=i||e.length;for(let o=0;o<i;o+=1)n.writeByte(e[o+t])},n.writeString=function(e){for(let t=0;t<e.length;t+=1)n.writeByte(e.charCodeAt(t))},n.toByteArray=function(){return s},n.toString=function(){let e="";e+="[";for(let t=0;t<s.length;t+=1)t>0&&(e+=","),e+=s[t];return e+="]",e},n},no=function(){let s=0,n=0,e=0,t="",i={},o=function(r){t+=String.fromCharCode(a(r&63))},a=function(r){if(r<0)throw"n:"+r;if(r<26)return 65+r;if(r<52)return 97+(r-26);if(r<62)return 48+(r-52);if(r==62)return 43;if(r==63)return 47;throw"n:"+r};return i.writeByte=function(r){for(s=s<<8|r&255,n+=8,e+=1;n>=6;)o(s>>>n-6),n-=6},i.flush=function(){if(n>0&&(o(s<<6-n),s=0,n=0),e%3!=0){let r=3-e%3;for(let l=0;l<r;l+=1)t+="="}},i.toString=function(){return t},i},so=function(s){let n=s,e=0,t=0,i=0,o={};o.read=function(){for(;i<8;){if(e>=n.length){if(i==0)return-1;throw"unexpected end of file./"+i}let l=n.charAt(e);if(e+=1,l=="=")return i=0,-1;if(l.match(/^\s$/))continue;t=t<<6|a(l.charCodeAt(0)),i+=6}let r=t>>>i-8&255;return i-=8,r};let a=function(r){if(65<=r&&r<=90)return r-65;if(97<=r&&r<=122)return r-97+26;if(48<=r&&r<=57)return r-48+52;if(r==43)return 62;if(r==47)return 63;throw"c:"+r};return o},io=function(s,n){let e=s,t=n,i=new Array(s*n),o={};o.setPixel=function(c,h,d){i[h*e+c]=d},o.write=function(c){c.writeString("GIF87a"),c.writeShort(e),c.writeShort(t),c.writeByte(128),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(255),c.writeByte(255),c.writeByte(255),c.writeString(","),c.writeShort(0),c.writeShort(0),c.writeShort(e),c.writeShort(t),c.writeByte(0);let h=2,d=r(h);c.writeByte(h);let f=0;for(;d.length-f>255;)c.writeByte(255),c.writeBytes(d,f,255),f+=255;c.writeByte(d.length-f),c.writeBytes(d,f,d.length-f),c.writeByte(0),c.writeString(";")};let a=function(c){let h=c,d=0,f=0,y={};return y.write=function(A,u){if(A>>>u)throw"length over";for(;d+u>=8;)h.writeByte(255&(A<<d|f)),u-=8-d,A>>>=8-d,f=0,d=0;f=A<<d|f,d=d+u},y.flush=function(){d>0&&h.writeByte(f)},y},r=function(c){let h=1<<c,d=(1<<c)+1,f=c+1,y=l();for(let $=0;$<h;$+=1)y.add(String.fromCharCode($));y.add(String.fromCharCode(h)),y.add(String.fromCharCode(d));let A=Ai(),u=a(A);u.write(h,f);let v=0,T=String.fromCharCode(i[v]);for(v+=1;v<i.length;){let $=String.fromCharCode(i[v]);v+=1,y.contains(T+$)?T=T+$:(u.write(y.indexOf(T),f),y.size()<4095&&(y.size()==1<<f&&(f+=1),y.add(T+$)),T=$)}return u.write(y.indexOf(T),f),u.write(d,f),u.flush(),A.toByteArray()},l=function(){let c={},h=0,d={};return d.add=function(f){if(d.contains(f))throw"dup key:"+f;c[f]=h,h+=1},d.size=function(){return h},d.indexOf=function(f){return c[f]},d.contains=function(f){return typeof c[f]<"u"},d};return o},ro=function(s,n,e){let t=io(s,n);for(let r=0;r<n;r+=1)for(let l=0;l<s;l+=1)t.setPixel(l,r,e(l,r));let i=Ai();t.write(i);let o=no(),a=i.toByteArray();for(let r=0;r<a.length;r+=1)o.writeByte(a[r]);return o.flush(),"data:image/gif;base64,"+o},Ei=Qe,Oa=Qe.stringToBytes;function Mi(s){let n=Ei(0,"M");n.addData(s),n.make();let e=n.getModuleCount(),t="";for(let i=0;i<e;i++)for(let o=0;o<e;o++)n.isDark(i,o)&&(t+=`M${o} ${i}h1v1h-1z`);return{size:e,d:t}}var oo=1e4,bt=class extends fe{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,t){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,t))}async newCode(){try{let e=await ki();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof qe&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),oo)}}async poll(e){let t=this.secret;if(t)try{let i=await _i(t,location.origin);if(!this.running||t!==this.secret)return;if(this.problem=null,i.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:i.auth}));return}if(i.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return _;let{size:e,d:t}=Mi($i(location.origin,this.code));return p`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${J`<path d=${t} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return p`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?wi(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${zn}?${Un}</span> and type the code.
          </li>
          <li>You’ll need to be a Home Assistant admin. The screen signs in as you.</li>
        </ol>
      </div>
      <div class="qr">${this.qr()}</div>
      <div class="foot">
        ${this.problem?p`<span class="problem" role="alert">${this.problem}</span>`:p`<span>${this.code?`A new code appears in ${e} minute${e===1?"":"s"}.`:"Getting a code…"}</span>`}
        <button type="button" class="link" @click=${()=>this.dispatchEvent(new CustomEvent("password"))}>
          Sign in with a password instead
        </button>
      </div>
    </div>`}};bt.styles=Re`
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
  `,bt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",bt);var Hn="hassTokens";function Pi(){try{let s=localStorage.getItem(Hn);return s?JSON.parse(s):null}catch{return null}}function jn(s){try{s?localStorage.setItem(Hn,JSON.stringify(s)):localStorage.removeItem(Hn)}catch{}}function ao(s){let n=document.getElementById("problem");n&&(n.hidden=!1,n.querySelector("p").textContent=s)}function lo(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(n=>{let e=t=>{s.stop(),s.hidden=!0,n(t)};s.addEventListener("paired",t=>e(t.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function co(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let n=location.search.includes("auth_callback");if(!n&&!Pi()){let e=await lo();e&&jn(e)}try{let e=await rs({hassUrl:location.origin,loadTokens:async()=>Pi(),saveTokens:jn});n&&history.replaceState(null,"",location.pathname+Nn(location.search));let t=await os({auth:e});s.backend=new $t(t),t.addEventListener("reconnect-error",(i,o)=>{o===2&&Si()})}catch(e){if(e===2){Si();return}ao(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function Si(){jn(null),location.replace(location.pathname+Nn(location.search))}var Li=ht(location.search),Di=document.querySelector("mydashlight-keyboard");Di&&Li.keyboard!==!1&&yi(Di);Li.cursor!=="show"&&ui();co();
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
