function Xn(s){return{type:"auth",access_token:s}}function es(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function ts(s){let n={type:"subscribe_events"};return s&&(n.event_type=s),n}function sn(s){return{type:"unsubscribe_events",subscription:s}}function ns(){return{type:"ping"}}function ss(s,n){return{type:"result",success:!1,error:{code:s,message:n}}}function rs(s){let n={},e=s.split("&");for(let t=0;t<e.length;t++){let i=e[t].split("="),r=decodeURIComponent(i[0]),o=i.length>1?decodeURIComponent(i[1]):void 0;n[r]=o}return n}var os=(s,n,e,t)=>{let[i,r,o]=s.split(".",3);return Number(i)>n||Number(i)===n&&(t===void 0?Number(r)>=e:Number(r)>e)||t!==void 0&&Number(i)===n&&Number(r)===e&&Number(o)>=t};var kt=!1,qi="auth_required",Wi="auth_invalid",Fi="auth_ok";function ls(s){if(!s.auth)throw 4;let n=s.auth,e=n.expired?n.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,t=n.wsUrl;kt&&console.log("[Auth phase] Initializing",t);function i(r,o,a){kt&&console.log("[Auth Phase] New connection",t);let d=new WebSocket(t),l=!1,c=()=>{if(d.removeEventListener("close",c),l){a(2);return}if(r===0){a(1);return}let m=r===-1?-1:r-1;setTimeout(()=>i(m,o,a),1e3)},h=async m=>{try{n.expired&&await(e||n.refreshAccessToken()),d.send(JSON.stringify(Xn(n.accessToken)))}catch(A){l=A===2,d.close()}},f=async m=>{let A=JSON.parse(m.data);switch(kt&&console.log("[Auth phase] Received",A),A.type){case Wi:l=!0,d.close();break;case Fi:d.removeEventListener("open",h),d.removeEventListener("message",f),d.removeEventListener("close",c),d.removeEventListener("error",c),d.haVersion=A.ha_version,os(d.haVersion,2022,9)&&d.send(JSON.stringify(es())),o(d);break;default:kt&&A.type!==qi&&console.warn("[Auth phase] Unhandled message",A)}};d.addEventListener("open",h),d.addEventListener("message",f),d.addEventListener("close",c),d.addEventListener("error",c)}return new Promise((r,o)=>i(s.setupRetry,r,o))}var nt=!1,_t=class{constructor(n,e){this._handleMessage=t=>{let i=JSON.parse(t.data);Array.isArray(i)||(i=[i]),i.forEach(r=>{nt&&console.log("Received",r);let o=this.commands.get(r.id);switch(r.type){case"event":o?o.callback(r.event):(console.warn(`Received event for unknown subscription ${r.id}. Unsubscribing.`),this.sendMessagePromise(sn(r.id)).catch(a=>{nt&&console.warn(` Error unsubsribing from unknown subscription ${r.id}`,a)}));break;case"result":o&&(r.success?(o.resolve(r.result),"subscribe"in o||this.commands.delete(r.id)):(o.reject(r.error),this.commands.delete(r.id)));break;case"pong":o?(o.resolve(),this.commands.delete(r.id)):console.warn(`Received unknown pong response ${r.id}`);break;default:nt&&console.warn("Unhandled message",r)}})},this._handleClose=async()=>{let t=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,t.forEach(o=>{"subscribe"in o||o.reject(ss(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),r=o=>{setTimeout(async()=>{if(!this.closeRequested){nt&&console.log("Trying to reconnect");try{let a=await i.createSocket(i);this._setSocket(a)}catch(a){if(this._queuedMessages){let d=this._queuedMessages;this._queuedMessages=void 0;for(let l of d)l.reject&&l.reject(3)}a===2?this.fireEvent("reconnect-error",a):r(o+1)}}},Math.min(o,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),r(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(n)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(n){this.socket=n,this.haVersion=n.haVersion,n.addEventListener("message",this._handleMessage),n.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(r=>{i.unsubscribe=r,i.resolve()})}));let t=this._queuedMessages;if(t){this._queuedMessages=void 0;for(let i of t)i.resolve()}this.fireEvent("ready")}addEventListener(n,e){let t=this.eventListeners.get(n);t||(t=[],this.eventListeners.set(n,t)),t.push(e)}removeEventListener(n,e){let t=this.eventListeners.get(n);if(!t)return;let i=t.indexOf(e);i!==-1&&t.splice(i,1)}fireEvent(n,e){(this.eventListeners.get(n)||[]).forEach(t=>t(this,e))}suspendReconnectUntil(n){this.suspendReconnectPromise=n}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(n=!1){if(this.socket){if(!n){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(n,e){return this.subscribeMessage(n,ts(e))}ping(){return this.sendMessagePromise(ns())}sendMessage(n,e){if(!this.connected)throw 3;if(nt&&console.log("Sending",n),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(n)});return}e||(e=this._genCmdId()),n.id=e,this.socket.send(JSON.stringify(n))}sendMessagePromise(n){return new Promise((e,t)=>{if(this._queuedMessages){this._queuedMessages.push({reject:t,resolve:async()=>{try{e(await this.sendMessagePromise(n))}catch(r){t(r)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:t}),this.sendMessage(n,i)})}async subscribeMessage(n,e,t){if(this._queuedMessages&&await new Promise((r,o)=>{this._queuedMessages.push({resolve:r,reject:o})}),t?.preCheck&&!await t.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((r,o)=>{let a=this._genCmdId();i={resolve:r,reject:o,callback:n,subscribe:t?.resubscribe!==!1?()=>this.subscribeMessage(n,e,t):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(sn(a)),this.commands.delete(a)}},this.commands.set(a,i);try{this.sendMessage(e,a)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var Vi=()=>`${location.protocol}//${location.host}/`,Gi=s=>s*1e3+Date.now();function Yi(){let{protocol:s,host:n,pathname:e,search:t}=location;return`${s}//${n}${e}${t}`}function Ji(s,n,e,t){let i=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return n!==null&&(i+=`&client_id=${encodeURIComponent(n)}`),t&&(i+=`&state=${encodeURIComponent(t)}`),i}function Qi(s,n,e,t){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Ji(s,n,e,t)}async function hs(s,n,e){let t=typeof location<"u"&&location;if(t&&t.protocol==="https:"){let a=document.createElement("a");if(a.href=s,a.protocol==="http:"&&a.hostname!=="localhost")throw 5}let i=new FormData;n!==null&&i.append("client_id",n),Object.keys(e).forEach(a=>{i.append(a,e[a])});let r=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!r.ok)throw r.status===400||r.status===403?2:new Error("Unable to fetch tokens");let o=await r.json();return o.hassUrl=s,o.clientId=n,o.expires=Gi(o.expires_in),o}function cs(s,n,e){return hs(s,n,{code:e,grant_type:"authorization_code"})}function Zi(s){return btoa(JSON.stringify(s))}function Xi(s){return JSON.parse(atob(s))}var rn=class{constructor(n,e){this.data=n,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let n=await hs(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});n.refresh_token=this.data.refresh_token,this.data=n,this._saveTokens&&this._saveTokens(n)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let n=new FormData;n.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:n}),this._saveTokens&&this._saveTokens(null)}};async function ps(s={}){let n,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let t=s.clientId!==void 0?s.clientId:Vi(),i=s.limitHassInstance===!0;if(s.authCode&&e&&(n=await cs(e,t,s.authCode),s.saveTokens&&s.saveTokens(n)),!n){let r=rs(location.search.substr(1));if("auth_callback"in r){let o=Xi(r.state);if(i&&(o.hassUrl!==e||o.clientId!==t))throw 6;n=await cs(o.hassUrl,o.clientId,r.code),s.saveTokens&&s.saveTokens(n)}}if(!n&&s.loadTokens&&(n=await s.loadTokens()),n&&(e===void 0||n.hassUrl===e))return new rn(n,s.saveTokens);if(e===void 0)throw 4;return Qi(e,t,s.redirectUrl||Yi(),Zi({hassUrl:e,clientId:t})),new Promise(()=>{})}async function us(s){let n=Object.assign({setupRetry:0,createSocket:ls},s),e=await n.createSocket(n);return new _t(e,n)}function N(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function st(s){let n=Math.floor(Math.round(s)/60)%24;return`${N(s)} ${n<12?"AM":"PM"}`}function fs(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function rt(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function gs(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var er=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),tr=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),nr=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function Ct(s){return new Date(`${s}T12:00:00Z`)}function ye(s){let n=Ct(s);return`${er.format(n)}, ${nr.format(n)}`}function de(s){return tr.format(Ct(s))}function we(s,n){return Math.round((Ct(n).getTime()-Ct(s).getTime())/864e5)}function it(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return it("UTC",n)}let t=i=>e.find(r=>r.type===i)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function Tt(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let i=it(e,s),r=it(e,n).date;return i.date===r?`at ${st(i.minutes)}`:`on ${de(i.date)} at ${st(i.minutes)}`}var ee=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}},Ie="mydashlight",sr=7,ms=3e4;function on(s){if(s instanceof ee)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new ee(String(n.code??"error"),n.message)}return typeof s=="number"?new ee("connection_lost","Lost the connection to Home Assistant."):new ee("error",String(s))}var At=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new ee("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.pushing}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},ms),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,n&&n().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(n=>{this.pushing=!0,n.plan?this.emit(n.plan):this.fail(new ee("not_running","MyDashLight isn’t running right now."))},{type:`${Ie}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await this.conn.sendMessagePromise({type:"call_service",domain:Ie,service:"get_plan",service_data:{days:sr},return_response:!0});this.emit(n.response)}catch(n){this.fail(on(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ie,service:n,service_data:e})}catch(t){throw on(t)}this.pushing||await this.refresh()}setRide(n,e,t,i){return this.call("set_ride",{event:n,side:e,driver:t,scope:i})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:gs(e),scope:t})}setTakeAlong(n,e,t,i="drop"){return this.call("set_take_along",{event:n,kids:e,scope:t,side:i})}setTakes(n,e,t){return this.call("set_takes",e==null?{event:n,scope:t}:{event:n,minutes:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}watchChores(n){let e=!1,t=null,i=null,r=async()=>{try{let o=await this.conn.sendMessagePromise({type:"call_service",domain:Ie,service:"get_chores",service_data:{},return_response:!0});e||n(o.response??null)}catch{e||n(null)}};return(async()=>{try{let o=await this.conn.subscribeMessage(a=>{e||n(a.chores)},{type:`${Ie}/chores/subscribe`},{resubscribe:!0});e?o().catch(()=>{}):t=o}catch{if(e)return;r(),i=setInterval(()=>void r(),ms)}})(),()=>{e=!0,i&&clearInterval(i),t&&t().catch(()=>{})}}watchLunch(n){let e=!1,t=null;return(async()=>{try{let i=await this.conn.subscribeMessage(r=>{e||n(r.lunch)},{type:`${Ie}/lunch/subscribe`},{resubscribe:!0});e?i().catch(()=>{}):t=i}catch{e||n(null)}})(),()=>{e=!0,t&&t().catch(()=>{})}}async setLunch(n,e,t){await this.choreCall("set_lunch",{kid:n,dates:e,lunch:t??"default"})}async setLunchMenu(n,e,t,i){await this.choreCall("set_lunch_menu",{kids:n,date:e,menu:t,details:i})}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Ie,service:n,service_data:e})}catch(t){throw on(t)}}};var Et=globalThis,Mt=Et.ShadowRoot&&(Et.ShadyCSS===void 0||Et.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,an=Symbol(),bs=new WeakMap,ot=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==an)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(Mt&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=bs.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&bs.set(e,n))}return n}toString(){return this.cssText}},xs=s=>new ot(typeof s=="string"?s:s+"",void 0,an),Oe=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,i,r)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new ot(e,s,an)},vs=(s,n)=>{if(Mt)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=Et.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,s.appendChild(t)}},ln=Mt?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return xs(e)})(s):s;var{is:ir,defineProperty:rr,getOwnPropertyDescriptor:or,getOwnPropertyNames:ar,getOwnPropertySymbols:lr,getPrototypeOf:dr}=Object,Pt=globalThis,ys=Pt.trustedTypes,cr=ys?ys.emptyScript:"",hr=Pt.reactiveElementPolyfillSupport,at=(s,n)=>s,dn={toAttribute(s,n){switch(n){case Boolean:s=s?cr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},$s=(s,n)=>!ir(s,n),ws={attribute:!0,type:String,converter:dn,reflect:!1,useDefault:!1,hasChanged:$s};Symbol.metadata??=Symbol("metadata"),Pt.litPropertyMetadata??=new WeakMap;var Ce=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=ws){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&rr(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:r}=or(this.prototype,n)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let a=i?.call(this);r?.call(this,o),this.requestUpdate(n,a,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??ws}static _$Ei(){if(this.hasOwnProperty(at("elementProperties")))return;let n=dr(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(at("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(at("properties"))){let e=this.properties,t=[...ar(e),...lr(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(ln(i))}else n!==void 0&&e.push(ln(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vs(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:dn).toAttribute(e,t.type);this._$Em=n,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let r=t.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:dn;this._$Em=i;let a=o.fromAttribute(e,r.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(n,e,t,i=!1,r){if(n!==void 0){let o=this.constructor;if(i===!1&&(r=this[n]),t??=o.getPropertyOptions(n),!((t.hasChanged??$s)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:r},o){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??e??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,r]of t){let{wrapped:o}=r,a=this[i];o!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,r,a)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};Ce.elementStyles=[],Ce.shadowRootOptions={mode:"open"},Ce[at("elementProperties")]=new Map,Ce[at("finalized")]=new Map,hr?.({ReactiveElement:Ce}),(Pt.reactiveElementVersions??=[]).push("2.1.2");var hn=globalThis,ks=s=>s,St=hn.trustedTypes,_s=St?St.createPolicy("lit-html",{createHTML:s=>s}):void 0,pn="$lit$",Te=`lit$${Math.random().toFixed(9).slice(2)}$`,un="?"+Te,pr=`<${un}>`,He=document,dt=()=>He.createComment(""),ct=s=>s===null||typeof s!="object"&&typeof s!="function",fn=Array.isArray,Ps=s=>fn(s)||typeof s?.[Symbol.iterator]=="function",cn=`[ 	
\f\r]`,lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Cs=/-->/g,Ts=/>/g,ze=RegExp(`>|${cn}(?:([^\\s"'>=/]+)(${cn}*=${cn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),As=/'/g,Es=/"/g,Ss=/^(?:script|style|textarea|title)$/i,gn=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),p=gn(1),te=gn(2),Go=gn(3),Ae=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ms=new WeakMap,Ue=He.createTreeWalker(He,129);function Ds(s,n){if(!fn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return _s!==void 0?_s.createHTML(n):n}var Ls=(s,n)=>{let e=s.length-1,t=[],i,r=n===2?"<svg>":n===3?"<math>":"",o=lt;for(let a=0;a<e;a++){let d=s[a],l,c,h=-1,f=0;for(;f<d.length&&(o.lastIndex=f,c=o.exec(d),c!==null);)f=o.lastIndex,o===lt?c[1]==="!--"?o=Cs:c[1]!==void 0?o=Ts:c[2]!==void 0?(Ss.test(c[2])&&(i=RegExp("</"+c[2],"g")),o=ze):c[3]!==void 0&&(o=ze):o===ze?c[0]===">"?(o=i??lt,h=-1):c[1]===void 0?h=-2:(h=o.lastIndex-c[2].length,l=c[1],o=c[3]===void 0?ze:c[3]==='"'?Es:As):o===Es||o===As?o=ze:o===Cs||o===Ts?o=lt:(o=ze,i=void 0);let m=o===ze&&s[a+1].startsWith("/>")?" ":"";r+=o===lt?d+pr:h>=0?(t.push(l),d.slice(0,h)+pn+d.slice(h)+Te+m):d+Te+(h===-2?a:m)}return[Ds(s,r+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},ht=class s{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let r=0,o=0,a=n.length-1,d=this.parts,[l,c]=Ls(n,e);if(this.el=s.createElement(l,t),Ue.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=Ue.nextNode())!==null&&d.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(pn)){let f=c[o++],m=i.getAttribute(h).split(Te),A=/([.?@])?(.*)/.exec(f);d.push({type:1,index:r,name:A[2],strings:m,ctor:A[1]==="."?Lt:A[1]==="?"?Rt:A[1]==="@"?Bt:Ke}),i.removeAttribute(h)}else h.startsWith(Te)&&(d.push({type:6,index:r}),i.removeAttribute(h));if(Ss.test(i.tagName)){let h=i.textContent.split(Te),f=h.length-1;if(f>0){i.textContent=St?St.emptyScript:"";for(let m=0;m<f;m++)i.append(h[m],dt()),Ue.nextNode(),d.push({type:2,index:++r});i.append(h[f],dt())}}}else if(i.nodeType===8)if(i.data===un)d.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(Te,h+1))!==-1;)d.push({type:7,index:r}),h+=Te.length-1}r++}}static createElement(n,e){let t=He.createElement("template");return t.innerHTML=n,t}};function je(s,n,e=s,t){if(n===Ae)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,r=ct(n)?void 0:n._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=je(s,i._$AS(s,n.values),i,t)),n}var Dt=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??He).importNode(e,!0);Ue.currentNode=i;let r=Ue.nextNode(),o=0,a=0,d=t[0];for(;d!==void 0;){if(o===d.index){let l;d.type===2?l=new Ye(r,r.nextSibling,this,n):d.type===1?l=new d.ctor(r,d.name,d.strings,this,n):d.type===6&&(l=new Nt(r,this,n)),this._$AV.push(l),d=t[++a]}o!==d?.index&&(r=Ue.nextNode(),o++)}return Ue.currentNode=He,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},Ye=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=je(this,n,e),ct(n)?n===_||n==null||n===""?(this._$AH!==_&&this._$AR(),this._$AH=_):n!==this._$AH&&n!==Ae&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Ps(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==_&&ct(this._$AH)?this._$AA.nextSibling.data=n:this.T(He.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=ht.createElement(Ds(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new Dt(i,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(n){let e=Ms.get(n.strings);return e===void 0&&Ms.set(n.strings,e=new ht(n)),e}k(n){fn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let r of n)i===e.length?e.push(t=new s(this.O(dt()),this.O(dt()),this,this.options)):t=e[i],t._$AI(r),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=ks(n).nextSibling;ks(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Ke=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,r){this.type=1,this._$AH=_,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=_}_$AI(n,e=this,t,i){let r=this.strings,o=!1;if(r===void 0)n=je(this,n,e,0),o=!ct(n)||n!==this._$AH&&n!==Ae,o&&(this._$AH=n);else{let a=n,d,l;for(n=r[0],d=0;d<r.length-1;d++)l=je(this,a[t+d],e,d),l===Ae&&(l=this._$AH[d]),o||=!ct(l)||l!==this._$AH[d],l===_?n=_:n!==_&&(n+=(l??"")+r[d+1]),this._$AH[d]=l}o&&!i&&this.j(n)}j(n){n===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Lt=class extends Ke{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===_?void 0:n}},Rt=class extends Ke{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==_)}},Bt=class extends Ke{constructor(n,e,t,i,r){super(n,e,t,i,r),this.type=5}_$AI(n,e=this){if((n=je(this,n,e,0)??_)===Ae)return;let t=this._$AH,i=n===_&&t!==_||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,r=n!==_&&(t===_||i);i&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Nt=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){je(this,n)}},Rs={M:pn,P:Te,A:un,C:1,L:Ls,R:Dt,D:Ps,V:je,I:Ye,H:Ke,N:Rt,U:Bt,B:Lt,F:Nt},ur=hn.litHtmlPolyfillSupport;ur?.(ht,Ye),(hn.litHtmlVersions??=[]).push("3.3.3");var Bs=(s,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let r=e?.renderBefore??null;t._$litPart$=i=new Ye(n.insertBefore(dt(),r),r,void 0,e??{})}return i._$AI(s),i};var mn=globalThis,me=class extends Ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Bs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ae}};me._$litElement$=!0,me.finalized=!0,mn.litElementHydrateSupport?.({LitElement:me});var fr=mn.litElementPolyfillSupport;fr?.({LitElement:me});(mn.litElementVersions??=[]).push("4.2.2");var Ns={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Is=s=>(...n)=>({_$litDirective$:s,values:n}),It=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:gr}=Rs,Os=s=>s;var zs=()=>document.createComment(""),Je=(s,n,e)=>{let t=s._$AA.parentNode,i=n===void 0?s._$AB:n._$AA;if(e===void 0){let r=t.insertBefore(zs(),i),o=t.insertBefore(zs(),i);e=new gr(r,o,s,s.options)}else{let r=e._$AB.nextSibling,o=e._$AM,a=o!==s;if(a){let d;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(d=s._$AU)!==o._$AU&&e._$AP(d)}if(r!==i||a){let d=e._$AA;for(;d!==r;){let l=Os(d).nextSibling;Os(t).insertBefore(d,i),d=l}}}return e},De=(s,n,e=s)=>(s._$AI(n,e),s),mr={},Us=(s,n=mr)=>s._$AH=n,Hs=s=>s._$AH,Ot=s=>{s._$AR(),s._$AA.remove()};var js=(s,n,e)=>{let t=new Map;for(let i=n;i<=e;i++)t.set(s[i],i);return t},Ee=Is(class extends It{constructor(s){if(super(s),s.type!==Ns.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let i=[],r=[],o=0;for(let a of s)i[o]=t?t(a,o):o,r[o]=e(a,o),o++;return{values:r,keys:i}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let i=Hs(s),{values:r,keys:o}=this.dt(n,e,t);if(!Array.isArray(i))return this.ut=o,r;let a=this.ut??=[],d=[],l,c,h=0,f=i.length-1,m=0,A=r.length-1;for(;h<=f&&m<=A;)if(i[h]===null)h++;else if(i[f]===null)f--;else if(a[h]===o[m])d[m]=De(i[h],r[m]),h++,m++;else if(a[f]===o[A])d[A]=De(i[f],r[A]),f--,A--;else if(a[h]===o[A])d[A]=De(i[h],r[A]),Je(s,d[A+1],i[h]),h++,A--;else if(a[f]===o[m])d[m]=De(i[f],r[m]),Je(s,i[h],i[f]),f--,m++;else if(l===void 0&&(l=js(o,m,A),c=js(a,h,f)),l.has(a[h]))if(l.has(a[f])){let u=c.get(o[m]),y=u!==void 0?i[u]:null;if(y===null){let T=Je(s,i[h]);De(T,r[m]),d[m]=T}else d[m]=De(y,r[m]),Je(s,i[h],y),i[u]=null;m++}else Ot(i[f]),f--;else Ot(i[h]),h++;for(;m<=A;){let u=Je(s,d[A+1]);De(u,r[m]),d[m++]=u}for(;h<=f;){let u=i[h++];u!==null&&Ot(u)}return this.ut=o,Us(s,d),Ae}});var zt=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function ne(s){return zt[(s%zt.length+zt.length)%zt.length]}var Ut="#23272E",bn="35,39,46";var br=3,Wt=36,xn=12,Ks=8,qs=30,$e=16,pt=100,vn=60,yn=10,jt=30,wn=10,xr=150,vr=200,qt=1.4;function kn(s,n){let e=Math.max(xr,vr/qt);return Math.ceil(vn+Math.max(0,s-1)*yn+jt+Math.max(0,n-1)*wn+e*(s+qt*n))}function Me(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function Pe(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function fe(s){return new Map(Me(s).map((n,e)=>[n,ne(e)]))}function ge(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function he(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function _n(s,n){return n==="none"?"Not needed":Pe(s).includes(n)?he(s,n):n}function Ft(s,n){return n.own?he(s,n.own):ge(s,n.kid)}var Vt={color:Ut,rgb:bn,ink:Ut};function Gs(s,n){return n.own?Vt:fe(s).get(n.kid)??ne(0)}function yr(s,n){let e=Me(s);return n.along.map(t=>e.includes(t)?ge(s,t):he(s,t))}function Cn(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function wr(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function Kt(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function Ht(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(Kt(n,t.from)),e.push(Kt(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(Kt(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function $r(s){let n=s.map(o=>({...o,col:0,cols:1})).sort((o,a)=>o.s-a.s||a.en-o.en),e=[],t=[],i=-1/0,r=()=>{for(let o of e)o.cols=t.length;e=[],t=[]};for(let o of n){o.s>=i&&(r(),i=-1/0);let a=t.findIndex(d=>d<=o.s);a<0?(a=t.length,t.push(o.en)):t[a]=o.en,o.col=a,e.push(o),i=Math.max(i,o.en)}return r(),n}function kr(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.t)return i.t===t.t?t.y:Math.round(t.y+(n-t.t)/(i.t-t.t)*(i.y-t.y))}return s[s.length-1].y}function _r(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.y)return i.y===t.y?t.t:t.t+(n-t.y)/(i.y-t.y)*(i.t-t.t)}return s[s.length-1].t}function Ys(s,n){return kr(s.anchors,n)}function Js(s,n){return _r(s.anchors,n)}function Cr(s,n){let e=Me(s),t=Pe(s),i=Math.max(n,kn(e.length,t.length)),o=(i-vn-Math.max(0,e.length-1)*yn-jt-Math.max(0,t.length-1)*wn)/(e.length+qt*t.length||1),a=Math.floor(o),d=Math.floor(o*qt),l=new Map;for(let A of s.days)for(let u of A.events)for(let y of u.own?u.along:[u.kid]){let T=l.get(y)??[];T.some(k=>k.event_id===u.event_id&&k.calendar_id===u.calendar_id)||T.push(u),l.set(y,T)}let c=fe(s),h=[],f=vn;e.forEach((A,u)=>{let y=l.get(A)??[],T=s.days.some(k=>k.events.some(q=>q.kid===A&&(q.sides.includes("drop")&&q.drop===""||q.sides.includes("pick")&&q.pick==="")));h.push({id:A,kind:"kid",x:f,w:a,name:ge(s,A),dot:c.get(A).color,rgb:c.get(A).rgb,sub:`${T?"Needs a ride · ":""}${y.length} this week`,subWarn:T}),f+=a+(u<e.length-1?yn:0)});let m=f+jt/2;return f+=jt,t.forEach((A,u)=>{let y=0,T=0;for(let k of s.days){let q=k.drivers[A];q&&(y+=q.outings.length,T+=q.drive??0)}h.push({id:A,kind:"driver",x:f,w:d,name:he(s,A),dot:Ut,rgb:bn,sub:`${y} ${y===1?"trip":"trips"} this week · ${rt(T)} driving`,subWarn:!1}),f+=d+(u<t.length-1?wn:0)}),{columns:h,sepX:m,width:i}}function Tr(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(n.length),r=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!r)return e;let o=i.slice(r[0].length);return o?o[0].toUpperCase()+o.slice(1):e}function Ws(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${N(s.start)}`:e||!n?`${s.title} until ${N(s.end)}`:`${s.title} ${N(s.start)}–${N(s.end)}`}function Tn(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length}function An(s,n){let e=we(n,s);return e===0?"Today":e===1?"Tomorrow":""}function oe(s,n=0){return s==null||!Number.isFinite(s)?n:s}function $n(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),i=1,r=0;for(let o of s.split(/\s+/).filter(Boolean)){let a=o.length;for(r===0?r=a:r+1+a<=t?r+=1+a:(i++,r=a);r>t;)i++,r-=t}return i}var Qs=25,Zs=15,En=3;function Fs(s){return Math.max(0,Math.min(En,Math.floor((s-Qs)/Zs)))}function Ar(s,n){let e=Math.min(En,$n(s,n-19,6.6));return Qs+e*Zs+2}function Vs(s,n){let e=n-23,t=`${N(s.start)}–${N(s.end)}`+(s.arrive_by!=null?` · arrive ${N(s.arrive_by)}`:""),i=33+$n(t,e,6.6)*16;for(let r of[s.lines.drop,s.lines.pick])r&&(i+=2+$n(r.text,e,7)*16);return i+4}function Xs(s,n,e,t){let i=n==="compact",{columns:r,sepX:o,width:a}=Cr(s,e),d=new Map(r.map(k=>[k.id,k])),l=Me(s),c=Pe(s),h=[...l,...c],f=fe(s),m=wr(s),A=k=>ge(s,k),u=k=>he(s,k),y={mode:n,width:a,height:0,columns:r,sepX:o,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],windows:[],links:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},T=0;return s.days.forEach((k,q)=>{let se=q*1440,K=new Map(k.events.map(g=>[g.id,g])),be=g=>g&&K.has(g)?{day:k.date,event:g}:null,x=Tn(k),$=k.events.length,b=An(k.date,t.date);y.dayHeads.push({date:k.date,y:T,label:ye(k.date),tag:b,sub:($?`${$} ${$===1?"activity":"activities"}`:"Nothing scheduled")+(x?` · ${x} to sort out`:""),warn:x>0}),y.anchors.push({t:se,y:T});let v=T+Wt+xn,w=c.flatMap(g=>k.drivers[g]?.outings??[]);if(!$&&!w.length){y.empties.push({key:k.date,y:v,text:"Nothing planned"}),T=v+40,y.anchors.push({t:se+1439,y:T});return}let P=(g,C,I,R,V,le,E,F=g.kid)=>{let re=!!g.own&&F===g.own,Ne=!!g.own&&F!==g.own,ie=re?Vt:f.get(F)??ne(0),Se=re?u(F):A(F),pe=Ne?{drop:{text:`With ${u(g.own)}`,tone:g.attending===!1?"muted":"normal"},pick:null}:g.lines,D=re?yr(s,g):[],X=(g.takes!=null?`${g.takes} min, any time ${N(g.start)}–${N(g.end)}`:`${N(g.start)}–${N(g.end)}`+(g.arrive_by!=null?` · arrive ${N(g.arrive_by)}`:""))+(D.length?` · with ${Cn(D)}`:"");return{key:`${k.date}|card|${g.id}`+(g.own?`|${F}`:""),x:C,y:I,w:R,h:V,target:{day:k.date,event:g.id},event:g,color:ie,kidName:Se,clash:le,stayed:!g.own&&g.stay&&c.includes(g.drop),skipped:g.attending===!1,title:Tr(g.title,Se),time:X,drop:pe.drop,pick:pe.pick,showDrop:!!pe.drop&&(E||V>=56),showPick:!!pe.pick&&(E||V>=74),wrap:E,aria:`${Se}, ${g.title} ${g.takes!=null?`any time from ${N(g.start)} to ${N(g.end)}`:`${N(g.start)} to ${N(g.end)}`}. `+(g.attending===!1&&!pe.drop?"Not attending. ":"")+[pe.drop,pe.pick].filter(M=>!!M).map(M=>M.text).join(". ")}},L=g=>{let C=k.rides[g];return C?(k.drivers[C.driver]?.segments??[]).filter(R=>R.type!=="home"&&R.kids.includes(C.kid)&&oe(R.start)>=oe(C.start)&&oe(R.end)<=oe(C.end)):[]},H=g=>{let C=k.rides[g];if(!C)return null;let I=C.serves.find(R=>K.get(R)?.kid===C.kid);return be(I??C.serves[0])},W=(g,C)=>{if(C.event)return C;let I=k.events.find(R=>R.own&&R.own!==g&&R.along.includes(g)&&R.title===C.title);return I?{...C,title:`${C.title} with ${u(I.own)}`}:C},Y=g=>{if(g.takes==null)return[g.start,g.end];let C=g.planned??g.start;return[C,C+g.takes]},B=new Map;for(let g of k.issues)g.level!=="problem"||!g.event||(g.kind==="late"&&B.set(g.event,`${Math.round(oe(g.minutes))} min late`),g.kind==="waiting"&&B.set(`${g.event}|pick`,`Waits ${Math.round(oe(g.minutes))} min`));if(!i){let g=1/0,C=-1/0;for(let E of k.events)E.start<=0&&E.end>=1440||(E.start>0?g=Math.min(g,E.start-20,E.arrive_by!=null?E.arrive_by-10:1/0):g=Math.min(g,E.end-30),E.end<1440?C=Math.max(C,E.end+20):C=Math.max(C,E.start+30));for(let E of w)E.start!=null&&(g=Math.min(g,E.start)),E.end!=null&&(C=Math.max(C,E.end));k.date===t.date&&Number.isFinite(g)&&t.minutes>g-60&&t.minutes<C&&(g=Math.min(g,t.minutes-15));let I=Number.isFinite(g)?Math.floor((g-5)/30)*30:900,R=Number.isFinite(C)?Math.ceil((C+5)/30)*30:960,V=E=>Math.round(v+(Math.max(I,Math.min(R,E))-I)*br);y.anchors.push({t:se+I,y:V(I)},{t:se+R,y:V(R)});for(let E of l){let F=d.get(E),re=f.get(E),Ne=(k.kids[E]?.items??[]).filter(M=>M.start!=null&&M.end!=null).map(M=>({item:M,s:oe(M.start),en:oe(M.end)})),ie=[];for(let M of $r(Ne)){let O=F.w/M.cols,U=Math.round(F.x+M.col*O),J=Math.round(O-(M.cols>1?4:0)),Z=V(M.s),Q=M.item;if(Q.type==="act"){let ue=K.get(Q.event??"");if(!ue)continue;let wt=Math.max(30,V(M.en)-Z),$t=P(ue,U,Z,J,wt,Q.clash,!1,E);if($t.layer=pt,y.cards.push($t),ue.arrive_by!=null&&ue.start-ue.arrive_by>=5){let nn=V(ue.arrive_by),Zn={key:`${k.date}|prep|${ue.id}`,x:U,y:nn,w:J,h:Z-nn+$e,color:re,label:`Arrive by ${N(ue.arrive_by)}`,layer:pt-1};y.preps.push(Zn),ie.push({s:ue.arrive_by,en:M.en,top:nn,bottom:Z+wt,x:U,w:J,prep:Zn,card:$t})}else ie.push({s:M.s,en:M.en,top:Z,bottom:Z+wt,x:U,w:J,card:$t});let Jn=B.get(ue.id);Jn&&y.marks.push({key:`${k.date}|late|${ue.id}`,x:U+J-4,y:Z+4,text:Jn,right:!0});let Qn=B.get(`${ue.id}|pick`);Qn&&y.marks.push({key:`${k.date}|wait|${ue.id}`,x:U+4,y:Z+wt+2,text:Qn,right:!1});continue}let j=k.rides[Q.ride??-1];if(!j)continue;let ve=Math.max(22,V(M.en)-Z),tt=Ht(L(j.index),m),Vn=u(j.driver),Gn={key:`${k.date}|ride|${j.index}`,x:U,y:Z,w:J,h:ve,target:H(j.index),l1:`${j.own?"In":"Along in"} ${Vn}’s car`,l2:tt.join(" → "),show2:Fs(ve)>0,lines2:Fs(ve),dashed:!j.own,clash:Q.clash,aria:`${A(E)} ${j.own?"in":"riding along in"} ${Vn}’s car, ${N(oe(j.start))} to ${N(oe(j.end))}: ${tt.join(" to ")}`};y.rides.push(Gn);let Yn=d.get(j.driver),tn=null;Yn&&(tn={key:`${k.date}|band|${j.index}`,x:U+J,y:Z,w:Math.max(0,Yn.x+8-(U+J)),h:ve,color:re},y.bands.push(tn)),ie.push({s:M.s,en:M.en,top:Z,bottom:Z+ve,x:U,w:J,ride:Gn,band:tn})}let Se=M=>M.ride?.layer??(M.prep?pt-1:pt),pe=(M,O,U,J)=>{U>$e&&y.links.push({key:`${M.key}|link`,x:M.x,y:O,w:M.w,h:U,color:re,layer:J})},D=(M,O)=>{if(!(O.x<M.x||O.x+O.w>M.x+M.w)&&(M.x=O.x,M.w=O.w,M.ride.x=O.x,M.ride.w=O.w,M.band)){let U=M.band.x+M.band.w;M.band.x=O.x+O.w,M.band.w=Math.max(0,U-M.band.x)}},X=new Set;for(let M of[...ie].sort((O,U)=>U.s-O.s)){let O=M.ride;if(!O)continue;let U=ie.filter(Q=>Q!==M&&Q.s>=M.en&&Q.s-M.en<=qs&&Q.top>=M.bottom).sort((Q,j)=>Q.s-j.s||Q.top-j.top)[0];if(!U)continue;X.add(M),D(M,U);let J=Se(U),Z=U.top-M.bottom;pe(O,M.bottom,Z+$e,J-1),O.layer=J-(Z>0?2:1),O.h+=$e,O.tuckBottom=$e}for(let M of[...ie].sort((O,U)=>O.s-U.s)){let O=M.ride;if(!O||X.has(M))continue;let U=ie.filter(Q=>Q!==M&&Q.en<=M.s&&M.s-Q.en<=qs&&Q.bottom<=M.top&&(Q.card||Q.ride?.layer!=null)).sort((Q,j)=>j.en-Q.en||j.bottom-Q.bottom)[0];if(!U)continue;D(M,U);let J=U.ride?.layer??pt,Z=M.top-U.bottom;pe(O,U.bottom-$e,Z+$e,J-1),O.layer=J-(Z>0?2:1),O.y-=$e,O.h+=$e,O.tuckTop=$e}}for(let E of c){let F=d.get(E),re=k.drivers[E];if(!re)continue;let Ne=[],ie=null;for(let D of re.segments)if(!(D.start==null||D.end==null)){if(D.type==="home"){ie=null;continue}if(D.type==="stay"){ie=null,Ne.push({type:"stay",g:D,s:D.start,en:D.end});continue}ie&&ie.en===D.start?(ie.en=D.end,ie.legs.push(D)):(ie={type:"trip",s:D.start,en:D.end,legs:[D]},Ne.push(ie))}let Se=new Set,pe=(D,X,M,O)=>{Se.add(D.id);let U=V(X),J=P(D,F.x+8,U,F.w-16,Math.max(30,V(M)-U),!1,!1,E);O&&J.drop?.tone==="normal"&&(J.drop=null,J.showDrop=!1),y.cards.push(J)};for(let D of Ne){let X=V(D.s),M=Math.max(24,V(D.en)-X);if(D.type==="stay"){let j=K.get(D.g.event??D.g.serves??"");if(j?.own===E){pe(j,D.s,D.en,!0);continue}let ve=j?f.get(j.kid)??ne(0):ne(0),tt=D.g.kids.map(A);y.stays.push({key:`${k.date}|stay|${E}|${D.s}`,x:F.x+8,y:X,w:F.w-16,h:M,target:be(j?.id),color:ve,l1:j?`At ${j.title} with ${A(j.kid)}`:"Staying",l2:`until ${N(D.en)}`+(tt.length?` · ${tt.join(" and ")} too`:"")});continue}let O=D.legs[0],U=D.legs[D.legs.length-1],J=[];for(let j of D.legs)for(let ve of j.kids)J.includes(ve)||J.push(ve);let Z=U.type==="drive"&&U.to==="home",Q=Ht(D.legs,m);y.trips.push({key:`${k.date}|trip|${E}|${D.s}`,x:F.x+8,y:X,w:F.w-16,h:M,target:be(D.legs.find(j=>j.serves)?.serves),l1:O.type==="drive"&&O.from==="home"?`Leave ${N(D.s)}`:`From ${Kt(m,O.from??O.place)} ${N(D.s)}`,l2:Q.join(" → "),show2:M>=36,l3:Z?`Home ${N(D.en)}`:"",show3:Z&&M>=62,stops:null,kids:J.map(j=>(f.get(j)??ne(0)).color),bad:D.legs.some(j=>j.overlaps_busy),aria:`${u(E)} drives ${Q.join(" to ")}, ${N(D.s)} to ${N(D.en)}`})}for(let D of re.segments)if(!(!D.overlaps_busy||D.start==null||D.end==null))for(let X of re.busy){let M=Math.max(D.start,X.start),O=Math.min(D.end,X.end);O<=M||y.overlaps.push({key:`${k.date}|overlap|${E}|${M}`,x:F.x+6,y:V(M)-2,w:F.w-12,h:Math.max(8,V(O)-V(M)+4)})}for(let D of k.events)if(D.own===E&&(Se.has(D.id)||pe(D,...Y(D),!1),D.takes!=null&&D.attending!==!1)){let X=V(D.start);y.windows.push({key:`${k.date}|window|${D.id}`,x:F.x+4,y:X,w:F.w-8,h:Math.max(24,V(D.end)-X),label:`${D.title} · any time ${N(D.start)}–${N(D.end)}`})}for(let D of re.busy){if(D.event||D.end<=I||D.start>=R)continue;let X=W(E,D),M=V(X.start),O=V(X.end);y.busy.push({key:`${k.date}|busy|${E}|${X.start}`,x:F.x+1,y:M,w:F.w-2,h:O-M,labelY:8,label:Ws(X,!1)})}}let le=-1/0;for(let E=I;E<=R;E+=30)y.grid.push({key:`${k.date}|grid|${E}`,y:V(E),strong:E%60===0}),E%60===0&&V(E)-le>=22&&(y.hours.push({key:`${k.date}|hour|${E}`,y:V(E)-8,label:fs(E)}),le=V(E));k.date===t.date&&t.minutes>I&&t.minutes<R&&(y.now={y:V(t.minutes),label:`Now ${N(t.minutes)}`}),T=V(R)+xn;return}let S=[];for(let g of l){let C=d.get(g);for(let I of k.kids[g]?.items??[])if(I.start!=null){if(I.type==="act"){let R=K.get(I.event??"");if(!R)continue;S.push({col:g,s:I.start,h:Vs(R,C.w),kind:"act",item:I})}else if(!k.rides[I.ride??-1]?.own){let R=k.rides[I.ride??-1],V=R?Ht(L(R.index),m).join(" → "):"";S.push({col:g,s:I.start,h:Ar(V,C.w),kind:"along",item:I})}}}for(let g of c){let C=k.drivers[g];if(!C)continue;for(let R of C.busy)R.event||S.push({col:g,s:R.start,h:32,kind:"busy",busy:W(g,R)});let I=d.get(g).w;for(let R of k.events)R.own!==g||R.attending!==!1&&(R.takes==null||R.planned!=null)||S.push({col:g,s:Y(R)[0],h:Vs(R,I),kind:"own",event:R});for(let R of C.outings)R.start!=null&&S.push({col:g,s:R.start,h:30+R.lines.length*16+(R.warn?16:0),kind:"out",out:R})}S.sort((g,C)=>g.s-C.s||h.indexOf(g.col)-h.indexOf(C.col));let G=new Map,z=[],xe=v;S.forEach((g,C)=>{let I=G.get(g.col),R=Math.max(I!=null?I+Ks:v,xe);G.set(g.col,R+g.h),xe=R;let V=g.kind==="busy"?g.busy.end:g.kind==="act"?K.get(g.item.event??"")?.end??null:g.kind==="own"?Y(g.event)[1]:null;z.push({col:g.col,s:g.s,end:V,y:R,h:g.h,box:null}),y.anchors.push({t:se+g.s,y:R});let le=d.get(g.col);if(g.kind==="busy"){let E={key:`${k.date}|busy|${g.col}|${C}`,x:le.x+1,y:R,w:le.w-2,h:g.h,labelY:8,label:Ws(g.busy,!0)};y.busy.push(E),z[z.length-1].box=E}else if(g.kind==="out"){let E=g.out;y.trips.push({key:`${k.date}|trip|${g.col}|${C}`,x:le.x+8,y:R,w:le.w-16,h:g.h,target:be(E.target),l1:E.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...E.lines.map(F=>({text:F,warn:!1})),...E.warn?[{text:E.warn,warn:!0}]:[]],kids:E.kids.map(F=>(f.get(F)??ne(0)).color),bad:!!E.warn,aria:`${u(g.col)}: ${E.lead}. ${E.lines.join(". ")}${E.warn?`. ${E.warn}`:""}`})}else if(g.kind==="own"){let E=P(g.event,le.x+8,R,le.w-16,g.h,!1,!0,g.col);y.cards.push(E),z[z.length-1].box=E}else if(g.kind==="act"){let E=K.get(g.item.event??""),F=P(E,le.x,R,le.w,g.h,g.item.clash,!0,g.col);y.cards.push(F),z[z.length-1].box=F}else{let E=k.rides[g.item.ride??-1],F=Ht(L(E.index),m),re=u(E.driver);y.rides.push({key:`${k.date}|ride|${E.index}`,x:le.x,y:R,w:le.w,h:g.h,target:H(E.index),l1:`Along with ${re} ${N(oe(E.start))}`,l2:F.join(" → "),show2:!0,lines2:En,dashed:!0,clash:g.item.clash,aria:`${A(g.col)} riding along with ${re}, ${N(oe(E.start))} to ${N(oe(E.end))}: ${F.join(" to ")}`})}});let ce=v;for(let g of G.values())ce=Math.max(ce,g);for(let g of z){if(!g.box||g.end==null)continue;let C=g.y+g.h;for(let I of z)I.col!==g.col&&I.s>=g.s&&I.s<g.end&&(C=Math.max(C,I.y+I.h));g.end>=1440&&(C=ce);for(let I of z)I.col===g.col&&I.y>g.y&&(C=Math.min(C,I.y-Ks));C=Math.min(C,ce),C>g.y+g.h&&(g.box.h=C-g.y)}T=ce+xn+6,y.anchors.push({t:se+1439,y:T})}),y.height=T,y}var Er=["","¼","½","¾"];function qe(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return rt(t);let i=Math.round(t*4),r=Math.floor(i/4),o=Er[i%4];return`${r||!o?r:""}${o} min`})}function ei(s){let n=e=>e?{...e,text:qe(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,i])=>[t,{...i,outings:i.outings.map(r=>({...r,lines:r.lines.map(qe),warn:r.warn==null?r.warn:qe(r.warn)}))}])),issues:e.issues.map(t=>({...t,title:qe(t.title),body:qe(t.body),note:t.note==null?t.note:qe(t.note),...t.suggestions?{suggestions:t.suggestions.map(i=>({...i,note:qe(i.note)}))}:{}}))}))}}var Mr=2,Pr=48;function ti(s,n,e=Pr){let t=[],i=0,r=0,o=0,a=0,d=n.minutes+e*60;for(let l of s.days){let c=we(n.date,l.date),h=c===0?"":`${de(l.date)} · `,f=new Map(l.events.map(u=>[u.id,u])),m=u=>u&&f.has(u)?{day:l.date,event:u}:null,A=(u,y)=>c*1440+(u??f.get(y??"")?.start??0)<d;for(let u of l.issues)if(u.level==="problem"){if(!A(u.at,u.event)){o++,u.kind==="unassigned"&&a++;continue}i++,u.kind==="unassigned"&&r++,t.push({key:`${l.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:h+u.title,body:u.body,target:m(u.event),suggestions:(u.suggestions??[]).map(y=>({id:y.id,label:y.label,note:y.note}))})}if(l.clashes.forEach((u,y)=>{if(!A(u.a.start,u.a.event)){o++;return}i++;let T=f.get(u.a.event??""),k=ge(s,u.kid),q=(K,be)=>{let x=m(be);return x?{text:K,target:x}:K},se=[];if(u.b.type==="act"){let K=f.get(u.b.event??"");T&&K&&(se=[q(T.title,T.id),` ${N(T.start)}–${N(T.end)} and `,q(K.title,K.id),` ${N(K.start)}–${N(K.end)} overlap.`])}else{let K=l.rides[u.b.ride??-1];T&&K&&(se=[`${k} is in `,q(`${he(s,K.driver)}’s car`,K.serves[0]),` ${N(oe(u.b.start))}–${N(oe(u.b.end))}, during `,q(T.title,T.id),"."])}t.push({key:`${l.date}|clash|${y}`,tone:"problem",title:`${h}${k} is double-booked`,body:se.map(K=>typeof K=="string"?K:K.text).join(""),parts:se,target:null,suggestions:[]})}),c>=0&&c<Mr)for(let u of l.issues)u.level!=="heads_up"||!A(u.at,u.event)||t.push({key:`${l.date}|${u.key}`,tone:"heads_up",title:h+u.title,body:u.body,target:m(u.event),suggestions:[]});for(let u of l.events)!u.problems.length||!A(u.start)||t.push({key:`${l.date}|notes|${u.id}`,tone:"heads_up",title:`${h}Check the notes on ${Ft(s,u)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:m(u.id),suggestions:[]})}return{items:t,problems:i,unassigned:r,later:o,laterUnassigned:a}}function ni(s,n){let e=fe(s),t=null,i=r=>r.ahead>0?2:r.ongoing?1:0;for(let r of s.days){let o=we(n.date,r.date);if(!(o<0))for(let a of Pe(s))for(let d of r.drivers[a]?.outings??[]){if(d.start==null)continue;let l=o*1440+d.start;if(o*1440+oe(d.end,d.start)<=n.minutes)continue;let h=l-n.minutes,f={driver:a,name:he(s,a),date:r.date,ahead:o,start:d.start,inMinutes:h,ongoing:h<=0,lead:d.lead,stop:(d.lines[0]??"").replace(/\s+/g," ").trim(),kids:d.kids.map(m=>e.get(m)??ne(0)),warn:d.warn,target:d.target&&r.events.some(m=>m.id===d.target)?{day:r.date,event:d.target}:null};(!t||i(f)<i(t)||i(f)===i(t)&&f.inMinutes<t.inMinutes)&&(t=f)}}return t}function Qe(s){return s.state==="done"||s.state==="late"}var Sr=780;function Dr(s,n,e){return s.state==="open"&&!!s.for_day&&s.due===n&&e<Sr}function si(s,n){return s.chores.map(e=>Dr(e,s.today,n)?{...e,state:"upcoming",shows_from:s.today}:e)}function ii(s){return s.state==="open"||s.state==="overdue"}function Sn(s,n,e){if(Qe(s)){let t=s.done_at?Lr(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${Mn(s.due,n)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${Mn(s.for_day,n)}`;let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let i=we(n,s.due);return`By ${i===1?"tomorrow":i<7?de(s.due):Pn(s.due)}`}if(s.for_day&&s.due===n)return`Tonight · for ${Mn(s.for_day,n)}`;if(s.due&&s.due>n){let t=we(n,s.due);return t===1?"By tomorrow":`By ${t<7?de(s.due):Pn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function Mn(s,n){let e=we(n,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?de(s):Pn(s)}function Pn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Lr(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let r=t.toLocaleDateString("en-CA",{timeZone:i}),o=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return r===n?o:`${de(r)} ${o}`}function ri(s,n,e=1440){let t=si(s,e).sort((i,r)=>i.order-r.order);return s.kids.map((i,r)=>{let o=t.filter(c=>c.kid===i.id),a=new Map;for(let c of o){if(c.state!=="upcoming")continue;let h=c.shows_from??c.due??s.today;a.set(h,[...a.get(h)??[],c])}let d=o.filter(c=>c.state==="overdue"),l=o.filter(c=>c.state==="open");return{kid:i.id,name:i.name,color:n?.get(i.id)??ne(r),overdue:d,now:l,done:o.filter(Qe),later:[...a.entries()].sort(([c],[h])=>c.localeCompare(h)).map(([c,h])=>({date:c,chores:h})),left:d.length+l.length}})}function oi(s,n=1440){return si(s,n).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,t)=>e.state===t.state?e.order-t.order:e.state==="overdue"?-1:1)}function Dn(s){return!s.chores.length&&!s.templates.length}var We=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Ln(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[i,r]=t.split("-").map(o=>We.indexOf(o.trim()));if(i===void 0||i<0||r!==void 0&&r<0)return null;if(r===void 0)e.add(i);else for(let o=0;o<=(r-i+7)%7;o++)e.add((i+o)%7)}return e}function Gt(s){let n=[...new Set(s)].sort((t,i)=>t-i);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let i=e.at(-1);i&&i.at(-1)===t-1?i.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${We[t[0]]}-${We[t.at(-1)]}`]:t.map(i=>We[i])).join(", ")}var Fe="none";function Yt(s){return s==="daily"||s==="school"?"":"Any"}function ai(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function li(s){return{template:s.id,repeats:s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:s.days??Yt(s.repeats),every:s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function Rn(s){return s.title.trim()?s.who.length?s.days===Fe?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function di(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function Bn(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function Nn(s,n,e=1,t=!1,i=!1){if(s==="school"){let c=n.trim().replace(/-/g,"–"),h=i?c?`${c} Bring lunch days`:"Bring lunch days":c?`${c} school days`:"Every school day";return t?`${h}, the night before`:h}let r={daily:"day",weekly:"week",monthly:"month"}[s],o=e>1?`every ${e} ${r}s`:`each ${r}`,a=n.trim();if(s==="daily"){let c=a.replace(/-/g,"–");return e>1?c?`${c}, every ${e} days`:`Every ${e} days`:c||"Every day"}if(!a||a.toLowerCase()==="any")return`Sometime ${o}`;if(s==="weekly")return`${a.replace(/-/g,"–")} ${o}`;let l=`${a.split(",").map(c=>{let h=c.trim();return h.toLowerCase()==="last"?"the last day":/^\d+$/.test(h)?`the ${Bn(Number(h))}`:`the ${h}`}).join(" and ")} ${o}`;return l[0].toUpperCase()+l.slice(1)}function In(s,n,e=!1){let t=s.map(r=>n.find(o=>o.id===r)?.name??r);if(!t.length)return"Nobody yet";let i=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${i} take turns`:i}function On(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}function Jt(s,n){return`${s}|${n}`}function Ze(s,n){let[e,t,i]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1,i+n)).toISOString().slice(0,10)}function Qt(s){let[n,e,t]=s.split("-").map(Number);return(new Date(Date.UTC(n,e-1,t)).getUTCDay()+6)%7}function ci(s,n){return s.days_off.find(e=>e.first<=n&&n<=e.last)??null}function hi(s,n){return Qt(n)<5&&!ci(s,n)}function ut(s,n,e=new Map){if(!hi(s,n))return null;let t=Jt(s.id,n);if(e.has(t)){let r=e.get(t);return r?{lunch:r,picked:!0}:{lunch:s.default,picked:!1}}let i=s.picks[n];return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}function Xe(s,n){return hi(s,n)?s.menus?.[n]??null:null}var Rr="From the school's menu feed.";function Br(s){let n=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==Rr);return n.length?n.join(`
`):null}function ke(s){return s.slice(0,7)}function Zt(s){let[n,e]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function zn(s,n=1){let[e,t]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1+n,1)).toISOString().slice(0,7)}function pi(s){let n=[];for(let e=ke(s.first);e<=ke(s.last);e=zn(e))n.push(e);return n}function ui(s,n,e,t=new Map){let i=`${e}-01`,r=Ze(i,-Qt(i)),o=[];for(;ke(r)<=e;){let a=[];for(let d=0;d<5;d++){let l=Ze(r,d),c=ke(l)!==e,h=c?null:ci(n,l),f=c?null:ut(n,l,t);a.push({date:l,day:Number(l.slice(8)),outside:c,off:h?h.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:c?null:Xe(n,l)?.dish??null,sides:c?null:Br(Xe(n,l)?.details??""),past:l<s.today,today:l===s.today})}a.some(d=>!d.outside)&&o.push(a),r=Ze(r,7)}return o}function fi(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function gi(s){let n=0,e=0;for(let t of s.flat())t.outside||t.past||!t.lunch||(t.lunch==="bring"?n++:e++);return{bring:n,buy:e}}function mi(s,n,e,t=new Map){let i=e<780?0:1;for(let r=i;r<8;r++){let o=Ze(n,r),a=ut(s,o,t);if(!a)continue;let d=we(n,o);return{lunch:a.lunch,when:d===0?"today":d===1?"tomorrow":de(o),date:o,menu:Xe(s,o)?.dish??null}}return null}var Nr={timeline:"timeline",full:"timeline",compact:"compact"};function ft(s){let n=new URLSearchParams(s),e={},t=Nr[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(n.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores"||i==="lunch")&&(e.page=i),e}var Ir=["auth_callback","code","state"];function Un(s){let n=new URLSearchParams(s);for(let t of Ir)n.delete(t);let e=n.toString();return e?`?${e}`:""}var bi=Oe`
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
  /* The time between a car box and its activity: the arrive-by strip's look, no label. Like
     every add-on it sits behind the piece it's built onto, rounded corners showing. */
  .link {
    border: 1.5px dashed;
    border-radius: 10px;
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
  .field-sub {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
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
`;var wi="mydashlight.rides.mode",Or=1100,zr=440,Ur=700,Hr=3*6e4,jr=1200;function Kr(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var Xt=te`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,xi=te`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,qr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],vi=te`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,yi=te`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Wr=te`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Fr=te`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,gt={bring:"Bring",buy:"Buy"};function Vr(s,n){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return n<=1?`Every ${e}`:n===2?`Every other ${e}`:`Every ${n} ${e}s${s==="monthly"&&n===3?" (quarterly)":""}`}function _e(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function Hn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Gr(s,n){return An(s,n)||ye(s).split(",")[0]}function Yr(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function Jr(){try{return localStorage.getItem(wi)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Qr(s){try{localStorage.setItem(wi,s)}catch{}}function en(s){return s.days.every(n=>!n.events.length)}var mt=class extends me{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=ft(location.search).view;this.urlPage=ft(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let i=e.clientX-t.x,r=e.clientY-t.y;if(!t.moved){if(Math.abs(i)+Math.abs(r)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-r,t.el.scrollLeft=t.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Hr))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Jr(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let t=new Map(this.lunchDraft);for(let[i,r]of this.lunchDraft){let[o,a]=i.split("|"),d=e.kids.find(l=>l.id===o);(!d||(d.picks[a]??null)===r||!ut(d,a))&&t.delete(i)}this.lunchDraft=t}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let i of e.chores)t.has(i.id)&&Qe(i)===t.get(i.id)&&t.delete(i.id);for(let i of t.keys())e.chores.some(r=>r.id===i)||t.delete(i);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=ei(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<Or)return!1;let e=this.plan;return!e||this.width-zr>=kn(Me(e).length,Pe(e).length)}today(){return it(this.plan?.time_zone??Kr())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),i=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=Xs(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let i=this.scroller;if(!i||!this.board)return;let r=this.board.dayHeads.find(o=>o.date===t)?.y??0;i.scrollTop=Math.max(r,Ys(this.board,e)-Wt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let r=this.dayIndexOf(e),o=t.days[r];if(!o)return;let a=1/0;if(this.mode==="timeline"){for(let d of o.events)a=Math.min(a,d.arrive_by??d.start);for(let d of Object.values(o.drivers))for(let l of d.outings)l.start!=null&&(a=Math.min(a,l.start))}this.scrollToTime(r*1440+(Number.isFinite(a)?Math.max(0,a-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,i=this.board.dayHeads[0];for(let l of this.board.dayHeads)l.y<=t+1&&(i=l);let r=this.renderRoot,o=r.querySelector(".pinned .label"),a=r.querySelector(".pinned .tag"),d=r.querySelector(".pinned .sub");o&&o.textContent!==i.label&&(o.textContent=i.label),a&&(a.textContent!==i.tag&&(a.textContent=i.tag),a.hidden=!i.tag),d&&d.textContent!==i.sub&&(d.textContent=i.sub),d?.classList.toggle("warn",i.warn);for(let l of r.querySelectorAll(".day-tile"))l.classList.toggle("in-view",l.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),r=new Map(this.choreDraft);r.set(e.id,i),this.choreDraft=r;try{await this.backend.setChoreDone(e.id,i,t&&t!==e.kid?t:void 0)}catch(o){let a=new Map(this.choreDraft);a.delete(e.id),this.choreDraft=a;let d=o instanceof ee?o:new ee("error",String(o));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??Qe(e)}editMenu(e,t){let i=this.lunch?.kids??[],r=Xe(e,t),o=i.filter(a=>a.id===e.id||r&&Xe(a,t)?.dish===r.dish).map(a=>a.id);this.closePanel(),this.menuEdit={kid:e.id,date:t,dish:r?.dish??"",details:r?.details??"",kids:o,had:!!r,busy:!1}}async saveMenu(e=!1){let t=this.menuEdit;if(!(!t||!this.backend||!t.kids.length)){this.menuEdit={...t,busy:!0};try{await this.backend.setLunchMenu(t.kids,t.date,e?"":t.dish.trim(),e?"":t.details.trim()),this.menuEdit=null}catch(i){this.menuEdit={...t,busy:!1};let r=i instanceof ee?i:new ee("error",String(i));this.showToast(r.code==="preview"?r.message:`Couldn’t save that. ${r.message}`)}}}async saveLunch(e,t,i){if(!this.backend||!t.length)return;let r=new Map(this.lunchDraft);for(let o of t)r.set(Jt(e,o),i);this.lunchDraft=r;try{await this.backend.setLunch(e,t,i)}catch(o){let a=new Map(this.lunchDraft);for(let l of t)a.delete(Jt(e,l));this.lunchDraft=a;let d=o instanceof ee?o:new ee("error",String(o));this.showToast(d.code==="preview"?d.message:`Couldn’t save that. ${d.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?li(e):ai(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||Rn(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(di(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let i=t instanceof ee?t:new ee("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let i=t instanceof ee?t:new ee("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?Js(this.board,t.scrollTop+Wt+4):null,this.mode=e,this.urlView||Qr(e)}findEvent(e){let t=this.plan?.days.find(r=>r.date===e.day),i=t?.events.find(r=>r.id===e.event);return t&&i?{day:t,event:i}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),i=this.dayIndexOf(e.day);!t||i<0||this.scrollToTime(i*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,i){if(!this.pending){this.pending={key:e,value:t};try{await i()}catch(r){let o=r instanceof ee?r:new ee("error",String(r));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}finally{this.pending=null}}}setRide(e,t,i){if(!this.backend)return;let r=this.backend;this.save(`${t}`,i,()=>r.setRide(e.id,t,i,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let i=this.backend;this.save("attending",t,()=>i.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t,i="drop"){if(!this.backend)return;let r=this.backend,o=i==="pick"?e.pick_along??[]:e.along,a=o.includes(t)?o.filter(d=>d!==t):[...o,t];this.save(`along-${i}`,a,()=>r.setTakeAlong(e.id,a,this.scope,i))}setTakes(e,t){if(!this.backend||(e.takes??null)===t)return;let i=this.backend;this.save("takes",t,()=>i.setTakes(e.id,t,this.scope))}nudgeArrive(e,t){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,r;t<0?r=(i??e.start)-5:r=i==null||i+5>=e.start?null:i+5,this.arriveDraft=r,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),jr)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let i=this.findEvent(t);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let r=this.backend,o=i.event.id,a=this.scope;this.save("arrive",e,()=>r.setArriveBy(o,e,a)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),i=e?ti(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},r=this.wide,o=this.chores?oi(this.chores,this.today().minutes).filter(h=>!this.choreDone(h)):[],a=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,d=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",l=p`<aside class="panel" aria-label=${d}>
      ${a??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,o))}
    </aside>`,c=this.page==="rides";return p`
      <div class="app ${r?"wide":this.width<Ur?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,o.length)} ${c&&e?this.renderWeek(e):_}
          ${c?this.renderBanner(e):_}
          <main>
            ${c?p`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?en(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!r&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${l}`:_}
          </main>
        </div>
        ${r?l:_}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:_}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,i){let r=t.problems+i;this.tick;let o=this.today(),a="";if(e){let f=e.time_zone,m=new Date(e.updated);this.error?a=p`<span class="bad">Can’t reach Home Assistant · showing the plan from ${Tt(m,new Date,f)}</span>`:e.status&&!e.status.ok?a=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${Tt(m,new Date,f)}</span>`:this.backend?.live||(a=`Updated ${Tt(m,new Date,f)}`)}let d=(f,m,A,u)=>p`
      <button type="button" class="seg-btn" title=${u} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${A}<span class="seg-label">${m}</span>
      </button>
    `,l=(f,m,A)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${A}<span class="seg-label">${m}</span>
      </button>
    `,c=st(o.minutes),h=!!e&&en(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${te`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:_}
        <div class="titles">
          <h1 class="clock" aria-label=${`${ye(o.date)}, ${c}`}>
            <span class="hm">${c.slice(0,-3)}</span><span class="ampm">${c.slice(-2)}</span>
          </h1>
          <p class="today-line">${ye(o.date)}</p>
          ${a?p`<p class="status">${a}</p>`:_}
        </div>
        ${e&&!h?this.renderNext(e,ni(e,o),t):_}
        <div class="controls">
          ${this.wide||h&&!i?_:p`<button type="button" class="attn-btn ${r?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${r}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?_:p`<div role="group" aria-label="View" class="seg">
            ${d("timeline","Timeline",te`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${d("compact","Compact",te`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${l("rides","Rides",te`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${l("chores","Chores",te`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?_:l("lunch","Lunch",te`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `}renderNext(e,t,i){if(!t){let l=this.today().date,c=i.unassigned,h=i.laterUnassigned;if(c){let m=p`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${c} ${c===1?"ride needs":"rides need"} a driver</span>
          <span class="next-stop">${this.wide?"Pick who drives under Needs attention.":"Tap to pick who drives."}</span>`;return this.wide?p`<div class="next idle needs">${m}</div>`:p`<button type="button" class="next idle needs" @click=${()=>this.sheet=!0}>${m}</button>`}if(h)return p`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${h} ${h===1?"ride needs":"rides need"} a driver later this week.</span>
        </div>`;let f=e.days.some(m=>m.date>=l&&m.events.length);return p`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${f?"No more trips this week":"No trips this week"}</span>
        <span class="next-stop">${f?"Nobody else needs driving anywhere.":"Nobody needs a ride yet."}</span>
      </div>`}let r;t.ongoing?r="On the road now":t.ahead===0?r=t.inMinutes<180?`Next trip · in ${rt(t.inMinutes)}`:"Next trip · later today":t.ahead===1?r="Next trip · tomorrow":r=`Next trip · ${de(t.date)}`;let o=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,a=p`
      <span class="next-eyebrow">${r}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${_e(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(l=>p`<span class="kid-dot" style="background:${l.color}"></span>`)}</span>
      </span>
      ${t.warn?p`<span class="next-stop warn">${t.warn}</span>`:t.stop?p`<span class="next-stop">${t.stop}</span>`:_}
    `,d=`next ${t.ongoing?"ongoing":o?"soon":""}`;return t.target?p`<button type="button" class=${d} @click=${()=>this.open(t.target)}>${a}</button>`:p`<div class=${d}>${a}</div>`}renderWeek(e){let t=this.today().date,i=fe(e);return p`<nav class="week" aria-label="Days">
      ${e.days.map(r=>{let o=Tn(r),a=r.events.length,d=r.events.slice(0,6).map(c=>c.own?Vt.color:i.get(c.kid)?.color??ne(0).color),l=`${ye(r.date)}: ${a?`${a} ${a===1?"activity":"activities"}`:"nothing planned"}${o?`, ${o} to sort out`:""}`;return p`<button
          type="button"
          class="day-tile ${r.date===t?"today":""}"
          data-date=${r.date}
          aria-label=${l}
          @click=${()=>this.goToDay(r.date)}
        >
          <span class="dt-wd">${r.date===t?"Today":de(r.date)}</span>
          <span class="dt-num">${Number(r.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${d.length?d.map(c=>p`<span class="dt-dot" style="background:${c}"></span>`):p`<span class="dt-free">free</span>`}
            ${a>6?p`<span class="dt-more">+${a-6}</span>`:_}
          </span>
          ${o?p`<span class="dt-badge" aria-hidden="true">${o}</span>`:_}
        </button>`})}
    </nav>`}renderQuiet(e){let t=Me(e),i=Pe(e),r=fe(e),o=t.map(a=>ge(e,a));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((a,d)=>te`<circle cx=${50+d*30} cy="80" r="11" fill=${r.get(a).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Yr(o)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(a=>{let d=r.get(a);return p`<div class="qw-person" style="--c:${d.color};--rgb:${d.rgb}">
            <span class="avatar" aria-hidden="true">${_e(ge(e,a))}</span>
            <span class="qw-name">${ge(e,a)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(a=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${_e(he(e,a))}</span>
            <span class="qw-name">${he(e,a)}</span>
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
      </div>`:p`<div class="empty-state"><p class="big">Loading the week…</p></div>`}renderBoard(e){let t=this.sel,i=l=>!!l&&!!t&&l.day===t.day&&l.event===t.event,r=e.dayHeads[0],o=e.width,a=100,d=[...e.links.map(l=>({t:"link",x:l,z:l.layer??0})),...e.preps.map(l=>({t:"prep",x:l,z:l.layer??a-1})),...e.cards.map(l=>({t:"card",x:l,z:l.layer??a})),...e.rides.map(l=>({t:"ride",x:l,z:l.layer??a+1}))].sort((l,c)=>l.z-c.z);return p`
      <div
        class="scroller"
        @pointerdown=${this.onDown}
        @pointermove=${this.onMove}
        @pointerup=${this.onUp}
        @pointercancel=${this.onUp}
        @click=${this.onClickCapture}
        @scroll=${()=>this.syncDay()}
      >
        <div class="heads" style="width:${o}px">
          ${e.columns.map(l=>p`<div class="col-head ${l.kind}" style="left:${l.x}px;width:${l.w}px;--c:${l.dot};--rgb:${l.rgb}">
              <span class="avatar ${l.kind}" aria-hidden="true">${_e(l.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${l.name}</span>${l.kind==="kid"?this.renderLunchChip(l.id,!0):_}</span>
                <span class="sub ${l.subWarn?"warn":""}">${l.sub}</span>
              </span>
            </div>`)}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${o}px">
          <span class="label">${r?.label??""}</span><span class="tag" ?hidden=${!r?.tag}>${r?.tag??""}</span
          ><span class="sub ${r?.warn?"warn":""}">${r?.sub??""}</span>
        </div>
        <div class="canvas" style="width:${o}px;height:${Math.max(e.height+400,600)}px">
          ${e.columns.map(l=>p`<div
                class="col-bg ${l.kind}"
                style="left:${l.x}px;width:${l.w}px;height:${Math.max(e.height+392,592)}px;--rgb:${l.rgb}"
              ></div>`)}
          <span class="sep" style="left:${e.sepX}px;height:${Math.max(e.height+392,592)}px"></span>
          ${e.dayHeads.map(l=>p`<div class="day-head" style="top:${l.y}px;width:${o}px">
              <span class="label">${l.label}</span>${l.tag?p`<span class="tag">${l.tag}</span>`:_}<span
                class="sub ${l.warn?"warn":""}"
                >${l.sub}</span
              >
            </div>`)}
          ${e.empties.map(l=>p`<span class="empty" style="top:${l.y}px">${l.text}</span>`)}
          ${e.grid.map(l=>p`<div class="grid ${l.strong?"strong":""}" style="top:${l.y}px;width:${o-60}px"></div>`)}
          ${e.hours.map(l=>p`<span class="hour" style="top:${l.y}px">${l.label}</span>`)}
          ${Ee(e.bands,l=>l.key,l=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;background:rgba(${l.color.rgb},0.10);border-color:rgba(${l.color.rgb},0.45)"
              ></div>`)}
          ${Ee(e.busy,l=>l.key,l=>p`<div class="busy" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span style="top:${l.labelY}px">${l.label}</span>
              </div>`)}
          ${Ee(e.windows,l=>l.key,l=>p`<div class="window" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px">
                <span>${l.label}</span>
              </div>`)}
          ${Ee(d,l=>l.x.key,l=>{if(l.t==="link"){let m=l.x;return p`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-color:${m.color.color};background:linear-gradient(rgba(${m.color.rgb},0.11), rgba(${m.color.rgb},0.11)), var(--surface)"
                ></div>`}if(l.t==="prep"){let m=l.x;return p`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-color:${m.color.color};background:linear-gradient(rgba(${m.color.rgb},0.11), rgba(${m.color.rgb},0.11)), var(--surface);color:${m.color.ink}"
                >
                  ${m.label}
                </div>`}if(l.t==="ride"){let m=l.x;return p`<button
                  type="button"
                  class="ride ${m.dashed?"dashed":""} ${m.clash?"clash":""}"
                  aria-label=${m.aria}
                  style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;padding-top:${3+(m.tuckTop??0)}px;padding-bottom:${3+(m.tuckBottom??0)}px"
                  @click=${()=>this.open(m.target)}
                >
                  <span class="l1">${m.l1}</span>${m.show2?p`<span class="l2" style="-webkit-line-clamp:${m.lines2}">${m.l2}</span>`:_}
                </button>`}let c=l.x,h=c.color,f=c.skipped?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.10) 0px, rgba(${h.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:c.stayed?`repeating-linear-gradient(135deg, rgba(${h.rgb},0.24) 0px, rgba(${h.rgb},0.24) 6px, rgba(${h.rgb},0.08) 6px, rgba(${h.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${h.rgb},0.15), rgba(${h.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${c.wrap?"wrap":""} ${i(c.target)?"sel":""} ${c.clash?"clash":""} ${c.skipped?"skipped":""}"
                aria-label=${c.aria}
                style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px;background:${f};border-color:${c.clash?"var(--bad)":`rgba(${h.rgb},0.45)`};--c:${h.color};--rgb:${h.rgb};--ring:${h.color}"
                @click=${()=>this.open(c.target)}
              >
                <span class="top">
                  <span class="title">${c.title}</span>
                  <span class="time">${c.time}</span>
                  ${c.showDrop&&c.drop?p`<span class="line tone-${c.drop.tone}">${c.drop.text}</span>`:_}
                </span>
                ${c.showPick&&c.pick?p`<span class="line tone-${c.pick.tone}">${c.pick.text}</span>`:_}
              </button>`})}
          ${Ee(e.stays,l=>l.key,l=>p`<button
                type="button"
                class="stay"
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px;border-color:${l.color.color};background:repeating-linear-gradient(135deg, rgba(${l.color.rgb},0.28) 0px, rgba(${l.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1" style="color:${l.color.ink}">${l.l1}</span><span class="l2">${l.l2}</span>
              </button>`)}
          ${Ee(e.trips,l=>l.key,l=>p`<button
                type="button"
                class="trip ${l.bad?"bad":""} ${l.stops?"list":""}"
                aria-label=${l.aria}
                style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"
                @click=${()=>this.open(l.target)}
              >
                <span class="l1">${l.l1}${l.kids.map(c=>p`<span class="kid-dot" style="background:${c}"></span>`)}</span>
                ${l.show2?p`<span class="l2">${l.l2}</span>`:_}
                ${l.stops?l.stops.map(c=>p`<span class="stop ${c.warn?"warn":""}">${c.text}</span>`):_}
                ${l.show3?p`<span class="l3">${l.l3}</span>`:_}
              </button>`)}
          ${Ee(e.overlaps,l=>l.key,l=>p`<div class="overlap" aria-hidden="true" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;height:${l.h}px"></div>`)}
          ${Ee(e.marks,l=>l.key,l=>p`<span class="mark" style="left:${l.x}px;top:${l.y}px;${l.right?"transform:translateX(-100%)":""}">${l.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${o-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:_}
        </div>
      </div>
    `}renderAttention(e,t){let{items:i,problems:r,later:o}=e,a=this.plan,d=r+t.length,l=this.chores,c=!!l&&!Dn(l);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${d?"bad":"ok"}">${d}</span>
        ${this.wide?_:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${c?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?p`<div class="attn-chores">${t.map(h=>this.renderChoreRow(h,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${a&&!r?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${te`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${en(a)?"Nothing needs you this week.":o?`Nothing for the next two days. ${o} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:_}
      ${i.map(h=>p`<div class="issue ${h.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${h.tone==="heads_up"?"i":"!"}</span>
            <div class="issue-text">
              ${h.target?p`<button type="button" class="issue-title" @click=${()=>this.open(h.target,!0)}>${h.title}</button>`:p`<strong class="issue-title">${h.title}</strong>`}
              <span class="issue-body"
                >${h.parts?h.parts.map(f=>typeof f=="string"?f:p`<button type="button" class="issue-link" @click=${()=>this.open(f.target,!0)}>${f.text}</button>`):h.body}</span
              >
            </div>
          </div>
          ${h.suggestions.length?p`<div class="fixes">
                ${h.suggestions.map(f=>p`<button
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
      ${this.wide&&a&&!en(a)&&this.page==="rides"?this.renderLegend():_}
    `}kidColorOf(e){let t=this.plan?fe(this.plan).get(e):void 0;if(t)return t;let i=this.lunch?.kids.findIndex(r=>r.id===e)??-1;return ne(Math.max(0,i))}renderLunchChip(e,t=!1){let i=this.lunch,r=i?.kids.find(l=>l.id===e);if(!i||!r)return _;this.tick;let o=this.today(),a=mi(r,o.date,o.minutes,this.lunchDraft);if(!a)return _;let d=gt[a.lunch];return p`<span class="lunch-chip ${a.lunch} ${t?"small":""}" title=${`${d} lunch ${a.when}${a.menu?`: ${a.menu}`:""}`}
      >${a.lunch==="bring"?vi:yi}<span class="lunch-chip-text"
        >${d}${t?_:` ${a.when}`}${!t&&a.menu?p`<span class="lunch-chip-menu"> · ${a.menu}</span>`:_}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let t=pi(e),i=this.lunchMonth&&t.includes(this.lunchMonth)?this.lunchMonth:ke(e.today),r=t.indexOf(i),o=c=>{let h=t[r+c];h&&(this.lunchMonth=h)},a=e.kids.some(c=>c.id===this.lunchKid)?this.lunchKid:null,d=a?e.kids.filter(c=>c.id===a):e.kids,l=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:_;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${r<=0} @click=${()=>o(-1)}>
            ${te`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Zt(i)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${r<0||r>=t.length-1} @click=${()=>o(1)}>
            ${te`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":p`${xi} Edit menus`}
        </button>
      </div>
      ${l}
      <div class="chore-cols lunch-cols ${a?"wide":""}" style="--n:${d.length}">
        ${d.map(c=>this.renderLunchCard(e,c,i,a!==null))}
      </div>
      <p class="message-aside">
        Each day’s lunch is a <strong>Lunch: Pizza</strong> all-day event on the kid’s calendar, with the rest of the
        menu in its notes and the Bring or Buy pick at the end. Menus can
        come from the school’s menu feed (set in Home Assistant under MyDashLight’s options, Lunch), a calendar file
        imported once a month, or <strong>Edit menus</strong> here.
        Days off come from <strong>No School</strong> events there. A day nobody picked gets the kid’s default, set in
        Home Assistant under MyDashLight’s options. For a Pack lunch reminder, add a School days chore set to
        <strong>Only on Bring lunch days</strong>.
      </p>
    </div>`}renderLunchCard(e,t,i,r){let o=this.kidColorOf(t.id),a=ui(e,t,i,this.lunchDraft),d=gi(a),l=a.flat(),c=l.filter(u=>!u.outside&&!u.past&&u.lunch),h=t.days_off.filter(u=>ke(u.first)<=i&&i<=ke(u.last)),f=u=>c.filter(y=>Qt(y.date)===u),m=u=>{let y=f(u);if(!y.length)return;let T=y.every(k=>k.lunch==="bring")?"buy":"bring";this.saveLunch(t.id,y.map(k=>k.date),T)},A=c.length?`${d.bring} Bring · ${d.buy} Buy${i===ke(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${r?"wide":""}" style="--c:${o.color};--rgb:${o.rgb};--k:${o.ink}" aria-label=${`${t.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${_e(t.name)}</span>
        <span class="ch-text">
          <span class="name">${t.name}</span>
          <span class="sub">${A}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${gt[t.default]} unless picked</span>
          ${e.kids.length<2?_:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${r?"Show everyone’s lunches":`Expand ${t.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=r?null:t.id}
              >
                ${r?Fr:Wr}${r?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${t.menu_feed&&!t.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${t.menu_feed.error?`: ${t.menu_feed.error}`:""}.</p>`:_}
      <div class="lunch-grid" role="grid" aria-label=${`${t.name}, ${Zt(i)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((u,y)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f(y).length}
            aria-label=${`${f(y).every(T=>T.lunch==="bring")?"Buy":"Bring"} every ${u} left in ${Zt(i)} for ${t.name}`}
            @click=${()=>m(y)}
          >
            ${u}
          </button>`)}
        ${l.map(u=>this.renderLunchCell(t,u,r))}
      </div>
      ${h.length?p`<p class="lunch-offs">
            No school:
            ${h.map(u=>{let y=u.first<`${i}-01`?`${i}-01`:u.first,T=ke(u.last)>i?Ze(`${zn(i)}-01`,-1):u.last;return`${y===T?Hn(y):`${Hn(y)}–${Hn(T)}`} ${fi(u.title)}`}).join(" · ")}
          </p>`:_}
    </section>`}renderLunchCell(e,t,i=!1){if(t.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(t.off!==null||!t.lunch)return p`<span class="lunch-day off ${t.today?"today":""}" title=${t.off??""}>
        <span class="lunch-num">${t.day}</span><span class="lunch-word">No school</span>
      </span>`;let r=t.lunch,o=r==="buy"?"bring":"buy",a=t.menu?`, ${t.menu}`:"",d=this.menuMode,l=this.menuEdit?.date===t.date&&this.menuEdit.kids.includes(e.id),c=d?`${e.name}, ${ye(t.date)}${a||", no menu yet"}. Tap to ${t.menu?"change":"add"} the menu.`:`${e.name}, ${ye(t.date)}: ${gt[r]}${t.picked?"":" (not picked yet)"}${a}. Tap to ${gt[o]}.`;return p`<button
      type="button"
      class="lunch-day ${r} ${t.picked?"picked":"unpicked"} ${t.past?"past":""} ${t.today?"today":""} ${d?"editing":""} ${l?"sel":""}"
      ?disabled=${t.past&&!d}
      aria-label=${c}
      @click=${()=>d?this.editMenu(e,t.date):void this.saveLunch(e.id,[t.date],o)}
    >
      <span class="lunch-num">${t.day}</span>
      <span class="lunch-word">${r==="bring"?vi:yi}${gt[r]}</span>
      ${t.menu?p`<span class="lunch-menu">${t.menu}</span>${i&&t.sides?p`<span class="lunch-sides">${t.sides}</span>`:_}`:d?p`<span class="lunch-menu add">${Xt} Menu</span>`:_}
    </button>`}renderChoreRow(e,t=!1){let i=this.chores,r=this.choreDone(e),o=i.kids.findIndex(T=>T.id===e.kid),a=(this.plan?fe(this.plan).get(e.kid):void 0)??ne(Math.max(0,o)),d=i.kids[o]?.name??"",l=r===Qe(e)?e:{...e,state:r?"done":"open",done_at:r?new Date().toISOString():null},c=r&&l.done_by&&l.done_by!==e.kid?i.people?.find(T=>T.id===l.done_by)?.name??l.done_by_name??null:null,h=`${Sn(l,i.today,i.time_zone)}${c?` · by ${c}`:""}`,f=r||ii(e),m=`${t?`${d}: `:""}${e.title}. ${h?`${h}. `:""}${r?"Done. Tap to undo.":"Tap when it’s done."}`,A=p`<span class="box" aria-hidden="true"
        >${r?te`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:_}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:_}
      <span class="chore-text">
        <span class="chore-title">${t?p`<span class="chore-kid">${d}</span> · `:_}${e.title}</span>
        ${h?p`<span class="chore-note">${h}</span>`:_}
      </span>`,u=`chore ${r?"done":""} ${e.state==="overdue"&&!r?"overdue":""} ${f?"":"later"}`,y=`--c:${a.color};--rgb:${a.rgb};--k:${a.ink}`;return f?p`<button type="button" class=${u} style=${y} aria-pressed=${r?"true":"false"} aria-label=${m} @click=${()=>this.tapChore(e)}>
          ${A}
        </button>`:p`<div class=${u} style=${y}>${A}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(Dn(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${Xt} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore templates: Daily</strong> (or Weekly or Monthly). It
          shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(o=>o.problems.length),i=t.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(o=>this.renderTemplateRow(o))}</div>
        </section>`:_;this.tick;let r=ri(e,this.plan?fe(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Xt} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${xi} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${r.length}">
        ${r.map(o=>{let a=o.overdue.filter(d=>!this.choreDone(d)).length+o.now.filter(d=>!this.choreDone(d)).length;return p`<section class="chore-col" style="--c:${o.color.color};--rgb:${o.color.rgb}" aria-label=${`${o.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${_e(o.name)}</span>
              <span class="ch-text">
                <span class="name">${o.name}</span>
                <span class="sub">${a?`${a} to do`:o.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(o.kid)}
            </div>
            ${o.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${o.overdue.map(d=>this.renderChoreRow(d))}`:_}
            ${o.now.length?p`<h3 class="chore-group">To do</h3>
                  ${o.now.map(d=>this.renderChoreRow(d))}`:_}
            ${o.done.length?p`<h3 class="chore-group">Done</h3>
                  ${o.done.map(d=>this.renderChoreRow(d))}`:_}
            ${o.later.map(d=>p`<h3 class="chore-group">${d.date===e.today?"Later today":Gr(d.date,e.today)}</h3>
                ${d.chores.map(l=>this.renderChoreRow(l))}`)}
            ${!o.overdue.length&&!o.now.length&&!o.done.length&&!o.later.length?p`<p class="chore-none">No chores this week.</p>`:_}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,r=this.plan?fe(this.plan):void 0,o=this.choreEdit?.template===e.id,a=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(On).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${In(e.who,i,e.take_turns)} · ${Nn(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${o?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:_}</span>
        ${a}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(d=>{let l=i.findIndex(h=>h.id===d),c=r?.get(d)??ne(Math.max(0,l));return p`<span class="kid-dot" style="background:${c.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day or some days"],["school","School days"],["weekly","Weekly"],["monthly","Monthly"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${Xt} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([i,r])=>{let o=e.templates.filter(a=>a.repeats===i);return o.length?p`<section class="manage-group" aria-label=${r}>
                  <h3 class="chore-group">${r}</h3>
                  <div class="tmpl-list">${o.map(a=>this.renderTemplateRow(a))}</div>
                </section>`:_}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the lists <strong>Chore templates: Daily</strong>, <strong>Weekly</strong>,
        <strong>Monthly</strong> and <strong>School days</strong>. A task added there by hand shows up here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return p``;let i=t.kids,r=this.plan?fe(this.plan):void 0,o=this.choreBusy,a=e.template?t.templates.find(u=>u.id===e.template):void 0,d=Rn(e),l=(a?.problems??[]).filter(u=>u!=="who:"),c=(u,y,T,k=!1)=>p`<button type="button" class="choice ${k?"wide":""}" aria-pressed=${u?"true":"false"} ?disabled=${o} @click=${T}>${y}</button>`,h=(u,y,T,k)=>p`<button type="button" class="chip" aria-pressed=${u?"true":"false"} aria-label=${k??_} ?disabled=${o} @click=${T}>${y}</button>`,f=u=>{u!==e.repeats&&this.changeDraft({repeats:u,days:a&&a.repeats===u?a.days??Yt(u):Yt(u)})},m=u=>{let y=e.who.includes(u)?e.who.filter(T=>T!==u):i.filter(T=>T.id===u||e.who.includes(T.id)).map(T=>T.id);this.changeDraft({who:y})},A;if(e.repeats==="school"){let u=e.days===Fe?new Set:e.days===""?new Set([0,1,2,3,4]):Ln(e.days)??new Set,y=T=>{let k=new Set(u);k.has(T)?k.delete(T):k.add(T),this.changeDraft({days:k.size===5?"":k.size?Gt(k):Fe})};A=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${We.slice(0,5).map((T,k)=>h(u.has(k),T.slice(0,2),()=>y(k),T))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${c(!e.night_before,"That morning",()=>this.changeDraft({night_before:!1}))}
            ${c(e.night_before,"The night before",()=>this.changeDraft({night_before:!0}))}
          </div>
          <p class="field-hint">${e.night_before?"Due the evening before each school day: Sunday for Monday.":"Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${c(e.bring_only,e.bring_only?"Only on Bring lunch days":"Every school day, Bring or Buy",()=>this.changeDraft({bring_only:!e.bring_only}),!0)}
          <p class="field-hint">${e.bring_only?"Made only when the kid brings lunch, like Pack lunch.":"Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`}else if(e.repeats==="monthly"){let u=e.days.trim(),y=/^\d+$/.test(u)?Number(u):null,T=u&&u.toLowerCase()!=="any"&&u.toLowerCase()!=="last"&&y===null;A=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${T?4:3}, minmax(0, 1fr))">
          ${c(u===""||u.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${c(y!==null,"On a date",()=>this.changeDraft({days:String(y??1)}))}
          ${c(u.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${T?c(!0,u,()=>{}):_}
        </div>
        ${y!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${o||y<=1} @click=${()=>this.changeDraft({days:String(y-1)})}>−</button>
                <span class="arrive-value">${Bn(y)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${o||y>=31} @click=${()=>this.changeDraft({days:String(y+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${u.toLowerCase()==="last"?"Due on the month’s last day.":T?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else{let u=e.repeats==="weekly"&&(e.days===""||e.days.toLowerCase()==="any"),y=e.days===Fe?new Set:u?new Set:Ln(e.days)??new Set,T=k=>{let q=new Set(y);q.has(k)?q.delete(k):q.add(k),e.repeats==="weekly"?this.changeDraft({days:q.size?Gt(q)||"Mon-Sun":"Any"}):this.changeDraft({days:q.size?Gt(q):Fe})};A=p`<div class="field">
        <span class="field-label">${e.repeats==="weekly"?"Which day":"Which days"}</span>
        ${e.repeats==="weekly"?p`<div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
              ${c(u,"Any day that week",()=>this.changeDraft({days:"Any"}))}
              ${c(!u,"On a set day",()=>this.changeDraft({days:u?"Sat":e.days}))}
            </div>`:_}
        ${e.repeats==="daily"||!u?p`<div role="group" aria-label="Days of the week" class="day-chips">
              ${We.map((k,q)=>h(y.has(q),k.slice(0,2),()=>T(q),k))}
            </div>`:_}
        ${e.repeats==="daily"?p`<div class="chips">
              ${h(e.days==="","Every day",()=>this.changeDraft({days:""}))}
              ${h(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
              ${h(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
            </div>`:p`<p class="field-hint">${u?"Shows all week, due on Sunday.":"Due that day."}</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:_}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?In(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===Fe?"No days picked":Nn(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${o} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${l.length?p`<p class="field-hint bad">${l.map(On).join(". ")}. Saving fixes it.</p>`:_}
      <div class="field">
        <label class="field-label" for="chore-name">Chore</label>
        <input
          id="chore-name"
          class="text-input"
          type="text"
          autocomplete="off"
          placeholder="Make bed"
          .value=${e.title}
          ?disabled=${o}
          @input=${u=>this.changeDraft({title:u.target.value})}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${qr.map(u=>h(e.icon===u,u,()=>this.changeDraft({icon:e.icon===u?null:u}),`Picture ${u}`))}
        </div>
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((u,y)=>{let T=r?.get(u.id)??ne(y),k=e.who.includes(u.id);return p`<button type="button" class="who-chip" style="--c:${T.color};--rgb:${T.rgb}" aria-pressed=${k?"true":"false"} ?disabled=${o} @click=${()=>m(u.id)}>
              <span class="avatar" aria-hidden="true">${_e(u.name)}</span>${u.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${c(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${c(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:_}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${c(e.repeats==="daily","Days",()=>f("daily"))}
          ${c(e.repeats==="school","School days",()=>f("school"))}
          ${c(e.repeats==="weekly","Weekly",()=>f("weekly"))}
          ${c(e.repeats==="monthly","Monthly",()=>f("monthly"))}
        </div>
      </div>
      ${A}
      ${e.repeats==="school"?_:p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Repeats</span>
          <span class="field-hint">${Vr(e.repeats,e.every)}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${o||e.every<=1} @click=${()=>this.changeDraft({every:e.every-1})}>−</button>
          <span class="arrive-value">${e.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${o||e.every>=52} @click=${()=>this.changeDraft({every:e.every+1})}>+</button>
        </span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${e.details}
          ?disabled=${o}
          @input=${u=>this.changeDraft({details:u.target.value})}
        ></textarea>
      </div>
      ${e.template?p`<div class="field">
              ${c(e.paused,e.paused?"Paused: no new chores until it’s turned back on":"On: makes chores as set above",()=>this.changeDraft({paused:!e.paused}),!0)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${o} @click=${()=>void this.removeChoreEdit()}>
              ${this.removeArmed?"Tap again to remove it for good":"Remove this chore"}
            </button>`:_}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${o||!!d} @click=${()=>void this.saveChoreEdit()}>
          ${o?"Saving to Google Tasks…":d?d.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let t=this.lunch;if(!t)return p``;let i=e.busy,r=c=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...c})},o=c=>r({kids:e.kids.includes(c)?e.kids.filter(h=>h!==c):[...e.kids,c]}),a=t.kids.filter(c=>ut(c,e.date)),d=e.dish.trim(),l=e.kids.length?d?null:"Type what’s served":"Pick who gets this menu";return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${ye(e.date)}</span>
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
          @input=${c=>r({dish:c.target.value})}
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
          @input=${c=>r({details:c.target.value})}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${a.map(c=>{let h=this.kidColorOf(c.id),f=e.kids.includes(c.id);return p`<button type="button" class="who-chip" style="--c:${h.color};--rgb:${h.rgb}" aria-pressed=${f?"true":"false"} ?disabled=${i} @click=${()=>o(c.id)}>
              <span class="avatar" aria-hidden="true">${_e(c.name)}</span>${c.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${d||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${i||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:_}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${i||!!l} @click=${()=>void this.saveMenu()}>
          ${i?"Saving to Google Calendar…":l??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return p``;let i=t.people?.length?t.people:t.kids.map(h=>({...h,role:"kid"})),r=t.kids.findIndex(h=>h.id===e.kid),o=t.kids[r],a=this.plan?fe(this.plan):void 0,d=a?.get(e.kid)??ne(Math.max(0,r)),l=i.filter(h=>h.id!==e.kid),c=h=>{let f=t.kids.findIndex(m=>m.id===h.id);return f>=0?(a?.get(h.id)??ne(f)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:_}${e.title}</span>
          <span class="ed-meta">${o?.name??""} · ${Sn(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${d.color};--rgb:${d.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${_e(o?.name??"?")}</span>
          <span>${o?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${l.map(h=>p`<button type="button" class="done-by" style="--c:${c(h)}" @click=${()=>void this.toggleChore(e,h.id)}>
                  <span class="avatar ${h.role==="parent"?"driver":""}" aria-hidden="true">${_e(h.name)}</span>
                  <span>${h.name}</span>
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
    </div>`}ownHint(e,t){let i=Ft(e,t);if(t.takes!=null){let o=t.planned!=null?`It’s fitted in at ${N(t.planned)}`:"It doesn’t fit anywhere yet";return`An errand: about ${t.takes} min any time from ${N(t.start)} to ${N(t.end)}. ${o}, around ${i}’s other trips. Errands go alone.`}let r=t.along.map(o=>Pe(e).includes(o)?he(e,o):ge(e,o));return`${i} drives there and back${r.length?`, with ${Cn(r)}`:""}.`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return p``;let{day:i,event:r}=t,o=Pe(e),a=Gs(e,r),d=Ft(e,r),l=!!this.pending,c=S=>this.pending?.key===S?this.pending.value:void 0,h=[...e.people?.carpools??[]];for(let S of e.days)for(let G of S.events)for(let z of[G.drop,G.pick])z&&z!=="none"&&!o.includes(z)&&!h.some(xe=>xe.toLowerCase()===z.toLowerCase())&&h.push(z);let f=S=>{if(!r.sides.includes(S))return _;let G=c(S),z=G!==void 0?String(G):S==="drop"?r.drop:r.pick,xe=z&&z!=="none"&&!o.includes(z)?z:"",ce=C=>this.setRide(r,S,z===C?"":C),g=[...o.map(C=>[C,_n(e,C)]),["none","Not needed"]];return p`<div class="field">
        <span class="field-label">${S==="drop"?"Drop-off":"Pick-up"} ${z===""?p`<span class="nobody">· nobody yet</span>`:_}</span>
        <div role="group" aria-label=${S==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${g.length}, minmax(0, 1fr))">
          ${g.map(([C,I])=>p`<button type="button" class="choice" aria-pressed=${z===C?"true":"false"} ?disabled=${l} @click=${()=>ce(C)}>
                ${I}
              </button>`)}
        </div>
        ${h.length?p`<div role="group" aria-label=${S==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${h.map(C=>p`<button type="button" class="chip" aria-pressed=${z.toLowerCase()===C.toLowerCase()?"true":"false"} ?disabled=${l} @click=${()=>ce(C)}>
                    ${C}
                  </button>`)}
            </div>`:_}
        <input
          type="text"
          .value=${xe&&!h.some(C=>C.toLowerCase()===xe.toLowerCase())?xe:""}
          ?disabled=${l}
          aria-label=${S==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${C=>{let I=C.target.value.trim();I&&I!==z&&this.setRide(r,S,I)}}
          @keydown=${C=>{C.key==="Enter"&&C.target.blur()}}
        />
        ${!u&&z!==""&&z!=="none"?m(S,z):_}
      </div>`},m=(S,G)=>{let z=c(`along-${S}`),xe=z!==void 0?z:S==="pick"?r.pick_along??[]:r.along,ce=[...Me(e).filter(C=>C!==r.kid),...o.filter(C=>C!==G)];return ce.length?p`<div class="field-sub">
        <span class="field-label">${S==="both"?"Riding along, both ways":"Riding along"} <span class="field-hint">${S==="pick"?"They come for the pick-up":"They leave home in the same car"}</span></span>
        <div role="group" aria-label=${S==="drop"?"Riding along on the drop-off":S==="pick"?"Riding along on the pick-up":"Riding along both ways"} class="chips">
          ${ce.map(C=>p`<button type="button" class="chip" aria-pressed=${xe.includes(C)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(r,C,S)}>
              ${o.includes(C)?he(e,C):ge(e,C)}
            </button>`)}
        </div>
      </div>`:_},A=c("stay"),u=A!==void 0?!!A:r.stay,y=r.drop===r.pick&&o.includes(r.drop),T=c("along"),k=T!==void 0?T:r.along,q=r.own?[...Me(e),...o.filter(S=>S!==r.own)]:[],se=r.own!=null&&r.takes!=null,K=r.own!=null&&!se,be=c("takes"),x=be!==void 0?be:r.takes??null,$=c("arrive"),b=this.arriveDraft!==void 0?this.arriveDraft:$!==void 0?$:r.arrive_by,v=[],w=S=>S==="none"?"Not needed":_n(e,S),P=S=>o.includes(S)?he(e,S):ge(e,S),L=(S,G,z)=>{G===""&&!z.length||v.push(`${S}: ${[G===""?"TBD":w(G),...z.map(P)].join(", ")}`)};r.own||L("Drop-off",r.drop,r.along),r.own||L("Pick-up",r.pick,r.pick_along??[]),!r.own&&r.stay&&v.push("Stay: yes"),se&&v.push(`Takes: ${r.takes} min`),r.own&&r.along.length&&v.push(`Take along: ${r.along.map(P).join(", ")}`),r.arrive_by!=null&&v.push(`Arrive by: ${st(r.arrive_by)}`);let H=c("attending"),W=H!==void 0?!!H:r.attending!==!1;r.attending===!1&&v.splice(0,v.length,"Attending: no");let Y=i.date===this.today().date?"":`${de(i.date)} · `,B=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${a.color}"></span>${d} · ${r.title}</span>
          <span class="ed-meta">${Y}${se?"any time ":""}${N(r.start)}–${N(r.end)}${r.place_name&&!r.place.startsWith("?")?` · ${r.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return r.where==="home"?p`${B}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${d} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${B}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:_}
      ${r.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${de(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:_}
      <div class="field">
        <span class="field-label">${d} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${W?"true":"false"} ?disabled=${l} @click=${()=>this.setAttending(r,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${W?"false":"true"} ?disabled=${l} @click=${()=>this.setAttending(r,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${W?p`${r.where==="anywhere"?p`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:_}
            ${r.own?p`<p class="field-hint">${this.ownHint(e,r)}</p>`:p`${f("drop")} ${f("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${u?"true":"false"} ?disabled=${!y||l} @click=${()=>this.toggleStay(r)}>
                      ${y?u?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
                    </button>
                    ${u&&y?m("both",r.drop):_}
                  </div>`}
      ${r.own?p`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${x!=null?`Takes ${x} min, any time ${N(r.start)}–${N(r.end)}`:"At its set time"}</span>
            </span>
            ${x!=null?p`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${l||x<=5} @click=${()=>this.setTakes(r,Math.max(5,x-5))}>−</button>
                  <span class="arrive-value">${x} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${l||x+5>r.end-r.start} @click=${()=>this.setTakes(r,x+5)}>+</button>
                </span>`:_}
          </div>
          <button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.setTakes(r,x!=null?null:Math.min(10,Math.max(5,r.end-r.start)))}>
            ${x!=null?"Go at its set time instead":"Make it an errand: any time in this window"}
          </button>`:_}
      ${K&&q.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${q.map(S=>p`<button type="button" class="chip" aria-pressed=${k.includes(S)?"true":"false"} ?disabled=${l} @click=${()=>this.toggleAlong(r,S)}>
                  ${o.includes(S)?he(e,S):ge(e,S)}
                </button>`)}
            </div>
          </div>`:_}
      ${se?_:p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${b!=null?`${r.start-b} min before it starts`:`Aims for a few minutes before ${N(r.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${l} @click=${()=>this.nudgeArrive(r,-5)}>−</button>
          <span class="arrive-value">${b!=null?N(b):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${l||b==null} @click=${()=>this.nudgeArrive(r,5)}>+</button>
        </span>
      </div>
      ${b!=null?p`<button type="button" class="chip clear" ?disabled=${l} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:_}`}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${v.length?v.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${r.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${r.problems.join("; ")}</p>`:_}
      ${W&&!r.own?p`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:_}
    `}};mt.styles=bi,mt.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",mt);function Zr(){let s=[document];for(let n of document.querySelectorAll("*"))n.shadowRoot&&s.push(n.shadowRoot);return s}function $i(s=3e3){let n=new CSSStyleSheet;n.replaceSync("*, *::before, *::after { cursor: none !important; }"),n.disabled=!0;let e,t=r=>{if(r)for(let o of Zr())o.adoptedStyleSheets.includes(n)||(o.adoptedStyleSheets=[...o.adoptedStyleSheets,n]);n.disabled=!r},i=r=>{if(clearTimeout(e),r.pointerType==="touch"){t(!0);return}t(!1),e=setTimeout(()=>t(!0),s)};window.addEventListener("pointermove",i,{passive:!0}),window.addEventListener("pointerdown",i,{passive:!0}),e=setTimeout(()=>t(!0),s)}var ki=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],_i=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function Ci(s,n,e,t){let i=Math.max(0,Math.min(n,s.length)),r=Math.max(i,Math.min(e,s.length));return{value:s.slice(0,i)+t+s.slice(r),caret:i+t.length}}function Ti(s,n,e){let t=Math.max(0,Math.min(n,s.length)),i=Math.max(t,Math.min(e,s.length));if(t!==i)return{value:s.slice(0,t)+s.slice(i),caret:t};if(t===0)return{value:s,caret:0};let r=Array.from(s.slice(0,t));r.pop();let o=r.join("");return{value:o+s.slice(t),caret:o.length}}function Ai(s,n){return n===0||/\s$/.test(s.slice(0,n))}var Xr=new Set(["text","search","email","url","tel","number","password"]);function Ei(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Xr.has(s.type)&&!s.readOnly&&!s.disabled}var eo={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},to={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},bt=class extends me{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=t=>t.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let t=e.selectionStart,i=e.selectionEnd;if(t!==null&&i!==null)return[t,i]}catch{}return[e.value.length,e.value.length]}apply(e,t,i){e.value=t;try{e.setSelectionRange(i,i)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=Ai(this.field.value,e)}press(e){let t=this.field;if(t){switch(e){case"hide":t.blur();return;case"done":this.commit(),t.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),t.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[i,r]=this.selection(t),o=Ti(t.value,i,r);this.apply(t,o.value,o.caret);break}default:{let i=e==="space"?" ":this.shift?e.toUpperCase():e,[r,o]=this.selection(t),a=Ci(t.value,r,o,i);this.apply(t,a.value,a.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let t=e.length>1,i=e==="layout"?this.layout==="letters"?"123":"ABC":eo[e]??(this.shift?e.toUpperCase():e);return p`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":t?"wide":""}
      aria-label=${to[e]??i}
      aria-pressed=${e==="shift"?String(this.shift):_}
      @click=${()=>this.press(e)}
    >
      ${i}
    </button>`}render(){let e=this.layout==="letters"?ki:_i;return p`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(t=>p`<div class="row">${t.map(i=>this.key(i))}</div>`)}
      </div>`}};bt.styles=Oe`
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
  `,bt.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",bt);function no(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function Mi(s){let n=new WeakSet,e=o=>{let a=o.composedPath();r(a);let d=a[0];Ei(d)&&s.attach(d)},t=()=>{setTimeout(()=>{let o=no();!s.target||o===s.target||(Ei(o)?s.attach(o):s.detach())},0)},i=o=>{n.has(o)||(n.add(o),o.addEventListener("focusin",e),o.addEventListener("focusout",t))},r=o=>{for(let a of o)a instanceof ShadowRoot&&i(a)};i(document),document.addEventListener("pointerdown",o=>r(o.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var jn="mydashlight",so=`/api/${jn}/pair`,io=`/api/${jn}/pair/poll`,Kn=`/${jn}`,qn="pair";function Pi(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function Si(s,n){return`${s}${Kn}?${qn}=${encodeURIComponent(n)}`}function ro(s,n,e=Date.now()){return{hassUrl:s,clientId:n.client_id,access_token:n.access_token,refresh_token:n.refresh_token,expires_in:n.expires_in,expires:e+n.expires_in*1e3}}var Ve=class extends Error{constructor(n,e=!1){super(n),this.busy=e}};async function Di(s=fetch){let n=await s(so,{method:"POST",cache:"no-store"});if(n.status===429)throw new Ve("Too many screens are asking to pair right now.",!0);if(!n.ok)throw new Ve(`Home Assistant answered ${n.status}.`);return await n.json()}async function Li(s,n,e=fetch){let t=await e(io,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(t.status===404)return{status:"expired"};if(!t.ok)throw new Ve(`Home Assistant answered ${t.status}.`);let i=await t.json();return i.status==="paired"&&i.auth?{status:"paired",auth:ro(n,i.auth)}:{status:"pending"}}var et=function(s,n){let i=s,r=xt[n],o=null,a=0,d=null,l=[],c={},h=function(x,$){a=i*4+17,o=(function(b){let v=new Array(b);for(let w=0;w<b;w+=1){v[w]=new Array(b);for(let P=0;P<b;P+=1)v[w][P]=null}return v})(a),f(0,0),f(a-7,0),f(0,a-7),u(),A(),T(x,$),i>=7&&y(x),d==null&&(d=se(i,r,l)),k(d,$)},f=function(x,$){for(let b=-1;b<=7;b+=1)if(!(x+b<=-1||a<=x+b))for(let v=-1;v<=7;v+=1)$+v<=-1||a<=$+v||(0<=b&&b<=6&&(v==0||v==6)||0<=v&&v<=6&&(b==0||b==6)||2<=b&&b<=4&&2<=v&&v<=4?o[x+b][$+v]=!0:o[x+b][$+v]=!1)},m=function(){let x=0,$=0;for(let b=0;b<8;b+=1){h(!0,b);let v=Re.getLostPoint(c);(b==0||x>v)&&(x=v,$=b)}return $},A=function(){for(let x=8;x<a-8;x+=1)o[x][6]==null&&(o[x][6]=x%2==0);for(let x=8;x<a-8;x+=1)o[6][x]==null&&(o[6][x]=x%2==0)},u=function(){let x=Re.getPatternPosition(i);for(let $=0;$<x.length;$+=1)for(let b=0;b<x.length;b+=1){let v=x[$],w=x[b];if(o[v][w]==null)for(let P=-2;P<=2;P+=1)for(let L=-2;L<=2;L+=1)P==-2||P==2||L==-2||L==2||P==0&&L==0?o[v+P][w+L]=!0:o[v+P][w+L]=!1}},y=function(x){let $=Re.getBCHTypeNumber(i);for(let b=0;b<18;b+=1){let v=!x&&($>>b&1)==1;o[Math.floor(b/3)][b%3+a-8-3]=v}for(let b=0;b<18;b+=1){let v=!x&&($>>b&1)==1;o[b%3+a-8-3][Math.floor(b/3)]=v}},T=function(x,$){let b=r<<3|$,v=Re.getBCHTypeInfo(b);for(let w=0;w<15;w+=1){let P=!x&&(v>>w&1)==1;w<6?o[w][8]=P:w<8?o[w+1][8]=P:o[a-15+w][8]=P}for(let w=0;w<15;w+=1){let P=!x&&(v>>w&1)==1;w<8?o[8][a-w-1]=P:w<9?o[8][15-w-1+1]=P:o[8][15-w-1]=P}o[a-8][8]=!x},k=function(x,$){let b=-1,v=a-1,w=7,P=0,L=Re.getMaskFunction($);for(let H=a-1;H>0;H-=2)for(H==6&&(H-=1);;){for(let W=0;W<2;W+=1)if(o[v][H-W]==null){let Y=!1;P<x.length&&(Y=(x[P]>>>w&1)==1),L(v,H-W)&&(Y=!Y),o[v][H-W]=Y,w-=1,w==-1&&(P+=1,w=7)}if(v+=b,v<0||a<=v){v-=b,b=-b;break}}},q=function(x,$){let b=0,v=0,w=0,P=new Array($.length),L=new Array($.length);for(let B=0;B<$.length;B+=1){let S=$[B].dataCount,G=$[B].totalCount-S;v=Math.max(v,S),w=Math.max(w,G),P[B]=new Array(S);for(let g=0;g<P[B].length;g+=1)P[B][g]=255&x.getBuffer()[g+b];b+=S;let z=Re.getErrorCorrectPolynomial(G),ce=vt(P[B],z.getLength()-1).mod(z);L[B]=new Array(z.getLength()-1);for(let g=0;g<L[B].length;g+=1){let C=g+ce.getLength()-L[B].length;L[B][g]=C>=0?ce.getAt(C):0}}let H=0;for(let B=0;B<$.length;B+=1)H+=$[B].totalCount;let W=new Array(H),Y=0;for(let B=0;B<v;B+=1)for(let S=0;S<$.length;S+=1)B<P[S].length&&(W[Y]=P[S][B],Y+=1);for(let B=0;B<w;B+=1)for(let S=0;S<$.length;S+=1)B<L[S].length&&(W[Y]=L[S][B],Y+=1);return W},se=function(x,$,b){let v=Ri.getRSBlocks(x,$),w=Bi();for(let L=0;L<b.length;L+=1){let H=b[L];w.put(H.getMode(),4),w.put(H.getLength(),Re.getLengthInBits(H.getMode(),x)),H.write(w)}let P=0;for(let L=0;L<v.length;L+=1)P+=v[L].dataCount;if(w.getLengthInBits()>P*8)throw"code length overflow. ("+w.getLengthInBits()+">"+P*8+")";for(w.getLengthInBits()+4<=P*8&&w.put(0,4);w.getLengthInBits()%8!=0;)w.putBit(!1);for(;!(w.getLengthInBits()>=P*8||(w.put(236,8),w.getLengthInBits()>=P*8));)w.put(17,8);return q(w,v)};c.addData=function(x,$){$=$||"Byte";let b=null;switch($){case"Numeric":b=oo(x);break;case"Alphanumeric":b=ao(x);break;case"Byte":b=lo(x);break;case"Kanji":b=co(x);break;default:throw"mode:"+$}l.push(b),d=null},c.isDark=function(x,$){if(x<0||a<=x||$<0||a<=$)throw x+","+$;return o[x][$]},c.getModuleCount=function(){return a},c.make=function(){if(i<1){let x=1;for(;x<40;x++){let $=Ri.getRSBlocks(x,r),b=Bi();for(let w=0;w<l.length;w++){let P=l[w];b.put(P.getMode(),4),b.put(P.getLength(),Re.getLengthInBits(P.getMode(),x)),P.write(b)}let v=0;for(let w=0;w<$.length;w++)v+=$[w].dataCount;if(b.getLengthInBits()<=v*8)break}i=x}h(!1,m())},c.createTableTag=function(x,$){x=x||2,$=typeof $>"u"?x*4:$;let b="";b+='<table style="',b+=" border-width: 0px; border-style: none;",b+=" border-collapse: collapse;",b+=" padding: 0px; margin: "+$+"px;",b+='">',b+="<tbody>";for(let v=0;v<c.getModuleCount();v+=1){b+="<tr>";for(let w=0;w<c.getModuleCount();w+=1)b+='<td style="',b+=" border-width: 0px; border-style: none;",b+=" border-collapse: collapse;",b+=" padding: 0px; margin: 0px;",b+=" width: "+x+"px;",b+=" height: "+x+"px;",b+=" background-color: ",b+=c.isDark(v,w)?"#000000":"#ffffff",b+=";",b+='"/>';b+="</tr>"}return b+="</tbody>",b+="</table>",b},c.createSvgTag=function(x,$,b,v){let w={};typeof arguments[0]=="object"&&(w=arguments[0],x=w.cellSize,$=w.margin,b=w.alt,v=w.title),x=x||2,$=typeof $>"u"?x*4:$,b=typeof b=="string"?{text:b}:b||{},b.text=b.text||null,b.id=b.text?b.id||"qrcode-description":null,v=typeof v=="string"?{text:v}:v||{},v.text=v.text||null,v.id=v.text?v.id||"qrcode-title":null;let P=c.getModuleCount()*x+$*2,L,H,W,Y,B="",S;for(S="l"+x+",0 0,"+x+" -"+x+",0 0,-"+x+"z ",B+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',B+=w.scalable?"":' width="'+P+'px" height="'+P+'px"',B+=' viewBox="0 0 '+P+" "+P+'" ',B+=' preserveAspectRatio="xMinYMin meet"',B+=v.text||b.text?' role="img" aria-labelledby="'+K([v.id,b.id].join(" ").trim())+'"':"",B+=">",B+=v.text?'<title id="'+K(v.id)+'">'+K(v.text)+"</title>":"",B+=b.text?'<description id="'+K(b.id)+'">'+K(b.text)+"</description>":"",B+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',B+='<path d="',W=0;W<c.getModuleCount();W+=1)for(Y=W*x+$,L=0;L<c.getModuleCount();L+=1)c.isDark(W,L)&&(H=L*x+$,B+="M"+H+","+Y+S);return B+='" stroke="transparent" fill="black"/>',B+="</svg>",B},c.createDataURL=function(x,$){x=x||2,$=typeof $>"u"?x*4:$;let b=c.getModuleCount()*x+$*2,v=$,w=b-$;return fo(b,b,function(P,L){if(v<=P&&P<w&&v<=L&&L<w){let H=Math.floor((P-v)/x),W=Math.floor((L-v)/x);return c.isDark(W,H)?0:1}else return 1})},c.createImgTag=function(x,$,b){x=x||2,$=typeof $>"u"?x*4:$;let v=c.getModuleCount()*x+$*2,w="";return w+="<img",w+=' src="',w+=c.createDataURL(x,$),w+='"',w+=' width="',w+=v,w+='"',w+=' height="',w+=v,w+='"',b&&(w+=' alt="',w+=K(b),w+='"'),w+="/>",w};let K=function(x){let $="";for(let b=0;b<x.length;b+=1){let v=x.charAt(b);switch(v){case"<":$+="&lt;";break;case">":$+="&gt;";break;case"&":$+="&amp;";break;case'"':$+="&quot;";break;default:$+=v;break}}return $},be=function(x){x=typeof x>"u"?2:x;let b=c.getModuleCount()*1+x*2,v=x,w=b-x,P,L,H,W,Y,B={"██":"█","█ ":"▀"," █":"▄","  ":" "},S={"██":"▀","█ ":"▀"," █":" ","  ":" "},G="";for(P=0;P<b;P+=2){for(H=Math.floor((P-v)/1),W=Math.floor((P+1-v)/1),L=0;L<b;L+=1)Y="█",v<=L&&L<w&&v<=P&&P<w&&c.isDark(H,Math.floor((L-v)/1))&&(Y=" "),v<=L&&L<w&&v<=P+1&&P+1<w&&c.isDark(W,Math.floor((L-v)/1))?Y+=" ":Y+="█",G+=x<1&&P+1>=w?S[Y]:B[Y];G+=`
`}return b%2&&x>0?G.substring(0,G.length-b-1)+Array(b+1).join("▀"):G.substring(0,G.length-1)};return c.createASCII=function(x,$){if(x=x||1,x<2)return be($);x-=1,$=typeof $>"u"?x*2:$;let b=c.getModuleCount()*x+$*2,v=$,w=b-$,P,L,H,W,Y=Array(x+1).join("██"),B=Array(x+1).join("  "),S="",G="";for(P=0;P<b;P+=1){for(H=Math.floor((P-v)/x),G="",L=0;L<b;L+=1)W=1,v<=L&&L<w&&v<=P&&P<w&&c.isDark(H,Math.floor((L-v)/x))&&(W=0),G+=W?Y:B;for(H=0;H<x;H+=1)S+=G+`
`}return S.substring(0,S.length-1)},c.renderTo2dContext=function(x,$){$=$||2;let b=c.getModuleCount();for(let v=0;v<b;v++)for(let w=0;w<b;w++)x.fillStyle=c.isDark(v,w)?"black":"white",x.fillRect(w*$,v*$,$,$)},c};et.stringToBytes=function(s){let n=[];for(let e=0;e<s.length;e+=1){let t=s.charCodeAt(e);n.push(t&255)}return n};et.createStringToBytes=function(s,n){let e=(function(){let i=po(s),r=function(){let d=i.read();if(d==-1)throw"eof";return d},o=0,a={};for(;;){let d=i.read();if(d==-1)break;let l=r(),c=r(),h=r(),f=String.fromCharCode(d<<8|l),m=c<<8|h;a[f]=m,o+=1}if(o!=n)throw o+" != "+n;return a})(),t=63;return function(i){let r=[];for(let o=0;o<i.length;o+=1){let a=i.charCodeAt(o);if(a<128)r.push(a);else{let d=e[i.charAt(o)];typeof d=="number"?(d&255)==d?r.push(d):(r.push(d>>>8),r.push(d&255)):r.push(t)}}return r}};var ae={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},xt={L:1,M:0,Q:3,H:2},Le={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Re=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,e=7973,t=21522,i={},r=function(o){let a=0;for(;o!=0;)a+=1,o>>>=1;return a};return i.getBCHTypeInfo=function(o){let a=o<<10;for(;r(a)-r(n)>=0;)a^=n<<r(a)-r(n);return(o<<10|a)^t},i.getBCHTypeNumber=function(o){let a=o<<12;for(;r(a)-r(e)>=0;)a^=e<<r(a)-r(e);return o<<12|a},i.getPatternPosition=function(o){return s[o-1]},i.getMaskFunction=function(o){switch(o){case Le.PATTERN000:return function(a,d){return(a+d)%2==0};case Le.PATTERN001:return function(a,d){return a%2==0};case Le.PATTERN010:return function(a,d){return d%3==0};case Le.PATTERN011:return function(a,d){return(a+d)%3==0};case Le.PATTERN100:return function(a,d){return(Math.floor(a/2)+Math.floor(d/3))%2==0};case Le.PATTERN101:return function(a,d){return a*d%2+a*d%3==0};case Le.PATTERN110:return function(a,d){return(a*d%2+a*d%3)%2==0};case Le.PATTERN111:return function(a,d){return(a*d%3+(a+d)%2)%2==0};default:throw"bad maskPattern:"+o}},i.getErrorCorrectPolynomial=function(o){let a=vt([1],0);for(let d=0;d<o;d+=1)a=a.multiply(vt([1,Be.gexp(d)],0));return a},i.getLengthInBits=function(o,a){if(1<=a&&a<10)switch(o){case ae.MODE_NUMBER:return 10;case ae.MODE_ALPHA_NUM:return 9;case ae.MODE_8BIT_BYTE:return 8;case ae.MODE_KANJI:return 8;default:throw"mode:"+o}else if(a<27)switch(o){case ae.MODE_NUMBER:return 12;case ae.MODE_ALPHA_NUM:return 11;case ae.MODE_8BIT_BYTE:return 16;case ae.MODE_KANJI:return 10;default:throw"mode:"+o}else if(a<41)switch(o){case ae.MODE_NUMBER:return 14;case ae.MODE_ALPHA_NUM:return 13;case ae.MODE_8BIT_BYTE:return 16;case ae.MODE_KANJI:return 12;default:throw"mode:"+o}else throw"type:"+a},i.getLostPoint=function(o){let a=o.getModuleCount(),d=0;for(let h=0;h<a;h+=1)for(let f=0;f<a;f+=1){let m=0,A=o.isDark(h,f);for(let u=-1;u<=1;u+=1)if(!(h+u<0||a<=h+u))for(let y=-1;y<=1;y+=1)f+y<0||a<=f+y||u==0&&y==0||A==o.isDark(h+u,f+y)&&(m+=1);m>5&&(d+=3+m-5)}for(let h=0;h<a-1;h+=1)for(let f=0;f<a-1;f+=1){let m=0;o.isDark(h,f)&&(m+=1),o.isDark(h+1,f)&&(m+=1),o.isDark(h,f+1)&&(m+=1),o.isDark(h+1,f+1)&&(m+=1),(m==0||m==4)&&(d+=3)}for(let h=0;h<a;h+=1)for(let f=0;f<a-6;f+=1)o.isDark(h,f)&&!o.isDark(h,f+1)&&o.isDark(h,f+2)&&o.isDark(h,f+3)&&o.isDark(h,f+4)&&!o.isDark(h,f+5)&&o.isDark(h,f+6)&&(d+=40);for(let h=0;h<a;h+=1)for(let f=0;f<a-6;f+=1)o.isDark(f,h)&&!o.isDark(f+1,h)&&o.isDark(f+2,h)&&o.isDark(f+3,h)&&o.isDark(f+4,h)&&!o.isDark(f+5,h)&&o.isDark(f+6,h)&&(d+=40);let l=0;for(let h=0;h<a;h+=1)for(let f=0;f<a;f+=1)o.isDark(f,h)&&(l+=1);let c=Math.abs(100*l/a/a-50)/5;return d+=c*10,d},i})(),Be=(function(){let s=new Array(256),n=new Array(256);for(let t=0;t<8;t+=1)s[t]=1<<t;for(let t=8;t<256;t+=1)s[t]=s[t-4]^s[t-5]^s[t-6]^s[t-8];for(let t=0;t<255;t+=1)n[s[t]]=t;let e={};return e.glog=function(t){if(t<1)throw"glog("+t+")";return n[t]},e.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return s[t]},e})(),vt=function(s,n){if(typeof s.length>"u")throw s.length+"/"+n;let e=(function(){let i=0;for(;i<s.length&&s[i]==0;)i+=1;let r=new Array(s.length-i+n);for(let o=0;o<s.length-i;o+=1)r[o]=s[o+i];return r})(),t={};return t.getAt=function(i){return e[i]},t.getLength=function(){return e.length},t.multiply=function(i){let r=new Array(t.getLength()+i.getLength()-1);for(let o=0;o<t.getLength();o+=1)for(let a=0;a<i.getLength();a+=1)r[o+a]^=Be.gexp(Be.glog(t.getAt(o))+Be.glog(i.getAt(a)));return vt(r,0)},t.mod=function(i){if(t.getLength()-i.getLength()<0)return t;let r=Be.glog(t.getAt(0))-Be.glog(i.getAt(0)),o=new Array(t.getLength());for(let a=0;a<t.getLength();a+=1)o[a]=t.getAt(a);for(let a=0;a<i.getLength();a+=1)o[a]^=Be.gexp(Be.glog(i.getAt(a))+r);return vt(o,0).mod(i)},t},Ri=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],n=function(i,r){let o={};return o.totalCount=i,o.dataCount=r,o},e={},t=function(i,r){switch(r){case xt.L:return s[(i-1)*4+0];case xt.M:return s[(i-1)*4+1];case xt.Q:return s[(i-1)*4+2];case xt.H:return s[(i-1)*4+3];default:return}};return e.getRSBlocks=function(i,r){let o=t(i,r);if(typeof o>"u")throw"bad rs block @ typeNumber:"+i+"/errorCorrectionLevel:"+r;let a=o.length/3,d=[];for(let l=0;l<a;l+=1){let c=o[l*3+0],h=o[l*3+1],f=o[l*3+2];for(let m=0;m<c;m+=1)d.push(n(h,f))}return d},e})(),Bi=function(){let s=[],n=0,e={};return e.getBuffer=function(){return s},e.getAt=function(t){let i=Math.floor(t/8);return(s[i]>>>7-t%8&1)==1},e.put=function(t,i){for(let r=0;r<i;r+=1)e.putBit((t>>>i-r-1&1)==1)},e.getLengthInBits=function(){return n},e.putBit=function(t){let i=Math.floor(n/8);s.length<=i&&s.push(0),t&&(s[i]|=128>>>n%8),n+=1},e},oo=function(s){let n=ae.MODE_NUMBER,e=s,t={};t.getMode=function(){return n},t.getLength=function(o){return e.length},t.write=function(o){let a=e,d=0;for(;d+2<a.length;)o.put(i(a.substring(d,d+3)),10),d+=3;d<a.length&&(a.length-d==1?o.put(i(a.substring(d,d+1)),4):a.length-d==2&&o.put(i(a.substring(d,d+2)),7))};let i=function(o){let a=0;for(let d=0;d<o.length;d+=1)a=a*10+r(o.charAt(d));return a},r=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;throw"illegal char :"+o};return t},ao=function(s){let n=ae.MODE_ALPHA_NUM,e=s,t={};t.getMode=function(){return n},t.getLength=function(r){return e.length},t.write=function(r){let o=e,a=0;for(;a+1<o.length;)r.put(i(o.charAt(a))*45+i(o.charAt(a+1)),11),a+=2;a<o.length&&r.put(i(o.charAt(a)),6)};let i=function(r){if("0"<=r&&r<="9")return r.charCodeAt(0)-48;if("A"<=r&&r<="Z")return r.charCodeAt(0)-65+10;switch(r){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+r}};return t},lo=function(s){let n=ae.MODE_8BIT_BYTE,e=s,t=et.stringToBytes(s),i={};return i.getMode=function(){return n},i.getLength=function(r){return t.length},i.write=function(r){for(let o=0;o<t.length;o+=1)r.put(t[o],8)},i},co=function(s){let n=ae.MODE_KANJI,e=s,t=et.stringToBytes;(function(o,a){let d=t(o);if(d.length!=2||(d[0]<<8|d[1])!=a)throw"sjis not supported."})("友",38726);let i=t(s),r={};return r.getMode=function(){return n},r.getLength=function(o){return~~(i.length/2)},r.write=function(o){let a=i,d=0;for(;d+1<a.length;){let l=(255&a[d])<<8|255&a[d+1];if(33088<=l&&l<=40956)l-=33088;else if(57408<=l&&l<=60351)l-=49472;else throw"illegal char at "+(d+1)+"/"+l;l=(l>>>8&255)*192+(l&255),o.put(l,13),d+=2}if(d<a.length)throw"illegal char at "+(d+1)},r},Ni=function(){let s=[],n={};return n.writeByte=function(e){s.push(e&255)},n.writeShort=function(e){n.writeByte(e),n.writeByte(e>>>8)},n.writeBytes=function(e,t,i){t=t||0,i=i||e.length;for(let r=0;r<i;r+=1)n.writeByte(e[r+t])},n.writeString=function(e){for(let t=0;t<e.length;t+=1)n.writeByte(e.charCodeAt(t))},n.toByteArray=function(){return s},n.toString=function(){let e="";e+="[";for(let t=0;t<s.length;t+=1)t>0&&(e+=","),e+=s[t];return e+="]",e},n},ho=function(){let s=0,n=0,e=0,t="",i={},r=function(a){t+=String.fromCharCode(o(a&63))},o=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return i.writeByte=function(a){for(s=s<<8|a&255,n+=8,e+=1;n>=6;)r(s>>>n-6),n-=6},i.flush=function(){if(n>0&&(r(s<<6-n),s=0,n=0),e%3!=0){let a=3-e%3;for(let d=0;d<a;d+=1)t+="="}},i.toString=function(){return t},i},po=function(s){let n=s,e=0,t=0,i=0,r={};r.read=function(){for(;i<8;){if(e>=n.length){if(i==0)return-1;throw"unexpected end of file./"+i}let d=n.charAt(e);if(e+=1,d=="=")return i=0,-1;if(d.match(/^\s$/))continue;t=t<<6|o(d.charCodeAt(0)),i+=6}let a=t>>>i-8&255;return i-=8,a};let o=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return r},uo=function(s,n){let e=s,t=n,i=new Array(s*n),r={};r.setPixel=function(l,c,h){i[c*e+l]=h},r.write=function(l){l.writeString("GIF87a"),l.writeShort(e),l.writeShort(t),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(e),l.writeShort(t),l.writeByte(0);let c=2,h=a(c);l.writeByte(c);let f=0;for(;h.length-f>255;)l.writeByte(255),l.writeBytes(h,f,255),f+=255;l.writeByte(h.length-f),l.writeBytes(h,f,h.length-f),l.writeByte(0),l.writeString(";")};let o=function(l){let c=l,h=0,f=0,m={};return m.write=function(A,u){if(A>>>u)throw"length over";for(;h+u>=8;)c.writeByte(255&(A<<h|f)),u-=8-h,A>>>=8-h,f=0,h=0;f=A<<h|f,h=h+u},m.flush=function(){h>0&&c.writeByte(f)},m},a=function(l){let c=1<<l,h=(1<<l)+1,f=l+1,m=d();for(let k=0;k<c;k+=1)m.add(String.fromCharCode(k));m.add(String.fromCharCode(c)),m.add(String.fromCharCode(h));let A=Ni(),u=o(A);u.write(c,f);let y=0,T=String.fromCharCode(i[y]);for(y+=1;y<i.length;){let k=String.fromCharCode(i[y]);y+=1,m.contains(T+k)?T=T+k:(u.write(m.indexOf(T),f),m.size()<4095&&(m.size()==1<<f&&(f+=1),m.add(T+k)),T=k)}return u.write(m.indexOf(T),f),u.write(h,f),u.flush(),A.toByteArray()},d=function(){let l={},c=0,h={};return h.add=function(f){if(h.contains(f))throw"dup key:"+f;l[f]=c,c+=1},h.size=function(){return c},h.indexOf=function(f){return l[f]},h.contains=function(f){return typeof l[f]<"u"},h};return r},fo=function(s,n,e){let t=uo(s,n);for(let a=0;a<n;a+=1)for(let d=0;d<s;d+=1)t.setPixel(d,a,e(d,a));let i=Ni();t.write(i);let r=ho(),o=i.toByteArray();for(let a=0;a<o.length;a+=1)r.writeByte(o[a]);return r.flush(),"data:image/gif;base64,"+r},Ii=et,Fa=et.stringToBytes;function Oi(s){let n=Ii(0,"M");n.addData(s),n.make();let e=n.getModuleCount(),t="";for(let i=0;i<e;i++)for(let r=0;r<e;r++)n.isDark(i,r)&&(t+=`M${r} ${i}h1v1h-1z`);return{size:e,d:t}}var go=1e4,yt=class extends me{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,t){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,t))}async newCode(){try{let e=await Di();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof Ve&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),go)}}async poll(e){let t=this.secret;if(t)try{let i=await Li(t,location.origin);if(!this.running||t!==this.secret)return;if(this.problem=null,i.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:i.auth}));return}if(i.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return _;let{size:e,d:t}=Oi(Si(location.origin,this.code));return p`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${te`<path d=${t} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return p`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?Pi(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Kn}?${qn}</span> and type the code.
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
    </div>`}};yt.styles=Oe`
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
  `,yt.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",yt);var Wn="hassTokens";function zi(){try{let s=localStorage.getItem(Wn);return s?JSON.parse(s):null}catch{return null}}function Fn(s){try{s?localStorage.setItem(Wn,JSON.stringify(s)):localStorage.removeItem(Wn)}catch{}}function mo(s){let n=document.getElementById("problem");n&&(n.hidden=!1,n.querySelector("p").textContent=s)}function bo(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(n=>{let e=t=>{s.stop(),s.hidden=!0,n(t)};s.addEventListener("paired",t=>e(t.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function xo(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let n=location.search.includes("auth_callback");if(!n&&!zi()){let e=await bo();e&&Fn(e)}try{let e=await ps({hassUrl:location.origin,loadTokens:async()=>zi(),saveTokens:Fn});n&&history.replaceState(null,"",location.pathname+Un(location.search));let t=await us({auth:e});s.backend=new At(t),t.addEventListener("reconnect-error",(i,r)=>{r===2&&Ui()})}catch(e){if(e===2){Ui();return}mo(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function Ui(){Fn(null),location.replace(location.pathname+Un(location.search))}var ji=ft(location.search),Hi=document.querySelector("mydashlight-keyboard");Hi&&ji.keyboard!==!1&&Mi(Hi);ji.cursor!=="show"&&$i();xo();
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
