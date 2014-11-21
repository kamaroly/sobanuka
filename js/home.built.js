(function e(h, j, l) {
    function m(a, c) {
        if (!j[a]) {
            if (!h[a]) {
                var d = typeof require == "function" && require;
                if (!c && d) {
                    return d(a, !0)
                }
                if (i) {
                    return i(a, !0)
                }
                throw new Error("Cannot find module '" + a + "'")
            }
            var b = j[a] = {
                exports: {}
            };
            h[a][0].call(b.exports, function(g) {
                var f = h[a][1][g];
                return m(f ? f : g)
            }, b, b.exports, e, h, j, l)
        }
        return j[a].exports
    }
    var i = typeof require == "function" && require;
    for (var k = 0; k < l.length; k++) {
        m(l[k])
    }
    return m
})({
    1: [function(d, g, f) {
        g.exports = d("./ac-promomanager/PromoManager")
    }, {
        "./ac-promomanager/PromoManager": 2
    }],
    2: [function(s, u, q) {
        var w = s("ac-base").Array;
        var o = s("ac-base").Class;
        var y = s("ac-base").Element;
        var r = s("ac-base").Log;
        var t = s("ac-base").Object;
        var v = s("ac-storage");
        var x = s("./PromoManager/History");
        var n = s("./PromoManager/Promo");
        var p = new o({
            __defaultOptions: {
                prefixString: "pm-",
                appendLocale: true,
                rotate: false,
                rotateInterval: 3000,
                rotateAnimation: true
            },
            initialize: function(b, a, c) {
                if (v === undefined) {
                    throw "AC.PromoManager requires that AC.Storage exists on page."
                }
                this._options = t.extend(t.clone(this.__defaultOptions), c || {});
                this._history = null;
                this._storageName = null;
                this._promos = null;
                this._currentPromo = -1;
                this._delegate = {};
                t.synthesize(this);
                this.setStorageName(b);
                var d = this.setPromos(a);
                if (d.length < 2) {
                    return null
                }
                this.__weightPromos();
                this.__selectFirstPromo();
                if (this._options.rotate) {
                    window.setInterval(function() {
                        this.selectNextPromo(this._options.rotateAnimation)
                    }.bind(this), this._options.rotateInterval)
                }
                p.instances.push(this)
            },
            selectPromo: function(c, b) {
                var a = this.promos();
                b = !!b;
                if (a[c]) {
                    if (a[this.currentPromo()]) {
                        a[this.currentPromo()].hide(b)
                    }
                    a[c].show(b);
                    this.setCurrentPromo(c);
                    this.history().add(c)
                }
            },
            selectNextPromo: function(a) {
                var b = this.currentPromo() + 1;
                if (b >= this.promos().length) {
                    b = 0
                }
                this.selectPromo(b, a)
            },
            currentPromoElement: function() {
                return this.promos()[this.currentPromo()]._promo
            },
            __selectFirstPromo: function() {
                var c = -1;
                var a = this.promos();
                var b = this.history().data();
                a.forEach(function(f, d) {
                    if ((d !== b[0]) && ((c === -1) || (f.weight() > a[c].weight()))) {
                        c = d
                    }
                });
                this.selectPromo(c, false)
            },
            __lowestWeight: function() {
                var a = 1;
                this.promos().forEach(function(c) {
                    var b = c.weight();
                    if (b < a) {
                        a = b
                    }
                });
                return a
            },
            __weightPromos: function() {
                var a = [];
                var c = 0;
                var b = 0;
                this.promos().forEach(function(f) {
                    var d = f.weight();
                    if (typeof d !== "number" || d <= 0) {
                        a.push(f)
                    } else {
                        c += d
                    }
                    if (c > 1) {
                        new r("Promo weighting total is > 100%.")
                    }
                });
                if (a.length > 0) {
                    b = ((1 - c) / a.length);
                    a.forEach(function(d) {
                        d.setWeight(b)
                    })
                }
                this.__loadHistory(this.storageName());
                this.__historicallyWeightPromos()
            },
            __loadHistory: function(b) {
                var d;
                var a;
                if (!this.promos()) {
                    throw "Cannot load history until we know how many promos there are."
                }
                d = Math.floor(1 / (this.__lowestWeight() || 1)) - 1;
                a = new x(b, d);
                var c = a.load();
                this.setHistory(a);
                return c
            },
            __historicallyWeightPromos: function() {
                var a = this.promos();
                var b = this.history().data();
                var c = (1 / b.length) * -1;
                b.forEach(function(d) {
                    if (a[d] !== undefined) {
                        a[d].offsetWeight(c)
                    }
                })
            },
            setStorageName: function(a) {
                if (typeof this._storageName === "string") {
                    throw "Storage name cannot change after it is set."
                }
                this._storageName = this.options().prefixString + a;
                if (this.options().appendLocale === true) {
                    this._storageName += "-" + window.document.documentElement.getAttribute("lang")
                }
                return this._storageName
            },
            setHistory: function(a) {
                if (a === undefined) {
                    throw "Cannot set PromoManager history to undefined."
                }
                if (this._history !== null) {
                    throw "Cannot set PromoManager history more than once for the same Promo Slot."
                }
                this._history = a;
                return this._history
            },
            setPromos: function(a) {
                if (this._promos !== null) {
                    throw "Cannot set promos more than once for the same Promo Slot."
                }
                var b = this;
                b._promos = [];
                a = (typeof a === "string") ? y.selectAll("." + a) : w.toArray(a);
                if (a.length < 2) {
                    return b._promos
                }
                a.forEach(function(c) {
                    b._promos.push(n.promoFromElementOrObject(c))
                });
                return b._promos
            },
            setCurrentPromo: function(a) {
                if (typeof a === "number" && this.promos()[a] !== undefined) {
                    this._currentPromo = a
                }
                return this._currentPromo
            }
        });
        p.instances = [];
        u.exports = p
    }, {
        "./PromoManager/History": 3,
        "./PromoManager/Promo": 4,
        "ac-base": false,
        "ac-storage": 5
    }],
    3: [function(l, k, h) {
        var i = l("ac-base").Object;
        var m = l("ac-storage");
        var j = function(a, c, b) {
            this._data = [];
            i.synthesize(this);
            this.__key = a;
            this.__maxLength = c || 1;
            this.__expiration = b || 30
        };
        j.prototype = {
            add: function(b) {
                var a = this.data();
                a = [b].concat(a);
                this.setData(a);
                this.save();
                return this.data()
            },
            save: function() {
                var a = this.data();
                var b = this.__key;
                var c = this.__expiration;
                if (typeof b === "string") {
                    m.setItem(b, a, c)
                }
            },
            load: function() {
                if (typeof this.__key === "string") {
                    var a = m.getItem(this.__key);
                    if (a) {
                        return this.setData(a)
                    }
                }
            },
            setData: function(a) {
                if (Array.isArray(a)) {
                    if (a.length > this.__maxLength) {
                        a = a.slice(0, this.__maxLength)
                    }
                    this._data = a
                }
                return this._data
            }
        };
        k.exports = j
    }, {
        "ac-base": false,
        "ac-storage": 5
    }],
    4: [function(q, s, o) {
        var t = q("ac-base").EasingFunctions;
        var u = q("ac-base").Element;
        var m = q("ac-base").Environment;
        var l = q("ac-base").Function;
        var r = q("ac-base").Object;
        var p = q("ac-base").String;
        var n = function(a, c, b) {
            if (!u.isElement(a)) {
                throw "AC.PromoManager.Promo require Element Node as first argument."
            }
            this._options = r.extend(r.clone(this.__defaultOptions), b || {});
            this._promo = a;
            this._weight = 0;
            r.synthesize(this);
            this.setWeight(c || 0);
            if (this.options().hideOnInit === true) {
                this.hide()
            }
        };
        n.prototype = {
            __defaultOptions: {
                hideOnInit: true,
                animationDuration: 0.4,
                animationTimingFunction: "ease-out",
                animationZIndex: 1000
            },
            offsetWeight: function(a) {
                if (!isNaN(a)) {
                    this.setWeight(this.weight() + a)
                }
                return this.weight()
            },
            show: function(a) {
                if (!a) {
                    u.setStyle(this.promo(), {
                        display: "block"
                    })
                } else {
                    this.__animate(1)
                }
            },
            hide: function(a) {
                if (!a) {
                    u.setStyle(this.promo(), {
                        display: "none"
                    })
                } else {
                    this.__animate(0)
                }
            },
            __animate: function(a) {
                var b = this.promo();
                var c = u.getStyle(b, "z-index") || "auto";
                var f = this.options().animationZIndex;
                var d = function() {
                    u.setStyle(b, {
                        "z-index": c
                    });
                    if (a === 0) {
                        u.setStyle(b, {
                            display: "none"
                        })
                    }
                };
                if (a > 0) {
                    u.setStyle(b, {
                        display: "block"
                    })
                }
                u.setStyle(b, {
                    "z-index": f
                });
                if (m.Feature.cssPropertyAvailable("transition")) {
                    this.__animateWithCSS(a, d)
                } else {
                    this.__animateWithJS(a, d)
                }
            },
            __animateWithCSS: function(a, c) {
                var b = this.promo();
                var d;
                u.setVendorPrefixStyle(b, "transition", "opacity " + this.options().animationDuration + "s " + this.options().animationTimingFunction);
                u.setStyle(b, {
                    opacity: 0
                });
                d = function(f) {
                    if (f.target === b && f.propertyName === "opacity") {
                        c();
                        u.removeVendorPrefixEventListener(b, "transitionEnd", d)
                    }
                };
                u.addVendorPrefixEventListener(b, "transitionEnd", d)
            },
            __animateWithJS: function(g, c) {
                var a = this.promo();
                var d = p.toCamelCase(this.options().animationTimingFunction);
                var f;
                if ((d === "easeOut") || (d === "easein") || (d === "easeinOut")) {
                    d += "Quad"
                }
                f = t[d];
                var b = function(h) {
                    if (g === 0) {
                        h = (1 - h)
                    }
                    if (typeof f === "function") {
                        h = f(h, 0, 1, 1)
                    }
                    u.setStyle(a, {
                        opacity: h
                    })
                };
                l.iterateFramesOverAnimationDuration(b, this.options().animationDuration, c)
            },
            setWeight: function(a) {
                if (!isNaN(a)) {
                    this._weight = a
                }
                return this._weight
            }
        };
        n.promoFromElementOrObject = function(a) {
            if (u.isElement(a)) {
                return n.promoFromElement(a)
            } else {
                return n.promoFromObject(a)
            }
        };
        n.promoFromElement = function(a) {
            if (!u.isElement(a)) {
                throw "Promo is not an element."
            }
            var b = new n(a);
            return b
        };
        n.promoFromObject = function(a) {
            if (a === undefined || !u.isElement(a.promo)) {
                throw "Promo object not formatted as expected."
            }
            var b = new n(a.promo, a.weight);
            return b
        };
        s.exports = n
    }, {
        "ac-base": false
    }],
    5: [function(p, n, k) {
        var m = "ac-storage-";
        var q = p("./ac-storage/Item");
        var l = p("./ac-storage/Storage");
        var j = p("./ac-storage/Storage/storageAvailable");
        var o = new l(m);
        o.Item = q;
        o.storageAvailable = j;
        n.exports = o
    }, {
        "./ac-storage/Item": 6,
        "./ac-storage/Storage": 13,
        "./ac-storage/Storage/storageAvailable": 15
    }],
    6: [function(t, v, o) {
        var w = t("ac-base").adler32;
        var p = t("ac-base").Object;
        var n = t("./Item/apis");
        var u = t("./Item/createExpirationDate");
        var m = t("./Item/encoder");
        var q = 1000 * 60 * 60 * 24;
        var r = 30;

        function s(a) {
            if (!a || typeof a !== "string") {
                throw "ac-storage/Item: Key for Item must be a string"
            }
            this._key = a;
            this._checksum = null;
            this._expirationDate = null;
            this._metadata = null;
            this._value = null;
            p.synthesize(this);
            this.setExpirationDate(s.createExpirationDate(r))
        }
        s.prototype = {
            save: function() {
                var c;
                var d;
                var b;
                var a = {};
                c = n.best(a);
                if (c) {
                    if (this.value() === null && typeof c.removeItem === "function") {
                        return c.removeItem(this.key())
                    } else {
                        if (typeof c.setItem === "function") {
                            d = this.__state();
                            b = m.encode(d);
                            return c.setItem(this.key(), b, this.expirationDate())
                        }
                    }
                }
                return false
            },
            load: function() {
                var a;
                var b;
                a = n.best();
                if (a && typeof a.getItem === "function") {
                    b = a.getItem(this.key());
                    this.__updateState(m.decode(b));
                    if (b === null || this.hasExpired()) {
                        this.remove();
                        return false
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            },
            remove: function() {
                var a;
                this.__updateState(null);
                a = n.best();
                return a.removeItem(this.key())
            },
            hasExpired: function(a) {
                if (((this.expirationDate() !== false) && (this.expirationDate() <= Date.now())) || !this.__checksumIsValid(a)) {
                    return true
                }
                return false
            },
            value: function(a) {
                if (this.hasExpired(a)) {
                    this.remove()
                }
                return this._value
            },
            setChecksum: function(a) {
                if (a === null) {
                    this._checksum = a
                } else {
                    if (typeof a === "string" && a !== "") {
                        this._checksum = w(a)
                    } else {
                        throw "ac-storage/Item#setChecksum: Checksum must be null or a string"
                    }
                }
            },
            setExpirationDate: function(a) {
                if (a === null) {
                    a = s.createExpirationDate(r)
                }
                if (a !== false) {
                    if (typeof a === "string") {
                        a = new Date(a).getTime()
                    }
                    if (a && typeof a.getTime === "function") {
                        a = a.getTime()
                    }
                    if (!a || isNaN(a)) {
                        throw "ac-storage/Item: Invalid date object provided as expirationDate"
                    }
                    a -= a % q;
                    if (a <= Date.now()) {
                        a = false
                    }
                }
                this._expirationDate = a
            },
            __state: function() {
                var a = {};
                a.checksum = this.checksum();
                a.expirationDate = this.expirationDate();
                a.metadata = this.metadata();
                a.value = this.value();
                return a
            },
            __updateState: function(a) {
                var b;
                var c;
                if (a === null) {
                    a = {
                        checksum: null,
                        expirationDate: null,
                        metadata: null,
                        value: null
                    }
                }
                for (b in a) {
                    c = "set" + b.charAt(0).toUpperCase() + b.slice(1);
                    if (typeof this[c] === "function") {
                        this[c](a[b])
                    }
                }
            },
            __checksumIsValid: function(a) {
                if (a) {
                    a = w(a);
                    if (!this.checksum()) {
                        throw "ac-storage/Item: No checksum exists to determine if this Item’s value is valid. Try loading context from persistent storage first."
                    } else {
                        if (a === this.checksum()) {
                            return true
                        }
                    }
                    return false
                } else {
                    if (this.checksum()) {
                        throw "ac-storage/Item: No checksum passed, but checksum exists in Item’s state."
                    }
                }
                return true
            },
            setKey: function() {
                throw "ac-storage/Item: Cannot set key after synthesizing"
            }
        };
        s.createExpirationDate = u;
        v.exports = s
    }, {
        "./Item/apis": 7,
        "./Item/createExpirationDate": 10,
        "./Item/encoder": 11,
        "ac-base": false
    }],
    7: [function(n, l, i) {
        var k = n("ac-base").log;
        var o = n("./apis/localStorage");
        var j = n("./apis/userData");
        var m = {
            _list: [o, j],
            list: function() {
                return this._list
            },
            all: function(a) {
                k("ac-storage/Item/apis.all: Method is deprecated");
                var c = Array.prototype.slice.call(arguments, 1);
                if (typeof a !== "string") {
                    throw "ac-storage/Item/apis.all: Method name must be provided as a string"
                }
                var b = this.list().map(function(d) {
                    if (d.available()) {
                        if (typeof d[a] === "function") {
                            return d[a].apply(d, c)
                        } else {
                            throw "ac-storage/Item/apis.all: Method not available on api"
                        }
                    }
                    return false
                });
                return b
            },
            best: function() {
                var a = null;
                this.list().some(function(b) {
                    if (b.available()) {
                        a = b;
                        return true
                    }
                });
                return a
            }
        };
        l.exports = m
    }, {
        "./apis/localStorage": 8,
        "./apis/userData": 9,
        "ac-base": false
    }],
    8: [function(p, o, j) {
        var k = p("ac-base").Environment.Feature;
        var n = window.localStorage;
        var l = window.sessionStorage;
        var m;
        var q = {
            name: "localStorage",
            available: function() {
                if (m === undefined) {
                    m = k.localStorageAvailable()
                }
                return m
            },
            getItem: function(a) {
                return n.getItem(a) || l.getItem(a)
            },
            setItem: function(b, a, c) {
                if (c === false) {
                    l.setItem(b, a)
                } else {
                    n.setItem(b, a)
                }
                return true
            },
            removeItem: function(a) {
                n.removeItem(a);
                l.removeItem(a);
                return true
            }
        };
        o.exports = q
    }, {
        "ac-base": false
    }],
    9: [function(p, o, q) {
        var n = p("ac-base").Element;
        var l = 1000 * 60 * 60 * 24;
        var k = "ac-storage";
        var m;
        var j = {
            name: "userData",
            available: function() {
                if (m === undefined) {
                    m = false;
                    if (document && document.body) {
                        var a = this.element();
                        if (n.isElement(a) && a.addBehavior !== undefined) {
                            m = true
                        }
                        if (m === false) {
                            this.removeElement()
                        }
                    } else {
                        throw "ac-storage/Item/apis/userData: DOM must be ready before using #userData."
                    }
                }
                return m
            },
            getItem: function(b) {
                var a = this.element();
                a.load(k);
                return a.getAttribute(b) || null
            },
            setItem: function(c, a, d) {
                var b = this.element();
                b.setAttribute(c, a);
                if (d === false) {
                    d = new Date(Date.now() + l)
                }
                if (d && typeof d.toUTCString === "function") {
                    b.expires = d.toUTCString()
                }
                b.save(k);
                return true
            },
            removeItem: function(b) {
                var a = this.element();
                a.removeAttribute(b);
                a.save(k);
                return true
            },
            _element: null,
            element: function() {
                if (this._element === null) {
                    this._element = document.createElement("meta");
                    this._element.setAttribute("id", "userData");
                    this._element.setAttribute("name", "ac-storage");
                    this._element.style.behavior = "url('#default#userData')";
                    document.getElementsByTagName("head")[0].appendChild(this._element)
                }
                return this._element
            },
            removeElement: function() {
                if (this._element !== null) {
                    n.remove(this._element)
                }
                return this._element
            }
        };
        o.exports = j
    }, {
        "ac-base": false
    }],
    10: [function(g, k, h) {
        var i = 1000 * 60 * 60 * 24;
        var j = function(a, b) {
            if (typeof a !== "number") {
                throw "ac-storage/Item/createExpirationDate: days parameter must be a number."
            }
            if (b === undefined || typeof b === "number") {
                b = b === undefined ? new Date() : new Date(b)
            }
            if (typeof b.toUTCString !== "function" || b.toUTCString() === "Invalid Date") {
                throw "ac-storage/Item/createExpirationDate: fromDate must be a date object, timestamp, or undefined."
            }
            b.setTime(b.getTime() + (a * i));
            return b.getTime()
        };
        k.exports = j
    }, {}],
    11: [function(g, k, h) {
        var i = g("./encoder/compressor");
        var j = {
            encode: function(b) {
                var d;
                var c;
                c = i.compress(b);
                try {
                    d = JSON.stringify(c)
                } catch (a) {}
                if (!this.__isValidStateObjString(d)) {
                    throw "ac-storage/Item/encoder/encode: state object is invalid or cannot be saved as string"
                }
                return d
            },
            decode: function(d) {
                var c;
                var b;
                if (!this.__isValidStateObjString(d)) {
                    if (d === undefined || d === null || d === "") {
                        return null
                    }
                    throw "ac-storage/Item/encoder/decode: state string does not contain a valid state object"
                }
                try {
                    c = JSON.parse(d)
                } catch (a) {
                    throw "ac-storage/Item/encoder/decode: Item state object could not be decoded"
                }
                b = i.decompress(c);
                return b
            },
            __isValidStateObjString: function(b) {
                try {
                    if (b !== undefined && b.substring(0, 1) === "{") {
                        return true
                    }
                    return false
                } catch (a) {
                    return false
                }
            }
        };
        k.exports = j
    }, {
        "./encoder/compressor": 12
    }],
    12: [function(h, m, i) {
        var j = 1000 * 60 * 60 * 24;
        var l = 14975;
        var k = {
            mapping: {
                key: "k",
                checksum: "c",
                expirationDate: "e",
                metadata: "m",
                value: "v"
            },
            compress: function(c) {
                var f = {};
                var d = k.mapping;
                for (var a in d) {
                    if (c.hasOwnProperty(a) && c[a]) {
                        if (a === "expirationDate") {
                            var b = this.millisecondsToOffsetDays(c[a]);
                            f[d[a]] = b
                        } else {
                            f[d[a]] = c[a]
                        }
                    }
                }
                return f
            },
            decompress: function(f) {
                var b = {};
                var c = k.mapping;
                for (var a in c) {
                    if (f.hasOwnProperty(c[a])) {
                        if (a === "expirationDate") {
                            var d = this.offsetDaysToMilliseconds(f[c[a]]);
                            b[a] = d
                        } else {
                            b[a] = f[c[a]]
                        }
                    }
                }
                return b
            },
            millisecondsToOffsetDays: function(a) {
                return Math.floor(a / j) - l
            },
            offsetDaysToMilliseconds: function(a) {
                return (a + l) * j
            }
        };
        m.exports = k
    }, {}],
    13: [function(n, m, p) {
        var q = n("ac-base").Object;
        var o = n("./Item/apis/localStorage");
        var j = n("./Storage/registry");
        var k = {};

        function l(a, b) {
            this._namespace = a || "";
            this._options = q.extend(q.clone(k), b || {});
            q.synthesize(this)
        }
        l.prototype = {
            getItem: function(b) {
                var a = this.__item(b);
                a.load();
                return a.value()
            },
            setItem: function(c, a) {
                var b = this.__item(c);
                if (a === undefined) {
                    throw "ac-storage/Storage#setItem: Must provide value to set key to. Use #removeItem to remove."
                }
                b.setValue(a);
                return b.save()
            },
            removeItem: function(b) {
                var a = this.__item(b);
                j.remove(a.key(), true);
                return a.save()
            },
            removeExpired: function() {
                var g;
                var i;
                if (o.available()) {
                    for (i = 0; i < window.localStorage.length; i++) {
                        g = this.__item(window.localStorage.key(i));
                        if (g.hasExpired() && JSON.parse(window.localStorage[window.localStorage.key(i)]).v !== "undefined") {
                            g.remove()
                        }
                    }
                } else {
                    var b = "ac-storage";
                    var h = document.getElementById("userData");
                    h.load(b);
                    var c;
                    var f = h.xmlDocument;
                    var a = f.firstChild.attributes;
                    var d = a.length;
                    i = -1;
                    while (++i < d) {
                        c = a[i];
                        g = this.__item(c.nodeName);
                        if (g.hasExpired() && JSON.parse(c.nodeValue).v !== "undefined") {
                            g.remove()
                        }
                    }
                }
            },
            __item: function(b) {
                if (typeof b !== "string" || b === "") {
                    throw "ac-storage/Storage: Key must be a String."
                }
                var a = j.item(this.namespace() + b);
                return a
            }
        };
        m.exports = l
    }, {
        "./Item/apis/localStorage": 8,
        "./Storage/registry": 14,
        "ac-base": false
    }],
    14: [function(k, j, m) {
        var l = k("../Item");
        var h = {};
        var i = {
            item: function(b) {
                var a = h[b];
                if (!a) {
                    a = this.register(b)
                }
                return a
            },
            register: function(b) {
                var a = h[b];
                if (!a) {
                    a = new l(b);
                    h[b] = a
                }
                return a
            },
            clear: function(a) {
                var b;
                for (b in h) {
                    this.remove(b, a)
                }
                return true
            },
            remove: function(c, b) {
                var a = h[c];
                if (a && !!b) {
                    a.remove()
                }
                h[c] = null;
                return true
            }
        };
        j.exports = i
    }, {
        "../Item": 6
    }],
    15: [function(m, k, i) {
        var l = m("../Item/apis");
        var j;
        k.exports = function h() {
            if (j !== undefined) {
                return j
            }
            j = !!l.best();
            return j
        }
    }, {
        "../Item/apis": 7
    }],
    16: [function(i, o, j) {
        i("./globalNavDataClickShim.js");
        var k = i("ac-base").Element;
        var m = i("ac-analytics");

        function n() {
            var a = document.getElementById("promos");
            var b = k.selectAll("ul li a", a);
            b.forEach(function(c) {
                c.setAttribute("data-analytics-click", "prefix:p")
            })
        }

        function l(f) {
            var h;
            var d;
            var c;
            var a;
            var g = "analytics-promo-id";
            var b = {
                data: {
                    eVar44: window.innerHeight,
                    eVar43: "{PLATFORM}"
                }
            };
            n();
            new m.observer.Page(b);
            new m.observer.Click();
            new m.observer.Link()
        }
        o.exports = l
    }, {
        "./globalNavDataClickShim.js": 17,
        "ac-base": false
    }],
    17: [function(f, i, g) {
        var h = f("ac-base").Element;
        i.exports = (function() {
            var b = document.getElementById("globalheader");
            var a = h.selectAll("a", b);
            var c;
            a.forEach(function(d, k) {
                if (k > 0) {
                    c = "prefix:t,prop3:" + d.innerText || d.textContent;
                    d.setAttribute("data-analytics-click", c.trim())
                }
            })
        }())
    }, {
        "ac-base": false
    }],
    18: [function(p, o, q) {
        var l = p("ac-base").Element;
        var j = p("ac-promomanager");
        var k = p("./analytics/builder");
        var n = p("ac-analytics");
        var m = (function() {
            return {
                initialize: function() {
                    var a;
                    var f = document.getElementById("promos");
                    var g = (f ? f.getAttribute("data-promo-key") : null);
                    var c = (f ? f.getAttribute("data-promo-classes") : "").split(",");
                    var b, d;
                    if (g !== null && c[0] !== "") {
                        for (b = 0, d = c.length; b < d; b += 1) {
                            if (l.selectAll("." + c[b]).length > 1) {
                                a = new j(g + "-" + c[b], c[b])
                            }
                        }
                        k(j.instances)
                    } else {
                       //nothing
                    }
                    return this
                }
            }
        }());
        o.exports = m.initialize()
    }, {
        "./analytics/builder": 16,
        "ac-base": false,
        "ac-promomanager": 1
    }]
}, {}, [18]);