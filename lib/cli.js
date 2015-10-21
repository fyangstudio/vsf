var fs = require('fs');
var path = require('path');
var vsF = require('./vs-f');

function callReload(_filePath) {

    try {
        vsF(_filePath);
    } catch (e) {
        console.log('vs-f: need a index.html');
    }
}

exports.run = function (args) {

    var argN = args.length;

    switch (argN) {
        case 0:
            callReload('./index.html');
            break;
        case 1:
            var param = args[0];
            var stat = fs.lstatSync(param);

            if (stat.isDirectory()) {

                callReload(path.join(param, '/index.html'));
            } else if (stat.isFile() && path.basename(param, '.html') == 'index') {

                callReload(param);
            } else {
                console.log('pplivereload: param error!');
            }
            break;
        default :
            console.log('vs-f: param error!');

    }

};

