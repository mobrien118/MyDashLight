function $n(s){return{type:"auth",access_token:s}}function kn(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function _n(s){let n={type:"subscribe_events"};return s&&(n.event_type=s),n}function Dt(s){return{type:"unsubscribe_events",subscription:s}}function An(){return{type:"ping"}}function Tn(s,n){return{type:"result",success:!1,error:{code:s,message:n}}}function En(s){let n={},e=s.split("&");for(let t=0;t<e.length;t++){let r=e[t].split("="),o=decodeURIComponent(r[0]),a=r.length>1?decodeURIComponent(r[1]):void 0;n[o]=a}return n}var Pn=(s,n,e,t)=>{let[r,o,a]=s.split(".",3);return Number(r)>n||Number(r)===n&&(t===void 0?Number(o)>=e:Number(o)>e)||t!==void 0&&Number(r)===n&&Number(o)===e&&Number(a)>=t};var lt=!1,tr="auth_required",nr="auth_invalid",sr="auth_ok";function Sn(s){if(!s.auth)throw 4;let n=s.auth,e=n.expired?n.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,t=n.wsUrl;lt&&console.log("[Auth phase] Initializing",t);function r(o,a,i){lt&&console.log("[Auth Phase] New connection",t);let l=new WebSocket(t),d=!1,f=()=>{if(l.removeEventListener("close",f),d){i(2);return}if(o===0){i(1);return}let v=o===-1?-1:o-1;setTimeout(()=>r(v,a,i),1e3)},c=async v=>{try{n.expired&&await(e||n.refreshAccessToken()),l.send(JSON.stringify($n(n.accessToken)))}catch(T){d=T===2,l.close()}},p=async v=>{let T=JSON.parse(v.data);switch(lt&&console.log("[Auth phase] Received",T),T.type){case nr:d=!0,l.close();break;case sr:l.removeEventListener("open",c),l.removeEventListener("message",p),l.removeEventListener("close",f),l.removeEventListener("error",f),l.haVersion=T.ha_version,Pn(l.haVersion,2022,9)&&l.send(JSON.stringify(kn())),a(l);break;default:lt&&T.type!==tr&&console.warn("[Auth phase] Unhandled message",T)}};l.addEventListener("open",c),l.addEventListener("message",p),l.addEventListener("close",f),l.addEventListener("error",f)}return new Promise((o,a)=>r(s.setupRetry,o,a))}var We=!1,dt=class{constructor(n,e){this._handleMessage=t=>{let r=JSON.parse(t.data);Array.isArray(r)||(r=[r]),r.forEach(o=>{We&&console.log("Received",o);let a=this.commands.get(o.id);switch(o.type){case"event":a?a.callback(o.event):(console.warn(`Received event for unknown subscription ${o.id}. Unsubscribing.`),this.sendMessagePromise(Dt(o.id)).catch(i=>{We&&console.warn(` Error unsubsribing from unknown subscription ${o.id}`,i)}));break;case"result":a&&(o.success?(a.resolve(o.result),"subscribe"in a||this.commands.delete(o.id)):(a.reject(o.error),this.commands.delete(o.id)));break;case"pong":a?(a.resolve(),this.commands.delete(o.id)):console.warn(`Received unknown pong response ${o.id}`);break;default:We&&console.warn("Unhandled message",o)}})},this._handleClose=async()=>{let t=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,t.forEach(a=>{"subscribe"in a||a.reject(Tn(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let r=Object.assign(Object.assign({},this.options),{setupRetry:0}),o=a=>{setTimeout(async()=>{if(!this.closeRequested){We&&console.log("Trying to reconnect");try{let i=await r.createSocket(r);this._setSocket(i)}catch(i){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let d of l)d.reject&&d.reject(3)}i===2?this.fireEvent("reconnect-error",i):o(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),o(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(n)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(n){this.socket=n,this.haVersion=n.haVersion,n.addEventListener("message",this._handleMessage),n.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(r=>{"subscribe"in r&&r.subscribe&&r.subscribe().then(o=>{r.unsubscribe=o,r.resolve()})}));let t=this._queuedMessages;if(t){this._queuedMessages=void 0;for(let r of t)r.resolve()}this.fireEvent("ready")}addEventListener(n,e){let t=this.eventListeners.get(n);t||(t=[],this.eventListeners.set(n,t)),t.push(e)}removeEventListener(n,e){let t=this.eventListeners.get(n);if(!t)return;let r=t.indexOf(e);r!==-1&&t.splice(r,1)}fireEvent(n,e){(this.eventListeners.get(n)||[]).forEach(t=>t(this,e))}suspendReconnectUntil(n){this.suspendReconnectPromise=n}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(n=!1){if(this.socket){if(!n){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(n,e){return this.subscribeMessage(n,_n(e))}ping(){return this.sendMessagePromise(An())}sendMessage(n,e){if(!this.connected)throw 3;if(We&&console.log("Sending",n),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(n)});return}e||(e=this._genCmdId()),n.id=e,this.socket.send(JSON.stringify(n))}sendMessagePromise(n){return new Promise((e,t)=>{if(this._queuedMessages){this._queuedMessages.push({reject:t,resolve:async()=>{try{e(await this.sendMessagePromise(n))}catch(o){t(o)}}});return}let r=this._genCmdId();this.commands.set(r,{resolve:e,reject:t}),this.sendMessage(n,r)})}async subscribeMessage(n,e,t){if(this._queuedMessages&&await new Promise((o,a)=>{this._queuedMessages.push({resolve:o,reject:a})}),t?.preCheck&&!await t.preCheck())throw new Error("Pre-check failed");let r;return await new Promise((o,a)=>{let i=this._genCmdId();r={resolve:o,reject:a,callback:n,subscribe:t?.resubscribe!==!1?()=>this.subscribeMessage(n,e,t):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Dt(i)),this.commands.delete(i)}},this.commands.set(i,r);try{this.sendMessage(e,i)}catch{}}),()=>r.unsubscribe()}_genCmdId(){return++this.commandId}};var rr=()=>`${location.protocol}//${location.host}/`,ir=s=>s*1e3+Date.now();function or(){let{protocol:s,host:n,pathname:e,search:t}=location;return`${s}//${n}${e}${t}`}function ar(s,n,e,t){let r=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return n!==null&&(r+=`&client_id=${encodeURIComponent(n)}`),t&&(r+=`&state=${encodeURIComponent(t)}`),r}function lr(s,n,e,t){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=ar(s,n,e,t)}async function Ln(s,n,e){let t=typeof location<"u"&&location;if(t&&t.protocol==="https:"){let i=document.createElement("a");if(i.href=s,i.protocol==="http:"&&i.hostname!=="localhost")throw 5}let r=new FormData;n!==null&&r.append("client_id",n),Object.keys(e).forEach(i=>{r.append(i,e[i])});let o=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:r});if(!o.ok)throw o.status===400||o.status===403?2:new Error("Unable to fetch tokens");let a=await o.json();return a.hassUrl=s,a.clientId=n,a.expires=ir(a.expires_in),a}function Rn(s,n,e){return Ln(s,n,{code:e,grant_type:"authorization_code"})}function dr(s){return btoa(JSON.stringify(s))}function cr(s){return JSON.parse(atob(s))}var Rt=class{constructor(n,e){this.data=n,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let n=await Ln(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});n.refresh_token=this.data.refresh_token,this.data=n,this._saveTokens&&this._saveTokens(n)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let n=new FormData;n.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:n}),this._saveTokens&&this._saveTokens(null)}};async function In(s={}){let n,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let t=s.clientId!==void 0?s.clientId:rr(),r=s.limitHassInstance===!0;if(s.authCode&&e&&(n=await Rn(e,t,s.authCode),s.saveTokens&&s.saveTokens(n)),!n){let o=En(location.search.substr(1));if("auth_callback"in o){let a=cr(o.state);if(r&&(a.hassUrl!==e||a.clientId!==t))throw 6;n=await Rn(a.hassUrl,a.clientId,o.code),s.saveTokens&&s.saveTokens(n)}}if(!n&&s.loadTokens&&(n=await s.loadTokens()),n&&(e===void 0||n.hassUrl===e))return new Rt(n,s.saveTokens);if(e===void 0)throw 4;return lr(e,t,s.redirectUrl||or(),dr({hassUrl:e,clientId:t})),new Promise(()=>{})}async function Bn(s){let n=Object.assign({setupRetry:0,createSocket:Sn},s),e=await n.createSocket(n);return new dt(e,n)}function I(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function Ke(s){let n=Math.floor(Math.round(s)/60)%24;return`${I(s)} ${n<12?"AM":"PM"}`}function Nn(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function Ye(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function On(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var pr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),hr=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),ur=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function ct(s){return new Date(`${s}T12:00:00Z`)}function Ce(s){let n=ct(s);return`${pr.format(n)}, ${ur.format(n)}`}function oe(s){return hr.format(ct(s))}function be(s,n){return Math.round((ct(n).getTime()-ct(s).getTime())/864e5)}function Ve(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return Ve("UTC",n)}let t=r=>e.find(o=>o.type===r)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function pt(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let r=Ve(e,s),o=Ve(e,n).date;return r.date===o?`at ${Ke(r.minutes)}`:`on ${oe(r.date)} at ${Ke(r.minutes)}`}var J=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}},Oe="mydashlight",fr=7,zn=3e4;function Lt(s){if(s instanceof J)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new J(String(n.code??"error"),n.message)}return typeof s=="number"?new J("connection_lost","Lost the connection to Home Assistant."):new J("error",String(s))}var ht=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new J("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.pushing}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},zn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,n&&n().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(n=>{this.pushing=!0,n.plan?this.emit(n.plan):this.fail(new J("not_running","MyDashLight isn’t running right now."))},{type:`${Oe}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await this.conn.sendMessagePromise({type:"call_service",domain:Oe,service:"get_plan",service_data:{days:fr},return_response:!0});this.emit(n.response)}catch(n){this.fail(Lt(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Oe,service:n,service_data:e})}catch(t){throw Lt(t)}this.pushing||await this.refresh()}setRide(n,e,t,r){return this.call("set_ride",{event:n,side:e,driver:t,scope:r})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:On(e),scope:t})}setTakeAlong(n,e,t){return this.call("set_take_along",{event:n,kids:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}watchChores(n){let e=!1,t=null,r=null,o=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:Oe,service:"get_chores",service_data:{},return_response:!0});e||n(a.response??null)}catch{e||n(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(i=>{e||n(i.chores)},{type:`${Oe}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):t=a}catch{if(e)return;o(),r=setInterval(()=>void o(),zn)}})(),()=>{e=!0,r&&clearInterval(r),t&&t().catch(()=>{})}}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Oe,service:n,service_data:e})}catch(t){throw Lt(t)}}};var ut=globalThis,ft=ut.ShadowRoot&&(ut.ShadyCSS===void 0||ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,It=Symbol(),Un=new WeakMap,Ge=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==It)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(ft&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=Un.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&Un.set(e,n))}return n}toString(){return this.cssText}},Hn=s=>new Ge(typeof s=="string"?s:s+"",void 0,It),Ee=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,r,o)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new Ge(e,s,It)},jn=(s,n)=>{if(ft)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),r=ut.litNonce;r!==void 0&&t.setAttribute("nonce",r),t.textContent=e.cssText,s.appendChild(t)}},Bt=ft?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return Hn(e)})(s):s;var{is:gr,defineProperty:mr,getOwnPropertyDescriptor:br,getOwnPropertyNames:xr,getOwnPropertySymbols:vr,getPrototypeOf:yr}=Object,gt=globalThis,qn=gt.trustedTypes,wr=qn?qn.emptyScript:"",$r=gt.reactiveElementPolyfillSupport,Qe=(s,n)=>s,Nt={toAttribute(s,n){switch(n){case Boolean:s=s?wr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Wn=(s,n)=>!gr(s,n),Fn={attribute:!0,type:String,converter:Nt,reflect:!1,useDefault:!1,hasChanged:Wn};Symbol.metadata??=Symbol("metadata"),gt.litPropertyMetadata??=new WeakMap;var ue=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Fn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),r=this.getPropertyDescriptor(n,t,e);r!==void 0&&mr(this.prototype,n,r)}}static getPropertyDescriptor(n,e,t){let{get:r,set:o}=br(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let i=r?.call(this);o?.call(this,a),this.requestUpdate(n,i,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Fn}static _$Ei(){if(this.hasOwnProperty(Qe("elementProperties")))return;let n=yr(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Qe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Qe("properties"))){let e=this.properties,t=[...xr(e),...vr(e)];for(let r of t)this.createProperty(r,e[r])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let r=this._$Eu(e,t);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let r of t)e.unshift(Bt(r))}else n!==void 0&&e.push(Bt(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return jn(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),r=this.constructor._$Eu(n,t);if(r!==void 0&&t.reflect===!0){let o=(t.converter?.toAttribute!==void 0?t.converter:Nt).toAttribute(e,t.type);this._$Em=n,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(n,e){let t=this.constructor,r=t._$Eh.get(n);if(r!==void 0&&this._$Em!==r){let o=t.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:Nt;this._$Em=r;let i=a.fromAttribute(e,o.type);this[r]=i??this._$Ej?.get(r)??i,this._$Em=null}}requestUpdate(n,e,t,r=!1,o){if(n!==void 0){let a=this.constructor;if(r===!1&&(o=this[n]),t??=a.getPropertyOptions(n),!((t.hasChanged??Wn)(o,e)||t.useDefault&&t.reflect&&o===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:r,wrapped:o},a){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),o!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),r===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[r,o]of t){let{wrapped:a}=o,i=this[r];a!==!0||this._$AL.has(r)||i===void 0||this.C(r,void 0,o,i)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};ue.elementStyles=[],ue.shadowRootOptions={mode:"open"},ue[Qe("elementProperties")]=new Map,ue[Qe("finalized")]=new Map,$r?.({ReactiveElement:ue}),(gt.reactiveElementVersions??=[]).push("2.1.2");var zt=globalThis,Kn=s=>s,mt=zt.trustedTypes,Vn=mt?mt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Ut="$lit$",fe=`lit$${Math.random().toFixed(9).slice(2)}$`,Ht="?"+fe,kr=`<${Ht}>`,Se=document,Xe=()=>Se.createComment(""),Ze=s=>s===null||typeof s!="object"&&typeof s!="function",jt=Array.isArray,Zn=s=>jt(s)||typeof s?.[Symbol.iterator]=="function",Ot=`[ 	
\f\r]`,Je=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Yn=/-->/g,Gn=/>/g,Pe=RegExp(`>|${Ot}(?:([^\\s"'>=/]+)(${Ot}*=${Ot}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Qn=/'/g,Jn=/"/g,es=/^(?:script|style|textarea|title)$/i,qt=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),h=qt(1),ae=qt(2),to=qt(3),ge=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Xn=new WeakMap,Me=Se.createTreeWalker(Se,129);function ts(s,n){if(!jt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Vn!==void 0?Vn.createHTML(n):n}var ns=(s,n)=>{let e=s.length-1,t=[],r,o=n===2?"<svg>":n===3?"<math>":"",a=Je;for(let i=0;i<e;i++){let l=s[i],d,f,c=-1,p=0;for(;p<l.length&&(a.lastIndex=p,f=a.exec(l),f!==null);)p=a.lastIndex,a===Je?f[1]==="!--"?a=Yn:f[1]!==void 0?a=Gn:f[2]!==void 0?(es.test(f[2])&&(r=RegExp("</"+f[2],"g")),a=Pe):f[3]!==void 0&&(a=Pe):a===Pe?f[0]===">"?(a=r??Je,c=-1):f[1]===void 0?c=-2:(c=a.lastIndex-f[2].length,d=f[1],a=f[3]===void 0?Pe:f[3]==='"'?Jn:Qn):a===Jn||a===Qn?a=Pe:a===Yn||a===Gn?a=Je:(a=Pe,r=void 0);let v=a===Pe&&s[i+1].startsWith("/>")?" ":"";o+=a===Je?l+kr:c>=0?(t.push(d),l.slice(0,c)+Ut+l.slice(c)+fe+v):l+fe+(c===-2?i:v)}return[ts(s,o+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},et=class s{constructor({strings:n,_$litType$:e},t){let r;this.parts=[];let o=0,a=0,i=n.length-1,l=this.parts,[d,f]=ns(n,e);if(this.el=s.createElement(d,t),Me.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=Me.nextNode())!==null&&l.length<i;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith(Ut)){let p=f[a++],v=r.getAttribute(c).split(fe),T=/([.?@])?(.*)/.exec(p);l.push({type:1,index:o,name:T[2],strings:v,ctor:T[1]==="."?xt:T[1]==="?"?vt:T[1]==="@"?yt:Re}),r.removeAttribute(c)}else c.startsWith(fe)&&(l.push({type:6,index:o}),r.removeAttribute(c));if(es.test(r.tagName)){let c=r.textContent.split(fe),p=c.length-1;if(p>0){r.textContent=mt?mt.emptyScript:"";for(let v=0;v<p;v++)r.append(c[v],Xe()),Me.nextNode(),l.push({type:2,index:++o});r.append(c[p],Xe())}}}else if(r.nodeType===8)if(r.data===Ht)l.push({type:2,index:o});else{let c=-1;for(;(c=r.data.indexOf(fe,c+1))!==-1;)l.push({type:7,index:o}),c+=fe.length-1}o++}}static createElement(n,e){let t=Se.createElement("template");return t.innerHTML=n,t}};function De(s,n,e=s,t){if(n===ge)return n;let r=t!==void 0?e._$Co?.[t]:e._$Cl,o=Ze(n)?void 0:n._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(s),r._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=r:e._$Cl=r),r!==void 0&&(n=De(s,r._$AS(s,n.values),r,t)),n}var bt=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,r=(n?.creationScope??Se).importNode(e,!0);Me.currentNode=r;let o=Me.nextNode(),a=0,i=0,l=t[0];for(;l!==void 0;){if(a===l.index){let d;l.type===2?d=new ze(o,o.nextSibling,this,n):l.type===1?d=new l.ctor(o,l.name,l.strings,this,n):l.type===6&&(d=new wt(o,this,n)),this._$AV.push(d),l=t[++i]}a!==l?.index&&(o=Me.nextNode(),a++)}return Me.currentNode=Se,r}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},ze=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,r){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=De(this,n,e),Ze(n)?n===A||n==null||n===""?(this._$AH!==A&&this._$AR(),this._$AH=A):n!==this._$AH&&n!==ge&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Zn(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==A&&Ze(this._$AH)?this._$AA.nextSibling.data=n:this.T(Se.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,r=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=et.createElement(ts(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new bt(r,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(n){let e=Xn.get(n.strings);return e===void 0&&Xn.set(n.strings,e=new et(n)),e}k(n){jt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,r=0;for(let o of n)r===e.length?e.push(t=new s(this.O(Xe()),this.O(Xe()),this,this.options)):t=e[r],t._$AI(o),r++;r<e.length&&(this._$AR(t&&t._$AB.nextSibling,r),e.length=r)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=Kn(n).nextSibling;Kn(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Re=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,r,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=n,this.name=e,this._$AM=r,this.options=o,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=A}_$AI(n,e=this,t,r){let o=this.strings,a=!1;if(o===void 0)n=De(this,n,e,0),a=!Ze(n)||n!==this._$AH&&n!==ge,a&&(this._$AH=n);else{let i=n,l,d;for(n=o[0],l=0;l<o.length-1;l++)d=De(this,i[t+l],e,l),d===ge&&(d=this._$AH[l]),a||=!Ze(d)||d!==this._$AH[l],d===A?n=A:n!==A&&(n+=(d??"")+o[l+1]),this._$AH[l]=d}a&&!r&&this.j(n)}j(n){n===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},xt=class extends Re{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===A?void 0:n}},vt=class extends Re{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==A)}},yt=class extends Re{constructor(n,e,t,r,o){super(n,e,t,r,o),this.type=5}_$AI(n,e=this){if((n=De(this,n,e,0)??A)===ge)return;let t=this._$AH,r=n===A&&t!==A||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,o=n!==A&&(t===A||r);r&&this.element.removeEventListener(this.name,this,t),o&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},wt=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){De(this,n)}},ss={M:Ut,P:fe,A:Ht,C:1,L:ns,R:bt,D:Zn,V:De,I:ze,H:Re,N:vt,U:yt,B:xt,F:wt},_r=zt.litHtmlPolyfillSupport;_r?.(et,ze),(zt.litHtmlVersions??=[]).push("3.3.3");var rs=(s,n,e)=>{let t=e?.renderBefore??n,r=t._$litPart$;if(r===void 0){let o=e?.renderBefore??null;t._$litPart$=r=new ze(n.insertBefore(Xe(),o),o,void 0,e??{})}return r._$AI(s),r};var Ft=globalThis,de=class extends ue{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=rs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ge}};de._$litElement$=!0,de.finalized=!0,Ft.litElementHydrateSupport?.({LitElement:de});var Ar=Ft.litElementPolyfillSupport;Ar?.({LitElement:de});(Ft.litElementVersions??=[]).push("4.2.2");var is={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},os=s=>(...n)=>({_$litDirective$:s,values:n}),$t=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:Tr}=ss,as=s=>s;var ls=()=>document.createComment(""),Ue=(s,n,e)=>{let t=s._$AA.parentNode,r=n===void 0?s._$AB:n._$AA;if(e===void 0){let o=t.insertBefore(ls(),r),a=t.insertBefore(ls(),r);e=new Tr(o,a,s,s.options)}else{let o=e._$AB.nextSibling,a=e._$AM,i=a!==s;if(i){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(o!==r||i){let l=e._$AA;for(;l!==o;){let d=as(l).nextSibling;as(t).insertBefore(l,r),l=d}}}return e},xe=(s,n,e=s)=>(s._$AI(n,e),s),Cr={},ds=(s,n=Cr)=>s._$AH=n,cs=s=>s._$AH,kt=s=>{s._$AR(),s._$AA.remove()};var ps=(s,n,e)=>{let t=new Map;for(let r=n;r<=e;r++)t.set(s[r],r);return t},pe=os(class extends $t{constructor(s){if(super(s),s.type!==is.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let r=[],o=[],a=0;for(let i of s)r[a]=t?t(i,a):a,o[a]=e(i,a),a++;return{values:o,keys:r}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let r=cs(s),{values:o,keys:a}=this.dt(n,e,t);if(!Array.isArray(r))return this.ut=a,o;let i=this.ut??=[],l=[],d,f,c=0,p=r.length-1,v=0,T=o.length-1;for(;c<=p&&v<=T;)if(r[c]===null)c++;else if(r[p]===null)p--;else if(i[c]===a[v])l[v]=xe(r[c],o[v]),c++,v++;else if(i[p]===a[T])l[T]=xe(r[p],o[T]),p--,T--;else if(i[c]===a[T])l[T]=xe(r[c],o[T]),Ue(s,l[T+1],r[c]),c++,T--;else if(i[p]===a[v])l[v]=xe(r[p],o[v]),Ue(s,r[c],r[p]),p--,v++;else if(d===void 0&&(d=ps(a,v,T),f=ps(i,c,p)),d.has(i[c]))if(d.has(i[p])){let u=f.get(a[v]),k=u!==void 0?r[u]:null;if(k===null){let C=Ue(s,r[c]);xe(C,o[v]),l[v]=C}else l[v]=xe(k,o[v]),Ue(s,r[c],k),r[u]=null;v++}else kt(r[p]),p--;else kt(r[c]),c++;for(;v<=T;){let u=Ue(s,l[T+1]);xe(u,o[v]),l[v++]=u}for(;c<=p;){let u=r[c++];u!==null&&kt(u)}return this.ut=a,ds(s,l),ge}});var _t=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function Y(s){return _t[(s%_t.length+_t.length)%_t.length]}var hs="#23272E",us="35,39,46";var Er=3,Pt=36,Wt=12,Pr=8,Kt=60,Vt=10,Tt=30,Yt=10,Mr=150,Sr=200,Et=1.4;function Qt(s,n){let e=Math.max(Mr,Sr/Et);return Math.ceil(Kt+Math.max(0,s-1)*Vt+Tt+Math.max(0,n-1)*Yt+e*(s+Et*n))}function Ie(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function ve(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ce(s){return new Map(Ie(s).map((n,e)=>[n,Y(e)]))}function le(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function ye(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function Jt(s,n){return n==="none"?"Not needed":ve(s).includes(n)?ye(s,n):n}function Dr(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function Ct(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function At(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(Ct(n,t.from)),e.push(Ct(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(Ct(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Rr(s){let n=s.map(a=>({...a,col:0,cols:1})).sort((a,i)=>a.s-i.s||i.en-a.en),e=[],t=[],r=-1/0,o=()=>{for(let a of e)a.cols=t.length;e=[],t=[]};for(let a of n){a.s>=r&&(o(),r=-1/0);let i=t.findIndex(l=>l<=a.s);i<0?(i=t.length,t.push(a.en)):t[i]=a.en,a.col=i,e.push(a),r=Math.max(r,a.en)}return o(),n}function Lr(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],r=s[e+1];if(n<=r.t)return r.t===t.t?t.y:Math.round(t.y+(n-t.t)/(r.t-t.t)*(r.y-t.y))}return s[s.length-1].y}function Ir(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],r=s[e+1];if(n<=r.y)return r.y===t.y?t.t:t.t+(n-t.y)/(r.y-t.y)*(r.t-t.t)}return s[s.length-1].t}function ms(s,n){return Lr(s.anchors,n)}function bs(s,n){return Ir(s.anchors,n)}function Br(s,n){let e=Ie(s),t=ve(s),r=Math.max(n,Qt(e.length,t.length)),a=(r-Kt-Math.max(0,e.length-1)*Vt-Tt-Math.max(0,t.length-1)*Yt)/(e.length+Et*t.length||1),i=Math.floor(a),l=Math.floor(a*Et),d=new Map;for(let T of s.days)for(let u of T.events){let k=d.get(u.kid)??[];k.some(C=>C.event_id===u.event_id&&C.calendar_id===u.calendar_id)||k.push(u),d.set(u.kid,k)}let f=ce(s),c=[],p=Kt;e.forEach((T,u)=>{let k=d.get(T)??[],C=s.days.some(_=>_.events.some(H=>H.kid===T&&(H.sides.includes("drop")&&H.drop===""||H.sides.includes("pick")&&H.pick==="")));c.push({id:T,kind:"kid",x:p,w:i,name:le(s,T),dot:f.get(T).color,rgb:f.get(T).rgb,sub:`${C?"Needs a ride · ":""}${k.length} this week`,subWarn:C}),p+=i+(u<e.length-1?Vt:0)});let v=p+Tt/2;return p+=Tt,t.forEach((T,u)=>{let k=0,C=0;for(let _ of s.days){let H=_.drivers[T];H&&(k+=H.outings.length,C+=H.drive??0)}c.push({id:T,kind:"driver",x:p,w:l,name:ye(s,T),dot:hs,rgb:us,sub:`${k} ${k===1?"trip":"trips"} this week · ${Ye(C)} driving`,subWarn:!1}),p+=l+(u<t.length-1?Yt:0)}),{columns:c,sepX:v,width:r}}function Nr(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let r=e.slice(n.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(r);if(!o)return e;let a=r.slice(o[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function fs(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${I(s.start)}`:e||!n?`${s.title} until ${I(s.end)}`:`${s.title} ${I(s.start)}–${I(s.end)}`}function Xt(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length}function Zt(s,n){let e=be(n,s);return e===0?"Today":e===1?"Tomorrow":""}function se(s,n=0){return s==null||!Number.isFinite(s)?n:s}function Gt(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),r=1,o=0;for(let a of s.split(/\s+/).filter(Boolean)){let i=a.length;for(o===0?o=i:o+1+i<=t?o+=1+i:(r++,o=i);o>t;)r++,o-=t}return r}var xs=25,vs=15,en=3;function gs(s){return Math.max(0,Math.min(en,Math.floor((s-xs)/vs)))}function Or(s,n){let e=Math.min(en,Gt(s,n-19,6.6));return xs+e*vs+2}function zr(s,n){let e=n-23,t=`${I(s.start)}–${I(s.end)}`+(s.arrive_by!=null?` · arrive ${I(s.arrive_by)}`:""),r=33+Gt(t,e,6.6)*16;for(let o of[s.lines.drop,s.lines.pick])o&&(r+=2+Gt(o.text,e,7)*16);return r+4}function ys(s,n,e,t){let r=n==="compact",{columns:o,sepX:a,width:i}=Br(s,e),l=new Map(o.map(_=>[_.id,_])),d=Ie(s),f=ve(s),c=[...d,...f],p=ce(s),v=Dr(s),T=_=>le(s,_),u=_=>ye(s,_),k={mode:n,width:i,height:0,columns:o,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},C=0;return s.days.forEach((_,H)=>{let X=H*1440,B=new Map(_.events.map($=>[$.id,$])),K=$=>$&&B.has($)?{day:_.date,event:$}:null,m=Xt(_),y=_.events.length,g=Zt(_.date,t.date);k.dayHeads.push({date:_.date,y:C,label:Ce(_.date),tag:g,sub:(y?`${y} ${y===1?"activity":"activities"}`:"Nothing scheduled")+(m?` · ${m} to sort out`:""),warn:m>0}),k.anchors.push({t:X,y:C});let b=C+Pt+Wt,x=f.flatMap($=>_.drivers[$]?.outings??[]);if(!y&&!x.length){k.empties.push({key:_.date,y:b,text:"Nothing planned"}),C=b+40,k.anchors.push({t:X+1439,y:C});return}let w=($,U,N,L,O,q,D)=>{let Z=p.get($.kid)??Y(0),ee=$.lines;return{key:`${_.date}|card|${$.id}`,x:U,y:N,w:L,h:O,target:{day:_.date,event:$.id},event:$,color:Z,kidName:T($.kid),clash:q,stayed:$.stay&&f.includes($.drop),skipped:$.attending===!1,title:Nr($.title,T($.kid)),time:`${I($.start)}–${I($.end)}`+($.arrive_by!=null?` · arrive ${I($.arrive_by)}`:""),drop:ee.drop,pick:ee.pick,showDrop:!!ee.drop&&(D||O>=56),showPick:!!ee.pick&&(D||O>=74),wrap:D,aria:`${T($.kid)}, ${$.title} ${I($.start)} to ${I($.end)}. `+($.attending===!1&&!ee.drop?"Not attending. ":"")+[ee.drop,ee.pick].filter(he=>!!he).map(he=>he.text).join(". ")}},E=$=>{let U=_.rides[$];return U?(_.drivers[U.driver]?.segments??[]).filter(L=>L.type!=="home"&&L.kids.includes(U.kid)&&se(L.start)>=se(U.start)&&se(L.end)<=se(U.end)):[]},S=$=>{let U=_.rides[$];if(!U)return null;let N=U.serves.find(L=>B.get(L)?.kid===U.kid);return K(N??U.serves[0])},z=new Map;for(let $ of _.issues)$.level!=="problem"||!$.event||($.kind==="late"&&z.set($.event,`${Math.round(se($.minutes))} min late`),$.kind==="waiting"&&z.set(`${$.event}|pick`,`Waits ${Math.round(se($.minutes))} min`));if(!r){let $=1/0,U=-1/0;for(let D of _.events)$=Math.min($,D.start-20,D.arrive_by!=null?D.arrive_by-10:1/0),U=Math.max(U,D.end+20);for(let D of x)D.start!=null&&($=Math.min($,D.start)),D.end!=null&&(U=Math.max(U,D.end));_.date===t.date&&Number.isFinite($)&&t.minutes>$-60&&t.minutes<U&&($=Math.min($,t.minutes-15));let N=Number.isFinite($)?Math.floor(($-5)/30)*30:900,L=Number.isFinite(U)?Math.ceil((U+5)/30)*30:960,O=D=>Math.round(b+(Math.max(N,Math.min(L,D))-N)*Er);k.anchors.push({t:X+N,y:O(N)},{t:X+L,y:O(L)});for(let D of d){let Z=l.get(D),ee=p.get(D),he=(_.kids[D]?.items??[]).filter(W=>W.start!=null&&W.end!=null).map(W=>({item:W,s:se(W.start),en:se(W.end)}));for(let W of Rr(he)){let M=Z.w/W.cols,G=Math.round(Z.x+W.col*M),V=Math.round(M-(W.cols>1?4:0)),te=O(W.s),me=W.item;if(me.type==="act"){let ie=B.get(me.event??"");if(!ie)continue;let xn=Math.max(30,O(W.en)-te);if(k.cards.push(w(ie,G,te,V,xn,me.clash,!1)),ie.arrive_by!=null&&ie.start-ie.arrive_by>=5){let wn=O(ie.arrive_by);k.preps.push({key:`${_.date}|prep|${ie.id}`,x:G,y:wn,w:V,h:te-wn+6,color:ee,label:`Arrive by ${I(ie.arrive_by)}`})}let vn=z.get(ie.id);vn&&k.marks.push({key:`${_.date}|late|${ie.id}`,x:G+V-4,y:te+4,text:vn,right:!0});let yn=z.get(`${ie.id}|pick`);yn&&k.marks.push({key:`${_.date}|wait|${ie.id}`,x:G+4,y:te+xn+2,text:yn,right:!1});continue}let ne=_.rides[me.ride??-1];if(!ne)continue;let Ae=Math.max(22,O(W.en)-te),Fe=At(E(ne.index),v),Q=u(ne.driver);k.rides.push({key:`${_.date}|ride|${ne.index}`,x:G,y:te,w:V,h:Ae,target:S(ne.index),l1:`${ne.own?"In":"Along in"} ${Q}’s car`,l2:Fe.join(" → "),show2:gs(Ae)>0,lines2:gs(Ae),dashed:!ne.own,clash:me.clash,aria:`${T(D)} ${ne.own?"in":"riding along in"} ${Q}’s car, ${I(se(ne.start))} to ${I(se(ne.end))}: ${Fe.join(" to ")}`});let Te=l.get(ne.driver);Te&&k.bands.push({key:`${_.date}|band|${ne.index}`,x:G+V,y:te,w:Math.max(0,Te.x+8-(G+V)),h:Ae,color:ee})}}for(let D of f){let Z=l.get(D),ee=_.drivers[D];if(!ee)continue;let he=[],W=null;for(let M of ee.segments)if(!(M.start==null||M.end==null)){if(M.type==="home"){W=null;continue}if(M.type==="stay"){W=null,he.push({type:"stay",g:M,s:M.start,en:M.end});continue}W&&W.en===M.start?(W.en=M.end,W.legs.push(M)):(W={type:"trip",s:M.start,en:M.end,legs:[M]},he.push(W))}for(let M of he){let G=O(M.s),V=Math.max(24,O(M.en)-G);if(M.type==="stay"){let Q=B.get(M.g.event??M.g.serves??""),Te=Q?p.get(Q.kid)??Y(0):Y(0),ie=M.g.kids.map(T);k.stays.push({key:`${_.date}|stay|${D}|${M.s}`,x:Z.x+8,y:G,w:Z.w-16,h:V,target:K(Q?.id),color:Te,l1:Q?`At ${Q.title} with ${T(Q.kid)}`:"Staying",l2:`until ${I(M.en)}`+(ie.length?` · ${ie.join(" and ")} too`:"")});continue}let te=M.legs[0],me=M.legs[M.legs.length-1],ne=[];for(let Q of M.legs)for(let Te of Q.kids)ne.includes(Te)||ne.push(Te);let Ae=me.type==="drive"&&me.to==="home",Fe=At(M.legs,v);k.trips.push({key:`${_.date}|trip|${D}|${M.s}`,x:Z.x+8,y:G,w:Z.w-16,h:V,target:K(M.legs.find(Q=>Q.serves)?.serves),l1:te.type==="drive"&&te.from==="home"?`Leave ${I(M.s)}`:`From ${Ct(v,te.from??te.place)} ${I(M.s)}`,l2:Fe.join(" → "),show2:V>=36,l3:Ae?`Home ${I(M.en)}`:"",show3:Ae&&V>=62,stops:null,kids:ne.map(Q=>(p.get(Q)??Y(0)).color),bad:M.legs.some(Q=>Q.overlaps_busy),aria:`${u(D)} drives ${Fe.join(" to ")}, ${I(M.s)} to ${I(M.en)}`})}for(let M of ee.segments)if(!(!M.overlaps_busy||M.start==null||M.end==null))for(let G of ee.busy){let V=Math.max(M.start,G.start),te=Math.min(M.end,G.end);te<=V||k.overlaps.push({key:`${_.date}|overlap|${D}|${V}`,x:Z.x+6,y:O(V)-2,w:Z.w-12,h:Math.max(8,O(te)-O(V)+4)})}for(let M of ee.busy){if(M.end<=N||M.start>=L)continue;let G=O(M.start),V=O(M.end);k.busy.push({key:`${_.date}|busy|${D}|${M.start}`,x:Z.x+1,y:G,w:Z.w-2,h:V-G,labelY:8,label:fs(M,!1)})}}let q=-1/0;for(let D=N;D<=L;D+=30)k.grid.push({key:`${_.date}|grid|${D}`,y:O(D),strong:D%60===0}),D%60===0&&O(D)-q>=22&&(k.hours.push({key:`${_.date}|hour|${D}`,y:O(D)-8,label:Nn(D)}),q=O(D));_.date===t.date&&t.minutes>N&&t.minutes<L&&(k.now={y:O(t.minutes),label:`Now ${I(t.minutes)}`}),C=O(L)+Wt;return}let j=[];for(let $ of d){let U=l.get($);for(let N of _.kids[$]?.items??[])if(N.start!=null){if(N.type==="act"){let L=B.get(N.event??"");if(!L)continue;j.push({col:$,s:N.start,h:zr(L,U.w),kind:"act",item:N})}else if(!_.rides[N.ride??-1]?.own){let L=_.rides[N.ride??-1],O=L?At(E(L.index),v).join(" → "):"";j.push({col:$,s:N.start,h:Or(O,U.w),kind:"along",item:N})}}}for(let $ of f){let U=_.drivers[$];if(U){for(let N of U.busy)j.push({col:$,s:N.start,h:32,kind:"busy",busy:N});for(let N of U.outings)N.start!=null&&j.push({col:$,s:N.start,h:30+N.lines.length*16+(N.warn?16:0),kind:"out",out:N})}}j.sort(($,U)=>$.s-U.s||c.indexOf($.col)-c.indexOf(U.col));let P=new Map,R=b;j.forEach(($,U)=>{let N=P.get($.col),L=Math.max(N!=null?N+Pr:b,R);P.set($.col,L+$.h),R=L,k.anchors.push({t:X+$.s,y:L});let O=l.get($.col);if($.kind==="busy")k.busy.push({key:`${_.date}|busy|${$.col}|${U}`,x:O.x+1,y:L,w:O.w-2,h:$.h,labelY:8,label:fs($.busy,!0)});else if($.kind==="out"){let q=$.out;k.trips.push({key:`${_.date}|trip|${$.col}|${U}`,x:O.x+8,y:L,w:O.w-16,h:$.h,target:K(q.target),l1:q.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...q.lines.map(D=>({text:D,warn:!1})),...q.warn?[{text:q.warn,warn:!0}]:[]],kids:q.kids.map(D=>(p.get(D)??Y(0)).color),bad:!!q.warn,aria:`${u($.col)}: ${q.lead}. ${q.lines.join(". ")}${q.warn?`. ${q.warn}`:""}`})}else if($.kind==="act"){let q=B.get($.item.event??"");k.cards.push(w(q,O.x,L,O.w,$.h,$.item.clash,!0))}else{let q=_.rides[$.item.ride??-1],D=At(E(q.index),v),Z=u(q.driver);k.rides.push({key:`${_.date}|ride|${q.index}`,x:O.x,y:L,w:O.w,h:$.h,target:S(q.index),l1:`Along with ${Z} ${I(se(q.start))}`,l2:D.join(" → "),show2:!0,lines2:en,dashed:!0,clash:$.item.clash,aria:`${T($.col)} riding along with ${Z}, ${I(se(q.start))} to ${I(se(q.end))}: ${D.join(" to ")}`})}});let F=b;for(let $ of P.values())F=Math.max(F,$);C=F+Wt+6,k.anchors.push({t:X+1439,y:C})}),k.height=C,k}var Ur=["","¼","½","¾"];function Le(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return Ye(t);let r=Math.round(t*4),o=Math.floor(r/4),a=Ur[r%4];return`${o||!a?o:""}${a} min`})}function ws(s){let n=e=>e?{...e,text:Le(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,r])=>[t,{...r,outings:r.outings.map(o=>({...o,lines:o.lines.map(Le),warn:o.warn==null?o.warn:Le(o.warn)}))}])),issues:e.issues.map(t=>({...t,title:Le(t.title),body:Le(t.body),note:t.note==null?t.note:Le(t.note),...t.suggestions?{suggestions:t.suggestions.map(r=>({...r,note:Le(r.note)}))}:{}}))}))}}var Hr=2,jr=48;function $s(s,n,e=jr){let t=[],r=0,o=0,a=0,i=0,l=n.minutes+e*60;for(let d of s.days){let f=be(n.date,d.date),c=f===0?"":`${oe(d.date)} · `,p=new Map(d.events.map(u=>[u.id,u])),v=u=>u&&p.has(u)?{day:d.date,event:u}:null,T=(u,k)=>f*1440+(u??p.get(k??"")?.start??0)<l;for(let u of d.issues)if(u.level==="problem"){if(!T(u.at,u.event)){a++,u.kind==="unassigned"&&i++;continue}r++,u.kind==="unassigned"&&o++,t.push({key:`${d.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:c+u.title,body:u.body,target:v(u.event),suggestions:(u.suggestions??[]).map(k=>({id:k.id,label:k.label,note:k.note}))})}if(d.clashes.forEach((u,k)=>{if(!T(u.a.start,u.a.event)){a++;return}r++;let C=p.get(u.a.event??""),_=le(s,u.kid),H=(B,K)=>{let m=v(K);return m?{text:B,target:m}:B},X=[];if(u.b.type==="act"){let B=p.get(u.b.event??"");C&&B&&(X=[H(C.title,C.id),` ${I(C.start)}–${I(C.end)} and `,H(B.title,B.id),` ${I(B.start)}–${I(B.end)} overlap.`])}else{let B=d.rides[u.b.ride??-1];C&&B&&(X=[`${_} is in `,H(`${ye(s,B.driver)}’s car`,B.serves[0]),` ${I(se(u.b.start))}–${I(se(u.b.end))}, during `,H(C.title,C.id),"."])}t.push({key:`${d.date}|clash|${k}`,tone:"problem",title:`${c}${_} is double-booked`,body:X.map(B=>typeof B=="string"?B:B.text).join(""),parts:X,target:null,suggestions:[]})}),f>=0&&f<Hr)for(let u of d.issues)u.level!=="heads_up"||!T(u.at,u.event)||t.push({key:`${d.date}|${u.key}`,tone:"heads_up",title:c+u.title,body:u.body,target:v(u.event),suggestions:[]});for(let u of d.events)!u.problems.length||!T(u.start)||t.push({key:`${d.date}|notes|${u.id}`,tone:"heads_up",title:`${c}Check the notes on ${le(s,u.kid)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:v(u.id),suggestions:[]})}return{items:t,problems:r,unassigned:o,later:a,laterUnassigned:i}}function ks(s,n){let e=ce(s),t=null,r=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of s.days){let a=be(n.date,o.date);if(!(a<0))for(let i of ve(s))for(let l of o.drivers[i]?.outings??[]){if(l.start==null)continue;let d=a*1440+l.start;if(a*1440+se(l.end,l.start)<=n.minutes)continue;let c=d-n.minutes,p={driver:i,name:ye(s,i),date:o.date,ahead:a,start:l.start,inMinutes:c,ongoing:c<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(v=>e.get(v)??Y(0)),warn:l.warn,target:l.target&&o.events.some(v=>v.id===l.target)?{day:o.date,event:l.target}:null};(!t||r(p)<r(t)||r(p)===r(t)&&p.inMinutes<t.inMinutes)&&(t=p)}}return t}function je(s){return s.state==="done"||s.state==="late"}function _s(s){return s.state==="open"||s.state==="overdue"}function nn(s,n,e){if(je(s)){let t=s.done_at?Fr(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${qr(s.due,n)}`:"Missed";if(s.state==="upcoming"){let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let r=be(n,s.due);return`By ${r===1?"tomorrow":r<7?oe(s.due):tn(s.due)}`}if(s.due&&s.due>n){let t=be(n,s.due);return t===1?"By tomorrow":`By ${t<7?oe(s.due):tn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function qr(s,n){let e=be(n,s);return e===0?"today":e===-1?"yesterday":Math.abs(e)<7?oe(s):tn(s)}function tn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Fr(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let r=e;try{new Intl.DateTimeFormat("en-US",{timeZone:r})}catch{r=void 0}let o=t.toLocaleDateString("en-CA",{timeZone:r}),a=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:r});return o===n?a:`${oe(o)} ${a}`}function As(s,n){let e=[...s.chores].sort((t,r)=>t.order-r.order);return s.kids.map((t,r)=>{let o=e.filter(d=>d.kid===t.id),a=new Map;for(let d of o){if(d.state!=="upcoming")continue;let f=d.shows_from??d.due??s.today;a.set(f,[...a.get(f)??[],d])}let i=o.filter(d=>d.state==="overdue"),l=o.filter(d=>d.state==="open");return{kid:t.id,name:t.name,color:n?.get(t.id)??Y(r),overdue:i,now:l,done:o.filter(je),later:[...a.entries()].sort(([d],[f])=>d.localeCompare(f)).map(([d,f])=>({date:d,chores:f})),left:i.length+l.length}})}function Ts(s){return[...s.chores].filter(n=>n.state==="overdue"||n.state==="open"&&(n.due==null||n.due<=s.today)).sort((n,e)=>n.state===e.state?n.order-e.order:n.state==="overdue"?-1:1)}function sn(s){return!s.chores.length&&!s.templates.length}var He=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Cs(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[r,o]=t.split("-").map(a=>He.indexOf(a.trim()));if(r===void 0||r<0||o!==void 0&&o<0)return null;if(o===void 0)e.add(r);else for(let a=0;a<=(o-r+7)%7;a++)e.add((r+a)%7)}return e}function rn(s){let n=[...new Set(s)].sort((t,r)=>t-r);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let r=e.at(-1);r&&r.at(-1)===t-1?r.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${He[t[0]]}-${He[t.at(-1)]}`]:t.map(r=>He[r])).join(", ")}var tt="none";function Mt(s){return s==="daily"?"":"Any"}function Es(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1}}function Ps(s){return{template:s.id,repeats:s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:s.days??Mt(s.repeats),every:s.every&&s.every>0?s.every:1,paused:s.paused}}function on(s){return s.title.trim()?s.who.length?s.days===tt?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Ms(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.days,every:s.every,paused:s.paused}}function an(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function ln(s,n,e=1){let t={daily:"day",weekly:"week",monthly:"month"}[s],r=e>1?`every ${e} ${t}s`:`each ${t}`,o=n.trim();if(s==="daily"){let l=o.replace(/-/g,"–");return e>1?l?`${l}, every ${e} days`:`Every ${e} days`:l||"Every day"}if(!o||o.toLowerCase()==="any")return`Sometime ${r}`;if(s==="weekly")return`${o.replace(/-/g,"–")} ${r}`;let i=`${o.split(",").map(l=>{let d=l.trim();return d.toLowerCase()==="last"?"the last day":/^\d+$/.test(d)?`the ${an(Number(d))}`:`the ${d}`}).join(" and ")} ${r}`;return i[0].toUpperCase()+i.slice(1)}function dn(s,n,e=!1){let t=s.map(o=>n.find(a=>a.id===o)?.name??o);if(!t.length)return"Nobody yet";let r=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${r} take turns`:r}function cn(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}var Wr={timeline:"timeline",full:"timeline",compact:"compact"};function nt(s){let n=new URLSearchParams(s),e={},t=Wr[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let r=(n.get("page")??"").trim().toLowerCase();return(r==="rides"||r==="chores")&&(e.page=r),e}var Kr=["auth_callback","code","state"];function pn(s){let n=new URLSearchParams(s);for(let t of Kr)n.delete(t);let e=n.toString();return e?`?${e}`:""}var Ss=Ee`
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
`;var Ds="mydashlight.rides.mode",Vr=1100,Yr=440,Gr=700,Qr=3*6e4,Jr=1200;function Xr(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var hn=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,Zr=ae`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,ei=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"];function ti(s,n){let e={daily:"day",weekly:"week",monthly:"month"}[s];return n<=1?`Every ${e}`:n===2?`Every other ${e}`:`Every ${n} ${e}s${s==="monthly"&&n===3?" (quarterly)":""}`}function we(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function ni(s,n){return Zt(s,n)||Ce(s).split(",")[0]}function si(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function ri(){try{return localStorage.getItem(Ds)==="compact"?"compact":"timeline"}catch{return"timeline"}}function ii(s){try{localStorage.setItem(Ds,s)}catch{}}function St(s){return s.days.every(n=>!n.events.length)}var st=class extends de{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=nt(location.search).view;this.urlPage=nt(location.search).page;this.stopChores=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let r=e.clientX-t.x,o=e.clientY-t.y;if(!t.moved){if(Math.abs(r)+Math.abs(o)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-o,t.el.scrollLeft=t.left-r};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Qr))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??ri(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.backend&&(this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let r of e.chores)t.has(r.id)&&je(r)===t.get(r.id)&&t.delete(r.id);for(let r of t.keys())e.chores.some(o=>o.id===r)||t.delete(r);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=ws(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Vr)return!1;let e=this.plan;return!e||this.width-Yr>=Qt(Ie(e).length,ve(e).length)}today(){return Ve(this.plan?.time_zone??Xr())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),r=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||r!==this.boardKey)&&(this.board=ys(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=r),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let r=this.scroller;if(!r||!this.board)return;let o=this.board.dayHeads.find(a=>a.date===t)?.y??0;r.scrollTop=Math.max(o,ms(this.board,e)-Pt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let r=this.today();if(e===r.date){this.scrollToNow();return}let o=this.dayIndexOf(e),a=t.days[o];if(!a)return;let i=1/0;if(this.mode==="timeline"){for(let l of a.events)i=Math.min(i,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let d of l.outings)d.start!=null&&(i=Math.min(i,d.start))}this.scrollToTime(o*1440+(Number.isFinite(i)?Math.max(0,i-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,r=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=t+1&&(r=d);let o=this.renderRoot,a=o.querySelector(".pinned .label"),i=o.querySelector(".pinned .tag"),l=o.querySelector(".pinned .sub");a&&a.textContent!==r.label&&(a.textContent=r.label),i&&(i.textContent!==r.tag&&(i.textContent=r.tag),i.hidden=!r.tag),l&&l.textContent!==r.sub&&(l.textContent=r.sub),l?.classList.toggle("warn",r.warn);for(let d of o.querySelectorAll(".day-tile"))d.classList.toggle("in-view",d.dataset.date===r.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let r=!this.choreDone(e),o=new Map(this.choreDraft);o.set(e.id,r),this.choreDraft=o;try{await this.backend.setChoreDone(e.id,r,t&&t!==e.kid?t:void 0)}catch(a){let i=new Map(this.choreDraft);i.delete(e.id),this.choreDraft=i;let l=a instanceof J?a:new J("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??je(e)}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?Ps(e):Es(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||on(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Ms(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let r=t instanceof J?t:new J("error",String(t));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let r=t instanceof J?t:new J("error",String(t));this.showToast(r.code==="preview"?r.message:`Couldn’t remove that. ${r.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?bs(this.board,t.scrollTop+Pt+4):null,this.mode=e,this.urlView||ii(e)}findEvent(e){let t=this.plan?.days.find(o=>o.date===e.day),r=t?.events.find(o=>o.id===e.event);return t&&r?{day:t,event:r}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),r=this.dayIndexOf(e.day);!t||r<0||this.scrollToTime(r*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,r){if(!this.pending){this.pending={key:e,value:t};try{await r()}catch(o){let a=o instanceof J?o:new J("error",String(o));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,t,r){if(!this.backend)return;let o=this.backend;this.save(`${t}`,r,()=>o.setRide(e.id,t,r,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let r=this.backend;this.save("attending",t,()=>r.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t){if(!this.backend)return;let r=this.backend,o=e.along.includes(t)?e.along.filter(a=>a!==t):[...e.along,t];this.save("along",o,()=>r.setTakeAlong(e.id,o,this.scope))}nudgeArrive(e,t){let r=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;t<0?o=(r??e.start)-5:o=r==null||r+5>=e.start?null:r+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Jr)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let r=this.findEvent(t);if(!r||r.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,a=r.event.id,i=this.scope;this.save("arrive",e,()=>o.setArriveBy(a,e,i)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),r=e?$s(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},o=this.wide,a=this.chores?Ts(this.chores).filter(c=>!this.choreDone(c)):[],i=this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",d=h`<aside class="panel" aria-label=${l}>
      ${i??(this.sel&&e?this.renderEditor(e):this.renderAttention(r,a))}
    </aside>`,f=this.page==="rides";return h`
      <div class="app ${o?"wide":this.width<Gr?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,r,a.length)} ${f&&e?this.renderWeek(e):A}
          ${f?this.renderBanner(e):A}
          <main>
            ${f?h`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?St(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:h`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!o&&(this.sheet||this.sel||this.choreEdit||this.whoFor)?h`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${d}`:A}
          </main>
        </div>
        ${o?d:A}
        ${this.toast?h`<div class="toast" role="status">${this.toast}</div>`:A}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,r){let o=t.problems+r;this.tick;let a=this.today(),i="";if(e){let p=e.time_zone,v=new Date(e.updated);this.error?i=h`<span class="bad">Can’t reach Home Assistant · showing the plan from ${pt(v,new Date,p)}</span>`:e.status&&!e.status.ok?i=h`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${pt(v,new Date,p)}</span>`:this.backend?.live||(i=`Updated ${pt(v,new Date,p)}`)}let l=(p,v,T,u)=>h`
      <button type="button" class="seg-btn" title=${u} aria-pressed=${this.mode===p?"true":"false"} @click=${()=>this.setMode(p)}>
        ${T}<span class="seg-label">${v}</span>
      </button>
    `,d=(p,v,T)=>h`
      <button type="button" class="seg-btn" aria-pressed=${this.page===p?"true":"false"} @click=${()=>this.setPage(p)}>
        ${T}<span class="seg-label">${v}</span>
      </button>
    `,f=Ke(a.minutes),c=!!e&&St(e);return h`
      <header>
        ${this.showMenu?h`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ae`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:A}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ce(a.date)}, ${f}`}>
            <span class="hm">${f.slice(0,-3)}</span><span class="ampm">${f.slice(-2)}</span>
          </h1>
          <p class="today-line">${Ce(a.date)}</p>
          ${i?h`<p class="status">${i}</p>`:A}
        </div>
        ${e&&!c?this.renderNext(e,ks(e,a),t):A}
        <div class="controls">
          ${this.wide||c&&!r?A:h`<button type="button" class="attn-btn ${o?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${o}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?A:h`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${d("rides","Rides",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${d("chores","Chores",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,r){if(!t){let d=this.today().date,f=r.unassigned,c=r.laterUnassigned;if(f){let v=h`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${f} ${f===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?h`<div class="next idle needs">${v}</div>`:h`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${v}</button>`}if(c)return h`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${c} ${c===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let p=e.days.some(v=>v.date>=d&&v.events.length);return h`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${p?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${p?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let o;t.ongoing?o="On the road now":t.ahead===0?o=t.inMinutes<180?`Next trip · in ${Ye(t.inMinutes)}`:"Next trip · later today":t.ahead===1?o="Next trip · tomorrow":o=`Next trip · ${oe(t.date)}`;let a=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,i=h`
      <span class="next-eyebrow">${o}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${we(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(d=>h`<span class="kid-dot" style="background:${d.color}"></span>`)}</span>
      </span>
      ${t.warn?h`<span class="next-stop warn">${t.warn}</span>`:t.stop?h`<span class="next-stop">${t.stop}</span>`:A}
    `,l=`next ${t.ongoing?"ongoing":a?"soon":""}`;return t.target?h`<button type="button" class=${l} @click=${()=>this.open(t.target)}>${i}</button>`:h`<div class=${l}>${i}</div>`}renderWeek(e){let t=this.today().date,r=ce(e);return h`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let a=Xt(o),i=o.events.length,l=o.events.slice(0,6).map(f=>r.get(f.kid)?.color??Y(0).color),d=`${Ce(o.date)}: ${i?`${i} ${i===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return h`<button
          type="button"
          class="day-tile ${o.date===t?"today":""}"
          data-date=${o.date}
          aria-label=${d}
          @click=${()=>this.goToDay(o.date)}
        >
          <span class="dt-wd">${o.date===t?"Today":oe(o.date)}</span>
          <span class="dt-num">${Number(o.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(f=>h`<span class="dt-dot" style="background:${f}"></span>`):h`<span class="dt-free">free</span>`}
            ${i>6?h`<span class="dt-more">+${i-6}</span>`:A}
          </span>
          ${a?h`<span class="dt-badge" aria-hidden="true">${a}</span>`:A}
        </button>`})}
    </nav>`}renderQuiet(e){let t=Ie(e),r=ve(e),o=ce(e),a=t.map(i=>le(e,i));return h`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((i,l)=>ae`<circle cx=${50+l*30} cy="80" r="11" fill=${o.get(i).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${si(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(i=>{let l=o.get(i);return h`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${we(le(e,i))}</span>
            <span class="qw-name">${le(e,i)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${r.map(i=>h`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${we(ye(e,i))}</span>
            <span class="qw-name">${ye(e,i)}</span>
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
    </div>`}renderBanner(e){let t=e?.unavailable_calendars.length??0;return t?h`<div class="banner" role="status">
      Couldn’t read ${t===1?"one calendar":`${t} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:A}renderEmpty(){return this.error?h`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:h`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let t=this.sel,r=i=>!!i&&!!t&&i.day===t.day&&i.event===t.event,o=e.dayHeads[0],a=e.width;return h`
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
          ${e.columns.map(i=>h`<div class="col-head ${i.kind}" style="left:${i.x}px;width:${i.w}px;--c:${i.dot};--rgb:${i.rgb}">
              <span class="avatar ${i.kind}" aria-hidden="true">${we(i.name)}</span>
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
          ${e.columns.map(i=>h`<div
                class="col-bg ${i.kind}"
                style="left:${i.x}px;width:${i.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${i.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(i=>h`<div class="day-head" style="top:${i.y}px;width:${a}px">
              <span class="label">${i.label}</span>${i.tag?h`<span class="tag">${i.tag}</span>`:A}<span
                class="sub ${i.warn?"warn":""}"
                >${i.sub}</span
              >
            </div>`)}
          ${e.empties.map(i=>h`<span class="empty" style="top:${i.y}px">${i.text}</span>`)}
          ${e.grid.map(i=>h`<div class="grid ${i.strong?"strong":""}" style="top:${i.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(i=>h`<span class="hour" style="top:${i.y}px">${i.label}</span>`)}
          ${pe(e.bands,i=>i.key,i=>h`<div
                class="band"
                aria-hidden="true"
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;background:rgba(${i.color.rgb},0.10);border-color:rgba(${i.color.rgb},0.45)"
              ></div>`)}
          ${pe(e.busy,i=>i.key,i=>h`<div class="busy" style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px">
                <span style="top:${i.labelY}px">${i.label}</span>
              </div>`)}
          ${pe(e.preps,i=>i.key,i=>h`<div
                class="prep"
                aria-hidden="true"
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;border-color:${i.color.color};background:rgba(${i.color.rgb},0.07);color:${i.color.ink}"
              >
                ${i.label}
              </div>`)}
          ${pe(e.cards,i=>i.key,i=>{let l=i.color,d=i.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:i.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return h`<button
                type="button"
                class="card ${i.wrap?"wrap":""} ${r(i.target)?"sel":""} ${i.clash?"clash":""} ${i.skipped?"skipped":""}"
                aria-label=${i.aria}
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;background:${d};border-color:${i.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(i.target)}
              >
                <span class="top">
                  <span class="title">${i.title}</span>
                  <span class="time">${i.time}</span>
                  ${i.showDrop&&i.drop?h`<span class="line tone-${i.drop.tone}">${i.drop.text}</span>`:A}
                </span>
                ${i.showPick&&i.pick?h`<span class="line tone-${i.pick.tone}">${i.pick.text}</span>`:A}
              </button>`})}
          ${pe(e.rides,i=>i.key,i=>h`<button
                type="button"
                class="ride ${i.dashed?"dashed":""} ${i.clash?"clash":""}"
                aria-label=${i.aria}
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px"
                @click=${()=>this.open(i.target)}
              >
                <span class="l1">${i.l1}</span>${i.show2?h`<span class="l2" style="-webkit-line-clamp:${i.lines2}">${i.l2}</span>`:A}
              </button>`)}
          ${pe(e.stays,i=>i.key,i=>h`<button
                type="button"
                class="stay"
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;border-color:${i.color.color};background:repeating-linear-gradient(135deg, rgba(${i.color.rgb},0.28) 0px, rgba(${i.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(i.target)}
              >
                <span class="l1" style="color:${i.color.ink}">${i.l1}</span><span class="l2">${i.l2}</span>
              </button>`)}
          ${pe(e.trips,i=>i.key,i=>h`<button
                type="button"
                class="trip ${i.bad?"bad":""} ${i.stops?"list":""}"
                aria-label=${i.aria}
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px"
                @click=${()=>this.open(i.target)}
              >
                <span class="l1">${i.l1}${i.kids.map(l=>h`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${i.show2?h`<span class="l2">${i.l2}</span>`:A}
                ${i.stops?i.stops.map(l=>h`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):A}
                ${i.show3?h`<span class="l3">${i.l3}</span>`:A}
              </button>`)}
          ${pe(e.overlaps,i=>i.key,i=>h`<div class="overlap" aria-hidden="true" style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px"></div>`)}
          ${pe(e.marks,i=>i.key,i=>h`<span class="mark" style="left:${i.x}px;top:${i.y}px;${i.right?"transform:translateX(-100%)":""}">${i.text}</span>`)}
          ${e.now?h`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:A}
        </div>
      </div>
    `}renderAttention(e,t){let{items:r,problems:o,later:a}=e,i=this.plan,l=o+t.length,d=this.chores,f=!!d&&!sn(d);return h`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?A:h`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${f?h`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?h`<div class="attn-chores">${t.map(c=>this.renderChoreRow(c,!0))}</div>`:h`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:h`<p class="panel-sub">Rides in the next two days</p>`}
      ${i&&!o?h`<div class="all-clear">
            <span class="check" aria-hidden="true">${ae`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${St(i)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:A}
      ${r.map(c=>h`<div class="issue ${c.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${c.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${c.target?h`<button type="button" class="issue-title" @click=${()=>this.open(c.target,!0)}>${c.title}</button>`:h`<strong class="issue-title">${c.title}</strong>`}
              <span class="issue-body"
                >${c.parts?c.parts.map(p=>typeof p=="string"?p:h`<button type="button" class="issue-link" @click=${()=>this.open(p.target,!0)}>${p.text}</button>`):c.body}</span
              >
            </div>
          </div>
          ${c.suggestions.length?h`<div class="fixes">
                ${c.suggestions.map(p=>h`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(p.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${p.id}`?"Saving…":p.label}</span>
                    <span class="fix-note">${p.note}</span>
                  </button>`)}
              </div>`:A}
        </div>`)}
      ${this.wide&&i&&!St(i)&&this.page==="rides"?this.renderLegend():A}
    `}renderChoreRow(e,t=!1){let r=this.chores,o=this.choreDone(e),a=r.kids.findIndex(C=>C.id===e.kid),i=(this.plan?ce(this.plan).get(e.kid):void 0)??Y(Math.max(0,a)),l=r.kids[a]?.name??"",d=o===je(e)?e:{...e,state:o?"done":"open",done_at:o?new Date().toISOString():null},f=o&&d.done_by&&d.done_by!==e.kid?r.people?.find(C=>C.id===d.done_by)?.name??d.done_by_name??null:null,c=`${nn(d,r.today,r.time_zone)}${f?` · by ${f}`:""}`,p=o||_s(e),v=`${t?`${l}: `:""}${e.title}. ${c?`${c}. `:""}${o?"Done. Tap to undo.":"Tap when it’s done."}`,T=h`<span class="box" aria-hidden="true"
        >${o?ae`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:A}</span
      >
      ${e.icon?h`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:A}
      <span class="chore-text">
        <span class="chore-title">${t?h`<span class="chore-kid">${l}</span> · `:A}${e.title}</span>
        ${c?h`<span class="chore-note">${c}</span>`:A}
      </span>`,u=`chore ${o?"done":""} ${e.state==="overdue"&&!o?"overdue":""} ${p?"":"later"}`,k=`--c:${i.color};--rgb:${i.rgb};--k:${i.ink}`;return p?h`<button type="button" class=${u} style=${k} aria-pressed=${o?"true":"false"} aria-label=${v} @click=${()=>this.tapChore(e)}>
          ${T}
        </button>`:h`<div class=${u} style=${k}>${T}</div>`}renderChores(){let e=this.chores;if(e===void 0)return h`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return h`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return h`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return h`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(sn(e))return h`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${hn} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore templates: Daily</strong> (or Weekly or Monthly). It
          shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(a=>a.problems.length),r=t.length?h`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(a=>this.renderTemplateRow(a))}</div>
        </section>`:A,o=As(e,this.plan?ce(this.plan):void 0);return h`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${hn} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${Zr} Manage chores</button>
      </div>
      ${r}
      <div class="chore-cols" style="--n:${o.length}">
        ${o.map(a=>{let i=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return h`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${we(a.name)}</span>
              <span class="ch-text">
                <span class="name">${a.name}</span>
                <span class="sub">${i?`${i} to do`:a.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
            </div>
            ${a.overdue.length?h`<h3 class="chore-group overdue">Missed</h3>
                  ${a.overdue.map(l=>this.renderChoreRow(l))}`:A}
            ${a.now.length?h`<h3 class="chore-group">To do</h3>
                  ${a.now.map(l=>this.renderChoreRow(l))}`:A}
            ${a.done.length?h`<h3 class="chore-group">Done</h3>
                  ${a.done.map(l=>this.renderChoreRow(l))}`:A}
            ${a.later.map(l=>h`<h3 class="chore-group">${ni(l.date,e.today)}</h3>
                ${l.chores.map(d=>this.renderChoreRow(d))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?h`<p class="chore-none">No chores this week.</p>`:A}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let r=this.chores.kids,o=this.plan?ce(this.plan):void 0,a=this.choreEdit?.template===e.id,i=e.problems.length?h`<span class="tmpl-note bad">${e.problems.map(cn).join(" · ")} · tap to set up</span>`:h`<span class="tmpl-note">${dn(e.who,r,e.take_turns)} · ${ln(e.repeats,e.days??"",e.every??1)}</span>`;return h`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${a?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?h` <span class="tag-paused">Paused</span>`:A}</span>
        ${i}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let d=r.findIndex(c=>c.id===l),f=o?.get(l)??Y(Math.max(0,d));return h`<span class="kid-dot" style="background:${f.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day or some days"],["weekly","Weekly"],["monthly","Monthly"]];return h`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${hn} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([r,o])=>{let a=e.templates.filter(i=>i.repeats===r);return a.length?h`<section class="manage-group" aria-label=${o}>
                  <h3 class="chore-group">${o}</h3>
                  <div class="tmpl-list">${a.map(i=>this.renderTemplateRow(i))}</div>
                </section>`:A}):h`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the lists <strong>Chore templates: Daily</strong>, <strong>Weekly</strong> and
        <strong>Monthly</strong>. A task added there by hand shows up here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return h``;let r=t.kids,o=this.plan?ce(this.plan):void 0,a=this.choreBusy,i=e.template?t.templates.find(u=>u.id===e.template):void 0,l=on(e),d=(i?.problems??[]).filter(u=>u!=="who:"),f=(u,k,C,_=!1)=>h`<button type="button" class="choice ${_?"wide":""}" aria-pressed=${u?"true":"false"} ?disabled=${a} @click=${C}>${k}</button>`,c=(u,k,C,_)=>h`<button type="button" class="chip" aria-pressed=${u?"true":"false"} aria-label=${_??A} ?disabled=${a} @click=${C}>${k}</button>`,p=u=>{u!==e.repeats&&this.changeDraft({repeats:u,days:i&&i.repeats===u?i.days??Mt(u):Mt(u)})},v=u=>{let k=e.who.includes(u)?e.who.filter(C=>C!==u):r.filter(C=>C.id===u||e.who.includes(C.id)).map(C=>C.id);this.changeDraft({who:k})},T;if(e.repeats==="monthly"){let u=e.days.trim(),k=/^\d+$/.test(u)?Number(u):null,C=u&&u.toLowerCase()!=="any"&&u.toLowerCase()!=="last"&&k===null;T=h`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${C?4:3}, minmax(0, 1fr))">
          ${f(u===""||u.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${f(k!==null,"On a date",()=>this.changeDraft({days:String(k??1)}))}
          ${f(u.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${C?f(!0,u,()=>{}):A}
        </div>
        ${k!==null?h`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${a||k<=1} @click=${()=>this.changeDraft({days:String(k-1)})}>−</button>
                <span class="arrive-value">${an(k)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${a||k>=31} @click=${()=>this.changeDraft({days:String(k+1)})}>+</button>
              </span>
            </div>`:h`<p class="field-hint">${u.toLowerCase()==="last"?"Due on the month’s last day.":C?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else{let u=e.repeats==="weekly"&&(e.days===""||e.days.toLowerCase()==="any"),k=e.days===tt?new Set:u?new Set:Cs(e.days)??new Set,C=_=>{let H=new Set(k);H.has(_)?H.delete(_):H.add(_),e.repeats==="weekly"?this.changeDraft({days:H.size?rn(H)||"Mon-Sun":"Any"}):this.changeDraft({days:H.size?rn(H):tt})};T=h`<div class="field">
        <span class="field-label">${e.repeats==="weekly"?"Which day":"Which days"}</span>
        ${e.repeats==="weekly"?h`<div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
              ${f(u,"Any day that week",()=>this.changeDraft({days:"Any"}))}
              ${f(!u,"On a set day",()=>this.changeDraft({days:u?"Sat":e.days}))}
            </div>`:A}
        ${e.repeats==="daily"||!u?h`<div role="group" aria-label="Days of the week" class="day-chips">
              ${He.map((_,H)=>c(k.has(H),_.slice(0,2),()=>C(H),_))}
            </div>`:A}
        ${e.repeats==="daily"?h`<div class="chips">
              ${c(e.days==="","Every day",()=>this.changeDraft({days:""}))}
              ${c(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
              ${c(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
            </div>`:h`<p class="field-hint">${u?"Shows all week, due on Sunday.":"Due that day."}</p>`}
      </div>`}return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?h`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:A}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?dn(e.who,r,e.take_turns):"Nobody yet"} · ${e.days===tt?"No days picked":ln(e.repeats,e.days,e.every)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${a} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${d.length?h`<p class="field-hint bad">${d.map(cn).join(". ")}. Saving fixes it.</p>`:A}
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
          ${ei.map(u=>c(e.icon===u,u,()=>this.changeDraft({icon:e.icon===u?null:u}),`Picture ${u}`))}
        </div>
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${r.map((u,k)=>{let C=o?.get(u.id)??Y(k),_=e.who.includes(u.id);return h`<button type="button" class="who-chip" style="--c:${C.color};--rgb:${C.rgb}" aria-pressed=${_?"true":"false"} ?disabled=${a} @click=${()=>v(u.id)}>
              <span class="avatar" aria-hidden="true">${we(u.name)}</span>${u.name}
            </button>`})}
        </div>
        ${e.who.length>1?h`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${f(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${f(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:A}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(3, minmax(0, 1fr))">
          ${f(e.repeats==="daily","Days",()=>p("daily"))}
          ${f(e.repeats==="weekly","Weekly",()=>p("weekly"))}
          ${f(e.repeats==="monthly","Monthly",()=>p("monthly"))}
        </div>
      </div>
      ${T}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Repeats</span>
          <span class="field-hint">${ti(e.repeats,e.every)}</span>
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
          @input=${u=>this.changeDraft({details:u.target.value})}
        ></textarea>
      </div>
      ${e.template?h`<div class="field">
              ${f(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${a} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:A}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${a?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return h``;let r=t.people?.length?t.people:t.kids.map(c=>({...c,role:"kid"})),o=t.kids.findIndex(c=>c.id===e.kid),a=t.kids[o],i=this.plan?ce(this.plan):void 0,l=i?.get(e.kid)??Y(Math.max(0,o)),d=r.filter(c=>c.id!==e.kid),f=c=>{let p=t.kids.findIndex(v=>v.id===c.id);return p>=0?(i?.get(c.id)??Y(p)).color:"var(--dark)"};return h`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?h`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:A}${e.title}</span>
          <span class="ed-meta">${a?.name??""} · ${nn(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${we(a?.name??"?")}</span>
          <span>${a?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?h`<div role="group" aria-label="Somebody else" class="done-by-list">
              ${d.map(c=>h`<button type="button" class="done-by" style="--c:${f(c)}" @click=${()=>void this.toggleChore(e,c.id)}>
                  <span class="avatar ${c.role==="parent"?"driver":""}" aria-hidden="true">${we(c.name)}</span>
                  <span>${c.name}</span>
                </button>`)}
            </div>`:h`<button type="button" class="choice wide" @click=${()=>this.whoOthers=!0}>Somebody else…</button>`}
      </div>
    `}renderLegend(){return h`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return h``;let{day:r,event:o}=t,a=ve(e),l=ce(e).get(o.kid)??Y(0),d=!!this.pending,f=w=>this.pending?.key===w?this.pending.value:void 0,c=[...e.people?.carpools??[]];for(let w of e.days)for(let E of w.events)for(let S of[E.drop,E.pick])S&&S!=="none"&&!a.includes(S)&&!c.some(z=>z.toLowerCase()===S.toLowerCase())&&c.push(S);let p=w=>{if(!o.sides.includes(w))return A;let E=f(w),S=E!==void 0?String(E):w==="drop"?o.drop:o.pick,z=S&&S!=="none"&&!a.includes(S)?S:"",j=R=>this.setRide(o,w,S===R?"":R),P=[...a.map(R=>[R,Jt(e,R)]),["none","Not needed"]];return h`<div class="field">
        <span class="field-label">${w==="drop"?"Drop-off":"Pick-up"} ${S===""?h`<span class="nobody">· nobody yet</span>`:A}</span>
        <div role="group" aria-label=${w==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${P.length}, minmax(0, 1fr))">
          ${P.map(([R,F])=>h`<button type="button" class="choice" aria-pressed=${S===R?"true":"false"} ?disabled=${d} @click=${()=>j(R)}>
                ${F}
              </button>`)}
        </div>
        ${c.length?h`<div role="group" aria-label=${w==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${c.map(R=>h`<button type="button" class="chip" aria-pressed=${S.toLowerCase()===R.toLowerCase()?"true":"false"} ?disabled=${d} @click=${()=>j(R)}>
                    ${R}
                  </button>`)}
            </div>`:A}
        <input
          type="text"
          .value=${z&&!c.some(R=>R.toLowerCase()===z.toLowerCase())?z:""}
          ?disabled=${d}
          aria-label=${w==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${R=>{let F=R.target.value.trim();F&&F!==S&&this.setRide(o,w,F)}}
          @keydown=${R=>{R.key==="Enter"&&R.target.blur()}}
        />
      </div>`},v=f("stay"),T=v!==void 0?!!v:o.stay,u=o.drop===o.pick&&a.includes(o.drop),k=f("along"),C=k!==void 0?k:o.along,_=Ie(e).filter(w=>w!==o.kid),H=a.includes(o.drop)&&o.sides.includes("drop"),X=f("arrive"),B=this.arriveDraft!==void 0?this.arriveDraft:X!==void 0?X:o.arrive_by,K=[],m=w=>w==="none"?"Not needed":Jt(e,w);o.drop!==""&&K.push(`Drop-off: ${m(o.drop)}`),o.pick!==""&&K.push(`Pick-up: ${m(o.pick)}`),o.stay&&K.push("Stay: yes"),o.along.length&&K.push(`Take along: ${o.along.map(w=>le(e,w)).join(", ")}`),o.arrive_by!=null&&K.push(`Arrive by: ${Ke(o.arrive_by)}`);let y=f("attending"),g=y!==void 0?!!y:o.attending!==!1;o.attending===!1&&K.splice(0,K.length,"Attending: no");let b=r.date===this.today().date?"":`${oe(r.date)} · `,x=h`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${le(e,o.kid)} · ${o.title}</span>
          <span class="ed-meta">${b}${I(o.start)}–${I(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return o.where==="home"?h`${x}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${le(e,o.kid)} can’t get home in time, the board shows it as a clash.</p>`:h`
      ${x}
      ${this.pending?h`<p class="saving" role="status">Saving to Google Calendar…</p>`:A}
      ${o.recurring?h`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${oe(r.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:A}
      <div class="field">
        <span class="field-label">${le(e,o.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${g?"true":"false"} ?disabled=${d} @click=${()=>this.setAttending(o,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${g?"false":"true"} ?disabled=${d} @click=${()=>this.setAttending(o,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${g?h`${o.where==="anywhere"?h`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:A}
            ${p("drop")} ${p("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${T?"true":"false"} ?disabled=${!u||d} @click=${()=>this.toggleStay(o)}>
          ${u?T?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${H&&_.length?h`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${_.map(w=>h`<button type="button" class="chip" aria-pressed=${C.includes(w)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(o,w)}>
                  ${le(e,w)}
                </button>`)}
            </div>
          </div>`:A}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${B!=null?`${o.start-B} min before it starts`:`Aims for a few minutes before ${I(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${d} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${B!=null?I(B):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${d||B==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${B!=null?h`<button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:A}
`:h`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${K.length?K.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?h`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:A}
      ${g?h`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:A}
    `}};st.styles=Ss,st.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",st);function oi(){let s=[document];for(let n of document.querySelectorAll("*"))n.shadowRoot&&s.push(n.shadowRoot);return s}function Rs(s=3e3){let n=new CSSStyleSheet;n.replaceSync("*, *::before, *::after { cursor: none !important; }"),n.disabled=!0;let e,t=o=>{if(o)for(let a of oi())a.adoptedStyleSheets.includes(n)||(a.adoptedStyleSheets=[...a.adoptedStyleSheets,n]);n.disabled=!o},r=o=>{if(clearTimeout(e),o.pointerType==="touch"){t(!0);return}t(!1),e=setTimeout(()=>t(!0),s)};window.addEventListener("pointermove",r,{passive:!0}),window.addEventListener("pointerdown",r,{passive:!0}),e=setTimeout(()=>t(!0),s)}var Ls=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],Is=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Bs(s,n,e,t){let r=Math.max(0,Math.min(n,s.length)),o=Math.max(r,Math.min(e,s.length));return{value:s.slice(0,r)+t+s.slice(o),caret:r+t.length}}function Ns(s,n,e){let t=Math.max(0,Math.min(n,s.length)),r=Math.max(t,Math.min(e,s.length));if(t!==r)return{value:s.slice(0,t)+s.slice(r),caret:t};if(t===0)return{value:s,caret:0};let o=Array.from(s.slice(0,t));o.pop();let a=o.join("");return{value:a+s.slice(t),caret:a.length}}function Os(s,n){return n===0||/\s$/.test(s.slice(0,n))}var ai=new Set(["text","search","email","url","tel","number","password"]);function zs(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&ai.has(s.type)&&!s.readOnly&&!s.disabled}var li={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},di={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},rt=class extends de{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=t=>t.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let t=e.selectionStart,r=e.selectionEnd;if(t!==null&&r!==null)return[t,r]}catch{}return[e.value.length,e.value.length]}apply(e,t,r){e.value=t;try{e.setSelectionRange(r,r)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=Os(this.field.value,e)}press(e){let t=this.field;if(t){switch(e){case"hide":t.blur();return;case"done":this.commit(),t.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),t.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[r,o]=this.selection(t),a=Ns(t.value,r,o);this.apply(t,a.value,a.caret);break}default:{let r=e==="space"?" ":this.shift?e.toUpperCase():e,[o,a]=this.selection(t),i=Bs(t.value,o,a,r);this.apply(t,i.value,i.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let t=e.length>1,r=e==="layout"?this.layout==="letters"?"123":"ABC":li[e]??(this.shift?e.toUpperCase():e);return h`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":t?"wide":""}
      aria-label=${di[e]??r}
      aria-pressed=${e==="shift"?String(this.shift):A}
      @click=${()=>this.press(e)}
    >
      ${r}
    </button>`}render(){let e=this.layout==="letters"?Ls:Is;return h`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(t=>h`<div class="row">${t.map(r=>this.key(r))}</div>`)}
      </div>`}};rt.styles=Ee`
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
  `,rt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",rt);function ci(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function Us(s){document.addEventListener("focusin",n=>{let e=n.composedPath()[0];zs(e)&&s.attach(e)}),document.addEventListener("focusout",()=>{setTimeout(()=>{let n=ci();!s.target||n===s.target||(zs(n)?s.attach(n):s.detach())},0)}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var un="mydashlight",pi=`/api/${un}/pair`,hi=`/api/${un}/pair/poll`,fn=`/${un}`,gn="pair";function Hs(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function js(s,n){return`${s}${fn}?${gn}=${encodeURIComponent(n)}`}function ui(s,n,e=Date.now()){return{hassUrl:s,clientId:n.client_id,access_token:n.access_token,refresh_token:n.refresh_token,expires_in:n.expires_in,expires:e+n.expires_in*1e3}}var Be=class extends Error{constructor(n,e=!1){super(n),this.busy=e}};async function qs(s=fetch){let n=await s(pi,{method:"POST",cache:"no-store"});if(n.status===429)throw new Be("Too many screens are asking to pair right now.",!0);if(!n.ok)throw new Be(`Home Assistant answered ${n.status}.`);return await n.json()}async function Fs(s,n,e=fetch){let t=await e(hi,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(t.status===404)return{status:"expired"};if(!t.ok)throw new Be(`Home Assistant answered ${t.status}.`);let r=await t.json();return r.status==="paired"&&r.auth?{status:"paired",auth:ui(n,r.auth)}:{status:"pending"}}var qe=function(s,n){let r=s,o=it[n],a=null,i=0,l=null,d=[],f={},c=function(m,y){i=r*4+17,a=(function(g){let b=new Array(g);for(let x=0;x<g;x+=1){b[x]=new Array(g);for(let w=0;w<g;w+=1)b[x][w]=null}return b})(i),p(0,0),p(i-7,0),p(0,i-7),u(),T(),C(m,y),r>=7&&k(m),l==null&&(l=X(r,o,d)),_(l,y)},p=function(m,y){for(let g=-1;g<=7;g+=1)if(!(m+g<=-1||i<=m+g))for(let b=-1;b<=7;b+=1)y+b<=-1||i<=y+b||(0<=g&&g<=6&&(b==0||b==6)||0<=b&&b<=6&&(g==0||g==6)||2<=g&&g<=4&&2<=b&&b<=4?a[m+g][y+b]=!0:a[m+g][y+b]=!1)},v=function(){let m=0,y=0;for(let g=0;g<8;g+=1){c(!0,g);let b=ke.getLostPoint(f);(g==0||m>b)&&(m=b,y=g)}return y},T=function(){for(let m=8;m<i-8;m+=1)a[m][6]==null&&(a[m][6]=m%2==0);for(let m=8;m<i-8;m+=1)a[6][m]==null&&(a[6][m]=m%2==0)},u=function(){let m=ke.getPatternPosition(r);for(let y=0;y<m.length;y+=1)for(let g=0;g<m.length;g+=1){let b=m[y],x=m[g];if(a[b][x]==null)for(let w=-2;w<=2;w+=1)for(let E=-2;E<=2;E+=1)w==-2||w==2||E==-2||E==2||w==0&&E==0?a[b+w][x+E]=!0:a[b+w][x+E]=!1}},k=function(m){let y=ke.getBCHTypeNumber(r);for(let g=0;g<18;g+=1){let b=!m&&(y>>g&1)==1;a[Math.floor(g/3)][g%3+i-8-3]=b}for(let g=0;g<18;g+=1){let b=!m&&(y>>g&1)==1;a[g%3+i-8-3][Math.floor(g/3)]=b}},C=function(m,y){let g=o<<3|y,b=ke.getBCHTypeInfo(g);for(let x=0;x<15;x+=1){let w=!m&&(b>>x&1)==1;x<6?a[x][8]=w:x<8?a[x+1][8]=w:a[i-15+x][8]=w}for(let x=0;x<15;x+=1){let w=!m&&(b>>x&1)==1;x<8?a[8][i-x-1]=w:x<9?a[8][15-x-1+1]=w:a[8][15-x-1]=w}a[i-8][8]=!m},_=function(m,y){let g=-1,b=i-1,x=7,w=0,E=ke.getMaskFunction(y);for(let S=i-1;S>0;S-=2)for(S==6&&(S-=1);;){for(let z=0;z<2;z+=1)if(a[b][S-z]==null){let j=!1;w<m.length&&(j=(m[w]>>>x&1)==1),E(b,S-z)&&(j=!j),a[b][S-z]=j,x-=1,x==-1&&(w+=1,x=7)}if(b+=g,b<0||i<=b){b-=g,g=-g;break}}},H=function(m,y){let g=0,b=0,x=0,w=new Array(y.length),E=new Array(y.length);for(let P=0;P<y.length;P+=1){let R=y[P].dataCount,F=y[P].totalCount-R;b=Math.max(b,R),x=Math.max(x,F),w[P]=new Array(R);for(let L=0;L<w[P].length;L+=1)w[P][L]=255&m.getBuffer()[L+g];g+=R;let $=ke.getErrorCorrectPolynomial(F),N=ot(w[P],$.getLength()-1).mod($);E[P]=new Array($.getLength()-1);for(let L=0;L<E[P].length;L+=1){let O=L+N.getLength()-E[P].length;E[P][L]=O>=0?N.getAt(O):0}}let S=0;for(let P=0;P<y.length;P+=1)S+=y[P].totalCount;let z=new Array(S),j=0;for(let P=0;P<b;P+=1)for(let R=0;R<y.length;R+=1)P<w[R].length&&(z[j]=w[R][P],j+=1);for(let P=0;P<x;P+=1)for(let R=0;R<y.length;R+=1)P<E[R].length&&(z[j]=E[R][P],j+=1);return z},X=function(m,y,g){let b=Ws.getRSBlocks(m,y),x=Ks();for(let E=0;E<g.length;E+=1){let S=g[E];x.put(S.getMode(),4),x.put(S.getLength(),ke.getLengthInBits(S.getMode(),m)),S.write(x)}let w=0;for(let E=0;E<b.length;E+=1)w+=b[E].dataCount;if(x.getLengthInBits()>w*8)throw"code length overflow. ("+x.getLengthInBits()+">"+w*8+")";for(x.getLengthInBits()+4<=w*8&&x.put(0,4);x.getLengthInBits()%8!=0;)x.putBit(!1);for(;!(x.getLengthInBits()>=w*8||(x.put(236,8),x.getLengthInBits()>=w*8));)x.put(17,8);return H(x,b)};f.addData=function(m,y){y=y||"Byte";let g=null;switch(y){case"Numeric":g=fi(m);break;case"Alphanumeric":g=gi(m);break;case"Byte":g=mi(m);break;case"Kanji":g=bi(m);break;default:throw"mode:"+y}d.push(g),l=null},f.isDark=function(m,y){if(m<0||i<=m||y<0||i<=y)throw m+","+y;return a[m][y]},f.getModuleCount=function(){return i},f.make=function(){if(r<1){let m=1;for(;m<40;m++){let y=Ws.getRSBlocks(m,o),g=Ks();for(let x=0;x<d.length;x++){let w=d[x];g.put(w.getMode(),4),g.put(w.getLength(),ke.getLengthInBits(w.getMode(),m)),w.write(g)}let b=0;for(let x=0;x<y.length;x++)b+=y[x].dataCount;if(g.getLengthInBits()<=b*8)break}r=m}c(!1,v())},f.createTableTag=function(m,y){m=m||2,y=typeof y>"u"?m*4:y;let g="";g+='<table style="',g+=" border-width: 0px; border-style: none;",g+=" border-collapse: collapse;",g+=" padding: 0px; margin: "+y+"px;",g+='">',g+="<tbody>";for(let b=0;b<f.getModuleCount();b+=1){g+="<tr>";for(let x=0;x<f.getModuleCount();x+=1)g+='<td style="',g+=" border-width: 0px; border-style: none;",g+=" border-collapse: collapse;",g+=" padding: 0px; margin: 0px;",g+=" width: "+m+"px;",g+=" height: "+m+"px;",g+=" background-color: ",g+=f.isDark(b,x)?"#000000":"#ffffff",g+=";",g+='"/>';g+="</tr>"}return g+="</tbody>",g+="</table>",g},f.createSvgTag=function(m,y,g,b){let x={};typeof arguments[0]=="object"&&(x=arguments[0],m=x.cellSize,y=x.margin,g=x.alt,b=x.title),m=m||2,y=typeof y>"u"?m*4:y,g=typeof g=="string"?{text:g}:g||{},g.text=g.text||null,g.id=g.text?g.id||"qrcode-description":null,b=typeof b=="string"?{text:b}:b||{},b.text=b.text||null,b.id=b.text?b.id||"qrcode-title":null;let w=f.getModuleCount()*m+y*2,E,S,z,j,P="",R;for(R="l"+m+",0 0,"+m+" -"+m+",0 0,-"+m+"z ",P+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',P+=x.scalable?"":' width="'+w+'px" height="'+w+'px"',P+=' viewBox="0 0 '+w+" "+w+'" ',P+=' preserveAspectRatio="xMinYMin meet"',P+=b.text||g.text?' role="img" aria-labelledby="'+B([b.id,g.id].join(" ").trim())+'"':"",P+=">",P+=b.text?'<title id="'+B(b.id)+'">'+B(b.text)+"</title>":"",P+=g.text?'<description id="'+B(g.id)+'">'+B(g.text)+"</description>":"",P+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',P+='<path d="',z=0;z<f.getModuleCount();z+=1)for(j=z*m+y,E=0;E<f.getModuleCount();E+=1)f.isDark(z,E)&&(S=E*m+y,P+="M"+S+","+j+R);return P+='" stroke="transparent" fill="black"/>',P+="</svg>",P},f.createDataURL=function(m,y){m=m||2,y=typeof y>"u"?m*4:y;let g=f.getModuleCount()*m+y*2,b=y,x=g-y;return wi(g,g,function(w,E){if(b<=w&&w<x&&b<=E&&E<x){let S=Math.floor((w-b)/m),z=Math.floor((E-b)/m);return f.isDark(z,S)?0:1}else return 1})},f.createImgTag=function(m,y,g){m=m||2,y=typeof y>"u"?m*4:y;let b=f.getModuleCount()*m+y*2,x="";return x+="<img",x+=' src="',x+=f.createDataURL(m,y),x+='"',x+=' width="',x+=b,x+='"',x+=' height="',x+=b,x+='"',g&&(x+=' alt="',x+=B(g),x+='"'),x+="/>",x};let B=function(m){let y="";for(let g=0;g<m.length;g+=1){let b=m.charAt(g);switch(b){case"<":y+="&lt;";break;case">":y+="&gt;";break;case"&":y+="&amp;";break;case'"':y+="&quot;";break;default:y+=b;break}}return y},K=function(m){m=typeof m>"u"?2:m;let g=f.getModuleCount()*1+m*2,b=m,x=g-m,w,E,S,z,j,P={"██":"█","█ ":"▀"," █":"▄","  ":" "},R={"██":"▀","█ ":"▀"," █":" ","  ":" "},F="";for(w=0;w<g;w+=2){for(S=Math.floor((w-b)/1),z=Math.floor((w+1-b)/1),E=0;E<g;E+=1)j="█",b<=E&&E<x&&b<=w&&w<x&&f.isDark(S,Math.floor((E-b)/1))&&(j=" "),b<=E&&E<x&&b<=w+1&&w+1<x&&f.isDark(z,Math.floor((E-b)/1))?j+=" ":j+="█",F+=m<1&&w+1>=x?R[j]:P[j];F+=`
`}return g%2&&m>0?F.substring(0,F.length-g-1)+Array(g+1).join("▀"):F.substring(0,F.length-1)};return f.createASCII=function(m,y){if(m=m||1,m<2)return K(y);m-=1,y=typeof y>"u"?m*2:y;let g=f.getModuleCount()*m+y*2,b=y,x=g-y,w,E,S,z,j=Array(m+1).join("██"),P=Array(m+1).join("  "),R="",F="";for(w=0;w<g;w+=1){for(S=Math.floor((w-b)/m),F="",E=0;E<g;E+=1)z=1,b<=E&&E<x&&b<=w&&w<x&&f.isDark(S,Math.floor((E-b)/m))&&(z=0),F+=z?j:P;for(S=0;S<m;S+=1)R+=F+`
`}return R.substring(0,R.length-1)},f.renderTo2dContext=function(m,y){y=y||2;let g=f.getModuleCount();for(let b=0;b<g;b++)for(let x=0;x<g;x++)m.fillStyle=f.isDark(b,x)?"black":"white",m.fillRect(x*y,b*y,y,y)},f};qe.stringToBytes=function(s){let n=[];for(let e=0;e<s.length;e+=1){let t=s.charCodeAt(e);n.push(t&255)}return n};qe.createStringToBytes=function(s,n){let e=(function(){let r=vi(s),o=function(){let l=r.read();if(l==-1)throw"eof";return l},a=0,i={};for(;;){let l=r.read();if(l==-1)break;let d=o(),f=o(),c=o(),p=String.fromCharCode(l<<8|d),v=f<<8|c;i[p]=v,a+=1}if(a!=n)throw a+" != "+n;return i})(),t=63;return function(r){let o=[];for(let a=0;a<r.length;a+=1){let i=r.charCodeAt(a);if(i<128)o.push(i);else{let l=e[r.charAt(a)];typeof l=="number"?(l&255)==l?o.push(l):(o.push(l>>>8),o.push(l&255)):o.push(t)}}return o}};var re={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},it={L:1,M:0,Q:3,H:2},$e={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},ke=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,e=7973,t=21522,r={},o=function(a){let i=0;for(;a!=0;)i+=1,a>>>=1;return i};return r.getBCHTypeInfo=function(a){let i=a<<10;for(;o(i)-o(n)>=0;)i^=n<<o(i)-o(n);return(a<<10|i)^t},r.getBCHTypeNumber=function(a){let i=a<<12;for(;o(i)-o(e)>=0;)i^=e<<o(i)-o(e);return a<<12|i},r.getPatternPosition=function(a){return s[a-1]},r.getMaskFunction=function(a){switch(a){case $e.PATTERN000:return function(i,l){return(i+l)%2==0};case $e.PATTERN001:return function(i,l){return i%2==0};case $e.PATTERN010:return function(i,l){return l%3==0};case $e.PATTERN011:return function(i,l){return(i+l)%3==0};case $e.PATTERN100:return function(i,l){return(Math.floor(i/2)+Math.floor(l/3))%2==0};case $e.PATTERN101:return function(i,l){return i*l%2+i*l%3==0};case $e.PATTERN110:return function(i,l){return(i*l%2+i*l%3)%2==0};case $e.PATTERN111:return function(i,l){return(i*l%3+(i+l)%2)%2==0};default:throw"bad maskPattern:"+a}},r.getErrorCorrectPolynomial=function(a){let i=ot([1],0);for(let l=0;l<a;l+=1)i=i.multiply(ot([1,_e.gexp(l)],0));return i},r.getLengthInBits=function(a,i){if(1<=i&&i<10)switch(a){case re.MODE_NUMBER:return 10;case re.MODE_ALPHA_NUM:return 9;case re.MODE_8BIT_BYTE:return 8;case re.MODE_KANJI:return 8;default:throw"mode:"+a}else if(i<27)switch(a){case re.MODE_NUMBER:return 12;case re.MODE_ALPHA_NUM:return 11;case re.MODE_8BIT_BYTE:return 16;case re.MODE_KANJI:return 10;default:throw"mode:"+a}else if(i<41)switch(a){case re.MODE_NUMBER:return 14;case re.MODE_ALPHA_NUM:return 13;case re.MODE_8BIT_BYTE:return 16;case re.MODE_KANJI:return 12;default:throw"mode:"+a}else throw"type:"+i},r.getLostPoint=function(a){let i=a.getModuleCount(),l=0;for(let c=0;c<i;c+=1)for(let p=0;p<i;p+=1){let v=0,T=a.isDark(c,p);for(let u=-1;u<=1;u+=1)if(!(c+u<0||i<=c+u))for(let k=-1;k<=1;k+=1)p+k<0||i<=p+k||u==0&&k==0||T==a.isDark(c+u,p+k)&&(v+=1);v>5&&(l+=3+v-5)}for(let c=0;c<i-1;c+=1)for(let p=0;p<i-1;p+=1){let v=0;a.isDark(c,p)&&(v+=1),a.isDark(c+1,p)&&(v+=1),a.isDark(c,p+1)&&(v+=1),a.isDark(c+1,p+1)&&(v+=1),(v==0||v==4)&&(l+=3)}for(let c=0;c<i;c+=1)for(let p=0;p<i-6;p+=1)a.isDark(c,p)&&!a.isDark(c,p+1)&&a.isDark(c,p+2)&&a.isDark(c,p+3)&&a.isDark(c,p+4)&&!a.isDark(c,p+5)&&a.isDark(c,p+6)&&(l+=40);for(let c=0;c<i;c+=1)for(let p=0;p<i-6;p+=1)a.isDark(p,c)&&!a.isDark(p+1,c)&&a.isDark(p+2,c)&&a.isDark(p+3,c)&&a.isDark(p+4,c)&&!a.isDark(p+5,c)&&a.isDark(p+6,c)&&(l+=40);let d=0;for(let c=0;c<i;c+=1)for(let p=0;p<i;p+=1)a.isDark(p,c)&&(d+=1);let f=Math.abs(100*d/i/i-50)/5;return l+=f*10,l},r})(),_e=(function(){let s=new Array(256),n=new Array(256);for(let t=0;t<8;t+=1)s[t]=1<<t;for(let t=8;t<256;t+=1)s[t]=s[t-4]^s[t-5]^s[t-6]^s[t-8];for(let t=0;t<255;t+=1)n[s[t]]=t;let e={};return e.glog=function(t){if(t<1)throw"glog("+t+")";return n[t]},e.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return s[t]},e})(),ot=function(s,n){if(typeof s.length>"u")throw s.length+"/"+n;let e=(function(){let r=0;for(;r<s.length&&s[r]==0;)r+=1;let o=new Array(s.length-r+n);for(let a=0;a<s.length-r;a+=1)o[a]=s[a+r];return o})(),t={};return t.getAt=function(r){return e[r]},t.getLength=function(){return e.length},t.multiply=function(r){let o=new Array(t.getLength()+r.getLength()-1);for(let a=0;a<t.getLength();a+=1)for(let i=0;i<r.getLength();i+=1)o[a+i]^=_e.gexp(_e.glog(t.getAt(a))+_e.glog(r.getAt(i)));return ot(o,0)},t.mod=function(r){if(t.getLength()-r.getLength()<0)return t;let o=_e.glog(t.getAt(0))-_e.glog(r.getAt(0)),a=new Array(t.getLength());for(let i=0;i<t.getLength();i+=1)a[i]=t.getAt(i);for(let i=0;i<r.getLength();i+=1)a[i]^=_e.gexp(_e.glog(r.getAt(i))+o);return ot(a,0).mod(r)},t},Ws=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],n=function(r,o){let a={};return a.totalCount=r,a.dataCount=o,a},e={},t=function(r,o){switch(o){case it.L:return s[(r-1)*4+0];case it.M:return s[(r-1)*4+1];case it.Q:return s[(r-1)*4+2];case it.H:return s[(r-1)*4+3];default:return}};return e.getRSBlocks=function(r,o){let a=t(r,o);if(typeof a>"u")throw"bad rs block @ typeNumber:"+r+"/errorCorrectionLevel:"+o;let i=a.length/3,l=[];for(let d=0;d<i;d+=1){let f=a[d*3+0],c=a[d*3+1],p=a[d*3+2];for(let v=0;v<f;v+=1)l.push(n(c,p))}return l},e})(),Ks=function(){let s=[],n=0,e={};return e.getBuffer=function(){return s},e.getAt=function(t){let r=Math.floor(t/8);return(s[r]>>>7-t%8&1)==1},e.put=function(t,r){for(let o=0;o<r;o+=1)e.putBit((t>>>r-o-1&1)==1)},e.getLengthInBits=function(){return n},e.putBit=function(t){let r=Math.floor(n/8);s.length<=r&&s.push(0),t&&(s[r]|=128>>>n%8),n+=1},e},fi=function(s){let n=re.MODE_NUMBER,e=s,t={};t.getMode=function(){return n},t.getLength=function(a){return e.length},t.write=function(a){let i=e,l=0;for(;l+2<i.length;)a.put(r(i.substring(l,l+3)),10),l+=3;l<i.length&&(i.length-l==1?a.put(r(i.substring(l,l+1)),4):i.length-l==2&&a.put(r(i.substring(l,l+2)),7))};let r=function(a){let i=0;for(let l=0;l<a.length;l+=1)i=i*10+o(a.charAt(l));return i},o=function(a){if("0"<=a&&a<="9")return a.charCodeAt(0)-48;throw"illegal char :"+a};return t},gi=function(s){let n=re.MODE_ALPHA_NUM,e=s,t={};t.getMode=function(){return n},t.getLength=function(o){return e.length},t.write=function(o){let a=e,i=0;for(;i+1<a.length;)o.put(r(a.charAt(i))*45+r(a.charAt(i+1)),11),i+=2;i<a.length&&o.put(r(a.charAt(i)),6)};let r=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;if("A"<=o&&o<="Z")return o.charCodeAt(0)-65+10;switch(o){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+o}};return t},mi=function(s){let n=re.MODE_8BIT_BYTE,e=s,t=qe.stringToBytes(s),r={};return r.getMode=function(){return n},r.getLength=function(o){return t.length},r.write=function(o){for(let a=0;a<t.length;a+=1)o.put(t[a],8)},r},bi=function(s){let n=re.MODE_KANJI,e=s,t=qe.stringToBytes;(function(a,i){let l=t(a);if(l.length!=2||(l[0]<<8|l[1])!=i)throw"sjis not supported."})("友",38726);let r=t(s),o={};return o.getMode=function(){return n},o.getLength=function(a){return~~(r.length/2)},o.write=function(a){let i=r,l=0;for(;l+1<i.length;){let d=(255&i[l])<<8|255&i[l+1];if(33088<=d&&d<=40956)d-=33088;else if(57408<=d&&d<=60351)d-=49472;else throw"illegal char at "+(l+1)+"/"+d;d=(d>>>8&255)*192+(d&255),a.put(d,13),l+=2}if(l<i.length)throw"illegal char at "+(l+1)},o},Vs=function(){let s=[],n={};return n.writeByte=function(e){s.push(e&255)},n.writeShort=function(e){n.writeByte(e),n.writeByte(e>>>8)},n.writeBytes=function(e,t,r){t=t||0,r=r||e.length;for(let o=0;o<r;o+=1)n.writeByte(e[o+t])},n.writeString=function(e){for(let t=0;t<e.length;t+=1)n.writeByte(e.charCodeAt(t))},n.toByteArray=function(){return s},n.toString=function(){let e="";e+="[";for(let t=0;t<s.length;t+=1)t>0&&(e+=","),e+=s[t];return e+="]",e},n},xi=function(){let s=0,n=0,e=0,t="",r={},o=function(i){t+=String.fromCharCode(a(i&63))},a=function(i){if(i<0)throw"n:"+i;if(i<26)return 65+i;if(i<52)return 97+(i-26);if(i<62)return 48+(i-52);if(i==62)return 43;if(i==63)return 47;throw"n:"+i};return r.writeByte=function(i){for(s=s<<8|i&255,n+=8,e+=1;n>=6;)o(s>>>n-6),n-=6},r.flush=function(){if(n>0&&(o(s<<6-n),s=0,n=0),e%3!=0){let i=3-e%3;for(let l=0;l<i;l+=1)t+="="}},r.toString=function(){return t},r},vi=function(s){let n=s,e=0,t=0,r=0,o={};o.read=function(){for(;r<8;){if(e>=n.length){if(r==0)return-1;throw"unexpected end of file./"+r}let l=n.charAt(e);if(e+=1,l=="=")return r=0,-1;if(l.match(/^\s$/))continue;t=t<<6|a(l.charCodeAt(0)),r+=6}let i=t>>>r-8&255;return r-=8,i};let a=function(i){if(65<=i&&i<=90)return i-65;if(97<=i&&i<=122)return i-97+26;if(48<=i&&i<=57)return i-48+52;if(i==43)return 62;if(i==47)return 63;throw"c:"+i};return o},yi=function(s,n){let e=s,t=n,r=new Array(s*n),o={};o.setPixel=function(d,f,c){r[f*e+d]=c},o.write=function(d){d.writeString("GIF87a"),d.writeShort(e),d.writeShort(t),d.writeByte(128),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(255),d.writeByte(255),d.writeByte(255),d.writeString(","),d.writeShort(0),d.writeShort(0),d.writeShort(e),d.writeShort(t),d.writeByte(0);let f=2,c=i(f);d.writeByte(f);let p=0;for(;c.length-p>255;)d.writeByte(255),d.writeBytes(c,p,255),p+=255;d.writeByte(c.length-p),d.writeBytes(c,p,c.length-p),d.writeByte(0),d.writeString(";")};let a=function(d){let f=d,c=0,p=0,v={};return v.write=function(T,u){if(T>>>u)throw"length over";for(;c+u>=8;)f.writeByte(255&(T<<c|p)),u-=8-c,T>>>=8-c,p=0,c=0;p=T<<c|p,c=c+u},v.flush=function(){c>0&&f.writeByte(p)},v},i=function(d){let f=1<<d,c=(1<<d)+1,p=d+1,v=l();for(let _=0;_<f;_+=1)v.add(String.fromCharCode(_));v.add(String.fromCharCode(f)),v.add(String.fromCharCode(c));let T=Vs(),u=a(T);u.write(f,p);let k=0,C=String.fromCharCode(r[k]);for(k+=1;k<r.length;){let _=String.fromCharCode(r[k]);k+=1,v.contains(C+_)?C=C+_:(u.write(v.indexOf(C),p),v.size()<4095&&(v.size()==1<<p&&(p+=1),v.add(C+_)),C=_)}return u.write(v.indexOf(C),p),u.write(c,p),u.flush(),T.toByteArray()},l=function(){let d={},f=0,c={};return c.add=function(p){if(c.contains(p))throw"dup key:"+p;d[p]=f,f+=1},c.size=function(){return f},c.indexOf=function(p){return d[p]},c.contains=function(p){return typeof d[p]<"u"},c};return o},wi=function(s,n,e){let t=yi(s,n);for(let i=0;i<n;i+=1)for(let l=0;l<s;l+=1)t.setPixel(l,i,e(l,i));let r=Vs();t.write(r);let o=xi(),a=r.toByteArray();for(let i=0;i<a.length;i+=1)o.writeByte(a[i]);return o.flush(),"data:image/gif;base64,"+o},Ys=qe,Jo=qe.stringToBytes;function Gs(s){let n=Ys(0,"M");n.addData(s),n.make();let e=n.getModuleCount(),t="";for(let r=0;r<e;r++)for(let o=0;o<e;o++)n.isDark(r,o)&&(t+=`M${o} ${r}h1v1h-1z`);return{size:e,d:t}}var $i=1e4,at=class extends de{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,t){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,t))}async newCode(){try{let e=await qs();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof Be&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),$i)}}async poll(e){let t=this.secret;if(t)try{let r=await Fs(t,location.origin);if(!this.running||t!==this.secret)return;if(this.problem=null,r.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:r.auth}));return}if(r.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return A;let{size:e,d:t}=Gs(js(location.origin,this.code));return h`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${ae`<path d=${t} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return h`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?Hs(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${fn}?${gn}</span> and type the code.
          </li>
          <li>You’ll need to be a Home Assistant admin. The screen signs in as you.</li>
        </ol>
      </div>
      <div class="qr">${this.qr()}</div>
      <div class="foot">
        ${this.problem?h`<span class="problem" role="alert">${this.problem}</span>`:h`<span>${this.code?`A new code appears in ${e} minute${e===1?"":"s"}.`:"Getting a code…"}</span>`}
        <button type="button" class="link" @click=${()=>this.dispatchEvent(new CustomEvent("password"))}>
          Sign in with a password instead
        </button>
      </div>
    </div>`}};at.styles=Ee`
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
  `,at.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",at);var mn="hassTokens";function Qs(){try{let s=localStorage.getItem(mn);return s?JSON.parse(s):null}catch{return null}}function bn(s){try{s?localStorage.setItem(mn,JSON.stringify(s)):localStorage.removeItem(mn)}catch{}}function ki(s){let n=document.getElementById("problem");n&&(n.hidden=!1,n.querySelector("p").textContent=s)}function _i(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(n=>{let e=t=>{s.stop(),s.hidden=!0,n(t)};s.addEventListener("paired",t=>e(t.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function Ai(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let n=location.search.includes("auth_callback");if(!n&&!Qs()){let e=await _i();e&&bn(e)}try{let e=await In({hassUrl:location.origin,loadTokens:async()=>Qs(),saveTokens:bn});n&&history.replaceState(null,"",location.pathname+pn(location.search));let t=await Bn({auth:e});s.backend=new ht(t),t.addEventListener("reconnect-error",(r,o)=>{o===2&&Js()})}catch(e){if(e===2){Js();return}ki(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function Js(){bn(null),location.replace(location.pathname+pn(location.search))}var Zs=nt(location.search),Xs=document.querySelector("mydashlight-keyboard");Xs&&Zs.keyboard!==!1&&Us(Xs);Zs.cursor!=="show"&&Rs();Ai();
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
