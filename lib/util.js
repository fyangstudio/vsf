var _ = {};

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