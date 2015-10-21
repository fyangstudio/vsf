var _ = {};

_.extend = function (o1, o2, override) {
    for (var item in o2) {
        if (item.charAt(0) === '_') continue;
        if (o1[item] == null || override) o1[item] = o2[item];
    }
    return o1;
};

module.exports = _;