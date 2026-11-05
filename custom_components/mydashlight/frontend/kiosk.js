function Ln(s){return{type:"auth",access_token:s}}function Rn(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Bn(s){let n={type:"subscribe_events"};return s&&(n.event_type=s),n}function Ut(s){return{type:"unsubscribe_events",subscription:s}}function Nn(){return{type:"ping"}}function In(s,n){return{type:"result",success:!1,error:{code:s,message:n}}}function zn(s){let n={},e=s.split("&");for(let t=0;t<e.length;t++){let r=e[t].split("="),o=decodeURIComponent(r[0]),a=r.length>1?decodeURIComponent(r[1]):void 0;n[o]=a}return n}var Un=(s,n,e,t)=>{let[r,o,a]=s.split(".",3);return Number(r)>n||Number(r)===n&&(t===void 0?Number(o)>=e:Number(o)>e)||t!==void 0&&Number(r)===n&&Number(o)===e&&Number(a)>=t};var ht=!1,yr="auth_required",wr="auth_invalid",$r="auth_ok";function jn(s){if(!s.auth)throw 4;let n=s.auth,e=n.expired?n.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,t=n.wsUrl;ht&&console.log("[Auth phase] Initializing",t);function r(o,a,i){ht&&console.log("[Auth Phase] New connection",t);let l=new WebSocket(t),c=!1,h=()=>{if(l.removeEventListener("close",h),c){i(2);return}if(o===0){i(1);return}let v=o===-1?-1:o-1;setTimeout(()=>r(v,a,i),1e3)},d=async v=>{try{n.expired&&await(e||n.refreshAccessToken()),l.send(JSON.stringify(Ln(n.accessToken)))}catch(w){c=w===2,l.close()}},f=async v=>{let w=JSON.parse(v.data);switch(ht&&console.log("[Auth phase] Received",w),w.type){case wr:c=!0,l.close();break;case $r:l.removeEventListener("open",d),l.removeEventListener("message",f),l.removeEventListener("close",h),l.removeEventListener("error",h),l.haVersion=w.ha_version,Un(l.haVersion,2022,9)&&l.send(JSON.stringify(Rn())),a(l);break;default:ht&&w.type!==yr&&console.warn("[Auth phase] Unhandled message",w)}};l.addEventListener("open",d),l.addEventListener("message",f),l.addEventListener("close",h),l.addEventListener("error",h)}return new Promise((o,a)=>r(s.setupRetry,o,a))}var Ge=!1,pt=class{constructor(n,e){this._handleMessage=t=>{let r=JSON.parse(t.data);Array.isArray(r)||(r=[r]),r.forEach(o=>{Ge&&console.log("Received",o);let a=this.commands.get(o.id);switch(o.type){case"event":a?a.callback(o.event):(console.warn(`Received event for unknown subscription ${o.id}. Unsubscribing.`),this.sendMessagePromise(Ut(o.id)).catch(i=>{Ge&&console.warn(` Error unsubsribing from unknown subscription ${o.id}`,i)}));break;case"result":a&&(o.success?(a.resolve(o.result),"subscribe"in a||this.commands.delete(o.id)):(a.reject(o.error),this.commands.delete(o.id)));break;case"pong":a?(a.resolve(),this.commands.delete(o.id)):console.warn(`Received unknown pong response ${o.id}`);break;default:Ge&&console.warn("Unhandled message",o)}})},this._handleClose=async()=>{let t=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,t.forEach(a=>{"subscribe"in a||a.reject(In(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let r=Object.assign(Object.assign({},this.options),{setupRetry:0}),o=a=>{setTimeout(async()=>{if(!this.closeRequested){Ge&&console.log("Trying to reconnect");try{let i=await r.createSocket(r);this._setSocket(i)}catch(i){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let c of l)c.reject&&c.reject(3)}i===2?this.fireEvent("reconnect-error",i):o(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),o(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(n)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(n){this.socket=n,this.haVersion=n.haVersion,n.addEventListener("message",this._handleMessage),n.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(r=>{"subscribe"in r&&r.subscribe&&r.subscribe().then(o=>{r.unsubscribe=o,r.resolve()})}));let t=this._queuedMessages;if(t){this._queuedMessages=void 0;for(let r of t)r.resolve()}this.fireEvent("ready")}addEventListener(n,e){let t=this.eventListeners.get(n);t||(t=[],this.eventListeners.set(n,t)),t.push(e)}removeEventListener(n,e){let t=this.eventListeners.get(n);if(!t)return;let r=t.indexOf(e);r!==-1&&t.splice(r,1)}fireEvent(n,e){(this.eventListeners.get(n)||[]).forEach(t=>t(this,e))}suspendReconnectUntil(n){this.suspendReconnectPromise=n}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(n=!1){if(this.socket){if(!n){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(n,e){return this.subscribeMessage(n,Bn(e))}ping(){return this.sendMessagePromise(Nn())}sendMessage(n,e){if(!this.connected)throw 3;if(Ge&&console.log("Sending",n),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(n)});return}e||(e=this._genCmdId()),n.id=e,this.socket.send(JSON.stringify(n))}sendMessagePromise(n){return new Promise((e,t)=>{if(this._queuedMessages){this._queuedMessages.push({reject:t,resolve:async()=>{try{e(await this.sendMessagePromise(n))}catch(o){t(o)}}});return}let r=this._genCmdId();this.commands.set(r,{resolve:e,reject:t}),this.sendMessage(n,r)})}async subscribeMessage(n,e,t){if(this._queuedMessages&&await new Promise((o,a)=>{this._queuedMessages.push({resolve:o,reject:a})}),t?.preCheck&&!await t.preCheck())throw new Error("Pre-check failed");let r;return await new Promise((o,a)=>{let i=this._genCmdId();r={resolve:o,reject:a,callback:n,subscribe:t?.resubscribe!==!1?()=>this.subscribeMessage(n,e,t):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Ut(i)),this.commands.delete(i)}},this.commands.set(i,r);try{this.sendMessage(e,i)}catch{}}),()=>r.unsubscribe()}_genCmdId(){return++this.commandId}};var kr=()=>`${location.protocol}//${location.host}/`,_r=s=>s*1e3+Date.now();function Cr(){let{protocol:s,host:n,pathname:e,search:t}=location;return`${s}//${n}${e}${t}`}function Tr(s,n,e,t){let r=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return n!==null&&(r+=`&client_id=${encodeURIComponent(n)}`),t&&(r+=`&state=${encodeURIComponent(t)}`),r}function Ar(s,n,e,t){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Tr(s,n,e,t)}async function Wn(s,n,e){let t=typeof location<"u"&&location;if(t&&t.protocol==="https:"){let i=document.createElement("a");if(i.href=s,i.protocol==="http:"&&i.hostname!=="localhost")throw 5}let r=new FormData;n!==null&&r.append("client_id",n),Object.keys(e).forEach(i=>{r.append(i,e[i])});let o=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:r});if(!o.ok)throw o.status===400||o.status===403?2:new Error("Unable to fetch tokens");let a=await o.json();return a.hassUrl=s,a.clientId=n,a.expires=_r(a.expires_in),a}function Kn(s,n,e){return Wn(s,n,{code:e,grant_type:"authorization_code"})}function Er(s){return btoa(JSON.stringify(s))}function Pr(s){return JSON.parse(atob(s))}var Ht=class{constructor(n,e){this.data=n,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let n=await Wn(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});n.refresh_token=this.data.refresh_token,this.data=n,this._saveTokens&&this._saveTokens(n)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let n=new FormData;n.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:n}),this._saveTokens&&this._saveTokens(null)}};async function Fn(s={}){let n,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let t=s.clientId!==void 0?s.clientId:kr(),r=s.limitHassInstance===!0;if(s.authCode&&e&&(n=await Kn(e,t,s.authCode),s.saveTokens&&s.saveTokens(n)),!n){let o=zn(location.search.substr(1));if("auth_callback"in o){let a=Pr(o.state);if(r&&(a.hassUrl!==e||a.clientId!==t))throw 6;n=await Kn(a.hassUrl,a.clientId,o.code),s.saveTokens&&s.saveTokens(n)}}if(!n&&s.loadTokens&&(n=await s.loadTokens()),n&&(e===void 0||n.hassUrl===e))return new Ht(n,s.saveTokens);if(e===void 0)throw 4;return Ar(e,t,s.redirectUrl||Cr(),Er({hassUrl:e,clientId:t})),new Promise(()=>{})}async function Vn(s){let n=Object.assign({setupRetry:0,createSocket:jn},s),e=await n.createSocket(n);return new pt(e,n)}function B(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function Ye(s){let n=Math.floor(Math.round(s)/60)%24;return`${B(s)} ${n<12?"AM":"PM"}`}function Gn(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function Je(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function Yn(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Mr=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Sr=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Dr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function ut(s){return new Date(`${s}T12:00:00Z`)}function ye(s){let n=ut(s);return`${Mr.format(n)}, ${Dr.format(n)}`}function ae(s){return Sr.format(ut(s))}function he(s,n){return Math.round((ut(n).getTime()-ut(s).getTime())/864e5)}function Qe(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return Qe("UTC",n)}let t=r=>e.find(o=>o.type===r)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function ft(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let r=Qe(e,s),o=Qe(e,n).date;return r.date===o?`at ${Ye(r.minutes)}`:`on ${ae(r.date)} at ${Ye(r.minutes)}`}var F=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}},Pe="mydashlight",Lr=7,Qn=3e4;function jt(s){if(s instanceof F)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new F(String(n.code??"error"),n.message)}return typeof s=="number"?new F("connection_lost","Lost the connection to Home Assistant."):new F("error",String(s))}var gt=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new F("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.pushing}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Qn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,n&&n().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(n=>{this.pushing=!0,n.plan?this.emit(n.plan):this.fail(new F("not_running","MyDashLight isn’t running right now."))},{type:`${Pe}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:"get_plan",service_data:{days:Lr},return_response:!0});this.emit(n.response)}catch(n){this.fail(jt(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:n,service_data:e})}catch(t){throw jt(t)}this.pushing||await this.refresh()}setRide(n,e,t,r){return this.call("set_ride",{event:n,side:e,driver:t,scope:r})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:Yn(e),scope:t})}setTakeAlong(n,e,t){return this.call("set_take_along",{event:n,kids:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}watchChores(n){let e=!1,t=null,r=null,o=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:"get_chores",service_data:{},return_response:!0});e||n(a.response??null)}catch{e||n(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(i=>{e||n(i.chores)},{type:`${Pe}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):t=a}catch{if(e)return;o(),r=setInterval(()=>void o(),Qn)}})(),()=>{e=!0,r&&clearInterval(r),t&&t().catch(()=>{})}}watchLunch(n){let e=!1,t=null;return(async()=>{try{let r=await this.conn.subscribeMessage(o=>{e||n(o.lunch)},{type:`${Pe}/lunch/subscribe`},{resubscribe:!0});e?r().catch(()=>{}):t=r}catch{e||n(null)}})(),()=>{e=!0,t&&t().catch(()=>{})}}async setLunch(n,e,t){await this.choreCall("set_lunch",{kid:n,dates:e,lunch:t??"default"})}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:n,service_data:e})}catch(t){throw jt(t)}}};var mt=globalThis,bt=mt.ShadowRoot&&(mt.ShadyCSS===void 0||mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,qt=Symbol(),Jn=new WeakMap,Ze=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==qt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(bt&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=Jn.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&Jn.set(e,n))}return n}toString(){return this.cssText}},Zn=s=>new Ze(typeof s=="string"?s:s+"",void 0,qt),Me=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,r,o)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new Ze(e,s,qt)},Xn=(s,n)=>{if(bt)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),r=mt.litNonce;r!==void 0&&t.setAttribute("nonce",r),t.textContent=e.cssText,s.appendChild(t)}},Kt=bt?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return Zn(e)})(s):s;var{is:Rr,defineProperty:Br,getOwnPropertyDescriptor:Nr,getOwnPropertyNames:Ir,getOwnPropertySymbols:Or,getPrototypeOf:zr}=Object,xt=globalThis,es=xt.trustedTypes,Ur=es?es.emptyScript:"",Hr=xt.reactiveElementPolyfillSupport,Xe=(s,n)=>s,Wt={toAttribute(s,n){switch(n){case Boolean:s=s?Ur:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},ns=(s,n)=>!Rr(s,n),ts={attribute:!0,type:String,converter:Wt,reflect:!1,useDefault:!1,hasChanged:ns};Symbol.metadata??=Symbol("metadata"),xt.litPropertyMetadata??=new WeakMap;var ge=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=ts){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),r=this.getPropertyDescriptor(n,t,e);r!==void 0&&Br(this.prototype,n,r)}}static getPropertyDescriptor(n,e,t){let{get:r,set:o}=Nr(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let i=r?.call(this);o?.call(this,a),this.requestUpdate(n,i,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??ts}static _$Ei(){if(this.hasOwnProperty(Xe("elementProperties")))return;let n=zr(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Xe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Xe("properties"))){let e=this.properties,t=[...Ir(e),...Or(e)];for(let r of t)this.createProperty(r,e[r])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let r=this._$Eu(e,t);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let r of t)e.unshift(Kt(r))}else n!==void 0&&e.push(Kt(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Xn(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),r=this.constructor._$Eu(n,t);if(r!==void 0&&t.reflect===!0){let o=(t.converter?.toAttribute!==void 0?t.converter:Wt).toAttribute(e,t.type);this._$Em=n,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(n,e){let t=this.constructor,r=t._$Eh.get(n);if(r!==void 0&&this._$Em!==r){let o=t.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:Wt;this._$Em=r;let i=a.fromAttribute(e,o.type);this[r]=i??this._$Ej?.get(r)??i,this._$Em=null}}requestUpdate(n,e,t,r=!1,o){if(n!==void 0){let a=this.constructor;if(r===!1&&(o=this[n]),t??=a.getPropertyOptions(n),!((t.hasChanged??ns)(o,e)||t.useDefault&&t.reflect&&o===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:r,wrapped:o},a){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),o!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),r===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[r,o]of t){let{wrapped:a}=o,i=this[r];a!==!0||this._$AL.has(r)||i===void 0||this.C(r,void 0,o,i)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};ge.elementStyles=[],ge.shadowRootOptions={mode:"open"},ge[Xe("elementProperties")]=new Map,ge[Xe("finalized")]=new Map,Hr?.({ReactiveElement:ge}),(xt.reactiveElementVersions??=[]).push("2.1.2");var Vt=globalThis,ss=s=>s,vt=Vt.trustedTypes,rs=vt?vt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Gt="$lit$",me=`lit$${Math.random().toFixed(9).slice(2)}$`,Yt="?"+me,jr=`<${Yt}>`,Le=document,tt=()=>Le.createComment(""),nt=s=>s===null||typeof s!="object"&&typeof s!="function",Qt=Array.isArray,cs=s=>Qt(s)||typeof s?.[Symbol.iterator]=="function",Ft=`[ 	
\f\r]`,et=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,is=/-->/g,os=/>/g,Se=RegExp(`>|${Ft}(?:([^\\s"'>=/]+)(${Ft}*=${Ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),as=/'/g,ls=/"/g,hs=/^(?:script|style|textarea|title)$/i,Jt=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),p=Jt(1),Q=Jt(2),ko=Jt(3),be=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),ds=new WeakMap,De=Le.createTreeWalker(Le,129);function ps(s,n){if(!Qt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return rs!==void 0?rs.createHTML(n):n}var us=(s,n)=>{let e=s.length-1,t=[],r,o=n===2?"<svg>":n===3?"<math>":"",a=et;for(let i=0;i<e;i++){let l=s[i],c,h,d=-1,f=0;for(;f<l.length&&(a.lastIndex=f,h=a.exec(l),h!==null);)f=a.lastIndex,a===et?h[1]==="!--"?a=is:h[1]!==void 0?a=os:h[2]!==void 0?(hs.test(h[2])&&(r=RegExp("</"+h[2],"g")),a=Se):h[3]!==void 0&&(a=Se):a===Se?h[0]===">"?(a=r??et,d=-1):h[1]===void 0?d=-2:(d=a.lastIndex-h[2].length,c=h[1],a=h[3]===void 0?Se:h[3]==='"'?ls:as):a===ls||a===as?a=Se:a===is||a===os?a=et:(a=Se,r=void 0);let v=a===Se&&s[i+1].startsWith("/>")?" ":"";o+=a===et?l+jr:d>=0?(t.push(c),l.slice(0,d)+Gt+l.slice(d)+me+v):l+me+(d===-2?i:v)}return[ps(s,o+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},st=class s{constructor({strings:n,_$litType$:e},t){let r;this.parts=[];let o=0,a=0,i=n.length-1,l=this.parts,[c,h]=us(n,e);if(this.el=s.createElement(c,t),De.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=De.nextNode())!==null&&l.length<i;){if(r.nodeType===1){if(r.hasAttributes())for(let d of r.getAttributeNames())if(d.endsWith(Gt)){let f=h[a++],v=r.getAttribute(d).split(me),w=/([.?@])?(.*)/.exec(f);l.push({type:1,index:o,name:w[2],strings:v,ctor:w[1]==="."?wt:w[1]==="?"?$t:w[1]==="@"?kt:Be}),r.removeAttribute(d)}else d.startsWith(me)&&(l.push({type:6,index:o}),r.removeAttribute(d));if(hs.test(r.tagName)){let d=r.textContent.split(me),f=d.length-1;if(f>0){r.textContent=vt?vt.emptyScript:"";for(let v=0;v<f;v++)r.append(d[v],tt()),De.nextNode(),l.push({type:2,index:++o});r.append(d[f],tt())}}}else if(r.nodeType===8)if(r.data===Yt)l.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(me,d+1))!==-1;)l.push({type:7,index:o}),d+=me.length-1}o++}}static createElement(n,e){let t=Le.createElement("template");return t.innerHTML=n,t}};function Re(s,n,e=s,t){if(n===be)return n;let r=t!==void 0?e._$Co?.[t]:e._$Cl,o=nt(n)?void 0:n._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(s),r._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=r:e._$Cl=r),r!==void 0&&(n=Re(s,r._$AS(s,n.values),r,t)),n}var yt=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,r=(n?.creationScope??Le).importNode(e,!0);De.currentNode=r;let o=De.nextNode(),a=0,i=0,l=t[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new je(o,o.nextSibling,this,n):l.type===1?c=new l.ctor(o,l.name,l.strings,this,n):l.type===6&&(c=new _t(o,this,n)),this._$AV.push(c),l=t[++i]}a!==l?.index&&(o=De.nextNode(),a++)}return De.currentNode=Le,r}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},je=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,r){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Re(this,n,e),nt(n)?n===T||n==null||n===""?(this._$AH!==T&&this._$AR(),this._$AH=T):n!==this._$AH&&n!==be&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):cs(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==T&&nt(this._$AH)?this._$AA.nextSibling.data=n:this.T(Le.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,r=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=st.createElement(ps(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new yt(r,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(n){let e=ds.get(n.strings);return e===void 0&&ds.set(n.strings,e=new st(n)),e}k(n){Qt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,r=0;for(let o of n)r===e.length?e.push(t=new s(this.O(tt()),this.O(tt()),this,this.options)):t=e[r],t._$AI(o),r++;r<e.length&&(this._$AR(t&&t._$AB.nextSibling,r),e.length=r)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=ss(n).nextSibling;ss(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Be=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,r,o){this.type=1,this._$AH=T,this._$AN=void 0,this.element=n,this.name=e,this._$AM=r,this.options=o,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=T}_$AI(n,e=this,t,r){let o=this.strings,a=!1;if(o===void 0)n=Re(this,n,e,0),a=!nt(n)||n!==this._$AH&&n!==be,a&&(this._$AH=n);else{let i=n,l,c;for(n=o[0],l=0;l<o.length-1;l++)c=Re(this,i[t+l],e,l),c===be&&(c=this._$AH[l]),a||=!nt(c)||c!==this._$AH[l],c===T?n=T:n!==T&&(n+=(c??"")+o[l+1]),this._$AH[l]=c}a&&!r&&this.j(n)}j(n){n===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},wt=class extends Be{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===T?void 0:n}},$t=class extends Be{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==T)}},kt=class extends Be{constructor(n,e,t,r,o){super(n,e,t,r,o),this.type=5}_$AI(n,e=this){if((n=Re(this,n,e,0)??T)===be)return;let t=this._$AH,r=n===T&&t!==T||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,o=n!==T&&(t===T||r);r&&this.element.removeEventListener(this.name,this,t),o&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},_t=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){Re(this,n)}},fs={M:Gt,P:me,A:Yt,C:1,L:us,R:yt,D:cs,V:Re,I:je,H:Be,N:$t,U:kt,B:wt,F:_t},qr=Vt.litHtmlPolyfillSupport;qr?.(st,je),(Vt.litHtmlVersions??=[]).push("3.3.3");var gs=(s,n,e)=>{let t=e?.renderBefore??n,r=t._$litPart$;if(r===void 0){let o=e?.renderBefore??null;t._$litPart$=r=new je(n.insertBefore(tt(),o),o,void 0,e??{})}return r._$AI(s),r};var Zt=globalThis,ce=class extends ge{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=gs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return be}};ce._$litElement$=!0,ce.finalized=!0,Zt.litElementHydrateSupport?.({LitElement:ce});var Kr=Zt.litElementPolyfillSupport;Kr?.({LitElement:ce});(Zt.litElementVersions??=[]).push("4.2.2");var ms={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},bs=s=>(...n)=>({_$litDirective$:s,values:n}),Ct=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:Wr}=fs,xs=s=>s;var vs=()=>document.createComment(""),qe=(s,n,e)=>{let t=s._$AA.parentNode,r=n===void 0?s._$AB:n._$AA;if(e===void 0){let o=t.insertBefore(vs(),r),a=t.insertBefore(vs(),r);e=new Wr(o,a,s,s.options)}else{let o=e._$AB.nextSibling,a=e._$AM,i=a!==s;if(i){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(o!==r||i){let l=e._$AA;for(;l!==o;){let c=xs(l).nextSibling;xs(t).insertBefore(l,r),l=c}}}return e},we=(s,n,e=s)=>(s._$AI(n,e),s),Fr={},ys=(s,n=Fr)=>s._$AH=n,ws=s=>s._$AH,Tt=s=>{s._$AR(),s._$AA.remove()};var $s=(s,n,e)=>{let t=new Map;for(let r=n;r<=e;r++)t.set(s[r],r);return t},pe=bs(class extends Ct{constructor(s){if(super(s),s.type!==ms.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let r=[],o=[],a=0;for(let i of s)r[a]=t?t(i,a):a,o[a]=e(i,a),a++;return{values:o,keys:r}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let r=ws(s),{values:o,keys:a}=this.dt(n,e,t);if(!Array.isArray(r))return this.ut=a,o;let i=this.ut??=[],l=[],c,h,d=0,f=r.length-1,v=0,w=o.length-1;for(;d<=f&&v<=w;)if(r[d]===null)d++;else if(r[f]===null)f--;else if(i[d]===a[v])l[v]=we(r[d],o[v]),d++,v++;else if(i[f]===a[w])l[w]=we(r[f],o[w]),f--,w--;else if(i[d]===a[w])l[w]=we(r[d],o[w]),qe(s,l[w+1],r[d]),d++,w--;else if(i[f]===a[v])l[v]=we(r[f],o[v]),qe(s,r[d],r[f]),f--,v++;else if(c===void 0&&(c=$s(a,v,w),h=$s(i,d,f)),c.has(i[d]))if(c.has(i[f])){let u=h.get(a[v]),$=u!==void 0?r[u]:null;if($===null){let A=qe(s,r[d]);we(A,o[v]),l[v]=A}else l[v]=we($,o[v]),qe(s,r[d],$),r[u]=null;v++}else Tt(r[f]),f--;else Tt(r[d]),d++;for(;v<=w;){let u=qe(s,l[w+1]);we(u,o[v]),l[v++]=u}for(;d<=f;){let u=r[d++];u!==null&&Tt(u)}return this.ut=a,ys(s,l),be}});var At=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function V(s){return At[(s%At.length+At.length)%At.length]}var ks="#23272E",_s="35,39,46";var Vr=3,Dt=36,Xt=12,Gr=8,en=60,tn=10,Pt=30,nn=10,Yr=150,Qr=200,St=1.4;function rn(s,n){let e=Math.max(Yr,Qr/St);return Math.ceil(en+Math.max(0,s-1)*tn+Pt+Math.max(0,n-1)*nn+e*(s+St*n))}function Ie(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function $e(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function de(s){return new Map(Ie(s).map((n,e)=>[n,V(e)]))}function le(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function ke(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function on(s,n){return n==="none"?"Not needed":$e(s).includes(n)?ke(s,n):n}function Jr(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function Mt(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function Et(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(Mt(n,t.from)),e.push(Mt(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(Mt(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Zr(s){let n=s.map(a=>({...a,col:0,cols:1})).sort((a,i)=>a.s-i.s||i.en-a.en),e=[],t=[],r=-1/0,o=()=>{for(let a of e)a.cols=t.length;e=[],t=[]};for(let a of n){a.s>=r&&(o(),r=-1/0);let i=t.findIndex(l=>l<=a.s);i<0?(i=t.length,t.push(a.en)):t[i]=a.en,a.col=i,e.push(a),r=Math.max(r,a.en)}return o(),n}function Xr(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],r=s[e+1];if(n<=r.t)return r.t===t.t?t.y:Math.round(t.y+(n-t.t)/(r.t-t.t)*(r.y-t.y))}return s[s.length-1].y}function ei(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],r=s[e+1];if(n<=r.y)return r.y===t.y?t.t:t.t+(n-t.y)/(r.y-t.y)*(r.t-t.t)}return s[s.length-1].t}function As(s,n){return Xr(s.anchors,n)}function Es(s,n){return ei(s.anchors,n)}function ti(s,n){let e=Ie(s),t=$e(s),r=Math.max(n,rn(e.length,t.length)),a=(r-en-Math.max(0,e.length-1)*tn-Pt-Math.max(0,t.length-1)*nn)/(e.length+St*t.length||1),i=Math.floor(a),l=Math.floor(a*St),c=new Map;for(let w of s.days)for(let u of w.events){let $=c.get(u.kid)??[];$.some(A=>A.event_id===u.event_id&&A.calendar_id===u.calendar_id)||$.push(u),c.set(u.kid,$)}let h=de(s),d=[],f=en;e.forEach((w,u)=>{let $=c.get(w)??[],A=s.days.some(C=>C.events.some(H=>H.kid===w&&(H.sides.includes("drop")&&H.drop===""||H.sides.includes("pick")&&H.pick==="")));d.push({id:w,kind:"kid",x:f,w:i,name:le(s,w),dot:h.get(w).color,rgb:h.get(w).rgb,sub:`${A?"Needs a ride · ":""}${$.length} this week`,subWarn:A}),f+=i+(u<e.length-1?tn:0)});let v=f+Pt/2;return f+=Pt,t.forEach((w,u)=>{let $=0,A=0;for(let C of s.days){let H=C.drivers[w];H&&($+=H.outings.length,A+=H.drive??0)}d.push({id:w,kind:"driver",x:f,w:l,name:ke(s,w),dot:ks,rgb:_s,sub:`${$} ${$===1?"trip":"trips"} this week · ${Je(A)} driving`,subWarn:!1}),f+=l+(u<t.length-1?nn:0)}),{columns:d,sepX:v,width:r}}function ni(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let r=e.slice(n.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(r);if(!o)return e;let a=r.slice(o[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Cs(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${B(s.start)}`:e||!n?`${s.title} until ${B(s.end)}`:`${s.title} ${B(s.start)}–${B(s.end)}`}function an(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length}function ln(s,n){let e=he(n,s);return e===0?"Today":e===1?"Tomorrow":""}function re(s,n=0){return s==null||!Number.isFinite(s)?n:s}function sn(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),r=1,o=0;for(let a of s.split(/\s+/).filter(Boolean)){let i=a.length;for(o===0?o=i:o+1+i<=t?o+=1+i:(r++,o=i);o>t;)r++,o-=t}return r}var Ps=25,Ms=15,dn=3;function Ts(s){return Math.max(0,Math.min(dn,Math.floor((s-Ps)/Ms)))}function si(s,n){let e=Math.min(dn,sn(s,n-19,6.6));return Ps+e*Ms+2}function ri(s,n){let e=n-23,t=`${B(s.start)}–${B(s.end)}`+(s.arrive_by!=null?` · arrive ${B(s.arrive_by)}`:""),r=33+sn(t,e,6.6)*16;for(let o of[s.lines.drop,s.lines.pick])o&&(r+=2+sn(o.text,e,7)*16);return r+4}function Ss(s,n,e,t){let r=n==="compact",{columns:o,sepX:a,width:i}=ti(s,e),l=new Map(o.map(C=>[C.id,C])),c=Ie(s),h=$e(s),d=[...c,...h],f=de(s),v=Jr(s),w=C=>le(s,C),u=C=>ke(s,C),$={mode:n,width:i,height:0,columns:o,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},A=0;return s.days.forEach((C,H)=>{let X=H*1440,N=new Map(C.events.map(_=>[_.id,_])),G=_=>_&&N.has(_)?{day:C.date,event:_}:null,m=an(C),y=C.events.length,g=ln(C.date,t.date);$.dayHeads.push({date:C.date,y:A,label:ye(C.date),tag:g,sub:(y?`${y} ${y===1?"activity":"activities"}`:"Nothing scheduled")+(m?` · ${m} to sort out`:""),warn:m>0}),$.anchors.push({t:X,y:A});let b=A+Dt+Xt,x=h.flatMap(_=>C.drivers[_]?.outings??[]);if(!y&&!x.length){$.empties.push({key:C.date,y:b,text:"Nothing planned"}),A=b+40,$.anchors.push({t:X+1439,y:A});return}let k=(_,U,I,R,O,q,D)=>{let ee=f.get(_.kid)??V(0),te=_.lines;return{key:`${C.date}|card|${_.id}`,x:U,y:I,w:R,h:O,target:{day:C.date,event:_.id},event:_,color:ee,kidName:w(_.kid),clash:q,stayed:_.stay&&h.includes(_.drop),skipped:_.attending===!1,title:ni(_.title,w(_.kid)),time:`${B(_.start)}–${B(_.end)}`+(_.arrive_by!=null?` · arrive ${B(_.arrive_by)}`:""),drop:te.drop,pick:te.pick,showDrop:!!te.drop&&(D||O>=56),showPick:!!te.pick&&(D||O>=74),wrap:D,aria:`${w(_.kid)}, ${_.title} ${B(_.start)} to ${B(_.end)}. `+(_.attending===!1&&!te.drop?"Not attending. ":"")+[te.drop,te.pick].filter(fe=>!!fe).map(fe=>fe.text).join(". ")}},E=_=>{let U=C.rides[_];return U?(C.drivers[U.driver]?.segments??[]).filter(R=>R.type!=="home"&&R.kids.includes(U.kid)&&re(R.start)>=re(U.start)&&re(R.end)<=re(U.end)):[]},S=_=>{let U=C.rides[_];if(!U)return null;let I=U.serves.find(R=>N.get(R)?.kid===U.kid);return G(I??U.serves[0])},z=new Map;for(let _ of C.issues)_.level!=="problem"||!_.event||(_.kind==="late"&&z.set(_.event,`${Math.round(re(_.minutes))} min late`),_.kind==="waiting"&&z.set(`${_.event}|pick`,`Waits ${Math.round(re(_.minutes))} min`));if(!r){let _=1/0,U=-1/0;for(let D of C.events)_=Math.min(_,D.start-20,D.arrive_by!=null?D.arrive_by-10:1/0),U=Math.max(U,D.end+20);for(let D of x)D.start!=null&&(_=Math.min(_,D.start)),D.end!=null&&(U=Math.max(U,D.end));C.date===t.date&&Number.isFinite(_)&&t.minutes>_-60&&t.minutes<U&&(_=Math.min(_,t.minutes-15));let I=Number.isFinite(_)?Math.floor((_-5)/30)*30:900,R=Number.isFinite(U)?Math.ceil((U+5)/30)*30:960,O=D=>Math.round(b+(Math.max(I,Math.min(R,D))-I)*Vr);$.anchors.push({t:X+I,y:O(I)},{t:X+R,y:O(R)});for(let D of c){let ee=l.get(D),te=f.get(D),fe=(C.kids[D]?.items??[]).filter(W=>W.start!=null&&W.end!=null).map(W=>({item:W,s:re(W.start),en:re(W.end)}));for(let W of Zr(fe)){let M=ee.w/W.cols,J=Math.round(ee.x+W.col*M),Y=Math.round(M-(W.cols>1?4:0)),ne=O(W.s),ve=W.item;if(ve.type==="act"){let oe=N.get(ve.event??"");if(!oe)continue;let Pn=Math.max(30,O(W.en)-ne);if($.cards.push(k(oe,J,ne,Y,Pn,ve.clash,!1)),oe.arrive_by!=null&&oe.start-oe.arrive_by>=5){let Dn=O(oe.arrive_by);$.preps.push({key:`${C.date}|prep|${oe.id}`,x:J,y:Dn,w:Y,h:ne-Dn+6,color:te,label:`Arrive by ${B(oe.arrive_by)}`})}let Mn=z.get(oe.id);Mn&&$.marks.push({key:`${C.date}|late|${oe.id}`,x:J+Y-4,y:ne+4,text:Mn,right:!0});let Sn=z.get(`${oe.id}|pick`);Sn&&$.marks.push({key:`${C.date}|wait|${oe.id}`,x:J+4,y:ne+Pn+2,text:Sn,right:!1});continue}let se=C.rides[ve.ride??-1];if(!se)continue;let Ae=Math.max(22,O(W.en)-ne),Ve=Et(E(se.index),v),Z=u(se.driver);$.rides.push({key:`${C.date}|ride|${se.index}`,x:J,y:ne,w:Y,h:Ae,target:S(se.index),l1:`${se.own?"In":"Along in"} ${Z}’s car`,l2:Ve.join(" → "),show2:Ts(Ae)>0,lines2:Ts(Ae),dashed:!se.own,clash:ve.clash,aria:`${w(D)} ${se.own?"in":"riding along in"} ${Z}’s car, ${B(re(se.start))} to ${B(re(se.end))}: ${Ve.join(" to ")}`});let Ee=l.get(se.driver);Ee&&$.bands.push({key:`${C.date}|band|${se.index}`,x:J+Y,y:ne,w:Math.max(0,Ee.x+8-(J+Y)),h:Ae,color:te})}}for(let D of h){let ee=l.get(D),te=C.drivers[D];if(!te)continue;let fe=[],W=null;for(let M of te.segments)if(!(M.start==null||M.end==null)){if(M.type==="home"){W=null;continue}if(M.type==="stay"){W=null,fe.push({type:"stay",g:M,s:M.start,en:M.end});continue}W&&W.en===M.start?(W.en=M.end,W.legs.push(M)):(W={type:"trip",s:M.start,en:M.end,legs:[M]},fe.push(W))}for(let M of fe){let J=O(M.s),Y=Math.max(24,O(M.en)-J);if(M.type==="stay"){let Z=N.get(M.g.event??M.g.serves??""),Ee=Z?f.get(Z.kid)??V(0):V(0),oe=M.g.kids.map(w);$.stays.push({key:`${C.date}|stay|${D}|${M.s}`,x:ee.x+8,y:J,w:ee.w-16,h:Y,target:G(Z?.id),color:Ee,l1:Z?`At ${Z.title} with ${w(Z.kid)}`:"Staying",l2:`until ${B(M.en)}`+(oe.length?` · ${oe.join(" and ")} too`:"")});continue}let ne=M.legs[0],ve=M.legs[M.legs.length-1],se=[];for(let Z of M.legs)for(let Ee of Z.kids)se.includes(Ee)||se.push(Ee);let Ae=ve.type==="drive"&&ve.to==="home",Ve=Et(M.legs,v);$.trips.push({key:`${C.date}|trip|${D}|${M.s}`,x:ee.x+8,y:J,w:ee.w-16,h:Y,target:G(M.legs.find(Z=>Z.serves)?.serves),l1:ne.type==="drive"&&ne.from==="home"?`Leave ${B(M.s)}`:`From ${Mt(v,ne.from??ne.place)} ${B(M.s)}`,l2:Ve.join(" → "),show2:Y>=36,l3:Ae?`Home ${B(M.en)}`:"",show3:Ae&&Y>=62,stops:null,kids:se.map(Z=>(f.get(Z)??V(0)).color),bad:M.legs.some(Z=>Z.overlaps_busy),aria:`${u(D)} drives ${Ve.join(" to ")}, ${B(M.s)} to ${B(M.en)}`})}for(let M of te.segments)if(!(!M.overlaps_busy||M.start==null||M.end==null))for(let J of te.busy){let Y=Math.max(M.start,J.start),ne=Math.min(M.end,J.end);ne<=Y||$.overlaps.push({key:`${C.date}|overlap|${D}|${Y}`,x:ee.x+6,y:O(Y)-2,w:ee.w-12,h:Math.max(8,O(ne)-O(Y)+4)})}for(let M of te.busy){if(M.end<=I||M.start>=R)continue;let J=O(M.start),Y=O(M.end);$.busy.push({key:`${C.date}|busy|${D}|${M.start}`,x:ee.x+1,y:J,w:ee.w-2,h:Y-J,labelY:8,label:Cs(M,!1)})}}let q=-1/0;for(let D=I;D<=R;D+=30)$.grid.push({key:`${C.date}|grid|${D}`,y:O(D),strong:D%60===0}),D%60===0&&O(D)-q>=22&&($.hours.push({key:`${C.date}|hour|${D}`,y:O(D)-8,label:Gn(D)}),q=O(D));C.date===t.date&&t.minutes>I&&t.minutes<R&&($.now={y:O(t.minutes),label:`Now ${B(t.minutes)}`}),A=O(R)+Xt;return}let j=[];for(let _ of c){let U=l.get(_);for(let I of C.kids[_]?.items??[])if(I.start!=null){if(I.type==="act"){let R=N.get(I.event??"");if(!R)continue;j.push({col:_,s:I.start,h:ri(R,U.w),kind:"act",item:I})}else if(!C.rides[I.ride??-1]?.own){let R=C.rides[I.ride??-1],O=R?Et(E(R.index),v).join(" → "):"";j.push({col:_,s:I.start,h:si(O,U.w),kind:"along",item:I})}}}for(let _ of h){let U=C.drivers[_];if(U){for(let I of U.busy)j.push({col:_,s:I.start,h:32,kind:"busy",busy:I});for(let I of U.outings)I.start!=null&&j.push({col:_,s:I.start,h:30+I.lines.length*16+(I.warn?16:0),kind:"out",out:I})}}j.sort((_,U)=>_.s-U.s||d.indexOf(_.col)-d.indexOf(U.col));let P=new Map,L=b;j.forEach((_,U)=>{let I=P.get(_.col),R=Math.max(I!=null?I+Gr:b,L);P.set(_.col,R+_.h),L=R,$.anchors.push({t:X+_.s,y:R});let O=l.get(_.col);if(_.kind==="busy")$.busy.push({key:`${C.date}|busy|${_.col}|${U}`,x:O.x+1,y:R,w:O.w-2,h:_.h,labelY:8,label:Cs(_.busy,!0)});else if(_.kind==="out"){let q=_.out;$.trips.push({key:`${C.date}|trip|${_.col}|${U}`,x:O.x+8,y:R,w:O.w-16,h:_.h,target:G(q.target),l1:q.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...q.lines.map(D=>({text:D,warn:!1})),...q.warn?[{text:q.warn,warn:!0}]:[]],kids:q.kids.map(D=>(f.get(D)??V(0)).color),bad:!!q.warn,aria:`${u(_.col)}: ${q.lead}. ${q.lines.join(". ")}${q.warn?`. ${q.warn}`:""}`})}else if(_.kind==="act"){let q=N.get(_.item.event??"");$.cards.push(k(q,O.x,R,O.w,_.h,_.item.clash,!0))}else{let q=C.rides[_.item.ride??-1],D=Et(E(q.index),v),ee=u(q.driver);$.rides.push({key:`${C.date}|ride|${q.index}`,x:O.x,y:R,w:O.w,h:_.h,target:S(q.index),l1:`Along with ${ee} ${B(re(q.start))}`,l2:D.join(" → "),show2:!0,lines2:dn,dashed:!0,clash:_.item.clash,aria:`${w(_.col)} riding along with ${ee}, ${B(re(q.start))} to ${B(re(q.end))}: ${D.join(" to ")}`})}});let K=b;for(let _ of P.values())K=Math.max(K,_);A=K+Xt+6,$.anchors.push({t:X+1439,y:A})}),$.height=A,$}var ii=["","¼","½","¾"];function Ne(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return Je(t);let r=Math.round(t*4),o=Math.floor(r/4),a=ii[r%4];return`${o||!a?o:""}${a} min`})}function Ds(s){let n=e=>e?{...e,text:Ne(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,r])=>[t,{...r,outings:r.outings.map(o=>({...o,lines:o.lines.map(Ne),warn:o.warn==null?o.warn:Ne(o.warn)}))}])),issues:e.issues.map(t=>({...t,title:Ne(t.title),body:Ne(t.body),note:t.note==null?t.note:Ne(t.note),...t.suggestions?{suggestions:t.suggestions.map(r=>({...r,note:Ne(r.note)}))}:{}}))}))}}var oi=2,ai=48;function Ls(s,n,e=ai){let t=[],r=0,o=0,a=0,i=0,l=n.minutes+e*60;for(let c of s.days){let h=he(n.date,c.date),d=h===0?"":`${ae(c.date)} · `,f=new Map(c.events.map(u=>[u.id,u])),v=u=>u&&f.has(u)?{day:c.date,event:u}:null,w=(u,$)=>h*1440+(u??f.get($??"")?.start??0)<l;for(let u of c.issues)if(u.level==="problem"){if(!w(u.at,u.event)){a++,u.kind==="unassigned"&&i++;continue}r++,u.kind==="unassigned"&&o++,t.push({key:`${c.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:d+u.title,body:u.body,target:v(u.event),suggestions:(u.suggestions??[]).map($=>({id:$.id,label:$.label,note:$.note}))})}if(c.clashes.forEach((u,$)=>{if(!w(u.a.start,u.a.event)){a++;return}r++;let A=f.get(u.a.event??""),C=le(s,u.kid),H=(N,G)=>{let m=v(G);return m?{text:N,target:m}:N},X=[];if(u.b.type==="act"){let N=f.get(u.b.event??"");A&&N&&(X=[H(A.title,A.id),` ${B(A.start)}–${B(A.end)} and `,H(N.title,N.id),` ${B(N.start)}–${B(N.end)} overlap.`])}else{let N=c.rides[u.b.ride??-1];A&&N&&(X=[`${C} is in `,H(`${ke(s,N.driver)}’s car`,N.serves[0]),` ${B(re(u.b.start))}–${B(re(u.b.end))}, during `,H(A.title,A.id),"."])}t.push({key:`${c.date}|clash|${$}`,tone:"problem",title:`${d}${C} is double-booked`,body:X.map(N=>typeof N=="string"?N:N.text).join(""),parts:X,target:null,suggestions:[]})}),h>=0&&h<oi)for(let u of c.issues)u.level!=="heads_up"||!w(u.at,u.event)||t.push({key:`${c.date}|${u.key}`,tone:"heads_up",title:d+u.title,body:u.body,target:v(u.event),suggestions:[]});for(let u of c.events)!u.problems.length||!w(u.start)||t.push({key:`${c.date}|notes|${u.id}`,tone:"heads_up",title:`${d}Check the notes on ${le(s,u.kid)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:v(u.id),suggestions:[]})}return{items:t,problems:r,unassigned:o,later:a,laterUnassigned:i}}function Rs(s,n){let e=de(s),t=null,r=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of s.days){let a=he(n.date,o.date);if(!(a<0))for(let i of $e(s))for(let l of o.drivers[i]?.outings??[]){if(l.start==null)continue;let c=a*1440+l.start;if(a*1440+re(l.end,l.start)<=n.minutes)continue;let d=c-n.minutes,f={driver:i,name:ke(s,i),date:o.date,ahead:a,start:l.start,inMinutes:d,ongoing:d<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(v=>e.get(v)??V(0)),warn:l.warn,target:l.target&&o.events.some(v=>v.id===l.target)?{day:o.date,event:l.target}:null};(!t||r(f)<r(t)||r(f)===r(t)&&f.inMinutes<t.inMinutes)&&(t=f)}}return t}function Ke(s){return s.state==="done"||s.state==="late"}var li=780;function di(s,n,e){return s.state==="open"&&!!s.for_day&&s.due===n&&e<li}function Bs(s,n){return s.chores.map(e=>di(e,s.today,n)?{...e,state:"upcoming",shows_from:s.today}:e)}function Ns(s){return s.state==="open"||s.state==="overdue"}function pn(s,n,e){if(Ke(s)){let t=s.done_at?ci(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${cn(s.due,n)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${cn(s.for_day,n)}`;let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let r=he(n,s.due);return`By ${r===1?"tomorrow":r<7?ae(s.due):hn(s.due)}`}if(s.for_day&&s.due===n)return`Tonight · for ${cn(s.for_day,n)}`;if(s.due&&s.due>n){let t=he(n,s.due);return t===1?"By tomorrow":`By ${t<7?ae(s.due):hn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function cn(s,n){let e=he(n,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ae(s):hn(s)}function hn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ci(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let r=e;try{new Intl.DateTimeFormat("en-US",{timeZone:r})}catch{r=void 0}let o=t.toLocaleDateString("en-CA",{timeZone:r}),a=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:r});return o===n?a:`${ae(o)} ${a}`}function Is(s,n,e=1440){let t=Bs(s,e).sort((r,o)=>r.order-o.order);return s.kids.map((r,o)=>{let a=t.filter(h=>h.kid===r.id),i=new Map;for(let h of a){if(h.state!=="upcoming")continue;let d=h.shows_from??h.due??s.today;i.set(d,[...i.get(d)??[],h])}let l=a.filter(h=>h.state==="overdue"),c=a.filter(h=>h.state==="open");return{kid:r.id,name:r.name,color:n?.get(r.id)??V(o),overdue:l,now:c,done:a.filter(Ke),later:[...i.entries()].sort(([h],[d])=>h.localeCompare(d)).map(([h,d])=>({date:h,chores:d})),left:l.length+c.length}})}function Os(s,n=1440){return Bs(s,n).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,t)=>e.state===t.state?e.order-t.order:e.state==="overdue"?-1:1)}function un(s){return!s.chores.length&&!s.templates.length}var Oe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function fn(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[r,o]=t.split("-").map(a=>Oe.indexOf(a.trim()));if(r===void 0||r<0||o!==void 0&&o<0)return null;if(o===void 0)e.add(r);else for(let a=0;a<=(o-r+7)%7;a++)e.add((r+a)%7)}return e}function Lt(s){let n=[...new Set(s)].sort((t,r)=>t-r);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let r=e.at(-1);r&&r.at(-1)===t-1?r.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${Oe[t[0]]}-${Oe[t.at(-1)]}`]:t.map(r=>Oe[r])).join(", ")}var ze="none";function Rt(s){return s==="daily"||s==="school"?"":"Any"}function zs(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Us(s){return{template:s.id,repeats:s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:s.days??Rt(s.repeats),every:s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function gn(s){return s.title.trim()?s.who.length?s.days===ze?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Hs(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function mn(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function bn(s,n,e=1,t=!1,r=!1){if(s==="school"){let h=n.trim().replace(/-/g,"–"),d=r?h?`${h} Bring lunch days`:"Bring lunch days":h?`${h} school days`:"Every school day";return t?`${d}, the night before`:d}let o={daily:"day",weekly:"week",monthly:"month"}[s],a=e>1?`every ${e} ${o}s`:`each ${o}`,i=n.trim();if(s==="daily"){let h=i.replace(/-/g,"–");return e>1?h?`${h}, every ${e} days`:`Every ${e} days`:h||"Every day"}if(!i||i.toLowerCase()==="any")return`Sometime ${a}`;if(s==="weekly")return`${i.replace(/-/g,"–")} ${a}`;let c=`${i.split(",").map(h=>{let d=h.trim();return d.toLowerCase()==="last"?"the last day":/^\d+$/.test(d)?`the ${mn(Number(d))}`:`the ${d}`}).join(" and ")} ${a}`;return c[0].toUpperCase()+c.slice(1)}function xn(s,n,e=!1){let t=s.map(o=>n.find(a=>a.id===o)?.name??o);if(!t.length)return"Nobody yet";let r=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${r} take turns`:r}function vn(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}function Bt(s,n){return`${s}|${n}`}function We(s,n){let[e,t,r]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1,r+n)).toISOString().slice(0,10)}function Nt(s){let[n,e,t]=s.split("-").map(Number);return(new Date(Date.UTC(n,e-1,t)).getUTCDay()+6)%7}function js(s,n){return s.days_off.find(e=>e.first<=n&&n<=e.last)??null}function hi(s,n){return Nt(n)<5&&!js(s,n)}function It(s,n,e=new Map){if(!hi(s,n))return null;let t=Bt(s.id,n);if(e.has(t)){let o=e.get(t);return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}let r=s.picks[n];return r?{lunch:r,picked:!0}:{lunch:s.default,picked:!1}}function ue(s){return s.slice(0,7)}function Ot(s){let[n,e]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function yn(s,n=1){let[e,t]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1+n,1)).toISOString().slice(0,7)}function qs(s){let n=[];for(let e=ue(s.first);e<=ue(s.last);e=yn(e))n.push(e);return n}function Ks(s,n,e,t=new Map){let r=`${e}-01`,o=We(r,-Nt(r)),a=[];for(;ue(o)<=e;){let i=[];for(let l=0;l<5;l++){let c=We(o,l),h=ue(c)!==e,d=h?null:js(n,c),f=h?null:It(n,c,t);i.push({date:c,day:Number(c.slice(8)),outside:h,off:d?d.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,past:c<s.today,today:c===s.today})}i.some(l=>!l.outside)&&a.push(i),o=We(o,7)}return a}function Ws(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Fs(s){let n=0,e=0;for(let t of s.flat())t.outside||t.past||!t.lunch||(t.lunch==="bring"?n++:e++);return{bring:n,buy:e}}function Vs(s,n,e,t=new Map){let r=e<780?0:1;for(let o=r;o<8;o++){let a=We(n,o),i=It(s,a,t);if(!i)continue;let l=he(n,a);return{lunch:i.lunch,when:l===0?"today":l===1?"tomorrow":ae(a)}}return null}var pi={timeline:"timeline",full:"timeline",compact:"compact"};function rt(s){let n=new URLSearchParams(s),e={},t=pi[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let r=(n.get("page")??"").trim().toLowerCase();return(r==="rides"||r==="chores"||r==="lunch")&&(e.page=r),e}var ui=["auth_callback","code","state"];function wn(s){let n=new URLSearchParams(s);for(let t of ui)n.delete(t);let e=n.toString();return e?`?${e}`:""}var Gs=Me`
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
    flex: none;
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
    height: 64px;
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
`;var Js="mydashlight.rides.mode",fi=1100,gi=440,mi=700,bi=3*6e4,xi=1200;function vi(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var $n=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,yi=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,wi=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],Ys=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,Qs=Q`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,it={bring:"Bring",buy:"Buy"};function $i(s,n){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return n<=1?`Every ${e}`:n===2?`Every other ${e}`:`Every ${n} ${e}s${s==="monthly"&&n===3?" (quarterly)":""}`}function xe(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function kn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function ki(s,n){return ln(s,n)||ye(s).split(",")[0]}function _i(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function Ci(){try{return localStorage.getItem(Js)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Ti(s){try{localStorage.setItem(Js,s)}catch{}}function zt(s){return s.days.every(n=>!n.events.length)}var ot=class extends ce{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=rt(location.search).view;this.urlPage=rt(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let r=e.clientX-t.x,o=e.clientY-t.y;if(!t.moved){if(Math.abs(r)+Math.abs(o)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-o,t.el.scrollLeft=t.left-r};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},bi))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Ci(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let t=new Map(this.lunchDraft);for(let[r,o]of this.lunchDraft){let[a,i]=r.split("|"),l=e.kids.find(c=>c.id===a);(!l||(l.picks[i]??null)===o||!It(l,i))&&t.delete(r)}this.lunchDraft=t}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let r of e.chores)t.has(r.id)&&Ke(r)===t.get(r.id)&&t.delete(r.id);for(let r of t.keys())e.chores.some(o=>o.id===r)||t.delete(r);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=Ds(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<fi)return!1;let e=this.plan;return!e||this.width-gi>=rn(Ie(e).length,$e(e).length)}today(){return Qe(this.plan?.time_zone??vi())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),r=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||r!==this.boardKey)&&(this.board=Ss(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=r),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let r=this.scroller;if(!r||!this.board)return;let o=this.board.dayHeads.find(a=>a.date===t)?.y??0;r.scrollTop=Math.max(o,As(this.board,e)-Dt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let r=this.today();if(e===r.date){this.scrollToNow();return}let o=this.dayIndexOf(e),a=t.days[o];if(!a)return;let i=1/0;if(this.mode==="timeline"){for(let l of a.events)i=Math.min(i,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let c of l.outings)c.start!=null&&(i=Math.min(i,c.start))}this.scrollToTime(o*1440+(Number.isFinite(i)?Math.max(0,i-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,r=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=t+1&&(r=c);let o=this.renderRoot,a=o.querySelector(".pinned .label"),i=o.querySelector(".pinned .tag"),l=o.querySelector(".pinned .sub");a&&a.textContent!==r.label&&(a.textContent=r.label),i&&(i.textContent!==r.tag&&(i.textContent=r.tag),i.hidden=!r.tag),l&&l.textContent!==r.sub&&(l.textContent=r.sub),l?.classList.toggle("warn",r.warn);for(let c of o.querySelectorAll(".day-tile"))c.classList.toggle("in-view",c.dataset.date===r.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let r=!this.choreDone(e),o=new Map(this.choreDraft);o.set(e.id,r),this.choreDraft=o;try{await this.backend.setChoreDone(e.id,r,t&&t!==e.kid?t:void 0)}catch(a){let i=new Map(this.choreDraft);i.delete(e.id),this.choreDraft=i;let l=a instanceof F?a:new F("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??Ke(e)}async saveLunch(e,t,r){if(!this.backend||!t.length)return;let o=new Map(this.lunchDraft);for(let a of t)o.set(Bt(e,a),r);this.lunchDraft=o;try{await this.backend.setLunch(e,t,r)}catch(a){let i=new Map(this.lunchDraft);for(let c of t)i.delete(Bt(e,c));this.lunchDraft=i;let l=a instanceof F?a:new F("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?Us(e):zs(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||gn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Hs(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let r=t instanceof F?t:new F("error",String(t));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let r=t instanceof F?t:new F("error",String(t));this.showToast(r.code==="preview"?r.message:`Couldn’t remove that. ${r.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?Es(this.board,t.scrollTop+Dt+4):null,this.mode=e,this.urlView||Ti(e)}findEvent(e){let t=this.plan?.days.find(o=>o.date===e.day),r=t?.events.find(o=>o.id===e.event);return t&&r?{day:t,event:r}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),r=this.dayIndexOf(e.day);!t||r<0||this.scrollToTime(r*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,r){if(!this.pending){this.pending={key:e,value:t};try{await r()}catch(o){let a=o instanceof F?o:new F("error",String(o));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,t,r){if(!this.backend)return;let o=this.backend;this.save(`${t}`,r,()=>o.setRide(e.id,t,r,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let r=this.backend;this.save("attending",t,()=>r.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t){if(!this.backend)return;let r=this.backend,o=e.along.includes(t)?e.along.filter(a=>a!==t):[...e.along,t];this.save("along",o,()=>r.setTakeAlong(e.id,o,this.scope))}nudgeArrive(e,t){let r=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;t<0?o=(r??e.start)-5:o=r==null||r+5>=e.start?null:r+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),xi)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let r=this.findEvent(t);if(!r||r.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,a=r.event.id,i=this.scope;this.save("arrive",e,()=>o.setArriveBy(a,e,i)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),r=e?Ls(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},o=this.wide,a=this.chores?Os(this.chores,this.today().minutes).filter(d=>!this.choreDone(d)):[],i=this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",c=p`<aside class="panel" aria-label=${l}>
      ${i??(this.sel&&e?this.renderEditor(e):this.renderAttention(r,a))}
    </aside>`,h=this.page==="rides";return p`
      <div class="app ${o?"wide":this.width<mi?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,r,a.length)} ${h&&e?this.renderWeek(e):T}
          ${h?this.renderBanner(e):T}
          <main>
            ${h?p`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?zt(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!o&&(this.sheet||this.sel||this.choreEdit||this.whoFor)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${c}`:T}
          </main>
        </div>
        ${o?c:T}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:T}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,r){let o=t.problems+r;this.tick;let a=this.today(),i="";if(e){let f=e.time_zone,v=new Date(e.updated);this.error?i=p`<span class="bad">Can’t reach Home Assistant · showing the plan from ${ft(v,new Date,f)}</span>`:e.status&&!e.status.ok?i=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${ft(v,new Date,f)}</span>`:this.backend?.live||(i=`Updated ${ft(v,new Date,f)}`)}let l=(f,v,w,u)=>p`
      <button type="button" class="seg-btn" title=${u} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${w}<span class="seg-label">${v}</span>
      </button>
    `,c=(f,v,w)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${w}<span class="seg-label">${v}</span>
      </button>
    `,h=Ye(a.minutes),d=!!e&&zt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Q`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:T}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ye(a.date)}, ${h}`}>
            <span class="hm">${h.slice(0,-3)}</span><span class="ampm">${h.slice(-2)}</span>
          </h1>
          <p class="today-line">${ye(a.date)}</p>
          ${i?p`<p class="status">${i}</p>`:T}
        </div>
        ${e&&!d?this.renderNext(e,Rs(e,a),t):T}
        <div class="controls">
          ${this.wide||d&&!r?T:p`<button type="button" class="attn-btn ${o?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${o}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?T:p`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",Q`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",Q`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${c("rides","Rides",Q`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${c("chores","Chores",Q`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?T:c("lunch","Lunch",Q`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,r){if(!t){let c=this.today().date,h=r.unassigned,d=r.laterUnassigned;if(h){let v=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${h} ${h===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?p`<div class="next idle needs">${v}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${v}</button>`}if(d)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${d} ${d===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let f=e.days.some(v=>v.date>=c&&v.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let o;t.ongoing?o="On the road now":t.ahead===0?o=t.inMinutes<180?`Next trip · in ${Je(t.inMinutes)}`:"Next trip · later today":t.ahead===1?o="Next trip · tomorrow":o=`Next trip · ${ae(t.date)}`;let a=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,i=p`
      <span class="next-eyebrow">${o}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${xe(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(c=>p`<span class="kid-dot" style="background:${c.color}"></span>`)}</span>
      </span>
      ${t.warn?p`<span class="next-stop warn">${t.warn}</span>`:t.stop?p`<span class="next-stop">${t.stop}</span>`:T}
    `,l=`next ${t.ongoing?"ongoing":a?"soon":""}`;return t.target?p`<button type="button" class=${l} @click=${()=>this.open(t.target)}>${i}</button>`:p`<div class=${l}>${i}</div>`}renderWeek(e){let t=this.today().date,r=de(e);return p`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let a=an(o),i=o.events.length,l=o.events.slice(0,6).map(h=>r.get(h.kid)?.color??V(0).color),c=`${ye(o.date)}: ${i?`${i} ${i===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return p`<button
          type="button"
          class="day-tile ${o.date===t?"today":""}"
          data-date=${o.date}
          aria-label=${c}
          @click=${()=>this.goToDay(o.date)}
        >
          <span class="dt-wd">${o.date===t?"Today":ae(o.date)}</span>
          <span class="dt-num">${Number(o.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(h=>p`<span class="dt-dot" style="background:${h}"></span>`):p`<span class="dt-free">free</span>`}
            ${i>6?p`<span class="dt-more">+${i-6}</span>`:T}
          </span>
          ${a?p`<span class="dt-badge" aria-hidden="true">${a}</span>`:T}
        </button>`})}
    </nav>`}renderQuiet(e){let t=Ie(e),r=$e(e),o=de(e),a=t.map(i=>le(e,i));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((i,l)=>Q`<circle cx=${50+l*30} cy="80" r="11" fill=${o.get(i).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${_i(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(i=>{let l=o.get(i);return p`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${xe(le(e,i))}</span>
            <span class="qw-name">${le(e,i)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${r.map(i=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${xe(ke(e,i))}</span>
            <span class="qw-name">${ke(e,i)}</span>
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
    </div>`:T}renderEmpty(){return this.error?p`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:p`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let t=this.sel,r=i=>!!i&&!!t&&i.day===t.day&&i.event===t.event,o=e.dayHeads[0],a=e.width;return p`
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
          ${e.columns.map(i=>p`<div class="col-head ${i.kind}" style="left:${i.x}px;width:${i.w}px;--c:${i.dot};--rgb:${i.rgb}">
              <span class="avatar ${i.kind}" aria-hidden="true">${xe(i.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${i.name}</span>${i.kind==="kid"?this.renderLunchChip(i.id,!0):T}</span>
                <span class="sub ${i.subWarn?"warn":""}">${i.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${a}px">
          <span class="label">${o?.label??""}</span><span class="tag" ?hidden=${!o?.tag}>${o?.tag??""}</span
          ><span class="sub ${o?.warn?"warn":""}">${o?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${a}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(i=>p`<div
                class="col-bg ${i.kind}"
                style="left:${i.x}px;width:${i.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${i.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(i=>p`<div class="day-head" style="top:${i.y}px;width:${a}px">
              <span class="label">${i.label}</span>${i.tag?p`<span class="tag">${i.tag}</span>`:T}<span
                class="sub ${i.warn?"warn":""}"
                >${i.sub}</span
              >
            </div>`)}
          ${e.empties.map(i=>p`<span class="empty" style="top:${i.y}px">${i.text}</span>`)}
          ${e.grid.map(i=>p`<div class="grid ${i.strong?"strong":""}" style="top:${i.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(i=>p`<span class="hour" style="top:${i.y}px">${i.label}</span>`)}
          ${pe(e.bands,i=>i.key,i=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;background:rgba(${i.color.rgb},0.10);border-color:rgba(${i.color.rgb},0.45)"
              ></div>`)}
          ${pe(e.busy,i=>i.key,i=>p`<div class="busy" style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px">
                <span style="top:${i.labelY}px">${i.label}</span>
              </div>`)}
          ${pe(e.preps,i=>i.key,i=>p`<div
                class="prep"
                aria-hidden="true"
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;border-color:${i.color.color};background:rgba(${i.color.rgb},0.07);color:${i.color.ink}"
              >
                ${i.label}
              </div>`)}
          ${pe(e.cards,i=>i.key,i=>{let l=i.color,c=i.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:i.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${i.wrap?"wrap":""} ${r(i.target)?"sel":""} ${i.clash?"clash":""} ${i.skipped?"skipped":""}"
                aria-label=${i.aria}
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;background:${c};border-color:${i.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(i.target)}
              >
                <span class="top">
                  <span class="title">${i.title}</span>
                  <span class="time">${i.time}</span>
                  ${i.showDrop&&i.drop?p`<span class="line tone-${i.drop.tone}">${i.drop.text}</span>`:T}
                </span>
                ${i.showPick&&i.pick?p`<span class="line tone-${i.pick.tone}">${i.pick.text}</span>`:T}
              </button>`})}
          ${pe(e.rides,i=>i.key,i=>p`<button
                type="button"
                class="ride ${i.dashed?"dashed":""} ${i.clash?"clash":""}"
                aria-label=${i.aria}
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px"
                @click=${()=>this.open(i.target)}
              >
                <span class="l1">${i.l1}</span>${i.show2?p`<span class="l2" style="-webkit-line-clamp:${i.lines2}">${i.l2}</span>`:T}
              </button>`)}
          ${pe(e.stays,i=>i.key,i=>p`<button
                type="button"
                class="stay"
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px;border-color:${i.color.color};background:repeating-linear-gradient(135deg, rgba(${i.color.rgb},0.28) 0px, rgba(${i.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(i.target)}
              >
                <span class="l1" style="color:${i.color.ink}">${i.l1}</span><span class="l2">${i.l2}</span>
              </button>`)}
          ${pe(e.trips,i=>i.key,i=>p`<button
                type="button"
                class="trip ${i.bad?"bad":""} ${i.stops?"list":""}"
                aria-label=${i.aria}
                style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px"
                @click=${()=>this.open(i.target)}
              >
                <span class="l1">${i.l1}${i.kids.map(l=>p`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${i.show2?p`<span class="l2">${i.l2}</span>`:T}
                ${i.stops?i.stops.map(l=>p`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):T}
                ${i.show3?p`<span class="l3">${i.l3}</span>`:T}
              </button>`)}
          ${pe(e.overlaps,i=>i.key,i=>p`<div class="overlap" aria-hidden="true" style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px"></div>`)}
          ${pe(e.marks,i=>i.key,i=>p`<span class="mark" style="left:${i.x}px;top:${i.y}px;${i.right?"transform:translateX(-100%)":""}">${i.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:T}
        </div>
      </div>
    `}renderAttention(e,t){let{items:r,problems:o,later:a}=e,i=this.plan,l=o+t.length,c=this.chores,h=!!c&&!un(c);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?T:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${h?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?p`<div class="attn-chores">${t.map(d=>this.renderChoreRow(d,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${i&&!o?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${Q`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${zt(i)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:T}
      ${r.map(d=>p`<div class="issue ${d.tone}">
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
              </div>`:T}
        </div>`)}
      ${this.wide&&i&&!zt(i)&&this.page==="rides"?this.renderLegend():T}
    `}kidColorOf(e){let t=this.plan?de(this.plan).get(e):void 0;if(t)return t;let r=this.lunch?.kids.findIndex(o=>o.id===e)??-1;return V(Math.max(0,r))}renderLunchChip(e,t=!1){let r=this.lunch,o=r?.kids.find(c=>c.id===e);if(!r||!o)return T;this.tick;let a=this.today(),i=Vs(o,a.date,a.minutes,this.lunchDraft);if(!i)return T;let l=it[i.lunch];return p`<span class="lunch-chip ${i.lunch} ${t?"small":""}" title=${`${l} lunch ${i.when}`}
      >${i.lunch==="bring"?Ys:Qs}<span class="lunch-chip-text">${l}${t?T:` ${i.when}`}</span></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let t=qs(e),r=this.lunchMonth&&t.includes(this.lunchMonth)?this.lunchMonth:ue(e.today),o=t.indexOf(r),a=l=>{let c=t[o+l];c&&(this.lunchMonth=c)},i=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:T;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${o<=0} @click=${()=>a(-1)}>
            ${Q`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Ot(r)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${o<0||o>=t.length-1} @click=${()=>a(1)}>
            ${Q`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
          </button>
        </div>
        <span class="chores-hint">Tap a day to switch between Buy and Bring. Tap a weekday to set the whole month.</span>
      </div>
      ${i}
      <div class="chore-cols lunch-cols" style="--n:${e.kids.length}">
        ${e.kids.map(l=>this.renderLunchCard(e,l,r))}
      </div>
      <p class="message-aside">
        Picks are saved as <strong>Bring Lunch</strong> and <strong>Buy Lunch</strong> all-day events on each kid’s calendar.
        Days off come from <strong>No School</strong> events there. A day nobody picked gets the kid’s default, set in
        Home Assistant under MyDashLight’s options. For a Pack lunch reminder, add a School days chore set to
        <strong>Only on Bring lunch days</strong>.
      </p>
    </div>`}renderLunchCard(e,t,r){let o=this.kidColorOf(t.id),a=Ks(e,t,r,this.lunchDraft),i=Fs(a),l=a.flat(),c=l.filter(w=>!w.outside&&!w.past&&w.lunch),h=t.days_off.filter(w=>ue(w.first)<=r&&r<=ue(w.last)),d=w=>c.filter(u=>Nt(u.date)===w),f=w=>{let u=d(w);if(!u.length)return;let $=u.every(A=>A.lunch==="bring")?"buy":"bring";this.saveLunch(t.id,u.map(A=>A.date),$)},v=c.length?`${i.bring} Bring · ${i.buy} Buy${r===ue(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card" style="--c:${o.color};--rgb:${o.rgb};--k:${o.ink}" aria-label=${`${t.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${xe(t.name)}</span>
        <span class="ch-text">
          <span class="name">${t.name}</span>
          <span class="sub">${v}</span>
        </span>
        <span class="lunch-default">${it[t.default]} unless picked</span>
      </div>
      <div class="lunch-grid" role="grid" aria-label=${`${t.name}, ${Ot(r)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((w,u)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!d(u).length}
            aria-label=${`${d(u).every($=>$.lunch==="bring")?"Buy":"Bring"} every ${w} left in ${Ot(r)} for ${t.name}`}
            @click=${()=>f(u)}
          >
            ${w}
          </button>`)}
        ${l.map(w=>this.renderLunchCell(t,w))}
      </div>
      ${h.length?p`<p class="lunch-offs">
            No school:
            ${h.map(w=>{let u=w.first<`${r}-01`?`${r}-01`:w.first,$=ue(w.last)>r?We(`${yn(r)}-01`,-1):w.last;return`${u===$?kn(u):`${kn(u)}–${kn($)}`} ${Ws(w.title)}`}).join(" · ")}
          </p>`:T}
    </section>`}renderLunchCell(e,t){if(t.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(t.off!==null||!t.lunch)return p`<span class="lunch-day off ${t.today?"today":""}" title=${t.off??""}>
        <span class="lunch-num">${t.day}</span><span class="lunch-word">No school</span>
      </span>`;let r=t.lunch,o=r==="buy"?"bring":"buy",a=`${e.name}, ${ye(t.date)}: ${it[r]}${t.picked?"":" (not picked yet)"}. Tap to ${it[o]}.`;return p`<button
      type="button"
      class="lunch-day ${r} ${t.picked?"picked":"unpicked"} ${t.past?"past":""} ${t.today?"today":""}"
      ?disabled=${t.past}
      aria-label=${a}
      @click=${()=>void this.saveLunch(e.id,[t.date],o)}
    >
      <span class="lunch-num">${t.day}</span>
      <span class="lunch-word">${r==="bring"?Ys:Qs}${it[r]}</span>
    </button>`}renderChoreRow(e,t=!1){let r=this.chores,o=this.choreDone(e),a=r.kids.findIndex(A=>A.id===e.kid),i=(this.plan?de(this.plan).get(e.kid):void 0)??V(Math.max(0,a)),l=r.kids[a]?.name??"",c=o===Ke(e)?e:{...e,state:o?"done":"open",done_at:o?new Date().toISOString():null},h=o&&c.done_by&&c.done_by!==e.kid?r.people?.find(A=>A.id===c.done_by)?.name??c.done_by_name??null:null,d=`${pn(c,r.today,r.time_zone)}${h?` · by ${h}`:""}`,f=o||Ns(e),v=`${t?`${l}: `:""}${e.title}. ${d?`${d}. `:""}${o?"Done. Tap to undo.":"Tap when it’s done."}`,w=p`<span class="box" aria-hidden="true"
        >${o?Q`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:T}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:T}
      <span class="chore-text">
        <span class="chore-title">${t?p`<span class="chore-kid">${l}</span> · `:T}${e.title}</span>
        ${d?p`<span class="chore-note">${d}</span>`:T}
      </span>`,u=`chore ${o?"done":""} ${e.state==="overdue"&&!o?"overdue":""} ${f?"":"later"}`,$=`--c:${i.color};--rgb:${i.rgb};--k:${i.ink}`;return f?p`<button type="button" class=${u} style=${$} aria-pressed=${o?"true":"false"} aria-label=${v} @click=${()=>this.tapChore(e)}>
          ${w}
        </button>`:p`<div class=${u} style=${$}>${w}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(un(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${$n} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore templates: Daily</strong> (or Weekly or Monthly). It
          shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(a=>a.problems.length),r=t.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(a=>this.renderTemplateRow(a))}</div>
        </section>`:T;this.tick;let o=Is(e,this.plan?de(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${$n} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${yi} Manage chores</button>
      </div>
      ${r}
      <div class="chore-cols" style="--n:${o.length}">
        ${o.map(a=>{let i=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return p`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${xe(a.name)}</span>
              <span class="ch-text">
                <span class="name">${a.name}</span>
                <span class="sub">${i?`${i} to do`:a.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(a.kid)}
            </div>
            ${a.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${a.overdue.map(l=>this.renderChoreRow(l))}`:T}
            ${a.now.length?p`<h3 class="chore-group">To do</h3>
                  ${a.now.map(l=>this.renderChoreRow(l))}`:T}
            ${a.done.length?p`<h3 class="chore-group">Done</h3>
                  ${a.done.map(l=>this.renderChoreRow(l))}`:T}
            ${a.later.map(l=>p`<h3 class="chore-group">${l.date===e.today?"Later today":ki(l.date,e.today)}</h3>
                ${l.chores.map(c=>this.renderChoreRow(c))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?p`<p class="chore-none">No chores this week.</p>`:T}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let r=this.chores.kids,o=this.plan?de(this.plan):void 0,a=this.choreEdit?.template===e.id,i=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(vn).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${xn(e.who,r,e.take_turns)} · ${bn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${a?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:T}</span>
        ${i}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let c=r.findIndex(d=>d.id===l),h=o?.get(l)??V(Math.max(0,c));return p`<span class="kid-dot" style="background:${h.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day or some days"],["school","School days"],["weekly","Weekly"],["monthly","Monthly"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${$n} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([r,o])=>{let a=e.templates.filter(i=>i.repeats===r);return a.length?p`<section class="manage-group" aria-label=${o}>
                  <h3 class="chore-group">${o}</h3>
                  <div class="tmpl-list">${a.map(i=>this.renderTemplateRow(i))}</div>
                </section>`:T}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the lists <strong>Chore templates: Daily</strong>, <strong>Weekly</strong>,
        <strong>Monthly</strong> and <strong>School days</strong>. A task added there by hand shows up here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return p``;let r=t.kids,o=this.plan?de(this.plan):void 0,a=this.choreBusy,i=e.template?t.templates.find(u=>u.id===e.template):void 0,l=gn(e),c=(i?.problems??[]).filter(u=>u!=="who:"),h=(u,$,A,C=!1)=>p`<button type="button" class="choice ${C?"wide":""}" aria-pressed=${u?"true":"false"} ?disabled=${a} @click=${A}>${$}</button>`,d=(u,$,A,C)=>p`<button type="button" class="chip" aria-pressed=${u?"true":"false"} aria-label=${C??T} ?disabled=${a} @click=${A}>${$}</button>`,f=u=>{u!==e.repeats&&this.changeDraft({repeats:u,days:i&&i.repeats===u?i.days??Rt(u):Rt(u)})},v=u=>{let $=e.who.includes(u)?e.who.filter(A=>A!==u):r.filter(A=>A.id===u||e.who.includes(A.id)).map(A=>A.id);this.changeDraft({who:$})},w;if(e.repeats==="school"){let u=e.days===ze?new Set:e.days===""?new Set([0,1,2,3,4]):fn(e.days)??new Set,$=A=>{let C=new Set(u);C.has(A)?C.delete(A):C.add(A),this.changeDraft({days:C.size===5?"":C.size?Lt(C):ze})};w=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Oe.slice(0,5).map((A,C)=>d(u.has(C),A.slice(0,2),()=>$(C),A))}
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
        </div>`}else if(e.repeats==="monthly"){let u=e.days.trim(),$=/^\d+$/.test(u)?Number(u):null,A=u&&u.toLowerCase()!=="any"&&u.toLowerCase()!=="last"&&$===null;w=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${A?4:3}, minmax(0, 1fr))">
          ${h(u===""||u.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${h($!==null,"On a date",()=>this.changeDraft({days:String($??1)}))}
          ${h(u.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${A?h(!0,u,()=>{}):T}
        </div>
        ${$!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${a||$<=1} @click=${()=>this.changeDraft({days:String($-1)})}>−</button>
                <span class="arrive-value">${mn($)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${a||$>=31} @click=${()=>this.changeDraft({days:String($+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${u.toLowerCase()==="last"?"Due on the month’s last day.":A?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else{let u=e.repeats==="weekly"&&(e.days===""||e.days.toLowerCase()==="any"),$=e.days===ze?new Set:u?new Set:fn(e.days)??new Set,A=C=>{let H=new Set($);H.has(C)?H.delete(C):H.add(C),e.repeats==="weekly"?this.changeDraft({days:H.size?Lt(H)||"Mon-Sun":"Any"}):this.changeDraft({days:H.size?Lt(H):ze})};w=p`<div class="field">
        <span class="field-label">${e.repeats==="weekly"?"Which day":"Which days"}</span>
        ${e.repeats==="weekly"?p`<div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
              ${h(u,"Any day that week",()=>this.changeDraft({days:"Any"}))}
              ${h(!u,"On a set day",()=>this.changeDraft({days:u?"Sat":e.days}))}
            </div>`:T}
        ${e.repeats==="daily"||!u?p`<div role="group" aria-label="Days of the week" class="day-chips">
              ${Oe.map((C,H)=>d($.has(H),C.slice(0,2),()=>A(H),C))}
            </div>`:T}
        ${e.repeats==="daily"?p`<div class="chips">
              ${d(e.days==="","Every day",()=>this.changeDraft({days:""}))}
              ${d(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
              ${d(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
            </div>`:p`<p class="field-hint">${u?"Shows all week, due on Sunday.":"Due that day."}</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?xn(e.who,r,e.take_turns):"Nobody yet"} · ${e.days===ze?"No days picked":bn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${a} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${c.length?p`<p class="field-hint bad">${c.map(vn).join(". ")}. Saving fixes it.</p>`:T}
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
          ${wi.map(u=>d(e.icon===u,u,()=>this.changeDraft({icon:e.icon===u?null:u}),`Picture ${u}`))}
        </div>
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${r.map((u,$)=>{let A=o?.get(u.id)??V($),C=e.who.includes(u.id);return p`<button type="button" class="who-chip" style="--c:${A.color};--rgb:${A.rgb}" aria-pressed=${C?"true":"false"} ?disabled=${a} @click=${()=>v(u.id)}>
              <span class="avatar" aria-hidden="true">${xe(u.name)}</span>${u.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${h(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${h(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:T}
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
      ${w}
      ${e.repeats==="school"?T:p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Repeats</span>
          <span class="field-hint">${$i(e.repeats,e.every)}</span>
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
            </button>`:T}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${a?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return p``;let r=t.people?.length?t.people:t.kids.map(d=>({...d,role:"kid"})),o=t.kids.findIndex(d=>d.id===e.kid),a=t.kids[o],i=this.plan?de(this.plan):void 0,l=i?.get(e.kid)??V(Math.max(0,o)),c=r.filter(d=>d.id!==e.kid),h=d=>{let f=t.kids.findIndex(v=>v.id===d.id);return f>=0?(i?.get(d.id)??V(f)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:T}${e.title}</span>
          <span class="ed-meta">${a?.name??""} · ${pn(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${xe(a?.name??"?")}</span>
          <span>${a?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${c.map(d=>p`<button type="button" class="done-by" style="--c:${h(d)}" @click=${()=>void this.toggleChore(e,d.id)}>
                  <span class="avatar ${d.role==="parent"?"driver":""}" aria-hidden="true">${xe(d.name)}</span>
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
    </div>`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return p``;let{day:r,event:o}=t,a=$e(e),l=de(e).get(o.kid)??V(0),c=!!this.pending,h=k=>this.pending?.key===k?this.pending.value:void 0,d=[...e.people?.carpools??[]];for(let k of e.days)for(let E of k.events)for(let S of[E.drop,E.pick])S&&S!=="none"&&!a.includes(S)&&!d.some(z=>z.toLowerCase()===S.toLowerCase())&&d.push(S);let f=k=>{if(!o.sides.includes(k))return T;let E=h(k),S=E!==void 0?String(E):k==="drop"?o.drop:o.pick,z=S&&S!=="none"&&!a.includes(S)?S:"",j=L=>this.setRide(o,k,S===L?"":L),P=[...a.map(L=>[L,on(e,L)]),["none","Not needed"]];return p`<div class="field">
        <span class="field-label">${k==="drop"?"Drop-off":"Pick-up"} ${S===""?p`<span class="nobody">· nobody yet</span>`:T}</span>
        <div role="group" aria-label=${k==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${P.length}, minmax(0, 1fr))">
          ${P.map(([L,K])=>p`<button type="button" class="choice" aria-pressed=${S===L?"true":"false"} ?disabled=${c} @click=${()=>j(L)}>
                ${K}
              </button>`)}
        </div>
        ${d.length?p`<div role="group" aria-label=${k==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${d.map(L=>p`<button type="button" class="chip" aria-pressed=${S.toLowerCase()===L.toLowerCase()?"true":"false"} ?disabled=${c} @click=${()=>j(L)}>
                    ${L}
                  </button>`)}
            </div>`:T}
        <input
          type="text"
          .value=${z&&!d.some(L=>L.toLowerCase()===z.toLowerCase())?z:""}
          ?disabled=${c}
          aria-label=${k==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${L=>{let K=L.target.value.trim();K&&K!==S&&this.setRide(o,k,K)}}
          @keydown=${L=>{L.key==="Enter"&&L.target.blur()}}
        />
      </div>`},v=h("stay"),w=v!==void 0?!!v:o.stay,u=o.drop===o.pick&&a.includes(o.drop),$=h("along"),A=$!==void 0?$:o.along,C=Ie(e).filter(k=>k!==o.kid),H=a.includes(o.drop)&&o.sides.includes("drop"),X=h("arrive"),N=this.arriveDraft!==void 0?this.arriveDraft:X!==void 0?X:o.arrive_by,G=[],m=k=>k==="none"?"Not needed":on(e,k);o.drop!==""&&G.push(`Drop-off: ${m(o.drop)}`),o.pick!==""&&G.push(`Pick-up: ${m(o.pick)}`),o.stay&&G.push("Stay: yes"),o.along.length&&G.push(`Take along: ${o.along.map(k=>le(e,k)).join(", ")}`),o.arrive_by!=null&&G.push(`Arrive by: ${Ye(o.arrive_by)}`);let y=h("attending"),g=y!==void 0?!!y:o.attending!==!1;o.attending===!1&&G.splice(0,G.length,"Attending: no");let b=r.date===this.today().date?"":`${ae(r.date)} · `,x=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${le(e,o.kid)} · ${o.title}</span>
          <span class="ed-meta">${b}${B(o.start)}–${B(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return o.where==="home"?p`${x}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${le(e,o.kid)} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${x}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
      ${o.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ae(r.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:T}
      <div class="field">
        <span class="field-label">${le(e,o.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${g?"true":"false"} ?disabled=${c} @click=${()=>this.setAttending(o,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${g?"false":"true"} ?disabled=${c} @click=${()=>this.setAttending(o,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${g?p`${o.where==="anywhere"?p`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:T}
            ${f("drop")} ${f("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${w?"true":"false"} ?disabled=${!u||c} @click=${()=>this.toggleStay(o)}>
          ${u?w?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${H&&C.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${C.map(k=>p`<button type="button" class="chip" aria-pressed=${A.includes(k)?"true":"false"} ?disabled=${c} @click=${()=>this.toggleAlong(o,k)}>
                  ${le(e,k)}
                </button>`)}
            </div>
          </div>`:T}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${N!=null?`${o.start-N} min before it starts`:`Aims for a few minutes before ${B(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${c} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${N!=null?B(N):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${c||N==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${N!=null?p`<button type="button" class="chip clear" ?disabled=${c} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:T}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${G.length?G.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:T}
      ${g?p`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:T}
    `}};ot.styles=Gs,ot.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",ot);function Ai(){let s=[document];for(let n of document.querySelectorAll("*"))n.shadowRoot&&s.push(n.shadowRoot);return s}function Zs(s=3e3){let n=new CSSStyleSheet;n.replaceSync("*, *::before, *::after { cursor: none !important; }"),n.disabled=!0;let e,t=o=>{if(o)for(let a of Ai())a.adoptedStyleSheets.includes(n)||(a.adoptedStyleSheets=[...a.adoptedStyleSheets,n]);n.disabled=!o},r=o=>{if(clearTimeout(e),o.pointerType==="touch"){t(!0);return}t(!1),e=setTimeout(()=>t(!0),s)};window.addEventListener("pointermove",r,{passive:!0}),window.addEventListener("pointerdown",r,{passive:!0}),e=setTimeout(()=>t(!0),s)}var Xs=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],er=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function tr(s,n,e,t){let r=Math.max(0,Math.min(n,s.length)),o=Math.max(r,Math.min(e,s.length));return{value:s.slice(0,r)+t+s.slice(o),caret:r+t.length}}function nr(s,n,e){let t=Math.max(0,Math.min(n,s.length)),r=Math.max(t,Math.min(e,s.length));if(t!==r)return{value:s.slice(0,t)+s.slice(r),caret:t};if(t===0)return{value:s,caret:0};let o=Array.from(s.slice(0,t));o.pop();let a=o.join("");return{value:a+s.slice(t),caret:a.length}}function sr(s,n){return n===0||/\s$/.test(s.slice(0,n))}var Ei=new Set(["text","search","email","url","tel","number","password"]);function rr(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Ei.has(s.type)&&!s.readOnly&&!s.disabled}var Pi={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Mi={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},at=class extends ce{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=t=>t.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let t=e.selectionStart,r=e.selectionEnd;if(t!==null&&r!==null)return[t,r]}catch{}return[e.value.length,e.value.length]}apply(e,t,r){e.value=t;try{e.setSelectionRange(r,r)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=sr(this.field.value,e)}press(e){let t=this.field;if(t){switch(e){case"hide":t.blur();return;case"done":this.commit(),t.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),t.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[r,o]=this.selection(t),a=nr(t.value,r,o);this.apply(t,a.value,a.caret);break}default:{let r=e==="space"?" ":this.shift?e.toUpperCase():e,[o,a]=this.selection(t),i=tr(t.value,o,a,r);this.apply(t,i.value,i.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let t=e.length>1,r=e==="layout"?this.layout==="letters"?"123":"ABC":Pi[e]??(this.shift?e.toUpperCase():e);return p`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":t?"wide":""}
      aria-label=${Mi[e]??r}
      aria-pressed=${e==="shift"?String(this.shift):T}
      @click=${()=>this.press(e)}
    >
      ${r}
    </button>`}render(){let e=this.layout==="letters"?Xs:er;return p`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(t=>p`<div class="row">${t.map(r=>this.key(r))}</div>`)}
      </div>`}};at.styles=Me`
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
  `,at.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",at);function Si(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function ir(s){document.addEventListener("focusin",n=>{let e=n.composedPath()[0];rr(e)&&s.attach(e)}),document.addEventListener("focusout",()=>{setTimeout(()=>{let n=Si();!s.target||n===s.target||(rr(n)?s.attach(n):s.detach())},0)}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var _n="mydashlight",Di=`/api/${_n}/pair`,Li=`/api/${_n}/pair/poll`,Cn=`/${_n}`,Tn="pair";function or(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function ar(s,n){return`${s}${Cn}?${Tn}=${encodeURIComponent(n)}`}function Ri(s,n,e=Date.now()){return{hassUrl:s,clientId:n.client_id,access_token:n.access_token,refresh_token:n.refresh_token,expires_in:n.expires_in,expires:e+n.expires_in*1e3}}var Ue=class extends Error{constructor(n,e=!1){super(n),this.busy=e}};async function lr(s=fetch){let n=await s(Di,{method:"POST",cache:"no-store"});if(n.status===429)throw new Ue("Too many screens are asking to pair right now.",!0);if(!n.ok)throw new Ue(`Home Assistant answered ${n.status}.`);return await n.json()}async function dr(s,n,e=fetch){let t=await e(Li,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(t.status===404)return{status:"expired"};if(!t.ok)throw new Ue(`Home Assistant answered ${t.status}.`);let r=await t.json();return r.status==="paired"&&r.auth?{status:"paired",auth:Ri(n,r.auth)}:{status:"pending"}}var Fe=function(s,n){let r=s,o=lt[n],a=null,i=0,l=null,c=[],h={},d=function(m,y){i=r*4+17,a=(function(g){let b=new Array(g);for(let x=0;x<g;x+=1){b[x]=new Array(g);for(let k=0;k<g;k+=1)b[x][k]=null}return b})(i),f(0,0),f(i-7,0),f(0,i-7),u(),w(),A(m,y),r>=7&&$(m),l==null&&(l=X(r,o,c)),C(l,y)},f=function(m,y){for(let g=-1;g<=7;g+=1)if(!(m+g<=-1||i<=m+g))for(let b=-1;b<=7;b+=1)y+b<=-1||i<=y+b||(0<=g&&g<=6&&(b==0||b==6)||0<=b&&b<=6&&(g==0||g==6)||2<=g&&g<=4&&2<=b&&b<=4?a[m+g][y+b]=!0:a[m+g][y+b]=!1)},v=function(){let m=0,y=0;for(let g=0;g<8;g+=1){d(!0,g);let b=Ce.getLostPoint(h);(g==0||m>b)&&(m=b,y=g)}return y},w=function(){for(let m=8;m<i-8;m+=1)a[m][6]==null&&(a[m][6]=m%2==0);for(let m=8;m<i-8;m+=1)a[6][m]==null&&(a[6][m]=m%2==0)},u=function(){let m=Ce.getPatternPosition(r);for(let y=0;y<m.length;y+=1)for(let g=0;g<m.length;g+=1){let b=m[y],x=m[g];if(a[b][x]==null)for(let k=-2;k<=2;k+=1)for(let E=-2;E<=2;E+=1)k==-2||k==2||E==-2||E==2||k==0&&E==0?a[b+k][x+E]=!0:a[b+k][x+E]=!1}},$=function(m){let y=Ce.getBCHTypeNumber(r);for(let g=0;g<18;g+=1){let b=!m&&(y>>g&1)==1;a[Math.floor(g/3)][g%3+i-8-3]=b}for(let g=0;g<18;g+=1){let b=!m&&(y>>g&1)==1;a[g%3+i-8-3][Math.floor(g/3)]=b}},A=function(m,y){let g=o<<3|y,b=Ce.getBCHTypeInfo(g);for(let x=0;x<15;x+=1){let k=!m&&(b>>x&1)==1;x<6?a[x][8]=k:x<8?a[x+1][8]=k:a[i-15+x][8]=k}for(let x=0;x<15;x+=1){let k=!m&&(b>>x&1)==1;x<8?a[8][i-x-1]=k:x<9?a[8][15-x-1+1]=k:a[8][15-x-1]=k}a[i-8][8]=!m},C=function(m,y){let g=-1,b=i-1,x=7,k=0,E=Ce.getMaskFunction(y);for(let S=i-1;S>0;S-=2)for(S==6&&(S-=1);;){for(let z=0;z<2;z+=1)if(a[b][S-z]==null){let j=!1;k<m.length&&(j=(m[k]>>>x&1)==1),E(b,S-z)&&(j=!j),a[b][S-z]=j,x-=1,x==-1&&(k+=1,x=7)}if(b+=g,b<0||i<=b){b-=g,g=-g;break}}},H=function(m,y){let g=0,b=0,x=0,k=new Array(y.length),E=new Array(y.length);for(let P=0;P<y.length;P+=1){let L=y[P].dataCount,K=y[P].totalCount-L;b=Math.max(b,L),x=Math.max(x,K),k[P]=new Array(L);for(let R=0;R<k[P].length;R+=1)k[P][R]=255&m.getBuffer()[R+g];g+=L;let _=Ce.getErrorCorrectPolynomial(K),I=dt(k[P],_.getLength()-1).mod(_);E[P]=new Array(_.getLength()-1);for(let R=0;R<E[P].length;R+=1){let O=R+I.getLength()-E[P].length;E[P][R]=O>=0?I.getAt(O):0}}let S=0;for(let P=0;P<y.length;P+=1)S+=y[P].totalCount;let z=new Array(S),j=0;for(let P=0;P<b;P+=1)for(let L=0;L<y.length;L+=1)P<k[L].length&&(z[j]=k[L][P],j+=1);for(let P=0;P<x;P+=1)for(let L=0;L<y.length;L+=1)P<E[L].length&&(z[j]=E[L][P],j+=1);return z},X=function(m,y,g){let b=cr.getRSBlocks(m,y),x=hr();for(let E=0;E<g.length;E+=1){let S=g[E];x.put(S.getMode(),4),x.put(S.getLength(),Ce.getLengthInBits(S.getMode(),m)),S.write(x)}let k=0;for(let E=0;E<b.length;E+=1)k+=b[E].dataCount;if(x.getLengthInBits()>k*8)throw"code length overflow. ("+x.getLengthInBits()+">"+k*8+")";for(x.getLengthInBits()+4<=k*8&&x.put(0,4);x.getLengthInBits()%8!=0;)x.putBit(!1);for(;!(x.getLengthInBits()>=k*8||(x.put(236,8),x.getLengthInBits()>=k*8));)x.put(17,8);return H(x,b)};h.addData=function(m,y){y=y||"Byte";let g=null;switch(y){case"Numeric":g=Bi(m);break;case"Alphanumeric":g=Ni(m);break;case"Byte":g=Ii(m);break;case"Kanji":g=Oi(m);break;default:throw"mode:"+y}c.push(g),l=null},h.isDark=function(m,y){if(m<0||i<=m||y<0||i<=y)throw m+","+y;return a[m][y]},h.getModuleCount=function(){return i},h.make=function(){if(r<1){let m=1;for(;m<40;m++){let y=cr.getRSBlocks(m,o),g=hr();for(let x=0;x<c.length;x++){let k=c[x];g.put(k.getMode(),4),g.put(k.getLength(),Ce.getLengthInBits(k.getMode(),m)),k.write(g)}let b=0;for(let x=0;x<y.length;x++)b+=y[x].dataCount;if(g.getLengthInBits()<=b*8)break}r=m}d(!1,v())},h.createTableTag=function(m,y){m=m||2,y=typeof y>"u"?m*4:y;let g="";g+='<table style="',g+=" border-width: 0px; border-style: none;",g+=" border-collapse: collapse;",g+=" padding: 0px; margin: "+y+"px;",g+='">',g+="<tbody>";for(let b=0;b<h.getModuleCount();b+=1){g+="<tr>";for(let x=0;x<h.getModuleCount();x+=1)g+='<td style="',g+=" border-width: 0px; border-style: none;",g+=" border-collapse: collapse;",g+=" padding: 0px; margin: 0px;",g+=" width: "+m+"px;",g+=" height: "+m+"px;",g+=" background-color: ",g+=h.isDark(b,x)?"#000000":"#ffffff",g+=";",g+='"/>';g+="</tr>"}return g+="</tbody>",g+="</table>",g},h.createSvgTag=function(m,y,g,b){let x={};typeof arguments[0]=="object"&&(x=arguments[0],m=x.cellSize,y=x.margin,g=x.alt,b=x.title),m=m||2,y=typeof y>"u"?m*4:y,g=typeof g=="string"?{text:g}:g||{},g.text=g.text||null,g.id=g.text?g.id||"qrcode-description":null,b=typeof b=="string"?{text:b}:b||{},b.text=b.text||null,b.id=b.text?b.id||"qrcode-title":null;let k=h.getModuleCount()*m+y*2,E,S,z,j,P="",L;for(L="l"+m+",0 0,"+m+" -"+m+",0 0,-"+m+"z ",P+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',P+=x.scalable?"":' width="'+k+'px" height="'+k+'px"',P+=' viewBox="0 0 '+k+" "+k+'" ',P+=' preserveAspectRatio="xMinYMin meet"',P+=b.text||g.text?' role="img" aria-labelledby="'+N([b.id,g.id].join(" ").trim())+'"':"",P+=">",P+=b.text?'<title id="'+N(b.id)+'">'+N(b.text)+"</title>":"",P+=g.text?'<description id="'+N(g.id)+'">'+N(g.text)+"</description>":"",P+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',P+='<path d="',z=0;z<h.getModuleCount();z+=1)for(j=z*m+y,E=0;E<h.getModuleCount();E+=1)h.isDark(z,E)&&(S=E*m+y,P+="M"+S+","+j+L);return P+='" stroke="transparent" fill="black"/>',P+="</svg>",P},h.createDataURL=function(m,y){m=m||2,y=typeof y>"u"?m*4:y;let g=h.getModuleCount()*m+y*2,b=y,x=g-y;return ji(g,g,function(k,E){if(b<=k&&k<x&&b<=E&&E<x){let S=Math.floor((k-b)/m),z=Math.floor((E-b)/m);return h.isDark(z,S)?0:1}else return 1})},h.createImgTag=function(m,y,g){m=m||2,y=typeof y>"u"?m*4:y;let b=h.getModuleCount()*m+y*2,x="";return x+="<img",x+=' src="',x+=h.createDataURL(m,y),x+='"',x+=' width="',x+=b,x+='"',x+=' height="',x+=b,x+='"',g&&(x+=' alt="',x+=N(g),x+='"'),x+="/>",x};let N=function(m){let y="";for(let g=0;g<m.length;g+=1){let b=m.charAt(g);switch(b){case"<":y+="&lt;";break;case">":y+="&gt;";break;case"&":y+="&amp;";break;case'"':y+="&quot;";break;default:y+=b;break}}return y},G=function(m){m=typeof m>"u"?2:m;let g=h.getModuleCount()*1+m*2,b=m,x=g-m,k,E,S,z,j,P={"██":"█","█ ":"▀"," █":"▄","  ":" "},L={"██":"▀","█ ":"▀"," █":" ","  ":" "},K="";for(k=0;k<g;k+=2){for(S=Math.floor((k-b)/1),z=Math.floor((k+1-b)/1),E=0;E<g;E+=1)j="█",b<=E&&E<x&&b<=k&&k<x&&h.isDark(S,Math.floor((E-b)/1))&&(j=" "),b<=E&&E<x&&b<=k+1&&k+1<x&&h.isDark(z,Math.floor((E-b)/1))?j+=" ":j+="█",K+=m<1&&k+1>=x?L[j]:P[j];K+=`
`}return g%2&&m>0?K.substring(0,K.length-g-1)+Array(g+1).join("▀"):K.substring(0,K.length-1)};return h.createASCII=function(m,y){if(m=m||1,m<2)return G(y);m-=1,y=typeof y>"u"?m*2:y;let g=h.getModuleCount()*m+y*2,b=y,x=g-y,k,E,S,z,j=Array(m+1).join("██"),P=Array(m+1).join("  "),L="",K="";for(k=0;k<g;k+=1){for(S=Math.floor((k-b)/m),K="",E=0;E<g;E+=1)z=1,b<=E&&E<x&&b<=k&&k<x&&h.isDark(S,Math.floor((E-b)/m))&&(z=0),K+=z?j:P;for(S=0;S<m;S+=1)L+=K+`
`}return L.substring(0,L.length-1)},h.renderTo2dContext=function(m,y){y=y||2;let g=h.getModuleCount();for(let b=0;b<g;b++)for(let x=0;x<g;x++)m.fillStyle=h.isDark(b,x)?"black":"white",m.fillRect(x*y,b*y,y,y)},h};Fe.stringToBytes=function(s){let n=[];for(let e=0;e<s.length;e+=1){let t=s.charCodeAt(e);n.push(t&255)}return n};Fe.createStringToBytes=function(s,n){let e=(function(){let r=Ui(s),o=function(){let l=r.read();if(l==-1)throw"eof";return l},a=0,i={};for(;;){let l=r.read();if(l==-1)break;let c=o(),h=o(),d=o(),f=String.fromCharCode(l<<8|c),v=h<<8|d;i[f]=v,a+=1}if(a!=n)throw a+" != "+n;return i})(),t=63;return function(r){let o=[];for(let a=0;a<r.length;a+=1){let i=r.charCodeAt(a);if(i<128)o.push(i);else{let l=e[r.charAt(a)];typeof l=="number"?(l&255)==l?o.push(l):(o.push(l>>>8),o.push(l&255)):o.push(t)}}return o}};var ie={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},lt={L:1,M:0,Q:3,H:2},_e={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Ce=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,e=7973,t=21522,r={},o=function(a){let i=0;for(;a!=0;)i+=1,a>>>=1;return i};return r.getBCHTypeInfo=function(a){let i=a<<10;for(;o(i)-o(n)>=0;)i^=n<<o(i)-o(n);return(a<<10|i)^t},r.getBCHTypeNumber=function(a){let i=a<<12;for(;o(i)-o(e)>=0;)i^=e<<o(i)-o(e);return a<<12|i},r.getPatternPosition=function(a){return s[a-1]},r.getMaskFunction=function(a){switch(a){case _e.PATTERN000:return function(i,l){return(i+l)%2==0};case _e.PATTERN001:return function(i,l){return i%2==0};case _e.PATTERN010:return function(i,l){return l%3==0};case _e.PATTERN011:return function(i,l){return(i+l)%3==0};case _e.PATTERN100:return function(i,l){return(Math.floor(i/2)+Math.floor(l/3))%2==0};case _e.PATTERN101:return function(i,l){return i*l%2+i*l%3==0};case _e.PATTERN110:return function(i,l){return(i*l%2+i*l%3)%2==0};case _e.PATTERN111:return function(i,l){return(i*l%3+(i+l)%2)%2==0};default:throw"bad maskPattern:"+a}},r.getErrorCorrectPolynomial=function(a){let i=dt([1],0);for(let l=0;l<a;l+=1)i=i.multiply(dt([1,Te.gexp(l)],0));return i},r.getLengthInBits=function(a,i){if(1<=i&&i<10)switch(a){case ie.MODE_NUMBER:return 10;case ie.MODE_ALPHA_NUM:return 9;case ie.MODE_8BIT_BYTE:return 8;case ie.MODE_KANJI:return 8;default:throw"mode:"+a}else if(i<27)switch(a){case ie.MODE_NUMBER:return 12;case ie.MODE_ALPHA_NUM:return 11;case ie.MODE_8BIT_BYTE:return 16;case ie.MODE_KANJI:return 10;default:throw"mode:"+a}else if(i<41)switch(a){case ie.MODE_NUMBER:return 14;case ie.MODE_ALPHA_NUM:return 13;case ie.MODE_8BIT_BYTE:return 16;case ie.MODE_KANJI:return 12;default:throw"mode:"+a}else throw"type:"+i},r.getLostPoint=function(a){let i=a.getModuleCount(),l=0;for(let d=0;d<i;d+=1)for(let f=0;f<i;f+=1){let v=0,w=a.isDark(d,f);for(let u=-1;u<=1;u+=1)if(!(d+u<0||i<=d+u))for(let $=-1;$<=1;$+=1)f+$<0||i<=f+$||u==0&&$==0||w==a.isDark(d+u,f+$)&&(v+=1);v>5&&(l+=3+v-5)}for(let d=0;d<i-1;d+=1)for(let f=0;f<i-1;f+=1){let v=0;a.isDark(d,f)&&(v+=1),a.isDark(d+1,f)&&(v+=1),a.isDark(d,f+1)&&(v+=1),a.isDark(d+1,f+1)&&(v+=1),(v==0||v==4)&&(l+=3)}for(let d=0;d<i;d+=1)for(let f=0;f<i-6;f+=1)a.isDark(d,f)&&!a.isDark(d,f+1)&&a.isDark(d,f+2)&&a.isDark(d,f+3)&&a.isDark(d,f+4)&&!a.isDark(d,f+5)&&a.isDark(d,f+6)&&(l+=40);for(let d=0;d<i;d+=1)for(let f=0;f<i-6;f+=1)a.isDark(f,d)&&!a.isDark(f+1,d)&&a.isDark(f+2,d)&&a.isDark(f+3,d)&&a.isDark(f+4,d)&&!a.isDark(f+5,d)&&a.isDark(f+6,d)&&(l+=40);let c=0;for(let d=0;d<i;d+=1)for(let f=0;f<i;f+=1)a.isDark(f,d)&&(c+=1);let h=Math.abs(100*c/i/i-50)/5;return l+=h*10,l},r})(),Te=(function(){let s=new Array(256),n=new Array(256);for(let t=0;t<8;t+=1)s[t]=1<<t;for(let t=8;t<256;t+=1)s[t]=s[t-4]^s[t-5]^s[t-6]^s[t-8];for(let t=0;t<255;t+=1)n[s[t]]=t;let e={};return e.glog=function(t){if(t<1)throw"glog("+t+")";return n[t]},e.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return s[t]},e})(),dt=function(s,n){if(typeof s.length>"u")throw s.length+"/"+n;let e=(function(){let r=0;for(;r<s.length&&s[r]==0;)r+=1;let o=new Array(s.length-r+n);for(let a=0;a<s.length-r;a+=1)o[a]=s[a+r];return o})(),t={};return t.getAt=function(r){return e[r]},t.getLength=function(){return e.length},t.multiply=function(r){let o=new Array(t.getLength()+r.getLength()-1);for(let a=0;a<t.getLength();a+=1)for(let i=0;i<r.getLength();i+=1)o[a+i]^=Te.gexp(Te.glog(t.getAt(a))+Te.glog(r.getAt(i)));return dt(o,0)},t.mod=function(r){if(t.getLength()-r.getLength()<0)return t;let o=Te.glog(t.getAt(0))-Te.glog(r.getAt(0)),a=new Array(t.getLength());for(let i=0;i<t.getLength();i+=1)a[i]=t.getAt(i);for(let i=0;i<r.getLength();i+=1)a[i]^=Te.gexp(Te.glog(r.getAt(i))+o);return dt(a,0).mod(r)},t},cr=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],n=function(r,o){let a={};return a.totalCount=r,a.dataCount=o,a},e={},t=function(r,o){switch(o){case lt.L:return s[(r-1)*4+0];case lt.M:return s[(r-1)*4+1];case lt.Q:return s[(r-1)*4+2];case lt.H:return s[(r-1)*4+3];default:return}};return e.getRSBlocks=function(r,o){let a=t(r,o);if(typeof a>"u")throw"bad rs block @ typeNumber:"+r+"/errorCorrectionLevel:"+o;let i=a.length/3,l=[];for(let c=0;c<i;c+=1){let h=a[c*3+0],d=a[c*3+1],f=a[c*3+2];for(let v=0;v<h;v+=1)l.push(n(d,f))}return l},e})(),hr=function(){let s=[],n=0,e={};return e.getBuffer=function(){return s},e.getAt=function(t){let r=Math.floor(t/8);return(s[r]>>>7-t%8&1)==1},e.put=function(t,r){for(let o=0;o<r;o+=1)e.putBit((t>>>r-o-1&1)==1)},e.getLengthInBits=function(){return n},e.putBit=function(t){let r=Math.floor(n/8);s.length<=r&&s.push(0),t&&(s[r]|=128>>>n%8),n+=1},e},Bi=function(s){let n=ie.MODE_NUMBER,e=s,t={};t.getMode=function(){return n},t.getLength=function(a){return e.length},t.write=function(a){let i=e,l=0;for(;l+2<i.length;)a.put(r(i.substring(l,l+3)),10),l+=3;l<i.length&&(i.length-l==1?a.put(r(i.substring(l,l+1)),4):i.length-l==2&&a.put(r(i.substring(l,l+2)),7))};let r=function(a){let i=0;for(let l=0;l<a.length;l+=1)i=i*10+o(a.charAt(l));return i},o=function(a){if("0"<=a&&a<="9")return a.charCodeAt(0)-48;throw"illegal char :"+a};return t},Ni=function(s){let n=ie.MODE_ALPHA_NUM,e=s,t={};t.getMode=function(){return n},t.getLength=function(o){return e.length},t.write=function(o){let a=e,i=0;for(;i+1<a.length;)o.put(r(a.charAt(i))*45+r(a.charAt(i+1)),11),i+=2;i<a.length&&o.put(r(a.charAt(i)),6)};let r=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;if("A"<=o&&o<="Z")return o.charCodeAt(0)-65+10;switch(o){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+o}};return t},Ii=function(s){let n=ie.MODE_8BIT_BYTE,e=s,t=Fe.stringToBytes(s),r={};return r.getMode=function(){return n},r.getLength=function(o){return t.length},r.write=function(o){for(let a=0;a<t.length;a+=1)o.put(t[a],8)},r},Oi=function(s){let n=ie.MODE_KANJI,e=s,t=Fe.stringToBytes;(function(a,i){let l=t(a);if(l.length!=2||(l[0]<<8|l[1])!=i)throw"sjis not supported."})("友",38726);let r=t(s),o={};return o.getMode=function(){return n},o.getLength=function(a){return~~(r.length/2)},o.write=function(a){let i=r,l=0;for(;l+1<i.length;){let c=(255&i[l])<<8|255&i[l+1];if(33088<=c&&c<=40956)c-=33088;else if(57408<=c&&c<=60351)c-=49472;else throw"illegal char at "+(l+1)+"/"+c;c=(c>>>8&255)*192+(c&255),a.put(c,13),l+=2}if(l<i.length)throw"illegal char at "+(l+1)},o},pr=function(){let s=[],n={};return n.writeByte=function(e){s.push(e&255)},n.writeShort=function(e){n.writeByte(e),n.writeByte(e>>>8)},n.writeBytes=function(e,t,r){t=t||0,r=r||e.length;for(let o=0;o<r;o+=1)n.writeByte(e[o+t])},n.writeString=function(e){for(let t=0;t<e.length;t+=1)n.writeByte(e.charCodeAt(t))},n.toByteArray=function(){return s},n.toString=function(){let e="";e+="[";for(let t=0;t<s.length;t+=1)t>0&&(e+=","),e+=s[t];return e+="]",e},n},zi=function(){let s=0,n=0,e=0,t="",r={},o=function(i){t+=String.fromCharCode(a(i&63))},a=function(i){if(i<0)throw"n:"+i;if(i<26)return 65+i;if(i<52)return 97+(i-26);if(i<62)return 48+(i-52);if(i==62)return 43;if(i==63)return 47;throw"n:"+i};return r.writeByte=function(i){for(s=s<<8|i&255,n+=8,e+=1;n>=6;)o(s>>>n-6),n-=6},r.flush=function(){if(n>0&&(o(s<<6-n),s=0,n=0),e%3!=0){let i=3-e%3;for(let l=0;l<i;l+=1)t+="="}},r.toString=function(){return t},r},Ui=function(s){let n=s,e=0,t=0,r=0,o={};o.read=function(){for(;r<8;){if(e>=n.length){if(r==0)return-1;throw"unexpected end of file./"+r}let l=n.charAt(e);if(e+=1,l=="=")return r=0,-1;if(l.match(/^\s$/))continue;t=t<<6|a(l.charCodeAt(0)),r+=6}let i=t>>>r-8&255;return r-=8,i};let a=function(i){if(65<=i&&i<=90)return i-65;if(97<=i&&i<=122)return i-97+26;if(48<=i&&i<=57)return i-48+52;if(i==43)return 62;if(i==47)return 63;throw"c:"+i};return o},Hi=function(s,n){let e=s,t=n,r=new Array(s*n),o={};o.setPixel=function(c,h,d){r[h*e+c]=d},o.write=function(c){c.writeString("GIF87a"),c.writeShort(e),c.writeShort(t),c.writeByte(128),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(255),c.writeByte(255),c.writeByte(255),c.writeString(","),c.writeShort(0),c.writeShort(0),c.writeShort(e),c.writeShort(t),c.writeByte(0);let h=2,d=i(h);c.writeByte(h);let f=0;for(;d.length-f>255;)c.writeByte(255),c.writeBytes(d,f,255),f+=255;c.writeByte(d.length-f),c.writeBytes(d,f,d.length-f),c.writeByte(0),c.writeString(";")};let a=function(c){let h=c,d=0,f=0,v={};return v.write=function(w,u){if(w>>>u)throw"length over";for(;d+u>=8;)h.writeByte(255&(w<<d|f)),u-=8-d,w>>>=8-d,f=0,d=0;f=w<<d|f,d=d+u},v.flush=function(){d>0&&h.writeByte(f)},v},i=function(c){let h=1<<c,d=(1<<c)+1,f=c+1,v=l();for(let C=0;C<h;C+=1)v.add(String.fromCharCode(C));v.add(String.fromCharCode(h)),v.add(String.fromCharCode(d));let w=pr(),u=a(w);u.write(h,f);let $=0,A=String.fromCharCode(r[$]);for($+=1;$<r.length;){let C=String.fromCharCode(r[$]);$+=1,v.contains(A+C)?A=A+C:(u.write(v.indexOf(A),f),v.size()<4095&&(v.size()==1<<f&&(f+=1),v.add(A+C)),A=C)}return u.write(v.indexOf(A),f),u.write(d,f),u.flush(),w.toByteArray()},l=function(){let c={},h=0,d={};return d.add=function(f){if(d.contains(f))throw"dup key:"+f;c[f]=h,h+=1},d.size=function(){return h},d.indexOf=function(f){return c[f]},d.contains=function(f){return typeof c[f]<"u"},d};return o},ji=function(s,n,e){let t=Hi(s,n);for(let i=0;i<n;i+=1)for(let l=0;l<s;l+=1)t.setPixel(l,i,e(l,i));let r=pr();t.write(r);let o=zi(),a=r.toByteArray();for(let i=0;i<a.length;i+=1)o.writeByte(a[i]);return o.flush(),"data:image/gif;base64,"+o},ur=Fe,wa=Fe.stringToBytes;function fr(s){let n=ur(0,"M");n.addData(s),n.make();let e=n.getModuleCount(),t="";for(let r=0;r<e;r++)for(let o=0;o<e;o++)n.isDark(r,o)&&(t+=`M${o} ${r}h1v1h-1z`);return{size:e,d:t}}var qi=1e4,ct=class extends ce{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,t){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,t))}async newCode(){try{let e=await lr();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof Ue&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),qi)}}async poll(e){let t=this.secret;if(t)try{let r=await dr(t,location.origin);if(!this.running||t!==this.secret)return;if(this.problem=null,r.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:r.auth}));return}if(r.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return T;let{size:e,d:t}=fr(ar(location.origin,this.code));return p`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${Q`<path d=${t} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return p`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?or(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Cn}?${Tn}</span> and type the code.
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
    </div>`}};ct.styles=Me`
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
  `,ct.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",ct);var An="hassTokens";function gr(){try{let s=localStorage.getItem(An);return s?JSON.parse(s):null}catch{return null}}function En(s){try{s?localStorage.setItem(An,JSON.stringify(s)):localStorage.removeItem(An)}catch{}}function Ki(s){let n=document.getElementById("problem");n&&(n.hidden=!1,n.querySelector("p").textContent=s)}function Wi(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(n=>{let e=t=>{s.stop(),s.hidden=!0,n(t)};s.addEventListener("paired",t=>e(t.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function Fi(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let n=location.search.includes("auth_callback");if(!n&&!gr()){let e=await Wi();e&&En(e)}try{let e=await Fn({hassUrl:location.origin,loadTokens:async()=>gr(),saveTokens:En});n&&history.replaceState(null,"",location.pathname+wn(location.search));let t=await Vn({auth:e});s.backend=new gt(t),t.addEventListener("reconnect-error",(r,o)=>{o===2&&mr()})}catch(e){if(e===2){mr();return}Ki(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function mr(){En(null),location.replace(location.pathname+wn(location.search))}var xr=rt(location.search),br=document.querySelector("mydashlight-keyboard");br&&xr.keyboard!==!1&&ir(br);xr.cursor!=="show"&&Zs();Fi();
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
