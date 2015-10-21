var fs = require("fs");
var url = require("url");
var http = require("http");
var querystring = require('querystring');

function start(route, port) {
    function onRequest(request, response) {
        var urlObj = url.parse(request.url);
        var pathname = urlObj.pathname;
        if (pathname == "/favicon.ico") return;
        console.log("Request for " + pathname + " received.");
        if (request.method == "GET") {
            route(pathname, urlObj, response);
        } else {
            var post = '';
            request.on('data', function (chunk) {
                post += chunk;
            });

            request.on('end', function () {
                post = querystring.parse(post);
                route(pathname, urlObj, response, post);
            });
        }
    }

    http.createServer(onRequest).listen(port || 8080);
    console.log("Server has started.");
}

exports.start = start;