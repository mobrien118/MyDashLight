function zn(s){return{type:"auth",access_token:s}}function Un(){return{type:"supported_features",id:1,features:{coalesce_messages:1}}}function Hn(s){let n={type:"subscribe_events"};return s&&(n.event_type=s),n}function Wt(s){return{type:"unsubscribe_events",subscription:s}}function jn(){return{type:"ping"}}function qn(s,n){return{type:"result",success:!1,error:{code:s,message:n}}}function Fn(s){let n={},e=s.split("&");for(let t=0;t<e.length;t++){let i=e[t].split("="),o=decodeURIComponent(i[0]),a=i.length>1?decodeURIComponent(i[1]):void 0;n[o]=a}return n}var Wn=(s,n,e,t)=>{let[i,o,a]=s.split(".",3);return Number(i)>n||Number(i)===n&&(t===void 0?Number(o)>=e:Number(o)>e)||t!==void 0&&Number(i)===n&&Number(o)===e&&Number(a)>=t};var gt=!1,Ei="auth_required",Mi="auth_invalid",Pi="auth_ok";function Gn(s){if(!s.auth)throw 4;let n=s.auth,e=n.expired?n.refreshAccessToken().then(()=>{e=void 0},()=>{e=void 0}):void 0,t=n.wsUrl;gt&&console.log("[Auth phase] Initializing",t);function i(o,a,r){gt&&console.log("[Auth Phase] New connection",t);let l=new WebSocket(t),c=!1,h=()=>{if(l.removeEventListener("close",h),c){r(2);return}if(o===0){r(1);return}let y=o===-1?-1:o-1;setTimeout(()=>i(y,a,r),1e3)},d=async y=>{try{n.expired&&await(e||n.refreshAccessToken()),l.send(JSON.stringify(zn(n.accessToken)))}catch(T){c=T===2,l.close()}},f=async y=>{let T=JSON.parse(y.data);switch(gt&&console.log("[Auth phase] Received",T),T.type){case Mi:c=!0,l.close();break;case Pi:l.removeEventListener("open",d),l.removeEventListener("message",f),l.removeEventListener("close",h),l.removeEventListener("error",h),l.haVersion=T.ha_version,Wn(l.haVersion,2022,9)&&l.send(JSON.stringify(Un())),a(l);break;default:gt&&T.type!==Ei&&console.warn("[Auth phase] Unhandled message",T)}};l.addEventListener("open",d),l.addEventListener("message",f),l.addEventListener("close",h),l.addEventListener("error",h)}return new Promise((o,a)=>i(s.setupRetry,o,a))}var Qe=!1,mt=class{constructor(n,e){this._handleMessage=t=>{let i=JSON.parse(t.data);Array.isArray(i)||(i=[i]),i.forEach(o=>{Qe&&console.log("Received",o);let a=this.commands.get(o.id);switch(o.type){case"event":a?a.callback(o.event):(console.warn(`Received event for unknown subscription ${o.id}. Unsubscribing.`),this.sendMessagePromise(Wt(o.id)).catch(r=>{Qe&&console.warn(` Error unsubsribing from unknown subscription ${o.id}`,r)}));break;case"result":a&&(o.success?(a.resolve(o.result),"subscribe"in a||this.commands.delete(o.id)):(a.reject(o.error),this.commands.delete(o.id)));break;case"pong":a?(a.resolve(),this.commands.delete(o.id)):console.warn(`Received unknown pong response ${o.id}`);break;default:Qe&&console.warn("Unhandled message",o)}})},this._handleClose=async()=>{let t=this.commands;if(this.commandId=1,this.oldSubscriptions=this.commands,this.commands=new Map,this.socket=void 0,t.forEach(a=>{"subscribe"in a||a.reject(qn(3,"Connection lost"))}),this.closeRequested)return;this.fireEvent("disconnected");let i=Object.assign(Object.assign({},this.options),{setupRetry:0}),o=a=>{setTimeout(async()=>{if(!this.closeRequested){Qe&&console.log("Trying to reconnect");try{let r=await i.createSocket(i);this._setSocket(r)}catch(r){if(this._queuedMessages){let l=this._queuedMessages;this._queuedMessages=void 0;for(let c of l)c.reject&&c.reject(3)}r===2?this.fireEvent("reconnect-error",r):o(a+1)}}},Math.min(a,5)*1e3)};this.suspendReconnectPromise&&(await this.suspendReconnectPromise,this.suspendReconnectPromise=void 0,this._queuedMessages=[]),o(0)},this.options=e,this.commandId=2,this.commands=new Map,this.eventListeners=new Map,this.closeRequested=!1,this._setSocket(n)}get connected(){return this.socket!==void 0&&this.socket.readyState==this.socket.OPEN}_setSocket(n){this.socket=n,this.haVersion=n.haVersion,n.addEventListener("message",this._handleMessage),n.addEventListener("close",this._handleClose);let e=this.oldSubscriptions;e&&(this.oldSubscriptions=void 0,e.forEach(i=>{"subscribe"in i&&i.subscribe&&i.subscribe().then(o=>{i.unsubscribe=o,i.resolve()})}));let t=this._queuedMessages;if(t){this._queuedMessages=void 0;for(let i of t)i.resolve()}this.fireEvent("ready")}addEventListener(n,e){let t=this.eventListeners.get(n);t||(t=[],this.eventListeners.set(n,t)),t.push(e)}removeEventListener(n,e){let t=this.eventListeners.get(n);if(!t)return;let i=t.indexOf(e);i!==-1&&t.splice(i,1)}fireEvent(n,e){(this.eventListeners.get(n)||[]).forEach(t=>t(this,e))}suspendReconnectUntil(n){this.suspendReconnectPromise=n}suspend(){if(!this.suspendReconnectPromise)throw new Error("Suspend promise not set");this.socket&&this.socket.close()}reconnect(n=!1){if(this.socket){if(!n){this.socket.close();return}this.socket.removeEventListener("message",this._handleMessage),this.socket.removeEventListener("close",this._handleClose),this.socket.close(),this._handleClose()}}close(){this.closeRequested=!0,this.socket&&this.socket.close()}async subscribeEvents(n,e){return this.subscribeMessage(n,Hn(e))}ping(){return this.sendMessagePromise(jn())}sendMessage(n,e){if(!this.connected)throw 3;if(Qe&&console.log("Sending",n),this._queuedMessages){if(e)throw new Error("Cannot queue with commandId");this._queuedMessages.push({resolve:()=>this.sendMessage(n)});return}e||(e=this._genCmdId()),n.id=e,this.socket.send(JSON.stringify(n))}sendMessagePromise(n){return new Promise((e,t)=>{if(this._queuedMessages){this._queuedMessages.push({reject:t,resolve:async()=>{try{e(await this.sendMessagePromise(n))}catch(o){t(o)}}});return}let i=this._genCmdId();this.commands.set(i,{resolve:e,reject:t}),this.sendMessage(n,i)})}async subscribeMessage(n,e,t){if(this._queuedMessages&&await new Promise((o,a)=>{this._queuedMessages.push({resolve:o,reject:a})}),t?.preCheck&&!await t.preCheck())throw new Error("Pre-check failed");let i;return await new Promise((o,a)=>{let r=this._genCmdId();i={resolve:o,reject:a,callback:n,subscribe:t?.resubscribe!==!1?()=>this.subscribeMessage(n,e,t):void 0,unsubscribe:async()=>{this.connected&&await this.sendMessagePromise(Wt(r)),this.commands.delete(r)}},this.commands.set(r,i);try{this.sendMessage(e,r)}catch{}}),()=>i.unsubscribe()}_genCmdId(){return++this.commandId}};var Si=()=>`${location.protocol}//${location.host}/`,Di=s=>s*1e3+Date.now();function Li(){let{protocol:s,host:n,pathname:e,search:t}=location;return`${s}//${n}${e}${t}`}function Ri(s,n,e,t){let i=`${s}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(e)}`;return n!==null&&(i+=`&client_id=${encodeURIComponent(n)}`),t&&(i+=`&state=${encodeURIComponent(t)}`),i}function Bi(s,n,e,t){e+=(e.includes("?")?"&":"?")+"auth_callback=1",document.location.href=Ri(s,n,e,t)}async function Qn(s,n,e){let t=typeof location<"u"&&location;if(t&&t.protocol==="https:"){let r=document.createElement("a");if(r.href=s,r.protocol==="http:"&&r.hostname!=="localhost")throw 5}let i=new FormData;n!==null&&i.append("client_id",n),Object.keys(e).forEach(r=>{i.append(r,e[r])});let o=await fetch(`${s}/auth/token`,{method:"POST",credentials:"same-origin",body:i});if(!o.ok)throw o.status===400||o.status===403?2:new Error("Unable to fetch tokens");let a=await o.json();return a.hassUrl=s,a.clientId=n,a.expires=Di(a.expires_in),a}function Jn(s,n,e){return Qn(s,n,{code:e,grant_type:"authorization_code"})}function Ni(s){return btoa(JSON.stringify(s))}function Ii(s){return JSON.parse(atob(s))}var Vt=class{constructor(n,e){this.data=n,this._saveTokens=e}get wsUrl(){return`ws${this.data.hassUrl.substr(4)}/api/websocket`}get accessToken(){return this.data.access_token}get expired(){return Date.now()>this.data.expires}async refreshAccessToken(){if(!this.data.refresh_token)throw new Error("No refresh_token");let n=await Qn(this.data.hassUrl,this.data.clientId,{grant_type:"refresh_token",refresh_token:this.data.refresh_token});n.refresh_token=this.data.refresh_token,this.data=n,this._saveTokens&&this._saveTokens(n)}async revoke(){if(!this.data.refresh_token)throw new Error("No refresh_token to revoke");let n=new FormData;n.append("token",this.data.refresh_token),await fetch(`${this.data.hassUrl}/auth/revoke`,{method:"POST",credentials:"same-origin",body:n}),this._saveTokens&&this._saveTokens(null)}};async function Zn(s={}){let n,e=s.hassUrl;e&&e[e.length-1]==="/"&&(e=e.substr(0,e.length-1));let t=s.clientId!==void 0?s.clientId:Si(),i=s.limitHassInstance===!0;if(s.authCode&&e&&(n=await Jn(e,t,s.authCode),s.saveTokens&&s.saveTokens(n)),!n){let o=Fn(location.search.substr(1));if("auth_callback"in o){let a=Ii(o.state);if(i&&(a.hassUrl!==e||a.clientId!==t))throw 6;n=await Jn(a.hassUrl,a.clientId,o.code),s.saveTokens&&s.saveTokens(n)}}if(!n&&s.loadTokens&&(n=await s.loadTokens()),n&&(e===void 0||n.hassUrl===e))return new Vt(n,s.saveTokens);if(e===void 0)throw 4;return Bi(e,t,s.redirectUrl||Li(),Ni({hassUrl:e,clientId:t})),new Promise(()=>{})}async function Xn(s){let n=Object.assign({setupRetry:0,createSocket:Gn},s),e=await n.createSocket(n);return new mt(e,n)}function I(s){let n=Math.round(s),e=Math.floor(n/60),t=(n%60+60)%60;return`${((e+11)%12+12)%12+1}:${t<10?"0":""}${t}`}function Ze(s){let n=Math.floor(Math.round(s)/60)%24;return`${I(s)} ${n<12?"AM":"PM"}`}function es(s){let n=Math.floor(s/60)%24;return`${(n+11)%12+1} ${n<12?"AM":"PM"}`}function et(s){let n=Math.max(0,Math.round(s)),e=Math.floor(n/60),t=n%60;return e?t?`${e} hr ${t} min`:`${e} hr`:`${t} min`}function ts(s){let n=Math.floor(s/60)%24,e=s%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}:00`}var Oi=new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}),zi=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"UTC"}),Ui=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",timeZone:"UTC"});function bt(s){return new Date(`${s}T12:00:00Z`)}function pe(s){let n=bt(s);return`${Oi.format(n)}, ${Ui.format(n)}`}function ae(s){return zi.format(bt(s))}function ue(s,n){return Math.round((bt(n).getTime()-bt(s).getTime())/864e5)}function Xe(s,n=new Date){let e;try{e=new Intl.DateTimeFormat("en-CA",{timeZone:s,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(n)}catch{return Xe("UTC",n)}let t=i=>e.find(o=>o.type===i)?.value??"0";return{date:`${t("year")}-${t("month")}-${t("day")}`,minutes:Number(t("hour"))*60+Number(t("minute"))}}function xt(s,n,e){let t=Math.floor((n.getTime()-s.getTime())/6e4);if(t<1)return"just now";if(t<60)return`${t} min ago`;let i=Xe(e,s),o=Xe(e,n).date;return i.date===o?`at ${Ze(i.minutes)}`:`on ${ae(i.date)} at ${Ze(i.minutes)}`}var V=class extends Error{constructor(n,e){super(e),this.code=n,this.name="BackendError"}},Se="mydashlight",Hi=7,ns=3e4;function Gt(s){if(s instanceof V)return s;if(s&&typeof s=="object"){let n=s;if(typeof n.message=="string")return new V(String(n.code??"error"),n.message)}return typeof s=="number"?new V("connection_lost","Lost the connection to Home Assistant."):new V("error",String(s))}var vt=class{constructor(n){this.saves=!0;this.listeners=new Set;this.timer=null;this.unsubscribe=null;this.pushing=!1;this.reading=null;this.onVisible=()=>{(typeof document>"u"||document.visibilityState==="visible")&&this.refresh()};this.onReady=()=>void this.refresh();this.onDisconnected=()=>this.fail(new V("connection_lost","Lost the connection to Home Assistant."));this.conn=n}get live(){return this.pushing}watch(n,e){let t={onPlan:n,onError:e};return this.listeners.add(t),this.listeners.size===1?this.start():this.refresh(),()=>{this.listeners.delete(t),this.listeners.size||this.stop()}}start(){this.refresh(),this.trySubscribe(),this.timer=setInterval(()=>{this.pushing||this.refresh()},ns),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.conn.addEventListener?.("ready",this.onReady),this.conn.addEventListener?.("disconnected",this.onDisconnected)}stop(){this.timer&&clearInterval(this.timer),this.timer=null,typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.conn.removeEventListener?.("ready",this.onReady),this.conn.removeEventListener?.("disconnected",this.onDisconnected);let n=this.unsubscribe;this.unsubscribe=null,this.pushing=!1,n&&n().catch(()=>{})}async trySubscribe(){try{this.unsubscribe=await this.conn.subscribeMessage(n=>{this.pushing=!0,n.plan?this.emit(n.plan):this.fail(new V("not_running","MyDashLight isn’t running right now."))},{type:`${Se}/rides/subscribe`},{resubscribe:!0})}catch{this.pushing=!1}}fail(n){for(let e of this.listeners)e.onError(n)}emit(n){for(let e of this.listeners)e.onPlan(n)}refresh(){return this.reading?this.reading:(this.reading=this.read().finally(()=>{this.reading=null}),this.reading)}async read(){try{let n=await this.conn.sendMessagePromise({type:"call_service",domain:Se,service:"get_plan",service_data:{days:Hi},return_response:!0});this.emit(n.response)}catch(n){this.fail(Gt(n))}}async call(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Se,service:n,service_data:e})}catch(t){throw Gt(t)}this.pushing||await this.refresh()}setRide(n,e,t,i){return this.call("set_ride",{event:n,side:e,driver:t,scope:i})}setStay(n,e,t){return this.call("set_stay",{event:n,stay:e,scope:t})}setAttending(n,e,t){return this.call("set_attending",{event:n,attending:e,scope:t})}setArriveBy(n,e,t){return this.call("set_arrive_by",e==null?{event:n,scope:t}:{event:n,time:ts(e),scope:t})}setTakeAlong(n,e,t){return this.call("set_take_along",{event:n,kids:e,scope:t})}applySuggestion(n){return this.call("apply_suggestion",{suggestion:n})}watchChores(n){let e=!1,t=null,i=null,o=async()=>{try{let a=await this.conn.sendMessagePromise({type:"call_service",domain:Se,service:"get_chores",service_data:{},return_response:!0});e||n(a.response??null)}catch{e||n(null)}};return(async()=>{try{let a=await this.conn.subscribeMessage(r=>{e||n(r.chores)},{type:`${Se}/chores/subscribe`},{resubscribe:!0});e?a().catch(()=>{}):t=a}catch{if(e)return;o(),i=setInterval(()=>void o(),ns)}})(),()=>{e=!0,i&&clearInterval(i),t&&t().catch(()=>{})}}watchLunch(n){let e=!1,t=null;return(async()=>{try{let i=await this.conn.subscribeMessage(o=>{e||n(o.lunch)},{type:`${Se}/lunch/subscribe`},{resubscribe:!0});e?i().catch(()=>{}):t=i}catch{e||n(null)}})(),()=>{e=!0,t&&t().catch(()=>{})}}async setLunch(n,e,t){await this.choreCall("set_lunch",{kid:n,dates:e,lunch:t??"default"})}async setLunchMenu(n,e,t,i){await this.choreCall("set_lunch_menu",{kids:n,date:e,menu:t,details:i})}async setChoreDone(n,e,t){await this.choreCall("set_chore_done",{chore:n,done:e,...e&&t?{by:t}:{}})}async saveChoreTemplate(n){await this.choreCall("save_chore_template",{...n})}async removeChoreTemplate(n){await this.choreCall("remove_chore_template",{template:n})}async choreCall(n,e){try{await this.conn.sendMessagePromise({type:"call_service",domain:Se,service:n,service_data:e})}catch(t){throw Gt(t)}}};var yt=globalThis,wt=yt.ShadowRoot&&(yt.ShadyCSS===void 0||yt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Yt=Symbol(),ss=new WeakMap,tt=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==Yt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(wt&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=ss.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&ss.set(e,n))}return n}toString(){return this.cssText}},is=s=>new tt(typeof s=="string"?s:s+"",void 0,Yt),De=(s,...n)=>{let e=s.length===1?s[0]:n.reduce((t,i,o)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new tt(e,s,Yt)},rs=(s,n)=>{if(wt)s.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=yt.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,s.appendChild(t)}},Jt=wt?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return is(e)})(s):s;var{is:ji,defineProperty:qi,getOwnPropertyDescriptor:Ki,getOwnPropertyNames:Fi,getOwnPropertySymbols:Wi,getPrototypeOf:Vi}=Object,$t=globalThis,os=$t.trustedTypes,Gi=os?os.emptyScript:"",Yi=$t.reactiveElementPolyfillSupport,nt=(s,n)=>s,Qt={toAttribute(s,n){switch(n){case Boolean:s=s?Gi:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let e=s;switch(n){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},ls=(s,n)=>!ji(s,n),as={attribute:!0,type:String,converter:Qt,reflect:!1,useDefault:!1,hasChanged:ls};Symbol.metadata??=Symbol("metadata"),$t.litPropertyMetadata??=new WeakMap;var ye=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=as){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&qi(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:o}=Ki(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let r=i?.call(this);o?.call(this,a),this.requestUpdate(n,r,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??as}static _$Ei(){if(this.hasOwnProperty(nt("elementProperties")))return;let n=Vi(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(nt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(nt("properties"))){let e=this.properties,t=[...Fi(e),...Wi(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(Jt(i))}else n!==void 0&&e.push(Jt(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rs(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let o=(t.converter?.toAttribute!==void 0?t.converter:Qt).toAttribute(e,t.type);this._$Em=n,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let o=t.getPropertyOptions(i),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:Qt;this._$Em=i;let r=a.fromAttribute(e,o.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(n,e,t,i=!1,o){if(n!==void 0){let a=this.constructor;if(i===!1&&(o=this[n]),t??=a.getPropertyOptions(n),!((t.hasChanged??ls)(o,e)||t.useDefault&&t.reflect&&o===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:o},a){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),o!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,o]of t){let{wrapped:a}=o,r=this[i];a!==!0||this._$AL.has(i)||r===void 0||this.C(i,void 0,o,r)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};ye.elementStyles=[],ye.shadowRootOptions={mode:"open"},ye[nt("elementProperties")]=new Map,ye[nt("finalized")]=new Map,Yi?.({ReactiveElement:ye}),($t.reactiveElementVersions??=[]).push("2.1.2");var Xt=globalThis,ds=s=>s,kt=Xt.trustedTypes,cs=kt?kt.createPolicy("lit-html",{createHTML:s=>s}):void 0,en="$lit$",we=`lit$${Math.random().toFixed(9).slice(2)}$`,tn="?"+we,Ji=`<${tn}>`,Be=document,it=()=>Be.createComment(""),rt=s=>s===null||typeof s!="object"&&typeof s!="function",nn=Array.isArray,ms=s=>nn(s)||typeof s?.[Symbol.iterator]=="function",Zt=`[ 	
\f\r]`,st=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,hs=/-->/g,ps=/>/g,Le=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),us=/'/g,fs=/"/g,bs=/^(?:script|style|textarea|title)$/i,sn=s=>(n,...e)=>({_$litType$:s,strings:n,values:e}),p=sn(1),G=sn(2),Lo=sn(3),$e=Symbol.for("lit-noChange"),C=Symbol.for("lit-nothing"),gs=new WeakMap,Re=Be.createTreeWalker(Be,129);function xs(s,n){if(!nn(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return cs!==void 0?cs.createHTML(n):n}var vs=(s,n)=>{let e=s.length-1,t=[],i,o=n===2?"<svg>":n===3?"<math>":"",a=st;for(let r=0;r<e;r++){let l=s[r],c,h,d=-1,f=0;for(;f<l.length&&(a.lastIndex=f,h=a.exec(l),h!==null);)f=a.lastIndex,a===st?h[1]==="!--"?a=hs:h[1]!==void 0?a=ps:h[2]!==void 0?(bs.test(h[2])&&(i=RegExp("</"+h[2],"g")),a=Le):h[3]!==void 0&&(a=Le):a===Le?h[0]===">"?(a=i??st,d=-1):h[1]===void 0?d=-2:(d=a.lastIndex-h[2].length,c=h[1],a=h[3]===void 0?Le:h[3]==='"'?fs:us):a===fs||a===us?a=Le:a===hs||a===ps?a=st:(a=Le,i=void 0);let y=a===Le&&s[r+1].startsWith("/>")?" ":"";o+=a===st?l+Ji:d>=0?(t.push(c),l.slice(0,d)+en+l.slice(d)+we+y):l+we+(d===-2?r:y)}return[xs(s,o+(s[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},ot=class s{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let o=0,a=0,r=n.length-1,l=this.parts,[c,h]=vs(n,e);if(this.el=s.createElement(c,t),Re.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=Re.nextNode())!==null&&l.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(en)){let f=h[a++],y=i.getAttribute(d).split(we),T=/([.?@])?(.*)/.exec(f);l.push({type:1,index:o,name:T[2],strings:y,ctor:T[1]==="."?Ct:T[1]==="?"?Tt:T[1]==="@"?At:Ie}),i.removeAttribute(d)}else d.startsWith(we)&&(l.push({type:6,index:o}),i.removeAttribute(d));if(bs.test(i.tagName)){let d=i.textContent.split(we),f=d.length-1;if(f>0){i.textContent=kt?kt.emptyScript:"";for(let y=0;y<f;y++)i.append(d[y],it()),Re.nextNode(),l.push({type:2,index:++o});i.append(d[f],it())}}}else if(i.nodeType===8)if(i.data===tn)l.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(we,d+1))!==-1;)l.push({type:7,index:o}),d+=we.length-1}o++}}static createElement(n,e){let t=Be.createElement("template");return t.innerHTML=n,t}};function Ne(s,n,e=s,t){if(n===$e)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,o=rt(n)?void 0:n._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(s),i._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=Ne(s,i._$AS(s,n.values),i,t)),n}var _t=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??Be).importNode(e,!0);Re.currentNode=i;let o=Re.nextNode(),a=0,r=0,l=t[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new Ke(o,o.nextSibling,this,n):l.type===1?c=new l.ctor(o,l.name,l.strings,this,n):l.type===6&&(c=new Et(o,this,n)),this._$AV.push(c),l=t[++r]}a!==l?.index&&(o=Re.nextNode(),a++)}return Re.currentNode=Be,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},Ke=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Ne(this,n,e),rt(n)?n===C||n==null||n===""?(this._$AH!==C&&this._$AR(),this._$AH=C):n!==this._$AH&&n!==$e&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):ms(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==C&&rt(this._$AH)?this._$AA.nextSibling.data=n:this.T(Be.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=ot.createElement(xs(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new _t(i,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(n){let e=gs.get(n.strings);return e===void 0&&gs.set(n.strings,e=new ot(n)),e}k(n){nn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let o of n)i===e.length?e.push(t=new s(this.O(it()),this.O(it()),this,this.options)):t=e[i],t._$AI(o),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=ds(n).nextSibling;ds(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Ie=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,o){this.type=1,this._$AH=C,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=o,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=C}_$AI(n,e=this,t,i){let o=this.strings,a=!1;if(o===void 0)n=Ne(this,n,e,0),a=!rt(n)||n!==this._$AH&&n!==$e,a&&(this._$AH=n);else{let r=n,l,c;for(n=o[0],l=0;l<o.length-1;l++)c=Ne(this,r[t+l],e,l),c===$e&&(c=this._$AH[l]),a||=!rt(c)||c!==this._$AH[l],c===C?n=C:n!==C&&(n+=(c??"")+o[l+1]),this._$AH[l]=c}a&&!i&&this.j(n)}j(n){n===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Ct=class extends Ie{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===C?void 0:n}},Tt=class extends Ie{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==C)}},At=class extends Ie{constructor(n,e,t,i,o){super(n,e,t,i,o),this.type=5}_$AI(n,e=this){if((n=Ne(this,n,e,0)??C)===$e)return;let t=this._$AH,i=n===C&&t!==C||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,o=n!==C&&(t===C||i);i&&this.element.removeEventListener(this.name,this,t),o&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Et=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){Ne(this,n)}},ys={M:en,P:we,A:tn,C:1,L:vs,R:_t,D:ms,V:Ne,I:Ke,H:Ie,N:Tt,U:At,B:Ct,F:Et},Qi=Xt.litHtmlPolyfillSupport;Qi?.(ot,Ke),(Xt.litHtmlVersions??=[]).push("3.3.3");var ws=(s,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let o=e?.renderBefore??null;t._$litPart$=i=new Ke(n.insertBefore(it(),o),o,void 0,e??{})}return i._$AI(s),i};var rn=globalThis,he=class extends ye{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=ws(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return $e}};he._$litElement$=!0,he.finalized=!0,rn.litElementHydrateSupport?.({LitElement:he});var Zi=rn.litElementPolyfillSupport;Zi?.({LitElement:he});(rn.litElementVersions??=[]).push("4.2.2");var $s={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ks=s=>(...n)=>({_$litDirective$:s,values:n}),Mt=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:Xi}=ys,_s=s=>s;var Cs=()=>document.createComment(""),Fe=(s,n,e)=>{let t=s._$AA.parentNode,i=n===void 0?s._$AB:n._$AA;if(e===void 0){let o=t.insertBefore(Cs(),i),a=t.insertBefore(Cs(),i);e=new Xi(o,a,s,s.options)}else{let o=e._$AB.nextSibling,a=e._$AM,r=a!==s;if(r){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==a._$AU&&e._$AP(l)}if(o!==i||r){let l=e._$AA;for(;l!==o;){let c=_s(l).nextSibling;_s(t).insertBefore(l,i),l=c}}}return e},ke=(s,n,e=s)=>(s._$AI(n,e),s),er={},Ts=(s,n=er)=>s._$AH=n,As=s=>s._$AH,Pt=s=>{s._$AR(),s._$AA.remove()};var Es=(s,n,e)=>{let t=new Map;for(let i=n;i<=e;i++)t.set(s[i],i);return t},fe=ks(class extends Mt{constructor(s){if(super(s),s.type!==$s.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,n,e){let t;e===void 0?e=n:n!==void 0&&(t=n);let i=[],o=[],a=0;for(let r of s)i[a]=t?t(r,a):a,o[a]=e(r,a),a++;return{values:o,keys:i}}render(s,n,e){return this.dt(s,n,e).values}update(s,[n,e,t]){let i=As(s),{values:o,keys:a}=this.dt(n,e,t);if(!Array.isArray(i))return this.ut=a,o;let r=this.ut??=[],l=[],c,h,d=0,f=i.length-1,y=0,T=o.length-1;for(;d<=f&&y<=T;)if(i[d]===null)d++;else if(i[f]===null)f--;else if(r[d]===a[y])l[y]=ke(i[d],o[y]),d++,y++;else if(r[f]===a[T])l[T]=ke(i[f],o[T]),f--,T--;else if(r[d]===a[T])l[T]=ke(i[d],o[T]),Fe(s,l[T+1],i[d]),d++,T--;else if(r[f]===a[y])l[y]=ke(i[f],o[y]),Fe(s,i[d],i[f]),f--,y++;else if(c===void 0&&(c=Es(a,y,T),h=Es(r,d,f)),c.has(r[d]))if(c.has(r[f])){let u=h.get(a[y]),w=u!==void 0?i[u]:null;if(w===null){let E=Fe(s,i[d]);ke(E,o[y]),l[y]=E}else l[y]=ke(w,o[y]),Fe(s,i[d],w),i[u]=null;y++}else Pt(i[f]),f--;else Pt(i[d]),d++;for(;y<=T;){let u=Fe(s,l[T+1]);ke(u,o[y]),l[y++]=u}for(;d<=f;){let u=i[d++];u!==null&&Pt(u)}return this.ut=a,Ts(s,l),$e}});var St=[{color:"#12877A",rgb:"18,135,122",ink:"#0B5E55"},{color:"#2D5FC4",rgb:"45,95,196",ink:"#1E4594"},{color:"#B83E8A",rgb:"184,62,138",ink:"#8A2A66"},{color:"#B35C00",rgb:"179,92,0",ink:"#7F4100"},{color:"#6B4FBB",rgb:"107,79,187",ink:"#4C3590"},{color:"#3F7D20",rgb:"63,125,32",ink:"#2C5916"}];function J(s){return St[(s%St.length+St.length)%St.length]}var Ms="#23272E",Ps="35,39,46";var tr=3,Nt=36,on=12,Ss=8,nr=30,ln=60,dn=10,Lt=30,cn=10,sr=150,ir=200,Bt=1.4;function pn(s,n){let e=Math.max(sr,ir/Bt);return Math.ceil(ln+Math.max(0,s-1)*dn+Lt+Math.max(0,n-1)*cn+e*(s+Bt*n))}function ze(s){return s.people?s.people.kids.map(n=>n.id):s.days.length?Object.keys(s.days[0].kids):[]}function _e(s){return s.people?s.people.drivers.map(n=>n.id):s.days.length?Object.keys(s.days[0].drivers):[]}function ce(s){return new Map(ze(s).map((n,e)=>[n,J(e)]))}function de(s,n){let e=s.people?.kids.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.kids[n])return t.kids[n].name;return n}function Ce(s,n){let e=s.people?.drivers.find(t=>t.id===n);if(e)return e.name;for(let t of s.days)if(t.drivers[n])return t.drivers[n].name;return n}function un(s,n){return n==="none"?"Not needed":_e(s).includes(n)?Ce(s,n):n}function rr(s){let n=new Map([["home","Home"]]);for(let e of s.days)for(let t of e.events)n.set(t.place,t.short_place||t.place_name||t.place);return n}function Rt(s,n){return n?s.get(n)??(n.split(",")[0]?.trim()||n):""}function Dt(s,n){let e=[];for(let t of s)t.type==="drive"?(e.length||e.push(Rt(n,t.from)),e.push(Rt(n,t.to))):(t.type==="wait"||t.type==="stay")&&(e.length||e.push(Rt(n,t.place)),t.type==="wait"&&!e[e.length-1].endsWith("(wait)")&&(e[e.length-1]+=" (wait)"));return e}function or(s){let n=s.map(a=>({...a,col:0,cols:1})).sort((a,r)=>a.s-r.s||r.en-a.en),e=[],t=[],i=-1/0,o=()=>{for(let a of e)a.cols=t.length;e=[],t=[]};for(let a of n){a.s>=i&&(o(),i=-1/0);let r=t.findIndex(l=>l<=a.s);r<0?(r=t.length,t.push(a.en)):t[r]=a.en,a.col=r,e.push(a),i=Math.max(i,a.en)}return o(),n}function ar(s,n){if(!s.length)return 0;if(n<=s[0].t)return s[0].y;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.t)return i.t===t.t?t.y:Math.round(t.y+(n-t.t)/(i.t-t.t)*(i.y-t.y))}return s[s.length-1].y}function lr(s,n){if(!s.length)return 0;if(n<=s[0].y)return s[0].t;for(let e=0;e<s.length-1;e++){let t=s[e],i=s[e+1];if(n<=i.y)return i.y===t.y?t.t:t.t+(n-t.y)/(i.y-t.y)*(i.t-t.t)}return s[s.length-1].t}function Ls(s,n){return ar(s.anchors,n)}function Rs(s,n){return lr(s.anchors,n)}function dr(s,n){let e=ze(s),t=_e(s),i=Math.max(n,pn(e.length,t.length)),a=(i-ln-Math.max(0,e.length-1)*dn-Lt-Math.max(0,t.length-1)*cn)/(e.length+Bt*t.length||1),r=Math.floor(a),l=Math.floor(a*Bt),c=new Map;for(let T of s.days)for(let u of T.events){let w=c.get(u.kid)??[];w.some(E=>E.event_id===u.event_id&&E.calendar_id===u.calendar_id)||w.push(u),c.set(u.kid,w)}let h=ce(s),d=[],f=ln;e.forEach((T,u)=>{let w=c.get(T)??[],E=s.days.some(_=>_.events.some(U=>U.kid===T&&(U.sides.includes("drop")&&U.drop===""||U.sides.includes("pick")&&U.pick==="")));d.push({id:T,kind:"kid",x:f,w:r,name:de(s,T),dot:h.get(T).color,rgb:h.get(T).rgb,sub:`${E?"Needs a ride · ":""}${w.length} this week`,subWarn:E}),f+=r+(u<e.length-1?dn:0)});let y=f+Lt/2;return f+=Lt,t.forEach((T,u)=>{let w=0,E=0;for(let _ of s.days){let U=_.drivers[T];U&&(w+=U.outings.length,E+=U.drive??0)}d.push({id:T,kind:"driver",x:f,w:l,name:Ce(s,T),dot:Ms,rgb:Ps,sub:`${w} ${w===1?"trip":"trips"} this week · ${et(E)} driving`,subWarn:!1}),f+=l+(u<t.length-1?cn:0)}),{columns:d,sepX:y,width:i}}function cr(s,n){let e=s.trim();if(!n||e.length<=n.length||e.slice(0,n.length).localeCompare(n,void 0,{sensitivity:"accent"})!==0)return e;let i=e.slice(n.length),o=/^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(i);if(!o)return e;let a=i.slice(o[0].length);return a?a[0].toUpperCase()+a.slice(1):e}function Ds(s,n){let e=s.start<=0,t=s.end>=1440;return e&&t?`${s.title} · all day`:t?`${s.title} from ${I(s.start)}`:e||!n?`${s.title} until ${I(s.end)}`:`${s.title} ${I(s.start)}–${I(s.end)}`}function fn(s){return s.issues.filter(n=>n.level==="problem").length+s.clashes.length}function gn(s,n){let e=ue(n,s);return e===0?"Today":e===1?"Tomorrow":""}function se(s,n=0){return s==null||!Number.isFinite(s)?n:s}function hn(s,n,e=7){let t=Math.max(8,Math.floor(n/e)),i=1,o=0;for(let a of s.split(/\s+/).filter(Boolean)){let r=a.length;for(o===0?o=r:o+1+r<=t?o+=1+r:(i++,o=r);o>t;)i++,o-=t}return i}var Bs=25,Ns=15,mn=3;function an(s){return Math.max(0,Math.min(mn,Math.floor((s-Bs)/Ns)))}function hr(s,n){let e=Math.min(mn,hn(s,n-19,6.6));return Bs+e*Ns+2}function pr(s,n){let e=n-23,t=`${I(s.start)}–${I(s.end)}`+(s.arrive_by!=null?` · arrive ${I(s.arrive_by)}`:""),i=33+hn(t,e,6.6)*16;for(let o of[s.lines.drop,s.lines.pick])o&&(i+=2+hn(o.text,e,7)*16);return i+4}function Is(s,n,e,t){let i=n==="compact",{columns:o,sepX:a,width:r}=dr(s,e),l=new Map(o.map(_=>[_.id,_])),c=ze(s),h=_e(s),d=[...c,...h],f=ce(s),y=rr(s),T=_=>de(s,_),u=_=>Ce(s,_),w={mode:n,width:r,height:0,columns:o,sepX:a,dayHeads:[],empties:[],grid:[],hours:[],cards:[],rides:[],bands:[],trips:[],stays:[],busy:[],preps:[],overlaps:[],marks:[],now:null,anchors:[]},E=0;return s.days.forEach((_,U)=>{let X=U*1440,N=new Map(_.events.map(b=>[b.id,b])),Q=b=>b&&N.has(b)?{day:_.date,event:b}:null,m=fn(_),$=_.events.length,g=gn(_.date,t.date);w.dayHeads.push({date:_.date,y:E,label:pe(_.date),tag:g,sub:($?`${$} ${$===1?"activity":"activities"}`:"Nothing scheduled")+(m?` · ${m} to sort out`:""),warn:m>0}),w.anchors.push({t:X,y:E});let x=E+Nt+on,v=h.flatMap(b=>_.drivers[b]?.outings??[]);if(!$&&!v.length){w.empties.push({key:_.date,y:x,text:"Nothing planned"}),E=x+40,w.anchors.push({t:X+1439,y:E});return}let k=(b,B,S,z,j,le,M)=>{let q=f.get(b.kid)??J(0),Y=b.lines;return{key:`${_.date}|card|${b.id}`,x:B,y:S,w:z,h:j,target:{day:_.date,event:b.id},event:b,color:q,kidName:T(b.kid),clash:le,stayed:b.stay&&h.includes(b.drop),skipped:b.attending===!1,title:cr(b.title,T(b.kid)),time:`${I(b.start)}–${I(b.end)}`+(b.arrive_by!=null?` · arrive ${I(b.arrive_by)}`:""),drop:Y.drop,pick:Y.pick,showDrop:!!Y.drop&&(M||j>=56),showPick:!!Y.pick&&(M||j>=74),wrap:M,aria:`${T(b.kid)}, ${b.title} ${I(b.start)} to ${I(b.end)}. `+(b.attending===!1&&!Y.drop?"Not attending. ":"")+[Y.drop,Y.pick].filter(xe=>!!xe).map(xe=>xe.text).join(". ")}},P=b=>{let B=_.rides[b];return B?(_.drivers[B.driver]?.segments??[]).filter(z=>z.type!=="home"&&z.kids.includes(B.kid)&&se(z.start)>=se(B.start)&&se(z.end)<=se(B.end)):[]},R=b=>{let B=_.rides[b];if(!B)return null;let S=B.serves.find(z=>N.get(z)?.kid===B.kid);return Q(S??B.serves[0])},O=new Map;for(let b of _.issues)b.level!=="problem"||!b.event||(b.kind==="late"&&O.set(b.event,`${Math.round(se(b.minutes))} min late`),b.kind==="waiting"&&O.set(`${b.event}|pick`,`Waits ${Math.round(se(b.minutes))} min`));if(!i){let b=1/0,B=-1/0;for(let M of _.events)b=Math.min(b,M.start-20,M.arrive_by!=null?M.arrive_by-10:1/0),B=Math.max(B,M.end+20);for(let M of v)M.start!=null&&(b=Math.min(b,M.start)),M.end!=null&&(B=Math.max(B,M.end));_.date===t.date&&Number.isFinite(b)&&t.minutes>b-60&&t.minutes<B&&(b=Math.min(b,t.minutes-15));let S=Number.isFinite(b)?Math.floor((b-5)/30)*30:900,z=Number.isFinite(B)?Math.ceil((B+5)/30)*30:960,j=M=>Math.round(x+(Math.max(S,Math.min(z,M))-S)*tr);w.anchors.push({t:X+S,y:j(S)},{t:X+z,y:j(z)});for(let M of c){let q=l.get(M),Y=f.get(M),xe=(_.kids[M]?.items??[]).filter(A=>A.start!=null&&A.end!=null).map(A=>({item:A,s:se(A.start),en:se(A.end)})),re=[];for(let A of or(xe)){let ee=q.w/A.cols,K=Math.round(q.x+A.col*ee),W=Math.round(ee-(A.cols>1?4:0)),te=j(A.s),ve=A.item;if(ve.type==="act"){let ne=N.get(ve.event??"");if(!ne)continue;let Nn=Math.max(30,j(A.en)-te);if(w.cards.push(k(ne,K,te,W,Nn,ve.clash,!1)),re.push({s:ne.arrive_by!=null&&ne.start-ne.arrive_by>=5?ne.arrive_by:A.s,en:A.en,top:te}),ne.arrive_by!=null&&ne.start-ne.arrive_by>=5){let Ft=j(ne.arrive_by);re[re.length-1].top=Ft,w.preps.push({key:`${_.date}|prep|${ne.id}`,x:K,y:Ft,w:W,h:te-Ft+6,color:Y,label:`Arrive by ${I(ne.arrive_by)}`})}let In=O.get(ne.id);In&&w.marks.push({key:`${_.date}|late|${ne.id}`,x:K+W-4,y:te+4,text:In,right:!0});let On=O.get(`${ne.id}|pick`);On&&w.marks.push({key:`${_.date}|wait|${ne.id}`,x:K+4,y:te+Nn+2,text:On,right:!1});continue}let oe=_.rides[ve.ride??-1];if(!oe)continue;let Me=Math.max(22,j(A.en)-te),Z=Dt(P(oe.index),y),Pe=u(oe.driver),Je={key:`${_.date}|ride|${oe.index}`,x:K,y:te,w:W,h:Me,target:R(oe.index),l1:`${oe.own?"In":"Along in"} ${Pe}’s car`,l2:Z.join(" → "),show2:an(Me)>0,lines2:an(Me),dashed:!oe.own,clash:ve.clash,aria:`${T(M)} ${oe.own?"in":"riding along in"} ${Pe}’s car, ${I(se(oe.start))} to ${I(se(oe.end))}: ${Z.join(" to ")}`};w.rides.push(Je);let Bn=l.get(oe.driver),Kt=null;Bn&&(Kt={key:`${_.date}|band|${oe.index}`,x:K+W,y:te,w:Math.max(0,Bn.x+8-(K+W)),h:Me,color:Y},w.bands.push(Kt)),re.push({s:A.s,en:A.en,top:te,ride:{box:Je,band:Kt}})}for(let A of re){if(!A.ride)continue;let ee=re.filter(W=>W!==A&&W.s>=A.en&&W.s-A.en<=nr).sort((W,te)=>W.s-te.s||W.top-te.top)[0];if(!ee||ee.top<=A.ride.box.y+A.ride.box.h)continue;let K=ee.top-A.ride.box.y;A.ride.box.h=K,A.ride.box.lines2=an(K),A.ride.box.show2=A.ride.box.lines2>0,A.ride.band&&(A.ride.band.h=K)}}for(let M of h){let q=l.get(M),Y=_.drivers[M];if(!Y)continue;let xe=[],re=null;for(let A of Y.segments)if(!(A.start==null||A.end==null)){if(A.type==="home"){re=null;continue}if(A.type==="stay"){re=null,xe.push({type:"stay",g:A,s:A.start,en:A.end});continue}re&&re.en===A.start?(re.en=A.end,re.legs.push(A)):(re={type:"trip",s:A.start,en:A.end,legs:[A]},xe.push(re))}for(let A of xe){let ee=j(A.s),K=Math.max(24,j(A.en)-ee);if(A.type==="stay"){let Z=N.get(A.g.event??A.g.serves??""),Pe=Z?f.get(Z.kid)??J(0):J(0),Je=A.g.kids.map(T);w.stays.push({key:`${_.date}|stay|${M}|${A.s}`,x:q.x+8,y:ee,w:q.w-16,h:K,target:Q(Z?.id),color:Pe,l1:Z?`At ${Z.title} with ${T(Z.kid)}`:"Staying",l2:`until ${I(A.en)}`+(Je.length?` · ${Je.join(" and ")} too`:"")});continue}let W=A.legs[0],te=A.legs[A.legs.length-1],ve=[];for(let Z of A.legs)for(let Pe of Z.kids)ve.includes(Pe)||ve.push(Pe);let oe=te.type==="drive"&&te.to==="home",Me=Dt(A.legs,y);w.trips.push({key:`${_.date}|trip|${M}|${A.s}`,x:q.x+8,y:ee,w:q.w-16,h:K,target:Q(A.legs.find(Z=>Z.serves)?.serves),l1:W.type==="drive"&&W.from==="home"?`Leave ${I(A.s)}`:`From ${Rt(y,W.from??W.place)} ${I(A.s)}`,l2:Me.join(" → "),show2:K>=36,l3:oe?`Home ${I(A.en)}`:"",show3:oe&&K>=62,stops:null,kids:ve.map(Z=>(f.get(Z)??J(0)).color),bad:A.legs.some(Z=>Z.overlaps_busy),aria:`${u(M)} drives ${Me.join(" to ")}, ${I(A.s)} to ${I(A.en)}`})}for(let A of Y.segments)if(!(!A.overlaps_busy||A.start==null||A.end==null))for(let ee of Y.busy){let K=Math.max(A.start,ee.start),W=Math.min(A.end,ee.end);W<=K||w.overlaps.push({key:`${_.date}|overlap|${M}|${K}`,x:q.x+6,y:j(K)-2,w:q.w-12,h:Math.max(8,j(W)-j(K)+4)})}for(let A of Y.busy){if(A.end<=S||A.start>=z)continue;let ee=j(A.start),K=j(A.end);w.busy.push({key:`${_.date}|busy|${M}|${A.start}`,x:q.x+1,y:ee,w:q.w-2,h:K-ee,labelY:8,label:Ds(A,!1)})}}let le=-1/0;for(let M=S;M<=z;M+=30)w.grid.push({key:`${_.date}|grid|${M}`,y:j(M),strong:M%60===0}),M%60===0&&j(M)-le>=22&&(w.hours.push({key:`${_.date}|hour|${M}`,y:j(M)-8,label:es(M)}),le=j(M));_.date===t.date&&t.minutes>S&&t.minutes<z&&(w.now={y:j(t.minutes),label:`Now ${I(t.minutes)}`}),E=j(z)+on;return}let H=[];for(let b of c){let B=l.get(b);for(let S of _.kids[b]?.items??[])if(S.start!=null){if(S.type==="act"){let z=N.get(S.event??"");if(!z)continue;H.push({col:b,s:S.start,h:pr(z,B.w),kind:"act",item:S})}else if(!_.rides[S.ride??-1]?.own){let z=_.rides[S.ride??-1],j=z?Dt(P(z.index),y).join(" → "):"";H.push({col:b,s:S.start,h:hr(j,B.w),kind:"along",item:S})}}}for(let b of h){let B=_.drivers[b];if(B){for(let S of B.busy)H.push({col:b,s:S.start,h:32,kind:"busy",busy:S});for(let S of B.outings)S.start!=null&&H.push({col:b,s:S.start,h:30+S.lines.length*16+(S.warn?16:0),kind:"out",out:S})}}H.sort((b,B)=>b.s-B.s||d.indexOf(b.col)-d.indexOf(B.col));let D=new Map,L=[],F=x;H.forEach((b,B)=>{let S=D.get(b.col),z=Math.max(S!=null?S+Ss:x,F);D.set(b.col,z+b.h),F=z;let j=b.kind==="busy"?b.busy.end:b.kind==="act"?N.get(b.item.event??"")?.end??null:null;L.push({col:b.col,s:b.s,end:j,y:z,h:b.h,box:null}),w.anchors.push({t:X+b.s,y:z});let le=l.get(b.col);if(b.kind==="busy"){let M={key:`${_.date}|busy|${b.col}|${B}`,x:le.x+1,y:z,w:le.w-2,h:b.h,labelY:8,label:Ds(b.busy,!0)};w.busy.push(M),L[L.length-1].box=M}else if(b.kind==="out"){let M=b.out;w.trips.push({key:`${_.date}|trip|${b.col}|${B}`,x:le.x+8,y:z,w:le.w-16,h:b.h,target:Q(M.target),l1:M.lead,l2:"",show2:!1,l3:"",show3:!1,stops:[...M.lines.map(q=>({text:q,warn:!1})),...M.warn?[{text:M.warn,warn:!0}]:[]],kids:M.kids.map(q=>(f.get(q)??J(0)).color),bad:!!M.warn,aria:`${u(b.col)}: ${M.lead}. ${M.lines.join(". ")}${M.warn?`. ${M.warn}`:""}`})}else if(b.kind==="act"){let M=N.get(b.item.event??""),q=k(M,le.x,z,le.w,b.h,b.item.clash,!0);w.cards.push(q),L[L.length-1].box=q}else{let M=_.rides[b.item.ride??-1],q=Dt(P(M.index),y),Y=u(M.driver);w.rides.push({key:`${_.date}|ride|${M.index}`,x:le.x,y:z,w:le.w,h:b.h,target:R(M.index),l1:`Along with ${Y} ${I(se(M.start))}`,l2:q.join(" → "),show2:!0,lines2:mn,dashed:!0,clash:b.item.clash,aria:`${T(b.col)} riding along with ${Y}, ${I(se(M.start))} to ${I(se(M.end))}: ${q.join(" to ")}`})}});let be=x;for(let b of D.values())be=Math.max(be,b);for(let b of L){if(!b.box||b.end==null)continue;let B=b.y+b.h;for(let S of L)S.col!==b.col&&S.s>=b.s&&S.s<b.end&&(B=Math.max(B,S.y+S.h));b.end>=1440&&(B=be);for(let S of L)S.col===b.col&&S.y>b.y&&(B=Math.min(B,S.y-Ss));B=Math.min(B,be),B>b.y+b.h&&(b.box.h=B-b.y)}E=be+on+6,w.anchors.push({t:X+1439,y:E})}),w.height=E,w}var ur=["","¼","½","¾"];function Oe(s){return s.replace(/(\d+(?:\.\d+)?)\s*min\b/g,(n,e)=>{let t=Number(e);if(t>=59.5)return et(t);let i=Math.round(t*4),o=Math.floor(i/4),a=ur[i%4];return`${o||!a?o:""}${a} min`})}function Os(s){let n=e=>e?{...e,text:Oe(e.text)}:null;return{...s,days:s.days.map(e=>({...e,events:e.events.map(t=>({...t,lines:{drop:n(t.lines.drop),pick:n(t.lines.pick)}})),drivers:Object.fromEntries(Object.entries(e.drivers).map(([t,i])=>[t,{...i,outings:i.outings.map(o=>({...o,lines:o.lines.map(Oe),warn:o.warn==null?o.warn:Oe(o.warn)}))}])),issues:e.issues.map(t=>({...t,title:Oe(t.title),body:Oe(t.body),note:t.note==null?t.note:Oe(t.note),...t.suggestions?{suggestions:t.suggestions.map(i=>({...i,note:Oe(i.note)}))}:{}}))}))}}var fr=2,gr=48;function zs(s,n,e=gr){let t=[],i=0,o=0,a=0,r=0,l=n.minutes+e*60;for(let c of s.days){let h=ue(n.date,c.date),d=h===0?"":`${ae(c.date)} · `,f=new Map(c.events.map(u=>[u.id,u])),y=u=>u&&f.has(u)?{day:c.date,event:u}:null,T=(u,w)=>h*1440+(u??f.get(w??"")?.start??0)<l;for(let u of c.issues)if(u.level==="problem"){if(!T(u.at,u.event)){a++,u.kind==="unassigned"&&r++;continue}i++,u.kind==="unassigned"&&o++,t.push({key:`${c.date}|${u.key}`,tone:u.kind==="unassigned"?"unassigned":"problem",title:d+u.title,body:u.body,target:y(u.event),suggestions:(u.suggestions??[]).map(w=>({id:w.id,label:w.label,note:w.note}))})}if(c.clashes.forEach((u,w)=>{if(!T(u.a.start,u.a.event)){a++;return}i++;let E=f.get(u.a.event??""),_=de(s,u.kid),U=(N,Q)=>{let m=y(Q);return m?{text:N,target:m}:N},X=[];if(u.b.type==="act"){let N=f.get(u.b.event??"");E&&N&&(X=[U(E.title,E.id),` ${I(E.start)}–${I(E.end)} and `,U(N.title,N.id),` ${I(N.start)}–${I(N.end)} overlap.`])}else{let N=c.rides[u.b.ride??-1];E&&N&&(X=[`${_} is in `,U(`${Ce(s,N.driver)}’s car`,N.serves[0]),` ${I(se(u.b.start))}–${I(se(u.b.end))}, during `,U(E.title,E.id),"."])}t.push({key:`${c.date}|clash|${w}`,tone:"problem",title:`${d}${_} is double-booked`,body:X.map(N=>typeof N=="string"?N:N.text).join(""),parts:X,target:null,suggestions:[]})}),h>=0&&h<fr)for(let u of c.issues)u.level!=="heads_up"||!T(u.at,u.event)||t.push({key:`${c.date}|${u.key}`,tone:"heads_up",title:d+u.title,body:u.body,target:y(u.event),suggestions:[]});for(let u of c.events)!u.problems.length||!T(u.start)||t.push({key:`${c.date}|notes|${u.id}`,tone:"heads_up",title:`${d}Check the notes on ${de(s,u.kid)}’s ${u.title}`,body:`These lines couldn’t be read: ${u.problems.join("; ")}`,target:y(u.id),suggestions:[]})}return{items:t,problems:i,unassigned:o,later:a,laterUnassigned:r}}function Us(s,n){let e=ce(s),t=null,i=o=>o.ahead>0?2:o.ongoing?1:0;for(let o of s.days){let a=ue(n.date,o.date);if(!(a<0))for(let r of _e(s))for(let l of o.drivers[r]?.outings??[]){if(l.start==null)continue;let c=a*1440+l.start;if(a*1440+se(l.end,l.start)<=n.minutes)continue;let d=c-n.minutes,f={driver:r,name:Ce(s,r),date:o.date,ahead:a,start:l.start,inMinutes:d,ongoing:d<=0,lead:l.lead,stop:(l.lines[0]??"").replace(/\s+/g," ").trim(),kids:l.kids.map(y=>e.get(y)??J(0)),warn:l.warn,target:l.target&&o.events.some(y=>y.id===l.target)?{day:o.date,event:l.target}:null};(!t||i(f)<i(t)||i(f)===i(t)&&f.inMinutes<t.inMinutes)&&(t=f)}}return t}function We(s){return s.state==="done"||s.state==="late"}var mr=780;function br(s,n,e){return s.state==="open"&&!!s.for_day&&s.due===n&&e<mr}function Hs(s,n){return s.chores.map(e=>br(e,s.today,n)?{...e,state:"upcoming",shows_from:s.today}:e)}function js(s){return s.state==="open"||s.state==="overdue"}function vn(s,n,e){if(We(s)){let t=s.done_at?xr(s.done_at,n,e):"";return s.state==="late"?`Done late${t?` · ${t}`:""}`:`Done${t?` ${t}`:""}`}if(s.state==="overdue")return s.missed>1?`Missed ${s.missed} times`:s.due?`Missed ${bn(s.due,n)}`:"Missed";if(s.state==="upcoming"){if(s.for_day)return`From 1 PM · for ${bn(s.for_day,n)}`;let t=s.shows_from??s.due;if(!s.due||!t||s.due<=t)return"";let i=ue(n,s.due);return`By ${i===1?"tomorrow":i<7?ae(s.due):xn(s.due)}`}if(s.for_day&&s.due===n)return`Tonight · for ${bn(s.for_day,n)}`;if(s.due&&s.due>n){let t=ue(n,s.due);return t===1?"By tomorrow":`By ${t<7?ae(s.due):xn(s.due)}`}return s.missed?`Today · missed ${s.missed===1?"once":`${s.missed} times`} before`:"Today"}function bn(s,n){let e=ue(n,s);return e===0?"today":e===-1?"yesterday":e===1?"tomorrow":Math.abs(e)<7?ae(s):xn(s)}function xn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function xr(s,n,e){let t=new Date(s);if(Number.isNaN(t.getTime()))return"";let i=e;try{new Intl.DateTimeFormat("en-US",{timeZone:i})}catch{i=void 0}let o=t.toLocaleDateString("en-CA",{timeZone:i}),a=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:i});return o===n?a:`${ae(o)} ${a}`}function qs(s,n,e=1440){let t=Hs(s,e).sort((i,o)=>i.order-o.order);return s.kids.map((i,o)=>{let a=t.filter(h=>h.kid===i.id),r=new Map;for(let h of a){if(h.state!=="upcoming")continue;let d=h.shows_from??h.due??s.today;r.set(d,[...r.get(d)??[],h])}let l=a.filter(h=>h.state==="overdue"),c=a.filter(h=>h.state==="open");return{kid:i.id,name:i.name,color:n?.get(i.id)??J(o),overdue:l,now:c,done:a.filter(We),later:[...r.entries()].sort(([h],[d])=>h.localeCompare(d)).map(([h,d])=>({date:h,chores:d})),left:l.length+c.length}})}function Ks(s,n=1440){return Hs(s,n).filter(e=>e.state==="overdue"||e.state==="open"&&(e.due==null||e.due<=s.today)).sort((e,t)=>e.state===t.state?e.order-t.order:e.state==="overdue"?-1:1)}function yn(s){return!s.chores.length&&!s.templates.length}var Ue=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function wn(s){let n=s.trim();if(!n)return new Set([0,1,2,3,4,5,6]);let e=new Set;for(let t of n.split(",")){let[i,o]=t.split("-").map(a=>Ue.indexOf(a.trim()));if(i===void 0||i<0||o!==void 0&&o<0)return null;if(o===void 0)e.add(i);else for(let a=0;a<=(o-i+7)%7;a++)e.add((i+a)%7)}return e}function It(s){let n=[...new Set(s)].sort((t,i)=>t-i);if(n.length===0||n.length===7)return"";let e=[];for(let t of n){let i=e.at(-1);i&&i.at(-1)===t-1?i.push(t):e.push([t])}return e.flatMap(t=>t.length>=3?[`${Ue[t[0]]}-${Ue[t.at(-1)]}`]:t.map(i=>Ue[i])).join(", ")}var He="none";function Ot(s){return s==="daily"||s==="school"?"":"Any"}function Fs(s=[]){return{template:null,repeats:"daily",title:"",icon:null,details:"",who:s,take_turns:!1,days:"",every:1,paused:!1,night_before:!1,bring_only:!1}}function Ws(s){return{template:s.id,repeats:s.repeats,title:s.title,icon:s.icon,details:s.details??"",who:[...s.who],take_turns:!!s.take_turns,days:s.days??Ot(s.repeats),every:s.every&&s.every>0?s.every:1,paused:s.paused,night_before:!!s.night_before,bring_only:!!s.bring_only}}function $n(s){return s.title.trim()?s.who.length?s.days===He?"Pick at least one day.":null:"Pick who does it.":"Give the chore a name."}function Vs(s){return{...s.template?{template:s.template}:{},repeats:s.repeats,title:s.title.trim(),icon:s.icon??"",details:s.details.trim(),who:s.who,take_turns:s.take_turns&&s.who.length>1,days:s.days,every:s.repeats==="school"?1:s.every,paused:s.paused,...s.repeats==="school"?{night_before:s.night_before,bring_only:s.bring_only}:{}}}function kn(s){let n=s%100;return n>=11&&n<=13?`${s}th`:`${s}${{1:"st",2:"nd",3:"rd"}[s%10]??"th"}`}function _n(s,n,e=1,t=!1,i=!1){if(s==="school"){let h=n.trim().replace(/-/g,"–"),d=i?h?`${h} Bring lunch days`:"Bring lunch days":h?`${h} school days`:"Every school day";return t?`${d}, the night before`:d}let o={daily:"day",weekly:"week",monthly:"month"}[s],a=e>1?`every ${e} ${o}s`:`each ${o}`,r=n.trim();if(s==="daily"){let h=r.replace(/-/g,"–");return e>1?h?`${h}, every ${e} days`:`Every ${e} days`:h||"Every day"}if(!r||r.toLowerCase()==="any")return`Sometime ${a}`;if(s==="weekly")return`${r.replace(/-/g,"–")} ${a}`;let c=`${r.split(",").map(h=>{let d=h.trim();return d.toLowerCase()==="last"?"the last day":/^\d+$/.test(d)?`the ${kn(Number(d))}`:`the ${d}`}).join(" and ")} ${a}`;return c[0].toUpperCase()+c.slice(1)}function Cn(s,n,e=!1){let t=s.map(o=>n.find(a=>a.id===o)?.name??o);if(!t.length)return"Nobody yet";let i=t.length===1?t[0]:`${t.slice(0,-1).join(", ")} and ${t.at(-1)}`;return e&&t.length>1?`${i} take turns`:i}function Tn(s){let n=s.indexOf(":"),e=n<0?s:s.slice(0,n),t=n<0?"":s.slice(n+1);switch(e){case"who":return t?`“${t}” isn’t one of the kids`:"Nobody is picked to do it";case"days":return`The days (“${t}”) couldn’t be read`;case"title":return"It has no name";case"every":return`“Every ${t}” couldn’t be read`;case"take_turns":return`“Take turns: ${t}” couldn’t be read`;default:return`The ${e.replace(/_/g," ")} line (“${t}”) couldn’t be read`}}function zt(s,n){return`${s}|${n}`}function Ve(s,n){let[e,t,i]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1,i+n)).toISOString().slice(0,10)}function Ut(s){let[n,e,t]=s.split("-").map(Number);return(new Date(Date.UTC(n,e-1,t)).getUTCDay()+6)%7}function Gs(s,n){return s.days_off.find(e=>e.first<=n&&n<=e.last)??null}function Ys(s,n){return Ut(n)<5&&!Gs(s,n)}function at(s,n,e=new Map){if(!Ys(s,n))return null;let t=zt(s.id,n);if(e.has(t)){let o=e.get(t);return o?{lunch:o,picked:!0}:{lunch:s.default,picked:!1}}let i=s.picks[n];return i?{lunch:i,picked:!0}:{lunch:s.default,picked:!1}}function Ge(s,n){return Ys(s,n)?s.menus?.[n]??null:null}var vr="From the school's menu feed.";function yr(s){let n=s.split(`
`).map(e=>e.trim()).filter(e=>e&&e!==vr);return n.length?n.join(`
`):null}function ge(s){return s.slice(0,7)}function Ht(s){let[n,e]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,1)).toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"})}function An(s,n=1){let[e,t]=s.split("-").map(Number);return new Date(Date.UTC(e,t-1+n,1)).toISOString().slice(0,7)}function Js(s){let n=[];for(let e=ge(s.first);e<=ge(s.last);e=An(e))n.push(e);return n}function Qs(s,n,e,t=new Map){let i=`${e}-01`,o=Ve(i,-Ut(i)),a=[];for(;ge(o)<=e;){let r=[];for(let l=0;l<5;l++){let c=Ve(o,l),h=ge(c)!==e,d=h?null:Gs(n,c),f=h?null:at(n,c,t);r.push({date:c,day:Number(c.slice(8)),outside:h,off:d?d.title:null,lunch:f?.lunch??null,picked:f?.picked??!1,menu:h?null:Ge(n,c)?.dish??null,sides:h?null:yr(Ge(n,c)?.details??""),past:c<s.today,today:c===s.today})}r.some(l=>!l.outside)&&a.push(r),o=Ve(o,7)}return a}function Zs(s){return s.replace(/no[\s-]+school/i,"").replace(/^[\s:–—\-()]+|[\s()]+$/g,"")||"No school"}function Xs(s){let n=0,e=0;for(let t of s.flat())t.outside||t.past||!t.lunch||(t.lunch==="bring"?n++:e++);return{bring:n,buy:e}}function ei(s,n,e,t=new Map){let i=e<780?0:1;for(let o=i;o<8;o++){let a=Ve(n,o),r=at(s,a,t);if(!r)continue;let l=ue(n,a);return{lunch:r.lunch,when:l===0?"today":l===1?"tomorrow":ae(a),date:a,menu:Ge(s,a)?.dish??null}}return null}var wr={timeline:"timeline",full:"timeline",compact:"compact"};function lt(s){let n=new URLSearchParams(s),e={},t=wr[(n.get("view")??"").trim().toLowerCase()];t&&(e.view=t),["off","no","false","0"].includes((n.get("keyboard")??"").trim().toLowerCase())&&(e.keyboard=!1),(n.get("cursor")??"").trim().toLowerCase()==="show"&&(e.cursor="show");let i=(n.get("page")??"").trim().toLowerCase();return(i==="rides"||i==="chores"||i==="lunch")&&(e.page=i),e}var $r=["auth_callback","code","state"];function En(s){let n=new URLSearchParams(s);for(let t of $r)n.delete(t);let e=n.toString();return e?`?${e}`:""}var ti=De`
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
`;var ri="mydashlight.rides.mode",kr=1100,_r=440,Cr=700,Tr=3*6e4,Ar=1200;function Er(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"}catch{return"UTC"}}var jt=G`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`,ni=G`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`,Mr=["🛏️","🍽️","🧺","👕","🧹","🧽","🗑️","♻️","🐕","🐈","🐟","🌱","🪥","🛁","🧸","📚","🎒","🎻","🎹","🚗","🥪","💊"],si=G`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,ii=G`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`,Pr=G`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,Sr=G`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`,dt={bring:"Bring",buy:"Buy"};function Dr(s,n){let e={daily:"day",weekly:"week",monthly:"month",school:"school day"}[s];return n<=1?`Every ${e}`:n===2?`Every other ${e}`:`Every ${n} ${e}s${s==="monthly"&&n===3?" (quarterly)":""}`}function me(s){let n=/\p{L}|\p{N}/u.exec(s);return n?n[0].toUpperCase():"?"}function Mn(s){let[n,e,t]=s.split("-").map(Number);return new Date(Date.UTC(n,e-1,t)).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}function Lr(s,n){return gn(s,n)||pe(s).split(",")[0]}function Rr(s){let n=s.map(e=>`${e}’s`);return n.length<2?n[0]??"":`${n.slice(0,-1).join(", ")} or ${n[n.length-1]}`}function Br(){try{return localStorage.getItem(ri)==="compact"?"compact":"timeline"}catch{return"timeline"}}function Nr(s){try{localStorage.setItem(ri,s)}catch{}}function qt(s){return s.days.every(n=>!n.events.length)}var ct=class extends he{constructor(){super();this.stopWatching=null;this.resize=null;this.clockTimer=null;this.idleTimer=null;this.toastTimer=null;this.arriveTimer=null;this.drag=null;this.eatClick=!1;this.board=null;this.minuteKey="";this.watchedScroller=null;this.boardPlan=null;this.boardKey="";this.keepAt=null;this.urlView=lt(location.search).view;this.urlPage=lt(location.search).page;this.stopChores=null;this.stopLunch=null;this.scrolledOnce=!1;this.onDown=e=>{if(e.pointerType==="touch"||e.button!==0)return;let t=e.currentTarget;this.drag={el:t,x:e.clientX,y:e.clientY,top:t.scrollTop,left:t.scrollLeft,moved:!1,id:e.pointerId}};this.onMove=e=>{let t=this.drag;if(!t)return;let i=e.clientX-t.x,o=e.clientY-t.y;if(!t.moved){if(Math.abs(i)+Math.abs(o)<6)return;t.moved=!0;try{t.el.setPointerCapture(t.id)}catch{}t.el.classList.add("dragging")}t.el.scrollTop=t.top-o,t.el.scrollLeft=t.left-i};this.onUp=()=>{let e=this.drag;this.drag=null,e&&(e.el.classList.remove("dragging"),e.moved&&(this.eatClick=!0,setTimeout(()=>{this.eatClick=!1},0)))};this.onClickCapture=e=>{this.eatClick&&(e.stopPropagation(),e.preventDefault(),this.eatClick=!1)};this.onActivity=()=>{this.kiosk&&(this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{this.closeEditor(),this.sheet=!1,this.page!==(this.urlPage??"rides")&&this.setPage(this.urlPage??"rides"),this.urlView&&this.mode!==this.urlView?(this.mode=this.urlView,this.scrolledOnce=!1):this.scrollToNow()},Tr))};this.onKey=e=>{e.key==="Escape"&&(this.choreEdit||this.whoFor?this.closeChorePanels():this.sel?this.closeEditor():this.sheet=!1)};this.toggleMenu=()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))};this.backend=null,this.kiosk=!1,this.showMenu=!1,this.plan=null,this.error=null,this.mode=this.urlView??Br(),this.sel=null,this.sheet=!1,this.width=1600,this.boardWidth=1160,this.pending=null,this.toast=null,this.scope="this",this.arriveDraft=void 0,this.tick=0,this.page=this.urlPage??"rides",this.chores=void 0,this.choreDraft=new Map,this.manage=!1,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1,this.lunch=void 0,this.lunchDraft=new Map,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.menuEdit=null}connectedCallback(){super.connectedCallback(),this.clockTimer=setInterval(()=>{let e=this.today(),t=`${e.date}|${e.minutes}`;t!==this.minuteKey&&(this.minuteKey=t,this.tick++)},5e3),this.addEventListener("pointerdown",this.onActivity,{capture:!0}),this.addEventListener("keydown",this.onKey),this.watchBackend()}disconnectedCallback(){super.disconnectedCallback(),this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.resize?.disconnect(),this.resize=null;for(let e of[this.idleTimer,this.toastTimer,this.arriveTimer])e&&clearTimeout(e);this.clockTimer&&clearInterval(this.clockTimer),this.removeEventListener("pointerdown",this.onActivity,{capture:!0}),this.removeEventListener("keydown",this.onKey)}willUpdate(e){e.has("backend")&&this.isConnected&&this.watchBackend()}firstUpdated(){this.resize=new ResizeObserver(()=>this.measure()),this.resize.observe(this),this.measure()}updated(){let e=this.scroller;if(e!==this.watchedScroller&&this.resize&&(this.watchedScroller&&this.resize.unobserve(this.watchedScroller),e&&this.resize.observe(e),this.watchedScroller=e),!(!e||!this.board)){if(!this.scrolledOnce&&this.plan){this.scrolledOnce=!0,this.scrollToNow();return}if(this.keepAt!=null){let t=this.keepAt;this.keepAt=null,this.scrollToTime(t)}else this.syncDay()}}watchBackend(){this.stopWatching?.(),this.stopWatching=null,this.stopChores?.(),this.stopChores=null,this.stopLunch?.(),this.stopLunch=null,this.backend&&(this.stopLunch=this.backend.watchLunch(e=>{if(this.lunch=e,e&&this.lunchDraft.size){let t=new Map(this.lunchDraft);for(let[i,o]of this.lunchDraft){let[a,r]=i.split("|"),l=e.kids.find(c=>c.id===a);(!l||(l.picks[r]??null)===o||!at(l,r))&&t.delete(i)}this.lunchDraft=t}e===null&&this.page==="lunch"&&this.setPage("rides")}),this.stopChores=this.backend.watchChores(e=>{if(this.chores=e,e&&this.choreDraft.size){let t=new Map(this.choreDraft);for(let i of e.chores)t.has(i.id)&&We(i)===t.get(i.id)&&t.delete(i.id);for(let i of t.keys())e.chores.some(o=>o.id===i)||t.delete(i);this.choreDraft=t}}),this.stopWatching=this.backend.watch(e=>{this.plan=Os(e),this.error=null,this.sel&&!this.findEvent(this.sel)&&this.closeEditor()},e=>{this.error=e}))}measure(){this.width=this.clientWidth||window.innerWidth;let e=this.scroller;e&&(this.boardWidth=e.clientWidth)}get scroller(){return this.renderRoot.querySelector(".scroller")}get wide(){if(this.width<kr)return!1;let e=this.plan;return!e||this.width-_r>=pn(ze(e).length,_e(e).length)}today(){return Xe(this.plan?.time_zone??Er())}currentBoard(){let e=this.plan;if(!e)return null;let t=this.today(),i=`${this.mode}|${this.boardWidth}|${t.date}|${t.minutes}`;return(this.board==null||e!==this.boardPlan||i!==this.boardKey)&&(this.board=Is(e,this.mode,this.boardWidth,t),this.boardPlan=e,this.boardKey=i),this.board}dayIndexOf(e){return this.plan?this.plan.days.findIndex(t=>t.date===e):-1}scrollToTime(e,t){let i=this.scroller;if(!i||!this.board)return;let o=this.board.dayHeads.find(a=>a.date===t)?.y??0;i.scrollTop=Math.max(o,Ls(this.board,e)-Nt-4),this.syncDay()}scrollToNow(){if(!this.plan)return;let e=this.today(),t=Math.max(0,this.dayIndexOf(e.date));this.scrollToTime(t*1440+(this.mode==="timeline"&&t===this.dayIndexOf(e.date)?e.minutes-45:0),this.plan.days[t]?.date)}goToDay(e){let t=this.plan;if(!t)return;let i=this.today();if(e===i.date){this.scrollToNow();return}let o=this.dayIndexOf(e),a=t.days[o];if(!a)return;let r=1/0;if(this.mode==="timeline"){for(let l of a.events)r=Math.min(r,l.arrive_by??l.start);for(let l of Object.values(a.drivers))for(let c of l.outings)c.start!=null&&(r=Math.min(r,c.start))}this.scrollToTime(o*1440+(Number.isFinite(r)?Math.max(0,r-30):0),e)}syncDay(){let e=this.scroller;if(!e||!this.board||!this.board.dayHeads.length)return;let t=e.scrollTop,i=this.board.dayHeads[0];for(let c of this.board.dayHeads)c.y<=t+1&&(i=c);let o=this.renderRoot,a=o.querySelector(".pinned .label"),r=o.querySelector(".pinned .tag"),l=o.querySelector(".pinned .sub");a&&a.textContent!==i.label&&(a.textContent=i.label),r&&(r.textContent!==i.tag&&(r.textContent=i.tag),r.hidden=!i.tag),l&&l.textContent!==i.sub&&(l.textContent=i.sub),l?.classList.toggle("warn",i.warn);for(let c of o.querySelectorAll(".day-tile"))c.classList.toggle("in-view",c.dataset.date===i.date)}setPage(e){e!==this.page&&(this.closeEditor(),this.closeChorePanels(),this.manage=!1,this.lunchMonth=null,this.lunchKid=null,this.menuMode=!1,this.page=e,e==="rides"&&(this.scrolledOnce=!1))}tapChore(e){if(this.choreDone(e)||!this.chores?.people?.length){this.toggleChore(e);return}this.closeEditor(),this.closeChorePanels(),this.whoFor=e}async toggleChore(e,t){if(!this.backend)return;this.whoFor=null,this.whoOthers=!1;let i=!this.choreDone(e),o=new Map(this.choreDraft);o.set(e.id,i),this.choreDraft=o;try{await this.backend.setChoreDone(e.id,i,t&&t!==e.kid?t:void 0)}catch(a){let r=new Map(this.choreDraft);r.delete(e.id),this.choreDraft=r;let l=a instanceof V?a:new V("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}choreDone(e){return this.choreDraft.get(e.id)??We(e)}editMenu(e,t){let i=this.lunch?.kids??[],o=Ge(e,t),a=i.filter(r=>r.id===e.id||o&&Ge(r,t)?.dish===o.dish).map(r=>r.id);this.closePanel(),this.menuEdit={kid:e.id,date:t,dish:o?.dish??"",details:o?.details??"",kids:a,had:!!o,busy:!1}}async saveMenu(e=!1){let t=this.menuEdit;if(!(!t||!this.backend||!t.kids.length)){this.menuEdit={...t,busy:!0};try{await this.backend.setLunchMenu(t.kids,t.date,e?"":t.dish.trim(),e?"":t.details.trim()),this.menuEdit=null}catch(i){this.menuEdit={...t,busy:!1};let o=i instanceof V?i:new V("error",String(i));this.showToast(o.code==="preview"?o.message:`Couldn’t save that. ${o.message}`)}}}async saveLunch(e,t,i){if(!this.backend||!t.length)return;let o=new Map(this.lunchDraft);for(let a of t)o.set(zt(e,a),i);this.lunchDraft=o;try{await this.backend.setLunch(e,t,i)}catch(a){let r=new Map(this.lunchDraft);for(let c of t)r.delete(zt(e,c));this.lunchDraft=r;let l=a instanceof V?a:new V("error",String(a));this.showToast(l.code==="preview"?l.message:`Couldn’t save that. ${l.message}`)}}editChore(e){this.closeEditor(),this.closeChorePanels();let t=this.chores?.kids[0]?.id;this.choreEdit=e?Ws(e):Fs(this.chores?.kids.length===1&&t?[t]:[])}closeChorePanels(){this.menuEdit=null,this.choreEdit=null,this.choreBusy=!1,this.removeArmed=!1,this.whoFor=null,this.whoOthers=!1}changeDraft(e){this.choreEdit&&(this.choreEdit={...this.choreEdit,...e},this.removeArmed=!1)}async saveChoreEdit(){let e=this.choreEdit;if(!(!e||!this.backend||$n(e))){this.choreBusy=!0;try{await this.backend.saveChoreTemplate(Vs(e)),this.closeChorePanels(),this.showToast(e.template?"Saved.":`Added. ${e.title.trim()} shows on the board in a moment.`)}catch(t){this.choreBusy=!1;let i=t instanceof V?t:new V("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t save that. ${i.message}`)}}}async removeChoreEdit(){let e=this.choreEdit;if(!(!e?.template||!this.backend)){if(!this.removeArmed){this.removeArmed=!0;return}this.choreBusy=!0;try{await this.backend.removeChoreTemplate(e.template),this.closeChorePanels(),this.showToast(`Removed ${e.title.trim()||"the chore"}.`)}catch(t){this.choreBusy=!1,this.removeArmed=!1;let i=t instanceof V?t:new V("error",String(t));this.showToast(i.code==="preview"?i.message:`Couldn’t remove that. ${i.message}`)}}}setMode(e){if(e===this.mode)return;let t=this.scroller;this.keepAt=t&&this.board?Rs(this.board,t.scrollTop+Nt+4):null,this.mode=e,this.urlView||Nr(e)}findEvent(e){let t=this.plan?.days.find(o=>o.date===e.day),i=t?.events.find(o=>o.id===e.event);return t&&i?{day:t,event:i}:null}open(e,t=!1){e&&(this.flushArrive(),this.closeChorePanels(),this.sel=e,this.scope="this",this.arriveDraft=void 0,t&&this.reveal(e))}reveal(e){let t=this.findEvent(e),i=this.dayIndexOf(e.day);!t||i<0||this.scrollToTime(i*1440+Math.max(0,(t.event.arrive_by??t.event.start)-30),e.day)}closeEditor(){this.flushArrive(),this.sel=null,this.arriveDraft=void 0}showToast(e){this.toast=e,this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{this.toast=null},7e3)}async save(e,t,i){if(!this.pending){this.pending={key:e,value:t};try{await i()}catch(o){let a=o instanceof V?o:new V("error",String(o));this.showToast(a.code==="preview"?a.message:`Couldn’t save that. ${a.message}`)}finally{this.pending=null}}}setRide(e,t,i){if(!this.backend)return;let o=this.backend;this.save(`${t}`,i,()=>o.setRide(e.id,t,i,this.scope))}setAttending(e,t){if(!this.backend||e.attending!==!1===t)return;let i=this.backend;this.save("attending",t,()=>i.setAttending(e.id,t,this.scope))}toggleStay(e){if(!this.backend)return;let t=this.backend;this.save("stay",!e.stay,()=>t.setStay(e.id,!e.stay,this.scope))}toggleAlong(e,t){if(!this.backend)return;let i=this.backend,o=e.along.includes(t)?e.along.filter(a=>a!==t):[...e.along,t];this.save("along",o,()=>i.setTakeAlong(e.id,o,this.scope))}nudgeArrive(e,t){let i=this.arriveDraft!==void 0?this.arriveDraft:e.arrive_by,o;t<0?o=(i??e.start)-5:o=i==null||i+5>=e.start?null:i+5,this.arriveDraft=o,this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=setTimeout(()=>this.flushArrive(),Ar)}clearArrive(){this.arriveDraft=null,this.flushArrive()}flushArrive(){this.arriveTimer&&clearTimeout(this.arriveTimer),this.arriveTimer=null;let e=this.arriveDraft,t=this.sel;if(e===void 0||!t||!this.backend)return;let i=this.findEvent(t);if(!i||i.event.arrive_by===e){this.arriveDraft=void 0;return}let o=this.backend,a=i.event.id,r=this.scope;this.save("arrive",e,()=>o.setArriveBy(a,e,r)).then(()=>{this.arriveDraft=void 0})}apply(e){if(!this.backend)return;let t=this.backend;this.save(`fix|${e}`,e,()=>t.applySuggestion(e))}render(){let e=this.plan,t=this.currentBoard(),i=e?zs(e,this.today()):{items:[],problems:0,unassigned:0,later:0,laterUnassigned:0},o=this.wide,a=this.chores?Ks(this.chores,this.today().minutes).filter(d=>!this.choreDone(d)):[],r=this.menuEdit?this.renderMenuEditor(this.menuEdit):this.choreEdit?this.renderChoreEditor(this.choreEdit):this.whoFor?this.renderWhoDidIt(this.whoFor):null,l=this.menuEdit?"Lunch menu":this.choreEdit?this.choreEdit.template?"Change a chore":"Add a chore":this.whoFor?"Who did it":this.sel?"Change this ride":"Needs attention",c=p`<aside class="panel" aria-label=${l}>
      ${r??(this.sel&&e?this.renderEditor(e):this.renderAttention(i,a))}
    </aside>`,h=this.page==="rides";return p`
      <div class="app ${o?"wide":this.width<Cr?"narrow phone":"narrow"}">
        <div class="col">
          ${this.renderHeader(e,i,a.length)} ${h&&e?this.renderWeek(e):C}
          ${h?this.renderBanner(e):C}
          <main>
            ${h?p`<section class="board-area" aria-label="Everyone’s week">
                  ${t&&e?qt(e)?this.renderQuiet(e):this.renderBoard(t):this.renderEmpty()}
                </section>`:this.page==="lunch"?p`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`:p`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!o&&(this.sheet||this.sel||this.choreEdit||this.whoFor||this.menuEdit)?p`<div class="backdrop" @click=${()=>this.closePanel()}></div>
                  ${c}`:C}
          </main>
        </div>
        ${o?c:C}
        ${this.toast?p`<div class="toast" role="status">${this.toast}</div>`:C}
      </div>
    `}closePanel(){this.closeEditor(),this.closeChorePanels(),this.sheet=!1}renderHeader(e,t,i){let o=t.problems+i;this.tick;let a=this.today(),r="";if(e){let f=e.time_zone,y=new Date(e.updated);this.error?r=p`<span class="bad">Can’t reach Home Assistant · showing the plan from ${xt(y,new Date,f)}</span>`:e.status&&!e.status.ok?r=p`<span class="bad">Couldn’t read Google Calendar${e.status.error?`: ${e.status.error}`:""} · plan from ${xt(y,new Date,f)}</span>`:this.backend?.live||(r=`Updated ${xt(y,new Date,f)}`)}let l=(f,y,T,u)=>p`
      <button type="button" class="seg-btn" title=${u} aria-pressed=${this.mode===f?"true":"false"} @click=${()=>this.setMode(f)}>
        ${T}<span class="seg-label">${y}</span>
      </button>
    `,c=(f,y,T)=>p`
      <button type="button" class="seg-btn" aria-pressed=${this.page===f?"true":"false"} @click=${()=>this.setPage(f)}>
        ${T}<span class="seg-label">${y}</span>
      </button>
    `,h=Ze(a.minutes),d=!!e&&qt(e);return p`
      <header>
        ${this.showMenu?p`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${G`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`:C}
        <div class="titles">
          <h1 class="clock" aria-label=${`${pe(a.date)}, ${h}`}>
            <span class="hm">${h.slice(0,-3)}</span><span class="ampm">${h.slice(-2)}</span>
          </h1>
          <p class="today-line">${pe(a.date)}</p>
          ${r?p`<p class="status">${r}</p>`:C}
        </div>
        ${e&&!d?this.renderNext(e,Us(e,a),t):C}
        <div class="controls">
          ${this.wide||d&&!i?C:p`<button type="button" class="attn-btn ${o?"has":""}" @click=${()=>{this.sheet=!0}}>
                <span class="attn-label">Needs attention</span> <span class="count">${o}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page!=="rides"?C:p`<div role="group" aria-label="View" class="seg">
            ${l("timeline","Timeline",G`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Spacing matches the clock")}
            ${l("compact","Compact",G`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,"Everything in order, no time scale")}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${c("rides","Rides",G`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${c("chores","Chores",G`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch===null?C:c("lunch","Lunch",G`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
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
      </div>`}let o;t.ongoing?o="On the road now":t.ahead===0?o=t.inMinutes<180?`Next trip · in ${et(t.inMinutes)}`:"Next trip · later today":t.ahead===1?o="Next trip · tomorrow":o=`Next trip · ${ae(t.date)}`;let a=!t.ongoing&&t.ahead===0&&t.inMinutes<=30,r=p`
      <span class="next-eyebrow">${o}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${me(t.name)}</span>
        <span class="next-lead">${t.name} · ${t.lead}</span>
        <span class="next-kids">${t.kids.map(c=>p`<span class="kid-dot" style="background:${c.color}"></span>`)}</span>
      </span>
      ${t.warn?p`<span class="next-stop warn">${t.warn}</span>`:t.stop?p`<span class="next-stop">${t.stop}</span>`:C}
    `,l=`next ${t.ongoing?"ongoing":a?"soon":""}`;return t.target?p`<button type="button" class=${l} @click=${()=>this.open(t.target)}>${r}</button>`:p`<div class=${l}>${r}</div>`}renderWeek(e){let t=this.today().date,i=ce(e);return p`<nav class="week" aria-label="Days">
      ${e.days.map(o=>{let a=fn(o),r=o.events.length,l=o.events.slice(0,6).map(h=>i.get(h.kid)?.color??J(0).color),c=`${pe(o.date)}: ${r?`${r} ${r===1?"activity":"activities"}`:"nothing planned"}${a?`, ${a} to sort out`:""}`;return p`<button
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
            ${r>6?p`<span class="dt-more">+${r-6}</span>`:C}
          </span>
          ${a?p`<span class="dt-badge" aria-hidden="true">${a}</span>`:C}
        </button>`})}
    </nav>`}renderQuiet(e){let t=ze(e),i=_e(e),o=ce(e),a=t.map(r=>de(e,r));return p`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${t.slice(0,3).map((r,l)=>G`<circle cx=${50+l*30} cy="80" r="11" fill=${o.get(r).color} opacity="0.9" />`)}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${Rr(a)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${t.map(r=>{let l=o.get(r);return p`<div class="qw-person" style="--c:${l.color};--rgb:${l.rgb}">
            <span class="avatar" aria-hidden="true">${me(de(e,r))}</span>
            <span class="qw-name">${de(e,r)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`})}
        ${i.map(r=>p`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${me(Ce(e,r))}</span>
            <span class="qw-name">${Ce(e,r)}</span>
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
    </div>`:C}renderEmpty(){return this.error?p`<div class="empty-state">
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
              <span class="avatar ${r.kind}" aria-hidden="true">${me(r.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${r.name}</span>${r.kind==="kid"?this.renderLunchChip(r.id,!0):C}</span>
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
              <span class="label">${r.label}</span>${r.tag?p`<span class="tag">${r.tag}</span>`:C}<span
                class="sub ${r.warn?"warn":""}"
                >${r.sub}</span
              >
            </div>`)}
          ${e.empties.map(r=>p`<span class="empty" style="top:${r.y}px">${r.text}</span>`)}
          ${e.grid.map(r=>p`<div class="grid ${r.strong?"strong":""}" style="top:${r.y}px;width:${a-60}px"></div>`)}
          ${e.hours.map(r=>p`<span class="hour" style="top:${r.y}px">${r.label}</span>`)}
          ${fe(e.bands,r=>r.key,r=>p`<div
                class="band"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:rgba(${r.color.rgb},0.10);border-color:rgba(${r.color.rgb},0.45)"
              ></div>`)}
          ${fe(e.busy,r=>r.key,r=>p`<div class="busy" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px">
                <span style="top:${r.labelY}px">${r.label}</span>
              </div>`)}
          ${fe(e.preps,r=>r.key,r=>p`<div
                class="prep"
                aria-hidden="true"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:rgba(${r.color.rgb},0.07);color:${r.color.ink}"
              >
                ${r.label}
              </div>`)}
          ${fe(e.cards,r=>r.key,r=>{let l=r.color,c=r.skipped?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.10) 0px, rgba(${l.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`:r.stayed?`repeating-linear-gradient(135deg, rgba(${l.rgb},0.24) 0px, rgba(${l.rgb},0.24) 6px, rgba(${l.rgb},0.08) 6px, rgba(${l.rgb},0.08) 12px), var(--surface)`:`linear-gradient(rgba(${l.rgb},0.15), rgba(${l.rgb},0.15)), var(--surface)`;return p`<button
                type="button"
                class="card ${r.wrap?"wrap":""} ${i(r.target)?"sel":""} ${r.clash?"clash":""} ${r.skipped?"skipped":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;background:${c};border-color:${r.clash?"var(--bad)":`rgba(${l.rgb},0.45)`};--c:${l.color};--rgb:${l.rgb};--ring:${l.color}"
                @click=${()=>this.open(r.target)}
              >
                <span class="top">
                  <span class="title">${r.title}</span>
                  <span class="time">${r.time}</span>
                  ${r.showDrop&&r.drop?p`<span class="line tone-${r.drop.tone}">${r.drop.text}</span>`:C}
                </span>
                ${r.showPick&&r.pick?p`<span class="line tone-${r.pick.tone}">${r.pick.text}</span>`:C}
              </button>`})}
          ${fe(e.rides,r=>r.key,r=>p`<button
                type="button"
                class="ride ${r.dashed?"dashed":""} ${r.clash?"clash":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}</span>${r.show2?p`<span class="l2" style="-webkit-line-clamp:${r.lines2}">${r.l2}</span>`:C}
              </button>`)}
          ${fe(e.stays,r=>r.key,r=>p`<button
                type="button"
                class="stay"
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-color:${r.color.color};background:repeating-linear-gradient(135deg, rgba(${r.color.rgb},0.28) 0px, rgba(${r.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1" style="color:${r.color.ink}">${r.l1}</span><span class="l2">${r.l2}</span>
              </button>`)}
          ${fe(e.trips,r=>r.key,r=>p`<button
                type="button"
                class="trip ${r.bad?"bad":""} ${r.stops?"list":""}"
                aria-label=${r.aria}
                style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                @click=${()=>this.open(r.target)}
              >
                <span class="l1">${r.l1}${r.kids.map(l=>p`<span class="kid-dot" style="background:${l}"></span>`)}</span>
                ${r.show2?p`<span class="l2">${r.l2}</span>`:C}
                ${r.stops?r.stops.map(l=>p`<span class="stop ${l.warn?"warn":""}">${l.text}</span>`):C}
                ${r.show3?p`<span class="l3">${r.l3}</span>`:C}
              </button>`)}
          ${fe(e.overlaps,r=>r.key,r=>p`<div class="overlap" aria-hidden="true" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`)}
          ${fe(e.marks,r=>r.key,r=>p`<span class="mark" style="left:${r.x}px;top:${r.y}px;${r.right?"transform:translateX(-100%)":""}">${r.text}</span>`)}
          ${e.now?p`<div class="now-line" aria-hidden="true" style="top:${e.now.y-1.5}px;width:${a-56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${e.now.y-9}px">${e.now.label}</span>`:C}
        </div>
      </div>
    `}renderAttention(e,t){let{items:i,problems:o,later:a}=e,r=this.plan,l=o+t.length,c=this.chores,h=!!c&&!yn(c);return p`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${l?"bad":"ok"}">${l}</span>
        ${this.wide?C:p`<button type="button" class="btn dark" @click=${()=>this.sheet=!1}>Done</button>`}
      </div>
      ${h?p`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${t.length?p`<div class="attn-chores">${t.map(d=>this.renderChoreRow(d,!0))}</div>`:p`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`:p`<p class="panel-sub">Rides in the next two days</p>`}
      ${r&&!o?p`<div class="all-clear">
            <span class="check" aria-hidden="true">${G`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${qt(r)?"Nothing needs you this week.":a?`Nothing for the next two days. ${a} more later this week, marked on the days above.`:"Every ride is covered and nobody is double-booked."}</span>
          </div>`:C}
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
              </div>`:C}
        </div>`)}
      ${this.wide&&r&&!qt(r)&&this.page==="rides"?this.renderLegend():C}
    `}kidColorOf(e){let t=this.plan?ce(this.plan).get(e):void 0;if(t)return t;let i=this.lunch?.kids.findIndex(o=>o.id===e)??-1;return J(Math.max(0,i))}renderLunchChip(e,t=!1){let i=this.lunch,o=i?.kids.find(c=>c.id===e);if(!i||!o)return C;this.tick;let a=this.today(),r=ei(o,a.date,a.minutes,this.lunchDraft);if(!r)return C;let l=dt[r.lunch];return p`<span class="lunch-chip ${r.lunch} ${t?"small":""}" title=${`${l} lunch ${r.when}${r.menu?`: ${r.menu}`:""}`}
      >${r.lunch==="bring"?si:ii}<span class="lunch-chip-text"
        >${l}${t?C:` ${r.when}`}${!t&&r.menu?p`<span class="lunch-chip-menu"> · ${r.menu}</span>`:C}</span
      ></span
    >`}renderLunch(){let e=this.lunch;if(e===void 0)return p`<div class="chores-message"><p>Loading lunches…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;let t=Js(e),i=this.lunchMonth&&t.includes(this.lunchMonth)?this.lunchMonth:ge(e.today),o=t.indexOf(i),a=h=>{let d=t[o+h];d&&(this.lunchMonth=d)},r=e.kids.some(h=>h.id===this.lunchKid)?this.lunchKid:null,l=r?e.kids.filter(h=>h.id===r):e.kids,c=e.status&&!e.status.ok?p`<p class="field-hint bad">Couldn’t read the calendars just now${e.status.error?`: ${e.status.error}`:""}. Showing the last read.</p>`:C;return p`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${o<=0} @click=${()=>a(-1)}>
            ${G`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${Ht(i)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${o<0||o>=t.length-1} @click=${()=>a(1)}>
            ${G`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
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
          ${this.menuMode?"Done":p`${ni} Edit menus`}
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
    </div>`}renderLunchCard(e,t,i,o){let a=this.kidColorOf(t.id),r=Qs(e,t,i,this.lunchDraft),l=Xs(r),c=r.flat(),h=c.filter(u=>!u.outside&&!u.past&&u.lunch),d=t.days_off.filter(u=>ge(u.first)<=i&&i<=ge(u.last)),f=u=>h.filter(w=>Ut(w.date)===u),y=u=>{let w=f(u);if(!w.length)return;let E=w.every(_=>_.lunch==="bring")?"buy":"bring";this.saveLunch(t.id,w.map(_=>_.date),E)},T=h.length?`${l.bring} Bring · ${l.buy} Buy${i===ge(e.today)?" left this month":""}`:"No school days left this month";return p`<section class="chore-col lunch-card ${o?"wide":""}" style="--c:${a.color};--rgb:${a.rgb};--k:${a.ink}" aria-label=${`${t.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${me(t.name)}</span>
        <span class="ch-text">
          <span class="name">${t.name}</span>
          <span class="sub">${T}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${dt[t.default]} unless picked</span>
          ${e.kids.length<2?C:p`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${o?"Show everyone’s lunches":`Expand ${t.name}’s lunches to show each day’s whole menu`}
                @click=${()=>this.lunchKid=o?null:t.id}
              >
                ${o?Sr:Pr}${o?"Show everyone":"Expand to pick"}
              </button>`}
        </span>
      </div>
      ${t.menu_feed&&!t.menu_feed.ok?p`<p class="field-hint bad">Couldn’t read the school menu feed${t.menu_feed.error?`: ${t.menu_feed.error}`:""}.</p>`:C}
      <div class="lunch-grid" role="grid" aria-label=${`${t.name}, ${Ht(i)}`}>
        ${["Mon","Tue","Wed","Thu","Fri"].map((u,w)=>p`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!f(w).length}
            aria-label=${`${f(w).every(E=>E.lunch==="bring")?"Buy":"Bring"} every ${u} left in ${Ht(i)} for ${t.name}`}
            @click=${()=>y(w)}
          >
            ${u}
          </button>`)}
        ${c.map(u=>this.renderLunchCell(t,u,o))}
      </div>
      ${d.length?p`<p class="lunch-offs">
            No school:
            ${d.map(u=>{let w=u.first<`${i}-01`?`${i}-01`:u.first,E=ge(u.last)>i?Ve(`${An(i)}-01`,-1):u.last;return`${w===E?Mn(w):`${Mn(w)}–${Mn(E)}`} ${Zs(u.title)}`}).join(" · ")}
          </p>`:C}
    </section>`}renderLunchCell(e,t,i=!1){if(t.outside)return p`<span class="lunch-day outside" aria-hidden="true"></span>`;if(t.off!==null||!t.lunch)return p`<span class="lunch-day off ${t.today?"today":""}" title=${t.off??""}>
        <span class="lunch-num">${t.day}</span><span class="lunch-word">No school</span>
      </span>`;let o=t.lunch,a=o==="buy"?"bring":"buy",r=t.menu?`, ${t.menu}`:"",l=this.menuMode,c=this.menuEdit?.date===t.date&&this.menuEdit.kids.includes(e.id),h=l?`${e.name}, ${pe(t.date)}${r||", no menu yet"}. Tap to ${t.menu?"change":"add"} the menu.`:`${e.name}, ${pe(t.date)}: ${dt[o]}${t.picked?"":" (not picked yet)"}${r}. Tap to ${dt[a]}.`;return p`<button
      type="button"
      class="lunch-day ${o} ${t.picked?"picked":"unpicked"} ${t.past?"past":""} ${t.today?"today":""} ${l?"editing":""} ${c?"sel":""}"
      ?disabled=${t.past&&!l}
      aria-label=${h}
      @click=${()=>l?this.editMenu(e,t.date):void this.saveLunch(e.id,[t.date],a)}
    >
      <span class="lunch-num">${t.day}</span>
      <span class="lunch-word">${o==="bring"?si:ii}${dt[o]}</span>
      ${t.menu?p`<span class="lunch-menu">${t.menu}</span>${i&&t.sides?p`<span class="lunch-sides">${t.sides}</span>`:C}`:l?p`<span class="lunch-menu add">${jt} Menu</span>`:C}
    </button>`}renderChoreRow(e,t=!1){let i=this.chores,o=this.choreDone(e),a=i.kids.findIndex(E=>E.id===e.kid),r=(this.plan?ce(this.plan).get(e.kid):void 0)??J(Math.max(0,a)),l=i.kids[a]?.name??"",c=o===We(e)?e:{...e,state:o?"done":"open",done_at:o?new Date().toISOString():null},h=o&&c.done_by&&c.done_by!==e.kid?i.people?.find(E=>E.id===c.done_by)?.name??c.done_by_name??null:null,d=`${vn(c,i.today,i.time_zone)}${h?` · by ${h}`:""}`,f=o||js(e),y=`${t?`${l}: `:""}${e.title}. ${d?`${d}. `:""}${o?"Done. Tap to undo.":"Tap when it’s done."}`,T=p`<span class="box" aria-hidden="true"
        >${o?G`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`:C}</span
      >
      ${e.icon?p`<span class="chore-icon" aria-hidden="true">${e.icon}</span>`:C}
      <span class="chore-text">
        <span class="chore-title">${t?p`<span class="chore-kid">${l}</span> · `:C}${e.title}</span>
        ${d?p`<span class="chore-note">${d}</span>`:C}
      </span>`,u=`chore ${o?"done":""} ${e.state==="overdue"&&!o?"overdue":""} ${f?"":"later"}`,w=`--c:${r.color};--rgb:${r.rgb};--k:${r.ink}`;return f?p`<button type="button" class=${u} style=${w} aria-pressed=${o?"true":"false"} aria-label=${y} @click=${()=>this.tapChore(e)}>
          ${T}
        </button>`:p`<div class=${u} style=${w}>${T}</div>`}renderChores(){let e=this.chores;if(e===void 0)return p`<div class="chores-message"><p>Loading chores…</p></div>`;if(e===null)return p`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;if(e.status.needs==="sign_in")return p`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;if(e.status.needs==="tasks_api")return p`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;if(this.manage)return this.renderManage(e);if(yn(e))return p`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${()=>this.editChore(null)}>${jt} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore templates: Daily</strong> (or Weekly or Monthly). It
          shows here to be set up.
        </p>
      </div>`;let t=e.templates.filter(a=>a.problems.length),i=t.length?p`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${t.length===1?"1 chore needs setting up":`${t.length} chores need setting up`}</h3>
          <div class="setup-list">${t.map(a=>this.renderTemplateRow(a))}</div>
        </section>`:C;this.tick;let o=qs(e,this.plan?ce(this.plan):void 0,this.today().minutes);return p`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${jt} Add a chore</button>
        <button type="button" class="btn" @click=${()=>{this.closeChorePanels(),this.manage=!0}}>${ni} Manage chores</button>
      </div>
      ${i}
      <div class="chore-cols" style="--n:${o.length}">
        ${o.map(a=>{let r=a.overdue.filter(l=>!this.choreDone(l)).length+a.now.filter(l=>!this.choreDone(l)).length;return p`<section class="chore-col" style="--c:${a.color.color};--rgb:${a.color.rgb}" aria-label=${`${a.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${me(a.name)}</span>
              <span class="ch-text">
                <span class="name">${a.name}</span>
                <span class="sub">${r?`${r} to do`:a.done.length?"All done for now":"Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(a.kid)}
            </div>
            ${a.overdue.length?p`<h3 class="chore-group overdue">Missed</h3>
                  ${a.overdue.map(l=>this.renderChoreRow(l))}`:C}
            ${a.now.length?p`<h3 class="chore-group">To do</h3>
                  ${a.now.map(l=>this.renderChoreRow(l))}`:C}
            ${a.done.length?p`<h3 class="chore-group">Done</h3>
                  ${a.done.map(l=>this.renderChoreRow(l))}`:C}
            ${a.later.map(l=>p`<h3 class="chore-group">${l.date===e.today?"Later today":Lr(l.date,e.today)}</h3>
                ${l.chores.map(c=>this.renderChoreRow(c))}`)}
            ${!a.overdue.length&&!a.now.length&&!a.done.length&&!a.later.length?p`<p class="chore-none">No chores this week.</p>`:C}
          </section>`})}
      </div>
    </div>`}renderTemplateRow(e){let i=this.chores.kids,o=this.plan?ce(this.plan):void 0,a=this.choreEdit?.template===e.id,r=e.problems.length?p`<span class="tmpl-note bad">${e.problems.map(Tn).join(" · ")} · tap to set up</span>`:p`<span class="tmpl-note">${Cn(e.who,i,e.take_turns)} · ${_n(e.repeats,e.days??"",e.every??1,!!e.night_before,!!e.bring_only)}</span>`;return p`<button type="button" class="tmpl ${e.problems.length?"needs":""} ${e.paused?"paused":""} ${a?"sel":""}" @click=${()=>this.editChore(e)}>
      <span class="tmpl-icon" aria-hidden="true">${e.icon??"•"}</span>
      <span class="chore-text">
        <span class="chore-title">${e.title||"(no name)"}${e.paused?p` <span class="tag-paused">Paused</span>`:C}</span>
        ${r}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${e.who.map(l=>{let c=i.findIndex(d=>d.id===l),h=o?.get(l)??J(Math.max(0,c));return p`<span class="kid-dot" style="background:${h.color}"></span>`})}
      </span>
    </button>`}renderManage(e){let t=[["daily","Every day or some days"],["school","School days"],["weekly","Weekly"],["monthly","Monthly"]];return p`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${()=>this.editChore(null)}>${jt} Add a chore</button>
        <button type="button" class="btn dark" @click=${()=>{this.closeChorePanels(),this.manage=!1}}>Done</button>
      </div>
      ${e.templates.length?t.map(([i,o])=>{let a=e.templates.filter(r=>r.repeats===i);return a.length?p`<section class="manage-group" aria-label=${o}>
                  <h3 class="chore-group">${o}</h3>
                  <div class="tmpl-list">${a.map(r=>this.renderTemplateRow(r))}</div>
                </section>`:C}):p`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the lists <strong>Chore templates: Daily</strong>, <strong>Weekly</strong>,
        <strong>Monthly</strong> and <strong>School days</strong>. A task added there by hand shows up here to be set up.
      </p>
    </div>`}renderChoreEditor(e){let t=this.chores;if(!t)return p``;let i=t.kids,o=this.plan?ce(this.plan):void 0,a=this.choreBusy,r=e.template?t.templates.find(u=>u.id===e.template):void 0,l=$n(e),c=(r?.problems??[]).filter(u=>u!=="who:"),h=(u,w,E,_=!1)=>p`<button type="button" class="choice ${_?"wide":""}" aria-pressed=${u?"true":"false"} ?disabled=${a} @click=${E}>${w}</button>`,d=(u,w,E,_)=>p`<button type="button" class="chip" aria-pressed=${u?"true":"false"} aria-label=${_??C} ?disabled=${a} @click=${E}>${w}</button>`,f=u=>{u!==e.repeats&&this.changeDraft({repeats:u,days:r&&r.repeats===u?r.days??Ot(u):Ot(u)})},y=u=>{let w=e.who.includes(u)?e.who.filter(E=>E!==u):i.filter(E=>E.id===u||e.who.includes(E.id)).map(E=>E.id);this.changeDraft({who:w})},T;if(e.repeats==="school"){let u=e.days===He?new Set:e.days===""?new Set([0,1,2,3,4]):wn(e.days)??new Set,w=E=>{let _=new Set(u);_.has(E)?_.delete(E):_.add(E),this.changeDraft({days:_.size===5?"":_.size?It(_):He})};T=p`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${Ue.slice(0,5).map((E,_)=>d(u.has(_),E.slice(0,2),()=>w(_),E))}
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
        </div>`}else if(e.repeats==="monthly"){let u=e.days.trim(),w=/^\d+$/.test(u)?Number(u):null,E=u&&u.toLowerCase()!=="any"&&u.toLowerCase()!=="last"&&w===null;T=p`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${E?4:3}, minmax(0, 1fr))">
          ${h(u===""||u.toLowerCase()==="any","Any time",()=>this.changeDraft({days:"Any"}))}
          ${h(w!==null,"On a date",()=>this.changeDraft({days:String(w??1)}))}
          ${h(u.toLowerCase()==="last","Last day",()=>this.changeDraft({days:"last"}))}
          ${E?h(!0,u,()=>{}):C}
        </div>
        ${w!==null?p`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${a||w<=1} @click=${()=>this.changeDraft({days:String(w-1)})}>−</button>
                <span class="arrive-value">${kn(w)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${a||w>=31} @click=${()=>this.changeDraft({days:String(w+1)})}>+</button>
              </span>
            </div>`:p`<p class="field-hint">${u.toLowerCase()==="last"?"Due on the month’s last day.":E?"Set in Google Tasks; pick another to change it.":"Shows all month, due on its last day."}</p>`}
      </div>`}else{let u=e.repeats==="weekly"&&(e.days===""||e.days.toLowerCase()==="any"),w=e.days===He?new Set:u?new Set:wn(e.days)??new Set,E=_=>{let U=new Set(w);U.has(_)?U.delete(_):U.add(_),e.repeats==="weekly"?this.changeDraft({days:U.size?It(U)||"Mon-Sun":"Any"}):this.changeDraft({days:U.size?It(U):He})};T=p`<div class="field">
        <span class="field-label">${e.repeats==="weekly"?"Which day":"Which days"}</span>
        ${e.repeats==="weekly"?p`<div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
              ${h(u,"Any day that week",()=>this.changeDraft({days:"Any"}))}
              ${h(!u,"On a set day",()=>this.changeDraft({days:u?"Sat":e.days}))}
            </div>`:C}
        ${e.repeats==="daily"||!u?p`<div role="group" aria-label="Days of the week" class="day-chips">
              ${Ue.map((_,U)=>d(w.has(U),_.slice(0,2),()=>E(U),_))}
            </div>`:C}
        ${e.repeats==="daily"?p`<div class="chips">
              ${d(e.days==="","Every day",()=>this.changeDraft({days:""}))}
              ${d(e.days==="Mon-Fri","Weekdays",()=>this.changeDraft({days:"Mon-Fri"}))}
              ${d(e.days==="Sat, Sun","Weekends",()=>this.changeDraft({days:"Sat, Sun"}))}
            </div>`:p`<p class="field-hint">${u?"Shows all week, due on Sunday.":"Due that day."}</p>`}
      </div>`}return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:C}${e.template?e.title||"Set up a chore":"Add a chore"}</span>
          <span class="ed-meta">${e.who.length?Cn(e.who,i,e.take_turns):"Nobody yet"} · ${e.days===He?"No days picked":_n(e.repeats,e.days,e.every,e.night_before,e.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${a} @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      ${c.length?p`<p class="field-hint bad">${c.map(Tn).join(". ")}. Saving fixes it.</p>`:C}
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
          ${Mr.map(u=>d(e.icon===u,u,()=>this.changeDraft({icon:e.icon===u?null:u}),`Picture ${u}`))}
        </div>
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${i.map((u,w)=>{let E=o?.get(u.id)??J(w),_=e.who.includes(u.id);return p`<button type="button" class="who-chip" style="--c:${E.color};--rgb:${E.rgb}" aria-pressed=${_?"true":"false"} ?disabled=${a} @click=${()=>y(u.id)}>
              <span class="avatar" aria-hidden="true">${me(u.name)}</span>${u.name}
            </button>`})}
        </div>
        ${e.who.length>1?p`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${h(!e.take_turns,"Each does it",()=>this.changeDraft({take_turns:!1}))}
              ${h(e.take_turns,"They take turns",()=>this.changeDraft({take_turns:!0}))}
            </div>`:C}
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
      ${T}
      ${e.repeats==="school"?C:p`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Repeats</span>
          <span class="field-hint">${Dr(e.repeats,e.every)}</span>
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
            </button>`:C}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${a||!!l} @click=${()=>void this.saveChoreEdit()}>
          ${a?"Saving to Google Tasks…":l?l.replace(/\.$/,""):e.template?"Save":"Add this chore"}
        </button>
      </div>
    `}renderMenuEditor(e){let t=this.lunch;if(!t)return p``;let i=e.busy,o=h=>{this.menuEdit&&(this.menuEdit={...this.menuEdit,...h})},a=h=>o({kids:e.kids.includes(h)?e.kids.filter(d=>d!==h):[...e.kids,h]}),r=t.kids.filter(h=>at(h,e.date)),l=e.dish.trim(),c=e.kids.length?l?null:"Type what’s served":"Pick who gets this menu";return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.had?"Change the menu":"Add a menu"}</span>
          <span class="ed-meta">${pe(e.date)}</span>
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
              <span class="avatar" aria-hidden="true">${me(h.name)}</span>${h.name}
            </button>`})}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${l||"…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${e.had?p`<button type="button" class="chip clear remove" ?disabled=${i||!e.kids.length} @click=${()=>void this.saveMenu(!0)}>
            Remove this day’s menu
          </button>`:C}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${i||!!c} @click=${()=>void this.saveMenu()}>
          ${i?"Saving to Google Calendar…":c??"Save"}
        </button>
      </div>
    `}renderWhoDidIt(e){let t=this.chores;if(!t)return p``;let i=t.people?.length?t.people:t.kids.map(d=>({...d,role:"kid"})),o=t.kids.findIndex(d=>d.id===e.kid),a=t.kids[o],r=this.plan?ce(this.plan):void 0,l=r?.get(e.kid)??J(Math.max(0,o)),c=i.filter(d=>d.id!==e.kid),h=d=>{let f=t.kids.findIndex(y=>y.id===d.id);return f>=0?(r?.get(d.id)??J(f)).color:"var(--dark)"};return p`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${e.icon?p`<span class="ed-icon" aria-hidden="true">${e.icon}</span>`:C}${e.title}</span>
          <span class="ed-meta">${a?.name??""} · ${vn(e,t.today,t.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${()=>this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${l.color};--rgb:${l.rgb}" @click=${()=>void this.toggleChore(e)}>
          <span class="avatar" aria-hidden="true">${me(a?.name??"?")}</span>
          <span>${a?.name??"Done"} did it</span>
        </button>
        ${this.whoOthers?p`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${c.map(d=>p`<button type="button" class="done-by" style="--c:${h(d)}" @click=${()=>void this.toggleChore(e,d.id)}>
                  <span class="avatar ${d.role==="parent"?"driver":""}" aria-hidden="true">${me(d.name)}</span>
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
    </div>`}renderEditor(e){let t=this.findEvent(this.sel);if(!t)return p``;let{day:i,event:o}=t,a=_e(e),l=ce(e).get(o.kid)??J(0),c=!!this.pending,h=k=>this.pending?.key===k?this.pending.value:void 0,d=[...e.people?.carpools??[]];for(let k of e.days)for(let P of k.events)for(let R of[P.drop,P.pick])R&&R!=="none"&&!a.includes(R)&&!d.some(O=>O.toLowerCase()===R.toLowerCase())&&d.push(R);let f=k=>{if(!o.sides.includes(k))return C;let P=h(k),R=P!==void 0?String(P):k==="drop"?o.drop:o.pick,O=R&&R!=="none"&&!a.includes(R)?R:"",H=L=>this.setRide(o,k,R===L?"":L),D=[...a.map(L=>[L,un(e,L)]),["none","Not needed"]];return p`<div class="field">
        <span class="field-label">${k==="drop"?"Drop-off":"Pick-up"} ${R===""?p`<span class="nobody">· nobody yet</span>`:C}</span>
        <div role="group" aria-label=${k==="drop"?"Drop-off driver":"Pick-up driver"} class="choices" style="grid-template-columns:repeat(${D.length}, minmax(0, 1fr))">
          ${D.map(([L,F])=>p`<button type="button" class="choice" aria-pressed=${R===L?"true":"false"} ?disabled=${c} @click=${()=>H(L)}>
                ${F}
              </button>`)}
        </div>
        ${d.length?p`<div role="group" aria-label=${k==="drop"?"Drop-off: someone else":"Pick-up: someone else"} class="chips">
              ${d.map(L=>p`<button type="button" class="chip" aria-pressed=${R.toLowerCase()===L.toLowerCase()?"true":"false"} ?disabled=${c} @click=${()=>H(L)}>
                    ${L}
                  </button>`)}
            </div>`:C}
        <input
          type="text"
          .value=${O&&!d.some(L=>L.toLowerCase()===O.toLowerCase())?O:""}
          ?disabled=${c}
          aria-label=${k==="drop"?"Drop-off by someone else":"Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${L=>{let F=L.target.value.trim();F&&F!==R&&this.setRide(o,k,F)}}
          @keydown=${L=>{L.key==="Enter"&&L.target.blur()}}
        />
      </div>`},y=h("stay"),T=y!==void 0?!!y:o.stay,u=o.drop===o.pick&&a.includes(o.drop),w=h("along"),E=w!==void 0?w:o.along,_=ze(e).filter(k=>k!==o.kid),U=a.includes(o.drop)&&o.sides.includes("drop"),X=h("arrive"),N=this.arriveDraft!==void 0?this.arriveDraft:X!==void 0?X:o.arrive_by,Q=[],m=k=>k==="none"?"Not needed":un(e,k);o.drop!==""&&Q.push(`Drop-off: ${m(o.drop)}`),o.pick!==""&&Q.push(`Pick-up: ${m(o.pick)}`),o.stay&&Q.push("Stay: yes"),o.along.length&&Q.push(`Take along: ${o.along.map(k=>de(e,k)).join(", ")}`),o.arrive_by!=null&&Q.push(`Arrive by: ${Ze(o.arrive_by)}`);let $=h("attending"),g=$!==void 0?!!$:o.attending!==!1;o.attending===!1&&Q.splice(0,Q.length,"Attending: no");let x=i.date===this.today().date?"":`${ae(i.date)} · `,v=p`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${l.color}"></span>${de(e,o.kid)} · ${o.title}</span>
          <span class="ed-meta">${x}${I(o.start)}–${I(o.end)}${o.place_name&&!o.place.startsWith("?")?` · ${o.place_name}`:""}</span>
        </div>
        <button type="button" class="btn dark" @click=${()=>this.closeEditor()}>Done</button>
      </div>`;return o.where==="home"?p`${v}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${de(e,o.kid)} can’t get home in time, the board shows it as a clash.</p>`:p`
      ${v}
      ${this.pending?p`<p class="saving" role="status">Saving to Google Calendar…</p>`:C}
      ${o.recurring?p`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope==="this"?"true":"false"} @click=${()=>this.scope="this"}>
                Just ${ae(i.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope==="series"?"true":"false"} @click=${()=>this.scope="series"}>
                Every time
              </button>
            </div>
          </div>`:C}
      <div class="field">
        <span class="field-label">${de(e,o.kid)} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${g?"true":"false"} ?disabled=${c} @click=${()=>this.setAttending(o,!0)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${g?"false":"true"} ?disabled=${c} @click=${()=>this.setAttending(o,!1)}>
            Not attending
          </button>
        </div>
      </div>
      ${g?p`${o.where==="anywhere"?p`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`:C}
            ${f("drop")} ${f("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${T?"true":"false"} ?disabled=${!u||c} @click=${()=>this.toggleStay(o)}>
          ${u?T?"Driver stays the whole time":"Driver leaves and comes back":"Staying needs the same driver both ways"}
        </button>
      </div>
      ${U&&_.length?p`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${_.map(k=>p`<button type="button" class="chip" aria-pressed=${E.includes(k)?"true":"false"} ?disabled=${c} @click=${()=>this.toggleAlong(o,k)}>
                  ${de(e,k)}
                </button>`)}
            </div>
          </div>`:C}
      <div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${N!=null?`${o.start-N} min before it starts`:`Aims for a few minutes before ${I(o.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${c} @click=${()=>this.nudgeArrive(o,-5)}>−</button>
          <span class="arrive-value">${N!=null?I(N):"Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${c||N==null} @click=${()=>this.nudgeArrive(o,5)}>+</button>
        </span>
      </div>
      ${N!=null?p`<button type="button" class="chip clear" ?disabled=${c} @click=${()=>this.clearArrive()}>Clear arrive-by time</button>`:C}
`:p`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves===!1?"Would be saved":"Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${Q.length?Q.join(`
`):"(no ride lines yet)"}</span>
      </div>
      ${o.problems.length?p`<p class="field-hint bad">These lines in the notes couldn’t be read: ${o.problems.join("; ")}</p>`:C}
      ${g?p`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`:C}
    `}};ct.styles=ti,ct.properties={backend:{attribute:!1},kiosk:{type:Boolean},showMenu:{type:Boolean,attribute:"show-menu"},plan:{state:!0},error:{state:!0},mode:{state:!0},sel:{state:!0},sheet:{state:!0},width:{state:!0},boardWidth:{state:!0},pending:{state:!0},toast:{state:!0},scope:{state:!0},arriveDraft:{state:!0},tick:{state:!0},page:{state:!0},chores:{state:!0},choreDraft:{state:!0},manage:{state:!0},choreEdit:{state:!0},choreBusy:{state:!0},removeArmed:{state:!0},whoFor:{state:!0},whoOthers:{state:!0},lunch:{state:!0},lunchDraft:{state:!0},lunchMonth:{state:!0},lunchKid:{state:!0},menuMode:{state:!0},menuEdit:{state:!0}};customElements.get("mydashlight-board")||customElements.define("mydashlight-board",ct);function Ir(){let s=[document];for(let n of document.querySelectorAll("*"))n.shadowRoot&&s.push(n.shadowRoot);return s}function oi(s=3e3){let n=new CSSStyleSheet;n.replaceSync("*, *::before, *::after { cursor: none !important; }"),n.disabled=!0;let e,t=o=>{if(o)for(let a of Ir())a.adoptedStyleSheets.includes(n)||(a.adoptedStyleSheets=[...a.adoptedStyleSheets,n]);n.disabled=!o},i=o=>{if(clearTimeout(e),o.pointerType==="touch"){t(!0);return}t(!1),e=setTimeout(()=>t(!0),s)};window.addEventListener("pointermove",i,{passive:!0}),window.addEventListener("pointerdown",i,{passive:!0}),e=setTimeout(()=>t(!0),s)}var ai=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["layout",",","space",".","done"]],li=[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","&","@","'",'"'],["#","+","=","?","!","%","*","backspace"],["layout",",","space",".","done"]];function di(s,n,e,t){let i=Math.max(0,Math.min(n,s.length)),o=Math.max(i,Math.min(e,s.length));return{value:s.slice(0,i)+t+s.slice(o),caret:i+t.length}}function ci(s,n,e){let t=Math.max(0,Math.min(n,s.length)),i=Math.max(t,Math.min(e,s.length));if(t!==i)return{value:s.slice(0,t)+s.slice(i),caret:t};if(t===0)return{value:s,caret:0};let o=Array.from(s.slice(0,t));o.pop();let a=o.join("");return{value:a+s.slice(t),caret:a.length}}function hi(s,n){return n===0||/\s$/.test(s.slice(0,n))}var Or=new Set(["text","search","email","url","tel","number","password"]);function pi(s){return s instanceof HTMLTextAreaElement?!s.readOnly&&!s.disabled:s instanceof HTMLInputElement&&Or.has(s.type)&&!s.readOnly&&!s.disabled}var zr={shift:"⇧",backspace:"⌫",space:"space",done:"Done"},Ur={shift:"Shift",backspace:"Delete",space:"Space",done:"Done",layout:"Switch letters and symbols",hide:"Hide keyboard"},ht=class extends he{constructor(){super();this.field=null;this.committed="";this.typed=!1;this.shiftLocked=!1;this.onNativeChange=()=>{this.field&&(this.committed=this.field.value),this.typed=!1};this.layout="letters",this.shift=!1,this.hidden=!0;let e=t=>t.preventDefault();this.addEventListener("mousedown",e),this.addEventListener("pointerdown",e)}get target(){return this.field}attach(e){this.field!==e&&(this.detach(),this.field=e,this.committed=e.value,this.typed=!1,this.layout=e instanceof HTMLInputElement&&(e.type==="number"||e.type==="tel")?"symbols":"letters",e.addEventListener("change",this.onNativeChange),this.hidden=!1,this.refreshShift(),this.updateComplete.then(()=>{document.documentElement.style.setProperty("--keyboard-height",`${this.offsetHeight}px`),requestAnimationFrame(()=>e.scrollIntoView({block:"nearest",inline:"nearest"}))}))}detach(){let e=this.field;e&&(this.commit(),e.removeEventListener("change",this.onNativeChange),this.field=null,this.hidden=!0,document.documentElement.style.removeProperty("--keyboard-height"))}commit(){let e=this.field;!e||!this.typed||e.value===this.committed||(this.committed=e.value,this.typed=!1,e.dispatchEvent(new Event("change",{bubbles:!0})))}selection(e){try{let t=e.selectionStart,i=e.selectionEnd;if(t!==null&&i!==null)return[t,i]}catch{}return[e.value.length,e.value.length]}apply(e,t,i){e.value=t;try{e.setSelectionRange(i,i)}catch{}this.typed=!0,e.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))}refreshShift(){if(this.shiftLocked||!this.field||this.layout!=="letters")return;let[e]=this.selection(this.field);this.shift=hi(this.field.value,e)}press(e){let t=this.field;if(t){switch(e){case"hide":t.blur();return;case"done":this.commit(),t.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0,composed:!0})),t.blur();return;case"shift":this.shiftLocked=!this.shift,this.shift=!this.shift;return;case"layout":this.layout=this.layout==="letters"?"symbols":"letters",this.shiftLocked=!1,this.refreshShift();return;case"backspace":{let[i,o]=this.selection(t),a=ci(t.value,i,o);this.apply(t,a.value,a.caret);break}default:{let i=e==="space"?" ":this.shift?e.toUpperCase():e,[o,a]=this.selection(t),r=di(t.value,o,a,i);this.apply(t,r.value,r.caret),this.shiftLocked=!1}}this.refreshShift()}}key(e){let t=e.length>1,i=e==="layout"?this.layout==="letters"?"123":"ABC":zr[e]??(this.shift?e.toUpperCase():e);return p`<button
      type="button"
      tabindex="-1"
      class=${e==="space"?"space":e==="done"?"done":t?"wide":""}
      aria-label=${Ur[e]??i}
      aria-pressed=${e==="shift"?String(this.shift):C}
      @click=${()=>this.press(e)}
    >
      ${i}
    </button>`}render(){let e=this.layout==="letters"?ai:li;return p`<div class="top">
        <button type="button" tabindex="-1" @click=${()=>this.press("hide")}>Hide keyboard ⌄</button>
      </div>
      <div class="rows" role="group" aria-label="On-screen keyboard">
        ${e.map(t=>p`<div class="row">${t.map(i=>this.key(i))}</div>`)}
      </div>`}};ht.styles=De`
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
  `,ht.properties={layout:{state:!0},shift:{state:!0}};customElements.get("mydashlight-keyboard")||customElements.define("mydashlight-keyboard",ht);function Hr(){let s=document.activeElement;for(;s?.shadowRoot?.activeElement;)s=s.shadowRoot.activeElement;return s}function ui(s){let n=new WeakSet,e=a=>{let r=a.composedPath();o(r);let l=r[0];pi(l)&&s.attach(l)},t=()=>{setTimeout(()=>{let a=Hr();!s.target||a===s.target||(pi(a)?s.attach(a):s.detach())},0)},i=a=>{n.has(a)||(n.add(a),a.addEventListener("focusin",e),a.addEventListener("focusout",t))},o=a=>{for(let r of a)r instanceof ShadowRoot&&i(r)};i(document),document.addEventListener("pointerdown",a=>o(a.composedPath()),{capture:!0}),setInterval(()=>{s.target&&!s.target.isConnected&&s.detach()},1e3)}var Pn="mydashlight",jr=`/api/${Pn}/pair`,qr=`/api/${Pn}/pair/poll`,Sn=`/${Pn}`,Dn="pair";function fi(s){return s.length>4?`${s.slice(0,4)}-${s.slice(4)}`:s}function gi(s,n){return`${s}${Sn}?${Dn}=${encodeURIComponent(n)}`}function Kr(s,n,e=Date.now()){return{hassUrl:s,clientId:n.client_id,access_token:n.access_token,refresh_token:n.refresh_token,expires_in:n.expires_in,expires:e+n.expires_in*1e3}}var je=class extends Error{constructor(n,e=!1){super(n),this.busy=e}};async function mi(s=fetch){let n=await s(jr,{method:"POST",cache:"no-store"});if(n.status===429)throw new je("Too many screens are asking to pair right now.",!0);if(!n.ok)throw new je(`Home Assistant answered ${n.status}.`);return await n.json()}async function bi(s,n,e=fetch){let t=await e(qr,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:s})});if(t.status===404)return{status:"expired"};if(!t.ok)throw new je(`Home Assistant answered ${t.status}.`);let i=await t.json();return i.status==="paired"&&i.auth?{status:"paired",auth:Kr(n,i.auth)}:{status:"pending"}}var Ye=function(s,n){let i=s,o=pt[n],a=null,r=0,l=null,c=[],h={},d=function(m,$){r=i*4+17,a=(function(g){let x=new Array(g);for(let v=0;v<g;v+=1){x[v]=new Array(g);for(let k=0;k<g;k+=1)x[v][k]=null}return x})(r),f(0,0),f(r-7,0),f(0,r-7),u(),T(),E(m,$),i>=7&&w(m),l==null&&(l=X(i,o,c)),_(l,$)},f=function(m,$){for(let g=-1;g<=7;g+=1)if(!(m+g<=-1||r<=m+g))for(let x=-1;x<=7;x+=1)$+x<=-1||r<=$+x||(0<=g&&g<=6&&(x==0||x==6)||0<=x&&x<=6&&(g==0||g==6)||2<=g&&g<=4&&2<=x&&x<=4?a[m+g][$+x]=!0:a[m+g][$+x]=!1)},y=function(){let m=0,$=0;for(let g=0;g<8;g+=1){d(!0,g);let x=Ae.getLostPoint(h);(g==0||m>x)&&(m=x,$=g)}return $},T=function(){for(let m=8;m<r-8;m+=1)a[m][6]==null&&(a[m][6]=m%2==0);for(let m=8;m<r-8;m+=1)a[6][m]==null&&(a[6][m]=m%2==0)},u=function(){let m=Ae.getPatternPosition(i);for(let $=0;$<m.length;$+=1)for(let g=0;g<m.length;g+=1){let x=m[$],v=m[g];if(a[x][v]==null)for(let k=-2;k<=2;k+=1)for(let P=-2;P<=2;P+=1)k==-2||k==2||P==-2||P==2||k==0&&P==0?a[x+k][v+P]=!0:a[x+k][v+P]=!1}},w=function(m){let $=Ae.getBCHTypeNumber(i);for(let g=0;g<18;g+=1){let x=!m&&($>>g&1)==1;a[Math.floor(g/3)][g%3+r-8-3]=x}for(let g=0;g<18;g+=1){let x=!m&&($>>g&1)==1;a[g%3+r-8-3][Math.floor(g/3)]=x}},E=function(m,$){let g=o<<3|$,x=Ae.getBCHTypeInfo(g);for(let v=0;v<15;v+=1){let k=!m&&(x>>v&1)==1;v<6?a[v][8]=k:v<8?a[v+1][8]=k:a[r-15+v][8]=k}for(let v=0;v<15;v+=1){let k=!m&&(x>>v&1)==1;v<8?a[8][r-v-1]=k:v<9?a[8][15-v-1+1]=k:a[8][15-v-1]=k}a[r-8][8]=!m},_=function(m,$){let g=-1,x=r-1,v=7,k=0,P=Ae.getMaskFunction($);for(let R=r-1;R>0;R-=2)for(R==6&&(R-=1);;){for(let O=0;O<2;O+=1)if(a[x][R-O]==null){let H=!1;k<m.length&&(H=(m[k]>>>v&1)==1),P(x,R-O)&&(H=!H),a[x][R-O]=H,v-=1,v==-1&&(k+=1,v=7)}if(x+=g,x<0||r<=x){x-=g,g=-g;break}}},U=function(m,$){let g=0,x=0,v=0,k=new Array($.length),P=new Array($.length);for(let D=0;D<$.length;D+=1){let L=$[D].dataCount,F=$[D].totalCount-L;x=Math.max(x,L),v=Math.max(v,F),k[D]=new Array(L);for(let S=0;S<k[D].length;S+=1)k[D][S]=255&m.getBuffer()[S+g];g+=L;let be=Ae.getErrorCorrectPolynomial(F),B=ut(k[D],be.getLength()-1).mod(be);P[D]=new Array(be.getLength()-1);for(let S=0;S<P[D].length;S+=1){let z=S+B.getLength()-P[D].length;P[D][S]=z>=0?B.getAt(z):0}}let R=0;for(let D=0;D<$.length;D+=1)R+=$[D].totalCount;let O=new Array(R),H=0;for(let D=0;D<x;D+=1)for(let L=0;L<$.length;L+=1)D<k[L].length&&(O[H]=k[L][D],H+=1);for(let D=0;D<v;D+=1)for(let L=0;L<$.length;L+=1)D<P[L].length&&(O[H]=P[L][D],H+=1);return O},X=function(m,$,g){let x=xi.getRSBlocks(m,$),v=vi();for(let P=0;P<g.length;P+=1){let R=g[P];v.put(R.getMode(),4),v.put(R.getLength(),Ae.getLengthInBits(R.getMode(),m)),R.write(v)}let k=0;for(let P=0;P<x.length;P+=1)k+=x[P].dataCount;if(v.getLengthInBits()>k*8)throw"code length overflow. ("+v.getLengthInBits()+">"+k*8+")";for(v.getLengthInBits()+4<=k*8&&v.put(0,4);v.getLengthInBits()%8!=0;)v.putBit(!1);for(;!(v.getLengthInBits()>=k*8||(v.put(236,8),v.getLengthInBits()>=k*8));)v.put(17,8);return U(v,x)};h.addData=function(m,$){$=$||"Byte";let g=null;switch($){case"Numeric":g=Fr(m);break;case"Alphanumeric":g=Wr(m);break;case"Byte":g=Vr(m);break;case"Kanji":g=Gr(m);break;default:throw"mode:"+$}c.push(g),l=null},h.isDark=function(m,$){if(m<0||r<=m||$<0||r<=$)throw m+","+$;return a[m][$]},h.getModuleCount=function(){return r},h.make=function(){if(i<1){let m=1;for(;m<40;m++){let $=xi.getRSBlocks(m,o),g=vi();for(let v=0;v<c.length;v++){let k=c[v];g.put(k.getMode(),4),g.put(k.getLength(),Ae.getLengthInBits(k.getMode(),m)),k.write(g)}let x=0;for(let v=0;v<$.length;v++)x+=$[v].dataCount;if(g.getLengthInBits()<=x*8)break}i=m}d(!1,y())},h.createTableTag=function(m,$){m=m||2,$=typeof $>"u"?m*4:$;let g="";g+='<table style="',g+=" border-width: 0px; border-style: none;",g+=" border-collapse: collapse;",g+=" padding: 0px; margin: "+$+"px;",g+='">',g+="<tbody>";for(let x=0;x<h.getModuleCount();x+=1){g+="<tr>";for(let v=0;v<h.getModuleCount();v+=1)g+='<td style="',g+=" border-width: 0px; border-style: none;",g+=" border-collapse: collapse;",g+=" padding: 0px; margin: 0px;",g+=" width: "+m+"px;",g+=" height: "+m+"px;",g+=" background-color: ",g+=h.isDark(x,v)?"#000000":"#ffffff",g+=";",g+='"/>';g+="</tr>"}return g+="</tbody>",g+="</table>",g},h.createSvgTag=function(m,$,g,x){let v={};typeof arguments[0]=="object"&&(v=arguments[0],m=v.cellSize,$=v.margin,g=v.alt,x=v.title),m=m||2,$=typeof $>"u"?m*4:$,g=typeof g=="string"?{text:g}:g||{},g.text=g.text||null,g.id=g.text?g.id||"qrcode-description":null,x=typeof x=="string"?{text:x}:x||{},x.text=x.text||null,x.id=x.text?x.id||"qrcode-title":null;let k=h.getModuleCount()*m+$*2,P,R,O,H,D="",L;for(L="l"+m+",0 0,"+m+" -"+m+",0 0,-"+m+"z ",D+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',D+=v.scalable?"":' width="'+k+'px" height="'+k+'px"',D+=' viewBox="0 0 '+k+" "+k+'" ',D+=' preserveAspectRatio="xMinYMin meet"',D+=x.text||g.text?' role="img" aria-labelledby="'+N([x.id,g.id].join(" ").trim())+'"':"",D+=">",D+=x.text?'<title id="'+N(x.id)+'">'+N(x.text)+"</title>":"",D+=g.text?'<description id="'+N(g.id)+'">'+N(g.text)+"</description>":"",D+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',D+='<path d="',O=0;O<h.getModuleCount();O+=1)for(H=O*m+$,P=0;P<h.getModuleCount();P+=1)h.isDark(O,P)&&(R=P*m+$,D+="M"+R+","+H+L);return D+='" stroke="transparent" fill="black"/>',D+="</svg>",D},h.createDataURL=function(m,$){m=m||2,$=typeof $>"u"?m*4:$;let g=h.getModuleCount()*m+$*2,x=$,v=g-$;return Zr(g,g,function(k,P){if(x<=k&&k<v&&x<=P&&P<v){let R=Math.floor((k-x)/m),O=Math.floor((P-x)/m);return h.isDark(O,R)?0:1}else return 1})},h.createImgTag=function(m,$,g){m=m||2,$=typeof $>"u"?m*4:$;let x=h.getModuleCount()*m+$*2,v="";return v+="<img",v+=' src="',v+=h.createDataURL(m,$),v+='"',v+=' width="',v+=x,v+='"',v+=' height="',v+=x,v+='"',g&&(v+=' alt="',v+=N(g),v+='"'),v+="/>",v};let N=function(m){let $="";for(let g=0;g<m.length;g+=1){let x=m.charAt(g);switch(x){case"<":$+="&lt;";break;case">":$+="&gt;";break;case"&":$+="&amp;";break;case'"':$+="&quot;";break;default:$+=x;break}}return $},Q=function(m){m=typeof m>"u"?2:m;let g=h.getModuleCount()*1+m*2,x=m,v=g-m,k,P,R,O,H,D={"██":"█","█ ":"▀"," █":"▄","  ":" "},L={"██":"▀","█ ":"▀"," █":" ","  ":" "},F="";for(k=0;k<g;k+=2){for(R=Math.floor((k-x)/1),O=Math.floor((k+1-x)/1),P=0;P<g;P+=1)H="█",x<=P&&P<v&&x<=k&&k<v&&h.isDark(R,Math.floor((P-x)/1))&&(H=" "),x<=P&&P<v&&x<=k+1&&k+1<v&&h.isDark(O,Math.floor((P-x)/1))?H+=" ":H+="█",F+=m<1&&k+1>=v?L[H]:D[H];F+=`
`}return g%2&&m>0?F.substring(0,F.length-g-1)+Array(g+1).join("▀"):F.substring(0,F.length-1)};return h.createASCII=function(m,$){if(m=m||1,m<2)return Q($);m-=1,$=typeof $>"u"?m*2:$;let g=h.getModuleCount()*m+$*2,x=$,v=g-$,k,P,R,O,H=Array(m+1).join("██"),D=Array(m+1).join("  "),L="",F="";for(k=0;k<g;k+=1){for(R=Math.floor((k-x)/m),F="",P=0;P<g;P+=1)O=1,x<=P&&P<v&&x<=k&&k<v&&h.isDark(R,Math.floor((P-x)/m))&&(O=0),F+=O?H:D;for(R=0;R<m;R+=1)L+=F+`
`}return L.substring(0,L.length-1)},h.renderTo2dContext=function(m,$){$=$||2;let g=h.getModuleCount();for(let x=0;x<g;x++)for(let v=0;v<g;v++)m.fillStyle=h.isDark(x,v)?"black":"white",m.fillRect(v*$,x*$,$,$)},h};Ye.stringToBytes=function(s){let n=[];for(let e=0;e<s.length;e+=1){let t=s.charCodeAt(e);n.push(t&255)}return n};Ye.createStringToBytes=function(s,n){let e=(function(){let i=Jr(s),o=function(){let l=i.read();if(l==-1)throw"eof";return l},a=0,r={};for(;;){let l=i.read();if(l==-1)break;let c=o(),h=o(),d=o(),f=String.fromCharCode(l<<8|c),y=h<<8|d;r[f]=y,a+=1}if(a!=n)throw a+" != "+n;return r})(),t=63;return function(i){let o=[];for(let a=0;a<i.length;a+=1){let r=i.charCodeAt(a);if(r<128)o.push(r);else{let l=e[i.charAt(a)];typeof l=="number"?(l&255)==l?o.push(l):(o.push(l>>>8),o.push(l&255)):o.push(t)}}return o}};var ie={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},pt={L:1,M:0,Q:3,H:2},Te={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},Ae=(function(){let s=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,e=7973,t=21522,i={},o=function(a){let r=0;for(;a!=0;)r+=1,a>>>=1;return r};return i.getBCHTypeInfo=function(a){let r=a<<10;for(;o(r)-o(n)>=0;)r^=n<<o(r)-o(n);return(a<<10|r)^t},i.getBCHTypeNumber=function(a){let r=a<<12;for(;o(r)-o(e)>=0;)r^=e<<o(r)-o(e);return a<<12|r},i.getPatternPosition=function(a){return s[a-1]},i.getMaskFunction=function(a){switch(a){case Te.PATTERN000:return function(r,l){return(r+l)%2==0};case Te.PATTERN001:return function(r,l){return r%2==0};case Te.PATTERN010:return function(r,l){return l%3==0};case Te.PATTERN011:return function(r,l){return(r+l)%3==0};case Te.PATTERN100:return function(r,l){return(Math.floor(r/2)+Math.floor(l/3))%2==0};case Te.PATTERN101:return function(r,l){return r*l%2+r*l%3==0};case Te.PATTERN110:return function(r,l){return(r*l%2+r*l%3)%2==0};case Te.PATTERN111:return function(r,l){return(r*l%3+(r+l)%2)%2==0};default:throw"bad maskPattern:"+a}},i.getErrorCorrectPolynomial=function(a){let r=ut([1],0);for(let l=0;l<a;l+=1)r=r.multiply(ut([1,Ee.gexp(l)],0));return r},i.getLengthInBits=function(a,r){if(1<=r&&r<10)switch(a){case ie.MODE_NUMBER:return 10;case ie.MODE_ALPHA_NUM:return 9;case ie.MODE_8BIT_BYTE:return 8;case ie.MODE_KANJI:return 8;default:throw"mode:"+a}else if(r<27)switch(a){case ie.MODE_NUMBER:return 12;case ie.MODE_ALPHA_NUM:return 11;case ie.MODE_8BIT_BYTE:return 16;case ie.MODE_KANJI:return 10;default:throw"mode:"+a}else if(r<41)switch(a){case ie.MODE_NUMBER:return 14;case ie.MODE_ALPHA_NUM:return 13;case ie.MODE_8BIT_BYTE:return 16;case ie.MODE_KANJI:return 12;default:throw"mode:"+a}else throw"type:"+r},i.getLostPoint=function(a){let r=a.getModuleCount(),l=0;for(let d=0;d<r;d+=1)for(let f=0;f<r;f+=1){let y=0,T=a.isDark(d,f);for(let u=-1;u<=1;u+=1)if(!(d+u<0||r<=d+u))for(let w=-1;w<=1;w+=1)f+w<0||r<=f+w||u==0&&w==0||T==a.isDark(d+u,f+w)&&(y+=1);y>5&&(l+=3+y-5)}for(let d=0;d<r-1;d+=1)for(let f=0;f<r-1;f+=1){let y=0;a.isDark(d,f)&&(y+=1),a.isDark(d+1,f)&&(y+=1),a.isDark(d,f+1)&&(y+=1),a.isDark(d+1,f+1)&&(y+=1),(y==0||y==4)&&(l+=3)}for(let d=0;d<r;d+=1)for(let f=0;f<r-6;f+=1)a.isDark(d,f)&&!a.isDark(d,f+1)&&a.isDark(d,f+2)&&a.isDark(d,f+3)&&a.isDark(d,f+4)&&!a.isDark(d,f+5)&&a.isDark(d,f+6)&&(l+=40);for(let d=0;d<r;d+=1)for(let f=0;f<r-6;f+=1)a.isDark(f,d)&&!a.isDark(f+1,d)&&a.isDark(f+2,d)&&a.isDark(f+3,d)&&a.isDark(f+4,d)&&!a.isDark(f+5,d)&&a.isDark(f+6,d)&&(l+=40);let c=0;for(let d=0;d<r;d+=1)for(let f=0;f<r;f+=1)a.isDark(f,d)&&(c+=1);let h=Math.abs(100*c/r/r-50)/5;return l+=h*10,l},i})(),Ee=(function(){let s=new Array(256),n=new Array(256);for(let t=0;t<8;t+=1)s[t]=1<<t;for(let t=8;t<256;t+=1)s[t]=s[t-4]^s[t-5]^s[t-6]^s[t-8];for(let t=0;t<255;t+=1)n[s[t]]=t;let e={};return e.glog=function(t){if(t<1)throw"glog("+t+")";return n[t]},e.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return s[t]},e})(),ut=function(s,n){if(typeof s.length>"u")throw s.length+"/"+n;let e=(function(){let i=0;for(;i<s.length&&s[i]==0;)i+=1;let o=new Array(s.length-i+n);for(let a=0;a<s.length-i;a+=1)o[a]=s[a+i];return o})(),t={};return t.getAt=function(i){return e[i]},t.getLength=function(){return e.length},t.multiply=function(i){let o=new Array(t.getLength()+i.getLength()-1);for(let a=0;a<t.getLength();a+=1)for(let r=0;r<i.getLength();r+=1)o[a+r]^=Ee.gexp(Ee.glog(t.getAt(a))+Ee.glog(i.getAt(r)));return ut(o,0)},t.mod=function(i){if(t.getLength()-i.getLength()<0)return t;let o=Ee.glog(t.getAt(0))-Ee.glog(i.getAt(0)),a=new Array(t.getLength());for(let r=0;r<t.getLength();r+=1)a[r]=t.getAt(r);for(let r=0;r<i.getLength();r+=1)a[r]^=Ee.gexp(Ee.glog(i.getAt(r))+o);return ut(a,0).mod(i)},t},xi=(function(){let s=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],n=function(i,o){let a={};return a.totalCount=i,a.dataCount=o,a},e={},t=function(i,o){switch(o){case pt.L:return s[(i-1)*4+0];case pt.M:return s[(i-1)*4+1];case pt.Q:return s[(i-1)*4+2];case pt.H:return s[(i-1)*4+3];default:return}};return e.getRSBlocks=function(i,o){let a=t(i,o);if(typeof a>"u")throw"bad rs block @ typeNumber:"+i+"/errorCorrectionLevel:"+o;let r=a.length/3,l=[];for(let c=0;c<r;c+=1){let h=a[c*3+0],d=a[c*3+1],f=a[c*3+2];for(let y=0;y<h;y+=1)l.push(n(d,f))}return l},e})(),vi=function(){let s=[],n=0,e={};return e.getBuffer=function(){return s},e.getAt=function(t){let i=Math.floor(t/8);return(s[i]>>>7-t%8&1)==1},e.put=function(t,i){for(let o=0;o<i;o+=1)e.putBit((t>>>i-o-1&1)==1)},e.getLengthInBits=function(){return n},e.putBit=function(t){let i=Math.floor(n/8);s.length<=i&&s.push(0),t&&(s[i]|=128>>>n%8),n+=1},e},Fr=function(s){let n=ie.MODE_NUMBER,e=s,t={};t.getMode=function(){return n},t.getLength=function(a){return e.length},t.write=function(a){let r=e,l=0;for(;l+2<r.length;)a.put(i(r.substring(l,l+3)),10),l+=3;l<r.length&&(r.length-l==1?a.put(i(r.substring(l,l+1)),4):r.length-l==2&&a.put(i(r.substring(l,l+2)),7))};let i=function(a){let r=0;for(let l=0;l<a.length;l+=1)r=r*10+o(a.charAt(l));return r},o=function(a){if("0"<=a&&a<="9")return a.charCodeAt(0)-48;throw"illegal char :"+a};return t},Wr=function(s){let n=ie.MODE_ALPHA_NUM,e=s,t={};t.getMode=function(){return n},t.getLength=function(o){return e.length},t.write=function(o){let a=e,r=0;for(;r+1<a.length;)o.put(i(a.charAt(r))*45+i(a.charAt(r+1)),11),r+=2;r<a.length&&o.put(i(a.charAt(r)),6)};let i=function(o){if("0"<=o&&o<="9")return o.charCodeAt(0)-48;if("A"<=o&&o<="Z")return o.charCodeAt(0)-65+10;switch(o){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+o}};return t},Vr=function(s){let n=ie.MODE_8BIT_BYTE,e=s,t=Ye.stringToBytes(s),i={};return i.getMode=function(){return n},i.getLength=function(o){return t.length},i.write=function(o){for(let a=0;a<t.length;a+=1)o.put(t[a],8)},i},Gr=function(s){let n=ie.MODE_KANJI,e=s,t=Ye.stringToBytes;(function(a,r){let l=t(a);if(l.length!=2||(l[0]<<8|l[1])!=r)throw"sjis not supported."})("友",38726);let i=t(s),o={};return o.getMode=function(){return n},o.getLength=function(a){return~~(i.length/2)},o.write=function(a){let r=i,l=0;for(;l+1<r.length;){let c=(255&r[l])<<8|255&r[l+1];if(33088<=c&&c<=40956)c-=33088;else if(57408<=c&&c<=60351)c-=49472;else throw"illegal char at "+(l+1)+"/"+c;c=(c>>>8&255)*192+(c&255),a.put(c,13),l+=2}if(l<r.length)throw"illegal char at "+(l+1)},o},yi=function(){let s=[],n={};return n.writeByte=function(e){s.push(e&255)},n.writeShort=function(e){n.writeByte(e),n.writeByte(e>>>8)},n.writeBytes=function(e,t,i){t=t||0,i=i||e.length;for(let o=0;o<i;o+=1)n.writeByte(e[o+t])},n.writeString=function(e){for(let t=0;t<e.length;t+=1)n.writeByte(e.charCodeAt(t))},n.toByteArray=function(){return s},n.toString=function(){let e="";e+="[";for(let t=0;t<s.length;t+=1)t>0&&(e+=","),e+=s[t];return e+="]",e},n},Yr=function(){let s=0,n=0,e=0,t="",i={},o=function(r){t+=String.fromCharCode(a(r&63))},a=function(r){if(r<0)throw"n:"+r;if(r<26)return 65+r;if(r<52)return 97+(r-26);if(r<62)return 48+(r-52);if(r==62)return 43;if(r==63)return 47;throw"n:"+r};return i.writeByte=function(r){for(s=s<<8|r&255,n+=8,e+=1;n>=6;)o(s>>>n-6),n-=6},i.flush=function(){if(n>0&&(o(s<<6-n),s=0,n=0),e%3!=0){let r=3-e%3;for(let l=0;l<r;l+=1)t+="="}},i.toString=function(){return t},i},Jr=function(s){let n=s,e=0,t=0,i=0,o={};o.read=function(){for(;i<8;){if(e>=n.length){if(i==0)return-1;throw"unexpected end of file./"+i}let l=n.charAt(e);if(e+=1,l=="=")return i=0,-1;if(l.match(/^\s$/))continue;t=t<<6|a(l.charCodeAt(0)),i+=6}let r=t>>>i-8&255;return i-=8,r};let a=function(r){if(65<=r&&r<=90)return r-65;if(97<=r&&r<=122)return r-97+26;if(48<=r&&r<=57)return r-48+52;if(r==43)return 62;if(r==47)return 63;throw"c:"+r};return o},Qr=function(s,n){let e=s,t=n,i=new Array(s*n),o={};o.setPixel=function(c,h,d){i[h*e+c]=d},o.write=function(c){c.writeString("GIF87a"),c.writeShort(e),c.writeShort(t),c.writeByte(128),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(0),c.writeByte(255),c.writeByte(255),c.writeByte(255),c.writeString(","),c.writeShort(0),c.writeShort(0),c.writeShort(e),c.writeShort(t),c.writeByte(0);let h=2,d=r(h);c.writeByte(h);let f=0;for(;d.length-f>255;)c.writeByte(255),c.writeBytes(d,f,255),f+=255;c.writeByte(d.length-f),c.writeBytes(d,f,d.length-f),c.writeByte(0),c.writeString(";")};let a=function(c){let h=c,d=0,f=0,y={};return y.write=function(T,u){if(T>>>u)throw"length over";for(;d+u>=8;)h.writeByte(255&(T<<d|f)),u-=8-d,T>>>=8-d,f=0,d=0;f=T<<d|f,d=d+u},y.flush=function(){d>0&&h.writeByte(f)},y},r=function(c){let h=1<<c,d=(1<<c)+1,f=c+1,y=l();for(let _=0;_<h;_+=1)y.add(String.fromCharCode(_));y.add(String.fromCharCode(h)),y.add(String.fromCharCode(d));let T=yi(),u=a(T);u.write(h,f);let w=0,E=String.fromCharCode(i[w]);for(w+=1;w<i.length;){let _=String.fromCharCode(i[w]);w+=1,y.contains(E+_)?E=E+_:(u.write(y.indexOf(E),f),y.size()<4095&&(y.size()==1<<f&&(f+=1),y.add(E+_)),E=_)}return u.write(y.indexOf(E),f),u.write(d,f),u.flush(),T.toByteArray()},l=function(){let c={},h=0,d={};return d.add=function(f){if(d.contains(f))throw"dup key:"+f;c[f]=h,h+=1},d.size=function(){return h},d.indexOf=function(f){return c[f]},d.contains=function(f){return typeof c[f]<"u"},d};return o},Zr=function(s,n,e){let t=Qr(s,n);for(let r=0;r<n;r+=1)for(let l=0;l<s;l+=1)t.setPixel(l,r,e(l,r));let i=yi();t.write(i);let o=Yr(),a=i.toByteArray();for(let r=0;r<a.length;r+=1)o.writeByte(a[r]);return o.flush(),"data:image/gif;base64,"+o},wi=Ye,Sa=Ye.stringToBytes;function $i(s){let n=wi(0,"M");n.addData(s),n.make();let e=n.getModuleCount(),t="";for(let i=0;i<e;i++)for(let o=0;o<e;o++)n.isDark(i,o)&&(t+=`M${o} ${i}h1v1h-1z`);return{size:e,d:t}}var Xr=1e4,ft=class extends he{constructor(){super();this.secret=null;this.expiresAt=0;this.running=!1;this.code=null,this.problem=null,this.remaining=0}start(){this.running||(this.running=!0,this.hidden=!1,this.ticker=setInterval(()=>{this.remaining=Math.max(0,Math.round((this.expiresAt-Date.now())/1e3))},1e3),this.newCode())}stop(){this.running=!1,clearTimeout(this.timer),clearInterval(this.ticker),this.secret=null}disconnectedCallback(){super.disconnectedCallback(),this.stop()}later(e,t){clearTimeout(this.timer),this.running&&(this.timer=setTimeout(e,t))}async newCode(){try{let e=await mi();if(!this.running)return;this.code=e.code,this.secret=e.secret,this.expiresAt=Date.now()+e.expires_in*1e3,this.remaining=e.expires_in,this.problem=null,this.later(()=>void this.poll(e.interval*1e3),e.interval*1e3)}catch(e){this.code=null,this.problem=e instanceof je&&e.busy?"Too many screens are asking to pair. Trying again shortly.":"Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.newCode(),Xr)}}async poll(e){let t=this.secret;if(t)try{let i=await bi(t,location.origin);if(!this.running||t!==this.secret)return;if(this.problem=null,i.status==="paired"){this.stop(),this.dispatchEvent(new CustomEvent("paired",{detail:i.auth}));return}if(i.status==="expired"||Date.now()>=this.expiresAt){this.newCode();return}this.later(()=>void this.poll(e),e)}catch{this.problem="Can’t reach Home Assistant. Trying again shortly.",this.later(()=>void this.poll(e),Math.max(e,5e3))}}qr(){if(!this.code)return C;let{size:e,d:t}=$i(gi(location.origin,this.code));return p`<svg viewBox="0 0 ${e} ${e}" role="img" aria-label="QR code to approve this screen" shape-rendering="crispEdges">
      ${G`<path d=${t} fill="#1c1e22" />`}
    </svg>`}render(){let e=Math.ceil(this.remaining/60);return p`<div class="card" role="main">
      <div>
        <h1>Pair this screen</h1>
        <p class="lead">Approve it once from your phone and it will open the family board from now on.</p>
        <p class="code ${this.code?"":"wait"}" aria-live="polite">${this.code?fi(this.code):"····-····"}</p>
        <ol class="steps">
          <li><b>Scan the QR code</b> with your phone and press <b>Allow</b>.</li>
          <li>
            Or open <span class="addr">${location.host}${Sn}?${Dn}</span> and type the code.
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
    </div>`}};ft.styles=De`
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
  `,ft.properties={code:{state:!0},problem:{state:!0},remaining:{state:!0}};customElements.get("mydashlight-pairing")||customElements.define("mydashlight-pairing",ft);var Ln="hassTokens";function ki(){try{let s=localStorage.getItem(Ln);return s?JSON.parse(s):null}catch{return null}}function Rn(s){try{s?localStorage.setItem(Ln,JSON.stringify(s)):localStorage.removeItem(Ln)}catch{}}function eo(s){let n=document.getElementById("problem");n&&(n.hidden=!1,n.querySelector("p").textContent=s)}function to(){let s=document.querySelector("mydashlight-pairing");return s?new Promise(n=>{let e=t=>{s.stop(),s.hidden=!0,n(t)};s.addEventListener("paired",t=>e(t.detail),{once:!0}),s.addEventListener("password",()=>e(null),{once:!0}),s.start()}):Promise.resolve(null)}async function no(){let s=document.querySelector("mydashlight-board");if(!s)return;s.kiosk=!0;let n=location.search.includes("auth_callback");if(!n&&!ki()){let e=await to();e&&Rn(e)}try{let e=await Zn({hassUrl:location.origin,loadTokens:async()=>ki(),saveTokens:Rn});n&&history.replaceState(null,"",location.pathname+En(location.search));let t=await Xn({auth:e});s.backend=new vt(t),t.addEventListener("reconnect-error",(i,o)=>{o===2&&_i()})}catch(e){if(e===2){_i();return}eo(e===1?"Can’t reach Home Assistant. Trying again in a minute.":`Couldn’t sign in to Home Assistant (${String(e)}). Trying again in a minute.`),setTimeout(()=>location.reload(),6e4)}}function _i(){Rn(null),location.replace(location.pathname+En(location.search))}var Ti=lt(location.search),Ci=document.querySelector("mydashlight-keyboard");Ci&&Ti.keyboard!==!1&&ui(Ci);Ti.cursor!=="show"&&oi();no();
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
