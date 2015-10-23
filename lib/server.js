var fs = require("fs");
var url = require("url");
var http = require("http");
var querystring = require('querystring');

function start(charset, route, port) {
    function onRequest(request, response) {
        var urlObj = url.parse(request.url);
        var pathname = urlObj.pathname;
        if (pathname == "/favicon.ico") return;
        console.log("Request for " + pathname + " received.");

        if (request.method == "GET") {
            route(pathname, urlObj, response);
        } else {
            var post = '';
            var isJson = (request.headers.accept === 'application/json');

            request.setEncoding(charset);
            request.on('data', function (chunk) {
                isJson ? post = chunk : post += (chunk.toString());
            });

            request.on('end', function () {
                post = isJson ? JSON.parse(post) : querystring.parse(post);
                route(pathname, urlObj, response, post);
            });
        }
    }

    http.createServer(onRequest).listen(port || 8080);
    console.log("Server has started.");
}

exports.start = start;