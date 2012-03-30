(function(c,u,m){$.extend(c,jQuery,{trigger:function(a,b,d){a.trigger?a.trigger(b,d):$.event.trigger(b,d,a,!0)},addEvent:function(a,b){$([this]).bind(a,b);return this},removeEvent:function(a,b){$([this]).unbind(a,b);return this},$:jQuery,prototype:jQuery.fn});$.each(["bind","unbind","undelegate","delegate"],function(a,b){c[b]=function(){var a=this[b]?this:$([this]);a[b].apply(a,arguments);return this}});$.each("append,filter,addClass,remove,data,get".split(","),function(a,b){c[b]=function(a){return a[b].apply(a,
c.makeArray(arguments).slice(1))}});var na=$.cleanData;$.cleanData=function(a){$.each(a,function(a,d){c.trigger(d,"destroyed",[],!1)});na(a)};var oa=/==/,pa=/([A-Z]+)([A-Z][a-z])/g,qa=/([a-z\d])([A-Z])/g,ra=/([a-z\d])([A-Z])/g,S=/\{([^\}]+)\}/g,q=/"/g,sa=/'/g;c.extend(c,{esc:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(q,"&#34;").replace(sa,"&#39;")},getObject:function(a,b,d){var a=a?a.split("."):[],f=a.length,e,g=0,h,i,b=c.isArray(b)?b:[b||u];if(!f)return b[0];
for(;e=b[g++];){for(i=0;i<f-1&&/^f|^o/.test(typeof e);i++)e=a[i]in e?e[a[i]]:d&&(e[a[i]]={});if(/^f|^o/.test(typeof e)&&(h=a[i]in e?e[a[i]]:d&&(e[a[i]]={}),h!==m))return!1===d&&delete e[a[i]],h}},capitalize:function(a){return a.charAt(0).toUpperCase()+a.slice(1)},underscore:function(a){return a.replace(oa,"/").replace(pa,"$1_$2").replace(qa,"$1_$2").replace(ra,"_").toLowerCase()},sub:function(a,b,d){var f=[];f.push(a.replace(S,function(a,g){var h=c.getObject(g,b,d);return/^f|^o/.test(typeof h)?(f.push(h),
""):""+h}));return 1>=f.length?f[0]:f},replacer:S,undHash:/_|-/});var G=0;c.Construct=function(){if(arguments.length)return c.Construct.extend.apply(c.Construct,arguments)};c.extend(c.Construct,{newInstance:function(){var a=this.instance(),b;a.setup&&(b=a.setup.apply(a,arguments));a.init&&a.init.apply(a,b||arguments);return a},_inherit:function(a,b,d){c.extend(d||a,a||{})},setup:function(a){this.defaults=c.extend(!0,{},a.defaults,this.defaults)},instance:function(){G=1;var a=new this;G=0;return a},
extend:function(a,b,d){function f(){if(!G)return this.constructor!==f&&arguments.length?arguments.callee.extend.apply(arguments.callee,arguments):this.constructor.newInstance.apply(this.constructor,arguments)}"string"!=typeof a&&(d=b,b=a,a=null);d||(d=b,b=null);var d=d||{},e=this.prototype,g,h,i,j;j=this.instance();this._inherit(d,e,j);for(g in this)this.hasOwnProperty(g)&&(f[g]=this[g]);this._inherit(b,this,f);if(a){i=a.split(".");h=i.pop();i=e=c.getObject(i.join("."),u,!0);var ta=c.underscore(a.replace(/\./g,
"_")),D=c.underscore(h);e[h]=f}c.extend(f,{constructor:f,prototype:j,namespace:i,shortName:h,_shortName:D,fullName:a,_fullName:ta});f.prototype.constructor=f;h=[this].concat(c.makeArray(arguments));j=f.setup.apply(f,h);f.init&&f.init.apply(f,j||h);return f}});var r=function(a){return a&&"object"===typeof a&&!(a instanceof Date)},H=function(a,b){return c.each(a,function(a,f){f&&f.unbind&&f.unbind("change"+b)})},I=function(a,b,d){a instanceof v?H([a],d._namespace):a=c.isArray(a)?new v.List(a):new v(a);
a.bind("change"+d._namespace,function(f,e){var g=c.makeArray(arguments),f=g.shift();g[0]="*"===b?d.indexOf(a)+"."+g[0]:b+"."+g[0];c.trigger(d,f,g)});return a},T=0,w=m,U=function(){if(!w)return w=[],!0},l=function(a,b,d){if(!a._init)if(w)w.push([a,{type:b,batchNum:V},d]);else return c.trigger(a,b,d)},V=1,W=function(){var a=w.slice(0);w=m;V++;c.each(a,function(a,d){c.trigger.apply(c,d)})},E=function(a,b,d){a.each(function(a,e){d[a]=r(e)&&c.isFunction(e[b])?e[b]():e});return d},A=function(a){return function(){return c[a].apply(this,
arguments)}},B=A("addEvent"),A=A("removeEvent"),J=function(a){return c.isArray(a)?a:(""+a).split(".")},v=c.Construct("can.Observe",{setup:function(){c.Construct.setup.apply(this,arguments)},bind:B,unbind:A,id:"id"},{setup:function(a){this._data={};this._namespace=".observe"+ ++T;this._init=1;this.attr(a);delete this._init},attr:function(a,b){if(~"ns".indexOf((typeof a).charAt(0))){if(b===m)return v.__reading&&v.__reading(this,a),this._get(a);this._set(a,b);return this}return this._attrs(a,b)},each:function(){return c.each.apply(m,
[this.__get()].concat(c.makeArray(arguments)))},removeAttr:function(a){var a=J(a),b=a.shift(),d=this._data[b];if(a.length)return d.removeAttr(a);delete this._data[b];b in this.constructor.prototype||delete this[b];l(this,"change",[b,"remove",m,d]);l(this,b,m,d);return d},_get:function(a){var a=J(a),b=this.__get(a.shift());return a.length?b?b._get(a):m:b},__get:function(a){return a?this._data[a]:this._data},_set:function(a,b){var d=J(a),c=d.shift(),e=this.__get(c);if(r(e)&&d.length)e._set(d,b);else{if(d.length)throw"can.Observe: Object does not exist";
this.__convert&&(b=this.__convert(c,b));this.__set(c,b,e)}},__set:function(a,b,d){if(b!==d){var c=this.__get().hasOwnProperty(a)?"set":"add";this.___set(a,r(b)?I(b,a,this):b);l(this,"change",[a,c,b,d]);l(this,a,b,d);d&&H([d],this._namespace)}},___set:function(a,b){this._data[a]=b;a in this.constructor.prototype||(this[a]=b)},bind:B,unbind:A,serialize:function(){return E(this,"serialize",{})},_attrs:function(a,b){if(a===m)return E(this,"attr",{});var a=c.extend(!0,{},a),d,f=U(),e=this,g;this.each(function(d,
c){g=a[d];g===m?b&&e.removeAttr(d):(r(c)&&r(g)?c.attr(g,b):c!=g&&e._set(d,g),delete a[d])});for(d in a)g=a[d],this._set(d,g);f&&W();return this}}),ua=[].splice,K=v("can.Observe.List",{setup:function(a,b){this.length=0;this._namespace=".observe"+ ++T;this._init=1;this.bind("change",c.proxy(this._changes,this));this.push.apply(this,c.makeArray(a||[]));c.extend(this,b);delete this._init},_changes:function(a,b,d,c,e){~b.indexOf(".")||("add"===d?(l(this,d,[c,+b]),l(this,"length",[this.length])):"remove"===
d?(l(this,d,[e,+b]),l(this,"length",[this.length])):l(this,d,[c,+b]))},__get:function(a){return a?this[a]:this},___set:function(a,b){this[a]=b;+a>=this.length&&(this.length=+a+1)},serialize:function(){return E(this,"serialize",[])},splice:function(a,b){var d=c.makeArray(arguments),f;for(f=2;f<d.length;f++){var e=d[f];r(e)&&(d[f]=I(e,"*",this))}b===m&&(b=d[1]=this.length-a);f=ua.apply(this,d);0<b&&(l(this,"change",[""+a,"remove",m,f]),H(f,this._namespace));2<d.length&&l(this,"change",[""+a,"add",d.slice(2),
f]);return f},_attrs:function(a,b){if(a===m)return E(this,"attr",[]);var a=a.slice(0),d=Math.min(a.length,this.length),c=U(),e;for(e=0;e<d;e++){var g=this[e],h=a[e];r(g)&&r(h)?g.attr(h,b):g!=h&&this._set(e,h)}a.length>this.length?this.push(a.slice(this.length)):a.length<this.length&&b&&this.splice(a.length);c&&W()}});c.each({push:"length",unshift:0},function(a,b){K.prototype[a]=function(){for(var d=arguments[0]&&c.isArray(arguments[0])?arguments[0]:c.makeArray(arguments),f=b?this.length:0,e=0;e<d.length;e++){var g=
d[e];r(g)&&(d[e]=I(g,"*",this))}e=[][a].apply(this,d);(!this.comparator||!d.length)&&l(this,"change",[""+f,"add",d,m]);return e}});c.each({pop:"length",shift:0},function(a,b){K.prototype[a]=function(){var d=arguments[0]&&c.isArray(arguments[0])?arguments[0]:c.makeArray(arguments),f=b&&this.length?this.length-1:0,d=[][a].apply(this,d);l(this,"change",[""+f,"remove",m,[d]]);d&&d.unbind&&d.unbind("change"+this._namespace);return d}});K.prototype.indexOf=[].indexOf||function(a){return c.inArray(a,this)};
var va=function(a,b,d){var f=new c.Deferred;a.then(function(){arguments[0]=b[d](arguments[0]);f.resolve.apply(f,arguments)},function(){f.resolveWith.apply(this,arguments)});return f},wa=0,X=/change.observe\d+/,Y=function(a,b,d,c,e){var g;g=[a.serialize()];var h=a.constructor,i;"destroy"==b&&g.shift();"create"!==b&&g.unshift(a[a.constructor.id]);i=h[b].apply(h,g);g=i.pipe(function(d){a[e||b+"d"](d,i);return a});i.abort&&(g.abort=function(){i.abort()});return g.then(d,c)},xa={create:{url:"_shortName",
type:"post"},update:{data:function(a,b){var b=b||{},d=this.id;b[d]&&b[d]!==a&&(b["new"+c.capitalize(a)]=b[d],delete b[d]);b[d]=a;return b},type:"put"},destroy:{type:"delete",data:function(a){return{}[this.id]=a}},findAll:{url:"_shortName"},findOne:{}},ya=function(a,b){return function(d){var d=a.data?a.data.apply(this,arguments):d,f=b||this[a.url||"_url"],e=d,g=a.type||"get";if("string"==typeof f){var h=f.split(" "),f={url:h.pop()};h.length&&(f.type=h.pop())}f.data="object"==typeof e&&!c.isArray(e)?
c.extend(f.data||{},e):e;f.url=c.sub(f.url,f.data,!0);return c.ajax(c.extend({type:g||"post",dataType:"json",success:void 0,error:void 0},f))}};c.Observe("can.Model",{setup:function(){c.Observe.apply(this,arguments);if(this!==c.Model){var a=this;c.each(xa,function(b,f){c.isFunction(a[b])||(a[b]=ya(f,a[b]))});var b=c.proxy(this._clean,a);c.each({findAll:"models",findOne:"model"},function(d,c){var e=a[d];a[d]=function(d,h,i){a._reqs++;return va(e.call(a,d),a,c).then(h,i).then(b,b)}});"can.Model"==a.fullName&&
(a.fullName="Model"+ ++wa);this.store={};this._reqs=0;this._url=this._shortName+"/{"+this.id+"}"}},_clean:function(){this._reqs--;if(!this._reqs)for(var a in this.store)this.store[a]._bindings||delete this.store[a]},models:function(a){if(a){var b=this,d=new (b.List||Z),f=c.isArray(a),e=a instanceof Z,e=f?a:e?a.serialize():a.data;c.each(e,function(a,c){d.push(b.model(c))});f||c.each(a,function(a,b){"data"!==a&&(d[a]=b)});return d}},model:function(a){if(a){a instanceof this&&(a=a.serialize());var b=
this.store[a.id]||new this(a);this._reqs&&(this.store[a.id]=b);return b}}},{isNew:function(){var a=this[this.constructor.id];return!(a||0===a)},save:function(a,b){return Y(this,this.isNew()?"create":"update",a,b)},destroy:function(a,b){return Y(this,"destroy",a,b,"destroyed")},bind:function(a){X.test(a)||(this._bindings||(this.constructor.store[this[this.constructor.id]]=this,this._bindings=0),this._bindings++);return c.Observe.prototype.bind.apply(this,arguments)},unbind:function(a){X.test(a)||(this._bindings--,
this._bindings||delete this.constructor.store[this[this.constructor.id]]);return c.Observe.prototype.unbind.apply(this,arguments)},___set:function(a,b){c.Observe.prototype.___set.call(this,a,b);a===this.constructor.id&&this._bindings&&(this.constructor.store[this[this.constructor.id]]=this)}});c.each(["created","updated","destroyed"],function(a,b){c.Model.prototype[b]=function(a){var f=this.constructor;a&&"object"==typeof a&&this.attr(a.attr?a.attr():a);c.trigger(this,b);c.trigger(this,"change",b);
c.trigger(f,b,this)}});var Z=c.Observe.List("can.Model.List",{setup:function(){c.Observe.List.prototype.setup.apply(this,arguments);var a=this;this.bind("change",function(b,d){/\w+\.destroyed/.test(d)&&a.splice(a.indexOf(b.target),1)})}}),za=/^\d+$/,Aa=/([^\[\]]+)|(\[\])/g,Ba=/([^?#]*)(#.*)?$/,aa=function(a){return decodeURIComponent(a.replace(/\+/g," "))};c.extend(c,{deparam:function(a){var b={};a&&Ba.test(a)&&(a=a.split("&"),c.each(a,function(a,c){var e=c.split("="),g=aa(e.shift()),h=aa(e.join("="));
current=b;for(var e=g.match(Aa),g=0,i=e.length-1;g<i;g++)current[e[g]]||(current[e[g]]=za.test(e[g+1])||"[]"==e[g+1]?[]:{}),current=current[e[g]];lastPart=e.pop();"[]"==lastPart?current.push(h):current[lastPart]=h}));return b}});var ba=/\:([\w\.]+)/g,ca=/^(?:&[^=]+=[^&]*)+/,Ca=function(a){return c.map(a,function(a,d){return("className"===d?"class":d)+'="'+c.esc(a)+'"'}).join(" ")},da=!0,L=u.location,s=c.each,n=c.extend;c.route=function(a,b){var d=[],f=a.replace(ba,function(a,b){d.push(b);return"([^\\/\\&]*)"});
c.route.routes[a]={test:RegExp("^"+f+"($|&)"),route:a,names:d,defaults:b||{},length:a.split("/").length};return c.route};n(c.route,{param:function(a){delete a.route;var b,d=0,f,e=a.route;(!e||!(b=c.route.routes[e]))&&s(c.route.routes,function(c,e){a:{for(var g=0,h=0;h<e.names.length;h++){if(!a.hasOwnProperty(e.names[h])){f=-1;break a}g++}f=g}f>d&&(b=e,d=f)});if(b){var g=n({},a),e=b.route.replace(ba,function(d,c){delete g[c];return a[c]===b.defaults[c]?"":encodeURIComponent(a[c])}),h;s(b.defaults,
function(a,b){g[a]===b&&delete g[a]});h=c.param(g);return e+(h?"&"+h:"")}return c.isEmptyObject(a)?"":"&"+c.param(a)},deparam:function(a){var b={length:-1};s(c.route.routes,function(d,c){c.test.test(a)&&c.length>b.length&&(b=c)});if(-1<b.length){var d=a.match(b.test),f=d.shift(),e=(f=a.substr(f.length-("&"===d[d.length-1]?1:0)))&&ca.test(f)?c.deparam(f.slice(1)):{},e=n(!0,{},b.defaults,e);s(d,function(a,d){d&&"&"!==d&&(e[b.names[a]]=decodeURIComponent(d))});e.route=b.route;return e}"&"!==a.charAt(0)&&
(a="&"+a);return ca.test(a)?c.deparam(a.slice(1)):{}},data:new c.Observe({}),routes:{},ready:function(a){!1===a&&(da=a);(!0===a||!0===da)&&ea();return c.route},url:function(a,b){b&&(a=n({},M,a));return"#!"+c.route.param(a)},link:function(a,b,d,f){return"<a "+Ca(n({href:c.route.url(b,f)},d))+">"+a+"</a>"},current:function(a){return L.hash=="#!"+c.route.param(a)}});s("bind,unbind,delegate,undelegate,attr,removeAttr".split(","),function(a,b){c.route[b]=function(){return c.route.data[b].apply(c.route.data,
arguments)}});var fa,M,ea=function(){M=c.route.deparam(L.hash.split(/#!?/).pop());c.route.attr(M,!0)};c.bind.call(u,"hashchange",ea);c.route.bind("change",function(){clearTimeout(fa);fa=setTimeout(function(){L.hash="#!"+c.route.param(c.route.data.serialize())},1)});c.bind.call(document,"ready",c.route.ready);var B=function(a,b,d){c.bind.call(a,b,d);return function(){c.unbind.call(a,b,d)}},x=c.isFunction,n=c.extend,s=c.each,Da=[].slice,Ea=c.getObject("$.event.special")||{},ga=function(a,b,d,f){c.delegate.call(a,
b,d,f);return function(){c.undelegate.call(a,b,d,f)}},N=function(a,b){var d="string"==typeof b?a[b]:b;return function(){a.called=b;return d.apply(a,[this.nodeName?c.$(this):this].concat(Da.call(arguments,0)))}},O;c.Construct("can.Control",{setup:function(){c.Construct.setup.apply(this,arguments);if(this!==c.Control){var a;this.actions={};for(a in this.prototype)"constructor"!=a&&x(this.prototype[a])&&this._isAction(a)&&(this.actions[a]=this._action(a))}},_isAction:function(a){return!(!Ea[a]&&!P[a]&&
!/[^\w]/.test(a))},_action:function(a,b){if(b||!/\{([^\}]+)\}/g.test(a)){var d=b?c.sub(a,[b,u]):a,f=c.isArray(d),e=(f?d[1]:d).match(/^(?:(.*?)\s)?([\w\.\:>]+)$/);return{processor:P[e[2]]||O,parts:e,delegate:f?d[0]:m}}},processors:{},defaults:{}},{setup:function(a,b){var d=this.constructor,f=d.pluginName||d._fullName;this.element=c.$(a);f&&"can_control"!==f&&this.element.addClass(f);c.data(this.element,"controls")||c.data(this.element,"controls",[this]);this.options=n({},d.defaults,b);this.on();return[this.element,
this.options]},on:function(a,b,d,f){if(!a){this.off();var a=this.constructor,b=this._bindings,d=a.actions,f=this.element,e=N(this,"destroy"),g;for(g in d)d.hasOwnProperty(g)&&(ready=d[g]||a._action(g,this.options),b.push(ready.processor(ready.delegate||f,ready.parts[2],ready.parts[1],g,this)));c.bind.call(f,"destroyed",e);b.push(function(a){c.unbind.call(a,"destroyed",e)});return b.length}"string"==typeof a&&(f=d,d=b,b=a,a=this.element);"string"==typeof f&&(f=N(this,f));this._bindings.push(b?ga(a,
c.trim(b),d,f):B(a,d,f));return this._bindings.length},off:function(){var a=this.element[0];s(this._bindings||[],function(b,d){d(a)});this._bindings=[]},destroy:function(){var a=this.constructor,a=a.pluginName||a._fullName;this.off();a&&"can_control"!==a&&this.element.removeClass(a);a=c.data(this.element,"controls");a.splice(c.inArray(this,a),1);c.trigger(this,"destroyed");this.element=null}});var P=c.Control.processors;O=function(a,b,d,f,e){f=N(e,f);return d?ga(a,c.trim(d),b,f):B(a,b,f)};s("change,click,contextmenu,dblclick,keydown,keyup,keypress,mousedown,mousemove,mouseout,mouseover,mouseup,reset,resize,scroll,select,submit,focusin,focusout,mouseenter,mouseleave".split(","),
function(a,b){P[b]=O});c.Control.processors.route=function(a,b,d,f,e){c.route(d||"");var g,h=function(a){if(c.route.attr("route")===(d||"")&&(a.batchNum===m||a.batchNum!==g))g=a.batchNum,a=c.route.attr(),delete a.route,e[f](a)};c.route.bind("change",h);return function(){c.route.unbind("change",h)}};var x=c.isFunction,Fa=c.makeArray,ha=1,k=c.view=function(a,b,d,f){a=k.render(a,b,d,f);return c.isDeferred(a)?a.pipe(function(a){return k.frag(a)}):k.frag(a)};c.extend(k,{frag:function(a){a=c.buildFragment([a],
[document.body]).fragment;a.childNodes.length||a.appendChild(document.createTextNode(""));return k.hookup(a)},hookup:function(a){var b=[],d,f,e,g=0;for(c.each(a.childNodes?c.makeArray(a.childNodes):a,function(a,d){1===d.nodeType&&(b.push(d),b.push.apply(b,c.makeArray(d.getElementsByTagName("*"))))});e=b[g++];)if(e.getAttribute&&(d=e.getAttribute("data-view-id"))&&(f=k.hookups[d]))f(e,d),delete k.hookups[d],e.removeAttribute("data-view-id");return a},hookups:{},hook:function(a){k.hookups[++ha]=a;return" data-view-id='"+
ha+"'"},cached:{},cache:!0,register:function(a){this.types["."+a.suffix]=a},types:{},ext:".ejs",registerScript:function(){},preload:function(){},render:function(a,b,d,f){x(d)&&(f=d,d=m);var e=Ga(b);if(e.length){var g=new c.Deferred;e.push(ia(a,!0));c.when.apply(c,e).then(function(a){var e=Fa(arguments),h=e.pop();if(c.isDeferred(b))b=ja(a);else for(var D in b)c.isDeferred(b[D])&&(b[D]=ja(e.shift()));e=h(b,d);g.resolve(e);f&&f(e)});return g}var h,e=x(f),g=ia(a,e);e?(h=g,g.then(function(a){f(a(b,d))})):
g.then(function(a){h=a(b,d)});return h}});c.isDeferred=function(a){return a&&x(a.then)&&x(a.pipe)};var ka=function(a,b){if(!a.length)throw"can.view: No template or empty template:"+b;},ia=function(a,b){var d=a.match(/\.[\w\d]+$/),f,e,g,h=function(a){var a=f.renderer(g,a),b=new c.Deferred;b.resolve(a);k.cache&&(k.cached[g]=b);return b};if(e=document.getElementById(a))d="."+e.type.match(/\/(x\-)?(.+)/)[2];d||(a+=d=k.ext);c.isArray(d)&&(d=d[0]);g=a.split(/\/|\./g).join("_");if(a.match(/^\/\//))var i=
a.substr(2),a=!u.steal?"/"+i:steal.root.mapJoin(i);f=k.types[d];if(k.cached[g])return k.cached[g];if(e)return h(e.innerHTML);var j=new c.Deferred;c.ajax({async:b,url:a,dataType:"text",error:function(b){ka("",a);j.reject(b)},success:function(b){ka(b,a);j.resolve(f.renderer(g,b));k.cache&&(k.cached[g]=j)}});return j},Ga=function(a){var b=[];if(c.isDeferred(a))return[a];for(var d in a)c.isDeferred(a[d])&&b.push(a[d]);return b},ja=function(a){return c.isArray(a)&&"success"===a[1]?a[0]:a},Ha=function(a){eval(a)},
n=c.extend,la=/\s*\(([\$\w]+)\)\s*->([^\n]*)/,ma=/([^\s]+)=$/,Ia=/(\r|\n)+/g,Ja=/__!!__/g,Ka={"":"span",table:"tr",tr:"td",ol:"li",ul:"li",tbody:"tr",thead:"tr",tfoot:"tr"},Q=function(a,b,d){"class"===b?a.className=d:a.setAttribute(b,d)},t=function(a,b,d,f){var e=f.matched===m;f.matched=!f.matched;c.each(a,function(a,b){f[b.obj._namespace+"|"+b.attr]?f[b.obj._namespace+"|"+b.attr].matched=f.matched:(b.matched=f.matched,f[b.obj._namespace+"|"+b.attr]=b,b.obj.bind(b.attr,d))});for(var g in f)a=f[g],
"matched"!==g&&a.matched!==f.matched&&(a.obj.unbind(a.attr),delete f[g]);e&&c.bind.call(b,"destroyed",function(){c.each(f,function(a,b){"boolean"!==typeof b&&b.obj.unbind(b.attr,d)})})},La=function(a){return"string"==typeof a||"number"==typeof a?c.esc(a):R(a)},R=function(a){if("string"==typeof a)return a;if(!a&&0!=a)return"";var b=a.hookup&&function(b,c){a.hookup.call(a,b,c)}||"function"==typeof a&&a;return b?(y.push(b),""):""+a},C=function(a,b){c.Observe&&(c.Observe.__reading=function(a,b){d.push({obj:a,
attr:b})});var d=[],f=a.call(b);c.Observe&&delete c.Observe.__reading;return{value:f,observed:d}},o=function(a){if(this.constructor!=o){var b=new o(a);return function(a,c){return b.render(a,c)}}"function"==typeof a?this.template={fn:a}:(n(this,a),this.template=Ma(this.text,this.name))};c.EJS=o;o.prototype.render=function(a,b){a=a||{};return this.template.fn.call(a,a,new o.Helpers(a,b||{}))};n(o,{txt:function(a,b,d,f,e){var g=C(f,d),h=g.observed,i=g.value,j={},a=Ka[a]||"span";if(!h.length)return(e||
0!==b?La:R)(i);if(0==b)return"<"+a+c.view.hook(e?function(a){var b=a.parentNode,c=document.createTextNode(i),e=function(){var a=C(f,d);c.nodeValue=""+a.value;t(a.observed,b,e,j)};b.insertBefore(c,a);b.removeChild(a);t(h,b,e,j)}:function(a){var b=function(a,b){var d=c.view.frag(a),e=c.$(c.map(d.childNodes,function(a){return a})),f=b[b.length-1];f.nextSibling?f.parentNode.insertBefore(d,f.nextSibling):f.parentNode.appendChild(d);c.remove(c.$(b));return e},e=b(i,[a]),g=function(){var c=C(f,d);e=b(c.value,
e);t(c.observed,a.parentNode,g,j)};t(h,a.parentNode,g,j)})+"></"+a+">";if(1===b){var k=i.replace(/['"]/g,"").split("=")[0];y.push(function(a){var b=function(){var c=C(f,d),e=(c.value||"").replace(/['"]/g,"").split("="),g=e[0];g!=k&&k&&a.removeAttribute(k);g&&Q(a,g,e[1]);t(c.observed,a,b,j)};t(h,a,b,j)});return i}y.push(function(a){var e=c.$(a),g;(g=c.data(e,"hooks"))||c.data(e,"hooks",g={});var k="class"===b?a.className:a.getAttribute(b),e=k.split("__!!__"),l,n=function(d){if(d.batchNum===m||d.batchNum!==
l.batchNum)l.batchNum=d.batchNum,Q(a,b,l.render())};g[b]?g[b].funcs.push({func:f,old:j}):g[b]={render:function(){var b=0;return k.replace(Ja,function(){var c=C(l.funcs[b].func,d);t(c.observed,a,n,l.funcs[b++].old);return R(c.value)})},funcs:[{func:f,old:j}],batchNum:m};l=g[b];e.splice(1,0,i);Q(a,b,e.join(""));t(h,a,n,j)});return"__!!__"},esc:function(a,b,d,c){return o.txt(a,b,d,c,!0)},pending:function(){if(y.length){var a=y.slice(0);y=[];return c.view.hook(function(b){c.each(a,function(a,c){c(b)})})}return""}});
var Na=RegExp("(<%%|%%>|<%==|<%=|<%#|<%|%>|<|>|\"|')","g"),z=null,F=q=null,y=[],Ma=function(a,b){var c=[],f=0,a=a.replace(Ia,"\n");a.replace(Na,function(b,e,g){g>f&&c.push(a.substring(f,g));c.push(e);f=g+e.length});0===f&&c.push(a);var e="",g=["var ___v1ew = [];"],h=function(a,b){g.push("___v1ew.push(",'"',a.split("\\").join("\\\\").split("\n").join("\\n").split('"').join('\\"').split("\t").join("\\t"),'"'+(b||"")+");")},i=[],j,k=null,l=!1,n="",o=0,p;for(z=q=F=null;(p=c[o++])!==m;){if(null===k)switch(p){case "<%":case "<%=":case "<%==":l=
1;case "<%#":k=p;e.length&&h(e);e="";break;case "<%%":e+="<%";break;case "<":0!==c[o].indexOf("!--")&&(z=1,l=0);e+=p;break;case ">":z=0;l?(h(e,',can.EJS.pending(),">"'),e=""):e+=p;break;case "'":case '"':z&&(q&&q===p?q=null:null===q&&(q=p,F=j));default:"<"===j&&(n=p.split(" ")[0]),e+=p}else switch(p){case "%>":switch(k){case "<%":j=--e.split("{").length- --e.split("}").length;1==j?(g.push("___v1ew.push(","can.EJS.txt('"+n+"',"+(q?"'"+F.match(ma)[1]+"'":z?1:0)+",this,function(){","var ___v1ew = [];",
e),i.push({before:"",after:"return ___v1ew.join('')}));"})):(f=i.length&&-1==j?i.pop():{after:";"},f.before&&g.push(f.before),g.push(e,";",f.after));break;case "<%=":case "<%==":(j=--e.split("{").length- --e.split("}").length)&&i.push({before:"return ___v1ew.join('')",after:"}));"}),la.test(e)&&(e=e.match(la),e="function(__){var "+e[1]+"=can.$(__);"+e[2]+"}"),g.push("___v1ew.push(","can.EJS."+("<%="===k?"esc":"txt")+"('"+n+"',"+(q?"'"+F.match(ma)[1]+"'":z?1:0)+",this,function(){ return ",e,j?"var ___v1ew = [];":
"}));")}k=null;e="";break;case "<%%":e+="<%";break;default:e+=p}j=p}e.length&&h(e);g.push(";");h={out:"with(_VIEW) { with (_CONTEXT) {"+g.join("")+" return ___v1ew.join('')}}"};Ha.call(h,"this.fn = (function(_CONTEXT,_VIEW){"+h.out+"});\r\n//@ sourceURL="+b+".js");return h};o.Helpers=function(a,b){this._data=a;this._extras=b;n(this,b)};o.Helpers.prototype={view:function(a,b,c){return $View(a,b||this._data,c||this._extras)},list:function(a,b){a.attr("length");for(var c=0,f=a.length;c<f;c++)b(a[c],
c,a)}};c.view.register({suffix:"ejs",script:function(a,b){return"can.EJS(function(_CONTEXT,_VIEW) { "+(new o({text:b,name:a})).template.out+" })"},renderer:function(a,b){return o({text:b,name:a})}})})(can={},this);
