var fs = require('fs');
var path = require('path');
var vsf = require('./vsf');

exports.run = function (args) {

    var argL = args.length;

    switch (argL) {
        case 1:
            var param = args[0];
            var stat = fs.lstatSync(param);

            if (stat.isDirectory()) vsf({configPath: path.join(param, './vs-config.json')});
            else if (stat.isFile() && path.basename(param, '.json') == 'vs-config') vsf({configPath: param});
            else console.log('vsf: param error!');

            break;
        default :
            console.log('vsf: param error!');

    }
};

