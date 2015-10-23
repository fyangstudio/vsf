var fs = require("fs");
var _ = require("./util");
var path = require("path");
var macro = require("./macro");
var server = require("./server");
var Freemarker = require("freemarker.js");

function vsf(options) {

    this.options = _.extend(options, {
        port: 8080,
        charset: "utf-8",
        configPath: ''
    });

    var target = this.options.configPath;
    fs.exists(target, function (exists) {
        if (exists) {
            var config = JSON.parse(fs.readFileSync(this.options.configPath, this.options.charset));
            var rootFm = path.join(path.dirname(target), config.rootFm || "");
            var rootRes = path.join(path.dirname(target), config.rootRes || "");
            var cookies = config.cookies ? _.o2s(config.cookies, "<%>").split("<%>") : false;
            var setCookie = !!cookies;
            var fm = new Freemarker({viewRoot: rootFm});

            server.start(this.options.charset, function (pathname, urlObj, response, postData) {
                var result = '404';
                var item_fm = (config["freeMarker"] || []).find(item => item.url == pathname);
                var item_gt = (config["GET"] || []).find(item => item.url == pathname);
                function searchFail(path, response) {
                    console.log("File not found: " + path);
                    _.writeHead(response, 404);
                    response.end('404');
                };

                if (setCookie) {
                    response.setHeader("Set-Cookie", cookies);
                    setCookie = false;
                }

                if (!postData) {
                    if (item_fm) {
                        _.writeHead(response, 200, "text/html");
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
                            if (_query[param] === undefined) {
                                _.writeHead(response, 400);
                                response.end('参数异常');
                            }
                        }
                        _.writeHead(response, 200, "application/json");
                        response.end(JSON.stringify(item_gt.output));
                    } else {
                        var extname = path.extname(pathname);
                        var validExtensions = macro.types;
                        var isValidExt = validExtensions[extname];
                        var _path = path.join(rootRes, pathname.substr(1));

                        fs.exists(_path, function (exists) {
                            if (exists) {
                                fs.readFile(_path, function (err, data) {
                                    if (err) {
                                        console.log(err);
                                        searchFail(_path, response);
                                    } else {
                                        response.setHeader("Content-Length", data.length);
                                        _.writeHead(response, 200, isValidExt);
                                        response.end(data);
                                    }
                                });

                            } else {
                                searchFail(_path, response);
                            }
                        });
                    }
                } else {
                    var item_pt = (config["POST"] || []).find(item => item.url == pathname);
                    if (item_pt) {
                        for (var param in item_pt.input) {
                            if (postData[param] === undefined) {
                                _.writeHead(response, 400);
                                response.end('参数异常');
                            }
                        }
                        _.writeHead(response, 200, "application/json");
                        response.end(JSON.stringify(item_pt.output));
                    } else {
                        searchFail(pathname, response);
                    }
                }
            }, this.options.port);

        } else {
            console.log("vsf: It must be a vs-config.json!");
        }
    });
}
module.exports = vsf;