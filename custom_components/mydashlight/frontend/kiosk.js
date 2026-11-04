function pn(s){return{type:"auth",access_token:s}}function hn(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function un(s){let n={type:"subscribe_events"};return s&&(n.event_type=s),n}function Pt(s){return{type:"unsubscribe_events",subscription:s}}function fn(){return{type:"ping"}}function gn(s,n){return{type:"result",success:!1,error:{code:s,message:n}}}function bn(s){let n={},e=s.split("&");for(let t=0;t<e.length;t++){let i=e[t].split("="),o=decodeURIComponent(i[0]),a=i.length>1?decodeURIComponent(i[1]):void 0;n[o]=a}return n}var xn=(s,n,e,t)=>{let[i,o,a]=s.split(".",3);return Number(i)>n||Number(i)===n&&(t===void 0?Number(o)>=e:Number(o)>e)||t!==void 0&&Number(i)===n&&Number(o)===e&&Number(a)>=t};var ot=!1,zs="auth_required",Us="auth_invalid",Hs="auth_ok";function yn(s){if(!s.auth)throw 4;let n=s.auth,e=n.expired?n.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,t=n.wsUrl;ot&&console.log("[Auth phase] Initializing",t);function i(o,a,r){ot&&console.log("[Auth Phase] New connection",t);let l=new WebSocket(t),d=!1,g=()=>{if(l.removeEventListener("close",g),d){r(2);return}if(o===0){r(1);return}let v=o===-1?-1:o-1;setTimeout(()=>i(v,a,r),1e3)},c=async v=>{try{n.expired&&await(e||n.refreshAccessToken()),l.send(JSON.stringify(pn(n.accessToken)))}catch(k){d=k===2,l.close()}},p=async v=>{let k=JSON.parse(v.data);switch(ot&&console.log("[Auth phase] Received",k),k.type){case Us:d=!0,l.close();break;case Hs:l.removeEventListener("open",c),l.removeEventListener("message",p),l.removeEventListener("close",g),l.removeEventListener("error",g),l.haVersion=k.ha_version,xn(l.haVersion,2022,9)&&l.send(JSON.stringify(hn())),a(l);break;default:ot&&k.type!==zs&&console.warn("[Auth phase] Unhandled message",k)}};l.addEventListener("open",c),l.addEventListener("message",p),l.addEventListener("close",g),l.addEventListener("error",g)}return new Promise((o,a)=>i(s.setupRetry,o,a))}var qe=!1,at=class{constructor(n,e){this._handleMessage=t=>{let i=JSON.parse(t.data);Array.isArray(i)||(i=[i]),i.forEach(o=>{qe&&console.log("Received",o);let a=this.commands.get(o.id);switch(o.type){case"event":a?a.callback(o.event):(console.warn(`Received event for unknown subscription ${o.id}. Unsubscribing.`),this.sendMessagePromise(Pt(o.id)).catch(r=>{qe&&console.warn(` Error unsubsribing from unknown subscription ${o.id}`,r)}));break;case"result":a&&(o.success?(a.resolve(o.result),"subscribe"in a||this.commands.delete(o.id)):(a.reject(o.error),this.commands.delete(o.id)));break;case"pong":a?(a.resolve(),this.commands.delete(o.id)):console.warn(`Received unknown pong response ${o.id}`);break;default:qe&&console.warn("Unhandled message",o)}})},this._handleClose=async()=>{let t=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,t.forEach(a=>{"subscribe"in a||a.reject(gn(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),o=a=>{setTimeout(async()=>{if(!this.closeRequested){qe&&console.log("Trying to reconnect");try{let r=await i.createSocket(i);this._setSocket(r)}catch(r){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let d of l)d.reject&&d.reject(3)}r===2?this.fireEvent("reconnect-error",r):o(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),o(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(n)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(n){this.socket=n,this.haVersion=n.haVersion,n.addEventListener("message",this._handleMessage),n.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(o=>{i.unsubscribe=o,i.resolve()})}));let t=this._queuedMessages;if(t){this._queuedMessages=void 0;for(let i of t)i.resolve()}this.fireEvent("ready")}addEventListener(n,e){let t=this.eventListeners.get(n);t||(t=[],this.eventListeners.set(n,t)),t.push(e)}removeEventListener(n,e){let t=this.eventListeners.get(n);if(!t)return;let i=t.indexOf(e);i!==-1&&t.splice(i,1)}fireEvent(n,e){(this.eventListeners.get(n)||[]).forEach(t=>t(this,e))}suspendReconnectUntil(n){this.suspendReconnectPromise=n}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(n=!1){if(this.socket){if(!n){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(n,e){return this.subscribeMessage(n,un(e))}ping(){return this.sendMessagePromise(fn())}sendMessage(n,e){if(!this.connected)throw 3;if(qe&&console.log("Sending",n),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(n)});return}e||(e=this._genCmdId()),n.id=e,this.socket.send(JSON.stringify(n))}sendMessagePromise(n){return new Promise((e,t)=>{if(this._queuedMessages){this._queuedMessages.push({reject:t,resolve:async()=>{try{e(await this.sendMessagePromise(n))}catch(o){t(o)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:t}),this.sendMessage(n,i)})}async subscribeMessage(n,e,t){if(this._queuedMessages&&await new Promise((o,a)=>{this._queuedMessages.push({resolve:o,reject:a})}),t?.preCheck&&!await t.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((o,a)=>{let r=this._genCmdId();i={resolve:o,reject:a,callback:n,subscribe:t?.resubscribe!==!1?()=>this.subscribeMessage(n,e,t):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Pt(r)),this.commands.delete(r)}},this.commands.set(r,i);try{this.sendMessage(e,r)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var js=()=>`${location.protocol}//${location.host}/`,qs=s=>s*1e3+Date.now();function Ks(){let{protocol:s,host:n,pathname:e,search:t}=location;return`${s}//${n}${e}${t}`}function Vs(s,n,e,t){let i=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return n!==null&&(i+=`&client_id=${encodeURIComponent(n)}`),t&&(i+=`&state=${encodeURIComponent(t)}`),i}function Ws(s,n,e,t){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Vs(s,n,e,t)}async function kn(s,n,e){let t=typeof location<"u"&&location;if(t&&t.protocol==="https:"){let r=document.createElement("a");if(r.href=s,r.protocol==="http:"&&r.hostname!=="localhost")throw 5}let i=new FormData;n!==null&&i.append("client_id",n),Object.keys(e).forEach(r=>{i.append(r,e[r])});let o=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!o.ok)throw o.status===400||o.status===403?2:new Error("Unable to fetch tokens");let a=await o.json();return a.hassUrl=s,a.clientId=n,a.expires=qs(a.expires_in),a}function $n(s,n,e){return kn(s,n,{code:e,grant_type:"authorization_code"})}function Fs(s){return btoa(JSON.stringify(s))}function Gs(s){return JSON.parse(atob(s))}var Mt=class{constructor(n,e){this.data=n,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let n=await kn(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});n.refresh_token=this.data.refresh_token,this.data=n,this._saveTokens&&this._saveTokens(n)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let n=new FormData;n.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:n}),this._saveTokens&&this._saveTokens(null)}};async function _n(s={}){let n,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let t=s.clientId!==void 0?s.clientId:js(),i=s.limitHassInstance===!0;if(s.authCode&&e&&(n=await $n(e,t,s.authCode),s.saveTokens&&s.saveTokens(n)),!n){let o=bn(location.search.substr(1));if("auth_callback"in o){let a=Gs(o.state);if(i&&(a.hassUrl!==e||a.clientId!==t))throw 6;n=await $n(a.hassUrl,a.clientId,o.code),s.saveTokens&&s.saveTokens(n)}}if(!n&&s.loadTokens&&(n=await s.loadTokens()),n&&(e===void 0||n.hassUrl===e))return new Mt(n,s.saveTokens);if(e===void 0)throw 4;return Ws(e,t,s.redirectUrl||Ks(),Fs({hassUrl:e,clientId:t})),new Promise(()=>{})}async function An(s){let n=Object.assign({setupRetry:0,createSocket:yn},s),e=await n.createSocket(n);return new at(e,n)}function I(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function Ke(s){let n=Math.floor(Math.round(s)/60)%24;return`${I(s)} ${n<12?"AM":"PM"}`}function Tn(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function We(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function En(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Ys=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),Qs=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Js=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function lt(s){return new Date(`${s}T12:00:00Z`)}function Te(s){let n=lt(s);return`${Ys.format(n)}, ${Js.format(n)}`}function re(s){return Qs.format(lt(s))}function be(s,n){return Math.round((lt(n).getTime()-lt(s).getTime())/864e5)}function Ve(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return Ve("UTC",n)}let t=i=>e.find(o=>o.type===i)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function dt(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let i=Ve(e,s),o=Ve(e,n).date;return i.date===o?`at ${Ke(i.minutes)}`:`on ${re(i.date)} at ${Ke(i.minutes)}`}var oe=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}},Ne="mydashlight",Xs=7,Cn=3e4;function St(s){if(s instanceof oe)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new oe(String(n.code??"error"),n.message)}return typeof s=="number"?new oe("connection_lost","Lost the connection to Home Assistant."):new oe("error",String(s))}var ct=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new oe("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.pushing}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},Cn),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,n&&n().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(n=>{this.pushing=!0,n.plan?this.emit(n.plan):this.fail(new oe("not_running","MyDashLight isn’t running right now."))},{type:`${Ne}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await this.conn.sendMessagePromise({type:"call_service",domain:Ne,service:"get_plan",service_data:{days:Xs},return_response:!0});this.emit(n.response)}catch(n){this.fail(St(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ne,service:n,service_data:e})}catch(t){throw St(t)}this.pushing||await this.refresh()}setRide(n,e,t,i){return this.call("set_ride",{event:n,side:e,driver:t,scope:i})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:En(e),scope:t})}setTakeAlong(n,e,t){return this.call("set_take_along",{event:n,kids:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}watchChores(n){let e=!1,t=null,i=null,o=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:Ne,service:"get_chores",service_data:{},return_response:!0});e||n(a.response??null)}catch{e||n(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(r=>{e||n(r.chores)},{type:`${Ne}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):t=a}catch{if(e)return;o(),i=setInterval(()=>void o(),Cn)}})(),()=>{e=!0,i&&clearInterval(i),t&&t().catch(()=>{})}}async setChoreDone(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ne,service:"set_chore_done",service_data:{chore:n,done:e}})}catch(t){throw St(t)}}};var pt=globalThis,ht=pt.ShadowRoot&&(pt.ShadyCSS===void 0||pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Dt=Symbol(),Pn=new WeakMap,Fe=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==Dt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(ht&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=Pn.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&Pn.set(e,n))}return n}toString(){return this.cssText}},Mn=s=>new Fe(typeof s=="string"?s:s+"",void 0,Dt),Ee=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,i,o)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new Fe(e,s,Dt)},Sn=(s,n)=>{if(ht)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=pt.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,s.appendChild(t)}},Rt=ht?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return Mn(e)})(s):s;var{is:Zs,defineProperty:ei,getOwnPropertyDescriptor:ti,getOwnPropertyNames:ni,getOwnPropertySymbols:si,getPrototypeOf:ii}=Object,ut=globalThis,Dn=ut.trustedTypes,ri=Dn?Dn.emptyScript:"",oi=ut.reactiveElementPolyfillSupport,Ge=(s,n)=>s,Lt={toAttribute(s,n){switch(n){case Boolean:s=s?ri:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ln=(s,n)=>!Zs(s,n),Rn={attribute:!0,type:String,converter:Lt,reflect:!1,useDefault:!1,hasChanged:Ln};Symbol.metadata??=Symbol("metadata"),ut.litPropertyMetadata??=new WeakMap;var he=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Rn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&ei(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:o}=ti(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let r=i?.call(this);o?.call(this,a),this.requestUpdate(n,r,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Rn}static _$Ei(){if(this.hasOwnProperty(Ge("elementProperties")))return;let n=ii(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Ge("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ge("properties"))){let e=this.properties,t=[...ni(e),...si(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(Rt(i))}else n!==void 0&&e.push(Rt(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Sn(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let o=(t.converter?.toAttribute!==void 0?t.converter:Lt).toAttribute(e,t.type);this._$Em=n,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let o=t.getPropertyOptions(i),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:Lt;this._$Em=i;let r=a.fromAttribute(e,o.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(n,e,t,i=!1,o){if(n!==void 0){let a=this.constructor;if(i===!1&&(o=this[n]),t??=a.getPropertyOptions(n),!((t.hasChanged??Ln)(o,e)||t.useDefault&&t.reflect&&o===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:o},a){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),o!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,o]of t){let{wrapped:a}=o,r=this[i];a!==!0||this._$AL.has(i)||r===void 0||this.C(i,void 0,o,r)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};he.elementStyles=[],he.shadowRootOptions={mode:"open"},he[Ge("elementProperties")]=new Map,he[Ge("finalized")]=new Map,oi?.({ReactiveElement:he}),(ut.reactiveElementVersions??=[]).push("2.1.2");var Bt=globalThis,In=s=>s,ft=Bt.trustedTypes,Bn=ft?ft.createPolicy("lit-html",{createHTML:s=>s}):void 0,Nt="$lit$",ue=`lit$${Math.random().toFixed(9).slice(2)}$`,Ot="?"+ue,ai=`<${Ot}>`,Me=document,Qe=()=>Me.createComment(""),Je=s=>s===null||typeof s!="object"&&typeof s!="function",zt=Array.isArray,jn=s=>zt(s)||typeof s?.[Symbol.iterator]=="function",It=`[ 	
\f\r]`,Ye=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Nn=/-->/g,On=/>/g,Ce=RegExp(`>|${It}(?:([^\\s"'>=/]+)(${It}*=${It}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),zn=/'/g,Un=/"/g,qn=/^(?:script|style|textarea|title)$/i,Ut=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),f=Ut(1),de=Ut(2),Ir=Ut(3),fe=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),Hn=new WeakMap,Pe=Me.createTreeWalker(Me,129);function Kn(s,n){if(!zt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Bn!==void 0?Bn.createHTML(n):n}var Vn=(s,n)=>{let e=s.length-1,t=[],i,o=n===2?"<svg>":n===3?"<math>":"",a=Ye;for(let r=0;r<e;r++){let l=s[r],d,g,c=-1,p=0;for(;p<l.length&&(a.lastIndex=p,g=a.exec(l),g!==null);)p=a.lastIndex,a===Ye?g[1]==="!--"?a=Nn:g[1]!==void 0?a=On:g[2]!==void 0?(qn.test(g[2])&&(i=RegExp("</"+g[2],"g")),a=Ce):g[3]!==void 0&&(a=Ce):a===Ce?g[0]===">"?(a=i??Ye,c=-1):g[1]===void 0?c=-2:(c=a.lastIndex-g[2].length,d=g[1],a=g[3]===void 0?Ce:g[3]==='"'?Un:zn):a===Un||a===zn?a=Ce:a===Nn||a===On?a=Ye:(a=Ce,i=void 0);let v=a===Ce&&s[r+1].startsWith("/>")?" ":"";o+=a===Ye?l+ai:c>=0?(t.push(d),l.slice(0,c)+Nt+l.slice(c)+ue+v):l+ue+(c===-2?r:v)}return[Kn(s,o+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},Xe=class s{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let o=0,a=0,r=n.length-1,l=this.parts,[d,g]=Vn(n,e);if(this.el=s.createElement(d,t),Pe.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=Pe.nextNode())!==null&&l.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(Nt)){let p=g[a++],v=i.getAttribute(c).split(ue),k=/([.?@])?(.*)/.exec(p);l.push({type:1,index:o,name:k[2],strings:v,ctor:k[1]==="."?mt:k[1]==="?"?bt:k[1]==="@"?xt:De}),i.removeAttribute(c)}else c.startsWith(ue)&&(l.push({type:6,index:o}),i.removeAttribute(c));if(qn.test(i.tagName)){let c=i.textContent.split(ue),p=c.length-1;if(p>0){i.textContent=ft?ft.emptyScript:"";for(let v=0;v<p;v++)i.append(c[v],Qe()),Pe.nextNode(),l.push({type:2,index:++o});i.append(c[p],Qe())}}}else if(i.nodeType===8)if(i.data===Ot)l.push({type:2,index:o});else{let c=-1;for(;(c=i.data.indexOf(ue,c+1))!==-1;)l.push({type:7,index:o}),c+=ue.length-1}o++}}static createElement(n,e){let t=Me.createElement("template");return t.innerHTML=n,t}};function Se(s,n,e=s,t){if(n===fe)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,o=Je(n)?void 0:n._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(s),i._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=Se(s,i._$AS(s,n.values),i,t)),n}var gt=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??Me).importNode(e,!0);Pe.currentNode=i;let o=Pe.nextNode(),a=0,r=0,l=t[0];for(;l!==void 0;){if(a===l.index){let d;l.type===2?d=new Oe(o,o.nextSibling,this,n):l.type===1?d=new l.ctor(o,l.name,l.strings,this,n):l.type===6&&(d=new vt(o,this,n)),this._$AV.push(d),l=t[++r]}a!==l?.index&&(o=Pe.nextNode(),a++)}return Pe.currentNode=Me,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},Oe=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Se(this,n,e),Je(n)?n===T||n==null||n===""?(this._$AH!==T&&this._$AR(),this._$AH=T):n!==this._$AH&&n!==fe&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):jn(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==T&&Je(this._$AH)?this._$AA.nextSibling.data=n:this.T(Me.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=Xe.createElement(Kn(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new gt(i,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(n){let e=Hn.get(n.strings);return e===void 0&&Hn.set(n.strings,e=new Xe(n)),e}k(n){zt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let o of n)i===e.length?e.push(t=new s(this.O(Qe()),this.O(Qe()),this,this.options)):t=e[i],t._$AI(o),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=In(n).nextSibling;In(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},De=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,o){this.type=1,this._$AH=T,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=o,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=T}_$AI(n,e=this,t,i){let o=this.strings,a=!1;if(o===void 0)n=Se(this,n,e,0),a=!Je(n)||n!==this._$AH&&n!==fe,a&&(this._$AH=n);else{let r=n,l,d;for(n=o[0],l=0;l<o.length-1;l++)d=Se(this,r[t+l],e,l),d===fe&&(d=this._$AH[l]),a||=!Je(d)||d!==this._$AH[l],d===T?n=T:n!==T&&(n+=(d??"")+o[l+1]),this._$AH[l]=d}a&&!i&&this.j(n)}j(n){n===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},mt=class extends De{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===T?void 0:n}},bt=class extends De{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==T)}},xt=class extends De{constructor(n,e,t,i,o){super(n,e,t,i,o),this.type=5}_$AI(n,e=this){if((n=Se(this,n,e,0)??T)===fe)return;let t=this._$AH,i=n===T&&t!==T||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,o=n!==T&&(t===T||i);i&&this.element.removeEventListener(this.name,this,t),o&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},vt=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){Se(this,n)}},Wn={M:Nt,P:ue,A:Ot,C:1,L:Vn,R:gt,D:jn,V:Se,I:Oe,H:De,N:bt,U:xt,B:mt,F:vt},li=Bt.litHtmlPolyfillSupport;li?.(Xe,Oe),(Bt.litHtmlVersions??=[]).push("3.3.3");var Fn=(s,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let o=e?.renderBefore??null;t._$litPart$=i=new Oe(n.insertBefore(Qe(),o),o,void 0,e??{})}return i._$AI(s),i};var Ht=globalThis,le=class extends he{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Fn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return fe}};le._$litElement$=!0,le.finalized=!0,Ht.litElementHydrateSupport?.({LitElement:le});var di=Ht.litElementPolyfillSupport;di?.({LitElement:le});(Ht.litElementVersions??=[]).push("4.2.2");var Gn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Yn=s=>(...n)=>({_$litDirective$:s,values:n}),yt=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:ci}=Wn,Qn=s=>s;var Jn=()=>document.createComment(""),ze=(s,n,e)=>{let t=s._$AA.parentNode,i=n===void 0?s._$AB:n._$AA;if(e===void 0){let o=t.insertBefore(Jn(),i),a=t.insertBefore(Jn(),i);e=new ci(o,a,s,s.options)}else{let o=e._$AB.nextSibling,a=e._$AM,r=a!==s;if(r){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(o!==i||r){let l=e._$AA;for(;l!==o;){let d=Qn(l).nextSibling;Qn(t).insertBefore(l,i),l=d}}}return e},xe=(s,n,e=s)=>(s._$AI(n,e),s),pi={},Xn=(s,n=pi)=>s._$AH=n,Zn=s=>s._$AH,wt=s=>{s._$AR(),s._$AA.remove()};var es=(s,n,e)=>{let t=new Map;for(let i=n;i<=e;i++)t.set(s[i],i);return t},ce=Yn(class extends yt{constructor(s){if(super(s),s.type!==Gn.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let i=[],o=[],a=0;for(let r of s)i[a]=t?t(r,a):a,o[a]=e(r,a),a++;return{values:o,keys:i}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let i=Zn(s),{values:o,keys:a}=this.dt(n,e,t);if(!Array.isArray(i))return this.ut=a,o;let r=this.ut??=[],l=[],d,g,c=0,p=i.length-1,v=0,k=o.length-1;for(;c<=p&&v<=k;)if(i[c]===null)c++;else if(i[p]===null)p--;else if(r[c]===a[v])l[v]=xe(i[c],o[v]),c++,v++;else if(r[p]===a[k])l[k]=xe(i[p],o[k]),p--,k--;else if(r[c]===a[k])l[k]=xe(i[c],o[k]),ze(s,l[k+1],i[c]),c++,k--;else if(r[p]===a[v])l[v]=xe(i[p],o[v]),ze(s,i[c],i[p]),p--,v++;else if(d===void 0&&(d=es(a,v,k),g=es(r,c,p)),d.has(r[c]))if(d.has(r[p])){let y=g.get(a[v]),_=y!==void 0?i[y]:null;if(_===null){let R=ze(s,i[c]);xe(R,o[v]),l[v]=R}else l[v]=xe(_,o[v]),ze(s,i[c],_),i[y]=null;v++}else wt(i[p]),p--;else wt(i[c]),c++;for(;v<=k;){let y=ze(s,l[k+1]);xe(y,o[v]),l[v++]=y}for(;c<=p;){let y=i[c++];y!==null&&wt(y)}return this.ut=a,Xn(s,l),fe}});var $t=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ie(s){return $t[(s%$t.length+$t.length)%$t.length]}var ts="#23272E",ns="35,39,46";var hi=3,Et=36,jt=12,ui=8,qt=60,Kt=10,_t=30,Vt=10,fi=150,gi=200,Tt=1.4;function Ft(s,n){let e=Math.max(fi,gi/Tt);return Math.ceil(qt+Math.max(0,s-1)*Kt+_t+Math.max(0,n-1)*Vt+e*(s+Tt*n))}function Le(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function ve(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ge(s){return new Map(Le(s).map((n,e)=>[n,ie(e)]))}function ae(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function ye(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function Gt(s,n){return n==="none"?"Not needed":ve(s).includes(n)?ye(s,n):n}function mi(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function At(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function kt(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(At(n,t.from)),e.push(At(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(At(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function bi(s){let n=s.map(a=>({...a,col:0,cols:1})).sort((a,r)=>a.s-r.s||r.en-a.en),e=[],t=[],i=-1/0,o=()=>{for(let a of e)a.cols=t.length;e=[],t=[]};for(let a of n){a.s>=i&&(o(),i=-1/0);let r=t.findIndex(l=>l<=a.s);r<0?(r=t.length,t.push(a.en)):t[r]=a.en,a.col=r,e.push(a),i=Math.max(i,a.en)}return o(),n}function xi(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.t)return i.t===t.t?t.y:Math.round(t.y+(n-t.t)/(i.t-t.t)*(i.y-t.y))}return s[s.length-1].y}function vi(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.y)return i.y===t.y?t.t:t.t+(n-t.y)/(i.y-t.y)*(i.t-t.t)}return s[s.length-1].t}function rs(s,n){return xi(s.anchors,n)}function os(s,n){return vi(s.anchors,n)}function yi(s,n){let e=Le(s),t=ve(s),i=Math.max(n,Ft(e.length,t.length)),a=(i-qt-Math.max(0,e.length-1)*Kt-_t-Math.max(0,t.length-1)*Vt)/(e.length+Tt*t.length||1),r=Math.floor(a),l=Math.floor(a*Tt),d=new Map;for(let k of s.days)for(let y of k.events){let _=d.get(y.kid)??[];_.some(R=>R.event_id===y.event_id&&R.calendar_id===y.calendar_id)||_.push(y),d.set(y.kid,_)}let g=ge(s),c=[],p=qt;e.forEach((k,y)=>{let _=d.get(k)??[],R=s.days.some(A=>A.events.some(V=>V.kid===k&&(V.sides.includes("drop")&&V.drop===""||V.sides.includes("pick")&&V.pick==="")));c.push({id:k,kind:"kid",x:p,w:r,name:ae(s,k),dot:g.get(k).color,rgb:g.get(k).rgb,sub:`${R?"Needs a ride · ":""}${_.length} this week`,subWarn:R}),p+=r+(y<e.length-1?Kt:0)});let v=p+_t/2;return p+=_t,t.forEach((k,y)=>{let _=0,R=0;for(let A of s.days){let V=A.drivers[k];V&&(_+=V.outings.length,R+=V.drive??0)}c.push({id:k,kind:"driver",x:p,w:l,name:ye(s,k),dot:ts,rgb:ns,sub:`${_} ${_===1?"trip":"trips"} this week · ${We(R)} driving`,subWarn:!1}),p+=l+(y<t.length-1?Vt:0)}),{columns:c,sepX:v,width:i}}function wi(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(n.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!o)return e;let a=i.slice(o[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function ss(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${I(s.start)}`:e||!n?`${s.title} until ${I(s.end)}`:`${s.title} ${I(s.start)}–${I(s.end)}`}function Yt(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length}function Qt(s,n){let e=be(n,s);return e===0?"Today":e===1?"Tomorrow":""}function te(s,n=0){return s==null||!Number.isFinite(s)?n:s}function Wt(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),i=1,o=0;for(let a of s.split(/\s+/).filter(Boolean)){let r=a.length;for(o===0?o=r:o+1+r<=t?o+=1+r:(i++,o=r);o>t;)i++,o-=t}return i}var as=25,ls=15,Jt=3;function is(s){return Math.max(0,Math.min(Jt,Math.floor((s-as)/ls)))}function $i(s,n){let e=Math.min(Jt,Wt(s,n-19,6.6));return as+e*ls+2}function ki(s,n){let e=n-23,t=`${I(s.start)}–${I(s.end)}`+(s.arrive_by!=null?` · arrive ${I(s.arrive_by)}`:""),i=33+Wt(t,e,6.6)*16;for(let o of[s.lines.drop,s.lines.pick])o&&(i+=2+Wt(o.text,e,7)*16);return i+4}function ds(s,n,e,t){let i=n==="compact",{columns:o,sepX:a,width:r}=yi(s,e),l=new Map(o.map(A=>[A.id,A])),d=Le(s),g=ve(s),c=[...d,...g],p=ge(s),v=mi(s),k=A=>ae(s,A),y=A=>ye(s,A),_={mode:n,width:r,height:0,columns:o,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},R=0;return s.days.forEach((A,V)=>{let Q=V*1440,B=new Map(A.events.map($=>[$.id,$])),W=$=>$&&B.has($)?{day:A.date,event:$}:null,u=Yt(A),x=A.events.length,h=Qt(A.date,t.date);_.dayHeads.push({date:A.date,y:R,label:Te(A.date),tag:h,sub:(x?`${x} ${x===1?"activity":"activities"}`:"Nothing scheduled")+(u?` · ${u} to sort out`:""),warn:u>0}),_.anchors.push({t:Q,y:R});let m=R+Et+jt,b=g.flatMap($=>A.drivers[$]?.outings??[]);if(!x&&!b.length){_.empties.push({key:A.date,y:m,text:"Nothing planned"}),R=m+40,_.anchors.push({t:Q+1439,y:R});return}let w=($,U,N,L,O,j,S)=>{let J=p.get($.kid)??ie(0),X=$.lines;return{key:`${A.date}|card|${$.id}`,x:U,y:N,w:L,h:O,target:{day:A.date,event:$.id},event:$,color:J,kidName:k($.kid),clash:j,stayed:$.stay&&g.includes($.drop),skipped:$.attending===!1,title:wi($.title,k($.kid)),time:`${I($.start)}–${I($.end)}`+($.arrive_by!=null?` · arrive ${I($.arrive_by)}`:""),drop:X.drop,pick:X.pick,showDrop:!!X.drop&&(S||O>=56),showPick:!!X.pick&&(S||O>=74),wrap:S,aria:`${k($.kid)}, ${$.title} ${I($.start)} to ${I($.end)}. `+($.attending===!1&&!X.drop?"Not attending. ":"")+[X.drop,X.pick].filter(pe=>!!pe).map(pe=>pe.text).join(". ")}},E=$=>{let U=A.rides[$];return U?(A.drivers[U.driver]?.segments??[]).filter(L=>L.type!=="home"&&L.kids.includes(U.kid)&&te(L.start)>=te(U.start)&&te(L.end)<=te(U.end)):[]},M=$=>{let U=A.rides[$];if(!U)return null;let N=U.serves.find(L=>B.get(L)?.kid===U.kid);return W(N??U.serves[0])},z=new Map;for(let $ of A.issues)$.level!=="problem"||!$.event||($.kind==="late"&&z.set($.event,`${Math.round(te($.minutes))} min late`),$.kind==="waiting"&&z.set(`${$.event}|pick`,`Waits ${Math.round(te($.minutes))} min`));if(!i){let $=1/0,U=-1/0;for(let S of A.events)$=Math.min($,S.start-20,S.arrive_by!=null?S.arrive_by-10:1/0),U=Math.max(U,S.end+20);for(let S of b)S.start!=null&&($=Math.min($,S.start)),S.end!=null&&(U=Math.max(U,S.end));A.date===t.date&&Number.isFinite($)&&t.minutes>$-60&&t.minutes<U&&($=Math.min($,t.minutes-15));let N=Number.isFinite($)?Math.floor(($-5)/30)*30:900,L=Number.isFinite(U)?Math.ceil((U+5)/30)*30:960,O=S=>Math.round(m+(Math.max(N,Math.min(L,S))-N)*hi);_.anchors.push({t:Q+N,y:O(N)},{t:Q+L,y:O(L)});for(let S of d){let J=l.get(S),X=p.get(S),pe=(A.kids[S]?.items??[]).filter(K=>K.start!=null&&K.end!=null).map(K=>({item:K,s:te(K.start),en:te(K.end)}));for(let K of bi(pe)){let P=J.w/K.cols,G=Math.round(J.x+K.col*P),F=Math.round(P-(K.cols>1?4:0)),Z=O(K.s),me=K.item;if(me.type==="act"){let se=B.get(me.event??"");if(!se)continue;let an=Math.max(30,O(K.en)-Z);if(_.cards.push(w(se,G,Z,F,an,me.clash,!1)),se.arrive_by!=null&&se.start-se.arrive_by>=5){let cn=O(se.arrive_by);_.preps.push({key:`${A.date}|prep|${se.id}`,x:G,y:cn,w:F,h:Z-cn+6,color:X,label:`Arrive by ${I(se.arrive_by)}`})}let ln=z.get(se.id);ln&&_.marks.push({key:`${A.date}|late|${se.id}`,x:G+F-4,y:Z+4,text:ln,right:!0});let dn=z.get(`${se.id}|pick`);dn&&_.marks.push({key:`${A.date}|wait|${se.id}`,x:G+4,y:Z+an+2,text:dn,right:!1});continue}let ee=A.rides[me.ride??-1];if(!ee)continue;let _e=Math.max(22,O(K.en)-Z),je=kt(E(ee.index),v),Y=y(ee.driver);_.rides.push({key:`${A.date}|ride|${ee.index}`,x:G,y:Z,w:F,h:_e,target:M(ee.index),l1:`${ee.own?"In":"Along in"} ${Y}’s car`,l2:je.join(" → "),show2:is(_e)>0,lines2:is(_e),dashed:!ee.own,clash:me.clash,aria:`${k(S)} ${ee.own?"in":"riding along in"} ${Y}’s car, ${I(te(ee.start))} to ${I(te(ee.end))}: ${je.join(" to ")}`});let Ae=l.get(ee.driver);Ae&&_.bands.push({key:`${A.date}|band|${ee.index}`,x:G+F,y:Z,w:Math.max(0,Ae.x+8-(G+F)),h:_e,color:X})}}for(let S of g){let J=l.get(S),X=A.drivers[S];if(!X)continue;let pe=[],K=null;for(let P of X.segments)if(!(P.start==null||P.end==null)){if(P.type==="home"){K=null;continue}if(P.type==="stay"){K=null,pe.push({type:"stay",g:P,s:P.start,en:P.end});continue}K&&K.en===P.start?(K.en=P.end,K.legs.push(P)):(K={type:"trip",s:P.start,en:P.end,legs:[P]},pe.push(K))}for(let P of pe){let G=O(P.s),F=Math.max(24,O(P.en)-G);if(P.type==="stay"){let Y=B.get(P.g.event??P.g.serves??""),Ae=Y?p.get(Y.kid)??ie(0):ie(0),se=P.g.kids.map(k);_.stays.push({key:`${A.date}|stay|${S}|${P.s}`,x:J.x+8,y:G,w:J.w-16,h:F,target:W(Y?.id),color:Ae,l1:Y?`At ${Y.title} with ${k(Y.kid)}`:"Staying",l2:`until ${I(P.en)}`+(se.length?` · ${se.join(" and ")} too`:"")});continue}let Z=P.legs[0],me=P.legs[P.legs.length-1],ee=[];for(let Y of P.legs)for(let Ae of Y.kids)ee.includes(Ae)||ee.push(Ae);let _e=me.type==="drive"&&me.to==="home",je=kt(P.legs,v);_.trips.push({key:`${A.date}|trip|${S}|${P.s}`,x:J.x+8,y:G,w:J.w-16,h:F,target:W(P.legs.find(Y=>Y.serves)?.serves),l1:Z.type==="drive"&&Z.from==="home"?`Leave ${I(P.s)}`:`From ${At(v,Z.from??Z.place)} ${I(P.s)}`,l2:je.join(" → "),show2:F>=36,l3:_e?`Home ${I(P.en)}`:"",show3:_e&&F>=62,stops:null,kids:ee.map(Y=>(p.get(Y)??ie(0)).color),bad:P.legs.some(Y=>Y.overlaps_busy),aria:`${y(S)} drives ${je.join(" to ")}, ${I(P.s)} to ${I(P.en)}`})}for(let P of X.segments)if(!(!P.overlaps_busy||P.start==null||P.end==null))for(let G of X.busy){let F=Math.max(P.start,G.start),Z=Math.min(P.end,G.end);Z<=F||_.overlaps.push({key:`${A.date}|overlap|${S}|${F}`,x:J.x+6,y:O(F)-2,w:J.w-12,h:Math.max(8,O(Z)-O(F)+4)})}for(let P of X.busy){if(P.end<=N||P.start>=L)continue;let G=O(P.start),F=O(P.end);_.busy.push({key:`${A.date}|busy|${S}|${P.start}`,x:J.x+1,y:G,w:J.w-2,h:F-G,labelY:8,label:ss(P,!1)})}}let j=-1/0;for(let S=N;S<=L;S+=30)_.grid.push({key:`${A.date}|grid|${S}`,y:O(S),strong:S%60===0}),S%60===0&&O(S)-j>=22&&(_.hours.push({key:`${A.date}|hour|${S}`,y:O(S)-8,label:Tn(S)}),j=O(S));A.date===t.date&&t.minutes>N&&t.minutes<L&&(_.now={y:O(t.minutes),label:`Now ${I(t.minutes)}`}),R=O(L)+jt;return}let H=[];for(let $ of d){let U=l.get($);for(let N of A.kids[$]?.items??[])if(N.start!=null){if(N.type==="act"){let L=B.get(N.event??"");if(!L)continue;H.push({col:$,s:N.start,h:ki(L,U.w),kind:"act",item:N})}else if(!A.rides[N.ride??-1]?.own){let L=A.rides[N.ride??-1],O=L?kt(E(L.index),v).join(" → "):"";H.push({col:$,s:N.start,h:$i(O,U.w),kind:"along",item:N})}}}for(let $ of g){let U=A.drivers[$];if(U){for(let N of U.busy)H.push({col:$,s:N.start,h:32,kind:"busy",busy:N});for(let N of U.outings)N.start!=null&&H.push({col:$,s:N.start,h:30+N.lines.length*16+(N.warn?16:0),kind:"out",out:N})}}H.sort(($,U)=>$.s-U.s||c.indexOf($.col)-c.indexOf(U.col));let C=new Map,D=m;H.forEach(($,U)=>{let N=C.get($.col),L=Math.max(N!=null?N+ui:m,D);C.set($.col,L+$.h),D=L,_.anchors.push({t:Q+$.s,y:L});let O=l.get($.col);if($.kind==="busy")_.busy.push({key:`${A.date}|busy|${$.col}|${U}`,x:O.x+1,y:L,w:O.w-2,h:$.h,labelY:8,label:ss($.busy,!0)});else if($.kind==="out"){let j=$.out;_.trips.push({key:`${A.date}|trip|${$.col}|${U}`,x:O.x+8,y:L,w:O.w-16,h:$.h,target:W(j.target),l1:j.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...j.lines.map(S=>({text:S,warn:!1})),...j.warn?[{text:j.warn,warn:!0}]:[]],kids:j.kids.map(S=>(p.get(S)??ie(0)).color),bad:!!j.warn,aria:`${y($.col)}: ${j.lead}. ${j.lines.join(". ")}${j.warn?`. ${j.warn}`:""}`})}else if($.kind==="act"){let j=B.get($.item.event??"");_.cards.push(w(j,O.x,L,O.w,$.h,$.item.clash,!0))}else{let j=A.rides[$.item.ride??-1],S=kt(E(j.index),v),J=y(j.driver);_.rides.push({key:`${A.date}|ride|${j.index}`,x:O.x,y:L,w:O.w,h:$.h,target:M(j.index),l1:`Along with ${J} ${I(te(j.start))}`,l2:S.join(" → "),show2:!0,lines2:Jt,dashed:!0,clash:$.item.clash,aria:`${k($.col)} riding along with ${J}, ${I(te(j.start))} to ${I(te(j.end))}: ${S.join(" to ")}`})}});let q=m;for(let $ of C.values())q=Math.max(q,$);R=q+jt+6,_.anchors.push({t:Q+1439,y:R})}),_.height=R,_}var _i=["","¼","½","¾"];function Re(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return We(t);let i=Math.round(t*4),o=Math.floor(i/4),a=_i[i%4];return`${o||!a?o:""}${a} min`})}function cs(s){let n=e=>e?{...e,text:Re(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,i])=>[t,{...i,outings:i.outings.map(o=>({...o,lines:o.lines.map(Re),warn:o.warn==null?o.warn:Re(o.warn)}))}])),issues:e.issues.map(t=>({...t,title:Re(t.title),body:Re(t.body),note:t.note==null?t.note:Re(t.note),...t.suggestions?{suggestions:t.suggestions.map(i=>({...i,note:Re(i.note)}))}:{}}))}))}}var Ai=2,Ti=48;function ps(s,n,e=Ti){let t=[],i=0,o=0,a=0,r=0,l=n.minutes+e*60;for(let d of s.days){let g=be(n.date,d.date),c=g===0?"":`${re(d.date)} · `,p=new Map(d.events.map(y=>[y.id,y])),v=y=>y&&p.has(y)?{day:d.date,event:y}:null,k=(y,_)=>g*1440+(y??p.get(_??"")?.start??0)<l;for(let y of d.issues)if(y.level==="problem"){if(!k(y.at,y.event)){a++,y.kind==="unassigned"&&r++;continue}i++,y.kind==="unassigned"&&o++,t.push({key:`${d.date}|${y.key}`,tone:y.kind==="unassigned"?"unassigned":"problem",title:c+y.title,body:y.body,target:v(y.event),suggestions:(y.suggestions??[]).map(_=>({id:_.id,label:_.label,note:_.note}))})}if(d.clashes.forEach((y,_)=>{if(!k(y.a.start,y.a.event)){a++;return}i++;let R=p.get(y.a.event??""),A=ae(s,y.kid),V=(B,W)=>{let u=v(W);return u?{text:B,target:u}:B},Q=[];if(y.b.type==="act"){let B=p.get(y.b.event??"");R&&B&&(Q=[V(R.title,R.id),` ${I(R.start)}–${I(R.end)} and `,V(B.title,B.id),` ${I(B.start)}–${I(B.end)} overlap.`])}else{let B=d.rides[y.b.ride??-1];R&&B&&(Q=[`${A} is in `,V(`${ye(s,B.driver)}’s car`,B.serves[0]),` ${I(te(y.b.start))}–${I(te(y.b.end))}, during `,V(R.title,R.id),"."])}t.push({key:`${d.date}|clash|${_}`,tone:"problem",title:`${c}${A} is double-booked`,body:Q.map(B=>typeof B=="string"?B:B.text).join(""),parts:Q,target:null,suggestions:[]})}),g>=0&&g<Ai)for(let y of d.issues)y.level!=="heads_up"||!k(y.at,y.event)||t.push({key:`${d.date}|${y.key}`,tone:"heads_up",title:c+y.title,body:y.body,target:v(y.event),suggestions:[]});for(let y of d.events)!y.problems.length||!k(y.start)||t.push({key:`${d.date}|notes|${y.id}`,tone:"heads_up",title:`${c}Check the notes on ${ae(s,y.kid)}’s ${y.title}`,body:`These lines couldn’t be read: ${y.problems.join("; ")}`,target:v(y.id),suggestions:[]})}return{items:t,problems:i,unassigned:o,later:a,laterUnassigned:r}}function hs(s,n){let e=ge(s),t=null,i=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of s.days){let a=be(n.date,o.date);if(!(a<0))for(let r of ve(s))for(let l of o.drivers[r]?.outings??[]){if(l.start==null)continue;let d=a*1440+l.start;if(a*1440+te(l.end,l.start)<=n.minutes)continue;let c=d-n.minutes,p={driver:r,name:ye(s,r),date:o.date,ahead:a,start:l.start,inMinutes:c,ongoing:c<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(v=>e.get(v)??ie(0)),warn:l.warn,target:l.target&&o.events.some(v=>v.id===l.target)?{day:o.date,event:l.target}:null};(!t||i(p)<i(t)||i(p)===i(t)&&p.inMinutes<t.inMinutes)&&(t=p)}}return t}function Ue(s){return s.state==="done"||s.state==="late"}function us(s){return s.state==="open"||s.state==="overdue"}function fs(s,n,e){if(Ue(s)){let t=s.done_at?Ci(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Ei(s.due,n)}`:"Missed";if(s.state==="upcoming"){let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let i=be(n,s.due);return`By ${i===1?"tomorrow":i<7?re(s.due):Xt(s.due)}`}if(s.due&&s.due>n){let t=be(n,s.due);return t===1?"By tomorrow":`By ${t<7?re(s.due):Xt(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Ei(s,n){let e=be(n,s);return e===0?"today":e===-1?"yesterday":Math.abs(e)<7?re(s):Xt(s)}function Xt(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Ci(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let o=t.toLocaleDateString("en-CA",{timeZone:i}),a=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return o===n?a:`${re(o)} ${a}`}function gs(s,n){let e=[...s.chores].sort((t,i)=>t.order-i.order);return s.kids.map((t,i)=>{let o=e.filter(d=>d.kid===t.id),a=new Map;for(let d of o){if(d.state!=="upcoming")continue;let g=d.shows_from??d.due??s.today;a.set(g,[...a.get(g)??[],d])}let r=o.filter(d=>d.state==="overdue"),l=o.filter(d=>d.state==="open");return{kid:t.id,name:t.name,color:n?.get(t.id)??ie(i),overdue:r,now:l,done:o.filter(Ue),later:[...a.entries()].sort(([d],[g])=>d.localeCompare(g)).map(([d,g])=>({date:d,chores:g})),left:r.length+l.length}})}function ms(s){return[...s.chores].filter(n=>n.state==="overdue"||n.state==="open"&&(n.due==null||n.due<=s.today)).sort((n,e)=>n.state===e.state?n.order-e.order:n.state==="overdue"?-1:1)}function Zt(s){return!s.chores.length&&!s.templates.length}var Pi={timeline:"timeline",full:"timeline",compact:"compact"};function Ze(s){let n=new URLSearchParams(s),e={},t=Pi[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1);let i=(n.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores")&&(e.page=i),e}var Mi=["auth_callback","code","state"];function en(s){let n=new URLSearchParams(s);for(let t of Mi)n.delete(t);let e=n.toString();return e?`?${e}`:""}var bs=Ee`
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
`;var xs="mydashlight.rides.mode",Si=1100,Di=440,Ri=700,Li=3*6e4,Ii=1200;function Bi(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}function et(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function Ni(s,n){return Qt(s,n)||Te(s).split(",")[0]}function Oi(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function zi(){try{return localStorage.getItem(xs)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Ui(s){try{localStorage.setItem(xs,s)}catch{}}function Ct(s){return s.days.every(n=>!n.events.length)}var tt=class extends le{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=Ze(location.search).view;this.urlPage=Ze(location.search).page;this.stopChores=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let i=e.clientX-t.x,o=e.clientY-t.y;if(!t.moved){if(Math.abs(i)+Math.abs(o)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-o,t.el.scrollLeft=t.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Li))};this.onKey=e=>{e.key==="Escape"&&(this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??zi(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.backend&&(this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let i of e.chores)t.has(i.id)&&Ue(i)===t.get(i.id)&&t.delete(i.id);for(let i of t.keys())e.chores.some(o=>o.id===i)||t.delete(i);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=cs(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Si)return!1;let e=this.plan;return!e||this.width-Di>=Ft(Le(e).length,ve(e).length)}today(){return Ve(this.plan?.time_zone??Bi())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),i=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=ds(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let i=this.scroller;if(!i||!this.board)return;let o=this.board.dayHeads.find(a=>a.date===t)?.y??0;i.scrollTop=Math.max(o,rs(this.board,e)-Et-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let o=this.dayIndexOf(e),a=t.days[o];if(!a)return;let r=1/0;if(this.mode==="timeline"){for(let l of a.events)r=Math.min(r,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let d of l.outings)d.start!=null&&(r=Math.min(r,d.start))}this.scrollToTime(o*1440+(Number.isFinite(r)?Math.max(0,r-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,i=this.board.dayHeads[0];for(let d of this.board.dayHeads)d.y<=t+1&&(i=d);let o=this.renderRoot,a=o.querySelector(".pinned .label"),r=o.querySelector(".pinned .tag"),l=o.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),r&&(r.textContent!==i.tag&&(r.textContent=i.tag),r.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let d of o.querySelectorAll(".day-tile"))d.classList.toggle("in-view",d.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.page=e,e==="rides"&&(this.scrolledOnce=!1))}async toggleChore(e){if(!this.backend)return;let t=!this.choreDone(e),i=new Map(this.choreDraft);i.set(e.id,t),this.choreDraft=i;try{await this.backend.setChoreDone(e.id,t)}catch(o){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let r=o instanceof oe?o:new oe("error",String(o));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??Ue(e)}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?os(this.board,t.scrollTop+Et+4):null,this.mode=e,this.urlView||Ui(e)}findEvent(e){let t=this.plan?.days.find(o=>o.date===e.day),i=t?.events.find(o=>o.id===e.event);return t&&i?{day:t,event:i}:null}open(e,t=!1){e&&(this.flushArrive(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),i=this.dayIndexOf(e.day);!t||i<0||this.scrollToTime(i*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,i){if(!this.pending){this.pending={key:e,value:t};try{await i()}catch(o){let a=o instanceof oe?o:new oe("error",String(o));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,t,i){if(!this.backend)return;let o=this.backend;this.save(`${t}`,i,()=>o.setRide(e.id,t,i,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let i=this.backend;this.save("attending",t,()=>i.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t){if(!this.backend)return;let i=this.backend,o=e.along.includes(t)?e.along.filter(a=>a!==t):[...e.along,t];this.save("along",o,()=>i.setTakeAlong(e.id,o,this.scope))}nudgeArrive(e,t){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;t<0?o=(i??e.start)-5:o=i==null||i+5>=e.start?null:i+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Ii)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let i=this.findEvent(t);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,a=i.event.id,r=this.scope;this.save("arrive",e,()=>o.setArriveBy(a,e,r)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),i=e?ps(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},o=this.wide,a=this.chores?ms(this.chores).filter(d=>!this.choreDone(d)):[],r=f`<aside class="panel" aria-label=${this.sel?"Change this ride":"Needs attention"}>
      ${this.sel&&e?this.renderEditor(e):this.renderAttention(i,a)}
    </aside>`,l=this.page==="rides";return f`
      <div class="app ${o?"wide":this.width<Ri?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${l&&e?this.renderWeek(e):T}
          ${l?this.renderBanner(e):T}
          <main>
            ${l?f`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?Ct(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:f`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!o&&(this.sheet||this.sel)?f`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${r}`:T}
          </main>
        </div>
        ${o?r:T}
        ${this.toast?f`<div class="toast" role="status">${this.toast}</div>`:T}
      </div>
    `}closePanel(){this.closeEditor(),this.sheet=!1}renderHeader(e,t,i){let o=t.problems+i;this.tick;let a=this.today(),r="";if(e){let p=e.time_zone,v=new Date(e.updated);this.error?r=f`<span class="bad">Can’t reach Home Assistant · showing the plan from ${dt(v,new Date,p)}</span>`:e.status&&!e.status.ok?r=f`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${dt(v,new Date,p)}</span>`:this.backend?.live||(r=`Updated ${dt(v,new Date,p)}`)}let l=(p,v,k,y)=>f`
      <button type="button" class="seg-btn" title=${y} aria-pressed=${this.mode===p?"true":"false"} @click=${()=>this.setMode(p)}>
        ${k}<span class="seg-label">${v}</span>
      </button>
    `,d=(p,v,k)=>f`
      <button type="button" class="seg-btn" aria-pressed=${this.page===p?"true":"false"} @click=${()=>this.setPage(p)}>
        ${k}<span class="seg-label">${v}</span>
      </button>
    `,g=Ke(a.minutes),c=!!e&&Ct(e);return f`
      <header>
        ${this.showMenu?f`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${de`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:T}
        <div class="titles">
          <h1 class="clock" aria-label=${`${Te(a.date)}, ${g}`}>
            <span class="hm">${g.slice(0,-3)}</span><span class="ampm">${g.slice(-2)}</span>
          </h1>
          <p class="today-line">${Te(a.date)}</p>
          ${r?f`<p class="status">${r}</p>`:T}
        </div>
        ${e&&!c?this.renderNext(e,hs(e,a),t):T}
        <div class="controls">
          ${this.wide||c&&!i?T:f`<button type="button" class="attn-btn ${o?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${o}</span>
              </button>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${d("rides","Rides",de`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${d("chores","Chores",de`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
          </div>
          ${this.page!=="rides"?T:f`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",de`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",de`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
        </div>
      </header>
    `}renderNext(e,t,i){if(!t){let d=this.today().date,g=i.unassigned,c=i.laterUnassigned;if(g){let v=f`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${g} ${g===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?f`<div class="next idle needs">${v}</div>`:f`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${v}</button>`}if(c)return f`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${c} ${c===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let p=e.days.some(v=>v.date>=d&&v.events.length);return f`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${p?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${p?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let o;t.ongoing?o="On the road now":t.ahead===0?o=t.inMinutes<180?`Next trip · in ${We(t.inMinutes)}`:"Next trip · later today":t.ahead===1?o="Next trip · tomorrow":o=`Next trip · ${re(t.date)}`;let a=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,r=f`
      <span class="next-eyebrow">${o}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${et(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(d=>f`<span class="kid-dot" style="background:${d.color}"></span>`)}</span>
      </span>
      ${t.warn?f`<span class="next-stop warn">${t.warn}</span>`:t.stop?f`<span class="next-stop">${t.stop}</span>`:T}
    `,l=`next ${t.ongoing?"ongoing":a?"soon":""}`;return t.target?f`<button type="button" class=${l} @click=${()=>this.open(t.target)}>${r}</button>`:f`<div class=${l}>${r}</div>`}renderWeek(e){let t=this.today().date,i=ge(e);return f`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let a=Yt(o),r=o.events.length,l=o.events.slice(0,6).map(g=>i.get(g.kid)?.color??ie(0).color),d=`${Te(o.date)}: ${r?`${r} ${r===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return f`<button
          type="button"
          class="day-tile ${o.date===t?"today":""}"
          data-date=${o.date}
          aria-label=${d}
          @click=${()=>this.goToDay(o.date)}
        >
          <span class="dt-wd">${o.date===t?"Today":re(o.date)}</span>
          <span class="dt-num">${Number(o.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${l.length?l.map(g=>f`<span class="dt-dot" style="background:${g}"></span>`):f`<span class="dt-free">free</span>`}
            ${r>6?f`<span class="dt-more">+${r-6}</span>`:T}
          </span>
          ${a?f`<span class="dt-badge" aria-hidden="true">${a}</span>`:T}
        </button>`})}
    </nav>`}renderQuiet(e){let t=Le(e),i=ve(e),o=ge(e),a=t.map(r=>ae(e,r));return f`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((r,l)=>de`<circle cx=${50+l*30} cy="80" r="11" fill=${o.get(r).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Oi(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(r=>{let l=o.get(r);return f`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${et(ae(e,r))}</span>
            <span class="qw-name">${ae(e,r)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(r=>f`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${et(ye(e,r))}</span>
            <span class="qw-name">${ye(e,r)}</span>
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
    </div>`}renderBanner(e){let t=e?.unavailable_calendars.length??0;return t?f`<div class="banner" role="status">
      Couldn’t read ${t===1?"one calendar":`${t} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`:T}renderEmpty(){return this.error?f`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${()=>void this.backend?.refresh()}>Try again</button>
      </div>`:f`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let t=this.sel,i=r=>!!r&&!!t&&r.day===t.day&&r.event===t.event,o=e.dayHeads[0],a=e.width;return f`
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
          ${e.columns.map(r=>f`<div class="col-head ${r.kind}" style="left:${r.x}px;width:${r.w}px;--c:${r.dot};--rgb:${r.rgb}">
              <span class="avatar ${r.kind}" aria-hidden="true">${et(r.name)}</span>
              <span class="ch-text">
                <span class="name">${r.name}</span>
                <span class="sub ${r.subWarn?"warn":""}">${r.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${a}px">
          <span class="label">${o?.label??""}</span><span class="tag" ?hidden=${!o?.tag}>${o?.tag??""}</span
          ><span class="sub ${o?.warn?"warn":""}">${o?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${a}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(r=>f`<div
                class="col-bg ${r.kind}"
                style="left:${r.x}px;width:${r.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${r.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(r=>f`<div class="day-head" style="top:${r.y}px;width:${a}px">
              <span class="label">${r.label}</span>${r.tag?f`<span class="tag">${r.tag}</span>`:T}<span
                class="sub ${r.warn?"warn":""}"
                >${r.sub}</span
              >
            </div>`)}
          ${e.empties.map(r=>f`<span class="empty" style="top:${r.y}px">${r.text}</span>`)}
          ${e.grid.map(r=>f`<div class="grid ${r.strong?"strong":""}" style="top:${r.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(r=>f`<span class="hour" style="top:${r.y}px">${r.label}</span>`)}
          ${ce(e.bands,r=>r.key,r=>f`<div
                class="band"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:rgba(${r.color.rgb},0.10);border-color:rgba(${r.color.rgb},0.45)"
              ></div>`)}
          ${ce(e.busy,r=>r.key,r=>f`<div class="busy" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px">
                <span style="top:${r.labelY}px">${r.label}</span>
              </div>`)}
          ${ce(e.preps,r=>r.key,r=>f`<div
                class="prep"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:rgba(${r.color.rgb},0.07);color:${r.color.ink}"
              >
                ${r.label}
              </div>`)}
          ${ce(e.cards,r=>r.key,r=>{let l=r.color,d=r.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:r.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return f`<button
                type="button"
                class="card ${r.wrap?"wrap":""} ${i(r.target)?"sel":""} ${r.clash?"clash":""} ${r.skipped?"skipped":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:${d};border-color:${r.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(r.target)}
              >
                <span class="top">
                  <span class="title">${r.title}</span>
                  <span class="time">${r.time}</span>
                  ${r.showDrop&&r.drop?f`<span class="line tone-${r.drop.tone}">${r.drop.text}</span>`:T}
                </span>
                ${r.showPick&&r.pick?f`<span class="line tone-${r.pick.tone}">${r.pick.text}</span>`:T}
              </button>`})}
          ${ce(e.rides,r=>r.key,r=>f`<button
                type="button"
                class="ride ${r.dashed?"dashed":""} ${r.clash?"clash":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}</span>${r.show2?f`<span class="l2" style="-webkit-line-clamp:${r.lines2}">${r.l2}</span>`:T}
              </button>`)}
          ${ce(e.stays,r=>r.key,r=>f`<button
                type="button"
                class="stay"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:repeating-linear-gradient(135deg, rgba(${r.color.rgb},0.28) 0px, rgba(${r.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1" style="color:${r.color.ink}">${r.l1}</span><span class="l2">${r.l2}</span>
              </button>`)}
          ${ce(e.trips,r=>r.key,r=>f`<button
                type="button"
                class="trip ${r.bad?"bad":""} ${r.stops?"list":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}${r.kids.map(l=>f`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${r.show2?f`<span class="l2">${r.l2}</span>`:T}
                ${r.stops?r.stops.map(l=>f`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):T}
                ${r.show3?f`<span class="l3">${r.l3}</span>`:T}
              </button>`)}
          ${ce(e.overlaps,r=>r.key,r=>f`<div class="overlap" aria-hidden="true" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`)}
          ${ce(e.marks,r=>r.key,r=>f`<span class="mark" style="left:${r.x}px;top:${r.y}px;${r.right?"transform:translateX(-100%)":""}">${r.text}</span>`)}
          ${e.now?f`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:T}
        </div>
      </div>
    `}renderAttention(e,t){let{items:i,problems:o,later:a}=e,r=this.plan,l=o+t.length,d=this.chores,g=!!d&&!Zt(d);return f`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?T:f`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${g?f`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?f`<div class="attn-chores">${t.map(c=>this.renderChoreRow(c,!0))}</div>`:f`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:f`<p class="panel-sub">Rides in the next two days</p>`}
      ${r&&!o?f`<div class="all-clear">
            <span class="check" aria-hidden="true">${de`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${Ct(r)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:T}
      ${i.map(c=>f`<div class="issue ${c.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${c.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${c.target?f`<button type="button" class="issue-title" @click=${()=>this.open(c.target,!0)}>${c.title}</button>`:f`<strong class="issue-title">${c.title}</strong>`}
              <span class="issue-body"
                >${c.parts?c.parts.map(p=>typeof p=="string"?p:f`<button type="button" class="issue-link" @click=${()=>this.open(p.target,!0)}>${p.text}</button>`):c.body}</span
              >
            </div>
          </div>
          ${c.suggestions.length?f`<div class="fixes">
                ${c.suggestions.map(p=>f`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${()=>this.apply(p.id)}
                  >
                    <span class="fix-label">${this.pending?.key===`fix|${p.id}`?"Saving…":p.label}</span>
                    <span class="fix-note">${p.note}</span>
                  </button>`)}
              </div>`:T}
        </div>`)}
      ${this.wide&&r&&!Ct(r)&&this.page==="rides"?this.renderLegend():T}
    `}renderChoreRow(e,t=!1){let i=this.chores,o=this.choreDone(e),a=i.kids.findIndex(_=>_.id===e.kid),r=(this.plan?ge(this.plan).get(e.kid):void 0)??ie(Math.max(0,a)),l=i.kids[a]?.name??"",d=o===Ue(e)?e:{...e,state:o?"done":"open",done_at:o?new Date().toISOString():null},g=fs(d,i.today,i.time_zone),c=o||us(e),p=`${t?`${l}: `:""}${e.title}. ${g?`${g}. `:""}${o?"Done. Tap to undo.":"Tap when it’s done."}`,v=f`<span class="box" aria-hidden="true"
        >${o?de`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:T}</span
      >
      ${e.icon?f`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:T}
      <span class="chore-text">
        <span class="chore-title">${t?f`<span class="chore-kid">${l}</span> · `:T}${e.title}</span>
        ${g?f`<span class="chore-note">${g}</span>`:T}
      </span>`,k=`chore ${o?"done":""} ${e.state==="overdue"&&!o?"overdue":""} ${c?"":"later"}`,y=`--c:${r.color};--rgb:${r.rgb};--k:${r.ink}`;return c?f`<button type="button" class=${k} style=${y} aria-pressed=${o?"true":"false"} aria-label=${p} @click=${()=>void this.toggleChore(e)}>
          ${v}
        </button>`:f`<div class=${k} style=${y}>${v}</div>`}renderChores(){let e=this.chores;if(e===void 0)return f`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return f`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return f`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return f`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;let t=e.templates.filter(a=>a.problems.length),i=t.length?f`<div class="banner">
          ${t.map(a=>f`<div><strong>${a.title}</strong>: ${a.problems.join("; ")}</div>`)}
        </div>`:T;if(Zt(e)){let a=e.kids[0]?.name??"Ava";return f`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Chores come from Google Tasks, in the Google account MyDashLight signs in with.</p>
        <ol>
          <li>Open Google Tasks and pick the list <strong>Chore templates: Daily</strong> (or Weekly or Monthly).</li>
          <li>Add a task named for the chore, such as <strong>🛏️ Make bed</strong>.</li>
          <li>In its details, add a line <code>Who: ${a}</code>. Add <code>Days: Mon-Fri</code> for weekdays only.</li>
        </ol>
        <p>Within a minute it shows here, and on ${a}’s own list in Google Tasks.</p>
      </div>`}let o=gs(e,this.plan?ge(this.plan):void 0);return f`<div class="chores-scroll">
      ${i}
      <div class="chore-cols" style="--n:${o.length}">
        ${o.map(a=>{let r=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return f`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${et(a.name)}</span>
              <span class="ch-text">
                <span class="name">${a.name}</span>
                <span class="sub">${r?`${r} to do`:a.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
            </div>
            ${a.overdue.length?f`<h3 class="chore-group overdue">Missed</h3>
                  ${a.overdue.map(l=>this.renderChoreRow(l))}`:T}
            ${a.now.length?f`<h3 class="chore-group">To do</h3>
                  ${a.now.map(l=>this.renderChoreRow(l))}`:T}
            ${a.done.length?f`<h3 class="chore-group">Done</h3>
                  ${a.done.map(l=>this.renderChoreRow(l))}`:T}
            ${a.later.map(l=>f`<h3 class="chore-group">${Ni(l.date,e.today)}</h3>
                ${l.chores.map(d=>this.renderChoreRow(d))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?f`<p class="chore-none">No chores this week.</p>`:T}
          </section>`})}
      </div>
    </div>`}renderLegend(){return f`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return f``;let{day:i,event:o}=t,a=ve(e),l=ge(e).get(o.kid)??ie(0),d=!!this.pending,g=w=>this.pending?.key===w?this.pending.value:void 0,c=[...e.people?.carpools??[]];for(let w of e.days)for(let E of w.events)for(let M of[E.drop,E.pick])M&&M!=="none"&&!a.includes(M)&&!c.some(z=>z.toLowerCase()===M.toLowerCase())&&c.push(M);let p=w=>{if(!o.sides.includes(w))return T;let E=g(w),M=E!==void 0?String(E):w==="drop"?o.drop:o.pick,z=M&&M!=="none"&&!a.includes(M)?M:"",H=D=>this.setRide(o,w,M===D?"":D),C=[...a.map(D=>[D,Gt(e,D)]),["none","Not needed"]];return f`<div class="field">
        <span class="field-label">${w==="drop"?"Drop-off":"Pick-up"} ${M===""?f`<span class="nobody">· nobody yet</span>`:T}</span>
        <div role="group" aria-label=${w==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${C.length}, minmax(0, 1fr))">
          ${C.map(([D,q])=>f`<button type="button" class="choice" aria-pressed=${M===D?"true":"false"} ?disabled=${d} @click=${()=>H(D)}>
                ${q}
              </button>`)}
        </div>
        ${c.length?f`<div role="group" aria-label=${w==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${c.map(D=>f`<button type="button" class="chip" aria-pressed=${M.toLowerCase()===D.toLowerCase()?"true":"false"} ?disabled=${d} @click=${()=>H(D)}>
                    ${D}
                  </button>`)}
            </div>`:T}
        <input
          type="text"
          .value=${z&&!c.some(D=>D.toLowerCase()===z.toLowerCase())?z:""}
          ?disabled=${d}
          aria-label=${w==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${D=>{let q=D.target.value.trim();q&&q!==M&&this.setRide(o,w,q)}}
          @keydown=${D=>{D.key==="Enter"&&D.target.blur()}}
        />
      </div>`},v=g("stay"),k=v!==void 0?!!v:o.stay,y=o.drop===o.pick&&a.includes(o.drop),_=g("along"),R=_!==void 0?_:o.along,A=Le(e).filter(w=>w!==o.kid),V=a.includes(o.drop)&&o.sides.includes("drop"),Q=g("arrive"),B=this.arriveDraft!==void 0?this.arriveDraft:Q!==void 0?Q:o.arrive_by,W=[],u=w=>w==="none"?"Not needed":Gt(e,w);o.drop!==""&&W.push(`Drop-off: ${u(o.drop)}`),o.pick!==""&&W.push(`Pick-up: ${u(o.pick)}`),o.stay&&W.push("Stay: yes"),o.along.length&&W.push(`Take along: ${o.along.map(w=>ae(e,w)).join(", ")}`),o.arrive_by!=null&&W.push(`Arrive by: ${Ke(o.arrive_by)}`);let x=g("attending"),h=x!==void 0?!!x:o.attending!==!1;o.attending===!1&&W.splice(0,W.length,"Attending: no");let m=i.date===this.today().date?"":`${re(i.date)} · `,b=f`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${ae(e,o.kid)} · ${o.title}</span>
          <span class="ed-meta">${m}${I(o.start)}–${I(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return o.where==="home"?f`${b}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${ae(e,o.kid)} can’t get home in time, the board shows it as a clash.</p>`:f`
      ${b}
      ${this.pending?f`<p class="saving" role="status">Saving to Google Calendar…</p>`:T}
      ${o.recurring?f`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${re(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:T}
      <div class="field">
        <span class="field-label">${ae(e,o.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${h?"true":"false"} ?disabled=${d} @click=${()=>this.setAttending(o,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${h?"false":"true"} ?disabled=${d} @click=${()=>this.setAttending(o,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${h?f`${o.where==="anywhere"?f`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:T}
            ${p("drop")} ${p("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${k?"true":"false"} ?disabled=${!y||d} @click=${()=>this.toggleStay(o)}>
          ${y?k?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${V&&A.length?f`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${A.map(w=>f`<button type="button" class="chip" aria-pressed=${R.includes(w)?"true":"false"} ?disabled=${d} @click=${()=>this.toggleAlong(o,w)}>
                  ${ae(e,w)}
                </button>`)}
            </div>
          </div>`:T}
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
      ${B!=null?f`<button type="button" class="chip clear" ?disabled=${d} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:T}
`:f`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${W.length?W.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?f`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:T}
      ${h?f`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:T}
    `}};tt.styles=bs,tt.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",tt);var vs=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],ys=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function ws(s,n,e,t){let i=Math.max(0,Math.min(n,s.length)),o=Math.max(i,Math.min(e,s.length));return{value:s.slice(0,i)+t+s.slice(o),caret:i+t.length}}function $s(s,n,e){let t=Math.max(0,Math.min(n,s.length)),i=Math.max(t,Math.min(e,s.length));if(t!==i)return{value:s.slice(0,t)+s.slice(i),caret:t};if(t===0)return{value:s,caret:0};let o=Array.from(s.slice(0,t));o.pop();let a=o.join("");return{value:a+s.slice(t),caret:a.length}}function ks(s,n){return n===0||/\s$/.test(s.slice(0,n))}var Hi=new Set(["text","search","email","url","tel","number","password"]);function _s(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Hi.has(s.type)&&!s.readOnly&&!s.disabled}var ji={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},qi={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},nt=class extends le{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=t=>t.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let t=e.selectionStart,i=e.selectionEnd;if(t!==null&&i!==null)return[t,i]}catch{}return[e.value.length,e.value.length]}apply(e,t,i){e.value=t;try{e.setSelectionRange(i,i)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=ks(this.field.value,e)}press(e){let t=this.field;if(t){switch(e){case"hide":t.blur();return;case"done":this.commit(),t.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),t.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[i,o]=this.selection(t),a=$s(t.value,i,o);this.apply(t,a.value,a.caret);break}default:{let i=e==="space"?" ":this.shift?e.toUpperCase():e,[o,a]=this.selection(t),r=ws(t.value,o,a,i);this.apply(t,r.value,r.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let t=e.length>1,i=e==="layout"?this.layout==="letters"?"123":"ABC":ji[e]??(this.shift?e.toUpperCase():e);return f`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":t?"wide":""}
      aria-label=${qi[e]??i}
      aria-pressed=${e==="shift"?String(this.shift):T}
      @click=${()=>this.press(e)}
    >
      ${i}
    </button>`}render(){let e=this.layout==="letters"?vs:ys;return f`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(t=>f`<div class="row">${t.map(i=>this.key(i))}</div>`)}
      </div>`}};nt.styles=Ee`
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
  `,nt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",nt);function Ki(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function As(s){document.addEventListener("focusin",n=>{let e=n.composedPath()[0];_s(e)&&s.attach(e)}),document.addEventListener("focusout",()=>{setTimeout(()=>{let n=Ki();!s.target||n===s.target||(_s(n)?s.attach(n):s.detach())},0)}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var tn="mydashlight",Vi=`/api/${tn}/pair`,Wi=`/api/${tn}/pair/poll`,nn=`/${tn}`,sn="pair";function Ts(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Es(s,n){return`${s}${nn}?${sn}=${encodeURIComponent(n)}`}function Fi(s,n,e=Date.now()){return{hassUrl:s,clientId:n.client_id,access_token:n.access_token,refresh_token:n.refresh_token,expires_in:n.expires_in,expires:e+n.expires_in*1e3}}var Ie=class extends Error{constructor(n,e=!1){super(n),this.busy=e}};async function Cs(s=fetch){let n=await s(Vi,{method:"POST",cache:"no-store"});if(n.status===429)throw new Ie("Too many screens are asking to pair right now.",!0);if(!n.ok)throw new Ie(`Home Assistant answered ${n.status}.`);return await n.json()}async function Ps(s,n,e=fetch){let t=await e(Wi,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(t.status===404)return{status:"expired"};if(!t.ok)throw new Ie(`Home Assistant answered ${t.status}.`);let i=await t.json();return i.status==="paired"&&i.auth?{status:"paired",auth:Fi(n,i.auth)}:{status:"pending"}}var He=function(s,n){let i=s,o=st[n],a=null,r=0,l=null,d=[],g={},c=function(u,x){r=i*4+17,a=(function(h){let m=new Array(h);for(let b=0;b<h;b+=1){m[b]=new Array(h);for(let w=0;w<h;w+=1)m[b][w]=null}return m})(r),p(0,0),p(r-7,0),p(0,r-7),y(),k(),R(u,x),i>=7&&_(u),l==null&&(l=Q(i,o,d)),A(l,x)},p=function(u,x){for(let h=-1;h<=7;h+=1)if(!(u+h<=-1||r<=u+h))for(let m=-1;m<=7;m+=1)x+m<=-1||r<=x+m||(0<=h&&h<=6&&(m==0||m==6)||0<=m&&m<=6&&(h==0||h==6)||2<=h&&h<=4&&2<=m&&m<=4?a[u+h][x+m]=!0:a[u+h][x+m]=!1)},v=function(){let u=0,x=0;for(let h=0;h<8;h+=1){c(!0,h);let m=$e.getLostPoint(g);(h==0||u>m)&&(u=m,x=h)}return x},k=function(){for(let u=8;u<r-8;u+=1)a[u][6]==null&&(a[u][6]=u%2==0);for(let u=8;u<r-8;u+=1)a[6][u]==null&&(a[6][u]=u%2==0)},y=function(){let u=$e.getPatternPosition(i);for(let x=0;x<u.length;x+=1)for(let h=0;h<u.length;h+=1){let m=u[x],b=u[h];if(a[m][b]==null)for(let w=-2;w<=2;w+=1)for(let E=-2;E<=2;E+=1)w==-2||w==2||E==-2||E==2||w==0&&E==0?a[m+w][b+E]=!0:a[m+w][b+E]=!1}},_=function(u){let x=$e.getBCHTypeNumber(i);for(let h=0;h<18;h+=1){let m=!u&&(x>>h&1)==1;a[Math.floor(h/3)][h%3+r-8-3]=m}for(let h=0;h<18;h+=1){let m=!u&&(x>>h&1)==1;a[h%3+r-8-3][Math.floor(h/3)]=m}},R=function(u,x){let h=o<<3|x,m=$e.getBCHTypeInfo(h);for(let b=0;b<15;b+=1){let w=!u&&(m>>b&1)==1;b<6?a[b][8]=w:b<8?a[b+1][8]=w:a[r-15+b][8]=w}for(let b=0;b<15;b+=1){let w=!u&&(m>>b&1)==1;b<8?a[8][r-b-1]=w:b<9?a[8][15-b-1+1]=w:a[8][15-b-1]=w}a[r-8][8]=!u},A=function(u,x){let h=-1,m=r-1,b=7,w=0,E=$e.getMaskFunction(x);for(let M=r-1;M>0;M-=2)for(M==6&&(M-=1);;){for(let z=0;z<2;z+=1)if(a[m][M-z]==null){let H=!1;w<u.length&&(H=(u[w]>>>b&1)==1),E(m,M-z)&&(H=!H),a[m][M-z]=H,b-=1,b==-1&&(w+=1,b=7)}if(m+=h,m<0||r<=m){m-=h,h=-h;break}}},V=function(u,x){let h=0,m=0,b=0,w=new Array(x.length),E=new Array(x.length);for(let C=0;C<x.length;C+=1){let D=x[C].dataCount,q=x[C].totalCount-D;m=Math.max(m,D),b=Math.max(b,q),w[C]=new Array(D);for(let L=0;L<w[C].length;L+=1)w[C][L]=255&u.getBuffer()[L+h];h+=D;let $=$e.getErrorCorrectPolynomial(q),N=it(w[C],$.getLength()-1).mod($);E[C]=new Array($.getLength()-1);for(let L=0;L<E[C].length;L+=1){let O=L+N.getLength()-E[C].length;E[C][L]=O>=0?N.getAt(O):0}}let M=0;for(let C=0;C<x.length;C+=1)M+=x[C].totalCount;let z=new Array(M),H=0;for(let C=0;C<m;C+=1)for(let D=0;D<x.length;D+=1)C<w[D].length&&(z[H]=w[D][C],H+=1);for(let C=0;C<b;C+=1)for(let D=0;D<x.length;D+=1)C<E[D].length&&(z[H]=E[D][C],H+=1);return z},Q=function(u,x,h){let m=Ms.getRSBlocks(u,x),b=Ss();for(let E=0;E<h.length;E+=1){let M=h[E];b.put(M.getMode(),4),b.put(M.getLength(),$e.getLengthInBits(M.getMode(),u)),M.write(b)}let w=0;for(let E=0;E<m.length;E+=1)w+=m[E].dataCount;if(b.getLengthInBits()>w*8)throw"code length overflow. ("+b.getLengthInBits()+">"+w*8+")";for(b.getLengthInBits()+4<=w*8&&b.put(0,4);b.getLengthInBits()%8!=0;)b.putBit(!1);for(;!(b.getLengthInBits()>=w*8||(b.put(236,8),b.getLengthInBits()>=w*8));)b.put(17,8);return V(b,m)};g.addData=function(u,x){x=x||"Byte";let h=null;switch(x){case"Numeric":h=Gi(u);break;case"Alphanumeric":h=Yi(u);break;case"Byte":h=Qi(u);break;case"Kanji":h=Ji(u);break;default:throw"mode:"+x}d.push(h),l=null},g.isDark=function(u,x){if(u<0||r<=u||x<0||r<=x)throw u+","+x;return a[u][x]},g.getModuleCount=function(){return r},g.make=function(){if(i<1){let u=1;for(;u<40;u++){let x=Ms.getRSBlocks(u,o),h=Ss();for(let b=0;b<d.length;b++){let w=d[b];h.put(w.getMode(),4),h.put(w.getLength(),$e.getLengthInBits(w.getMode(),u)),w.write(h)}let m=0;for(let b=0;b<x.length;b++)m+=x[b].dataCount;if(h.getLengthInBits()<=m*8)break}i=u}c(!1,v())},g.createTableTag=function(u,x){u=u||2,x=typeof x>"u"?u*4:x;let h="";h+='<table style="',h+=" border-width: 0px; border-style: none;",h+=" border-collapse: collapse;",h+=" padding: 0px; margin: "+x+"px;",h+='">',h+="<tbody>";for(let m=0;m<g.getModuleCount();m+=1){h+="<tr>";for(let b=0;b<g.getModuleCount();b+=1)h+='<td style="',h+=" border-width: 0px; border-style: none;",h+=" border-collapse: collapse;",h+=" padding: 0px; margin: 0px;",h+=" width: "+u+"px;",h+=" height: "+u+"px;",h+=" background-color: ",h+=g.isDark(m,b)?"#000000":"#ffffff",h+=";",h+='"/>';h+="</tr>"}return h+="</tbody>",h+="</table>",h},g.createSvgTag=function(u,x,h,m){let b={};typeof arguments[0]=="object"&&(b=arguments[0],u=b.cellSize,x=b.margin,h=b.alt,m=b.title),u=u||2,x=typeof x>"u"?u*4:x,h=typeof h=="string"?{text:h}:h||{},h.text=h.text||null,h.id=h.text?h.id||"qrcode-description":null,m=typeof m=="string"?{text:m}:m||{},m.text=m.text||null,m.id=m.text?m.id||"qrcode-title":null;let w=g.getModuleCount()*u+x*2,E,M,z,H,C="",D;for(D="l"+u+",0 0,"+u+" -"+u+",0 0,-"+u+"z ",C+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',C+=b.scalable?"":' width="'+w+'px" height="'+w+'px"',C+=' viewBox="0 0 '+w+" "+w+'" ',C+=' preserveAspectRatio="xMinYMin meet"',C+=m.text||h.text?' role="img" aria-labelledby="'+B([m.id,h.id].join(" ").trim())+'"':"",C+=">",C+=m.text?'<title id="'+B(m.id)+'">'+B(m.text)+"</title>":"",C+=h.text?'<description id="'+B(h.id)+'">'+B(h.text)+"</description>":"",C+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',C+='<path d="',z=0;z<g.getModuleCount();z+=1)for(H=z*u+x,E=0;E<g.getModuleCount();E+=1)g.isDark(z,E)&&(M=E*u+x,C+="M"+M+","+H+D);return C+='" stroke="transparent" fill="black"/>',C+="</svg>",C},g.createDataURL=function(u,x){u=u||2,x=typeof x>"u"?u*4:x;let h=g.getModuleCount()*u+x*2,m=x,b=h-x;return tr(h,h,function(w,E){if(m<=w&&w<b&&m<=E&&E<b){let M=Math.floor((w-m)/u),z=Math.floor((E-m)/u);return g.isDark(z,M)?0:1}else return 1})},g.createImgTag=function(u,x,h){u=u||2,x=typeof x>"u"?u*4:x;let m=g.getModuleCount()*u+x*2,b="";return b+="<img",b+=' src="',b+=g.createDataURL(u,x),b+='"',b+=' width="',b+=m,b+='"',b+=' height="',b+=m,b+='"',h&&(b+=' alt="',b+=B(h),b+='"'),b+="/>",b};let B=function(u){let x="";for(let h=0;h<u.length;h+=1){let m=u.charAt(h);switch(m){case"<":x+="&lt;";break;case">":x+="&gt;";break;case"&":x+="&amp;";break;case'"':x+="&quot;";break;default:x+=m;break}}return x},W=function(u){u=typeof u>"u"?2:u;let h=g.getModuleCount()*1+u*2,m=u,b=h-u,w,E,M,z,H,C={"██":"█","█ ":"▀"," █":"▄","  ":" "},D={"██":"▀","█ ":"▀"," █":" ","  ":" "},q="";for(w=0;w<h;w+=2){for(M=Math.floor((w-m)/1),z=Math.floor((w+1-m)/1),E=0;E<h;E+=1)H="█",m<=E&&E<b&&m<=w&&w<b&&g.isDark(M,Math.floor((E-m)/1))&&(H=" "),m<=E&&E<b&&m<=w+1&&w+1<b&&g.isDark(z,Math.floor((E-m)/1))?H+=" ":H+="█",q+=u<1&&w+1>=b?D[H]:C[H];q+=`
`}return h%2&&u>0?q.substring(0,q.length-h-1)+Array(h+1).join("▀"):q.substring(0,q.length-1)};return g.createASCII=function(u,x){if(u=u||1,u<2)return W(x);u-=1,x=typeof x>"u"?u*2:x;let h=g.getModuleCount()*u+x*2,m=x,b=h-x,w,E,M,z,H=Array(u+1).join("██"),C=Array(u+1).join("  "),D="",q="";for(w=0;w<h;w+=1){for(M=Math.floor((w-m)/u),q="",E=0;E<h;E+=1)z=1,m<=E&&E<b&&m<=w&&w<b&&g.isDark(M,Math.floor((E-m)/u))&&(z=0),q+=z?H:C;for(M=0;M<u;M+=1)D+=q+`
`}return D.substring(0,D.length-1)},g.renderTo2dContext=function(u,x){x=x||2;let h=g.getModuleCount();for(let m=0;m<h;m++)for(let b=0;b<h;b++)u.fillStyle=g.isDark(m,b)?"black":"white",u.fillRect(b*x,m*x,x,x)},g};He.stringToBytes=function(s){let n=[];for(let e=0;e<s.length;e+=1){let t=s.charCodeAt(e);n.push(t&255)}return n};He.createStringToBytes=function(s,n){let e=(function(){let i=Zi(s),o=function(){let l=i.read();if(l==-1)throw"eof";return l},a=0,r={};for(;;){let l=i.read();if(l==-1)break;let d=o(),g=o(),c=o(),p=String.fromCharCode(l<<8|d),v=g<<8|c;r[p]=v,a+=1}if(a!=n)throw a+" != "+n;return r})(),t=63;return function(i){let o=[];for(let a=0;a<i.length;a+=1){let r=i.charCodeAt(a);if(r<128)o.push(r);else{let l=e[i.charAt(a)];typeof l=="number"?(l&255)==l?o.push(l):(o.push(l>>>8),o.push(l&255)):o.push(t)}}return o}};var ne={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},st={L:1,M:0,Q:3,H:2},we={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},$e=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,e=7973,t=21522,i={},o=function(a){let r=0;for(;a!=0;)r+=1,a>>>=1;return r};return i.getBCHTypeInfo=function(a){let r=a<<10;for(;o(r)-o(n)>=0;)r^=n<<o(r)-o(n);return(a<<10|r)^t},i.getBCHTypeNumber=function(a){let r=a<<12;for(;o(r)-o(e)>=0;)r^=e<<o(r)-o(e);return a<<12|r},i.getPatternPosition=function(a){return s[a-1]},i.getMaskFunction=function(a){switch(a){case we.PATTERN000:return function(r,l){return(r+l)%2==0};case we.PATTERN001:return function(r,l){return r%2==0};case we.PATTERN010:return function(r,l){return l%3==0};case we.PATTERN011:return function(r,l){return(r+l)%3==0};case we.PATTERN100:return function(r,l){return(Math.floor(r/2)+Math.floor(l/3))%2==0};case we.PATTERN101:return function(r,l){return r*l%2+r*l%3==0};case we.PATTERN110:return function(r,l){return(r*l%2+r*l%3)%2==0};case we.PATTERN111:return function(r,l){return(r*l%3+(r+l)%2)%2==0};default:throw"bad maskPattern:"+a}},i.getErrorCorrectPolynomial=function(a){let r=it([1],0);for(let l=0;l<a;l+=1)r=r.multiply(it([1,ke.gexp(l)],0));return r},i.getLengthInBits=function(a,r){if(1<=r&&r<10)switch(a){case ne.MODE_NUMBER:return 10;case ne.MODE_ALPHA_NUM:return 9;case ne.MODE_8BIT_BYTE:return 8;case ne.MODE_KANJI:return 8;default:throw"mode:"+a}else if(r<27)switch(a){case ne.MODE_NUMBER:return 12;case ne.MODE_ALPHA_NUM:return 11;case ne.MODE_8BIT_BYTE:return 16;case ne.MODE_KANJI:return 10;default:throw"mode:"+a}else if(r<41)switch(a){case ne.MODE_NUMBER:return 14;case ne.MODE_ALPHA_NUM:return 13;case ne.MODE_8BIT_BYTE:return 16;case ne.MODE_KANJI:return 12;default:throw"mode:"+a}else throw"type:"+r},i.getLostPoint=function(a){let r=a.getModuleCount(),l=0;for(let c=0;c<r;c+=1)for(let p=0;p<r;p+=1){let v=0,k=a.isDark(c,p);for(let y=-1;y<=1;y+=1)if(!(c+y<0||r<=c+y))for(let _=-1;_<=1;_+=1)p+_<0||r<=p+_||y==0&&_==0||k==a.isDark(c+y,p+_)&&(v+=1);v>5&&(l+=3+v-5)}for(let c=0;c<r-1;c+=1)for(let p=0;p<r-1;p+=1){let v=0;a.isDark(c,p)&&(v+=1),a.isDark(c+1,p)&&(v+=1),a.isDark(c,p+1)&&(v+=1),a.isDark(c+1,p+1)&&(v+=1),(v==0||v==4)&&(l+=3)}for(let c=0;c<r;c+=1)for(let p=0;p<r-6;p+=1)a.isDark(c,p)&&!a.isDark(c,p+1)&&a.isDark(c,p+2)&&a.isDark(c,p+3)&&a.isDark(c,p+4)&&!a.isDark(c,p+5)&&a.isDark(c,p+6)&&(l+=40);for(let c=0;c<r;c+=1)for(let p=0;p<r-6;p+=1)a.isDark(p,c)&&!a.isDark(p+1,c)&&a.isDark(p+2,c)&&a.isDark(p+3,c)&&a.isDark(p+4,c)&&!a.isDark(p+5,c)&&a.isDark(p+6,c)&&(l+=40);let d=0;for(let c=0;c<r;c+=1)for(let p=0;p<r;p+=1)a.isDark(p,c)&&(d+=1);let g=Math.abs(100*d/r/r-50)/5;return l+=g*10,l},i})(),ke=(function(){let s=new Array(256),n=new Array(256);for(let t=0;t<8;t+=1)s[t]=1<<t;for(let t=8;t<256;t+=1)s[t]=s[t-4]^s[t-5]^s[t-6]^s[t-8];for(let t=0;t<255;t+=1)n[s[t]]=t;let e={};return e.glog=function(t){if(t<1)throw"glog("+t+")";return n[t]},e.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return s[t]},e})(),it=function(s,n){if(typeof s.length>"u")throw s.length+"/"+n;let e=(function(){let i=0;for(;i<s.length&&s[i]==0;)i+=1;let o=new Array(s.length-i+n);for(let a=0;a<s.length-i;a+=1)o[a]=s[a+i];return o})(),t={};return t.getAt=function(i){return e[i]},t.getLength=function(){return e.length},t.multiply=function(i){let o=new Array(t.getLength()+i.getLength()-1);for(let a=0;a<t.getLength();a+=1)for(let r=0;r<i.getLength();r+=1)o[a+r]^=ke.gexp(ke.glog(t.getAt(a))+ke.glog(i.getAt(r)));return it(o,0)},t.mod=function(i){if(t.getLength()-i.getLength()<0)return t;let o=ke.glog(t.getAt(0))-ke.glog(i.getAt(0)),a=new Array(t.getLength());for(let r=0;r<t.getLength();r+=1)a[r]=t.getAt(r);for(let r=0;r<i.getLength();r+=1)a[r]^=ke.gexp(ke.glog(i.getAt(r))+o);return it(a,0).mod(i)},t},Ms=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],n=function(i,o){let a={};return a.totalCount=i,a.dataCount=o,a},e={},t=function(i,o){switch(o){case st.L:return s[(i-1)*4+0];case st.M:return s[(i-1)*4+1];case st.Q:return s[(i-1)*4+2];case st.H:return s[(i-1)*4+3];default:return}};return e.getRSBlocks=function(i,o){let a=t(i,o);if(typeof a>"u")throw"bad rs block @ typeNumber:"+i+"/errorCorrectionLevel:"+o;let r=a.length/3,l=[];for(let d=0;d<r;d+=1){let g=a[d*3+0],c=a[d*3+1],p=a[d*3+2];for(let v=0;v<g;v+=1)l.push(n(c,p))}return l},e})(),Ss=function(){let s=[],n=0,e={};return e.getBuffer=function(){return s},e.getAt=function(t){let i=Math.floor(t/8);return(s[i]>>>7-t%8&1)==1},e.put=function(t,i){for(let o=0;o<i;o+=1)e.putBit((t>>>i-o-1&1)==1)},e.getLengthInBits=function(){return n},e.putBit=function(t){let i=Math.floor(n/8);s.length<=i&&s.push(0),t&&(s[i]|=128>>>n%8),n+=1},e},Gi=function(s){let n=ne.MODE_NUMBER,e=s,t={};t.getMode=function(){return n},t.getLength=function(a){return e.length},t.write=function(a){let r=e,l=0;for(;l+2<r.length;)a.put(i(r.substring(l,l+3)),10),l+=3;l<r.length&&(r.length-l==1?a.put(i(r.substring(l,l+1)),4):r.length-l==2&&a.put(i(r.substring(l,l+2)),7))};let i=function(a){let r=0;for(let l=0;l<a.length;l+=1)r=r*10+o(a.charAt(l));return r},o=function(a){if("0"<=a&&a<="9")return a.charCodeAt(0)-48;throw"illegal char :"+a};return t},Yi=function(s){let n=ne.MODE_ALPHA_NUM,e=s,t={};t.getMode=function(){return n},t.getLength=function(o){return e.length},t.write=function(o){let a=e,r=0;for(;r+1<a.length;)o.put(i(a.charAt(r))*45+i(a.charAt(r+1)),11),r+=2;r<a.length&&o.put(i(a.charAt(r)),6)};let i=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;if("A"<=o&&o<="Z")return o.charCodeAt(0)-65+10;switch(o){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+o}};return t},Qi=function(s){let n=ne.MODE_8BIT_BYTE,e=s,t=He.stringToBytes(s),i={};return i.getMode=function(){return n},i.getLength=function(o){return t.length},i.write=function(o){for(let a=0;a<t.length;a+=1)o.put(t[a],8)},i},Ji=function(s){let n=ne.MODE_KANJI,e=s,t=He.stringToBytes;(function(a,r){let l=t(a);if(l.length!=2||(l[0]<<8|l[1])!=r)throw"sjis not supported."})("友",38726);let i=t(s),o={};return o.getMode=function(){return n},o.getLength=function(a){return~~(i.length/2)},o.write=function(a){let r=i,l=0;for(;l+1<r.length;){let d=(255&r[l])<<8|255&r[l+1];if(33088<=d&&d<=40956)d-=33088;else if(57408<=d&&d<=60351)d-=49472;else throw"illegal char at "+(l+1)+"/"+d;d=(d>>>8&255)*192+(d&255),a.put(d,13),l+=2}if(l<r.length)throw"illegal char at "+(l+1)},o},Ds=function(){let s=[],n={};return n.writeByte=function(e){s.push(e&255)},n.writeShort=function(e){n.writeByte(e),n.writeByte(e>>>8)},n.writeBytes=function(e,t,i){t=t||0,i=i||e.length;for(let o=0;o<i;o+=1)n.writeByte(e[o+t])},n.writeString=function(e){for(let t=0;t<e.length;t+=1)n.writeByte(e.charCodeAt(t))},n.toByteArray=function(){return s},n.toString=function(){let e="";e+="[";for(let t=0;t<s.length;t+=1)t>0&&(e+=","),e+=s[t];return e+="]",e},n},Xi=function(){let s=0,n=0,e=0,t="",i={},o=function(r){t+=String.fromCharCode(a(r&63))},a=function(r){if(r<0)throw"n:"+r;if(r<26)return 65+r;if(r<52)return 97+(r-26);if(r<62)return 48+(r-52);if(r==62)return 43;if(r==63)return 47;throw"n:"+r};return i.writeByte=function(r){for(s=s<<8|r&255,n+=8,e+=1;n>=6;)o(s>>>n-6),n-=6},i.flush=function(){if(n>0&&(o(s<<6-n),s=0,n=0),e%3!=0){let r=3-e%3;for(let l=0;l<r;l+=1)t+="="}},i.toString=function(){return t},i},Zi=function(s){let n=s,e=0,t=0,i=0,o={};o.read=function(){for(;i<8;){if(e>=n.length){if(i==0)return-1;throw"unexpected end of file./"+i}let l=n.charAt(e);if(e+=1,l=="=")return i=0,-1;if(l.match(/^\s$/))continue;t=t<<6|a(l.charCodeAt(0)),i+=6}let r=t>>>i-8&255;return i-=8,r};let a=function(r){if(65<=r&&r<=90)return r-65;if(97<=r&&r<=122)return r-97+26;if(48<=r&&r<=57)return r-48+52;if(r==43)return 62;if(r==47)return 63;throw"c:"+r};return o},er=function(s,n){let e=s,t=n,i=new Array(s*n),o={};o.setPixel=function(d,g,c){i[g*e+d]=c},o.write=function(d){d.writeString("GIF87a"),d.writeShort(e),d.writeShort(t),d.writeByte(128),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(0),d.writeByte(255),d.writeByte(255),d.writeByte(255),d.writeString(","),d.writeShort(0),d.writeShort(0),d.writeShort(e),d.writeShort(t),d.writeByte(0);let g=2,c=r(g);d.writeByte(g);let p=0;for(;c.length-p>255;)d.writeByte(255),d.writeBytes(c,p,255),p+=255;d.writeByte(c.length-p),d.writeBytes(c,p,c.length-p),d.writeByte(0),d.writeString(";")};let a=function(d){let g=d,c=0,p=0,v={};return v.write=function(k,y){if(k>>>y)throw"length over";for(;c+y>=8;)g.writeByte(255&(k<<c|p)),y-=8-c,k>>>=8-c,p=0,c=0;p=k<<c|p,c=c+y},v.flush=function(){c>0&&g.writeByte(p)},v},r=function(d){let g=1<<d,c=(1<<d)+1,p=d+1,v=l();for(let A=0;A<g;A+=1)v.add(String.fromCharCode(A));v.add(String.fromCharCode(g)),v.add(String.fromCharCode(c));let k=Ds(),y=a(k);y.write(g,p);let _=0,R=String.fromCharCode(i[_]);for(_+=1;_<i.length;){let A=String.fromCharCode(i[_]);_+=1,v.contains(R+A)?R=R+A:(y.write(v.indexOf(R),p),v.size()<4095&&(v.size()==1<<p&&(p+=1),v.add(R+A)),R=A)}return y.write(v.indexOf(R),p),y.write(c,p),y.flush(),k.toByteArray()},l=function(){let d={},g=0,c={};return c.add=function(p){if(c.contains(p))throw"dup key:"+p;d[p]=g,g+=1},c.size=function(){return g},c.indexOf=function(p){return d[p]},c.contains=function(p){return typeof d[p]<"u"},c};return o},tr=function(s,n,e){let t=er(s,n);for(let r=0;r<n;r+=1)for(let l=0;l<s;l+=1)t.setPixel(l,r,e(l,r));let i=Ds();t.write(i);let o=Xi(),a=i.toByteArray();for(let r=0;r<a.length;r+=1)o.writeByte(a[r]);return o.flush(),"data:image/gif;base64,"+o},Rs=He,Mo=He.stringToBytes;function Ls(s){let n=Rs(0,"M");n.addData(s),n.make();let e=n.getModuleCount(),t="";for(let i=0;i<e;i++)for(let o=0;o<e;o++)n.isDark(i,o)&&(t+=`M${o} ${i}h1v1h-1z`);return{size:e,d:t}}var nr=1e4,rt=class extends le{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,t){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,t))}async newCode(){try{let e=await Cs();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof Ie&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),nr)}}async poll(e){let t=this.secret;if(t)try{let i=await Ps(t,location.origin);if(!this.running||t!==this.secret)return;if(this.problem=null,i.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:i.auth}));return}if(i.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return T;let{size:e,d:t}=Ls(Es(location.origin,this.code));return f`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${de`<path d=${t} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return f`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?Ts(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${nn}?${sn}</span> and type the code.
          </li>
          <li>You’ll need to be a Home Assistant admin. The screen signs in as you.</li>
        </ol>
      </div>
      <div class="qr">${this.qr()}</div>
      <div class="foot">
        ${this.problem?f`<span class="problem" role="alert">${this.problem}</span>`:f`<span>${this.code?`A new code appears in ${e} minute${e===1?"":"s"}.`:"Getting a code…"}</span>`}
        <button type="button" class="link" @click=${()=>this.dispatchEvent(new CustomEvent("password"))}>
          Sign in with a password instead
        </button>
      </div>
    </div>`}};rt.styles=Ee`
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
  `,rt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",rt);var rn="hassTokens";function Is(){try{let s=localStorage.getItem(rn);return s?JSON.parse(s):null}catch{return null}}function on(s){try{s?localStorage.setItem(rn,JSON.stringify(s)):localStorage.removeItem(rn)}catch{}}function sr(s){let n=document.getElementById("problem");n&&(n.hidden=!1,n.querySelector("p").textContent=s)}function ir(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(n=>{let e=t=>{s.stop(),s.hidden=!0,n(t)};s.addEventListener("paired",t=>e(t.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function rr(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let n=location.search.includes("auth_callback");if(!n&&!Is()){let e=await ir();e&&on(e)}try{let e=await _n({hassUrl:location.origin,loadTokens:async()=>Is(),saveTokens:on});n&&history.replaceState(null,"",location.pathname+en(location.search));let t=await An({auth:e});s.backend=new ct(t),t.addEventListener("reconnect-error",(i,o)=>{o===2&&Bs()})}catch(e){if(e===2){Bs();return}sr(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function Bs(){on(null),location.replace(location.pathname+en(location.search))}var Ns=document.querySelector("mydashlight-keyboard");Ns&&Ze(location.search).keyboard!==!1&&As(Ns);rr();
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
