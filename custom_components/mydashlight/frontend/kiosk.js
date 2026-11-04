function Jt(n){return{type:"auth",access_token:n}}function Xt(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Zt(n){let t={type:"subscribe_events"};return n&&(t.event_type=n),t}function bt(n){return{type:"unsubscribe_events",subscription:n}}function Qt(){return{type:"ping"}}function es(n,t){return{type:"result",success:!1,error:{code:n,message:t}}}function ss(n){let t={},e=n.split("&");for(let s=0;s<e.length;s++){let i=e[s].split("="),r=decodeURIComponent(i[0]),a=i.length>1?decodeURIComponent(i[1]):void 0;t[r]=a}return t}var ns=(n,t,e,s)=>{let[i,r,a]=n.split(".",3);return Number(i)>t||Number(i)===t&&(s===void 0?Number(r)>=e:Number(r)>e)||s!==void 0&&Number(i)===t&&Number(r)===e&&Number(a)>=s};var Ge=!1,an="auth_required",ln="auth_invalid",dn="auth_ok";function rs(n){if(!n.auth)throw 4;let t=n.auth,e=t.expired?t.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,s=t.wsUrl;Ge&&console.log("[Auth phase] Initializing",s);function i(r,a,o){Ge&&console.log("[Auth Phase] New connection",s);let l=new WebSocket(s),c=!1,f=()=>{if(l.removeEventListener("close",f),c){o(2);return}if(r===0){o(1);return}let m=r===-1?-1:r-1;setTimeout(()=>i(m,a,o),1e3)},p=async m=>{try{t.expired&&await(e||t.refreshAccessToken()),l.send(JSON.stringify(Jt(t.accessToken)))}catch(x){c=x===2,l.close()}},u=async m=>{let x=JSON.parse(m.data);switch(Ge&&console.log("[Auth phase] Received",x),x.type){case ln:c=!0,l.close();break;case dn:l.removeEventListener("open",p),l.removeEventListener("message",u),l.removeEventListener("close",f),l.removeEventListener("error",f),l.haVersion=x.ha_version,ns(l.haVersion,2022,9)&&l.send(JSON.stringify(Xt())),a(l);break;default:Ge&&x.type!==an&&console.warn("[Auth phase] Unhandled message",x)}};l.addEventListener("open",p),l.addEventListener("message",u),l.addEventListener("close",f),l.addEventListener("error",f)}return new Promise((r,a)=>i(n.setupRetry,r,a))}var Ie=!1,Ye=class{constructor(t,e){this._handleMessage=s=>{let i=JSON.parse(s.data);Array.isArray(i)||(i=[i]),i.forEach(r=>{Ie&&console.log("Received",r);let a=this.commands.get(r.id);switch(r.type){case"event":a?a.callback(r.event):(console.warn(`Received event for unknown subscription ${r.id}. Unsubscribing.`),this.sendMessagePromise(bt(r.id)).catch(o=>{Ie&&console.warn(` Error unsubsribing from unknown subscription ${r.id}`,o)}));break;case"result":a&&(r.success?(a.resolve(r.result),"subscribe"in a||this.commands.delete(r.id)):(a.reject(r.error),this.commands.delete(r.id)));break;case"pong":a?(a.resolve(),this.commands.delete(r.id)):console.warn(`Received unknown pong response ${r.id}`);break;default:Ie&&console.warn("Unhandled message",r)}})},this._handleClose=async()=>{let s=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,s.forEach(a=>{"subscribe"in a||a.reject(es(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),r=a=>{setTimeout(async()=>{if(!this.closeRequested){Ie&&console.log("Trying to reconnect");try{let o=await i.createSocket(i);this._setSocket(o)}catch(o){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let c of l)c.reject&&c.reject(3)}o===2?this.fireEvent("reconnect-error",o):r(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),r(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(t)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(t){this.socket=t,this.haVersion=t.haVersion,t.addEventListener("message",this._handleMessage),t.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(r=>{i.unsubscribe=r,i.resolve()})}));let s=this._queuedMessages;if(s){this._queuedMessages=void 0;for(let i of s)i.resolve()}this.fireEvent("ready")}addEventListener(t,e){let s=this.eventListeners.get(t);s||(s=[],this.eventListeners.set(t,s)),s.push(e)}removeEventListener(t,e){let s=this.eventListeners.get(t);if(!s)return;let i=s.indexOf(e);i!==-1&&s.splice(i,1)}fireEvent(t,e){(this.eventListeners.get(t)||[]).forEach(s=>s(this,e))}suspendReconnectUntil(t){this.suspendReconnectPromise=t}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(t=!1){if(this.socket){if(!t){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(t,e){return this.subscribeMessage(t,Zt(e))}ping(){return this.sendMessagePromise(Qt())}sendMessage(t,e){if(!this.connected)throw 3;if(Ie&&console.log("Sending",t),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(t)});return}e||(e=this._genCmdId()),t.id=e,this.socket.send(JSON.stringify(t))}sendMessagePromise(t){return new Promise((e,s)=>{if(this._queuedMessages){this._queuedMessages.push({reject:s,resolve:async()=>{try{e(await this.sendMessagePromise(t))}catch(r){s(r)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:s}),this.sendMessage(t,i)})}async subscribeMessage(t,e,s){if(this._queuedMessages&&await new Promise((r,a)=>{this._queuedMessages.push({resolve:r,reject:a})}),s?.preCheck&&!await s.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((r,a)=>{let o=this._genCmdId();i={resolve:r,reject:a,callback:t,subscribe:s?.resubscribe!==!1?()=>this.subscribeMessage(t,e,s):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(bt(o)),this.commands.delete(o)}},this.commands.set(o,i);try{this.sendMessage(e,o)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var cn=()=>`${location.protocol}//${location.host}/`,pn=n=>n*1e3+Date.now();function hn(){let{protocol:n,host:t,pathname:e,search:s}=location;return`${n}//${t}${e}${s}`}function un(n,t,e,s){let i=`${n}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return t!==null&&(i+=`&client_id=${encodeURIComponent(t)}`),s&&(i+=`&state=${encodeURIComponent(s)}`),i}function gn(n,t,e,s){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=un(n,t,e,s)}async function ls(n,t,e){let s=typeof location<"u"&&location;if(s&&s.protocol==="https:"){let o=document.createElement("a");if(o.href=n,o.protocol==="http:"&&o.hostname!=="localhost")throw 5}let i=new FormData;t!==null&&i.append("client_id",t),Object.keys(e).forEach(o=>{i.append(o,e[o])});let r=await fetch(`${n}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!r.ok)throw r.status===400||r.status===403?2:new Error("Unable to fetch tokens");let a=await r.json();return a.hassUrl=n,a.clientId=t,a.expires=pn(a.expires_in),a}function as(n,t,e){return ls(n,t,{code:e,grant_type:"authorization_code"})}function fn(n){return btoa(JSON.stringify(n))}function mn(n){return JSON.parse(atob(n))}var xt=class{constructor(t,e){this.data=t,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let t=await ls(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});t.refresh_token=this.data.refresh_token,this.data=t,this._saveTokens&&this._saveTokens(t)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let t=new FormData;t.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:t}),this._saveTokens&&this._saveTokens(null)}};async function ds(n={}){let t,e=n.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let s=n.clientId!==void 0?n.clientId:cn(),i=n.limitHassInstance===!0;if(n.authCode&&e&&(t=await as(e,s,n.authCode),n.saveTokens&&n.saveTokens(t)),!t){let r=ss(location.search.substr(1));if("auth_callback"in r){let a=mn(r.state);if(i&&(a.hassUrl!==e||a.clientId!==s))throw 6;t=await as(a.hassUrl,a.clientId,r.code),n.saveTokens&&n.saveTokens(t)}}if(!t&&n.loadTokens&&(t=await n.loadTokens()),t&&(e===void 0||t.hassUrl===e))return new xt(t,n.saveTokens);if(e===void 0)throw 4;return gn(e,s,n.redirectUrl||hn(),fn({hassUrl:e,clientId:s})),new Promise(()=>{})}async function cs(n){let t=Object.assign({setupRetry:0,createSocket:rs},n),e=await t.createSocket(t);return new Ye(e,t)}function k(n){let t=Math.round(n),e=Math.floor(t/60),s=(t%60+60)%60;return`${((e+11)%12+12)%12+1}:${s<10?"0":""}${s}`}function Le(n){let t=Math.floor(Math.round(n)/60)%24;return`${k(n)} ${t<12?"AM":"PM"}`}function ps(n){let t=Math.floor(n/60)%24;return`${(t+11)%12+1} ${t<12?"AM":"PM"}`}function Oe(n){let t=Math.max(0,Math.round(n)),e=Math.floor(t/60),s=t%60;return e?s?`${e} hr ${s} min`:`${e} hr`:`${s} min`}function hs(n){let t=Math.floor(n/60)%24,e=n%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var bn=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),xn=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),vn=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Je(n){return new Date(`${n}T12:00:00Z`)}function ve(n){let t=Je(n);return`${bn.format(t)}, ${vn.format(t)}`}function G(n){return xn.format(Je(n))}function pe(n,t){return Math.round((Je(t).getTime()-Je(n).getTime())/864e5)}function Ue(n,t=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:n,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t)}catch{return Ue("UTC",t)}let s=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${s("year")}-${s("month")}-${s("day")}`,minutes:Number(s("hour"))*60+Number(s("minute"))}}function Xe(n,t,e){let s=Math.floor((t.getTime()-n.getTime())/6e4);if(s<1)return"just now";if(s<60)return`${s} min ago`;let i=Ue(e,n),r=Ue(e,t).date;return i.date===r?`at ${Le(i.minutes)}`:`on ${G(i.date)} at ${Le(i.minutes)}`}var Y=class extends Error{constructor(t,e){super(e),this.code=t,this.name="BackendError"}},Pe="mydashlight",yn=7,us=3e4;function vt(n){if(n instanceof Y)return n;if(n&&typeof n=="object"){let t=n;if(typeof t.message=="string")return new Y(String(t.code??"error"),t.message)}return typeof n=="number"?new Y("connection_lost","Lost the connection to Home Assistant."):new Y("error",String(n))}var Ze=class{constructor(t){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new Y("connection_lost","Lost the connection to Home Assistant."));this.conn=t}get live(){return this.pushing}watch(t,e){let s={onPlan:t,onError:e};return this.listeners.add(s),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(s),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},us),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let t=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,t&&t().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(t=>{this.pushing=!0,t.plan?this.emit(t.plan):this.fail(new Y("not_running","MyDashLight isn’t running right now."))},{type:`${Pe}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(t){for(let e of this.listeners)e.onError(t)}emit(t){for(let e of this.listeners)e.onPlan(t)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let t=await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:"get_plan",service_data:{days:yn},return_response:!0});this.emit(t.response)}catch(t){this.fail(vt(t))}}async call(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:t,service_data:e})}catch(s){throw vt(s)}this.pushing||await this.refresh()}setRide(t,e,s,i){return this.call("set_ride",{event:t,side:e,driver:s,scope:i})}setStay(t,e,s){return this.call("set_stay",{event:t,stay:e,scope:s})}setAttending(t,e,s){return this.call("set_attending",{event:t,attending:e,scope:s})}setArriveBy(t,e,s){return this.call("set_arrive_by",e==null?{event:t,scope:s}:{event:t,time:hs(e),scope:s})}setTakeAlong(t,e,s){return this.call("set_take_along",{event:t,kids:e,scope:s})}applySuggestion(t){return this.call("apply_suggestion",{suggestion:t})}watchChores(t){let e=!1,s=null,i=null,r=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:"get_chores",service_data:{},return_response:!0});e||t(a.response??null)}catch{e||t(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(o=>{e||t(o.chores)},{type:`${Pe}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):s=a}catch{if(e)return;r(),i=setInterval(()=>void r(),us)}})(),()=>{e=!0,i&&clearInterval(i),s&&s().catch(()=>{})}}async setChoreDone(t,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Pe,service:"set_chore_done",service_data:{chore:t,done:e}})}catch(s){throw vt(s)}}};var Qe=globalThis,et=Qe.ShadowRoot&&(Qe.ShadyCSS===void 0||Qe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yt=Symbol(),gs=new WeakMap,Be=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==yt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(et&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=gs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&gs.set(e,t))}return t}toString(){return this.cssText}},fs=n=>new Be(typeof n=="string"?n:n+"",void 0,yt),wt=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new Be(e,n,yt)},ms=(n,t)=>{if(et)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=Qe.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},$t=et?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return fs(e)})(n):n;var{is:wn,defineProperty:$n,getOwnPropertyDescriptor:kn,getOwnPropertyNames:_n,getOwnPropertySymbols:An,getPrototypeOf:Tn}=Object,tt=globalThis,bs=tt.trustedTypes,Cn=bs?bs.emptyScript:"",En=tt.reactiveElementPolyfillSupport,He=(n,t)=>n,kt={toAttribute(n,t){switch(t){case Boolean:n=n?Cn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},vs=(n,t)=>!wn(n,t),xs={attribute:!0,type:String,converter:kt,reflect:!1,useDefault:!1,hasChanged:vs};Symbol.metadata??=Symbol("metadata"),tt.litPropertyMetadata??=new WeakMap;var ie=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=xs){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&$n(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:r}=kn(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);r?.call(this,a),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??xs}static _$Ei(){if(this.hasOwnProperty(He("elementProperties")))return;let t=Tn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(He("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(He("properties"))){let e=this.properties,s=[..._n(e),...An(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift($t(i))}else t!==void 0&&e.push($t(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ms(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:kt).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:kt;this._$Em=i;let o=a.fromAttribute(e,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){let a=this.constructor;if(i===!1&&(r=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??vs)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),r!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:a}=r,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};ie.elementStyles=[],ie.shadowRootOptions={mode:"open"},ie[He("elementProperties")]=new Map,ie[He("finalized")]=new Map,En?.({ReactiveElement:ie}),(tt.reactiveElementVersions??=[]).push("2.1.2");var At=globalThis,ys=n=>n,st=At.trustedTypes,ws=st?st.createPolicy("lit-html",{createHTML:n=>n}):void 0,Tt="$lit$",re=`lit$${Math.random().toFixed(9).slice(2)}$`,Ct="?"+re,Pn=`<${Ct}>`,$e=document,je=()=>$e.createComment(""),Ve=n=>n===null||typeof n!="object"&&typeof n!="function",Et=Array.isArray,Cs=n=>Et(n)||typeof n?.[Symbol.iterator]=="function",_t=`[ 	
\f\r]`,qe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$s=/-->/g,ks=/>/g,ye=RegExp(`>|${_t}(?:([^\\s"'>=/]+)(${_t}*=${_t}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_s=/'/g,As=/"/g,Es=/^(?:script|style|textarea|title)$/i,Pt=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),d=Pt(1),ae=Pt(2),Hi=Pt(3),oe=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Ts=new WeakMap,we=$e.createTreeWalker($e,129);function Ps(n,t){if(!Et(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ws!==void 0?ws.createHTML(t):t}var Ms=(n,t)=>{let e=n.length-1,s=[],i,r=t===2?"<svg>":t===3?"<math>":"",a=qe;for(let o=0;o<e;o++){let l=n[o],c,f,p=-1,u=0;for(;u<l.length&&(a.lastIndex=u,f=a.exec(l),f!==null);)u=a.lastIndex,a===qe?f[1]==="!--"?a=$s:f[1]!==void 0?a=ks:f[2]!==void 0?(Es.test(f[2])&&(i=RegExp("</"+f[2],"g")),a=ye):f[3]!==void 0&&(a=ye):a===ye?f[0]===">"?(a=i??qe,p=-1):f[1]===void 0?p=-2:(p=a.lastIndex-f[2].length,c=f[1],a=f[3]===void 0?ye:f[3]==='"'?As:_s):a===As||a===_s?a=ye:a===$s||a===ks?a=qe:(a=ye,i=void 0);let m=a===ye&&n[o+1].startsWith("/>")?" ":"";r+=a===qe?l+Pn:p>=0?(s.push(c),l.slice(0,p)+Tt+l.slice(p)+re+m):l+re+(p===-2?o:m)}return[Ps(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},We=class n{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,a=0,o=t.length-1,l=this.parts,[c,f]=Ms(t,e);if(this.el=n.createElement(c,s),we.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=we.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(Tt)){let u=f[a++],m=i.getAttribute(p).split(re),x=/([.?@])?(.*)/.exec(u);l.push({type:1,index:r,name:x[2],strings:m,ctor:x[1]==="."?it:x[1]==="?"?rt:x[1]==="@"?ot:_e}),i.removeAttribute(p)}else p.startsWith(re)&&(l.push({type:6,index:r}),i.removeAttribute(p));if(Es.test(i.tagName)){let p=i.textContent.split(re),u=p.length-1;if(u>0){i.textContent=st?st.emptyScript:"";for(let m=0;m<u;m++)i.append(p[m],je()),we.nextNode(),l.push({type:2,index:++r});i.append(p[u],je())}}}else if(i.nodeType===8)if(i.data===Ct)l.push({type:2,index:r});else{let p=-1;for(;(p=i.data.indexOf(re,p+1))!==-1;)l.push({type:7,index:r}),p+=re.length-1}r++}}static createElement(t,e){let s=$e.createElement("template");return s.innerHTML=t,s}};function ke(n,t,e=n,s){if(t===oe)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,r=Ve(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=ke(n,i._$AS(n,t.values),i,s)),t}var nt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??$e).importNode(e,!0);we.currentNode=i;let r=we.nextNode(),a=0,o=0,l=s[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new Me(r,r.nextSibling,this,t):l.type===1?c=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(c=new at(r,this,t)),this._$AV.push(c),l=s[++o]}a!==l?.index&&(r=we.nextNode(),a++)}return we.currentNode=$e,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Me=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ke(this,t,e),Ve(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==oe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Cs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&Ve(this._$AH)?this._$AA.nextSibling.data=t:this.T($e.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=We.createElement(Ps(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new nt(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(t){let e=Ts.get(t.strings);return e===void 0&&Ts.set(t.strings,e=new We(t)),e}k(t){Et(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let r of t)i===e.length?e.push(s=new n(this.O(je()),this.O(je()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ys(t).nextSibling;ys(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},_e=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){let r=this.strings,a=!1;if(r===void 0)t=ke(this,t,e,0),a=!Ve(t)||t!==this._$AH&&t!==oe,a&&(this._$AH=t);else{let o=t,l,c;for(t=r[0],l=0;l<r.length-1;l++)c=ke(this,o[s+l],e,l),c===oe&&(c=this._$AH[l]),a||=!Ve(c)||c!==this._$AH[l],c===b?t=b:t!==b&&(t+=(c??"")+r[l+1]),this._$AH[l]=c}a&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},it=class extends _e{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}},rt=class extends _e{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}},ot=class extends _e{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=ke(this,t,e,0)??b)===oe)return;let s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},at=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ke(this,t)}},Ss={M:Tt,P:re,A:Ct,C:1,L:Ms,R:nt,D:Cs,V:ke,I:Me,H:_e,N:rt,U:ot,B:it,F:at},Mn=At.litHtmlPolyfillSupport;Mn?.(We,Me),(At.litHtmlVersions??=[]).push("3.3.3");var Ds=(n,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let r=e?.renderBefore??null;s._$litPart$=i=new Me(t.insertBefore(je(),r),r,void 0,e??{})}return i._$AI(n),i};var Mt=globalThis,he=class extends ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ds(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return oe}};he._$litElement$=!0,he.finalized=!0,Mt.litElementHydrateSupport?.({LitElement:he});var Sn=Mt.litElementPolyfillSupport;Sn?.({LitElement:he});(Mt.litElementVersions??=[]).push("4.2.2");var Rs={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ns=n=>(...t)=>({_$litDirective$:n,values:t}),lt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Dn}=Ss,zs=n=>n;var Is=()=>document.createComment(""),Se=(n,t,e)=>{let s=n._$AA.parentNode,i=t===void 0?n._$AB:t._$AA;if(e===void 0){let r=s.insertBefore(Is(),i),a=s.insertBefore(Is(),i);e=new Dn(r,a,n,n.options)}else{let r=e._$AB.nextSibling,a=e._$AM,o=a!==n;if(o){let l;e._$AQ?.(n),e._$AM=n,e._$AP!==void 0&&(l=n._$AU)!==a._$AU&&e._$AP(l)}if(r!==i||o){let l=e._$AA;for(;l!==r;){let c=zs(l).nextSibling;zs(s).insertBefore(l,i),l=c}}}return e},ue=(n,t,e=n)=>(n._$AI(t,e),n),Rn={},Ls=(n,t=Rn)=>n._$AH=t,Us=n=>n._$AH,dt=n=>{n._$AR(),n._$AA.remove()};var Os=(n,t,e)=>{let s=new Map;for(let i=t;i<=e;i++)s.set(n[i],i);return s},Z=Ns(class extends lt{constructor(n){if(super(n),n.type!==Rs.CHILD)throw Error("repeat() can only be used in text expressions")}dt(n,t,e){let s;e===void 0?e=t:t!==void 0&&(s=t);let i=[],r=[],a=0;for(let o of n)i[a]=s?s(o,a):a,r[a]=e(o,a),a++;return{values:r,keys:i}}render(n,t,e){return this.dt(n,t,e).values}update(n,[t,e,s]){let i=Us(n),{values:r,keys:a}=this.dt(t,e,s);if(!Array.isArray(i))return this.ut=a,r;let o=this.ut??=[],l=[],c,f,p=0,u=i.length-1,m=0,x=r.length-1;for(;p<=u&&m<=x;)if(i[p]===null)p++;else if(i[u]===null)u--;else if(o[p]===a[m])l[m]=ue(i[p],r[m]),p++,m++;else if(o[u]===a[x])l[x]=ue(i[u],r[x]),u--,x--;else if(o[p]===a[x])l[x]=ue(i[p],r[x]),Se(n,l[x+1],i[p]),p++,x--;else if(o[u]===a[m])l[m]=ue(i[u],r[m]),Se(n,i[p],i[u]),u--,m++;else if(c===void 0&&(c=Os(a,m,x),f=Os(o,p,u)),c.has(o[p]))if(c.has(o[u])){let g=f.get(a[m]),y=g!==void 0?i[g]:null;if(y===null){let C=Se(n,i[p]);ue(C,r[m]),l[m]=C}else l[m]=ue(y,r[m]),Se(n,i[p],y),i[g]=null;m++}else dt(i[u]),u--;else dt(i[p]),p++;for(;m<=x;){let g=Se(n,l[x+1]);ue(g,r[m]),l[m++]=g}for(;p<=u;){let g=i[p++];g!==null&&dt(g)}return this.ut=a,Ls(n,l),oe}});var ct=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function F(n){return ct[(n%ct.length+ct.length)%ct.length]}var Bs="#23272E",Hs="35,39,46";var Nn=3,ft=36,St=12,zn=8,Dt=60,Rt=10,ht=30,Nt=10,In=150,Ln=200,gt=1.4;function It(n,t){let e=Math.max(In,Ln/gt);return Math.ceil(Dt+Math.max(0,n-1)*Rt+ht+Math.max(0,t-1)*Nt+e*(n+gt*t))}function Te(n){return n.people?n.people.kids.map(t=>t.id):n.days.length?Object.keys(n.days[0].kids):[]}function ge(n){return n.people?n.people.drivers.map(t=>t.id):n.days.length?Object.keys(n.days[0].drivers):[]}function le(n){return new Map(Te(n).map((t,e)=>[t,F(e)]))}function J(n,t){let e=n.people?.kids.find(s=>s.id===t);if(e)return e.name;for(let s of n.days)if(s.kids[t])return s.kids[t].name;return t}function fe(n,t){let e=n.people?.drivers.find(s=>s.id===t);if(e)return e.name;for(let s of n.days)if(s.drivers[t])return s.drivers[t].name;return t}function Lt(n,t){return t==="none"?"Not needed":ge(n).includes(t)?fe(n,t):t}function Un(n){let t=new Map([["home","Home"]]);for(let e of n.days)for(let s of e.events)t.set(s.place,s.short_place||s.place_name||s.place);return t}function ut(n,t){return t?n.get(t)??(t.split(",")[0]?.trim()||t):""}function pt(n,t){let e=[];for(let s of n)s.type==="drive"?(e.length||e.push(ut(t,s.from)),e.push(ut(t,s.to))):(s.type==="wait"||s.type==="stay")&&(e.length||e.push(ut(t,s.place)),s.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function On(n){let t=n.map(a=>({...a,col:0,cols:1})).sort((a,o)=>a.s-o.s||o.en-a.en),e=[],s=[],i=-1/0,r=()=>{for(let a of e)a.cols=s.length;e=[],s=[]};for(let a of t){a.s>=i&&(r(),i=-1/0);let o=s.findIndex(l=>l<=a.s);o<0?(o=s.length,s.push(a.en)):s[o]=a.en,a.col=o,e.push(a),i=Math.max(i,a.en)}return r(),t}function Bn(n,t){if(!n.length)return 0;if(t<=n[0].t)return n[0].y;for(let e=0;e<n.length-1;e++){let s=n[e],i=n[e+1];if(t<=i.t)return i.t===s.t?s.y:Math.round(s.y+(t-s.t)/(i.t-s.t)*(i.y-s.y))}return n[n.length-1].y}function Hn(n,t){if(!n.length)return 0;if(t<=n[0].y)return n[0].t;for(let e=0;e<n.length-1;e++){let s=n[e],i=n[e+1];if(t<=i.y)return i.y===s.y?s.t:s.t+(t-s.y)/(i.y-s.y)*(i.t-s.t)}return n[n.length-1].t}function Vs(n,t){return Bn(n.anchors,t)}function Ws(n,t){return Hn(n.anchors,t)}function qn(n,t){let e=Te(n),s=ge(n),i=Math.max(t,It(e.length,s.length)),a=(i-Dt-Math.max(0,e.length-1)*Rt-ht-Math.max(0,s.length-1)*Nt)/(e.length+gt*s.length||1),o=Math.floor(a),l=Math.floor(a*gt),c=new Map;for(let x of n.days)for(let g of x.events){let y=c.get(g.kid)??[];y.some(C=>C.event_id===g.event_id&&C.calendar_id===g.calendar_id)||y.push(g),c.set(g.kid,y)}let f=le(n),p=[],u=Dt;e.forEach((x,g)=>{let y=c.get(x)??[],C=n.days.some(v=>v.events.some(N=>N.kid===x&&(N.sides.includes("drop")&&N.drop===""||N.sides.includes("pick")&&N.pick==="")));p.push({id:x,kind:"kid",x:u,w:o,name:J(n,x),dot:f.get(x).color,rgb:f.get(x).rgb,sub:`${C?"Needs a ride · ":""}${y.length} this week`,subWarn:C}),u+=o+(g<e.length-1?Rt:0)});let m=u+ht/2;return u+=ht,s.forEach((x,g)=>{let y=0,C=0;for(let v of n.days){let N=v.drivers[x];N&&(y+=N.outings.length,C+=N.drive??0)}p.push({id:x,kind:"driver",x:u,w:l,name:fe(n,x),dot:Bs,rgb:Hs,sub:`${y} ${y===1?"trip":"trips"} this week · ${Oe(C)} driving`,subWarn:!1}),u+=l+(g<s.length-1?Nt:0)}),{columns:p,sepX:m,width:i}}function jn(n,t){let e=n.trim();if(!t||e.length<=t.length||e.slice(0,t.length).localeCompare(t,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(t.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let a=i.slice(r[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function qs(n,t){let e=n.start<=0,s=n.end>=1440;return e&&s?`${n.title} · all day`:s?`${n.title} from ${k(n.start)}`:e||!t?`${n.title} until ${k(n.end)}`:`${n.title} ${k(n.start)}–${k(n.end)}`}function Ut(n){return n.issues.filter(t=>t.level==="problem").length+n.clashes.length}function Ot(n,t){let e=pe(t,n);return e===0?"Today":e===1?"Tomorrow":""}function V(n,t=0){return n==null||!Number.isFinite(n)?t:n}function zt(n,t,e=7){let s=Math.max(8,Math.floor(t/e)),i=1,r=0;for(let a of n.split(/\s+/).filter(Boolean)){let o=a.length;for(r===0?r=o:r+1+o<=s?r+=1+o:(i++,r=o);r>s;)i++,r-=s}return i}var Ks=25,Fs=15,Bt=3;function js(n){return Math.max(0,Math.min(Bt,Math.floor((n-Ks)/Fs)))}function Vn(n,t){let e=Math.min(Bt,zt(n,t-19,6.6));return Ks+e*Fs+2}function Wn(n,t){let e=t-23,s=`${k(n.start)}–${k(n.end)}`+(n.arrive_by!=null?` · arrive ${k(n.arrive_by)}`:""),i=33+zt(s,e,6.6)*16;for(let r of[n.lines.drop,n.lines.pick])r&&(i+=2+zt(r.text,e,7)*16);return i+4}function Gs(n,t,e,s){let i=t==="compact",{columns:r,sepX:a,width:o}=qn(n,e),l=new Map(r.map(v=>[v.id,v])),c=Te(n),f=ge(n),p=[...c,...f],u=le(n),m=Un(n),x=v=>J(n,v),g=v=>fe(n,v),y={mode:t,width:o,height:0,columns:r,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},C=0;return n.days.forEach((v,N)=>{let K=N*1440,E=new Map(v.events.map(h=>[h.id,h])),O=h=>h&&E.has(h)?{day:v.date,event:h}:null,Q=Ut(v),me=v.events.length,Ce=Ot(v.date,s.date);y.dayHeads.push({date:v.date,y:C,label:ve(v.date),tag:Ce,sub:(me?`${me} ${me===1?"activity":"activities"}`:"Nothing scheduled")+(Q?` · ${Q} to sort out`:""),warn:Q>0}),y.anchors.push({t:K,y:C});let de=C+ft+St,Re=f.flatMap(h=>v.drivers[h]?.outings??[]);if(!me&&!Re.length){y.empties.push({key:v.date,y:de,text:"Nothing planned"}),C=de+40,y.anchors.push({t:K+1439,y:C});return}let M=(h,T,_,P,A,S,$)=>{let B=u.get(h.kid)??F(0),H=h.lines;return{key:`${v.date}|card|${h.id}`,x:T,y:_,w:P,h:A,target:{day:v.date,event:h.id},event:h,color:B,kidName:x(h.kid),clash:S,stayed:h.stay&&f.includes(h.drop),skipped:h.attending===!1,title:jn(h.title,x(h.kid)),time:`${k(h.start)}–${k(h.end)}`+(h.arrive_by!=null?` · arrive ${k(h.arrive_by)}`:""),drop:H.drop,pick:H.pick,showDrop:!!H.drop&&($||A>=56),showPick:!!H.pick&&($||A>=74),wrap:$,aria:`${x(h.kid)}, ${h.title} ${k(h.start)} to ${k(h.end)}. `+(h.attending===!1&&!H.drop?"Not attending. ":"")+[H.drop,H.pick].filter(ne=>!!ne).map(ne=>ne.text).join(". ")}},ee=h=>{let T=v.rides[h];return T?(v.drivers[T.driver]?.segments??[]).filter(P=>P.type!=="home"&&P.kids.includes(T.kid)&&V(P.start)>=V(T.start)&&V(P.end)<=V(T.end)):[]},z=h=>{let T=v.rides[h];if(!T)return null;let _=T.serves.find(P=>E.get(P)?.kid===T.kid);return O(_??T.serves[0])},X=new Map;for(let h of v.issues)h.level!=="problem"||!h.event||(h.kind==="late"&&X.set(h.event,`${Math.round(V(h.minutes))} min late`),h.kind==="waiting"&&X.set(`${h.event}|pick`,`Waits ${Math.round(V(h.minutes))} min`));if(!i){let h=1/0,T=-1/0;for(let $ of v.events)h=Math.min(h,$.start-20,$.arrive_by!=null?$.arrive_by-10:1/0),T=Math.max(T,$.end+20);for(let $ of Re)$.start!=null&&(h=Math.min(h,$.start)),$.end!=null&&(T=Math.max(T,$.end));v.date===s.date&&Number.isFinite(h)&&s.minutes>h-60&&s.minutes<T&&(h=Math.min(h,s.minutes-15));let _=Number.isFinite(h)?Math.floor((h-5)/30)*30:900,P=Number.isFinite(T)?Math.ceil((T+5)/30)*30:960,A=$=>Math.round(de+(Math.max(_,Math.min(P,$))-_)*Nn);y.anchors.push({t:K+_,y:A(_)},{t:K+P,y:A(P)});for(let $ of c){let B=l.get($),H=u.get($),ne=(v.kids[$]?.items??[]).filter(D=>D.start!=null&&D.end!=null).map(D=>({item:D,s:V(D.start),en:V(D.end)}));for(let D of On(ne)){let w=B.w/D.cols,L=Math.round(B.x+D.col*w),I=Math.round(w-(D.cols>1?4:0)),q=A(D.s),ce=D.item;if(ce.type==="act"){let W=E.get(ce.event??"");if(!W)continue;let Kt=Math.max(30,A(D.en)-q);if(y.cards.push(M(W,L,q,I,Kt,ce.clash,!1)),W.arrive_by!=null&&W.start-W.arrive_by>=5){let Yt=A(W.arrive_by);y.preps.push({key:`${v.date}|prep|${W.id}`,x:L,y:Yt,w:I,h:q-Yt+6,color:H,label:`Arrive by ${k(W.arrive_by)}`})}let Ft=X.get(W.id);Ft&&y.marks.push({key:`${v.date}|late|${W.id}`,x:L+I-4,y:q+4,text:Ft,right:!0});let Gt=X.get(`${W.id}|pick`);Gt&&y.marks.push({key:`${v.date}|wait|${W.id}`,x:L+4,y:q+Kt+2,text:Gt,right:!1});continue}let j=v.rides[ce.ride??-1];if(!j)continue;let be=Math.max(22,A(D.en)-q),Ne=pt(ee(j.index),m),U=g(j.driver);y.rides.push({key:`${v.date}|ride|${j.index}`,x:L,y:q,w:I,h:be,target:z(j.index),l1:`${j.own?"In":"Along in"} ${U}’s car`,l2:Ne.join(" → "),show2:js(be)>0,lines2:js(be),dashed:!j.own,clash:ce.clash,aria:`${x($)} ${j.own?"in":"riding along in"} ${U}’s car, ${k(V(j.start))} to ${k(V(j.end))}: ${Ne.join(" to ")}`});let xe=l.get(j.driver);xe&&y.bands.push({key:`${v.date}|band|${j.index}`,x:L+I,y:q,w:Math.max(0,xe.x+8-(L+I)),h:be,color:H})}}for(let $ of f){let B=l.get($),H=v.drivers[$];if(!H)continue;let ne=[],D=null;for(let w of H.segments)if(!(w.start==null||w.end==null)){if(w.type==="home"){D=null;continue}if(w.type==="stay"){D=null,ne.push({type:"stay",g:w,s:w.start,en:w.end});continue}D&&D.en===w.start?(D.en=w.end,D.legs.push(w)):(D={type:"trip",s:w.start,en:w.end,legs:[w]},ne.push(D))}for(let w of ne){let L=A(w.s),I=Math.max(24,A(w.en)-L);if(w.type==="stay"){let U=E.get(w.g.event??w.g.serves??""),xe=U?u.get(U.kid)??F(0):F(0),W=w.g.kids.map(x);y.stays.push({key:`${v.date}|stay|${$}|${w.s}`,x:B.x+8,y:L,w:B.w-16,h:I,target:O(U?.id),color:xe,l1:U?`At ${U.title} with ${x(U.kid)}`:"Staying",l2:`until ${k(w.en)}`+(W.length?` · ${W.join(" and ")} too`:"")});continue}let q=w.legs[0],ce=w.legs[w.legs.length-1],j=[];for(let U of w.legs)for(let xe of U.kids)j.includes(xe)||j.push(xe);let be=ce.type==="drive"&&ce.to==="home",Ne=pt(w.legs,m);y.trips.push({key:`${v.date}|trip|${$}|${w.s}`,x:B.x+8,y:L,w:B.w-16,h:I,target:O(w.legs.find(U=>U.serves)?.serves),l1:q.type==="drive"&&q.from==="home"?`Leave ${k(w.s)}`:`From ${ut(m,q.from??q.place)} ${k(w.s)}`,l2:Ne.join(" → "),show2:I>=36,l3:be?`Home ${k(w.en)}`:"",show3:be&&I>=62,stops:null,kids:j.map(U=>(u.get(U)??F(0)).color),bad:w.legs.some(U=>U.overlaps_busy),aria:`${g($)} drives ${Ne.join(" to ")}, ${k(w.s)} to ${k(w.en)}`})}for(let w of H.segments)if(!(!w.overlaps_busy||w.start==null||w.end==null))for(let L of H.busy){let I=Math.max(w.start,L.start),q=Math.min(w.end,L.end);q<=I||y.overlaps.push({key:`${v.date}|overlap|${$}|${I}`,x:B.x+6,y:A(I)-2,w:B.w-12,h:Math.max(8,A(q)-A(I)+4)})}for(let w of H.busy){if(w.end<=_||w.start>=P)continue;let L=A(w.start),I=A(w.end);y.busy.push({key:`${v.date}|busy|${$}|${w.start}`,x:B.x+1,y:L,w:B.w-2,h:I-L,labelY:8,label:qs(w,!1)})}}let S=-1/0;for(let $=_;$<=P;$+=30)y.grid.push({key:`${v.date}|grid|${$}`,y:A($),strong:$%60===0}),$%60===0&&A($)-S>=22&&(y.hours.push({key:`${v.date}|hour|${$}`,y:A($)-8,label:ps($)}),S=A($));v.date===s.date&&s.minutes>_&&s.minutes<P&&(y.now={y:A(s.minutes),label:`Now ${k(s.minutes)}`}),C=A(P)+St;return}let te=[];for(let h of c){let T=l.get(h);for(let _ of v.kids[h]?.items??[])if(_.start!=null){if(_.type==="act"){let P=E.get(_.event??"");if(!P)continue;te.push({col:h,s:_.start,h:Wn(P,T.w),kind:"act",item:_})}else if(!v.rides[_.ride??-1]?.own){let P=v.rides[_.ride??-1],A=P?pt(ee(P.index),m).join(" → "):"";te.push({col:h,s:_.start,h:Vn(A,T.w),kind:"along",item:_})}}}for(let h of f){let T=v.drivers[h];if(T){for(let _ of T.busy)te.push({col:h,s:_.start,h:32,kind:"busy",busy:_});for(let _ of T.outings)_.start!=null&&te.push({col:h,s:_.start,h:30+_.lines.length*16+(_.warn?16:0),kind:"out",out:_})}}te.sort((h,T)=>h.s-T.s||p.indexOf(h.col)-p.indexOf(T.col));let Ee=new Map,R=de;te.forEach((h,T)=>{let _=Ee.get(h.col),P=Math.max(_!=null?_+zn:de,R);Ee.set(h.col,P+h.h),R=P,y.anchors.push({t:K+h.s,y:P});let A=l.get(h.col);if(h.kind==="busy")y.busy.push({key:`${v.date}|busy|${h.col}|${T}`,x:A.x+1,y:P,w:A.w-2,h:h.h,labelY:8,label:qs(h.busy,!0)});else if(h.kind==="out"){let S=h.out;y.trips.push({key:`${v.date}|trip|${h.col}|${T}`,x:A.x+8,y:P,w:A.w-16,h:h.h,target:O(S.target),l1:S.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...S.lines.map($=>({text:$,warn:!1})),...S.warn?[{text:S.warn,warn:!0}]:[]],kids:S.kids.map($=>(u.get($)??F(0)).color),bad:!!S.warn,aria:`${g(h.col)}: ${S.lead}. ${S.lines.join(". ")}${S.warn?`. ${S.warn}`:""}`})}else if(h.kind==="act"){let S=E.get(h.item.event??"");y.cards.push(M(S,A.x,P,A.w,h.h,h.item.clash,!0))}else{let S=v.rides[h.item.ride??-1],$=pt(ee(S.index),m),B=g(S.driver);y.rides.push({key:`${v.date}|ride|${S.index}`,x:A.x,y:P,w:A.w,h:h.h,target:z(S.index),l1:`Along with ${B} ${k(V(S.start))}`,l2:$.join(" → "),show2:!0,lines2:Bt,dashed:!0,clash:h.item.clash,aria:`${x(h.col)} riding along with ${B}, ${k(V(S.start))} to ${k(V(S.end))}: ${$.join(" to ")}`})}});let se=de;for(let h of Ee.values())se=Math.max(se,h);C=se+St+6,y.anchors.push({t:K+1439,y:C})}),y.height=C,y}var Kn=["","¼","½","¾"];function Ae(n){return n.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(t,e)=>{let s=Number(e);if(s>=59.5)return Oe(s);let i=Math.round(s*4),r=Math.floor(i/4),a=Kn[i%4];return`${r||!a?r:""}${a} min`})}function Ys(n){let t=e=>e?{...e,text:Ae(e.text)}:null;return{...n,days:n.days.map(e=>({...e,events:e.events.map(s=>({...s,lines:{drop:t(s.lines.drop),pick:t(s.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([s,i])=>[s,{...i,outings:i.outings.map(r=>({...r,lines:r.lines.map(Ae),warn:r.warn==null?r.warn:Ae(r.warn)}))}])),issues:e.issues.map(s=>({...s,title:Ae(s.title),body:Ae(s.body),note:s.note==null?s.note:Ae(s.note),...s.suggestions?{suggestions:s.suggestions.map(i=>({...i,note:Ae(i.note)}))}:{}}))}))}}var Fn=2,Gn=48;function Js(n,t,e=Gn){let s=[],i=0,r=0,a=0,o=0,l=t.minutes+e*60;for(let c of n.days){let f=pe(t.date,c.date),p=f===0?"":`${G(c.date)} · `,u=new Map(c.events.map(g=>[g.id,g])),m=g=>g&&u.has(g)?{day:c.date,event:g}:null,x=(g,y)=>f*1440+(g??u.get(y??"")?.start??0)<l;for(let g of c.issues)if(g.level==="problem"){if(!x(g.at,g.event)){a++,g.kind==="unassigned"&&o++;continue}i++,g.kind==="unassigned"&&r++,s.push({key:`${c.date}|${g.key}`,tone:g.kind==="unassigned"?"unassigned":"problem",title:p+g.title,body:g.body,target:m(g.event),suggestions:(g.suggestions??[]).map(y=>({id:y.id,label:y.label,note:y.note}))})}if(c.clashes.forEach((g,y)=>{if(!x(g.a.start,g.a.event)){a++;return}i++;let C=u.get(g.a.event??""),v=J(n,g.kid),N=(E,O)=>{let Q=m(O);return Q?{text:E,target:Q}:E},K=[];if(g.b.type==="act"){let E=u.get(g.b.event??"");C&&E&&(K=[N(C.title,C.id),` ${k(C.start)}–${k(C.end)} and `,N(E.title,E.id),` ${k(E.start)}–${k(E.end)} overlap.`])}else{let E=c.rides[g.b.ride??-1];C&&E&&(K=[`${v} is in `,N(`${fe(n,E.driver)}’s car`,E.serves[0]),` ${k(V(g.b.start))}–${k(V(g.b.end))}, during `,N(C.title,C.id),"."])}s.push({key:`${c.date}|clash|${y}`,tone:"problem",title:`${p}${v} is double-booked`,body:K.map(E=>typeof E=="string"?E:E.text).join(""),parts:K,target:null,suggestions:[]})}),f>=0&&f<Fn)for(let g of c.issues)g.level!=="heads_up"||!x(g.at,g.event)||s.push({key:`${c.date}|${g.key}`,tone:"heads_up",title:p+g.title,body:g.body,target:m(g.event),suggestions:[]});for(let g of c.events)!g.problems.length||!x(g.start)||s.push({key:`${c.date}|notes|${g.id}`,tone:"heads_up",title:`${p}Check the notes on ${J(n,g.kid)}’s ${g.title}`,body:`These lines couldn’t be read: ${g.problems.join("; ")}`,target:m(g.id),suggestions:[]})}return{items:s,problems:i,unassigned:r,later:a,laterUnassigned:o}}function Xs(n,t){let e=le(n),s=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of n.days){let a=pe(t.date,r.date);if(!(a<0))for(let o of ge(n))for(let l of r.drivers[o]?.outings??[]){if(l.start==null)continue;let c=a*1440+l.start;if(a*1440+V(l.end,l.start)<=t.minutes)continue;let p=c-t.minutes,u={driver:o,name:fe(n,o),date:r.date,ahead:a,start:l.start,inMinutes:p,ongoing:p<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(m=>e.get(m)??F(0)),warn:l.warn,target:l.target&&r.events.some(m=>m.id===l.target)?{day:r.date,event:l.target}:null};(!s||i(u)<i(s)||i(u)===i(s)&&u.inMinutes<s.inMinutes)&&(s=u)}}return s}function De(n){return n.state==="done"||n.state==="late"}function Zs(n){return n.state==="open"||n.state==="overdue"}function Qs(n,t,e){if(De(n)){let s=n.done_at?Jn(n.done_at,t,e):"";return n.state==="late"?`Done late${s?` · ${s}`:""}`:`Done${s?` ${s}`:""}`}if(n.state==="overdue")return n.missed>1?`Missed ${n.missed} times`:n.due?`Missed ${Yn(n.due,t)}`:"Missed";if(n.state==="upcoming"){let s=n.shows_from??n.due;if(!n.due||!s||n.due<=s)return"";let i=pe(t,n.due);return`By ${i===1?"tomorrow":i<7?G(n.due):Ht(n.due)}`}if(n.due&&n.due>t){let s=pe(t,n.due);return s===1?"By tomorrow":`By ${s<7?G(n.due):Ht(n.due)}`}return n.missed?`Today · missed ${n.missed===1?"once":`${n.missed} times`} before`:"Today"}function Yn(n,t){let e=pe(t,n);return e===0?"today":e===-1?"yesterday":Math.abs(e)<7?G(n):Ht(n)}function Ht(n){let[t,e,s]=n.split("-").map(Number);return new Date(Date.UTC(t,e-1,s)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Jn(n,t,e){let s=new Date(n);if(Number.isNaN(s.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let r=s.toLocaleDateString("en-CA",{timeZone:i}),a=s.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return r===t?a:`${G(r)} ${a}`}function en(n,t){let e=[...n.chores].sort((s,i)=>s.order-i.order);return n.kids.map((s,i)=>{let r=e.filter(c=>c.kid===s.id),a=new Map;for(let c of r){if(c.state!=="upcoming")continue;let f=c.shows_from??c.due??n.today;a.set(f,[...a.get(f)??[],c])}let o=r.filter(c=>c.state==="overdue"),l=r.filter(c=>c.state==="open");return{kid:s.id,name:s.name,color:t?.get(s.id)??F(i),overdue:o,now:l,done:r.filter(De),later:[...a.entries()].sort(([c],[f])=>c.localeCompare(f)).map(([c,f])=>({date:c,chores:f})),left:o.length+l.length}})}function tn(n){return[...n.chores].filter(t=>t.state==="overdue"||t.state==="open"&&(t.due==null||t.due<=n.today)).sort((t,e)=>t.state===e.state?t.order-e.order:t.state==="overdue"?-1:1)}function qt(n){return!n.chores.length&&!n.templates.length}var Xn={timeline:"timeline",full:"timeline",compact:"compact"};function jt(n){let t=new URLSearchParams(n),e={},s=Xn[(t.get("view")??"").trim().toLowerCase()];s&&(e.view=s);let i=(t.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores")&&(e.page=i),e}var Zn=["auth_callback","code","state"];function Vt(n){let t=new URLSearchParams(n);for(let s of Zn)t.delete(s);let e=t.toString();return e?`?${e}`:""}var sn=wt`
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
`;var nn="mydashlight.rides.mode",Qn=1100,ei=440,ti=700,si=3*6e4,ni=1200;function ii(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}function Ke(n){let t=/\p{L}|\p{N}/u.exec(n);return t?t[0].toUpperCase():"?"}function ri(n,t){return Ot(n,t)||ve(n).split(",")[0]}function oi(n){let t=n.map(e=>`${e}’s`);return t.length<2?t[0]??"":`${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`}function ai(){try{return localStorage.getItem(nn)==="compact"?"compact":"timeline"}catch{return"timeline"}}function li(n){try{localStorage.setItem(nn,n)}catch{}}function mt(n){return n.days.every(t=>!t.events.length)}var Fe=class extends he{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=jt(location.search).view;this.urlPage=jt(location.search).page;this.stopChores=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let s=e.currentTarget;this.drag={el:s,x:e.clientX,y:e.clientY,top:s.scrollTop,left:s.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let s=this.drag;if(!s)return;let i=e.clientX-s.x,r=e.clientY-s.y;if(!s.moved){if(Math.abs(i)+Math.abs(r)<6)return;s.moved=!0;try{s.el.setPointerCapture(s.id)}catch{}s.el.classList.add("dragging")}s.el.scrollTop=s.top-r,s.el.scrollLeft=s.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},si))};this.onKey=e=>{e.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??ai(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),s=`${e.date}|${e.minutes}`;s!==this.minuteKey&&(this.minuteKey=s,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let s=this.keepAt;this.keepAt=null,this.scrollToTime(s)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.backend&&(this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let s=new Map(this.choreDraft);for(let i of e.chores)s.has(i.id)&&De(i)===s.get(i.id)&&s.delete(i.id);for(let i of s.keys())e.chores.some(r=>r.id===i)||s.delete(i);this.choreDraft=s}}),this.stopWatching=this.backend.watch(e=>{this.plan=Ys(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Qn)return!1;let e=this.plan;return!e||this.width-ei>=It(Te(e).length,ge(e).length)}today(){return Ue(this.plan?.time_zone??ii())}currentBoard(){let e=this.plan;if(!e)return null;let s=this.today(),i=`${this.mode}|${this.boardWidth}|${s.date}|${s.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=Gs(e,this.mode,this.boardWidth,s),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(s=>s.date===e):-1}scrollToTime(e,s){let i=this.scroller;if(!i||!this.board)return;let r=this.board.dayHeads.find(a=>a.date===s)?.y??0;i.scrollTop=Math.max(r,Vs(this.board,e)-ft-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),s=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(s*1440+(this.mode==="timeline"&&s===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[s]?.date)}goToDay(e){let s=this.plan;if(!s)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),a=s.days[r];if(!a)return;let o=1/0;if(this.mode==="timeline"){for(let l of a.events)o=Math.min(o,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let c of l.outings)c.start!=null&&(o=Math.min(o,c.start))}this.scrollToTime(r*1440+(Number.isFinite(o)?Math.max(0,o-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let s=e.scrollTop,i=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=s+1&&(i=c);let r=this.renderRoot,a=r.querySelector(".pinned .label"),o=r.querySelector(".pinned .tag"),l=r.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),o&&(o.textContent!==i.tag&&(o.textContent=i.tag),o.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let c of r.querySelectorAll(".day-tile"))c.classList.toggle("in-view",c.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.page=e,e==="rides"&&(this.scrolledOnce=!1))}async toggleChore(e){if(!this.backend)return;let s=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,s),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,s)}catch(r){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let o=r instanceof Y?r:new Y("error",String(r));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??De(e)}setMode(e){if(e===this.mode)return;let s=this.scroller;this.keepAt=s&&this.board?Ws(this.board,s.scrollTop+ft+4):null,this.mode=e,this.urlView||li(e)}findEvent(e){let s=this.plan?.days.find(r=>r.date===e.day),i=s?.events.find(r=>r.id===e.event);return s&&i?{day:s,event:i}:null}open(e,s=!1){e&&(this.flushArrive(),this.sel=e,this.scope="this",this.arriveDraft=void 0,s&&this.reveal(e))}reveal(e){let s=this.findEvent(e),i=this.dayIndexOf(e.day);!s||i<0||this.scrollToTime(i*1440+Math.max(0,(s.event.arrive_by??s.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,s,i){if(!this.pending){this.pending={key:e,value:s};try{await i()}catch(r){let a=r instanceof Y?r:new Y("error",String(r));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,s,i){if(!this.backend)return;let r=this.backend;this.save(`${s}`,i,()=>r.setRide(e.id,s,i,this.scope))}setAttending(e,s){if(!this.backend||e.attending!==!1===s)return;let i=this.backend;this.save("attending",s,()=>i.setAttending(e.id,s,this.scope))}toggleStay(e){if(!this.backend)return;let s=this.backend;this.save("stay",!e.stay,()=>s.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,s){if(!this.backend)return;let i=this.backend,r=e.along.includes(s)?e.along.filter(a=>a!==s):[...e.along,s];this.save("along",r,()=>i.setTakeAlong(e.id,r,this.scope))}nudgeArrive(e,s){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;s<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),ni)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,s=this.sel;if(e===void 0||!s||!this.backend)return;let i=this.findEvent(s);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,a=i.event.id,o=this.scope;this.save("arrive",e,()=>r.setArriveBy(a,e,o)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let s=this.backend;this.save(`fix|${e}`,e,()=>s.applySuggestion(e))}render(){let e=this.plan,s=this.currentBoard(),i=e?Js(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,a=this.chores?tn(this.chores).filter(c=>!this.choreDone(c)):[],o=d`<aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
      ${this.sel&&e?this.renderEditor(e):this.renderAttention(i,a)}
    </aside>`,l=this.page==="rides";return d`
      <div class="app ${r?"wide":this.width<ti?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${l&&e?this.renderWeek(e):b}
          ${l?this.renderBanner(e):b}
          <main>
            ${l?d`<section class="board-area" aria-label="Everyone’s week">
                  ${s&&e?mt(e)?this.renderQuiet(e):this.renderBoard(s):this.renderEmpty()}
                </section>`:d`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel)?d`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${o}`:b}
          </main>
        </div>
        ${r?o:b}
        ${this.toast?d`<div class="toast" role="status">${this.toast}</div>`:b}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(e,s,i){let r=s.problems+i;this.tick;let a=this.today(),o="";if(e){let u=e.time_zone,m=new Date(e.updated);this.error?o=d`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Xe(m,new Date,u)}</span>`:e.status&&!e.status.ok?o=d`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Xe(m,new Date,u)}</span>`:this.backend?.live||(o=`Updated ${Xe(m,new Date,u)}`)}let l=(u,m,x,g)=>d`
      <button type="button" class="seg-btn" title=${g} aria-pressed=${this.mode===u?"true":"false"} @click=${()=>this.setMode(u)}>
        ${x}<span class="seg-label">${m}</span>
      </button>
    `,c=(u,m,x)=>d`
      <button type="button" class="seg-btn" aria-pressed=${this.page===u?"true":"false"} @click=${()=>this.setPage(u)}>
        ${x}<span class="seg-label">${m}</span>
      </button>
    `,f=Le(a.minutes),p=!!e&&mt(e);return d`
      <header>
        ${this.showMenu?d`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${ae`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:b}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ve(a.date)}, ${f}`}>
            <span class="hm">${f.slice(0,-3)}</span><span class="ampm">${f.slice(-2)}</span>
          </h1>
          <p class="today-line">${ve(a.date)}</p>
          ${o?d`<p class="status">${o}</p>`:b}
        </div>
        ${e&&!p?this.renderNext(e,Xs(e,a),s):b}
        <div class="controls">
          ${this.wide||p&&!i?b:d`<button type="button" class="attn-btn ${r?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${r}</span>
              </button>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${c("rides","Rides",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${c("chores","Chores",ae`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
          </div>
          ${this.page!=="rides"?b:d`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",ae`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
        </div>
      </header>
    `}renderNext(e,s,i){if(!s){let c=this.today().date,f=i.unassigned,p=i.laterUnassigned;if(f){let m=d`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${f} ${f===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?d`<div class="next idle needs">${m}</div>`:d`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${m}</button>`}if(p)return d`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${p} ${p===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let u=e.days.some(m=>m.date>=c&&m.events.length);return d`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${u?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${u?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let r;s.ongoing?r="On the road now":s.ahead===0?r=s.inMinutes<180?`Next trip · in ${Oe(s.inMinutes)}`:"Next trip · later today":s.ahead===1?r="Next trip · tomorrow":r=`Next trip · ${G(s.date)}`;let a=!s.ongoing&&s.ahead===0&&s.inMinutes<=30,o=d`
      <span class="next-eyebrow">${r}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${Ke(s.name)}</span>
        <span class="next-lead">${s.name} · ${s.lead}</span>
        <span class="next-kids">${s.kids.map(c=>d`<span class="kid-dot" style="background:${c.color}"></span>`)}</span>
      </span>
      ${s.warn?d`<span class="next-stop warn">${s.warn}</span>`:s.stop?d`<span class="next-stop">${s.stop}</span>`:b}
    `,l=`next ${s.ongoing?"ongoing":a?"soon":""}`;return s.target?d`<button type="button" class=${l} @click=${()=>this.open(s.target)}>${o}</button>`:d`<div class=${l}>${o}</div>`}renderWeek(e){let s=this.today().date,i=le(e);return d`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let a=Ut(r),o=r.events.length,l=r.events.slice(0,6).map(f=>i.get(f.kid)?.color??F(0).color),c=`${ve(r.date)}: ${o?`${o} ${o===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return d`<button
          type="button"
          class="day-tile ${r.date===s?"today":""}"
          data-date=${r.date}
          aria-label=${c}
          @click=${()=>this.goToDay(r.date)}
        >
          <span class="dt-wd">${r.date===s?"Today":G(r.date)}</span>
          <span class="dt-num">${Number(r.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(f=>d`<span class="dt-dot" style="background:${f}"></span>`):d`<span class="dt-free">free</span>`}
            ${o>6?d`<span class="dt-more">+${o-6}</span>`:b}
          </span>
          ${a?d`<span class="dt-badge" aria-hidden="true">${a}</span>`:b}
        </button>`})}
    </nav>`}renderQuiet(e){let s=Te(e),i=ge(e),r=le(e),a=s.map(o=>J(e,o));return d`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${s.slice(0,3).map((o,l)=>ae`<circle cx=${50+l*30} cy="80" r="11" fill=${r.get(o).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${oi(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${s.map(o=>{let l=r.get(o);return d`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${Ke(J(e,o))}</span>
            <span class="qw-name">${J(e,o)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(o=>d`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${Ke(fe(e,o))}</span>
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
    </div>`}renderBanner(e){let s=e?.unavailable_calendars.length??0;return s?d`<div class="banner" role="status">
      Couldn’t read ${s===1?"one calendar":`${s} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:b}renderEmpty(){return this.error?d`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:d`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let s=this.sel,i=o=>!!o&&!!s&&o.day===s.day&&o.event===s.event,r=e.dayHeads[0],a=e.width;return d`
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
              <span class="avatar ${o.kind}" aria-hidden="true">${Ke(o.name)}</span>
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
              <span class="label">${o.label}</span>${o.tag?d`<span class="tag">${o.tag}</span>`:b}<span
                class="sub ${o.warn?"warn":""}"
                >${o.sub}</span
              >
            </div>`)}
          ${e.empties.map(o=>d`<span class="empty" style="top:${o.y}px">${o.text}</span>`)}
          ${e.grid.map(o=>d`<div class="grid ${o.strong?"strong":""}" style="top:${o.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(o=>d`<span class="hour" style="top:${o.y}px">${o.label}</span>`)}
          ${Z(e.bands,o=>o.key,o=>d`<div
                class="band"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:rgba(${o.color.rgb},0.10);border-color:rgba(${o.color.rgb},0.45)"
              ></div>`)}
          ${Z(e.busy,o=>o.key,o=>d`<div class="busy" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px">
                <span style="top:${o.labelY}px">${o.label}</span>
              </div>`)}
          ${Z(e.preps,o=>o.key,o=>d`<div
                class="prep"
                aria-hidden="true"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:rgba(${o.color.rgb},0.07);color:${o.color.ink}"
              >
                ${o.label}
              </div>`)}
          ${Z(e.cards,o=>o.key,o=>{let l=o.color,c=o.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:o.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return d`<button
                type="button"
                class="card ${o.wrap?"wrap":""} ${i(o.target)?"sel":""} ${o.clash?"clash":""} ${o.skipped?"skipped":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:${c};border-color:${o.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(o.target)}
              >
                <span class="top">
                  <span class="title">${o.title}</span>
                  <span class="time">${o.time}</span>
                  ${o.showDrop&&o.drop?d`<span class="line tone-${o.drop.tone}">${o.drop.text}</span>`:b}
                </span>
                ${o.showPick&&o.pick?d`<span class="line tone-${o.pick.tone}">${o.pick.text}</span>`:b}
              </button>`})}
          ${Z(e.rides,o=>o.key,o=>d`<button
                type="button"
                class="ride ${o.dashed?"dashed":""} ${o.clash?"clash":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}</span>${o.show2?d`<span class="l2" style="-webkit-line-clamp:${o.lines2}">${o.l2}</span>`:b}
              </button>`)}
          ${Z(e.stays,o=>o.key,o=>d`<button
                type="button"
                class="stay"
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-color:${o.color.color};background:repeating-linear-gradient(135deg, rgba(${o.color.rgb},0.28) 0px, rgba(${o.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1" style="color:${o.color.ink}">${o.l1}</span><span class="l2">${o.l2}</span>
              </button>`)}
          ${Z(e.trips,o=>o.key,o=>d`<button
                type="button"
                class="trip ${o.bad?"bad":""} ${o.stops?"list":""}"
                aria-label=${o.aria}
                style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"
                @click=${()=>this.open(o.target)}
              >
                <span class="l1">${o.l1}${o.kids.map(l=>d`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${o.show2?d`<span class="l2">${o.l2}</span>`:b}
                ${o.stops?o.stops.map(l=>d`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):b}
                ${o.show3?d`<span class="l3">${o.l3}</span>`:b}
              </button>`)}
          ${Z(e.overlaps,o=>o.key,o=>d`<div class="overlap" aria-hidden="true" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`)}
          ${Z(e.marks,o=>o.key,o=>d`<span class="mark" style="left:${o.x}px;top:${o.y}px;${o.right?"transform:translateX(-100%)":""}">${o.text}</span>`)}
          ${e.now?d`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:b}
        </div>
      </div>
    `}renderAttention(e,s){let{items:i,problems:r,later:a}=e,o=this.plan,l=r+s.length,c=this.chores,f=!!c&&!qt(c);return d`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?b:d`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${f?d`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${s.length?d`<div class="attn-chores">${s.map(p=>this.renderChoreRow(p,!0))}</div>`:d`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:d`<p class="panel-sub">Rides in the next two days</p>`}
      ${o&&!r?d`<div class="all-clear">
            <span class="check" aria-hidden="true">${ae`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${mt(o)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:b}
      ${i.map(p=>d`<div class="issue ${p.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${p.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${p.target?d`<button type="button" class="issue-title" @click=${()=>this.open(p.target,!0)}>${p.title}</button>`:d`<strong class="issue-title">${p.title}</strong>`}
              <span class="issue-body"
                >${p.parts?p.parts.map(u=>typeof u=="string"?u:d`<button type="button" class="issue-link" @click=${()=>this.open(u.target,!0)}>${u.text}</button>`):p.body}</span
              >
            </div>
          </div>
          ${p.suggestions.length?d`<div class="fixes">
                ${p.suggestions.map(u=>d`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(u.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${u.id}`?"Saving…":u.label}</span>
                    <span class="fix-note">${u.note}</span>
                  </button>`)}
              </div>`:b}
        </div>`)}
      ${this.wide&&o&&!mt(o)&&this.page==="rides"?this.renderLegend():b}
    `}renderChoreRow(e,s=!1){let i=this.chores,r=this.choreDone(e),a=i.kids.findIndex(y=>y.id===e.kid),o=(this.plan?le(this.plan).get(e.kid):void 0)??F(Math.max(0,a)),l=i.kids[a]?.name??"",c=r===De(e)?e:{...e,state:r?"done":"open",done_at:r?new Date().toISOString():null},f=Qs(c,i.today,i.time_zone),p=r||Zs(e),u=`${s?`${l}: `:""}${e.title}. ${f?`${f}. `:""}${r?"Done. Tap to undo.":"Tap when it’s done."}`,m=d`<span class="box" aria-hidden="true"
        >${r?ae`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:b}</span
      >
      ${e.icon?d`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:b}
      <span class="chore-text">
        <span class="chore-title">${s?d`<span class="chore-kid">${l}</span> · `:b}${e.title}</span>
        ${f?d`<span class="chore-note">${f}</span>`:b}
      </span>`,x=`chore ${r?"done":""} ${e.state==="overdue"&&!r?"overdue":""} ${p?"":"later"}`,g=`--c:${o.color};--rgb:${o.rgb};--k:${o.ink}`;return p?d`<button type="button" class=${x} style=${g} aria-pressed=${r?"true":"false"} aria-label=${u} @click=${()=>void this.toggleChore(e)}>
          ${m}
        </button>`:d`<div class=${x} style=${g}>${m}</div>`}renderChores(){let e=this.chores;if(e===void 0)return d`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return d`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return d`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return d`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;let s=e.templates.filter(a=>a.problems.length),i=s.length?d`<div class="banner">
          ${s.map(a=>d`<div><strong>${a.title}</strong>: ${a.problems.join("; ")}</div>`)}
        </div>`:b;if(qt(e)){let a=e.kids[0]?.name??"Ava";return d`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Chores come from Google Tasks, in the Google account MyDashLight signs in with.</p>
        <ol>
          <li>Open Google Tasks and pick the list <strong>Chore templates: Daily</strong> (or Weekly or Monthly).</li>
          <li>Add a task named for the chore, such as <strong>🛏️ Make bed</strong>.</li>
          <li>In its details, add a line <code>Who: ${a}</code>. Add <code>Days: Mon-Fri</code> for weekdays only.</li>
        </ol>
        <p>Within a minute it shows here, and on ${a}’s own list in Google Tasks.</p>
      </div>`}let r=en(e,this.plan?le(this.plan):void 0);return d`<div class="chores-scroll">
      ${i}
      <div class="chore-cols" style="--n:${r.length}">
        ${r.map(a=>{let o=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return d`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${Ke(a.name)}</span>
              <span class="ch-text">
                <span class="name">${a.name}</span>
                <span class="sub">${o?`${o} to do`:a.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
            </div>
            ${a.overdue.length?d`<h3 class="chore-group overdue">Missed</h3>
                  ${a.overdue.map(l=>this.renderChoreRow(l))}`:b}
            ${a.now.length?d`<h3 class="chore-group">To do</h3>
                  ${a.now.map(l=>this.renderChoreRow(l))}`:b}
            ${a.done.length?d`<h3 class="chore-group">Done</h3>
                  ${a.done.map(l=>this.renderChoreRow(l))}`:b}
            ${a.later.map(l=>d`<h3 class="chore-group">${ri(l.date,e.today)}</h3>
                ${l.chores.map(c=>this.renderChoreRow(c))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?d`<p class="chore-none">No chores this week.</p>`:b}
          </section>`})}
      </div>
    </div>`}renderLegend(){return d`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let s=this.findEvent(this.sel);if(!s)return d``;let{day:i,event:r}=s,a=ge(e),l=le(e).get(r.kid)??F(0),c=!!this.pending,f=M=>this.pending?.key===M?this.pending.value:void 0,p=[...e.people?.carpools??[]];for(let M of e.days)for(let ee of M.events)for(let z of[ee.drop,ee.pick])z&&z!=="none"&&!a.includes(z)&&!p.some(X=>X.toLowerCase()===z.toLowerCase())&&p.push(z);let u=M=>{if(!r.sides.includes(M))return b;let ee=f(M),z=ee!==void 0?String(ee):M==="drop"?r.drop:r.pick,X=z&&z!=="none"&&!a.includes(z)?z:"",te=R=>this.setRide(r,M,z===R?"":R),Ee=[...a.map(R=>[R,Lt(e,R)]),["none","Not needed"]];return d`<div class="field">
        <span class="field-label">${M==="drop"?"Drop-off":"Pick-up"} ${z===""?d`<span class="nobody">· nobody yet</span>`:b}</span>
        <div role="group" aria-label=${M==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${Ee.length}, minmax(0, 1fr))">
          ${Ee.map(([R,se])=>d`<button type="button" class="choice" aria-pressed=${z===R?"true":"false"} ?disabled=${c} @click=${()=>te(R)}>
                ${se}
              </button>`)}
        </div>
        ${p.length?d`<div role="group" aria-label=${M==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${p.map(R=>d`<button type="button" class="chip" aria-pressed=${z.toLowerCase()===R.toLowerCase()?"true":"false"} ?disabled=${c} @click=${()=>te(R)}>
                    ${R}
                  </button>`)}
            </div>`:b}
        <input
          type="text"
          .value=${X&&!p.some(R=>R.toLowerCase()===X.toLowerCase())?X:""}
          ?disabled=${c}
          aria-label=${M==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${R=>{let se=R.target.value.trim();se&&se!==z&&this.setRide(r,M,se)}}
          @keydown=${R=>{R.key==="Enter"&&R.target.blur()}}
        />
      </div>`},m=f("stay"),x=m!==void 0?!!m:r.stay,g=r.drop===r.pick&&a.includes(r.drop),y=f("along"),C=y!==void 0?y:r.along,v=Te(e).filter(M=>M!==r.kid),N=a.includes(r.drop)&&r.sides.includes("drop"),K=f("arrive"),E=this.arriveDraft!==void 0?this.arriveDraft:K!==void 0?K:r.arrive_by,O=[],Q=M=>M==="none"?"Not needed":Lt(e,M);r.drop!==""&&O.push(`Drop-off: ${Q(r.drop)}`),r.pick!==""&&O.push(`Pick-up: ${Q(r.pick)}`),r.stay&&O.push("Stay: yes"),r.along.length&&O.push(`Take along: ${r.along.map(M=>J(e,M)).join(", ")}`),r.arrive_by!=null&&O.push(`Arrive by: ${Le(r.arrive_by)}`);let me=f("attending"),Ce=me!==void 0?!!me:r.attending!==!1;r.attending===!1&&O.splice(0,O.length,"Attending: no");let de=i.date===this.today().date?"":`${G(i.date)} · `,Re=d`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${J(e,r.kid)} · ${r.title}</span>
          <span class="ed-meta">${de}${k(r.start)}–${k(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return r.where==="home"?d`${Re}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${J(e,r.kid)} can’t get home in time, the board shows it as a clash.</p>`:d`
      ${Re}
      ${this.pending?d`<p class="saving" role="status">Saving to Google Calendar…</p>`:b}
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
          </div>`:b}
      <div class="field">
        <span class="field-label">${J(e,r.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${Ce?"true":"false"} ?disabled=${c} @click=${()=>this.setAttending(r,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${Ce?"false":"true"} ?disabled=${c} @click=${()=>this.setAttending(r,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${Ce?d`${r.where==="anywhere"?d`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:b}
            ${u("drop")} ${u("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${x?"true":"false"} ?disabled=${!g||c} @click=${()=>this.toggleStay(r)}>
          ${g?x?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${N&&v.length?d`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${v.map(M=>d`<button type="button" class="chip" aria-pressed=${C.includes(M)?"true":"false"} ?disabled=${c} @click=${()=>this.toggleAlong(r,M)}>
                  ${J(e,M)}
                </button>`)}
            </div>
          </div>`:b}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${E!=null?`${r.start-E} min before it starts`:`Aims for a few minutes before ${k(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${c} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${E!=null?k(E):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${c||E==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${E!=null?d`<button type="button" class="chip clear" ?disabled=${c} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:b}
`:d`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${O.length?O.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${r.problems.length?d`<p class="field-hint bad">These lines in the notes couldn’t be read: ${r.problems.join("; ")}</p>`:b}
      ${Ce?d`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:b}
    `}};Fe.styles=sn,Fe.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",Fe);var Wt="hassTokens";function di(){try{let n=localStorage.getItem(Wt);return n?JSON.parse(n):null}catch{return null}}function rn(n){try{n?localStorage.setItem(Wt,JSON.stringify(n)):localStorage.removeItem(Wt)}catch{}}function ci(n){let t=document.getElementById("problem");t&&(t.hidden=!1,t.querySelector("p").textContent=n)}async function pi(){let n=document.querySelector("mydashlight-board");if(n){n.kiosk=!0;try{let t=await ds({hassUrl:location.origin,loadTokens:async()=>di(),saveTokens:rn});location.search.includes("auth_callback")&&history.replaceState(null,"",location.pathname+Vt(location.search));let e=await cs({auth:t});n.backend=new Ze(e)}catch(t){if(t===2){rn(null),location.replace(location.pathname+Vt(location.search));return}ci(t===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(t)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}}pi();
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
