(function(can, window, undefined){
    can.addEvent = function (event, fn) {
        if (!this.__bindEvents) {
            this.__bindEvents = {};
        }
        var eventName = event.split(".")[0];
        if (!this.__bindEvents[eventName]) {
            this.__bindEvents[eventName] = [];
        }
        this.__bindEvents[eventName].push({handler:fn, name:event});
        return this;
    };
    can.removeEvent = function (event, fn) {
        if (!this.__bindEvents) {
            return;
        }
        var i = 0, events = this.__bindEvents[event.split(".")[0]], ev;
        while (i < events.length) {
            ev = events[i];
            if ((fn && ev.handler === fn) || (!fn && ev.name === event)) {
                events.splice(i, 1);
            } else {
                i++;
            }
        }
        return this;
    };
    can.dispatch = function (event) {
        if (!this.__bindEvents) {
            return;
        }
        var eventName = event.type.split(".")[0], handlers = this.__bindEvents[eventName] || [], self = this, args = [event].concat(event.data || []);
        can.each(handlers, function (i, ev) {
            event.data = args.slice(1);
            ev.handler.apply(self, args);
        });
    };;

    var Y = YUI().use("*");
    can.trim = function (s) {
        return Y.Lang.trim(s);
    };
    can.makeArray = function (arr) {
        return Y.Array(arr);
    };
    can.isArray = Y.Lang.isArray;
    can.inArray = function (item, arr) {
        return Y.Array.indexOf(arr, item);
    };
    can.map = function (arr, fn) {
        return Y.Array.map(can.makeArray(arr || []), fn);
    };
    can.each = function (elements, callback) {
        var i, key;
        if (typeof elements.length == "number" && elements.pop) {
            for (i = 0; i < elements.length; i++) {
                if (callback(i, elements[i]) === false) {
                    return elements;
                }
            }
        } else {
            for (key in elements) {
                if (callback(key, elements[key]) === false) {
                    return elements;
                }
            }
        }
        return elements;
    };
    can.extend = function (first) {
        var deep = first === true ? 1 : 0, target = arguments[deep], i = deep + 1, arg;
        for (; arg = arguments[i]; i++) {
            Y.mix(target, arg, true, null, null, !!deep);
        }
        return target;
    };
    can.param = function (object) {
        return Y.QueryString.stringify(object);
    };
    can.isEmptyObject = function (object) {
        return Y.Object.isEmpty(object);
    };
    can.proxy = function (func, context) {
        return Y.bind.apply(Y, arguments);
    };
    can.isFunction = function (f) {
        return Y.Lang.isFunction(f);
    };
    var prepareNodeList = function (nodelist) {
        nodelist.each(function (node, i) {
            nodelist[i] = node.getDOMNode();
        });
        nodelist.length = nodelist.size();
        return nodelist;
    };
    can.$ = function (selector) {
        if (selector === window) {
            return window;
        } else {
            if (selector instanceof Y.NodeList) {
                return prepareNodeList(selector);
            } else {
                if (typeof selector === "object" && !can.isArray(selector) && typeof selector.nodeType === "undefined" && !selector.getDOMNode) {
                    return selector;
                } else {
                    return prepareNodeList(Y.all(selector));
                }
            }
        }
    };
    can.get = function (wrapped, index) {
        return wrapped._nodes[index];
    };
    can.buildFragment = function (frags, nodes) {
        var owner = nodes.length && nodes[0].ownerDocument, frag = Y.Node.create(frags[0], owner);
        frag = (frag && frag.getDOMNode()) || document.createDocumentFragment();
        if (frag.nodeType !== 11) {
            var tmp = document.createDocumentFragment();
            tmp.appendChild(frag);
            frag = tmp;
        }
        return {fragment:frag};
    };
    can.append = function (wrapped, html) {
        wrapped.each(function (node) {
            if (typeof html === "string") {
                html = can.buildFragment([html], []).fragment;
            }
            node.append(html);
        });
    };
    can.addClass = function (wrapped, className) {
        return wrapped.addClass(className);
    };
    can.data = function (wrapped, key, value) {
        if (value === undefined) {
            return wrapped.item(0).getData(key);
        } else {
            return wrapped.item(0).setData(key, value);
        }
    };
    can.remove = function (wrapped) {
        return wrapped.remove() && wrapped.destroy();
    };
    var destroy = Y.Node.prototype.destroy;
    Y.Node.prototype.destroy = function () {
        can.trigger(this, "destroyed", [], false);
        destroy.apply(this, arguments);
    };
    Y.NodeList.addMethod("destroy", Y.Node.prototype.destroy);
    var optionsMap = {type:"method", success:undefined, error:undefined};
    var updateDeferred = function (request, d) {
        if (request && request.io) {
            var xhr = request.io;
            for (var prop in xhr) {
                if (typeof d[prop] == "function") {
                    d[prop] = function () {
                        xhr[prop].apply(xhr, arguments);
                    };
                } else {
                    d[prop] = prop[xhr];
                }
            }
        }
    };
    can.ajax = function (options) {
        var d = can.Deferred(), requestOptions = can.extend({}, options);
        for (var option in optionsMap) {
            if (requestOptions[option] !== undefined) {
                requestOptions[optionsMap[option]] = requestOptions[option];
                delete requestOptions[option];
            }
        }
        requestOptions.sync = !options.async;
        var success = options.success, error = options.error;
        requestOptions.on = {success:function (transactionid, response) {
            var data = response.responseText;
            if (options.dataType === "json") {
                data = eval("(" + data + ")");
            }
            updateDeferred(request, d);
            d.resolve(data, "success", request);
            success && success(data, "success", request);
        }, failure:function (transactionid, response) {
            updateDeferred(request, d);
            d.reject(request, "error");
            error && error(request, "error");
        }};
        var request = Y.io(requestOptions.url, requestOptions);
        updateDeferred(request, d);
        return d;
    };
    var id = 0, addBinding = function (nodelist, selector, ev, cb) {
        if (nodelist instanceof Y.NodeList || !nodelist.on || nodelist.getDOMNode) {
            nodelist.each(function (node) {
                var node = can.$(node);
                var events = can.data(node, "events"), eventName = ev + ":" + selector;
                if (!events) {
                    can.data(node, "events", events = {});
                }
                if (!events[eventName]) {
                    events[eventName] = {};
                }
                if (cb.__bindingsIds === undefined) {
                    cb.__bindingsIds = id++;
                }
                events[eventName][cb.__bindingsIds] = selector ? node.item(0).delegate(ev, cb, selector) : node.item(0).on(ev, cb);
            });
        } else {
            var obj = nodelist, events = obj.__canEvents = obj.__canEvents || {};
            if (!events[ev]) {
                events[ev] = {};
            }
            if (cb.__bindingsIds === undefined) {
                cb.__bindingsIds = id++;
            }
            events[ev][cb.__bindingsIds] = obj.on(ev, cb);
        }
    }, removeBinding = function (nodelist, selector, ev, cb) {
        if (nodelist instanceof Y.NodeList || !nodelist.on || nodelist.getDOMNode) {
            nodelist.each(function (node) {
                var node = can.$(node), events = can.data(node, "events"), eventName = ev + ":" + selector, handlers = events[eventName], handler = handlers[cb.__bindingsIds];
                handler.detach();
                delete handlers[cb.__bindingsIds];
                if (can.isEmptyObject(handlers)) {
                    delete events[ev];
                }
                if (can.isEmptyObject(events)) {
                }
            });
        } else {
            var obj = nodelist, events = obj.__canEvents || {}, handlers = events[ev], handler = handlers[cb.__bindingsIds];
            handler.detach();
            delete handlers[cb.__bindingsIds];
            if (can.isEmptyObject(handlers)) {
                delete events[ev];
            }
            if (can.isEmptyObject(events)) {
            }
        }
    };
    can.bind = function (ev, cb) {
        if (this.bind && this.bind !== can.bind) {
            this.bind(ev, cb);
        } else {
            if (this.on || this.nodeType) {
                addBinding(can.$(this), undefined, ev, cb);
            } else {
                if (this.addEvent) {
                    this.addEvent(ev, cb);
                } else {
                    can.addEvent.call(this, ev, cb);
                }
            }
        }
        return this;
    };
    can.unbind = function (ev, cb) {
        if (this.unbind && this.unbind !== can.unbind) {
            this.unbind(ev, cb);
        } else {
            if (this.on || this.nodeType) {
                removeBinding(can.$(this), undefined, ev, cb);
            } else {
                can.removeEvent.call(this, ev, cb);
            }
        }
        return this;
    };
    can.trigger = function (item, event, args, bubble) {
        if (item instanceof Y.NodeList) {
            item = item.item(0);
        }
        if (item.getDOMNode) {
            item = item.getDOMNode();
        }
        if (item.nodeName) {
            item = Y.Node(item);
            if (bubble === false) {
                item.once(event, function (ev) {
                    ev.preventDefault();
                });
            }
            realTrigger(item.getDOMNode(), event, {});
        } else {
            if (typeof event === "string") {
                event = {type:event};
            }
            event.target = event.target || item;
            event.data = args;
            can.dispatch.call(item, event);
        }
    };
    Y.mix(Y.Node.DOM_EVENTS, {destroyed:true});
    can.delegate = function (selector, ev, cb) {
        if (this.on || this.nodeType) {
            addBinding(can.$(this), selector, ev, cb);
        } else {
            if (this.delegate) {
                this.delegate(selector, ev, cb);
            }
        }
        return this;
    };
    can.undelegate = function (selector, ev, cb) {
        if (this.on || this.nodeType) {
            removeBinding(can.$(this), selector, ev, cb);
        } else {
            if (this.undelegate) {
                this.undelegate(selector, ev, cb);
            }
        }
        return this;
    };
    var leaveRe = /mouse(enter|leave)/, _fix = function (_, p) {
        return "mouse" + (p == "enter" ? "over" : "out");
    }, realTrigger = document.createEvent ? function (n, e, a) {
        var ev = document.createEvent("HTMLEvents");
        e = e.replace(leaveRe, _fix);
        ev.initEvent(e, true, true);
        a && can.extend(ev, a);
        n.dispatchEvent(ev);
    } : function (n, e, a) {
        var ev = "on" + e, stop = false, lc = e.toLowerCase(), node = n;
        try {
            n.fireEvent(ev);
        }
        catch (er) {
            var evdata = can.extend({type:e, target:n, faux:true, _stopper:function () {
                stop = this.cancelBubble;
            }}, a);
            can.isFunction(n[ev]) && n[ev](evdata);
            while (!stop && n !== document && n.parentNode) {
                n = n.parentNode;
                can.isFunction(n[ev]) && n[ev](evdata);
            }
        }
    };
    can.Y = Y;;

;

    var Deferred = function (func) {
        if (!(this instanceof Deferred)) {
            return new Deferred();
        }
        this._doneFuncs = [];
        this._failFuncs = [];
        this._resultArgs = null;
        this._status = "";
        func && func.call(this, this);
    };
    can.Deferred = Deferred;
    can.when = Deferred.when = function () {
        var args = can.makeArray(arguments);
        if (args.length < 2) {
            var obj = args[0];
            if (obj && (can.isFunction(obj.isResolved) && can.isFunction(obj.isRejected))) {
                return obj;
            } else {
                return Deferred().resolve(obj);
            }
        } else {
            var df = Deferred(), done = 0, rp = [];
            can.each(args, function (j, arg) {
                arg.done(function () {
                    rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
                    if (++done == args.length) {
                        df.resolve.apply(df, rp);
                    }
                }).fail(function () {
                    df.reject(arguments);
                });
            });
            return df;
        }
    };
    var resolveFunc = function (type, _status) {
        return function (context) {
            var args = this._resultArgs = (arguments.length > 1) ? arguments[1] : [];
            return this.exec(context, this[type], args, _status);
        };
    }, doneFunc = function (type, _status) {
        return function () {
            var self = this;
            can.each(arguments, function (i, v, args) {
                if (!v) {
                    return;
                }
                if (v.constructor === Array) {
                    args.callee.apply(self, v);
                } else {
                    if (self._status === _status) {
                        v.apply(self, self._resultArgs || []);
                    }
                    self[type].push(v);
                }
            });
            return this;
        };
    };
    can.extend(Deferred.prototype, {pipe:function (done, fail) {
        var d = can.Deferred();
        this.done(function () {
            d.resolve(done.apply(this, arguments));
        });
        this.fail(function () {
            if (fail) {
                d.reject(fail.apply(this, arguments));
            } else {
                d.reject.apply(d, arguments);
            }
        });
        return d;
    }, resolveWith:resolveFunc("_doneFuncs", "rs"), rejectWith:resolveFunc("_failFuncs", "rj"), done:doneFunc("_doneFuncs", "rs"), fail:doneFunc("_failFuncs", "rj"), always:function () {
        var args = can.makeArray(arguments);
        if (args.length && args[0]) {
            this.done(args[0]).fail(args[0]);
        }
        return this;
    }, then:function () {
        var args = can.makeArray(arguments);
        if (args.length > 1 && args[1]) {
            this.fail(args[1]);
        }
        if (args.length && args[0]) {
            this.done(args[0]);
        }
        return this;
    }, isResolved:function () {
        return this._status === "rs";
    }, isRejected:function () {
        return this._status === "rj";
    }, reject:function () {
        return this.rejectWith(this, arguments);
    }, resolve:function () {
        return this.resolveWith(this, arguments);
    }, exec:function (context, dst, args, st) {
        if (this._status !== "") {
            return this;
        }
        this._status = st;
        can.each(dst, function (i, d) {
            d.apply(context, args);
        });
        return this;
    }});;

    var undHash = /_|-/, colons = /==/, words = /([A-Z]+)([A-Z][a-z])/g, lowUp = /([a-z\d])([A-Z])/g, dash = /([a-z\d])([A-Z])/g, replacer = /\{([^\}]+)\}/g, quote = /"/g, singleQuote = /'/g, getNext = function (obj, prop, add) {
        return prop in obj ? obj[prop] : (add && (obj[prop] = {}));
    }, isContainer = function (current) {
        return /^f|^o/.test(typeof current);
    };
    can.extend(can, {esc:function (content) {
        return ("" + content).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(quote, "&#34;").replace(singleQuote, "&#39;");
    }, getObject:function (name, roots, add) {
        var parts = name ? name.split(".") : [], length = parts.length, current, r = 0, ret, i;
        roots = can.isArray(roots) ? roots : [roots || window];
        if (!length) {
            return roots[0];
        }
        while (current = roots[r++]) {
            for (i = 0; i < length - 1 && isContainer(current); i++) {
                current = getNext(current, parts[i], add);
            }
            if (isContainer(current)) {
                ret = getNext(current, parts[i], add);
                if (ret !== undefined) {
                    if (add === false) {
                        delete current[parts[i]];
                    }
                    return ret;
                }
            }
        }
    }, capitalize:function (s, cache) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }, underscore:function (s) {
        return s.replace(colons, "/").replace(words, "$1_$2").replace(lowUp, "$1_$2").replace(dash, "_").toLowerCase();
    }, sub:function (str, data, remove) {
        var obs = [];
        obs.push(str.replace(replacer, function (whole, inside) {
            var ob = can.getObject(inside, data, remove);
            if (isContainer(ob)) {
                obs.push(ob);
                return "";
            } else {
                return "" + ob;
            }
        }));
        return obs.length <= 1 ? obs[0] : obs;
    }, replacer:replacer, undHash:undHash});;

    var initializing = 0;
    can.Construct = function () {
        if (arguments.length) {
            return can.Construct.extend.apply(can.Construct, arguments);
        }
    };
    can.extend(can.Construct, {newInstance:function () {
        var inst = this.instance(), arg = arguments, args;
        if (inst.setup) {
            args = inst.setup.apply(inst, arguments);
        }
        if (inst.init) {
            inst.init.apply(inst, args || arguments);
        }
        return inst;
    }, _inherit:function (newProps, oldProps, addTo) {
        can.extend(addTo || newProps, newProps || {});
    }, setup:function (base, fullName) {
        this.defaults = can.extend(true, {}, base.defaults, this.defaults);
    }, instance:function () {
        initializing = 1;
        var inst = new this();
        initializing = 0;
        return inst;
    }, extend:function (fullName, klass, proto) {
        if (typeof fullName != "string") {
            proto = klass;
            klass = fullName;
            fullName = null;
        }
        if (!proto) {
            proto = klass;
            klass = null;
        }
        proto = proto || {};
        var _super_class = this, _super = this.prototype, string = can, name, shortName, namespace, prototype;
        prototype = this.instance();
        this._inherit(proto, _super, prototype);
        function Constructor() {
            if (!initializing) {
                return this.constructor !== Constructor && arguments.length ? arguments.callee.extend.apply(arguments.callee, arguments) : this.constructor.newInstance.apply(this.constructor, arguments);
            }
        }
        for (name in this) {
            if (this.hasOwnProperty(name)) {
                Constructor[name] = this[name];
            }
        }
        this._inherit(klass, this, Constructor);
        if (fullName) {
            var parts = fullName.split("."), shortName = parts.pop(), current = can.getObject(parts.join("."), window, true), namespace = current, _fullName = can.underscore(fullName.replace(/\./g, "_")), _shortName = can.underscore(shortName);
            if (current[shortName]) {
                ;
            }
            current[shortName] = Constructor;
        }
        can.extend(Constructor, {prototype:prototype, namespace:namespace, shortName:shortName, _shortName:_shortName, _fullName:_fullName, constructor:Constructor, fullName:fullName});
        Constructor.prototype.constructor = Constructor;
        var t = [_super_class].concat(can.makeArray(arguments)), args = Constructor.setup.apply(Constructor, t);
        if (Constructor.init) {
            Constructor.init.apply(Constructor, args || t);
        }
        return Constructor;
    }});;

    var canMakeObserve = function (obj) {
        return obj && typeof obj === "object" && !(obj instanceof Date);
    }, unhookup = function (items, namespace) {
        return can.each(items, function (i, item) {
            if (item && item.unbind) {
                item.unbind("change" + namespace);
            }
        });
    }, hookupBubble = function (val, prop, parent) {
        if (val instanceof Observe) {
            unhookup([val], parent._namespace);
        } else {
            if (can.isArray(val)) {
                val = new Observe.List(val);
            } else {
                val = new Observe(val);
            }
        }
        val.bind("change" + parent._namespace, function (ev, attr) {
            var args = can.makeArray(arguments), ev = args.shift();
            args[0] = prop === "*" ? parent.indexOf(val) + "." + args[0] : prop + "." + args[0];
            can.trigger(parent, ev, args);
        });
        return val;
    }, observeId = 0, collecting = undefined, collect = function () {
        if (!collecting) {
            collecting = [];
            return true;
        }
    }, batchTrigger = function (item, event, args) {
        if (!item._init) {
            if (!collecting) {
                return can.trigger(item, event, args);
            } else {
                collecting.push([item, {type:event, batchNum:batchNum}, args]);
            }
        }
    }, batchNum = 1, sendCollection = function () {
        var items = collecting.slice(0);
        collecting = undefined;
        batchNum++;
        can.each(items, function (i, item) {
            can.trigger.apply(can, item);
        });
    }, serialize = function (observe, how, where) {
        observe.each(function (name, val) {
            where[name] = canMakeObserve(val) && can.isFunction(val[how]) ? val[how]() : val;
        });
        return where;
    }, $method = function (name) {
        return function () {
            return can[name].apply(this, arguments);
        };
    }, bind = $method("addEvent"), unbind = $method("removeEvent"), attrParts = function (attr) {
        return can.isArray(attr) ? attr : ("" + attr).split(".");
    };
    var Observe = can.Construct("can.Observe", {setup:function () {
        can.Construct.setup.apply(this, arguments);
    }, bind:bind, unbind:unbind, id:"id"}, {setup:function (obj) {
        this._data = {};
        this._namespace = ".observe" + (++observeId);
        this._init = 1;
        this.attr(obj);
        delete this._init;
    }, attr:function (attr, val) {
        if (!~"ns".indexOf((typeof attr).charAt(0))) {
            return this._attrs(attr, val);
        } else {
            if (val === undefined) {
                Observe.__reading && Observe.__reading(this, attr);
                return this._get(attr);
            } else {
                this._set(attr, val);
                return this;
            }
        }
    }, each:function () {
        return can.each.apply(undefined, [this.__get()].concat(can.makeArray(arguments)));
    }, removeAttr:function (attr) {
        var parts = attrParts(attr), prop = parts.shift(), current = this._data[prop];
        if (parts.length) {
            return current.removeAttr(parts);
        } else {
            delete this._data[prop];
            if (!(prop in this.constructor.prototype)) {
                delete this[prop];
            }
            batchTrigger(this, "change", [prop, "remove", undefined, current]);
            batchTrigger(this, prop, undefined, current);
            return current;
        }
    }, _get:function (attr) {
        var parts = attrParts(attr), current = this.__get(parts.shift());
        return parts.length ? current ? current._get(parts) : undefined : current;
    }, __get:function (attr) {
        return attr ? this._data[attr] : this._data;
    }, _set:function (attr, value) {
        var parts = attrParts(attr), prop = parts.shift(), current = this.__get(prop);
        if (canMakeObserve(current) && parts.length) {
            current._set(parts, value);
        } else {
            if (!parts.length) {
                if (this.__convert) {
                    value = this.__convert(prop, value);
                }
                this.__set(prop, value, current);
            } else {
                throw "can.Observe: Object does not exist";
            }
        }
    }, __set:function (prop, value, current) {
        if (value !== current) {
            var changeType = this.__get().hasOwnProperty(prop) ? "set" : "add";
            this.___set(prop, canMakeObserve(value) ? hookupBubble(value, prop, this) : value);
            batchTrigger(this, "change", [prop, changeType, value, current]);
            batchTrigger(this, prop, value, current);
            current && unhookup([current], this._namespace);
        }
    }, ___set:function (prop, val) {
        this._data[prop] = val;
        if (!(prop in this.constructor.prototype)) {
            this[prop] = val;
        }
    }, bind:bind, unbind:unbind, serialize:function () {
        return serialize(this, "serialize", {});
    }, _attrs:function (props, remove) {
        if (props === undefined) {
            return serialize(this, "attr", {});
        }
        props = can.extend(true, {}, props);
        var prop, collectingStarted = collect(), self = this, newVal;
        this.each(function (prop, curVal) {
            newVal = props[prop];
            if (newVal === undefined) {
                remove && self.removeAttr(prop);
                return;
            }
            if (canMakeObserve(curVal) && canMakeObserve(newVal)) {
                curVal.attr(newVal, remove);
            } else {
                if (curVal != newVal) {
                    self._set(prop, newVal);
                } else {
                }
            }
            delete props[prop];
        });
        for (var prop in props) {
            newVal = props[prop];
            this._set(prop, newVal);
        }
        if (collectingStarted) {
            sendCollection();
        }
        return this;
    }});
    var splice = [].splice, list = Observe("can.Observe.List", {setup:function (instances, options) {
        this.length = 0;
        this._namespace = ".observe" + (++observeId);
        this._init = 1;
        this.bind("change", can.proxy(this._changes, this));
        this.push.apply(this, can.makeArray(instances || []));
        can.extend(this, options);
        delete this._init;
    }, _changes:function (ev, attr, how, newVal, oldVal) {
        if (!~attr.indexOf(".")) {
            if (how === "add") {
                batchTrigger(this, how, [newVal, +attr]);
                batchTrigger(this, "length", [this.length]);
            } else {
                if (how === "remove") {
                    batchTrigger(this, how, [oldVal, +attr]);
                    batchTrigger(this, "length", [this.length]);
                } else {
                    batchTrigger(this, how, [newVal, +attr]);
                }
            }
        }
    }, __get:function (attr) {
        return attr ? this[attr] : this;
    }, ___set:function (attr, val) {
        this[attr] = val;
        if (+attr >= this.length) {
            this.length = (+attr + 1);
        }
    }, serialize:function () {
        return serialize(this, "serialize", []);
    }, splice:function (index, howMany) {
        var args = can.makeArray(arguments), i;
        for (i = 2; i < args.length; i++) {
            var val = args[i];
            if (canMakeObserve(val)) {
                args[i] = hookupBubble(val, "*", this);
            }
        }
        if (howMany === undefined) {
            howMany = args[1] = this.length - index;
        }
        var removed = splice.apply(this, args);
        if (howMany > 0) {
            batchTrigger(this, "change", ["" + index, "remove", undefined, removed]);
            unhookup(removed, this._namespace);
        }
        if (args.length > 2) {
            batchTrigger(this, "change", ["" + index, "add", args.slice(2), removed]);
        }
        return removed;
    }, _attrs:function (props, remove) {
        if (props === undefined) {
            return serialize(this, "attr", []);
        }
        props = props.slice(0);
        var len = Math.min(props.length, this.length), collectingStarted = collect(), prop;
        for (var prop = 0; prop < len; prop++) {
            var curVal = this[prop], newVal = props[prop];
            if (canMakeObserve(curVal) && canMakeObserve(newVal)) {
                curVal.attr(newVal, remove);
            } else {
                if (curVal != newVal) {
                    this._set(prop, newVal);
                } else {
                }
            }
        }
        if (props.length > this.length) {
            this.push(props.slice(this.length));
        } else {
            if (props.length < this.length && remove) {
                this.splice(props.length);
            }
        }
        if (collectingStarted) {
            sendCollection();
        }
    }}), getArgs = function (args) {
        return args[0] && can.isArray(args[0]) ? args[0] : can.makeArray(args);
    };
    can.each({push:"length", unshift:0}, function (name, where) {
        list.prototype[name] = function () {
            var args = getArgs(arguments), len = where ? this.length : 0;
            for (var i = 0; i < args.length; i++) {
                var val = args[i];
                if (canMakeObserve(val)) {
                    args[i] = hookupBubble(val, "*", this);
                }
            }
            var res = [][name].apply(this, args);
            if (!this.comparator || !args.length) {
                batchTrigger(this, "change", ["" + len, "add", args, undefined]);
            }
            return res;
        };
    });
    can.each({pop:"length", shift:0}, function (name, where) {
        list.prototype[name] = function () {
            var args = getArgs(arguments), len = where && this.length ? this.length - 1 : 0;
            var res = [][name].apply(this, args);
            batchTrigger(this, "change", ["" + len, "remove", undefined, [res]]);
            if (res && res.unbind) {
                res.unbind("change" + this._namespace);
            }
            return res;
        };
    });
    list.prototype.indexOf = [].indexOf || function (item) {
        return can.inArray(item, this);
    };;

    var pipe = function (def, model, func) {
        var d = new can.Deferred();
        def.then(function () {
            arguments[0] = model[func](arguments[0]);
            d.resolve.apply(d, arguments);
        }, function () {
            d.resolveWith.apply(this, arguments);
        });
        return d;
    }, modelNum = 0, ignoreHookup = /change.observe\d+/, getId = function (inst) {
        return inst[inst.constructor.id];
    }, ajax = function (ajaxOb, data, type, dataType, success, error) {
        if (typeof ajaxOb == "string") {
            var parts = ajaxOb.split(" ");
            ajaxOb = {url:parts.pop()};
            if (parts.length) {
                ajaxOb.type = parts.pop();
            }
        }
        ajaxOb.data = typeof data == "object" && !can.isArray(data) ? can.extend(ajaxOb.data || {}, data) : data;
        ajaxOb.url = can.sub(ajaxOb.url, ajaxOb.data, true);
        return can.ajax(can.extend({type:type || "post", dataType:dataType || "json", success:success, error:error}, ajaxOb));
    }, makeRequest = function (self, type, success, error, method) {
        var deferred, args = [self.serialize()], model = self.constructor, jqXHR;
        if (type == "destroy") {
            args.shift();
        }
        if (type !== "create") {
            args.unshift(getId(self));
        }
        jqXHR = model[type].apply(model, args);
        deferred = jqXHR.pipe(function (data) {
            self[method || type + "d"](data, jqXHR);
            return self;
        });
        if (jqXHR.abort) {
            deferred.abort = function () {
                jqXHR.abort();
            };
        }
        return deferred.then(success, error);
    }, ajaxMethods = {create:{url:"_shortName", type:"post"}, update:{data:function (id, attrs) {
        attrs = attrs || {};
        var identity = this.id;
        if (attrs[identity] && attrs[identity] !== id) {
            attrs["new" + can.capitalize(id)] = attrs[identity];
            delete attrs[identity];
        }
        attrs[identity] = id;
        return attrs;
    }, type:"put"}, destroy:{type:"delete", data:function (id) {
        return {}[this.id] = id;
    }}, findAll:{url:"_shortName"}, findOne:{}}, ajaxMaker = function (ajaxMethod, str) {
        return function (data) {
            data = ajaxMethod.data ? ajaxMethod.data.apply(this, arguments) : data;
            return ajax(str || this[ajaxMethod.url || "_url"], data, ajaxMethod.type || "get");
        };
    };
    can.Observe("can.Model", {setup:function () {
        can.Observe.apply(this, arguments);
        if (this === can.Model) {
            return;
        }
        var self = this;
        can.each(ajaxMethods, function (name, method) {
            if (!can.isFunction(self[name])) {
                self[name] = ajaxMaker(method, self[name]);
            }
        });
        var clean = can.proxy(this._clean, self);
        can.each({findAll:"models", findOne:"model"}, function (name, method) {
            var old = self[name];
            self[name] = function (params, success, error) {
                self._reqs++;
                return pipe(old.call(self, params), self, method).then(success, error).then(clean, clean);
            };
        });
        var oldFindAll;
        if (self.fullName == "can.Model") {
            self.fullName = "Model" + (++modelNum);
        }
        this.store = {};
        this._reqs = 0;
        this._url = this._shortName + "/{" + this.id + "}";
    }, _clean:function () {
        this._reqs--;
        if (!this._reqs) {
            for (var id in this.store) {
                if (!this.store[id]._bindings) {
                    delete this.store[id];
                }
            }
        }
    }, models:function (instancesRawData) {
        if (!instancesRawData) {
            return;
        }
        var self = this, res = new (self.List || ML), arr = can.isArray(instancesRawData), ml = (instancesRawData instanceof ML), raw = arr ? instancesRawData : (ml ? instancesRawData.serialize() : instancesRawData.data), i = 0;
        if (!raw.length) {
            ;
        }
        can.each(raw, function (i, rawPart) {
            res.push(self.model(rawPart));
        });
        if (!arr) {
            can.each(instancesRawData, function (prop, val) {
                if (prop !== "data") {
                    res[prop] = val;
                }
            });
        }
        return res;
    }, model:function (attributes) {
        if (!attributes) {
            return;
        }
        if (attributes instanceof this) {
            attributes = attributes.serialize();
        }
        var model = this.store[attributes.id] || new this(attributes);
        if (this._reqs) {
            this.store[attributes.id] = model;
        }
        return model;
    }}, {isNew:function () {
        var id = getId(this);
        return !(id || id === 0);
    }, save:function (success, error) {
        return makeRequest(this, this.isNew() ? "create" : "update", success, error);
    }, destroy:function (success, error) {
        return makeRequest(this, "destroy", success, error, "destroyed");
    }, bind:function (eventName) {
        if (!ignoreHookup.test(eventName)) {
            if (!this._bindings) {
                this.constructor.store[getId(this)] = this;
                this._bindings = 0;
            }
            this._bindings++;
        }
        return can.Observe.prototype.bind.apply(this, arguments);
    }, unbind:function (eventName) {
        if (!ignoreHookup.test(eventName)) {
            this._bindings--;
            if (!this._bindings) {
                delete this.constructor.store[getId(this)];
            }
        }
        return can.Observe.prototype.unbind.apply(this, arguments);
    }, ___set:function (prop, val) {
        can.Observe.prototype.___set.call(this, prop, val);
        if (prop === this.constructor.id && this._bindings) {
            this.constructor.store[getId(this)] = this;
        }
    }});
    can.each(["created", "updated", "destroyed"], function (i, funcName) {
        can.Model.prototype[funcName] = function (attrs) {
            var stub, constructor = this.constructor;
            stub = attrs && typeof attrs == "object" && this.attr(attrs.attr ? attrs.attr() : attrs);
            can.trigger(this, funcName);
            can.trigger(this, "change", funcName);
            ;
            can.trigger(constructor, funcName, this);
        };
    });
    var ML = can.Observe.List("can.Model.List", {setup:function () {
        can.Observe.List.prototype.setup.apply(this, arguments);
        var self = this;
        this.bind("change", function (ev, how) {
            if (/\w+\.destroyed/.test(how)) {
                self.splice(self.indexOf(ev.target), 1);
            }
        });
    }});;

    var digitTest = /^\d+$/, keyBreaker = /([^\[\]]+)|(\[\])/g, paramTest = /([^?#]*)(#.*)?$/, prep = function (str) {
        return decodeURIComponent(str.replace(/\+/g, " "));
    };
    can.extend(can, {deparam:function (params) {
        var data = {}, pairs;
        if (params && paramTest.test(params)) {
            pairs = params.split("&"), can.each(pairs, function (i, pair) {
                var parts = pair.split("="), key = prep(parts.shift()), value = prep(parts.join("="));
                current = data;
                parts = key.match(keyBreaker);
                for (var j = 0, l = parts.length - 1; j < l; j++) {
                    if (!current[parts[j]]) {
                        current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] == "[]" ? [] : {};
                    }
                    current = current[parts[j]];
                }
                lastPart = parts.pop();
                if (lastPart == "[]") {
                    current.push(value);
                } else {
                    current[lastPart] = value;
                }
            });
        }
        return data;
    }});;

    var matcher = /\:([\w\.]+)/g, paramsMatcher = /^(?:&[^=]+=[^&]*)+/, makeProps = function (props) {
        return can.map(props, function (val, name) {
            return (name === "className" ? "class" : name) + "=\"" + can.esc(val) + "\"";
        }).join(" ");
    }, matchesData = function (route, data) {
        var count = 0, i = 0;
        for (; i < route.names.length; i++) {
            if (!data.hasOwnProperty(route.names[i])) {
                return -1;
            }
            count++;
        }
        return count;
    }, onready = !0, location = window.location, each = can.each, extend = can.extend;
    can.route = function (url, defaults) {
        var names = [], test = url.replace(matcher, function (whole, name) {
            names.push(name);
            return "([^\\/\\&]*)";
        });
        can.route.routes[url] = {test:new RegExp("^" + test + "($|&)"), route:url, names:names, defaults:defaults || {}, length:url.split("/").length};
        return can.route;
    };
    extend(can.route, {param:function (data) {
        delete data.route;
        var route, matches = 0, matchCount, routeName = data.route;
        if (!(routeName && (route = can.route.routes[routeName]))) {
            each(can.route.routes, function (name, temp) {
                matchCount = matchesData(temp, data);
                if (matchCount > matches) {
                    route = temp;
                    matches = matchCount;
                }
            });
        }
        if (route) {
            var cpy = extend({}, data), res = route.route.replace(matcher, function (whole, name) {
                delete cpy[name];
                return data[name] === route.defaults[name] ? "" : encodeURIComponent(data[name]);
            }), after;
            each(route.defaults, function (name, val) {
                if (cpy[name] === val) {
                    delete cpy[name];
                }
            });
            after = can.param(cpy);
            return res + (after ? "&" + after : "");
        }
        return can.isEmptyObject(data) ? "" : "&" + can.param(data);
    }, deparam:function (url) {
        var route = {length:-1};
        each(can.route.routes, function (name, temp) {
            if (temp.test.test(url) && temp.length > route.length) {
                route = temp;
            }
        });
        if (route.length > -1) {
            var parts = url.match(route.test), start = parts.shift(), remainder = url.substr(start.length - (parts[parts.length - 1] === "&" ? 1 : 0)), obj = (remainder && paramsMatcher.test(remainder)) ? can.deparam(remainder.slice(1)) : {};
            obj = extend(true, {}, route.defaults, obj);
            each(parts, function (i, part) {
                if (part && part !== "&") {
                    obj[route.names[i]] = decodeURIComponent(part);
                }
            });
            obj.route = route.route;
            return obj;
        }
        if (url.charAt(0) !== "&") {
            url = "&" + url;
        }
        return paramsMatcher.test(url) ? can.deparam(url.slice(1)) : {};
    }, data:new can.Observe({}), routes:{}, ready:function (val) {
        if (val === false) {
            onready = val;
        }
        if (val === true || onready === true) {
            setState();
        }
        return can.route;
    }, url:function (options, merge) {
        if (merge) {
            options = extend({}, curParams, options);
        }
        return "#!" + can.route.param(options);
    }, link:function (name, options, props, merge) {
        return "<a " + makeProps(extend({href:can.route.url(options, merge)}, props)) + ">" + name + "</a>";
    }, current:function (options) {
        return location.hash == "#!" + can.route.param(options);
    }});
    each(["bind", "unbind", "delegate", "undelegate", "attr", "removeAttr"], function (i, name) {
        can.route[name] = function () {
            return can.route.data[name].apply(can.route.data, arguments);
        };
    });
    var timer, curParams, setState = function () {
        curParams = can.route.deparam(location.hash.split(/#!?/).pop());
        can.route.attr(curParams, true);
    };
    can.bind.call(window, "hashchange", setState);
    can.route.bind("change", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            location.hash = "#!" + can.route.param(can.route.data.serialize());
        }, 1);
    });
    can.bind.call(document, "ready", can.route.ready);;

    var bind = function (el, ev, callback) {
        can.bind.call(el, ev, callback);
        return function () {
            can.unbind.call(el, ev, callback);
        };
    }, isFunction = can.isFunction, extend = can.extend, each = can.each, slice = [].slice, special = can.getObject("$.event.special") || {}, delegate = function (el, selector, ev, callback) {
        can.delegate.call(el, selector, ev, callback);
        return function () {
            can.undelegate.call(el, selector, ev, callback);
        };
    }, binder = function (el, ev, callback, selector) {
        return selector ? delegate(el, can.trim(selector), ev, callback) : bind(el, ev, callback);
    }, shifter = function shifter(context, name) {
        var method = typeof name == "string" ? context[name] : name;
        return function () {
            context.called = name;
            return method.apply(context, [this.nodeName ? can.$(this) : this].concat(slice.call(arguments, 0)));
        };
    }, basicProcessor;
    can.Construct("can.Control", {setup:function () {
        can.Construct.setup.apply(this, arguments);
        if (this !== can.Control) {
            var control = this, funcName;
            control.actions = {};
            for (funcName in control.prototype) {
                if (funcName == "constructor" || !isFunction(control.prototype[funcName])) {
                    continue;
                }
                if (control._isAction(funcName)) {
                    control.actions[funcName] = control._action(funcName);
                }
            }
        }
    }, _isAction:function (methodName) {
        return special[methodName] || processors[methodName] || /[^\w]/.test(methodName);
    }, _action:function (methodName, options) {
        if (options || !/\{([^\}]+)\}/g.test(methodName)) {
            var convertedName = options ? can.sub(methodName, [options, window]) : methodName, arr = can.isArray(convertedName), parts = (arr ? convertedName[1] : convertedName).match(/^(?:(.*?)\s)?([\w\.\:>]+)$/), event = parts[2], processor = processors[event] || basicProcessor;
            return {processor:processor, parts:parts, delegate:arr ? convertedName[0] : undefined};
        }
    }, processors:{}, defaults:{}}, {setup:function (element, options) {
        var cls = this.constructor, pluginname = cls.pluginName || cls._fullName;
        this.element = can.$(element);
        if (pluginname && pluginname !== "can_control") {
            this.element.addClass(pluginname);
        }
        (can.data(this.element, "controls")) || can.data(this.element, "controls", [this]);
        this.options = extend({}, cls.defaults, options);
        this.on();
        return [this.element, this.options];
    }, on:function (el, selector, eventName, func) {
        if (!el) {
            this.off();
            var cls = this.constructor, bindings = this._bindings, actions = cls.actions, element = this.element, destroyCB = shifter(this, "destroy");
            for (funcName in actions) {
                if (actions.hasOwnProperty(funcName)) {
                    ready = actions[funcName] || cls._action(funcName, this.options);
                    bindings.push(ready.processor(ready.delegate || element, ready.parts[2], ready.parts[1], funcName, this));
                }
            }
            can.bind.call(element, "destroyed", destroyCB);
            bindings.push(function (el) {
                can.unbind.call(el, "destroyed", destroyCB);
            });
            return bindings.length;
        }
        if (typeof el == "string") {
            func = eventName;
            eventName = selector;
            selector = el;
            el = this.element;
        }
        if (typeof func == "string") {
            func = shifter(this, func);
        }
        this._bindings.push(binder(el, eventName, func, selector));
        return this._bindings.length;
    }, off:function () {
        var el = this.element[0];
        each(this._bindings || [], function (key, value) {
            value(el);
        });
        this._bindings = [];
    }, destroy:function () {
        var Class = this.constructor, pluginName = Class.pluginName || Class._fullName, controls;
        this.off();
        if (pluginName && pluginName !== "can_control") {
            this.element.removeClass(pluginName);
        }
        controls = can.data(this.element, "controls");
        controls.splice(can.inArray(this, controls), 1);
        can.trigger(this, "destroyed");
        this.element = null;
    }});
    var processors = can.Control.processors, basicProcessor = function (el, event, selector, methodName, control) {
        return binder(el, event, shifter(control, methodName), selector);
    };
    each(["change", "click", "contextmenu", "dblclick", "keydown", "keyup", "keypress", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "reset", "resize", "scroll", "select", "submit", "focusin", "focusout", "mouseenter", "mouseleave"], function (i, v) {
        processors[v] = basicProcessor;
    });;

    can.Control.processors.route = function (el, event, selector, funcName, controller) {
        can.route(selector || "");
        var batchNum, check = function (ev, attr, how) {
            if (can.route.attr("route") === (selector || "") && (ev.batchNum === undefined || ev.batchNum !== batchNum)) {
                batchNum = ev.batchNum;
                var d = can.route.attr();
                delete d.route;
                controller[funcName](d);
            }
        };
        can.route.bind("change", check);
        return function () {
            can.route.unbind("change", check);
        };
    };;

    var toId = function (src) {
        return src.split(/\/|\./g).join("_");
    }, isFunction = can.isFunction, makeArray = can.makeArray, hookupId = 1, $view = can.view = function (view, data, helpers, callback) {
        var result = $view.render(view, data, helpers, callback);
        if (can.isDeferred(result)) {
            return result.pipe(function (result) {
                return $view.frag(result);
            });
        }
        return $view.frag(result);
    };
    can.extend($view, {frag:function (result) {
        var frag = can.buildFragment([result], [document.body]).fragment;
        if (!frag.childNodes.length) {
            frag.appendChild(document.createTextNode(""));
        }
        return $view.hookup(frag);
    }, hookup:function (fragment) {
        var hookupEls = [], id, func, el, i = 0;
        can.each(fragment.childNodes ? can.makeArray(fragment.childNodes) : fragment, function (i, node) {
            if (node.nodeType === 1) {
                hookupEls.push(node);
                hookupEls.push.apply(hookupEls, can.makeArray(node.getElementsByTagName("*")));
            }
        });
        for (; el = hookupEls[i++]; ) {
            if (el.getAttribute && (id = el.getAttribute("data-view-id")) && (func = $view.hookups[id])) {
                func(el, id);
                delete $view.hookups[id];
                el.removeAttribute("data-view-id");
            }
        }
        return fragment;
    }, hookups:{}, hook:function (cb) {
        $view.hookups[++hookupId] = cb;
        return " data-view-id='" + hookupId + "'";
    }, cached:{}, cache:true, register:function (info) {
        this.types["." + info.suffix] = info;
    }, types:{}, ext:".ejs", registerScript:function () {
    }, preload:function () {
    }, render:function (view, data, helpers, callback) {
        if (isFunction(helpers)) {
            callback = helpers;
            helpers = undefined;
        }
        var deferreds = getDeferreds(data);
        if (deferreds.length) {
            var deferred = new can.Deferred();
            deferreds.push(get(view, true));
            can.when.apply(can, deferreds).then(function (resolved) {
                var objs = makeArray(arguments), renderer = objs.pop(), result;
                if (can.isDeferred(data)) {
                    data = usefulPart(resolved);
                } else {
                    for (var prop in data) {
                        if (can.isDeferred(data[prop])) {
                            data[prop] = usefulPart(objs.shift());
                        }
                    }
                }
                result = renderer(data, helpers);
                deferred.resolve(result);
                callback && callback(result);
            });
            return deferred;
        } else {
            var response, async = isFunction(callback), deferred = get(view, async);
            if (async) {
                response = deferred;
                deferred.then(function (renderer) {
                    callback(renderer(data, helpers));
                });
            } else {
                deferred.then(function (renderer) {
                    response = renderer(data, helpers);
                });
            }
            return response;
        }
    }});
    can.isDeferred = function (obj) {
        return obj && isFunction(obj.then) && isFunction(obj.pipe);
    };
    var checkText = function (text, url) {
        if (!text.length) {
            ;
            throw "can.view: No template or empty template:" + url;
        }
    }, get = function (url, async) {
        var suffix = url.match(/\.[\w\d]+$/), type, el, id, jqXHR, response = function (text) {
            var func = type.renderer(id, text), d = new can.Deferred();
            d.resolve(func);
            if ($view.cache) {
                $view.cached[id] = d;
            }
            return d;
        };
        if (el = document.getElementById(url)) {
            suffix = "." + el.type.match(/\/(x\-)?(.+)/)[2];
        }
        if (!suffix) {
            url += (suffix = $view.ext);
        }
        if (can.isArray(suffix)) {
            suffix = suffix[0];
        }
        id = toId(url);
        if (url.match(/^\/\//)) {
            var sub = url.substr(2);
            url = !window.steal ? "/" + sub : steal.root.mapJoin(sub);
        }
        type = $view.types[suffix];
        if ($view.cached[id]) {
            return $view.cached[id];
        } else {
            if (el) {
                return response(el.innerHTML);
            } else {
                var d = new can.Deferred();
                can.ajax({async:async, url:url, dataType:"text", error:function (jqXHR) {
                    checkText("", url);
                    d.reject(jqXHR);
                }, success:function (text) {
                    checkText(text, url);
                    d.resolve(type.renderer(id, text));
                    if ($view.cache) {
                        $view.cached[id] = d;
                    }
                }});
                return d;
            }
        }
    }, getDeferreds = function (data) {
        var deferreds = [];
        if (can.isDeferred(data)) {
            return [data];
        } else {
            for (var prop in data) {
                if (can.isDeferred(data[prop])) {
                    deferreds.push(data[prop]);
                }
            }
        }
        return deferreds;
    }, usefulPart = function (resolved) {
        return can.isArray(resolved) && resolved[1] === "success" ? resolved[0] : resolved;
    };;

    var myEval = function (script) {
        eval(script);
    }, extend = can.extend, quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/, attrReg = /([^\s]+)=$/, attributeReplace = /__!!__/g, tagMap = {"":"span", table:"tr", tr:"td", ol:"li", ul:"li", tbody:"tr", thead:"tr", tfoot:"tr"}, clean = function (content) {
        return content.split("\\").join("\\\\").split("\n").join("\\n").split("\"").join("\\\"").split("\t").join("\\t");
    }, bracketNum = function (content) {
        return (--content.split("{").length) - (--content.split("}").length);
    }, liveBind = function (observed, el, cb) {
        can.each(observed, function (i, ob) {
            ob.obj.bind(ob.attr, cb);
        });
        can.bind.call(el, "destroyed", function () {
            can.each(observed, function (i, ob) {
                ob.obj.unbind(ob.attr, cb);
            });
        });
    }, contentEscape = function (txt) {
        return (typeof txt == "string" || typeof txt == "number") ? can.esc(txt) : contentText(txt);
    }, contentText = function (input) {
        if (typeof input == "string") {
            return input;
        }
        if (!input && input != 0) {
            return "";
        }
        var hook = (input.hookup && function (el, id) {
            input.hookup.call(input, el, id);
        }) || (typeof input == "function" && input);
        if (hook) {
            return can.view.hook(hook);
        }
        return "" + input;
    }, EJS = function (options) {
        if (this.constructor != EJS) {
            var ejs = new EJS(options);
            return function (data, helpers) {
                return ejs.render(data, helpers);
            };
        }
        if (typeof options == "function") {
            this.template = {fn:options};
            return;
        }
        extend(this, options);
        this.template = scan(this.text, this.name);
    };
    can.EJS = EJS;
    EJS.prototype.render = function (object, extraHelpers) {
        object = object || {};
        return this.template.fn.call(object, object, new EJS.Helpers(object, extraHelpers || {}));
    };
    extend(EJS, {txt:function (tagName, status, self, func, escape) {
        if (can.Observe) {
            can.Observe.__reading = function (obj, attr) {
                observed.push({obj:obj, attr:attr});
            };
        }
        var observed = [], input = func.call(self), tag = (tagMap[tagName] || "span");
        if (can.Observe) {
            delete can.Observe.__reading;
        }
        if (!observed.length) {
            return (escape || status !== 0 ? contentEscape : contentText)(input);
        }
        if (status == 0) {
            return "<" + tag + can.view.hook(escape ? function (el) {
                var parent = el.parentNode, node = document.createTextNode(input);
                parent.insertBefore(node, el);
                parent.removeChild(el);
                liveBind(observed, parent, function () {
                    node.nodeValue = func.call(self);
                });
            } : function (span) {
                var makeAndPut = function (val, remove) {
                    var frag = can.view.frag(val), nodes = can.$(can.map(frag.childNodes, function (node) {
                        return node;
                    })), last = remove[remove.length - 1];
                    if (last.nextSibling) {
                        last.parentNode.insertBefore(frag, last.nextSibling);
                    } else {
                        last.parentNode.appendChild(frag);
                    }
                    can.remove(can.$(remove));
                    return nodes;
                }, nodes = makeAndPut(input, [span]);
                liveBind(observed, span.parentNode, function () {
                    nodes = makeAndPut(func.call(self), nodes);
                });
            }) + "></" + tag + ">";
        } else {
            if (status === 1) {
                var attrName = func.call(self).replace(/['"]/g, "").split("=")[0];
                pendingHookups.push(function (el) {
                    liveBind(observed, el, function () {
                        var attr = func.call(self), parts = (attr || "").replace(/['"]/g, "").split("="), newAttrName = parts[0];
                        if ((newAttrName != attrName) && attrName) {
                            el.removeAttribute(attrName);
                        }
                        if (newAttrName) {
                            el.setAttribute(newAttrName, parts[1]);
                        }
                    });
                });
                return input;
            } else {
                pendingHookups.push(function (el) {
                    var wrapped = can.$(el), hooks;
                    (hooks = can.data(wrapped, "hooks")) || can.data(wrapped, "hooks", hooks = {});
                    var attr = el.getAttribute(status), parts = attr.split("__!!__"), hook;
                    if (hooks[status]) {
                        hooks[status].funcs.push(func);
                    } else {
                        hooks[status] = {render:function () {
                            var i = 0, newAttr = attr.replace(attributeReplace, function () {
                                return contentText(hook.funcs[i++].call(self));
                            });
                            return newAttr;
                        }, funcs:[func], batchNum:undefined};
                    }
                    hook = hooks[status];
                    parts.splice(1, 0, input);
                    el.setAttribute(status, parts.join(""));
                    liveBind(observed, el, function (ev) {
                        if (ev.batchNum === undefined || ev.batchNum !== hook.batchNum) {
                            hook.batchNum = ev.batchNum;
                            el.setAttribute(status, hook.render());
                        }
                    });
                });
                return "__!!__";
            }
        }
    }, esc:function (tagName, status, self, func) {
        return EJS.txt(tagName, status, self, func, true);
    }, pending:function () {
        if (pendingHookups.length) {
            var hooks = pendingHookups.slice(0);
            pendingHookups = [];
            return can.view.hook(function (el) {
                can.each(hooks, function (i, fn) {
                    fn(el);
                });
            });
        } else {
            return "";
        }
    }});
    var tokenReg = new RegExp("(" + ["<%%", "%%>", "<%==", "<%=", "<%#", "<%", "%>", "<", ">", "\"", "'"].join("|") + ")"), startTxt = "var ___v1ew = [];", finishTxt = "return ___v1ew.join('')", put_cmd = "___v1ew.push(", insert_cmd = put_cmd, htmlTag = null, quote = null, beforeQuote = null, status = function () {
        return quote ? "'" + beforeQuote.match(attrReg)[1] + "'" : (htmlTag ? 1 : 0);
    }, pendingHookups = [], scan = function (source, name) {
        var tokens = source.replace(/(\r|\n)+/g, "\n").split(tokenReg), content = "", buff = [startTxt], put = function (content, bonus) {
            buff.push(put_cmd, "\"", clean(content), "\"" + (bonus || "") + ");");
        }, endStack = [], lastToken, startTag = null, magicInTag = false, tagName = "", bracketCount, i = 0, token;
        htmlTag = quote = beforeQuote = null;
        for (; (token = tokens[i++]) !== undefined; ) {
            if (startTag === null) {
                switch (token) {
                  case "<%":
                  case "<%=":
                  case "<%==":
                    magicInTag = 1;
                  case "<%#":
                    startTag = token;
                    if (content.length > 0) {
                        put(content);
                    }
                    content = "";
                    break;
                  case "<%%":
                    content += "<%";
                    break;
                  case "<":
                    if (tokens[i].indexOf("!--") !== 0) {
                        htmlTag = 1;
                        magicInTag = 0;
                    }
                    content += token;
                    break;
                  case ">":
                    htmlTag = 0;
                    if (magicInTag) {
                        put(content, ",can.EJS.pending(),\">\"");
                        content = "";
                    } else {
                        content += token;
                    }
                    break;
                  case "'":
                  case "\"":
                    if (htmlTag) {
                        if (quote && quote === token) {
                            quote = null;
                        } else {
                            if (quote === null) {
                                quote = token;
                                beforeQuote = lastToken;
                            }
                        }
                    }
                  default:
                    if (lastToken === "<") {
                        tagName = token.split(" ")[0];
                    }
                    content += token;
                    break;
                }
            } else {
                switch (token) {
                  case "%>":
                    switch (startTag) {
                      case "<%":
                        bracketCount = bracketNum(content);
                        if (bracketCount == 1) {
                            buff.push(insert_cmd, "can.EJS.txt('" + tagName + "'," + status() + ",this,function(){", startTxt, content);
                            endStack.push({before:"", after:finishTxt + "}));"});
                        } else {
                            var last = endStack.length && bracketCount == -1 ? endStack.pop() : {after:";"};
                            if (last.before) {
                                buff.push(last.before);
                            }
                            buff.push(content, ";", last.after);
                        }
                        break;
                      case "<%=":
                      case "<%==":
                        bracketCount = bracketNum(content);
                        if (bracketCount) {
                            endStack.push({before:finishTxt, after:"}));"});
                        }
                        if (quickFunc.test(content)) {
                            var parts = content.match(quickFunc);
                            content = "function(__){var " + parts[1] + "=can.$(__);" + parts[2] + "}";
                        }
                        buff.push(insert_cmd, "can.EJS." + (startTag === "<%=" ? "esc" : "txt") + "('" + tagName + "'," + status() + ",this,function(){ return ", content, bracketCount ? startTxt : "}));");
                        break;
                    }
                    startTag = null;
                    content = "";
                    break;
                  case "<%%":
                    content += "<%";
                    break;
                  default:
                    content += token;
                    break;
                }
            }
            lastToken = token;
        }
        if (content.length > 0) {
            put(content);
        }
        buff.push(";");
        var template = buff.join(""), out = {out:"with(_VIEW) { with (_CONTEXT) {" + template + " " + finishTxt + "}}"};
        myEval.call(out, "this.fn = (function(_CONTEXT,_VIEW){" + out.out + "});\r\n//@ sourceURL=" + name + ".js");
        return out;
    };
    EJS.Helpers = function (data, extras) {
        this._data = data;
        this._extras = extras;
        extend(this, extras);
    };
    EJS.Helpers.prototype = {view:function (url, data, helpers) {
        return $View(url, data || this._data, helpers || this._extras);
    }, list:function (list, cb) {
        list.attr("length");
        for (var i = 0, len = list.length; i < len; i++) {
            cb(list[i], i, list);
        }
    }};
    can.view.register({suffix:"ejs", script:function (id, src) {
        return "can.EJS(function(_CONTEXT,_VIEW) { " + new EJS({text:src, name:id}).template.out + " })";
    }, renderer:function (id, text) {
        return EJS({text:text, name:id});
    }});})(can = {}, this )