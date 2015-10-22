//<![CDATA[
(function (_doc, _win, undefined) {

    // Empty function
    var _NOOP = function () {
    };

    // Error function
    var _ERROR = function (msg) {
        throw new Error(msg);
    };

    /* Type of
     ---------------------------------------------------------------------- */
    function _isType(type) {
        return function (obj) {
            return {}.toString.call(obj) == '[object ' + type + ']';
        }
    }

    /* Syntax fix
     ---------------------------------------------------------------------- */
    function _expand(o1, o2) {
        for (var i in o2) if (o1[i] === undefined) {
            o1[i] = o2[i]
        }
    }

    _expand(String.prototype, {
        // The trim() method removes whitespace from both ends of a string.
        trim: function () {
            return this.replace(/^\s+|\s+$/g, '');
        }
    });

    _expand(Function.prototype, {
        // The bind() method creates a new function that,
        // when called, has its this keyword set to the provided value,
        // with a given sequence of arguments preceding any provided when the new function is called.
        bind: function (oThis) {
            if (!$m.$isFunction(this)) return;
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fBound = function () {
                    return fToBind.apply(this instanceof _NOOP && oThis ? this : oThis || _win,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            _NOOP.prototype = this.prototype;
            fBound.prototype = new _NOOP();
            return fBound;
        }
    });

    _expand(Array.prototype, {
        // The forEach() method executes a provided function once per array element.
        forEach: function forEach(callback, thisArg) {
            var T, k = 0;
            if (this == null || !$m.$isFunction(callback)) return;

            var O = Object(this);
            var len = O.length >>> 0;
            if (thisArg) T = thisArg;

            while (k < len) {
                var kValue;
                if (Object.prototype.hasOwnProperty.call(O, k)) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }
                k++;
            }
        },
        // The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.
        indexOf: function (element, fromIndex) {
            var len = this.length;
            if (len) {
                // Init search position flag
                var i = fromIndex ? fromIndex < 0 ? Math.max(0, len + fromIndex) : fromIndex : 0;

                for (; i < len; i++) {
                    // Skip accessing in sparse arrays
                    if (i in this && this[i] === element) {
                        return i;
                    }
                }
            }
            return -1;
        }
    });

    // The Object.keys() method returns an array of a given object's own enumerable properties.
    if (!Object.keys) {
        Object.keys = (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && !$m.$isFunction(obj) || obj === null) return;

                var result = [];
                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) result.push(prop);
                }
                if (hasDontEnumBug) {
                    for (var i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                    }
                }
                return result;
            }
        })()
    }

    if (!_win.JSON) {
        var _json = {};
        // The JSON object contains methods for parsing JavaScript Object Notation (JSON) and converting values to JSON.
        // It can't be called or constructed, and aside from its two method properties it has no interesting functionality of its own.
        _json.parse = function (json) {
            if (json === null) return json;
            if ($m.$isString(json)) {
                json = json.trim();
                if (json) return ( new Function('return ' + json) )();
            }
            _ERROR('Invalid JSON: ' + json);
        };
        // The JSON.stringify() method converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is specified,
        // or optionally including only the specified properties if a replacer array is specified.
        _json.stringify = function (obj) {
            if (typeof (obj) != 'object' || obj === null) {
                if ($m.$isString(obj)) obj = '"' + obj + '"';
                return String(obj);
            } else {
                var json = [], arr = $m.$isArray(obj), stringify = arguments.callee;
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var v = obj[key];
                        if ($m.$isString(v)) v = '"' + v + '"';
                        else if (typeof (v) == "object" && v !== null) v = stringify(v);
                        json.push((arr ? '' : '"' + key + '":') + String(v));
                    }
                }
                return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}');
            }
        };
        _win.JSON = _json;
    }


    var _ = {};

    // The $m.$isXXX() method returns true if an object is an XXX, false if it is not.
    _.$isArray = Array.isArray || _isType('Array');
    _.$isDate = _isType('Date');
    _.$isRegExp = _isType('RegExp');
    _.$isObject = _isType('Object');
    _.$isString = _isType('String');
    _.$isFunction = _isType('Function');

    // The $m.$forIn() statement iterates over the enumerable properties of an object, in arbitrary order.
    _.$forIn = function (obj, callback, thisArg) {
        if (!obj || !callback) return null;
        var _keys = Object.keys(obj);
        for (var i = 0, l = _keys.length, _key, _ret; i < l; i++) {
            _key = _keys[i];
            _ret = callback.call(
                thisArg || null,
                obj[_key], _key, obj
            );
            if (!!_ret) return _key;
        }
        return null;
    };
    // Object to string
    _.$o2s = function (object, split, encode) {
        if (typeof (object) != 'object' || object === null) return JSON.stringify(object);

        var _arr = [];
        this.$forIn(object, function (value, key) {
            if (this.$isFunction(value)) return;
            value = JSON.stringify(value);

            if (!!encode) value = encodeURIComponent(value);
            _arr.push(encodeURIComponent(key) + '=' + value);
        }.bind(this));
        return _arr.join(split || ',');
    };

    /* request
     ---------------------------------------------------------------------- */
    var _ajaxHandler = function () {
    };
    _ajaxHandler.prototype = {
        _request: function (config) {
            if (!!config.url) {
                var
                    _headers = config.headers || {},                            // set request header
                    _method = (config.method || 'GET').toLowerCase(),           // method
                    _url = config.url,                                          // url
                    _data = config.data || null,                                // send data
                    _dataType = (config.dataType || 'JSON').toLowerCase(),      // request data type
                    _success = config.success || _NOOP,                         // request success callback
                    _error = config.error || _NOOP,                             // request fail callback
                    _xhr = this._createXhrObject();                             // XMLHttpRequest
                // data to string
                var _d2s = function (data) {
                    return _.$o2s(data, '&').replace(/^"|"$/g, '');
                };

                if (_data != null) {
                    _data = _d2s(_data);
                    if (_method == 'get') {
                        _url += ('?' + _data);
                        _data = null;
                    }
                }
                // On xhr ready state change
                _xhr.onreadystatechange = function () {
                    if (_xhr.readyState !== 4) return;
                    var _responseData = _dataType == 'json' ? JSON.parse(_xhr.responseText) : _xhr.responseText;
                    (_xhr.status === 200) ? _success(_responseData) : _error(_xhr);
                };
                _xhr.open(_method, _url, true);
                // Set request header
                try {
                    _.$forIn(_headers, function (value, header) {
                        if (_method == 'post' && _data != null && /form/i.test(value)) _data = _d2s(_data);
                        _xhr.setRequestHeader(header, value);
                    })
                } catch (err) {
                    // ignore
                }
                _xhr.send(_data);
            }
        },
        _createXhrObject: function () {
            // Create Xhr Object
            var _methods = [
                function () {
                    return new XMLHttpRequest();
                },
                function () {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                },
                function () {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            ];
            for (var i = 0, l = _methods.length; i < l; i++) {
                try {
                    _methods[i]();
                } catch (e) {
                    continue;
                }
                this._createXhrObject = _methods[i];
                return _methods[i]();
            }
            _ERROR('$ajax: Could not create an XHR object!');
        }
    };

    // The $m.$ajax() method perform an asynchronous HTTP request.
    _win.$ajax = function (config) {
        if (_.$isObject(config)) return new _ajaxHandler()._request(config);
        else _ERROR('$ajax: Parameter error');
    };

})
(document, window);
//]]>