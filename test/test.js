var fs = require("fs");
var _ = require("../lib/util");
var path = require("path");
var server = require("../lib/server");
var Freemarker = require("freemarker.js");

function vsf(options) {

    var configPath = "vs-config.json";
    fs.exists(configPath, function (exists) {
        if (exists) {
            var config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
            var root = path.join(__dirname, config.root || "");
            var fm = new Freemarker({viewRoot: root});

            server.start(function (pathname, response) {
                var result = '404';
                var item_fm = config["freeMarker"].find(item => item.url == pathname);
                var item_gt = config["GET"].find(item => item.url == pathname);

                if(item_fm){
                    response.writeHead(200, {"Content-Type": "text/plain"});
                    result = fm.renderSync(item_fm.path, item_fm.data);
                }

                response.end(result);
            });

        } else {
            console.log("vs-f: It must be a vs-config.json!");
        }
    });
}
vsf();
module.exports = vsf;