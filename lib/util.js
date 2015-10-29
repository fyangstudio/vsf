var _ = {};
var fs = require('fs');
var path = require('path');

_.msg = function (msg) {
    console.log(`vsf: ${msg}`);
};

_.jsonFileValue = function (filePath, charset) {
    if (fs.existsSync(filePath) && path.extname(filePath) === '.json') return JSON.parse(fs.readFileSync(filePath, charset));
    else this.msg(`Json file ${filePath} not exists!`);
    return false;
};

_.forIn = function (obj, callback, thisArg) {
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

_.s2o = function (string, split) {
    var _obj = {};
    var _arr = (string || '').split(split);
    _arr.forEach(function (name) {
        var _brr = name.split('=');
        if (!_brr || !_brr.length) return;
        var _key = _brr.shift();
        if (!_key) return;
        _obj[decodeURIComponent(_key)] = decodeURIComponent(_brr.join('='));
    });
    return _obj;
};

_.o2s = function (object, split, encode) {
    if (typeof (object) != 'object' || object === null) return JSON.stringify(object);

    var _arr = [];
    this.forIn(object, function (value, key) {
        if (typeof value == "Function") return;

        if (!!encode) value = encodeURIComponent(value);
        _arr.push(encodeURIComponent(key) + '=' + value);
    }.bind(this));
    return _arr.join(split || ',');
};

_.writeHead = function (response, status, type) {
    response.writeHead(status, {'Content-Type': type || 'text/html'});
};

_.extend = function (o1, o2, override) {
    for (var item in o2) {
        if (item.charAt(0) === '_') continue;
        if (o1[item] == null || override) o1[item] = o2[item];
    }
    return o1;
};

module.exports = _;