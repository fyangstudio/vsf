var fs = require('fs');
var _ = require('./util');
var path = require('path');
var macro = require('./macro');
var server = require('./server');
var Freemarker = require('freemarker.js');

function vsf(configPath, charset) {

    charset = charset || 'utf-8';

    var config = _.jsonFileValue(configPath, charset);
    var root = _.jsonFileValue(config.root, charset);
    if (!config || !root) {
        _.msg('It must be a vs-config.json and a root config file(json best)!');
        return false;
    }

    for (var key in config) {
        var item = config[key];
        if (Array.isArray(item)) {
            item.forEach((item) => {
                if (!!item.data) item.data = (typeof item.data === 'string' ? _.jsonFileValue(item.data, charset) : item.data);
                if (!!item.input) item.input = (typeof item.input === 'string' ? _.jsonFileValue(item.input, charset) : item.input);
                if (!!item.input) item.output = (typeof item.output === 'string' ? _.jsonFileValue(item.output, charset) : item.output);
            })
        }
    }

    Object.assign(config, _.extend(root, {
        port: 8080,
        rootFm: './',
        rootRes: './'
    }));
    delete config.root;

    var rootFm = path.join(path.dirname(configPath), config.rootFm);
    var rootRes = path.join(path.dirname(configPath), config.rootRes);
    var cookies = config.cookies ? _.o2s(config.cookies, '<br/>').split('<br/>') : false;
    var setCookie = !!cookies;
    var fm = new Freemarker({viewRoot: rootFm});

    server.start(charset, function (pathname, urlObj, response, postData) {
        var result = '404';
        var item_fm = (config['freeMarker'] || []).find(item => item.url == pathname);
        var item_gt = (config['GET'] || []).find(item => item.url == pathname);

        function searchFail(path, response) {
            _.msg('File not found: ' + path);
            _.writeHead(response, 404);
            response.end('404');
        };

        if (setCookie) {
            response.setHeader('Set-Cookie', cookies);
            setCookie = false;
        }

        if (!postData) {
            if (item_fm) {
                _.writeHead(response, 200, 'text/html');
                fm.render(item_fm.path, item_fm.data, function (err, html) {
                    if (err) {
                        console.log(err);
                        result = '模板渲染失败，可能原因：1.语法错误，2.数据未定义'
                    }
                    else result = html;
                    response.end(result);
                });
            } else if (item_gt) {
                var _query = _.s2o(urlObj.query, '&');
                for (var param in item_gt.input) {
                    if (_query[param] === undefined) {
                        _.writeHead(response, 400);
                        response.end('参数异常');
                    }
                }
                _.writeHead(response, 200, 'application/json');
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
                                response.setHeader('Content-Length', data.length);
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
            var item_pt = (config['POST'] || []).find(item => item.url == pathname);
            if (item_pt) {
                for (var param in item_pt.input) {
                    if (postData[param] === undefined) {
                        _.writeHead(response, 400);
                        response.end('参数异常');
                    }
                }
                _.writeHead(response, 200, 'application/json');
                response.end(JSON.stringify(item_pt.output));
            } else {
                searchFail(pathname, response);
            }
        }
    }, config.port);

}
module.exports = vsf;