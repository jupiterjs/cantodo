(function(c,t,k){$.extend(c,jQuery,{trigger:function(a,b,d){a.trigger?a.trigger(b,d):$.event.trigger(b,d,a,!0)},addEvent:function(a,b){$([this]).bind(a,b);return this},removeEvent:function(a,b){$([this]).unbind(a,b);return this},$:jQuery,prototype:jQuery.fn});$.each(["bind","unbind","undelegate","delegate"],function(a,b){c[b]=function(){var a=this[b]?this:$([this]);a[b].apply(a,arguments);return this}});$.each("append,filter,addClass,remove,data,get".split(","),function(a,b){c[b]=function(a){return a[b].apply(a,
c.makeArray(arguments).slice(1))}});var la=$.cleanData;$.cleanData=function(a){$.each(a,function(a,d){c.trigger(d,"destroyed",[],!1)});la(a)};var ma=/==/,na=/([A-Z]+)([A-Z][a-z])/g,oa=/([a-z\d])([A-Z])/g,pa=/([a-z\d])([A-Z])/g,Q=/\{([^\}]+)\}/g,q=/"/g,qa=/'/g;c.extend(c,{esc:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(q,"&#34;").replace(qa,"&#39;")},getObject:function(a,b,d){var a=a?a.split("."):[],e=a.length,f,g=0,h,i,b=c.isArray(b)?b:[b||t];if(!e)return b[0];
for(;f=b[g++];){for(i=0;i<e-1&&/^f|^o/.test(typeof f);i++)f=a[i]in f?f[a[i]]:d&&(f[a[i]]={});if(/^f|^o/.test(typeof f)&&(h=a[i]in f?f[a[i]]:d&&(f[a[i]]={}),h!==k))return!1===d&&delete f[a[i]],h}},capitalize:function(a){return a.charAt(0).toUpperCase()+a.slice(1)},underscore:function(a){return a.replace(ma,"/").replace(na,"$1_$2").replace(oa,"$1_$2").replace(pa,"_").toLowerCase()},sub:function(a,b,d){var e=[];e.push(a.replace(Q,function(a,g){var h=c.getObject(g,b,d);return/^f|^o/.test(typeof h)?(e.push(h),
""):""+h}));return 1>=e.length?e[0]:e},replacer:Q,undHash:/_|-/});var F=0;c.Construct=function(){if(arguments.length)return c.Construct.extend.apply(c.Construct,arguments)};c.extend(c.Construct,{newInstance:function(){var a=this.instance(),b;a.setup&&(b=a.setup.apply(a,arguments));a.init&&a.init.apply(a,b||arguments);return a},_inherit:function(a,b,d){c.extend(d||a,a||{})},setup:function(a){this.defaults=c.extend(!0,{},a.defaults,this.defaults)},instance:function(){F=1;var a=new this;F=0;return a},
extend:function(a,b,d){function e(){if(!F)return this.constructor!==e&&arguments.length?arguments.callee.extend.apply(arguments.callee,arguments):this.constructor.newInstance.apply(this.constructor,arguments)}"string"!=typeof a&&(d=b,b=a,a=null);d||(d=b,b=null);var d=d||{},f=this.prototype,g,h,i,l;l=this.instance();this._inherit(d,f,l);for(g in this)this.hasOwnProperty(g)&&(e[g]=this[g]);this._inherit(b,this,e);if(a){i=a.split(".");h=i.pop();i=f=c.getObject(i.join("."),t,!0);var ra=c.underscore(a.replace(/\./g,
"_")),B=c.underscore(h);f[h]=e}c.extend(e,{prototype:l,namespace:i,shortName:h,_shortName:B,_fullName:ra,constructor:e,fullName:a});e.prototype.constructor=e;h=[this].concat(c.makeArray(arguments));l=e.setup.apply(e,h);e.init&&e.init.apply(e,l||h);return e}});var r=function(a){return a&&"object"===typeof a&&!(a instanceof Date)},G=function(a,b){return c.each(a,function(a,e){e&&e.unbind&&e.unbind("change"+b)})},H=function(a,b,d){a instanceof u?G([a],d._namespace):a=c.isArray(a)?new u.List(a):new u(a);
a.bind("change"+d._namespace,function(e,f){var g=c.makeArray(arguments),e=g.shift();g[0]="*"===b?d.indexOf(a)+"."+g[0]:b+"."+g[0];c.trigger(d,e,g)});return a},R=0,v=k,S=function(){if(!v)return v=[],!0},n=function(a,b,d){if(!a._init)if(v)v.push([a,{type:b,batchNum:T},d]);else return c.trigger(a,b,d)},T=1,U=function(){var a=v.slice(0);v=k;T++;c.each(a,function(a,d){c.trigger.apply(c,d)})},C=function(a,b,d){a.each(function(a,f){d[a]=r(f)&&c.isFunction(f[b])?f[b]():f});return d},z=function(a){return function(){return c[a].apply(this,
arguments)}},A=z("addEvent"),z=z("removeEvent"),I=function(a){return c.isArray(a)?a:(""+a).split(".")},u=c.Construct("can.Observe",{setup:function(){c.Construct.setup.apply(this,arguments)},bind:A,unbind:z,id:"id"},{setup:function(a){this._data={};this._namespace=".observe"+ ++R;this._init=1;this.attr(a);delete this._init},attr:function(a,b){if(~"ns".indexOf((typeof a).charAt(0))){if(b===k)return u.__reading&&u.__reading(this,a),this._get(a);this._set(a,b);return this}return this._attrs(a,b)},each:function(){return c.each.apply(k,
[this.__get()].concat(c.makeArray(arguments)))},removeAttr:function(a){var a=I(a),b=a.shift(),d=this._data[b];if(a.length)return d.removeAttr(a);delete this._data[b];b in this.constructor.prototype||delete this[b];n(this,"change",[b,"remove",k,d]);n(this,b,k,d);return d},_get:function(a){var a=I(a),b=this.__get(a.shift());return a.length?b?b._get(a):k:b},__get:function(a){return a?this._data[a]:this._data},_set:function(a,b){var d=I(a),e=d.shift(),c=this.__get(e);if(r(c)&&d.length)c._set(d,b);else{if(d.length)throw"can.Observe: Object does not exist";
this.__convert&&(b=this.__convert(e,b));this.__set(e,b,c)}},__set:function(a,b,d){if(b!==d){var e=this.__get().hasOwnProperty(a)?"set":"add";this.___set(a,r(b)?H(b,a,this):b);n(this,"change",[a,e,b,d]);n(this,a,b,d);d&&G([d],this._namespace)}},___set:function(a,b){this._data[a]=b;a in this.constructor.prototype||(this[a]=b)},bind:A,unbind:z,serialize:function(){return C(this,"serialize",{})},_attrs:function(a,b){if(a===k)return C(this,"attr",{});var a=c.extend(!0,{},a),d,e=S(),f=this,g;this.each(function(d,
e){g=a[d];g===k?b&&f.removeAttr(d):(r(e)&&r(g)?e.attr(g,b):e!=g&&f._set(d,g),delete a[d])});for(d in a)g=a[d],this._set(d,g);e&&U();return this}}),sa=[].splice,J=u("can.Observe.List",{setup:function(a,b){this.length=0;this._namespace=".observe"+ ++R;this._init=1;this.bind("change",c.proxy(this._changes,this));this.push.apply(this,c.makeArray(a||[]));c.extend(this,b);delete this._init},_changes:function(a,b,d,e,c){~b.indexOf(".")||("add"===d?(n(this,d,[e,+b]),n(this,"length",[this.length])):"remove"===
d?(n(this,d,[c,+b]),n(this,"length",[this.length])):n(this,d,[e,+b]))},__get:function(a){return a?this[a]:this},___set:function(a,b){this[a]=b;+a>=this.length&&(this.length=+a+1)},serialize:function(){return C(this,"serialize",[])},splice:function(a,b){var d=c.makeArray(arguments),e;for(e=2;e<d.length;e++){var f=d[e];r(f)&&(d[e]=H(f,"*",this))}b===k&&(b=d[1]=this.length-a);e=sa.apply(this,d);0<b&&(n(this,"change",[""+a,"remove",k,e]),G(e,this._namespace));2<d.length&&n(this,"change",[""+a,"add",d.slice(2),
e]);return e},_attrs:function(a,b){if(a===k)return C(this,"attr",[]);var a=a.slice(0),d=Math.min(a.length,this.length),e=S(),c;for(c=0;c<d;c++){var g=this[c],h=a[c];r(g)&&r(h)?g.attr(h,b):g!=h&&this._set(c,h)}a.length>this.length?this.push(a.slice(this.length)):a.length<this.length&&b&&this.splice(a.length);e&&U()}});c.each({push:"length",unshift:0},function(a,b){J.prototype[a]=function(){for(var d=arguments[0]&&c.isArray(arguments[0])?arguments[0]:c.makeArray(arguments),e=b?this.length:0,f=0;f<d.length;f++){var g=
d[f];r(g)&&(d[f]=H(g,"*",this))}f=[][a].apply(this,d);(!this.comparator||!d.length)&&n(this,"change",[""+e,"add",d,k]);return f}});c.each({pop:"length",shift:0},function(a,b){J.prototype[a]=function(){var d=arguments[0]&&c.isArray(arguments[0])?arguments[0]:c.makeArray(arguments),e=b&&this.length?this.length-1:0,d=[][a].apply(this,d);n(this,"change",[""+e,"remove",k,[d]]);d&&d.unbind&&d.unbind("change"+this._namespace);return d}});J.prototype.indexOf=[].indexOf||function(a){return c.inArray(a,this)};
var ta=function(a,b,d){var e=new c.Deferred;a.then(function(){arguments[0]=b[d](arguments[0]);e.resolve.apply(e,arguments)},function(){e.resolveWith.apply(this,arguments)});return e},ua=0,V=/change.observe\d+/,W=function(a,b,d,e,c){var g;g=[a.serialize()];var h=a.constructor,i;"destroy"==b&&g.shift();"create"!==b&&g.unshift(a[a.constructor.id]);i=h[b].apply(h,g);g=i.pipe(function(d){a[c||b+"d"](d,i);return a});i.abort&&(g.abort=function(){i.abort()});return g.then(d,e)},va={create:{url:"_shortName",
type:"post"},update:{data:function(a,b){var b=b||{},d=this.id;b[d]&&b[d]!==a&&(b["new"+c.capitalize(a)]=b[d],delete b[d]);b[d]=a;return b},type:"put"},destroy:{type:"delete",data:function(a){return{}[this.id]=a}},findAll:{url:"_shortName"},findOne:{}},wa=function(a,b){return function(d){var d=a.data?a.data.apply(this,arguments):d,e=b||this[a.url||"_url"],f=d,g=a.type||"get";if("string"==typeof e){var h=e.split(" "),e={url:h.pop()};h.length&&(e.type=h.pop())}e.data="object"==typeof f&&!c.isArray(f)?
c.extend(e.data||{},f):f;e.url=c.sub(e.url,e.data,!0);return c.ajax(c.extend({type:g||"post",dataType:"json",success:void 0,error:void 0},e))}};c.Observe("can.Model",{setup:function(){c.Observe.apply(this,arguments);if(this!==c.Model){var a=this;c.each(va,function(b,e){c.isFunction(a[b])||(a[b]=wa(e,a[b]))});var b=c.proxy(this._clean,a);c.each({findAll:"models",findOne:"model"},function(d,e){var c=a[d];a[d]=function(d,h,i){a._reqs++;return ta(c.call(a,d),a,e).then(h,i).then(b,b)}});"can.Model"==a.fullName&&
(a.fullName="Model"+ ++ua);this.store={};this._reqs=0;this._url=this._shortName+"/{"+this.id+"}"}},_clean:function(){this._reqs--;if(!this._reqs)for(var a in this.store)this.store[a]._bindings||delete this.store[a]},models:function(a){if(a){var b=this,d=new (b.List||X),e=c.isArray(a),f=a instanceof X,f=e?a:f?a.serialize():a.data;c.each(f,function(a,c){d.push(b.model(c))});e||c.each(a,function(a,b){"data"!==a&&(d[a]=b)});return d}},model:function(a){if(a){a instanceof this&&(a=a.serialize());var b=
this.store[a.id]||new this(a);this._reqs&&(this.store[a.id]=b);return b}}},{isNew:function(){var a=this[this.constructor.id];return!(a||0===a)},save:function(a,b){return W(this,this.isNew()?"create":"update",a,b)},destroy:function(a,b){return W(this,"destroy",a,b,"destroyed")},bind:function(a){V.test(a)||(this._bindings||(this.constructor.store[this[this.constructor.id]]=this,this._bindings=0),this._bindings++);return c.Observe.prototype.bind.apply(this,arguments)},unbind:function(a){V.test(a)||(this._bindings--,
this._bindings||delete this.constructor.store[this[this.constructor.id]]);return c.Observe.prototype.unbind.apply(this,arguments)},___set:function(a,b){c.Observe.prototype.___set.call(this,a,b);a===this.constructor.id&&this._bindings&&(this.constructor.store[this[this.constructor.id]]=this)}});c.each(["created","updated","destroyed"],function(a,b){c.Model.prototype[b]=function(a){var e=this.constructor;a&&"object"==typeof a&&this.attr(a.attr?a.attr():a);c.trigger(this,b);c.trigger(this,"change",b);
c.trigger(e,b,this)}});var X=c.Observe.List("can.Model.List",{setup:function(){c.Observe.List.prototype.setup.apply(this,arguments);var a=this;this.bind("change",function(b,d){/\w+\.destroyed/.test(d)&&a.splice(a.indexOf(b.target),1)})}}),xa=/^\d+$/,ya=/([^\[\]]+)|(\[\])/g,za=/([^?#]*)(#.*)?$/,Y=function(a){return decodeURIComponent(a.replace(/\+/g," "))};c.extend(c,{deparam:function(a){var b={};a&&za.test(a)&&(a=a.split("&"),c.each(a,function(a,c){var f=c.split("="),g=Y(f.shift()),h=Y(f.join("="));
current=b;for(var f=g.match(ya),g=0,i=f.length-1;g<i;g++)current[f[g]]||(current[f[g]]=xa.test(f[g+1])||"[]"==f[g+1]?[]:{}),current=current[f[g]];lastPart=f.pop();"[]"==lastPart?current.push(h):current[lastPart]=h}));return b}});var Z=/\:([\w\.]+)/g,aa=/^(?:&[^=]+=[^&]*)+/,Aa=function(a){return c.map(a,function(a,d){return("className"===d?"class":d)+'="'+c.esc(a)+'"'}).join(" ")},ba=!0,K=t.location,s=c.each,o=c.extend;c.route=function(a,b){var d=[],e=a.replace(Z,function(a,b){d.push(b);return"([^\\/\\&]*)"});
c.route.routes[a]={test:RegExp("^"+e+"($|&)"),route:a,names:d,defaults:b||{},length:a.split("/").length};return c.route};o(c.route,{param:function(a){delete a.route;var b,d=0,e,f=a.route;(!f||!(b=c.route.routes[f]))&&s(c.route.routes,function(c,f){a:{for(var g=0,h=0;h<f.names.length;h++){if(!a.hasOwnProperty(f.names[h])){e=-1;break a}g++}e=g}e>d&&(b=f,d=e)});if(b){var g=o({},a),f=b.route.replace(Z,function(d,c){delete g[c];return a[c]===b.defaults[c]?"":encodeURIComponent(a[c])}),h;s(b.defaults,function(a,
b){g[a]===b&&delete g[a]});h=c.param(g);return f+(h?"&"+h:"")}return c.isEmptyObject(a)?"":"&"+c.param(a)},deparam:function(a){var b={length:-1};s(c.route.routes,function(d,c){c.test.test(a)&&c.length>b.length&&(b=c)});if(-1<b.length){var d=a.match(b.test),e=d.shift(),f=(e=a.substr(e.length-("&"===d[d.length-1]?1:0)))&&aa.test(e)?c.deparam(e.slice(1)):{},f=o(!0,{},b.defaults,f);s(d,function(a,d){d&&"&"!==d&&(f[b.names[a]]=decodeURIComponent(d))});f.route=b.route;return f}"&"!==a.charAt(0)&&(a="&"+
a);return aa.test(a)?c.deparam(a.slice(1)):{}},data:new c.Observe({}),routes:{},ready:function(a){!1===a&&(ba=a);(!0===a||!0===ba)&&ca();return c.route},url:function(a,b){b&&(a=o({},L,a));return"#!"+c.route.param(a)},link:function(a,b,d,e){return"<a "+Aa(o({href:c.route.url(b,e)},d))+">"+a+"</a>"},current:function(a){return K.hash=="#!"+c.route.param(a)}});s("bind,unbind,delegate,undelegate,attr,removeAttr".split(","),function(a,b){c.route[b]=function(){return c.route.data[b].apply(c.route.data,arguments)}});
var da,L,ca=function(){L=c.route.deparam(K.hash.split(/#!?/).pop());c.route.attr(L,!0)};c.bind.call(t,"hashchange",ca);c.route.bind("change",function(){clearTimeout(da);da=setTimeout(function(){K.hash="#!"+c.route.param(c.route.data.serialize())},1)});c.bind.call(document,"ready",c.route.ready);var A=function(a,b,d){c.bind.call(a,b,d);return function(){c.unbind.call(a,b,d)}},w=c.isFunction,o=c.extend,s=c.each,Ba=[].slice,Ca=c.getObject("$.event.special")||{},ea=function(a,b,d,e){c.delegate.call(a,
b,d,e);return function(){c.undelegate.call(a,b,d,e)}},M=function(a,b){var d="string"==typeof b?a[b]:b;return function(){a.called=b;return d.apply(a,[this.nodeName?c.$(this):this].concat(Ba.call(arguments,0)))}},N;c.Construct("can.Control",{setup:function(){c.Construct.setup.apply(this,arguments);if(this!==c.Control){var a;this.actions={};for(a in this.prototype)"constructor"!=a&&w(this.prototype[a])&&this._isAction(a)&&(this.actions[a]=this._action(a))}},_isAction:function(a){return Ca[a]||O[a]||
/[^\w]/.test(a)},_action:function(a,b){if(b||!/\{([^\}]+)\}/g.test(a)){var d=b?c.sub(a,[b,t]):a,e=c.isArray(d),f=(e?d[1]:d).match(/^(?:(.*?)\s)?([\w\.\:>]+)$/);return{processor:O[f[2]]||N,parts:f,delegate:e?d[0]:k}}},processors:{},defaults:{}},{setup:function(a,b){var d=this.constructor,e=d.pluginName||d._fullName;this.element=c.$(a);e&&"can_control"!==e&&this.element.addClass(e);c.data(this.element,"controls")||c.data(this.element,"controls",[this]);this.options=o({},d.defaults,b);this.on();return[this.element,
this.options]},on:function(a,b,d,e){if(!a){this.off();var a=this.constructor,b=this._bindings,d=a.actions,e=this.element,f=M(this,"destroy");for(funcName in d)d.hasOwnProperty(funcName)&&(ready=d[funcName]||a._action(funcName,this.options),b.push(ready.processor(ready.delegate||e,ready.parts[2],ready.parts[1],funcName,this)));c.bind.call(e,"destroyed",f);b.push(function(a){c.unbind.call(a,"destroyed",f)});return b.length}"string"==typeof a&&(e=d,d=b,b=a,a=this.element);"string"==typeof e&&(e=M(this,
e));this._bindings.push(b?ea(a,c.trim(b),d,e):A(a,d,e));return this._bindings.length},off:function(){var a=this.element[0];s(this._bindings||[],function(b,d){d(a)});this._bindings=[]},destroy:function(){var a=this.constructor,a=a.pluginName||a._fullName;this.off();a&&"can_control"!==a&&this.element.removeClass(a);a=c.data(this.element,"controls");a.splice(c.inArray(this,a),1);c.trigger(this,"destroyed");this.element=null}});var O=c.Control.processors;N=function(a,b,d,e,f){e=M(f,e);return d?ea(a,c.trim(d),
b,e):A(a,b,e)};s("change,click,contextmenu,dblclick,keydown,keyup,keypress,mousedown,mousemove,mouseout,mouseover,mouseup,reset,resize,scroll,select,submit,focusin,focusout,mouseenter,mouseleave".split(","),function(a,b){O[b]=N});c.Control.processors.route=function(a,b,d,e,f){c.route(d||"");var g,h=function(a){if(c.route.attr("route")===(d||"")&&(a.batchNum===k||a.batchNum!==g))g=a.batchNum,a=c.route.attr(),delete a.route,f[e](a)};c.route.bind("change",h);return function(){c.route.unbind("change",
h)}};var w=c.isFunction,Da=c.makeArray,fa=1,j=c.view=function(a,b,d,e){a=j.render(a,b,d,e);return c.isDeferred(a)?a.pipe(function(a){return j.frag(a)}):j.frag(a)};c.extend(j,{frag:function(a){a=c.buildFragment([a],[document.body]).fragment;a.childNodes.length||a.appendChild(document.createTextNode(""));return j.hookup(a)},hookup:function(a){var b=[],d,e,f,g=0;for(c.each(a.childNodes?c.makeArray(a.childNodes):a,function(a,d){1===d.nodeType&&(b.push(d),b.push.apply(b,c.makeArray(d.getElementsByTagName("*"))))});f=
b[g++];)if(f.getAttribute&&(d=f.getAttribute("data-view-id"))&&(e=j.hookups[d]))e(f,d),delete j.hookups[d],f.removeAttribute("data-view-id");return a},hookups:{},hook:function(a){j.hookups[++fa]=a;return" data-view-id='"+fa+"'"},cached:{},cache:!0,register:function(a){this.types["."+a.suffix]=a},types:{},ext:".ejs",registerScript:function(){},preload:function(){},render:function(a,b,d,e){w(d)&&(e=d,d=k);var f=Ea(b);if(f.length){var g=new c.Deferred;f.push(ga(a,!0));c.when.apply(c,f).then(function(a){var f=
Da(arguments),h=f.pop();if(c.isDeferred(b))b=ha(a);else for(var B in b)c.isDeferred(b[B])&&(b[B]=ha(f.shift()));f=h(b,d);g.resolve(f);e&&e(f)});return g}var h,f=w(e),g=ga(a,f);f?(h=g,g.then(function(a){e(a(b,d))})):g.then(function(a){h=a(b,d)});return h}});c.isDeferred=function(a){return a&&w(a.then)&&w(a.pipe)};var ia=function(a,b){if(!a.length)throw"can.view: No template or empty template:"+b;},ga=function(a,b){var d=a.match(/\.[\w\d]+$/),e,f,g,h=function(a){var a=e.renderer(g,a),b=new c.Deferred;
b.resolve(a);j.cache&&(j.cached[g]=b);return b};if(f=document.getElementById(a))d="."+f.type.match(/\/(x\-)?(.+)/)[2];d||(a+=d=j.ext);c.isArray(d)&&(d=d[0]);g=a.split(/\/|\./g).join("_");if(a.match(/^\/\//))var i=a.substr(2),a=!t.steal?"/"+i:steal.root.mapJoin(i);e=j.types[d];if(j.cached[g])return j.cached[g];if(f)return h(f.innerHTML);var l=new c.Deferred;c.ajax({async:b,url:a,dataType:"text",error:function(b){ia("",a);l.reject(b)},success:function(b){ia(b,a);l.resolve(e.renderer(g,b));j.cache&&
(j.cached[g]=l)}});return l},Ea=function(a){var b=[];if(c.isDeferred(a))return[a];for(var d in a)c.isDeferred(a[d])&&b.push(a[d]);return b},ha=function(a){return c.isArray(a)&&"success"===a[1]?a[0]:a},Fa=function(a){eval(a)},o=c.extend,ja=/\s*\(([\$\w]+)\)\s*->([^\n]*)/,ka=/([^\s]+)=$/,Ga=/__!!__/g,Ha={"":"span",table:"tr",tr:"td",ol:"li",ul:"li",tbody:"tr",thead:"tr",tfoot:"tr"},D=function(a,b,d){c.each(a,function(a,b){b.obj.bind(b.attr,d)});c.bind.call(b,"destroyed",function(){c.each(a,function(a,
b){b.obj.unbind(b.attr,d)})})},Ia=function(a){return"string"==typeof a||"number"==typeof a?c.esc(a):P(a)},P=function(a){if("string"==typeof a)return a;if(!a&&0!=a)return"";var b=a.hookup&&function(b,c){a.hookup.call(a,b,c)}||"function"==typeof a&&a;return b?(x.push(b),""):""+a},p=function(a){if(this.constructor!=p){var b=new p(a);return function(a,c){return b.render(a,c)}}"function"==typeof a?this.template={fn:a}:(o(this,a),this.template=Ja(this.text,this.name))};c.EJS=p;p.prototype.render=function(a,
b){a=a||{};return this.template.fn.call(a,a,new p.Helpers(a,b||{}))};o(p,{txt:function(a,b,d,e,f){c.Observe&&(c.Observe.__reading=function(a,b){g.push({obj:a,attr:b})});var g=[],h=e.call(d),a=Ha[a]||"span";c.Observe&&delete c.Observe.__reading;if(!g.length)return(f||0!==b?Ia:P)(h);if(0==b)return"<"+a+c.view.hook(f?function(a){var b=a.parentNode,c=document.createTextNode(h);b.insertBefore(c,a);b.removeChild(a);D(g,b,function(){c.nodeValue=e.call(d)})}:function(a){var b=function(a,b){var d=c.view.frag(a),
e=c.$(c.map(d.childNodes,function(a){return a})),f=b[b.length-1];f.nextSibling?f.parentNode.insertBefore(d,f.nextSibling):f.parentNode.appendChild(d);c.remove(c.$(b));return e},f=b(h,[a]);D(g,a.parentNode,function(){f=b(e.call(d),f)})})+"></"+a+">";if(1===b){var i=e.call(d).replace(/['"]/g,"").split("=")[0];x.push(function(a){D(g,a,function(){var b=(e.call(d)||"").replace(/['"]/g,"").split("="),c=b[0];c!=i&&i&&a.removeAttribute(i);c&&a.setAttribute(c,b[1])})});return h}x.push(function(a){var f=c.$(a),
i;(i=c.data(f,"hooks"))||c.data(f,"hooks",i={});var j=a.getAttribute(b),f=j.split("__!!__"),m;i[b]?i[b].funcs.push(e):i[b]={render:function(){var a=0;return j.replace(Ga,function(){return P(m.funcs[a++].call(d))})},funcs:[e],batchNum:k};m=i[b];f.splice(1,0,h);a.setAttribute(b,f.join(""));D(g,a,function(d){if(d.batchNum===k||d.batchNum!==m.batchNum){m.batchNum=d.batchNum;a.setAttribute(b,m.render())}})});return"__!!__"},esc:function(a,b,d,c){return p.txt(a,b,d,c,!0)},pending:function(){if(x.length){var a=
x.slice(0);x=[];return c.view.hook(function(b){c.each(a,function(a,c){c(b)})})}return""}});var Ka=/(<%%|%%>|<%==|<%=|<%#|<%|%>|<|>|"|')/,y=null,E=q=null,x=[],Ja=function(a,b){var d=a.replace(/(\r|\n)+/g,"\n").split(Ka),c="",f=["var ___v1ew = [];"],g=function(a,b){f.push("___v1ew.push(",'"',a.split("\\").join("\\\\").split("\n").join("\\n").split('"').join('\\"').split("\t").join("\\t"),'"'+(b||"")+");")},h=[],i,l=null,j=!1,n="",o=0,m;for(y=q=E=null;(m=d[o++])!==k;){if(null===l)switch(m){case "<%":case "<%=":case "<%==":j=
1;case "<%#":l=m;0<c.length&&g(c);c="";break;case "<%%":c+="<%";break;case "<":0!==d[o].indexOf("!--")&&(y=1,j=0);c+=m;break;case ">":y=0;j?(g(c,',can.EJS.pending(),">"'),c=""):c+=m;break;case "'":case '"':y&&(q&&q===m?q=null:null===q&&(q=m,E=i));default:"<"===i&&(n=m.split(" ")[0]),c+=m}else switch(m){case "%>":switch(l){case "<%":i=--c.split("{").length- --c.split("}").length;1==i?(f.push("___v1ew.push(","can.EJS.txt('"+n+"',"+(q?"'"+E.match(ka)[1]+"'":y?1:0)+",this,function(){","var ___v1ew = [];",
c),h.push({before:"",after:"return ___v1ew.join('')}));"})):(l=h.length&&-1==i?h.pop():{after:";"},l.before&&f.push(l.before),f.push(c,";",l.after));break;case "<%=":case "<%==":(i=--c.split("{").length- --c.split("}").length)&&h.push({before:"return ___v1ew.join('')",after:"}));"}),ja.test(c)&&(c=c.match(ja),c="function(__){var "+c[1]+"=can.$(__);"+c[2]+"}"),f.push("___v1ew.push(","can.EJS."+("<%="===l?"esc":"txt")+"('"+n+"',"+(q?"'"+E.match(ka)[1]+"'":y?1:0)+",this,function(){ return ",c,i?"var ___v1ew = [];":
"}));")}l=null;c="";break;case "<%%":c+="<%";break;default:c+=m}i=m}0<c.length&&g(c);f.push(";");d={out:"with(_VIEW) { with (_CONTEXT) {"+f.join("")+" return ___v1ew.join('')}}"};Fa.call(d,"this.fn = (function(_CONTEXT,_VIEW){"+d.out+"});\r\n//@ sourceURL="+b+".js");return d};p.Helpers=function(a,b){this._data=a;this._extras=b;o(this,b)};p.Helpers.prototype={view:function(a,b,c){return $View(a,b||this._data,c||this._extras)},list:function(a,b){a.attr("length");for(var c=0,e=a.length;c<e;c++)b(a[c],
c,a)}};c.view.register({suffix:"ejs",script:function(a,b){return"can.EJS(function(_CONTEXT,_VIEW) { "+(new p({text:b,name:a})).template.out+" })"},renderer:function(a,b){return p({text:b,name:a})}})})(can={},this);
