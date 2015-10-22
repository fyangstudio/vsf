var fs = require("fs");
var _ = require("./util");
var path = require("path");
var server = require("./server");
var Freemarker = require("freemarker.js");

function vsf(options) {

    this.options = _.extend(options, {
        port: 8080,
        configPath: ''
    });

    var target = this.options.configPath;
    fs.exists(target, function (exists) {
        if (exists) {
            var config = JSON.parse(fs.readFileSync(this.options.configPath, "utf-8"));
            var rootFm = path.join(path.dirname(target), config.rootFm || "");
            var rootRes = path.join(path.dirname(target), config.rootRes || "");
            var fm = new Freemarker({viewRoot: rootFm});

            server.start(function (pathname, urlObj, response, postData) {
                var result = '404';
                var item_fm = config["freeMarker"].find(item => item.url == pathname);
                var item_gt = config["GET"].find(item => item.url == pathname);
                function searchFail(path, response) {
                    console.log("File not found: " + path);
                    _.writeHead(response, 404);
                    response.end('404');
                };

                if (!postData) {
                    if (item_fm) {
                        _.writeHead(response, 200);
                        fm.render(item_fm.path, item_fm.data, function (err, html) {
                            if (err) {
                                console.log(err);
                                result = "模板渲染失败，可能原因：1.语法错误，2.数据未定义"
                            }
                            else result = html;
                            response.end(result);
                        });
                    } else if (item_gt) {
                        var _query = _.s2o(urlObj.query, "&");
                        for (var param in item_gt.input) {
                            if (!_query[param]) {
                                _.writeHead(response, 400);
                                response.end('参数异常');
                            }
                        }
                        _.writeHead(response, 200, "application/json");
                        response.end(JSON.stringify(item_gt.output));
                    } else {
                        var extname = path.extname(pathname);
                        var validExtensions = {
                            ".html": "text/html",
                            ".json": "application/json",
                            ".js": "application/javascript",
                            ".css": "text/css",
                            ".txt": "text/plain",
                            ".jpg": "image/jpeg",
                            ".gif": "image/gif",
                            ".png": "image/png"
                        };
                        var isValidExt = validExtensions[extname];

                        if (isValidExt) {
                            var _path = path.join(rootRes, pathname.substr(1));
                            fs.exists(_path, function (exists) {
                                if (exists) {
                                    fs.readFile(_path, function (err, data) {
                                        if (err) {
                                            console.log(err);
                                            searchFail(_path, response);
                                        } else {
                                            _.writeHead(response, 200, isValidExt);
                                            response.end(data.toString());
                                        }
                                    });

                                } else {
                                    searchFail(_path, response);
                                }
                            });
                        } else {
                            searchFail(pathname, response);
                        }
                    }
                } else {
                    var item_pt = config["POST"].find(item => item.url == pathname);
                    for (var param in item_pt.input) {
                        if (!postData[param]) {
                            _.writeHead(response, 400);
                            response.end('参数异常');
                        }
                    }
                    _.writeHead(response, 200, "application/json");
                    response.end(JSON.stringify(item_pt.output));
                }
            });

        } else {
            console.log("vsf: It must be a vs-config.json!");
        }
    });
}
module.exports = vsf;