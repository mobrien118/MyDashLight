function Vt(s){return{type:"auth",access_token:s}}function Wt(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Kt(s){let t={type:"subscribe_events"};return s&&(t.event_type=s),t}function ft(s){return{type:"unsubscribe_events",subscription:s}}function Ft(){return{type:"ping"}}function Gt(s,t){return{type:"result",success:!1,error:{code:s,message:t}}}function Jt(s){let t={},e=s.split("&");for(let n=0;n<e.length;n++){let i=e[n].split("="),r=decodeURIComponent(i[0]),a=i.length>1?decodeURIComponent(i[1]):void 0;t[r]=a}return t}var Xt=(s,t,e,n)=>{let[i,r,a]=s.split(".",3);return Number(i)>t||Number(i)===t&&(n===void 0?Number(r)>=e:Number(r)>e)||n!==void 0&&Number(i)===t&&Number(r)===e&&Number(a)>=n};var Ve=!1,Qn="auth_required",Zn="auth_invalid",es="auth_ok";function Zt(s){if(!s.auth)throw 4;let t=s.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,n=t.wsUrl;Ve&&console.log("[Auth phase] Initializing",n);function i(r,a,o){Ve&&console.log("[Auth Phase] New connection",n);let l=new WebSocket(n),p=!1,g=()=>{if(l.removeEventListener("close",g),p){o(2);return}if(r===0){o(1);return}let f=r===-1?-1:r-1;setTimeout(()=>i(f,a,o),1e3)},h=async f=>{try{t.expired&&await(e||t.refreshAccessToken()),l.send(JSON.stringify(Vt(t.accessToken)))}catch(x){p=x===2,l.close()}},b=async f=>{let x=JSON.parse(f.data);switch(Ve&&console.log("[Auth phase] Received",x),x.type){case Zn:p=!0,l.close();break;case es:l.removeEventListener("open",h),l.removeEventListener("message",b),l.removeEventListener("close",g),l.removeEventListener("error",g),l.haVersion=x.ha_version,Xt(l.haVersion,2022,9)&&l.send(JSON.stringify(Wt())),a(l);break;default:Ve&&x.type!==Qn&&console.warn("[Auth phase] Unhandled message",x)}};l.addEventListener("open",h),l.addEventListener("message",b),l.addEventListener("close",g),l.addEventListener("error",g)}return new Promise((r,a)=>i(s.setupRetry,r,a))}var Ne=!1,We=class{constructor(t,e){this._handleMessage=n=>{let i=JSON.parse(n.data);Array.isArray(i)||(i=[i]),i.forEach(r=>{Ne&&console.log("Received",r);let a=this.commands.get(r.id);switch(r.type){case"event":a?a.callback(r.event):(console.warn(`Received event for unknown subscription ${r.id}. Unsubscribing.`),this.sendMessagePromise(ft(r.id)).catch(o=>{Ne&&console.warn(` Error unsubsribing from unknown subscription ${r.id}`,o)}));break;case"result":a&&(r.success?(a.resolve(r.result),"subscribe"in a||this.commands.delete(r.id)):(a.reject(r.error),this.commands.delete(r.id)));break;case"pong":a?(a.resolve(),this.commands.delete(r.id)):console.warn(`Received unknown pong response ${r.id}`);break;default:Ne&&console.warn("Unhandled message",r)}})},this._handleClose=async()=>{let n=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,n.forEach(a=>{"subscribe"in a||a.reject(Gt(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),r=a=>{setTimeout(async()=>{if(!this.closeRequested){Ne&&console.log("Trying to reconnect");try{let o=await i.createSocket(i);this._setSocket(o)}catch(o){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let p of l)p.reject&&p.reject(3)}o===2?this.fireEvent("reconnect-error",o):r(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),r(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(r=>{i.unsubscribe=r,i.resolve()})}));let n=this._queuedMessages;if(n){this._queuedMessages=void 0;for(let i of n)i.resolve()}this.fireEvent("ready")}addEventListener(t,e){let n=this.eventListeners.get(t);n||(n=[],this.eventListeners.set(t,n)),n.push(e)}removeEventListener(t,e){let n=this.eventListeners.get(t);if(!n)return;let i=n.indexOf(e);i!==-1&&n.splice(i,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(n=>n(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,Kt(e))}ping(){return this.sendMessagePromise(Ft())}sendMessage(t,e){if(!this.connected)throw 3;if(Ne&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,n)=>{if(this._queuedMessages){this._queuedMessages.push({reject:n,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(r){n(r)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:n}),this.sendMessage(t,i)})}async subscribeMessage(t,e,n){if(this._queuedMessages&&await new Promise((r,a)=>{this._queuedMessages.push({resolve:r,reject:a})}),n?.preCheck&&!await n.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((r,a)=>{let o=this._genCmdId();i={resolve:r,reject:a,callback:t,subscribe:n?.resubscribe!==!1?()=>this.subscribeMessage(t,e,n):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(ft(o)),this.commands.delete(o)}},this.commands.set(o,i);try{this.sendMessage(e,o)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var ts=()=>`${location.protocol}//${location.host}/`,ns=s=>s*1e3+Date.now();function ss(){let{protocol:s,host:t,pathname:e,search:n}=location;return`${s}//${t}${e}${n}`}function is(s,t,e,n){let i=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(i+=`&client_id=${encodeURIComponent(t)}`),n&&(i+=`&state=${encodeURIComponent(n)}`),i}function rs(s,t,e,n){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=is(s,t,e,n)}async function nn(s,t,e){let n=typeof location<"u"&&location;if(n&&n.protocol==="https:"){let o=document.createElement("a");if(o.href=s,o.protocol==="http:"&&o.hostname!=="localhost")throw 5}let i=new FormData;t!==null&&i.append("client_id",t),Object.keys(e).forEach(o=>{i.append(o,e[o])});let r=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!r.ok)throw r.status===400||r.status===403?2:new Error("Unable to fetch tokens");let a=await r.json();return a.hassUrl=s,a.clientId=t,a.expires=ns(a.expires_in),a}function tn(s,t,e){return nn(s,t,{code:e,grant_type:"authorization_code"})}function os(s){return btoa(JSON.stringify(s))}function as(s){return JSON.parse(atob(s))}var bt=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await nn(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function sn(s={}){let t,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let n=s.clientId!==void 0?s.clientId:ts(),i=s.limitHassInstance===!0;if(s.authCode&&e&&(t=await tn(e,n,s.authCode),s.saveTokens&&s.saveTokens(t)),!t){let r=Jt(location.search.substr(1));if("auth_callback"in r){let a=as(r.state);if(i&&(a.hassUrl!==e||a.clientId!==n))throw 6;t=await tn(a.hassUrl,a.clientId,r.code),s.saveTokens&&s.saveTokens(t)}}if(!t&&s.loadTokens&&(t=await s.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new bt(t,s.saveTokens);if(e===void 0)throw 4;return rs(e,n,s.redirectUrl||ss(),os({hassUrl:e,clientId:n})),new Promise(()=>{})}async function rn(s){let t=Object.assign({setupRetry:0,createSocket:Zt},s),e=await t.createSocket(t);return new We(e,t)}function k(s){let t=Math.round(s),e=Math.floor(t/60),n=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${n<10?"0":""}${n}`}function De(s){let t=Math.floor(Math.round(s)/60)%24;return`${k(s)} ${t<12?"AM":"PM"}`}function on(s){let t=Math.floor(s/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Ie(s){let t=Math.max(0,Math.round(s)),e=Math.floor(t/60),n=t%60;return e?n?`${e} hr ${n} min`:`${e} hr`:`${n} min`}function an(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var ls=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),ds=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),cs=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Ke(s){return new Date(`${s}T12:00:00Z`)}function Ee(s){let t=Ke(s);return`${ls.format(t)}, ${cs.format(t)}`}function le(s){return ds.format(Ke(s))}function Fe(s,t){return Math.round((Ke(t).getTime()-Ke(s).getTime())/864e5)}function ze(s,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return ze("UTC",t)}let n=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${n("year")}-${n("month")}-${n("day")}`,minutes:Number(n("hour"))*60+Number(n("minute"))}}function Ge(s,t,e){let n=Math.floor((t.getTime()-s.getTime())/6e4);if(n<1)return"just now";if(n<60)return`${n} min ago`;let i=ze(e,s),r=ze(e,t).date;return i.date===r?`at ${De(i.minutes)}`:`on ${le(i.date)} at ${De(i.minutes)}`}var G=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},mt="mydashlight",ps=7,hs=3e4;function ln(s){if(s instanceof G)return s;if(s&&typeof s=="object"){let t=s;if(typeof t.message=="string")return new G(String(t.code??"error"),t.message)}return typeof s=="number"?new G("connection_lost","Lost the connection to Home Assistant."):new G("error",String(s))}var Ye=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new G("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let n={onPlan:t,onError:e};return this.listeners.add(n),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(n),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},hs),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new G("not_running","MyDashLight isn’t running right now."))},{type:`${mt}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:mt,service:"get_plan",service_data:{days:ps},return_response:!0});this.emit(t.response)}catch(t){this.fail(ln(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:mt,service:t,service_data:e})}catch(n){throw ln(n)}this.pushing||await this.refresh()}setRide(t,e,n,i){return this.call("set_ride",{event:t,side:e,driver:n,scope:i})}setStay(t,e,n){return this.call("set_stay",{event:t,stay:e,scope:n})}setAttending(t,e,n){return this.call("set_attending",{event:t,attending:e,scope:n})}setArriveBy(t,e,n){return this.call("set_arrive_by",e==null?{event:t,scope:n}:{event:t,time:an(e),scope:n})}setTakeAlong(t,e,n){return this.call("set_take_along",{event:t,kids:e,scope:n})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}};var Je=globalThis,Xe=Je.ShadowRoot&&(Je.ShadyCSS===void 0||Je.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xt=Symbol(),dn=new WeakMap,Le=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==xt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Xe&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=dn.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&dn.set(e,t))}return t}toString(){return this.cssText}},cn=s=>new Le(typeof s=="string"?s:s+"",void 0,xt),vt=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,i,r)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new Le(e,s,xt)},pn=(s,t)=>{if(Xe)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),i=Je.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=e.cssText,s.appendChild(n)}},yt=Xe?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return cn(e)})(s):s;var{is:us,defineProperty:gs,getOwnPropertyDescriptor:fs,getOwnPropertyNames:bs,getOwnPropertySymbols:ms,getPrototypeOf:xs}=Object,Qe=globalThis,hn=Qe.trustedTypes,vs=hn?hn.emptyScript:"",ys=Qe.reactiveElementPolyfillSupport,Ue=(s,t)=>s,wt={toAttribute(s,t){switch(t){case Boolean:s=s?vs:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},gn=(s,t)=>!us(s,t),un={attribute:!0,type:String,converter:wt,reflect:!1,useDefault:!1,hasChanged:gn};Symbol.metadata??=Symbol("metadata"),Qe.litPropertyMetadata??=new WeakMap;var se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=un){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(t,n,e);i!==void 0&&gs(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){let{get:i,set:r}=fs(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);r?.call(this,a),this.requestUpdate(t,o,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??un}static _$Ei(){if(this.hasOwnProperty(Ue("elementProperties")))return;let t=xs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ue("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ue("properties"))){let e=this.properties,n=[...bs(e),...ms(e)];for(let i of n)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,i]of e)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let i=this._$Eu(e,n);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)e.unshift(yt(i))}else t!==void 0&&e.push(yt(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pn(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){let r=(n.converter?.toAttribute!==void 0?n.converter:wt).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=n.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:wt;this._$Em=i;let o=a.fromAttribute(e,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,n,i=!1,r){if(t!==void 0){let a=this.constructor;if(i===!1&&(r=this[t]),n??=a.getPropertyOptions(t),!((n.hasChanged??gn)(r,e)||n.useDefault&&n.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:r},a){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),r!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,r]of n){let{wrapped:a}=r,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};se.elementStyles=[],se.shadowRootOptions={mode:"open"},se[Ue("elementProperties")]=new Map,se[Ue("finalized")]=new Map,ys?.({ReactiveElement:se}),(Qe.reactiveElementVersions??=[]).push("2.1.2");var kt=globalThis,fn=s=>s,Ze=kt.trustedTypes,bn=Ze?Ze.createPolicy("lit-html",{createHTML:s=>s}):void 0,_t="$lit$",ie=`lit$${Math.random().toFixed(9).slice(2)}$`,At="?"+ie,ws=`<${At}>`,xe=document,Be=()=>xe.createComment(""),He=s=>s===null||typeof s!="object"&&typeof s!="function",Et=Array.isArray,$n=s=>Et(s)||typeof s?.[Symbol.iterator]=="function",$t=`[ 	
\f\r]`,Oe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mn=/-->/g,xn=/>/g,be=RegExp(`>|${$t}(?:([^\\s"'>=/]+)(${$t}*=${$t}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vn=/'/g,yn=/"/g,kn=/^(?:script|style|textarea|title)$/i,Tt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),c=Tt(1),Pe=Tt(2),Ci=Tt(3),re=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),wn=new WeakMap,me=xe.createTreeWalker(xe,129);function _n(s,t){if(!Et(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return bn!==void 0?bn.createHTML(t):t}var An=(s,t)=>{let e=s.length-1,n=[],i,r=t===2?"<svg>":t===3?"<math>":"",a=Oe;for(let o=0;o<e;o++){let l=s[o],p,g,h=-1,b=0;for(;b<l.length&&(a.lastIndex=b,g=a.exec(l),g!==null);)b=a.lastIndex,a===Oe?g[1]==="!--"?a=mn:g[1]!==void 0?a=xn:g[2]!==void 0?(kn.test(g[2])&&(i=RegExp("</"+g[2],"g")),a=be):g[3]!==void 0&&(a=be):a===be?g[0]===">"?(a=i??Oe,h=-1):g[1]===void 0?h=-2:(h=a.lastIndex-g[2].length,p=g[1],a=g[3]===void 0?be:g[3]==='"'?yn:vn):a===yn||a===vn?a=be:a===mn||a===xn?a=Oe:(a=be,i=void 0);let f=a===be&&s[o+1].startsWith("/>")?" ":"";r+=a===Oe?l+ws:h>=0?(n.push(p),l.slice(0,h)+_t+l.slice(h)+ie+f):l+ie+(h===-2?o:f)}return[_n(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},qe=class s{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let r=0,a=0,o=t.length-1,l=this.parts,[p,g]=An(t,e);if(this.el=s.createElement(p,n),me.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=me.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(_t)){let b=g[a++],f=i.getAttribute(h).split(ie),x=/([.?@])?(.*)/.exec(b);l.push({type:1,index:r,name:x[2],strings:f,ctor:x[1]==="."?tt:x[1]==="?"?nt:x[1]==="@"?st:ye}),i.removeAttribute(h)}else h.startsWith(ie)&&(l.push({type:6,index:r}),i.removeAttribute(h));if(kn.test(i.tagName)){let h=i.textContent.split(ie),b=h.length-1;if(b>0){i.textContent=Ze?Ze.emptyScript:"";for(let f=0;f<b;f++)i.append(h[f],Be()),me.nextNode(),l.push({type:2,index:++r});i.append(h[b],Be())}}}else if(i.nodeType===8)if(i.data===At)l.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(ie,h+1))!==-1;)l.push({type:7,index:r}),h+=ie.length-1}r++}}static createElement(t,e){let n=xe.createElement("template");return n.innerHTML=t,n}};function ve(s,t,e=s,n){if(t===re)return t;let i=n!==void 0?e._$Co?.[n]:e._$Cl,r=He(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=i:e._$Cl=i),i!==void 0&&(t=ve(s,i._$AS(s,t.values),i,n)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??xe).importNode(e,!0);me.currentNode=i;let r=me.nextNode(),a=0,o=0,l=n[0];for(;l!==void 0;){if(a===l.index){let p;l.type===2?p=new Te(r,r.nextSibling,this,t):l.type===1?p=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(p=new it(r,this,t)),this._$AV.push(p),l=n[++o]}a!==l?.index&&(r=me.nextNode(),a++)}return me.currentNode=xe,i}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},Te=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ve(this,t,e),He(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==re&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):$n(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&He(this._$AH)?this._$AA.nextSibling.data=t:this.T(xe.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=qe.createElement(_n(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new et(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(t){let e=wn.get(t.strings);return e===void 0&&wn.set(t.strings,e=new qe(t)),e}k(t){Et(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,i=0;for(let r of t)i===e.length?e.push(n=new s(this.O(Be()),this.O(Be()),this,this.options)):n=e[i],n._$AI(r),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=fn(t).nextSibling;fn(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ye=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,r){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=v}_$AI(t,e=this,n,i){let r=this.strings,a=!1;if(r===void 0)t=ve(this,t,e,0),a=!He(t)||t!==this._$AH&&t!==re,a&&(this._$AH=t);else{let o=t,l,p;for(t=r[0],l=0;l<r.length-1;l++)p=ve(this,o[n+l],e,l),p===re&&(p=this._$AH[l]),a||=!He(p)||p!==this._$AH[l],p===v?t=v:t!==v&&(t+=(p??"")+r[l+1]),this._$AH[l]=p}a&&!i&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},tt=class extends ye{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}},nt=class extends ye{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}},st=class extends ye{constructor(t,e,n,i,r){super(t,e,n,i,r),this.type=5}_$AI(t,e=this){if((t=ve(this,t,e,0)??v)===re)return;let n=this._$AH,i=t===v&&n!==v||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==v&&(n===v||i);i&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},it=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){ve(this,t)}},En={M:_t,P:ie,A:At,C:1,L:An,R:et,D:$n,V:ve,I:Te,H:ye,N:nt,U:st,B:tt,F:it},$s=kt.litHtmlPolyfillSupport;$s?.(qe,Te),(kt.litHtmlVersions??=[]).push("3.3.3");var Tn=(s,t,e)=>{let n=e?.renderBefore??t,i=n._$litPart$;if(i===void 0){let r=e?.renderBefore??null;n._$litPart$=i=new Te(t.insertBefore(Be(),r),r,void 0,e??{})}return i._$AI(s),i};var Pt=globalThis,de=class extends se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Tn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return re}};de._$litElement$=!0,de.finalized=!0,Pt.litElementHydrateSupport?.({LitElement:de});var ks=Pt.litElementPolyfillSupport;ks?.({LitElement:de});(Pt.litElementVersions??=[]).push("4.2.2");var Pn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Sn=s=>(...t)=>({_$litDirective$:s,values:t}),rt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:_s}=En,Mn=s=>s;var Cn=()=>document.createComment(""),Se=(s,t,e)=>{let n=s._$AA.parentNode,i=t===void 0?s._$AB:t._$AA;if(e===void 0){let r=n.insertBefore(Cn(),i),a=n.insertBefore(Cn(),i);e=new _s(r,a,s,s.options)}else{let r=e._$AB.nextSibling,a=e._$AM,o=a!==s;if(o){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(r!==i||o){let l=e._$AA;for(;l!==r;){let p=Mn(l).nextSibling;Mn(n).insertBefore(l,i),l=p}}}return e},ce=(s,t,e=s)=>(s._$AI(t,e),s),As={},Rn=(s,t=As)=>s._$AH=t,Nn=s=>s._$AH,ot=s=>{s._$AR(),s._$AA.remove()};var Dn=(s,t,e)=>{let n=new Map;for(let i=t;i<=e;i++)n.set(s[i],i);return n},X=Sn(class extends rt{constructor(s){if(super(s),s.type!==Pn.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,t,e){let n;e===void 0?e=t:t!==void 0&&(n=t);let i=[],r=[],a=0;for(let o of s)i[a]=n?n(o,a):a,r[a]=e(o,a),a++;return{values:r,keys:i}}render(s,t,e){return this.dt(s,t,e).values}update(s,[t,e,n]){let i=Nn(s),{values:r,keys:a}=this.dt(t,e,n);if(!Array.isArray(i))return this.ut=a,r;let o=this.ut??=[],l=[],p,g,h=0,b=i.length-1,f=0,x=r.length-1;for(;h<=b&&f<=x;)if(i[h]===null)h++;else if(i[b]===null)b--;else if(o[h]===a[f])l[f]=ce(i[h],r[f]),h++,f++;else if(o[b]===a[x])l[x]=ce(i[b],r[x]),b--,x--;else if(o[h]===a[x])l[x]=ce(i[h],r[x]),Se(s,l[x+1],i[h]),h++,x--;else if(o[b]===a[f])l[f]=ce(i[b],r[f]),Se(s,i[h],i[b]),b--,f++;else if(p===void 0&&(p=Dn(a,f,x),g=Dn(o,h,b)),p.has(o[h]))if(p.has(o[b])){let u=g.get(a[f]),y=u!==void 0?i[u]:null;if(y===null){let T=Se(s,i[h]);ce(T,r[f]),l[f]=T}else l[f]=ce(y,r[f]),Se(s,i[h],y),i[u]=null;f++}else ot(i[b]),b--;else ot(i[h]),h++;for(;f<=x;){let u=Se(s,l[x+1]);ce(u,r[f]),l[f++]=u}for(;h<=b;){let u=i[h++];u!==null&&ot(u)}return this.ut=a,Rn(s,l),re}});var at=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function Y(s){return at[(s%at.length+at.length)%at.length]}var zn="#23272E",In="35,39,46";var Es=3,ht=36,St=12,Ts=8,Mt=60,Ct=10,dt=30,Rt=10,Ps=150,Ss=200,pt=1.4;function Dt(s,t){let e=Math.max(Ps,Ss/pt);return Math.ceil(Mt+Math.max(0,s-1)*Ct+dt+Math.max(0,t-1)*Rt+e*(s+pt*t))}function $e(s){return s.people?s.people.kids.map(t=>t.id):s.days.length?Object.keys(s.days[0].kids):[]}function pe(s){return s.people?s.people.drivers.map(t=>t.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ke(s){return new Map($e(s).map((t,e)=>[t,Y(e)]))}function F(s,t){let e=s.people?.kids.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.kids[t])return n.kids[t].name;return t}function he(s,t){let e=s.people?.drivers.find(n=>n.id===t);if(e)return e.name;for(let n of s.days)if(n.drivers[t])return n.drivers[t].name;return t}function zt(s,t){return t==="none"?"Not needed":pe(s).includes(t)?he(s,t):t}function Ms(s){let t=new Map([["home","Home"]]);for(let e of s.days)for(let n of e.events)t.set(n.place,n.short_place||n.place_name||n.place);return t}function ct(s,t){return t?s.get(t)??(t.split(",")[0]?.trim()||t):""}function lt(s,t){let e=[];for(let n of s)n.type==="drive"?(e.length||e.push(ct(t,n.from)),e.push(ct(t,n.to))):(n.type==="wait"||n.type==="stay")&&(e.length||e.push(ct(t,n.place)),n.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function Cs(s){let t=s.map(a=>({...a,col:0,cols:1})).sort((a,o)=>a.s-o.s||o.en-a.en),e=[],n=[],i=-1/0,r=()=>{for(let a of e)a.cols=n.length;e=[],n=[]};for(let a of t){a.s>=i&&(r(),i=-1/0);let o=n.findIndex(l=>l<=a.s);o<0?(o=n.length,n.push(a.en)):n[o]=a.en,a.col=o,e.push(a),i=Math.max(i,a.en)}return r(),t}function Rs(s,t){if(!s.length)return 0;if(t<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.t)return i.t===n.t?n.y:Math.round(n.y+(t-n.t)/(i.t-n.t)*(i.y-n.y))}return s[s.length-1].y}function Ns(s,t){if(!s.length)return 0;if(t<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let n=s[e],i=s[e+1];if(t<=i.y)return i.y===n.y?n.t:n.t+(t-n.y)/(i.y-n.y)*(i.t-n.t)}return s[s.length-1].t}function On(s,t){return Rs(s.anchors,t)}function Bn(s,t){return Ns(s.anchors,t)}function Ds(s,t){let e=$e(s),n=pe(s),i=Math.max(t,Dt(e.length,n.length)),a=(i-Mt-Math.max(0,e.length-1)*Ct-dt-Math.max(0,n.length-1)*Rt)/(e.length+pt*n.length||1),o=Math.floor(a),l=Math.floor(a*pt),p=new Map;for(let x of s.days)for(let u of x.events){let y=p.get(u.kid)??[];y.some(T=>T.event_id===u.event_id&&T.calendar_id===u.calendar_id)||y.push(u),p.set(u.kid,y)}let g=ke(s),h=[],b=Mt;e.forEach((x,u)=>{let y=p.get(x)??[],T=s.days.some(m=>m.events.some(D=>D.kid===x&&(D.sides.includes("drop")&&D.drop===""||D.sides.includes("pick")&&D.pick==="")));h.push({id:x,kind:"kid",x:b,w:o,name:F(s,x),dot:g.get(x).color,rgb:g.get(x).rgb,sub:`${T?"Needs a ride · ":""}${y.length} this week`,subWarn:T}),b+=o+(u<e.length-1?Ct:0)});let f=b+dt/2;return b+=dt,n.forEach((x,u)=>{let y=0,T=0;for(let m of s.days){let D=m.drivers[x];D&&(y+=D.outings.length,T+=D.drive??0)}h.push({id:x,kind:"driver",x:b,w:l,name:he(s,x),dot:zn,rgb:In,sub:`${y} ${y===1?"trip":"trips"} this week · ${Ie(T)} driving`,subWarn:!1}),b+=l+(u<n.length-1?Rt:0)}),{columns:h,sepX:f,width:i}}function zs(s,t){let e=s.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(t.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let a=i.slice(r[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Ln(s,t){let e=s.start<=0,n=s.end>=1440;return e&&n?`${s.title} · all day`:n?`${s.title} from ${k(s.start)}`:e||!t?`${s.title} until ${k(s.end)}`:`${s.title} ${k(s.start)}–${k(s.end)}`}function It(s){return s.issues.filter(t=>t.level==="problem").length+s.clashes.length}function Is(s,t){let e=Fe(t,s);return e===0?"Today":e===1?"Tomorrow":""}function V(s,t=0){return s==null||!Number.isFinite(s)?t:s}function Nt(s,t,e=7){let n=Math.max(8,Math.floor(t/e)),i=1,r=0;for(let a of s.split(/\s+/).filter(Boolean)){let o=a.length;for(r===0?r=o:r+1+o<=n?r+=1+o:(i++,r=o);r>n;)i++,r-=n}return i}var Hn=25,qn=15,Lt=3;function Un(s){return Math.max(0,Math.min(Lt,Math.floor((s-Hn)/qn)))}function Ls(s,t){let e=Math.min(Lt,Nt(s,t-19,6.6));return Hn+e*qn+2}function Us(s,t){let e=t-23,n=`${k(s.start)}–${k(s.end)}`+(s.arrive_by!=null?` · arrive ${k(s.arrive_by)}`:""),i=33+Nt(n,e,6.6)*16;for(let r of[s.lines.drop,s.lines.pick])r&&(i+=2+Nt(r.text,e,7)*16);return i+4}function jn(s,t,e,n){let i=t==="compact",{columns:r,sepX:a,width:o}=Ds(s,e),l=new Map(r.map(m=>[m.id,m])),p=$e(s),g=pe(s),h=[...p,...g],b=ke(s),f=Ms(s),x=m=>F(s,m),u=m=>he(s,m),y={mode:t,width:o,height:0,columns:r,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},T=0;return s.days.forEach((m,D)=>{let K=D*1440,P=new Map(m.events.map(d=>[d.id,d])),O=d=>d&&P.has(d)?{day:m.date,event:d}:null,Q=It(m),ue=m.events.length,_e=Is(m.date,n.date);y.dayHeads.push({date:m.date,y:T,label:Ee(m.date),tag:_e,sub:(ue?`${ue} ${ue===1?"activity":"activities"}`:"Nothing scheduled")+(Q?` · ${Q} to sort out`:""),warn:Q>0}),y.anchors.push({t:K,y:T});let oe=T+ht+St,Me=g.flatMap(d=>m.drivers[d]?.outings??[]);if(!ue&&!Me.length){y.empties.push({key:m.date,y:oe,text:"Nothing planned"}),T=oe+40,y.anchors.push({t:K+1439,y:T});return}let M=(d,E,_,S,A,C,$)=>{let B=b.get(d.kid)??Y(0),H=d.lines;return{key:`${m.date}|card|${d.id}`,x:E,y:_,w:S,h:A,target:{day:m.date,event:d.id},event:d,color:B,kidName:x(d.kid),clash:C,stayed:d.stay&&g.includes(d.drop),skipped:d.attending===!1,title:zs(d.title,x(d.kid)),time:`${k(d.start)}–${k(d.end)}`+(d.arrive_by!=null?` · arrive ${k(d.arrive_by)}`:""),drop:H.drop,pick:H.pick,showDrop:!!H.drop&&($||A>=56),showPick:!!H.pick&&($||A>=74),wrap:$,aria:`${x(d.kid)}, ${d.title} ${k(d.start)} to ${k(d.end)}. `+(d.attending===!1&&!H.drop?"Not attending. ":"")+[H.drop,H.pick].filter(ne=>!!ne).map(ne=>ne.text).join(". ")}},Z=d=>{let E=m.rides[d];return E?(m.drivers[E.driver]?.segments??[]).filter(S=>S.type!=="home"&&S.kids.includes(E.kid)&&V(S.start)>=V(E.start)&&V(S.end)<=V(E.end)):[]},z=d=>{let E=m.rides[d];if(!E)return null;let _=E.serves.find(S=>P.get(S)?.kid===E.kid);return O(_??E.serves[0])},J=new Map;for(let d of m.issues)d.level!=="problem"||!d.event||(d.kind==="late"&&J.set(d.event,`${Math.round(V(d.minutes))} min late`),d.kind==="waiting"&&J.set(`${d.event}|pick`,`Waits ${Math.round(V(d.minutes))} min`));if(!i){let d=1/0,E=-1/0;for(let $ of m.events)d=Math.min(d,$.start-20,$.arrive_by!=null?$.arrive_by-10:1/0),E=Math.max(E,$.end+20);for(let $ of Me)$.start!=null&&(d=Math.min(d,$.start)),$.end!=null&&(E=Math.max(E,$.end));m.date===n.date&&Number.isFinite(d)&&n.minutes>d-60&&n.minutes<E&&(d=Math.min(d,n.minutes-15));let _=Number.isFinite(d)?Math.floor((d-5)/30)*30:900,S=Number.isFinite(E)?Math.ceil((E+5)/30)*30:960,A=$=>Math.round(oe+(Math.max(_,Math.min(S,$))-_)*Es);y.anchors.push({t:K+_,y:A(_)},{t:K+S,y:A(S)});for(let $ of p){let B=l.get($),H=b.get($),ne=(m.kids[$]?.items??[]).filter(R=>R.start!=null&&R.end!=null).map(R=>({item:R,s:V(R.start),en:V(R.end)}));for(let R of Cs(ne)){let w=B.w/R.cols,L=Math.round(B.x+R.col*w),I=Math.round(w-(R.cols>1?4:0)),q=A(R.s),ae=R.item;if(ae.type==="act"){let W=P.get(ae.event??"");if(!W)continue;let Bt=Math.max(30,A(R.en)-q);if(y.cards.push(M(W,L,q,I,Bt,ae.clash,!1)),W.arrive_by!=null&&W.start-W.arrive_by>=5){let jt=A(W.arrive_by);y.preps.push({key:`${m.date}|prep|${W.id}`,x:L,y:jt,w:I,h:q-jt+6,color:H,label:`Arrive by ${k(W.arrive_by)}`})}let Ht=J.get(W.id);Ht&&y.marks.push({key:`${m.date}|late|${W.id}`,x:L+I-4,y:q+4,text:Ht,right:!0});let qt=J.get(`${W.id}|pick`);qt&&y.marks.push({key:`${m.date}|wait|${W.id}`,x:L+4,y:q+Bt+2,text:qt,right:!1});continue}let j=m.rides[ae.ride??-1];if(!j)continue;let ge=Math.max(22,A(R.en)-q),Ce=lt(Z(j.index),f),U=u(j.driver);y.rides.push({key:`${m.date}|ride|${j.index}`,x:L,y:q,w:I,h:ge,target:z(j.index),l1:`${j.own?"In":"Along in"} ${U}’s car`,l2:Ce.join(" → "),show2:Un(ge)>0,lines2:Un(ge),dashed:!j.own,clash:ae.clash,aria:`${x($)} ${j.own?"in":"riding along in"} ${U}’s car, ${k(V(j.start))} to ${k(V(j.end))}: ${Ce.join(" to ")}`});let fe=l.get(j.driver);fe&&y.bands.push({key:`${m.date}|band|${j.index}`,x:L+I,y:q,w:Math.max(0,fe.x+8-(L+I)),h:ge,color:H})}}for(let $ of g){let B=l.get($),H=m.drivers[$];if(!H)continue;let ne=[],R=null;for(let w of H.segments)if(!(w.start==null||w.end==null)){if(w.type==="home"){R=null;continue}if(w.type==="stay"){R=null,ne.push({type:"stay",g:w,s:w.start,en:w.end});continue}R&&R.en===w.start?(R.en=w.end,R.legs.push(w)):(R={type:"trip",s:w.start,en:w.end,legs:[w]},ne.push(R))}for(let w of ne){let L=A(w.s),I=Math.max(24,A(w.en)-L);if(w.type==="stay"){let U=P.get(w.g.event??w.g.serves??""),fe=U?b.get(U.kid)??Y(0):Y(0),W=w.g.kids.map(x);y.stays.push({key:`${m.date}|stay|${$}|${w.s}`,x:B.x+8,y:L,w:B.w-16,h:I,target:O(U?.id),color:fe,l1:U?`At ${U.title} with ${x(U.kid)}`:"Staying",l2:`until ${k(w.en)}`+(W.length?` · ${W.join(" and ")} too`:"")});continue}let q=w.legs[0],ae=w.legs[w.legs.length-1],j=[];for(let U of w.legs)for(let fe of U.kids)j.includes(fe)||j.push(fe);let ge=ae.type==="drive"&&ae.to==="home",Ce=lt(w.legs,f);y.trips.push({key:`${m.date}|trip|${$}|${w.s}`,x:B.x+8,y:L,w:B.w-16,h:I,target:O(w.legs.find(U=>U.serves)?.serves),l1:q.type==="drive"&&q.from==="home"?`Leave ${k(w.s)}`:`From ${ct(f,q.from??q.place)} ${k(w.s)}`,l2:Ce.join(" → "),show2:I>=36,l3:ge?`Home ${k(w.en)}`:"",show3:ge&&I>=62,stops:null,kids:j.map(U=>(b.get(U)??Y(0)).color),bad:w.legs.some(U=>U.overlaps_busy),aria:`${u($)} drives ${Ce.join(" to ")}, ${k(w.s)} to ${k(w.en)}`})}for(let w of H.segments)if(!(!w.overlaps_busy||w.start==null||w.end==null))for(let L of H.busy){let I=Math.max(w.start,L.start),q=Math.min(w.end,L.end);q<=I||y.overlaps.push({key:`${m.date}|overlap|${$}|${I}`,x:B.x+6,y:A(I)-2,w:B.w-12,h:Math.max(8,A(q)-A(I)+4)})}for(let w of H.busy){if(w.end<=_||w.start>=S)continue;let L=A(w.start),I=A(w.end);y.busy.push({key:`${m.date}|busy|${$}|${w.start}`,x:B.x+1,y:L,w:B.w-2,h:I-L,labelY:8,label:Ln(w,!1)})}}let C=-1/0;for(let $=_;$<=S;$+=30)y.grid.push({key:`${m.date}|grid|${$}`,y:A($),strong:$%60===0}),$%60===0&&A($)-C>=22&&(y.hours.push({key:`${m.date}|hour|${$}`,y:A($)-8,label:on($)}),C=A($));m.date===n.date&&n.minutes>_&&n.minutes<S&&(y.now={y:A(n.minutes),label:`Now ${k(n.minutes)}`}),T=A(S)+St;return}let ee=[];for(let d of p){let E=l.get(d);for(let _ of m.kids[d]?.items??[])if(_.start!=null){if(_.type==="act"){let S=P.get(_.event??"");if(!S)continue;ee.push({col:d,s:_.start,h:Us(S,E.w),kind:"act",item:_})}else if(!m.rides[_.ride??-1]?.own){let S=m.rides[_.ride??-1],A=S?lt(Z(S.index),f).join(" → "):"";ee.push({col:d,s:_.start,h:Ls(A,E.w),kind:"along",item:_})}}}for(let d of g){let E=m.drivers[d];if(E){for(let _ of E.busy)ee.push({col:d,s:_.start,h:32,kind:"busy",busy:_});for(let _ of E.outings)_.start!=null&&ee.push({col:d,s:_.start,h:30+_.lines.length*16+(_.warn?16:0),kind:"out",out:_})}}ee.sort((d,E)=>d.s-E.s||h.indexOf(d.col)-h.indexOf(E.col));let Ae=new Map,N=oe;ee.forEach((d,E)=>{let _=Ae.get(d.col),S=Math.max(_!=null?_+Ts:oe,N);Ae.set(d.col,S+d.h),N=S,y.anchors.push({t:K+d.s,y:S});let A=l.get(d.col);if(d.kind==="busy")y.busy.push({key:`${m.date}|busy|${d.col}|${E}`,x:A.x+1,y:S,w:A.w-2,h:d.h,labelY:8,label:Ln(d.busy,!0)});else if(d.kind==="out"){let C=d.out;y.trips.push({key:`${m.date}|trip|${d.col}|${E}`,x:A.x+8,y:S,w:A.w-16,h:d.h,target:O(C.target),l1:C.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...C.lines.map($=>({text:$,warn:!1})),...C.warn?[{text:C.warn,warn:!0}]:[]],kids:C.kids.map($=>(b.get($)??Y(0)).color),bad:!!C.warn,aria:`${u(d.col)}: ${C.lead}. ${C.lines.join(". ")}${C.warn?`. ${C.warn}`:""}`})}else if(d.kind==="act"){let C=P.get(d.item.event??"");y.cards.push(M(C,A.x,S,A.w,d.h,d.item.clash,!0))}else{let C=m.rides[d.item.ride??-1],$=lt(Z(C.index),f),B=u(C.driver);y.rides.push({key:`${m.date}|ride|${C.index}`,x:A.x,y:S,w:A.w,h:d.h,target:z(C.index),l1:`Along with ${B} ${k(V(C.start))}`,l2:$.join(" → "),show2:!0,lines2:Lt,dashed:!0,clash:d.item.clash,aria:`${x(d.col)} riding along with ${B}, ${k(V(C.start))} to ${k(V(C.end))}: ${$.join(" to ")}`})}});let te=oe;for(let d of Ae.values())te=Math.max(te,d);T=te+St+6,y.anchors.push({t:K+1439,y:T})}),y.height=T,y}var Os=["","¼","½","¾"];function we(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let n=Number(e);if(n>=59.5)return Ie(n);let i=Math.round(n*4),r=Math.floor(i/4),a=Os[i%4];return`${r||!a?r:""}${a} min`})}function Vn(s){let t=e=>e?{...e,text:we(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(n=>({...n,lines:{drop:t(n.lines.drop),pick:t(n.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([n,i])=>[n,{...i,outings:i.outings.map(r=>({...r,lines:r.lines.map(we),warn:r.warn==null?r.warn:we(r.warn)}))}])),issues:e.issues.map(n=>({...n,title:we(n.title),body:we(n.body),note:n.note==null?n.note:we(n.note),...n.suggestions?{suggestions:n.suggestions.map(i=>({...i,note:we(i.note)}))}:{}}))}))}}var Bs=2,Hs=48;function Wn(s,t,e=Hs){let n=[],i=0,r=0,a=0,o=0,l=t.minutes+e*60;for(let p of s.days){let g=Fe(t.date,p.date),h=g===0?"":`${le(p.date)} · `,b=new Map(p.events.map(u=>[u.id,u])),f=u=>u&&b.has(u)?{day:p.date,event:u}:null,x=(u,y)=>g*1440+(u??b.get(y??"")?.start??0)<l;for(let u of p.issues)if(u.level==="problem"){if(!x(u.at,u.event)){a++,u.kind==="unassigned"&&o++;continue}i++,u.kind==="unassigned"&&r++,n.push({key:`${p.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:h+u.title,body:u.body,target:f(u.event),suggestions:(u.suggestions??[]).map(y=>({id:y.id,label:y.label,note:y.note}))})}if(p.clashes.forEach((u,y)=>{if(!x(u.a.start,u.a.event)){a++;return}i++;let T=b.get(u.a.event??""),m=F(s,u.kid),D=(P,O)=>{let Q=f(O);return Q?{text:P,target:Q}:P},K=[];if(u.b.type==="act"){let P=b.get(u.b.event??"");T&&P&&(K=[D(T.title,T.id),` ${k(T.start)}–${k(T.end)} and `,D(P.title,P.id),` ${k(P.start)}–${k(P.end)} overlap.`])}else{let P=p.rides[u.b.ride??-1];T&&P&&(K=[`${m} is in `,D(`${he(s,P.driver)}’s car`,P.serves[0]),` ${k(V(u.b.start))}–${k(V(u.b.end))}, during `,D(T.title,T.id),"."])}n.push({key:`${p.date}|clash|${y}`,tone:"problem",title:`${h}${m} is double-booked`,body:K.map(P=>typeof P=="string"?P:P.text).join(""),parts:K,target:null,suggestions:[]})}),g>=0&&g<Bs)for(let u of p.issues)u.level!=="heads_up"||!x(u.at,u.event)||n.push({key:`${p.date}|${u.key}`,tone:"heads_up",title:h+u.title,body:u.body,target:f(u.event),suggestions:[]});for(let u of p.events)!u.problems.length||!x(u.start)||n.push({key:`${p.date}|notes|${u.id}`,tone:"heads_up",title:`${h}Check the notes on ${F(s,u.kid)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:f(u.id),suggestions:[]})}return{items:n,problems:i,unassigned:r,later:a,laterUnassigned:o}}function Kn(s,t){let e=ke(s),n=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of s.days){let a=Fe(t.date,r.date);if(!(a<0))for(let o of pe(s))for(let l of r.drivers[o]?.outings??[]){if(l.start==null)continue;let p=a*1440+l.start;if(a*1440+V(l.end,l.start)<=t.minutes)continue;let h=p-t.minutes,b={driver:o,name:he(s,o),date:r.date,ahead:a,start:l.start,inMinutes:h,ongoing:h<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(f=>e.get(f)??Y(0)),warn:l.warn,target:l.target&&r.events.some(f=>f.id===l.target)?{day:r.date,event:l.target}:null};(!n||i(b)<i(n)||i(b)===i(n)&&b.inMinutes<n.inMinutes)&&(n=b)}}return n}var qs={timeline:"timeline",full:"timeline",compact:"compact"};function Fn(s){let t=new URLSearchParams(s),e={},n=qs[(t.get("view")??"").trim().toLowerCase()];return n&&(e.view=n),e}var js=["auth_callback","code","state"];function Ut(s){let t=new URLSearchParams(s);for(let n of js)t.delete(n);let e=t.toString();return e?`?${e}`:""}var Gn=vt`
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
`;var Yn="mydashlight.rides.mode",Vs=1100,Ws=440,Ks=700,Fs=3*6e4,Gs=1200;function Ys(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}function ut(s){let t=/\p{L}|\p{N}/u.exec(s);return t?t[0].toUpperCase():"?"}function Js(s){let t=s.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function Xs(){try{return localStorage.getItem(Yn)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Qs(s){try{localStorage.setItem(Yn,s)}catch{}}function gt(s){return s.days.every(t=>!t.events.length)}var je=class extends de{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Fn(location.search).view;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let n=e.currentTarget;this.drag={el:n,x:e.clientX,y:e.clientY,top:n.scrollTop,left:n.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let n=this.drag;if(!n)return;let i=e.clientX-n.x,r=e.clientY-n.y;if(!n.moved){if(Math.abs(i)+Math.abs(r)<6)return;n.moved=!0;try{n.el.setPointerCapture(n.id)}catch{}n.el.classList.add("dragging")}n.el.scrollTop=n.top-r,n.el.scrollLeft=n.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Fs))};this.onKey=e=>{e.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Xs(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),n=`${e.date}|${e.minutes}`;n!==this.minuteKey&&(this.minuteKey=n,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let n=this.keepAt;this.keepAt=null,this.scrollToTime(n)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.backend&&(this.stopWatching=this.backend.watch(e=>{this.plan=Vn(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Vs)return!1;let e=this.plan;return!e||this.width-Ws>=Dt($e(e).length,pe(e).length)}today(){return ze(this.plan?.time_zone??Ys())}currentBoard(){let e=this.plan;if(!e)return null;let n=this.today(),i=`${this.mode}|${this.boardWidth}|${n.date}|${n.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=jn(e,this.mode,this.boardWidth,n),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(n=>n.date===e):-1}scrollToTime(e,n){let i=this.scroller;if(!i||!this.board)return;let r=this.board.dayHeads.find(a=>a.date===n)?.y??0;i.scrollTop=Math.max(r,On(this.board,e)-ht-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),n=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(n*1440+(this.mode==="timeline"&&n===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[n]?.date)}goToDay(e){let n=this.plan;if(!n)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),a=n.days[r];if(!a)return;let o=1/0;if(this.mode==="timeline"){for(let l of a.events)o=Math.min(o,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let p of l.outings)p.start!=null&&(o=Math.min(o,p.start))}this.scrollToTime(r*1440+(Number.isFinite(o)?Math.max(0,o-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let n=e.scrollTop,i=this.board.dayHeads[0];for(let p of this.board.dayHeads)p.y<=n+1&&(i=p);let r=this.renderRoot,a=r.querySelector(".pinned .label"),o=r.querySelector(".pinned .tag"),l=r.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),o&&(o.textContent!==i.tag&&(o.textContent=i.tag),o.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let p of r.querySelectorAll(".day-tile"))p.classList.toggle("in-view",p.dataset.date===i.date)}setMode(e){if(e===this.mode)return;let n=this.scroller;this.keepAt=n&&this.board?Bn(this.board,n.scrollTop+ht+4):null,this.mode=e,this.urlView||Qs(e)}findEvent(e){let n=this.plan?.days.find(r=>r.date===e.day),i=n?.events.find(r=>r.id===e.event);return n&&i?{day:n,event:i}:null}open(e,n=!1){e&&(this.flushArrive(),this.sel=e,this.scope="this",this.arriveDraft=void 0,n&&this.reveal(e))}reveal(e){let n=this.findEvent(e),i=this.dayIndexOf(e.day);!n||i<0||this.scrollToTime(i*1440+Math.max(0,(n.event.arrive_by??n.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,n,i){if(!this.pending){this.pending={key:e,value:n};try{await i()}catch(r){let a=r instanceof G?r:new G("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,n,i){if(!this.backend)return;let r=this.backend;this.save(`${n}`,i,()=>r.setRide(e.id,n,i,this.scope))}setAttending(e,n){if(!this.backend||e.attending!==!1===n)return;let i=this.backend;this.save("attending",n,()=>i.setAttending(e.id,n,this.scope))}toggleStay(e){if(!this.backend)return;let n=this.backend;this.save("stay",!e.stay,()=>n.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,n){if(!this.backend)return;let i=this.backend,r=e.along.includes(n)?e.along.filter(a=>a!==n):[...e.along,n];this.save("along",r,()=>i.setTakeAlong(e.id,r,this.scope))}nudgeArrive(e,n){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;n<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Gs)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,n=this.sel;if(e===void 0||!n||!this.backend)return;let i=this.findEvent(n);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,a=i.event.id,o=this.scope;this.save("arrive",e,()=>r.setArriveBy(a,e,o)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let n=this.backend;this.save(`fix|${e}`,e,()=>n.applySuggestion(e))}render(){let e=this.plan,n=this.currentBoard(),i=e?Wn(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=c`<aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
      ${this.sel&&e?this.renderEditor(e):this.renderAttention(i)}
    </aside>`;return c`
      <div class="app ${r?"wide":this.width<Ks?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i)} ${e?this.renderWeek(e):v} ${this.renderBanner(e)}
          <main>
            <section class="board-area" aria-label="Everyone’s week">
              ${n&&e?gt(e)?this.renderQuiet(e):this.renderBoard(n):this.renderEmpty()}
            </section>
            ${!r&&(this.sheet||this.sel)?c`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${a}`:v}
          </main>
        </div>
        ${r?a:v}
        ${this.toast?c`<div class="toast" role="status">${this.toast}</div>`:v}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(e,n){let i=n.problems;this.tick;let r=this.today(),a="";if(e){let g=e.time_zone,h=new Date(e.updated);this.error?a=c`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Ge(h,new Date,g)}</span>`:e.status&&!e.status.ok?a=c`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Ge(h,new Date,g)}</span>`:this.backend?.live||(a=`Updated ${Ge(h,new Date,g)}`)}let o=(g,h,b,f)=>c`
      <button type="button" class="seg-btn" title=${f} aria-pressed=${this.mode===g?"true":"false"} @click=${()=>this.setMode(g)}>
        ${b}<span class="seg-label">${h}</span>
      </button>
    `,l=De(r.minutes),p=!!e&&gt(e);return c`
      <header>
        ${this.showMenu?c`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${Pe`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:v}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Ee(r.date)}, ${l}`}>
            <span class="hm">${l.slice(0,-3)}</span><span class="ampm">${l.slice(-2)}</span>
          </h1>
          <p class="today-line">${Ee(r.date)}</p>
          ${a?c`<p class="status">${a}</p>`:v}
        </div>
        ${e&&!p?this.renderNext(e,Kn(e,r),n):v}
        <div class="controls">
          ${this.wide||p?v:c`<button type="button" class="attn-btn ${i?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${i}</span>
              </button>`}
          <div role="group" aria-label="View" class="seg">
            ${o("timeline","Timeline",Pe`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${o("compact","Compact",Pe`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>
        </div>
      </header>
    `}renderNext(e,n,i){if(!n){let p=this.today().date,g=i.unassigned,h=i.laterUnassigned;if(g){let f=c`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${g} ${g===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?c`<div class="next idle needs">${f}</div>`:c`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${f}</button>`}if(h)return c`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let b=e.days.some(f=>f.date>=p&&f.events.length);return c`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${b?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${b?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let r;n.ongoing?r="On the road now":n.ahead===0?r=n.inMinutes<180?`Next trip · in ${Ie(n.inMinutes)}`:"Next trip · later today":n.ahead===1?r="Next trip · tomorrow":r=`Next trip · ${le(n.date)}`;let a=!n.ongoing&&n.ahead===0&&n.inMinutes<=30,o=c`
      <span class="next-eyebrow">${r}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${ut(n.name)}</span>
        <span class="next-lead">${n.name} · ${n.lead}</span>
        <span class="next-kids">${n.kids.map(p=>c`<span class="kid-dot" style="background:${p.color}"></span>`)}</span>
      </span>
      ${n.warn?c`<span class="next-stop warn">${n.warn}</span>`:n.stop?c`<span class="next-stop">${n.stop}</span>`:v}
    `,l=`next ${n.ongoing?"ongoing":a?"soon":""}`;return n.target?c`<button type="button" class=${l} @click=${()=>this.open(n.target)}>${o}</button>`:c`<div class=${l}>${o}</div>`}renderWeek(e){let n=this.today().date,i=ke(e);return c`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let a=It(r),o=r.events.length,l=r.events.slice(0,6).map(g=>i.get(g.kid)?.color??Y(0).color),p=`${Ee(r.date)}: ${o?`${o} ${o===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return c`<button
          type="button"
          class="day-tile ${r.date===n?"today":""}"
          data-date=${r.date}
          aria-label=${p}
          @click=${()=>this.goToDay(r.date)}
        >
          <span class="dt-wd">${r.date===n?"Today":le(r.date)}</span>
          <span class="dt-num">${Number(r.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(g=>c`<span class="dt-dot" style="background:${g}"></span>`):c`<span class="dt-free">free</span>`}
            ${o>6?c`<span class="dt-more">+${o-6}</span>`:v}
          </span>
          ${a?c`<span class="dt-badge" aria-hidden="true">${a}</span>`:v}
        </button>`})}
    </nav>`}renderQuiet(e){let n=$e(e),i=pe(e),r=ke(e),a=n.map(o=>F(e,o));return c`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${n.slice(0,3).map((o,l)=>Pe`<circle cx=${50+l*30} cy="80" r="11" fill=${r.get(o).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Js(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${n.map(o=>{let l=r.get(o);return c`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${ut(F(e,o))}</span>
            <span class="qw-name">${F(e,o)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(o=>c`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${ut(he(e,o))}</span>
            <span class="qw-name">${he(e,o)}</span>
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
    </div>`}renderBanner(e){let n=e?.unavailable_calendars.length??0;return n?c`<div class="banner" role="status">
      Couldn’t read ${n===1?"one calendar":`${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:v}renderEmpty(){return this.error?c`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:c`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let n=this.sel,i=o=>!!o&&!!n&&o.day===n.day&&o.event===n.event,r=e.dayHeads[0],a=e.width;return c`
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
          ${e.columns.map(o=>c`<div class="col-head ${o.kind}" style="left:${o.x}px;width:${o.w}px;--c:${o.dot};--rgb:${o.rgb}">
              <span class="avatar ${o.kind}" aria-hidden="true">${ut(o.name)}</span>
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
          ${e.columns.map(o=>c`<div
                class="col-bg ${o.kind}"
                style="left:${o.x}px;width:${o.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${o.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(o=>c`<div class="day-head" style="top:${o.y}px;width:${a}px">
              <span class="label">${o.label}</span>${o.tag?c`<span class="tag">${o.tag}</span>`:v}<span
                class="sub ${o.warn?"warn":""}"
                >${o.sub}</span
              >
            </div>`)}
          ${e.empties.map(o=>c`<span class="empty" style="top:${o.y}px">${o.text}</span>`)}
          ${e.grid.map(o=>c`<div class="grid ${o.strong?"strong":""}" style="top:${o.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(o=>c`<span class="hour" style="top:${o.y}px">${o.label}</span>`)}
          ${X(e.bands,o=>o.key,o=>c`<div
                class="band"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:rgba(${o.color.rgb},0.10);border-color:rgba(${o.color.rgb},0.45)"
              ></div>`)}
          ${X(e.busy,o=>o.key,o=>c`<div class="busy" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px">
                <span style="top:${o.labelY}px">${o.label}</span>
              </div>`)}
          ${X(e.preps,o=>o.key,o=>c`<div
                class="prep"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:rgba(${o.color.rgb},0.07);color:${o.color.ink}"
              >
                ${o.label}
              </div>`)}
          ${X(e.cards,o=>o.key,o=>{let l=o.color,p=o.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:o.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return c`<button
                type="button"
                class="card ${o.wrap?"wrap":""} ${i(o.target)?"sel":""} ${o.clash?"clash":""} ${o.skipped?"skipped":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:${p};border-color:${o.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(o.target)}
              >
                <span class="top">
                  <span class="title">${o.title}</span>
                  <span class="time">${o.time}</span>
                  ${o.showDrop&&o.drop?c`<span class="line tone-${o.drop.tone}">${o.drop.text}</span>`:v}
                </span>
                ${o.showPick&&o.pick?c`<span class="line tone-${o.pick.tone}">${o.pick.text}</span>`:v}
              </button>`})}
          ${X(e.rides,o=>o.key,o=>c`<button
                type="button"
                class="ride ${o.dashed?"dashed":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}</span>${o.show2?c`<span class="l2" style="-webkit-line-clamp:${o.lines2}">${o.l2}</span>`:v}
              </button>`)}
          ${X(e.stays,o=>o.key,o=>c`<button
                type="button"
                class="stay"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:repeating-linear-gradient(135deg, rgba(${o.color.rgb},0.28) 0px, rgba(${o.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1" style="color:${o.color.ink}">${o.l1}</span><span class="l2">${o.l2}</span>
              </button>`)}
          ${X(e.trips,o=>o.key,o=>c`<button
                type="button"
                class="trip ${o.bad?"bad":""} ${o.stops?"list":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}${o.kids.map(l=>c`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${o.show2?c`<span class="l2">${o.l2}</span>`:v}
                ${o.stops?o.stops.map(l=>c`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):v}
                ${o.show3?c`<span class="l3">${o.l3}</span>`:v}
              </button>`)}
          ${X(e.overlaps,o=>o.key,o=>c`<div class="overlap" aria-hidden="true" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`)}
          ${X(e.marks,o=>o.key,o=>c`<span class="mark" style="left:${o.x}px;top:${o.y}px;${o.right?"transform:translateX(-100%)":""}">${o.text}</span>`)}
          ${e.now?c`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:v}
        </div>
      </div>
    `}renderAttention(e){let{items:n,problems:i,later:r}=e,a=this.plan;return c`
      <div class="panel-head">
        <h2>Needs attention <span class="panel-sub">Next two days</span></h2>
        <span class="count-pill ${i?"bad":"ok"}">${i}</span>
        ${this.wide?v:c`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${a&&!i?c`<div class="all-clear">
            <span class="check" aria-hidden="true">${Pe`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${gt(a)?"Nothing needs you this week.":r?`Nothing for the next two days. ${r} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:v}
      ${n.map(o=>c`<div class="issue ${o.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${o.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${o.target?c`<button type="button" class="issue-title" @click=${()=>this.open(o.target,!0)}>${o.title}</button>`:c`<strong class="issue-title">${o.title}</strong>`}
              <span class="issue-body"
                >${o.parts?o.parts.map(l=>typeof l=="string"?l:c`<button type="button" class="issue-link" @click=${()=>this.open(l.target,!0)}>${l.text}</button>`):o.body}</span
              >
            </div>
          </div>
          ${o.suggestions.length?c`<div class="fixes">
                ${o.suggestions.map(l=>c`<button
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
      ${this.wide&&a&&!gt(a)?this.renderLegend():v}
    `}renderLegend(){return c`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let n=this.findEvent(this.sel);if(!n)return c``;let{day:i,event:r}=n,a=pe(e),l=ke(e).get(r.kid)??Y(0),p=!!this.pending,g=M=>this.pending?.key===M?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let M of e.days)for(let Z of M.events)for(let z of[Z.drop,Z.pick])z&&z!=="none"&&!a.includes(z)&&!h.some(J=>J.toLowerCase()===z.toLowerCase())&&h.push(z);let b=M=>{if(!r.sides.includes(M))return v;let Z=g(M),z=Z!==void 0?String(Z):M==="drop"?r.drop:r.pick,J=z&&z!=="none"&&!a.includes(z)?z:"",ee=N=>this.setRide(r,M,z===N?"":N),Ae=[...a.map(N=>[N,zt(e,N)]),["none","Not needed"]];return c`<div class="field">
        <span class="field-label">${M==="drop"?"Drop-off":"Pick-up"} ${z===""?c`<span class="nobody">· nobody yet</span>`:v}</span>
        <div role="group" aria-label=${M==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${Ae.length}, minmax(0, 1fr))">
          ${Ae.map(([N,te])=>c`<button type="button" class="choice" aria-pressed=${z===N?"true":"false"} ?disabled=${p} @click=${()=>ee(N)}>
                ${te}
              </button>`)}
        </div>
        ${h.length?c`<div role="group" aria-label=${M==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(N=>c`<button type="button" class="chip" aria-pressed=${z.toLowerCase()===N.toLowerCase()?"true":"false"} ?disabled=${p} @click=${()=>ee(N)}>
                    ${N}
                  </button>`)}
            </div>`:v}
        <input
          type="text"
          .value=${J&&!h.some(N=>N.toLowerCase()===J.toLowerCase())?J:""}
          ?disabled=${p}
          aria-label=${M==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${N=>{let te=N.target.value.trim();te&&te!==z&&this.setRide(r,M,te)}}
          @keydown=${N=>{N.key==="Enter"&&N.target.blur()}}
        />
      </div>`},f=g("stay"),x=f!==void 0?!!f:r.stay,u=r.drop===r.pick&&a.includes(r.drop),y=g("along"),T=y!==void 0?y:r.along,m=$e(e).filter(M=>M!==r.kid),D=a.includes(r.drop)&&r.sides.includes("drop"),K=g("arrive"),P=this.arriveDraft!==void 0?this.arriveDraft:K!==void 0?K:r.arrive_by,O=[],Q=M=>M==="none"?"Not needed":zt(e,M);r.drop!==""&&O.push(`Drop-off: ${Q(r.drop)}`),r.pick!==""&&O.push(`Pick-up: ${Q(r.pick)}`),r.stay&&O.push("Stay: yes"),r.along.length&&O.push(`Take along: ${r.along.map(M=>F(e,M)).join(", ")}`),r.arrive_by!=null&&O.push(`Arrive by: ${De(r.arrive_by)}`);let ue=g("attending"),_e=ue!==void 0?!!ue:r.attending!==!1;r.attending===!1&&O.splice(0,O.length,"Attending: no");let oe=i.date===this.today().date?"":`${le(i.date)} · `,Me=c`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${F(e,r.kid)} · ${r.title}</span>
          <span class="ed-meta">${oe}${k(r.start)}–${k(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return r.where==="home"?c`${Me}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${F(e,r.kid)} can’t get home in time, the board shows it as a clash.</p>`:c`
      ${Me}
      ${this.pending?c`<p class="saving" role="status">Saving to Google Calendar…</p>`:v}
      ${r.recurring?c`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${le(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:v}
      <div class="field">
        <span class="field-label">${F(e,r.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${_e?"true":"false"} ?disabled=${p} @click=${()=>this.setAttending(r,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${_e?"false":"true"} ?disabled=${p} @click=${()=>this.setAttending(r,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${_e?c`${r.where==="anywhere"?c`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:v}
            ${b("drop")} ${b("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${x?"true":"false"} ?disabled=${!u||p} @click=${()=>this.toggleStay(r)}>
          ${u?x?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${D&&m.length?c`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${m.map(M=>c`<button type="button" class="chip" aria-pressed=${T.includes(M)?"true":"false"} ?disabled=${p} @click=${()=>this.toggleAlong(r,M)}>
                  ${F(e,M)}
                </button>`)}
            </div>
          </div>`:v}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${P!=null?`${r.start-P} min before it starts`:`Aims for a few minutes before ${k(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${p} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${P!=null?k(P):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${p||P==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${P!=null?c`<button type="button" class="chip clear" ?disabled=${p} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:v}
`:c`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${O.length?O.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${r.problems.length?c`<p class="field-hint bad">These lines in the notes couldn’t be read: ${r.problems.join("; ")}</p>`:v}
      ${_e?c`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:v}
    `}};je.styles=Gn,je.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",je);var Ot="hassTokens";function Zs(){try{let s=localStorage.getItem(Ot);return s?JSON.parse(s):null}catch{return null}}function Jn(s){try{s?localStorage.setItem(Ot,JSON.stringify(s)):localStorage.removeItem(Ot)}catch{}}function ei(s){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=s)}async function ti(){let s=document.querySelector("mydashlight-board");if(s){s.kiosk=!0;try{let t=await sn({hassUrl:location.origin,loadTokens:async()=>Zs(),saveTokens:Jn});location.search.includes("auth_callback")&&history.replaceState(null,"",location.pathname+Ut(location.search));let e=await rn({auth:t});s.backend=new Ye(e)}catch(t){if(t===2){Jn(null),location.replace(location.pathname+Ut(location.search));return}ei(t===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(t)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}}ti();
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
